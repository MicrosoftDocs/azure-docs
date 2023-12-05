---
title: Troubleshoot Azure Files Virtual Desktop - Azure
description: How to troubleshoot issues with Azure Files in Azure Virtual Desktop.
author: Heidilohr
ms.topic: troubleshooting
ms.date: 08/19/2021
ms.author: helohr
manager: femila
---
# Troubleshoot Azure Files authentication with Active Directory

This article describes common issues related to Azure Files authentication with an Active Directory Domain Services (AD DS) domain or Microsoft Entra Domain Services managed domain, and suggestions for how to fix them.

## My group membership isn't working

When you add a virtual machine (VM) to an AD DS group, you must restart that VM to activate its membership within the service.

## I can't add my storage account to my AD DS domain

First, check [Unable to mount Azure file shares with AD credentials](../storage/files/files-troubleshoot-smb-authentication.md#unable-to-mount-azure-file-shares-with-ad-credentials) to see if your problem is listed there.

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

- If the storage account doesn't instantly appear in your Microsoft Entra ID, don't worry. It usually takes 30 minutes for a new storage account to sync with Microsoft Entra ID, so be patient. If the sync doesn't happen after 30 minutes, see [the next section](#my-ad-ds-group-wont-sync-to-azure-ad).

<a name='my-ad-ds-group-wont-sync-to-azure-ad'></a>

## My AD DS group won't sync to Microsoft Entra ID

If your storage account doesn't automatically sync with Microsoft Entra ID after 30 minutes, you'll need to force the sync by using [this script](https://github.com/stgeorgi/msixappattach/blob/master/force%20AD%20DS%20to%20Azure%20AD%20sync/force%20sync.ps1).

## My storage account says it needs additional permissions

If your storage account needs additional permissions, you may not have assigned the required Azure role-based access control (RBAC) role to users or NTFS permissions. To fix this issue, make sure you've assigned one of these permissions to users who need to access the share:

- The **Storage File Data SMB Share Contributor** RBAC permission.

- The **Read & Execute** and **List folder content** NTFS permissions.

## Next steps

If you need to refresh your memory about the Azure Files setup process, see [Set up FSLogix Profile Container with Azure Files and Active Directory Domain Services or Microsoft Entra Domain Services](fslogix-profile-container-configure-azure-files-active-directory.md).
