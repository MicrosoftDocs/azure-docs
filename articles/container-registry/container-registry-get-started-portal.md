---
title: Create a container registry in the portal | Microsoft Docs
description: Get started creating and managing Azure container registries with the Azure portal
services: container-registry
documentationcenter: ''
author: stevelas
manager: balans
editor: dlepow
tags: ''
keywords: ''

ms.assetid: 53a3b3cb-ab4b-4560-bc00-366e2759f1a1
ms.service: container-registry
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/02/2016
ms.author: stevelas
---
# Create a container registry using the Azure portal
Use the Azure portal to create a container registry and manage its settings. You can also work with container registries using the [Azure CLI commands](container-registry-get-started-azure-cli.md) or programmatically with the Container Registry APIs.

* For background and concepts, see [What is Azure Container Registry?](container-registry-intro.md)
* To get started with Docker images in your registry, see [Push your first image using the Docker CLI](container-registry-get-started-docker-cli.md).

> [!NOTE]
> Container Registry is currently in private preview.
> 
> 

## Prerequisites
* **Container Registry private preview** - See the [instructions](container-registry-get-access.md) to register your Azure subscription and request access.

> [!IMPORTANT]
> While Container Registry is in private preview, use the URL [https://aka.ms/acr/portal](https://aka.ms/acr/portal) to launch the portal, with the ACR preview enabled. 
> 
> 

## Create a container registry
1. In the [portal](https://aka.ms/acr/portal), click **+ New**.
2. Search the marketplace for **container registry**.
3. Select **Container Registry (preview)**, with publisher **Microsoft**. 
   
    ![Container Registry service in Azure Marketplace](./media/container-registry-get-started-portal/container-registry-marketplace.png)
4. Click **Create**.
5. In the **Container Registry** blade, enter the following information. Click **Create** when you are done.
   
    a. **Registry name** - A globally unique DNS name for your specific registry. In this example. the registry name is *myRegistry01*, but substitute a unique name of your own. The name can contain only letters and numbers.
   
    b. **Resource group** - Select an existing [resource group](../resource-group-overview.md#resource-groups) or type the name for a new one. 
   
    c. **Location** - Select an Azure datacenter location where the service is available, such as **South Central US**. 
   
    d. **Admin user** - If you want, enable an admin user to access the registry. You can change this setting after creating the registry.
   
   > [!IMPORTANT]
   > The admin user is intended only to test login to a newly created registry. In Preview, we recommend using an Azure Active Directory [service principal](https://azure.microsoft.com/documentation/articles/active-directory-application-objects/) to access the registry. For more information, see [Authenticate with a container registry](container-registry-authenticate.md).
   > 
   > 
   
    e. **Storage account** - Use the default for creating a new storage account, or select an existing storage account.
   
    ![Container registry settings](./media/container-registry-get-started-portal/container-registry-settings.png)

## Manage registry settings
After creating the registry, find the registry settings by starting at the **Container Registries** blade in the portal. For example, you might need the settings to login to your registry.

1. On the **Container Registries** blade, click the name of your registry.
   
    ![Container registry blade](./media/container-registry-get-started-portal/container-registry-blade.png)
2. To manage access settings, click **Access key**.
   
    ![Container registry access](./media/container-registry-get-started-portal/container-registry-access.png)
3. Note the following settings:
   
   * **Login server** - The fully qualified registry name you use when you login to push and pull Docker images.
   * **Admin user** - Toggle to enable or disable the registry's admin user account.
   * **Username** and **Password** - The credentials of the admin user account (if enabled) you can use to test login to the registry. 

## Next steps
* [Push your first image using the Docker CLI](container-registry-get-started-docker-cli.md)

## Additional docs
* [Create a container registry using the Azure CLI](container-registry-get-started-azure-cli.md)
* [Authenticate with a container registry](container-registry-authentication.md) 
* [Install the Azure CLI for Container Registry preview](./container-registry-get-started-azure-cli-install.md)

