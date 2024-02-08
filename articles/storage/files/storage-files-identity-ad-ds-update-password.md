---
title: Update AD DS storage account password
description: Learn how to update the password of the Active Directory Domain Services computer or service account that represents your storage account. This prevents authentication failures and keeps the storage account from being deleted when the password expires.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 11/17/2022
ms.author: kendownie
recommendations: false
---

# Update the password of your storage account identity in AD DS

If you registered the Active Directory Domain Services (AD DS) identity/account that represents your storage account in an organizational unit or domain that enforces password expiration time, you must change the password before the maximum password age. Your organization may run automated cleanup scripts that delete accounts once their password expires. Because of this, if you don't change your password before it expires, your account could be deleted, which will cause you to lose access to your Azure file shares.

To prevent unintended password rotation, during the onboarding of the Azure storage account in the domain, make sure to place the Azure storage account into a separate organizational unit in AD DS. Disable Group Policy inheritance on this organizational unit to prevent default domain policies or specific password policies from being applied.

> [!NOTE]
> A storage account identity in AD DS can be either a service account or a computer account. Service account passwords can expire in AD; however, because computer account password changes are driven by the client machine and not AD, they don't expire in AD.

There are two options for triggering password rotation. You can use the `AzFilesHybrid` module or Active Directory PowerShell. Use one method, not both.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Use AzFilesHybrid module

You can run the `Update-AzStorageAccountADObjectPassword` cmdlet from the [AzFilesHybrid module](https://github.com/Azure-Samples/azure-files-samples/releases). This command must be run in an on-premises AD DS-joined environment by a [hybrid identity](../../active-directory/hybrid/whatis-hybrid-identity.md) with owner permission to the storage account and AD DS permissions to change the password of the identity representing the storage account. The command performs actions similar to storage account key rotation. Specifically, it gets the second Kerberos key of the storage account and uses it to update the password of the registered account in AD DS. Then it regenerates the target Kerberos key of the storage account and updates the password of the registered account in AD DS.

```PowerShell
# Update the password of the AD DS account registered for the storage account
# You may use either kerb1 or kerb2
Update-AzStorageAccountADObjectPassword `
        -RotateToKerbKey kerb2 `
        -ResourceGroupName "<your-resource-group-name-here>" `
        -StorageAccountName "<your-storage-account-name-here>"
```

This action will change the password for the AD object from kerb1 to kerb2. This is intended to be a two-stage process: rotate from kerb1 to kerb2 (kerb2 will be regenerated on the storage account before being set), wait several hours, and then rotate back to kerb1 (this cmdlet will likewise regenerate kerb1).

## Use Active Directory PowerShell

If you don't want to download the `AzFilesHybrid` module, you can use [Active Directory PowerShell](/powershell/module/activedirectory).

> [!IMPORTANT]
> The Windows Server Active Directory PowerShell cmdlets in this section must be run in Windows PowerShell 5.1 with elevated privileges. PowerShell 7.x and Azure Cloud Shell won't work in this scenario.

Replace `<domain-object-identity>` in the following script with your value, then run the script to update your domain object password:

```powershell
$KeyName = "kerb1" # Could be either the first or second kerberos key, this script assumes we're refreshing the first
$KerbKeys = New-AzStorageAccountKey -ResourceGroupName $ResourceGroupName -Name $StorageAccountName -KeyName $KeyName
$KerbKey = $KerbKeys.keys | Where-Object {$_.KeyName -eq $KeyName} | Select-Object -ExpandProperty Value
$NewPassword = ConvertTo-SecureString -String $KerbKey -AsPlainText -Force

Set-ADAccountPassword -Identity <domain-object-identity> -Reset -NewPassword $NewPassword
```

