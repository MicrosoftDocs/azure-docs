---
title: Connect Cloud App Security data to Azure Sentinel| Microsoft Docs
description: Learn how to connect Cloud App Security data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/24/2020
ms.author: yelevin

---
# Connect data from Microsoft Cloud App Security 

The [Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/what-is-cloud-app-security) (MCAS) connector lets you stream alerts and [Cloud Discovery logs](https://docs.microsoft.com/cloud-app-security/tutorial-shadow-it) from MCAS into Azure Sentinel. This will enable you to gain visibility into your cloud apps, get sophisticated analytics to identify and combat cyberthreats, and control how your data travels.

## Prerequisites

- Your user must have read and write permissions on the workspace.
- Your user must have Global Administrator or Security Administrator permissions on the workspace's tenant.
- To stream Cloud Discovery logs into Azure Sentinel, [enable Azure Sentinel as your SIEM in Microsoft Cloud App Security](https://aka.ms/AzureSentinelMCAS).

> [!IMPORTANT]
> Ingestion of Cloud Discovery logs is currently in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
 
## Connect to Cloud App Security

If you already have Cloud App Security, make sure it is [enabled on your network](https://docs.microsoft.com/cloud-app-security/getting-started-with-cloud-app-security).
If Cloud App Security is deployed and ingesting your data, the alert data can easily be streamed into Azure Sentinel.


1. From the Azure Sentinel navigation menu, select **Data connectors**. From the list of connectors, click the **Microsoft Cloud App Security** tile, and then the **Open connector page** button on the lower right.

1. Select which logs you want to stream into Azure Sentinel; you can choose **Alerts** and **Cloud Discovery Logs** (preview). 

1. Click **Apply Changes**.

1. You can select whether you want the alerts from Azure Security Center to automatically generate incidents in Azure Sentinel. Under **Create incidents**, select **Enabled** to turn on the default analytics rule that automatically creates incidents from alerts. You can then edit this rule under **Analytics**, in the  **Active rules** tab.

1. To use the relevant schema in Log Analytics for Cloud App Security alerts, type `SecurityAlert` in the query window. For the Cloud Discovery logs schema, type `McasShadowItReporting`.

> [!NOTE]
> Cloud Discovery helps detect and identify trends by aggregating the data underlying users' connections to cloud apps.
>
> Since Cloud Discovery data is aggregated on a per-day basis, be aware that up to 24 hours' worth of the most recent data will not be reflected in Azure Sentinel. 
In the event that a low-level investigation requires more immediate data, it should be done directly in the source appliance or service where the raw data resides.

## Next steps
In this document, you learned how to connect Microsoft Cloud App Security to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started detecting threats with Azure Sentinel, using [built-in](tutorial-detect-threats.md) or [custom](tutorial-detect-threats-custom.md) rules.
