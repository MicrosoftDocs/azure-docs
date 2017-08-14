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
ms.service: 
ms.devlang: na
ms.topic: na
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/21/2017
ms.author: seanmck
ms.custom: 
---

# Deploy to Azure Container Instances from the Azure Container Registry

The Azure Container Registry is an Azure-based, private registry, for Docker container images. This article covers how to deploy container images stored in the Azure Container Registry to Azure Container Instances.

## Using the Azure CLI

The Azure CLI includes commands for creating and managing containers in Azure Container Instances. If you specify a private image in the `create` command, you can also specify the image registry password required to authenticate with the container registry.

```azurecli-interactive
az container create --name myprivatecontainer --image mycontainerregistry.azurecr.io/mycontainerimage:v1 --image-registry-password myRegistryPassword --resource-group myresourcegroup
```

The `create` command also supports specifying the `image-registry-login-server` and `image-registry-username`. However, by default, the login server for the Azure Container Registry is simply *registryname*.azurecr.io and the username is *registryname*, so these values are inferred from the image name if not explicitly provided.

## Using an Azure Resource Manager template

You can specify the properties of your Azure Container Registry in an Azure Resource Manager template. Simply include the `imageRegistryCredentials` property in the definition of your container group:

```json
"imageRegistryCredentials": [
  {
    "server": "imageRegistryLoginServer",
    "username": "imageRegistryUsername",
    "password": "imageRegistryPassword"
  }
]
```

To avoid storing the password to your container registry directly in the template, it is recommended that you store it as a secret in [Azure Key Vault](../key-vault/key-vault-manage-with-cli2.md) and reference it in the template using the [native integration between the Azure Resource Manager and Key Vault](../azure-resource-manager/resource-manager-keyvault-parameter.md).


## Next steps

Learn how to build containers, push them to a private container registry, and deploy them to Azure Container Instances by [completing the tutorial](container-instances-tutorial-prepare-app.md).