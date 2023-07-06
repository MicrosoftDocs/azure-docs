---
title: Azure Communication Services - Enable and Access Call Summary and Call Diagnostic Logs
titleSuffix: An Azure Communication Services concept document
description: How to access Call Summary and Call Diagnostic logs in Azure Monitor
author:  mkhribech
services: azure-communication-services

ms.author: mkhribech
ms.date: 06/21/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Enable and Access Call Summary and Call Diagnostic Logs

To access telemetry for Azure Communication Services Voice & Video resources, follow these steps.

## Enable logging
1. First, you need to create a storage account for your logs. Go to [Create a storage account](../../storage/common/storage-account-create.md?tabs=azure-portal) for instructions to complete this step. For more information, see [Storage account overview](../../storage/common/storage-account-overview.md) on the types and features of different storage options. If you already have an Azure storage account, go to Step 2.
 
2. When you've created your storage account, next you need to enable logging by following the instructions in [Enable diagnostic logs in your resource](./analytics/enable-logging.md). You select the check boxes for the logs "CallSummary" and "CallDiagnostic". 

3. Next, select the "Archive to a storage account" box and then select the storage account for your logs in the drop-down menu. The "Send to Analytics workspace" option isn't currently available for Private Preview of this feature, but it is made available when this feature is made public.

:::image type="content" source="media\call-logs-images\call-logs-access-diagnostic-setting.png" alt-text="Azure Monitor Diagnostic setting":::

## Access Your Logs

To access your logs, go to the storage account you designated in Step 3 above by navigating to [Storage Accounts](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Storage%2FStorageAccounts) in the Azure portal. 

:::image type="content" source="media\call-logs-images\call-logs-access-storage.png" alt-text="Azure Portal Storage":::

From there, you can download all logs or individual logs.

:::image type="content" source="media\call-logs-images\call-logs-access-storage-resource.png" alt-text="Azure Portal Storage Download":::

## Next steps

- Access logs for [voice and video](./analytics/logs/voice-and-video-logs.md), [chat](./analytics/logs/chat-logs.md), [email](./analytics/logs/email-logs.md), [network traversal](./analytics/logs/network-traversal-logs.md), [recording](./analytics/logs/recording-logs.md), [SMS](./analytics/logs/sms-logs.md) and [call automation](./analytics/logs/call-automation-logs.md).