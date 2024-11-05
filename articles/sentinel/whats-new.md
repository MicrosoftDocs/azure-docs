---
title: What's new in Microsoft Sentinel
description: Learn about the latest new features and announcement in Microsoft Sentinel from the past few months.
author: yelevin
ms.author: yelevin
ms.topic: concept-article
ms.date: 09/09/2024


#Customer intent: As a security team member, I want to stay updated on the latest features and enhancements in Microsoft Sentinel so that I can effectively manage and optimize my organization's security posture.

---

# What's new in Microsoft Sentinel

This article lists recent features added for Microsoft Sentinel, and new features in related services that provide an enhanced user experience in Microsoft Sentinel.

The listed features were released in the last three months. For information about earlier features delivered, see our [Tech Community blogs](https://techcommunity.microsoft.com/t5/azure-sentinel/bg-p/AzureSentinelBlog/label-name/What's%20New).

 Get notified when this page is updated by copying and pasting the following URL into your feed reader:
`https://aka.ms/sentinel/rss`

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## September 2024

- [Schema mapping added to the SIEM migration experience](#schema-mapping-added-to-the-siem-migration-experience)
- [Third-party enrichment widgets to be retired in February 2025](#third-party-enrichment-widgets-to-be-retired-in-february-2025)
- [Azure reservations now have pre-purchase plans available for Microsoft Sentinel](#pre-purchase-plans-now-available-for-microsoft-sentinel)
- [Import/export of automation rules now generally available (GA)](#importexport-of-automation-rules-now-generally-available-ga)
- [Google Cloud Platform data connectors are now generally available (GA)](#google-cloud-platform-data-connectors-are-now-generally-available-ga)
- [Microsoft Sentinel now generally available (GA) in Azure Israel Central](#microsoft-sentinel-now-generally-available-ga-in-azure-israel-central)

### Schema mapping added to the SIEM migration experience

Since the SIEM migration experience became generally available in May 2024, steady improvements have been made to help migrate your security monitoring from Splunk. The following new features let customers provide more contextual details about their Splunk environment and usage to the Microsoft Sentinel SIEM Migration translation engine:

- Schema Mapping
- Support for Splunk Macros in translation
- Support for Splunk Lookups in translation

To learn more about these updates, see [SIEM migration experience](siem-migration.md).

For more information about the SIEM migration experience, see the following articles:
- [Become a Microsoft Sentinel ninja - migration section](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/become-a-microsoft-sentinel-ninja-the-complete-level-400/ba-p/1246310#toc-hId-111398316)
- [SIEM migration update - Microsoft Sentinel blog](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/siem-migration-update-now-migrate-with-contextual-depth-in/ba-p/4241234)

### Third-party enrichment widgets to be retired in February 2025

Effective immediately, you can no longer enable the feature to create enrichment widgets that retrieve data from external, third-party data sources. These widgets are displayed on Microsoft Sentinel entity pages and in other locations where entity information is presented. This change is happening because you can no longer create the Azure key vault required to access these external data sources.

If you already use any third-party enrichment widgets, that is, if this key vault already exists, you can still configure and use widgets that you weren't using before, though we don't recommend doing so.

As of **February 2025**, any existing enrichment widgets that retrieve data from third-party sources will *stop being displayed*, on entity pages or anywhere else.

If your organization uses third-party enrichment widgets, we recommend disabling them in advance, by deleting the key vault you created for this purpose from its resource group. The key vault's name begins with "widgets".

Enrichment widgets based on first-party data sources are not affected by this change, and will continue to function as before. "First-party data sources" include any data that's already ingested into Microsoft Sentinel from external sources&mdash;in other words, anything in tables in your Log Analytics workspace&mdash;and Microsoft Defender Threat Intelligence.

### Pre-purchase plans now available for Microsoft Sentinel

Pre-purchase plans are a type of Azure reservation. When you buy a pre-purchase plan, you get commit units (CUs) at discounted tiers for a specific product. Microsoft Sentinel commit units (SCUs) apply towards eligible costs in your workspace. When you have predictable costs, choosing the right pre-purchase plan saves you money! 

For more information, see [Optimize costs with a pre-purchase plan](billing-pre-purchase-plan.md).

### Import/export of automation rules now generally available (GA)

The ability to export automation rules to Azure Resource Manager (ARM) templates in JSON format, and to import them from ARM templates, is now generally available after a [short preview period](#export-and-import-automation-rules-preview).

Learn more about [exporting and importing automation rules](import-export-automation-rules.md).

### Google Cloud Platform data connectors are now generally available (GA)

Microsoft Sentinel's [Google Cloud Platform (GCP) data connectors](connect-google-cloud-platform.md), based on our [Codeless Connector Platform (CCP)](create-codeless-connector.md), are now **generally available**. WIth these connectors, you can ingest logs from your GCP environment using the GCP [Pub/Sub capability](https://cloud.google.com/pubsub/docs/overview):

- The **Google Cloud Platform (GCP) Pub/Sub Audit Logs connector** collects audit trails of access to GCP resources. Analysts can monitor these logs to track resource access attempts and detect potential threats across the GCP environment.

- The **Google Cloud Platform (GCP) Security Command Center connector** collects findings from Google Security Command Center, a robust security and risk management platform for Google Cloud. Analysts can view these findings to gain insights into the organization's security posture, including asset inventory and discovery, detections of vulnerabilities and threats, and risk mitigation and remediation.

For more information on these connectors, see [Ingest Google Cloud Platform log data into Microsoft Sentinel](connect-google-cloud-platform.md).

### Microsoft Sentinel now generally available (GA) in Azure Israel Central

Microsoft Sentinel is now available in the *Israel Central* Azure region, with the same feature set as all other Azure Commercial regions.

For more information, see as [Microsoft Sentinel feature support for Azure commercial/other clouds](feature-availability.md) and [Geographical availability and data residency in Microsoft Sentinel](geographical-availability-data-residency.md).

## August 2024

- [Log Analytics agent retirement](#log-analytics-agent-retirement)
- [Export and import automation rules (Preview)](#export-and-import-automation-rules-preview)
- [Microsoft Sentinel support in Microsoft Defender multitenant management (Preview)](#microsoft-sentinel-support-in-microsoft-defender-multitenant-management-preview)
- [Premium Microsoft Defender Threat Intelligence data connector (Preview)](#premium-microsoft-defender-threat-intelligence-data-connector-preview)
- [Unified AMA-based connectors for syslog ingestion](#unified-ama-based-connectors-for-syslog-ingestion)
- [Better visibility for Windows security events](#better-visibility-for-windows-security-events)
- [New Auxiliary logs retention plan (Preview)](#new-auxiliary-logs-retention-plan-preview)
- [Create summary rules for large sets of data (Preview)](#create-summary-rules-in-microsoft-sentinel-for-large-sets-of-data-preview)

### Log Analytics agent retirement

As of August 31, 2024, the [Log Analytics Agent (MMA/OMS) is retired](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/). 

Log collection from many appliances and devices is now supported by the Common Event Format (CEF) via AMA, Syslog via AMA, or Custom Logs via AMA data connector in Microsoft Sentinel. If you've been using the Log Analytics agent in your Microsoft Sentinel deployment, we recommend that you migrate to the Azure Monitor Agent (AMA). 

For more information, see:

- [Find your Microsoft Sentinel data connector](data-connectors-reference.md)
- [Migrate to Azure Monitor Agent from Log Analytics agent](/azure/azure-monitor/agents/azure-monitor-agent-migration)
- [AMA migration for Microsoft Sentinel](ama-migrate.md)
- Blogs:
    - [Revolutionizing log collection with Azure Monitor Agent](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/revolutionizing-log-collection-with-azure-monitor-agent/ba-p/4218129)
    - [The power of Data Collection Rules: Collecting events for advanced use cases in Microsoft USOP](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/the-power-of-data-collection-rules-collecting-events-for/ba-p/4236486)

### Export and import automation rules (Preview)

Manage your Microsoft Sentinel automation rules as code! You can now export your automation rules to Azure Resource Manager (ARM) template files, and import rules from these files, as part of your program to manage and control your Microsoft Sentinel deployments as code. The export action will create a JSON file in your browser's downloads location, that you can then rename, move, and otherwise handle like any other file.

The exported JSON file is workspace-independent, so it can be imported to other workspaces and even other tenants. As code, it can also be version-controlled, updated, and deployed in a managed CI/CD framework.

The file includes all the parameters defined in the automation rule. Rules of any trigger type can be exported to a JSON file.

Learn more about [exporting and importing automation rules](import-export-automation-rules.md).

### Microsoft Sentinel support in Microsoft Defender multitenant management (Preview)

If you've onboarded Microsoft Sentinel to the Microsoft unified security operations platform, Microsoft Sentinel data is now available with Defender XDR data in Microsoft Defender multitenant management. Only one Microsoft Sentinel workspace per tenant is currently supported in the Microsoft unified security operations platform. So, Microsoft Defender multitenant management shows security information and event management (SIEM) data from one Microsoft Sentinel workspace per tenant. For more information, see [Microsoft Defender multitenant management](/defender-xdr/mto-overview) and [Microsoft Sentinel in the Microsoft Defender portal](microsoft-sentinel-defender-portal.md).

### Premium Microsoft Defender Threat Intelligence data connector (Preview)

Your premium license for Microsoft Defender Threat Intelligence (MDTI) now unlocks the ability to ingest all premium indicators directly into your workspace. The premium MDTI data connector adds more to your hunting and research capabilities within Microsoft Sentinel. 

For more information, see [Understand threat intelligence](understand-threat-intelligence.md#add-threat-indicators-to-microsoft-sentinel-with-the-defender-threat-intelligence-data-connector). 

### Unified AMA-based connectors for syslog ingestion

With the impending retirement of the Log Analytics Agent, Microsoft Sentinel has consolidated the collection and ingestion of syslog, CEF, and custom-format log messages into three multi-purpose data connectors based on the Azure Monitor Agent (AMA):
- **Syslog via AMA**, for any device whose logs are ingested into the *Syslog* table in Log Analytics.
- **Common Event Format (CEF) via AMA**, for any device whose logs are ingested into the *CommonSecurityLog* table in Log Analytics.
- **New! Custom Logs via AMA (Preview)**, for any of 15 device types, or any unlisted device, whose logs are ingested into custom tables with names ending in *_CL* in Log Analytics.

These connectors replace nearly all the existing connectors for individual device and appliance types that have existed until now, that were based on either the legacy Log Analytics agent (also known as MMA or OMS) or the current Azure Monitor Agent. The solutions provided in the content hub for all of these devices and appliances now include whichever of these three connectors are appropriate to the solution.* The replaced connectors are now marked as "Deprecated" in the data connector gallery.

The data ingestion graphs that were previously found in each device's connector page can now be found in device-specific workbooks packaged with each device's solution.

\* When installing the solution for any of these applications, devices, or appliances, to ensure that the accompanying data connector is installed, you must select **Install with dependencies** on the solution page, and then mark the data connector on the following page.

For the updated procedures for installing these solutions, see the following articles:
- [CEF via AMA data connector - Configure specific appliance or device for Microsoft Sentinel data ingestion](unified-connector-cef-device.md)
- [Syslog via AMA data connector - Configure specific appliance or device for Microsoft Sentinel data ingestion](unified-connector-syslog-device.md)
- [Custom Logs via AMA data connector - Configure data ingestion to Microsoft Sentinel from specific applications](unified-connector-custom-device.md)

### Better visibility for Windows security events

We've enhanced the schema of the *SecurityEvent* table that hosts Windows Security events, and have added new columns to ensure compatibility with the Azure Monitor Agent (AMA) for Windows (version 1.28.2). These enhancements are designed to increase the visibility and transparency of collected Windows events. If you're not interested in receiving data in these fields, you can apply an ingestion-time transformation ("project-away" for example) to drop them.

### New Auxiliary logs retention plan (Preview)

The new **Auxiliary logs** retention plan for Log Analytics tables allows you to ingest large quantities of high-volume logs with supplemental value for security at a much lower cost. Auxiliary logs are available with interactive retention for 30 days, in which you can run simple, single-table queries on them, such as to summarize and aggregate the data. Following that 30-day period, auxiliary log data goes to long-term retention, which you can define for up to 12 years, at ultra-low cost. This plan also allows you to run search jobs on the data in long-term retention, extracting only the records you want to a new table that you can treat like a regular Log Analytics table, with full query capabilities.

To learn more about Auxiliary logs and compare with Analytics logs, see [Log retention plans in Microsoft Sentinel](log-plans.md).

For more in-depth information about the different log management plans, see [**Table plans**](/azure/azure-monitor/logs/data-platform-logs#table-plans) in the [Azure Monitor Logs overview](/azure/azure-monitor/logs/data-platform-logs) article from the Azure Monitor documentation.

### Create summary rules in Microsoft Sentinel for large sets of data (Preview)

Microsoft Sentinel now provides the ability to create dynamic summaries using [Azure Monitor summary rules](/azure/azure-monitor/logs/summary-rules), which aggregate large sets of data in the background for a smoother security operations experience across all log tiers.

- Access summary rule results via Kusto Query Language (KQL) across detection, investigation, hunting, and reporting activities.
- Run high performance Kusto Query Language (KQL) queries on summarized data.
- Use summary rule results for longer periods in investigations, hunting, and compliance activities.

For more information, see [Aggregate Microsoft Sentinel data with summary rules](summary-rules.md).

## July 2024

- [SOC optimizations now generally available](#soc-optimizations-now-generally-available)
- [SAP Business Technology Platform (BTP) connector now generally available](#sap-business-technology-platform-btp-connector-now-generally-available-ga)
- [Microsoft unified security platform now generally available](#microsoft-unified-security-platform-now-generally-available)

### SOC optimizations now generally available

The SOC optimization experience in both the Azure and Defender portals is now generally available for all Microsoft Sentinel customers, including both data value and threat-based recommendations.

- **Use data value recommendations** to improve your data usage of ingested billable logs, gain visibility to underused logs, and discover the right detections for those logs or the right adjustments to your log tier or ingestion.

- **Use threat-based recommendations** to help identify gaps in coverage against specific attacks based on Microsoft research and mitigate them by ingesting the recommended logs and adding recommended detections.

The [`recommendations`](soc-optimization/soc-optimization-api.md) API is still in Preview. 

For more information, see:

- [Optimize your security operations](soc-optimization/soc-optimization-access.md)
- [SOC optimization reference of recommendations](soc-optimization/soc-optimization-reference.md)

### SAP Business Technology Platform (BTP) connector now generally available (GA)

The Microsoft Sentinel Solution for SAP BTP is now generally available (GA). This solution provides visibility into your SAP BTP environment, and helps you detect and respond to threats and suspicious activities.

For more information, see:

- [Microsoft Sentinel Solution for SAP Business Technology Platform (BTP)](sap/sap-btp-solution-overview.md)
- [Deploy the Microsoft Sentinel solution for SAP BTP](sap/deploy-sap-btp-solution.md)
- [Microsoft Sentinel Solution for SAP BTP: security content reference](sap/sap-btp-security-content.md)

### Microsoft unified security platform now generally available

Microsoft Sentinel is now generally available within the Microsoft unified security operations platform in the Microsoft Defender portal. The Microsoft unified security operations platform brings together the full capabilities of Microsoft Sentinel, Microsoft Defender XDR, and Microsoft Copilot in Microsoft Defender. For more information, see the following resources:

- Blog post: [General availability of the  Microsoft unified security operations platform](https://aka.ms/unified-soc-announcement)
- [Microsoft Sentinel in the Microsoft Defender portal](microsoft-sentinel-defender-portal.md)
- [Connect Microsoft Sentinel to Microsoft Defender XDR](/defender-xdr/microsoft-sentinel-onboard)
- [Microsoft Copilot in Microsoft Defender](/defender-xdr/security-copilot-in-microsoft-365-defender)

## June 2024

- [Codeless Connector Platform now generally available](#codeless-connector-platform-now-generally-available)
- [Advanced threat indicator search capability available](#advanced-threat-indicator-search-capability-available)

### Codeless Connector Platform now generally available

The Codeless Connector Platform (CCP), is now generally available (GA). Check out the [announcement blog post](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/what-s-new-create-your-own-codeless-data-connector/ba-p/4174439).

For more information on the CCP enhancements and capabilities, see [Create a codeless connector for Microsoft Sentinel](create-codeless-connector.md).

### Advanced threat indicator search capability available

Threat intelligence search and filtering capabilities have been enhanced, and the experience now has parity across the Microsoft Sentinel and Microsoft Defender portals. Search supports a maximum of 10 conditions with each containing up to 3 subclauses.

For more information, see the updated screenshot in [View and manage your threat indicators](understand-threat-intelligence.md#view-and-manage-your-threat-indicators).

## Next steps

> [!div class="nextstepaction"]
>[On-board Azure Sentinel](quickstart-onboard.md)

> [!div class="nextstepaction"]
>[Get visibility into alerts](get-visibility.md)
