---
title: In-place change of SQL Server version
description: Learn how to change the version of your SQL Server virtual machine in Azure. 
services: virtual-machines-windows
documentationcenter: na
author: ramakoni1
manager: ramakoni1
tags: azure-resource-manager
ms.service: virtual-machines-sql

ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 06/08/2020
ms.author: RamaKoni
ms.reviewer: sqlblt, daleche
ms.custom: "seo-lt-2019"
---

# In-place change of SQL Server version on Azure VM

[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article describes how to change the version of SQL Server on a Windows virtual machine in Azure.

## Prerequisites

To do an in-place upgrade of SQL Server, you need the following:

- In-place upgrade of SQL server is only possible from an earlier version of SQL server to a later version as mentioned in the [support upgrade path](https://docs.microsoft.com/sql/database-engine/install-windows/supported-version-and-edition-upgrades-version-15?view=sql-server-ver15) article.
- A [SQL Server VM on Windows](create-sql-vm-portal.md) registered with the [SQL VM resource provider](sql-vm-resource-provider-register.md).
- Set up media of later version of SQL Server. Customers who have [Software Assurance](https://www.microsoft.com/licensing/licensing-programs/software-assurance-default) can obtain their installation media from the [Volume Licensing Center](https://www.microsoft.com/Licensing/servicecenter/default.aspx). Customers who don't have Software Assurance can use the setup media from an Azure Marketplace SQL Server VM image that has later version of SQL Server (typically located in C:\SQLServerFull).

## Planning for version Change

It is a good idea to review the following items before you do the version change:

1. Check what's new in the version that you are planning to migrate to:

   - What's new in [SQL 2019](https://docs.microsoft.com/sql/sql-server/what-s-new-in-sql-server-ver15?view=sql-server-ver15)
   - What's new in [SQL 2017](https://docs.microsoft.com/sql/sql-server/what-s-new-in-sql-server-2017?view=sql-server-ver15)
   - What's new in [SQL 2016](https://docs.microsoft.com/sql/sql-server/what-s-new-in-sql-server-2016?view=sql-server-ver15)
   - What's new in [SQL 2014](https://docs.microsoft.com/sql/sql-server/what-s-new-in-sql-server-2016?view=sql-server-2014)

1. We recommend checking the [compatibility certification](https://docs.microsoft.com/sql/database-engine/install-windows/compatibility-certification?view=sql-server-ver15) for the version that you are going to change to so that you can use the database compatibility modes to minimize impact.
1. Here are some articles you can review to ensure the successful outcome:

   - [Video: Modernizing SQL Server | Pam Lahoud & Pedro Lopes | 20 Years of PASS](https://www.youtube.com/watch?v=5RPkuQHcxxs&feature=youtu.be)
   - [Database Experimentation Assistant for AB testing](https://docs.microsoft.com/sql/dea/database-experimentation-assistant-overview?view=sql-server-ver15)
   - [Upgrading Databases by using the Query Tuning Assistant](https://docs.microsoft.com/sql/relational-databases/performance/upgrade-dbcompat-using-qta?view=sql-server-ver15)
   - [Change the Database Compatibility Level and use the Query Store](https://docs.microsoft.com/sql/database-engine/install-windows/change-the-database-compatibility-mode-and-use-the-query-store?view=sql-server-ver15)

## Upgrade SQL Version

> [!WARNING]
> Upgrading the version of SQL Server will restart the service for SQL Server, along with any associated services, such as Analysis Services and R Services.

To upgrade the version of SQL Server, obtain the SQL Server setup media for the later version that would [support upgrade path](https://docs.microsoft.com/sql/database-engine/install-windows/supported-version-and-edition-upgrades-version-15?view=sql-server-ver15) of SQL Server, and then do the following:

1. Backup system (except tempdb) and user databases before you start the process. You may also take an app-consistent VM level backup using Azure backup services.
1. Open Setup.exe from the SQL Server installation media.
1. The Installation Wizard starts the SQL Server Installation Center. To upgrade an existing instance of SQL Server, click **Installation** in the left navigation area, and then click **Upgrade from an earlier version of SQL Server**.

   :::image type="content" source="./media/change-sql-server-version/version-upgrade.png" alt-text="Selection for upgrading the version of SQL Server":::

1. On the **Product Key** page, click an option to indicate whether you are upgrading to a free edition of SQL Server, or whether you have a PID key for a production version of the product. For more information, see [Editions and Components of SQL Server](https://docs.microsoft.com/sql/sql-server/editions-and-components-of-sql-server-version-15?view=sql-server-ver15) and [Supported Version and Edition Upgrades](https://docs.microsoft.com/sql/database-engine/install-windows/supported-version-and-edition-upgrades?view=sql-server-ver15).
1. Select **Next** until you reach the **Ready to upgrade** page, and then select **Upgrade**. The setup window might stop responding for several minutes while the change is taking effect. A **Complete** page will confirm that your upgrade is completed. For step-by-step procedure to upgrade, refer the [complete procedure](https://docs.microsoft.com/sql/database-engine/install-windows/upgrade-sql-server-using-the-installation-wizard-setup?view=sql-server-ver15#procedure).

   :::image type="content" source="./media/change-sql-server-version/complete-page.png" alt-text="Complete page":::

If you have changed the SQL Edition while changing the version, then update the edition and refer the **Verify Version and Edition in Portal** section to change the SQL Virtual Machine instance.

   :::image type="content" source="./media/change-sql-server-version/version-change-in-portal.png" alt-text="Change version metadata":::

## Verify Version and Edition in Portal

Once you have upgraded the version of SQL Server By Using the installation media, register your SQL Server VM with the [SQL VM resource provider](sql-vm-resource-provider-register.md) again so that you can then use the Azure portal to view the version of SQL server, it should reflect the newly upgraded version and edition of SQL Server.

:::image type="content" source="./media/change-sql-server-version/verify-version-in-portal.png" alt-text="Verify version":::

> [!NOTE]
> If you already have Resource Provider installed, then you might see the above changes until you reregister the Resource provider. If you had changed the edition of SQL server while following this process, after the changes, change the edition property of the SQL Server virtual machine in the Azure portal to the new edition. This will update the metadata and billing associated with this VM. For complete procedure to change edition of SQL server in Azure VM please refer the [in-place edition upgrade](change-sql-server-edition.md#change-edition-in-portal) article. [Resource Provider Registration](sql-vm-resource-provider-register.md) is mandatory for changing the version and edition of a SQL Server.

## Downgrade version of SQL Server

Backup system (except tempdb) and user databases before you start the process. Make sure that you are not using any feature that is available in the later version only.

To downgrade the version of SQL Server, you need to completely uninstall SQL Server, and reinstall it again with the desired version. This will act as a fresh new install of SQL server as you will not be able to restore the earlier database from a later version to the newly installed earlier version. The databases will need to be recreated from scratch. If you had also changed the edition of SQL server while upgrading, then, after the SQL Server version is upgraded, change the edition property of the SQL Server virtual machine in the Azure portal to the new edition. This will update the metadata and billing associated with this VM.

> [!WARNING]
> In-place downgrade of SQL server is not supported.

You can downgrade the version of SQL Server by following these steps:

1. Back up all databases, including the system databases.
1. Export all the necessary server-level objects (such as server triggers, roles, logins, linked servers, jobs, credentials, and certificates).
1. If you do not have scripts to re-create your user databases on the earlier version, you will need to script out all objects and export all data by using BCP.exe, SSIS, or DACPAC. 

   Make sure that you select the correct options when scripting such as the target version, several dependent objects, advanced options.

   :::image type="content" source="./media/change-sql-server-version/scripting-options.png" alt-text="Scripting options":::

1. Completely uninstall SQL Server and all associated services.
1. Restart the virtual machine.
1. Install SQL Server by using the media with the desired version of SQL Server.
1. Install the latest service packs and cumulative updates.
1. Import all the necessary server-level objects (which were exported in Step 2).
1. Re-create all the necessary user databases from scratch (using create scripts and/or the files from Step 3).

## Remarks

- It is a good idea to initiate backups/update statistics/rebuild indexes/check consistency after migration. You may also check individual database compatibility level to make sure that they reflect your desired level. 
- Once the version of SQL Server has been updated on the SQL Server VM, you must make sure that the edition property of SQL Server in the Azure portal is same as the edition installed in the VM itself for billing.
- The ability to [change the edition](change-sql-server-edition.md#change-edition-in-portal) is a feature of the SQL VM resource provider. Deploying an Azure Marketplace image through the Azure portal automatically registers a SQL Server VM with the resource provider. However, customers who are self-installing SQL Server will need to manually [register their SQL Server VM](sql-vm-resource-provider-register.md).
- If you drop your SQL Server VM resource, you will go back to the hard-coded edition setting of the image.
