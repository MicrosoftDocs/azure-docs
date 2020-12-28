---
title: Troubleshoot Azure Cosmos DB service unavailable exceptions with the Java v4 SDK
description: Learn how to diagnose and fix Azure Cosmos DB service unavailable exceptions with the Java v4 SDK.
author: kushagrathapar
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.date: 10/28/2020
ms.author: kuthapar
ms.topic: troubleshooting
ms.reviewer: sngun
---

# Diagnose and troubleshoot Azure Cosmos DB Java v4 SDK service unavailable exceptions
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]
The Java v4 SDK wasn't able to connect to Azure Cosmos DB.

## Troubleshooting steps
The following list contains known causes and solutions for service unavailable exceptions.

### The required ports are being blocked
Verify that all the [required ports](sql-sdk-connection-modes.md#service-port-ranges) are enabled.

### Client-side transient connectivity issues
Service unavailable exceptions can surface when there are transient connectivity problems that are causing timeouts. Typically, the stack trace related to this scenario will contain a `ServiceUnavailableException` error with diagnostic details. For example:

```java
Exception in thread "main" ServiceUnavailableException{userAgent=azsdk-java-cosmos/4.6.0 Linux/4.15.0-1096-azure JRE/11.0.8, error=null, resourceAddress='null', requestUri='null', statusCode=503, message=Service is currently unavailable, please retry after a while. If this problem persists please contact support.: Message: "" {"diagnostics"}
```

Follow the [request timeout troubleshooting steps](troubleshoot-request-timeout-java-sdk-v4-sql.md#troubleshooting-steps) to resolve it.

### Service outage
Check the [Azure status](https://status.azure.com/status) to see if there's an ongoing issue.


## Next steps
* [Diagnose and troubleshoot](troubleshoot-java-sdk-v4-sql.md) issues when you use the Azure Cosmos DB Java v4 SDK.
* Learn about performance guidelines for [Java v4 SDK](performance-tips-java-sdk-v4-sql.md).