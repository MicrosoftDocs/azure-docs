---
author: AbhishekMallick-MS
ms.service: backup
ms.topic: include
ms.date: 05/30/2024
ms.author: v-abhmallick
---

Once the vault and policy are created, there are two critical points that you need to consider to protect all the Azure Blobs within a storage account.

- Key entities
- Permissions

### Key entities

- **Storage account containing the blobs to be protected**: Fetch the Azure Resource Manager ID of the storage account that contains the blobs to be protected. This will serve as the identifier of the storage account. We'll use an example of a storage account named *PSTestSA* under the resource group *blobrg* in a different subscription.

    ```azurepowershell-interactive
    $SAId = "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/blobrg/providers/Microsoft.Storage/storageAccounts/PSTestSA"
    ```

- **Backup vault**: The Backup vault requires permissions on the storage account to enable backups on blobs present within the storage account. The system-assigned managed identity of the vault is used for assigning such permissions.

### Assign permissions

You need to assign a few permissions via Azure RBAC to the created vault (represented by vault MSI) and the relevant storage account. These can be performed via Portal or PowerShell. Learn more about all the [related permissions](/azure/backup/blob-backup-configure-manage#grant-permissions-to-the-backup-vault-on-storage-accounts).
