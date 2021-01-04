---
title: Azure HDInsight Apache HBase Cluster/Query Advisor
description: Optimize Apache HBase for recommendations found by cluster advisor in Azure HDInsight.
author: hrasheed-msft
ms.author: ramvasu
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 01/03/2021
#Customer intent: The azure advisories help to tune the cluster/query. This doc gives a much deeper understanding of the various advisories including the recommended configuration tunings.
---

# Apache HBase advisories in Azure HDInsight

This article describes several advisories that help you optimize Apache HBase performance in Azure HDInsight. 

## Optimize HBase to read most recently written data

When you use Apache HBase in Azure HDInsight, you can optimize the configuration of HBase for the scenario where your application reads the most recently written data. For high performance, it's optimial that HBase reads are to be served from memstore, instead of the remote storage.

The query advisory indicates that for a given column family in a table has > 75% reads that are getting served from memstore. This suggests that even if a flush happens on the memstore the recent file needs to be accessed and that needs to be in cache. To explain this further, the data is first written to memstore the system accesses the recent data there. There is a chance that the internal HBase flusher threads detect that a given region has reached 128M (default) size and can trigger a flush. This can happen to even the most recent data that was written when the memstore was around 128M in size. Therefore,  a subsequent read of those recent records may require a file read rather than from memstore. Hence it is best to optimize that even recent data that is recently flushed can reside in the cache.

To optimize the recent data in cache, consider the following configuration settings:

1. Set `hbase.rs.cacheblocksonwrite` to `true`. This default configuration in HDInsight HBase is `true`, so ensure this not reset to `false`.

2. Increase the `hbase.hstore.compactionThreshold` value so that you can avoid the compaction from kicking in. By default this is `3`. You can increase it to a higher value like `10`.

3. If you follow step 2 and set compactionThreshold) then change `hbase.hstore.compaction.max` to a higher value for example `100`, and also increase the value for the config `hbase.hstore.blockingStoreFiles` to higher value for example `300`.

4. If you are sure that you are interested only in the recent data, set `hbase.rs.cachecompactedblocksonwrite` configuration to **ON**. This tells the system that even if compaction happens, the data stays in cache. The configurations can be set at the family level also. 

   In the HBase Shell, run the following command:
   
   ```
   alter '<TableName>', {NAME => '<FamilyName>', CONFIGURATION => {'hbase.hstore.blockingStoreFiles' => '300'}}
   ```

5. Block cache can be turned off for a given family in a table. Ensure that it is turned **ON** for families that have most recent data reads. By default, block cache is turned ON for all families in a table. In case you have disabled the block cache for a family and need to turn it ON, use the alter command from the hbase shell.

These configurations help ensure that the data is in cache and that the recent data does not undergo compaction. If a TTL is possible in your usecase then mind considering Date tiered compaction. For more details on what Date Tiered compaction is, see [Apache HBase Reference Guide: Date Tiered Compaction](https://hbase.apache.org/book.html#ops.date.tiered)  

## Optimize the Flush queue

The Optimize the Flush queue advisory may indicate that HBase flushes may need tuning. The flush handlers might not be high enough as configured.

In the region server UI, notice if the flush queue grows beyond 100. This indicates the flushes are slow and you may have to tune the   `hbase.hstore.flusher.count` configuration. By default, the value is 2. Ensure that the max flusher threads do not increase beyond 6.

In addition, see if you have a recommendation for region count tuning. If so first try the region tuning to see if that helps in faster flushes. Tuning the flusher threads might help in multiple ways like 

## Region count tuning

The region count tuning advisory indicates that HBase has blocked updates, and the region count may be more than the optimally supported heap size. You can tune the heap size, memstore size, and the region count.

As an example scenario:

- Assume the heap size for the region server is 10GB. By default the `hbase.hregion.memstore.flush.size` is `128M`. The default value for `hbase.regionserver.global.memstore.size` is `0.4`. Which means that out of 10G, `4G` is allocated for memstore (globally).

- Assume there is an even distribution of the write load on all the regions and assuming every region grows upto 128M only then the max number of regions in this setup is `32` regions. If a given region server is configured to have 32 regions then we won't end up seeing blocked updates.

- With these settings in place, the number of regions is 100. The 4G global memstore is now splitted across 100 regions. So effectively each region gets only 40MB for memstore. When the writes are uniform this will result in frequent flushes and smaller size of the order < 40M. Having numerous flusher threads might increase the flush speed `hbase.hstore.flusher.count`.

The advisory means that it would be good to reconsider the number of regions per server, the heap size, and the global memstore size configuration along with the flush threads tuning so that such updates getting blocked can be avoided.

## Compaction queue tuning

If the HBase compaction queue grows to more than 2000 and happens periodically, this suggests that you can increase the compaction threads to a larger value.

When there are more number of files for compaction, it may lead to more heap usage related to how the files interact with the Azure file system. So it is better to complete the compaction as quickly as possible. Some times in older clusters the compaction configurations related to throttling might lead to slower compaction rate.

Check the configurations `hbase.hstore.compaction.throughput.lower.bound` and `hbase.hstore.compaction.throughput.higher.bound`. If they are already set to 50M and 100M, leave them as it is. However, if you configured those to a lower value (which was the case with older clusters), change the limits to 50M and 100M respectively.

The configurations are `hbase.regionserver.thread.compaction.small` and `hbase.regionserver.thread.compaction.large` (the defaults are 1 each).
Cap the max value for this configuration to be less than 3.

## Full table scan

The full table scan advisory indicates that over 75% of the scans issued are full table/region scans. You can revisit the way your code calls the scans to improve query performance. Consider the following practices:

1. Set the proper start and stop row for each scan.

2. Use the **MultiRowRangeFilter** API so that you can query different ranges in one scan call. For more information, see [MultiRowRangeFilter API documentation](https://hbase.apache.org/2.1/apidocs/org/apache/hadoop/hbase/filter/MultiRowRangeFilter.html).

3. In cases where you need a full table or region scan, check if there is a possibility to avoid cache usage for those queries, so that other queries that use of the cache might not evict the blocks that are hot.

   To ensure the scans do not use cache, use the **scan** API with the **setCaching(false)** option in your code: 

   ```
   scan#setCaching(false)
   ```
   
## Next steps

[Optimize Apache HBase using Ambari](optimize-hbase-ambari.md)
