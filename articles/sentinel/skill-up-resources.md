---
title: Microsoft Sentinel skill-up training 
description: This article walks you through a Microsoft Sentinel level 400 training to help you skill up on Microsoft Sentinel. The training includes 21 modules that contain relevant product documentation, blog posts and other resources. Make sure to check the most recent links for the documentation.
author: laghimp
ms.topic: conceptual
ms.date: 06/29/2022
ms.author: laghimpe
ms.custom: fasttrack-edit
---

# Microsoft Sentinel skill-up training 

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

This article walks you through a Microsoft Sentinel level 400 training to help you skill up on Microsoft Sentinel. The training includes 21 modules that contain relevant product documentation, blog posts and other resources. Make sure to check the most recent links for the documentation. 

The modules listed below are split into five parts following the life cycle of a Security Operation Center (SOC):

[Part 1: Overview](#part-1-overview)
- [Module 0: Other learning and support options ](#module-0-other-learning-and-support-options)
- [Module 1: Get started with Microsoft Sentinel](#module-1-get-started-with-microsoft-sentinel)
- [Module 2: How is Microsoft Sentinel used?](#module-2-how-is-microsoft-sentinel-used)

[Part 2: Architecting & Deploying](#part-2-architecting--deploying)
- [Module 3: Workspace and tenant architecture](#module-3-workspace-and-tenant-architecture)
- [Module 4: Data collection](#module-4-data-collection)
- [Module 5: Log Management](#module-5-log-management)
- [Module 6: Enrichment: TI, Watchlists, and more](#module-6-enrichment-ti-watchlists-and-more)
- [Module 7: Log transformation](#module-7-log-transformation)
- [Module 8: Migration](#module-8-migration)
- [Module 9: ASIM and Normalization](#module-9-advanced-siem-information-model-asim-and-normalization)

[Part 3: Creating Content](#part-3-creating-content)
- [Module 10: The Kusto Query Language (KQL)](#module-10-the-kusto-query-language-kql)
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
- [Module 20: Extending and Integrating using Microsoft Sentinel APIs](#module-20-extending-and-integrating-using-microsoft-sentinel-apis)
- [Module 21: Bring your own ML](#module-21-bring-your-own-ml)

## Part 1: Overview

### Module 0: Other learning and support options

This Skill-up training is based on the [Microsoft Sentinel Ninja training](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/become-a-microsoft-sentinel-ninja-the-complete-level-400/ba-p/1246310) and is a level 400 training. If you don't want to go as deep, or have a specific issue, other resources might be more suitable:

* While extensive, the Skill-up training has to follow a script, and can't expand on every topic. Read the referenced documentation for details on every article.
* You can now certify with the new certification [SC-200: Microsoft Security Operations Analyst](/learn/certifications/exams/sc-200), which covers Microsoft Sentinel.  You may also want to consider the [SC-900: Microsoft Security, Compliance, and Identity Fundamentals](/learn/certifications/exams/sc-900) or the [AZ-500: Microsoft Azure Security Technologies](/learn/certifications/exams/az-500), for a broader, higher level view of the Microsoft Security suite.
* Are you already skilled-up on Microsoft Sentinel? Just keep track of [what's new](whats-new.md) or join the [Private Preview](https://forms.office.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbR-kibZAPJAVBiU46J6wWF_5URDFSWUhYUldTWjdJNkFMVU1LTEU4VUZHMy4u) program for an earlier glimpse. 
* Do you have a feature idea and do you want to share with us? Let us know on the [Microsoft Sentinel user voice page](https://feedback.azure.com/d365community/forum/37638d17-0625-ec11-b6e6-000d3a4f07b8).
* Premier customer? You might want the on-site (or remote) four-day _Microsoft Sentinel Fundamentals Workshop_. Contact your Customer Success Account Manager for more details.
* Do you have a specific issue? Ask (or answer others) on the [Microsoft Sentinel Tech Community](https://techcommunity.microsoft.com/t5/microsoft-sentinel/bd-p/MicrosoftSentinel). As a last resort, send an e-mail to <MicrosoftSentinel@microsoft.com>.


### Module 1: Get started with Microsoft Sentinel

Microsoft Sentinel is a **scalable, cloud-native, security information event management (SIEM) and security orchestration automated response (SOAR) solution**. Microsoft Sentinel delivers security analytics and threat intelligence across the enterprise. It provides a single solution for alert detection, threat visibility, proactive hunting, and threat response. [Read more.](overview.md)


If you want to get an initial overview of Microsoft Sentinel's technical capabilities, the [latest Ignite presentation](https://www.youtube.com/watch?v=kGctnb4ddAE) is a good starting point. You might also find the [Quick Start Guide to Microsoft Sentinel](https://azure.microsoft.com/resources/quick-start-guide-to-azure-sentinel/) useful (requires registration). A more detailed overview can be found in this webinar: [MP4](https://1drv.ms/v/s%21AnEPjr8tHcNmggMkcVweWOqoxuN9), [YouTube](https://youtu.be/7An7BB-CcQI), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmgjrN_zHpzbnfX_mX).


Lastly, do you want to try it yourself? The Microsoft Sentinel All-In-One Accelerator ([blog](https://techcommunity.microsoft.com/t5/azure-sentinel/azure-sentinel-all-in-one-accelerator/ba-p/1807933), [YouTube](https://youtu.be/JB73TuX9DVs), [MP4](https://aka.ms/AzSentinel_04FEB2021_MP4), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmhjw41XZvVSCSNIuX)) presents an easy way to get you started. To learn how to start yourself, review the [onboarding documentation](quickstart-onboard.md), or watch [Insight's Sentinel setup and configuration video](https://www.youtube.com/watch?v=Cyd16wVwxZc).


#### Learn from users

Thousands of organizations and service providers are using Microsoft Sentinel. As usual with security products, most of them don't go public about it. Still, there are some.

* You can find [public customer use cases here](https://customers.microsoft.com/en-us/home)
* [Insight](https://www.insightcdct.com/) released a use case about [an NBA team adapting Sentinel](https://www.insightcdct.com/Resources/Case-Studies/Case-Studies/NBA-Team-Adopts-Azure-Sentinel-for-a-Modern-Securi).
* Stuart Gregg, Security Operations Manager @ ASOS, posted a much more detailed [blog post from Microsoft Sentinel's experience, focusing on hunting](https://medium.com/@stuart.gregg/proactive-phishing-with-azure-sentinel-part-1-b570fff3113).
 

#### Learn from Analysts
* [Microsoft Sentinel is a Leader placement in Forrester Wave.](https://www.microsoft.com/security/blog/2020/12/01/azure-sentinel-achieves-a-leader-placement-in-forrester-wave-with-top-ranking-in-strategy/)
* [Microsoft named a Visionary in the 2021 Gartner Magic Quadrant for SIEM for Microsoft Sentinel.](https://www.microsoft.com/security/blog/2021/07/08/microsoft-named-a-visionary-in-the-2021-gartner-magic-quadrant-for-siem-for-azure-sentinel/)


### Module 2: How is Microsoft Sentinel used?

Many users use Microsoft Sentinel as their primary SIEM. Most of the modules in this course cover this use case. In this module, we present a few extra ways to use Microsoft Sentinel.

#### As part of the Microsoft Security stack

Use Microsoft Sentinel, Microsoft Defender for Cloud, Microsoft 365 Defender in tandem to protect your Microsoft workloads, including Windows, Azure, and Office:

* Read more about [our comprehensive SIEM+XDR solution combining Microsoft Sentinel and Microsoft 365 Defender](https://techcommunity.microsoft.com/t5/azure-sentinel/whats-new-azure-sentinel-and-microsoft-365-defender-incident/ba-p/2191090).
* Read [The Azure Security compass](https://aka.ms/azuresecuritycompass) to understand Microsoft's blueprint for your security operations.
* Read and watch how such a setup helps detect and respond to a WebShell attack: [Blog](https://techcommunity.microsoft.com/t5/azure-sentinel/analysing-web-shell-attacks-with-azure-defender-data-in-azure/ba-p/1724130), [Video demo](https://techcommunity.microsoft.com/t5/video-hub/webshell-attack-deep-dive/m-p/1698964).
* Watch the webinar: [Better Together | OT and IoT Attack Detection, Investigation and Response](https://youtu.be/S8DlZmzYO2s).


#### To monitor your multi-cloud workloads

The cloud is (still) new and often not monitored as extensively as on-premises workloads. Read this [presentation](https://techcommunity.microsoft.com/gxcuf89792/attachments/gxcuf89792/AzureSentinelBlog/243/1/L400-P2%20Use%20cases.pdf) to learn how Microsoft Sentinel can help you close the cloud monitoring gap across your clouds.

#### Side by side with your existing SIEM

Either for a transition period or a longer term, if you're using Microsoft Sentinel for your cloud workloads, you may be using Microsoft Sentinel alongside your existing SIEM. You might also be using both with a ticketing system such as Service Now. 

For more information on migrating from another SIEM to Microsoft Sentinel, watch the migration webinar: [MP4](https://aka.ms/AzSentinel_DetectionRules_19FEB21_MP4), [YouTube](https://youtu.be/njXK1h9lfR4), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmhlsYDm99KLbNWlq5).


There are three common scenarios for side by side deployment:

* If you have a ticketing system in your SOC, a best practice is to send alerts or incidents from both SIEM systems to a ticketing system such as Service Now. An example is using [Microsoft Sentinel Incident Bi-directional sync with ServiceNow](https://techcommunity.microsoft.com/t5/azure-sentinel/azure-sentinel-incident-bi-directional-sync-with-servicenow/ba-p/1667771) or [sending alerts enriched with supporting events from Microsoft Sentinel to third-party SIEMs](https://techcommunity.microsoft.com/t5/azure-sentinel/sending-alerts-enriched-with-supporting-events-from-azure/ba-p/1456976).
* At least initially, many users send alerts from Microsoft Sentinel to your on-premises SIEM. Read on how to do it in [Sending alerts enriched with supporting events from Microsoft Sentinel to third-party SIEMs](https://techcommunity.microsoft.com/t5/azure-sentinel/sending-alerts-enriched-with-supporting-events-from-azure/ba-p/1456976).
* Over time, as Microsoft Sentinel covers more workloads, it's typical to reverse that and send alerts from your on-premises SIEM to Microsoft Sentinel. To do that:
    * With Splunk, read [Send data and notable events from Splunk to Microsoft Sentinel using the Microsoft Sentinel Splunk ....](https://techcommunity.microsoft.com/t5/azure-sentinel/how-to-export-data-from-splunk-to-azure-sentinel/ba-p/1891237)
    * With QRadar read [Sending QRadar offenses to Microsoft Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/migrating-qradar-offenses-to-azure-sentinel/ba-p/2102043)
    * For ArcSight, use [CEF Forwarding](https://community.microfocus.com/t5/Logger-Forwarding-Connectors/ArcSight-Forwarding-Connector-Configuration-Guide/ta-p/1583918).

You can also send the alerts from Microsoft Sentinel to your third-party SIEM or ticketing system using the [Graph Security API](/graph/security-integration), which is simpler, but wouldn't enable sending other data. 


#### For MSSPs
Since it eliminates the setup cost and is location agnostics, Microsoft Sentinel is a popular choice for providing SIEM-as-a-service. You can find a [list of MISA (Microsoft Intelligent Security Association) member managed security service providers (MSSPs) using Microsoft Sentinel](https://www.microsoft.com/security/blog/2020/07/14/microsoft-intelligent-security-association-managed-security-service-providers/). Many other MSSPs, especially regional and smaller ones, use Microsoft Sentinel but aren't MISA members.

To start your journey as an MSSP, you should read the [Microsoft Sentinel Technical Playbooks for MSSPs](https://aka.ms/azsentinelmssp). More information about MSSP support is included in the next module, cloud architecture and multi-tenant support.  

## Part 2: Architecting & Deploying

While the previous section offers options to start using Microsoft Sentinel in a matter of minutes, before you start a production deployment, you need to plan. This section walks you through the areas that you need to consider when architecting your solution, and provides guidelines on how to implement your design:

* Workspace and tenant architecture
* Data collection 
* Log management
* Threat Intelligence acquisition

### Module 3: Workspace and tenant architecture

A Microsoft Sentinel instance is called a workspace. The workspace is the same as a Log Analytics workspace and supports any Log Analytics capability. You can think of Sentinel as a solution that adds SIEM features on top of a Log Analytics workspace.

Multiple workspaces are often necessary and can act together as a single Microsoft Sentinel system. A special use case is providing service using Microsoft Sentinel, for example, by an **MSSP** (Managed Security Service Provider) or by a **Global SOC** in a large organization. 

To learn more about using multiple workspaces as one Microsoft Sentinel system, read [Extend Microsoft Sentinel across workspaces and tenants](extend-sentinel-across-workspaces-tenants.md) or watch the Webinar: [MP4](https://1drv.ms/v/s!AnEPjr8tHcNmgkqH7MASAKIg8ql8), [YouTube](https://youtu.be/hwahlwgJPnE), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmgkkYuxOITkGSI7x8).

There are a few specific areas that require your consideration when using multiple workspaces:
* An important driver for using multiple workspaces is **data residency**. Read more about [Microsoft Sentinel data residency](quickstart-onboard.md).
* To deploy Microsoft Sentinel and manage content efficiently across multiple workspaces; you would like to manage Sentinel as code using **CI/CD technology**.  A recommended best practice for Microsoft Sentinel is to enable continuous deployment:
    * Read [Enable Continuous Deployment Natively with Microsoft Sentinel Repositories!](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/enable-continuous-deployment-natively-with-microsoft-sentinel/ba-p/2929413)
* When managing multiple workspaces as an MSSP, you may want to [protect the MSSP’s Intellectual Property in Microsoft Sentinel](mssp-protect-intellectual-property.md).

The [Microsoft Sentinel Technical Playbook for MSSPs](https://aka.ms/azsentinelmssp) provides detailed guidelines for many of those topics, and is useful also for large organizations, not just to MSSPs.

### Module 4: Data Collection

The foundation of a SIEM is collecting telemetry: events, alerts, and contextual enrichment information such as Threat Intelligence, vulnerability data, and asset information. You can find a list of sources you can connect here:
* [Microsoft Sentinel data connectors](connect-data-sources.md)
* [Find your Microsoft Sentinel data connector](data-connectors-reference.md) for seeing all the supported and out-of-the-box data connectors. You'll find links to generic deployment procedures, and extra steps required for specific connectors. 
* Data Collection Scenarios: Learn about collection methods such as [Logstash/CEF/WEF](connect-logstash.md). Other common scenarios are permissions restriction to tables, log filtering, collecting logs from AWS or GCP, O365 raw logs etc. All can be found in this webinar: [YouTube](https://www.youtube.com/watch?v=FStpHl0NRM8), [MP4](https://aka.ms/AS_LogCollectionScenarios_V3.0_18MAR2021_MP4), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmhx-_hfIf0Ng3aM_G).

The first piece of information you'll see for each connector is its **data ingestion method**. The method that appears there will be a link to one of the following generic deployment procedures, which contain most of the information you'll need to connect your data sources to Microsoft Sentinel:

|Data ingestion method | Linked article with instructions |
| ----------- | ----------- |
| Azure service-to-service integration     | [Connect to Azure, Windows, Microsoft, and Amazon services](connect-azure-windows-microsoft-services.md)     |
| Common Event Format (CEF) over Syslog	  | [Get CEF-formatted logs from your device or appliance into Microsoft Sentinel](connect-common-event-format.md) |
| Microsoft Sentinel Data Collector API | [Connect your data source to the Microsoft Sentinel Data Collector API to ingest data](connect-rest-api-template.md) |
| Azure Functions and the REST API | [Use Azure Functions to connect Microsoft Sentinel to your data source](connect-azure-functions-template.md) |
| Syslog | [Collect data from Linux-based sources using Syslog](connect-syslog.md) |
| Custom logs | [	Collect data in custom log formats to Microsoft Sentinel with the Log Analytics agent](connect-custom-logs.md) |

If your source isn't available, you can [create a custom connector](create-custom-connector.md). Custom connectors use the ingestion API and therefore are similar to direct sources. Custom connectors are most often implemented using Logic Apps, offering a codeless option, or Azure Functions.

### Module 5: Log management

While 'how many workspaces and which ones to use' is the first architecture question to ask when configuring Sentinel, there are other log management architectural decisions to consider: 
* Where and how long to retain data
* How to best manage access to data and secure it

#### Ingest, Archive, Search, and Restore Data within Microsoft Sentinel

Watch the webinar: Manage Your Log Lifecycle with New Methods for Ingestion, Archival, Search, and Restoration, [here](https://www.youtube.com/watch?v=LgGpSJxUGoc&ab_channel=MicrosoftSecurityCommunity).


This suite of features contains:

* **Basic ingestion tier**: new pricing tier for Azure Log Analytics that allows for logs to be ingested at a lower cost. This data is only retained in the workspace for eight days total.
* **Archive tier**: Azure Log Analytics has expanded its retention capability from two years to seven years. With the new tier, it will allow data to be retained up to seven years in a low-cost archived state.
* **Search jobs**: search tasks that run limited KQL in order to find and return all relevant logs to what is searched. These jobs search data across the analytics tier, basic tier. and archived data.
* **Data restoration**: new feature that allows users to pick a data table and a time range in order to restore data to the workspace via restore table.

Learn more about these new features in [this article](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/ingest-archive-search-and-restore-data-in-microsoft-sentinel/ba-p/3195126).

#### Alternative retention options outside of the Microsoft Sentinel platform

If you want to retain data for _more than two years_, or _reduce the retention cost_, you can consider using Azure Data Explorer for long-term retention of Microsoft Sentinel logs: [Webinar Slides](https://onedrive.live.com/?authkey=%21AGe3Zue4W0xYo4s&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21963&parId=66C31D2DBF8E0F71%21954&o=OneUp), [Webinar Recording](https://www.youtube.com/watch?v=UO8zeTxgeVw&ab_channel=MicrosoftSecurityCommunity), [Blog](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/using-azure-data-explorer-for-long-term-retention-of-microsoft/ba-p/1883947).

Need more depth? Watch the _Improving the Breadth and Coverage of Threat Hunting with ADX Support, More Entity Types, and Updated MITRE Integration_ webinar [here](https://www.youtube.com/watch?v=5coYjlw2Qqs&ab_channel=MicrosoftSecurityCommunity).

If you prefer another long-term retention solution, [export from Microsoft Sentinel / Log Analytics to Azure Storage and Event Hubs](/cli/azure/monitor/log-analytics/workspace/data-export) or [move Logs to Long-Term Storage using Logic Apps](../azure-monitor/logs/logs-export-logic-app.md). The latter advantage is that it can export historical data.
Lastly, you can set fine-grained retention periods using [table-level retention Settings](https://techcommunity.microsoft.com/t5/core-infrastructure-and-security/azure-log-analytics-data-retention-by-type-in-real-life/ba-p/1416287). More details [here](../azure-monitor/logs/data-retention-archive.md).


#### Log Security

* Use [resource RBAC](https://techcommunity.microsoft.com/t5/azure-sentinel/controlling-access-to-azure-sentinel-data-resource-rbac/ba-p/1301463) or [Table Level RBAC](../azure-monitor/logs/manage-access.md) to enable multiple teams to use a single workspace.
* If needed, [delete customer content from your workspaces](../azure-monitor/logs/personal-data-mgmt.md).
* Learn how to [audit workspace queries and Microsoft Sentinel use, using alerts workbooks and queries](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/auditing-microsoft-sentinel-activities/ba-p/1718328).
* Use [private links](../azure-monitor/logs/private-link-security.md) to ensure logs never leave your private network.


#### Dedicated cluster

Use a [dedicated workspace cluster](../azure-monitor/logs/logs-dedicated-clusters.md) if your projected data ingestion is around or more than 500 GB per day. A dedicated cluster enables you to secure resources for your Microsoft Sentinel data, which enables better query performance for large data sets.


### Module 6: Enrichment: TI, Watchlists, and more

One of the important functions of a SIEM is to apply contextual information to the event steam, enabling detection, alert prioritization, and incident investigation. Contextual information includes, for example, threat intelligence, IP intelligence, host and user information, and watchlists

Microsoft Sentinel provides comprehensive tools to import, manage, and use threat intelligence. For other types of contextual information, Microsoft Sentinel provides Watchlists, and other alternative solutions.

#### Threat Intelligence

Threat Intelligence is an important building block of a SIEM. Watch the Explore the Power of Threat Intelligence in Microsoft Sentinel webinar [here](https://www.youtube.com/watch?v=i29Uzg6cLKc&ab_channel=MicrosoftSecurityCommunity).

In Microsoft Sentinel, you can integrate Threat Intelligence (TI) using the built-in connectors from TAXII servers or through the Microsoft Graph Security API. Read more on how to in the [documentation](threat-intelligence-integration.md). For more information about importing Threat Intelligence, see the data collection modules. 

Once imported, [Threat Intelligence](understand-threat-intelligence.md) is used extensively throughout Microsoft Sentinel. The following features focus on using Threat Intelligence:

* View and manage the imported threat intelligence in **Logs** in the new Threat Intelligence area of Microsoft Sentinel.
* Use the [built-in TI Analytics rule templates](understand-threat-intelligence.md#detect-threats-with-threat-indicator-based-analytics) to generate security alerts and incidents using your imported threat intelligence.
* [Visualize key information about your threat intelligence](understand-threat-intelligence.md#view-and-manage-your-threat-indicators) in Microsoft Sentinel with the Threat Intelligence workbook.

Watch the **Automate Your Microsoft Sentinel Triage Efforts with RiskIQ Threat 
Intelligence** webinar: [YouTube](https://youtu.be/8vTVKitim5c), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmkngW7psV4janJrVE?e=UkmgWk).

Short on time? watch the [Ignite session](https://www.youtube.com/watch?v=RLt05JaOnHc) (28 Minutes)

Go in-depth? Watch the Webinar: [YouTube](https://youtu.be/zfoVe4iarto), [MP4](https://1drv.ms/v/s!AnEPjr8tHcNmgi8zazMLahRyycPf), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmgi0pABN930p56id_).

#### Watchlists and other lookup mechanisms

To import and manage any type of contextual information, Microsoft Sentinel provides Watchlists. Watchlists enable you to upload data tables in CSV format and use them in your KQL queries. Read more about Watchlists in the [documentation](watchlists.md) or watch the use _Watchlists to Manage Alerts, Reduce Alert Fatigue and improve SOC efficiency_ webinar: [YouTube](https://youtu.be/148mr8anqtI), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmk1qPwVKXkyKwqsM5?e=jLlNmP).

Use watchlists to help you with following scenarios:

* **Investigate threats and respond to incidents quickly** with the rapid import of IP addresses, file hashes, and other data from CSV files. After you import the data, use watchlist name-value pairs for joins and filters in alert rules, threat hunting, workbooks, notebooks, and general queries.

* **Import business data as a watchlist**. For example, import user lists with privileged system access, or terminated employees. Then, use the watchlist to create allowlists and blocklists to detect or prevent those users from logging in to the network.

* **Reduce alert fatigue**. Create allowlists to suppress alerts from a group of users, such as users from authorized IP addresses that perform tasks that would normally trigger the alert. Prevent benign events from becoming alerts.

* **Enrich event data**. Use watchlists to enrich your event data with name-value combinations derived from external data sources.

In addition to Watchlists, you can also use the KQL externaldata operator, custom logs, and KQL functions to manage and query context information. Each one of the four methods has its pros and cons, and you can read more about the comparison between those options in the blog post ["Implementing Lookups in Microsoft Sentinel"](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/implementing-lookups-in-azure-sentinel/ba-p/1091306). While each method is different, using the resulting information in your queries is similar enabling easy switching between them.

Read ["Utilize Watchlists to Drive Efficiency During Microsoft Sentinel Investigations"](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/utilize-watchlists-to-drive-efficiency-during-microsoft-sentinel/ba-p/2090711) for ideas on using Watchlist outside of analytic rules.

Watch the **Use Watchlists to Manage Alerts, Reduce Alert Fatigue and improve
SOC efficiency** webinar. [YouTube](https://youtu.be/148mr8anqtI), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmk1qPwVKXkyKwqsM5?e=jLlNmP).


### Module 7: Log transformation

Microsoft Sentinel supports two new features for data ingestion and transformation. These features, provided by Log Analytics, act on your data even before it's stored in your workspace.

* The first of these features is the [**Logs ingestion API.**](../azure-monitor/logs/logs-ingestion-api-overview.md) It allows you to send custom-format logs from any data source to your Log Analytics workspace, and store those logs either in certain specific standard tables, or in custom-formatted tables that you create. The actual ingestion of these logs can be done by direct API calls. You can use Log Analytics [data collection rules (DCRs)](../azure-monitor/essentials/data-collection-rule-overview.md) to define and configure these workflows.

* The second feature is [**workspace data transformations for standard logs**](../azure-monitor/essentials/data-collection-transformations.md#workspace-transformation-dcr). It uses [DCRs](../azure-monitor/essentials/data-collection-rule-overview.md) to filter out irrelevant data, to enrich or tag your data, or to hide sensitive or personal information. Data transformation can be configured at ingestion time for the following types of built-in data connectors:
    * AMA-based data connectors (based on the new Azure Monitor Agent)
    * MMA-based data connectors (based on the legacy Log Analytics Agent)
    * Data connectors that use Diagnostic settings
    * [Service-to-service data connectors](data-connectors-reference.md)

For more information, see: 
* [Transform or customize data at ingestion time in Microsoft Sentinel](configure-data-transformation.md)
* [Custom data ingestion and transformation in Microsoft Sentinel](configure-data-transformation.md)
* [Find your Microsoft Sentinel data connector](data-connectors-reference.md)

### Module 8: Migration 

In many (if not most) cases, you already have a SIEM and need to migrate to Microsoft Sentinel. While it may be a good time to start over, and rethink your SIEM implementation, it makes sense to utilize some of the assets you already built in your current implementation. Watch the webinar describing best practices for converting detection rules from Splunk, QRadar, and ArcSight to Azure Sentinel Rules: [YouTube](https://youtu.be/njXK1h9lfR4), [MP4](https://aka.ms/AzSentinel_DetectionRules_19FEB21_MP4), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmhlsYDm99KLbNWlq5), [blog](https://techcommunity.microsoft.com/t5/azure-sentinel/best-practices-for-migrating-detection-rules-from-arcsight/ba-p/2216417).

You might also be interested in some of the following resources:

* [Splunk SPL to KQL mappings](https://github.com/Azure/Azure-Sentinel/blob/master/Tools/RuleMigration/SPL%20to%20KQL.md)
* [ArcSight and QRadar rule mapping samples](https://github.com/Azure/Azure-Sentinel/blob/master/Tools/RuleMigration/Rule%20Logic%20Mappings.md)

### Module 9: Advanced SIEM Information Model (ASIM) and Normalization 

Working with various data types and tables together presents a challenge. You must become familiar with different data types and schemas, write and use a unique set of analytics rules, workbooks, and hunting queries. Correlation between the different data types necessary for investigation and hunting can also be tricky.

The **Advanced SIEM Information Model (ASIM)** provides a seamless experience for handling various sources in uniform, normalized views. ASIM aligns with the Open-Source Security Events Metadata (OSSEM) common information model, promoting vendor agnostic, industry-wide normalization. Watch the Advanced SIEM Information Model (ASIM): Now built into Microsoft Sentinel webinar:  YouTube, Deck.

The current implementation is based on query time normalization using KQL functions:

* **Normalized schemas** cover standard sets of predictable event types that are easy to work with and build unified capabilities. The schema defines which fields should represent an event, a normalized column naming convention, and a standard format for the field values. 
    * Watch the _Understanding Normalization in Microsoft Sentinel_ webinar: [YouTube](https://www.youtube.com/watch?v=WoGD-JeC7ng), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmjDY1cro08Fk3KUj-?e=murYHG).
    * Watch the _Deep Dive into Microsoft Sentinel Normalizing Parsers and Normalized Content_ webinar: [YouTube](https://www.youtube.com/watch?v=zaqblyjQW6k), [MP3](https://aka.ms/AS_Normalizing_Parsers_and_Normalized_Content_11AUG2021_MP4), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmjGtoRPQ2XYe3wQDz?e=R3dWeM).
* **Parsers** map existing data to the normalized schemas. Parsers are implemented using [KQL functions](/azure/data-explorer/kusto/query/functions/user-defined-functions).  Watch the _Extend and Manage ASIM: Developing, Testing and Deploying Parsers_ webinar: [YouTube](https://youtu.be/NHLdcuJNqKw), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmk0_k0zs21rL7euHp?e=5XkTnW).
* **Content** for each normalized schema includes analytics rules, workbooks, hunting queries. This content works on any normalized data without the need to create source-specific content.
 

Using ASIM provides the following benefits:

* **Cross source detection**: Normalized analytic rules work across sources, on-premises and cloud, now detecting attacks such as brute force or impossible travel across systems including Okta, AWS, and Azure.
* **Allows source agnostic content**: the coverage of built-in and custom content using ASIM automatically expands to any source that supports ASIM, even if the source was added after the content was created. For example, process event analytics support any source that a customer may use to bring in the data, including Microsoft Defender for Endpoint, Windows Events, and Sysmon. We're ready to add [Sysmon for Linux](https://twitter.com/markrussinovich/status/1283039153920368651?lang=en) and WEF once released!
* **Support for your custom sources in built-in analytics**
* **Ease of use:** once an analyst learns ASIM, writing queries is much simpler as the field names are always the same.


#### To learn more about ASIM:

* Watch the overview webinar: [YouTube](https://www.youtube.com/watch?v=WoGD-JeC7ng), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmjDY1cro08Fk3KUj-?e=murYHG) .
* Watch the _Deep Dive into Microsoft Sentinel Normalizing Parsers and Normalized Content_ webinar: [YouTube](https://www.youtube.com/watch?v=zaqblyjQW6k), [MP3](https://aka.ms/AS_Normalizing_Parsers_and_Normalized_Content_11AUG2021_MP4), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmjGtoRPQ2XYe3wQDz?e=R3dWeM).
* Watch the _Turbocharging ASIM: Making Sure Normalization Helps Performance Rather Than Impacting It_ webinar: [YouTube](https://youtu.be/-dg_0NBIoak), [MP4](https://1drv.ms/v/s!AnEPjr8tHcNmjk5AfH32XSdoVzTJ?e=a6hCHb), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmjnQITNn35QafW5V2?e=GnCDkA).
* Read the [documentation](https://aka.ms/AzSentinelNormalization).

#### To Deploy ASIM:

* Deploy the parsers from the folders starting with “ASIM*” in the [parsers](https://github.com/Azure/Azure-Sentinel/tree/master/Parsers) folder on GitHub.
* Activate analytic rules that use ASIM. Search for “normal” in the template gallery to find some of them. To get the full list, use this [GitHub search](https://github.com/search?q=ASIM+repo%3AAzure%2FAzure-Sentinel+path%3A%2Fdetections&type=Code&ref=advsearch&l=&l=).

#### To Use ASIM:

* Use the [ASIM hunting queries from GitHub](https://github.com/Azure/Azure-Sentinel/tree/master/Hunting%20Queries)
* Use ASIM queries when using KQL in the log screen.
* Write your own analytic rules using ASIM or [convert existing ones](normalization.md).
* Write [parsers](normalization.md#asim-components) for your custom sources to make them ASIM compatible and take part in built-in analytics

## Part 3: Creating Content

What is Microsoft Sentinel's content?

Microsoft Sentinel's security value is a combination of its built-in capabilities and your capability to create custom ones and customize the built-in ones. Among built-in capabilities, there are UEBA, Machine Learning or out-of-the-box analytics rules. Customized capabilities are often referred to as "content" and include analytic rules, hunting queries, workbooks, playbooks, etc.

In this section, we grouped the modules that help you learn how to create such content or modify built-in-content to your needs.  We start with KQL, the Lingua Franca of Azure Sentinel. The following modules discuss one of the content building blocks such as rules, playbooks, and workbooks. We wrap up by discussing use cases, which encompass elements of different types to address specific security goals such as threat detection, hunting, or governance. 

### Module 10: The Kusto Query Language (KQL)

Most Microsoft Sentinel capabilities use [KQL or Kusto Query Language](/azure/data-explorer/kusto/query/). When you search in your logs, write rules, create hunting queries, or design workbooks, you use KQL.  

The next section on writing rules explains how to use KQL in the specific context of SIEM rules.

#### Below is the recommended journey for learning Sentinel KQL:
* [Pluralsight KQL course](https://www.pluralsight.com/courses/kusto-query-language-kql-from-scratch) - the basics
* [Must Learn KQL](https://aka.ms/MustLearnKQL) - A 20-part KQL series that walks through the basics to creating your first Analytics Rule. Includes an assessment and certificate.
* The Microsoft Sentinel KQL Lab: An interactive lab teaching KQL focusing on what you need for Microsoft Sentinel:
    * [Learning module (SC-200 part 4)](/learn/paths/sc-200-utilize-kql-for-azure-sentinel/)
    * [Presentation](https://onedrive.live.com/?authkey=%21AJRxX475AhXGQBE&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21740&parId=66C31D2DBF8E0F71%21446&o=OneUp), [Lab URL](https://aka.ms/lademo)
    * a [Jupyter Notebooks version](https://github.com/jjsantanna/azure_sentinel_learn_kql_lab/blob/master/azure_sentinel_learn_kql_lab.ipynb), which let you test the queries within the notebook.
    * Learning webinar: [YouTube](https://youtu.be/EDCBLULjtCM), [MP4](https://1drv.ms/v/s!AnEPjr8tHcNmglwAjUjmYy2Qn5J-);
    * Reviewing lab solutions webinar: [YouTube](https://youtu.be/YKD_OFLMpf8), [MP4](https://1drv.ms/v/s!AnEPjr8tHcNmg0EKIi5gwXyccB44?e=sF6UG5)
* [Pluralsight Advanced KQL course](https://www.pluralsight.com/courses/microsoft-azure-data-explorer-advanced-query-capabilities)
* _Optimizing Azure Sentinel KQL queries performance_: [YouTube](https://youtu.be/jN1Cz0JcLYU), [MP4](https://aka.ms/AzS_09SEP20_MP4), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmg2imjIS8NABc26b-?e=rXZrR5).
* Using ASIM in your KQL queries: [YouTube](https://www.youtube.com/watch?v=WoGD-JeC7ng), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmjDY1cro08Fk3KUj-?e=murYHG)
* _KQL Framework for Microsoft Sentinel - Empowering You to Become KQL-Savvy:_ [YouTube](https://youtu.be/j7BQvJ-Qx_k), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmkgqKSV-m1QWgkzKT?e=QAilwu).

You might also find the following references useful as you learn KQL:

* [The KQL Cheat Sheet](https://www.mbsecure.nl/blog/2019/12/kql-cheat-sheet)
* [Query optimization best practices](../azure-monitor/logs/query-optimization.md)

### Module 11: Analytics

#### Writing Scheduled Analytics Rules

Microsoft Sentinel enables you to use [built-in rule templates](detect-threats-built-in.md), customize the templates for your environment, or create custom rules. The core of the rules is a KQL query; however, there's much more than that to configure in a rule.

To learn the procedure for creating rules, read the [documentation](detect-threats-custom.md). To learn how to write rules, that is, what should go into a rule, focusing on KQL for rules, watch the webinar: [MP4](https://1drv.ms/v/s%21AnEPjr8tHcNmghlWrlBCPKwT5WTT), [YouTube](https://youtu.be/pJjljBT4ipQ), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmgmffNHf0wqmNEqdx).

SIEM analytics rules have specific patterns. Learn how to implement rules and write KQL for those patterns:  
* **Correlation rules**: [using lists and the "in" operator](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/azure-sentinel-correlation-rules-active-lists-out-make-list-in/ba-p/1029225) or using the ["join" operator](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/azure-sentinel-correlation-rules-the-join-kql-operator/ba-p/1041500)
* **Aggregation**: see using lists and the "in" operator above, or a more [advanced pattern handling sliding windows](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/handling-sliding-windows-in-azure-sentinel-rules/ba-p/1505394)
* **Lookups**: Regular, or Approximate, partial & combined lookups
* **Handling false positives**
* **Delayed events:** are a fact of life in any SIEM and are hard to tackle. Microsoft Sentinel can help you mitigate delays in your rules.
* Using KQL functions as **building blocks**: Enriching Windows Security Events with Parameterized Function.

To blog post ["Blob and File Storage Investigations"](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/microsoft-ignite-2021-blob-and-file-storage-investigations/ba-p/2175138) provides a step by step example of writing a useful analytic rule.

#### Using Built-in Analytics

Before embarking on your own rule writing, you should take advantage of the built-in analytics capabilities. They don't require much from you, but it's worthwhile learning about them:

* Use the [built-in scheduled rule templates](detect-threats-built-in.md). You can tune those templates by modifying the templates the same way to edit any scheduled rule. Make sure to deploy the templates for the data connectors you connect listed in the data connector "next steps" tab.
* Learn more about Microsoft Sentinel's [Machine learning capabilities](bring-your-own-ml.md): [MP4](https://onedrive.live.com/?authkey=%21ANHkqv1CC1rX0JE&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21772&parId=66C31D2DBF8E0F71%21770&o=OneUp), [YouTube](https://www.youtube.com/watch?v=DxZXHvq1jOs&ab_channel=MicrosoftSecurityCommunity), [Presentation](https://onedrive.live.com/?authkey=%21ACovlR%2DY24o1rzU&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21773&parId=66C31D2DBF8E0F71%21770&o=OneUp)
* Find the list of Microsoft Sentinel's [Advanced multi-stage attack detections ("Fusion") ](fusion.md) that are enabled by default.
* Watch the Fusion ML Detections with Scheduled Analytics Rules webinar: [YouTube](https://www.youtube.com/watch?v=Ee7gBAQ2Dzc), [MP4](https://onedrive.live.com/?authkey=%21AJzpplg3agpLKdo&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%211663&parId=66C31D2DBF8E0F71%211654&o=OneUp), [Presentation](https://onedrive.live.com/?cid=66c31d2dbf8e0f71&id=66C31D2DBF8E0F71%211674&ithint=file%2Cpdf&authkey=%21AD%5F1AN14N3W592M).
* Learn more about Azure Sentinel's built-in SOC-ML anomalies [here](soc-ml-anomalies.md). 
* Watch the customized SOC-ML anomalies and how to use them webinar here: [YouTube](https://www.youtube.com/watch?v=z-suDfFgSsk&ab_channel=MicrosoftSecurityCommunity), [MP4](https://onedrive.live.com/?authkey=%21AJVEGsR4ym8hVKk&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%211742&parId=66C31D2DBF8E0F71%211720&o=OneUp), [Presentation](https://onedrive.live.com/?authkey=%21AFqylaqbAGZAIfA&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%211729&parId=66C31D2DBF8E0F71%211720&o=OneUp).
* Watch the Fusion ML Detections for Emerging Threats & Configuration UI webinar here: [YouTube](https://www.youtube.com/watch?v=bTDp41yMGdk), [Presentation](https://onedrive.live.com/?cid=66c31d2dbf8e0f71&id=66C31D2DBF8E0F71%212287&ithint=file%2Cpdf&authkey=%21AIJICOTqjY7bszE).

### Module 12: Implementing SOAR

In modern SIEMs such as Microsoft Sentinel, SOAR (Security Orchestration, Automation, and Response) comprises the entire process from the moment an incident is triggered and until it's resolved. This process starts with an [incident investigation](investigate-cases.md) and continues with an [automated response](tutorial-respond-threats-playbook.md). The blog post ["How to use Microsoft Sentinel for Incident Response, Orchestration and Automation"](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/how-to-use-azure-sentinel-for-incident-response-orchestration/ba-p/2242397) provides an overview of common use cases for SOAR.

[Automation rules](automate-incident-handling-with-automation-rules.md) are the starting point for Microsoft Sentinel automation. They provide a lightweight method for central automated handling of incidents, including suppression,[ false-positive handling](false-positives.md), and automatic assignment.

To provide robust workflow based automation capabilities, automation rules use [Logic App playbooks](automate-responses-with-playbooks.md):
* Watch the Unleash the automation Jedi tricks & build Logic Apps Playbooks like a Boss Webinar: [YouTube](https://www.youtube.com/watch?v=G6TIzJK8XBA&ab_channel=MicrosoftSecurityCommunity), [MP4](https://onedrive.live.com/?authkey=%21AMHoD01Fnv0Nkeg&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21513&parId=66C31D2DBF8E0F71%21511&o=OneUp), [Presentation](https://onedrive.live.com/?authkey=%21AJK2W6MaFrzSzpw&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21514&parId=66C31D2DBF8E0F71%21511&o=OneUp).
* Read about [Logic Apps](../logic-apps/logic-apps-overview.md), which is the core technology driving Microsoft Sentinel playbooks.
*[ The Microsoft Sentinel Logic App connector](/connectors/azuresentinel/) is a link between Logic Apps and Azure Sentinel.

You can find dozens of useful Playbooks in the [Playbooks folder](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks) on the [Microsoft Sentinel GitHub](https://github.com/Azure/Azure-Sentinel), or read [_A playbook using a watchlist to Inform a subscription owner about an alert_](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/playbooks-amp-watchlists-part-1-inform-the-subscription-owner/ba-p/1768917) for a Playbook walkthrough.

### Module 13: Workbooks, reporting, and visualization

#### Workbooks

As the nerve center of your SOC, you need Microsoft Sentinel to visualize the information it collects and produces. Use workbooks to visualize data in Microsoft Sentinel.

* To learn how to create workbooks, read the [documentation](../azure-monitor/visualize/workbooks-overview.md) or watch Billy York's [Workbooks training](https://www.youtube.com/watch?v=iGiPpD_-10M&ab_channel=FestiveTechCalendar) (and [accompanying text](https://www.cloudsma.com/2019/12/azure-advent-calendar-azure-monitor-workbooks/).
* The mentioned resources aren't Microsoft Sentinel specific, and apply to Microsoft Workbooks in general. To learn more about Workbooks in Microsoft Sentinel, watch the Webinar: [YouTube](https://www.youtube.com/watch?v=7eYNaYSsk1A&list=PLmAptfqzxVEUD7-w180kVApknWHJCXf0j&ab_channel=MicrosoftSecurityCommunity), [MP4](https://onedrive.live.com/?authkey=%21ALoa5KFEhBq2DyQ&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21373&parId=66C31D2DBF8E0F71%21372&o=OneUp), [Presentation](https://onedrive.live.com/view.aspx?resid=66C31D2DBF8E0F71!374&ithint=file%2cpptx&authkey=!AD5hvwtCTeHvQLQ), and read the [documentation](monitor-your-data.md).
 
Workbooks can be interactive and enable much more than just charting. With Workbooks, you can create apps or extension modules for Microsoft Sentinel to complement built-in functionality. We also use workbooks to extend the features of Microsoft Sentinel. Few examples of such apps you can both use and learn from are:
* The [Investigation Insights Workbook](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/announcing-the-investigation-insights-workbook/ba-p/1816903) provides an alternative approach for investigating incidents.
* [Graph Visualization of External Teams Collaborations](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/graph-visualization-of-external-teams-collaborations-in-azure/ba-p/1356847) enables hunting for risky Teams use. 
* The [users' travel map workbook](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/how-to-use-azure-sentinel-to-follow-a-users-travel-and-map-their/ba-p/981716) allows investigating geo-location alerts.

* The insecure protocols workbook ([Implementation Guide](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/azure-sentinel-insecure-protocols-workbook-implementation-guide/ba-p/1197564), [recent enhancements](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/azure-sentinel-insecure-protocols-workbook-reimagined/ba-p/1558375), and [overview video](https://www.youtube.com/watch?v=xzHDWbBX6h8&list=PLmAptfqzxVEWkrUwV-B1Ob3qW-QPW_Ydu&index=9&ab_channel=MicrosoftSecurityCommunity)) lets you identify the use of insecure protocols in your network.

* Lastly, learn how to [integrate information from any source using API calls in a workbook](https://techcommunity.microsoft.com/t5/azure-sentinel/using-the-sentinel-api-to-view-data-in-a-workbook/ba-p/1386436).

You can find dozens of workbooks in the [Workbooks folder](https://github.com/Azure/Azure-Sentinel/tree/master/Workbooks) in the [Microsoft Sentinel GitHub](https://github.com/Azure/Azure-Sentinel). Some of them are available in the Microsoft Sentinel workbooks gallery as well.

#### Reporting and other visualization options

Workbooks can serve for reporting. For more advanced reporting capabilities such as reports scheduling and distribution or pivot tables, you might want to use:
* Power BI, which natively [integrates with Log Analytics and Sentinel](../azure-monitor/logs/log-powerbi.md).
* Excel, which can use [Log Analytics and Sentinel as the data source](../azure-monitor/logs/log-excel.md) (and see [video](https://www.youtube.com/watch?v=Rx7rJhjzTZA) on how).
* Jupyter notebooks covered later in the hunting module are also a great visualization tool.

### Module 14: Notebooks

Jupyter notebooks are fully integrated with Microsoft Sentinel. While considered an important tool in the hunter's tool chest and discussed the webinars in the hunting section below, their value is much broader. Notebooks can serve for advanced visualization, an investigation guide, and for sophisticated automation. 

To understand them better, watch the [Introduction to notebooks video](https://www.youtube.com/watch?v=TgRRJeoyAYw&ab_channel=MicrosoftSecurityCommunity). Get started using the Notebooks webinar ([YouTube](https://www.youtube.com/watch?v=rewdNeX6H94&ab_channel=MicrosoftSecurityCommunity), [MP4](https://onedrive.live.com/?authkey=%21ALXve0rEAhZOuP4&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21778&parId=66C31D2DBF8E0F71%21776&o=OneUp), [Presentation](https://onedrive.live.com/?authkey=%21AEQpzVDAwzzen30&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21779&parId=66C31D2DBF8E0F71%21776&o=OneUp)) or read the [documentation](notebooks.md). The [Microsoft Sentinel Notebooks Ninja series](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/becoming-a-microsoft-sentinel-notebooks-ninja-the-series/ba-p/2693491) is an ongoing training series to upskill you in Notebooks.

An important part of the integration is implemented by [MSTICPY](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/msticpy-python-defender-tools/ba-p/648929), which is a Python library developed by our research team to be used with Jupyter notebooks. It adds Microsoft Sentinel interfaces and sophisticated security capabilities to your notebooks.
* [MSTICPy Fundamentals to Build Your Own Notebooks](https://www.youtube.com/watch?v=S0knTOnA2Rk&ab_channel=MicrosoftSecurityCommunity)
* [MSTICPy Intermediate to Build Your Own Notebooks](https://www.youtube.com/watch?v=Rpj-FS_0Wqg&ab_channel=MicrosoftSecurityCommunity)

### Module 15: Use cases and solutions

Connectors, rules, playbooks, and workbooks enable you to implement **use cases**: the SIEM term for a content pack intended to detect and respond to a threat. You can deploy Sentinel built-in use cases by activating the suggested rules when connecting each Connector. A **solution** is a **group of use cases** addressing a specific threat domain.

The Webinar **"Tackling Identity"**([YouTube](https://www.youtube.com/watch?v=BcxiY32famg&ab_channel=MicrosoftSecurityCommunity), [MP4](https://onedrive.live.com/?authkey=%21AFsVrhZwut8EnB4&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21284&parId=66C31D2DBF8E0F71%21282&o=OneUp), [Presentation](https://onedrive.live.com/?authkey=%21ACSAvdeLB7JfAX8&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21283&parId=66C31D2DBF8E0F71%21282&o=OneUp)) explains what a use case is, how to approach its design, and presents several use cases that collectively address identity threats.

Another relevant solution area is **protecting remote work**. Watch our [Ignite session on protection remote work](https://www.youtube.com/watch?v=09JfbjQdzpg&ab_channel=MicrosoftSecurity), and read more on the specific use cases:
* [Microsoft Teams hunting use cases](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/protecting-your-teams-with-azure-sentinel/ba-p/1265761) and [Graph Visualization of External Microsoft Teams Collaborations](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/graph-visualization-of-external-teams-collaborations-in-azure/ba-p/1356847)
* [Monitoring Zoom with Microsoft Sentinel](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/monitoring-zoom-with-azure-sentinel/ba-p/1341516): custom connectors, analytic rules, and hunting queries.
* [Monitoring Azure Virtual Desktop with Microsoft Sentinel](../virtual-desktop/diagnostics-log-analytics.md): use Windows Security Events, Azure AD Sign-in logs, Microsoft 365 Defender for Endpoints, and AVD diagnostics logs to detect and hunt for AVD threats.
*[ Monitor Microsoft endpoint Manager / Intune](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/secure-working-from-home-deep-insights-at-enrolled-mem-assets/ba-p/1424255), using queries and workbooks.

And lastly, focusing on recent attacks, learn how to [monitor the software supply chain with Microsoft Sentinel](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/monitoring-the-software-supply-chain-with-azure-sentinel/ba-p/2176463).

**Microsoft Sentinel solutions** provide in-product discoverability, single-step deployment, and enablement of end-to-end product, domain, and/or vertical scenarios in Microsoft Sentinel. Read more about them [here](sentinel-solutions.md), and watch the **webinar about how to create your own [here](https://www.youtube.com/watch?v=oYTgaTh_NOU&ab_channel=MicrosoftSecurityCommunity).** For more about Sentinel content management in general, watch the Microsoft Sentinel Content Management webinar - [YouTube](https://www.youtube.com/watch?v=oYTgaTh_NOU&ab_channel=MicrosoftSecurityCommunity), [Presentation](https://onedrive.live.com/?cid=66c31d2dbf8e0f71&id=66C31D2DBF8E0F71%212201&ithint=file%2Cpdf&authkey=%21AIdsDXF3iluXd94).

## Part 4: Operating

### Module 16: Handling incidents

After building your SOC, you need to start using it. The "day in a SOC analyst life" webinar ([YouTube](https://www.youtube.com/watch?v=HloK6Ay4h1M&ab_channel=MicrosoftSecurityCommunity), [MP4](https://onedrive.live.com/?authkey=%21ACD%5F1nY2ND8MOmg&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21273&parId=66C31D2DBF8E0F71%21271&o=OneUp), [Presentation](https://onedrive.live.com/?authkey=%21AAvOR9OSD51OZ8c&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21272&parId=66C31D2DBF8E0F71%21271&o=OneUp)) walks you through using Microsoft Sentinel in the SOC to **triage**, **investigate** and **respond** to incidents.

[Integrating with Microsoft Teams directly from Microsoft Sentinel](collaborate-in-microsoft-teams.md) enables your teams to collaborate seamlessly across the organization, and with external stakeholders. Watch the _Decrease Your SOC’s MTTR (Mean Time to Respond) by Integrating Microsoft Sentinel with Microsoft Teams_ webinar [here](https://www.youtube.com/watch?v=0REgc2jB560&ab_channel=MicrosoftSecurityCommunity).

You might also want to read the [documentation article on incident investigation](investigate-cases.md). As part of the investigation, you'll also use the [entity pages](identify-threats-with-entity-behavior-analytics.md#entity-pages) to get more information about entities related to your incident or identified as part of your investigation.

**Incident investigation** in Microsoft Sentinel extends beyond the core incident investigation functionality. We can build **additional investigation tools** using Workbooks and Notebooks (the latter are discussed later, under _Hunting_). You can also build more investigation tools or modify existing one to your specific needs. Examples include: 
* The [Investigation Insights Workbook](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/announcing-the-investigation-insights-workbook/ba-p/1816903) provides an alternative approach for investigating incidents.
* Notebooks enhance the investigation experience. Read [_Why Use Jupyter for Security Investigations?_](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/why-use-jupyter-for-security-investigations/ba-p/475729) and learn how to investigate with Microsoft Sentinel & Jupyter Notebooks: [part 1](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/security-investigation-with-azure-sentinel-and-jupyter-notebooks/ba-p/432921), [part 2](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/security-investigation-with-azure-sentinel-and-jupyter-notebooks/ba-p/483466), and [part 3](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/security-investigation-with-azure-sentinel-and-jupyter-notebooks/ba-p/561413).

### Module 17: Hunting

While most of the discussion so far focused on detection and incident management, **hunting** is another important use case for Microsoft Sentinel. Hunting is a **proactive search for threats** rather than a reactive response to alerts. 

The hunting dashboard is constantly updated. It shows all the queries that were written by Microsoft's team of security analysts and any extra queries that you've created or modified. Each query provides a description of what it hunts for, and what kind of data it runs on. These templates are grouped by their various tactics - the icons on the right categorize the type of threat, such as initial access, persistence, and exfiltration. Read more about it [here](hunting.md).

To understand more about what hunting is and how Microsoft Sentinel supports it, watch the **Hunting Intro Webinar** ([YouTube](https://www.youtube.com/watch?v=6ueR09PLoLU&t=1451s&ab_channel=MicrosoftSecurityCommunity), [MP4](https://onedrive.live.com/?authkey=%21AO3gGrb474Bjmls&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21468&parId=66C31D2DBF8E0F71%21466&o=OneUp), [Presentation](https://onedrive.live.com/?authkey=%21AJ09hohPMbtbVKk&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21469&parId=66C31D2DBF8E0F71%21466&o=OneUp)). The webinar starts with an update on new features. To learn about hunting, start at slide 12. The YouTube link is already set to start there.

While the intro webinar focuses on tools, hunting is all about security. Our **security research team webinar on hunting** ([MP4](https://onedrive.live.com/?authkey=%21ADC2GvI1Yjlh%2D6E&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21276&parId=66C31D2DBF8E0F71%21274&o=OneUp), [YouTube](https://www.youtube.com/watch?v=BTEV_b6-vtg&ab_channel=MicrosoftSecurityCommunity), [Presentation](https://onedrive.live.com/?authkey=%21AF1uqmmrWbI3Mb8&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21275&parId=66C31D2DBF8E0F71%21274&o=OneUp)) focuses on how to actually hunt. The follow-up **AWS Threat Hunting using Sentinel Webinar** ([MP4](https://onedrive.live.com/?authkey=%21ADu7r7XMTmKyiMk&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21336&parId=66C31D2DBF8E0F71%21333&o=OneUp), [YouTube](https://www.youtube.com/watch?v=bSH-JOKl2Kk&ab_channel=MicrosoftSecurityCommunity), [Presentation](https://onedrive.live.com/?authkey=%21AA7UKQIj2wu1FiI&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21334&parId=66C31D2DBF8E0F71%21333&o=OneUp)) really drives the point by showing an end-to-end hunting scenario on a high-value target environment. Lastly, you can learn how to do [SolarWinds Post-Compromise Hunting with Microsoft Sentinel](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/solarwinds-post-compromise-hunting-with-azure-sentinel/ba-p/1995095) and [WebShell hunting](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/web-shell-threat-hunting-with-azure-sentinel/ba-p/2234968) motivated by the latest recent vulnerabilities in on-premises Microsoft Exchange servers.

### Module 18: User and Entity Behavior Analytics (UEBA)

Microsoft Sentinel newly introduced [User and Entity Behavior Analytics (UEBA)](identify-threats-with-entity-behavior-analytics.md) module enables you to identify and investigate threats inside your organization and their potential impact - whether a compromised entity or a malicious insider.

As Microsoft Sentinel collects logs and alerts from all of its connected data sources, it analyzes them and builds baseline behavioral profiles of your organization’s entities (such as **users**, **hosts**, **IP addresses**, and **applications**) across time and peer group horizon. With various techniques and machine learning capabilities, Microsoft Sentinel can then identify anomalous activity and help you determine if an asset has been compromised. Not only that, but it can also figure out the relative sensitivity of particular assets, identify peer groups of assets, and evaluate the potential impact of any given compromised asset (its “blast radius”). Armed with this information, you can effectively prioritize your investigation and incident handling.

Learn more about UEBA in the _UEBA Webinar_ ([YouTube](https://www.youtube.com/watch?v=ixBotw9Qidg&ab_channel=MicrosoftSecurityCommunity), [Presentation](https://onedrive.live.com/?authkey=%21ADXz0j2AO7Kgfv8&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21515&parId=66C31D2DBF8E0F71%21508&o=OneUp), [MP4](https://onedrive.live.com/?authkey=%21AO0122hqWUkZTJI&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%211909&parId=66C31D2DBF8E0F71%21508&o=OneUp)) and read about using [UEBA for investigations in your SOC](https://techcommunity.microsoft.com/t5/azure-sentinel/guided-ueba-investigation-scenarios-to-empower-your-soc/ba-p/1857100). 

For watching the latest updates, see [Future of Users Entity Behavioral Analytics in Sentinel webinar](https://www.youtube.com/watch?v=dLVAkSLKLyQ&ab_channel=MicrosoftSecurityCommunity).

### Module 19: Monitoring Microsoft Sentinel's health

Part of operating a SIEM is making sure it works smoothly and an evolving area in Azure Sentinel. Use the following to monitor Microsoft Sentinel's health:

* Measure the efficiency of your [Security operations](manage-soc-with-incident-metrics.md#security-operations-efficiency-workbook) ([video](https://www.youtube.com/watch?v=jRucUysVpxI&ab_channel=MicrosoftSecurityCommunity))
* **SentinelHealth data table**. Provides insights on health drifts, such as latest failure events per connector, or connectors with changes from success to failure states, which you can use to create alerts and other automated actions. Find more information [here](/azure/sentinel/monitor-data-connector-health).
* Monitor [Data connectors health](monitor-data-connector-health.md) ([video](https://www.youtube.com/watch?v=T6Vyo7gZYds&ab_channel=MicrosoftSecurityCommunity)) and [get notifications on anomalies](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/data-connector-health-push-notification-alerts/ba-p/1996442).
* Monitor agents using the [agents' health solution (Windows only)](../azure-monitor/insights/solution-agenthealth.md) and the [Heartbeat table](/azure/azure-monitor/reference/tables/heartbeat)(Linux and Windows).
* Monitor your Log Analytics workspace: [YouTube](https://www.youtube.com/watch?v=DmDU9QP_JlI&ab_channel=MicrosoftSecurityCommunity), [MP4](https://onedrive.live.com/?cid=66c31d2dbf8e0f71&id=66C31D2DBF8E0F71%21792&ithint=video%2Cmp4&authkey=%21ALgHojpWDidvFyo), [Presentation](https://onedrive.live.com/?cid=66c31d2dbf8e0f71&id=66C31D2DBF8E0F71%21794&ithint=file%2Cpdf&authkey=%21AAva%2Do6Ru1fjJ78), including query execution and ingest health.
* Cost management is also an important operational procedure in the SOC. Use the [Ingestion Cost Alert Playbook](https://techcommunity.microsoft.com/t5/azure-sentinel/ingestion-cost-alert-playbook/ba-p/2006003) to ensure you're aware in time of any cost increase. 

## Part 5: Advanced 

### Module 20: Extending and Integrating using Microsoft Sentinel APIs

As a cloud-native SIEM, Microsoft Sentinel is an API first system. Every feature can be configured and used through an API, enabling easy integration with other systems and extending Sentinel with your own code. If API sounds intimidating to you, don't worry; whatever is available using the API is [also available using PowerShell](https://techcommunity.microsoft.com/t5/azure-sentinel/new-year-new-official-azure-sentinel-powershell-module/ba-p/2025041).

To learn more about Microsoft Sentinel APIs, watch the [short introductory video](https://www.youtube.com/watch?v=gQDBkc-K-Y4&ab_channel=MicrosoftSecurityCommunity) and read the [blog post](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/microsoft-sentinel-api-101/ba-p/1438928). To get the details, watch the deep dive Webinar ([MP4](https://onedrive.live.com/?authkey=%21ACZmq6oAe1yVDmY&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21307&parId=66C31D2DBF8E0F71%21305&o=OneUp), [YouTube](https://www.youtube.com/watch?v=Cu4dc88GH1k&ab_channel=MicrosoftSecurityCommunity), [Presentation](https://onedrive.live.com/?authkey=%21AF3TWPEJKZvJ23Q&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21308&parId=66C31D2DBF8E0F71%21305&o=OneUp)) and read the blog post  [_Extending Microsoft Sentinel: APIs, Integration, and management automation_](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/extending-azure-sentinel-apis-integration-and-management/ba-p/1116885).

### Module 21: Bring your own ML

Microsoft Sentinel provides a great platform for implementing your own Machine Learning algorithms. We call it Bring-Your-Own-ML(BYOML for short). BYOML is intended for advanced users. If you're looking for built-in behavioral analytics, use our ML Analytics rules, UEBA module, or write your own behavioral analytics KQL-based analytics rules.

To start with bringing your own ML to Microsoft Sentinel, watch the [video](https://www.youtube.com/watch?v=QDIuvZbmUmc), and read the [blog post](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/build-your-own-machine-learning-detections-in-the-ai-immersed/ba-p/1750920). You might also want to refer to the [BYOML documentation](bring-your-own-ml.md).
