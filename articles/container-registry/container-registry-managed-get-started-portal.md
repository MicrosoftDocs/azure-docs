---
title: Create private Docker registry - Azure portal | Microsoft Docs
description: Get started creating and managing private Docker container registries with the Azure portal
services: container-registry
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: na
tags: ''
keywords: ''

ms.assetid: 53a3b3cb-ab4b-4560-bc00-366e2759f1a1
ms.service: container-registry
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/11/2017
ms.author: nepeters
ms.custom: na
---

# Create a managed container registry using the Azure portal

Azure Container Registry is a managed Docker container registry service used for storing private Docker container images. This guide details creating a managed Azure Container Registry instance using the Azure portal.

Managed Azure container registries are in preview and not available in all regions.

## Log in to Azure

Log in to the Azure portal at http://portal.azure.com.

## Create a container registry

1. Click the **New** button found on the upper left-hand corner of the Azure portal.

2. Search the marketplace for **Azure container registry** and select it.

3. Click **Create** which will open the ACR creation blade.

    ![Container registry settings](./media/container-registry-get-started-portal/managed-container-registry-settings.png)

4. In the **Azure Container Registry** blade, enter the following information. Click **Create** when you are done.

    a. **Registry name**: A globally unique top-level domain name for your specific registry. In this example, the registry name is *myAzureContainerRegistry1*, but substitute a unique name of your own. The name can contain only letters and numbers.

    b. **Resource group**: Select an existing [resource group](../azure-resource-manager/resource-group-overview.md#resource-groups) or type the name for a new one.

    c. **Location**: Select an Azure datacenter location where the service is [available](https://azure.microsoft.com/regions/services/), such as **South Central US**.

    d. **Admin user**: If you want, enable an admin user to access the registry. You can change this setting after creating the registry.

    e. **Use managed registry**: Select yes to have ACR automatically manage the registry storage, use webhooks, and use AAD authentication.

    f. **Pricing Tier**: Select a pricing tier, see here ACR pricing for more information.

## Log in to ACR instance

Before pushing and pulling container images, you must log in to the ACR instance. 

To do so, use the Azure CLI 2.0. First, if needed, log into Azure using the [az login](/cli/azure/#login) command. 

```azurecli
az login
```

Next, use the [az acr login](/cli/azure/acr#login) command to log in to the Azure Container Registry.

```azurecli-interactive
az acr login --name myAzureContainerRegistry1
```

## Use Azure Container Registry

### List container images

Use the `az acr` CLI commands to query the images and tags in a repository.

> [!NOTE]
> Currently, Container Registry does not support the `docker search` command to query for images and tags.

### List repositories

The following example lists the repositories in a registry, in JSON (JavaScript Object Notation) format:

```azurecli
az acr repository list -n myContainerRegistry1 -o json
```

### List tags

The following example lists the tags on the **samples/nginx** repository, in JSON format:

```azurecli
az acr repository show-tags -n myContainerRegistry1 --repository samples/nginx -o json
```

## Next steps

In this quick start, you've created a managed Azure Container Registry instance using the Azure portal.

> [!div class="nextstepaction"]
> [Push your first image using the Docker CLI](container-registry-get-started-docker-cli.md)