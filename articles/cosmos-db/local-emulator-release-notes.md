---
title: Azure Cosmos Emulator download and release notes
description: Get the Azure Cosmos emulator release notes for different versions and download information. 
ms.service: cosmos-db
ms.topic: tutorial
author: milismsft
ms.author: adrianmi
ms.date: 06/20/2019
---

# Azure Cosmos Emulator - Release notes and download information

This article shows the Azure Cosmos emulator release notes with a list of feature updates that were made in each release. It also lists the latest version of emulator to download and use.

## Download

| | |
|---------|---------|
|**MSI download**|[Microsoft Download Center](https://aka.ms/cosmosdb-emulator)|
|**Get started**|[Develop locally with Azure Cosmos emulator](local-emulator.md)|

## Release notes

### 2.11.1

- This release fixes couple bugs related to emulator Data Explorer. In certain cases when using the emulator Data Explorer through a web browser, it fails to connect to the Cosmos emulator endpoint and all the related actions such as creating a database or a container will error. The second issue fixed is related to creating an item from a JSON file using Data Explorer upload action.

### 2.11.0

- This release introduces support for autoscale provisioned throughput. These new features include the ability to set a custom maximum provisioned throughput level in request units (RU/s), enable autoscale on existing databases and containers, and programmatic support through Azure Cosmos DB SDKs.
- Fix an issue while querying through large amount of documents (over 1GB) were the emulator will fail with internal error status code 500.

### 2.9.2

- This release fixes a bug while enabling support for MongoDb endpoint version 3.2. It also adds support for generating ETL traces for troubleshooting purposes using WPR instead of LOGMAN.

### 2.9.1

- This release fixes couple issues in the query API support and restores compatibility with older OSs such as Windows Server 2012.

### 2.9.0

- This release adds the option to set the consistency to consistent prefix and increase the maximum limits for users and permissions.

### 2.7.2

- This release adds MongoDB version 3.6 server support to the Cosmos Emulator. To start a MongoDB endpoint that target version 3.6 of the service, start the emulator from an Administrator command line with "/EnableMongoDBEndpoint=3.6" option.

### 2.7.0

- This release fixes a regression which prevented users from executing queries against the SQL API account from the emulator when using .NET core or x86 .NET based clients.

### 2.4.6

- This release provides parity with the features in the Azure Cosmos service as of July 2019, with the exceptions noted in [Develop locally with Azure Cosmos emulator](local-emulator.md). It also fixes several bugs related to emulator shutdown when invoked via command line and internal IP address overrides for SDK clients using direct mode connectivity.

### 2.4.3

- Disabled starting the MongoDB service by default. Only the SQL endpoint is enabled as default. The user must start the endpoint manually using the emulator's "/EnableMongoDbEndpoint" command-line option. Now, it's like all the other service endpoints, such as Gremlin, Cassandra, and Table.
- Fixed a bug in the emulator when starting with “/AllowNetworkAccess” where the Gremlin, Cassandra, and Table endpoints weren't properly handling requests from external clients.
- Add direct connection ports to the Firewall Rules settings.

### 2.4.0

- Fixed an issue with emulator failing to start when network monitoring apps, such as Pulse Client, are present on the host computer.
