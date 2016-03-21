<properties
	pageTitle="When to use NoSQL vs SQL | Microsoft Azure"
	description="Compare the benefits of using non-relational NoSQL solutions versus SQL solutions. Learn whether one of the Microsoft Azure NoSQL services or SQL Server solutions best fits your scenario."
	keywords="nosql vs sql, when to use NoSQL, sql vs nosql"
	services="documentdb"
	documentationCenter=""
	authors="mimig1"
	manager="jhubbard"
	editor=""/>

<tags
	ms.service="documentdb"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article" 
	ms.date="03/21/2016"
	ms.author="mimig"/>

# NoSQL vs SQL Comparison

SQL Server and relational databases (RDBMS) have been the go-to databases for over 20 years. However, the increased need to process higher volumes and varieties of data at a rapid rate has altered the nature of data storage needs for application developers. In order to enable this scenario, NoSQL databases that enable storing unstructured and heterogeneous data have gained in popularity. 

NoSQL is a category of databases and they are distinctly different from SQL databases. NoSQL means "Not-SQL" or "Not Only SQL". There are a number of technologies in the NoSQL category, including document databases, key value stores, and column family stores, which are popular with gaming, social, and IoT apps.

![Azure DocumentDB](./media/documentdb-nosql-vs-sql/nosql-vs-sql-overview1.png)

The goal of this article is to help you learn about the differences between NoSQL and SQL, and provide you with an introduction to the NoSQL and SQL offerings from Microsoft and Microsoft Azure.  

## NoSQL vs SQL 

The following table compares the benefits of NoSQL versus SQL. Which one best suits your requirements?

![Azure DocumentDB](./media/documentdb-nosql-vs-sql/nosql-vs-sql-comparison.png)

If a NoSQL database best suits your requirements, continue to the next section to learn more about the NoSQL services available from Azure. Otherwise, if a SQL database best suits your needs, skip to [What are the Microsoft SQL offerings?](#what-are-the-microsoft-sql-offerings)

## What are the Microsoft Azure NoSQL offerings?

Azure has four fully-managed NoSQL services: 

- [Azure DocumentDB](https://azure.microsoft.com/services/documentdb/)
- [Azure Table Storage](https://azure.microsoft.com/services/storage/)
- [Azure HBase as a part of HDInsight](https://azure.microsoft.com/services/hdinsight/)
- [Azure Redis Cache](https://azure.microsoft.com/services/cache/)

The following comparison chart maps out the key differentiators for each service. Which one most accurately describes the needs of your application? 

![Azure DocumentDB](./media/documentdb-nosql-vs-sql/nosql-vs-sql-documentdb-storage-hbase-hdinsight-redis-cache.png)

If one or more of these services might meet the needs of your application, learn more with the following resources: 

- [DocumentDB learning path](https://azure.microsoft.com/documentation/learning-paths/documentdb/) and [DocumentDB use cases](documentdb-use-cases.md)
- [Get started with Azure table storage](../storage/storage-dotnet-how-to-use-tables.md)
- [What is HBase in HDInsight](../hdinsight/hdinsight-hbase-overview.md)
- [Redis Cache learning path](https://azure.microsoft.com/documentation/learning-paths/redis-cache/)

Then go to [Next steps](#next-steps) for free trial information.

## What are the Microsoft SQL offerings?

Microsoft has four SQL offerings: 

- [SQL Server](https://www.microsoft.com/server-cloud/products/sql-server-2016/)
- [SQL Server on Azure Virtual Machines](https://azure.microsoft.com/services/virtual-machines/sql-server/)
- [Azure SQL Database](https://azure.microsoft.com/services/sql-database/)
- [Azure SQL Data Warehouse (Preview)](https://azure.microsoft.com/services/sql-data-warehouse/)

The following comparison charts maps out the key differentiators for each offering. Which one most accurately describes the needs of your application? 

*For comparison, do you like the info in a text table like this - or is the image table better?*

|---|**SQL Server**|**SQL Server on Azure Virtual Machines**|**Azure SQL Database**|**Azure SQL Data Warehouse (Preview)**|
|---|---|---|---|
|**Category**|Relational Database Management System (RDBMS)|SQL Server using Infrastructure as a service (IaaS)|Platform as a service (PaaS) database or database as a service (DBaaS) that is optimized for software-as-a-service (SaaS) app development|TBD|
|**Use case**|New or existing on-premises applications or new applications where private hosting and administration is preferred|New or existing on-premises applications with a preference to stop maintaining private hardware and data centers. Both hybrid and cloud-only solutions.|Building new cloud-based applications or migrating existing SQL Server solutions to take advantage of the cost savings and performance optimization that cloud services provide. Low initial time-to-market, long-term cost optimization. Elastic scale|TBD|
|**Hardware**|Complete flexibility in choosing your own hardware|Wide variety of virtual machine sizes available in Azure|Hardware selected by Microsoft|TBD|
|**Hardware hosting**|Hosted privately. SQL Server is installed on-premises by DBA|Hosted on the cloud by Azure. SQL Server is installed on Windows Server Virtual Machines (VMs) hosted by Azure|On the cloud by Azure. This is a fully managed, cloud-based Azure service.|TBD|
|**Availability**|AlwaysOn availability and log shipping maintained by DBA|99.95% availability for Virtual Machines maintained by Microsoft. SQL Server AlwaysOn availability maintained by DBA|99.99% availability maintained by Microsoft. Geo-restore and geo-replication services to protect against service outages. Point In Time Restore to protect against user error|TBD|
|**Pricing**|License based on SQL Server edition|Size of virtual machine, time usage, and license based on SQL Server edition. SQL VM images licensing built into VM pricing|For single databases, based on service tier and performance level. For elastic database pools, based on performance level and usage|TBD|

If SQL Server on a Virtual Machine or SQL Database sound like the best options, then read [Choose a cloud SQL Server option: Azure SQL (PaaS) Database or SQL Server on Azure VMs (IaaS)](../sql-database/data-management-azure-sql-database-and-sql-server-iaas.md) to learn more about the differences between the two.

If SQL Server sounds like the best option, then go to [SQL Server Editions](https://www.microsoft.com/server-cloud/products/sql-server-editions/overview.aspx) to learn more about what the different versions of SQL offer.

Then go to [Next steps](#next-steps) for free trial and evaluation links.

## Next steps

We invite you to learn more about our SQL and NoSQL products by trying them out for free. 

|Product|Free trial and evaluation information|
|---|---|
|[Azure DocumentDB](https://azure.microsoft.com/services/documentdb/)<br><br>[Azure Table Storage](https://azure.microsoft.com/services/storage/)<br><br>[Azure HBase as a part of HDInsight](https://azure.microsoft.com/services/hdinsight/)<br><br>[Azure Redis Cache](https://azure.microsoft.com/services/cache/)<br><br>[Azure SQL Data Warehouse (Preview)](https://azure.microsoft.com/services/sql-data-warehouse/)<br><br>[Azure SQL Database](https://azure.microsoft.com/services/sql-database/)|You can sign up for a [free one-month trial](https://azure.microsoft.com/pricing/free-trial/) and receive $200 to spend on Azure.|
|[SQL Server](https://www.microsoft.com/server-cloud/products/sql-server-2016/)<br><br>[SQL Server on Azure Virtual Machines](https://azure.microsoft.com/services/virtual-machines/sql-server/)|Spin up an [evaluation version of SQL Server 2016 on a virtual machine](https://azure.microsoft.com/marketplace/partners/microsoft/sqlserver2016ctp33evaluationwindowsserver2012r2/).<br><br>Or see [SQL Server Evaluations](https://www.microsoft.com/en-us/evalcenter/evaluate-sql-server-2016).|

