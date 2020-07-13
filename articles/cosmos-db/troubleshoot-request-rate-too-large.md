---
title: Troubleshoot Cosmos DB request rate to large exception
description: How to diagnose and fix request rate to large exception
author: j82w
ms.service: cosmos-db
ms.date: 07/13/2020
ms.author: jawilley
ms.topic: troubleshooting
ms.reviewer: sngun
---

## CosmosRequestRateTooLarge

| Http Status Code | Name | Category |
|---|---|---|
|429|CosmosRequestRateTooLarge|Service|

## Description
'Request rate too large' or error code 429 indicates that your requests are being throttled, because the consumed throughput (RU/s) has exceeded the [provisioned throughput](https://docs.microsoft.com/azure/cosmos-db/set-throughput). The SDK will automatically retry requests based on the specified retry policy. If you get this failure often, consider increasing the throughput on the collection. Check the portal's metrics to see if you are getting 429 errors. Review your partition key to ensure it results in an [even distribution of storage and request volume](https://docs.microsoft.com/azure/cosmos-db/partition-data).

### Solution:

1. Use the portal or the SDK to increase the provisioned throughput.
2. Switch the database or container to [Autoscale](https://docs.microsoft.com/azure/cosmos-db/provision-throughput-autoscale)

## Related documentation
* [Provision throughput on containers and databases](https://docs.microsoft.com/azure/cosmos-db/set-throughput)
* [Request units in Azure Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/request-units)
