<properties
	pageTitle="Tutorial - Get started with the Azure Batch .NET Library | Microsoft Azure"
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
	ms.date="12/18/2015"
	ms.author="marsma"/>

# Get started with the Azure Batch library for .NET  

Learn the basics of [Azure Batch][azure_batch] and Batch solution workflow as we examine a C# application step-by-step, seeing how it leverages the power of the Batch service and the [Batch .NET][net_api] library to perform a computational workload in the cloud, as well as how it interacts with [Azure Storage](./../storage/storage-introduction.md) for file staging and retrieval.

## Prerequisites

This article assumes that you have a working knowledge of C# and Visual Studio, and that you are able to satisfy the account creation requirements specified below for Azure and the Batch and Storage services.

### Accounts

- **Azure account** - If you do not already have an Azure subscription, you can create a free trial account in minutes at [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/).
- **Batch account** - Once you have an Azure subscription, [Create and manage an Azure Batch account](batch-account-create-portal.md).
- **Storage account** - See the **Create a storage account** section in [About Azure storage accounts](../storage-create-storage-account.md).

### Visual Studio

You must have **Visual Studio 2013 or above** to build the sample project. You can find free and trial versions of Visual Studio in the [Overview of Visual Studio 2015 Products][visual_studio].

### *DotNetTutorial* code sample

The [DotNetTutorial][github_dotnettutorial] sample is one of the many code samples found in the [azure-batch-samples][github_samples] repository on GitHub. You can download the sample by clicking the "Download ZIP" button on the repository home page, or by clicking the [azure-batch-samples-master.zip][github_samples_zip] direct download link.

### Batch Explorer (optional)

The Batch Explorer is a free utility included in the [azure-batch-samples][github_samples] repository on GitHub. While not required to complete this tutorial, it is highly recommended for use in debugging and administration of the entities in your Batch account. You can read about an older version of the Batch Explorer in the [Azure Batch Explorer Sample Walkthrough][batch_explorer_blog] blog post.

## *DotNetTutorial* sample project overview

The DotNetTutorial code sample is a Visual Studio 2013 solution consisting of two projects: **DotNetTutorial** and **TaskApplication**. The client application, *DotNetTutorial*, interacts with the Batch and Storage services to coordinate the execution of a workload on compute nodes (virtual machines), while *TaskApplication* is the executable that actually runs on the compute nodes to perform the work. In this sample, TaskApplication.exe parses the text in a text file (the "input" file) that has been downloaded to the node from Azure Storage, outputting another text file that contains a list of the top three words appearing in the input file. After creating the output file, TaskApplication then uploads its output file to Azure Storage, making it available to the client application for download.

The following diagram illustrates the primary operations performed by the client application, DotNetTutorial, and the application that is executed by the tasks, TaskApplication. This basic workflow is typical of many compute solutions created with Batch, and while it does not demonstrate every feature available in the Batch service, nearly every Batch scenario will include similar processes.

![Batch example workflow][8]<br/>
*DotNetTutorial sample application workflow*

**1.** Create blob **containers** in Azure Storage<br/>
**2.** Upload task application and input files to containers<br/>
**3.** Create Batch **pool**<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;**3a.** Pool **StartTask** downloads task binary (TaskApplication) to nodes as they join the pool<br/>
**4.** Create Batch **job**<br/>
**5.** Add **tasks** to job<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;**5a.** The tasks are scheduled to execute on nodes<br/>
	&nbsp;&nbsp;&nbsp;&nbsp;**5b.** Each task downloads its input data from Azure Storage<br/>
**6.** Monitor tasks<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;**6a.** As tasks complete, they upload their output data to Azure Storage<br/>
**7.** Download task output from Storage

While not every Batch solution will include the above steps (and may include more), the *DotNetTutorial* sample is designed to show the most common processes within a Batch scenario.

## Build the *DotNetTutorial* sample project

Before you can successfully run the sample, you must specify both Batch and Storage account credentials in the DotNetTutorial project's `Program.cs` file. If you have not done so already, open the solution in Visual Studio by double-clicking on the `DotNetTutorial.sln` solution file, or from within Visual Studio by using the **File > Open > Project/Solution** menu.

Open `Program.cs` within the DotNetTutorial project, and add your credentials near the top of the file just below `public class Program`:

```
// Update the Batch and Storage account credential strings below with the values unique to your accounts.
// These are used when constructing connection strings for the Batch and Storage client objects.

// Batch account credentials
private const string BatchAccountName = "";
private const string BatchAccountKey  = "";
private const string BatchAccountUrl  = "";

// Storage account credentials
private const string StorageAccountName = "";
private const string StorageAccountKey  = "";
```

You can find these credentials within the account blade of each service within the [Azure Portal][azure_portal], examples of which are shown below.

![Batch credentials in Portal][9]
![Storage credentials in Portal][10]<br/>
*Batch and Storage account credentials found within the Azure Portal*

Now that you've updated the project with your credentials, right-click the solution in *Solution Explorer* and click **Build Solution**. Confirm the restoration of any NuGet packages, if prompted.

In the following sections, we break the sample application down into the steps it performs to process a workload in the Batch service, and discuss those steps in depth. You are encouraged to refer to the open solution in Visual Studio while working your way through the rest of this article since not every line of code within the sample is discussed.

## Step 1: Create Storage containers

![Create containers in Azure Storage][1]
<br/>
*Creating the blob containers in Azure Storage*

Batch includes built-in support for interacting with Azure Storage, and blob containers within your Storage account will provide tasks that run in your Batch account with the files they need to execute, as well as a place to store output data once they've completed. The first thing the DotNetTutorial client application does is create three block blob containers in Azure Storage:

- **application** - This container will house the application that will be run by the tasks, as well as any of its dependencies such as DLLs.
- **input** - Tasks will download the data files they are to process from the *input* container.
- **output** - When tasks complete the processing of the input files, they will upload their results to the *output* container.


> [AZURE.INFO] In [Azure Storage](./../storage/storage-introduction.md), a "blob" is a file of any type and size. Of the three types of blobs offered by Storage - block blobs, page blobs, and append blobs - this sample uses only the block blob.

In order to interact with a Storage account and create containers, we use the [Azure Storage Client Library for .NET][net_api_storage] and create a reference to the account with [CloudStorageAccount][net_cloudstorageaccount], and from that obtain a [CloudBlobClient][net_cloudblobclient]:

```
// Construct the Storage account connection string
string storageConnectionString = String.Format("DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1}",
                                                StorageAccountName, StorageAccountKey);

// Retrieve the storage account
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(storageConnectionString);

// Create the blob client, for use in obtaining references to blob storage containers
CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
```

We use the `blobClient` reference throughout the rest of the application, passing it as a parameter to a number of methods. An example of this is in the code block that immediately follows the above, where we call `CreateContainerIfNotExistAsync` to actually create the containers.

```
// Use the blob client to create the containers in Azure Storage if they don't yet exist
const string appContainerName    = "application";
const string inputContainerName  = "input";
const string outputContainerName = "output";
await CreateContainerIfNotExistAsync(blobClient, appContainerName);
await CreateContainerIfNotExistAsync(blobClient, inputContainerName);
await CreateContainerIfNotExistAsync(blobClient, outputContainerName);
```

```
private static async Task CreateContainerIfNotExistAsync(CloudBlobClient blobClient, string containerName)
{
		CloudBlobContainer container = blobClient.GetContainerReference(containerName);

		if (await container.CreateIfNotExistsAsync())
		{
				Console.WriteLine("Container [{0}] created.", containerName);
		}
		else
		{
				Console.WriteLine("Container [{0}] exists, skipping creation.", containerName);
		}
}
```

Once the three containers have been created, the application can now upload the files that will be used by the tasks.

> [AZURE.TIP] [How to use Blob storage from .NET](./../storage/storage-dotnet-how-to-use-blobs.md) provides a great overview of working with Azure Storage containers and blobs, and should be near the top of your reading list as you start working with Batch.

## Step 2: Upload task application and data files

![Upload task application and input (data) files to containers][2]
<br/>
*Uploading the task application (binaries) and the task input (data) files*

In the file upload operation, the application first defines collections of *application* and *input* file paths on the local machine, then uploads these files to the containers created in step #1 above. Two helper methods are involved in the upload process:

- `UploadFilesToContainerAsync` - This method returns a collection of [ResourceFile][net_resourcefile] objects, and internally calls `UploadFileToContainerAsync` to upload each file passed in the *filePaths* parameter. The collection of ResourceFiles returned by this method is discussed below.
- `UploadFileToContainerAsync` - This is the method that actually performs the file upload and creates the [ResourceFile][net_resourcefile] objects. After uploading the file, it obtains a Shared Access Signature (SAS) for the file and returns a ResourceFile object representing it. Shared access signatures are also discussed below.

```
private static async Task<ResourceFile> UploadFileToContainerAsync(CloudBlobClient blobClient, string containerName, string filePath)
{
		Console.WriteLine("Uploading file {0} to container [{1}]...", filePath, containerName);

		string blobName = Path.GetFileName(filePath);

		CloudBlobContainer container = blobClient.GetContainerReference(containerName);
		CloudBlockBlob blobData = container.GetBlockBlobReference(blobName);
		await blobData.UploadFromFileAsync(filePath, FileMode.Open);

		// Set the expiry time and permissions for the blob shared access signature. In this case, no start time is specified,
		// so the shared access signature becomes valid immediately
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

A [ResourceFile][net_resourcefile] provides tasks in Batch with the URL to a file in Azure Storage that will be downloaded to a compute node before that task is run. The [ResourceFile.BlobSource][net_resourcefile_blobsource] property specifies the full URL of the file as it exists in Azure Storage, which may also include a shared access signature (SAS) that provides secure access to the file. Most tasks types within Batch .NET include a *ResourceFiles* property, including:

- [CloudTask][net_task]
- [StartTask][net_pool_starttask]
- [JobPreparationTask][net_jobpreptask]
- [JobReleaseTask][net_jobreltask]

The DotNetTutorial sample application does not use the JobPreparationTask or JobReleaseTask, but you can read more about both in [Run job preparation and completion tasks on Azure Batch compute nodes](batch-job-prep-release.md).

### Shared Access Signatures (SAS)

Shared access signatures are strings which - when included as part of a URL - provide secure access to either containers or blobs within Azure Storage. The DotNetTutorial application uses both blob and container SAS URLs, and demonstrates how to obtain these SAS strings from the Storage service.

- **Blob SAS** - The tasks in DotNetTutorial use blob shared access signatures when downloading the application binaries and input data files from Storage. The `UploadFileToContainerAsync` method in DotNetTutorial's `Program.cs` contains the code that obtains each blob's SAS, and does so by calling [CloudblobData.GetSharedAccessSignature][net_sas_blob].

- **Container SAS** - As each task finishes its work on the compute node, it uploads its output file to the *output* container in Azure Storage. To do so, the TaskApplication uses a container SAS that provides write-access to the container as part of the path when uploading the file. Obtaining the container SAS is done in a similar fashion as when obtaining the blob SAS, and in DotNetTutorial, you will find that the `GetContainerSasUrl` helper method calls [CloudBlobContainer.GetSharedAccessSignature][net_sas_container] to do so. You'll read more about how TaskApplication uses the container SAS in Step 6 below, "Monitor Tasks."

> [AZURE.TIP] Check out the two-part series on shared access signatures, [Part 1: Understanding the SAS Model](./../storage/storage-dotnet-shared-access-signature-part-1.md) and [Part 2: Create and Use a SAS with the Blob Service](./../storage/storage-dotnet-shared-access-signature-part-2.md), to learn more about providing secure access to data in your Storage account.

## Step 3: Create Batch pool

![Create Batch pool][3]
<br/>
*(1) Creating a pool of compute nodes within Batch and (2) nodes downloading the pool's StartTask.ResourceFiles*

After uploading the application and data files to the Storage account, a pool of compute nodes is created in the Batch account. When creating a pool, you can specify a number of parameters such as the number of compute nodes, the [size of the nodes](./../cloud-services/cloud-services-sizes-specs.md), and the nodes' [operating system](./../cloud-services/cloud-services-guestos-update-matrix.md).

Along with these physical node properties, we can also specify a [StartTask][net_pool_starttask] for the pool. The StartTask will execute on each node as it joins the pool, as well as each time a node is restarted. The StartTask is especially useful for installing applications on compute nodes prior to the execution of tasks. For example, if your tasks process data using Python scripts, you could use a StartTask to install Python on the compute nodes.

In this sample application, we use the StartTask to copy the files that it has downloaded from Storage (which we specify using the StartTask's *ResourceFiles* property) from its working directory to the shared directory that all tasks running on the node can access.

```
private static async Task CreatePoolAsync(BatchClient batchClient, string poolId, IList<ResourceFile> resourceFiles)
{
    Console.WriteLine("Creating pool [{0}]...", poolId);

    // Create the unbound pool. Until we call CloudPool.Commit() or CommitAsync(), no pool is actually created in the
    // Batch service. This CloudPool instance is therefore considered "unbound," and we can modify its properties.
    CloudPool pool = batchClient.PoolOperations.CreatePool(
        poolId: poolId,
        targetDedicated: 1,
        virtualMachineSize: "small",
        osFamily: "4");

    // Create and assign the StartTask that will be executed when compute nodes join the pool.
    // In this case, we copy the StartTask's resource files (that will be automatically downloaded
    // to the node by the StartTask) into the shared directory that all tasks will have access to.
    pool.StartTask = new StartTask
    {
        // Specify a command line for the StartTask that copies the task application files to the
        // node's shared directory. Every compute node in a Batch pool is configured with a number
        // of pre-defined environment variables that can be referenced by commands or applications
        // run by tasks.

        // Since a successful execution of robocopy return a non-zero exit code (e.g. 1 when one or
        // more files were succesfully copied) we need to manually exit with a 0 for Batch to recognize
        // StartTask execution success.
        CommandLine = "cmd /c (robocopy %AZ_BATCH_TASK_WORKING_DIR% %AZ_BATCH_NODE_SHARED_DIR%) ^& IF %ERRORLEVEL% LEQ 1 exit 0",
        ResourceFiles = resourceFiles,
        WaitForSuccess = true
    };

    await pool.CommitAsync();
}
```

Notable in the code snippet above is the use of two environment variables in the *CommandLine* property of the StartTask: `%AZ_BATCH_TASK_WORKING_DIR%` and `%AZ_BATCH_NODE_SHARED_DIR%`. Each compute node within a Batch pool is automatically configured with a number of environment variables specific to Batch, and any process executed by a task has access to these environment variables.

> [AZURE.TIP] To find out more about the environment variables available on compute nodes within a Batch pool, as well as information on task working directories, see the **Environment settings for tasks** and **Files and directories** sections in the [Overview of Azure Batch features](batch-api-basics.md).

## Step 4: Create Batch job

![Create Batch job][4]<br/>
*Creating a job within the Batch service associated with a pool*

A Batch job is essentially a collection of tasks, and is used not only for performing distinct workloads, but can also impose certain constraints such as the maximum run-time for the job (and by extension, its tasks) as well as job priority in relation to other jobs within the Batch account. In this example, however, we merely associate the job with the pool created in the previous step and do not configure any additional properties.

All Batch jobs are associated with a specific pool. This indicates on which nodes the job's tasks will execute, and is done using the [CloudJob.PoolInformation][net_job_poolinfo] property as shown in the code snippet below.

```
private static async Task CreateJobAsync(BatchClient batchClient, string jobId, string poolId)
{
    Console.WriteLine("Creating job [{0}]...", jobId);

    CloudJob job = batchClient.JobOperations.CreateJob();
    job.Id = jobId;
    job.PoolInformation = new PoolInformation { PoolId = poolId };

    await job.CommitAsync();
}
```

Now that we have created a job, we can add tasks and perform the work.

## Step 5: Add tasks to job

![Add tasks to job][5]<br/>
*(1) Tasks are added to the job, (2) the tasks are scheduled to run on nodes, and (3) the tasks download the data files to process*

To actually perform work, tasks must be added to a job. Each [CloudTask][net_task] is configured with a command line and, as with the pool's StartTask, also [ResourceFiles][net_task_resourcefiles] that the task downloads to the node before the command line is executed. In the case of the tasks in our DotNetTutorial sample project, each task processes only one file and as such its ResourceFiles collection contains a single element.

```
private static async Task<List<CloudTask>> AddTasksAsync(BatchClient batchClient, string jobId, List<ResourceFile> inputFiles, string outputContainerSasUrl)
{
    Console.WriteLine("Adding {0} tasks to job [{1}]...", inputFiles.Count, jobId);

    // Create a collection to hold the tasks that we'll be adding to the job
    List<CloudTask> tasks = new List<CloudTask>();

    // Create each of the tasks. Because we copied the task application to the
    // node's shared directory with the pool's StartTask, we can access it via
    // the shared directory on whichever node each task will run.
    foreach (ResourceFile inputFile in inputFiles)
    {
        string taskId = "topNtask" + inputFiles.IndexOf(inputFile);
        string taskCommandLine = String.Format("cmd /c %AZ_BATCH_NODE_SHARED_DIR%\\TaskApplication.exe {0} 3 \"{1}\"", inputFile.FilePath, outputContainerSasUrl);

        CloudTask task = new CloudTask(taskId, taskCommandLine);
        task.ResourceFiles = new List<ResourceFile> { inputFile };
        tasks.Add(task);
    }

    // Add the tasks as a collection opposed to a separate AddTask call for each. Bulk task submission
    // helps to ensure efficient underlying API calls to the Batch service.
    await batchClient.JobOperations.AddTaskAsync(jobId, tasks);

    return tasks;
}
```

## Step 6: Monitor tasks

![Monitor tasks][6]<br/>
*Client application (1) monitors the tasks for completion and success status, and (2) the tasks upload result data to Azure Storage*

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

```
private static async Task<bool> MonitorTasks(BatchClient batchClient, string jobId, TimeSpan timeout)
{
    bool allTasksSuccessful = true;
    const string successMessage = "All tasks reached state Completed.";
    const string failureMessage = "One or more tasks failed to reach the Completed state within the timeout period.";

    // Obtain the collection of tasks currently managed by the job. Note that we use a detail level to
    // specify that only the "id" property of each task should be populated. Using a detail level for
    // all list operations helps to lower response time from the Batch service.
    ODATADetailLevel detail = new ODATADetailLevel(selectClause: "id");
    List<CloudTask> tasks = await batchClient.JobOperations.ListTasks(JobId, detail).ToListAsync();

    Console.WriteLine("Awaiting task completion, timeout in {0}...", timeout.ToString());

    // We use a TaskStateMonitor to monitor the state of our tasks. In this case, we will wait for all tasks to
    // reach the Completed state.
    TaskStateMonitor taskStateMonitor = batchClient.Utilities.CreateTaskStateMonitor();
    bool timedOut = await taskStateMonitor.WaitAllAsync(tasks, TaskState.Completed, timeout);

    if (timedOut)
    {
        allTasksSuccessful = false;

        await batchClient.JobOperations.TerminateJobAsync(jobId, failureMessage);

        Console.WriteLine(failureMessage);
    }
    else
    {
        await batchClient.JobOperations.TerminateJobAsync(jobId, successMessage);

        // All tasks have reached the "Completed" state, however, this does not guarantee all tasks completed successfully.
        // Here we further check each task's ExecutionInfo property to ensure that it did not encounter a scheduling error
        // or return a non-zero exit code.

        // Update the detail level to populate only the task id and executionInfo properties.
        // We refresh the tasks below, and need only this information for each task.
        detail.SelectClause = "id, executionInfo";

        foreach (CloudTask task in tasks)
        {
            // Populate the task's properties with the latest info from the Batch service
            await task.RefreshAsync(detail);

            if (task.ExecutionInformation.SchedulingError != null)
            {
                // A scheduling error indicates a problem starting the task on the node. It is important to note that
                // the task's state can be "Completed," yet still have encountered a scheduling error.

                allTasksSuccessful = false;

                Console.WriteLine("WARNING: Task [{0}] encountered a scheduling error: {1}", task.Id, task.ExecutionInformation.SchedulingError.Message);
            }
            else if (task.ExecutionInformation.ExitCode != 0)
            {
                // A non-zero exit code may indicate that the application executed by the task encountered an error
                // during execution. As not every application returns non-zero on failure by default (e.g. robocopy),
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
*Downloading the results of the task output from Azure Storage*

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

```
private static async Task DownloadBlobsFromContainerAsync(CloudBlobClient blobClient, string containerName, string directoryPath)
{
		Console.WriteLine("Downloading all files from container [{0}]...", containerName);

		// Retrieve a reference to a previously created container
		CloudBlobContainer container = blobClient.GetContainerReference(containerName);

		// Get a flat listing of all the block blobs in the specified container
		foreach (IListBlobItem item in container.ListBlobs(prefix: null, useFlatBlobListing: true))
		{
				// Retrieve reference to the current blob
				CloudBlob blob = (CloudBlob)item;

				// Save blob contents to a file in the %TEMP% folder
				string localOutputFile = Path.Combine(directoryPath, blob.Name);
				await blob.DownloadToFileAsync(localOutputFile, FileMode.Create);
		}

		Console.WriteLine("All files downloaded to {0}", directoryPath);
}
```

## Step 8: Delete task output

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

```
private static async Task DeleteBlobsFromContainerAsync(CloudBlobClient blobClient, string containerName)
{
    Console.WriteLine("Deleting all files from container [{0}]...", containerName);

    // Retrieve a reference to the container
    CloudBlobContainer container = blobClient.GetContainerReference(containerName);

    // Get a flat listing of all of the blobs within the container
    foreach (IListBlobItem item in container.ListBlobs(prefix: null, useFlatBlobListing: true))
    {
        // Retrieve a reference to the current blob
        CloudBlob blob = (CloudBlob)item;

        // Delete the blob
        await blob.DeleteAsync();
    }
}
```

## Step 9: Delete job and pool

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

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

## Next steps

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

[azure_batch]: https://azure.microsoft.com/services/batch/
[azure_portal]: https://portal.azure.com
[batch_explorer]: http://blogs.technet.com/b/windowshpc/archive/2015/01/20/azure-batch-explorer-sample-walkthrough.aspx
[batch_explorer_blog]: http://blogs.technet.com/b/windowshpc/archive/2015/01/20/azure-batch-explorer-sample-walkthrough.aspx
[github_dotnettutorial]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/DotNetTutorial
[github_samples]: https://github.com/Azure/azure-batch-samples
[github_samples_zip]: https://github.com/Azure/azure-batch-samples/archive/master.zip
[net_api]: http://msdn.microsoft.com/library/azure/mt348682.aspx
[net_api_storage]: https://msdn.microsoft.com/library/azure/mt347887.aspx
[net_job]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudjob.aspx
[net_job_poolinfo]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.protocol.models.cloudjob.poolinformation.aspx
[net_jobpreptask]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudjob.jobpreparationtask.aspx
[net_jobreltask]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudjob.jobreleasetask.aspx
[net_node]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.computenode.aspx
[net_pool]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.aspx
[net_pool_create]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.createpool.aspx
[net_pool_starttask]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.starttask.aspx
[net_resourcefile]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.resourcefile.aspx
[net_resourcefile_blobsource]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.resourcefile.blobsource.aspx
[net_sas_blob]: https://msdn.microsoft.com/library/azure/microsoft.windowsazure.storage.blob.cloudblob.getsharedaccesssignature.aspx
[net_sas_container]: https://msdn.microsoft.com/library/azure/microsoft.windowsazure.storage.blob.cloudblobcontainer.getsharedaccesssignature.aspx
[net_task]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.aspx
[net_task_resourcefiles]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.resourcefiles.aspx
[net_cloudblobclient]: https://msdn.microsoft.com/library/microsoft.windowsazure.storage.blob.cloudblobclient.aspx
[net_cloudblobcontainer]: https://msdn.microsoft.com/library/microsoft.windowsazure.storage.blob.cloudblobcontainer.aspx
[net_cloudstorageaccount]: https://msdn.microsoft.com/library/azure/microsoft.windowsazure.storage.cloudstorageaccount.aspx
[visual_studio]: https://www.visualstudio.com/products/vs-2015-product-editions

[1]: ./media/batch-dotnet-get-started\batch_workflow_01_sm.png "Create containers in Azure Storage"
[2]: ./media/batch-dotnet-get-started\batch_workflow_02_sm.png "Upload task application and input (data) files to containers"
[3]: ./media/batch-dotnet-get-started\batch_workflow_03_sm.png "Create Batch pool"
[4]: ./media/batch-dotnet-get-started\batch_workflow_04_sm.png "Create Batch job"
[5]: ./media/batch-dotnet-get-started\batch_workflow_05_sm.png "Add tasks to job"
[6]: ./media/batch-dotnet-get-started\batch_workflow_06_sm.png "Monitor tasks"
[7]: ./media/batch-dotnet-get-started\batch_workflow_07_sm.png "Download task output from Storage"
[8]: ./media/batch-dotnet-get-started\batch_workflow_sm.png "Batch solution workflow (full diagram)"
[9]: ./media/batch-dotnet-get-started\credentials_batch_sm.png "Batch credentials in Portal"
[10]: ./media/batch-dotnet-get-started\credentials_storage_sm.png "Storage credentials in Portal"
