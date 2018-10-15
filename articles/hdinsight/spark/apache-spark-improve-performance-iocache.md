---
title: Improve Performance of Apache Spark workloads using Azure HDInsight IO Cache
description: Learn about Azure HDInsight IO Cache and how to use it to improve Apache Spark performance.
services: hdinsight
ms.service: hdinsight
author: hrasheed-msft
ms.author: hrasheed
ms.topic: conceptual
ms.date: 10/15/2018
---
# Improve Performance of Apache Spark workloads using Azure HDInsight IO Cache

IO Cache is a new data caching service for Azure HDInsight that improves the performance of Apache Spark jobs. IO Cache uses an open-source caching component called RubiX. RubiX is a local disk cache for use with big data analytics engines that access data from cloud storage systems. RubiX is unique among caching systems, because it uses Solid-State Drives (SSDs) rather than reserve operating memory for caching purposes. The IO Cache service launches and manages RubiX Metadata Servers on each worker node of the cluster. It also configures all services of the cluster for transparent use of RubiX cache.

Most SSDs provide more than 1 GByte per second of bandwidth. This bandwidth, complemented by the operating system in-memory file cache, provides enough bandwidth to load big data compute processing engines, such as Apache Spark. The operating memory is left available for Apache Spark to process heavily memory-dependent tasks, such as shuffles. Having exclusive use of operating memory allows Apache Spark to achieve optimal resource usage.  

# Customer benefits

Caching provides a performance increase for jobs that read data from remote cloud storage.

You don't have to make any changes to your Spark jobs to see performance increases when using IO Cache. When IO Cache is disabled, this Spark code would read data remotely from Azure Blob Storage: spark.read.load(‘wasbs:///myfolder/data.parquet’).count(). When IO Cache is activated, the same line of code causes a cached read through IO Cache. On following reads, the data is read locally from SSD. Worker nodes on HDInsight cluster are equipped with locally attached, dedicated SSD drives. HDInsight IO Cache uses these local SSDs for caching, which provides lowest level of latency and maximizes bandwidth.

# Getting started

Azure HDInsight IO Cache is available on Azure HDInsight 3.6+ Spark clusters, which run Apache Spark 2.3. IO Cache is deactivated by default in preview. To activate IO Cache, select the HDInsight IO Cache service in the Ambari management UI. Then click **Actions** and **Activate**.

![Enabling the IO Cache service in Ambari](./media/apache-spark-improve-performance-iocache/ambariui-enable-iocache.png "Enabling the IO Cache service in Ambari")

Confirm restart of all the affected services on the cluster.
  
>[!NOTE] 
> Even though the progress bar shows activated, IO Cache isn't actually enabled until you restart the service.

# Troubleshooting
  
You may get disk space errors running Spark jobs after enabling IO Cache. These errors occur because Spark also uses local disk storage for storing data during shuffling operations. Spark may run out of SSD space once IO Cache is enabled and the space for Spark storage is reduced. The amount of space used by IO Cache defaults to half of the total SSD space. The disk space usage for IO Cache is configurable in Ambari. If you get disk space errors, try to reduce the amount of SSD space used for IO Cache and restart the service. If that does not work, disable IO Cache.