<properties 
	pageTitle="Create and load data into Hive tables from Azure blob storage | Azure" 
	description="Create Hive tables and load data in blob to hive tables" 
	metaKeywords="" 
	services="machine-learning" 
	solutions="" 
	documentationCenter="" 
	authors="hangzh-msft" 
	manager="jacob.spoelstra" 
	editor="cgronlun"  />

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/25/2015" 
	ms.author="hangzh;bradsev" />

 
#Create and load data into Hive tables from Azure blob storage
 
In this document, generic Hive queries that create Hive tables and load data from Azure blob storage are presented. Some guidance is also provided on partitioning Hive tables and on using the Optimized Row Columnar (ORC) formatting to improve query performance.


The Hive queries are shared in the [Github repository](https://github.com/Azure/Azure-MachineLearning-DataScience/tree/master/Misc/DataScienceProcess/DataScienceScripts/sample_hive_create_db_tbls_load_data_generic.hql) and can be downloaded from there.

If you create an Azure virtual machine by following the instructions provided in [Set up an Azure virtual machine for data science](machine-learning-data-science-setup-virtual-machine.md), this script file should have been downloaded to the *C:\Users\<user name>\Documents\Data Science Scripts* directory on the virtual machine. These Hive queries only require that you plug in your own data schema and Azure blob storage configuration in the appropriate fields to be ready for submission.

We assume that the data for Hive tables is in an **uncompressed** tabular format, and that the data has been uploaded to the default (or to an additional) container of the storage account used by the Hadoop cluster. If you want to practice on the _NYC Taxi Trip Data_, you need to first  download the 24 [NYC Taxi Trip Data](http://www.andresmh.com/nyctaxitrips/) files (12 Trip files, and 12 Fair files), **unzip** all files into .csv files, and then upload them to the default (or appropriate container) of the Azure storage account that was used by the procedure outlined in the [Customize Azure HDInsight Hadoop Clusters for Data Science](machine-learning-data-science-customize-hadoop-cluster.md) topic. 

Hive queries can be submitted from the Hadoop Command Line console on the head node of the Hadoop cluster. To do this, log into the head node of the Hadoop cluster, open the Hadoop Command Line console, and submit the Hive queries from there. For instructions on how to do this, see [Submit Hive Queries to HDInsight Hadoop clusters in the Cloud Data Science Process](machine-learning-data-science-process-hive-tables.md).

Users can also use the Query Console (Hive Editor) by entering the URL 

https://&#60;Hadoop cluster name>.azurehdinsight.net/Home/HiveEditor

into a web browser. Note that you will be asked to input the Hadoop cluster credentials to log in. Alternatively, you can [Submit Hive jobs using PowerShell](hdinsight-submit-hadoop-jobs-programmatically.md#hive-powershell). 

## Prerequisites
This article assumes that you have:
 
* Created an Azure storage account. If you need instructions, see [Create an Azure Storage account](hdinsight-get-started.md#storage) 
* Provisioned a customized Hadoop cluster with the HDInsight service.  If you need instructions, see [Customize Azure HDInsight Hadoop Clusters for Data Science](machine-learning-data-science-customize-hadoop-cluster.md).
* Enabled remote access to the cluster, logged in, and opened the Hadoop Command Line console. If you need instructions, see [Access the Head Node of Hadoop Cluster](machine-learning-data-science-customize-hadoop-cluster.md#headnode). 


## <a name="create-tables"></a>Create Hive database and tables
Here is the Hive query that creates a Hive table.

    create database if not exists <database name>;
	CREATE EXTERNAL TABLE if not exists <database name>.<table name>
	(
		field1 string, 
		field2 int, 
		field3 float, 
		field4 double, 
		...,
		fieldN string
	) 
	ROW FORMAT DELIMITED FIELDS TERMINATED BY '<field separator>' lines terminated by '<line separator>' 
	STORED AS TEXTFILE LOCATION '<storage location>' TBLPROPERTIES("skip.header.line.count"="1");

Here are the descriptions of the fields that users need to plug in and other configurations:

- **&#60;database name>**: the name of the database users want to create. If users just want to use the default database, the query *create database...* can be omitted. 
- **&#60;table name>**: the name of the table users want to create within the specified database. If users want to use the default database, the table can be directly referred by *&#60;table name>* without &#60;database name>.
- **&#60;field separator>**: the separator that delimits fields in the data file to be uploaded to the Hive table. 
- &#60;line separator>: the separator that delimits lines in the data file. 
- **&#60;storage location>**: the Azure storage location to save the data of Hive tables. If users do not specify *LOCATION &#60;storage location>*, the database and the tables are stored in *hive/warehouse/* directory in the default container of the Hive cluster by default. If a user wants to specify the storage location, the storage location has to be within the default container for the database and tables. This location has to be referred as location relative to the default container of the cluster in the format of *'wasb:///&#60;directory 1>/'* or *'wasb:///&#60;directory 1>/&#60;directory 2>/'*, etc. After the query is executed, the relative directories will be created within the default container. 
- **TBLPROPERTIES("skip.header.line.count"="1")**: If the data file has a header line, users have to add this property **at the end** of the *create table* query. Otherwise, the header line will be loaded as a record to the table. If the data file does not have a header line, this configuration can be omitted in the query. 

## <a name="load-data"></a>Load data to Hive tables
Here is the Hive query that loads data into a Hive table.

    LOAD DATA INPATH '<path to blob data>' INTO TABLE <database name>.<table name>;

- **&#60;path to blob data>**: If the blob file to be uploaded to the Hive table is in the default container of the HDInsight Hadoop cluster, the *&#60;path to blob data>* should be in the format *'wasb:///&#60;directory in this container>/&#60;blob file name>'*. The blob file can also be in an additional container of the HDInsight Hadoop cluster. In this case, *&#60;path to blob data>* should be in the format *'wasb://&#60;container name>@&#60;storage account name>.blob.windows.core.net/&#60;blob file name>'*.

	>[AZURE.NOTE] The blob data to be uploaded to Hive table has to be in the default or additional container of the storage account for the Hadoop cluster. Otherwise, the *LOAD DATA* query will fail complaining that it cannot access the data. 


## <a name="partition-orc"></a>Advanced topics: partitioned table and store Hive data in ORC format

If the data is large, partitioning the table is beneficial for queries that only need to scan a few partitions of the table. For instance, it is reasonable to partition the log data of a web site by dates. 

In addition to partitioning Hive tables, it is also beneficial to store the Hive data in the Optimized Row Columnar (ORC) format. For more information on ORC formatting, see [Using ORC files improves performance when Hive is reading, writing, and processing data](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+ORC#LanguageManualORC-ORCFiles).

### Partitioned table
Here is the Hive query that creates a partitioned table and loads data into it.

    CREATE EXTERNAL TABLE IF NOT EXISTS <database name>.<table name>
	(field1 string,
	...
	fieldN string
	)
    PARTITIONED BY (<partitionfieldname> vartype) ROW FORMAT DELIMITED FIELDS TERMINATED BY '<field separator>'
		 lines terminated by '<line separator>' TBLPROPERTIES("skip.header.line.count"="1");
	LOAD DATA INPATH '<path to the source file>' INTO TABLE <database name>.<partitioned table name> 
		PARTITION (<partitionfieldname>=<partitionfieldvalue>);

When querying partitioned tables, it is recommended to add the partition condition in the **beginning** of the `where` clause as this improves the efficacy of searching significantly. 

    select 
		field1, field2, ..., fieldN
	from <database name>.<partitioned table name> 
	where <partitionfieldname>=<partitionfieldvalue> and ...;

### <a name="orc"></a>Store Hive data in ORC format

Users cannot directly load data from blob storage into Hive tables that is stored in the ORC format. Here are the steps that the users need to take in order to load data from Azure blobs to Hive tables stored in ORC format. 

1. Create an external table **STORED AS TEXTFILE** and load data from blob storage to the table.

		CREATE EXTERNAL TABLE IF NOT EXISTS <database name>.<external textfile table name>
		(
			field1 string,
			field2 int,
			...
			fieldN date
		)
		ROW FORMAT DELIMITED FIELDS TERMINATED BY '<field separator>' 
			lines terminated by '<line separator>' STORED AS TEXTFILE 
			LOCATION 'wasb:///<directory in Azure blob>' TBLPROPERTIES("skip.header.line.count"="1");

		LOAD DATA INPATH '<path to the source file>' INTO TABLE <database name>.<table name>;

2. Create an internal table with the same schema as the external table in step 1, with the same field delimiter, and store the Hive data in the ORC format.

		CREATE TABLE IF NOT EXISTS <database name>.<ORC table name> 
		(
			field1 string,
			field2 int,
			...
			fieldN date
		) 
		ROW FORMAT DELIMITED FIELDS TERMINATED BY '<field separator>' STORED AS ORC;

3. Select data from the external table in step 1 and insert into the ORC table

		INSERT OVERWRITE TABLE <database name>.<ORC table name>
            SELECT * FROM <database name>.<external textfile table name>;

	[AZURE.NOTE] If the TEXTFILE table *&#60;database name>.&#60;external textfile table name>* has partitions, in STEP 3, the `SELECT * FROM <database name>.<external textfile table name>` command will select the partition variable as a field in the returned data set. Inserting it into the *&#60;database name>.&#60;ORC table name>* will fail since *&#60;database name>.&#60;ORC table name>* does not have the partition variable as a field in the table schema. In this case, users need to specifically select the fields to be inserted to *&#60;database name>.&#60;ORC table name>* as follows:

		INSERT OVERWRITE TABLE <database name>.<ORC table name> PARTITION (<partition variable>=<partition value>)
		   SELECT field1, field2, ..., fieldN
		   FROM <database name>.<external textfile table name> 
		   WHERE <partition variable>=<partition value>;

4. It is safe to drop the *&#60;external textfile table name>* when using the following query after all data has been inserted into *&#60;database name>.&#60;ORC table name>*:

		DROP TABLE IF EXISTS <database name>.<external textfile table name>;

After following this procedure, you should have a table with data in the ORC format ready to use. 