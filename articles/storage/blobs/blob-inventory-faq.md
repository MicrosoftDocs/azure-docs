---
title: Blob inventory FAQ
titleSuffix: Azure Blob Storage
description: Frequently asked questions about Azure Storage blob inventory, including the multiple inventory file output behavior.
ms.topic: faq
ms.service: azure-blob-storage
ms.date: 08/24/2026
ms.author: normesta
author: normesta
---

# Blob inventory FAQ

This article answers frequently asked questions about Azure Storage blob inventory.

## Azure Storage blob inventory

### I created a new inventory rule. Does it run at the same time every day?

The daily inventory rule runs once every day. There's also a weekly inventory rule scheduled for every Sunday.

### Can I expect the rules to run at a fixed time?

While the service strives to provide a consistent experience, it can't guarantee the exact execution time for each run. The inventory rule's execution time might vary. For example, if you schedule today's policy for 12:05 AM, it might start at 12:07 AM, 12:15 AM, or any other time on the following day.

## Multiple inventory file output

### What changed with respect to the number of inventory files produced?

The Blob Inventory report produces three types of files. See [Inventory files](blob-inventory.md#inventory-files). Existing customers using blob inventory might see a change in the number of inventory files, from one file to multiple files. Today, the manifest file provides the list of files. This behavior remains unchanged, so the manifest file lists these files.

### Why was the change made?

The change enhances blob inventory performance, particularly for large storage accounts containing over five million objects. The service now writes results in parallel to multiple files, eliminating the bottleneck of using a single inventory file. This change was prompted by customer feedback, as they reported difficulties in opening and working with the excessively large single inventory file.

### How does this change affect me as a user?

This change positively impacts your experience with blob inventory runs. It enhances performance and reduces the overall running time. To fully benefit from this improvement, ensure that your code is updated to process multiple results files instead of just one. This adjustment aligns your code with the new approach and optimizes the handling of inventory data.

### Is my existing data affected?

No, existing data isn't affected. Only new blob inventory results have multiple inventory files.

### Will there be any downtime or service interruptions?

No, the change happens seamlessly.

### Is there anything I need to do differently now?

Your required actions depend on how you currently process blob inventory results:

- If your current processing assumes a single inventory results file, then you need to modify your code to accommodate multiple inventory results files.

- However, if your current processing involves reading the list of results files from the manifest file, there's no need to make any changes to how you process the results. The existing approach continues to work seamlessly with the updated feature.

### Can I revert to the previous behavior if I don't like the change?

This change isn't recommended, but it's possible. Please work through your support channels to ask to turn off this feature.

### How can I provide feedback or report issues related to the changes?

Please work through your current account team and support channels.

## Related content

- [Azure Storage blob inventory](blob-inventory.md)
- [Enable Azure Storage blob inventory reports](blob-inventory-how-to.md)
- [Blob inventory performance characteristics](blob-inventory-performance-characteristics.md)
