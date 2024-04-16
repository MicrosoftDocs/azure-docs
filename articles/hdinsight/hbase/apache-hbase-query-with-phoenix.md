---
title: 'Quickstart: Apache HBase & Apache Phoenix - Azure HDInsight'
description: In this quickstart, you learn how to use Apache Phoenix in HDInsight. Also, learn how to install and set up SQLLine on your computer to connect to an HBase cluster in HDInsight.
ms.service: hdinsight
ms.custom: hdinsightactive, mode-other
ms.topic: quickstart
ms.date: 09/15/2023
#Customer intent: As a HBase user, I want learn Apache Phoenix so that I can run HBase queries in Azure HDInsight.
---

# Quickstart: Query Apache HBase in Azure HDInsight with Apache Phoenix

In this quickstart, you learn how to use the Apache Phoenix to run HBase queries in Azure HDInsight. Apache Phoenix is a SQL query engine for Apache HBase. It is accessed as a JDBC driver, and it enables querying and managing HBase tables by using SQL. [SQLLine](http://sqlline.sourceforge.net/) is a command-line utility to execute SQL.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* An Apache HBase cluster. See [Create cluster](../hadoop/apache-hadoop-linux-tutorial-get-started.md) to create an HDInsight cluster.  Ensure you choose the **HBase** cluster type.

* An SSH client. For more information, see [Connect to HDInsight (Apache Hadoop) using SSH](../hdinsight-hadoop-linux-use-ssh-unix.md).

## Identify a ZooKeeper node

When you connect to an HBase cluster, you need to connect to one of the Apache ZooKeeper nodes. Each HDInsight cluster has three ZooKeeper nodes. Curl can be used to quickly identify a ZooKeeper node. Edit the curl command below by replacing `PASSWORD` and `CLUSTERNAME` with the relevant values, and then enter the command in a command prompt:

```cmd
curl -u admin:PASSWORD -sS -G https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/services/ZOOKEEPER/components/ZOOKEEPER_SERVER
```

A portion of the output will look similar to:

```output
    {
      "href" : "http://hn*.432dc3rlshou3ocf251eycoapa.bx.internal.cloudapp.net:8080/api/v1/clusters/myCluster/hosts/<zookeepername1>.432dc3rlshou3ocf251eycoapa.bx.internal.cloudapp.net/host_components/ZOOKEEPER_SERVER",
      "HostRoles" : {
        "cluster_name" : "myCluster",
        "component_name" : "ZOOKEEPER_SERVER",
        "host_name" : "<zookeepername1>.432dc3rlshou3ocf251eycoapa.bx.internal.cloudapp.net"
      }
```

Take note of the value for `host_name` for later use.

## Create a table and manipulate data

You can use SSH to connect to HBase clusters, and then use Apache Phoenix to create HBase tables, insert data, and query data.

1. Use `ssh` command to connect to your HBase cluster. Edit the command below by replacing `CLUSTERNAME` with the name of your cluster, and then enter the command:

    ```cmd
    ssh sshuser@CLUSTERNAME-ssh.azurehdinsight.net
    ```

2. Change directory to the Phoenix client. Enter the following command:

    ```bash
    cd /usr/hdp/current/phoenix-client/bin
    ```

3. Launch [SQLLine](http://sqlline.sourceforge.net/). Edit the command below by replacing `ZOOKEEPER` with the ZooKeeper node identified earlier, then enter the command:

    ```bash
    ./sqlline.py ZOOKEEPER:2181:/hbase-unsecure
    ```

4. Create an HBase table. Enter the following command:

    ```sql
    CREATE TABLE Company (company_id INTEGER PRIMARY KEY, name VARCHAR(225));
    ```

5. Use the SQLLine `!tables` command to list all tables in HBase. Enter the following command:

    ```sqlline
    !tables
    ```

6. Insert values in the table. Enter the following command:

    ```sql
    UPSERT INTO Company VALUES(1, 'Microsoft');
    UPSERT INTO Company VALUES(2, 'Apache');
    ```

7. Query the table. Enter the following command:

    ```sql
    SELECT * FROM Company;
    ```

8. Delete a record. Enter the following command:

    ```sql
    DELETE FROM Company WHERE COMPANY_ID=1;
    ```

9. Drop the table. Enter the following command:

    ```hbase
    DROP TABLE Company;
    ```

10. Use the SQLLine `!quit` command to exit SQLLine. Enter the following command:

    ```sqlline
    !quit
    ```

## Clean up resources

After you complete the quickstart, you may want to delete the cluster. With HDInsight, your data is stored in Azure Storage, so you can safely delete a cluster when it is not in use. You are also charged for an HDInsight cluster, even when it is not in use. Since the charges for the cluster are many times more than the charges for storage, it makes economic sense to delete clusters when they are not in use.

To delete a cluster, see [Delete an HDInsight cluster using your browser, PowerShell, or the Azure CLI](../hdinsight-delete-cluster.md).

## Next steps

In this quickstart, you learned how to use the Apache Phoenix to run HBase queries in Azure HDInsight. To learn more about Apache Phoenix, the next article will provide a deeper examination.

> [!div class="nextstepaction"]
> [Apache Phoenix in HDInsight](../hdinsight-phoenix-in-hdinsight.md)
