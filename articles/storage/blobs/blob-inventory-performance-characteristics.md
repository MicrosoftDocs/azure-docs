---
title: Blob Inventory performance characteristics

titleSuffix: Azure Blob Storage
author: aadetayo
ms.date: 05/27/2025
description: Best practices and guidance on configuring Azure Blob Storage inventory and factors influencing its performance.

ms.author: normesta
ms.service: azure-blob-storage
ms.topic: reference
ms.custom: references_regions, engagement-fy23
---

# Blob Inventory performance characteristics


Azure Blob Inventory is an essential tool for managing and tracking the objects stored in your Azure Blob Storage account. It offers a comprehensive overview of your storage resources, enabling you to make informed decisions about data management and cost optimization. 

When Blob Inventory is enabled, it periodically scans the objects in your storage account based on the filter set and rules defined in the inventory policy. The time required to generate an inventory report depends on several factors, including the number of objects, directory structure, rule subtypes filters, customer workloads on the account, availability of storage resources and more. In some cases, depending on these factors, it may take multiple days to finish processing all the objects in the storage account. The performance of Inventory can also vary between scans and sometimes during the scan as well. 


## Factors influencing Blob Inventory performance

When managing your Blob Inventory, several key factors can impact its performance. Understanding these can help you optimize inventory processes and enable efficient data management. 

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
Sparse accounts are characterized by a high number of objects distributed across numerous directories including the ones with or without deep nesting. This results in a very low file-to-directory ratio, which can cause inefficiencies in inventory report generation and even lead to failures. To mitigate this, ensure that your hierarchical namespace enabled storage account is well-organized and avoid having a sparse distribution of objects

### Use CSV for Export Format	
When generating inventory reports, opt for csv format if your use case does not require fast data processing.  Parquet is a columnar storage file format optimized for performance and one of the fastest formats to read for data processing. However, it may increase the time required to generate reports due to its overhead making it slower than generating a report in csv format. If you need the parquet format to post-process your report, you can utilize available open-source tools that convert CSV to Parquet format.


### Scope your Inventory rule using Prefix
Instead of running inventory on the entire storage account, use prefix match to generate an inventory report for specific subsets of your data.
-	Include Prefix: This targets a set of containers or paths within a container.  This approach helps narrow down the scope of your inventory report, making the process faster and more efficient.

- Exclude Prefix: Similar to including prefix, If you want to include a prefix, but exclude some specific subset from it, then you could use the excludePrefix filter. This approach will also help to further narrow down the scope of your inventory report 
Learn more about the inventory prefix rule filters here - articles/storage/blobs/blob-inventory.md#rule-filters

### Select Relevant Fields
Customize your inventory reports by selecting only the relevant fields you need. This reduces the amount of data processed and exported, leading to quicker report generation and easier analysis. Learn more about the inventory schema fields here - 
articles/storage/blobs/blob-inventory.md#custom-schema-fields-supported-for-blob-inventory

### Subtype Inclusion: Deleted Objects, Snapshots, and Versions
While including these subtypes can provide a more comprehensive view of your storage account, it is important to assess whether they are essential for your audit and management needs. If they are not critical, excluding them can help improve the performance and efficiency of your report generation process. For identifying the list of objects deleted in recent inventory runs, you can work out a difference of blob names in the current Inventory Run and past Inventory Run to get an estimate of number of files deleted. 

### Subscribe to Blob Inventory Events
Stay informed about user-induced errors by subscribing to blob inventory events. This proactive approach helps you to quickly address issues. Learn more about how to subscribe to inventory events here - articles/storage/blobs/blob-inventory-how-to.md#subscribe-to-blob-inventory-policy-completed-event

### Monitor Unexpected Increases in capacity
Keep an eye on unexpected spikes in your storage account’s capacity, as they may signal the accumulation of blob versions, snapshots, or soft-deleted objects. Monitoring these changes can help you detect and resolve potential issues before they impact performance. Additionally, managing the lifecycle of these objects can prevent unnecessary buildup and improve Blob Inventory performance. Learn more about blob lifecycle management here - articles/storage/blobs/lifecycle-management-overview.md

By following these best practices, you can enhance the performance of your Blob Inventory, ensuring efficient and effective management of your Azure Blob Storage. 


## Next Steps
- articles/storage/blobs/storage-blob-inventory-report-analytics.md
-	articles/storage/blobs/calculate-blob-count-size.yml
-	articles/storage/blobs/storage-blob-calculate-container-statistics-databricks.md 
