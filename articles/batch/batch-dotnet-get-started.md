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

Learn the basics of [Azure Batch][azure_batch] and Batch solution workflow as we examine a C# application step-by-step, seeing how it leverages the power of the Batch service and the [Batch .NET][net_api] library to perform a computational workload in the cloud, as well as how it interacts with [Azure Storage][azure_storage] for file staging and retrieval.

## Prerequisites

This article assumes that you have a working knowledge of C# and Visual Studio, and that you are able to satisfy the account creation requirements specified below for Azure and the Batch and Storage services.

### Accounts

- **Azure account** - If you do not already have an Azure subscription, you can create a free trial account in minutes at [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/).
- **Batch account** - See [Create and manage an Azure Batch account](batch-account-create-portal.md).
- **Storage account** - See the **Create a storage account** section of [About Azure storage accounts](../storage-create-storage-account.md).

### Visual Studio

You must have **Visual Studio 2013** or **above** to build the sample project. Find free and trial versions in the [Overview of Visual Studio 2015 Products][visual_studio].

### *DotNetTutorial* code sample

The [DotNetTutorial][github_dotnettutorial] sample is one of the many code samples found in the [azure-batch-samples][github_samples] repository on GitHub. You can download the sample by clicking the "Download ZIP" button on the repository home page, or clicking the [azure-batch-samples-master.zip][github_samples_zip] direct download link.

### Batch Explorer (optional)

The Batch Explorer is a free utility included in the [azure-batch-samples][github_samples] repository on GitHub. While not required to complete this tutorial, it is highly recommended for use in debugging and administration of the entities in your Batch account. You can read about an older version of the Batch Explorer in the [Azure Batch Explorer Sample Walkthrough][batch_explorer_blog] blog post.

## Overview of the *DotNetTutorial* sample project

The DotNetTutorial code sample is a Visual Studio 2013 solution consisting of two projects: **DotNetTutorial** and **TaskApplication**. The following diagram illustrates the primary operations performed by the client application (DotNetTutorial) and the application that is executed by the tasks (TaskApplication). This basic workflow is typical of many compute solutions created with Batch, and while it does not demonstrate every feature available, nearly every Batch scenario will include similar processes.

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

While not every Batch solution may include the above steps (and may include more), the *DotNetTutorial* sample is designed to show the most common processes within a Batch scenario.

## Build the *DotNetTutorial* sample project

Before you can successfully run the sample, you must specify both Batch and Storage account credentials in the DotNetTutorial project's Program.cs file:

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

You can find these credentials within account blade of each service within the [Azure Portal][azure_portal]:

![Batch credentials in Portal][9]
![Storage credentials in Portal][10]<br/>
*Batch and Storage account credentials found within the Azure Portal*

Now that you've updated the project with your credentials, right-click the solution in Solution Explorer and click **Build Solution**. You may be prompted to confirm the restoration of various NuGet packages, which you should accept.

In the following sections, we break the sample application down into the steps it performs to process a workload in the Batch service, and discuss those steps in depth. You are encouraged to refer to the open solution in Visual Studio at any time while working your way through the rest of this article as not every line of code within the sample appears below.

## Step 1: Create Storage containers

![Create containers in Azure Storage][1]
<br/>
*Creating the blob containers in Azure Storage*

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

```
// Construct the Storage account connection string
string storageConnectionString = String.Format("DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1}",
                                                StorageAccountName, StorageAccountKey);

// Retrieve the storage account
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(storageConnectionString);

// Create the blob client, for use in obtaining references to blob storage containers
CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

// Use the blob client to create the containers in Azure Storage if they don't yet exist
const string appContainerName    = "application";
const string inputContainerName  = "input";
const string outputContainerName = "output";
await CreateContainerIfNotExistAsync(blobClient, appContainerName);
await CreateContainerIfNotExistAsync(blobClient, inputContainerName);
await CreateContainerIfNotExistAsync(blobClient, outputContainerName);
```

## Step 2: Upload task application and data files

![Upload task application and input (data) files to containers][2]
<br/>
*Uploading the task application (binaries) and the task input (data) files*

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

```
// The collection of data files that are to be processed by the tasks
List<string> inputFilePaths = new List<string>
{
    @"..\..\taskdata1.txt",
    @"..\..\taskdata2.txt",
    @"..\..\taskdata3.txt"
};
```

A helper method is called which then calls this method that does the actual work of uploading the files:

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

## Step 3: Create Batch pool

![Create Batch pool][3]
<br/>
*(1) Creating a pool of compute nodes within Batch and (2) nodes downloading the pool's StartTask.ResourceFiles*

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

```
// Paths to the executable and its dependencies that will be executed by the tasks
List<string> applicationFilePaths = new List<string>
{
    // The DotNetTutorial project includes a project reference to TaskApplication, allowing us to
    // determine the path of the task application binary dynamically
    typeof(TaskApplication.Program).Assembly.Location,
    "Microsoft.WindowsAzure.Storage.dll"
};
```

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

    // Create and assign the StartTask that will be executed when compute nodes join the pool. MM m
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

## Step 4: Create Batch job

![Create Batch job][4]<br/>
*Creating a job within the Batch service associated with a pool*

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Step 5: Add tasks to job

![Add tasks to job][5]<br/>
*(1) Tasks are added to the job, (2) the tasks are scheduled to run on nodes, and (3) the tasks download the data files to process*

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Step 6: Monitor tasks

![Monitor tasks][6]<br/>
*Client application (1) monitors the tasks for completion and success status, and (2) the tasks upload result data to Azure Storage*

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Step 7: Download task output

![Download task output from Storage][7]<br/>
*Downloading the results of the task output from Azure Storage*

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Step 8: Delete task output

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Step 9: Delete job and pool

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Next steps

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

[azure_batch]: https://azure.microsoft.com/services/batch/
[azure_portal]: https://portal.azure.com
[azure_storage]: https://azure.microsoft.com/services/storage/
[batch_explorer]: http://blogs.technet.com/b/windowshpc/archive/2015/01/20/azure-batch-explorer-sample-walkthrough.aspx
[batch_explorer_blog]: http://blogs.technet.com/b/windowshpc/archive/2015/01/20/azure-batch-explorer-sample-walkthrough.aspx
[github_dotnettutorial]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/DotNetTutorial
[github_samples]: https://github.com/Azure/azure-batch-samples
[github_samples_zip]: https://github.com/Azure/azure-batch-samples/archive/master.zip
[net_api]: http://msdn.microsoft.com/library/azure/mt348682.aspx
[net_job]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudjob.aspx
[net_node]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.computenode.aspx
[net_pool]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.aspx
[net_task]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.aspx
[poolcreate_net]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.createpool.aspx
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
