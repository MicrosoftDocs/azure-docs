---
title: Use Spark to read and write HBase data - Azure HDInsight
description: Use the Spark HBase Connector to read and write data from a Spark cluster to an HBase cluster.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive,seoapr2020
ms.date: 12/09/2022
---

# Use Apache Spark to read and write Apache HBase data

Apache HBase is typically queried either with its low-level API (scans, gets, and puts) or with a SQL syntax using Apache Phoenix. Apache also provides the Apache Spark HBase Connector. The Connector is a convenient and efficient alternative to query and modify data stored by HBase.

## Prerequisites

* Two separate HDInsight clusters deployed in the same [virtual network](./hdinsight-plan-virtual-network-deployment.md). One HBase, and one Spark with at least Spark 2.1 (HDInsight 3.6) installed. For more information, see [Create Linux-based clusters in HDInsight using the Azure portal](hdinsight-hadoop-create-linux-clusters-portal.md).

* The URI scheme for your clusters primary storage. This scheme would be wasb:// for Azure Blob Storage, `abfs://` for Azure Data Lake Storage Gen2 or adl:// for Azure Data Lake Storage Gen1. If secure transfer is enabled for Blob Storage, the URI would be `wasbs://`.  See also, [secure transfer](../storage/common/storage-require-secure-transfer.md).

## Overall process

The high-level process for enabling your Spark cluster to query your HBase cluster is as follows:

1. Prepare some sample data in HBase.
2. Acquire the hbase-site.xml file from your HBase cluster configuration folder (/etc/hbase/conf), and place a copy of hbase-site.xml in your Spark 2 configuration folder (/etc/spark2/conf). (OPTIONAL: use script provided by HDInsight team to automate this process)
4. Run `spark-shell` referencing the Spark HBase Connector by its Maven coordinates in the `packages` option.
5. Define a catalog that maps the schema from Spark to HBase.
6. Interact with the HBase data using either the RDD or DataFrame APIs.

## Prepare sample data in Apache HBase

In this step, you create and populate a table in Apache HBase that you can then query using Spark.

1. Use the `ssh` command to connect to your HBase cluster. Edit the command by replacing `HBASECLUSTER` with the name of your HBase cluster, and then enter the command:

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
    
## Run scripts to set up connection between clusters

To set up the communication between clusters, follow the steps to run two scripts on your clusters. These scripts will automate the process of file copying described in 'Set up communication manually' section. 

* The script you run from the HBase cluster will upload `hbase-site.xml` and HBase IP-mapping information to the default storage attached to your Spark cluster. 
* The script that you run from the Spark cluster sets up two cron jobs to run two helper scripts periodically:  
    1.	HBase cron job – download new `hbase-site.xml` files and HBase IP mapping from Spark default storage account to local node
    2.	Spark cron job – checks if a Spark scaling occurred and if cluster is secure. If so, edit `/etc/hosts` to include HBase IP mapping stored locally

__NOTE__: Before proceeding, make sure you've added the Spark cluster’s storage account to your HBase cluster as secondary storage account. Make sure you the scripts in order as indicated.


1. Use [Script Action](hdinsight-hadoop-customize-cluster-linux.md#script-action-to-a-running-cluster) on your HBase cluster to apply the changes with the following considerations: 


    |Property | Value |
    |---|---|
    |Bash script URI|`https://hdiconfigactions.blob.core.windows.net/hbasesparkconnectorscript/connector-hbase.sh`|
    |Node type(s)|Region|
    |Parameters|`-s SECONDARYS_STORAGE_URL`|
    |Persisted|yes|

    * `SECONDARYS_STORAGE_URL` is the url of the Spark side default storage. Parameter Example: `-s wasb://sparkcon-2020-08-03t18-17-37-853z@sparkconhdistorage.blob.core.windows.net`


2.	Use Script Action on your Spark cluster to apply the changes with the following considerations:

    |Property | Value |
    |---|---|
    |Bash script URI|`https://hdiconfigactions.blob.core.windows.net/hbasesparkconnectorscript/connector-spark.sh`|
    |Node type(s)|Head, Worker, Zookeeper|
    |Parameters|`-s "SPARK-CRON-SCHEDULE"` (optional) `-h "HBASE-CRON-SCHEDULE"` (optional)|
    |Persisted|yes|


    * You can specify how often you want this cluster to automatically check if update. Default: -s “*/1 * * * *” -h 0 (In this example, the Spark cron runs every minute, while the HBase cron doesn't run)
    * Since HBase cron isn't set up by default, you need to rerun this script when perform scaling to your HBase cluster. If your HBase cluster scales often, you may choose to set up HBase cron job automatically. For example: `-h "*/30 * * * *"` configures the script to perform checks every 30 minutes. This will run HBase cron schedule periodically to automate downloading of new HBase information on the common storage account to local node.
    
    

## Set up communication manually (Optional, if provided script in above step fails)

__NOTE:__ These steps need to perform every time one of the clusters undergoes a scaling activity.

1. Copy the hbase-site.xml from local storage to the root of your Spark cluster's default storage.  Edit the command to reflect your configuration.  Then, from your open SSH session to the HBase cluster, enter the command:

    | Syntax value | New value|
    |---|---|
    |[URI scheme](hdinsight-hadoop-linux-information.md#URI-and-scheme) | Modify to reflect your storage.  The syntax is for blob storage with secure transfer enabled.|
    |`SPARK_STORAGE_CONTAINER`|Replace with the default storage container name used for the Spark cluster.|
    |`SPARK_STORAGE_ACCOUNT`|Replace with the default storage account name used for the Spark cluster.|

    ```bash
    hdfs dfs -copyFromLocal /etc/hbase/conf/hbase-site.xml wasbs://SPARK_STORAGE_CONTAINER@SPARK_STORAGE_ACCOUNT.blob.core.windows.net/
    ```

2. Then exit your ssh connection to your HBase cluster.

    ```bash
    exit
    ```


3. Connect to the head node of your Spark cluster using SSH. Edit the command by replacing `SPARKCLUSTER` with the name of your Spark cluster, and then enter the command:

    ```cmd
    ssh sshuser@SPARKCLUSTER-ssh.azurehdinsight.net
    ```

4. Enter the command to copy `hbase-site.xml` from your Spark cluster's default storage to the Spark 2 configuration folder on the cluster's local storage:

    ```bash
    sudo hdfs dfs -copyToLocal /hbase-site.xml /etc/spark2/conf
    ```

## Run Spark Shell referencing the Spark HBase Connector

After you complete the preceding step, you should be able to run Spark shell, referencing the appropriate version of Spark HBase Connector.

As an example, the following table lists two versions and the corresponding commands the HDInsight team currently uses. You can use the same versions for your clusters if the versions of HBase and Spark are same as indicated in the table. 


1. In your open SSH session to the Spark cluster, enter the following command to start a Spark shell:

    |Spark version| HDI HBase version  | SHC version    |  Command  |
    | :-----------:| :----------: | :-----------: |:----------- |
    |      2.1    | HDI 3.6 (HBase 1.1) | 1.1.1-2.1-s_2.11    | `spark-shell --packages com.hortonworks:shc-core:1.1.1-2.1-s_2.11 --repositories https://repo.hortonworks.com/content/groups/public/` |
    

2. Keep this Spark shell instance open and continue to [Define a catalog and query](#define-a-catalog-and-query). If you don't find the jars that correspond to your versions in the SHC Core repository, continue reading. 

For subsequent combinations of Spark and HBase versions, these artifacts are no longer published at above repo. You can build the jars directly from the [spark-hbase-connector](https://github.com/hortonworks-spark/shc) GitHub branch. For example, if you're running with Spark 2.4 and HBase 2.1, complete these steps:

1. Clone the repo:

    ```bash
    git clone https://github.com/hortonworks-spark/shc
    ```
    
2. Go to branch-2.4:

    ```bash
    git checkout branch-2.4
    ```

3. Build from the branch (creates a .jar file):

    ```bash
    mvn clean package -DskipTests
    ```
    
3. Run the following command (be sure to change the .jar name that corresponds to the .jar file you built):

    ```bash
    spark-shell --jars <path to your jar>,/usr/hdp/current/hbase-client/lib/shaded-clients/*
    ```
    
4. Keep this Spark shell instance open and continue to the next section. 



## Define a catalog and query

In this step, you define a catalog object that maps the schema from Apache Spark to Apache HBase.  

1. In your open Spark Shell, enter the following `import` statements:

    ```scala
    import org.apache.spark.sql.{SQLContext, _}
    import org.apache.spark.sql.execution.datasources.hbase._
    import org.apache.spark.{SparkConf, SparkContext}
    import spark.sqlContext.implicits._
    ```  

1. Enter the command below to define a catalog for the Contacts table you created in HBase:

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

    The code:  

    1. Defines a catalog schema for the HBase table named `Contacts`.  
    1. Identifies the rowkey as `key`, and map the column names used in Spark to the column family, column name, and column type as used in HBase.  
    1. Defines the rowkey in detail as a named column (`rowkey`), which has a specific column family `cf` of `rowkey`.  

1. Enter the command to define a method that provides a DataFrame around your `Contacts` table in HBase:

    ```scala
    def withCatalog(cat: String): DataFrame = {
        spark.sqlContext
        .read
        .options(Map(HBaseTableCatalog.tableCatalog->cat))
        .format("org.apache.spark.sql.execution.datasources.hbase")
        .load()
     }
    ```

1. Create an instance of the DataFrame:

    ```scala
    val df = withCatalog(catalog)
    ```  

1. Query the DataFrame:

    ```scala
    df.show()
    ```

    You should see two rows of data:

    ```output
    +------+--------------------+--------------+-------------+--------------+
    |rowkey|       officeAddress|   officePhone| personalName| personalPhone|
    +------+--------------------+--------------+-------------+--------------+
    |  1000|1111 San Gabriel Dr.|1-425-000-0002|    John Dole|1-425-000-0001|
    |  8396|5415 San Gabriel Dr.|  230-555-0191|  Calvin Raji|  230-555-0191|
    +------+--------------------+--------------+-------------+--------------+
    ```

1. Register a temporary table so you can query the HBase table using Spark SQL:

    ```scala
    df.createTempView("contacts")
    ```

1. Issue a SQL query against the `contacts` table:

    ```scala
    spark.sqlContext.sql("select personalName, officeAddress from contacts").show
    ```

    You should see results like these:

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

1. Create an instance of `ContactRecord` and put it in an array:

    ```scala
    val newContact = ContactRecord("16891", "40 Ellis St.", "674-555-0110", "John Jackson","230-555-0194")

    var newData = new Array[ContactRecord](1)
    newData(0) = newContact
    ```

1. Save the array of new data to HBase:

    ```scala
    sc.parallelize(newData).toDF.write.options(Map(HBaseTableCatalog.tableCatalog -> catalog, HBaseTableCatalog.newTable -> "5")).format("org.apache.spark.sql.execution.datasources.hbase").save()
    ```

1. Examine the results:

    ```scala  
    df.show()
    ```

    You should see output like this:

    ```output
    +------+--------------------+--------------+------------+--------------+
    |rowkey|       officeAddress|   officePhone|personalName| personalPhone|
    +------+--------------------+--------------+------------+--------------+
    |  1000|1111 San Gabriel Dr.|1-425-000-0002|   John Dole|1-425-000-0001|
    | 16891|        40 Ellis St.|  674-555-0110|John Jackson|  230-555-0194|
    |  8396|5415 San Gabriel Dr.|  230-555-0191| Calvin Raji|  230-555-0191|
    +------+--------------------+--------------+------------+--------------+
    ```

1. Close the spark shell by entering the following command:

    ```scala
    :q
    ```

## Next steps

* [Apache Spark HBase Connector](https://github.com/hortonworks-spark/shc)
