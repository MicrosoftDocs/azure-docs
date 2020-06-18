---
title: Jobs and tasks in Azure Batch
description: Learn about jobs and tasks and how they are used in an Azure Batch workflow from a development standpoint.
ms.topic: conceptual
ms.date: 05/12/2020

---
# Jobs and tasks in Azure Batch

In Azure Batch, a *task* represents a unit of computation. A *job* is a collection of these tasks. More about jobs and tasks, and how they are used in an Azure Batch workflow, is described below.

## Jobs

A job is a collection of tasks. It manages how computation is performed by its tasks on the compute nodes in a pool.

A job specifies the [pool](nodes-and-pools.md#pools) in which the work is to be run. You can create a new pool for each job, or use one pool for many jobs. You can create a pool for each job that is associated with a job schedule, or for all jobs that are associated with a job schedule.

### Job priority

You can assign an optional job priority to jobs that you create. The Batch service uses the priority value of the job to determine the order of job scheduling within an account (this is not to be confused with a [scheduled job](#scheduled-jobs)). The priority values range from -1000 to 1000, with -1000 being the lowest priority and 1000 being the highest. To update the priority of a job, call the [Update the properties of a job](https://docs.microsoft.com/rest/api/batchservice/job/update) operation (Batch REST), or modify the [CloudJob.Priority](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.cloudjob) property (Batch .NET).

Within the same account, higher-priority jobs have scheduling precedence over lower-priority jobs. A job with a higher-priority value in one account does not have scheduling precedence over another job with a lower-priority value in a different account. Tasks in lower-priority jobs that are already running are not preempted.

Job scheduling across pools is independent. Between different pools, it is not guaranteed that a higher-priority job is scheduled first if its associated pool is short of idle nodes. In the same pool, jobs with the same priority level have an equal chance of being scheduled.

### Job constraints

You can use job constraints to specify certain limits for your jobs:

- You can set a **maximum wallclock time**, so that if a job runs for longer than the maximum wallclock time that is specified, the job and all of its tasks are terminated.
- You can specify the **maximum number of task retries** as a constraint, including whether a task is always retried or never retried. Retrying a task means that if the task fails, it will be requeued to run again.

### Job manager tasks and automatic termination

Your client application can add tasks to a job, or you can specify a [job manager task](#job-manager-task). A job manager task contains the information that is necessary to create the required tasks for a job, with the job manager task being run on one of the compute nodes in the pool. The job manager task is handled specifically by Batch; it is queued as soon as the job is created and is restarted if it fails. A job manager task is required for jobs that are created by a [job schedule](#scheduled-jobs), because it is the only way to define the tasks before the job is instantiated.

By default, jobs remain in the active state when all tasks within the job are complete. You can change this behavior so that the job is automatically terminated when all tasks in the job are complete. Set the job's **onAllTasksComplete** property ([OnAllTasksComplete](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.cloudjob) in Batch .NET) to *terminatejob* to automatically terminate the job when all of its tasks are in the completed state.

The Batch service considers a job with *no* tasks to have all of its tasks completed. Therefore, this option is most commonly used with a [job manager task](#job-manager-task). If you want to use automatic job termination without a job manager, you should initially set a new job's **onAllTasksComplete** property to *noaction*, then set it to *terminatejob* only after you've finished adding tasks to the job.

### Scheduled jobs

[Job schedules](https://docs.microsoft.com/rest/api/batchservice/jobschedule) enable you to create recurring jobs within the Batch service. A job schedule specifies when to run jobs and includes the specifications for the jobs to be run. You can specify the duration of the schedule (how long and when the schedule is in effect) and how frequently jobs are created during the scheduled period.

## Tasks

A task is a unit of computation that is associated with a job. It runs on a node. Tasks are assigned to a node for execution, or are queued until a node becomes free. Put simply, a task runs one or more programs or scripts on a compute node to perform the work you need done.

When you create a task, you can specify:

- The **command line** for the task. This is the command line that runs your application or script on the compute node.

    It is important to note that the command line does not run under a shell. Therefore, it cannot natively take advantage of shell features like [environment variable](#environment-settings-for-tasks) expansion (this includes the `PATH`). To take advantage of such features, you must invoke the shell in the command line, such as by launching `cmd.exe` on Windows nodes or `/bin/sh` on Linux:

    `cmd /c MyTaskApplication.exe %MY_ENV_VAR%`

    `/bin/sh -c MyTaskApplication $MY_ENV_VAR`

    If your tasks need to run an application or script that is not in the node's `PATH` or reference environment variables, invoke the shell explicitly in the task command line.
- **Resource files** that contain the data to be processed. These files are automatically copied to the node from Blob storage in an Azure Storage account before the task's command line is executed. For more information, see [Start task](#start-task) and [Files and directories](files-and-directories.md).
- The **environment variables** that are required by your application. For more information, see [Environment settings for tasks](#environment-settings-for-tasks).
- The **constraints** under which the task should execute. For example, constraints include the maximum time that the task is allowed to run, the maximum number of times a failed task should be retried, and the maximum time that files in the task's working directory are retained.
- **Application packages** to deploy to the compute node on which the task is scheduled to run. [Application packages](batch-application-packages.md) provide simplified deployment and versioning of the applications that your tasks run. Task-level application packages are especially useful in shared-pool environments, where different jobs are run on one pool, and the pool is not deleted when a job is completed. If your job has fewer tasks than nodes in the pool, task application packages can minimize data transfer since your application is deployed only to the nodes that run tasks.
- A **container image** reference in Docker Hub or a private registry and additional settings to create a Docker container in which the task runs on the node. You only specify this information if the pool is set up with a container configuration.

> [!NOTE]
> The maximum lifetime of a task, from when it is added to the job to when it completes, is 180 days. Completed tasks persist for 7 days; data for tasks not completed within the maximum lifetime is not accessible.

In addition to tasks you define to perform computation on a node, several special tasks are also provided by the Batch service:

- [Start task](#start-task)
- [Job manager task](#job-manager-task)
- [Job preparation and release tasks](#job-preparation-and-release-tasks)
- [Multi-instance tasks](#multi-instance-task)
- [Task dependencies](#task-dependencies)

### Start task

By associating a start task with a pool, you can prepare the operating environment of its nodes. For example, you can perform actions such as installing the applications that your tasks run, or starting background processes. The start task runs every time a node starts, for as long as it remains in the pool. This includes when the node is first added to the pool and when it is restarted or reimaged.

A primary benefit of the start task is that it can contain all the information necessary to configure a compute node and install the applications required for task execution. Therefore, increasing the number of nodes in a pool is as simple as specifying the new target node count. The start task provides the information needed for the Batch service to configure the new nodes and get them ready for accepting tasks.

As with any Azure Batch task, you can specify a list of resource files in [Azure Storage](../storage/index.yml), in addition to a command line to be executed. The Batch service first copies the resource files to the node from Azure Storage, and then runs the command line. For a pool start task, the file list typically contains the task application and its dependencies.

However, the start task could also include reference data to be used by all tasks that are running on the compute node. For example, a start task's command line could perform a `robocopy` operation to copy application files (which were specified as resource files and downloaded to the node) from the start task's [working directory](files-and-directories.md) to the **shared** folder, and then run an MSI or `setup.exe`.

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

### Job manager task

You typically use a job manager task to control and/or monitor job execution. For example, job manager tasks are often used to create and submit the tasks for a job, determine additional tasks to run, and determine when work is complete.

However, a job manager task is not restricted to these activities. It is a full-fledged task that can perform any actions that are required for the job. For example, a job manager task might download a file that is specified as a parameter, analyze the contents of that file, and submit additional tasks based on those contents.

A job manager task is started before all other tasks. It provides the following features:

- It is automatically submitted as a task by the Batch service when the job is created.
- It is scheduled to execute before the other tasks in a job.
- Its associated node is the last to be removed from a pool when the pool is being downsized.
- Its termination can be tied to the termination of all tasks in the job.
- A job manager task is given the highest priority when it needs to be restarted. If an idle node is not available, the Batch service might terminate one of the other running tasks in the pool to make room for the job manager task to run.
- A job manager task in one job does not have priority over the tasks of other jobs. Across jobs, only job-level priorities are observed.

### Job preparation and release tasks

Batch provides job preparation tasks for pre-job execution setup, and job release tasks for post-job maintenance or cleanup.

A job preparation task runs on all compute nodes that are scheduled to run tasks, before any of the other job tasks are executed. For example, you can use a job preparation task to copy data that is shared by all tasks, but is unique to the job.

When a job has completed, a job release task runs on each node in the pool that executed at least one task. For example, a job release task can delete data that was copied by the job preparation task, or it can compress and upload diagnostic log data.

Both job preparation and release tasks allow you to specify a command line to run when the task is invoked. They offer features like file download, elevated execution, custom environment variables, maximum execution duration, retry count, and file retention time.

For more information on job preparation and release tasks, see [Run job preparation and completion tasks on Azure Batch compute nodes](batch-job-prep-release.md).

### Multi-instance task

A [multi-instance task](batch-mpi.md) is a task that is configured to run on more than one compute node simultaneously. With multi-instance tasks, you can enable high-performance computing scenarios that require a group of compute nodes that are allocated together to process a single workload, such as Message Passing Interface (MPI).

For a detailed discussion on running MPI jobs in Batch by using the Batch .NET library, check out [Use multi-instance tasks to run Message Passing Interface (MPI) applications in Azure Batch](batch-mpi.md).

### Task dependencies

[Task dependencies](batch-task-dependencies.md), as the name implies, allow you to specify that a task depends on the completion of other tasks before its execution. This feature provides support for situations in which a "downstream" task consumes the output of an "upstream" task, or when an upstream task performs some initialization that is required by a downstream task.

To use this feature, you must first [enable task dependencies](batch-task-dependencies.md#enable-task-dependencies
) on your Batch job. Then, for each task that depends on another (or many others), you specify the tasks which that task depends on.

With task dependencies, you can configure scenarios like the following:

- *taskB* depends on *taskA* (*taskB* will not begin execution until *taskA* has completed).
- *taskC* depends on both *taskA* and *taskB*.
- *taskD* depends on a range of tasks, such as tasks *1* through *10*, before it executes.

For more details, see [Task dependencies in Azure Batch](batch-task-dependencies.md) and the [TaskDependencies](https://github.com/Azure-Samples/azure-batch-samples/tree/master/CSharp/ArticleProjects/TaskDependencies) code sample in the [azure-batch-samples](https://github.com/Azure-Samples/azure-batch-samples) GitHub repository.

### Environment settings for tasks

Each task executed by the Batch service has access to environment variables that it sets on compute nodes. This includes environment variables defined by the Batch service ([service-defined](https://docs.microsoft.com/azure/batch/batch-compute-node-environment-variables) and custom environment variables that you can define for your tasks. The applications and scripts your tasks execute have access to these environment variables during execution.

You can set custom environment variables at the task or job level by populating the *environment settings* property for these entities. For more details, see the [Add a task to a job](https://docs.microsoft.com/rest/api/batchservice/task/add?)] operation (Batch REST API), or the [CloudTask.EnvironmentSettings](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.cloudtask) and [CloudJob.CommonEnvironmentSettings](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.cloudjob) properties in Batch .NET.

Your client application or service can obtain a task's environment variables, both service-defined and custom, by using the [Get information about a task](https://docs.microsoft.com/rest/api/batchservice/task/get) operation (Batch REST) or by accessing the [CloudTask.EnvironmentSettings](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.cloudtask) property (Batch .NET). Processes executing on a compute node can access these and other environment variables on the node, for example, by using the familiar `%VARIABLE_NAME%` (Windows) or `$VARIABLE_NAME` (Linux) syntax.

You can find a full list of all service-defined environment variables in [Compute node environment variables](batch-compute-node-environment-variables.md).

## Next steps

- Learn about [files and directories](files-and-directories.md).
