<properties 
	pageTitle="Release notes for Data Management Gateway | Azure Data Factory" 
	description="Data Management Gateway tory release notes" 
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
	ms.date="05/17/2016" 
	ms.author="spelluru"/>

# Release notes for Data Management Gateway

One of the challenges for modern data integration is to seamlessly move data to and from on-premises to cloud. Data factory makes this integration seamless with Data Management Gateway, which is an agent that you can install on-premises to enable hybrid data movement.

Please refer to [Move data between on-premises and cloud using Azure Data Factory](data-factory-move-data-between-onprem-and-cloud.md) and [Data Management Gateway](data-factory-data-management-gateway.md) articles for more information.

## CURRENT VERSION (2.1.6040.1)

- DB2 driver is included in the gateway installation package now. You do not need to install it separately. 
- DB2 driver now supports z/OS and DB2 for i (AS/400) along with the platforms already supported (Linux, Unix, and Windows). 
- Supports using DocumentDB as a source or destination for on-premises data stores
- Supports copying data from/to cold/hot blob storage along with the already supported general-purpose storage account. 
- Allows you to connect to on-premises SQL Server via gateway with remote login privileges.  

## Earlier versions

## 2.0.6013.1

- You can select the language/culture to be used by a gateway during manual installation.
- When gateway does not work as expected, you can choose to send gateway logs of last 7 days to Microsoft to facilitate troubleshooting of the issue. If gateway is not connected to the cloud service, you can choose to save and archive gateway logs.  
- User interface improvements for gateway configuration manager:
	- Make gateway status more visible on the Home tab.
	- Reorganized and simplified controls.
- You can copy data from a storage other than Azure Blob into Azure SQL Data Warehouse via Polybase & staging blob using the [code-free copy preview tool](data-factory-copy-data-wizard-tutorial.md). See [Staged Copy](data-factory-copy-activity-performance.md#staged-copy) for details about this feature in general. 
- You can leverage Data Management Gateway to ingress data directly from an on-premises SQL Server database into Azure Machine Learning.
- Performance improvements
	- Improve performance on viewing Schema/Preview against SQL Server in code-free copy preview tool.



## 1.12.5953.1
- Bug fixes

## 1.11.5918.1

- Maximum size of the gateway event log has been increased from 1 MB to 40 MB.
- A warning dialog is displayed in case a restart is needed during gateway auto-update. You can choose to restart right then or later. 
- In case auto-update fails, gateway installer will retry auto-updating 3 times at maximum.
- Performance improvements
	- Improve performance for loading large tables from on-premises server in code-free copy scenario.
- Bug fixes

## 1.10.5892.1

- Performance improvements
- Bug fixes

## 1.9.5865.2

- Zero touch auto update capability
- New tray icon with gateway status indicators
- Ability to “Update now” from the client
- Ability to set update schedule time
- PowerShell script for toggling auto-update on/off
- Support for JSON format  
- Performance improvements
- Bug fixes

## 1.8.5822.1

- Improve troubleshooting experience
- Performance improvements
- Bug fixes

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

### 1.2.5303.1

- 	Fix timeout issue to support more time-consuming data source connections. 
 	
### 1.1.5526.8

- Requires .NET Framework 4.5.1 as a prerequisite during setup.

### 1.0.5144.2

- No changes that affect Azure Data Factory scenarios. 

## Questions/answers

### Why is the Data Source Manager trying to connect to a gateway?
This is a security design where you can only configure on-premises data sources for cloud access within your corporate network, and your credentials will not flow outside of your corporate firewall. Ensure your computer can reach the machine where the gateway is installed.
