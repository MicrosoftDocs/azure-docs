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
	ms.date="06/29/2016"
	ms.author="marsma" />

# Task dependency in Azure Batch

The task dependency feature of Batch allows you to create tasks that are scheduled for execution on compute nodes only after the successful completion of other tasks. You can create tasks that depend on other tasks in a one-to-one or one-to-many relationship, or even a range dependency where a task depends on the successful completion of a group of tasks within a specific range of task IDs.

Use task dependencies in Azure Batch to implement MapReduce-style computational workload solutions, or create tasks whose relationship is expressed as a directed acyclic graph (DAG).

In this article we discuss configuring task dependency using the [Batch .NET][net_msdn] library. We first show how to [enable task dependency](#enable-task-dependency) on your jobs, then a quick demonstration of [configuring a task with dependencies](#create-dependent-tasks), and finally we discuss the three [dependency scenarios](#dependency-scenarios) supported by Batch.

## Enable task dependency

To use task dependency in your Batch application, you must first enable it on your [CloudJob][net_cloudjob] by setting its [UsesTaskDependencies][net_usestaskdependencies] property to `true`:

```csharp
CloudJob unboundJob = batchClient.JobOperations.CreateJob( "job001",
    new PoolInformation { PoolId = "pool001" });

// IMPORTANT: This is REQUIRED for using task dependencies.
unboundJob.UsesTaskDependencies = true;
```

>[AZURE.NOTE] In the above code snippet, "batchClient" is an instance of the [BatchClient][net_batchclient] class.

## Create dependent tasks

To create a task that is dependent on the successful completion of one ore more other tasks, you configure the [CloudTask][net_cloudtask].[DependsOn][net_dependson] property with a [TaskDependencies][net_taskdependencies] instance:

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
| [Task id range](#task-id-range) | *taskD* depends on a range of tasks, such as those with IDs *1* through *10*, before it executes | ![Diagram: Task id range dependency][3] |

## One-to-one

To create a task with a dependency on the successful completion of one other task, you supply a single task id to the [TaskDependencies][net_taskdependencies].[OnId][net_onid] static method when you populate the [DependsOn][net_dependson] property of the [CloudTask][net_cloudtask].

```csharp
// Task 'taskA' doesn't depend on any other tasks
new CloudTask("taskA", "cmd.exe /c echo taskA"),

// Task 'taskB' depends on completion of task 'taskA'
new CloudTask("taskB", "cmd.exe /c echo taskB")
{
    DependsOn = TaskDependencies.OnId("taskA")
},
```

## One-to-many

To create a task with dependency on the successful completion of multiple tasks, you supply one or more task IDs to the [TaskDependencies][net_taskdependencies].[OnIds][net_onids] static method when you populate the [DependsOn][net_dependson] property of the [CloudTask][net_cloudtask].

```csharp
// 'Rain' and 'Sun' don't depend on any other tasks
new CloudTask("Rain", "cmd.exe /c echo Rain"),
new CloudTask("Sun", "cmd.exe /c echo Sun"),

// Task 'Flowers' depends on completion of both 'Rain' and 'Sun'
// before it is run.
new CloudTask("Flowers", "cmd.exe /c echo Flowers")
{
    DependsOn = TaskDependencies.OnIds("Rain", "Sun")
},
```

## Task ID range

To create a task with dependency on the successful completion of a group of tasks whose IDs lie within range, you supply one or more task IDs to the [TaskDependencies][net_taskdependencies].[OnIdRange][net_onidrange] static method when you populate the [DependsOn][net_dependson] property of the [CloudTask][net_cloudtask].

>[AZURE.IMPORTANT] When using task ID ranges for your dependencies, your task IDs *must* be **string reprepresentations of integer values**.

```csharp
// Tasks 1, 2, and 3 don't depend on any other tasks. Because
// we will be using them for a task range dependency, we must
// specify string representations of integers as their ids.
new CloudTask("1", "cmd.exe /c echo 1"),
new CloudTask("2", "cmd.exe /c echo 2"),
new CloudTask("3", "cmd.exe /c echo 3"),

// Task 4 depends on a range of tasks, 1 through 3
new CloudTask("4", "cmd.exe /c echo 4")
{
    // To use a range of tasks, their ids must be integer values.
    // Note that we pass integers as parameters to TaskIdRange,
    // but their ids (above) are string representations of the ids.
    DependsOn = TaskDependencies.OnIdRange(1, 3)
},
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
[net_onid]: https://msdn.microsoft.com/library/microsoft.azure.batch.taskdependencies.onid.aspx
[net_onids]: https://msdn.microsoft.com/library/microsoft.azure.batch.taskdependencies.onids.aspx
[net_onidrange]: https://msdn.microsoft.com/library/microsoft.azure.batch.taskdependencies.onidrange.aspx
[net_usestaskdependencies]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudjob.usestaskdependencies.aspx
[net_taskdependencies]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.taskdependencies.aspx

[1]: ./media/batch-mpi/batch_mpi_01.png "Diagram: one-to-one dependency"
[2]: ./media/batch-mpi/batch_mpi_01.png "Diagram: one-to-many dependency"
[3]: ./media/batch-mpi/batch_mpi_01.png "Diagram: task id range dependency"