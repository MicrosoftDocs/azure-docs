---
title: Expire data in Azure Cosmos DB with Time to Live 
description: With TTL, Microsoft Azure Cosmos DB provides the ability to have documents automatically purged from the system after a period of time.
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 11/14/2018
ms.author: mjbrown
ms.reviewer: sngun

---
# Time to live in Azure Cosmos DB 

With "Time to Live" or TTL, Azure Cosmos DB provides the ability to delete items automatically from a container after a certain time period. By default, you can set time to live at the container level and override the value on a per-item basis. After you set the TTL at a container or at an item level, Azure Cosmos DB will automatically remove these items after the time period, since the time they were last modified. Time to live value is configured in seconds. When you configure TTL, the system will automatically delete the expired items based on the TTL value, unlike a delete operation that is explicitly issued by the client application.

## Time to live for containers and items

The time to live value is set in seconds and it is interpreted as a delta from the time that an item was last modified. You can set time to live on a container or an item within the container:

1. **Time to Live on a container** (set using `DefaultTimeToLive`):

   - If missing (or set to null), items are not expired automatically.

   - If present and the value is set to "-1", it is equal to infinite – items don’t expire by default.

   - If present and the value is set to some number ("n") – items expire "n" seconds after their last modified time.

2. **Time to Live on an item** (set using `TimeToLive`):

   - This Property is applicable only if `DefaultTimeToLive` is present and it is not set to null for the parent container.

   - If present, it overrides the `DefaultTimeToLive` value of the parent container.

## Time to Live configurations

* If TTL is set to 'n' on a container, then the items in that container will expire after n seconds.  If there are items in the same container that have their own time to live, set to -1 (indicating they do not expire) or if some items have overridden the time to live setting with a different number, these items expire based on the configured TTL value. 

* If TTL is not set on a container, then the time to live on an item in this container has no effect. 

* If TTL on a container is set to -1, an item in this container that has the time to live set to n, will expire after n seconds, and remaining items will not expire. 

Deleting items based on TTL is free. There is no additional cost (that is, no additional RUs are consumed) when item is deleted as a result of TTL expiration.

## Next steps

Learn how to configure Tile to Live in the following articles:

* [How to configure Time to Live](how-to-time-to-live.md)
