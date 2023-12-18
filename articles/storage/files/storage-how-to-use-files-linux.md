---
title: Mount SMB Azure file share on Linux
description: Learn how to mount an Azure file share over SMB on Linux and review SMB security considerations on Linux clients.
author: khdownie
ms.service: azure-file-storage
ms.custom: devx-track-linux, devx-track-azurecli
ms.topic: how-to
ms.date: 01/10/2023
ms.author: kendownie
---

# Mount SMB Azure file share on Linux
[Azure Files](storage-files-introduction.md) is Microsoft's easy to use cloud file system. Azure file shares can be mounted in Linux distributions using the [SMB kernel client](https://wiki.samba.org/index.php/LinuxCIFS).

The recommended way to mount an Azure file share on Linux is using SMB 3.1.1. By default, Azure Files requires encryption in transit, which is supported by SMB 3.0+. Azure Files also supports SMB 2.1, which doesn't support encryption in transit, but you can't mount Azure file shares with SMB 2.1 from another Azure region or on-premises for security reasons. Unless your application specifically requires SMB 2.1, use SMB 3.1.1.

| Distribution | SMB 3.1.1 (Recommended) | SMB 3.0 |
|-|-----------|---------|
| Linux kernel version | <ul><li>Basic 3.1.1 support: 4.17</li><li>Default mount: 5.0</li><li>AES-128-GCM encryption: 5.3</li><li>AES-256-GCM encryption: 5.10</li></ul> | <ul><li>Basic 3.0 support: 3.12</li><li>AES-128-CCM encryption: 4.11</li></ul> |
| [Ubuntu](https://wiki.ubuntu.com/Releases) | AES-128-GCM encryption: 18.04.5 LTS+ | AES-128-CCM encryption: 16.04.4 LTS+ |
| [Red Hat Enterprise Linux (RHEL)](https://access.redhat.com/articles/3078) | <ul><li>Basic: 8.0+</li><li>Default mount: 8.2+</li><li>AES-128-GCM encryption: 8.2+</li></ul> | 7.5+ |
| [Debian](https://www.debian.org/releases/) | Basic: 10+ | AES-128-CCM encryption: 10+ |
| [SUSE Linux Enterprise Server](https://www.suse.com/support/kb/doc/?id=000019587) | AES-128-GCM encryption: 15 SP2+ | AES-128-CCM encryption: 12 SP2+ |

If your Linux distribution isn't listed in the above table, you can check the Linux kernel version with the `uname` command:

```bash
uname -r
```

> [!Note]  
> SMB 2.1 support was added to Linux kernel version 3.7. If you're using a version of the Linux kernel after 3.7, it should support SMB 2.1.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Prerequisites
<a id="smb-client-reqs"></a>

* <a id="install-cifs-utils"></a>**Ensure the cifs-utils package is installed.**  
    The cifs-utils package can be installed using the package manager on the Linux distribution of your choice. 


# [Ubuntu](#tab/Ubuntu)

On Ubuntu and Debian, use the `apt` package manager:

```bash
sudo apt update
sudo apt install cifs-utils
```
# [RHEL](#tab/RHEL)

Same applies for CentOS or Oracle Linux

On Red Hat Enterprise Linux 8+ use the `dnf` package manager:

```bash
sudo dnf install cifs-utils
```

On older versions of Red Hat Enterprise Linux use the `yum` package manager:

```bash
sudo yum install cifs-utils 
```
# [SLES](#tab/SLES)

On SUSE Linux Enterprise Server, use the `zypper` package manager:

```bash
sudo zypper install cifs-utils
```
---

On other distributions, use the appropriate package manager or [compile from source](https://wiki.samba.org/index.php/LinuxCIFS_utils#Download).

* **The most recent version of the Azure Command Line Interface (CLI).** For more information on how to install the Azure CLI, see [Install the Azure CLI](/cli/azure/install-azure-cli) and select your operating system. If you prefer to use the Azure PowerShell module in PowerShell 6+, you may; however, the instructions in this article are for the Azure CLI.

* **Ensure port 445 is open**: SMB communicates over TCP port 445 - make sure your firewall or ISP isn't blocking TCP port 445 from the client machine.  Replace `<your-resource-group>` and `<your-storage-account>` and then run the following script:

    ```bash
    RESOURCE_GROUP_NAME="<your-resource-group>"
    STORAGE_ACCOUNT_NAME="<your-storage-account>"
    
    # This command assumes you have logged in with az login
    HTTP_ENDPOINT=$(az storage account show \
        --resource-group $RESOURCE_GROUP_NAME \
        --name $STORAGE_ACCOUNT_NAME \
        --query "primaryEndpoints.file" --output tsv | tr -d '"')
    SMBPATH=$(echo $HTTP_ENDPOINT | cut -c7-${#HTTP_ENDPOINT})
    FILE_HOST=$(echo $SMBPATH | tr -d "/")

    nc -zvw3 $FILE_HOST 445
    ```

    If the connection was successful, you should see something similar to the following output:

    ```output
    Connection to <your-storage-account> 445 port [tcp/microsoft-ds] succeeded!
    ```

    If you're unable to open up port 445 on your corporate network or are blocked from doing so by an ISP, you may use a VPN connection or ExpressRoute to work around port 445. For more information, see [Networking considerations for direct Azure file share access](storage-files-networking-overview.md).

## Mount the Azure file share on-demand with mount
When you mount a file share on a Linux OS, your remote file share is represented as a folder in your local file system. You can mount file shares to anywhere on your system. The following example mounts under the `/media` path. You can change this to your preferred path you want by modifying the `$MNT_ROOT` variable.

Replace `<resource-group-name>`, `<storage-account-name>`, and `<file-share-name>` with the appropriate information for your environment:

```bash
RESOURCE_GROUP_NAME="<resource-group-name>"
STORAGE_ACCOUNT_NAME="<storage-account-name>"
FILE_SHARE_NAME="<file-share-name>"

MNT_ROOT="/media"
MNT_PATH="$MNT_ROOT/$STORAGE_ACCOUNT_NAME/$FILE_SHARE_NAME"

sudo mkdir -p $MNT_PATH
```

Next, mount the file share using the `mount` command. In the following example, the `$SMB_PATH` command is populated using the fully qualified domain name for the storage account's file endpoint and `$STORAGE_ACCOUNT_KEY` is populated with the storage account key. 

# [SMB 3.1.1](#tab/smb311)
> [!Note]  
> Starting in Linux kernel version 5.0, SMB 3.1.1 is the default negotiated protocol. If you're using a version of the Linux kernel older than 5.0, specify `vers=3.1.1` in the mount options list.  

```azurecli
# This command assumes you have logged in with az login
HTTP_ENDPOINT=$(az storage account show \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $STORAGE_ACCOUNT_NAME \
    --query "primaryEndpoints.file" --output tsv | tr -d '"')
SMB_PATH=$(echo $HTTP_ENDPOINT | cut -c7-${#HTTP_ENDPOINT})$FILE_SHARE_NAME

STORAGE_ACCOUNT_KEY=$(az storage account keys list \
    --resource-group $RESOURCE_GROUP_NAME \
    --account-name $STORAGE_ACCOUNT_NAME \
    --query "[0].value" --output tsv | tr -d '"')

sudo mount -t cifs $SMB_PATH $MNT_PATH -o username=$STORAGE_ACCOUNT_NAME,password=$STORAGE_ACCOUNT_KEY,serverino,nosharesock,actimeo=30,mfsymlinks
```

# [SMB 3.0](#tab/smb30)
```azurecli
# This command assumes you have logged in with az login
HTTP_ENDPOINT=$(az storage account show \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $STORAGE_ACCOUNT_NAME \
    --query "primaryEndpoints.file" --output tsv | tr -d '"')
SMB_PATH=$(echo $HTTP_ENDPOINT | cut -c7-${#HTTP_ENDPOINT})$FILE_SHARE_NAME

STORAGE_ACCOUNT_KEY=$(az storage account keys list \
    --resource-group $RESOURCE_GROUP_NAME \
    --account-name $STORAGE_ACCOUNT_NAME \
    --query "[0].value" --output tsv | tr -d '"')

sudo mount -t cifs $SMB_PATH $MNT_PATH -o vers=3.0,username=$STORAGE_ACCOUNT_NAME,password=$STORAGE_ACCOUNT_KEY,serverino,nosharesock,actimeo=30,mfsymlinks
```

# [SMB 2.1](#tab/smb21)
```azurecli
# This command assumes you have logged in with az login
HTTP_ENDPOINT=$(az storage account show \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $STORAGE_ACCOUNT_NAME \
    --query "primaryEndpoints.file" --output tsv | tr -d '"')
SMB_PATH=$(echo $HTTP_ENDPOINT | cut -c7-${#HTTP_ENDPOINT})$FILE_SHARE_NAME

STORAGE_ACCOUNT_KEY=$(az storage account keys list \
    --resource-group $RESOURCE_GROUP_NAME \
    --account-name $STORAGE_ACCOUNT_NAME \
    --query "[0].value" --output tsv | tr -d '"')

sudo mount -t cifs $SMB_PATH $MNT_PATH -o vers=2.1,username=$STORAGE_ACCOUNT_NAME,password=$STORAGE_ACCOUNT_KEY,serverino,nosharesock,actimeo=30,mfsymlinks
```

---

You can use `uid`/`gid` or `dir_mode` and `file_mode` in the mount options for the `mount` command to set permissions. For more information on how to set permissions, see [UNIX numeric notation](https://en.wikipedia.org/wiki/File_system_permissions#Numeric_notation).

You can also mount the same Azure file share to multiple mount points if desired. When you're done using the Azure file share, use `sudo umount $mntPath` to unmount the share.

## Automatically mount file shares
When you mount a file share on a Linux OS, your remote file share is represented as a folder in your local file system. You can mount file shares to anywhere on your system. The following example mounts under the `/media` path. You can change this to your preferred path you want by modifying the `$MNT_ROOT` variable.

```bash
MNT_ROOT="/media"
sudo mkdir -p $MNT_ROOT
```

To mount an Azure file share on Linux, use the storage account name as the username of the file share, and the storage account key as the password. Because the storage account credentials may change over time, you should store the credentials for the storage account separately from the mount configuration. 

The following example shows how to create a file to store the credentials. Remember to replace `<resource-group-name>` and `<storage-account-name>` with the appropriate information for your environment.

```bash
RESOURCE_GROUP_NAME="<resource-group-name>"
STORAGE_ACCOUNT_NAME="<storage-account-name>"

# Create a folder to store the credentials for this storage account and
# any other that you might set up.
CREDENTIAL_ROOT="/etc/smbcredentials"
sudo mkdir -p "/etc/smbcredentials"

# Get the storage account key for the indicated storage account.
# You must be logged in with az login and your user identity must have 
# permissions to list the storage account keys for this command to work.
STORAGE_ACCOUNT_KEY=$(az storage account keys list \
    --resource-group $RESOURCE_GROUP_NAME \
    --account-name $STORAGE_ACCOUNT_NAME \
    --query "[0].value" --output tsv | tr -d '"')

# Create the credential file for this individual storage account
SMB_CREDENTIAL_FILE="$CREDENTIAL_ROOT/$STORAGE_ACCOUNT_NAME.cred"
if [ ! -f $SMB_CREDENTIAL_FILE ]; then
    echo "username=$STORAGE_ACCOUNT_NAME" | sudo tee $SMB_CREDENTIAL_FILE > /dev/null
    echo "password=$STORAGE_ACCOUNT_KEY" | sudo tee -a $SMB_CREDENTIAL_FILE > /dev/null
else 
    echo "The credential file $SMB_CREDENTIAL_FILE already exists, and was not modified."
fi

# Change permissions on the credential file so only root can read or modify the password file.
sudo chmod 600 $SMB_CREDENTIAL_FILE
```

To automatically mount a file share, you have a choice between using a static mount via the `/etc/fstab` utility or using a dynamic mount via the `autofs` utility. 

### Static mount with /etc/fstab
Using the earlier environment, create a folder for your storage account/file share under your mount folder. Replace `<file-share-name>` with the appropriate name of your Azure file share.

```bash
FILE_SHARE_NAME="<file-share-name>"

MNT_PATH="$MNT_ROOT/$STORAGE_ACCOUNT_NAME/$FILE_SHARE_NAME"
sudo mkdir -p $MNT_PATH
```

Finally, create a record in the `/etc/fstab` file for your Azure file share. In the command below, the default 0755 Linux file and folder permissions are used, which means read, write, and execute for the owner (based on the file/directory Linux owner), read and execute for users in owner group, and read and execute for others on the system. You may wish to set alternate `uid` and `gid` or `dir_mode` and `file_mode` permissions on mount as desired. For more information on how to set permissions, see [UNIX numeric notation](https://en.wikipedia.org/wiki/File_system_permissions#Numeric_notation) on Wikipedia.

> [!Tip]
> If you want Docker containers running .NET Core applications to be able to write to the Azure file share, include **nobrl** in the SMB mount options to avoid sending byte range lock requests to the server.

```bash
HTTP_ENDPOINT=$(az storage account show \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $STORAGE_ACCOUNT_NAME \
    --query "primaryEndpoints.file" --output tsv | tr -d '"')
SMB_PATH=$(echo $HTTP_ENDPOINT | cut -c7-${#HTTP_ENDPOINT})$FILE_SHARE_NAME

if [ -z "$(grep $SMB_PATH\ $MNT_PATH /etc/fstab)" ]; then
    echo "$SMB_PATH $MNT_PATH cifs nofail,credentials=$SMB_CREDENTIAL_FILE,serverino,nosharesock,actimeo=30" | sudo tee -a /etc/fstab > /dev/null
else
    echo "/etc/fstab was not modified to avoid conflicting entries as this Azure file share was already present. You may want to double check /etc/fstab to ensure the configuration is as desired."
fi

sudo mount -a
```

> [!Note]  
> Starting in Linux kernel version 5.0, SMB 3.1.1 is the default negotiated protocol. You can specify alternate protocol versions using the `vers` mount option (protocol versions are `3.1.1`, `3.0`, and `2.1`).

### Dynamically mount with autofs
To dynamically mount a file share with the `autofs` utility, install it using the package manager on the Linux distribution of your choice.  

# [Ubuntu](#tab/Ubuntu) 

On Ubuntu and Debian distributions, use the `apt` package manager:

```bash
sudo apt update
sudo apt install autofs
```
# [RHEL](#tab/RHEL) 

Same applies for CentOS or Oracle Linux

On Red Hat Enterprise Linux 8+,  use the `dnf` package manager:
```bash
sudo dnf install autofs
```

On older versions of Red Hat Enterprise Linux, use the `yum` package manager:

```bash
sudo yum install autofs 
```

# [SLES](#tab/SLES)
 
On SUSE Linux Enterprise Server, use the `zypper` package manager:
```bash
sudo zypper install autofs
```
---

Next, update the `autofs` configuration files. 

```bash
FILE_SHARE_NAME="<file-share-name>"

HTTP_ENDPOINT=$(az storage account show \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $STORAGE_ACCOUNT_NAME \
    --query "primaryEndpoints.file" --output tsv | tr -d '"')
SMB_PATH=$(echo $HTTP_ENDPOINT | cut -c7-$(expr length $HTTP_ENDPOINT))$FILE_SHARE_NAME

echo "$FILE_SHARE_NAME -fstype=cifs,credentials=$SMB_CREDENTIAL_FILE :$SMB_PATH" > /etc/auto.fileshares

echo "/fileshares /etc/auto.fileshares --timeout=60" > /etc/auto.master
```

The final step is to restart the `autofs` service.

```bash
sudo systemctl restart autofs
```

## Mount a file share snapshot

If you want to mount a specific snapshot of an SMB Azure file share, you must supply the `snapshot` option as part of the `mount` command, where `snapshot` is the time that the particular snapshot was created in a format such as @GMT-2023.01.05-00.08.20. The `snapshot` option has been supported in the Linux kernel since version 4.19.

After you've created the file share snapshot, follow these instructions to mount it.

1. In the Azure portal, navigate to the storage account that contains the file share that you want to mount a snapshot of.
2. Select **Data storage > File shares** and select the file share.
3. Select **Operations > Snapshots** and take note of the name of the snapshot you want to mount. The snapshot name will be a GMT timestamp, such as in the screenshot below.
   
   :::image type="content" source="media/storage-how-to-use-files-linux/mount-snapshot.png" alt-text="Screenshot showing how to locate a file share snapshot name and timestamp in the Azure portal." border="true" :::
   
4. Convert the timestamp to the format expected by the `mount` command, which is **@GMT-year.month.day-hour.minutes.seconds**. In this example, you'd convert **2023-01-05T00:08:20.0000000Z** to **@GMT-2023.01.05-00.08.20**.
5. Run the `mount` command using the GMT time to specify the `snapshot` value. Be sure to replace `<storage-account-name>`, `<file-share-name>`, and the GMT timestamp with your values. The .cred file contains the credentials to be used to mount the share (see [Automatically mount file shares](#automatically-mount-file-shares)).
   
   ```bash
   sudo mount -t cifs //<storage-account-name>.file.core.windows.net/<file-share-name> /media/<file-share-name>/snapshot1 -o credentials=/etc/smbcredentials/snapshottestlinux.cred,snapshot=@GMT-2023.01.05-00.08.20
   ```
   
6. If you're able to browse the snapshot under the path `/media/<file-share-name>/snapshot1`, then the mount succeeded.

If the mount fails, see [Troubleshoot Azure Files connectivity and access issues (SMB)](/troubleshoot/azure/azure-storage/files-troubleshoot-smb-connectivity?toc=/azure/storage/files/toc.json).

## Next steps
See these links for more information about Azure Files:

- [Planning for an Azure Files deployment](storage-files-planning.md)
- [Remove SMB 1 on Linux](files-remove-smb1-linux.md)
- [Troubleshoot general SMB issues on Linux](/troubleshoot/azure/azure-storage/files-troubleshoot-linux-smb?toc=/azure/storage/files/toc.json)
- [Troubleshoot general NFS issues on Linux](/troubleshoot/azure/azure-storage/files-troubleshoot-linux-nfs?toc=/azure/storage/files/toc.json)
