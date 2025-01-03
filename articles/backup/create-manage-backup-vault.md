---
title: Create and delete Backup vaults
description: Learn how to create and delete the Backup vaults.
ms.topic: how-to
ms.date: 11/23/2024
ms.custom: references_regions
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---
# Create and delete Backup vaults

This article describes how to create Backup vaults and delete them.

A Backup vault is a storage entity in Azure that houses backup data for certain newer workloads that Azure Backup supports. You can use Backup vaults to hold backup data for various Azure services, such Azure Database for PostgreSQL servers and newer workloads that Azure Backup will support. Backup vaults make it easy to organize your backup data, while minimizing management overhead. Backup vaults are based on the Azure Resource Manager model of Azure, which provides the **Enhanced capabilities to help secure backup data**. With Backup vaults, Azure Backup provides security capabilities to protect cloud backups. The security features ensure you can secure your backups, and safely recover data, even if production and backup servers are compromised. [Learn more](backup-azure-security-feature.md)

## Create a Backup vault

A Backup vault is a management entity that stores recovery points created over time and provides an interface to perform backup related operations. These include taking on-demand backups, performing restores, and creating backup policies.

To create a Backup vault, follow these steps.

### Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

### Create Backup vault

1. Type **Backup vaults** in the search box.
2. Under **Services**, select **Backup vaults**.
3. On the **Backup vaults** page, select **Add**.
4. On the **Basics** tab, under **Project details**, make sure the correct subscription is selected and then choose **Create new** resource group. Type *myResourceGroup* for the name.

    ![Create new resource group](./media/backup-vault-overview/new-resource-group.png)

5. Under **Instance details**, type *myVault* for the **Backup vault name** and choose your region of choice, in this case *East US* for your **Region**.
6. Now choose your **Storage redundancy**. Storage redundancy cannot be changed after protecting items to the vault.
7. We recommend that if you're using Azure as a primary backup storage endpoint, continue to use the default **Geo-redundant** setting.
8. If you don't use Azure as a primary backup storage endpoint, choose **Locally redundant**, which reduces the Azure storage costs. Learn more about [geo](../storage/common/storage-redundancy.md#geo-redundant-storage) and [local](../storage/common/storage-redundancy.md#locally-redundant-storage) redundancy.

    ![Choose storage redundancy](./media/backup-vault-overview/storage-redundancy.png)

9. Select the Review + create button at the bottom of the page.

    ![Select Review + Create](./media/backup-vault-overview/review-and-create.png)

## Delete a Backup vault

This section describes how to delete a Backup vault. It contains instructions for removing dependencies and then deleting a vault.

### Before you start

You can't delete a Backup vault with any of the following dependencies:

- You can't delete a vault that contains protected data sources (for example, Azure database for PostgreSQL servers).
- You can't delete a vault that contains backup data.

If you try to delete the vault without removing the dependencies, you'll encounter the following error messages:

>Cannot delete the Backup vault as there are existing backup instances or backup policies in the vault. Delete all backup instances and backup policies that are present in the vault and then try deleting the vault.

Ensure that you cycle through the **Datasource type** filter options in **Backup center** to not miss any existing Backup Instance or policy that needs to be removed, before being able to delete the Backup Vault.

![Datasource Types](./media/backup-vault-overview/datasource-types.png)

### Proper way to delete a vault

>[!WARNING]
>The following operation is destructive and can't be undone. All backup data and backup items associated with the protected server will be permanently deleted. Proceed with caution.

To properly delete a vault, you must follow the steps in this order:

- Verify if there are any protected items:
  - Go to **Backup Instances** in the left navigation bar. All items listed here must be deleted first.

After you've completed these steps, you can continue to delete the vault.

### Delete the Backup vault

When there are no more items in the vault, select **Delete** on the vault dashboard. You'll see a confirmation text asking if you want to delete the vault.

![Delete vault](./media/backup-vault-overview/delete-vault.png)

1. Select **Yes** to verify that you want to delete the vault. The vault is deleted. The portal returns to the **New** service menu.

## Next steps

- [Manage a Backup vault](manage-backup-vault.md)
- [Configure backup on Azure PostgreSQL databases](backup-azure-database-postgresql.md#configure-backup-on-azure-postgresql-databases)