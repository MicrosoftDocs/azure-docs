---
title: IP Allocation Management
description: IP Allocation Management
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# **IPAM**
The main functionality of **IPAM** is to retrieve the best fit for the next-available-block to minimize fragmentation, taking into account the size of the requested blocks and the current allocations and reservations to the pool.
## **TERMINOLOGY:**
In IPAM, a **CidrSpace** is a CidrRange, or a block.

A **CidrPool** (or just a pool), is the community, or the larger address space, to which CidrSpaces will be allocated to. A pool can be a main pool or a secondary pool. A main CidrPool can have both CidrSpaces, and other mini CidrPools allocated to it (these are called secondary pools). In that sense, the mini CidrPools, (or secondary pools) support reservations for specific types and can have other allocations inside them.

Thus, if reservations are loaded to a CidrPool, it is split between the general pool (available for any type of CidrSpace), and the reservations (which have a specific type of blocks that they accept). Note that reservations should be created up-front to ensure that the entire pool is free, but they are completely optional. This is, if a client decides not to load any reservations, the entire pool will be free for the end-user to make his allocations.

Blocks can be both allocated and deallocated to a pool (no matter if they are the main pool or secondary pools). However, once a reservation has been created, it cannot be removed. 

If reservations are loaded, the type of allocation should be passed to IPAM whenever making a _TryGetNextAvailableCIDRBlock()_ request; as the algorithm will check if there is a specific reservation of that one type before trying to allocate it to the general pool. If there is a reservation, IPAM will retrieve the next-block from that reservation (as long as there’s space available in that specific reserved mini pool). If there isn't a reservation, it will give you the next-block from the general pool.

## **STATELESS USAGE**
1. Initialize the CidrPool - create object and initialize ranges.
2. The pool is now empty, so load the initial reservations.
3. Now it’s ready to be used. To allocate a block, first call _TryGetNextAvailableCIDRBlock()_, and pass it the size and type of block that you want.
4. Then, call _Allocate()_ and pass it the block returned by _TryGetNextAvailableCIDRBlock()_. 
5. To deallocate a block, call _Deallocate()_ and pass it the specific block that wants to be deallocated.

**Design Diagrams:** https://www.figma.com/file/hIhcv3w9LTuFOBYTTZPE7d/IPAM-Library---VE?type=design&node-id=0%3A1&mode=design&t=a1sxZIZkrM45yaKV-1

## **IPAM MANAGER**
If a client library wants to use IPAM in a stateful manner, an IPAM Manager is built on-top of the stateless IPAM, such that every interaction that occurs through the IPAM Manager will persist IPAM responses in a SQL Database.

To use the IPAM Manager, a connection string must be passed up-front. The IPAM Manager instance will create the appropriate SQL Tables  - **CidrPool** and **CidrSpace** tables (if they don't already exist).

## **STATEFUL USAGE**
1. Create a SQL Database and retrieve the connection string.
2. Create an **IpamManager** instance by passing it the SQL Database connection string. 
3. The IPAM Manager will automatically create the Tables if they have not already been created. Now, every interaction with IPAM needs to be made through the IPAM Manager, as it will store the state of the requests in the database.
4. To create a pool, _CreatePool()_ can be called on the IPAM Manager's instance. Reservations can be optionally passed to the manager at this step if the client library wants to support them.
5. After the pool has been created, _GetNextAvailableCIDRBlock()_ can be called on the IPAM Manager.
6. Then, call _AllocateToPool()_ and pass it the pool ID and the block returned by GetNextAvailableCIDRBlock().
7. To deallocate a block, call _DeallocateFromPool()_ and pass it the pool ID and the specific block that wants to be deallocated.
8. If you want to retrieve a specific pool by its ID, call _GetPoolById()_ on the manager, and pass it the specific pool ID.

## **CONCURRENCY HANDLING**
Concurrency must be handled in the client library. It isn't handled inside of IPAM.

A common concurrency handling approach is to use **Azure Cache for Redis**, with persistence in a Storage Account. In this sense, a RedLock (which is a Redis distributed mutex lock) is added before any call to IPAM is made. Since Redis supports TTL, a simple deadlock-free mechanism can be used to ensure that no two processes ever get the same conflicting CIDR Ranges returned to them when calling IPAM.
