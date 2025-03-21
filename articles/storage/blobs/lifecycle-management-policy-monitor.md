---
title: Lifecycle management policy monitoring
titleSuffix: Azure Blob Storage
description: Monitor Lifecycle management policy runs
author: normesta

ms.author: normesta
ms.date: 03/10/2025
ms.service: azure-blob-storage
ms.topic: conceptual 

---

# Monitor lifecycle management policy runs

You can determine when a lifecycle management run completes by subscribing to an event. You can use event properties to identify issues and investigate errors by using metrics and logs. 

### Receiving notifications when a run is complete

You can be notified when a run completes by subscribing to an event. 

- Describe the event. For field descriptions, see [Microsoft.Storage.LifecyclePolicyCompleted event](../../event-grid/event-schema-blob-storage.md?toc=/azure/storage/blobs/toc.json#microsoftstoragelifecyclepolicycompleted-event)

- Describe the process for subscribing to the event. For guidance, see [Reacting to Blob storage events](../blobs/storage-blob-event-overview.md).

- If you receive the event, then the run completed. You can look at various properties to see objects targeted and object processed. 

- Question: What happens if there are so many objects that the run never fully completes? Will this event be triggered even though many objects are left to target?

## Investigating errors by using metric and logs

You can use metrics explorer and query resource logs in Azure Monitor to determine why some objects were not processed successfully.

### Metrics

List which metrics to look for. They are the relevant REST operation names which appear in metrics explorer.
Show how to filter and find them.
Point to any existing material about metrics and how to use metrics explorer.

### Logs

Explain how to use any information in event properties and metrics to query logs for operations that failed.
Explain how to determine the reason for any given failure.
Point to any existing material about how to query logs.

## See also

- [Azure Blob Storage lifecycle management overview](lifecycle-management-overview.md)
- [Lifecycle management policies that transition blobs between tiers](lifecycle-management-policy-access-tiers.md)
- [Lifecycle management policies that delete blobs](lifecycle-management-policy-delete.md)
- [Access tiers for blob data](access-tiers-overview.md)
