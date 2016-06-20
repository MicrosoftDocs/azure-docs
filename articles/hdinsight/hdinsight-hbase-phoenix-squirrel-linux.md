<properties 
   pageTitle="Use Apache Phoenix and SQuirreL in HDInsight | Microsoft Azure" 
   description="Learn how to use Apache Phoenix in HDInsight, and how to install and configure SQuirreL on your workstation to connect to an HBase cluster in HDInsight." 
   services="hdinsight" 
   documentationCenter="" 
   authors="mumian" 
   manager="paulettm" 
   editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="05/27/2016"
   ms.author="jgao"/>

# Use Apache Phoenix with Linux-based HBase clusters in HDinsight  

Learn how to use [Apache Phoenix](http://phoenix.apache.org/) in HDInsight, and how to use SQLLine. For more information about Phoenix, see [Phoenix in 15 minutes or less](http://phoenix.apache.org/Phoenix-in-15-minutes-or-less.html). For the Phoenix grammar, see [Phoenix Grammar](http://phoenix.apache.org/language/index.html).

>[AZURE.NOTE] For the Phoenix version information in HDInsight, see [What's new in the Hadoop cluster versions provided by HDInsight?][hdinsight-versions].

##Use SQLLine
[SQLLine](http://sqlline.sourceforge.net/) is a command line utility to execute SQL. 

###Prerequisites
Before you can use SQLLine, you must have the following:

- **A HBase cluster in HDInsight**. For information on provision HBase cluster, see [Get started with Apache HBase in HDInsight][hdinsight-hbase-get-started].
- **Connect to the HBase cluster via the remote desktop protocol**. For instructions, see [Manage Hadoop clusters in HDInsight by using the Azure Classic Portal][hdinsight-manage-portal].


When you connect to an HBase cluster, you will need to connect to one of the Zookeepers. Each HDInsight cluster has 3 Zookeepers. 

**To find out the Zookeeper host name**

1. Open Ambari by browse to **https://<ClusterName>.azurehdinsight.net**.
2. Enter the HTTP (cluster) username and password to login.
3. Click **ZooKeeper** from the left menu. You shall see 3 **ZooKeeper Server** listed.
4. Click one of the **ZooKeeper Server** listed. On the Summary pane, find the **Hostname**. It is simliar to *zk1-jdolehb.3lnng4rcvp5uzokyktxs4a5dhd.bx.internal.cloudapp.net*.

**To use SQLLine**

1. Connect to the cluster using SSH. For instructions, see [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X](hdinsight-hadoop-linux-use-ssh-unix.md) or [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md) depending on your client computer OS.

2. From SSH, run the following commands to run SQLLine:

        cd /usr/hdp/2.2.9.1-7/phoenix/bin
        ./sqlline.py <ClusterName>:2181:/hbase-unsecure

2. Run the following commands to create a HBase table, and insert some data:

		CREATE TABLE Company (COMPANY_ID INTEGER PRIMARY KEY, NAME VARCHAR(225));
	
		!tables
		
		UPSERT INTO Company VALUES(1, 'Microsoft');
		
		SELECT * FROM Company;
        
        !quit

For more information, see [SQLLine manual](http://sqlline.sourceforge.net/#manual) and [Phoenix Grammar](http://phoenix.apache.org/language/index.html).


 
##Next steps
In this article, you have learned how to use Apache Phoenix in HDInsight.  To learn more, see

- [HDInsight HBase overview][hdinsight-hbase-overview]:
HBase is an Apache, open-source, NoSQL database built on Hadoop that provides random access and strong consistency for large amounts of unstructured and semistructured data.
- [Provision HBase clusters on Azure Virtual Network][hdinsight-hbase-provision-vnet]:
With virtual network integration, HBase clusters can be deployed to the same virtual network as your applications so that applications can communicate with HBase directly.
- [Configure HBase replication in HDInsight](hdinsight-hbase-geo-replication.md): Learn how to configure HBase replication across two Azure datacenters. 
- [Analyze Twitter sentiment with HBase in HDInsight][hbase-twitter-sentiment]:
Learn how to do real-time [sentiment analysis](http://en.wikipedia.org/wiki/Sentiment_analysis) of big data by using HBase in a Hadoop cluster in HDInsight.

[azure-portal]: https://portal.azure.com
[vnet-point-to-site-connectivity]: https://msdn.microsoft.com/library/azure/09926218-92ab-4f43-aa99-83ab4d355555#BKMK_VNETPT

[hdinsight-versions]: hdinsight-component-versioning.md
[hdinsight-hbase-get-started]: hdinsight-hbase-tutorial-get-started.md
[hdinsight-manage-portal]: hdinsight-administer-use-management-portal.md#connect-to-hdinsight-clusters-by-using-rdp
[hdinsight-hbase-provision-vnet]: hdinsight-hbase-provision-vnet.md
[hdinsight-hbase-overview]: hdinsight-hbase-overview.md
[hbase-twitter-sentiment]: hdinsight-hbase-analyze-twitter-sentiment.md

[hdinsight-hbase-phoenix-sqlline]: ./media/hdinsight-hbase-phoenix-squirrel/hdinsight-hbase-phoenix-sqlline.png
[img-certificate]: ./media/hdinsight-hbase-phoenix-squirrel/hdinsight-hbase-vpn-certificate.png
[img-vnet-diagram]: ./media/hdinsight-hbase-phoenix-squirrel/hdinsight-hbase-vnet-point-to-site.png
[img-squirrel-driver]: ./media/hdinsight-hbase-phoenix-squirrel/hdinsight-hbase-squirrel-driver.png
[img-squirrel-alias]: ./media/hdinsight-hbase-phoenix-squirrel/hdinsight-hbase-squirrel-alias.png
[img-squirrel]: ./media/hdinsight-hbase-phoenix-squirrel/hdinsight-hbase-squirrel.png
[img-squirrel-sql]: ./media/hdinsight-hbase-phoenix-squirrel/hdinsight-hbase-squirrel-sql.png


 
