---
title: Connect Azure Security Center data to Azure Sentinel
description: Learn how to connect alerts from Azure Security Center (ASC) Standard tier and stream them into Azure Sentinel.
author: yelevin
manager: rkarlin
ms.assetid: d28c2264-2dce-42e1-b096-b5a234ff858a
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: conceptual
ms.date: 09/23/2019
ms.author: yelevin
---
# Connect data from Azure Security Center (ASC)

Azure Sentinel enables you to connect alerts from [Azure Security Center](../security-center/security-center-intro.md) and stream them into Azure Sentinel. 

## Prerequisites

- To export alerts from Azure Security Center, you must have the Security Reader role in the subscription of the logs you stream.

- You must have the [Azure Security Center Standard tier](../security-center/security-center-pricing.md) running on the subscription. If not, [upgrade your subscription to standard](https://azure.microsoft.com/pricing/details/security-center/).

## Connect to Azure Security Center

1. In Azure Sentinel, select **Data connectors** from the navigation menu.

1. From the data connectors gallery, select **Azure Security Center**, and click the **Open connector page** button.

1. Under **Configuration**, click **Connect** next to each subscription whose alerts you want to stream into Azure Sentinel. The Connect button will be available only if you have the required permissions and the ASC Standard tier subscription.

1. You can select whether you want the alerts from Azure Security Center to automatically generate incidents in Azure Sentinel. Under **Create incidents**, select **Enabled** to turn on the default analytics rule that automatically creates incidents from alerts. You can then edit this rule under **Analytics**, in the  **Active rules** tab.

1. To use the relevant schema in Log Analytics for the Azure Security Center alerts, search for **SecurityAlert**.

## Next steps
In this document, you learned how to connect Azure Security Center to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
