<properties
	pageTitle="Use Hadoop Sqoop in Linux-based HDInsight | Microsoft Azure"
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
	ms.date="03/09/2016"
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

- **Azure CLI**: For more information, see [Install and Configure the Azure CLI](../xplat-cli-install.md)

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


## Create cluster and SQL database

1. Click the following image to open an ARM template in the Azure Portal.         

    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fhditutorialdata.blob.core.windows.net%2Fusesqoop%2Fcreate-linux-based-hadoop-cluster-in-hdinsight-and-sql-database.json" target="_blank"><img src="https://acom.azurecomcdn.net/80C57D/cdn/mediahandler/docarticles/dpsmedia-prod/azure.microsoft.com/en-us/documentation/articles/hdinsight-hbase-tutorial-get-started-linux/20160201111850/deploy-to-azure.png" alt="Deploy to Azure"></a>
    
    The ARM template is located in a public blob container, *https://hditutorialdata.blob.core.windows.net/usesqoop/create-linux-based-hadoop-cluster-in-hdinsight-and-sql-database.json*. 
    
    The ARM template calls a bacpac package to deploy the table schemas to SQL database.  The bacpac package is also located in a public blob container, https://hditutorialdata.blob.core.windows.net/usesqoop/SqoopTutorial-2016-2-23-11-2.bacpac. If you want to use a private container for the bacpac files, use the following values in the template:
    
        "storageKeyType": "Primary",
        "storageKey": "<TheAzureStorageAccountKey>",
    
2. From the Parameters blade, enter the following:

    - **ClusterName**: Enter a name for the Hadoop cluster that you will create.
    - **Cluster login name and password**: The default login name is admin.
    - **SSH user name and password**.
    - **SQL database server login name and password**.

    The following values are hardcoded in the variables section:
    
    |Default storage account name|<CluterName>store|
    |----------------------------|-----------------|
    |Azure SQL database server name|<ClusterName>dbserver|
    |Azure SQL database name|<ClusterName>db|
    
    Please write down these values.  You will need them later in the tutorial.
    
3.Click **OK** to save the parameters.

4.From the **Custom deployment** blade, click **Resource group** dropdown box, and then click **New** to create a new resource group. The resource group is a container that groups the cluster, the dependent storage account and other linked resource.

5.Click **Legal terms**, and then click **Create**.

6.Click **Create**. You will see a new tile titled Submitting deployment for Template deployment. It takes about around 20 minutes to create the cluster and SQL database.

If you choose to use existing Azure SQL database or Microsoft SQL Server

- **Azure SQL database**: You must configure a firewall rule for the Azure SQL database server to allow access from your workstation. For instructions about creating an Azure SQL database and configuring the firewall, see [Get started using Azure SQL database][sqldatabase-get-started]. 

    > [AZURE.NOTE] By default an Azure SQL database allows connections from Azure services, such as Azure HDInsight. If this firewall setting is disabled, you must enabled it from the Azure portal. For instruction about creating an Azure SQL database and configuring firewall rules, see [Create and Configure SQL Database][sqldatabase-create-configue].

- **SQL Server**: If your HDInsight cluster is on the same virtual network in Azure as SQL Server, you can use the steps in this article to import and export data to a SQL Server database.

    > [AZURE.NOTE] HDInsight supports only location-based virtual networks, and it does not currently work with affinity group-based virtual networks.

    * To create and configure a virtual network, see [Virtual Network Configuration Tasks](../services/virtual-machines/).

        * When you are using SQL Server in your datacenter, you must configure the virtual network as *site-to-site* or *point-to-site*.

            > [AZURE.NOTE] For **point-to-site** virtual networks, SQL Server must be running the VPN client configuration application, which is available from the **Dashboard** of your Azure virtual network configuration.

        * When you are using SQL Server on an Azure virtual machine, any virtual network configuration can be used if the virtual machine hosting SQL Server is a member of the same virtual network as HDInsight.

    * To create an HDInsight cluster on a virtual network, see [Create Hadoop clusters in HDInsight using custom options](hdinsight-provision-clusters.md)

    > [AZURE.NOTE] SQL Server must also allow authentication. You must use a SQL Server login to complete the steps in this article.
	

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
[hdinsight-get-started]: hdinsight-hadoop-linux-tutorial-get-started.md
[hdinsight-storage]: ../hdinsight-hadoop-use-blob-storage.md
[hdinsight-analyze-flight-data]: hdinsight-analyze-flight-delay-data.md
[hdinsight-use-oozie]: hdinsight-use-oozie.md
[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-submit-jobs]: hdinsight-submit-hadoop-jobs-programmatically.md

[sqldatabase-get-started]: ../sql-database-get-started.md
[sqldatabase-create-configue]: ../sql-database-create-configure.md

[powershell-start]: http://technet.microsoft.com/library/hh847889.aspx
[powershell-install]: powershell-install-configure.md
[powershell-script]: http://technet.microsoft.com/library/ee176949.aspx

[sqoop-user-guide-1.4.4]: https://sqoop.apache.org/docs/1.4.4/SqoopUserGuide.html
