<properties
	pageTitle="Use Hadoop Sqoop in HDInsight | Microsoft Azure"
	description="Learn how to run Sqoop import and export between a Linux-based Hadoop on HDInsight cluster and an Azure SQL database."
	editor="cgronlun"
	manager="paulettm"
	services="hdinsight"
	documentationCenter=""
	authors="Blackmist"
	tags="azure-portal"/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/02/2015"
	ms.author="larryfr"/>

#Use Sqoop with Hadoop in HDInsight (SSH)

[AZURE.INCLUDE [sqoop-selector](../../includes/hdinsight-selector-use-sqoop.md)]

Learn how to use Sqoop to import and export between a Linux-based HDInsight cluster and Azure SQL Database or SQL Server database.

> [AZURE.NOTE] The steps in this article use SSH to connect to a Linux-based HDInsight cluster. Windows clients can also use Azure PowerShell to work with Sqoop on Linux-based clusters as documented in [Use Sqoop with Hadoop in HDInsight (PowerShell)](hdinsight-use-sqoop.md).

##What is Sqoop?

Although Hadoop is a natural choice for processing unstructured and semistructured data, such as logs and files, there may also be a need to process structured data that is stored in relational databases.

[Sqoop][sqoop-user-guide-1.4.4] is a tool designed to transfer data between Hadoop clusters and relational databases. You can use it to import data from a relational database management system (RDBMS) such as SQL Server, MySQL, or Oracle into the Hadoop distributed file system (HDFS), transform the data in Hadoop with MapReduce or Hive, and then export the data back into an RDBMS. In this tutorial, you are using a SQL Server database for your relational database.

For Sqoop versions that are supported on HDInsight clusters, see [What's new in the cluster versions provided by HDInsight?][hdinsight-versions].


##Prerequisites

Before you begin this tutorial, you must have the following:

- **Workstation**: A computer with an SSH client.

- **Azure CLI**: For more information, see [Install and Configure the Azure CLI](../xplat-cli.md)

- **Linux-based HDInsight cluster**: For instructions about cluster provision, see [Get started using HDInsight](hdinsight-hadoop-linux-tutorial-get-started.md) or [Provision HDInsight clusters][hdinsight-provision].

- **Azure SQL database**: This document provides instructions for creating an example SQL database. For more information on SQL Database, see [Get started using Azure SQL database][sqldatabase-get-started].

* **SQL Server**: The steps in this document can also be used, with some modification, with SQL Server; however, both the HDInsight cluster and SQL Server must be on the same Azure Virtual Network. For more information on requirements specific to using this article with SQL Server, see the [Using SQL Server](#using-sql-server) section.

##Understand the scenario

An HDInsight cluster comes with some sample data. You will use a Hive table named **hivesampletable**, which references the data file located at **wasb:///hive/warehouse/hivesampletable**. The table contains some mobile device data. The Hive table schema is:

| Field | Data type |
| ----- | --------- |
| clientid | string |
| querytime | string |
| market | string |
| deviceplatform | string |
| devicemake | string |
| devicemodel | string |
| state | string |
| country | string |
| querydwelltime | double |
| sessionid | bigint |
| sessionpagevieworder | bigint |

You will first export **hivesampletable** to the Azure SQL database or to SQL Server in a table named **mobiledata**, and then import the table back to HDInsight at **wasb:///tutorials/usesqoop/importeddata**.

##Create a database

1. Open a terminal or command prompt and use the following command to create a new Azure SQL Database server:

        azure sql server create <adminLogin> <adminPassword> <region>

    For exmaple, `azure sql server create admin password "West US"`.

    When the command completes, you will receive a response similar to the following:

        info:    Executing command sql server create
        + Creating SQL Server
        data:    Server Name i1qwc540ts
        info:    sql server create command OK

    > [AZURE.IMPORTANT] Note the server name returned by this command. This is the short name of the SQL Database server that was created. The fully qualified domain name (FQDN) is **&lt;shortname&gt;.database.windows.net**.

2. Use the following command to create a database named **sqooptest** on the SQL Database server:

        sql db create [options] <serverName> sqooptest <adminLogin> <adminPassword>

    This will return an "OK" message when it completes.

	> [AZURE.NOTE] If you receive an error indicating that you do not have access, you may need to add your client workstation's IP address to the SQL Database firewall using the following command:
	>
	> `sql firewallrule create [options] <serverName> <ruleName> <startIPAddress> <endIPAddress>`

##Create a table

> [AZURE.NOTE] There are many ways to connect to SQL Database to create a table. The following steps use [FreeTDS](http://www.freetds.org/) from the HDInsight cluster.

1. Use SSH to connect to the Linux-based HDInsight cluster. The address to use when connecting is `CLUSTERNAME-ssh.azurehdinsight.net` and the port is `22`.

	For more information on using SSH to connect to HDInsight, see the following documents:

    * **Linux, Unix or OS X clients**: See [Connect to a Linux-based HDInsight cluster from Linux, OS X or Unix](hdinsight-hadoop-linux-use-ssh-unix.md#connect-to-a-linux-based-hdinsight-cluster)

    * **Windows clients**: See [Connect to a Linux-based HDInsight cluster from Windows](hdinsight-hadoop-linux-use-ssh-windows.md#connect-to-a-linux-based-hdinsight-cluster)

3. Use the following command to install FreeTDS:

        sudo apt-get --assume-yes install freetds-dev freetds-bin

4. Once FreeTDS has been installed, use the following command to connect to the SQL Database server you created previously:

        TDSVER=8.0 tsql -H <serverName>.database.windows.net -U <adminLogin> -P <adminPassword> -p 1433 -D sqooptest

    You will receive output similar to the following:

        locale is "en_US.UTF-8"
        locale charset is "UTF-8"
        using default charset "UTF-8"
        Default database being set to sqooptest
        1>

5. At the `1>` prompt, enter the following lines:

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

    When the `GO` statement is entered, the previous statements will be evaluated. First, the **mobiledata** table is created, then a clustered index is added to it (required by SQL Database.)

    Use the following to verify that the table has been created:

        SELECT * FROM information_schema.tables
        GO

    You should see output similar to the following:

        TABLE_CATALOG   TABLE_SCHEMA    TABLE_NAME      TABLE_TYPE
        sqooptest       dbo     mobiledata      BASE TABLE

8. Enter `exit` at the `1>` prompt to exit the tsql utility.

##Sqoop export

2. Use the following command to create a link to the SQL Server JDBC driver from the Sqoop lib directory. This allows Sqoop to use this driver to talk to SQL Database:

        sudo ln /usr/share/java/sqljdbc_4.1/enu/sqljdbc41.jar /usr/hdp/current/sqoop-client/lib/sqljdbc41.jar

3. Use the following command to verify that Sqoop can see your SQL Database:

        sqoop list-databases --connect jdbc:sqlserver://<serverName>.database.windows.net:1433 --username <adminLogin> --password <adminPassword>

    This should return a list of databases, including the **sqooptest** database that you created earlier.

4. Use the following command to export data from **hivesampletable** to the **mobiledata** table:

        sqoop export --connect 'jdbc:sqlserver://<serverName>.database.windows.net:1433;database=sqooptest' --username <adminLogin> --password <adminPassword> --table 'mobiledata' --export-dir 'wasb:///hive/warehouse/hivesampletable' --fields-terminated-by '\t' -m 1

    This instructs Sqoop to connect to SQL Database, to the **sqooptest** database, and export data from the **wasb:///hive/warehouse/hivesampletable** (physical files for the *hivesampletable*,) to the **mobiledata** table.

5. After the command completes, use the following to connect to the database using TSQL:

        TDSVER=8.0 tsql -H <serverName>.database.windows.net -U <adminLogin> -P <adminPassword> -p 1433 -D sqooptest

    Once connected, use the following statements to verify that the data was exported to the **mobiledata** table:

        SELECT * FROM mobiledata
        GO

    You should see a listing of data in the table. Type `exit` to exit the tsql utility.

##Sqoop import

1. Use the following to import data from the **mobiledata** table in SQL Database, to the **wasb:///tutorials/usesqoop/importeddata** directory on HDInsight:

        sqoop import --connect 'jdbc:sqlserver://<serverName>.database.windows.net:1433;database=sqooptest' --username <adminLogin> --password <adminPassword> --table 'mobiledata' --target-dir 'wasb:///tutorials/usesqoop/importeddata' --fields-terminated-by '\t' --lines-terminated-by '\n' -m 1

    The imported data will have fields that are separated by a tab character, and the lines will be terminated by a new-line character.

2. Once the import has completed, use the following command to list out the data in the new directory:

        hadoop fs -text wasb:///tutorials/usesqoop/importeddata/part-m-00000

##Using SQL Server

You can also use Sqoop to import and export data from SQL Server, either in your data center or on a Virtual Machine hosted in Azure. The differences between using SQL Database and SQL Server are:

* Both HDInsight and the SQL Server must be on the same Azure Virtual Network

    > [AZURE.NOTE] HDInsight supports only location-based virtual networks, and it does not currently work with affinity group-based virtual networks.

    When you are using SQL Server in your datacenter, you must configure the virtual network as *site-to-site* or *point-to-site*.

    > [AZURE.NOTE] For **point-to-site** virtual networks, SQL Server must be running the VPN client configuration application, which is available from the **Dashboard** of your Azure virtual network configuration.

    For more information on creating and configuring a virtual network, see [Virtual Network Configuration Tasks](../services/virtual-machines/).

* SQL Server must be configured to allow SQL authentication. For more information, see [Choose an Authentication Mode](https://msdn.microsoft.com/ms144284.aspx)

* You may have to configure SQL Server to accept remote connections. See [How to troubleshoot connecting to the SQL Server database engine](http://social.technet.microsoft.com/wiki/contents/articles/2102.how-to-troubleshoot-connecting-to-the-sql-server-database-engine.aspx) for more information

* You must create the **sqooptest** database in SQL Server using a utility such as **SQL Server Management Studio** or **tsql** - the steps for using the Azure CLI only work for Azure SQL Database

    The TSQL statements to create the **mobiledata** table are similar those used for SQL Database, with the exception of creating a clusterd index - this is not required for SQL Server:

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

* When connecting to the SQL Server from HDInsight, you may have to use the IP address of the SQL Server unless you have configured a Domain Name System (DNS) to resolve names on the Azure Virtual Network. For example:

        sqoop import --connect 'jdbc:sqlserver://10.0.1.1:1433;database=sqooptest' --username <adminLogin> --password <adminPassword> --table 'mobiledata' --target-dir 'wasb:///tutorials/usesqoop/importeddata' --fields-terminated-by '\t' --lines-terminated-by '\n' -m 1

##Next steps

Now you have learned how to use Sqoop. To learn more, see:

- [Use Oozie with HDInsight][hdinsight-use-oozie]: Use Sqoop action in an Oozie workflow.
- [Analyze flight delay data using HDInsight][hdinsight-analyze-flight-data]: Use Hive to analyze flight delay data, and then use Sqoop to export data to an Azure SQL database.
- [Upload data to HDInsight][hdinsight-upload-data]: Find other methods for uploading data to HDInsight/Azure Blob storage.



[hdinsight-versions]:  hdinsight-component-versioning.md
[hdinsight-provision]: hdinsight-provision-clusters.md
[hdinsight-get-started]: ../hdinsight-get-started.md
[hdinsight-storage]: ../hdinsight-use-blob-storage.md
[hdinsight-analyze-flight-data]: hdinsight-analyze-flight-delay-data.md
[hdinsight-use-oozie]: hdinsight-use-oozie.md
[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-submit-jobs]: hdinsight-submit-hadoop-jobs-programmatically.md

[sqldatabase-get-started]: ../sql-database-get-started.md
[sqldatabase-create-configue]: ../sql-database-create-configure.md

[powershell-start]: http://technet.microsoft.com/library/hh847889.aspx
[powershell-install]: ../install-configure-powershell.md
[powershell-script]: http://technet.microsoft.com/library/ee176949.aspx

[sqoop-user-guide-1.4.4]: https://sqoop.apache.org/docs/1.4.4/SqoopUserGuide.html
