---
title: Understand threat intelligence
titleSuffix: Microsoft Sentinel
description: Understand threat intelligence and how it integrates with features in Microsoft Sentinel to analyze data, detect threats, and enrich alerts.
author: austinmccollum
ms.topic: concept-article
ms.date: 01/27/2025
ms.author: austinmc
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security

#Customer intent: As a security analyst, I want to integrate threat intelligence into Microsoft Sentinel so that I can detect, investigate, and respond to potential security threats effectively.
---

# Understand threat intelligence in Microsoft Sentinel

Microsoft Sentinel is a cloud-native security information and event management (SIEM) solution with the ability to ingest, curate, and manage threat intelligence from numerous sources.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Introduction to threat intelligence

Cyber threat intelligence (CTI) is information that describes existing or potential threats to systems and users. This intelligence takes many forms like written reports that detail a particular threat actor's motivations, infrastructure, and techniques. It can also be specific observations of IP addresses, domains, file hashes, and other artifacts associated with known cyber threats.

Organizations use CTI to provide essential context to unusual activity so that security personnel can quickly take action to protect their people, information, and assets. You can source CTI from many places, such as:

- Open-source data feeds
- Threat intelligence-sharing communities
- Commercial intelligence feeds
- Local intelligence gathered in the course of security investigations within an organization

For SIEM solutions like Microsoft Sentinel, the most common forms of CTI are threat indicators, which are also known as indicators of compromise (IOCs) or indicators of attack. Threat indicators are data that associate observed artifacts such as URLs, file hashes, or IP addresses with known threat activity such as phishing, botnets, or malware. This form of threat intelligence is often called *tactical threat intelligence*. It's applied to security products and automation in large scale to detect potential threats to an organization and protect against them.

Another facet of threat intelligence represents threat actors, their techniques, tactics and procedures (TTPs), their infrastructure, and the identities of their victims. Microsoft Sentinel supports managing these facets along with IOCs, expressed using the open source standard for exchanging CTI known as structured threat information expression (STIX). Threat intelligence expressed as STIX objects improves interoperability and empowers organizations to hunt more efficiently. Use threat intelligence STIX objects in Microsoft Sentinel to detect malicious activity observed in your environment and provide the full context of an attack to inform response decisions.

The following table outlines the activities required to make the most of threat intelligence (TI) integration in Microsoft Sentinel:

| Action | Description|
|---|---|
| **Store threat intelligence in Microsoft Sentinel's workspace** | <ul><li>Import threat intelligence into Microsoft Sentinel by enabling data connectors to various threat intelligence platforms and feeds.</li><li>Connect threat intelligence to Microsoft Sentinel by using the upload API to connect various TI platforms or custom applications.</li><li>Create threat intelligence with a streamlined management interface.</li>|
| **Manage threat intelligence** | <ul><li>View imported threat intelligence using queries or advanced search.</li><li>Curate threat intelligence with relationships, ingestion rules or tags</li><li>Visualize key information about your TI with workbooks.</li>|
| **Use threat intelligence** | <ul><li>Detect threats and generate security alerts and incidents with built-in analytics rule templates based on your threat intelligence.</li><li>Hunt for threats using your threat intel to ask the right questions about the signals captured for your organization.</li>|

Threat intelligence also provides useful context within other Microsoft Sentinel experiences, such as notebooks. For more information, see [Get started with notebooks and MSTICPy](/azure/sentinel/notebook-get-started). 

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## Import and connect threat intelligence

Most threat intelligence is imported using data connectors or an API. Configure ingestion rules to reduce noise and ensure your intelligence feeds are optimized. Here are the solutions available for Microsoft Sentinel.

- **Microsoft Defender Threat Intelligence** data connector to ingest Microsoft's threat intelligence 
- **Threat Intelligence - TAXII** data connector for industry-standard STIX/TAXII feeds
- **Threat Intelligence upload API** for integrated and curated TI feeds using a REST API to connect (doesn't require a data connector)
- **Threat Intelligence Platform** data connector also connects TI feeds using a legacy REST API, but is on the path for deprecation
 
Use these solutions in any combination, depending on where your organization sources threat intelligence. All of these data connectors are available in **Content hub** as part of the **Threat Intelligence** solution. For more information about this solution, see the Azure Marketplace entry [Threat Intelligence](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-threatintelligence-taxii?tab=Overview).

Also, see [this catalog of threat intelligence integrations](threat-intelligence-integration.md) that are available with Microsoft Sentinel.

### Add threat intelligence to Microsoft Sentinel with the Defender Threat Intelligence data connector

Bring public, open-source, and high-fidelity IOCs generated by Defender Threat Intelligence into your Microsoft Sentinel workspace with the Defender Threat Intelligence data connectors. With a simple one-click setup, use the threat intelligence from the standard and premium Defender Threat Intelligence data connectors to monitor, alert, and hunt.

There are two versions of the data connector, standard and premium. There's also a freely available Defender Threat Intelligence threat analytics rule which gives you a sample of what the premium Defender Threat Intelligence data connector provides. However, with matching analytics, only indicators that match the rule are ingested into your environment. 

The premium Defender Threat Intelligence data connector ingests Microsoft-enriched open source intelligence and Microsoft's curated IOCs. These premium features allow analytics on more data sources with greater flexibility and understanding of that threat intelligence. Here's a table that shows what to expect when you license and enable the premium version.

| Free | Premium | 
|---|---|
| Public IOCs | |
| Open-source intelligence (OSINT) | |
| | Microsoft IOCs |
| | Microsoft-enriched OSINT |

For more information, see the following articles:

- To learn how to get a premium license and explore all the differences between the standard and premium versions, see [Explore Defender Threat Intelligence licenses](https://www.microsoft.com/security/business/siem-and-xdr/microsoft-defender-threat-intelligence#areaheading-oc8e7d).
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

## Create and manage threat intelligence

Threat intelligence powered by Microsoft Sentinel is managed next to Microsoft Defender Threat Intelligence (MDTI) and Threat Analytics in Microsoft's unified SecOps platform.

:::image type="content" source="media/understand-threat-intelligence/intel-management-defender-portal.png" alt-text="Screenshot showing intel management page in the Defender portal." lightbox="media/understand-threat-intelligence/intel-management-defender-portal.png":::

>[!NOTE]
> Threat intelligence in the Azure portal is still accessed from **Microsoft Sentinel** > **Threat management** > **Threat intelligence**.

Two of the most common threat intelligence tasks are creating new threat intelligence related to security investigations and adding tags. The management interface streamlines the manual process of curating individual threat intel with a few key features.
- Configure ingestion rules to optimize threat intel from incoming sources.
- Define relationships as you create new STIX objects.
- Curate existing TI with the relationship builder.
- Copy common metadata from a new or existing TI object with the duplicate feature.
- Add free-form tags to objects with multi-select.

The following STIX objects are available in Microsoft Sentinel:
:::image type="content" source="media/understand-threat-intelligence/new-object.png" alt-text="Screenshot of the menu to add new STIX objects along with its options."::: 

| STIX object | Description |
|---|---|
| **Threat actor** | From script kiddies to nation states, threat actor objects describe motivations, sophistication, and resourcing levels. |
| **Attack pattern** | Also known as techniques, tactics and procedures, attack patterns describe a specific component of an attack and the MITRE ATT&CK stage it's used on. |
| **Indicator** | `Domain name`, `URL`, `IPv4 address`, `IPv6 address`, and `File hashes`</br></br>`X509 certificates` are used to authenticate the identity of devices and servers for  secure communication over the internet.</br></br>`JA3` fingerprints are unique identifiers generated from the TLS/SSL handshake process. They help in identifying specific applications and tools used in network traffic, making it easier to detect malicious activities</br></br>`JA3S` fingerprints extend the capabilities of JA3 by also including server-specific characteristics in the fingerprinting process. This extension provides a more comprehensive view of the network traffic and helps in identifying both client and server-side threats.</br></br>`User agents` provide information about the client software making requests to a server, such as the browser or operating system. They're useful in identifying and profiling devices and applications accessing a network. |
| **Identity** | Describe victims, organizations, and other groups or individuals along with the business sectors most closely associated with them. |
| **Relationship** | The threads that connect threat intelligence, helping to make connections across disparate signals and data points are described with relationships. |

### Configure ingestion rules

Optimize threat intelligence feeds by filtering and enhancing objects before they're delivered to your workspace. Ingestion rules update attributes, or filter objects out all together. The following table lists some use cases:

| Ingestion rule use case | Description |
|---|---|
| Reduce noise | Filter out old threat intelligence not updated for 6 months that also has low confidence. |
| Extend validity date | Promote high fidelity IOCs from trusted sources by extending their `Valid until` by 30 days. |
| Remember the old days | The new threat actor taxonomy is great, but some of the analysts want to be sure to tag the old names. |

:::image type="content" source="media/understand-threat-intelligence/ingestion-rules-overview.png" alt-text="Screenshot shows four ingestion rules matching the use cases.":::

Keep in mind the following tips for using ingestion rules:
- All rules apply in order. Threat intelligence objects being ingested will get processed by each rule until a `Delete` action is taken. If no action is taken on an object, it is ingested from the source as is.
- The `Delete` action means the threat intelligence object is skipped for ingestion, meaning it's removed from the pipeline. Any previous versions of the object already ingested aren't affected.
- New and edited rules take up to 15 minutes to take effect.

For more information, see [Work with threat intelligence ingestion rules](work-with-threat-indicators.md#optimize-threat-intelligence-feeds-with-ingestion-rules).

### Create relationships

Enhance threat detection and response by establishing connections between objects with the relationship builder. The following table lists some of its use cases:

| Relationship use case | Description |
|---|---|
| Connect a threat actor to an attack pattern | The threat actor `APT29` *Uses* the attack pattern `Phishing via Email` to gain initial access.|
| Link an indicator to a threat actor|  A domain indicator `allyourbase.contoso.com` is *Attributed to* the threat actor `APT29`. |
| Associate an identity (victim) with an attack pattern| The attack pattern `Phishing via Email` *Targets* the `FourthCoffee` organization.|

The following image shows how the relationship builder connects all of these use cases.

:::image type="content" source="media/understand-threat-intelligence/relationship-example.png" alt-text="Screenshot showing example relationship being built.":::

### Curate threat intelligence

Configure which TI objects can be shared with appropriate audiences by designating a sensitivity level called Traffic Light Protocol (TLP).

| TLP color | Sensitivity |
|---|---|
| White | Information can be shared freely and publicly without any restrictions. |
| Green | Information can be shared with peers and partner organizations within the community, but not publicly. It's intended for a wider audience within the community. |
| Amber | Information can be shared with members of the organization, but not publicly. It's intended to be used within the organization to protect sensitive information. |
| Red | Information is highly sensitive and shouldn't be shared outside of the specific group or meeting where it was originally disclosed. |

Tagging threat intelligence is a quick way to group objects together to make them easier to find. Typically, you might apply tags related to a particular incident. But, if an object represents threats from a particular known actor or well-known attack campaign, consider creating a relationship instead of a tag. After you search and filter for the threat intelligence that you want to work with, tag them individually or multiselect and tag them all at once. Because tagging is free-form, we recommend that you create standard naming conventions for threat intelligence tags.

For more information, see [Work with threat intelligence in Microsoft Sentinel](work-with-threat-indicators.md#create-threat-intelligence).

## View your threat intelligence

View your threat intelligence from the management interface. Use advanced search to sort and filter your threat intelligence objects without even writing a Log Analytics query.

:::image type="content" source="media/understand-threat-intelligence/advanced-search.png" alt-text="Screenshot that shows an advanced search interface with source and confidence conditions selected." lightbox="media/understand-threat-intelligence/advanced-search.png":::

View your indicators stored in the Microsoft Sentinel-enabled Log Analytics workspace. The `ThreatIntelligenceIndicator` table under the **Microsoft Sentinel** schema is where all your Microsoft Sentinel threat indicators are stored. This table is the basis for threat intelligence queries performed by other Microsoft Sentinel features, such as analytics, hunting queries, and workbooks. 

>[!IMPORTANT]
>Tables supporting the new STIX object schema are in private preview. In order to view the STIX objects in queries and unlock the hunting model that uses them, request to opt in with [this form](https://forms.office.com/r/903VU5x3hz?origin=lprLink). Ingest your threat intelligence into the new tables, `ThreatIntelIndicator` and `ThreatIntelObjects`, alongside or instead of the current table, `ThreatIntelligenceIndicator`, with this opt-in process.
>

Here's an example view of a basic query for just threat indicators using the current table.

:::image type="content" source="media/understand-threat-intelligence/logs-page-ti-table.png" alt-text="Screenshot that shows the Logs page with a sample query of the ThreatIntelligenceIndicator table." lightbox="media/understand-threat-intelligence/logs-page-ti-table.png":::

Threat intelligence indicators are ingested into the `ThreatIntelligenceIndicator` table of your Log Analytics workspace as read-only. Whenever an indicator is updated, a new entry in the `ThreatIntelligenceIndicator` table is created. Only the most current indicator appears on the management interface. Microsoft Sentinel deduplicates indicators based on the `IndicatorId` and `SourceSystem` properties and chooses the indicator with the newest `TimeGenerated[UTC]`.

The `IndicatorId` property is generated using the STIX indicator ID. When indicators are imported or created from non-STIX sources, `IndicatorId` is generated from the source and pattern of the indicator.

For more information, see [Work with threat intelligence in Microsoft Sentinel](work-with-threat-indicators.md#find-and-view-your-indicators-with-queries).

### View your GeoLocation and WhoIs data enrichments (public preview)

Microsoft enriches IP and domain indicators with extra `GeoLocation` and `WhoIs` data to provide more context for investigations where the selected IOC is found.

View `GeoLocation` and `WhoIs` data on the **Threat Intelligence** pane for those types of threat indicators imported into Microsoft Sentinel.

For example, use `GeoLocation` data to find information like the organization or country or region for an IP indicator. Use `WhoIs` data to find data like registrar and record creation data from a domain indicator.

## Detect threats with threat indicator analytics

The most important use case for threat intelligence in SIEM solutions like Microsoft Sentinel is to power analytics rules for threat detection. These indicator-based rules compare raw events from your data sources against your threat indicators to detect security threats in your organization. In Microsoft Sentinel Analytics, you create analytics rules powered by queries that run on a schedule and generate security alerts. Along with configurations, they determine how often the rule should run, what kind of query results should generate security alerts and incidents, and, optionally, when to trigger an automated response.

Although you can always create new analytics rules from scratch, Microsoft Sentinel provides a set of built-in rule templates, created by Microsoft security engineers, to take advantage of your threat indicators. These templates are based on the type of threat indicators (domain, email, file hash, IP address, or URL) and data source events that you want to match. Each template lists the required sources that are needed for the rule to function. This information makes it easy to determine if the necessary events are already imported in Microsoft Sentinel.

By default, when these built-in rules are triggered, an alert is created. In Microsoft Sentinel, the alerts generated from analytics rules also generate security incidents. On the Microsoft Sentinel menu, under **Threat management**, select **Incidents**. Incidents are what your security operations teams triage and investigate to determine the appropriate response actions. For more information, see [Tutorial: Investigate incidents with Microsoft Sentinel](./investigate-cases.md).

For more information on using threat indicators in your analytics rules, see [Use threat intelligence to detect threats](use-threat-indicators-in-analytics-rules.md).

Microsoft provides access to its threat intelligence through the Defender Threat Intelligence analytics rule. For more information on how to take advantage of this rule, which generates high-fidelity alerts and incidents, see [Use matching analytics to detect threats](use-matching-analytics-to-detect-threats.md).

:::image type="content" source="media/understand-threat-intelligence/detect-threats-matching-analytics.png" alt-text="Screenshot that shows a high-fidelity incident generated by matching analytics with more context information from Defender Threat Intelligence.":::

## Workbooks provide insights about your threat intelligence

Workbooks provide powerful interactive dashboards that give you insights into all aspects of Microsoft Sentinel, and threat intelligence is no exception. Use the built-in **Threat Intelligence** workbook to visualize key information about your threat intelligence. Customize the workbook according to your business needs. Create new dashboards by combining many data sources to help you visualize your data in unique ways.

Because Microsoft Sentinel workbooks are based on Azure Monitor workbooks, extensive documentation and many more templates are already available. For more information, see [Create interactive reports with Azure Monitor workbooks](/azure/azure-monitor/visualize/workbooks-overview).

There's also a rich resource for [Azure Monitor workbooks on GitHub](https://github.com/microsoft/Application-Insights-Workbooks), where you can download more templates and contribute your own templates.

For more information on using and customizing the **Threat Intelligence** workbook, see [Visualize threat intelligence with workbooks](work-with-threat-indicators.md#visualize-your-threat-intelligence-with-workbooks).

## Related content

In this article, you learned about threat intelligence capabilities powered by Microsoft Sentinel. For more information, see the following articles:

- [New STIX objects in Microsoft Sentinel](https://techcommunity.microsoft.com/blog/microsoftsentinelblog/announcing-public-preview-new-stix-objects-in-microsoft-sentinel/4369164)
- [Uncover adversaries with threat intelligence in Microsoft's unified SecOps platform](/unified-secops-platform/threat-intelligence-overview)
- [Hunting in Microsoft's unified SecOps platform](/unified-secops-platform/hunting-overview)
