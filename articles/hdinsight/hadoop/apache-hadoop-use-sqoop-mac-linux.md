---
title: Apache Sqoop with Hadoop - Azure HDInsight 
description: Learn how to use Apache Sqoop to import and export between Hadoop on HDInsight and an Azure SQL Database.
keywords: hadoop sqoop,sqoop

services: hdinsight
author: jasonwhowell
ms.author: jasonh
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive,hdiseo17may2017
ms.topic: conceptual
ms.date: 03/26/2018
---
# Use Apache Sqoop to import and export data between Hadoop on HDInsight and SQL Database

[!INCLUDE [sqoop-selector](../../../includes/hdinsight-selector-use-sqoop.md)]

Learn how to use Apache Sqoop to import and export between a Hadoop cluster in Azure HDInsight and Azure SQL Database or Microsoft SQL Server database. The steps in this document use the `sqoop` command directly from the headnode of the Hadoop cluster. You use SSH to connect to the head node and run the commands in this document.

> [!IMPORTANT]
> The steps in this document only work with HDInsight clusters that use Linux. Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](../hdinsight-component-versioning.md#hdinsight-windows-retirement).

> [!WARNING]
> The steps in this document assume that you have already created an Azure SQL Database named `sqooptest`.
>
> This document provides T-SQL statements that are used to create and query a table in SQL Database. There are many clients that you can use these statements with SQL Database. We recommend the following clients:
>
> * [SQL Server Management Studio](../../sql-database/sql-database-connect-query-ssms.md)
> * [Visual Studio Code](../../sql-database/sql-database-connect-query-vscode.md)
> * The [sqlcmd](https://docs.microsoft.com/sql/tools/sqlcmd-utility) utility

## Create the table in SQL Database

> [!IMPORTANT]
> If you are using the HDInsight cluster and SQL Database created in [Create cluster and SQL database](hdinsight-use-sqoop.md), skip the steps in this section. The database and table were created as part of the steps in the [Create cluster and SQL database](hdinsight-use-sqoop.md) document.

Use a SQL client to connect to the `sqooptest` database in your SQL Database. Then use the following T-SQL to create a table named `mobiledata`:

```sql
CREATE TABLE [dbo].[mobiledata](
[clientid] [nvarchar](50),
[querytime] [nvarchar](50),
[market] [nvarchar](50),
[deviceplatform] [nvarchar](50),
[devicemake] [nvarchar](50),
[devicemodel] [nvarchar](50),
[state] [nvarchar](50),
[country] [nvarchar](50),
[querydwelltime] [float],
[sessionid] [bigint],
[sessionpagevieworder] [bigint])
GO
CREATE CLUSTERED INDEX mobiledata_clustered_index on mobiledata(clientid)
GO
```

## Sqoop export

1. Use SSH to connect to the HDInsight cluster. For example, the following command connects to the primary headnode of a cluster named `mycluster`:

    ```bash
    ssh mycluster-ssh.azurehdinsight.net
    ```

    For more information, see [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md).

2. To verify that Sqoop can see your SQL Database, use the following command:

    ```bash
    sqoop list-databases --connect jdbc:sqlserver://<serverName>.database.windows.net:1433 --username <adminLogin> -P
    ```
    When prompted, enter the password for the SQL Database login.

    This command returns a list of databases, including the **sqooptest** database used earlier.

3. To export data from the Hive **hivesampletable** table to the **mobiledata** table in SQL Database, use the following command:

    ```bash
    sqoop export --connect 'jdbc:sqlserver://<serverName>.database.windows.net:1433;database=sqooptest' --username <adminLogin> -P -table 'mobiledata' --hcatalog-table hivesampletable
    ```

4. To verify that data was exported, use the following query from your SQL client to view the exported data:

    ```sql
    SET ROWCOUNT 50;
    SELECT * FROM mobiledata;
    ```

    This command lists 50 rows that were imported into the table.

## Sqoop import

1. Use the following command to import data from the **mobiledata** table in SQL Database, to the **wasb:///tutorials/usesqoop/importeddata** directory on HDInsight:

    ```bash
    sqoop import --connect 'jdbc:sqlserver://<serverName>.database.windows.net:1433;database=sqooptest' --username <adminLogin> -P --table 'mobiledata' --target-dir 'wasb:///tutorials/usesqoop/importeddata' --fields-terminated-by '\t' --lines-terminated-by '\n' -m 1
    ```

    The fields in the data are separated by a tab character, and the lines are terminated by a new-line character.

    > [!IMPORTANT]
    > The `wasb:///` path works with clusters that use Azure Storage as the default cluster storage. For clusters that use Azure Data Lake Store, use `adl:///` instead.

2. Once the import has completed, use the following command to list out the data in the new directory:

    ```bash
    hdfs dfs -text /tutorials/usesqoop/importeddata/part-m-00000
    ```

## Using SQL Server

You can also use Sqoop to import and export data from SQL Server. The differences between using SQL Database and SQL Server are:

* Both HDInsight and SQL Server must be on the same Azure Virtual Network.

    For an example, see the [Connect HDInsight to your on-premises network](./../connect-on-premises-network.md) document.

    For more information on using HDInsight with an Azure Virtual Network, see the [Extend HDInsight with Azure Virtual Network](../hdinsight-extend-hadoop-virtual-network.md) document. For more information on Azure Virtual Network, see the [Virtual Network Overview](../../virtual-network/virtual-networks-overview.md) document.

* SQL Server must be configured to allow SQL authentication. For more information, see the [Choose an Authentication Mode](https://msdn.microsoft.com/ms144284.aspx) document.

* You may have to configure SQL Server to accept remote connections. For more information, see the [How to troubleshoot connecting to the SQL Server database engine](http://social.technet.microsoft.com/wiki/contents/articles/2102.how-to-troubleshoot-connecting-to-the-sql-server-database-engine.aspx) document.

* Use the following Transact-SQL statements to create the **mobiledata** table:

    ```sql
    CREATE TABLE [dbo].[mobiledata](
    [clientid] [nvarchar](50),
    [querytime] [nvarchar](50),
    [market] [nvarchar](50),
    [deviceplatform] [nvarchar](50),
    [devicemake] [nvarchar](50),
    [devicemodel] [nvarchar](50),
    [state] [nvarchar](50),
    [country] [nvarchar](50),
    [querydwelltime] [float],
    [sessionid] [bigint],
    [sessionpagevieworder] [bigint])
    ```

* When connecting to the SQL Server from HDInsight, you may have to use the IP address of the SQL Server. For example:

    ```bash
    sqoop import --connect 'jdbc:sqlserver://10.0.1.1:1433;database=sqooptest' --username <adminLogin> -P -table 'mobiledata' --target-dir 'wasb:///tutorials/usesqoop/importeddata' --fields-terminated-by '\t' --lines-terminated-by '\n' -m 1
    ```

## Limitations

* Bulk export - With Linux-based HDInsight, the Sqoop connector used to export data to Microsoft SQL Server or Azure SQL Database does not support bulk inserts.

* Batching - With Linux-based HDInsight, When using the `-batch` switch when performing inserts, Sqoop makes multiple inserts instead of batching the insert operations.

## Next steps

Now you have learned how to use Sqoop. To learn more, see:

* [Use Oozie with HDInsight](../hdinsight-use-oozie.md): Use Sqoop action in an Oozie workflow.
* [Analyze flight delay data using HDInsight](../hdinsight-analyze-flight-delay-data.md): Use Hive to analyze flight delay data, and then use Sqoop to export data to an Azure SQL database.
* [Upload data to HDInsight](../hdinsight-upload-data.md): Find other methods for uploading data to HDInsight/Azure Blob storage.

[hdinsight-versions]:  ../hdinsight-component-versioning.md
[hdinsight-provision]: hdinsight-hadoop-provision-linux-clusters.md
[hdinsight-get-started]:apache-hadoop-linux-tutorial-get-started.md
[hdinsight-storage]: ../hdinsight-hadoop-use-blob-storage.md
[hdinsight-submit-jobs]:submit-apache-hadoop-jobs-programmatically.md
[sqldatabase-get-started]: ../sql-database-get-started.md
[sqldatabase-create-configue]: ../sql-database-create-configure.md

[powershell-start]: http://technet.microsoft.com/library/hh847889.aspx
[powershell-install]: /powershell/azureps-cmdlets-docs
[powershell-script]: http://technet.microsoft.com/library/ee176949.aspx

[sqoop-user-guide-1.4.4]: https://sqoop.apache.org/docs/1.4.4/SqoopUserGuide.html
