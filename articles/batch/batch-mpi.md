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

# Use multi-instance tasks to run Message Passing Interface (MPI) applications in Azure Batch

With multi-instance tasks, you can run an Azure Batch task on multiple compute nodes simultaneously to enable high performance computing scenarios like Message Passing Interface (MPI) applications. In this article, you will learn how to execute multi-instance tasks using the [Batch .NET][api_net] library.

## Multi-instance task overview

In Batch, each task is normally executed on a single compute node--you submit multiple tasks to a job, and the Batch service schedules each task for execution on a node. However, by configuring a task's **multi-instance settings**, you can instruct Batch to split that task into subtasks for execution on multiple nodes.

![Multi-instance task overview][1]

When you submit a task with multi-instance settings to a job, Batch performs several steps unique to multi-instance tasks:

1. The Batch service automatically splits the "main" task into **subtasks**, one of which is designated as the **primary task**. Batch then schedules the primary and other subtasks for execution on the pool's compute nodes.
2. These tasks, both the primary and the other subtasks, download any **common resource files** that you specify in the multi-instance settings.
3. After the common resource files have been downloaded, the **coordination command** is executed by the primary and other subtasks. This coordination command is typically used to start a background service (such as [Microsoft MPI][msmpi_msdn]'s `smpd.exe`) and may also verify that the nodes are ready to process inter-node messages.
4. When the coordination command has been completed successfully by the primary and other subtasks, the main task's **command line** (the "application command") is executed *only* by the **primary task**. For example, in an [MS-MPI][msmpi_msdn]-based solution, this is where you execute your MPI-enabled application using `mpiexec.exe`.

> [AZURE.NOTE] Though it is functionally distinct, the "multi-instance task" is not a unique task type like the [StartTask][net_starttask] or [JobPreparationTask][net_jobprep]. The multi-instance task is simply a standard Batch task ([CloudTask][net_task] in Batch .NET) whose multi-instance settings have been configured. In this article, we refer to this as the multi-instance task.

## Create a multi-instance task with Batch .NET

The following code snippet shows you how to create a multi-instance task using the Batch .NET library. In the snippet, we create a standard [CloudTask][net_task], then configure its [MultiInstanceSettings][net_multiinstance_prop] property.

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
	new ResourceFile("https://mystorageaccount.blob.core.windows.net/mpi/MyMPIApplication.exe",
	"MyMPIApplication.exe"));

// Submit the task to the job. Batch will take care of splitting it into subtasks and
// scheduling them for execution on the nodes.
await batchClient.JobOperations.AddTaskAsync("mybatchjob", myMultiInstanceTask);
```

## Primary task and subtasks

When you create the multi-instance settings for a task, you specify the number of number of compute nodes to execute the task. When you submit the task to a job, the Batch service creates that number of subtasks, one of which it designates as the "primary."

These subtasks, both the primary and the other subtasks, are assigned an integer id in the range of 0 to *numberOfInstances - 1*. The subtask with id 0 is the primary task, and all other ids are subtasks. For example, if you create the following multi-instance settings for a task, the primary task would have an id of 0, and the other subtasks would have ids 1 through 9.

```
int numberOfNodes = 10;
myMultiInstanceTask.MultiInstanceSettings = new MultiInstanceSettings(numberOfNodes);
```

## Coordination and application commands

The **coordination command** is executed by all subtasks, including the primary task. Once the primary task and all subtasks have finished executing the coordination command, the main task's command line is executed by the primary task *only*. We will call the main task's command line the **application command** to distinguish it from the coordination command.

The invocation of the coordination command is blocking--Batch does not execute the application command until the coordination command has returned successfully for all subtasks. The coordination command should therefore start any required background services, verify that they are ready for use, and then exit. For example, a coordination command for a solution using MS-MPI version 7 might be:

```
cmd /c start cmd /c ""%MSMPI_BIN%\smpd.exe"" -d
```

Note the use of `start` in this coordination command. This is required because the `smpd.exe` application does not return immediately after execution. Without the use of the [start][cmd_start] command, this coordination command would not return, and would therefore block the application command from running.

The **application command**, the command line specified for the main task, is executed *only* by the primary task. For MS-MPI applications, this will be the execution of your MPI-enabled application using `mpiexec.exe`. For example, an application command for a solution using MS-MPI version 7 might be:

```
cmd /c ""%MSMPI_BIN%\mpiexec.exe"" -c 1 -wdir %AZ_BATCH_TASK_SHARED_DIR% MyMPIApplication.exe
```

## Resource files

You can specify one or more **common resource files** for a multi-instance task. These common resource files are downloaded from [Azure Storage](./../storage/storage-introduction.md) into the node's task shared directory by all of the subtasks, including the primary. You can access the task shared directory from application and coordination command lines by using the `AZ_BATCH_TASK_SHARED_DIR` environment variable.

Resource files that you specify for the main task are downloaded to the task's working directory, `AZ_BATCH_TASK_WORKING_DIR`, by the primary subtask *only*--the other subtasks do not download the main task's resource files.

The contents of the `AZ_BATCH_TASK_SHARED_DIR` are accessible by all subtasks that execute on a node, including the primary. An example task shared directory is `tasks/myjob/job-1/mytask1/`. Each subtask, including the primary, also has a working directory that is accessible by that task only, and is accessed by using the environment variable `AZ_BATCH_TASK_WORKING_DIR`.

> [AZURE.IMPORTANT] Always use the environment variables `AZ_BATCH_TASK_SHARED_DIR` and `AZ_BATCH_TASK_WORKING_DIR` to refer to the these directories in your command lines. Do not attempt to construct the paths manually.

## Task lifetime

The lifetime of the primary task controls the lifetime of the entire multi-instance task. When the primary exits, all other subtasks are terminated. The exit code of the primary is the exit code of the task, and is therefore used to determine the success or failure of the task for retry purposes.

If any of the subtasks fail, exiting with a non-zero return code, for example, the entire multi-instance task fails. The main task is terminated, and the entire multi-instance task is retried up to its retry limit.

When you delete a multi-instance task, the primary and all other subtasks are also deleted by the Batch service. All subtask directories and their files are deleted from the compute nodes, just as for a standard task.

[TaskConstraints][net_taskconstraints] for a multi-instance task, such as the [MaxTaskRetryCount][net_taskconstraint_maxretry], [MaxWallClockTime][net_taskconstraint_maxwallclock], and [RetentionTime][net_taskconstraint_retention] properties, are honored as they are for a standard task, and apply to the primary and all subtasks. However, if you change the [RetentionTime][net_taskconstraint_retention] property after adding the task to the job, this change is applied only to the primary task. All other subtasks will continue to use the original [RetentionTime][net_taskconstraint_retention].

A compute node's recent task list will reflect the id of a subtask if the recent task was part of a multi-instance task.

## Obtain information about subtasks

To obtain information on subtasks using the Batch .NET library, the [CloudTask.ListSubtasks][net_task_listsubtasks] method can be used to obtain information on all subtasks except the primary. This method returns information such as the id of the subtask's compute node, its root directory, and the pool id. You can use this information with the [PoolOperations.GetNodeFile][poolops_getnodefile] method to obtain the subtask's files.

Unless otherwise stated, Batch .NET methods that operate on the standard [CloudTask][net_task] apply only to the primary subtask. For example, when you call the [CloudTask.ListNodeFiles][net_task_listnodefiles] method on a multi-instance task, only the primary task's files are returned.

**TODO: Add code snippet showing task monitoring, accessing subtasks, obtaining their files**

## Pool requirements for multi-instance tasks

Multi-instance tasks require a pool with **inter-node communication enabled**, and with **concurrent task execution disabled**. If you try to run a multi-instance task in a pool with internode communication disabled, or with a *maxTasksPerNode* value greater than 1, the task will never be scheduled--it will remain indefinitely in the "active" state.

Additionally, multi-instance tasks will execute *only* on nodes in **pools created after 12/14/2015**.

## Next steps

**TODO: Add next steps.**

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
[net_taskconstraints]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.taskconstraints.aspx
[net_taskconstraint_maxretry]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.taskconstraints.maxtaskretrycount.aspx
[net_taskconstraint_maxwallclock]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.taskconstraints.maxwallclocktime.aspx
[net_taskconstraint_retention]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.taskconstraints.retentiontime.aspx
[net_task_listsubtasks]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.listsubtasks.aspx
[net_task_listnodefiles]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.listnodefiles.aspx
[poolops_getnodefile]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.getnodefile.aspx

[rest_multiinstance]: https://msdn.microsoft.com/library/azure/mt637905.aspx

[1]: ./media/batch-mpi/batch_mpi_01.png "Multi-instance overview"
