---
title: Connect Azure Activity data to Azure Sentinel | Microsoft Docs
description: Learn how to connect Azure Activity data to Azure Sentinel.
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
ms.date: 03/22/2020
ms.author: yelevin

---
# Connect data from Azure Activity log

You can stream logs from [Azure Activity log](../azure-monitor/platform/platform-logs-overview.md) into Azure Sentinel with a single click. The Activity log is a subscription log that records and displays subscription-level events across Azure, from Azure Resource Manager operational data to updates on Service Health events. Using the Activity log, you can determine the 'what, who, and when' for any write operation (PUT, POST, DELETE) performed on the resources in your subscription. You can also learn the status of the operation and other relevant properties. The Activity log does not include read (GET) operations or operations for resources that use the Classic/"RDFE" model. 

## Prerequisites

- Your user must have Contributor permissions to the Log Analytics workspace.
- Your user must have Reader permissions to any subscription whose logs you want to stream into Azure Sentinel.

## Set up the Azure Activity connector

1. From the Azure Sentinel navigation menu, select **Data connectors**. From the list of connectors, click on **Azure Activity**, and then on the **Open connector page** button on the lower right.

2. Under the **Instructions** tab, click the **Configure Azure Activity logs >** link.

3. In the **Azure Activity log** pane, select the subscriptions whose logs you want to stream into Azure Sentinel. 

4. In the subscription pane that opens to the right, click **Connect**.

5. To use the relevant schema in Log Analytics for Azure Activity alerts, type `AzureActivity` in the query window.

## Next steps
In this document, you learned how to connect Azure Activity log to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started detecting threats with Azure Sentinel, using [built-in](tutorial-detect-threats-built-in.md) or [custom](tutorial-detect-threats-custom.md) rules.
