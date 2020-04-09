---
title: Enable heap dumps for Apache Hadoop services on HDInsight - Azure
description: Enable heap dumps for Apache Hadoop services from Linux-based HDInsight clusters for debugging and analysis.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive
ms.date: 01/02/2020
---

# Enable heap dumps for Apache Hadoop services on Linux-based HDInsight

[!INCLUDE [heapdump-selector](../../includes/hdinsight-selector-heap-dump.md)]

Heap dumps contain a snapshot of the application's memory, including the values of variables at the time the dump was created. So they're useful for diagnosing problems that occur at run-time.

## Services

You can enable heap dumps for the following services:

* **Apache hcatalog** - tempelton
* **Apache hive** - hiveserver2, metastore, derbyserver
* **mapreduce** - jobhistoryserver
* **Apache yarn** - resourcemanager, nodemanager, timelineserver
* **Apache hdfs** - datanode, secondarynamenode, namenode

You can also enable heap dumps for the map and reduce processes ran by HDInsight.

## Understanding heap dump configuration

Heap dumps are enabled by passing options (sometimes known as opts, or parameters) to the JVM when a service is started. For most [Apache Hadoop](https://hadoop.apache.org/) services, you can modify the shell script used to start the service to pass these options.

In each script, there's an export for **\*\_OPTS**, which contains the options passed to the JVM. For example, in the **hadoop-env.sh** script, the line that begins with `export HADOOP_NAMENODE_OPTS=` contains the options for the NameNode service.

Map and reduce processes are slightly different, as these operations are a child process of the MapReduce service. Each map or reduce process runs in a child container, and there are two entries that contain the JVM options. Both contained in **mapred-site.xml**:

* **mapreduce.admin.map.child.java.opts**
* **mapreduce.admin.reduce.child.java.opts**

> [!NOTE]  
> We recommend using [Apache Ambari](https://ambari.apache.org/) to modify both the scripts and mapred-site.xml settings, as Ambari handle replicating changes across nodes in the cluster. See the [Using Apache Ambari](#using-apache-ambari) section for specific steps.

### Enable heap dumps

The following option enables heap dumps when an OutOfMemoryError occurs:

    -XX:+HeapDumpOnOutOfMemoryError

The **+** indicates that this option is enabled. The default is disabled.

> [!WARNING]  
> Heap dumps are not enabled for Hadoop services on HDInsight by default, as the dump files can be large. If you do enable them for troubleshooting, remember to disable them once you have reproduced the problem and gathered the dump files.

### Dump location

The default location for the dump file is the current working directory. You can control where the file is stored using the following option:

    -XX:HeapDumpPath=/path

For example, using `-XX:HeapDumpPath=/tmp` causes the dumps to be stored in the /tmp directory.

### Scripts

You can also trigger a script when an **OutOfMemoryError** occurs. For example, triggering a notification so you know that the error has occurred. Use the following option to trigger a script on an __OutOfMemoryError__:

    -XX:OnOutOfMemoryError=/path/to/script

> [!NOTE]  
> Since Apache Hadoop is a distributed system, any script used must be placed on all nodes in the cluster that the service runs on.
> 
> The script must also be in a location that is accessible by the account the service runs as, and must provide execute permissions. For example, you may wish to store scripts in `/usr/local/bin` and use `chmod go+rx /usr/local/bin/filename.sh` to grant read and execute permissions.

## Using Apache Ambari

To modify the configuration for a service, use the following steps:

1. From a web browser, navigate to `https://CLUSTERNAME.azurehdinsight.net`, where `CLUSTERNAME` is the name of your cluster.

2. Using the list of on the left, select the service area you want to modify. For example, **HDFS**. In the center area, select the **Configs** tab.

    ![Image of Ambari web with HDFS Configs tab selected](./media/hdinsight-hadoop-collect-debug-heap-dump-linux/hdi-service-config-tab.png)

3. Using the **Filter...** entry, enter **opts**. Only items containing this text are displayed.

    ![Apache Ambari config filtered list](./media/hdinsight-hadoop-collect-debug-heap-dump-linux/hdinsight-filter-list.png)

4. Find the **\*\_OPTS** entry for the service you want to enable heap dumps for, and add the options you wish to enable. In the following image, I've added `-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/tmp/` to the **HADOOP\_NAMENODE\_OPTS** entry:

    ![Apache Ambari hadoop-namenode-opts](./media/hdinsight-hadoop-collect-debug-heap-dump-linux/hadoop-namenode-opts.png)

   > [!NOTE]  
   > When enabling heap dumps for the map or reduce child process, look for the fields named **mapreduce.admin.map.child.java.opts** and **mapreduce.admin.reduce.child.java.opts**.

    Use the **Save** button to save the changes. You can enter a short note describing the changes.

5. Once the changes have been applied, the **Restart required** icon appears beside one or more services.

    ![restart required icon and restart button](./media/hdinsight-hadoop-collect-debug-heap-dump-linux/restart-required-icon.png)

6. Select each service that needs a restart, and use the **Service Actions** button to **Turn On Maintenance Mode**. Maintenance mode prevents alerts from being generated from the service when you restart it.

    ![Turn on hdi maintenance mode menu](./media/hdinsight-hadoop-collect-debug-heap-dump-linux/hdi-maintenance-mode.png)

7. Once you have enabled maintenance mode, use the **Restart** button for the service to **Restart All Effected**

    ![Apache Ambari Restart All Affected entry](./media/hdinsight-hadoop-collect-debug-heap-dump-linux/hdi-restart-all-button.png)

   > [!NOTE]  
   > The entries for the **Restart** button may be different for other services.

8. Once the services have been restarted, use the **Service Actions** button to **Turn Off Maintenance Mode**. This Ambari to resume monitoring for alerts for the service.