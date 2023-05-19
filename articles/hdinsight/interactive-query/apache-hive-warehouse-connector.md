---
title: Apache Spark & Hive - Hive Warehouse Connector - Azure HDInsight
description: Learn how to integrate Apache Spark and Apache Hive with the Hive Warehouse Connector on Azure HDInsight.
author: reachnijel
ms.author: nijelsf
ms.service: hdinsight
ms.topic: how-to
ms.date: 12/09/2022
---

# Integrate Apache Spark and Apache Hive with Hive Warehouse Connector in Azure HDInsight

The Apache Hive Warehouse Connector (HWC) is a library that allows you to work more easily with Apache Spark and Apache Hive. It supports tasks such as moving data between Spark DataFrames and Hive tables. Also, by directing Spark streaming data into Hive tables. Hive Warehouse Connector works like a bridge between Spark and Hive. It also supports Scala, Java, and Python as programming languages for development.

The Hive Warehouse Connector allows you to take advantage of the unique features of Hive and Spark to build powerful big-data applications.

Apache Hive offers support for database transactions that are Atomic, Consistent, Isolated, and Durable (ACID). For more information on ACID and transactions in Hive, see [Hive Transactions](https://cwiki.apache.org/confluence/display/Hive/Hive+Transactions). Hive also offers detailed security controls through Apache Ranger and Low Latency Analytical Processing (LLAP) not available in Apache Spark.

Apache Spark, has a Structured Streaming API that gives streaming capabilities not available in Apache Hive. Beginning with HDInsight 4.0, Apache Spark 2.3.1 & above, and Apache Hive 3.1.0 have separate metastore catalogs, which make interoperability difficult. 

The Hive Warehouse Connector (HWC) makes it easier to use Spark and Hive together. The HWC library loads data from LLAP daemons to Spark executors in parallel. This process makes it more efficient and adaptable than a standard JDBC connection from Spark to Hive. This brings out two different execution modes for HWC: 
> - Hive JDBC mode via HiveServer2
> - Hive LLAP mode using LLAP daemons **[Recommended]**

By default, HWC is configured to use Hive LLAP daemons. 
For executing Hive queries (both read and write) using the above modes with their respective APIs, see [HWC APIs](./hive-warehouse-connector-apis.md).

:::image type="content" source="./media/apache-hive-warehouse-connector/hive-warehouse-connector-architecture.png" alt-text="hive warehouse connector architecture" border="true":::

Some of the operations supported by the Hive Warehouse Connector are:

* Describing a table
* Creating a table for ORC-formatted data
* Selecting Hive data and retrieving a DataFrame
* Writing a DataFrame to Hive in batch
* Executing a Hive update statement
* Reading table data from Hive, transforming it in Spark, and writing it to a new Hive table
* Writing a DataFrame or Spark stream to Hive using HiveStreaming

## Hive Warehouse Connector setup

> [!IMPORTANT]
> - The HiveServer2 Interactive instance installed on Spark 2.4 Enterprise Security Package clusters is not supported for use with the Hive Warehouse Connector. Instead, you must configure a separate HiveServer2 Interactive cluster to host your HiveServer2 Interactive workloads. A Hive Warehouse Connector configuration that utilizes a single Spark 2.4 cluster is not supported.
> - Hive Warehouse Connector (HWC) Library is not supported for use with Interactive Query Clusters where Workload Management (WLM) feature is enabled. <br>
In a scenario where you only have Spark workloads and want to use HWC Library, ensure Interactive Query cluster doesn't have Workload Management feature enabled (`hive.server2.tez.interactive.queue` configuration is not set in Hive configs). <br>
For a scenario where both Spark workloads (HWC) and LLAP native workloads exists, You need to create two separate Interactive Query Clusters with shared metastore database. One cluster for native LLAP workloads where WLM feature can be enabled on need basis and other cluster for HWC only workload where WLM feature shouldn't be configured.
It's important to note that you can view the WLM resource plans from both the clusters even if it's enabled in only one cluster. Don't make any changes to resource plans in the cluster where WLM feature is disabled as it might impact the WLM functionality in other cluster.
> - Although Spark supports R computing language for simplifying its data analysis, Hive Warehouse Connector (HWC) Library is not supported to be used with R. To execute HWC workloads, you can execute queries from Spark to Hive using the JDBC-style HiveWarehouseSession API that supports only Scala, Java, and Python. 
> - Executing queries (both read and write) through HiveServer2 via JDBC mode is not supported for complex data types like Arrays/Struct/Map types.
> - HWC supports writing only in ORC file formats. Non-ORC writes (eg: parquet and text file formats) are not supported via HWC. 

Hive Warehouse Connector needs separate clusters for Spark and Interactive Query workloads. Follow these steps to set up these clusters in Azure HDInsight.

### Supported Cluster types & versions

| HWC Version | Spark Version | InteractiveQuery Version |
|:---:|:---:|---|
| v1 | Spark 2.4 \| HDI 4.0 | Interactive Query 3.1 \| HDI 4.0 |
| v2 | Spark 3.1 \| HDI 5.0 | Interactive Query 3.1 \| HDI 5.0 |

### Create clusters

1. Create an HDInsight Spark **4.0** cluster with a storage account and a custom Azure virtual network. For information on creating a cluster in an Azure virtual network, see [Add HDInsight to an existing virtual network](../../hdinsight/hdinsight-plan-virtual-network-deployment.md#existingvnet).

1. Create an HDInsight Interactive Query (LLAP) **4.0** cluster with the same storage account and Azure virtual network as the Spark cluster.

### Configure HWC settings

#### Gather preliminary information

1. From a web browser, navigate to `https://LLAPCLUSTERNAME.azurehdinsight.net/#/main/services/HIVE` where LLAPCLUSTERNAME is the name of your Interactive Query cluster.

1. Navigate to **Summary** > **HiveServer2 Interactive JDBC URL** and note the value. The value may be similar to: `jdbc:hive2://<zookeepername1>.rekufuk2y2ce.bx.internal.cloudapp.net:2181,<zookeepername2>.rekufuk2y2ce.bx.internal.cloudapp.net:2181,<zookeepername3>.rekufuk2y2ce.bx.internal.cloudapp.net:2181/;serviceDiscoveryMode=zooKeeper;zooKeeperNamespace=hiveserver2-interactive`.

1. Navigate to **Configs** > **Advanced** > **Advanced hive-site** > **hive.zookeeper.quorum** and note the value. The value may be similar to: `<zookeepername1>.rekufuk2y2cezcbowjkbwfnyvd.bx.internal.cloudapp.net:2181,<zookeepername2>.rekufuk2y2cezcbowjkbwfnyvd.bx.internal.cloudapp.net:2181,<zookeepername3>.rekufuk2y2cezcbowjkbwfnyvd.bx.internal.cloudapp.net:2181`.

1. Navigate to **Configs** > **Advanced** > **General** > **hive.metastore.uris** and note the 
value. The value may be similar to: `thrift://iqgiro.rekufuk2y2cezcbowjkbwfnyvd.bx.internal.cloudapp.net:9083,thrift://hn*.rekufuk2y2cezcbowjkbwfnyvd.bx.internal.cloudapp.net:9083`.

1. Navigate to **Configs** > **Advanced** > **Advanced hive-interactive-site** > **hive.llap.daemon.service.hosts** and note the value. The value may be similar to: `@llap0`.

#### Configure Spark cluster settings

1. From a web browser, navigate to `https://CLUSTERNAME.azurehdinsight.net/#/main/services/SPARK2/configs` where CLUSTERNAME is the name of your Apache Spark cluster.

1. Expand **Custom spark2-defaults**.

    :::image type="content" source="./media/apache-hive-warehouse-connector/hive-warehouse-connector-spark2-ambari.png" alt-text="Apache Ambari Spark2 configuration" border="true":::

1. Select **Add Property...** to add the following configurations:

    | Configuration | Value |
    |----|----|
    |`spark.datasource.hive.warehouse.load.staging.dir`| If you're using ADLS Gen2 Storage Account, use `abfss://STORAGE_CONTAINER_NAME@STORAGE_ACCOUNT_NAME.dfs.core.windows.net/tmp`<br>If you're using Azure Blob Storage Account, use `wasbs://STORAGE_CONTAINER_NAME@STORAGE_ACCOUNT_NAME.blob.core.windows.net/tmp`. <br> Set to a suitable HDFS-compatible staging directory. If you've two different clusters, the staging directory should be a folder in the staging directory of the LLAP cluster's storage account so that HiveServer2 has access to it.  Replace `STORAGE_ACCOUNT_NAME` with the name of the storage account being used by the cluster, and `STORAGE_CONTAINER_NAME` with the name of the storage container. |
    |`spark.sql.hive.hiveserver2.jdbc.url`| The value you obtained earlier from **HiveServer2 Interactive JDBC URL** |
    |`spark.datasource.hive.warehouse.metastoreUri`| The value you obtained earlier from **hive.metastore.uris**. |
    |`spark.security.credentials.hiveserver2.enabled`|`true` for YARN cluster mode and `false` for YARN client mode. |
    |`spark.hadoop.hive.zookeeper.quorum`| The value you obtained earlier from **hive.zookeeper.quorum**. |
    |`spark.hadoop.hive.llap.daemon.service.hosts`| The value you obtained earlier from **hive.llap.daemon.service.hosts**. |

1. Save changes and restart all affected components.

### Configure HWC for Enterprise Security Package (ESP) clusters

The Enterprise Security Package (ESP) provides enterprise-grade capabilities like Active Directory-based authentication, multi-user support, and role-based access control for Apache Hadoop clusters in Azure HDInsight. For more information on ESP, see [Use Enterprise Security Package in HDInsight](../domain-joined/apache-domain-joined-architecture.md).

Apart from the configurations mentioned in the previous section, add the following configuration to use HWC on the ESP clusters.

1. From Ambari web UI of Spark cluster, navigate to **Spark2** > **CONFIGS** > **Custom spark2-defaults**.

1. Update the following property.

    | Configuration | Value |
    |----|----|
    | `spark.sql.hive.hiveserver2.jdbc.url.principal`    | `hive/<llap-headnode>@<AAD-Domain>` |
    
    * From a web browser, navigate to `https://CLUSTERNAME.azurehdinsight.net/#/main/services/HIVE/summary` where CLUSTERNAME is the name of your Interactive Query cluster. Click on **HiveServer2 Interactive**. You'll see the Fully Qualified Domain Name (FQDN) of the head node on which LLAP is running as shown in the screenshot. Replace `<llap-headnode>` with this value.

        :::image type="content" source="./media/apache-hive-warehouse-connector/head-node-hive-server-interactive.png" alt-text="hive warehouse connector Head Node" border="true":::

    * Use [ssh command](../hdinsight-hadoop-linux-use-ssh-unix.md) to connect to your Interactive Query cluster. Look for `default_realm` parameter in the `/etc/krb5.conf` file. Replace `<AAD-DOMAIN>` with this value as an uppercase string, otherwise the credential won't be found.

        :::image type="content" source="./media/apache-hive-warehouse-connector/aad-domain.png" alt-text="hive warehouse connector AAD Domain" border="true":::

    * For instance, `hive/hn*.mjry42ikpruuxgs2qy2kpg4q5e.cx.internal.cloudapp.net@PKRSRVUQVMAE6J85.D2.INTERNAL.CLOUDAPP.NET`.
    
1. Save changes and restart components as needed.

## Hive Warehouse Connector usage

You can choose between a few different methods to connect to your Interactive Query cluster and execute queries using the Hive Warehouse Connector. Supported methods include the following tools:

* [Spark-shell / PySpark](../spark/apache-spark-shell.md)
* [Spark-submit](#spark-submit)
* [Zeppelin](./apache-hive-warehouse-connector-zeppelin.md)


Below are some examples to connect to HWC from Spark.

### Spark-shell

This is a way to run Spark interactively through a modified version of the Scala shell.

1. Use [ssh command](../hdinsight-hadoop-linux-use-ssh-unix.md) to connect to your Apache Spark cluster. Edit the command below by replacing CLUSTERNAME with the name of your cluster, and then enter the command:

    ```cmd
    ssh sshuser@CLUSTERNAME-ssh.azurehdinsight.net
    ```

1. From your ssh session, execute the following command to note the `hive-warehouse-connector-assembly` version:

    ```bash
    ls /usr/hdp/current/hive_warehouse_connector
    ```

1. Edit the code below with the `hive-warehouse-connector-assembly` version identified above. Then execute the command to start the spark shell:

    ```bash
    spark-shell --master yarn \
    --jars /usr/hdp/current/hive_warehouse_connector/hive-warehouse-connector-assembly-<VERSION>.jar \
    --conf spark.security.credentials.hiveserver2.enabled=false
    ```

1. After you start the spark shell, a Hive Warehouse Connector instance can be started using the following commands:

    ```scala
    import com.hortonworks.hwc.HiveWarehouseSession
    val hive = HiveWarehouseSession.session(spark).build()
    ```

### Spark-submit

Spark-submit is a utility to submit any Spark program (or job) to Spark clusters.

The spark-submit job will set up and configure Spark and Hive Warehouse Connector as per our instructions, execute the program we pass to it, then cleanly release the resources that were being used.

Once you build the scala/java code along with the dependencies into an assembly jar, use the below command to launch a Spark application. Replace `<VERSION>`, and `<APP_JAR_PATH>` with the actual values.

* YARN Client mode
    
    ```scala
    spark-submit \
    --class myHwcApp \
    --master yarn \
    --deploy-mode client \
    --jars /usr/hdp/current/hive_warehouse_connector/hive-warehouse-connector-assembly-<VERSION>.jar \
    --conf spark.security.credentials.hiveserver2.enabled=false
    /<APP_JAR_PATH>/myHwcAppProject.jar
    ```

* YARN Cluster mode
    ```scala
    spark-submit \
    --class myHwcApp \
    --master yarn \
    --deploy-mode cluster \
    --jars /usr/hdp/current/hive_warehouse_connector/hive-warehouse-connector-assembly-<VERSION>.jar \
    --conf spark.security.credentials.hiveserver2.enabled=true
    /<APP_JAR_PATH>/myHwcAppProject.jar
    ```

This utility is also used when we have written the entire application in pySpark and packaged into py files (Python), so that we can submit the entire code to Spark cluster for execution.

For Python applications, pass a .py file in the place of `/<APP_JAR_PATH>/myHwcAppProject.jar`, and add the below configuration (Python .zip) file to the search path with `--py-files`.

```python
--py-files /usr/hdp/current/hive_warehouse_connector/pyspark_hwc-<VERSION>.zip
```
    
## Run queries on Enterprise Security Package (ESP) clusters

Use `kinit` before starting the spark-shell or spark-submit. Replace USERNAME with the name of a domain account with permissions to access the cluster, then execute the following command:

```bash
kinit USERNAME
```

### Securing data on Spark ESP clusters

1. Create a table `demo` with some sample data by entering the following commands:

    ```scala
    create table demo (name string);
    INSERT INTO demo VALUES ('HDinsight');
    INSERT INTO demo VALUES ('Microsoft');
    INSERT INTO demo VALUES ('InteractiveQuery');
    ```

1. View the table's contents with the following command. Before you apply the policy, the `demo` table shows the full column.

    ```scala
    hive.executeQuery("SELECT * FROM demo").show()
    ```

    :::image type="content" source="./media/apache-hive-warehouse-connector/hive-warehouse-connector-table-before-ranger-policy.png" alt-text="demo table before applying ranger policy" border="true":::

1. Apply a column masking policy that only shows the last four characters of the column.  
    1. Go to the Ranger Admin UI at `https://LLAPCLUSTERNAME.azurehdinsight.net/ranger/`.
    1. Click on the Hive service for your cluster under **Hive**.
        :::image type="content" source="./media/apache-hive-warehouse-connector/hive-warehouse-connector-ranger-service-manager.png" alt-text="ranger service manager" border="true":::
    1. Click on the **Masking** tab and then **Add New Policy**

        :::image type="content" source="./media/apache-hive-warehouse-connector/hive-warehouse-connector-ranger-hive-policy-list.png" alt-text="hive warehouse connector ranger hive policy list" border="true":::

    1. Provide a desired policy name. Select database: **Default**, Hive table: **demo**, Hive column: **name**, User: **rsadmin2**, Access Types: **select**, and **Partial mask: show last 4** from the **Select Masking Option** menu. Click **Add**.
                :::image type="content" source="./media/apache-hive-warehouse-connector/hive-warehouse-connector-ranger-create-policy.png" alt-text="create policy" border="true":::
1. View the table's contents again. After applying the ranger policy, we can see only the last four characters of the column.

    :::image type="content" source="./media/apache-hive-warehouse-connector/hive-warehouse-connector-table-after-ranger-policy.png" alt-text="demo table after applying ranger policy" border="true":::

## Next steps

* [HWC and Apache Spark operations](./apache-hive-warehouse-connector-operations.md)
* [Use Interactive Query with HDInsight](./apache-interactive-query-get-started.md)
* [HWC integration with Apache Zeppelin](./apache-hive-warehouse-connector-zeppelin.md)
* [Submitting Spark Applications via Spark-submit utility](https://spark.apache.org/docs/2.4.0/submitting-applications.html)
* [HWC 1.0 supported APIs](./hive-warehouse-connector-apis.md)
* [HWC 2.0 supported APIs](./hive-warehouse-connector-v2-apis.md)
