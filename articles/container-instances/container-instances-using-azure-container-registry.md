---
title: Deploy to Azure Container Instances from the Azure Container Registry | Azure Docs
description: Deploy to Azure Container Instances from the Azure Container Registry
services: container-instances
documentationcenter: ''
author: seanmck
manager: timlt
editor: ''
tags: 
keywords: ''

ms.assetid: 
ms.service: container-instances
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/02/2017
ms.author: seanmck
ms.custom: mvc
---

# Deploy to Azure Container Instances from the Azure Container Registry

The Azure Container Registry is an Azure-based, private registry, for Docker container images. This article covers how to deploy container images stored in the Azure Container Registry to Azure Container Instances.

## Using the Azure CLI

The Azure CLI includes commands for creating and managing containers in Azure Container Instances. If you specify a private image in the `create` command, you can also specify the image registry password required to authenticate with the container registry.

```azurecli-interactive
az container create --name myprivatecontainer --image mycontainerregistry.azurecr.io/mycontainerimage:v1 --registry-password myRegistryPassword --resource-group myresourcegroup
```

The `create` command also supports specifying the `registry-login-server` and `registry-username`. However, the login server for the Azure Container Registry is always *registryname*.azurecr.io and the default username is *registryname*, so these values are inferred from the image name if not explicitly provided.

## Using an Azure Resource Manager template

You can specify the properties of your Azure Container Registry in an Azure Resource Manager template by including the `imageRegistryCredentials` property in the container group definition:

```json
"imageRegistryCredentials": [
  {
    "server": "imageRegistryLoginServer",
    "username": "imageRegistryUsername",
    "password": "imageRegistryPassword"
  }
]
```

To avoid storing your container registry password directly in the template, we recommend that you store it as a secret in [Azure Key Vault](../key-vault/key-vault-manage-with-cli2.md) and reference it in the template using the [native integration between the Azure Resource Manager and Key Vault](../azure-resource-manager/resource-manager-keyvault-parameter.md).

## Using the Azure portal

If you maintain container images in the Azure Container Registry, you can easily create a container in Azure Container Instances using the Azure portal.

1. In the Azure portal, navigate to your container registry.

2. Choose Repositories.

    ![The Azure Container Registry menu in the Azure portal][acr-menu]

3. Choose the repository that you want to deploy from.

4. Right-click the tag for the container image you want to deploy.

    ![Context menu for launching container with Azure Container Instances][acr-runinstance-contextmenu]

5. Enter a name for the container and a name for the resource group. You can also change the default values if you wish.

    ![Create menu for Azure Container Instances][acr-create-deeplink]

6. Once the deployment completes, you can navigate to the container group from the notifications pane to find its IP address and other properties.

    ![Details view for Azure Container Instances container group][aci-detailsview]

## Next steps

Learn how to build containers, push them to a private container registry, and deploy them to Azure Container Instances by [completing the tutorial](container-instances-tutorial-prepare-app.md).

<!-- IMAGES -->
[acr-menu]: ./media/container-instances-using-azure-container-registry/acr-menu.png

[acr-runinstance-contextmenu]: ./media/container-instances-using-azure-container-registry/acr-runinstance-contextmenu.png

[acr-create-deeplink]: ./media/container-instances-using-azure-container-registry/acr-create-deeplink.png

[aci-detailsview]: ./media/container-instances-using-azure-container-registry/aci-detailsview.png
