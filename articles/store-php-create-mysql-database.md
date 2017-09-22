---
title: Create and connect to a MySQL database in Azure
description: Learn how to use the Azure portal to create a MySQL database and then connect to it from a PHP web app in Azure.
documentationcenter: php
services: app-service\web
author: cephalin
manager: erikre
editor: ''
tags: mysql

ms.assetid: 55465a9a-7e65-4fd9-8a65-dd83ee41f3e5
ms.service: multiple
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: PHP
ms.topic: article
ms.date: 04/25/2017
ms.author: robmcm;cephalin

---
# Create and connect to a MySQL database in Azure
This tutorial shows you how to create a MySQL database in the [Azure portal](https://portal.azure.com) (provider is [ClearDB](http://www.cleardb.com/)) and how to connect to it from a PHP web app running in
[Azure App Service](app-service/app-service-web-overview.md).

> [!NOTE]
> You can also create a MySQL database as part of a <a href="https://portal.azure.com/#create/WordPress.WordPress" target="_blank">Marketplace app template</a>.
>
>

## Create a MySQL database in Azure portal
To create a MySQL database in the Azure portal, do the following:

1. Log in to the [Azure portal](https://portal.azure.com).
2. From the left menu, click **New** > **Data + Storage** > **MySQL Database**.

    ![Create a MySQL database in Azure - start](./media/store-php-create-mysql-database/create-db-1-start.png)
3. In the New MySQL Database [blade](azure-portal-overview.md), configure your new MySQL database as follows (*blade*: a portal page that opens horizontally):

   * **Database Name**: Type a uniquely identifiable name
   * **Subscription**: Choose the subscription to use
   * **Database Type**: Select **Shared** for low-cost or free tiers, or **Dedicated** to get dedicated resources.
   * **Resource group**: Add the MySQL database to an existing [resource group](azure-resource-manager/resource-group-overview.md) or put it in a new one. Resources in the same group
     can be easily managed together.
   * **Location**: Select a location close to you. When adding to an existing resource group, you're locked to the resource group's location.
   * **Pricing Tier**: Click **Pricing Tier**, then select a pricing option (**Mercury** tier is free), and then click **Select**.
   * **Legal Terms**: Click **Legal Terms**, review the purchase details, and click **Purchase**.
   * **Pin to dashboard**: Select if you want to access it directly from the dashboard. This is especially helpful if you aren't familiar with
     portal navigation yet.

     The following screenshot is just an example of how you can configure your MySQL database.  
     ![Create a MySQL database in Azure - configure](./media/store-php-create-mysql-database/create-db-2-configure.png)
4. When you're done configuring, click **Create**.

    ![Create a MySQL database in Azure - create](./media/store-php-create-mysql-database/create-db-3-create.png)

    You will see a pop-up notification letting you know that deployment has started.

    ![Create a MySQL database in Azure - in progress](./media/store-php-create-mysql-database/create-db-4-started-status.png)

    You will get another pop-up once deployment has succeeded. The portal will also open your MySQL database blade automatically.

<a name="connect"></a>

## Connect to your MySQL database
To see the connection information for your new MySQL database, just click **Properties** in your web app's blade.

![Create a MySQL database in Azure - MySQL database blade](./media/store-php-create-mysql-database/create-db-5-finished-db-blade.png)

You can now use that connection information in any web app. A sample that shows how to use the connection information from a simple
PHP app is available [here](https://github.com/WindowsAzure/azure-sdk-for-php-samples/tree/master/tasklist-mysql).

## Next steps
For more information, see the [PHP Developer Center](/develop/php/).
