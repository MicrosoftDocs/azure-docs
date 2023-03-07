---
title: Mount a virtual file system on a pool
description: Learn how to mount a virtual file system on a Batch pool.
ms.topic: how-to
ms.devlang: csharp
ms.custom: devx-track-csharp
ms.date: 11/11/2021
---

# Mount a virtual file system on a Batch pool

Azure Batch supports mounting cloud storage or an external file system on Windows or Linux compute nodes in your Batch pools. When a compute node joins a pool, the virtual file system is mounted and treated as a local drive on that node. 

You can mount file systems such as: 

- Azure Files
- Azure Blob storage
- Network File System (NFS) including an [Avere vFXT cache](../avere-vfxt/avere-vfxt-overview.md)
- Common Internet File System (CIFS)

In this article, you'll learn how to mount a virtual file system on a pool of compute nodes using the [Batch Management Library for .NET](/dotnet/api/overview/azure/batch).

> [!NOTE]
> Mounting a virtual file system is only supported on Batch pools created on or after August 8, 2019. Batch pools created before that date will not support this feature.

## Benefits of mounting on a pool

Mounting the file system to the pool, instead of letting tasks retrieve their own data from a large data set, makes it easier and more efficient for tasks to access the necessary data.

Consider a scenario with multiple tasks requiring access to a common set of data, like rendering a movie. Each task renders one or more frames at a time from the scene files. By mounting a drive that contains the scene files, it's easier for compute nodes to access shared data.

Additionally, the underlying file system can be chosen and scaled independently based on the performance and scale (throughput and IOPS) required by the number of compute nodes concurrently accessing the data. For example, you can use an [Avere vFXT](../avere-vfxt/avere-vfxt-overview.md) distributed in-memory cache to support large motion picture-scale renders with thousands of concurrent render nodes, accessing source data that is on-premises. Instead, for data that already is in cloud-based Blob storage, [blobfuse](../storage/blobs/storage-how-to-mount-container-linux.md) can be used to mount this data as a local file system. Blobfuse is only available on Linux nodes (excluding Ubuntu 22.04), though [Azure Files](../storage/files/storage-files-introduction.md) provides a similar workflow and is available on both Windows and Linux.

## Mount a virtual file system on a pool  

Mounting a virtual file system on a pool makes the file system available to every compute node in the pool. Configuration for the file system happens when a compute node joins a pool, restarts, or is reimaged.

To mount a file system on a pool, create a `MountConfiguration` object. Choose the object that fits your virtual file system: `AzureBlobFileSystemConfiguration`, `AzureFileShareConfiguration`, `NfsMountConfiguration`, or `CifsMountConfiguration`.

All mount configuration objects need the following base parameters. Some mount configurations have parameters specific to the file system being used, which are discussed in more detail in the code examples.

- **Account name or source**: To mount a virtual file share, you need the name of the storage account or its source.
- **Relative mount path or Source**: The location of the file system mounted on the compute node, relative to the standard `fsmounts` directory accessible on the node via `AZ_BATCH_NODE_MOUNTS_DIR`. The exact location varies depending on the operating system used on the node. For example, the physical location on an Ubuntu node is mapped to `mnt\batch\tasks\fsmounts`. On a CentOS node, the location is mapped to `mnt\resources\batch\tasks\fsmounts`.
- **Mount options or blobfuse options**: These options describe specific parameters for mounting a file system.

Once the `MountConfiguration` object is created, assign the object to the `MountConfigurationList` property when you create the pool. Mounting for the file system happens when a node joins a pool, restarts, or is reimaged.

When the file system is mounted, an environment variable `AZ_BATCH_NODE_MOUNTS_DIR` is created which points to the location of the mounted file systems and log files, which are useful for troubleshooting and debugging. Log files are explained in more detail in the [Diagnose mount errors](#diagnose-mount-errors) section.  

> [!IMPORTANT]
> The maximum number of mounted file systems on a pool is 10. See [Batch service quotas and limits](batch-quota-limit.md#other-limits) for details and other limits.

## Mount Azure file share with PowerShell

You can mount an Azure file share on a Batch pool using [Azure PowerShell](/powershell/) or [Azure Cloud Shell](../cloud-shell/overview.md).

# [Windows](#tab/windows)

1. Sign in to your Azure subscription.

    ```powershell
    Connect-AzAccount -Subscription "<subscription-ID>"
    ```

1. Get the context for your Batch account.
    
    ```powershell
    $context = Get-AzBatchAccount -AccountName <batch-account-name>
    ```

1. Create a Batch pool with the following settings. Replace the sample values with your own information as needed.

    ```powershell
    $fileShareConfig = New-Object -TypeName "Microsoft.Azure.Commands.Batch.Models.PSAzureFileShareConfiguration" -ArgumentList @("<Storage-Account-name>", "https://<Storage-Account-name>.file.core.windows.net/batchfileshare1", "S", "Storage-Account-key")
    
    $mountConfig = New-Object -TypeName "Microsoft.Azure.Commands.Batch.Models.PSMountConfiguration" -ArgumentList @($fileShareConfig)
    
    $imageReference = New-Object -TypeName "Microsoft.Azure.Commands.Batch.Models.PSImageReference" -ArgumentList @("WindowsServer", "MicrosoftWindowsServer", "2016-Datacenter", "latest")
    
    $configuration = New-Object -TypeName "Microsoft.Azure.Commands.Batch.Models.PSVirtualMachineConfiguration" -ArgumentList @($imageReference, "batch.node.windows amd64")
    
    New-AzBatchPool -Id "<Pool-Name>" -VirtualMachineSize "STANDARD_D2_V2" -VirtualMachineConfiguration $configuration -TargetDedicatedComputeNodes 1 -MountConfiguration @($mountConfig) -BatchContext $context
    ```

1. Access the mount files using your drive's direct path. For example:

    ```powershell
    cmd /c "more S:\folder1\out.txt & timeout /t 90 > NULL"
    ```

1. Check that the output file is correct.

1. If you're using Remote Desktop Protocol (RDP) or SSH, add credentials to access the `S` drive directly. The Azure Batch agent only grants access for Azure Batch tasks in Windows. When you connect to the node over RDP, your user account doesn't have automatic access to the mounting drive. 

    Use `cmdkey` to add your credentials. Replace the sample values with your own information.

    ```powershell
    cmdkey /add:"<storage-account-name>.file.core.windows.net" /user:"Azure\<storage-account-name>" /pass:"<storage-account-key>"
    ```

# [Linux](#tab/linux)

1. Sign in to your Azure subscription.

    ```powershell
    Connect-AzAccount -Subscription "<subscription-ID>"
    ```

1. Get the context for your Batch account.

    ```powershell
    $context = Get-AzBatchAccount -AccountName <batch-account-name>
    ```

1. Create a Batch pool with the following settings. Replace the sample values with your own information as needed.

    ```powershell
    $fileShareConfig = New-Object -TypeName "Microsoft.Azure.Commands.Batch.Models.PSAzureFileShareConfiguration" -ArgumentList @("<Storage-Account-name>", https://<Storage-Account-name>.file.core.windows.net/batchfileshare1, "S", "<Storage-Account-key>", "-o vers=3.0,dir_mode=0777,file_mode=0777,sec=ntlmssp")
    
    $mountConfig = New-Object -TypeName "Microsoft.Azure.Commands.Batch.Models.PSMountConfiguration" -ArgumentList @($fileShareConfig)
    
    $imageReference = New-Object -TypeName "Microsoft.Azure.Commands.Batch.Models.PSImageReference" -ArgumentList @("ubuntuserver", "canonical", "20.04-lts", "latest")
    
    $configuration = New-Object -TypeName "Microsoft.Azure.Commands.Batch.Models.PSVirtualMachineConfiguration" -ArgumentList @($imageReference, "batch.node.ubuntu 20.04")
    
    New-AzBatchPool -Id "<Pool-Name>" -VirtualMachineSize "STANDARD_D2_V2" -VirtualMachineConfiguration $configuration -TargetDedicatedComputeNodes 1 -MountConfiguration @($mountConfig) -BatchContext $Context
     
    ```

1. Access the mount files using the environment variable `AZ_BATCH_NODE_MOUNTS_DIR`. For example:

    ```bash
    /bin/bash -c 'more $AZ_BATCH_NODE_MOUNTS_DIR/S/folder1/out.txt; sleep 20s'
    ```

    Optionally, you can also access the mount files using the direct path.

1. Check that the output file is correct.

1. If you're using RDP or SSH, you can manually access the `S` drive directly. Use the path `/mnt/batch/tasks/fsmounts/S`.

---

### Troubleshoot PowerShell mounting

When you mount an Azure file share to a Batch pool with PowerShell or Cloud Shell, you might receive the following error:

```text
Mount Configuration Error | An error was encountered while configuring specified mount(s)
Message: System error (out of memory, cannot fork, no more loop devices)
MountConfigurationPath: S
```

If you receive this error, RDP or SSH to the node to check the related log files. The Batch agent implements mounting differently on Windows and Linux. On Linux, Batch installs the package `cifs-utils`. Then, Batch issues the mount command. On Windows, Batch uses `cmdkey` to add your Batch account credentials. Then, Batch issues the mount command through `net use`. For example:

```powershell
net use S: \\<storage-account-name>.file.core.windows.net\<fileshare> /u:AZURE\<storage-account-name> <storage-account-key>
```

# [Windows](#tab/windows)

1. Connect to the node over RDP.

1. Open the log file, `fshare-S.log`. The file path is `D:\batch\tasks\fsmounts`.

1. Review the error messages. For example:

    ```text
    CMDKEY: Credential added successfully.
    
    System error 86 has occurred.
    
    The specified network password is not correct.
    ```

1. Troubleshoot the problem using [Troubleshoot Azure Files problems in Windows Server Message Block (SMB)](../storage/files/storage-troubleshoot-windows-file-connection-problems.md).

# [Linux](#tab/linux)

1. Connect to the node over SSH.

1. Open the log file, `fshare-S.log`. The file path is `/mnt/batch/tasks/fsmounts`.

1. Review the error messages. For example, `mount error(13): Permission denied`.

1. Troubleshoot the problem using [Troubleshoot Azure Files problems in Linux (SMB)](../storage/files/storage-troubleshoot-linux-file-connection-problems.md).

---

If you can't use RDP or SSH to check the log files on the node, check the Batch logs directly. Use this method for both Windows and Linux logs.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar, enter and select **Batch accounts**.

1. On the **Batch accounts** page, select the account with your Batch pool.

1. On the Batch account page's menu, under **Features**, select **Pools**.

1. Select the pool's name.

1. On the Batch pool page's menu, under **General**, select **Nodes**.

1. Select the node's name.

1. On the **Overview** page for the node, select **Upload batch logs**.

1. In the **Upload batch logs** pane, select your Azure Storage container. Then, select **Pick storage container**.

1. Select and download the log files from the storage container. 

1. Open `agent-debug.log`.

1. Review the error messages. For example: 

    ```text
    ..20210322T113107.448Z.00000000-0000-0000-0000-000000000000.ERROR.agent.mount.filesystems.basefilesystem.basefilesystem.py.run_cmd_persist_output_async.59.2912.MainThread.3580.Mount command failed with exit code: 2, output:
    
    CMDKEY: Credential added successfully.
    
    System error 86 has occurred.
    
    The specified network password is not correct.
    ```

1. Troubleshoot the problem using [Troubleshoot Azure Files problems in Windows (SMB)](../storage/files/storage-troubleshoot-windows-file-connection-problems.md) or [Troubleshoot Azure Files problems in Linux (SMB)](../storage/files/storage-troubleshoot-linux-file-connection-problems.md).

If you're still unable to find the cause of the failure, you can [mount the file share manually with PowerShell](#manually-mount-file-share-with-powershell) instead.

### Manually mount file share with PowerShell

If you're unable to diagnose or fix mounting errors with PowerShell, you can mount the file share manually.

# [Windows](#tab/windows)

1. Create a pool without a mounting configuration. For example:

    ```powershell
    $imageReference = New-Object -TypeName "Microsoft.Azure.Commands.Batch.Models.PSImageReference" -ArgumentList @("WindowsServer", "MicrosoftWindowsServer", "2016-Datacenter", "latest")
    
    $configuration = New-Object -TypeName "Microsoft.Azure.Commands.Batch.Models.PSVirtualMachineConfiguration" -ArgumentList @($imageReference, "batch.node.windows amd64")
    
    New-AzBatchPool -Id "<Pool-Name>" -VirtualMachineSize "STANDARD_D2_V2" -VirtualMachineConfiguration $configuration -TargetDedicatedComputeNodes 1  -BatchContext $Context
    ```

1. Wait for the node to be in the **Idle** state.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar, enter and select **Storage accounts**.

1. Select the name of the storage account with your file share.

1. On the storage account page's menu, under **Data storage**, select **File shares**.

1. On the **File shares** page, select the file share's name.

1. On the file share's **Overview** page, select **Connect**.

1. In the **Connect** pane, select the **Windows** tab.

1. For **Drive letter**, enter the drive you want to use. The default is `Z`.

1. For **Authentication method**, select how you want to connect to the file share.

1. Copy the PowerShell command for mounting the file share.

1. Connect to the node over RDP.

1. Run the command you copied to mount the file share.

1. Note any error messages in the output. Use this information to troubleshoot any networking-related issues.

# [Linux](#tab/linux)


1. Create a pool without a mounting configuration. For example:

    ```bash
    $imageReference = New-Object -TypeName "Microsoft.Azure.Commands.Batch.Models.PSImageReference" -ArgumentList @("ubuntuserver", "canonical", "20.04-lts", "latest")
    
    $configuration = New-Object -TypeName "Microsoft.Azure.Commands.Batch.Models.PSVirtualMachineConfiguration" -ArgumentList @($imageReference, "batch.node.ubuntu 20.04")
    
    New-AzBatchPool -Id "<Pool-Name>" -VirtualMachineSize "STANDARD_D2_V2" -VirtualMachineConfiguration $configuration -TargetDedicatedComputeNodes 1 -BatchContext $Context
    ```

1. Wait for the node to be in the **Idle** state.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar, enter and select **Storage accounts**.

1. Select the name of the storage account with your file share.

1. On the storage account page's menu, under **Data storage**, select **File shares**.

1. On the **File shares** page, select the file share's name.

1. On the file share's **Overview** page, select **Connect**.

1. In the **Connect** pane, select the **Linux** tab.

1. Enter the **Mount point** you want to use.

1. Copy the Linux command for mounting the file share.

1. Connect to the node over SSH.

1. Run the command you copied to mount the file share.

1. Note any error messages in the output. Use this information to troubleshoot any networking-related issues.


---

## Examples

The following code examples demonstrate mounting various file shares to a pool of compute nodes.

### Azure Files share

Azure Files is the standard Azure cloud file system offering. For information about the parameters in the code sample, see [Use an Azure Files share - SMB](../storage/files/storage-how-to-use-files-windows.md) or [Use an Azure Files share with - NFS](../storage/files/storage-files-how-to-create-nfs-shares.md).

```csharp
new PoolAddParameter
{
    Id = poolId,
    MountConfiguration = new[]
    {
        new MountConfiguration
        {
            AzureFileShareConfiguration = new AzureFileShareConfiguration
            {
                AccountName = "{storage-account-name}",
                AzureFileUrl = "https://{storage-account-name}.file.core.windows.net/{file-share-name}",
                AccountKey = "{storage-account-key}",
                RelativeMountPath = "S",
                MountOptions = "-o vers=3.0,dir_mode=0777,file_mode=0777,sec=ntlmssp"
            },
        }
    }
}
```

### Azure Blob container

Another option is to use Azure Blob storage via [blobfuse](../storage/blobs/storage-how-to-mount-container-linux.md). Mounting a blob file system requires an `AccountKey`, `SasKey`, or `Managed Identity` with access to your storage account.

For information on getting these keys, see: 

- [Manage storage account access keys](../storage/common/storage-account-keys-manage.md)
- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../storage/common/storage-sas-overview.md)
- [Configure managed identities in Batch pools](managed-identity-pools.md). 

For more information and tips on using blobfuse, see the [blobfuse project](https://github.com/Azure/azure-storage-fuse).

To get default access to the blobfuse mounted directory, run the task as an **Administrator**. Blobfuse mounts the directory at the user space, and at pool creation it's mounted as root. In Linux, all **Administrator** tasks are root. All options for the FUSE module are described in the [FUSE reference page](https://manpages.ubuntu.com/manpages/xenial/man8/mount.fuse.8.html).

Review the [Troubleshoot FAQ](https://github.com/Azure/azure-storage-fuse/wiki/3.-Troubleshoot-FAQ) for more information and tips on using blobfuse. You can also review [GitHub issues in the blobfuse repository](https://github.com/Azure/azure-storage-fuse/issues) to check on current blobfuse issues and resolutions.

> [!NOTE]
> The example below shows `AccountKey`, `SasKey` and `IdentityReference`, but they are mutually exclusive; only one can be specified.

```csharp
new PoolAddParameter
{
    Id = poolId,
    MountConfiguration = new[]
    {
        new MountConfiguration
        {
            AzureBlobFileSystemConfiguration = new AzureBlobFileSystemConfiguration
            {
                AccountName = "StorageAccountName",
                ContainerName = "containerName",
                AccountKey = "StorageAccountKey",
                SasKey = "SasKey",
                IdentityReference = new ComputeNodeIdentityReference("/subscriptions/SUB/resourceGroups/RG/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity-name"),
                RelativeMountPath = "RelativeMountPath",
                BlobfuseOptions = "-o attr_timeout=240 -o entry_timeout=240 -o negative_timeout=120 "
            },
        }
    }
}
```

> [!TIP]
>If using a managed identity, ensure that the identity has been [assigned to the pool](managed-identity-pools.md) so that it's available on the VM doing the mounting. The identity will need to have the `Storage Blob Data Contributor` role in order to function properly.

### Network File System

Network File Systems (NFS) can be mounted to pool nodes, allowing traditional file systems to be accessed by Azure Batch. This setup can be a single NFS server deployed in the cloud, or an on-premises NFS server accessed over a virtual network. NFS mounts support [Avere vFXT](../avere-vfxt/avere-vfxt-overview.md). Avere vFXT is a distributed in-memory cache solution for data-intensive high-performance computing (HPC) tasks, and other standard NFS-compliant interfaces. For example, [NFS for Azure Blob](../storage/blobs/network-file-system-protocol-support.md) and [NFS for Azure Files](../storage/files/storage-files-how-to-mount-nfs-shares.md).

```csharp
new PoolAddParameter
{
    Id = poolId,
    MountConfiguration = new[]
    {
        new MountConfiguration
        {
            NfsMountConfiguration = new NFSMountConfiguration
            {
                Source = "source",
                RelativeMountPath = "RelativeMountPath",
                MountOptions = "options ver=3.0"
            },
        }
    }
}
```

### Common Internet File System

Mounting [Common Internet File Systems (CIFS)](/windows/desktop/fileio/microsoft-smb-protocol-and-cifs-protocol-overview) to pool nodes is another way to provide access to traditional file systems. CIFS is a file-sharing protocol that provides an open and cross-platform mechanism for requesting network server files and services. CIFS is based on the enhanced version of the [SMB protocol](/windows-server/storage/file-server/file-server-smb-overview), which is for internet and intranet file sharing.

```csharp
new PoolAddParameter
{
    Id = poolId,
    MountConfiguration = new[]
    {
        new MountConfiguration
        {
            CifsMountConfiguration = new CIFSMountConfiguration
            {
                Username = "StorageAccountName",
                RelativeMountPath = "cifsmountpoint",
                Source = "source",
                Password = "StorageAccountKey",
                MountOptions = "-o vers=3.0,dir_mode=0777,file_mode=0777,serverino,domain=MyDomain"
            },
        }
    }
}
```

## Diagnose mount errors

If a mount configuration fails, the compute node in the pool will fail and the node state will be set to `unusable`. To diagnose a mount configuration failure, inspect the [`ComputeNodeError`](/rest/api/batchservice/computenode/get#computenodeerror) property for details on the error.

To get the log files for debugging, use [OutputFiles](batch-task-output-files.md) to upload the `*.log` files. The `*.log` files contain information about the file system mount at the `AZ_BATCH_NODE_MOUNTS_DIR` location. Mount log files have the format: `<type>-<mountDirOrDrive>.log` for each mount. For example, a `cifs` mount at a mount directory named `test` will have a mount log file named: `cifs-test.log`.

## Support matrix

Azure Batch supports the following virtual file system types for node agents produced for their respective publisher and offer.

| OS Type | Azure Files Share | Azure Blob container | NFS mount | CIFS mount |
|---|---|---|---|---|
| Linux | :heavy_check_mark: | :heavy_check_mark:* | :heavy_check_mark: | :heavy_check_mark: |
| Windows | :heavy_check_mark: | :x: | :x: | :x: |

_*Azure Blob container is **not** supported on Ubuntu 22.04_

## Networking requirements

When using virtual file mounts with [Azure Batch pools in a virtual network](batch-virtual-network.md), keep in mind the following requirements and ensure no required traffic is blocked.

- **Azure File shares**:
  - Requires TCP port 445 to be open for traffic to/from the "storage" service tag. For more information, see [Use an Azure file share with Windows](../storage/files/storage-how-to-use-files-windows.md#prerequisites).
- **Azure Blob containers**:
  - Requires TCP port 443 to be open for traffic to/from the "storage" service tag.
  - VMs must have access to https://packages.microsoft.com to download the blobfuse and gpg packages. Depending on your configuration, you might also need access to other URLs to download more packages.
- **Network File System (NFS)**:
  - Requires access to port 2049 (by default; your configuration might have other requirements).
  - VMs must have access to the appropriate package manager to download the `nfs-common` (for Debian or Ubuntu) or `nfs-utils` (for CentOS) package. This URL might vary based on your OS version. Depending on your configuration, you might also need access to other URLs to download other packages.
  - Mounting Azure Blob or Azure Files through NFS might have more networking requirements. For example, you might need compute nodes that share the same subnet of a virtual network as the storage account.
- **Common Internet File System (CIFS)**:
  - Requires access to TCP port 445.
  - VMs must have access to the appropriate package manager(s) to download the `cifs-utils` package. This URL might vary based on your OS version.

## Next steps

- Learn more about mounting an Azure Files share with [Windows](../storage/files/storage-how-to-use-files-windows.md) or [Linux](../storage/files/storage-how-to-use-files-linux.md).
- Learn about using and mounting [blobfuse](https://github.com/Azure/azure-storage-fuse) virtual file systems.
- See [Network File System overview](/windows-server/storage/nfs/nfs-overview) to learn about NFS and its applications.
- See [Microsoft SMB protocol and CIFS protocol overview](/windows/desktop/fileio/microsoft-smb-protocol-and-cifs-protocol-overview) to learn more about CIFS.
