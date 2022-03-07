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

Managed Instance link feature enables you to replicate your database hosted on SQL Server to Azure SQL Managed Instance. This tutorial will cover setting up Managed Instance link, more specifically setting up database replication from SQL Server to Managed Instance by using latest version of SSMS (v18.11 and newer).

Managed Instance link database replication setup starts with connecting to SQL Server from SSMS.

In the object explorer select the database you want to replicate to Azure SQL Managed Instance. From database’s context menu, choose “Azure SQL Managed Instance link” and then “Replicate database”, as shown in the screenshot below.

:::image type="content" source="./media/mi-link-use-ssms-to-replicate-database/mi-link-ssms-database-context-replicate-database.png" alt-text="From the context menu choose replicate database option.":::

This will start the wizard that takes you thought the process of creating Managed Instance link. Once the link is created your source database will get its read-only replica on your target Azure SQL Managed Instance.

Once the wizard starts, you will see the Introduction window. Click Next to proceed.

:::image type="content" source="./media/mi-link-use-ssms-to-replicate-database/mi-link-replicate-database-wizard-introduction-window.png" alt-text="Introduction window":::

Wizard will check Managed Instance link requirements and if all of them are met that will be stated on the window, and you will be able to click the Next button to continue.

:::image type="content" source="./media/mi-link-use-ssms-to-replicate-database/mi-link-replicate-database-wizard-sql-server-requirements-window.png" alt-text="SQL Server requirements window":::

On the Select Databases window choose one or more databases to be replicated via Managed Instance link. Make database selection and click Next.

:::image type="content" source="./media/mi-link-use-ssms-to-replicate-database/mi-link-replicate-database-wizard-select-databases-window.png" alt-text="Select Databases window":::

On the Login to Azure and select Managed Instance window you will need to sign-in to Microsoft Azure, select Subscription, Resource Group and Managed Instance for Managed Instance link that will be created, and finally you need to provide login details for the chosen Managed Instance.

:::image type="content" source="./media/mi-link-use-ssms-to-replicate-database/mi-link-replicate-database-wizard-login-to-azure-and-select-managed-instance-window.png" alt-text="Login to Azure and select Managed Instance window":::

Once all of that is populated you will be able to click Next.

:::image type="content" source="./media/mi-link-use-ssms-to-replicate-database/mi-link-replicate-database-wizard-login-to-azure-and-select-managed-instance-populated-window.png" alt-text="Login to Azure and select Managed Instance populated window":::

On the Specify Distributed AG Options window you will see prepopulated values for the various parameters. Unless you need to customize something, you can proceed with the default options and click Next.

:::image type="content" source="./media/mi-link-use-ssms-to-replicate-database/mi-link-replicate-database-wizard-specify-distributed-ag-options-window.png" alt-text="Specify Distributed AG options window":::

On the Summary window you will be able to see the steps for creating Managed Instance link. Optionally, you can generate the setup Script to save it or to run it yourself.
Complete the wizard process by clicking on the Finish.

:::image type="content" source="./media/mi-link-use-ssms-to-replicate-database/mi-link-replicate-database-wizard-summary-window.png" alt-text="Summary window":::

The Executing actions window will display the progress of the process.

:::image type="content" source="./media/mi-link-use-ssms-to-replicate-database/mi-link-replicate-database-wizard-executing-actions-window.png" alt-text="Executing actions window":::

Results window will show up once the process is completed and all steps are marked with a green check sign. At this point you can close the wizard.

:::image type="content" source="./media/mi-link-use-ssms-to-replicate-database/mi-link-replicate-database-wizard-results-window.png" alt-text="Results window":::

With this, Managed Instance link has been created and chosen databases are being replicated to the Managed Instance.

In the SSMS, in Object explorer you will see on the SQL Server that the source database is now in “Synchronized” state and that under Always On High Availability \ Availability Groups we have AG and DAG created for Managed Instance link.

:::image type="content" source="./media/mi-link-use-ssms-to-replicate-database/mi-link-ssms-sql-server-database.png" alt-text="State of SQL Server database and AG and DAG in SSMS":::

We can also see a new database under target Managed Instance. Depending on the database size and network speed, initially you may see the database on the Managed Instance side in the “Restoring” state, and once the seeding from the SQL Server to Managed Instance is done, the database will be ready for read-only workload and visible as in the screenshot below.

:::image type="content" source="./media/mi-link-use-ssms-to-replicate-database/mi-link-ssms-sql-mi-database.png" alt-text="State of database in Managed Instance":::

## Next steps

For more information about Managed Instance link feature, see the following resources:

- [Managed Instance link feature](./link-feature.md)