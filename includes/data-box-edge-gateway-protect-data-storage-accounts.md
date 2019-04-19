---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 04/16/2019
ms.author: alkohli
---

Your device is associated with a storage account that is used as a destination for your data in Azure. Access to the storage account is controlled by the subscription and two 512-bit storage access keys associated with that storage account.

One of the keys is used for authentication when the Data Box Edge device accesses the storage account. The other key is held in reserve, allowing you to rotate the keys periodically.

For security reasons, many datacenters require key rotation. We recommend that you follow these best practices for key rotation:

- Your storage account key is similar to the root password for your storage account. Carefully protect your account key. Don't distribute the password to other users, hard code it, or save it anywhere in plaintext that is accessible to others.
- [Regenerate your account key](../articles/storage/common/storage-account-manage.md#regenerate-access-keys) using the Azure portal if you believe it may have been compromised.
- Periodically, your Azure administrator should change or regenerate the primary or secondary key by using the Storage section of the Azure portal to directly access the storage account.