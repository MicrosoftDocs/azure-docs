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

### Mount a new clouddrive

If you have previously selected to use ephemeral sessions for Cloud Shell, then you must reset your
preferences by selecting **Settings** > **Reset User Settings** in Cloud Shell. Follow the steps to
mount an [existing storage account][04] or a [new storage account][05].


> [!NOTE]
> If you're mounting a new share, a new user image is created for your `$HOME` directory. Your
> previous `$HOME` image is kept in the previous file share.

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
