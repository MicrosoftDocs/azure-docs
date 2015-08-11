<properties
	pageTitle="Tutorial - Get Started with the Azure Batch .NET Library"
	description="Learn basic concepts about Azure Batch and how to develop for the Batch service with a simple scenario"
	services="batch"
	documentationCenter=".net"
	authors="yidingzhou"
	manager="timlt"
	editor=""/>

<tags
	ms.service="batch"
	ms.devlang="dotnet"
	ms.topic="hero-article"
	ms.tgt_pltfrm="na"
	ms.workload="big-compute"
	ms.date="07/21/2015"
	ms.author="yidingz"/>

# Get Started with the Azure Batch Library for .NET  

This tutorial shows you how to create a console application that sets up a program and support files that run on several compute nodes in a Azure Batch pool. The tasks that are created in this tutorial evaluate text from files in Azure storage and return the words that are most commonly used. The samples are written in C# code and use the Azure Batch .NET Library.

## Prerequisites

- The accounts:

	- **Azure account** - You can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/).

	- **Batch account** - See the **Batch Account** section of [Azure Batch technical overview](batch-technical-overview.md).

	- **Storage account** - See the **Create a storage account** section of [About Azure Storage Accounts](../storage-create-storage-account.md). In this tutorial, you create a container in this account named **testcon1**.

- A Visual Studio console application project:

	1.  Open Visual Studio, on the **File** menu, click **New**, and then click **Project**.

	2.	From **Windows**, under **Visual C#**, click **Console Application**, name the project **GettingStarted**, name the solution **AzureBatch**, and then click **OK**.

- The NuGet assemblies:

	1. After you create your project in Visual Studio, right-click the project in **Solution Explorer** and choose **Manage NuGet Packages**. Search online for **Azure.Batch** and then click **Install** to install the Microsoft Azure Batch package and dependencies.

	2. Search online for **WindowsAzure.Storage** and then click **Install** to install the Azure Storage package and dependencies.

## Step 1: Create and upload the support files

To support the application, a container is created in Azure Storage, the text files are created, and then the text files and support files are uploaded to the container.

### Set up the storage connection string

1. Open the App.config file for the GettingStarted project, and then add the &lt;appSettings&gt; element to &lt;configuration&gt;.

		<?xml version="1.0" encoding="utf-8" ?>
		<configuration>
			<appSettings>
				<add key="StorageConnectionString" value="DefaultEndpointsProtocol=https;AccountName=[account-name];AccountKey=[account-key]"/>
			</appSettings>
		</configuration>

	Replace these values:

	- **[account-name]** - The name of the storage account that you previously created.

	- **[account-key]** - The primary key of the storage account. You can find the primary key from the Storage page in the Management Portal

2. Save the App.config file.

To learn more, see [Configuring Connection Strings](http://msdn.microsoft.com/library/windowsazure/ee758697.aspx).

### Create the storage container

1. Add these namespace declarations to the top of Program.cs in the GettingStarted project:

		using System.Configuration;
		using Microsoft.WindowsAzure.Storage;
		using Microsoft.WindowsAzure.Storage.Blob;

2. Add this method to the Program class that gets the storage connection string, creates the container, and sets permissions:

		static void CreateStorage()
		{
			// Get the storage connection string
			CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
				ConfigurationManager.AppSettings["StorageConnectionString"]);

			// Create the container
			CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
			CloudBlobContainer container = blobClient.GetContainerReference("testcon1");
			container.CreateIfNotExists();

			// Set permissions on the container
			BlobContainerPermissions containerPermissions = new BlobContainerPermissions();
			containerPermissions.PublicAccess = BlobContainerPublicAccessType.Blob;
			container.SetPermissions(containerPermissions);
			Console.WriteLine("Created the container. Press Enter to continue.");
			Console.ReadLine();
		}

3. Add this code to Main that calls the method that you just added:

		CreateStorage();

4. Save the Program.cs file.

	> [AZURE.NOTE] In a production environment, it is recommended that you use a shared access signature.

To learn more, see [How to use Blob storage from .NET](../storage-dotnet-how-to-use-blobs.md)

### Create the processing program

1. In Solution Explorer, create a new console application project named **ProcessTaskData**.

2. Add this code to Main that processes the text from the files:

		string blobName = args[0];
		Uri blobUri = new Uri(blobName);
		int numTopN = int.Parse(args[1]);

		CloudBlockBlob blob = new CloudBlockBlob(blobUri);
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

3. Save and build the ProcessTaskData project.

### Create the data files

1. In the GettingStarted project, create a new text file named **taskdata1**, copy the following text to it, and then save the file.

	You can use Azure Virtual Machines to provision on-demand, scalable compute infrastructure when you need flexible resources for your business needs. From the gallery, you can create virtual machines that run Windows, Linux, and enterprise applications such as SharePoint and SQL Server. Or, you can capture and use your own images to create customized virtual machines.

2. Create a new text file named **taskdata2**, copy the following text to it, and then save the file.

	Quickly deploy and manage powerful applications and services with Azure Cloud Services. Simply upload your application and Azure handles the deployment details - from provisioning and load balancing to health monitoring for continuous availability. Your application is backed by an industry leading 99.95% monthly SLA. You just focus on the application and not the infrastructure.

3. Create a new text file named **taskdata3**, copy the following text to it, and then save the file.

	Azure Web Sites provide a scalable, reliable, and easy-to-use environment for hosting web applications. Select from a range of frameworks and templates to create a web site in seconds. Use any tool or OS to develop your site with .NET, PHP, Node.js or Python. Choose from a variety of source control options including TFS, GitHub, and BitBucket to set up continuous integration and develop as a team. Expand your site functionality over time by leveraging additional Azure managed services like storage, CDN, and SQL Database.

### Upload the files to the container

1. Open the Program.cs file of the GettingStarted project, and then add this method that uploads the files:

		static void CreateFiles()
		{
		  privateCloudStorageAccount storageAccount = CloudStorageAccount.Parse(
			ConfigurationManager.AppSettings["StorageConnectionString"]);
		  CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
		  CloudBlobContainer container = blobClient.GetContainerReference("testcon1");
		  CloudBlockBlob taskData1 = container.GetBlockBlobReference("taskdata1");
		  CloudBlockBlob taskData2 = container.GetBlockBlobReference("taskdata2");
		  CloudBlockBlob taskData3 = container.GetBlockBlobReference("taskdata3");
	  	CloudBlockBlob dataprocessor = container.GetBlockBlobReference("ProcessTaskData.exe");
	  	CloudBlockBlob storageassembly =
			container.GetBlockBlobReference("Microsoft.WindowsAzure.Storage.dll");
		  taskData1.UploadFromFile("..\\..\\taskdata1.txt", FileMode.Open);
		  taskData2.UploadFromFile("..\\..\\taskdata2.txt", FileMode.Open);
	  	taskData3.UploadFromFile("..\\..\\taskdata3.txt", FileMode.Open);
		  dataprocessor.UploadFromFile("..\\..\\..\\ProcessTaskData\\bin\\debug\\ProcessTaskData.exe", FileMode.Open);
		  storageassembly.UploadFromFile("Microsoft.WindowsAzure.Storage.dll", FileMode.Open);
		  Console.WriteLine("Uploaded the files. Press Enter to continue.");
		  Console.ReadLine();
		}

2. Save the Program.cs file.

## Step 2. Add a pool to your account

A pool of compute nodes is the first set of resources that you must create when you want to run tasks.  

1.	Add these namespace declarations to the top of Program.cs in the GettingStarted project:

			using Microsoft.Azure.Batch;
			using Microsoft.Azure.Batch.Auth;
			using Microsoft.Azure.Batch.Common;

2. Add this code to Main that sets up the credentials for making calls to the Azure Batch service:

			BatchSharedKeyCredentials cred = new BatchSharedKeyCredentials("https://[account-name].[region].batch.azure.com", "[account-name]", "[account-key]");
			BatchClient client = BatchClient.Open(cred);

	Replace these values:

	- **[account-name]** with the name of the Batch account that you previously created.
	- **[region]** with the region where your account is located. See [Azure Regions](http://azure.microsoft.com/regions/) to discover the available regions.
	- **[account-key]** with the primary key of the Batch account.

3.	Add this method to the Program class that creates the pool:

			static void CreatePool(BatchClient client)
			{
			  CloudPool newPool = client.PoolOperations.CreatePool(
			    "testpool1",
			    "3",
			    "small",
			    3);
			  newPool.Commit();
			  Console.WriteLine("Created the pool. Press Enter to continue.");
			  Console.ReadLine();
		  	}

4. Add this code to Main that calls the method you just added:

		CreatePool(client);

5. Add this method to the Program class that lists the pools in the account. This helps you verify that your pool was created:

			static void ListPools(BatchClient client)
			{
				IPagedEnumerable<CloudPool> pools = client.PoolOperations.ListPools();
				foreach (CloudPool pool in pools)
				{
					Console.WriteLine("Pool name: " + pool.Id);
					Console.WriteLine("   Pool status: " + pool.State);
				}
				Console.WriteLine("Press enter to continue.");
				Console.ReadLine();
			}

6. Add this code to Main that calls the method you just added:

		ListPools(client);

7. Save the Program.cs file.

## Step 2: Add a job to an account

Create a job that is used to manage tasks that run in the pool. All tasks must be associated with a job.

1. Add this method to the Program class that creates the job:

		static CloudJob CreateJob (BatchClient client)
		{
			CloudJob newJob = client.JobOperations.CreateJob();
			newJob.Id = "testjob1";
			newJob.PoolInformation = new PoolInformation() { PoolId = "testpool1" };
			newJob.Commit();
			Console.WriteLine("Created the job. Press Enter to continue.");
			Console.ReadLine();

			return newJob;
		}

2. Add this code to Main that calls the method you just added:

		CreateJob(client);

3. Add this method to the Program class that lists the jobs in the account. This helps you verify that your job was created:

		static void ListJobs (BatchClient client)
		{
			IPagedEnumerable<CloudJob> jobs = client.JobOperations.ListJobs();
			foreach (CloudJob job in jobs)
			{
				Console.WriteLine("Job id: " + job.Id);
				Console.WriteLine("   Job status: " + job.State);
			}
			Console.WriteLine("Press Enter to continue.");
			Console.ReadLine();
		}

4. Add this code to Main that calls the method that you just added:

		ListJobs(client);

5. Save the Program.cs file.

## Step 3: Add tasks to the job

After the job is created, tasks can be added to it. Each task runs on a compute node and processes a text file. For this tutorial, you add three tasks to the job.

1. Add this method to the Program class that adds the three tasks to the job:

		static void AddTasks(BatchClient client)
		{
			CloudJob job = client.JobOperations.GetJob("testjob1");
			ResourceFile programFile = new ResourceFile(
				"https://[account-name].blob.azure.com/[]/ProcessTaskData.exe",
				"ProcessTaskData.exe");
      	  ResourceFile assemblyFile = new ResourceFile(
				"https://[account-name].blob.core.windows.net/testcon1/Microsoft.WindowsAzure.Storage.dll",
				"Microsoft.WindowsAzure.Storage.dll");
			for (int i = 1; i < 4; ++i)
			{
				string blobName = "taskdata" + i;
				string taskName = "mytask" + i;
				ResourceFile taskData = new ResourceFile("https://[account-name].blob.core.windows.net/testcon1/" +
				  blobName, blobName);
				CloudTask task = new CloudTask(taskName, "ProcessTaskData.exe https://[account-name].blob.core.windows.net/testcon1/" +
				  blobName + " 3");
				List<ResourceFile> taskFiles = new List<ResourceFile>();
				taskFiles.Add(taskData);
				taskFiles.Add(programFile);
				taskFiles.Add(assemblyFile);
				task.ResourceFiles = taskFiles;
				job.AddTask(task);
				job.Commit();
				job.Refresh();
			}

			client.Utilities.CreateTaskStateMonitor().WaitAll(job.ListTasks(),
        TaskState.Completed, new TimeSpan(0, 30, 0));
			Console.WriteLine("The tasks completed successfully.");
			foreach (CloudTask task in job.ListTasks())
			{
				Console.WriteLine("Task " + task.Id + " says:\n" + task.GetNodeFile(Constants.StandardOutFileName).ReadAsString());
			}
			Console.WriteLine("Press Enter to continue.");
			Console.ReadLine();
		}

	**[account-name]** needs to be replaced with the name of the storage account that you previously created. Make sure you get all four places.

2. Add this code to Main that calls the method you just added:

			AddTasks(client);

3. Add this method to the Program class that lists the tasks that are associated with the job:

		static void ListTasks(BatchClient client)
		{
			IPagedEnumerable<CloudTask> tasks = client.JobOperations.ListTasks("testjob1");
			foreach (CloudTask task in tasks)
			{
				Console.WriteLine("Task id: " + task.Id);
				Console.WriteLine("   Task status: " + task.State);
			  Console.WriteLine("   Task start: " + task.ExecutionInformation.StartTime);
			}
			Console.ReadLine();
		}

4. Add this code to Main to call the method that you just added:

		ListTasks(client);

5. Save the Program.cs file.

## Step 4: Delete the resources

Because you are charged for resources in Azure, it is always a good idea to delete resources if you no longer need them.

### Delete the tasks

1.	Add this method to the Program class that deletes the tasks:

			static void DeleteTasks(BatchClient client)
			{
				CloudJob job = client.JobOperations.GetJob("testjob1");
				foreach (CloudTask task in job.ListTasks())
				{
					task.Delete();
				}
				Console.WriteLine("All tasks deleted.");
				Console.ReadLine();
			}

2. Add this code to Main that call the method that you just added:

		DeleteTasks(client);

3. Save the Program.cs file.

### Delete the job

1.	Add this method to the Program class that deletes the job:

			static void DeleteJob(BatchClient client)
			{
				client.JobOperations.DeleteJob("testjob1");
				Console.WriteLine("Job was deleted.");
				Console.ReadLine();
			}

2. Add this code to Main that runs the method that you just added:

		DeleteJob(client);

3. Save the Program.cs file.

### Delete the pool

1. Add this method to the Program class that delete the pool:

		static void DeletePool (BatchClient client)
		{
			client.PoolOperations.DeletePool("testpool1");
			Console.WriteLine("Pool was deleted.");
			Console.ReadLine();
		}

2. Add this code to Main that runs the method that you just added:

		DeletePool(client);

3. Save the Program.cs file.

## Step 5: Run the application

1. Start the GettingStarted project, and you should see this in the console window after the container is created:

		Created the container. Press Enter to continue.

2. Press Enter and the files are created and uploaded, you should now see a new line in the window:

		Uploaded the files. Press Enter to continue.

3. Press Enter and the pool is created:

		Created the pool. Press Enter to continue.

4. Press Enter and you should see this listing of the new pool:

		Pool name: testpool1
			Pool status: Active
		Press Enter to continue.

5. Press Enter and the job is created:

		Created the job. Press Enter to continue.

6. Press Enter and you should see this listing of the new job:

		Job id: testjob1
			Job status: Active
		Press Enter to continue.

7. Press Enter and the tasks are added to the job. When the tasks are added, they automatically run:

		The tasks completed successfully.
		Task mytask1 says:
		can 3
		you 3
		and 3

		Task mytask2 says:
		and 5
		application 3
		the 3

		Task mytask3 says:
		a 5
		and 5
		to 3

		Press Enter to continue.

7. Press Enter and you should see the list of tasks and their status:

		Task id: mytask1
			Task status: Completed
			Task start: 7/17/2015 8:31:58 PM
		Task id: mytask2
			Task status: Completed
			Task start: 7/17/2015 8:31:57 PM
		Task id: mytask3
			Task status: Completed
			Task start: 7/17/2015 8:31:57 PM

8. At this point you can go into the Azure Portal to look at the resources that were created. To delete the resources, press Enter until the program finishes.

## Next Steps

1. Now that you learned the basics of running tasks, you can learn about how to automatically scale compute nodes when the demand for your application changes. To do this, see [Automatically Scale Compute Nodes in an Azure Batch Pool](batch-automatic-scaling.md)

2. Some applications produce large amounts of data that can be difficult to process. One way to solve this is through [efficient list querying](batch-efficient-list-queries.md).
