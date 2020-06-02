---
title: Update AD DS storage account password
description: Learn how to update the password of the Active Directory Domain Services account that represents your storage account. This prevents the storage account from being cleaned up when the password expires, preventing authentication failures.
author: roygara
ms.service: storage
ms.subservice: files
ms.topic: conceptual
ms.date: 05/29/2020
ms.author: rogarana
---

# Update the password of your storage account identity in AD DS

If you registered the Active Directory Domain Services (AD DS) identity/account that represents your storage account in an organizational unit or domain that enforces password expiration time, you must change the password before the maximum password age. Your organization may run automated cleanup scripts that delete accounts once their password expires. Because of this, if you do not change your password before it expires, your account could be deleted, which will cause you to lose access to your Azure file shares.

To trigger password rotation, you can run the `Update-AzStorageAccountADObjectPassword` command from the [AzFilesHybrid module](https://github.com/Azure-Samples/azure-files-samples/releases). This command must be run in an on-premises AD DS-joined environment using a hybrid user with owner permission to the storage account and AD DS permissions to change the password of the identity representing the storage account. The command performs actions similar to storage account key rotation. Specifically, it gets the second Kerberos key of the storage account, and uses it to update the password of the registered account in AD DS. Then, it regenerates the target Kerberos key of the storage account, and updates the password of the registered account in AD DS. You must run this command in an on-premises AD DS-joined environment.

```PowerShell
# Update the password of the AD DS account registered for the storage account
# You may use either kerb1 or kerb2
Update-AzStorageAccountADObjectPassword `
        -RotateToKerbKey kerb2 `
        -ResourceGroupName "<your-resource-group-name-here>" `
        -StorageAccountName "<your-storage-account-name-here>"
```
