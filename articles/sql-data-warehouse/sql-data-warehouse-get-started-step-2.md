---
title: Step 2: Create an Azure SQL Data Warehouse | Microsoft Docs
description: Get Started Tutorial with Azure SQL Data Warehouse.
services: sql-data-warehouse
documentationcenter: NA
author: hirokib
manager: johnmac
editor: ''

ms.assetid: E3705FB6-A3E1-454D-B918-562B577B8D89
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: hero-article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.date: 10/31/2016
ms.author: elbutter

---
# Step 2: Create an Azure SQL Data Warehouse

> [!NOTE]
> Creating a SQL Data Warehouse might result in a new billable service.  For more details, see [SQL Data Warehouse pricing](https://azure.microsoft.com/pricing/details/sql-data-warehouse/).
>


## Create a SQL Data Warehouse
1. Sign in to the [Azure portal](https://portal.azure.com).
2. Click **New** > **Databases** > **SQL Data Warehouse**.


![NewBlade](../../includes/media/sql-data-warehouse-create-dw/blade-click-new.png).

![SelectDW](../../includes/media/sql-data-warehouse-create-dw/blade-select-dw.png)

3. Fill out deployment details

**Database Name**: Pick anything you'd like. We recommend your database includes information about your SQL DW instance such as 
name, region, and environments, if you have multiple, such as *mydw-westus-1-test*

**Subscription**: Your Azure Subscription

**Resource Group**: Create new (or use existing if you plan on using your Azure SQL Data Warehouse with other services)
> [!NOTE]
> Services within a resource group should have the same lifecycle. Resource groups are useful for resource
> administration such as scoping access control and templated deployment. 
> Read more about Azure resource groups and best practices [here](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview#resource-groups)
>

**Source**: Blank Database

**Server**: Select the server you created in [Step 1](./sql-data-warehouse-get-started-step-1.md).

**Collation**: Leave the default collation SQL_Latin1_General_CP1_CI_AS

**Select performance**: We recommend using staying with the standard 400DWU

4. Choose **Pin to dashboard**

![Pin To Dashboard](./media/sql-data-warehouse-get-started-tutorial/pin-to-dashboard.png)

5. Sit back and wait for your Azure SQL Data Warehouse to deploy! It's normal for this process to take several minutes. 
The portal will notify you when your instance is done deploying. 

