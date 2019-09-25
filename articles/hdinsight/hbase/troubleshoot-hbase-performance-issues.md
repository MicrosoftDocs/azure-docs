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

This document describes various Apache HBase performance tuning guidelines and tips for getting optimal performance on Azure HDInsight. Many of these tips depend on the particular workload and read/write/scan pattern. Test configuration changes thoroughly before applying on a production environment.

## HDInsight HBase performance insights

The top bottleneck in most HBase workloads is the Write Ahead Log (WAL). It severely impacts write performance. HDInsight HBase has a separated storage-compute model – that is, data is stored remotely on Azure Storage but the region servers are hosted on the VMs. Until recently, the Write Ahead Log was also written to Azure Storage thus amplifying this bottleneck in the case of HDInsight. The [Accelerated Writes](./apache-hbase-accelerated-writes.md) feature is designed to solve this problem, by writing the Write Ahead Log to Azure premium SSD managed disks. This benefits write performance tremendously, and helps many issues faced by some of the write-intensive workloads.

Use [Premium Block Blob Storage Account](https://azure.microsoft.com/blog/azure-premium-block-blob-storage-is-now-generally-available/) as your remote storage to gain significant improvement in read operations. This option is possible only if Write Ahead Logs feature is enabled.

## Compaction

Compaction is another potential bottleneck fundamentally agreed upon in the community.  By default major compaction is disabled on HDInsight HBase clusters. This is because given that it is a resource-intensive process, we want to allow customers full flexibility to schedule it as per their workload characteristics – that is, during off peak hours. Also given our storage is remote (backed by Azure storage) as opposed to local HDFS, which is common on most on-prem instances, data locality is not a concern – which is one of the primary goals of major compaction.

The assumption is that the customer will take care to schedule the major compaction as per their convenience. If this maintenance is not done, compaction will significantly impact read performance in the long run.

For scan operations in particular, mean latencies much higher than 100 ms should be a cause for concern. Check if major compaction has been scheduled accurately.

## Know your Apache Phoenix workload

Answering the following questions will help you understand your Apache Phoenix workload better:

* Are all your "reads" translating to scans?
    * If so, what are the characteristics of these scans?
    * Have you optimized your phoenix table schema for these scans including appropriate indexing?
* Have you used the `EXPLAIN` statement to understand the query plans your "reads" generate.
* Are your writes "upsert-selects"?
    * If so, they would also be doing scans. Expected latency for scans is of the order of 100 ms on average, as opposed to 10 ms for point gets in HBase.  

## Test Methodology and Metrics Monitoring

If you are using benchmarks such as YCSB, JMeter or Pherf to test and tune perf, ensure the following:

1. The client machines do not become a bottleneck (Check CPU usage on client machines).

1. Client-side configs – such as number of threads, and so on, are tuned appropriately to saturate client bandwidth.

1. Test results are recorded accurately and systematically.

If your queries suddenly started doing much worse than before – check for potential bugs in your application code – is it suddenly generating large amounts of invalid data, thus naturally increasing read latencies?

## Migration Issues

If migrating to Azure HDInsight, make sure your migration is done systematically and accurately, preferably via automation. Avoid manual migration. Ensure the following:

1. Table attributes– such as compression, bloom filters, and so on, should be migrated accurately.

1. For Phoenix tables, the salting settings should be mapped appropriately to the new cluster size. For instance, number of salt buckets is recommended to be multiple of the number of worker nodes in cluster – the specific multiple being a factor of the amount of hot spotting observed.  

## Server-Side Config Tunings

In HDInsight HBase, HFiles are stored on remote storage – thus when there is a cache miss the cost of reads will definitely be higher than on-prem systems, which have data backed by local HDFS thanks to the network latency involved. For most scenarios, intelligent use of HBase caches (Block cache and bucket cache) is designed to circumvent this issue. However there will remain occasional cases where this might be a problem for customer. Using premium block blob account has helped this somewhat. However with the WASB (Windows Azure Storage Driver) blob relying on certain properties such as `fs.azure.read.request.size` to fetch data in blocks based on what it determines to be read mode (sequential vs random) we might continue to see instances of higher latencies with reads. We have found through empirical experiments that setting the read request block size (`fs.azure.read.request.size`) to 512 KB and matching the block size of the HBase tables to be the same gives the best result in practice.

HDInsight HBase, for most large sized nodes clusters, provides `bucketcache` as a file on local SSD attached to the VM, which runs the `regionservers`. At times, using off heap cache instead can give some improvement. This has the limitation of using available memory and being potentially of smaller size than file-based cache so this may not always obviously be the best choice.

Some of the other specific parameters we tuned that seemed to have helped to varying degrees with some rationale as below:

1. Increase `memstore` size from default 128 MB to 256 MB – this setting is typically recommended for heavy write scenario.

1. Increasing the number of threads dedicated for compaction – from the default of 1 to 4. This setting is relevant if we observe frequent minor compactions.

1. Avoid blocking `memstore` flush because of store limit. `Hbase.hstore.blockingStoreFiles` can be increased to 100 to provide this buffer.

1. For controlling flushes the defaults can be addressed as below:

    1. `Hbase.regionserver.maxlogs` can be upped to 140 from 32 (avoiding flushes because of WAL limits).

    1. `Hbase.regionserver.global.memstore.lowerLimit` = 0.55.

    1. `Hbase.regionserver.global.memstore.upperLimit` = 0.60.

1. Phoenix-specific configs for thread pool tuning:

    1. `Phoenix.query.queuesize` can be increased to 10000.

    1. `Phoenix.query.threadpoolsize` can be increased to 512.

1. Other phoenix-specific configs:

    1. `Phoenix.rpc.index.handler.count` can be set to 50 if we have large or many index lookups.

    1. `Phoenix.stats.updateFrequency` – can be upped to 1 hour from default of 15 minutes.

    1. `Phoenix.coprocessor.maxmetadatacachetimetolivems` – can be upped to 1 hour from 30 minutes.

    1. `Phoenix.coprocessor.maxmetadatacachesize` – can be upped to 50 MB from 20 MB.

1. RPC timeouts – HBase rpc timeout, HBase client scanner timeout, and Phoenix query timeout can be increased to 3 minutes. It is important here to note that the `hbase.client.scanner.caching` parameter is set to a value that matches at server end and client end. Otherwise this setting leads to errors related to `OutOfOrderScannerException` at the client end. This setting should be set to a low value for large scans. We set this value to 100.

## Other considerations

Some other parameters to be considered for tuning:

1. `Hbase.rs.cacheblocksonwrite` – this setting is set to true by default on HDI.

1. Settings that allow to defer minor compaction for later.

1. Experimental settings such as adjusting percentages of queues reserved for read and write requests.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

- Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

- Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

- If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
