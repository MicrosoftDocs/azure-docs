<properties
   pageTitle="Load data into SQL Data Warehouse | Microsoft Azure"
   description="Learn the common scenarios for data loading in SQL Data Warehouse"
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="TwoUnder"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/21/2015"
   ms.author="mausher;barbkess"/>

# Load data into SQL Data Warehouse
SQL Data Warehouse presents numerous options for loading data for a variety of scenarios. For example, you might want to load:

- large batches once a day,
- smaller batches throughout the day, or
- simple updates to smaller (dimension) tables

The needs of each scenario are as varied as the types of data that you want to load in SQL Data Warehouse. In this article, we will list out some of the choices you have for loading data. 

## Technologies
SQL Data Warehouse supports these standard data loading tools:

- Azure Data Factory
- bcp command-line utility
- PolyBase
- SQL Server Integration Services (SSIS)
- 3rd party data loading tools

### Azure Data Factory (ADF)
ADF is a fully managed service for composing data storage, data processig, and data movement services into streamlined, scalable, and reliable data production pipelines. SQL Data Warehouse is a [supported source/sink][] for ADF [copy activity][]. 

### bcp command-line utility
The **bcp** command line executable is a Microsoft utility that allows for data loading and extraction from SQL Server, SQL Database, and SQL Data Warehouse. To get started, follow the [Load data with bcp][] tutorial.

### PolyBase
PolyBase is a Microsoft technology that simplifies data analysis by providing a way to query Hadoop and Azure Storage blob storage, all with standard Transact-SQL and without using MapReduce. PolyBase can also load data from Azure blob storage into SQL Data Warehouse. To get started, follow the [Load with PolyBase][] tutorial.

### SQL Server Integration Services (SSIS)
[SSIS][] is a platform for building enterprise-level data integration and transformation solutions. To build packages that connect to SQL Data Warehouse, use the standard [OLE DB destination adapter][] using an ADO.Net connection manager.

### 3rd party tools
SQL Data Warehouse supports leading industry solutions for data loading. For more details, see our list of [solution partners][].

## Next steps
For more development tips, see the [development overview][].

<!--Image references-->

<!--Article references-->
[Load data with bcp]: sql-data-warehouse-load-with-bcp.md
[Load with PolyBase]: sql-data-warehouse-load-with-polybase.md
[solution partners]: sql-data-warehouse-solution-partners.md
[development overview]: sql-data-warehouse-overview-develop.md

<!--MSDN references-->
[supported source/sink]: https://msdn.microsoft.com/library/dn894007.aspx
[copy activity]: https://msdn.microsoft.com/library/dn835035.aspx
[SQL Server destination adapter]: https://msdn.microsoft.com/library/ms141237.aspx
[SSIS]: https://msdn.microsoft.com/library/ms141026.aspx


<!--Other Web references-->
