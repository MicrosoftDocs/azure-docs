---
title: Use Azure Files with Linux | Microsoft Docs
description: Learn how to mount an Azure file share over SMB on Linux. See the list of prerequisites. Review SMB security considerations on Linux clients.
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 05/05/2021
ms.author: rogarana
ms.subservice: files
---

# Use Azure Files with Linux
[Azure Files](storage-files-introduction.md) is Microsoft's easy to use cloud file system. Azure file shares can be mounted in Linux distributions using the [SMB kernel client](https://wiki.samba.org/index.php/LinuxCIFS).

The recommended way to mount an Azure file share on Linux is using SMB 3.1.1. By default, Azure Files requires encryption in transit, which is supported by SMB 3.0+. Azure Files also supports SMB 2.1, which doesn't support encryption in transit, but you may not mount Azure file shares with SMB 2.1 from another Azure region or on-premises for security reasons. Unless your application specifically requires SMB 2.1, use SMB 3.1.1.

| Distribution | SMB 3.1.1 | SMB 3.0 |
|-|-----------|---------|
| Linux kernel version | <ul><li>Basic 3.1.1 support: 4.17</li><li>Default mount: 5.0</li><li>AES-128-GCM encryption: 5.3</li></ul> | <ul><li>Basic 3.0 support: 3.12</li><li>AES-128-CCM encryption: 4.11</li></ul> |
| [Ubuntu](https://wiki.ubuntu.com/Releases) | AES-128-GCM encryption: 18.04.5 LTS+ | AES-128-CCM encryption: 16.04.4 LTS+ |
| [Red Hat Enterprise Linux (RHEL)](https://access.redhat.com/articles/3078) | <ul><li>Basic: 8.0+</li><li>Default mount: 8.2+</li><li>AES-128-GCM encryption: 8.2+</li></ul> | 7.5+ |
| [Debian](https://www.debian.org/releases/) | Basic: 10+ | AES-128-CCM encryption: 10+ |
| [SUSE Linux Enterprise Server](https://www.suse.com/support/kb/doc/?id=000019587) | AES-128-GCM encryption: 15 SP2+ | AES-128-CCM encryption: 12 SP2+ |

If your Linux distribution isn't listed in the above table, you can check the Linux kernel version with the `uname` command:

```bash
uname -r
```

> [!Note]  
> SMB 2.1 support was added to Linux kernel version 3.7. If you are using a version of the Linux kernel after 3.7, it should support SMB 2.1.

## Prerequisites
<a id="smb-client-reqs"></a>

* <a id="install-cifs-utils"></a>**Ensure the cifs-utils package is installed.**  
    The cifs-utils package can be installed using the package manager on the Linux distribution of your choice. 

    On **Ubuntu** and **Debian**, use the `apt` package manager:

    ```bash
    sudo apt update
    sudo apt install cifs-utils
    ```

    On **Red Hat Enterprise Linux 8+** use the `dnf` package manager:

    ```bash
    sudo dnf install cifs-utils
    ```

    On older versions of **Red Hat Enterprise Linux** use the `yum` package manager:

    ```bash
    sudo yum install cifs-utils 
    ```

    On **SUSE Linux Enterprise Server**, use the `zypper` package manager:

    ```bash
    sudo zypper install cifs-utils
    ```

    On other distributions, use the appropriate package manager or [compile from source](https://wiki.samba.org/index.php/LinuxCIFS_utils#Download).

* **The most recent version of the Azure Command Line Interface (CLI).** For more information on how to install the Azure CLI, see [Install the Azure CLI](/cli/azure/install-azure-cli) and select your operating system. If you prefer to use the Azure PowerShell module in PowerShell 6+, you may, however the instructions in this article are for the Azure CLI.

* **Ensure port 445 is open**: SMB communicates over TCP port 445 - check to see if your firewall is not blocking TCP ports 445 from client machine.  Replace `<your-resource-group>` and `<your-storage-account>` then run the following script:

    ```bash
    resourceGroupName="<your-resource-group>"
    storageAccountName="<your-storage-account>"
    
    # This command assumes you have logged in with az login
    httpEndpoint=$(az storage account show \
        --resource-group $resourceGroupName \
        --name $storageAccountName \
        --query "primaryEndpoints.file" | tr -d '"')
    smbPath=$(echo $httpEndpoint | cut -c7-$(expr length $httpEndpoint))
    fileHost=$(echo $smbPath | tr -d "/")

    nc -zvw3 $fileHost 445
    ```

    If the connection was successful, you should see something similar to the following output:

    ```ouput
    Connection to <your-storage-account> 445 port [tcp/microsoft-ds] succeeded!
    ```

    If you are unable to open up port 445 on your corporate network or are blocked from doing so by an ISP, you may use a VPN connection or ExpressRoute to work around port 445. For more information, see [Networking considerations for direct Azure file share access](storage-files-networking-overview.md).

## Mount the Azure file share on-demand with mount
When you mount a file share on a Linux OS, your remote file share is represented as a folder in your local file system. You can mount file shares to anywhere on your system. The following example mounts under the `/mount` path. You can change this to your preferred path you want by modifying the `$mntRoot` variable.

Replace `<resource-group-name>`, `<storage-account-name>`, and `<file-share-name>` with the appropriate information for your environment:

```bash
resourceGroupName="<resource-group-name>"
storageAccountName="<storage-account-name>"
fileShareName="<file-share-name>"

mntRoot="/mount"
mntPath="$mntRoot/$storageAccountName/$fileShareName"

sudo mkdir -p $mntPath
```

Next, mount the file share using the `mount` command. In the following example, the `$smbPath` command is populated using the fully qualified domain name for the storage account's file endpoint and `$storageAccountKey` is populated with the storage account key. 

# [SMB 3.1.1](#tab/smb311)
> [!Note]  
> Starting in Linux kernel version 5.0, SMB 3.1.1 is the default negotiated protocol. If you're using a version of the Linux kernel older than 5.0, specify `vers=3.1.1` in the mount options list.  

```bash
# This command assumes you have logged in with az login
httpEndpoint=$(az storage account show \
    --resource-group $resourceGroupName \
    --name $storageAccountName \
    --query "primaryEndpoints.file" | tr -d '"')
smbPath=$(echo $httpEndpoint | cut -c7-$(expr length $httpEndpoint))$fileShareName

storageAccountKey=$(az storage account keys list \
    --resource-group $resourceGroupName \
    --account-name $storageAccountName \
    --query "[0].value" | tr -d '"')

sudo mount -t cifs $smbPath $mntPath -o username=$storageAccountName,password=$storageAccountKey,serverino
```

# [SMB 3.0](#tab/smb30)
```bash
# This command assumes you have logged in with az login
httpEndpoint=$(az storage account show \
    --resource-group $resourceGroupName \
    --name $storageAccountName \
    --query "primaryEndpoints.file" | tr -d '"')
smbPath=$(echo $httpEndpoint | cut -c7-$(expr length $httpEndpoint))$fileShareName

storageAccountKey=$(az storage account keys list \
    --resource-group $resourceGroupName \
    --account-name $storageAccountName \
    --query "[0].value" | tr -d '"')

sudo mount -t cifs $smbPath $mntPath -o vers=3.0,username=$storageAccountName,password=$storageAccountKey,serverino
```

# [SMB 2.1](#tab/smb21)
```bash
# This command assumes you have logged in with az login
httpEndpoint=$(az storage account show \
    --resource-group $resourceGroupName \
    --name $storageAccountName \
    --query "primaryEndpoints.file" | tr -d '"')
smbPath=$(echo $httpEndpoint | cut -c7-$(expr length $httpEndpoint))$fileShareName

storageAccountKey=$(az storage account keys list \
    --resource-group $resourceGroupName \
    --account-name $storageAccountName \
    --query "[0].value" | tr -d '"')

sudo mount -t cifs $smbPath $mntPath -o vers=2.1,username=$storageAccountName,password=$storageAccountKey,serverino
```

---

You can use `uid`/`gid` or `dir_mode` and `file_mode` in the mount options for the `mount` command to set permissions. For more information on how to set permissions, see [UNIX numeric notation](https://en.wikipedia.org/wiki/File_system_permissions#Numeric_notation) on Wikipedia.

You can also mount the same Azure file share to multiple mount points if desired. When you are done using the Azure file share, use `sudo umount $mntPath` to unmount the share.

## Automatically mount file shares
When you mount a file share on a Linux OS, your remote file share is represented as a folder in your local file system. You can mount file shares to anywhere on your system. The following example mounts under the `/mount` path. You can change this to your preferred path you want by modifying the `$mntRoot` variable.

```bash
mntRoot="/mount"
sudo mkdir -p $mntRoot
```

To mount an Azure file share on Linux, use the storage account name as the username of the file share, and the storage account key as the password. Since the storage account credentials may change over time, you should store the credentials for the storage account separately from the mount configuration. 

The following example shows how to create a file to store the credentials. Remember to replace `<resource-group-name>` and `<storage-account-name>` with the appropriate information for your environment.

```bash
resourceGroupName="<resource-group-name>"
storageAccountName="<storage-account-name>"

# Create a folder to store the credentials for this storage account and
# any other that you might set up.
credentialRoot="/etc/smbcredentials"
sudo mkdir -p "/etc/smbcredentials"

# Get the storage account key for the indicated storage account.
# You must be logged in with az login and your user identity must have 
# permissions to list the storage account keys for this command to work.
storageAccountKey=$(az storage account keys list \
    --resource-group $resourceGroupName \
    --account-name $storageAccountName \
    --query "[0].value" | tr -d '"')

# Create the credential file for this individual storage account
smbCredentialFile="$credentialRoot/$storageAccountName.cred"
if [ ! -f $smbCredentialFile ]; then
    echo "username=$storageAccountName" | sudo tee $smbCredentialFile > /dev/null
    echo "password=$storageAccountKey" | sudo tee -a $smbCredentialFile > /dev/null
else 
    echo "The credential file $smbCredentialFile already exists, and was not modified."
fi

# Change permissions on the credential file so only root can read or modify the password file.
sudo chmod 600 $smbCredentialFile
```

To automatically mount a file share, you have a choice between using a static mount via the `/etc/fstab` utility or using a dynamic mount via the `autofs` utility. 

### Static mount with /etc/fstab
Using the earlier environment, create a folder for your storage account/file share under your mount folder. Replace `<file-share-name>` with the appropriate name of your Azure file share.

```bash
fileShareName="<file-share-name>"

mntPath="$mntRoot/$storageAccountName/$fileShareName"
sudo mkdir -p $mntPath
```

Finally, create a record in the `/etc/fstab` file for your Azure file share. In the command below, the default 0755 Linux file and folder permissions are used, which means read, write, and execute for the owner (based on the file/directory Linux owner), read and execute for users in owner group, and read and execute for others on the system. You may wish to set alternate `uid` and `gid` or `dir_mode` and `file_mode` permissions on mount as desired. For more information on how to set permissions, see [UNIX numeric notation](https://en.wikipedia.org/wiki/File_system_permissions#Numeric_notation) on Wikipedia.

```bash
httpEndpoint=$(az storage account show \
    --resource-group $resourceGroupName \
    --name $storageAccountName \
    --query "primaryEndpoints.file" | tr -d '"')
smbPath=$(echo $httpEndpoint | cut -c7-$(expr length $httpEndpoint))$fileShareName

if [ -z "$(grep $smbPath\ $mntPath /etc/fstab)" ]; then
    echo "$smbPath $mntPath cifs nofail,credentials=$smbCredentialFile,serverino" | sudo tee -a /etc/fstab > /dev/null
else
    echo "/etc/fstab was not modified to avoid conflicting entries as this Azure file share was already present. You may want to double check /etc/fstab to ensure the configuration is as desired."
fi

sudo mount -a
```

> [!Note]  
> Starting in Linux kernel version 5.0, SMB 3.1.1 is the default negotiated protocol. You can specify alternate protocol versions using the `vers` mount option (protocol versions are `3.1.1`, `3.0`, and `2.1`).

### Dynamically mount with autofs
To dynamically mount a file share with the `autofs` utility, install it using the package manager on the Linux distribution of your choice.  

On **Ubuntu** and **Debian** distributions, use the `apt` package manager:

```bash
sudo apt update
sudo apt install autofs
```

On **Red Hat Enterprise Linux 8+**,  use the `dnf` package manager:
```bash
sudo dnf install autofs
```

On older versions of **Red Hat Enterprise Linux**, use the `yum` package manager:

```bash
sudo yum install autofs 
```

On **SUSE Linux Enterprise Server**, use the `zypper` package manager:
```bash
sudo zypper install autofs
```

Next, update the `autofs` configuration files. 

```bash
fileShareName="<file-share-name>"

httpEndpoint=$(az storage account show \
    --resource-group $resourceGroupName \
    --name $storageAccountName \
    --query "primaryEndpoints.file" | tr -d '"')
smbPath=$(echo $httpEndpoint | cut -c7-$(expr length $httpEndpoint))$fileShareName

echo "$fileShareName -fstype=cifs,credentials=$smbCredentialFile :$smbPath" > /etc/auto.fileshares

echo "/fileshares /etc/auto.fileshares --timeout=60" > /etc/auto.master
```

The final step is to restart the `autofs` service.

```bash
sudo systemctl restart autofs
```

## Securing Linux
Port 445 must be accessible to mount an Azure file share with SMB. Many organizations block port 445 because of the security risks inherent with SMB 1. SMB 1, also known as CIFS (Common Internet File System), is a legacy file system protocol included with many Linux distributions. SMB 1 is an outdated, inefficient, and most importantly insecure protocol. The good news is that Azure Files does not support SMB 1, and starting with Linux kernel version 4.18, Linux makes it possible to disable SMB 1. We always [strongly recommend](https://aka.ms/stopusingsmb1) disabling the SMB 1 on your Linux clients before using SMB file shares in production.

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

You can check to see if your Linux distribution supports the `disable_legacy_dialects` module parameter via the following command.

```bash
sudo modinfo -p cifs | grep disable_legacy_dialects
```

This command should output the following message:

```output
disable_legacy_dialects: To improve security it may be helpful to restrict the ability to override the default dialects (SMB2.1, SMB3 and SMB3.02) on mount with old dialects (CIFS/SMB1 and SMB2) since vers=1.0 (CIFS/SMB1) and vers=2.0 are weaker and less secure. Default: n/N/0 (bool)
```

Before disabling SMB 1, you must check to make sure that the SMB module is not currently loaded on your system (this happens automatically if you have mounted an SMB share). You can do this with the following command, which should output nothing if SMB is not loaded:

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

* [Planning for an Azure Files deployment](storage-files-planning.md)
* [FAQ](./storage-files-faq.md)
* [Troubleshooting](storage-troubleshoot-linux-file-connection-problems.md)
