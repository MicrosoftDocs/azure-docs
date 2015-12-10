<properties
   pageTitle="Troubleshooting | Microsoft Azure"
   description="Troubleshooting SQL Data Warehouse."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="TwoUnder"
   manager=""
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="12/10/2015"
   ms.author="twounder"/>

# Troubleshooting
Azure SQL Data Warehouse is a s

## Connectivity
Connecting to Azure SQL Data Warehouse can fail for a couple of common reasons:

- Firewall rules are not set
- Using unsupported tools/protocols

### Firewall Rules
Azure SQL databases are protected by server and database level firewalls to ensure only known IP addresses can access databases. The firewalls are secure by default - meaning you must allow your IP address access before you can connect.

To configure your firewall for access, please follow the steps in the [Configure server firewall access for your client IP](https://azure.microsoft.com/documentation/articles/sql-data-warehouse-get-started-provision/#step-4-configure-server-firewall-access-for-your-client-ip) section of the [Provision](https://azure.microsoft.com/documentation/articles/sql-data-warehouse-get-started-provision/) page.

### Using unsupported tools/protocols
SQL Data Warehouse supports [Visual Studio 2013/2015](https://azure.microsoft.com/documentation/articles/sql-data-warehouse-get-started-connect/) as development environments and [SQL Server Native Client 10/11 (ODBC)](https://msdn.microsoft.com/library/ms131415.aspx) for client connectivity.Using   

See our [Connect](https://azure.microsoft.com/documentation/articles/sql-data-warehouse-get-started-connect/) pages to learn more.

## Query Performance
SQL Data Warehouse uses common SQL Server constructs for executing queries including statistics. Statistics are objects that contain information about the range and frequency of values in a database column. The query engine uses these statistics to optimize query execution and improve query performance.

See our [Statistics](https://azure.microsoft.com/documentation/articles/sql-data-warehouse-develop-statistics/) page to learn more. 


## Data Loading

See our [Loading](https://azure.microsoft.com/documentation/articles/sql-data-warehouse-get-started-load-with-polybase/) pages to learn more. 


## Key performance concepts

Please refer to the following articles to help you understand some additional key performance and scale concepts:

- [performance and scale][]
- [concurrency model][]
- [designing tables][]
- [choose a hash distribution key for your table][]
- [statistics to improve performance][]

## Next steps
Please refer to the [development overview][] article to get some guidance on building your SQL Data Warehouse solution.

<!--Image references-->

<!--Article references-->

[performance and scale]: sql-data-warehouse-performance-scale.md
[concurrency model]: sql-data-warehouse-develop-concurrency.md
[designing tables]: sql-data-warehouse-develop-table-design.md
[choose a hash distribution key for your table]: sql-data-warehouse-develop-hash-distribution-key
[statistics to improve performance]: sql-data-warehouse-develop-statistics.md
[development overview]: sql-data-warehouse-overview-develop.md

<!--MSDN references-->

<!--Other web references-->
