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

# Reading most recent data
If your use case reads the most recent data, there are high chances that the reads are to be served from memstore, instead of the remote storage. The query advisory indicates that for a given column family in a table has > 75% reads that are getting served from memstore. This suggests that even if a flush happens on the memstore the recent file needs to be accessed and that needs to be in cache. To understand this even better, though the data is first written to memstore and we keep accessing the recent data, there is a chance that the flusher threads might that a given region has reached 128M (default) size and might trigger a flush. This specifically happens to the most recent data that was written when the memstore was around 128M in size. Such records might end up being a file read rather than from memstore. Hence it is better to ensure that even those data that are recently flushed can reside in the cache.

Ensure that the following configs are tuned
1.  Set `hbase.rs.cacheblocksonwrite` to `true`  - This is by default true in HDInsight HBase. Ensure this not reset.
2.  Increase the `hbase.hstore.compactionThreshold` value so that you can avoid the compaction from kicking in. By default this is `3`. You can increase it to a higher value like `10`.
3. If you are doing #2 then change `hbase.hstore.compaction.max` to a higher value for eg `100` and also increase the value for the config `hbase.hstore.blockingStoreFiles` to higher value for eg `300`.
4. If you are sure that you are interested only in the recent data then turn ON `hbase.rs.cachecompactedblocksonwrite` configuration so that even if compaction happens then we are sure that the data is in cache. These configs can be set at the family level also. In the hbase shell
  ```
   alter '<TableName>', {NAME => '<FamilyName>', CONFIGURATION => {'hbase.hstore.blockingStoreFiles' => '300'}}
  ```
5. Block cache can be turned off for a given family in a table. Ensure that it is turned ON for families that have most recent data reads. By default, block cache is turned ON for all families in a table. In case you have disabled the block cache for a family and need to turn it ON then use the alter command from the hbase shell.


The above configurations helps to ensure that as far as possible the data is in cache and that the recent data does not undergo compaction. If a TTL is possible in your usecase then mind considering Date tiered compaction. For more details on what is Date Tiered compaction check the below link,
  ```
   https://hbase.apache.org/book.html#ops.date.tiered
  ```

# Flush queue tuning
The advisory may indicate that your flushes may need tuning. The flush handlers might not be enough.

In the region server UI keep an eye on the flush queue and if it grows beyond 100 then it means that the flushes are slower and you may have to tune the  configuration  `hbase.hstore.flusher.count`. By default the value is 2. Ensure that the max flusher threads do not increase beyond 6.
Also see if you have a recommendation for region count tuning. If so first try the region tuning to see if that helps in faster flushes. Tuning the flusher threads might help in multiple ways like 

# Region count tuning
The most prominent reason why you have blocked updates is that the region count might be more than the optimally supported heap size. Generally how to tune the heap size, memstore size and the region count? Let's see with an example

Assume the heap size for the region server is 10GB. By default the `hbase.hregion.memstore.flush.size` is `128M`. The default value for `hbase.regionserver.global.memstore.size` is `0.4`. Which means that out of 10G, `4G` is allocated for memstore (globally).

Assuming there is an even distribution of the write load on all the regions and assuming every region grows upto 128M only then the max number of regions in this setup is `32` regions. If a given region server is configured to have 32 regions then we won't end up seeing blocked updates.

With above settings in place and the number of regions is 100. The 4G global memstore is now splitted across 100 regions. So effectively each region gets only 40MB for memstore. When the writes are uniform this will result in frequent flushes and smaller size of the order < 40M. Having more flusher threads might increase the flush speed `hbase.hstore.flusher.count`.
The advisory here means that it would be good to revisit the number of regions per server, the heap size and the global memstore size configuration along with the flush threads tuning so that such updates getting blocked can be avoided.

# Compaction queue tuning
The compaction queue grows to more than 2000 and this seems to happen periodically. This suggests that you can increase the compaction threads to a bigger value.
If there are more number of files for compaction, it may lead to more heap usage related to how the files interact with the Azure file system. So it is better to complete the compaction as quickly as possible.
Some times in older clusters the compaction configurations related to throttling might lead to slower compaction rate. Check the configurations
`hbase.hstore.compaction.throughput.lower.bound` and `hbase.hstore.compaction.throughput.higher.bound`. If they are already set to 50M and 100M, leave them as it is - if you find them having a lower value (which was the case with older clusters) please change the limits to 50M and 100M respectively.
The configurations are `hbase.regionserver.thread.compaction.small` and `hbase.regionserver.thread.compaction.large` (the defaults are 1 each).
Cap the max value for this configuration to be less than 3.


# Full table scan
If you have happen to see this advisory it indicates that over 75% of the scans issued are full table/region scans. Revisiting how the scan is formed might help in faster query performance like 
1. Setting proper start and stop row
2. Trying using a MultiRowRangeFilter so that you can query different ranges in one scan call.
   ```
   https://hbase.apache.org/2.1/apidocs/org/apache/hadoop/hbase/filter/MultiRowRangeFilter.html
   ```
3. Cases where you really need full table/region scan check if there is a possibility of avoiding cache usage for those queries so that other queries that needs to make use of the cache might not evict the blocks that are really hot.
For ensuring the scans do not use cache use the below API while creating your scans,
  ```
    scan#setCaching(false)
  ```