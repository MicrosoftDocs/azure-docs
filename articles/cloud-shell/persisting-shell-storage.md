---
description: Walkthrough of how Azure Cloud Shell persists files.
ms.contributor: jahelmic
ms.date: 05/02/2024
ms.topic: how-to
tags: azure-resource-manager
ms.custom:
title: Persist files in Azure Cloud Shell
---
# Persist files in Azure Cloud Shell

The first time you start Cloud Shell, you're prompted to select your storage options. If you want
store files that can be used every time you use Cloud Shell, you must create new or choose existing
storage resources. Cloud Shell uses a Microsoft Azure Files share to persist files across sessions.

- To create new storage resources, see
  [Get started with Azure Cloud Shell using persistent storage][05].
- To use existing storage resources, see
  [Get started with Azure Cloud Shell using existing storage][04].

## How Cloud Shell storage works

Cloud Shell persists files through both of the following methods:

- Creates a disk image to contain the contents of your `$HOME` directory. The disk image is saved to
  `https://storageaccountname.file.core.windows.net/filesharename/.cloudconsole/acc_user.img`.
  Cloud Shell automatically syncs changes to this disk image.
- Mounts the file share as `clouddrive` in your `$HOME` directory. `/home/<User>/clouddrive` path is
  mapped to `storageaccountname.file.core.windows.net/filesharename`.

> [!NOTE]
> All files in your `$HOME` directory, such as SSH keys, are persisted in your user disk image,
> which is stored in the mounted file share. Use best practices to secure the information in your
> `$HOME` directory and mounted file share.

## Securing storage access

For security, each user should create their own storage account. For Azure role-based access control
(RBAC), users must have contributor access or higher at the storage account level.

Cloud Shell uses an Azure file share in a storage account, inside a specified subscription. Due to
inherited permissions, users with sufficient access rights in the subscription can access the
storage accounts and file shares contained in the subscription.

Users should lock down access to their files by setting the permissions at the storage account or
the subscription level.

The Cloud Shell storage account contains files created by the Cloud Shell user in their home
directory, which might include sensitive information including access tokens or credentials.

## Restrict resource creation with an Azure resource policy

Storage accounts that created in Cloud Shell are tagged with `ms-resource-usage:azure-cloud-shell`.
If you want to disallow users from creating storage accounts in Cloud Shell, create an
[Azure resource policy][02] that's triggered by this specific tag.

## Managing Cloud Shell storage

### Use the `clouddrive` command

Cloud Shell includes a command-line tool that enables you to change the Azure Files share that's in
Cloud Shell. Run `clouddrive` to see the available commands.

```Output
Group
  clouddrive                  :Manage storage settings for Azure Cloud Shell.

Commands
  mount                       :Mount a file share to Cloud Shell.
  unmount                     :Unmount a file share from Cloud Shell.
```

### Mount a new clouddrive

Use the `clouddrive mount` command to change the share used by Cloud Shell.

> [!NOTE]
> If you're mounting a new share, a new user image is created for your `$HOME` directory. Your
> previous `$HOME` image is kept in the previous file share.

Run the `clouddrive mount` command with the following parameters:

```bash
clouddrive mount -s mySubscription -g myRG -n storageAccountName -f fileShareName
```

For more information, run `clouddrive mount -h`.

```Output
Command
  clouddrive mount            :Mount an Azure file share to Cloud Shell.

    Mount enables mounting and associating an Azure file share to Cloud Shell.
    Cloud Shell will automatically attach this file share on each session start-up.

    Note: This command does not mount storage if the session is Ephemeral.

    Cloud Shell persists files with both methods below:
    1. Create a disk image of your $HOME directory to persist files within $HOME.
    This disk image is saved in your specified file share as 'acc_sean.img'' at
    '//<storageaccount>.file.storage.windows.net/<fileshare>/.cloudconsole/acc_sean.img'
    2. Mount specified file share as 'clouddrive' in $HOME for file sharing.
    '/home/sean/clouddrive' maps to '//<storageaccount>.file.storage.windows.net/<fileshare>'

Arguments
  -s | --subscription id          [Required]:Subscription ID or name.
  -g | --resource-group group     [Required]:Resource group name.
  -n | --storage-account name     [Required]:Storage account name.
  -f | --file-share name          [Required]:File share name.
  -d | --disk-size size                     :Disk size in GB. (default 5)
  -F | --force                              :Skip warning prompts.
  -? | -h | --help                          :Shows this usage text.
```

### Unmount clouddrive

You can unmount a Cloud Shell file share at any time. Since Cloud Shell requires a mounted file
share to be used, Cloud Shell prompts you to create and mount another file share on the next
session.

1. Run `clouddrive unmount`.
1. Acknowledge and confirm prompts.

The unmounted file share continues to exist until you manually delete it. After unmounting, Cloud
Shell no longer searches for this file share in subsequent sessions. For more information, run
`clouddrive unmount -h`,

```Output
Command
  clouddrive unmount: Unmount an Azure file share from Cloud Shell.

    Unmount enables unmounting and disassociating a file share from Cloud Shell.
    All current sessions will be terminated. Machine state and non-persisted files will be lost.
    You will be prompted to create and mount a new file share on your next session.
    Your previously mounted file share will continue to exist.

    Note: This command does not unmount storage if the session is Ephemeral.

Arguments
  None
```

> [!WARNING]
> Although running this command doesn't delete any resources, manually deleting a resource group,
> storage account, or file share that's mapped to Cloud Shell erases your `$HOME` directory disk
> image and any files in your file share. This action can't be undone.

## Use PowerShell commands

### Get information about the current file share

Use the `Get-CloudDrive` command in PowerShell to get information about the resources that back the
file share.

```powershell
PS /home/user> Get-CloudDrive

FileShareName      : cs-user-microsoft-com-xxxxxxxxxxxxxxx
FileSharePath      : //cs7xxxxxxxxxxxxxxx.file.core.windows.net/cs-user-microsoft-com-xxxxxxxxxxxxxxx
MountPoint         : /home/user/clouddrive
Name               : cs7xxxxxxxxxxxxxxx
ResourceGroupName  : cloud-shell-storage-southcentralus
StorageAccountName : cs7xxxxxxxxxxxxxxx
SubscriptionId     : 78a66d97-7204-4a0d-903f-43d3d4170e5b
```

### Unmount the file share

You can unmount a Cloud Shell file share at any time using the `Dismount-CloudDrive` cmdlet.
Dismounting the `clouddrive` terminates the current session.

```powershell
Dismount-CloudDrive
```

```Output
Do you want to continue
Dismounting clouddrive will terminate your current session. You will be prompted to create and
mount a new file share on your next session
[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"):
```

## Next steps

- [Learn about Microsoft Azure Files storage][03]
- [Learn about storage tags][01]

<!-- link references -->
[01]: ../azure-resource-manager/management/tag-resources.md
[02]: ../governance/policy/samples/index.md
[03]: ../storage/files/storage-files-introduction.md
[04]: get-started/existing-storage.md
[05]: get-started/new-storage.md
