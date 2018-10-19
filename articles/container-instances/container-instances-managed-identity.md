---
title: Use a managed identity with Azure Container Instances
description: Learn how to use a managed identity to authenticate with other Azure services from Azure Container Instances.
services: container-instances
author: dlepow

ms.service: container-instances
ms.topic: article
ms.date: 10/18/2018
ms.author: danlep
ms.custom: mvc
---

# Tutorial: How to use managed identities with Azure Container Instances

Use [managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md) to run code in Azure Container Instances that interacts with other Azure services - without having to access secrets or credentials in code. The feature provides an Azure Container Instances deployment with an automatically managed identity in Azure Active Directory.

In this tutorial, you learn more about managed identities in Azure Container Instances and:

> [!div class="checklist"]
> * Enable a managed identity in a container group
> * Grant the container group access to another Azure resource
> * Use the managed identity to access the resource from a running container

## Why use a managed identity?

Use a managed identity in a running container to authenticate to any [service that supports Azure AD authentication](../active-directory/managed-identities-azure-resources/services-support-msi.md#azure-services-that-support-azure-ad-authentication) without managing credentials in your container code. For services that don't support AD authentication, you can store secrets in Azure Key Vault and use the managed identity to access Key Vault to retrieve credentials. For more information, see [What is managed identities for Azure resources?](../active-directory/managed-identities-azure-resources/overview.md)

> [!IMPORTANT]
> This feature is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). Currently managed identities are supported only on Linux container instances.
>  

### Enable a managed identity

 In Azure Container Instances, managed identities for Azure resources are supported as of API version 2018-10-01 and corresponding SDKs and tools. Enable managed identities by specifying a [ContainerGroupIdentity](/rest/api/container-instances/containergroups/containergroups_createorupdate#containergroupidentity) property when you create a container group. You can also enable or update managed identities after a container group is running; either action causes the container group to restart. To set the properties of the identities on a new or existing container group, you can use the Azure CLI, a Resource Manager template, or a YAML file. 

Azure Container Instances supports both types of managed Azure identities: system-assigned and user-assigned. On a container group, you can enable a system-assigned identity, one or more user-assigned identities, or both system- and user-assigned identities.

* A **system-assigned** managed identity is enabled directly on a container group in Azure Container Instances. When it's enabled, Azure creates an identity for the group in the Azure AD tenant that's trusted by the subscription of the instance. After the identity is created, the credentials are provisioned onto each container in the container group. The lifecycle of a system-assigned identity is directly tied to the container group that it's enabled on. When the group is deleted, Azure automatically cleans up the credentials and the identity in Azure AD.

* A **user-assigned** managed identity is created as a standalone Azure resource in the Azure AD tenant that's trusted by the subscription in use. After the identity is created, the identity can be assigned to one or more Azure resources (in Azure Container Instances or other Azure services). The lifecycle of a user-assigned identity is managed separately from the lifecycle of the container groups or other service resources to which it's assigned.

### Use a managed identity

To use a managed identity, the identity must initially be granted access to one or more Azure service resources (such as a Web App, a Key Vault, or a Storage Account) in the subscription. To access the Azure resources from a running container, your code must acquire an *access token* from an Azure AD endpoint. Then, your code sends the access token on a call to a service that supports Azure AD authentication. 

Use of a managed identity in a running container is essentially the same as using a identity in an Azure VM. See the guidance for using a [token](../active-directory/managed-identities-azure-resources/how-to-use-vm-token.md), [Azure PowerShell or Azure CLI](../active-directory/managed-identities-azure-resources/how-to-use-vm-sign-in.md), or the [Azure SDKs](../active-directory/managed-identities-azure-resources/how-to-use-vm-sdk.md).

## Example: Use a system-assigned identity to access Azure Key Vault

This example walks through enabling and using a system-assigned identity on a container group. You grant the identity access to an Azure service instance, in this case an Azure Key Vault. Then, from a running container, you use the managed identity to access a secret. This example is interactive. However, in practice your container images would run code to access Azure services.

### Enable a system-assigned identity on a container group

First, create a resource group named *myResourceGroup* in the *eastus* location with the following [az group create](/cli/azure/group?view=azure-cli-latest#az-group-create) command:

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

Run the following [az container create](/cli/azure/container?view=azure-cli-latest#az-container-create) command to create a container instance based on Ubuntu Server. This example provides a single-container group that you can use to interactively access other Azure services. The `--assign-identity` parameter enables a system-assigned managed identity on the group. To stay running, the container runs a long-running command.

```azurecli-interactive
az container create --resource-group myResourceGroup --name mycontainer --image devorbitus/ubuntu-bash-jq-curl --assign-identity --command-line "tail -f /dev/null" --port 80
```

Within a few seconds, you should get a response from the Azure CLI indicating that the deployment has completed. Check its status with the [az container show](/cli/azure/container?view=azure-cli-latest#az-container-show) command.

```azurecli-interactive
az container show --resource-group myResourceGroup --name mycontainer
```

The `identity` section in the output looks similar to the following, showing the identity is created in Azure Active Directory:

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

Set a variable to the value of `principalId` (the service principal ID), to use in later steps to grant access to Azure resources.

```azurecli-interactive
spID=$(az container show --resource-group myResourceGroup --name mycontainer --query identity.principalId --out tsv)
```

### Create an Azure Key Vault

Use the [az keyvault create](/cli/azure/keyvault?view=azure-cli-latest#az-keyvault-create) command to create a Key Vault. Be sure to specify a unique Key Vault name. This example uses the same resource group used to create the container group, but you could specify a different one.

```azurecli-interactive
az keyvault create --name mykeyvault --resource-group myResourceGroup --location eastus
```

Store a sample secret in the Key Vault using the [az keyvault secret set](/cli/azure/keyvault/secret?view=azure-cli-latest#az-keyvault-secret-set) command:

```azurecli-interactive
az keyvault secret set --name SampleSecret --value "Hello Container Instances!" --description ACIsecret  --vault-name mykeyvault
```

### Grant container group access to the Key Vault

Run the following [az keyvault set-policy](/azure/keyvault?view=azure-cli-latest#az-keyvault-set-policy) command to set an access policy on the Key Vault. The following example allows the container group service principal to get secrets from the Key Vault:

```azurecli-interactive
 az keyvault set-policy --name mykeyvaultdl2 --resource-group danlep1018 --object-id $spID --secret-permissions get
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
{"access_token":"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Imk2bEdrM0ZaenhSY1ViMkMzbkVRN3N5SEpsWSIsImtpZCI6Imk2bEdrM0ZaenhSY1ViMkMzbkVRN3N5SEpsWSJ9......xXxxxxxxxxxxxxxxxx","refresh_token":"","expires_in":"28799","expires_on":"1539927532","not_before":"1539898432","resource":"https://vault.azure.net/","token_type":"Bearer"}
```

To store the access token in a variable to use in subsequent commands to authenticate, run the following command::

```bash
token=$(curl 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fvault.azure.net' -H Metadata:true | jq -r '.access_token')

```

Now use the access token to authenticate to Key Vault and read a secret. Be sure to substitute the name of your key vault in the URL (*https://mykeyvault.vault.azure.net/...*):

```bash
curl https://<YOUR-KEY-VAULT-URL>/secrets/<secret-name>?api-version=2016-10-01 -H "Authorization: Bearer $token"

curl https://mykeyvaultdl2.vault.azure.net/secrets/SampleSecret/?api-version=2016-10-01 -H "Authorization: Bearer $token"


```

The response looks similar to the following, showing the secret. In your code, you would parse this output to obtain the secret. Then you'd use the secret in a subsequent operation to access an Azure resource.

```bash
{"value":"Hello Container Instances!","contentType":"ACIsecret","id":"https://mykeyvault.vault.azure.net/secrets/SampleSecret/xxxxxxxxxxxxxxxxxxxx","attributes":{"enabled":true,"created":1539965967,"updated":1539965967,"recoveryLevel":"Purgeable"},"tags":{"file-encoding":"utf-8"}}
```

## Enable managed identity using Resource Manager template

Add the following resource.

### System-assigned managed identity

```json
"type": "Microsoft.ContainerInstance/containerGroups",
"Identity": {
    "Type": "SystemAssigned"
    }
```

### User-assigned managed identity

```json
"type": "Microsoft.ContainerInstance/containerGroups",
"Identity": {
    "Type": "UserAssigned",
    "UserAssignedIdentities": "{myResourceID1, myResourceID2}"
    }
```

### System- and user-assigned identities

```json
"type": "Microsoft.ContainerInstance/containerGroups",
"Identity": {
    "Type": "System Assigned, UserAssigned",
    "UserAssignedIdentities": "{myResourceID1, myResourceID2}"
    }
```

## Next steps

In this tutorial you learned about managed identities in Azure Container Instances and how to:

> [!div class="checklist"]
> * Enable a managed identity in a container group
> * Grant the container group access to another Azure resource
> * Use the managed identity to access the resource from a running container

* Learn more about [managed identities for Azure resources](/azure/active-directory/managed-identities-azure-resources/).

* Try other ways to use a managed identity to authenticate to Azure services using a [token](../active-directory/managed-identities-azure-resources/how-to-use-vm-token.md), [Azure PowerShell or Azure CLI](../active-directory/managed-identities-azure-resources/how-to-use-vm-sign-in.md), or the [Azure SDKs](../active-directory/managed-identities-azure-resources/how-to-use-vm-sdk.md).