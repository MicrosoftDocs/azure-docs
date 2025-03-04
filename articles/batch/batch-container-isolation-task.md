---
title: Configure container isolation in Azure Batch task
description: Learn how to configure isolation at task level in Azure Batch.
ms.topic: how-to
ms.date: 12/02/2024
ms.devlang: csharp
ms.custom: batch
---

# Batch Container Isolation Task

Azure Batch offers an isolation configuration at the task level, allowing tasks to avoid mounting the entire ephemeral disk or the entire `AZ_BATCH_NODE_ROOT_DIR`. Instead, you can customize the specific Azure Batch data paths you want to attach to the container task.

> [!Note]
> **Azure Batch Data Path** refers to the specific paths on an Azure Batch node designated for tasks and applications. All these paths are located under `AZ_BATCH_NODE_ROOT_DIR`.

## Why we need isolation feature in container task

In a Windows container task workload, the entire ephemeral disk (D:) is attached to the task's container. For a Linux container task workload, Azure Batch attaches the entire `AZ_BATCH_NODE_ROOT_DIR` to the task's container, both in ReadWrite mode. However, if you want to customize your container volumes, this setup may cause some data to be shared across all containers running on the node. To address the same, we support the ability to customize the Azure Batch data paths that you want to attach to the task container.

- **Security**: Prevents the container task data from leaking into the host machine or altering data on the host machine.
- **Customize**: You can customize your container task volumes as needed.

> [!Note]
> To use this feature, please ensure that your node agent version is greater than 1.11.11.

## Configuring host data path attachments for containers

* For Linux node: We can just attach the same path into container.
* For Windows node: Since Windows containers don't have a D: disk, we need to mount the path. Refer to the listed paths that you can choose to mount.

| Azure Batch Data Path | Path in Host Machine | Path in Container  |
|-----------------------------------|--------------------------------------------------------------------------|--------------|
|**AZ_BATCH_APP_PACKAGE_**| D:\\batch\\tasks\\applications  | C:\\batch\\tasks\\applications | 
|**AZ_BATCH_NODE_SHARED_DIR**| D:\\batch\\tasks\\shared  | C:\\batch\\tasks\\shared |
|**AZ_BATCH_NODE_STARTUP_DIR**| D:\\batch\\tasks\\startup  | C:\\batch\\tasks\\startup |
|**AZ_BATCH_NODE_MOUNTS_DIR**|D:\\batch\\tasks\\fsmounts|C:\\batch\\tasks\\fsmounts|
|**AZ_BATCH_NODE_STARTUP_WORKING_DIR**| D:\\batch\\tasks\\startup\\wd  | C:\\batch\\tasks\\startup\\wd |
|**AZ_BATCH_JOB_PREP_DIR** | C:\\batch\\tasks\\workitems\\{workitemname}\\{jobname}\\{jobpreptaskname} | D:\\batch\tasks\workitems\\{workitemname}\\{jobname}\\{jobpreptaskname} |
|**AZ_BATCH_JOB_PREP_WORKING_DIR** | C:\\batch\\tasks\\workitems\\{workitemname}\\{jobname}\\{jobpreptaskname}\\wd  | D:\\batch\tasks\workitems\\{workitemname}\\{jobname}\\{jobpreptaskname}\\wd |
|**AZ_BATCH_TASK_DIR**| D:\\batch\\tasks\\workitems\\{workitemname}\\{jobname}\\{taskname} | C:\batch\tasks\workitems\\{workitemname}\\{jobname}\\{taskname} |
|**AZ_BATCH_TASK_WORKING_DIR** | D:\\batch\\tasks\\workitems\\{workitemname}\\{jobname}\\{taskname}\\wd | C:\\batch\\tasks\\workitems\\{workitemname}\\{jobname}\\{taskname}\\wd |


Refer to the listed data paths that you can choose to attach to the container. Any unselected data paths have their associated environment variables removed.

|Data Path Enum|Data Path with be attached to container|
|:--------:|------------|
|**Shared**| AZ_BATCH_NODE_SHARED_DIR |
|**Applications**| AZ_BATCH_APP_PACKAGE_* |
|**Startup**| AZ_BATCH_NODE_STARTUP_DIR, AZ_BATCH_NODE_STARTUP_WORKING_DIR |
|**Vfsmounts**|AZ_BATCH_NODE_MOUNTS_DIR|
|**JobPrep**| AZ_BATCH_JOB_PREP_DIR, AZ_BATCH_JOB_PREP_WORKING_DIR |
|**Task**| AZ_BATCH_TASK_DIR, AZ_BATCH_TASK_WORKING_DIR |

## Run a container isolation task

> [!Note]
> * If you use an empty list, the NodeAgent will not mount any data paths into the task's container. If you use null, the NodeAgent will mount the entire ephemeral disk (in Windows) or `AZ_BATCH_NODE_ROOT_DIR` (in Linux).
> * If you don't mount the task data path into the container, you must set the task's property [workingDirectory](/rest/api/batchservice/task/add?tabs=HTTP#containerworkingdirectory) to containerImageDefault.

Before running a container isolation task, you must create a pool with a container. For more information on how to create it, see this guide [Docker container workload](batch-docker-container-workloads.md).

# [REST API](#tab/restapi)

The following example describes how to create a container task with data isolation using REST API:
```http
POST {batchUrl}/jobs/{jobId}/tasks?api-version=2024-07-01.20.0
```

```json
{
    "id": "taskId",
    "commandLine": "bash -c 'echo hello'",
    "containerSettings": {
        "imageName": "ubuntu",
        "containerHostBatchBindMounts": [
            {
            "source": "Task",
            "isReadOnly": true
            }
        ]
    },
    "userIdentity": {
        "autoUser": {
            "scope": "task",
            "elevationLevel": "nonadmin"
        }
    }
}
```

# [SDK / C#](#tab/csharp)

The following code snippet shows an example of how to use the [Batch .NET](https://www.nuget.org/packages/Microsoft.Azure.Batch/) client library to create a container data isolation task using C#. For more details about Batch .NET, see the [reference documentation](/dotnet/api/microsoft.azure.batch).

```csharp
private async Task CreateExampleContainerIsolationTask(BatchServiceClient client, string jobId)
{
    var containerIsolationTask = new CloudTask("test-container-isolation", "printenv")
    {
        ContainerSettings = new TaskContainerSettings("docker.io/ubuntu:22.04")
        {
            ContainerHostBatchBindMounts = new List<ContainerHostBatchBindMountEntry>()
            {
                new()
                {
                    Source = Microsoft.Azure.Batch.Protocol.Models.ContainerHostDataPath.Task,
                }
            }
        }
    };
    await client.JobOperations.AddTaskAsync(jobId, containerIsolationTask);
}
```
