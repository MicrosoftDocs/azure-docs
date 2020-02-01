---
title: Connect Azure Activity data to Azure Sentinel | Microsoft Docs
description: Learn how to connect Azure Activity data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: rkarlin
editor: ''

ms.assetid: 8c25baa8-b93b-41da-9e6c-15bb7b5c5511
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/23/2019
ms.author: rkarlin

---
# Connect data from Azure Activity log



You can stream logs from [Azure Activity log](../azure-monitor/platform/platform-logs-overview.md) into Azure Sentinel with a single click. The Activity log is a subscription log that provides insight into subscription-level events that occurred in Azure. This includes a range of data, from Azure Resource Manager operational data to updates on Service Health events. Using the Activity log, you can determine the ‘what, who, and when’ for any write operation (PUT, POST, DELETE) taken on the resources in your subscription. You can also understand the status of the operation and other relevant properties. The Activity log does not include read (GET) operations or operations for resources that use the Classic/"RDFE" model. 


## Prerequisites

- User with contributor permissions to Log Analytics workspace 


## Connect to Azure Activity log

1. In Azure Sentinel, select **Data connectors** and then click the **Azure Activity log** tile.

2. In the Azure Activity log pane, select the subscriptions you want to stream into Azure Sentinel. 

3. Click **Connect**.

4. To use the relevant schema in Log Analytics for the Azure Activity alerts, search for **AzureActivity**.


 

## Next steps
In this document, you learned how to connect Azure Activity log to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
