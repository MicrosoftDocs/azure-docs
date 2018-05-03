---
title: Azure file share for Azure Batch pools | Microsoft Docs
description: How to set up an Azure file share to be accessed from a Linux or Windows pool in Azure Batch.
services: batch
documentationcenter: ''
author: dlepow
manager: jeconnoc
editor: ''

ms.assetid: 
ms.service: batch
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: big-compute
ms.date: 05/02/2018
ms.author: danlep
ms.custom: 

---
# Use an Azure file share with a Batch pool

[Azure Files](../storage/files/storage-files-introduction.md) offers fully managed file shares in the cloud that are accessible via the Server Message Block (SMB) protocol. Azure Files is based on Azure blob storage. 

For certain Batch solutions you might want to mount an Azure file share to your pool compute nodes. You might be running a legacy workload that depends on an SMB file share, or you might be running job tasks that need to access shared data or produce shared output.

## Considerations for use with Batch

* Consider using an Azure file share when you have pools that run a relatively low number of parallel tasks. Review the [performance and scale targets](../storage/files/storage-files-scale-targets.md) to determine if Azure Files should be used given the forecast pool size and number of asset files. 

* Azure file shares are [cost-efficient](https://azure.microsoft.com/pricing/details/storage/files/) and can be configured with data replication to another region so are globally redundant. 

* See also the general [planning considerations](../storage/files/storage-files-planning.md).



## Create a file share

[Create a file share](../storage/files/storage-how-to-create-file-share.md) in a storage account that is linked to your Batch account, or in a separate storage account.


## Mount a share on a Windows pool

This section provides steps and C Sharp code examples to mount and use an Azure file share on a pool of Windows nodes. For additional background, see the [documentation](../storage/files/storage-how-to-use-files-windows.md) covering how to mount an Azure file share on Windows. 

In Batch, you need to mount the share each time a task is run on a Windows node. Currently, it's not possible to persist the network connection between tasks on Windows nodes.

For example, include a `net use` command to mount the file share as part of each task command line. To mount the file share, the following credentials are needed:

* **User name**: AZURE\\\<storageaccountname\>, for example, AZURE\\*mystorageaccountname*
* **Password**: <StorageAccountKeyWhichEnds in==>, for example, *XXXXXXXXXXXXXXXXXXXXX==*


To simplify the mount operation, persist the credentials on the node so that you can mount the share without credentials. Perform the following two steps:

1. Run the `cmdkey` command-line utility using a start task in the pool configuration. This persists the credentials on each Windows node. The start task command line is similar to:

  ```
  cmd /c "cmdkey /add:mystorageaccountname.file.core.windows.net /user:AZURE\mystorageaccountname /pass:XXXXXXXXXXXXXXXXXXXXX=="

  ```
2. Mount the share on each node as part of each task using `net use`. For example, the following task command line mounts the file share as the S: drive. Cached credentials are used in the call to `net use`. 

  ```
  cmd /c "net use S:
  \\mystorageaccountname.file.core.windows.net\myfileshare /user:AZURE\mystorageaccountname XXXXXXXXXXXXXXXXXXXXX=="
  ```

### C Sharp example
The following C Sharp example shows how to persist the credentials on a Windows pool using a start task. The storage file service name and storage credentials are passed as defined constants. Here, the start task runs under a standard (non-administrator) auto-user account with pool scope. 

```csharp
...
CloudPool pool = batchClient.PoolOperations.CreatePool(
    poolId: PoolId,
    targetDedicatedComputeNodes: PoolNodeCount,
    virtualMachineSize: PoolVMSize,
    virtualMachineConfiguration: virtualMachineConfiguration
    );

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
After storing the credentials, use your task command lines to mount the share and reference the share in  read or write operations. For example, the task command line in the following snippet uses the `dir` command to list files in the file share. In your Batch workload, substitute your command for `dir`. Make sure to run each job task using the same [user identity](batch-user-accounts.md) you used to run the start task in the pool. 

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

Azure file shares can be mounted in Linux distributions using the [CIFS kernel client](https://wiki.samba.org/index.php/LinuxCIFS). For prerequisites and steps to mount an Azure file share on different distributions, see [Use Azure Files with Linux](../storage/files/storage-how-to-use-files-linux). The following example shows how to mount a file share on a pool of Ubuntu 16.04 LTS compute nodes. 

First, install the `cifs-utils` package using a start task in the pool configuration. It's also convenient to create the mount point in the start task:

```
sudo apt-get update && sudo apt-get install cifs-utils && sudo mkdir -p /mnt/MyAzureFileShare
```

Then, run the `mount` command to mount the file share, providing these credentials:

* **User name**: \<storageaccountname\>, for example, *mystorageaccountname*
* **Password**: <StorageAccountKeyWhichEnds in==>, for example, *XXXXXXXXXXXXXXXXXXXXX==*

For example, the following command mounts the file share at */mnt/MyAzureFileShare* (this mount point was previously created). 

```
sudo mount -t cifs //mystorageaccountname.file.core.windows.net/myfileshare /mnt/MyAzureFileShare -o vers=3.0,username=mystorageaccountname,password=XXXXXXXXXXXXXXXXXXXXX==,dir_mode=0777,file_mode=0777,serverino && ls /mnt/MyAzureFileShare
```

On a Linux pool, you combine all of these steps in a single start task on the pool. Use a start task command line similar to:

```
/bin/bash -c "sudo apt-get update && 
sudo apt-get install cifs-utils && 
sudo mkdir -p /mnt/MyAzureFileShare && 
sudo mount -t cifs //mystorageaccountname.file.core.windows.net/myfileshare /mnt/MyAzureFileShare -o vers=3.0,username=mystorageaccountname,password=XXXXXXXXXXXXXXXXXXXXX==,dir_mode=0777,file_mode=0777,serverino"

```
Set your start task to wait to complete successfully before running further tasks on the pool that reference the share.

### Python code sample

The following Python example shows how to configure an Ubuntu pool to mount the share in a start task. The mount point, file share endpoint, and storage credentials are passed as defined constants:

```python
pool = batch.models.PoolAddParameter(
    id=pool_id,
    virtual_machine_configuration=batchmodels.VirtualMachineConfiguration(
        image_reference=batchmodels.ImageReference(
    	        publisher="Canonical",
    	        offer="UbuntuServer",
    	        sku="16.04.0-LTS",
    	        version="latest"
            ),
    node_agent_sku_id="batch.node.ubuntu 16.04"),
    vm_size=_POOL_VM_SIZE,
    target_dedicated_nodes=_POOL_NODE_COUNT,
    start_task=batchmodels.StartTask(
    command_line="/bin/bash -c \"sudo apt-get update && sudo apt-get install cifs-utils && sudo mkdir -p {} && sudo mount -t cifs {} {} -o vers=3.0,username={},password={},dir_mode=0777,file_mode=0777,serverino\"".format(_COMPUTE_NODE_MOUNT_POINT, _STORAGE_ACCOUNT_SHARE_ENDPOINT, _COMPUTE_NODE_MOUNT_POINT, _STORAGE_ACCOUNT_NAME, _STORAGE_ACCOUNT_KEY),
    wait_for_success=True,
    user_identity=batchmodels.UserIdentity(
        auto_user=batchmodels.AutoUserSpecification(
            scope=batchmodels.AutoUserScope.pool,
            elevation_level=batchmodels.ElevationLevel.admin)),
    )
)
batch_service_client.pool.add(pool)
```

After mounting the share and defining a job, use the share in task command lines to read or write data. For example, the following command uses `ls` to list files in the file share. In your Batch workload, substitute your command for `ls`.

```python
...
task=batch.models.TaskAddParameter(
    id='mytask',
    command_line="/bin/bash -c \"ls {}\"".format(_COMPUTE_NODE_MOUNT_POINT)
)
batch_service_client.task.add(job_id, task)
```


## Next steps
...





