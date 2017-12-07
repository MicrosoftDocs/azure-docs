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
ms.date: 12/06/2017
ms.author: danlep
ms.custom: mvc
---

# Run your first Batch job using the .NET SDK

This quickstart shows how to use the Azure Batch .NET SDK to build a local client app that runs an Azure Batch job. This example is basic but introduces key concepts of the Batch service. The app uploads some input data files to Azure storage and creates a *pool* of Batch compute nodes (virtual machines). Then, it creates a sample *job* that runs *tasks* to process each input file on the pool. 

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

## Build and run the app

Open the solution in Visual Studio. Before you run the app, enter your Batch and Storage account credentials in the project's `Program.cs` file. Get the necessary information from the Batch account in the [Azure portal](https://portal.azure.com), or use Azure CLI commands. For example, to get the account keys, use the [az batch account keys list](/cli/azure/batch/account/keys#az_batch_account_keys_list) and [az storage account keys list](/cli/azure/storage/account/keys##az_storage_account_keys_list) commands.

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

When you run the sample application, the console output is similar to the following. During execution, you experience a pause at `Awaiting task completion, timeout in 00:30:00...` while the pool's compute nodes are started. Go to your Batch account in the Azure portal to monitor the pool, compute nodes, job, and tasks.

```
Sample start: 12/4/2017 4:02:54 PM

Container [input] created.
Uploading file taskdata0.txt to container [input]...
Uploading file taskdata1.txt to container [input]...
Uploading file taskdata2.txt to container [input]...
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

Typical execution time is approximately 5 minutes when you run the application in its default configuration. Initial pool setup takes the most time. To run the job again, delete the job from the previous run and do not delete the pool. On a preconfigured pool, the job completes in a few seconds.



## Walkthrough

The .NET app in this quickstart does the following:

* Uploads three small text files to a blob container named *input* in your Azure storage account. These files are inputs for processing by Batch tasks.
* Creates a pool of three compute nodes (virtual machines) running Windows Server 2016.
* Creates a job and three tasks to run on the nodes. Each task processes one of the input files using a Windows command line. For simplicity, the app only types the content of each input file. 
* Displays the standard output and standard error files returned by each task.
* After task completion, deletes the blob container and optionally the Batch job and pool.

See the file `Program.cs` and the following sections for details. 

### Preliminaries

* To interact with a storage account, the app uses the Azure Storage Client Library for .NET. It creates a reference to the account with [CloudStorageAccount](/dotnet/api/microsoft.windowsazure.storage.cloudstorageaccount), and from that creates a [CloudBlobClient](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobclient).

  ```csharp
  CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
  ```

* The app uses the `blobClient` reference to create a container in the storage account and also to upload data files to the container from a set of input file paths. The files in storage are defined as Batch [ResourceFile](/dotnet/api/microsoft.azure.batch.resourcefile) objects that Batch can later download to compute nodes.

  ```csharp
  List<string> inputFilePaths = new List<string>
  {
      @"..\..\taskdata0.txt",
      @"..\..\taskdata1.txt",
      @"..\..\taskdata2.txt"
  };
  
  List<ResourceFile> inputFiles = new List<ResourceFile>();
    
  foreach (string filePath in inputFilePaths)
  {
      inputFiles.Add(UploadFileToContainer(blobClient, inputContainerName, filePath));
  }
  ```
* The app creates a [BatchClient](/dotnet/api/microsoft.azure.batch.batchclient) object to create and manage pools, jobs, and tasks in the Batch service. The Batch client in the sample uses shared key authentication:

  ```csharp
  BatchSharedKeyCredentials cred = new BatchSharedKeyCredentials(BatchAccountUrl, BatchAccountName, BatchAccountKey);

  BatchClient batchClient = BatchClient.Open(cred);
  ```

### Create a Batch pool

To create a Batch pool, the app uses the [BatchClient.PoolOperations.CreatePool](/dotnet/api/microsoft.azure.batch.pooloperations.createpool) method to set the number of nodes, VM size, and a pool configuration. Here, a [VirtualMachineConfiguration](/dotnet/api/microsoft.azure.batch.virtualmachineconfiguration) object specifies an [ImageReference](/dotnet/api/microsoft.azure.batch.imagereference) to a Windows Server 2012 R2 image published in the Azure Marketplace.

The [Commit](/dotnet/api/microsoft.azure.batch.cloudpool.commit) method submits the pool to the Batch service.

```csharp
ImageReference imageReference = new ImageReference(
    publisher: "MicrosoftWindowsServer",
    offer: "WindowsServer",
    sku: "2016-Datacenter",
    version: "latest");

VirtualMachineConfiguration virtualMachineConfiguration =
new VirtualMachineConfiguration(
   imageReference: imageReference,
   nodeAgentSkuId: "batch.node.windows amd64"
   );

try
{
    CloudPool pool = batchClient.PoolOperations.CreatePool(
    poolId: PoolId,
    targetDedicatedComputeNodes: 3,
    virtualMachineSize: "STANDARD_A1_v2",
    virtualMachineConfiguration: virtualMachineConfiguration
    );

    pool.Commit();
}
...

```
### Create a Batch job

A Batch job specifies a pool to run tasks on and optional settings such as a priority and schedule for the work. The app uses the [BatchClient.JobOperations.CreateJob](/dotnet/api/microsoft.azure.batch.joboperations.createjob) method create a job on your pool. The [Commit](/dotnet/api/microsoft.azure.batch.cloudjob.commit) method submits the job to the Batch service. Initially the job has no tasks.

```csharp
CloudJob job = batchClient.JobOperations.CreateJob();
    job.Id = JobId;
    job.PoolInformation = new PoolInformation { PoolId = PoolId };

job.Commit();        
```

### Create tasks
The app creates a list of [CloudTask](/dotnet/api/microsoft.azure.batch.cloudtask) objects. Each task processes an input `ResourceFile` objecs using a [CommandLine](/dotnet/api/microsoft.azure.batch.cloudtask.commandline) property. In the sample, the command line runs the Windows `type` command to display a text file. This is a simple example for demonstration purposes. When you use Batch, the command line is where you specify your app or script. Batch provides a number of ways to deploy apps and scripts to compute nodes.

Then, the app adds tasks to the job with the [AddTaskAsync](/dotnet/api/microsoft.azure.batch.joboperations.addtaskasync) method, which queues them to run on the compute nodes. 

```csharp
foreach (ResourceFile inputFile in inputFiles)
    {
    string taskId = "Task" + inputFiles.IndexOf(inputFile);
    string inputfilename = inputFile.FilePath
    string taskCommandLine = String.Format("cmd /c echo Processing file {0} in task {1} & type {0}", inputfilename, taskId);
    
    CloudTask task = new CloudTask(taskId, taskCommandLine);
    task.ResourceFiles = new List<ResourceFile> { inputFile };
        tasks.Add(task);
    }
batchClient.JobOperations.AddTaskAsync(JobId, tasks).Wait();
```
 
### View task output

The app creates a [TaskStateMonitor](/dotnet/api/microsoft.azure.batch.taskstatemonitor) to monitor the tasks to make sure they complete. Then, the app uses the [CloudTask.ComputeNodeInformation](/dotnet/api/microsoft.azure.batch.cloudtask.computenodeinformation) property to display the stdout.txt and stderr.txt files generated by each completed task. When the task runs successfully, the output of the `type` command is written to stdout.txt, and stderr.txt is an empty file:

```csharp
foreach (CloudTask task in completedtasks)
{
    string nodeId = String.Format(task.ComputeNodeInformation.ComputeNodeId);
    Console.WriteLine("Task " + task.Id);
    Console.WriteLine("Node " + nodeId);
    Console.WriteLine("stdout:" + Environment.NewLine + task.GetNodeFile(Constants.StandardOutFileName).ReadAsString());
    Console.WriteLine();
    Console.WriteLine("stderr:" + Environment.NewLine + task.GetNodeFile(Constants.StandardErrorFileName).ReadAsString());
}
```

## Clean up resources

The app automatically deletes the storage container it creates, and by default deletes the Batch pool and job it runs. When you delete the pool, all task output on the nodes is deleted.

When no longer needed, delete the resource group, Batch account, and storage account. To do so in the Azure portal, select the resource group for the Batch account and click **Delete**.

## Next steps

In this quickstart, you ... To learn more about Azure Batch, continue to the XXX tutorial.


> [!div class="nextstepaction"]
> [Azure Batch tutorials](tutorial-parallel-dotnet.md)
