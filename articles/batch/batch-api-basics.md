<properties
	pageTitle="Azure Batch feature overview for developers | Microsoft Azure"
	description="Learn the features of the Batch service and its APIs from a development standpoint."
	services="batch"
	documentationCenter=".net"
	authors="mmacy"
	manager="timlt"
	editor=""/>

<tags
	ms.service="batch"
	ms.devlang="multiple"
	ms.topic="get-started-article"
	ms.tgt_pltfrm="na"
	ms.workload="big-compute"
	ms.date="08/12/2016"
	ms.author="marsma"/>

# Batch feature overview for developers

In this overview of the core components of the Azure Batch service, we discuss the primary service features that Batch developers can use to build large-scale parallel compute solutions.

Whether you're developing a distributed computational application or service that issues direct [Batch REST][batch_rest_api] API calls or you're using one of the [Batch SDKs](batch-technical-overview.md#batch-development-apis), you will use many of the resources and features discussed in this article.

> [AZURE.TIP] For a higher-level introduction to the Batch service, see [Basics of Azure Batch](batch-technical-overview.md).

## Batch service workflow

The following high-level workflow is typical of nearly all applications and services that use the Batch service for processing parallel workloads:

1. Upload the **data files** that you want to process to an [Azure Storage][azure_storage] account. Batch includes built-in support for accessing Azure Blob storage, and your tasks can download these files to [compute nodes](#compute-node) when the tasks are run.

2. Upload the **application files** that your tasks will run. These files can be binaries or scripts and their dependencies, and are executed by the tasks in your jobs. Your tasks can download these files from your Storage account, or you can use the [application packages](#application-packages) feature of Batch for application management and deployment.

3. Create a [pool](#pool) of compute nodes. When you create a pool, you specify the number of compute nodes for the pool, their size, and the operating system. When each task in your job runs, it's assigned to execute on one of the nodes in your pool.

4. Create a [job](#job). A job manages a collection of tasks. You associate each job to a specific pool where that job's tasks will run.

5. Add [tasks](#task) to the job. Each task runs the application or script that you uploaded to process the data files it downloads from your Storage account. As each task completes, it can upload its output to Azure Storage.

6. Monitor job progress and retrieve the task output from Azure Storage.

In the following sections, you'll learn about each of the resources that are mentioned in this workflow, as well as many other features of Batch that will enable your distributed computational scenario.

> [AZURE.NOTE] You'll need a [Batch account](batch-account-create-portal.md) to use the Batch service. Also, nearly all solutions will use an [Azure Storage][azure_storage] account for file storage and retrieval. Batch currently supports only the **General purpose** storage account type, as described in step 5 of [Create a storage account](../storage/storage-create-storage-account.md#create-a-storage-account) in [About Azure storage accounts](../storage/storage-create-storage-account.md).

## Batch service components

Some of the following resources--accounts, compute nodes, pools, jobs, and tasks--are required by all solutions that use the Batch service. Others, such as job schedules and application packages, are helpful, but optional, features.

- [Account](#account)
- [Compute node](#compute-node)
- [Pool](#pool)
- [Job](#job)

  - [Job schedules](#scheduled-jobs)

- [Task](#task)

  - [Start task](#start-task)
  - [Job manager task](#job-manager-task)
  - [Job preparation and release tasks](#job-preparation-and-release-tasks)
  - [Multi-instance task (MPI)](#multi-instance-tasks)
  - [Task dependencies](#task-dependencies)

- [Application packages](#application-packages)

## Account

A Batch account is a uniquely identified entity within the Batch service. All processing is associated with a Batch account. When you perform operations with the Batch service, you need both the account name and one of its account keys. You can [create and manage an Azure Batch account in the Azure portal](batch-account-create-portal.md).

## Compute node

A compute node is an Azure virtual machine (VM) that is dedicated to processing a portion of your application's workload. The size of a node determines the number of CPU cores, memory capacity, and local file system size that is allocated to the node. You can create pools of Windows or Linux nodes by using either Azure Cloud Services or Virtual Machines Marketplace images. See the following [Pool](#pool) section for more information on these options.

Nodes can run any executable or script that is supported by the operating system environment of the node. This includes \*.exe, \*.cmd, \*.bat and PowerShell scripts for Windows--and binaries, shell, and Python scripts for Linux.

All compute nodes in Batch also include:

- A standard [folder structure](#files-and-directories) and associated [environment variables](#environment-settings-for-tasks) that are available for reference by tasks.
- **Firewall** settings that are configured to control access.
- [Remote access](#connecting-to-compute-nodes) to both Windows (Remote Desktop Protocol (RDP)) and Linux (Secure Shell (SSH)) nodes.

> [AZURE.NOTE] Linux support in Batch is currently in preview. For more details, see [Provision Linux compute nodes in Azure Batch pools](batch-linux-nodes.md).

## Pool

A pool is a collection of nodes that your application runs on. The pool can be created manually by you, or automatically by the Batch service when you specify the work to be done. You can create and manage a pool that meets the resource requirements of your application. A pool can be used only by the Batch account in which it was created. A Batch account can have more than one pool.

Azure Batch pools build on top of the core Azure compute platform: Batch pools provide large-scale allocation, application installation, data distribution, and health monitoring, as well as the flexible adjustment of the number of compute nodes within a pool ([scaling](#scaling-compute-resources)).

Every node that is added to a pool is assigned a unique name and IP address. When a node is removed from a pool, any changes that are made to the operating system or files are lost, and its name and IP address are released for future use. When a node leaves a pool, its lifetime is over.

When you create a pool, you can specify the following attributes:

- Compute node **operating system** and **version**

	You have two options when you select an operating system for the nodes in your pool: **Virtual Machine Configuration** and **Cloud Services Configuration**.

	**Virtual Machine Configuration** provides both Linux and Windows images for compute nodes from the [Azure Virtual Machines Marketplace][vm_marketplace].
	When you create a pool that contains Virtual Machine Configuration nodes, you must specify not only the size of the nodes, but also the **virtual machine image reference** and the Batch **node agent SKU** to be installed on the nodes. For more information about specifying these pool properties, see [Provision Linux compute nodes in Azure Batch pools](batch-linux-nodes.md).

	**Cloud Services Configuration** provides Windows compute nodes *only*. Available operating systems for Cloud Services Configuration pools are listed in the [Azure Guest OS releases and SDK compatibility matrix](../cloud-services/cloud-services-guestos-update-matrix.md). When you create a pool that contains Cloud Services nodes, you need to specify only the node size and its *OS Family*. When you create pools of Windows compute nodes, you most commonly use Cloud Services.

    - The *OS Family* also determines which versions of .NET are installed with the OS.
	- As with worker roles within Cloud Services, you can specify an *OS Version* (for more information on worker roles, see the [Tell me about cloud services](../cloud-services/cloud-services-choose-me.md#tell-me-about-cloud-services) section in the [Cloud Services overview](../cloud-services/cloud-services-choose-me.md)).
    - As with worker roles, we recommend that you specify `*` for the *OS Version* so that the nodes are automatically upgraded, and there is no work required to cater to newly released versions. The primary use case for selecting a specific OS version is to ensure application compatibility, which allows backward compatibility testing to be performed before allowing the version to be updated. After validation, the *OS Version* for the pool can be updated and the new OS image can be installed--any running tasks will be interrupted and requeued.

- **Size of the nodes**

	**Cloud Services Configuration** compute node sizes are listed in [Sizes for Cloud Services](../cloud-services/cloud-services-sizes-specs.md). Batch supports all Cloud Services sizes except `ExtraSmall`.

	**Virtual Machine Configuration** compute node sizes are listed in [Sizes for virtual machines in Azure](../virtual-machines/virtual-machines-linux-sizes.md) (Linux) and [Sizes for virtual machines in Azure](../virtual-machines/virtual-machines-windows-sizes.md) (Windows). Batch supports all Azure VM sizes except `STANDARD_A0` and those with premium storage (`STANDARD_GS`, `STANDARD_DS`, and `STANDARD_DSV2` series).

	You should take into account the characteristics and requirements of the application or applications that will run on the compute nodes when you select a node size. You will typically select a node size by assuming one task will run on the node at a time. Consider aspects such as whether the application is multithreaded and how much memory it consumes to help determine the most suitable and cost-effective node size. It is possible to have multiple tasks and therefore multiple application instances [run in parallel](batch-parallel-node-tasks.md)--for this case, you'll typically choose a larger node. See the following "Task scheduling policy" section for more information.

	All of the nodes in a pool are the same size. If you'll be running applications with differing system requirements and/or load levels, you should use separate pools.

- **Target number of nodes**

	This is the number of compute nodes that you want to deploy in the pool. This is referred to as a *target* because, in some situations, your pool might not reach the desired number of nodes. A pool might not reach the desired number of nodes if it reaches the [core quota](batch-quota-limit.md#batch-account-quotas) for your Batch account--or if there is an auto-scaling formula that you have applied to the pool that limits the maximum number of nodes (see the following "Scaling policy" section).

- **Scaling policy**

	In addition to specifying a static number of nodes, you can instead write and apply an [auto-scaling formula](#scaling-compute-resources) to a pool. The Batch service periodically evaluates your formula and adjusts the number of nodes within the pool based on various pool, job, and task parameters that you can specify.

- **Task scheduling policy**

	The [max tasks per node](batch-parallel-node-tasks.md) configuration option determines the maximum number of tasks that can be run in parallel on each compute node within the pool.

	The default configuration is that one task at a time runs on a node, but there are scenarios where it is beneficial to have more than one task executed on a node simultaneously. See the [example scenario](batch-parallel-node-tasks.md#example-scenario) in the [concurrent node tasks](batch-parallel-node-tasks.md) article to see how you can benefit from multiple tasks per node.

	You can also specify a *fill type* which determines whether Batch spreads the tasks evenly across all nodes in a pool, or packs each node with the maximum number of tasks before assigning tasks to another node.

- **Communication status** of compute nodes

	In most scenarios, tasks operate independently and do not need to communicate with one another. But there might be some applications in which tasks must communicate (such as in [MPI scenarios](batch-mpi.md)).

	You can configure a pool to allow communication between the nodes within it--**internode communication**. When internode communication is enabled, nodes in Cloud Services Configuration pools can communicate with each other on ports greater than 1100, and Virtual Machine Configuration pools do not restrict traffic on any port.

	Note that enabling internode communication also impacts the placement of the nodes within clusters and might limit the maximum number of nodes in a pool because of deployment restrictions. If your application does not require communication between nodes, the Batch service can allocate a potentially large number of nodes to the pool from many different clusters and datacenters to enable increased parallel processing power.

- **Start task** for compute nodes

	The optional *start task* executes on each node as that node joins the pool, as well as each time a node is restarted or reimaged. The start task is especially useful for preparing compute nodes for the execution of tasks, such as installing the applications that your tasks will run.

> [AZURE.IMPORTANT] All Batch accounts have a default **quota** that limits the number of **cores** (and thus, compute nodes) in a Batch account. You will find the default quotas and instructions on how to [increase a quota](batch-quota-limit.md#increase-a-quota) (such as the maximum number of cores in your Batch account) in [Quotas and limits for the Azure Batch service](batch-quota-limit.md). If you find yourself asking "Why won't my pool reach more than X nodes?" this core quota might be the cause.

## Job

A job is a collection of tasks. It manages how computation is performed by its tasks on the compute nodes in a pool.

- The job specifies the **pool** in which the work will be run. You can create a new pool for each job, or use one pool for many jobs. You can create a pool for each job that is associated with a job schedule, or for all jobs that are associated with a job schedule.
- You can specify an optional **job priority**. When a job is submitted with a higher priority than jobs that are currently in progress, the tasks for the higher-priority job are inserted into the queue ahead of tasks for the lower-priority jobs. Lower-priority tasks that are already running will not be preempted.
- You can use job **constraints** to specify certain limits for your jobs:

	You can set a **maximum wallclock time**, so that if a job runs for longer than the maximum wallclock time that is specified, the job and all of its tasks are terminated.

	Batch can detect and then retry failed tasks. You can specify the **maximum number of task retries** as a constraint, including whether a task is *always* or *never* retried. Retrying a task means that the task is requeued to be run again.

- Your client application can add tasks to a job, or you can specify a [job manager task](#job-manager-task). A job manager task contains the information that is necessary to create the required tasks for a job, with the job manager task being run on one of the compute nodes in the pool. The job manager task is handled specifically by Batch--it is queued as soon as the job is created, and is restarted if it fails. A job manager task is *required* for jobs that are created by a [job schedule](#scheduled-jobs) because it is the only way to define the tasks before the job is instantiated.

### Job priority

You can assign a priority to jobs that you create in Batch. The Batch service uses the priority value of the job to determine the order of job scheduling within an account (this is not to be confused with a [scheduled job](#scheduled-jobs)). The priority values range from -1000 to 1000, with -1000 being the lowest priority and 1000 being the highest. You can update the priority of a job by using the [Update the properties of a job][rest_update_job] operation (Batch REST) or by modifying the [CloudJob.Priority][net_cloudjob_priority] property (Batch .NET).

Within the same account, higher-priority jobs have scheduling precedence over lower-priority jobs. A job with a higher-priority value in one account does not have scheduling precedence over another job with a lower-priority value in a different account.

Job scheduling across pools is independent. Between different pools, it is not guaranteed that a higher-priority job will be scheduled first if its associated pool is short of idle nodes. In the same pool, jobs with the same priority level have an equal chance of being scheduled.

### Scheduled jobs

[Job schedules][rest_job_schedules] enable you to create recurring jobs within the Batch service. A job schedule specifies when to run jobs and includes the specifications for the jobs to be run. You can specify the duration of the schedule--how long and when the schedule is in effect--and how often during that time period that jobs should be created.

## Task

A task is a unit of computation that is associated with a job. It runs on a node. Tasks are assigned to a node for execution, or are queued until a node becomes free. Put simply, a task runs one or more programs or scripts on a compute node to perform the work you need done.

When you create a task, you can specify:

- The **command line** of the task. This is the command line that runs your application or script on the compute node.

	It is important to note that the command line does not actually run under a shell. Therefore, it cannot natively take advantage of shell features such as [environment variable](#environment-settings-for-tasks) expansion (this includes the `PATH`). To take advantage of such features, you must invoke the shell in the command line--for example, by launching `cmd.exe` on Windows nodes or `/bin/sh` on Linux:

	`cmd /c MyTaskApplication.exe %MY_ENV_VAR%`

	`/bin/sh -c MyTaskApplication $MY_ENV_VAR`

	If your tasks need to run an application or script that is not in the node's `PATH` or reference environment variables, invoke the shell explicitly in the task command line.

- **Resource files** that contain the data to be processed. These files are automatically copied to the node from Blob storage in a **General purpose** Azure Storage account before the task's command line is executed. For more information, see the sections [Start task](#start-task) and [Files and directories](#files-and-directories).

- The **environment variables** that are required by your application. For more information, see the [Environment settings for tasks](#environment-settings-for-tasks) section.

- The **constraints** under which the task should execute. For example, the maximum time that the task is allowed to run, the maximum number of times a failed task should be retried, and the maximum time that files in the task's working directory are retained.

In addition to tasks that you define to perform computation on a node, the following special tasks are also provided by the Batch service:

- [Start task](#start-task)
- [Job manager task](#job-manager-task)
- [Job preparation and release tasks](#job-preparation-and-release-tasks)
- [Multi-instance tasks (MPI)](#multi-instance-tasks)
- [Task dependencies](#task-dependencies)

### Start task

By associating a **start task** with a pool, you can prepare the operating environment of its nodes. For example, you can perform actions such as installing the applications that your tasks will run and starting background processes. The start task runs every time a node starts, for as long as it remains in the pool--including when the node is first added to the pool and when it is restarted or reimaged.

A primary benefit of the start task is that it can contain all of the information that is necessary to configure a compute node and install the applications that are required for task execution. Therefore, increasing the number of nodes in a pool is as simple as specifying the new target node count--Batch already has the information that is needed to configure the new nodes and get them ready for accepting tasks.

As with any Azure Batch task, you can specify a list of **resource files** in [Azure Storage][azure_storage], in addition to a **command line** to be executed. Batch first copies the resource files to the node from Azure Storage, and then runs the command line. For a pool start task, the file list typically contains the task application and its dependencies.

However, it could also include reference data to be used by all tasks that are running on the compute node. For example, a start task's command line could perform a `robocopy` operation to copy application files (which were specified as resource files and downloaded to the node) from the start task's [working directory](#files-and-directories) to the [shared folder](#files-and-directories), and then run an MSI or `setup.exe`.

> [AZURE.IMPORTANT] Batch currently supports *only* the **General purpose** storage account type, as described in step 5 of [Create a storage account](../storage/storage-create-storage-account.md#create-a-storage-account) in [About Azure storage accounts](../storage/storage-create-storage-account.md). Your Batch tasks (including standard tasks, start tasks, job preparation tasks, and job release tasks) must specify resource files that reside *only* in **General purpose** storage accounts.

It is typically desirable for the Batch service to wait for the start task to complete before considering the node ready to be assigned tasks, but you can configure this.

If a start task fails on a compute node, then the state of the node is updated to reflect the failure, and the node will not be available for tasks to be assigned. A start task can fail if there is an issue copying its resource files from storage, or if the process executed by its command line returns a nonzero exit code.

### Job manager task

You typically use a **job manager task** to control and/or monitor job execution--for example, to create and submit the tasks for a job, determine additional tasks to run, and determine when work is complete. However, a job manager task is not restricted to these activities. It is a fully fledged task that can perform any actions that are required for the job. For example, a job manager task might download a file that is specified as a parameter, analyze the contents of that file, and submit additional tasks based on those contents.

A job manager task is started before all other tasks. It provides the following features:

- It is automatically submitted as a task by the Batch service when the job is created.

- It is scheduled to execute before the other tasks in a job.

- Its associated node is the last to be removed from a pool when the pool is being downsized.

- Its termination can be tied to the termination of all tasks in the job.

- A job manager task is given the highest priority when it needs to be restarted. If an idle node is not available, the Batch service might terminate one of the other running tasks in the pool to make room for the job manager task to run.

- A job manager task in one job does not have priority over the tasks of other jobs. Across jobs, only job-level priorities are observed.

### Job preparation and release tasks

Batch provides job preparation tasks for pre-job execution setup. Job release tasks are for post-job maintenance or cleanup.

- **Job preparation task**: A job preparation task runs on all compute nodes that are scheduled to run tasks, before any of the other job tasks are executed. You can use a job preparation task to copy data that is shared by all tasks, but is unique to the job, for example.
- **Job release task**: When a job has completed, a job release task runs on each node in the pool that executed at least one task. You can use a job release task to delete data that is copied by the job preparation task, or to compress and upload diagnostic log data, for example.

Both job preparation and release tasks allow you to specify a command line to run when the task is invoked. They offer features such as file download, elevated execution, custom environment variables, maximum execution duration, retry count, and file retention time.

For more information on job preparation and release tasks, see [Run job preparation and completion tasks on Azure Batch compute nodes](batch-job-prep-release.md).

### Multi-instance task

A [multi-instance task](batch-mpi.md) is a task that is configured to run on more than one compute node simultaneously. With multi-instance tasks, you can enable high-performance computing scenarios that require a group of compute nodes that are allocated together to process a single workload (like Message Passing Interface (MPI)).

For a detailed discussion on running MPI jobs in Batch by using the Batch .NET library, check out [Use multi-instance tasks to run Message Passing Interface (MPI) applications in Azure Batch](batch-mpi.md).

### Task dependencies

[Task dependencies](batch-task-dependencies.md), as the name implies, allow you to specify that a task depends on the completion of other tasks before its execution. This feature provides support for situations in which a "downstream" task consumes the output of an "upstream" task--or when an upstream task performs some initialization that is required by a downstream task. To use this feature, you must first enable task dependencies on your Batch job. Then, for each task that depends on another (or many others), you specify the tasks which that task depends on.

With task dependencies, you can configure scenarios such as the following:

* *taskB* depends on *taskA* (*taskB* will not begin execution until *taskA* has completed).
* *taskC* depends on both *taskA* and *taskB*.
* *taskD* depends on a range of tasks, such as tasks *1* through *10*, before it executes.

Check out [Task dependencies in Azure Batch](batch-task-dependencies.md) and the [TaskDependencies][github_sample_taskdeps] code sample in the [azure-batch-samples][github_samples] GitHub repository for more in-depth details on this feature.

## Environment settings for tasks

Each task that executes within a Batch job has access to environment variables that are set both by the Batch service (service-defined, as described in the following table) and custom environment variables that you can set for your tasks. The applications and scripts that run on the nodes by your tasks have access to these environment variables during execution.

You can set custom environment variables at the task or job level by populating the *environment settings* property for these entities. For example, see the [Add a task to a job][rest_add_task] operation (Batch REST API), or the [CloudTask.EnvironmentSettings][net_cloudtask_env] and [CloudJob.CommonEnvironmentSettings][net_job_env] properties in Batch .NET.

Your client application or service can obtain a task's environment variables, both service-defined and custom, by using the [Get information about a task][rest_get_task_info] operation (Batch REST) or by accessing the [CloudTask.EnvironmentSettings][net_cloudtask_env] property (Batch .NET). Processes executing on a compute node can access these and other environment variables on the node, for example, by using the familiar `%VARIABLE_NAME%` (Windows) or `$VARIABLE_NAME` (Linux) syntax.

The following environment variables are set by the Batch service, and are available for access by your tasks:

| Environment Variable Name       | Description                                                              |
|---------------------------------|--------------------------------------------------------------------------|
| `AZ_BATCH_ACCOUNT_NAME`         | The name of the account that the task belongs to.                       |
| `AZ_BATCH_JOB_ID`               | The ID of the job that the task belongs to.                             |
| `AZ_BATCH_JOB_PREP_DIR`         | The full path of the job preparation task directory on the node.         |
| `AZ_BATCH_JOB_PREP_WORKING_DIR` | The full path of the job preparation task working directory on the node. |
| `AZ_BATCH_NODE_ID`              | The ID of the node that the task is running on.                         |
| `AZ_BATCH_NODE_ROOT_DIR`        | The full path of the root directory on the node.                         |
| `AZ_BATCH_NODE_SHARED_DIR`      | The full path of the shared directory on the node.                       |
| `AZ_BATCH_NODE_STARTUP_DIR`     | The full path of the compute node startup task directory on the node.    |
| `AZ_BATCH_POOL_ID`              | The ID of the pool that the task is running on.                         |
| `AZ_BATCH_TASK_DIR`             | The full path of the task directory on the node.                         |
| `AZ_BATCH_TASK_ID`              | The ID of the current task.                                              |
| `AZ_BATCH_TASK_WORKING_DIR`     | The full path of the task working directory on the node.                 |

>[AZURE.IMPORTANT] These environment variables are available only in the context of the **task user**--that is, the user account on the node under which a task is executed. You will *not* see these if you [connect remotely](#connecting-to-compute-nodes) to a compute node via Remote Desktop Protocol (RDP) or Secure Shell (SSH) and list the environment variables. This is because the user account that is used for remote connection is not the same as the account that is used by the task.

## Files and directories

Each task has a *working directory* under which it creates zero or more files and directories. This working directory can be used for storing the program that is run by the task, the data that it processes, and the output of the processing it performs. All files and directories of a task are owned by the task user.

The Batch service exposes a portion of the file system on a node as the *root directory*. Tasks can access the root directory by referencing the `AZ_BATCH_NODE_ROOT_DIR` environment variable. For more information about using environment variables, see [Environment settings for tasks](#environment-settings-for-tasks).

The root directory contains the following directory structure:

![Compute node directory structure][1]

- **shared**: This directory provides read/write access to *all* tasks that run on a node. Any task that runs on the node can create, read, update, and delete files in this directory. Tasks can access this directory by referencing the `AZ_BATCH_NODE_SHARED_DIR` environment variable.

- **startup**: This directory is used by a start task as its working directory. All of the files that are downloaded to the node by the start task are stored here. The start task can create, read, update, and delete files under this directory. Tasks can access this directory by referencing the `AZ_BATCH_NODE_STARTUP_DIR` environment variable.

- **Tasks**: A directory is created for each task that runs on the node. It is accessed by referencing the `AZ_BATCH_TASK_DIR` environment variable.

	Within each task directory, the Batch service creates a working directory (`wd`) whose unique path is specified by the `AZ_BATCH_TASK_WORKING_DIR` environment variable. This directory provides read/write access to the task. The task can create, read, update, and delete files under this directory. This directory is retained based on the *RetentionTime* constraint that is specified for the task.

	`stdout.txt` and `stderr.txt`: These files are written to the task folder during the execution of the task.

>[AZURE.IMPORTANT] When a node is removed from the pool, *all* of the files that are stored on the node are removed.

## Application packages

The [application packages](batch-application-packages.md) feature provides easy management and deployment of applications to the compute nodes in your pools. With application packages, you can easily upload and manage multiple versions of the applications that are run by your tasks, including binaries and support files. Then you can automatically deploy one or more of these applications to the compute nodes in your pool.

Batch handles the details of working with Azure Storage in the background to securely store and deploy your application packages to compute nodes, so both your code and your management overhead can be simplified.

To find out more about the application package feature, check out [Application deployment with Azure Batch application packages](batch-application-packages.md).

## Pool and compute node lifetime

When you design your Azure Batch solution, you have to make a design decision about how and when pools are created, and how long compute nodes within those pools are kept available.

On one end of the spectrum, you can create a pool for each job when the job is submitted and have its nodes removed as soon as tasks finish execution. This will maximize utilization because the nodes are only allocated when they are absolutely needed--and they shut down as soon as they become idle. While this means that the job must wait for the nodes to be allocated, it is important to note that tasks will be scheduled to nodes as soon as they are individually available, allocated, and the start task has completed. Batch does *not* wait until all nodes within a pool are available before assigning tasks. This ensures maximum utilization of all available nodes.

At the other end of the spectrum, if having jobs start immediately is the highest priority, you can create a pool ahead of time and make its nodes available before jobs are submitted. In this scenario, job tasks can start immediately, but nodes might sit idle while waiting for tasks to be assigned.

A combined approach is typically used for handling a variable, but ongoing load. You can have a pool that multiple jobs are submitted to, but can scale the number of nodes up or down according to the job load (see [Scaling compute resources](#scaling-compute-resources) in the following section). You can do this reactively, based on current load, or proactively, if load can be predicted.

## Scaling compute resources

With [automatic scaling](batch-automatic-scaling.md), you can have the Batch service dynamically adjust the number of compute nodes in a pool according to the current workload and resource usage of your compute scenario. This allows you to lower the overall cost of running your application by using only the resources you need, and releasing those you don't need.

You enable automatic scaling by writing an [automatic scaling formula](batch-automatic-scaling.md#automatic-scaling-formulas) and associating that formula with a pool. The Batch service uses the formula to determine the target number of nodes in the pool for the next scaling interval (an interval that you can configure). You can specify the automatic scaling settings for a pool when you create it, or enable scaling on a pool later. You can also update the scaling settings on a scaling-enabled pool.

As an example, perhaps a job requires that you submit a very large number of tasks to be executed. You can assign a scaling formula to the pool that adjusts the number of nodes in the pool based on the current number of queued tasks and the completion rate of the tasks in the job. The Batch service periodically evaluates the formula and resizes the pool, based on workload (add nodes for many queued tasks, and remove nodes for no queued or running tasks) and your other formula settings.

A scaling formula can be based on the following metrics:

- **Time metrics** are based on statistics collected every five minutes in the specified number of hours.

- **Resource metrics** are based on CPU usage, bandwidth usage, memory usage, and number of nodes.

- **Task metrics** are based on task state, such as *Active* (queued), *Running*, or *Completed*.

When automatic scaling decreases the number of compute nodes in a pool, you must consider how to handle tasks that are running at the time of the decrease operation. To accommodate this, Batch provides a *node deallocation option* that you can include in your formulas. For example, you can specify that running tasks are stopped immediately, stopped immediately and then requeued for execution on another node, or allowed to finish before the node is removed from the pool.

For more information about automatically scaling an application, see [Automatically scale compute nodes in an Azure Batch pool](batch-automatic-scaling.md).

> [AZURE.TIP] To maximize compute resource utilization, set the target number of nodes to zero at the end of a job, but allow running tasks to finish.

## Security with certificates

You typically need to use certificates when you encrypt or decrypt sensitive information for tasks, such as the key for an [Azure Storage account][azure_storage]. To support this, you can install certificates on nodes. Encrypted secrets are passed to tasks via command-line parameters or embedded in one of the task resources, and the installed certificates can be used to decrypt them.

You use the [Add certificate][rest_add_cert] operation (Batch REST) or [CertificateOperations.CreateCertificate][net_create_cert] method (Batch .NET) to add a certificate to a Batch account. You can then associate the certificate to a new or existing pool. When a certificate is associated with a pool, the Batch service installs the certificate on each node in the pool. The Batch service installs the appropriate certificates when the node starts up, before launching any tasks (including the start task and job manager task).

## Error handling

You might find it necessary to handle both task and application failures within your Batch solution.

### Task failure handling
Task failures fall into these categories:

- **Scheduling failures**

	If the transfer of files that are specified for a task fails for any reason, a "scheduling error" is set for the task.

	Scheduling errors can occur if the task's resource files have moved, the Storage account is no longer available, or another issue was encountered that prevented the successful copying of files to the node.

- **Application failures**

	The process that is specified by the task's command line can also fail. The process is deemed to have failed when a nonzero exit code is returned by the process that is executed by the task (see *Task exit codes* in the next section).

	For application failures, you can configure Batch to automatically retry the task up to a specified number of times.

- **Constraint failures**

	You can set a constraint that specifies the maximum execution duration for a job or task, the *maxWallClockTime*. This can be useful for terminating "hung" tasks.

	When the maximum amount of time has been exceeded, the task is marked as *completed*, but the exit code is set to `0xC000013A` and the *schedulingError* field is marked as `{ category:"ServerError", code="TaskEnded"}`.

### Debugging application failures

- `stderr` and `stdout`

	During execution, an application might produce diagnostic output that you can use to troubleshoot issues. As mentioned in the earlier section [Files and directories](#files-and-directories), the Batch service writes standard output and standard error output to `stdout.txt` and `stderr.txt` files in the task directory on the compute node. You can use the Azure portal or one of the Batch SDKs to download these files. For example, you can retrieve these and other files for troubleshooting purposes by using [ComputeNode.GetNodeFile][net_getfile_node] and [CloudTask.GetNodeFile][net_getfile_task] in the Batch .NET library.

- **Task exit codes**

	As mentioned earlier, a task is marked as failed by the Batch service if the process that is executed by the task returns a nonzero exit code. When a task executes a process, Batch populates the task's exit code property with the *return code of the process*. It is important to note that a task's exit code is **not** determined by the Batch service--it is determined by the process itself or the operating system on which the process executed.

### Accounting for task failures or interruptions

Tasks might occasionally fail or be interrupted. The task application itself might fail, the node on which the task is running might be rebooted, or the node might be removed from the pool during a resize operation if the pool's deallocation policy is set to remove nodes immediately without waiting for tasks to finish. In all cases, the task can be automatically requeued by Batch for execution on another node.

It is also possible for an intermittent issue to cause a task to hang or take too long to execute. You can set the maximum execution time for a task. If it's exceeded, Batch will interrupt the task application.

### Connecting to compute nodes

You can perform additional debugging and troubleshooting by signing in to a compute node remotely. You can use the Azure portal to download a Remote Desktop Protocol (RDP) file for Windows nodes and obtain Secure Shell (SSH) connection information for Linux nodes. You can also do this by using the Batch APIs--for example, with [Batch .NET][net_rdpfile] or [Batch Python](batch-linux-nodes.md#connect-to-linux-nodes).

>[AZURE.IMPORTANT] To connect to a node via RDP or SSH, you must first create a user on the node. To do this, you can use the Azure portal, [add a user account to a node][rest_create_user] by using the Batch REST API, call the [ComputeNode.CreateComputeNodeUser][net_create_user] method in Batch .NET, or call the [add_user][py_add_user] method in the Batch Python module.

### Troubleshooting "bad" compute nodes

In situations where some of your tasks are failing, your Batch client application or service can examine the metadata of the failed tasks to identify a misbehaving node. Each node in a pool is given a unique ID, and the node on which a task runs is included in the task metadata. After you've identified a problem node, you can take several actions with it:

- **Reboot the node** ([REST][rest_reboot] | [.NET][net_reboot])

	Restarting the node can sometimes clear up latent issues such as stuck or crashed processes. Note that if your pool uses a start task or your job uses a job preparation task, they will be executed when the node restarts.

- **Reimage the node** ([REST][rest_reimage] | [.NET][net_reimage])

	This reinstalls the operating system on the node. As with rebooting a node, start tasks and job preparation tasks are rerun after the node has been reimaged.

- **Remove the node from the pool** ([REST][rest_remove] | [.NET][net_remove])

	Sometimes it is necessary to completely remove the node from the pool.

- **Disable task scheduling on the node** ([REST][rest_offline] | [.NET][net_offline])

	This effectively takes the node "offline" so that no further tasks will be assigned to it, but allows the node to remain running and in the pool. This enables you to perform further investigation into the cause of the failures without losing the failed task's data--and without the node causing additional task failures. For example, you can disable task scheduling on the node, then [sign in remotely](#connecting-to-compute-nodes) to examine the node's event logs or perform other troubleshooting. After you've finished your investigation, you can then bring the node back online by enabling task scheduling ([REST][rest_online] | [.NET][net_online]), or perform one of the other actions discussed earlier.

> [AZURE.IMPORTANT] With each action that is described in this section--reboot, reimage, remove, and disable task scheduling--you are able to specify how tasks currently running on the node are handled when you perform the action. For example, when you disable task scheduling on a node by using the Batch .NET client library, you can specify a [DisableComputeNodeSchedulingOption][net_offline_option] enum value to specify whether to **Terminate** running tasks, **Requeue** them for scheduling on other nodes, or allow running tasks to complete before performing the action (**TaskCompletion**).

## Next steps

- Walk through a sample Batch application step-by-step in [Get started with the Azure Batch Library for .NET](batch-dotnet-get-started.md). There is also a [Python version](batch-python-tutorial.md) of the tutorial that runs a workload on Linux compute nodes.

- Download and build the [Batch Explorer][github_batchexplorer] sample project for use while you develop your Batch solutions. Using the Batch Explorer, you can perform the following and more:
  - Monitor and manipulate pools, jobs, and tasks within your Batch account
  - Download `stdout.txt`, `stderr.txt`, and other files from nodes
  - Create users on nodes and download RDP files for remote login

- Learn how to [create pools of Linux compute nodes](batch-linux-nodes.md).

- Visit the [Azure Batch forum][batch_forum] on MSDN. The forum is a good place to ask questions, whether you are just learning or are an expert in using Batch.

[1]: ./media/batch-api-basics/node-folder-structure.png

[azure_storage]: https://azure.microsoft.com/services/storage/
[batch_forum]: https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurebatch
[cloud_service_sizes]: ../cloud-services/cloud-services-sizes-specs.md
[msmpi]: https://msdn.microsoft.com/library/bb524831.aspx
[github_samples]: https://github.com/Azure/azure-batch-samples
[github_sample_taskdeps]:  https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/TaskDependencies
[github_batchexplorer]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/BatchExplorer
[batch_net_api]: https://msdn.microsoft.com/library/azure/mt348682.aspx
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
[net_rdp]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.computenode.getrdpfile.aspx
[net_reboot]: https://msdn.microsoft.com/library/azure/mt631495.aspx
[net_reimage]: https://msdn.microsoft.com/library/azure/mt631496.aspx
[net_remove]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.removefrompoolasync.aspx
[net_offline]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.computenode.disableschedulingasync.aspx
[net_online]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.computenode.enableschedulingasync.aspx
[net_offline_option]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.common.disablecomputenodeschedulingoption.aspx
[net_rdpfile]: https://msdn.microsoft.com/library/azure/Mt272127.aspx

[py_add_user]: http://azure-sdk-for-python.readthedocs.io/en/latest/ref/azure.batch.operations.html#azure.batch.operations.ComputeNodeOperations.add_user

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
