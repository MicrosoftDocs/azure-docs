---
title: Manage Azure Native Commvault resources
description: Create and manage storage, backup plans, protection groups, backup operations, recovery operations, and Compliance Lock in Azure Native Commvault Cloud.
author: agrimayadav
ms.author: agrimayadav
ms.topic: how-to
ms.service: partner-services
ms.date: 08/27/2026
---
# Manage Azure Native Commvault resources

After you create a Commvault Cloud account, create storage, a backup plan, and a protection group before you run backup and recovery operations.

## Create storage

Storage defines where Commvault stores backup data. Before you create storage, you must have the **Commvault Backup Operator** or **Commvault Backup Administrator** role.

1. Open your Commvault Cloud account.
1. Under **Backup & Restore**, select **Storage**.
1. Select **Create**.
1. Enter a storage name.
1. Select the supported storage location and storage class:
   - **Hot** for frequent access.
   - **Cool** for infrequent access.
1. Review the configuration, and then select **Create**.

## Create a backup plan

A backup plan defines when backups run, where backup data is stored, and how long recovery points are retained.

1. Open your Commvault Cloud account.
1. Under **Backup & Restore**, select **Plans**.
1. Select **Create**.
1. Enter a name for the plan.
1. Configure the primary storage.
1. Configure the backup schedule and retention.
1. Add extra storage copies if supported and required.
1. Review the configuration, and then select **Create**.

## Create a protection group

A protection group associates Azure resources with a backup plan and runs scheduled and on-demand backups on the group.

1. Open your Commvault Cloud account.
1. Under **Backup & Restore**, select **Protection groups**.
1. Select **Create**.
1. Enter a name.
1. Select the supported data-source type.
1. Select manual or rule-based resource selection.
1. Add Azure resources or define selection rules.
1. Select the backup plan.
1. Review the resources that the service will protect, and then select **Create**.

> [!NOTE]
> The preview currently supports protection and recovery for Azure virtual machines only. Support for additional workloads is planned in future releases, including Azure Kubernetes Service (AKS).
>
> A newly created group initially shows the protection status as **To Be Protected** before the first scheduled backup finishes.

## Manage protection group operations

After you create a protection group, you can run backup and recovery operations for its associated Azure virtual machines from the Azure portal.

To manage a protection group:

- Open your Commvault Cloud account.
- Under **Backup & Restore**, select **Protection groups**.
- Select the protection group that you want to manage.
- Select one of the following actions:

   - **Recover**: Restore one or more protected virtual machines from an available recovery point. Depending on the recovery option, you can restore the original virtual machine or create a new virtual machine from the backed-up data.
   - **Backup now**: Start an on-demand backup without waiting for the next scheduled backup. The backup uses the storage and retention settings configured in the plan associated with the protection group.
   - **Stop backup**: Stop future scheduled backups without deleting the protection group or its configuration. Existing recovery points remain available for recovery.
   - **Resume backup**: Restart scheduled backups for a protection group whose backups were previously stopped. Future backups run according to the schedule configured in the associated backup plan.

> [!NOTE]
> To view detailed backup and recovery job information or troubleshoot job failures, use Commvault Command Center.

## Manage Compliance Lock

Compliance Lock helps protect backup data from accidental or malicious modification or deletion. When Compliance Lock is enabled on a storage resource, the associated backup copies are immutable, and their retention periods can't be reduced.

Compliance Lock is enabled by default when you create a storage resource through Azure Native Commvault Cloud.

### Restrictions while Compliance Lock is enabled

When Compliance Lock is enabled:

- You can't delete the storage resource.
- You can't reduce the retention period of a plan associated with the storage, but you can increase it.
- You can't delete a plan associated with the storage.
- You can't delete a protection group associated with a plan that uses the locked storage.

To perform one of these operations, first request that Compliance Lock be disabled on the associated storage resource.

### Request Compliance Lock disablement

Disabling Compliance Lock is a protected operation that requires multi-person authorization.

To request disablement:

- Open your Commvault Cloud account.
- Under **Backup & Restore**, select **Storage**.
- Select the storage resource.
- Select **Manage Compliance Lock**.
- Provide a reason for disabling Compliance Lock.
- Submit the request.

After you submit the request, the Compliance Lock status changes to **Disablement pending** while the request is reviewed.

Authorized approvers receive an email and a Commvault notification. Approvers review and approve or deny the request in Commvault Command Center.

- If the request is approved, the Compliance Lock status changes to **Disabled**.
- If the request is denied, the Compliance Lock status remains **Enabled**.

> [!IMPORTANT]
> You can't delete the storage resource, delete associated plans or protection groups, or reduce plan retention until Compliance Lock is disabled.

## Get support

If you need help with a Commvault Cloud resource, contact [Commvault support](https://support.commvault.com/).
