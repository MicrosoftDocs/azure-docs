---
title: Troubleshoot Azure Cosmos DB service unavailable exception
description: How to diagnose and fix Cosmos DB service unavailable exception
author: j82w
ms.service: cosmos-db
ms.date: 07/13/2020
ms.author: jawilley
ms.topic: troubleshooting
ms.reviewer: sngun
---

# Diagnose and troubleshoot Azure Cosmos DB service unavailable
The SDK was not able to connect to the Azure Cosmos DB service.

## Troubleshooting steps
The following list contains known causes and solutions for service unavailable exceptions.

### 1. The required ports are not enabled.
Verify that all the [required ports](performance-tips-dotnet-sdk-v3-sql.md#networking) are enabled.

## If an existing application or service started getting 503

### 1. There is an outage
Check the [Azure Status](https://status.azure.com/status) to see if there is an ongoing issue.

### 2. SNAT Port Exhaustion
Follow the [SNAT Port Exhaustion guide](troubleshoot-dot-net-sdk.md#snat).

### 3. The required ports are being blocked
Verify that all the [required ports](performance-tips-dotnet-sdk-v3-sql.md#networking) are enabled.

## Next steps
* [Diagnose and troubleshoot](troubleshoot-dot-net-sdk.md) issues when using Azure Cosmos DB .NET SDK
* Learn about performance guidelines for [.NET V3](performance-tips-dotnet-sdk-v3-sql.md) and [.NET V2](performance-tips.md)