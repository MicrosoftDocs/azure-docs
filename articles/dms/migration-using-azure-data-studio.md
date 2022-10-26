---
title: Migrate using Azure Data Studio
description: Learn how to use the Azure SQL Migration extension in Azure Data Studio to migrate databases with Azure Database Migration Service.
services: database-migration
author: croblesm
ms.author: roblescarlos
manager: 
ms.reviewer: randolphwest
ms.service: dms
ms.workload: data-services
ms.topic: conceptual
ms.date: 09/28/2022
ms.custom: references_regions
---

# Migrate databases with the Azure SQL Migration extension for Azure Data Studio

Learn how to use the unified experience in [Azure SQL Migration extension for Azure Data Studio](/sql/azure-data-studio/extensions/azure-sql-migration-extension) to assess your database requirements, get right-sized SKU recommendations for Azure resources, and migrate your SQL Server database to Azure.

The Azure SQL Migration extension for Azure Data Studio offers these key benefits:

- A responsive UI for an end-to-end migration experience. The extension starts with a migration readiness assessment and SKU recommendation (preview) (based on performance data).
- An enhanced assessment mechanism that can evaluate SQL Server instances. The extension identifies databases that are ready to migrate to Azure SQL targets.

  > [!NOTE]
  > You can use the Azure SQL Migration extension to assess SQL Server databases running on Windows or Linux.

- An SKU recommendation engine that collects performance data from the on-premises source SQL Server instance and then generates right-sized SKU recommendations based on your Azure SQL target.
- A reliable Azure service powered by Azure Database Migration Service that orchestrates data movement activities to deliver a seamless migration experience.
- You can run your migration online (for migrations that require minimal downtime) or offline (for migrations where downtime persists through the migration) depending on your business requirements.
- You can create and configure a self-hosted integration runtime to use your own compute resources to access the source SQL Server instance and backups in your on-premises environment.

For information about specific migration scenarios and Azure SQL targets, see the list of tutorials in the following table:

| Migration scenario | Migration mode
|---------|---------|
SQL Server to Azure SQL Managed Instance| [Online](./tutorial-sql-server-managed-instance-online-ads.md) / [Offline](./tutorial-sql-server-managed-instance-offline-ads.md)
SQL Server to SQL Server on an Azure virtual machine|[Online](./tutorial-sql-server-to-virtual-machine-online-ads.md) / [Offline](./tutorial-sql-server-to-virtual-machine-offline-ads.md)
SQL Server to Azure SQL Database (preview)| [Offline](./tutorial-sql-server-azure-sql-database-offline-ads.md)

> [!IMPORTANT]
> If your target is Azure SQL Database, make sure you deploy the database schema before you begin the migration. You can use tools like the [SQL Server dacpac extension](/sql/azure-data-studio/extensions/sql-server-dacpac-extension) or the [SQL Database Projects extension](/sql/azure-data-studio/extensions/sql-database-project-extension) for Azure Data Studio.

The following 16-minute video explains recent updates and features added to the Azure SQL Migration extension in Azure Data Studio. Including the new workflow for SQL Server database assessments and SKU recommendations:

> [!VIDEO /_themes/docs.theme/master/_themes/global/video-embed.html?show=data-exposed&ep=assess-get-recommendations-migrate-sql-server-to-azure-using-azure-data-studio]

## Architecture of Azure SQL Migration extension for Azure Data Studio

Azure Database Migration Service is a core component of the Azure SQL Migration extension architecture. Database Migration Service provides a reliable migration orchestrator to support database migrations to Azure SQL. You can create or reuse an existing Database Migration Service instance by using the Azure SQL Migration extension in Azure Data Studio.

Database Migration Service uses the Azure Data Factory self-hosted integration runtime to access and upload valid backup files from your on-premises network share or from your Azure Storage account.

The workflow of the migration process is illustrated in the following diagram:

:::image type="content" source="media/migration-using-azure-data-studio/architecture-sql-migration.png" border="false" alt-text="Diagram that shows the Azure SQL Migration extension architecture." lightbox="media/migration-using-azure-data-studio/architecture-sql-migration-expanded.png":::

The following list describes details for each step in the workflow:

1. **Source SQL Server**: A SQL Server instance on-premises, in a private cloud, or on a virtual machine in a public cloud. SQL Server 2008 and later versions on Windows and Linux are supported.
1. **Target Azure SQL**: Supported Azure SQL targets are Azure SQL Managed Instance, SQL Server on Azure Virtual Machines (registered with the SQL infrastructure as a service extension in [full management mode](/azure/azure-sql/virtual-machines/windows/sql-server-iaas-agent-extension-automate-management#management-modes)), and Azure SQL Database.
1. **Network File Share**: Server Message Block (SMB) network file share where backup files are stored for the database(s) to be migrated. Azure Storage blob containers and Azure Storage file share are also supported.
1. **Azure Data Studio**: Download and install the [Azure SQL Migration extension in Azure Data Studio](/sql/azure-data-studio/extensions/azure-sql-migration-extension).
1. **Azure Database Migration Service**: Azure service that orchestrates migration pipelines to do data movement activities from on-premises to Azure. Database Migration Service is associated with Azure Data Factory's (ADF) self-hosted integration runtime (IR) and provides the capability to register and monitor the self-hosted IR.
1. **Self-hosted integration runtime (IR)**: Self-hosted IR should be installed on a machine that can connect to the source SQL Server and the location of the backup file. Database Migration Service provides the authentication keys and registers the self-hosted IR.
1. **Backup files upload to Azure Storage**: Database Migration Service uses self-hosted IR to upload valid backup files from the on-premises backup location to your Azure Storage account. Data movement activities and pipelines are automatically created in the migration workflow to upload the backup files.
1. **Restore backups on target Azure SQL**: Database Migration Service restores backup files from your Azure Storage account to the supported target Azure SQL. 

    > [!NOTE]
    > If your migration target is Azure SQL Database (Preview), you don't need backups to perform this migration. The migration to Azure SQL Database is considered a logical migration involving the database's pre-creation and data movement (performed by Database Migration Service).

    > [!IMPORTANT]
    > With online migration mode, Database Migration Service continuously uploads the backup source files to Azure Storage and restores them to the target until you complete the final step of cutting over to the target.
    >
    > In offline migration mode, Database Migration Service uploads the backup source files to Azure Storage and restores them to the target without requiring you to perform a cutover.

## Prerequisites

The following sections walk through the prerequisites for each supported Azure SQL target.

### [Azure SQL Managed Instance](#tab/azure-sql-mi)

[!INCLUDE [dms-ads-sqlmi-prereq](../../includes/dms-ads-sqlmi-prereq.md)]

### [SQL Server on Azure Virtual Machine](#tab/azure-sql-vm)

[!INCLUDE [dms-ads-sqlvm-prereq](../../includes/dms-ads-sqlvm-prereq.md)]

### [Azure SQL Database (Preview)](#tab/azure-sql-db)

[!INCLUDE [dms-ads-sqldb-prereq](../../includes/dms-ads-sqldb-prereq.md)]

---

### Recommendations for using self-hosted integration runtime for database migrations

- Use a single self-hosted integration runtime for multiple source SQL Server databases.
- Install only one instance of self-hosted integration runtime on any single machine.
- Associate only one self-hosted integration runtime with one Database Migration Service.
- The self-hosted integration runtime uses resources (memory / CPU) on the machine where it's installed. Install the self-hosted integration runtime on a machine different from your source SQL Server. However, having the self-hosted integration runtime close to the data source reduces the time for the self-hosted integration runtime to connect to the data source. 
- Use the self-hosted integration runtime only when you have your database backups in an on-premises SMB network share. Self-hosted integration runtime isn't required for database migrations if your source database backups are already in the Azure storage blob container.
- We recommend up to 10 concurrent database migrations per self-hosted integration runtime on a single machine. To increase the number of concurrent database migrations, scale-out self-hosted runtime up to four nodes or create separate self-hosted integration runtime on different machines.
- Configure self-hosted integration runtime to auto-update to automatically apply any new features, bug fixes, and enhancements that are released. To learn more, see [Self-hosted Integration Runtime Auto-update](../data-factory/self-hosted-integration-runtime-auto-update.md).

## Monitor database migration progress from the Azure portal

When you migrate the database(s) using the Azure SQL Migration extension for Azure Data Studio, the migrations are orchestrated by the Azure Database Migration Service that was selected in the wizard. 

To monitor database migrations from the Azure portal:

1. Open the [Azure portal](https://portal.azure.com/)
1. Search for your Azure Database Migration Service by the resource name
  
  :::image type="content" source="media/migration-using-azure-data-studio/search-dms-portal.png" alt-text="Search Azure Database Migration Service resource in portal":::

1. Select the **Monitor migrations** tile on the **Overview** page to view the details of your database migrations.

  :::image type="content" source="media/migration-using-azure-data-studio/dms-ads-monitor-portal.png" alt-text="Monitor migrations in Azure portal":::

## Known issues and limitations

- Overwriting existing databases using Database Migration Service in your target Azure SQL Managed Instance or SQL Server on Azure Virtual Machine isn't supported.
- Configuring high availability and disaster recovery on your target to match source topology isn't supported by Database Migration Service.
- The following server objects aren't supported:

  - Logins
  - SQL Server Agent jobs
  - Credentials
  - SQL Server Integration Services packages
  - Server roles
  - Server audit

- SQL Server 2008 and earlier as target versions aren't supported for migrations to SQL Server on Azure Virtual Machines.
- If you're using SQL Server 2012 or SQL Server 2014, you need to store your source database backup files on an Azure Storage Blob Container instead of using the network share option. Store the backup files as page blobs since block blobs are only supported in SQL 2016 and after.
- You can't use an existing self-hosted integration runtime created from Azure Data Factory for database migrations with Database Migration Service. Initially, the self-hosted integration runtime should be created using the Azure SQL Migration extension in Azure Data Studio and can be reused for further database migrations.

## Pricing

- Azure Database Migration Service is free to use with the Azure SQL Migration extension in Azure Data Studio. You can migrate multiple SQL Server databases using the Azure Database Migration Service at no charge using the service or the Azure SQL Migration extension.
- There's no data movement or data ingress cost for migrating your databases from on-premises to Azure. If the source database is moved from another region or an Azure VM, you may incur [bandwidth charges](https://azure.microsoft.com/pricing/details/bandwidth/) based on your bandwidth provider and routing scenario.
- Provide your machine or on-premises server to install Azure Data Studio.
- A self-hosted integration runtime is needed to access database backups from your on-premises network share.

## Regional availability

For the list of Azure regions that support database migrations using the Azure SQL Migration extension for Azure Data Studio (powered by Azure Database Migration Service), see [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=database-migration)

## Next steps

- For an overview and installation of the Azure SQL Migration extension, see [Azure SQL Migration extension for Azure Data Studio](/sql/azure-data-studio/extensions/azure-sql-migration-extension).
