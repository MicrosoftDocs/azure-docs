---
title: Azure Cache for Redis planning FAQs
description: Learn the answers to common questions that help you plan for Azure Cache for Redis
author: yegu-ms
ms.author: yegu
ms.service: cache
ms.topic: conceptual
ms.date: 08/06/2020
---
# Azure Cache for Redis planning FAQs

This article provides answers to common questions about how to plan for Azure Cache for Redis.

## Common questions and answers
This section covers the following FAQs:

* [Azure Cache for Redis performance](#azure-cache-for-redis-performance)
* [In what region should I locate my cache?](#in-what-region-should-i-locate-my-cache)
* [Where do my cached data reside?](#where-do-my-cached-data-reside)
* [How am I billed for Azure Cache for Redis?](#how-am-i-billed-for-azure-cache-for-redis)
* [Can I use Azure Cache for Redis with Azure Government Cloud, Azure China 21Vianet Cloud, or Microsoft Azure Germany?](#can-i-use-azure-cache-for-redis-with-azure-government-cloud-azure-china-21vianet-cloud-or-microsoft-azure-germany)

### Azure Cache for Redis performance
The following table shows the maximum bandwidth values observed while testing various sizes of Standard and Premium caches using `redis-benchmark.exe` from an IaaS VM against the Azure Cache for Redis endpoint. For TLS throughput, redis-benchmark is used with stunnel to connect to the Azure Cache for Redis endpoint.

>[!NOTE] 
>These values are not guaranteed and there is no SLA for these numbers, but should be typical. You should load test your own application to determine the right cache size for your application.
>These numbers might change as we post newer results periodically.
>

From this table, we can draw the following conclusions:

* Throughput for the caches that are the same size is higher in the Premium tier as compared to the Standard tier. For example, with a 6 GB Cache, throughput of P1 is 180,000 requests per second (RPS) as compared to 100,000 RPS for C3.
* With Redis clustering, throughput increases linearly as you increase the number of shards (nodes) in the cluster. For example, if you create a P4 cluster of 10 shards, then the available throughput is 400,000 * 10 = 4 million RPS.
* Throughput for bigger key sizes is higher in the Premium tier as compared to the Standard Tier.

| Pricing tier | Size | CPU cores | Available bandwidth | 1-KB value size | 1-KB value size |
| --- | --- | --- | --- | --- | --- |
| **Standard cache sizes** | | |**Megabits per sec (Mb/s) / Megabytes per sec (MB/s)** |**Requests per second (RPS) Non-SSL** |**Requests per second (RPS) SSL** |
| C0 | 250 MB | Shared | 100 / 12.5  |  15,000 |   7,500 |
| C1 |   1 GB | 1      | 500 / 62.5  |  38,000 |  20,720 |
| C2 | 2.5 GB | 2      | 500 / 62.5  |  41,000 |  37,000 |
| C3 |   6 GB | 4      | 1000 / 125  | 100,000 |  90,000 |
| C4 |  13 GB | 2      | 500 / 62.5  |  60,000 |  55,000 |
| C5 |  26 GB | 4      | 1,000 / 125 | 102,000 |  93,000 |
| C6 |  53 GB | 8      | 2,000 / 250 | 126,000 | 120,000 |
| **Premium cache sizes** | |**CPU cores per shard** | **Megabits per sec (Mb/s) / Megabytes per sec (MB/s)** |**Requests per second (RPS) Non-SSL, per shard** |**Requests per second (RPS) SSL, per shard** |
| P1 |   6 GB |  2 | 1,500 / 187.5 | 180,000 | 172,000 |
| P2 |  13 GB |  4 | 3,000 / 375   | 350,000 | 341,000 |
| P3 |  26 GB |  4 | 3,000 / 375   | 350,000 | 341,000 |
| P4 |  53 GB |  8 | 6,000 / 750   | 400,000 | 373,000 |
| P5 | 120 GB | 20 | 6,000 / 750   | 400,000 | 373,000 |

For instructions on setting up stunnel or downloading the Redis tools such as `redis-benchmark.exe`, see [How can I run Redis commands?](cache-development-faq.md#how-can-i-run-redis-commands).

### In what region should I locate my cache?
For best performance and lowest latency, locate your Azure Cache for Redis in the same region as your cache client application.

### Where do my cached data reside?
Azure Cache for Redis stores your application data in the RAM of the VM or VMs, depending on the tier, that host your cache. Your data reside strictly in the Azure region you've selected by default. There are two cases where your data may leave a region:
* When you enable persistence on the cache, Azure Cache for Redis will backup your data to an Azure Storage account you own. If the storage account you provide happens to be in another region, a copy of your data will end up there.
* If you set up geo-replication and your secondary cache is in a different region, which would be the case normally, your data will be replicated to that region.

You'll need to explicitly configure Azure Cache for Redis to use these features. You also have complete control over the region that the storage account or secondary cache is located.

### How am I billed for Azure Cache for Redis?
Azure Cache for Redis pricing is [here](https://azure.microsoft.com/pricing/details/cache/). The pricing page lists pricing as an hourly and monthly rate. Caches are billed on a per-minute basis from the time that the cache is created until the time that a cache is deleted. There is no option for stopping or pausing the billing of a cache.

### Can I use Azure Cache for Redis with Azure Government Cloud, Azure China 21Vianet Cloud, or Microsoft Azure Germany?
Yes, Azure Cache for Redis is available in Azure Government Cloud, Azure China 21Vianet Cloud, and Microsoft Azure Germany. The URLs for accessing and managing Azure Cache for Redis are different in these clouds compared with Azure Public Cloud.

| Cloud   | Dns Suffix for Redis            |
|---------|---------------------------------|
| Public  | *.redis.cache.windows.net       |
| US Gov  | *.redis.cache.usgovcloudapi.net |
| Germany | *.redis.cache.cloudapi.de       |
| China   | *.redis.cache.chinacloudapi.cn  |

For more information on considerations when using Azure Cache for Redis with other clouds, see the following links.

- [Azure Government Databases - Azure Cache for Redis](../azure-government/compare-azure-government-global-azure.md)
- [Azure China 21Vianet Cloud - Azure Cache for Redis](https://www.azure.cn/home/features/redis-cache/)
- [Microsoft Azure Germany](https://azure.microsoft.com/overview/clouds/germany/)

For information on using Azure Cache for Redis with PowerShell in Azure Government Cloud, Azure China 21Vianet Cloud, and Microsoft Azure Germany, see [How to connect to other clouds - Azure Cache for Redis PowerShell](cache-how-to-manage-redis-cache-powershell.md#how-to-connect-to-other-clouds).

## Next steps

Learn about other [Azure Cache for Redis FAQs](cache-faq.md).