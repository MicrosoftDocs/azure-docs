---
title: Optimize for cluster advisor recommendations
titleSuffix: Azure HDInsight
description: Optimize Apache HBase for cluster advisor recommendations in Azure HDInsight.
author: yeturis
ms.author: sairamyeturi
ms.service: hdinsight
ms.topic: conceptual
ms.date: 09/15/2023
#Customer intent: The azure advisories help to tune the cluster/query. This doc gives a much deeper understanding of the various advisories including the recommended configuration tunings.
---
# Apache HBase advisories in Azure HDInsight

This article describes several advisories to help you optimize the Apache HBase performance in Azure HDInsight. 

## Optimize HBase to read most recently written data

If your use case involves reading the most recently written data from HBase, this advisory can help you. For high performance, it is optimal that HBase reads are to be served from `memstore`, instead of the remote storage.

The query advisory indicates that for a given column family in a table > 75% reads that are getting served from `memstore`. This indicator suggests that even if a flush happens on the `memstore` the recent file needs to be accessed and that needs to be in cache. The data is first written to `memstore` the system accesses the recent data there. There's a chance that the internal HBase flusher threads detect that a given region has reached 128M (default) size and can trigger a flush. This scenario happens to even the most recent data that was written when the `memstore` was around 128M in size. Therefore, a later read of those recent records may require a file read rather than from `memstore`. Hence it is best to optimize that even recent data that is recently flushed can reside in the cache.

To optimize the recent data in cache, consider the following configuration settings:

1. Set `hbase.rs.cacheblocksonwrite` to `true`. This default configuration in HDInsight HBase is `true`, so check that is it not reset to `false`.

2. Increase the `hbase.hstore.compactionThreshold` value so that you can avoid the compaction from kicking in. By default this value is `3`. You can increase it to a higher value like `10`.

3. If you follow step 2 and set compactionThreshold, then change `hbase.hstore.compaction.max` to a higher value for example `100`, and also increase the value for the config `hbase.hstore.blockingStoreFiles` to higher value for example `300`.

4. If you're sure that you need to read only the recent data, set `hbase.rs.cachecompactedblocksonwrite` configuration to **ON**. This configuration tells the system that even if compaction happens, the data stays in cache. The configurations can be set at the family level also. 

   In the HBase Shell, run the following command to set `hbase.rs.cachecompactedblocksonwrite` config:
   
   ```
   alter '<TableName>', {NAME => '<FamilyName>', CONFIGURATION => {'hbase.hstore.blockingStoreFiles' => '300'}}
   ```

5. Block cache can be turned off for a given family in a table. Ensure that it's turned **ON** for families that have most recent data reads. By default, block cache is turned ON for all families in a table. In case you have disabled the block cache for a family and need to turn it ON, use the alter command from the hbase shell.

   These configurations help ensure that the data is available in cache and that the recent data does not undergo compaction. If a TTL is possible in your scenario, then consider using date-tiered compaction. For more information, see [Apache HBase Reference Guide: Date Tiered Compaction](https://hbase.apache.org/book.html#ops.date.tiered)  

## Optimize the flush queue

This advisory indicates that HBase flushes may need tuning. The current configuration for flush handlers may not be high enough to handle with write traffic that may lead to slow down of flushes.

In the region server UI, notice if the flush queue grows beyond 100. This threshold indicates the flushes are slow and you may have to tune the   `hbase.hstore.flusher.count` configuration. By default, the value is 2. Ensure that the max flusher threads don't increase beyond 6.

Additionally, see if you have a recommendation for region count tuning. If yes, we suggest you to try the region tuning to see if that helps in faster flushes. Otherwise, tuning the flusher threads may help you.

## Region count tuning

The region count tuning advisory indicates that HBase has blocked updates, and the region count may be more than the optimally supported heap size. You can tune the heap size, `memstore` size, and the region count.

As an example scenario:

- Assume the heap size for the region server is 10 GB. By default the `hbase.hregion.memstore.flush.size` is `128M`. The default value for `hbase.regionserver.global.memstore.size` is `0.4`. Which means that out of the 10 GB, 4 GB is allocated for `memstore` (globally).

- Assume there's an even distribution of the write load on all the regions and assuming every region grows upto 128 MB only then the max number of regions in this setup is `32` regions. If a given region server is configured to have 32 regions, the system better avoids blocking updates.

- With these settings in place, the number of regions is 100. The 4-GB global `memstore` is now split across 100 regions. So effectively each region gets only 40 MB for `memstore`. When the writes are uniform, the system does frequent flushes and smaller size of the order < 40 MB. Having many flusher threads might increase the flush speed `hbase.hstore.flusher.count`.

The advisory means that it would be good to reconsider the number of regions per server, the heap size, and the global `memstore` size configuration along with the tuning of flush threads to avoid updates getting blocked.

## Compaction queue tuning

If the HBase compaction queue grows to more than 2000 and happens periodically, you can increase the compaction threads to a larger value.

When there's an excessive number of files for compaction, it may lead to more heap usage related to how the files interact with the Azure file system. So it is better to complete the compaction as quickly as possible. Some times in older clusters the compaction configurations related to throttling might lead to slower compaction rate.

Check the configurations `hbase.hstore.compaction.throughput.lower.bound` and `hbase.hstore.compaction.throughput.higher.bound`. If they are already set to 50M and 100M, leave them as it is. However, if you configured those settings to a lower value (which was the case with older clusters), change the limits to 50M and 100M respectively.

The configurations are `hbase.regionserver.thread.compaction.small` and `hbase.regionserver.thread.compaction.large` (the defaults are 1 each).
Cap the max value for this configuration to be less than 3.

## Full table scan

The full table scan advisory indicates that over 75% of the scans issued are full table/region scans. You can revisit the way your code calls the scans to improve query performance. Consider the following practices:

* Set the proper start and stop row for each scan.

* Use the **MultiRowRangeFilter** API so that you can query different ranges in one scan call. For more information, see [MultiRowRangeFilter API documentation](https://hbase.apache.org/2.1/apidocs/org/apache/hadoop/hbase/filter/MultiRowRangeFilter.html).

* In cases where you need a full table or region scan, check if there's a possibility to avoid cache usage for those queries, so that other queries that use of the cache might not evict the blocks that are hot. To ensure the scans do not use cache, use the **scan** API with the **setCaching(false)** option in your code: 

   ```
   scan#setCaching(false)
   ```
   
## Next steps

[Optimize Apache HBase using Ambari](../optimize-hbase-ambari.md)
