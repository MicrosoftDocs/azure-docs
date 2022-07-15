---
title: Troubleshoot Azure Files Virtual Desktop - Azure
description: How to troubleshoot issues with Azure Files in Azure Virtual Desktop.
author: Heidilohr
ms.topic: troubleshooting
ms.date: 08/19/2021
ms.author: helohr
manager: femila
---
# Troubleshoot Azure Files authorization

This article describes common issues related to Azure Files authentication with Azure Active Directory (Azure AD), and suggestions for how to fix them.

## My group membership isn't working

When you add a virtual machine (VM) to an Active Directory Domain Services (AD DS) group, you must restart that VM to activate its membership within the service.

## I can't add my storage account to my AD DS

First, check [Unable to mount Azure Files with AD credentials](../storage/files/storage-troubleshoot-windows-file-connection-problems.md#unable-to-mount-azure-files-with-ad-credentials) to see if your problem is listed there.

Here are the most common reasons users may come across issues:

- Ignoring any warning messages that appear when creating the account in PowerShell. Ignoring warnings may cause the new account to have incorrectly configured settings. To fix this issue, you should delete the domain account that represents the storage account and try again.

- The account is using an incorrect organizational unit (OU). To fix this issue, reenter the OU information with the following syntax:
    
    ```powershell
    DC=ouname,DC=domainprefix,DC=topleveldomain
    ```

    For example:

    ```powershell
    DC=storageAccounts,DC=wvdcontoso,DC=com
    ```

- If the storage account doesn't instantly appear in your Azure AD, don't worry. It usually takes 30 minutes for a new storage account to sync with Azure AD, so be patient. If the sync doesn't happen after 30 minutes, see [the next section](#my-ad-ds-group-wont-sync-to-azure-ad).

## My AD DS group won't sync to Azure AD

If your storage account doesn't automatically sync with Azure AD after 30 minutes, you'll need to force the sync by using [this script](https://github.com/stgeorgi/msixappattach/blob/master/force%20AD%20DS%20to%20Azure%20AD%20sync/force%20sync.ps1).

## My storage account says it needs additional permissions

If your storage account needs additional permissions, you may not have permission to access MSIX app attach and FSLogix. To fix this issue, make sure you've assigned one of these permissions to your account:

- The **Storage File Data SMB Share Contributor** RBAC permission.

- The **Read & Execute** and **List folder content** NTFS permissions.

## Next steps

If you need to refresh your memory about the Azure Files setup process, see [Authorize an account for Azure Files](azure-files-authorization.md).