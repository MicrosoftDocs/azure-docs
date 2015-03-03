<properties
   pageTitle="Use Hadoop Pig in HDInsight | Azure"
   description="Learn how to use Pig with Hadoop on HDInsight."
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

# Use Pig with Hadoop on HDInsight

[AZURE.INCLUDE [pig-selector](../includes/hdinsight-selector-use-pig.md)]

<a href="http://pig.apache.org/" target="_blank">Apache Pig</a> is a platform for creating programs for Hadoop using a procedural language known as *Pig Latin*. Pig is an alternative to Java for creating *MapReduce* solutions, and is included with Azure HDInsight.

In this article you will learn how you can use Pig with HDInsight.

##<a id="why"></a>Why use Pig?

One of the challenges of processing data using MapReduce in Hadoop is implementing your processing logic using only a map and reduce function. For complex processing, you often have to break processing into multiple MapReduce operations that are chained together to achieve the desired result.

Instead of forcing you to use only map and reduce functions, Pig allows you to define processing as a series of transformations that the data flows through to produce the desired output.

The Pig Latin language allows you to describe the data flow from raw input, through one or more transformations, to produce the desired output. Pig Latin programs follow this general pattern:

- **Load**: Read data to be manipulated from the file system
- **Transform**: Manipulate the data
- **Dump or store**: Output data to the screen or store for processing

Pig Latin also supports User Defined Functions (UDF), which allows you to invoke external components that implement logic that is difficult to model in Pig Latin.

For more information on Pig Latin, see <a href="http://pig.apache.org/docs/r0.7.0/piglatin_ref1.html" target="_blank">Pig Latin Reference Manual 1</a> and <a href="http://pig.apache.org/docs/r0.7.0/piglatin_ref2.html" target="_blank">Pig Latin Reference Manual 2</a>.

For an example of using a UTF with Pig, see <a href="/en-us/documentation/articles/hdinsight-python/" target="_blank">Using Python with Pig and Hive</a>.

##<a id="data"></a>About the sample data

This example uses a *log4j* sample file, which is stored at **/example/data/sample.log** under your blob storage container. Each log inside the file consists of a line of fields that contains a `[LOG LEVEL]` field to show the type and the severity. For example:

	2012-02-03 20:26:41 SampleClass3 [ERROR] verbose detail for id 1527353937

In the example above, the log level is ERROR.

> [AZURE.NOTE] You can also generate your own log4j files using the <a href="http://en.wikipedia.org/wiki/Log4j" target="_blank">Apache Log4j</a> logging utility and then upload that to the blob container. See <a href="/en-us/documentation/articles/hdinsight-upload-data/" target="_blank">Upload Data to HDInsight</a> for instructions. For more information on how Azure Blob storage is used with HDInsight, see <a href="/en-us/documentation/articles/hdinsight-use-blob-storage" target="_blank">Use Azure Blob Storage with HDInsight</a>.

The sample data is stored in Azure Blob storage, which HDInsight uses as the default file system for Hadoop clusters. HDInsight can access files stored in blob storage using the **wasb** prefix. For example, to access the sample.log file, you would use the following syntax:

	wasb:///example/data/sample.log

Since WASB is the default storage for HDInsight, you can also access the file using **/example/data/sample.log** from Pig Latin.

> [AZURE.NOTE] The above syntax, **wasb:///**, is used to access files stored on the default storage container for your HDInsight cluster. If you specified additional storage accounts when you provisioned your cluster, and want to access files stored on these accounts, you can access the data by specifying the container name and storage account address. For example, **wasb://mycontainer@mystorage.blob.core.windows.net/example/data/sample.log**.


##<a id="job"></a>About the sample job

The following Pig Latin job loads the **sample.log** file from the default storage for your HDInsight cluster, then performs a series of transformations that result in a count of how many times each log level occurred in the input data. The results are dumped to STDOUT.

	LOGS = LOAD 'wasb:///example/data/sample.log';
	LEVELS = foreach LOGS generate REGEX_EXTRACT($0, '(TRACE|DEBUG|INFO|WARN|ERROR|FATAL)', 1)  as LOGLEVEL;
	FILTEREDLEVELS = FILTER LEVELS by LOGLEVEL is not null;
	GROUPEDLEVELS = GROUP FILTEREDLEVELS by LOGLEVEL;
	FREQUENCIES = foreach GROUPEDLEVELS generate group as LOGLEVEL, COUNT(FILTEREDLEVELS.LOGLEVEL) as COUNT;
	RESULT = order FREQUENCIES by COUNT desc;
	DUMP RESULT;

The following is a breakdown of what each transformation does to the data.

![Graphical representation of the transformations][image-hdi-pig-data-transformation]

##<a id="run"></a>Run the Pig Latin job

HDInsight can run Pig Latin jobs using a variety of methods. Use the following table to decide which method is right for you, then follow the link for a walkthrough.

|**Use this** if you want... | an **interactive** shell | **batch** processing | with this **Cluster OS** | from this **client OS**|
----------------------------------- | :------------------------: | :----------------:| ------------| --------|
<a href="/en-us/documentation/articles/hdinsight-hadoop-use-pig-ssh/" target="_blank">SSH</a> | ✔ | ✔ | Linux | Linux, Unix, Mac OS X, or Windows
<a href="/en-us/documentation/articles/hdinsight-hadoop-use-pig-curl/" target="_blank">Curl</a> | &nbsp; | ✔ | Linux or Windows | Linux, Unix, Mac OS X, or Windows
<a href="/en-us/documentation/articles/hdinsight-hadoop-use-pig-dotnet-sdk/" target="_blank">.NET SDK for Hadoop</a> | &nbsp; | ✔ | Linux or Windows | Windows (for now)
<a href="/en-us/documentation/articles/hdinsight-hadoop-use-pig-powershell/" target="_blank">PowerShell</a> | &nbsp; | ✔ | Linux or Windows | Windows
<a href="/en-us/documentation/articles/hdinsight-hadoop-use-pig-remote-desktop/" target="_blank">Remote Desktop</a> | ✔ | ✔ | Windows | Windows

##<a id="nextsteps"></a>Next steps

Now that you have learned how to use Pig with HDInsight, use the links below to explore other ways to work with Azure HDInsight.

* [Upload data to HDInsight][hdinsight-upload-data]
* [Use Hive with HDInsight][hdinsight-use-hive]
* [Use MapReduce jobs with HDInsight][hdinsight-use-mapreduce]

[check]: ./media/hdinsight-use-pig/hdi.checkmark.png

[apachepig-home]: http://pig.apache.org/
[putty]: http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html
[curl]: http://curl.haxx.se/

[hdinsight-storage]: /en-us/documentation/articles/hdinsight-use-blob-storage/
[hdinsight-upload-data]: /en-us/documentation/articles/hdinsight-upload-data/
[hdinsight-get-started]: /en-us/documentation/articles/hdinsight-get-started/
[hdinsight-admin-powershell]: ../hdinsight-administer-use-powershell/

[hdinsight-use-hive]: ../hdinsight-use-hive/
[hdinsight-use-mapreduce]: ../hdinsight-use-mapreduce/

[hdinsight-provision]: ../hdinsight-provision-clusters/
[hdinsight-submit-jobs]: ../hdinsight-submit-hadoop-jobs-programmatically/#mapreduce-sdk

[Powershell-install-configure]: ../install-configure-powershell/

[powershell-start]: http://technet.microsoft.com/library/hh847889.aspx

[image-hdi-log4j-sample]: ./media/hdinsight-use-pig/HDI.wholesamplefile.png
[image-hdi-pig-data-transformation]: ./media/hdinsight-use-pig/HDI.DataTransformation.gif
[image-hdi-pig-powershell]: ./media/hdinsight-use-pig/hdi.pig.powershell.png
[image-hdi-pig-architecture]: ./media/hdinsight-use-pig/HDI.Pig.Architecture.png
