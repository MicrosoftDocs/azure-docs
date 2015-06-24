<properties
   pageTitle="Performance and scale overview | Microsoft Azure"
   description="Introduction to the performance and scale features of SQL Data Warehouse."
   services="SQL Data Warehouse"
   documentationCenter="NA"
   authors="jrowlandjones"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/24/2015"
   ms.author="barbkess;JRJ@BigBangData.co.uk;mausher;nicw"/>

# Performance and scale overview
By putting your Data Warehouse in the cloud, you no longer have to deal with low-level hardware issues.  Gone are the days where you need to research what type of processors, how much memory or what type of storage you need to have great performance in your data warehouse.  Instead, SQL Data Warehouse asks you this question: how fast do you want to process your data? 

SQL Data Warehouse is a cloud based, distributed database platform that's designed to deliver great performance at scale where you are in full control of the resources used to resolve your queries. By  simply adjusting the number of data warehouse units allocated to your data warehouse you can elastically scale the size of your warehouse resources in seconds. As a distributed, scale out platform, SQL Data Warehouse enables your data warehouse to process significant data volumes efficiently and effectively whilst leaving you in complete control of the cost of the solution.

## Key performance concepts

Please refer to the following articles to help you understand some key performance and scale concepts:
- [Elastic performance and scale][]
- [SQL Data Warehouse concurrency model][]
- [Designing tables][]
- [How to choose a hash distribution key for your table][]
- [Implement statistics for improved performance][]

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
Please refer to the [development overview][] article to get some guidance on building your SQL Data Warehouse solution.

[Elastic performance and scale]: ./sql-data-warehouse-performance-scale/
[SQL Data Warehouse concurrency model]: ./sql-data-warehouse-develop-concurrency/
[Designing tables]: ./sql-data-warehouse-develop-table-design/
[How to choose a hash distribution key for your table]: ./sql-data-warehouse-develop-hash-distribution-key/
[Implement statistics for improved performance] ./sql-data-warehouse-develop-statistics

[development overview][] ./sql-data-warehouse-overview-develop/

<!--Image references-->

<!--Link references--In actual articles, you only need a single period before the slash.>
