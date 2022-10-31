---
author: croblesm
ms.author: roblescarlos
ms.service: dms
ms.topic: include
ms.date: 09/12/2022
---

### Migrate databases with Azure SQL Migration extension for Azure Data Studio
The [Azure SQL Migration extension for Azure Data Studio](/sql/azure-data-studio/extensions/azure-sql-migration-extension) brings together a simplified assessment, recommendation, and migration experience that delivers the following capabilities:
- A responsive user interface that provides you with an end-to-end migration experience that starts with a migration readiness assessment, SKU recommendation (based on performance data), and finalizes with the actual migration to Azure SQL.
- An enhanced assessment mechanism that can evaluate SQL Server instances, identifying databases that are ready for migration to the different Azure SQL targets.
- A SKU recommendation engine (Preview) that collects performance data from the source SQL Server instance on-premises, generating right-sized SKU recommendations based on your Azure SQL target.
- A reliable Azure service powered by Azure Database Migration Service that orchestrates data movement activities to deliver a seamless migration experience.
- The ability to run online (for migrations requiring minimal downtime) or offline (for migrations where downtime persists through the migration) migration modes to suit your business requirements.
- The flexibility to create and configure a self-hosted integration runtime to provide your own compute for accessing the source SQL Server and backups in your on-premises environment.

Check the following step-by-step tutorials for more information about each specific migration scenario by Azure SQL target:

| Migration scenario | Migration mode
|---------|---------|
SQL Server to Azure SQL Managed Instance| [Online](../articles/dms/tutorial-sql-server-managed-instance-online-ads.md) / [Offline](../articles/dms/tutorial-sql-server-managed-instance-offline-ads.md)
SQL Server to SQL Server on Azure Virtual Machine|[Online](../articles/dms/tutorial-sql-server-to-virtual-machine-online-ads.md) / [Offline](../articles/dms/tutorial-sql-server-to-virtual-machine-offline-ads.md)
SQL Server to Azure SQL Database (Preview)| [Offline](../articles/dms/tutorial-sql-server-azure-sql-database-offline-ads.md)

To learn more, see [Migrate databases with Azure SQL Migration extension for Azure Data Studio](../articles/dms/migration-using-azure-data-studio.md).