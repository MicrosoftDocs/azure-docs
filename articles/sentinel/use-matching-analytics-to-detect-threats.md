---
title: Use matching analytics to detect threats
titleSuffix: Microsoft Sentinel
description: This article explains how to detect threats with Microsoft-generated threat intelligence in Microsoft Sentinel.
author: austinmccollum
ms.topic: how-to
ms.date: 01/28/2025
ms.author: austinmc
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security


#Customer intent: As a security operations analyst, I want to match my security data with Microsoft threat intelligence so I can generate high fidelity alerts and incidents.

---

# Use matching analytics to detect threats

Take advantage of threat intelligence produced by Microsoft to generate high-fidelity alerts and incidents with the **Microsoft Defender Threat Intelligence Analytics** rule. This built-in rule in Microsoft Sentinel matches indicators with Common Event Format (CEF) logs, Windows DNS events with domain and IPv4 threat indicators, syslog data, and more.

## Prerequisites

You must install one or more of the supported data connectors to produce high-fidelity alerts and incidents. A premium Microsoft Defender Threat Intelligence license isn't required. Install the appropriate solutions from the **Content hub** to connect these data sources:

  - Common Event Format (CEF) via Legacy Agent
  - Syslog via Legacy Agent
  - Microsoft 365 (formerly, Office 365)
  - Azure activity logs
  - Windows DNS via AMA
  - ASIM Network sessions

  :::image type="content" source="media/use-matching-analytics-to-detect-threats/matching-analytics-template-ga.png" alt-text="A screenshot that shows the Microsoft Defender Threat Intelligence Analytics rule data source connections."::: 

  For example, depending on your data source, you might use the following solutions and data connectors:

  |Solution |Data connector  |
  |---------|---------|
  |[Common Event Format solution for Sentinel](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-commoneventformat?tab=Overview) | [Common Event Format connector for Microsoft Sentinel](data-connectors/common-event-format-cef.md)|
  |[Windows Server DNS](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-dns?tab=Overview)  |[DNS connector for Microsoft Sentinel](data-connectors/dns.md) |
  |[Syslog solution for Sentinel](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-syslog?tab=Overview)  |[Syslog connector for Microsoft Sentinel](data-connectors/syslog.md)  |
  |[Microsoft 365 solution for Sentinel](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-office365?tab=Overview) | [Office 365 connector for Microsoft Sentinel](data-connectors/office-365.md)    |
  |[Azure Activity solution for Sentinel](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-azureactivity?tab=Overview)    |  [Azure Activity connector for Microsoft Sentinel](data-connectors/azure-activity.md)       |

## Configure the matching analytics rule

Matching analytics is configured when you enable the **Microsoft Defender Threat Intelligence Analytics** rule.

1. Under the **Configuration** section, select the **Analytics** menu.

1. Select the **Rule templates** tab.

1. In the search window, enter **threat intelligence**.

1. Select the **Microsoft Defender Threat Intelligence Analytics** rule template.

1. Select **Create rule**. The rule details are read only, and the default status of the rule is enabled.

1. Select **Review** > **Create**.

:::image type="content" source="media/use-matching-analytics-to-detect-threats/configure-matching-analytics-rule.png" alt-text="Screenshot that shows the Microsoft Defender Threat Intelligence Analytics rule enabled on the Active rules tab.":::

## Data sources and indicators

Microsoft Defender Threat Intelligence Analytics matches your logs with domain, IP, and URL indicators in the following ways:

- **CEF logs** ingested into the Log Analytics `CommonSecurityLog` table match URL and domain indicators if populated in the `RequestURL` field, and IPv4 indicators in the `DestinationIP` field.
- **Syslog events**, where `Facility == "cron"` ingested into the `Syslog` table matches domain and IPv4 indicators directly from the `SyslogMessage` field.
- **Office activity logs** ingested into the `OfficeActivity` table match IPv4 indicators directly from the `ClientIP` field.
- **Azure activity logs** ingested into the `AzureActivity` table match IPv4 indicators directly from the `CallerIpAddress` field.
- **ASIM DNS logs** ingested into the `ASimDnsActivityLogs` table match domain indicators if populated in the `DnsQuery` field, and IPv4 indicators in the `DnsResponseName` field.
- **ASIM Network Sessions** ingested into the `ASimNetworkSessionLogs` table match IPv4 indicators if populated in one or more of the following fields: `DstIpAddr`, `DstNatIpAddr`, `SrcNatIpAddr`, `SrcIpAddr`, `DvcIpAddr`.

## Triage an incident generated by matching analytics

If Microsoft's analytics finds a match, any alerts generated are grouped into incidents.

Use the following steps to triage through the incidents generated by the **Microsoft Defender Threat Intelligence Analytics** rule:

1. In the Microsoft Sentinel workspace where you enabled the **Microsoft Defender Threat Intelligence Analytics** rule, select **Incidents**, and search for **Microsoft Threat Intelligence Analytics**.

    Any incidents that are found appear in the grid.

1. Select **View full details** to view entities and other details about the incident, such as specific alerts.

    Here's an example.

    :::image type="content" source="media/use-matching-analytics-to-detect-threats/matching-analytics.png" alt-text="Screenshot of incident generated by matching analytics with details pane.":::

1. Observe the severity assigned to the alerts and the incident. Depending on how the indicator is matched, an appropriate severity is assigned to an alert from `Informational` to `High`. For example, if the indicator is matched with firewall logs that allowed the traffic, a high-severity alert is generated. If the same indicator was matched with firewall logs that blocked the traffic, the generated alert is low or medium.

    Alerts are then grouped on a per-observable basis of the indicator. For example, all alerts generated in a 24-hour time period that match the `contoso.com` domain are grouped into a single incident with a severity assigned based on the highest alert severity.

1. Observe the indicator information. When a match is found, the indicator is published to the Log Analytics `ThreatIntelligenceIndicators` table, and it appears on the **Threat Intelligence** page. For any indicators published from this rule, the source is defined as **Microsoft Threat Intelligence Analytics**.

Here's an example of the `ThreatIntelligenceIndicators` table.

:::image type="content" source="media/use-matching-analytics-to-detect-threats/matching-analytics-logs.png" alt-text="Screenshot that shows the ThreatIntelligenceIndicator table showing indicator with SourceSystem of Microsoft Threat Intelligence Analytics." lightbox="media/use-matching-analytics-to-detect-threats/matching-analytics-logs.png":::

Here's an example of the **Threat Intelligence** page.

:::image type="content" source="media/use-matching-analytics-to-detect-threats/matching-analytics-threat-intelligence.png" alt-text="Screenshot that shows the Threat Intelligence overview with indicator selected showing the source as Microsoft Threat Intelligence Analytics." lightbox="media/use-matching-analytics-to-detect-threats/matching-analytics-threat-intelligence.png":::

## Get more context from Microsoft Defender Threat Intelligence

Along with high-fidelity alerts and incidents, some Microsoft Defender Threat Intelligence indicators include a link to a reference article in the Microsoft Defender Threat Intelligence community portal.

:::image type="content" source="media/use-matching-analytics-to-detect-threats/mdti-article-link.png" alt-text="Screenshot that shows an incident with a link to the Microsoft Defender Threat Intelligence reference article.":::

For more information, see [What is Microsoft Defender Threat Intelligence?](/defender/threat-intelligence/what-is-microsoft-defender-threat-intelligence-defender-ti).

## Related content

In this article, you learned how to connect threat intelligence produced by Microsoft to generate alerts and incidents. For more information about threat intelligence in Microsoft Sentinel, see the following articles:

- [Work with threat indicators in Microsoft Sentinel](work-with-threat-indicators.md).
- Connect Microsoft Sentinel to [STIX/TAXII threat intelligence feeds](./connect-threat-intelligence-taxii.md).
- [Connect threat intelligence platforms](./connect-threat-intelligence-tip.md) to Microsoft Sentinel.
- See which [TIP platforms, TAXII feeds, and enrichments](threat-intelligence-integration.md) can be readily integrated with Microsoft Sentinel.
