---
title: Bulk loading into Apache Phoenix using psql - Azure HDInsight 
description: Use the psql tool to load bulk load data into Phoenix tables.
author: ashishthaps
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 11/10/2017
ms.author: ashishth

---
# Bulk load data into Apache Phoenix using psql

[Apache Phoenix](https://phoenix.apache.org/) is an open source, massively parallel relational database built on [Apache HBase](../hbase/apache-hbase-overview.md). Phoenix provides SQL-like queries over HBase. Phoenix uses JDBC drivers to enable users to create, delete, and alter SQL tables, indexes, views and sequences, and upsert rows individually and in bulk. Phoenix uses noSQL native compilation rather than using MapReduce to compile queries, to create low-latency applications on top of HBase. Phoenix adds co-processors to support running client-supplied code in the address space of the server, executing the code co-located with the data. This minimizes client/server data transfer.  To work with data using Phoenix in HDInsight, first create tables and then load data into them.

## Bulk loading with Apache Phoenix

There are multiple ways to get data into HBase including using client APIs, a MapReduce job with TableOutputFormat, or inputting the data manually using the HBase shell. Phoenix provides two methods for loading CSV data into Phoenix tables: a client loading tool named `psql`, and a MapReduce-based bulk load tool.

The `psql` tool is single-threaded and is best suited for loading megabytes or gigabytes of data. All CSV files to be loaded must have the '.csv' file extension.  You can also specify SQL script files in the `psql` command line with the '.sql' file extension.

Bulk loading with MapReduce is used for much larger data volumes, typically in production scenarios, as MapReduce uses multiple threads.

Before you start loading data, verify that Phoenix is enabled and that query timeout settings are as expected.  Access your HDInsight cluster [Apache Ambari](https://ambari.apache.org/) dashboard, select HBase, and then the Configuration tab.  Scroll down to verify that Apache Phoenix is set to `enabled` as shown:

![Apache Phoenix HDInsight Cluster Settings](./media/apache-hbase-phoenix-psql/ambari-phoenix.png)

### Use `psql` to bulk load tables

1. Create a new table, then save your query with filename `createCustomersTable.sql`.

    ```sql
    CREATE TABLE Customers (
        ID varchar NOT NULL PRIMARY KEY,
        Name varchar,
        Income decimal,
        Age INTEGER,
        Country varchar);
    ```

2. Copy your CSV file (example contents shown) as `customers.csv` into a `/tmp/` directory for loading into your newly created table.  Use the `hdfs` command to copy the CSV file to your desired source location.

    ```
    1,Samantha,260000.0,18,US
    2,Sam,10000.5,56,US
    3,Anton,550150.0,Norway
    ... 4997 more rows 
    ```

    ```bash
    hdfs dfs -copyToLocal /example/data/customers.csv /tmp/
    ```

3. Create a SQL SELECT query to verify the input data loaded properly, then save your query with filename `listCustomers.sql`. You can use any SQL query.
     ```sql
    SELECT Name, Income from Customers group by Country;
    ```

4. Bulk load the data by opening a *new* Hadoop command window. First change to the execution directory location with the `cd` command, and then use the `psql` tool (Python `psql.py` command). 

    The following example expects that you copied the `customers.csv` file from a storage account to your local temp directory using `hdfs` as in step 2 above.

    ```bash
    cd /usr/hdp/current/phoenix-client/bin

    python psql.py ZookeeperQuorum createCustomersTable.sql /tmp/customers.csv listCustomers.sql
    ```

    > [!NOTE]   
    > To determine the `ZookeeperQuorum` name, locate the [Apache ZooKeeper](https://zookeeper.apache.org/) quorum string in the file `/etc/hbase/conf/hbase-site.xml` with property name `hbase.zookeeper.quorum`.

5. After the `psql` operation has completed, you should see a message in your command window:

    ```
    CSV Upsert complete. 5000 rows upserted
    Time: 4.548 sec(s)
    ```

## Use MapReduce to bulk load tables

For higher-throughput loading distributed over the cluster, use the MapReduce load tool. This loader first converts all data into HFiles, and then provides the created HFiles to HBase.

1. Launch the CSV MapReduce loader by using the `hadoop` command with the Phoenix client jar:

    ```bash
    hadoop jar phoenix-<version>-client.jar org.apache.phoenix.mapreduce.CsvBulkLoadTool --table CUSTOMERS --input /data/customers.csv
    ```

2. Create a new table with a SQL statement, as with `CreateCustomersTable.sql` in the previous step 1.

3. To verify the schema of your table, run `!describe inputTable`.

4. Determine the location path to your input data, such as the example `customers.csv` file. The input files may be in your WASB/ADLS storage account. In this example scenario, the input files are in the `<storage account parent>/inputFolderBulkLoad` directory.

5. Change to the execution directory for the MapReduce bulk load command:

    ```bash
    cd /usr/hdp/current/phoenix-client/bin
    ```

6. Locate your `ZookeeperQuorum` value in `/etc/hbase/conf/hbase-site.xml`, with property name `hbase.zookeeper.quorum`.

7. Set up the classpath and run the `CsvBulkLoadTool` tool command:

    ```bash
    /usr/hdp/current/phoenix-client$ HADOOP_CLASSPATH=/usr/hdp/current/hbase-client/lib/hbase-protocol.jar:/etc/hbase/conf hadoop jar /usr/hdp/2.4.2.0-258/phoenix/phoenix-4.4.0.2.4.2.0-258-client.jar

    org.apache.phoenix.mapreduce.CsvBulkLoadTool --table Customers --input /inputFolderBulkLoad/customers.csv –zookeeper ZookeeperQuorum:2181:/hbase-unsecure
    ```

8. To use MapReduce with Azure Data Lake Storage, locate the Data Lake Storage root directory, which is the `hbase.rootdir` value in `hbase-site.xml`. In the following command, the Data Lake Storage root directory is `adl://hdinsightconf1.azuredatalakestore.net:443/hbase1`. In this command, specify the Data Lake Storage input and output folders as parameters:

    ```bash
    cd /usr/hdp/current/phoenix-client

    $HADOOP_CLASSPATH=$(hbase mapredcp):/etc/hbase/conf hadoop jar /usr/hdp/2.4.2.0-258/phoenix/phoenix-4.4.0.2.4.2.0-258-client.jar

    org.apache.phoenix.mapreduce.CsvBulkLoadTool --table Customers --input adl://hdinsightconf1.azuredatalakestore.net:443/hbase1/data/hbase/temp/input/customers.csv –zookeeper ZookeeperQuorum:2181:/hbase-unsecure --output  adl://hdinsightconf1.azuredatalakestore.net:443/hbase1/data/hbase/output1
    ```

## Recommendations

* Use the same storage medium for both input and output folders, either Azure Storage (WASB) or Azure Data Lake Storage (ADL). To transfer data from Azure Storage to Data Lake Storage, you can use the `distcp` command:

    ```bash
    hadoop distcp wasb://@.blob.core.windows.net/example/data/gutenberg adl://.azuredatalakestore.net:443/myfolder
    ```

* Use larger-size worker nodes. The map processes of the MapReduce bulk copy produce large amounts of temporary output that fill up the available non-DFS space. For a large amount of bulk loading, use more and larger-size worker nodes. The number of worker nodes you allocate to your cluster directly affects the processing speed.

* Split input files into ~10-GB chunks. Bulk loading is a storage-intensive operation, so splitting your input files into multiple chunks results in better performance.

* Avoid region server hotspots. If your row key is monotonically increasing, HBase sequential writes may induce region server hotspotting. *Salting* the row key reduces sequential writes. Phoenix provides a way to transparently salt the row key with a salting byte for a particular table, as referenced below.

## Next steps

* [Bulk Data Loading with Apache Phoenix](https://phoenix.apache.org/bulk_dataload.html)
* [Use Apache Phoenix with Linux-based Apache HBase clusters in HDInsight](../hbase/apache-hbase-phoenix-squirrel-linux.md)
* [Salted Tables](https://phoenix.apache.org/salted.html)
* [Apache Phoenix Grammar](https://phoenix.apache.org/language/index.html)
