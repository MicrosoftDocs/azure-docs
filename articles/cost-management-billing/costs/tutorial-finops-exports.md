---
title: Tutorial - Setup multiple FinOps dataset exports automatically - Preview
description: This tutorial helps you create automatic exports for your actual and amortized costs in the Cost and Usage Specification standard (FOCUS) format.
author: bandersmsft
ms.author: banders
ms.date: 11/16/2023
ms.topic: tutorial
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: jojoh
---

# Tutorial: Setup multiple FinOps datasets exports automatically - Preview

This tutorial helps you create automatic exports for your actual and amortized costs in the Cost and Usage Specification standard (FOCUS) format. The preview functionality is designed to streamline your FinOps practice by automating the export of cost-impacting datasets. The updated Exports feature optimizations help to handle large datasets. It includes an updated user interface with enhanced manageability. You can selectively rerun existing exports for enhanced security and compliance with firewall configurations.

Review [Azure updates](https://azure.microsoft.com/updates/) to see when the feature becomes available generally available.

## Exports preview functions

The Exports preview feature supports new datasets. You can export more datasets, including price sheets, reservation recommendations, reservation details, and reservation transactions. Also, you can download cost and usage details using the open-source FinOps Open Cost and Usage Specification [FOCUS](https://focus.finops.org/) format. It combines actual and amortized costs and reduces data processing times and storage and compute costs.

The Exports (preview) feature is designed for large files. FinOps datasets are often large and challenging to manage. You can easily handle large datasets with new functionality:

- File partitioning breaks the file into manageable smaller chunks.
- Daily export support file overwrite, which replaces the previous day's file with an updated file each day.

New optimizations improve file manageability, reduce download latency, and help save on storage and network charges. It has an updated user interface so can easily create multiple exports for various cost management datasets to Azure storage using a single, simplified create experience.

It supports multiple dataset schema versions. You can choose the latest or any of the earlier dataset schema versions when you create a new export. Support for earlier schema versions ensures that the data processing layers that you built on for existing datasets are reused without compromising on the latest API functionality.

You can selectively export historical data. You can rerun an existing Export job for a historical period instead of creating a new one-time export for a specific date range.

Secured storage accounts with firewall are supported. You can enhance security and compliance by configuring exports to storage accounts behind a firewall. The Azure Storage firewall provides access control for the public endpoint of the storage account.

## Prerequisites

Data export is available for various Azure account types, including [Enterprise Agreement (EA)](https://azure.microsoft.com/pricing/enterprise-agreement/) and [Microsoft Customer Agreement](get-started-partners.md) customers. To view the full list of supported account types, see [Understand Cost Management data](understand-cost-mgt-data.md). The following Azure permissions, or scopes, are supported per subscription for data export by user and group. For more information about scopes, see [Understand and work with scopes](understand-work-scopes.md).

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
2. Search for **Cost Management + Billing**.
3. Select a billing scope.
4. In the left navigation menu, select **Exports**.

**For Partners**: You can export data to an Azure Storage account linked to your partner storage account, if you have an active subscription in your CSP tenant. Sign in as a partner at the billing account scope or on a customer's tenant.

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

### Schedule frequency

All types of data support various schedule frequency options, as described in the following table.

| **Type of data** | **Frequency options** |
| --- | --- |
| Price sheet | • One-time export <br> • Current month|
| Reservation details | • One-time export <br> • Daily export of month-to-date costs <br> • Monthly export of last month's costs |
| Reservation recommendations | • One-time export <br> • Daily export |
| Reservation transactions | • One-time export <br> • Daily export |
| Cost and usage details (actual)<br> Cost and usage details (amortized) <br> Cost and usage details (FOCUS)<br> Cost and usage details (usage only) | • One-time export <br>• Daily export of month-to-date costs<br>•  Monthly export of last month's costs <br>• Monthly export of last billing month's costs<br>• Weekly export of week-to-date costs<br>• Weekly export of the last seven days |

## Understand data types

The following sections describe the data type options available in exports.

### Cost and usage details

Cost and usage details supports the following options.

- Cost and usage details (actual) – Select this option to export standard usage and purchase charges.
- Cost and usage details (amortized) – Select this option to export amortized costs for purchases like Azure reservations and Azure savings plan for compute.
- Cost and usage details (FOCUS) – Select this option to export cost and usage details using the open-source FinOps Open Cost and Usage Specification ([FOCUS](https://focus.finops.org/)) format. It combines actual and amortized costs. This format reduces data processing time and storage and compute charges for exports.
- Cost and usage details (usage only) – Select this option to export standard usage charges without purchase information. Although you can't use this option when creating new exports, existing exports using this option are still supported.

Agreement types, scopes, and required roles are explained at [Understand and work with scopes](understand-work-scopes.md).

| **Agreement type** | **Export scope**   | **Required role**   | **Supported actions**   |
| --- | --- | --- | --- |
| Enterprise Agreement (EA) | Billing account (enrollment scope) | Enterprise admin, enterprise read only  | Create, read, update, delete  |
|  Enterprise Agreement (EA)  | Department scope | Enterprise admin, enterprise read only, department admin, department read only  | Create, read, update, delete. <br> • Department admin and department read only have permissions only when the **DA view charges** setting is enabled.  |
|  Enterprise Agreement (EA) | Account scope | Enterprise admin, enterprise read only, department admin, department read only, account owner  | Create, read, update, delete. <br> • Department admin and department read only have permissions when the **DA view charges** setting is enabled. <br> • Account owners have permissions only when the **AO view charges** setting is enabled. |
| Microsoft Customer Agreement (MCA)  | Billing account | Billing account owner, billing account contributor, billing account reader | Create, read, update, delete  |
| Microsoft Customer Agreement (MCA) | Billing profile  | Billing profile owner, billing profile contributor, billing profile reader and invoice manager   | Read and update for invoice manager. Create, read, update, delete for all other roles. |
| Microsoft Customer Agreement (MCA) | Invoice section | Invoice section owner, invoice section contributor, invoice section reader, Azure subscription creator | Create, read, update, delete  |

### Price sheet, Reservation details, Reservation recommendations, and Reservation transactions

| **Agreement type**   | **Export scope**   | **Required role**   | **Supported actions**   |
| --- | --- | --- | --- |
| Enterprise Agreement  | Billing account, also known as enrollment scope.  | Enterprise admin, enterprise read only  | Create, read, update, delete  |
| Microsoft Customer Agreement (MCA)  | Billing profile  | Billing profile owner, billing profile contributor, billing profile reader and invoice manager   | Read and update for invoice manager. Create, read, update, delete for all other roles.|

## Next steps

- Learn more about exports at [Tutorial: Create and manage exported data](tutorial-export-acm-data.md).