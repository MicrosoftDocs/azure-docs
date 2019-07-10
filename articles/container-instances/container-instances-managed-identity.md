---
title: Use a managed identity with Azure Container Instances
description: Learn how to use a managed identity to authenticate with other Azure services from Azure Container Instances.
services: container-instances
author: dlepow

ms.service: container-instances
ms.topic: article
ms.date: 10/22/2018
ms.author: danlep
ms.custom: 
---

# How to use managed identities with Azure Container Instances

Use [managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md) to run code in Azure Container Instances that interacts with other Azure services - without maintaining any secrets or credentials in code. The feature provides an Azure Container Instances deployment with an automatically managed identity in Azure Active Directory.

In this article, you learn more about managed identities in Azure Container Instances and:

> [!div class="checklist"]
> * Enable a user-assigned or system-assigned identity in a container group
> * Grant the identity access to an Azure Key Vault
> * Use the managed identity to access a Key Vault from a running container

Adapt the examples to enable and use identities in Azure Container Instances to access other Azure services. These examples are interactive. However, in practice your container images would run code to access Azure services.

> [!NOTE]
> Currently you cannot use a managed identity in a container group deployed to a virtual network.

## Why use a managed identity?

Use a managed identity in a running container to authenticate to any [service that supports Azure AD authentication](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication) without managing credentials in your container code. For services that don't support AD authentication, you can store secrets in Azure Key Vault and use the managed identity to access Key Vault to retrieve credentials. For more information about using a managed identity, see [What is managed identities for Azure resources?](../active-directory/managed-identities-azure-resources/overview.md)

> [!IMPORTANT]
> This feature is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). Currently, managed identities are only supported on Linux container instances.
>  

### Enable a managed identity

 In Azure Container Instances, managed identities for Azure resources are supported as of REST API version 2018-10-01 and corresponding SDKs and tools. When you create a container group, enable one or more managed identities by setting a [ContainerGroupIdentity](/rest/api/container-instances/containergroups/createorupdate#containergroupidentity) property. You can also enable or update managed identities after a container group is running; either action causes the container group to restart. To set the identities on a new or existing container group, use the Azure CLI, a Resource Manager template, or a YAML file. 

Azure Container Instances supports both types of managed Azure identities: user-assigned and system-assigned. On a container group, you can enable a system-assigned identity, one or more user-assigned identities, or both types of identities. 

* A **user-assigned** managed identity is created as a standalone Azure resource in the Azure AD tenant that's trusted by the subscription in use. After the identity is created, the identity can be assigned to one or more Azure resources (in Azure Container Instances or other Azure services). The lifecycle of a user-assigned identity is managed separately from the lifecycle of the container groups or other service resources to which it's assigned. This behavior is especially useful in Azure Container Instances. Because the identity extends beyond the lifetime of a container group, you can reuse it along with other standard settings to make your container group deployments highly repeatable.

* A **system-assigned** managed identity is enabled directly on a container group in Azure Container Instances. When it's enabled, Azure creates an identity for the group in the Azure AD tenant that's trusted by the subscription of the instance. After the identity is created, the credentials are provisioned in each container in the container group. The lifecycle of a system-assigned identity is directly tied to the container group that it's enabled on. When the group is deleted, Azure automatically cleans up the credentials and the identity in Azure AD.

### Use a managed identity

To use a managed identity, the identity must initially be granted access to one or more Azure service resources (such as a Web App, a Key Vault, or a Storage Account) in the subscription. To access the Azure resources from a running container, your code must acquire an *access token* from an Azure AD endpoint. Then, your code sends the access token on a call to a service that supports Azure AD authentication. 

Using a managed identity in a running container is essentially the same as using an identity in an Azure VM. See the VM guidance for using a [token](../active-directory/managed-identities-azure-resources/how-to-use-vm-token.md), [Azure PowerShell or Azure CLI](../active-directory/managed-identities-azure-resources/how-to-use-vm-sign-in.md), or the [Azure SDKs](../active-directory/managed-identities-azure-resources/how-to-use-vm-sdk.md).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0.49 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Create an Azure Key Vault

The examples in this article use a managed identity in Azure Container Instances to access an Azure Key Vault secret. 

First, create a resource group named *myResourceGroup* in the *eastus* location with the following [az group create](/cli/azure/group?view=azure-cli-latest#az-group-create) command:

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

Use the [az keyvault create](/cli/azure/keyvault?view=azure-cli-latest#az-keyvault-create) command to create a Key Vault. Be sure to specify a unique Key Vault name. 

```azurecli-interactive
az keyvault create --name mykeyvault --resource-group myResourceGroup --location eastus
```

Store a sample secret in the Key Vault using the [az keyvault secret set](/cli/azure/keyvault/secret?view=azure-cli-latest#az-keyvault-secret-set) command:

```azurecli-interactive
az keyvault secret set --name SampleSecret --value "Hello Container Instances!" --description ACIsecret  --vault-name mykeyvault
```

Continue with the following examples to access the Key Vault using either a user-assigned or system-assigned managed identity in Azure Container Instances.

## Example 1: Use a user-assigned identity to access Azure Key Vault

### Create an identity

First create an identity in your subscription using the [az identity create](/cli/azure/identity?view=azure-cli-latest#az-identity-create) command. You can use the same resource group used to create the Key Vault, or use a different one.

```azurecli-interactive
az identity create --resource-group myResourceGroup --name myACIId
```

To use the identity in the following steps, use the [az identity show](/cli/azure/identity?view=azure-cli-latest#az-identity-show) command to store the identity's service principal ID and resource ID in variables.

```azurecli-interactive
# Get service principal ID of the user-assigned identity
spID=$(az identity show --resource-group myResourceGroup --name myACIId --query principalId --output tsv)

# Get resource ID of the user-assigned identity
resourceID=$(az identity show --resource-group myResourceGroup --name myACIId --query id --output tsv)
```

### Enable a user-assigned identity on a container group

Run the following [az container create](/cli/azure/container?view=azure-cli-latest#az-container-create) command to create a container instance based on Ubuntu Server. This example provides a single-container group that you can use to interactively access other Azure services. The `--assign-identity` parameter passes your user-assigned managed identity to the group. The long-running command keeps the container running. This example uses the same resource group used to create the Key Vault, but you could specify a different one.

```azurecli-interactive
az container create --resource-group myResourceGroup --name mycontainer --image microsoft/azure-cli --assign-identity $resourceID --command-line "tail -f /dev/null"
```

Within a few seconds, you should get a response from the Azure CLI indicating that the deployment has completed. Check its status with the [az container show](/cli/azure/container?view=azure-cli-latest#az-container-show) command.

```azurecli-interactive
az container show --resource-group myResourceGroup --name mycontainer
```

The `identity` section in the output looks similar to the following, showing the identity is set in the container group. The `principalID` under `userAssignedIdentities` is the service principal of the identity you created in Azure Active Directory:

```console
...
"identity": {
    "principalId": "null",
    "tenantId": "xxxxxxxx-f292-4e60-9122-xxxxxxxxxxxx",
    "type": "UserAssigned",
    "userAssignedIdentities": {
      "/subscriptions/xxxxxxxx-0903-4b79-a55a-xxxxxxxxxxxx/resourcegroups/danlep1018/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myACIId": {
        "clientId": "xxxxxxxx-5523-45fc-9f49-xxxxxxxxxxxx",
        "principalId": "xxxxxxxx-f25b-4895-b828-xxxxxxxxxxxx"
      }
    }
  },
...
```

### Grant user-assigned identity access to the Key Vault

Run the following [az keyvault set-policy](/cli/azure/keyvault?view=azure-cli-latest) command to set an access policy on the Key Vault. The following example allows the user-assigned identity to get secrets from the Key Vault:

```azurecli-interactive
 az keyvault set-policy --name mykeyvault --resource-group myResourceGroup --object-id $spID --secret-permissions get
```

### Use user-assigned identity to get secret from Key Vault

Now you can use the managed identity to access the Key Vault within the running container instance. For this example, first launch a bash shell in the container:

```azurecli-interactive
az container exec --resource-group myResourceGroup --name mycontainer --exec-command "/bin/bash"
```

Run the following commands in the bash shell in the container. To get an access token to use Azure Active Directory to authenticate to Key Vault, run the following command:

```bash
curl 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fvault.azure.net' -H Metadata:true -s
```

Output:

```bash
{"access_token":"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Imk2bEdrM0ZaenhSY1ViMkMzbkVRN3N5SEpsWSIsImtpZCI6Imk2bEdrM0ZaenhSY1ViMkMzbkVRN3N5SEpsWSJ9......xxxxxxxxxxxxxxxxx","refresh_token":"","expires_in":"28799","expires_on":"1539927532","not_before":"1539898432","resource":"https://vault.azure.net/","token_type":"Bearer"}
```

To store the access token in a variable to use in subsequent commands to authenticate, run the following command:

```bash
token=$(curl 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fvault.azure.net' -H Metadata:true | jq -r '.access_token')

```

Now use the access token to authenticate to Key Vault and read a secret. Be sure to substitute the name of your key vault in the URL (*https://mykeyvault.vault.azure.net/...*):

```bash
curl https://mykeyvault.vault.azure.net/secrets/SampleSecret/?api-version=2016-10-01 -H "Authorization: Bearer $token"
```

The response looks similar to the following, showing the secret. In your code, you would parse this output to obtain the secret. Then, use the secret in a subsequent operation to access another Azure resource.

```bash
{"value":"Hello Container Instances!","contentType":"ACIsecret","id":"https://mykeyvault.vault.azure.net/secrets/SampleSecret/xxxxxxxxxxxxxxxxxxxx","attributes":{"enabled":true,"created":1539965967,"updated":1539965967,"recoveryLevel":"Purgeable"},"tags":{"file-encoding":"utf-8"}}
```

## Example 2: Use a system-assigned identity to access Azure Key Vault

### Enable a system-assigned identity on a container group

Run the following [az container create](/cli/azure/container?view=azure-cli-latest#az-container-create) command to create a container instance based on Ubuntu Server. This example provides a single-container group that you can use to interactively access other Azure services. The `--assign-identity` parameter with no additional value enables a system-assigned managed identity on the group. The long-running command keeps the container running. This example uses the same resource group used to create the Key Vault, but you could specify a different one.

```azurecli-interactive
az container create --resource-group myResourceGroup --name mycontainer --image microsoft/azure-cli --assign-identity --command-line "tail -f /dev/null"
```

Within a few seconds, you should get a response from the Azure CLI indicating that the deployment has completed. Check its status with the [az container show](/cli/azure/container?view=azure-cli-latest#az-container-show) command.

```azurecli-interactive
az container show --resource-group myResourceGroup --name mycontainer
```

The `identity` section in the output looks similar to the following, showing that a system-assigned identity is created in Azure Active Directory:

```console
...
"identity": {
    "principalId": "xxxxxxxx-528d-7083-b74c-xxxxxxxxxxxx",
    "tenantId": "xxxxxxxx-f292-4e60-9122-xxxxxxxxxxxx",
    "type": "SystemAssigned",
    "userAssignedIdentities": null
},
...
```

Set a variable to the value of `principalId` (the service principal ID) of the identity, to use in later steps.

```azurecli-interactive
spID=$(az container show --resource-group myResourceGroup --name mycontainer --query identity.principalId --out tsv)
```

### Grant container group access to the Key Vault

Run the following [az keyvault set-policy](/cli/azure/keyvault?view=azure-cli-latest) command to set an access policy on the Key Vault. The following example allows the system-managed identity to get secrets from the Key Vault:

```azurecli-interactive
 az keyvault set-policy --name mykeyvault --resource-group myResourceGroup --object-id $spID --secret-permissions get
```

### Use container group identity to get secret from Key Vault

Now you can use the managed identity to access the Key Vault within the running container instance. For this example, first launch a bash shell in the container:

```azurecli-interactive
az container exec --resource-group myResourceGroup --name mycontainer --exec-command "/bin/bash"
```

Run the following commands in the bash shell in the container. To get an access token to use Azure Active Directory to authenticate to Key Vault, run the following command:

```bash
curl 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fvault.azure.net%2F' -H Metadata:true -s
```

Output:

```bash
{"access_token":"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Imk2bEdrM0ZaenhSY1ViMkMzbkVRN3N5SEpsWSIsImtpZCI6Imk2bEdrM0ZaenhSY1ViMkMzbkVRN3N5SEpsWSJ9......xxxxxxxxxxxxxxxxx","refresh_token":"","expires_in":"28799","expires_on":"1539927532","not_before":"1539898432","resource":"https://vault.azure.net/","token_type":"Bearer"}
```

To store the access token in a variable to use in subsequent commands to authenticate, run the following command:

```bash
token=$(curl 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fvault.azure.net' -H Metadata:true | jq -r '.access_token')

```

Now use the access token to authenticate to Key Vault and read a secret. Be sure to substitute the name of your key vault in the URL (*https:\//mykeyvault.vault.azure.net/...*):

```bash
curl https://mykeyvault.vault.azure.net/secrets/SampleSecret/?api-version=2016-10-01 -H "Authorization: Bearer $token"
```

The response looks similar to the following, showing the secret. In your code, you would parse this output to obtain the secret. Then, use the secret in a subsequent operation to access another Azure resource.

```bash
{"value":"Hello Container Instances!","contentType":"ACIsecret","id":"https://mykeyvault.vault.azure.net/secrets/SampleSecret/xxxxxxxxxxxxxxxxxxxx","attributes":{"enabled":true,"created":1539965967,"updated":1539965967,"recoveryLevel":"Purgeable"},"tags":{"file-encoding":"utf-8"}}
```

## Enable managed identity using Resource Manager template

To enable a managed identity in a container group using a [Resource Manager template](container-instances-multi-container-group.md), set the `identity` property of the `Microsoft.ContainerInstance/containerGroups` object with a `ContainerGroupIdentity` object. The following snippets show the `identity` property configured for different scenarios. See the [Resource Manager template reference](/azure/templates/microsoft.containerinstance/containergroups). Specify an `apiVersion` of `2018-10-01`.

### User-assigned identity

A user-assigned identity is a resource ID of the form:

```
"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}"
``` 

You can enable one or more user-assigned identities.

```json
"identity": {
    "type": "UserAssigned",
    "userAssignedIdentities": {
        "myResourceID1": {
            }
        }
    }
```

### System-assigned identity

```json
"identity": {
    "type": "SystemAssigned"
    }
```

### System- and user-assigned identities

On a container group, you can enable both a system-assigned identity and one or more user-assigned identities.

```json
"identity": {
    "type": "System Assigned, UserAssigned",
    "userAssignedIdentities": {
        "myResourceID1": {
            }
        }
    }
...
```

## Enable managed identity using YAML file

To enable a managed identity in a container group deployed using a [YAML file](container-instances-multi-container-yaml.md), include the following YAML.
Specify an `apiVersion` of `2018-10-01`.

### User-assigned identity

A user-assigned identity is a resource ID of the form 

```
'/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}'
```

You can enable one or more user-assigned identities.

```YAML
identity:
  type: UserAssigned
  userAssignedIdentities:
    {'myResourceID1':{}}
```

### System-assigned identity

```YAML
identity:
  type: SystemAssigned
```

### System- and user-assigned identities

On a container group, you can enable both a system-assigned identity and one or more user-assigned identities.

```YAML
identity:
  type: SystemAssigned, UserAssigned
  userAssignedIdentities:
   {'myResourceID1':{}}
```

## Next steps

In this article, you learned about managed identities in Azure Container Instances and how to:

> [!div class="checklist"]
> * Enable a user-assigned or system-assigned identity in a container group
> * Grant the identity access to an Azure Key Vault
> * Use the managed identity to access a Key Vault from a running container

* Learn more about [managed identities for Azure resources](/azure/active-directory/managed-identities-azure-resources/).

* See an [Azure Go SDK example](https://medium.com/@samkreter/c98911206328) of using a managed identity to access a Key Vault from Azure Container Instances.
