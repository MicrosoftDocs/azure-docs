---
title: Apache Sqoop with Apache Hadoop - Azure HDInsight 
description: Learn how to use Apache Sqoop to import and export between Apache Hadoop on HDInsight and an Azure SQL Database.
keywords: hadoop sqoop,sqoop

author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive,hdiseo17may2017
ms.topic: conceptual
ms.date: 04/15/2019
---

# Use Apache Sqoop to import and export data between Apache Hadoop on HDInsight and SQL Database

[!INCLUDE [sqoop-selector](../../../includes/hdinsight-selector-use-sqoop.md)]

Learn how to use Apache Sqoop to import and export between an Apache Hadoop cluster in Azure HDInsight and Azure SQL Database or Microsoft SQL Server database. The steps in this document use the `sqoop` command directly from the headnode of the Hadoop cluster. You use SSH to connect to the head node and run the commands in this document. This article is a continuation of [Use Apache Sqoop with Hadoop in HDInsight](./hdinsight-use-sqoop.md).

## Prerequisites

* Completion of [Set up test environment](./hdinsight-use-sqoop.md#create-cluster-and-sql-database) from [Use Apache Sqoop with Hadoop in HDInsight](./hdinsight-use-sqoop.md).

* A client to query the Azure SQL database. Consider using [SQL Server Management Studio](../../sql-database/sql-database-connect-query-ssms.md) or [Visual Studio Code](../../sql-database/sql-database-connect-query-vscode.md).

* An SSH client. For more information, see [Connect to HDInsight (Apache Hadoop) using SSH](../hdinsight-hadoop-linux-use-ssh-unix.md).

## Sqoop export

From Hive to SQL Server.

1. Use SSH to connect to the HDInsight cluster. Replace `CLUSTERNAME` with the name of your cluster, then enter the command:

    ```cmd
    ssh sshuser@CLUSTERNAME-ssh.azurehdinsight.net
    ```

2. Replace `MYSQLSERVER` with the name of your SQL Server. To verify that Sqoop can see your SQL Database, enter the command below in your open SSH connection. Enter the password for the SQL Server login when prompted. This command returns a list of databases.

    ```bash
    sqoop list-databases --connect jdbc:sqlserver://MYSQLSERVER.database.windows.net:1433 --username sqluser -P
    ```

3. Replace `MYSQLSERVER` with the name of your SQL Server, and `MYDATABASE` with the name of your SQL database. To export data from the Hive `hivesampletable` table to the `mobiledata` table in SQL Database, enter the command below in your open SSH connection. Enter the password for the SQL Server login when prompted

    ```bash
    sqoop export --connect 'jdbc:sqlserver://MYSQLSERVER.database.windows.net:1433;database=MYDATABASE' --username sqluser -P -table 'mobiledata' --hcatalog-table hivesampletable
    ```

4. To verify that data was exported, use the following queries from your SQL client to view the exported data:

    ```sql
    SELECT COUNT(*) FROM [dbo].[mobiledata] WITH (NOLOCK);
    SELECT TOP(25) * FROM [dbo].[mobiledata] WITH (NOLOCK);
    ```

## Sqoop import

From SQL Server to Azure storage.

1. Replace `MYSQLSERVER` with the name of your SQL Server, and `MYDATABASE` with the name of your SQL database. Enter the command below in your open SSH connection to import data from the `mobiledata` table in SQL Database, to the `wasb:///tutorials/usesqoop/importeddata` directory on HDInsight. Enter the password for the SQL Server login when prompted. The fields in the data are separated by a tab character, and the lines are terminated by a new-line character.

    ```bash
    sqoop import --connect 'jdbc:sqlserver://MYSQLSERVER.database.windows.net:1433;database=MYDATABASE' --username sqluser -P --table 'mobiledata' --target-dir 'wasb:///tutorials/usesqoop/importeddata' --fields-terminated-by '\t' --lines-terminated-by '\n' -m 1
    ```

2. Once the import has completed, enter the following command in your open SSH connection to list out the data in the new directory:

    ```bash
    hdfs dfs -text /tutorials/usesqoop/importeddata/part-m-00000
    ```

## Limitations

* Bulk export - With Linux-based HDInsight, the Sqoop connector used to export data to Microsoft SQL Server or Azure SQL Database does not support bulk inserts.

* Batching - With Linux-based HDInsight, When using the `-batch` switch when performing inserts, Sqoop makes multiple inserts instead of batching the insert operations.

## Important considerations

* Both HDInsight and SQL Server must be on the same Azure Virtual Network.

    For an example, see the [Connect HDInsight to your on-premises network](./../connect-on-premises-network.md) document.

    For more information on using HDInsight with an Azure Virtual Network, see the [Extend HDInsight with Azure Virtual Network](../hdinsight-extend-hadoop-virtual-network.md) document. For more information on Azure Virtual Network, see the [Virtual Network Overview](../../virtual-network/virtual-networks-overview.md) document.

* SQL Server must be configured to allow SQL authentication. For more information, see the [Choose an Authentication Mode](https://msdn.microsoft.com/ms144284.aspx) document.

* You may have to configure SQL Server to accept remote connections. For more information, see the [How to troubleshoot connecting to the SQL Server database engine](https://social.technet.microsoft.com/wiki/contents/articles/2102.how-to-troubleshoot-connecting-to-the-sql-server-database-engine.aspx) document.

## Next steps

Now you have learned how to use Sqoop. To learn more, see:

* [Use Apache Oozie with HDInsight](../hdinsight-use-oozie-linux-mac.md): Use Sqoop action in an Oozie workflow.
* [Analyze flight delay data using HDInsight](../interactive-query/interactive-query-tutorial-analyze-flight-data.md): Use Interactive Query to analyze flight delay data, and then use Sqoop to export data to an Azure SQL database.
* [Upload data to HDInsight](../hdinsight-upload-data.md): Find other methods for uploading data to HDInsight/Azure Blob storage.
