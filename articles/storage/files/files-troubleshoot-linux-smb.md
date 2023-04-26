---
title: Troubleshoot Azure Files issues in Linux (SMB)
description: Troubleshooting Azure Files issues in Linux. See general issues related to SMB Azure file shares when you connect from Linux clients, and see possible resolutions.
author: khdownie
ms.service: storage
ms.topic: troubleshooting
ms.date: 02/21/2023
ms.author: kendownie
ms.subservice: files
---
# Troubleshoot Azure Files issues in Linux (SMB)

This article lists common issues that can occur when using SMB Azure file shares with Linux clients. It also provides possible causes and resolutions for these problems.

You can use [AzFileDiagnostics](https://github.com/Azure-Samples/azure-files-samples/tree/master/AzFileDiagnostics/Linux) to automate symptom detection and ensure that the Linux client has the correct prerequisites. It helps set up your environment to get optimal performance. You can also find this information in the [Azure file shares troubleshooter](https://support.microsoft.com/help/4022301/troubleshooter-for-azure-files-shares).

> [!IMPORTANT]
> This article only applies to SMB shares. For details on NFS shares, see [Troubleshoot NFS Azure file shares](files-troubleshoot-linux-nfs.md).

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |


<a id="timestampslost"></a>
## Time stamps were lost in copying files from Windows to Linux

On Linux/Unix platforms, the **cp -p** command fails if different users own file 1 and file 2.

### Cause

The force flag **f** in COPYFILE results in executing **cp -p -f** on Unix. This command also fails to preserve the time stamp of the file that you don't own.

### Workaround

Use the storage account user for copying the files:

- `str_acc_name=[storage account name]`
- `sudo useradd $str_acc_name`
- `sudo passwd $str_acc_name`
- `su $str_acc_name`
- `cp -p filename.txt /share`

## ls: cannot access '&lt;path&gt;': Input/output error

When you try to list files in an Azure file share by using the ls command, the command hangs when listing files. You get the following error:

**ls: cannot access'&lt;path&gt;': Input/output error**


### Solution
Upgrade the Linux kernel to the following versions that have a fix for this problem:

- 4.4.87+
- 4.9.48+
- 4.12.11+
- All versions that are greater than or equal to 4.13

## Can't create symbolic links - ln: failed to create symbolic link 't': Operation not supported

### Cause
By default, mounting Azure file shares on Linux by using SMB doesn't enable support for symbolic links (symlinks). You might see an error like this:

```bash
sudo ln -s linked -n t
```
```output
ln: failed to create symbolic link 't': Operation not supported
```

### Solution
The Linux SMB client doesn't support creating Windows-style symbolic links over the SMB 2 or 3 protocol. Currently, the Linux client supports another style of symbolic links called [Minshall+French symlinks](https://wiki.samba.org/index.php/UNIX_Extensions#Minshall.2BFrench_symlinks) for both create and follow operations. Customers who need symbolic links can use the "mfsymlinks" mount option. We recommend "mfsymlinks" because it's also the format that Macs use.

To use symlinks, add the following to the end of your SMB mount command:

```bash
,mfsymlinks
```

So the command looks something like:

```bash
sudo mount -t cifs //<storage-account-name>.file.core.windows.net/<share-name> <mount-point> -o vers=<smb-version>,username=<storage-account-name>,password=<storage-account-key>,dir_mode=0777,file_mode=0777,serverino,mfsymlinks
```

You can then create symlinks as suggested on the [wiki](https://wiki.samba.org/index.php/UNIX_Extensions#Storing_symlinks_on_Windows_servers).

## Unable to access folders or files which name has a space or a dot at the end

You can't access folders or files from the Azure file share while mounted on Linux. Commands like du and ls and/or third-party applications might fail with a "No such file or directory" error while accessing the share; however, you're able to upload files to these folders via the Azure portal.

### Cause

The folders or files were uploaded from a system that encodes the characters at the end of the name to a different character. Files uploaded from a Macintosh computer may have a "0xF028" or "0xF029" character instead of 0x20 (space) or 0X2E (dot).

### Solution

Use the mapchars option on the share when mounting the share on Linux: 

instead of :

```bash
sudo mount -t cifs $smbPath $mntPath -o vers=3.0,username=$storageAccountName,password=$storageAccountKey,serverino
```

use:

```bash
sudo mount -t cifs $smbPath $mntPath -o vers=3.0,username=$storageAccountName,password=$storageAccountKey,serverino,mapchars
```

<a id="dns-account-migration"></a>
## DNS issues with live migration of Azure storage accounts

File I/Os on the mounted filesystem start giving "Host is down" or "Permission denied" errors. Linux dmesg logs on the client show repeated errors like:

```output
Status code returned 0xc000006d STATUS_LOGON_FAILURE
cifs_setup_session: 2 callbacks suppressed
CIFS VFS: \\contoso.file.core.windows.net Send error in SessSetup = -13
```
 
You'll also see that the server FQDN now resolves to a different IP address than what it’s currently connected to.

### Cause

For capacity load balancing purposes, storage accounts are sometimes live-migrated from one storage cluster to another. Account migration triggers Azure Files traffic to be redirected from the source cluster to the destination cluster by updating the DNS mappings to point to the destination cluster. This blocks all traffic to the source cluster from that account. It’s expected that the SMB client picks up the DNS updates and redirects further traffic to the destination cluster. However, due to a bug in the Linux SMB kernel client, this redirection doesn't take effect. As a result, the data traffic keeps going to the source cluster, which has stopped serving this account post migration.

### Workaround

You can mitigate this issue by rebooting the client OS, but you might run into the issue again if you don't upgrade your client OS to a Linux distro version with account migration support. Note that umount and remount of the share may appear to fix the issue temporarily.

### Solution

For a permanent fix, upgrade your client OS to a Linux distro version with account migration support. Several fixes for the Linux SMB kernel client have been submitted to the mainline Linux kernel. Kernel version 5.15+ and Keyutils-1.6.2+ have the fixes. Some distros have backported these fixes, and you can check if the following fixes exist in the distro version you're using:

[cifs: On cifs_reconnect, resolve the hostname again](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=4e456b30f78c429b183db420e23b26cde7e03a78)

[cifs: use the expiry output of dns_query to schedule next resolution](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=506c1da44fee32ba1d3a70413289ad58c772bba6)

[cifs: set a minimum of 120s for next dns resolution](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=4ac0536f8874a903a72bddc57eb88db774261e3a)

[cifs: To match file servers, make sure the server hostname matches](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=7be3248f313930ff3d3436d4e9ddbe9fccc1f541)

[cifs: fix memory leak of smb3_fs_context_dup::server_hostname](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=869da64d071142d4ed562a3e909deb18e4e72c4e)

[dns: Apply a default TTL to records obtained from getaddrinfo()](https://git.kernel.org/pub/scm/linux/kernel/git/dhowells/keyutils.git/commit/?id=75e7568dc516db698093b33ea273e1b4a30b70be)

## Need help?

If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your problem resolved quickly.

## See also
- [Troubleshoot Azure Files](files-troubleshoot.md)
- [Troubleshoot Azure Files performance](files-troubleshoot-performance.md)
- [Troubleshoot Azure Files connectivity (SMB)](files-troubleshoot-smb-connectivity.md)
- [Troubleshoot Azure Files authentication and authorization (SMB)](files-troubleshoot-smb-authentication.md)
- [Troubleshoot Azure Files general NFS issues on Linux](files-troubleshoot-linux-nfs.md)
- [Troubleshoot Azure File Sync issues](../file-sync/file-sync-troubleshoot.md)
