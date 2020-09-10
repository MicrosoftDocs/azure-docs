---
title: Connect Microsoft 365 Defender raw data to Azure Sentinel| Microsoft Docs
description: Learn how to ingest raw event data from Microsoft 365 Defender into Azure Sentinel.
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

The new [Microsoft 365 Defender](https://docs.microsoft.com/microsoft-365/security/mtp/microsoft-threat-protection) connector lets you stream **advanced hunting** logs - a type of raw event data - from Microsoft 365 Defender into Azure Sentinel. 

With the integration of [Microsoft Defender for Endpoint (MDATP)](https://docs.microsoft.com/windows/security/threat-protection/microsoft-defender-atp/microsoft-defender-advanced-threat-protection) into the Microsoft 365 Defender security umbrella, you can now collect your Microsoft Defender for Endpoint [advanced hunting](https://aka.ms/mdatpAH) events using the Microsoft 365 Defender connector, and stream them straight into new purpose-built tables in your Azure Sentinel workspace. These tables are built on the same schema that is used in the Microsoft 365 Defender portal, giving you complete access to the full set of advanced hunting logs, and allowing you to do the following:

- Easily copy your existing Microsoft Defender ATP advanced hunting queries into Azure Sentinel.

- Use the raw event logs to provide additional insights for your alerts, hunting, and investigation, and correlate events with data from additional data sources in Azure Sentinel.

- Store the logs with increased retention, beyond Microsoft Defender for Endpoint or Microsoft 365 Defender’s default retention of 30 days. You can do so by configuring the retention of your workspace or by configuring per-table retention in Log Analytics.

> [!IMPORTANT]
>
> The Microsoft 365 Defender connector is currently in public preview. This feature is provided without a service level agreement, and it's not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- You must have a valid license for Microsoft Defender for Endpoint, as described in [Set up Microsoft Defender for Endpoint deployment](https://docs.microsoft.com/windows/security/threat-protection/microsoft-defender-atp/licensing). 

- Your user must be assigned the Global Administrator role on the tenant (in Azure Active Directory).

## Connect to Microsoft 365 Defender

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
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).
