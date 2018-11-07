---
title: Expire data in Azure Cosmos DB with Time to Live | Microsoft Docs
description: With TTL, Microsoft Azure Cosmos DB provides the ability to have documents automatically purged from the system after a period of time.
services: cosmos-db
author: markjbrown

ms.service: cosmos-db
ms.topic: conceptual
ms.date: 11/14/2018
ms.author: mjbrown

---
# Time to Live

With "Time to Live" or TTL, Cosmos DB provides the ability to have items automatically deleted from the Cosmos container after a period of time. The default time to live can be set at the container level and overridden on a per-item basis. Once TTL is set, either at a container or at an item level, Cosmos DB will automatically remove items after that period of time, in seconds, since the time they were last modified. Put differently, unlike a delete operation explicitly issued by the client application, deletion of the expired items (based on the value of TTL) is done automatically by the system.

## Time to live for containers and items

The TTL value is set in seconds and is interpreted as a delta from the time that an item was last modified.

1. **Time to live on a container** (`DefaultTimeToLive`):
- If missing (or set to null), items are not expired automatically.
- If present and the value is set to "-1" = infinite – items don’t expire by default.
- If present and the value is set to some number ("n") – items expire "n" seconds after last modification.

2. **Time to live on an item** (`TimeToLive`):
- Property is applicable only if `DefaultTimeToLive` is present and is not set to null for the parent container.
- Overrides the `DefaultTimeToLive` value for the parent container

## Time to live configurations

- If TTL is set to n on a container, then the items in that container will expire after n seconds, sans those items that have their own time to live set to -1 (indicating they do not expire) or those items that have overridden the time to live setting with their own TTL value. 
- If TTL is not set on a container, then the time to live on an item in this container has no effect. 
- If TTL on a container is set to -1, then an item in this container with the time to live set to n, will expire after n seconds, otherwise no items will expire. 

TTL based deletion is completely free. There is no additional cost (i.e., no RUs are consumed) when item is deleted due to TTL expiration.

## Next steps

Learn more about time to live in the following articles:

- [How to work with Time to live](how-to-time-to-live.md)
