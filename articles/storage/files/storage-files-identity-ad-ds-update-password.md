---
title: Update Password for an AD DS Storage Account Identity
description: Learn how to update the password of the Active Directory Domain Services (AD DS) identity that represents your storage account.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 11/26/2025
ms.author: kendownie
# Customer intent: As a storage administrator, I want to update the password of the Active Directory Domain Services identity that represents my storage account, so that I can maintain Kerberos authentication and ensure uninterrupted access to Azure file shares.
---

# Update the password of your storage account identity in AD DS

**Applies to:** :heavy_check_mark: SMB Azure file shares

When you domain join your storage account in your Active Directory Domain Services (AD DS), you create an AD principal, either a computer account or service account, with a password. The password of the AD principal is one of the Kerberos keys of the storage account. Depending on the password policy of the organization unit of the AD principal, you must periodically rotate the password of the AD principal to avoid authentication issues. Failing to change the password before it expires could result in losing Kerberos authentication to your Azure file shares. Some AD environments may also delete AD principals with expired passwords using an automated cleanup script.

Instead of periodically rotating the password, you can also place the AD principal that represents the storage account into an organizational unit that doesn't require password rotation.

There are two options for triggering password rotation. You can use the `AzFilesHybrid` module or Active Directory PowerShell. Use one method, not both.

## Option 1: Use AzFilesHybrid module
To regenerate and rotate the password of the AD principal that represents the storage account, use the `Update-AzStorageAccountADObjectPassword` cmdlet from the [AzFilesHybrid module](https://github.com/Azure-Samples/azure-files-samples/releases). To execute `Update-AzStorageAccountADObjectPassword`, you must:

- Run the cmdlet from a domain-joined client.
- Have the owner permission on the storage account. 
- Have AD DS permissions to change the password of the AD principal that represents the storage account.

```PowerShell
# Update the password of the AD DS account registered for the storage account
# You may use either kerb1 or kerb2
Update-AzStorageAccountADObjectPassword `
        -RotateToKerbKey kerb2 `
        -ResourceGroupName "<your-resource-group-name-here>" `
        -StorageAccountName "<your-storage-account-name-here>"
```

After you rotate to kerb2, we recommend waiting several hours and using `Update-AzStorageAccountADObjectPassword` cmdlet again regenerate and rotate back to kerb1, such that both Kerberos keys are regenerated.

## Option 2: Use Active Directory PowerShell

If you don't want to download the `AzFilesHybrid` module, you can use [Active Directory PowerShell](/powershell/module/activedirectory).

> [!IMPORTANT]
> The Windows Server Active Directory PowerShell cmdlets in this section must be run in Windows PowerShell 5.1 with elevated privileges.

Replace `<domain-object-identity>` in the following script with the appropriate value for your environment:

```powershell
$KeyName = "kerb1" # Could be either the first or second Kerberos key, this script assumes we're refreshing the first
$KerbKeys = New-AzStorageAccountKey -ResourceGroupName $ResourceGroupName -Name $StorageAccountName -KeyName $KeyName
$KerbKey = $KerbKeys.keys | Where-Object {$_.KeyName -eq $KeyName} | Select-Object -ExpandProperty Value
$NewPassword = ConvertTo-SecureString -String $KerbKey -AsPlainText -Force

Set-ADAccountPassword -Identity <domain-object-identity> -Reset -NewPassword $NewPassword
```

## Test that the AD DS account password matches a Kerberos key

After you update the AD DS account password, you can test it using the following PowerShell command.

```powershell
 Test-AzStorageAccountADObjectPasswordIsKerbKey -ResourceGroupName "<your-resource-group-name>" -Name "<your-storage-account-name>" -Verbose
```

