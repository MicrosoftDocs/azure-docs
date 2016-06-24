<properties
	pageTitle="Task dependency in Azure Batch | Microsoft Azure"
	description="Create tasks that depend on the successful completion of other tasks for processing MapReduce style and similar big data workloads in Azure Batch."
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
	ms.date="06/30/2016"
	ms.author="marsma" />

# Task dependency in Azure Batch

The task dependency feature of Batch allows you to create tasks that are scheduled for execution on compute nodes only after the successful completion of other tasks. You can create tasks that depend on other tasks in a one-to-one or one-to-many relationship, or even a range dependency where a task depends on the successful completion of a group of tasks within a specific range of task ids.

Use task dependencies in Azure Batch to implement MapReduce-style computational workload solutions, or create tasks whose relationship is expressed as a directed acyclic graph (DAG).

In this article we discuss configuring task dependency using the [Batch .NET][net_msdn] library. We first show how to [enable task dependency](#enable-task-dependency) on your jobs, then a quick demonstration of [configuring a task with dependencies](#create-dependent-tasks), and finally we discuss the three [dependency scenarios](#dependency-scenarios) supported by Batch.

## Enable task dependency

To use task dependency in your Batch application, you must first enable it on your [CloudJob][net_cloudjob] by setting its UsesTaskDependencies property to `true`:

```csharp
CloudJob unboundJob = batchClient.JobOperations.CreateJob( "job001",
    new PoolInformation { PoolId = "pool001" });

// IMPORTANT: This is REQUIRED for using task dependencies.
unboundJob.UsesTaskDependencies = true;
```

>[AZURE.NOTE] In this and the other code snippets in this article, "batchClient" is an instance of the BatchClient class.

## Create dependent tasks

To create a task that is dependent on the successful completion of one ore more other tasks, you configure the CloudTask.DependsOn property with a TaskDependencies instance:

```csharp
// Task 'Flowers' depends on completion of both 'Rain' and 'Sun'
// before it is run.
new CloudTask("Flowers", "cmd.exe /c echo Flowers")
{
    DependsOn = TaskDependencies.OnIds("Rain", "Sun")
},
```

## Dependency scenarios

There are three task dependency scenarios that you can use in Azure Batch: **one-to-one**, **one-to-many**, and **task id range** dependency.

| Scenario&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Example | |
| :-------------------: | ------------------- | ------------------- |
| [One-to-one](#one-to-one) | *taskB* depends on *taskA* (*taskB* will not begin execution until *taskA* has completed) | ![Diagram: one-to-one task dependency][1] |
| [One-to-many](#one-to-many) | *taskC* depends on both *taskA* and *taskB* | ![Diagram: one-to-many task dependency][2] |
| [Task id range](#task-id-range) | *taskD* depends on a range of tasks, such as those with ids *1* through *10*, before it executes | ![Diagram: Task id range dependency][3] |

## One-to-one

*taskB* depends on *taskA* (*taskB* will not begin execution until *taskA* has completed)

## One-to-many

*taskC* depends on both *taskA* and *taskB*

## Task id range

*taskD* depends on a range of tasks, such as tasks with ids *1* through *10*, before it executes

When using **task ranges** for your dependencies, your task IDs must be string reprepresentations of integer values.

```csharp
List<CloudTask> tasks = new List<CloudTask>
{
    new CloudTask("1", "cmd.exe /c MyTaskExecutable.exe -process datafile1")
    new CloudTask("2", "cmd.exe /c MyTaskExecutable.exe -process datafile2")
};
```

## Code sample

Check out the [TaskDependencies][github_taskdependencies] sample project on GitHub. One of the [Azure Batch code samples][github_samples], this Visual Studio 2015 solution demonstrates how to enable task dependency on a job, create tasks that use the three dependency scenarios, and execute those tasks on a pool of compute nodes.

## Next steps

* Next step 1

* Next step 2

[github_taskdependencies]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/TaskDependencies
[github_samples]: https://github.com/Azure/azure-batch-samples
[net_batchclient]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.batchclient.aspx
[net_cloudjob]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudjob.aspx
[net_cloudtask]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.aspx
[net_dependson]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.dependson.aspx
[net_msdn]: https://msdn.microsoft.com/library/azure/mt348682.aspx
[net_usestaskdependencies]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudjob.usestaskdependencies.aspx
[net_taskdependencies]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.taskdependencies.aspx

[1]: ./media/batch-mpi/batch_mpi_01.png "Diagram: one-to-one dependency"
[2]: ./media/batch-mpi/batch_mpi_01.png "Diagram: one-to-many dependency"
[3]: ./media/batch-mpi/batch_mpi_01.png "Diagram: task id range dependency"