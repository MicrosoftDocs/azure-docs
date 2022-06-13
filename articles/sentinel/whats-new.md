---
title: What's new in Microsoft Sentinel
description: This article describes new features in Microsoft Sentinel from the past few months.
author: yelevin
ms.author: yelevin
ms.topic: conceptual
ms.date: 03/01/2022
ms.custom: ignite-fall-2021
---

# What's new in Microsoft Sentinel

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

This article lists recent features added for Microsoft Sentinel, and new features in related services that provide an enhanced user experience in Microsoft Sentinel.

If you're looking for items older than six months, you'll find them in the [Archive for What's new in Sentinel](whats-new-archive.md). For information about earlier features delivered, see our [Tech Community blogs](https://techcommunity.microsoft.com/t5/azure-sentinel/bg-p/AzureSentinelBlog/label-name/What's%20New).

> [!IMPORTANT]
> Noted features are currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

> [!TIP]
> Our threat hunting teams across Microsoft contribute queries, playbooks, workbooks, and notebooks to the [Microsoft Sentinel Community](https://github.com/Azure/Azure-Sentinel), including specific [hunting queries](https://github.com/Azure/Azure-Sentinel) that your teams can adapt and use.
>
> You can also contribute! Join us in the [Microsoft Sentinel Threat Hunters GitHub community](https://github.com/Azure/Azure-Sentinel/wiki).

## May 2022

- [Relate alerts to incidents](#relate-alerts-to-incidents-preview)
- [Similar incidents](#similar-incidents-preview)

### Relate alerts to incidents (Preview)

You can now add alerts to, or remove alerts from, existing incidents, either manually or automatically, as part of your investigation processes. This allows you to refine the incident scope as the investigation unfolds. For example, relate Microsoft Defender for Cloud alerts, or alerts from third-party products, to incidents synchronized from Microsoft 365 Defender. Use this feature from the investigation graph, the API, or through automation playbooks.

Learn more about [relating alerts to incidents](relate-alerts-to-incidents.md).

### Similar incidents (Preview)

When triaging or investigating an incident, the context of the entirety of incidents in your SOC can be extremely useful. For example, other incidents involving the same entities can represent useful context that will allow you to reach the right decision faster. Now there's a new tab in the incident page that lists other incidents that are similar to the incident you are investigating. Some common use cases for using similar incidents are:

- Finding other incidents that might be part of a larger attack story.
- Using a similar incident as a reference for incident handling. The way the previous incident was handled can act as a guide for handling the current one.
- Finding relevant people in your SOC that have handled similar incidents for guidance or consult.

Learn more about [similar incidents](investigate-cases.md#similar-incidents-preview).

## March 2022

- [Automation rules now generally available](#automation-rules-now-generally-available)
- [Create a large watchlist from file in Azure Storage (public preview)](#create-a-large-watchlist-from-file-in-azure-storage-public-preview)

### Automation rules now generally available

Automation rules are now generally available (GA) in Microsoft Sentinel.

[Automation rules](automate-incident-handling-with-automation-rules.md) allow users to centrally manage the automation of incident handling. They allow you to assign playbooks to incidents, automate responses for multiple analytics rules at once, automatically tag, assign, or close incidents without the need for playbooks, and control the order of actions that are executed. Automation rules streamline automation use in Microsoft Sentinel and enable you to simplify complex workflows for your incident orchestration processes.

### Create a large watchlist from file in Azure Storage (public preview)

Create a watchlist from a large file that's up to 500 MB in size by uploading the file to your Azure Storage account. When you add the watchlist to your workspace, you provide a shared access signature URL. Microsoft Sentinel uses the shared access signature URL to retrieve the watchlist data from Azure Storage.

For more information, see:

- [Use watchlists in Microsoft Sentinel](watchlists.md)
- [Create watchlists in Microsoft Sentinel](watchlists-create.md)

## February 2022

- [New custom log ingestion and data transformation at ingestion time (Public preview)](#new-custom-log-ingestion-and-data-transformation-at-ingestion-time-public-preview)
- [View MITRE support coverage (Public preview)](#view-mitre-support-coverage-public-preview)
- [View Microsoft Purview data in Microsoft Sentinel (Public preview)](#view-microsoft-purview-data-in-microsoft-sentinel-public-preview)
- [Manually run playbooks based on the incident trigger (Public preview)](#manually-run-playbooks-based-on-the-incident-trigger-public-preview)
- [Search across long time spans in large datasets (public preview)](#search-across-long-time-spans-in-large-datasets-public-preview)
- [Restore archived logs from search (public preview)](#restore-archived-logs-from-search-public-preview)

### New custom log ingestion and data transformation at ingestion time (Public preview)

Microsoft Sentinel supports two new features for data ingestion and transformation. These features, provided by Log Analytics, act on your data even before it's stored in your workspace.

The first of these features is the [**custom logs API**](../azure-monitor/logs/custom-logs-overview.md). It allows you to send custom-format logs from any data source to your Log Analytics workspace, and store those logs either in certain specific standard tables, or in custom-formatted tables that you create. The actual ingestion of these logs can be done by direct API calls. You use Log Analytics [**data collection rules (DCRs)**](../azure-monitor/essentials/data-collection-rule-overview.md) to define and configure these workflows.

The second feature is [**ingestion-time data transformation**](../azure-monitor/logs/ingestion-time-transformations.md) for standard logs. It uses [**DCRs**](../azure-monitor/essentials/data-collection-rule-overview.md) to filter out irrelevant data, to enrich or tag your data, or to hide sensitive or personal information. Data transformation can be configured at ingestion time for the following types of built-in data connectors:

- AMA-based data connectors (based on the new Azure Monitor Agent)
- MMA-based data connectors (based on the legacy Log Analytics Agent)
- Data connectors that use Diagnostic settings
- Service-to-service data connectors

For more information, see:

- [Find your Microsoft Sentinel data connector](data-connectors-reference.md)
- [Data transformation in Microsoft Sentinel (preview)](data-transformation.md)
- [Configure ingestion-time data transformation for Microsoft Sentinel (preview)](configure-data-transformation.md).

### View MITRE support coverage (Public preview)

Microsoft Sentinel now provides a new **MITRE** page, which highlights the MITRE tactic and technique coverage you currently have, and can configure, for your organization.

Select items from the **Active** and **Simulated** menus at the top of the page to view the detections currently active in your workspace, and the simulated detections available for you to configure.

For example:

:::image type="content" source="media/whats-new/mitre-coverage.png" alt-text="Screenshot of the MITRE coverage page with both active and simulated indicators selected.":::

For more information, see [Understand security coverage by the MITRE ATT&CK® framework](mitre-coverage.md).

### View Microsoft Purview data in Microsoft Sentinel (Public Preview)

Microsoft Sentinel now integrates directly with Microsoft Purview by providing an out-of-the-box solution.

The Microsoft Purview solution includes the Microsoft Purview data connector, related analytics rule templates, and a workbook that you can use to visualize sensitivity data detected by Microsoft Purview, together with other data ingested in Microsoft Sentinel.

:::image type="content" source="media/purview-solution/purview-workbook.png" alt-text="Screenshot of the Microsoft Purview workbook in Microsoft Sentinel.":::

For more information, see [Tutorial: Integrate Microsoft Sentinel and Microsoft Purview](purview-solution.md).

### Manually run playbooks based on the incident trigger (Public preview)

While full automation is the best solution for many incident-handling, investigation, and mitigation tasks, there may often be cases where you would prefer your analysts have more human input and control over the situation. Also, you may want your SOC engineers to be able to test the playbooks they write before fully deploying them in automation rules.

For these and other reasons, Microsoft Sentinel now allows you to [**run playbooks manually on-demand for incidents**](automate-responses-with-playbooks.md#run-a-playbook-manually) as well as alerts.

Learn more about [running incident-trigger playbooks manually](tutorial-respond-threats-playbook.md#run-a-playbook-manually-on-an-incident).

### Search across long time spans in large datasets (public preview)

Use a search job when you start an investigation to find specific events in logs within a given time frame. You can search all your logs, filter through them, and look for events that match your criteria.

Search jobs are asynchronous queries that fetch records. The results are returned to a search table that's created in your Log Analytics workspace after you start the search job. The search job uses parallel processing to run the search across long time spans, in extremely large datasets. So search jobs don't impact the workspace's performance or availability.

Use search to find events in any of the following log types:

- [Analytics logs](../azure-monitor/logs/data-platform-logs.md)
- [Basic logs (preview)](../azure-monitor/logs/basic-logs-configure.md)

You can also search analytics or basic log data stored in [archived logs (preview)](../azure-monitor/logs/data-retention-archive.md).

For more information, see:

- [Start an investigation by searching large datasets (preview)](investigate-large-datasets.md)
- [Search across long time spans in large datasets (preview)](search-jobs.md)

For information about billing for basic logs or log data stored in archived logs, see [Plan costs for Microsoft Sentinel](billing.md#understand-the-full-billing-model-for-microsoft-sentinel).

### Restore archived logs from search (public preview)

When you need to do a full investigation on data stored in archived logs, restore a table from the **Search** page in Microsoft Sentinel. Specify a target table and time range for the data you want to restore. Within a few minutes, the log data is restored and available within the Log Analytics workspace. Then you can use the data in high-performance queries that support full KQL.

For more information, see:

- [Start an investigation by searching large datasets (preview)](investigate-large-datasets.md)
- [Restore archived logs from search (preview)](restore.md)

## January 2022

- [Support for MITRE ATT&CK techniques (Public preview)](#support-for-mitre-attck-techniques-public-preview)
- [Codeless data connectors (Public preview)](#codeless-data-connectors-public-preview)
- [Maturity Model for Event Log Management (M-21-31) Solution (Public preview)](#maturity-model-for-event-log-management-m-21-31-solution-public-preview)
- [SentinelHealth data table (Public preview)](#sentinelhealth-data-table-public-preview)
- [More workspaces supported for Multiple Workspace View](#more-workspaces-supported-for-multiple-workspace-view)
- [Kusto Query Language workbook and tutorial](#kusto-query-language-workbook-and-tutorial)

### Support for MITRE ATT&CK techniques (Public preview)

In addition to supporting MITRE ATT&CK tactics, your entire Microsoft Sentinel user flow now also supports MITRE ATT&CK techniques.

When creating or editing [analytics rules](detect-threats-custom.md), map the rule to one or more specific tactics *and* techniques. When searching for rules on the **Analytics** page, filter by tactic and technique to narrow your search results.

:::image type="content" source="media/whats-new/mitre-in-analytics-rules.png" alt-text="Screenshot of MITRE technique and tactic filtering." lightbox="media/whats-new/mitre-in-analytics-rules.png":::

Check for mapped tactics and techniques throughout Microsoft Sentinel, in:

- **[Incidents](investigate-cases.md)**. Incidents created from alerts that are detected by rules mapped to MITRE ATT&CK tactics and techniques automatically inherit the rule's tactic and technique mapping.

- **[Bookmarks](bookmarks.md)**. Bookmarks that capture results from hunting queries mapped to MITRE ATT&CK tactics and techniques automatically inherit the query's mapping.

#### MITRE ATT&CK framework version upgrade

We also upgraded the MITRE ATT&CK support throughout Microsoft Sentinel to use the MITRE ATT&CK framework *version 9*. This update includes support for the following new tactics:

**Replacing the deprecated *PreAttack* tactic**:

- [Reconnaissance](https://attack.mitre.org/versions/v9/tactics/TA0043/)
- [Resource Development](https://attack.mitre.org/versions/v9/tactics/TA0042/)

**Industrial Control System (ICS) tactics**:

- [Impair Process Control](https://collaborate.mitre.org/attackics/index.php/Impair_Process_Control)
- [Inhibit Response Function](https://collaborate.mitre.org/attackics/index.php/Inhibit_Response_Function)

### Codeless data connectors (Public preview)

Partners, advanced users, and developers can now use the new Codeless Connector Platform (CCP) to create custom connectors, connect their data sources, and ingest data to Microsoft Sentinel.

The Codeless Connector Platform (CCP) provides support for new data connectors via ARM templates, API, or via a solution in the Microsoft Sentinel [content hub](sentinel-solutions.md).

Connectors created using CCP are fully SaaS, without any requirements for service installations, and also include [health monitoring](monitor-data-connector-health.md) and full support from Microsoft Sentinel.

For more information, see [Create a codeless connector for Microsoft Sentinel](create-codeless-connector.md).

### Maturity Model for Event Log Management (M-21-31) Solution (Public preview)

The Microsoft Sentinel content hub now includes the **Maturity Model for Event Log Management (M-21-31)** solution, which integrates Microsoft Sentinel and Microsoft Defender for Cloud to provide an industry differentiator for meeting challenging requirements in regulated industries.

The Maturity Model for Event Log Management (M-21-31) solution provides a quantifiable framework to measure maturity. Use the analytics rules, hunting queries, playbooks, and workbook provided with the solution to do any of the following:

- Design and build log management architectures
- Monitor and alert on log health issues, coverage, and blind spots
- Respond to notifications with Security Orchestration Automation & Response (SOAR) activities
- Remediate with Cloud Security Posture Management (CSPM)

For more information, see:

- [Modernize Log Management with the Maturity Model for Event Log Management (M-21-31) Solution](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/modernize-log-management-with-the-maturity-model-for-event-log/ba-p/3072842) (blog)
- [Centrally discover and deploy Microsoft Sentinel out-of-the-box content and solutions](sentinel-solutions-deploy.md)
- [The Microsoft Sentinel content hub catalog](sentinel-solutions-catalog.md#domain-solutions)

### SentinelHealth data table (Public preview)

Microsoft Sentinel now provides the **SentinelHealth** data table to help you monitor your connector health, providing insights on health drifts, such as latest failure events per connector, or connectors with changes from success to failure states. Use this data to create alerts and other automated actions, such as Microsoft Teams messages, new tickets in a ticketing system, and so on.

Turn on the Microsoft Sentinel health feature for your workspace in order to have the **SentinelHealth** data table created at the next success or failure event generated for supported data connectors.

For more information, see [Use the SentinelHealth data table (Public preview)](monitor-data-connector-health.md#use-the-sentinelhealth-data-table-public-preview).

### More workspaces supported for Multiple Workspace View

Now, instead of being limited to 10 workspaces in Microsoft Sentinel's [Multiple Workspace View](multiple-workspace-view.md), you can view data from up to 30 workspaces simultaneously.

While we often recommend a single-workspace environment, some use cases require multiple use cases, such as for Managed Security Service Providers (MSSPs) and their customers. **Multiple Workspace View** lets you see and work with security incidents across several workspaces at the same time, even across tenants, allowing you to maintain full visibility and control of your organization’s security responsiveness.

For more information, see:

- [Use multiple Microsoft Sentinel workspaces](extend-sentinel-across-workspaces-tenants.md#the-need-to-use-multiple-microsoft-sentinel-workspaces)
- [Work with incidents in many workspaces at once](multiple-workspace-view.md)
- [Manage multiple tenants in Microsoft Sentinel as an MSSP](multiple-tenants-service-providers.md)

### Kusto Query Language workbook and tutorial

Kusto Query Language is used in Microsoft Sentinel to search, analyze, and visualize data, as the basis for detection rules, workbooks, hunting, and more.

The new **Advanced KQL for Microsoft Sentinel** interactive workbook is designed to help you improve your Kusto Query Language proficiency by taking a use case-driven approach based on:

- Grouping Kusto Query Language operators / commands by category for easy navigation.
- Listing the possible tasks a user would perform with Kusto Query Language in Microsoft Sentinel. Each task includes operators used, sample queries, and use cases.
- Compiling a list of existing content found in Microsoft Sentinel (analytics rules, hunting queries, workbooks and so on) to provide additional references specific to the operators you want to learn.
- Allowing you to execute sample queries on-the-fly, within your own environment or in "LA Demo" - a public [Log Analytics demo environment](https://aka.ms/lademo). Try the sample Kusto Query Language statements in real time without the need to navigate away from the workbook.

Accompanying the new workbook is an explanatory [blog post](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/advanced-kql-framework-workbook-empowering-you-to-become-kql/ba-p/3033766), as well as a new [introduction to Kusto Query Language](kusto-overview.md) and a [collection of learning and skilling resources](kusto-resources.md) in the Microsoft Sentinel documentation.

## December 2021

- [Apache Log4j Vulnerability Detection solution](#apache-log4j-vulnerability-detection-solution-public-preview)
- [IoT OT Threat Monitoring with Defender for IoT solution](#iot-ot-threat-monitoring-with-defender-for-iot-solution-public-preview)
- [Continuous Threat Monitoring for GitHub solution](#ingest-github-logs-into-your-microsoft-sentinel-workspace-public-preview)


### Apache Log4j Vulnerability Detection solution

Remote code execution vulnerabilities related to Apache Log4j were disclosed on 9 December 2021. The vulnerability allows for unauthenticated remote code execution, and it's triggered when a specially crafted string, provided by the attacker through a variety of different input vectors, is parsed and processed by the Log4j 2 vulnerable component.

The [Apache Log4J Vulnerability Detection](sentinel-solutions-catalog.md#domain-solutions) solution was added to the Microsoft Sentinel content hub to help customers monitor, detect, and investigate signals related to the exploitation of this vulnerability, using Microsoft Sentinel.

For more information, see the [Microsoft Security Response Center blog](https://msrc-blog.microsoft.com/2021/12/11/microsofts-response-to-cve-2021-44228-apache-log4j2/) and [Centrally discover and deploy Microsoft Sentinel out-of-the-box content and solutions](sentinel-solutions-deploy.md).

### IoT OT Threat Monitoring with Defender for IoT solution (Public preview)

The new **IoT OT Threat Monitoring with Defender for IoT** solution available in the [Microsoft Sentinel content hub](sentinel-solutions-catalog.md#microsoft) provides further support for the Microsoft Sentinel integration with Microsoft Defender for IoT, bridging gaps between IT and OT security challenges, and empowering SOC teams with enhanced abilities to efficiently and effectively detect and respond to OT threats.

For more information, see [Tutorial: Integrate Microsoft Sentinel and Microsoft Defender for IoT](iot-solution.md).


### Ingest GitHub logs into your Microsoft Sentinel workspace (Public preview)

Use the new [Continuous Threat Monitoring for GitHub](sentinel-solutions-catalog.md#github) solution and [data connector](data-connectors-reference.md#github-preview) to ingest your GitHub logs into your Microsoft Sentinel workspace.

The **Continuous Threat Monitoring for GitHub** solution includes a data connector, relevant analytics rules, and a workbook that you can use to visualize your log data.

For example, view the number of users that were added or removed from GitHub repositories, how many repositories were created, forked, or cloned, in the selected time frame.

> [!NOTE]
> The **Continuous Threat Monitoring for GitHub** solution is supported for GitHub enterprise licenses only.
>

For more information, see [Centrally discover and deploy Microsoft Sentinel out-of-the-box content and solutions (Public preview)](sentinel-solutions-deploy.md) and [instructions](data-connectors-reference.md#github-preview) for installing the GitHub data connector.

### Apache Log4j Vulnerability Detection solution (Public preview)

Remote code execution vulnerabilities related to Apache Log4j were disclosed on 9 December 2021. The vulnerability allows for unauthenticated remote code execution, and it's triggered when a specially crafted string, provided by the attacker through a variety of different input vectors, is parsed and processed by the Log4j 2 vulnerable component. 

The [Apache Log4J Vulnerability Detection](sentinel-solutions-catalog.md#domain-solutions) solution was added to the Microsoft Sentinel content hub to help customers monitor, detect, and investigate signals related to the exploitation of this vulnerability, using Microsoft Sentinel.

For more information, see the [Microsoft Security Response Center blog](https://msrc-blog.microsoft.com/2021/12/11/microsofts-response-to-cve-2021-44228-apache-log4j2/) and [Centrally discover and deploy Microsoft Sentinel out-of-the-box content and solutions](sentinel-solutions-deploy.md).

## November 2021

- [Incident advanced search now available in GA](#incident-advanced-search-now-available-in-ga)
- [Amazon Web Services S3 connector now available (Public preview)](#amazon-web-services-s3-connector-now-available-public-preview)
- [Windows Forwarded Events connector now available (Public preview)](#windows-forwarded-events-connector-now-available-public-preview)
- [Near-real-time (NRT) threat detection rules now available (Public preview)](#near-real-time-nrt-threat-detection-rules-now-available-public-preview)
- [Fusion engine now detects emerging and unknown threats (Public preview)](#fusion-engine-now-detects-emerging-and-unknown-threats-public-preview)
- [Fine-tuning recommendations for your analytics rules (Public preview)](#get-fine-tuning-recommendations-for-your-analytics-rules-public-preview)
- [Free trial updates](#free-trial-updates)
- [Content hub and new solutions (Public preview)](#content-hub-and-new-solutions-public-preview)
- [Continuous deployment from your content repositories (Public preview)](#enable-continuous-deployment-from-your-content-repositories-public-preview)
- [Enriched threat intelligence with Geolocation and WhoIs data (Public preview)](#enriched-threat-intelligence-with-geolocation-and-whois-data-public-preview)
- [Use notebooks with Azure Synapse Analytics in Microsoft Sentinel (Public preview)](#use-notebooks-with-azure-synapse-analytics-in-microsoft-sentinel-public-preview)
- [Enhanced Notebooks area in Microsoft Sentinel](#enhanced-notebooks-area-in-microsoft-sentinel)
- [Microsoft Sentinel renaming](#microsoft-sentinel-renaming)
- [Deploy and monitor Azure Key Vault honeytokens with Microsoft Sentinel](#deploy-and-monitor-azure-key-vault-honeytokens-with-microsoft-sentinel)

### Incident advanced search now available in GA

Searching for incidents using the advanced search functionality is now generally available.

The advanced incident search provides the ability to search across more data, including alert details, descriptions, entities, tactics, and more.

For more information, see [Search for incidents](investigate-cases.md#search-for-incidents).

### Amazon Web Services S3 connector now available (Public preview)

You can now connect Microsoft Sentinel to your Amazon Web Services (AWS) S3 storage bucket, in order to ingest logs from a variety of AWS services.

For now, you can use this connection to ingest VPC Flow Logs and GuardDuty findings, as well as AWS CloudTrail.

For more information, see [Connect Microsoft Sentinel to S3 Buckets to get Amazon Web Services (AWS) data](connect-aws.md).

### Windows Forwarded Events connector now available (Public preview)

You can now stream event logs from Windows Servers connected to your Microsoft Sentinel workspace using Windows Event Collection / Windows Event Forwarding (WEC / WEF), thanks to this new data connector. The connector uses the new Azure Monitor Agent (AMA), which provides a number of advantages over the legacy Log Analytics agent (also known as the MMA):

- **Scalability:** If you've enabled Windows Event Collection (WEC), you can install the Azure Monitor Agent (AMA) on the WEC machine to collect logs from many servers with a single connection point.

- **Speed:** The AMA can send data at an improved rate of 5 K EPS, allowing for faster data refresh.

- **Efficiency:** The AMA allows you to design complex Data Collection Rules (DCR) to filter the logs at their source, choosing the exact events to stream to your workspace. DCRs help lower your network traffic and your ingestion costs by leaving out undesired events.

- **Coverage:** WEC / WEF enables the collection of Windows Event logs from legacy (on-premises and physical) servers and also from high-usage or sensitive machines, such as domain controllers, where installing an agent is undesired.

We recommend using this connector with the [Microsoft Sentinel Information Model (ASIM)](normalization.md) parsers installed to ensure full support for data normalization.

Learn more about the [Windows Forwarded Events connector](data-connectors-reference.md#windows-forwarded-events-preview).

### Near-real-time (NRT) threat detection rules now available (Public preview)

When you're faced with security threats, time and speed are of the essence. You need to be aware of threats as they materialize so you can analyze and respond quickly to contain them. Microsoft Sentinel's near-real-time (NRT) analytics rules offer you faster threat detection - closer to that of an on-premises SIEM - and the ability to shorten response times in specific scenarios.

Microsoft Sentinel’s [near-real-time analytics rules](detect-threats-built-in.md#nrt) provide up-to-the-minute threat detection out-of-the-box. This type of rule was designed to be highly responsive by running its query at intervals just one minute apart.

Learn more about [NRT rules](near-real-time-rules.md) and [how to use them](create-nrt-rules.md).

### Fusion engine now detects emerging and unknown threats (Public preview)

In addition to detecting attacks based on [predefined scenarios](fusion-scenario-reference.md), Microsoft Sentinel's ML-powered Fusion engine can help you find the emerging and unknown threats in your environment by applying extended ML analysis and by correlating a broader scope of anomalous signals, while keeping the alert fatigue low.

The Fusion engine's ML algorithms constantly learn from existing attacks and apply analysis based on how security analysts think. It can therefore discover previously undetected threats from millions of anomalous behaviors across the kill-chain throughout your environment, which helps you stay one step ahead of the attackers.

Learn more about [Fusion for emerging threats](fusion.md#fusion-for-emerging-threats).

Also, the [Fusion analytics rule is now more configurable](configure-fusion-rules.md), reflecting its increased functionality.

### Get fine-tuning recommendations for your analytics rules (Public preview)

Fine-tuning threat detection rules in your SIEM can be a difficult, delicate, and continuous process of balancing between maximizing your threat detection coverage and minimizing false positive rates. Microsoft Sentinel simplifies and streamlines this process by using machine learning to analyze billions of signals from your data sources as well as your responses to incidents over time, deducing patterns and providing you with actionable recommendations and insights that can significantly lower your tuning overhead and allow you to focus on detecting and responding to actual threats.

[Tuning recommendations and insights](detection-tuning.md) are now built in to your analytics rules.

### Free trial updates

Microsoft Sentinel's free trial continues to support new or existing Log Analytics workspaces at no additional cost for the first 31 days.

We're evolving our free trial experience to include the following updates:

- **New Log Analytics workspaces** can ingest up to 10 GB / day of log data for the first 31-days at no cost. New workspaces include workspaces that are less than three days old.

   Both Log Analytics data ingestion and Microsoft Sentinel charges are waived during the 31-day trial period. This free trial is subject to a 20-workspace limit per Azure tenant.

- **Existing Log Analytics workspaces** can enable Microsoft Sentinel at no additional cost. Existing workspaces include any workspaces created more than three days ago.

   Only the Microsoft Sentinel charges are waived during the 31-day trial period.

Usage beyond these limits will be charged per the pricing listed on the [Microsoft Sentinel pricing](https://azure.microsoft.com/pricing/details/azure-sentinel) page. Charges related to additional capabilities for [automation](automation.md) and [bring your own machine learning](bring-your-own-ml.md) are still applicable during the free trial.

> [!TIP]
> During your free trial, find resources for cost management, training, and more on the **News & guides > Free trial** tab in Microsoft Sentinel. This tab also displays details about the dates of your free trial, and how many days you've left until it expires.
>

For more information, see [Plan and manage costs for Microsoft Sentinel](billing.md).

### Content hub and new solutions (Public preview)

Microsoft Sentinel now provides a **Content hub**, a centralized location to find and deploy Microsoft Sentinel out-of-the-box (built-in) content and solutions to your Microsoft Sentinel workspace. Find the content you need by filtering for content type, support models, categories and more, or use the powerful text search.

Under **Content management**, select **Content hub**. Select a solution to view more details on the right, and then click **Install** to install it in your workspace.

:::image type="content" source="media/whats-new/solutions-list.png" alt-text="Screenshot of the new Microsoft Sentinel content hub." lightbox="media/whats-new/solutions-list.png":::

The following list includes highlights of new, out-of-the-box solutions added to the Content hub:

:::row:::
   :::column span="":::
      - Microsoft Sentinel Training Lab
      - Cisco ASA
      - Cisco Duo Security
      - Cisco Meraki
      - Cisco StealthWatch
      - Digital Guardian
      - 365 Dynamics
      - GCP Cloud DNS
   :::column-end:::
   :::column span="":::
      - GCP CloudMonitor
      - GCP Identity and Access Management
      - FalconForce
      - FireEye NX
      - Flare Systems Firework
      - Forescout
      - Fortinet Fortigate
      - Imperva Cloud FAW
   :::column-end:::
   :::column span="":::
      - Insider Risk Management (IRM)
      - IronNet CyberSecurity Iron Defense
      - Lookout
      - McAfee Network Security Platform
      - Microsoft MITRE ATT&CK Solution for Cloud
      - Palo Alto PAN-OS
   :::column-end:::
   :::column span="":::
      - Rapid7 Nexpose / Insight VM
      - ReversingLabs
      - RSA SecurID
      - Semperis
      - Tenable Nessus Scanner
      - Vectra Stream
      - Zero Trust
   :::column-end:::
:::row-end:::

For more information, see:

- [Learn about Microsoft Sentinel solutions](sentinel-solutions.md)
- [Discover and deploy Microsoft Sentinel solutions](sentinel-solutions-deploy.md)
- [Microsoft Sentinel solutions catalog](sentinel-solutions-catalog.md)

### Enable continuous deployment from your content repositories (Public preview)

The new Microsoft Sentinel **Repositories** page provides the ability to manage and deploy your custom content from GitHub or Azure DevOps repositories, as an alternative to managing them in the Azure portal. This capability introduces a more streamlined and automated approach for managing and deploying content across Microsoft Sentinel workspaces.

If you store your custom content in an external repository in order to maintain it outside of Microsoft Sentinel, now you can connect that repository to your Microsoft Sentinel workspace. Content you add, create, or edit in your repository is automatically deployed to your Microsoft Sentinel workspaces, and will be visible from the various Microsoft Sentinel galleries, such as the **Analytics**, **Hunting**, or **Workbooks** pages.

For more information, see [Deploy custom content from your repository](ci-cd.md).

### Enriched threat intelligence with Geolocation and WhoIs data (Public preview)

Now, any threat intelligence data that you bring in to Microsoft Sentinel via data connectors and logic app playbooks, or create in Microsoft Sentinel, is automatically enriched with GeoLocation and WhoIs information.

GeoLocation and WhoIs data can provide more context for investigations where the selected indicator of compromise (IOC) is found.

For example, use GeoLocation data to find details like *Organization* or *Country* for the indicator, and WhoIs data to find data like *Registrar* and *Record creation* data.

You can view GeoLocation and WhoIs data on the **Threat Intelligence** pane for each indicator of compromise that you've imported into Microsoft Sentinel. Details for the indicator are shown on the right, including any Geolocation and WhoIs data available.

For example:

:::image type="content" source="media/whats-new/geolocation-whois-ti.png" alt-text="Screenshot of indicator details including GeoLocation and WhoIs data." lightbox="media/whats-new/geolocation-whois-ti.png":::

> [!TIP]
> The Geolocation and WhoIs information come from the Microsoft Threat Intelligence service, which you can also access via API. For more information, see [Enrich entities with geolocation data via API](geolocation-data-api.md).
>

For more information, see:

- [Understand threat intelligence in Microsoft Sentinel](understand-threat-intelligence.md)
- [Understand threat intelligence integrations](threat-intelligence-integration.md)
- [Work with threat indicators in Microsoft Sentinel](work-with-threat-indicators.md)
- [Connect threat intelligence platforms](connect-threat-intelligence-tip.md)

### Use notebooks with Azure Synapse Analytics in Microsoft Sentinel (Public preview)

Microsoft Sentinel now integrates Jupyter notebooks with Azure Synapse for large-scale security analytics scenarios.

Until now, Jupyter notebooks in Microsoft Sentinel have been integrated with Azure Machine Learning. This functionality supports users who want to incorporate notebooks, popular open-source machine learning toolkits, and libraries such as TensorFlow, as well as their own custom models, into security workflows.

The new Azure Synapse integration provides extra analytic horsepower, such as:

- **Security big data analytics**, using cost-optimized, fully managed Azure Synapse Apache Spark compute pool.

- **Cost-effective Data Lake access** to build analytics on historical data via Azure Data Lake Storage Gen2, which is a set of capabilities dedicated to big data analytics, built on top of Azure Blob Storage.

- **Flexibility to integrate data sources** into security operation workflows from multiple sources and formats.

- **PySpark, a Python-based API** for using the Spark framework in combination with Python, reducing the need to learn a new programming language if you're already familiar with Python.

To support this integration, we added the ability to create and launch an Azure Synapse workspace directly from Microsoft Sentinel. We also added new, sample notebooks to guide you through configuring the Azure Synapse environment, setting up a continuous data export pipeline from Log Analytics into Azure Data Lake Storage, and then hunting on that data at scale.

For more information, see [Integrate notebooks with Azure Synapse](notebooks-with-synapse.md).

### Enhanced Notebooks area in Microsoft Sentinel

The **Notebooks** area in Microsoft Sentinel also now has an **Overview** tab, where you can find basic information about notebooks, and a new **Notebook types** column in the **Templates** tab to indicate the type of each notebook displayed. For example, notebooks might have types of **Getting started**, **Configuration**, **Hunting**, and now **Synapse**.

For example:

:::image type="content" source="media/whats-new/notebooks-synapse.png" alt-text="Screenshot of the new Azure Synapse functionality on the Notebooks page." lightbox="media/whats-new/notebooks-synapse.png":::

For more information, see [Use Jupyter notebooks to hunt for security threats](notebooks.md).

### Microsoft Sentinel renaming

Starting in November 2021, Azure Sentinel is being renamed to Microsoft Sentinel, and you'll see upcoming updates in the portal, documentation, and other resources in parallel.

Earlier entries in this article and the older [Archive for What's new in Sentinel](whats-new-archive.md) continue to use the name *Azure* Sentinel, as that was the service name when those features were new.

For more information, see our [blog on recent security enhancements](https://aka.ms/secblg11).

### Deploy and monitor Azure Key Vault honeytokens with Microsoft Sentinel

The new **Microsoft Sentinel Deception** solution helps you watch for malicious activity in your key vaults by helping you to deploy decoy keys and secrets, called *honeytokens*, to selected Azure key vaults.

Once deployed, any access or operation with the honeytoken keys and secrets generate incidents that you can investigate in Microsoft Sentinel.

Since there's no reason to actually use honeytoken keys and secrets, any similar activity in your workspace may be malicious and should be investigated.

The **Microsoft Sentinel Deception** solution includes a workbook to help you deploy the honeytokens, either at scale or one at a time, watchlists to track the honeytokens created, and analytics rules to generate incidents as needed.

For more information, see [Deploy and monitor Azure Key Vault honeytokens with Microsoft Sentinel (Public preview)](monitor-key-vault-honeytokens.md).

## October 2021

- [Windows Security Events connector using Azure Monitor Agent now in GA](#windows-security-events-connector-using-azure-monitor-agent-now-in-ga)
- [Defender for Office 365 events now available in the Microsoft 365 Defender connector (Public preview)](#defender-for-office-365-events-now-available-in-the-microsoft-365-defender-connector-public-preview)
- [Playbook templates and gallery now available (Public preview)](#playbook-templates-and-gallery-now-available-public-preview)
- [Template versioning for your scheduled analytics rules (Public preview)](#manage-template-versions-for-your-scheduled-analytics-rules-public-preview)
- [DHCP normalization schema (Public preview)](#dhcp-normalization-schema-public-preview)

### Windows Security Events connector using Azure Monitor Agent now in GA

The new version of the Windows Security Events connector, based on the Azure Monitor Agent, is now generally available. For more information, see [Connect to Windows servers to collect security events](connect-windows-security-events.md?tabs=AMA).

### Defender for Office 365 events now available in the Microsoft 365 Defender connector (Public preview)

In addition to those from Microsoft Defender for Endpoint, you can now ingest raw [advanced hunting events](/microsoft-365/security/defender/advanced-hunting-overview) from [Microsoft Defender for Office 365](/microsoft-365/security/office-365-security/overview) through the [Microsoft 365 Defender connector](connect-microsoft-365-defender.md). [Learn more](microsoft-365-defender-sentinel-integration.md#advanced-hunting-event-collection).

### Playbook templates and gallery now available (Public preview)

A playbook template is a pre-built, tested, and ready-to-use workflow that can be customized to meet your needs. Templates can also serve as a reference for best practices when developing playbooks from scratch, or as inspiration for new automation scenarios.

Playbook templates have been developed by the Sentinel community, independent software vendors (ISVs), and Microsoft's own experts, and you can find them in the **Playbook templates** tab (under **Automation**), as part of an [Azure Sentinel solution](sentinel-solutions.md), or in the [Azure Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks).

For more information, see [Create and customize playbooks from built-in templates](use-playbook-templates.md).

### Manage template versions for your scheduled analytics rules (Public preview)

When you create analytics rules from [built-in Azure Sentinel rule templates](detect-threats-built-in.md), you effectively create a copy of the template. Past that point, the active rule is ***not*** dynamically updated to match any changes that get made to the originating template.

However, rules created from templates ***do*** remember which templates they came from, which allows you two advantages:

- If you made changes to a rule when creating it from a template (or at any time after that), you can always revert the rule back to its original version (as a copy of the template).

- If a template is updated, you'll be notified and you can choose to update your rules to the new version of their templates, or leave them as they are.

[Learn how to manage these tasks](manage-analytics-rule-templates.md), and what to keep in mind. These procedures apply to any [Scheduled](detect-threats-built-in.md#scheduled) analytics rules created from templates.

### DHCP normalization schema (Public preview)

The Advanced Security Information Model (ASIM) now supports a DHCP normalization schema, which is used to describe events reported by a DHCP server and is used by Azure Sentinel to enable source-agnostic analytics. 

Events described in the DHCP normalization schema include serving requests for DHCP IP address leased from client systems and updating a DNS server with the leases granted.

For more information, see:

- [Azure Sentinel DHCP normalization schema reference (Public preview)](dhcp-normalization-schema.md)
- [Normalization and the Azure Sentinel Information Model (ASIM)](normalization.md)

## September 2021

- [Data connector health enhancements (Public preview)](#data-connector-health-enhancements-public-preview)
- [New in docs: scaling data connector documentation](#new-in-docs-scaling-data-connector-documentation)
- [Azure Storage account connector changes](#azure-storage-account-connector-changes)

### Data connector health enhancements (Public preview)

Azure Sentinel now provides the ability to enhance your data connector health monitoring with a new *SentinelHealth* table. The *SentinelHealth* table is created after you [turn on the Azure Sentinel health feature](monitor-data-connector-health.md#turn-on-microsoft-sentinel-health-for-your-workspace) in your Azure Sentinel workspace, at the first success or failure health event generated.

For more information, see [Monitor the health of your data connectors with this Azure Sentinel workbook](monitor-data-connector-health.md).

> [!NOTE]
> The *SentinelHealth* data table is currently supported only for selected data connectors. For more information, see [Supported data connectors](monitor-data-connector-health.md#supported-data-connectors).
>


### New in docs: scaling data connector documentation

As we continue to add more and more built-in data connectors for Azure Sentinel, we reorganized our data connector documentation to reflect this scaling.

For most data connectors, we replaced full articles that describe an individual connector with a series of generic procedures and a full reference of all currently supported connectors.

Check the [Azure Sentinel data connectors reference](data-connectors-reference.md) for details about your connector, including references to the relevant generic procedure, as well as extra information and configurations required.

For more information, see:

- **Conceptual information**: [Connect data sources](connect-data-sources.md)

- **Generic how-to articles**:

   - [Connect to Azure, Windows, Microsoft, and Amazon services](connect-azure-windows-microsoft-services.md)
   - [Connect your data source to the Azure Sentinel Data Collector API to ingest data](connect-rest-api-template.md)
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

You'll only see the storage types that you actually have defined resources for.

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

:::image type="content" source="media/investigate-cases/advanced-search.png" alt-text="Screenshot of the Incidents page advanced search options.":::

For more information, see [Search for incidents](investigate-cases.md#search-for-incidents).

### Fusion detection for Ransomware (Public preview)

Azure Sentinel now provides new Fusion detections for possible Ransomware activities, generating incidents titled as **Multiple alerts possibly related to Ransomware activity detected**.

Incidents are generated for alerts that are possibly associated with Ransomware activities, when they occur during a specific time-frame, and are associated with the Execution and Defense Evasion stages of an attack. You can use the alerts listed in the incident to analyze the techniques possibly used by attackers to compromise a host / device and to evade detection.

Supported data connectors include:

- [Azure Defender (Azure Security Center)](connect-defender-for-cloud.md)
- [Microsoft Defender for Endpoint](./data-connectors-reference.md#microsoft-defender-for-endpoint)
- [Microsoft Defender for Identity](./data-connectors-reference.md#microsoft-defender-for-identity)
- [Microsoft Cloud App Security](./data-connectors-reference.md#microsoft-defender-for-cloud-apps)
- [Azure Sentinel scheduled analytics rules](detect-threats-built-in.md#scheduled)

For more information, see [Multiple alerts possibly related to Ransomware activity detected](fusion.md#fusion-for-ransomware).

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

For more information, see [Create watchlists in Microsoft Sentinel](watchlists-create.md) and [Built-in watchlist schemas](watchlist-schemas.md).



### File Event normalization schema (Public preview)

The Azure Sentinel Information Model (ASIM) now supports a File Event normalization schema, which is used to describe file activity, such as creating, modifying, or deleting files or documents. File events are reported by operating systems, file storage systems such as Azure Files, and document management systems such as Microsoft SharePoint.

For more information, see:

- [Azure Sentinel File Event normalization schema reference (Public preview)](file-event-normalization-schema.md)
- [Normalization and the Azure Sentinel Information Model (ASIM)](normalization.md)


### New in docs: Best practice guidance

In response to multiple requests from customers and our support teams, we added a series of best practice guidance to our documentation.

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

## Next steps

> [!div class="nextstepaction"]
>[On-board Azure Sentinel](quickstart-onboard.md)

> [!div class="nextstepaction"]
>[Get visibility into alerts](get-visibility.md)
