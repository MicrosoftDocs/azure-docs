<properties
	pageTitle="Tutorial - Get started with the Azure Batch .NET library | Microsoft Azure"
	description="Learn the basic concepts of Azure Batch and how to develop for the Batch service with a simple scenario"
	services="batch"
	documentationCenter=".net"
	authors="mmacy"
	manager="timlt"
	editor=""/>

<tags
	ms.service="batch"
	ms.devlang="dotnet"
	ms.topic="hero-article"
	ms.tgt_pltfrm="na"
	ms.workload="big-compute"
	ms.date="06/16/2016"
	ms.author="marsma"/>

# Get started with the Azure Batch library for .NET

> [AZURE.SELECTOR]
- [.NET](batch-dotnet-get-started.md)
- [Python](batch-python-tutorial.md)

Learn the basics of [Azure Batch][azure_batch] and the [Batch .NET][net_api] library in this article as we discuss a C# sample application step by step. We'll look at how this sample application leverages the Batch service to process a parallel workload in the cloud, as well as how it interacts with [Azure Storage](../storage/storage-introduction.md) for file staging and retrieval. You'll learn common Batch application workflow techniques. You'll also gain a base understanding of the major components of Batch, such as jobs, tasks, pools, and compute nodes.

![Batch solution workflow (basic)][11]<br/>

## Prerequisites

This article assumes that you have a working knowledge of C# and Visual Studio. It also assumes that you're able to satisfy the account creation requirements that are specified below for Azure and the Batch and Storage services.

### Accounts

- **Azure account**: If you don't already have an Azure subscription, [create a free Azure account][azure_free_account].
- **Batch account**: Once you have an Azure subscription, [create an Azure Batch account](batch-account-create-portal.md).
- **Storage account**: See [Create a storage account](../storage/storage-create-storage-account.md#create-a-storage-account) in [About Azure storage accounts](../storage/storage-create-storage-account.md).

> [AZURE.IMPORTANT] Batch currently supports *only* the **General purpose** storage account type, as described in step #5 [Create a storage account](../storage/storage-create-storage-account.md#create-a-storage-account) in [About Azure storage accounts](../storage/storage-create-storage-account.md).

### Visual Studio

You must have **Visual Studio 2015** to build the sample project. You can find free and trial versions of Visual Studio in the [overview of Visual Studio 2015 products][visual_studio].

### *DotNetTutorial* code sample

The [DotNetTutorial][github_dotnettutorial] sample is one of the many code samples found in the [azure-batch-samples][github_samples] repository on GitHub. You can download the sample by clicking the **Download ZIP** button on the repository home page, or by clicking the [azure-batch-samples-master.zip][github_samples_zip] direct download link. Once you've extracted the contents of the ZIP file, you will find the solution in the following folder:

`\azure-batch-samples\CSharp\ArticleProjects\DotNetTutorial`

## DotNetTutorial sample project overview

The *DotNetTutorial* code sample is a Visual Studio 2015 solution that consists of two projects: **DotNetTutorial** and **TaskApplication**.

- **DotNetTutorial** is the client application that interacts with the Batch and Storage services to execute a parallel workload on compute nodes (virtual machines). DotNetTutorial runs on your local workstation.

- **TaskApplication** is the program that runs on compute nodes in Azure to perform the actual work. In the sample, `TaskApplication.exe` parses the text in a file downloaded from Azure Storage (the input file). Then it produces a text file (the output file) that contains a list of the top three words that appear in the input file. After it creates the output file, TaskApplication uploads the file to Azure Storage. This makes it available to the client application for download. TaskApplication runs in parallel on multiple compute nodes in the Batch service.

The following diagram illustrates the primary operations that are performed by the client application, *DotNetTutorial*, and the application that is executed by the tasks, *TaskApplication*. This basic workflow is typical of many compute solutions that are created with Batch. While it does not demonstrate every feature available in the Batch service, nearly every Batch scenario will include similar processes.

![Batch example workflow][8]<br/>

[**Step 1.**](#step-1-create-storage-containers) Create **containers** in Azure Blob Storage.<br/>
[**Step 2.**](#step-2-upload-task-application-and-data-files) Upload task application files and input files to containers.<br/>
[**Step 3.**](#step-3-create-batch-pool) Create a Batch **pool**.<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;**3a.** The pool **StartTask** downloads the task binary files (TaskApplication) to nodes as they join the pool.<br/>
[**Step 4.**](#step-4-create-batch-job) Create a Batch **job**.<br/>
[**Step 5.**](#step-5-add-tasks-to-job) Add **tasks** to the job.<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;**5a.** The tasks are scheduled to execute on nodes.<br/>
	&nbsp;&nbsp;&nbsp;&nbsp;**5b.** Each task downloads its input data from Azure Storage, then begins execution.<br/>
[**Step 6.**](#step-6-monitor-tasks) Monitor tasks.<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;**6a.** As tasks are completed, they upload their output data to Azure Storage.<br/>
[**Step 7.**](#step-7-download-task-output) Download task output from Storage.

As mentioned, not every Batch solution will perform these exact steps, and may include many more, but the *DotNetTutorial* sample application demonstrates common processes found in a Batch solution.

## Build the *DotNetTutorial* sample project

Before you can successfully run the sample, you must specify both Batch and Storage account credentials in the *DotNetTutorial* project's `Program.cs` file. If you have not done so already, open the solution in Visual Studio by double-clicking on the `DotNetTutorial.sln` solution file. Or open it from within Visual Studio by using the **File > Open > Project/Solution** menu.

Open `Program.cs` within the *DotNetTutorial* project. Then add your credentials as specified near the top of the file:

```
// Update the Batch and Storage account credential strings below with the values
// unique to your accounts. These are used when constructing connection strings
// for the Batch and Storage client objects.

// Batch account credentials
private const string BatchAccountName = "";
private const string BatchAccountKey  = "";
private const string BatchAccountUrl  = "";

// Storage account credentials
private const string StorageAccountName = "";
private const string StorageAccountKey  = "";
```

> [AZURE.IMPORTANT] As mentioned above, you must currently specify the credentials for a **General purpose** storage account in Azure Storage. Your Batch applications will use blob storage within the **General purpose** storage account. Do not specify the credentials for a Storage account that was created by selecting the *Blob storage* account type.

You can find your Batch and Storage account credentials within the account blade of each service in the [Azure portal][azure_portal]:

![Batch credentials in the portal][9]
![Storage credentials in the portal][10]<br/>

Now that you've updated the project with your credentials, right-click the solution in Solution Explorer and click **Build Solution**. Confirm the restoration of any NuGet packages, if you're prompted.

> [AZURE.TIP] If the NuGet packages are not automatically restored, or if you see errors about a failure to restore the packages, ensure that you have the [NuGet Package Manager][nuget_packagemgr] installed. Then enable the download of missing packages. See [Enabling Package Restore During Build][nuget_restore] to enable package download.

In the following sections, we break down the sample application into the steps that it performs to process a workload in the Batch service, and discuss those steps in detail. We encourage you to refer to the open solution in Visual Studio while you work your way through the rest of this article, since not every line of code in the sample is discussed.

Navigate to the top of the `MainAsync` method in the *DotNetTutorial* project's `Program.cs` file to start with Step 1. Each step below then roughly follows the progression of method calls in `MainAsync`.

## Step 1: Create Storage containers

![Create containers in Azure Storage][1]
<br/>

Batch includes built-in support for interacting with Azure Storage. Containers in your Storage account will provide the files needed by the tasks that run in your Batch account. The containers also provide a place to store the output data that the tasks produce. The first thing the *DotNetTutorial* client application does is create three containers in [Azure Blob Storage](../storage/storage-introduction.md):

- **application**: This container will store the application run by the tasks, as well as any of its dependencies, such as DLLs.
- **input**: Tasks will download the data files to process from the *input* container.
- **output**: When tasks complete input file processing, they will upload the results to the *output* container.

In order to interact with a Storage account and create containers, we use the [Azure Storage Client Library for .NET][net_api_storage]. We create a reference to the account with [CloudStorageAccount][net_cloudstorageaccount], and from that create a [CloudBlobClient][net_cloudblobclient]:

```
// Construct the Storage account connection string
string storageConnectionString = String.Format(
    "DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1}",
    StorageAccountName,
    StorageAccountKey);

// Retrieve the storage account
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(storageConnectionString);

// Create the blob client, for use in obtaining references to blob storage containers
CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
```

We use the `blobClient` reference throughout the application and pass it as a parameter to a number of methods. An example of this is in the code block that immediately follows the above, where we call `CreateContainerIfNotExistAsync` to actually create the containers.

```
// Use the blob client to create the containers in Azure Storage if they don't
// yet exist
const string appContainerName    = "application";
const string inputContainerName  = "input";
const string outputContainerName = "output";
await CreateContainerIfNotExistAsync(blobClient, appContainerName);
await CreateContainerIfNotExistAsync(blobClient, inputContainerName);
await CreateContainerIfNotExistAsync(blobClient, outputContainerName);
```

```
private static async Task CreateContainerIfNotExistAsync(
    CloudBlobClient blobClient,
    string containerName)
{
		CloudBlobContainer container = blobClient.GetContainerReference(containerName);

		if (await container.CreateIfNotExistsAsync())
		{
				Console.WriteLine("Container [{0}] created.", containerName);
		}
		else
		{
				Console.WriteLine("Container [{0}] exists, skipping creation.",
                    containerName);
		}
}
```

Once the containers have been created, the application can now upload the files that will be used by the tasks.

> [AZURE.TIP] [How to use Blob Storage from .NET](../storage/storage-dotnet-how-to-use-blobs.md) provides a good overview of working with Azure Storage containers and blobs. It should be near the top of your reading list as you start working with Batch.

## Step 2: Upload task application and data files

![Upload task application and input (data) files to containers][2]
<br/>

In the file upload operation, *DotNetTutorial* first defines collections of **application** and **input** file paths as they exist on the local machine. Then it uploads these files to the containers that you created in the previous step.

```
// Paths to the executable and its dependencies that will be executed by the tasks
List<string> applicationFilePaths = new List<string>
{
    // The DotNetTutorial project includes a project reference to TaskApplication,
    // allowing us to determine the path of the task application binary dynamically
    typeof(TaskApplication.Program).Assembly.Location,
    "Microsoft.WindowsAzure.Storage.dll"
};

// The collection of data files that are to be processed by the tasks
List<string> inputFilePaths = new List<string>
{
    @"..\..\taskdata1.txt",
    @"..\..\taskdata2.txt",
    @"..\..\taskdata3.txt"
};

// Upload the application and its dependencies to Azure Storage. This is the
// application that will process the data files, and will be executed by each
// of the tasks on the compute nodes.
List<ResourceFile> applicationFiles = await UploadFilesToContainerAsync(
    blobClient,
    appContainerName,
    applicationFilePaths);

// Upload the data files. This is the data that will be processed by each of
// the tasks that are executed on the compute nodes within the pool.
List<ResourceFile> inputFiles = await UploadFilesToContainerAsync(
    blobClient,
    inputContainerName,
    inputFilePaths);
```

There are two methods in `Program.cs` that are involved in the upload process:

- `UploadFilesToContainerAsync`: This method returns a collection of [ResourceFile][net_resourcefile] objects (discussed below) and internally calls `UploadFileToContainerAsync` to upload each file that is passed in the *filePaths* parameter.
- `UploadFileToContainerAsync`: This is the method that actually performs the file upload and creates the [ResourceFile][net_resourcefile] objects. After uploading the file, it obtains a shared access signature (SAS) for the file and returns a ResourceFile object that represents it. Shared access signatures are also discussed below.

```
private static async Task<ResourceFile> UploadFileToContainerAsync(
    CloudBlobClient blobClient,
    string containerName,
    string filePath)
{
		Console.WriteLine(
            "Uploading file {0} to container [{1}]...", filePath, containerName);

		string blobName = Path.GetFileName(filePath);

		CloudBlobContainer container = blobClient.GetContainerReference(containerName);
		CloudBlockBlob blobData = container.GetBlockBlobReference(blobName);
		await blobData.UploadFromFileAsync(filePath, FileMode.Open);

		// Set the expiry time and permissions for the blob shared access signature.
        // In this case, no start time is specified, so the shared access signature
        // becomes valid immediately
		SharedAccessBlobPolicy sasConstraints = new SharedAccessBlobPolicy
		{
				SharedAccessExpiryTime = DateTime.UtcNow.AddHours(2),
				Permissions = SharedAccessBlobPermissions.Read
		};

		// Construct the SAS URL for blob
		string sasBlobToken = blobData.GetSharedAccessSignature(sasConstraints);
		string blobSasUri = String.Format("{0}{1}", blobData.Uri, sasBlobToken);

		return new ResourceFile(blobSasUri, blobName);
}
```

### ResourceFiles

A [ResourceFile][net_resourcefile] provides tasks in Batch with the URL to a file in Azure Storage that will be downloaded to a compute node before that task is run. The [ResourceFile.BlobSource][net_resourcefile_blobsource] property specifies the full URL of the file as it exists in Azure Storage. The URL may also include a shared access signature (SAS) that provides secure access to the file. Most tasks types within Batch .NET include a *ResourceFiles* property, including:

- [CloudTask][net_task]
- [StartTask][net_pool_starttask]
- [JobPreparationTask][net_jobpreptask]
- [JobReleaseTask][net_jobreltask]

The DotNetTutorial sample application does not use the JobPreparationTask or JobReleaseTask task types, but you can read more about them in [Run job preparation and completion tasks on Azure Batch compute nodes](batch-job-prep-release.md).

### Shared access signature (SAS)

Shared access signatures are strings which—when included as part of a URL—provide secure access to containers and blobs in Azure Storage. The DotNetTutorial application uses both blob and container shared access signature URLs, and demonstrates how to obtain these shared access signature strings from the Storage service.

- **Blob shared access signatures**: The pool's StartTask in DotNetTutorial uses blob shared access signatures when it downloads the application binaries and input data files from Storage (see Step #3 below). The `UploadFileToContainerAsync` method in DotNetTutorial's `Program.cs` contains the code that obtains each blob's shared access signature. It does so by calling [CloudBlob.GetSharedAccessSignature][net_sas_blob].

- **Container shared access signatures**: As each task finishes its work on the compute node, it uploads its output file to the *output* container in Azure Storage. To do so, TaskApplication uses a container shared access signature that provides write access to the container as part of the path when it uploads the file. Obtaining the container shared access signature is done in a similar fashion as when obtaining the blob shared access signature. In DotNetTutorial, you will find that the `GetContainerSasUrl` helper method calls [CloudBlobContainer.GetSharedAccessSignature][net_sas_container] to do so. You'll read more about how TaskApplication uses the container shared access signature in "Step 6: Monitor Tasks."

> [AZURE.TIP] Check out the two-part series on shared access signatures, [Part 1: Understanding the shared access signature (SAS) model](../storage/storage-dotnet-shared-access-signature-part-1.md) and [Part 2: Create and use a shared access signature (SAS) with Blob storage](../storage/storage-dotnet-shared-access-signature-part-2.md), to learn more about providing secure access to data in your Storage account.

## Step 3: Create Batch pool

![Create a Batch pool][3]
<br/>

After it uploads the application and data files to the Storage account, *DotNetTutorial* starts its interaction with the Batch service by using the Batch .NET library. To do so, a [BatchClient][net_batchclient] is first created:

```
BatchSharedKeyCredentials cred = new BatchSharedKeyCredentials(
    BatchAccountUrl,
    BatchAccountName,
    BatchAccountKey);

using (BatchClient batchClient = BatchClient.Open(cred))
{
	...
```

Next, a pool of compute nodes is created in the Batch account with a call to `CreatePoolAsync`. `CreatePoolAsync` uses the [BatchClient.PoolOperations.CreatePool][net_pool_create] method to actually create a pool in the Batch service.

```
private static async Task CreatePoolAsync(
    BatchClient batchClient,
    string poolId,
    IList<ResourceFile> resourceFiles)
{
    Console.WriteLine("Creating pool [{0}]...", poolId);

    // Create the unbound pool. Until we call CloudPool.Commit() or CommitAsync(),
    // no pool is actually created in the Batch service. This CloudPool instance is
    // therefore considered "unbound," and we can modify its properties.
    CloudPool pool = batchClient.PoolOperations.CreatePool(
			poolId: poolId,
			targetDedicated: 3,           // 3 compute nodes
			virtualMachineSize: "small",  // single-core, 1.75 GB memory, 224 GB disk
			cloudServiceConfiguration:
			    new CloudServiceConfiguration(osFamily: "4")); // Win Server 2012 R2

    // Create and assign the StartTask that will be executed when compute nodes join
    // the pool. In this case, we copy the StartTask's resource files (that will be
    // automatically downloaded to the node by the StartTask) into the shared
    // directory that all tasks will have access to.
    pool.StartTask = new StartTask
    {
        // Specify a command line for the StartTask that copies the task application
        // files to the node's shared directory. Every compute node in a Batch pool
        // is configured with several pre-defined environment variables that you can
        // reference by using commands or applications run by tasks.

        // Since a successful execution of robocopy can return a non-zero exit code
        // (e.g. 1 when one or more files were successfully copied) we need to
        // manually exit with a 0 for Batch to recognize StartTask execution success.
        CommandLine = "cmd /c (robocopy %AZ_BATCH_TASK_WORKING_DIR% %AZ_BATCH_NODE_SHARED_DIR%) ^& IF %ERRORLEVEL% LEQ 1 exit 0",
        ResourceFiles = resourceFiles,
        WaitForSuccess = true
    };

    await pool.CommitAsync();
}
```

When you create a pool with [CreatePool][net_pool_create], you specify a number of parameters such as the number of compute nodes, the [size of the nodes](../cloud-services/cloud-services-sizes-specs.md), and the nodes' operating system. In *DotNetTutorial*, we use [CloudServiceConfiguration][net_cloudserviceconfiguration] to specify Windows Server 2012 R2 from [Cloud Services](../cloud-services/cloud-services-guestos-update-matrix.md). However, by specifying a [VirtualMachineConfiguration][net_virtualmachineconfiguration] instead, you can create pools of nodes created from Marketplace images, which includes both Windows and Linux images—see [Provision Linux compute nodes in Azure Batch pools](batch-linux-nodes.md) for more information.

> [AZURE.IMPORTANT] You are charged for compute resources in Batch. To minimize costs, you can lower `targetDedicated` to 1 before you run the sample.

Along with these physical node properties, you may also specify a [StartTask][net_pool_starttask] for the pool. The StartTask will execute on each node as that node joins the pool, as well as each time a node is restarted. The StartTask is especially useful for installing applications on compute nodes prior to the execution of tasks. For example, if your tasks process data by using Python scripts, you could use a StartTask to install Python on the compute nodes.

In this sample application, the StartTask copies the files that it downloads from Storage (which are specified by using the [StartTask][net_starttask].[ResourceFiles][net_starttask_resourcefiles] property) from the StartTask working directory to the shared directory that *all* tasks running on the node can access. Essentially, this copies `TaskApplication.exe` and its dependencies to the shared directory on each node as the node joins the pool, so that any tasks that run on the node can access it.

> [AZURE.TIP] The **application packages** feature of Azure Batch provides another way to get your application onto the compute nodes in a pool. See [Application deployment with Azure Batch application packages](batch-application-packages.md) for details.

Also notable in the code snippet above is the use of two environment variables in the *CommandLine* property of the StartTask: `%AZ_BATCH_TASK_WORKING_DIR%` and `%AZ_BATCH_NODE_SHARED_DIR%`. Each compute node within a Batch pool is automatically configured with a number of environment variables that are specific to Batch. Any process that is executed by a task has access to these environment variables.

> [AZURE.TIP] To find out more about the environment variables that are available on compute nodes in a Batch pool, as well as information on task working directories, see the [Environment settings for tasks](batch-api-basics.md#environment-settings-for-tasks) and [Files and directories](batch-api-basics.md#files-and-directories) sections in the [Batch feature overview for developers](batch-api-basics.md).

## Step 4: Create Batch job

![Create Batch job][4]<br/>

A Batch job is essentially a collection of tasks that are associated with a pool of compute nodes. You can use it not only for organizing and tracking tasks in related workloads, but also for imposing certain constraints—such as the maximum runtime for the job (and by extension, its tasks), as well as job priority in relation to other jobs in the Batch account. In this example, however, the job is associated only with the pool that was created in step #3. No additional properties are configured.

All Batch jobs are associated with a specific pool. This association indicates which nodes the job's tasks will execute on. You specify this by using the [CloudJob.PoolInformation][net_job_poolinfo] property, as shown in the code snippet below.

```
private static async Task CreateJobAsync(
    BatchClient batchClient,
    string jobId,
    string poolId)
{
    Console.WriteLine("Creating job [{0}]...", jobId);

    CloudJob job = batchClient.JobOperations.CreateJob();
    job.Id = jobId;
    job.PoolInformation = new PoolInformation { PoolId = poolId };

    await job.CommitAsync();
}
```

Now that a job has been created, tasks are added to perform the work.

## Step 5: Add tasks to job

![Add tasks to job][5]<br/>
*(1) Tasks are added to the job, (2) the tasks are scheduled to run on nodes, and (3) the tasks download the data files to process*

To actually perform work, tasks must be added to a job. Each [CloudTask][net_task] is configured by using a command-line property and [ResourceFiles][net_task_resourcefiles] (as with the pool's StartTask) that the task downloads to the node before its command line is automatically executed. In the *DotNetTutorial* sample project, each task processes only one file. Thus, its ResourceFiles collection contains a single element.

```
private static async Task<List<CloudTask>> AddTasksAsync(
    BatchClient batchClient,
    string jobId,
    List<ResourceFile> inputFiles,
    string outputContainerSasUrl)
{
    Console.WriteLine("Adding {0} tasks to job [{1}]...", inputFiles.Count, jobId);

    // Create a collection to hold the tasks that we'll be adding to the job
    List<CloudTask> tasks = new List<CloudTask>();

    // Create each of the tasks. Because we copied the task application to the
    // node's shared directory with the pool's StartTask, we can access it via
    // the shared directory on the node that the task runs on.
    foreach (ResourceFile inputFile in inputFiles)
    {
        string taskId = "topNtask" + inputFiles.IndexOf(inputFile);
        string taskCommandLine = String.Format(
            "cmd /c %AZ_BATCH_NODE_SHARED_DIR%\\TaskApplication.exe {0} 3 \"{1}\"",
            inputFile.FilePath,
            outputContainerSasUrl);

        CloudTask task = new CloudTask(taskId, taskCommandLine);
        task.ResourceFiles = new List<ResourceFile> { inputFile };
        tasks.Add(task);
    }

    // Add the tasks as a collection, as opposed to issuing a separate AddTask call
    // for each. Bulk task submission helps to ensure efficient underlying API calls
    // to the Batch service.
    await batchClient.JobOperations.AddTaskAsync(jobId, tasks);

    return tasks;
}
```

> [AZURE.IMPORTANT] When they access environment variables such as `%AZ_BATCH_NODE_SHARED_DIR%` or execute an application not found in the node's `PATH`, task command lines must be prefixed with `cmd /c`. This will explicitly execute the command interpreter and instruct it to terminate after carrying out your command. This requirement is unnecessary if your tasks execute an application in the node's `PATH` (such as *robocopy.exe* or *powershell.exe*) and no environment variables are used.

Within the `foreach` loop in the code snippet above, you can see that the command line for the task is constructed such that three command-line arguments are passed to *TaskApplication.exe*:

1. The **first argument** is the path of the file to process. This is the local path to the file as it exists on the node. When the ResourceFile object in `UploadFileToContainerAsync` was first created above, the file name was used for this property (as a parameter to the ResourceFile constructor). This indicates that the file can be found in the same directory as *TaskApplication.exe*.

2. The **second argument** specifies that the top *N* words should be written to the output file. In the sample, this is hard-coded so that the top three words will be written to the output file.

3. The **third argument** is the shared access signature (SAS) that provides write access to the **output** container in Azure Storage. *TaskApplication.exe* uses this shared access signature URL when it uploads the output file to Azure Storage. You can find the code for this in the `UploadFileToContainer` method in the TaskApplication project's `Program.cs` file:

```
// NOTE: From project TaskApplication Program.cs

private static void UploadFileToContainer(string filePath, string containerSas)
{
		string blobName = Path.GetFileName(filePath);

		// Obtain a reference to the container using the SAS URI.
		CloudBlobContainer container = new CloudBlobContainer(new Uri(containerSas));

		// Upload the file (as a new blob) to the container
		try
		{
				CloudBlockBlob blob = container.GetBlockBlobReference(blobName);
				blob.UploadFromFile(filePath, FileMode.Open);

				Console.WriteLine("Write operation succeeded for SAS URL " + containerSas);
				Console.WriteLine();
		}
		catch (StorageException e)
		{

				Console.WriteLine("Write operation failed for SAS URL " + containerSas);
				Console.WriteLine("Additional error information: " + e.Message);
				Console.WriteLine();

				// Indicate that a failure has occurred so that when the Batch service
                // sets the CloudTask.ExecutionInformation.ExitCode for the task that
                // executed this application, it properly indicates that there was a
                // problem with the task.
				Environment.ExitCode = -1;
		}
}
```

## Step 6: Monitor tasks

![Monitor tasks][6]<br/>
*The client application (1) monitors the tasks for completion and success status, and (2) the tasks upload result data to Azure Storage*

When tasks are added to a job, they are automatically queued and scheduled for execution on compute nodes within the pool associated with the job. Based on the settings you specify, Batch handles all task queuing, scheduling, retrying, and other task administration duties for you. There are many approaches to monitoring task execution. DotNetTutorial shows a simple example that reports only on completion and task failure or success states.

Within the `MonitorTasks` method in DotNetTutorial's `Program.cs`, there are three Batch .NET concepts that warrant discussion. They are listed below in their order of appearance:

1. **ODATADetailLevel**: Specifying [ODATADetailLevel][net_odatadetaillevel] in list operations (such as obtaining a list of a job's tasks) is essential in ensuring Batch application performance. Add [Query the Azure Batch service efficiently](batch-efficient-list-queries.md) to your reading list if you plan on doing any sort of status monitoring within your Batch applications.

2. **TaskStateMonitor**: [TaskStateMonitor][net_taskstatemonitor] provides Batch .NET applications with helper utilities for monitoring task states. In `MonitorTasks`, *DotNetTutorial* waits for all tasks to reach [TaskState.Completed][net_taskstate] within a time limit. Then it terminates the job.

3. **TerminateJobAsync**: Terminating a job with [JobOperations.TerminateJobAsync][net_joboperations_terminatejob] (or the blocking JobOperations.TerminateJob) will mark that job as completed. It is essential to do so if your Batch solution uses a [JobReleaseTask][net_jobreltask]. This is a special type of task, which is described in [Job preparation and completion tasks](batch-job-prep-release.md).

The `MonitorTasks` method from *DotNetTutorial*'s `Program.cs` appears below:

```
private static async Task<bool> MonitorTasks(
    BatchClient batchClient,
    string jobId,
    TimeSpan timeout)
{
    bool allTasksSuccessful = true;
    const string successMessage = "All tasks reached state Completed.";
    const string failureMessage = "One or more tasks failed to reach the Completed state within the timeout period.";

    // Obtain the collection of tasks currently managed by the job. Note that we use
    // a detail level to specify that only the "id" property of each task should be
    // populated. Using a detail level for all list operations helps to lower
    // response time from the Batch service.
    ODATADetailLevel detail = new ODATADetailLevel(selectClause: "id");
    List<CloudTask> tasks =
        await batchClient.JobOperations.ListTasks(JobId, detail).ToListAsync();

    Console.WriteLine("Awaiting task completion, timeout in {0}...", timeout.ToString());

    // We use a TaskStateMonitor to monitor the state of our tasks. In this case, we
    // will wait for all tasks to reach the Completed state.
    TaskStateMonitor taskStateMonitor = batchClient.Utilities.CreateTaskStateMonitor();
    bool timedOut = await taskStateMonitor.WaitAllAsync(
        tasks,
        TaskState.Completed,
        timeout);

    if (timedOut)
    {
        allTasksSuccessful = false;

        await batchClient.JobOperations.TerminateJobAsync(jobId, failureMessage);

        Console.WriteLine(failureMessage);
    }
    else
    {
        await batchClient.JobOperations.TerminateJobAsync(jobId, successMessage);

        // All tasks have reached the "Completed" state. However, this does not
        // guarantee that all tasks were completed successfully. Here we further
        // check each task's ExecutionInfo property to ensure that it did not
        // encounter a scheduling error or return a non-zero exit code.

        // Update the detail level to populate only the task id and executionInfo
        // properties. We refresh the tasks below, and need only this information
        // for each task.
        detail.SelectClause = "id, executionInfo";

        foreach (CloudTask task in tasks)
        {
            // Populate the task's properties with the latest info from the Batch service
            await task.RefreshAsync(detail);

            if (task.ExecutionInformation.SchedulingError != null)
            {
                // A scheduling error indicates a problem starting the task on the
                // node. It is important to note that the task's state can be
                // "Completed," yet the task still might have encountered a
                // scheduling error.

                allTasksSuccessful = false;

                Console.WriteLine(
                    "WARNING: Task [{0}] encountered a scheduling error: {1}",
                    task.Id,
                    task.ExecutionInformation.SchedulingError.Message);
            }
            else if (task.ExecutionInformation.ExitCode != 0)
            {
                // A non-zero exit code may indicate that the application executed by
                // the task encountered an error during execution. As not every
                // application returns non-zero on failure by default (e.g. robocopy),
                // your implementation of error checking may differ from this example.

                allTasksSuccessful = false;

                Console.WriteLine("WARNING: Task [{0}] returned a non-zero exit code - this may indicate task execution or completion failure.", task.Id);
            }
        }
    }

    if (allTasksSuccessful)
    {
        Console.WriteLine("Success! All tasks completed successfully within the specified timeout period.");
    }

    return allTasksSuccessful;
}
```

## Step 7: Download task output

![Download task output from Storage][7]<br/>

Now that the job is completed, the output from the tasks can be downloaded from Azure Storage. This is done with a call to `DownloadBlobsFromContainerAsync` in *DotNetTutorial*'s `Program.cs`:

```
private static async Task DownloadBlobsFromContainerAsync(
    CloudBlobClient blobClient,
    string containerName,
    string directoryPath)
{
		Console.WriteLine("Downloading all files from container [{0}]...", containerName);

		// Retrieve a reference to a previously created container
		CloudBlobContainer container = blobClient.GetContainerReference(containerName);

		// Get a flat listing of all the block blobs in the specified container
		foreach (IListBlobItem item in container.ListBlobs(
                    prefix: null,
                    useFlatBlobListing: true))
		{
				// Retrieve reference to the current blob
				CloudBlob blob = (CloudBlob)item;

				// Save blob contents to a file in the specified folder
				string localOutputFile = Path.Combine(directoryPath, blob.Name);
				await blob.DownloadToFileAsync(localOutputFile, FileMode.Create);
		}

		Console.WriteLine("All files downloaded to {0}", directoryPath);
}
```

> [AZURE.NOTE] The call to `DownloadBlobsFromContainerAsync` in the *DotNetTutorial* application specifies that the files should be downloaded to your `%TEMP%` folder. Feel free to modify this output location.

## Step 8: Delete containers

Because you are charged for data that resides in Azure Storage, it is always a good idea to remove any blobs that are no longer needed for your Batch jobs. In DotNetTutorial's `Program.cs`, this is done with three calls to the helper method `DeleteContainerAsync`:

```
// Clean up Storage resources
await DeleteContainerAsync(blobClient, appContainerName);
await DeleteContainerAsync(blobClient, inputContainerName);
await DeleteContainerAsync(blobClient, outputContainerName);
```

The method itself merely obtains a reference to the container, and then calls [CloudBlobContainer.DeleteIfExistsAsync][net_container_delete]:

```
private static async Task DeleteContainerAsync(
    CloudBlobClient blobClient,
    string containerName)
{
    CloudBlobContainer container = blobClient.GetContainerReference(containerName);

    if (await container.DeleteIfExistsAsync())
    {
        Console.WriteLine("Container [{0}] deleted.", containerName);
    }
    else
    {
        Console.WriteLine("Container [{0}] does not exist, skipping deletion.",
            containerName);
    }
}
```

## Step 9: Delete the job and the pool

In the final step, the user is prompted to delete the job and the pool that were created by the DotNetTutorial application. Although you are not charged for jobs and tasks themselves, you *are* charged for compute nodes. Thus, we recommend that you allocate nodes only as needed. Deleting unused pools can be part of your maintenance process.

The BatchClient's [JobOperations][net_joboperations] and [PoolOperations][net_pooloperations] both have corresponding deletion methods, which are called if the user confirms deletion:

```
// Clean up the resources we've created in the Batch account if the user so chooses
Console.WriteLine();
Console.WriteLine("Delete job? [yes] no");
string response = Console.ReadLine().ToLower();
if (response != "n" && response != "no")
{
    await batchClient.JobOperations.DeleteJobAsync(JobId);
}

Console.WriteLine("Delete pool? [yes] no");
response = Console.ReadLine();
if (response != "n" && response != "no")
{
    await batchClient.PoolOperations.DeletePoolAsync(PoolId);
}
```

> [AZURE.IMPORTANT] Keep in mind that you are charged for compute resources—deleting unused pools will minimize cost. Also, be aware that deleting a pool deletes all compute nodes within that pool, and that any data on the nodes will be unrecoverable after the pool is deleted.

## Run the *DotNetTutorial* sample

When you run the sample application, the console output will be similar to the following. During execution, you will experience a pause at `Awaiting task completion, timeout in 00:30:00...` while the pool's compute nodes are started. Use the [Azure portal][azure_portal] to monitor your pool, compute nodes, job, and tasks during and after execution. Use the [Azure portal][azure_portal] or the [Azure Storage Explorer][storage_explorers] to view the Storage resources (containers and blobs) that are created by the application.

Typical execution time is **approximately 5 minutes** when you run the application in its default configuration.

```
Sample start: 1/8/2016 09:42:58 AM

Container [application] created.
Container [input] created.
Container [output] created.
Uploading file C:\repos\azure-batch-samples\CSharp\ArticleProjects\DotNetTutorial\bin\Debug\TaskApplication.exe to container [application]...
Uploading file Microsoft.WindowsAzure.Storage.dll to container [application]...
Uploading file ..\..\taskdata1.txt to container [input]...
Uploading file ..\..\taskdata2.txt to container [input]...
Uploading file ..\..\taskdata3.txt to container [input]...
Creating pool [DotNetTutorialPool]...
Creating job [DotNetTutorialJob]...
Adding 3 tasks to job [DotNetTutorialJob]...
Awaiting task completion, timeout in 00:30:00...
Success! All tasks completed successfully within the specified timeout period.
Downloading all files from container [output]...
All files downloaded to C:\Users\USERNAME\AppData\Local\Temp
Container [application] deleted.
Container [input] deleted.
Container [output] deleted.

Sample end: 1/8/2016 09:47:47 AM
Elapsed time: 00:04:48.5358142

Delete job? [yes] no: yes
Delete pool? [yes] no: yes

Sample complete, hit ENTER to exit...
```

## Next steps

Feel free to make changes to *DotNetTutorial* and *TaskApplication* to experiment with different compute scenarios. For example, try adding an execution delay to *TaskApplication*, such as with [Thread.Sleep][net_thread_sleep], to simulate long-running tasks and monitor them in the portal. Try adding more tasks or adjusting the number of compute nodes. Add logic to check for and allow the use of an existing pool to speed execution time (*hint*: check out `ArticleHelpers.cs` in the [Microsoft.Azure.Batch.Samples.Common][github_samples_common] project in [azure-batch-samples][github_samples]).

Now that you're familiar with the basic workflow of a Batch solution, it's time to dig in to the additional features of the Batch service.

- Read the [Batch feature overview for developers](batch-api-basics.md), which we recommend for all new Batch users.
- Start on the other Batch development articles under **Development in-depth** in the [Batch learning path][batch_learning_path].
- Check out a different implementation of processing the "top N words" workload by using Batch in the [TopNWords][github_topnwords] sample.

[azure_batch]: https://azure.microsoft.com/services/batch/
[azure_free_account]: https://azure.microsoft.com/free/
[azure_portal]: https://portal.azure.com
[batch_learning_path]: https://azure.microsoft.com/documentation/learning-paths/batch/
[github_dotnettutorial]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/DotNetTutorial
[github_samples]: https://github.com/Azure/azure-batch-samples
[github_samples_common]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/Common
[github_samples_zip]: https://github.com/Azure/azure-batch-samples/archive/master.zip
[github_topnwords]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/TopNWords
[net_api]: http://msdn.microsoft.com/library/azure/mt348682.aspx
[net_api_storage]: https://msdn.microsoft.com/library/azure/mt347887.aspx
[net_batchclient]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.batchclient.aspx
[net_cloudblobclient]: https://msdn.microsoft.com/library/microsoft.windowsazure.storage.blob.cloudblobclient.aspx
[net_cloudblobcontainer]: https://msdn.microsoft.com/library/microsoft.windowsazure.storage.blob.cloudblobcontainer.aspx
[net_cloudstorageaccount]: https://msdn.microsoft.com/library/azure/microsoft.windowsazure.storage.cloudstorageaccount.aspx
[net_cloudserviceconfiguration]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudserviceconfiguration.aspx
[net_container_delete]: https://msdn.microsoft.com/library/microsoft.windowsazure.storage.blob.cloudblobcontainer.deleteifexistsasync.aspx
[net_job]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudjob.aspx
[net_job_poolinfo]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.protocol.models.cloudjob.poolinformation.aspx
[net_joboperations]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.batchclient.joboperations
[net_joboperations_terminatejob]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.joboperations.terminatejobasync.aspx
[net_jobpreptask]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudjob.jobpreparationtask.aspx
[net_jobreltask]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudjob.jobreleasetask.aspx
[net_node]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.computenode.aspx
[net_odatadetaillevel]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.odatadetaillevel.aspx
[net_pool]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.aspx
[net_pool_create]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.createpool.aspx
[net_pool_starttask]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.starttask.aspx
[net_pooloperations]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.batchclient.pooloperations
[net_resourcefile]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.resourcefile.aspx
[net_resourcefile_blobsource]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.resourcefile.blobsource.aspx
[net_sas_blob]: https://msdn.microsoft.com/library/azure/microsoft.windowsazure.storage.blob.cloudblob.getsharedaccesssignature.aspx
[net_sas_container]: https://msdn.microsoft.com/library/azure/microsoft.windowsazure.storage.blob.cloudblobcontainer.getsharedaccesssignature.aspx
[net_starttask]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.starttask.aspx
[net_starttask_resourcefiles]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.starttask.resourcefiles.aspx
[net_task]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.aspx
[net_task_resourcefiles]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.resourcefiles.aspx
[net_taskstate]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.common.taskstate.aspx
[net_taskstatemonitor]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.taskstatemonitor.aspx
[net_thread_sleep]: https://msdn.microsoft.com/library/274eh01d(v=vs.110).aspx
[net_virtualmachineconfiguration]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.virtualmachineconfiguration.aspx
[nuget_packagemgr]: https://docs.nuget.org/consume/installing-nuget
[nuget_restore]: https://docs.nuget.org/consume/package-restore/msbuild-integrated#enabling-package-restore-during-build
[storage_explorers]: http://storageexplorer.com/
[visual_studio]: https://www.visualstudio.com/products/vs-2015-product-editions

[1]: ./media/batch-dotnet-get-started/batch_workflow_01_sm.png "Create containers in Azure Storage"
[2]: ./media/batch-dotnet-get-started/batch_workflow_02_sm.png "Upload task application and input (data) files to containers"
[3]: ./media/batch-dotnet-get-started/batch_workflow_03_sm.png "Create Batch pool"
[4]: ./media/batch-dotnet-get-started/batch_workflow_04_sm.png "Create Batch job"
[5]: ./media/batch-dotnet-get-started/batch_workflow_05_sm.png "Add tasks to job"
[6]: ./media/batch-dotnet-get-started/batch_workflow_06_sm.png "Monitor tasks"
[7]: ./media/batch-dotnet-get-started/batch_workflow_07_sm.png "Download task output from Storage"
[8]: ./media/batch-dotnet-get-started/batch_workflow_sm.png "Batch solution workflow (full diagram)"
[9]: ./media/batch-dotnet-get-started/credentials_batch_sm.png "Batch credentials in Portal"
[10]: ./media/batch-dotnet-get-started/credentials_storage_sm.png "Storage credentials in Portal"
[11]: ./media/batch-dotnet-get-started/batch_workflow_minimal_sm.png "Batch solution workflow (minimal diagram)"
