---
title: Connect Azure Activity log data to Azure Sentinel | Microsoft Docs
description: Stream Azure Activity log events into Azure Sentinel with a single click. The Activity log service records and displays subscription-level events across Azure.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.assetid: 8c25baa8-b93b-41da-9e6c-15bb7b5c5511
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/23/2021
ms.author: yelevin

---
# Connect data from Azure Activity log

You can stream events from Azure's [**Activity log** service](../azure-monitor/essentials/activity-log.md) into Azure Sentinel with a single click. The **Activity log** is a [platform log](../azure-monitor/essentials/platform-logs-overview.md) in Azure that provides insight into subscription-level events, from Azure Resource Manager operational data to updates on Service Health events. Using **Activity log**, you can determine the 'what, who, and when' for any write operation (PUT, POST, DELETE) performed on the resources in your subscription. You can also learn the status of the operation and other relevant properties. The service does not log read (GET) operations or operations for resources that don't use the Azure Resource Manager (ARM) model.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## Prerequisites

- You must have read and write permissions on the Log Analytics workspace.

- You must have Owner permissions on any subscription whose logs you want to start or stop streaming into Azure Sentinel.

- To use Azure Policy to apply a log streaming policy to Azure Activity log subscriptions, you must have the Owner role for the policy assignment scope.

## Data structure changes

This connector is undergoing a change in the method used on the back end for collecting Activity log events. It is now using the **diagnostic settings** pipeline used by our newer connectors (for example our Azure Key Vault and Azure Kubernetes Service connectors). If you're still using the legacy method for this connector, you are *strongly encouraged to upgrade* to the new version, which provides better functionality and greater consistency with resource logs. See the instructions below.

The **diagnostic settings** method sends the same data that the legacy method sent from the Activity log service, although there have been some [changes to the structure](../azure-monitor/essentials/activity-log.md#data-structure-changes) of the **AzureActivity** table.

Here are some of the key improvements resulting from the move to the diagnostic settings pipeline:
- Improved ingestion latency (event ingestion within 2-3 minutes of occurrence instead of 15-20 minutes).
- Improved reliability.
- Improved performance.
- Support for all categories of events logged by the Activity log service (the legacy mechanism supports only a subset - for example, no support for Service Health events).
- Management at scale with Azure policy.

See the [Azure Monitor documentation](../azure-monitor/logs/data-platform-logs.md) for more in-depth treatment of [Azure Activity log](../azure-monitor/essentials/activity-log.md) and the [diagnostic settings pipeline](../azure-monitor/essentials/diagnostic-settings.md).

## Set up the Azure Activity log connector

Setting up the new Azure Activity log connector has two stages:
1. Disconnect the existing subscriptions from the legacy method.

1. Connection of all relevant subscriptions to the new diagnostics settings pipeline using **Azure policy**.

### Disconnect from old pipeline

1. From the Azure Sentinel navigation menu, select **Data connectors**. From the list of connectors, select **Azure Activity**, and then click the **Open connector page** button on the lower right.

1. Under the **Instructions** tab, in the **Configuration** section, in step 1, review the list of your existing subscriptions that are connected to the legacy method (so you know which ones to add to the new), and disconnect them all at once by clicking the **Disconnect All** button below.

### Connect to new pipeline

1. Under step 2, select the **Launch Azure Policy Assignment wizard** button. The policy assignment wizard will open, ready to create a new policy called **Configure Azure Activity logs to stream to specified Log Analytics workspace**.

1. In the **Basics** tab, click the button with the three dots under **Scope** to open the **Scope** panel where you select your subscription (and, optionally, a resource group). You can also add a description.

1. In the **Parameters** tab, leave the **Effect** and **Enable logs** fields as is. Choose your Azure Sentinel workspace from the **Log Analytics workspace** drop-down list.

1. The policy will be applied to resources added in the future. To apply the policy on your existing resources as well, select the **Remediation** tab and mark the **Create a remediation task** check box.

1. In the **Review + create** tab, click **Create**. Your policy is now assigned to the scope you chose.

> [!NOTE]
>
> With this particular data connector, the connectivity status indicators (a color stripe in the data connectors gallery and connection icons next to the data type names) will show as *connected* (green) only if data has been ingested at some point in the past 14 days. Once 14 days have passed with no data ingestion, the connector will show as being disconnected. The moment more data comes through, the *connected* status will return.

## Find your data

To query the relevant schema in Log Analytics for Azure Activity alerts, type `AzureActivity` at the top of the query window.

See the **Next steps** tab in the connector page for some useful sample queries and workbook templates to help you analyze and visualize your data.

## Next steps
In this document, you learned how to connect Azure Activity log to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started detecting threats with Azure Sentinel, using [built-in](tutorial-detect-threats-built-in.md) or [custom](tutorial-detect-threats-custom.md) rules.
