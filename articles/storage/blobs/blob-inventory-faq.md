---
title: Azure Storage blob inventory FAQ
description: In this article, learn about frequently asked questions about Azure Storage blob inventory
services: storage
author: normesta

ms.service: storage
ms.date: 08/01/2023
ms.topic: conceptual
ms.author: normesta

---

# Azure Storage blob inventory frequently asked questions

This article provides answers to some of the most common questions about Azure Storage blob inventory. 

## Multiple inventory file output

Blob Inventory report produces three types of files. See [Inventory files](blob-inventory.md#inventory-files). Existing customers using blob inventory might see a change in the number of inventory files, from one file to multiple files. Today, we already have manifest file that provides the list of files. This behavior remains unchanged, so these files are listed in the manifest file.

### Why was the change made?

The change was implemented to enhance blob inventory performance, particularly for large storage accounts containing over five million objects. Now, results are written in parallel to multiple files, eliminating the bottleneck of using a single inventory file. This change was prompted by customer feedback, as they reported difficulties in opening and working with the excessively large single inventory file.

### How does this change affect me as a user?

As a user, this change has a positive impact on your experience with blob inventory runs. It's expected to enhance performance and reduce the overall running time. However, to fully benefit from this improvement, you must ensure that your code is updated to process multiple results files instead of just one. This adjustment aligns your code with the new approach and optimizes the handling of inventory data.

### Is my existing data affected?

No, existing data isn't affected. Only new blob inventory results have multiple inventory files.

### Will there be any downtime or service interruptions?

No, the change happens seamlessly.

### Is there anything I need to do differently now?

Your required actions depend on how you currently process blob inventory results:

- If your current processing assumes a single inventory results file, then you need to modify your code to accommodate multiple inventory results files.

- However, if your current processing involves reading the list of results files from the manifest file, there's no need to make any changes to how you process the results. The existing approach continues to work seamlessly with the updated feature.

### Can I revert to the previous behavior if I don't like the change?

This isn't recommended, but it's possible. Please work through your support channels to ask to turn off this feature.

### How can I provide feedback or report issues related to the changes?

Please work through your current account team and support channels.

### When will this change take effect?

This change will start gradual rollout starting September 1, 2023.

## Next steps

- [Azure Storage blob inventory](blob-inventory.md)

- [Enable Azure Storage blob inventory reports](blob-inventory-how-to.md)

- [Calculate the count and total size of blobs per container](calculate-blob-count-size.md)

- [Tutorial: Analyze blob inventory reports](storage-blob-inventory-report-analytics.md)

- [Manage the Azure Blob Storage lifecycle](./lifecycle-management-overview.md)
