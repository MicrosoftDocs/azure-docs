---
title: What's new in Azure Sentinel
description: This article describes new features in Azure Sentinel from the past few months.
services: sentinel
author: batamig
ms.author: bagol
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: conceptual
ms.date: 04/08/2021
---

# What's new in Azure Sentinel

This article lists recent features added for Azure Sentinel, and new features in related services that provide an enhanced user experience in Azure Sentinel.

For information about earlier features delivered, see our [Tech Community blogs](https://techcommunity.microsoft.com/t5/azure-sentinel/bg-p/AzureSentinelBlog/label-name/What's%20New).

Noted features are currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.


> [!TIP]
> Our threat hunting teams across Microsoft contribute queries, playbooks, workbooks, and notebooks to the [Azure Sentinel Community](https://github.com/Azure/Azure-Sentinel), including specific [hunting queries](https://github.com/Azure/Azure-Sentinel) that your teams can adapt and use.
>
> You can also contribute! Join us in the [Azure Sentinel Threat Hunters GitHub community](https://github.com/Azure/Azure-Sentinel/wiki).
>

## April 2021

- [Azure Policy-based data connectors](#azure-policy-based-data-connectors)
- [Incident timeline (Public preview)](#incident-timeline-public-preview)

### Azure Policy-based data connectors

Azure Policy allows you to apply a common set of diagnostics logs settings to all (current and future) resources of a particular type whose logs you want to ingest into Azure Sentinel.

Continuing our efforts to bring the power of [Azure Policy](../governance/policy/overview.md) to the task of data collection configuration, we are now offering another Azure Policy-enhanced data collector, for [Azure Storage account](connect-azure-storage-account.md) resources, released to public preview.

Also, two of our in-preview connectors, for [Azure Key Vault](connect-azure-key-vault.md) and [Azure Kubernetes Service](connect-azure-kubernetes-service.md), have now been released to general availability (GA), joining our [Azure SQL Databases](connect-azure-sql-logs.md) connector.

### Incident timeline (Public preview)

The first tab on an incident details page is now the **Timeline**, which shows a timeline of alerts and bookmarks in the incident. An incident's timeline can help you understand the incident better and reconstruct the timeline of attacker activity across the related alerts and bookmarks.

- Select an item in the timeline to see its details, without leaving the incident context
- Filter the timeline content to show alerts or bookmarks only, or items of a specific severity or MITRE tactic.
- You can select the **System alert ID** link to view the entire record or the **Events** link to see the related events in the **Logs** area.

For example:

:::image type="content" source="media/tutorial-investigate-cases/incident-timeline.png" alt-text="Incident timeline tab":::

For more information, see [Tutorial: Investigate incidents with Azure Sentinel](tutorial-investigate-cases.md).

## March 2021

- [Set workbooks to automatically refresh while in view mode](#set-workbooks-to-automatically-refresh-while-in-view-mode)
- [New detections for Azure Firewall](#new-detections-for-azure-firewall)
- [Automation rules and incident-triggered playbooks (Public preview)](#automation-rules-and-incident-triggered-playbooks-public-preview) (including all-new playbook documentation)
- [New alert enrichments: enhanced entity mapping and custom details (Public preview)](#new-alert-enrichments-enhanced-entity-mapping-and-custom-details-public-preview)
- [Print your Azure Sentinel workbooks or save as PDF](#print-your-azure-sentinel-workbooks-or-save-as-pdf)
- [Incident filters and sort preferences now saved in your session (Public preview)](#incident-filters-and-sort-preferences-now-saved-in-your-session-public-preview)
- [Microsoft 365 Defender incident integration (Public preview)](#microsoft-365-defender-incident-integration-public-preview)
- [New Microsoft service connectors using Azure Policy](#new-microsoft-service-connectors-using-azure-policy)

### Set workbooks to automatically refresh while in view mode

Azure Sentinel users can now use the new [Azure Monitor ability](https://techcommunity.microsoft.com/t5/azure-monitor/azure-workbooks-set-it-to-auto-refresh/ba-p/2228555) to automatically refresh workbook data during a view session.

In each workbook or workbook template, select :::image type="icon" source="media/whats-new/auto-refresh-workbook.png" border="false"::: **Auto refresh** to display your interval options. Select the option you want to use for the current view session, and select **Apply**.

- Supported refresh intervals range from **5 minutes** to **1 day**.
- By default, auto refresh is turned off. To optimize performance, auto refresh is also turned off each time you close a workbook, and does not run in the background. Turn auto refresh back on as needed the next time you open the workbook.
- Auto refresh is paused while you're editing a workbook, and auto refresh intervals are restarted each time you switch back to view mode from edit mode.

    Intervals are also restarted if you manually refresh the workbook by selecting the :::image type="icon" source="media/whats-new/manual-refresh-button.png" border="false"::: **Refresh** button.

For more information, see [Tutorial: Visualize and monitor your data](tutorial-monitor-your-data.md) and the [Azure Monitor documentation](../azure-monitor/visualize/workbooks-overview.md).

### New detections for Azure Firewall

Several out-of-the-box detections for Azure Firewall have been added to the [Analytics](import-threat-intelligence.md#analytics-puts-your-threat-indicators-to-work-detecting-potential-threats) area in Azure Sentinel. These new detections allow security teams to get alerts if machines on the internal network attempt to query or connect to internet domain names or IP addresses that are associated with known IOCs, as defined in the detection rule query.

The new detections include:

- [Solorigate Network Beacon](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/Solorigate-Network-Beacon.yaml)
- [Known GALLIUM domains and hashes](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/GalliumIOCs.yaml)
- [Known IRIDIUM IP](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/IridiumIOCs.yaml)
- [Known Phosphorus group domains/IP](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/PHOSPHORUSMarch2019IOCs.yaml)
- [THALLIUM domains included in DCU takedown](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/ThalliumIOCs.yaml)
- [Known ZINC related maldoc hash](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/ZincJan272021IOCs.yaml)
- [Known STRONTIUM group domains](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/STRONTIUMJuly2019IOCs.yaml)
- [NOBELIUM - Domain and IP IOCs - March 2021](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/NOBELIUM_DomainIOCsMarch2021.yaml)


Detections for Azure Firewalls are continuously added to the built-in template gallery. To get the most recent detections for Azure Firewall, under **Rule Templates**, filter the **Data Sources** by **Azure Firewall**:

:::image type="content" source="media/whats-new/new-detections-analytics-efficiency-workbook.jpg" alt-text="New detections in the Analytics efficiency workbook":::

For more information, see [New detections for Azure Firewall in Azure Sentinel](https://techcommunity.microsoft.com/t5/azure-network-security/new-detections-for-azure-firewall-in-azure-sentinel/ba-p/2244958).

### Automation rules and incident-triggered playbooks (Public preview)

Automation rules are a new concept in Azure Sentinel, allowing you to centrally manage the automation of incident handling. Besides letting you assign playbooks to incidents (not just to alerts as before), automation rules also allow you to automate responses for multiple analytics rules at once, automatically tag, assign, or close incidents without the need for playbooks, and control the order of actions that are executed. Automation rules will streamline automation use in Azure Sentinel and will enable you to simplify complex workflows for your incident orchestration processes.

Learn more with this [complete explanation of automation rules](automate-incident-handling-with-automation-rules.md).

As mentioned above, playbooks can now be activated with the incident trigger in addition to the alert trigger. The incident trigger provides your playbooks a bigger set of inputs to work with (since the incident includes all the alert and entity data as well), giving you even more power and flexibility in your response workflows. Incident-triggered playbooks are activated by being called from automation rules.

Learn more about [playbooks' enhanced capabilities](automate-responses-with-playbooks.md), and how to [craft a response workflow](tutorial-respond-threats-playbook.md) using playbooks together with automation rules.

### New alert enrichments: enhanced entity mapping and custom details (Public preview)

Enrich your alerts in two new ways to make them more usable and more informative.

Start by taking your entity mapping to the next level. You can now map almost 20 kinds of entities, from users, hosts, and IP addresses, to files and processes, to mailboxes, Azure resources, and IoT devices. You can also use multiple identifiers for each entity, to strengthen their unique identification. This gives you a much richer data set in your incidents, providing for broader correlation and more powerful investigation. [Learn the new way to map entities](map-data-fields-to-entities.md) in your alerts.

[Read more about entities](entities-in-azure-sentinel.md) and see the [full list of available entities and their identifiers](entities-reference.md).

Give your investigative and response capabilities an even greater boost by customizing your alerts to surface details from your raw events. Bring event content visibility into your incidents, giving you ever greater power and flexibility in responding to and investigating security threats. [Learn how to surface custom details](surface-custom-details-in-alerts.md) in your alerts.



### Print your Azure Sentinel workbooks or save as PDF

Now you can print Azure Sentinel workbooks, which also enables you to export to them to PDFs and save locally or share.

In your workbook, select the options menu > :::image type="icon" source="media/whats-new/print-icon.png" border="false"::: **Print content**. Then select your printer, or select **Save as PDF** as needed.

:::image type="content" source="media/whats-new/print-workbook.png" alt-text="Print your workbook or save as PDF.":::

For more information, see [Tutorial: Visualize and monitor your data](tutorial-monitor-your-data.md).

### Incident filters and sort preferences now saved in your session (Public preview)

Now your incident filters and sorting is saved throughout your Azure Sentinel session, even while navigating to other areas of the product.
As long as you're still in the same session, navigating back to the [Incidents](tutorial-investigate-cases.md) area in Azure Sentinel shows your filters and sorting just as you left it.

> [!NOTE]
> Incident filters and sorting are not saved after leaving Azure Sentinel or refreshing your browser.

### Microsoft 365 Defender incident integration (Public preview)

Azure Sentinel's [Microsoft 365 Defender (M365D)](/microsoft-365/security/mtp/microsoft-threat-protection) incident integration allows you to stream all M365D incidents into Azure Sentinel and keep them synchronized between both portals. Incidents from M365D (formerly known as Microsoft Threat Protection or MTP) include all associated alerts, entities, and relevant information, providing you with enough context to perform triage and preliminary investigation in Azure Sentinel. Once in Sentinel, Incidents will remain bi-directionally synced with M365D, allowing you to take advantage of the benefits of both portals in your incident investigation.

Using both Azure Sentinel and Microsoft 365 Defender together gives you the best of both worlds. You get the breadth of insight that a SIEM gives you across your organization's entire scope of information resources, and also the depth of customized and tailored investigative power that an XDR delivers to protect your Microsoft 365 resources, both of these coordinated and synchronized for seamless SOC operation.

For more information, see [Microsoft 365 Defender integration with Azure Sentinel](microsoft-365-defender-sentinel-integration.md).

### New Microsoft service connectors using Azure Policy

[Azure Policy](../governance/policy/overview.md) is an Azure service which allows you to use policies to enforce and control the properties of a resource. The use of policies ensures that resources stay compliant with your IT governance standards.

Among the properties of resources that can be controlled by policies are the creation and handling of diagnostics and auditing logs. Azure Sentinel now uses Azure Policy to allow you to apply a common set of diagnostics logs settings to all (current and future) resources of a particular type whose logs you want to ingest into Azure Sentinel. Thanks to Azure Policy, you'll no longer have to set diagnostics logs settings resource by resource.

Azure Policy-based connectors are now available for the following Azure services:
- [Azure Key Vault](connect-azure-key-vault.md) (public preview)
- [Azure Kubernetes Service](connect-azure-kubernetes-service.md) (public preview)
- [Azure SQL databases/servers](connect-azure-sql-logs.md) (GA)

Customers will still be able to send the logs manually for specific instances and don’t have to use the policy engine.

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

:::image type="content" source="media/whats-new/cmmc-guide-toggle.gif" alt-text="Toggle the CMMC workbook guide on and off" lightbox="media/whats-new/cmmc-guide-toggle.gif":::


For more information, see:

- [Azure Sentinel Cybersecurity Maturity Model Certification (CMMC) Workbook](https://techcommunity.microsoft.com/t5/public-sector-blog/azure-sentinel-cybersecurity-maturity-model-certification-cmmc/ba-p/2110524)
- [Tutorial: Visualize and monitor your data](tutorial-monitor-your-data.md)


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

For more information, see [Tutorial: Create custom analytics rules to detect threats](tutorial-detect-threats-custom.md).
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

For more information, see [Define the rule query logic and configure settings](tutorial-detect-threats-custom.md#define-the-rule-query-logic-and-configure-settings).

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
>[Get visibility into alerts](quickstart-get-visibility.md)
