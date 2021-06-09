---
title: Troubleshoot Azure Files Virtual Desktop - Azure
description: How to troubleshoot issues with Azure Files in Azure Virtual Desktop.
author: Heidilohr
ms.topic: troubleshooting
ms.date: 06/10/2021
ms.author: helohr
manager: femila
---
# Toubleshooting Azure Files authorization

Common challenges with granting machine accounts access to Azure Files share authenticated with Azure AD are captured in the sections below.

## My group membership isn't working

When a VM is added to an AD DS group that VM needs to be restarted in order to pick up its membership to the group.

## I can't add my storage acount to my Active Directory Domain Services

The Azure Files team have excellent troubleshooting document available [here](https://docs.microsoft.com/en-us/azure/storage/files/storage-troubleshoot-windows-file-connection-problems#unable-to-mount-azure-files-with-ad-credentials).
There are few errors that I have observed occurring with higher frequency:

-   Ignoring warnings when running the PowerShell

    This will cause the account to be created but possibly with certain incorrect setting. This is where it is easier to delete the domain account representing the storage account and try again.

-   Incorrect OU specified

    It is a best practice to specify an OU for your storage account. The way an OU is specified is using the standard syntax (DC=ouname,DC=domainprefix,DC=topleveldomain – for example DC=storageAccounts,DC=wvdcontoso,DC=com)

-   Storage account synch to Azure AD

    It will take about 30 minutes for the storage account to synch to Azure AD.

## My AD DS group won't sync to Azure Active Directory 

The sync interval between AD DS and Azure AD is 30 minutes by default. If the AD DS group was create in the last 30 minutes and cannot be assigned to the storage account, option 1 is to wait, option 2 is to force the AD DS -\> Azure AD sync. Sample script, [here](https://github.com/stgeorgi/msixappattach/blob/master/force%20AD%20DS%20to%20Azure%20AD%20sync/force%20sync.ps1).

## My storage account says it needs additional permissions

For MSIX app attach and FSLogix the minimum RBAC permissions on the storage account are **Storage File Data SMB Share Contributor.**

For MSIX app attach and FSLogix the minimum NTFS permissions on the storage account are **Read & Execute,** and **List folder content.**

## Next steps

If you need to refresh your memory about the Azure Files setup process, see [Authorize an account for Azure Files](azure-files-authorization.md).