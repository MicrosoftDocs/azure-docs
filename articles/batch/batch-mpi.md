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

In Batch, each task is normally executed on a single compute node--you submit a task to a job, and the Batch service schedules it for execution on a node. However, you can instruct Batch to execute a task as one primary and many subtasks, the primary task communicating with the subtasks to perform some computational workload. You do this by configuring a standard Batch task with **multi-instance settings**, then submitting that task to a job.

![Multi-instance task overview][1]

A "multi-instance task", then, is really just a standard Batch task that you've configured to run on multiple node instances by using its multi-instance settings. These multi-instance settings include the number of compute nodes that are to execute the task, a command line for the primary task (the "application command"), a coordination command to be executed by the primary and all subtasks, and a list of common resource files for each.

When you submit a task with multi-instance settings to a job, the following happens:

1. The Batch service automatically creates one **primary task** and enough **subtasks** that together will execute on the total number of compute nodes you specified. Batch then schedules all tasks for execution on the nodes.
2. These tasks, both the primary and each subtask, download the **common resource files** you specified in the multi-instance settings.
3. After the common resource files have been downloaded, the **coordination command** is executed by the primary and subtasks. This coordination command typically launches a background service--such as [MS-MPI][msmpi_msdn]'s `smpd.exe`--and may also verify that the nodes are ready to process inter-node messages.
4. When the coordination command has been successfully completed by the primary and all subtasks, the task's **command line** (the "application command") is executed *only* by the **primary task**. For example, in a Windows MPI scenario, you would typically execute your MPI-enabled application with [MS-MPI][msmpi_msdn]'s `mpiexec.exe` using the application command.

## Requirements for multi-instance tasks

TODO: Pull stuff from [Multi-instance Tasks](https://msdn.microsoft.com/library/azure/mt637905.aspx) REST API page.

## Multi-instance tasks with Batch .NET

This code snippet shows the creation of a [CloudTask][net_task] with multi-instance settings using the [CloudTask.MultiInstanceSettings][net_multiinstance_prop] property in Batch .NET:

```
CloudTask multiInstanceTask = new CloudTask(id: "MyMultiInstanceTask",
	commandline: "cmd /c mpiexec.exe -c 1 -wdir %AZ_BATCH_TASK_SHARED_DIR% MyMPIApplication.exe");
multiInstanceTask.MultiInstanceSettings = new MultiInstanceSettings(numNodes);
multiInstanceTask.MultiInstanceSettings.CoordinationCommandLine = "cmd /c start smpd.exe -d";
multiInstanceTask.MultiInstanceSettings.CommonResourceFiles = new List<ResourceFile>();
multiInstanceTask.MultiInstanceSettings.CommonResourceFiles.Add(
	new ResourceFile("https://mystorageaccount.blob.core.windows.net/mpi/MyMPIApplication.exe", "MyMPIApplication.exe"));
await batchClient.JobOperations.AddTaskAsync(jobId, multiInstanceTask);
```

To obtain information on the subtasks, you use...

```
// code snippet showing obtaining the subtasks
```

## Multi-instance tasks with Batch REST API

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

```
// code snippet here
```

To obtain information on the subtasks, you use...

```
// code snippet showing obtaining the subtasks
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
