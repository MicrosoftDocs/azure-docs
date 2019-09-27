---
title: "Azure SQL Database Import/Export Service takes a long time to import or export a database| Microsoft Docs"
description: "Azure SQL Database Import/Export Service takes a long time to import or export a database"
services: sql-database
ms.service: sql-database
ms.topic: performance
author: v-miegge
ms.author: dcscontentpm
ms.reviewer: ""
ms.date: 09/27/2019
---

# Azure SQL Database Import/Export Service takes a long time to import or export a database

## Azure SQL Database Import/Export Service

The Azure SQL Database Import/Export Service is a REST-based web service that runs in every Microsoft Azure data center. The service provides a free request queuing service and a free Compute service to perform imports and exports from a Microsoft Azure SQL database to Microsoft Azure binary large object (BLOB) storage. The import and export operations are not a traditional physical database backup but a logical backup of the database that uses a special BACPAC format. This logical BACPAC format lets you avoid having to use a physical format that might vary between versions of SQL Server and SQL Database. Therefore, you can use it to safely restore the database to an SQL database and also to a SQL Server database.

When you use the Microsoft Azure SQL Database Import/Export Service to import or export a database, the import or export process may take a long time. This problem occurs when many customers make an import or export request at the same time in the same region.

The Azure SQL Database Import/Export Service provides a limited number of Compute virtual machines (VMs) per region to process the import and export operations. The Compute VM is hosted per region to make sure that the import or export avoids cross-region bandwidth delays and charges. If too many requests are made at the same time in the same region, significant delays occur in processing the operations. The time that is required to complete requests can vary from a few seconds to many hours. 

**Note** If a request is not processed within two days, the service automatically cancels the request.

## Solution

To work around this problem, try the following two methods:

* Use command [sqlpackage.exe](https://msdn.microsoft.com/library/hh550080(v=vs.103).aspx) to import or export a database.
* Run the BACPAC import or export directly in your code by using the DACFx API.

## More information

Although Microsoft continuously works to improve the Azure SQL Database Import/Export Service, the performance of the service varies because of the reasons that are mentioned in the "Cause" section. If your application requires consistently faster or more predictable import or export performance, you can perform the BACPAC import or export directly in your code by using the DACFx API. The DACFx API is a set of classes that you can use to perform operations on a BACPAC package. This lets you write your own BACPAC utility application or include BACPAC functionality in any application. 

To obtain the DACFx API libraries, you can download the latest version of Microsoft SQL Server Data-Tier Application Framework.

If your database exports are used only for recovery from accidental data deletion, the Basic, Standard, and Premium editions of SQL Server all provide self-service restoration capability from system-generated backups.

## Related documents

[Using SQLPackage to import or export SQL Server and Azure SQL DB](https://blogs.msdn.microsoft.com/azuresqldbsupport/2017/01/31/using-sqlpackage-to-import-or-export-azure-sql-db/)
