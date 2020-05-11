---
title: Optimize clusters with Apache Ambari in Azure HDInsight
description: Use the Apache Ambari web UI to configure and optimize Azure HDInsight clusters.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive,seoapr2020
ms.date: 05/04/2020
---

# Optimize clusters with Apache Ambari in Azure HDInsight

HDInsight provides Apache Hadoop clusters for large-scale data processing applications. Managing, monitoring, and optimizing these complex multi-node clusters can be challenging. Apache Ambari is a web interface to manage and monitor HDInsight Linux clusters.

For an introduction to using the Ambari Web UI, see [Manage HDInsight clusters by using the Apache Ambari Web UI](hdinsight-hadoop-manage-ambari.md)

Log in to  Ambari at `https://CLUSTERNAME.azurehdidnsight.net` with your cluster credentials. The initial screen  displays an overview dashboard.

![Apache Ambari user dashboard displayed](./media/hdinsight-changing-configs-via-ambari/apache-ambari-dashboard.png)

The Ambari web UI is used to manage hosts, services, alerts, configurations, and views. Ambari can't be used to create an HDInsight cluster, or upgrade services. Also can't manage stacks and versions, decommission or recommission hosts, or add services to the cluster.

## Manage your cluster's configuration

Configuration settings help tune a particular service. To modify a service's configuration settings, select the service from the **Services** sidebar (on the left). Then navigate to the **Configs** tab in the service detail page.

![Apache Ambari Services sidebar](./media/hdinsight-changing-configs-via-ambari/ambari-services-sidebar.png)

## Modify NameNode Java heap size

The NameNode Java heap size depends on many factors such as the load on the cluster. Also, the numbers of files, and the numbers of blocks. The default size of 1 GB works well with most clusters, although some workloads can require more or less memory.

To modify the NameNode Java heap size:

1. Select **HDFS** from the Services sidebar and navigate to the **Configs** tab.

    ![Apache Ambari HDFS configuration](./media/hdinsight-changing-configs-via-ambari/ambari-apache-hdfs-config.png)

1. Find the setting **NameNode Java heap size**. You can also use the **filter** text box to type and find a particular setting. Select the **pen** icon beside the setting name.

    ![Apache Ambari NameNode Java heap size](./media/hdinsight-changing-configs-via-ambari/ambari-java-heap-size.png)

1. Type the new value in the text box, and then press **Enter** to save the change.

    ![Ambari Edit NameNode Java heap size1](./media/hdinsight-changing-configs-via-ambari/java-heap-size-edit1.png)

1. The NameNode Java heap size is changed to 1 GB from 2 GB.

    ![Edited NameNode Java heap size2](./media/hdinsight-changing-configs-via-ambari/java-heap-size-edited.png)

1. Save your changes by clicking on the green **Save** button on the top of the configuration screen.

    ![`Apache Ambari save configurations`](./media/hdinsight-changing-configs-via-ambari/ambari-save-changes1.png)

## Next steps

* [Manage HDInsight clusters with the Apache Ambari web UI](hdinsight-hadoop-manage-ambari.md)
* [Apache Ambari REST API](hdinsight-hadoop-manage-ambari-rest-api.md)
* [Optimize Apache HBase](./optimize-hbase-ambari.md)
* [Optimize Apache Hive](./optimize-hive-ambari.md)
* [Optimize Apache Pig](./optimize-pig-ambari.md)
