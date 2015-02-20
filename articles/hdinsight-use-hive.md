<properties
   pageTitle="Use Hadoop Hive in HDInsight | Azure"
   description="Learn how to use Hive with Hadoop on HDInsight."
   services="hdinsight"
   documentationCenter=""
   authors="Blackmist"
   manager="paulettm"
   editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.devlang=""
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="02/18/2015"
   ms.author="larryfr"/>

# Use Hive with Hadoop on HDInsight

[AZURE.INCLUDE [hive-selector](../includes/hdinsight-selector-use-hive.md)]

<a href="http://hive.apache.org/" target="_blank">Apache Hive</a> is a data warehouse system for Hadoop, which enables data summarization, querying, and analysis of data using HiveQL - a SQL-Like query language. Hive can be used to interactively explorer your data, or to create reusable batch processing jobs.

In this article, you will learn how you can use Hive with HDInsight.

##<a id="why"></a>Why use Hive?

Hive allows you to project structure on largely unstructured data. Once you define the structure, you can then use Hive to query that data without knowledge of Java or MapReduce. **HiveQL**, the Hive query language, allows you to write queries with statements that are similar to T-SQL. 

Hive understands how to work with structured/semi-structured documents, such as text files where the fields are delimited by a specific characters. Hive also supports custom **serializer/deserializers (SerDe)** for complex, or irregularly structured data. For more information, see <a href="http://blogs.msdn.com/b/bigdatasupport/archive/2014/06/18/how-to-use-a-custom-json-serde-with-microsoft-azure-hdinsight.aspx" target="_blank">How to use a custom JSON SerDe with HDInsight</a>.

Hive can also be extended through **User Defined Functions (UDF)**. A UDF allows you to implement functionality or logic that isn't easily modeled in HiveQL. For an example of using a UDF with Hive, see <a href="http://azure.microsoft.com/en-us/documentation/articles/hdinsight-python/" target="_blank">Using Python with Hive and Pig in HDInsight</a> and <a href="http://blogs.msdn.com/b/bigdatasupport/archive/2014/01/14/how-to-add-custom-hive-udfs-to-hdinsight.aspx" target="_blank">How to add a custom Hive UDF to HDInsight</a>.

##<a id="data"></a>About the sample data

This example uses a *log4j* sample file, which is stored at **/example/data/sample.log** under your blob storage container. Each log inside the file consists of a line of fields that contains a `[LOG LEVEL]` field to show the type and the severity. For example:

	2012-02-03 20:26:41 SampleClass3 [ERROR] verbose detail for id 1527353937

In the example above, the log level is ERROR.

> [AZURE.NOTE] You can also generate your own log4j files using the <a href="http://en.wikipedia.org/wiki/Log4j" target="_blank">Apache Log4j</a> logging utility and then upload that to the blob container. See <a href="../hdinsight-upload-data/" target="_blank">Upload Data to HDInsight</a> for instructions. For more information on how Azure Blob storage is used with HDInsight, see <a href="../hdinsight-use-blob-storage/" target="_blank">Use Azure Blob Storage with HDInsight</a>.

The sample data is stored in Azure Blob storage, which HDInsight uses as the default file system. HDInsight can access files stored in blob storage using the **wasb** prefix. For example, to access the sample.log file, you would use the following syntax:

	wasb:///example/data/sample.log

Since WASB is the default storage for HDInsight, you can also access the file using **/example/data/sample.log** from HiveQL.

> [AZURE.NOTE] The above syntax, **wasb:///**, is used to access files stored on the default storage container for your HDInsight cluster. If you specified additional storage accounts when you provisioned your cluster, and want to access files stored on these accounts, you can access the data by specifying the container name and storage account address. For example, **wasb://mycontainer@mystorage.blob.core.windows.net/example/data/sample.log**.

##<a id="job"></a>About the sample job

The following HiveQL statements will be used to project columns onto delimited data stored in the **wasb:///example/data** directory.

	DROP TABLE log4jLogs;
    CREATE EXTERNAL TABLE log4jLogs (t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string)
    ROW FORMAT DELIMITED FIELDS TERMINATED BY ' '
    STORED AS TEXTFILE LOCATION 'wasb:///example/data/';
    SELECT t4 AS sev, COUNT(*) AS count FROM log4jLogs WHERE t4 = '[ERROR]' GROUP BY t4;

The HiveQL statements perform the following actions

* **DROP TABLE** - deletes the table and the data file, in case the table already exists
* **CREATE EXTERNAL TABLE** - creates a new 'external' table in Hive. External tables only store the table definition in Hive - the data is left in the original location, in the original format
* **ROW FORMAT** - tells Hive how the data is formatted. In this case, the fields in each log are separated by a space
* **STORED AS TEXTFILE LOCATION** - tells Hive where the data is stored (the example/data directory,) and that it is stored as text. The data can be in one file, or spread across multiple files within the directory
* **SELECT** - select a count of all rows where column **t4** contain the value **[ERROR]**. This should return a value of **3** as there are three rows that contain this value

> [AZURE.NOTE] External tables should be used when you expect the underlying data to be updated by an external source, such as an automated data upload process, or by another MapReduce operation, but always want Hive queries to use the latest data.
>
> Dropping an external table does **not** delete the data, only the table definition.

After creating the external table, the following statements will be used to create an **internal** table.

	CREATE TABLE IF NOT EXISTS errorLogs (t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string)
	STORED AS ORC;
	INSERT OVERWRITE TABLE errorLogs 
	SELECT t1, t2, t3, t4, t5, t6, t7 FROM log4jLogs WHERE t4 = '[ERROR]';

These statements perform the following actions.

* **CREATE TABLE IF NOT EXISTS** - creates a table, if it does not already exist. Since the **EXTERNAL** keyword is not used, this is an 'internal' table, which is stored in the Hive data warehouse and is managed completely by Hive
* **STORED AS ORC** - stores the data in Optimized Row Columnar (ORC) format. This is a highly optimized and efficient format for storing Hive data
* **INSERT OVERWRITE ... SELECT** - selects rows from the **log4jLogs** table that contain **[ERROR]**, then insert the data into the **errorLogs** table

> [AZURE.NOTE] Unlike **EXTERNAL** tables, dropping an internal table will delete the underlying data as well.

##<a id="usetez"></a>Using Tez For Improved Performance

<a href="http://tez.apache.org" target="_blank">Apache Tez</a> is a framework that allows for data intensive applications like Hive to execute much more efficiently at scale. In the latest release of HDInsight, Hive now supports running on Tez.  This is currently off by default and must be enabled.  In future cluster versions, this will be set to be on by default. In order to take advantage of Tez, the following value must be set for a Hive query:

	set hive.execution.engine=tez;

This can submitted on a per query basis by placing this at the beginning of your query.  One can also set this to be on by default on a cluster by setting the configuration value at cluster creation time.  You can find more details in  <a href="../hdinsight-provision-clusters/" target="_blank">Provisioning HDInsight Clusters</a>.

The <a href="https://cwiki.apache.org/confluence/display/Hive/Hive+on+Tez" target="_blank">Hive on Tez design documents</a> contain a number of details on the implementation choices and tuning configurations.


##<a id="run"></a>Run the HiveQL job

HDInsight can run HiveQL jobs using a variety of methods. Use the following table to decide which method is right for you, then follow the link for a walkthrough.

|**Use this** if you want... | an **interactive** shell | **batch** processing | with this **Cluster OS** | from this **client OS**|
----------------------------------- | :------------------------: | :----------------:| ------------| --------|
<a href="../hdinsight-hadoop-use-hive-ssh/" target="_blank">SSH</a> | ✔ | ✔ | Linux | Linux, Unix, Mac OS X, or Windows
<a href="../hdinsight-hadoop-use-hive-curl/" target="_blank">Curl</a> | &nbsp; | ✔ | Linux or Windows | Linux, Unix, Mac OS X, or Windows
<a href="../hdinsight-hadoop-use-hive-query-console/" target="_blank">Query console</a> | &nbsp; | ✔ | Windows | Browser-based
<a href="../hdinsight-hadoop-use-hive-visual-studio/" target="_blank">HDInsight tools for Visual Studio</a> | &nbsp; | ✔ | Linux or Windows | Windows
<a href="/en-us/documentation/articles/hdinsight-hadoop-use-pig-dotnet-sdk/" target="_blank">.NET SDK for Hadoop</a> | &nbsp; | ✔ | Linux or Windows | Windows (for now)
<a href="../hdinsight-hadoop-use-hive-powershell/" target="_blank">PowerShell</a> | &nbsp; | ✔ | Linux or Windows | Windows
<a href="../hdinsight-hadoop-use-hive-remote-desktop/" target="_blank">Remote Desktop</a> | ✔ | ✔ | Windows | Windows

##<a id="nextsteps"></a>Next steps

Now that you have learned how to use Hive with HDInsight, use the links below to explore other ways to work with Azure HDInsight.

* [Upload data to HDInsight][hdinsight-upload-data]
* [Use Pig with HDInsight][hdinsight-use-pig]
* [Use MapReduce jobs with HDInsight][hdinsight-use-mapreduce]

[check]: ./media/hdinsight-use-hive/hdi.checkmark.png

[1]: ../hdinsight-hadoop-visual-studio-tools-get-started/

[hdinsight-sdk-documentation]: http://msdnstage.redmond.corp.microsoft.com/en-us/library/dn479185.aspx

[azure-purchase-options]: http://azure.microsoft.com/en-us/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/en-us/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/en-us/pricing/free-trial/

[apache-tez]: http://tez.apache.org
[apache-hive]: http://hive.apache.org/
[apache-log4j]: http://en.wikipedia.org/wiki/Log4j
[hive-on-tez-wiki]: https://cwiki.apache.org/confluence/display/Hive/Hive+on+Tez
[import-to-excel]: http://azure.microsoft.com/en-us/documentation/articles/hdinsight-connect-excel-power-query/

[hdinsight-use-pig]: ../hdinsight-use-pig/
[hdinsight-use-oozie]: ../hdinsight-use-oozie/
[hdinsight-analyze-flight-data]: ../hdinsight-analyze-flight-delay-data/
[hdinsight-use-mapreduce]: ../hdinsight-use-mapreduce/


[hdinsight-storage]: ../hdinsight-use-blob-storage

[hdinsight-provision]: ../hdinsight-provision-clusters/
[hdinsight-submit-jobs]: ../hdinsight-submit-hadoop-jobs-programmatically/
[hdinsight-upload-data]: ../hdinsight-upload-data/
[hdinsight-get-started]: ../hdinsight-get-started/

[Powershell-install-configure]: ../install-configure-powershell/
[powershell-here-strings]: http://technet.microsoft.com/en-us/library/ee692792.aspx

[image-hdi-hive-powershell]: ./media/hdinsight-use-hive/HDI.HIVE.PowerShell.png
[img-hdi-hive-powershell-output]: ./media/hdinsight-use-hive/HDI.Hive.PowerShell.Output.png
[image-hdi-hive-architecture]: ./media/hdinsight-use-hive/HDI.Hive.Architecture.png
