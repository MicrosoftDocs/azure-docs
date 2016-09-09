<properties
   pageTitle="Optimize your Hive queries for faster execution in HDInsight | Microsoft Azure"
   description="Learn how to optimize your Hive queries in HDInsight"
   services="hdinsight"
   documentationCenter=""
   authors="rashimg"
   manager="mwinkle"
   editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="07/28/2015"
   ms.author="rashimg"/>


# Optimize Hive queries for Hadoop in HDInsight

By default, Hadoop clusters are not optimized for performance. This article covers a few of the most common Hive performance optimization methods that you can apply to our queries.

> [AZURE.IMPORTANT] The steps in this document use the Azure Classic Portal. Microsoft does not recommend using the classic portal when creating new services. For an explanation of the advantages of the Azure Portal, see [Microsoft Azure Portal](https://azure.microsoft.com/features/azure-portal/).
>
> This document also includes information on using Azure PowerShell. The snippets provided are based on commands that use Azure Service Management (ASM) to work with HDInsight and are __deprecated__. These commands will be removed by January 1, 2017.
>
>For a version of this document that uses the Azure portal, along with PowerShell snippets that use Azure Resource Manager (ARM), see [Optimize Hive queries for Hadoop in HDInsight](hdinsight-hadoop-optimize-hive-query.md).

##Scale out worker nodes

Increasing the number of worker nodes in a cluster can leverage more mappers and reducers to be run in parallel. There are two ways you can increase scale out in HDInsight:

- At the provision time, you can specify the number of worker nodes using the Azure portal, Azure PowerShell or Cross-platform command line interface.  For more information, see [Provision HDInsight clusters](hdinsight-provision-clusters.md). The following screen show the worker node configuration on the Azure portal:

	![scaleout_1][image-hdi-optimize-hive-scaleout_1]
- At the run time, you can also scale out a cluster without recreating one. This is shown below.
![scaleout_1][image-hdi-optimize-hive-scaleout_2]

For more details on the different virtual machines supported by HDInsight, see [HDInsight pricing](https://azure.microsoft.com/pricing/details/hdinsight/).

##Enable Tez

[Apache Tez](http://hortonworks.com/hadoop/tez/) is an alternative execution engine to the MapReduce engine:

![tez_1][image-hdi-optimize-hive-tez_1]


Tez is faster because:

- Execute Directed Acyclic Graph (DAG) as a single job in the MapReduce engine, the DAG that is expressed requires each set of mappers to be followed by one set of reducers. This causes multiple MapReduce jobs to be spun off for each Hive query. Tez does not have such constraint and can process complex DAG as one job thus minimizing job startup overhead.
- **Avoids unnecessary writes** Due to multiple jobs being spun for the same Hive query in the MapReduce engine, the output of each job is written to HDFS for intermediate data. Since Tez minimizes number of jobs for each Hive query it is able to avoid unnecessary write.
- **Minimizes start-up delays** Tez is better able to minimize start-up delay by reducing the number of mappers it needs to start and also improving optimization throughout.
- **Reuses containers** Whenever possible Tez is able to reuse containers to ensure that latency due to starting up containers is reduced.
- **Continuous optimization techniques** Traditionally optimization was done during compilation phase. However more information about the inputs is available that allow for better optimization during runtime. Tez uses continous optimization techniques that allows it to optimize the plan further into the runtime phase.

For more details on these concepts, click [here](http://hortonworks.com/hadoop/tez/)

You can make any Hive query Tez enabled by prefixing the query with the setting below:

	set hive.execution.engine=tez;

Tez must be enabled at the provision time. The following is a sample Azure PowerShell script for provisioning a Hadoop cluster with Tez enabled:


	$clusterName = "[HDInsightClusterName]"
	$location = "[AzureDataCenter]" #i.e. West US
	$dataNodes = 32 # number of worker nodes in the cluster

	$defaultStorageAccountName = "[DefaultStorageAccountName]"
	$defaultStorageContainerName = "[DefaultBlobContainerName]"
	$defaultStorageAccountKey = $defaultStorageAccountKey = Get-AzureStorageKey $defaultStorageAccountName.ToLower() | %{ $_.Primary }

	$hdiUserName = "[HTTPUserName]"
	$hdiPassword = "[HTTPUserPassword]"

	$hdiSecurePassword = ConvertTo-SecureString $hdiPassword -AsPlainText -Force
	$hdiCredential = New-Object System.Management.Automation.PSCredential($hdiUserName, $hdiSecurePassword)

	$hiveConfig = new-object 'Microsoft.WindowsAzure.Management.HDInsight.Cmdlet.DataObjects.AzureHDInsightHiveConfiguration'
	$hiveConfig.Configuration = @{ "hive.execution.engine"="tez" }

	New-AzureHDInsightClusterConfig -ClusterSizeInNodes $dataNodes -HeadNodeVMSize Standard_D14 -DataNodeVMSize Standard_D14 |
	Set-AzureHDInsightDefaultStorage -StorageAccountName "$defaultStorageAccountName.blob.core.windows.net" -StorageAccountKey $defaultStorageAccountKey -StorageContainerName $defaultStorageContainerName |
	Add-AzureHDInsightConfigValues -Hive $hiveConfig |
	New-AzureHDInsightCluster -Name $clusterName -Location $location -Credential $hdiCredential

## Hive partitioning

I/O operation is the major performance bottleneck for running Hive queries. The performance can be improved if the amount of data that needs to be read can be reduced. By default, Hive queries scan entire Hive tables. This is great for queries like table scans, however for queries that only need to scan a small amount of data (e.g. queries with filtering), this creates unnecessary overhead. Hive partitioning allows Hive queries to access only the necessary amount of data in Hive tables.

Hive partitioning is implemented by reorganizing the raw data into new directories with each partition having its own directory - where the partition is defined by the user. The following diagram illustrates partitioning a Hive table by the column *Year*. A new directory is created for each year.

![partitioning][image-hdi-optimize-hive-partitioning_1]

Some partitioning considerations:

- **Do not under-partition** - Partitioning on columns with only a few values can cause very few partitions. For example, partitioning on gender will only create two partitions to be created (male and female), thus only reduce the latency by a maximum of half.

- **Do not over-partition** - On the other extreme, creating a partition on a column with a unique value (e.g. userid) will cause multiple partitions causing a lot of stress on the cluster namenode as it will have to handle the large amount of directories.

- **Avoid data skew** - Choose your partitioning key wisely so that all partitions are even size. An example is partitioning on *State* may cause the number of records under California to be almost 30x that of Vermont due to the difference in population.

To create a partition table, use the *Partitioned By* clause:

    CREATE TABLE lineitem_part
    	(L_ORDERKEY INT, L_PARTKEY INT, L_SUPPKEY INT,L_LINENUMBER INT,
    	 L_QUANTITY DOUBLE, L_EXTENDEDPRICE DOUBLE, L_DISCOUNT DOUBLE,
    	 L_TAX DOUBLE, L_RETURNFLAG STRING, L_LINESTATUS STRING,
    	 L_SHIPDATE_PS STRING, L_COMMITDATE STRING, L_RECEIPTDATE 	  	 STRING, L_SHIPINSTRUCT STRING, L_SHIPMODE STRING,
    	 L_COMMENT STRING)
    PARTITIONED BY(L_SHIPDATE STRING)
    ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
    STORED AS TEXTFILE;

Once the partitioned table is created, you can either create static partitioning or dynamic partitioning.

- **Static partitioning** means that you have already sharded data in the appropriate directories and you can ask Hive partitions manually based on the directory location. This is shown in the code snippet below.

	    INSERT OVERWRITE TABLE lineitem_part
	    PARTITION (L_SHIPDATE = ‘5/23/1996 12:00:00 AM’)
	    SELECT * FROM lineitem 
	    WHERE lineitem.L_SHIPDATE = ‘5/23/1996 12:00:00 AM’

	    ALTER TABLE lineitem_part ADD PARTITION (L_SHIPDATE = ‘5/23/1996 12:00:00 AM’))
	    LOCATION ‘wasbs://sampledata@ignitedemo.blob.core.windows.net/partitions/5_23_1996/'

- **Dynamic partitioning** means that you want Hive to create partitions automatically for you. Since we have already created the partitioning table from the staging table, all we need to do is insert data to the partitioned table as shown below:

	    SET hive.exec.dynamic.partition = true;
	    SET hive.exec.dynamic.partition.mode = nonstrict;
	    INSERT INTO TABLE lineitem_part
	    PARTITION (L_SHIPDATE)
	    SELECT L_ORDERKEY as L_ORDERKEY, L_PARTKEY as L_PARTKEY , 
	    	 L_SUPPKEY as L_SUPPKEY, L_LINENUMBER as L_LINENUMBER,
	     	 L_QUANTITY as L_QUANTITY, L_EXTENDEDPRICE as L_EXTENDEDPRICE,
	    	 L_DISCOUNT as L_DISCOUNT, L_TAX as L_TAX, L_RETURNFLAG as 	 	 L_RETURNFLAG, L_LINESTATUS as L_LINESTATUS, L_SHIPDATE as 	 	 L_SHIPDATE_PS, L_COMMITDATE as L_COMMITDATE, L_RECEIPTDATE as 	 L_RECEIPTDATE, L_SHIPINSTRUCT as L_SHIPINSTRUCT, L_SHIPMODE as 	 L_SHIPMODE, L_COMMENT as L_COMMENT, L_SHIPDATE as L_SHIPDATE FROM lineitem;

For more details, see [Partitioned Tables](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL#LanguageManualDDL-PartitionedTables).

##Use the ORCFile format

Hive supports different file formats. For example:

- **Text**: this is the default file format and works with most scenarios
- **Avro**: works well for interoperability scenarios
- **ORC/Parquet**: best suited for performance

ORC (Optimized Row Columnar) format is a highly efficient way to store Hive data. Compared to other formats, ORC has the following advantages:

- support for complex types including DateTime and complex and semi-structured types
- up to 70% compression
- indexes every 10,000 rows which allow skipping rows
- a significant drop in run-time execution

To enable ORC format, you first create a table with the clause *Stored as ORC*:

    CREATE TABLE lineitem_orc_part
    	(L_ORDERKEY INT, L_PARTKEY INT,L_SUPPKEY INT, L_LINENUMBER INT,
    	 L_QUANTITY DOUBLE, L_EXTENDEDPRICE DOUBLE, L_DISCOUNT DOUBLE,
    	 L_TAX DOUBLE, L_RETURNFLAG STRING, L_LINESTATUS STRING,
    	 L_SHIPDATE_PS STRING, L_COMMITDATE STRING, L_RECEIPTDATE STRING,
		 L_SHIPINSTRUCT STRING, L_SHIPMODE STRING, L_COMMENT 	 STRING)
    PARTITIONED BY(L_SHIPDATE STRING)
    STORED AS ORC;

Next, you insert data to the ORC table from the staging table. For example:

    INSERT INTO TABLE lineitem_orc
    SELECT L_ORDERKEY as L_ORDERKEY, 
           L_PARTKEY as L_PARTKEY , 
    	   L_SUPPKEY as L_SUPPKEY,
		   L_LINENUMBER as L_LINENUMBER,
     	   L_QUANTITY as L_QUANTITY, 
		   L_EXTENDEDPRICE as L_EXTENDEDPRICE,
    	   L_DISCOUNT as L_DISCOUNT,
		   L_TAX as L_TAX,
           L_RETURNFLAG as L_RETURNFLAG,
		   L_LINESTATUS as L_LINESTATUS,
		   L_SHIPDATE as L_SHIPDATE,
		   L_COMMITDATE as L_COMMITDATE,
		   L_RECEIPTDATE as L_RECEIPTDATE, 
		   L_SHIPINSTRUCT as L_SHIPINSTRUCT,
		   L_SHIPMODE as L_SHIPMODE,
		   L_COMMENT as L_COMMENT
    FROM lineitem;

You can read more on the ORC format [here](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+ORC).

##Vectorization

Vectorization allows Hive to process a batch of 1024 rows together instead of processing one row at a time. This means that simple operations are done faster because less internal code needs to run.

To enable vectorization prefix your Hive query with the following setting:

    set hive.vectorized.execution.enabled = true;

For more information, see [Vectorized query execution](https://cwiki.apache.org/confluence/display/Hive/Vectorized+Query+Execution).


##Other optimization methods

There are more optimization methods that you can consider, for example:

- **Hive bucketing:** a technique that allows to cluster or segment large sets of data to optimize query performance.
- **Join optimization:** optimization of Hive's query execution planning to improve the efficiency of joins and reduce the need for user hints. For more information, see [Join optimization](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+JoinOptimization#LanguageManualJoinOptimization-JoinOptimization).
- **increase Reducers**

##<a id="nextsteps"></a> Next steps
In this article, you have learned several common Hive query optimization methods. To learn more, see the following articles:

- [Use Apache Hive in HDInsight](hdinsight-use-hive.md)
- [Analyze flight delay data by using Hive in HDInsight](hdinsight-analyze-flight-delay-data.md)
- [Analyze Twitter data using Hive in HDInsight](hdinsight-analyze-twitter-data.md)
- [Analyze sensor data using the Hive Query Console on Hadoop in HDInsight](hdinsight-hive-analyze-sensor-data.md)
- [Use Hive with HDInsight to analyze logs from websites](hdinsight-hive-analyze-website-log.md)


[image-hdi-optimize-hive-scaleout_1]: ./media/hdinsight-hadoop-optimize-hive-query-v1/scaleout_1.png
[image-hdi-optimize-hive-scaleout_2]: ./media/hdinsight-hadoop-optimize-hive-query-v1/scaleout_2.png
[image-hdi-optimize-hive-tez_1]: ./media/hdinsight-hadoop-optimize-hive-query-v1/tez_1.png
[image-hdi-optimize-hive-partitioning_1]: ./media/hdinsight-hadoop-optimize-hive-query-v1/partitioning_1.png
