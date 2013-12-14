<properties linkid="manage-services-hdinsight-howto-pig" urlDisplayName="Use Pig with HDInsight" pageTitle="Use Pig with HDInsight | Windows Azure" metaKeywords="" description="Learn how to use Pig with HDInsight. Write Pig Latin statements to analyze an application log file, and run queries on the data to generate output for analysis." metaCanonical="" services="hdinsight" documentationCenter="" title="Use Pig with HDInsight" authors=""  solutions="" writer="jgao" manager="paulettm" editor="cgronlun"  />



# Use Pig with HDInsight #


[Apache *Pig*][apachepig-home] provides a scripting language to execute *MapReduce* jobs as an alternative to writing Java code. In this tutorial, you will use PowerShell to run some Pig Latin statements to analyze an Apache log4j log file, and run various queries on the data to generate output. This tutorial demonstrates the advantages of Pig, and how it can be used to simplify MapReduce jobs. 

Pig's scripting language is called *Pig Latin*. Pig Latin statements follow this general flow:   

- **Load**: Read data to be manipulated from the file system
- **Transform**: Manipulate the data 
- **Dump or store**: Output data to the screen or store for processing

For more information on Pig Latin, see [Pig Latin Reference Manual 1][piglatin-manual-1] and [Pig Latin Reference Manual 2][piglatin-manual-2].

**Prerequisites**

Note the following requirements before you begin this article:

* A Windows Azure HDInsight cluster. For instructions, see [Get started with Windows Azure HDInsight][hdinsight-getting-started] or [Provision HDInsight clusters][hdinsight-provision].
* Install and configure PowerShell for HDInsight. For instructions, see [Install and configure PowerShell for HDInsight][hdinsight-configure-powershell].

**Estimated time to complete:** 30 minutes

##In this article

* [The Pig usage case](#usage)
* [Upload data files to Windows Azure Blob storage](#uploaddata)
* [Understand Pig Latin](#understand)
* [Run Pig Latin using PowerShell](#powershell)
* [Next steps](#nextsteps)
 
##<a id="usage"></a>The Pig usage case
Databases are great for small sets of data and low latency queries. However, when it comes to big data and large data sets in terabytes, traditional SQL databases are not the ideal solution. As database load increases and performance degrades, historically, database administrators have had to buy bigger hardware. 

Generally, all applications save errors, exceptions and other coded issues in a log file, so administrators can review the problems, or generate certain metrics from the log file data. These log files usually get quite large in size, containing a wealth of data that must be processed and mined. 

Log files are a good example of big data. Working with big data is difficult using relational databases and statistics/visualization packages. Due to the large amounts of data and the computation of this data, parallel software running on tens, hundreds, or even thousands of servers is often required to compute this data in a reasonable time. Hadoop provides a MapReduce framework for writing applications that processes large amounts of structured and unstructured data in parallel across large clusters of machines in a very reliable and fault-tolerant manner.

Using Pig reduces the time needed to write mapper and reducer programs. This means that no Java is required, and there is no need for boilerplate code. You also have the flexibility to combine Java code with Pig. Many complex algorithms can be written in less than five lines of human-readable Pig code.

The visual representation of what you will accomplish in this article is shown in the following two figures. These figures show a representative sample of the dataset to illustrate the flow and transformation of the data as you run through the lines of Pig code in the script. The first figure shows a sample of the log4j file:

![Whole File Sample][image-hdi-log4j-sample]

The second figure shows the data transformation:

![HDI.PIG.Data.Transformation][image-hdi-pig-data-transformation]




























##<a id="uploaddata"></a>Upload data file to the Blob storage

HDInsight uses a Windows Azure Blob storage container as the default file system.  For more information, see [Use Windows Azure Blob Storage with HDInsight][hdinsight-storage]. In this article you will use a log4j sample file distributed with the HDInsight cluster stored in *\example\data\sample.log*. For information on uploading data, see [Upload data to HDInsight][hdinsight-upload-data].

To access files, use the following syntax: 

		wasb

For example:

		wasb://mycontainer@mystorage.blob.core.windows.net/example/data/sample.log

replace *mycontainer* with the container name, and *mystorage* with the Blob storage account name. 

Because the file is stored in the default file system, you can also access the file using the following:

		wasb:///example/data/sample.log
		/example/data/sample.log



	
##<a id="understand"></a> Understand Pig Latin

In this session, you will review some Pig Latin statements, and the results after running the statements. In the next session, you will run PowerShell to execute the Pig statements.

1. Load data from the file system, and then display the results 

		LOGS = LOAD 'wasb:///example/data/sample.log';
		DUMP LOGS;
	
	The output is similar to the following:
	
		(2012-02-05 19:23:50 SampleClass5 [TRACE] verbose detail for id 313393809)
		(2012-02-05 19:23:50 SampleClass6 [DEBUG] detail for id 536603383)
		(2012-02-05 19:23:50 SampleClass9 [TRACE] verbose detail for id 564842645)
		(2012-02-05 19:23:50 SampleClass8 [TRACE] verbose detail for id 1929822199)
		(2012-02-05 19:23:50 SampleClass5 [DEBUG] detail for id 1599724386)
		(2012-02-05 19:23:50 SampleClass0 [INFO] everything normal for id 2047808796)
		(2012-02-05 19:23:50 SampleClass2 [TRACE] verbose detail for id 1774407365)
		(2012-02-05 19:23:50 SampleClass2 [TRACE] verbose detail for id 2099982986)
		(2012-02-05 19:23:50 SampleClass4 [DEBUG] detail for id 180683124)
		(2012-02-05 19:23:50 SampleClass2 [TRACE] verbose detail for id 1072988373)
		(2012-02-05 19:23:50 SampleClass9 [TRACE] verbose detail)
		...

2. Go through each line in the data file to find a match on the 6 log levels:

		LEVELS = foreach LOGS generate REGEX_EXTRACT($0, '(TRACE|DEBUG|INFO|WARN|ERROR|FATAL)', 1)  as LOGLEVEL;
 
3. Filter out the rows that do not have a match. For example, the empty rows.

		FILTEREDLEVELS = FILTER LEVELS by LOGLEVEL is not null;
		DUMP FILTEREDLEVELS;

	The output is similar to the following:

		(DEBUG)
		(TRACE)
		(TRACE)
		(DEBUG)
		(TRACE)
		(TRACE)
		(DEBUG)
		(TRACE)
		(TRACE)
		(DEBUG)
		(TRACE)
		...

4. Group all of the log levels into their own row:

		GROUPEDLEVELS = GROUP FILTEREDLEVELS by LOGLEVEL;
		DUMP GROUPEDLEVELS;

	The output is similar to the following:

		(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),
		(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),
		(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),
		(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),
		(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),
		(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),
		(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),
		(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),
		(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),
		(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),(TRACE),
		(TRACE), ...


5. For each group, count the occurrences of log levels. These is the frequencies of each log level:

		FREQUENCIES = foreach GROUPEDLEVELS generate group as LOGLEVEL, COUNT(FILTEREDLEVELS.LOGLEVEL) as COUNT;
		DUMP FREQUENCIES;
 
	The output is similar to the following:

		(INFO,3355)
		(WARN,361)
		(DEBUG,15608)
		(ERROR,181)
		(FATAL,37)
		(TRACE,29950)

6. Sort the frequencies in descending order:

		RESULT = order FREQUENCIES by COUNT desc;
		DUMP RESULT;   

	The output is similar to the following: 

		(TRACE,29950)
		(DEBUG,15608)
		(INFO,3355)
		(WARN,361)
	 	(ERROR,181)
		(FATAL,37)


##<a id="powershell"></a>Run Pig Latin using PowerShell

This section provides instructions for using PowerShell cmdlets. Before you go through this section, you must first setup the local environment, and configure the connection to Windows Azure. For details, see [Get started with Windows Azure HDInsight][hdinsight-getting-started] and [Administer HDInsight using PowerShell][hdinsight-admin-powershell].


**To run Pig Latin using PowerShell**

1. Open a Windows Azure PowerShell console windows. For instructions, see [Install and configure PowerShell for HDInsight][hdinsight-configure-powershell].
2. Set the variable in the following script, and run it:

		# Provide the HDInsight cluster name
		$subscriptionName = "<SubscriptionName>"
		$clusterName = "<HDInsightClusterName>" 

3. Run the following script to define the Pig Latin query string:

		# Create the Pig job definition
		$0 = '$0';
		$QueryString =  "LOGS = LOAD 'wasb:///example/data/sample.log';" +
		                "LEVELS = foreach LOGS generate REGEX_EXTRACT($0, '(TRACE|DEBUG|INFO|WARN|ERROR|FATAL)', 1)  as LOGLEVEL;" +
		                "FILTEREDLEVELS = FILTER LEVELS by LOGLEVEL is not null;" +
		                "GROUPEDLEVELS = GROUP FILTEREDLEVELS by LOGLEVEL;" +
		                "FREQUENCIES = foreach GROUPEDLEVELS generate group as LOGLEVEL, COUNT(FILTEREDLEVELS.LOGLEVEL) as COUNT;" +
		                "RESULT = order FREQUENCIES by COUNT desc;" +
		                "DUMP RESULT;" 
		
		$pigJobDefinition = New-AzureHDInsightPigJobDefinition -Query $QueryString 

		You can also use the -File switch to specify a Pig script file on HDFS.

4. Run the following script to submit the Pig job:
		
		# Submit the Pig job
		Select-AzureSubscription $subscriptionName
		$pigJob = Start-AzureHDInsightJob -Cluster $clusterName -JobDefinition $pigJobDefinition 

5. Run the following script to wait for the Pig job to complete:		

		# Wait for the Pig job to complete
		Wait-AzureHDInsightJob -Job $pigJob -WaitTimeoutInSeconds 3600

6. Run the following script to print the Pig job output:
		
		# Print the standard error and the standard output of the Pig job.
		Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $pigJob.JobId -StandardOutput

	![HDI.Pig.PowerShell][image-hdi-pig-powershell]

	The Pig job calculates the frequencies of different log types.




















 

##<a id="nextsteps"></a>Next steps

While Pig allows you to perform data analysis, other languages included with HDInsight may be of interest to you also. Hive provides a SQL-like query language that allows you to easily query against data stored in HDInsight, while MapReduce jobs written in Java allow you to perform complex data analysis. For more information, see the following:


* [Get started with Windows Azure HDInsight][hdinsight-getting-started]
* [Upload data to HDInsight][hdinsight-upload-data]
* [Use Hive with HDInsight][hdinsight-using-hive]



[piglatin-manual-1]: http://pig.apache.org/docs/r0.7.0/piglatin_ref1.html
[piglatin-manual-2]: http://pig.apache.org/docs/r0.7.0/piglatin_ref2.html
[apachepig-home]: http://pig.apache.org/


[hdinsight-storage]: /en-us/manage/services/hdinsight/howto-blob-store/
[hdinsight-upload-data]: /en-us/manage/services/hdinsight/howto-upload-data-to-hdinsight/
[hdinsight-getting-started]: /en-us/manage/services/hdinsight/get-started-hdinsight/
[hdinsight-admin-powershell]: /en-use/manage/services/hdinsight/administer-hdinsight-using-powershell/

[hdinsight-using-hive]: /en-us/manage/services/hdinsight/using-hive-with-hdinsight/

[hdinsight-provision]: /en-us/manage/services/hdinsight/provision-hdinsight-clusters/
[hdinsight-configure-powershell]: /en-us/manage/services/hdinsight/install-and-configure-powershell-for-hdinsight/ 

[image-hdi-log4j-sample]: ./media/hdinsight-use-pig/HDI.wholesamplefile.png
[image-hdi-pig-data-transformation]: ./media/hdinsight-use-pig/HDI.DataTransformation.gif
[image-hdi-pig-powershell]: ./media/hdinsight-use-pig/hdi.pig.powershell.png  
