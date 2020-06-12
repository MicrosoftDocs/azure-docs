---
title: Error handling and detection in Azure Batch
description: Learn about error handling in Batch service workflows from a development standpoint.
ms.topic: article
ms.date: 05/15/2020
---

# Error handling and detection in Azure Batch

At times, you may find it necessary to handle both task and application failures within your Batch solution. This article talks about types of errors and how to resolve them.

## Error codes

General types of errors include:

- Networking failures for requests that never reached Batch, or when the Batch response didn't reach the client in time.
- Internal server errors (standard 5xx status code HTTP response).
- Throttling-related errors, such as 429 or 503 status code HTTP responses with the Retry-after header.
- 4xx errors such as AlreadyExists and InvalidOperation. This means that the resource is not in the correct state for the state transition.

For detailed information about specific error codes, including error codes for REST API, Batch service, and job task/scheduling, see [Batch Status and Error Codes](https://docs.microsoft.com/rest/api/batchservice/batch-status-and-error-codes).

## Application failures

During execution, an application might produce diagnostic output that you can use to troubleshoot issues. As described in [Files and directories](files-and-directories.md), the Batch service writes standard output and standard error output to `stdout.txt` and `stderr.txt` files in the task directory on the compute node.

You can use the Azure portal or one of the Batch SDKs to download these files. For example, you can retrieve these and other files for troubleshooting purposes by using [ComputeNode.GetNodeFile](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.computenode) and [CloudTask.GetNodeFile](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.cloudtask) in the Batch .NET library.

## Task errors

Task errors fall into several categories.

### Pre-processing errors

If a task fails to start, a pre-processing error is set for the task.  

Pre-processing errors can occur if the task's resource files have moved, the storage account is no longer available, or another issue was encountered that prevented the successful copying of files to the node.

### File upload errors

If files that are specified for a task fail to upload for any reason, a file upload error is set for the task.

File upload errors can occur if the SAS supplied for accessing Azure Storage is invalid or does not provide write permissions, if the storage account is no longer available, or if another issue was encountered that prevented the successful copying of files from the node.

### Application errors

The process that is specified by the task's command line can also fail. The process is deemed to have failed when a nonzero exit code is returned by the process that is executed by the task (see *Task exit codes* in the next section).

For application errors, you can configure Batch to automatically retry the task up to a specified number of times.

### Constraint errors

You can set a constraint that specifies the maximum execution duration for a job or task, the *maxWallClockTime*. This can be useful for terminating tasks that fail to progress.

When the maximum amount of time has been exceeded, the task is marked as *completed*, but the exit code is set to `0xC000013A` and the *schedulingError* field is marked as `{ category:"ServerError", code="TaskEnded"}`.

## Task exit codes

As mentioned earlier, a task is marked as failed by the Batch service if the process that is executed by the task returns a nonzero exit code. When a task executes a process, Batch populates the task's exit code property with the return code of the process.

It is important to note that a task's exit code is not determined by the Batch service. A task's exit code is determined by the process itself or the operating system on which the process executed.

## Task failures or interruptions

Tasks might occasionally fail or be interrupted. The task application itself might fail, the node on which the task is running might be rebooted, or the node might be removed from the pool during a resize operation (if the pool's deallocation policy is set to remove nodes immediately without waiting for tasks to finish). In all cases, the task can be automatically requeued by Batch for execution on another node.

It is also possible for an intermittent issue to cause a task to stop responding or take too long to execute. You can set the maximum execution interval for a task. If the maximum execution interval is exceeded, the Batch service interrupts the task application.

## Connect to compute nodes

You can perform additional debugging and troubleshooting by signing in to a compute node remotely. You can use the Azure portal to download a Remote Desktop Protocol (RDP) file for Windows nodes and obtain Secure Shell (SSH) connection information for Linux nodes. You can also do this by using the Batch APIs such as with [Batch .NET](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.computenode) or [Batch Python](batch-linux-nodes.md#connect-to-linux-nodes-using-ssh).

> [!IMPORTANT]
> To connect to a node via RDP or SSH, you must first create a user on the node. To do this, you can use the Azure portal, [add a user account to a node](https://docs.microsoft.com/rest/api/batchservice/computenode/adduser) by using the Batch REST API, call the [ComputeNode.CreateComputeNodeUser](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.computenode) method in Batch .NET, or call the [add_user](batch-linux-nodes.md#connect-to-linux-nodes-using-ssh) method in the Batch Python module.

If you need to restrict or disable RDP or SSH access to compute nodes, see [Configure or disable remote access to compute nodes in an Azure Batch pool](pool-endpoint-configuration.md).

## Troubleshoot problem nodes

In situations where some of your tasks are failing, your Batch client application or service can examine the metadata of the failed tasks to identify a misbehaving node. Each node in a pool is given a unique ID, and the node on which a task runs is included in the task metadata. After you've identified a problem node, you can take several actions with it:

- **Reboot the node** ([REST](https://docs.microsoft.com/rest/api/batchservice/computenode/reboot) | [.NET](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.computenode.reboot)))

    Restarting the node can sometimes clear up latent issues like stuck or crashed processes. If your pool uses a start task or your job uses a job preparation task, they are executed when the node restarts.
- **Reimage the node** ([REST](https://docs.microsoft.com/rest/api/batchservice/computenode/reimage) | [.NET](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.computenode.reimage))

    This reinstalls the operating system on the node. As with rebooting a node, start tasks and job preparation tasks are rerun after the node has been reimaged.
- **Remove the node from the pool** ([REST](https://docs.microsoft.com/rest/api/batchservice/pool/removenodes) | [.NET](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.pooloperations))

    Sometimes it is necessary to completely remove the node from the pool.
- **Disable task scheduling on the node** ([REST](https://docs.microsoft.com/rest/api/batchservice/computenode/disablescheduling) | [.NET](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.computenode.disablescheduling))

    This effectively takes the node offline so that no further tasks are assigned to it, but allows the node to remain running and in the pool. This enables you to perform further investigation into the cause of the failures without losing the failed task's data, and without the node causing additional task failures. For example, you can disable task scheduling on the node, then sign in remotely to examine the node's event logs or perform other troubleshooting. After you've finished your investigation, you can then bring the node back online by enabling task scheduling ([REST](https://docs.microsoft.com/rest/api/batchservice/computenode/enablescheduling) | [.NET](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.computenode.enablescheduling), or perform one of the other actions discussed earlier.

> [!IMPORTANT]
> With the actions described above, youc can specify how tasks currently running on the node are handled when you perform the action. For example, when you disable task scheduling on a node by using the Batch .NET client library, you can specify a [DisableComputeNodeSchedulingOption](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.common.disablecomputenodeschedulingoption) enum value to specify whether to **Terminate** running tasks, **Requeue** them for scheduling on other nodes, or allow running tasks to complete before performing the action (**TaskCompletion**).

## Retry after errors

The Batch APIs will notify you if there is a failure. They can all be retried, and they all include a global retry handler for that purpose. It is best to use this built-in mechanism.

After a failure, you should wait a bit (several seconds between retries) before retrying. If you retry too frequently or too quickly, the retry handler will throttle.

## Next steps

- Learn how to [check for pool and node errors](batch-pool-node-error-checking.md).
- Learn how to [check for job and task errors](batch-job-task-error-checking.md).
- Review the list of [Batch Status and Error Codes](https://docs.microsoft.com/rest/api/batchservice/batch-status-and-error-codes).
