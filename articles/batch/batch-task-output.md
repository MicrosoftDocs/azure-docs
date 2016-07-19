<properties
	pageTitle="Task output persistence in Azure Batch | Microsoft Azure"
	description="Use the "
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
	ms.date="07/24/2016"
	ms.author="marsma" />

# Output persistence for Azure Batch tasks

Your Batch tasks typically produce some form of output that must be stored when the tasks complete and then later retrieved--by other tasks in the job, the client application that executed the job, or both. This output might be files created by a task processing input data, or log files associated with task execution. This article details a conventions-based method and .NET class library that you can use to persist such task output to Azure Blob storage for later retrieval, even after you delete your pools, jobs, and compute nodes.

Following the conventions in this article will also allow you to see your task output in "Saved output files" and "Saved logs" in the [Azure portal][portal].

![Saved output files and Saved logs selectors in portal][1]

>[AZURE.NOTE] The file storage and retrieval method discussed here provides similar functionality to the way **Batch Apps** (now deprecated) managed its task outputs.

## Task output challenges

Storing and retrieving task output presents several challenges:

* **Compute node lifetime**: Compute nodes are often transient, especially in autoscale-enabled pools. The outputs of the tasks that run on a node are available only while the node exists, and only within the file retention time you've set for the task. To ensure that the task output is preserved, your tasks must therefore upload their output files to a durable store, for example, Azure Storage.

* **Storing output**: To persist task output data to durable storage, you would typically use the [Azure Storage SDK](../storage/storage-dotnet-how-to-use-blobs.md) directly in your task application, with each task uploading its output data to a Blob storage container. In most situations, you must design and implement a strict naming convention so that other tasks in the job (such as a merge task) or your client application can determine the path of, and then download, this output.

* **Retrieving output**: If you wish to retrieve a task's output directly from a compute node, you must know the file name and its output location on the node. If, however, your task stores its output to Azure Storage, you must write the code to first determine the full path to the file in Azure Storage, then to download the file using the Azure Storage SDK. There is currently no built-in feature of the Batch SDK to determine which output files are associated with a certain task--you must determine or track this manually.

* **Viewing output**: Previously, if you wanted to view an individual task's outputs in the Azure portal, you had to navigate to the task and then view the *Files on node*. This presents *all* of the files associated with the task--not just the output file(s) you're interested in--and these files are as transient as the compute nodes on which they reside. For output that your tasks "manually" persisted to Azure Storage, you needed to know where in Storage it was uploaded to, then navigate to the files within your Azure Storage account in the portal. The Azure portal now supports viewing persisted Batch task output, and in the remainder of this article, you'll learn how to enable this for your tasks.

## Solving task output challenges

To address these challenges, the Batch team has defined and implemented a set of naming conventions for persisting Batch job and task data to Azure Storage. We've implemented these conventions in a .NET class library which can greatly simplify persistence to durable storage. The Azure portal is aware of these conventions so that you can view the job and task output you've stored this way.

## Using the file conventions library

[Azure Batch File Conventions][net_fileconventions_readme] (NOT FINAL URL) is a .NET class library that your Batch .NET applications can use to easily store and retrieve task outputs to and from Azure Storage. It is intended for use in both task and client code--in task code to persist files, and in client code to list and retrieve them. Your tasks can also implement the library for retrieving the outputs of upstream tasks, such as in a [task dependencies](batch-task-dependencies.md) scenario.

The conventions library takes care of ensuring that everything is named correctly and is uploaded to the right place when persisting output. When you retrieve outputs, you can easily locate the outputs for a given job or task by listing or retrieving the outputs by ID and purpose. For example, you can use the library to "list all intermediate files for task 7," or "get me the thumbnail preview for job *mymovie*," without needing to know the file names or location within your Storage account.

### Get the library

You can obtain the library, which contains new classes and extends the [CloudJob][net_cloudjob] and [CloudTask][net_cloudtask] classes with new methods, from [NuGet][nuget_package] (NOT FINAL URL). You can add it to your Visual Studio project using the [NuGet Library Package Manager][nuget_manager].

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

>[AZURE.NOTE] When you enable file tracking with SaveTrackedAsync, only *appends* to the tracked file are persisted to Azure Storage. You should use this method only for tracking non-rotating log files or other files that are appended to, that is, data is only added to the end of the file when it's updated.

## Retrieve output

When you retrieve your persisted output using the Azure Batch File Conventions library, you do so in a task- and job-centric manner. You can request the output for given task or job without needing to know its path in blob Storage, or even its file name. You can simply say, "Give me the output files for task *109*."

The code snippet below iterates through all of a job's tasks, prints some information about the output files for the task, and then downloads its files from Storage.

```csharp
foreach (CloudTask task in myJob.ListTasks().ToList())
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

## View output in the Azure portal

You can use the Azure portal to view task outputs and logs that you persist to Azure Storage using the conventions described in this article. Navigate to the task whose output you are interested in, then click either "Saved output files" or "Saved logs."

To enable this support, you must satisfy the following requirements:

 1. [Link an Azure Storage account](#requirement-linked-storage-account) to your Batch account.
 2. Adhere to a set of predefined **naming conventions** for Storage containers and files. If you use the [Azure Batch File Conventions][net_fileconventions_readme] (NOT FINAL URL) library to persist your output, this requirement is satisfied.

![Task outputs blade in the Azure portal][2]

## Code sample

The [PersistOutputs][github_taskdependencies] sample project is one of the [Azure Batch code samples][github_samples] on GitHub. This Visual Studio 2015 solution demonstrates how to use the Azure Batch File Conventions library to persist task output to durable storage. To run the sample, follow these steps:

1. Open the project in **Visual Studio 2015**.
2. Add your Batch and Storage **account credentials** to **AccountSettings.settings** in the Microsoft.Azure.Batch.Samples.Common project.
3. **Build** (but do not run) the solution. Restore any NuGet packages if prompted.
4. Use the Azure portal to upload an [application package](batch-application-packages.md) for **PersistOutputTask**. Include the `PersistOutputTask.exe` and its dependent assemblies in the ZIP package, and set the application ID to "PersistOutputTask".
5. Use the Azure portal to **create a pool** (id: "PersistOutputsSamplePool") with one Standard_A1 compute node.
6. **Start** (run) the **PersistOutputs** project.

## Next steps

### Application deployment

The [application packages](batch-application-packages.md) feature of Batch provides an easy way to both deploy and version the applications that your tasks execute on compute nodes.

### Installing applications and staging data

Check out the [Installing applications and staging data on Batch compute nodes][forum_post] post in the Azure Batch forum for an overview of the various methods of preparing your nodes for running tasks. Written by one of the Azure Batch team members, this post is a good primer on the different ways to get files (including both applications and task input data) onto your compute nodes, and some special considerations to take into account for each method.

[forum_post]: https://social.msdn.microsoft.com/Forums/en-US/87b19671-1bdf-427a-972c-2af7e5ba82d9/installing-applications-and-staging-data-on-batch-compute-nodes?forum=azurebatch
[github_taskdependencies]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/TaskDependencies
[github_samples]: https://github.com/Azure/azure-batch-samples
[net_batchclient]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.batchclient.aspx
[net_cloudjob]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudjob.aspx
[net_cloudtask]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.aspx
[net_cloudstorageaccount]: https://msdn.microsoft.com/library/azure/microsoft.windowsazure.storage.cloudstorageaccount.aspx
[net_dependson]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.dependson.aspx
[net_exitcode]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.taskexecutioninformation.exitcode.aspx
[net_fileconventions_readme]: https://github.com/Azure/batch-sdk-for-net-pr/blob/batch/develop/src/Batch/FileConventions/README.md
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
[nuget_package]: https://www.nuget.org/packages/Azure.Batch/
[portal]: https://portal.azure.com

[1]: ./media/batch-task-output/task-output-01.png "Saved output files and Saved logs selectors in portal"
[2]: ./media/batch-task-output/task-output-02.png "Task outputs blade in the Azure portal"