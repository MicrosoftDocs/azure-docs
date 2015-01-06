<properties title="Options for transferring stored data to the Azure cloud" pageTitle="Options for transferring stored data to the cloud | Azure" description="Guidance for choosing the best option for transferring data from on-premises other cloud sources into Microsoft Azure for advanced analytics." metaKeywords="" services="data-factory,hdinsight,machine-learning,storage,sql-database" solutions="" documentationCenter="" authors="cjgronlund" videoId="" scriptId="" manager="paulettm" />

<tags ms.service="multiple" ms.devlang="na" ms.topic="article" ms.tgt_pltfrm="na" ms.workload="big-data" ms.date="1/6/2014" ms.author="cgronlun" />

# Options for transferring stored data to the Azure cloud

This article provides guidance for choosing the right option for transferring data from on-premises deployment or other cloud sources into Microsoft Azure for advanced data analytics. Transferring large amounts of data can take a long time and requires proper security. 

In this article:

* [Azure Import/Export service for Blob storage]
* [AZCopy]
* [Azure PowerShell]
* [Azure Data Factory (preview)]
* [Azure Database Migration Tooling]
* [Azure Data Sync Service (preview)]
* [Azure Event Hubs]
* [Other options for data transfer]
* [Choose the right data transfer option]


## Azure Import/Export service for Blob storage

You can use the Azure Import/Export service to transfer large amounts of file data to or from Azure Blob storage in situations where uploading or downloading over the network is prohibitively expensive or not feasible. Large data sets take very long time to upload or download over the network. For example, 10 TB takes 1 month over T3 (44.7 Mbps). With Microsoft Azure Import/Export service, customers can ship the hard drive to cut down the data upload or download time. Plan on . The service can take up to several days in addition to shipping as against weeks or months using a T1 or T3 link.

To transfer a large set of file data into Blob storage, you can send one or more hard drives containing that data to an Azure data center, where your data will be uploaded to your storage account. Similarly, to export data from Blob storage, you can send empty hard drives to an Azure data center, where the Blob data from your storage account will be copied to your hard drives and then returned to you. Before you send in a drive that contains data, you'll encrypt the data on the drive; when the Import/Export service exports your data to send to you, the data will also be encrypted before shipping.

For more information, see [Use the Microsoft Azure Import/Export Service to Transfer Data to Blob Storage][import-export].


## AZCopy

AzCopy is a command-line utility designed for high-performance uploading, downloading, and copying data to and from Microsoft Azure Blob, File, and Table storage. This utility is suitable for one-time data movement between Azure storage and on-premises if transferring the data via network is practical.

> [AZURE.NOTE] Linux users: [Download ACP, AzCopy for Linux](http://www.paratools.com/acp)

Also see:

* [Getting Started with the AzCopy Command-Line Utility][azcopy]
* [AzCopy – Uploading/Downloading files for Azure Blobs](http://blogs.msdn.com/b/windowsazurestorage/archive/2012/12/03/azcopy-uploading-downloading-files-for-windows-azure-blobs.aspx)

## Azure PowerShell

Azure PowerShell is a powerful scripting environment that you can use to control and automate the deployment and management of your workloads in Azure. You can use Azure PowerShell to upload data to Blob storage, so the data can be processed by advanced analytics or MapReduce jobs.

Also see:

* [Upload data to Blob storage using Azure PowerShell][upload]
* [How to install and configure Azure PowerShell][install]


## Azure Data Factory (preview)

Azure Data Factory is a fully managed service for composing data storage, processing, and movement services into streamlined, scalable, and reliable data production pipelines.

Developers can build data-driven workflows that join, aggregate and transform semi-structured, unstructured and structured data sourced from their on-premises (via Data Management Gateway), cloud-based and internet services, and set up complex data processing through simple JSON scripting. The result data can be stored in Azure Storage or Azure Database for advanced analytics.

Specifically, developer can orchestrate regular copy activities between various sources and destinations listed below:

<table border="1">
<tr>
<th>Sink/Source</th>
<th>Azure Blob</th>
<th>Azure Table</th>
<th>Azure Database</th>
<th>SQL server (on premises)</th>
<th>SQL database (IaaS)</th>
</tr>

<tr>
<td><b>Azure Blob</b>
</td>
<td>x
</td>
<td>x
</td>
<td>x
</td>
<td>x
</td>
<td>x
</td>
</tr>

<tr>
<td><b>Azure Table</b>
</td>
<td>x
</td>
<td>x
</td>
<td>x
</td>
<td>
</td>
<td>
</td>
</tr>

<tr>
<td><b>Azure Database</b>
</td>
<td>x
</td>
<td>x
</td>
<td>x
</td>
<td>
</td>
<td>
</td>
</tr>

<tr>
<td><b>SQL Server on premises</b>
</td>
<td>x
</td>
<td>
</td>
<td>
</td>
<td>
</td>
<td>
</td>
</tr>

<tr>
<td><b>SQL Server on IaaS</b>
</td>
<td>x
</td>
<td>
</td>
<td>
</td>
<td>
</td>
<td>
</td>
</tr>

</table> 
<br>			

The service can handle failures with auto restart and allow format conversion when moving data from one format to the other. To define a copy activity, see [Get started with Data Factory][start]. Data store registration and gateway installation experiences are described in [Enable your pipelines to work with on-premises data][pipelines]. To see the full functionality of copy - including properties for different types of data stores, column mapping, serialization formats, and type handling - see [Copy data with Data Factory][copy].

Also see:

* [Introduction to Data Factory][intro]

## Azure Database Migration Tooling

There are many tools available to successfully migrate SQL Server on-premises and non-SQL Server databases and to Azure Database. The best tool for your scenario depends on the type, size, and complexity of the database being migrated:

* You can migrate both schema and data of an existing Azure SQL Database by exporting the database, storing the export file in an Azure Blob Storage Account, then importing as a new Azure SQL Database. The file that created when this export is referred to as a BACPAC file. For more information, see [Import and Export a Database (Azure SQL Database)][sql-import].
* Database Copy feature creates a new database in Azure that is a transactional consistent copy of an existing Azure SQL Database. For more information, see [Copying Databases in Azure SQL Database][sql-copy].
* SQL Server Integration Services (SSIS) can be used when complex transformations of data are needed. SSIS can be used to move data into and out of Azure SQL Database. For more information, see [How to: Use Integration Services to Migrate a Database to Azure SQL Database][integrate] and [SSIS for Azure and Hybrid Data Movement][SSIS].
* The SQL Server Import and Export Wizard is an easy way to create an SSIS package to migrate data. After configuring the source and destination, you can specify basic data transformations. These packages can be saved, modified, executed, and scheduled as a job. For more information, see [How to: Use the Import and Export Wizard to Migrate a Database to Azure SQL Database][wizard].
* The SQL Database Migration Wizard is a tool that helps migrate both schema and data between on-premises SQL Server and Azure SQL Database, as well as between Azure SQL Database servers. The tool also analyzes trace files and scripts for compatibility issues with Azure SQL Database. For more information, see [How to: Use the SQL Database Migration Wizard][use-wizard].
* The bcp utility can be used to import large numbers of new rows into SQL Server tables or to export data out of tables into data files. For more information, see [How to: Use bcp to migrate a Database to Azure SQL Database][bcp].

Also see:

* [Migrating Databases to Azure SQL Database][migrate]
 

## Azure Data Sync Service (preview)

Data Sync Service (preview) enables creating and scheduling regular synchronizations between Azure SQL Database and databases hosted in SQL Server or Azure SQL Database.

Data Sync Service is suitable for data developers to synchronize delta changes between on-premises and cloud Azure databases.

Also see:

* [SQL Data Sync][sync]

##	Azure Event Hubs

Microsoft Azure Event Hubs is an event ingestor service that provides event and telemetry ingress to the cloud at massive scale, with low latency and high reliability. This service, used with other downstream services, is particularly useful in application instrumentation, user experience or workflow processing, and Internet of Things scenarios.

Developers can write code to send data to event hub, process the data and store in Azure Blob or Azure Database for further process.

Alternatively, developers can leverage Azure Stream Analytics, a fully managed service providing scalable complex event processing over streaming data for output. Developer can pick a stream from Azure Event Hub, specify the format being used to serialize incoming event (e.g. JSON, CSV or Avro formats), and then add output location including Azure Blob or Azure Database.

Also see:

* [Event Hubs service information][event]
* [Event Hubs Overview][overview]
* [Introduction to Azure Stream Analytics][stream]

## Other options for data transfer

Hybrid Connections provides an easy and convenient way to connect Azure Websites and Azure Mobile Services to on-premises resources. Developers can build web site to move data from on-premises to Azure. See [Hybrid Connections Overview][hybrid] for details.

With [Virtual Network][vn], you can use data integration tools running in Azure virtual machine to securely connect to on-premises SQL Server databases in your on-site datacenter. Only virtual machines and services within the same virtual network can identify or connect to each other. If you prefer, you can even create an [ExpressRoute][express-route] direct connection to Azure through your network service provider or exchange provider and bypass the public internet altogether.

[Azure Marketplace][marketplace] offers partner solutions that enable data movement to Azure, e.g. Storm Managed File Transfer.

## Choose the right data transfer option

### Decision tree

![Help deciding which cloud data transfer option to choose.][decision]

Notes about the decision tree:
•	Data Sync Service is a preview Azure service, where sync is trigger by changed data indeed.
•	Azure Data Factory is a preview service which supports copy data between Azure Storage, Azure Database and on-premises SQL Server. New sources will be added over upcoming months.
•	In addition to Azure Data Factory, you can consider extending existing SSIS packages to move data to cloud in a scheduled manner.

### Move GBs of data

<table border="1">
<tr>
<th>Move data</th>
<th>One time</th>
<th>Scheduled</th>
<th>Considerations</th>
</tr>

<tr>
<td>File to Azure Storage
</td>
<td>AzCopy acp <br>
Azure PowerShell <br>
Azure Import/Export <br>
</td>
<td>N/A
</td>
<td>Use Azure Import/Export instead of AzCopy, acp and Azure PowerShell when data transfer via the network  is impractical. The service can take up to several days in addition to shipping the disk to data center.
</td>
</tr>

<tr>
<td>SQL Server to Azure Database<br>
Azure Database to SQL Server
</td>
<td>Azure Data Factory<br>
Azure Database Migration Tools
</td>
<td>Azure Data Factory
</td>
<td>Suggest to use Azure Data Factory (preview) instead of migration tools which offers format conversion and job auto recovery in exceptional cases. If SQL Server is on-premises, Data Management Gateway is needed to connect to SQL Server.
</td>
</tr>

<tr>
<td>Azure Storage to Azure Database<br>
Azure Database to Azure Storage
</td>
<td>Azure Data Factory
</td>
<td>Azure Data Factory
</td>
<td>Azure Data Factory (preview) offers format conversion and job auto recovery in exceptional cases. If SQL Server is on-premises, Data Management Gateway is needed to connect to SQL Server.
</td>
</tr>

<tr>
<td>SQL Server to Delta Data Sync<br>
Delta Data Sync to Azure Database
</td>
<td>N/A
</td>
<td>Data Sync Service
</td>
<td>Data Sync Service is still in preview. Table will be created for trigger the sync.
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
<td>File to Azure Storage
</td>
<td>Azure Import/Export
</td>
<td>N/A
</td>
<td>The service can take up to several days in addition the time it takes the disk to reach to data center.
</td>
</tr>

</table>
<br>


<!--Anchors-->
[Azure Import/Export service for Blob storage]: #blob
[AZCopy]: #azcopy
[Azure PowerShell]: #ps
[Azure Data Factory (preview)]: #data-factory
[Azure Database Migration Tooling]: #tooling
[Azure Data Sync Service (preview)]: #data-sync
[Azure Event Hubs]: #event-hubs
[Other options for data transfer]: #other
[Choose the right data transfer option]: #choose

<!--Image references-->
[decision]: ./media/data-management-options-for-transferring-data/data-transfer-decision-tree.png


<!--Link references-->
[import-export]: ../storage-import-export-service/
[azcopy]: ../storage-use-azcopy/
[upload]: ../hdinsight-upload-data/#powershell
[install]: ../install-configure-powershell/
[start]: ../data-factory-get-started/
[pipelines]: ../data-factory-use-onpremises-datasources/
[copy]: ../articles/data-factory-copy-activity/
[intro]: ../data-factory-introduction/
[sql-import]: http://msdn.microsoft.com/en-us/library/azure/hh335292.aspx
[sql-copy]: http://msdn.microsoft.com/en-us/library/azure/ff951624.aspx
[integrate]: http://msdn.microsoft.com/en-us/library/azure/jj156150.aspx
[SSIS]: http://msdn.microsoft.com/en-us/library/jj901708.aspx
[wizard]: http://msdn.microsoft.com/en-us/library/azure/jj156152.aspx
[use-wizard]: http://msdn.microsoft.com/en-us/library/azure/jj156144.aspx
[bcp]: http://msdn.microsoft.com/en-us/library/azure/jj156153.aspx
[migrate]: http://msdn.microsoft.com/en-us/library/azure/ee730904.aspx
[event]: ../services/event-hubs/
[overview]: http://msdn.microsoft.com/en-us/library/dn836025.aspx
[stream]: ../stream-analytics-introduction/
[sync]: http://msdn.microsoft.com/en-us/library/azure/hh456371.aspx
[hybrid]: ../integration-hybrid-connection-overview/
[vn]: ../services/virtual-network/
[express-route]: ../services/expressroute/
[marketplace]: ../marketplace/?source=datamarket