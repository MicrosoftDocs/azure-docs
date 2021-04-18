---
title: Overview of Backup vaults
description: An overview of Backup vaults.
ms.topic: conceptual
ms.date: 04/19/2021
---
# Backup vaults overview

This article describes the features of a Backup vault. A Backup vault is a storage entity in Azure that houses backup data for certain newer workloads that Azure Backup supports. You can use Backup vaults to hold backup data for various Azure services, such Azure Database for PostgreSQL servers and newer workloads that Azure Backup will support. Backup vaults make it easy to organize your backup data, while minimizing management overhead. Backup vaults are based on the Azure Resource Manager model of Azure, which provides features such as:

- **Enhanced capabilities to help secure backup data**: With Backup vaults, Azure Backup provides security capabilities to protect cloud backups. The security features ensure you can secure your backups, and safely recover data, even if production and backup servers are compromised. [Learn more](backup-azure-security-feature.md)

- **Azure role-based access control (Azure RBAC)**: Azure RBAC provides fine-grained access management control in Azure. [Azure provides various built-in roles](../role-based-access-control/built-in-roles.md), and Azure Backup has three [built-in roles to manage recovery points](backup-rbac-rs-vault.md). Backup vaults are compatible with Azure RBAC, which restricts backup and restore access to the defined set of user roles. [Learn more](backup-rbac-rs-vault.md)

## Storage settings in the Backup vault

A Backup vault is an entity that stores the backups and recovery points created over time. The Backup vault also contains the backup policies that are associated with the protected virtual machines.

- Azure Backup automatically handles storage for the vault. Choose the storage redundancy that matches your business needs when creating the Backup vault.

- To learn more about storage redundancy, see these articles on [geo](../storage/common/storage-redundancy.md#geo-redundant-storage) and [local](../storage/common/storage-redundancy.md#locally-redundant-storage) redundancy.

## Encryption settings in the Backup vault

This section discusses the options available for encrypting your backup data stored in the Backup vault. Azure Backup service uses the **Backup Management Service** app to access Azure Key Vault, but not the managed identity of the Backup vault.


### Encryption of backup data using platform-managed keys

By default, all your data is encrypted using platform-managed keys. You don't need to take any explicit action from your end to enable this encryption. It applies to all workloads being backed up to your Backup vault.

## Create a Backup vault

A Backup vault is a management entity that stores recovery points created over time and provides an interface to perform backup related operations. These include taking on-demand backups, performing restores, and creating backup policies.

To create a Backup vault, follow these steps.

### Sign in to Azure

Sign in to the Azure portal at <https://portal.azure.com>.

### Create Backup vault

1. Type **Backup vaults** in the search box.
1. Under **Services**, select **Backup vaults**.
1. In the **Backup vaults** page, select **Add**.
1. In the **Basics tab**, under **Project details**, make sure the correct subscription is selected and then choose **Create new** resource group. Type *myResourceGroup* for the name.

  ![Create new resource group](./media/backup-vault-overview/new-resource-group.png)

1. Under **Instance details**, type *myVault* for the **Backup vault name** and choose your region of choice, in this case *East US* for your **Region**.
1. Now choose your **Storage redundancy**. Storage redundancy cannot be changed after protecting items to the vault.
1. We recommend that if you're using Azure as a primary backup storage endpoint, continue to use the default **Geo-redundant** setting.
1. If you don't use Azure as a primary backup storage endpoint, then choose **Locally redundant**, which reduces the Azure storage costs.
1. Learn more about [geo](../storage/common/storage-redundancy.md#geo-redundant-storage) and [local](../storage/common/storage-redundancy.md#locally-redundant-storage) redundancy.

  ![Choose storage redundancy](./media/backup-vault-overview/storage-redundancy.png)

1. Select the Review + create button at the bottom of the page.

    ![Select Review + Create](./media/backup-vault-overview/review-and-create.png)

## Delete a Backup vault

This section describes how to delete a Backup vault. It contains instructions for removing dependencies and then deleting a vault.

### Before you start

You can't delete a Backup vault with any of the following dependencies:

- You can't delete a vault that contains protected data sources (for example, Azure database for PostgreSQL servers).
- You can't delete a vault that contains backup data.

If you try to delete the vault without removing the dependencies, you'll encounter the following error messages:

>Cannot delete the Backup vault as there are existing backup instances or backup policies in the vault. Delete all backup instances and backup policies that are present in the vault and then try deleting the vault.

### Proper way to delete a vault

>[!WARNING]
The following operation is destructive and can't be undone. All backup data and backup items associated with the protected server will be permanently deleted. Proceed with caution.

To properly delete a vault, you must follow the steps in this order:

- Verify if there are any protected items:
  - Go to **Backup Instances** in the left navigation bar. All items listed here must be deleted first.

After you've completed these steps, you can continue to delete the vault.

### Delete the Backup vault

When there are no more items in the vault, select **Delete** on the vault dashboard. You'll see a confirmation text asking if you want to delete the vault.

![Delete vault](./media/backup-vault-overview/delete-vault.png)

1. Select **Yes** to verify that you want to delete the vault. The vault is deleted. The portal returns to the **New** service menu.

## Monitor and manage the Backup vault

This section explains how to use the Backup vault **Overview** dashboard to monitor and manage your Backup vaults. The overview pane contains two tiles: **Jobs** and **Instances**.

![Overview dashboard](./media/backup-vault-overview/overview-dashboard.png)

### Manage Backup instances

In the **Jobs** tile, you get a summarized view of all backup and restore related jobs in your Backup vault. Selecting any of the numbers in this tile allows you to view more information on jobs for a particular datasource type, operation type, and status.

![Backup instances](./media/backup-vault-overview/backup-instances.png)

### Manage Backup jobs

In the **Backup Instances** tile, you get a summarized view of all backup instances in your Backup vault. Selecting any of the numbers in this tile allows you to view more information on backup instances for a particular datasource type and protection status.

![Backup jobs](./media/backup-vault-overview/backup-jobs.png)

## Next steps

- [Configure backup on Azure PostgreSQL databases](backup-azure-database-postgresql.md#configure-backup-on-azure-postgresql-databases)
