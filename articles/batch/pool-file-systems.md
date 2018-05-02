---
title: File system options for Azure Batch pools | Microsoft Docs
description: XXX
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
ms.date: 04/30/2018
ms.author: danlep
ms.custom: 

---
# Use an Azure Files share with a pool

[Azure Files](../storage/files/storage-files-introduction.md) offers fully managed file shares in the cloud that are accessible via the Server Message Block (SMB) protocol. Azure Files is based on Azure blob storage. 

Why should I choose this - legacy apps might expect a file share. Convenient for scenarios where I need to share a set of input or output files across multiple jobs or tasks.


## Considerations for use with Batch

* Azure file shares are very [cost-efficient](https://azure.microsoft.com/pricing/details/storage/files/) and can be configured with data replication to another region so are globally redundant. 
* [Scale targets](https://azure.microsoft.com/pricing/details/storage/files/) should be reviewed to determine if Azure Files should be used given the forecast pool size and number of asset files.
* See the general [planning considerations](../storage/files/storage-files-planning.md).

[Considerations: for performance reasons, should it be in same region/resource group as the Batch account? Any other considerations?]

## Create a file share

[Create a file share](../storage/files/storage-how-to-create-file-share.md) in a storage account that is linked to your Batch account, or in a separate storage account.




## Mount a share on a Windows pool

For background, see the [documentation](../storage/files/storage-how-to-use-files-windows.md) covering how to mount an Azure file share.

To use in Batch, a mount operation needs to be performed each time a task is run on a Windows node. Currently, it is not possible to persist the network connection between tasks.

For example, you can include a `net use` command to mount the file share as part of each task command line. To mount the file share, you need to provide the following credentials:

* User name: AZURE\\<yourstorageaccountname>, for example, AZURE\\*mystorageaccountname*
* Password <YourStorageAccountKeyWhichEnds in==>, for example, *XXXXXXXXXXXXXXXXXXXXX==*


To simplify the mount operation, persist the credentials on the node so that you can mount the share without credentials. The easiest way to do this is to perform two steps:

1. Run the `cmdkey` command-line utility using a start task in the pool configuration. This persists the credentials on the Windows node. The start task command line is similar to:

  ```
  cmd /c "cmdkey /add:<yourstorageaccountname>.file.core.windows.net /user:AZURE\mystorageaccountname /pass:XXXXXXXXXXXXXXXXXXXXX=="

  ```
2. Then, mount the share on each node as part of each task using `net use`. For example, the following task command line mounts the file share as the S: drive and then lists the files in the directory. Cached credentials are used in the call to `net use`. In your Batch workload, substitute your own command or script for `dir`:

  ```
  cmd /c "net use S:
  \\mystorageaccountname.file.core.windows.net\yourshare /user:AZURE\mystorageaccountname XXXXXXXXXXXXXXXXXXXXX== & dir S:\"
  ```

<Add .NET code example>

## Mount a share on a Linux pool

Azure file shares can be mounted in Linux distributions using the [CIFS kernel client](https://wiki.samba.org/index.php/LinuxCIFS). For prerequisites and steps to mount an Azure file share on different distributions, see [Use Azure Files with Linux](../storage/files/storage-how-to-use-files-linux). The following example shows how to mount a file share on a pool of Ubuntu 16.04 LTS compute nodes. 

First, install the `cifs-utils` package using a start task in the pool configuration. It's also convenient to create the mount point in the start task:

```
sudo apt-get update && sudo apt-get install cifs-utils && sudo mkdir -p /mnt/MyAzureFileShare
```

Then, run a `mount` command to mount the file share, providing the following credentials:

* User name: <yourstorageaccountname>, for example, *mystorageaccountname*
* Password <YourStorageAccountKeyWhichEnds in==>, for example, *XXXXXXXXXXXXXXXXXXXXX==*

For example, the following command mounts the file share at */mnt/MyAzureFileShare* (this mount point was previously created) and then lists the files in the share. In your Batch workload, substitute your command for `ls`:

```
sudo mount -t cifs //mystorageaccountname.file.core.windows.net/myfileshare /mnt/MyAzureFileShare -o vers=3.0,username=mystorageaccountname,password=XXXXXXXXXXXXXXXXXXXXX==,dir_mode=0777,file_mode=0777,serverino && ls /mnt/MyAzureFileShare
```

On a Linux pool you can perform all of these steps to create a mount point and mount the share in a single start task on the pool. Use a start task command line similar to:

```
/bin/bash -c "sudo apt-get update && 
sudo apt-get install cifs-utils && 
sudo mkdir -p /mnt/MyAzureFileShare && 
sudo mount -t cifs //mystorageaccountname.file.core.windows.net/myfileshare /mnt/MyAzureFileShare -o vers=3.0,username=mystorageaccountname,password=XXXXXXXXXXXXXXXXXXXXX==,dir_mode=0777,file_mode=0777,serverino"

```
Set your start task to wait to complete successfully before running further tasks on the pool that reference the share.

The following Python example shows how to configure a Linux pool to mount the share in a start task. The mount point, file share endpoint, and storage credentials are passed as defined constants:

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

After mounting the share and defining a job, you can reference the share in your task command lines to read or write data. For example, the following command lists files in the file share:

```python
...
task=batch.models.TaskAddParameter(
    id='mytask',
    command_line="/bin/bash -c \"ls {}\"".format(_COMPUTE_NODE_MOUNT_POINT)
)
batch_service_client.task.add(job_id, task)
```


 





