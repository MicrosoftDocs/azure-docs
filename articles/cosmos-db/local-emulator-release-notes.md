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

This article shows the Azure Cosmos DB Emulator released versions and it details the updates that were made. Only the latest version is made available to download and use and previous versions aren't actively supported by the Azure Cosmos DB Emulator developers.

## Download

| | Link |
|---------|---------|
|**MSI download**|[Microsoft Download Center](https://aka.ms/cosmosdb-emulator)|
|**Get started**|[Develop locally with Azure Cosmos DB Emulator](local-emulator.md)|

## Release notes

### 2.14.6 (March 7, 2022)

 - This release updates the Azure Cosmos DB Emulator background services to match the latest online functionality of the Azure Cosmos DB. In addition to this update there are couple issues that were addressed in this release:
 * Fix for an issue related to high CPU usage when the emulator is running.
 * Add PowerShell option to set the Mongo API version: "-MongoApiVersion". Valid setting are: "3.2", "3.6" and "4.0"

### 2.14.5 (January 18, 2022)

 - This release updates the Azure Cosmos DB Emulator background services to match the latest online functionality of the Azure Cosmos DB. One other important update with this release is to reduce the number of services executed in the background and start them as needed.

### 2.14.4 (October 25, 2021)

 - This release updates the Azure Cosmos DB Emulator background services to match the latest online functionality of the Azure Cosmos DB.

### 2.14.3 (September 8, 2021)

 - This release updates the Azure Cosmos DB Emulator background services to match the latest online functionality of the Azure Cosmos DB. It also addresses couple issues with telemetry data that is collected and resets the base image for the Linux Cosmos emulator Docker image.

### 2.14.2 (August 12, 2021)

 - This release updates the local Data Explorer content to latest Microsoft Azure version and resets the base for the Linux Cosmos emulator Docker image.

### 2.14.1 (June 18, 2021)

 - This release improves the start-up time for the emulator while reducing the footprint of its data on the disk. This new optimization is activated by "/EnablePreview" argument.

### 2.14.0 (June 15, 2021)

 - This release updates the local Data Explorer content to latest Microsoft Azure version. It also fixes an issue when importing multiple document items by using the JSON file upload feature.

### 2.11.13 (April 21, 2021)

 - This release updates the local Data Explorer content to latest Microsoft Azure version and adds a new MongoDB endpoint configuration, "4.0".

### 2.11.11 (February 22, 2021)

 - This release updates the local Data Explorer content to latest Microsoft Azure version.


### 2.11.10 (January 5, 2021)

 - This release updates the local Data Explorer content to latest Microsoft Azure version. It also adds a new public option, "/ExportPemCert", which allows the emulator user to directly export the public emulator's certificate as a .PEM file.

### 2.11.9 (December 3, 2020)

 - This release updates the Azure Cosmos DB Emulator background services to match the latest online functionality of the Azure Cosmos DB. It also addresses couple issues with the Azure Cosmos DB Emulator functionality:
 * Fix for an issue where large document payload requests fail when using Direct mode and Java client applications.
 * Fix for a connectivity issue with MongoDB endpoint version 3.6 when targeted by .NET based applications.

### 2.11.8 (November 6, 2020)

 - This release includes an update for the Azure Cosmos DB Emulator Data Explorer and fixes an issue where "TLS 1.3" clients try to open the Data Explorer.

### 2.11.6 (October 6, 2020)

 - This release addresses a concurrency-related issue when multiple containers might be created at the same time. This can leave the emulator in a corrupted state and future API requests to the emulator's endpoint will fail with "service unavailable" errors. The work-around is to stop the emulator, reset of the emulator's local data and restart.

### 2.11.5 (August 23, 2020)

This release adds two new Azure Cosmos DB Emulator startup options: 

* "/EnablePreview" - it enables preview features for the Azure Cosmos DB Emulator. The preview features that are still under development and they can be accessed via CI and sample writing.
* "/EnableAadAuthentication" - it enables the emulator to accept custom Azure Active Directory tokens as an alternative to the Azure Cosmos primary keys. This feature is still under development; specific role assignments and other permission-related settings aren't currently supported.

### 2.11.2 (July 7, 2020)

- This release changes how ETL traces required when troubleshooting the Azure Cosmos DB Emulator are collected. WPR (Windows Performance Runtime tools) is now the default tools for capturing ETL-based traces while old LOGMAN based capturing has been deprecated. With the latest Windows security update, LOGMAN stopped working as expected when executed through the Azure Cosmos DB Emulator.

### 2.11.1 (June 10, 2020)

This release fixes couple bugs related to Azure Cosmos DB Emulator Data Explorer: 

* Data Explorer fails to connect to the Azure Cosmos DB Emulator endpoint when hosted in some Web browser versions. Emulator users might not be able to create a database or a container through the Web page.
* Address an issue that prevented emulator users from creating an item from a JSON file using Data Explorer upload action.

### 2.11.0

- This release introduces support for autoscale provisioned throughput. The added features include the option to set a custom maximum provisioned throughput level in request units (RU/s), enable autoscale on existing databases and containers, and API support through Azure Cosmos DB SDK.
- Fix an issue while querying through large number of documents (over 1 GB) were the emulator will fail with internal error status code 500.

### 2.9.2

- This release fixes a bug while enabling support for MongoDb endpoint version 3.2. It also adds support for generating ETL traces for troubleshooting purposes using WPR instead of LOGMAN.

### 2.9.1

- This release fixes couple issues in the query API support and restores compatibility with older OSs such as Windows Server 2012.

### 2.9.0

- This release adds the option to set the consistency to consistent prefix and increase the maximum limits for users and permissions.

### 2.7.2

- This release adds MongoDB version 3.6 server support to the Azure Cosmos DB Emulator. To start a MongoDB endpoint that target version 3.6 of the service, start the emulator from an Administrator command line with "/EnableMongoDBEndpoint=3.6" option.

### 2.7.0

- This release fixes a regression in the Azure Cosmos DB Emulator that prevented users from executing SQL related queries. This issue impacts emulator users that configured SQL API endpoint and they're using .NET core or x86 .NET based client applications.

### 2.4.6

- This release provides parity with the features in the Azure Cosmos service as of July 2019, with the exceptions noted in [Develop locally with Azure Cosmos DB Emulator](local-emulator.md). It also fixes several bugs related to emulator shut down when invoked via command line and internal IP address overrides for SDK clients using direct mode connectivity.

### 2.4.3

- Disabled starting the MongoDB service by default. Only the SQL endpoint is enabled as default. The user must start the endpoint manually using the emulator's "/EnableMongoDbEndpoint" command-line option. Now, it's like all the other service endpoints, such as Gremlin, Cassandra, and Table.
- Fixed a bug in the emulator when starting with “/AllowNetworkAccess” where the Gremlin, Cassandra, and Table endpoints weren't properly handling requests from external clients.
- Add direct connection ports to the Firewall Rules settings.

### 2.4.0

- Fixed an issue with emulator failing to start when network monitoring apps, such as Pulse Client, are present on the host computer.
