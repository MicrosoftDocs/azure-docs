---
title: In-place change of SQL Server version
description: Learn how to change the version of your SQL Server virtual machine in Azure. 
services: virtual-machines-windows
documentationcenter: na
author: ramakoni1
manager: ramakoni1
tags: azure-resource-manager
ms.service: virtual-machines-sql

ms.topic: how-to
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 06/08/2020
ms.author: RamaKoni
ms.reviewer: sqlblt, daleche
ms.custom: "seo-lt-2019"
---

# In-place Change of SQL Server Version on Azure VM

[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article describes how to change the version of Microsoft SQL Server on a Windows virtual machine (VM) in Microsoft Azure.

## Prerequisites

To do an in-place upgrade of SQL Server, the following conditions apply:

- The setup media of the desired version of SQL Server is required. Customers who have [Software Assurance](https://www.microsoft.com/licensing/licensing-programs/software-assurance-default) can obtain their installation media from the [Volume Licensing Center](https://www.microsoft.com/Licensing/servicecenter/default.aspx). Customers who don't have Software Assurance can use the setup media from an Azure Marketplace SQL Server VM image that has a later version of SQL Server (typically located in C:\SQLServerFull).
- Edition upgrades should follow the [support upgrade paths](https://docs.microsoft.com/sql/database-engine/install-windows/supported-version-and-edition-upgrades-version-15?view=sql-server-ver15).

## Planning for version change

We recommend that you review the following items before you do the version change:

1. Check what's new in the version that you are planning to upgrade to:

   - What's new in [SQL 2019](https://docs.microsoft.com/sql/sql-server/what-s-new-in-sql-server-ver15?view=sql-server-ver15)
   - What's new in [SQL 2017](https://docs.microsoft.com/sql/sql-server/what-s-new-in-sql-server-2017?view=sql-server-ver15)
   - What's new in [SQL 2016](https://docs.microsoft.com/sql/sql-server/what-s-new-in-sql-server-2016?view=sql-server-ver15)
   - What's new in [SQL 2014](https://docs.microsoft.com/sql/sql-server/what-s-new-in-sql-server-2016?view=sql-server-2014)

1. We recommend that you check the [compatibility certification](https://docs.microsoft.com/sql/database-engine/install-windows/compatibility-certification?view=sql-server-ver15) for the version that you are going to change to so that you can use the database compatibility modes to minimize the effect of the upgrade.
1. You can review to the following articles to help ensure a successful outcome:

   - [Video: Modernizing SQL Server | Pam Lahoud & Pedro Lopes | 20 Years of PASS](https://www.youtube.com/watch?v=5RPkuQHcxxs&feature=youtu.be)
   - [Database Experimentation Assistant for AB testing](https://docs.microsoft.com/sql/dea/database-experimentation-assistant-overview?view=sql-server-ver15)
   - [Upgrading Databases by using the Query Tuning Assistant](https://docs.microsoft.com/sql/relational-databases/performance/upgrade-dbcompat-using-qta?view=sql-server-ver15)
   - [Change the Database Compatibility Level and use the Query Store](https://docs.microsoft.com/sql/database-engine/install-windows/change-the-database-compatibility-mode-and-use-the-query-store?view=sql-server-ver15)

## Upgrade SQL Version

> [!WARNING]
> Upgrading the version of SQL Server will restart the service for SQL Server in addition to any associated services, such as Analysis Services and R Services.

To upgrade the version of SQL Server, obtain the SQL Server setup media for the later version that would [support the upgrade path](https://docs.microsoft.com/sql/database-engine/install-windows/supported-version-and-edition-upgrades-version-15?view=sql-server-ver15) of SQL Server, and do the following steps:

1. Back up the databases, including system (except tempdb) and user databases, before you start the process. You can also create an application-consistent VM-level backup by using Azure Backup Services.
1. Start Setup.exe from the SQL Server installation media.
1. The Installation Wizard starts the SQL Server Installation Center. To upgrade an existing instance of SQL Server, select **Installation** on the navigation pane, and then select **Upgrade from an earlier version of SQL Server**.

   :::image type="content" source="./media/change-sql-server-version/upgrade.png" alt-text="Selection for upgrading the version of SQL Server":::

1. On the **Product Key** page, select an option to indicate whether you are upgrading to a free edition of SQL Server or you have a PID key for a production version of the product. For more information, see [Editions and supported features of SQL Server 2019 (15.x)](https://docs.microsoft.com/sql/sql-server/editions-and-components-of-sql-server-version-15?view=sql-server-ver15) and [Supported version and edition Upgrades (SQL Server 2016)](https://docs.microsoft.com/sql/database-engine/install-windows/supported-version-and-edition-upgrades?view=sql-server-ver15).
1. Select **Next** until you reach the **Ready to upgrade** page, and then select **Upgrade**. The setup window might stop responding for several minutes while the change is taking effect. A **Complete** page will confirm that your upgrade is completed. For a step-by-step procedure to upgrade, see [the complete procedure](https://docs.microsoft.com/sql/database-engine/install-windows/upgrade-sql-server-using-the-installation-wizard-setup?view=sql-server-ver15#procedure).

   :::image type="content" source="./media/change-sql-server-version/complete-page.png" alt-text="Complete page":::

If you have changed the SQL Server edition in addition to changing the version, also update the edition, and refer to the **Verify Version and Edition in Portal** section to change the SQL VM instance.

   :::image type="content" source="./media/change-sql-server-version/change-portal.png" alt-text="Change version metadata":::

## Downgrade the version of SQL Server

To downgrade the version of SQL Server, you have to completely uninstall SQL Server, and reinstall it again by using the desired version. This is similar to a fresh installation of SQL Server because you will not be able to restore the earlier database from a later version to the newly installed earlier version. The databases will have to be re-created from scratch. If you also changed the edition of SQL Server during the upgrade, change the **Edition** property of the SQL Server VM in the Azure portal to the new edition value. This updates the metadata and billing that is associated with this VM.

> [!WARNING]
> An in-place downgrade of SQL Server is not supported.

You can downgrade the version of SQL Server by following these steps:

1. Make sure that you are not using any feature that is [available in the later version only](https://social.technet.microsoft.com/wiki/contents/articles/24222.find-enterprise-only-features-in-your-database.aspx).
1. Back up all databases, including system (except tempdb) and user databases.
1. Export all the necessary server-level objects (such as server triggers, roles, logins, linked servers, jobs, credentials, and certificates).
1. If you do not have scripts to re-create your user databases on the earlier version, you must script out all objects and export all data by using BCP.exe, SSIS, or DACPAC.

   Make sure that you select the correct options when you script such items as the target version, dependent objects, and advanced options.

   :::image type="content" source="./media/change-sql-server-version/scripting-options.png" alt-text="Scripting options":::

1. Completely uninstall SQL Server and all associated services.
1. Restart the VM.
1. Install SQL Server by using the media for the desired version of the program.
1. Install the latest service packs and cumulative updates.
1. Import all the necessary server-level objects (that were exported in Step 3).
1. Re-create all the necessary user databases from scratch (by using created scripts or the files from Step 4).

## Verify the version and edition in the portal

After you change the version of SQL Server, register your SQL Server VM with the [SQL VM resource provider](sql-vm-resource-provider-register.md) again so that you can use the Azure portal to view the version of SQL Server. The listed version number should now reflect the newly upgraded version and edition of your SQL Server installation.

:::image type="content" source="./media/change-sql-server-version/verify-portal.png" alt-text="Verify version":::

> [!NOTE]
> If you have already registered with the SQL VM resource provider, [unregister from the RP](sql-vm-resource-provider-register.md#unregister-from-rp) and then [Register the SQL VM resource](sql-vm-resource-provider-register.md#register-with-rp) again so that it detects the correct version and edition of SQL Server that is installed on the VM. This updates the metadata and billing information that is associated with this VM.

## Remarks

- We recommend that you initiate backups/update statistics/rebuild indexes/check consistency after the upgrade is finished. You can also check the individual database compatibility levels to make sure that they reflect your desired level.
- After SQL Server is updated on the VM, make sure that the **Edition** property of SQL Server in the Azure portal matches the installed edition number for billing.
- The ability to [change the edition](change-sql-server-edition.md#change-edition-in-portal) is a feature of the SQL VM resource provider. Deploying an Azure Marketplace image through the Azure portal automatically registers a SQL Server VM with the resource provider. However, customers who are self-installing SQL Server will have to manually [register their SQL Server VM](sql-vm-resource-provider-register.md).
- If you drop your SQL Server VM resource, the hard-coded edition setting of the image is restored.

## Next steps

For more information, see the following articles:

- [Overview of SQL Server on a Windows VM](sql-server-on-azure-vm-iaas-what-is-overview.md)
- [FAQ for SQL Server on a Windows VM](frequently-asked-questions-faq.md)
- [Pricing guidance for SQL Server on a Windows VM](pricing-guidance.md)
- [Release notes for SQL Server on a Windows VM](doc-changes-updates-release-notes.md)
