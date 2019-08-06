---
title: Create a shared access signature (SAS) using Azure Active Directory credentials with PowerShell - Azure Storage
description: Learn how to create a shared access signature (SAS) using Azure Active Directory credentials in Azure Storage using PowerShell.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 08/02/2019
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: blobs
---

# Create a shared access signature (SAS) for a container or blob using Azure Active Directory credentials with PowerShell

A shared access signature (SAS) enables you to grant limited access to containers and blobs in your storage account. When you create a SAS, you specify its constraints, including which object or objects a client is allowed to access, what permissions they have on those objects, and how long the SAS is valid. This article shows how to use Azure Active Directory (Azure AD) credentials to create a SAS for a container or blob with PowerShell.

[!INCLUDE [storage-auth-user-delegation-include](../../../includes/storage-auth-user-delegation-include.md)]

## Install the PowerShell preview module

To use PowerShell to create a user delegation SAS, you must first install the Az.Storage 1.3.1-preview module. Follow these steps to install the module:

1. Uninstall any previous installations of Azure PowerShell:

    - Remove any previous installations of Azure PowerShell from Windows using the **Apps & features** setting under **Settings**.
    - Remove all **Azure** modules from `%Program Files%\WindowsPowerShell\Modules`.
    - You may need to remove any **Az.Storage** modules other than Az.Storage 1.3.1-preview. You can use [Get-InstalledModule](/powershell/module/powershellget/get-installedmodule) to list installed Az.Storage modules, and [Uninstall-Module](/powershell/module/powershellget/uninstall-module) to uninstall modules.

1. Make sure that you have the latest version of PowerShellGet installed. Open a Windows PowerShell window, and run the following command to install the latest version:

    ```powershell
    Install-Module PowerShellGet –Repository PSGallery –Force
    ```

1. Close and reopen the PowerShell window after installing PowerShellGet.

1. Install the latest version of Azure PowerShell:

    ```powershell
    Install-Module Az –Repository PSGallery –AllowClobber
    ```

1. Install an Azure Storage preview module that supports user delegation SAS:

    ```powershell
    Install-Module Az.Storage –Repository PSGallery -RequiredVersion 1.3.1-preview –AllowPrerelease –AllowClobber –Force
    ```

1. Close and reopen the PowerShell window.

For more information about installing Azure PowerShell, see [Install Azure PowerShell with PowerShellGet](/powershell/azure/install-az-ps).

## Assign permissions with RBAC

To create a user delegation SAS from Azure PowerShell, the Azure AD account used to sign into PowerShell must be assigned a role that includes the **Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey** action. This permission enables that Azure AD account to request the *user delegation key*. The user delegation key is used to sign the user delegation SAS. The role providing the **Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey** action must be assigned at the level of the storage account, the resource group, or the subscription.

The following example assigns the **Storage Blob Data Contributor** role, which includes the **Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey** action. The role is scoped at the level of the storage account.

Remember to replace placeholder values in angle brackets with your own values:

```powershell
New-AzRoleAssignment -SignInName <email> `
    -RoleDefinitionName "Storage Blob Data Contributor" `
    -Scope  "/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>"
```

For more information about the built-in roles that include the **Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey** action, see [Built-in roles for Azure resources](/role-based-access-control/built-in-roles).

## Sign in to Azure PowerShell with Azure AD

Call the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) command to sign in with your Azure AD account:

```powershell
Connect-AzAccount
```

For more information about signing in with PowerShell, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

## Use Azure AD credentials to secure a SAS

When you create a user delegation SAS with Azure PowerShell, the user delegation key that is used to sign the SAS is created for you implicitly. The start time and expiry time that you specify for the SAS are also used as the start time and expiry time for the user delegation key. 

Because the maximum interval over which the user delegation key is valid is 7 days from the start date, you should specify an expiry time for the SAS that is within 7 days of the start time. The SAS is invalid after the user delegation key expires, so a SAS with an expiry time of greater than 7 days will still only be valid for 7 days.

To create a user delegation SAS for a container or blob with Azure PowerShell, first create a new Azure Storage context object, specifying the `-UseConnectedAccount` parameter. The `-UseConnectedAccount` parameter specifies that the command creates the context object under the Azure AD account with which you signed in.

Remember to replace placeholder values in angle brackets with your own values:

```powershell
$ctx = New-AzStorageContext -StorageAccountName <storage-account> -UseConnectedAccount
```

### Create a user delegation SAS for a container

To return a user delegation SAS token for a container, call the [New-AzStorageContainerSASToken](/powershell/module/az.storage/new-azstoragecontainersastoken) command, passing in the Azure Storage context object that you created previously. 

Remember to replace placeholder values in angle brackets with your own values:

```powershell
New-AzStorageContainerSASToken -Context $ctx `
    -Name <container> `
    -Permission racwdl `
    -ExpiryTime <date-time>
```

## Create a user delegation SAS for a blob

To return a user delegation SAS token for a blob, call the [New-AzStorageBlobSASToken](/powershell/module/az.storage/new-azstorageblobsastoken) command, passing in the Azure Storage context object that you created previously. 

Remember to replace placeholder values in angle brackets with your own values:

```powershell
New-AzStorageBlobSASToken -Context $ctx `
    -Container <container> `
    -Blob <blob> `
    -Permission racwd `
    -ExpiryTime <date-time>
```

## Revoke a user delegation SAS

To revoke a user delegation SAS from Azure PowerShell, call the **Revoke-AzStorageAccountUserDelegationKeys** command. This command revokes all of the user delegation keys associated with the specified storage account. Any shared access signatures associated with those keys are invalidated.

Remember to replace placeholder values in angle brackets with your own values:

```powershell
Revoke-AzStorageAccountUserDelegationKeys -ResourceGroupName <resource-group> `
    -StorageAccountName <storage-account>
```

## See also

- [Create a user delegation SAS](/rest/api/storageservices/create-a-user-delegation-sas)
- [Get User Delegation Key operation](/rest/api/storageservices/get-user-delegation-key)
