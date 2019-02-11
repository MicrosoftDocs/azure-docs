---
title: Use task dependencies to run tasks based on the completion of other tasks - Azure Batch | Microsoft Docs
description: Create tasks that depend on the completion of other tasks for processing MapReduce style and similar big data workloads in Azure Batch.
services: batch
documentationcenter: .net
author: laurenhughes
manager: jeconnoc
editor: ''

ms.assetid: b8d12db5-ca30-4c7d-993a-a05af9257210
ms.service: batch
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: 
ms.workload: big-compute
ms.date: 05/22/2017
ms.author: lahugh
ms.custom: H1Hack27Feb2017

---
# Create task dependencies to run tasks that depend on other tasks

You can define task dependencies to run a task or set of tasks only after a parent task has completed. Some scenarios where task dependencies are useful include:

* MapReduce-style workloads in the cloud.
* Jobs whose data processing tasks can be expressed as a directed acyclic graph (DAG).
* Pre-rendering and post-rendering processes, where each task must complete before the next task can begin.
* Any other job in which downstream tasks depend on the output of upstream tasks.

With Batch task dependencies, you can create tasks that are scheduled for execution on compute nodes after the completion of one or more parent tasks. For example, you can create a job that renders each frame of a 3D movie with separate, parallel tasks. The final task--the "merge task"--merges the rendered frames into the complete movie only after all frames have been successfully rendered.

By default, dependent tasks are scheduled for execution only after the parent task has completed successfully. You can specify a dependency action to override the default behavior and run tasks when the parent task fails. See the [Dependency actions](#dependency-actions) section for details.  

You can create tasks that depend on other tasks in a one-to-one or one-to-many relationship. You can also create a range dependency where a task depends on the completion of a group of tasks within a specified range of task IDs. You can combine these three basic scenarios to create many-to-many relationships.

## Task dependencies with Batch .NET
In this article, we discuss how to configure task dependencies by using the [Batch .NET][net_msdn] library. We first show you how to [enable task dependency](#enable-task-dependencies) on your jobs, and then demonstrate how to [configure a task with dependencies](#create-dependent-tasks). We also describe how to specify a dependency action to run dependent tasks if the parent fails. Finally, we discuss the [dependency scenarios](#dependency-scenarios) that Batch supports.

## Enable task dependencies
To use task dependencies in your Batch application, you must first configure the job to use task dependencies. In Batch .NET, enable it on your [CloudJob][net_cloudjob] by setting its [UsesTaskDependencies][net_usestaskdependencies] property to `true`:

```csharp
CloudJob unboundJob = batchClient.JobOperations.CreateJob( "job001",
    new PoolInformation { PoolId = "pool001" });

// IMPORTANT: This is REQUIRED for using task dependencies.
unboundJob.UsesTaskDependencies = true;
```

In the preceding code snippet, "batchClient" is an instance of the [BatchClient][net_batchclient] class.

## Create dependent tasks
To create a task that depends on the completion of one or more parent tasks, you can specify that the task "depends on" the other tasks. In Batch .NET, configure the [CloudTask][net_cloudtask].[DependsOn][net_dependson] property with an instance of the [TaskDependencies][net_taskdependencies] class:

```csharp
// Task 'Flowers' depends on completion of both 'Rain' and 'Sun'
// before it is run.
new CloudTask("Flowers", "cmd.exe /c echo Flowers")
{
    DependsOn = TaskDependencies.OnIds("Rain", "Sun")
},
```

This code snippet creates a dependent task with task ID "Flowers". The "Flowers" task depends on tasks "Rain" and "Sun". Task "Flowers" will be scheduled to run on a compute node only after tasks "Rain" and "Sun" have completed successfully.

> [!NOTE]
> By default, a task is considered to be completed successfully when it is in the **completed** state and its **exit code** is `0`. In Batch .NET, this means a [CloudTask][net_cloudtask].[State][net_taskstate] property value of `Completed` and the CloudTask's [TaskExecutionInformation][net_taskexecutioninformation].[ExitCode][net_exitcode] property value is `0`. For how to change this, see the [Dependency actions](#dependency-actions) section.
> 
> 

## Dependency scenarios
There are three basic task dependency scenarios that you can use in Azure Batch: one-to-one, one-to-many, and task ID range dependency. These can be combined to provide a fourth scenario, many-to-many.

| Scenario&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Example |  |
|:---:| --- | --- |
|  [One-to-one](#one-to-one) |*taskB* depends on *taskA* <p/> *taskB* will not be scheduled for execution until *taskA* has completed successfully |![Diagram: one-to-one task dependency][1] |
|  [One-to-many](#one-to-many) |*taskC* depends on both *taskA* and *taskB* <p/> *taskC* will not be scheduled for execution until both *taskA* and *taskB* have completed successfully |![Diagram: one-to-many task dependency][2] |
|  [Task ID range](#task-id-range) |*taskD* depends on a range of tasks <p/> *taskD* will not be scheduled for execution until the tasks with IDs *1* through *10* have completed successfully |![Diagram: Task id range dependency][3] |

> [!TIP]
> You can create **many-to-many** relationships, such as where tasks C, D, E, and F each depend on tasks A and B. This is useful, for example, in parallelized preprocessing scenarios where your downstream tasks depend on the output of multiple upstream tasks.
> 
> In the examples in this section, a dependent task runs only after the parent tasks complete successfully. This behavior is the default behavior for a dependent task. You can run a dependent task after a parent task fails by specifying a dependency action to override the default behavior. See the [Dependency actions](#dependency-actions) section for details.

### One-to-one
In a one-to-one relationship, a task depends on the successful completion of one parent task. To create the dependency, provide a single task ID to the [TaskDependencies][net_taskdependencies].[OnId][net_onid] static method when you populate the [DependsOn][net_dependson] property of [CloudTask][net_cloudtask].

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
In a one-to-many relationship, a task depends on the completion of multiple parent tasks. To create the dependency, provide a collection of task IDs to the [TaskDependencies][net_taskdependencies].[OnIds][net_onids] static method when you populate the [DependsOn][net_dependson] property of [CloudTask][net_cloudtask].

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
In a dependency on a range of parent tasks, a task depends on the completion of tasks whose IDs lie within a range.
To create the dependency, provide the first and last task IDs in the range to the [TaskDependencies][net_taskdependencies].[OnIdRange][net_onidrange] static method when you populate the [DependsOn][net_dependson] property of [CloudTask][net_cloudtask].

> [!IMPORTANT]
> When you use task ID ranges for your dependencies, only tasks with IDs representing integer values will be selected by the range. So the range `1..10` will select tasks `3` and `7`, but not `5flamingoes`. 
> 
> Leading zeroes are not significant when evaluating range dependencies, so tasks with string identifiers `4`, `04` and `004` will all be *within* the range and they will all be treated as task `4`, so the first one to complete will satisfy the dependency.
> 
> Every task in the range must satisfy the dependency, either by completing successfully or by completing with a failure that’s mapped to a dependency action set to **Satisfy**. See the [Dependency actions](#dependency-actions) section for details.
>
>

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

## Dependency actions

By default, a dependent task or set of tasks runs only after a parent task has completed successfully. In some scenarios, you may want to run dependent tasks even if the parent task fails. You can override the default behavior by specifying a dependency action. A dependency action specifies whether a dependent task is eligible to run, based on the success or failure of the parent task. 

For example, suppose that a dependent task is awaiting data from the completion of the upstream task. If the upstream task fails, the dependent task may still be able to run using older data. In this case, a dependency action can specify that the dependent task is eligible to run despite the failure of the parent task.

A dependency action is based on an exit condition for the parent task. You can specify a dependency action for any of the following exit conditions; for .NET, see the [ExitConditions][net_exitconditions] class for details:

- When a pre-processing error occurs.
- When a file upload error occurs. If the task exits with an exit code that was specified via **exitCodes** or **exitCodeRanges**, and then encounters a file upload error, the action specified by the exit code takes precedence.
- When the task exits with an exit code defined by the **ExitCodes** property.
- When the task exits with an exit code that falls within a range specified by the **ExitCodeRanges** property.
- The default case, if the task exits with an exit code not defined by **ExitCodes** or **ExitCodeRanges**, or if the task exits with a pre-processing error and the **PreProcessingError** property is not set, or if the task fails with a file upload error and the **FileUploadError** property is not set. 

To specify a dependency action in .NET, set the [ExitOptions][net_exitoptions].[DependencyAction][net_dependencyaction] property for the exit condition. The **DependencyAction** property takes one of two values:

- Setting the **DependencyAction** property to **Satisfy** indicates that dependent tasks are eligible to run if the parent task exits with a specified error.
- Setting the **DependencyAction** property to **Block** indicates that dependent tasks are not eligible to run.

The default setting for the **DependencyAction** property is **Satisfy** for exit code 0, and **Block** for all other exit conditions.

The following code snippet sets the **DependencyAction** property for a parent task. If the parent task exits with a pre-processing error, or with the specified error codes, the dependent task is blocked. If the parent task exits with any other non-zero error, the dependent task is eligible to run.

```csharp
// Task A is the parent task.
new CloudTask("A", "cmd.exe /c echo A")
{
    // Specify exit conditions for task A and their dependency actions.
    ExitConditions = new ExitConditions
    {
        // If task A exits with a pre-processing error, block any downstream tasks (in this example, task B).
        PreProcessingError = new ExitOptions
        {
            DependencyAction = DependencyAction.Block
        },
        // If task A exits with the specified error codes, block any downstream tasks (in this example, task B).
        ExitCodes = new List<ExitCodeMapping>
        {
            new ExitCodeMapping(10, new ExitOptions() { DependencyAction = DependencyAction.Block }),
            new ExitCodeMapping(20, new ExitOptions() { DependencyAction = DependencyAction.Block })
        },
        // If task A succeeds or fails with any other error, any downstream tasks become eligible to run 
        // (in this example, task B).
        Default = new ExitOptions
        {
            DependencyAction = DependencyAction.Satisfy
        }
    }
},
// Task B depends on task A. Whether it becomes eligible to run depends on how task A exits.
new CloudTask("B", "cmd.exe /c echo B")
{
    DependsOn = TaskDependencies.OnId("A")
},
```

## Code sample
The [TaskDependencies][github_taskdependencies] sample project is one of the [Azure Batch code samples][github_samples] on GitHub. This Visual Studio solution demonstrates:

- How to enable task dependency on a job
- How to create tasks that depend on other tasks
- How to execute those tasks on a pool of compute nodes.

## Next steps
### Application deployment
The [application packages](batch-application-packages.md) feature of Batch provides an easy way to both deploy and version the applications that your tasks execute on compute nodes.

### Installing applications and staging data
See [Installing applications and staging data on Batch compute nodes][forum_post] in the Azure Batch forum for an overview of methods for preparing your nodes to run tasks. Written by one of the Azure Batch team members, this post is a good primer on the different ways to copy applications, task input data, and other files to your compute nodes.

[forum_post]: https://social.msdn.microsoft.com/Forums/en-US/87b19671-1bdf-427a-972c-2af7e5ba82d9/installing-applications-and-staging-data-on-batch-compute-nodes?forum=azurebatch
[github_taskdependencies]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/TaskDependencies
[github_samples]: https://github.com/Azure/azure-batch-samples
[net_batchclient]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.batchclient.aspx
[net_cloudjob]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudjob.aspx
[net_cloudtask]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.aspx
[net_dependson]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.dependson.aspx
[net_exitcode]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.taskexecutioninformation.exitcode.aspx
[net_exitconditions]: https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.exitconditions
[net_exitoptions]: https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.exitoptions
[net_dependencyaction]: https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.exitoptions
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
