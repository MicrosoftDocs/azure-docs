---
title: Update password for an AD DS storage account identity
description: Learn how to update the password of the Active Directory Domain Services (AD DS) identity that represents your storage account.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 11/08/2024
ms.author: kendownie
recommendations: false
---

# Update the password of your storage account identity in AD DS
When you domain join your storage account in your Active Directory Domain Services (AD DS), you create an AD principal (computer or service account) with a password that must be periodically rotated based on the policy of the organizational unit (OU) into which it is deployed. The password of the AD principal is one of the Kerberos keys of the storage account. To avoid authentication issues, including deletion of the AD principal representing the storage account by automated cleanup scripts, you should periodically rotate the password/storage account Kerberos keys. Failing to change the password before it expires could result in losing Kerberos authentication to your Azure file shares.

To prevent unintended password rotation, during the onboarding of the Azure storage account in the domain, you can place the Azure storage account into a separate organizational unit in AD DS that has password rotation policies disabled using Group Policy.

There are two options for triggering password rotation. You can use the `AzFilesHybrid` module or Active Directory PowerShell. Use one method, not both.

## Applies to
| Management model | Billing model | Media tier | Redundancy | SMB | NFS |
|-|-|-|-|:-:|:-:|
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Geo (GRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | GeoZone (GZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Geo (GRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | GeoZone (GZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Option 1: Use AzFilesHybrid module

You can run the `Update-AzStorageAccountADObjectPassword` cmdlet from the [AzFilesHybrid module](https://github.com/Azure-Samples/azure-files-samples/releases). You must run this command in an on-premises AD DS-joined environment by a [hybrid identity](../../active-directory/hybrid/whatis-hybrid-identity.md) with owner permission to the storage account and AD DS permissions to change the password of the identity representing the storage account. The command performs actions similar to storage account key rotation. Specifically, it gets the second Kerberos key of the storage account and uses it to update the password of the registered account in AD DS. Then it regenerates the target Kerberos key of the storage account and updates the password of the registered account in AD DS.

```PowerShell
# Update the password of the AD DS account registered for the storage account
# You may use either kerb1 or kerb2
Update-AzStorageAccountADObjectPassword `
        -RotateToKerbKey kerb2 `
        -ResourceGroupName "<your-resource-group-name-here>" `
        -StorageAccountName "<your-storage-account-name-here>"
```

This action will change the password for the AD object from kerb1 to kerb2. This is intended to be a two-stage process: rotate from kerb1 to kerb2 (kerb2 will be regenerated on the storage account before being set), wait several hours, and then rotate back to kerb1 (this cmdlet will likewise regenerate kerb1).

## Option 2: Use Active Directory PowerShell

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

## Test that the AD DS account password matches a Kerberos key

Now that you've updated the AD DS account password, you can test it using the following PowerShell command.

```powershell
 Test-AzStorageAccountADObjectPasswordIsKerbKey -ResourceGroupName "<your-resource-group-name>" -Name "<your-storage-account-name>" -Verbose
```

