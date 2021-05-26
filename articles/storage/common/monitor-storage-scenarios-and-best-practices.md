---
title: Azure Storage Monitoring scenarios and best practices
description: Learn best practice guidelines and how to them when using metrics and logs to monitor your Azure Storage account resources. 
author: normesta
ms.service: storage
ms.topic: conceptual
ms.date: 05/26/2021
ms.author: normesta
ms.reviewer: fryu
ms.subservice: common
ms.custom: "monitoring"
---

# Azure Storage Monitoring scenarios and best practices

Intro goes here.

## Enable logs and metrics

Both metrics and the activity logs are collected automatically.

Enable diagnostic logs by creating a diagnostic setting. For guidance, see any of these articles:

- [Monitoring Azure Blob Storage](../blobs/monitor-blob-storage.md)
- [Monitoring Azure Files](../files/storage-files-monitoring.md)
- [Monitoring Azure Table storage](../tables/monitor-table-storage.md)
- [Monitoring Azure Queue Storage](../queues/monitor-queue-storage.md)

You can also create a diagnostic setting by using a policy definition. That way, you can make sure that a diagnostic setting is created for every account that is created or updated. See [Azure Policy built-in definitions for Azure Storage](policy-reference.md).

## Configure a policy definition

Is this in scope for this article? 

- Generate logs for different targets and scenarios?
- Set up validation rules to govern edits and data use?

## Audit data plane activities

Identify the key elements for auditing (`what`, `when`, `how`, and `who`). 

### Identify what was changed

Put something here.

### Identify when the change was made

Put something here.

### Identify how the change was made

Put something here.

### Identify who made the change

Put something here.

#### Identify the client associated with a request

Put something here.

### Advanced scenarios

#### Determine the number of bytes read per request by a specific service principal

Put something here.

#### Determine the number of bytes read per request as part of a particular connection  

Put something here.

## Audit control plane activities

Put something here.

## Receive real-time alerts of account activity

Put something here.

### Alert on big files that are uploaded to a share

Put something here.

### Alert when a file is approaching a capacity limit

Put something here.


## Next steps
* [Monitor a storage account](https://www.windowsazure.com/manage/services/storage/how-to-monitor-a-storage-account/)   
* [Storage Analytics metrics table schema](/rest/api/storageservices/storage-analytics-metrics-table-schema)   
* [Storage Analytics logged operations and status messages](/rest/api/storageservices/storage-analytics-logged-operations-and-status-messages)   
* [Storage Analytics logging](storage-analytics-logging.md)
