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
	ms.date="01/26/2016" 
	ms.author="spelluru"/>

# Release notes for Data Management Gateway

One of the challenges for modern data integration is to seamlessly move data to and from on-premises to cloud. Data factory makes this integration seamless with Data Management Gateway, which is an agent that you can install on-premises to enable hybrid data movement.

Please refer to [Move data between on-premises and cloud using Azure Data Factory](data-factory-move-data-between-onprem-and-cloud.md) for more information.

## Current version (1.10.5892.1)

•	Performance improvements
•	Bug fixes

## Earlier versions

## 1.9.5865.2

- Zero touch auto update capability
- New tray icon with gateway status indicators
- Ability to “Update now” from the client
- Ability to set update schedule time
- PowerShell script for toggling auto-update on/off 
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
