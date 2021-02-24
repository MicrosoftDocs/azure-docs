---
title: Connect Microsoft 365 Defender data to Azure Sentinel| Microsoft Docs
description: Learn how to ingest incidents, alerts, and raw event data from Microsoft 365 Defender into Azure Sentinel.
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
ms.date: 10/13/2019
ms.author: yelevin

---
# Connect data from Microsoft 365 Defender to Azure Sentinel

> [!IMPORTANT]
>
> **Microsoft 365 Defender** was formerly known as **Microsoft Threat Protection** or **MTP**.
>
> **Microsoft Defender for Endpoint** was formerly known as **Microsoft Defender Advanced Threat Protection** or **MDATP**.
>
> You may see the old names still in use for a period of time.

## Background

Azure Sentinel's [Microsoft 365 Defender (M365D)](/microsoft-365/security/mtp/microsoft-threat-protection) connector with incident integration allows you to stream all M365D incidents and alerts into Azure Sentinel, and keeps the incidents synchronized between both portals. M365D incidents include all their alerts, entities, and other relevant information, and they are enriched and group together alerts from M365D's component services **Microsoft Defender for Endpoint**, **Microsoft Defender for Identity**, **Microsoft Defender for Office 365**, and **Microsoft Cloud App Security**.

The connector also lets you stream **advanced hunting** events from Microsoft Defender for Endpoint into Azure Sentinel, allowing you to copy MDE advanced hunting queries into Azure Sentinel, enrich Sentinel alerts with MDE raw event data to provide additional insights, and store the logs with increased retention in Log Analytics.

For more information about incident integration and advanced hunting event collection, see [Better together: Microsoft 365 Defender integration with Azure Sentinel](integrate-m365-defender-sentinel).

> [!IMPORTANT]
>
> The Microsoft 365 Defender connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- You must have a valid license for Microsoft 365 Defender, as described in [Microsoft 365 Defender prerequisites](/microsoft-365/security/mtp/prerequisites). 

- You must be a **global administrator** or a **security administrator** in Azure Active Directory.

## Connect to Microsoft 365 Defender

1. In Azure Sentinel, select **Data connectors**, select **Microsoft 365 Defender (Preview)** from the gallery and select **Open connector page**.

1. Under **Configuration** in the **Connect incidents & alerts** section, click the **Connect incidents & alerts** button.

1. To avoid duplication of incidents, it is recommended to mark the check box labeled **Turn off all Microsoft incident creation rules for these products.**

1. The following types of events can be collected from their corresponding advanced hunting tables. Mark the check boxes of the event types you wish to collect:

    | Events type | Table name |
    |-|-|
    | Machine information (including OS information) | DeviceInfo |
    | Network properties of machines | DeviceNetworkInfo |
    | Process creation and related events | DeviceProcessEvents |
    | Network connection and related events | DeviceNetworkEvents |
    | File creation, modification, and other file system events | DeviceFileEvents |
    | Creation and modification of registry entries | DeviceRegistryEvents |
    | Sign-ins and other authentication events | DeviceLogonEvents |
    | DLL loading events | DeviceImageLoadEvents |
    | Additional events types | DeviceEvents |
    |

1. Click **Apply Changes**. 

1. To query the advanced hunting tables in Log Analytics, enter the table name from the list above in the query window.

## Verify data ingestion

The data graph in the connector page indicates that you are ingesting data. You'll notice that it shows a single line that aggregates event volume across all enabled tables. Once you have enabled the connector, you can use the following KQL query to generate a similar graph of event volume for a single table (change the *DeviceEvents* table to the required table of your choosing):

```kusto
let Now = now();
(range TimeGenerated from ago(14d) to Now-1d step 1d
| extend Count = 0
| union isfuzzy=true (
    DeviceEvents
    | summarize Count = count() by bin_at(TimeGenerated, 1d, Now)
)
| summarize Count=max(Count) by bin_at(TimeGenerated, 1d, Now)
| sort by TimeGenerated
| project Value = iff(isnull(Count), 0, Count), Time = TimeGenerated, Legend = "Events")
| render timechart
```

In the **Next steps** tab, you will find a few sample queries that have been included. You can run them on the spot, or modify and save them.

## Next steps
In this document, you learned how to get raw event data from Microsoft Defender for Endpoint into Azure Sentinel, using the Microsoft 365 Defender connector. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](./tutorial-detect-threats-built-in.md).