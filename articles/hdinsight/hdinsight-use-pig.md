<properties
   pageTitle="Use Hadoop Pig in HDInsight | Microsoft Azure"
   description="Learn how to use Pig with Hadoop on HDInsight."
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
   ms.date="06/28/2016"
   ms.author="larryfr"/>

# Use Pig with Hadoop on HDInsight

[AZURE.INCLUDE [pig-selector](../../includes/hdinsight-selector-use-pig.md)]

[Apache Pig](http://pig.apache.org/) is a platform for creating programs for Hadoop by using a procedural language known as *Pig Latin*. Pig is an alternative to Java for creating *MapReduce* solutions, and it is included with Azure HDInsight.

In this article, you will learn how you can use Pig with HDInsight.

##<a id="why"></a>Why use Pig?

One of the challenges of processing data by using MapReduce in Hadoop is implementing your processing logic by using only a map and a reduce function. For complex processing, you often have to break processing into multiple MapReduce operations that are chained together to achieve the desired result.

Instead of forcing you to use only map and reduce functions, Pig allows you to define processing as a series of transformations that the data flows through to produce the desired output.

The Pig Latin language allows you to describe the data flow from raw input, through one or more transformations, to produce the desired output. Pig Latin programs follow this general pattern:

- **Load**: Read data to be manipulated from the file system
- **Transform**: Manipulate the data
- **Dump or store**: Output data to the screen or store it for processing

Pig Latin also supports user-defined functions (UDF), which allows you to invoke external components that implement logic that is difficult to model in Pig Latin.

For more information about Pig Latin, see [Pig Latin Reference Manual 1](http://pig.apache.org/docs/r0.7.0/piglatin_ref1.html) and [Pig Latin Reference Manual 2](http://pig.apache.org/docs/r0.7.0/piglatin_ref2.html).

For an example of using UDFs with Pig, see the following documents:

* [Use DataFu with Pig in HDInsight](hdinsight-hadoop-use-pig-datafu-udf.md) - DataFu is a collection of useful UDFs maintained by Apache

* [Use Python with Pig and Hive in HDInsight](hdinsight-python.md)

* [Use C# with Hive and Pig in HDInsight](hdinsight-hadoop-hive-pig-udf-dotnet-csharp.md)

##<a id="data"></a>About the sample data

This example uses a *log4j* sample file, which is stored at **/example/data/sample.log** in your blob storage container. Each log inside the file consists of a line of fields that contains a `[LOG LEVEL]` field to show the type and the severity, for example:

	2012-02-03 20:26:41 SampleClass3 [ERROR] verbose detail for id 1527353937

In the previous example, the log level is ERROR.

> [AZURE.NOTE] You can also generate a log4j file by using the [Apache Log4j](http://en.wikipedia.org/wiki/Log4j) logging tool and then upload that file to your blob. See [Upload Data to HDInsight](hdinsight-upload-data.md) for instructions. For more information about how blobs in Azure storage are used with HDInsight, see [Use Azure Blob Storage with HDInsight](hdinsight-hadoop-use-blob-storage.md).

The sample data is stored in Azure Blob storage, which HDInsight uses as the default file system for Hadoop clusters. HDInsight can access files stored in blobs by using the **wasb** prefix. For example, to access the sample.log file, you would use the following syntax:

	wasb:///example/data/sample.log

Because WASB is the default storage for HDInsight, you can also access the file by using **/example/data/sample.log** from Pig Latin.

> [AZURE.NOTE] The syntax, **wasb:///**, is used to access files stored in the default storage container for your HDInsight cluster. If you specified additional storage accounts when you provisioned your cluster, and you want to access files stored in these accounts, you can access the data by specifying the container name and storage account address, for example: **wasb://mycontainer@mystorage.blob.core.windows.net/example/data/sample.log**.


##<a id="job"></a>About the sample job

The following Pig Latin job loads the **sample.log** file from the default storage for your HDInsight cluster. Then it performs a series of transformations that result in a count of how many times each log level occurred in the input data. The results are dumped into STDOUT.

	LOGS = LOAD 'wasb:///example/data/sample.log';
	LEVELS = foreach LOGS generate REGEX_EXTRACT($0, '(TRACE|DEBUG|INFO|WARN|ERROR|FATAL)', 1)  as LOGLEVEL;
	FILTEREDLEVELS = FILTER LEVELS by LOGLEVEL is not null;
	GROUPEDLEVELS = GROUP FILTEREDLEVELS by LOGLEVEL;
	FREQUENCIES = foreach GROUPEDLEVELS generate group as LOGLEVEL, COUNT(FILTEREDLEVELS.LOGLEVEL) as COUNT;
	RESULT = order FREQUENCIES by COUNT desc;
	DUMP RESULT;

The following image shows a breakdown of what each transformation does to the data.

![Graphical representation of the transformations][image-hdi-pig-data-transformation]

##<a id="run"></a>Run the Pig Latin job

HDInsight can run Pig Latin jobs by using a variety of methods. Use the following table to decide which method is right for you, then follow the link for a walkthrough.

| **Use this** if you want...                                   | ...an **interactive** shell | ...**batch** processing | ...with this **cluster operating system** | ...from this **client operating system** |
|:--------------------------------------------------------------|:---------------------------:|:-----------------------:|:------------------------------------------|:-----------------------------------------|
| [SSH](hdinsight-hadoop-use-pig-ssh.md)                        |              ✔              |            ✔            | Linux                                     | Linux, Unix, Mac OS X, or Windows        |
| [Curl](hdinsight-hadoop-use-pig-curl.md)                      |           &nbsp;            |            ✔            | Linux or Windows                          | Linux, Unix, Mac OS X, or Windows        |
| [.NET SDK for Hadoop](hdinsight-hadoop-use-pig-dotnet-sdk.md) |           &nbsp;            |            ✔            | Linux or Windows                          | Windows (for now)                        |
| [Windows PowerShell](hdinsight-hadoop-use-pig-powershell.md)  |           &nbsp;            |            ✔            | Linux or Windows                          | Windows                                  |
| [Remote Desktop](hdinsight-hadoop-use-pig-remote-desktop.md)  |              ✔              |            ✔            | Windows                                   | Windows                                  |


## Running Pig jobs on Azure HDInsight using on-premises SQL Server Integration Services

You can also use SQL Server Integration Services (SSIS) to run a Pig job. The Azure Feature Pack for SSIS provides the following components that work with Pig jobs on HDInsight.


- [Azure HDInsight Pig Task][pigtask]
- [Azure Subscription Connection Manager][connectionmanager]


Learn more about the Azure Feature Pack for SSIS [here][ssispack].


##<a id="nextsteps"></a>Next steps

Now that you have learned how to use Pig with HDInsight, use the following links to explore other ways to work with Azure HDInsight.

* [Upload data to HDInsight][hdinsight-upload-data]
* [Use Hive with HDInsight][hdinsight-use-hive]
* [Use Sqoop with HDInsight](hdinsight-use-sqoop.md)
* [Use Oozie with HDInsight](hdinsight-use-oozie.md)
* [Use MapReduce jobs with HDInsight][hdinsight-use-mapreduce]

[check]: ./media/hdinsight-use-pig/hdi.checkmark.png

[apachepig-home]: http://pig.apache.org/
[putty]: http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html
[curl]: http://curl.haxx.se/
[pigtask]: http://msdn.microsoft.com/library/mt146781(v=sql.120).aspx
[connectionmanager]: http://msdn.microsoft.com/library/mt146773(v=sql.120).aspx
[ssispack]: http://msdn.microsoft.com/library/mt146770(v=sql.120).aspx

[hdinsight-storage]: hdinsight-use-blob-storage.md
[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-get-started]: ../hdinsight-get-started.md
[hdinsight-admin-powershell]: hdinsight-administer-use-powershell.md

[hdinsight-use-hive]: hdinsight-use-hive.md
[hdinsight-use-mapreduce]: hdinsight-use-mapreduce.md

[hdinsight-provision]: hdinsight-provision-clusters.md
[hdinsight-submit-jobs]: hdinsight-submit-hadoop-jobs-programmatically.md#mapreduce-sdk

[Powershell-install-configure]: ../powershell-install-configure.md

[powershell-start]: http://technet.microsoft.com/library/hh847889.aspx

[image-hdi-log4j-sample]: ./media/hdinsight-use-pig/HDI.wholesamplefile.png
[image-hdi-pig-data-transformation]: ./media/hdinsight-use-pig/HDI.DataTransformation.gif
[image-hdi-pig-powershell]: ./media/hdinsight-use-pig/hdi.pig.powershell.png
[image-hdi-pig-architecture]: ./media/hdinsight-use-pig/HDI.Pig.Architecture.png