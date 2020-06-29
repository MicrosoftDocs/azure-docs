---
title: Persist output data to Azure Storage with .NET File Conventions library
description: Learn how to use Azure Batch File Conventions library for .NET to persist Batch task & job output to Azure Storage, and view that output in the Azure portal.
ms.topic: how-to
ms.date: 11/14/2018
ms.custom: H1Hack27Feb2017

---
# Persist job and task data to Azure Storage with the Batch File Conventions library for .NET

[!INCLUDE [batch-task-output-include](../../includes/batch-task-output-include.md)]

One way to persist task data is to use the [Azure Batch File Conventions library for .NET][nuget_package]. The File Conventions library simplifies the process of storing task output data to Azure Storage and retrieving it. You can use the File Conventions library in both task and client code &mdash; in task code for persisting files, and in client code to list and retrieve them. Your task code can also use the library to retrieve the output of upstream tasks, such as in a [task dependencies](batch-task-dependencies.md) scenario.

To retrieve output files with the File Conventions library, you can locate the files for a given job or task by listing them by ID and purpose. You don't need to know the names or locations of the files. For example, you can use the File Conventions library to list all intermediate files for a given task, or get a preview file for a given job.

> [!TIP]
> Starting with version 2017-05-01, the Batch service API supports persisting output data to Azure Storage for tasks and job manager tasks that run on pools created with the virtual machine configuration. The Batch service API provides a simple way to persist output from within the code that creates a task and serves as an alternative to the File Conventions library. You can modify your Batch client applications to persist output without needing to update the application that your task is running. For more information, see [Persist task data to Azure Storage with the Batch service API](batch-task-output-files.md).

## When do I use the File Conventions library to persist task output?

Azure Batch provides more than one way to persist task output. The File Conventions is best suited to these scenarios:

- You can easily modify the code for the application that your task is running to persist files using the File Conventions library.
- You want to stream data to Azure Storage while the task is still running.
- You want to persist data from pools created with either the cloud service configuration or the virtual machine configuration.
- Your client application or other tasks in the job needs to locate and download task output files by ID or by purpose.
- You want to view task output in the Azure portal.

If your scenario differs from those listed above, you may need to consider a different approach. For more information on other options for persisting task output, see [Persist job and task output to Azure Storage](batch-task-output.md).

## What is the Batch File Conventions standard?

The [Batch File Conventions standard](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/batch/Microsoft.Azure.Batch.Conventions.Files) provides a naming scheme for the destination containers and blob paths to which your output files are written. Files persisted to Azure Storage that adhere to the File Conventions standard are automatically available for viewing in the Azure portal. The portal is aware of the naming convention and so can display files that adhere to it.

The File Conventions library for .NET automatically names your storage containers and task output files according to the File Conventions standard. The File Conventions library also provides methods to query output files in Azure Storage according to job ID, task ID, or purpose.

If you are developing with a language other than .NET, you can implement the File Conventions standard yourself in your application. For more information, see [Implement the Batch File Conventions standard](batch-task-output.md#implement-the-batch-file-conventions-standard).

## Link an Azure Storage account to your Batch account

To persist output data to Azure Storage using the File Conventions library, you must first link an Azure Storage account to your Batch account. If you haven't done so already, link a Storage account to your Batch account by using the [Azure portal](https://portal.azure.com):

1. Navigate to your Batch account in the Azure portal.
1. Under **Settings**, select **Storage Account**.
1. If you do not already have a Storage account associated with your Batch account, click **Storage Account (None)**.
1. Select a Storage account from the list for your subscription. For best performance, use an Azure Storage account that is in the same region as the Batch account where your tasks are running.

## Persist output data

To persist job and task output data with the File Conventions library, create a container in Azure Storage, then save the output to the container. Use the [Azure Storage client library for .NET](https://www.nuget.org/packages/WindowsAzure.Storage) in your task code to upload the task output to the container.

For more information about working with containers and blobs in Azure Storage, see [Get started with Azure Blob storage using .NET](../storage/blobs/storage-dotnet-how-to-use-blobs.md).

> [!WARNING]
> All job and task outputs persisted with the File Conventions library are stored in the same container. If a large number of tasks try to persist files at the same time, Azure Storage throttling limits may be enforced. For more information about throttling limits, see [Performance and scalability checklist for Blob storage](../storage/blobs/storage-performance-checklist.md).

### Create storage container

To persist task output to Azure Storage, first create a container by calling [CloudJob][net_cloudjob].[PrepareOutputStorageAsync][net_prepareoutputasync]. This extension method takes a [CloudStorageAccount][net_cloudstorageaccount] object as a parameter. It creates a container named according to the File Conventions standard, so that its contents are discoverable by the Azure portal and the retrieval methods discussed later in the article.

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

Now that you've prepared a container in Azure Storage, tasks can save output to the container by using the [TaskOutputStorage][net_taskoutputstorage] class found in the File Conventions library.

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

The `kind` parameter of the [TaskOutputStorage](/dotnet/api/microsoft.azure.batch.conventions.files.taskoutputstorage).[SaveAsync](/dotnet/api/microsoft.azure.batch.conventions.files.taskoutputstorage.saveasync#overloads) method categorizes the persisted files. There are four predefined [TaskOutputKind][net_taskoutputkind] types: `TaskOutput`, `TaskPreview`, `TaskLog`, and `TaskIntermediate.` You can also define custom categories of output.

These output types allow you to specify which type of outputs to list when you later query Batch for the persisted outputs of a given task. In other words, when you list the outputs for a task, you can filter the list on one of the output types. For example, "Give me the *preview* output for task *109*." More on listing and retrieving outputs appears in Retrieve output later in the article.

> [!TIP]
> The output kind also determines where in the Azure portal a particular file appears: *TaskOutput*-categorized files appear under **Task output files**, and *TaskLog* files appear under **Task logs**.

### Store job outputs

In addition to storing task outputs, you can store the outputs associated with an entire job. For example, in the merge task of a movie rendering job, you could persist the fully rendered movie as a job output. When your job is completed, your client application can list and retrieve the outputs for the job, and does not need to query the individual tasks.

Store job output by calling the [JobOutputStorage][net_joboutputstorage].[SaveAsync][net_joboutputstorage_saveasync] method, and specify the [JobOutputKind][net_joboutputkind] and filename:

```csharp
CloudJob job = new JobOutputStorage(acct, jobId);
JobOutputStorage jobOutputStorage = job.OutputStorage(linkedStorageAccount);

await jobOutputStorage.SaveAsync(JobOutputKind.JobOutput, "mymovie.mp4");
await jobOutputStorage.SaveAsync(JobOutputKind.JobPreview, "mymovie_preview.mp4");
```

As with the **TaskOutputKind** type for task outputs, you use the [JobOutputKind][net_joboutputkind] type to categorize a job's persisted files. This parameter allows you to later query for (list) a specific type of output. The **JobOutputKind** type includes both output and preview categories, and supports creating custom categories.

### Store task logs

In addition to persisting a file to durable storage when a task or job completes, you may need to persist files that are updated during the execution of a task &mdash; log files or `stdout.txt` and `stderr.txt`, for example. For this purpose, the Azure Batch File Conventions library provides the [TaskOutputStorage][net_taskoutputstorage].[SaveTrackedAsync][net_savetrackedasync] method. With [SaveTrackedAsync][net_savetrackedasync], you can track updates to a file on the node (at an interval that you specify) and persist those updates to Azure Storage.

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

The commented section `Code to process data and produce output file(s)` is a placeholder for the code that your task would normally perform. For example, you might have code that downloads data from Azure Storage and performs transformation or calculation on it. The important part of this snippet is demonstrating how you can wrap such code in a `using` block to periodically update a file with [SaveTrackedAsync][net_savetrackedasync].

The node agent is a program that runs on each node in the pool and provides the command-and-control interface between the node and the Batch service. The `Task.Delay` call is required at the end of this `using` block to ensure that the node agent has time to flush the contents of standard out to the stdout.txt file on the node. Without this delay, it is possible to miss the last few seconds of output. This delay may not be required for all files.

> [!NOTE]
> When you enable file tracking with **SaveTrackedAsync**, only *appends* to the tracked file are persisted to Azure Storage. Use this method only for tracking non-rotating log files or other files that are written to with append operations to the end of the file.

## Retrieve output data

When you retrieve your persisted output using the Azure Batch File Conventions library, you do so in a task- and job-centric manner. You can request the output for given task or job without needing to know its path in Azure Storage, or even its file name. Instead, you can request output files by task or job ID.

The following code snippet iterates through a job's tasks, prints some information about the output files for the task, and then downloads its files from Storage.

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

The Azure portal displays task output files and logs that are persisted to a linked Azure Storage account using the [Batch File Conventions standard](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/batch/Microsoft.Azure.Batch.Conventions.Files). You can implement these conventions yourself in the a language of your choice, or you can use the File Conventions library in your .NET applications.

To enable the display of your output files in the portal, you must satisfy the following requirements:

1. Link an Azure Storage account to your Batch account.
1. Adhere to the predefined naming conventions for Storage containers and files when persisting outputs. You can find the definition of these conventions in the File Conventions library [README][github_file_conventions_readme]. If you use the [Azure Batch File Conventions][nuget_package] library to persist your output, your files are persisted according to the File Conventions standard.

To view task output files and logs in the Azure portal, navigate to the task whose output you are interested in, then click either **Saved output files** or **Saved logs**. This image shows the **Saved output files** for the task with ID "007":

![Task outputs blade in the Azure portal][2]

## Code sample

The [PersistOutputs][github_persistoutputs] sample project is one of the [Azure Batch code samples][github_samples] on GitHub. This Visual Studio solution demonstrates how to use the Azure Batch File Conventions library to persist task output to durable storage. To run the sample, follow these steps:

1. Open the project in **Visual Studio 2019**.
2. Add your Batch and Storage **account credentials** to **AccountSettings.settings** in the Microsoft.Azure.Batch.Samples.Common project.
3. **Build** (but do not run) the solution. Restore any NuGet packages if prompted.
4. Use the Azure portal to upload an [application package](batch-application-packages.md) for **PersistOutputsTask**. Include the `PersistOutputsTask.exe` and its dependent assemblies in the .zip package, set the application ID to "PersistOutputsTask", and the application package version to "1.0".
5. **Start** (run) the **PersistOutputs** project.
6. When prompted to choose the persistence technology to use for running the sample, enter **1** to run the sample using the File Conventions library to persist task output. 

## Next steps

### Get the Batch File Conventions library for .NET

The Batch File Conventions library for .NET is available on [NuGet][nuget_package]. The library extends the [CloudJob][net_cloudjob] and [CloudTask][net_cloudtask] classes with new methods. Also see the [reference documentation](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.conventions.files) for the File Conventions library.

The [source code][github_file_conventions] for the File Conventions library is available on GitHub in the Microsoft Azure SDK for .NET repository. 

### Explore other approaches for persisting output data

- See [Persist job and task output to Azure Storage](batch-task-output.md) for an overview of persisting task and job data.
- See [Persist task data to Azure Storage with the Batch service API](batch-task-output-files.md) to learn how to use the Batch service API to persist output data.

[forum_post]: https://social.msdn.microsoft.com/Forums/en-US/87b19671-1bdf-427a-972c-2af7e5ba82d9/installing-applications-and-staging-data-on-batch-compute-nodes?forum=azurebatch
[github_file_conventions]: https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/batch/Microsoft.Azure.Batch.Conventions.Files
[github_file_conventions_readme]: https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/batch/Microsoft.Azure.Batch.Conventions.Files/README.md
[github_persistoutputs]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/PersistOutputs
[github_samples]: https://github.com/Azure/azure-batch-samples
[net_batchclient]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.batchclient.aspx
[net_cloudjob]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudjob.aspx
[net_cloudstorageaccount]: https://docs.microsoft.com/java/api/com.microsoft.azure.storage.cloudstorageaccount
[net_cloudtask]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.aspx
[net_fileconventions_readme]: https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/batch/Microsoft.Azure.Batch.Conventions.Files/README.md
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
[storage_explorer]: https://storageexplorer.com/

[1]: ./media/batch-task-output/task-output-01.png "Saved output files and Saved logs selectors in portal"
[2]: ./media/batch-task-output/task-output-02.png "Task outputs blade in the Azure portal"
