<properties
   pageTitle="Use Azure Data Factory with SQL Data Warehouse | Microsoft Azure"
   description="Tips for using Azure Data Factory (ADF) with Azure SQL Data Warehouse for developing solutions."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="lodipalm"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="05/02/2016"
   ms.author="lodipalm;barbkess;sonyama"/>

# Use Azure Data Factory with SQL Data Warehouse

Azure Data Factory provides a fully managed method for orchestrating the transfer of data and execution of stored procedures on SQL Data Warehouse.  This will allow you to more easily set-up and schedule complex Extract Transform and Load (ETL) procedures with SQL Data Warehouse. For a more complete overview of Azure Data Factory, see the [Azure Data Factory documentation][].

## Data Movement

Azure Data Factory enables data movement between both on-premises sources and different Azure services.  Overall, current integration with Azure Data Factory supports data movement to and from the following locations:

+ Azure blob storage
+ Azure SQL Database
+ On-premises SQL Server
+ SQL Server on IaaS

For information on how to set up a data copy activity see [Copy data with Azure Data Factory][]

## Stored Procedures
 In the same way it can be used to schedule data transfer, Azure Data Factory can also be used to orchestrate the execution of stored procedures.  This allows more complex pipelines to be created and extends Azure Data Factory's ability to leverage the computational power of SQL Data Warehouse.

## Next steps
For an overview of integration, see [SQL Data Warehouse integration overview][].
For more development tips, see [SQL Data Warehouse development overview][].

<!--Image references-->

<!--Article references-->

[Copy data with Azure Data Factory]: ../data-factory/data-factory-data-movement-activities.md
[SQL Data Warehouse development overview]: ./sql-data-warehouse-overview-develop.md
[SQL Data Warehouse integration overview]: ./sql-data-warehouse-overview-integrate.md

<!--MSDN references-->

<!--Other Web references-->
[Azure Data Factory documentation]:https://azure.microsoft.com/documentation/services/data-factory/

