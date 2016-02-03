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

With multi-instance tasks, you can simultaneously run an Azure Batch task on multiple compute nodes to enable high performance computing scenarios like Message Passing Interface (MPI) applications. In this article, you will learn how to execute multi-instance tasks with the [Batch .NET][api_net] library and [Batch REST][api_rest] API.

## Multi-instance task overview

In Batch, each task is normally executed on a single compute node--you submit multiple tasks to a job, and the Batch service schedules each task for execution on a node. However, by configuring a task's **multi-instance settings**, you can instruct Batch to split that task into subtasks for execution on multiple nodes.

![Multi-instance task overview][1]

When you submit a task with multi-instance settings to a job, Batch performs a number of steps unique to multi-instance tasks:

1. The Batch service automatically splits the "main" task into **subtasks**, one of which acts as the **primary task**. Batch then schedules the primary and other subtasks for execution on the nodes.
2. These tasks, both the primary and the other subtasks, download any **common resource files** that you specify in the multi-instance settings.
3. After the common resource files have been downloaded, the **coordination command** is executed by the primary and subtasks. This coordination command is typically used to start a background service (such as [Microsoft MPI][msmpi_msdn]'s `smpd.exe`) and may also verify that the nodes are ready to process inter-node messages.
4. When the coordination command has been successfully completed by the primary and other subtasks, the main task's **command line** (the "application command") is executed *only* by the **primary task**. For example, in a Windows MPI scenario, you would typically execute your MPI-enabled application with [MS-MPI][msmpi_msdn]'s `mpiexec.exe` using the application command.

We'll get into the full details of configuring multi-instance settings shortly, but here is a short code snippet showing an example configuration using the Batch .NET library:

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

## Define"multi-instance task"

Unlike special task types like the StartTask or the JobPreparationTask, the "multi-instance task" is not a distinct task type. The multi-instance task is a merely a standard Batch task whose multi-instance settings have been configured.

The number of instances (BLAH in Batch .NET, BLAH in the REST API) specifies how many compute nodes are to be used, one of which will execute the primary task, and the others will execute the subtasks.

The the primary and subtasks are distinguished by an integer id in the range from `0` to `numberOfInstances - 1`. Subtask id `0` is the primary task, and all other ids are subtasks.

## Pool requirements for multi-instance tasks

Multi-instance tasks require a pool with **inter-node communication enabled**, and with **concurrent task execution disabled**. If you try to run a multi-instance task in a pool with internode communication disabled, or with a *maxTasksPerNode* value greater than 1, the task will never be scheduled--it will remain indefinitely in the "active" state.

Additionally, multi-instance tasks will execute *only* on nodes in **pools created after 12/14/2015**.

### Coordination and application commands

The coordination command (BLAH in Batch .NET, BLAH in the REST API) runs on the primary task and all subtasks. Once the primary task and all subtasks have finished executing the coordination command, the main task command line is executed by on the primary task only. The main task command line in a multi-instance task is commonly referred as the "application command," to distinguish it from the coordination command.

The invocation of the coordination command is blocking--Batch does not run the main task command line until the coordination command has returned successfully in all subtasks. Therefore, the coordination command should set up any required background services, verify that they are ready for use, and then return. For example, the coordination command for MS-MPI version 7 is `cmd /c start cmd /c "%MSMPI_BIN%\smpd.exe" –d`. Note that the coordination command must include `start` because `smpd.exe` does not return immediately, and would therefore block the application command from running.

The application command line is executed only on the primary. For Windows MPI applications, this should be the `mpiexec.exe` command line. For example, an MS-MPI version 7 command line might be `"%MSMPI_BIN%\mpiexec.exe" -wdir %AZ_BATCH_TASK_SHARED_DIR% -c num-mpi-processes-per-node MyMPIApplication.exe`.

> [AZURE.TIP] You can examine the `stderr.txt` to determine if a failure exit code came from the coordination command or the application command.

### Resource files

The Batch service creates an environment variable `AZ_BATCH_TASK_SHARED_DIR` which is the same for all subtasks including the primary. An example shared directory is `tasks/myjob/job-1/mytask1/`. Each subtask (including primary) has its own working directory, specified in the environment variable `AZ_BATCH_TASK_WORKING_DIR`. Always use the environment variables `AZ_BATCH_TASK_SHARED_DIR` or `AZ_BATCH_TASK_WORKING_DIR` to refer to the task shared directory and subtask working directories; do not attempt to construct the paths manually.

Resource files specified for the task are downloaded to the task's working directory (`AZ_BATCH_TASK_WORKING_DIR`) on the *primary only*. Common resource files, however, are downloaded into the task shared directory (`AZ_BATCH_TASK_SHARED_DIR`) by *all tasks*, both primary and all subtasks.

### Task lifetime

The lifetime of the primary task controls the lifetime of the multi-instance task. When the primary exits, all other subtasks are terminated. The exit code of the primary is the exit code of the task, and is therefore used to determine the success or failure of the task for retry purposes.

Once the multi-instance task starts running, if any subtask (including the primary) fails, for example exits with a nonzero exit code, the entire multi-instance task fails. It is terminated, and the complete multi-instance task is retried up to its retry limit.

Deleting a multi-instance task also deletes its primary task and all subtasks. All subtask root directories and files are deleted from their compute nodes, just as for a normal task.

The multi-instance task's `maxWallClockTime`, `maxRetryCount` and `retentionTime` settings are honored in the same way as a single-instance task, and apply to the primary and all subtasks. However, if you change the `retentionTime` setting after adding the task, the change is applied only to the primary task; subtasks continue to use their original `retentionTime`.

A compute node's recent task list reflects subtaskId if the recent task was part of a multi-instance task.

### Obtain information about subtasks

To obtain information on the subtasks using the REST API, the **List the subtasks of a task** API can be used to obtain information on all subtasks except the primary. This API returns information such as the compute node on which the subtask is running, the subtask's working directory, and so on. You can use this information with the **List the files on a node** API to fetch subtask files. For a single-instance task, the **Get Subtasks** API will return an empty collection.

Unless stated otherwise, REST APIs that operate on tasks apply only to the primary subtask. For example, **Get Task Files** for any multi-instance task will fetch only task files from primary.

## Multi-instance tasks with Batch .NET

This code snippet shows the creation of a [CloudTask][net_task] with multi-instance settings using the [CloudTask.MultiInstanceSettings][net_multiinstance_prop] property in Batch .NET:

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

## Multi-instance tasks with Batch REST API

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

```
// code snippet here
```

## Using MS-MPI with multi-instance tasks

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

```
// code snippet here
```

## Next steps

- Next step #1
- Next step #2
- Next step #3

[api_net]: http://msdn.microsoft.com/library/azure/mt348682.aspx
[api_rest]: http://msdn.microsoft.com/library/azure/dn820158.aspx
[batch_explorer]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/BatchExplorer
[github_samples]: https://github.com/Azure/azure-batch-samples
[msmpi_msdn]: https://msdn.microsoft.com/library/bb524831.aspx
[msmpi_sdk]: http://go.microsoft.com/FWLink/p/?LinkID=389556
[msmpi_howto]: http://blogs.technet.com/b/windowshpc/archive/2015/02/02/how-to-compile-and-run-a-simple-ms-mpi-program.aspx

[net_multiinstance_class]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.multiinstancesettings.aspx
[net_multiinstance_prop]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.multiinstancesettings.aspx
[net_multiinsance_commonresfiles]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.multiinstancesettings.commonresourcefiles.aspx
[net_multiinstance_coordcmdline]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.multiinstancesettings.coordinationcommandline.aspx
[net_multiinstance_numinstances]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.multiinstancesettings.numberofinstances.aspx
[net_pool]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.aspx
[net_pool_create]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.createpool.aspx
[net_pool_starttask]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.starttask.aspx
[net_task]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.aspx
[net_resourcefile]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.resourcefile.aspx

[rest_multiinstance]: https://msdn.microsoft.com/library/azure/mt637905.aspx

[1]: ./media/batch-mpi/batch_mpi_01.png "Multi-instance overview"
