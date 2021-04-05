---
title: Troubleshoot Azure Cosmos DB bad request exceptions
description: Learn how to diagnose and fix bad request exceptions.
author: ealsur
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.date: 04/05/2021
ms.author: maquaran
ms.topic: troubleshooting
ms.reviewer: sngun
---

# Diagnose and troubleshoot Azure Cosmos DB forbidden exceptions
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

The HTTP status code 400 represents the request contains invalid data or it's missing required parameters.

## Missing required properties
On this scenario, it's common to see errors like the ones below:

```
The input content is invalid because the required properties - 'id; ' - are missing
```

### Solution
This error means the Json document being sent to the service is lacking this required property. You need to specify an `id` property with a String value as per the [REST specification](https://docs.microsoft.com/rest/api/cosmos-db/documents), the SDKs do not auto-generate values for this property.

## Next steps
* [Diagnose and troubleshoot](troubleshoot-dot-net-sdk.md) issues when you use the Azure Cosmos DB .NET SDK.
* Learn about performance guidelines for [.NET v3](performance-tips-dotnet-sdk-v3-sql.md) and [.NET v2](performance-tips.md).
* [Diagnose and troubleshoot](troubleshoot-java-sdk-v4-sql.md) issues when you use the Azure Cosmos DB Java v4 SDK.
* Learn about performance guidelines for [Java v4 SDK](performance-tips-java-sdk-v4-sql.md).