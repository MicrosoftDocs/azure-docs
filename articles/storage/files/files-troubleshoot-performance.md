---
title: Azure Files performance troubleshooting guide
description: Troubleshoot performance issues with Azure file shares and discover potential causes and associated workarounds for these problems.
author: khdownie
ms.service: storage
ms.topic: troubleshooting
ms.date: 02/21/2023
ms.author: kendownie
ms.subservice: files
#Customer intent: As a system admin, I want to troubleshoot performance issues with Azure file shares to improve performance for applications and users.
---
# Troubleshoot Azure Files performance issues

This article lists common problems related to Azure file share performance, and provides potential causes and workarounds. To get the most value from this troubleshooting guide, we recommend first reading [Understand Azure Files performance](understand-performance.md).

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

## General performance troubleshooting

First, rule out some common reasons why you might be having performance problems.

### You're running an old operating system

If your client virtual machine (VM) is running Windows 8.1 or Windows Server 2012 R2, or an older Linux distro or kernel, you might experience performance issues when accessing Azure file shares. Either upgrade your client OS or apply the fixes below.

# [Windows](#tab/windows)

### Considerations for Windows 8.1 and Windows Server 2012 R2

Clients that are running Windows 8.1 or Windows Server 2012 R2 might see higher than expected latency when accessing Azure file shares for I/O-intensive workloads. Make sure that the [KB3114025](https://support.microsoft.com/help/3114025) hotfix is installed. This hotfix improves the performance of create and close handles.

You can run the following script to check whether the hotfix has been installed:

`reg query HKLM\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters\Policies`

If the hotfix is installed, the following output is displayed:

`HKEY_Local_MACHINE\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters\Policies {96c345ef-3cac-477b-8fcd-bea1a564241c} REG_DWORD 0x1`

> [!Note]
> Windows Server 2012 R2 images in Azure Marketplace have hotfix KB3114025 installed by default, starting in December 2015.


# [Linux](#tab/linux)

### Low IOPS on CentOS Linux or RHEL

#### Cause

An I/O depth of greater than 1 isn't supported on older versions of CentOS Linux or RHEL.

#### Workaround

- Upgrade to CentOS Linux 8.6+ or RHEL 8.6+.
- Change to Ubuntu.
- For other Linux VMs, upgrade the kernel to 5.0 or later.

---


### Your workload is being throttled

Requests are throttled when the I/O operations per second (IOPS), ingress, or egress limits for a file share are reached. For example, if the client exceeds baseline IOPS, it will get throttled by the Azure Files service. Throttling can result in the client experiencing poor performance.

To understand the limits for standard and premium file shares, see [File share and file scale targets](storage-files-scale-targets.md#azure-file-share-scale-targets). Depending on your workload, throttling can often be avoided by moving from standard to premium Azure file shares.

To learn more about how throttling at the share level or storage account level can cause high latency, low throughput, and general performance issues, see [Share or storage account is being throttled](#cause-1-share-or-storage-account-is-being-throttled).


## High latency, low throughput, or low IOPS

### Cause 1: Share or storage account is being throttled

To confirm whether your share or storage account is being throttled, you can access and use Azure metrics in the portal. You can also create alerts that will notify you if a share is being throttled or is about to be throttled. See [Troubleshoot Azure Files by creating alerts](files-troubleshoot-create-alerts.md).

> [!IMPORTANT]
> For standard storage accounts with large file shares (LFS) enabled, throttling occurs at the account level. For premium files shares and standard file shares without LFS enabled, throttling occurs at the share level.

1. In the Azure portal, go to your storage account.

1. On the left pane, under **Monitoring**, select **Metrics**.

1. Select **File** as the metric namespace for your storage account scope.

1. Select **Transactions** as the metric.

1. Add a filter for **Response type**, and then check to see whether any requests have been throttled. 

    For standard file shares that don't have large file shares enabled, the following response types are logged if a request is throttled at the share level:

    - SuccessWithThrottling
    - SuccessWithShareIopsThrottling
    - ClientShareIopsThrottlingError

    For standard file shares that have large file shares enabled, the following response types are logged if a request is throttled at the client account level:

    - ClientAccountRequestThrottlingError
    - ClientAccountBandwidthThrottlingError

    For premium file shares, the following response types are logged if a request is throttled at the share level:

    - SuccessWithShareEgressThrottling
    - SuccessWithShareIngressThrottling
    - SuccessWithShareIopsThrottling
    - ClientShareEgressThrottlingError
    - ClientShareIngressThrottlingError
    - ClientShareIopsThrottlingError

    If a throttled request was authenticated with Kerberos, you might see a prefix indicating the authentication protocol, such as:

    - KerberosSuccessWithShareEgressThrottling
    - KerberosSuccessWithShareIngressThrottling

    To learn more about each response type, see [Metric dimensions](storage-files-monitoring-reference.md#metrics-dimensions).

    ![Screenshot of the metrics options for premium file shares, showing a "Response type" property filter.](media/files-troubleshoot-performance/performance-metrics.png)

#### Solution

- If you're using a standard file share, [enable large file shares](storage-how-to-create-file-share.md#enable-large-file-shares-on-an-existing-account) on your storage account and [increase the size of file share quota to take advantage of the large file share support](storage-how-to-create-file-share.md#expand-existing-file-shares). Large file shares support great IOPS and bandwidth limits; see [Azure Files scalability and performance targets](storage-files-scale-targets.md) for details.
- If you're using a premium file share, increase the provisioned file share size to increase the IOPS limit. To learn more, see the [Understanding provisioning for premium file shares](understanding-billing.md#provisioned-model).

### Cause 2: Metadata or namespace heavy workload

If the majority of your requests are metadata-centric (such as `createfile`, `openfile`, `closefile`, `queryinfo`, or `querydirectory`), the latency will be worse than that of read/write operations.

To determine whether most of your requests are metadata-centric, start by following steps 1-4 as previously outlined in Cause 1. For step 5, instead of adding a filter for **Response type**, add a property filter for **API name**.

![Screenshot of the metrics options for premium file shares, showing an "API name" property filter.](media/files-troubleshoot-performance/metadata-metrics.png)

#### Workarounds

- Check to see whether the application can be modified to reduce the number of metadata operations.
- Separate the file share into multiple file shares within the same storage account.
- Add a virtual hard disk (VHD) on the file share and mount the VHD from the client to perform file operations against the data. This approach works for single writer/reader scenarios or scenarios with multiple readers and no writers. Because the file system is owned by the client rather than Azure Files, this allows metadata operations to be local. The setup offers performance similar to that of local directly attached storage. However, because the data is in a VHD, it can't be accessed via any other means other than the SMB mount, such as REST API or through the Azure portal.
    1. From the machine which needs to access the Azure file share, mount the file share using the storage account key and map it to an available network drive (for example, Z:).
    1. Go to **Disk Management** and select **Action > Create VHD**.
    1. Set **Location** to the network drive that the Azure file share is mapped to, set **Virtual hard disk size** as needed, and select **Fixed size**.
    1. Select **OK**. Once the VHD creation is complete, it will automatically mount, and a new unallocated disk will appear.
    1. Right-click the new unknown disk and select **Initialize Disk**.
    1. Right-click the unallocated area and create a **New Simple Volume**.
    1. You should see a new drive letter appear in **Disk Management** representing this VHD with read/write access (for example, E:). In **File Explorer**, you should see the new VHD on the mapped Azure file share's network drive (Z: in this example). To be clear, there should be two drive letters present: the standard Azure file share network mapping on Z:, and the VHD mapping on the E: drive.
    1. There should be much better performance on heavy metadata operations against files on the VHD mapped drive (E:) versus the Azure file share mapped drive (Z:). If desired, it should be possible to disconnect the mapped network drive (Z:) and still access the mounted VHD drive (E:).

    - To mount a VHD on a Windows client, you can also use the [`Mount-DiskImage`](/powershell/module/storage/mount-diskimage) PowerShell cmdlet.
    - To mount a VHD on Linux, consult the documentation for your Linux distribution. [Here's an example](https://man7.org/linux/man-pages/man5/nfs.5.html).  

### Cause 3: Single-threaded application

If the application that you're using is single-threaded, this setup can result in significantly lower IOPS throughput than the maximum possible throughput, depending on your provisioned share size.

#### Solution

- Increase application parallelism by increasing the number of threads.
- Switch to applications where parallelism is possible. For example, for copy operations, you could use AzCopy or RoboCopy from Windows clients or the **parallel** command from Linux clients.

### Cause 4: Number of SMB channels exceeds four

If you're using SMB MultiChannel and the number of channels you have exceeds four, this will result in poor performance. To determine if your connection count exceeds four, use the PowerShell cmdlet `get-SmbClientConfiguration` to view the current connection count settings.

#### Solution

Set the Windows per NIC setting for SMB so that the total channels don't exceed four. For example, if you have two NICs, you can set the maximum per NIC to two using the following PowerShell cmdlet: `Set-SmbClientConfiguration -ConnectionCountPerRssNetworkInterface 2`.


## Very high latency for requests

### Cause

The client VM could be located in a different region than the file share. Other reason for high latency could be due to the latency caused by the client or the network.

### Solution

- Run the application from a VM that's located in the same region as the file share.
- For your storage account, review transaction metrics **SuccessE2ELatency** and  **SuccessServerLatency** via **Azure Monitor** in Azure portal. A high difference between SuccessE2ELatency and SuccessServerLatency metrics values is an indication of latency that is likely caused by the network or the client. See [Transaction metrics](storage-files-monitoring-reference.md#transaction-metrics) in Azure Files Monitoring data reference.

## Client unable to achieve maximum throughput supported by the network

### Cause
One potential cause is a lack of SMB multi-channel support for standard file shares. Currently, Azure Files supports only single channel for standard file shares, so there's only one connection from the client VM to the server. This single connection is pegged to a single core on the client VM, so the maximum throughput achievable from a VM is bound by a single core.

### Workaround

- For premium file shares, [Enable SMB Multichannel](files-smb-protocol.md#smb-multichannel).
- Obtaining a VM with a bigger core might help improve throughput.
- Running the client application from multiple VMs will increase throughput.
- Use REST APIs where possible.
- For NFS Azure file shares, `nconnect` is available. See [Improve NFS Azure file share performance with nconnect](nfs-nconnect-performance.md).


<a id="slowperformance"></a>
## Slow performance on an Azure file share mounted on a Linux VM

### Cause 1: Caching

One possible cause of slow performance is disabled caching. Caching can be useful if you are accessing a file repeatedly, otherwise, it can be an overhead. Check if you are using the cache before disabling it.

### Solution for cause 1

To check whether caching is disabled, look for the **cache=** entry.

**Cache=none** indicates that caching is disabled. Remount the share by using the default mount command or by explicitly adding the **cache=strict** option to the mount command to ensure that default caching or "strict" caching mode is enabled.

In some scenarios, the **serverino** mount option can cause the **ls** command to run stat against every directory entry. This behavior results in performance degradation when you're listing a large directory. You can check the mount options in your **/etc/fstab** entry:

`//azureuser.file.core.windows.net/cifs /cifs cifs vers=2.1,serverino,username=xxx,password=xxx,dir_mode=0777,file_mode=0777`

You can also check whether the correct options are being used by running the  **sudo mount | grep cifs** command and checking its output. The following is example output:

```
//azureuser.file.core.windows.net/cifs on /cifs type cifs (rw,relatime,vers=2.1,sec=ntlmssp,cache=strict,username=xxx,domain=X,uid=0,noforceuid,gid=0,noforcegid,addr=192.168.10.1,file_mode=0777, dir_mode=0777,persistenthandles,nounix,serverino,mapposix,rsize=1048576,wsize=1048576,actimeo=1)
```

If the **cache=strict** or **serverino** option is not present, unmount and mount Azure Files again by running the mount command from the [documentation](./storage-how-to-use-files-linux.md). Then, recheck that the **/etc/fstab** entry has the correct options.

### Cause 2: Throttling

It's possible you're experiencing throttling and your requests are being sent to a queue. You can verify this by leveraging [Azure Storage metrics in Azure Monitor](../blobs/monitor-blob-storage.md). You can also create alerts that will notify you if a share is being throttled or is about to be throttled. See [Troubleshoot Azure Files by creating alerts](files-troubleshoot-create-alerts.md).

### Solution for cause 2

Ensure your app is within the [Azure Files scale targets](storage-files-scale-targets.md#azure-files-scale-targets). If you're using standard Azure file shares, consider switching to premium.


## Throughput on Linux clients is lower than that of Windows clients

### Cause

This is a known issue with the implementation of the SMB client on Linux.

### Workaround

- Spread the load across multiple VMs.
- On the same VM, use multiple mount points with a `nosharesock` option, and spread the load across these mount points.
- On Linux, try mounting with a `nostrictsync` option to avoid forcing an SMB flush on every `fsync` call. For Azure Files, this option doesn't interfere with data consistency, but it might result in stale file metadata on directory listings (`ls -l` command). Directly querying file metadata by using the `stat` command will return the most up-to-date file metadata.

## High latencies for metadata-heavy workloads involving extensive open/close operations

### Cause

Lack of support for directory leases.

### Workaround

- If possible, avoid using an excessive opening/closing handle on the same directory within a short period of time.
- For Linux VMs, increase the directory entry cache timeout by specifying `actimeo=<sec>` as a mount option. By default, the timeout is 1 second, so a larger value, such as 30 seconds, might help.
- For CentOS Linux or Red Hat Enterprise Linux (RHEL) VMs, upgrade the system to CentOS Linux 8.2 or RHEL 8.2. For other Linux distros, upgrade the kernel to 5.0 or later.


## Slow enumeration of files and folders

### Cause

This problem can occur if there isn't enough cache on the client machine for large directories.

### Solution

To resolve this problem, adjust the **DirectoryCacheEntrySizeMax** registry value to allow caching of larger directory listings in the client machine:

- Location: `HKLM\System\CCS\Services\Lanmanworkstation\Parameters`
- Value name: `DirectoryCacheEntrySizeMax` 
- Value type: `DWORD` 
 
For example, you can set it to `0x100000` and see if performance improves.


## Slow file copying to and from Azure file shares

You might see slow performance when you try to transfer files to the Azure Files service. If you don't have a specific minimum I/O size requirement, we recommend that you use 1 MiB as the I/O size for optimal performance.

# [Windows](#tab/windows)

### Slow file copying to and from Azure Files in Windows

-	If you know the final size of a file that you are extending with writes, and your software doesn't have compatibility problems when the unwritten tail on the file contains zeros, then set the file size in advance instead of making every write an extending write.
-	Use the right copy method:
    -	Use [AzCopy](../common/storage-use-azcopy-v10.md?toc=/azure/storage/files/toc.json) for any transfer between two file shares.
    -	Use [Robocopy](storage-how-to-create-file-share.md) between file shares on an on-premises computer.

# [Linux](#tab/linux)

<a id="slowfilecopying"></a>
### Slow file copying to and from Azure Files in Linux

- Use the right copy method:
    - Use [AzCopy](../common/storage-use-azcopy-v10.md?toc=/azure/storage/files/toc.json) for any transfer between two file shares.
    - Using cp or dd with parallel could improve copy speed, the number of threads depends on your use case and workload. The following examples use six: 
    - cp example (cp will use the default block size of the file system as the chunk size): `find * -type f | parallel --will-cite -j 6 cp {} /mntpremium/ &`.
    - dd example (this command explicitly sets chunk size to 1 MiB): `find * -type f | parallel --will-cite-j 6 dd if={} of=/mnt/share/{} bs=1M`
    - Open source third-party tools such as:
        - [GNU Parallel](https://www.gnu.org/software/parallel/).
        - [Fpart](https://github.com/martymac/fpart) - Sorts files and packs them into partitions.
        - [Fpsync](https://github.com/martymac/fpart/blob/master/tools/fpsync) - Uses Fpart and a copy tool to spawn multiple instances to migrate data from src_dir to dst_url.
        - [Multi](https://github.com/pkolano/mutil) - Multi-threaded cp and md5sum based on GNU coreutils.
- Setting the file size in advance, instead of making every write an extending write, helps improve copy speed in scenarios where the file size is known. If extending writes need to be avoided, you can set a destination file size with `truncate --size <size> <file>` command. After that, `dd if=<source> of=<target> bs=1M conv=notrunc`command will copy a source file without having to repeatedly update the size of the target file. For example, you can set the destination file size for every file you want to copy (assume a share is mounted under /mnt/share):
    - `for i in `` find * -type f``; do truncate --size ``stat -c%s $i`` /mnt/share/$i; done`
    - and then copy files without extending writes in parallel: `find * -type f | parallel -j6 dd if={} of =/mnt/share/{} bs=1M conv=notrunc`

---


## Excessive DirectoryOpen/DirectoryClose calls

### Cause

If the number of **DirectoryOpen/DirectoryClose** calls is among the top API calls and you don't expect the client to make that many calls, the issue might be caused by the antivirus software that's installed on the Azure client VM.

### Workaround

- A fix for this issue is available in the [April Platform Update for Windows](https://support.microsoft.com/help/4052623/update-for-windows-defender-antimalware-platform).


## SMB Multichannel isn't being triggered

### Cause

Recent changes to SMB Multichannel config settings without a remount.

### Solution
 
-	After any changes to Windows SMB client or account SMB multichannel configuration settings, you have to unmount the share, wait for 60 seconds, and remount the share to trigger the multichannel.
-	For Windows client OS, generate IO load with high queue depth say QD=8, for example copying a file to trigger SMB Multichannel.  For server OS, SMB Multichannel is triggered with QD=1, which means as soon as you start any IO to the share.

## Slow performance when unzipping files in SMB file shares
Depending on the exact compression method and unzip operation used, decompression operations may perform more slowly on an Azure file share than on your local disk. This is often because unzipping tools perform a number of metadata operations in the process of performing the decompression of a compressed archive. For the best performance, we recommend copying the compressed archive from the Azure file share to your local disk, unzipping there, and then using a copy tool such as Robocopy (or AzCopy) to copy back to the Azure file share. Using a copy tool like Robocopy can compensate for the decreased performance of metadata operations in Azure Files relative to your local disk by using multiple threads to copy data in parallel. 

## High latency on web sites hosted on file shares

### Cause

High number file change notification on file shares can result in high latencies. This typically occurs with web sites hosted on file shares with deep nested directory structure. A typical scenario is IIS hosted web application where file change notification is set up for each directory in the default configuration. Each change ([ReadDirectoryChangesW](/windows/win32/api/winbase/nf-winbase-readdirectorychangesw)) on the share that the client is registered for pushes a change notification from the file service to the client, which takes system resources, and the issue worsens with the number of changes. This can cause share throttling and thus result in higher client-side latency.

To confirm, you can use Azure Metrics in the portal.

1. In the Azure portal, go to your storage account. 
1. In the left menu, under Monitoring, select Metrics. 
1. Select File as the metric namespace for your storage account scope. 
1. Select Transactions as the metric. 
1. Add a filter for ResponseType and check to see if any requests have a response code of SuccessWithThrottling (for SMB or NFS) or ClientThrottlingError (for REST).

### Solution

- If file change notification isn't used, disable file change notification (preferred).
    - [Disable file change notification](https://support.microsoft.com/help/911272/fix-asp-net-2-0-connected-applications-on-a-web-site-may-appear-to-sto) by updating FCNMode. 
    - Update the IIS Worker Process (W3WP) polling interval to 0 by setting `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\W3SVC\Parameters\ConfigPollMilliSeconds ` in your registry and restart the W3WP process. To learn about this setting, see [Common registry keys that are used by many parts of IIS](/troubleshoot/iis/use-registry-keys#registry-keys-that-apply-to-iis-worker-process-w3wp).
- Increase frequency of the file change notification polling interval to reduce volume.
    - Update the W3WP worker process polling interval to a higher value (e.g. 10mins or 30mins) based on your requirement. Set `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\W3SVC\Parameters\ConfigPollMilliSeconds ` [in your registry](/troubleshoot/iis/use-registry-keys#registry-keys-that-apply-to-iis-worker-process-w3wp) and restart the W3WP process.
- If your web site's mapped  physical directory has nested directory structure, you can try to limit scope of file change notification to reduce the notification volume. By default, IIS uses configuration from Web.config files in the physical directory to which the virtual directory is mapped, as well as in any child directories in that physical directory. If you don't want to use Web.config files in child directories, specify false for the allowSubDirConfig attribute on the virtual directory. More details can be found [here](/iis/get-started/planning-your-iis-architecture/understanding-sites-applications-and-virtual-directories-on-iis#virtual-directories). 
    - Set IIS virtual directory "allowSubDirConfig" setting in Web.Config to *false* to exclude mapped physical child directories from the scope.  


## See also
- [Troubleshoot Azure Files](files-troubleshoot.md)
- [Troubleshoot Azure Files by creating alerts](files-troubleshoot-create-alerts.md)
- [Understand Azure Files performance](understand-performance.md)
- [Overview of alerts in Microsoft Azure](../../azure-monitor/alerts/alerts-overview.md)
- [Azure Files FAQ](storage-files-faq.md)
