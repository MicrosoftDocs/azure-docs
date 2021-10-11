---
title: What's new in Azure Sentinel
description: This article describes new features in Azure Sentinel from the past few months.
services: sentinel
author: batamig
ms.author: bagol
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: conceptual
ms.date: 08/09/2021
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

## October 2021

- [Playbook templates and gallery now available (Public preview)](#playbook-templates-and-gallery-now-available-public-preview)
- [Manage template versions for your scheduled analytics rules (Public preview)](#manage-template-versions-for-your-scheduled-analytics-rules-public-preview)
- [DHCP normalization schema (Public preview)](#dhcp-normalization-schema-public-preview)

### Playbook templates and gallery now available (Public preview)

A playbook template is a pre-built, tested, and ready-to-use workflow that can be customized to meet your needs. Templates can also serve as a reference for best practices when developing playbooks from scratch, or as inspiration for new automation scenarios.

Playbook templates have been developed by the Azure Sentinel community, independent software vendors (ISVs), and Microsoft's own experts, and you can find them in the **Playbook templates** tab (under **Automation**), as part of an [**Azure Sentinel Solution**](sentinel-solutions.md), or in the [**Azure Sentinel GitHub repository**](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks). 

See [Create and customize playbooks from built-in templates](use-playbook-templates.md) for more information about deploying a playbook template from the **Playbook templates** tab under **Automation**.

### Manage template versions for your scheduled analytics rules (Public preview)

When you create analytics rules from [built-in Azure Sentinel rule templates](detect-threats-built-in.md), you effectively create a copy of the template. Past that point, the active rule is ***not*** dynamically updated to match any changes that get made to the originating template.

However, rules created from templates ***do*** remember which templates they came from, which allows you two advantages:

- If you made changes to a rule when creating it from a template (or at any time after that), you can always revert the rule back to its original version (as a copy of the template).

- You can get notified when a template is updated, and you'll have the choice to update your rules to the new version of their templates or leave them as they are.

[Learn how to manage these tasks](manage-analytics-rule-templates.md), and what to keep in mind. These procedures apply to any [Scheduled](detect-threats-built-in.md#scheduled) analytics rules created from templates.

### DHCP normalization schema (Public preview)

The Azure Sentinel Information Model (ASIM) now supports a DHCP normalization schema, which is used to describe events reported by a DHCP server and is used by Azure Sentinel to enable source-agnostic analytics. 

Events described in the DHCP normalization schema include serving requests for DHCP IP address leased from client systems and updating a DNS server with the leases granted.

For more information, see:

- [Azure Sentinel DHCP normalization schema reference (Public preview)](dhcp-normalization-schema.md)
- [Normalization and the Azure Sentinel Information Model (ASIM)](normalization.md)

## September 2021

- [New in docs: scaling data connector documentation](#new-in-docs-scaling-data-connector-documentation)
- [Azure Storage account connector changes](#azure-storage-account-connector-changes)

### New in docs: scaling data connector documentation

As we continue to add more and more built-in data connectors for Azure Sentinel, we've reorganized our data connector documentation to reflect this scaling.

For most data connectors, we've replaced full articles that describe an individual connector with a series of generic procedures and a full reference of all currently supported connectors.

Check the [Azure Sentinel data connectors reference](data-connectors-reference.md) for details about your connector, including references to the relevant generic procedure, as well as extra information and configurations required.

For more information, see:

- **Conceptual information**: [Connect data sources](connect-data-sources.md)

- **Generic how-to articles**:

   - [Connect to Azure, Windows, Microsoft, and Amazon services](connect-azure-windows-microsoft-services.md)
   - [Connect your data source to Azure Sentinel's Data Collector API to ingest data](connect-rest-api-template.md)
   - [Get CEF-formatted logs from your device or appliance into Azure Sentinel](connect-common-event-format.md)
   - [Collect data from Linux-based sources using Syslog](connect-syslog.md)
   - [Collect data in custom log formats to Azure Sentinel with the Log Analytics agent](connect-custom-logs.md)
   - [Use Azure Functions to connect your data source to Azure Sentinel](connect-azure-functions-template.md)
   - [Resources for creating Azure Sentinel custom connectors](create-custom-connector.md)

### Azure Storage account connector changes

Due to some changes made within the Azure Storage account resource configuration itself, the connector also needs to be reconfigured.
The storage account (parent) resource has within it other (child) resources for each type of storage: files, tables, queues, and blobs.

When configuring diagnostics for a storage account, you must select and configure, in turn:
- The parent account resource, exporting the **Transaction** metric.
- Each of the child storage-type resources, exporting all the logs and metrics (see the table above).

You will only see the storage types that you actually have defined resources for.

:::image type="content" source="media/whats-new/storage-diagnostics.png" alt-text="Screenshot of Azure Storage diagnostics configuration.":::

## August 2021

- [Advanced incident search (Public preview)](#advanced-incident-search-public-preview)
- [Fusion detection for Ransomware (Public preview)](#fusion-detection-for-ransomware-public-preview)
- [Watchlist templates for UEBA data](#watchlist-templates-for-ueba-data-public-preview)
- [File event normalization schema (Public preview)](#file-event-normalization-schema-public-preview)
- [New in docs: Best practice guidance](#new-in-docs-best-practice-guidance)

### Advanced incident search (Public preview)

By default, incident searches run across the **Incident ID**, **Title**, **Tags**, **Owner**, and **Product name** values only. Azure Sentinel now provides [advanced search options](investigate-cases.md#search-for-incidents) to search across more data, including alert details, descriptions, entities, tactics, and more.

For example:

:::image type="content" source="media/tutorial-investigate-cases/advanced-search.png" alt-text="Screenshot of the Incidents page advanced search options.":::

For more information, see [Search for incidents](investigate-cases.md#search-for-incidents).

### Fusion detection for Ransomware (Public preview)

Azure Sentinel now provides new Fusion detections for possible Ransomware activities, generating incidents titled as **Multiple alerts possibly related to Ransomware activity detected**.

Incidents are generated for alerts that are possibly associated with Ransomware activities, when they occur during a specific time-frame, and are associated with the Execution and Defense Evasion stages of an attack. You can use the alerts listed in the incident to analyze the techniques possibly used by attackers to compromise a host/device and to evade detection.

Supported data connectors include:

- [Azure Defender (Azure Security Center)](connect-azure-security-center.md)
- [Microsoft Defender for Endpoint](./data-connectors-reference.md#microsoft-defender-for-endpoint)
- [Microsoft Defender for Identity](./data-connectors-reference.md#microsoft-defender-for-identity)
- [Microsoft Cloud App Security](./data-connectors-reference.md#microsoft-cloud-app-security-mcas)
- [Azure Sentinel scheduled analytics rules](detect-threats-built-in.md#scheduled)

For more information, see [Multiple alerts possibly related to Ransomware activity detected](fusion.md#multiple-alerts-possibly-related-to-ransomware-activity-detected-public-preview).

### Watchlist templates for UEBA data (Public preview)

Azure Sentinel now provides built-in watchlist templates for UEBA data, which you can customize for your environment and use during investigations.

After UEBA watchlists are populated with data, you can correlate that data with analytics rules, view it in the entity pages and investigation graphs as insights, create custom uses such as to track VIP or sensitive users, and more.

Watchlist templates currently include:

- **VIP Users**. A list of user accounts of employees that have high impact value in the organization.
- **Terminated Employees**. A list of user accounts of employees that have been, or are about to be, terminated.
- **Service Accounts**. A list of service accounts and their owners.
- **Identity Correlation**. A list of related user accounts that belong to the same person.
- **High Value Assets**. A list of devices, resources, or other assets that have critical value in the organization.
- **Network Mapping**. A list of IP subnets and their respective organizational contexts.

For more information, see [Create a new watchlist using a template](watchlists.md#create-a-new-watchlist-using-a-template-public-preview) and [Built-in watchlist schemas](watchlist-schemas.md).



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
> You can find more guidance added across our documentation in relevant conceptual and how-to articles. For more information, see [Best practice references](best-practices.md#best-practice-references).
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
- [DNS](./data-connectors-reference.md#domain-name-server)
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

- The [Azure activity logs connector](./data-connectors-reference.md#azure-activity) is now based on the diagnostics settings pipeline, giving you more complete data, greatly reduced ingestion lag, and better performance and reliability.

The upgrades are not automatic. Users of these connectors are encouraged to enable the new versions.

### Export and import analytics rules (Public preview)

You can now export your analytics rules to JSON-format Azure Resource Manager (ARM) template files, and import rules from these files, as part of managing and controlling your Azure Sentinel deployments as code. Any type of [analytics rule](detect-threats-built-in.md) - not just **Scheduled** - can be exported to an ARM template. The template file includes all the rule's information, from its query to its assigned MITRE ATT&CK tactics.

For more information, see [Export and import analytics rules to and from ARM templates](import-export-analytics-rules.md).

### Alert enrichment: alert details (Public preview)

In addition to enriching your alert content with entity mapping and custom details, you can now custom-tailor the way alerts - and by extension, incidents - are presented and displayed, based on their particular content. Like the other alert enrichment features, this is configurable in the [analytics rule wizard](detect-threats-custom.md).

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

For more information, see [Alert grouping](detect-threats-custom.md#alert-grouping).

### Azure Sentinel solutions (Public preview)

Azure Sentinel now offers **packaged content** [solutions](sentinel-solutions-catalog.md) that include combinations of one or more data connectors, workbooks, analytics rules, playbooks, hunting queries, parsers, watchlists, and other components for Azure Sentinel.

Solutions provide improved in-product discoverability, single-step deployment, and end-to-end product scenarios. For more information, see [Discover and deploy Azure Sentinel solutions](sentinel-solutions-deploy.md).

### Continuous Threat Monitoring for SAP solution (Public preview)

Azure Sentinel solutions now includes **Continuous Threat Monitoring for SAP**, enabling you to monitor SAP systems for sophisticated threats within the business and application layers.

The SAP data connector streams a multitude of 14 application logs from the entire SAP system landscape, and collects logs from both Advanced Business Application Programming (ABAP) via NetWeaver RFC calls and file storage data via OSSAP Control interface. The SAP data connector adds to Azure Sentinels ability to monitor the SAP underlying infrastructure.

To ingest SAP logs into Azure Sentinel, you must have the Azure Sentinel SAP data connector installed on your SAP environment. After the SAP data connector is deployed, deploy the rich SAP solution security content to smoothly gain insight into your organization's SAP environment and improve any related security operation capabilities.

For more information, see [Tutorial: Deploy the Azure Sentinel solution for SAP (public preview)](sap-deploy-solution.md).

### Threat intelligence integrations (Public preview)

Azure Sentinel gives you a few different ways to [use threat intelligence](./understand-threat-intelligence.md) feeds to enhance your security analysts' ability to detect and prioritize known threats.

You can now use one of many newly available integrated threat intelligence platform (TIP) products, connect to TAXII servers to take advantage of any STIX-compatible threat intelligence source, and make use of any custom solutions that can communicate directly with the [Microsoft Graph Security tiIndicators API](/graph/api/resources/tiindicator).

You can also connect to threat intelligence sources from playbooks, in order to enrich incidents with TI information that can help direct investigation and response actions.

For more information, see [Threat intelligence integration in Azure Sentinel](threat-intelligence-integration.md).

### Fusion over scheduled alerts (Public preview)

The **Fusion** machine-learning correlation engine can now detect multi-stage attacks using alerts generated by a set of [scheduled analytics rules](detect-threats-custom.md) in its correlations, in addition to the alerts imported from other data sources.

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

For more information, see [Visualize and monitor your data](monitor-your-data.md).

## April 2021

- [Azure Policy-based data connectors](#azure-policy-based-data-connectors)
- [Incident timeline (Public preview)](#incident-timeline-public-preview)

### Azure Policy-based data connectors

Azure Policy allows you to apply a common set of diagnostics logs settings to all (current and future) resources of a particular type whose logs you want to ingest into Azure Sentinel.

Continuing our efforts to bring the power of [Azure Policy](../governance/policy/overview.md) to the task of data collection configuration, we are now offering another Azure Policy-enhanced data collector, for [Azure Storage account](./data-connectors-reference.md#azure-storage-account) resources, released to public preview.

Also, two of our in-preview connectors, for [Azure Key Vault](./data-connectors-reference.md#azure-key-vault) and [Azure Kubernetes Service](./data-connectors-reference.md#azure-kubernetes-service-aks), have now been released to general availability (GA), joining our [Azure SQL Databases](./data-connectors-reference.md#azure-sql-databases) connector.

### Incident timeline (Public preview)

The first tab on an incident details page is now the **Timeline**, which shows a timeline of alerts and bookmarks in the incident. An incident's timeline can help you understand the incident better and reconstruct the timeline of attacker activity across the related alerts and bookmarks.

- Select an item in the timeline to see its details, without leaving the incident context
- Filter the timeline content to show alerts or bookmarks only, or items of a specific severity or MITRE tactic.
- You can select the **System alert ID** link to view the entire record or the **Events** link to see the related events in the **Logs** area.

For example:

:::image type="content" source="media/tutorial-investigate-cases/incident-timeline.png" alt-text="Incident timeline tab":::

For more information, see [Tutorial: Investigate incidents with Azure Sentinel](investigate-cases.md).


## Next steps

> [!div class="nextstepaction"]
>[On-board Azure Sentinel](quickstart-onboard.md)

> [!div class="nextstepaction"]
>[Get visibility into alerts](get-visibility.md)
