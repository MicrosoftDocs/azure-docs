---
title: Best practices
description: Learn best practices and useful tips for developing your Azure Batch solution.
ms.date: 05/22/2020
ms.topic: conceptual
---

# Azure Batch best practices

This article discusses a collection of best practices for using the Azure Batch service effectively and efficiently, based on  real-life experience with Batch. Read this article to avoid design pitfalls, potential performance issues, and anti-patterns while developing for, and using, Batch.

## Pools

[Pools](nodes-and-pools.md#pools) are the compute resources for executing jobs on the Batch service. The following sections provide recommendations for working with Batch pools.

### Pool configuration and naming

- **Pool allocation mode**
    When creating a Batch account, you can choose between two pool allocation modes: **Batch service** or **user subscription**. For most cases, you should use the default Batch service mode, in which pools are allocated behind the scenes in Batch-managed subscriptions. In the alternative user subscription mode, Batch VMs and other resources are created directly in your subscription when a pool is created. User subscription accounts are primarily used to enable an important, but small subset of scenarios. You can read more about user subscription mode at [Additional configuration for user subscription mode](batch-account-create-portal.md#additional-configuration-for-user-subscription-mode).

- **Consider job and task run time when determining job to pool mapping.**
    If you have jobs comprised primarily of short-running tasks, and the expected total task counts are small, so that the overall expected run time of the job is not long, do not allocate a new pool for each job. The allocation time of the nodes will diminish the run time of the job.

- **Pools should have more than one compute node.**
    Individual nodes are not guaranteed to always be available. While uncommon, hardware failures, operating system updates, and a host of other issues can cause individual nodes to be offline. If your Batch workload requires deterministic, guaranteed progress, you should allocate pools with multiple nodes.

- **Do not reuse resource names.**
    Batch resources (jobs, pools, etc.) often come and go over time. For example, you may create a pool on Monday, delete it on Tuesday, and then create another pool on Thursday. Each new resource you create should be given a unique name that you haven't used before. This can be done by using a GUID (either as the entire resource name, or as a part of it) or embedding the time the resource was created in the resource name. Batch supports [DisplayName](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.jobspecification.displayname?view=azure-dotnet), which can be used to give a resource a human readable name even if the actual resource ID is something that isn't that human friendly. Using unique names makes it easier for you to differentiate which particular resource did something in logs and metrics. It also removes ambiguity if you ever have to file a support case for a resource.

- **Continuity during pool maintenance and failure.**
    It's best to have your jobs use pools dynamically. If your jobs use the same pool for everything, there's a chance that your jobs won't run if something goes wrong with the pool. This is especially important for time-sensitive workloads. To fix this, select or create a pool dynamically when you schedule each job, or have a way to override the pool name so that you can bypass an unhealthy pool.

- **Business continuity during pool maintenance and failure**
    There are many possible causes that may prevent a pool from growing to the required size you desire, such as internal errors, capacity constraints, etc. For this reason, you should be ready to retarget jobs at a different pool (possibly with a different VM size - Batch supports this via [UpdateJob](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.protocol.joboperationsextensions.update?view=azure-dotnet)) if necessary. Avoid using a static pool ID with the expectation that it will never be deleted and never change.

### Pool lifetime and billing

Pool lifetime can vary depending upon the method of allocation and options applied to the pool configuration. Pools can have an arbitrary lifetime and a varying number of compute nodes in the pool at any point in time. It's your responsibility to manage the compute nodes in the pool either explicitly, or through features provided by the service (autoscale or autopool).

- **Keep pools fresh.**
    You should resize your pools to zero every few months to ensure you get the latest node agent updates and bug fixes. Your pool won't receive node agent updates unless it's recreated, or resized to 0 compute nodes. Before you recreate or resize your pool, it's recommended to download any node agent logs for debugging purposes, as discussed in the [Nodes](#nodes) section.

- **Pool re-creation**
    On a similar note, it's not recommended to delete and re-create your pools on a daily basis. Instead, create a new pool, update your existing jobs to point to the new pool. Once all of the tasks have been moved to the new pool, then delete the old pool.

- **Pool efficiency and billing**
    Batch itself incurs no extra charges, but you do incur charges for the compute resources used. You're billed for every compute node in the pool, regardless of the state it's in. This includes any charges required for the node to run such as storage and networking costs. To learn more best practices, see [Cost analysis and budgets for Azure Batch](budget.md).

### Pool allocation failures

Pool allocation failures can happen at any point during first allocation or subsequent resizes. This can be due to temporary capacity exhaustion in a region or failures in other Azure services that Batch relies on. Your core quota is not a guarantee but rather a limit.

### Unplanned downtime

It's possible for Batch pools to experience downtime events in Azure. Keep this in mind when planning and developing your scenario or workflow for Batch.

In the case that a node fails, Batch automatically attempts to recover these compute nodes on your behalf. This may trigger rescheduling any running task on the node that is recovered. See [Designing for retries](#design-for-retries-and-re-execution) to learn more about interrupted tasks.

### Azure region dependency

It's advised to not depend on a single Azure region if you have a time-sensitive or production workload. While rare, there are issues that can affect an entire region. For example, if your processing needs to start at a specific time, consider scaling up the pool in your primary region *well before your start time*. If that pool scale fails, you can fall back to scaling up a pool in a backup region (or regions). Pools across multiple accounts in different regions provide a ready, easily accessible backup if something goes wrong with another pool. For more information, see [Design your application for high availability](high-availability-disaster-recovery.md).

## Jobs

A [job](jobs-and-tasks.md#jobs) is a container designed to contain hundreds, thousands, or even millions of tasks. Follow these guidelines when creating jobs.

### Fewer jobs, more tasks

Using a job to run a single task is inefficient. For example, it's more efficient to use a single job containing 1000 tasks rather than creating 100 jobs that contain 10 tasks each. Running 1000 jobs, each with a single task, would be the least efficient, slowest, and most expensive approach to take.

Because of this, make sure not to design a Batch solution that requires thousands of simultaneously active jobs. There is no quota for tasks, so executing many tasks under as few jobs as possible efficiently uses your [job and job schedule quotas](batch-quota-limit.md#resource-quotas).

### Job lifetime

A Batch job has an indefinite lifetime until it's deleted from the system. Its state designates whether it can accept more tasks for scheduling or not.

A job does not automatically move to completed state unless explicitly terminated. This can be automatically triggered through the [onAllTasksComplete](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.common.onalltaskscomplete?view=azure-dotnet) property or [maxWallClockTime](https://docs.microsoft.com/rest/api/batchservice/job/add#jobconstraints).

There is a default [active job and job schedule quota](batch-quota-limit.md#resource-quotas). Jobs and job schedules in completed state do not count towards this quota.

## Tasks

[Tasks](jobs-and-tasks.md#tasks) are individual units of work that comprise a job. Tasks are submitted by the user and scheduled by Batch on to compute nodes. There are several design considerations to make when creating and executing tasks. The following sections explain common scenarios and how to design your tasks to handle issues and perform efficiently.

### Save task data

Compute nodes are by their nature ephemeral. There are many features in Batch such as autopool and autoscale that make it easy for nodes disappear. When nodes leave pool (due to a resize, or a pool delete) all the files on those nodes are also deleted. Because of this, a task should move its output off of the node it is running on and to a durable store before it completes. Similarly, if a task fails, it should move logs required to diagnose the failure to a durable store.

Batch has integrated support Azure Storage to upload data via [OutputFiles](batch-task-output-files.md), as well as a variety of shared file systems, or you can perform the upload yourself in your tasks.

### Manage task lifetime

Delete tasks when they are no longer needed, or set a [retentionTime](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.taskconstraints.retentiontime?view=azure-dotnet) task constraint. If a `retentionTime` is set, Batch automatically cleans up the disk space used by the task when the `retentionTime` expires.

Deleting tasks accomplishes two things. It ensures that you do not have a build-up of tasks in the job, which can make it harder to query/find the task you're interested in (because you'll have to filter through the Completed tasks). It also cleans up the corresponding task data on the node (provided `retentionTime` has not already been hit). This helps ensure that your nodes don't fill up with task data and run out of disk space.

### Submit large numbers of tasks in collection

Tasks can be submitted on an individual basis or in collections. Submit tasks in [collections](https://docs.microsoft.com/rest/api/batchservice/task/addcollection) of up to 100 at a time when doing bulk submission of tasks to reduce overhead and submission time.

### Set max tasks per node appropriately

Batch supports oversubscribing tasks on nodes (running more tasks than a node has cores). It's up to you to ensure that your tasks "fit" into the nodes in your pool. For example, you may have a degraded experience if you attempt to schedule eight tasks that each consume 25% CPU usage onto one node (in a pool with `maxTasksPerNode = 8`).

### Design for retries and re-execution

Tasks can be automatically retried by Batch. There are two types of retries: user-controlled and internal. User-controlled retries are specified by the task's [maxTaskRetryCount](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.taskconstraints.maxtaskretrycount?view=azure-dotnet). When a program specified in the task exits with a non-zero exit code, the task is retried up to the value of the `maxTaskRetryCount`.

Although rare, a task can be retried internally due to failures on the compute node, such as not being able to update internal state or a failure on the node while the task is running. The task will be retried on the same compute node, if possible, up to an internal limit before giving up on the task and deferring the task to be rescheduled by Batch, potentially on a different compute node.

There are no design differences when executing your tasks on dedicated or low-priority nodes. Whether a task is preempted while running on a low-priority node or interrupted due to a failure on a dedicated node, both situations are mitigated by designing the task to withstand failure.

### Build durable tasks

Tasks should be designed to withstand failure and accommodate retry. This is especially important for long running tasks. To do this, ensure tasks generate the same, single result even if they are run more than once. One way to achieve this is to make your tasks "goal seeking." Another way is to make sure your tasks are idempotent (tasks will have the same outcome no matter how many times they are run).

A common example is a task to copy files to a compute node. A simple approach is a task that copies all the specified files every time it runs, which is inefficient and isn't built to withstand failure. Instead, create a task to ensure the files are on the compute node; a task that doesn't recopy files that are already present. In this way, the task picks up where it left off if it was interrupted.

### Avoid short execution time

Tasks that only run for one to two seconds are not ideal. You should try to do a significant amount of work in an individual task (10 second minimum, going up to hours or days). If each task is executing for one minute (or more), then the scheduling overhead as a fraction of overall compute time is small.


## Nodes

A [compute node](nodes-and-pools.md#nodes) is an Azure virtual machine (VM) or cloud service VM that is dedicated to processing a portion of your application's workload. Follow these guidelines when working with nodes.

### Idempotent start tasks

Just as with other tasks, the node [start task](jobs-and-tasks.md#start-task) should be idempotent, as it will be rerun every time the node boots. An idempotent task is simply one that produces a consistent result when run multiple times.

### Manage long-running services via the operating system services interface

Sometimes there is a need to run another agent alongside the Batch agent in the node. For example, you may want to gather data from the node and report it. We recommend that these agents be deployed as OS services, such as a Windows service or a Linux `systemd` service.

When running these services, they must not take file locks on any files in Batch-managed directories on the node, because otherwise Batch will be unable to delete those directories due to the file locks. For example, if installing a Windows service in a start task, instead of launching the service directly from the start task working directory, copy the files elsewhere (or if the files exist just skip the copy). Then install the service from that location. When Batch reruns your start task, it will delete the start task working directory and create it again. This works because the service has file locks on the other directory, not the start task working directory.

### Avoid creating directory junctions in Windows

Directory junctions, sometimes called directory hard-links, are difficult to deal with during task and job cleanup. Use symlinks (soft-links) rather than hard-links.

### Collect the Batch agent logs

If you notice a problem involving the behavior of a node or tasks running on a node, collect the Batch agent logs prior to deallocating the nodes in question. The Batch agent logs can be collected using the Upload Batch service logs API. These logs can be supplied as part of a support ticket to Microsoft and will help with issue troubleshooting and resolution.

## Isolation security

For the purposes of isolation, if your scenario requires isolating jobs from each other, do so by having them in separate pools. A pool is the security isolation boundary in Batch, and by default, two pools are not visible or able to communicate with each other. Avoid using separate Batch accounts as a means of isolation.

## Moving Batch accounts across regions

There are scenarios in which it might be helpful to move an existing Batch account from one region to another. For example, you may want to move to another region as part of disaster recovery planning.

Azure Batch accounts cannot be directly moved from one region to another. You can however, use an Azure Resource Manager template to export the existing configuration of your Batch account. You can then stage the resource in another region by exporting the Batch account to a template, modifying the parameters to match the destination region, and then deploying the template to the new region.

After you upload the template to the new region, you will have to recreate certificates, job schedules, and application packages. To commit the changes and complete the move of the Batch account, remember to delete the original Batch account or resource group.

For more information on Resource Manager and templates, see [Quickstart: Create and deploy Azure Resource Manager templates by using the Azure portal](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-quickstart-create-templates-use-the-portal).

## Connectivity

Review the following guidance when considering connectivity in your Batch solutions.

### Network Security Groups (NSGs) and User Defined Routes (UDRs)

When provisioning [Batch pools in a virtual network](batch-virtual-network.md), ensure that you are closely following
the guidelines regarding the use of the `BatchNodeManagement` service tag, ports, protocols and direction of the rule.
Use of the service tag is highly recommended, rather than using the underlying Batch service IP addresses. This is because the IP addresses can change over time. Using Batch service IP addresses directly can cause instability, interruptions, or outages for your Batch pools.

For User Defined Routes (UDRs), ensure that you have a process in place to update Batch service IP addresses periodically
in your route table, since these addresses change over time. To learn how to obtain the list of Batch service IP addresses, see [Service tags on-premises](../virtual-network/service-tags-overview.md). The Batch service IP addresses will be
associated with the `BatchNodeManagement` service tag (or the regional variant that matches your Batch account region).

### Honoring DNS

Ensure that your systems are honoring DNS Time-to-Live (TTL) for your Batch account service URL. Additionally, ensure
that your Batch service clients and other connectivity mechanisms to the Batch service do not rely on IP addresses (or [create a pool with static public IP addresses](create-pool-public-ip.md) as described below).

If your requests receive 5xx level HTTP responses and there is a "Connection: close" header in the response, your
Batch service client should observe the recommendation by closing the existing connection, re-resolving DNS for the
Batch account service URL, and attempt following requests on a new connection.

### Retry requests automatically

Ensure that your Batch service clients have appropriate retry policies in place to automatically retry your requests, even
during normal operation and not exclusively during any service maintenance time periods. These retry policies should span an
interval of at least 5 minutes. Automatic retry capabilities are provided with various Batch SDKs, such as the
[.NET RetryPolicyProvider class](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.retrypolicyprovider?view=azure-dotnet).

### Static public IP addresses

Typically, virtual machines in a Batch pool are accessed through public IP addresses that can change over the lifetime of the pool. This can make it difficult to interact with a database or other external service that limits access to certain IP addresses. To ensure that the public IP addresses in your pool don't change unexpectedly, you can create a pool using a set of static public IP addresses that you control. For more information, see [Create an Azure Batch pool with specified public IP addresses](create-pool-public-ip.md).

## Batch node underlying dependencies

Consider the following dependencies and restrictions when designing your Batch solutions.

### System-created resources

Azure Batch creates and manages a set of users and groups on the VM, which should not be altered. They are as follows:

#### Windows

- A user named **PoolNonAdmin**
- A user group named **WATaskCommon**

#### Linux

- A user named **_azbatch**

### File cleanup

Batch actively tries to clean up the working directory that tasks are run in, once their retention time expires. Any files written outside of this directory are [your responsibility to clean up](#manage-task-lifetime) to avoid filling up disk space. 

The automated cleanup for the working directory will be blocked if you run a service on Windows from the startTask working directory, due to the folder still being in use. This will result in degraded performance. To fix this, change the directory for that service to a separate directory that isn't managed by Batch.
