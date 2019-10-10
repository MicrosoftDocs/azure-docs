---
title: "Azure SQL Database Import/Export service takes a long time to import or export a database| Microsoft Docs"
description: "Azure SQL Database Import/Export service takes a long time to import or export a database"
services: sql-database
ms.service: sql-database
ms.topic: troubleshooting
author: v-miegge
ms.author: ramakoni
ms.reviewer: ""
ms.date: 09/27/2019
---

# Azure SQL Database Import/Export service takes a long time to import or export a database

When using Azure SQL Database Import/Export service, you may notice that, sometimes the process may take a long time to complete. This article provides additional information on the potential causes for thee delays and alternate methods you can use to workaround these problems.

## Azure SQL Database Import/Export Service

The Azure SQL Database Import/Export Service is a REST-based web service that runs in every Microsoft Azure data center. This is the service that gets called when you use either the [Import Database](https://docs.microsoft.com/azure/sql-database/sql-database-import#import-from-a-bacpac-file-in-the-azure-portal) or [Export](https://docs.microsoft.com/azure/sql-database/sql-database-export#export-to-a-bacpac-file-using-the-azure-portal) options to move your SQL database in the Microsoft Azure portal. The service provides a free request queuing service and a free Compute service to perform imports and exports from a Microsoft Azure SQL database to Microsoft Azure binary large object (BLOB) storage.

The import and export operations are not a traditional physical database backup but a logical backup of the database that uses a special BACPAC format. This logical BACPAC format lets you avoid having to use a physical format that might vary between versions of SQL Server and SQL Database. Therefore, you can use it to safely restore the database to a SQL database and to a SQL Server database.

## What causes the process to take a long time

The Azure SQL Database Import/Export Service provides a limited number of Compute virtual machines (VMs) per region to process the import and export operations. The Compute VM is hosted per region to make sure that the import or export avoids cross-region bandwidth delays and charges. So, if too many requests are made at the same time in the same region, significant delays occur in processing the operations. The time that is required to complete requests can vary from a few seconds to many hours.

> [!NOTE]
> If a request is not processed within four days, the service automatically cancels the request.

## Recommended solutions

If your database exports are used only for recovery from accidental data deletion, all the Azure SQL Server database editions provide self-service restoration capability from system-generated backups. But if you need these exports for other reasons, and if you require consistently faster or more predictable import or export performance, you should consider the following options:

* [Export to a BACPAC file using the SQLPackage utility](https://docs.microsoft.com/azure/sql-database/sql-database-export#export-to-a-bacpac-file-using-the-sqlpackage-utility)
* [Export to a BACPAC file using SQL Server Management Studio (SSMS)](https://docs.microsoft.com/azure/sql-database/sql-database-export#export-to-a-bacpac-file-using-sql-server-management-studio-ssms)
* Run the BACPAC import or export directly in your code by using the Microsoft® SQL Server® Data-Tier Application Framework (DacFx) API. For additional information review
  * [Export a Data-tier Application](https://docs.microsoft.com/sql/relational-databases/data-tier-applications/export-a-data-tier-application)
  * [Microsoft.SqlServer.Dac Namespace](https://docs.microsoft.com/dotnet/api/microsoft.sqlserver.dac)
  * [Download DACFx](https://www.microsoft.com/download/details.aspx?id=55713)

## Considerations when exporting or importing an Azure SQL database

* All the methods discussed in this article uses up the DTU quota, resulting in throttling by the Azure SQLDB service. You can [view the DTU stats for the database on the Azure portal](https://docs.microsoft.com/azure/sql-database/sql-database-monitor-tune-overview#monitor-database-performance). If the database is hitting resources limits, [upgrade the service tier](https://docs.microsoft.com/azure/sql-database/sql-database-scale-resources) to add more resources.
* Client applications (like sqlpackage utility or your custom DAC application) should ideally be run from a virtual machine (VM) in the same region as your SQL database or else you may run into performance issues due to network latency.
* Exporting large tables without clustered indexes may be very slow or even result in failure. This is because the table cannot be split up and exported in parallel and must be exported in a single transaction and that causes the slowness and potential failures during export, especially for large tables. 


## Related documents

[Considerations when exporting an Azure SQL database](https://docs.microsoft.com/azure/sql-database/sql-database-export#considerations-when-exporting-an-azure-sql-database)
