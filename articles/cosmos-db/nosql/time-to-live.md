---
title: Expire data in Azure Cosmos DB with Time to Live 
description: With TTL, Microsoft Azure Cosmos DB provides the ability to have documents automatically purged from the system after a period of time.
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 09/16/2021
---
# Time to Live (TTL) in Azure Cosmos DB
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

With **Time to Live** or TTL, Azure Cosmos DB provides the ability to delete items automatically from a container after a certain time period. By default, you can set time to live at the container level and override the value on a per-item basis. After you set the TTL at a container or at an item level, Azure Cosmos DB will automatically remove these items after the time period, since the time they were last modified. Time to live value is configured in seconds. When you configure TTL, the system will automatically delete the expired items based on the TTL value, without needing a delete operation that is explicitly issued by the client application. The maximum value for TTL is 2147483647 seconds, the approximate equivalent of 24,855 days or 68 years.

Deletion of expired items is a background task that consumes left-over [Request Units](../request-units.md), that is Request Units that haven't been consumed by user requests. Even after the TTL has expired, if the container is overloaded with requests and if there aren't enough RU's available, the data deletion is delayed. Data is deleted once there are enough RUs available to perform the delete operation. Though the data deletion is delayed, data is not returned by any queries (by any API) after the TTL has expired.

> [!NOTE]
> This content is related to Azure Cosmos DB transactional store TTL. If you are looking for analytical store TTL, that enables NoETL HTAP scenarios through [Azure Synapse Link](../synapse-link.md), please click [here](../analytical-store-introduction.md#analytical-ttl).

## Time to live for containers and items

The time to live value is set in seconds, and it is interpreted as a delta from the time that an item was last modified. You can set time to live on a container or an item within the container:

1. **Time to Live on a container** (set using `DefaultTimeToLive`):

   - If missing (or set to null), items are not expired automatically.

   - If present and the value is set to "-1", it is equal to infinity, and items don’t expire by default.

   - If present and the value is set to some *non-zero* number *"n"* – items will expire *"n"* seconds after their last modified time.

2. **Time to Live on an item** (set using `ttl`):

   - This Property is applicable only if `DefaultTimeToLive` is present and it is not set to null for the parent container.

   - If present, it overrides the `DefaultTimeToLive` value of the parent container.

## Time to Live configurations

- If TTL is set to *"n"* on a container, then the items in that container will expire after *n* seconds.  If there are items in the same container that have their own time to live, set to -1 (indicating they do not expire) or if some items have overridden the time to live setting with a different number, these items expire based on their own configured TTL value.

- If TTL is not set on a container, then the time to live on an item in this container has no effect.

- If TTL on a container is set to -1, an item in this container that has the time to live set to n, will expire after n seconds, and remaining items will not expire.

## Examples

This section shows some examples with different time to live values assigned to container and items:

### Example 1

TTL on container is set to null (DefaultTimeToLive = null)

|TTL on item| Result|
|---|---|
|ttl = null|TTL is disabled. The item will never expire (default).|
|ttl = -1|TTL is disabled. The item will never expire.|
|ttl = 2000|TTL is disabled. The item will never expire.|

### Example 2

TTL on container is set to -1 (DefaultTimeToLive = -1)

|TTL on item| Result|
|---|---|
|ttl = null|TTL is enabled. The item will never expire (default).|
|ttl = -1|TTL is enabled. The item will never expire.|
|ttl = 2000|TTL is enabled. The item will expire after 2000 seconds.|

### Example 3

TTL on container is set to 1000 (DefaultTimeToLive = 1000)

|TTL on item| Result|
|---|---|
|ttl = null|TTL is enabled. The item will expire after 1000 seconds (default).|
|ttl = -1|TTL is enabled. The item will never expire.|
|ttl = 2000|TTL is enabled. The item will expire after 2000 seconds.|

## Next steps

Learn how to configure Time to Live in the following articles:

- [How to configure Time to Live](how-to-time-to-live.md)
