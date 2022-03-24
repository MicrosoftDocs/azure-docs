---
title: Fail over a database by using the link in SSMS
titleSuffix: Azure SQL Managed Instance
description: Learn how to use the link feature in SQL Server Management Studio (SSMS) to fail over a database from SQL Server to Azure SQL Managed Instance.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: data-movement
ms.custom: 
ms.devlang: 
ms.topic: guide
author: sasapopo
ms.author: sasapopo
ms.reviewer: mathoma, danil
ms.date: 03/10/2022
---
# Fail over a database by using the link in SSMS - Azure SQL Managed Instance

[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This article teaches you how to fail over a database from SQL Server to Azure SQL Managed Instance by using [the link feature](link-feature.md) in SQL Server Management Studio (SSMS). 

Failing over your database from SQL Server to SQL Managed Instance breaks the link between the two databases. It stops replication and leaves both databases in an independent state, ready for individual read/write workloads. 

> [!NOTE]
> The link is a feature of Azure SQL Managed Instance and is currently in preview. 

## Prerequisites 

To fail over your databases to SQL Managed Instance, you need the following prerequisites: 

- An active Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- [SQL Server 2019 Enterprise or Developer edition](https://www.microsoft.com/en-us/evalcenter/evaluate-sql-server-2019), starting with [CU15 (15.0.4198.2)](https://support.microsoft.com/topic/kb5008996-cumulative-update-15-for-sql-server-2019-4b6a8ee9-1c61-482d-914f-36e429901fb6).
- Azure SQL Managed Instance. [Get started](instance-create-quickstart.md) if you don't have it. 
- [SQL Server Management Studio v18.11.1 or later](/sql/ssms/download-sql-server-management-studio-ssms).
- [An environment that's prepared for replication](managed-instance-link-preparation.md).
- [Setup of the link feature and replication of your database to your managed instance in Azure](managed-instance-link-use-ssms-to-replicate-database.md). 

## Fail over a database

In the following steps, you use the **Failover database to Managed Instance** wizard in SSMS to fail over your database from SQL Server to SQL Managed Instance. The wizard takes you through failing over your database, breaking the link between the two instances in the process. 

> [!CAUTION]
> If you're performing a planned manual failover, stop the workload on the source SQL Server database to allow the SQL Managed Instance replicated database to completely catch up and fail over without data loss. If you're performing a forced failover, you might lose data. 

1. Open SSMS and connect to your SQL Server instance. 
1. In Object Explorer, right-click your database, hover over **Azure SQL Managed Instance link**, and select **Failover database** to open the **Failover database to Managed Instance** wizard. 

   :::image type="content" source="./media/managed-instance-link-use-ssms-to-failover-database/link-failover-ssms-database-context-failover-database.png" alt-text="Screenshot that shows a database's context menu option for failover.":::

1. On the **Introduction** page of the **Failover database to Managed Instance** wizard, select **Next**.

   :::image type="content" source="./media/managed-instance-link-use-ssms-to-failover-database/link-failover-introduction.png" alt-text="Screenshot that shows the Introduction page.":::


3. On the **Log in to Azure** page, select **Sign-in** to provide your credentials and sign in to your Azure account. Select the subscription that's hosting SQL Managed Instance from the dropdown list, and then select **Next**. 

    :::image type="content" source="./media/managed-instance-link-use-ssms-to-failover-database/link-failover-login-to-azure.png" alt-text="Screenshot that shows the page for signing in to Azure.":::

4. On the **Failover Type** page, choose the type of failover you're performing. Select the box to confirm that you've stopped the workload for a planned failover, or you understand that you might lose data if using a forced failover. Select **Next**. 

   :::image type="content" source="./media/managed-instance-link-use-ssms-to-failover-database/link-failover-failover-type.png" alt-text="Screenshot that shows the Failover Type page.":::

1. On the **Clean-up (optional)** page, choose to drop the availability group if you created it solely for the purpose of migrating your database to Azure and you no longer need it. If you want to keep the availability group, leave the boxes cleared. Select **Next**. 


   :::image type="content" source="./media/managed-instance-link-use-ssms-to-failover-database/link-failover-cleanup-optional.png" alt-text="Screenshot that shows the page for the option of deleting an availability group.":::

1. On the **Summary** page, review the actions that will be performed for your failover. Optionally, select **Script** to create a script that you can run at a later time. When you're ready to proceed with the failover, select **Finish**. 

   :::image type="content" source="./media/managed-instance-link-use-ssms-to-failover-database/link-failover-summary.png" alt-text="Screenshot that shows the Summary page.":::

7. The **Executing actions** page displays the progress of each action.  

    :::image type="content" source="./media/managed-instance-link-use-ssms-to-failover-database/link-failover-executing-actions.png" alt-text="Screenshot that shows the page for executing actions.":::

8. After all steps finish, the **Results** page shows check marks next to the successfully completed actions. You can now close the window. 

    :::image type="content" source="./media/managed-instance-link-use-ssms-to-failover-database/link-failover-results.png" alt-text="Screenshot that shows the Results page with completed status.":::

## View the failed-over database 

During the failover process, the link is dropped and no longer exists. The source SQL Server database and the target SQL Managed Instance database can both execute a read/write workload. They're completely independent. 

You can validate that the link bas been dropped by reviewing the database on SQL Server. 

:::image type="content" source="./media/managed-instance-link-use-ssms-to-failover-database/link-failover-ssms-sql-server-database.png" alt-text="Screenshot that shows a database on SQL Server in S S M S.":::

Then, review the database on SQL Managed Instance. 

:::image type="content" source="./media/managed-instance-link-use-ssms-to-failover-database/link-failover-ssms-managed-instance-database.png" alt-text="Screenshot that shows a database on SQL Managed Instance in S S M S.":::

## Next steps

To learn more, see [Link feature for Azure SQL Managed Instance](link-feature.md). 
