---
title: What's new in Microsoft Sentinel
description: Learn about the latest new features and announcement in Microsoft Sentinel from the past few months.
author: guywi-ms
ms.author: guywild
ms.topic: concept-article
ms.date: 01/28/2026
#Customer intent: As a security team member, I want to stay updated on the latest features and enhancements in Microsoft Sentinel so that I can effectively manage and optimize my organization's security posture.
ms.custom:
  - build-2025
---

# What's new in Microsoft Sentinel

This article lists recent features added for Microsoft Sentinel, and new features in related services that provide an enhanced user experience in Microsoft Sentinel. For new features related to unified security operations in the Defender portal, see the [What's new for unified security operations?](/unified-secops-platform/whats-new)

The listed features were released in the last six months. For information about earlier features delivered, see our [Tech Community blogs](https://techcommunity.microsoft.com/t5/azure-sentinel/bg-p/AzureSentinelBlog/label-name/What's%20New).

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## January 2026

### Updated date: Microsoft Sentinel in the Azure portal to be retired March 2027 

[!INCLUDE [sentinel-azure-deprecation](includes/sentinel-azure-deprecation.md)]

### UEBA behaviors layer aggregates actionable insights from raw logs in near-real time (Preview)

Microsoft Sentinel introduces a UEBA behaviors layer that transforms high-volume, low-level security logs into clear, human-readable behavioral insights in the Defender portal. This AI-powered capability aggregates and sequences raw events from supported data sources into normalized behaviors that explain "who did what to whom" with MITRE ATT&CK context.

**How behaviors bridge the gap between alerts and raw logs**

While incoming raw logs are noisy, uncorrelated, and difficult to interpret, and alerts call analysts to take action on potential issues, UEBA behaviors summarize behavior patterns - normal or abnormal - ingested from supported data sources. This creates an abstraction layer that optimizes data for investigations, hunting, and detection. For example, instead of analyzing individual AWS CloudTrail events or firewall logs, analysts see a behavior - like "**Inbound remote management session from external address**" - that summarizes multiple raw events and maps them to known tactics, techniques, and procedures (TTPs).

UEBA behaviors:

- **Accelerate investigations**: Enable faster incident response by aggregating and sequencing behaviors, allowing analysts to focus on meaningful actions rather than sifting through thousands of events.
- **Transform noisy telemetry into actionable insights**: Convert fragmented, high-volume logs into clear, human-readable behavioral observations, making it easier to understand security events.
- **Empower all SOC personas**: Enhance workflows for SOC analysts, threat hunters, and detection engineers by providing unified, contextual views and building blocks for detection rules and automation.
- **Ensure explainability**: Map to MITRE ATT&CK tactics, entity roles, and raw logs for traceability and clarity.

UEBA behaviors can be enabled independently from UEBA anomaly detection. 

**Supported data sources during public preview:** AWS CloudTrail, CommonSecurityLog (CyberArk Vault, Palo Alto Threats), and GCPAuditLogs.

For more information, see [Translate raw security logs to behavioral insights using UEBA behaviors in Microsoft Sentinel](../sentinel/entity-behaviors-layer.md).

### Enable UEBA directly from data connector configuration (Preview)

You can now enable UEBA for supported data sources directly from the data connector configuration page, reducing management time and preventing coverage gaps. When you enable new connectors, you can onboard the data source to UEBA without navigating to a separate configuration page.

This integration allows you to see which data sources feed into UEBA and enable that feed directly from the connector configuration.

For more information, see [Connect data sources to Microsoft Sentinel by using data connectors](configure-data-connector.md#enable-user-and-entity-behavior-analytics-ueba-from-supported-connectors).


### New detections for Sentinel solution for SAP BTP

This update expands [detection coverage for SAP BTP](../sentinel/sap/sap-btp-security-content.md#built-in-analytics-rules), strengthening visibility into high‑risk control plane, integration, and identity activities.

- **SAP Integration Suite**: Detects unauthorized changes to integration artifacts, access policies, JDBC data sources, and package imports that could enable data exfiltration or backdoors.
- **SAP Cloud Identity Service**: Monitors user deletions, privilege grants, and SAML/OIDC configuration changes that weaken authentication controls or create persistent access.
- **SAP Build Work Zone**: Identifies mass role deletions and unauthorized access to restricted portal resources.
- **SAP BTP Audit Logging**: Detects audit log ingestion gaps and disruptions that reduce security visibility and enable stealthy activity.

## November 2025

### New Entity Behavior Analytics (UEBA) experiences in the Defender portal (Preview)

Microsoft Sentinel introduces new UEBA experiences in the Defender portal, bringing behavioral insights directly into key analyst workflows. These enhancements help analysts prioritize investigations and apply UEBA context more effectively.

#### Anomaly-focused user investigations

In the Defender portal, users with behavioral anomalies are automatically tagged with **UEBA Anomalies**, helping analysts quickly identify which users to prioritize.

Analysts can view the top three anomalies from the past 30 days in a dedicated Top UEBA anomalies section, available in:

- User side panels accessible from various portal locations.
- The **Overview** tab of user entity pages.

This section also includes direct links to anomaly queries and the Sentinel events timeline, enabling deeper investigation and faster context gathering.

#### Drilldown to user anomalies from incident graphs

Analysts can quickly access all anomalies related to a user by selecting **Go Hunt > All user anomalies** from the incident graph. This built-in query provides immediate UEBA context to support deeper investigation.

#### Enriched advanced hunting and custom detections queries with behavior insights

Advanced hunting and custom detection experiences now include a contextual banner that prompts analysts to join the UEBA Anomalies table to queries that include UEBA data sources.  

All features require UEBA to be enabled and are workspace-scoped to the currently selected workspace.

For more information, see [How UEBA empowers analysts and streamlines workflows](identify-threats-with-entity-behavior-analytics.md#ueba-experiences-in-the-defender-portal-empower-analysts-and-streamline-workflows).

### SAP data connectors

- [Agentless data connector](sap/prerequisites-for-deploying-sap-continuous-threat-monitoring.md) for Sentinel Solution for SAP now generally available. Learn more from our [Tech Community blog](https://techcommunity.microsoft.com/blog/microsoftsentinelblog/microsoft-sentinel-for-sap-agentless-connector-ga/4464490).

- Deprecation: Containerized SAP data connector will be out of support by September 30th 2026. [Migrate to our Agentless SAP data connector](sap/sap-agent-migrate.md) today. All new deployments only have the new agentless connector option which is billed at the same price.

### Call to action: update queries and automation by July 1, 2026 - standardized account entity naming in incidents and alerts

Microsoft Sentinel is updating how it identifies account entities in incidents and alerts. This change introduces a standardized naming logic to improve consistency and reliability across your analytics and automation workflows.

> [!IMPORTANT]
> This change might affect your analytic rules, automation rules, playbooks, workbooks, hunting queries, and custom integrations.

Sentinel will now select the most reliable account identifier using the following priority:

1. **UPN prefix** – the part before “@” in a User Principal Name
   - Example: `john.doe@contoso.com` → `john.doe`

1. **Name** – used if UPN prefix is unavailable
1. **Display Name** – fallback if both above are missing

Update your KQL queries and automation logic to follow the new precedence-aware pattern. Use the [`coalesce()`(/kusto/query/coalesce-function)](/kusto/query/coalesce-function) function to ensure compatibility:

```kql
coalesce(Account.UPNprefix, Account.Name, Account.DisplayName)
```
Test all changes in a nonproduction workspace before rolling out to production.


## October 2025

- [Export STIX threat intelligence objects (Preview)](#export-stix-threat-intelligence-objects-preview)
- [Call to action: update queries and automation by July 1, 2026 - standardized account entity naming in incidents and alerts](#call-to-action-update-queries-and-automation-by-july-1-2026---standardized-account-entity-naming-in-incidents-and-alerts)

### Export STIX threat intelligence objects (Preview)

Microsoft Sentinel now supports exporting STIX threat intelligence objects to other destinations, such as external platforms. If you've ingested threat intelligence to Microsoft Sentinel from an external platform, such as when using the **Threat Intelligence - TAXII** data connector, you can now export threat intelligence back to that platform, enabling bi-directional intelligence sharing. This new support provides direct and secure sharing, reducing the need for manual processes or custom playbooks to distribute threat intelligence.

Exporting TI objects is currently supported for TAXII 2.1-based platforms only. You can access the export feature from both the Defender portal and the Azure portal:

#### [Defender portal](#tab/defender-portal)

:::image type="content" source="media/work-with-threat-indicators/export-defender.png" alt-text="Screenshot of the Export TI option in the Defender portal."  lightbox="media/work-with-threat-indicators/export-defender.png":::

#### [Azure portal](#tab/azure-portal)

:::image type="content" source="media/work-with-threat-indicators/export-azure.png" alt-text="Screenshot of the Export TI option in the Defender portal."  lightbox="media/work-with-threat-indicators/export-azure.png":::

---

For more information, see:

- [Use STIX/TAXII to import and export threat intelligence in Microsoft Sentinel](connect-threat-intelligence-taxii.md)
- [Export threat intelligence](work-with-threat-indicators.md#export-threat-intelligence)


## September 2025

- [Microsoft Sentinel evolves into a SIEM and platform](#microsoft-sentinel-is-evolving-into-a-siem-and-platform)

  Key additions include:

  - [Microsoft Sentinel data lake is now generally available (GA)](#microsoft-sentinel-data-lake-is-now-generally-available-ga)
  - [Microsoft Sentinel graph (Preview)](#microsoft-sentinel-graph-preview)  
  - [Microsoft Sentinel Model Context Protocol (MCP) server (Preview)](#microsoft-sentinel-model-context-protocol-mcp-server-preview)

- [New data sources and enhanced User and Entity Behavior Analytics (UEBA) (Preview)](#new-data-sources-for-enhanced-user-and-entity-behavior-analytics-ueba-preview)

### Microsoft Sentinel is evolving into a SIEM and platform

Security is being reengineered for the AI era, moving beyond static, rule-based controls and post-breach response toward platform-led, machine-speed defense. To address the challenge of fragmented tools, sprawling signals, and legacy architectures that can't match the velocity and scale of modern attacks, Microsoft Sentinel has evolved into both a SIEM and a platform that unifies data for agentic defense. This update reflects architectural enhancements that support AI-driven security operations at scale. For more information, see [What is Microsoft Sentinel?](sentinel-overview.md)

Key additions include Microsoft Sentinel data lake, Microsoft Sentinel graph, and Microsoft Sentinel Model Context Protocol (MCP) server, as described below.

#### Microsoft Sentinel data lake is now generally available (GA)

A scalable, cost-efficient foundation for long-term data retention and multi-modal analytics. Microsoft Sentinel data lake enables organizations to unify security data across sources and run advanced analytics without infrastructure overhead.

For more information, see [Microsoft Sentinel data lake](datalake/sentinel-lake-overview.md).

#### Microsoft Sentinel graph (Preview)

Unified graph analytics for deeper context and threat reasoning. Microsoft Sentinel graph models relationships across users, devices, and activities to support complex threat investigations and pre- and post-breach analysis.

For more information, see [What is Microsoft Sentinel graph? (Preview)](datalake/sentinel-graph-overview.md). 

#### Microsoft Sentinel Model Context Protocol (MCP) server (Preview) 

A hosted interface for building intelligent agents using natural language. Microsoft Sentinel MCP server simplifies agent creation and data exploration by allowing engineers to query and reason over security data without needing schema knowledge.

For more information, see [Model Context Protocol (MCP) overview](datalake/sentinel-mcp-overview.md).

### New data sources for enhanced User and Entity Behavior Analytics (UEBA) (Preview)

Microsoft Sentinel's UEBA empowers SOC teams with AI-powered anomaly detection based on behavioral signals in your tenant. It helps prioritize threats using dynamic baselines, peer comparisons, and enriched entity profiles.

UEBA now supports anomaly detection using six new data sources:

- **Microsoft authentication sources**: 

  These sources provide deeper visibility into identity behavior across your Microsoft environment.

  - **Microsoft Defender XDR device logon events**: Capture logon activity from endpoints, helping identify lateral movement, unusual access patterns, or compromised devices.
  - **Microsoft Entra ID managed identity signin logs**: Track sign-ins by managed identities used in automation, such as scripts and services. This is crucial for spotting silent misuse of service identities.
  - **Microsoft Entra ID service principal signin logs**: Monitor sign-ins by service principals - often used by apps or scripts - to detect anomalies, such as unexpected access or privilege escalation.

- **Third-party cloud and identity management platforms**: 
  
  UEBA now integrates with leading cloud and identity management platforms to enhance detection of identity compromise, privilege misuse, and risky access behaviors across multicloud environments.

  - **AWS CloudTrail login events**: Flag risky login attempts in Amazon Web Services (AWS), such as failed multifactor authentication (MFA) or use of the root account—critical indicators of potential account compromise.
  - **GCP audit logs - Failed IAM access events**: Capture denied access attempts in Google Cloud Platform, helping identify privilege escalation attempts or misconfigured roles.
  - **Okta MFA and authentication security change events**: Surface MFA challenges and changes to authentication policies in Okta—signals that might indicate targeted attacks or identity tampering.

These new sources enhance UEBA's ability to detect threats across Microsoft and hybrid environments based on enriched user, device, and service identity data, enhanced behavioral context, and new cross-platform anomaly detection capabilities. 

To enable the new data sources, you must be onboarded to the Defender portal. 

For more information, see:

- [Microsoft Sentinel's AI-driven UEBA ushers in the next era of behavioral analytics](https://techcommunity.microsoft.com/blog/microsoftsentinelblog/microsoft-sentinel%E2%80%99s-ai-driven-ueba-ushers-in-the-next-era-of-behavioral-analyti/4448390)
- [Advanced threat detection with User and Entity Behavior Analytics (UEBA) in Microsoft Sentinel](./identify-threats-with-entity-behavior-analytics.md)
- [Enable User and Entity Behavior Analytics (UEBA) in Microsoft Sentinel](./enable-entity-behavior-analytics.md)
- [Microsoft Sentinel UEBA reference](ueba-reference.md)
- [UEBA anomalies](./anomalies-reference.md#ueba-anomalies)

## August 2025

- [Edit workbooks directly in the Microsoft Defender portal](#edit-workbooks-directly-in-the-microsoft-defender-portal-preview)

### Edit workbooks directly in the Microsoft Defender portal (Preview)

Now you can create and edit Microsoft Sentinel workbooks directly in the Microsoft Defender portal. This enhancement streamlines your workflow, allows you to manage your workbooks more efficiently, and brings the workbook experience more closely aligned with the experience in the Azure portal.

Microsoft Sentinel workbooks are based on Azure Monitor workbooks, and help you visualize and monitor the data ingested to Microsoft Sentinel. Workbooks add tables and charts with analytics for your logs and queries to the tools already available.

Workbooks are available in the Defender portal under **Microsoft Sentinel > Threat management > Workbooks**. For more information, see [Visualize and monitor your data by using workbooks in Microsoft Sentinel](monitor-your-data.md).

## July 2025

- [Microsoft Sentinel data lake](#microsoft-sentinel-data-lake)
- [Table management and retention settings in the Microsoft Defender portal](#table-management-and-retention-settings-in-the-microsoft-defender-portal)
- [Microsoft Sentinel data lake permissions integrated with Microsoft Defender XDR unified RBAC](#microsoft-sentinel-data-lake-permissions-integrated-with-microsoft-defender-xdr-unified-rbac)
- [For new customers only: Automatic onboarding and redirection to the Microsoft Defender portal](#for-new-customers-only-automatic-onboarding-and-redirection-to-the-microsoft-defender-portal)
- [No limit on the number of workspaces you can onboard to the Defender portal](#no-limit-on-the-number-of-workspaces-you-can-onboard-to-the-defender-portal)
- [Microsoft Sentinel in the Azure portal to be retired July 2026](#microsoft-sentinel-in-the-azure-portal-to-be-retired-july-2026)

### Microsoft Sentinel data lake

Microsoft Sentinel is now enhanced with a modern data lake, purpose-built to streamline data management, reduce costs, and accelerate AI adoption for security operations teams. The new Microsoft Sentinel data lake offers cost-effective, long-term storage, eliminating the need to choose between affordability and robust security. Security teams gain deeper visibility and faster incident resolution, all within the familiar Microsoft Sentinel experience, enriched through seamless integration with advanced data analytics tools.  

Key benefits of the Microsoft Sentinel data lake include:
+Single, open-format data copy for efficient and cost-effective storage
+Separation of storage and compute for greater flexibility
+Support for multiple analytics engines to unlock deeper insights from your security data
+Native integration with Microsoft Sentinel, including the ability to select tiering for log data across analytics and lake tiers
For more information, see 

Explore the data lake using KQL queries, or use the new Microsoft Sentinel data lake notebook for VS Code to visualize and analyze your data.

For more information, see:

- [Microsoft Sentinel data lake](datalake/sentinel-lake-overview.md)
- [KQL and the Microsoft Sentinel data lake (preview)](datalake/kql-overview.md) 
- [Jupyter notebooks and the Microsoft Sentinel data lake (preview)](datalake/notebooks-overview.md)
- [Data lake tech blog](https://aka.ms/datalaketechblog)

### Table management and retention settings in the Microsoft Defender portal

Table management and retention settings are now available in the Microsoft Defender portals. You can view and manage table settings in the Microsoft Defender portal, including retention settings for Microsoft Sentinel and Defender XDR tables, and switch between analytics and data lake tiers.

For more information, see:
+ [Manage data tiers and retention in Microsoft Sentinel](manage-data-overview.md) 
+ [Configure table settings in Microsoft Sentinel](manage-table-tiers-retention.md).

### Microsoft Sentinel data lake permissions integrated with Microsoft Defender XDR unified RBAC

Starting in July 2025, Microsoft Sentinel data lake permissions are provided through Microsoft Defender XDR unified RBAC. Support for unified RBAC is available in addition the support provided by global Microsoft Entra ID roles.

For more information, see:

- [Microsoft Defender XDR Unified role-based access control (RBAC)](/defender-xdr/manage-rbac)
- [Create custom roles with Microsoft Defender XDR Unified RBAC](/defender-xdr/create-custom-rbac-roles)
- [Permissions in Microsoft Defender XDR Unified role-based access control (RBAC)](/defender-xdr/custom-permissions-details)
- [Roles and permissions for the Microsoft Sentinel data lake](/azure/sentinel/roles#roles-and-permissions-for-the-microsoft-sentinel-data-lake)

### For new customers only: Automatic onboarding and redirection to the Microsoft Defender portal

For this update, new Microsoft Sentinel customers are customers who are [onboarding the first workspace in their tenant to Microsoft Sentinel](quickstart-onboard.md) on or after **July 1, 2025**.

Starting **July 1, 2025**, such new customers who have the permissions of a subscription [Owner](/azure/role-based-access-control/built-in-roles#owner) or a [User access administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator), and are also not Azure Lighthouse-delegated users, have their workspaces automatically onboarded to the Defender portal together with onboarding to Microsoft Sentinel. Users of such workspaces, who also aren't Azure Lighthouse-delegated users, see links in Microsoft Sentinel in the Azure portal that redirect them to the Defender portal. Such users use Microsoft Sentinel in the Defender portal only.

:::image type="content" source="media/overview/redirect-no-defender.png" alt-text="Screenshot of redirect links in the Azure portal to the Defender portal.":::

New customers who don't have relevant permissions aren't automatically onboarded to the Defender portal, but they do still see redirection links in the Azure portal, together with prompts to have a user with relevant permissions manually onboard the workspace to the Defender portal.

This change streamlines the onboarding process and ensures that new customers can immediately take advantage of unified security operations capabilities without the extra step of manually onboarding their workspaces.

For more information, see:

- [Onboard Microsoft Sentinel](quickstart-onboard.md)
- [Microsoft Sentinel in the Microsoft Defender portal](microsoft-sentinel-defender-portal.md)
- [Changes for new customers starting July 2025](overview.md#changes-for-new-customers-starting-july-2025)

### No limit on the number of workspaces you can onboard to the Defender portal

There is no longer any limit to the number of workspaces you can onboard to the Defender portal.

Limitations still apply to the number of workspaces you can include in a Log Analytics query, and in the number of workspaces you can or should include in a scheduled analytics rule. 

For more information, see:

- [Connect Microsoft Sentinel to the Microsoft Defender portal](/unified-secops-platform/microsoft-sentinel-onboard?toc=%2Fazure%2Fsentinel%2FTOC.json&bc=%2Fazure%2Fsentinel%2Fbreadcrumb%2Ftoc.json)
- [Multiple Microsoft Sentinel workspaces in the Defender portal](workspaces-defender-portal.md)
- [Extend Microsoft Sentinel across workspaces and tenants](extend-sentinel-across-workspaces-tenants.md)

### Microsoft Sentinel in the Azure portal to be retired July 2026

Microsoft Sentinel is [generally available in the Microsoft Defender portal](microsoft-sentinel-defender-portal.md), including for customers without Microsoft Defender XDR or an E5 license. This means that you can use Microsoft Sentinel in the Defender portal even if you aren't using other Microsoft Defender services.

Starting in **July 2026**, Microsoft Sentinel will be supported in the Defender portal only, and any remaining customers using the Azure portal will be automatically redirected.

If you're currently using Microsoft Sentinel in the Azure portal, we recommend that you start planning your transition to the Defender portal now to ensure a smooth transition and take full advantage of the [unified security operations experience offered by Microsoft Defender](/unified-secops-platform/overview-unified-security).

For more information, see:

- [Microsoft Sentinel in the Microsoft Defender portal](microsoft-sentinel-defender-portal.md)
- [Transition your Microsoft Sentinel environment to the Defender portal](move-to-defender.md)
- [Planning your move to Microsoft Defender portal for all Microsoft Sentinel customers](https://techcommunity.microsoft.com/blog/microsoft-security-blog/planning-your-move-to-microsoft-defender-portal-for-all-microsoft-sentinel-custo/4428613) (blog)


## June 2025

- [Microsoft Sentinel Codeless Connector Platform (CCP) renamed to Codeless Connector Framework (CCF)](#codeless-connector-platform-ccp-renamed-to-codeless-connector-framework-ccf)
- [Consolidated Microsoft Sentinel data connector reference](#consolidated-microsoft-sentinel-data-connector-reference)
- [Summary rule templates now in public preview](#summary-rule-templates-now-in-public-preview)

### Codeless Connector Platform (CCP) renamed to Codeless Connector Framework (CCF)

The Microsoft Sentinel Codeless Connector Platform (CCP) has been renamed to **Codeless Connector Framework (CCF)**. The new name reflects the platform's evolution and avoids confusion with other platform-oriented services, while still providing the same ease of use and flexibility that users have come to expect.

For more information, see [Create a codeless connector for Microsoft Sentinel](create-codeless-connector.md).

### Consolidated Microsoft Sentinel data connector reference

We've consolidated the connector reference documentation, merging the separate connector articles into a single, comprehensive reference table.

You can find the new connector reference at [Microsoft Sentinel data connectors](/azure/sentinel/data-connectors-reference#sentinel-data-connectors).
For more information, see [Create a codeless connector](create-codeless-connector.md) and [Unlock the potential of Microsoft Sentinel's Codeless Connector Framework and do more with Microsoft Sentinel faster](https://techcommunity.microsoft.com/blog/microsoftsentinelblog/exciting-announcements-new-data-connectors-released-using-the-codeless-connector/4421104).

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

For preview, in the Defender portal, connect to one primary workspace and multiple secondary workspaces for Microsoft Sentinel. If you onboard Microsoft Sentinel with Defender XDR, a primary workspace's alerts are correlated with Defender XDR data. So incidents  include alerts from Microsoft Sentinel's primary workspace and Defender XDR. All other onboarded workspaces are considered secondary workspaces. Incidents are created based on the workspace's data and won't include Defender XDR data. 

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
