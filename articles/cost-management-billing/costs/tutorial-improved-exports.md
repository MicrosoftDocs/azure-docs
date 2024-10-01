---
title: Tutorial - Create and manage Cost Management exports
description: This tutorial helps you create automatic exports for your actual and amortized costs.
author: jojohpm
ms.author: jojoh
ms.date: 08/28/2024
ms.topic: tutorial
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: banders
---

# Tutorial: Create and manage Cost Management exports

If you read the Cost Analysis tutorial, then you're familiar with manually downloading your Cost Management data. However, you can create a recurring task that automatically exports your Cost Management data to Azure storage on a daily, weekly, or monthly basis. Exported data is in CSV format and it contains all the information that Cost Management collects. You can then use the exported data in Azure storage with external systems and combine it with your own custom data. And you can use your exported data in an external system like a dashboard or other financial system.

This tutorial helps you create one-time and automatic exports. The exports feature is optimized to handle large datasets.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create exports
> * Configure exports for storage accounts with a firewall
> * Manage exports
> * Enable file partitioning for large datasets
> * Verify that data is collected
> * View export run history
> * Understand export data types

## Updated functionality

The exports feature supports new datasets including price sheets, reservation recommendations, reservation details, and reservation transactions. Also, you can download cost and usage details using the open-source FinOps Open Cost and Usage Specification [FOCUS](https://focus.finops.org/) format. It combines actual and amortized costs and reduces data processing times and storage and compute costs.
FinOps datasets are often large and challenging to manage. Exports improve file manageability, reduce download latency, and help save on storage and network charges with the following functionality:

- File partitioning, which breaks the file into manageable smaller chunks.
- File overwrite, which replaces the previous day's file with an updated file each day in daily export.

The exports feature has an updated user interface, which helps you to easily create multiple exports for various cost management datasets to Azure storage using a single, simplified create experience. Exports let you choose the latest or any of the earlier dataset schema versions when you create a new export. Supporting multiple versions ensures that the data processing layers that you built on for existing datasets are reused while you adopt the latest API functionality. You can selectively export historical data by rerunning an existing export job for a historical period. So, you don't have to create a new one-time export for a specific date range. You can enhance security and compliance by configuring exports to storage accounts behind a firewall. The Azure Storage firewall provides access control for the public endpoint of the storage account.

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
    :::image type="content" source="./media/tutorial-improved-exports/permitted-scope-copy-operations.png" alt-text="Screenshot showing From any storage account option set." lightbox="./media/tutorial-improved-exports/permitted-scope-copy-operations.png" :::

If you have a new subscription, you can't immediately use Cost Management features. It might take up to 48 hours before you can use all Cost Management features.

## Create exports

You can create multiple exports of various data types using the following steps.

> [!NOTE]
> - You can create exports on subscription, resource group, management group, department, and enrollment scopes. For more information about scopes, see [Understand and work with scopes](understand-work-scopes.md).
> - When you're signed in as a partner at the billing account scope or on a customer's tenant, you can export data to an Azure Storage account that's linked to your partner storage account. However, you must have an active subscription in your CSP tenant.

### Choose a scope and navigate to Exports

1. Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com/).
1. Search for **Cost Management**.
1. Select a billing scope.
1. In the left navigation menu, select **Exports**.

### Create new exports

On the Exports page, at the top of the page, select **+ Create**.

### Select the export template

1. On the **Basics** tab, select a template that meets your scenario and then select **Next**.   
Note: A template simplifies export creation by preselecting a set of commonly used datasets and their configurations.  

   1. The eight most common templates are always shown. If you don't find a suitable template, select **Show more** to see more options. If none of these templates meet your needs, you can select **Create your own export** to build your custom combination. 
    :::image type="content" source="./media/tutorial-improved-exports/improved-exports-basics-tab.png" border="true" alt-text="Screenshot showing the Basics tab and list of export templates." lightbox="./media/tutorial-improved-exports/improved-exports-basics-tab.png" :::
1. Once you select a template, you see the **Datasets** tab where you can customize your export name by entering a common **Export prefix**, edit the preselected configuration, and add or remove exports from the list. 
1. You can change the template and discard your export configurations by navigating back to the **Basics** tab and selecting a new template.  

### Optional - Add more exports

1. On the **Datasets** tab, you can add another export by selecting **+ Add export**. 
2. Select the **Type of data**, the **Dataset version**, and enter an **Export name**. Optionally, you can enter an **Export description**.
3. For **Type of data**, when you select **Reservation recommendations**, select values for the other fields that appear:
    - Reservation scope
    - Resource type
    - Look back period
4. Depending on the **Type of data** and **Frequency** that you select, you might need to specify more fields to define the date range in UTC format.
5. Select **Add** to see the export listed on the Datasets tab.
6. You can create up to 10 exports when you select **+ Add new exports**.
7. Select **Next** when you're ready to define the destination.  
    :::image type="content" source="./media/tutorial-improved-exports/add-export.png" border="true" alt-text="Screenshot showing the Add export dialog." lightbox="./media/tutorial-improved-exports/add-export.png" :::

### Define the export destination

1. On the Destination tab, select the **Storage type**. The default is Azure blob storage.
2. Specify your Azure storage account subscription. Choose an existing resource group or create a new one.
3. Select the Storage account name or create a new one.
4. If you create a new storage account, choose an Azure region.
6. Specify the storage container and directory path for the export file.
7. Choose the **Format** as CSV or Parquet.
8. Choose the **Compression type** as **None**, **Gzip** for CSV file format, or **Snappy** for the parquet file format. 
9. **File partitioning** is enabled by default. It splits large files into smaller ones.
10. **Overwrite data** is enabled by default. For daily exports, it replaces the previous day's file with an updated file.
11. Select **Next** to move to the **Review + create** tab.  
    :::image type="content" source="./media/tutorial-improved-exports/new-export-example.png" border="true" alt-text="Screenshot showing the New export dialog." lightbox="./media/tutorial-improved-exports/new-export-example.png" :::

### Review and create

Review your export configuration and make any necessary changes. When done, select **Review + create** to complete the process.

Your new export appears in the list of exports. By default, new exports are enabled. If you want to disable or delete a scheduled export, select any item in the list, and then select either **Disable** or **Delete**.

Initially, it can take 12-24 hours before the export runs. However, it can take longer before the data appear in exported files.

## Configure exports for storage accounts with a firewall

If you need to export to a storage account behind the firewall for security and compliance requirements, ensure that you have all [prerequisites](#prerequisites) met.

> [!NOTE]
> If you have an existing scheduled export and your change your storage network configuration, you must update the export and save it to reflect the changes.

Enable **Allow trusted Azure services access** on the storage account. You can turn that on while configuring the firewall of the storage account, from the Networking page. Here's a screenshot showing the page.

:::image type="content" source="./media/tutorial-improved-exports/allow-trusted-access.png" alt-text="Screenshot showing Allow Azure services on the trusted services list exception option." lightbox="./media/tutorial-improved-exports/allow-trusted-access.png" :::

If you missed enabling that setting, it's automatically enabled when you create a new export and use an existing Storage account.

:::image type="content" source="./media/tutorial-improved-exports/allow-trusted-access-export.png" alt-text="Screenshot showing the trusted Azure service access is allowed note." lightbox="./media/tutorial-improved-exports/allow-trusted-access-export.png" :::

A system-assigned managed identity is created for a new job export when created or modified. You must have permissions because Cost Management uses the privilege to assign the *StorageBlobDataContributor* role to the managed identity. The permission is restricted to the storage account container scope. After the export job is created or updated, the user doesn't require Owner permissions for regular runtime operations.

> [!NOTE]
> - When a user updates destination details or deletes an export, the *StorageBlobDataContributor* role assigned to the managed identity is automatically removed. To enable the system to remove the role assignment, the user must have `microsoft.Authorization/roleAssignments/delete` permissions. If the permissions aren't available, the user needs to manually remove the role assignment on the managed identity.
> - Currently, firewalls are supported for storage accounts in the same tenant. However, firewalls on storage accounts aren't supported for cross-tenant exports.

Add exports to the list of trusted services. For more information, see [Trusted access based on a managed identity](../../storage/common/storage-network-security.md#trusted-access-based-on-a-managed-identity).

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

    :::image type="content" source="./media/tutorial-improved-exports/export-run-history.png" border="true" alt-text="Screenshot showing the Export run history." lightbox="./media/tutorial-improved-exports/export-run-history.png" :::

### Understand schedule frequency

Scheduled exports get affected by the time and day of week of when you initially create the export. When you create a scheduled export, the export runs at the same frequency for each export that runs later. For instance, the export is scheduled to run once every UTC day. It creates a daily export of costs accumulated from the start of the month to the current date. It occurs at a daily frequency. Similarly for a weekly export, the export runs every week on the same UTC day as it is scheduled. Individual export runs can occur at different times throughout the day. So, avoid taking a firm dependency on the exact time of the export runs. Run timing depends on the active load present in Azure during a given UTC day. When an export run begins, your data should be available within 4 hours.

Exports are scheduled using Coordinated Universal Time (UTC). The Exports API always uses and displays UTC.

- When you create an export using the [Exports API](/rest/api/cost-management/exports/create-or-update?tabs=HTTP), specify the `recurrencePeriod` in UTC time. The API doesn’t convert your local time to UTC.
    - Example - A weekly export is scheduled on Friday, August 19 with `recurrencePeriod` set to 2:00 PM. The API receives the input as 2:00 PM UTC, Friday, August 19. The weekly export is scheduled to run every Friday.
- When you create an export in the Azure portal, its start date time is automatically converted to the equivalent UTC time.
    - Example - A weekly export is scheduled on Friday, August 19 with the local time of 2:00 AM IST (UTC+5:30) from the Azure portal. The API receives the input as 8:30 PM, Thursday, August 18. The weekly export is scheduled to run every Thursday.

Each export creates a new file, so older exports aren't overwritten. All types of data support various schedule frequency options, as described in the following table.

| **Type of data** | **Frequency options** |
| --- | --- |
| Price sheet | • One-time export <br> • Current month <br>• Daily export of the current month |
| Reservation details | • One-time export <br> • Daily export of month-to-date costs <br> • Monthly export of last month's costs |
| Reservation recommendations | • One-time export <br> • Daily export |
| Reservation transactions | • One-time export <br> • Daily export <br> • Monthly export of last month's data|
| Cost and usage details (actual)<br> Cost and usage details (amortized) <br> Cost and usage details (FOCUS)<br> Cost and usage details (usage only) | • One-time export <br>• Daily export of month-to-date costs<br>•  Monthly export of last month's costs <br>• Monthly export of last billing month's costs |

## Optional - Create an export for multiple subscriptions

You can use a management group to aggregate subscription cost information in a single container. Exports support management group scope for Enterprise Agreement but not for Microsoft Customer Agreement or other subscription types. Multiple currencies are also not supported in management group exports.

Exports at the management group scope support only usage charges. Purchases, including reservations and savings plans aren't supported. Amortized cost reports are also not supported. When you create an export from the Azure portal for a management group scope, the metric field isn't shown because it defaults to the usage type. When you create a management group scope export using the REST API, choose [ExportType](/rest/api/cost-management/exports/create-or-update#exporttype) as `Usage`.

1. Create one management group and assign subscriptions to it, if you haven't already.
1. In cost analysis, set the scope to your management group and select **Select this management group**.
    :::image type="content" source="./media/tutorial-improved-exports/management-group-scope.png" alt-text="Screenshot showing the Select this management group option." lightbox="./media/tutorial-improved-exports/management-group-scope.png":::
    UPDATE
1. Create an export at the scope to get cost management data for the subscriptions in the management group.
    :::image type="content" source="./media/tutorial-improved-exports/new-export-management-group-scope.png" alt-text="Screenshot showing the Create new export option with a management group scope.":::
    UPDATE

## Optional - Enable file partitioning for large datasets

If you have a Microsoft Customer Agreement, Microsoft Partner Agreement, or Enterprise Agreement, you can enable Exports to chunk your file into multiple smaller file partitions to help with data ingestion. When you initially configure your export, set the **File Partitioning** setting to **On**. The setting is **Off** by default.

:::image type="content" source="./media/tutorial-improved-exports/file-partition.png" alt-text="Screenshot showing File Partitioning option." lightbox="./media/tutorial-improved-exports/file-partition.png" :::

If you don't have a Microsoft Customer Agreement, Microsoft Partner Agreement, or Enterprise Agreement, then you don't see the **File Partitioning** option.

Partitioning isn't currently supported for resource groups or management group scopes.

### Update existing exports for file partitioning

If you have existing exports and you want to set up file partitioning, create a new export. File partitioning is only available with the latest Exports version. There might be minor changes to some of the fields in the usage files that get created.

If you enable file partitioning on an existing export, you might see minor changes to the fields in file output. Any changes are due to updates that were made to Exports after you initially set yours up.

### Partitioning output

When file partitioning is enabled, you get a file for each partition of data in the export along with a _manifest.json file. The manifest contains a summary of the full dataset and information for each file partition in it. Each file partition has headers and contains only a subset of the full dataset. To handle the full dataset, you must ingest each partition of the export.

Here's a _manifest.json example manifest file.

```json
{
  "manifestVersion": "2021-01-01",
  "dataFormat": "csv",
  "blobCount": 1,
  "byteCount": 160769,
  "dataRowCount": 136,
  "blobs": [
    {
      "blobName": "blobName.csv",
      "byteCount": 160769,
      "dataRowCount": 136,
      "headerRowCount": 1,
      "contentMD5": "md5Hash"
    }
  ]
}
```

### Update export version

When you create a scheduled export in the Azure portal or with the API, it always runs on the exports version used at creation time. Azure keeps your previously created exports on the same version, unless you update it. Doing so prevents changes in the charges and to CSV fields if the export version is changed. As the export functionality changes over time, field names are sometimes changed and new fields are added.

If you want to use the latest data and fields available, we recommend that you create a new export in the Azure portal. To update an existing export to the latest version, update it in the Azure portal or with the latest Export API version. Updating an existing export might cause you to see minor differences in the fields and charges in files that are produced afterward.

## Verify that data is collected

You can easily verify that your Cost Management data is being collected and view the exported CSV file using Azure Storage Explorer.

In the export list, select the storage account name. On the storage account page, select Open in Explorer. If you see a confirmation box, select **Yes** to open the file in Azure Storage Explorer.

:::image type="content" border="true" source="./media/tutorial-improved-exports/storage-account-page.png" alt-text="Screenshot showing the Storage account page with example information and link to Open in Explorer.":::

In Storage Explorer, navigate to the container that you want to open and select the folder corresponding to the current month. A list of CSV files is shown. Select one and then select **Open**.

:::image type="content" border="true" source="./media/tutorial-improved-exports/storage-explorer.png" alt-text="Screenshot showing example information in Storage Explorer.":::

The file opens with the program or application set to open CSV file extensions. Here's an example in Excel.

:::image type="content" border="true" source="./media/tutorial-improved-exports/example-export-data.png" alt-text="Screenshot showing exported CSV data in Excel.":::

### Download an exported CSV data file

To download the CSV file, browse to the file in Microsoft Azure Storage Explorer and download it.

## View export run history

You can view the run history of your scheduled export by selecting an individual export in the exports list page. The exports list page also provides you with quick access to view the run time of your previous exports and the next time and export will run. Here's an example showing the run history.

:::image type="content" source="./media/tutorial-improved-exports/run-history.png" alt-text="Screenshot shows the Exports pane.":::

Select an export to view the run history.

:::image type="content" source="./media/tutorial-improved-exports/single-export-run-history.png" alt-text="Screenshot shows the run history of an export.":::

### Export runs twice a day for the first five days of the month

There are two runs per day for the first five days of each month after you create a daily export. One run executes and creates a file with the current month’s cost data. It's the run that's available for you to see in the run history. A second run also executes to create a file with all the costs from the prior month. The second run isn't currently visible in the run history. Azure executes the second run to ensure that your latest file for the past month contains all charges exactly as seen on your invoice. It runs because there are cases where latent usage and charges are included in the invoice up to 72 hours after the calendar month is closed. To learn more about Cost Management usage data updates, see [Cost and usage data updates and retention](understand-cost-mgt-data.md#cost-and-usage-data-updates-and-retention). 

>[!NOTE]
> Daily export created between 1st to 5th of the current month would not generate data for the previous month as the export schedule starts from the date of creation. 

## Understand export data types

For a comprehensive reference of all available datasets, including the schema for current and historical versions, see [Cost Management dataset schema index](/azure/cost-management-billing/dataset-schema/schema-index). 

- Cost and usage details (actual) - Select this option to export standard usage and purchase charges.
- Cost and usage details (amortized) - Select this option to export amortized costs for purchases like Azure reservations and Azure savings plan for compute.
- Cost and usage details (FOCUS) - Select this option to export cost and usage details using the open-source FinOps Open Cost and Usage Specification ([FOCUS](https://focus.finops.org/)) format. It combines actual and amortized costs. 
  - This format reduces data processing time and storage and compute charges for exports. 
  - The management group scope isn't supported for Cost and usage details (FOCUS) exports. 
  - You can use the FOCUS-formatted export as the input for a Microsoft Fabric workspace for FinOps. For more information, see [Create a Fabric workspace for FinOps](/cloud-computing/finops/fabric/create-fabric-workspace-finops).
- Cost and usage details (usage only) - Select this option to export standard usage charges without purchase information. Although you can't use this option when creating new exports, existing exports using this option are still supported.
- Price sheet – Select this option to export your download your organization's Azure pricing.
- Reservation details – Select this option to export the current list of all available reservations.
- Reservation recommendations – Select this option to export the list of reservation recommendations, which help with rate optimization.
- Reservation transactions – Select this option to export the list of all reservation purchases, exchanges, and refunds.

Agreement types, scopes, and required roles are explained at [Understand and work with scopes](understand-work-scopes.md).

| **Data types** | **Supported agreement** | **Supported scopes** |
| --- | --- | --- |
| Cost and usage (actual) | • EA<br> • MCA that you bought through the Azure website <br> • MCA enterprise<br> • MCA that you buy through a Microsoft partner <br> • Azure internal | • EA - Enrollment, department, account, subscription, and resource group <br> • MCA - Billing account, billing profile, Invoice section, subscription, and resource group <br> • Microsoft Partner Agreement (MPA) - Customer, subscription, and resource group |
| Cost and usage (amortized) | • EA <br> • MCA that you bought through the Azure website <br> • MCA enterprise <br> • MCA that you buy through a Microsoft partner  <br> • Azure internal | • EA - Enrollment, department, account, subscription, and resource group <br> • MCA - Billing account, billing profile, Invoice section, subscription, and resource group <br> • MPA - Customer, subscription, and resource group |
| Cost and usage (FOCUS) | • EA <br> • MCA that you bought through the Azure website <br> • MCA enterprise <br> • MCA that you buy through a Microsoft partner| • EA - Enrollment, department, account, subscription, and resource group <br> • MCA - Billing account, billing profile, invoice section, subscription, and resource group <br> • MPA - Customer, subscription, resource group. **NOTE**: The management group scope isn't supported for Cost and usage details (FOCUS) exports. |
| All available prices | • EA <br>  • MCA that you bought through the Azure website <br> • MCA enterprise <br> • MCA that you buy through a Microsoft partner  | • EA - Billing account <br> • All other supported agreements - Billing profile |
| Reservation recommendations | • EA <br> • MCA that you bought through the Azure website <br> • MCA enterprise <br> • MCA that you buy through a Microsoft partner | • EA - Billing account <br> • All other supported agreements - Billing profile |
| Reservation transactions | • EA <br> • MCA that you bought through the Azure website <br> • MCA enterprise <br> • MCA that you buy through a Microsoft partner | • EA - Billing account <br> • All other supported agreements - Billing profile |
| Reservation details | • EA <br> • MCA that you bought through the Azure website <br> • MCA enterprise <br> • MCA that you buy through a Microsoft partner | • EA - Billing account <br> • All other supported agreements - Billing profile |

## Limitations

The exports experience currently has the following limitations.

<<<<<<< HEAD
- The new exports experience doesn't fully support the management group scope and it has feature limitations.
- Azure MOSP billing scopes and subscriptions don’t support FOCUS datasets.
=======
- The new exports experience doesn't fully support the management group scope, and it has feature limitations.

- Azure internal accounts and the Microsoft Online Service Program (MOSP), commonly referred to as pay-as-you-go, support only the 'Cost and Usage Details (Usage Only)' dataset for billing scopes and subscriptions. 

>>>>>>> 3578a79c8dd82d54326137e6d9cab9c4cb40422e
- Shared access service (SAS) key-based cross tenant export is only supported for Microsoft partners at the billing account scope. It isn't supported for other partner scenarios like any other scope, EA indirect contract, or Azure Lighthouse.

- EA price sheet: Reservation prices are only available for the current month price sheet and cannot be retrieved for historical exports. To retain historical reservation prices, set up recurring exports.

## FAQ

Here are some frequently asked questions and answers about exports.

### Why is file partitioning enabled in exports?
The file partitioning is a feature that is activated by default to facilitate the management of large files. This functionality divides larger files into smaller segments, which enhances the ease of file transfer, download, ingestion, and overall readability. It's advantageous for customers whose cost files increase in size over time. The specifics of the file partitions are described in a manifest.json file provided with each export run, enabling you to rejoin the original file.

#### How does the enhanced export experience handle missing attributes like subscription IDs?

In the new export experience, missing attributes such as subscription IDs will be set to null or empty, rather than using a default empty GUID (00000000-0000-0000-0000-000000000000), to more accurately indicate the absence of a value. This affects charges pertaining to unused reservations, unused savings plan and rounding adjustments.

#### How much historical data can I retrieve using Exports?

You can retrieve up to 13 months of historical data through the portal UI for all datasets, except for RI recommendations, which are limited to the current recommendation snapshot. To access data older than 13 months, you can use the REST API.

- Cost and usage (Actual), Cost and usage (Amortized), Cost and usage (FOCUS): Up to 7 years of data.

- Reservation transactions: Up to 7 years of data across all channels.

- Reservation recommendations, Reservation details: Up to 13 months of data.

- All available prices:

  - MCA/MPA: Up to 13 months.
  
  - EA: Up to 25 months (starting from December 2022).
  
## Next steps

- Learn more about exports at [Tutorial: Create and manage exported data](tutorial-export-acm-data.md).
