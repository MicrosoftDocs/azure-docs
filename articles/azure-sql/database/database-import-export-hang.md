---
title: Import and export of a database takes a long time
description: "Azure SQL Database and Azure SQL Managed Instance Import/Export service takes a long time to import or export a database"
ms.custom: seo-lt-2019, sqldbrb=1
services: sql-database
ms.service: sql-database
ms.topic: troubleshooting
author: v-miegge
ms.author: ramakoni
ms.reviewer: ""
ms.date: 09/27/2019
---

# Azure SQL Database and Managed Instance Import/Export service takes a long time to import or export a database
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

When you use the Import/Export service, the process might take longer than expected. This article describes the potential causes for this delay and alternative workaround methods.

## Azure SQL Database Import/Export service

The Azure SQL Database Import/Export service is a REST-based web service that runs in every Azure data center. This service is called when you use either the [Import database](database-import.md#using-azure-portal) or [Export](https://docs.microsoft.com/azure/sql-database/sql-database-export#export-to-a-bacpac-file-using-the-azure-portal) option to move your SQL database in the Azure portal. The service provides free request queuing and compute services to perform imports and exports between Azure SQL Database and Azure Blob storage.

The import and export operations don't represent a traditional physical database backup but instead a logical backup of the database that uses a special BACPAC format. The BACPAC format lets you avoid having to use a physical format that might vary between versions of Microsoft SQL Server and Azure SQL Database. Therefore, you can use it to safely restore the database to a SQL Server database and to a SQL database.

## What causes delays in the process?

The Azure SQL Database Import/Export service provides a limited number of compute virtual machines (VMs) per region to process import and export operations. The compute VMs are hosted per region to make sure that the import or export avoids cross-region bandwidth delays and charges. If too many requests are made at the same time in the same region, significant delays can occur in processing the operations. The time that's required to complete requests can vary from a few seconds to many hours.

> [!NOTE]
> If a request is not processed within four days, the service automatically cancels the request.

## Recommended solutions

If your database exports are used only for recovery from accidental data deletion, all the Azure SQL Database editions provide self-service restoration capability from system-generated backups. But if you need these exports for other reasons, and if you require consistently faster or more predictable import/export performance, consider the following options:

* [Export to a BACPAC file by using the SQLPackage utility](https://docs.microsoft.com/azure/sql-database/sql-database-export#export-to-a-bacpac-file-using-the-sqlpackage-utility).
* [Export to a BACPAC file by using SQL Server Management Studio (SSMS)](https://docs.microsoft.com/azure/sql-database/sql-database-export#export-to-a-bacpac-file-using-sql-server-management-studio-ssms).
* Run the BACPAC import or export directly in your code by using the Microsoft SQL Server Data-Tier Application Framework (DacFx) API. For additional information, see:
  * [Export a data-tier application](https://docs.microsoft.com/sql/relational-databases/data-tier-applications/export-a-data-tier-application)
  * [Microsoft.SqlServer.Dac Namespace](https://docs.microsoft.com/dotnet/api/microsoft.sqlserver.dac)
  * [Download DACFx](https://www.microsoft.com/download/details.aspx?id=55713)

## Things to consider when you export or import an Azure SQL database

* All the methods discussed in this article use up the Database Transaction Unit (DTU) quota, which causes throttling by the Azure SQL Database service. You can [view the DTU stats for the database on the Azure portal](https://docs.microsoft.com/azure/sql-database/sql-database-monitor-tune-overview#sql-database-resource-monitoring). If the database has reached its resource limits, [upgrade the service tier](https://docs.microsoft.com/azure/sql-database/sql-database-scale-resources) to add more resources.
* Ideally, you should run client applications (like the sqlpackage utility or your custom DAC application) from a VM in the same region as your SQL database. Otherwise, you might experience performance issues related to network latency.
* Exporting large tables without clustered indexes can be very slow or even cause failure. This behavior occurs because the table can't be split up and exported in parallel. Instead, it must be exported in a single transaction, and that causes slow performance and potential failure during export, especially for large tables.


## Related documents

[Considerations when exporting an Azure SQL database](https://docs.microsoft.com/azure/sql-database/sql-database-export#considerations-when-exporting-an-azure-sql-database)
