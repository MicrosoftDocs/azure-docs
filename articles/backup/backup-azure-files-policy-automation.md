---
title: Audit and enforce backup for Azure Files using Azure Policy 
description: Learn how to use Azure Policy to audit and enforce backups for all Azure Files instances created in a given scope.
ms.topic: how-to
ms.date: 06/05/2025
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
---

# Audit and enforce backup for Azure Files using Azure Policy 

This article describes how Azure Backup uses built-in Azure Policy definitions to automate auditing and enforcement of backup configurations for Azure Files, ensuring compliance with organizational data protection standards.

Based on the structure of your backup teams and the organization of your resources, you can choose the most suitable policy from the following options to ensure effective and consistent backup management.

## Azure Policy types for Azure Files backup

The following table lists the various policy types that allows you to manage Azure Files instances backups automatically:

| Policy type | Description |
| --- | --- |
| [Policy 1](#policy-1-configure-backup-for-azure-files-shares-without-a-given-tag-to-an-existing-recovery-services-vault-in-the-same-location) | Configures backup for Azure Files without a given tag to an existing Recovery Services vault in the same location. |
| [Policy 2](#policy-2-configure-backup-for-azure-files-shares-with-a-given-tag-to-an-existing-recovery-services-vault-in-the-same-location) | Configures backup for Azure Files with a given tag to an existing Recovery Services vault in the same location. |
| [Policy 3](#policy-3-configure-backup-for-azure-files-shares-without-a-given-tag-to-a-new-recovery-services-vault-with-a-new-policy) | Configures backup for Azure Files without a given tag to a new Recovery Services vault with a new policy. |
| [Policy 4](#policy-4--configure-backup-for-azure-files-shares-with-a-given-tag-to-a-new-recovery-services-vault-with-a-new-policy) | Configures backup for Azure Files with a given tag to a new Recovery Services vault with a new policy. |
| [Policy 5](#policy-5-azure-backup-should-be-enabled-on-azure-file-shares) | Validates if Azure Backup is enabled on Azure Files. |

### Policy 1: Configure backup for Azure Files Shares without a given tag to an existing recovery services vault in the same location
 
This policy enforces backup for all Azure Files by configuring them to use an existing central Recovery Services vault in the same location and subscription as the storage account. It suits scenarios where a central team manages backups across all resources in a subscription. You can exclude Azure Files in storage accounts with a specific tag to refine the policy scope.

The policy checks *`TagNames`* and *`TagValues`* on storage accounts to identify exclusions. It excludes any storage account with a specified tag from the compliance report. The policy evaluates each storage account and its File Shares using the provided parameters and shows the results in the Azure portal.

The evaluation workflow operates as per the following conditions:

- **Storage account is registered with a Recovery Services vault**: If the file share is already backed up, no action is taken. If it isn't, and the storage account is linked to the Recovery Services vault specified in the policy, backup is enabled. If linked to a different Recovery Services vault, backup is skipped.

- **Storage account isn't registered with a Recovery Services vault**: The storage account is registered with the specified Recovery Services vault, and all File Shares within the storage account is backed up automatically.

### Policy 2: Configure backup for Azure Files Shares with a given tag to an existing recovery services vault in the same location

This policy enforces backup for all Azure Files by directing them to a specified Recovery Services vault in the same location and subscription as the storage account. It suits organizations with a central team managing backups. You can limit the policy scope to storage accounts with specific tags by setting the required *`TagName`* and *`TagValue`*.

The policy checks storage accounts based on the provided tags and applies backup settings. If it finds an unprotected file share in an eligible account, it applies the following logic and shows the results in the Azure portal:

- **Storage account is already registered with a Recovery Services vault**: If all File Shares are already backed up, the policy takes no action. If any File Share doesn't have backup configured, and the storage account matches the Recovery Services vault specified in the policy, backup is enabled. If the storage account is linked to a different Recovery Services vault, the policy makes no changes.

- **Storage account isn't registered with any Recovery Services vault**: The policy registers the storage account with the specified Recovery Services vault, and automatically starts the backup operation for all its File Shares.

>[!Note]
>Storage accounts with the specified inclusion tags appear during evaluation and on compliance reports.

### Policy 3: Configure backup for Azure Files Shares without a given tag to a new recovery services vault with a new policy

This policy enforces backup for all Azure Files by deploying a Recovery Services vault in the same location and resource group as the storage account. It suits organizations where application teams manage backups within their own resource groups. You can exclude storage accounts with specific tags (*`TagName`* and *`TagValue`*) to refine the policy scope. The policy checks each storage account based on the defined parameters, skips those storage accounts with exclusion tags, and omits them from compliance reports.

The evaluation workflow operates as per the following conditions:

- **Storage account is already registered with a Recovery Services vault**: If all File Shares are already backed up, the policy takes no action. If a File Share doesn't have backups configured and it's in the  storage account same as the Recovery Services vault specified in the policy, the backup starts after running a one-time remediation task. This task runs only once; future file shares in the same account are backed up automatically.

- **Storage account isn't registered with any Recovery Services vault**: The policy creates a new Recovery Services vault in the same resource group and location as the storage account. It then registers the storage account with this vault, and all file shares within the account are automatically backed up.

### Policy 4- Configure backup for Azure Files Shares with a given tag to a new recovery services vault with a new policy

This policy enforces backup for all Azure Files by creating a Recovery Services vault in the same location and resource group as the storage account. It suits organizations where application teams manage their own backup and restore operations within dedicated resource groups. You can limit the policy scope to storage accounts with specific tags (*`TagName`* and *`TagValue`*) for precise control.

The policy checks each storage account based on the defined parameters. It includes accounts that match the specified tags and reflects their compliance status in the Azure portal.

The evaluation workflow operates as per the following conditions:

- **Storage account is already registered with a Recovery Services vault**: If all file shares are already backed up, the policy takes no action. If any file share doesn't have backup configured, and it's in the storage account same as the Recovery Services vault specified in the policy, the backup starts after running a one-time remediation task. After this task completes, future File Shares in the same account are backed up automatically.

- **Storage account isn't registered with any Recovery Services vault**: The policy creates a new Recovery Services vault in the same location and resource group as the storage account, registers the storage account with this vault, and automatically backs up all File Shares within it.

### Policy 5: Azure Backup should be enabled on Azure file shares

This policy validates if the protection of your Azure Files is configured with Azure Backup—a secure and cost-effective solution for safeguarding Azure workloads. It generates a report that lists both compliant and noncompliant resources.

## Supported and unsupported  scenarios for Azure Files backup with Azure Policy

The following table lists the supported and unsupported scenarios for the available policy types:

| Policy types | Supported | Unsupported |
| --- | --- | --- |
| **Policies 1 and 2** |  Can be assigned to a single location and subscription at a time. To enable backup for Files across locations and subscriptions, multiple instances of the policy assignment need to be created, one for each combination of location and subscription. <br><br> - The specified vault and the Azure Files configured for backup can be under different resource groups. | Management group scope is currently unsupported. |
| **Policies 3 and 4** | Can be assigned to a single subscription at a time (or a resource group within a subscription). |           |

## Assign built-in Azure Policy for Azure Files backup

This section outlines the end-to-end steps to assign Policy 1. The same instructions apply to the other policies. After assignment, the policy automatically configures backup for any new File Share created within the defined scope.

To assign Policy 1 for Azure Files backup, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to **Policy** > **Authoring** > **Definitions** to view all built-in policies across Azure Resources.

   :::image type="content" source="./media/backup-azure-files-policy-automation/view-built-in-policies.png" alt-text="Screenshot shows how the view the built-in policies." lightbox="./media/backup-azure-files-policy-automation/view-built-in-policies.png":::

1. On the **Policy Definitions** pane, filter the list for **Category** as **Backup**, **Policy type** as **Built-in**, and then select the policy named **Configure backup for Azure Files Shares without a given tag to an existing recovery services vault in the same location**.
 
1. On the selected policy pane, review the policy details, and then select **Assign policy**.

   :::image type="content" source="./media/backup-azure-files-policy-automation/view-policy-details.png" alt-text="Screenshot shows the selected policy details." lightbox="./media/backup-azure-files-policy-automation/view-policy-details.png":::

1. On the **Assign policy** pane, on the **Basics** tab, select the **more icon** Corresponding to **Scope**. 

   :::image type="content" source="./media/backup-azure-files-policy-automation/set-policy-enforcement-scope.png" alt-text="Screenshot shows how to set the scope for the policy assignment." lightbox="./media/backup-azure-files-policy-automation/set-policy-enforcement-scope.png":::

1. On the right context pane, select the subscription for the policy to be applied on. 

   You can also select a resource group, so that the policy is applied only for VMs in a particular resource group.
 
1. On the **Parameters** tab, provide the **Location**, **Vault Name**, **Backup Policy Name** to which the Azure Files in the scope must be associated. 

   :::image type="content" source="./media/backup-azure-files-policy-automation/set-policy-enforcement-parameters.png" alt-text="Screenshot shows how to set the policy enforcement parameters." lightbox="./media/backup-azure-files-policy-automation/set-policy-enforcement-parameters.png":::

   You can also specify a tag name and an array of tag values. A File Share which contains any of the specified values for the given tag is excluded from the scope of the policy assignment.
 
   Ensure that **Effect** is set to **`deployIfNotExists`**.

1. On the **Review + create** tab, select **Create**.

>[!Note]
>Avoid assigning this policy to more than **200 File Shares** at once, as it might delay backup triggers by several hours beyond the scheduled time.


## Related content

[About Azure Policy](../governance/policy/overview.md).
