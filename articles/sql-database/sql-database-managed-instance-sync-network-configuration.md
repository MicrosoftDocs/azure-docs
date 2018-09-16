---
title: Azure App Service - sync network configuration | Microsoft Docs
description: This article discusses how to sync your network configuration for Azure App Service hosting plan.
ms.service: sql-database
author: srdan-bozovic-msft
manager: craigg
ms.service: sql-database
ms.custom: managed instance
ms.topic: conceptual
ms.date: 03/07/2018
ms.author: srbozovi
ms.reviewer: bonova, carlrab
---

# Sync networking configuration for Azure App Service hosting plan

It might happen that although you [integrated your app with an Azure Virtual Network](../app-service/web-sites-integrate-with-vnet.md), you can't establish connection to Managed Instance. One thing you can try is to refresh networking configuration for your service plan. 

## Sync network configuration for App Service hosting plan

To do that, follow these steps:  

1. Go to your web apps App Service plan.
 
   ![app service plan](./media/sql-database-managed-instance-sync-networking/app-service-plan.png)

2. Click **Networking** and then click **Click here to Manage**.
 
   ![manage service plan](./media/sql-database-managed-instance-sync-networking/manage-plan.png)

3. Select your **VNet** and click **Sync Network**. 
 
   ![sync network](./media/sql-database-managed-instance-sync-networking/sync.png)

4. Wait until the sync is done.
  
   ![sync done](./media/sql-database-managed-instance-sync-networking/sync-done.png)

You are now ready to try to re-establish your connection to your Managed Instance.

## Next steps

- For information about configuring your VNet for Managed Instance, see [Managed Instance VNet configuration](sql-database-managed-instance-vnet-configuration.md).
