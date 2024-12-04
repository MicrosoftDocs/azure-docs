---
title: Understand threat intelligence
titleSuffix: Microsoft Sentinel
description: Understand how threat intelligence feeds are connected to, managed, and used in Microsoft Sentinel to analyze data, detect threats, and enrich alerts.
author: austinmccollum
ms.topic: concept-article
ms.date: 8/16/2024
ms.author: austinmc
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security


#Customer intent: As a security analyst, I want to integrate threat intelligence into Microsoft Sentinel so that I can detect, investigate, and respond to potential security threats effectively.

---

# Understand threat intelligence in Microsoft Sentinel

Microsoft Sentinel is a cloud-native security information and event management (SIEM) solution with the ability to quickly pull threat intelligence from numerous sources.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Introduction to threat intelligence

Cyber threat intelligence (CTI) is information that describes existing or potential threats to systems and users. This intelligence takes many forms like written reports that detail a particular threat actor's motivations, infrastructure, and techniques. It can also be specific observations of IP addresses, domains, file hashes, and other artifacts associated with known cyber threats.

Organizations use CTI to provide essential context to unusual activity so that security personnel can quickly take action to protect their people, information, and assets. You can source CTI from many places, such as:

- Open-source data feeds.
- Threat intelligence-sharing communities.
- Commercial intelligence feeds.
- Local intelligence gathered in the course of security investigations within an organization.

For SIEM solutions like Microsoft Sentinel, the most common forms of CTI are threat indicators, which are also known as indicators of compromise (IOCs) or indicators of attack. Threat indicators are data that associate observed artifacts such as URLs, file hashes, or IP addresses with known threat activity such as phishing, botnets, or malware. This form of threat intelligence is often called *tactical threat intelligence*. It's applied to security products and automation in large scale to detect potential threats to an organization and protect against them.

Use threat indicators in Microsoft Sentinel to detect malicious activity observed in your environment and provide context to security investigators to inform response decisions.

You can integrate threat intelligence into Microsoft Sentinel through the following activities:

- **Import threat intelligence** into Microsoft Sentinel by enabling *data connectors* to various threat intelligence [platforms](connect-threat-intelligence-tip.md) and [feeds](connect-threat-intelligence-taxii.md).
- **View and manage** the imported threat intelligence in **Logs** and on the **Threat Intelligence** pane of Microsoft Sentinel.
- **Detect threats** and generate security alerts and incidents by using the built-in **Analytics** rule templates based on your imported threat intelligence.
- **Visualize key information** about your imported threat intelligence in Microsoft Sentinel with the **Threat Intelligence** workbook.

Microsoft enriches all imported threat intelligence indicators with [GeoLocation and WhoIs data](#view-your-geolocation-and-whois-data-enrichments-public-preview), which is displayed together with other indicator information.

Threat intelligence also provides useful context within other Microsoft Sentinel experiences, such as hunting and notebooks. For more information, see [Jupyter notebooks in Microsoft Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/using-threat-intelligence-in-your-jupyter-notebooks/ba-p/860239) and [Tutorial: Get started with Jupyter notebooks and MSTICPy in Microsoft Sentinel](notebook-get-started.md).

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## Import threat intelligence with data connectors

Threat indicators are imported by using data connectors, just like all the other event data in Microsoft Sentinel. Here are the data connectors in Microsoft Sentinel provided specifically for threat indicators:

- **Microsoft Defender Threat Intelligence data connector**: Used to ingest Microsoft threat indicators.
- **Premium Defender Threat Intelligence data connector**: Used to ingest the Defender Threat Intelligence premium intelligence feed.
- **Threat Intelligence - TAXII**: Used for industry-standard STIX/TAXII feeds.
- **Threat Intelligence Upload Indicators API**: Used for integrated and curated threat intelligence feeds by using a REST API to connect.
- **Threat Intelligence Platform (TIP) data connector**: Used to connect threat intelligence feeds by using a REST API, but it's on the path for deprecation.

Use any of these data connectors in any combination together, depending on where your organization sources threat indicators. All three of these connectors are available in the **Content hub** as part of the Threat Intelligence solution. For more information about this solution, see the Azure Marketplace entry [Threat Intelligence](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-threatintelligence-taxii?tab=Overview).

Also, see [this catalog of threat intelligence integrations](threat-intelligence-integration.md) that are available with Microsoft Sentinel.

### Add threat indicators to Microsoft Sentinel with the Defender Threat Intelligence data connector

Bring public, open-source, and high-fidelity IOCs generated by Defender Threat Intelligence into your Microsoft Sentinel workspace with the Defender Threat Intelligence data connectors. With a simple one-click setup, use the threat intelligence from the standard and premium Defender Threat Intelligence data connectors to monitor, alert, and hunt.

The freely available Defender Threat Intelligence threat analytics rule gives you a sample of what the premium Defender Threat Intelligence data connector provides. However, with matching analytics, only indicators that match the rule are ingested into your environment. The premium Defender Threat Intelligence data connector brings the premium threat intelligence and allows analytics for more data sources with greater flexibility and understanding of that threat intelligence. Here's a table that shows what to expect when you license and enable the premium Defender Threat Intelligence data connector.

| Free | Premium | 
|----|----|
| Public IOCs | |
| Open-source intelligence (OSINT) | |
| | Microsoft IOCs |
| | Microsoft-enriched OSINT |

For more information, see the following articles:

- To learn how to get a premium license and explore all the differences between the standard and premium versions, see the [Microsoft Defender Threat Intelligence product page](https://www.microsoft.com/security/business/siem-and-xdr/microsoft-defender-threat-intelligence).
- To learn more about the free Defender Threat Intelligence experience, see [Introducing Defender Threat Intelligence free experience for Microsoft Defender XDR](https://techcommunity.microsoft.com/t5/microsoft-defender-threat/introducing-mdti-free-experience-for-microsoft-defender-xdr/ba-p/3976635).
- To learn how to enable the Defender Threat Intelligence and the premium Defender Threat Intelligence data connectors, see [Enable the Defender Threat Intelligence data connector](connect-mdti-data-connector.md).
- To learn about matching analytics, see [Use matching analytics to detect threats](use-matching-analytics-to-detect-threats.md).

### Add threat indicators to Microsoft Sentinel with the Threat Intelligence Upload Indicators API data connector

Many organizations use threat intelligence platform (TIP) solutions to aggregate threat indicator feeds from various sources. From the aggregated feed, the data is curated to apply to security solutions such as network devices, EDR/XDR solutions, or SIEMs such as Microsoft Sentinel. By using the Threat Intelligence Upload Indicators API data connector, you can use these solutions to import threat indicators into Microsoft Sentinel.

:::image type="content" source="media/understand-threat-intelligence/threat-intel-upload-api.png" alt-text="Diagram that shows the Upload Indicators API import path.":::

This data connector uses a new API and offers the following improvements:

- The threat indicator fields are based off of the STIX standardized format.
- The Microsoft Entra application only requires the Microsoft Sentinel Contributor role.
- The API request endpoint is scoped at the workspace level. The required Microsoft Entra application permissions allow granular assignment at the workspace level.

For more information, see [Connect your threat intelligence platform using the Upload Indicators API](connect-threat-intelligence-upload-api.md).

### Add threat indicators to Microsoft Sentinel with the Threat Intelligence Platform data connector

Much like the existing Upload Indicators API data connector, the Threat Intelligence Platform data connector uses an API that allows your TIP or custom solution to send indicators into Microsoft Sentinel. However, this data connector is now on a path for deprecation. We recommend that you take advantage of the optimizations that the Upload Indicators API offers.

The TIP data connector works with the [Microsoft Graph Security tiIndicators API](/graph/api/resources/tiindicator). You can also use it with any custom TIP that communicates with the tiIndicators API to send indicators to Microsoft Sentinel (and to other Microsoft security solutions like Defender XDR).

:::image type="content" source="media/understand-threat-intelligence/threat-intel-import-path.png" alt-text="Screenshot that shows a threat intelligence import path.":::

For more information on the TIP solutions integrated with Microsoft Sentinel, see [Integrated threat intelligence platform products](threat-intelligence-integration.md#integrated-threat-intelligence-platform-products).
For more information, see [Connect your threat intelligence platform to Microsoft Sentinel](connect-threat-intelligence-tip.md).

### Add threat indicators to Microsoft Sentinel with the Threat Intelligence - TAXII data connector

The most widely adopted industry standard for the transmission of threat intelligence is a [combination of the STIX data format and the TAXII protocol](https://oasis-open.github.io/cti-documentation/). If your organization obtains threat indicators from solutions that support the current STIX/TAXII version (2.0 or 2.1), use the Threat Intelligence - TAXII data connector to bring your threat indicators into Microsoft Sentinel. The Threat Intelligence - TAXII data connector enables a built-in TAXII client in Microsoft Sentinel to import threat intelligence from TAXII 2.x servers.

:::image type="content" source="media/understand-threat-intelligence/threat-intel-taxii-import-path.png" alt-text="Screenshot that shows a TAXII import path":::

To import STIX-formatted threat indicators to Microsoft Sentinel from a TAXII server:

1. Obtain the TAXII server API root and collection ID.
1. Enable the Threat Intelligence - TAXII data connector in Microsoft Sentinel.

For more information, see [Connect Microsoft Sentinel to STIX/TAXII threat intelligence feeds](connect-threat-intelligence-taxii.md).

## View and manage your threat indicators

View and manage your indicators on the **Threat Intelligence** page. Sort, filter, and search your imported threat indicators without even writing a Log Analytics query.

:::image type="content" source="media/understand-threat-intelligence/advanced-search.png" alt-text="Screenshot that shows an advanced search interface with source and pattern conditions selected." lightbox="media/understand-threat-intelligence/advanced-search.png":::

Two of the most common threat intelligence tasks are indicator tagging and creating new indicators related to security investigations. Create or edit the threat indicators directly on the **Threat Intelligence** page when you only need to quickly manage a few.

Tagging threat indicators is an easy way to group them together to make them easier to find. Typically, you might apply tags to an indicator related to a particular incident, or if the indicator represents threats from a particular known actor or well-known attack campaign. After you search for the indicators that you want to work with, you can tag them individually. Multiselect indicators and tag them all at once with one or more tags. Because tagging is free-form, we recommend that you create standard naming conventions for threat indicator tags.

Validate your indicators and view your successfully imported threat indicators from the Microsoft Sentinel-enabled Log Analytics workspace. The `ThreatIntelligenceIndicator` table under the **Microsoft Sentinel** schema is where all your Microsoft Sentinel threat indicators are stored. This table is the basis for threat intelligence queries performed by other Microsoft Sentinel features, such as analytics and workbooks.

Here's an example view of a basic query for threat indicators.

:::image type="content" source="media/understand-threat-intelligence/logs-page-ti-table.png" alt-text="Screenshot that shows the Logs page with a sample query of the ThreatIntelligenceIndicator table." lightbox="media/understand-threat-intelligence/logs-page-ti-table.png":::

Threat intelligence indicators are ingested into the `ThreatIntelligenceIndicator` table of your Log Analytics workspace as read-only. Whenever an indicator is updated, a new entry in the `ThreatIntelligenceIndicator` table is created. Only the most current indicator appears on the **Threat Intelligence** page. Microsoft Sentinel deduplicates indicators based on the `IndicatorId` and `SourceSystem` properties and chooses the indicator with the newest `TimeGenerated[UTC]`.

The `IndicatorId` property is generated by using the STIX indicator ID. When indicators are imported or created from non-STIX sources, `IndicatorId` is generated by the source and pattern of the indicator.

For more information on viewing and managing your threat indicators, see [Work with threat indicators in Microsoft Sentinel](work-with-threat-indicators.md#view-your-threat-indicators-in-microsoft-sentinel).

### View your GeoLocation and WhoIs data enrichments (public preview)

Microsoft enriches IP and domain indicators with extra `GeoLocation` and `WhoIs` data to provide more context for investigations where the selected IOC is found.

View `GeoLocation` and `WhoIs` data on the **Threat Intelligence** pane for those types of threat indicators imported into Microsoft Sentinel.

For example, use `GeoLocation` data to find information like the organization or country/region for an IP indicator. Use `WhoIs` data to find data like registrar and record creation data from a domain indicator.

## Detect threats with threat indicator analytics

The most important use case for threat indicators in SIEM solutions like Microsoft Sentinel is to power analytics rules for threat detection. These indicator-based rules compare raw events from your data sources against your threat indicators to detect security threats in your organization. In Microsoft Sentinel Analytics, you create analytics rules that run on a schedule and generate security alerts. The rules are driven by queries. Along with configurations, they determine how often the rule should run, what kind of query results should generate security alerts and incidents, and, optionally, when to trigger an automated response.

Although you can always create new analytics rules from scratch, Microsoft Sentinel provides a set of built-in rule templates, created by Microsoft security engineers, to take advantage of your threat indicators. These templates are based on the type of threat indicators (domain, email, file hash, IP address, or URL) and data source events that you want to match. Each template lists the required sources that are needed for the rule to function. This information makes it easy to determine if the necessary events are already imported in Microsoft Sentinel.

By default, when these built-in rules are triggered, an alert is created. In Microsoft Sentinel, the alerts generated from analytics rules also generate security incidents. On the Microsoft Sentinel menu, under **Threat management**, select **Incidents**. Incidents are what your security operations teams triage and investigate to determine the appropriate response actions. For more information, see [Tutorial: Investigate incidents with Microsoft Sentinel](./investigate-cases.md).

For more information on using threat indicators in your analytics rules, see [Use threat intelligence to detect threats](use-threat-indicators-in-analytics-rules.md).

Microsoft provides access to its threat intelligence through the Defender Threat Intelligence analytics rule. For more information on how to take advantage of this rule, which generates high-fidelity alerts and incidents, see [Use matching analytics to detect threats](use-matching-analytics-to-detect-threats.md).

:::image type="content" source="media/understand-threat-intelligence/detect-threats-matching-analytics.png" alt-text="Screenshot that shows a high-fidelity incident generated by matching analytics with more context information from Defender Threat Intelligence.":::

## Workbooks provide insights about your threat intelligence

Workbooks provide powerful interactive dashboards that give you insights into all aspects of Microsoft Sentinel, and threat intelligence is no exception. Use the built-in **Threat Intelligence** workbook to visualize key information about your threat intelligence. You can easily customize the workbook according to your business needs. Create new dashboards by combining many data sources to help you visualize your data in unique ways.

Because Microsoft Sentinel workbooks are based on Azure Monitor workbooks, extensive documentation and many more templates are already available. For more information, see [Create interactive reports with Azure Monitor workbooks](/azure/azure-monitor/visualize/workbooks-overview).

There's also a rich resource for [Azure Monitor workbooks on GitHub](https://github.com/microsoft/Application-Insights-Workbooks), where you can download more templates and contribute your own templates.

For more information on using and customizing the **Threat Intelligence** workbook, see [Work with threat indicators in Microsoft Sentinel](work-with-threat-indicators.md#gain-insights-about-your-threat-intelligence-with-workbooks).

## Related content

In this article, you learned about the threat intelligence capabilities of Microsoft Sentinel, including the **Threat Intelligence** pane. For practical guidance on using Microsoft Sentinel threat intelligence capabilities, see the following articles:

- Connect Microsoft Sentinel to [STIX/TAXII threat intelligence feeds](./connect-threat-intelligence-taxii.md).
- [Connect threat intelligence platforms](./connect-threat-intelligence-tip.md) to Microsoft Sentinel.
- See which [TIP platforms, TAXII feeds, and enrichments](threat-intelligence-integration.md) are readily integrated with Microsoft Sentinel.
- [Work with threat indicators](work-with-threat-indicators.md) throughout the Microsoft Sentinel experience.
- Detect threats with [built-in](./detect-threats-built-in.md) or [custom](./detect-threats-custom.md) analytics rules in Microsoft Sentinel.
- [Investigate incidents](./investigate-cases.md) in Microsoft Sentinel.
