---
title: Migrate databases by using the Azure SQL Migration extension for Azure Data Studio
description: Learn how to use the Azure SQL Migration extension in Azure Data Studio to migrate databases with Azure Database Migration Service.
author: croblesm
ms.author: roblescarlos
ms.reviewer: randolphwest
ms.date: 09/28/2022
ms.service: dms
ms.topic: conceptual
ms.custom: references_regions
---

# Migrate databases by using the Azure SQL Migration extension for Azure Data Studio

Learn how to use the unified experience in [Azure SQL Migration extension for Azure Data Studio](/sql/azure-data-studio/extensions/azure-sql-migration-extension). Helps you to assess your database requirements, get the right-sized SKU recommendations for Azure resources, and migrate your SQL Server database to Azure.

The Azure SQL Migration extension for Azure Data Studio offers these key benefits:

- A responsive UI for an end-to-end migration experience. The extension starts with a migration readiness assessment and SKU recommendation (preview) (based on performance data).

- An enhanced assessment mechanism that can evaluate SQL Server instances. The extension identifies databases that are ready to migrate to Azure SQL targets.

  > [!NOTE]
  > You can use the Azure SQL Migration extension to assess SQL Server databases running on Windows or Linux.

- An SKU recommendation engine that collects performance data from the on-premises source SQL Server instance and then generates right-sized SKU recommendations based on your Azure SQL target.

- A reliable Azure service powered by Azure Database Migration Service that orchestrates data movement activities to deliver a seamless migration experience.

- You can run your migration online (for migrations that require minimal downtime) or offline (for migrations where downtime persists throughout the migration) depending on your business requirements.

- You can configure a self-hosted integration runtime to use your own compute resources to access the source SQL Server instance backup files in your on-premises environment.

- Provides a secure and improved user experience for migrating TDE databases and SQL/Windows logins to Azure SQL.

For information about specific migration scenarios and Azure SQL targets, see the list of tutorials in the following table:

| Migration scenario | Migration mode
|---------|---------|
SQL Server to Azure SQL Managed Instance| [Online](./tutorial-sql-server-managed-instance-online-ads.md) / [Offline](./tutorial-sql-server-managed-instance-offline-ads.md)
SQL Server to SQL Server on an Azure virtual machine|[Online](./tutorial-sql-server-to-virtual-machine-online-ads.md) / [Offline](./tutorial-sql-server-to-virtual-machine-offline-ads.md)
SQL Server to Azure SQL Database | [Offline](./tutorial-sql-server-azure-sql-database-offline-ads.md)

> [!IMPORTANT]
> If your target is Azure SQL Database, make sure you deploy the database schema before you begin the migration. You can use tools like the [SQL Server dacpac extension](/sql/azure-data-studio/extensions/sql-server-dacpac-extension) or the [SQL Database Projects extension](/sql/azure-data-studio/extensions/sql-database-project-extension) for Azure Data Studio.

The following video explains recent updates and features added to the Azure SQL Migration extension for Azure Data Studio:

<br />

> [!VIDEO https://learn-video.azurefd.net/vod/player?show=data-exposed&ep=how-to-migrate-sql-server-to-azure-sql-database-offline-using-azure-data-studio-data-exposed]

## Architecture of the Azure SQL Migration extension for Azure Data Studio

Azure Database Migration Service is a core component of the Azure SQL Migration extension architecture. Database Migration Service provides a reliable migration orchestrator to support database migrations to Azure SQL. You can create an instance of Database Migration Service or use an existing instance by using the Azure SQL Migration extension in Azure Data Studio.

Database Migration Service uses the Azure Data Factory self-hosted integration runtime to access and upload valid backup files from your on-premises network share or from your Azure storage account.

The workflow of the migration process is illustrated in the following diagram:

:::image type="content" source="media/migration-using-azure-data-studio/architecture-sql-migration.png" border="false" alt-text="Diagram that shows the Azure SQL Migration extension architecture." lightbox="media/migration-using-azure-data-studio/architecture-sql-migration-expanded.png":::

The following list describes each step in the workflow:

(1) **Source SQL Server**: An on-premises instance of SQL Server that's in a private cloud or an instance of SQL Server on a virtual machine in a public cloud. SQL Server 2008 and later versions on Windows or Linux are supported.

(2) **Target Azure SQL**: Supported Azure SQL targets are Azure SQL Managed Instance, SQL Server on Azure Virtual Machines (registered with the SQL infrastructure as a service extension in [full management mode](/azure/azure-sql/virtual-machines/windows/sql-server-iaas-agent-extension-automate-management#management-modes)), and Azure SQL Database.

(3) **Network file share**: A Server Message Block (SMB) network file share where backup files are stored for the databases to be migrated. Azure storage blob containers and Azure storage file share also are supported.

(4) **Azure Data Studio**: Download and install the [Azure SQL Migration extension for Azure Data Studio](/sql/azure-data-studio/extensions/azure-sql-migration-extension).

(5) **Azure Database Migration Service**: An Azure service that orchestrates migration pipelines to do data movement activities from an on-premises environment to Azure. Database Migration Service is associated with the Azure Data Factory self-hosted integration runtime and provides the capability to register and monitor the self-hosted integration runtime.

(6) **Self-hosted integration runtime**: Install a self-hosted integration runtime on a computer that can connect to the source SQL Server instance and to the location of the backup file. Database Migration Service provides the authentication keys and registers the self-hosted integration runtime.

(7) **Backup files upload to your Azure storage account**: Database Migration Service uses a self-hosted integration runtime to upload valid backup files from the on-premises backup location to your Azure storage account. Data movement activities and pipelines are automatically created in the migration workflow to upload the backup files.

(8) **Restore backups on target Azure SQL**: Database Migration Service restores backup files from your Azure storage account to the supported target Azure SQL instance.

> [!NOTE]
> If your migration target is Azure SQL Database, you don't need backups for this migration. Database migration to Azure SQL Database is considered a logical migration that involves the database's pre-creation and data movement (performed by Database Migration Service).

> [!IMPORTANT]
> The Azure SQL Migration extension for Azure Data Studio doesn't take database backups, or neither initiate any database backups on your behalf. Instead, the service uses existing database backup files for the migration.
>
> In online migration mode, Database Migration Service continuously uploads the backup source files to your Azure storage account and restores them to the target until you complete the final step of cutting over to the target.
>
> In offline migration mode, Database Migration Service uploads the backup source files to Azure storage and restores them to the target without requiring a cutover.

## Prerequisites

The following sections walk through the prerequisites for each supported Azure SQL target.

### [Azure SQL Managed Instance](#tab/azure-sql-mi)

[!INCLUDE [dms-ads-sqlmi-prereq](../../includes/dms-ads-sqlmi-prereq.md)]

### [SQL Server on Azure Virtual Machine](#tab/azure-sql-vm)

[!INCLUDE [dms-ads-sqlvm-prereq](../../includes/dms-ads-sqlvm-prereq.md)]

### [Azure SQL Database](#tab/azure-sql-db)

[!INCLUDE [dms-ads-sqldb-prereq](../../includes/dms-ads-sqldb-prereq.md)]

---

### Recommendations for using a self-hosted integration runtime for database migrations

- Use a single self-hosted integration runtime for multiple source SQL Server databases.

- Install only one instance of a self-hosted integration runtime on any single computer.

- Associate only one self-hosted integration runtime with one instance of Database Migration Service.

- The self-hosted integration runtime uses resources (memory and CPU) on the computer it's installed on. Install the self-hosted integration runtime on a computer that's separate from your source SQL Server instance. But the two computers should be in close proximity. Having the self-hosted integration runtime close to the data source reduces the time it takes for the self-hosted integration runtime to connect to the data source.

- Use the self-hosted integration runtime only when you have your database backups in an on-premises SMB network share. A self-hosted integration runtime isn't required for database migrations if your source database backups are already in the storage blob container.

- We recommend up to 10 concurrent database migrations per self-hosted integration runtime on a single computer. To increase the number of concurrent database migrations, scale out the self-hosted runtime to up to four nodes or create separate instances of the self-hosted integration runtime on different computers.

- Configure the self-hosted integration runtime to auto-update and automatically apply any new features, bug fixes, and enhancements that are released. For more information, see [Self-hosted integration runtime auto-update](../data-factory/self-hosted-integration-runtime-auto-update.md).

## Monitor database migration progress in the Azure portal

The Azure SQL Migration extension for Azure Data Studio orchestrates all migration tasks through the Database Migration Service selected in the migration wizard when migrating databases.

To monitor database migrations in the Azure portal:

1. In the [Azure portal](https://portal.azure.com/), search for your instance of Database Migration Service by using the resource name.
  
   :::image type="content" source="media/migration-using-azure-data-studio/search-dms-portal.png" alt-text="Screenshot that shows how to search for a resource name in the Azure portal.":::

1. In the Database Migration Service instance overview, select **Monitor migrations** to view the details of your database migrations.

   :::image type="content" source="media/migration-using-azure-data-studio/dms-ads-monitor-portal.png" alt-text="Screenshot that shows how to monitor migrations in the Azure portal.":::

## Known issues and limitations

- Database Migration Service doesn't support overwriting existing databases in your target instance of Azure SQL Managed Instance, Azure SQL Database, or SQL Server on Azure Virtual Machines.

- Database Migration Service doesn't support configuring high availability and disaster recovery on your target to match the source topology.

- The following server objects aren't supported:

  - SQL Server Agent jobs
  - Credentials
  - SQL Server Integration Services packages
  - Server audit

  For a complete list of metadata and server objects that you need to move, refer to the detailed information available in [Manage Metadata When Making a Database Available on Another Server](/sql/relational-databases/databases/manage-metadata-when-making-a-database-available-on-another-server).

- SQL Server 2008 and earlier as target versions aren't supported for migrations to SQL Server on Azure Virtual Machines.

- If you use SQL Server 2014 or SQL Server 2012, you must store your source database backup files in an Azure storage blob container instead of by using the network share option. Store the backup files as page blobs. Block blobs are supported only in SQL Server 2016 and later versions.

- You can't use an existing self-hosted integration runtime that was created in Azure Data Factory for database migrations with Database Migration Service. Initially, create the self-hosted integration runtime by using the Azure SQL Migration extension for Azure Data Studio. You can reuse that self-hosted integration runtime in future database migrations.

- Azure Data Studio currently supports both Azure Active Directory (Azure AD)/Windows authentication and SQL logins for connecting to the source SQL Server instance. For the Azure SQL targets, only SQL logins are supported.

## Pricing

- Azure Database Migration Service is free to use with the Azure SQL Migration extension for Azure Data Studio. You can migrate multiple SQL Server databases by using Database Migration Service at no charge.

- No data movement or data ingress costs are assessed when you migrate your databases from an on-premises environment to Azure. If the source database is moved from another region or from an Azure virtual machine, you might incur [bandwidth charges](https://azure.microsoft.com/pricing/details/bandwidth/) depending on your bandwidth provider and routing scenario.

- Use a virtual machine or an on-premises server to install Azure Data Studio.

- A self-hosted integration runtime is required to access database backups from your on-premises network share.

## Region availability

For the list of Azure regions that support database migrations by using the Azure SQL Migration extension for Azure Data Studio (powered by Azure Database Migration Service), see [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=database-migration).

## Next steps

- Learn how to install the [Azure SQL Migration extension for Azure Data Studio](/sql/azure-data-studio/extensions/azure-sql-migration-extension).
