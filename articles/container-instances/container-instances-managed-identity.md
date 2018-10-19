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

# Tutorial: How to use managed identities for Azure Container Instances

Need intro. Refer to [overview content](../active-directory/managed-identities-azure-resources/overview.md) about system-assigned managed identities and user-assigned managed identities.

You can use a managed identity to authenticate to any [service that supports Azure AD authentication](../active-directory/managed-identities-azure-resources/services-support-msi.md#azure-services-that-support-azure-ad-authentication) without having any credentials in your code. For services that don't support AD authentication, you can store secrets in Azure Key Vault and use the managed identity to access Key Vault to retrieve credentials. 

Value in ACI: use to run code in ACI containers that can interact with other Azure services without managing access secrets or credentials directly in code.

## Prerequisites

* Requires Azure CLI version XXX (az container module XXX) or cloud shell.

## Things to know

* Preview feature
* Configure (only?) on container groups? Applies to all containers in a multi-container group.
* Must configure at time container group is created; could assign identity later via the patching API. (az container create with the same name but different properties - s/b without a restart)
* Portal around Thanksgiving/Dec.
* Available only for Linux containers per Allan - not Win
* Any restrictions on region availability?
* Container instances supports configuring a system-assigned managed identity, a user-assigned managed identity, or both (or none) on a container group. Explain quick difff between system and user. System assigned - lifetime of resource. User assigned can be reused.
* Use of managed identity in a container is essentially the same as using identity in an Azure VM: via a [token](../active-directory/managed-identities-azure-resources/how-to-use-vm-token.md), [Azure PowerShell or Azure CLI](../active-directory/managed-identities-azure-resources/how-to-use-vm-sign-in.md), or the [Azure SDKs](../active-directory/managed-identities-azure-resources/how-to-use-vm-sdk.md).


## Example: Use a system-assigned identity to access Azure Key Vault

Basic CLI example. This example is interactive. However, in practice you would be running a container image that is running code to access Azure services.

### Enable a system-assigned identity on a container group

First, create a resource group named *myResourceGroup* in the *eastus* location with the following [az group create](/cli/azure/group?view=azure-cli-latest#az-group-create) command:

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

Run the following [az container create](/cli/azure/container?view=azure-cli-latest#az-container-create) command to create a container instance that runs Ubuntu Server. This is for example purposes to provide a container that you can use to easily access other Azure services. The `--assign-identity` parameter enables a system-assigned managed identity on the instance. To ensure the container stays running, the container runs a long-running command.

```azurecli-interactive
az container create --resource-group myResourceGroup --name mycontainer --image ubuntu:latest --assign-identity --command-line "tail -f /dev/null"
```

[choose ubuntu]

Within a few seconds, you should get a response from the Azure CLI indicating that the deployment has completed. Check its status with the [az container show][az-container-show](/cli/azure/container?view=azure-cli-latest#az-container-show) command.

```azurecli-interactive
az container show --resource-group myResourceGroup --name mycontainer
```

The `identity` section in the output looks similar to:

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

Store a sample secret in the Key Vault using the [az keyvault secret set](//cli/azure/keyvault/secret?view=azure-cli-latest#az-keyvault-secret-set) command:

```azurecli-interactive
az keyvault secret set --name SampleSecret --value SecretValue --description "Sample Secret Value" --vault-name mykeyvault
```

### Grant container group access to the Key Vault

Run the following command to set a variable to the Key Vault resource ID:

```azurecli-interactive
keyvaultID=$(az keyvault show --name mykeyvault --resource-group myResourceGroup --query id --output tsv)
```

Use the [az role assignment create](/cli/azure/role/assignment?view=azure-cli-latest#az-role-assignment-create) command to assign the container group's managed identity a Contributor role to the Key Vault:

```azurecli-interactive
az role assignment create --assignee $spID --role Contributor --scope $keyvaultID
```

### Use container group identity to get secret from Key Vault

Now you can use the managed identity to access the Key Vault within the running container instance. For this example first launch a bash shell in the container:

```azurecli-interactive
az container exec --resource-group myResourceGroup --name mycontainer --exec-command "/bin/bash"
```

Run the following commands in the bash shell in the container. 

```bash
curl 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fvault.azure.net%2F' -H Metadata:true -s
```

Output:

```bash{"access_token":"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Imk2bEdrM0ZaenhSY1ViMkMzbkVRN3N5SEpsWSIsImtpZCI6Imk2bEdrM0ZaenhSY1ViMkMzbkVRN3N5SEpsWSJ9......xXxxxxxxxxxxxxxxxx","refresh_token":"","expires_in":"28799","expires_on":"1539927532","not_before":"1539898432","resource":"https://vault.azure.net/","token_type":"Bearer"}
```

Get the access token:

```bash
token=$(curl 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fvault.azure.net%2F' -H Metadata:true -s | jq '.access_token')
```

Now use the access token to authenticate to Key Vault and read a secret:

```bash
curl https://<YOUR-KEY-VAULT-URL>/secrets/<secret-name>?api-version=2016-10-01 -H "Authorization: Bearer $token"

#header="Authorization: Bearer "$token
# curl https://myKeyVaultdanlep1011.vault.azure.net/secrets/SampleSecret?api-version=2016-10-01 -H "Authorization: Bearer $token"

# try this
#curl https://myKeyVaultdanlep1011.vault.azure.net/secrets/SampleSecret?api-version=2016-10-01 -H $header
```

The response will look like this, showing the secret:

```bash

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

This article covered ...

> [!div class="nextstepaction"]
> [Azure Container Instances tutorial][aci-tutorial]

<!-- LINKS - Internal -->
[aci-tutorial]: ./container-instances-tutorial-prepare-app.md
[az-container-logs]: /cli/azure/container#az-container-logs
[az-container-show]: /cli/azure/container#az-container-show
[az-group-create]: /cli/azure/group#az-group-create
[az-group-deployment-create]: /cli/azure/group/deployment#az-group-deployment-create
[template-reference]: https://docs.microsoft.com/azure/templates/microsoft.containerinstance/containergroups
