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
	ms.date="11/12/2014" 
	ms.author="jgao"/>

# Submit Hadoop jobs in HDInsight

In this article, you will learn how to submit MapReduce and Hive jobs using PowerShell and HDInsight .NET SDK.

**Prerequisites:**

Before you begin this article, you must have the following:

* An Azure HDInsight cluster. For instructions, see [Get started with HDInsight][hdinsight-get-started] or [Provision HDInsight clusters][hdinsight-provision].
* Install and configure Azure PowerShell. For instructions, see [Install and configure Azure PowerShell][powershell-install-configure].


##In this article

* [Submit MapReduce jobs using PowerShell](#mapreduce-powershell)
* [Submit Hive jobs using PowerShell](#hive-powershell)
* [Submit Sqoop jobs using PowerShell](#sqoop-powershell)
* [Submit MapReduce jobs using HDInsight .NET SDK](#mapreduce-sdk)
* [Submit Hadoop Streaming MapReduce jobs using HDInsight .NET SDK](#streaming-sdk)
* [Submit Hive Jobs using HDInsight .NET SDK](#hive-sdk)
* [Next steps](#nextsteps)

##<a id="mapreduce-powershell"></a> Submit MapReduce jobs using PowerShell
Azure PowerShell is a powerful scripting environment that you can use to control and automate the deployment and management of your workloads in Azure. For more information on using PowerShell with HDInsight, see [Administer HDInsight using PowerShell][hdinsight-admin-powershell].

Hadoop MapReduce is a software framework for writing applications which process vast amounts of data. HDInsight clusters come with a jar file, located at *\example\jars\hadoop-examples.jar*, which contains several MapReduce examples. This file has been renamed to hadoop-mapreduce-examples.jar on version 3.0 HDInsight clusters. One of the examples is for counting word frequencies in source files. In this session, you will learn how to use PowerShell from a workstation to run the word count sample. For more information on developing and running MapReduce jobs, see [Use MapReduce with HDInsight][hdinsight-use-mapreduce].

**To run the word count MapReduce program using PowerShell**

1.	Open **Azure PowerShell**. For instructions on opening the Azure PowerShell console window, see the [Install and configure Azure PowerShell][powershell-install-configure].

3. Set these two variables by running the following PowerShell commands:
		
		$subscriptionName = "<SubscriptionName>"   
		$clusterName = "<HDInsightClusterName>"    

	The subscription is the one you used to create the HDInsight cluster. And the HDInsight cluster is the one you want to use to run the MapReduce job.
	
5. Run the following commands to create a MapReduce job definition:

		# Define the word count MapReduce job
		$wordCountJobDefinition = New-AzureHDInsightMapReduceJobDefinition -JarFile "wasb:///example/jars/hadoop-mapreduce-examples.jar" -ClassName "wordcount" -Arguments "wasb:///example/data/gutenberg/davinci.txt", "wasb:///example/data/WordCountOutput"

	There are two arguments. The first one is the source file name, and the second is the output file path. For more information of the wasb prefix, see [Use Azure Blob storage with HDInsight][hdinsight-storage].

6. Run the following command to run the MapReduce job:

		# Submit the MapReduce job
		Select-AzureSubscription $subscriptionName
		$wordCountJob = Start-AzureHDInsightJob -Cluster $clusterName -JobDefinition $wordCountJobDefinition 

	In addition to the MapReduce job definition, you also provide the HDInsight cluster name where you want to run the MapReduce job. 

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
2. Set these three variables by running teh following PowerShell commands:

		$subscriptionName = "<SubscriptionName>"       
		$storageAccountName = "<StorageAccountName>"
		$containerName = "<ContainerName>"			

	The Azure Storage account is the one you specified during the HDInsight cluster provision. The storage account is used to host the Blob container that is used as the default HDInsight cluster file system.  The Blob storage container name usually share the same name as the HDInsight cluster unless you specify a different name when you provision the cluster.

3. Run the following commands to create an Azure storage context object:

		# Create the storage account context object
		Select-AzureSubscription $subscriptionName
		$storageAccountKey = Get-AzureStorageKey $storageAccountName | %{ $_.Primary }
		$storageContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey  

	The Select-AzureSubscription is used to set the current subscription in case you have multiple subscriptions, and the default subscription is not the one to use. 

4. Run the following command to download the MapReduce job output from the Blob container to the workstation:

		# Get the blob content
		Get-AzureStorageBlobContent -Container $ContainerName -Blob example/data/WordCountOutput/part-r-00000 -Context $storageContext -Force

	The *example/data/WordCountOutput* folder is the output folder specified when you run the MapReduce job. *part-r-00000* is the default file name for MapReduce job output.  The file will be download to the same folder structure on the local folder. For example, in the following sreenshoot, the current folder is the C root folder.  The file will be downloaded to the *C:\example\data\WordCountOutput\* folder.

5. Run the following command to print the MapReduce job output file:

		cat ./example/data/WordCountOutput/part-r-00000 | findstr "there"

	![HDI.GettingStarted.MRJobOutput][image-hdi-gettingstarted-mrjoboutput]

	The MapReduce job produces a file named *part-r-00000* with the words and the counts.  The script uses the findstr command to list all of the words that contains "there".


> [AZURE.NOTE] If you open ./example/data/WordCountOutput/part-r-00000, a multi-line output from a MapReduce job, in Notepad, you will notice the line breaks are not renter correctly. This is expected.









































































































































##<a id="hive-powershell"></a> Submit Hive jobs using PowerShell
Apache [hdinsight-use-hive][apache-hive] provides a means of running MapReduce job through an SQL-like scripting language, called *HiveQL*, which can be applied towards summarization, querying, and analysis of large volumes of data. 

HDInsight clusters come with a sample Hive table called *hivesampletable*. In this session, you will use PowerShell to run a Hive job for listing some data from the Hive table. 

**To run a Hive job using PowerShell**

1.	Open **Azure PowerShell**. For instructions of opening Azure PowerShell console window, see [Install and configure Azure PowerShell][powershell-install-configure].

2. Set the first two variables in the following commands, and then run the commands:
		
		$subscriptionName = "<SubscriptionName>"   
		$clusterName = "<HDInsightClusterName>"             
		$querystring = "SELECT * FROM hivesampletable WHERE Country='United Kingdom';"

	The $querystring is the HiveQL query.

3. Run the following commands to select Azure subscription and the cluster to run the Hive job:

		Select-AzureSubscription -SubscriptionName $subscriptionName

4. Submit the hive job:

		Use-AzureHDInsightCluster $clusterName
		Invoke-Hive -Query $queryString

	You can use the -File switch to specify a HiveQL script file on HDFS.

For more information about Hive, see [Use Hive with HDInsight][hdinsight-use-hive].

##<a id="sqoop-powershell"></a>Submit Sqoop jobs using PowerShell

See [Use Sqoop with HDInsight][hdinsight-use-sqoop].

##<a id="mapreduce-sdk"></a> Submit MapReduce jobs using HDInsight .NET SDK
The HDInsight .NET SDK provides .NET client libraries that makes it easier to work with HDInsight clusters from .NET. HDInsight clusters come with a jar file, located at *\example\jars\hadoop-examples.jar*, which contains several MapReduce examples. One of the examples is for counting word frequencies in source files. In this session, you will learn how to create a .NET application to run the word count sample. For more information on developing and running MapReduce jobs, see [Use MapReduce with HDInsight][hdinsight-use-mapreduce].


The following procedures are needed to provision an HDInsight cluster using the SDK:

- Install the HDInsight .NET SDK
- Create a console application
- Run the application


**To install the HDInsight .NET SDK**
You can install latest published build of the SDK from [NuGet](http://nuget.codeplex.com/wikipage?title=Getting%20Started). The instructions will be shown in the next procedure.

**To create a Visual Studio console application**

1. Open Visual Studio 2012.

2. From the File menu, click **New**, and then click **Project**.

3. From New Project, type or select the following values:

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


5. From the **Tools** menu, click **Library Package Manager**, click **Package Manager Console**.

6. Run the following commands in the console to install the packages.

		Install-Package Microsoft.WindowsAzure.Management.HDInsight


	This command adds .NET libraries and references to them to the current Visual Studio project. The version shall be 0.11.0.1 or newer.

7. From Solution Explorer, double-click **Program.cs** to open it.

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
	
10. In the Main() function, copy and paste the following code:
		
		// Set the variables
		string subscriptionID = "<Azure subscription ID>";
		string certFriendlyName = "<certificate friendly name>";

		string clusterName = "<HDInsight cluster name>";
		
		string storageAccountName = "<Azure storage account name>";
		string storageAccountKey = "<Azure storage account key>";
		string containerName = "<Blob container name>";
		
	
	These are all of the variables you need to set for the program. You can get the Azure Subscription name from the [Azure Management Portal][azure-management-portal]. 

	For information on certificate, see [Create and Upload a Management Certificate for Azure][azure-certificate]. An easy way to configure the certificate is to run *Get-AzurePublishSettingsFile* and *Import-AzurePublishSettingsFile* PowerShell cmdlets. They will create and upload the management certificate automatically. After you run the PowerShell cmdlets, you can open *certmgr.msc* from the workstation, and find the certificate by expanding *Personal/Certificates*. The certificate created by the PowerShell cmdlets has *Azure Tools* for both the *Issued To* and the *Issued By* fields.

	The Azure Storage account name is the account you specify when you provision the HDInsight cluster. The default container name is the same as the HDInsight cluster name.
	
11. In the Main() function, append the following code to define the MapReduce job:


        // Define the MapReduce job
        MapReduceJobCreateParameters mrJobDefinition = new MapReduceJobCreateParameters()
        {
            JarFile = "wasb:///example/jars/hadoop-examples.jar",
            ClassName = "wordcount"
        };

        mrJobDefinition.Arguments.Add("wasb:///example/data/gutenberg/davinci.txt");
        mrJobDefinition.Arguments.Add("wasb:///example/data/WordCountOutput");

	There are two arguments. The first one is the source file name, and the second is the output file path. For more information of the wasb prefix, see [Use Azure Blob storage with HDInsight][hdinsight-storage].
		
12. In the Main() function, append the following code to create a JobSubmissionCertificateCredential object:

        // Get the certificate object from certificate store using the friendly name to identify it
        X509Store store = new X509Store();
        store.Open(OpenFlags.ReadOnly);
        X509Certificate2 cert = store.Certificates.Cast<X509Certificate2>().First(item => item.FriendlyName == certFriendlyName);
        JobSubmissionCertificateCredential creds = new JobSubmissionCertificateCredential(new Guid(subscriptionID), cert, clusterName);
		
13. In the Main() function, append the following code to run the job and wait the job to complete:

        // Create a hadoop client to connect to HDInsight
        var jobClient = JobSubmissionClientFactory.Connect(creds);

        // Run the MapReduce job
        JobCreationResults mrJobResults = jobClient.CreateMapReduceJob(mrJobDefinition);

        // Wait for the job to complete
        WaitForJobCompletion(mrJobResults, jobClient);

14. In the Main() function, append the following code to print the MapReduce job output:

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

	The output folder is specified when you define the MapReduce job. The default file name is *part-r-00000*.

**To run the application**

While the application is open in Visual Studio, press **F5** to run the application. A console window should open and display the status of the application and the application output. 

##<a id="streaming-sdk"></a> Submit Hadoop streaming jobs using HDInsight .NET SDK
HDInsight clusters come with a word counting Hadoop stream program developed in C#. The mapper program is */example/apps/cat.exe*, and the reduce program is */example/apps/wc.exe*. In this session, you will learn how to create a .NET application to run the word counting sample. 

For the details of creating a .Net application for submitting MapReduce jobs, see [Submit MapReduce jobs using HDInsight .NET SDK](#mapreduce-sdk).

For more information on developing and deploying Hadoop streaming jobs, see [Develop C# Hadoop streaming programs for HDInsight][hdinsight-develop-streaming-jobs].

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






##<a id="hive-sdk"></a> Submit Hive jobs using HDInsight .NET SDK 
HDInsight clusters come with a sample Hive table called *hivesampletable*. In this session, you will create a .NET application to run a Hive job for listing the Hive tables created on HDInsight cluster. For a more information on using Hive, see [Use Hive with HDInsight][hdinsight-use-hive].

The following procedures are needed to provision an HDInsight cluster using the SDK:

- Install the HDInsight .NET SDK
- Create a console application
- Run the application


**To install the HDInsight .NET SDK**
You can install latest published build of the SDK from [NuGet](http://nuget.codeplex.com/wikipage?title=Getting%20Started). The instructions will be shown in the next procedure.

**To create a Visual Studio console application**

1. Open Visual Studio 2012.

2. From the File menu, click **New**, and then click **Project**.

3. From New Project, type or select the following values:

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


5. From the **Tools** menu, click **Library Package Manager**, click **Package Manager Console**.

6. Run the following commands in the console to install the packages.

		Install-Package Microsoft.WindowsAzure.Management.HDInsight


	This command adds .NET libraries and references to them to the current Visual Studio project.

7. From Solution Explorer, double-click **Program.cs** to open it.

8. Add the following using statements to the top of the file:

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
	
10. In the Main() function, copy and paste the following code:
		
		// Set the variables
		string subscriptionID = "<Azure subscription ID>";
		string clusterName = "<HDInsight cluster name>";
		string certFriendlyName = "<certificate friendly name>";		
		
	
	These are all of the variables you need to set for the program. You can get the Azure Subscription ID from you system administrator. 

	For information on certificate, see [Create and Upload a Management Certificate for Azure][azure-certificate]. An easy way to configure the certificate is to run *Get-AzurePublishSettingsFile* and *Import-AzurePublishSettingsFile* PowerShell cmdlets. They will create and upload the management certificate automatically. After you run the PowerShell cmdlets, you can open *certmgr.msc* from the workstation, and find the certificate by expanding *Personal/Certificates*. The certificate created by the PowerShell cmdlets has *Azure Tools* for both the *Issued To* and the *Issued By* fields.
	
11. In the Main() function, append the following code to define the Hive job:

        // define the Hive job
        HiveJobCreateParameters hiveJobDefinition = new HiveJobCreateParameters()
        {
            JobName = "show tables job",
            StatusFolder = "/ShowTableStatusFolder",
            Query = "show tables;"
        };

	You can also use the File parameter to specify a HiveQL script file on HDFS. For example

        // define the Hive job
        HiveJobCreateParameters hiveJobDefinition = new HiveJobCreateParameters()
        {
            JobName = "show tables job",
            StatusFolder = "/ShowTableStatusFolder",
            File = "/user/admin/showtables.hql"
        };

		
12. In the Main() function, append the following code to create a JobSubmissionCertificateCredential object:
	
        // Get the certificate object from certificate store using the friendly name to identify it
        X509Store store = new X509Store();
        store.Open(OpenFlags.ReadOnly);
        X509Certificate2 cert = store.Certificates.Cast<X509Certificate2>().First(item => item.FriendlyName == certFriendlyName);
        JobSubmissionCertificateCredential creds = new JobSubmissionCertificateCredential(new Guid(subscriptionID), cert, clusterName);
		
13. In the Main() function, append the following code to run the job and wait the job to complete:

        // Submit the Hive job
        var jobClient = JobSubmissionClientFactory.Connect(creds);
        JobCreationResults jobResults = jobClient.CreateHiveJob(hiveJobDefinition);

        // Wait for the job to complete
        WaitForJobCompletion(jobResults, jobClient);
		
14. In the Main() function, append the following code to print the Hive job output:

        // Print the Hive job output
        System.IO.Stream stream = jobClient.GetJobOutput(jobResults.JobId);

        StreamReader reader = new StreamReader(stream);
        Console.WriteLine(reader.ReadToEnd());

        Console.WriteLine("Press ENTER to continue.");
        Console.ReadLine();

**To run the application**

While the application is open in Visual Studio, press **F5** to run the application. A console window should open and display the status of the application. The output shall be:

	hivesampletable




##<a id="nextsteps"></a> Next steps
In this article, you have learned several ways to provision an HDInsight cluster. To learn more, see the following articles:

* [Get started with Azure HDInsight][hdinsight-get-started]
* [Provision HDInsight clusters][hdinsight-provision]
* [Administer HDInsight using PowerShell][hdinsight-admin-powershell]
* [HDInsight Cmdlet Reference Documentation][hdinsight-powershell-reference]
* [Use Hive with HDInsight][hdinsight-use-hive]
* [Use Pig with HDInsight][hdinsight-use-pig]


[azure-certificate]: http://msdn.microsoft.com/en-us/library/windowsazure/gg551722.aspx
[azure-management-portal]: http://manage.windowsazure.com/

[hdinsight-use-sqoop]: ../hdinsight-use-sqoop/
[hdinsight-provision]: ../hdinsight-provision-clusters/
[hdinsight-use-mapreduce]: ../hdinsight-use-mapreduce/
[hdinsight-use-hive]: ../hdinsight-use-hive/
[hdinsight-use-pig]: ../hdinsight-use-pig/
[hdinsight-get-started]: ../hdinsight-get-started/
[hdinsight-storage]: ../hdinsight-use-blob-storage/
[hdinsight-admin-powershell]: ../hdinsight-administer-use-powershell/
[hdinsight-develop-streaming-jobs]: ../hdinsight-hadoop-develop-deploy-streaming-jobs/

[hdinsight-powershell-reference]: http://msdn.microsoft.com/en-us/library/windowsazure/dn479228.aspx

[Powershell-install-configure]: ../install-configure-powershell/

[image-hdi-gettingstarted-runmrjob]: ./media/hdinsight-submit-hadoop-jobs-programmatically/HDI.GettingStarted.RunMRJob.png 
[image-hdi-gettingstarted-mrjoboutput]: ./media/hdinsight-submit-hadoop-jobs-programmatically/HDI.GettingStarted.MRJobOutput.png

[apache-hive]: http://hive.apache.org/
