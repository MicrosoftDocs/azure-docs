---
title: GlusterFS to Azure Files migration guide
description: Red Hat Gluster Storage (based on GlusterFS) has reached the end of its support lifecycle. Use this guide to migrate GlusterFS volumes to Azure Files.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 05/20/2025
ms.author: kendownie
---

# Migrate GlusterFS volumes to Azure Files

This article provides guidance on migrating data from GlusterFS volumes to Azure Files, Microsoft's fully managed file service in the cloud. Azure Files offers both SMB (Server Message Block) and NFS (Network File System) protocols, making it suitable for both Windows and Linux workloads.

## GlusterFS end-of-life considerations

Red Hat Gluster Storage (based on GlusterFS) has reached the end of its support lifecycle. Red Hat officially announced end of life for this product with the following schedule.

- End of full support: November 2020
- End of maintenance support: November 2021
- End of extended life phase: June 2024
- Formal end of life: December 2024

Organizations using GlusterFS should migrate to supported alternatives, such as Azure Files, to ensure continued support and security updates.

## Client requirements for Azure Files

Before migrating from GlusterFS to Azure Files, ensure your client systems meet the necessary requirements for connecting to Azure file shares using either SMB or NFS protocols.

# [Windows](#tab/windows)

### SMB requirements

Windows clients connecting to Azure Files via SMB should meet the following requirements:

- Windows 7 or Windows Server 2008 R2 or newer
- SMB 2.1 protocol support (minimum)
- SMB 3.0 protocol support for encryption features
- SMB 3.1.1 protocol support for best security and performance

> [!IMPORTANT]
> We strongly recommend using SMB 3.1.1 protocol for Azure Files access. SMB 3.0 and 2.0 should only be used for legacy clients, and you must plan an OS upgrade to mitigate unpatched security vulnerabilities.

For a complete list of requirements and setup instructions, see [Use an Azure file share with Windows](storage-how-to-use-files-windows.md#prerequisites).

### NFS requirements

Azure Files supports NFSv4.1, but Windows doesn't include a compatible NFSv4.1 client. To use NFS shares on Windows:

1. Install Windows Subsystem for Linux (WSL):
    - For Windows client: Follow the [WSL installation guide](/windows/wsl/install)
    - For Windows Server: Follow the [WSL on Windows Server installation guide](/windows/wsl/install-on-server)

1. Mount the NFS share from within a Linux distribution running on WSL.

# [Linux](#tab/linux)

### SMB requirements

Linux clients connecting via SMB should have:

- A compatible Linux distribution with SMB support
- The `cifs-utils` package installed
- SMB 3.0 protocol support (minimum)
- SMB 3.1.1 protocol support (recommended)

> [!IMPORTANT]
> We strongly recommend using SMB 3.1.1 protocol for Azure Files access. SMB 3.0 and 2.0 should only be used for legacy clients, and you must plan an OS upgrade to mitigate unpatched security vulnerabilities.

For specific distribution support and configuration steps, see [Mount SMB Azure file shares on Linux clients](storage-how-to-use-files-linux.md#prerequisites).

### NFS requirements

Linux clients connecting via NFS should have:

- NFSv4.1 client support
- A compatible Linux distribution
- Proper network configuration for NFS traffic

For NFS mount requirements and configuration steps, see [Mount an NFS share](storage-files-how-to-mount-nfs-shares.md).

---

## Migration tools

For Windows clients, we recommend using Robocopy.

For Linux clients, use rsync or fpsync, which allows you to parallelize rsync file operations. See [Using fpsync vs. rsync](storage-files-migration-nfs.md#using-fpsync-vs-rsync).

# [Windows](#tab/windows)

### For Windows clients: Robocopy

Robocopy is a built-in Windows command-line tool designed for copying SMB file shares.

#### Basic Robocopy syntax for migration

```powershell
robocopy <GlusterFS_Source> <AzureFiles_Destination> /MIR /Z /MT:8 /W:1 /R:3 /LOG:migration_log.txt
```

**Parameters:**
- `/MIR`: Mirrors directory structure (includes subdirectories)
- `/Z`: Enables restart mode for interrupted copies
- `/MT:8`: Uses 8 threads for multi-threaded copying
- `/W:1`: Wait time between retries (1 second)
- `/R:3`: Number of retries on failed copies
- `/LOG`: Creates a detailed log file

# [Linux](#tab/linux)

### For Linux clients: rsync

rsync is a fast, versatile file copy tool available on Linux systems.

#### Basic rsync syntax for migration

```bash
rsync -avz --progress --stats --delete <GlusterFS_Source>/ <AzureFiles_Destination>/
```

**Parameters:**
- `-a`: Archive mode (preserves permissions, timestamps, etc.)
- `-v`: Verbose output
- `-z`: Compresses data during transfer
- `--progress`: Shows progress during transfer
- `--stats`: Provides transfer statistics
- `--delete`: Removes files from destination that don't exist in source

---

## Step-by-step migration procedure

### Step 1: Assessment and planning

1. Inventory your GlusterFS volumes, noting:
   - Total data size
   - Number of files and directories
   - Access patterns and performance requirements
   - Client operating systems

1. Select the appropriate protocol. In most cases, you'll want to use SMB for Windows workloads and NFS for Linux workloads.

1. Select HDD or SSD, and size your Azure file shares appropriately:
   - Standard (HDD): Up to 100 TiB
   - Premium (SSD): Up to 100 TiB with higher performance

### Step 2: Prepare Azure environment

1. [Create a storage account](../common/storage-account-create.md) in the appropriate Azure region.
   - Choose the right performance tier (Standard or Premium) based on your needs. Premium is required for NFS file shares.

1. Configure networking. See [Azure Files networking considerations](storage-files-networking-overview.md).
   - SMB: Configure firewall and private endpoints as needed. See [Configure Azure Storage firewalls](../common/storage-network-security.md) and [Configure network endpoints for accessing Azure file shares](storage-files-networking-endpoints.md).
   - NFS: Configure network security and private endpoints. See [Mount NFS Azure file shares on Linux](storage-files-how-to-mount-nfs-shares.md).

1. Create Azure file shares with appropriate protocols.

### Step 3: Mount Azure file share

Before migrating the data, you must mount the Azure file share(s). 

# [Windows](#tab/windows)

#### For Windows clients (SMB):

This article shows how to mount the Azure file share using NTLMv2 authentication (storage account key). In non-administrative scenarios, using [identity-based authentication](storage-files-active-directory-overview.md) is preferred for security reasons. 

You can find your storage account key in the [Azure portal](https://portal.azure.com/) by navigating to the storage account and selecting **Security + networking** > **Access keys**, or you can use the `Get-AzStorageAccountKey` PowerShell cmdlet.

To mount the file share, run the following command. Be sure to replace `<storage-account-name>`, `<share-name>`, and `<storage-account-key>` with your actual values.

```powershell
net use Z: \\<storage-account-name>.file.core.windows.net\<share-name> /u:AZURE\<storage-account-name> <storage-account-key>
```

For more information, see [Mount SMB Azure file share on Windows](storage-how-to-use-files-windows.md).

# [Linux](#tab/linux)

#### For Linux clients (NFS):

To mount the file share, run the following command. Be sure to replace `<storage-account-name>`, `<share-name>`, and `<mount-point>` with your actual values.

```bash
sudo mount -t nfs <storage-account-name>.file.core.windows.net:/<storage-account-name>/<share-name> <mount-point> -o vers=4.1,sec=sys
```

For more information, see [Mount NFS Azure file shares on Linux](storage-files-how-to-mount-nfs-shares.md).

---

### Step 4: Perform data migration

After you've mounted the Azure file share, you can perform the data migration.

# [Windows](#tab/windows)

#### For Windows workloads using Robocopy:

Open a command prompt or PowerShell window with administrator privileges, and run the following command:

```powershell
robocopy X:\GlusterFSData Z:\AzureFilesData /MIR /Z /MT:8 /W:1 /R:3 /LOG:C:\migration_log.txt
```

# [Linux](#tab/linux)

#### For Linux workloads using rsync:

Execute the following command:

```bash
rsync -avz --progress --stats --delete /mnt/glusterfs/ /mnt/azurefiles/
```

For large datasets, consider using the `--exclude` parameter to perform the migration in phases.

---

### Step 5: Verify that migration succeeded

1. Compare file counts and sizes:
   - On Windows: Use `Get-ChildItem -Recurse | Measure-Object`
   - On Linux: Use `find . -type f | wc -l` and `du -sh`

1. Validate user/group permissions and access rights.

1. Perform application-specific tests.

### Step 6: Cutover

1. Redirect applications to use Azure Files endpoints.
1. Update mount points in fstab (Linux) or mapped drives (Windows).
1. Update documentation and monitoring tools.
1. Decommission GlusterFS volumes after successful validation.

## Optimize performance

Follow these recommendations to optimize performance when migrating from GlusterFS to Azure Files. For detailed performance tuning, see [Azure Files scalability and performance targets](storage-files-scale-targets.md) and [Understand and optimize Azure file share performance](understand-performance.md).

> [!NOTE]
> Check virtual machine (VM) size to ensure that VM network bandwidth isn't a bottleneck when your file shares are correctly sized for required throughput and IOPS. Different VM SKUs have different network bandwidth limits that can constrain overall file share performance. Select VM sizes that provide sufficient network throughput for your workload requirements. For more information, see [Azure virtual machine sizes](/azure/virtual-machines/sizes).

# [Windows](#tab/windows)

### Optimize SMB performance

- Enable [SMB Multichannel](smb-performance.md#smb-multichannel) for higher throughput with multiple connections.
- Use SSD file shares and [Metadata caching](smb-performance.md#metadata-caching-for-ssd-file-shares) for performance-critical workloads.
- Configure appropriate client-side caching.
- Follow [Azure Files performance recommendations](smb-performance.md) for SMB file shares.

# [Linux](#tab/linux)

### Optimize NFS performance

- Always use Premium (SSD) file shares for NFS workloads (required).
- Provision sufficient capacity based on your [throughput requirements](understand-performance.md).
- Optimize client-side settings like read/write buffer sizes.
- Use nconnect, a client-side mount option that allows you to use multiple TCP connections between the client and your NFS file share. We recommend the optimal setting of `nconnect=4`.
- Consider network latency between your clients and Azure.
- Follow [Azure Files performance recommendations](nfs-performance.md) for NFS file shares.

---

## Troubleshooting

Follow these instructions to troubleshoot common migration issues.

# [Windows](#tab/windows)

### Common issues with Robocopy

- **Error 5 (Access denied)**: Verify permissions on source and destination.
- **Error 67 (Network name not found)**: Check network connectivity and share name.
- **Error 1314 (Not enough quota)**: Increase Azure Files quota or free space.

# [Linux](#tab/linux)

### Common issues with rsync

- **Permission denied**: Check file permissions and mount options.
- **Connection timeout**: Verify network connectivity and firewall settings.
- **Partial transfer**: Use `--partial` flag to resume interrupted transfers.
- **No such file or directory**: Verify that the file path and directory exist.

---

## Migration support

For issues related to Azure Files, contact Azure Support through the [Azure portal](https://portal.azure.com).

For GlusterFS migration assistance, consider engaging Microsoft Consulting Services.

## See also

- [Use RoboCopy to migrate to SMB Azure file shares](storage-files-migration-robocopy.md)
- [Migrate to NFS Azure file shares](storage-files-migration-nfs.md)
- [Robocopy documentation](/windows-server/administration/windows-commands/robocopy)
- [rsync manual](https://linux.die.net/man/1/rsync)
- [Using fpsync to parallelize rsync file operations](https://www.fpart.org/fpsync/)
- [Azure Files scale targets](storage-files-scale-targets.md)
- [Troubleshoot Azure Files](/troubleshoot/azure/azure-storage/files/connectivity/files-troubleshoot)
