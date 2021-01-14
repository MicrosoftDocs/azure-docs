---
title: Update AD DS storage account password
description: Learn how to update the password of the Active Directory Domain Services account that represents your storage account. This prevents the storage account from being cleaned up when the password expires, preventing authentication failures.
author: roygara
ms.service: storage
ms.subservice: files
ms.topic: how-to
ms.date: 06/22/2020
ms.author: rogarana
---

# Update the password of your storage account identity in AD DS

If you registered the Active Directory Domain Services (AD DS) identity/account that represents your storage account in an organizational unit or domain that enforces password expiration time, you must change the password before the maximum password age. Your organization may run automated cleanup scripts that delete accounts once their password expires. Because of this, if you do not change your password before it expires, your account could be deleted, which will cause you to lose access to your Azure file shares.

To trigger password rotation, you can run the `Update-AzStorageAccountADObjectPassword` command from the [AzFilesHybrid module](https://github.com/Azure-Samples/azure-files-samples/releases). This command must be run in an on-premises AD DS-joined environment using a hybrid user with owner permission to the storage account and AD DS permissions to change the password of the identity representing the storage account. The command performs actions similar to storage account key rotation. Specifically, it gets the second Kerberos key of the storage account, and uses it to update the password of the registered account in AD DS. Then, it regenerates the target Kerberos key of the storage account, and updates the password of the registered account in AD DS. You must run this command in an on-premises AD DS-joined environment.

To prevent password rotation, during the onboarding of the Azure Storage account in the domain, make sure to place the Azure Storage Account into a separate organizational unit in AD DS. Disable Group Policy inheritance on this organizational unit to prevent default domain policies or specific password policies to be applied.

```PowerShell
# Update the password of the AD DS account registered for the storage account

# Storage Account Variables

$StorageAccountName = "<your-storage-account-name-here>"
$StorageAccountResourceGroup = "<your-resource-group-name-here>"

# Connect to your Azure AD Tenant & Subscription

Clear-AzContext
Get-AzContext

# Connect with an account that has at least read permissions on the Azure Storage Account keys

Connect-AzAccount
$Subscriptions = Get-AzSubscription | Out-GridView -PassThru -Title "Please select the required subscription"
$SubscriptionName = $Subscriptions.name
Select-AzSubscription -Subscription $SubscriptionName

# You may use either kerb1 or kerb2 

# kerb2
Update-AzStorageAccountADObjectPassword `
    -RotateToKerbKey kerb2 `
    -ResourceGroupName $StorageAccountResourceGroup `
    -StorageAccountName $StorageAccountName

# kerb 1
Update-AzStorageAccountADObjectPassword `
    -RotateToKerbKey kerb1 `
    -ResourceGroupName $StorageAccountResourceGroup `
    -StorageAccountName $StorageAccountName


```
