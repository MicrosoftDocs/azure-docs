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

Microsoft Sentinel is a cloud-native security information and event management (SIEM) solution with the ability to manage threat intelligence from numerous sources.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Introduction to threat intelligence

Cyber threat intelligence (CTI) is information that describes existing or potential threats to systems and users. This intelligence takes many forms like written reports that detail a particular threat actor's motivations, infrastructure, and techniques. It can also be specific observations of IP addresses, domains, file hashes, and other artifacts associated with known cyber threats.

Organizations use CTI to provide essential context to unusual activity so that security personnel can quickly take action to protect their people, information, and assets. You can source CTI from many places, such as:

- Open-source data feeds.
- Threat intelligence-sharing communities.
- Commercial intelligence feeds.
- Local intelligence gathered in the course of security investigations within an organization.

For SIEM solutions like Microsoft Sentinel, the most common forms of CTI are threat indicators, which are also known as indicators of compromise (IOCs) or indicators of attack. Threat indicators are data that associate observed artifacts such as URLs, file hashes, or IP addresses with known threat activity such as phishing, botnets, or malware. This form of threat intelligence is often called *tactical threat intelligence*. It's applied to security products and automation in large scale to detect potential threats to an organization and protect against them.

Another facet of threat intelligence represents threat actors, their TTPs (techniques, tactics and procedures), their infrastructure, and their victims. Microsoft Sentinel supports managing these facets along with IOCs, expressed using the open source standard for exchanging CTI known as the STIX (structured threat information expression) language format. The STIX objects usable in Microsoft Sentinel are:
- Indicator
- Attack pattern
- Identity
- Threat actor
- Relationship

Use threat intelligence in Microsoft Sentinel to detect malicious activity observed in your environment and provide context to security investigators to inform response decisions.

You can integrate threat intelligence into Microsoft Sentinel through the following activities:

- **Import threat intelligence** into Microsoft Sentinel by enabling *data connectors* to various threat intelligence [platforms](connect-threat-intelligence-tip.md) and [feeds](connect-threat-intelligence-taxii.md).
- **Connect threat intelligence** to Microsoft Sentinel by using the upload API to connect various TI [platforms](connect-threat-intelligence-tip.md) or custom applications.
- **Create threat intelligence** individually or import using a file from the management interface.
- **View and manage** the imported threat intelligence in **Logs** or with advanced search in the user interface.
- **Detect threats** and generate security alerts and incidents by using the built-in **Analytics** rule templates based on your imported threat intelligence.
- **Visualize key information** about your imported threat intelligence in Microsoft Sentinel with the **Threat Intelligence** workbook.

Microsoft enriches IPV4 and domain name indicators with [GeoLocation and WhoIs data](#view-your-geolocation-and-whois-data-enrichments-public-preview), which is displayed together with other indicator information.

Threat intelligence also provides useful context within other Microsoft Sentinel experiences, such as hunting and notebooks. For more information, see [Jupyter notebooks in Microsoft Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/using-threat-intelligence-in-your-jupyter-notebooks/ba-p/860239) and [Tutorial: Get started with Jupyter notebooks and MSTICPy in Microsoft Sentinel](notebook-get-started.md).

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## Import and connect threat intelligence

Most threat intelligence is imported using data connectors or an API. Here are the solutions available for Microsoft Sentinel.

- **Microsoft Defender Threat Intelligence data connector** to ingest Microsoft's threat intelligence 
- **Threat Intelligence - TAXII** for industry-standard STIX/TAXII feeds
- **Threat Intelligence upload API** for integrated and curated TI feeds using a REST API to connect (doesn't require a data connector)
- **Threat Intelligence Platform data connector** also connects TI feeds using a legacy REST API, but is on the path for deprecation
 
Use any of these solutions in any combination, depending on where your organization sources threat intelligence. All of these are available in **Content hub** as part of the **Threat Intelligence** solution. For more information about this solution, see the Azure Marketplace entry [Threat Intelligence](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-threatintelligence-taxii?tab=Overview).

Also, see [this catalog of threat intelligence integrations](threat-intelligence-integration.md) that are available with Microsoft Sentinel.

### Add threat intelligence to Microsoft Sentinel with the Defender Threat Intelligence data connector

Bring public, open-source, and high-fidelity IOCs generated by Defender Threat Intelligence into your Microsoft Sentinel workspace with the Defender Threat Intelligence data connectors. With a simple one-click setup, use the threat intelligence from the standard and premium Defender Threat Intelligence data connectors to monitor, alert, and hunt.

There are two versions of the data connector, standard and premium. There's also a freely available Defender Threat Intelligence threat analytics rule which gives you a sample of what the premium Defender Threat Intelligence data connector provides. However, with matching analytics, only indicators that match the rule are ingested into your environment. The premium Defender Threat Intelligence data connector ingests Microsoft-enriched open source intelligence and Microsoft's curated IOCs. These premium features allow analytics on more data sources with greater flexibility and understanding of that threat intelligence. Here's a table that shows what to expect when you license and enable the Defender Threat Intelligence data connector premium version.

| Free | Premium | 
|----|----|
| Public IOCs | |
| Open-source intelligence (OSINT) | |
| | Microsoft IOCs |
| | Microsoft-enriched OSINT |

For more information, see the following articles:

- To learn how to get a premium license and explore all the differences between the standard and premium versions, see the [Explore Defender Threat Intelligence licenses](https://www.microsoft.com/security/business/siem-and-xdr/microsoft-defender-threat-intelligence#areaheading-oc8e7d).
- To learn more about the free Defender Threat Intelligence experience, see [Introducing Defender Threat Intelligence free experience for Microsoft Defender XDR](https://techcommunity.microsoft.com/t5/microsoft-defender-threat/introducing-mdti-free-experience-for-microsoft-defender-xdr/ba-p/3976635).
- To learn how to enable the Defender Threat Intelligence and the premium Defender Threat Intelligence data connectors, see [Enable the Defender Threat Intelligence data connector](connect-mdti-data-connector.md).
- To learn about matching analytics, see [Use matching analytics to detect threats](use-matching-analytics-to-detect-threats.md).

### Add threat intelligence to Microsoft Sentinel with the upload API

Many organizations use threat intelligence platform (TIP) solutions to aggregate threat indicator feeds from various sources. From the aggregated feed, the data is curated to apply to security solutions such as network devices, EDR/XDR solutions, or SIEMs such as Microsoft Sentinel. The **upload API** allows you to use these solutions to import threat intelligence STIX objects into Microsoft Sentinel. 

:::image type="content" source="media/understand-threat-intelligence/threat-intel-upload-api.png" alt-text="Diagram that shows the upload API import path.":::

The new upload API doesn't require a data connector and offers the following improvements:

- The threat indicator fields are based off of the STIX standardized format.
- The Microsoft Entra application requires the Microsoft Sentinel Contributor role.
- The API request endpoint is scoped at the workspace level. The required Microsoft Entra application permissions allow granular assignment at the workspace level.

For more information, see [Connect your threat intelligence platform using upload API](connect-threat-intelligence-upload-api.md) 

### Add threat intelligence to Microsoft Sentinel with the Threat Intelligence Platform data connector

> [!NOTE]
> This data connector is now on a path for deprecation. 

Much like the upload API, the Threat Intelligence Platform data connector uses an API that allows your TIP or custom solution to send threat intelligence into Microsoft Sentinel. However, this data connector is limited to only indicators and is now on a path for deprecation. We recommend that you take advantage of the optimizations the upload API has to offer.

The TIP data connector uses the [Microsoft Graph Security tiIndicators API](/graph/api/resources/tiindicator) which doesn't support other STIX objects. Use it with any custom TIP that communicates with the tiIndicators API to send indicators to Microsoft Sentinel (and to other Microsoft security solutions like Defender XDR).

:::image type="content" source="media/understand-threat-intelligence/threat-intel-import-path.png" alt-text="Screenshot that shows a threat intelligence import path.":::

For more information on the TIP solutions integrated with Microsoft Sentinel, see [Integrated threat intelligence platform products](threat-intelligence-integration.md#integrated-threat-intelligence-platform-products).
For more information, see [Connect your threat intelligence platform to Microsoft Sentinel](connect-threat-intelligence-tip.md).

### Add threat intelligence to Microsoft Sentinel with the Threat Intelligence - TAXII data connector

The most widely adopted industry standard for the transmission of threat intelligence is a [combination of the STIX data format and the TAXII protocol](https://oasis-open.github.io/cti-documentation/). If your organization obtains threat intelligence from solutions that support the current STIX/TAXII version (2.0 or 2.1), use the Threat Intelligence - TAXII data connector to bring your threat intelligence into Microsoft Sentinel. The Threat Intelligence - TAXII data connector enables a built-in TAXII client in Microsoft Sentinel to import threat intelligence from TAXII 2.x servers.

:::image type="content" source="media/understand-threat-intelligence/threat-intel-taxii-import-path.png" alt-text="Screenshot that shows a TAXII import path":::

To import STIX-formatted threat intelligence to Microsoft Sentinel from a TAXII server:

1. Obtain the TAXII server API root and collection ID.
1. Enable the Threat Intelligence - TAXII data connector in Microsoft Sentinel.

For more information, see [Connect Microsoft Sentinel to STIX/TAXII threat intelligence feeds](connect-threat-intelligence-taxii.md).

## Create threat intelligence

Manually create threat intelligence 

## View and manage your threat intelligence

View and manage threat intelligence from the management interface. Sort, filter, and search your imported threat intelligence without even writing a Log Analytics query.

:::image type="content" source="media/understand-threat-intelligence/advanced-search.png" alt-text="Screenshot that shows an advanced search interface with source and confidence conditions selected." lightbox="media/understand-threat-intelligence/advanced-search.png":::

Two of the most common threat intelligence tasks are tagging and creating new threat intelligence related to security investigations. Create or edit the threat indicators directly in the management interface.

Tagging threat intelligence is an easy way to group them together to make them easier to find. Typically, you might apply tags related to a particular incident, or if an indicator represents threats from a particular known actor or well-known attack campaign you might create a relationship. After you search for the threat intelligence that you want to work with, tag them individually or multiselect and tag them all at once. Because tagging is free-form, we recommend that you create standard naming conventions for threat intelligence tags.

Validate your indicators and view your successfully imported threat indicators from the Microsoft Sentinel-enabled Log Analytics workspace. The `ThreatIntelligenceIndicator` table under the **Microsoft Sentinel** schema is where all your Microsoft Sentinel threat indicators are stored. This table is the basis for threat intelligence queries performed by other Microsoft Sentinel features, such as analytics and workbooks. 

New tables are used to support the new STIX object schema, but aren't available publicly yet. In order to view threat intelligence for STIX objects and unlock the hunting model that uses them, request to opt-in with [this form](https://forms.office.com/r/903VU5x3hz?origin=lprLink). Either ingest your threat intelligence into only the new tables, `ThreatIntelIndicator` and `ThreatIntelObjects`, or alongside the current table, `ThreatIntelligenceIndicator` with this optional request.

Here's an example view of a basic query for for just threat indicators using the current table.

:::image type="content" source="media/understand-threat-intelligence/logs-page-ti-table.png" alt-text="Screenshot that shows the Logs page with a sample query of the ThreatIntelligenceIndicator table." lightbox="media/understand-threat-intelligence/logs-page-ti-table.png":::

Threat intelligence indicators are ingested into the `ThreatIntelligenceIndicator` table of your Log Analytics workspace as read-only. Whenever an indicator is updated, a new entry in the `ThreatIntelligenceIndicator` table is created. Only the most current indicator appears on the **Threat Intelligence** page. Microsoft Sentinel deduplicates indicators based on the `IndicatorId` and `SourceSystem` properties and chooses the indicator with the newest `TimeGenerated[UTC]`.

The `IndicatorId` property is generated by using the STIX indicator ID. When indicators are imported or created from non-STIX sources, `IndicatorId` is generated by the source and pattern of the indicator.

For more information on viewing and managing your threat indicators, see [Work with threat intelligence in Microsoft Sentinel](work-with-threat-indicators.md#view-your-threat-indicators-in-microsoft-sentinel).

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

For more information on using and customizing the **Threat Intelligence** workbook, see [Work with threat intelligence in Microsoft Sentinel](work-with-threat-indicators.md#gain-insights-about-your-threat-intelligence-with-workbooks).

## Related content

In this article, you learned about the threat intelligence capabilities of Microsoft Sentinel, including the **Threat Intelligence** pane. For practical guidance on using Microsoft Sentinel threat intelligence capabilities, see the following articles:

- Connect Microsoft Sentinel to [STIX/TAXII threat intelligence feeds](./connect-threat-intelligence-taxii.md).
- [Connect threat intelligence platforms](./connect-threat-intelligence-tip.md) to Microsoft Sentinel.
- See which [TIP platforms, TAXII feeds, and enrichments](threat-intelligence-integration.md) are readily integrated with Microsoft Sentinel.
- [Work with threat intelligence](work-with-threat-indicators.md) throughout the Microsoft Sentinel experience.
- Detect threats with [built-in](./detect-threats-built-in.md) or [custom](./detect-threats-custom.md) analytics rules in Microsoft Sentinel.
- [Investigate incidents](./investigate-cases.md) in Microsoft Sentinel.
