---
title: Check for job and task errors
description: Learn about errors to check for and how to troubleshoot jobs and tasks.
author: mscurrell
ms.topic: how-to
ms.date: 11/23/2020
ms.author: markscu
---

# Job and task error checking

There are various errors that can occur when adding jobs and tasks. Detecting failures for these operations is straightforward because any failures are returned immediately by the API, CLI, or UI. However, there are also failures that can happen later, when jobs and tasks are scheduled and run.

This article covers the errors that can occur after jobs and tasks are submitted and how to check for and handle them.

## Jobs

A job is a grouping of one or more tasks, with the tasks actually specifying the command lines to be run.

When adding a job, the following parameters can be specified which can influence how the job can fail:

- [Job Constraints](/rest/api/batchservice/job/add#jobconstraints)
  - The `maxWallClockTime` property can optionally be specified to set the maximum amount of time a job can be active or running. If exceeded, the job will be terminated with the `terminateReason` property set in the [executionInfo](/rest/api/batchservice/job/get#cloudjob) for the job.
- [Job Preparation Task](/rest/api/batchservice/job/add#jobpreparationtask)
  - If specified, a job preparation task is run the first time a task is run for a job on a node. The job preparation task can fail, which will lead to the task not being run and the job not completing.
- [Job Release Task](/rest/api/batchservice/job/add#jobreleasetask)
  - A job release task can only be specified if a job preparation task is configured. When a job is being terminated, the job release task is run on the each of pool nodes where a job preparation task was run. A job release task can fail, but the job will still move to a `completed` state.

### Job properties

The following job properties should be checked for errors:

- '[executionInfo](/rest/api/batchservice/job/get#jobexecutioninformation)':
  - The `terminateReason` property can have values to indicate that the `maxWallClockTime`, specified in the job constraints, was exceeded and therefore the job was terminated. It can also be set to indicate a task failed if the job `onTaskFailure` property was set appropriately.
  - The [schedulingError](/rest/api/batchservice/job/get#jobschedulingerror) property is set if there has been a scheduling error.

### Job preparation tasks

If a job preparation task is specified for a job, then an instance of that task will be run the first time a task for the job is run on a node. The job preparation task configured on the job can be thought of as a task template, with multiple job preparation task instances being run, up to the number of nodes in a pool.

The job preparation task instances should be checked to determine if there were errors:

- When a job preparation task is run, then the task that triggered the job preparation task will move to a [state](/rest/api/batchservice/task/get#taskstate) of `preparing`; if the job preparation task then fails, the triggering task will revert to the `active` state and will not be run.
- All the instances of the job preparation task that have been run can be obtained from the job using the [List Preparation and Release Task Status](/rest/api/batchservice/job/listpreparationandreleasetaskstatus) API. As with any task, there is [execution information](/rest/api/batchservice/job/listpreparationandreleasetaskstatus#jobpreparationandreleasetaskexecutioninformation) available with properties such as `failureInfo`, `exitCode`, and `result`.
- If job preparation tasks fail, then the triggering job tasks will not be run, the job will not complete and will be stuck. The pool may go unutilized if there are no other jobs with tasks that can be scheduled.

### Job release tasks

If a job release task is specified for a job, then when a job is being terminated, an instance of the job release task is run on each pool node where a job preparation task was run. The job release task instances should be checked to determine if there were errors:

- All the instances of the job release task being run can be obtained from the job using the API [List Preparation and Release Task Status](/rest/api/batchservice/job/listpreparationandreleasetaskstatus). As with any task, there is [execution information](/rest/api/batchservice/job/listpreparationandreleasetaskstatus#jobpreparationandreleasetaskexecutioninformation) available with properties such as `failureInfo`, `exitCode`, and `result`.
- If one or more job release tasks fail, then the job will still be terminated and move to a `completed` state.

## Tasks

Job tasks can fail for multiple reasons:

- The task command line fails, returning with a non-zero exit code.
- There are `resourceFiles` specified for a task, but there was a failure that meant one or more files didn't download.
- There are `outputFiles` specified for a task, but there was a failure that meant one or more files didn't upload.
- The elapsed time for the task, specified by the `maxWallClockTime` property in the task [constraints](/rest/api/batchservice/task/add#taskconstraints), was exceeded.

In all cases the following properties must be checked for errors and information about the errors:

- The tasks [executionInfo](/rest/api/batchservice/task/get#taskexecutioninformation) property contains multiple properties that provide information about an error. [result](/rest/api/batchservice/task/get#taskexecutionresult) indicates if the task failed for any reason, with `exitCode` and `failureInfo` providing more information about the failure.
- The task will always move to the `completed` [state](/rest/api/batchservice/task/get#taskstate), independent of whether it succeeded or failed.

The impact of task failures on the job and any task dependencies must be considered. The [exitConditions](/rest/api/batchservice/task/add#exitconditions) property can be specified for a task to configure an action for dependencies and for the job.

- For dependencies, [DependencyAction](/rest/api/batchservice/task/add#dependencyaction) controls whether the tasks dependent on the failed task are blocked or are run.
- For the job, [JobAction](/rest/api/batchservice/task/add#jobaction) controls whether the failed task leads to the job being disabled, terminated, or left unchanged.

### Task command line failures

When the task command line is run, output is written to `stderr.txt` and `stdout.txt`. In addition, the application may write to application-specific log files.

If the pool node on which a task has run still exists, then the log files can be obtained and viewed. For example, the Azure portal lists and can view log files for a task or a pool node. Multiple APIs also allow task files to be listed and obtained, such as [Get From Task](/rest/api/batchservice/file/getfromtask).

Since pools and pool nodes are frequently ephemeral, with nodes being continuously added and deleted, we recommend saving log files. [Task output files](./batch-task-output-files.md) are a convenient way to save log files to Azure Storage.

The command lines executed by tasks on compute nodes do not run under a shell, so they can't natively take advantage of shell features such as environment variable expansion. To take advantage of such features, you must [invoke the shell in the command line](batch-compute-node-environment-variables.md#command-line-expansion-of-environment-variables).

### Output file failures

On every file upload, Batch writes two log files to the compute node, `fileuploadout.txt` and `fileuploaderr.txt`. You can examine these log files to learn more about a specific failure. In cases where the file upload was never attempted, for example because the task itself couldn't run, then these log files will not exist.  

## Next steps

- Check that your application implements comprehensive error checking; it can be critical to promptly detect and diagnose issues.
- Learn more about [jobs and tasks](jobs-and-tasks.md).