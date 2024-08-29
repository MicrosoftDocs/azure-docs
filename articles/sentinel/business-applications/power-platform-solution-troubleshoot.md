---
title: Troubleshoot the Microsoft Sentinel solution for Microsoft Power Platform 
description: Learn how to troubleshoot common issues with the Microsoft Sentinel solution for Microsoft Power Platform.
ms.author: bagol
author: batamig
ms.service: microsoft-sentinel
ms.topic: how-to
ms.date: 03/18/2024
#CustomerIntent: As a security engineer, I want to learn how to troubleshoot common issues with the Power Platform inventory connector for Microsoft Sentinel.
---

# Troubleshoot the Microsoft Sentinel solution for Microsoft Power Platform 

The Microsoft Sentinel solution for Microsoft Power Platform provides an inventory connector that collects and analyzes data from Power Platform environments. The connector uses a function app to ingest data from an Azure Data Lake Storage Gen2 (ADLSv2) account where Power Platform exports the inventory data.

This article provides steps to troubleshoot common issues with data collection using the inventory connector.

## Prerequisites

Before performing the steps described in this article, make sure that you deployed the solution fully. For more information, see [Deploy the Microsoft Sentinel solution for Microsoft Power Platform](deploy-power-platform-solution.md).

## Examine the function app logs

The first step to troubleshoot issues with Power Platform data collection for Microsoft Sentinel is to examine the function app logs.

**To check your function app logs**:

1. Go to your function app in the Azure portal.
1. In the function app's **Overview** page, under **Functions**, select the **PowerPlatformInventoryDataConnector** function.
1. In the **Monitor** page, check the log entries shown for any warnings or error messages.

For example, the function app logs provide details about the following types of scenarios:

- The function app didn't run at the scheduled time
- The function app ran but had errors while ingesting data
- The function app ran but didn't find any inventory data to ingest

## Synchronize your function app triggers

If your function app didn't run at the scheduled time, you might need to synchronize its triggers.

Do this by restarting your function app from the function app's **Overview** page. Restarting the function app forces it to synchronize the triggers and run again at the next scheduled time.

For more information, see [Trigger syncing](/azure/azure-functions/functions-deployment-technologies?tabs=windows#trigger-synching).


## Check the ADLSv2 storage account

If the function app is running but there's no data collected, check the ADLSv2 storage account to make sure inventory data was exported by the Power Platform self service analytics feature. If the feature was recently activated, it might take up to 48 hours for data to start exporting to the storage account.

**To check the ADLSv2 storage account**:

1. Go to the ADLSv2 storage account in the Azure portal.
1. Select **Containers** and then the **powerplatform** container.

The folder structure shown is similar to the folder structure defined in the [Microsoft Power Platform self-service analytics schema definition](/power-platform/admin/self-service-analytics-schema-definition).

## Force a full data ingestion

To reduce ingested data volume, the function app collects data in full every seven days, and only collects incremental changes in between. During those incremental periods, if no Power Platform data is changed, data isn't reingested by default.

However, customers can force a full data ingestion on the next scheduled run by deleting the **lastupdated** blob storage container in the function app storage account. This isn't the same as the ADLSv2 storage account.

To delete the **lastupdated** blob storage container:

1. Go to the function app storage account in the Azure portal.
1. Select **Containers** and then the container named **lastupdated**.
1. Delete the container and confirm the deletion.

A full data collection and ingestion is run on the function app's next scheduled run.

Alternately, modify the default function app behavior by editing the following settings in your function app:

|Setting  |Description  |Default value  |
|---------|---------|---------|
|**FULL_SYNC_INTERVAL_DAYS**     |  The number of days until a full data ingestion occurs.       |    `7`     |
|**TIMER_SCHEDULE**     |    An [NCRONTAB](/azure/azure-functions/functions-bindings-timer?tabs=python-v2%2Cisolated-process%2Cnodejs-v4&pivots=programming-language-python#ncrontab-examples) schedule that defines when the function triggers   |  `0 0 2 * * *`        |


For more information, see [Working with app settings](/azure/azure-functions/functions-how-to-use-azure-function-app-settings?tabs=portal#settings).

## Related content

For more information, see:

- [Microsoft Sentinel solution for Microsoft Power Platform overview](power-platform-solution-overview.md)
- [Microsoft Sentinel solution for Microsoft Power Platform: security content reference](power-platform-solution-security-content.md)
