---
title: Azure HDInsight Apache HBase Cluster/Query Advisor
description: Gives a deeper understanding of the various Azure advisories for HDInsight HBase
author: hrasheed-msft
ms.author: ramvasu
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: Cluster tuning
ms.date: 12/02/2020

#Customer intent: The azure advisories help to tune the cluster/query. This doc gives a much deeper understanding of the various advisories including the recommended configuration tunings.
---

# Reading most recent data from memstore
If your use case happens to be reading the most recent data it means that most of the reads will land in memstore. The query advisory might indicate that greater than 75% of the data being read are hitting the memstore. This suggests that even if a flush happens on the memstore the recent file needs to be accessed and that needs to be in cache. 

Ensure that the following configs are tuned
1.  Set `hbase.rs.cacheblocksonwrite` to `true`  - This is by default true in HDInsight HBase. Ensure this not reset.
2.  Increase the `hbase.hstore.compactionThreshold` value so that you can avoid the compaction from kicking in. By default this is `3`. You can increase it to a higher value like `10`.
3. If you are doing #2 then change `hbase.hstore.compaction.max` to a higher value for eg `100`.
4. If you are sure that you are interested only in the recent data then turn ON `hbase.rs.cachecompactedblocksonwrite` configuration so that even if compaction happens then we are sure that the data is in cache. These configs can be set at the family level also.
5. Block cache can be turned off for a given family in a table. Ensure that it is turned ON for families that have most recent data reads.

The above configurations helps to ensure that as far as possible the data is in cache and that the recent data does not undergo compaction. If a TTL is possible in your usecase then mind considering Date tiered compaction. For more details on what is Date Tiered compaction check the below link,
  ```
   https://hbase.apache.org/book.html#ops.date.tiered
  ```

# Flush queue/region count tuning
The advisory may indicate that your flushes may need tuning. This happens due to two reasons, either because the flush handlers are not enough as the flushes are slower or the region count is so large that the updates are getting blocked and the flusher threads needs to flush more frequently. 

In the region server UI keep an eye on the flush queue and if it grows beyond 100 then it means that the flushes are slower and you may have to tune the  configuration  `hbase.hstore.flusher.count`. By default the value is 2. Ensure that the max flusher threads do not increase 10.

The most prominent reason why you have blocked updates is that the region count might be more than the optimally supported heap size. Generally how to tune the heap size, memstore size and the region count? Lets see with an example

Assume the heap size for the region server is 10GB. By default the `hbase.hregion.memstore.flush.size` is `128M`. The default value for `hbase.regionserver.global.memstore.size` is `0.4`. Which means that out of 10G, `4G` is allocated for memstore (globally).
The configuration `hbase.hregion.memstore.block.multiplier` (default value 4) is the maximum size upto which a given region can grow which is (128*4) = 512M. Once this size is reached the updates to this region is blocked and the client will get `RegionTooBusyException`. This inturn might indicate hotspotting of a region. Avoiding hotspots is a different topic. We won't discuss on that here in this section.
Assuming there is an even distribution of the write load on all the regions and assuming every region grows upto 128M only then the max number of regions in this setup is `32` regions. If a given region server is configured to have 32 regions then we won't end up seeing blocked updates.

Now what happens with the above settings - we have 100 regions. The 4G global memstore is now splitted across 100 regions. So effectively each region gets only 40MB for memstore. When the writes are uniform this will result in frequent flushes and smaller size of the order < 40M. Having more flusher threads might increase the flush speed `hbase.hstore.flusher.count`.
In this case since we have room for a region to grow upto 128M there will be frequent cases where the global limit of 4G might be breached and all the updates are blocked until we fall to 0.95 of 4G which is again the configuration `hbase.regionserver.global.memstore.size.lower.limit`. The advisory here means that it would be good to revisit the number of regions per server, the heap size and the global memstore size configuration along with the flush threads tuning so that such updates getting blocked can be avoided.

# Compaction queue tuning
The compaction queue grows to more than 2000 and this seems to happen periodically. This suggests that you can increase the compaction threads to a bigger value. The configurations are `hbase.regionserver.thread.compaction.small` and `hbase.regionserver.thread.compaction.large` (the defaults are 1 each).
Cap the max value for this configuration to be less than 5.

# Full table scan
If you have happen to see this advisory it indicates that over 75% of the scans issued are full table/region scans. Revisiting how the scan is formed might help in faster query performance like setting proper start and stop row, cases where you really need full table/region scan check if there is a possibility of avoiding cache usage for those queries so that other queries that needs to make use of the cache might not evict the blocks that are really hot.
For ensuring the scans do not use cache use the below API while creating your scans,
  ```
    scan#setCaching(false)
  ```