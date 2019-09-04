---
title: Connect Azure Activity data to Azure Sentinel Preview| Microsoft Docs
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
ms.date: 04/07/2019
ms.author: rkarlin

---
# Connect data from Azure Activity log

> [!IMPORTANT]
> Azure Sentinel is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can stream logs from [Azure Activity log](../azure-monitor/platform/activity-logs-overview.md) into Azure Sentinel with a single click. The Activity log is a subscription log that provides insight into subscription-level events that occurred in Azure. This includes a range of data, from Azure Resource Manager operational data to updates on Service Health events. Using the Activity log, you can determine the ‘what, who, and when’ for any write operation (PUT, POST, DELETE) taken on the resources in your subscription. You can also understand the status of the operation and other relevant properties. The Activity log does not include read (GET) operations or operations for resources that use the Classic/"RDFE" model. 


## Prerequisites

- User with global administrator or security administrator permissions


## Connect to Azure Activity log

1. In Azure Sentinel, select **Data connectors** and then click the **Azure Activity log** tile.

2. In the Azure Activity log pane, select the subscriptions you want to stream into Azure Sentinel. 

3. Click **Connect**.

4. To use the relevant schema in Log Analytics for the Azure Activity alerts, search for **AzureActivity**.


 

## Next steps
In this document, you learned how to connect Azure Activity log to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).
