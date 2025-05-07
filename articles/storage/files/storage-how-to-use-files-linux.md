---
title: Mount SMB Azure file share on Linux
description: Learn how to mount an Azure file share over SMB on Linux and review SMB security considerations on Linux clients.
author: khdownie
ms.service: azure-file-storage
ms.custom: linux-related-content, devx-track-azurecli
ms.topic: how-to
ms.date: 04/21/2025
ms.author: kendownie
---

# Mount SMB Azure file shares on Linux clients

Azure file shares can be mounted in Linux distributions using the [SMB kernel client](https://wiki.samba.org/index.php/LinuxCIFS).

This article shows how to mount an SMB Azure file share using NTLMv2 authentication (storage account key). Using identity-based authentication is preferred for security reasons. See [Enable Active Directory authentication over SMB for Linux clients accessing Azure Files](storage-files-identity-auth-linux-kerberos-enable.md).

## Applies to
| Management model | Billing model | Media tier | Redundancy | SMB | NFS |
|-|-|-|-|:-:|:-:|
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Geo (GRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | GeoZone (GZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Geo (GRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | GeoZone (GZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Protocols
By default, Azure Files enforces encryption in transit. SMB encryption is available starting with SMB 3.0. Azure Files also supports SMB 2.1, which doesn't support SMB encryption. As a result, Azure Files doesn't permit file shares to be mounted using SMB 2.1 from another Azure region or on-premises, without additional networking configuration, for security reasons. You should use SMB 3.1.1 unless your application specifically requires an older version.

| Distribution | SMB 3.1.1 (Recommended) | SMB 3.0 |
|-|-----------|---------|
| Linux kernel version | <ul><li>Basic 3.1.1 support: 4.17</li><li>Default mount: 5.0</li><li>AES-128-GCM encryption: 5.3</li><li>AES-256-GCM encryption: 5.10</li></ul> | <ul><li>Basic 3.0 support: 3.12</li><li>AES-128-CCM encryption: 4.11</li></ul> |
| [Ubuntu](https://wiki.ubuntu.com/Releases) | AES-128-GCM encryption: 18.04.5 LTS+ | AES-128-CCM encryption: 16.04.4 LTS+ |
| [Red Hat Enterprise Linux (RHEL)](https://access.redhat.com/articles/3078) | <ul><li>Basic: 8.0+</li><li>Default mount: 8.2+</li><li>AES-128-GCM encryption: 8.2+</li></ul> | 7.5+ |
| [Debian](https://www.debian.org/releases/) | Basic: 10+ | AES-128-CCM encryption: 10+ |
| [SUSE Linux Enterprise Server](https://www.suse.com/support/kb/doc/?id=000019587) | AES-128-GCM encryption: 15 SP2+ | AES-128-CCM encryption: 12 SP2+ |

If your Linux distribution isn't listed in the table, you can check the Linux kernel version with the `uname` command:

```bash
uname -r
```

## Prerequisites

<a id="smb-client-reqs"></a>

* <a id="install-cifs-utils"></a>**Ensure the cifs-utils package is installed.**
    Install the latest version of the cifs-utils package using the package manager on the Linux distribution of your choice.


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

* **Ensure port 445 is open**: SMB communicates over TCP port 445 - make sure your firewall or ISP isn't blocking TCP port 445 from the client machine. Replace `<your-resource-group>` and `<your-storage-account>` and then run the following script:

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

    You can use a VPN connection or ExpressRoute if port 445 is blocked on your network. For more information, see [Networking considerations for direct Azure file share access](storage-files-networking-overview.md).

## Permissions

All mounting scripts in this article mount the file shares using the default 0755 Linux file and folder permissions. This means read, write, and execute for the file/directory owner, read and execute for users in the owner group, and read and execute for other users. Depending on your organization's security policies, you might want to set alternate `uid`/`gid` or `dir_mode` and `file_mode` permissions in the mount options. For more information on how to set permissions, see [Unix symbolic notation](https://en.wikipedia.org/wiki/File-system_permissions#Symbolic_notation). See [mount options](#mount-options) for a list of mount options.

### Unix-style permissions support

You can also get Unix-style permissions support for SMB Azure file shares by using client-enforced access control and adding `modefromsid,idsfromsid` mount options to your mount command. In order for this to work:

- All clients accessing the share need to mount using `modefromsid,idsfromsid`
- The UIDs/GIDs must be uniform across all clients
- Clients must be running one of the following supported Linux distros: Ubuntu 20.04+, SLES 15 SP3+

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

Next, initialize the credential file by running the following script.

```bash
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

Now you can mount the file share with the `mount` command using the credential file. In the following example, the `$SMB_PATH` command is populated using the fully qualified domain name for the storage account's file endpoint. See [mount options](#mount-options) for a list of SMB mount options.

# [SMB 3.1.1](#tab/smb311)
> [!NOTE]
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

sudo mount -t cifs $SMB_PATH $MNT_PATH -o credentials=$SMB_CREDENTIAL_FILE,serverino,nosharesock,actimeo=30,mfsymlinks
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

sudo mount -t cifs $SMB_PATH $MNT_PATH -o vers=3.0,credentials=$SMB_CREDENTIAL_FILE,serverino,nosharesock,actimeo=30,mfsymlinks
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

sudo mount -t cifs $SMB_PATH $MNT_PATH -o vers=2.1,credentials=$SMB_CREDENTIAL_FILE,serverino,nosharesock,actimeo=30,mfsymlinks
```

---

You can also mount the same Azure file share to multiple mount points if desired. 

When you're done using the Azure file share, use `sudo umount $mntPath` to unmount the share.

## Automatically mount file shares

When you mount a file share on a Linux OS, your remote file share is represented as a folder in your local file system. You can mount file shares to anywhere on your system. The following example mounts under the `/media` path. You can change this to your preferred path you want by modifying the `$MNT_ROOT` variable.

```bash
MNT_ROOT="/media"
sudo mkdir -p $MNT_ROOT
```

Use the storage account name as the username of the file share, and the storage account key as the password. Because the storage account credentials might change over time, you should store the credentials for the storage account separately from the mount configuration.

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

Finally, create a record in the `/etc/fstab` file for your Azure file share. In the command below, the default 0755 Linux file and folder permissions are used, which means read, write, and execute for the owner (based on the file/directory Linux owner), read and execute for users in owner group, and read and execute for others on the system. You might wish to set alternate `uid` and `gid` or `dir_mode` and `file_mode` permissions on mount as desired. For more information on how to set permissions, see [UNIX numeric notation](https://en.wikipedia.org/wiki/File_system_permissions#Numeric_notation). See [mount options](#mount-options) for a list of SMB mount options.

> [!TIP]
> If you want Docker containers running .NET Core applications to be able to write to the Azure file share, include **nobrl** in the SMB mount options to avoid sending byte range lock requests to the server.

```bash
HTTP_ENDPOINT=$(az storage account show \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $STORAGE_ACCOUNT_NAME \
    --query "primaryEndpoints.file" --output tsv | tr -d '"')
SMB_PATH=$(echo $HTTP_ENDPOINT | cut -c7-${#HTTP_ENDPOINT})$FILE_SHARE_NAME

if [ -z "$(grep $SMB_PATH\ $MNT_PATH /etc/fstab)" ]; then
    echo "$SMB_PATH $MNT_PATH cifs _netdev,nofail,credentials=$SMB_CREDENTIAL_FILE,serverino,nosharesock,actimeo=30,mfsymlinks" | sudo tee -a /etc/fstab > /dev/null
else
    echo "/etc/fstab was not modified to avoid conflicting entries as this Azure file share was already present. You might want to double check /etc/fstab to ensure the configuration is as desired."
fi

sudo mount -a
```

> [!NOTE]
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

Same applies for CentOS or Oracle Linux:

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

Next, update the `autofs` configuration files. See [mount options](#mount-options) for a list of SMB mount options.

```bash
FILE_SHARE_NAME="<file-share-name>"

HTTP_ENDPOINT=$(az storage account show \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $STORAGE_ACCOUNT_NAME \
    --query "primaryEndpoints.file" --output tsv | tr -d '"')
SMB_PATH=$(echo $HTTP_ENDPOINT | cut -c7-$(expr length $HTTP_ENDPOINT))$FILE_SHARE_NAME

echo "$FILE_SHARE_NAME -fstype=cifs,credentials=$SMB_CREDENTIAL_FILE,serverino,nosharesock,actimeo=30,mfsymlinks :$SMB_PATH" > /etc/auto.fileshares

echo "/fileshares /etc/auto.fileshares --timeout=60" > /etc/auto.master
```

The final step is to restart the `autofs` service.

```bash
sudo systemctl restart autofs
```

### Mount options

You can use the following mount options when mounting SMB Azure file shares on Linux.

| **Mount option** | **Recommended value** | **Description** |
|******************|***********************|*****************|
| `username=` | Storage account name | Mandatory for NTLMv2 authentication. |
| `password=` | Storage account primary key | Mandatory for NTLMv2 authentication. |
| `password2=` | Storage account secondary key | Recommended in case when no-downtime key-rotation is desirable. |
| `mfsymlinks` | n/a | Recommended. Forces the mount to support symbolic links, allowing applications like git to clone repos with symlinks. |
| `actimeo=` | 30-60 | Recommended. The time (in seconds) that the CIFS client caches attributes of a file or directory before it requests attribute information from a server. Using a value lower than 30 seconds can cause performance degradation because attribute caches for files and directories expire too quickly. We recommend setting `actimeo` between 30 and 60 seconds. |
| `nosharesock` | n/a | Optional. Forces the client to always make a new connection to the server even if it has an existing connection to the SMB mount. This can enhance performance, as each mount point uses a different TCP socket. In some cases, `nosharesock` can degrade performance due to not caching the same file when opened from two mounts from the same client. |
| `max_channels=` | 4 | Recommended when using SMB Multichannel. Specifies the maximum number of channels (network connections) to the file share. Using SMB Multichannel with more than four channels results in poor performance. |
| `remount` | n/a | Remounts the file share and changes mount options if specified. Use with the `password2` option in cases where you want to specify an alternative password to fix an expired password after the original mount. |
| `nobrl` | n/a | Recommended in single-client scenarios when advisory locks are required. Azure Files doesn't support advisory locks, and this setting prevents sending byte range lock requests to the server. |
| `snapshot=` | time | Mount a specific snapshot of the file share. Time must be a positive integer identifying the snapshot requested (in 100-nanosecond units that have elapsed since January 1, 1601, or alternatively it can be specified in GMT format e.g. @GMT-2024.03.27-20.52.19). |
| `closetimeo=` | 5 | Configures deferred close timeout (handle cache) in seconds, or disables it by setting to 0. Default is 5 seconds. |
| `nostrictsync` | n/a | Don't ask the server to flush on fsync(). Some servers perform non-buffered writes by default, in which case flushing is redundant. This option can improve performance for workloads where a client is performing a lot of small write + fsync combinations and where network latency is much higher than the server latency. |
| `multiuser` | n/a | Map user accesses to individual credentials when accessing the server. By default, CIFS mounts only use a single set of user credentials (the mount credentials) when accessing a share. With this option, the client instead creates a new session with the server using the user's credentials whenever a new user accesses the mount. Further accesses by that user also use those credentials. Because the kernel can't prompt for passwords, multiuser mounts are limited to mounts using `sec=` options that don't require passwords. |
| `cifsacl` | n/a | This option is used to map CIFS/NTFS ACLs to/from Linux permission bits, map SIDs to/from UIDs and GIDs, and get and set Security Descriptors. Only supported for NTLMv2 authentication. |
| `idsfromsid,modefromsid` | n/a | Recommended when client needs to do client-enforced authorization. Enables Unix-style permissions. Only works when UIDs/GIDs are uniform across all the clients. Only supported for NTLMv2 authentication. |
| `cruid=` | uid or username | Optional. Sets the uid of the owner of the credentials cache. This is primarily useful with `sec=krb5`. The default is the real uid of the process performing the mount. We recommend setting this parameter to the uid or username of the user who has the necessary Kerberos tickets in their default credentials cache file. This directs the upcall to look for a credentials cache owned by that user. |
| `sec=` | krb5 | Required for Kerberos authentication. To enable Kerberos security mode, set `sec=krb5`. Example: `sudo mount -t cifs $SMB_PATH $MNT_PATH -o sec=krb5,cruid=$UID,serverino,nosharesock,actimeo=30,mfsymlinks`. You must omit username and password when using this option. The Linux client must be domain-joined. See [Enable Active Directory authentication over SMB for Linux clients](storage-files-identity-auth-linux-kerberos-enable.md). |
| `uid=` | 0 | Optional. Sets the uid that owns all files or directories on the mounted filesystem when the server doesn't provide ownership information. It can be specified as either a username or a numeric uid. When not specified, the default is 0. |
| `gid=` | 0 | Optional. Sets the gid that owns all files or directories on the mounted filesystem when the server doesn't provide ownership information. It can be specified as either a groupname or a numeric gid. When not specified, the default is 0. |
| `file_mode=` | n/a | Optional. If the server doesn't support the CIFS Unix extensions, this overrides the default file mode. |
| `dir_mode=` | n/a | Optional. If the server doesn't support the CIFS Unix extensions, this overrides the default mode for directories. |
| `handletimeout=` | n/a | Optional. The time (in milliseconds) for which the server should reserve the file handle after a failover waiting for the client to reconnect. |

## Next step

For more information about using SMB Azure file shares with Linux, see:

- [Troubleshoot general SMB issues on Linux](/troubleshoot/azure/azure-storage/files-troubleshoot-linux-smb?toc=/azure/storage/files/toc.json)
