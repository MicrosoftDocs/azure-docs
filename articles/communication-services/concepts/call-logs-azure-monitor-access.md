---
title: Azure Communication Services - How to Access Call Summary and Call Diagnostic Logs
titleSuffix: An Azure Communication Services concept document
description: How to access Call SUmmary and Call Diagnostic logs in Azure Monitor
author:  timmitchell
services: azure-communication-services

ms.author: timmitchell
ms.date: 07/22/2021
ms.topic: overview
ms.service: azure-communication-services
---
## Azure Communication Services: Enable and Access Call Summary and Call Diagnostic Logs
In order to access telemetry for Azure Communication Services Voice&Video resources, follow these steps.
### Enable logging:
1. First, you will need to create a storage account for your logs. Go to [Create a storage account](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/quick-create-workspace) for instructions to complete this step. See also [Storage account overview](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-overview) for more information on the types and features of different storage options. If you already have an Azure storage account go to Step 2. 
1. When you have created your storage account, next you need to enable logging by following the instructions in [Enable diagnostic logs in your resource](https://docs.microsoft.com/sql/t-sql/statements/set-transaction-isolation-level-transact-sql). You will select the check boxes for the logs "CallSummaryPRIVATEPREVIEW" and "CallDiagnosticPRIVATEPREVIEW". 
1. Next, you will select the "Archive to a storage account" box and then select the storage account for your logs in the drop-down menu below. NOTE: the "Send to Analytics workspace" option is not currently available for Private Preview of this feature, but it will be made available when this feature is made public.
:::image type="content" source="media\ppcalllogs-images\ppcalllogs_access_img1.png" alt-text="Azure Monitor Diagnostic setting":::
### Accessing Your Logs
To access your logs, go to the storage account you designated in Step 3 above where the logs archived by going to [Storage Accounts](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Storage%2FStorageAccounts) in your Azure Portal. From there, you can download all logs or individual logs. 