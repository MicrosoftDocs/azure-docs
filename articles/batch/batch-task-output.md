<properties
	pageTitle="Job and task output persistence in Azure Batch | Microsoft Azure"
	description="Learn how to use Azure Storage as a durable store for your Batch task and job output, and enable viewing this persisted output in the Azure portal."
	services="batch"
	documentationCenter=".net"
	authors="mmacy"
	manager="timlt"
	editor="" />

<tags
	ms.service="batch"
	ms.devlang="multiple"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows"
	ms.workload="big-compute"
	ms.date="08/04/2016"
	ms.author="marsma" />

# Persist Azure Batch job and task output

The tasks you run in Batch typically produce output that must be stored and then later retrieved by other tasks in the job, the client application that executed the job, or both. This output might be files created by processing input data or log files associated with task execution. This article introduces a .NET class library that uses a conventions-based technique to persist such task output to Azure Blob storage, making it available even after you delete your pools, jobs, and compute nodes.

By using the technique in this article, you will also be able to view your task output in **Saved output files** and **Saved logs** in the [Azure portal][portal].

![Saved output files and Saved logs selectors in portal][1]

>[AZURE.NOTE] The file storage and retrieval method discussed here provides similar functionality to the way **Batch Apps** (now deprecated) managed its task outputs.

## Task output considerations

When you design your Batch solution, you must consider several factors related job and task outputs.

* **Compute node lifetime**: Compute nodes are often transient, especially in autoscale-enabled pools. The outputs of the tasks that run on a node are available only while the node exists, and only within the file retention time you've set for the task. To ensure that the task output is preserved, your tasks must therefore upload their output files to a durable store, for example, Azure Storage.

* **Output storage**: To persist task output data to durable storage, you can use the [Azure Storage SDK](../storage/storage-dotnet-how-to-use-blobs.md) in your task code to upload the task output to a Blob storage container. If you implement a container and file naming convention, your client application or other tasks in the job can then locate and download this output based on the convention.

* **Output retrieval**: You can retrieve task output directly from the compute nodes in your pool, or from Azure Storage if your tasks persist their output. To retrieve a task's output directly from a compute node, you need the file name and its output location on the node. If you persist output to Azure Storage, downstream tasks or your client application must have the full path to the file in Azure Storage in order to download it by using the Azure Storage SDK.

* **Viewing output**: When you navigate to a Batch task in the Azure portal and select **Files on node**, you are presented with all of the files associated with the task, not just the output file(s) you're interested in. Again, files on compute nodes are available only while the node exists and only within the file retention time you've set for the task. To view task output that you've persisted to Azure Storage in the portal or an application like the [Azure Storage Explorer][storage_explorer], you must know its location and navigate to the file directly.

## Help for persisted output

To help you more easily persist job and task output, the Batch team has defined and implemented a set of naming conventions as well as a .NET class library, the [Azure Batch File Conventions][nuget_package] library, that you can use in your Batch applications. In addition, the Azure portal is aware of these naming conventions so that you can easily find the files you've stored by using the library.

## Using the file conventions library

[Azure Batch File Conventions][nuget_package] is a .NET class library that your Batch .NET applications can use to easily store and retrieve task outputs to and from Azure Storage. It is intended for use in both task and client code--in task code for persisting files, and in client code to list and retrieve them. Your tasks can also use the library for retrieving the outputs of upstream tasks, such as in a [task dependencies](batch-task-dependencies.md) scenario.

The conventions library takes care of ensuring that storage containers and task output files are named according to the convention, and are uploaded to the right place when persisted to Azure Storage. When you retrieve outputs, you can easily locate the outputs for a given job or task by listing or retrieving the outputs by ID and purpose, instead of having to know filenames or where it exists in Storage.

For example, you can use the library to "list all intermediate files for task 7," or "get me the thumbnail preview for job *mymovie*," without needing to know the file names or location within your Storage account.

### Get the library

You can obtain the library, which contains new classes and extends the [CloudJob][net_cloudjob] and [CloudTask][net_cloudtask] classes with new methods, from [NuGet][nuget_package]. You can add it to your Visual Studio project using the [NuGet Library Package Manager][nuget_manager].

>[AZURE.TIP] You can find the [source code][github_file_conventions] for the Azure Batch File Conventions library on GitHub in the Microsoft Azure SDK for .NET repository.

## Requirement: linked storage account

To store outputs to durable storage using the file conventions library and view them in the Azure portal, you must [link an Azure Storage account](batch-application-packages.md#link-a-storage-account) to your Batch account. If you haven't already, link a Storage account to your Batch account by using the Azure portal:

**Batch account** blade > **Settings** > **Storage Account** > **Storage Account** (None) > Select a Storage account in your subscription

For a more detailed walk-through on linking a Storage account, see [Application deployment with Azure Batch application packages](batch-application-packages.md).

## Persist output

There are two primary actions to perform when saving job and task output with the file conventions library: create the storage container and save output to the container.

>[AZURE.WARNING] Because all job and task outputs are stored in the same container, [storage throttling limits](../storage/storage-performance-checklist.md#blobs) may be enforced if a large number of tasks try to persist files at the same time.

### Create storage container

Before your tasks begin persisting output to storage, you must create a blob storage container to which the they'll upload their output. Do this by calling [CloudJob][net_cloudjob].[PrepareOutputStorageAsync][net_prepareoutputasync]. This extension method takes a [CloudStorageAccount][net_cloudstorageaccount] object as a parameter, and will create a container named in such a way that its contents are discoverable by the Azure portal and the retrieval methods discussed later in the article.

You typically will place this code in your client application--the application that creates your pools, jobs, and tasks.

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

Now that you've prepared a container in blob storage, tasks can save output to the container by using the [TaskOutputStorage][net_taskoutputstorage] class found in the file conventions libary.

In your task code, first create a [TaskOutputStorage][net_taskoutputstorage] object, then when the task has completed its work, call the  [TaskOutputStorage][net_taskoutputstorage].[SaveAsync][net_saveasync] method to save its output to Azure Storage.

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

The "output kind" parameter categorizes the persisted files. There are four predefined [TaskOutputKind][net_taskoutputkind] types: "TaskOutput", "TaskPreview", "TaskLog", and "TaskIntermediate". You can also define custom kinds if they would be useful in your workflow.

These output types allow you to specify which type of outputs to list when you later query Batch for the persisted outputs of a given task. In other words, when you list the outputs for a task, you can filter the list on one of the output types. For example, "Give me the *preview* output for task *109*." More on listing and retrieving outputs appears in [Retrieve output](#retrieve-output) later in the article.

>[AZURE.TIP] The output kind also designates where in the Azure portal a particular file will appear: *TaskOutput*-categorized files will appear in "Task output files", and *TaskLog* files will appear in "Task logs".

### Store job outputs

In addition to storing task outputs, you can store the outputs associated with an entire job. For example, in the merge task of a movie rendering job, you could persist the fully rendered movie as a job output. When your job is completed, your client application can simply list and retrieve the outputs for the job, and does not need to query the individual tasks.

Store job output by calling the [JobOutputStorage][net_joboutputstorage].[SaveAsync][net_joboutputstorage_saveasync] method, and specify the [JobOutputKind][net_joboutputkind] and filename:

```
CloudJob job = await batchClient.JobOperations.GetJobAsync(jobId);
JobOutputStorage jobOutputStorage = job.OutputStorage(linkedStorageAccount);

await jobOutputStorage.SaveAsync(JobOutputKind.JobOutput, "mymovie.mp4");
await jobOutputStorage.SaveAsync(JobOutputKind.JobPreview, "mymovie_preview.mp4");
```

As with TaskOutputKind for task outputs, you use the [JobOutputKind][net_joboutputkind] parameter to categorize a job's persisted files. This allows you to later query for (list) a specific type of output. The JobOutputKind includes both output and preview types, and supports creating custom types.

### Store task logs

In addition to persisting a file to durable storage when a task or job completes, you might find it necessary to persist files that are updated during the execution of a task--log files or `stdout.txt` and `stderr.txt`, for example. For this purpose, the Azure Batch File Conventions library provides the [TaskOutputStorage][net_taskoutputstorage].[SaveTrackedAsync][net_savetrackedasync] method. With [SaveTrackedAsync][net_savetrackedasync], you can track updates to a file on the node (at an interval that you specify) and persist those updates to Azure Storage.

In the following code snippet, we use [SaveTrackedAsync][net_savetrackedasync] to update `stdout.txt` in Azure Storage every 15 seconds during the execution of the task:

```csharp
string logFilePath = Path.Combine(
	Environment.GetEnvironmentVariable("AZ_BATCH_TASK_DIR"), "stdout.txt");

using (ITrackedSaveOperation stdout =
		taskStorage.SaveTrackedAsync(
		TaskOutputKind.TaskLog,
		logFilePath,
		"stdout.txt",
		TimeSpan.FromSeconds(15)))
{
	/* Code to process data and produce output file(s) */
}
```

`Code to process data and produce output file(s)` is simply a placeholder for the code that your task would normally perform. For example, you might have code that downloads data from Azure Storage and performs some sort of transformation or calculation on it. The important part of this snippet is demonstrating how you can wrap such code in a `using` block to periodically update a file with  [SaveTrackedAsync][net_savetrackedasync].

>[AZURE.NOTE] When you enable file tracking with SaveTrackedAsync, only *appends* to the tracked file are persisted to Azure Storage. You should use this method only for tracking non-rotating log files or other files that are appended to, that is, data is only added to the end of the file when it's updated.

## Retrieve output

When you retrieve your persisted output using the Azure Batch File Conventions library, you do so in a task- and job-centric manner. You can request the output for given task or job without needing to know its path in blob Storage, or even its file name. You can simply say, "Give me the output files for task *109*."

The code snippet below iterates through all of a job's tasks, prints some information about the output files for the task, and then downloads its files from Storage.

```csharp
foreach (CloudTask task in myJob.ListTasks())
{
    foreach (TaskOutputStorage output in
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

The Azure portal will display task outputs and logs that are persisted to a linked Azure Storage account using the naming conventions found in the [Azure Batch File Conventions README][github_file_conventions_readme]. You can implement these conventions yourself in a language of your choosing, or you can use the file conventions library in your  .NET applications.

### Enable portal display

To enable the display of your outputs in the portal, you must satisfy the following requirements:

 1. [Link an Azure Storage account](#requirement-linked-storage-account) to your Batch account.
 2. Adhere to the predefined naming conventions for Storage containers and files.
 You can find the definition of these conventions in the file conventions library [README][github_file_conventions_readme]. If you use the [Azure Batch File Conventions][nuget_package] library to persist your output, this requirement is satisfied.

### View outputs in the portal

To view task outputs and logs in the Azure portal, navigate to the task whose output you are interested in, then click either **Saved output files** or **Saved logs**. This image shows the **Saved output files** for the task with ID "007":

![Task outputs blade in the Azure portal][2]

## Code sample

The [PersistOutputs][github_taskdependencies] sample project is one of the [Azure Batch code samples][github_samples] on GitHub. This Visual Studio 2015 solution demonstrates how to use the Azure Batch File Conventions library to persist task output to durable storage. To run the sample, follow these steps:

1. Open the project in **Visual Studio 2015**.
2. Add your Batch and Storage **account credentials** to **AccountSettings.settings** in the Microsoft.Azure.Batch.Samples.Common project.
3. **Build** (but do not run) the solution. Restore any NuGet packages if prompted.
4. Use the Azure portal to upload an [application package](batch-application-packages.md) for **PersistOutputTask**. Include the `PersistOutputTask.exe` and its dependent assemblies in the .zip package, and set the application ID to "PersistOutputTask".
5. **Start** (run) the **PersistOutputs** project.

## Next steps

### Application deployment

The [application packages](batch-application-packages.md) feature of Batch provides an easy way to both deploy and version the applications that your tasks execute on compute nodes.

### Installing applications and staging data

Check out the [Installing applications and staging data on Batch compute nodes][forum_post] post in the Azure Batch forum for an overview of the various methods of preparing your nodes for running tasks. Written by one of the Azure Batch team members, this post is a good primer on the different ways to get files (including both applications and task input data) onto your compute nodes, and some special considerations to take into account for each method.

[forum_post]: https://social.msdn.microsoft.com/Forums/en-US/87b19671-1bdf-427a-972c-2af7e5ba82d9/installing-applications-and-staging-data-on-batch-compute-nodes?forum=azurebatch
[github_taskdependencies]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/TaskDependencies
[github_samples]: https://github.com/Azure/azure-batch-samples
[github_file_conventions]: https://github.com/Azure/azure-sdk-for-net/tree/AutoRest/src/Batch/FileConventions
[github_file_conventions_readme]: https://github.com/Azure/azure-sdk-for-net/blob/AutoRest/src/Batch/FileConventions/README.md
[net_batchclient]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.batchclient.aspx
[net_cloudjob]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudjob.aspx
[net_cloudtask]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.aspx
[net_cloudstorageaccount]: https://msdn.microsoft.com/library/azure/microsoft.windowsazure.storage.cloudstorageaccount.aspx
[net_dependson]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.dependson.aspx
[net_exitcode]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.taskexecutioninformation.exitcode.aspx
[net_fileconventions_readme]: https://github.com/Azure/azure-sdk-for-net/blob/AutoRest/src/Batch/FileConventions/README.md
[net_msdn]: https://msdn.microsoft.com/library/azure/mt348682.aspx
[net_onid]: https://msdn.microsoft.com/library/microsoft.azure.batch.taskdependencies.onid.aspx
[net_onids]: https://msdn.microsoft.com/library/microsoft.azure.batch.taskdependencies.onids.aspx
[net_onidrange]: https://msdn.microsoft.com/library/microsoft.azure.batch.taskdependencies.onidrange.aspx
[net_prepareoutputasync]: https://msdn.microsoft.com/library/azure/mt348682.aspx
[net_saveasync]: https://msdn.microsoft.com/library/azure/mt348682.aspx
[net_joboutputkind]: https://msdn.microsoft.com/library/azure/mt348682.aspx
[net_taskoutputkind]: https://msdn.microsoft.com/library/azure/mt348682.aspx
[net_taskoutputstorage]: https://msdn.microsoft.com/library/azure/mt348682.aspx
[net_taskoutputstorage]: https://msdn.microsoft.com/library/azure/mt348682.aspx
[net_savetrackedasync]: https://msdn.microsoft.com/library/azure/mt348682.aspx
[net_joboutputstorage]: https://msdn.microsoft.com/library/azure/mt348682.aspx
[net_joboutputstorage_saveasync]: https://msdn.microsoft.com/library/azure/mt348682.aspx
[net_taskexecutioninformation]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.taskexecutioninformation.aspx
[net_taskstate]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.common.taskstate.aspx
[net_usestaskdependencies]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudjob.usestaskdependencies.aspx
[net_taskdependencies]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.taskdependencies.aspx
[nuget_manager]: https://docs.nuget.org/consume/installing-nuget
[nuget_package]: https://www.nuget.org/packages/Microsoft.Azure.Batch.Conventions.Files
[portal]: https://portal.azure.com
[storage_explorer]: http://storageexplorer.com/

[1]: ./media/batch-task-output/task-output-01.png "Saved output files and Saved logs selectors in portal"
[2]: ./media/batch-task-output/task-output-02.png "Task outputs blade in the Azure portal"