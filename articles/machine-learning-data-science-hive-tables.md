<properties 
	pageTitle="Create and load data into Hive tables from Azure blob storage | Azure" 
	description="Create Hive tables and load data in blob to hive tables" 
	metaKeywords="" 
	services="machine-learning" 
	solutions="" 
	documentationCenter="" 
	authors="hangzh-msft" 
	manager="paulettm" 
	editor="cgronlun"  />

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/16/2015" 
	ms.author="hangzh;bradsev" />

 
#Create and load data into Hive tables from Azure blob storage
 
In this document, generic Hive queries that create Hive tables and load data from Azure blob storage are presented. These Hive queries are shared in the GitHub repository. [Github repository](https://github.com/Azure/Azure-MachineLearning-DataScience/tree/master/Misc/DataScienceProcess/DataScienceScripts/sample_hive_create_db_tbls_load_data_generic.hql). 


If you create an Azure virtual machine by following the instructions in "Set Up an Azure Virtual Machine with IPython Notebook Server", this script file has been downloaded to the `C:\Users\<user name>\Documents\Data Science Scripts` directory on the virtual machine. You need to plug in your own data schema and Azure blob storage configuration in the corresponding fields in these queries and these Hive queries should be ready for submission. 

We assume that the data for Hive tables is in **uncompressed** tabular format, and the data has been uploaded to the default or additional container of the storage account used by the Hadoop cluster. If users want to practice on the _NYC Taxi Trip Data_, they need to first [download all 24 files](http://www.andresmh.com/nyctaxitrips/) (12 Trip files, and 12 Fair files), **unzip** all files into .csv files, and upload them to the default or additional container of the Azure storage account that are used when the [Azure HDInsight Hadoop cluster is customized](machine-learning-data-science-customize-hadoop-cluster.html). 

Hive queries can be submitted in the Hadoop Command Line on the head node of the Hadoop cluster. You need to:

1. [Enable remote access to the head node of the Hadoop cluster, and log on to the head node](machine-learning-data-science-customize-hadoop-cluster.md).
2. [Submit the Hive queries in the Hadoop Command Line on the head node](machine-learning-data-science-hive-queries.md).

Users can also use [Query Console (Hive Editor)] by entering the URL in a web browser `https://<Hadoop cluster name>.azurehdinsight.net/Home/HiveEditor (you will be asked to input the Hadoop cluster credentials to log in), or can [submit Hive jobs using PowerShell](hdinsight-submit-hadoop-jobs-programmatically.md). 

- [Step 1: Create Hive database and tables](#create-tables)
- [Step 2: Load data to Hive tables](#load-data)
- [Advanced topics: partitioned table and store Hive data in ORC format](#partition-orc)

## <a name="create-tables"></a>Create Hive database and tables

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

- `<database name>`: the name of the database users want to create. If users just want to use the default database, the query `create database...` can be omitted. 
- `<table name>`: the name of the table users want to create within the specified database. If users want to use the default database, the table can be directly referred by `<table name>` without `<database name>.`.
- `<field separator>`: the separator that separates fields in the data file to be uploaded to the Hive table. 
- `<line separator>`: the separator that separates lines in the data file. 
- `<storage location>`: the Azure storage location to save the data of Hive tables. If users do not specify `LOCATION '<storage location>'`, by default the database and the tables are stored in `hive/warehouse/` directory in the default container of the Hive cluster. If a user wants to specify the storage location,  the storage location has to be within the default container for the database and tables. This location has to be referred as relative location to the default container of the cluster in the format of `'wasb:///<directory 1>/'` or `'wasb:///<directory 1>/<directory 2>/'`, etc. After the query is executed, the relative directories will be created within the default container. 
- `TBLPROPERTIES("skip.header.line.count"="1")`: If the data file has a header line, users have to add this property at the **end** of the `create table` query. Otherwise, the header line will be loaded as a record to the table. If the data file does not have a header line, this configuration can be omitted in the query. 

## <a name="load-data"></a>Load data to Hive tables

    LOAD DATA INPATH '<path to blob data>' INTO TABLE <database name>.<table name>;

- `<path to blob data>`: If the blob file to be uploaded to Hive table is in the default container of the HDInsight Hadoop cluster, the `<path to blob data>` should be in the format `'wasb:///<directory in this container>/<blob file name>'`. The blob file can also be in the additional container of the HDInsight Hadoop cluster. In this case, `<path to blob data>` should be in the format `'wasb://<container name>@<storage account name>.blob.windows.core.net/<blob file name>'`.
>[AZURE.NOTE] The blob data to be uploaded to Hive table has to be in the default or additional container of the storage account for the Hadoop cluster. Otherwise, the `LOAD DATa` query will fail complaining that it cannot access the data. 


## <a name="partition-orc"></a>Advanced topics: partitioned table and store Hive data in ORC format

If the data is large, partitioning the table will be beneficial for queries that only need to scan a few partitions of the table. For instance,  it is reasonable to partition the log data of a web site by dates. 

In addition to partition the table, it is also beneficial to store the Hive data in ORC format. ORC stands for "Optimized Row Columnar".  Please refer to _"[Using ORC files improves performance when Hive is reading, writing, and processing data](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+ORC#LanguageManualORC-ORCFiles)."_ for more details.

### Partitioned table

The queries of creating a partitioned table and loading data to it are as follows:

    CREATE EXTERNAL TABLE IF NOT EXISTS <database name>.<table name>
	(field1 string,
	...
	fieldN string
	)
    PARTITIONED BY (<partitionfieldname> vartype) ROW FORMAT DELIMITED FIELDS TERMINATED BY '<field separator>'
		 lines terminated by '<line separator>' TBLPROPERTIES("skip.header.line.count"="1");
	LOAD DATA INPATH '<path to the source file>' INTO TABLE <database name>.<partitioned table name> 
		PARTITION (<partitionfieldname>=<partitionfieldvalue>);

When querying partitioned tables, it is recommended to add the partition condition in the **beginning** of the `where` clause so that the searching efficacy can be significantly improved. 

    select 
		field1, field2, ..., fieldN
	from <database name>.<partitioned table name> 
	where <partitionfieldname>=<partitionfieldvalue> and ...;

### <a name="orc"></a>Store Hive data in ORC format

Users cannot directly load data in blob to Hive tables in ORC storage format. Here are the steps that the users need to take in order to load data from Azure blobs to Hive tables stored in ORC format. 

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

2. Create an internal table with the same schema as the external table in step 1, and the same field delimiter. And store the Hive data in the ORC format

		CREATE TABLE IF NOT EXISTS <database name>.<ORC table name> 
		(
			field1 string,
			field2 int,
			...
			fieldN date
		) 
		ROW FORMAT DELIMITED FIELDS TERMINATED BY '<field separator>' STORED AS ORC;

3. Select data from the external table in step 1 and insert into the ORC table

		INSERT OVERWRITE TABLE <database name>.<ORC table name> SELECT * FROM <database name>.<external textfile table name>;

[AZURE.NOTE] If the TEXTFILE table `<database name>.<external textfile table name>` has partitions, in STEP 3, `SELECT * FROM <database name>.<external textfile table name>` will select the partition variable as a field in the returned data set. Inserting it to the `<database name>.<ORC table name>` will fail since `<database name>.<ORC table name>` does not have the partition variable as a field in the table schema. In this case, users need to specifically select the fields to be inserted to `<database name>.<ORC table name>` like follows:

		INSERT OVERWRITE TABLE <database name>.<ORC table name> PARTITION (<partition variable>=<partition value>)
		      SELECT field1, field2, ..., fieldN
		      FROM <database name>.<external textfile table name> 
		      WHERE <partition variable>=<partition value>;

4. It is safe to drop the `<external textfile table name>` using the following query after all data has been inserted into `<database name>.<ORC table name>`:

		DROP TABLE IF EXISTS <database name>.<external textfile table name>;

Now we have a table with data in the ORC format ready to use. 
