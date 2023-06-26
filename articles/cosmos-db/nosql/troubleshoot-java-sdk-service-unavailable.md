---
title: Troubleshoot Azure Cosmos DB service unavailable exceptions with the Java v4 SDK
description: Learn how to diagnose and fix Azure Cosmos DB service unavailable exceptions with the Java v4 SDK.
author: kushagrathapar
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: ignite-2022, devx-track-extended-java
ms.date: 02/03/2022
ms.author: kuthapar
ms.topic: troubleshooting
ms.reviewer: mjbrown
---

# Diagnose and troubleshoot Azure Cosmos DB Java v4 SDK service unavailable exceptions
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]
The Java v4 SDK wasn't able to connect to Azure Cosmos DB.

## Troubleshooting steps
The following list contains known causes and solutions for service unavailable exceptions.

### The required ports are being blocked
Verify that all the [required ports](sdk-connection-modes.md#service-port-ranges) are enabled. If the account is configured with private endpoint, then more ports are required to be opened.

```
failed to establish connection to {account name}.documents.azure.com/<unresolved>:3044 due to io.netty.channel.ConnectTimeoutException:
```

### Client initialization failure
The following exception is hit if the SDK isn't able to talk to the Azure Cosmos DB instance. This exception normally indicates some security protocol like a firewall rule that is blocking the requests.

```java
 java.lang.RuntimeException: Client initialization failed. Check if the endpoint is reachable and if your auth token is valid
```

To validate the SDK can communicate to the Azure Cosmos DB account execute the following command from where the application is hosted. If it fails this points to a firewall rule or other security feature blocking the request. If it succeeds the SDK should be able to communicate to the Azure Cosmos DB account.
```
telnet myCosmosDbAccountName.documents.azure.com 443
```

### Client-side transient connectivity issues
Service unavailable exceptions can surface when there are transient connectivity problems that are causing timeouts. Typically, the stack trace related to this scenario will contain a `ServiceUnavailableException` error with diagnostic details. For example:

```java
Exception in thread "main" ServiceUnavailableException{userAgent=azsdk-java-cosmos/4.6.0 Linux/4.15.0-1096-azure JRE/11.0.8, error=null, resourceAddress='null', requestUri='null', statusCode=503, message=Service is currently unavailable, please retry after a while. If this problem persists please contact support.: Message: "" {"diagnostics"}
```

Follow the [request timeout troubleshooting steps](troubleshoot-java-sdk-request-timeout.md#troubleshooting-steps) to resolve it.

#### UnknownHostException
UnknownHostException means that the Java framework can't resolve the DNS entry for the Azure Cosmos DB endpoint in the affected machine. You should verify that the machine can resolve the DNS entry or if you have any custom DNS resolution software (such as VPN or Proxy, or a custom solution), make sure it contains the right configuration for the DNS endpoint that the error is claiming can't be resolved. If the error is constant, you can verify the machine's DNS resolution through a `curl` command to the endpoint described in the error.

### Service outage
Check the [Azure status](https://azure.status.microsoft/status) to see if there's an ongoing issue.


## Next steps
* [Diagnose and troubleshoot](troubleshoot-java-sdk-v4.md) issues when you use the Azure Cosmos DB Java v4 SDK.
* Learn about performance guidelines for [Java v4 SDK](performance-tips-java-sdk-v4.md).
