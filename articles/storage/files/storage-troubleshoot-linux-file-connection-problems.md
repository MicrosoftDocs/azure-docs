---
title: Troubleshoot Azure Files problems in Linux | Microsoft Docs
description: Troubleshooting Azure Files problems in Linux
services: storage
author: jeffpatt24
tags: storage
ms.service: storage
ms.topic: article
ms.date: 05/11/2018
ms.author: jeffpatt
ms.component: files
---
# Troubleshoot Azure Files problems in Linux

This article lists common problems that are related to Microsoft Azure Files when you connect from Linux clients. It also provides possible causes and resolutions for these problems.

<a id="permissiondenied"></a>
## "[permission denied] Disk quota exceeded" when you try to open a file

In Linux, you receive an error message that resembles the following:

**<filename> [permission denied] Disk quota exceeded**

### Cause

You have reached the upper limit of concurrent open handles that are allowed for a file.

### Solution

Reduce the number of concurrent open handles by closing some handles, and then retry the operation. For more information, see [Microsoft Azure Storage performance and scalability checklist](../common/storage-performance-checklist.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).

<a id="slowfilecopying"></a>
## Slow file copying to and from Azure Files in Linux

- If you don't have a specific minimum I/O size requirement, we recommend that you use 1 MiB as the I/O size for optimal performance.
- If you know the final size of a file that you are extending by using writes, and your software doesn't experience compatibility problems when an unwritten tail on the file contains zeros, then set the file size in advance instead of making every write an extending write.
- Use the right copy method:
    - Use [AzCopy](../common/storage-use-azcopy.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json) for any transfer between two file shares.
    - Use [Robocopy](https://blogs.msdn.microsoft.com/granth/2009/12/07/multi-threaded-robocopy-for-faster-copies/) between file shares on an on-premises computer.

<a id="error112"></a>
## "Mount error(112): Host is down" because of a reconnection time-out

A "112" mount error occurs on the Linux client when the client has been idle for a long time. After extended idle time, the client disconnects and the connection times out.  

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

However, these changes might not be ported yet to all the Linux distributions. This fix and other reconnection fixes are made in the following popular Linux kernels: 4.4.40, 4.8.16, and 4.9.1. You can get this fix by upgrading to one of these recommended kernel versions.

### Workaround

You can work around this problem by specifying a hard mount. This forces the client to wait until a connection is established or until it's explicitly interrupted and can be used to prevent errors because of network time-outs. However, this workaround might cause indefinite waits. Be prepared to stop connections as necessary.

If you cannot upgrade to the latest kernel versions, you can work around this problem by keeping a file in the Azure file share that you write to every 30 seconds or less. This must be a write operation, such as rewriting the created or modified date on the file. Otherwise, you might get cached results, and your operation might not trigger the reconnection.

<a id="error115"></a>
## "Mount error(115): Operation now in progress" when you mount Azure Files by using SMB 3.0

### Cause

Some Linux distributions do not yet support encryption features in SMB 3.0 and users might receive a "115" error message if they try to mount Azure Files by using SMB 3.0 because of a missing feature. SMB 3.0 with full encryption is only supported at the moment when using Ubuntu 16.04 or later.

### Solution

Encryption feature for SMB 3.0 for Linux was introduced in 4.11 kernel. This feature enables mounting of Azure file share from on-premises or a different Azure region. At the time of publishing, this functionality has been backported to Ubuntu 17.04 and Ubuntu 16.10. If your Linux SMB client does not support encryption, mount Azure Files by using SMB 2.1 from an Azure Linux VM that's in the same datacenter as the File storage account.

<a id="slowperformance"></a>
## Slow performance on an Azure file share mounted on a Linux VM

### Cause

One possible cause of slow performance is disabled caching.

### Solution

To check whether caching is disabled, look for the **cache=** entry. 

**Cache=none** indicates that caching is disabled.  Remount the share by using the default mount command or by explicitly adding the **cache=strict** option to the mount command to ensure that default caching or "strict" caching mode is enabled.

In some scenarios, the **serverino** mount option can cause the **ls** command to run stat against every directory entry. This behavior results in performance degradation when you're listing a big directory. You can check the mount options in your **/etc/fstab** entry:

`//azureuser.file.core.windows.net/cifs /cifs cifs vers=2.1,serverino,username=xxx,password=xxx,dir_mode=0777,file_mode=0777`

You can also check whether the correct options are being used by running the  **sudo mount | grep cifs** command and checking its output, such as the following example output:

`//azureuser.file.core.windows.net/cifs on /cifs type cifs (rw,relatime,vers=2.1,sec=ntlmssp,cache=strict,username=xxx,domain=X,uid=0,noforceuid,gid=0,noforcegid,addr=192.168.10.1,file_mode=0777, dir_mode=0777,persistenthandles,nounix,serverino,mapposix,rsize=1048576,wsize=1048576,actimeo=1)`

If the **cache=strict** or **serverino** option is not present, unmount and mount Azure Files again by running the mount command from the [documentation](../storage-how-to-use-files-linux.md). Then, recheck that the **/etc/fstab** entry has the correct options.

<a id="timestampslost"></a>
## Time stamps were lost in copying files from Windows to Linux

On Linux/Unix platforms, the **cp -p** command fails if file 1 and file 2 are owned by different users.

### Cause

The force flag **f** in COPYFILE results in executing **cp -p -f** on Unix. This command also fails to preserve the time stamp of the file that you don't own.

### Workaround

Use the storage account user for copying the files:

- `Useadd : [storage account name]`
- `Passwd [storage account name]`
- `Su [storage account name]`
- `Cp -p filename.txt /share`

## Cannot connect or mount an Azure file share

### Cause

Common causes for this issue are:


- You are using an incompatible Linux distribution client. We recommend you use the following Linux Distributions to connect to Azure file share:

* **Minimum recommended versions with corresponding mount capabilities (SMB version 2.1 vs SMB version 3.0)**    
    
    |   | SMB 2.1 <br>(Mounts on VMs within same Azure region) | SMB 3.0 <br>(Mounts from on-premises and cross-region) |
    | --- | :---: | :---: |
    | Ubuntu Server | 14.04+ | 16.04+ |
    | RHEL | 7+ | 7.5+ |
    | CentOS | 7+ |  7.5+ |
    | Debian | 8+ |   |
    | openSUSE | 13.2+ | 42.3+ |
    | SUSE Linux Enterprise Server | 12 | 12 SP3+ |

- CIFS-utils are not installed on the client.
- The minimum SMB/CIFS version 2.1 is not installed on the client.
- SMB 3.0 Encryption is not supported on the client. SMB 3.0 Encryption is available in Ubuntu 16.4 and later version, SUSE 12.3 and later version. Other distributions require kernel 4.11 and later version.
- You are trying to connect to a storage account over TCP port 445 that is not supported.
- You are trying try to connect to Azure file share from an Azure VM, and the VM is not located in the same region as Storage account.

### Solution

To resolve the issue, use the [Troubleshooting tool for Azure Files mounting errors on Linux](https://gallery.technet.microsoft.com/Troubleshooting-tool-for-02184089). This tool helps you to validate the client running environment, detect the incompatible client configuration that would cause access failure for Azure Files, gives prescriptive guidance on self-fix, and collects the diagnostics traces.

## ls: cannot access '&lt;path&gt;': Input/output error

When you try to list files in an Azure file share by using ls command, ls command hangs when listing files you receive the following error:

**ls: cannot access'&lt;path&gt;': Input/output error**


### Solution
Upgrade the Linux kernel to the following versions that have fix for this issue:

- 4.4.87+
- 4.9.48+
- 4.12.11+
- All versions that is greater or equal to 4.13

## Cannot create symbolic links - ln: failed to create symbolic link 't': Operation not supported

### Cause
By default mounting Azure File Shares on Linux using CIFS doesn’t enable support for symlinks. You’ll see an error link this:
```
ln -s linked -n t
ln: failed to create symbolic link 't': Operation not supported
```
### Solution
The Linux CIFS client doesn’t support creation of Windows style symbolic links over SMB2/3 protocol. Currently Linux client supports another style of symbolic links called [Mishall+French symlinks] (https://wiki.samba.org/index.php/UNIX_Extensions#Minshall.2BFrench_symlinks) for both create and follow operations. Customers who need symbolic links can use "mfsymlinks" mount option. “mfsymlinks” are usually recommended because that is also the format used by Macs.

To be able to use symlinks, add the following to the end of your CIFS mount command:

```
,mfsymlinks
```

So the command will look something like:

```
sudo mount -t cifs //<storage-account-name>.file.core.windows.net/<share-name> <mount-point> -o vers=<smb-version>,username=<storage-account-name>,password=<storage-account-key>,dir_mode=0777,file_mode=0777,serverino,mfsynlinks
```

Once added, you will be able to create symlinks as suggested on the [Wiki](https://wiki.samba.org/index.php/UNIX_Extensions#Storing_symlinks_on_Windows_servers).

## Need help? Contact support.

If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your problem resolved quickly.
