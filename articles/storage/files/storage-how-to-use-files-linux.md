---
title: Use Azure Files with Linux | Microsoft Docs
description: Learn how to mount an Azure file share over SMB on Linux.
services: storage
author: roygara
ms.service: storage
ms.topic: article
ms.date: 03/29/2018
ms.author: rogarana
ms.subservice: files
---

# Use Azure Files with Linux

[Azure Files](storage-files-introduction.md) is Microsoft's easy to use cloud file system. Azure file shares can be mounted in Linux distributions using the [SMB kernel client](https://wiki.samba.org/index.php/LinuxCIFS). This article shows two ways to mount an Azure file share: on-demand with the `mount` command and on-boot by creating an entry in `/etc/fstab`.

> [!NOTE]  
> In order to mount an Azure file share outside of the Azure region it is hosted in, such as on-premises or in a different Azure region, the OS must support the encryption functionality of SMB 3.0.

## Prerequisites for mounting an Azure file share with Linux and the cifs-utils package
<a id="smb-client-reqs"></a>

* **An existing Azure storage account and file share**: In order to complete this article, you need to have a storage account and file share. If you haven't already created one, see one of our quickstarts on the subject: [Create file shares - CLI](storage-how-to-use-files-cli.md).

* **Your storage account name and key** You will need the storage account name and key in order to complete this article. If you created one using the CLI quickstart you should already have them, otherwise, consult the CLI quickstart that was linked earlier, in order to learn how to retrieve your storage account key.

* **Pick a Linux distribution to suit your mounting needs.**  
      Azure Files can be mounted either via SMB 2.1 and SMB 3.0. For connections coming from clients on-premises or in other Azure regions, you must use SMB 3.0; Azure Files will reject SMB 2.1 (or SMB 3.0 without encryption). If you're accessing the Azure file share from a VM within the same Azure region, you may access your file share using SMB 2.1, if and only if, *secure transfer required* is disabled for the storage account hosting the Azure file share. We always recommend requiring secure transfer and using only SMB 3.0 with encryption.

    SMB 3.0 encryption support was introduced in Linux kernel version 4.11 and has been backported to older kernel versions for popular Linux distributions. At the time of this document's publication, the following distributions from the Azure gallery support mounting option specified in the table headers. 

### Minimum recommended versions with corresponding mount capabilities (SMB version 2.1 vs SMB version 3.0)

|   | SMB 2.1 <br>(Mounts on VMs within same Azure region) | SMB 3.0 <br>(Mounts from on premises and cross-region) |
| --- | :---: | :---: |
| Ubuntu Server | 14.04+ | 16.04+ |
| RHEL | 7+ | 7.5+ |
| CentOS | 7+ |  7.5+ |
| Debian | 8+ |   |
| openSUSE | 13.2+ | 42.3+ |
| SUSE Linux Enterprise Server | 12 | 12 SP3+ |

If your Linux distribution is not listed here, you can check to see the Linux kernel version with the following command:

```bash
uname -r
```

* <a id="install-cifs-utils"></a>**The cifs-utils package is installed.**  
    The cifs-utils package can be installed using the package manager on the Linux distribution of your choice. 

    On **Ubuntu** and **Debian-based** distributions, use the `apt-get` package manager:

    ```bash
    sudo apt-get update
    sudo apt-get install cifs-utils
    ```

    On **RHEL** and **CentOS**, use the `yum` package manager:

    ```bash
    sudo yum install cifs-utils
    ```

    On **openSUSE**, use the `zypper` package manager:

    ```bash
    sudo zypper install cifs-utils
    ```

    On other distributions, use the appropriate package manager or [compile from source](https://wiki.samba.org/index.php/LinuxCIFS_utils#Download)

* **Decide on the directory/file permissions of the mounted share**: In the examples below, the permission `0777` is used to give read, write, and execute permissions to all users. You can replace it with other [chmod permissions](https://en.wikipedia.org/wiki/Chmod) as desired, though this will mean potentially restricting access. If you do use other permissions, you should consider also using uid and gid in order to retain access for local users and groups of your choice.

> [!NOTE]
> If you do not explicitly assign directory and file permission with dir_mode and file_mode, they will default to 0755.

* **Ensure port 445 is open**: SMB communicates over TCP port 445 - check to see if your firewall is not blocking TCP ports 445 from client machine.

## Mount the Azure file share on-demand with `mount`

1. **[Install the cifs-utils package for your Linux distribution](#install-cifs-utils)**.

1. **Create a folder for the mount point**: A folder for a mount point can be created anywhere on the file system, but it's common convention to create this under a new folder. For example, the following command creates a new directory, replace **<storage_account_name>** and **<file_share_name>** with the appropriate information for your environment:

    ```bash
    mkdir -p <storage_account_name>/<file_share_name>
    ```

1. **Use the mount command to mount the Azure file share**: Remember to replace **<storage_account_name>**, **<share_name>**, **<smb_version>**, **<storage_account_key>**, and **<mount_point>** with the appropriate information for your environment. If your Linux distribution supports SMB 3.0 with encryption (see [Understand SMB client requirements](#smb-client-reqs) for more information), use **3.0** for **<smb_version>**. For Linux distributions that do not support SMB 3.0 with encryption, use **2.1** for **<smb_version>**. An Azure file share can only be mounted outside of an Azure region (including on-premises or in a different Azure region) with SMB 3.0. If you like, you can change the directory and file permissions of your mounted share but, this would mean restricting access.

    ```bash
    sudo mount -t cifs //<storage_account_name>.file.core.windows.net/<share_name> <mount_point> -o vers=<smb_version>,username=<storage_account_name>,password=<storage_account_key>,dir_mode=0777,file_mode=0777,serverino
    ```

> [!Note]  
> When you are done using the Azure file share, you may use `sudo umount <mount_point>` to unmount the share.

## Create a persistent mount point for the Azure file share with `/etc/fstab`

1. **[Install the cifs-utils package for your Linux distribution](#install-cifs-utils)**.

1. **Create a folder for the mount point**: A folder for a mount point can be created anywhere on the file system, but it's common convention to create this under a new folder. Wherever you create this, note the absolute path of the folder. For example, the following command creates a new directory, replace **<storage_account_name>** and **<file_share_name>** with the appropriate information for your environment.

    ```bash
    sudo mkdir -p <storage_account_name>/<file_share_name>
    ```

1. **Create a credential file to store the username (the storage account name) and password (the storage account key) for the file share.** Replace **<storage_account_name>** and **<storage_account_key>** with the appropriate information for your environment.

    ```bash
    if [ ! -d "/etc/smbcredentials" ]; then
    sudo mkdir /etc/smbcredentials
    fi
    if [ ! -f "/etc/smbcredentials/<STORAGE ACCOUNT NAME>.cred" ]; then
    sudo bash -c 'echo "username=<STORAGE ACCOUNT NAME>" >> /etc/smbcredentials/<STORAGE ACCOUNT NAME>.cred'
    sudo bash -c 'echo "password=7wRbLU5ea4mgc<DRIVE LETTER>PIpUCNcuG9gk2W4S2tv7p0cTm62wXTK<DRIVE LETTER>CgJlBJPKYc4VMnwhyQd<DRIVE LETTER>UT<DRIVE LETTER>yR5/RtEHyT/EHtg2Q==" >> /etc/smbcredentials/<STORAGE ACCOUNT NAME>.cred'
    fi
    ```

1. **Change permissions on the credential file so only root can read or modify the password file.** Since the storage account key is essentially a super-administrator password for the storage account, setting the permissions on the file such that only root can access is important so that lower privilege users cannot retrieve the storage account key.   

    ```bash
    sudo chmod 600 /etc/smbcredentials/<storage_account_name>.cred
    ```

1. **Use the following command to append the following line to `/etc/fstab`**: Remember to replace **<storage_account_name>**, **<share_name>**, **<smb_version>**, and **<mount_point>** with the appropriate information for your environment. If your Linux distribution supports SMB 3.0 with encryption (see [Understand SMB client requirements](#smb-client-reqs) for more information), use **3.0** for **<smb_version>**. For Linux distributions that do not support SMB 3.0 with encryption, use **2.1** for **<smb_version>**. An Azure file share can only be mounted outside of an Azure region (including on-premises or in a different Azure region) with SMB 3.0.

    ```bash
    sudo bash -c 'echo "//<STORAGE ACCOUNT NAME>.file.core.windows.net/<FILE SHARE NAME> /mount/<STORAGE ACCOUNT NAME>/<FILE SHARE NAME> cifs nofail,vers=3.0,credentials=/etc/smbcredentials/<STORAGE ACCOUNT NAME>.cred,dir_mode=0777,file_mode=0777,serverino" >> /etc/fstab'

    sudo mount /mount/<STORAGE ACCOUNT NAME>/<FILE SHARE NAME>
    ```

> [!Note]  
> You can use `sudo mount -a` to mount the Azure file share after editing `/etc/fstab` instead of rebooting.

## Feedback

Linux users, we want to hear from you!

The Azure Files for Linux users' group provides a forum for you to share feedback as you evaluate and adopt File storage on Linux. Email [Azure Files Linux Users](mailto:azurefileslinuxusers@microsoft.com) to join the users' group.

## Next steps

See these links for more information about Azure Files:

* [Planning for an Azure Files deployment](storage-files-planning.md)
* [FAQ](../storage-files-faq.md)
* [Troubleshooting](storage-troubleshoot-linux-file-connection-problems.md)
