---
title: Tutorial - Create and manage Cost Management exports
description: This tutorial helps you create automatic exports for your actual and amortized costs.
author: vikramdesai01
ms.author: vikdesai
ms.date: 06/26/2025
ms.topic: tutorial
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: vikdesai
ms.custom:
  - build-2025
  - sfi-image-nochange
---

# Tutorial: Create and manage Cost Management exports

If you read the Cost Analysis tutorial, then you're familiar with manually downloading your Cost Management data. However, you can create a recurring task that automatically exports your Cost Management data to Azure storage on a daily, or monthly basis. Exports is designed to streamline your FinOps practice by automating the export of other cost-impacting datasets. You can use the exported data with external systems and combine it with your own custom data.

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

The exports feature supports multiple datasets including price sheets, reservation recommendations, reservation details, and reservation transactions. Also, you can download cost and usage details using the open-source FinOps Open Cost and Usage Specification [FOCUS](https://focus.finops.org/) format. It combines actual and amortized costs and reduces data processing times and storage and compute costs.
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
- To export to storage accounts with firewall rules, you need other privileges on the storage account. These privileges are only required during export creation or modification:

- __Owner__ role on the storage account ___or___

  - A __custom role__ that includes:
  
    - `Microsoft.Authorization/roleAssignments/write`
    
    - `Microsoft.Authorization/permissions/read`
    
  When you configure the firewall, ensure that [Allow trusted Azure service access](../../storage/common/storage-network-security.md#grant-access-to-trusted-azure-services) is enabled on the storage account. If you want to use the [Exports REST API](/rest/api/cost-management/exports) to write to a storage account behind a firewall, use API version __2023-08-01__ or later. All newer API versions continue to support exports behind firewalls.
  
  A __system-assigned managed identity__ is created for a new export if the user has `Microsoft.Authorization/roleAssignments/write` permissions on the storage account. This setup ensures that the export will continue to work if you enable a firewall in the future. After the export is created or updated, the user no longer needs the __Owner__ role for routine operations.
  
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
9. **File partitioning** is enabled by default. It splits large files into smaller ones and can't be disabled.
10. **Overwrite data** is enabled by default. For daily exports, it replaces the previous day's file with an updated file.
11. Select **Next** to move to the **Review + create** tab.  
    :::image type="content" source="./media/tutorial-improved-exports/new-export-example.png" border="true" alt-text="Screenshot showing the New export dialog." lightbox="./media/tutorial-improved-exports/new-export-example.png" :::

### Review and create

Review your export configuration and make any necessary changes. When done, select **Review + create** to complete the process.

Your new export appears in the list of exports. By default, new exports are enabled. If you want to disable or delete a scheduled export, select any item in the list, and then select either **Disable** or **Delete**.

The export process can take up to 24 hours to complete before the data is ready.

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

Add exports to the list of trusted services. For more information, see [Trusted access based on a managed identity](../../storage/common/storage-network-security-trusted-azure-services.md#trusted-access-based-on-a-managed-identity).

## Manage exports

You can view the list of available exports by navigating to the Exports page and manage individual exports by selecting them.

You can perform the following actions on individual exports.

- Run now - Queues an unplanned export to run at the next available moment, regardless of the scheduled run time.
- Export selected dates - Reruns an export for a historical date range instead of creating a new one-time export. You can extract up to 13 months of historical data in one-month chunks. This option isn't available for price sheets.
- Disable - Temporarily suspends the export job.
- Delete - Permanently removes the export.
- Refresh - Updates the Run history.

    :::image type="content" source="./media/tutorial-improved-exports/export-run-history.png" border="true" alt-text="Screenshot showing the Export run history." lightbox="./media/tutorial-improved-exports/export-run-history.png" :::

### Understand schedule frequency

When you create a scheduled export, the export runs at the same frequency for each export that runs later. For instance, if the export is scheduled to run once every UTC day, it creates a daily export of costs accumulated from the start of the month to the current date. Individual export runs can occur at different times throughout the day, so avoid relying on the exact time of the export runs. The run timing depends on the active load present in Azure during a given UTC day. Once an export run begins, your data should be available within 4 hours. Exports are scheduled using Coordinated Universal Time (UTC). The Exports API always uses and displays UTC.

When you create an export using the [Exports API](/rest/api/cost-management/exports/create-or-update?tabs=HTTP), specify the `recurrencePeriod` in UTC time. The API doesn’t convert your local time to UTC.
- Example - A daily export is scheduled on Friday, August 19 with `recurrencePeriod` set to 2:00 PM. The API receives the input as 2:00 PM UTC, Friday, August 19.

When you create an export in the Azure portal, its start date time is automatically converted to the equivalent UTC time.
- Example - A daily export is scheduled on Friday, August 19 with the local time of 2:00 AM IST (UTC+5:30) from the Azure portal. The API receives the input as 8:30 PM, Thursday, August 18.

Various datasets support different schedule frequency options as described in the following table.

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
1. Create an export at the scope to get cost management data for the subscriptions in the management group.

## File partitioning for large datasets

The file partitioning is a feature that is activated by default to facilitate the management of large files. This functionality divides larger files into smaller segments, which enhances the ease of file transfer, download, ingestion, and overall readability. It's advantageous for customers whose cost files increase in size over time. The specifics of the file partitions are described in a manifest.json file provided with each export run, enabling you to rejoin the original file.

### Manifest file

With every export, run you get multiple partitions of the data along with a manifest.json file. The manifest contains a summary of the full dataset and information for each file partition in it. Each file partition has headers and contains only a subset of the full dataset. To handle the full dataset, you must ingest each partition of the export.

Here's a _manifest.json example manifest file.

```json
{
  "manifestVersion": "2024-04-01",
  "byteCount": 8032,
  "blobCount": 1,
  "dataRowCount": 36,
  "exportConfig": {
    "exportName": "sample",
    "resourceId": "/providers/Microsoft.Billing/billingAccounts/1234567/providers/Microsoft.CostManagement/exports/sample",
    "dataVersion": "2023-05-01",
    "apiVersion": "2023-07-01-preview",
    "type": "ReservationRecommendations",
    "timeFrame": "MonthToDate",
    "granularity": null
  },
  "deliveryConfig": {
    "partitionData": true,
    "dataOverwriteBehavior": "OverwritePreviousReport",
    "fileFormat": "Csv",
    "compressionMode": "None",
    "containerUri": "/subscriptions/ 00000000-0000-0000-0000-000000000000/resourceGroups/samplerg/providers/Microsoft.Storage/storageAccounts/samplestorage",
    "rootFolderPath": "folder"
  },
  "runInfo": {
    "executionType": "OnDemand",
    "submittedTime": "2025-03-21T21:04:06.5234447Z",
    "runId": "bbac73f1-9a05-4de6-84ab-c72b568a03b4",
    "startDate": "2025-03-01T00:00:00",
    "endDate": "2025-03-21T00:00:00Z"
  },
  "blobs": [
    {
      "blobName": " folder/sample/ 00000000-0000-0000-0000-000000000000/part0.csv",
      "byteCount": 8032,
      "dataRowCount": 36
    }
  ]
}

```

## Verify that data is collected

You can easily verify that your Cost Management data is being collected and view the exported CSV file using Azure Storage Explorer.

In the export list, select the storage account name. On the storage account page, select Open in Explorer. If you see a confirmation box, select **Yes** to open the file in Azure Storage Explorer.

:::image type="content" border="true" source="./media/tutorial-improved-exports/storage-account-page.png" alt-text="Screenshot showing the Storage account page with example information and link to Open in Explorer.":::

In Storage Explorer, navigate to the container that you want to open and select the folder corresponding to the current month. A list of CSV files is shown. Select one and then select **Open**.

The file opens with the program or application set to open CSV file extensions. Here's an example in Excel.

:::image type="content" border="true" source="./media/tutorial-improved-exports/example-export-data.png" alt-text="Screenshot showing exported CSV data in Excel.":::

### Download an exported data file

To download the exported CSV or Parquet file, browse to the file in Microsoft Azure Storage Explorer and download it.

## View export run history

You can view the run history of your scheduled export by selecting an individual export in the exports list page. The exports list page also provides you with quick access to view the run time of your previous exports and the next time and export will run. Here's an example showing the run history.

:::image type="content" source="./media/tutorial-improved-exports/run-history.png" alt-text="Screenshot shows the Exports pane.":::

Select an export to view the run history.

:::image type="content" source="./media/tutorial-improved-exports/single-export-run-history.png" alt-text="Screenshot shows the run history of an export.":::

### Cost export runs twice a day for the first five days of the month

There are two runs per day for the first five days of each month after you create a daily export of cost and usage details dataset. One run executes and creates a file with the current month’s cost data. It's the run that's available for you to see in the run history. A second run also executes to create a file with all the costs from the prior month. The second run isn't currently visible in the run history. Azure executes the second run to ensure that your latest file for the past month contains all charges exactly as seen on your invoice. It runs because there are cases where latent usage and charges are included in the invoice up to 72 hours after the calendar month is closed. To learn more about Cost Management usage data updates, see [Cost and usage data updates and retention](understand-cost-mgt-data.md#cost-and-usage-data-updates-and-retention). 

>[!NOTE]
> Daily export created between 1st to 5th of the current month wouldn't generate data for the previous month as the export schedule starts from the date of creation. 

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
| Cost and usage (FOCUS) | • EA <br> • MCA that you bought through the Azure website <br> • MCA enterprise <br> • MCA that you buy through a Microsoft partner| • EA - Enrollment, department, account, subscription, and resource group. **NOTE:** The management group scope isn't supported for Cost and usage details (FOCUS) exports.  <br> • MCA - Billing account, billing profile, invoice section, subscription, and resource group <br> • MPA - Customer, subscription, resource group.  |
| All available prices | • EA <br>  • MCA that you bought through the Azure website <br> • MCA enterprise <br> • MCA that you buy through a Microsoft partner  | • EA - Billing account <br> • All other supported agreements - Billing profile |
| Reservation recommendations | • EA <br> • MCA that you bought through the Azure website <br> • MCA enterprise <br> • MCA that you buy through a Microsoft partner | • EA - Billing account <br> • All other supported agreements - Billing profile |
| Reservation transactions | • EA <br> • MCA that you bought through the Azure website <br> • MCA enterprise <br> • MCA that you buy through a Microsoft partner | • EA - Billing account <br> • All other supported agreements - Billing profile |
| Reservation details | • EA <br> • MCA that you bought through the Azure website <br> • MCA enterprise <br> • MCA that you buy through a Microsoft partner | • EA - Billing account <br> • All other supported agreements - Billing profile |

## Limitations

The exports experience currently has the following limitations.

- The new exports experience doesn't fully support the management group scope and has feature limitations. Only the cost and usage details (Usage) dataset is available in CSV format without any compression.
- Azure MOSP billing scopes and subscriptions don’t support FOCUS datasets.
- Shared access service (SAS) key-based cross tenant export is only supported for Microsoft partners at the billing account scope. It isn't supported for other partner scenarios like any other scope, EA indirect contract, or Azure Lighthouse.

- EA price sheet: Reservation prices are only available for the current month price sheet and can't be retrieved for historical exports. To retain historical reservation prices, set up recurring exports.

## FAQ

Here are some frequently asked questions and answers about exports.

### Understanding file partitioning in Cost Management Exports

#### Why and when file partitioning is applied

To improve reliability and scalability, Cost Management exports automatically partition large files into smaller chunks. Partitioning helps address challenges with downloading or opening large single files, especially over unreliable networks or in tools with file size or row count limitations, such as Microsoft Excel.

In exports experience, partitioning is always enabled. Files are split based on size—not row count—with each uncompressed file kept under 1 GB. For compressed formats like Gzip, actual file sizes may vary depending on compression efficiency.

Partitioning is applied consistently, even for small exports. This ensures compatibility with downstream systems, supports enterprise-scale automation, and avoids inconsistencies or failures in reporting workflows.

#### Working with partitioned files

Each export includes a **manifest.json** file that lists all partitioned file names and their metadata. To work with partitioned files:

- Always refer to the manifest file to retrieve correct file names and sequence.
- Avoid hardcoding or guessing partition names, as file naming conventions may change.
- Use tools that support multi-file ingestion, such as **Power BI**, **Apache Spark**, or **Microsoft Fabric Delta Lake**.

**Why is my small export still partitioned?**  
Partitioning is applied by default to ensure consistent processing and avoid edge-case failures. Even small exports are partitioned to align with platform standards.

**Can I disable partitioning?**  
No. Partitioning is a default behavior in exports experience and cannot be disabled. This ensures consistent reliability across all customer scenarios.

**How do I identify which file to use?**  
Use the **manifest.json** file included with every export. It lists all partitioned files in sequence and provides relevant metadata.

**How can I open partitioned files in Excel?**  
If your export is partitioned, you'll need to combine the files using tools like **Power BI**, scripts, or data processing pipelines. Be aware that large datasets may exceed Excel's row limits.

### How does the enhanced export experience handle missing attributes like subscription IDs?

In the new export experience, missing attributes such as subscription IDs are set to null or empty rather than using a default empty GUID (00000000-0000-0000-0000-000000000000). The null or empty values more accurately indicate the absence of a value. It affects charges pertaining to unused reservations, unused savings plan, and rounding adjustments.

### How much historical data can I retrieve using exports?

You can retrieve historical data using exports through either the **Azure portal** or the **REST API**, depending on your dataset and time range requirements.

#### Retrieve historical data via Azure portal

The Azure portal supports retrieval of up to **13 months** of historical data for most datasets.

To retrieve historical data:

1. Create a one-time or custom export (e.g., Actual cost, Amortized cost, or Price sheet).
2. After saving the export, go to **Cost Management > Exports**, and select your export.
3. Click **Export selected dates** to rerun the export for specific historical months — note that data can be retrieved **one month at a time**, up to the 13-month limit.
    
> [!NOTE]
> Reservation recommendations are based on the current snapshot only and do not support historical backfill.

#### Retrieve data via REST API

- To access data older than 13 months, use the [Exports - Execute REST API](/rest/api/cost-management/exports/execute?view=rest-cost-management-2025-03-01&preserve-view=true).
- This method allows programmatic backfill of data for specific date ranges, depending on dataset availability.

#### Data retention limits by dataset

| Dataset                                      | Azure portal limit     | REST API limit        |
|---------------------------------------------|-------------------------|------------------------|
| Cost and usage (Actual, Amortized, FOCUS)   | Up to 13 months         | Up to 7 years          |
| Reservation transactions                     | Up to 13 months         | Up to 7 years          |
| Reservation details                          | Up to 13 months         | Up to 13 months        |
| Reservation recommendations                  | Current snapshot only   | Current snapshot only  |
| Price sheet                                  | Up to 13 months 	 | MCA/MPA: 13 months<br>EA: 25 months |

> [!TIP]
> For retrieving more than 13 months of historical data, or automating backfills at scale, the REST API is recommended.


    
### Which datasets support Parquet format and compression?

The following table captures the supported formats and compression formats for each of the exported datasets. If you're creating an export with multiple datasets, Parquet & compression options only appear in the dropdown if all of the selected datasets support them. 

|Dataset|Format supported|Compression supported|
| -------- | -------- | -------- |
|Cost and usage details (Actual)|CSV|None, Gzip|
||Parquet|None, Snappy|
|Cost and usage details (Amortized)|CSV|None, Gzip|
||Parquet|None, Snappy|
|Cost and usage details (Usage only)|CSV|None, Gzip|
||Parquet|None, Snappy|
|Cost and usage details (FOCUS)|CSV|None, Gzip|
||Parquet|None, Snappy|
|Reservation details|CSV|None|
|Reservation recommendations|CSV|None|
|Reservation transactions|CSV|None|
|Price Sheet|CSV|None, Gzip|
||Parquet|None, Snappy|

### Why do I get the 'Unauthorized' error while trying to create an Export?

When attempting to create an Export to a storage account with a firewall, the user must have the Owner role or a custom role with `Microsoft.Authorization/roleAssignments/write` and `Microsoft.Authorization/permissions/read` permissions. If these permissions are missing, you encounter an error similar to:


```json
{
	"error":{
	"code":"Unauthorized",
	"message":"The user does not have authorization to perform 'Microsoft.Authorization/roleAssignments/write' action on specified storage account, please use a storage account with sufficient permissions. If the permissions have changed recently then retry after some time."
	}
}
```

You can check for the permissions on the storage account by referring to the steps in [Check access for a user to a single Azure resource](../../role-based-access-control/check-access.md). 

### What is the maximum number of subscriptions allowed within a management group (MG) when creating an export?

The maximum limit is **3,000 subscriptions** per management group in Cost Management, including exports. 

To manage more than 3,000 subscriptions: 

- Organize them into smaller management groups. For example, if you have a total of 12,500 subscriptions, create five management groups with approximately 2,500 subscriptions each. Create separate exports for each management group scope and combine the exported data for a complete view. 

- Alternatively, if all subscriptions are under the same billing account, create an export at the **billing account scope** to get combined data.

### How are the exported files organized in the blob storage folders?

The exported files are organized in a structured hierarchy within the storage folders. The naming and hierarchy of the folders are as follows:

- `StorageContainer/StorageDirectory/ExportName/[YYYYMMDD-YYYYMMDD]/[RunID]/`

This path contains the CSV files and a manifest file.

For example:

- `StorageContainer/StorageDirectory/ExportName/[20240401-20240430]/[RunID1]/`

This folder contains the CSV files and the manifest file for all export runs during the April 2024 time period.

- `StorageContainer/StorageDirectory/ExportName/[20241101-20241130]/[RunID2]/`

This folder contains the CSV files and the manifest file for all export runs during the November 2024 time period.

Azure ensures that the cost file for a particular month is available within that month's folder. For example, `[20240401-20240430]`, `[20241101-20241130]` and so on.

- **Without file overwrite:** You see multiple *RunIDs* within the month folder, representing different export runs. For example, 30 different *RunIDs* for 30 days.

- **With file overwrite:** You see only one *RunID* within the month folder, representing the latest run.

At the time of export creation, you can name the *StorageContainer*, *StorageDirectory*, and *ExportName*.

### Why do I see garbled characters when I open exported cost files with Microsoft Excel?

If you see garbled characters in Excel and you use an Asian-based language, such as Japanese or Chinese, you can resolve this issue with the following steps:

For new versions of Excel:

1. Open Excel.
1. Select the **Data** tab at the top.
1. Select the **From Text/CSV** option.
    :::image type="content" source="./media/tutorial-improved-exports/new-excel-from-text.png" alt-text="Screenshot showing the Excel From Text/CSV option." lightbox="./media/tutorial-improved-exports/new-excel-from-text.png" :::
1. Select the CSV file that you want to import.
1. In the next box, set **File origin** to **65001: Unicode (UTF-8)**.
    :::image type="content" source="./media/tutorial-improved-exports/new-excel-file-origin.png" alt-text="Screenshot showing the Excel File origin option." lightbox="./media/tutorial-improved-exports/new-excel-file-origin.png" :::
1. Select **Load**.

For older versions of MS Excel:

1.	Open Excel.
1.	Select the **Data** tab at the top.
1.	Select the **From Text** option and then select the CSV file that you want to import.
1.	Excel shows the Text Import Wizard.
1.	In the wizard, select the **Delimited** option.
1.	In the **File origin** field, select **65001 : Unicode (UTF-8)**.
1.	Select **Next**.
1.	Next, select the **Comma** option and then select **Finish**.
1.	In the dialog window that appears, select **OK**.

### Why does the aggregated cost from the exported file differ from the cost displayed in Cost Analysis?

You might notice discrepancies between the aggregated cost from an exported file and the cost displayed in Cost Analysis. These differences can occur if the tool you use to read and aggregate the total cost truncates decimal values. This issue is common in tools like Power BI and Microsoft Excel.

#### Using Power BI

Check if decimal places are being dropped when cost values are converted into integers. Losing decimal values can result in a loss of precision and misrepresentation of the aggregated cost.

To manually transform a column to a decimal number in Power BI, follow these steps:

1. Go to the **Table** view.
1. Select **Transform data**.
1. Right-click the required column.
1. Change the type to **Decimal Number**.

#### Using Microsoft Excel

When you open a .csv or .txt file, Excel might display a warning message if it detects that an automatic data conversion is about to occur. Select the **Convert** option when prompted to ensure numbers are stored as numbers and not as text. It ensures the correct aggregated total. For more information, see [Control data conversions in Excel for Windows and Mac](https://insider.microsoft365.com/blog/control-data-conversions-in-excel-for-windows-and-mac).

:::image type="content" source="./media/tutorial-improved-exports/excel-convert-dialog.png" border="true" alt-text="Screenshot showing the Convert dialog.":::

If the correct conversion isn't used, you get a green triangle with a `Number Stored as Text` error. This error might result in incorrect aggregation of charges, leading to discrepancies with cost analysis.

:::image type="content" source="./media/tutorial-improved-exports/number-stored-as-text-error.png" border="true" alt-text="Screenshot showing the Number stored as text error.":::
## Next steps

- For a comprehensive reference of all available datasets that you export, including the schema for current and historical versions, see [Cost Management dataset schema index](/azure/cost-management-billing/dataset-schema/schema-index).
