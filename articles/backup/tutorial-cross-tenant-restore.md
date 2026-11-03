---
title: Tutorial - Configure cross-tenant restore and restore data across tenants (preview)
description: In this tutorial, learn how to assign roles, create a cross-tenant vault mapping, restore vaulted backup data from a source tenant to a target tenant, and delete the mapping in Azure Backup.
ms.topic: tutorial
ms.date: 10/09/2026
ms.service: azure-backup
author: akarshprabhu
ms.author: akak
#customer intent: As a backup administrator, I want to configure cross-tenant restore and restore data to a different tenant, so that I can recover protected workloads after a tenant lockout, ransomware attack, or tenant consolidation.
---

# Tutorial: Configure cross-tenant restore and restore data across tenants (preview)

In this tutorial, you map a source vault to a target vault in a different Microsoft Entra tenant. You then restore vaulted recovery points to the target tenant and delete the mapping when you no longer need it.

> [!IMPORTANT]
> Cross-tenant restore for Azure Backup is currently in preview. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability.

In this tutorial, you:

> [!div class="checklist"]
> - Assign the roles that cross-tenant restore requires.
> - Create and verify a cross-tenant vault mapping.
> - Restore data from the source tenant to the target tenant.
> - Delete the vault mapping.

## Prerequisites

Before you start, make sure that you have:

- **Vaulted recovery points for a supported workload** in the source vault. The source and target vaults must be in the same region. For the supported workloads and regions, see [Cross-tenant restore for Azure Backup](cross-tenant-restore-overview.md#supported-workloads-and-limitations). Note that only vaulted backups can be restored across tenants. 
- **A Resource Guard in the target tenant** that's associated with the target vault. Enable the cross-tenant restore critical operation on the Resource Guard. To set up this configuration, see [Create a Resource Guard](multi-user-authorization-tutorial.md#create-a-resource-guard), [Select operations to protect using Resource Guard](multi-user-authorization-tutorial.md#select-operations-to-protect-using-resource-guard), and [Enable MUA on a vault](multi-user-authorization-tutorial.md#enable-mua-on-a-vault).
- **Permission to assign roles** in both tenants. For more information, see [Steps to assign an Azure role](../role-based-access-control/role-assignments-steps.md).

## Assign the required roles

Cross-tenant restore uses two personas. The following tables list the Azure built-in roles that each persona needs. For role details, see [Backup Contributor](../role-based-access-control/built-in-roles/storage.md#backup-contributor) and [Backup MUA Operator](../role-based-access-control/built-in-roles/storage.md#backup-mua-operator).

**Mapping creator** creates the vault mapping:

| Scope | Required role |
| --- | --- |
| Source vault | Backup Contributor |
| Target vault | CTR Creator |
| Resource Guard associated with the target vault | Backup MUA Operator or higher |

**Mapping and restore operator** views and deletes mappings, browses protected items and recovery points, monitors jobs, and starts restores:

| Scope | Required role |
| --- | --- |
| Target vault | CTR Contributor, Backup Contributor |
| Resource Guard associated with the target vault | Backup MUA Operator or higher |

A guest user from the source tenant can act as the mapping creator if you assign the required roles temporarily at the appropriate scopes. Remove the temporary role assignments after you create the mapping, in accordance with your organization's access-management policies.

Assign each role at the scope that the previous tables list. For steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md). For other methods, see [Assign Azure roles using Azure PowerShell](../role-based-access-control/role-assignments-powershell.md) or [Azure CLI](../role-based-access-control/role-assignments-cli.md). For the permissions that the CTR roles include, see [Permissions in the CTR roles](#permissions-in-the-ctr-roles).

## Create a cross-tenant vault mapping

1. In the source tenant, open the source vault.
1. Select **Properties**.
1. Under **Cyber recovery settings**, in the **Cross Tenant Restore (Preview)** row, select **View details**.

   :::image type="content" source="./media/tutorial-cross-tenant-restore/properties-cross-tenant-restore.png" alt-text="Screenshot of the source vault Properties page, with a red outline around the Cross Tenant Restore (Preview) row and its View details link under Cyber recovery settings." lightbox="./media/tutorial-cross-tenant-restore/properties-cross-tenant-restore.png":::

1. Select **Configure**.
1. On the **Configure Cross tenant restore** page, enter a mapping name, and then select the target tenant.
1. In the **Select vault** pane, select the target vault.

   :::image type="content" source="./media/tutorial-cross-tenant-restore/configure-cross-tenant-restore.png" alt-text="Screenshot of the Configure Cross tenant restore page. The Select vault pane lists the available target vaults." lightbox="./media/tutorial-cross-tenant-restore/configure-cross-tenant-restore.png":::

1. Validate the configuration.
1. Select **Review + configure**, and then select **Configure Mapping**.
1. If you're prompted, authorize the operation. Because a Resource Guard protects the target vault, you need the **Backup MUA Operator** role or higher on that Resource Guard.

### Verify the mapping

Cross-tenant mappings and mapped-item details are intentionally not visible from the source tenant or source vault. This design helps prevent someone with unauthorized access to the source vault from discovering the target vault and mapping details. Use the target vault to view and manage mappings, browse mapped items, and perform restores, with the required permissions.

In the target vault, you can find cross-tenant mapped vaults through either of these paths:

- **Properties** > **Cross Tenant Restore** > **View details** > **View Mapped Items**.
- **Backup items** > **Cross Tenant mapped vaults**.

To verify the mapping through the vault properties:

1. In the target tenant, open the target vault.
1. Select **Properties**.
1. Under **Cross Tenant Restore**, select **View details**.
1. Select **View Mapped Items**, and then verify that the mapping status is **Configured**.

You can also go to **Backup items**, and then select **Cross Tenant mapped vaults** to view the mapped vaults.

:::image type="content" source="./media/tutorial-cross-tenant-restore/cross-tenant-protected-items.png" alt-text="Screenshot of the Backup items page in the target vault, with a red outline around the Cross Tenant mapped vaults button on the command bar." lightbox="./media/tutorial-cross-tenant-restore/cross-tenant-protected-items.png":::

Use either path to view mappings later. You can review the mapping name, vault details, and mapping status. You need the **CTR Contributor** role on the target vault.

## Restore data across tenants

You can restore only from vaulted recovery points, and only to an alternate location.

1. In the target tenant, open the target vault.
1. Under **Protected items**, select **Backup items**.
1. On the command bar, select **Cross Tenant mapped vaults**.

   :::image type="content" source="./media/tutorial-cross-tenant-restore/cross-tenant-protected-items.png" alt-text="Screenshot of the Backup items page in the target vault, with a red outline around the Cross Tenant mapped vaults button on the command bar." lightbox="./media/tutorial-cross-tenant-restore/cross-tenant-protected-items.png":::

1. Select the mapped vault.
1. For the item that you want to restore, select **Restore**.

   :::image type="content" source="./media/tutorial-cross-tenant-restore/recover-cross-tenant-item.png" alt-text="Screenshot of the source protected items list in the target vault, with checkboxes for selecting multiple items, a Bulk Restore (Preview) command, and a red outline around an item's Restore link." lightbox="./media/tutorial-cross-tenant-restore/recover-cross-tenant-item.png":::

1. Select a recovery point.
1. Configure the restore settings for the target tenant.
1. Start the restore. If you're prompted, authorize the operation.
1. To monitor the restore, open **Backup jobs** in the target vault. For more information, see [Monitor Azure Backup jobs](backup-azure-monitoring-built-in-monitor.md#backup-jobs).

To restore Azure VMs at scale, select the checkboxes for multiple items in the source protected items list, and then select **Bulk Restore (Preview)** on the command bar. Follow the prompts to configure and start the restores.

For workload-specific restore settings, see:

- [Azure VMs](backup-azure-arm-restore-vms.md#restore-disks)
- [Azure Files](restore-afs.md#restore-to-an-alternate-location-full-share-recovery)
- [SQL Server in Azure VMs](restore-sql-database-azure-vm.md#restore-to-an-alternate-location)
- [SAP HANA in Azure VMs](sap-hana-database-restore.md#restore-to-an-alternate-location)
- [SAP ASE in Azure VMs](sap-ase-database-restore.md#restore-the-sap-ase-database-to-an-alternate-location)
- [Azure Database for PostgreSQL - Flexible Server](restore-azure-database-postgresql-flex.md)
- [Azure Blobs](blob-restore.md#restore-blobs)
- [Azure Cosmos DB](backup-azure-cosmos-db-restore.md)
- [Azure Data Lake Storage](azure-data-lake-storage-restore.md)
- [AKS clusters](azure-kubernetes-service-cluster-restore.md#restore-the-aks-clusters)

## Clean up resources

Delete the mapping when you no longer need cross-tenant restore. While a mapping exists, you can't delete the source vault, the target vault, or protected items in the source vault.

Before you delete the mapping, ensure that you have the **CTR Contributor** role on the target vault, and the **Backup MUA Operator** role or higher on the associated Resource Guard.

1. Open the target vault.
1. Select **Cross Tenant Restore**, and then select **View Mapped Items**.
1. Select the mapping, and then select **Delete**.
1. Confirm the operation. If you're prompted, authorize the operation.

## Troubleshoot cross-tenant restore

- **You can't see the Cross Tenant Restore option.** Verify that you're signed in to the correct tenant and that you have the Backup Contributor role on the source vault.
- **You can't create a mapping.** Verify that:
  - You have the Backup Contributor role on the source vault.
  - You have CTR Creator on the target vault.
  - The target vault is associated with a Resource Guard that isn't deleted and has the cross-tenant restore critical operation enabled.
  - You have the Backup MUA Operator role on the Resource Guard.
  - Role assignments have propagated and are assigned at the correct scope. For more information, see [Troubleshoot Azure RBAC](../role-based-access-control/troubleshooting.md).
- **You can't view mappings or browse protected items.** Verify that you have the CTR Contributor role, that at least one mapping exists, and that the mapping status is healthy.
- **You can't start a restore.** Verify that the workload type and the recovery point type (vaulted only) are supported, and that the mapping status is healthy.
- **You can't delete a protected item, the source vault, or the target vault.** Check whether a cross-tenant restore mapping references it. Delete the mapping first.

## Permissions in the CTR roles

The **CTR Creator** and **CTR Contributor** roles include the following actions on vaults.

**CTR Creator**

| Action | Description |
| --- | --- |
| `Microsoft.RecoveryServices/Vaults/read` | View the vault. |
| `Microsoft.RecoveryServices/Vaults/backupCrossTenantVaultMappings/write` | Create a vault mapping. |
| `Microsoft.RecoveryServices/Vaults/backupCrossTenantVaultMappings/read` | Read vault mappings. |

**CTR Contributor**

| Action | Description |
| --- | --- |
| `Microsoft.RecoveryServices/Vaults/backupCrossTenantVaultMappingStatus/action` | Retrieve the mapping status. |
| `Microsoft.RecoveryServices/Vaults/backupCrossTenantVaultMappings/read` | Read the list of mappings. |
| `Microsoft.RecoveryServices/Vaults/backupCrossTenantVaultMappings/backupTriggerValidateOperation/action` | Trigger a validation operation. |
| `Microsoft.RecoveryServices/Vaults/backupCrossTenantVaultMappings/backupValidateOperation/action` | Validate a mapping operation. |
| `Microsoft.RecoveryServices/Vaults/backupCrossTenantVaultMappings/remove/action` | Delete a mapping. |
| `Microsoft.RecoveryServices/Vaults/backupCrossTenantVaultMappings/backupJobs/read` | View backup jobs. |
| `Microsoft.RecoveryServices/Vaults/backupCrossTenantVaultMappings/backupUsageSummaries/read` | View backup usage summaries. |
| `Microsoft.RecoveryServices/Vaults/backupCrossTenantVaultMappings/vaultCredentials/generate/action` | Generate vault credentials. |
| `Microsoft.RecoveryServices/Vaults/backupCrossTenantVaultMappings/vaultCredentials/operationResults/read` | View vault credential operation results. |
| `Microsoft.RecoveryServices/Vaults/backupCrossTenantVaultMappings/vaultCredentials/operationStatus/read` | View vault credential operation status. |
| `Microsoft.RecoveryServices/Vaults/backupCrossTenantVaultMappings/backupFabrics/protectionContainers/protectedItems/read` | View protected items. |
| `Microsoft.RecoveryServices/Vaults/backupCrossTenantVaultMappings/backupFabrics/protectionContainers/protectedItems/operationResults/read` | View protected item operation results. |
| `Microsoft.RecoveryServices/Vaults/backupCrossTenantVaultMappings/backupFabrics/protectionContainers/protectedItems/operationsStatus/read` | View protected item operation status. |
| `Microsoft.RecoveryServices/Vaults/backupCrossTenantVaultMappings/backupFabrics/protectionContainers/protectedItems/recoveryPoints/read` | View recovery points. |
| `Microsoft.RecoveryServices/Vaults/backupCrossTenantVaultMappings/backupFabrics/protectionContainers/protectedItems/recoveryPoints/restore/action` | Restore recovery points. |
| `Microsoft.RecoveryServices/Vaults/backupCrossTenantVaultMappings/backupProtectedItems/read` | View backup protected items. |
| `Microsoft.RecoveryServices/Vaults/backupCrossTenantVaultMappings/backupValidateOperationResults/read` | View validation operation results. |
| `Microsoft.RecoveryServices/Vaults/backupCrossTenantVaultMappings/backupValidateOperationsStatuses/read` | View validation operation status. |

## Related content

- [What is cross-tenant restore for Azure Backup?](cross-tenant-restore-overview.md)
- [Multi-user authorization using Resource Guard](multi-user-authorization-concept.md)
- [Manage backups with Azure role-based access control](backup-rbac-rs-vault.md#role-requirements-for-cross-tenant-restore-preview)