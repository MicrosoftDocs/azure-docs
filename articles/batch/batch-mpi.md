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
	ms.date="06/03/2016"
	ms.author="marsma" />

# Use multi-instance tasks to run Message Passing Interface (MPI) applications in Azure Batch

With multi-instance tasks, you can run an Azure Batch task on multiple compute nodes simultaneously to enable high performance computing scenarios like Message Passing Interface (MPI) applications. In this article, you will learn how to execute multi-instance tasks using the [Batch .NET][api_net] library.

## Multi-instance task overview

In Batch, each task is normally executed on a single compute node--you submit multiple tasks to a job, and the Batch service schedules each task for execution on a node. However, by configuring a task's **multi-instance settings**, you can instruct Batch to split that task into subtasks for execution on multiple nodes.

![Multi-instance task overview][1]

When you submit a task with multi-instance settings to a job, Batch performs several steps unique to multi-instance tasks:

1. The Batch service automatically splits the task into one **primary** and many **subtasks**. Batch then schedules the primary and subtasks for execution on the pool's compute nodes.
2. These tasks, both the primary and the subtasks, download any **common resource files** that you specify in the multi-instance settings.
3. After the common resource files have been downloaded, the **coordination command** that you specify in the multi-instance settings is executed by the primary and subtasks. This coordination command is typically used to start a background service (such as [Microsoft MPI][msmpi_msdn]'s `smpd.exe`) and may also verify that the nodes are ready to process inter-node messages.
4. When the coordination command has been completed successfully by the primary and all subtasks, the multi-instance task's **command line** (the "application command") is executed *only* by the **primary task**. For example, in an [MS-MPI][msmpi_msdn]-based solution, this is where you execute your MPI-enabled application using `mpiexec.exe`.

> [AZURE.NOTE] Though it is functionally distinct, the "multi-instance task" is not a unique task type like the [StartTask][net_starttask] or [JobPreparationTask][net_jobprep]. The multi-instance task is simply a standard Batch task ([CloudTask][net_task] in Batch .NET) whose multi-instance settings have been configured. In this article, we refer to this as the **multi-instance task**.

## Requirements for multi-instance tasks

Multi-instance tasks require a pool with **inter-node communication enabled**, and with **concurrent task execution disabled**. If you try to run a multi-instance task in a pool with internode communication disabled, or with a *maxTasksPerNode* value greater than 1, the task will never be scheduled--it will remain indefinitely in the "active" state. This code snippet shows the creation of such a pool using the Batch .NET library.

```csharp
CloudPool myCloudPool =
	myBatchClient.PoolOperations.CreatePool(
		poolId: "MultiInstanceSamplePool",
		targetDedicated: 3
		virtualMachineSize: "small",
		cloudServiceConfiguration: new CloudServiceConfiguration(osFamily: "4"));

// Multi-instance tasks require inter-node communication, and those nodes
// must run only one task at a time.
myCloudPool.InterComputeNodeCommunicationEnabled = true;
myCloudPool.MaxTasksPerComputeNode = 1;
```

Additionally, multi-instance tasks will execute *only* on nodes in **pools created after 14-Dec-2015**.

> [AZURE.TIP] When you use size [A8 or A9 compute nodes](../virtual-machines/virtual-machines-windows-a8-a9-a10-a11-specs.md) in your Batch pool, your MPI application can take advantage of Azure's high-performance, low-latency remote direct memory access (RDMA) network. You can see the full list of compute node sizes available for Batch pools in [Sizes for Cloud Services](./../cloud-services/cloud-services-sizes-specs.md).

### Use a StartTask for MPI application installation

To run MPI applications with a multi-instance task, you first need to get your MPI software onto the compute nodes in the pool. This is a great time to use a [StartTask][net_starttask], which executes whenever a node joins a pool, or is restarted. This code snippet creates a StartTask that specifies the MS-MPI setup package as a [resource file][net_resourcefile], and the command line that will be executed after the resource file is downloaded to the node.

```csharp
// Create a StartTask for the pool which we use for installing MS-MPI on
// the nodes as they join the pool (or when they are restarted).
StartTask startTask = new StartTask
{
    CommandLine = "cmd /c MSMpiSetup.exe -unattend -force",
    ResourceFiles = new List<ResourceFile> { new ResourceFile("https://mystorageaccount.blob.core.windows.net/mycontainer/MSMpiSetup.exe", "MSMpiSetup.exe") },
    RunElevated = true,
    WaitForSuccess = true
};
myCloudPool.StartTask = startTask;

// Commit the fully configured pool to the Batch service to actually create
// the pool and its compute nodes.
await myCloudPool.CommitAsync();
```

> [AZURE.NOTE] You are not limited to using MS-MPI when implementing an MPI solution with multi-instance tasks in Batch. You may use any implementation of the MPI standard that is compatible with the operating system you specify for the compute nodes in your pool.

## Create a multi-instance task with Batch .NET

Now that we've covered the pool requirements and MPI package installation, let's create the multi-instance task. In this snippet, we create a standard [CloudTask][net_task], then configure its [MultiInstanceSettings][net_multiinstance_prop] property. As mentioned above, the multi-instance task is not a distinct task type, but a standard Batch task configured with multi-instance settings.

```csharp
// Create the multi-instance task. Its command line is the "application command"
// and will be executed *only* by the primary, and only after the primary and
// subtasks execute the CoordinationCommandLine.
CloudTask myMultiInstanceTask = new CloudTask(id: "mymultiinstancetask",
    commandline: "cmd /c mpiexec.exe -wdir %AZ_BATCH_TASK_SHARED_DIR% MyMPIApplication.exe");

// Configure the task's MultiInstanceSettings. The CoordinationCommandLine will be executed by
// the primary and all subtasks.
myMultiInstanceTask.MultiInstanceSettings =
    new MultiInstanceSettings(numberOfNodes) {
    CoordinationCommandLine = @"cmd /c start cmd /c ""%MSMPI_BIN%\smpd.exe"" -d",
    CommonResourceFiles = new List<ResourceFile> {
    new ResourceFile("https://mystorageaccount.blob.core.windows.net/mycontainer/MyMPIApplication.exe",
                     "MyMPIApplication.exe")
    }
};

// Submit the task to the job. Batch will take care of splitting it into subtasks and
// scheduling them for execution on the nodes.
await myBatchClient.JobOperations.AddTaskAsync("mybatchjob", myMultiInstanceTask);
```

## Primary task and subtasks

When you create the multi-instance settings for a task, you specify the number of number of compute nodes that are to execute the task. When you submit the task to a job, the Batch service creates one **primary** task and enough **subtasks** that together match the number of nodes you specified.

These tasks are assigned an integer id in the range of 0 to *numberOfInstances - 1*. The task with id 0 is the primary task, and all other ids are subtasks. For example, if you create the following multi-instance settings for a task, the primary task would have an id of 0, and the subtasks would have ids 1 through 9.

```csharp
int numberOfNodes = 10;
myMultiInstanceTask.MultiInstanceSettings = new MultiInstanceSettings(numberOfNodes);
```

## Coordination and application commands

The **coordination command** is executed by both the primary and subtasks. Once the primary task and all subtasks have finished executing the coordination command, the multi-instance task's command line is executed by the primary task *only*. We will call this command line the **application command** to distinguish it from the coordination command.

The invocation of the coordination command is blocking--Batch does not execute the application command until the coordination command has returned successfully for all subtasks. The coordination command should therefore start any required background services, verify that they are ready for use, and then exit. For example, this coordination command for a solution using MS-MPI version 7 starts the SMPD service on the node, then exits:

```
cmd /c start cmd /c ""%MSMPI_BIN%\smpd.exe"" -d
```

Note the use of `start` in this coordination command. This is required because the `smpd.exe` application does not return immediately after execution. Without the use of the [start][cmd_start] command, this coordination command would not return, and would therefore block the application command from running.

The **application command**, the command line specified for the multi-instance task, is executed *only* by the primary task. For MS-MPI applications, this will be the execution of your MPI-enabled application using `mpiexec.exe`. For example, here is an application command for a solution using MS-MPI version 7:

```
cmd /c ""%MSMPI_BIN%\mpiexec.exe"" -c 1 -wdir %AZ_BATCH_TASK_SHARED_DIR% MyMPIApplication.exe
```

## Resource files

There are two sets of resource files to consider for multi-instance tasks: **common resource files** that *all* tasks download (both primary and subtasks), and the **resource files** specified for the multi-instance task itself, which *only the primary* task downloads.

You can specify one or more **common resource files** in the multi-instance settings for a task. These common resource files are downloaded from [Azure Storage](./../storage/storage-introduction.md) into each node's task shared directory by the primary and all subtasks. You can access the task shared directory from application and coordination command lines by using the `AZ_BATCH_TASK_SHARED_DIR` environment variable.

Resource files that you specify for the multi-instance task itself are downloaded to the task's working directory, `AZ_BATCH_TASK_WORKING_DIR`, by the primary task *only*--the subtasks do not download the resource files specified for the multi-instance task.

The contents of the `AZ_BATCH_TASK_SHARED_DIR` are accessible by the primary and all subtasks that execute on a node. An example task shared directory is `tasks/mybatchjob/job-1/mymultiinstancetask/`. The primary and each subtask also have a working directory that is accessible by that task only, and is accessed by using the environment variable `AZ_BATCH_TASK_WORKING_DIR`.

Note that in the code samples in this article, we do not specify resource files for the multi-instance task itself, only for the pool's StartTask and the [CommonResourceFiles][net_multiinsance_commonresfiles] of the multi-instance settings.

> [AZURE.IMPORTANT] Always use the environment variables `AZ_BATCH_TASK_SHARED_DIR` and `AZ_BATCH_TASK_WORKING_DIR` to refer to these directories in your command lines. Do not attempt to construct the paths manually.

## Task lifetime

The lifetime of the primary task controls the lifetime of the entire multi-instance task. When the primary exits, all of the subtasks are terminated. The exit code of the primary is the exit code of the task, and is therefore used to determine the success or failure of the task for retry purposes.

If any of the subtasks fail, exiting with a non-zero return code, for example, the entire multi-instance task fails. The multi-instance task is then terminated and retried, up to its retry limit.

When you delete a multi-instance task, the primary and all subtasks are also deleted by the Batch service. All subtask directories and their files are deleted from the compute nodes, just as for a standard task.

[TaskConstraints][net_taskconstraints] for a multi-instance task, such as the [MaxTaskRetryCount][net_taskconstraint_maxretry], [MaxWallClockTime][net_taskconstraint_maxwallclock], and [RetentionTime][net_taskconstraint_retention] properties, are honored as they are for a standard task, and apply to the primary and all subtasks. However, if you change the [RetentionTime][net_taskconstraint_retention] property after adding the multi-instance task to the job, this change is applied only to the primary task. All of the subtasks will continue to use the original [RetentionTime][net_taskconstraint_retention].

A compute node's recent task list will reflect the id of a subtask if the recent task was part of a multi-instance task.

## Obtain information about subtasks

To obtain information on subtasks by using the Batch .NET library, call the [CloudTask.ListSubtasks][net_task_listsubtasks] method. This method returns information on all subtasks, and information about the compute node that executed the tasks. From this information, you can determine each subtask's root directory, the pool id, its current state, exit code, and more. You can use this information in combination with the [PoolOperations.GetNodeFile][poolops_getnodefile] method to obtain the subtask's files. Note that this method does not return information for the primary task (id 0).

> [AZURE.NOTE] Unless otherwise stated, Batch .NET methods that operate on the multi-instance [CloudTask][net_task] itself apply *only* to the primary task. For example, when you call the [CloudTask.ListNodeFiles][net_task_listnodefiles] method on a multi-instance task, only the primary task's files are returned.

The following code snippet shows how to obtain subtask information, as well as request file contents from the nodes on which they executed.

```csharp
// Obtain the job and the multi-instance task from the Batch service
CloudJob boundJob = batchClient.JobOperations.GetJob("mybatchjob");
CloudTask myMultiInstanceTask = boundJob.GetTask("mymultiinstancetask");

// Now obtain the list of subtasks for the task
IPagedEnumerable<SubtaskInformation> subtasks = myMultiInstanceTask.ListSubtasks();

// Asynchronously iterate over the subtasks and print their stdout and stderr
// output if the subtask has completed
await subtasks.ForEachAsync(async (subtask) =>
{
    Console.WriteLine("subtask: {0}", subtask.Id);
    Console.WriteLine("exit code: {0}", subtask.ExitCode);

    if (subtask.State == TaskState.Completed)
    {
        ComputeNode node =
			await batchClient.PoolOperations.GetComputeNodeAsync(subtask.ComputeNodeInformation.PoolId,
                                                                 subtask.ComputeNodeInformation.ComputeNodeId);

        NodeFile stdOutFile = await node.GetNodeFileAsync(subtask.ComputeNodeInformation.TaskRootDirectory + "\\" + Constants.StandardOutFileName);
        NodeFile stdErrFile = await node.GetNodeFileAsync(subtask.ComputeNodeInformation.TaskRootDirectory + "\\" + Constants.StandardErrorFileName);
        stdOut = await stdOutFile.ReadAsStringAsync();
        stdErr = await stdErrFile.ReadAsStringAsync();

        Console.WriteLine("node: {0}:", node.Id);
        Console.WriteLine("stdout.txt: {0}", stdOut);
        Console.WriteLine("stderr.txt: {0}", stdErr);
    }
    else
    {
        Console.WriteLine("\tSubtask {0} is in state {1}", subtask.Id, subtask.State);
    }
});
```

## Next steps

- You may want to build a simple MS-MPI application to use while testing multi-instance tasks in Batch. The Microsoft HPC & Azure Batch Team blog article, [How to compile and run a simple MS-MPI program][msmpi_howto], contains a walk-through for creating a simple MPI application using MS-MPI.

- Check out the [Microsoft MPI][msmpi_msdn] page on MSDN for the latest information on MS-MPI.

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
[net_starttask_cmdline]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.starttask.commandline.aspx
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
