---
title: Troubleshoot Azure Cosmos DB forbidden exceptions
description: Learn how to diagnose and fix forbidden exceptions.
author: ealsur
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.date: 02/05/2021
ms.author: maquaran
ms.topic: troubleshooting
ms.reviewer: sngun
---

# Diagnose and troubleshoot Azure Cosmos DB forbidden exceptions
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

The HTTP status code 403 represents the request is forbidden to complete.

### Firewall blocking requests
On this scenario, it is common to see errors like the ones below:

```
Request originated from client IP {...} through public internet. This is blocked by your Cosmos DB account firewall settings.
```

```
Request is blocked. Please check your authorization token and Cosmos DB account firewall settings
```

#### Solution:
Verify that your current firewall settings are correct and include the IPs or networks you are trying to connect from. If you recently updated them, keep in mind that changes can take **up to 15 minutes to apply**.

## Next steps
* [Diagnose and troubleshoot](troubleshoot-dot-net-sdk.md) issues when you use the Azure Cosmos DB .NET SDK.
* Learn about performance guidelines for [.NET v3](performance-tips-dotnet-sdk-v3-sql.md) and [.NET v2](performance-tips.md).
* [Diagnose and troubleshoot](troubleshoot-java-sdk-v4-sql.md) issues when you use the Azure Cosmos DB Java v4 SDK.
* Learn about performance guidelines for [Java v4 SDK](performance-tips-java-sdk-v4-sql.md).
