---
title: What's new in Microsoft Sentinel
description: Learn about the latest new features and announcement in Microsoft Sentinel from the past few months.
author: batamig
ms.author: bagol
ms.topic: concept-article
ms.date: 05/22/2025

#Customer intent: As a security team member, I want to stay updated on the latest features and enhancements in Microsoft Sentinel so that I can effectively manage and optimize my organization's security posture.

---

# What's new in Microsoft Sentinel

This article lists recent features added for Microsoft Sentinel, and new features in related services that provide an enhanced user experience in Microsoft Sentinel. For new features in Microsoft's unified security operations (SecOps) platform, see the [unified SecOps platform documentation](/unified-secops-platform/whats-new).

The listed features were released in the last three months. For information about earlier features delivered, see our [Tech Community blogs](https://techcommunity.microsoft.com/t5/azure-sentinel/bg-p/AzureSentinelBlog/label-name/What's%20New).

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## June 2025

- [Summary rule templates now in public preview](#summary-rule-templates-now-in-public-preview)

### Summary rule templates now in public preview

You can now use summary rule templates to deploy pre-built summary rules tailored to common security scenarios. These templates help you aggregate and analyze large datasets efficiently, don't require deep expertise, reduce setup time, and ensure best practices. For more information, see [Aggregate Microsoft Sentinel data with summary rules (Preview)](summary-rules.md#use-summary-rule-templates).

## May 2025

- [All Microsoft Sentinel use cases generally available in the Defender portal](#all-microsoft-sentinel-use-cases-generally-available-in-the-defender-portal)
- [Unified *IdentityInfo* table](#unified-identityinfo-table)
- [Additions to SOC optimization support (Preview)](#additions-to-soc-optimization-support-preview)

### All Microsoft Sentinel use cases generally available in the Defender portal

All Microsoft Sentinel use cases that are in general availability, including [multi-tenant](/unified-secops-platform/mto-overview) and [multi-workspace](workspaces-defender-portal.md) capabilities and support for all government and commercial clouds, are now also supported for general availability in the Defender portal.

We recommend that you [onboard your workspaces to the Defender portal](/unified-secops-platform/microsoft-sentinel-onboard?toc=%2Fazure%2Fsentinel%2FTOC.json&bc=%2Fazure%2Fsentinel%2Fbreadcrumb%2Ftoc.json) to take advantage of unified security operations. For more information, see:

For more information, see:

- [The Best of Microsoft Sentinel - now in Microsoft Defender](https://techcommunity.microsoft.com/blog/MicrosoftThreatProtectionBlog/the-best-of-microsoft-sentinel-%E2%80%94-now-in-microsoft-defender/4415822) (blog)
- [Microsoft Sentinel in the Microsoft Defender portal](microsoft-sentinel-defender-portal.md)
- [Transition your Microsoft Sentinel environment to the Defender portal](move-to-defender.md)

### Unified *IdentityInfo* table

Customers of Microsoft Sentinel in the Defender portal who have enabled UEBA can now take advantage of a new version of the IdentityInfo table, located in the Defender portal's *Advanced hunting* section, that includes the largest possible set of fields common to both the Defender and Azure portals. This unified table helps enrich your security investigations across the entire unified SecOps experience.

For more information, see [IdentityInfo table](ueba-reference.md#identityinfo-table).

### Additions to SOC optimization support (Preview)

SOC optimization support for:

- **AI MITRE ATT&CK tagging recommendations (Preview)**: Uses artificial intelligence to suggest tagging security detections with MITRE ATT&CK tactics and techniques.
- **Risk-based recommendations (Preview)**: Recommends implementing controls to address coverage gaps linked to use cases that may result in business risks or financial losses, including operational, financial, reputational, compliance, and legal risks. 
 
For more information, see [SOC optimization reference](soc-optimization/soc-optimization-reference.md).

## April 2025

- [Security Copilot generates incident summaries in Microsoft Sentinel in the Azure portal (Preview)](#security-copilot-generates-incident-summaries-in-microsoft-sentinel-in-the-azure-portal-preview)
- [Multi workspace and multitenant support for Microsoft Sentinel in the Defender portal (Preview)](#multi-workspace-and-multitenant-support-for-microsoft-sentinel-in-the-defender-portal-preview)
- [Microsoft Sentinel now ingests all STIX objects and indicators into new threat intelligence tables (Preview)](#microsoft-sentinel-now-ingests-all-stix-objects-and-indicators-into-new-threat-intelligence-tables-preview)
- [SOC optimization support for unused columns (Preview)](#soc-optimization-support-for-unused-columns-preview)

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
- [Uncover adversaries with threat intelligence in Microsoft's unified SecOps platform](/unified-secops-platform/threat-intelligence-overview)

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

In workspaces enabled for unified security operations, SOC optimizations now support both SIEM and XDR data, with detection coverage from across Microsoft Defender services. 

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

## December 2024

- [New SOC optimization recommendation based on similar organizations (Preview)](#new-soc-optimization-recommendation-based-on-similar-organizations-preview)
- [Agentless deployment for SAP applications (Limited preview)](#agentless-deployment-for-sap-applications-limited-preview)
- [Microsoft Sentinel workbooks now available to view directly in the Microsoft Defender portal](#microsoft-sentinel-workbooks-now-available-to-view-directly-in-the-microsoft-defender-portal)
- [Unified Microsoft Sentinel solution for Microsoft Business Apps](#unified-microsoft-sentinel-solution-for-microsoft-business-apps)
- [New documentation library for Microsoft's unified security operations platform](#new-documentation-library-for-microsofts-unified-security-operations-platform)
- [New S3-based data connector for Amazon Web Services WAF logs (Preview)](#new-s3-based-data-connector-for-amazon-web-services-waf-logs-preview)

### New SOC optimization recommendation based on similar organizations (Preview)

SOC optimization now includes new recommendations for adding data sources to your workspace based on the security posture of other customers in similar industries and sectors as you, and with similar data ingestion patterns. Add the recommended data sources to improve security coverage for your organization.

For more information, see [SOC optimization reference of recommendations](soc-optimization/soc-optimization-reference.md).

### Agentless deployment for SAP applications (Limited preview)

The Microsoft Sentinel solution for SAP applications now supports an agentless deployment, using SAP's own cloud platform features to provide simplified, agentless deployment and connectivity. Instead of deploying a virtual machine and containerized agent, use the SAP Cloud Connector and its existing connections to back-end ABAP systems to connect your SAP system to Microsoft Sentinel.

The **Agentless solution** uses the SAP Cloud Connector and SAP Integration Suite, which are already familiar to most SAP customers. This significantly reduces deployment times, especially for those less familiar with Docker, Kubernetes, and Linux administration. By using the SAP Cloud Connector, the solution profits from already existing setups and established integration processes. This means you don't have to tackle network challenges again, as the people running your SAP Cloud Connector have already gone through that process.

The **Agentless solution** is compatible with SAP S/4HANA Cloud, Private Edition RISE with SAP, SAP S/4HANA on-premises, and SAP ERP Central Component (ECC), ensuring continued functionality of existing security content, including detections, workbooks, and playbooks.

> [!IMPORTANT]
> Microsoft Sentinel's **Agentless solution** is in limited preview as a prereleased product, which may be substantially modified before it's commercially released. Microsoft makes no warranties expressed or implied, with respect to the information provided here. Access to the **Agentless solution** also requires registration and is only available to approved customers and partners during the preview period. 

For more information, see:

- [Microsoft Sentinel for SAP goes agentless](https://community.sap.com/t5/enterprise-resource-planning-blogs-by-members/microsoft-sentinel-for-sap-goes-agentless/ba-p/13960238)
- [Sign up for the limited preview](https://aka.ms/SentinelSAPAgentlessSignUp)
- [Microsoft Sentinel solution for SAP applications: Deployment overview](sap/deployment-overview.md)

### Microsoft Sentinel workbooks now available to view directly in the Microsoft Defender portal

Microsoft Sentinel workbooks are now available for viewing directly in the Microsoft Defender portal for unified security operations (SecOps). Now, in the Defender portal, when you select **Microsoft Sentinel > Threat management> Workbooks**, you remain in the Defender portal instead of a new tab being opened for workbooks in the Azure portal. Continue tabbing out to the Azure portal only when you need to edit your workbooks.

Microsoft Sentinel workbooks are based on Azure Monitor workbooks, and help you visualize and monitor the data ingested to Microsoft Sentinel. Workbooks add tables and charts with analytics for your logs and queries to the tools already available.

For more information, see [Visualize and monitor your data by using workbooks in Microsoft Sentinel](monitor-your-data.md) and [Connect Microsoft Sentinel to Microsoft Defender XDR](/defender-xdr/microsoft-sentinel-onboard).

### Unified Microsoft Sentinel solution for Microsoft Business Apps

Microsoft Sentinel now provides a unified solution for Microsoft Power Platform, Microsoft Dynamics 365 Customer Engagement, and Microsoft Dynamics 365 Finance and Operations. The solution includes data connectors and security content for all platforms.

The updated solution removes the **Dynamics 365 CE Apps** and the **Dynamics 365 Finance and Operations** solutions from the Microsoft Sentinel **Content hub**. Existing customers will see that these solutions are renamed to the **Microsoft Business Applications** solution.

The updated solution also removes the Power Platform Inventory data connector. While the Power Platform Inventory data connector continues to be supported on workspaces where it's already deployed, it isn't available for new deployments in other workspaces.

For more information, see:

- [What is the Microsoft Sentinel solution for Microsoft Business Apps?](business-applications/solution-overview.md)

- Microsoft Power Platform and Microsoft Dynamics 365 Customer Engagement:

    - [Connect Microsoft Power Platform and Microsoft Dynamics 365 Customer Engagement to Microsoft Sentinel](business-applications/deploy-power-platform-solution.md)
    - [Security content reference for Microsoft Power Platform and Microsoft Dynamics 365 Customer Engagement](business-applications/power-platform-solution-security-content.md)

- Microsoft Dynamics 365 Finance and Operations:

    - [Deploy Microsoft Sentinel solution for Dynamics 365 Finance and Operations](dynamics-365/deploy-dynamics-365-finance-operations-solution.md)
    - [Security content reference for Dynamics 365 Finance and Operations](dynamics-365/dynamics-365-finance-operations-security-content.md)

### New documentation library for Microsoft's unified security operations platform

Find centralized documentation about [Microsoft's unified SecOps platform in the Microsoft Defender portal](/unified-secops-platform/overview-unified-security). Microsoft's unified SecOps platform brings together the full capabilities of Microsoft Sentinel, Microsoft Defender XDR, Microsoft Security Exposure Management, and generative AI into the Defender portal. Learn about the features and functionality available with Microsoft's unified SecOps platform, then start to plan your deployment.

### New S3-based data connector for Amazon Web Services WAF logs (Preview)

Ingest logs from Amazon Web Services' web application firewall (WAF) with Microsoft Sentinel's new S3-based connector. This connector features, for the first time, a quick and easy automated setup, making use of AWS CloudFormation templates for resource creation. Send your AWS WAF logs to an S3 bucket, where our data connector retrieves and ingests them.

For more details and setup instructions, see [Connect Microsoft Sentinel to Amazon Web Services to ingest AWS WAF logs](connect-aws-s3-waf.md).

## November 2024

- [Microsoft Sentinel availability in Microsoft Defender portal](#microsoft-sentinel-availability-in-microsoft-defender-portal)

### Microsoft Sentinel availability in Microsoft Defender portal

We previously announced Microsoft Sentinel is generally available within Microsoft's unified security operations platform in the Microsoft Defender portal.

Now, **in preview**, Microsoft Sentinel is available in the Defender portal even without Microsoft Defender XDR or a Microsoft 365 E5 license. For more information, see:

 - [Microsoft Sentinel in the Microsoft Defender portal](microsoft-sentinel-defender-portal.md)
 - [Connect Microsoft Sentinel to the Microsoft Defender portal](/defender-xdr/microsoft-sentinel-onboard)

## October 2024

- [Updates for the Microsoft Sentinel solution for Microsoft Power Platform](#updates-for-the-microsoft-sentinel-solution-for-microsoft-power-platform)

### Updates for the Microsoft Sentinel solution for Microsoft Power Platform

Starting on October 17, 2024, audit logging data for Power Apps, Power Platform DLP, and Power Platform Connectors is routed to the `PowerPlatformAdminActivity` table instead of the `PowerAppsActivity`, `PowerPlatformDlpActivity` and `PowerPlatformConnectorActivity` tables.

Security content in the Microsoft Sentinel solution for Microsoft Power Platform is updated with the new table and schemas for the Power Apps, Power Platform DLP, and Power Platform Connectors. We recommend that you update the Power Platform solution in your workspace to the latest version and apply the updated analytics rule templates to benefit from the changes. For more information, see [Install or update content](sentinel-solutions-deploy.md#install-or-update-content).

Customers using deprecated data connectors for Power Apps, Power Platform DLP, and Power Platform Connectors can safely disconnect and remove these connectors from their Microsoft Sentinel workspace. All associated data flows are ingested using Power Platform Admin Activity connector.

For more information, see [Message center](https://portal.office.com/adminportal/home?#/MessageCenter/:/messages/MC912045).
- [Microsoft Sentinel availability in Microsoft Defender portal](#microsoft-sentinel-availability-in-microsoft-defender-portal)

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

Microsoft Sentinel's [Google Cloud Platform (GCP) data connectors](connect-google-cloud-platform.md), based on our [Codeless Connector Platform (CCP)](create-codeless-connector.md), are now **generally available**. With these connectors, you can ingest logs from your GCP environment using the GCP [Pub/Sub capability](https://cloud.google.com/pubsub/docs/overview):

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

For more information, see [Understand threat intelligence](understand-threat-intelligence.md#add-threat-intelligence-to-microsoft-sentinel-with-the-defender-threat-intelligence-data-connector). 

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

## Next steps

> [!div class="nextstepaction"]
>[On-board Azure Sentinel](quickstart-onboard.md)

> [!div class="nextstepaction"]
>[Get visibility into alerts](get-visibility.md)
