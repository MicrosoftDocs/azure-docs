<properties 
	pageTitle="Options for transferring stored data to the cloud | Azure" 
	description="Guidance for choosing the best option for transferring data from on-premises other cloud sources into Microsoft Azure for advanced analytics." 
	services="data-factory, hdinsight, machine-learning, storage, sql-database" 
	documentationCenter="" 
	authors="cjgronlund" 
	manager="paulettm" 
	editor=""/>

<tags 
	ms.service="multiple" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.workload="big-data" 
	ms.date="1/7/2014" 
	ms.author="cgronlun"/>

# Options for transferring stored data to the Azure cloud

This article provides guidance for choosing the right option for transferring data from on-premises deployment or other cloud sources into Microsoft Azure for advanced data analytics. Transferring large amounts of data can take a long time and requires proper security. 

In this article:

* [Azure Import/Export service for Blob storage](#blob)
* [AZCopy utility](#azcopy-utility)
* [Azure PowerShell](#ps)
* [Azure Data Factory (preview)](#data-factory)
* [Azure SQL Database migration tools](#tools)
* [Azure SQL Data Sync (preview)](#data-sync)
* [Azure Event Hubs](#event-hubs)
* [Other options for data transfer](#other)
* [Choose the right data transfer option](#choose)


## Azure Import/Export service for Blob storage

You can use the Azure Import/Export service to transfer large amounts of file data to or from Azure Blob storage in situations where uploading or downloading over the network is prohibitively expensive or not feasible. Large data sets take very long time to upload or download over the network. For example, 10 TB takes 1 month over T3 (44.7 Mbps). With Microsoft Azure Import/Export service, customers can ship the hard drive to cut down the data upload or download time. Plan on several days including shipping. 

To transfer a large set of file data into Blob storage, you can send one or more hard drives containing that data to an Azure data center, where your data will be uploaded to your storage account. Similarly, to export data from Blob storage, you can send empty hard drives to an Azure data center, where the Blob data from your storage account will be copied to your hard drives and then returned to you. Before you send in a drive that contains data, you'll encrypt the data on the drive; when the Import/Export service exports your data to send to you, the data will also be encrypted before shipping.

For more information, see [Use the Microsoft Azure Import/Export Service to Transfer Data to Blob Storage][import-export].


## AZCopy utility

AzCopy is a command-line utility designed for high-performance uploading, downloading, and copying data to and from Microsoft Azure Blob, File, and Table storage. This utility is suitable for one-time data movement between Azure storage and on-premises if transferring the data via network is practical. See [Getting Started with the AzCopy Command-Line Utility][azcopy].

> [AZURE.NOTE] Linux users: [Download ACP, AzCopy for Linux](http://www.paratools.com/acp)


## Azure PowerShell

Azure PowerShell is a powerful scripting environment that you can use to control and automate the deployment and management of your workloads in Azure. You can use Azure PowerShell to upload data to Blob storage, so the data can be processed by advanced analytics or MapReduce jobs.

Also see:

* [Upload data to Blob storage using Azure PowerShell][upload]
* [How to install and configure Azure PowerShell][install]


## Azure Data Factory (preview)

Azure Data Factory is a fully managed service for composing data storage, processing, and movement services into streamlined, scalable, and reliable data production pipelines.

Developers can build data-driven workflows that join, aggregate and transform semi-structured, unstructured and structured data sourced from their on-premises (via Data Management Gateway), cloud-based and internet services, and set up complex data processing through simple JSON scripting. The result data can be stored in Azure Storage or Azure SQL Database for advanced analytics.

Specifically, a developer can orchestrate regular copy activities between various sources and destinations shown in the "[Supported sources and sinks](data-factory-copy-activity.md#SupportedSourcesAndSinks)" section of [Copy data with Azure Data Factory](data-factory-copy-activity.md), which also includes properties for different types of data stores, column mapping, serialization formats, and type handling.

The service can handle failures with auto restart and allow format conversion when moving data from one format to the other. To define a copy activity, see [Get started with Data Factory][start]. Data store registration and gateway installation experiences are described in [Enable your pipelines to work with on-premises data][pipelines]. 

Also see:

* [Introduction to Data Factory][intro]

## Azure SQL Database migration tools

There are many tools available to successfully migrate SQL Server on-premises and non-SQL Server databases and to Azure SQL Database. The best tool for your scenario depends on the type, size, and complexity of the database being migrated:

* You can migrate both schema and data of an existing Azure SQL Database by exporting the database, storing the export file in an Azure Blob Storage Account, then importing as a new Azure SQL Database. The file that created when this export is referred to as a BACPAC file. For more information, see [How to: Use the Import and Export Service in Azure SQL Database)][sql-import].
* Database Copy feature creates a new database in Azure that is a transactional consistent copy of an existing Azure SQL Database. For more information, see [Copying Databases in Azure SQL Database][sql-copy].
* SQL Server Integration Services (SSIS) can be used when complex transformations of data are needed. SSIS can be used to move data into and out of Azure SQL Database. For more information, see [How to: Use Integration Services to Migrate a Database to Azure SQL Database][integrate] and [SSIS for Azure and Hybrid Data Movement][SSIS].
* The SQL Server Import and Export Wizard is an easy way to create an SSIS package to migrate data. After configuring the source and destination, you can specify basic data transformations. These packages can be saved, modified, executed, and scheduled as a job. For more information, see [How to: Use the Import and Export Wizard to Migrate a Database to Azure SQL Database][wizard].
* The SQL Database Migration Wizard is a tool that helps migrate both schema and data between on-premises SQL Server and Azure SQL Database, as well as between Azure SQL Database servers. The tool also analyzes trace files and scripts for compatibility issues with Azure SQL Database. For more information, see [How to: Use the SQL Database Migration Wizard][use-wizard].
* The bcp utility can be used to import large numbers of new rows into SQL Server tables or to export data out of tables into data files. For more information, see [How to: Use bcp to migrate a Database to Azure SQL Database][bcp].

Also see:

* [Migrating Databases to Azure SQL Database][migrate]
 

## Azure SQL Data Sync (preview)

SQL Data Sync (preview) enables creating and scheduling regular synchronizations between Azure SQL Database and databases hosted in SQL Server or Azure SQL Database.

SQL Data Sync is suitable for data developers to synchronize delta changes between on-premises and cloud Azure databases. See [SQL Data Sync][sync].

##	Azure Event Hubs

Microsoft Azure Event Hubs is an event ingestor service that provides event and telemetry ingress to the cloud at massive scale, with low latency and high reliability. This service, used with other downstream services, is particularly useful in application instrumentation, user experience or workflow processing, and Internet of Things scenarios.

Developers can write code to send data to event hub, process the data and store in Azure Blob or Azure SQL Database for further process.

Alternatively, developers can leverage Azure Stream Analytics, a fully managed service providing scalable complex event processing over streaming data for output. Developer can pick a stream from Azure Event Hub, specify the format being used to serialize incoming event (e.g. JSON, CSV or Avro formats), and then add output location including Azure Blob or Azure SQL Database.

See:

* [Event Hubs service information](/services/event-hubs/)
* [Event Hubs Overview][overview]
* [Introduction to Azure Stream Analytics][stream]

## Other options for data transfer

Hybrid Connections provides an easy and convenient way to connect Azure Websites and Azure Mobile Services to on-premises resources. Developers can build web site to move data from on-premises to Azure. See [Hybrid Connections Overview][hybrid] for details.

With [Virtual Network](/services/virtual-network/), you can use data integration tools running in Azure virtual machine to securely connect to on-premises SQL Server databases in your on-site datacenter. Only virtual machines and services within the same virtual network can identify or connect to each other. If you prefer, you can even create an [ExpressRoute](/services/expressroute/) direct connection to Azure through your network service provider or exchange provider and bypass the public internet altogether.

[Azure Marketplace](?source=datamarket.md) offers partner solutions that enable data movement to Azure, e.g. Storm Managed File Transfer.

## Choose the right data transfer option

### Decision tree

![Help deciding which cloud data transfer option to choose.][decision]

Notes about the decision tree:

* SQL Data Sync (preview) triggers a sync from changed data.
* Data Factory (preview) supports copying data between Azure Storage, Azure SQL Database, and on-premises SQL Server. 
* In addition to using Data Factory, you can extend existing SSIS packages to move data to cloud in a scheduled manner.

### Move GBs of data

<table border="1">
<tr>
<th>Move data</th>
<th>One time</th>
<th>Scheduled</th>
<th>Considerations</th>
</tr>

<tr>
<td><p>File to Azure Storage</p>
</td>
<td><ul>
<li><a href="/documentation/articles/storage-use-azcopy/">AzCopy</a></li>
<li><a href="http://www.paratools.com/acp" target="_blank">acp</a></li>
<li><a href="/documentation/articles/install-configure-powershell/">Azure PowerShell</a></li>
<li><a href="/documentation/articles/storage-import-export-service/">Azure Import/Export</a></li>
</ul>
</td>
<td><p>N/A</p>
</td>
<td><p>Use Azure Import/Export instead of AzCopy, acp and Azure PowerShell when data transfer via the network  is impractical. The service can take up to several days in addition to shipping the disk to data center.</p>
</td>
</tr>

<tr>
<td>
<ul>
<li>SQL Server to Azure SQL Database</li>
<li>Azure SQL Database to SQL Server</li>
</ul>
</td>
<td><ul>
<li><a href="/documentation/articles/data-factory-introduction/">Azure Data Factory</a></li>
<li><a href="http://msdn.microsoft.com/library/azure/ee730904.aspx">SQL Database Migration Tools</a></li>
</ul>
</td>
<td><p><a href="/documentation/articles/data-factory-introduction/">Azure Data Factory</a></p>
</td>
<td><p>Suggest to use Azure Data Factory (preview) instead of migration tools which offers format conversion and job auto recovery in exceptional cases. If SQL Server is on-premises, Data Management Gateway is needed to connect to SQL Server.</p>
</td>
</tr>

<tr>
<td>
<ul>
<li>Azure Storage to Azure SQL Database</li>
<li>Azure SQL Database to Azure Storage</li>
</ul>
</td>
<td><p><a href="/documentation/articles/data-factory-introduction/">Azure Data Factory</a></p>
</td>
<td><p><a href="/documentation/articles/data-factory-introduction/">Azure Data Factory</a></p>
</td>
<td><p>Azure Data Factory (preview) offers format conversion and job auto recovery in exceptional cases. If SQL Server is on-premises, Data Management Gateway is needed to connect to SQL Server.</p>
</td>
</tr>

<tr>
<td>
<ul>
<li>SQL Server to SQL Data Sync</li>
<li>SQL Data Sync to Azure SQL Database</li>
</ul>
</td>
<td><p>N/A</p>
</td>
<td><p><a href="http://msdn.microsoft.com/library/azure/hh456371.aspx">SQL Data Sync</a></p>
</td>
<td><p>SQL Data Sync (preview) synchronizes your data by sync groups which define the databases, tables and columns to synchronize as well as the synchronization schedule.</p>
</td>
</tr>

</table>



### Move TBs of data

<table border="1">
<tr>
<th>Move data</th>
<th>One time</th>
<th>Scheduled</th>
<th>Considerations</th>
</tr>

<tr>
<td><p>File to Azure Storage</p>
</td>
<td><p><a href="/documentation/articles/storage-import-export-service/">Azure Import/Export</a></p>
</td>
<td><p>N/A</p>
</td>
<td><p>The service can take up to several days in addition the time it takes the disk to reach to data center.</p>
</td>
</tr>

</table>
<br>


<!--Anchors-->
[Azure Import/Export service for Blob storage]: #blob
[AZCopy utility]: #azcopy-utility
[Azure PowerShell]: #ps
[Azure Data Factory (preview)]: #data-factory
[Azure SQL Database migration tools]: #tools
[Azure SQL Data Sync (preview)]: #data-sync
[Azure Event Hubs]: #event-hubs
[Other options for data transfer]: #other
[Choose the right data transfer option]: #choose

<!--Image references-->
[decision]: ./media/data-management-options-for-transferring-data/data-transfer-decision-tree.png


<!--Link references-->
[import-export]: storage-import-export-service.md
[azcopy]: storage-use-azcopy.md
[upload]: hdinsight-upload-data.md#powershell
[install]: install-configure-powershell.md
[start]: data-factory-get-started.md
[pipelines]: data-factory-use-onpremises-datasources.md
[copy]: data-factory-copy-activity.md
[intro]: data-factory-introduction.md
[sql-import]: http://msdn.microsoft.com/library/azure/hh335292.aspx
[sql-copy]: http://msdn.microsoft.com/library/azure/ff951624.aspx
[integrate]: http://msdn.microsoft.com/library/azure/jj156150.aspx
[SSIS]: http://msdn.microsoft.com/library/jj901708.aspx
[wizard]: http://msdn.microsoft.com/library/azure/jj156152.aspx
[use-wizard]: http://msdn.microsoft.com/library/azure/jj156144.aspx
[bcp]: http://msdn.microsoft.com/library/azure/jj156153.aspx
[migrate]: http://msdn.microsoft.com/library/azure/ee730904.aspx
[overview]: http://msdn.microsoft.com/library/dn836025.aspx
[stream]: stream-analytics-introduction.md
[sync]: http://msdn.microsoft.com/library/azure/hh456371.aspx
[hybrid]: integration-hybrid-connection-overview.md
