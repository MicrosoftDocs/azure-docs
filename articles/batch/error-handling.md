---
title: Error handling and detection in Azure Batch
description: Learn about error handling in Batch service workflows from a development standpoint.
ms.topic: article
ms.date: 04/13/2023
---

# Error handling and detection in Azure Batch

At times, you might need to handle task and application failures in your Azure Batch solution. This article explains different types of Batch errors, and how to resolve common problems.

## Error codes

Some general types of errors that you might see in Batch are:

- Networking failures for requests that never reached Batch, or networking failures when the Batch response didn't reach the client in time.
- Internal server errors. These errors have a standard `5xx` status code HTTP response.
- Throttling-related errors. These errors include `429` or `503` status code HTTP responses with the `Retry-after` header.
- `4xx` errors such as `AlreadyExists` and `InvalidOperation`. These errors indicate that the resource isn't in the correct state for the state transition.

For detailed information about specific error codes, see [Batch status and error codes](/rest/api/batchservice/batch-status-and-error-codes). This reference includes error codes for REST API, Batch service, and for job tasks and scheduling.

## Application failures

During execution, an application might produce diagnostic output. You can use this output to troubleshoot issues. The Batch service writes standard output and standard error output to the *stdout.txt* and *stderr.txt* files in the task directory on the compute node. For more information, see [Files and directories in Batch](files-and-directories.md).

To download these output files, use the Azure portal or one of the Batch SDKs. For example, to retrieve files for troubleshooting purposes, use [ComputeNode.GetNodeFile](/dotnet/api/microsoft.azure.batch.computenode) and [CloudTask.GetNodeFile](/dotnet/api/microsoft.azure.batch.cloudtask) in the Batch .NET library.

## Task errors

Task errors fall into several categories.

### Pre-processing errors

If a task fails to start, a pre-processing error is set for the task. Pre-processing errors can occur if:

- The task's resource files have moved.
- The storage account is no longer available.
- Another issue happened that prevented the successful copying of files to the node.

### File upload errors

If files that you specified for a task fail to upload for any reason, a file upload error is set for the task. File upload errors can occur if: 

- The shared access signature (SAS) token supplied for accessing Azure Storage is invalid.
- The SAS token doesn't provide write permissions.
- The storage account is no longer available.
- Another issue happened that prevented the successful copying of files from the node.

### Application errors

The process specified by the task's command line can also fail. For more information, see [Task exit codes](#task-exit-codes).

For application errors, configure Batch to automatically retry the task up to a specified number of times.

### Constraint errors

To specify the maximum execution duration for a job or task, set the `maxWallClockTime` constraint. Use this setting to terminate tasks that fail to progress.

When the task exceeds the maximum time:

- The task is marked as *completed*.
- The exit code is set to `0xC000013A`.
- The **schedulingError** field is marked as `{ category:"ServerError", code="TaskEnded"}`.

## Task exit codes

When a task executes a process, Batch populates the task's exit code property with the return code of the process. If the process returns a nonzero exit code, the Batch service marks the task as failed.

The Batch service doesn't determine a task's exit code. The process itself, or the operating system on which the process executes, determines the exit code.

## Task failures or interruptions

Tasks might occasionally fail or be interrupted. For example:

- The task application itself might fail.
- The node on which the task is running might reboot.
- A resize operation might remove the node from the pool. This action might happen if the pool's deallocation policy removes nodes immediately without waiting for tasks to finish. 

In all cases, Batch can automatically requeue the task for execution on another node.

It's also possible for an intermittent issue to cause a task to stop responding or take too long to execute. You can set a maximum execution interval for a task. If a task exceeds the interval, the Batch service interrupts the task application.

## Connect to compute nodes

You can perform debugging and troubleshooting by signing in to a compute node remotely. Use the Azure portal to download a Remote Desktop Protocol (RDP) file for Windows nodes, and obtain Secure Shell (SSH) connection information for Linux nodes. You can also download this information using the [Batch .NET](/dotnet/api/microsoft.azure.batch.computenode) or [Batch Python](batch-linux-nodes.md#connect-to-linux-nodes-using-ssh) APIs.

To connect to a node via RDP or SSH, first create a user on the node. Use one of the following methods:

- The [Azure portal](https://portal.azure.com)
- Batch REST API: [adduser](/rest/api/batchservice/computenode/adduser)
- Batch .NET API: [ComputeNode.CreateComputeNodeUser](/dotnet/api/microsoft.azure.batch.computenode)
- Batch Python module: [add_user](batch-linux-nodes.md#connect-to-linux-nodes-using-ssh)

If necessary, [configure or disable access to compute nodes](pool-endpoint-configuration.md).

## Troubleshoot problem nodes

Your Batch client application or service can examine the metadata of failed tasks to identify a problem node. Each node in a pool has a unique ID. Task metadata includes the node where a task runs. After you find the problem node, try the following methods to resolve the failure.

### Reboot node

Restarting a node sometimes fixes latent issues, such as stuck or crashed processes. If your pool uses a start task, or your job uses a job preparation task, a node restart executes these tasks.

- Batch REST API: [reboot](/rest/api/batchservice/computenode/reboot)
- Batch .NET API: [ComputeNode.Reboot](/dotnet/api/microsoft.azure.batch.computenode.reboot)

### Reimage node

Reimaging a node reinstalls the operating system. Start tasks and job preparation tasks rerun after the reimaging happens.

- Batch REST API: [reimage](/rest/api/batchservice/computenode/reimage)
- Batch .NET API: [ComputeNode.Reimage](/dotnet/api/microsoft.azure.batch.computenode.reimage)

### Remove node from pool

Removing the node from the pool is sometimes necessary. 

- Batch REST API: [removenodes](/rest/api/batchservice/pool/remove-nodes)
- Batch .NET API: [PoolOperations](/dotnet/api/microsoft.azure.batch.pooloperations)

### Disable task scheduling on node

Disabling task scheduling on a node effectively takes the node offline. Batch assigns no further tasks to the node. However, the node continues running in the pool. You can then further investigate the failures without losing the failed task's data. The node also won't cause more task failures. 

For example, disable task scheduling on the node. Then, sign in to the node remotely. Examine the event logs, and do other troubleshooting. After you solve the problems, enable task scheduling again to bring the node back online. 

- Batch REST API: [enablescheduling](/rest/api/batchservice/computenode/enablescheduling)
- Batch .NET API: [ComputeNode.EnableScheduling](/dotnet/api/microsoft.azure.batch.computenode.enablescheduling)

You can use these actions to specify Batch handles tasks currently running on the node. For example, when you disable task scheduling with the Batch .NET API, you can specify an enum value for [DisableComputeNodeSchedulingOption](/dotnet/api/microsoft.azure.batch.common.disablecomputenodeschedulingoption). You can choose to:

- Terminate running tasks: `Terminate`
- Requeue tasks for scheduling on other nodes: `Requeue`
- Allow running tasks to complete before performing the action: `TaskCompletion`

## Retry after errors

The Batch APIs notify you about failures. You can retry all APIs using the built-in global retry handler. It's a best practice to use this option. 

After a failure, wait several seconds before retrying. If you retry too frequently or too quickly, the retry handler throttles requests.

## Next steps

- [Check for Batch pool and node errors](batch-pool-node-error-checking.md)
- [Check for Batch job and task errors](batch-job-task-error-checking.md)
