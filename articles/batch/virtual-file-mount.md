---
title: Mount a virtual file system on a pool
description: Learn how to mount different kinds of virtual file systems on Batch pool nodes, and how to troubleshoot mounting issues.
ms.topic: how-to
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-azurepowershell, devx-track-linux
ms.date: 08/22/2023
---

# Mount a virtual file system on a Batch pool

Azure Batch supports mounting cloud storage or an external file system on Windows or Linux compute nodes in Batch pools. When a compute node joins the pool, the virtual file system mounts and acts as a local drive on that node. This article shows you how to mount a virtual file system on a pool of compute nodes by using the [Batch Management Library for .NET](/dotnet/api/overview/azure/batch).

Mounting the file system to the pool makes accessing data easier and more efficient than requiring tasks to get their own data from a large shared data set. Consider a scenario where multiple tasks need access to a common set of data, like rendering a movie. Each task renders one or more frames at once from the scene files. By mounting a drive that contains the scene files, it's easier for each compute node to access the shared data.

Also, you can choose the underlying file system to meet performance, throughout, and input/output operations per second (IOPS) requirements. You can independently scale the file system based on the number of compute nodes that concurrently access the data.

For example, you could use an [Avere vFXT](/azure/avere-vfxt/avere-vfxt-overview) distributed in-memory cache to support large movie-scale renders with thousands of concurrent render nodes that access on-premises source data. Or, for data that's already in cloud-based blob storage, you can use [BlobFuse](/azure/storage/blobs/storage-how-to-mount-container-linux) to mount the data as a local file system. [Azure Files](/azure/storage/files/storage-files-introduction) provides a similar workflow to that of BlobFuse and is available on both Windows and Linux.

## Supported configurations

You can mount the following types of file systems:

- Azure Files
- Azure Blob storage
- Network File System (NFS), including an [Avere vFXT cache](/azure/avere-vfxt/avere-vfxt-overview)
- Common Internet File System (CIFS)

Batch supports the following virtual file system types for node agents that are produced for their respective publisher and offer.

| OS Type | Azure Files share | Azure Blob container | NFS mount | CIFS mount |
|---|---|---|---|---|
| Linux | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| Windows | :heavy_check_mark: | :x: | :x: | :x: |

> [!NOTE]
> Mounting a virtual file system isn't supported on Batch pools created before August 8, 2019.

## Networking requirements

When you use virtual file mounts with Batch pools in a virtual network, keep the following requirements in mind, and ensure that no required traffic is blocked. For more information, see [Batch pools in a virtual network](batch-virtual-network.md).

- **Azure Files shares** require TCP port 445 to be open for traffic to and from the `storage` service tag. For more information, see [Use an Azure file share with Windows](/azure/storage/files/storage-how-to-use-files-windows#prerequisites).

- **Azure Blob containers** require TCP port 443 to be open for traffic to and from the `storage` service tag. Virtual machines (VMs) must have access to `https://packages.microsoft.com` to download the `blobfuse` and `gpg` packages. Depending on your configuration, you might need access to other URLs.

- **Network File System (NFS)** requires access to port 2049 by default. Your configuration might have other requirements. VMs must have access to the appropriate package manager to download the `nfs-common` (for Debian or Ubuntu) or `nfs-utils` (for CentOS) packages. The URL might vary based on your OS version. Depending on your configuration, you might also need access to other URLs.

  Mounting Azure Blob or Azure Files through NFS might have more networking requirements. For example, your compute nodes might need to use the same virtual network subnet as the storage account.

- **Common Internet File System (CIFS)** requires access to TCP port 445. VMs must have access to the appropriate package manager to download the `cifs-utils` package. The URL might vary based on your OS version.

## Mounting configuration and implementation

Mounting a virtual file system on a pool makes the file system available to every compute node in the pool. Configuration for the file system happens when a compute node joins a pool, restarts, or is reimaged.

To mount a file system on a pool, you create a [MountConfiguration](/dotnet/api/microsoft.azure.batch.mountconfiguration) object that matches your virtual file system: `AzureBlobFileSystemConfiguration`, `AzureFileShareConfiguration`, `NfsMountConfiguration`, or `CifsMountConfiguration`.

All mount configuration objects need the following base parameters. Some mount configurations have specific parameters for the particular file system, which the [code examples](#example-mount-configurations) present in more detail.

- **Account name or source** of the storage account.

- **Relative mount path or source**, the location of the file system to mount on the compute node, relative to the standard *\\fsmounts* directory accessible via `AZ_BATCH_NODE_MOUNTS_DIR`.

  The exact *\\fsmounts* directory location varies depending on node OS. For example, the location on an Ubuntu node maps to *mnt\batch\tasks\fsmounts*. On a CentOS node, the location maps to *mnt\resources\batch\tasks\fsmounts*.

- **Mount options or BlobFuse options** that describe specific parameters for mounting a file system.

When you create the pool and the `MountConfiguration` object, you assign the object to the `MountConfigurationList` property. Mounting for the file system happens when a node joins the pool, restarts, or is reimaged.

The Batch agent implements mounting differently on Windows and Linux.

- On Linux, Batch installs the package `cifs-utils`. Then, Batch issues the mount command.

- On Windows, Batch uses `cmdkey` to add your Batch account credentials. Then, Batch issues the mount command through `net use`. For example:

  ```powershell
  net use S: \\<storage-account-name>.file.core.windows.net\<fileshare> /u:AZURE\<storage-account-name> <storage-account-key>
  ```

Mounting the file system creates an environment variable `AZ_BATCH_NODE_MOUNTS_DIR`, which points to the location of the mounted file system and log files. You can use the log files for troubleshooting and debugging.

## Mount an Azure Files share with PowerShell

You can use [Azure PowerShell](/powershell/) to mount an Azure Files share on a Windows or Linux Batch pool. The following procedure walks you through configuring and mounting an Azure file share file system on a Batch pool.

> [!IMPORTANT]
> The maximum number of mounted file systems on a pool is 10. For details and other limits, see [Batch service quotas and limits](batch-quota-limit.md#other-limits).

### Prerequisites

- An Azure account with an active subscription.
- [Azure PowerShell](/powershell/azure/install-azure-powershell) installed, or use [Azure Cloud Shell](https://shell.azure.com) and select **PowerShell** for the interface.
- An existing Batch account with a linked Azure Storage account that has a file share.

# [Windows](#tab/windows)

1. Sign in to your Azure subscription, replacing the placeholder with your subscription ID.

    ```powershell-interactive
    Connect-AzAccount -Subscription "<subscription-ID>"
    ```

1. Get the context for your Batch account. Replace the `<batch-account-name>` placeholder with your Batch account name.

    ```powershell-interactive
    $context = Get-AzBatchAccount -AccountName <batch-account-name>
    ```

1. Create a Batch pool with the following settings. Replace the `<storage-account-name>` , `<storage-account-key>`, and `<file-share-name>` placeholders with the values from the storage account that's linked to your Batch account. Replace the `<pool-name>` placeholder with the name you want for the pool.

    The following script creates a pool with one Windows Server 2016 Datacenter, Standard_D2_V2 size node, and then mounts the Azure file share to the *S* drive of the node.

    ```powershell-interactive
    $fileShareConfig = New-Object -TypeName "Microsoft.Azure.Commands.Batch.Models.PSAzureFileShareConfiguration" -ArgumentList @("<storage-account-name>", "https://<storage-account-name>.file.core.windows.net/batchfileshare1", "S", "<storage-account-key>")

    $mountConfig = New-Object -TypeName "Microsoft.Azure.Commands.Batch.Models.PSMountConfiguration" -ArgumentList @($fileShareConfig)

    $imageReference = New-Object -TypeName "Microsoft.Azure.Commands.Batch.Models.PSImageReference" -ArgumentList @("WindowsServer", "MicrosoftWindowsServer", "2016-Datacenter", "latest")

    $configuration = New-Object -TypeName "Microsoft.Azure.Commands.Batch.Models.PSVirtualMachineConfiguration" -ArgumentList @($imageReference, "batch.node.windows amd64")

    New-AzBatchPool -Id "<pool-name>" -VirtualMachineSize "STANDARD_D2_V2" -VirtualMachineConfiguration $configuration -TargetDedicatedComputeNodes 1 -MountConfiguration @($mountConfig) -BatchContext $context
    ```

1. Connect to the node and check that the output file is correct.

### Access the mounted files

Azure Batch tasks can access the mounted files by using the drive's direct path, for example:

```powershell-interactive
cmd /c "more S:\folder1\out.txt & timeout /t 90 > NULL"
```

The Azure Batch agent grants access only for Azure Batch tasks. If you use Remote Desktop Protocol (RDP) to connect to the node, your user account doesn't have automatic access to the mounting drive. When you connect to the node over RDP, you must add credentials for the storage account to access the *S* drive directly.

Use `cmdkey` to add the credentials. Replace the `<storage-account-name>` and `<storage-account-key`> placeholders with your own information.

```powershell-interactive
cmdkey /add:"<storage-account-name>.file.core.windows.net" /user:"Azure\<storage-account-name>" /pass:"<storage-account-key>"
```

# [Linux](#tab/linux)

1. Sign in to your Azure subscription, replacing the placeholder with your subscription ID.

    ```powershell-interactive
    Connect-AzAccount -Subscription "<subscription-ID>"
    ```

1. Get the context for your Batch account, replacing the placeholder with your Batch account name.

    ```powershell-interactive
    $context = Get-AzBatchAccount -AccountName <batch-account-name>
    ```

1. Create a Batch pool with the following settings. Replace the `<storage-account-name>` , `<storage-account-key>`, and `<file-share-name>` placeholders with the values from the storage account that's linked to your Batch account. Replace the `<pool-name>` placeholder with the name you want for the pool.

    The following script creates a pool with one Ubuntu 20.04, Standard_DS1_v2 size node, and then mounts the Azure file share to the *S* drive of the node.

    ```powershell-interactive
    $fileShareConfig = New-Object -TypeName "Microsoft.Azure.Commands.Batch.Models.PSAzureFileShareConfiguration" -ArgumentList @("<storage-account-name>", https://<storage-account-name>.file.core.windows.net/<file-share-name>, "S", "<storage-account-key>", "-o vers=3.0,dir_mode=0777,file_mode=0777,sec=ntlmssp")

    $mountConfig = New-Object -TypeName "Microsoft.Azure.Commands.Batch.Models.PSMountConfiguration" -ArgumentList @($fileShareConfig)

    $imageReference = New-Object -TypeName "Microsoft.Azure.Commands.Batch.Models.PSImageReference" -ArgumentList @("0001-com-ubuntu-server-focal", "canonical", "20_04-lts", "latest")

    $configuration = New-Object -TypeName "Microsoft.Azure.Commands.Batch.Models.PSVirtualMachineConfiguration" -ArgumentList @($imageReference, "batch.node.ubuntu 20.04")

    New-AzBatchPool -Id "<pool-name>" -VirtualMachineSize "Standard_DS1_v2" -VirtualMachineConfiguration $configuration -TargetDedicatedComputeNodes 1 -MountConfiguration @($mountConfig) -BatchContext $Context
    ```

1. Connect to the node and check that the output file is correct.

### Access the mounted files

You can access the mounted files by using the environment variable `AZ_BATCH_NODE_MOUNTS_DIR`. For example:

```bash
/bin/bash -c 'more $AZ_BATCH_NODE_MOUNTS_DIR/S/folder1/out.txt; sleep 20s'
```

Optionally, you can also access the mount files by using the direct path. If you use SSH to connect to the node, you can manually access the *S* drive directly. Use the path */mnt/batch/tasks/fsmounts/S*.

---

## Troubleshoot mount issues

If a mount configuration fails, the compute node fails and the node state is set to **Unusable**. To diagnose a mount configuration failure, inspect the [ComputeNodeError](/rest/api/batchservice/computenode/get#computenodeerror) property for details on the error.

To get log files for debugging, you can use the [OutputFiles](batch-task-output-files.md#specify-output-files-for-task-output) API to upload the *\*.log* files. The *\*.log* files contain information about the file system mount at the `AZ_BATCH_NODE_MOUNTS_DIR` location. Mount log files have the format: *\<type>-\<mountDirOrDrive>.log* for each mount. For example, a CIFS mount at a mount directory named *test* has a mount log file named: *cifs-test.log*.

### Investigate mounting errors

You can RDP or SSH to the node to check the log files pertaining to filesystem mounts.
The following example error message is possible when you try to mount an Azure file share to a Batch node:

```output
Mount Configuration Error | An error was encountered while configuring specified mount(s)
Message: System error (out of memory, cannot fork, no more loop devices)
MountConfigurationPath: S
```

If you receive this error, RDP or SSH to the node to check the related log files. The Batch agent implements mounting differently on Windows and Linux for Azure file shares. On Linux, Batch installs the package `cifs-utils`. Then, Batch issues the mount command. On Windows, Batch uses `cmdkey` to add your Batch account credentials. Then, Batch issues the mount command through `net use`. For example:

```powershell-interactive
net use S: \\<storage-account-name>.file.core.windows.net\<fileshare> /u:AZURE\<storage-account-name> <storage-account-key>
```

# [Windows](#tab/windows)

1. Connect to the node over RDP.

1. Open the log file *fshare-S.log*, at *D:\batch\tasks\fsmounts*.

1. Review the error messages, for example:

    ```output
    CMDKEY: Credential added successfully.
    System error 86 has occurred.

    The specified network password is not correct.
    ```

1. Troubleshoot the problem by using the [Azure file shares troubleshooter](https://support.microsoft.com/help/4022301/troubleshooter-for-azure-files-shares).

# [Linux](#tab/linux)

1. Connect to the node over SSH.

1. Open the log file *fshare-S.log* at */mnt/batch/tasks/fsmounts*.

1. Review the error messages, for example `mount error(13): Permission denied`.

1. Troubleshoot the problem by using [Troubleshoot Azure Files connectivity and access issues (SMB)](/azure/storage/files/files-troubleshoot-smb-connectivity).

---

If you can't use RDP or SSH to check the log files on the node, you can upload the logs to your Azure storage account. You can use this method for both Windows and Linux logs.

1. In the [Azure portal](https://portal.azure.com), search for and select the Batch account that has your pool.

1. On the Batch account page, select **Pools** from the left navigation.

1. On the **Pools** page, select the pool's name.

1. On the pool's page, select **Nodes** from the left navigation.

1. On the **Nodes** page, select the node's name.

1. On the node's page, select **Upload batch logs**.

1. On the **Upload batch logs** pane, select **Pick storage container**.

1. On the **Storage accounts** page, select a storage account.

1. On the **Containers** page, select or create a container to upload the files to, and select **Select**.

1. Select **Start upload**.

1. When the upload completes, download the files and open *agent-debug.log*.

1. Review the error messages, for example:

    ```output
    ..20210322T113107.448Z.00000000-0000-0000-0000-000000000000.ERROR.agent.mount.filesystems.basefilesystem.basefilesystem.py.run_cmd_persist_output_async.59.2912.MainThread.3580.Mount command failed with exit code: 2, output:

    CMDKEY: Credential added successfully.

    System error 86 has occurred.

    The specified network password is not correct.
    ```

1. Troubleshoot the problem by using the [Azure file shares troubleshooter](https://support.microsoft.com/help/4022301/troubleshooter-for-azure-files-shares).

### Manually mount a file share with PowerShell

If you can't diagnose or fix mounting errors, you can use PowerShell to mount the file share manually instead.

# [Windows](#tab/windows)

1. Create a pool without a mounting configuration. For example:

    ```powershell-interactive
    $imageReference = New-Object -TypeName "Microsoft.Azure.Commands.Batch.Models.PSImageReference" -ArgumentList @("WindowsServer", "MicrosoftWindowsServer", "2016-Datacenter", "latest")

    $configuration = New-Object -TypeName "Microsoft.Azure.Commands.Batch.Models.PSVirtualMachineConfiguration" -ArgumentList @($imageReference, "batch.node.windows amd64")

    New-AzBatchPool -Id "<pool-name>" -VirtualMachineSize "STANDARD_D2_V2" -VirtualMachineConfiguration $configuration -TargetDedicatedComputeNodes 1  -BatchContext $Context
    ```

1. Wait for the node to be in the **Idle** state.

1. In the [Azure portal](https://portal.azure.com), search for and select the storage account that has your file share.

1. On the storage account page's menu, select **File shares** from the left navigation.

1. On the **File shares** page, select the file share you want to mount.

1. On the file share's page, select **Connect**.

1. In the **Connect** pane, select the **Windows** tab.

1. For **Drive letter**, enter the drive you want to use. The default is *Z*.

1. For **Authentication method**, select how you want to connect to the file share.

1. Select **Show Script**, and copy the PowerShell script for mounting the file share.

1. Connect to the node over RDP.

1. Run the command you copied to mount the file share.

1. Note any error messages in the output. Use this information to troubleshoot any networking-related issues.

# [Linux](#tab/linux)

1. Create a pool without a mounting configuration. For example:

    ```powershell-interactive
    $imageReference = New-Object -TypeName "Microsoft.Azure.Commands.Batch.Models.PSImageReference" -ArgumentList @("0001-com-ubuntu-server-focal", "canonical", "20_04-lts", "latest")

    $configuration = New-Object -TypeName "Microsoft.Azure.Commands.Batch.Models.PSVirtualMachineConfiguration" -ArgumentList @($imageReference, "batch.node.ubuntu 20.04")

    New-AzBatchPool -Id "<pool-name>" -VirtualMachineSize "Standard_DS1_v2" -VirtualMachineConfiguration $configuration -TargetDedicatedComputeNodes 1 -BatchContext $Context
    ```

1. Wait for the node to be in the **Idle** state.

1. In the [Azure portal](https://portal.azure.com), search for and select the storage account that has your file share.

1. On the storage account page's menu, select **File shares** from the left navigation.

1. On the **File shares** page, select the file share you want to mount.

1. On the file share's page, select **Connect**.

1. In the **Connect** pane, select the **Linux** tab.

1. Enter the **Mount point** you want to use.

1. Copy the Linux script for mounting the file share.

1. Connect to the node over SSH.

1. Run the command you copied to mount the file share.

1. Note any error messages in the output. Use this information to troubleshoot any networking-related issues.

---

## Example mount configurations

The following code example configurations demonstrate mounting various file share systems to a pool of compute nodes.

### Azure Files share

Azure Files is the standard Azure cloud file system offering. The following configuration mounts an Azure Files share named `<file-share-name>` to the *S* drive. For information about the parameters in the example, see [Mount SMB Azure file share on Windows](/azure/storage/files/storage-how-to-use-files-windows) or [Create an NFS Azure file share and mount it on a Linux VM using the Azure portal](/azure/storage/files/storage-files-how-to-create-nfs-shares).

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
                AccountName = "<storage-account-name>",
                AzureFileUrl = "https://<storage-account-name>.file.core.windows.net/<file-share-name>",
                AccountKey = "<storage-account-key>",
                RelativeMountPath = "S",
                MountOptions = "-o vers=3.0,dir_mode=0777,file_mode=0777,sec=ntlmssp"
            },
        }
    }
}
```

### Azure Blob container

Another option is to use Azure Blob storage via [BlobFuse](/azure/storage/blobs/storage-how-to-mount-container-linux). Mounting a blob file system requires either an account key, shared access signature (SAS) key, or managed identity with access to your storage account.

For information on getting these keys or identity, see the following articles:

- [Manage storage account access keys](/azure/storage/common/storage-account-keys-manage)
- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](/azure/storage/common/storage-sas-overview)
- [Configure managed identities in Batch pools](managed-identity-pools.md)

  > [!TIP]
  >If you use a managed identity, ensure that the identity has been [assigned to the pool](managed-identity-pools.md) so that it's available on the VM doing the mounting. The identity must also have the **Storage Blob Data Contributor** role.

The following configuration mounts a blob file system with BlobFuse options. For illustration purposes, the example shows `AccountKey`, `SasKey` and `IdentityReference`, but you can actually specify only one of these methods.

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
                AccountName = "<storage-account-name>",
                ContainerName = "<container-name>",
                // Use only one of the following three lines:
                AccountKey = "<storage-account-key>",
                SasKey = "<sas-key>",
                IdentityReference = new ComputeNodeIdentityReference("/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity-name>"),
                RelativeMountPath = "<relative-mount-path>",
                BlobfuseOptions = "-o attr_timeout=240 -o entry_timeout=240 -o negative_timeout=120 "
            },
        }
    }
}
```

To get default access to the BlobFuse mounted directory, run the task as an administrator. BlobFuse mounts the directory at the user space, and at pool creation mounts the directory as root. In Linux, all administrator tasks are root. The [FUSE reference page](https://manpages.ubuntu.com/manpages/xenial/man8/mount.fuse.8.html) describes all options for the FUSE module.

For more information and tips on using BlobFuse, see the following references:

- [Blobfuse2 project](https://github.com/Azure/azure-storage-fuse)
- [Blobfuse Troubleshoot FAQ](https://github.com/Azure/azure-storage-fuse/wiki/Blobfuse-Troubleshoot-FAQ)
- [GitHub issues in the azure-storage-fuse repository](https://github.com/Azure/azure-storage-fuse/issues)

### NFS

You can mount NFS shares to pool nodes to allow Batch to access traditional file systems. The setup can be a single NFS server deployed in the cloud or an on-premises NFS server accessed over a virtual network. NFS mounts support [Avere vFXT](/azure/avere-vfxt/avere-vfxt-overview), a distributed in-memory cache for data-intensive high-performance computing (HPC) tasks. NFS mounts also support other standard NFS-compliant interfaces, such as [NFS for Azure Blob](/azure/storage/blobs/network-file-system-protocol-support) and [NFS for Azure Files](/azure/storage/files/storage-files-how-to-mount-nfs-shares).

The following example shows a configuration for an NFS file system mount:

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
                Source = "<source>",
                RelativeMountPath = "<relative-mount-path>",
                MountOptions = "options ver=3.0"
            },
        }
    }
}
```

### CIFS

Mounting [CIFS](/windows/desktop/fileio/microsoft-smb-protocol-and-cifs-protocol-overview) to pool nodes is another way to provide access to traditional file systems. CIFS is a file-sharing protocol that provides an open and cross-platform mechanism for requesting network server files and services. CIFS is based on the enhanced version of the [SMB protocol](/windows-server/storage/file-server/file-server-smb-overview) for internet and intranet file sharing.

The following example shows a configuration for a CIFS file mount.

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
                Username = "<storage-account-name>",
                RelativeMountPath = "<relative-mount-path>",
                Source = "<source>",
                Password = "<storage-account-key>",
                MountOptions = "-o vers=3.0,dir_mode=0777,file_mode=0777,serverino,domain=<domain-name>"
            },
        }
    }
}
```
> [!NOTE]
> Looking for an example using PowerShell rather than C#? You can find another great example here: [Mount Azure File to Azure Batch Pool](https://techcommunity.microsoft.com/t5/azure-paas-blog/mount-azure-file-share-to-azure-batch-pool-via-azure-powershell/ba-p/2243992).

## Next steps

- [Mount an Azure Files share with Windows](/azure/storage/files/storage-how-to-use-files-windows)
- [Mount an Azure Files share with Linux](/azure/storage/files/storage-how-to-use-files-linux)
- [Blobfuse2 - A Microsoft supported Azure Storage FUSE driver](https://github.com/Azure/azure-storage-fuse)
- [Network File System overview](/windows-server/storage/nfs/nfs-overview)
- [Microsoft SMB protocol and CIFS protocol overview](/windows/desktop/fileio/microsoft-smb-protocol-and-cifs-protocol-overview)
