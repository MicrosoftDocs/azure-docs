---
title: Hive Warehouse Connector - Apache Zeppelin using Livy - Azure HDInsight
description: Learn how to integrate Hive Warehouse Connector with Apache Zeppelin on Azure HDInsight.
author: nis-goel
ms.author: nisgoel
ms.reviewer: hrasheed
ms.service: hdinsight
ms.topic: conceptual
ms.date: 01/05/2020
---

# Integrate Apache Zeppelin with Hive Warehouse Connector on Azure HDInsight

HDInsight Spark clusters include Apache Zeppelin notebooks with different interpreters. In this article, we will focus only on the Livy interpreter to access Hive tables from Spark using Hive Warehouse Connector.

## Prerequisite

Complete the [Hive Warehouse Connector setup](apache-hive-warehouse-connector.md#hive-warehouse-connector-setup) steps.

## Getting started

1. Use [ssh command](../hdinsight-hadoop-linux-use-ssh-unix.md) to connect to your Apache Spark cluster. Edit the command below by replacing CLUSTERNAME with the name of your cluster, and then enter the command:

    ```cmd
    ssh sshuser@CLUSTERNAME-ssh.azurehdinsight.net
    ```

1. From your ssh session, execute the following command to note the versions for `hive-warehouse-connector-assembly` and `pyspark_hwc`:

    ```bash
    ls /usr/hdp/current/hive_warehouse_connector
    ```

    Save the output for later use when configuring Apache Zeppelin.

## Configure Livy

Following configurations are required to be able to access hive tables from Zeppelin via. Livy interpreter.

### Interactive Query Cluster

* From Ambari UI, navigate to **HDFS** > **CONFIGS** > **Custom core-site**.

* Select **Add Property...** as needed to add/update the following:


| Configuration                 | Value   |
| ----------------------------- |:-------:|
| hadoop.proxyuser.livy.groups  | *       |
| hadoop.proxyuser.livy.hosts   | *       |


3. Save changes and restart components as needed.


### Spark Cluster

* From Ambari UI, navigate to **Spark2** > **CONFIGS** > **Custom livy2-conf**

* Add/Override the following and restart Spark2 service.

| Configuration                 | Value                                      |
| ----------------------------- |:------------------------------------------:|
| livy.file.local-dir-whitelist | /usr/hdp/current/hive_warehouse_connector/ |

### Configure Livy Interpreter in Zeppelin UI (Spark Cluster)

* From Zeppelin UI, navigate to **Interpreters** > **livy2**.

* Add the following configurations if not already present.

| Configuration                 | Value                                      |
| ----------------------------- |:------------------------------------------:|
| livy.spark.hadoop.hive.llap.daemon.service.hosts | @llap0 |
| livy.spark.security.credentials.hiveserver2.enabled | true |
| livy.spark.sql.hive.llap | true |
| livy.spark.yarn.security.credentials.hiveserver2.enabled | true |
| livy.superusers | livy,zeppelin |
| livy.spark.jars | file:///usr/hdp/current/hive_warehouse_connector/hive-warehouse-connector-assembly-<STACK_VERSION>.jar |
| livy.spark.submit.pyFiles | file:///usr/hdp/current/hive_warehouse_connector/pyspark_hwc-<STACK_VERSION>.zip |
| livy.spark.sql.hive.hiveserver2.jdbc.url.principal | `hive/<headnode-FQDN>@<AAD-Domain>` (Needed only for ESP clusters) |
| livy.spark.sql.hive.hiveserver2.jdbc.url | Set it to the HiveServer2 JDBC connection string of the Interactive Query cluster. REPLACE `LLAPCLUSTERNAME` with the name of your Interactive Query cluster |
| spark.security.credentials.hiveserver2.enabled | true |

In `hive/<headnode-FQDN>@<AAD-Domain>` service principal, Replace `<headnode-FQDN>` with the Fully Qualified Domain Name of the head node host of the Interactive Query cluster. Replace `<AAD-DOMAIN>` with the name of the Azure Active Directory (AAD) that the cluster is joined to. Use an uppercase string for the `<AAD-DOMAIN>` value, otherwise the credential won't be found. Check /etc/krb5.conf for the realm names if needed.

* Save the changes and restart the Livy interpreter.

NOTE: If Livy interpreter is not accessible, please modify the `shiro.ini` file present within Zeppelin component in Ambari. Refer this [document](https://docs.cloudera.com/HDPDocuments/HDP3/HDP-3.0.1/configuring-zeppelin-security/content/enabling_access_control_for_interpreter__configuration__and_credential_settings.html).  


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

val dataDF = Seq( (1, "foo"), (2, "bar"), (8, "john")).toDF("id", "name");

# Validate writes to the table
dataDF.write.format("com.hortonworks.spark.sql.hive.llap.HiveWarehouseConnector").mode("append").option("table", "hwc_db.testers").save()

# Validate reads
hive.executeQuery("select * from testers").show()

```

To learn about the spark operations supported by HWC, please follow this [document](./apache-hive-warehouse-connector-supported-spark-operations.md).

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, please review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).