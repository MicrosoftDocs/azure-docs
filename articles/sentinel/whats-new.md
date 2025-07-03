---
title: What's new in Microsoft Sentinel
description: Learn about the latest new features and announcement in Microsoft Sentinel from the past few months.
author: batamig
ms.author: bagol
ms.topic: concept-article
ms.date: 07/01/2025
#Customer intent: As a security team member, I want to stay updated on the latest features and enhancements in Microsoft Sentinel so that I can effectively manage and optimize my organization's security posture.
ms.custom:
  - build-2025
---

# What's new in Microsoft Sentinel

This article lists recent features added for Microsoft Sentinel, and new features in related services that provide an enhanced user experience in Microsoft Sentinel. For new features related to unified security operations in the Defender portal, see the [What's new for unified security operations?](/unified-secops-platform/whats-new)

The listed features were released in the last six months. For information about earlier features delivered, see our [Tech Community blogs](https://techcommunity.microsoft.com/t5/azure-sentinel/bg-p/AzureSentinelBlog/label-name/What's%20New).

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## July 2025

### Microsoft Sentinel in the Defender portal to be retired July 2026

[!INCLUDE [sentinel-azure-deprecation](includes/sentinel-azure-deprecation.md)]

## June 2025

- [Codeless Connector Platform (CCP) renamed.](#codeless-connector-platform-ccp-renamed-to-codeless-connector-framework-ccf)
- [Connector Documentation consolidation](#connector-documentation-consolidation)
- [Summary rule templates now in public preview](#summary-rule-templates-now-in-public-preview)

### Codeless Connector Platform (CCP) renamed to Codeless Connector Framework (CCF)

The Microsoft Sentinel Codeless Connector Platform (CCP) has been renamed to **Codeless Connector Framework (CCF)**. The new name reflects the platform's evolution and avoids confusion with other platform-orineted services, while still providing the same ease of use and flexibility that users have come to expect.

For more information, see [Create a codeless connector](create-codeless-connector.md) and [Unlock the potential of Microsoft Sentinel’s Codeless Connector Framework and do more with Microsoft Sentinel faster](https://techcommunity.microsoft.com/blog/microsoftsentinelblog/exciting-announcements-new-data-connectors-released-using-the-codeless-connector/4421104).

### Connector documentation consolidation

We have consolidated the connector reference documentation, merging the separate connector articles into a single, comprehensive reference table. You can find the new connector reference at [Microsoft Sentinel data connectors](/azure/sentinel/data-connectors-reference#sentinel-data-connectors). 

Select the connector name to expand the row and see the details.

### Summary rule templates now in public preview

You can now use summary rule templates to deploy pre-built summary rules tailored to common security scenarios. These templates help you aggregate and analyze large datasets efficiently, don't require deep expertise, reduce setup time, and ensure best practices. For more information, see [Aggregate Microsoft Sentinel data with summary rules (Preview)](summary-rules.md#deploy-pre-built-summary-rule-templates).

## May 2025

- [All Microsoft Sentinel use cases generally available in the Defender portal](#all-microsoft-sentinel-use-cases-generally-available-in-the-defender-portal)
- [Unified *IdentityInfo* table](#unified-identityinfo-table)
- [Additions to SOC optimization support (Preview)](#additions-to-soc-optimization-support-preview)

### All Microsoft Sentinel use cases generally available in the Defender portal

All Microsoft Sentinel use cases that are in general availability, including [multitenant](/unified-secops-platform/mto-overview) and [multi-workspace](workspaces-defender-portal.md) capabilities and support for all government and commercial clouds, are now also supported for general availability in the Defender portal.

We recommend that you [onboard your workspaces to the Defender portal](/unified-secops-platform/microsoft-sentinel-onboard?toc=%2Fazure%2Fsentinel%2FTOC.json&bc=%2Fazure%2Fsentinel%2Fbreadcrumb%2Ftoc.json) to take advantage of unified security operations. For more information, see:

For more information, see:

- [The Best of Microsoft Sentinel - now in Microsoft Defender](https://techcommunity.microsoft.com/blog/MicrosoftThreatProtectionBlog/the-best-of-microsoft-sentinel-%E2%80%94-now-in-microsoft-defender/4415822) (blog)
- [Microsoft Sentinel in the Microsoft Defender portal](microsoft-sentinel-defender-portal.md)
- [Transition your Microsoft Sentinel environment to the Defender portal](move-to-defender.md)

### Unified *IdentityInfo* table

Customers of Microsoft Sentinel in the Defender portal who have enabled UEBA can now take advantage of a new version of the **IdentityInfo** table, located in the Defender portal's *Advanced hunting* section, that includes the largest possible set of fields common to both the Defender and Azure portals. This unified table helps enrich your security investigations across the entire Defender portal.

For more information, see [IdentityInfo table](ueba-reference.md#identityinfo-table).

### Additions to SOC optimization support (Preview)

SOC optimization support for:

- **AI MITRE ATT&CK tagging recommendations (Preview)**: Uses artificial intelligence to suggest tagging security detections with MITRE ATT&CK tactics and techniques.
- **Risk-based recommendations (Preview)**: Recommends implementing controls to address coverage gaps linked to use cases that may result in business risks or financial losses, including operational, financial, reputational, compliance, and legal risks. 
 
For more information, see [SOC optimization reference](soc-optimization/soc-optimization-reference.md).

## April 2025

- [Microsoft Sentinel solution for Microsoft Business Apps generally available in the Azure portal](#microsoft-sentinel-solution-for-microsoft-business-apps-generally-available-in-the-azure-portal)
- [Security Copilot generates incident summaries in Microsoft Sentinel in the Azure portal (Preview)](#security-copilot-generates-incident-summaries-in-microsoft-sentinel-in-the-azure-portal-preview)
- [Multi workspace and multitenant support for Microsoft Sentinel in the Defender portal (Preview)](#multi-workspace-and-multitenant-support-for-microsoft-sentinel-in-the-defender-portal-preview)
- [Microsoft Sentinel now ingests all STIX objects and indicators into new threat intelligence tables (Preview)](#microsoft-sentinel-now-ingests-all-stix-objects-and-indicators-into-new-threat-intelligence-tables-preview)
- [SOC optimization support for unused columns (Preview)](#soc-optimization-support-for-unused-columns-preview)

### Microsoft Sentinel solution for Microsoft Business Apps generally available in the Azure portal

The [Microsoft Sentinel solution for Microsoft Business Apps](business-applications/solution-overview.md) is now generally available in the Azure portal.

### Security Copilot generates incident summaries in Microsoft Sentinel in the Azure portal (Preview)

Microsoft Sentinel in the Azure portal now features (in Preview) incident summaries generated by Security Copilot, bringing it in line with the Defender portal. These summaries give your security analysts the up-front information they need to quickly understand, triage, and start investigating developing incidents.

For more information, see [Summarize Microsoft Sentinel incidents with Security Copilot](sentinel-security-copilot-incident-summary.md).

### Multi workspace and multitenant support for Microsoft Sentinel in the Defender portal (Preview)

For preview, in the Defender portal, connect to one primary workspace and multiple secondary workspaces for Microsoft Sentinel. If you onboard Microsoft Sentinel with Defender XDR, a primary workspace's alerts are correlated with Defender XDR data. So incidents  include alerts from Microsoft Sentinel's primary workspace and Defender XDR. All other onboarded workspaces are considered secondary workspaces. Incidents are created based on the workspace’s data and won't include Defender XDR data. 

- If you plan to use Microsoft Sentinel in the Defender portal without Defender XDR, you can manage multiple workspaces. But, the primary workspace doesn't include Defender XDR data and you won't have access to Defender XDR capabilities.
- If you're working with multiple tenants and multiple workspaces per tenant, you can also use Microsoft Defender multitenant management to view incidents and alerts, and to hunt for data in Advanced hunting, across both multiple workspaces and tenants.

For more information, see the following articles:

- [Multiple Microsoft Sentinel workspaces in the Defender portal](workspaces-defender-portal.md)
- [Connect Microsoft Sentinel to the Microsoft Defender portal](/unified-secops-platform/microsoft-sentinel-onboard)
- [Microsoft Defender multitenant management](/unified-secops-platform/mto-overview)
- [View and manage incidents and alerts in Microsoft Defender multitenant management](/unified-secops-platform/mto-incidents-alerts)
- [Advanced hunting in Microsoft Defender multitenant management](/unified-secops-platform/mto-advanced-hunting)

### Microsoft Sentinel now ingests all STIX objects and indicators into new threat intelligence tables (Preview)

Microsoft Sentinel now ingests STIX objects and indicators into the new threat intelligence tables, [ThreatIntelIndicators](/azure/azure-monitor/reference/tables/threatintelligenceindicator) and [ThreatIntelObjects](/azure/azure-monitor/reference/tables/threatintelobjects). The new tables support the new STIX 2.1 schema, which lets you ingest and query various threat intelligence objects, including `identity`, `attack-pattern`, `threat-actor`, and `relationship`. 

Microsoft Sentinel will ingest all threat intelligence into the new `ThreatIntelIndicators` and `ThreatIntelObjects` tables, while continuing to ingest the same data into the legacy `ThreatIntelligenceIndicator` table until July 31, 2025. 

**Be sure to update your custom queries, analytics and detection rules, workbooks, and automation to use the new tables by July 31, 2025.** After this date, Microsoft Sentinel will stop ingesting data to the legacy `ThreatIntelligenceIndicator` table. We're updating all out-of-the-box threat intelligence solutions in Content hub to leverage the new tables. 

For more information, see the following articles:

- [Threat intelligence in Microsoft Sentinel](understand-threat-intelligence.md)
- [Work with STIX objects and indicators to enhance threat intelligence and threat hunting in Microsoft Sentinel (Preview)](work-with-stix-objects-indicators.md)


### SOC optimization support for unused columns (Preview)

To optimize your cost/security value ratio, SOC optimization surfaces hardly used data connectors or tables. SOC optimization now surfaces unused columns in your tables. For more information, see [SOC optimization reference of recommendations](soc-optimization/soc-optimization-reference.md#unused-columns-preview).

## March 2025

- [Agentless connection to SAP now in public preview](#agentless-connection-to-sap-now-in-public-preview)

### Agentless connection to SAP now in public preview

The Microsoft Sentinel agentless data connector for SAP and related security content is now included, as public preview, in the solution for SAP applications. This update also includes the following enhancements for the agentless data connector:

- **Enhanced instructions** in the portal for deploying and configuring the data connector. [External documentation](sap/preparing-sap.md#next-step) is updated to rely on the instructions in the portal.
- **[More data ingested](sap/sap-solution-log-reference.md)**, such as Change Docs logs and User Master data.
- **Optional parameters** to [Customize data connector behavior (optional)](sap/deploy-data-connector-agent-container.md#customize-data-connector-behavior-optional).
- [**A new tool to verify system prerequisites and compatibility**](sap/preparing-sap.md#configure-the-connector-in-microsoft-sentinel-and-in-your-sap-system), recommended both before deploying and when [troubleshooting](sap/sap-deploy-troubleshoot.md#check-for-prerequisites).

For more information, see:

- [Microsoft Sentinel solution for SAP applications: Deployment overview](sap/deployment-overview.md)
- [Microsoft Sentinel solution for SAP applications - functions reference](sap/sap-solution-function-reference.md)
- [Troubleshooting your Microsoft Sentinel solution for SAP applications deployment](sap/sap-deploy-troubleshoot.md)

## January 2025

- [Optimize threat intelligence feeds with ingestion rules](#optimize-threat-intelligence-feeds-with-ingestion-rules)
- [Matching analytics rule now generally available (GA)](#matching-analytics-rule-now-generally-available-ga)
- [Threat intelligence management interface updated](#threat-intelligence-management-interface-has-moved)
- [Unlock advanced hunting with new STIX objects by opting in to new threat intelligence tables](#unlock-advanced-hunting-with-new-stix-objects-by-opting-in-to-new-threat-intelligence-tables)
- [Threat intelligence upload API now supports more STIX objects](#threat-intelligence-upload-api-now-supports-more-stix-objects)
- [Microsoft Defender Threat Intelligence data connectors now generally available (GA)](#microsoft-defender-threat-intelligence-data-connectors-now-generally-available-ga)
- [Bicep file support for repositories (Preview)](#bicep-file-support-for-repositories-preview)
- [SOC optimization updates for unified coverage management](#soc-optimization-updates-for-unified-coverage-management)
- [View granular solution content in the Microsoft Sentinel content hub](#view-granular-solution-content-in-the-microsoft-sentinel-content-hub)

### Optimize threat intelligence feeds with ingestion rules

Optimize threat intelligence feeds by filtering and enhancing objects before they're delivered to your workspace. Ingestion rules update threat intel object attributes, or filter objects out all together. Check out the blog announcement [here](https://techcommunity.microsoft.com/blog/microsoftsentinelblog/introducing-threat-intelligence-ingestion-rules/4379019)!

For more information, see [Understand threat intelligence ingestion rules](understand-threat-intelligence.md#configure-ingestion-rules).

### Matching analytics rule now generally available (GA)

Microsoft provides access to its premium threat intelligence through the Defender Threat Intelligence analytics rule which is now generally available (GA). For more information on how to take advantage of this rule, which generates high-fidelity alerts and incidents, see [Use matching analytics to detect threats](use-matching-analytics-to-detect-threats.md).

### Threat intelligence management interface has moved

Threat intelligence for Microsoft Sentinel in the Defender portal has changed! We've renamed the page **Intel management** and moved it with other threat intelligence workflows. There's no change for customers using Microsoft Sentinel in the Azure experience.

:::image type="content" source="media/whats-new/intel-management-navigation.png" alt-text="Screenshot showing new menu placement for Microsoft Sentinel threat intelligence.":::

Enhancements to threat intelligence capabilities are available for customers using both Microsoft Sentinel experiences. The management interface streamlines the creation and curation of threat intel with these key features:

- Define relationships as you create new STIX objects.
- Curate existing threat intelligence with the new relationship builder.
- Create multiple objects quickly by copying common metadata from a new or existing TI object using a duplication feature.
- Use advanced search to sort and filter your threat intelligence objects without even writing a Log Analytics query.

For more information, see the following articles:
- [New STIX objects in Microsoft Sentinel](https://techcommunity.microsoft.com/blog/microsoftsentinelblog/announcing-public-preview-new-stix-objects-in-microsoft-sentinel/4369164)
- [Understand threat intelligence](understand-threat-intelligence.md#create-and-manage-threat-intelligence)
- [Uncover adversaries with threat intelligence in the Defender portal](/unified-secops-platform/threat-intelligence-overview)

### Unlock advanced hunting with new STIX objects by opting in to new threat intelligence tables

Tables supporting the new STIX object schema aren't available publicly. In order to query threat intelligence for STIX objects with KQL and unlock the hunting model that uses them, request to opt in with [this form](https://forms.office.com/r/903VU5x3hz?origin=lprLink). Ingest your threat intelligence into the new tables, `ThreatIntelIndicators` and `ThreatIntelObjects` alongside with or instead of the current table, `ThreatIntelligenceIndicator`, with this opt-in process.

For more information, see the blog announcement [New STIX objects in Microsoft Sentinel](https://techcommunity.microsoft.com/blog/microsoftsentinelblog/announcing-public-preview-new-stix-objects-in-microsoft-sentinel/4369164).

### Threat intelligence upload API now supports more STIX objects

Make the most of your threat intelligence platforms when you connect them to Microsoft Sentinel with the upload API. Now you can ingest more objects than just indicators, reflecting the varied threat intelligence available. The upload API supports the following STIX objects:

- `indicator`
- `attack-pattern`
- `identity`
- `threat-actor`
- `relationship`

For more information, see the following articles:

- [Connect your threat intelligence platform with the upload API (Preview)](connect-threat-intelligence-upload-api.md)
- [Import threat intelligence to Microsoft Sentinel with the upload API (Preview)](stix-objects-api.md)
- [New STIX objects in Microsoft Sentinel](https://techcommunity.microsoft.com/blog/microsoftsentinelblog/announcing-public-preview-new-stix-objects-in-microsoft-sentinel/4369164)

### Microsoft Defender Threat Intelligence data connectors now generally available (GA)

Both premium and standard Microsoft Defender Threat Intelligence data connectors are now generally available (GA) in content hub. For more information, see the following articles:

- [Explore Defender Threat Intelligence licenses](https://www.microsoft.com/security/business/siem-and-xdr/microsoft-defender-threat-intelligence#areaheading-oc8e7d)
- [Enable the Microsoft Defender Threat Intelligence data connector](connect-mdti-data-connector.md)

### Bicep file support for repositories (Preview)
Use Bicep files alongside or as a replacement of ARM JSON templates in Microsoft Sentinel repositories. Bicep provides an intuitive way to create templates of Azure resources and Microsoft Sentinel content items. Not only is it easier to develop new content items, Bicep makes reviewing and updating content easier for anyone that's a part of the continuous integration and delivery of your Microsoft Sentinel content.

For more information, see [Plan your repository content](ci-cd-custom-content.md#plan-your-repository-content).


### SOC optimization updates for unified coverage management

In workspaces onboarded to the Defender portal, SOC optimizations now support both SIEM and XDR data, with detection coverage from across Microsoft Defender services. 

In the Defender portal, the **SOC optimizations** and **MITRE ATT&CK** pages also now provide extra functionality for threat-based coverage optimizations to help you understand the impact of the recommendations on your environment and help you prioritize which to implement first.

Enhancements include:

|Area | Details|
|-----|--------|
|**SOC optimizations Overview page** | - A **High**, **Medium**, or **Low** score for your current detection coverage. This sort of scoring can help you decide which recommendations to prioritize at a glance. <br><br>- An indication of the number of active Microsoft Defender products (services) out of all available products. This helps you understand whether there's a whole product that you're missing in your environment. |
| **Optimization details side pane**,<br> shown when you drill down to a specific optimization| - Detailed coverage analysis, including the number of user-defined detections, response actions, and products you have active. <br><br>- Detailed spider charts that show your coverage across different threat categories, for both user-defined and out-of-the-box detections. <br><br>- An option to jump to the specific threat scenario in the **MITRE ATT&CK** page instead of viewing MITRE ATT&CK coverage only in the side pane.<br><br>- An option to **View full threat scenario** to drill down to even further details about the security products and detections available to provide security coverage in your environment. |
|**MITRE ATT&CK page** | - A new toggle to view coverage by threat scenario. If you've jumped to the **MITRE ATT&CK** page from either a recommendation details side pane or from the **View full threat scenario** page, the **MITRE ATT&CK** page is pre-filtered for your threat scenario. <br><br>- The technique details pane, shown on the side when you select a specific MITRE ATT&CK technique, now shows the number of active detections out of all available detections for that technique. |

For more information, see [Optimize your security operations](soc-optimization/soc-optimization-access.md) and [Understand security coverage by the MITRE ATT&CK framework](mitre-coverage.md).

### View granular solution content in the Microsoft Sentinel content hub

Now you can view the individual content available in a specific solution directly from the **Content hub**, even before you've installed the solution. This new visibility helps you understand the content available to you, and more easily identify, plan, and install the specific solutions you need.

Expand each solution in the Content hub to view included security content. For example:

:::image type="content" source="media/sentinel-solutions-deploy/solutions-list.png" alt-text="Screenshot of showing granular content.":::

The granular solution content updates also include a generative AI-based search engine that helps you run more robust searches, diving deep into the solution content and returning results for similar terms.

For more information, see [Discover content](sentinel-solutions-deploy.md#discover-content).

## Next steps

> [!div class="nextstepaction"]
>[On-board Azure Sentinel](quickstart-onboard.md)

> [!div class="nextstepaction"]
>[Get visibility into alerts](get-visibility.md)
