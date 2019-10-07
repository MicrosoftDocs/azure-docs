---
title: Best practices - Azure Batch
description: Learn best practices and useful tips for developing your Azure Batch solution.
author: laurenhughes
ms.author: lahugh
ms.date: 10/04/2019
ms.service: batch 
ms.topic: article
manager: gwallace
---

# Azure Batch best practices

This article discusses a collection of best practices for using the Azure Batch service effectively and efficiently. These best practices are derived from our experience with Batch and the experiences of Batch customers. It's important to understand this article to avoid design pitfalls, potential performance issues, and anti-patterns while developing for and using Batch.

In this article, you'll learn:

> [!div class="checklist"]
> - What is the best practice
> - Why you should use that best practice
> - What might happen if you fail to enable the best practice
> - How to enable the best practice

## Pools

Batch pools are the compute resources for executing jobs scheduled to the Batch service. The following sections provide guidance on the top best practices to follow when working with Batch pools.

### Pool configuration and naming

- **Pool allocation mode**  
  When creating a Batch account, you can choose between two pool allocation modes: **Batch service** or **user subscription**. For most cases, you should use the default Batch service mode, in which pools are allocated behind the scenes in Azure-managed subscriptions. In the alternative user subscription mode, Batch VMs and other resources are created directly in your subscription when a pool is created. To learn more about creating a user subscription account, see [Additional configuration for user subscription mode](batch-account-create-portal.md#additional-configuration-for-user-subscription-mode).

- **Pools should have more than one compute node.**  
    It's inefficient to create a pool for a single task or job. For example, if you have 1000 tasks to process, and have a dedicated pool with one compute node for each job, every job incurs the overhead and cost of node allocation. Additionally, if there are provisioning issues, the compute node will stop that particular task. Instead, create a single pool with many compute nodes. The overhead of provisioning the compute nodes is shared by all of the tasks. Any potential issues with provisioning one compute node will have no material impact on processing.

- **Use unique names for your pools.**  
    It's helpful to use unique names for pools, tasks, and jobs across different Azure regions or even in the same region. Different names help with logging because they are unique and more easily identifiable. Unique names also help avoid potential collisions between similarly named resources.

- **Continuity during pool maintenance and failure.**  
    It's best to have your jobs use pools dynamically. If your jobs use the same pool for everything, there's a chance that your jobs won't run if something goes wrong with the pool. This is especially important for time-sensitive workloads. To fix this, select or create a pool dynamically when you schedule each job, or have a way to override the pool name so that you can bypass an unhealthy pool.

### Pool lifetime and billing

Pool lifetime can vary depending upon the method of allocation and options applied to the pool configuration. Pools can have an arbitrary lifetime and a varying number of compute nodes in the pool at any point in time. It's your responsibility to manage the compute nodes in the pool either explicitly, or through features provided by the service (autoscale or autopool).

- **Keep pools fresh.**  
    You should delete your pools every couple of months to ensure you get the latest updates and bug fixes made to the node agent. Your pool won't receive node agent updates unless it's recreated, or resized to 0 compute nodes. Before you recreate or resize your pool, it's recommended to download any node agent logs for debugging purposes.

- **Pool recreation**  
    On a similar note, it's not recommended to delete and recreate your pools on a daily basis. Instead, use an [autoscale](batch-automatic-scaling.md) formula to resize the pool to 0 compute nodes. An autoscale formula will resize your pool automatically and save costs by quickly releasing compute nodes.

- **Pool efficiency and billing**  
    Batch itself incurs no charges, but you do incur charges for the compute resources used. You're billed for every compute node in the pool, regardless of the state it's in. This includes any charges required for the virtual machine to run such as storage and networking costs. To learn more best practices, see [Cost analysis and budgets for Azure Batch](budget.md).

### Pool allocation failures

Pool allocation failures can happen at any point during first allocation or subsequent resizes. This can be due to temporary capacity exhaustion in a region or failures in other Azure services that Batch relies on. Your core quota is not a guarantee but rather a limit.

- **Use formulas for allocation**  
    Utilize [autoscale](batch-automatic-scaling.md) formulas to maximize your compute resources and reduce idle time.

### Unplanned downtime

It's possible for Batch pools to experience downtime events in Azure. This is important to keep in mind when planning and developing your scenario or workflow for Batch.

In the case that a node fails, Batch automatically attempts to recover these compute nodes on your behalf. This may trigger rescheduling any running task on the node that is recovered. See [Designing for retries](#designing-for-retries) to learn more about interrupted tasks.

- **Azure region dependency**  
    It's advised to not depend on a single Azure region if you have a time-sensitive or production workload. While rare, there are issues that can affect an entire region. For example, if your processing needs to start at a specific time, consider scaling up pools in multiple regions before your start time. Scaled pools in multiple regions provide a ready, easily accessible backup if something goes wrong with another pool. If you must have your resources in a single region, consider using multiple pools instead of relying on a single pool.

## Jobs

A job is a container designed to contain hundreds, thousands, or even millions of tasks.

- **Put many tasks in a job**  
    Using a job to run a single task is inefficient. For example, it's much more efficient to use a single job containing 1000 tasks rather than creating 10 jobs that contain 100 tasks each. There is no quota for tasks, so executing as many tasks under as few jobs as possible efficiently uses your [job and job schedule quotas](batch-quota-limit.md#resource-quotas).

- **Job lifetime**  
    A Batch job has an indefinite lifetime until it's deleted from the system. A job’s state designates whether it can accept more tasks for scheduling or not. A job does not automatically move to completed state unless explicitly or automatically performed through the [onAllTasksComplete](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.common.onalltaskscomplete?view=azure-dotnet) property.

    A job with no tasks is considered complete if `onAllTasksComplete` is set to `terminateJob`. If `onAllTasksComplete` is used outside of a job manager context, the job should set this property to `noAction` first, then patched to `terminateJob` after tasks have been added. If you use a large amount of jobs, you should delete any unused jobs to avoid reaching your job quota.

There is a default [active job and job schedule quota](batch-quota-limit.md#resource-quotas). Jobs and job schedules in completed state do not count towards this quota.

## Tasks

Tasks are individual units of work that comprise a job. Tasks are submitted by the user and scheduled by Batch on to compute nodes. There are several design considerations to make when creating and executing tasks. The following sections explain common scenarios and how to design your tasks to handle issues and perform efficiently.

### Task lifetime

- **Delete tasks when they're complete**  
    A task has a default lifetime of 180 days until it's deleted from the system. Anything generated by the task, such as log files or program output, is stored on the compute node disk until the task is deleted. It's recommended to delete tasks explicitly when they are no longer needed, or set a [retentionTime](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.taskconstraints.retentiontime?view=azure-dotnet) task constraint. If a `retentionTime` is set, Batch automatically cleans up the disk space used by the task when the corresponding `retentionTime` expires.

### Task submission

- **Submit a large number of tasks in a collection**  
    Tasks can be submitted on an individual basis or in collections. Submit tasks in [collections](https://docs.microsoft.com/rest/api/batchservice/task/addcollection) when doing bulk submission of tasks to reduce overhead and submission time. The C# SDK has built-in helpers to do this on your behalf. The Python SDK always submit tasks as a list. Other SDKs have separate add task collection interfaces.

### Task execution

- **Task execution order**  
    Tasks within a job don't have execution ordering guarantees that may be found in other scheduling systems (for example: `first in, first out` order). However, job priorities can be applied to order execution priority amongst jobs, which subsequently gives priority to the tasks in those jobs.

- **Maximize tasks on a node**  
    When the `maxTasksPerNode` setting is set to a higher number than the default of 1 on the pool, the Batch scheduler packs tasks within each node first. This can be controlled by setting [ComputeNodeFillType](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.common.computenodefilltype?view=azure-dotnet) to spread tasks across compute nodes prior to packing. If you use the pack setting, there will be more tasks per node, maximizing the use of compute nodes and allowing associated autoscale formulas to minimize the target number of nodes.

### Designing for retries

Tasks can be automatically retried by Batch. There are two types of retries: user-controlled and internal. User-controlled retries are specified by the task’s [maxTaskRetryCount](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.taskconstraints.maxtaskretrycount?view=azure-dotnet). When a program specified in the task exits with a non-zero exit code, the task is retried up to the value of the `maxTaskRetryCount`.

Although rare, a task can be retried internally due to failures on the compute node, such as not being able to update internal state or a failure on the node while the task is running. The task will be retried on the same compute node, if possible, up to an internal limit before giving up on the task and deferring the task to be rescheduled by Batch, potentially on a different compute node.

- **Build durable tasks**  
    Tasks should be designed to withstand failure and accommodate retry. To do this, ensure tasks generate the same, single result even if they are run more than once. One way to achieve this is to make your tasks “goal seeking”.

    A common example is to create a task to copy files to a compute node. The task copies the specified files **every** time it runs, which is inefficient and isn't built to withstand failure. Instead, create a task to ensure the files are on the compute node. This task doesn't recopy files that are already present, and the task picks up where it left off if it was interrupted.

- **Low priority nodes**  
    There are no design differences when executing your tasks on dedicated or low-priority nodes. Whether a task is preempted while running on a low-priority node or interrupted due to a failure on a dedicated node, both situations are mitigated by designing the task to withstand failure.

## Security

### Security isolation

For the purposes of isolation, if your scenario requires isolating jobs from each other, then you should isolate these jobs by having them in separate pools. A pool is the security isolation boundary in Batch, and by default, two pools are not visible or able to communicate with each other.

TODO: Add best practices here

## Storage account

TODO: Add best practices here

## Debugging

TODO: Add best practices here
