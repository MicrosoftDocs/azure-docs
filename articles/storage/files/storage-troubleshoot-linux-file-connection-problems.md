---
title: Troubleshoot Azure Files problems in Linux | Microsoft Docs
description: Troubleshooting Azure Files problems in Linux
services: storage
author: jeffpatt24
tags: storage
ms.service: storage
ms.topic: article
ms.date: 10/16/2018
ms.author: jeffpatt
ms.subservice: files
---
# Troubleshoot Azure Files problems in Linux

This article lists common problems that are related to Azure Files when you connect from Linux clients. It also provides possible causes and resolutions for these problems. 

In addition to the troubleshooting steps in this article, you can use [AzFileDiagnostics](https://gallery.technet.microsoft.com/Troubleshooting-tool-for-02184089) to ensure that the Linux client has correct prerequisites. AzFileDiagnostics automates the detection of most of the symptoms mentioned in this article. It helps set up your environment to get optimal performance. You can also find this information in the [Azure Files shares troubleshooter](https://support.microsoft.com/help/4022301/troubleshooter-for-azure-files-shares). The troubleshooter provides steps to help you with problems connecting, mapping, and mounting Azure Files shares.

## Cannot connect to or mount an Azure file share

### Cause

Common causes for this problem are:

- You're using an incompatible Linux distribution client. We recommend that you use the following Linux distributions to connect to an Azure file share:

|   | SMB 2.1 <br>(Mounts on VMs within the same Azure region) | SMB 3.0 <br>(Mounts from on-premises and cross-region) |
| --- | :---: | :---: |
| Ubuntu Server | 14.04+ | 16.04+ |
| RHEL | 7+ | 7.5+ |
| CentOS | 7+ |  7.5+ |
| Debian | 8+ |   |
| openSUSE | 13.2+ | 42.3+ |
| SUSE Linux Enterprise Server | 12 | 12 SP3+ |

- CIFS utilities (cfs-utils) are not installed on the client.
- The minimum SMB/CIFS version, 2.1, is not installed on the client.
- SMB 3.0 encryption is not supported on the client. The preceding table provides a list of Linux distributions that support mounting from on-premises and cross-region using encryption. Other distributions require kernel 4.11 and later versions.
- You're trying to connect to a storage account over TCP port 445, which is not supported.
- You're trying to connect to an Azure file share from an Azure VM, and the VM is not in the same region as the storage account.
- If the [Secure transfer required]( https://docs.microsoft.com/azure/storage/common/storage-require-secure-transfer) setting is enabled on the storage account, Azure Files will allow only connections that use SMB 3.0 with encryption.

### Solution

To resolve the problem, use the [troubleshooting tool for Azure Files mounting errors on Linux](https://gallery.technet.microsoft.com/Troubleshooting-tool-for-02184089). This tool:

* Helps you to validate the client running environment.
* Detects the incompatible client configuration that would cause access failure for Azure Files.
* Gives prescriptive guidance on self-fixing.
* Collects the diagnostics traces.

<a id="mounterror13"></a>
## "Mount error(13): Permission denied" when you mount an Azure file share

### Cause 1: Unencrypted communication channel

For security reasons, connections to Azure file shares are blocked if the communication channel isn't encrypted and if the connection attempt isn't made from the same datacenter where the Azure file shares reside. Unencrypted connections within the same datacenter can also be blocked if the [Secure transfer required](https://docs.microsoft.com/azure/storage/common/storage-require-secure-transfer) setting is enabled on the storage account. An encrypted communication channel is provided only if the user's client OS supports SMB encryption.

To learn more, see [Prerequisites for mounting an Azure file share with Linux and the cifs-utils package](https://docs.microsoft.com/azure/storage/files/storage-how-to-use-files-linux#prerequisites-for-mounting-an-azure-file-share-with-linux-and-the-cifs-utils-package). 

### Solution for cause 1

1. Connect from a client that supports SMB encryption or connect from a virtual machine in the same datacenter as the Azure storage account that is used for the Azure file share.
2. Verify the [Secure transfer required](https://docs.microsoft.com/azure/storage/common/storage-require-secure-transfer) setting is disabled on the storage account if the client does not support SMB encryption.

### Cause 2: Virtual network or firewall rules are enabled on the storage account 

If virtual network (VNET) and firewall rules are configured on the storage account, network traffic will be denied access unless the client IP address or virtual network is allowed access.

### Solution for cause 2

Verify virtual network and firewall rules are configured properly on the storage account. To test if virtual network or firewall rules is causing the issue, temporarily change the setting on the storage account to **Allow access from all networks**. To learn more, see [Configure Azure Storage firewalls and virtual networks](https://docs.microsoft.com/azure/storage/common/storage-network-security).

<a id="permissiondenied"></a>
## "[permission denied] Disk quota exceeded" when you try to open a file

In Linux, you receive an error message that resembles the following:

**\<filename> [permission denied] Disk quota exceeded**

### Cause

You have reached the upper limit of concurrent open handles that are allowed for a file.

There is a quota of 2,000 open handles on a single file. When you have 2,000 open handles, an error message is displayed that says the quota is reached.

### Solution

Reduce the number of concurrent open handles by closing some handles, and then retry the operation.

To view open handles for a file share, directory or file, use the [Get-AzStorageFileHandle](https://docs.microsoft.com/powershell/module/az.storage/get-azstoragefilehandle) PowerShell cmdlet.  

To close open handles for a file share, directory or file, use the [Close-AzStorageFileHandle](https://docs.microsoft.com/powershell/module/az.storage/close-azstoragefilehandle) PowerShell cmdlet.

> [!Note]  
> The Get-AzStorageFileHandle and Close-AzStorageFileHandle cmdlets are included in Az PowerShell module version 2.4 or later. To install the latest Az PowerShell module, see [Install the Azure PowerShell module](https://docs.microsoft.com/powershell/azure/install-az-ps).

<a id="slowfilecopying"></a>
## Slow file copying to and from Azure Files in Linux

- If you don't have a specific minimum I/O size requirement, we recommend that you use 1 MiB as the I/O size for optimal performance.
- Use the right copy method:
    - Use [AzCopy](../common/storage-use-azcopy.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json) for any transfer between two file shares.
    - Using cp or dd with parallel could improve copy speed, the number of threads depends on your use case and workload. The following examples use six: 
    - cp example (cp will use the default block size of the file system as the chunk size): `find * -type f | parallel --will-cite -j 6 cp {} /mntpremium/ &`.
    - dd example (this command explicitly sets chunk size to 1 MiB): `find * -type f | parallel --will-cite-j 6 dd if={} of=/mnt/share/{} bs=1M`
    - Open source third party tools such as:
        - [GNU Parallel](https://www.gnu.org/software/parallel/).
        - [Fpart](https://github.com/martymac/fpart) - Sorts files and packs them into partitions.
        - [Fpsync](https://github.com/martymac/fpart/blob/master/tools/fpsync) - Uses Fpart and a copy tool to spawn multiple instances to migrate data from src_dir to dst_url.
        - [Multi](https://github.com/pkolano/mutil) - Multi-threaded cp and md5sum based on GNU coreutils.
- Setting the file size in advance, instead of making every write an extending write, helps improve copy speed in scenarios where the file size is known. If extending writes need to be avoided, you can set a destination file size with `truncate - size <size><file>` command. After that, `dd if=<source> of=<target> bs=1M conv=notrunc`command will copy a source file without having to repeatedly update the size of the target file. For example, you can set the destination file size for every file you want to copy (assume a share is mounted under /mnt/share):
    - `$ for i in `` find * -type f``; do truncate --size ``stat -c%s $i`` /mnt/share/$i; done`
    - and then - copy files without extending writes in parallel: `$find * -type f | parallel -j6 dd if={} of =/mnt/share/{} bs=1M conv=notrunc`

<a id="error115"></a>
## "Mount error(115): Operation now in progress" when you mount Azure Files by using SMB 3.0

### Cause

Some Linux distributions don't yet support encryption features in SMB 3.0. Users might receive a "115" error message if they try to mount Azure Files by using SMB 3.0 because of a missing feature. SMB 3.0 with full encryption is supported only when you're using Ubuntu 16.04 or later.

### Solution

The encryption feature for SMB 3.0 for Linux was introduced in the 4.11 kernel. This feature enables mounting of an Azure file share from on-premises or from a different Azure region. This functionality is included in the Linux distributions listed in [Minimum recommended versions with corresponding mount capabilities (SMB version 2.1 vs SMB version 3.0)](storage-how-to-use-files-linux.md#minimum-recommended-versions-with-corresponding-mount-capabilities-smb-version-21-vs-smb-version-30). Other distributions require kernel 4.11 and later versions.

If your Linux SMB client doesn't support encryption, mount Azure Files by using SMB 2.1 from an Azure Linux VM that's in the same datacenter as the file share. Verify that the [Secure transfer required]( https://docs.microsoft.com/azure/storage/common/storage-require-secure-transfer) setting is disabled on the storage account. 

<a id="authorizationfailureportal"></a>
## Error “Authorization failure” when browsing to an Azure file share in the portal

When you browse to an Azure file share in the portal, you may receive the following error:

Authorization failure  
You do not have access

### Cause 1: Your user account does not have access to the storage account

### Solution for cause 1

Browse to the storage account where the Azure file share is located, click **Access control (IAM)** and verify your user account has access to the storage account. To learn more, see [How to secure your storage account with Role-Based Access Control (RBAC)](https://docs.microsoft.com/azure/storage/common/storage-security-guide#how-to-secure-your-storage-account-with-role-based-access-control-rbac).

### Cause 2: Virtual network or firewall rules are enabled on the storage account

### Solution for cause 2

Verify virtual network and firewall rules are configured properly on the storage account. To test if virtual network or firewall rules is causing the issue, temporarily change the setting on the storage account to **Allow access from all networks**. To learn more, see [Configure Azure Storage firewalls and virtual networks](https://docs.microsoft.com/azure/storage/common/storage-network-security).

<a id="open-handles"></a>
## Unable to delete a file or directory in an Azure file share

### Cause
This issue typically occurs if the file or directory has an open handle. 

### Solution

If the SMB clients have closed all open handles and the issue continues to occur, perform the following:

- Use the [Get-AzStorageFileHandle](https://docs.microsoft.com/powershell/module/az.storage/get-azstoragefilehandle) PowerShell cmdlet to view open handles.

- Use the [Close-AzStorageFileHandle](https://docs.microsoft.com/powershell/module/az.storage/close-azstoragefilehandle) PowerShell cmdlet to close open handles. 

> [!Note]  
> The Get-AzStorageFileHandle and Close-AzStorageFileHandle cmdlets are included in Az PowerShell module version 2.4 or later. To install the latest Az PowerShell module, see [Install the Azure PowerShell module](https://docs.microsoft.com/powershell/azure/install-az-ps).

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

If the **cache=strict** or **serverino** option is not present, unmount and mount Azure Files again by running the mount command from the [documentation](../storage-how-to-use-files-linux.md). Then, recheck that the **/etc/fstab** entry has the correct options.

### Cause 2: Throttling

It is possible you are experiencing throttling and your requests are being sent to a queue. You can verify this by leveraging [Azure Storage metrics in Azure Monitor](../common/storage-metrics-in-azure-monitor.md).

### Solution for cause 2

Ensure your app is within the [Azure Files scale targets](storage-files-scale-targets.md#azure-files-scale-targets).

<a id="timestampslost"></a>
## Time stamps were lost in copying files from Windows to Linux

On Linux/Unix platforms, the **cp -p** command fails if different users own file 1 and file 2.

### Cause

The force flag **f** in COPYFILE results in executing **cp -p -f** on Unix. This command also fails to preserve the time stamp of the file that you don't own.

### Workaround

Use the storage account user for copying the files:

- `Useadd : [storage account name]`
- `Passwd [storage account name]`
- `Su [storage account name]`
- `Cp -p filename.txt /share`

## ls: cannot access '&lt;path&gt;': Input/output error

When you try to list files in an Azure file share by using the ls command, the command hangs when listing files. You get the following error:

**ls: cannot access'&lt;path&gt;': Input/output error**


### Solution
Upgrade the Linux kernel to the following versions that have a fix for this problem:

- 4.4.87+
- 4.9.48+
- 4.12.11+
- All versions that are greater than or equal to 4.13

## Cannot create symbolic links - ln: failed to create symbolic link 't': Operation not supported

### Cause
By default, mounting Azure file shares on Linux by using CIFS doesn’t enable support for symbolic links (symlinks). You see an error like this:
```
ln -s linked -n t
ln: failed to create symbolic link 't': Operation not supported
```
### Solution
The Linux CIFS client doesn’t support creation of Windows-style symbolic links over the SMB 2 or 3 protocol. Currently, the Linux client supports another style of symbolic links called [Minshall+French symlinks](https://wiki.samba.org/index.php/UNIX_Extensions#Minshall.2BFrench_symlinks) for both create and follow operations. Customers who need symbolic links can use the "mfsymlinks" mount option. We recommend "mfsymlinks" because it's also the format that Macs use.

To use symlinks, add the following to the end of your CIFS mount command:

```
,mfsymlinks
```

So the command looks something like:

```
sudo mount -t cifs //<storage-account-name>.file.core.windows.net/<share-name> <mount-point> -o vers=<smb-version>,username=<storage-account-name>,password=<storage-account-key>,dir_mode=0777,file_mode=0777,serverino,mfsymlinks
```

You can then create symlinks as suggested on the [wiki](https://wiki.samba.org/index.php/UNIX_Extensions#Storing_symlinks_on_Windows_servers).

[!INCLUDE [storage-files-condition-headers](../../../includes/storage-files-condition-headers.md)]

<a id="error112"></a>
## "Mount error(112): Host is down" because of a reconnection time-out

A "112" mount error occurs on the Linux client when the client has been idle for a long time. After an extended idle time, the client disconnects and the connection times out.  

### Cause

The connection can be idle for the following reasons:

-	Network communication failures that prevent re-establishing a TCP connection to the server when the default "soft" mount option is used
-	Recent reconnection fixes that are not present in older kernels

### Solution

This reconnection problem in the Linux kernel is now fixed as part of the following changes:

- [Fix reconnect to not defer smb3 session reconnect long after socket reconnect](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/fs/cifs?id=4fcd1813e6404dd4420c7d12fb483f9320f0bf93)
- [Call echo service immediately after socket reconnect](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=b8c600120fc87d53642476f48c8055b38d6e14c7)
- [CIFS: Fix a possible memory corruption during reconnect](https://git.kernel.org/cgit/linux/kernel/git/torvalds/linux.git/commit/?id=53e0e11efe9289535b060a51d4cf37c25e0d0f2b)
- [CIFS: Fix a possible double locking of mutex during reconnect (for kernel v4.9 and later)](https://git.kernel.org/cgit/linux/kernel/git/torvalds/linux.git/commit/?id=96a988ffeb90dba33a71c3826086fe67c897a183)

However, these changes might not be ported yet to all the Linux distributions. This fix and other reconnection fixes can be found in the [Minimum recommended versions with corresponding mount capabilities (SMB version 2.1 vs SMB version 3.0)](storage-how-to-use-files-linux.md#minimum-recommended-versions-with-corresponding-mount-capabilities-smb-version-21-vs-smb-version-30) section of the [Use Azure Files with Linux](storage-how-to-use-files-linux.md) article. You can get this fix by upgrading to one of these recommended kernel versions.

### Workaround

You can work around this problem by specifying a hard mount. A hard mount forces the client to wait until a connection is established or until it's explicitly interrupted. You can use it to prevent errors because of network time-outs. However, this workaround might cause indefinite waits. Be prepared to stop connections as necessary.

If you can't upgrade to the latest kernel versions, you can work around this problem by keeping a file in the Azure file share that you write to every 30 seconds or less. This must be a write operation, such as rewriting the created or modified date on the file. Otherwise, you might get cached results, and your operation might not trigger the reconnection.

## Need help? Contact support.

If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your problem resolved quickly.
