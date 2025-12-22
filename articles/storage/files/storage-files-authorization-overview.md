---
title: Overview - Azure Files Authorization and Access Control
description: Azure Files enforces authorization on user access at both the share level and the directory/file level. You can assign share-level permissions through Azure RBAC.
author: khdownie
ms.service: azure-file-storage
ms.topic: overview
ms.date: 10/16/2025
ms.author: kendownie
# Customer intent: As a cloud administrator, I want to configure authorization and access control for SMB Azure file shares, so that I can manage user permissions at both the share and directory/file levels effectively.
---


# Overview of Azure Files authorization and access control

**Applies to:** :heavy_check_mark: SMB Azure file shares

Regardless of which identity source you choose for [identity-based authentication](storage-files-active-directory-overview.md) on your storage account, you'll need to configure authorization and access control. Azure Files enforces authorization on user access at both the share level and the directory/file levels.

You can assign share-level permissions to Microsoft Entra users or groups that are managed through [Azure RBAC](/azure/role-based-access-control/overview). With Azure RBAC, the credentials you use for file access should be available or synced to Microsoft Entra ID. You can assign Azure built-in roles like **Storage File Data SMB Share Reader** to users or groups in Microsoft Entra ID to grant access to a file share.

At the directory/file level, Azure Files supports preserving, inheriting, and enforcing [Windows ACLs](/windows/win32/secauthz/access-control-lists). You can choose to keep Windows ACLs when copying data over SMB between your existing file share and your Azure file shares. Whether you plan to enforce authorization or not, you can use Azure file shares to back up ACLs along with your data.

## Configure share-level permissions

Once you've enabled an identity source on your storage account, you must do one of the following to access the file share:

- Set a [default share-level permission](storage-files-identity-assign-share-level-permissions.md#share-level-permissions-for-all-authenticated-identities) that applies to all authenticated users and groups
- Assign built-in Azure RBAC roles to users and groups, or 
- Configure custom roles for Microsoft Entra identities and assign access rights to file shares in your storage account.

The assigned share-level permission allows the granted identity to get access to the share only, nothing else, not even the root directory. You still need to separately configure directory and file-level permissions.

For more information, see [Assign share-level permissions](storage-files-identity-assign-share-level-permissions.md).

> [!NOTE]
> You can't assign share-level permissions to computer accounts (machine accounts) using Azure RBAC, because computer accounts can't be synced to an identity in Microsoft Entra ID. If you want to allow a computer account to access Azure file shares using identity-based authentication, [use a default share-level permission](storage-files-identity-assign-share-level-permissions.md#share-level-permissions-for-all-authenticated-identities) or consider using a service logon account instead.

## Configure directory and file-level permissions

Azure file shares enforce standard Windows ACLs at both the directory and file level, including the root directory. Configuration of directory or file-level permissions is supported over both SMB and REST.

For more information, see [Configure directory and file-level permissions](storage-files-identity-configure-file-level-permissions.md).

### Preserve directory and file ACLs when importing data to Azure Files

Azure Files supports preserving directory or file-level ACLs when copying data to Azure file shares. You can copy ACLs on a directory or file to Azure file shares using either Azure File Sync or common file movement toolsets. For example, you can use [robocopy](/windows-server/administration/windows-commands/robocopy) with the `/copy:s` flag to copy data as well as ACLs to an Azure file share. ACLs are preserved by default, so you don't need to enable identity-based authentication on your storage account to preserve ACLs.

## Next step

For more information, see:

- [Assign share-level permissions for Azure file shares](storage-files-identity-assign-share-level-permissions.md)
- [Configure directory and file-level permissions for Azure file shares](storage-files-identity-configure-file-level-permissions.md)
