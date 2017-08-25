---
title: Managing Redis Caches using the Azure Explorer for Eclipse | Microsoft Docs
description: Learn how to manage your Azure redis caches by using the Azure Explorer for Eclipse.
services: ''
documentationcenter: java
author: rmcmurray
manager: erikre
editor: ''

ms.assetid: 
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: multiple
ms.devlang: Java
ms.topic: article
ms.date: 06/14/2017
ms.author: robmcm

---

# Managing Redis Caches using the Azure Explorer for Eclipse

The Azure Explorer, which is part of the Azure Toolkit for Eclipse, provides Java developers with an easy-to-use solution for managing redis caches in their Azure account from inside the Eclipse IDE.

[!INCLUDE [azure-toolkit-for-eclipse-prerequisites](../includes/azure-toolkit-for-eclipse-prerequisites.md)]

[!INCLUDE [azure-toolkit-for-eclipse-show-azure-explorer](../includes/azure-toolkit-for-eclipse-show-azure-explorer.md)]

## Create a Redis Cache by using Eclipse

The following steps walk you through the steps to create a redis cache using the Azure Explorer.

1. Sign in to your Azure account using the steps in the [Sign In Instructions for the Azure Toolkit for Eclipse] article.

1. In the **Azure Explorer** tool window, expand the **Azure** node, right-click **Redis Caches**, and then click **Create Redis Cache**.

   ![Create Redis Cache Menu][CR01]

1. When the **New Redis Cache** dialog box appears, specify the following options:

   ![Create New Redis Cache Dialog Box][CR02]

   a. **DNS Name**: Specifies the DNS subdomain for the new redis cache, which is prepended to ".redis.cache.windows.net"; for example: *wingtiptoys.redis.cache.windows.net*.

   b. **Subscription**: Specifies the Azure subscription you want to use for the new redis cache.

   c. **Resource Group**: Specifies the resource group for your redis cache; you need to choose one of the following options:
      * **Create New**: Specifies that you want to create a new resource group.
      * **Use Existing**: Specifies that you will choose from a list of resource groups associated with your Azure account.

   d. **Location**: Specifies the location where your redis cache is created; for example, *West US*.

   e. **Pricing Tier**: Specifies which pricing tier your redis cache uses; this setting determines the number of client connections. (For more information, see [Redis Cache Pricing].)

   f. **Non-SSL port**: Specifies whether your redis cache allows non-SSL connections; by default, only SSL connections are allowed.

1. When you have specified all your redis cache settings, click **OK**.

After your redis cache has been created, it will be displayed in the Azure Explorer.

   ![Redis Cache in Azure Explorer][CR03]

> [!NOTE]
>
> For more information about configuring your Azure redis cache settings, see [How to configure Azure Redis Cache].
>

## Display the properties for your Redis Cache in Eclipse

1. In the Azure Explorer, right-click your redis cache and click **Show properties**.

   ![Azure Explorer context menu to display properties for a redis cache][SP01]

1. The Azure Explorer displays the properties for your redis cache.

   ![Redis cache properties][SP02]

## Delete your Redis Cache by using Eclipse

1. In the Azure Explorer, right-click your redis cache and click **Delete**.

   ![Azure Explorer context menu to delete a redis cache][DE01]

1. Click **OK** when prompted to delete your redis cache.

   ![Delete redis cache prompt][DE02]

## Next steps

[!INCLUDE [azure-toolkit-additional-resources](../includes/azure-toolkit-additional-resources.md)]

For more information about Azure redis caches, configuration settings and pricing, see the following links:

* [Azure Redis Cache]
* [Redis Cache Documentation]
* [Redis Cache Pricing]
* [How to configure Azure Redis Cache]

<!-- URL List -->

[Redis Cache Pricing]: https://azure.microsoft.com/pricing/details/cache/
[Azure Redis Cache]: https://azure.microsoft.com/services/cache/
[Redis Cache Documentation]: ./redis-cache/index.md
[How to configure Azure Redis Cache]: ./redis-cache/cache-configure.md
[Sign In Instructions for the Azure Toolkit for Eclipse]: ./azure-toolkit-for-eclipse-sign-in-instructions.md

<!-- IMG List -->

[CR01]: ./media/azure-toolkit-for-eclipse-managing-redis-caches-using-azure-explorer/CR01.png
[CR02]: ./media/azure-toolkit-for-eclipse-managing-redis-caches-using-azure-explorer/CR02.png
[CR03]: ./media/azure-toolkit-for-eclipse-managing-redis-caches-using-azure-explorer/CR03.png

[SP01]: ./media/azure-toolkit-for-eclipse-managing-redis-caches-using-azure-explorer/SP01.png
[SP02]: ./media/azure-toolkit-for-eclipse-managing-redis-caches-using-azure-explorer/SP02.png

[DE01]: ./media/azure-toolkit-for-eclipse-managing-redis-caches-using-azure-explorer/DE01.png
[DE02]: ./media/azure-toolkit-for-eclipse-managing-redis-caches-using-azure-explorer/DE02.png
