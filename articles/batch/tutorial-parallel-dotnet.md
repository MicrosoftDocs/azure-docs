---
title: Run a parallel workload - Azure Batch .NET | Microsoft Docs
description: Tutorial - Step by step instructions to transcode media files with ffmpeg in Azure Batch using the Batch .NET client
services: batch
documentationcenter: 
author: v-dotren
manager: timlt
editor: 
tags: 

ms.assetid: 
ms.service: batch
ms.devlang: dotnet
ms.topic: tutorial
ms.tgt_pltfrm: 
ms.workload: 
ms.date: 12/11/2017
ms.author: v-dotren
ms.custom: mvc
---

# Transcode media files in parallel with Azure Batch using the .NET API

Intro here.... You learn how to:

> [!div class="checklist"]
> * W
> * X
> * Y
> * Z

## Prerequisites

To complete this tutorial:

* [Install Git](https://git-scm.com/).
* [Install Visual Studio](https://www.visualstudio.com/) 2015 or a more recent version. 
* Create an Azure Batch account and a linked Azure Storage account. To create these accounts, see the Batch quickstarts using the [Azure portal](quick-create-portal.md) or [Azure CLI](quick-create-cli.md). 
* Download the [Windows 64-bit version of ffmpeg 3.4](https://ffmpeg.zeranoe.com/builds/win64/static/ffmpeg-3.4-win64-static.zip) to your local computer. The download is a zipfile. You do not need to unzip the file or install it locally.


## Add the ffmpeg application package

For this tutorial, use the Azure portal to add ffmpeg to your Batch account as an [application package](batch-application-packages.md). Application packages help you manage task applications and their deployment to the compute nodes in your pool. 

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Click **All service** > **Batch accounts** and then click the name of your Batch account.
3. Click **Applications** > **Add**.
4. For **Application id** enter *ffmpeg*, and a package version of *3.4*. Select the ffmpeg zipfile you downloaded previously, and then click **OK**.

The ffmpeg application is added to your Batch account.

![Add application package](./media/tutorial-parallel-dotnet/add-application.png)


## Download the sample app

In a terminal window, run the following command to clone the sample app repository to your local machine.

```bash
git clone <whatever>
```

Change to the directory that contains the sample code

```bash
cd <wherever>
```

## Build the sample project

Open the solution in Visual Studio. Before you run the app, enter your Batch and Storage account credentials in the project's `Program.cs` file. Get the necessary information from the Batch account in the [Azure portal](https://portal.azure.com), or use Azure CLI commands. For example, to get the account keys, use the [az batch account keys list](/cli/azure/batch/account/keys#az_batch_account_keys_list) and [az storage account keys list](/cli/azure/storage/account/keys##az_storage_account_keys_list) commands.

```csharp
// Batch account credentials
private const string BatchAccountName = "mybatchaccount";
private const string BatchAccountKey  = "xxxxxxxxxxxxxxxxE+yXrRvJAqT9BlXwwo1CwF+SwAYOxxxxxxxxxxxxxxxx43pXi/gdiATkvbpLRl3x14pcEQ==";
private const string BatchAccountUrl  = "https://mybatchaccount.westeurope.batch.azure.com";

// Storage account credentials
private const string StorageAccountName = "mystorageaccount";
private const string StorageAccountKey  = "xxxxxxxxxxxxxxxxy4/xxxxxxxxxxxxxxxxfwpbIC5aAWA8wDu+AFXZB827Mt9lybZB1nUcQbQiUrkPtilK5BQ==";
```

Ensure that the ffmpeg application package reference in the solution matches the Id and version of the package that you uploaded to your Batch account in the previous step.

```csharp
const string appPackageId = "ffmpeg";
const string appPackageVersion = "3.4";
```

Right-click the solution in Solution Explorer and click **Build Solution**. Confirm the restoration of any NuGet packages, if you're prompted. If you need to download missing packages, ensure the [NuGet Package Manager](https://docs.nuget.org/consume/installing-nuget) is installed.

The following sections break down the sample application into the steps that it performs to process a workload in the Batch service. You will find it helpful to refer to the open solution in Visual Studio while you work your way through the rest of this article, since not every line of code in the sample is discussed.


## Blob and Batch clients

* To interact with the linked storage account, the app uses the Azure Storage Client Library for .NET. It creates a reference to the account with [CloudStorageAccount](/dotnet/api/microsoft.windowsazure.storage.cloudstorageaccount), and from that creates a [CloudBlobClient](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobclient).

  ```csharp
  // Construct the Storage account connection string
  string storageConnectionString = String.Format("DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1}",
  StorageAccountName, StorageAccountKey);

  // Retrieve the storage account
  CloudStorageAccount storageAccount = CloudStorageAccount.Parse(storageConnectionString);

  CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
  ```

* The app creates a [BatchClient](/dotnet/api/microsoft.azure.batch.batchclient) object to create and manage pools, jobs, and tasks in the Batch service. The Batch client in the sample uses shared key authentication:

  ```csharp
  BatchSharedKeyCredentials cred = new BatchSharedKeyCredentials(BatchAccountUrl, BatchAccountName, BatchAccountKey);

  BatchClient batchClient = BatchClient.Open(cred);
  ```

## Upload input files

The app passes the `blobClient` object to the `CreateContainerIfNotExistAsync` method to create a storage container for the input MP4 files.

```csharp
  CreateContainerIfNotExistAsync(blobClient, inputContainerName).Wait();
```

Then, files are uploaded to the container. The files in storage are defined as Batch [ResourceFile](/dotnet/api/microsoft.azure.batch.resourcefile) objects that Batch can later download to compute nodes. 

Two methods in `Program.cs` are involved in uploading the files:

* `UploadFilesToContainerAsync`: Returns a collection of ResourceFile objects and internally calls `UploadFileToContainerAsync` to upload each file that is passed in the `filePaths` parameter.
* `UploadFileToContainerAsync`: Uploads each file. After uploading the file, it obtains a shared access signature (SAS) for the file and returns a ResourceFile object to represent it. 
```csharp
  List<string> inputFilePaths = new List<string>(Directory.GetFileSystemEntries(@"..\..\InputFiles", "*.mp4",
                              SearchOption.TopDirectoryOnly));

  List<ResourceFile> inputFiles = UploadResourceFilesToContainer(
    blobClient,
    inputContainerName,
    inputFilePaths);
```

## Create a Batch pool

Next, the sample creates a pool of compute nodes in the Batch account with a call to `CreatePoolIfNoneExist`. `CreatePoolIfNoneExist` uses the [BatchClient.PoolOperations.CreatePool](/dotnet/api/microsoft.azure.batch.pooloperations.createpool) method to set the number of nodes, VM size, and a pool configuration. Here, a [VirtualMachineConfiguration](/dotnet/api/microsoft.azure.batch.virtualmachineconfiguration) object specifies an [ImageReference](/dotnet/api/microsoft.azure.batch.imagereference) to a Windows Server 2012 R2 image published in the Azure Marketplace.

The ffmpeg application is deployed to the compute nodes by adding an [ApplicationPackageReference](/dotnet/api/microsoft.azure.batch.applicationpackagereference) to the pool. 

The [Commit](/dotnet/api/microsoft.azure.batch.cloudpool.commit) method submits the pool to the Batch service.

```csharp
ImageReference imageReference = new ImageReference(
                        publisher: "MicrosoftWindowsServer",
                        offer: "WindowsServer",
                        sku: "2012-R2-Datacenter",
                        version: "latest");

VirtualMachineConfiguration virtualMachineConfiguration =
                new VirtualMachineConfiguration(
                    imageReference: imageReference,
                    nodeAgentSkuId: "batch.node.windows amd64");

pool = batchClient.PoolOperations.CreatePool(
                    poolId: poolId,
                    targetDedicatedComputeNodes: 5,
                    virtualMachineSize: "STANDARD_A1_v2",
                    virtualMachineConfiguration: virtualMachineConfiguration); 

pool.ApplicationPackageReferences = new List<ApplicationPackageReference>
                    {
                    new ApplicationPackageReference {
                    ApplicationId = appPackageId,
                    Version = appPackageVersion}};

pool.Commit();  
```

## Create a Batch job

A Batch job specifies a pool to run tasks on and optional settings such as a priority and schedule for the work. The sample creates a job with a call to `CreateJob`. `CreateJob` uses the [BatchClient.JobOperations.CreateJob](/dotnet/api/microsoft.azure.batch.joboperations.createjob) method to create a job on your pool. 

The [Commit](/dotnet/api/microsoft.azure.batch.cloudjob.commit) method submits the job to the Batch service. Initially the job has no tasks.

```csharp
CloudJob job = batchClient.JobOperations.CreateJob();
    job.Id = JobId;
    job.PoolInformation = new PoolInformation { PoolId = PoolId };

job.Commit();        
```

## Create tasks

The sample creates tasks in the job with a call to the     `CreateTasks` method. `CreateTasks` creates a list of [CloudTask](/dotnet/api/microsoft.azure.batch.cloudtask) objects. Each task processes an input `ResourceFile` object using a [CommandLine](/dotnet/api/microsoft.azure.batch.cloudtask.commandline) property. Here, the command line runs ffmpeg to convert each input MP4 file to and AVI file.

The sample creates an [OutputFile](/dotnet/api/microsoft.azure.batch.outputfile) object for the AVI file generated by each task. Each task's output files (one, in this case) are uploaded to a container in the linked storage account by using the task's [OutputFiles](/dotnet/api/microsoft.azure.batch.cloudtask.outputfiles) property.

Then, the sample adds tasks to the job with the [AddTaskAsync](/dotnet/api/microsoft.azure.batch.joboperations.addtask) method, which queues them to run on the compute nodes. 

```csharp
foreach (ResourceFile inputFile in inputFiles)
            {
                string taskId = "task_" + inputFiles.IndexOf(inputFile);

                // Define task command line to convert each input file.
                string appPath = String.Concat("%AZ_BATCH_APP_PACKAGE_", appPackageId, "#", appPackageVersion, "%");
                string inputVideoFile = inputFile.FilePath;
                string outputVideoFile = String.Format("{0}{1}",
                    System.IO.Path.GetFileNameWithoutExtension(inputVideoFile),
                    ".avi");
                
                string taskCommandLine = String.Format("cmd /c {0}\\ffmpeg-3.4-win64-static\\bin\\ffmpeg.exe -i {1} {2}", appPath, inputVideoFile, outputVideoFile);

                // Create a cloud task (with the task ID and command line) 
                CloudTask task = new CloudTask(taskId, taskCommandLine);
                task.ResourceFiles = new List<ResourceFile> { inputFile };
               

                // Task output file
                List<OutputFile> outputFileList = new List<OutputFile>();
                OutputFileBlobContainerDestination outputContainer = new OutputFileBlobContainerDestination(outputContainerSasUrl);
                OutputFile outputFile = new OutputFile(outputVideoFile,
                                                       new OutputFileDestination(outputContainer),
                                                        new OutputFileUploadOptions(OutputFileUploadCondition.TaskSuccess));
                outputFileList.Add(outputFile);
                task.OutputFiles = outputFileList;
                tasks.Add(task);
            }
batchClient.JobOperations.AddTaskAsync(jobId, tasks).Wait();
```

## Monitor tasks

When tasks are added to a job, they are automatically queued and scheduled for execution on compute nodes in the pool associated with the job. Based on the settings you specify, Batch handles all task queuing, scheduling, retrying, and other task administration duties.

There are many approaches to monitoring task execution. This sample reports only on completion and task failure or success states. Within the `MonitorTasks` method, the app specifies an [ODATADetailLevel](/dotnet/api/microsoft.azure.batch.odatadetaillevel) to efficiently select only minimal information about the tasks. Then, it creates a [TaskStateMonitor](/dotnet/api/microsoft.azure.batch.taskstatemonitor), which provides helper utilities for monitoring task states. In `MonitorTasks`, the sample waits for all tasks to reach `TaskState.Completed` within a time limit. Then it terminates the job.


## Download sample output
Now that the job is completed, the output from the tasks can be downloaded from Azure Storage. This is done with a call to the `DownloadBlobsFromContainer` method. `DownloadBlobsFromContainer` specifies that the files should be downloaded from the output file container to your %TEMP% folder f. Feel free to modify this output location.

```csharp
// Retrieve a reference to a previously created container
CloudBlobContainer container = blobClient.GetContainerReference(containerName);

// Get a flat listing of all the block blobs in the specified container
foreach (IListBlobItem item in container.ListBlobs(prefix: null, useFlatBlobListing: true))
{
// Retrieve reference to the current blob
loudBlob blob = (CloudBlob)item;

// Save blob contents to a file in the specified folder
string localOutputFile = Path.Combine(directoryPath, blob.Name);
blob.DownloadToFile(localOutputFile, FileMode.Create);
}            
```
## Clean up resources


## Run the app

When you run the sample application, the console output is similar to the following. During execution, you experience a pause at `Awaiting task completion, timeout in 00:30:00...` while the pool's compute nodes are started. Go to your Batch account in the Azure portal to monitor the pool, compute nodes, job, and tasks.

```
Sample start: 12/12/2017 3:20:21 PM

Container [input] created.
Container [output] creating
Uploading file ..\..\InputFiles\twc78.mp4 to container [input]...
Uploading file ..\..\InputFiles\twc79.mp4 to container [input]...
Uploading file ..\..\InputFiles\twc80.mp4 to container [input]...
Uploading file ..\..\InputFiles\twc81.mp4 to container [input]...
Uploading file ..\..\InputFiles\twc83.mp4 to container [input]...
Creating pool [WinFFmpegPool]...
Creating job [WinFFmpegJob]...
Adding 5 tasks to job [WinFFmpegJob]...
Awaiting task completion, timeout in 00:30:00...
Success! All tasks completed successfully within the specified timeout period.
Downloading all files from container [output]...
All files downloaded to C:\Users\danlep\AppData\Local\Temp

Sample end: 12/12/2017 3:29:36 PM
Elapsed time: 00:09:14.3418742
```

In this tutorial, you learned about how to:

> [!div class="checklist"]
> * W
> * X
> * Y
> * Z

Advance to the next tutorial to learn about ....  

> [!div class="nextstepaction"]

