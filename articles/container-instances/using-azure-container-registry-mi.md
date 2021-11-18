---
title: Deploy container image from Azure Container Registry using a managed identity
description: Learn how to deploy containers in Azure Container Instances by pulling container images from an Azure container registry using a managed identity.
services: container-instances
ms.topic: article
ms.date: 11/11/2021
ms.custom: mvc, devx-track-azurecli
---

# Deploy to Azure Container Instances from Azure Container Registry using a managed identity

[Azure Container Registry][acr-overview] (ACR) is an Azure-based, managed container registry service used to store private Docker container images. This article describes how to pull container images stored in an Azure container registry when deploying to container groups with Azure Container Instances. One way to configure registry access is to create an Azure Active Directory managed identity.

## Prerequisites

**Azure container registry**: You need a premium SKU Azure container registry. If you need to create a registry, see [Create a container registry using the Azure CLI][acr-get-started].

**Azure CLI**: The command-line examples in this article use the [Azure CLI](/cli/azure/) and are formatted for the Bash shell. You can [install the Azure CLI](/cli/azure/install-azure-cli) locally, or use the [Azure Cloud Shell][cloud-shell-bash].

## Limitations

> [!IMPORTANT]
> Managed identity-authenticated container image pulls from ACR are not supported in Canada Central, South India, and West Central US at this time.  

* Virtual Network injected container groups do not support a managed identity authentication image pulls with ACR.

* Windows Sever 2016 container groups do not support managed identity authentication image pulls with ACR.

* Container groups cannot use managed identity to authenticate image pulls from Azure container registry's that use [private DNS zones][private-dns-zones].

## Configure registry authentication

Your container registry must have Trusted Services enabled. To find instructions on how to enable trusted services, see [Allow trusted services to securely access a network-restricted container registry (preview)][allow-access-trusted-services].

## Create an identity

Create an identity in your subscription using the [az identity create][az-identity-create] command. You can use the same resource group you used previously to create the container registry, or a different one.

```azurecli-interactive
az identity create --resource-group myResourceGroup --name myACRId
```

To configure the identity in the following steps, use the [az identity show][az-identity-show] command to store the identity's resource ID and service principal ID in variables.

In order to properly configure the identity in future steps, use [az identity show][az-identity-show] to obtain and store the identity's resource ID and service principal ID in variables.

```azurecli-interactive
# Get resource ID of the user-assigned identity
userID=$(az identity show --resource-group myResourceGroup --name myACRId --query id --output tsv)
# Get service principal ID of the user-assigned identity
spID=$(az identity show --resource-group myResourceGroup --name myACRId --query principalId --output tsv)
```

You will need the identity's resource ID to sign in to the CLI from your virtual machine. To show the value:

```bash
echo $userID
```

The ID is of the form:

```bash
/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myACRId
```

## Deploy using an Azure Resource Manager (ARM) template

Start by copying the following JSON into a new file named `azuredeploy.json`. In Azure Cloud Shell, you can use Visual Studio Code to create the file in your working directory:

```bash
code azuredeploy.json
```

You can specify the properties of your Azure container registry in an ARM template by including the `imageRegistryCredentials` property in the container group definition. For example, you can specify the registry credentials directly:

```JSON
{
    "type": "Microsoft.ContainerInstance/containerGroups",
    "apiVersion": "2021-09-01",
    "name": "myacr",
    "location": "norwayeast",
    "identity": {
      "type": "UserAssigned",
      "userAssignedIdentities": {
        "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myACRId": {}
        }
    },
    "properties": {
      "containers": [
        {
          "name": "mycontainer",
          "properties": {
            "image": "myacr.azurecr.io/hello-world:latest",
            "ports": [
              {
                "port": 80,
                "protocol": "TCP"
              }
            ],
            "resources": {
              "requests": {
                "cpu": 1,
                "memoryInGB": 1
              }
            }
        }
        }
      ],
      "imageRegistryCredentials": [
        {
            "server":"myacr.azurecr.io",
            "identity":"/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myACRId"
        }
      ],
      "ipAddress": {
        "ports": [
          {
            "port": 80,
            "protocol": "TCP"
          }
        ],
        "type": "public"
      },
      "osType": "Linux"
    }
  }
```

### Deploy the template

Deploy your resource manager template with the following command:

```azurecli-interactive
az deployment group create --resource-group myResourceGroup --template-file azuredeploy.json
```

### Clean up resources

To remove all resources from your Azure subscription, delete the resource group:

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next Steps

* [Learn how to deploy to Azure Container Instances from Azure Container Registry using a service principal][use-service-principal]

<!-- LINKS -->
<!-- Internal -->

[use-service-principal]: ./container-instances-using-azure-container-registry.md
[az-identity-show]: /cli/azure/identity#az_identity_show
[az-identity-create]: /cli/azure/identity#az_identity_create
[acr-overview]: ../container-registry/container-registry-intro.md
[acr-get-started]: ../container-registry/container-registry-get-started-azure-cli.md
[private-dns-zones]: ../dns/private-dns-privatednszone.md
[allow-access-trusted-services]: ../container-registry/allow-access-trusted-services.md

<!-- External -->
[cloud-shell-bash]: https://shell.azure.com/bash