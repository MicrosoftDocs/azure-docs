---
title: Azure Cosmos DB Emulator download and release notes
description: Get the Azure Cosmos DB Emulator release notes for different versions and download information. 
ms.service: cosmos-db
ms.topic: conceptual
author: milismsft
ms.author: adrianmi
ms.date: 09/21/2020
---

# Azure Cosmos DB Emulator - Release notes and download information
[!INCLUDE[appliesto-all-apis](includes/appliesto-all-apis.md)]

This article shows the Azure Cosmos DB Emulator release notes with a list of feature updates that were made in each release. It also lists the latest version of the emulator to download and use.

## Download

| | Link |
|---------|---------|
|**MSI download**|[Microsoft Download Center](https://aka.ms/cosmosdb-emulator)|
|**Get started**|[Develop locally with Azure Cosmos DB Emulator](local-emulator.md)|

## Release notes

### 2.11.13 (21 April 2021)

 - This release updates the local Data Explorer content to latest Azure Portal version and adds a new MongoDB endpoint configuration, "4.0".

### 2.11.11 (22 February 2021)

 - This release updates the local Data Explorer content to latest Azure portal version.


### 2.11.10 (5 January 2021)

 - This release updates the local Data Explorer content to latest Azure portal version and adds a new public option, "/ExportPemCert", which allows the emulator user to directly export the public emulator's certificate as a .PEM file.

### 2.11.9 (3 December 2020)

 - This release addresses couple issues with the Azure Cosmos DB Emulator functionality in addition to the general content update reflecting the latest features and improvements in Azure Cosmos DB:
 * Fix for an issue where large document payload requests fail when using Direct mode and Java client applications.
 * Fix for a connectivity issue with MongoDB endpoint version 3.6 when targeted by .NET based applications.

### 2.11.8 (6 November 2020)

 - This release includes an update for the Cosmos emulator Data Explorer and fixes an issue where TLS 1.3 clients try to open the Data Explorer.

### 2.11.6 (6 October 2020)

 - This release addresses a concurrency related issue when multiple containers might be created at the same time. In such cases emulator's data is left in a corrupted state and following API requests to the emulator's endpoint could fail with "service unavailable" errors, requiring a restart and a reset of the emulator's local data.

### 2.11.5 (23 August 2020)

This release adds two new Cosmos emulator startup options: 

* "/EnablePreview" - it enables preview features for the emulator. The preview features that are still under development and they can be accessed via CI and sample writing.
* "/EnableAadAuthentication" - it enables the emulator to accept custom Azure Active Directory tokens as an alternative to the Azure Cosmos primary keys. This feature is still under development; specific role assignments and other permission-related settings aren't currently supported.

### 2.11.2 (07 July 2020)

- This release changes how ETL traces required when troubleshooting the Cosmos emulator are collected. WPR (Windows Performance Runtime tools) is now the default tools for capturing ETL-based traces while old LOGMAN based capturing has been deprecated. This change is required in part because latest Windows security updates had an unexpected impact on how LOGMAN works when executed through the Cosmos emulator.

### 2.11.1 (10 June 2020)

- This release fixes couple bugs related to emulator Data Explorer. In certain cases when using the emulator Data Explorer through a web browser, it fails to connect to the Cosmos emulator endpoint and all the related actions such as creating a database or a container will result in error. The second issue fixed is related to creating an item from a JSON file using Data Explorer upload action.

### 2.11.0

- This release introduces support for autoscale provisioned throughput. These new features include the ability to set a custom maximum provisioned throughput level in request units (RU/s), enable autoscale on existing databases and containers, and programmatic support through Azure Cosmos DB SDKs.
- Fix an issue while querying through large number of documents (over 1 GB) were the emulator will fail with internal error status code 500.

### 2.9.2

- This release fixes a bug while enabling support for MongoDb endpoint version 3.2. It also adds support for generating ETL traces for troubleshooting purposes using WPR instead of LOGMAN.

### 2.9.1

- This release fixes couple issues in the query API support and restores compatibility with older OSs such as Windows Server 2012.

### 2.9.0

- This release adds the option to set the consistency to consistent prefix and increase the maximum limits for users and permissions.

### 2.7.2

- This release adds MongoDB version 3.6 server support to the Cosmos Emulator. To start a MongoDB endpoint that target version 3.6 of the service, start the emulator from an Administrator command line with "/EnableMongoDBEndpoint=3.6" option.

### 2.7.0

- This release fixes a regression, which prevented users from executing queries against the SQL API account from the emulator when using .NET core or x86 .NET based clients.

### 2.4.6

- This release provides parity with the features in the Azure Cosmos service as of July 2019, with the exceptions noted in [Develop locally with Azure Cosmos DB Emulator](local-emulator.md). It also fixes several bugs related to emulator shut down when invoked via command line and internal IP address overrides for SDK clients using direct mode connectivity.

### 2.4.3

- Disabled starting the MongoDB service by default. Only the SQL endpoint is enabled as default. The user must start the endpoint manually using the emulator's "/EnableMongoDbEndpoint" command-line option. Now, it's like all the other service endpoints, such as Gremlin, Cassandra, and Table.
- Fixed a bug in the emulator when starting with “/AllowNetworkAccess” where the Gremlin, Cassandra, and Table endpoints weren't properly handling requests from external clients.
- Add direct connection ports to the Firewall Rules settings.

### 2.4.0

- Fixed an issue with emulator failing to start when network monitoring apps, such as Pulse Client, are present on the host computer.
