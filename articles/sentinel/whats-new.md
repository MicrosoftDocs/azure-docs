---
title: What's new in Azure Sentinel
description: This article describes new features in Azure Sentinel from the past few months.
services: sentinel
author: batamig
ms.author: bagol
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: conceptual
ms.date: 07/28/2021
---

# What's new in Azure Sentinel

This article lists recent features added for Azure Sentinel, and new features in related services that provide an enhanced user experience in Azure Sentinel.

If you're looking for items older than six months, you'll find them in the [Archive for What's new in Azure Sentinel](whats-new-archive.md). For information about earlier features delivered, see our [Tech Community blogs](https://techcommunity.microsoft.com/t5/azure-sentinel/bg-p/AzureSentinelBlog/label-name/What's%20New).

> [!IMPORTANT]
> Noted features are currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

> [!TIP]
> Our threat hunting teams across Microsoft contribute queries, playbooks, workbooks, and notebooks to the [Azure Sentinel Community](https://github.com/Azure/Azure-Sentinel), including specific [hunting queries](https://github.com/Azure/Azure-Sentinel) that your teams can adapt and use.
>
> You can also contribute! Join us in the [Azure Sentinel Threat Hunters GitHub community](https://github.com/Azure/Azure-Sentinel/wiki).
>

## August 2021

- [File event normalization schema (Public preview)](#file-event-normalization-schema-public-preview)
- [New in docs: Best practice guidance](#new-in-docs-best-practice-guidance)

### File Event normalization schema (Public preview)

The Azure Sentinel Information Model (ASIM) now supports a File Event normalization schema, which is used to describe file activity, such as creating, modifying, or deleting files or documents. File events are reported by operating systems, file storage systems such as Azure Files, and document management systems such as Microsoft SharePoint.

For more information, see:

- [Azure Sentinel File Event normalization schema reference (Public preview)](file-event-normalization-schema.md)
- [Normalization and the Azure Sentinel Information Model (ASIM)](normalization.md)


### New in docs: Best practice guidance

In response to multiple requests from customers and our support teams, we've added a series of best practice guidance to our documentation.

For more information, see:

- [Prerequisites for deploying Azure Sentinel](prerequisites.md)
- [Best practices for Azure Sentinel](best-practices.md)
- [Azure Sentinel workspace architecture best practices](best-practices-workspace-architecture.md)
- [Design your Azure Sentinel workspace architecture](design-your-workspace-architecture.md)
- [Azure Sentinel sample workspace designs](sample-workspace-designs.md)
- [Data collection best practices](best-practices-data.md)

> [!TIP]
> You can find more guidance added across our documentation in relevant conceptual and how-to articles. For more information, see [Additional best practice references](best-practices.md#additional-best-practice-references).
>

## July 2021

- [Microsoft Threat Intelligence Matching Analytics (Public preview)](#microsoft-threat-intelligence-matching-analytics-public-preview)
- [Use Azure AD data with Azure Sentinel's IdentityInfo table (Public preview)](#use-azure-ad-data-with-azure-sentinels-identityinfo-table-public-preview)
- [Enrich Entities with geolocation data via API (Public preview)](#enrich-entities-with-geolocation-data-via-api-public-preview)
- [Support for ADX cross-resource queries (Public preview)](#support-for-adx-cross-resource-queries-public-preview)
- [Watchlists are in general availability](#watchlists-are-in-general-availability)
- [Support for data residency in more geos](#support-for-data-residency-in-more-geos)
- [Bidirectional sync in Azure Defender connector (Public preview)](#bidirectional-sync-in-azure-defender-connector-public-preview)

### Microsoft Threat Intelligence Matching Analytics (Public preview)

Azure Sentinel now provides the built-in **Microsoft Threat Intelligence Matching Analytics** rule, which matches Microsoft-generated threat intelligence data with your logs. This rule generates high-fidelity alerts and incidents, with appropriate severities based on the context of the logs detected. After a match is detected, the indicator is also published to your Azure Sentinel threat intelligence repository.

The **Microsoft Threat Intelligence Matching Analytics** rule currently matches domain indicators against the following log sources:

- [CEF](connect-common-event-format.md)
- [DNS](connect-dns.md)
- [Syslog](connect-syslog.md)

For more information, see [Detect threats using matching analytics (Public preview)](work-with-threat-indicators.md#detect-threats-using-matching-analytics-public-preview).

### Use Azure AD data with Azure Sentinel's IdentityInfo table (Public preview)

As attackers often use the organization's own user and service accounts, data about those user accounts, including the user identification and privileges, are crucial for the analysts in the process of an investigation.

Now, having [UEBA enabled](enable-entity-behavior-analytics.md) in your Azure Sentinel workspace also synchronizes Azure AD data into the new **IdentityInfo** table in Log Analytics. Synchronizations between your Azure AD and the **IdentifyInfo** table create a snapshot of your user profile data that includes user metadata, group information, and the Azure AD roles assigned to each user.

Use the **IdentityInfo** table during investigations and when fine-tuning analytics rules for your organization to reduce false positives.

For more information, see [IdentityInfo table](ueba-enrichments.md#identityinfo-table-public-preview) in the UEBA enrichments reference and [Use UEBA data to analyze false positives](investigate-with-ueba.md#use-ueba-data-to-analyze-false-positives).

### Enrich entities with geolocation data via API (Public preview)

Azure Sentinel now offers an API to enrich your data with geolocation information. Geolocation data can then be used to analyze and investigate security incidents.

For more information, see [Enrich entities in Azure Sentinel with geolocation data via REST API (Public preview)](geolocation-data-api.md) and [Classify and analyze data using entities in Azure Sentinel](entities-in-azure-sentinel.md).


### Support for ADX cross-resource queries (Public preview)

The hunting experience in Azure Sentinel now supports [ADX cross-resource queries](../azure-monitor/logs/azure-monitor-data-explorer-proxy.md#cross-query-your-log-analytics-or-application-insights-resources-and-azure-data-explorer).
 
Although Log Analytics remains the primary data storage location for performing analysis with Azure Sentinel, there are cases where ADX is required to store data due to cost, retention periods, or other factors. This capability enables customers to hunt over a wider set of data and view the results in the [Azure Sentinel hunting experiences](hunting.md), including hunting queries, [livestream](livestream.md), and the Log Analytics search page.

To query data stored in ADX clusters, use the adx() function to specify the ADX cluster, database name, and desired table. You can then query the output as you would any other table. See more information in the pages linked above.



### Watchlists are in general availability

The [watchlists](watchlists.md) feature is now generally available. Use watchlists to enrich alerts with business data, to create allowlists or blocklists against which to check access events, and to help investigate threats and reduce alert fatigue.

### Support for data residency in more geos

Azure Sentinel now supports full data residency in the following additional geos:

Brazil, Norway, South Africa, Korea, Germany, United Arab Emirates (UAE), and Switzerland.

See the [complete list of supported geos](quickstart-onboard.md#geographical-availability-and-data-residency) for data residency.

### Bidirectional sync in Azure Defender connector (Public preview)

The Azure Defender connector now supports bi-directional syncing of alerts' status between Defender and Azure Sentinel. When you close a Sentinel incident containing a Defender alert, the alert will automatically be closed in the Defender portal as well.

See this [complete description of the updated Azure Defender connector](connect-azure-security-center.md).

## June 2021

- [Upgrades for normalization and the Azure Sentinel Information Model](#upgrades-for-normalization-and-the-azure-sentinel-information-model)
- [Updated service-to-service connectors](#updated-service-to-service-connectors)
- [Export and import analytics rules (Public preview)](#export-and-import-analytics-rules-public-preview)
- [Alert enrichment: alert details (Public preview)](#alert-enrichment-alert-details-public-preview)
- [More help for playbooks!](#more-help-for-playbooks)
- [New documentation reorganization](#new-documentation-reorganization)

### Upgrades for normalization and the Azure Sentinel Information Model

The Azure Sentinel Information Model enables you to use and create source-agnostic content, simplifying your analysis of the data in your Azure Sentinel workspace.

In this month's update, we've enhanced our normalization documentation, providing new levels of detail and full DNS, process event, and authentication normalization schemas.

For more information, see:

- [Normalization and the Azure Sentinel Information Model (ASIM)](normalization.md) (updated)
- [Azure Sentinel Authentication normalization schema reference (Public preview)](authentication-normalization-schema.md) (new!)
- [Azure Sentinel data normalization schema reference](normalization-schema.md)
- [Azure Sentinel DNS normalization schema reference (Public preview)](dns-normalization-schema.md) (new!)
- [Azure Sentinel Process Event normalization schema reference (Public preview)](process-events-normalization-schema.md) (new!)
- [Azure Sentinel Registry Event normalization schema reference (Public preview)](registry-event-normalization-schema.md) (new!)


### Updated service-to-service connectors

Two of our most-used connectors have been the beneficiaries of major upgrades.

- The [Windows security events connector (Public preview)](connect-windows-security-events.md) is now based on the new Azure Monitor Agent (AMA), allowing you far more flexibility in choosing which data to ingest, and giving you maximum visibility at minimum cost.

- The [Azure activity logs connector](connect-azure-activity.md) is now based on the diagnostics settings pipeline, giving you more complete data, greatly reduced ingestion lag, and better performance and reliability.

The upgrades are not automatic. Users of these connectors are encouraged to enable the new versions.

### Export and import analytics rules (Public preview)

You can now export your analytics rules to JSON-format Azure Resource Manager (ARM) template files, and import rules from these files, as part of managing and controlling your Azure Sentinel deployments as code. Any type of [analytics rule](tutorial-detect-threats-built-in.md) - not just **Scheduled** - can be exported to an ARM template. The template file includes all the rule's information, from its query to its assigned MITRE ATT&CK tactics.

For more information, see [Export and import analytics rules to and from ARM templates](import-export-analytics-rules.md).

### Alert enrichment: alert details (Public preview)

In addition to enriching your alert content with entity mapping and custom details, you can now custom-tailor the way alerts - and by extension, incidents - are presented and displayed, based on their particular content. Like the other alert enrichment features, this is configurable in the [analytics rule wizard](tutorial-detect-threats-custom.md).

For more information, see [Customize alert details in Azure Sentinel](customize-alert-details.md).


### More help for playbooks!

Two new documents can help you get started or get more comfortable with creating and working with playbooks.
- [Authenticate playbooks to Azure Sentinel](authenticate-playbooks-to-sentinel.md) helps you understand the different authentication methods by which Logic Apps-based playbooks can connect to and access information in Azure Sentinel, and when it's appropriate to use each one.
- [Use triggers and actions in playbooks](playbook-triggers-actions.md) explains the difference between the **incident trigger** and the **alert trigger** and which to use when, and shows you some of the different actions you can take in playbooks in response to incidents, including how to access the information in [custom details](playbook-triggers-actions.md#work-with-custom-details).

Playbook documentation also explicitly addresses the multi-tenant MSSP scenario.

### New documentation reorganization

This month we've reorganized our [Azure Sentinel documentation](index.yml), restructuring into intuitive categories that follow common customer journeys. Use the filtered docs search and updated landing page to navigate through Azure Sentinel docs.

:::image type="content" source="media/whats-new/new-docs.png" alt-text="New Azure Sentinel documentation reorganization." lightbox="media/whats-new/new-docs.png":::


## May 2021

- [Azure Sentinel PowerShell module](#azure-sentinel-powershell-module)
- [Alert grouping enhancements](#alert-grouping-enhancements)
- [Azure Sentinel solutions (Public preview)](#azure-sentinel-solutions-public-preview)
- [Continuous Threat Monitoring for SAP solution (Public preview)](#continuous-threat-monitoring-for-sap-solution-public-preview)
- [Threat intelligence integrations (Public preview)](#threat-intelligence-integrations-public-preview)
- [Fusion over scheduled alerts (Public preview)](#fusion-over-scheduled-alerts-public-preview)
- [SOC-ML anomalies (Public preview)](#soc-ml-anomalies-public-preview)
- [IP Entity page (Public preview)](#ip-entity-page-public-preview)
- [Activity customization (Public preview)](#activity-customization-public-preview)
- [Hunting dashboard (Public preview)](#hunting-dashboard-public-preview)
- [Incident teams - collaborate in Microsoft Teams (Public preview)](#azure-sentinel-incident-team---collaborate-in-microsoft-teams-public-preview)
- [Zero Trust (TIC3.0) workbook](#zero-trust-tic30-workbook)


### Azure Sentinel PowerShell module

The official Azure Sentinel PowerShell module to automate daily operational tasks has been released as GA!

You can download it here: [PowerShell Gallery](https://www.powershellgallery.com/packages/Az.SecurityInsights/).

For more information, see the PowerShell documentation: [Az.SecurityInsights](/powershell/module/az.securityinsights/)

### Alert grouping enhancements

Now you can configure your analytics rule to group alerts into a single incident, not only when they match a specific entity type, but also when they match a specific alert name, severity, or other custom details for a configured entity. 

In the **Incidents settings** tab of the analytics rule wizard, select to turn on alert grouping, and then select the **Group alerts into a single incident if the selected entity types and details match** option. 

Then, select your entity type and the relevant details you want to match:

:::image type="content" source="media/whats-new/alert-grouping-details.png" alt-text="Group alerts by matching entity details.":::

For more information, see [Alert grouping](tutorial-detect-threats-custom.md#alert-grouping).

### Azure Sentinel solutions (Public preview)

Azure Sentinel now offers **packaged content** [solutions](sentinel-solutions-catalog.md) that include combinations of one or more data connectors, workbooks, analytics rules, playbooks, hunting queries, parsers, watchlists, and other components for Azure Sentinel.

Solutions provide improved in-product discoverability, single-step deployment, and end-to-end product scenarios. For more information, see [Discover and deploy Azure Sentinel solutions](sentinel-solutions-deploy.md).

### Continuous Threat Monitoring for SAP solution (Public preview)

Azure Sentinel solutions now includes **Continuous Threat Monitoring for SAP**, enabling you to monitor SAP systems for sophisticated threats within the business and application layers.

The SAP data connector streams a multitude of 14 application logs from the entire SAP system landscape, and collects logs from both Advanced Business Application Programming (ABAP) via NetWeaver RFC calls and file storage data via OSSAP Control interface. The SAP data connector adds to Azure Sentinels ability to monitor the SAP underlying infrastructure.

To ingest SAP logs into Azure Sentinel, you must have the Azure Sentinel SAP data connector installed on your SAP environment. After the SAP data connector is deployed, deploy the rich SAP solution security content to smoothly gain insight into your organization's SAP environment and improve any related security operation capabilities.

For more information, see [Tutorial: Deploy the Azure Sentinel solution for SAP (public preview)](sap-deploy-solution.md).

### Threat intelligence integrations (Public preview)

Azure Sentinel gives you a few different ways to [use threat intelligence](import-threat-intelligence.md) feeds to enhance your security analysts' ability to detect and prioritize known threats.

You can now use one of many newly available integrated threat intelligence platform (TIP) products, connect to TAXII servers to take advantage of any STIX-compatible threat intelligence source, and make use of any custom solutions that can communicate directly with the [Microsoft Graph Security tiIndicators API](/graph/api/resources/tiindicator).

You can also connect to threat intelligence sources from playbooks, in order to enrich incidents with TI information that can help direct investigation and response actions.

For more information, see [Threat intelligence integration in Azure Sentinel](threat-intelligence-integration.md).

### Fusion over scheduled alerts (Public preview)

The **Fusion** machine-learning correlation engine can now detect multi-stage attacks using alerts generated by a set of [scheduled analytics rules](tutorial-detect-threats-custom.md) in its correlations, in addition to the alerts imported from other data sources.

For more information, see [Advanced multistage attack detection in Azure Sentinel](fusion.md).

### SOC-ML anomalies (Public preview)

Azure Sentinel's SOC-ML machine learning-based anomalies can identify unusual behavior that might otherwise evade detection.

SOC-ML uses analytics rule templates that can be put to work right out of the box. While anomalies don't necessarily indicate malicious or even suspicious behavior by themselves, they can be used to improve the fidelity of detections, investigations, and threat hunting.

For more information, see [Use SOC-ML anomalies to detect threats in Azure Sentinel](soc-ml-anomalies.md).

### IP Entity page (Public preview)

Azure Sentinel now supports the IP address entity, and you can now view IP entity information in the new IP entity page.

Like the user and host entity pages, the IP page includes general information about the IP, a list of activities the IP has been found to be a part of, and more, giving you an ever-richer store of information to enhance your investigation of security incidents.

For more information, see [Entity pages](identify-threats-with-entity-behavior-analytics.md#entity-pages).

### Activity customization (Public preview)

Speaking of entity pages, you can now create new custom-made activities for your entities, that will be tracked and displayed on their respective entity pages alongside the out-of-the-box activities you’ve seen there until now.

For more information, see [Customize activities on entity page timelines](customize-entity-activities.md).

### Hunting dashboard (Public preview)

The **Hunting** blade has gotten a refresh. The new dashboard lets you run all your queries, or a selected subset, in a single click.

Identify where to start hunting by looking at result count, spikes, or the change in result count over a 24-hour period. You can also sort and filter by favorites, data source, MITRE ATT&CK tactic and technique, results, or results delta. View the queries that do not yet have the necessary data sources connected, and get recommendations on how to enable these queries.

For more information, see [Hunt for threats with Azure Sentinel](hunting.md).

### Azure Sentinel incident team - collaborate in Microsoft Teams (public preview)

Azure Sentinel now supports a direct integration with Microsoft Teams, enabling you to collaborate seamlessly across the organization and with external stakeholders.

Directly from the incident in Azure Sentinel, create a new *incident team* to use for central communication and coordination.

Incident teams are especially helpful when used as a dedicated conference bridge for high-severity, ongoing incidents. Organizations that already use Microsoft Teams for communication and collaboration can use the Azure Sentinel integration to bring security data directly into their conversations and daily work.

In Microsoft Teams, the new team's **Incident page** tab always has the most updated and recent data from Azure Sentinel, ensuring that your teams have the most relevant data right at hand.

[ ![Incident page in Microsoft Teams.](media/collaborate-in-microsoft-teams/incident-in-teams.jpg) ](media/collaborate-in-microsoft-teams/incident-in-teams.jpg#lightbox)

For more information, see [Collaborate in Microsoft Teams (Public preview)](collaborate-in-microsoft-teams.md).

### Zero Trust (TIC3.0) workbook

The new, Azure Sentinel Zero Trust (TIC3.0) workbook provides an automated visualization of [Zero Trust](/security/zero-trust/) principles, cross-walked to the [Trusted Internet Connections](https://www.cisa.gov/trusted-internet-connections) (TIC) framework.

We know that compliance isn’t just an annual requirement, and organizations must monitor configurations over time like a muscle. Azure Sentinel's Zero Trust workbook uses the full breadth of Microsoft security offerings across Azure, Office 365, Teams, Intune, Windows Virtual Desktop, and many more.

[ ![Zero Trust workbook.](media/zero-trust-workbook.gif) ](media/zero-trust-workbook.gif#lightbox)

**The Zero Trust workbook**:

- Enables Implementers, SecOps Analysts, Assessors, Security and Compliance Decision Makers, MSSPs, and others to gain situational awareness for cloud workloads' security posture.
- Features over 75 control cards, aligned to the TIC 3.0 security capabilities, with selectable GUI buttons for navigation.
- Is designed to augment staffing through automation, artificial intelligence, machine learning, query/alerting generation, visualizations, tailored recommendations, and respective documentation references.

For more information, see [Visualize and monitor your data](tutorial-monitor-your-data.md).

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

For more information, see [Visualize and monitor your data](tutorial-monitor-your-data.md) and the [Azure Monitor documentation](../azure-monitor/visualize/workbooks-overview.md).

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

For more information, see [Visualize and monitor your data](tutorial-monitor-your-data.md).

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
- [Visualize and monitor your data](tutorial-monitor-your-data.md)


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

For more information, see [Create custom analytics rules to detect threats](tutorial-detect-threats-custom.md).
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

## Next steps

> [!div class="nextstepaction"]
>[On-board Azure Sentinel](quickstart-onboard.md)

> [!div class="nextstepaction"]
>[Get visibility into alerts](quickstart-get-visibility.md)
