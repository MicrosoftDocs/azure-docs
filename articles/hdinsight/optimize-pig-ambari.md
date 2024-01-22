---
title: Optimize Apache Pig with Apache Ambari in Azure HDInsight
description: Use the Apache Ambari web UI to configure and optimize Apache Pig.
ms.service: hdinsight
ms.topic: how-to
ms.date: 01/31/2023
---

# Optimize Apache Pig with Apache Ambari in Azure HDInsight

Apache Ambari is a web interface to manage and monitor HDInsight clusters. For an introduction to Ambari Web UI, see [Manage HDInsight clusters by using the Apache Ambari Web UI](hdinsight-hadoop-manage-ambari.md).

Apache Pig properties can be  modified from the Ambari web UI to tune Pig queries. Modifying Pig properties from Ambari directly modifies the Pig properties in the `/etc/pig/2.4.2.0-258.0/pig.properties` file.

1. To modify Pig properties, navigate to the Pig **Configs** tab, and then expand the **Advanced pig-properties** pane.

1. Find, uncomment, and change the value of the property you wish to modify.

1. Select **Save** on the top-right side of the window to save the new value. Some properties may require a service restart.

    :::image type="content" source="./media/optimize-pig-ambari/advanced-pig-properties.png" alt-text="Advanced Apache pig properties" border="true":::

> [!NOTE]  
> Any session-level settings override property values in the `pig.properties` file.

## Tune execution engine

Two execution engines are available to execute Pig scripts: MapReduce and Tez. Tez is an optimized engine and is much faster than MapReduce.

1. To modify the execution engine, in the **Advanced pig-properties** pane, find the property `exectype`.

1. The default value is **MapReduce**. Change it to **Tez**.

## Enable local mode

Similar to Hive, local mode is used to speed jobs with relatively smaller amounts of data.

1. To enable the local mode, set `pig.auto.local.enabled` to **true**. The default value is false.

1. Jobs with an input data size less than the `pig.auto.local.input.maxbytes` property value are considered to be small jobs. The default value is 1 GB.

## Copy user jar cache

Pig copies the JAR files required by UDFs to a distributed cache  to make them available for task nodes. These jars don't change frequently. If enabled, the `pig.user.cache.enabled` setting allows jars to be placed in a cache to reuse them for jobs run by the same user. This setting results in a minor increase in job performance.

1. To enable, set `pig.user.cache.enabled` to true. The default is false.

1. To set the base path of the cached jars, set `pig.user.cache.location` to the base path. The default is `/tmp`.

## Optimize performance with memory settings

The following memory settings can help optimize Pig script performance.

* `pig.cachedbag.memusage`: The amount of memory given to a bag. A bag is collection of tuples. A tuple is an ordered set of fields, and a field is a piece of data. If the data in a bag is beyond the given memory, it's spilled to disk. The default value is 0.2, which represents 20 percent of available memory. This memory is shared across all bags in an application.

* `pig.spill.size.threshold`: Bags larger than this spill size threshold (in bytes) are  spilled to disk. The default value is 5 MB.

## Compress temporary files

Pig generates temporary files during job execution. Compressing the temporary files results in a performance increase when reading or writing files to disk. The following settings can be used to compress temporary files.

* `pig.tmpfilecompression`: When true, enables temporary file compression. The default value is false.

* `pig.tmpfilecompression.codec`: The compression codec to use for compressing the temporary files. The recommended compression codecs are LZO and Snappy for lower CPU use.

## Enable split combining

When enabled, small files are combined for fewer map tasks. This setting improves the efficiency of jobs with many small files. To enable, set `pig.noSplitCombination` to true. The default value is false.

## Tune mappers

The number of mappers is controlled by modifying the property `pig.maxCombinedSplitSize`. This property specifies the size of the data to be processed by a single map task. The default value is the filesystem's default block size. Increasing this value results in a lower number of mapper tasks.

## Tune reducers

The number of reducers is calculated based on the parameter `pig.exec.reducers.bytes.per.reducer`. The parameter specifies the number of bytes processed per reducer, by default  1 GB. To limit the maximum number of reducers, set the `pig.exec.reducers.max` property, by  default 999.

## Next steps

* [Manage HDInsight clusters with the Apache Ambari web UI](hdinsight-hadoop-manage-ambari.md)
* [Apache Ambari REST API](hdinsight-hadoop-manage-ambari-rest-api.md)
* [Optimize clusters](./hdinsight-changing-configs-via-ambari.md)
* [Optimize Apache HBase](./optimize-hbase-ambari.md)
* [Optimize Apache Hive](./optimize-hive-ambari.md)
