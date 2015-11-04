<properties
	pageTitle="Submit Hadoop jobs in HDInsight | Microsoft Azure"
	description="Learn how to submit Hadoop jobs to Azure HDInsight Hadoop."
	editor="cgronlun"
	manager="paulettm"
	services="hdinsight"
	documentationCenter=""
	tags="azure-portal"
	authors="mumian"/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/02/2015"
	ms.author="jgao"/>

# Submit Hadoop jobs in HDInsight

Learn how to use Azure PowerShell to submit MapReduce and Hive jobs, and how to use the HDInsight .NET SDK to submit MapReduce, Hadoop streaming, and Hive jobs.

> [AZURE.NOTE] The steps in this article must be performed from a Windows client. For information on using a Linux, OS X, or Unix client to work with MapReduce, Hive, or Pig on HDInsight, see the following articles and select either the **SSH** or **Curl** links within each:
>
> - [Use Hive with HDInsight](hdinsight-use-hive.md)
> - [Use Pig with HDInsight](hdinsight-use-pig.md)
> - [Use MapReduce with HDInsight](hdinsight-use-mapreduce.md)

##Prerequisites

Before you begin this article, you must have the following:

* **An Azure HDInsight cluster**. For instructions, see [Get started with HDInsight][hdinsight-get-started] or [Create Hadoop clusters in HDInsight][hdinsight-provision].
- **A workstation with Azure PowerShell**. See [Install and use Azure PowerShell](http://azure.microsoft.com/documentation/videos/install-and-use-azure-powershell/).



##Submit MapReduce jobs by using Azure PowerShell
Azure PowerShell is a powerful scripting environment that you can use to control and automate the deployment and management of your workloads in Azure. For more information about using Azure PowerShell with HDInsight, see [Manage HDInsight by using PowerShell][hdinsight-admin-powershell].

Hadoop MapReduce is a software framework for writing applications that process vast amounts of data. HDInsight clusters come with a JAR file (located at *\example\jars\hadoop-mapreduce-examples.jar*), which contains several MapReduce examples.

One of the examples is for counting word frequencies in source files. In this session, you will learn how to use Azure PowerShell from a workstation to run the word count sample. For more information about developing and running MapReduce jobs, see [Use MapReduce with HDInsight][hdinsight-use-mapreduce].

**To run the word count MapReduce program by using Azure PowerShell**

1.	Open **Azure PowerShell**. For instructions about how to open the Azure PowerShell console window, see [Install and configure Azure PowerShell][powershell-install-configure].

3. Set the following variables by running these Azure PowerShell commands:

		$subscriptionName = "<SubscriptionName>"
		$clusterName = "<HDInsightClusterName>"

	The subscription name is the one you used to create the HDInsight cluster. The HDInsight cluster is the one you want to use to run the MapReduce job.

5. Run the following commands to create a MapReduce job definition:

		# Define the word count MapReduce job
		$wordCountJobDefinition = New-AzureHDInsightMapReduceJobDefinition -JarFile "wasb:///example/jars/hadoop-mapreduce-examples.jar" -ClassName "wordcount" -Arguments "wasb:///example/data/gutenberg/davinci.txt", "wasb:///example/data/WordCountOutput"

	There are two arguments. The first one is the source file name, and the second is the output file path. For more information about the wasb:// prefix, see [Use Azure Blob storage with HDInsight][hdinsight-storage].

6. Run the following command to run the MapReduce job:

		# Submit the MapReduce job
		Select-AzureSubscription $subscriptionName
		$wordCountJob = Start-AzureHDInsightJob -Cluster $clusterName -JobDefinition $wordCountJobDefinition

	In addition to the MapReduce job definition, you also provide the HDInsight cluster name for where you want to run the MapReduce job.

7. Run the following command to check the completion of the MapReduce job:

		# Wait for the job to complete
		Wait-AzureHDInsightJob -Job $wordCountJob -WaitTimeoutInSeconds 3600


8. Run the following command to check any errors with running the MapReduce job:

		# Get the job standard error output
		Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $wordCountJob.JobId -StandardError

	The following screenshot shows the output of a successful run. Otherwise, you will see some error messages.

	![HDI.GettingStarted.RunMRJob][image-hdi-gettingstarted-runmrjob]


**To retrieve the results of the MapReduce job**

1. Open **Azure PowerShell**.
2. Set the following variables by running these Azure PowerShell commands:

		$subscriptionName = "<SubscriptionName>"
		$storageAccountName = "<StorageAccountName>"
		$containerName = "<ContainerName>"

	The Storage account name is the Azure storage account that you specified during the HDInsight cluster creation. The storage account is used to host the blob container that is used as the default HDInsight cluster file system. The container name usually share the same name as the HDInsight cluster unless you specify a different name when you create the cluster.

3. Run the following commands to create an Azure Blob storage context object:

		# Create the storage account context object
		Select-AzureSubscription $subscriptionName
		$storageAccountKey = Get-AzureStorageKey $storageAccountName | %{ $_.Primary }
		$storageContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey  

	**Select-AzureSubscription** is used to set the current subscription if you have multiple subscriptions, and the default subscription is not the one to use.

4. Run the following command to download the MapReduce job output from the blob container to the workstation:

		# Get the blob content
		Get-AzureStorageBlobContent -Container $ContainerName -Blob example/data/WordCountOutput/part-r-00000 -Context $storageContext -Force

	The *example/data/WordCountOutput* folder is the output folder specified when you run the MapReduce job. *part-r-00000* is the default file name for MapReduce job output. The file will be download to the same folder structure in the local folder. For example, in the following screenshot, the current folder is the C: root folder. The file will be downloaded to:

*C:\example\data\WordCountOutput\*

5. Run the following command to print the MapReduce job output file:

		cat ./example/data/WordCountOutput/part-r-00000 | findstr "there"

	![HDI.GettingStarted.MRJobOutput][image-hdi-gettingstarted-mrjoboutput]

	The MapReduce job produces a file named *part-r-00000*, and it contains the words and the counts. The script uses the **findstr** command to list all of the words that contains "there."


> [AZURE.NOTE] If you open ./example/data/WordCountOutput/part-r-00000 (a multiline output from a MapReduce job) in Notepad, you will notice the line breaks do not render correctly. This is expected.









































































































































##Submit Hive jobs by using Azure PowerShell
[Apache Hive][apache-hive] provides a means of running MapReduce job through an SQL-like scripting language, called *HiveQL*, which can be applied to summarize, query, and analyze large volumes of data.

HDInsight clusters come with a sample Hive table called *hivesampletable*. In this session, you will use Azure PowerShell to run a Hive job to list some data from the Hive table.

**To run a Hive job by using Azure PowerShell**

1.	Open **Azure PowerShell**. For instructions about how to open the Azure PowerShell console window, see [Install and configure Azure PowerShell][powershell-install-configure].

2. Set the first two variables in the following commands, and then run the commands:

		$subscriptionName = "<SubscriptionName>"
		$clusterName = "<HDInsightClusterName>"
		$querystring = "SELECT * FROM hivesampletable WHERE Country='United Kingdom';"

	The $querystring is the HiveQL query.

3. Run the following command to select the Azure subscription and the cluster to run the Hive job:

		Select-AzureSubscription -SubscriptionName $subscriptionName

4. Run the following commands to submit the hive job:

		Use-AzureHDInsightCluster $clusterName
		Invoke-Hive -Query $queryString

	You can use the **-File** switch to specify a HiveQL script file in the Hadoop distributed file system (HDFS).

For more information about Hive, see [Use Hive with HDInsight][hdinsight-use-hive].


## Submit Hive jobs by using Visual Studio

See [Get started using HDInsight Hadoop Tools for Visual Studio][hdinsight-visual-studio-tools].

##Submit Sqoop jobs by using Azure PowerShell

See [Use Sqoop with HDInsight][hdinsight-use-sqoop].

##Submit MapReduce jobs using HDInsight .NET SDK
The HDInsight .NET SDK provides .NET client libraries, which makes it easier to work with HDInsight clusters from .NET. HDInsight clusters come with a JAR file (located at *\example\jars\hadoop-mapreduce-examples.jar*), which contains several MapReduce examples. One of the examples is for counting word frequencies in source files. In this session, you will learn how to create a .NET application to run the word count sample. For more information about developing and running MapReduce jobs, see [Use MapReduce with HDInsight][hdinsight-use-mapreduce].

**To Submit the wordcount MapReduce job**

1. Create a C# console application in Visual Studio.
2. From the Nuget Package Manager Console, run the following command.

		Install-Package Microsoft.Azure.Management.HDInsight.Job -Pre

2. Use the following using statements in the Program.cs file:

		using System;
		using System.Collections.Generic;
		using Microsoft.Azure.Management.HDInsight.Job;
		using Microsoft.Azure.Management.HDInsight.Job.Models;
		using Hyak.Common;

3. Add the following code into the Main() function.

		var ExistingClusterName = "<HDInsightClusterName>";
		var ExistingClusterUri = ExistingClusterName + ".azurehdinsight.net";
		var ExistingClusterUsername = "<HDInsightClusterHttpUsername>";
		var ExistingClusterPassword = "<HDInsightClusterHttpUserPassword>";
	    HDInsightJobManagementClient _hdiJobManagementClient;

	    List<string> arguments = new List<string> { { "wasb:///example/data/gutenberg/davinci.txt" }, { "wasb:///example/data/WordCountOutput" } };
	
	    var clusterCredentials = new BasicAuthenticationCloudCredentials { Username = ExistingClusterUsername, Password = ExistingClusterPassword };
	    _hdiJobManagementClient = new HDInsightJobManagementClient(ExistingClusterUri, clusterCredentials);
	
	    var parameters = new MapReduceJobSubmissionParameters
	    {
	        UserName = ExistingClusterUsername,
	        JarFile = "wasb:///example/jars/hadoop-mapreduce-examples.jar",
	        JarClass = "wordcount",
	        Arguments = ConvertArgsToString(arguments)
	    };
	
	    System.Console.WriteLine("Submitting the MapReduce job to the cluster...");
	    var response = _hdiJobManagementClient.JobManagement.SubmitMapReduceJob(parameters);
	    System.Console.WriteLine("Validating that the response is as expected...");
	    System.Console.WriteLine("Response status code is " + response.StatusCode);
	    System.Console.WriteLine("Validating the response object...");
	    System.Console.WriteLine("JobId is " + response.JobSubmissionJsonResponse.Id);
	    Console.WriteLine("Press ENTER to continue ...");
	    Console.ReadLine();

4. Add the following helper function in the the class.

        private static string ConvertArgsToString(List<string> args)
        {
            if (args.Count == 0)
            {
                return null;
            }

            return string.Join("&arg=", args.ToArray());
        }

5. Press **F5** to run the application.










##Submit Hadoop streaming jobs using HDInsight .NET SDK
HDInsight clusters come with a word-counting Hadoop stream program, which is developed in C#. The mapper program is */example/apps/cat.exe*, and the reduce program is */example/apps/wc.exe*. In this session, you will learn how to create a .NET application to run the word-counting sample.

For the details about creating a .NET application for submitting MapReduce jobs, see [Submit MapReduce jobs using HDInsight .NET SDK](#mapreduce-sdk).

For more information about developing and deploying Hadoop streaming jobs, see [Develop C# Hadoop streaming programs for HDInsight][hdinsight-develop-streaming-jobs].

The following procedure only works on HDInsight clusters on Windows. C# streaming is not supported on Linux clusters yet. However you can use .NET program to submit stream job written in other programming languages that are supported by Linux clusters. For example Python.  For an Python streaming example, see [Develop Python streaming programs for HDInsight](hdinsight-hadoop-streaming-python.md).

**To Submit the wordcount MapReduce job**

1. From the Visual Studio Package Manager Console, run the following Nuget command to import the package.

		Install-Package Microsoft.Azure.Management.HDInsight.Job -Pre

2. Use the following using statements in the Program.cs file:

		using System;
		using System.Collections.Generic;
		using Microsoft.Azure.Management.HDInsight.Job;
		using Microsoft.Azure.Management.HDInsight.Job.Models;
		using Hyak.Common;

3. Add the following code into the Main() function.

		var ExistingClusterName = "<HDInsightClusterName>";
		var ExistingClusterUri = ExistingClusterName + ".azurehdinsight.net";
		var ExistingClusterUsername = "<HDInsightClusterHttpUsername>";
		var ExistingClusterPassword = "<HDInsightClusterHttpUserPassword>";

        List<string> arguments = new List<string> { { "/example/apps/cat.exe" }, { "/example/apps/wc.exe" } };

        HDInsightJobManagementClient _hdiJobManagementClient;
        var clusterCredentials = new BasicAuthenticationCloudCredentials { Username = ExistingClusterUsername, Password = ExistingClusterPassword };
        _hdiJobManagementClient = new HDInsightJobManagementClient(ExistingClusterUri, clusterCredentials);

        var parameters = new MapReduceStreamingJobSubmissionParameters
        {
            UserName = ExistingClusterUsername,
            File = ConvertArgsToString(arguments),
            Mapper = "cat.exe",
            Reducer = "wc.exe",
            Input = "/example/data/gutenberg/davinci.txt",
            Output = "/tutorials/wordcountstreaming/output"
        };

        System.Console.WriteLine("Submitting the MapReduce job to the cluster...");
        var response = _hdiJobManagementClient.JobManagement.SubmitMapReduceStreamingJob(parameters);
        System.Console.WriteLine("Validating that the response is as expected...");
        System.Console.WriteLine("Response status code is " + response.StatusCode);
        System.Console.WriteLine("Validating the response object...");
        System.Console.WriteLine("JobId is " + response.JobSubmissionJsonResponse.Id);
        Console.WriteLine("Press ENTER to continue ...");
        Console.ReadLine();

4. Add a help function to the class.

        private static string ConvertArgsToString(List<string> args)
        {
            if (args.Count == 0)
            {
                return null;
            }

            return string.Join("&arg=", args.ToArray());
        }

5. Press **F5** to run the application.

##Submit Hive jobs by using HDInsight .NET SDK
HDInsight clusters come with a sample Hive table called *hivesampletable*. In this session, you will create a .NET application to run a Hive job to list the Hive tables that are created in an HDInsight cluster. For more information about using Hive, see [Use Hive with HDInsight][hdinsight-use-hive].

The following procedures are needed to create an HDInsight cluster by using the SDK:

- Install the HDInsight .NET SDK
- Create a console application
- Run the application


**To install the HDInsight .NET SDK**
You can install the latest published build of the SDK from [NuGet](http://nuget.codeplex.com/wikipage?title=Getting%20Started). The instructions will be shown in the next procedure.

**To create a Visual Studio console application**

1. Open Visual Studio 2013 or 2015.

2. Create a new project with the following settings:

	|Property|Value|
	|--------|-----|
	|Template|Templates/Visual C#/Windows/Console Application|
	|Name|SubmitHiveJob|

3. From the **Tools** menu, click **Nuget Package Manager**, and then click **Package Manager Console**.
4. Run the following command in the console to install the packages:

		Install-Package Microsoft.Azure.Common.Authentication -pre
		Install-Package Microsoft.Azure.Management.HDInsight -Pre
		Install-Package Microsoft.Azure.Management.HDInsight.Job -Pre

	These commands add .NET libraries and references to them to the current Visual Studio project.

5. From Solution Explorer, double-click **Program.cs** to open it, paste the following code, and provide values for the variables:

		using System.Collections.Generic;
		using System.Linq;
		using Microsoft.Azure.Management.HDInsight.Job;
		using Microsoft.Azure.Management.HDInsight.Job.Models;
		using Hyak.Common;
		
		namespace SubmitHiveJob
		{
		    class Program
		    {
		        private static HDInsightJobManagementClient _hdiJobManagementClient;
		
		        private const string ExistingClusterName = "<HDINSIGHT CLUSTER NAME>";
		        private const string ExistingClusterUri = ExistingClusterName + ".azurehdinsight.net";
		
		        private const string ExistingClusterUsername = "<HDINSIGHT HTTP USER NAME>";  //The default name is admin.
		        private const string ExistingClusterPassword = "<HDINSIGHT HTTP USER PASSWORD>";
		
		        private static void Main(string[] args)
		        {
		
		            var clusterCredentials = new BasicAuthenticationCloudCredentials { Username = ExistingClusterUsername, Password = ExistingClusterPassword };
		            _hdiJobManagementClient = new HDInsightJobManagementClient(ExistingClusterUri, clusterCredentials);
		
		            SubmitHiveJob();
		        }
		
		        private static void SubmitHiveJob()
		        {
		            Dictionary<string, string> defines = new Dictionary<string, string> { { "hive.execution.engine", "ravi" }, { "hive.exec.reducers.max", "1" } };
		            List<string> args = new List<string> { { "argA" }, { "argB" } };
		            var parameters = new HiveJobSubmissionParameters
		            {
		                UserName = ExistingClusterUsername,
		                Query = "SHOW TABLES",
		                Defines = ConvertDefinesToString(defines),
		                Arguments = ConvertArgsToString(args)
		            };
		
		            System.Console.WriteLine("Submitting the Hive job to the cluster...");
		            var response = _hdiJobManagementClient.JobManagement.SubmitHiveJob(parameters);
		            System.Console.WriteLine("Validating that the response is as expected...");
		            System.Console.WriteLine("Response status code is " + response.StatusCode);
		            System.Console.WriteLine("Validating the response object...");
		            System.Console.WriteLine("JobId is " + response.JobSubmissionJsonResponse.Id);
		            System.Console.WriteLine("Press ENTER to continue ...");
		            System.Console.ReadLine();
		        }
		
		        private static string ConvertDefinesToString(Dictionary<string, string> defines)
		        {
		            if (defines.Count == 0)
		            {
		                return null;
		            }
		
		            return string.Join("&define=", defines.Select(x => x.Key + "%3D" + x.Value).ToArray());
		        }
		        private static string ConvertArgsToString(List<string> args)
		        {
		            if (args.Count == 0)
		            {
		                return null;
		            }
		
		            return string.Join("&arg=", args.ToArray());
		        }
		    }
		}

6. Press **F5** to run the application. 

##Submit jobs using the HDInsight Tools for Visual Studio

Using the HDInsight Tools for Visual Studio, you can run Hive queries and Pig scripts. See [Get started using Visual Studio Hadoop tools for HDInsight](hdinsight-hadoop-visual-studio-tools-get-started.md).


##Next steps
In this article, you have learned several ways to create an HDInsight cluster. To learn more, see the following articles:

* [Get started with Azure HDInsight][hdinsight-get-started]
* [Create Hadoop clusters in HDInsight][hdinsight-provision]
* [Manage HDInsight by using PowerShell][hdinsight-admin-powershell]
* [HDInsight Cmdlet Reference Documentation][hdinsight-powershell-reference]
* [Use Hive with HDInsight][hdinsight-use-hive]
* [Use Pig with HDInsight][hdinsight-use-pig]


[azure-certificate]: http://msdn.microsoft.com/library/windowsazure/gg551722.aspx
[azure-management-portal]: https://portal.azure.com/

[hdinsight-visual-studio-tools]: ../HDInsight/hdinsight-hadoop-visual-studio-tools-get-started.md
[hdinsight-use-sqoop]: hdinsight-use-sqoop.md
[hdinsight-provision]: hdinsight-provision-clusters.md
[hdinsight-use-mapreduce]: hdinsight-use-mapreduce.md
[hdinsight-use-hive]: hdinsight-use-hive.md
[hdinsight-use-pig]: hdinsight-use-pig.md
[hdinsight-get-started]: ../hdinsight-get-started.md
[hdinsight-storage]: ../hdinsight-use-blob-storage.md
[hdinsight-admin-powershell]: hdinsight-administer-use-powershell.md
[hdinsight-develop-streaming-jobs]: hdinsight-hadoop-develop-deploy-streaming-jobs.md

[hdinsight-powershell-reference]: https://msdn.microsoft.com/library/dn858087.aspx

[powershell-install-configure]: ../install-configure-powershell.md

[image-hdi-gettingstarted-runmrjob]: ./media/hdinsight-submit-hadoop-jobs-programmatically/HDI.GettingStarted.RunMRJob.png
[image-hdi-gettingstarted-mrjoboutput]: ./media/hdinsight-submit-hadoop-jobs-programmatically/HDI.GettingStarted.MRJobOutput.png

[apache-hive]: http://hive.apache.org/
