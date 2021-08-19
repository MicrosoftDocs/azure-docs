---
title: Secure your Azure and on-premises environments by removing SMB 1 on Linux | Microsoft Docs
description: Azure Files supports SMB 3.x and SMB 2.1, not insecure legacy versions of SMB such as SMB 1. Before connecting to an Azure file share, you may wish to disable older versions of SMB such as SMB 1.
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 05/19/2021
ms.author: rogarana
ms.subservice: files 
---

# Remove SMB 1 on Linux
Many organizations and internet service providers (ISPs) block the port that SMB uses to communicate, port 445. This practice originates from security guidance about legacy and deprecated versions of the SMB protocol. Although SMB 3.x is an internet-safe protocol, older versions of SMB, especially SMB 1 aren't. SMB 1, also known as CIFS (Common Internet File System), is included with many Linux distributions. 

SMB 1 is an outdated, inefficient, and insecure protocol. The good news is that Azure Files does not support SMB 1, and starting with Linux kernel version 4.18, Linux makes it possible to disable SMB 1. We always [strongly recommend](https://aka.ms/stopusingsmb1) disabling the SMB 1 on your Linux clients before using SMB file shares in production.

## Linux distribution status
Starting with Linux kernel 4.18, the SMB kernel module, called `cifs` for legacy reasons, exposes a new module parameter (often referred to as *parm* by various external documentation), called `disable_legacy_dialects`. Although introduced in Linux kernel 4.18, some vendors have backported this change to older kernels that they support. For convenience, the following table details the availability of this module parameter on common Linux distributions.

| Distribution | Can disable SMB 1 |
|--------------|-------------------|
| Ubuntu 14.04-16.04 | No |
| Ubuntu 18.04 | Yes |
| Ubuntu 19.04+ | Yes |
| Debian 8-9 | No |
| Debian 10+ | Yes |
| Fedora 29+ | Yes |
| CentOS 7 | No | 
| CentOS 8+ | Yes |
| Red Hat Enterprise Linux 6.x-7.x | No |
| Red Hat Enterprise Linux 8+ | Yes |
| openSUSE Leap 15.0 | No |
| openSUSE Leap 15.1+ | Yes |
| openSUSE Tumbleweed | Yes |
| SUSE Linux Enterprise 11.x-12.x | No |
| SUSE Linux Enterprise 15 | No |
| SUSE Linux Enterprise 15.1 | No |

You can check to see if your Linux distribution supports the `disable_legacy_dialects` module parameter via the following command:

```bash
sudo modinfo -p cifs | grep disable_legacy_dialects
```

This command should output the following message:

```output
disable_legacy_dialects: To improve security it may be helpful to restrict the ability to override the default dialects (SMB2.1, SMB3 and SMB3.02) on mount with old dialects (CIFS/SMB1 and SMB2) since vers=1.0 (CIFS/SMB1) and vers=2.0 are weaker and less secure. Default: n/N/0 (bool)
```

## Remove SMB 1
Before disabling SMB 1, confirm that the SMB module is not currently loaded on your system (this happens automatically if you have mounted an SMB share). You can do this with the following command, which should output nothing if SMB is not loaded:

```bash
lsmod | grep cifs
```

To unload the module, first unmount all SMB shares (using the `umount` command as described above). You can identify all the mounted SMB shares on your system with the following command:

```bash
mount | grep cifs
```

Once you have unmounted all SMB file shares, it's safe to unload the module. You can do this with the `modprobe` command:

```bash
sudo modprobe -r cifs
```

You can manually load the module with SMB 1 unloaded using the `modprobe` command:

```bash
sudo modprobe cifs disable_legacy_dialects=Y
```

Finally, you can check the SMB module has been loaded with the parameter by looking at the loaded parameters in `/sys/module/cifs/parameters`:

```bash
cat /sys/module/cifs/parameters/disable_legacy_dialects
```

To persistently disable SMB 1 on Ubuntu and Debian-based distributions, you must create a new file (if you don't already have custom options for other modules) called `/etc/modprobe.d/local.conf` with the setting. You can do this with the following command:

```bash
echo "options cifs disable_legacy_dialects=Y" | sudo tee -a /etc/modprobe.d/local.conf > /dev/null
```

You can verify that this has worked by loading the SMB module:

```bash
sudo modprobe cifs
cat /sys/module/cifs/parameters/disable_legacy_dialects
```

## Next steps
See these links for more information about Azure Files:

- [Planning for an Azure Files deployment](storage-files-planning.md)
- [Use Azure Files with Linux](storage-how-to-use-files-linux.md)
- [Troubleshooting](storage-troubleshoot-linux-file-connection-problems.md)