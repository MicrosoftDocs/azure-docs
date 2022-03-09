---
title: Managed Instance link - Use SSMS to replicate database 
titleSuffix: Azure SQL Managed Instance
description: This tutorial teaches you how to use Managed Instance link and SSMS to replicate database from SQL Server to Azure SQL Managed Instance.
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
# Tutorial: Create Managed Instance link and replicate database with SSMS

[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

Managed Instance link is in public preview.

Managed Instance link feature enables you to replicate your database hosted on SQL Server to Azure SQL Managed Instance. This tutorial will cover setting up Managed Instance link. More specifically, setting up database replication from SQL Server to Managed Instance with latest version of SSMS. This functionality is available in SSMS version 18.11 and newer.

## Managed Instance link database replication setup

Follow the steps described in this section to create Managed Instance link.

1. Managed Instance link database replication setup starts with connecting to SQL Server from SSMS.
    In the object explorer, select the database you want to replicate to Azure SQL Managed Instance. From database’s context menu, choose “Azure SQL Managed Instance link” and then “Replicate database”, as shown in the screenshot below.

    :::image type="content" source="./media/managed-instance-link-ssms/link-replicate-ssms-database-context-replicate-database.png" alt-text="Screenshot showing database's context menu option for replicate database.":::

2. Wizard that takes you thought the process of creating Managed Instance link will be started. Once the link is created, your source database will get its read-only replica on your target Azure SQL Managed Instance.

    Once the wizard starts, you'll see the Introduction window. Click Next to proceed.

    :::image type="content" source="./media/managed-instance-link-ssms/link-replicate-introduction.png" alt-text="Screenshot showing the introduction window for Managed Instance link replicate database wizard.":::

3. Wizard will check Managed Instance link requirements. If all requirements are met and you'll be able to click the Next button to continue.

    :::image type="content" source="./media/managed-instance-link-ssms/link-replicate-sql-server-requirements.png" alt-text="Screenshot showing SQL Server requirements window.":::

4. On the Select Databases window, choose one or more databases to be replicated via Managed Instance link. Make database selection and click Next.

    :::image type="content" source="./media/managed-instance-link-ssms/link-replicate-select-databases.png" alt-text="Screenshot showing Select Databases window.":::

5. On the Login to Azure and select Managed Instance window you'll need to sign-in to Microsoft Azure, select Subscription, Resource Group and Managed Instance. Finally, you'll need to provide login details for the chosen Managed Instance.

    :::image type="content" source="./media/managed-instance-link-ssms/link-replicate-login-to-azure.png" alt-text="Screenshot showing Login to Azure and select Managed Instance window.":::

6. Once all of that is populated, you'll be able to click Next.

    :::image type="content" source="./media/managed-instance-link-ssms/link-replicate-login-to-azure-populated.png" alt-text="Screenshot showing Login to Azure and select Managed Instance populated window.":::

7. On the Specify Distributed AG Options window, you'll see prepopulated values for the various parameters. Unless you need to customize something, you can proceed with the default options and click Next.

    :::image type="content" source="./media/managed-instance-link-ssms/link-replicate-distributed-ag-options.png" alt-text="Screenshot showing Specify Distributed AG options window.":::

8. On the Summary window you'll be able to see the steps for creating Managed Instance link. Optionally, you can generate the setup Script to save it or to run it yourself.
    Complete the wizard process by clicking on the Finish.

    :::image type="content" source="./media/managed-instance-link-ssms/link-replicate-summary.png" alt-text="Screenshot showing Summary window.":::

9. The Executing actions window will display the progress of the process.

    :::image type="content" source="./media/managed-instance-link-ssms/link-replicate-executing-actions.png" alt-text="Screenshot showing Executing actions window.":::

10. Results window will show up once the process is completed and all steps are marked with a green check sign. At this point, you can close the wizard.

    :::image type="content" source="./media/managed-instance-link-ssms/link-replicate-results.png" alt-text="Screenshot showing Results window.":::

11. With this, Managed Instance link has been created and chosen databases are being replicated to the Managed Instance.

    In Object explorer, you'll see that the source database hosted on SQL Server is now in “Synchronized” state. Also, under Always On High Availability, Availability Groups that Availability Group and Distributed Availability Group are created for Managed Instance link.

    :::image type="content" source="./media/managed-instance-link-ssms/link-replicate-ssms-sql-server-database.png" alt-text="Screenshot showing the state of SQL Server database and Availability Group and Distributed Availability Group in SSMS.":::

    We can also see a new database under target Managed Instance. Depending on the database size and network speed, initially you may see the database on the Managed Instance side in the “Restoring” state. Once the seeding from the SQL Server to Managed Instance is done, the database will be ready for read-only workload and visible as in the screenshot below.

    :::image type="content" source="./media/managed-instance-link-ssms/link-replicate-ssms-managed-instance-database.png" alt-text="Screenshot showing the state of Managed Instance database.":::

## Next steps

For more information about Managed Instance link feature, see the following resources:

- [Managed Instance link feature](./link-feature.md)