<properties
	pageTitle="Task dependencies in Azure Batch | Microsoft Azure"
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

# Task dependencies in Azure Batch

The task dependencies feature of Azure Batch is a good fit if you want to process:

- MapReduce-style workloads in the cloud.
- Jobs whose data processing tasks can be expressed as a directed acyclic graph (DAG).
- Any other job in which downstream tasks depend on the output of upstream tasks.

With this feature, you can create tasks that are scheduled for execution on compute nodes only after the successful completion of one or more other tasks. For example, you can create a job that renders each frame of a 3D movie with separate, parallel tasks. The final task--the "merge task"--merges the rendered frames into the complete movie only after all of the frames have been successfully rendered.

You can create tasks that depend on other tasks in a one-to-one or one-to-many relationship. You can even create a range dependency where a task depends on the successful completion of a group of tasks within a specific range of task IDs. You can combine these three basic scenarios to create many-to-many relationships.

## Task dependencies with Batch .NET

In this article, we discuss how to configure task dependencies by using the [Batch .NET][net_msdn] library. We first show you how to [enable task dependency](#enable-task-dependencies) on your jobs, and we then briefly demonstrate how to [configure a task with dependencies](#create-dependent-tasks). Finally, we discuss the [dependency scenarios](#dependency-scenarios) that Batch supports.

## Enable task dependencies

To use task dependencies in your Batch application, you must first tell the Batch service that the job will use task dependencies. In Batch .NET, enable it on your [CloudJob][net_cloudjob] by setting its [UsesTaskDependencies][net_usestaskdependencies] property to `true`:

```csharp
CloudJob unboundJob = batchClient.JobOperations.CreateJob( "job001",
    new PoolInformation { PoolId = "pool001" });

// IMPORTANT: This is REQUIRED for using task dependencies.
unboundJob.UsesTaskDependencies = true;
```

In the above code snippet, "batchClient" is an instance of the [BatchClient][net_batchclient] class.

## Create dependent tasks

To create a task that is dependent on the successful completion of one or more other tasks, you tell Batch that the task "depends on" the other tasks. In Batch .NET, configure the [CloudTask][net_cloudtask].[DependsOn][net_dependson] property with an instance of the [TaskDependencies][net_taskdependencies] class:

```csharp
// Task 'Flowers' depends on completion of both 'Rain' and 'Sun'
// before it is run.
new CloudTask("Flowers", "cmd.exe /c echo Flowers")
{
    DependsOn = TaskDependencies.OnIds("Rain", "Sun")
},
```

This code snippet creates a task with the ID of "Flowers" that will be scheduled to run on a compute node only after the tasks with IDs of "Rain" and "Sun" have completed successfully.

 > [AZURE.NOTE] A task is considered to be completed when it is in the **completed** state and its **exit code** is `0`. In Batch .NET, this means a [CloudTask][net_cloudtask].[State][net_taskstate] property value of `Completed` and the CloudTask's [TaskExecutionInformation][net_taskexecutioninformation].[ExitCode][net_exitcode] property value is `0`.

## Dependency scenarios

There are three basic task dependency scenarios that you can use in Azure Batch: one-to-one, one-to-many, and task ID range dependency. These can be combined to provide a fourth scenario, many-to-many.

 Scenario&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Example | |
 :-------------------: | ------------------- | -------------------
 [One-to-one](#one-to-one) | *taskB* depends on *taskA* <p/> *taskB* will not be scheduled for execution until *taskA* has completed successfully | ![Diagram: one-to-one task dependency][1]
 [One-to-many](#one-to-many) | *taskC* depends on both *taskA* and *taskB* <p/> *taskC* will not be scheduled for execution until both *taskA* and *taskB* have completed successfully | ![Diagram: one-to-many task dependency][2]
 [Task ID range](#task-id-range) | *taskD* depends on a range of tasks <p/> *taskD* will not be scheduled for execution until the tasks with IDs *1* through *10* have completed successfully | ![Diagram: Task id range dependency][3]

>[AZURE.TIP] You can create **many-to-many** relationships, such as where tasks C, D, E, and F each depend on tasks A and B. This is useful, for example, in parallelized preprocessing scenarios where your downstream tasks depend on the output of multiple upstream tasks.

### One-to-one

To create a task that has a dependency on the successful completion of one other task, you supply a single task ID to the [TaskDependencies][net_taskdependencies].[OnId][net_onid] static method when you populate the [DependsOn][net_dependson] property of [CloudTask][net_cloudtask].

```csharp
// Task 'taskA' doesn't depend on any other tasks
new CloudTask("taskA", "cmd.exe /c echo taskA"),

// Task 'taskB' depends on completion of task 'taskA'
new CloudTask("taskB", "cmd.exe /c echo taskB")
{
    DependsOn = TaskDependencies.OnId("taskA")
},
```

### One-to-many

To create a task that has a dependency on the successful completion of multiple tasks, you supply a collection of task IDs to the [TaskDependencies][net_taskdependencies].[OnIds][net_onids] static method when you populate the [DependsOn][net_dependson] property of [CloudTask][net_cloudtask].

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

### Task ID range

To create a task that has a dependency on the successful completion of a group of tasks whose IDs lie within a range, you supply the first and last task IDs in the range to the [TaskDependencies][net_taskdependencies].[OnIdRange][net_onidrange] static method when you populate the [DependsOn][net_dependson] property of [CloudTask][net_cloudtask].

>[AZURE.IMPORTANT] When you use task ID ranges for your dependencies, the task IDs in the range *must* be string representations of integer values. Additionally, every task in the range must complete successfully for the dependent task to be scheduled for execution.

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

The [TaskDependencies][github_taskdependencies] sample project is one of the [Azure Batch code samples][github_samples] on GitHub. This Visual Studio 2015 solution demonstrates how to enable task dependency on a job, create tasks that are dependent on other tasks, and execute those tasks on a pool of compute nodes.

## Next steps

### Application deployment

The [application packages](batch-application-packages.md) feature of Batch provides an easy way to both deploy and version the applications that your tasks execute on compute nodes.

### Installing applications and staging data

Check out the [Installing applications and staging data on Batch compute nodes][forum_post] post in the Azure Batch forum for an overview of the various methods to prepare your nodes to run tasks. Written by one of the Azure Batch team members, this post is a good primer on the different ways to get files (including both applications and task input data) onto your compute nodes. It provides some special considerations to take into account for each method.

[forum_post]: https://social.msdn.microsoft.com/Forums/en-US/87b19671-1bdf-427a-972c-2af7e5ba82d9/installing-applications-and-staging-data-on-batch-compute-nodes?forum=azurebatch
[github_taskdependencies]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/TaskDependencies
[github_samples]: https://github.com/Azure/azure-batch-samples
[net_batchclient]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.batchclient.aspx
[net_cloudjob]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudjob.aspx
[net_cloudtask]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.aspx
[net_dependson]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.dependson.aspx
[net_exitcode]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.taskexecutioninformation.exitcode.aspx
[net_msdn]: https://msdn.microsoft.com/library/azure/mt348682.aspx
[net_onid]: https://msdn.microsoft.com/library/microsoft.azure.batch.taskdependencies.onid.aspx
[net_onids]: https://msdn.microsoft.com/library/microsoft.azure.batch.taskdependencies.onids.aspx
[net_onidrange]: https://msdn.microsoft.com/library/microsoft.azure.batch.taskdependencies.onidrange.aspx
[net_taskexecutioninformation]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.taskexecutioninformation.aspx
[net_taskstate]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.common.taskstate.aspx
[net_usestaskdependencies]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudjob.usestaskdependencies.aspx
[net_taskdependencies]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.taskdependencies.aspx

[1]: ./media/batch-task-dependency/01_one_to_one.png "Diagram: one-to-one dependency"
[2]: ./media/batch-task-dependency/02_one_to_many.png "Diagram: one-to-many dependency"
[3]: ./media/batch-task-dependency/03_task_id_range.png "Diagram: task id range dependency"
