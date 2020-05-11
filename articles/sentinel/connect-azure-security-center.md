---
title: Connect Azure Security Center data to Azure Sentinel
description: Learn how to connect Azure Security Center data to Azure Sentinel.
author: yelevin
manager: rkarlin
ms.assetid: d28c2264-2dce-42e1-b096-b5a234ff858a
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: conceptual
ms.date: 09/23/2019
ms.author: yelevin
---
# Connect data from Azure Security Center





Azure Sentinel enables you to connect alerts from [Azure Security Center](../security-center/security-center-intro.md) and stream them into Azure Sentinel. 

## Prerequisites

- To export alerts from Azure Security Center, you must have the Security Reader role in the subscription of the logs you stream.

- You must have the [Azure Security Center Standard tier](../security-center/security-center-pricing.md) running on the subscription. If not, [upgrade your subscription to standard](https://azure.microsoft.com/pricing/details/security-center/).



## Connect to Azure Security Center

1. In Azure Sentinel, select **Data connectors** and then click the **Azure Security Center** tile.

1. In the right, click **Connect** next to each subscription whose alerts you want to stream into Azure Sentinel. Make sure to upgrade each subscription to Azure Security Center Standard tier to stream alerts to Azure Sentinel.

1. You can select whether you want the alerts from Azure Security Center to automatically generate incidents in Azure Sentinel automatically. Under **Create incidents** select **Enable** to enable the default analytic rule that creates incidents automatically from alerts generated in the connected security service. You can then edit this rule under **Analytics** and then **Active rules**.

3. Click **Connect**.

4. To use the relevant schema in Log Analytics for the Azure Security Center alerts, search for **SecurityAlert**.

## Next steps
In this document, you learned how to connect Azure Security Center to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
