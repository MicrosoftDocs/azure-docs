---
title: Use Hadoop Sqoop in Linux-based HDInsight | Microsoft Docs
description: Learn how to run Sqoop import and export between a Linux-based Hadoop on HDInsight cluster and an Azure SQL database.
editor: cgronlun
manager: jhubbard
services: hdinsight
documentationcenter: ''
author: Blackmist
tags: azure-portal

ms.assetid: 303649a5-4be5-4933-bf1d-4b232083c354
ms.service: hdinsight
ms.custom: hdinsightactive
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/14/2017
ms.author: larryfr

---
# Use Sqoop with Hadoop in HDInsight (SSH)

[!INCLUDE [sqoop-selector](../../includes/hdinsight-selector-use-sqoop.md)]

Learn how to use Sqoop to import and export between an HDInsight cluster and Azure SQL Database or SQL Server database.

> [!IMPORTANT]
> The steps in this document only work with HDInsight clusters that use Linux. Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight component versioning](hdinsight-component-versioning.md#hdi-version-33-nearing-deprecation-date).

## Install FreeTDS

1. Use SSH to connect to the Linux-based HDInsight cluster. The address to use when connecting is `CLUSTERNAME-ssh.azurehdinsight.net` and the port is `22`.

    For more information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).

2. Use the following command to install FreeTDS:

        sudo apt-get --assume-yes install freetds-dev freetds-bin

    FreeTDS is used in several steps to connect to SQL Database.

## Create the table in SQL Database

> [!IMPORTANT]
> If you are using the HDInsight cluster and SQL Database created in [Create cluster and SQL database](hdinsight-use-sqoop.md), ignore the steps in this section. The database and table were created as part of the steps in the [Create cluster and SQL database](hdinsight-use-sqoop.md) document.

1. From the SSH session, use the following command to connect to the SQL Database server.

        TDSVER=8.0 tsql -H <serverName>.database.windows.net -U <adminLogin> -P <adminPassword> -p 1433 -D sqooptest

    You receive output similar to the following text:

        locale is "en_US.UTF-8"
        locale charset is "UTF-8"
        using default charset "UTF-8"
        Default database being set to sqooptest
        1>

2. At the `1>` prompt, enter the following query:

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

    When the `GO` statement is entered, the previous statements are evaluated. First, the **mobiledata** table is created, then a clustered index is added to it (required by SQL Database.)

    Use the following query to verify that the table has been created:

        SELECT * FROM information_schema.tables
        GO

    You see output similar to the following text:

        TABLE_CATALOG   TABLE_SCHEMA    TABLE_NAME      TABLE_TYPE
        sqooptest       dbo     mobiledata      BASE TABLE

3. Enter `exit` at the `1>` prompt to exit the tsql utility.

## Sqoop export

1. From the SSH connection to HDInsight, se the following command to verify that Sqoop can see your SQL Database:

        sqoop list-databases --connect jdbc:sqlserver://<serverName>.database.windows.net:1433 --username <adminLogin> --password <adminPassword>

    This command returns a list of databases, including the **sqooptest** database that you created earlier.

2. Use the following command to export data from **hivesampletable** to the **mobiledata** table:

        sqoop export --connect 'jdbc:sqlserver://<serverName>.database.windows.net:1433;database=sqooptest' --username <adminLogin> --password <adminPassword> --table 'mobiledata' --export-dir 'wasbs:///hive/warehouse/hivesampletable' --fields-terminated-by '\t' -m 1

    This command instructs Sqoop to connect to the **sqooptest** database. Sqoop then exports data from **wasbs:///hive/warehouse/hivesampletable** to the **mobiledata** table.

3. After the command completes, use the following command to connect to the database using TSQL:

        TDSVER=8.0 tsql -H <serverName>.database.windows.net -U <adminLogin> -P <adminPassword> -p 1433 -D sqooptest

    Once connected, use the following statements to verify that the data was exported to the **mobiledata** table:

        SELECT * FROM mobiledata
        GO

    You should see a listing of data in the table. Type `exit` to exit the tsql utility.

## Sqoop import

1. Use the following command to import data from the **mobiledata** table in SQL Database, to the **wasbs:///tutorials/usesqoop/importeddata** directory on HDInsight:

        sqoop import --connect 'jdbc:sqlserver://<serverName>.database.windows.net:1433;database=sqooptest' --username <adminLogin> --password <adminPassword> --table 'mobiledata' --target-dir 'wasbs:///tutorials/usesqoop/importeddata' --fields-terminated-by '\t' --lines-terminated-by '\n' -m 1

    The fields in the data are separated by a tab character, and the lines are terminated by a new-line character.

2. Once the import has completed, use the following command to list out the data in the new directory:

        hadoop fs -text wasbs:///tutorials/usesqoop/importeddata/part-m-00000

## Using SQL Server

You can also use Sqoop to import and export data from SQL Server, either in your data center or on a Virtual Machine hosted in Azure. The differences between using SQL Database and SQL Server are:

* Both HDInsight and the SQL Server must be on the same Azure Virtual Network

  > [!NOTE]
  > HDInsight supports only location-based virtual networks, and it does not currently work with affinity group-based virtual networks.

    When you are using SQL Server in your datacenter, you must configure the virtual network as *site-to-site* or *point-to-site*.

  > [!NOTE]
  > When using a **point-to-site** virtual network, SQL Server must be running the VPN client configuration application. The VPN client is available from the **Dashboard** of your Azure virtual network configuration.

    For more information Azure Virtual Network, see [Virtual Network Overview](../virtual-network/virtual-networks-overview.md).

* SQL Server must be configured to allow SQL authentication. For more information, see the [Choose an Authentication Mode](https://msdn.microsoft.com/ms144284.aspx) document.

* You may have to configure SQL Server to accept remote connections. For more information, see the [How to troubleshoot connecting to the SQL Server database engine](http://social.technet.microsoft.com/wiki/contents/articles/2102.how-to-troubleshoot-connecting-to-the-sql-server-database-engine.aspx) document.

* Create the **sqooptest** database in SQL Server using a utility such as **SQL Server Management Studio** or **tsql**. The steps for using the Azure CLI only work for Azure SQL Database.

    Use the following TSQL statements to create the **mobiledata** table:

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

* When connecting to the SQL Server from HDInsight, you may have to use the IP address of the SQL Server. For example:

        sqoop import --connect 'jdbc:sqlserver://10.0.1.1:1433;database=sqooptest' --username <adminLogin> --password <adminPassword> --table 'mobiledata' --target-dir 'wasbs:///tutorials/usesqoop/importeddata' --fields-terminated-by '\t' --lines-terminated-by '\n' -m 1

## Limitations

* Bulk export - With Linux-based HDInsight, the Sqoop connector used to export data to Microsoft SQL Server or Azure SQL Database does not currently support bulk inserts.

* Batching - With Linux-based HDInsight, When using the `-batch` switch when performing inserts, Sqoop makes multiple inserts instead of batching the insert operations.

## Next steps

Now you have learned how to use Sqoop. To learn more, see:

* [Use Oozie with HDInsight][hdinsight-use-oozie]: Use Sqoop action in an Oozie workflow.
* [Analyze flight delay data using HDInsight][hdinsight-analyze-flight-data]: Use Hive to analyze flight delay data, and then use Sqoop to export data to an Azure SQL database.
* [Upload data to HDInsight][hdinsight-upload-data]: Find other methods for uploading data to HDInsight/Azure Blob storage.

[hdinsight-versions]:  hdinsight-component-versioning.md
[hdinsight-provision]: hdinsight-hadoop-provision-linux-clusters.md
[hdinsight-get-started]: hdinsight-hadoop-linux-tutorial-get-started.md
[hdinsight-storage]: ../hdinsight-hadoop-use-blob-storage.md
[hdinsight-analyze-flight-data]: hdinsight-analyze-flight-delay-data.md
[hdinsight-use-oozie]: hdinsight-use-oozie.md
[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-submit-jobs]: hdinsight-submit-hadoop-jobs-programmatically.md

[sqldatabase-get-started]: ../sql-database-get-started.md
[sqldatabase-create-configue]: ../sql-database-create-configure.md

[powershell-start]: http://technet.microsoft.com/library/hh847889.aspx
[powershell-install]: /powershell/azureps-cmdlets-docs
[powershell-script]: http://technet.microsoft.com/library/ee176949.aspx

[sqoop-user-guide-1.4.4]: https://sqoop.apache.org/docs/1.4.4/SqoopUserGuide.html
