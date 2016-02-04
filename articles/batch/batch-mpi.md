<properties
	pageTitle="Run MPI applications in Azure Batch with multi-instance tasks | Microsoft Azure"
	description="Learn how to execute Message Passing Interface (MPI) applications using the multi-instance task type in Azure Batch."
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
	ms.date="02/05/2016"
	ms.author="marsma" />

# Execute Message Passing Interface (MPI) applications in Azure Batch with multi-instance tasks

With multi-instance tasks, you can run an Azure Batch task on multiple compute nodes simultaneously to enable high performance computing scenarios like Message Passing Interface (MPI) applications. In this article, you will learn how to execute multi-instance tasks using the [Batch .NET][api_net] library.

## Multi-instance task overview

In Batch, each task is normally executed on a single compute node--you submit multiple tasks to a job, and the Batch service schedules each task for execution on a node. However, by configuring a task's **multi-instance settings**, you can instruct Batch to split that task into subtasks for execution on multiple nodes.

![Multi-instance task overview][1]

When you submit a task with multi-instance settings to a job, Batch performs several steps unique to multi-instance tasks:

1. The Batch service automatically splits the "main" task into **subtasks**, one of which acts as the **primary task**. Batch then schedules the primary and other subtasks for execution on the pool's compute nodes.
2. These tasks, both the primary and the other subtasks, download any **common resource files** that you specify in the multi-instance settings.
3. After the common resource files have been downloaded, the **coordination command** is executed by the primary and other subtasks. This coordination command is typically used to start a background service (such as [Microsoft MPI][msmpi_msdn]'s `smpd.exe`) and may also verify that the nodes are ready to process inter-node messages.
4. When the coordination command has been completed successfully by the primary and other subtasks, the main task's **command line** (the "application command") is executed *only* by the **primary task**. For example, in a Windows MPI scenario, you would typically execute your MPI-enabled application with [MS-MPI][msmpi_msdn]'s `mpiexec.exe` using the application command.

We'll get into the full details of configuring multi-instance settings shortly, but here is a short code snippet showing an example configuration using the Batch .NET library:

```
// Create the "main" task. Its command line will be executed *only* by the primary subtask, and
// only after all subtasks execute the CoordinationCommandLine.
CloudTask myMultiInstanceTask = new CloudTask(id: "mymultiinstancetask",
	commandline: "cmd /c mpiexec.exe -wdir %AZ_BATCH_TASK_SHARED_DIR% MyMPIApplication.exe");

// Configure the task's MultiInstanceSettings. The CoordinationCommandLine will be executed by
// *all* subtasks, including the primary.
myMultiInstanceTask.MultiInstanceSettings = new MultiInstanceSettings(numberOfNodes);
myMultiInstanceTask.MultiInstanceSettings.CoordinationCommandLine = @"cmd /c start cmd /c ""%MSMPI_BIN%\smpd.exe"" -d";
myMultiInstanceTask.MultiInstanceSettings.CommonResourceFiles = new List<ResourceFile>();
myMultiInstanceTask.MultiInstanceSettings.CommonResourceFiles.Add(
	new ResourceFile("https://mystorageaccount.blob.core.windows.net/mpi/MyMPIApplication.exe", "MyMPIApplication.exe"));

// Submit the task to the job. Batch will take care of splitting it into subtasks and
// scheduling them for execution on the nodes.
await batchClient.JobOperations.AddTaskAsync("mybatchjob", myMultiInstanceTask);
```

### The multi-instance task type

Unlike other special task types in Batch, like the [StartTask][net_starttask] ** and the [JobPreparationTask][net_jobprep], the "multi-instance task" is not actually a distinct task type. The multi-instance task is simply a standard Batch task whose multi-instance settings have been configured. In this article, we refer to this as the "main" task.

## Primary task and subtasks

When you create the multi-instance settings for a task, you specify the number of instances for the task--the number of compute nodes to execute task. When you submit the task to a job, the Batch service creates that number of subtasks, one of which it designates the "primary."

These subtasks, both the primary and the other subtasks, are assigned an integer ID in the range from 0 to *numberOfInstances - 1*. The subtask with id 0 is the primary task, and all other ids are subtasks. For example, if you create the following multi-instance settings for a task:

```
int numberOfNodes = 10;
myMultiInstanceTask.MultiInstanceSettings = new MultiInstanceSettings(numberOfNodes);
```

The primary task would have an id of 0, and the other subtasks would have ids 1 through 9.

## Coordination and application commands

The **coordination command** is executed by all subtasks, including the primary task. Once the primary task and all subtasks have finished executing the coordination command, the main task's command line is executed by the primary task *only*. We will call the main task's command line the "application command" to distinguish it from the coordination command.

The invocation of the coordination command is blocking--Batch does not execute the application command until the coordination command has returned successfully for all subtasks. The coordination command should therefore set up any required background services, verify that they are ready for use, and *then exit*. For example, a coordination command for a solution using MS-MPI version 7 might be:

`cmd /c start cmd /c ""%MSMPI_BIN%\smpd.exe"" -d`

Note the use of `start` in this coordination command. This is required because the `smpd.exe` application does not return immediately after execution. Without the use of the [start][cmd_start] command, this coordination command would not return, and would therefore block the application command from running.

The **application command**, the command line specified for the main task, is executed *only* by the primary subtask. For Windows MPI applications, this will be the execution of your `mpiexec.exe` command. For example, an application command for a solution using MS-MPI version 7 might be:

`cmd /c ""%MSMPI_BIN%\mpiexec.exe"" -c 1 -wdir %AZ_BATCH_TASK_SHARED_DIR% MyMPIApplication.exe`

## Resource files

You can specify one or more **common resource files** for the subtasks. These common resource files are downloaded from [Azure Storage](./../storage/storage-introduction.md) into the node's task shared directory by all of the subtasks, including the primary. The task shared directory is accessible using the `AZ_BATCH_TASK_SHARED_DIR` environment variable.

Resource files that you specify for the main task are downloaded to the task's working directory, `AZ_BATCH_TASK_WORKING_DIR`, by the primary subtask *only*--the other subtasks do not download the main task's resource files.

The contents of the `AZ_BATCH_TASK_SHARED_DIR` are accessible by all subtasks that execute on a node, including the primary. An example task shared directory is `tasks/myjob/job-1/mytask1/`. Each subtask, including the primary, has its own working directory accessible by that task only, and is accessible with the environment variable `AZ_BATCH_TASK_WORKING_DIR`.

> [AZURE.IMPORTANT] Always use the environment variables `AZ_BATCH_TASK_SHARED_DIR` and `AZ_BATCH_TASK_WORKING_DIR` to refer to the these directories in your command lines. Do not attempt to construct the paths manually.

## Task lifetime

The lifetime of the primary task controls the lifetime of the multi-instance task. When the primary exits, all other subtasks are terminated. The exit code of the primary is the exit code of the task, and is therefore used to determine the success or failure of the task for retry purposes.

If any of the subtasks fail, exiting with a non-zero return code, for example, the entire multi-instance task fails. The main task is terminated, and the entire multi-instance task is retried up to its retry limit.

Deleting a multi-instance task also deletes the primary and all other subtasks. All subtask root directories and files are deleted from their compute nodes, just as for a normal task.

The multi-instance task's `maxWallClockTime`, `maxRetryCount` and `retentionTime` settings are honored in the same way as a standard task, and apply to the primary and all subtasks. However, if you change the `retentionTime` property after adding the task to the job, this change is applied only to the primary task. All other subtasks will continue to use the original `retentionTime`.

A compute node's recent task list reflects the id of the subtask if the recent task was part of a multi-instance task.

## Obtain information about subtasks

**TODO: Change to .NET members**

To obtain information on the subtasks using the REST API, the **List the subtasks of a task** API can be used to obtain information on all subtasks except the primary. This API returns information such as the compute node on which the subtask is running, the subtask's working directory, and so on. You can use this information with the **List the files on a node** API to fetch subtask files. For a single-instance task, the **Get Subtasks** API will return an empty collection.

Unless stated otherwise, REST APIs that operate on tasks apply only to the primary subtask. For example, **Get Task Files** for any multi-instance task will fetch only task files from primary.

## Example: MPI with Batch .NET

**TODO: Add task monitoring, accessing subtasks, etc.**

This code snippet shows the creation of a [CloudTask][net_task] object with multi-instance settings using the [CloudTask.MultiInstanceSettings][net_multiinstance_prop] property:

```
// Create the "main" task. Its commandline will be executed *only* by the primary subtask, and
// only after all subtasks execute the CoordinationCommandLine.
CloudTask multiInstanceTask = new CloudTask(id: "mymultiinstancetask",
	commandline: "cmd /c mpiexec.exe -c 1 -wdir %AZ_BATCH_TASK_SHARED_DIR% MyMPIApplication.exe");

// Configure the task's MultiInstanceSettings. The CoordinationCommandLine will be executed by
// *all* subtasks, including the primary.
multiInstanceTask.MultiInstanceSettings = new MultiInstanceSettings(numNodes);
multiInstanceTask.MultiInstanceSettings.CoordinationCommandLine = @"cmd /c start cmd /c ""%MSMPI_BIN%\smpd.exe"" –d";
multiInstanceTask.MultiInstanceSettings.CommonResourceFiles = new List<ResourceFile>();
multiInstanceTask.MultiInstanceSettings.CommonResourceFiles.Add(
	new ResourceFile("https://mystorageaccount.blob.core.windows.net/mpi/MyMPIApplication.exe", "MyMPIApplication.exe"));

// Submit the task to the job. Batch will take care of splitting it into subtasks and
// scheduling them for execution on the nodes.
await batchClient.JobOperations.AddTaskAsync("mybatchjob", multiInstanceTask);
```

## Pool requirements for multi-instance tasks

Multi-instance tasks require a pool with **inter-node communication enabled**, and with **concurrent task execution disabled**. If you try to run a multi-instance task in a pool with internode communication disabled, or with a *maxTasksPerNode* value greater than 1, the task will never be scheduled--it will remain indefinitely in the "active" state.

Additionally, multi-instance tasks will execute *only* on nodes in **pools created after 12/14/2015**.


[api_net]: http://msdn.microsoft.com/library/azure/mt348682.aspx
[api_rest]: http://msdn.microsoft.com/library/azure/dn820158.aspx
[batch_explorer]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/BatchExplorer
[cmd_start]: https://technet.microsoft.com/library/cc770297.aspx
[github_samples]: https://github.com/Azure/azure-batch-samples
[msmpi_msdn]: https://msdn.microsoft.com/library/bb524831.aspx
[msmpi_sdk]: http://go.microsoft.com/FWLink/p/?LinkID=389556
[msmpi_howto]: http://blogs.technet.com/b/windowshpc/archive/2015/02/02/how-to-compile-and-run-a-simple-ms-mpi-program.aspx

[net_jobprep]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.jobpreparationtask.aspx
[net_multiinstance_class]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.multiinstancesettings.aspx
[net_multiinstance_prop]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.multiinstancesettings.aspx
[net_multiinsance_commonresfiles]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.multiinstancesettings.commonresourcefiles.aspx
[net_multiinstance_coordcmdline]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.multiinstancesettings.coordinationcommandline.aspx
[net_multiinstance_numinstances]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.multiinstancesettings.numberofinstances.aspx
[net_pool]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.aspx
[net_pool_create]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.createpool.aspx
[net_pool_starttask]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.starttask.aspx
[net_resourcefile]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.resourcefile.aspx
[net_starttask]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.starttask.aspx
[net_task]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.aspx

[rest_multiinstance]: https://msdn.microsoft.com/library/azure/mt637905.aspx

[1]: ./media/batch-mpi/batch_mpi_01.png "Multi-instance overview"
