---
title: SQL Data Warehouse Frequently Asked Questions | Microsoft Docs
description: This article lists out frequently asked questions about SQL Data Warehouse from customers and developers
services: sql-data-warehouse
documentationcenter: NA
author: hirokib
manager: johnmac
editor: ''

ms.assetid: 812CA525-3BF3-49DF-8DF3-FB4342464F4F
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.date: 3/1/2017
ms.author: elbutter

---

# SQL Data Warehouse Frequently Asked Questions

## General

Q. What does SQL DW offer for data security?

A. SQL DW offers several solutions for protecting data such as TDE and auditing. For more information see [Security].

Q. Where can I find out what legal or business standards is SQL DW compliant with?

A. Visit the [Microsoft Compliance] page for various compliance offerings by product such as SOC and ISO. 
First choose by Compliance title, then expand Azure in the Microsoft in-scope cloud services section on the right side of the page to see what services are Azure services are compliant.
 
Q. Where can I find benchmark data?

A. SQL Data Warehouse currently does testing in lab with TPC-H and a variety of other benchmarking data sets for performance testing. We have found however that synthetic datasets can often be misleading to customers when they are not like production workloads. 

Q. Can I connect PowerBI?

A. Yes! Though PowerBI supports direct query with SQL DW, it’s not intended for large number of users or real-time data. For production use of PowerBI, we recommend using PowerBI on top of Azure Analysis Services or Analysis Service IaaS. 

Q. What are SQL Data Warehouse Capacity Limits?

A. See our current [capacity limits] page. 

## User Support

Q. I have a feature request, where do I submit it?

A. If you have a feature request, submit it on our [UserVoice] page

Q. How can I do x?

A. For help in developing with SQL Data Warehouse, you can ask questions on our [Stack Overflow] page. 

Q. How do I submit a support ticket?

A. [Support Tickets] can be filed through Azure portal.

## SQL Language/Feature support 

Q. What datatypes does SQL Data Warehouse support?

A. See SQL Data Warehouse [data types].

Q. What table features do you support?

A. While SQL Data Warehouse supports many features, some are not supported and are documented in [Unsupported Table Features].


## Loading

Q. What client drivers do you support?

A. Driver support for DW can be found on the [Connection Strings] page

Q: What file formats are supported by PolyBase with SQL Data Warehouse?

A: Orc, RC, Parquet and delimited text

Q: What can I connect to from SQL DW using PolyBase? 

A: [Azure Data Lake Store] and [Azure Storage Blobs]


Q: Is computation pushdown possible  when connecting to Azure Storage Blobs or ADLS? 

A: No, SQL DW PolyBase only interacts the storage components. 

Q: Can I connect to HDI?

A: HDI can use either ADLS or WASB as the HDFS component. If this is your configuration, then you can load that data into SQL DW. However, you cannot generate push down computation to the HDI instance. 


<!-- Article references -->
[UserVoice]: https://feedback.azure.com/forums/307516-sql-data-warehouse
[Connection Strings]: ./sql-data-warehouse-connection-strings.md
[Stack Overflow]: http://stackoverflow.com/questions/tagged/azure-sqldw
[Support Tickets]: ./sql-data-warehouse-get-started-create-support-ticket.md
[Security]: ./sql-data-warehouse-overview-manage-security.md
[Microsoft Compliance]: https://www.microsoft.com/en-us/trustcenter/compliance/complianceofferings
[capacity limits]: ./sql-data-warehouse-service-capacity-limits
[data types]: ./sql-data-warehouse-tables-data-types
[Unsupported Table Features]: ./sql-data-warehouse-tables-overview#unsupported-table-features
[Azure Data Lake Store]: ./sql-data-warehouse-load-from-azure-data-lake-store 
[Azure Storage Blobs]: ./sql-data-warehouse-load-from-azure-blob-storage-with-polybase
