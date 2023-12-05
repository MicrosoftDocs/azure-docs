---
title: Troubleshoot Apache HBase performance issues on Azure HDInsight
description: Various Apache HBase performance tuning guidelines and tips for getting optimal performance on Azure HDInsight. 
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 04/26/2023
---

# Troubleshoot Apache HBase performance issues on Azure HDInsight

This article describes various Apache HBase performance tuning guidelines and tips for getting optimal performance on Azure HDInsight. Many of these tips depend on the particular workload and read/write/scan pattern. Before you apply configuration changes in a production environment, test them thoroughly.

## HBase performance insights

The top bottleneck in most HBase workloads is the Write Ahead Log (WAL). It severely impacts write performance. HDInsight HBase has a separated storage-compute model. Data is stored remotely on Azure Storage, even though virtual machines host the region servers. Until recently, the WAL was also written to Azure Storage. In HDInsight, this behavior amplified this bottleneck. The [Accelerated Writes](./apache-hbase-accelerated-writes.md) feature is designed to solve this problem. It writes the WAL to Azure Premium SSD-managed disks. This tremendously benefits write performance, and it helps many issues faced by some of the write-intensive workloads.

To gain significant improvement in read operations, use [Premium Block Blob Storage Account](https://azure.microsoft.com/blog/azure-premium-block-blob-storage-is-now-generally-available/) as your remote storage. This option is possible only if the WAL feature is enabled.

## Compaction

Compaction is another potential bottleneck that is fundamentally agreed upon in the community. By default, major compaction is disabled on HDInsight HBase clusters. Compaction is disabled because, even though it is a resource-intensive process, customers have full flexibility to schedule it according to their workloads. For example, they might schedule it during off-peak hours. Also, data locality isn't a concern because our storage is remote (backed by Azure Storage) instead of to a local Hadoop Distributed File System (HDFS).

Customers should schedule major compaction at their convenience. If they don't do this maintenance, compaction will adversely affect read performance in the long run.

For scan operations, mean latencies that are much higher than 100 milliseconds should be a cause for concern. Check if major compaction has been scheduled accurately.

## Apache Phoenix workload

Answering the following questions will help you understand your Apache Phoenix workload better:

* Are all your "reads" translating to scans?
    * If so, what are the characteristics of these scans?
    * Have you optimized your Phoenix table schema for these scans including appropriate indexing?
* Have you used the `EXPLAIN` statement to understand the query plans your "reads" generate?
* Are your writes "upsert-selects"?
    * If so, they would also be doing scans. Expected latency for scans averages approximately 100 milliseconds, compared to 10 milliseconds for point gets in HBase.  

## Test methodology and metrics monitoring

If you're using benchmarks such as Yahoo! Cloud Serving Benchmark, JMeter, or Pherf to test and tune performance, make sure that:

- The client machines don't become a bottleneck. To do this, check the CPU usage on client machines.

- Client-side configurations, like the number of threads, are tuned appropriately to saturate client bandwidth.

- Test results are recorded accurately and systematically.

If your queries suddenly started doing much worse than before,  check for potential bugs in your application code. Is it suddenly generating large amounts of invalid data? If it is, it can increase read latencies.

## Migration issues

If you're migrating to Azure HDInsight, make sure your migration is done systematically and accurately, preferably via automation. Avoid manual migration. Make sure that:

- Table attributes are migrated accurately. Attributes can include as compression, bloom filters, and so on.

- The salting settings in Phoenix tables are mapped appropriately to the new cluster size. For example, the number of salt buckets should be a multiple of the number of worker nodes in the cluster. And you should use a multiple that is a factor of the amount of hot spotting.

## Server-side configuration tunings

In HDInsight HBase, HFiles are stored on remote storage. When there's a cache miss, the cost of reads is higher than on-premises systems because data on on-premises systems is backed by local HDFS. For most scenarios, intelligent use of HBase caches (block cache and bucket cache) is designed to circumvent this issue. In cases where the issue isn't circumvented, using a premium block blob account may help this problem. The Windows Azure Storage Blob driver relies on certain properties such as `fs.azure.read.request.size` to fetch data in blocks based on what it determines to be read mode (sequential versus random), so there might continue to be instances of higher latencies with reads. Through empirical experiments, we have found that setting the read request block size (`fs.azure.read.request.size`) to 512 KB and matching the block size of the HBase tables to be the same size produces the best result in practice.

For most large-size nodes clusters, HDInsight HBase provides `bucketcache` as a file on a local Premium SSD that's attached to the virtual machine, which runs `regionservers`. Using off-heap cache instead might provide some improvement. This workaround has the limitation of using available memory and potentially being smaller than file-based cache, so it may not always be the best choice.

Following are some of the other specific parameters that we tuned, and that seemed to help to varying degrees:

- Increase `memstore` size from default 128 MB to 256 MB. Typically, this setting is recommended for heavy write scenarios.

- Increase the number of threads that are dedicated for compaction, from the default setting of **1** to **4**. This setting is relevant if we observe frequent minor compactions.

- Avoid blocking `memstore` flush because of store limit. To provide this buffer, increase the `Hbase.hstore.blockingStoreFiles` setting to **100**.

- To control flushes, use the following settings:

    - `Hbase.regionserver.maxlogs`: **140** (avoids flushes because of WAL limits)

    - `Hbase.regionserver.global.memstore.lowerLimit`: **0.55**

    - `Hbase.regionserver.global.memstore.upperLimit`: **0.60**

- Phoenix-specific configurations for thread pool tuning:

    - `Phoenix.query.queuesize`: **10000**

    - `Phoenix.query.threadpoolsize`: **512**

- Other Phoenix-specific configurations:

    - `Phoenix.rpc.index.handler.count`: **50** (if there are large or many index lookups)

    - `Phoenix.stats.updateFrequency`: **1 hour**

    - `Phoenix.coprocessor.maxmetadatacachetimetolivems`: **1 hour**

    - `Phoenix.coprocessor.maxmetadatacachesize`: **50 MB**

- RPC timeouts: **3 minutes**

   - RPC timeouts include HBase RPC timeout, HBase client scanner timeout, and Phoenix query timeout. 
   - Make sure that the `hbase.client.scanner.caching` parameter is set to the same value at both the server end and the client end. If they aren't the same, this setting leads to client-end errors that are related to `OutOfOrderScannerException`. This setting should be set to a low value for large scans. We set this value to **100**.

## Other considerations

The following are additional parameters to consider tuning:

- `Hbase.rs.cacheblocksonwrite` – by default on HDI, this setting is set to **true**.

- Settings that allow to defer minor compaction for later.

- Experimental settings, such as adjusting percentages of queues that are reserved for read and write requests.

## Next steps

If your problem remains unresolved, visit one of the following channels for more support:

- Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

- Connect with [@AzureSupport](https://twitter.com/azuresupport). This is the official Microsoft Azure account for improving customer experience. It connects the Azure community to the right resources: answers, support, and experts.

- If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md). Your Microsoft Azure subscription includes access to subscription management and billing support, and technical support is provided through one of the [Azure support plans](https://azure.microsoft.com/support/plans/).
