---
title: Troubleshoot Cosmos DB service unavailable exception
description: How to diagnose and fix Cosmos DB service unavailable exception
author: j82w
ms.service: cosmos-db
ms.date: 07/13/2020
ms.author: jawilley
ms.topic: troubleshooting
ms.reviewer: sngun
---

# Diagnose and troubleshoot Cosmos DB service unavailable

| Http Status Code | Name | Category |
|---|---|---|
|503|CosmosServiceUnavailable|Service|

## Issue

The SDK was not able to connect to the Azure Cosmos DB service.

## If a new application or service is getting 503

### 1. The required ports are not enabled.
Verify that all the [required ports](https://docs.microsoft.com/azure/cosmos-db/performance-tips#networking) are enabled.

## If an existing application or service started getting 503

### 1. There is an outage
Check the [Azure Status](https://status.azure.com/status) to see if there is an ongoing issue.

### 2. SNAT Port Exhaustion
Follow the [SNAT Port Exhaustion guide](troubleshoot-dot-net-sdk.md#snat).

### 3. The required ports are being blocked
Verify that all the [required ports](https://docs.microsoft.com/azure/cosmos-db/performance-tips#networking) are enabled.