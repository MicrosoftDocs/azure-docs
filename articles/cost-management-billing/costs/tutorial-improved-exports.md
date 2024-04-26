---
title: Tutorial - Improved exports experience - Preview
description: This tutorial helps you create automatic exports for your actual and amortized costs in the Cost and Usage Specification standard (FOCUS) format.
author: bandersmsft
ms.author: banders
ms.date: 03/21/2024
ms.topic: tutorial
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: jojoh
---

# Tutorial: Improved exports experience - Preview

This tutorial helps you create automatic exports using the improved exports experience that can be enabled from [Cost Management labs](enable-preview-features-cost-management-labs.md#exports-preview) by selecting **Exports (preview)** button. The improved Exports experience is designed to streamline your FinOps practice by automating the export of other cost-impacting datasets. The updated exports are optimized to handle large datasets while enhancing the user experience.

Review [Azure updates](https://azure.microsoft.com/updates/) to see when the feature becomes available generally available.

## Improved functionality

The improved Exports feature supports new datasets including price sheets, reservation recommendations, reservation details, and reservation transactions. Also, you can download cost and usage details using the open-source FinOps Open Cost and Usage Specification [FOCUS](https://focus.finops.org/) format. It combines actual and amortized costs and reduces data processing times and storage and compute costs.
FinOps datasets are often large and challenging to manage. Exports improve file manageability, reduce download latency, and help save on storage and network charges with the following functionality:

- File partitioning, which breaks the file into manageable smaller chunks.
- File overwrite, which replaces the previous day's file with an updated file each day in daily export.

The Exports feature has an updated user interface, which helps you to easily create multiple exports for various cost management datasets to Azure storage using a single, simplified create experience. Exports let you choose the latest or any of the earlier dataset schema versions when you create a new export. Supporting multiple versions ensures that the data processing layers that you built on for existing datasets are reused while you adopt the latest API functionality. You can selectively export historical data by rerunning an existing Export job for a historical period. So you don't have to create a new one-time export for a specific date range. You can enhance security and compliance by configuring exports to storage accounts behind a firewall. The Azure Storage firewall provides access control for the public endpoint of the storage account.

## Prerequisites

Data export is available for various Azure account types, including [Enterprise Agreement (EA)](https://azure.microsoft.com/pricing/enterprise-agreement/) and [Microsoft Customer Agreement (MCA)](get-started-partners.md) customers. To view the full list of supported account types, see [Understand Cost Management data](understand-cost-mgt-data.md). The following Azure permissions, or scopes, are supported per subscription for data export by user and group. For more information about scopes, see [Understand and work with scopes](understand-work-scopes.md).

- Owner - Can create, modify, or delete scheduled exports for a subscription.
- Contributor - Can create, modify, or delete their own scheduled exports. Can modify the name of scheduled exports created by others.
- Reader - Can schedule exports that they have permission to.
    - **For more information about scopes, including access needed to configure exports for Enterprise Agreement and Microsoft Customer agreement scopes, see [Understand and work with scopes](understand-work-scopes.md)**.

For Azure Storage accounts:
- Write permissions are required to change the configured storage account, independent of permissions on the export.
- Your Azure storage account must be configured for blob or file storage.
- Don't configure exports to a storage container that is configured as a destination in an [object replication rule](../../storage/blobs/object-replication-overview.md#object-replication-policies-and-rules).
- To export to storage accounts with configured firewalls, you need other privileges on the storage account. The other privileges are only required during export creation or modification. They are:
  - Owner role on the storage account.  
  Or
  - Any custom role with `Microsoft.Authorization/roleAssignments/write` and `Microsoft.Authorization/permissions/read` permissions.  
  Additionally, ensure that you enable [Allow trusted Azure service access](../../storage/common/storage-network-security.md#grant-access-to-trusted-azure-services) to the storage account when you configure the firewall.
- The storage account configuration must have the **Permitted scope for copy operations (preview)** option set to **From any storage account**.  
    :::image type="content" source="./media/tutorial-export-acm-data/permitted-scope-copy-operations.png" alt-text="Screenshot showing From any storage account option set." lightbox="./media/tutorial-export-acm-data/permitted-scope-copy-operations.png" :::

If you have a new subscription, you can't immediately use Cost Management features. It might take up to 48 hours before you can use all Cost Management features.

Enable the new Exports experience from Cost Management labs by selecting **Exports (preview)**. For more information about how to enable Exports (preview), see [Explore preview features](enable-preview-features-cost-management-labs.md#explore-preview-features). The preview feature is being deployed progressively.

## Create exports

You can create multiple exports of various data types using the following steps.

### Choose a scope and navigate to Exports

1. Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com/).
2. Search for **Cost Management**.
3. Select a billing scope.
4. In the left navigation menu, select **Exports**.
    - **For Partners**: Sign in as a partner at the billing account scope or on a customer's tenant. Then you can export data to an Azure Storage account that is linked to your partner storage account. However, you must have an active subscription in your CSP tenant.
5. Set the schedule frequency.

### Create new exports

On the Exports page, at the top of the page, select **+ Create**.

### Fill in export details

1. On the Add export page, select the **Type of data**, the **Dataset version**, and enter an **Export name**. Optionally, enter an **Export description**.
2. For **Type of data**, when you select **Reservation recommendations**, select values for the other fields that appear:
    - Reservation scope
    - Resource type
    - Look back period
3. Depending on the **Type of data** and **Frequency** that you select, you might need to specify more fields to define the date range in UTC format.
4. Select **Add** to see the export listed on the Basic tab.

:::image type="content" source="./media/tutorial-improved-exports/new-export.png" alt-text="Screenshot of Add export page." lightbox="./media/tutorial-improved-exports/new-export.png" :::

### Optionally add more exports

You can create up to 10 exports when you select **+ Add new exports**.

Select **Next** when you're ready to define the destination.

### Define the export destination

1. On the Destination tab, select the **Storage type**. The default is Azure blob storage.
2. Specify your Azure storage account subscription. Choose an existing resource group or create a new one.
3. Select the Storage account name or create a new one.
4. If you create a new storage account, choose an Azure region.
5. Specify the storage container and directory path for the export file.
6. File partitioning is enabled by default. It splits large files into smaller ones.
7. **Overwrite data** is enabled by default. For daily exports, it replaces the previous day's file with an updated file.
8. Select **Next** to move to the **Review + create** tab.

:::image type="content" source="./media/tutorial-improved-exports/destination-tab.png" alt-text="Screenshot showing Destination tab information." lightbox="./media/tutorial-improved-exports/destination-tab.png" :::

### Review and create

Review your export configuration and make any necessary changes. When done, select **Review + create** to complete the process.

## Manage exports

You can view and manage your exports by navigating to the Exports page where a summary of details for each export appears, including:

- Type of data
- Schedule status
- Data version
- Last run time
- Frequency
- Storage account
- Estimated next run date and time

You can perform the following actions by selecting the ellipsis (**…**) on the right side of the page or by selecting the individual export.

- Run now - Queues an unplanned export to run at the next available moment, regardless of the scheduled run time.
- Export selected dates - Reruns an export for a historical date range instead of creating a new one-time export. You can extract up to 13 months of historical data in three-month chunks. This option isn't available for price sheets.
- Disable - Temporarily suspends the export job.
- Delete - Permanently removes the export.
- Refresh - Updates the Run history.

:::image type="content" source="./media/tutorial-improved-exports/exports-list-details.png" alt-text="Screenshot showing the list of exports and details." lightbox="./media/tutorial-improved-exports/exports-list-details.png" :::

### Schedule frequency

All types of data support various schedule frequency options, as described in the following table.

| **Type of data** | **Frequency options** |
| --- | --- |
| Price sheet | • One-time export <br> • Current month <br>• Daily export of the current month |
| Reservation details | • One-time export <br> • Daily export of month-to-date costs <br> • Monthly export of last month's costs |
| Reservation recommendations | • One-time export <br> • Daily export |
| Reservation transactions | • One-time export <br> • Daily export <br> • Monthly export of last month's data|
| Cost and usage details (actual)<br> Cost and usage details (amortized) <br> Cost and usage details (FOCUS)<br> Cost and usage details (usage only) | • One-time export <br>• Daily export of month-to-date costs<br>•  Monthly export of last month's costs <br>• Monthly export of last billing month's costs |

## Understand data types

- Cost and usage details (actual) - Select this option to export standard usage and purchase charges.
- Cost and usage details (amortized) - Select this option to export amortized costs for purchases like Azure reservations and Azure savings plan for compute.
- Cost and usage details (FOCUS) - Select this option to export cost and usage details using the open-source FinOps Open Cost and Usage Specification ([FOCUS](https://focus.finops.org/)) format. It combines actual and amortized costs. This format reduces data processing time and storage and compute charges for exports. The management group scope isn't supported for Cost and usage details (FOCUS) exports.
- Cost and usage details (usage only) - Select this option to export standard usage charges without purchase information. Although you can't use this option when creating new exports, existing exports using this option are still supported.
- Price sheet – Select this option to export your download your organization's Azure pricing.
- Reservation details – Select this option to export the current list of all available reservations.
- Reservation recommendations – Select this option to export the list of reservation recommendations, which help with rate optimization.
- Reservation transactions – Select this option to export the list of all reservation purchases, exchanges, and refunds.

Agreement types, scopes, and required roles are explained at [Understand and work with scopes](understand-work-scopes.md).

| **Data types** | **Supported agreement** | **Supported scopes** |
| --- | --- | --- |
| Cost and usage (actual) | • EA<br> • MCA that you bought through the Azure website <br> • MCA enterprise<br> • MCA that you buy through a Microsoft partner <br> • Microsoft Online Service Program (MOSP), also known as pay-as-you-go (PAYG) <br> • Azure internal | • EA - Enrollment, department, account, management group, subscription, and resource group <br> • MCA - Billing account, billing profile, Invoice section, subscription, and resource group <br> • Microsoft Partner Agreement (MPA) - Customer, subscription, and resource group |
| Cost and usage (amortized) | • EA <br> • MCA that you bought through the Azure website <br> • MCA enterprise <br> • MCA that you buy through a Microsoft partner <br> • Microsoft Online Service Program (MOSP), also known as pay-as-you-go (PAYG) <br> • Azure internal | • EA - Enrollment, department, account, management group, subscription, and resource group <br> • MCA - Billing account, billing profile, Invoice section, subscription, and resource group <br> • MPA - Customer, subscription, and resource group |
| Cost and usage (FOCUS) | • EA <br> • MCA that you bought through the Azure website <br> • MCA enterprise <br> • MCA that you buy through a Microsoft partner| • EA - Enrollment, department, account, subscription, and resource group <br> • MCA - Billing account, billing profile, invoice section, subscription, and resource group <br> • MPA - Customer, subscription, resource group. **NOTE**: The management group scope isn't supported for Cost and usage details (FOCUS) exports. |
| All available prices | • EA <br>  • MCA that you bought through the Azure website <br> • MCA enterprise <br> • MCA that you buy through a Microsoft partner  | • EA - Billing account <br> • All other supported agreements - Billing profile |
| Reservation recommendations | • EA <br> • MCA that you bought through the Azure website <br> • MCA enterprise <br> • MCA that you buy through a Microsoft partner | • EA - Billing account <br> • All other supported agreements - Billing profile |
| Reservation transactions | • EA <br> • MCA that you bought through the Azure website <br> • MCA enterprise <br> • MCA that you buy through a Microsoft partner | • EA - Billing account <br> • All other supported agreements - Billing profile |
| Reservation details | • EA <br> • MCA that you bought through the Azure website <br> • MCA enterprise <br> • MCA that you buy through a Microsoft partner | • EA - Billing account <br> • All other supported agreements - Billing profile |

## Limitations

The improved exports experience currently has the following limitations.

- The new Exports experience doesn't fully support the management group scope and it has feature limitations.
- Azure internal and MOSP billing scopes and subscriptions don’t support FOCUS datasets.
- Shared access service (SAS) key-based cross tenant export is only supported for Microsoft partners at the billing account scope. It isn't supported for other partner scenarios like any other scope, EA indirect contract or Azure Lighthouse.

## Next steps

- Learn more about exports at [Tutorial: Create and manage exported data](tutorial-export-acm-data.md).