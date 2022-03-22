---
title: Replicate database with link feature in SSMS
titleSuffix: Azure SQL Managed Instance
description: This guide teaches you how to use the SQL Managed Instance link in SQL Server Management Studio (SSMS) to replicate database from SQL Server to Azure SQL Managed Instance.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: data-movement
ms.custom: 
ms.devlang: 
ms.topic: guide
author: sasapopo
ms.author: sasapopo
ms.reviewer: mathoma, danil
ms.date: 03/22/2022
---
# Replicate database with link feature in SSMS - Azure SQL Managed Instance

[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This article teaches you to use the [Managed Instance link feature](link-feature.md) to replicate your database from SQL Server to Azure SQL Managed Instance in SQL Server Management Studio (SSMS). 

Before configuring replication for your database through the link feature, make sure you've [prepared your environment](managed-instance-link-preparation.md). 

> [!NOTE]
> The link feature for Azure SQL Managed Instance is currently in preview. 

## Prerequisites 

To replicate your databases to Azure SQL Managed Instance, you need the following prerequisites: 

- An active Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- [SQL Server 2019 Enterprise or Developer edition](https://www.microsoft.com/en-us/evalcenter/evaluate-sql-server-2019), starting with [CU15 (15.0.4198.2)](https://support.microsoft.com/topic/kb5008996-cumulative-update-15-for-sql-server-2019-4b6a8ee9-1c61-482d-914f-36e429901fb6).
- An instance of Azure SQL Managed Instance. [Get started](instance-create-quickstart.md) if you don't have one. 
- [SQL Server Management Studio (SSMS) v18.11.1 or later](/sql/ssms/download-sql-server-management-studio-ssms).
- A properly [prepared environment](managed-instance-link-preparation.md).

## Replicate database

Use the **New Managed Instance link** wizard in SQL Server Management Studio (SSMS) to setup the link between your instance of SQL Server and your instance of SQL Managed Instance. The wizard takes you through the process of creating the Managed Instance link. Once the link is created, your source database gets a read-only replica copy on your target Azure SQL Managed Instance. 

> [!NOTE]
> The link supports replication of user databases only. Replication of system databases is not supported. To replicate instance-level objects (stored in master or msdb databases), we recommend to script them out and run T-SQL scripts on the destination instance.

To set up the Managed Instance link, follow these steps: 

1. Open SQL Server Management Studio (SSMS) and connect to your instance of SQL Server. 
1. In **Object Explorer**, right-click your database, hover over **Azure SQL Managed Instance link** and select **Replicate database** to open the **New Managed Instance link** wizard. If SQL Server version isn't supported, this option won't be available in the context menu.

    :::image type="content" source="./media/managed-instance-link-use-ssms-to-replicate-database/link-replicate-ssms-database-context-replicate-database.png" alt-text="Screenshot showing database's context menu option to replicate database after hovering over Azure SQL Managed Instance link.":::

1. Select **Next** on the **Introduction** page of the **New Managed Instance link** wizard: 

    :::image type="content" source="./media/managed-instance-link-use-ssms-to-replicate-database/link-replicate-introduction.png" alt-text="Screenshot showing the introduction page for Managed Instance link replicate database wizard.":::

1. On the **Requirements** page, the wizard validates requirements to establish a link to your SQL Managed Instance. Select **Next** once all the requirements are validated: 

    :::image type="content" source="./media/managed-instance-link-use-ssms-to-replicate-database/link-replicate-sql-server-requirements.png" alt-text="Screenshot showing S Q L Server requirements page.":::

1. On the **Select Databases** page, choose one or more databases you want to replicate to your SQL Managed Instance via the Managed Instance link. Select **Next**: 

    :::image type="content" source="./media/managed-instance-link-use-ssms-to-replicate-database/link-replicate-select-databases.png" alt-text="Screenshot showing Select Databases page.":::

1. On the **Login to Azure and select Managed Instance** page, select **Sign In...** to sign into Microsoft Azure. Choose the subscription, resource group, and target managed instance from the drop-downs. Select **Login** and provide login details for the SQL Managed Instance: 

    :::image type="content" source="./media/managed-instance-link-use-ssms-to-replicate-database/link-replicate-login-to-azure.png" alt-text="Screenshot showing Login to Azure and select Managed Instance page.":::

1. After providing all necessary information, select **Next**: 

    :::image type="content" source="./media/managed-instance-link-use-ssms-to-replicate-database/link-replicate-login-to-azure-populated.png" alt-text="Screenshot showing Login to Azure and select Managed Instance populated page.":::

1. Review the prepopulated values on the **Specify Distributed AG Options** page, and change any that need customization. When ready, select **Next**.  

    :::image type="content" source="./media/managed-instance-link-use-ssms-to-replicate-database/link-replicate-distributed-ag-options.png" alt-text="Screenshot showing Specify Distributed A G options page.":::

1. Review the actions on the **Summary** page, and select **Finish** when ready. (Optionally) You can also create a script to save and run yourself at a later time. 

    :::image type="content" source="./media/managed-instance-link-use-ssms-to-replicate-database/link-replicate-summary.png" alt-text="Screenshot showing Summary window.":::

1. The **Executing actions** page displays the progress of each action:  

    :::image type="content" source="./media/managed-instance-link-use-ssms-to-replicate-database/link-replicate-executing-actions.png" alt-text="Screenshot showing Executing actions page.":::

1. After all steps complete, the **Results** page shows a completed status, with checkmarks next to each successfully completed action. You can now close the window: 

    :::image type="content" source="./media/managed-instance-link-use-ssms-to-replicate-database/link-replicate-results.png" alt-text="Screenshot showing Results page.":::

## View replicated database

After the Managed Instance link is created, the selected databases are replicated to the SQL Managed Instance. 

Use **Object Explorer** on your SQL Server instance to view the `Synchronized` status of the replicated database, and expand **Always On High Availability** and **Availability Groups** to view the distributed availability group that is created for the Managed Instance link. 

:::image type="content" source="./media/managed-instance-link-use-ssms-to-replicate-database/link-replicate-ssms-sql-server-database.png" alt-text="Screenshot showing the state of S Q L Server database and Availability Group and Distributed Availability Group in S S M S.":::

Connect to  your SQL Managed Instance and use **Object Explorer** to view your replicated database. Depending on the database size and network speed, the database may initially be in a `Restoring` state. After initial seeding completes, the database is restored to the SQL Managed Instance and ready for read-only workloads: 

:::image type="content" source="./media/managed-instance-link-use-ssms-to-replicate-database/link-replicate-ssms-managed-instance-database.png" alt-text="Screenshot showing the state of Managed Instance database.":::

## Next steps

To break the link and failover your database to the SQL Managed Instance, see [failover database](managed-instance-link-use-ssms-to-failover-database.md).  To learn more, see [Link feature in Azure SQL Managed Instance](link-feature.md).
