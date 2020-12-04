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
If you happen to see the above advisory it indicates that most of the reads (> 75%) of the reads are happening from the memstore.  It indicates that the reads are mostly on the recent data. This suggests that even if a flush happens on the memstore the recent file needs to be accessed and that needs to be in cache. 

Ensure that the following configs are tuned
1.  Set `hbase.rs.cacheblocksonwrite` to `true`  - This is by default true in HDInsight HBase. But ensure this not reset.
2.  Increase the `hbase.hstore.compactionThreshold` value so that you can avoid the compaction from kicking in. By default this is `3`. You can increase it to a higher value like `10`.
3. If you are doing #2 then change `hbase.hstore.compaction.max` to a higher value for eg `100`.
4. If you are sure that you are interested only in the recent data then turn ON `hbase.rs.cachecompactedblocksonwrite` configuration so that even if compaction happens then we are sure that the data is in cache. These configs can be set at the family level also.

The above configurations helps to ensure that as far as possible the data is in cache and that the recent data does not undergo compaction. If a TTL is possible in your usecase then mind considering Date tiered compaction. For more details on what is Date Tiered compaction check the below link,
  ```
   https://hbase.apache.org/book.html#ops.date.tiered
  ```

# Flush queue tuning
The flush queue grows to more than 200 and this seems to happen periodically. The other reason could be that we are observing blocking updates on your region servers, which means that the write ingestion rate and the rate at which flush happens is not catching up. This suggests that you can increase the flusher threads. By default the configuration is `hbase.hstore.flusher.count` is 2. For every 1000 regions you can increase the value by 1. But cap the max flusher threads to 10.
Flushes happen asynchronously but if the flushes happen slowly then it can adversely impact  your write performance. 

# Compaction queue tuning
The compaction queue grows to more than 2000 and this seems to happen periodically. This suggests that you can increase the compaction threads to a bigger value. The configurations are `hbase.regionserver.thread.compaction.small` and `hbase.regionserver.thread.compaction.large` (the defaults are 1 each).
Cap the max value for this configuration to be less than 5.

# Full table scan
If you have happen to see this advisory it indicates that over 75% of the scans issued are full table/region scans. Revisiting how the scan is formed might help in faster query performance like setting proper start and stop row, cases where you really need full table/region scan check if there is a possibility of avoiding cache usage for those queries so that other queries that needs to make use of the cache might not evict the blocks that are really hot.

