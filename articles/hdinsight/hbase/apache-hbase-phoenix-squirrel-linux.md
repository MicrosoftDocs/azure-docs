---
title: Use Apache Phoenix and SQLLine with HBase in Azure HDInsight 
description: Learn how to use Apache Phoenix in HDInsight. Also, learn how to install and set up SQLLine on your computer to connect to an HBase cluster in HDInsight.
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 01/03/2018
ms.author: jasonh

---
# Use Apache Phoenix with Linux-based HBase clusters in HDInsight
Learn how to use [Apache Phoenix](http://phoenix.apache.org/) in Azure HDInsight, and how to use SQLLine. For more information about Phoenix, see [Phoenix in 15 minutes or less](http://phoenix.apache.org/Phoenix-in-15-minutes-or-less.html). For the Phoenix grammar, see [Phoenix grammar](http://phoenix.apache.org/language/index.html).

> [!NOTE]
> For Phoenix version information about HDInsight, see [What's new in the Hadoop cluster versions provided by HDInsight](../hdinsight-component-versioning.md).
>
>

## Use SQLLine
[SQLLine](http://sqlline.sourceforge.net/) is a command-line utility to execute SQL.

### Prerequisites
Before you can use SQLLine, you must have the following items:

* **An HBase cluster in HDInsight**. To create one, see [Get started with Apache HBase in HDInsight](./apache-hbase-tutorial-get-started-linux.md).

When you connect to an HBase cluster, you need to connect to one of the ZooKeeper VMs. Each HDInsight cluster has three ZooKeeper VMs.

**To get the ZooKeeper host name**

1. Open Ambari by browsing to **https://\<cluster name\>.azurehdinsight.net**.
2. To sign in, enter the HTTP (cluster) user name and password.
3. In the left menu, select **ZooKeeper**. Three **ZooKeeper Server** instances are listed.
4. Select one of the **ZooKeeper Server** instances. On the **Summary** pane, find the **Hostname**. It looks similar to *zk1-jdolehb.3lnng4rcvp5uzokyktxs4a5dhd.bx.internal.cloudapp.net*.

**To use SQLLine**

1. Connect to the cluster by using SSH. For more information, see [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md).

2. In SSH, use the following commands to run SQLLine:

        cd /usr/hdp/2.2.9.1-7/phoenix/bin
        ./sqlline.py <ZOOKEEPER SERVER FQDN>:2181:/hbase-unsecure
3. To create an HBase table, and insert some data, run the following commands:

        CREATE TABLE Company (COMPANY_ID INTEGER PRIMARY KEY, NAME VARCHAR(225));

        !tables

        UPSERT INTO Company VALUES(1, 'Microsoft');

        SELECT * FROM Company;

        !quit

For more information, see the [SQLLine manual](http://sqlline.sourceforge.net/#manual) and [Phoenix grammar](http://phoenix.apache.org/language/index.html).

## Next steps
In this article, you learned how to use Apache Phoenix in HDInsight. To learn more, see these articles:

* [HDInsight HBase overview][hdinsight-hbase-overview].
  HBase is an Apache, open-source, NoSQL database built on Hadoop that provides random access and strong consistency for large amounts of unstructured and semistructured data.
* [Provision HBase clusters on Azure Virtual Network][hdinsight-hbase-provision-vnet].
  With virtual network integration, HBase clusters can be deployed to the same virtual network as your applications, so applications can communicate directly with HBase.
* [Configure HBase replication in HDInsight](apache-hbase-replication.md). Learn how to set up HBase replication across two Azure datacenters.


[azure-portal]: https://portal.azure.com
[vnet-point-to-site-connectivity]: https://msdn.microsoft.com/library/azure/09926218-92ab-4f43-aa99-83ab4d355555#BKMK_VNETPT

[hdinsight-manage-portal]: hdinsight-administer-use-management-portal.md#connect-to-clusters-using-rdp
[hdinsight-hbase-provision-vnet]:apache-hbase-provision-vnet.md
[hdinsight-hbase-overview]:apache-hbase-overview.md


