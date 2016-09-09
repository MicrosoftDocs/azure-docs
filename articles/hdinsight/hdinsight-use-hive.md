<properties
	pageTitle="Learn what is Hive and how to use HiveQL | Microsoft Azure"
	description="Learn about Apache Hive and how to use it with Hadoop in HDInsight. Choose how to run your Hive job, and use HiveQL to analyze a sample Apache log4j file."
	keywords="hiveql,what is hive"
	services="hdinsight"
	documentationCenter=""
	authors="Blackmist"
	manager="paulettm"
	editor="cgronlun"
	tags="azure-portal"/>

<tags
	ms.service="hdinsight"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="big-data"
	ms.date="06/16/2016"
	ms.author="larryfr"/>

# Use Hive and HiveQL with Hadoop in HDInsight to analyze a sample Apache log4j file

[AZURE.INCLUDE [hive-selector](../../includes/hdinsight-selector-use-hive.md)]


In this tutorial, you'll learn how to use Apache Hive in Hadoop on HDInsight, and choose how to run your Hive job. You'll also learn about HiveQL and how to analyze a sample Apache log4j file.

##<a id="why"></a>What is Hive and why use it?
[Apache Hive](http://hive.apache.org/) is a data warehouse system for Hadoop, which enables data summarization, querying, and analysis of data by using HiveQL (a query language similar to SQL). Hive can be used to interactively explore your data or to create reusable batch processing jobs.

Hive allows you to project structure on largely unstructured data. After you define the structure, you can use Hive to query that data without knowledge of Java or MapReduce. **HiveQL** (the Hive query language) allows you to write queries with statements that are similar to T-SQL.

Hive understands how to work with structured and semi-structured data, such as text files where the fields are delimited by specific characters. Hive also supports custom **serializer/deserializers (SerDe)** for complex or irregularly structured data. For more information, see [How to use a custom JSON SerDe with HDInsight](http://blogs.msdn.com/b/bigdatasupport/archive/2014/06/18/how-to-use-a-custom-json-serde-with-microsoft-azure-hdinsight.aspx).

Hive can also be extended through **user-defined functions (UDF)**. A UDF allows you to implement functionality or logic that isn't easily modeled in HiveQL. For an example of using UDFs with Hive, see the following:

* [Use a Java User Defined Function with Hive](hdinsight-hadoop-hive-java-udf.md)

* [Using Python with Hive and Pig in HDInsight](hdinsight-python.md)

* [Use C# with Hive and Pig in HDInsight](hdinsight-hadoop-hive-pig-udf-dotnet-csharp.md)

* [How to add a custom Hive UDF to HDInsight](http://blogs.msdn.com/b/bigdatasupport/archive/2014/01/14/how-to-add-custom-hive-udfs-to-hdinsight.aspx)


## Hive internal tables vs external tables

There are a few things you need to know about the Hive internal table and external table:

- The **CREATE TABLE** command creates an internal table. The data file must be located in the default container.
- The **CREATE TABLE** command moves the data file to the /hive/warehouse/<TableName> folder.
- The **CREATE EXTERNAL TABLE** command creates an external table. The data file can be located outside the default container.
- The **CREATE EXTERNAL TABLE** command does not move the data file.
- The **CREATE EXTERNAL TABLE** command doesn't allow any folders in the LOCATION. This is the reason why the tutorial makes a copy of the sample.log file.

For more information, see [HDInsight: Hive Internal and External Tables Intro][cindygross-hive-tables].


##<a id="data"></a>About the sample data, an Apache log4j file

This example uses a *log4j* sample file, which is stored at **/example/data/sample.log** in your blob storage container. Each log inside the file consists of a line of fields that contains a `[LOG LEVEL]` field to show the type and the severity, for example:

	2012-02-03 20:26:41 SampleClass3 [ERROR] verbose detail for id 1527353937

In the previous example, the log level is ERROR.

> [AZURE.NOTE] You can also generate a log4j file by using the [Apache Log4j](http://en.wikipedia.org/wiki/Log4j) logging tool and then upload that file to the blob container. See [Upload Data to HDInsight](hdinsight-upload-data.md) for instructions. For more information about how Azure Blob storage is used with HDInsight, see [Use Azure Blob Storage with HDInsight](hdinsight-hadoop-use-blob-storage.md).

The sample data is stored in Azure Blob storage, which HDInsight uses as the default file system. HDInsight can access files stored in blobs by using the **wasb** prefix. For example, to access the sample.log file, you would use the following syntax:

	wasbs:///example/data/sample.log

Because Azure Blob storage is the default storage for HDInsight, you can also access the file by using **/example/data/sample.log** from HiveQL.

> [AZURE.NOTE] The syntax, **wasbs:///**, is used to access files stored in the default storage container for your HDInsight cluster. If you specified additional storage accounts when you provisioned your cluster, and you want to access files stored in these accounts, you can access the data by specifying the container name and storage account address, for example, **wasbs://mycontainer@mystorage.blob.core.windows.net/example/data/sample.log**.

##<a id="job"></a>Sample job: Project columns onto delimited data

The following HiveQL statements will project columns onto delimited data that is stored in the **wasbs:///example/data** directory:

    set hive.execution.engine=tez;
	DROP TABLE log4jLogs;
    CREATE EXTERNAL TABLE log4jLogs (t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string)
    ROW FORMAT DELIMITED FIELDS TERMINATED BY ' '
    STORED AS TEXTFILE LOCATION 'wasbs:///example/data/';
    SELECT t4 AS sev, COUNT(*) AS count FROM log4jLogs WHERE t4 = '[ERROR]' AND INPUT__FILE__NAME LIKE '%.log' GROUP BY t4;

In the previous example, the HiveQL statements perform the following actions:

* __set hive.execution.engine=tez;__: Sets the execution engine to use Tez. Using Tez instead of MapReduce can provide an increase in query performance. For more information on Tez, see the [Use Apache Tez for improved performance](#usetez) section.

    > [AZURE.NOTE] This statement is only required when using a Windows-based HDInsight cluster; Tez is the default execution engine for Linux-based HDInsight.

* **DROP TABLE**: Deletes the table and the data file if the table already exists.
* **CREATE EXTERNAL TABLE**: Creates a new **external** table in Hive. External tables only store the table definition in Hive; the data is left in the original location and in the original format.
* **ROW FORMAT**: Tells Hive how the data is formatted. In this case, the fields in each log are separated by a space.
* **STORED AS TEXTFILE LOCATION**: Tells Hive where the data is stored (the example/data directory) and that it is stored as text. The data can be in one file or spread across multiple files within the directory.
* **SELECT**: Selects a count of all rows where the column **t4** contains the value **[ERROR]**. This should return a value of **3** because there are three rows that contain this value.
* **INPUT__FILE__NAME LIKE '%.log'** - Tells Hive that we should only return data from files ending in .log. This restricts the search to the sample.log file that contains the data, and keeps it from returning data from other example data files that do not match the schema we defined.

> [AZURE.NOTE] External tables should be used when you expect the underlying data to be updated by an external source, such as an automated data upload process, or by another MapReduce operation, and you always want Hive queries to use the latest data.
>
> Dropping an external table does **not** delete the data, it only deletes the table definition.

After creating the external table, the following statements are used to create an **internal** table.

    set hive.execution.engine=tez;
	CREATE TABLE IF NOT EXISTS errorLogs (t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string)
	STORED AS ORC;
	INSERT OVERWRITE TABLE errorLogs
	SELECT t1, t2, t3, t4, t5, t6, t7 FROM log4jLogs WHERE t4 = '[ERROR]';

These statements perform the following actions:

* **CREATE TABLE IF NOT EXISTS**: Creates a table, if it does not already exist. Because the **EXTERNAL** keyword is not used, this is an internal table, which is stored in the Hive data warehouse and is managed completely by Hive.
* **STORED AS ORC**: Stores the data in Optimized Row Columnar (ORC) format. This is a highly optimized and efficient format for storing Hive data.
* **INSERT OVERWRITE ... SELECT**: Selects rows from the **log4jLogs** table that contains **[ERROR]**, and then inserts the data into the **errorLogs** table.

> [AZURE.NOTE] Unlike external tables, dropping an internal table also deletes the underlying data.

##<a id="usetez"></a>Use Apache Tez for improved performance

[Apache Tez](http://tez.apache.org) is a framework that allows data intensive applications, such as Hive, to run much more efficiently at scale. In the latest release of HDInsight, Hive supports running on Tez. Tez is enabled by default for Linux-based HDInsight clusters.

> [AZURE.NOTE] Tez is currently off by default for Windows-based HDInsight clusters and it must be enabled. To take advantage of Tez, the following value must be set for a Hive query:
>
> ```set hive.execution.engine=tez;```
>
>This can be submitted on a per-query basis by placing it at the beginning of your query. You can also set this to be on by default on a cluster by setting the configuration value when you create the cluster. You can find more details in [Provisioning HDInsight Clusters](hdinsight-provision-clusters.md).

The [Hive on Tez design documents](https://cwiki.apache.org/confluence/display/Hive/Hive+on+Tez) contain a number of details about the implementation choices and tuning configurations.

To aid in debugging jobs ran using Tez, HDInsight provides the following web UIs that allow you to view details of Tez jobs:

* [Use the Tez UI on Windows-based HDInsight](hdinsight-debug-tez-ui.md)

* [Use the Ambari Tez view on Linux-based HDInsight](hdinsight-debug-ambari-tez-view.md)

##<a id="run"></a>Choose how to run the HiveQL job

HDInsight can run HiveQL jobs using a variety of methods. Use the following table to decide which method is right for you, then follow the link for a walkthrough.

| **Use this** if you want...                                                     | ...an **interactive** shell | ...**batch** processing | ...with this **cluster operating system** | ...from this **client operating system** |
|:--------------------------------------------------------------------------------|:---------------------------:|:-----------------------:|:------------------------------------------|:-----------------------------------------|
| [Hive View](hdinsight-hadoop-use-hive-ambari-view.md) | ✔ | ✔ | Linux | Any (browser based) |
| [Beeline command (from an SSH session)](hdinsight-hadoop-use-hive-beeline.md)                                         |              ✔              |            ✔            | Linux                                     | Linux, Unix, Mac OS X, or Windows        |
| [Hive command (from an SSH session)](hdinsight-hadoop-use-hive-ssh.md)                                         |              ✔              |            ✔            | Linux                                     | Linux, Unix, Mac OS X, or Windows        |
| [Curl](hdinsight-hadoop-use-hive-curl.md)                                       |           &nbsp;            |            ✔            | Linux or Windows                          | Linux, Unix, Mac OS X, or Windows        |
| [Query console](hdinsight-hadoop-use-hive-query-console.md)                     |           &nbsp;            |            ✔            | Windows                                   | Any (browser based)                            |
| [HDInsight tools for Visual Studio](hdinsight-hadoop-use-hive-visual-studio.md) |           &nbsp;            |            ✔            | Linux or Windows                          | Windows                                  |
| [Windows PowerShell](hdinsight-hadoop-use-hive-powershell.md)                   |           &nbsp;            |            ✔            | Linux or Windows                          | Windows                                  |
| [Remote Desktop](hdinsight-hadoop-use-hive-remote-desktop.md)                   |              ✔              |            ✔            | Windows                                   | Windows                                  |

## Running Hive jobs on Azure HDInsight using on-premises SQL Server Integration Services

You can also use SQL Server Integration Services (SSIS) to run a Hive job. The Azure Feature Pack for SSIS provides the following components that work with Hive jobs on HDInsight.


- [Azure HDInsight Hive Task][hivetask]
- [Azure Subscription Connection Manager][connectionmanager]


Learn more about the Azure Feature Pack for SSIS [here][ssispack].


##<a id="nextsteps"></a>Next steps

Now that you've learned what Hive is and how to use it with Hadoop in HDInsight, use the following links to explore other ways to work with Azure HDInsight.


- [Upload data to HDInsight][hdinsight-upload-data]
- [Use Pig with HDInsight][hdinsight-use-pig]
- [Use Sqoop with HDInsight](hdinsight-use-sqoop.md)
- [Use Oozie with HDInsight](hdinsight-use-oozie.md)
- [Use MapReduce jobs with HDInsight][hdinsight-use-mapreduce]

[check]: ./media/hdinsight-use-hive/hdi.checkmark.png

[hdinsight-sdk-documentation]: http://msdnstage.redmond.corp.microsoft.com/library/dn479185.aspx

[azure-purchase-options]: http://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/

[apache-tez]: http://tez.apache.org
[apache-hive]: http://hive.apache.org/
[apache-log4j]: http://en.wikipedia.org/wiki/Log4j
[hive-on-tez-wiki]: https://cwiki.apache.org/confluence/display/Hive/Hive+on+Tez
[import-to-excel]: http://azure.microsoft.com/documentation/articles/hdinsight-connect-excel-power-query/
[hivetask]: http://msdn.microsoft.com/library/mt146771(v=sql.120).aspx
[connectionmanager]: http://msdn.microsoft.com/library/mt146773(v=sql.120).aspx
[ssispack]: http://msdn.microsoft.com/library/mt146770(v=sql.120).aspx

[hdinsight-use-pig]: hdinsight-use-pig.md
[hdinsight-use-oozie]: hdinsight-use-oozie.md
[hdinsight-analyze-flight-data]: hdinsight-analyze-flight-delay-data.md
[hdinsight-use-mapreduce]: hdinsight-use-mapreduce.md


[hdinsight-storage]: hdinsight-hadoop-use-blob-storage.md

[hdinsight-provision]: hdinsight-provision-clusters.md
[hdinsight-submit-jobs]: hdinsight-submit-hadoop-jobs-programmatically.md
[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-get-started]: hdinsight-get-started.md

[Powershell-install-configure]: ../powershell-install-configure.md
[powershell-here-strings]: http://technet.microsoft.com/library/ee692792.aspx

[image-hdi-hive-powershell]: ./media/hdinsight-use-hive/HDI.HIVE.PowerShell.png
[img-hdi-hive-powershell-output]: ./media/hdinsight-use-hive/HDI.Hive.PowerShell.Output.png
[image-hdi-hive-architecture]: ./media/hdinsight-use-hive/HDI.Hive.Architecture.png


[cindygross-hive-tables]: http://blogs.msdn.com/b/cindygross/archive/2013/02/06/hdinsight-hive-internal-and-external-tables-intro.aspx