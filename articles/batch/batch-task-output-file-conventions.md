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
# Persist results from completed jobs and tasks to Azure Storage

An Azure Batch task typically produces output data. That output data often needs to be stored and then later retrieved by other tasks in the job, the client application that executed the job, or both. Batch compute nodes are ephemeral, and all data on a node is lost when it is reimaged, so it's important to persist task data in a data store such as Azure Storage.

Some examples of task output include:

- Files created when the task processes input data.
- Log files associated with task execution. 

This article introduces a .NET class library that uses a conventions-based approach to persist task output to Azure Blob storage, so that it is available after you delete your pools, jobs, and compute nodes.



By using the technique in this article, you can also view your task output in **Saved output files** and **Saved logs** in the [Azure portal][portal].



![Saved output files and Saved logs selectors in portal][1]

## Design considerations for persisting output 

When you design your Batch solution, you must consider several factors related to job and task outputs.

* **Compute node lifetime**: Compute nodes are often transient, especially in autoscale-enabled pools. Output from a task that runs on a node is available only while the node exists, and only within the file retention period you've set for the task. To ensure that task output is preserved, your tasks must upload their output files to a durable store such as Azure Storage.

* **Output storage**: To persist task output data to durable storage, use the [Azure Storage SDK](../storage/storage-dotnet-how-to-use-blobs.md) in your task code to upload the task output to a Blob storage container. It's recommended that you use a naming convention which helps you identify output files and the job or task that created them. To learn more about the recommended naming conventions, see [Azure Batch File Conventions readme](https://github.com/Azure/azure-sdk-for-net/tree/vs17Dev/src/SDKs/Batch/Support/FileConventions#conventions).

* **Output retrieval**: You can retrieve task output directly from the compute nodes in your pool, or from Azure Storage if you have persisted task output. To retrieve a task's output directly from a compute node, you need the file name and its output location on the node. If you persist task output to Azure Storage, then you need the full path to the file in Azure Storage to download the output files with the Azure Storage SDK.

* **Viewing output**: When you navigate to a Batch task in the Azure portal and select **Files on node**, you are presented with all files associated with the task, not just the output files you're interested in. Again, files on compute nodes are available only while the node exists and only within the file retention time you've set for the task. To view task output that you've persisted to Azure Storage, you can use the Azure portal or an Azure Storage client application such as the [Azure Storage Explorer][storage_explorer]. To view output data in Azure Storage with the portal or another tool, you must know the file's location and navigate to it directly.

## Batch File Conventions naming standard

If you implement a container and file naming convention, for example by using the [Azure Batch File Conventions][nuget_package] library for .NET, then your client application or other tasks in the job can locate and download task output based on the convention.


## Options for persisting output

There are a few different approaches you can take to persisting task output. The following sections describe each approach.

### Use the Batch service API

The Batch service API supports persisting task data to an Azure Storage account from pools created with the virtual machine configuration. With the Batch service API, you can persist task data without modifying the application that your task runs. You can optionally adhere to the [Batch File Conventions naming standard](https://github.com/Azure/azure-sdk-for-net/tree/vs17Dev/src/SDKs/Batch/Support/FileConventions#conventions) for naming the files that you persist to Azure Storage. 

Use the Batch service API to persist task output in these scenarios:

- When you need to persist data from Batch tasks and job manager tasks only.
- When you want to persist data to an Azure Storage container with an arbitrary name.
- When you want to persist data to an Azure Storage container named according to the [Batch File Conventions naming standard](https://github.com/Azure/azure-sdk-for-net/tree/vs17Dev/src/SDKs/Batch/Support/FileConventions#conventions). 

For more information on persisting task output with the Batch service API, see XXX.

### Use the Batch File Conventions library for .NET

Developers building Batch solutions with C# can use the [File Conventions library for .NET](https://www.nuget.org/packages/Microsoft.Azure.Batch.Conventions.Files) to persist task data to an Azure Storage account, according to the [Batch File Conventions naming standard](https://github.com/Azure/azure-sdk-for-net/tree/vs17Dev/src/SDKs/Batch/Support/FileConventions#conventions). The File Conventions library handles moving output files to Azure Storage and naming destination containers and blobs in a well-known way.

Use the Batch File Conventions library for .NET to persist task output in these scenarios:

- When you want to stream data to Azure Storage while the task is still running.
- When you want to persist data from pools created with the cloud service configuration.
- When you want to view task output in the Azure portal.

For more information on persisting task output with the File Conventions library for .NET, see XXX.

### Implement the Batch File Conventions naming standard

If you are using a language other than .NET, you can implement the [Batch File Conventions naming standard](https://github.com/Azure/azure-sdk-for-net/tree/vs17Dev/src/SDKs/Batch/Support/FileConventions#conventions) in your own application. 

You may want to implement the File Conventions naming standard yourself if you want to:

- View task output in the Azure portal.
- Persist data from pools created with the cloud service configuration.

### Implement a custom file movement solution

You can also implement your own complete file movement solution. Use this approach if you need to:

- Persist task data to a data store other than Azure Storage. To upload files to a data store like Azure SQL or Azure DataLake, you can create a custom script/executable to upload to
that location, and call it on the command line after running your primary executable. For example, on a Windows node, you might call these two commands: \`doMyWork.exe && uploadMyFilesToSql.exe\`
- Perform check-pointing or early upload of initial results.
- Maintain granular control over error handling. For example, you may want to implement your own file movement solution if you want to use task dependency actions to take certain upload actions based on specific task exit codes.


## Batch File Conventions library
[Azure Batch File Conventions][nuget_package] is a .NET class library that your Batch .NET applications can use to easily store and retrieve task output to and from Azure Storage. You can use the File Conventions library in both task and client code--in task code for persisting files, and in client code to list and retrieve them. Your task code can also use the library to retrieve the output of upstream tasks, such as in a [task dependencies](batch-task-dependencies.md) scenario. 

The File Conventions library establishes naming conventions for your storage containers and task output files, and provides classes and methods to upload output data to Azure Storage according to these conventions. When you retrieve output data, you can locate the output files for a given job or task by listing or retrieving them by ID and purpose. You don't need to know file names or file locations. For example, you can use the library to list all intermediate files for a given task, or get a preview file for a given job.



You can view task output files in the Azure portal. The portal is aware of the naming conventions provided by the File Conventions library, so that you can easily find task output files.




### Get the library
You can obtain the library, which contains new classes and extends the [CloudJob][net_cloudjob] and [CloudTask][net_cloudtask] classes with new methods, from [NuGet][nuget_package]. You can add it to your Visual Studio project using the [NuGet Library Package Manager][nuget_manager].

> [!TIP]
> You can find the [source code][github_file_conventions] for the Azure Batch File Conventions library on GitHub in the Microsoft Azure SDK for .NET repository.
> 
> 

## Requirement: linked storage account
To store outputs to durable storage using the file conventions library and view them in the Azure portal, you must [link an Azure Storage account](batch-application-packages.md#link-a-storage-account) to your Batch account. If you haven't already, link a Storage account to your Batch account by using the Azure portal:

**Batch account** blade > **Settings** > **Storage Account** > **Storage Account** (None) > Select a Storage account in your subscription

For a more detailed walk-through on linking a Storage account, see [Application deployment with Azure Batch application packages](batch-application-packages.md).

## Persist output
There are two primary actions to perform when saving job and task output with the file conventions library: create the storage container and save output to the container.

> [!WARNING]
> Because all job and task outputs are stored in the same container, [storage throttling limits](../storage/storage-performance-checklist.md#blobs) may be enforced if a large number of tasks try to persist files at the same time.
> 
> 

### Create storage container
Before your tasks begin persisting output to storage, you must create a blob storage container to which they'll upload their output. Do this by calling [CloudJob][net_cloudjob].[PrepareOutputStorageAsync][net_prepareoutputasync]. This extension method takes a [CloudStorageAccount][net_cloudstorageaccount] object as a parameter, and creates a container named in such a way that its contents are discoverable by the Azure portal and the retrieval methods discussed later in the article.

You typically place this code in your client application--the application that creates your pools, jobs, and tasks.

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
Now that you've prepared a container in blob storage, tasks can save output to the container by using the [TaskOutputStorage][net_taskoutputstorage] class found in the file conventions library.

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

The "output kind" parameter categorizes the persisted files. There are four predefined [TaskOutputKind][net_taskoutputkind] types: "TaskOutput", "TaskPreview", "TaskLog", and "TaskIntermediate." You can also define custom kinds if they would be useful in your workflow.

These output types allow you to specify which type of outputs to list when you later query Batch for the persisted outputs of a given task. In other words, when you list the outputs for a task, you can filter the list on one of the output types. For example, "Give me the *preview* output for task *109*." More on listing and retrieving outputs appears in [Retrieve output](#retrieve-output) later in the article.

> [!TIP]
> The output kind also designates where in the Azure portal a particular file appears: *TaskOutput*-categorized files appear in "Task output files", and *TaskLog* files appear in "Task logs."
> 
> 

### Store job outputs
In addition to storing task outputs, you can store the outputs associated with an entire job. For example, in the merge task of a movie rendering job, you could persist the fully rendered movie as a job output. When your job is completed, your client application can simply list and retrieve the outputs for the job, and does not need to query the individual tasks.

Store job output by calling the [JobOutputStorage][net_joboutputstorage].[SaveAsync][net_joboutputstorage_saveasync] method, and specify the [JobOutputKind][net_joboutputkind] and filename:

```
CloudJob job = await batchClient.JobOperations.GetJobAsync(jobId);
JobOutputStorage jobOutputStorage = job.OutputStorage(linkedStorageAccount);

await jobOutputStorage.SaveAsync(JobOutputKind.JobOutput, "mymovie.mp4");
await jobOutputStorage.SaveAsync(JobOutputKind.JobPreview, "mymovie_preview.mp4");
```

As with TaskOutputKind for task outputs, you use the [JobOutputKind][net_joboutputkind] parameter to categorize a job's persisted files. This parameter allows you to later query for (list) a specific type of output. The JobOutputKind includes both output and preview types, and supports creating custom types.

### Store task logs
In addition to persisting a file to durable storage when a task or job completes, you might find it necessary to persist files that are updated during the execution of a task--log files or `stdout.txt` and `stderr.txt`, for example. For this purpose, the Azure Batch File Conventions library provides the [TaskOutputStorage][net_taskoutputstorage].[SaveTrackedAsync][net_savetrackedasync] method. With [SaveTrackedAsync][net_savetrackedasync], you can track updates to a file on the node (at an interval that you specify) and persist those updates to Azure Storage.

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

`Code to process data and produce output file(s)` is simply a placeholder for the code that your task would normally perform. For example, you might have code that downloads data from Azure Storage and performs transformation or calculation on it. The important part of this snippet is demonstrating how you can wrap such code in a `using` block to periodically update a file with [SaveTrackedAsync][net_savetrackedasync].

The `Task.Delay` is required at the end of this `using` block to ensure that the node agent has time to flush the contents of standard out to the stdout.txt file on the node (the node agent is a program that runs on each node in the pool and provides the command-and-control interface between the node and the Batch service). Without this delay, it is possible to miss the last few seconds of output. This delay may not be required for all files.

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

## Task outputs and the Azure portal
The Azure portal displays task outputs and logs that are persisted to a linked Azure Storage account using the naming conventions found in the [Azure Batch File Conventions README][github_file_conventions_readme]. You can implement these conventions yourself in a language of your choosing, or you can use the file conventions library in your .NET applications.

### Enable portal display
To enable the display of your outputs in the portal, you must satisfy the following requirements:

1. [Link an Azure Storage account](#requirement-linked-storage-account) to your Batch account.
2. Adhere to the predefined naming conventions for Storage containers and files when persisting outputs. You can find the definition of these conventions in the file conventions library [README][github_file_conventions_readme]. If you use the [Azure Batch File Conventions][nuget_package] library to persist your output, this requirement is satisfied.

### View outputs in the portal
To view task outputs and logs in the Azure portal, navigate to the task whose output you are interested in, then click either **Saved output files** or **Saved logs**. This image shows the **Saved output files** for the task with ID "007":

![Task outputs blade in the Azure portal][2]

## Code sample
The [PersistOutputs][github_persistoutputs] sample project is one of the [Azure Batch code samples][github_samples] on GitHub. This Visual Studio solution demonstrates how to use the Azure Batch File Conventions library to persist task output to durable storage. To run the sample, follow these steps:

1. Open the project in **Visual Studio 2015 or newer**.
2. Add your Batch and Storage **account credentials** to **AccountSettings.settings** in the Microsoft.Azure.Batch.Samples.Common project.
3. **Build** (but do not run) the solution. Restore any NuGet packages if prompted.
4. Use the Azure portal to upload an [application package](batch-application-packages.md) for **PersistOutputsTask**. Include the `PersistOutputsTask.exe` and its dependent assemblies in the .zip package, set the application ID to "PersistOutputsTask", and the application package version to "1.0".
5. **Start** (run) the **PersistOutputs** project.

## Next steps
### Application deployment
The [application packages](batch-application-packages.md) feature of Batch provides an easy way to both deploy and version the applications that your tasks execute on compute nodes.

### Installing applications and staging data
Check out the [Installing applications and staging data on Batch compute nodes][forum_post] post in the Azure Batch forum for an overview of the various methods of preparing your nodes for running tasks. Written by one of the Azure Batch team members, this post is a good primer on the different ways to get files (including both applications and task input data) onto your compute nodes, and some special considerations for each method.

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
