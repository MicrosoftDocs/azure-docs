---
title: Troubleshoot Apache HBase performance issues on Azure HDInsight
description: Various Apache HBase performance tuning guidelines and tips for getting optimal performance on Azure HDInsight. 
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 09/24/2019
---

# Troubleshoot Apache HBase performance issues on Azure HDInsight

This article describes various Apache HBase performance tuning guidelines and tips for getting optimal performance on Azure HDInsight. Many of these tips depend on the particular workload and read/write/scan pattern. Before you apply configuration changes in a production environment, test them thoroughly.

## HDInsight HBase performance insights

The top bottleneck in most HBase workloads is the Write Ahead Log (WAL). It severely impacts write performance. HDInsight HBase has a separated storage-compute model; that is, data is stored remotely on Azure Storage, but the region servers are hosted on virtual machines. Until recently, the WAL was also written to Azure Storage; in the case of HDInsight, this amplified this bottleneck. The [Accelerated Writes](./apache-hbase-accelerated-writes.md) feature is designed to solve this problem. It writes the WAL to Azure Premium SSD managed disks. This tremendously benefits write performance, and it helps many issues faced by some of the write-intensive workloads.

To gain significant improvement in read operations, use [Premium Block Blob Storage Account](https://azure.microsoft.com/blog/azure-premium-block-blob-storage-is-now-generally-available/) as your remote storage. This option is possible only if the WAL feature is enabled.

## Compaction

Compaction is another potential bottleneck that is fundamentally agreed upon in the community. By default, major compaction is disabled on HDInsight HBase clusters. This is because, considering that it is a resource-intensive process, we want to allow customers full flexibility to schedule it as per their workload characteristics – that is, during off peak hours. Also, considering that our storage is remote (backed by Azure storage) instead of to a local Hadoop Distributed File System (HDFS), which is common on most on-premises instances, data locality isn't a concern – which is one of the primary goals of major compaction.

The assumption is that the customer will take care to schedule the major compaction as per their convenience. If this maintenance isn't performed, compaction will significantly impact read performance in the long run.

For scan operations, mean latencies that are much higher than 100 milliseconds should be a cause for concern. Check if major compaction has been scheduled accurately.

## Know your Apache Phoenix workload

Answering the following questions will help you understand your Apache Phoenix workload better:

* Are all your "reads" translating to scans?
    * If so, what are the characteristics of these scans?
    * Have you optimized your Phoenix table schema for these scans including appropriate indexing?
* Have you used the `EXPLAIN` statement to understand the query plans your "reads" generate?
* Are your writes "upsert-selects"?
    * If so, they would also be doing scans. Expected latency for scans averages approximately 100 milliseconds, compared to 10 milliseconds for point gets in HBase.  

## Test methodology and metrics monitoring

If you are using benchmarks such as Yahoo! Cloud Serving Benchmark, JMeter, or Pherf to test and tune performance, make sure that:

- The client machines do not become a bottleneck (Check CPU usage on client machines).

- Client-side configs – such as number of threads, and so on - are tuned appropriately to saturate client bandwidth.

- Test results are recorded accurately and systematically.

If your queries suddenly started doing much worse than before,  check for potential bugs in your application code. Is it suddenly generating large amounts of invalid data, thus naturally increasing read latencies?

## Migration issues

If you're migrating to Azure HDInsight, make sure your migration is done systematically and accurately, preferably via automation. Avoid manual migration. Make sure that:

- Table attributes are migrated accurately. Attributes can include as compression, bloom filters, and so on.

- The salting settings in Phoenix tables are mapped appropriately to the new cluster size. For example, the number of salt buckets is recommended to be a multiple of the number of worker nodes in cluster, with the specific multiple being a factor of the amount of hot spotting observed.  

## Server-side configuration tunings

In HDInsight HBase, HFiles are stored on remote storage. When there is a cache miss, the cost of reads is higher than on-premises systems because data on on-premises systems is backed by local HDFS, thanks to the network latency involved. For most scenarios, intelligent use of HBase caches (block cache and bucket cache) is designed to circumvent this issue. However, there are occasional cases where this might be a problem for a customer. Using a premium block blob account somewhat helps this problem. However, the Windows Azure Storage Driver (WASB) blob relies on certain properties such as `fs.azure.read.request.size` to fetch data in blocks based on what it determines to be read mode (sequential versus random), so there might continue to be instances of higher latencies with reads. Through empirical experiments, we have found that setting the read request block size (`fs.azure.read.request.size`) to 512 KB and matching the block size of the HBase tables to be the same size produces the best result in practice.

HDInsight HBase, for most large-size nodes clusters, provides `bucketcache` as a file on a local Premium SSD that is attached to the virtual machine, which runs the `regionservers`. Using off-heap cache instead might provide some improvement. This has the limitation of using available memory and potentially being smaller than file-based cache, so this may not always be the best choice.

Following are some of the other specific parameters that we tuned, and that seemed to help to varying degrees:

- Increase `memstore` size from default 128 MB to 256 MB. Typically, this setting is recommended for heavy write scenarios.

- Increase the number of threads that are dedicated for compaction, from the default setting of **1** to **4**. This setting is relevant if we observe frequent minor compactions.

- Avoid blocking `memstore` flush because of store limit. The `Hbase.hstore.blockingStoreFiles` setting can be increased to **100** to provide this buffer.

- For controlling flushes, the default settings can be addressed as follows:

    - `Hbase.regionserver.maxlogs` can be increased from **32** to **140** (avoiding flushes because of WAL limits).

    - `Hbase.regionserver.global.memstore.lowerLimit` = **0.55**.

    - `Hbase.regionserver.global.memstore.upperLimit` = **0.60**.

- Phoenix-specific configurations for thread pool tuning:

    - `Phoenix.query.queuesize` can be increased to **10000**.

    - `Phoenix.query.threadpoolsize` can be increased to **512**.

- Other Phoenix-specific configurations:

    - `Phoenix.rpc.index.handler.count` can be set to **50** if there are large or many index lookups.

    - `Phoenix.stats.updateFrequency` can be increased from the default setting of **15 minutes** to **1 hour**.

    - `Phoenix.coprocessor.maxmetadatacachetimetolivems` can be increased from **30 minutes** to **1 hour**.

    - `Phoenix.coprocessor.maxmetadatacachesize` can be increased from **20 MB** to **50 MB**.

- RPC timeouts – HBase RPC timeout, HBase client scanner timeout, and Phoenix query timeout – can be increased to 3 minutes. Make sure that the `hbase.client.scanner.caching` parameter is set to the same value at both the server end and the client end. If they are not the same, this setting leads to client-end errors that are related to `OutOfOrderScannerException`. This setting should be set to a low value for large scans. We set this value to **100**.

## Other considerations

The following are additional parameters to consider tuning:

- `Hbase.rs.cacheblocksonwrite` – by default on HDI, this setting is set to **true**.

- Settings that allow to defer minor compaction for later.

- Experimental settings, such as adjusting percentages of queues that are reserved for read and write requests.

## Next steps

If your problem remains unresolved, visit one of the following channels for more support:

- Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

- Connect with [@AzureSupport](https://twitter.com/azuresupport). This is the official Microsoft Azure account for improving customer experience. It connects the Azure community to the right resources: answers, support, and experts.

- If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request). Your Microsoft Azure subscription includes access to subscription management and billing support, and technical support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
