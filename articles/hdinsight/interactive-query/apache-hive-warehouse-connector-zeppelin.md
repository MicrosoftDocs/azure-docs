---
title: Hive Warehouse Connector - Apache Zeppelin using Livy - Azure HDInsight
description: Learn how to integrate Hive Warehouse Connector with Apache Zeppelin on Azure HDInsight.
author: reachnijel
ms.author: nijelsf 
ms.service: hdinsight
ms.topic: how-to
ms.date: 09/27/2023
---

# Integrate Apache Zeppelin with Hive Warehouse Connector in Azure HDInsight

HDInsight Spark clusters include Apache Zeppelin notebooks with different interpreters. In this article, we focus only on the Livy interpreter to access Hive tables from Spark using Hive Warehouse Connector.

> [!NOTE]
> This article contains references to a term that Microsoft no longer uses. When the term is removed from the software, we'll remove it from this article.

## Prerequisite

Complete the [Hive Warehouse Connector setup](apache-hive-warehouse-connector.md#hive-warehouse-connector-setup) steps.

## Getting started

1. Use [ssh command](../hdinsight-hadoop-linux-use-ssh-unix.md) to connect to your Apache Spark cluster. Edit the following command by replacing CLUSTERNAME with the name of your cluster, and then enter the command:

    ```cmd
    ssh sshuser@CLUSTERNAME-ssh.azurehdinsight.net
    ```

1. From your ssh session, execute the following command to note the versions for `hive-warehouse-connector-assembly` and `pyspark_hwc`:

    ```bash
    ls /usr/hdp/current/hive_warehouse_connector
    ```

    Save the output for later use when configuring Apache Zeppelin.

## Configure Livy

Following configurations are required to access hive tables from Zeppelin with the Livy interpreter.

### Interactive Query Cluster

1. From a web browser, navigate to `https://LLAPCLUSTERNAME.azurehdinsight.net/#/main/services/HDFS/configs` where LLAPCLUSTERNAME is the name of your Interactive Query cluster.

1. Navigate to **Advanced** > **Custom core-site**. Select **Add Property...** to add the following configurations:

    | Configuration                 | Value |
    | ----------------------------- |-------|
    | hadoop.proxyuser.livy.groups  | *     |
    | hadoop.proxyuser.livy.hosts   | *     |

1. Save changes and restart all affected components.

### Spark Cluster

1. From a web browser, navigate to `https://CLUSTERNAME.azurehdinsight.net/#/main/services/SPARK2/configs` where CLUSTERNAME is the name of your Apache Spark cluster.

1. Expand **Custom livy2-conf**. Select **Add Property...** to add the following configuration:

    | Configuration                 | Value                                      |
    | ----------------------------- |------------------------------------------  |
    | livy.file.local-dir-whitelist | /usr/hdp/current/hive_warehouse_connector/ |

1. Save changes and restart all affected components.

### Configure Livy Interpreter in Zeppelin UI (Spark Cluster)

1. From a web browser, navigate to `https://CLUSTERNAME.azurehdinsight.net/zeppelin/#/interpreter`, where `CLUSTERNAME` is the name of your Apache Spark cluster.

1. Navigate to **livy2**.

1. Add the following configurations:

    | Configuration                 | Value                                      |
    | ----------------------------- |:------------------------------------------:|
    | livy.spark.hadoop.hive.llap.daemon.service.hosts | @llap0 |
    | livy.spark.security.credentials.hiveserver2.enabled | true |
    | livy.spark.sql.hive.llap | true |
    | livy.spark.yarn.security.credentials.hiveserver2.enabled | true |
    | livy.superusers | livy, zeppelin |
    | livy.spark.jars | `file:///usr/hdp/current/hive_warehouse_connector/hive-warehouse-connector-assembly-VERSION.jar`.<br>Replace VERSION with value you obtained from [Getting started](#getting-started), earlier. |
    | livy.spark.submit.pyFiles | `file:///usr/hdp/current/hive_warehouse_connector/pyspark_hwc-VERSION.zip`.<br>Replace VERSION with value you obtained from [Getting started](#getting-started), earlier. |
    | livy.spark.sql.hive.hiveserver2.jdbc.url | Set it to the HiveServer2 Interactive JDBC URL of the Interactive Query cluster. |
    | spark.security.credentials.hiveserver2.enabled | true |

1. For ESP clusters only, add the following configuration:

    | Configuration| Value|
    |---|---|
    | livy.spark.sql.hive.hiveserver2.jdbc.url.principal | `hive/_HOST@<AAD-Domain>` |

    * Use [ssh command](../hdinsight-hadoop-linux-use-ssh-unix.md) to connect to your Interactive Query cluster. Look for `default_realm` parameter in the `/etc/krb5.conf` file. Replace `<AAD-DOMAIN>` with this value as an uppercase string, otherwise the credential cannot be found.

        :::image type="content" source="./media/apache-hive-warehouse-connector/aad-domain.png" alt-text="hive warehouse connector AAD Domain" border="true":::

1. Save the changes and restart the Livy interpreter.

If Livy interpreter isn't accessible, modify the `shiro.ini` file present within Zeppelin component in Ambari. For more information, see [Configuring Apache Zeppelin Security](https://docs.cloudera.com/HDPDocuments/HDP3/HDP-3.0.1/configuring-zeppelin-security/content/enabling_access_control_for_interpreter__configuration__and_credential_settings.html).  

## Running Queries in Zeppelin

Launch a Zeppelin notebook using Livy interpreter and execute the following

```python
%livy2

import com.hortonworks.hwc.HiveWarehouseSession
import com.hortonworks.hwc.HiveWarehouseSession._
import org.apache.spark.sql.SaveMode

# Initialize the hive context
val hive = HiveWarehouseSession.session(spark).build()

# Create a database
hive.createDatabase("hwc_db",true)
hive.setDatabase("hwc_db")

# Create a Hive table
hive.createTable("testers").ifNotExists().column("id", "bigint").column("name", "string").create()

val dataDF = Seq( (1, "foo"), (2, "bar"), (8, "john")).toDF("id", "name")

# Validate writes to the table
dataDF.write.format("com.hortonworks.spark.sql.hive.llap.HiveWarehouseConnector").mode("append").option("table", "hwc_db.testers").save()

# Validate reads
hive.executeQuery("select * from testers").show()

```

## Next steps

* [HWC and Apache Spark operations](./apache-hive-warehouse-connector-operations.md)
* [HWC integration with Apache Spark and Apache Hive](./apache-hive-warehouse-connector.md)
* [Use Interactive Query with HDInsight](./apache-interactive-query-get-started.md)
