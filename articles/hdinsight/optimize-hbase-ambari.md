---
title: Optimize Apache HBase with Apache Ambari in Azure HDInsight
description: Use the Apache Ambari web UI to configure and optimize Apache HBase.
ms.service: hdinsight
ms.topic: how-to
ms.date: 10/16/2023
---

# Optimize Apache HBase with Apache Ambari in Azure HDInsight

Apache Ambari is a web interface to manage and monitor HDInsight clusters. For an introduction to Ambari Web UI, see [Manage HDInsight clusters by using the Apache Ambari Web UI](hdinsight-hadoop-manage-ambari.md).

Apache HBase configuration is modified from the **HBase Configs** tab. The following sections describe  some of the important configuration settings that affect HBase performance.

## Set HBASE_HEAPSIZE

> [!NOTE]
> This article contains references to the term *master*, a term that Microsoft no longer uses. When the term is removed from the software, we'll remove it from this article.

The HBase heap size specifies the maximum amount of heap to be used in megabytes by *region* and *master* servers. The default value is 1,000 MB. This value should be tuned for the cluster workload.

1. To modify, navigate to the **Advanced HBase-env** pane in the HBase **Configs** tab, and then find the `HBASE_HEAPSIZE` setting.

1. Change the default value to 5,000 MB.

    :::image type="content" source="./media/optimize-hbase-ambari/ambari-hbase-heapsize.png" alt-text="`Apache Ambari HBase memory heapsize`" border="true":::

## Optimize read-heavy workloads

The following configurations are important to improve the performance of read-heavy workloads.

### Block cache size

The block cache is the read cache. The `hfile.block.cache.size` parameter controls block cache size. The default value is 0.4, which is 40 percent of the total region server memory. Larger the block cache size, faster will be random reads.

1. To modify this parameter, navigate to the **Settings** tab in the HBase **Configs** tab, and then locate **% of RegionServer Allocated to Read Buffers**.

    :::image type="content" source="./media/optimize-hbase-ambari/hbase-block-cache-size.png" alt-text="Apache HBase memory block cache size" border="true":::

1. To change the value, select the **Edit** icon.

### Memstore size

All edits are stored in the memory buffer, called a *Memstore*. This buffer increases the total amount of data that can be written to disk in a single operation. It also speeds access to the recent edits. The Memstore size defines the following two parameters:

* `hbase.regionserver.global.memstore.UpperLimit`: Defines the maximum percentage of the region server that Memstore combined can use.

* `hbase.regionserver.global.memstore.LowerLimit`: Defines the minimum percentage of the region server that Memstore combined can use.

To optimize for random reads, you can reduce the Memstore upper and lower limits.

### Number of rows fetched when scanning from disk

The `hbase.client.scanner.caching` setting defines the number of rows read from disk when the `next` method is called on a scanner.  The default value is 100. The higher the number, the fewer the remote calls made from the client to the region server, resulting in faster scans. However, this setting increase memory pressure on the client.

:::image type="content" source="./media/optimize-hbase-ambari/hbase-num-rows-fetched.png" alt-text="Apache HBase number of rows fetched" border="true":::

> [!IMPORTANT]  
> Do not set the value such that the time between invocation of the next method on a scanner is greater than the scanner timeout. The scanner timeout duration is defined by the `hbase.regionserver.lease.period` property.

## Optimize write-heavy workloads

The following configurations are important to improve the performance of write-heavy workloads.

### Maximum region file size

HBase stores data in an internal file format, called `HFile`. The property `hbase.hregion.max.filesize` defines the size of a single `HFile` for a region.  A region is split into two regions if the sum of all `HFiles` in a region is greater than this setting.

:::image type="content" source="./media/optimize-hbase-ambari/hbase-hregion-max-filesize.png" alt-text="`Apache HBase HRegion max filesize`" border="true":::

The larger the region file size, the smaller the number of splits. You can increase the file size  to determine a value that results in the maximum write performance.

### Avoid update blocking

* The property `hbase.hregion.memstore.flush.size` defines the size at which Memstore is flushed to disk. The default size is 128 MB.

* The `hbase.hregion.memstore.block.multiplier` defines the HBase region block multiplier. The default value is 4. The maximum allowed is 8.

* HBase blocks updates if the Memstore is (`hbase.hregion.memstore.flush.size` * `hbase.hregion.memstore.block.multiplier`) bytes.

    With the default values of flush size and block multiplier, updates are blocked when Memstore is  128 * 4 = 512 MB in size. To reduce the update blocking count, increase the value of `hbase.hregion.memstore.block.multiplier`.

:::image type="content" source="./media/optimize-hbase-ambari/hbase-hregion-memstore-block-multiplier.png" alt-text="Apache HBase Region Block Multiplier" border="true":::

## Define Memstore size

The `hbase.regionserver.global.memstore.upperLimit` and `hbase.regionserver.global.memstore.lowerLimit` parameters defines Memstore size. Setting these values equal to each other reduces pauses during writes (also causing more frequent flushing) and results in increased write performance.

## Set Memstore local allocation buffer

The property `hbase.hregion.memstore.mslab.enabled` defines Memstore local allocation buffer usage. When enabled (true), this setting prevents heap fragmentation during heavy write operation. The default value is true.

:::image type="content" source="./media/optimize-hbase-ambari/hbase-hregion-memstore-mslab-enabled.png" alt-text="hbase.hregion.memstore.mslab.enabled" border="true":::

## Next steps

* [Manage HDInsight clusters with the Apache Ambari web UI](hdinsight-hadoop-manage-ambari.md)
* [Apache Ambari REST API](hdinsight-hadoop-manage-ambari-rest-api.md)
* [Optimize clusters](./hdinsight-changing-configs-via-ambari.md)
* [Optimize Apache Hive](./optimize-hive-ambari.md)
* [Optimize Apache Pig](./optimize-pig-ambari.md)
