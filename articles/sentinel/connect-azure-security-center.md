---
title: Connect Azure Defender data to Azure Sentinel
description: Learn how to connect Azure Defender alerts from Azure Security Center and stream them into Azure Sentinel.
author: yelevin
manager: rkarlin
ms.assetid: d28c2264-2dce-42e1-b096-b5a234ff858a
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: how-to
ms.date: 09/07/2020
ms.author: yelevin
---
# Connect Azure Defender alert data from Azure Security Center

Use the Azure Defender alert connector to ingest Azure Defender alerts from [Azure Security Center](../security-center/security-center-intro.md) and stream them into Azure Sentinel. 

## Prerequisites

- Your user must have the Security Reader role in the subscription of the logs you stream.

- You will need to enable Azure Defender within Azure Security Center. (Standard tier no longer exists, and is no longer a license requirement.)

## Connect to Azure Defender

1. In Azure Sentinel, select **Data connectors** from the navigation menu.

1. From the data connectors gallery, select **Azure Defender alerts from ASC** (may still be called Azure Security Center), and click the **Open connector page** button.

1. Under **Configuration**, click **Connect** next to each subscription whose alerts you want to stream into Azure Sentinel. The Connect button will be available only if you have the required permissions.

1. You can select whether you want the alerts from Azure Defender to automatically generate incidents in Azure Sentinel. Under **Create incidents**, select **Enabled** to turn on the default analytics rule that automatically creates incidents from alerts. You can then edit this rule under **Analytics**, in the  **Active rules** tab.

1. To use the relevant schema in Log Analytics for the Azure Defender alerts, search for **SecurityAlert**.

## Next steps
In this document, you learned how to connect Azure Defender to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
