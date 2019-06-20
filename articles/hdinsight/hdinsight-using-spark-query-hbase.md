---
title: Use Spark to read and write HBase data - Azure HDInsight
description: Use the Spark HBase Connector to read and write data from a Spark cluster to an HBase cluster.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 06/06/2019
---

# Use Apache Spark to read and write Apache HBase data

Apache HBase is typically queried either with its low-level API (scans, gets, and puts) or with a SQL syntax using Apache Phoenix. Apache also provides the Apache Spark HBase Connector, which is a convenient and performant alternative to query and modify data stored by HBase.

## Prerequisites

* Two separate HDInsight clusters deployed in the same virtual network. One HBase, and one Spark with at least Spark 2.1 (HDInsight 3.6) installed. For more information, see [Create Linux-based clusters in HDInsight using the Azure portal](hdinsight-hadoop-create-linux-clusters-portal.md).

* An SSH client. For more information, see [Connect to HDInsight (Apache Hadoop) using SSH](hdinsight-hadoop-linux-use-ssh-unix.md).

* The [URI scheme](hdinsight-hadoop-linux-information.md#URI-and-scheme) for your clusters primary storage. This would be wasb:// for Azure Blob Storage, abfs:// for Azure Data Lake Storage Gen2 or adl:// for Azure Data Lake Storage Gen1. If secure transfer is enabled for Blob Storage or Data Lake Storage Gen2, the URI would be wasbs:// or abfss://, respectively  See also, [secure transfer](../storage/common/storage-require-secure-transfer.md).

## Overall process

The high-level process for enabling your Spark cluster to query your HDInsight cluster is as follows:

1. Prepare some sample data in HBase.
2. Acquire the hbase-site.xml file from your HBase cluster configuration folder (/etc/hbase/conf).
3. Place a copy of hbase-site.xml in your Spark 2 configuration folder (/etc/spark2/conf).
4. Run `spark-shell` referencing the Spark HBase Connector by its Maven coordinates in the `packages` option.
5. Define a catalog that maps the schema from Spark to HBase.
6. Interact with the HBase data using either the RDD or DataFrame APIs.

## Prepare sample data in Apache HBase

In this step, you create and populate a table in Apache HBase that you can then query using Spark.

1. Use the `ssh` command to connect to your HBase cluster. Edit the command below by replacing `HBASECLUSTER` with the name of your HBase cluster, and then enter the command:

    ```cmd
    ssh sshuser@HBASECLUSTER-ssh.azurehdinsight.net
    ```

2. Use the `hbase shell` command to start the HBase interactive shell. Enter the following command in your SSH connection:

    ```bash
    hbase shell
    ```

3. Use the `create` command to create an HBase table with two-column families. Enter the following command:

    ```hbase
    create 'Contacts', 'Personal', 'Office'
    ```

4. Use the `put` command to insert values at a specified column in a specified row in a particular table. Enter the following command:

    ```hbase
    put 'Contacts', '1000', 'Personal:Name', 'John Dole'
    put 'Contacts', '1000', 'Personal:Phone', '1-425-000-0001'
    put 'Contacts', '1000', 'Office:Phone', '1-425-000-0002'
    put 'Contacts', '1000', 'Office:Address', '1111 San Gabriel Dr.'
    put 'Contacts', '8396', 'Personal:Name', 'Calvin Raji'
    put 'Contacts', '8396', 'Personal:Phone', '230-555-0191'
    put 'Contacts', '8396', 'Office:Phone', '230-555-0191'
    put 'Contacts', '8396', 'Office:Address', '5415 San Gabriel Dr.'
    ```

5. Use the `exit` command to stop the HBase interactive shell. Enter the following command:

    ```hbase
    exit
    ```

## Copy hbase-site.xml to Spark cluster

Copy the hbase-site.xml from local storage to the root of your Spark cluster's default storage.  Edit the command below to reflect your configuration.  Then, from your open SSH session to the HBase cluster, enter the command:

| Syntax value | New value|
|---|---|
|[URI scheme](hdinsight-hadoop-linux-information.md#URI-and-scheme) | Modify to reflect your storage.  The syntax below is for blob storage with secure transfer enabled.|
|`SPARK_STORAGE_CONTAINER`|Replace with the default storage container name used for the Spark cluster.|
|`SPARK_STORAGE_ACCOUNT`|Replace with the default storage account name used for the Spark cluster.|

```bash
hdfs dfs -copyFromLocal /etc/hbase/conf/hbase-site.xml wasbs://SPARK_STORAGE_CONTAINER@SPARK_STORAGE_ACCOUNT.blob.core.windows.net/
```

Then exit your ssh connection to your HBase cluster.

## Put hbase-site.xml on your Spark cluster

1. Connect to the head node of your Spark cluster using SSH.

2. Enter the command below to copy `hbase-site.xml` from your Spark cluster's default storage to the Spark 2 configuration folder on the cluster's local storage:

    ```bash
    sudo hdfs dfs -copyToLocal /hbase-site.xml /etc/spark2/conf
    ```

## Run Spark Shell referencing the Spark HBase Connector

1. From your open SSH session to the Spark cluster, enter the command below to start a spark shell:

    ```bash
    spark-shell --packages com.hortonworks:shc-core:1.1.1-2.1-s_2.11 --repositories https://repo.hortonworks.com/content/groups/public/
    ```  

2. Keep this Spark Shell instance open and continue to the next step.

## Define a Catalog and Query

In this step, you define a catalog object that maps the schema from Apache Spark to Apache HBase.  

1. In your open Spark Shell, enter the following `import` statements:

    ```scala
    import org.apache.spark.sql.{SQLContext, _}
    import org.apache.spark.sql.execution.datasources.hbase._
    import org.apache.spark.{SparkConf, SparkContext}
    import spark.sqlContext.implicits._
    ```  

2. Enter the command below to define a catalog for the Contacts table you created in HBase:

    ```scala
    def catalog = s"""{
        |"table":{"namespace":"default", "name":"Contacts"},
        |"rowkey":"key",
        |"columns":{
        |"rowkey":{"cf":"rowkey", "col":"key", "type":"string"},
        |"officeAddress":{"cf":"Office", "col":"Address", "type":"string"},
        |"officePhone":{"cf":"Office", "col":"Phone", "type":"string"},
        |"personalName":{"cf":"Personal", "col":"Name", "type":"string"},
        |"personalPhone":{"cf":"Personal", "col":"Phone", "type":"string"}
        |}
    |}""".stripMargin
    ```

    The code performs the following:  

     a. Define a catalog schema for the HBase table named `Contacts`.  
     b. Identify the rowkey as `key`, and map the column names used in Spark to the column family, column name, and column type as used in HBase.  
     c. The rowkey also has to be defined in detail as a named column (`rowkey`), which has a specific column family `cf` of `rowkey`.  

3. Enter the command below to define a method that provides a DataFrame around your `Contacts` table in HBase:

    ```scala
    def withCatalog(cat: String): DataFrame = {
        spark.sqlContext
        .read
        .options(Map(HBaseTableCatalog.tableCatalog->cat))
        .format("org.apache.spark.sql.execution.datasources.hbase")
        .load()
     }
    ```

4. Create an instance of the DataFrame:

    ```scala
    val df = withCatalog(catalog)
    ```  

5. Query the DataFrame:

    ```scala
    df.show()
    ```

6. You should see two rows of data:

        +------+--------------------+--------------+-------------+--------------+
        |rowkey|       officeAddress|   officePhone| personalName| personalPhone|
        +------+--------------------+--------------+-------------+--------------+
        |  1000|1111 San Gabriel Dr.|1-425-000-0002|    John Dole|1-425-000-0001|
        |  8396|5415 San Gabriel Dr.|  230-555-0191|  Calvin Raji|  230-555-0191|
        +------+--------------------+--------------+-------------+--------------+

7. Register a temporary table so you can query the HBase table using Spark SQL:

    ```scala
    df.createTempView("contacts")
    ```

8. Issue a SQL query against the `contacts` table:

    ```scala
    val query = spark.sqlContext.sql("select personalName, officeAddress from contacts")
    query.show()
    ```

9. You should see results like these:

    ```output
    +-------------+--------------------+
    | personalName|       officeAddress|
    +-------------+--------------------+
    |    John Dole|1111 San Gabriel Dr.|
    |  Calvin Raji|5415 San Gabriel Dr.|
    +-------------+--------------------+
    ```

## Insert new data

1. To insert a new Contact record, define a `ContactRecord` class:

    ```scala
    case class ContactRecord(
        rowkey: String,
        officeAddress: String,
        officePhone: String,
        personalName: String,
        personalPhone: String
        )
    ```

2. Create an instance of `ContactRecord` and put it in an array:

    ```scala
    val newContact = ContactRecord("16891", "40 Ellis St.", "674-555-0110", "John Jackson","230-555-0194")

    var newData = new Array[ContactRecord](1)
    newData(0) = newContact
    ```

3. Save the array of new data to HBase:

    ```scala
    sc.parallelize(newData).toDF.write.options(Map(HBaseTableCatalog.tableCatalog -> catalog, HBaseTableCatalog.newTable -> "5")).format("org.apache.spark.sql.execution.datasources.hbase").save()
    ```

4. Examine the results:

    ```scala  
    df.show()
    ```

5. You should see output like this:

    ```output
    +------+--------------------+--------------+------------+--------------+
    |rowkey|       officeAddress|   officePhone|personalName| personalPhone|
    +------+--------------------+--------------+------------+--------------+
    |  1000|1111 San Gabriel Dr.|1-425-000-0002|   John Dole|1-425-000-0001|
    | 16891|        40 Ellis St.|  674-555-0110|John Jackson|  230-555-0194|
    |  8396|5415 San Gabriel Dr.|  230-555-0191| Calvin Raji|  230-555-0191|
    +------+--------------------+--------------+------------+--------------+
    ```

6. Close the spark shell by entering the following command:

    ```scala
    :q
    ```

## Next steps

* [Apache Spark HBase Connector](https://github.com/hortonworks-spark/shc)
