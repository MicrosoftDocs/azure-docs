<properties 
	pageTitle="Submit Hadoop jobs in HDInsight | Azure" 
	description="Learn how to submit Hadoop jobs to Azure HDInsight Hadoop." 
	editor="cgronlun" 
	manager="paulettm" 
	services="hdinsight" 
	documentationCenter="" 
	authors="mumian"/>

<tags 
	ms.service="hdinsight" 
	ms.workload="big-data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/31/2015" 
	ms.author="jgao"/>

# Submit Hadoop jobs in HDInsight

Learn how to use Azure PowerShell to submit MapReduce and Hive jobs, and how to use the HDInsight .NET SDK to submit MapReduce, Hadoop streaming, and Hive jobs.

##Prerequisites

Before you begin this article, you must have the following:

* An Azure HDInsight cluster. For instructions, see [Get started with HDInsight][hdinsight-get-started] or [Provision HDInsight clusters][hdinsight-provision].
* Azure PowerShell. For instructions, see [Install and configure Azure PowerShell][powershell-install-configure].


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

	The Storage account name is the Azure storage account that you specified during the HDInsight cluster provision. The storage account is used to host the blob container that is used as the default HDInsight cluster file system. The container name usually share the same name as the HDInsight cluster unless you specify a different name when you provision the cluster.

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


The following procedures are needed to provision an HDInsight cluster by using the SDK:

- Install the HDInsight .NET SDK
- Create a console application
- Run the application


**To install the HDInsight .NET SDK**
You can install latest published build of the SDK from [NuGet](http://nuget.codeplex.com/wikipage?title=Getting%20Started). The instructions will be shown in the next procedure.

**To create a Visual Studio console application**

1. Open Visual Studio.

2. From the **File** menu, click **New**, and then click **Project**.

3. From **New Project**, type or select the following values:

	<table style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse;">
	<tr>
	<th style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; width:90px; padding-left:5px; padding-right:5px;">Property</th>
	<th style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; width:90px; padding-left:5px; padding-right:5px;">Value</th></tr>
	<tr>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">Category</td>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px; padding-right:5px;">Templates/Visual C#/Windows</td></tr>
	<tr>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">Template</td>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">Console Application</td></tr>
	<tr>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">Name</td>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">SubmitMapReduceJob</td></tr>
	</table>

4. Click **OK** to create the project.


5. From the **Tools** menu, click **Library Package Manager**, and then click **Package Manager Console**.

6. Run the following commands in the console to install the packages.

		Install-Package Microsoft.WindowsAzure.Management.HDInsight


	This command adds .NET libraries and references to them to the current Visual Studio project. The version should be 0.11.0.1 or later.

7. From **Solution Explorer**, double-click **Program.cs** to open it.

8. Add the following using statements to the top of the file:

		using System.IO;
		using System.Threading;
		using System.Security.Cryptography.X509Certificates;
		
		using Microsoft.WindowsAzure.Storage;
		using Microsoft.WindowsAzure.Storage.Blob;
		
		using Microsoft.WindowsAzure.Management.HDInsight;
		using Microsoft.Hadoop.Client;

9. Add the following function definition to the class. This function is used to wait for a Hadoop job to complete.

        private static void WaitForJobCompletion(JobCreationResults jobResults, IJobSubmissionClient client)
        {
            JobDetails jobInProgress = client.GetJob(jobResults.JobId);
            while (jobInProgress.StatusCode != JobStatusCode.Completed && jobInProgress.StatusCode != JobStatusCode.Failed)
            {
                jobInProgress = client.GetJob(jobInProgress.JobId);
                Thread.Sleep(TimeSpan.FromSeconds(10));
            }
        }
	
10. In the **Main()** function, paste the following code:
		
		// Set the variables
		string subscriptionID = "<Azure subscription ID>";
		string certFriendlyName = "<certificate friendly name>";

		string clusterName = "<HDInsight cluster name>";
		
		string storageAccountName = "<Azure storage account name>";
		string storageAccountKey = "<Azure storage account key>";
		string containerName = "<Blob container name>";
		
	
	These are all of the variables you need to set for the program. You can get the Azure subscription name from the [Azure Portal][azure-management-portal]. 

	For information about the certificate, see [Create and Upload a Management Certificate for Azure][azure-certificate]. An easy way to configure the certificate is to run the **Get-AzurePublishSettingsFile** and **Import-AzurePublishSettingsFile** Azure PowerShell cmdlets. They will create and upload the management certificate automatically. After you run these cmdlets, you can open **certmgr.msc** from the workstation, and find the certificate by expanding **Personal** > **Certificates**. The certificate that is created by the Azure PowerShell cmdlets has Azure Tools for the **Issued To** and the **Issued By** fields.

	The Azure storage account name is the account you specify when you provision the HDInsight cluster. The default container name is the same as the HDInsight cluster name.
	
11. In the **Main()** function, append the following code to define the MapReduce job:


        // Define the MapReduce job
        MapReduceJobCreateParameters mrJobDefinition = new MapReduceJobCreateParameters()
        {
            JarFile = "wasb:///example/jars/hadoop-mapreduce-examples.jar",
            ClassName = "wordcount"
        };

        mrJobDefinition.Arguments.Add("wasb:///example/data/gutenberg/davinci.txt");
        mrJobDefinition.Arguments.Add("wasb:///example/data/WordCountOutput");

	There are two arguments. The first one is the source file name, and the second is the output file path. For more information about the wasb:// prefix, see [Use Azure Blob storage with HDInsight][hdinsight-storage].
		
12. In the **Main()** function, append the following code to create a JobSubmissionCertificateCredential object:

        // Get the certificate object from certificate store using the friendly name to identify it
        X509Store store = new X509Store();
        store.Open(OpenFlags.ReadOnly);
        X509Certificate2 cert = store.Certificates.Cast<X509Certificate2>().First(item => item.FriendlyName == certFriendlyName);
        JobSubmissionCertificateCredential creds = new JobSubmissionCertificateCredential(new Guid(subscriptionID), cert, clusterName);
		
13. In the **Main()** function, append the following code to run the job and wait for the job to complete:

        // Create a hadoop client to connect to HDInsight
        var jobClient = JobSubmissionClientFactory.Connect(creds);

        // Run the MapReduce job
        JobCreationResults mrJobResults = jobClient.CreateMapReduceJob(mrJobDefinition);

        // Wait for the job to complete
        WaitForJobCompletion(mrJobResults, jobClient);

14. In the **Main()** function, append the following code to print the MapReduce job output:

		// Print the MapReduce job output
		Stream stream = new MemoryStream();
		
		CloudStorageAccount storageAccount = CloudStorageAccount.Parse("DefaultEndpointsProtocol=https;AccountName=" + storageAccountName + ";AccountKey=" + storageAccountKey);
		CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
		CloudBlobContainer blobContainer = blobClient.GetContainerReference(containerName);
		CloudBlockBlob blockBlob = blobContainer.GetBlockBlobReference("example/data/WordCountOutput/part-r-00000");
		
		blockBlob.DownloadToStream(stream);
		stream.Position = 0;
		
		StreamReader reader = new StreamReader(stream);
		Console.WriteLine(reader.ReadToEnd());
		
        Console.WriteLine("Press ENTER to continue.");
		Console.ReadLine();

	The output folder is specified when you define the MapReduce job. The default file name is **part-r-00000**.

**To run the application**

While the application is open in Visual Studio, press **F5** to run the application. A console window should open and display the status of the application and the application output. 

##Submit Hadoop streaming jobs using HDInsight .NET SDK
HDInsight clusters come with a word-counting Hadoop stream program, which is developed in C#. The mapper program is */example/apps/cat.exe*, and the reduce program is */example/apps/wc.exe*. In this session, you will learn how to create a .NET application to run the word-counting sample. 

For the details about creating a .NET application for submitting MapReduce jobs, see [Submit MapReduce jobs using HDInsight .NET SDK](#mapreduce-sdk).

For more information about developing and deploying Hadoop streaming jobs, see [Develop C# Hadoop streaming programs for HDInsight][hdinsight-develop-streaming-jobs].

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
	
	namespace SubmitStreamingJob
	{
	    class Program
	    {
	        static void Main(string[] args)
	        {

				// Set the variables
				string subscriptionID = "<Azure subscription ID>";
				string certFriendlyName = "<certificate friendly name>";
		
				string clusterName = "<HDInsight cluster name>";
				string statusFolderName = @"/tutorials/wordcountstreaming/status";

	            // Define the Hadoop streaming MapReduce job
	            StreamingMapReduceJobCreateParameters myJobDefinition = new StreamingMapReduceJobCreateParameters()
	            {
	                JobName = "my word counting job",
	                StatusFolder = statusFolderName,
	                Input = "/example/data/gutenberg/davinci.txt",
	                Output = "/tutorials/wordcountstreaming/output",
	                Reducer = "wc.exe",
	                Mapper = "cat.exe"
	            };
	
	            myJobDefinition.Files.Add("/example/apps/wc.exe");
	            myJobDefinition.Files.Add("/example/apps/cat.exe");
	
	            // Get the certificate object from certificate store using the friendly name to identify it
	            X509Store store = new X509Store();
	            store.Open(OpenFlags.ReadOnly);
	            X509Certificate2 cert = store.Certificates.Cast<X509Certificate2>().First(item => item.FriendlyName == certFriendlyName);
	
	            JobSubmissionCertificateCredential creds = new JobSubmissionCertificateCredential(new Guid(subscriptionID), cert, clusterName);
	
	            // Create a hadoop client to connect to HDInsight
	            var jobClient = JobSubmissionClientFactory.Connect(creds);
	
	            // Run the MapReduce job
	            Console.WriteLine("----- Submit the Hadoop streaming job ...");
	            JobCreationResults mrJobResults = jobClient.CreateStreamingJob(myJobDefinition);
	
	            // Wait for the job to complete
	            Console.WriteLine("----- Wait for the Hadoop streaming job to complete ...");
	            WaitForJobCompletion(mrJobResults, jobClient);
	
	            // Display the error log
	            Console.WriteLine("----- The hadoop streaming job error log.");
	            using (Stream stream = jobClient.GetJobErrorLogs(mrJobResults.JobId))
	            {
	                var reader = new StreamReader(stream);
	                Console.WriteLine(reader.ReadToEnd());
	            }
	
	            // Display the output log
	            Console.WriteLine("----- The hadoop streaming job output log.");
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






##Submit Hive jobs by using HDInsight .NET SDK 
HDInsight clusters come with a sample Hive table called *hivesampletable*. In this session, you will create a .NET application to run a Hive job to list the Hive tables that are created in an HDInsight cluster. For more information about using Hive, see [Use Hive with HDInsight][hdinsight-use-hive].

The following procedures are needed to provision an HDInsight cluster by using the SDK:

- Install the HDInsight .NET SDK
- Create a console application
- Run the application


**To install the HDInsight .NET SDK**
You can install the latest published build of the SDK from [NuGet](http://nuget.codeplex.com/wikipage?title=Getting%20Started). The instructions will be shown in the next procedure.

**To create a Visual Studio console application**

1. Open Visual Studio.

2. From the **File** menu, click **New**, and then click **Project**.

3. From **New Project**, type or select the following values:

	<table style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse;">
	<tr>
	<th style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; width:90px; padding-left:5px; padding-right:5px;">Property</th>
	<th style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; width:90px; padding-left:5px; padding-right:5px;">Value</th></tr>
	<tr>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">Category</td>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px; padding-right:5px;">Templates/Visual C#/Windows</td></tr>
	<tr>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">Template</td>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">Console Application</td></tr>
	<tr>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">Name</td>
	<td style="border-color: #c6c6c6; border-width: 2px; border-style: solid; border-collapse: collapse; padding-left:5px;">SubmitHiveJob</td></tr>
	</table>

4. Click **OK** to create the project.


5. From the **Tools** menu, click **Library Package Manager**, and then click **Package Manager Console**.

6. Run the following command in the console to install the package:

		Install-Package Microsoft.WindowsAzure.Management.HDInsight


	This command adds .NET libraries and references to them to the current Visual Studio project.

7. From **Solution Explorer**, double-click **Program.cs** to open it.

8. Add the following **using** statements to the top of the file:

		using System.IO;
		using System.Threading;
		using System.Security.Cryptography.X509Certificates;

		using Microsoft.WindowsAzure.Management.HDInsight;
		using Microsoft.Hadoop.Client;

9. Add the following function definition to the class. This function is used to wait for a Hadoop job to complete.

        private static void WaitForJobCompletion(JobCreationResults jobResults, IJobSubmissionClient client)
        {
            JobDetails jobInProgress = client.GetJob(jobResults.JobId);
            while (jobInProgress.StatusCode != JobStatusCode.Completed && jobInProgress.StatusCode != JobStatusCode.Failed)
            {
                jobInProgress = client.GetJob(jobInProgress.JobId);
                Thread.Sleep(TimeSpan.FromSeconds(10));
            }
        }
	
10. In the **Main()** function, paste the following code:
		
		// Set the variables
		string subscriptionID = "<Azure subscription ID>";
		string clusterName = "<HDInsight cluster name>";
		string certFriendlyName = "<certificate friendly name>";		
		
	
	These are all of the variables you need to set for the program. You can get the Azure Subscription ID from your system administrator. 

	For information about the certificate, see [Create and Upload a Management Certificate for Azure][azure-certificate]. An easy way to configure the certificate is to run the **Get-AzurePublishSettingsFile** and **Import-AzurePublishSettingsFile** Azure PowerShell cmdlets. They will create and upload the management certificate automatically. After you run these cmdlets, you can open **certmgr.msc** from the workstation, and find the certificate by expanding **Personal** > **Certificates**. The certificate created by the Azure PowerShell cmdlets has Azure Tools for the **Issued To** and the **Issued By** fields.
	
11. In the **Main()** function, append the following code to define the Hive job:

        // define the Hive job
        HiveJobCreateParameters hiveJobDefinition = new HiveJobCreateParameters()
        {
            JobName = "show tables job",
            StatusFolder = "/ShowTableStatusFolder",
            Query = "show tables;"
        };

	You can also use the **File** parameter to specify a HiveQL script file in HDFS, for example:

        // define the Hive job
        HiveJobCreateParameters hiveJobDefinition = new HiveJobCreateParameters()
        {
            JobName = "show tables job",
            StatusFolder = "/ShowTableStatusFolder",
            File = "/user/admin/showtables.hql"
        };

		
12. In the **Main()** function, append the following code to create a **JobSubmissionCertificateCredential** object:
	
        // Get the certificate object from certificate store using the friendly name to identify it
        X509Store store = new X509Store();
        store.Open(OpenFlags.ReadOnly);
        X509Certificate2 cert = store.Certificates.Cast<X509Certificate2>().First(item => item.FriendlyName == certFriendlyName);
        JobSubmissionCertificateCredential creds = new JobSubmissionCertificateCredential(new Guid(subscriptionID), cert, clusterName);
		
13. In the **Main()** function, append the following code to run the job and wait for the job to complete:

        // Submit the Hive job
        var jobClient = JobSubmissionClientFactory.Connect(creds);
        JobCreationResults jobResults = jobClient.CreateHiveJob(hiveJobDefinition);

        // Wait for the job to complete
        WaitForJobCompletion(jobResults, jobClient);
		
14. In the **Main()** function, append the following code to print the Hive job output:

        // Print the Hive job output
        System.IO.Stream stream = jobClient.GetJobOutput(jobResults.JobId);

        StreamReader reader = new StreamReader(stream);
        Console.WriteLine(reader.ReadToEnd());

        Console.WriteLine("Press ENTER to continue.");
        Console.ReadLine();

**To run the application**

While the application is open in Visual Studio, press **F5** to run the application. A console window should open and display the status of the application. The output should be:

	hivesampletable




##Next steps
In this article, you have learned several ways to provision an HDInsight cluster. To learn more, see the following articles:

* [Get started with Azure HDInsight][hdinsight-get-started]
* [Provision HDInsight clusters][hdinsight-provision]
* [Manage HDInsight by using PowerShell][hdinsight-admin-powershell]
* [HDInsight Cmdlet Reference Documentation][hdinsight-powershell-reference]
* [Use Hive with HDInsight][hdinsight-use-hive]
* [Use Pig with HDInsight][hdinsight-use-pig]


[azure-certificate]: http://msdn.microsoft.com/library/windowsazure/gg551722.aspx
[azure-management-portal]: http://manage.windowsazure.com/

[hdinsight-visual-studio-tools]: hdinsight-hadoop-visual-studio-tools-get-started.md
[hdinsight-use-sqoop]: hdinsight-use-sqoop.md
[hdinsight-provision]: hdinsight-provision-clusters.md
[hdinsight-use-mapreduce]: hdinsight-use-mapreduce.md
[hdinsight-use-hive]: hdinsight-use-hive.md
[hdinsight-use-pig]: hdinsight-use-pig.md
[hdinsight-get-started]: hdinsight-get-started.md
[hdinsight-storage]: hdinsight-use-blob-storage.md
[hdinsight-admin-powershell]: hdinsight-administer-use-powershell.md
[hdinsight-develop-streaming-jobs]: hdinsight-hadoop-develop-deploy-streaming-jobs.md

[hdinsight-powershell-reference]: http://msdn.microsoft.com/library/windowsazure/dn479228.aspx

[Powershell-install-configure]: install-configure-powershell.md

[image-hdi-gettingstarted-runmrjob]: ./media/hdinsight-submit-hadoop-jobs-programmatically/HDI.GettingStarted.RunMRJob.png 
[image-hdi-gettingstarted-mrjoboutput]: ./media/hdinsight-submit-hadoop-jobs-programmatically/HDI.GettingStarted.MRJobOutput.png

[apache-hive]: http://hive.apache.org/
