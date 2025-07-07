---
title: Use PowerShell to create a user delegation SAS for a container or blob
titleSuffix: Azure Storage
description: Learn how to create a user delegation SAS with Microsoft Entra credentials by using PowerShell.
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 12/18/2019
ms.reviewer: dineshm
ms.custom: devx-track-azurepowershell
# Customer intent: As a cloud administrator, I want to create a user delegation SAS for a blob or container using PowerShell, so that I can securely manage access to Azure Storage resources with specified permissions and expiration times.
---

# Create a user delegation SAS for a container or blob with PowerShell

[!INCLUDE [storage-auth-sas-intro-include](../../../includes/storage-auth-sas-intro-include.md)]

This article shows how to use Microsoft Entra credentials to create a user delegation SAS for a container or blob with Azure PowerShell.

[!INCLUDE [storage-auth-user-delegation-include](../../../includes/storage-auth-user-delegation-include.md)]

## Install the PowerShell module

To create a user delegation SAS with PowerShell, install version 1.10.0 or later of the Az.Storage module. Follow these steps to install the latest version of the module:

1. Uninstall any previous installations of Azure PowerShell:

    - Remove any previous installations of Azure PowerShell from Windows using the **Apps & features** setting under **Settings**.
    - Remove all **Azure** modules from `%Program Files%\WindowsPowerShell\Modules`.

1. Make sure that you have the latest version of PowerShellGet installed. Open a Windows PowerShell window, and run the following command to install the latest version:

    ```powershell
    Install-Module PowerShellGet -Repository PSGallery -Force
    ```

1. Close and reopen the PowerShell window after installing PowerShellGet.

1. Install the latest version of Azure PowerShell:

    ```powershell
    Install-Module Az -Repository PSGallery -AllowClobber
    ```

1. Make sure that you have installed Azure PowerShell version 3.2.0 or later. Run the following command to install the latest version of the Azure Storage PowerShell module:

    ```powershell
    Install-Module -Name Az.Storage -Repository PSGallery -Force
    ```

1. Close and reopen the PowerShell window.

To check which version of the Az.Storage module is installed, run the following command:

```powershell
Get-Module -ListAvailable -Name Az.Storage -Refresh
```

For more information about installing Azure PowerShell, see [Install Azure PowerShell with PowerShellGet](/powershell/azure/install-azure-powershell).

<a name='sign-in-to-azure-powershell-with-azure-ad'></a>

## Sign in to Azure PowerShell with Microsoft Entra ID

Call the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) command to sign in with your Microsoft Entra account:

```powershell
Connect-AzAccount
```

For more information about signing in with PowerShell, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

## Assign permissions with Azure RBAC

To create a user delegation SAS from Azure PowerShell, the Microsoft Entra account used to sign into PowerShell must be assigned a role that includes the **Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey** action. This permission enables that Microsoft Entra account to request the *user delegation key*. The user delegation key is used to sign the user delegation SAS. The role providing the **Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey** action must be assigned at the level of the storage account, the resource group, or the subscription. For more information about Azure RBAC permissions for creating a user delegation SAS, see the **Assign permissions with Azure RBAC** section in [Create a user delegation SAS](/rest/api/storageservices/create-user-delegation-sas).

If you do not have sufficient permissions to assign Azure roles to a Microsoft Entra security principal, you may need to ask the account owner or administrator to assign the necessary permissions.

The following example assigns the **Storage Blob Data Contributor** role, which includes the **Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey** action. The role is scoped at the level of the storage account.

Remember to replace placeholder values in angle brackets with your own values:

```powershell
New-AzRoleAssignment -SignInName <email> `
    -RoleDefinitionName "Storage Blob Data Contributor" `
    -Scope  "/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>"
```

For more information about the built-in roles that include the **Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey** action, see [Azure built-in roles](../../role-based-access-control/built-in-roles.md).

<a name='use-azure-ad-credentials-to-secure-a-sas'></a>

## Use Microsoft Entra credentials to secure a SAS

When you create a user delegation SAS with Azure PowerShell, the user delegation key that is used to sign the SAS is created for you implicitly. The start time and expiry time that you specify for the SAS are also used as the start time and expiry time for the user delegation key.

Because the maximum interval over which the user delegation key is valid is 7 days from the start date, you should specify an expiry time for the SAS that is within 7 days of the start time. The SAS is invalid after the user delegation key expires, so a SAS with an expiry time of greater than 7 days will still only be valid for 7 days.

To create a user delegation SAS for a container or blob with Azure PowerShell, first create a new Azure Storage context object, specifying the `-UseConnectedAccount` parameter. The `-UseConnectedAccount` parameter specifies that the command creates the context object under the Microsoft Entra account with which you signed in.

Remember to replace placeholder values in angle brackets with your own values:

```powershell
$ctx = New-AzStorageContext -StorageAccountName <storage-account> -UseConnectedAccount
```

### Create a user delegation SAS for a container

To return a user delegation SAS token for a container, call the [New-AzStorageContainerSASToken](/powershell/module/az.storage/new-azstoragecontainersastoken) command, passing in the Azure Storage context object that you created previously.

The following example returns a user delegation SAS token for a container. Remember to replace the placeholder values in brackets with your own values:

```powershell
New-AzStorageContainerSASToken -Context $ctx `
    -Name <container> `
    -Permission racwdl `
    -ExpiryTime <date-time>
```

The user delegation SAS token returned will be similar to:

```output
?sv=2018-11-09&sr=c&sig=<sig>&skoid=<skoid>&sktid=<sktid>&skt=2019-08-05T22%3A24%3A36Z&ske=2019-08-07T07%3A
00%3A00Z&sks=b&skv=2018-11-09&se=2019-08-07T07%3A00%3A00Z&sp=rwdl
```

### Create a user delegation SAS for a blob

To return a user delegation SAS token for a blob, call the [New-AzStorageBlobSASToken](/powershell/module/az.storage/new-azstorageblobsastoken) command, passing in the Azure Storage context object that you created previously.

The following syntax returns a user delegation SAS for a blob. The example specifies the `-FullUri` parameter, which returns the blob URI with the SAS token appended. Remember to replace the placeholder values in brackets with your own values:

```powershell
New-AzStorageBlobSASToken -Context $ctx `
    -Container <container> `
    -Blob <blob> `
    -Permission racwd `
    -ExpiryTime <date-time>
    -FullUri
```

The user delegation SAS URI returned will be similar to:

```output
https://storagesamples.blob.core.windows.net/sample-container/blob1.txt?sv=2018-11-09&sr=b&sig=<sig>&skoid=<skoid>&sktid=<sktid>&skt=2019-08-06T21%3A16%3A54Z&ske=2019-08-07T07%3A00%3A00Z&sks=b&skv=2018-11-09&se=2019-08-07T07%3A00%3A00Z&sp=racwd
```

> [!NOTE]
> A user delegation SAS does not support defining permissions with a stored access policy.

## Revoke a user delegation SAS

To revoke a user delegation SAS from Azure PowerShell, call the **Revoke-AzStorageAccountUserDelegationKeys** command. This command revokes all of the user delegation keys associated with the specified storage account. Any shared access signatures associated with those keys are invalidated.

Remember to replace placeholder values in angle brackets with your own values:

```powershell
Revoke-AzStorageAccountUserDelegationKeys -ResourceGroupName <resource-group> `
    -StorageAccountName <storage-account>
```

> [!IMPORTANT]
> Both the user delegation key and Azure role assignments are cached by Azure Storage, so there may be a delay between when you initiate the process of revocation and when an existing user delegation SAS becomes invalid.

## Next steps

- [Create a user delegation SAS (REST API)](/rest/api/storageservices/create-user-delegation-sas)
- [Get User Delegation Key operation](/rest/api/storageservices/get-user-delegation-key)
