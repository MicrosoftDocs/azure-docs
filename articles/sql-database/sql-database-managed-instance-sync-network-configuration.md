---
title: Sync network configuration for Azure App Service 
titleSuffix: Azure SQL Managed Instance 
description: This article discusses how to sync your network configuration for Azure App Service hosting plan with your Azure SQL Managed Instance.
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: srdan-bozovic-msft
ms.author: srbozovi
ms.reviewer: sstein, bonova, carlrab
ms.date: 12/13/2018
---
# Sync networking configuration for Azure App Service hosting plan with Azure SQL Managed Instance

It might happen that although you [integrated your app with an Azure Virtual Network](../app-service/web-sites-integrate-with-vnet.md), you can't establish a connection to SQL Managed Instance. Refreshing, or synchronizing, the networking configuration for your service plan can resolve this issue. 

## Sync network configuration 

To do that, follow these steps:  

1. Go to your web apps App Service plan.

   ![app service plan](./media/sql-database-managed-instance-sync-networking/app-service-plan.png)

2. Select **Networking** and then select **Click here to Manage**.

   ![manage service plan](./media/sql-database-managed-instance-sync-networking/manage-plan.png)

3. Select your **VNet** and click **Sync Network**.

   ![sync network](./media/sql-database-managed-instance-sync-networking/sync.png)

4. Wait until the sync is done.
  
   ![sync done](./media/sql-database-managed-instance-sync-networking/sync-done.png)

You are now ready to try to re-establish your connection to your SQL Managed Instance.

## Next steps

- For information about configuring your VNet for SQL Managed Instance, see [SQL Managed Instance VNet architecture](sql-database-managed-instance-connectivity-architecture.md) and [How to configure existing VNet](sql-database-managed-instance-configure-vnet-subnet.md).
