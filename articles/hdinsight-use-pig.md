<properties urlDisplayName="Use Hadoop Pig in HDInsight" pageTitle="Use Hadoop Pig in HDInsight | Azure" metaKeywords="" description="Learn how to use Pig with HDInsight. Write Pig Latin statements to analyze an application log file, and run queries on the data to generate output for analysis." metaCanonical="" services="hdinsight" documentationCenter="" title="" authors="mumian" solutions="big data" manager="paulettm" editor="cgronlun"/>

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="09/25/2014" ms.author="jgao" />



# Use Pig with Hadoop in HDInsight

In this tutorial you learn how to run [Apache Pig][apachepig-home] jobs on HDInsight to analyze large data files. Pig provides a scripting language to execute *MapReduce* jobs as an alternative to writing Java code. Pig's scripting language is called *Pig Latin*.

**Prerequisites**

* You must have provisioned an Azure HDInsight cluster. For instructions, see [Get started with Azure HDInsight][hdinsight-get-started] or [Provision HDInsight clusters][hdinsight-provision]. You will need the name of the cluster to complete the tutorial.

* You must have install and configured Azure PowerShell on your workstation. For instructions, see [Install and configure Azure PowerShell][powershell-install-configure]. 

**Estimated time to complete:** 30 minutes

##In this article

* [Why use Pig?](#usage)
* [What do I do in this tutorial?](#what)
* [Identify data to analyze](#data)
* [Understand Pig Latin](#understand)
* [Submit Pig jobs using PowerShell](#powershell)
* [Submit Pig jobs using HDInsight .NET SDK](#sdk)
* [Next steps](#nextsteps)
 
##<a id="usage"></a>Why use Pig?
Working with big data is difficult using relational databases and statistics/visualization packages. Due to the large amounts of data and the computation of this data, parallel software running on tens, hundreds, or even thousands of servers is often required to compute this data in a reasonable time. Hadoop provides a *MapReduce* framework for writing applications that processes large amounts of structured and unstructured data in parallel across large clusters of machines in a very reliable and fault-tolerant manner.

![HDI.Pig.Architecture][image-hdi-pig-architecture]

[Apache *Pig*][apachepig-home] provides a layer of abstraction over the Java-based MapReduce framework, enabling users to analyze data without knowledge of Java or MapReduce. Pig is a platform for analyzing large data sets using easy-to-use language called *Pig Latin*, which is a data-flow language. Pig reduces the time needed to write mapper and reducer programs. It does not require any knowledge of Java. You also have the flexibility to combine Java code with Pig. Many complex algorithms can be written in less than five lines of human-readable Pig code. 

Pig Latin statements follow this general flow:   

- **Load**: Read data to be manipulated from the file system
- **Transform**: Manipulate the data 
- **Dump or store**: Output data to the screen or store for processing

For more information on Pig Latin, see [Pig Latin Reference Manual 1][piglatin-manual-1] and [Pig Latin Reference Manual 2][piglatin-manual-2].

##<a id="what"></a>What do I do in this tutorial?
In this tutorial, you analyze an Apache log file (*sample.log*) to determine the number of different log levels, such an INFO, DEBUG, TRACE, etc. The visual representation of what you will accomplish in this article is shown in the following two figures. The first figure shows a snippet of the sample.log file.

![Whole File Sample][image-hdi-log4j-sample]

The second figure illustrates the flow and transformation of the data as you run through the lines of Pig code in the script:

![HDI.PIG.Data.Transformation][image-hdi-pig-data-transformation]

The Pig job you create in this tutorial follows the same flow.

##<a id="data"></a>Identify data to analyze

HDInsight uses Azure Blob storage container as the default file system for Hadoop clusters. Some sample data files are added to the blob storage as part of cluster provisioning. You can use these sample data files for running Hive queries on the cluster. If you want, you can also upload your own data file to the blob storage account associated with the cluster. See [Upload data to HDInsight][hdinsight-upload-data] for instructions. For more information on how Azure Blob storage is used with HDInsight, see [Use Azure Blob storage with HDInsight][hdinsight-storage].

The syntax to access the files in the blob storage is:

	wasb[s]://<ContainerName>@<StorageAccountName>.blob.core.windows.net/<path>/<filename>

> [AZURE.NOTE] Only the *wasb://* syntax is supported in HDInsight cluster version 3.0. The older *asv://* syntax is supported in HDInsight 2.1 and 1.6 clusters, but it is not supported in HDInsight 3.0 clusters and it will not be supported in later versions.

A file stored in the default file system container can be accessed from HDInsight using any of the following URIs as well (using sample.log as an example.  This file is the data file used in this tutorial):

	wasb://mycontainer@mystorageaccount.blob.core.windows.net/example/data/sample.log
	wasb:///example/data/sample.log
	/example/data/sample.log

If you want to access the file directly from the storage account, the blob name for the file is:

	example/data/sample.log

This article uses a *log4j* sample file that comes with HDInsight clusters and is stored at *\example\data\sample.log*. For information on uploading your own data files, see [Upload data to HDInsight][hdinsight-upload-data].




##<a id="understand"></a> Understand Pig Latin

In this section, you will review some Pig Latin statements individually, and their results after running the statements. In the next section, you will run PowerShell to execute the Pig statements together for analyzing the sample log file. The individual Pig Latin statements must be run directly on the HDInsight cluster.

1. Enable Remote Desktop for the HDInsight cluster by following the instructions at [Connect to HDInsight clusters using RDP](http://azure.microsoft.com/en-us/documentation/articles/hdinsight-administer-use-management-portal/#rdp). Log in to the cluster node and from the desktop, click **Hadoop Command Line**.

2. From the command line, navigate to the directory where **Pig** is installed. Type:

		C:\apps\dist\hadoop-<version>> cd %pig_home%\bin

3. At the command prompt, type *pig* and press ENTER to get to the *grunt* shell.

		C:\apps\dist\pig-<version>\bin>pig
		...
		grunt>  

4. Enter the following to load data from the sample file in the file system, and then display the results: 

		grunt> LOGS = LOAD 'wasb:///example/data/sample.log';
		grunt> DUMP LOGS;
	
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

5. Go through each line in the data file to find a match on the 6 log levels:

		grunt> LEVELS = foreach LOGS generate REGEX_EXTRACT($0, '(TRACE|DEBUG|INFO|WARN|ERROR|FATAL)', 1)  as LOGLEVEL;
 
6. Filter out the rows that do not have a match and display the result. This gets rid of the empty rows.

		grunt> FILTEREDLEVELS = FILTER LEVELS by LOGLEVEL is not null;
		grunt> DUMP FILTEREDLEVELS;

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

7. Group all of the log levels into their own row and display the result:

		grunt> GROUPEDLEVELS = GROUP FILTEREDLEVELS by LOGLEVEL;
		grunt> DUMP GROUPEDLEVELS;

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


8. For each group, count the occurrences of log levels and display the result:

		grunt> FREQUENCIES = foreach GROUPEDLEVELS generate group as LOGLEVEL, COUNT(FILTEREDLEVELS.LOGLEVEL) as COUNT;
		grunt> DUMP FREQUENCIES;
 
	The output is similar to the following:

		(INFO,96)
		(WARN,11)
		(DEBUG,434)
		(ERROR,6)
		(FATAL,2)
		(TRACE,816)

9. Sort the frequencies in descending order and display the result:

		grunt> RESULT = order FREQUENCIES by COUNT desc;
		grunt> DUMP RESULT;   

	The output is similar to the following: 

		(TRACE,816)
		(DEBUG,434)
		(INFO,96)
		(WARN,11)
	 	(ERROR,6)
		(FATAL,2)

##<a id="powershell"></a>Submit Pig jobs using PowerShell

This section provides instructions for using PowerShell cmdlets. Before you go through this section, you must first setup the local environment, and configure the connection to Azure. For details, see [Get started with Azure HDInsight][hdinsight-get-started] and [Administer HDInsight using PowerShell][hdinsight-admin-powershell].


**To run Pig Latin using PowerShell**

1. Open Windows PowerShell ISE. On Windows 8 Start screen, type **PowerShell_ISE** and then click **Windows PowerShell ISE**. See [Start Windows PowerShell on Windows 8 and Windows][powershell-start] for more information.

2. In the bottom pane, run the following command to connect to your Azure subscription:

		Add-AzureAccount

	You will be prompted to enter your Azure account credentials. This method of adding a subscription connection times out, and after 12 hours, you will have to run the cmdlet again. 

	> [AZURE.NOTE] If you have multiple Azure subscriptions and the default subscription is not the one you want to use, use the <strong>Select-AzureSubscription</strong> cmdlet to select the current subscription.
2. In the script pane, copy and paste the following lines:

		$clusterName = "<HDInsightClusterName>" 	#Specify the cluster name
		$statusFolder = "/tutorials/usepig/status"	#Specify the folder to dump results

	If the status folder you specify does not already exist, the script will create it. 

3. Append the following lines in the script pane. These lines define the Pig Latin query string, and create a Pig job definition:

		# Create the Pig job definition
		$0 = '$0';
		$QueryString =  "LOGS = LOAD 'wasb:///example/data/sample.log';" +
		                "LEVELS = foreach LOGS generate REGEX_EXTRACT($0, '(TRACE|DEBUG|INFO|WARN|ERROR|FATAL)', 1)  as LOGLEVEL;" +
		                "FILTEREDLEVELS = FILTER LEVELS by LOGLEVEL is not null;" +
		                "GROUPEDLEVELS = GROUP FILTEREDLEVELS by LOGLEVEL;" +
		                "FREQUENCIES = foreach GROUPEDLEVELS generate group as LOGLEVEL, COUNT(FILTEREDLEVELS.LOGLEVEL) as COUNT;" +
		                "RESULT = order FREQUENCIES by COUNT desc;" +
		                "DUMP RESULT;" 
		
		$pigJobDefinition = New-AzureHDInsightPigJobDefinition -Query $QueryString -StatusFolder $statusFolder 

	You can also use the **-File** switch to specify a Pig script file on HDFS. The **-StatusFolder** switch puts the standard error log and the standard output file into the folder.

4. Append the following lines for submitting the Pig job:
		
		# Submit the Pig job
		Write-Host "Submit the Pig job ..." -ForegroundColor Green
		$pigJob = Start-AzureHDInsightJob -Cluster $clusterName -JobDefinition $pigJobDefinition  

5. Append the following lines for waiting for the Pig job to complete:		

		# Wait for the Pig job to complete
		Write-Host "Wait for the Pig job to complete ..." -ForegroundColor Green
		Wait-AzureHDInsightJob -Job $pigJob -WaitTimeoutInSeconds 3600

6. Append the following liens to print the Pig job output:
		
		# Print the standard error and the standard output of the Pig job.
		Write-Host "Display the standard output ..." -ForegroundColor Green
		Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $pigJob.JobId -StandardOutput

	> [AZURE.NOTE] One of the Get-AzureHDInsightJobOut cmdlets is commented for shortening the output in the following screenshot.   

7. Press **F5** to run the script:

	![HDI.Pig.PowerShell][image-hdi-pig-powershell]

	The Pig job calculates the frequencies of different log types.


##<a id="sdk"></a>Submit Pig jobs using HDInsight .NET SDK

Follow the steps here to submit a Pig job using a C# application.   For instructions for creating a C# application for submitting Hadoop jobs, see [Submit Hadoop job programmatically][hdinsight-submit-jobs].

1. Create a self-signed certificate, install it on your workstation, and upload it to your Azure subscription. For instructions, see [Create a self-signed certificate](http://go.microsoft.com/fwlink/?LinkId=511138).

2. Create a Visual Studio console application and install the HDInsight package. From the Tools menu, click **Nuget Package Manager**, and then click **Package Manager Console**. At the prompt, enter the following:

		Install-Package Microsoft.WindowsAzure.Management.HDInsight

3. Double.click Program.cs, and paste the following code to submit a Pig job. Provide values to the variables.

		using System;
		using System.Collections.Generic;
		using System.Linq;
		using System.Text;
		using System.Threading.Tasks;
		
		using System.IO;
		using System.Threading;
		using System.Security.Cryptography.X509Certificates;
		
		using Microsoft.WindowsAzure.Management.HDInsight;
		using Microsoft.Hadoop.Client;
		
		namespace SubmitPigJobs
		{
		    class Program
		    {
		        static void Main(string[] args)
		        {
					// Set the variables
					string subscriptionID = "<Azure subscription ID>";
					string certFriendlyName = "<certificate friendly name>";
			
					string clusterName = "<HDInsight cluster name>";
		            string statusFolderName = @"/tutorials/usepig/status";
		
		            string queryString = "LOGS = LOAD 'wasb:///example/data/sample.log';" +
		                "LEVELS = foreach LOGS generate REGEX_EXTRACT($0, '(TRACE|DEBUG|INFO|WARN|ERROR|FATAL)', 1)  as LOGLEVEL;" +
		                "FILTEREDLEVELS = FILTER LEVELS by LOGLEVEL is not null;" +
		                "GROUPEDLEVELS = GROUP FILTEREDLEVELS by LOGLEVEL;" +
		                "FREQUENCIES = foreach GROUPEDLEVELS generate group as LOGLEVEL, COUNT(FILTEREDLEVELS.LOGLEVEL) as COUNT;" +
		                "RESULT = order FREQUENCIES by COUNT desc;" +
		                "DUMP RESULT;";
		
		            // Define the Pig job
		            PigJobCreateParameters myJobDefinition = new PigJobCreateParameters()
		            {
		                Query = queryString,
		                StatusFolder = statusFolderName
		            };
		
		            // Get the certificate object from certificate store using the friendly name to identify it
		            X509Store store = new X509Store();
		            store.Open(OpenFlags.ReadOnly);
		            X509Certificate2 cert = store.Certificates.Cast<X509Certificate2>().First(item => item.FriendlyName == certFriendlyName);
		
		            JobSubmissionCertificateCredential creds = new JobSubmissionCertificateCredential(new Guid(subscriptionID), cert, clusterName);
		
		            // Create a hadoop client to connect to HDInsight
		            var jobClient = JobSubmissionClientFactory.Connect(creds);
		
		            // Run the MapReduce job
		            Console.WriteLine("----- Submit the Pig job ...");
		            JobCreationResults mrJobResults = jobClient.CreatePigJob(myJobDefinition);
		
		            // Wait for the job to complete
		            Console.WriteLine("----- Wait for the Pig job to complete ...");
		            WaitForJobCompletion(mrJobResults, jobClient);
		
		            // Display the error log
		            Console.WriteLine("----- The Pig job error log.");
		            using (Stream stream = jobClient.GetJobErrorLogs(mrJobResults.JobId))
		            {
		                var reader = new StreamReader(stream);
		                Console.WriteLine(reader.ReadToEnd());
		            }
		
		            // Display the output log
		            Console.WriteLine("----- The Pig job output log.");
		            using (Stream stream = jobClient.GetJobOutput(mrJobResults.JobId))
		            {
		                var reader = new StreamReader(stream);
		                Console.WriteLine(reader.ReadToEnd());
		            }
		
		            Console.WriteLine("----- Press ENTER to continue.");
		            Console.ReadLine();
		        }
		
		        private static void WaitForJobCompletion(JobCreationResults jobResults, IJobSubmissionClient client)
		        {
		            JobDetails jobInProgress = client.GetJob(jobResults.JobId);
		            while (jobInProgress.StatusCode != JobStatusCode.Completed && jobInProgress.StatusCode != JobStatusCode.Failed)
		            {
		                jobInProgress = client.GetJob(jobInProgress.JobId);
		                Thread.Sleep(TimeSpan.FromSeconds(10));
		            }
		        }
		    }
		}

##<a id="nextsteps"></a>Next steps

While Pig allows you to perform data analysis, other languages included with HDInsight may be of interest to you also. Hive provides a SQL-like query language that allows you to easily query against data stored in HDInsight, while MapReduce jobs written in Java allow you to perform complex data analysis. For more information, see the following:


* [Get started with Azure HDInsight][hdinsight-get-started]
* [Upload data to HDInsight][hdinsight-upload-data]
* [Submit Hadoop jobs programmatically][hdinsight-submit-jobs]
* [Use Hive with HDInsight][hdinsight-use-hive]



[piglatin-manual-1]: http://pig.apache.org/docs/r0.7.0/piglatin_ref1.html
[piglatin-manual-2]: http://pig.apache.org/docs/r0.7.0/piglatin_ref2.html
[apachepig-home]: http://pig.apache.org/


[hdinsight-storage]: ../hdinsight-use-blob-storage/
[hdinsight-upload-data]: ../hdinsight-upload-data/
[hdinsight-get-started]: ../hdinsight-get-started/
[hdinsight-admin-powershell]: ../hdinsight-administer-use-powershell/

[hdinsight-use-hive]: ../hdinsight-use-hive/

[hdinsight-provision]: ../hdinsight-provision-clusters/
[hdinsight-submit-jobs]: ../hdinsight-submit-hadoop-jobs-programmatically/#mapreduce-sdk

[Powershell-install-configure]: ../install-configure-powershell/

[powershell-start]: http://technet.microsoft.com/en-us/library/hh847889.aspx

[image-hdi-log4j-sample]: ./media/hdinsight-use-pig/HDI.wholesamplefile.png
[image-hdi-pig-data-transformation]: ./media/hdinsight-use-pig/HDI.DataTransformation.gif
[image-hdi-pig-powershell]: ./media/hdinsight-use-pig/hdi.pig.powershell.png
[image-hdi-pig-architecture]: ./media/hdinsight-use-pig/HDI.Pig.Architecture.png