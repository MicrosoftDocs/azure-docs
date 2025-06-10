---
title: Blob inventory performance characteristics

titleSuffix: Azure Blob Storage
author: aadetayo
ms.date: 05/27/2025
description: Best practices and guidance on configuring Azure Storage blob inventory and the factors that influence its performance.

ms.author: normesta
ms.service: azure-blob-storage
ms.topic: reference
ms.custom: references_regions, engagement-fy23
---

# Blob inventory performance characteristics


Azure Storage blob inventory is an essential tool for managing and tracking the objects stored in your Azure Blob Storage account. It offers a comprehensive overview of your storage resources, enabling you to make informed decisions about data management and cost optimization. 

After you enable blob inventory reports, objects in your storage account are periodically scanned using the rules that are defined in the inventory policy. The time it takes to generate an inventory report depends on several factors. These factors include the number of objects, the directory structure, the filters applied through rule subtypes, the customer workload on the storage account, the availability of storage resources and more. In some cases, depending on these factors, it may take multiple days to finish processing all the objects in the storage account. The performance of inventory can also vary between scans and sometimes during the scan as well. 


## Factors influencing Blob Inventory performance

When using blob inventory to generate an inventory report, several key factors can impact its performance. Understanding these factors can help you optimize inventory processes and enable efficient data management. 

### Distribution of Objects in hierarchical namespace enabled accounts

The distribution of objects within a hierarchical namespace-enabled account can significantly affect inventory performance. Blob Inventory scans one directory at a time, completing it before moving to the next. Therefore, a high number of directories, especially with sparse object distribution and deep nesting, can increase the time required to generate the inventory report. 

### Number of Objects Processed for the Inventory Rule

The total number of objects scanned based on an inventory rule is a key factor in processing performance. Rules that target a large volume of objects require more time and resources to generate an inventory report. Additionally, including versions, snapshots, and soft deleted objects in the inventory rule increases the number of objects to be processed. When these subtypes exist in high volumes, they can further extend processing time needed to generate the inventory report

### Export Format of the Inventory Report

The chosen export format for an inventory report CSV or Apache Parquet can influence performance. While Parquet is optimized for fast data processing, it introduces overhead that may slow down report generation compared to CSV.

### Large Number of Soft Deleted Objects

Soft-deleted objects, though not permanently removed, are still included in inventory scans. A high volume of these objects can add to processing time and reduce performance.
By considering these factors, you can enhance the performance of your Inventory runs and have more efficient data management experience.


## Best practices to improve blob inventory performance

Efficiently managing your Azure Blob Storage is essential for maintaining optimal performance and cost-effectiveness. Here are some best practices to enhance the performance of your Blob Inventory:

### Avoid Sparse Accounts in hierarchical namespace enabled accounts
Sparse accounts are those that contain a large number of objects spread across many directories. These directories may or may not include deeply nested structures. Sparse accounts result in a very low file-to-directory ratio, which can cause inefficiencies in inventory report generation and even lead to failures. To mitigate these inefficiencies, ensure that your hierarchical namespace enabled storage account is well-organized and avoid having a sparse distribution of objects

### Use CSV for Export Format	
When generating inventory reports, opt for csv format if your use case doesn't require fast data processing. Parquet is a columnar storage file format optimized for performance and one of the fastest formats to read for data processing. However, it may increase the time required to generate reports due to its overhead making it slower than generating a report in csv format. If you need the parquet format to post-process your report, you can utilize available open-source tools that convert CSV to Parquet format.


### Scope your Inventory rule using Prefix
Instead of running inventory on the entire storage account, use prefix match to generate an inventory report for specific subsets of your data.
-	Include Prefix: This filter targets a set of containers or paths within a container. This approach helps narrow down the scope of your inventory report, making the process faster and more efficient.

- Exclude Prefix: Similar to including prefix, If you want to include a prefix, but exclude some specific subset from it, then you could use the excludePrefix filter. This approach also helps narrow the scope of your inventory report. To learn more, see the articles/storage/blobs/blob-inventory.md#rule-filters.

### Select Relevant Fields
Customize your inventory reports by selecting only the relevant fields you need. Doing this reduces the amount of data processed and exported, leading to quicker report generation, and easier analysis. Learn more about the inventory schema fields here - articles/storage/blobs/blob-inventory.md#custom-schema-fields-supported-for-blob-inventory

### Subtype Inclusion: Deleted Objects, Snapshots, and Versions
While including these subtypes can provide a more comprehensive view of your storage account, it's important to assess whether they're essential for your audit and management needs. If they aren't critical, excluding them can help improve the performance and efficiency of your report generation process. To identify objects deleted in recent inventory runs, compare the blob names from the current run with those from a previous run. The difference can provide a list of recently deleted objects.

### Subscribe to Blob Inventory Events
Stay informed about user-induced errors by subscribing to blob inventory events. This proactive approach helps you to quickly address issues. Learn more about how to subscribe to inventory events here - articles/storage/blobs/blob-inventory-how-to.md#subscribe-to-blob-inventory-policy-completed-event

### Monitor Unexpected Increases in capacity
Pay attention to unexpected spikes in your storage account’s capacity, as they might signal the accumulation of blob versions, snapshots, or soft-deleted objects. Monitoring these changes can help you detect and resolve potential issues before they impact performance. Additionally, managing the lifecycle of these objects can prevent unnecessary buildup and improve Blob Inventory performance. To learn more about blob lifecycle management, see [Azure Blob Storage lifecycle management overview](lifecycle-management-overview.md)

By following these best practices, you can enhance the performance of your blob inventory, ensuring efficient and effective management of your Azure Blob Storage. 


## Next Steps
- [Tutorial: Analyze blob inventory reports](storage-blob-inventory-report-analytics.md)
-	articles/storage/blobs/calculate-blob-count-size.yml
-	articles/storage/blobs/storage-blob-calculate-container-statistics-databricks.md 
