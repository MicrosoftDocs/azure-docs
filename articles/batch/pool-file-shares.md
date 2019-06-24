---
title: Azure file share for Azure Batch pools | Microsoft Docs
description: How to mount an Azure Files share from compute nodes in a Linux or Windows pool in Azure Batch.
services: batch
documentationcenter: ''
author: laurenhughes
manager: jeconnoc
editor: ''

ms.assetid: 
ms.service: batch
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: big-compute
ms.date: 05/24/2018
ms.author: lahugh
ms.custom: 
---

# Use an Azure file share with a Batch pool

[Azure Files](../storage/files/storage-files-introduction.md) offers fully managed file shares in the cloud that are accessible via the Server Message Block (SMB) protocol. This article provides information and code examples for mounting and using an Azure file share on pool compute nodes. The code examples use the Batch .NET and Python SDKs, but you can perform similar operations using other Batch SDKs and tools.

Batch provides native API support for using Azure Storage blobs to read and write data. However, in some cases you might want to access an Azure file share from your pool compute nodes. For example, you have a legacy workload that depends on an SMB file share, or your tasks need to access shared data or produce shared output. 

## Considerations for use with Batch

* Consider using an Azure file share when you have pools that run a relatively low number of parallel tasks. Review the [performance and scale targets](../storage/files/storage-files-scale-targets.md) to determine if Azure Files (which uses an Azure Storage account) should be used, given your expected pool size and number of asset files. 

* Azure file shares are [cost-efficient](https://azure.microsoft.com/pricing/details/storage/files/) and can be configured with data replication to another region so are globally redundant. 

* You can mount an Azure file share concurrently from an on-premises computer.

* See also the general [planning considerations](../storage/files/storage-files-planning.md) for Azure file shares.


## Create a file share

[Create a file share](../storage/files/storage-how-to-create-file-share.md) in a storage account that is linked to your Batch account, or in a separate storage account.

## Mount a share on a Windows pool

This section provides steps and code examples to mount and use an Azure file share on a pool of Windows nodes. For additional background, see the [documentation](../storage/files/storage-how-to-use-files-windows.md) for mounting an Azure file share on Windows. 

In Batch, you need to mount the share each time a task is run on a Windows node. Currently, it's not possible to persist the network connection between tasks on Windows nodes.

For example, include a `net use` command to mount the file share as part of each task command line. To mount the file share, the following credentials are needed:

* **User name**: AZURE\\\<storageaccountname\>, for example, AZURE\\*mystorageaccountname*
* **Password**: <StorageAccountKeyWhichEnds in==>, for example, *XXXXXXXXXXXXXXXXXXXXX==*

The following command mounts a file share *myfileshare* in storage account *mystorageaccountname* as the *S:* drive:

```
net use S: \\mystorageaccountname.file.core.windows.net\myfileshare /user:AZURE\mystorageaccountname XXXXXXXXXXXXXXXXXXXXX==
```

For simplicity, the examples here pass the credentials directly in text. In practice, we strongly recommend managing the credentials using environment variables, certificates, or a solution such as Azure Key Vault.

To simplify the mount operation, optionally persist the credentials on the nodes. Then, you can mount the share without credentials. Perform the following two steps:

1. Run the `cmdkey` command-line utility using a start task in the pool configuration. This persists the credentials on each Windows node. The start task command line is similar to:

   ```
   cmd /c "cmdkey /add:mystorageaccountname.file.core.windows.net /user:AZURE\mystorageaccountname /pass:XXXXXXXXXXXXXXXXXXXXX=="

   ```

2. Mount the share on each node as part of each task using `net use`. For example, the following task command line mounts the file share as the *S:* drive. This would be followed by a command or script that references the share. Cached credentials are used in the call to `net use`. This step assumes you are using the same user identity for the tasks that you used in the start task on the pool, which isn't appropriate for all scenarios.

   ```
   cmd /c "net use S: \\mystorageaccountname.file.core.windows.net\myfileshare" 
   ```

### C# example
The following C# example shows how to persist the credentials on a Windows pool using a start task. The storage file service name and storage credentials are passed as defined constants. Here, the start task runs under a standard (non-administrator) auto-user account with pool scope.

```csharp
...
CloudPool pool = batchClient.PoolOperations.CreatePool(
    poolId: PoolId,
    targetDedicatedComputeNodes: PoolNodeCount,
    virtualMachineSize: PoolVMSize,
    virtualMachineConfiguration: virtualMachineConfiguration);

// Start task to store credentials to mount file share
string startTaskCommandLine = String.Format("cmd /c \"cmdkey /add:{0} /user:AZURE\\{1} /pass:{2}\"", StorageFileService, StorageAccountName, StorageAccountKey);

pool.StartTask = new StartTask
{
    CommandLine = startTaskCommandLine,
    UserIdentity = new UserIdentity(new AutoUserSpecification(
        elevationLevel: ElevationLevel.NonAdmin, 
        scope: AutoUserScope.Pool))
};

pool.Commit();
```

After storing the credentials, use your task command lines to mount the share and reference the share in read or write operations. As a basic example, the task command line in the following snippet uses the `dir` command to list files in the file share. Make sure to run each job task using the same [user identity](batch-user-accounts.md) you used to run the start task in the pool. 

```csharp
...
string taskId = "myTask";
string taskCommandLine = String.Format("cmd /c \"net use {0} {1} & dir {2}\"", ShareMountPoint, StorageFileShare, ShareMountPoint);

CloudTask task = new CloudTask(taskId, taskCommandLine);
task.UserIdentity = new UserIdentity(new AutoUserSpecification(
    elevationLevel: ElevationLevel.NonAdmin,
    scope: AutoUserScope.Pool));
tasks.Add(task);
```

## Mount a share on a Linux pool

Azure file shares can be mounted in Linux distributions using the [CIFS kernel client](https://wiki.samba.org/index.php/LinuxCIFS). The following example shows how to mount a file share on a pool of Ubuntu 16.04 LTS compute nodes. If you use a different Linux distribution, the general steps are similar, but use the package manager appropriate for the distribution. For details and additional examples, see [Use Azure Files with Linux](../storage/files/storage-how-to-use-files-linux.md).

First, under an administrator user identity, install the `cifs-utils` package, and create the mount point (for example, */mnt/MyAzureFileShare*) in the local filesystem. A folder for a mount point can be created anywhere on the file system, but it's common convention to create this under the `/mnt` folder. Be sure not to create a mount point directly at `/mnt` (on Ubuntu) or `/mnt/resource` (on other distributions).

```
apt-get update && apt-get install cifs-utils && sudo mkdir -p /mnt/MyAzureFileShare
```

Then, run the `mount` command to mount the file share, providing these credentials:

* **User name**: \<storageaccountname\>, for example, *mystorageaccountname*
* **Password**: <StorageAccountKeyWhichEnds in==>, for example, *XXXXXXXXXXXXXXXXXXXXX==*

The following command mounts a file share *myfileshare* in storage account *mystorageaccountname* at */mnt/MyAzureFileShare*: 

```
mount -t cifs //mystorageaccountname.file.core.windows.net/myfileshare /mnt/MyAzureFileShare -o vers=3.0,username=mystorageaccountname,password=XXXXXXXXXXXXXXXXXXXXX==,dir_mode=0777,file_mode=0777,serverino && ls /mnt/MyAzureFileShare
```

For simplicity, the examples here pass the credentials directly in text. In practice, we strongly recommend managing the credentials using environment variables, certificates, or a solution such as Azure Key Vault.

On a Linux pool, you can combine all of these steps in a single start task, or run them in a script. Run the start task as an administrator user on the pool. Set your start task to wait to complete successfully before running further tasks on the pool that reference the share.

### Python example

The following Python example shows how to configure an Ubuntu pool to mount the share in a start task. The mount point, file share endpoint, and storage credentials are passed as defined constants. The start task runs under an administrator auto-user account with pool scope.

```python
pool = batch.models.PoolAddParameter(
    id=pool_id,
    virtual_machine_configuration=batchmodels.VirtualMachineConfiguration(
        image_reference=batchmodels.ImageReference(
            publisher="Canonical",
            offer="UbuntuServer",
            sku="16.04.0-LTS",
            version="latest"),
        node_agent_sku_id="batch.node.ubuntu 16.04"),
    vm_size=_POOL_VM_SIZE,
    target_dedicated_nodes=_POOL_NODE_COUNT,
    start_task=batchmodels.StartTask(
        command_line="/bin/bash -c \"apt-get update && apt-get install cifs-utils && mkdir -p {} && mount -t cifs {} {} -o vers=3.0,username={},password={},dir_mode=0777,file_mode=0777,serverino\"".format(
            _COMPUTE_NODE_MOUNT_POINT, _STORAGE_ACCOUNT_SHARE_ENDPOINT, _COMPUTE_NODE_MOUNT_POINT, _STORAGE_ACCOUNT_NAME, _STORAGE_ACCOUNT_KEY),
        wait_for_success=True,
        user_identity=batchmodels.UserIdentity(
            auto_user=batchmodels.AutoUserSpecification(
                scope=batchmodels.AutoUserScope.pool,
                elevation_level=batchmodels.ElevationLevel.admin)),
    )
)
batch_service_client.pool.add(pool)
```

After mounting the share and defining a job, use the share in your task command lines. For example, the following basic command uses `ls` to list files in the file share.

```python
...
task = batch.models.TaskAddParameter(
    id='mytask',
    command_line="/bin/bash -c \"ls {}\"".format(_COMPUTE_NODE_MOUNT_POINT))

batch_service_client.task.add(job_id, task)
```


## Next steps

* For other options to read and write data in Batch, see the [Batch feature overview](batch-api-basics.md) and [Persist job and task output](batch-task-output.md).

* See also the [Batch Shipyard](https://github.com/Azure/batch-shipyard) toolkit, which includes [Shipyard recipes](https://github.com/Azure/batch-shipyard/tree/master/recipes) to deploy file systems for Batch container workloads.