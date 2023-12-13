---
title: Bulk loading into Apache Phoenix using psql - Azure HDInsight 
description: Use the psql tool to load bulk load data into Apache Phoenix tables in Azure HDInsight
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive
ms.date: 06/09/2023
---

# Bulk load data into Apache Phoenix using psql

[Apache Phoenix](https://phoenix.apache.org/) is an open source, massively parallel relational database built on [Apache HBase](../hbase/apache-hbase-overview.md). Phoenix provides SQL-like queries over HBase. Phoenix uses JDBC drivers to enable users to create, delete, and alter SQL tables, indexes, views and sequences, and upsert rows individually and in bulk. Phoenix uses noSQL native compilation rather than using MapReduce to compile queries, to create low-latency applications on top of HBase. Phoenix adds coprocessors to support running client-supplied code in the address space of the server, executing the code colocated with the data. This minimizes client/server data transfer.  To work with data using Phoenix in HDInsight, first create tables and then load data into them.

## Bulk loading with Apache Phoenix

There are multiple ways to get data into HBase including using client APIs, a MapReduce job with TableOutputFormat, or inputting the data manually using the HBase shell. Phoenix provides two methods for loading CSV data into Phoenix tables: a client loading tool named `psql`, and a MapReduce-based bulk load tool.

The `psql` tool is single-threaded and is best suited for loading megabytes or gigabytes of data. All CSV files to be loaded must have the '.csv' file extension.  You can also specify SQL script files in the `psql` command line with the '.sql' file extension.

Bulk loading with MapReduce is used for much larger data volumes, typically in production scenarios, as MapReduce uses multiple threads.

Before you start loading data, verify that Phoenix is enabled and that query timeout settings are as expected.  Access your HDInsight cluster [Apache Ambari](https://ambari.apache.org/) dashboard, select HBase, and then the Configuration tab.  Scroll down to verify that Apache Phoenix is set to `enabled` as shown:

:::image type="content" source="./media/apache-hbase-phoenix-psql/apache-ambari-phoenix.png" alt-text="Apache Phoenix HDInsight Cluster Settings" border="true":::

### Use `psql` to bulk load tables

1. Create a file called `createCustomersTable.sql`, and copy the code below into the file. Then save and close the file.

    ```sql
    CREATE TABLE Customers (
        ID varchar NOT NULL PRIMARY KEY,
        Name varchar,
        Income decimal,
        Age INTEGER,
        Country varchar);
    ```

1. Create a file called `listCustomers.sql`, and copy the code below into the file. Then save and close the file.

    ```sql
    SELECT * from Customers;
    ```

1. Create a file called `customers.csv`, and copy the code below into the file. Then save and close the file.

    ```txt
    1,Samantha,260000.0,18,US
    2,Sam,10000.5,56,US
    3,Anton,550150.0,42,Norway
    ```

1. Create a file called `customers2.csv`, and copy the code below into the file. Then save and close the file.

    ```txt
    4,Nicolle,180000.0,22,US
    5,Kate,210000.5,24,Canada
    6,Ben,45000.0,32,Poland
    ```

1. Open a command prompt and change directory to the location of the newly created files. Replace CLUSTERNAME, below, with the actual name of your HBase cluster. Then execute the code to upload the files to the headnode of your cluster:

    ```cmd
    scp customers.csv customers2.csv createCustomersTable.sql listCustomers.sql sshuser@CLUSTERNAME-ssh.azurehdinsight.net:/tmp
    ```

1. Use [ssh command](../hdinsight-hadoop-linux-use-ssh-unix.md) to connect to your cluster. Edit the command below by replacing CLUSTERNAME with the name of your cluster, and then enter the command:

    ```cmd
    ssh sshuser@CLUSTERNAME-ssh.azurehdinsight.net
    ```

1. From your ssh session, change directory to the location of the **psql** tool. Execute the command below:

    ```bash
    cd /usr/hdp/current/phoenix-client/bin
    ```

1. Bulk load the data. The code below will both create the **Customers** table and then upload the data.

    ```bash
    python psql.py /tmp/createCustomersTable.sql /tmp/customers.csv
    ```

    After the `psql` operation has completed, you should see a message similar as follows:

    ```output
    csv columns from database.
    CSV Upsert complete. 3 rows upserted
    Time: 0.081 sec(s)
    ```

1. You can continue to use `psql` to view the contents of the Customers table. Execute the code below:

    ```bash
    python psql.py /tmp/listCustomers.sql
    ```

    Alternatively, you can use [HBase shell](./query-hbase-with-hbase-shell.md), or [Apache Zeppelin](./apache-hbase-phoenix-zeppelin.md) to query the data.

1. Upload additional data. Now that the table already exists, the command specifies the table. Execute the command below:

    ```bash
    python psql.py -t CUSTOMERS /tmp/customers2.csv
    ```

## Use MapReduce to bulk load tables

For higher-throughput loading distributed over the cluster, use the MapReduce load tool. This loader first converts all data into HFiles, and then provides the created HFiles to HBase.

1. This section continues with the ssh session, and objects created earlier. Create the **Customers** table and **customers.csv** file as needed using the steps, above. If necessary, re-establish your ssh connection.

1. Truncate the contents of the **Customers** table. From your open ssh session, execute the commands below:

    ```bash
    hbase shell
    truncate 'CUSTOMERS'
    exit
    ```

1. Copy the `customers.csv` file from your headnode to Azure Storage.

    ```bash
    hdfs dfs -put /tmp/customers.csv wasbs:///tmp/customers.csv
    ```

1. Change to the execution directory for the MapReduce bulk load command:

    ```bash
    cd /usr/hdp/current/phoenix-client
    ```

1. Launch the CSV MapReduce loader by using the `hadoop` command with the Phoenix client jar:

    ```bash
    HADOOP_CLASSPATH=/usr/hdp/current/hbase-client/lib/hbase-protocol.jar:/etc/hbase/conf hadoop jar phoenix-client.jar org.apache.phoenix.mapreduce.CsvBulkLoadTool --table Customers --input /tmp/customers.csv
    ```

    Once the upload completes, you should see a message similar as follows:

    ```output
    19/12/18 18:30:57 INFO client.ConnectionManager$HConnectionImplementation: Closing master protocol: MasterService
    19/12/18 18:30:57 INFO client.ConnectionManager$HConnectionImplementation: Closing zookeeper sessionid=0x26f15dcceff02c3
    19/12/18 18:30:57 INFO zookeeper.ZooKeeper: Session: 0x26f15dcceff02c3 closed
    19/12/18 18:30:57 INFO zookeeper.ClientCnxn: EventThread shut down
    19/12/18 18:30:57 INFO mapreduce.AbstractBulkLoadTool: Incremental load complete for table=CUSTOMERS
    19/12/18 18:30:57 INFO mapreduce.AbstractBulkLoadTool: Removing output directory /tmp/50254426-aba6-400e-88eb-8086d3dddb6
    ```

1. To use MapReduce with Azure Data Lake Storage, locate the Data Lake Storage root directory, which is the `hbase.rootdir` value in `hbase-site.xml`. In the following command, the Data Lake Storage root directory is `adl://hdinsightconf1.azuredatalakestore.net:443/hbase1`. In this command, specify the Data Lake Storage input and output folders as parameters:

    ```bash
    cd /usr/hdp/current/phoenix-client

    $HADOOP_CLASSPATH=$(hbase mapredcp):/etc/hbase/conf hadoop jar /usr/hdp/2.4.2.0-258/phoenix/phoenix-4.4.0.2.4.2.0-258-client.jar

    org.apache.phoenix.mapreduce.CsvBulkLoadTool --table Customers --input adl://hdinsightconf1.azuredatalakestore.net:443/hbase1/data/hbase/temp/input/customers.csv –zookeeper ZookeeperQuorum:2181:/hbase-unsecure --output  adl://hdinsightconf1.azuredatalakestore.net:443/hbase1/data/hbase/output1
    ```

1. To query and view the data, you can use **psql** as described earlier. You can also use [HBase shell](./query-hbase-with-hbase-shell.md), or [Apache Zeppelin](./apache-hbase-phoenix-zeppelin.md).

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
* [Use Apache Phoenix with Linux-based Apache HBase clusters in HDInsight](../hbase/apache-hbase-query-with-phoenix.md)
* [Salted Tables](https://phoenix.apache.org/salted.html)
* [Apache Phoenix Grammar](https://phoenix.apache.org/language/index.html)
