<properties
   pageTitle="Elasticity with the Data Warehouse Unit (DWU)"
   description="SQL Data Warehouse's elasticity lets you grow, shrink, or pause compute power by using a sliding scale of data warehouse units (DWUs). This article explains the data warehouse metrics and how they relate to DWUs."
   services="SQL Data Warehouse"
   documentationCenter="NA"
   authors="barbkess"
   manager="jhubbard"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="05/23/2015"
   ms.author="barbkess;JRJ@BigBangData.co.uk;micwa"/>

# Elasticity with the Data Warehouse Unit (DWU)

Independent of cloud storage, SQL Data Warehouse's elasticity lets you grow, shrink, or pause compute power by using a sliding scale of data warehouse units (DWUs). This article explains the data warehouse metrics and how they relate to DWUs.

> [AZURE.NOTE] Unlike other cloud data warehouse services that ask you how many CPUs, memories or disks you want for your data warehouse, SQL Data Warehouse asks you a more intelligent question: how fast do you want to process your data?


## DWU throughput metrics
SQL Data Warehouse offers multiple performance levels. Each performance level provides an increasing set of resources, or 'power', that delivers increased database performance. To measure the performance level, Microsoft has defined metrics for a mix of basic operations found in all data warehouse workloads.

The metrics used are

- Clustered columnstore index (CCI) scan rate
- CCI load rate
- Table copy

The unit of measure (UOM) for these metrics is million rows per second (MilRows/Sec).

| DWU | CCI scan rate (MilRows/sec) | CCI load rate (MilRows/sec) | Bulk table copy (MilRows/Sec) |
| :-- | :---------------------------| :-------------------------- | :---------------------------- |
| DWU100 | 01 | 15 | 10 |
| DWU200 | 02 | 30 | 20 |
| DWU300 | 03 | 45 | 30 |
| DWU400 | 04 | 60 | 40 |
| DWU500 | 05 | 75 | 50 |
| DWU600 | 06 | 90 | 60 |
| DWU1000 | 10 | 150 | 100 |
| DWU1500 | 10 | 150 | 100 |
| DWU2000 | 10 | 150 | 100 |

> [Azure.Note] Bulk table copy is measured by running a statement called CREATE TABLE AS SELECT (CTAS). This is a new Transact-SQL statement specific to SQL Data Warehouse.

### Factors affecting throughput

The actual throughput that you observe will vary from the benchmarked performance according to specific attributes of your data warehouse. These are some of the factors that can affect throughput:

- Table width
- Queries causing Data Movement
- Column data types
- Network connectivity

## How to select a service and performance level
To change performance levels:

1. You simply select a different DWU. The service will respond rapidly to adjust the compute resources to meet the DWU requirements.
2. For a data warehouse in development, start with small number of DWUs.
3. Monitor your application performance, so you can become familiar with DWUs versus the performance you observer. You can then make adjustments until you reach an optimum performance level for your business requirements.

If you have an application with a fluctuating workload, you can move performance levels up or down to accommodate peaks and low points. For example, if a workload typically peaks at the end of the month, you could plan to add more DWUs during the peak days.

## How to Monitor Performance
Monitoring the performance of a SQL Data Warehouse starts with monitoring the resource utilization relative to the performance level you chose for your database. Relevant data is available through:

1. Azure Management Portal
2. Dynamic management views, available in the logical master database of the server in which you created the database.
Please refer to corresponding sections for details on how to use the portal or the DMV.



<!--Image references-->
[5]: ./media/markdown-template-for-new-articles/octocats.png
[6]: ./media/markdown-template-for-new-articles/pretty49.png
[7]: ./media/markdown-template-for-new-articles/channel-9.png
[8]: ./media/markdown-template-for-new-articles/copytemplate.png

<!--Link references--In actual articles, you only need a single period before the slash.>
[Link 1 to another azure.microsoft.com documentation topic]: ../virtual-machines-windows-tutorial/
[Link 2 to another azure.microsoft.com documentation topic]: ../web-sites-custom-domain-name/
[Link 3 to another azure.microsoft.com documentation topic]: ../storage-whatis-account/
