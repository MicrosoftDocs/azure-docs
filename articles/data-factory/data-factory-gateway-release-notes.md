<properties 
	pageTitle="Data Management Gateway – Release Notes | Azure Data Factory" 
	description="Data Factory release notes" 
	services="data-factory" 
	documentationCenter="" 
	authors="spelluru" 
	manager="jhubbard" 
	editor="monicar"/>

<tags 
	ms.service="data-factory" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="01/26/2016" 
	ms.author="spelluru"/>

# Data Management Gateway – Release Notes

Microsoft Data Management Gateway is a client agent that enables cloud access for on-premises data sources within your organization.
To register on-premises data sources with the service portal, you first need to download, install, and configure a Data Management Gateway on an on-premises computer and then register the gateway with the cloud service. 
With the Data Management Gateway, you can:

- Refresh Excel workbooks with embedded PowerPivot models from SharePoint Online with on-premises data sources.
- Publish and index on-premises data sources as OData feeds.
- Copy data from on-premises data sources to cloud and vice versa.

Please refer to [Move data between on-premises and cloud using Azure Data Factory](data-factory-move-data-between-onprem-and-cloud.md) and [Power BI for Office 365 Admin Center Help](https://support.office.com/article/Power-BI-for-Office-365-Admin-Center-Help-5e391ecb-500c-47a3-bd0f-a6173b541044?ui=en-US&rs=en-001&ad=US) for more information.


## CURRENT VERSION (1.8.5822.1)

- Improve troubleshooting experience
- Performance improvements
- Bug fixes


## EARLIER VERSIONS

### 1.7.5795.1

- Performance improvements
- Bug fixes

### 1.7.5764.1

- Performance improvements
- Bug fixes

### 1.6.5735.1

- Support On-Prem HDFS Source/Sink
- Performance improvements
- Bug fixes

### 1.6.5696.1

- Performance improvements
- Bug fixes

### 1.6.5676.1

- Support diagnostic tools on Configuration Manager
- Support table columns for tabular data sources for Azure Data Factory
- Support SQL DW for Azure Data Factory
- Support Reclusive in BlobSource and FileSource for Azure Data Factory
- Support CopyBehavior – MergeFiles, PreserveHierarchy and FlattenHierarchy in BlobSink and FileSink with Binary Copy for Azure Data Factory
- Support Copy Activity reporting progress for Azure Data Factory
- Support Data Source Connectivity Validation for Azure Data Factory
- Bug fixes


### 1.6.5672.1

- Support table name for ODBC data source for Azure Data Factory
- Performance improvements
- Bug fixes

### 1.6.5658.1

- Support File Sink for Azure Data Factory
- Support preserving hierarchy in binary copy for Azure Data Factory
- Support Copy Activity Idempotency for Azure Data Factory
- Bug fixes

### 1.6.5640.1

- Support 3 more data sources for Azure Data Factory (ODBC, OData, HDFS)
- Support quote character in csv parser for Azure Data Factory
- Compression support (BZip2)
- Bug fixes

### 1.5.5612.1

- Support 5 relational databases for Azure Data Factory (MySQL, PostgreSQL, DB2, Teradata, and Sybase)
- Compression support (Gzip and Deflate)
- Performance improvements
- Bug fixes


### 1.4.5549.1

- Add Oracle data source support for Azure Data Factory
- Performance improvements
- Bug fixes

### 1.4.5492.1

- Unified binary that supports both Microsoft Azure Data Factory and Office 365 Power BI services
- Refine the Configuration UI and registration process
- Azure Data Factory – Azure Ingress and Egress support for SQL Server data source
- Office 365 Power BI Bug fixes

### 1.2.5303.1

- Support scheduled data refresh for Power Query data connection with additional data sources:
	- File (Excel, CSV, XML, Text and Access)
	- Folder
	- IBM DB2, MySQL, Sybase, SQL Azure, PostgreSQL and Teradata
	- SharePoint List
	- OData Feed
	- Azure Marketplace, Azure HDInsight, Azure Blob Storage and Azure Table Storage
- Prerequisites
	- [data source prerequisites](http://office.microsoft.com/excel-help/data-source-prerequisites-HA104050014.aspx?CTT=5&origin=HA104003813)
- Notes
	- Only Power Query connection string from Excel DATA tab can be recognized in Admin Center. Direct copying Power Query connection string from Power Pivot is not supported. A valid Power Query connection string should contain:
		- Provider=Microsoft.Mashup.OleDb.1;
		- Data Source=$EmbeddedMashup(SomeGUID)$;
		- Location=SomePowerQueryName;
	- Data sources other than SQL Server and Oracle can only be used for scheduled data refresh for Power Query connections.
	- File and folder data sources should be on shared folders.
	- Native queries (custom SQL statements), Web, SAP BusinessObjects, Active Directory, HDFS, Facebook, Exchange and Current Excel workbook are not supported.
	- Web API key and OAuth 2 are not supported.
	- All data sources in the Power Query connection must be hosted on the same gateway.
- 	Enhance the scalability for Data Management Gateway.  Power BI provides a way for customer to easily scale-out the service to multiple machines/gateway instances (up to 10 instances), in order to meet the growing demands.
- 	Fix timeout issue to support more time-consuming data source connections. Now gateway supports data refresh requests lasting up to 30 minutes.
- 	
### 1.1.5526.8

- Support scheduled data refresh for Power Query data connection with SQL Server and Oracle data source only.
	- Prerequisites
		- .NET Framework 3.5 or above
		- .NET Framework Data Provider for SQL Server
		- Oracle Data Provider for .NET (Oracle 9i or above)
	- Notes
		- Only Power Query connection string from Excel DATA tab can be recognized in Admin Center. Direct copying Power Query connection string from Power Pivot is not supported.
		- Native queries (custom SQL statements) are not supported.
		- All data sources in the Power Query connection must be hosted on the same gateway.
- Requires .NET Framework 4.5.1 as a prerequisite during setup.

### 1.0.5144.2

- Support scheduled data refresh for SQL Server and Oracle data sources.
	- Notes
		- The timeout value is fixed to 50 seconds.
	- Publish and index SQL Server and Oracle data sources as corporate OData feeds.
		- Notes
			- OData feeds can only be accessed from the corpnet.
			- 	Navigation properties between the tables are not provided.
			- 	Certain data types are not supported. Please refer to Supported Data Sources and Data Types for more information.

## Questions/Answers

### Why is the Data Source Manager trying to connect to a gateway?
This is a security design where you can only configure on-premises data sources for cloud access within your corporate network, and your credentials will not flow outside of your corporate firewall. Ensure your computer can reach the machine where the gateway is installed.

### Why is my Scheduled Data Refresh timed out?

- The gateway is too busy so that you want to migrate heavy data sources to other gateways, or
- The database is overloaded so that you need to scale the server, or
- The query takes too long (>50 seconds) so that you may want to optimize the query or cache the result in data mart instead.

### Why is the connection string invalid?
Currently it is not supported to get Power Query connection string from Power Pivot. Please copy Power Query connection string from the data table instead. Please refer to [Get a connection string from a data table](http://office.microsoft.com/office365-sharepoint-online-enterprise-help/create-a-data-source-and-enable-cloud-access-HA104078557.aspx?CTT=1#_Get_a_connection_1) for more information.
