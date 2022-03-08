---
title: Managed Instance link - Use SSMS to failover database 
titleSuffix: Azure SQL Managed Instance
description: This tutorial teaches you how to use Managed Instance link and SSMS to failover database from SQL Server to Azure SQL Managed Instance.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: data-movement
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: tutorial
author: sasapopo
ms.author: sasapopo
ms.reviewer: mathoma
ms.date: 03/07/2022
---
# Tutorial: Perform Managed Instance link database failover with SSMS

[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

Managed Instance link is in preview.

Managed Instance link feature enables you to replicate and optionally migrate your database hosted on SQL Server to Azure SQL Managed Instance.

Once Managed Instance link database failover is performed from SSMS, the Managed Instance link is cut. Database hosted on SQL Server will become independent from database on Managed Instance and both databases will be able to perform read-write workload. This tutorial will cover performing Managed Instance link database failover by using latest version of SSMS (v18.11 and newer).

## Managed Instance link database failover (migration)

Follow the steps described in this section to perform Managed Instance link database failover.

1. Managed Instance link database failover starts with connecting to SQL Server from SSMS.
    To perform Managed Instance link database failover and migrate database from SQL Server to Managed Instance, open the context menu of the SQL Server database. Then select Azure SQL Managed Instance link and then choose Failover database option.

    :::image type="content" source="./media/managed-instance-link-ssms/link-failover-ssms-database-context-failover-database.png" alt-text="Screenshot showing database's context menu option for database failover.":::

2. When the wizard starts, click Next. 

    :::image type="content" source="./media/managed-instance-link-ssms/link-failover-introduction.png" alt-text="Screenshot showing Introduction window.":::

3. On the Log in to Azure window, sign-in to your Azure account, select Subscription that is hosting the Managed Instance and click Next.

    :::image type="content" source="./media/managed-instance-link-ssms/link-failover-login-to-azure.png" alt-text="Screenshot showing Log in to Azure window.":::

4. On the Failover type window, select the failover type, fill in the required details and click Next.

    In regular situations you should choose planned manual failover option and confirm that the workload on SQL Server database is stopped.

    :::image type="content" source="./media/managed-instance-link-ssms/link-failover-failover-type.png" alt-text="Screenshot showing Failover Type window.":::

> [!NOTE]
> If you are performing planned manual failover, you should stop the workload on the database hosted on the SQL Server to allow Managed Instance link to completely catch up with the replication, so that failover without data loss is possible.

5. In case Availability Group and Distributed Availability Group were created only for the purpose of Managed Instance link, you can choose to drop these objects on the Clean-up window. Dropping these objects is optional. Click Next.

    :::image type="content" source="./media/managed-instance-link-ssms/link-failover-cleanup-optional.png" alt-text="Screenshot showing Cleanup (optional) window.":::

6. In the Summary window, you will be able to review the upcoming process. Optionally you can create the script to save it, or to execute it manually. If everything is as expected and you want to proceed with the Managed Instance link database failover, click Finish.

    :::image type="content" source="./media/managed-instance-link-ssms/link-failover-summary.png" alt-text="Screenshot showing Summary window.":::

7. You will be able to track the progress of the process.

    :::image type="content" source="./media/managed-instance-link-ssms/link-failover-executing-actions.png" alt-text="Screenshot showing Executing actions window.":::

8. Once all steps are completed, click Close.

    :::image type="content" source="./media/managed-instance-link-ssms/link-failover-results.png" alt-text="Screenshot showing Results window.":::

9. After this, Managed Instance link no longer exists. Both databases on SQL Server and Managed Instance can execute read-write workload and are independent. 
    With this step, the migration of the database from SQL Server to Managed Instance is completed.

    Database on SQL Server.

    :::image type="content" source="./media/managed-instance-link-ssms/link-failover-ssms-sql-server-database.png" alt-text="Screenshot showing database on SQL Server in SSMS.":::

    Database on Managed Instance.

    :::image type="content" source="./media/managed-instance-link-ssms/link-failover-ssms-managed-instance-database.png" alt-text="Screenshot showing database on Managed Instance in SSMS.":::

## Next steps

For more information about Managed Instance link feature, see the following resources:

- [Managed Instance link feature](./link-feature.md)