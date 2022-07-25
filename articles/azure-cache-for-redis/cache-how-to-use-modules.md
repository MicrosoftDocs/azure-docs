---
title: Azure Cache for Redis
description: Learn how to use Redis module with your Azure Cache for Redis instances.
author: flang-msft

ms.author: franlanglois
ms.service: cache
ms.topic: how-to
ms.date: 07/26/2022

---
# Use Redis modules with Azure Cache for Redis

You can use Redis modules are libraries to add additional data structures and functionalities to the core Redis software. Modules were introduced in open-source Redis 4.0. 

These modules extend the use-cases of Redis by adding functionality like search capabilities and data structures like _bloom and cuckoo_ filters.

Many popular modules are available for use in the Enterprise tier of Azure Cache for Redis:

| Module |Basic, Standard, and Premium  |Enterprise  |Enterprise Flash  |
|---------|---------|---------|---------|
|RediSearch   |    ✘   |    ✓     | ✓ (preview)    |
|RedisBloom   |      ✘   |    ✓    |   ✘    |
|RedisTimeSeries |   ✘    |    ✓   |   ✘    |
|RedisJSON  |     ✘    |  ✓ (preview)    |   ✓ (preview)      |

Currently, `RediSearch` is the only module that can be used concurrently with active geo-replication.

> [!NOTE]
> Currently, you can't manually load other modules into Azure Cache for Redis. Manually updating modules version is also not possible.
>

<!-- Required. Lead with a light intro that describes, in customer-friendly language, 
what the customer will learn, or do, or accomplish. Answer the fundamental “why 
would I want to do this?” question. Keep it short.
-->

## Prerequisites

<!--
Optional. If you need prerequisites, make them your first H2 in a how-to guide. 
Use clear and unambiguous language and use a list format.
-->

- <!-- prerequisite 1 -->
- <!-- prerequisite 2 -->
- <!-- prerequisite n -->
<!-- remove this section if prerequisites are not needed -->

## Adding modules to your cache

You must add modules when you create your Enterprise tier cache. Add a module or modules in the Advanced tab of the Enterprise tier caches. You can add all the available modules or to select only specific modules to install.

> [!IMPORTANT]
> Modules must be enabled at the time you create an Azure Cache for Redis instance.

:::image type="content" source="media/cache-how-to-use-modules/cache-add-modules.png" alt-text="Screenshot of advanced tab showing a list of modules to add to a new cache. ":::

<!-- H2s Required. A how-to article explains how to do a task. The bulk of each H2 should be 
a procedure.
-->

## Modules

The following modules are available when creating a new Enterprise cache.

- [RediSearch](#redisearch)
- [RedisBloom](#redisbloom)
- [RedisTimeSeries](#redistimeseries)
- [RedisJSON](#redisjson)

### RediSearch

The **RediSearch** module adds a _real-time search engine_ to a Redis server, combining low latency performance with powerful search features. 

Features include:

- Multi-field queries
- Aggregation
- Prefix, fuzzy, and phonetic-based searches
- Auto-complete suggestions
- Geo-filtering
- Boolean queries

Additionally, **RediSearch** can function as a secondary index, expanding the Redis server beyond a key-value structure and offering more sophisticated queries.

You can use **RediSearch** is used in a wide variety of use-cases, including real-time inventory, enterprise search, and in indexing external databases. [Learn more at the RediSearch documentation page](https://redis.io/docs/stack/search/).

>[!NOTE]
> The RediSearch module is the only module that can be used with active geo-replication.

### RedisBloom

RedisBloom adds four probabilistic data structures to Redis: **bloom filter**, **cuckoo filter**, **count-min sketch**, and **top-k**. Each of these data structures offers a way to sacrifice perfect accuracy in return for higher speed and better memory efficiency.

| **Data structure**   |  **Description**       |  **Example application**|
| ---------------------|------------------------|-------------------------|
| Bloom and Cuckoo filters | Returns if an item is either (a) certainly not in a set or (b) potentially in a set.    |   Checking if an email has already been sent to a user|
|Count-min sketch | Determines the frequency of events in a stream | Counting how many times an IoT device reported a temperature under 0 degrees Celsius.  |
|Top-k   | Finds the k most frequently seen items |  Determine the most frequent words used in War and Peace. (e.g. setting k = 50 will return the 50 most common words in the book) |

Bloom and Cuckoo filters are very similar to each other, but each have a unique set of advantages and disadvantages that are beyond the scope of
this documentation.

Learn more at the [RedisBloom](https://redis.io/docs/stack/bloom/).

### RedisTimeSeries

The **RedisTimeSeries** module adds high-throughput time series capabilities to a Redis server. This data structure is optimized for high volumes of incoming data and contains features to work with time series data, including:

- Aggregated queries (e.g. average, maximum, standard deviation, etc.)
- Time-based queries (e.g. start-time and end-time)
- Downsampling/decimation
- Data labeling for secondary indexing
- Configurable retention period

This module is useful for many applications that involve monitoring streaming data, such as IoT telemetry, application monitoring, and anomaly detection.

Learn more at [RedisTimeSeries](https://redis.io/docs/stack/timeseries/).

### RedisJSON

The RedisJSON module adds the capability to store, query, and search JSON-formatted data. This functionality is useful for storing document-like data within a Redis server.

Features include:

- Full support for the JSON standard
-	Wide range of operations for all JSON data types, including objects, numbers, arrays, and strings
-	Dedicated syntax and fast access to select and update elements inside documents

RedisJSON is also designed to be used with RediSearch to provide integrated indexing and querying of data within Redis. This can be a powerful tool to quickly retrieve specific data points within JSON objects. 
Common use-cases for RedisJSON include applications like searching product catalogs, managing user profiles, and caching JSON-structured data.
Learn more at the RedisJSON documentation page.


## Next steps

- [Quickstart: Create a Redis Enterprise cache](quickstart-create-redis-enterprise.md)[Write how-to guides](contribute-how-to-write-howto.md)
- [Client libraries](cache-best-practices-client-libraries.md)
