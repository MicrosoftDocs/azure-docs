---
title: Upload usage data, metrics, and logs to Azure Monitor
description: Upload resource inventory, usage data, metrics, and logs to Azure Monitor
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
zone_pivot_groups: client-operating-system
---

# Upload usage data, metrics, and logs to Azure Monitor

Periodically, you can export out usage information for billing purposes, monitoring metrics, and logs and then upload it to Azure. The export and upload of any of these three types of data will also create and update the data controller, SQL managed instance, and PostgreSQL Hyperscale server group resources in Azure.

> [!NOTE] 
> During the preview period, there is no cost for using Azure Arc enabled data services.

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

Before you can usage data, metrics, or logs you need to:

1. [Register the `Microsoft.AzureData` resource provider](#register-the-resource-provider) 
2. [Create the service principal](#create-service-principal)

## Register the resource provider

[!INCLUDE [arc-data-upload-prerequisites](includes/arc-data-upload-prerequisites.md)]

## Create service principal

[!INCLUDE [arc-data-create-service-principal](includes/arc-data-create-service-principal.md)]

## Upload logs, metrics, or user data

The specific steps for uploading logs, metrics, or user data vary depending about the type of information you are uploading. 

[Upload logs to Azure Monitor](upload-logs.md)

[Upload metrics to Azure Monitor](upload-metrics.md)

[Upload usage data to Azure Monitor](upload-usage-data.md)

## General guidance on exporting and uploading usage, metrics

Create, read, update, and delete (CRUD) operations on Azure Arc enabled data services are logged for billing and monitoring purposes. There are background services that monitor for these CRUD operations and calculate the consumption appropriately. The actual calculation of usage or consumption happens on a scheduled basis and is done in the background. 

During preview, this process happens nightly. The general guidance is to upload the usage only once per day. When usage information is exported and uploaded multiple times within the same 24 hour period, only the resource inventory is updated in Azure portal but not the resource usage.

For uploading metrics, Azure monitor only accepts the last 30 minutes of data ([Learn more](../../azure-monitor/platform/metrics-store-custom-rest-api.md#troubleshooting)). The guidance for uploading metrics is to upload the metrics immediately after creating the export file so you can view the entire data set in Azure portal. For instance, if you exported the metrics at 2:00 PM and ran the upload command at 2:50 PM. Since Azure Monitor only accepts data for the last 30 minutes, you may not see any data in the portal. 

## Next steps

[Upload billing data to Azure and view it in the Azure portal](view-billing-data-in-azure.md)

[View Azure Arc data controller resource in Azure portal](view-data-controller-in-azure-portal.md)