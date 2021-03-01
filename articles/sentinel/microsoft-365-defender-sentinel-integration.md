---
title: Microsoft 365 Defender incident integration with Azure Sentinel | Microsoft Docs
description: Learn how Microsoft 365 Defender incident integration with Azure Sentinel gives you the power and flexibility to use Azure Sentinel as your universal incidents queue while leveraging M365D's strengths to assist in investigating M365 security incidents.
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
ms.date: 02/23/2021
ms.author: yelevin

---
# Microsoft 365 Defender incident integration with Azure Sentinel

> [!IMPORTANT]
> The Microsoft 365 Defender connector with incident integration is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Description

Azure Sentinel's [Microsoft 365 Defender (M365D)](/microsoft-365/security/mtp/microsoft-threat-protection) incident integration allows you to stream all M365D incidents into Azure Sentinel and keep them synchronized between both portals. Incidents from M365D (formerly known as Microsoft Threat Protection or MTP) include all associated alerts, entities, and relevant information, providing you with enough context to perform triage in Azure Sentinel. Once in Sentinel, Incidents will remain bi-directionally synced with M365D, allowing you to take advantage of the benefits of both portals in your incident investigation.

This integration gives Microsoft 365 security incidents the visibility to be managed from within Azure Sentinel, as part of the primary incident queue across the entire organization. At the same time, it allows you to take advantage of the unique strengths and capabilities of M365D for in-depth investigations and an M365-specific experience across the M365 ecosystem. M365 Defender enriches and groups alerts from multiple M365 products, both reducing the size of the SOC’s incident queue and shortening the time to resolve. The services that are included in M365 Defender are:

- Microsoft Defender for Endpoint (MDE, formerly MDATP)
- Microsoft Defender for Identity (MDI, formerly AATP)
- Microsoft Defender for O365 (MDO, formerly O365ATP)
- Microsoft Cloud App Security
- In addition, M365 Defender itself has its own alerts.

### Common use cases and scenarios

- One-click connect of M365 Defender incidents and alerts from M365 security products.

- Bi-directional sync between Sentinel and M365D incidents on status, owner and closing reason as well as alerts and entities.

- Leverage M365 Defender alert grouping and enrichment capabilities in Azure Sentinel, thus reducing time to resolve.

- In-context deep link between a Sentinel and M365 Defender incident to facilitate investigations across both portals.

## Prerequisites

- You must have a valid license for Microsoft 365 Defender, as described in [Set up Microsoft Defender for Endpoint deployment](/windows/security/threat-protection/microsoft-defender-atp/licensing). 

- Your user must be assigned the Global Administrator role on the tenant (in Azure Active Directory).

## Integrate with Microsoft 365 Defender

If Microsoft Defender for Endpoint is deployed and ingesting your data, the event logs can easily be streamed into Azure Sentinel.

1. In Azure Sentinel, select **Data connectors**, select **Microsoft 365 Defender (Preview)** from the gallery and select **Open connector page**.

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