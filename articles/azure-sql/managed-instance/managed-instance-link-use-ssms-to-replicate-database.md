---
title: Replicate a database by using the link in SSMS
titleSuffix: Azure SQL Managed Instance
description: Learn how to use a link feature in SQL Server Management Studio (SSMS) to replicate a database from SQL Server to Azure SQL Managed Instance.
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
# Replicate a database by using the link feature in SSMS - Azure SQL Managed Instance

[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This article teaches you how to replicate your database from SQL Server to Azure SQL Managed Instance by using [the link feature](managed-instance-link-feature-overview.md) in SQL Server Management Studio (SSMS).  

> [!NOTE]
> The link is a feature of Azure SQL Managed Instance and is currently in preview. 

## Prerequisites 

To replicate your databases to SQL Managed Instance through the link, you need the following prerequisites: 

- An active Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- [SQL Server 2019 Enterprise or Developer edition](https://www.microsoft.com/en-us/evalcenter/evaluate-sql-server-2019), starting with [CU15 (15.0.4198.2)](https://support.microsoft.com/topic/kb5008996-cumulative-update-15-for-sql-server-2019-4b6a8ee9-1c61-482d-914f-36e429901fb6).
- Azure SQL Managed Instance. [Get started](instance-create-quickstart.md) if you don't have it. 
- [SQL Server Management Studio v18.11.1 or later](/sql/ssms/download-sql-server-management-studio-ssms).
- A properly [prepared environment](managed-instance-link-preparation.md).


## Replicate a database

In the following steps, you use the **New Managed Instance link** wizard in SSMS to create the link between SQL Server and SQL Managed Instance. After you create the link, your source database gets a read-only replica copy on your target managed instance. 

> [!NOTE]
> The link supports replication of user databases only. Replication of system databases is not supported. To replicate instance-level objects (stored in master or msdb databases), we recommend that you script them out and run T-SQL scripts on the destination instance.

1. Open SSMS and connect to your SQL Server instance. 
1. In Object Explorer, right-click your database, hover over **Azure SQL Managed Instance link**, and select **Replicate database** to open the **New Managed Instance link** wizard. If your SQL Server version isn't supported, this option won't be available on the context menu.

    :::image type="content" source="./media/managed-instance-link-use-ssms-to-replicate-database/link-replicate-ssms-database-context-replicate-database.png" alt-text="Screenshot that shows a database's context menu option for replication.":::

1. On the **Introduction** page of the wizard, select **Next**. 

    :::image type="content" source="./media/managed-instance-link-use-ssms-to-replicate-database/link-replicate-introduction.png" alt-text="Screenshot that shows the Introduction page of the wizard for creating a new Managed Instance link.":::

1. On the **SQL Server requirements** page, the wizard validates requirements to establish a link to SQL Managed Instance. Select **Next** after all the requirements are validated. 

    :::image type="content" source="./media/managed-instance-link-use-ssms-to-replicate-database/link-replicate-sql-server-requirements.png" alt-text="Screenshot that shows the Requirements page for a Managed Instance link.":::

1. On the **Select Databases** page, choose one or more databases that you want to replicate to SQL Managed Instance via the link feature. Then select **Next**. 

    :::image type="content" source="./media/managed-instance-link-use-ssms-to-replicate-database/link-replicate-select-databases.png" alt-text="Screenshot that shows the Select Databases page.":::

1. On the **Login to Azure and select Managed Instance** page, select **Sign In** to sign in to Microsoft Azure.  

    :::image type="content" source="./media/managed-instance-link-use-ssms-to-replicate-database/link-replicate-login-to-azure.png" alt-text="Screenshot that shows the area for signing in to Azure.":::

1. On the **Login to Azure and select Managed Instance** page, choose the subscription, resource group, and target managed instance from the dropdown lists. Select **Login** and provide login details for SQL Managed Instance. After you've provided all necessary information, select **Next**. 

    :::image type="content" source="./media/managed-instance-link-use-ssms-to-replicate-database/link-replicate-login-to-azure-populated.png" alt-text="Screenshot that shows the populated page for selecting a managed instance.":::

1. Review the prepopulated values on the **Specify Distributed AG Options** page, and change any that need customization. When you're ready, select **Next**.  

    :::image type="content" source="./media/managed-instance-link-use-ssms-to-replicate-database/link-replicate-distributed-ag-options.png" alt-text="Screenshot that shows the Specify Distributed A G Options page.":::

1. Review the actions on the **Summary** page. Optionally, select **Script** to create a script that you can run at a later time. When you're ready, select **Finish**.  

    :::image type="content" source="./media/managed-instance-link-use-ssms-to-replicate-database/link-replicate-summary.png" alt-text="Screenshot that shows the Summary page.":::

1. The **Executing actions** page displays the progress of each action.  

    :::image type="content" source="./media/managed-instance-link-use-ssms-to-replicate-database/link-replicate-executing-actions.png" alt-text="Screenshot that shows the page for executing actions.":::

1. After all steps finish, the **Results** page shows check marks next to the successfully completed actions. You can now close the window. 

    :::image type="content" source="./media/managed-instance-link-use-ssms-to-replicate-database/link-replicate-results.png" alt-text="Screenshot that shows the Results page with completed status.":::

## View a replicated database

After the link is created, the selected databases are replicated to the managed instance. 

Use Object Explorer on your SQL Server instance to view the **Synchronized** status of the replicated database. Expand **Always On High Availability** and **Availability Groups** to view the distributed availability group that's created for the link. 

:::image type="content" source="./media/managed-instance-link-use-ssms-to-replicate-database/link-replicate-ssms-sql-server-database.png" alt-text="Screenshot that shows the state of the SQL Server database and availability group, and the distributed availability group in S S M S.":::

Connect to your managed instance and use Object Explorer to view your replicated database. Depending on the database size and network speed, the database might initially be in a **Restoring** state. After initial seeding finishes, the database is restored to the managed instance and ready for read-only workloads. 

:::image type="content" source="./media/managed-instance-link-use-ssms-to-replicate-database/link-replicate-ssms-managed-instance-database.png" alt-text="Screenshot that shows the state of the SQL Managed Instance database.":::

## Next steps

To break the link and fail over your database to SQL Managed Instance, see [Fail over a database](managed-instance-link-use-ssms-to-failover-database.md). To learn more, see [Link feature for Azure SQL Managed Instance](managed-instance-link-feature-overview.md).
