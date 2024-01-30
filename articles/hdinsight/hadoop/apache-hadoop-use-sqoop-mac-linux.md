---
title: Apache Sqoop with Apache Hadoop - Azure HDInsight 
description: Learn how to use Apache Sqoop to import and export between Apache Hadoop on HDInsight and Azure SQL Database.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive,hdiseo17may2017
ms.date: 08/21/2023
---

# Use Apache Sqoop to import and export data between Apache Hadoop on HDInsight and Azure SQL Database

[!INCLUDE [sqoop-selector](../includes/hdinsight-selector-use-sqoop.md)]

Learn how to use Apache Sqoop to import and export between an Apache Hadoop cluster in Azure HDInsight and Azure SQL Database or Microsoft SQL Server. The steps in this document use the `sqoop` command directly from the headnode of the Hadoop cluster. You use SSH to connect to the head node and run the commands in this document. This article is a continuation of [Use Apache Sqoop with Hadoop in HDInsight](./hdinsight-use-sqoop.md).

## Prerequisites

* Completion of [Set up test environment](./hdinsight-use-sqoop.md#create-cluster-and-sql-database) from [Use Apache Sqoop with Hadoop in HDInsight](./hdinsight-use-sqoop.md).

* An SSH client. For more information, see [Connect to HDInsight (Apache Hadoop) using SSH](../hdinsight-hadoop-linux-use-ssh-unix.md).

* Familiarity with Sqoop. For more information, see [Sqoop User Guide](https://sqoop.apache.org/docs/1.4.7/SqoopUserGuide.html).

## Set up

1. Use [ssh command](../hdinsight-hadoop-linux-use-ssh-unix.md) to connect to your cluster. Edit the command below by replacing CLUSTERNAME with the name of your cluster, and then enter the command:

    ```cmd
    ssh sshuser@CLUSTERNAME-ssh.azurehdinsight.net
    ```

1. For ease of use, set variables. Replace `PASSWORD`, `MYSQLSERVER`, and `MYDATABASE` with the relevant values, and then enter the commands below:

    ```bash
    export PASSWORD='PASSWORD'
    export SQL_SERVER="MYSQLSERVER"
    export DATABASE="MYDATABASE"


    export SERVER_CONNECT="jdbc:sqlserver://$SQL_SERVER.database.windows.net:1433;user=sqluser;password=$PASSWORD"
    export SERVER_DB_CONNECT="jdbc:sqlserver://$SQL_SERVER.database.windows.net:1433;user=sqluser;password=$PASSWORD;database=$DABATASE"
    ```

## Sqoop export

From Hive to SQL.

1. To verify that Sqoop can see your database, enter the command below in your open SSH connection. This command returns a list of databases.

    ```bash
    sqoop list-databases --connect $SERVER_CONNECT
    ```

1. Enter the following command to see a list of tables for the specified database:

    ```bash
    sqoop list-tables --connect $SERVER_DB_CONNECT
    ```

1. To export data from the Hive `hivesampletable` table to the `mobiledata` table in your database, enter the command below in your open SSH connection:

    ```bash
    sqoop export --connect $SERVER_DB_CONNECT \
    -table mobiledata \
    --hcatalog-table hivesampletable
    ```

1. To verify that data was exported, use the following queries from your SSH connection to view the exported data:

    ```bash
    sqoop eval --connect $SERVER_DB_CONNECT \
    --query "SELECT COUNT(*) from dbo.mobiledata WITH (NOLOCK)"


    sqoop eval --connect $SERVER_DB_CONNECT \
    --query "SELECT TOP(10) * from dbo.mobiledata WITH (NOLOCK)"
    ```

## Sqoop import

From SQL to Azure storage.

1. Enter the command below in your open SSH connection to import data from the `mobiledata` table in SQL, to the `wasbs:///tutorials/usesqoop/importeddata` directory on HDInsight. The fields in the data are separated by a tab character, and the lines are terminated by a new-line character.

    ```bash
    sqoop import --connect $SERVER_DB_CONNECT \
    --table mobiledata \
    --target-dir 'wasb:///tutorials/usesqoop/importeddata' \
    --fields-terminated-by '\t' \
    --lines-terminated-by '\n' -m 1
    ```

1. Alternatively, you can also specify a Hive table:

    ```bash
    sqoop import --connect $SERVER_DB_CONNECT \
    --table mobiledata \
    --target-dir 'wasb:///tutorials/usesqoop/importeddata2' \
    --fields-terminated-by '\t' \
    --lines-terminated-by '\n' \
    --create-hive-table \
    --hive-table mobiledata_imported2 \
    --hive-import -m 1
    ```

1. Once the import has completed, enter the following command in your open SSH connection to list out the data in the new directory:

    ```bash
    hadoop fs -tail /tutorials/usesqoop/importeddata/part-m-00000
    ```

1. Use [beeline](./apache-hadoop-use-hive-beeline.md) to verify that the table has been created in Hive.

    1. Connect

        ```bash
        beeline -u 'jdbc:hive2://headnodehost:10001/;transportMode=http'
        ```

    1. Execute each query below one at a time and review the output:

        ```hql
        show tables;
        describe mobiledata_imported2;
        SELECT COUNT(*) FROM mobiledata_imported2;
        SELECT * FROM mobiledata_imported2 LIMIT 10;
        ```

    1. Exit beeline with `!exit`.

## Limitations

* Bulk export - With Linux-based HDInsight, the Sqoop connector used to export data to SQL doesn't support bulk inserts.

* Batching - With Linux-based HDInsight, When using the `-batch` switch when performing inserts, Sqoop makes multiple inserts instead of batching the insert operations.

## Important considerations

* Both HDInsight and SQL Server must be on the same Azure Virtual Network.

    For an example, see the [Connect HDInsight to your on-premises network](./../connect-on-premises-network.md) document.

    For more information on using HDInsight with an Azure Virtual Network, see the [Extend HDInsight with Azure Virtual Network](../hdinsight-plan-virtual-network-deployment.md) document. For more information on Azure Virtual Network, see the [Virtual Network Overview](../../virtual-network/virtual-networks-overview.md) document.

* SQL Server must be configured to allow SQL authentication. For more information, see the [Choose an Authentication Mode](/sql/relational-databases/security/choose-an-authentication-mode) document.

* You may have to configure SQL Server to accept remote connections. For more information, see the [How to troubleshoot connecting to the SQL Server database engine](https://social.technet.microsoft.com/wiki/contents/articles/2102.how-to-troubleshoot-connecting-to-the-sql-server-database-engine.aspx) document.

## Next steps

Now you've learned how to use Sqoop. To learn more, see:

* [Use Apache Oozie with HDInsight](../hdinsight-use-oozie-linux-mac.md): Use Sqoop action in an Oozie workflow.
* [Analyze flight delay data using HDInsight](../interactive-query/interactive-query-tutorial-analyze-flight-data.md): Use Interactive Query to analyze flight delay data, and then use Sqoop to export data to a database in Azure.
* [Upload data to HDInsight](../hdinsight-upload-data.md): Find other methods for uploading data to HDInsight/Azure Blob storage.
