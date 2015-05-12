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
   ms.date="05/12/2015"
   ms.author="rashimg"/>


# Learn how to optimize your Hive queries using HDInsight

Most of our customers use Hive as the interface to query in HDInsight. Hive is used for both Ad-hoc queries as well as in pipelines.

One of the most common questions is how they can run their queries faster. Since Hadoop has to cater to many different sets of users - both from small data sets to PBs of data, Out of the box Hadoop is optmized to ensure that a query can finish execution succesfully - not necessarily faster.

If you start reading on Hive optimizations, you will quickly notice that there are dozens if not hundreds of optimizations possible. In this tutorial, we will look at few of the most common optimizations you can apply to make your queries run faster. We will look at this from an architecture as well as query level.

##Optimization 1: Scale Out

Scale out refers to increasing the number of nodes that you can have in your cluster. Increasing nodes helps because you can run more mappers and reducers because you have more tasks that can be run in parallel. There are two ways you can increase scale out in HDInsight:

1. During cluster creation, you can pick how many nodes you want your query to run in. This is shown in the image below.
![scaleout_1][image-hdi-optimize-hive-scaleout_1]
2. If you already have a cluster up and running, you can also increase the scale without deleting and recreating the cluster. This is shown below.
![scaleout_1][image-hdi-optimize-hive-scaleout_2]

For more details on the different VMs supported by HDInsight, click on the [pricing](http://azure.microsoft.com/en-us/pricing/details/hdinsight/) link. 

##Optimization 2: Enabling Tez

[Apache Tez](http://hortonworks.com/hadoop/tez/) is an alternative execution engine to MapReduce which makes Hive interactive. Not only does Tez improve upon MapReduce engine's speed but also maintains MapReduce's ability to scale to PBs of data. Apache Hive and Apache Pig use Tez. The figure below shows that Hive can run on either MapReduce or on interactive Tez in the HDInsight Platform.  
![tez_1][image-hdi-optimize-hive-tez_1]

Tez is faster than MapReduce engine due to the following reasons:

1. Executing Directed Acyclic Graph (DAG) as a single job - In the MapReduce engine, the DAG that is expressed requires each set of mappers to be followed by one set of reducers. This causes multiple MapReduce jobs to be spun off for each Hive query. Tez does not have such constraint and can process complex DAG as one job thus minimizing job startup overhead. 
2. Avoids unnecessary writes - Due to multiple jobs being spun for the same Hive query in the MapReduce engine, the output of each job is written to HDFS for intermediate data. Since Tez minimizes number of jobs for each Hive query it is able to avoid unnecessary write. 
3. Minimizes start-up delays - Tez is better able to minimize start-up delay by reducing the number of mappers it needs to start and also improving optimization throughout.
4. Reuses containers - Whenever possible Tez is able to reuse containers to ensure that latency due to starting up containers is reduced.
5. Continuous optimization techniques - Traditionally optimization was done during compilation phase. However more information about the inputs is available that allow for better optimization during runtime. Tez uses continous optimization techniques that allows it to optimize the plan further into the runtime phase.

For more details on these concepts, click [here](http://hortonworks.com/hadoop/tez/)      

You can make any Hive query Tez enabled by prefixing the query with the setting below: 

`set hive.execution.engine=tez;` 

If you would like to make your cluster Tez enabled by default, then you can use the PowerShell script below which you can use to create your cluster. Note that this script only works when creating the cluster and cannot be used to convert an already running cluster to be Tez enabled by default.   

    $location = "East Asia"  [Change this to location of your cluster] 
    
    $storageAccountName = "Your_Blob_Storage_name"   [Change this to your blob storage name]
    $storageContainerName = "Your_Blob_Storage_Container_name" [Change this to your storage container name]
    
    $hdiDataNodes = 32 [Change this to number of nodes you want]
    $hdiName = "Your_Cluster_Name"    [Change this to the name of your cluster. Make sure this is unique]
    $hdiVersion = "3.1" [Choose version of HDI cluster]
    
    $hdiUserName = "username" [Choose a username]
    $hdiPassword = "password" [Choose password - make sure it is 8 characters, has atleast 1 number, 1 special character and 1 uppercase letter]  
    
    $storageAccountKey = "Your_storage_key" [List the storage key associated with your storage account above]
    
    $hdiSecurePassword = ConvertTo-SecureString $hdiPassword -AsPlainText -Force
    $hdiCredential = New-Object System.Management.Automation.PSCredential($hdiUserName, $hdiSecurePassword)
    
    $hiveConfig = new-object 'Microsoft.WindowsAzure.Management.HDInsight.Cmdlet.DataObjects.AzureHDInsightHiveConfiguration'
    $hiveConfig.Configuration = @{ "hive.execution.engine"="tez" }
    
    New-AzureHDInsightClusterConfig -ClusterSizeInNodes $hdiDataNodes -HeadNodeVMSize Standard_D14 -DataNodeVMSize Standard_D14 | 
    Set-AzureHDInsightDefaultStorage -StorageAccountName "$storageAccountName.blob.core.windows.net" -StorageAccountKey $storageAccountKey -StorageContainerName $storageContainerName |
    Add-AzureHDInsightConfigValues -Hive $hiveConfig |
    New-AzureHDInsightCluster -Name $hdiName -Location $location -Credential $hdiCredential -Version $hdiVersion -Debug
    
##Optimization 3: Partitioning

By default, a Hive query scans entire table. This is great for queries like Table Scans, however for queries that only need to scan a small amount of data (e.g. queries with filtering) this creates unnecessary long runtimes. Since most of the bottleneck in a Hive query is due to I/O operations if the amount of data that needs to be read can be reduced, then the overall latency of the query will be reduced.

Hive partitioning takes advantage of this approach. Partitioning allows Hive to access part of the data so that only the necessary amount of data is touched. This is implemented in Hive by reorganizing the raw data such that a new directory is created for each partition - where a partition is defined by the user. As an example, lets assume we partition a table on the column Year. Then a new directory will be created for each year. The following image shows the partitioning concept in more details.
![partitioning][image-hdi-optimize-hive-partitioning_1]

Some partitioning pointers:
1. Do not under-partition - Partitioning on columns with only a few values can cause very few partitions to be created which will not reduce the amount of data that needs to be read. For example, partitioning on gender will only create two partitions to be created - one for male and female - reducing the latency by a maximum of half.  
2. Do not over-partition - On the other extreme creating a partition on a column with a unique value (e.g. userid) will cause multiple partitions causing a lot of stress on the namenode as it will have to handle the large amount of directories.
3. Avoid data skew - Choose your partitioning key wisely so that all partitions are even size. An example is partitioning on State may cause the number of records under California to be almost 30x that of Vermont due to the difference in population.

To create a partition table, use the *Partitioned By* clause as shown in the code snippet below. 

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

Static partitioning means that you have already sharded data in the appropriate directories and you can ask Hive partitions manually based on the directory location. This is shown in the code snippet below. 

    INSERT OVERWRITE TABLE lineitem_part
    PARTITION (L_SHIPDATE = ‘5/23/1996 12:00:00 AM’)
    SELECT * FROM lineitem 
    WHERE lineitem.L_SHIPDATE = ‘5/23/1996 12:00:00 AM’
    
    ALTER TABLE lineitem_part ADD PARTITION (L_SHIPDATE = ‘5/23/1996 12:00:00 AM’))
    LOCATION ‘wasb://sampledata@ignitedemo.blob.core.windows.net/partitions/5_23_1996/'

Dynamic partitioning means that you want Hive to create partitions automatically for you. Since we have already created the partitioning table from the staging table, all we need to do is insert data to the partitioned table as shown below:

    SET hive.exec.dynamic.partition = true; 
    SET hive.exec.dynamic.partition.mode = nonstrict; 
    INSERT INTO TABLE lineitem_part 
    PARTITION (L_SHIPDATE) 
    SELECT L_ORDERKEY as L_ORDERKEY, L_PARTKEY as L_PARTKEY ,  
    	 L_SUPPKEY as L_SUPPKEY, L_LINENUMBER as L_LINENUMBER,
     	 L_QUANTITY as L_QUANTITY, L_EXTENDEDPRICE as L_EXTENDEDPRICE,
    	 L_DISCOUNT as L_DISCOUNT, L_TAX as L_TAX, L_RETURNFLAG as 	 	 L_RETURNFLAG, L_LINESTATUS as L_LINESTATUS, L_SHIPDATE as 	 	 L_SHIPDATE_PS, L_COMMITDATE as L_COMMITDATE, L_RECEIPTDATE as 	 L_RECEIPTDATE, L_SHIPINSTRUCT as L_SHIPINSTRUCT, L_SHIPMODE as 	 L_SHIPMODE, L_COMMENT as L_COMMENT, L_SHIPDATE as L_SHIPDATE FROM lineitem;

For more details on partitioning read more [here](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL#LanguageManualDDL-PartitionedTables).

##Optimization 4: Using ORCFile Format
Hive supports different file formats on which queries can be executed. Here are some of the formats and their best use case:


- Text format: this is the default file format and works with most scenarios
- Avro format: works well for interoperability scenarios
- ORC/Parquet: best suited for performance
 
ORC (Optimized Row Columnar) format is a highly efficient way to store Hive data. Compared to other formats, ORC has the following advantages:
- Support for complex types including DateTime and complex and semi-structured types
- Up to 70% compression
- Indexes every 10,000 rows which allow skipping rows

You can read more on the ORC format [here](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+ORC). 

To enable ORC format, you first create a table with the clause *Stored as ORC* as shown below

    CREATE TABLE lineitem_orc_part
    	(L_ORDERKEY INT, L_PARTKEY INT,L_SUPPKEY INT, L_LINENUMBER INT,
    	 L_QUANTITY DOUBLE, L_EXTENDEDPRICE DOUBLE, L_DISCOUNT DOUBLE,
    	 L_TAX DOUBLE, L_RETURNFLAG STRING, L_LINESTATUS STRING,
    	 L_SHIPDATE_PS STRING, L_COMMITDATE STRING, L_RECEIPTDATE 	 	 STRING, L_SHIPINSTRUCT STRING, L_SHIPMODE STRING, L_COMMENT 	 STRING)
    PARTITIONED BY(L_SHIPDATE STRING)
    STORED AS ORC;

Next, you insert data to the ORC table from the staging table using the code below:

    INSERT INTO TABLE lineitem_orc
    SELECT L_ORDERKEY as L_ORDERKEY, L_PARTKEY as L_PARTKEY ,  
    	 L_SUPPKEY as L_SUPPKEY, L_LINENUMBER as L_LINENUMBER,
     	 L_QUANTITY as L_QUANTITY, L_EXTENDEDPRICE as L_EXTENDEDPRICE,
    	 L_DISCOUNT as L_DISCOUNT, L_TAX as L_TAX, L_RETURNFLAG as 	 	 L_RETURNFLAG, L_LINESTATUS as L_LINESTATUS, L_SHIPDATE as 	 	 L_SHIPDATE, L_COMMITDATE as L_COMMITDATE, L_RECEIPTDATE as 	 	 L_RECEIPTDATE, L_SHIPINSTRUCT as L_SHIPINSTRUCT, L_SHIPMODE as 	 L_SHIPMODE, L_COMMENT as L_COMMENT
    FROM lineitem;

Using ORC you should see compression of data about 50-80% and also a significant drop in runtime execution. 

##Optimization 5: Vectorization
Vectorization is a Hive feature that reduces the CPU usage for common query operations. Instead of processing one row at a time, Vectorization processes 1024 rows at one time. This means that simple operations are done faster because less internal code needs to run. You can read more on vectorization [here](https://cwiki.apache.org/confluence/display/Hive/Vectorized+Query+Execution).  

To enable vectorization prefix your Hive query with the following setting:

    set hive.vectorized.execution.enabled = true;


##Other optimizations

There are more advanced optimizations that you can consider that we will talk about in a future post including Bucketing, Join optimizations and increasing Reducers. 

##Summary
In conclusion, based on your scenario you should consider using the above optimizations to make your queries run faster. 

We at HDInsight are working towards making Hadoop more optimized without extensive work on your part. We will update this tutorial with more details once we have something to share.

[image-hdi-optimize-hive-scaleout_1]: ./media/hdinsight-hadoop-optimizing-query/scaleout_1.png
[image-hdi-optimize-hive-scaleout_2]: ./media/hdinsight-hadoop-optimizing-query/scaleout_2.png
[image-hdi-optimize-hive-tez_1]: ./media/hdinsight-hadoop-optimizing-query/tez_1.png
[image-hdi-optimize-hive-partitioning_1]: ./media/hdinsight-hadoop-optimizing-query/partitioning_1.png
