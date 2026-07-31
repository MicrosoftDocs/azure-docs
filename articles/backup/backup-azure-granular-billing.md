---
title: Configure Granular Billing in Azure Backup
description: Azure Backup granular billing preview lets you view backup costs at multiple levels. Improve cost tracking and reporting for your teams today.
#customer intent: As an IT admin, I want to set up backup cost reporting at the protected item level so that I can see detailed charges for each resource.
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.reviewer: v-mallicka
ms.date: 04/13/2026
ms.topic: how-to
ms.service: azure-backup
---

# Configure granular billing in Azure Backup (preview)

Granular billing in Azure Backup lets you view backup costs at a custom granularity level for improved chargeback and reporting across teams, applications, and cost centers.

>[!IMPORTANT]
>
> - Granular billing is currently in preview for Recovery Services vault only.
> - This feature is a management-plane reporting change only and doesn’t modify pricing meters or total backup costs.
> - Existing historical bill lines continue to remain in the earlier format.

## Available billing granularity levels

Azure Backup provides multiple granularity levels to help you view and analyze backup costs based on your reporting and chargeback requirements.

You can select one of the following granularity levels as per the requirements:

- **Vault level (default)**: Shows backup costs that surface under the associated Recovery Services vault. Costs for resources that map to a designated meter appear as one line item per vault.

- **Protected item level**: Shows backup costs for each protected item.

- **Tag level**: Aggregates backup costs based on a selected tag. The default tag **MS-resourceParent** applies when you choose tag level granularity. You can also create Custom tags under the **CS-resourceParent** tag that helps to:

   - View backup costs aggregated using existing tags.
   - Group costs by application, environment, or cost center.
   - Avoid creating separate vaults per department.

## Set up granular billing

To set up granular billing in the Recovery Services vault, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to the **Recovery Services vault and** select **Settings** > **Properties**.

   :::image type="content" source="./media/backup-azure-granular-billing/granular-billing-property.png" alt-text="Screenshot that shows how to configure granular billing properties in the Recovery Services vault." lightbox="./media/backup-azure-granular-billing/granular-billing-property.png":::

1. On the **Properties** pane, for **Cost Management Granularity**, select **Update** .

1. On the **Cost Management Granularity** pane, select a granularity option - **Vault level**, **Protected item level**, or **Tag level**.

1. Select **Update** to save the setting.

## Validate backup charges in Cost Analysis

After you configure granular billing for Azure Backup, verify that the updated backup charges reflect correctly in Cost Management by using the selected granularity.

>[!NOTE]
>
> - New charges appear in the selected format after you update Cost Management granularity.
> - Older charges keep the previous format.
> - Activity logs capture the change to the cost setting.
> - The updated changes might take up to 2 hours to appear in Cost Analysis.

To validate backup charges in Cost Analysis, follow these steps:

1. Go to the **target subscription** and select **Cost Management** \> **Cost analysis**.

1. On the **Cost analysis** pane, set the **View** as **Resources** and verify if the new backup charges appear in the selected granularity format.

   ***The prices shown in the following screenshot are for example purposes only.***

   :::image type="content" source="./media/backup-azure-granular-billing/resource-billing.png" alt-text="Screenshot that shows backup charges in the selected granularity format in Cost Analysis." lightbox="./media/backup-azure-granular-billing/resource-billing.png":::

## Troubleshoot granular billing issues

This section provides troubleshooting steps to resolve issues related to granular billing in Azure Backup.

### The expected charges don’t appear in **Cost Analysis**.

To resolve the issue:

1. Confirm that the vault type is Recovery Services vault.

1. Verify that you saved the granularity setting.

1. Check the activity log that the update operation completed successfully.

1. Wait up to 2 hours and refresh **Cost Analysis** to view the changes.

1. Ensure that you select the correct subscription and time range scope in **Cost Analysis**.

## Related content

[Estimate and understand Azure Backup pricing](azure-backup-pricing.md).
