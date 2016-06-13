<properties
	pageTitle="Azure Batch feature overview | Microsoft Azure"
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
	ms.date="06/14/2016"
	ms.author="marsma"/>

# Overview of Azure Batch features

This article provides a basic overview of the core API features of the Azure Batch service. Whether developing a distributed computational solution using the [Batch REST][batch_rest_api] API or one of the [Batch SDKs](batch-technical-overview.md#batch-development-apis), you will use many of the entities and features discussed below.

> [AZURE.TIP] For a higher level technical overview of Batch, please see the [Basics of Azure Batch](batch-technical-overview.md).

## Workflow of the Batch service

The following high-level workflow is typical of nearly all applications and services that use the Batch service for processing parallel workloads:

1. Upload the **data files** that you want to process to an [Azure Storage][azure_storage] account. Batch includes built-in support for accessing Azure Blob storage, and your tasks can download these files to [compute nodes](#compute-node) when the tasks are run.

2. Upload the **application files** that your tasks will run. These files can be binaries or scripts and their dependencies, and are executed by the tasks in your jobs. These files can be retrieved from your Storage account and downloaded to the compute nodes by the tasks, or you can use the [application packages](#application-packages) feature of Batch for application management and deployment.

3. Create a [Pool](#pool) of compute nodes. When you create a pool, you specify the number of compute nodes for the pool, their size, and operating system. When each task in your job runs, it's assigned to execute on one of the nodes in your pool.

4. Create a [Job](#job). A job manages a collection of tasks, and you associate each job to a specific pool where that job's tasks will run.

5. Add [Tasks](#task) to the job. Each task runs the application or script that you uploaded to process the data files it downloads from your Storage account. As each task completes, it can upload its output to Azure Storage.

6. Monitor job progress and retrieve the task output from Azure Storage.

In the sections below, you'll learn about each of the resources mentioned in the above workflow, as well as many other features of Batch that will enable your distributed computational scenario.

> [AZURE.NOTE] You will need a [Batch account](batch-account-create-portal.md) to use the Batch service, and nearly all solutions will use an [Azure Storage][azure_storage] account for file storage and retrieval. Batch currently supports only the **General purpose** storage account type, as described in step #5 [Create a storage account](../storage/storage-create-storage-account.md#create-a-storage-account) in [About Azure storage accounts](../storage/storage-create-storage-account.md).

## Resources of the Batch service

Some of the following resources—accounts, compute nodes, pools, jobs, and tasks—are used in all Batch solutions. Others, such as job schedules and application packages, are helpful but optional features.

- [Account](#account)
- [Compute node](#compute-node)
- [Pool](#pool)
- [Job](#job)

  - [Job schedules](#scheduled-jobs)

- [Task](#task)

  - [Start task](#start-task)
  - [Job manager task](#job-manager-task)
  - [Job preparation and release tasks](#job-preparation-and-release-tasks)
  - [Multi-instance tasks (MPI)](#multi-instance-tasks)
  - [Task dependencies](#task-dependencies)

- [Application packages](#application-packages)

### Account

A Batch account is a uniquely identified entity within the Batch service. All processing is associated with a Batch account. When you perform operations with the Batch service, you need both the account name and one of its account keys. You can [create and manage an Azure Batch account in the Azure portal](batch-account-create-portal.md).

### Compute node

A compute node is an Azure virtual machine that is dedicated to a specific workload for your application. The size of a node determines the number of CPU cores, the memory capacity, and the local file system size that is allocated to the node. You can create pools of Windows or Linux nodes by using either Cloud Services or Virtual Machines Marketplace images—see [Pool](#pool) below for more information on these options.

Nodes can run any executable or script supported by the operating system environment of the node. This includes \*.exe, \*.cmd, \*.bat and PowerShell scripts for Windows, and binaries, shell, and Python scripts for Linux.

All compute nodes in Batch also include:

- A standard [folder structure](#files-and-directories) and associated [environment variables](#environment-settings-for-tasks) available for reference by tasks.
- **Firewall** settings that are configured to control access.
- **Remote access** to both Windows (RDP) and Linux (SSH) nodes—see [Debugging application failures](#debugging-application-failures) below for more information.

> [AZURE.NOTE] Linux support in Batch is currently in preview. For more details, see [Provision Linux compute nodes in Azure Batch pools](batch-linux-nodes.md).

### Pool

A pool is a collection of nodes on which your application runs. The pool can be created manually by you, or by the Batch service automatically when you specify the work to be done. You can create and manage a pool that meets the resource requirements of your application, and pools may be used only by the Batch account in which it was created. A Batch account can have more than one pool.

Azure Batch pools build on top of the core Azure compute platform: Batch pools provide large-scale allocation, application installation, data distribution, and health monitoring, as well as the flexible adjustment of the number of compute nodes within a pool (scaling).

Every node that is added to a pool is assigned a unique name and IP address. When a node is removed from a pool, any changes made to the operating system or files are lost, and its name and IP address are released for future use. When a node leaves a pool, its lifetime is over.

You can configure a pool to allow communication between the nodes within it. If intra-pool communication is requested for a pool, the Batch service enables ports greater than 1100 on each node in the pool. Each node in the pool is configured to allow incoming connections to this port range only, and only from other nodes within the pool. If your application does not require communication between nodes, the Batch service can allocate a potentially large number of nodes to the pool from many different clusters and data centers to enable increased parallel processing power.

When you create a pool, you specify the following attributes:

- **Operating system** and **version** that runs on the nodes

	You have two options when selecting an operating system for the nodes in your pool: **Virtual Machine Configuration** and **Cloud Services Configuration**.

	**Virtual Machine Configuration** provides both Linux and Windows images for compute nodes from the [Azure Virtual Machines Marketplace][vm_marketplace]. When you create a pool containing Virtual Machine Configuration nodes, you must specify not only the size of the nodes, but also the **virtual machine image reference** and the Batch **node agent SKU** to be installed on the nodes. For more information about specifying these pool properties, see [Provision Linux compute nodes in Azure Batch pools](batch-linux-nodes.md).

	**Cloud Services Configuration** provides Windows compute nodes *only*. Available operating systems for Cloud Services Configuration pools are listed in the [Azure Guest OS releases and SDK compatibility matrix](../cloud-services/cloud-services-guestos-update-matrix.md). When you create a pool containing Cloud Services nodes, you need to specify only the node size and its *OS Family*. When creating pools of Windows compute nodes, Cloud Services is most commonly used.

    - The *OS Family* also determines which versions of .NET are installed with the OS.
	- As with worker roles within Cloud Services, an *OS Version* can be specified (for more information on worker roles, see [Tell me about cloud services](../cloud-services/cloud-services-choose-me.md#tell-me-about-cloud-services) section in the [Cloud Services overview](../cloud-services/cloud-services-choose-me.md)).
    - As with worker roles, it is recommended that `*` be specified for the *OS Version* so that the nodes are automatically upgraded, and there is no work required to cater to newly released versions. The primary use case for selecting a specific OS version is to ensure application compatibility, allowing backward compatibility testing to be performed before allowing the version to be updated. Once validated, the *OS Version* for the pool can be updated and the new OS image installed—any running tasks will be interrupted and re-queued.

- **Size of the nodes** in the pool

	**Cloud Services Configuration** compute node sizes are listed in [Sizes for Cloud Services](../cloud-services/cloud-services-sizes-specs.md). Batch supports all Cloud Services sizes except `ExtraSmall`.

	**Virtual Machine Configuration** compute node sizes are listed in [Sizes for virtual machines in Azure](../virtual-machines/virtual-machines-linux-sizes.md) (Linux) and [Sizes for virtual machines in Azure](../virtual-machines/virtual-machines-windows-sizes.md) (Windows). Batch supports all Azure VM sizes except `STANDARD_A0` and those with premium storage (`STANDARD_GS`, `STANDARD_DS`, and `STANDARD_DSV2` series).

	You should take into account the characteristics and requirements of the application or applications that will run on the compute nodes when you select a node size. You will typically select a node size assuming one task will run on the node at a time. Consider aspects such as whether the application is multi-threaded and how much memory it consumes to help determine the most suitable and cost-effective node size. It is possible to have multiple tasks and therefore multiple application instances [run in parallel](batch-parallel-node-tasks.md), in which case you will typically choose a larger node. See "Task scheduling policy" below for more information.

	All of the nodes in a pool are the same size. If you will be running applications with differing system requirements and/or load levels, you should use separate pools.

- **Target number of nodes** in the pool

	This is the number of compute nodes that you wish to deploy in the pool. This is referred to as a *target* because—in some situations—your pool may not reach the desired number of nodes. Causes of a pool not to reaching the desired number of nodes include reaching the [core quota](batch-quota-limit.md#batch-account-quotas) for your Batch account, or an auto-scaling formula that you have applied to the pool limiting the maximum number of nodes (see *Scaling policy* below).

- **Scaling policy** for the pool

	In addition to specifying a static number of nodes, you can instead write and apply an [auto-scaling formula](#scaling-applications) to a pool. The Batch service will periodically evaluate your formula and adjust the number of nodes within the pool based on various pool, job, and task parameters that you can specify.

- **Task scheduling** policy

	The [max tasks per node](batch-parallel-node-tasks.md) configuration option determines the maximum number of tasks that can be run in parallel on each compute node within the pool.
	The default configuration is that one task at a time runs on a node, but there are scenarios where it is beneficial to have more than one task executed on a node simultaneously. See the [example scenario](batch-parallel-node-tasks.md#example-scenario) in our [concurrent node tasks](batch-parallel-node-tasks.md) article to see how you can benefit from multiple tasks per node.

	You can also specify a *fill type* which determines whether Batch spreads the tasks evenly across all nodes in a pool, or packs each node with the maximum number of tasks before assigning tasks to another node.

- **Communication status** of the nodes in the pool

	You can configure a pool to allow communication between the nodes (inter-node communication) which determines its underlying network infrastructure. Note that this also impacts placement of the nodes within clusters.

	In most scenarios, tasks operate independently and do not need to communicate with one another, but there may be some applications in which tasks must communicate, such as in [MPI](batch-mpi.md) scenarios.

- **Start task** for nodes in the pool

	The optional *start task* will execute on each node as that node joins the pool, as well as each time a node is restarted or reimaged. The start task is especially useful for preparing compute nodes for the execution of tasks, such as installing the applications that your tasks will run.

> [AZURE.IMPORTANT] All Batch accounts have a default **quota** that limits the number of **cores** (and thus, compute nodes) in a Batch account. You will find the default quotas and instructions on how to [increase a quota](batch-quota-limit.md#increase-a-quota) (such as the maximum number of cores in your Batch account) in [Quotas and limits for the Azure Batch service](batch-quota-limit.md). If you find yourself asking "Why won't my pool reach more than X nodes?" this core quota may be the cause.

### Job

A job is a collection of tasks, and specifies how computation is performed on compute nodes in a pool.

- The job specifies the **pool** in which the work will be run. The pool can be an existing pool, previously created for use by many jobs, or created on-demand for each job associated with a job schedule, or for all jobs associated with a job schedule.
- An optional **job priority** can be specified. When a job is submitted with a higher priority than jobs currently in progress, the higher priority job's tasks are inserted into the queue ahead of the lower priority job tasks. Lower priority tasks that are already running will not be pre-empted.
- Job **constraints** specify certain limits for your jobs.

	A **maximum wallclock time** can be set for jobs. If a job runs for longer than the maximum wallclock time specified, then the job and all associated tasks will be ended.

	Azure Batch can detect tasks that fail and retry the tasks. The **maximum number of task retries** can be specified as a constraint, including whether a task is always or never retried. Retrying a task means that the task is re-queued to be run again.
- Tasks can be added to a job by your client application, or a [Job Manager task](#job-manager-task) may be specified. A job manager task contains the information necessary to create the required tasks for a job, with the task being run on one of the compute nodes within the pool. The job manager task is handled specifically by Batch–it is queued as soon as the job is created, and restarted if it fails. A Job Manager task is required for jobs created by a job schedule as it is the only way to define the tasks before the job is instantiated. More information on job manager tasks appears below.

### Scheduled jobs

Job schedules enable you to create recurring jobs within the Batch service. A job schedule specifies when to run jobs and includes the specifications for the jobs to be run. A job schedule allows for the specification of the duration of the schedule—how long and when the schedule is in effect—and how often during that time period jobs should be created.

### Task

A task is a unit of computation that is associated with a job and runs on a node. Tasks are assigned to a node for execution, or are queued until a node becomes free. A task uses the following resources:

- The application specified in the **command line** of the task.

- **Resource files** that contain the data to be processed. These files are automatically copied to the node from blob storage in a **General purpose** Azure Storage account. For more information, see [Start task](#start-task) and [Files and directories](#files-and-directories) below.

- The **environment variables** that are required by the application. For more information, see [Environment settings for tasks](#environment-settings-for-tasks) below.

- The **constraints** under which the computation should occur. For example, the maximum time in which the task is allowed to run, the maximum number of times that a task should be retried if it fails, and the maximum time that files in the working directory are retained.

In addition to tasks that you define to perform computation on a node, the following special tasks are also provided by the Batch service:

- [Start task](#start-task)
- [Job manager task](#job-manager-task)
- [Job preparation and release tasks](#job-preparation-and-release-tasks)
- [Multi-instance tasks (MPI)](#multi-instance-tasks)
- [Task dependencies](#task-dependencies)

#### Start task

By associating a **start task** with a pool, you can configure the operating environment of its nodes, performing actions such as installing software or starting background processes. The start task runs every time a node starts for as long as it remains in the pool, including when the node is first added to the pool. A primary benefit of the start task is that it contains all of the information necessary to configure compute nodes and install applications necessary for job task execution. Thus, increasing the number of nodes in a pool is as simple as specifying the new target node count - Batch already has all of the information needed to configure the new nodes and get them ready for accepting tasks.

As with any Batch task, a list of **resource files** in [Azure Storage][azure_storage] can be specified, in addition to a **command line** to be executed. Azure Batch will first copy the files from Azure Storage, then run the command line. For a pool start task, the file list usually contains the application package or files, but it could also include reference data to be used by all tasks running on the compute nodes. The start task's command line could execute a PowerShell script or perform a `robocopy` operation, for example, to copy application files to the "shared" folder, then subsequently run an MSI or `setup.exe`.

> [AZURE.IMPORTANT] Batch currently supports *only* the **General purpose** storage account type, as described in step #5 [Create a storage account](../storage/storage-create-storage-account.md#create-a-storage-account) in [About Azure storage accounts](../storage/storage-create-storage-account.md). Your Batch tasks (including standard tasks, start tasks, job preparation, and job release tasks) must specify resource files that reside *only* in **General purpose** storage accounts.

It is typically desirable for the Batch service to wait for the start task to complete before considering the node ready to be assigned tasks, but this is configurable.

If a start task fails on a compute node, then the state of the node is updated to reflect the failure, and the node will not be available for tasks to be assigned. A start task can fail if there is an issue copying its resource files from storage, or if the process executed by its command line returns a non-zero exit code.

#### Job Manager task

A **Job Manager task** is typically used in controlling and/or monitoring job execution. For example, creating and submitting the tasks for a job, determining additional tasks to run, and determining when work is complete. A Job Manager task is not restricted to these activities, however—it is a fully fledged task that can perform any actions required for the job. For example, a Job Manager task might download a file specified as a parameter, analyze the contents of that file, and submit additional tasks based on those contents.

A job manager task is started before all other tasks and provides the following features:

- It is automatically submitted as a task by the Batch service when the job is created.

- It is scheduled to execute before the other tasks in a job.

- Its associated node is the last to be removed from a pool when the pool is being downsized.

- Its termination can be tied to the termination of all tasks in the job.

- The job manager task is given the highest priority when it needs to be restarted. If an idle node is not available, the Batch service may terminate one of the other running tasks in the pool to make room for the job manager task to run.

- A job manager task in one job does not have priority over the tasks of other jobs. Across jobs, only job-level priorities are observed.

#### Job preparation and release tasks

Batch provides the job preparation task for pre-job execution setup, and the job release task for post-job maintenance or cleanup.

- **Job preparation task** – The job preparation task runs on all compute nodes scheduled to run tasks, before any of the other job tasks are executed. Use the job preparation task to copy data shared by all tasks, but unique to the job, for example.
- **Job release task** – When a job has completed, the job release task runs on each node in the pool that executed at least one task. Use the job release task to delete data copied by the job preparation task, or compress and upload diagnostic log data, for example.

Both job preparation and release tasks allow you to specify a command line to run when the task is invoked, and offer features such as file download, elevated execution, custom environment variables, maximum execution duration, retry count, and file retention time.

For more information on job preparation and release tasks, see [Run job preparation and completion tasks on Azure Batch compute nodes](batch-job-prep-release.md).

#### Multi-instance tasks

A [multi-instance task](batch-mpi.md) is a task that is configured to run on more than one compute node simultaneously. With multi-instance tasks, you can enable high performance computing scenarios like Message Passing Interface (MPI) that require a group of compute nodes allocated together to process a single workload.

For a detailed discussion on running MPI jobs in Batch using the Batch .NET library, check out [Use multi-instance tasks to run Message Passing Interface (MPI) applications in Azure Batch](batch-mpi.md).

#### Task dependencies

Task dependencies, as the name implies, allow you to specify that a task depends on the completion of other tasks before its execution. This feature provides support for situations in which a "downstream" task consumes the output of an "upstream" task, or when an upstream task performs some initialization that is required by a downstream task. To use this feature, you must first enable task dependencies on your Batch job. Then, for each task that depends on another (or many others), you specify the tasks which that task depends on.

With task dependencies, you can configure scenarios such as the following:

* *taskB* depends on *taskA* (*taskB* will not begin execution until *taskA* has completed)
* *taskC* depends on both *taskA* and *taskB*
* *taskD* depends on a range of tasks, such as tasks *1* through *10*, before it executes

Check out the [TaskDependencies][github_sample_taskdeps] code sample in the [azure-batch-samples][github_samples] GitHub repository. In it, you will see how to configure tasks that depend on other tasks using the [Batch .NET][batch_net_api] library.

### Application packages

The [application packages](batch-application-packages.md) feature provides easy management and deployment of applications to the compute nodes in your pools. With application packages, you can easily upload and manage multiple versions of the applications run by your tasks, including binaries and support files, then automatically deploy one or more of these applications to the compute nodes in your pool.

Batch handles the details of working with Azure Storage in the background to securely store and deploy your application packages to compute nodes, so both your code and your management overhead can be simplified.

To find out more about the application package feature, check out [Application deployment with Azure Batch application packages](batch-application-packages.md).

## Files and directories

Each task has a working directory under which it creates zero or more files and directories for storing the program that is run by the task, the data that it processes, and the output of the processing performed by the task. These files and directories are then available for use by other tasks during the running of a job. All tasks, files, and directories on a node are owned by a single user account.

The Batch service exposes a portion of the file system on a node as the "root directory." The root directory is available to a task by accessing the `%AZ_BATCH_NODE_ROOT_DIR%` environment variable. For more information about using environment variables, see [Environment settings for tasks](#environment-settings-for-tasks).

![Compute node directory structure][1]

The root directory contains the following directory structure:

- **Shared** – This location is a shared directory for all tasks that run on a node, regardless of job. On the node, the shared directory is accessed via  `%AZ_BATCH_NODE_SHARED_DIR%`. This directory provides read/write access to all tasks that execute on the node. Tasks can create, read, update, and delete files in this directory.

- **Startup** – This location is used by a start task as its working directory. All of the files that are downloaded by the Batch service to launch the start task are also stored under this directory. On the node, the start directory is available via the `%AZ_BATCH_NODE_STARTUP_DIR%` environment variable. The start task can create, read, update, and delete files under this directory, and this directory can be used by start tasks to configure the operating system.

- **Tasks** – A directory is created for each task that runs on the node, accessed via `%AZ_BATCH_TASK_DIR%`. Within each task directory, the Batch service creates a working directory (`wd`) whose unique path is specified by the `%AZ_BATCH_TASK_WORKING_DIR%` environment variable. This directory provides read/write access to the task. The task can create, read, update, and delete files under this directory, and this directory is retained based on the *RetentionTime* constraint specified for the task.

	`stdout.txt` and `stderr.txt` – These files are written to the task folder during the execution of the task.

When a node is removed from the pool, all of the files that are stored on the node are removed.

## Pool and compute node lifetime

When designing your Azure Batch solution, a design decision must be made with regard to how and when pools are created, and how long compute nodes within those pools are kept available.

On one end of the spectrum, a pool could be created for each job when the job is submitted, and its nodes removed as soon as tasks finish execution. This will maximize utilization as the nodes are only allocated when absolutely needed, and shutdown as soon as they become idle. While this means that the job must wait for the nodes to be allocated, it is important to note that tasks will be scheduled to nodes as soon as they are individually available, allocated, and the start task has completed. Batch does *not* wait until all nodes within a pool are available before assigning tasks, thus ensuring maximum utilization of all available nodes.

At the other end of the spectrum, if having jobs start immediately is the highest priority, a pool may be created ahead of time and its nodes made available before jobs are submitted. In this scenario, job tasks can start immediately, but nodes may sit idle while waiting for tasks to be assigned.

A combined approach, typically used for handling variable but ongoing load, is to have a pool to which multiple jobs are submitted, but scale the number of nodes up or down according to the job load (see [Scaling applications](#scaling-applications) below). This can be done reactively, based on current load, or proactively if load can be predicted.

## Scaling applications

With [automatic scaling](batch-automatic-scaling.md), you can have the Batch service dynamically adjust the number of compute nodes in a pool according to the current workload and resource usage of your compute scenario. This allows you to lower the overall cost of running your application by using only the resources you need, and releasing those you don't.

You enable automatic scaling by writing an [automatic scaling formula](batch-automatic-scaling.md#automatic-scaling-formulas) and associating that formula with a pool. The Batch service uses the formula to determine the target number of nodes in the pool for the next scaling interval (an interval which you can configure). You can specify the automatic scaling settings for a pool when you create it, or enable scaling on a pool later. You can also update the scaling settings on a scaling-enabled pool.

For example, perhaps a job requires that you submit a large number of tasks to be scheduled for execution. You can assign a scaling formula to the pool that adjusts number of nodes in the pool based on the current number of queued tasks, and the completion rate of the tasks in the job. The Batch service periodically evaluates the formula, and resizes the pool based on workload and your formula settings.

A scaling formula can be based on the following metrics:

- **Resource metrics** – Based on CPU usage, bandwidth usage, memory usage, and number of nodes.

- **Task metrics** – Based on task state, such as *Active* (queued), *Running*, or *Completed*.

When automatic scaling decreases the number of compute nodes in a pool, you must consider how to handle tasks that are running at the time of the decrease operation. To accommodate this, Batch provides a *node deallocation option* that you can include in your formulas. For example, you can specify that running tasks are stopped immediately, stopped immediately and then requeued for execution on another node, or allowed to finish before the node is removed from the pool.

For more information about automatically scaling an application, see [Automatically scale compute nodes in an Azure Batch pool](batch-automatic-scaling.md).

> [AZURE.TIP] To maximize compute resource utilization, set the target number of nodes to zero at the end of a job, but allow running tasks to finish.

## Security with certificates

You typically need to use certificates when encrypting or decrypting sensitive information for tasks, such as the key for an [Azure Storage account][azure_storage]. To support this, certificates can be installed on nodes. Encrypted secrets are passed to tasks via command-line parameters or embedded in one of the task resources, and the installed certificates can be used to decrypt them.

You use the [Add certificate][rest_add_cert] operation (Batch REST API) or [CertificateOperations.CreateCertificate][net_create_cert] method (Batch .NET API) to add a certificate to a Batch account. You can then associate the certificate to a new or existing pool. When a certificate is associated with a pool, the Batch service installs the certificate on each node in the pool. The Batch service installs the appropriate certificates when the node starts up, before launching any tasks including start and job manager tasks.

## Scheduling priority

You can assign a priority to jobs you create in Batch. The Batch service uses the priority value of the job to determine the order of job scheduling within an account. The priority values range from -1000 to 1000, with -1000 being the lowest priority and 1000 being the highest. You can update the priority of a job by using the [Update the properties of a job][rest_update_job] operation (Batch REST API) or by modifying the [CloudJob.Priority][net_cloudjob_priority] property (Batch .NET API).

Within the same account, higher priority jobs have scheduling precedence over lower priority jobs. A job with a higher priority value in one account does not have scheduling precedence over another job with a lower priority value in a different account.

Job scheduling across pools is independent. Between different pools, it is not guaranteed that a higher priority job will be scheduled first if its associated pool is short of idle nodes. In the same pool, jobs with the same priority level have an equal chance of being scheduled.

## Environment settings for tasks

Each task that executes within a Batch job has access to environment variables set both by the Batch service (system-defined, see table below) as well as user-defined environment variables. Applications and scripts run by tasks on compute nodes have access to these environment variables during execution on the node.

You can set user-defined environment variables when using the [Add a task to a job][rest_add_task] operation (Batch REST API) or by modifying the [CloudTask.EnvironmentSettings][net_cloudtask_env] property (Batch .NET API) when adding tasks to a job.

You can get a task's environment variables, both system- and user-defined, by using the [Get information about a task][rest_get_task_info] operation (Batch REST API) or by accessing the [CloudTask.EnvironmentSettings][net_cloudtask_env] property (Batch .NET API). As mentioned, processes executing on a compute node can also access all environment variables, for example by using the familiar `%VARIABLE_NAME%` syntax on a Windows compute node.

For every task that is scheduled within a job, the following set of system-defined environment variables is set by the Batch service:

| Environment Variable Name       | Description                                                              |
|---------------------------------|--------------------------------------------------------------------------|
| `AZ_BATCH_ACCOUNT_NAME`         | The name of the account to which the task belongs.                       |
| `AZ_BATCH_JOB_ID`               | The ID of the job to which the task belongs.                             |
| `AZ_BATCH_JOB_PREP_DIR`         | The full path of the job preparation task directory on the node.         |
| `AZ_BATCH_JOB_PREP_WORKING_DIR` | The full path of the job preparation task working directory on the node. |
| `AZ_BATCH_NODE_ID`              | The ID of the node on which the task is running.                         |
| `AZ_BATCH_NODE_ROOT_DIR`        | The full path of the root directory on the node.                         |
| `AZ_BATCH_NODE_SHARED_DIR`      | The full path of the shared directory on the node.                       |
| `AZ_BATCH_NODE_STARTUP_DIR`     | The full path of the compute node startup task directory on the node.    |
| `AZ_BATCH_POOL_ID`              | The ID of the pool on which the task is running.                         |
| `AZ_BATCH_TASK_DIR`             | The full path of the task directory on the node.                         |
| `AZ_BATCH_TASK_ID`              | The ID of the current task.                                              |
| `AZ_BATCH_TASK_WORKING_DIR`     | The full path of the task working directory on the node.                 |

>[AZURE.NOTE] You cannot overwrite any of the above system-defined variables - they are read-only.

## Error handling

You may find it necessary to handle both task and application failures within your Batch solution.

### Task failure handling
Task failures fall into these categories:

- **Scheduling failures**

	If the transfer of files specified for a task fails for any reason, a "scheduling error" is set for the task.

	Causes of scheduling errors could be because the files have moved, the Storage account is no longer available, or another issue was encountered that prevented the successful copying of files to the node.

- **Application failures**

	The process specified by the task's command line can also fail. The process is deemed to have failed when a non-zero exit code is returned by the process executed by the task.

	For application failures, it is possible to configure Batch to automatically retry the task up to a specified number of times.

- **Constraint failures**

	A constraint can be set that specifies the maximum execution duration for a job or task, the *maxWallClockTime*. This can be useful for terminating "hung" tasks.

	When the maximum amount of time has been exceeded, the task is marked as *completed* but the exit code is set to `0xC000013A`, and the *schedulingError* field will be marked as `{ category:"ServerError", code="TaskEnded"}`.

### Debugging application failures

During execution, an application may produce diagnostic output which can be used to troubleshoot issues. As mentioned in [Files and directories](#files-and-directories) above, the Batch service sends stdout and stderr output to `stdout.txt` and `stderr.txt` files located in the task directory on the compute node. By using [ComputeNode.GetNodeFile][net_getfile_node] and [CloudTask.GetNodeFile][net_getfile_task] in the Batch .NET library, for example, you can retrieve these and other files for troubleshooting purposes.

Even more extensive debugging can be performed by logging in to a compute node remotely. You can download a [Remote Desktop (RDP)][net_rdpfile] file for Windows nodes and obtain [SSH connection information](batch-linux-nodes.md#connect-to-linux-nodes) for Linux.

>[AZURE.NOTE] To connect to a node via RDP or SSH, you must first create a user on the node. You can [add a user account to a node][rest_create_user] in the Batch REST API, call the  [ComputeNode.CreateComputeNodeUser][net_create_user] method in Batch .NET, or the [add_user][py_add_user] method in the Batch Python module.

### Accounting for task failures or interruptions

Tasks may occasionally fail or be interrupted. The task application itself may fail, the node on which the task is running could be rebooted, or the node might be removed from the pool during a resize operation if the pool's de-allocation policy is set to remove nodes immediately without waiting for tasks to finish. In all cases, the task can be automatically re-queued by Batch for execution on another node.

It is also possible for an intermittent issue to cause a task to hang or take too long to execute. The maximum execution time can be set for a task, and if exceeded, Batch will interrupt the task application.

### Troubleshooting "bad" compute nodes

In situations where some of your tasks are failing, your Batch client application or service can examine the metadata of the failed tasks to identify a misbehaving node. Each node in a pool is given a unique ID, and the node on which a task runs is included in the task metadata. Once identified, you can take several actions:

- **Reboot the node** ([REST][rest_reboot] | [.NET][net_reboot])

	Restarting the node can sometimes clear up latent issues such as stuck or crashed processes. Note that if your pool uses a start task or your job uses a job preparation task, they will be executed when the node restarts.

- **Reimage the node** ([REST][rest_reimage] | [.NET][net_reimage])

	This reinstalls the operating system on the node. As with rebooting a node, start tasks and job preparation tasks are rerun after the node has been reimaged.

- **Remove the node from the pool** ([REST][rest_remove] | [.NET][net_remove])

	Sometimes it is necessary to completely remove the node from the pool.

- **Disable task scheduling on the node** ([REST][rest_offline] | [.NET][net_offline])

	This effectively takes the node "offline" so that no further tasks will be assigned to it, but allows the node to remain running and in the pool. This enables you to perform further investigation into the cause of the failures without losing the failed task's data, and without the node causing additional task failures. For example, you can disable task scheduling on the node, then log in remotely to examine the node's event logs, or perform other troubleshooting. Once you've finished your investigation, you can then bring the node back online by enabling task scheduling ([REST][rest_online], [.NET][net_online]), or perform one of the other actions discussed above.

> [AZURE.IMPORTANT] With each action above—reboot, reimage, remove, disable task scheduling—you are able to specify how tasks currently running on the node are handled when you perform the action. For example, when you disable task scheduling on a node with the Batch .NET client library, you can specify a [DisableComputeNodeSchedulingOption][net_offline_option] enum value to specify whether to **Terminate** running tasks, **Requeue** them for scheduling on other nodes, or allow running tasks to complete before performing the action (**TaskCompletion**).

## Next steps

- Walk through a sample Batch application step-by-step in [Get started with the Azure Batch Library for .NET](batch-dotnet-get-started.md). There is also a [Python version](batch-python-tutorial.md) of the tutorial that runs a workload on Linux compute nodes.

- Learn how to [create pools of Linux compute nodes](batch-linux-nodes.md).

- Visit the [Azure Batch forum][batch_forum] on MSDN. The forum is a good place to ask questions whether you are just learning or are an expert using Batch.

[1]: ./media/batch-api-basics/node-folder-structure.png

[azure_storage]: https://azure.microsoft.com/services/storage/
[batch_forum]: https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurebatch
[cloud_service_sizes]: ../cloud-services/cloud-services-sizes-specs.md
[msmpi]: https://msdn.microsoft.com/library/bb524831.aspx
[github_samples]: https://github.com/Azure/azure-batch-samples
[github_sample_taskdeps]:  https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/TaskDependencies

[batch_net_api]: https://msdn.microsoft.com/library/azure/mt348682.aspx
[net_cloudjob_jobmanagertask]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudjob.jobmanagertask.aspx
[net_cloudjob_priority]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudjob.priority.aspx
[net_cloudpool_starttask]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.starttask.aspx
[net_cloudtask_env]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.environmentsettings.aspx
[net_create_cert]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.certificateoperations.createcertificate.aspx
[net_create_user]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.computenode.createcomputenodeuser.aspx
[net_getfile_node]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.computenode.getnodefile.aspx
[net_getfile_task]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.getnodefile.aspx
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
