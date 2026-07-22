---
title: Use multi-instance tasks to run MPI applications
description: Learn how to execute Message Passing Interface (MPI) applications using the multi-instance task type in Azure Batch.
ms.topic: how-to
ms.date: 05/20/2026
ms.devlang: csharp
ms.custom: devx-track-dotnet
# Customer intent: As a data scientist, I want to run MPI applications on multiple compute nodes in parallel using multi-instance tasks, so that I can achieve high-performance computing for complex data processing.
---

# Use multi-instance tasks to run Message Passing Interface (MPI) applications in Batch

Multi-instance tasks allow you to run an Azure Batch task on multiple compute nodes simultaneously. These tasks enable high performance computing scenarios like Message Passing Interface (MPI) applications in Batch. In this article, you learn how to execute multi-instance tasks using the [Azure.Compute.Batch](/dotnet/api/azure.compute.batch) library.

> [!NOTE]
> While the examples in this article focus on Azure.Compute.Batch, MS-MPI, and Windows compute nodes, the multi-instance task concepts discussed here are applicable to other platforms and technologies (Python and Intel MPI on Linux nodes, for example).

## Multi-instance task overview

In Batch, each task is normally executed on a single compute node--you submit multiple tasks to a job, and the Batch service schedules each task for execution on a node. However, by configuring a task's **multi-instance settings**, you tell Batch to instead create one primary task and several subtasks that are then executed on multiple nodes.

:::image type="content" source="media/batch-mpi/batch-mpi-01.png" alt-text="Diagram showing an overview of multi-instance settings.":::

When you submit a task with multi-instance settings to a job, Batch performs several steps unique to multi-instance tasks:

1. The Batch service creates one **primary** and several **subtasks** based on the multi-instance settings. The total number of tasks (primary plus all subtasks) matches the number of **instances** (compute nodes) you specify in the multi-instance settings.
2. Batch designates one of the compute nodes as the **master**, and schedules the primary task to execute on the master. It schedules the subtasks to execute on the remainder of the compute nodes allocated to the multi-instance task, one subtask per node.
3. The primary and all subtasks download any **common resource files** you specify in the multi-instance settings.
4. After the common resource files have been downloaded, the primary and subtasks execute the **coordination command** you specify in the multi-instance settings. The coordination command is typically used to prepare nodes for executing the task. This can include starting background services (such as [Microsoft MPI's](/message-passing-interface/microsoft-mpi) `smpd.exe`) and verifying that the nodes are ready to process inter-node messages.
5. The primary task executes the **application command** on the master node *after* the coordination command has been completed successfully by the primary and all subtasks. The application command is the command line of the multi-instance task itself, and is executed only by the primary task. In an [MS-MPI](/message-passing-interface/microsoft-mpi) -based solution, this is where you execute your MPI-enabled application using `mpiexec.exe`.

> [!NOTE]
> Though it is functionally distinct, the "multi-instance task" is not a unique task type like the [BatchStartTask](/dotnet/api/azure.compute.batch.batchstarttask) or [BatchJobPreparationTask](/dotnet/api/azure.compute.batch.batchjobpreparationtask). The multi-instance task is simply a standard Batch task ([BatchTask](/dotnet/api/azure.compute.batch.batchtask) in Azure.Compute.Batch) whose multi-instance settings have been configured. In this article, we refer to this as the **multi-instance task**.

## Requirements for multi-instance tasks

Multi-instance tasks require a pool with **inter-node communication enabled**, and with **concurrent task execution disabled**. To disable concurrent task execution, set the [BatchAccountPoolData.TaskSlotsPerNode](/dotnet/api/azure.resourcemanager.batch.batchaccountpooldata) property to 1.

> [!NOTE]
> Batch [limits](batch-quota-limit.md#pool-size-limits) the size of a pool that has inter-node communication enabled.

This code snippet shows how to create a pool for multi-instance tasks using the Azure.ResourceManager.Batch library.

```C# Snippet:mpi_pool_create
ArmClient armClient = new ArmClient(new DefaultAzureCredential());

ResourceIdentifier batchAccountResourceId =
    BatchAccountResource.CreateResourceIdentifier("subscriptionId", "resourceGroupName", "accountName");
BatchAccountResource batchAccount = armClient.GetBatchAccountResource(batchAccountResourceId);

BatchAccountPoolCollection poolCollection = batchAccount.GetBatchAccountPools();

BatchAccountPoolData poolData = new BatchAccountPoolData()
{
    VmSize = "standard_d1_v2",
    DeploymentConfiguration = new BatchDeploymentConfiguration()
    {
        VmConfiguration = new BatchVmConfiguration(
            imageReference: new BatchImageReference()
            {
                Publisher = "MicrosoftWindowsServer",
                Offer = "WindowsServer",
                Sku = "2019-datacenter-core",
                Version = "latest"
            },
            nodeAgentSkuId: "batch.node.windows amd64")
    },
    ScaleSettings = new BatchAccountPoolScaleSettings()
    {
        FixedScale = new BatchAccountFixedScaleSettings() { TargetDedicatedNodes = 3 }
    },

    // Multi-instance tasks require inter-node communication, and those nodes
    // must run only one task at a time.
    InterNodeCommunication = InterNodeCommunicationState.Enabled,
    TaskSlotsPerNode = 1
};
```

> [!NOTE]
> If you try to run a multi-instance task in a pool with internode communication disabled, or with a *taskSlotsPerNode* value greater than 1, the task is never scheduled--it remains indefinitely in the "active" state.
> 
> Pools with InterComputeNodeCommunication enabled will not allow automatically the deprovision of the node.

### Use a StartTask to install MPI

To run MPI applications with a multi-instance task, you first need to install an MPI implementation (MS-MPI or Intel MPI, for example) on the compute nodes in the pool. This is a good time to use a [BatchAccountPoolStartTask](/dotnet/api/azure.resourcemanager.batch.models.batchaccountpoolstarttask), which executes whenever a node joins a pool, or is restarted. This code snippet adds a start task to the pool definition that specifies the MS-MPI setup package as a [resource file](/dotnet/api/azure.resourcemanager.batch.models.batchresourcefile). The start task's command line is executed after the resource file is downloaded to the node. In this case, the command line performs an unattended install of MS-MPI.

```C# Snippet:mpi_pool_starttask
// Add a start task to the pool which we use for installing MS-MPI on
// the nodes as they join the pool (or when they are restarted).
poolData.StartTask = new BatchAccountPoolStartTask()
{
    CommandLine = "cmd /c MSMpiSetup.exe -unattend -force",
    UserIdentity = new BatchUserIdentity()
    {
        AutoUser = new BatchAutoUserSpecification() { ElevationLevel = BatchUserAccountElevationLevel.Admin }
    },
    WaitForSuccess = true,
};
poolData.StartTask.ResourceFiles.Add(new BatchResourceFile()
{
    HttpUri = new Uri("https://mystorageaccount.blob.core.windows.net/mycontainer/MSMpiSetup.exe"),
    FilePath = "MSMpiSetup.exe"
});

// Create the fully configured pool.
ArmOperation<BatchAccountPoolResource> pool = await poolCollection.CreateOrUpdateAsync(
    WaitUntil.Completed, "MultiInstanceSamplePool", poolData);
```

### Remote direct memory access (RDMA)

When you choose an [RDMA-capable size](/azure/virtual-machines/sizes-hpc?toc=/azure/virtual-machines/windows/toc.json) such as A9 for the compute nodes in your Batch pool, your MPI application can take advantage of Azure's high-performance, low-latency remote direct memory access (RDMA) network.

Look for the sizes specified as "RDMA capable" in [Sizes for virtual machines in Azure](/azure/virtual-machines/sizes) (for VirtualMachineConfiguration pools) or [Sizes for Cloud Services](../cloud-services/cloud-services-sizes-specs.md) (for CloudServicesConfiguration pools).

> [!NOTE]
> To take advantage of RDMA on [Linux compute nodes](batch-linux-nodes.md), you must use **Intel MPI** on the nodes.

## Create a multi-instance task with Azure.Compute.Batch

Now that we've covered the pool requirements and MPI package installation, let's create the multi-instance task. In this snippet, we create a standard [BatchTaskCreateOptions](/dotnet/api/azure.compute.batch.batchtaskcreateoptions), then configure its [MultiInstanceSettings](/dotnet/api/azure.compute.batch.multiinstancesettings) property. As mentioned earlier, the multi-instance task is not a distinct task type, but a standard Batch task configured with multi-instance settings.

```C# Snippet:mpi_task_create
// Create the multi-instance task. Its command line is the "application command"
// and will be executed *only* by the primary, and only after the primary and
// subtasks execute the CoordinationCommandLine.
BatchTaskCreateOptions myMultiInstanceTask = new BatchTaskCreateOptions(
    id: "mymultiinstancetask",
    commandLine: "cmd /c mpiexec.exe -wdir %AZ_BATCH_TASK_SHARED_DIR% MyMPIApplication.exe")
{
    // Configure the task's MultiInstanceSettings. The CoordinationCommandLine will be executed by
    // the primary and all subtasks.
    MultiInstanceSettings = new MultiInstanceSettings(
        @"cmd /c start cmd /c ""%MSMPI_BIN%\smpd.exe"" -d")
    {
        NumberOfInstances = numberOfNodes
    }
};

myMultiInstanceTask.MultiInstanceSettings.CommonResourceFiles.Add(new ResourceFile()
{
    HttpUri = new Uri("https://mystorageaccount.blob.core.windows.net/mycontainer/MyMPIApplication.exe"),
    FilePath = "MyMPIApplication.exe"
});

// Submit the task to the job. Batch will take care of splitting it into subtasks and
// scheduling them for execution on the nodes.
await myBatchClient.CreateTaskAsync("mybatchjob", myMultiInstanceTask);
```

## Primary task and subtasks

When you create the multi-instance settings for a task, you specify the number of compute nodes that are to execute the task. When you submit the task to a job, the Batch service creates one **primary** task and enough **subtasks** that together match the number of nodes you specified.

These tasks are assigned an integer ID in the range of 0 to *numberOfInstances* - 1. The task with ID 0 is the primary task, and all other IDs are subtasks. For example, if you create the following multi-instance settings for a task, the primary task would have an ID of 0, and the subtasks would have IDs 1 through 9.

```C# Snippet:mpi_set_node_count
int numberOfNodes = 10;
myMultiInstanceTask.MultiInstanceSettings = new MultiInstanceSettings("coord-cmd")
{
    NumberOfInstances = numberOfNodes
};
```

### Master node

When you submit a multi-instance task, the Batch service designates one of the compute nodes as the "master" node, and schedules the primary task to execute on the master node. The subtasks are scheduled to execute on the remainder of the nodes allocated to the multi-instance task.

## Coordination command

The **coordination command** is executed by both the primary and subtasks.

The invocation of the coordination command is blocking--Batch does not execute the application command until the coordination command has returned successfully for all subtasks. The coordination command should therefore start any required background services, verify that they are ready for use, and then exit. For example, this coordination command for a solution using MS-MPI version 7 starts the SMPD service on the node, then exits:

`cmd /c start cmd /c ""%MSMPI_BIN%\smpd.exe"" -d`

Note the use of `start` in this coordination command. This is required because the `smpd.exe` application does not return immediately after execution. Without the use of the start command, this coordination command would not return, and would therefore block the application command from running.

## Application command

Once the primary task and all subtasks have finished executing the coordination command, the multi-instance task's command line is executed by the primary task *only*. We call this the **application command** to distinguish it from the coordination command.

For MS-MPI applications, use the application command to execute your MPI-enabled application with `mpiexec.exe`. For example, here is an application command for a solution using MS-MPI version 7:

`cmd /c ""%MSMPI_BIN%\mpiexec.exe"" -c 1 -wdir %AZ_BATCH_TASK_SHARED_DIR% MyMPIApplication.exe`

> [!NOTE]
> Because MS-MPI's `mpiexec.exe` uses the `CCP_NODES` variable by default (see [Environment variables](#environment-variables)), the example application command line above excludes it.

## Environment variables

Batch creates several [environment variables](batch-compute-node-environment-variables.md) specific to multi-instance tasks on the compute nodes allocated to a multi-instance task. Your coordination and application command lines can reference these environment variables, as can the scripts and programs they execute.

The following environment variables are created by the Batch service for use by multi-instance tasks:

- `CCP_NODES`
- `AZ_BATCH_NODE_LIST`
- `AZ_BATCH_HOST_LIST`
- `AZ_BATCH_MASTER_NODE`
- `AZ_BATCH_TASK_SHARED_DIR`
- `AZ_BATCH_IS_CURRENT_NODE_MASTER`

For full details on these and the other Batch compute node environment variables, including their contents and visibility, see [Compute node environment variables](batch-compute-node-environment-variables.md).

> [!TIP]
> The [Batch Linux MPI code sample](https://github.com/Azure-Samples/azure-batch-samples/tree/master/Python/Batch/article_samples/mpi) contains an example of how several of these environment variables can be used.

## Resource files

There are two sets of resource files to consider for multi-instance tasks: **common resource files** that *all* tasks download (both primary and subtasks), and the **resource files** specified for the multi-instance task itself, which *only the primary* task downloads.

You can specify one or more **common resource files** in the multi-instance settings for a task. These common resource files are downloaded from [Azure Storage](../storage/common/storage-introduction.md) into each node's **task shared directory** by the primary and all subtasks. You can access the task shared directory from application and coordination command lines by using the `AZ_BATCH_TASK_SHARED_DIR` environment variable. The `AZ_BATCH_TASK_SHARED_DIR` path is identical on every node allocated to the multi-instance task, thus you can share a single coordination command between the primary and all subtasks. Batch does not "share" the directory in a remote access sense, but you can use it as a mount or share point as mentioned earlier in the tip on environment variables.

Resource files that you specify for the multi-instance task itself are downloaded to the task's working directory, `AZ_BATCH_TASK_WORKING_DIR`, by default. As mentioned, in contrast to common resource files, only the primary task downloads resource files specified for the  multi-instance task itself.

> [!IMPORTANT]
> Always use the environment variables `AZ_BATCH_TASK_SHARED_DIR` and `AZ_BATCH_TASK_WORKING_DIR` to refer to these directories in your command lines. Do not attempt to construct the paths manually.

## Task lifetime

The lifetime of the primary task controls the lifetime of the entire multi-instance task. When the primary exits, all of the subtasks are terminated. The exit code of the primary is the exit code of the task, and is therefore used to determine the success or failure of the task for retry purposes.

If any of the subtasks fail, exiting with a non-zero return code, for example, the entire multi-instance task fails. The multi-instance task is then terminated and retried, up to its retry limit.

When you delete a multi-instance task, the primary and all subtasks are also deleted by the Batch service. All subtask directories and their files are deleted from the compute nodes, just as for a standard task.

[BatchTaskConstraints](/dotnet/api/azure.compute.batch.batchtaskconstraints) for a multi-instance task, such as the [MaxTaskRetryCount](/dotnet/api/azure.compute.batch.batchtaskconstraints), [MaxWallClockTime](/dotnet/api/azure.compute.batch.batchtaskconstraints), and [RetentionTime](/dotnet/api/azure.compute.batch.batchtaskconstraints) properties, are honored as they are for a standard task, and apply to the primary and all subtasks. However, if you change theRetentionTime property after adding the multi-instance task to the job, this change is applied only to the primary task, and all of the subtasks continue to use the original RetentionTime.

A compute node's recent task list reflects the ID of a subtask if the recent task was part of a multi-instance task.

## Obtain information about subtasks

To obtain information on subtasks by using the Azure.Compute.Batch library, call the [BatchClient.GetTaskSubTasks](/dotnet/api/azure.compute.batch.batchclient) method. This method returns information on all subtasks, and information about the compute node that executed the tasks. From this information, you can determine each subtask's root directory, the pool ID, its current state, exit code, and more. You can use this information in combination with the [BatchClient.GetNodeFile](/dotnet/api/azure.compute.batch.batchclient) method to obtain the subtask's files. Note that this method does not return information for the primary task (ID 0).

> [!NOTE]
> Unless otherwise stated, Azure.Compute.Batch methods that operate on the multi-instance [BatchTask](/dotnet/api/azure.compute.batch.batchtask) itself apply *only* to the primary task. For example, when you call the `GetTaskFiles` method on a multi-instance task, only the primary task's files are returned.

The following code snippet shows how to obtain subtask information, as well as request file contents from the nodes on which they executed.

```C# Snippet:mpi_iterate_subtasks
// Obtain the multi-instance task from the Batch service
BatchTask myMultiInstanceTask = await batchClient.GetTaskAsync("mybatchjob", "mymultiinstancetask");
_ = myMultiInstanceTask;

// Now iterate over the subtasks for the task and print their stdout and stderr
// output if the subtask has completed
await foreach (BatchSubtask subtask in batchClient.GetSubTasksAsync("mybatchjob", "mymultiinstancetask"))
{
    Console.WriteLine("subtask: {0}", subtask.Id);
    Console.WriteLine("exit code: {0}", subtask.ExitCode);

    if (subtask.State == BatchSubtaskState.Completed)
    {
        BatchNode node = await batchClient.GetNodeAsync(
            subtask.NodeInfo.PoolId,
            subtask.NodeInfo.NodeId);

        BinaryData stdOut = await batchClient.GetNodeFileAsync(
            subtask.NodeInfo.PoolId, node.Id, $"{subtask.NodeInfo.TaskRootDirectory}/stdout.txt");
        BinaryData stdErr = await batchClient.GetNodeFileAsync(
            subtask.NodeInfo.PoolId, node.Id, $"{subtask.NodeInfo.TaskRootDirectory}/stderr.txt");

        Console.WriteLine("node: {0}:", node.Id);
        Console.WriteLine("stdout.txt: {0}", stdOut);
        Console.WriteLine("stderr.txt: {0}", stdErr);
    }
    else
    {
        Console.WriteLine("\tSubtask {0} is in state {1}", subtask.Id, subtask.State);
    }
}
```

## Code sample

The [MultiInstanceTasks](https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/MultiInstanceTasks) code sample on GitHub demonstrates how to use a multi-instance task to run an [MS-MPI](/message-passing-interface/microsoft-mpi) application on Batch compute nodes. Follow the steps below to run the sample.

### Preparation

1. Download the [MS-MPI SDK and Redist installers](/message-passing-interface/microsoft-mpi) and install them. After installation you can verify that the MS-MPI environment variables have been set.
1. Build a *Release* version of the [MPIHelloWorld](https://github.com/Azure-Samples/azure-batch-samples/tree/master/CSharp/ArticleProjects/MultiInstanceTasks/MPIHelloWorld) sample MPI program. This is the program that will be run on compute nodes by the multi-instance task.
1. Create a zip file containing `MPIHelloWorld.exe` (which you built in step 2) and `MSMpiSetup.exe` (which you downloaded in step 1). You'll upload this zip file as an application package in the next step.
1. Use the [Azure portal](https://portal.azure.com) to create a Batch [application](batch-application-packages.md) called "MPIHelloWorld", and specify the zip file you created in the previous step as version "1.0" of the application package. See [Upload and manage applications](batch-application-packages.md#upload-and-manage-applications) for more information.

> [!TIP]
> Building a *Release* version of `MPIHelloWorld.exe` ensures that you don't have to include any additional dependencies (for example, `msvcp140d.dll` or `vcruntime140d.dll`) in your application package.

### Execution

1. Download the [azure-batch-samples .zip file](https://github.com/Azure/azure-batch-samples/archive/master.zip) from GitHub.
1. Open the MultiInstanceTasks **solution** in Visual Studio 2019. The `MultiInstanceTasks.sln` solution file is located in:

    `azure-batch-samples\CSharp\ArticleProjects\MultiInstanceTasks\`
1. Enter your Batch and Storage account credentials in `AccountSettings.settings` in the **Microsoft.Azure.Batch.Samples.Common** project.
1. **Build and run** the MultiInstanceTasks solution to execute the MPI sample application on compute nodes in a Batch pool.
1. *Optional*: Use the [Azure portal](https://portal.azure.com) or [Batch Explorer](https://azure.github.io/BatchExplorer/) to examine the sample pool, job, and task ("MultiInstanceSamplePool", "MultiInstanceSampleJob", "MultiInstanceSampleTask") before you delete the resources.

> [!TIP]
> You can download [Visual Studio Community](https://visualstudio.microsoft.com/vs/community/) for free if you don't already have Visual Studio.

Output from `MultiInstanceTasks.exe` is similar to the following:

```
Creating pool [MultiInstanceSamplePool]...
Creating job [MultiInstanceSampleJob]...
Adding task [MultiInstanceSampleTask] to job [MultiInstanceSampleJob]...
Awaiting task completion, timeout in 00:30:00...

Main task [MultiInstanceSampleTask] is in state [Completed] and ran on compute node [tvm-1219235766_1-20161017t162002z]:
---- stdout.txt ----
Rank 2 received string "Hello world" from Rank 0
Rank 1 received string "Hello world" from Rank 0

---- stderr.txt ----

Main task completed, waiting 00:00:10 for subtasks to complete...

---- Subtask information ----
subtask: 1
        exit code: 0
        node: tvm-1219235766_3-20161017t162002z
        stdout.txt:
        stderr.txt:
subtask: 2
        exit code: 0
        node: tvm-1219235766_2-20161017t162002z
        stdout.txt:
        stderr.txt:

Delete job? [yes] no: yes
Delete pool? [yes] no: yes

Sample complete, hit ENTER to exit...
```

## Next steps

- Read more about [MPI support for Linux on Azure Batch](/archive/blogs/windowshpc/introducing-mpi-support-for-linux-on-azure-batch).
- Learn how to [create pools of Linux compute nodes](batch-linux-nodes.md) for use in your Azure Batch MPI solutions.
