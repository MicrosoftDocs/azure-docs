---
title: Microsoft Sentinel skill-up training 
description: This article walks you through a level 400 training to help you skill up on Microsoft Sentinel. The training comprises 21 modules that present relevant product documentation, blog posts, and other resources.
author: laghimp
ms.topic: conceptual
ms.date: 06/29/2022
ms.author: laghimpe
ms.custom: fasttrack-edit
---

# Microsoft Sentinel skill-up training 

This article walks you through a level 400 training to help you skill up on Microsoft Sentinel. The training comprises 21 modules that present relevant product documentation, blog posts, and other resources. 

The modules listed here are split into five parts following the life cycle of a Security Operation Center (SOC):

[Part 1: Overview](#part-1-overview)
- [Module 0: Other learning and support options](#module-0-other-learning-and-support-options)
- [Module 1: Get started with Microsoft Sentinel](#module-1-get-started-with-microsoft-sentinel)
- [Module 2: How is Microsoft Sentinel used?](#module-2-how-is-microsoft-sentinel-used)

[Part 2: Architecting and deploying](#part-2-architecting-and-deploying)
- [Module 3: Workspace and tenant architecture](#module-3-workspace-and-tenant-architecture)
- [Module 4: Data collection](#module-4-data-collection)
- [Module 5: Log management](#module-5-log-management)
- [Module 6: Enrichment: Threat intelligence, watchlists, and more](#module-6-enrichment-threat-intelligence-watchlists-and-more)
- [Module 7: Log transformation](#module-7-log-transformation)
- [Module 8: Migration](#module-8-migration)
- [Module 9: Advanced SIEM information model and normalization](#module-9-advanced-siem-information-model-and-normalization)

[Part 3: Creating content](#part-3-creating-content)
- [Module 10: Kusto Query Language](#module-10-kusto-query-language)
- [Module 11: Analytics](#module-11-analytics)
- [Module 12: Implementing SOAR](#module-12-implementing-soar)
- [Module 13: Workbooks, reporting, and visualization](#module-13-workbooks-reporting-and-visualization)
- [Module 14: Notebooks](#module-14-notebooks)
- [Module 15: Use cases and solutions](#module-15-use-cases-and-solutions)

[Part 4: Operating](#part-4-operating)
- [Module 16: A day in a SOC analyst's life, incident management, and investigation](#module-16-handling-incidents)
- [Module 17: Hunting](#module-17-hunting)
- [Module 18: User and Entity Behavior Analytics (UEBA)](#module-18-user-and-entity-behavior-analytics-ueba)
- [Module 19: Monitoring Microsoft Sentinel's health](#module-19-monitoring-microsoft-sentinels-health)

[Part 5: Advanced](#part-5-advanced)
- [Module 20: Extending and integrating by using the Microsoft Sentinel APIs](#module-20-extending-and-integrating-by-using-the-microsoft-sentinel-apis)
- [Module 21: Build-your-own machine learning](#module-21-build-your-own-machine-learning)

## Part 1: Overview

### Module 0: Other learning and support options

This skill-up training is a level-400 training that's based on the [Microsoft Sentinel Ninja training](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/become-a-microsoft-sentinel-ninja-the-complete-level-400/ba-p/1246310). If you don't want to go as deep, or you have a specific issue to resolve, other resources might be more suitable:

* Although the skill-up training is extensive, it naturally has to follow a script and can't expand on every topic. See the referenced documentation for information about each article.
* You can now become certified with the new certification [SC-200: Microsoft Security Operations Analyst](/certifications/exams/sc-200), which covers Microsoft Sentinel.  For a broader, higher-level view of the Microsoft Security suite, you might also want to consider [SC-900: Microsoft Security, Compliance, and Identity Fundamentals](/certifications/exams/sc-900) or [AZ-500: Microsoft Azure Security Technologies](/certifications/exams/az-500).
* If you're already skilled up on Microsoft Sentinel, keep track of [what's new](whats-new.md) or join the [Microsoft Cloud Security Private Community](https://forms.office.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbR-kibZAPJAVBiU46J6wWF_5URDFSWUhYUldTWjdJNkFMVU1LTEU4VUZHMy4u) program for an earlier view into upcoming releases. 
* Do you have a feature idea to share with us? Let us know on the [Microsoft Sentinel user voice page](https://feedback.azure.com/d365community/forum/37638d17-0625-ec11-b6e6-000d3a4f07b8).
* Are you a premier customer? You might want the on-site or remote, four-day _Microsoft Sentinel Fundamentals Workshop_. Contact your Customer Success Account Manager for more details.
* Do you have a specific issue? Ask (or answer others) on the [Microsoft Sentinel Tech Community](https://techcommunity.microsoft.com/t5/microsoft-sentinel/bd-p/MicrosoftSentinel). Or you can email your question or issue to us at <MicrosoftSentinel@microsoft.com>.


### Module 1: Get started with Microsoft Sentinel

Microsoft Sentinel is a scalable, cloud-native, security information event management (SIEM) and security orchestration automated response (SOAR) solution. Microsoft Sentinel delivers security analytics and threat intelligence across the enterprise. It provides a single solution for alert detection, threat visibility, proactive hunting, and threat response. For more information, see [What is Microsoft Sentinel?](overview.md).

If you want to get an initial overview of Microsoft Sentinel's technical capabilities, the latest [Ignite presentation](https://www.youtube.com/watch?v=kGctnb4ddAE) is a good starting point. You might also find the [Quick Start Guide to Microsoft Sentinel](https://azure.microsoft.com/resources/quick-start-guide-to-azure-sentinel/) useful (site registration is required). 

You'll find a more detailed overview in this Microsoft Sentinel webinar: [YouTube](https://youtu.be/7An7BB-CcQI), [MP4](https://1drv.ms/v/s%21AnEPjr8tHcNmggMkcVweWOqoxuN9), or [presentation](https://1drv.ms/b/s!AnEPjr8tHcNmgjrN_zHpzbnfX_mX).


Finally, do you want to try it yourself? The Microsoft Sentinel All-In-One Accelerator ([blog](https://techcommunity.microsoft.com/t5/azure-sentinel/azure-sentinel-all-in-one-accelerator/ba-p/1807933), [YouTube](https://youtu.be/JB73TuX9DVs), [MP4](https://aka.ms/AzSentinel_04FEB2021_MP4), or [presentation](https://1drv.ms/b/s!AnEPjr8tHcNmhjw41XZvVSCSNIuX)) offers an easy way to get started. To learn how to get started, review the [onboarding documentation](quickstart-onboard.md), or view [Insight's Microsoft Sentinel setup and configuration video](https://www.youtube.com/watch?v=Cyd16wVwxZc).


#### Learn from other users

Thousands of organizations and service providers are using Microsoft Sentinel. As is usual with security products, most organizations don't go public about it. Still, here are a few who have:

* Find [public customer use cases](https://customers.microsoft.com/).
* [Insight](https://www.insightcdct.com/) released a use case about [an NBA team adopts Microsoft Sentinel](https://www.insightcdct.com/Resources/Case-Studies/Case-Studies/NBA-Team-Adopts-Azure-Sentinel-for-a-Modern-Securi).
* Stuart Gregg, Security Operations Manager at ASOS, posted a much more detailed [blog post from the Microsoft Sentinel experience, focusing on hunting](https://medium.com/@stuart.gregg/proactive-phishing-with-azure-sentinel-part-1-b570fff3113).
 

#### Learn from analysts
* [Azure Sentinel achieves a Leader placement in Forrester Wave, with top ranking in Strategy](https://www.microsoft.com/security/blog/2020/12/01/azure-sentinel-achieves-a-leader-placement-in-forrester-wave-with-top-ranking-in-strategy/)
* [Microsoft named a Visionary in the 2021 Gartner Magic Quadrant for SIEM for Microsoft Sentinel](https://www.microsoft.com/security/blog/2021/07/08/microsoft-named-a-visionary-in-the-2021-gartner-magic-quadrant-for-siem-for-azure-sentinel/)


### Module 2: How is Microsoft Sentinel used?

Many organizations use Microsoft Sentinel as their primary SIEM. Most of the modules in this course cover this use case. In this module, we present a few extra ways to use Microsoft Sentinel.

#### As part of the Microsoft Security stack

Use Microsoft Sentinel, Microsoft Defender for Cloud, and Microsoft Defender XDR together to protect your Microsoft workloads, including Windows, Azure, and Office:

* Read more about [our comprehensive SIEM+XDR solution combining Microsoft Sentinel and Microsoft Defender XDR](https://techcommunity.microsoft.com/t5/azure-sentinel/whats-new-azure-sentinel-and-microsoft-365-defender-incident/ba-p/2191090).
* Read [The Azure Security compass](https://aka.ms/azuresecuritycompass) (now Microsoft Security Best Practices) to understand the Microsoft blueprint for your security operations.
* Read and watch how such a setup helps detect and respond to a WebShell attack: [blog](https://techcommunity.microsoft.com/t5/azure-sentinel/analysing-web-shell-attacks-with-azure-defender-data-in-azure/ba-p/1724130) or [video demo](https://techcommunity.microsoft.com/t5/video-hub/webshell-attack-deep-dive/m-p/1698964).
* View the Better Together webinar ["OT and IOT attack detection, investigation, and response."](https://youtu.be/S8DlZmzYO2s)


#### To monitor your multi-cloud workloads

The cloud is (still) new and often not monitored as extensively as on-premises workloads. Read this [presentation](https://techcommunity.microsoft.com/gxcuf89792/attachments/gxcuf89792/AzureSentinelBlog/243/1/L400-P2%20Use%20cases.pdf) to learn how Microsoft Sentinel can help you close the cloud monitoring gap across your clouds.

#### Side by side with your existing SIEM

For either a transition period or a longer term, if you're using Microsoft Sentinel for your cloud workloads, you might be using Microsoft Sentinel alongside your existing SIEM. You might also be using both with a ticketing system such as Service Now. 

For more information about migrating from another SIEM to Microsoft Sentinel, view the migration webinar: [YouTube](https://youtu.be/njXK1h9lfR4), [MP4](https://aka.ms/AzSentinel_DetectionRules_19FEB21_MP4), or [presentation](https://1drv.ms/b/s!AnEPjr8tHcNmhlsYDm99KLbNWlq5).


There are three common scenarios for side-by-side deployment:

* If you have a ticketing system in your SOC, a best practice is to send alerts or incidents from both SIEM systems to a ticketing system such as Service Now. Examples include [using Microsoft Sentinel incident bi-directional sync with ServiceNow](https://techcommunity.microsoft.com/t5/azure-sentinel/azure-sentinel-incident-bi-directional-sync-with-servicenow/ba-p/1667771) or [sending alerts enriched with supporting events from Microsoft Sentinel to third-party SIEMs](https://techcommunity.microsoft.com/t5/azure-sentinel/sending-alerts-enriched-with-supporting-events-from-azure/ba-p/1456976).

* At least initially, many users send alerts from Microsoft Sentinel to their on-premises SIEM. To learn how, see [Send alerts enriched with supporting events from Microsoft Sentinel to third-party SIEMs](https://techcommunity.microsoft.com/t5/azure-sentinel/sending-alerts-enriched-with-supporting-events-from-azure/ba-p/1456976).

* Over time, as Microsoft Sentinel covers more workloads, you would ordinarily reverse direction and send alerts from your on-premises SIEM to Microsoft Sentinel. To do so:
    * For Splunk, see [Send data and notable events from Splunk to Microsoft Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/how-to-export-data-from-splunk-to-azure-sentinel/ba-p/1891237).
    * For QRadar, see [Send QRadar offenses to Microsoft Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/migrating-qradar-offenses-to-azure-sentinel/ba-p/2102043).
    * For ArcSight, see [Common Event Format (CEF) forwarding](https://community.microfocus.com/t5/Logger-Forwarding-Connectors/ArcSight-Forwarding-Connector-Configuration-Guide/ta-p/1583918).

You can also send the alerts from Microsoft Sentinel to your third-party SIEM or ticketing system by using the [Graph Security API](/graph/security-integration). This approach is simpler, but it doesn't enable sending other data. 


#### For MSSPs
Because it eliminates the setup cost and is location agnostic, Microsoft Sentinel is a popular choice for providing SIEM as a service. You'll find a [list of MISA (Microsoft Intelligent Security Association) member-managed security service providers (MSSPs) that use Microsoft Sentinel](https://www.microsoft.com/security/blog/2020/07/14/microsoft-intelligent-security-association-managed-security-service-providers/). Many other MSSPs, especially regional and smaller ones, use Microsoft Sentinel but aren't MISA members.

To start your journey as an MSSP, read the [Microsoft Sentinel Technical Playbooks for MSSPs](https://aka.ms/azsentinelmssp). More information about MSSP support is included in the next module, which covers cloud architecture and multi-tenant support.  

## Part 2: Architecting and deploying

Although "Part 1: Overview" offers ways to start using Microsoft Sentinel in a matter of minutes, before you start a production deployment, it's important to create a plan. 

This section walks you through the areas to consider when you're architecting your solution, and it provides guidelines on how to implement your design:

* Workspace and tenant architecture
* Data collection 
* Log management
* Threat intelligence acquisition

### Module 3: Workspace and tenant architecture

A Microsoft Sentinel instance is called a *workspace*. The workspace is the same as a Log Analytics workspace, and it supports any Log Analytics capability. You can think of Microsoft Sentinel as a solution that adds SIEM features on top of a Log Analytics workspace.

Multiple workspaces are often necessary and can act together as a single Microsoft Sentinel system. A special use case is providing a service by using Microsoft Sentinel (for example, by an *MSSP* (Managed Security Service Provider) or by a *Global SOC* in a large organization). 

To learn more about using multiple workspaces as one Microsoft Sentinel system, see [Extend Microsoft Sentinel across workspaces and tenants](extend-sentinel-across-workspaces-tenants.md) or view the webinar: [YouTube](https://youtu.be/hwahlwgJPnE), [MP4](https://1drv.ms/v/s!AnEPjr8tHcNmgkqH7MASAKIg8ql8), or [presentation](https://1drv.ms/b/s!AnEPjr8tHcNmgkkYuxOITkGSI7x8).

When you're using multiple workspaces, consider the following:
* An important driver for using multiple workspaces is *data residency*. For more information, see [Microsoft Sentinel data residency](quickstart-onboard.md).
* To deploy Microsoft Sentinel and manage content efficiently across multiple workspaces, you could manage Microsoft Sentinel as code by using continuous integration/continuous delivery (CI/CD) technology. A recommended best practice for Microsoft Sentinel is to enable continuous deployment. For more information, see [Enable continuous deployment natively with Microsoft Sentinel repositories](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/enable-continuous-deployment-natively-with-microsoft-sentinel/ba-p/2929413).
* When you're managing multiple workspaces as an MSSP, you might want to [protect MSSP intellectual property in Microsoft Sentinel](mssp-protect-intellectual-property.md).

The [Microsoft Sentinel Technical Playbook for MSSPs](https://aka.ms/azsentinelmssp) provides detailed guidelines for many of those topics, and it's useful for large organizations, not just for MSSPs.

### Module 4: Data collection

The foundation of a SIEM is collecting telemetry: events, alerts, and contextual enrichment information, such as threat intelligence, vulnerability data, and asset information. Here is a list of sources to refer to:
* Read [Microsoft Sentinel data connectors](connect-data-sources.md).
* Go to [Find your Microsoft Sentinel data connector](data-connectors-reference.md) to see all the supported and out-of-the-box data connectors. You'll find links to generic deployment procedures, and extra steps required for specific connectors. 
* Data collection scenarios: Learn about collection methods such as [Logstash/CEF/WEF](connect-logstash.md). Other common scenarios are permissions restriction to tables, log filtering, collecting logs from Amazon Web Services (AWS) or Google Cloud Platform (GCP), Microsoft 365 raw logs, and so on. All can be found in the "Data Collection Scenarios" webinar: [YouTube](https://www.youtube.com/watch?v=FStpHl0NRM8), [MP4](https://aka.ms/AS_LogCollectionScenarios_V3.0_18MAR2021_MP4), or [presentation](https://1drv.ms/b/s!AnEPjr8tHcNmhx-_hfIf0Ng3aM_G).

The first piece of information you'll see for each connector is its *data ingestion method*. The method that appears there is a link to one of the following generic deployment procedures, which contain most of the information you'll need to connect your data sources to Microsoft Sentinel:

|Data ingestion method | Associated article |
| ----------- | ----------- |
| Azure service-to-service integration     | [Connect to Azure, Windows, Microsoft, and Amazon services](connect-azure-windows-microsoft-services.md)     |
| Common Event Format (CEF) over Syslog	  | [Get CEF-formatted logs from your device or appliance into Microsoft Sentinel](connect-common-event-format.md) |
| Microsoft Sentinel Data Collector API | [Connect your data source to the Microsoft Sentinel Data Collector API to ingest data](connect-rest-api-template.md) |
| Azure Functions and the REST API | [Use Azure Functions to connect Microsoft Sentinel to your data source](connect-azure-functions-template.md) |
| Syslog | [Collect data from Linux-based sources by using Syslog](connect-syslog.md) |
| Custom logs | [Collect data in custom log formats to Microsoft Sentinel with the Log Analytics agent](connect-custom-logs.md) |

If your source isn't available, you can [create a custom connector](create-custom-connector.md). Custom connectors use the ingestion API and therefore are similar to direct sources. You most often implement custom connectors by using Azure Logic Apps, which offers a codeless option, or Azure Functions.

### Module 5: Log management

The first architecture decision to consider when you're configuring Microsoft Sentinel, is *how many workspaces and which ones to use*. Other key log management architectural decisions to consider include: 
* Where and how long to retain data.
* How to best manage access to data and secure it.

#### Ingest, archive, search, and restore data within Microsoft Sentinel

To get started, view the ["Manage your log lifecycle with new methods for ingestion, archival, search, and restoration"](https://www.youtube.com/watch?v=LgGpSJxUGoc&ab_channel=MicrosoftSecurityCommunity) webinar.


This suite of features contains:

* **Basic ingestion tier**: A new pricing tier for Azure Monitor Logs that lets you ingest logs at a lower cost. This data is retained in the workspace for only eight days.
* **Archive tier**: Azure Monitor Logs has expanded its retention capability from two years to seven years. With this new tier, you can retain data for up to seven years in a low-cost archived state.
* **Search jobs**: Search tasks that run limited KQL to find and return all relevant logs. These jobs search data across the analytics tier, the basic tier, and archived data.
* **Data restoration**: A new feature that lets you pick a data table and a time range so that you can restore data to the workspace via a restore table.

For more information about these new features, see [Ingest, archive, search, and restore data in Microsoft Sentinel](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/ingest-archive-search-and-restore-data-in-microsoft-sentinel/ba-p/3195126).

#### Alternative retention options outside the Microsoft Sentinel platform

If you want to _retain data_ for more than two years or _reduce the retention cost_, consider using Azure Data Explorer for long-term retention of Microsoft Sentinel logs. See the [webinar slides](https://onedrive.live.com/?authkey=%21AGe3Zue4W0xYo4s&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21963&parId=66C31D2DBF8E0F71%21954&o=OneUp), [webinar recording](https://www.youtube.com/watch?v=UO8zeTxgeVw&ab_channel=MicrosoftSecurityCommunity), or [blog](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/using-azure-data-explorer-for-long-term-retention-of-microsoft/ba-p/1883947).

Want more in-depth information? View the ["Improving the breadth and coverage of threat hunting with ADX support, more entity types, and updated MITRE integration"](https://www.youtube.com/watch?v=5coYjlw2Qqs&ab_channel=MicrosoftSecurityCommunity) webinar.

If you prefer another long-term retention solution, see [Export from Microsoft Sentinel / Log Analytics workspace to Azure Storage and Event Hubs](/cli/azure/monitor/log-analytics/workspace/data-export) or [Move logs to long-term storage by using Azure Logic Apps](../azure-monitor/logs/logs-export-logic-app.md). The advantage of using Logic Apps is that it can export historical data.

Finally, you can set fine-grained retention periods by using [table-level retention settings](https://techcommunity.microsoft.com/t5/core-infrastructure-and-security/azure-log-analytics-data-retention-by-type-in-real-life/ba-p/1416287). For more information, see [Configure data retention and archive policies in Azure Monitor Logs (Preview)](../azure-monitor/logs/data-retention-archive.md).


#### Log security

* Use [resource role-based access control (RBAC)](https://techcommunity.microsoft.com/t5/azure-sentinel/controlling-access-to-azure-sentinel-data-resource-rbac/ba-p/1301463) or [table-level RBAC](../azure-monitor/logs/manage-access.md) to enable multiple teams to use a single workspace.

* If needed, [delete customer content from your workspaces](../azure-monitor/logs/personal-data-mgmt.md).

* Learn how to [audit workspace queries and Microsoft Sentinel use by using alerts workbooks and queries](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/auditing-microsoft-sentinel-activities/ba-p/1718328).

* Use [private links](../azure-monitor/logs/private-link-security.md) to ensure that logs never leave your private network.


#### Dedicated cluster

Use a [dedicated workspace cluster](../azure-monitor/logs/logs-dedicated-clusters.md) if your projected data ingestion is about or more than 500 GB per day. With a dedicated cluster, you can secure resources for your Microsoft Sentinel data, which enables better query performance for large data sets.


### Module 6: Enrichment: Threat intelligence, watchlists, and more

One of the important functions of a SIEM is to apply contextual information to the event steam, which enables detection, alert prioritization, and incident investigation. Contextual information includes, for example, threat intelligence, IP intelligence, host and user information, and watchlists.

Microsoft Sentinel provides comprehensive tools to import, manage, and use threat intelligence. For other types of contextual information, Microsoft Sentinel provides watchlists and other alternative solutions.

#### Threat intelligence

Threat intelligence is an important building block of a SIEM. View the ["Explore the Power of Threat Intelligence in Microsoft Sentinel"](https://www.youtube.com/watch?v=i29Uzg6cLKc&ab_channel=MicrosoftSecurityCommunity) webinar.

In Microsoft Sentinel, you can integrate threat intelligence by using the built-in connectors from TAXII (Trusted Automated eXchange of Indicator Information) servers or through the Microsoft Graph Security API. For more information, see [Threat intelligence integration in Microsoft Sentinel](threat-intelligence-integration.md). For more information about importing threat intelligence, see the [Module 4: Data collection](#module-4-data-collection) sections. 

After it's imported, [threat intelligence](understand-threat-intelligence.md) is used extensively throughout Microsoft Sentinel. The following features focus on using threat intelligence:

* View and manage the imported threat intelligence in **Logs** in the new **Threat Intelligence** area of Microsoft Sentinel.

* Use the [built-in threat intelligence analytics rule templates](understand-threat-intelligence.md#detect-threats-with-threat-indicator-analytics) to generate security alerts and incidents by using your imported threat intelligence.

* [Visualize key information about your threat intelligence](understand-threat-intelligence.md#view-and-manage-your-threat-indicators) in Microsoft Sentinel by using the threat intelligence workbook.

View the "Automate Your Microsoft Sentinel Triage Efforts with RiskIQ Threat Intelligence" webinar: [YouTube](https://youtu.be/8vTVKitim5c) or [presentation](https://1drv.ms/b/s!AnEPjr8tHcNmkngW7psV4janJrVE?e=UkmgWk).

Short on time? View the [Ignite session](https://www.youtube.com/watch?v=RLt05JaOnHc) (28 minutes).

Want more in-depth information? View the "Deep dive on threat intelligence" webinar: [YouTube](https://youtu.be/zfoVe4iarto), [MP4](https://1drv.ms/v/s!AnEPjr8tHcNmgi8zazMLahRyycPf), or [presentation](https://1drv.ms/b/s!AnEPjr8tHcNmgi0pABN930p56id_).

#### Watchlists and other lookup mechanisms

To import and manage any type of contextual information, Microsoft Sentinel provides watchlists. By using watchlists, you can upload data tables in CSV format and use them in your KQL queries. For more information, see [Use watchlists in Microsoft Sentinel](watchlists.md), or view the "Use watchlists to manage alerts, reduce alert fatigue, and improve SOC efficiency" webinar: [YouTube](https://youtu.be/148mr8anqtI) or [presentation](https://1drv.ms/b/s!AnEPjr8tHcNmk1qPwVKXkyKwqsM5?e=jLlNmP).

Use watchlists to help you with following scenarios:

* **Investigate threats and respond to incidents quickly**: Rapidly import IP addresses, file hashes, and other data from CSV files. After you import the data, use watchlist name-value pairs for joins and filters in alert rules, threat hunting, workbooks, notebooks, and general queries.

* **Import business data as a watchlist**: For example, import lists of users with privileged system access, or terminated employees. Then, use the watchlist to create allowlists and blocklists to detect or prevent those users from logging in to the network.

* **Reduce alert fatigue**: Create allowlists to suppress alerts from a group of users, such as users from authorized IP addresses who perform tasks that would normally trigger the alert. Prevent benign events from becoming alerts.

* **Enrich event data**: Use watchlists to enrich your event data with name-value combinations that are derived from external data sources.

In addition to watchlists, you can use the KQL external-data operator, custom logs, and KQL functions to manage and query context information. Each of the four methods has its pros and cons, and you can read more about the comparisons between them in the blog post ["Implementing lookups in Microsoft Sentinel."](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/implementing-lookups-in-azure-sentinel/ba-p/1091306) Although each method is different, using the resulting information in your queries is similar and enables easy switching between them.

For ideas about using watchlists outside analytic rules, see [Utilize watchlists to drive efficiency during Microsoft Sentinel investigations](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/utilize-watchlists-to-drive-efficiency-during-microsoft-sentinel/ba-p/2090711).

View the "Use watchlists to manage alerts, reduce alert fatigue, and improve SOC efficiency" webinar: [YouTube](https://youtu.be/148mr8anqtI) or [presentation](https://1drv.ms/b/s!AnEPjr8tHcNmk1qPwVKXkyKwqsM5?e=jLlNmP).


### Module 7: Log transformation

Microsoft Sentinel supports two new features for data ingestion and transformation. These features, provided by Log Analytics, act on your data even before it's stored in your workspace. The features are:

* [**Logs ingestion API**](../azure-monitor/logs/logs-ingestion-api-overview.md): Use it to send custom-format logs from any data source to your Log Analytics workspace and then store those logs either in certain specific standard tables, or in custom-formatted tables that you create. You can perform the actual ingestion of these logs by using direct API calls. You can use Azure Monitor [data collection rules](../azure-monitor/essentials/data-collection-rule-overview.md) to define and configure these workflows.

* [**Workspace data transformations for standard logs**](../azure-monitor/essentials/data-collection-transformations.md#workspace-transformation-dcr): It uses [data collection rules](../azure-monitor/essentials/data-collection-rule-overview.md) to filter out irrelevant data, to enrich or tag your data, or to hide sensitive or personal information. You can configure data transformation at ingestion time for the following types of built-in data connectors:
    * Azure Monitor agent (AMA)-based data connectors (based on the new Azure Monitor agent)
    * Microsoft Monitoring agent (MMA)-based data connectors (based on the legacy Azure Monitor Logs Agent)
    * Data connectors that use diagnostics settings
    * [Service-to-service data connectors](data-connectors-reference.md)

For more information, see: 
* [Transform or customize data at ingestion time in Microsoft Sentinel](configure-data-transformation.md)
* [Find your Microsoft Sentinel data connector](data-connectors-reference.md)

### Module 8: Migration 

In many (if not most) cases, you already have a SIEM and need to migrate to Microsoft Sentinel. Although it might be a good time to start over and rethink your SIEM implementation, it makes sense to utilize some of the assets you've already built in your current implementation. View the "Best practices for converting detection rules" (from Splunk, QRadar, and ArcSight to Azure Microsoft Sentinel) webinar: [YouTube](https://youtu.be/njXK1h9lfR4), [MP4](https://aka.ms/AzSentinel_DetectionRules_19FEB21_MP4), [presentation](https://1drv.ms/b/s!AnEPjr8tHcNmhlsYDm99KLbNWlq5), or [blog](https://techcommunity.microsoft.com/t5/azure-sentinel/best-practices-for-migrating-detection-rules-from-arcsight/ba-p/2216417).

You might also be interested in the following resources:

* [Splunk Search Processing Language (SPL) to KQL mappings](https://github.com/Azure/Azure-Sentinel/blob/master/Tools/RuleMigration/SPL%20to%20KQL.md)
* [ArcSight and QRadar rule mapping samples](https://github.com/Azure/Azure-Sentinel/blob/master/Tools/RuleMigration/Rule%20Logic%20Mappings.md)

### Module 9: Advanced SIEM information model and normalization 

Working with varied data types and tables together can present a challenge. You must become familiar with those data types and schemas as you're writing and using a unique set of analytics rules, workbooks, and hunting queries. Correlating among the data types that are necessary for investigation and hunting can also be tricky.

The Advanced SIEM information model (ASIM) provides a seamless experience for handling various sources in uniform, normalized views. ASIM aligns with the Open-Source Security Events Metadata (OSSEM) common information model, promoting vendor-agnostic, industry-wide normalization. View the "Advanced SIEM information model (ASIM): Now built into Microsoft Sentinel" webinar: [YouTube](https://www.youtube.com/watch?v=Cf4wu_ujhG4&ab_channel=MicrosoftSecurityCommunity) or [presentation](https://onedrive.live.com/?cid=66c31d2dbf8e0f71&id=66C31D2DBF8E0F71%212459&ithint=file%2Cpdf&authkey=%21AD3Hp0A%5Ft2%5FbEH4).

The current implementation is based on query time normalization, which uses KQL functions:

* **Normalized schemas** cover standard sets of predictable event types that are easy to work with and build unified capabilities. The schema defines which fields should represent an event, a normalized column naming convention, and a standard format for the field values. 
    * View the "Understanding normalization in Microsoft Sentinel" webinar: [YouTube](https://www.youtube.com/watch?v=WoGD-JeC7ng) or [presentation](https://1drv.ms/b/s!AnEPjr8tHcNmjDY1cro08Fk3KUj-?e=murYHG).
    * View the "Deep Dive into Microsoft Sentinel normalizing parsers and normalized content" webinar: [YouTube](https://www.youtube.com/watch?v=zaqblyjQW6k), [MP3](https://aka.ms/AS_Normalizing_Parsers_and_Normalized_Content_11AUG2021_MP4), or [presentation](https://1drv.ms/b/s!AnEPjr8tHcNmjGtoRPQ2XYe3wQDz?e=R3dWeM).

* **Parsers** map existing data to the normalized schemas. You implement parsers by using [KQL functions](/azure/data-explorer/kusto/query/functions/user-defined-functions). View the "Extend and manage ASIM: Developing, testing and deploying parsers" webinar: [YouTube](https://youtu.be/NHLdcuJNqKw) or [presentation](https://1drv.ms/b/s!AnEPjr8tHcNmk0_k0zs21rL7euHp?e=5XkTnW).

* **Content** for each normalized schema includes analytics rules, workbooks, and hunting queries. This content works on any normalized data without the need to create source-specific content.

Using ASIM provides the following benefits:

* **Cross source detection**: Normalized analytic rules work across sources on-premises and in the cloud. The rules detect attacks, such as brute force, or impossible travel across systems, including Okta, AWS, and Azure.

* **Allows source agnostic content**: Covering built-in and custom content by using ASIM automatically expands to any source that supports ASIM, even if the source was added after the content was created. For example, process event analytics support any source that a customer might use to bring in the data, including Microsoft Defender for Endpoint, Windows Events, and Sysmon. We're ready to add [Sysmon for Linux](https://twitter.com/markrussinovich/status/1283039153920368651?lang=en) and WEF when it has been released.

* **Support for your custom sources in built-in analytics**

* **Ease of use**: Analysts who learn ASIM find it much simpler to write queries because the field names are always the same.


#### Learn more about ASIM

Take advantage of these resources:

* View the "Understanding normalization in Azure Sentinel" overview webinar: [YouTube](https://www.youtube.com/watch?v=WoGD-JeC7ng) or [presentation](https://1drv.ms/b/s!AnEPjr8tHcNmjDY1cro08Fk3KUj-?e=murYHG).

* View the "Deep dive into Microsoft Sentinel normalizing parsers and normalized content" webinar: [YouTube](https://www.youtube.com/watch?v=zaqblyjQW6k), [MP3](https://aka.ms/AS_Normalizing_Parsers_and_Normalized_Content_11AUG2021_MP4), or [presentation](https://1drv.ms/b/s!AnEPjr8tHcNmjGtoRPQ2XYe3wQDz?e=R3dWeM).

* View the "Turbocharge ASIM: Make sure normalization helps performance rather than impact it" webinar: [YouTube](https://youtu.be/-dg_0NBIoak), [MP4](https://1drv.ms/v/s!AnEPjr8tHcNmjk5AfH32XSdoVzTJ?e=a6hCHb), or [presentation](https://1drv.ms/b/s!AnEPjr8tHcNmjnQITNn35QafW5V2?e=GnCDkA).

* Read the [ASIM documentation](https://aka.ms/AzSentinelNormalization).

#### Deploy ASIM

* Deploy the parsers from the folders, starting with “ASIM*” in the [*parsers*](https://github.com/Azure/Azure-Sentinel/tree/master/Parsers) folder on GitHub.

* Activate analytic rules that use ASIM. Search for **normal** in the template gallery to find some of them. To get the full list, use this [GitHub search](https://github.com/search?q=ASIM+repo%3AAzure%2FAzure-Sentinel+path%3A%2Fdetections&type=Code&ref=advsearch&l=&l=).

#### Use ASIM

* Use the [ASIM hunting queries from GitHub](https://github.com/Azure/Azure-Sentinel/tree/master/Hunting%20Queries).

* Use ASIM queries when you're using KQL on the log screen.

* Write your own analytics rules by using ASIM, or [convert existing rules](normalization.md).

* Write [parsers](normalization.md#asim-components) for your custom sources to make them ASIM-compatible, and take part in built-in analytics.

## Part 3: Creating content

What is Microsoft Sentinel content?

The value of Microsoft Sentinel security is a combination of its built-in capabilities and your ability to create custom capabilities and customize the built-in ones. Among built-in capabilities, there are User and Entity Behavior Analytics (UEBA), machine learning, or out-of-box analytics rules. Customized capabilities are often referred to as "content" and include analytic rules, hunting queries, workbooks, playbooks, and so on.

In this section, we grouped the modules that help you learn how to create such content or modify built-in-content to your needs. We start with KQL, the lingua franca of Azure Microsoft Sentinel. The following modules discuss one of the content building blocks such as rules, playbooks, and workbooks. They wrap up by discussing use cases, which encompass elements of different types that address specific security goals, such as threat detection, hunting, or governance. 

### Module 10: Kusto Query Language

Most Microsoft Sentinel capabilities use [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/). When you search in your logs, write rules, create hunting queries, or design workbooks, you use KQL.  

The next section on writing rules explains how to use KQL in the specific context of SIEM rules.

#### The recommended journey for learning Microsoft Sentinel KQL

* [Pluralsight KQL course](https://www.pluralsight.com/courses/kusto-query-language-kql-from-scratch): Gives you the basics

* [Must Learn KQL](https://aka.ms/MustLearnKQL): A 20-part KQL series that walks you through the basics of creating your first analytics rule (includes an assessment and certificate)

* The Microsoft Sentinel KQL Lab: An interactive lab that teaches KQL with a focus on what you need for Microsoft Sentinel:
    * [Learning module (SC-200 part 4)](/training/paths/sc-200-utilize-kql-for-azure-sentinel/)
    * [Presentation](https://onedrive.live.com/?authkey=%21AJRxX475AhXGQBE&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21740&parId=66C31D2DBF8E0F71%21446&o=OneUp) or [lab URL](https://aka.ms/lademo)
    * A [Jupyter notebooks version](https://github.com/jjsantanna/azure_sentinel_learn_kql_lab/blob/master/azure_sentinel_learn_kql_lab.ipynb) that lets you test the queries within the notebook
    * Learning webinar: [YouTube](https://youtu.be/EDCBLULjtCM) or [MP4](https://1drv.ms/v/s!AnEPjr8tHcNmglwAjUjmYy2Qn5J-)
    * Reviewing lab solutions webinar: [YouTube](https://youtu.be/YKD_OFLMpf8) or [MP4](https://1drv.ms/v/s!AnEPjr8tHcNmg0EKIi5gwXyccB44?e=sF6UG5)

* [Pluralsight advanced KQL course](https://www.pluralsight.com/courses/microsoft-azure-data-explorer-advanced-query-capabilities)

* "Optimizing Azure Microsoft Sentinel KQL queries performance" webinar: [YouTube](https://youtu.be/jN1Cz0JcLYU), [MP4](https://aka.ms/AzS_09SEP20_MP4), or [presentation](https://1drv.ms/b/s!AnEPjr8tHcNmg2imjIS8NABc26b-?e=rXZrR5)

* "Using ASIM in your KQL queries": [YouTube](https://www.youtube.com/watch?v=WoGD-JeC7ng) or [presentation](https://1drv.ms/b/s!AnEPjr8tHcNmjDY1cro08Fk3KUj-?e=murYHG)

* "KQL framework for Microsoft Sentinel: Empowering you to become KQL-savvy" webinar: [YouTube](https://youtu.be/j7BQvJ-Qx_k) or [presentation](https://1drv.ms/b/s!AnEPjr8tHcNmkgqKSV-m1QWgkzKT?e=QAilwu)

As you learn KQL, you might also find the following references useful:

* [The KQL Cheat Sheet](https://www.mbsecure.nl/blog/2019/12/kql-cheat-sheet)
* [Query optimization best practices](../azure-monitor/logs/query-optimization.md)

### Module 11: Analytics

#### Writing scheduled analytics rules

With Microsoft Sentinel, you can use [built-in rule templates](detect-threats-built-in.md), customize the templates for your environment, or create custom rules. The core of the rules is a KQL query; however, there's much more than that to configure in a rule.

To learn the procedure for creating rules, see [Create custom analytics rules to detect threats](detect-threats-custom.md). To learn how to write rules (that is, what should go into a rule, focusing on KQL for rules), view the webinar: [YouTube](https://youtu.be/pJjljBT4ipQ), [MP4](https://1drv.ms/v/s%21AnEPjr8tHcNmghlWrlBCPKwT5WTT), or [presentation](https://1drv.ms/b/s!AnEPjr8tHcNmgmffNHf0wqmNEqdx).

SIEM analytics rules have specific patterns. Learn how to implement rules and write KQL for those patterns:  
* **Correlation rules**: See [Using lists and the "in" operator](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/azure-sentinel-correlation-rules-active-lists-out-make-list-in/ba-p/1029225) or [using the "join" operator](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/azure-sentinel-correlation-rules-the-join-kql-operator/ba-p/1041500)

* **Aggregation**: See [Using lists and the "in" operator](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/azure-sentinel-correlation-rules-active-lists-out-make-list-in/ba-p/1029225), or a more [advanced pattern handling sliding windows](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/handling-sliding-windows-in-azure-sentinel-rules/ba-p/1505394)

* **Lookups**: Regular, or approximate, partial and combined lookups

* **Handling false positives**

* **Delayed events:** A fact of life in any SIEM, and they're hard to tackle. Microsoft Sentinel can help you mitigate delays in your rules.

* **Use KQL functions as *building blocks***: Enrich Windows Security Events with parameterized functions.

The blog post ["Blob and File storage investigations"](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/microsoft-ignite-2021-blob-and-file-storage-investigations/ba-p/2175138) provides a step-by-step example of writing a useful analytic rule.

#### Using built-in analytics

Before you embark on your own rule writing, consider taking advantage of the built-in analytics capabilities. They don't require much from you, but it's worthwhile learning about them:

* Use the [built-in scheduled rule templates](detect-threats-built-in.md). You can tune those templates by modifying them the same way to edit any scheduled rule. Be sure to deploy the templates for the data connectors you connect, which are listed in the data connector **Next steps** tab.

* Learn more about Microsoft Sentinel [machine learning capabilities](bring-your-own-ml.md): [YouTube](https://www.youtube.com/watch?v=DxZXHvq1jOs&ab_channel=MicrosoftSecurityCommunity), [MP4](https://onedrive.live.com/?authkey=%21ANHkqv1CC1rX0JE&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21772&parId=66C31D2DBF8E0F71%21770&o=OneUp), or [presentation](https://onedrive.live.com/?authkey=%21ACovlR%2DY24o1rzU&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21773&parId=66C31D2DBF8E0F71%21770&o=OneUp).

* Get the list of Microsoft Sentinel [advanced, multi-stage attack detections (Fusion)](fusion.md), which are enabled by default.
* View the "Fusion machine learning detections with scheduled analytics rules" webinar: [YouTube](https://www.youtube.com/watch?v=Ee7gBAQ2Dzc), [MP4](https://onedrive.live.com/?authkey=%21AJzpplg3agpLKdo&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%211663&parId=66C31D2DBF8E0F71%211654&o=OneUp), or [presentation](https://onedrive.live.com/?cid=66c31d2dbf8e0f71&id=66C31D2DBF8E0F71%211674&ithint=file%2Cpdf&authkey=%21AD%5F1AN14N3W592M).

* Learn more about [Microsoft Sentinel built-in SOC-machine learning anomalies](soc-ml-anomalies.md). 

* View the "Customized SOC-machine learning anomalies and how to use them" webinar: [YouTube](https://www.youtube.com/watch?v=z-suDfFgSsk&ab_channel=MicrosoftSecurityCommunity), [MP4](https://onedrive.live.com/?authkey=%21AJVEGsR4ym8hVKk&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%211742&parId=66C31D2DBF8E0F71%211720&o=OneUp), or [presentation](https://onedrive.live.com/?authkey=%21AFqylaqbAGZAIfA&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%211729&parId=66C31D2DBF8E0F71%211720&o=OneUp).

* View the "Fusion machine learning detections for emerging threats and configuration UI" webinar: [YouTube](https://www.youtube.com/watch?v=bTDp41yMGdk) or [presentation](https://onedrive.live.com/?cid=66c31d2dbf8e0f71&id=66C31D2DBF8E0F71%212287&ithint=file%2Cpdf&authkey=%21AIJICOTqjY7bszE).

### Module 12: Implementing SOAR

In modern SIEMs, such as Microsoft Sentinel, SOAR makes up the entire process from the moment an incident is triggered until it's resolved. This process starts with an [incident investigation](investigate-cases.md) and continues with an [automated response](tutorial-respond-threats-playbook.md). The blog post ["How to use Microsoft Sentinel for Incident Response, Orchestration and Automation"](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/how-to-use-azure-sentinel-for-incident-response-orchestration/ba-p/2242397) provides an overview of common use cases for SOAR.

[Automation rules](automate-incident-handling-with-automation-rules.md) are the starting point for Microsoft Sentinel automation. They provide a lightweight method of centralized, automated handling of incidents, including suppression, [false-positive handling](false-positives.md), and automatic assignment.

To provide robust workflow-based automation capabilities, automation rules use [Logic Apps playbooks](automate-responses-with-playbooks.md). To learn more:

* View the "Unleash the automation Jedi tricks and build Logic Apps playbooks like a boss" webinar: [YouTube](https://www.youtube.com/watch?v=G6TIzJK8XBA&ab_channel=MicrosoftSecurityCommunity), [MP4](https://onedrive.live.com/?authkey=%21AMHoD01Fnv0Nkeg&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21513&parId=66C31D2DBF8E0F71%21511&o=OneUp), or [presentation](https://onedrive.live.com/?authkey=%21AJK2W6MaFrzSzpw&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21514&parId=66C31D2DBF8E0F71%21511&o=OneUp).

* Read about [Logic Apps](../logic-apps/logic-apps-overview.md), which is the core technology that drives Microsoft Sentinel playbooks.

* See [The Microsoft Sentinel Logic Apps connector](/connectors/azuresentinel/), the link between Logic Apps and Microsoft Sentinel.

You'll find dozens of useful playbooks in the [*Playbooks* folder](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks) on [Microsoft Sentinel GitHub](https://github.com/Azure/Azure-Sentinel) site, or read [A playbook using a watchlist to inform a subscription owner about an alert](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/playbooks-amp-watchlists-part-1-inform-the-subscription-owner/ba-p/1768917) for a playbook walkthrough.

### Module 13: Workbooks, reporting, and visualization

#### Workbooks

As the nerve center of your SOC, Microsoft Sentinel is required for visualizing the information it collects and produces. Use workbooks to visualize data in Microsoft Sentinel.

* To learn how to create workbooks, read the [Azure Workbooks documentation](../azure-monitor/visualize/workbooks-overview.md) or watch Billy York's [Workbooks training](https://www.youtube.com/watch?v=iGiPpD_-10M&ab_channel=FestiveTechCalendar) (and [accompanying text](https://www.cloudsma.com/2019/12/azure-advent-calendar-azure-monitor-workbooks/)).

* The mentioned resources aren't Microsoft Sentinel-specific. They apply to workbooks in general. To learn more about workbooks in Microsoft Sentinel, view the webinar: [YouTube](https://www.youtube.com/watch?v=7eYNaYSsk1A&list=PLmAptfqzxVEUD7-w180kVApknWHJCXf0j&ab_channel=MicrosoftSecurityCommunity), [MP4](https://onedrive.live.com/?authkey=%21ALoa5KFEhBq2DyQ&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21373&parId=66C31D2DBF8E0F71%21372&o=OneUp), or [presentation](https://onedrive.live.com/view.aspx?resid=66C31D2DBF8E0F71!374&ithint=file%2cpptx&authkey=!AD5hvwtCTeHvQLQ). Read the [documentation](monitor-your-data.md).
 
Workbooks can be interactive and enable much more than just charting. With workbooks, you can create apps or extension modules for Microsoft Sentinel to complement its built-in functionality. You can also use workbooks to extend the features of Microsoft Sentinel. Here are a few examples of such apps:

* The [Investigation Insights Workbook](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/announcing-the-investigation-insights-workbook/ba-p/1816903) provides an alternative approach to investigating incidents.

* [Graph visualization of external Teams collaborations](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/graph-visualization-of-external-teams-collaborations-in-azure/ba-p/1356847) enables hunting for risky Teams use. 

* The [users' travel map workbook](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/how-to-use-azure-sentinel-to-follow-a-users-travel-and-map-their/ba-p/981716) allows you to investigate geo-location alerts.

* The [Microsoft Sentinel insecure protocols workbook implementation guide](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/azure-sentinel-insecure-protocols-workbook-implementation-guide/ba-p/1197564), [recent enhancements](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/azure-sentinel-insecure-protocols-workbook-reimagined/ba-p/1558375), and [overview video](https://www.youtube.com/watch?v=xzHDWbBX6h8&list=PLmAptfqzxVEWkrUwV-B1Ob3qW-QPW_Ydu&index=9&ab_channel=MicrosoftSecurityCommunity)) helps you identify the use of insecure protocols in your network.

* Finally, learn how to [integrate information from any source by using API calls in a workbook](https://techcommunity.microsoft.com/t5/azure-sentinel/using-the-sentinel-api-to-view-data-in-a-workbook/ba-p/1386436).

You'll find dozens of workbooks in the [*Workbooks* folder](https://github.com/Azure/Azure-Sentinel/tree/master/Workbooks) in the [Microsoft Sentinel GitHub](https://github.com/Azure/Azure-Sentinel). Some of them are available in the Microsoft Sentinel workbooks gallery as well.

#### Reporting and other visualization options

Workbooks can serve for reporting. For more advanced reporting capabilities, such as reports scheduling and distribution or pivot tables, you might want to use:

* Power BI, which natively [integrates with Azure Monitor Logs and Microsoft Sentinel](../azure-monitor/logs/log-powerbi.md).

* Excel, which can use [Azure Monitor Logs and Microsoft Sentinel as the data source](../azure-monitor/logs/log-excel.md), and view the ["Integrate Azure Monitor Logs and Excel with Azure Monitor"](https://www.youtube.com/watch?v=Rx7rJhjzTZA) video.

* Jupyter notebooks, a topic that's covered later in the hunting module, are also a great visualization tool.

### Module 14: Notebooks

Jupyter notebooks are fully integrated with Microsoft Sentinel. Although considered an important tool in the hunter's tool chest and discussed the webinars in the hunting section below, their value is much broader. Notebooks can serve for advanced visualization, as an investigation guide, and for sophisticated automation. 

To understand notebooks better, view the [Introduction to notebooks video](https://www.youtube.com/watch?v=TgRRJeoyAYw&ab_channel=MicrosoftSecurityCommunity). Get started using the notebooks webinar ([YouTube](https://www.youtube.com/watch?v=rewdNeX6H94&ab_channel=MicrosoftSecurityCommunity), [MP4](https://onedrive.live.com/?authkey=%21ALXve0rEAhZOuP4&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21778&parId=66C31D2DBF8E0F71%21776&o=OneUp), or [presentation](https://onedrive.live.com/?authkey=%21AEQpzVDAwzzen30&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21779&parId=66C31D2DBF8E0F71%21776&o=OneUp)) or read the [documentation](notebooks.md). The [Microsoft Sentinel Notebooks Ninja series](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/becoming-a-microsoft-sentinel-notebooks-ninja-the-series/ba-p/2693491) is an ongoing training series to upskill you in notebooks.

An important part of the integration is implemented by [MSTICPy](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/msticpy-python-defender-tools/ba-p/648929), which is a Python library developed by our research team to be used with Jupyter notebooks. It adds Microsoft Sentinel interfaces and sophisticated security capabilities to your notebooks.

* [MSTICPy Fundamentals to Build Your Own Notebooks](https://www.youtube.com/watch?v=S0knTOnA2Rk&ab_channel=MicrosoftSecurityCommunity)

* [MSTICPy Intermediate to Build Your Own Notebooks](https://www.youtube.com/watch?v=Rpj-FS_0Wqg&ab_channel=MicrosoftSecurityCommunity)

### Module 15: Use cases and solutions

With connectors, rules, playbooks, and workbooks, you can implement *use cases*, which is the SIEM term for a content pack that's intended to detect and respond to a threat. You can deploy Microsoft Sentinel built-in use cases by activating the suggested rules when you're connecting each connector. A *solution* is a group of use cases that address a specific threat domain.

The "Tackling Identity" webinar ([YouTube](https://www.youtube.com/watch?v=BcxiY32famg&ab_channel=MicrosoftSecurityCommunity), [MP4](https://onedrive.live.com/?authkey=%21AFsVrhZwut8EnB4&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21284&parId=66C31D2DBF8E0F71%21282&o=OneUp), or [presentation](https://onedrive.live.com/?authkey=%21ACSAvdeLB7JfAX8&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21283&parId=66C31D2DBF8E0F71%21282&o=OneUp)) explains what a use case is and how to approach its design, and it presents several use cases that collectively address identity threats.

Another relevant solution area is *protecting remote work*. View our [Ignite session on protecting remote work](https://www.youtube.com/watch?v=09JfbjQdzpg&ab_channel=MicrosoftSecurity), and read more about the following specific use cases:

* [Microsoft Teams hunting use cases](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/protecting-your-teams-with-azure-sentinel/ba-p/1265761) and [Graph visualization of external Microsoft Teams collaborations](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/graph-visualization-of-external-teams-collaborations-in-azure/ba-p/1356847)

* [Monitoring Zoom with Microsoft Sentinel](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/monitoring-zoom-with-azure-sentinel/ba-p/1341516): custom connectors, analytic rules, and hunting queries.

* [Monitoring Azure Virtual Desktop with Microsoft Sentinel](../virtual-desktop/diagnostics-log-analytics.md): use Windows Security Events, Microsoft Entra sign-in logs, Microsoft Defender XDR for Endpoints, and Azure Virtual Desktop diagnostics logs to detect and hunt for Azure Virtual Desktop threats.

* [Monitor Microsoft Intune](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/secure-working-from-home-deep-insights-at-enrolled-mem-assets/ba-p/1424255) using queries and workbooks.

And finally, focusing on recent attacks, learn how to [monitor the software supply chain with Microsoft Sentinel](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/monitoring-the-software-supply-chain-with-azure-sentinel/ba-p/2176463).

Microsoft Sentinel solutions provide in-product discoverability, single-step deployment, and enablement of end-to-end product, domain, and/or vertical scenarios in Microsoft Sentinel. For more information, see [About Microsoft Sentinel content and solutions](sentinel-solutions.md), and view the "Create your own Microsoft Sentinel solutions" webinar: [YouTube](https://www.youtube.com/watch?v=oYTgaTh_NOU&ab_channel=MicrosoftSecurityCommunity) or [presentation](https://onedrive.live.com/?cid=66c31d2dbf8e0f71&id=66C31D2DBF8E0F71%212201&ithint=file%2Cpdf&authkey=%21AIdsDXF3iluXd94).

## Part 4: Operating

### Module 16: Handling incidents

After you build your SOC, you need to start using it. The "day in an SOC analyst's life" webinar ([YouTube](https://www.youtube.com/watch?v=HloK6Ay4h1M&ab_channel=MicrosoftSecurityCommunity), [MP4](https://onedrive.live.com/?authkey=%21ACD%5F1nY2ND8MOmg&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21273&parId=66C31D2DBF8E0F71%21271&o=OneUp), or [presentation](https://onedrive.live.com/?authkey=%21AAvOR9OSD51OZ8c&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21272&parId=66C31D2DBF8E0F71%21271&o=OneUp)) walks you through using Microsoft Sentinel in the SOC to *triage*, *investigate*, and *respond* to incidents.

To help enable your teams to collaborate seamlessly across the organization  and with external stakeholders, see [Integrating with Microsoft Teams directly from Microsoft Sentinel](collaborate-in-microsoft-teams.md). And view the ["Decrease your SOC’s MTTR (Mean Time to Respond) by integrating Microsoft Sentinel with Microsoft Teams"](https://www.youtube.com/watch?v=0REgc2jB560&ab_channel=MicrosoftSecurityCommunity) webinar.

You might also want to read the [documentation article on incident investigation](investigate-cases.md). As part of the investigation, you'll also use the [entity pages](entity-pages.md) to get more information about entities related to your incident or identified as part of your investigation.

Incident investigation in Microsoft Sentinel extends beyond the core incident investigation functionality. You can build additional investigation tools by using workbooks and notebooks, Notebooks are discussed in the next section, [Module 17: Hunting](#module-17-hunting). You can also build more investigation tools or modify existing ones to your specific needs. Examples include: 

* The [Investigation Insights Workbook](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/announcing-the-investigation-insights-workbook/ba-p/1816903) provides an alternative approach to investigating incidents.

* Notebooks enhance the investigation experience. Read [Why use Jupyter for security investigations?](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/why-use-jupyter-for-security-investigations/ba-p/475729), and learn how to investigate by using Microsoft Sentinel and Jupyter notebooks: 
   * [Part 1](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/security-investigation-with-azure-sentinel-and-jupyter-notebooks/ba-p/432921)
   * [Part 2](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/security-investigation-with-azure-sentinel-and-jupyter-notebooks/ba-p/483466)
   * [Part 3](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/security-investigation-with-azure-sentinel-and-jupyter-notebooks/ba-p/561413)

### Module 17: Hunting

Although most of the discussion so far has focused on detection and incident management, *hunting* is another important use case for Microsoft Sentinel. Hunting is a **proactive search for threats** rather than a reactive response to alerts. 

The hunting dashboard is constantly updated. It shows all the queries that were written by the Microsoft team of security analysts and any extra queries that you've created or modified. Each query provides a description of what it's hunting for, and what kind of data it runs on. These templates are grouped by their various tactics. The icons at the right categorize the type of threat, such as initial access, persistence, and exfiltration. For more information, see [Hunt for threats with Microsoft Sentinel](hunting.md).

To understand more about what hunting is and how Microsoft Sentinel supports it, view the introductory "Threat hunting" webinar: [YouTube](https://www.youtube.com/watch?v=6ueR09PLoLU&t=1451s&ab_channel=MicrosoftSecurityCommunity), [MP4](https://onedrive.live.com/?authkey=%21AO3gGrb474Bjmls&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21468&parId=66C31D2DBF8E0F71%21466&o=OneUp), or [presentation](https://onedrive.live.com/?authkey=%21AJ09hohPMbtbVKk&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21469&parId=66C31D2DBF8E0F71%21466&o=OneUp). The webinar starts with an update on new features. To learn about hunting, start at slide 12. The YouTube video is already set to start there.

Although the introductory webinar focuses on tools, hunting is all about security. Our security research team webinar ([YouTube](https://www.youtube.com/watch?v=BTEV_b6-vtg&ab_channel=MicrosoftSecurityCommunity), [MP4](https://onedrive.live.com/?authkey=%21ADC2GvI1Yjlh%2D6E&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21276&parId=66C31D2DBF8E0F71%21274&o=OneUp), or [presentation](https://onedrive.live.com/?authkey=%21AF1uqmmrWbI3Mb8&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21275&parId=66C31D2DBF8E0F71%21274&o=OneUp)) focuses on how to actually hunt. 

The follow-up webinar, "AWS threat hunting by using Microsoft Sentinel" ([YouTube](https://www.youtube.com/watch?v=bSH-JOKl2Kk&ab_channel=MicrosoftSecurityCommunity), [MP4](https://onedrive.live.com/?authkey=%21ADu7r7XMTmKyiMk&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21336&parId=66C31D2DBF8E0F71%21333&o=OneUp), or [presentation](https://onedrive.live.com/?authkey=%21AA7UKQIj2wu1FiI&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21334&parId=66C31D2DBF8E0F71%21333&o=OneUp)) drives the point by showing an end-to-end hunting scenario on a high-value target environment. 

Finally, you can learn how to do [SolarWinds post-compromise hunting with Microsoft Sentinel](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/solarwinds-post-compromise-hunting-with-azure-sentinel/ba-p/1995095) and [WebShell hunting](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/web-shell-threat-hunting-with-azure-sentinel/ba-p/2234968), motivated by the latest recent vulnerabilities in on-premises Microsoft Exchange servers.

### Module 18: User and Entity Behavior Analytics (UEBA)

The newly introduced Microsoft Sentinel [User and Entity Behavior Analytics (UEBA)](identify-threats-with-entity-behavior-analytics.md) module enables you to identify and investigate threats inside your organization and their potential impact, whether they come from a compromised entity or a malicious insider.

As Microsoft Sentinel collects logs and alerts from all its connected data sources, it analyzes them and builds baseline behavioral profiles of your organization’s entities (such as *users*, *hosts*, *IP addresses*, and *applications*) across time and peer-group horizon. Through various techniques and machine learning capabilities, Microsoft Sentinel can then identify anomalous activity and help you determine whether an asset has been compromised. Not only that, but it can also figure out the relative sensitivity of particular assets, identify peer groups of assets, and evaluate the potential impact of any given compromised asset (its “blast radius”). Armed with this information, you can effectively prioritize your investigation and incident handling.

Learn more about UEBA by viewing the webinar ([YouTube](https://www.youtube.com/watch?v=ixBotw9Qidg&ab_channel=MicrosoftSecurityCommunity), [MP4](https://onedrive.live.com/?authkey=%21AO0122hqWUkZTJI&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%211909&parId=66C31D2DBF8E0F71%21508&o=OneUp), or [presentation](https://onedrive.live.com/?authkey=%21ADXz0j2AO7Kgfv8&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21515&parId=66C31D2DBF8E0F71%21508&o=OneUp)), and read about using [UEBA for investigations in your SOC](https://techcommunity.microsoft.com/t5/azure-sentinel/guided-ueba-investigation-scenarios-to-empower-your-soc/ba-p/1857100). 

To learn about the most recent updates, view the ["Future of Users Entity Behavioral Analytics in Microsoft Sentinel"](https://www.youtube.com/watch?v=dLVAkSLKLyQ&ab_channel=MicrosoftSecurityCommunity) webinar.

### Module 19: Monitoring Microsoft Sentinel's health

Part of operating a SIEM is making sure that it works smoothly and is an evolving area in Azure Microsoft Sentinel. Use the following to monitor Microsoft Sentinel's health:

* Measure the efficiency of your [Security operations](manage-soc-with-incident-metrics.md#security-operations-efficiency-workbook) ([video](https://www.youtube.com/watch?v=jRucUysVpxI&ab_channel=MicrosoftSecurityCommunity)).

* The Microsoft Sentinel Health data table provides insights on health drifts, such as latest failure events per connector, or connectors with changes from success to failure states, which you can use to create alerts and other automated actions. For more information, see [Monitor the health of your data connectors](monitor-data-connector-health.md). View the ["Data Connectors Health Monitoring Workbook"](https://www.youtube.com/watch?v=T6Vyo7gZYds&ab_channel=MicrosoftSecurityCommunity) video. And [get notifications on anomalies](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/data-connector-health-push-notification-alerts/ba-p/1996442).

* Monitor agents by using the [agents' health solution](../azure-monitor/insights/solution-agenthealth.md) (Windows only) and the [Heartbeat table](/azure/azure-monitor/reference/tables/heartbeat) (Linux and Windows).

* Monitor your Log Analytics workspace: [YouTube](https://www.youtube.com/watch?v=DmDU9QP_JlI&ab_channel=MicrosoftSecurityCommunity), [MP4](https://onedrive.live.com/?cid=66c31d2dbf8e0f71&id=66C31D2DBF8E0F71%21792&ithint=video%2Cmp4&authkey=%21ALgHojpWDidvFyo), or [presentation](https://onedrive.live.com/?cid=66c31d2dbf8e0f71&id=66C31D2DBF8E0F71%21794&ithint=file%2Cpdf&authkey=%21AAva%2Do6Ru1fjJ78), including query execution and ingestion health.

* Cost management is also an important operational procedure in the SOC. Use the [Ingestion Cost Alert Playbook](https://techcommunity.microsoft.com/t5/azure-sentinel/ingestion-cost-alert-playbook/ba-p/2006003) to ensure that you're always aware of any cost increases. 

## Part 5: Advanced 

### Module 20: Extending and integrating by using the Microsoft Sentinel APIs

As a cloud-native SIEM, Microsoft Sentinel is an API-first system. Every feature can be configured and used through an API, enabling easy integration with other systems and extending Microsoft Sentinel with your own code. If API sounds intimidating to you, don't worry. Whatever is available by using the API is [also available by using PowerShell](https://techcommunity.microsoft.com/t5/azure-sentinel/new-year-new-official-azure-sentinel-powershell-module/ba-p/2025041).

To learn more about the Microsoft Sentinel APIs, view the [short introductory video](https://www.youtube.com/watch?v=gQDBkc-K-Y4&ab_channel=MicrosoftSecurityCommunity) and read the [blog post](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/microsoft-sentinel-api-101/ba-p/1438928). For a deeper dive, view the "Extending and integrating Sentinel (APIs)" webinar ([YouTube](https://www.youtube.com/watch?v=Cu4dc88GH1k&ab_channel=MicrosoftSecurityCommunity), [MP4](https://onedrive.live.com/?authkey=%21ACZmq6oAe1yVDmY&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21307&parId=66C31D2DBF8E0F71%21305&o=OneUp), or [presentation](https://onedrive.live.com/?authkey=%21AF3TWPEJKZvJ23Q&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21308&parId=66C31D2DBF8E0F71%21305&o=OneUp)), and read the blog post [Extending Microsoft Sentinel: APIs, integration, and management automation](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/extending-azure-sentinel-apis-integration-and-management/ba-p/1116885).

### Module 21: Build-your-own machine learning

Microsoft Sentinel provides a great platform for implementing your own machine learning algorithms. We call it the *Build-your-own machine learning model*, or BYO ML. BYO ML is intended for advanced users. If you're looking for built-in behavioral analytics, use our machine learning analytics rules or UEBA module, or write your own behavioral analytics KQL-based analytics rules.

To start with bringing your own machine learning to Microsoft Sentinel, view the ["Build-your-own machine learning model"](https://www.youtube.com/watch?v=QDIuvZbmUmc) video, and read the [Build-your-own machine learning model detections in the AI-immersed Azure Sentinel SIEM](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/build-your-own-machine-learning-detections-in-the-ai-immersed/ba-p/1750920) blog post. You might also want to refer to the [BYO ML documentation](bring-your-own-ml.md).

## Next steps 
* [Pre-deployment activities and prerequisites for deploying Microsoft Sentinel](prerequisites.md)
* [Quickstart: Onboard Microsoft Sentinel](quickstart-onboard.md)
* [What's new in Microsoft Sentinel](whats-new.md)

## Recommended content

* [Best practices for Microsoft Sentinel](best-practices.md) 
* [Microsoft Sentinel sample workspace designs](sample-workspace-designs.md)
* [Plan costs and understand Microsoft Sentinel pricing and billing](billing.md#understand-the-full-billing-model-for-microsoft-sentinel)
* [Roles and permissions in Microsoft Sentinel](roles.md)
* [Deploy Microsoft Sentinel side-by-side with an existing SIEM](deploy-side-by-side.md)
