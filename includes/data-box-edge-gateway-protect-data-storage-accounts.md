---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 04/16/2019
ms.author: alkohli
---

Your device is associated with a storage account that's used as a destination for your data in Azure. Access to the storage account is controlled by the subscription and two 512-bit storage access keys associated with that storage account.

One of the keys is used for authentication when the Azure Stack Edge device accesses the storage account. The other key is held in reserve, so you can rotate the keys periodically.

For security reasons, many datacenters require key rotation. We recommend that you follow these best practices for key rotation:

- Your storage account key is similar to the root password for your storage account. Carefully protect your account key. Don't distribute the password to other users, hard code it, or save it anywhere in plain text that's accessible to others.
- Regenerate your account key via the Azure portal if you think it could be compromised. For more information, see [Manage storage account access keys](../articles/storage/common/storage-account-keys-manage.md).
- Your Azure admin should periodically change or regenerate the primary or secondary key by using the Storage section of the Azure portal to access the storage account directly.