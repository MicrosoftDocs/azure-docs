---
title: Persist job and task output to Azure Storage - Azure Batch | Microsoft Docs
description: Learn how to use Azure Storage as a durable store for your Batch task and job output, and enable viewing this persisted output in the Azure portal.
services: batch
documentationcenter: .net
author: tamram
manager: timlt
editor: ''

ms.assetid: 16e12d0e-958c-46c2-a6b8-7843835d830e
ms.service: batch
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: big-compute
ms.date: 06/07/2017
ms.author: tamram
ms.custom: H1Hack27Feb2017

---
# Use the Batch File Conventions for .NET to persist job and task data to Azure Storage

A task running in Azure Batch frequently produces output data when it runs. Task output data often needs to be stored and then later retrieved by other tasks in the job, the client application that executed the job, or both. While you can persist data to the file system of a Batch compute node, nodes are ephemeral, and all data on a node is lost when it is reimaged. Therefore it's important to persist task data that you'll need later to a data store such as Azure Storage.

One way to persist task data is to use the [Azure Batch File Conventions library for .NET]([nuget_package]). The Batch File Conventions library simplifies the process of storing task output data to Azure Storage and retrieving it. You can use the File Conventions library in both task and client code &mdash; in task code for persisting files, and in client code to list and retrieve them. Your task code can also use the library to retrieve the output of upstream tasks, such as in a [task dependencies](batch-task-dependencies.md) scenario. 

The File Conventions library names your storage containers and task output files according to the [Batch File Conventions standard](https://github.com/Azure/azure-sdk-for-net/tree/vs17Dev/src/SDKs/Batch/Support/FileConventions#conventions). The library provides classes and methods to upload output files to Azure Storage and to retrieve those files. To retrieve output files with the library, you can locate the files for a given job or task by listing them by ID and purpose. You don't need to know the names or locations of the files. For example, you can use the File Conventions library to list all intermediate files for a given task, or get a preview file for a given job.

If you are developing with a language other than .NET, you can implement the File Conventions standard yourself in your application. For more information, see [About the Batch File Conventions standard](batch-task-output.md#about-the-batch-file-conventions-standard).

Files persisted with the File Conventions library are automatically available for viewing in the Azure portal. 

For more information on different approaches for persisting output data in Azure Batch, see [Persist job and task output to Azure Storage](batch-task-output.md). 

## Link an Azure Storage account to your Batch account

To persist output data to Azure Storage using the File Conventions library, you must first [link an Azure Storage account](batch-application-packages.md#link-a-storage-account) to your Batch account. If you haven't done so already, link a Storage account to your Batch account by using the Azure portal:

**Batch account** blade > **Settings** > **Storage Account** > **Storage Account** (None) > Select a Storage account in your subscription

## Persist output

To persist job and task output data with the File Conventions library, create the storage container and then save the output to the container.

> [!WARNING]
> All job and task outputs are stored in the same container. If a large number of tasks try to persist files at the same time, [storage throttling limits](../storage/storage-performance-checklist.md#blobs) may be enforced.
> 
> 

### Create storage container

Before your tasks begin persisting output to storage, you must create a blob storage container to which they'll upload their output. Do this by calling [CloudJob][net_cloudjob].[PrepareOutputStorageAsync][net_prepareoutputasync]. This extension method takes a [CloudStorageAccount][net_cloudstorageaccount] object as a parameter, and creates a container named in such a way that its contents are discoverable by the Azure portal and the retrieval methods discussed later in the article.

You typically place the code to create a container in your client application &mdash; the application that creates your pools, jobs, and tasks.

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

Now that you've prepared a container in blob storage, tasks can save output to the container by using the [TaskOutputStorage][net_taskoutputstorage] class found in the File Conventions library.

In your task code, first create a [TaskOutputStorage][net_taskoutputstorage] object, then when the task has completed its work, call the [TaskOutputStorage][net_taskoutputstorage].[SaveAsync][net_saveasync] method to save its output to Azure Storage.

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

The `kind` parameter of the [TaskOutputStorage](https://msdn.microsoft.com/library/microsoft.azure.batch.conventions.files.taskoutputstorage.aspx).[SaveAsync](https://msdn.microsoft.com/library/microsoft.azure.batch.conventions.files.taskoutputstorage.saveasync.aspx) method categorizes the persisted files. There are four predefined [TaskOutputKind][net_taskoutputkind] types: `TaskOutput`, `TaskPreview`, `TaskLog`, and `TaskIntermediate.` You can also define custom categories of output.

These output types allow you to specify which type of outputs to list when you later query Batch for the persisted outputs of a given task. In other words, when you list the outputs for a task, you can filter the list on one of the output types. For example, "Give me the *preview* output for task *109*." More on listing and retrieving outputs appears in [Retrieve output](#retrieve-output) later in the article.

> [!TIP]
> The output kind also determines where in the Azure portal a particular file appears: *TaskOutput*-categorized files appear under "Task output files", and *TaskLog* files appear under "Task logs".
> 
> 

### Store job outputs

In addition to storing task outputs, you can store the outputs associated with an entire job. For example, in the merge task of a movie rendering job, you could persist the fully rendered movie as a job output. When your job is completed, your client application can list and retrieve the outputs for the job, and does not need to query the individual tasks.

Store job output by calling the [JobOutputStorage][net_joboutputstorage].[SaveAsync][net_joboutputstorage_saveasync] method, and specify the [JobOutputKind][net_joboutputkind] and filename:

```csharp
CloudJob job = await batchClient.JobOperations.GetJobAsync(jobId);
JobOutputStorage jobOutputStorage = job.OutputStorage(linkedStorageAccount);

await jobOutputStorage.SaveAsync(JobOutputKind.JobOutput, "mymovie.mp4");
await jobOutputStorage.SaveAsync(JobOutputKind.JobPreview, "mymovie_preview.mp4");
```

As with the **TaskOutputKind** type for task outputs, you use the [JobOutputKind][net_joboutputkind] type to categorize a job's persisted files. This parameter allows you to later query for (list) a specific type of output. The **JobOutputKind** type includes both output and preview categories, and supports creating custom categories.

### Store task logs

In addition to persisting a file to durable storage when a task or job completes, you may find it necessary to persist files that are updated during the execution of a task &mdash; log files or `stdout.txt` and `stderr.txt`, for example. For this purpose, the Azure Batch File Conventions library provides the [TaskOutputStorage][net_taskoutputstorage].[SaveTrackedAsync][net_savetrackedasync] method. With [SaveTrackedAsync][net_savetrackedasync], you can track updates to a file on the node (at an interval that you specify) and persist those updates to Azure Storage.

In the following code snippet, we use [SaveTrackedAsync][net_savetrackedasync] to update `stdout.txt` in Azure Storage every 15 seconds during the execution of the task:

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

The commented section `Code to process data and produce output file(s)` is simply a placeholder for the code that your task would normally perform. For example, you might have code that downloads data from Azure Storage and performs transformation or calculation on it. The important part of this snippet is demonstrating how you can wrap such code in a `using` block to periodically update a file with [SaveTrackedAsync][net_savetrackedasync].

The node agent is a program that runs on each node in the pool and provides the command-and-control interface between the node and the Batch service. The `Task.Delay` call is required at the end of this `using` block to ensure that the node agent has time to flush the contents of standard out to the stdout.txt file on the node. Without this delay, it is possible to miss the last few seconds of output. This delay may not be required for all files.

> [!NOTE]
> When you enable file tracking with SaveTrackedAsync, only *appends* to the tracked file are persisted to Azure Storage. Use this method only for tracking non-rotating log files or other files that are appended to, that is, data is only added to the end of the file when it's updated.
> 
> 

## Retrieve output

When you retrieve your persisted output using the Azure Batch File Conventions library, you do so in a task- and job-centric manner. You can request the output for given task or job without needing to know its path in blob Storage, or even its file name. You can simply say, "Give me the output files for task *109*."

The following code snippet iterates through all of a job's tasks, prints some information about the output files for the task, and then downloads its files from Storage.

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

The Azure portal displays task output files and logs that are persisted to a linked Azure Storage account using the File Conventions naming standard, as described in the [Azure Batch File Conventions README][github_file_conventions_readme]. You can implement these conventions yourself in a language of your choosing, or you can use the File Conventions library in your .NET applications.

To enable the display of your output files in the portal, you must satisfy the following requirements:

1. [Link an Azure Storage account](#requirement-linked-storage-account) to your Batch account.
2. Adhere to the predefined naming conventions for Storage containers and files when persisting outputs. You can find the definition of these conventions in the File Conventions library [README][github_file_conventions_readme]. If you use the [Azure Batch File Conventions][nuget_package] library to persist your output, your files are persisted according to the this requirement is satisfied.

To view task output files and logs in the Azure portal, navigate to the task whose output you are interested in, then click either **Saved output files** or **Saved logs**. This image shows the **Saved output files** for the task with ID "007":

![Task outputs blade in the Azure portal][2]

## Code sample

The [PersistOutputs][github_persistoutputs] sample project is one of the [Azure Batch code samples][github_samples] on GitHub. This Visual Studio solution demonstrates how to use the Azure Batch File Conventions library to persist task output to durable storage. To run the sample, follow these steps:

1. Open the project in **Visual Studio 2015 or newer**.
2. Add your Batch and Storage **account credentials** to **AccountSettings.settings** in the Microsoft.Azure.Batch.Samples.Common project.
3. **Build** (but do not run) the solution. Restore any NuGet packages if prompted.
4. Use the Azure portal to upload an [application package](batch-application-packages.md) for **PersistOutputsTask**. Include the `PersistOutputsTask.exe` and its dependent assemblies in the .zip package, set the application ID to "PersistOutputsTask", and the application package version to "1.0".
5. **Start** (run) the **PersistOutputs** project.

## Next steps

### Get the Batch File Conventions library for .NET

The Batch File Conventions library for .NET is available on [NuGet][nuget_package]. The library extends the [CloudJob][net_cloudjob] and [CloudTask][net_cloudtask] classes with new methods. 

The [source code][github_file_conventions] for the File Conventions library is available on GitHub in the Microsoft Azure SDK for .NET repository.

### Explore other approaches for persisting output data

- See [Persist job and task output to Azure Storage](batch-task-output.md) for an overview of persisting task and job data.
- See [Use the Batch service API to persist job and task data](batch-task-output-files.md) to learn how to use the Batch service API to persist output data.

[forum_post]: https://social.msdn.microsoft.com/Forums/en-US/87b19671-1bdf-427a-972c-2af7e5ba82d9/installing-applications-and-staging-data-on-batch-compute-nodes?forum=azurebatch
[github_file_conventions]: https://github.com/Azure/azure-sdk-for-net/tree/AutoRest/src/Batch/FileConventions
[github_file_conventions_readme]: https://github.com/Azure/azure-sdk-for-net/blob/AutoRest/src/Batch/FileConventions/README.md
[github_persistoutputs]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/PersistOutputs
[github_samples]: https://github.com/Azure/azure-batch-samples
[net_batchclient]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.batchclient.aspx
[net_cloudjob]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudjob.aspx
[net_cloudstorageaccount]: https://msdn.microsoft.com/library/azure/microsoft.windowsazure.storage.cloudstorageaccount.aspx
[net_cloudtask]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.aspx
[net_fileconventions_readme]: https://github.com/Azure/azure-sdk-for-net/blob/AutoRest/src/Batch/FileConventions/README.md
[net_joboutputkind]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.conventions.files.joboutputkind.aspx
[net_joboutputstorage]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.conventions.files.joboutputstorage.aspx
[net_joboutputstorage_saveasync]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.conventions.files.joboutputstorage.saveasync.aspx
[net_msdn]: https://msdn.microsoft.com/library/azure/mt348682.aspx
[net_prepareoutputasync]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.conventions.files.cloudjobextensions.prepareoutputstorageasync.aspx
[net_saveasync]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.conventions.files.taskoutputstorage.saveasync.aspx
[net_savetrackedasync]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.conventions.files.taskoutputstorage.savetrackedasync.aspx
[net_taskoutputkind]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.conventions.files.taskoutputkind.aspx
[net_taskoutputstorage]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.conventions.files.taskoutputstorage.aspx
[nuget_manager]: https://docs.nuget.org/consume/installing-nuget
[nuget_package]: https://www.nuget.org/packages/Microsoft.Azure.Batch.Conventions.Files
[portal]: https://portal.azure.com
[storage_explorer]: http://storageexplorer.com/

[1]: ./media/batch-task-output/task-output-01.png "Saved output files and Saved logs selectors in portal"
[2]: ./media/batch-task-output/task-output-02.png "Task outputs blade in the Azure portal"
