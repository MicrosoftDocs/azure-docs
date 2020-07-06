---
title: Sync network configuration for Azure App Service 
titleSuffix: Azure SQL Managed Instance 
description: This article discusses how to sync your network configuration for Azure App Service hosting plan with your Azure SQL Managed Instance.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: operations
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: srdan-bozovic-msft
ms.author: srbozovi
ms.reviewer: sstein, bonova, carlrab
ms.date: 12/13/2018
---
# Sync networking configuration for Azure App Service hosting plan with Azure SQL Managed Instance
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

It might happen that although you [integrated your app with an Azure Virtual Network](../../app-service/web-sites-integrate-with-vnet.md), you can't establish a connection to SQL Managed Instance. Refreshing, or synchronizing, the networking configuration for your service plan can resolve this issue. 

## Sync network configuration 

To do that, follow these steps:  

1. Go to your web apps App Service plan.

   ![Screenshot of App Service plan](./media/azure-app-sync-network-configuration/app-service-plan.png)

2. Select **Networking** and then select **Click here to Manage**.

   ![Screenshot of manage service plan](./media/azure-app-sync-network-configuration/manage-plan.png)

3. Select your **VNet** and click **Sync Network**.

   ![Screenshot of sync network](./media/azure-app-sync-network-configuration/sync.png)

4. Wait until the sync is done.
  
   ![Screenshot of sync done](./media/azure-app-sync-network-configuration/sync-done.png)

You are now ready to try to re-establish your connection to your SQL Managed Instance.

## Next steps

- For information about configuring your VNet for SQL Managed Instance, see [SQL Managed Instance VNet architecture](connectivity-architecture-overview.md) and [How to configure existing VNet](vnet-existing-add-subnet.md).
