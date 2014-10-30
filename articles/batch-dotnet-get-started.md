<properties title="Tutorial - Getting Started with the Azure Batch Library for .NET" pageTitle="Tutorial - Getting Started with the Azure Batch Library for .NET" description="required" metaKeywords="" services="batch" solutions="" documentationCenter=".NET" authors="yidingz, karran.batta" videoId="" scriptId="" manager="asutton" />

<tags ms.service="batch" ms.devlang="dotnet" ms.topic="article" ms.tgt_pltfrm="na" ms.workload="big-compute" ms.date="10/02/2014" ms.author="yidingz, karran.batta" />

#Getting Started with the Azure Batch Library for .NET  

This article contains the following two tutorials to help you get started developing with the .NET library for the Azure Batch service.  

-	[Tutorial 1: Azure Batch library for .NET](#tutorial1)
-	[Tutorial 2: Azure Batch Apps library for .NET](#tutorial2)  


For background information and scenarios for Azure Batch, see [Azure Batch technical overview](http://azure.microsoft.com/en-us/documentation/articles/batch-technical-overview/).

##<a name="tutorial1"></a>Tutorial 1: Azure Batch library for .NET
  	
This tutorial will show you how to create a series of console applications that sets up distributed computation among a pool of virtual machines by using the Azure Batch service. The tasks that are created in this tutorial evaluate text from files in Azure storage and return the words that are most commonly used. The samples are written in C# code and use the Azure Storage Library for .NET and the Azure Batch Library for .NET.

>[WACOM.NOTE] To complete this tutorial, you need an Azure account. You can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://www.windowsazure.com/en-us/pricing/free-trial/). You can use NuGet to obtain the Microsoft.WindowsAzure.Storage.dll assembly. After you create your project in Visual Studio, right-click the project in **Solution Explorer** and choose **Manage NuGet Packages**. Search online for "WindowsAzure.Storage" and then click Install to install the Azure Storage package and dependencies.   
Microsoft.WindowsAzure.Storage.dll is also included in the Azure SDK for .NET 2.0, which can be downloaded from the [.NET Developer Center](http://www.windowsazure.com/en-us/downloads/?sdk=net). The assembly is installed to the %Program Files%\Microsoft SDKs\Azure\.NET SDK\v2.0\ref\ directory.
>
You can also use NuGet to obtain the **Microsoft.Azure.Batch.dll** assembly. Search for "Azure.Batch" and then install the package and its dependencies. 

###Concepts
The Batch service is used for scheduling scalable and distributed computation. It enables you to run large scale workloads that are distributed among multiple virtual machines. These workloads provide efficient support for intensive computation. When you use the Batch service, you take advantage of the following resources:  

-	**Account** - A uniquely identified entity within the service. All processing is done through a Batch account.
-	**Pool** – A collection of task virtual machines on which task applications run.
-	**Task Virtual Machine** - A machine that is assigned to a pool and is used by tasks that are assigned to jobs that run in the pool.
-	**Task Virtual Machine User** – A user account on a task virtual machine.
-	**Workitem** - Specifies how computation is performed on task virtual machines in a pool.
-	**Job** - A running instance of a work item and consists of a collection of tasks.
-	**Task** - An application that is associated with a job and runs on a task virtual machine.
-	**File** – Contains the information that is processed by a task.  

You use the following basic workflow when you create a distributed computational scenario with the Batch service:  

1.	Upload the files that you want to use in your distributed computational scenario to an Azure storage account. These files must be in the storage account so that the Batch service can access them. The files are loaded onto a task virtual machine when the task runs.
2.	Upload the dependent binary files to the storage account. The binary files include the program that is run by the task and the dependent assemblies. These files must also be accessed from storage and are loaded onto the task virtual machine.
3.	Create a pool of task virtual machines. You can assign the size of the task virtual machine to use when the pool is created. When a task runs, it is assigned a virtual machine from this pool.
4.	Create a workitem. A workitem enables you to manage a job of tasks. A job is automatically created when you create a workitem.
5.	Add tasks to the job. Each task uses the program that you uploaded to process information from a file that you uploaded.
6.	Monitor the results of the output.  

###Create an Azure Storage account
Before you can run the code in this tutorial, you must have access to a storage account in Azure.  

1.	Log into the [Azure Management Portal](http://manage.windowsazure.com/).
2.	At the bottom of the navigation pane, click **NEW**.  
![][1]
3.	Click **DATA SERVICES**, then **STORAGE**, and then click **QUICK CREATE**.
![][2]

4.	In **URL**, type a subdomain name to use in the URI for the storage account. The entry can contain from 3-24 lowercase letters and numbers. This value becomes the host name within the URI that is used to address Blob, Queue, or Table resources for the subscription.
5.	Choose a **LOCATION/AFFINITY GROUP** in which to locate the storage.
6.	Optionally, you can enable geo-replication.
7.	Click **CREATE STORAGE ACCOUNT**.  

For more information about Azure Storage, see [How to use the Azure Blob Storage Service in .NET](http://www.windowsazure.com/en-us/develop/net/how-to-guides/blob-storage/).  

###Create an Azure Batch account
You can use the Management Portal to create a Batch account. A key is provided to you after the account is created. For more information, see [Azure Batch technical overview](http://azure.microsoft.com/en-us/documentation/articles/batch-technical-overview/).  

###How to: Upload files to Azure Storage
Files are uploaded into the Blob service of Azure Storage. Azure Blob storage is a service for storing large amounts of unstructured data that can be accessed from anywhere in the world by using HTTP or HTTPS. A single blob can be hundreds of gigabytes in size, and a single storage account can contain up to 100TB of blobs.  

1.	Open Microsoft Visual Studio 2013, on the **File** menu, click **New**, and then click **Project**.
![][3] 

2.	From **Windows**, under **Visual C#**, click **Console Application**, name the project **CreateContainer**, name the solution **AzureBatch**, and then click **OK**.
![][4] 

####Set up the storage connection string
1.	Open the App.config file, and then add the `<appSettings>` element to `<configuration>`.

		<?xml version="1.0" encoding="utf-8" ?>
		<configuration>
		   <appSettings>
		     <add key="StorageConnectionString" value="DefaultEndpointsProtocol=https;AccountName=[name-of-storage-account];AccountKey=[key-of-storage-account]"/>
		     </appSettings>
		</configuration>  

	Replace the following values:  

	-	**[name-of-storage-account]** - The name of the storage account that you previously created.
	-	**[key-of-storage-account]** - The primary key of the storage account. You can find the primary key from the Storage page in the Management Portal  

	For more information about storage connection strings, see [Configuring Connection Strings](http://msdn.microsoft.com/en-us/library/windowsazure/ee758697.aspx).
2.	Save the App.config file.
####Create the storage container for the program and data files  

Before you can upload files as blobs, you must create a container in which the blobs are stored.  

1.	Add the following namespace declarations to the top of Program.cs in the **CreateContainer** project:

		using Microsoft.WindowsAzure.Storage;
		using Microsoft.WindowsAzure.Storage.Blob;
		using System.Configuration;
	Make sure that you reference the Microsoft.WindowsAzure.Storage.dll assembly and the System.Configuration.dll assembly.
2.	Add the following code to Main that obtains the storage connection string that you defined:

		CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
		   ConfigurationManager.AppSettings["StorageConnectionString"]);
3.	Add the following code to Main that creates the container:
       
		CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
		CloudBlobContainer container = blobClient.GetContainerReference("[name-of-container]");
		container.CreateIfNotExists();
	Replace **[name-of-container]** with the name that you want to use for the container in your storage account.
4.	Add the following code to Main that sets the permissions on the container to enable access to the data:

		BlobContainerPermissions containerPermissions = new BlobContainerPermissions();
		containerPermissions.PublicAccess = BlobContainerPublicAccessType.Blob;
		container.SetPermissions(containerPermissions);
  
	>[WACOM.NOTE] In a production environment, it is recommended that you use a shared access signature.
5.	Save and run the program.  

####Create the processing program
The executable program that processes the data must be uploaded to Azure Storage to be available to the task virtual machine that runs it.  

1.	In Solution Explorer, create a new console application project named **ProcessTaskData** in the **AzureBatch** solution.
2.	Add the following namespace declaration to the top of Program.cs:
		using Microsoft.WindowsAzure.StorageClient;
	Make sure that you reference the Microsoft.WindowsAzure.StorageClient.dll assembly.
3.	Add the following code to Main that will be used to process data:

		string blobName = args[0];
		int numTopN = int.Parse(args[1]);
		
		CloudBlob blob = new CloudBlob(blobName);
		string content = blob.DownloadText();
		string[] words = content.Split(' ');
		var topNWords =
		   words.
		   Where(word => word.Length > 0).
		   GroupBy(word => word, (key, group) => new KeyValuePair<String, long>(key, group.LongCount())).
		   OrderByDescending(x => x.Value).
		   Take(numTopN).
		   ToList();
		
		foreach (var pair in topNWords)
		{
		   Console.WriteLine("{0} {1}", pair.Key, pair.Value);
		}
4.	Save and build the project.  

####Create the data files
This tutorial uses three simple text files to demonstrate using tasks to process data. You must locate these files in Azure Storage where the tasks can access them.  

1.	In Solution Explorer, create a new console application project named **UploadData** in the **AzureBatch** solution.
2.	Create three text files (taskdata1.txt, taskdata2.txt, taskdata3.txt) with each one containing one of the following paragraphs and save the files to the bin directory of the **UploadData** project:

		You can use Azure Virtual Machines to provision on-demand, scalable compute infrastructure when you need flexible resources for your business needs. From the gallery, you can create virtual machines that run Windows, Linux, and enterprise applications such as SharePoint and SQL Server. Or, you can capture and use your own images to create customized virtual machines.
		
		Quickly deploy and manage powerful applications and services with Azure Cloud Services. Simply upload your application and Azure handles the deployment details - from provisioning and load balancing to health monitoring for continuous availability. Your application is backed by an industry leading 99.95% monthly SLA. You just focus on the application and not the infrastructure.
		
		Azure Web Sites provide a scalable, reliable, and easy-to-use environment for hosting web applications. Select from a range of frameworks and templates to create a web site in seconds. Use any tool or OS to develop your site with .NET, PHP, Node.js or Python. Choose from a variety of source control options including TFS, GitHub, and BitBucket to set up continuous integration and develop as a team. Expand your site functionality over time by leveraging additional Azure managed services like storage, CDN, and SQL Database.
####Upload the files
1.	Add the following namespace declarations to the top of Program.cs in the **UploadData** project:

		using Microsoft.WindowsAzure.StorageClient;
		using Microsoft.WindowsAzure;
		using System.Configuration;
	Make sure that you reference the Microsoft.WindowsAzure.StorageClient.dll assembly and the System.Configuration.dll assembly.
2.	Copy the App.config file that you previously created from the **CreateContainer** project to the **UploadData** project.
3.	Add the following code to Main to upload the text files, program file, and the dependent assembly:

		CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
		   ConfigurationManager.AppSettings["StorageConnectionString"]);
		CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
		CloudBlobContainer container = blobClient.GetContainerReference("[name-of-container]");
		CloudBlob taskData1 = container.GetBlobReference("taskdata1");
		CloudBlob taskData2 = container.GetBlobReference("taskdata2");
		CloudBlob taskData3 = container.GetBlobReference("taskdata3");
		CloudBlob dataprocessor = container.GetBlobReference("ProcessTaskData.exe");
		CloudBlob storageassembly = 
		   container.GetBlobReference("Microsoft.WindowsAzure.StorageClient.dll");
		taskData1.UploadFile("taskdata1.txt");
		taskData2.UploadFile("taskdata2.txt");
		taskData3.UploadFile("taskdata3.txt");
		dataprocessor.UploadFile("..\\..\\..\\ProcessTaskData\\bin\\debug\\ProcessTaskData.exe");
		storageassembly.UploadFile("Microsoft.WindowsAzure.StorageClient.dll");
	Replace **[name-of-container]** with the name that you want to use for the container in your storage account.
4.	Save and run the program.
###How to: Add a pool to an account
A pool of task virtual machines is the first set of resources that you must create when you want to run tasks.  

1.	In Solution Explorer, create a new console application project named **AddPool** in the **AzureBatch** solution.
2.	Add the following namespace declarations to the top of Program.cs:

		using Microsoft.Azure.Batch;
		using Microsoft.Azure.Batch.Auth;
		using Microsoft.Azure.Batch.Common;
	Make sure that you reference the Microsoft.Azure.Batch.dll assembly.
3.	Add the following variables to the Program class:

		private const string PoolName = "[name-of-pool]";
		private const int NumOfMachines = 3;
		private const string AccountName = "[name-of-batch-account]";
		private const string AccountKey = "[key-of-batch-account]";
		private const string Uri = "http://batch.core.windows.net";
	Replace the following values:
	-	**[name-of-pool]** - The name that you want to use for the pool.
	-	**[name-of-batch-account]** - The name of the Batch account.
	-	**[key-of-batch-account]** - The key that was provided to you for the Batch account.
4.	Add the following code to Main that defines the credentials to use:

		BatchCredentials cred = new BatchCredentials(AccountName, AccountKey);
5.	Add the following code to Main to create the client that is used to perform operations:

		IBatchClient client = BatchClient.Connect(Uri, cred);
		client.CustomBehaviors.Add(new SetRetryPolicy(new Microsoft.Azure.Batch.Protocol.NoRetry()));
6.	Add the following code to Main that creates the pool if it doesn’t exist:

		using (IPoolManager pm = client.OpenPoolManager())
		{
		   IEnumerable<ICloudPool> pools = pm.ListPools();
		   if (!pools.Select(pool => pool.Name).Contains(PoolName))
		   {
		      Console.WriteLine("The pool does not exist, creating now...");
		      ICloudPool newPool = pm.CreatePool(
		         PoolName, 
		         osFamily: "3", 
		         vmSize: "small", 
		         targetDedicated: NumOfMachines);
		       newPool.Commit();                  
		    }
		}
		Console.WriteLine("Created pool {0}", PoolName);
		Console.ReadLine();
7.	Save and run the program. The status is **Active** for a pool that was added successfully.  

###How to: List the pools in an account
If you don’t know the name of an existing pool, you can get a list of them in an account.  

1.	In Solution Explorer, create a new console application project named **ListPools** in the **AzureBatch** solution.
2.	Add the following namespace declarations to the top of Program.cs:

		using Microsoft.Azure.Batch;
		using Microsoft.Azure.Batch.Auth;
		using Microsoft.Azure.Batch.Common;
	Make sure that you reference the Microsoft.Azure.Batch.dll assembly.
3.	Add the following variables to the Program class:

		private const string AccountName = "[name-of-batch-account]";
		private const string AccountKey = "[key-of-batch-account]";
		private const string Uri = "https://batch.core.windows.net";
	Replace the following values:
	-	**[name-of-batch-account]** - The name of the Batch account.
	-	**[key-of-batch-account]** - The key that was provided to you for the Batch account.
4.	Add the following code to Main that defines the credentials to use:  

		BatchCredentials cred = new BatchCredentials(AccountName, AccountKey);
5.	Add the following code to Main to create the client that is used to perform operations:

		IBatchClient client = BatchClient.Connect(Uri, cred);
		client.CustomBehaviors.Add(new SetRetryPolicy(new Microsoft.Azure.Batch.Protocol.NoRetry()));
6.	Add the following code to Main that writes the names and states of all pools in the account:

		using (IPoolManager pm = client.OpenPoolManager())
		{
		   Console.WriteLine("Listing Pools\n=================");
		   IEnumerable<ICloudPool> pools = pm.ListPools();
		   foreach (var p in pools)
		   {
		      Console.WriteLine("Pool: " + p.Name + " State:" + p.State);
		   }   
		} 
		Console.ReadLine();
7.	Save and run the program.  

##How to: Add a workitem to an account
You must create a workitem to define how the tasks will run in the pool.  

1.	In Solution Explorer, create a new console application project named **AddWorkitem** in the **AzureBatch** solution.
2.	Add the following namespace declarations to the top of Program.cs:

		using Microsoft.Azure.Batch;
		using Microsoft.Azure.Batch.Auth;
		using Microsoft.Azure.Batch.Common;
	Make sure that you reference the Microsoft.Azure.Batch.dll assembly.
3.	Add the following variables to the Program class:

		private const string WorkItemName = "[name-of-workitem]";
		private const string PoolName = "[name-of-pool]";
		private const string AccountName = "[name-of-batch-account]";
		private const string AccountKey = "[key-of-batch-account]"; 
		private const string Uri = "http://batch.core.windows.net";
	Replace the following values:
	-	**[name-of-workitem]** - The name that you want to use for the workitem.
	-	**[name-of-pool]** - The name of the pool that you previously created. A workitem must be associated with a pool.
	-	**[name-of-batch-account]** - The name of the Batch account.
	-	**[key-of-batch-account]** - The key that was provided to you for the Batch account.
4.	Add the following code to Main that defines the credentials to use:  

		BatchCredentials cred = new BatchCredentials(AccountName, AccountKey);  

	Add the following code to Main to create the client that is used to perform operations:

		IBatchClient client = BatchClient.Connect(Uri, cred);
		client.CustomBehaviors.Add(new SetRetryPolicy(new Microsoft.Azure.Batch.Protocol.NoRetry()));
5.	When a workitem is created, a job is also created. You can assign a name to the workitem, but the job is always assigned the name of **job-0000000001**. Add the following code to Main that adds the workitem and its associated job:

		using (IWorkItemManager wm = client.OpenWorkItemManager())
		{
		   ICloudJob job = wm.CreateJob(PoolName);
		   job.WorkItemName = WorkItemName;
		   job.Commit();
		}
		Console.WriteLine("Workitem successfully added.");
		Console.ReadLine();
6.	Save and run the program. The status is **Active** for a workitem that was added successfully.  

###How to: List the workitems in an account
If you don’t know the name of an existing workitem, you can get a list of them in an account.  

1.	In Solution Explorer, create a new console application project named **ListWorkitems** in the **AzureBatch** solution.
2.	Add the following namespace declarations to the top of Program.cs:

		using Microsoft.Azure.Batch;
		using Microsoft.Azure.Batch.Auth;
		using Microsoft.Azure.Batch.Common;
	Make sure that you reference the Microsoft.Azure.Batch.dll assembly.
3.	Add the following variables to the Program class:

		private const string AccountName = "[name-of-batch-account]";
		private const string AccountKey = "[key-of-batch-account]";
		private const string Uri = "http://batch.core.windows.net";
	Replace the following values:
	-	**[name-of-batch-account]** - The name of the Batch account.
	-	**[key-of-batch-account]** - The key that was provided to you for the Batch account.
4.	Add the following code to Main that defines the credentials to use:  

		BatchCredentials cred = new BatchCredentials(AccountName, AccountKey);
5.	Add the following code to Main to create the client that is used to perform operations:

		IBatchClient client = BatchClient.Connect(Uri, cred);
		client.CustomBehaviors.Add(new SetRetryPolicy(new Microsoft.Azure.Batch.Protocol.NoRetry()));
6.	Add the following code to Main that writes the names and states of all workitems in the account:

		using (IPoolManager pm = client.OpenPoolManager())
		{
		   Console.WriteLine("Listing Workitems\n=================");
		   IEnumerable<ICloudWorkItem> workitems = wm.ListWorkItems();
		   foreach (var w in workitems)
		   {
		      Console.WriteLine("Workitem: " + w.Name + " State:" + w.State);
		   }   
		} 
		Console.ReadLine();
7.	Save and run the program.  

###How to: Add tasks to a job
After you create the workitem and the job is created, you can add tasks to the job.  

1.	In Solution Explorer, create a new console application project named **AddTasks** in the **AzureBatch** solution.
2.	Add the following namespace declarations to the top of Program.cs:

		using Microsoft.Azure.Batch;
		using Microsoft.Azure.Batch.Auth;
		using Microsoft.Azure.Batch.Common;
	Make sure that you reference the Microsoft.Azure.Batch.dll assembly.
3.	Add the following variables to the Program class:

		private const int FileCount = 4;
		private const int NumberOfWords = 3;
		private const string BlobPath = "[storage-path]"; 
		private const string WorkItemName = "[name-of-workitem]";
		private const string JobName = "job-0000000001";
		private const string AccountName = "[name-of-batch-account]";
		private const string AccountKey = "[key-of-batch-account]"; 
		private const string Uri = "http://batch.core.windows.net";
	Replace the following values:
	-•	**[path-of-blob-in-storage]** – The path to the blob in storage. For example: http://mystorage1.blob.core.windows.net/batchfiles/.
	-	**[name-of-workitem]** - The name of the workitem that you previously created.
	-	**[name-of-batch-account]** - The name of the Batch account.
	-	**[key-of-batch-account]** - The key that was provided to you for the Batch account.
4.	Add the following code to Main that defines the credentials to use:  

		BatchCredentials cred = new BatchCredentials(AccountName, AccountKey);
	Add the following code to Main to create the client that is used to perform operations:

		IBatchClient client = BatchClient.Connect(Uri, cred);
		client.CustomBehaviors.Add(new SetRetryPolicy(new Microsoft.Azure.Batch.Protocol.NoRetry()));
5.	Add the following code to Main that adds tasks to a job, waits for them to run, and reports the results:

		using (IWorkItemManager wm = client.OpenWorkItemManager())
		{
		   string taskName;
		   for (int i = 1; i < FileCount; ++i)
		   {
		      taskName = "taskdata" + i;
		      ICloudJob job = wm.GetJob(WorkitemName, JobName);
		      IResourceFile programFile = new ResourceFile(
		         BlobPath + "ProcessTaskData.exe", 
		         "ProcessTaskData.exe");
		      IResourceFile supportFile1 = new ResourceFile(
		         BlobPath + taskName, 
		         taskName);
		      IResourceFile supportFile2 = new ResourceFile(
		         BlobPath + "Microsoft.WindowsAzure.StorageClient.dll", 
		         "Microsoft.WindowsAzure.StorageClient.dll");
		      
		      string commandLine = 
		         String.Format("ProcessTaskData.exe {0} {1}", 
		         BlobPath + taskName, NumberOfWords);
		      ICloudTask taskToAdd = new CloudTask(taskName, commandLine);
		      taskToAdd.AddResourceFile(programFile);
		      taskToAdd.AddResourceFile(supportFile1);
		      taskToAdd.AddResourceFile(supportFile2);
		      job.AddTask(taskToAdd);
		      job.Commit();
		   }
		   
		   ICloudJob listjob = wm.GetJob(WorkitemName, JobName);
		   client.OpenToolbox().CreateTaskStateMonitor().WaitAll(listjob.ListTasks(), 
		      TaskState.Completed, new TimeSpan(0, 30, 0));
		   Console.WriteLine("The tasks completed successfully. Terminating the workitem...");
		   wm.GetWorkItem(WorkitemName).Terminate();
		   foreach (ICloudTask task in listjob.ListTasks())
		   {
		      Console.WriteLine("Task " + task.Name + " says:\n" + task.StdOut);
		   }
		   Console.ReadLine();
		}
6.	Save and run the program. The results show the top three words that are used the most in each text file and the number of occurrences of the words.  


###How to: Delete the pool and workitem
After your data has been processed you can release resources by deleting the pool and workitem.

####Delete the pool
1.	In Solution Explorer, create a new console application project named **DeletePool** in the **AzureBatch** solution.
2.	Add the following namespace declarations to the top of Program.cs:

		using Microsoft.Azure.Batch;
		using Microsoft.Azure.Batch.Auth;
		using Microsoft.Azure.Batch.Common;
	Make sure that you reference the Microsoft.Azure.Batch.dll assembly.
3.	Add the following variables to the Program class:

		private const string PoolName = "[name-of-pool]";
		private const string AccountName = "[name-of-batch-account]";
		private const string AccountKey = "[key-of-batch-account]"; 
		private const string Uri = "http://batch.core.windows.net";
	Replace the following values:
	-	**[name-of-pool]** - The name of the pool that you previously created.
	-	**[name-of-batch-account]** - The name of the Batch account.
	-	**[key-of-batch-account]** - The key that was provided to you for the Batch account.
4.	Add the following code to Main that defines the credentials to use:  

		BatchCredentials cred = new BatchCredentials(AccountName, AccountKey);
5.	Add the following code to Main to create the client that is used to perform operations:

		IBatchClient client = BatchClient.Connect(Uri, cred);
		client.CustomBehaviors.Add(new SetRetryPolicy(new Microsoft.Azure.Batch.Protocol.NoRetry()));
6.	Add the following code to Main that deletes the pool:

		using (IPoolManager pm = client.OpenPoolManager())
		{
		   pm.DeletePool(PoolName);
		}
		Console.WriteLine("Pool successfully deleted.");
		Console.ReadLine();
7.	Save and run the program.


####Delete the workitem
1.	In Solution Explorer, create a new console application project named **DeleteWorkItem** in the **AzureBatch** solution.
2.	Add the following namespace declarations to the top of Program.cs:

		using Microsoft.Azure.Batch;
		using Microsoft.Azure.Batch.Auth;
		using Microsoft.Azure.Batch.Common;
	Make sure that you reference the Microsoft.Azure.Batch.dll assembly.
3.	Add the following variables to the Program class:

		private const string WorkItemName = "[name-of-workitem]";
		private const string AccountName = "[name-of-batch-account]";
		private const string AccountKey = "[key-of-batch-account]"; 
		private const string Uri = "http://batch.core.windows.net";
	Replace the following values:
	-	**[name-of-workitem]** - The name of the workitem that you previously added.
	-	**[name-of-batch-account]** - The name of the Batch account.
	-	**[key-of-batch-account]** - The key that was provided to you for the Batch account.
4.	Add the following code to Main that defines the credentials to use:  

		BatchCredentials cred = new BatchCredentials(AccountName, AccountKey);
5.	Add the following code to Main to create the client that is used to perform operations:

		IBatchClient client = BatchClient.Connect(Uri, cred);
		client.CustomBehaviors.Add(new SetRetryPolicy(new Microsoft.Azure.Batch.Protocol.NoRetry()));
6.	Add the following code to Main that deletes the workitem:

		using (IWorkItemManager wm = client.OpenWorkItemManager())
		{
		   wm.DeleteWorkItem(WorkitemName);
		}
		Console.WriteLine("Workitem successfully deleted.");
		Console.ReadLine();
7.	Save and run the program.

##<a name="tutorial2"></a>Tutorial 2: Azure Batch Apps Library for .NET
This tutorial shows you how to run parallel compute workloads on Azure Batch using the Batch Apps service.
Batch Apps is a feature of Azure Batch that provides an application-centric way of managing and executing Batch workloads.  Using the Batch Apps SDK, you can create packages to Batch-enable an application, and deploy them in your own account or make them available to other Batch users.  Batch also provides data management, job monitoring, built-in diagnostics and logging, and support for inter task dependencies.  It additionally includes a management portal where you can manage jobs, view logs, and download outputs without having to write your own client.
In the Batch Apps scenario, you write code using the Batch Apps Cloud SDK to partition jobs into parallel tasks, describe any dependencies between these tasks, and specify how to execute each task.  This code is deployed to the Batch account.  Clients can then execute jobs simply by specifying the kind of job and the input files to a REST API.

>[WACOM.NOTE] To complete this tutorial, you need an Azure account. You can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://www.windowsazure.com/en-us/pricing/free-trial/). You can use NuGet to obtain both the <a href="http://www.nuget.org/packages/Microsoft.Azure.Batch.Apps.Cloud/">Batch Apps Cloud</a> assembly and the <a href="http://www.nuget.org/packages/Microsoft.Azure.Batch.Apps/">Batch Apps Client</a> assembly. After you create your project in Visual Studio, right-click the project in **Solution Explorer** and choose **Manage NuGet Packages**. You can also download the Visual Studio Extension for Batch Apps which includes a project template to cloud-enable applications and ability to deploy an application <a href="https://visualstudiogallery.msdn.microsoft.com/8b294850-a0a5-43b0-acde-57a07f17826a">here</a> or via searching for **Batch Apps** in Visual Studio via the Extensions and Updates menu item.
>

###Fundamentals of Azure Batch Apps 
Batch Apps is designed to work with existing application that have compute intensive workloads. Batch Apps leverages the workload and extends it to a dynamic, virtualized, general-purpose environment. To enable an application to work with Batch Apps there are a couple of things that need to be done – 

1.	Prepare a zip file of your existing application executables – the same executables that would be run in a traditional server farm or cluster – and any support files it needs. This is then uploaded to an Azure Storage account. 
2.	Create a zip file of the Cloud Assemblies that will invoke and dispatch your workloads to the application. This contains two components that will be available via the SDK:
	1.	Job Splitter – which breaks down into tasks that can be processed independently. For example, in an animation scenario, the job splitter would take a movie job and break it down into individual frames. 
	2.	Task Processor – which invokes the application executable for a given task. For example, in an animation scenario, the task processor would invoke a rendering program to render the single frame specified by the task at hand. 
3.	Provide a way to submit jobs to the enabled application in Azure. This might be a plugin in your application UI or a web portal or even an unattended service as part of your execution pipeline. There are samples available on MSDN using the SDK to demonstrate a few options.



###Resources of Batch Apps 
When you use Batch Apps, you take advantage of the following resources:

####Jobs
A Job is a piece of work submitted by the user. When a job is submitted, the user specifies the type of job, any settings for that job, and the data required for the job. Either the enabled implementation can work out these details on the user’ behalf or in some cases the user can provide this information explicitly via the client. A job has results that are returned. Each job has a primary output and optionally a preview output. Jobs can also return extra outputs if desired.

####Tasks
A task is a piece of work to be done as part of a job. When a user submits a job, it is broken up into smaller tasks. The service then processes these individual tasks, then assemblies the task results into an overall job output. The nature of tasks depends on the kind of job. The Job Splitter defines how a job is broken down into tasks, guided by the knowledge of what chunks of work the application is designed to process. Task outputs can also be download individually and might be useful in some cases, e.g. when a user may want to download individual tasks from an animation job.

####Merge Tasks
A merge task is a special kind of task that assembles the results of individual tasks into the final job results. For a movie rending job, the merge task might assemble the rendered frames into a movie or to zip all the rendered frames into a single file. Every job has a merge task even if no actual ‘merging’ is needed.

####Files
A file is a piece of data used as an input to a job. A job can have no input file associated with it or have one or many. The same file can be used in multiple jobs as well, e.g. for a movie rendering job, the files might be textures, models, etc. For a data analysis job, the files might be a set of observations or measurements.

###Enabling the Cloud Application
Your Application must contain a static field or property containing all the details of your application. It specifies the name of the application and the job type or job types handled by the application. This is provided when using the template in the SDK that can be downloaded via Visual Studio Gallery. 

Here is an example of a cloud application declaration for a parallel workload:

	public static class ApplicationDefinition
	{
	    public static readonly CloudApplication App = new ParallelCloudApplication
	    {
	        ApplicationName = "ApplicationName",
	        JobType = "ApplicationJobType",
	        JobSplitterType = typeof(MyJobSplitter),
	        TaskProcessorType = typeof(MyTaskProcessor),
	    };
	}

####Implementing Job Splitter and Task Processor
For embarrassingly parallel workloads, you must implement a job splitter and a task processor. 

####Implementing JobSplitter.SplitIntoTasks
Your SplitIntoTasks implementation must return a sequence of tasks. Each task represents a separate piece of work that will be queued for processing by a compute node. Each task must be self-contained and must be set up with all the information that the task processor will need. 

The tasks specified by the job splitter are represented as TaskSpecifier objects. TaskSpecifier has a number of properties which you can set before you return the task.
  

-	TaskIndex is ignored, but is available to task processors. You can use this to pass an index to the task processor. If you don’t need to pass an index, you don’t need to set this property.
-	Parameters is an empty collection by default. You can add to it or replace it with a new collection. You can copy entries from the job parameters collection using the WithJobParameters or WithAllJobParameters method.  


RequiredFiles is an empty collection by default. You can add to it or replace it with a new collection. You can copy entries from the job files collection using the RequiringJobFiles or RequiringAllJobFiles method.

You can specify a task that depends on a specific other task. To do this, set the TaskSpecifier.DependsOn property, passing the ID of the task it depends on:

	new TaskSpecifier {
	    DependsOn = TaskDependency.OnId(5)
	}

The task will not run until the output of the depended on task is available.   

You can also specify that a whole group of tasks should not start processing until another group has completely finished. In this case you can set the TaskSpecifier.Stage property. Tasks with a given Stage value will not begin processing until all tasks with lower Stage values have finished; for example, tasks with Stage 3 will not begin processing until all tasks with Stage 0, 1 or 2 have finished. Stages must begin at 0, the sequence of stages must have no gaps, and SplitIntoTasks must return tasks in stage order: for example, it is an error to return a task with Stage 0 after a task with Stage 1.

Every parallel job ends with a special task called the merge task. The merge task’s job is to assemble the results of the parallel processing tasks into a final result. Batch Apps automatically creates the merge task for you.  

In rare cases, you may want to explicitly control the merge task, for example to customize its parameters. In this case, you can specify the merge task by returning a TaskSpecifier with its IsMerge property set to true. This will override the automatic merge task. If you create an explicit merge task:  

-	You may create only one explicit merge task
-	It must be the last task in the sequence
-	It must have IsMerge set to true, and every other task must have IsMerge set to false  


Remember, however, that normally you do not need to create the merge task explicitly.  

The following code demonstrates a simple implementation of SplitIntoTasks.  

	protected override IEnumerable<TaskSpecifier> SplitIntoTasks(
	    IJob job,
	    JobSplitSettings settings)
	{
	    int start = Int32.Parse(job.Parameters["startIndex"]);
	    int end = Int32.Parse(job.Parameters["endIndex"]);
	    int count = (end - start) + 1;
	 
	    // Processing tasks
	    for (int i = 0; i < count; ++i)
	    {
	        yield return new TaskSpecifier
	        {
	            TaskIndex = start + i,
	        }.RequiringAllJobFiles();
	    }
	}
####Implementing ParallelTaskProcessor.RunExternalTaskProcess

RunExternalTaskProcess is called for each non merge task returned from the job splitter. It should invoke your application with the appropriate arguments, and return a collection of outputs that need to be kept for later use.

The following fragment shows how to call a program named application.exe. Note you can use the ExecutablePath helper method to create absolute file paths.

The ExternalProcess class in the Cloud SDK provides useful helper logic for running your application executables. ExternalProcess can take care of cancellation, translating exit codes into exceptions, capturing standard out and standard error and setting up environment variables. You can also additionally use the .NET Process class directly to run your programs if you prefer.

Your RunExternalTaskProcess method returns a TaskProcessResult, which includes a list of output files. This must include at minimum all files required for the merge; you can also optionally return log files, preview files and intermediate files (e.g. for diagnostic purposes if the task failed).  Note that your method return the file paths, not the file content.

Each file must be identified with the type of output it contains: output (that is, part of the eventual job output), preview, log or intermediate.  These values come from the TaskOutputFileKind enumeration. The following fragment returns a single task output, and no preview or log. The TaskProcessResult.FromExternalProcessResult method simplifies the common scenario of capturing exit code, processor output and output files from a command line program:

The following code demonstrates a simple implementation of ParallelTaskProcessor.RunExternalTaskProcess.

	protected override TaskProcessResult RunExternalTaskProcess(
	    ITask task,
	    TaskExecutionSettings settings)
	{
	    var inputFile = LocalPath(task.RequiredFiles[0].Name);
	    var outputFile = LocalPath(task.TaskId.ToString() + ".jpg");
	 
	    var exePath = ExecutablePath(@"application\application.exe");
	    var arguments = String.Format("-in:{0} -out:{1}", inputFile, outputFile);
	 
	    var result = new ExternalProcess {
	        CommandPath = exePath,
	        Arguments = arguments,
	        WorkingDirectory = LocalStoragePath,
	        CancellationToken = settings.CancellationToken
	    }.Run();
	
	    return TaskProcessResult.FromExternalProcessResult(result, outputFile);
	}
####Implementing ParallelTaskProcessor.RunExternalMergeProcess

This is called for the merge task. It should invoke the application to combine outputs of the previous tasks, in whatever way is appropriate to your application and return the combined output. 

The implementation of RunExternalMergeProcess is very similar to RunExternalTaskProcess, except that:  

-	RunExternalMergeProcess consumes the outputs of previous tasks, rather than user input files. You should therefore work out the names of the files you want to process based on the task ID, rather than from the Task.RequiredFiles collection.
-	RunExternalMergeProcess returns a JobOutput file, and optionally a JobPreview file.


The following code demonstrates a simple implementation of ParallelTaskProcessor.RunExternalMergeProcess.

	protected override JobResult RunExternalMergeProcess(
	    ITask mergeTask,
	    TaskExecutionSettings settings)
	{
	    var outputFile =  "output.zip";
	 
	    var exePath =  ExecutablePath(@"application\application.exe");
	    var arguments = String.Format("a -application {0} *.jpg", outputFile);
	 
	    new ExternalProcess {
	        CommandPath = exePath,
	        Arguments = arguments,
	        WorkingDirectory = LocalStoragePath
	    }.Run();
	 
	    return new JobResult {
	        OutputFile = outputFile
	    };
	}

###Submitting Jobs to Batch Apps 
A job describes a workload to be run and needs to include all the information about the workload except for file content. For example, the job contains configuration settings which flow from the client through the job splitter and on to tasks. The samples provided on MSDN are examples of how to submit jobs and provide multiple clients including a web portal and a command line client. 
 

<!--Anchors-->


<!--Image references-->
[1]: ./media/batch-dotnet-get-started/batch-dotnet-get-started-01.jpg
[2]: ./media/batch-dotnet-get-started/batch-dotnet-get-started-02.jpg
[3]: ./media/batch-dotnet-get-started/batch-dotnet-get-started-03.jpg
[4]: ./media/batch-dotnet-get-started/batch-dotnet-get-started-04.jpg


