---
title: Troubleshoot Azure File storage problems in Linux | Microsoft Docs
description: Troubleshooting Azure File storage problems in Linux
services: storage
documentationcenter: ''
author: genlin
manager: willchen
editor: na
tags: storage

ms.service: storage
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/24/2017
ms.author: genli

---
# Troubleshoot Azure File storage problems in Linux

This article lists common problems that are related to Microsoft Azure File storage when you connect from Linux clients. It also provides possible causes and resolutions for these problems.

<a id="permissiondenied"></a>
## "[permission denied] Disk quota exceeded" when you try to open a file

In Linux, you receive an error message that resembles the following:

**<filename> [permission denied] Disk quota exceeded**

### Cause

You have reached the upper limit of concurrent open handles that are allowed for a file.

### Solution

Reduce the number of concurrent open handles by closing some handles, and then retry the operation. For more information, see [Microsoft Azure Storage performance and scalability checklist](storage-performance-checklist.md).

<a id="slowfilecopying"></a>
## Slow file copying to and from Azure File storage in Linux

-	If you don’t have a specific minimum I/O size requirement, we recommend that you use 1 MB as the I/O size for optimal performance.
-	If you know the final size of a file that you are extending by using writes, and your software doesn’t experience compatibility problems when an unwritten tail on the file contains zeros, then set the file size in advance instead of making every write an extending write.
-	Use the right copy method:
    -	Use [AzCopy](storage-use-azcopy.md#file-copy) for any transfer between two file shares.
    -	Use [Robocopy](https://blogs.msdn.microsoft.com/granth/2009/12/07/multi-threaded-robocopy-for-faster-copies/) between file shares on an on-premises computer.

<a id="error112"></a>
## "Mount error(112): Host is down" because of a reconnection time-out

A "112" mount error occurs on the Linux client when the client has been idle for a long time. After extended idle time, the client disconnects and the connection times out.  

### Cause

The connection can be idle for the following reasons:

-	Network communication failures that prevent re-establishing a TCP connection to the server when the default “soft” mount option is used
-	Recent reconnection fixes that are not present in older kernels

### Solution

This reconnection problem in the Linux kernel is now fixed as part of the following changes:

- [Fix reconnect to not defer smb3 session reconnect long after socket reconnect](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/fs/cifs?id=4fcd1813e6404dd4420c7d12fb483f9320f0bf93)
-	[Call echo service immediately after socket reconnect](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=b8c600120fc87d53642476f48c8055b38d6e14c7)
-	[CIFS: Fix a possible memory corruption during reconnect](https://git.kernel.org/cgit/linux/kernel/git/torvalds/linux.git/commit/?id=53e0e11efe9289535b060a51d4cf37c25e0d0f2b)
-	[CIFS: Fix a possible double locking of mutex during reconnect (for kernel v4.9 and later)](https://git.kernel.org/cgit/linux/kernel/git/torvalds/linux.git/commit/?id=96a988ffeb90dba33a71c3826086fe67c897a183)

However, these changes might not be ported yet to all the Linux distributions. This fix and other reconnection fixes are made in the following popular Linux kernels: 4.4.40, 4.8.16, and 4.9.1. You can get this fix by upgrading to one of these recommended kernel versions.

### Workaround

You can work around this problem by specifying a hard mount. This forces the client to wait until a connection is established or until it’s explicitly interrupted and can be used to prevent errors because of network time-outs. However, this workaround might cause indefinite waits. Be prepared to stop connections as necessary.

If you cannot upgrade to the latest kernel versions, you can work around this problem by keeping a file in the Azure file share that you write to every 30 seconds or less. This must be a write operation, such as rewriting the created or modified date on the file. Otherwise, you might get cached results, and your operation might not trigger the reconnection.

<a id="error115"></a>
## "Mount error(115): Operation now in progress" when you mount Azure File storage by using SMB 3.0

### Cause

Linux distributions do not yet support encryption features in SMB 3.0. In some distributions, users might receive a "115" error message if they try to mount Azure File storage by using SMB 3.0 because of a missing feature.

### Solution

If the Linux SMB client does not support encryption, mount Azure File storage by using SMB 2.1 from an Azure Linux VM that's in the same datacenter as the File storage account.

<a id="slowperformance"></a>
## Slow performance on an Azure file share mounted on a Linux VM

### Cause

One possible cause of slow performance is disabled caching.

### Solution

To check whether caching is disabled, look for the **cache=** entry. 

**Cache=none** indicates that caching is disabled.  Remount the share by using the default mount command or by explicitly adding the **cache=strict** option to the mount command to ensure that default caching or "strict" caching mode is enabled.

In some scenarios, the **serverino** mount option can cause the **ls** command to run stat against every directory entry. This behavior results in performance degradation when you're listing a big directory. You can check the mount options in your **/etc/fstab** entry:

`//azureuser.file.core.windows.net/cifs /cifs cifs vers=3.0,serverino,username=xxx,password=xxx,dir_mode=0777,file_mode=0777`

You can also check whether the correct options are being used by running the  **sudo mount | grep cifs** command and checking its output, such as the following example output:

`//mabiccacifs.file.core.windows.net/cifs on /cifs type cifs (rw,relatime,vers=3.0,sec=ntlmssp,cache=strict,username=xxx,domain=X,uid=0,noforceuid,gid=0,noforcegid,addr=192.168.10.1,file_mode=0777, dir_mode=0777,persistenthandles,nounix,serverino,mapposix,rsize=1048576,wsize=1048576,actimeo=1)`

If the **cache=strict** or **serverino** option is not present, unmount and mount Azure File storage again by running the mount command from the [documentation](storage-how-to-use-files-linux.md#mount-the-file-share). Then, recheck that the **/etc/fstab** entry has the correct options.

<a id="error11"></a>
## "Mount error(11): Resource temporarily unavailable" when you're mounting to an Ubuntu 4.8 kernel

### Cause

In the Ubuntu 16.10 kernel (version 4.8), the client is documented to support encryption but actually doesn’t.

### Solution

Until Ubuntu 16.10 is fixed, specify the `vers=2.1` mount option or use Ubuntu 16.04.

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

## Need help? Contact support.

If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your problem resolved quickly.
