---
title: Job preparation and release tasks on Batch compute nodes
description: Use job-level preparation tasks to minimize data transfer to Azure Batch compute nodes, and release tasks for node cleanup at job completion.
ms.topic: how-to
ms.date: 04/11/2023
ms.devlang: csharp
ms.custom: seodec18, devx-track-csharp, devx-track-dotnet
---
# Job preparation and release tasks on Batch compute nodes

An Azure Batch job often requires setup before its tasks are executed, and post-job maintenance when its tasks are completed. For example, you might need to download common task input data to your compute nodes, or upload task output data to Azure Storage after the job completes. You can use *job preparation* and *job release* tasks for these operations.

- A job preparation task runs before a job's tasks, on all compute nodes scheduled to run at least one task.
- A job release task runs once the job is completed, on each node in the pool that ran a job preparation task.

As with other Batch tasks, you can specify a command line to invoke when a job preparation or release task runs. Job preparation and release tasks offer familiar Batch task features such as:

- [Resource file download](/dotnet/api/microsoft.azure.batch.jobpreparationtask.resourcefiles).
- Elevated execution.
- Custom environment variables.
- Maximum execution duration.
- Retry count.
- File retention time.

This article shows how to use the [JobPreparationTask](/dotnet/api/microsoft.azure.batch.jobpreparationtask) and [JobReleaseTask](/dotnet/api/microsoft.azure.batch.jobreleasetask) classes in the [Batch .NET](/dotnet/api/microsoft.azure.batch) library.

> [!TIP]
> Job preparation and release tasks are especially helpful in *shared pool* environments, in which a pool of compute nodes persists between job runs and is used by many jobs.

## Use cases for job preparation and release tasks

Job preparation and job release tasks are a good fit for the following scenarios:

- **Download common task data**. Batch jobs often require a common set of data as input for a job's tasks. You can use a job preparation task to download this data to each node before the execution of the job's other tasks.

  For example, in daily risk analysis calculations, market data is job-specific yet common to all tasks in the job. You can use a job preparation task to download this market data, which is often several gigabytes in size, to each compute node so that any task that runs on the node can use it.

- **Delete job and task output**. In a shared pool environment, where a pool's compute nodes aren't decommissioned between jobs, you might need to delete job data between runs. For example, you might need to conserve disk space on the nodes, or satisfy your organization's security policies. You can use a job release task to delete data that a job preparation task downloaded or that task execution generated.

- **Retain logs**. You might want to keep a copy of log files that your tasks generate, or crash dump files that failed applications generate. You can use a job release task to compress and upload this data to an [Azure Storage account](accounts.md#azure-storage-accounts).

## Job preparation task

Before it runs job tasks, Batch runs the job preparation task on each compute node scheduled to run a task. By default, Batch waits for the job preparation task to complete before running scheduled job tasks, but you can configure it not to wait.

If the node restarts, the job preparation task runs again, but you can also disable this behavior. If you have a job with a job preparation task and a job manager task, the job preparation task runs before the job manager task and before all other tasks. The job preparation task always runs first.

The job preparation task runs only on nodes that are scheduled to run a task. This behavior prevents unnecessary runs on nodes that aren't assigned any tasks. Nodes might not be assigned any tasks when the number of job tasks is less than the number of nodes in the pool. This behavior also applies when [concurrent task execution](batch-parallel-node-tasks.md) is enabled, which leaves some nodes idle if the task count is lower than the total possible concurrent tasks.

> [!NOTE]
> [JobPreparationTask](/dotnet/api/microsoft.azure.batch.cloudjob.jobpreparationtask) differs from [CloudPool.StartTask](/dotnet/api/microsoft.azure.batch.cloudpool.starttask) in that `JobPreparationTask` runs at the start of each job, whereas `StartTask` runs only when a compute node first joins a pool or restarts.

## Job release task

Once you mark a job as completed, the job release task runs on each node in the pool that ran a job preparation task. You mark a job as completed by issuing a terminate request. This request sets the job state to *terminating*, terminates any active or running tasks associated with the job, and runs the job release task. The job then moves to the *completed* state.

> [!NOTE]
> Deleting a job also executes the job release task. However, if a job is already terminated, the release task doesn't run a second time if the job is later deleted.

Job release tasks can run for a maximum of 15 minutes before the Batch service terminates them. For more information, see the [REST API reference documentation](/rest/api/batchservice/job/add#jobreleasetask).

## Job preparation and release tasks with Batch .NET

To run a job preparation task, assign a [JobPreparationTask](/dotnet/api/microsoft.azure.batch.jobpreparationtask) object to your job's [CloudJob.JobPreparationTask](/dotnet/api/microsoft.azure.batch.cloudjob.jobpreparationtask) property. Similarly, to use a job release task, initialize a [JobReleaseTask](/dotnet/api/microsoft.azure.batch.jobreleasetask) and assign it to your job's [CloudJob.JobReleaseTask](/dotnet/api/microsoft.azure.batch.cloudjob.jobreleasetask).

In the following code snippet, `myBatchClient` is an instance of [BatchClient](/dotnet/api/microsoft.azure.batch.batchclient), and `myPool` is an existing pool within the Batch account.

```csharp
// Create the CloudJob for CloudPool "myPool"
CloudJob myJob =
    myBatchClient.JobOperations.CreateJob(
        "JobPrepReleaseSampleJob",
        new PoolInformation() { PoolId = "myPool" });

// Specify the command lines for the job preparation and release tasks
string jobPrepCmdLine =
    "cmd /c echo %AZ_BATCH_NODE_ID% > %AZ_BATCH_NODE_SHARED_DIR%\\shared_file.txt";
string jobReleaseCmdLine =
    "cmd /c del %AZ_BATCH_NODE_SHARED_DIR%\\shared_file.txt";

// Assign the job preparation task to the job
myJob.JobPreparationTask =
    new JobPreparationTask { CommandLine = jobPrepCmdLine };

// Assign the job release task to the job
myJob.JobReleaseTask =
    new JobReleaseTask { CommandLine = jobReleaseCmdLine };

await myJob.CommitAsync();
```

The job release task runs when a job is terminated or deleted. You terminate a job by using [JobOperations.TerminateJobAsync](/dotnet/api/microsoft.azure.batch.joboperations.terminatejobasync), and delete a job by using [JobOperations.DeleteJobAsync](/dotnet/api/microsoft.azure.batch.joboperations.deletejobasync). You typically terminate or delete a job when its tasks are completed, or when a timeout you define is reached.

```csharp
// Terminate the job to mark it as completed. Terminate initiates the
// job release task on any node that ran job tasks. Note that the
// job release task also runs when a job is deleted, so you don't
// have to call Terminate if you delete jobs after task completion.

await myBatchClient.JobOperations.TerminateJobAsync("JobPrepReleaseSampleJob");
```

## Code sample on GitHub

To see job preparation and release tasks in action, build and run the [JobPrepRelease](https://github.com/Azure-Samples/azure-batch-samples/tree/master/CSharp/ArticleProjects/JobPrepRelease) sample project from GitHub. This console application takes the following actions:

1. Creates a pool with two nodes.
1. Creates a job with job preparation, release, and standard tasks.
1. Runs the job preparation task, which first writes the node ID to a text file in a node's *shared* directory.
1. Runs a task on each node that writes its task ID to the same text file.
1. Once all tasks are completed or the timeout is reached, prints the contents of each node's text file to the console.
1. Runs the job release task to delete the file from the node when the job is completed.
1. Prints the exit codes of the job preparation and release tasks for each node they ran on.
1. Pauses execution to allow confirmation of job and/or pool deletion.

Output from the sample application is similar to the following example:

```output
Attempting to create pool: JobPrepReleaseSamplePool
Created pool JobPrepReleaseSamplePool with 2 nodes
Checking for existing job JobPrepReleaseSampleJob...
Job JobPrepReleaseSampleJob not found, creating...
Submitting tasks and awaiting completion...
All tasks completed.

Contents of shared\job_prep_and_release.txt on tvm-2434664350_1-20160623t173951z:
-------------------------------------------
tvm-2434664350_1-20160623t173951z tasks:
  task001
  task004
  task005
  task006

Contents of shared\job_prep_and_release.txt on tvm-2434664350_2-20160623t173951z:
-------------------------------------------
tvm-2434664350_2-20160623t173951z tasks:
  task008
  task002
  task003
  task007

Waiting for job JobPrepReleaseSampleJob to reach state Completed
...

tvm-2434664350_1-20160623t173951z:
  Prep task exit code:    0
  Release task exit code: 0

tvm-2434664350_2-20160623t173951z:
  Prep task exit code:    0
  Release task exit code: 0

Delete job? [yes] no
yes
Delete pool? [yes] no
yes

Sample complete, hit ENTER to exit...
```

> [!NOTE]
> The varying creation and start times of nodes in a new pool means some nodes are ready for tasks before others, so you might see different output. Specifically, because the tasks complete quickly, one of the pool's nodes might run all of the job's tasks. If this occurs, the job preparation and release tasks don't exist for the node that ran no tasks.

## View job preparation and release tasks in the Azure portal

You can use the [Azure portal](https://portal.azure.com) to view Batch job properties and tasks, including job preparation and release tasks. From your Batch account page, select **Jobs** from the left navigation and then select a job. If you run the sample application, navigate to the job page after the tasks complete, but before you delete the job and pool.

You can monitor job progress and status by expanding **Approximate task count** on the job **Overview** or **Tasks** page.

:::image type="content" source="media/batch-job-prep-release/monitor-tasks.png" alt-text="Screenshot showing job task progress in the Azure portal.":::

The following screenshot shows the **JobPrepReleaseSampleJob** page after the sample application runs. This job had preparation and release tasks, so you can select **Preparation tasks** or **Release tasks** in the left navigation to see their properties.

:::image type="content" source="media/batch-job-prep-release/portal-jobprep-01.png" alt-text="Screenshot showing job release task properties in the Azure portal.":::

## Next steps

- Learn about [error checking for jobs and tasks](batch-job-task-error-checking.md).
- Learn how to use [application packages](batch-application-packages.md) to prepare Batch compute nodes for task execution.
- Explore different ways to [copy data and application to Batch compute nodes](batch-applications-to-pool-nodes.md).
- Learn about using the [Azure Batch File Conventions library](batch-task-output.md#batch-file-conventions-library) to persist logs and other job and task output data.
