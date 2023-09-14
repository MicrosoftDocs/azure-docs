---
title: Persist output data to Azure Storage with .NET File Conventions library
description: Learn how to persist Azure Batch task and job output to Azure Storage using the Batch File Conventions library for .NET to persist Batch task & job output to Azure Storage.
ms.topic: how-to
ms.date: 12/20/2021
ms.devlang: csharp
ms.custom: H1Hack27Feb2017, devx-track-csharp, devx-track-dotnet
---
# Persist job and task data to Azure Storage with the Batch File Conventions library for .NET

[!INCLUDE [batch-task-output-include](../../includes/batch-task-output-include.md)]

You can persist task data from Azure Batch using the [File Conventions library for .NET](https://www.nuget.org/packages/Microsoft.Azure.Batch.Conventions.Files). The File Conventions library simplifies the process of storing and retrieving task output data in Azure Storage. You can use the File Conventions library in both task and client code. In task mode, use the library to persist files. In client mode, use the library to list and retrieve files. Your task code can also retrieve the output of upstream tasks using the library, such as in a [task dependencies](batch-task-dependencies.md) scenario.

To retrieve output files with the File Conventions library, locate the files for a job or task. You don't need to know the names or locations of the files. Instead, you can list the files by ID and purpose. For example, list all intermediate files for a given task. Or, get a preview file for a given job.

Starting with version 2017-05-01, the Batch service API supports persisting output data to Azure Storage for tasks and job manager tasks that run on pools created with the virtual machine (VM) configuration. You can persist output from within the code that creates a task. This method is an alternative to the File Conventions library. You can modify your Batch client applications to persist output without needing to update the application that your task is running. For more information, see [Persist task data to Azure Storage with the Batch service API](batch-task-output-files.md).

## Library use cases

Azure Batch provides multiple ways to persist task output. Use the File Conventions library when you want to:

- Modify the code for the application that your task is running to persist files.
- Stream data to Azure Storage while the task is still running.
- Persist data from pools.
- Locate and download task output files by ID or purpose in your client application or other tasks.
- [View task output in the Azure portal](#view-output-files-in-the-azure-portal).

For other scenarios, you might want to consider a different approach. For more information on other options, see [Persist job and task output to Azure Storage](batch-task-output.md).

## What is the Batch File Conventions standard?

The [Batch File Conventions standard](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/batch/Microsoft.Azure.Batch.Conventions.Files) provides a naming scheme for the destination containers and blob paths to which your output files are written. Files persisted to Azure storage that follow the standard are [automatically viewable in the Azure portal](#view-output-files-in-the-azure-portal). 

The File Conventions library for .NET automatically names your storage containers and task output files according to the standard. The library also provides methods to query output files in Azure Storage. You can query by job ID, task ID, or purpose.

If you're developing with a language other than .NET, you can implement the File Conventions standard yourself in your application. For more information, see [Implement the Batch File Conventions standard](batch-task-output.md#batch-file-conventions-standard).

## Link an Azure Storage account

To persist output data to Azure Storage using the File Conventions library, first link an Azure Storage account to your Batch account.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Batch** in the search bar.
1. Select the Batch account to link with Azure Storage.
1. On the Batch account page, under **Settings**, select **Storage Account**.
1. If you don't already have an Azure Storage account associated with your Batch account, select **Storage Account (None)**.
1. Select the Azure Storage account to use. For best performance, use an account in the same region as the Batch account.

## Persist output data

You can persist job and task output data with the File Conventions library. First, create a container in Azure Storage. Then, save the output to the container. Use the [Azure Storage client library for .NET](https://www.nuget.org/packages/WindowsAzure.Storage) in your task code to upload the task output to the container.

For more information about working with containers and blobs in Azure Storage, see [Get started with Azure Blob storage using .NET](../storage/blobs/storage-quickstart-blobs-dotnet.md).

All job and task outputs persisted with the File Conventions library are stored in the same container. If a large number of tasks try to persist files at the same time, Azure Storage throttling limits might be enforced. For more information, see [Performance and scalability checklist for Blob storage](../storage/blobs/storage-performance-checklist.md).

### Create storage container

To persist task output to Azure Storage, first create a container by calling [CloudJob](/dotnet/api/microsoft.azure.batch.cloudjob).[PrepareOutputStorageAsync](/dotnet/api/microsoft.azure.batch.conventions.files.cloudjobextensions.prepareoutputstorageasync). This extension method takes a [CloudStorageAccount](/java/api/com.microsoft.azure.storage.cloudstorageaccount) object as a parameter. The method creates a container named according to the File Conventions standard. The container's contents are discoverable by the Azure portal and the retrieval methods described in this article.

Typically, create a container in your client application, which creates your pools, jobs, and tasks. For example:

```csharp
CloudJob job = batchClient.JobOperations.CreateJob(
    "myJob",
    new PoolInformation { PoolId = "myPool" });

// Create reference to the linked Azure Storage account
CloudStorageAccount linkedStorageAccount =
    new CloudStorageAccount(myCredentials, true);

// Create the blob storage container for the outputs
await job.PrepareOutputStorageAsync(linkedStorageAccount);
```

### Store task outputs

After [creating your storage container](#create-storage-container), tasks can save output to the container using [TaskOutputStorage](/dotnet/api/microsoft.azure.batch.conventions.files.taskoutputstorage). This class is available in the File Conventions library.

In your task code, create a [TaskOutputStorage](/dotnet/api/microsoft.azure.batch.conventions.files.taskoutputstorage) object. When the task completes its work, call the [TaskOutputStorage](/dotnet/api/microsoft.azure.batch.conventions.files.taskoutputstorage).[SaveAsync](/dotnet/api/microsoft.azure.batch.conventions.files.taskoutputstorage.saveasync) method. This step saves the output to Azure Storage.

```csharp
CloudStorageAccount linkedStorageAccount = new CloudStorageAccount(myCredentials);
string jobId = Environment.GetEnvironmentVariable("AZ_BATCH_JOB_ID");
string taskId = Environment.GetEnvironmentVariable("AZ_BATCH_TASK_ID");

TaskOutputStorage taskOutputStorage = new TaskOutputStorage(
    linkedStorageAccount, jobId, taskId);

/* Code to process data and produce output file(s) */

await taskOutputStorage.SaveAsync(TaskOutputKind.TaskOutput, "frame_full_res.jpg");
await taskOutputStorage.SaveAsync(TaskOutputKind.TaskPreview, "frame_low_res.jpg");
```

The `kind` parameter of the [TaskOutputStorage](/dotnet/api/microsoft.azure.batch.conventions.files.taskoutputstorage).[SaveAsync](/dotnet/api/microsoft.azure.batch.conventions.files.taskoutputstorage.saveasync#overloads) method categorizes the persisted files. There are four predefined [TaskOutputKind](/dotnet/api/microsoft.azure.batch.conventions.files.taskoutputkind) types: `TaskOutput`, `TaskPreview`, `TaskLog`, and `TaskIntermediate.` You can also define custom categories of output.

Specify what type of outputs to list when you query Batch later. Then, when you list the outputs for a task, you can filter on one of the output types. For example, filter to *"Give me the **preview** output for task **109**."* For more information, see [Retrieve output data](#retrieve-output-data).

The output type also determines where an [output file appears in the Azure portal](#view-output-files-in-the-azure-portal). Files in the category **TaskOutput** are under **Task output files**. Files in the category **TaskLog** are under **Task logs**.

### Store job outputs

You can also store the outputs associated with an entire job. For example, in the merge task of a movie-rendering job, you can persist the fully rendered movie as a job output. When your job completes, your client application can list and retrieve the outputs for the job. Your client application doesn't have to query the individual tasks.

Store job output by calling the [JobOutputStorage](/dotnet/api/microsoft.azure.batch.conventions.files.joboutputstorage).[SaveAsync](/dotnet/api/microsoft.azure.batch.conventions.files.joboutputstorage.saveasync) method. Specify the [JobOutputKind](/dotnet/api/microsoft.azure.batch.conventions.files.joboutputkind) and filename. For example:

```csharp
CloudJob job = new JobOutputStorage(acct, jobId);
JobOutputStorage jobOutputStorage = job.OutputStorage(linkedStorageAccount);

await jobOutputStorage.SaveAsync(JobOutputKind.JobOutput, "mymovie.mp4");
await jobOutputStorage.SaveAsync(JobOutputKind.JobPreview, "mymovie_preview.mp4");
```

As with the **TaskOutputKind** type for task outputs, use the [JobOutputKind](/dotnet/api/microsoft.azure.batch.conventions.files.joboutputkind) type to categorize a job's persisted files. Later, you can list a specific type of output. The **JobOutputKind** type includes both output and preview categories. The type also supports creating custom categories.

### Store task logs

You might also need to persist files that are updated during the execution of a task. For example, you might need to persist log files, or `stdout.txt` and `stderr.txt`. The File Conventions library provides the [TaskOutputStorage](/dotnet/api/microsoft.azure.batch.conventions.files.taskoutputstorage).[SaveTrackedAsync](/dotnet/api/microsoft.azure.batch.conventions.files.taskoutputstorage.savetrackedasync) method to persist these kinds of files. Track updates to a file on the node at a specified interval with [SaveTrackedAsync](/dotnet/api/microsoft.azure.batch.conventions.files.taskoutputstorage.savetrackedasync). Then, persist those updates to Azure Storage.

The following example uses [SaveTrackedAsync](/dotnet/api/microsoft.azure.batch.conventions.files.taskoutputstorage.savetrackedasync) to update `stdout.txt` in Azure Storage every 15 seconds during the execution of the task:

```csharp
TimeSpan stdoutFlushDelay = TimeSpan.FromSeconds(3);
string logFilePath = Path.Combine(
    Environment.GetEnvironmentVariable("AZ_BATCH_TASK_DIR"), "stdout.txt");

// The primary task logic is wrapped in a using statement that sends updates to
// the stdout.txt blob in Storage every 15 seconds while the task code runs.
using (ITrackedSaveOperation stdout =
        await taskStorage.SaveTrackedAsync(
        TaskOutputKind.TaskLog,
        logFilePath,
        "stdout.txt",
        TimeSpan.FromSeconds(15)))
{
    /* Code to process data and produce output file(s) */

    // We are tracking the disk file to save our standard output, but the
    // node agent may take up to 3 seconds to flush the stdout stream to
    // disk. So give the file a moment to catch up.
     await Task.Delay(stdoutFlushDelay);
}
```

Replace the commented section `Code to process data and produce output file(s)` with whatever code your task normally does. For example, you might have code that downloads data from Azure Storage, then performs transformations or calculations. You can wrap this code in a `using` block to periodically update a file with [SaveTrackedAsync](/dotnet/api/microsoft.azure.batch.conventions.files.taskoutputstorage.savetrackedasync).

The node agent is a program that runs on each node in the pool. This program provides the command-and-control interface between the node and the Batch service. The `Task.Delay` call is required at the end of this `using` block. The call makes sure that the node agent has time to flush the contents of standard to the `stdout.txt` file on the node. Without this delay, it's possible to miss the last few seconds of output. You might not need this delay for all files.

When you enable file tracking with **SaveTrackedAsync**, only *appends* to the tracked file are persisted to Azure Storage. Only use this method for tracking non-rotating log files, or other files that are written to with append operations to the end of the file.

## Retrieve output data

To retrieve output files for a specific task or job, you don't need to know the path in Azure Storage, or file names. Instead, you can request output files by task or job ID.

The following example code iterates through a job's tasks. Next, the code prints some information about the output files for the task. Then, the code downloads the files from AzureStorage.

```csharp
foreach (CloudTask task in myJob.ListTasks())
{
    foreach (OutputFileReference output in
        task.OutputStorage(storageAccount).ListOutputs(
            TaskOutputKind.TaskOutput))
    {
        Console.WriteLine($"output file: {output.FilePath}");

        output.DownloadToFileAsync(
            $"{jobId}-{output.FilePath}",
            System.IO.FileMode.Create).Wait();
    }
}
```

## View output files in the Azure portal

If your task output files use the [Batch File Conventions standard](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/batch/Microsoft.Azure.Batch.Conventions.Files), you can view the files in the Azure portal. 

To enable the display of your output files in the portal, you must satisfy the following requirements:

For output files to automatically display in the Azure portal, you must:

1. [Link an Azure Storage account to your Batch account](#link-an-azure-storage-account).
1. Follow the predefined naming conventions for Azure Storage containers and files. Review the [README](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/batch/Microsoft.Azure.Batch.Conventions.Files/README.md) for all definitions. If you use the [File Conventions library](https://www.nuget.org/packages/Microsoft.Azure.Batch.Conventions.Files) to persist your output, your files are persisted according to the File Conventions standard.

To view task output files and logs in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to the task for which you want to view output.
1. Select either **Saved output files** or **Saved logs**. 

## Code sample

The [PersistOutputs](https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/PersistOutputs) sample project is one of the [Azure Batch code samples](https://github.com/Azure/azure-batch-samples) on GitHub. This Visual Studio solution shows how to use the Azure Batch File Conventions library to persist task output to durable storage. To run the sample, follow these steps:

1. Open the project in **Visual Studio 2019**.
1. Add your Batch and Azure Storage account credentials to **AccountSettings.settings** in the **Microsoft.Azure.Batch.Samples.Common** project.
1. Build the solution. Don't run the solution yet. 
1. If prompted, restore any NuGet packages.
1. Upload an [application package](batch-application-packages.md) for **PersistOutputsTask** through the Azure portal. 
    1. Include the `PersistOutputsTask.exe` executable and its dependent assemblies in the .zip package. 
    1. Set the application ID to `PersistOutputsTask`.
    1. Set the application package version to `1.0`.
1. Select **Start** to run the project.
1. When prompted to select the persistence technology to use, enter **1**. This option runs the sample using the File Conventions library to persist task output. 

## Get the Batch File Conventions library for .NET

The Batch File Conventions library for .NET is available on [NuGet](https://www.nuget.org/packages/Microsoft.Azure.Batch.Conventions.Files). The library extends the [CloudJob](/dotnet/api/microsoft.azure.batch.cloudjob) and [CloudTask](/dotnet/api/microsoft.azure.batch.cloudtask) classes with new methods. For more information, see the [File Conventions library reference documentation](/dotnet/api/microsoft.azure.batch.conventions.files).

The [File Conventions library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/batch/Microsoft.Azure.Batch.Conventions.Files) is available on GitHub. 

### Next steps

- [Persist job and task output to Azure Storage](batch-task-output.md)
- [Persist task data to Azure Storage with the Batch service API](batch-task-output-files.md)
