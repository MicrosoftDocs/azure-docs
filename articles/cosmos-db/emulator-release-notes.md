---
title: Release notes for the Windows (local) emulator
titleSuffix: Azure Cosmos DB
description: View the release notes for the latest version and previous versions of the Azure Cosmos DB Windows (local) emulator.
author: sajeetharan
ms.author: sasinnat
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.topic: release-notes
ms.date: 09/11/2023
---

# Release notes for the Azure Cosmos DB Windows (local) emulator

The Azure Cosmos DB emulator is updated at a regular cadence with release notes provided in this article.

> [!div class="nextstepaction"]
> [Download latest version (``2.14.12``)](https://aka.ms/cosmosdb-emulator)

## Supported versions

Only the most recent version of the Azure Cosmos DB emulator is actively supported.

## Latest version ``2.14.12``

> *Released March 20, 2023*

- This release fixes an issue impacting Gremlin and Table endpoint API types. Prior to this fix a client application fails with a 500 status code when trying to connect to the public emulator's endpoint.

## Previous releases

> [!WARNING]
> Previous versions of the emulator are not supported by the product group.

### ``2.14.11`` (January 27, 2023)

- This release updates the Azure Cosmos DB Emulator background services to match the latest online functionality of the Azure Cosmos DB.

### ``2.14.9`` (July 7, 2022)

- This release updates the Azure Cosmos DB Emulator background services to match the latest online functionality of the Azure Cosmos DB.

### ``2.14.8``

- This release updates the Azure Cosmos DB Emulator background services to match the latest online functionality of the Azure Cosmos DB.

### ``2.14.7`` (May 9, 2022)

- This release updates the Azure Cosmos DB Emulator background services to match the latest online functionality of the Azure Cosmos DB. In addition to this update, there are a couple of issues addressed in this release:
  - Update Data Explorer to the latest content and fix a broken link for the quick start sample documentation.
  - Add option to enable the API for MongoDB and configure version for the Linux Azure Cosmos DB emulator by setting the environment variable: `AZURE_COSMOS_EMULATOR_ENABLE_MONGODB_ENDPOINT` in the Docker container. Valid settings are: ``3.2``, ``3.6``, ``4.0`` and ``4.2``

### ``2.14.6`` (March 7, 2022)

- This release updates the Azure Cosmos DB Emulator background services to match the latest online functionality of the Azure Cosmos DB. In addition to this update, there are a couple of issues addressed in this release:
  - Fix for an issue related to high CPU usage when the emulator is running.
  - Add PowerShell option to set the API for MongoDB and version: `-MongoApiVersion`. Valid settings are: ``3.2``, ``3.6`` and ``4.0``

### ``2.14.5`` (January 18, 2022)

- This release updates the Azure Cosmos DB Emulator background services to match the latest online functionality of the Azure Cosmos DB. One other important update with this release is to reduce the number of services executed in the background and start them as needed.

### ``2.14.4`` (October 25, 2021)

- This release updates the Azure Cosmos DB Emulator background services to match the latest online functionality of the Azure Cosmos DB.

### ``2.14.3`` (September 8, 2021)

- This release updates the Azure Cosmos DB Emulator background services to match the latest online functionality of the Azure Cosmos DB. It also addresses issues with performance data that's collected and resets the base image for the Linux Azure Cosmos DB emulator Docker image.

### ``2.14.2`` (August 12, 2021)

- This release updates the local Data Explorer content to latest Microsoft Azure version and resets the base for the Linux Azure Cosmos DB emulator Docker image.

### ``2.14.1`` (June 18, 2021)

- This release improves the start-up time for the emulator while reducing the footprint of its data on the disk. Activate this new optimization by using the `/EnablePreview` argument.

### ``2.14.0`` (June 15, 2021)

- This release updates the local Data Explorer content to latest Microsoft Azure version. It also fixes an issue when importing many items by using the JSON file upload feature.

### ``2.11.13`` (April 21, 2021)

- This release updates the local Data Explorer content to latest Microsoft Azure version and adds a new MongoDB endpoint configuration, ``4.0``.

### ``2.11.11`` (February 22, 2021)

- This release updates the local Data Explorer content to latest Microsoft Azure version.

### ``2.11.10`` (January 5, 2021)

- This release updates the local Data Explorer content to latest Microsoft Azure version. It also adds a new public option, `/ExportPemCert`, which enables the emulator user to directly export the public emulator's certificate as a `.PEM` file.

### ``2.11.9`` (December 3, 2020)

- This release updates the Azure Cosmos DB Emulator background services to match the latest online functionality of the Azure Cosmos DB. It also addresses couple issues with the Azure Cosmos DB Emulator functionality:
  - Fix for an issue where large document payload requests fail when using Direct mode and Java client applications.
  - Fix for a connectivity issue with MongoDB endpoint version 3.6 when targeted by .NET based applications.

### ``2.11.8`` (November 6, 2020)

- This release includes an update for the Azure Cosmos DB Emulator Data Explorer and fixes an issue where **transport layer security (TLS) 1.3** clients try to open the Data Explorer.

### ``2.11.6`` (October 6, 2020)

- This release addresses a concurrency-related issue when creating more than one container at the same time. The issue can leave the emulator in a corrupted state and future API requests to the emulator's endpoint fails with *service unavailable* errors. The work-around is to stop the emulator, reset of the emulator's local data and restart.

### ``2.11.5`` (August 23, 2020)

- This release adds two new Azure Cosmos DB Emulator startup options:
  - `/EnablePreview` - Enables preview features for the Azure Cosmos DB Emulator. The preview features that are still under development and are available via CI and sample writing.
  - `/EnableAadAuthentication` - Enables the emulator to accept custom Microsoft Entra ID tokens as an alternative to the Azure Cosmos DB primary keys. This feature is still under development; specific role assignments and other permission-related settings aren't currently supported.

### ``2.11.2`` (July 7, 2020)

- This release changes how the Azure Cosmos DB Emulator collects traces. Windows Performance Runtime (WPR) is now the default tools for capturing event trace log-based traces while deprecating logman based capturing. With the latest Windows security update, LOGMAN stopped working as expected when executed through the Azure Cosmos DB Emulator.

### ``2.11.1`` (June 10, 2020)

- This release fixes couple bugs related to Azure Cosmos DB Emulator Data Explorer:
  - Data Explorer fails to connect to the Azure Cosmos DB Emulator endpoint when hosted in some Web browser versions. Emulator users might not be able to create a database or a container through the Web page.
  - Resolved bug that prevented emulator users from creating an item from a JSON file using Data Explorer upload action.

### ``2.11.0``

- This release introduces support for autoscale provisioned throughput. The added features include the option to set a custom maximum provisioned throughput level in request units (RU/s), enable autoscale on existing databases and containers, and API support through Azure Cosmos DB SDK.
- Fix an issue while querying through large number of documents (over 1 GB) were the emulator fails with internal error status code 500.

### ``2.9.2``

- This release fixes a bug while enabling support for MongoDb endpoint version 3.2. It also adds support for generating trace messages for troubleshooting purposes using [Windows Performance Recorder (WPR)](/windows-hardware/test/wpt/wpr-command-line-options) instead of [logman](/windows-server/administration/windows-commands/logman).

### ``2.9.1``

- This release fixes couple issues in the query API support and restores compatibility with older OSs such as Windows Server 2012.

### ``2.9.0``

- This release adds the option to set the consistency to consistent prefix and increase the maximum limits for users and permissions.

### ``2.7.2``

- This release adds MongoDB version 3.6 server support to the Azure Cosmos DB Emulator. To start a MongoDB endpoint that target version 3.6 of the service, start the emulator from an Administrator command line with `/EnableMongoDBEndpoint=3.6`` option.

### ``2.7.0``

- This release fixes a regression in the Azure Cosmos DB Emulator that prevented users from executing SQL related queries. This issue impacts emulator users that configured API for NoSQL endpoint and they're using .NET core or x86 .NET based client applications.

### ``2.4.6``

- This release provides parity with the features in the Azure Cosmos DB service as of July 2019, with noted exceptions. It also fixes several bugs related to emulator shut down when invoked via command line and internal IP address overrides for SDK clients using direct mode connectivity.

### ``2.4.3``

- MongoDB service is no longer started by default. By default, the emulator enables the SQL endpoint. The user must start the endpoint manually using the emulator's `/EnableMongoDbEndpoint` command-line option. Now, it's like all the other service endpoints, such as Gremlin, Cassandra, and Table.
- Fixes a bug in the emulator when starting with “/AllowNetworkAccess” where the Gremlin, Cassandra, and Table endpoints weren't correctly handling requests from external clients.
- Add direct connection ports to the Firewall Rules settings.

### ``2.4.0``

- Fixed an issue with emulator failing to start when network monitoring apps, such as Pulse Client, are present on the host computer.

## Next steps

- [Learn more about the Azure Cosmos DB emulator](emulator.md)
- [Get started using the Azure Comsos DB emulator for development](how-to-develop-emulator.md)
