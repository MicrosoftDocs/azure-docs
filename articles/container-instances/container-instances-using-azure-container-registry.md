---
title: Deploy to Azure Container Instances from Azure Container Registry
description: Learn how to deploy containers in Azure Container Instances using container images in an Azure Container Registry.
services: container-instances
author: seanmck
manager: timlt

ms.service: container-instances
ms.topic: article
ms.date: 01/24/2018
ms.author: seanmck
ms.custom: mvc
---

# Deploy to Azure Container Instances from Azure Container Registry

The Azure Container Registry is an Azure-based, private registry, for Docker container images. This article covers how to deploy container images stored in the Azure Container Registry to Azure Container Instances.

## Deploy with Azure CLI

The Azure CLI includes commands for creating and managing containers in Azure Container Instances. If you specify a private image in the  [az container create][az-container-create] command, you can also specify the image registry password required to authenticate with the container registry.

```azurecli-interactive
az container create --resource-group myResourceGroup --name myprivatecontainer --image mycontainerregistry.azurecr.io/mycontainerimage:v1 --registry-password myRegistryPassword
```

The [az container create][az-container-create] command also supports specifying `--registry-login-server` and `--registry-username`. However, the login server for the Azure Container Registry is always *registryname*.azurecr.io and the default username is *registryname*, so these values are inferred from the image name if not explicitly provided.

## Deploy with Azure Resource Manager template

You can specify the properties of your Azure Container Registry in an Azure Resource Manager template by including the `imageRegistryCredentials` property in the container group definition:

```JSON
"imageRegistryCredentials": [
  {
    "server": "imageRegistryLoginServer",
    "username": "imageRegistryUsername",
    "password": "imageRegistryPassword"
  }
]
```

To avoid storing your container registry password directly in the template, we recommend that you store it as a secret in [Azure Key Vault](../key-vault/key-vault-manage-with-cli2.md) and reference it in the template using the [native integration between the Azure Resource Manager and Key Vault](../azure-resource-manager/resource-manager-keyvault-parameter.md).

## Deploy with Azure portal

If you maintain container images in the Azure Container Registry, you can easily create a container in Azure Container Instances using the Azure portal.

1. In the Azure portal, navigate to your container registry.

1. Select **Repositories**, then select the repository that you want to deploy from, right-click the tag for the container image you want to deploy, and select **Run instance**.

    !["Run instance" in Azure Container Registry in the Azure portal][acr-runinstance-contextmenu]

1. Enter a name for the container and a name for the resource group. You can also change the default values if you wish.

    ![Create menu for Azure Container Instances][acr-create-deeplink]

1. Once the deployment completes, you can navigate to the container group from the notifications pane to find its IP address and other properties.

    ![Details view for Azure Container Instances container group][aci-detailsview]

## Service principal authentication

If the admin user for the Azure container registry is disabled, you can use an Azure Active Directory [service principal](../container-registry/container-registry-auth-service-principal.md) to authenticate to the registry when creating a container instance. Using a service principal for authentication is also recommended in headless scenarios, such as a script or application that creates container instances in an unattended manner.

For more information, see [Authenticate with Azure Container Registry from Azure Container Instances](../container-registry/container-registry-auth-aci.md).

## Next steps

Learn how to build containers, push them to a private container registry, and deploy them to Azure Container Instances by [completing the tutorial](container-instances-tutorial-prepare-app.md).

<!-- IMAGES -->
[acr-create-deeplink]: ./media/container-instances-using-azure-container-registry/acr-create-deeplink.png
[aci-detailsview]: ./media/container-instances-using-azure-container-registry/aci-detailsview.png
[acr-runinstance-contextmenu]: ./media/container-instances-using-azure-container-registry/acr-runinstance-contextmenu.png

<!-- LINKS - Internal -->
[az-container-create]: /cli/azure/container?view=azure-cli-latest#az_container_create