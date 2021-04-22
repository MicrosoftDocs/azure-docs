---
title: Migrate your application to use the Azure Cosmos DB .NET SDK 2.0 (Microsoft.Azure.Cosmos)
description: Learn how to upgrade your existing .NET application from the v1 SDK to .NET SDK v2 for Core (SQL) API.
author: stefArroyo
ms.author: esarroyo
ms.service: cosmos-db
ms.topic: how-to
ms.date: 10/15/2020
---

# Migrate your application to use the Azure Cosmos DB .NET SDK v2

> [!IMPORTANT]
> It is important to note that the v3 of the .NET SDK is currently available and a migration plan from v2 to v3 is available [here](migrate-dotnet-v3.md). To learn about the Azure Cosmos DB .NET SDK v2, see the [Release notes](sql-api-sdk-dotnet.md), the [.NET GitHub repository](https://github.com/Azure/azure-cosmos-dotnet-v2), .NET SDK v2 [Performance Tips](performance-tips.md), and the [Troubleshooting guide](troubleshoot-dot-net-sdk.md).
>

This article highlights some of the considerations to upgrade your existing v1 .NET application to Azure Cosmos DB .NET SDK v2 for Core (SQL) API. Azure Cosmos DB .NET SDK v2 corresponds to the `Microsoft.Azure.DocumentDB` namespace. You can use the information provided in this document if you are migrating your application from any of the following Azure Cosmos DB .NET Platforms to use the v2 SDK `Microsoft.Azure.Cosmos`:

* Azure Cosmos DB .NET Framework v1 SDK for SQL API
* Azure Cosmos DB .NET Core SDK v1 for SQL API

## What's available in the .NET v2 SDK

The v2 SDK contains many usability and performance improvements, including:

* Support for TCP direct mode for non-Windows clients
* Multi-region write support
* Improvements on query performance
* Support for geospatial/geometry collections and indexing
* Increased improvements for direct/TCP transport diagnostics
* Updates on direct TCP transport stack to reduce the number of connections established
* Improvements in latency reduction in the RequestTimeout

Most of the retry logic and lower levels of the SDK remains largely unchanged.

## Why migrate to the .NET v2 SDK

In addition to the numerous performance improvements, new feature investments made in the latest SDK will not be back ported to older versions.

Additionally, the older SDKs will be replaced by newer versions and the v1 SDK will go into [maintenance mode](sql-api-sdk-dotnet.md). For the best development experience, we recommend migrating your application to a later version of the SDK.

## Major changes from v1 SDK to v2 SDK

### Direct mode + TCP

The .NET v2 SDK now supports both direct and gateway mode. Direct mode supports connectivity through TCP protocol and offers better performance as it connects directly to the backend replicas with fewer network hops.

For more details, read through the [Azure Cosmos DB SQL SDK connectivity modes guide](sql-sdk-connection-modes.md).

### Session token formatting

The v2 SDK no longer uses the *simple* session token format as used in v1, instead the SDK uses *vector* formatting. The format should be converted when passing to the client application with different versions, since the formats are not interchangeable.

For more information, see [converting session token formats in the .NET SDK](how-to-convert-session-token.md).

### Using the .NET change feed processor SDK

The .NET change feed processor library 2.1.x requires `Microsoft.Azure.DocumentDB` 2.0 or later.

The 2.1.x library has the following key changes:

* Stability and diagnosability improvements
* Improved handling of errors and exceptions
* Additional support for partitioned lease collections
* Advanced extensions to implement the `ChangeFeedDocument` interface and class for additional error handling and tracing
* Added support for using a custom store to persist continuation tokens per partition

For more information, see the change feed processor library [release notes](sql-api-sdk-dotnet-changefeed.md).

### Using the bulk executor library

The v2 bulk executor library currently has a dependency on the Azure Cosmos DB .NET SDK 2.5.1 or later.

For more information, see the [Azure Cosmos DB bulk executor library overview](bulk-executor-overview.md) and the .NET bulk executor library [release notes](sql-api-sdk-bulk-executor-dot-net.md).

## Next steps

* Read about [additional performance tips](sql-api-get-started.md) using Azure Cosmos DB for SQL API v2 for optimization your application to achieve max performance
* Learn more about [what you can do with the v2 SDK](sql-api-dotnet-samples.md)