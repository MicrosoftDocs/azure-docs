---
title: Azure Quickstart - Run Batch job - .NET | Microsoft Docs
description: Quickly run a Batch job and tasks with the Batch .NET client SDK.
services: batch
documentationcenter: 
author: dlepow
manager: jeconnoc
editor: 
tags: 

ms.assetid: 
ms.service: batch
ms.devlang: dotnet
ms.topic: quickstart
ms.tgt_pltfrm: 
ms.workload: 
ms.date: 12/04/2017
ms.author: danlep
ms.custom: mvc
---

# Run a sample Batch job and tasks with the .NET client

This quickstart shows how to use the Azure Batch .NET library to build a client app that runs an Azure Batch job. This example is basic but introduces the key concepts of the Batch service. The app uploads some input data files to Azure storage and creates a *pool* of Batch compute nodes (virtual machines). Then, it creates a sample *job* that runs *tasks* to process each input file on the pool. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To complete this quickstart:

* [Install Git](https://git-scm.com/).
* [Install Visual Studio](https://www.visualstudio.com/) 2015 or a more recent version. 
* Create an Azure Batch account and an Azure Storage account. To create these accounts, see the Batch quickstarts using the [Azure portal](quick-create-portal.md) or [Azure CLI](quick-create-cli.md). 

## Download the sample

In a terminal window, run the following command to clone the sample app repository to your local machine.

```bash
git clone <whatever>
```

Change to the directory that contains the sample code

```bash
cd <wherever>
```

## Build the project

Open the solution in Visual Studio. Before you run the sample, enter your Batch and Storage account credentials in the project's Program.cs file. Get the necessary information from the Batch account in the [Azure portal](https://portal.azure.com), or use Azure CLI commands. For example, to get the account keys, use the [az batch account keys list](/cli/azure/batch/account/keys#az_batch_account_keys_list) and [az storage account keys list](/cli/azure/storage/account/keys##az_storage_account_keys_list) commands.

```csharp
// Update the Batch and Storage account credential strings below with the values
// unique to your accounts. These are used when constructing connection strings
// for the Batch and Storage client objects.

// Batch account credentials
private const string BatchAccountName = "mybatchaccount";
private const string BatchAccountKey  = "xxxxxxxxxxxxxxxxE+yXrRvJAqT9BlXwwo1CwF+SwAYOxxxxxxxxxxxxxxxx43pXi/gdiATkvbpLRl3x14pcEQ==";
private const string BatchAccountUrl  = "https://mybatchaccount.westeurope.batch.azure.com";

// Storage account credentials
private const string StorageAccountName = "mystorageaccount";
private const string StorageAccountKey  = "xxxxxxxxxxxxxxxxy4/xxxxxxxxxxxxxxxxfwpbIC5aAWA8wDu+AFXZB827Mt9lybZB1nUcQbQiUrkPtilK5BQ==";
```

Right-click the solution in Solution Explorer and click **Build Solution**. Confirm the restoration of any NuGet packages, if you're prompted. If you need to download missing packages, ensure the [NuGet Package Manager](https://docs.nuget.org/consume/installing-nuget) is installed.

When you run the sample application, the console output is similar to the following. During execution, you experience a pause at `Awaiting task completion, timeout in 00:30:00...` while the pool's compute nodes are started. Use the Azure portal to monitor the pool, compute nodes, job, and tasks in your Batch account.

```
Sample start: 12/4/2017 4:02:54 PM

Container [input] created.
Uploading file ..\..\taskdata0.txt to container [input]...
Uploading file ..\..\taskdata1.txt to container [input]...
Uploading file ..\..\taskdata2.txt to container [input]...
Creating pool [DotNetQuickstartPool]...
Creating job [DotNetQuickstartJob]...
Adding 3 tasks to job [DotNetQuickstartJob]...
Awaiting task completion, timeout in 00:30:00...
```

After tasks complete, you see output similar to the following for each task:

```
Printing task output.
Task Task0
Node tvm-2850684224_3-20171205t000401z
stdout:
Processing file taskdata0.txt in task Task0:
Batch processing began with mainframe computers and punch cards. Today it still plays a central role in business, engineering, science, and other pursuits that require running lots of automated tasks....
stderr:
...
```

Typical execution time is approximately 5 minutes when you run the application in its default configuration. To run the job again, delete the job from the previous run and do not delete the pool. On a preconfigured pool, the job completes in a few seconds.



## Explanation of the quickstart

The .NET app in this quickstart does the following:

* Uploads three small text files to a blob container named *input* in your Azure storage account. These files are inputs for processing by Batch tasks.
* Creates a pool of three compute nodes running Windows Server 2016.
* Creates a job and three tasks to run on the nodes. Each task processes one of the input files using a basic **Command line**. For simplicity, the app only types the content of each input file. 
* Displays the standard output and standard error files returned by each task.
* After task completion, deletes the blob container and optionally the Batch job and pool.

Additional details follow.

### Blob and Batch clients

The app creates a blob client, to interact with Azure Storage, and a Batch client, to interact with the Batch service. The Batch client in the sample uses shared key authentication:

```csharp
// Get a Batch client using account creds
BatchSharedKeyCredentials cred = new BatchSharedKeyCredentials(BatchAccountUrl, BatchAccountName, BatchAccountKey);

BatchClient batchClient = BatchClient.Open(cred);
```



### File upload

The app uses the blob client to connect to a container in Azure Storage and upload the input text files.

```csharp
List<string> inputFilePaths = new List<string>
{
    @"..\..\taskdata0.txt",
    @"..\..\taskdata1.txt",
    @"..\..\taskdata2.txt"
};

// Upload the data files to Azure Storage. This is the data that will be processed by each of the tasks.
List<ResourceFile> inputFiles = new List<ResourceFile>();

foreach (string filePath in inputFilePaths)
{
    Console.WriteLine("Uploading file {0} to container [{1}]...", filePath, inputContainerName);

    string blobName = Path.GetFileName(filePath);

    // CloudBlobContainer container = blobClient.GetContainerReference(inputContainerName);
    CloudBlockBlob blobData = container.GetBlockBlobReference(blobName);
    blobData.UploadFromFileAsync(filePath);

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

    ResourceFile resourceFile = new ResourceFile(blobSasUri, blobName);

    inputFiles.Add(resourceFile);
}
```

### Create a Batch pool

To create a Batch pool, the app specifies the number of nodes, the node size, and the OS settings. The sample configuration includes three nodes running Windows Server 2016 in the `CloudServiceConfiguration`. In this configuration, the nodes are worker instances in an Azure cloud service. Batch pools can alternatively specify a `VirtualMachineConfiguration` where nodes are Azure VMs created from a custom VM image or an image from the Azure Marketplace.

When configuration is complete, commit the pool:

```csharp
CloudPool pool = batchClient.PoolOperations.CreatePool(
    poolId: PoolId,
    targetDedicatedComputeNodes: 3,
    virtualMachineSize: "Small",
    cloudServiceConfiguration: new CloudServiceConfiguration(osFamily: "5")
    );

pool.Commit();
```
### Create a Batch job

A Batch job specifies a pool to run tasks on and optionally a priority and schedule for the work. The app creates a job on the pool you created, and commits it. Initially the job has no tasks.

```csharp
CloudJob job = batchClient.JobOperations.CreateJob();
    job.Id = JobId;
    job.PoolInformation = new PoolInformation { PoolId = PoolId };

job.Commit();        
```

### Create tasks
The app creates a list of tasks to process each input file using a basic `taskCommandLine`. In the sample, the command line runs the Windows `type` command to display the text file. This is a simple example for demonstration purposes. When you use Batch, the command line is where you specify your app or script. 

Then, the app adds tasks to the job, which queues them to run on the compute nodes.

```csharp
foreach (ResourceFile inputFile in inputFiles)
    {
    string taskId = "Task" + inputFiles.IndexOf(inputFile);
    
    string inputfilename = inputFile.FilePath;

    string taskCommandLine = String.Format("cmd /c echo Processing file {0} in task {1} & type {0}", inputfilename, taskId);

    CloudTask task = new CloudTask(taskId, taskCommandLine);
    
    task.ResourceFiles = new List<ResourceFile> { inputFile };
        tasks.Add(task);
    }

// Add all tasks to the job.
batchClient.JobOperations.AddTaskAsync(JobId, tasks).Wait();
```
 
### View task output

The app monitors the tasks to make sure they complete. Then, the app displays the stdout and stderr files generated by each task. In this sample, the output of the `type` command is written to stdout:

```csharp
foreach (CloudTask task in completedtasks)
{
    string nodeId = String.Format(task.ComputeNodeInformation.ComputeNodeId);
    Console.WriteLine("Task " + task.Id);
    Console.WriteLine("Node " + nodeId);
    Console.WriteLine("stdout:" + Environment.NewLine + task.GetNodeFile(Constants.StandardOutFileName).ReadAsString());
    Console.WriteLine();
    Console.WriteLine("stderr:" + Environment.NewLine + task.GetNodeFile(Constants.StandardErrorFileName).ReadAsString());

```

## Clean up resources

The app automatically deletes the storage container it creates, and by default deletes the Batch pool and job it runs. 

When no longer needed, delete the resource group, Batch account, and storage account. To do so in the Azure portal, select the resource group for the Batch account and click **Delete**.

## Next steps

In this quickstart, you ... To learn more about Azure Batch, continue to the XXX tutorial.


> [!div class="nextstepaction"]
> [Azure Batch tutorials](tutorial-parallel-dotnet.md)
