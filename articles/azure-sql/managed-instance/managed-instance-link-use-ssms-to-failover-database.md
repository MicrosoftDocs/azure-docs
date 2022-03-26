---
title: Failover database with link feature in SSMS
titleSuffix: Azure SQL Managed Instance
description: This guide teaches you how to use the SQL Managed Instance link in SQL Server Management Studio (SSMS) to failover database from SQL Server to Azure SQL Managed Instance.
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
# Failover database with link feature in SSMS - Azure SQL Managed Instance

[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This article teaches you to use the [Managed Instance link feature](link-feature.md) to failover your database from SQL Server to Azure SQL Managed Instance in SQL Server Management Studio (SSMS). 

Failing over your database from your SQL Server instance to your SQL Managed Instance breaks the link between the two databases, stopping replication, and leaving both databases in an independent state, ready for individual read-write workloads. 

Before failing over your database, make sure you've [prepared your environment](managed-instance-link-preparation.md) and [configured replication through the link feature](managed-instance-link-use-ssms-to-replicate-database.md). 

> [!NOTE]
> The link feature for Azure SQL Managed Instance is currently in preview. 

## Prerequisites 

To failover your databases to Azure SQL Managed Instance, you need the following prerequisites: 

- An active Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- [SQL Server 2019 Enterprise or Developer edition](https://www.microsoft.com/en-us/evalcenter/evaluate-sql-server-2019), starting with [CU15 (15.0.4198.2)](https://support.microsoft.com/topic/kb5008996-cumulative-update-15-for-sql-server-2019-4b6a8ee9-1c61-482d-914f-36e429901fb6).
- An instance of Azure SQL Managed Instance. [Get started](instance-create-quickstart.md) if you don't have one. 
- [SQL Server Management Studio (SSMS) v18.11.1 or later](/sql/ssms/download-sql-server-management-studio-ssms).
- [Prepared your environment for replication](managed-instance-link-preparation.md)
- Setup the [link feature and replicated your database to your managed instance in Azure](managed-instance-link-use-ssms-to-replicate-database.md). 

## Failover database

Use the **Failover database to Managed Instance** wizard in SQL Server Management Studio (SSMS) to failover your database from your instance of SQL Server to your instance of SQL Managed Instance. The wizard takes you through the failing over your database, breaking the link between the two instances in the process. 

> [!CAUTION]
> If you are performing a planned manual failover, stop the workload on the database hosted on the source SQL Server to allow the replicated database on the SQL Managed Instance to completely catch up and failover without data loss. If you are performing a forced failover, there may be data loss. 

To failover your database, follow these steps: 

1. Open SQL Server Management Studio (SSMS) and connect to your instance of SQL Server. 
1. In **Object Explorer**, right-click your database, hover over **Azure SQL Managed Instance link** and select **Failover database** to open the **Failover database to Managed Instance** wizard: 

   :::image type="content" source="./media/managed-instance-link-use-ssms-to-failover-database/link-failover-ssms-database-context-failover-database.png" alt-text="Screenshot showing database's context menu option for database failover.":::

1. Select **Next** on the **Introduction** page of the **Failover database to Managed Instance** wizard:

   :::image type="content" source="./media/managed-instance-link-use-ssms-to-failover-database/link-failover-introduction.png" alt-text="Screenshot showing Introduction page.":::


3. On the **Log in to Azure** page, select **Sign-in** to provide your credentials and sign into your Azure account. Select the subscription that is hosting your SQL Managed Instance from the drop-down and then select **Next**: 

    :::image type="content" source="./media/managed-instance-link-use-ssms-to-failover-database/link-failover-login-to-azure.png" alt-text="Screenshot showing Log in to Azure page.":::

4. On the **Failover type** page, choose the type of failover you're performing and check the box to confirm that you've either stopped the workload for a planned failover, or you understand that there may be data loss for a forced failover. Select **Next**: 

   :::image type="content" source="./media/managed-instance-link-use-ssms-to-failover-database/link-failover-failover-type.png" alt-text="Screenshot showing Failover Type page.":::

1. On the **Clean up (optional)**, choose to drop the availability group if it was created solely for the purpose of migrating your database to Azure and you no longer need the availability group. If you want to keep the availability group, then leave the boxes unchecked. Select **Next**: 


   :::image type="content" source="./media/managed-instance-link-use-ssms-to-failover-database/link-failover-cleanup-optional.png" alt-text="Screenshot showing Cleanup (optional) page.":::

1. On the **Summary** page, review the actions that will be performed for your failover. (Optionally) You can also create a script to save and run yourself at a later time. When you're ready to proceed with the failover, select **Finish**: 

   :::image type="content" source="./media/managed-instance-link-use-ssms-to-failover-database/link-failover-summary.png" alt-text="Screenshot showing Summary page.":::

7. The **Executing actions** page displays the progress of each action:  

    :::image type="content" source="./media/managed-instance-link-use-ssms-to-failover-database/link-failover-executing-actions.png" alt-text="Screenshot showing Executing actions page.":::

8. After all steps complete, the **Results** page shows a completed status, with checkmarks next to each successfully completed action. You can now close the window: 

    :::image type="content" source="./media/managed-instance-link-use-ssms-to-failover-database/link-failover-results.png" alt-text="Screenshot showing Results window.":::

## View failed over database 

During the failover process, the Managed Instance link is dropped and no longer exists. Both databases on the source SQL Server instance and target SQL Managed Instance can execute a read-write workload, and are completely independent. 

You can validate this by reviewing the database on the SQL Server: 

:::image type="content" source="./media/managed-instance-link-use-ssms-to-failover-database/link-failover-ssms-sql-server-database.png" alt-text="Screenshot showing database on S Q L Server in S S M S.":::

And then reviewing the database on the SQL Managed Instance: 

:::image type="content" source="./media/managed-instance-link-use-ssms-to-failover-database/link-failover-ssms-managed-instance-database.png" alt-text="Screenshot showing database on Managed Instance in S S M S.":::

## Next steps

For more information about Managed Instance link feature, see the following resources:

To learn more, review [Link feature in Azure SQL Managed Instance](link-feature.md). 
