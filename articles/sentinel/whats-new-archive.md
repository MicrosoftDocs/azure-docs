---
title: Archive for What's new in Azure Sentinel
description: A description of what's new and changed in Azure Sentinel from six months ago and earlier.
services: sentinel
author: batamig
ms.author: bagol
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: conceptual
ms.date: 06/15/2021
---

# Archive for What's new in Azure Sentinel

The primary [What's new in Azure Sentinel](whats-new.md) release notes page contains updates for the last six months, while this page contains older items.

For information about earlier features delivered, see our [Tech Community blogs](https://techcommunity.microsoft.com/t5/azure-sentinel/bg-p/AzureSentinelBlog/label-name/What's%20New).

Noted features are currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.


> [!TIP]
> Our threat hunting teams across Microsoft contribute queries, playbooks, workbooks, and notebooks to the [Azure Sentinel Community](https://github.com/Azure/Azure-Sentinel), including specific [hunting queries](https://github.com/Azure/Azure-Sentinel) that your teams can adapt and use.
>
> You can also contribute! Join us in the [Azure Sentinel Threat Hunters GitHub community](https://github.com/Azure/Azure-Sentinel/wiki).
>

## February 2021

- [Cybersecurity Maturity Model Certification (CMMC) workbook](#cybersecurity-maturity-model-certification-cmmc-workbook)
- [Third-party data connectors](#third-party-data-connectors)
- [UEBA insights in the entity page (Public preview)](#ueba-insights-in-the-entity-page-public-preview)
- [Improved incident search (Public preview)](#improved-incident-search-public-preview)

### Cybersecurity Maturity Model Certification (CMMC) workbook

The Azure Sentinel CMMC Workbook provides a mechanism for viewing log queries aligned to CMMC controls across the Microsoft portfolio, including Microsoft security offerings, Office 365, Teams, Intune, Windows Virtual Desktop and many more.

The CMMC workbook enables security architects, engineers, security operations analysts, managers, and IT professionals to gain situational awareness visibility for the security posture of cloud workloads. There are also recommendations for selecting, designing, deploying, and configuring Microsoft offerings for alignment with respective CMMC requirements and practices.

Even if you aren’t required to comply with CMMC, the CMMC workbook is helpful in building Security Operations Centers, developing alerts, visualizing threats, and providing situational awareness of workloads.

Access the CMMC workbook in the Azure Sentinel **Workbooks** area. Select **Template**, and then search for **CMMC**.

:::image type="content" source="media/whats-new/cmmc-guide-toggle.gif" alt-text="GIF recording of the C M M C workbook guide toggled on and off." lightbox="media/whats-new/cmmc-guide-toggle.gif":::


For more information, see:

- [Azure Sentinel Cybersecurity Maturity Model Certification (CMMC) Workbook](https://techcommunity.microsoft.com/t5/public-sector-blog/azure-sentinel-cybersecurity-maturity-model-certification-cmmc/ba-p/2110524)
- [Visualize and monitor your data](/azure/sentinel/articles/sentinel/monitor-your-data.md)


### Third-party data connectors

Our collection of third-party integrations continues to grow, with thirty connectors being added in the last two months. Here's a list:

- [Agari Phishing Defense and Brand Protection](connect-agari-phishing-defense.md)
- [Akamai Security Events](connect-akamai-security-events.md)
- [Alsid for Active Directory](connect-alsid-active-directory.md)
- [Apache HTTP Server](connect-apache-http-server.md)
- [Aruba ClearPass](connect-aruba-clearpass.md)
- [Blackberry CylancePROTECT](connect-data-sources.md)
- [Broadcom Symantec DLP](connect-broadcom-symantec-dlp.md)
- [Cisco Firepower eStreamer](connect-data-sources.md)
- [Cisco Meraki](connect-cisco-meraki.md)
- [Cisco Umbrella](connect-cisco-umbrella.md)
- [Cisco Unified Computing System (UCS)](connect-cisco-ucs.md)
- [ESET Enterprise Inspector](connect-data-sources.md)
- [ESET Security Management Center](connect-data-sources.md)
- [Google Workspace (formerly G Suite)](connect-google-workspace.md)
- [Imperva WAF Gateway](connect-imperva-waf-gateway.md)
- [Juniper SRX](connect-juniper-srx.md)
- [Netskope](connect-data-sources.md)
- [NXLog DNS Logs](connect-nxlog-dns.md)
- [NXLog Linux Audit](connect-nxlog-linuxaudit.md)
- [Onapsis Platform](connect-data-sources.md)
- [Proofpoint On Demand Email Security (POD)](connect-proofpoint-pod.md)
- [Qualys Vulnerability Management Knowledge Base](connect-data-sources.md)
- [Salesforce Service Cloud](connect-salesforce-service-cloud.md)
- [SonicWall Firewall](connect-data-sources.md)
- [Sophos Cloud Optix](connect-sophos-cloud-optix.md)
- [Squid Proxy](connect-squid-proxy.md)
- [Symantec Endpoint Protection](connect-data-sources.md)
- [Thycotic Secret Server](connect-thycotic-secret-server.md)
- [Trend Micro XDR](connect-data-sources.md)
- [VMware ESXi](connect-vmware-esxi.md)

### UEBA insights in the entity page (Public preview)

The Azure Sentinel entity details pages provide an [Insights pane](identify-threats-with-entity-behavior-analytics.md#entity-insights), which displays behavioral insights on the entity and help to quickly identify anomalies and security threats.

If you have [UEBA enabled](ueba-enrichments.md), and have selected a timeframe of at least four days, this Insights pane will now also include the following new sections for UEBA insights:

|Section  |Description  |
|---------|---------|
|**UEBA Insights**     | Summarizes anomalous user activities: <br>- Across geographical locations, devices, and environments<br>- Across time and frequency horizons, compared to user's own history <br>- Compared to peers' behavior <br>- Compared to the organization's behavior     |
|**User Peers Based on Security Group Membership**     |   Lists the user's peers based on Azure AD Security Groups membership, providing security operations teams with a list of other users who share similar permissions.  |
|**User Access Permissions to Azure Subscription**     |     Shows the user's access permissions to the Azure subscriptions accessible directly, or via Azure AD groups / service principals.   |
|**Threat Indicators Related to The User**     |  Lists a collection of known threats relating to IP addresses represented in the user’s activities. Threats are listed by threat type and family, and are enriched by Microsoft’s threat intelligence service.       |
|     |         |

### Improved incident search (Public preview)

We've improved the Azure Sentinel incident searching experience, enabling you to navigate faster through incidents as you investigate a specific threat.

When searching for incidents in Azure Sentinel, you're now able to search by the following incident details:

- ID
- Title
- Product
- Owner
- Tag

## January 2021

- [Analytics rule wizard: Improved query editing experience (Public preview)](#analytics-rule-wizard-improved-query-editing-experience-public-preview)
- [Az.SecurityInsights PowerShell module (Public preview)](#azsecurityinsights-powershell-module-public-preview)
- [SQL database connector](#sql-database-connector)
- [Dynamics 365 connector (Public preview)](#dynamics-365-connector-public-preview)
- [Improved incident comments](#improved-incident-comments)
- [Dedicated Log Analytics clusters](#dedicated-log-analytics-clusters)
- [Logic apps managed identities](#logic-apps-managed-identities)
- [Improved rule tuning with the analytics rule preview graphs](#improved-rule-tuning-with-the-analytics-rule-preview-graphs-public-preview)


### Analytics rule wizard: Improved query editing experience (Public preview)

The Azure Sentinel Scheduled analytics rule wizard now provides the following enhancements for writing and editing queries:

-	An expandable editing window, providing you with more screen space to view your query.
-	Key word highlighting in your query code.
-	Expanded autocomplete support.
-	Real-time query validations. Errors in your query now show as a red block in the scroll bar, and as a red dot in the **Set rule logic** tab name. Additionally, a query with errors cannot be saved.

For more information, see [Create custom analytics rules to detect threats](/azure/sentinel/articles/sentinel/detect-threats-custom.md).
### Az.SecurityInsights PowerShell module (Public preview)

Azure Sentinel now supports the new [Az.SecurityInsights](https://www.powershellgallery.com/packages/Az.SecurityInsights/) PowerShell module.

The **Az.SecurityInsights** module supports common Azure Sentinel use cases, like interacting with incidents to change statues, severity, owner, and so on, adding comments and labels to incidents, and creating bookmarks.

Although we recommend using [Azure Resource Manager (ARM)](../azure-resource-manager/templates/index.yml) templates for your CI/CD pipeline, the **Az.SecurityInsights** module is useful for post-deployment tasks, and is targeted for SOC automation.  For example, your SOC automation might include steps to configure data connectors, create analytics rules, or add automation actions to analytics rules.

For more information, including a full list and description of the available cmdlets, parameter descriptions, and examples, see the [Az.SecurityInsights PowerShell documentation](/powershell/module/az.securityinsights/).

### SQL database connector

Azure Sentinel now provides an Azure SQL database connector, which you to stream your databases' auditing and diagnostic logs into Azure Sentinel and continuously monitor activity in all your instances.

Azure SQL is a fully managed, Platform-as-a-Service (PaaS) database engine that handles most database management functions, such as upgrading, patching, backups, and monitoring, without user involvement.

For more information, see [Connect Azure SQL database diagnostics and auditing logs](connect-azure-sql-logs.md).

### Dynamics 365 connector (Public preview)

Azure Sentinel now provides a connector for Microsoft Dynamics 365, which lets you collect your Dynamics 365 applications' user, admin, and support activity logs into Azure Sentinel. You can use this data to help you audit the entirety of data processing actions taking place and analyze it for possible security breaches.

For more information, see [Connect Dynamics 365 activity logs to Azure Sentinel](connect-dynamics-365.md).

### Improved incident comments

Analysts use incident comments to collaborate on incidents, documenting processes and steps manually or as part of a playbook. 

Our improved incident commenting experience enables you to format your comments and edit or delete existing comments.

For more information, see [Automatically create incidents from Microsoft security alerts](create-incidents-from-alerts.md).
### Dedicated Log Analytics clusters

Azure Sentinel now supports dedicated Log Analytics clusters as a deployment option. We recommend considering a dedicated cluster if you:

- **Ingest over 1 Tb per day** into your Azure Sentinel workspace
- **Have multiple Azure Sentinel workspaces** in your Azure enrollment

Dedicated clusters enable you to use features like customer-managed keys, lockbox, double encryption, and faster cross-workspace queries when you have multiple workspaces on the same cluster.

For more information, see [Azure Monitor logs dedicated clusters](../azure-monitor/logs/logs-dedicated-clusters.md).

### Logic apps managed identities

Azure Sentinel now supports managed identities for the Azure Sentinel Logic Apps connector, enabling you to grant permissions directly to a specific playbook to operate on Azure Sentinel instead of creating extra identities.

- **Without a managed identity**, the Logic Apps connector requires a separate identity with an Azure Sentinel RBAC role in order to run on Azure Sentinel. The separate identity can be an Azure AD user or a Service Principal, such as an Azure AD registered application.

- **Turning on managed identity support in your Logic App** registers the Logic App with Azure AD and provides an object ID. Use the object ID in Azure Sentinel to assign the Logic App with an Azure RBAC role in your Azure Sentinel workspace. 

For more information, see:

- [Authenticating with Managed Identity in Azure Logic Apps](../logic-apps/create-managed-service-identity.md)
- [Azure Sentinel Logic Apps connector documentation](/connectors/azuresentinel) 

### Improved rule tuning with the analytics rule preview graphs (Public preview)

Azure Sentinel now helps you better tune your analytics rules, helping you to increase their accuracy and decrease noise.

After editing an analytics rule on the **Set rule logic** tab, find the **Results simulation** area on the right. 

Select **Test with current data** to have Azure Sentinel run a simulation of the last 50 runs of your analytics rule. A graph is generated to show the average number of alerts that the rule would have generated, based on the raw event data evaluated. 

For more information, see [Define the rule query logic and configure settings](/azure/sentinel/articles/sentinel/detect-threats-custom.md#define-the-rule-query-logic-and-configure-settings).

## December 2020

- [80 new built-in hunting queries](#80-new-built-in-hunting-queries)
- [Log Analytics agent improvements](#log-analytics-agent-improvements)

### 80 new built-in hunting queries
 
Azure Sentinel's built-in hunting queries empower SOC analysts to reduce gaps in current detection coverage and ignite new hunting leads.

This update for Azure Sentinel includes new hunting queries that provide coverage across the MITRE ATT&CK framework matrix:

- **Collection**
- **Command and Control**
- **Credential Access**
- **Discovery**
- **Execution**
- **Exfiltration**
- **Impact**
- **Initial Access**
- **Persistence**
- **Privilege Escalation**

The added hunting queries are designed to help you find suspicious activity in your environment. While they may return legitimate activity and potentially malicious activity, they can be useful in guiding your hunting. 

If after running these queries, you are confident with the results, you may want to convert them to analytics rules or add hunting results to existing or new incidents.

All of the added queries are available via the Azure Sentinel Hunting page. For more information, see [Hunt for threats with Azure Sentinel](hunting.md).

### Log Analytics agent improvements

Azure Sentinel users benefit from the following Log Analytics agent improvements:

- **Support for more operating systems**, including CentOS 8, RedHat 8, and SUSE Linux 15.
- **Support for Python 3** in addition to Python 2

Azure Sentinel uses the Log Analytics agent to sent events to your workspace, including Windows Security events, Syslog events, CEF logs, and more.

> [!NOTE]
> The Log Analytics agent is sometimes referred to as the OMS Agent or the Microsoft Monitoring Agent (MMA). 
> 

For more information, see the [Log Analytics documentation](../azure-monitor/agents/log-analytics-agent.md) and the [Log Analytics agent release notes](https://github.com/microsoft/OMS-Agent-for-Linux/releases).
## November 2020

- [Monitor your Playbooks' health in Azure Sentinel](#monitor-your-playbooks-health-in-azure-sentinel)
- [Microsoft 365 Defender connector (Public preview)](#microsoft-365-defender-connector-public-preview)

### Monitor your Playbooks' health in Azure Sentinel

Azure Sentinel playbooks are based on workflows built in [Azure Log Apps](../logic-apps/index.yml), a cloud service that helps you schedule, automate, and orchestrate tasks, business processes, and workflows. Playbooks can be automatically invoked when an incident is created, or when triaging and working with incidents. 

To provide insights into the health, performance, and usage of your playbooks, we've added a [workbook](../azure-monitor/visualize/workbooks-overview.md) named **Playbooks health monitoring**. 

Use the **Playbooks health monitoring** workbook to monitor the health of your playbooks, or look for anomalies in the amount of succeeded or failed runs. 

The **Playbooks health monitoring** workbook is now available in the Azure Sentinel Templates gallery:

:::image type="content" source="media/whats-new/playbook-monitoring-workbook.gif" alt-text="Sample Playbooks health monitoring workbook":::

For more information, see:

- [Logic Apps documentation](../logic-apps/monitor-logic-apps-log-analytics.md#set-up-azure-monitor-logs)

- [Azure Monitor documentation](../azure-monitor/essentials/activity-log.md#send-to-log-analytics-workspace)

### Microsoft 365 Defender connector (Public preview)
 
The Microsoft 365 Defender connector for Azure Sentinel enables you to stream advanced hunting logs (a type of raw event data) from Microsoft 365 Defender into Azure Sentinel. 

With the integration of [Microsoft Defender for Endpoint (MDATP)](/windows/security/threat-protection/) into the [Microsoft 365 Defender](/microsoft-365/security/mtp/microsoft-threat-protection) security umbrella, you can now collect your Microsoft Defender for Endpoint advanced hunting events using the Microsoft 365 Defender connector, and stream them straight into new purpose-built tables in your Azure Sentinel workspace. 

The Azure Sentinel tables are built on the same schema that's used in the Microsoft 365 Defender portal, and provide you with complete access to the full set of advanced hunting logs. 

For more information, see [Connect data from Microsoft 365 Defender to Azure Sentinel](connect-microsoft-365-defender.md).

> [!NOTE]
> Microsoft 365 Defender was formerly known as Microsoft Threat Protection or MTP. Microsoft Defender for Endpoint was formerly known as Microsoft Defender Advanced Threat Protection or MDATP.
> 

## Next steps

> [!div class="nextstepaction"]
>[On-board Azure Sentinel](quickstart-onboard.md)

> [!div class="nextstepaction"]
>[Get visibility into alerts](get-visibility.md)