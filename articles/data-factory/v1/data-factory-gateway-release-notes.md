---
title: Release notes for Data Management Gateway 
description: Data Management Gateway tory release notes
author: nabhishek
ms.service: data-factory
ms.subservice: v1
ms.topic: conceptual
ms.date: 04/12/2023
ms.author: abnarain
robots: noindex
---
# Release notes for Data Management Gateway
> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [self-hosted integration runtime in V2](../create-self-hosted-integration-runtime.md).

One of the challenges for modern data integration is to move data to and from on-premises to cloud. Data Factory makes this integration with Data Management Gateway, which is an agent that you can install on-premises to enable hybrid data movement.

See the following articles for detailed information about Data Management Gateway and how to use it:

*  [Data Management Gateway](data-factory-data-management-gateway.md)
*  [Move data between on-premises and cloud using Azure Data Factory](data-factory-move-data-between-onprem-and-cloud.md)


## CURRENT VERSION 
We no more maintain the Release notes here. Get latest release notes [here](https://go.microsoft.com/fwlink/?linkid=853077)




## Earlier versions
## 2.10.6347.7
### Enhancements-
- You can add DNS entries to allow service bus rather than allowing all Azure IP addresses from your firewall (if needed). You can find respective DNS entry on Azure portal (Data Factory -> 'Author and Deploy' -> 'Gateways' -> "serviceUrls" (in JSON)
- HDFS connector now supports self-signed public certificate by letting you skip TLS validation.
- Fixed: Issue with gateway offline during update (due to clock skew)


## 2.9.6313.2
### Enhancements-
-    You can add DNS entries to allow Service Bus rather than allowing all Azure IP addresses from your firewall (if needed). More details here.
-    You can now copy data to/from a single block blob up to 4.75 TB, which is the max supported size of block blob. (earlier limit was 195 GB).
-    Fixed: Out of memory issue while unzipping several small files during copy activity.
-    Fixed: Index out of range issue while copying from Document DB to SQL Server with idempotency feature.
-    Fixed: SQL cleanup script doesn't work with SQL Server from Copy Wizard.
-    Fixed: Column name with space at the end does not work in copy activity.

## 2.8.66283.3
### Enhancements-
- Fixed: Issue with missing credentials on gateway machine reboot.
- Fixed: Issue with registration during gateway restore using a backup file.


## 2.7.6240.1
### Enhancements-
- Fixed: Incorrect read of Decimal null value from Oracle as source.

## 2.6.6192.2
### What's new
- Customers can provide feedback on gateway registering experience.
- Support a new compression format: ZIP (Deflate)

### Enhancements-
- Performance improvement for Oracle Sink, HDFS source.
- Bug fix for gateway auto update, gateway parallel processing capacity.


## 2.5.6164.1
### Enhancements
- Improved and more robust Gateway registration experience- Now you can track progress status during the Gateway registration process, which makes the registration experience more responsive.
- Improvement in Gateway Restore Process- You can still recover gateway even if you do not have the gateway backup file with this update. This would require you to reset Linked Service credentials in Portal.
- Bug fix.

## 2.4.6151.1

### What's new

- You can now store data source credentials locally. The credentials are encrypted. The data source credentials can be recovered and restored using the backup file that can be exported from the existing Gateway, all on-premises.

### Enhancements-

- Improved and more robust Gateway registration experience.
- Support auto detection of QuoteChar configuration for Text format in copy wizard, and improve the overall format detection accuracy.

## 2.3.6100.2

- Support firstRowAsHeader and SkipLineCount auto detection in copy wizard for text files in on-premises File system and HDFS.
- Enhance the stability of network connection between gateway and Service Bus
- A few bug fixes


## 2.2.6072.1

*  Supports setting HTTP proxy for the gateway using the Gateway Configuration Manager. If configured, Azure Blob, Azure Table, Azure Data Lake, and Document DB are accessed through HTTP proxy.
*  Supports header handling for TextFormat when copying data from/to Azure Blob, Azure Data Lake Store, on-premises File System, and on-premises HDFS.
*  Supports copying data from Append Blob and Page Blob along with the already supported Block Blob.
*  Introduces a new gateway status **Online (Limited)**, which indicates that the main functionality of the gateway works except the interactive operation support for Copy Wizard.
*  Enhances the robustness of gateway registration using registration key.

## 2.1.6040.

*  DB2 driver is included in the gateway installation package now. You do not need to install it separately.
*  DB2 driver now supports z/OS and DB2 for i (AS/400) along with the platforms already supported (Linux, Unix, and Windows).
*  Supports using Azure Cosmos DB as a source or destination for on-premises data stores
*  Supports copying data from/to cold/hot blob storage along with the already supported general-purpose storage account.
*  Allows you to connect to SQL Server via gateway with remote login privileges.  

## 2.0.6013.1

*  You can select the language/culture to be used by a gateway during manual installation.

*  When gateway does not work as expected, you can choose to send gateway logs of last seven days to Microsoft to facilitate troubleshooting of the issue. If gateway is not connected to the cloud service, you can choose to save and archive gateway logs.  

*  User interface improvements for gateway configuration manager:

    *  Make gateway status more visible on the Home tab.

    *  Reorganized and simplified controls.

    *  You can copy data from a storage using the [code-free copy tool](data-factory-copy-data-wizard-tutorial.md). See [Staged Copy](data-factory-copy-activity-performance.md#staged-copy) for details about this feature in general.
*  You can use Data Management Gateway to ingress data directly from a SQL Server database into Azure Machine Learning.

*  Performance improvements

    * Improve performance on viewing Schema/Preview against SQL Server in code-free copy tool.

## 1.12.5953.1

*  Bug fixes

## 1.11.5918.1

*  Maximum size of the gateway event log has been increased from 1 MB to 40 MB.

*  A warning dialog is displayed in case a restart is needed during gateway auto-update. You can choose to restart right then or later.

*  In case auto-update fails, gateway installer retries auto-updating three times at maximum.

*  Performance improvements

    * Improve performance for loading large tables from on-premises server in code-free copy scenario.

*  Bug fixes

## 1.10.5892.1

*  Performance improvements

*  Bug fixes

## 1.9.5865.2

*  Zero touch auto update capability
*  New tray icon with gateway status indicators
*  Ability to "Update now" from the client
*  Ability to set update schedule time
*  PowerShell script for toggling auto-update on/off
*  Support for JSON format  
*  Performance improvements
*  Bug fixes

## 1.8.5822.1

*  Improve troubleshooting experience
*  Performance improvements
*  Bug fixes

### 1.7.5795.1

*  Performance improvements
*  Bug fixes

### 1.7.5764.1

*  Performance improvements
*  Bug fixes

### 1.6.5735.1

*  Support on-premises HDFS Source/Sink
*  Performance improvements
*  Bug fixes

### 1.6.5696.1

*  Performance improvements
*  Bug fixes

### 1.6.5676.1

*  Support diagnostic tools on Configuration Manager
*  Support table columns for tabular data sources for Azure Data Factory
*  Support Azure Synapse Analytics for Azure Data Factory
*  Support Reclusive in BlobSource and FileSource for Azure Data Factory
*  Support CopyBehavior - MergeFiles, PreserveHierarchy, and FlattenHierarchy in BlobSink and FileSink with Binary Copy for Azure Data Factory
*  Support Copy Activity reporting progress for Azure Data Factory
*  Support Data Source Connectivity Validation for Azure Data Factory
*  Bug fixes

### 1.6.5672.1

*  Support table name for ODBC data source for Azure Data Factory
*  Performance improvements
*  Bug fixes

### 1.6.5658.1

*  Support File Sink for Azure Data Factory
*  Support preserving hierarchy in binary copy for Azure Data Factory
*  Support Copy Activity Idempotency for Azure Data Factory
*  Bug fixes

### 1.6.5640.1

*  Support 3 more data sources for Azure Data Factory (ODBC, OData, HDFS)
*  Support quote character in csv parser for Azure Data Factory
*  Compression support (BZip2)
*  Bug fixes

### 1.5.5612.1

*  Support five relational databases for Azure Data Factory (MySQL, PostgreSQL, DB2, Teradata, and Sybase)
*  Compression support (Gzip and Deflate)
*  Performance improvements
*  Bug fixes

### 1.4.5549.1

*  Add Oracle data source support for Azure Data Factory
*  Performance improvements
*  Bug fixes

### 1.4.5492.1

*  Unified binary that supports both Microsoft Azure Data Factory and Office 365 Power BI services
*  Refine the Configuration UI and registration process
*  Azure Data Factory - Azure Ingress and Egress support for SQL Server data source

### 1.2.5303.1

*  Fix timeout issue to support more time-consuming data source connections.

### 1.1.5526.8

*  Requires .NET Framework 4.5.1 as a prerequisite during setup.

### 1.0.5144.2

*  No changes that affect Azure Data Factory scenarios.
