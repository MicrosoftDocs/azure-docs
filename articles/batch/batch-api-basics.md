---
title: Overview of Azure Batch for developers | Microsoft Docs
description: Learn the features of the Batch service and its APIs from a development standpoint.
services: batch
documentationcenter: .net
author: dlepow
manager: jeconnoc
editor: ''

ms.assetid: 416b95f8-2d7b-4111-8012-679b0f60d204
ms.service: batch
ms.devlang: multiple
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: big-compute
ms.date: 08/22/2018
ms.author: danlep
ms.custom: H1Hack27Feb2017

---
# Develop large-scale parallel compute solutions with Batch

In this overview of the core components of the Azure Batch service, we discuss the primary service features and resources that Batch developers can use to build large-scale parallel compute solutions.

Whether you're developing a distributed computational application or service that issues direct [REST API][batch_rest_api] calls or you're using one of the [Batch SDKs](batch-apis-tools.md#azure-accounts-for-batch-development), you'll use many of the resources and features discussed in this article.

> [!TIP]
> For a higher-level introduction to the Batch service, see [Basics of Azure Batch](batch-technical-overview.md). Also see the latest [Batch service updates](https://azure.microsoft.com/updates/?product=batch).
>
>

## Batch service workflow
The following high-level workflow is typical of nearly all applications and services that use the Batch service for processing parallel workloads:

1. Upload the **data files** that you want to process to an [Azure Storage][azure_storage] account. Batch includes built-in support for accessing Azure Blob storage, and your tasks can download these files to [compute nodes](#compute-node) when the tasks are run.
2. Upload the **application files** that your tasks will run. These files can be binaries or scripts and their dependencies, and are executed by the tasks in your jobs. Your tasks can download these files from your Storage account, or you can use the [application packages](#application-packages) feature of Batch for application management and deployment.
3. Create a [pool](#pool) of compute nodes. When you create a pool, you specify the number of compute nodes for the pool, their size, and the operating system. When each task in your job runs, it's assigned to execute on one of the nodes in your pool.
4. Create a [job](#job). A job manages a collection of tasks. You associate each job to a specific pool where that job's tasks will run.
5. Add [tasks](#task) to the job. Each task runs the application or script that you uploaded to process the data files it downloads from your Storage account. As each task completes, it can upload its output to Azure Storage.
6. Monitor job progress and retrieve the task output from Azure Storage.

The following sections discuss these and the other resources of Batch that enable your distributed computational scenario.

> [!NOTE]
> You need a [Batch account](#account) to use the Batch service. Most Batch solutions also use an associated [Azure Storage][azure_storage] account for file storage and retrieval. 
>
>

## Batch service resources
Some of the following resources--accounts, compute nodes, pools, jobs, and tasks--are required by all solutions that use the Batch service. Others, like job schedules and application packages, are helpful, but optional, features.

* [Account](#account)
* [Compute node](#compute-node)
* [Pool](#pool)
* [Job](#job)
  * [Job schedules](#scheduled-jobs)
* [Task](#task)
  * [Start task](#start-task)
  * [Job manager task](#job-manager-task)
  * [Job preparation and release tasks](#job-preparation-and-release-tasks)
  * [Multi-instance task (MPI)](#multi-instance-tasks)
  * [Task dependencies](#task-dependencies)
* [Application packages](#application-packages)

## Account
A Batch account is a uniquely identified entity within the Batch service. All processing is associated with a Batch account.

You can create an Azure Batch account using the [Azure portal](batch-account-create-portal.md) or programmatically, such as with the [Batch Management .NET library](batch-management-dotnet.md). When creating the account, you can associate an Azure storage account for storing job-related input and output data or applications.

You can run multiple Batch workloads in a single Batch account, or distribute your workloads among Batch accounts that are in the same subscription, but in different Azure regions.

[!INCLUDE [batch-account-mode-include](../../includes/batch-account-mode-include.md)]

## Azure Storage account

Most Batch solutions use Azure Storage for storing resource files and output files. For example, your Batch tasks (including standard tasks, start tasks, job preparation tasks, and job release tasks) typically specify resource files that reside in a storage account.

Batch supports the following types of Azure Storage accounts:

* General-purpose v2 (GPv2) accounts 
* General-purpose v1 (GPv1) accounts
* Blob storage accounts (currently supported for pools in the Virtual Machine configuration)

For more information about storage accounts, see [Azure storage account overview](../storage/common/storage-account-overview.md).

You can associate a storage account with your Batch account when you create the Batch account, or later. Consider your cost and performance requirements when choosing a storage account. For example, the GPv2 and blob storage account options support greater [capacity and scalability limits](https://azure.microsoft.com/blog/announcing-larger-higher-scale-storage-accounts/) compared with GPv1. (Contact Azure Support to request an increase in a storage limit.) These account options can improve the performance of Batch solutions that contain a large number of parallel tasks that read from or write to the storage account.

## Compute node
A compute node is an Azure virtual machine (VM) or cloud service VM that is dedicated to processing a portion of your application's workload. The size of a node determines the number of CPU cores, memory capacity, and local file system size that is allocated to the node. You can create pools of Windows or Linux nodes by using Azure Cloud Services, images from the [Azure Virtual Machines Marketplace][vm_marketplace], or custom images that you prepare. See the following [Pool](#pool) section for more information on these options.

Nodes can run any executable or script that is supported by the operating system environment of the node. This includes \*.exe, \*.cmd, \*.bat and PowerShell scripts for Windows--and binaries, shell, and Python scripts for Linux.

All compute nodes in Batch also include:

* A standard [folder structure](#files-and-directories) and associated [environment variables](#environment-settings-for-tasks) that are available for reference by tasks.
* **Firewall** settings that are configured to control access.
* [Remote access](#connecting-to-compute-nodes) to both Windows (Remote Desktop Protocol (RDP)) and Linux (Secure Shell (SSH)) nodes.

## Pool
A pool is a collection of nodes that your application runs on. The pool can be created manually by you, or automatically by the Batch service when you specify the work to be done. You can create and manage a pool that meets the resource requirements of your application. A pool can be used only by the Batch account in which it was created. A Batch account can have more than one pool.

Azure Batch pools build on top of the core Azure compute platform. They provide large-scale allocation, application installation, data distribution, health monitoring, and flexible adjustment of the number of compute nodes within a pool ([scaling](#scaling-compute-resources)).

Every node that is added to a pool is assigned a unique name and IP address. When a node is removed from a pool, any changes that are made to the operating system or files are lost, and its name and IP address are released for future use. When a node leaves a pool, its lifetime is over.

When you create a pool, you can specify the following attributes:

- Compute node operating system and version
- Compute node type and target number of nodes
- Size of the compute nodes
- Scaling policy
- Task scheduling policy
- Communication status for compute nodes
- Start tasks for compute nodes
- Application packages
- Network configuration

Each of these settings is described in more detail in the following sections.

> [!IMPORTANT]
> Batch accounts have a default quota that limits the number of cores in a Batch account. The number of cores corresponds to the number of compute nodes. You can find the default quotas and instructions on how to [increase a quota](batch-quota-limit.md#increase-a-quota) in [Quotas and limits for the Azure Batch service](batch-quota-limit.md). If your pool is not achieving its target number of nodes, the core quota might be the reason.
>


### Compute node operating system and version

When you create a Batch pool, you can specify the Azure virtual machine configuration and the type of operating system you want to run on each compute node in the pool. The two types of configurations available in Batch are:

- The **Virtual Machine Configuration**, which specifies that the pool is comprised of Azure virtual machines. These VMs may be created from either Linux or Windows images. 

    When you create a pool based on the Virtual Machine Configuration, you must specify not only the size of the nodes and the source of the images used to create them, but also the **virtual machine image reference** and the Batch **node agent SKU** to be installed on the nodes. For more information about specifying these pool properties, see [Provision Linux compute nodes in Azure Batch pools](batch-linux-nodes.md). You can optionally attach one or more empty data disks to pool VMs created from Marketplace images, or include data disks in custom images used to create the VMs.

- The **Cloud Services Configuration**, which specifies that the pool is comprised of Azure Cloud Services nodes. Cloud Services provide Windows compute nodes *only*.

    Available operating systems for Cloud Services Configuration pools are listed in the [Azure Guest OS releases and SDK compatibility matrix](../cloud-services/cloud-services-guestos-update-matrix.md). When you create a pool that contains Cloud Services nodes, you need to specify the node size and its *OS Family*. Cloud Services are deployed to Azure more quickly than virtual machines running Windows. If you want pools of Windows compute nodes, you may find that Cloud Services provide a performance benefit in terms of deployment time.

    * The *OS Family* also determines which versions of .NET are installed with the OS.
    * As with worker roles within Cloud Services, you can specify an *OS Version* (for more information on worker roles, see the [Cloud Services overview](../cloud-services/cloud-services-choose-me.md)).
    * As with worker roles, we recommend that you specify `*` for the *OS Version* so that the nodes are automatically upgraded, and there is no work required to cater to newly released versions. The primary use case for selecting a specific OS version is to ensure application compatibility, which allows backward compatibility testing to be performed before allowing the version to be updated. After validation, the *OS Version* for the pool can be updated and the new OS image can be installed--any running tasks are interrupted and requeued.

When you create a pool, you need to select the appropriate **nodeAgentSkuId**, depending on the OS of the base image of your VHD. You can get a mapping of available node agent SKU ID's to their OS Image references by calling the [List Supported Node Agent SKUs](https://docs.microsoft.com/rest/api/batchservice/list-supported-node-agent-skus) operation.


#### Custom images for Virtual Machine pools

To use a custom image, you'll need to prepare the image by generalizing it. For information about preparing custom Linux images from Azure VMs, see [How to create an image of a virtual machine or VHD](../virtual-machines/linux/capture-image.md). For information about preparing custom Windows images from Azure VMs, see [Create a managed image of a generalized VM in Azure](../virtual-machines/windows/capture-image-resource.md). 

For detailed requirements and steps, see [Use a custom image to create a pool of virtual machines](batch-custom-images.md).

#### Container support in Virtual Machine pools

When creating a Virtual Machine Configuration pool using the Batch APIs, you can set up the pool to run tasks in Docker containers. Currently, you must create the pool using an image that supports Docker containers. Use the Windows Server 2016 Datacenter with Containers image from the Azure Marketplace, or supply a custom VM image that includes Docker Community Edition or Enterprise Edition and any required drivers. The pool settings must include a [container configuration](/rest/api/batchservice/pool/add#definitions_containerconfiguration) that copies container images to the VMs when the pool is created. Tasks that run on the pool can then reference the container images and container run options.

For more information, see [Run Docker container applications on Azure Batch](batch-docker-container-workloads.md).

## Compute node type and target number of nodes

When you create a pool, you can specify which types of compute nodes you want and the target number for each. The two types of compute nodes are:

- **Dedicated compute nodes.** Dedicated compute nodes are reserved for your workloads. They are more expensive than low-priority nodes, but they are guaranteed to never be preempted.

- **Low-priority compute nodes.** Low-priority nodes take advantage of surplus capacity in Azure to run your Batch workloads. Low-priority nodes are less expensive per hour than dedicated nodes, and enable workloads requiring a lot of compute power. For more information, see [Use low-priority VMs with Batch](batch-low-pri-vms.md).

    Low-priority compute nodes may be preempted when Azure has insufficient surplus capacity. If a node is preempted while running tasks, the tasks are requeued and run again once a compute node becomes available again. Low-priority nodes are a good option for workloads where the job completion time is flexible and the work is distributed across many nodes. Before you decide to use low-priority nodes for your scenario, make sure that any work lost due to preemption will be minimal and easy to recreate.

    
You can have both low-priority and dedicated compute nodes in the same pool. Each type of node &mdash; low-priority and dedicated &mdash; has its own target setting, for which you can specify the desired number of nodes. 
    
The number of compute nodes is referred to as a *target* because, in some situations, your pool might not reach the desired number of nodes. For example, a pool might not achieve the target if it reaches the [core quota](batch-quota-limit.md) for your Batch account first. Or, the pool might not achieve the target if you have applied an auto-scaling formula to the pool that limits the maximum number of nodes.

For pricing information for both low-priority and dedicated compute nodes, see [Batch Pricing](https://azure.microsoft.com/pricing/details/batch/).

### Size of the compute nodes

When you create an Azure Batch pool, you can choose from among almost all the VM families and sizes available in Azure. Azure offers a range of VM sizes for different workloads, including specialized [HPC](../virtual-machines/linux/sizes-hpc.md) or [GPU-enabled](../virtual-machines/linux/sizes-gpu.md) VM sizes. 

For more information, see [Choose a VM size for compute nodes in an Azure Batch pool](batch-pool-vm-sizes.md).

### Scaling policy

For dynamic workloads, you can write and apply an [auto-scaling formula](#scaling-compute-resources) to a pool. The Batch service periodically evaluates your formula and adjusts the number of nodes within the pool based on various pool, job, and task parameters that you can specify.

### Task scheduling policy

The [max tasks per node](batch-parallel-node-tasks.md) configuration option determines the maximum number of tasks that can be run in parallel on each compute node within the pool.

The default configuration specifies that one task at a time runs on a node, but there are scenarios where it is beneficial to have two or more tasks executed on a node simultaneously. See the [example scenario](batch-parallel-node-tasks.md#example-scenario) in the [concurrent node tasks](batch-parallel-node-tasks.md) article to see how you can benefit from multiple tasks per node.

You can also specify a *fill type* which determines whether Batch spreads the tasks evenly across all nodes in a pool, or packs each node with the maximum number of tasks before assigning tasks to another node.

### Communication status for compute nodes

In most scenarios, tasks operate independently and do not need to communicate with one another. However, there are some applications in which tasks must communicate, like [MPI scenarios](batch-mpi.md).

You can configure a pool to allow **internode communication**, so that nodes within a pool can communicate at runtime. When internode communication is enabled, nodes in Cloud Services Configuration pools can communicate with each other on ports greater than 1100, and Virtual Machine Configuration pools do not restrict traffic on any port.

Note that enabling internode communication also impacts the placement of the nodes within clusters and might limit the maximum number of nodes in a pool because of deployment restrictions. If your application does not require communication between nodes, the Batch service can allocate a potentially large number of nodes to the pool from many different clusters and datacenters to enable increased parallel processing power.

### Start tasks for compute nodes

The optional *start task* executes on each node as that node joins the pool, and each time a node is restarted or reimaged. The start task is especially useful for preparing compute nodes for the execution of tasks, like installing the applications that your tasks run on the compute nodes.

### Application packages

You can specify [application packages](#application-packages) to deploy to the compute nodes in the pool. Application packages provide simplified deployment and versioning of the applications that your tasks run. Application packages that you specify for a pool are installed on every node that joins that pool, and every time a node is rebooted or reimaged.

> [!NOTE]
> Application packages are supported on all Batch pools created after 5 July 2017. They are supported on Batch pools created between 10 March 2016 and 5 July 2017 only if the pool was created using a Cloud Service configuration. Batch pools created prior to 10 March 2016 do not support application packages. For more information about using application packages to deploy your applications to your Batch nodes, see [Deploy applications to compute nodes with Batch application packages](batch-application-packages.md).
>
>

### Network configuration

You can specify the subnet of an Azure [virtual network (VNet)](../virtual-network/virtual-networks-overview.md) in which the pool's compute nodes should be created. See the [Pool network configuration](#pool-network-configuration) section for more information.


## Job
A job is a collection of tasks. It manages how computation is performed by its tasks on the compute nodes in a pool.

* The job specifies the **pool** in which the work is to be run. You can create a new pool for each job, or use one pool for many jobs. You can create a pool for each job that is associated with a job schedule, or for all jobs that are associated with a job schedule.
* You can specify an optional **job priority**. When a job is submitted with a higher priority than jobs that are currently in progress, the tasks for the higher-priority job are inserted into the queue ahead of tasks for the lower-priority jobs. Tasks in lower-priority jobs that are already running are not preempted.
* You can use job **constraints** to specify certain limits for your jobs:

    You can set a **maximum wallclock time**, so that if a job runs for longer than the maximum wallclock time that is specified, the job and all of its tasks are terminated.

    Batch can detect and then retry failed tasks. You can specify the **maximum number of task retries** as a constraint, including whether a task is *always* or *never* retried. Retrying a task means that the task is requeued to be run again.
* Your client application can add tasks to a job, or you can specify a [job manager task](#job-manager-task). A job manager task contains the information that is necessary to create the required tasks for a job, with the job manager task being run on one of the compute nodes in the pool. The job manager task is handled specifically by Batch--it is queued as soon as the job is created, and is restarted if it fails. A job manager task is *required* for jobs that are created by a [job schedule](#scheduled-jobs) because it is the only way to define the tasks before the job is instantiated.
* By default, jobs remain in the active state when all tasks within the job are complete. You can change this behavior so that the job is automatically terminated when all tasks in the job are complete. Set the job's **onAllTasksComplete** property ([OnAllTasksComplete][net_onalltaskscomplete] in Batch .NET) to *terminatejob* to automatically terminate the job when all of its tasks are in the completed state.

    Note that the Batch service considers a job with *no* tasks to have all of its tasks completed. Therefore, this option is most commonly used with a [job manager task](#job-manager-task). If you want to use automatic job termination without a job manager, you should initially set a new job's **onAllTasksComplete** property to *noaction*, then set it to *terminatejob* only after you've finished adding tasks to the job.

### Job priority
You can assign a priority to jobs that you create in Batch. The Batch service uses the priority value of the job to determine the order of job scheduling within an account (this is not to be confused with a [scheduled job](#scheduled-jobs)). The priority values range from -1000 to 1000, with -1000 being the lowest priority and 1000 being the highest. To update the priority of a job, call the [Update the properties of a job][rest_update_job] operation (Batch REST), or modify the [CloudJob.Priority][net_cloudjob_priority] property (Batch .NET).

Within the same account, higher-priority jobs have scheduling precedence over lower-priority jobs. A job with a higher-priority value in one account does not have scheduling precedence over another job with a lower-priority value in a different account.

Job scheduling across pools is independent. Between different pools, it is not guaranteed that a higher-priority job is scheduled first if its associated pool is short of idle nodes. In the same pool, jobs with the same priority level have an equal chance of being scheduled.

### Scheduled jobs
[Job schedules][rest_job_schedules] enable you to create recurring jobs within the Batch service. A job schedule specifies when to run jobs and includes the specifications for the jobs to be run. You can specify the duration of the schedule--how long and when the schedule is in effect--and how frequently jobs are created during the scheduled period.

## Task
A task is a unit of computation that is associated with a job. It runs on a node. Tasks are assigned to a node for execution, or are queued until a node becomes free. Put simply, a task runs one or more programs or scripts on a compute node to perform the work you need done.

When you create a task, you can specify:

* The **command line** for the task. This is the command line that runs your application or script on the compute node.

    It is important to note that the command line does not actually run under a shell. Therefore, it cannot natively take advantage of shell features like [environment variable](#environment-settings-for-tasks) expansion (this includes the `PATH`). To take advantage of such features, you must invoke the shell in the command line--for example, by launching `cmd.exe` on Windows nodes or `/bin/sh` on Linux:

    `cmd /c MyTaskApplication.exe %MY_ENV_VAR%`

    `/bin/sh -c MyTaskApplication $MY_ENV_VAR`

    If your tasks need to run an application or script that is not in the node's `PATH` or reference environment variables, invoke the shell explicitly in the task command line.
* **Resource files** that contain the data to be processed. These files are automatically copied to the node from Blob storage in an Azure Storage account before the task's command line is executed. For more information, see the sections [Start task](#start-task) and [Files and directories](#files-and-directories).
* The **environment variables** that are required by your application. For more information, see the [Environment settings for tasks](#environment-settings-for-tasks) section.
* The **constraints** under which the task should execute. For example, constraints include the maximum time that the task is allowed to run, the maximum number of times a failed task should be retried, and the maximum time that files in the task's working directory are retained.
* **Application packages** to deploy to the compute node on which the task is scheduled to run. [Application packages](#application-packages) provide simplified deployment and versioning of the applications that your tasks run. Task-level application packages are especially useful in shared-pool environments, where different jobs are run on one pool, and the pool is not deleted when a job is completed. If your job has fewer tasks than nodes in the pool, task application packages can minimize data transfer since your application is deployed only to the nodes that run tasks.
* A **container image** reference in Docker Hub or a private registry and additional settings to create a Docker container in which the task runs on the node. You only specify this information if the pool is set up with a container configuration.

> [!NOTE]
> The maximum lifetime of a task, from when it is added to the job to when it completes, is 7 days. Completed tasks persist indefinitely; data for tasks not completed within the maximum lifetime is not accessible.

In addition to tasks you define to perform computation on a node, the following special tasks are also provided by the Batch service:

* [Start task](#start-task)
* [Job manager task](#job-manager-task)
* [Job preparation and release tasks](#job-preparation-and-release-tasks)
* [Multi-instance tasks (MPI)](#multi-instance-tasks)
* [Task dependencies](#task-dependencies)

### Start task
By associating a **start task** with a pool, you can prepare the operating environment of its nodes. For example, you can perform actions such as installing the applications that your tasks run, or starting background processes. The start task runs every time a node starts, for as long as it remains in the pool--including when the node is first added to the pool and when it is restarted or reimaged.

A primary benefit of the start task is that it can contain all the information necessary to configure a compute node and install the applications required for task execution. Therefore, increasing the number of nodes in a pool is as simple as specifying the new target node count. The start task provides the Batch service the information needed to configure the new nodes and get them ready for accepting tasks.

As with any Azure Batch task, you can specify a list of **resource files** in [Azure Storage][azure_storage], in addition to a **command line** to be executed. The Batch service first copies the resource files to the node from Azure Storage, and then runs the command line. For a pool start task, the file list typically contains the task application and its dependencies.

However, the start task could also include reference data to be used by all tasks that are running on the compute node. For example, a start task's command line could perform a `robocopy` operation to copy application files (which were specified as resource files and downloaded to the node) from the start task's [working directory](#files-and-directories) to the [shared folder](#files-and-directories), and then run an MSI or `setup.exe`.

It is typically desirable for the Batch service to wait for the start task to complete before considering the node ready to be assigned tasks, but you can configure this.

If a start task fails on a compute node, then the state of the node is updated to reflect the failure, and the node is not assigned any tasks. A start task can fail if there is an issue copying its resource files from storage, or if the process executed by its command line returns a nonzero exit code.

If you add or update the start task for an existing pool, you must reboot its compute nodes for the start task to be applied to the nodes.

>[!NOTE]
> Batch limits the total size of a start task, which includes resource files and environment variables. If you need to reduce the size of a start task, you can use one of two approaches:
>
> 1. You can use application packages to distribute applications or data across each node in your Batch pool. For more information about application packages, see [Deploy applications to compute nodes with Batch application packages](batch-application-packages.md).
> 2. You can manually create a zipped archive containing your applications files. Upload your zipped archive to Azure Storage as a blob. Specify the zipped archive as a resource file for your start task. Before you run the command line for your start task, unzip the archive from the command line. 
>
>    To unzip the archive, you can use the archiving tool of your choice. You will need to include the tool that you use to unzip the archive as a resource file for the start task.
>
>

### Job manager task
You typically use a **job manager task** to control and/or monitor job execution--for example, to create and submit the tasks for a job, determine additional tasks to run, and determine when work is complete. However, a job manager task is not restricted to these activities. It is a fully fledged task that can perform any actions that are required for the job. For example, a job manager task might download a file that is specified as a parameter, analyze the contents of that file, and submit additional tasks based on those contents.

A job manager task is started before all other tasks. It provides the following features:

* It is automatically submitted as a task by the Batch service when the job is created.
* It is scheduled to execute before the other tasks in a job.
* Its associated node is the last to be removed from a pool when the pool is being downsized.
* Its termination can be tied to the termination of all tasks in the job.
* A job manager task is given the highest priority when it needs to be restarted. If an idle node is not available, the Batch service might terminate one of the other running tasks in the pool to make room for the job manager task to run.
* A job manager task in one job does not have priority over the tasks of other jobs. Across jobs, only job-level priorities are observed.

### Job preparation and release tasks
Batch provides job preparation tasks for pre-job execution setup. Job release tasks are for post-job maintenance or cleanup.

* **Job preparation task**: A job preparation task runs on all compute nodes that are scheduled to run tasks, before any of the other job tasks are executed. You can use a job preparation task to copy data that is shared by all tasks, but is unique to the job, for example.
* **Job release task**: When a job has completed, a job release task runs on each node in the pool that executed at least one task. You can use a job release task to delete data that is copied by the job preparation task, or to compress and upload diagnostic log data, for example.

Both job preparation and release tasks allow you to specify a command line to run when the task is invoked. They offer features like file download, elevated execution, custom environment variables, maximum execution duration, retry count, and file retention time.

For more information on job preparation and release tasks, see [Run job preparation and completion tasks on Azure Batch compute nodes](batch-job-prep-release.md).

### Multi-instance task
A [multi-instance task](batch-mpi.md) is a task that is configured to run on more than one compute node simultaneously. With multi-instance tasks, you can enable high-performance computing scenarios that require a group of compute nodes that are allocated together to process a single workload (like Message Passing Interface (MPI)).

For a detailed discussion on running MPI jobs in Batch by using the Batch .NET library, check out [Use multi-instance tasks to run Message Passing Interface (MPI) applications in Azure Batch](batch-mpi.md).

### Task dependencies
[Task dependencies](batch-task-dependencies.md), as the name implies, allow you to specify that a task depends on the completion of other tasks before its execution. This feature provides support for situations in which a "downstream" task consumes the output of an "upstream" task--or when an upstream task performs some initialization that is required by a downstream task. To use this feature, you must first enable task dependencies on your Batch job. Then, for each task that depends on another (or many others), you specify the tasks which that task depends on.

With task dependencies, you can configure scenarios like the following:

* *taskB* depends on *taskA* (*taskB* will not begin execution until *taskA* has completed).
* *taskC* depends on both *taskA* and *taskB*.
* *taskD* depends on a range of tasks, such as tasks *1* through *10*, before it executes.

Check out [Task dependencies in Azure Batch](batch-task-dependencies.md) and the [TaskDependencies][github_sample_taskdeps] code sample in the [azure-batch-samples][github_samples] GitHub repository for more in-depth details on this feature.

## Environment settings for tasks
Each task executed by the Batch service has access to environment variables that it sets on compute nodes. This includes environment variables defined by the Batch service ([service-defined][msdn_env_vars]) and custom environment variables that you can define for your tasks. The applications and scripts your tasks execute have access to these environment variables during execution.

You can set custom environment variables at the task or job level by populating the *environment settings* property for these entities. For example, see the [Add a task to a job][rest_add_task] operation (Batch REST API), or the [CloudTask.EnvironmentSettings][net_cloudtask_env] and [CloudJob.CommonEnvironmentSettings][net_job_env] properties in Batch .NET.

Your client application or service can obtain a task's environment variables, both service-defined and custom, by using the [Get information about a task][rest_get_task_info] operation (Batch REST) or by accessing the [CloudTask.EnvironmentSettings][net_cloudtask_env] property (Batch .NET). Processes executing on a compute node can access these and other environment variables on the node, for example, by using the familiar `%VARIABLE_NAME%` (Windows) or `$VARIABLE_NAME` (Linux) syntax.

You can find a full list of all service-defined environment variables in [Compute node environment variables][msdn_env_vars].

## Files and directories
Each task has a *working directory* under which it creates zero or more files and directories. This working directory can be used for storing the program that is run by the task, the data that it processes, and the output of the processing it performs. All files and directories of a task are owned by the task user.

The Batch service exposes a portion of the file system on a node as the *root directory*. Tasks can access the root directory by referencing the `AZ_BATCH_NODE_ROOT_DIR` environment variable. For more information about using environment variables, see [Environment settings for tasks](#environment-settings-for-tasks).

The root directory contains the following directory structure:

![Compute node directory structure][1]

* **shared**: This directory provides read/write access to *all* tasks that run on a node. Any task that runs on the node can create, read, update, and delete files in this directory. Tasks can access this directory by referencing the `AZ_BATCH_NODE_SHARED_DIR` environment variable.
* **startup**: This directory is used by a start task as its working directory. All of the files that are downloaded to the node by the start task are stored here. The start task can create, read, update, and delete files under this directory. Tasks can access this directory by referencing the `AZ_BATCH_NODE_STARTUP_DIR` environment variable.
* **Tasks**: A directory is created for each task that runs on the node. It is accessed by referencing the `AZ_BATCH_TASK_DIR` environment variable.

    Within each task directory, the Batch service creates a working directory (`wd`) whose unique path is specified by the `AZ_BATCH_TASK_WORKING_DIR` environment variable. This directory provides read/write access to the task. The task can create, read, update, and delete files under this directory. This directory is retained based on the *RetentionTime* constraint that is specified for the task.

    `stdout.txt` and `stderr.txt`: These files are written to the task folder during the execution of the task.

> [!IMPORTANT]
> When a node is removed from the pool, *all* of the files that are stored on the node are removed.
>
>

## Application packages
The [application packages](batch-application-packages.md) feature provides easy management and deployment of applications to the compute nodes in your pools. You can upload and manage multiple versions of the applications run by your tasks, including their binaries and support files. Then you can automatically deploy one or more of these applications to the compute nodes in your pool.

You can specify application packages at the pool and task level. When you specify pool application packages, the application is deployed to every node in the pool. When you specify task application packages, the application is deployed only to nodes that are scheduled to run at least one of the job's tasks, just before the task's command line is run.

Batch handles the details of working with Azure Storage to store your application packages and deploy them to compute nodes, so both your code and management overhead can be simplified.

To find out more about the application package feature, check out [Deploy applications to compute nodes with Batch application packages](batch-application-packages.md).

> [!NOTE]
> If you add pool application packages to an *existing* pool, you must reboot its compute nodes for the application packages to be deployed to the nodes.
>
>

## Pool and compute node lifetime
When you design your Azure Batch solution, you have to make a design decision about how and when pools are created, and how long compute nodes within those pools are kept available.

On one end of the spectrum, you can create a pool for each job that you submit, and delete the pool as soon as its tasks finish execution. This maximizes utilization because the nodes are only allocated when needed, and shut down as soon as they're idle. While this means that the job must wait for the nodes to be allocated, it's important to note that tasks are scheduled for execution as soon as nodes are individually available, allocated, and the start task has completed. Batch does *not* wait until all nodes within a pool are available before assigning tasks to the nodes. This ensures maximum utilization of all available nodes.

At the other end of the spectrum, if having jobs start immediately is the highest priority, you can create a pool ahead of time and make its nodes available before jobs are submitted. In this scenario, tasks can start immediately, but nodes might sit idle while waiting for them to be assigned.

A combined approach is typically used for handling a variable, but ongoing, load. You can have a pool that multiple jobs are submitted to, but can scale the number of nodes up or down according to the job load (see [Scaling compute resources](#scaling-compute-resources) in the following section). You can do this reactively, based on current load, or proactively, if load can be predicted.

## Virtual network (VNet) and firewall configuration 

When you provision a pool of compute nodes in Batch, you can associate the pool with a subnet of an Azure [virtual network (VNet)](../virtual-network/virtual-networks-overview.md). To use an Azure VNet, the Batch client API must use Azure Active Directory (AD) authentication. Azure Batch support for Azure AD is documented in [Authenticate Batch service solutions with Active Directory](batch-aad-auth.md).  

### VNet requirements
[!INCLUDE [batch-virtual-network-ports](../../includes/batch-virtual-network-ports.md)]

For more information about setting up a Batch pool in a VNet, see [Create a pool of virtual machines with your virtual network](batch-virtual-network.md).

## Scaling compute resources
With [automatic scaling](batch-automatic-scaling.md), you can have the Batch service dynamically adjust the number of compute nodes in a pool according to the current workload and resource usage of your compute scenario. This allows you to lower the overall cost of running your application by using only the resources you need, and releasing those you don't need.

You enable automatic scaling by writing an [automatic scaling formula](batch-automatic-scaling.md#automatic-scaling-formulas) and associating that formula with a pool. The Batch service uses the formula to determine the target number of nodes in the pool for the next scaling interval (an interval that you can configure). You can specify the automatic scaling settings for a pool when you create it, or enable scaling on a pool later. You can also update the scaling settings on a scaling-enabled pool.

As an example, perhaps a job requires that you submit a very large number of tasks to be executed. You can assign a scaling formula to the pool that adjusts the number of nodes in the pool based on the current number of queued tasks and the completion rate of the tasks in the job. The Batch service periodically evaluates the formula and resizes the pool, based on workload and your other formula settings. The service adds nodes as needed when there are a large number of queued tasks, and removes nodes when there are no queued or running tasks.

A scaling formula can be based on the following metrics:

* **Time metrics** are based on statistics collected every five minutes in the specified number of hours.
* **Resource metrics** are based on CPU usage, bandwidth usage, memory usage, and number of nodes.
* **Task metrics** are based on task state, such as *Active* (queued), *Running*, or *Completed*.

When automatic scaling decreases the number of compute nodes in a pool, you must consider how to handle tasks that are running at the time of the decrease operation. To accommodate this, Batch provides a *node deallocation option* that you can include in your formulas. For example, you can specify that running tasks are stopped immediately and then requeued for execution on another node, or allowed to finish before the node is removed from the pool.

For more information about automatically scaling an application, see [Automatically scale compute nodes in an Azure Batch pool](batch-automatic-scaling.md).

> [!TIP]
> To maximize compute resource utilization, set the target number of nodes to zero at the end of a job, but allow running tasks to finish.
>
>

## Security with certificates
You typically need to use certificates when you encrypt or decrypt sensitive information for tasks, like the key for an [Azure Storage account][azure_storage]. To support this, you can install certificates on nodes. Encrypted secrets are passed to tasks via command-line parameters or embedded in one of the task resources, and the installed certificates can be used to decrypt them.

You use the [Add certificate][rest_add_cert] operation (Batch REST) or [CertificateOperations.CreateCertificate][net_create_cert] method (Batch .NET) to add a certificate to a Batch account. You can then associate the certificate with a new or existing pool. When a certificate is associated with a pool, the Batch service installs the certificate on each node in the pool. The Batch service installs the appropriate certificates when the node starts up, before launching any tasks (including the start task and job manager task).

If you add certificates to an *existing* pool, you must reboot its compute nodes for the certificates to be applied to the nodes.

## Error handling
You might find it necessary to handle both task and application failures within your Batch solution.

### Task failure handling
Task failures fall into these categories:

* **Pre-processing failures**

    If a task fails to start, a pre-processing error is set for the task.  

    Pre-processing errors can occur if the task's resource files have moved, the Storage account is no longer available, or another issue was encountered that prevented the successful copying of files to the node.

* **File upload failures**

    If uploading files that are specified for a task fails for any reason, a file upload error is set for the task.

    File upload errors can occur if the SAS supplied for accessing Azure Storage is invalid or does not provide write permissions, if the storage account is no longer available, or if another issue was encountered that prevented the successful copying of files from the node.    

* **Application failures**

    The process that is specified by the task's command line can also fail. The process is deemed to have failed when a nonzero exit code is returned by the process that is executed by the task (see *Task exit codes* in the next section).

    For application failures, you can configure Batch to automatically retry the task up to a specified number of times.

* **Constraint failures**

    You can set a constraint that specifies the maximum execution duration for a job or task, the *maxWallClockTime*. This can be useful for terminating tasks that fail to progress.

    When the maximum amount of time has been exceeded, the task is marked as *completed*, but the exit code is set to `0xC000013A` and the *schedulingError* field is marked as `{ category:"ServerError", code="TaskEnded"}`.

### Debugging application failures
* `stderr` and `stdout`

    During execution, an application might produce diagnostic output that you can use to troubleshoot issues. As mentioned in the earlier section [Files and directories](#files-and-directories), the Batch service writes standard output and standard error output to `stdout.txt` and `stderr.txt` files in the task directory on the compute node. You can use the Azure portal or one of the Batch SDKs to download these files. For example, you can retrieve these and other files for troubleshooting purposes by using [ComputeNode.GetNodeFile][net_getfile_node] and [CloudTask.GetNodeFile][net_getfile_task] in the Batch .NET library.

* **Task exit codes**

    As mentioned earlier, a task is marked as failed by the Batch service if the process that is executed by the task returns a nonzero exit code. When a task executes a process, Batch populates the task's exit code property with the *return code of the process*. It is important to note that a task's exit code is **not** determined by the Batch service. A task's exit code is determined by the process itself or the operating system on which the process executed.

### Accounting for task failures or interruptions
Tasks might occasionally fail or be interrupted. The task application itself might fail, the node on which the task is running might be rebooted, or the node might be removed from the pool during a resize operation if the pool's deallocation policy is set to remove nodes immediately without waiting for tasks to finish. In all cases, the task can be automatically requeued by Batch for execution on another node.

It is also possible for an intermittent issue to cause a task to hang or take too long to execute. You can set the maximum execution interval for a task. If the maximum execution interval is exceeded, the Batch service interrupts the task application.

### Connecting to compute nodes
You can perform additional debugging and troubleshooting by signing in to a compute node remotely. You can use the Azure portal to download a Remote Desktop Protocol (RDP) file for Windows nodes and obtain Secure Shell (SSH) connection information for Linux nodes. You can also do this by using the Batch APIs--for example, with [Batch .NET][net_rdpfile] or [Batch Python](batch-linux-nodes.md#connect-to-linux-nodes-using-ssh).

> [!IMPORTANT]
> To connect to a node via RDP or SSH, you must first create a user on the node. To do this, you can use the Azure portal, [add a user account to a node][rest_create_user] by using the Batch REST API, call the [ComputeNode.CreateComputeNodeUser][net_create_user] method in Batch .NET, or call the [add_user][py_add_user] method in the Batch Python module.
>
>

If you need to restrict or disable RDP or SSH access to compute nodes, see [Configure or disable remote access to compute nodes in an Azure Batch pool](pool-endpoint-configuration.md).

### Troubleshooting problematic compute nodes
In situations where some of your tasks are failing, your Batch client application or service can examine the metadata of the failed tasks to identify a misbehaving node. Each node in a pool is given a unique ID, and the node on which a task runs is included in the task metadata. After you've identified a problem node, you can take several actions with it:

* **Reboot the node** ([REST][rest_reboot] | [.NET][net_reboot])

    Restarting the node can sometimes clear up latent issues like stuck or crashed processes. Note that if your pool uses a start task or your job uses a job preparation task, they are executed when the node restarts.
* **Reimage the node** ([REST][rest_reimage] | [.NET][net_reimage])

    This reinstalls the operating system on the node. As with rebooting a node, start tasks and job preparation tasks are rerun after the node has been reimaged.
* **Remove the node from the pool** ([REST][rest_remove] | [.NET][net_remove])

    Sometimes it is necessary to completely remove the node from the pool.
* **Disable task scheduling on the node** ([REST][rest_offline] | [.NET][net_offline])

    This effectively takes the node offline so that no further tasks are assigned to it, but allows the node to remain running and in the pool. This enables you to perform further investigation into the cause of the failures without losing the failed task's data, and without the node causing additional task failures. For example, you can disable task scheduling on the node, then [sign in remotely](#connecting-to-compute-nodes) to examine the node's event logs or perform other troubleshooting. After you've finished your investigation, you can then bring the node back online by enabling task scheduling ([REST][rest_online] | [.NET][net_online]), or perform one of the other actions discussed earlier.

> [!IMPORTANT]
> With each action that is described in this section--reboot, reimage, remove, and disable task scheduling--you are able to specify how tasks currently running on the node are handled when you perform the action. For example, when you disable task scheduling on a node by using the Batch .NET client library, you can specify a [DisableComputeNodeSchedulingOption][net_offline_option] enum value to specify whether to **Terminate** running tasks, **Requeue** them for scheduling on other nodes, or allow running tasks to complete before performing the action (**TaskCompletion**).
>
>

## Next steps
* Learn about the [Batch APIs and tools](batch-apis-tools.md) available for building Batch solutions.
* Learn the basics of developing a Batch-enabled application using the [Batch .NET client library](quick-run-dotnet.md) or [Python](quick-run-python.md). These quickstarts guide you through a sample application that uses the Batch service to execute a workload on multiple compute nodes, and includes using Azure Storage for workload file staging and retrieval.
* Download and install [Batch Explorer][batch_labs] for use while you develop your Batch solutions. Use Batch Explorer to help create, debug, and monitor Azure Batch applications. 
* See community resources including [Stack Overflow](http://stackoverflow.com/questions/tagged/azure-batch), the [Batch Community repo](https://github.com/Azure/Batch), and the [Azure Batch forum][batch_forum] on MSDN. 

[1]: ./media/batch-api-basics/node-folder-structure.png

[azure_storage]: https://azure.microsoft.com/services/storage/
[batch_forum]: https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurebatch
[cloud_service_sizes]: ../cloud-services/cloud-services-sizes-specs.md
[msmpi]: https://msdn.microsoft.com/library/bb524831.aspx
[github_samples]: https://github.com/Azure/azure-batch-samples
[github_sample_taskdeps]:  https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/TaskDependencies
[batch_labs]: https://azure.github.io/BatchExplorer/
[batch_net_api]: https://msdn.microsoft.com/library/azure/mt348682.aspx
[msdn_env_vars]: https://msdn.microsoft.com/library/azure/mt743623.aspx
[net_cloudjob_jobmanagertask]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudjob.jobmanagertask.aspx
[net_cloudjob_priority]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudjob.priority.aspx
[net_cloudpool_starttask]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.starttask.aspx
[net_cloudtask_env]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.environmentsettings.aspx
[net_create_cert]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.certificateoperations.createcertificate.aspx
[net_create_user]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.computenode.createcomputenodeuser.aspx
[net_getfile_node]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.computenode.getnodefile.aspx
[net_getfile_task]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.getnodefile.aspx
[net_job_env]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudjob.commonenvironmentsettings.aspx
[net_multiinstancesettings]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.multiinstancesettings.aspx
[net_onalltaskscomplete]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudjob.onalltaskscomplete.aspx
[net_rdp]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.computenode.getrdpfile.aspx
[net_reboot]: https://msdn.microsoft.com/library/azure/mt631495.aspx
[net_reimage]: https://msdn.microsoft.com/library/azure/mt631496.aspx
[net_remove]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.removefrompoolasync.aspx
[net_offline]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.computenode.disableschedulingasync.aspx
[net_online]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.computenode.enableschedulingasync.aspx
[net_offline_option]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.common.disablecomputenodeschedulingoption.aspx
[net_rdpfile]: https://msdn.microsoft.com/library/azure/Mt272127.aspx
[vnet]: https://msdn.microsoft.com/library/azure/dn820174.aspx#bk_netconf

[py_add_user]: https://docs.microsoft.com/python/azure/?view=azure-python

[batch_rest_api]: https://msdn.microsoft.com/library/azure/Dn820158.aspx
[rest_add_job]: https://msdn.microsoft.com/library/azure/mt282178.aspx
[rest_add_pool]: https://msdn.microsoft.com/library/azure/dn820174.aspx
[rest_add_cert]: https://msdn.microsoft.com/library/azure/dn820169.aspx
[rest_add_task]: https://msdn.microsoft.com/library/azure/dn820105.aspx
[rest_create_user]: https://msdn.microsoft.com/library/azure/dn820137.aspx
[rest_get_task_info]: https://msdn.microsoft.com/library/azure/dn820133.aspx
[rest_job_schedules]: https://msdn.microsoft.com/library/azure/mt282179.aspx
[rest_multiinstance]: https://msdn.microsoft.com/library/azure/mt637905.aspx
[rest_multiinstancesettings]: https://msdn.microsoft.com/library/azure/dn820105.aspx#multiInstanceSettings
[rest_update_job]: https://msdn.microsoft.com/library/azure/dn820162.aspx
[rest_rdp]: https://msdn.microsoft.com/library/azure/dn820120.aspx
[rest_reboot]: https://msdn.microsoft.com/library/azure/dn820171.aspx
[rest_reimage]: https://msdn.microsoft.com/library/azure/dn820157.aspx
[rest_remove]: https://msdn.microsoft.com/library/azure/dn820194.aspx
[rest_offline]: https://msdn.microsoft.com/library/azure/mt637904.aspx
[rest_online]: https://msdn.microsoft.com/library/azure/mt637907.aspx

[vm_marketplace]: https://azure.microsoft.com/marketplace/virtual-machines/
