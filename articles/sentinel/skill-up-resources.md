---
title: Skill-up training resources
description: This article walks you through a Microsoft Sentinel level 400 training to help you skill up on Microsoft Sentinel. The training includes 22 modules that contain relevant product documentation, blog posts and other resources. Please make sure to check the most recent links for the documentation.
author: laghimpe
ms.topic: conceptual
ms.date: 05/05/2022
ms.author: laghimpe
ms.custom: fasttrack-edit
---

# Skill-up training resources

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

This article walks you through a Microsoft Sentinel level 400 training to help you skill up on Microsoft Sentinel. The training includes 22 modules that contain relevant product documentation, blog posts and other resources. Please make sure to check the most recent links for the documentation. 

The modules listed below are split into five groups following the life cycle of a Security Operation Center (SOC):

[Part 1: Overview](#part-1-overview)
- Module 0: Other learning and support options
- Module 1: Get started with Microsoft Sentinel
- Module 2: How is Microsoft Sentinel used?

[Part 2: Architecting & Deploying](#part-2-architecting--deploying)
- Module 3: Workspace and tenant architecture
- Module 4: Data collection
- Module 5: Log Management
- Module 6: Enrichment: TI, Watchlists, and more
- Module 7: Log transformation
- Module 8: Migration
- Module 9: ASIM and Normalization

[Part 3: Creating Content](#part-3-creating-content)
- Module 10: The Kusto Query Language (KQL)
- Module 11: Analytics
- Module 12: SOAR
- Module 13: Workbooks, reporting, and visualization
- Module 14: Notebooks
- Module 15: Use cases and solutions

[Part 4: Operating](#part-4-operating)
- Module 16: A day in a SOC analyst's life, incident management, and investigation
- Module 17: Hunting
- Module 18: User and Entity Behavior Analytics (UEBA) 
- Module 19: Monitoring Microsoft Sentinel's health

[Part 5: Advanced Topics](#part-5-advanced-topics)
- Module 20: Extending and Integrating using Microsoft Sentinel APIs
- Module 21: Bring your own ML

## Part 1: Overview

### Module 0: Other learning and support options

This Skill-up training is based on the [Microsoft Sentinel Ninja training](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/become-a-microsoft-sentinel-ninja-the-complete-level-400/ba-p/1246310) and is a level 400 training. If you don't want to go as deep or have a specific issue, other resources might be more suitable:

* While extensive, the Skill-up training has to follow a script and cannot expand on every topic. The [Sentinel Skill-up FAQ](#faq) tries to close this gap. 
* You can now certify with the new certification [SC-200: Microsoft Security Operations Analyst](https://docs.microsoft.com/en-us/learn/certifications/exams/sc-200) which covers Microsoft Sentinel.  You may also want to consider the [SC-900: Microsoft Security, Compliance, and Identity Fundamentals](https://docs.microsoft.com/en-us/learn/certifications/exams/sc-900) or the [AZ-500: Microsoft Azure Security Technologies](https://docs.microsoft.com/en-us/learn/certifications/exams/az-500), for a broader, higher level view of the Microsoft Security suite.
* Already skilled-up on Microsoft Sentinel? Just keep track of [what's new](https://docs.microsoft.com/en-us/azure/sentinel/whats-new) or join the [Private Preview](https://forms.office.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbR-kibZAPJAVBiU46J6wWF_5URDFSWUhYUldTWjdJNkFMVU1LTEU4VUZHMy4u) program for an earlier glimpse. 
* Have a good feature idea you want to share with us? Let us know on the [Microsoft Sentinel user voice page](https://feedback.azure.com/d365community/forum/37638d17-0625-ec11-b6e6-000d3a4f07b8).
* Premier customer? You might want the on-site (or remote)  4-day Microsoft Sentinel Fundamentals Workshop. Contact your Customer Success Account Manager for more details.
* Have a specific issue? Ask (or answer other) on the [Microsoft Sentinel Tech Community](https://techcommunity.microsoft.com/t5/microsoft-sentinel/bd-p/MicrosoftSentinel). As a last resort, send an e-mail to <MicrosoftSentinel@microsoft.com>.


### Module 1: Get started with Microsoft Sentinel

Microsoft Sentinel is a **scalable, cloud-native, security information event management (SIEM) and security orchestration automated response (SOAR) solution**. Azure Sentinel delivers intelligent security analytics and threat intelligence across the enterprise, providing a single solution for alert detection, threat visibility, proactive hunting, and threat response. [Read more.](https://docs.microsoft.com/en-us/azure/sentinel/overview?wt.mc_id=SecNinja_sentinelninjatraining)


If you want to get an initial overview of Microsoft Sentinel's technical capabilities, the [latest Ignite presentation](https://www.youtube.com/watch?v=kGctnb4ddAE) is a good starting point. You might also find the [Quick Start Guide to Microsoft Sentinel](https://azure.microsoft.com/en-us/resources/quick-start-guide-to-azure-sentinel/) useful (requires registration). A more detailed overview, however somewhat dated, can be found in this webinar: [MP4](https://1drv.ms/v/s%21AnEPjr8tHcNmggMkcVweWOqoxuN9), [YouTube](https://youtu.be/7An7BB-CcQI), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmgjrN_zHpzbnfX_mX).


Lastly, want to try it yourself? The Microsoft Sentinel All-In-One Accelerator  ([blog](https://techcommunity.microsoft.com/t5/azure-sentinel/azure-sentinel-all-in-one-accelerator/ba-p/1807933), [Youtube](https://youtu.be/JB73TuX9DVs), [MP4](https://aka.ms/AzSentinel_04FEB2021_MP4), [presentation](https://1drv.ms/b/s!AnEPjr8tHcNmhjw41XZvVSCSNIuX)) presents an easy way to get you started. To learn how to start yourself, review the [onboarding documentation](https://docs.microsoft.com/en-us/azure/sentinel/quickstart-onboard), or watch [Insight's Sentinel setup and configuration video](https://www.youtube.com/watch?v=Cyd16wVwxZc).


**Learn from users**

Thousands of organizations and service providers are using Microsoft Sentinel. As usual with security products, most do not go public about that. Still, there are some.

* You can find [public customer use cases here](https://customers.microsoft.com/en-us/search?sq=%22Azure%20Sentinel%20%22&ff=&p=0&so=story_publish_date%20desc)
* [Insight](https://www.insightcdct.com/) released a use case about [an NBA team adapting Sentinel](https://www.insightcdct.com/Resources/Case-Studies/Case-Studies/NBA-Team-Adopts-Azure-Sentinel-for-a-Modern-Securi).
* Stuart Gregg, Security Operations Manager @ ASOS, posted a much more detailed [blog post from Microsoft Sentinel's experience, focusing on hunting](https://medium.com/@stuart.gregg/proactive-phishing-with-azure-sentinel-part-1-b570fff3113).
 

**Learn from Analysts**
* [Microsoft Sentinel is a Leader placement in Forrester Wave.](https://www.microsoft.com/security/blog/2020/12/01/azure-sentinel-achieves-a-leader-placement-in-forrester-wave-with-top-ranking-in-strategy/)
* [Microsoft named a Visionary in the 2021 Gartner Magic Quadrant for SIEM for Microsoft Sentinel.](https://www.microsoft.com/security/blog/2021/07/08/microsoft-named-a-visionary-in-the-2021-gartner-magic-quadrant-for-siem-for-azure-sentinel/)


### Module 2: How is Microsoft Sentinel used?

Many users use Microsoft Sentinel as their primary SIEM. Most of the modules in this course cover this use case. In this module, we present a few additional ways to use Microsoft Sentinel.

**As part of the Microsoft Security stack**

Use Sentinel, Azure Defender, Microsoft 365 Defender  in tandem to protect your Microsoft workloads, including Windows, Azure, and Office:

* Read more about [our comprehensive SIEM+XDR solution combining Microsoft Sentinel and Microsoft 365 Defender](https://techcommunity.microsoft.com/t5/azure-sentinel/whats-new-azure-sentinel-and-microsoft-365-defender-incident/ba-p/2191090).
* Read [The Azure Security compass](https://aka.ms/azuresecuritycompass) to understand Microsoft's blueprint for your security operations.
* Read and watch how such a setup helps detect and respond to a WebShell attack: [Blog](https://techcommunity.microsoft.com/t5/azure-sentinel/analysing-web-shell-attacks-with-azure-defender-data-in-azure/ba-p/1724130), [Video demo](https://techcommunity.microsoft.com/t5/video-hub/webshell-attack-deep-dive/m-p/1698964).
* Watch the webinar: [Better Together | OT and IoT Attack Detection, Investigation and Response](https://youtu.be/S8DlZmzYO2s).


**To monitor your multi-cloud workloads**

The cloud is (still) new and often not monitored as extensively as on-prem workloads. Read this [presentation](https://techcommunity.microsoft.com/gxcuf89792/attachments/gxcuf89792/AzureSentinelBlog/243/1/L400-P2%20Use%20cases.pdf) to learn how Microsoft Sentinel can help you close the cloud monitoring gap across your clouds.

**Side by side with your existing SIEM**

Either for a transition period or a longer term, if you are using Microsoft Sentinel for your cloud workloads, you may be using Microsoft Sentinel alongside your existing SIEM. You might also be using both with a ticketing system such as Service Now. 

For more information on migrating from another SIEM to Microsoft Sentinel, watch the migration webinar: [MP4](https://aka.ms/AzSentinel_DetectionRules_19FEB21_MP4), [YouTube](https://youtu.be/njXK1h9lfR4), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmhlsYDm99KLbNWlq5).


There are three common scenarios for side by side deployment:

* A best practice, if you have a ticketing system in your SOC, is to send alerts, or incidents, from both SIEM systems to a ticketing system such as Service Now, for example, using [Microsoft Sentinel Incident Bi-directional sync with ServiceNow](https://techcommunity.microsoft.com/t5/azure-sentinel/azure-sentinel-incident-bi-directional-sync-with-servicenow/ba-p/1667771) or by [sending alerts enriched with supporting events from Microsoft Sentinel to 3rd party SIEMs](https://techcommunity.microsoft.com/t5/azure-sentinel/sending-alerts-enriched-with-supporting-events-from-azure/ba-p/1456976).
* At least initially, many users send alerts from Microsoft Sentinel to your on-prem SIEM. Read on how to do it in [Sending alerts enriched with supporting events from Microsoft Sentinel to 3rd party SIEMs](https://techcommunity.microsoft.com/t5/azure-sentinel/sending-alerts-enriched-with-supporting-events-from-azure/ba-p/1456976).
* Over time, as Microsoft Sentinel covers more workloads, it is typical to reverse that and send alerts from your on-prem SIEM to Microsoft Sentinel. To do that:
    * With Splunk, read [Send data and notable events from Splunk to Microsoft Sentinel using the Microsoft Sentinel Splunk ....](https://techcommunity.microsoft.com/t5/azure-sentinel/how-to-export-data-from-splunk-to-azure-sentinel/ba-p/1891237)
    * With QRadar read [Sending QRadar offenses to Microsoft Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/migrating-qradar-offenses-to-azure-sentinel/ba-p/2102043)
    * For ArcSight, use [CEF Forwarding](https://community.microfocus.com/t5/Logger-Forwarding-Connectors/ArcSight-Forwarding-Connector-Configuration-Guide/ta-p/1583918).

You can also send the alerts from Microsoft Sentinel to your 3rd party SIEM or ticketing system using the [Graph Security API](https://docs.microsoft.com/en-us/graph/security-integration), which is simpler but would not enable sending additional data. 


**For MSSPs**
Since it eliminates the setup cost and is location agnostics, Microsoft Sentinel is a popular choice for providing SIEM-as-a-service. You can find a [list of MISA (Microsoft Intelligent Security Association) member managed security service providers (MSSPs) using Microsoft Sentinel](https://www.microsoft.com/security/blog/2020/07/14/microsoft-intelligent-security-association-managed-security-service-providers/). Many other MSSPs, especially regional and smaller ones, use Microsoft Sentinel but are not MISA members.

To start your journey as an MSSP, you should read the [Microsoft Sentinel Technical Playbooks for MSSPs](http://aka.ms/azsentinelmssp). More information about MSSP support is included in the next module, cloud architecture and multi-tenant support.  

## Part 2: Architecting & Deploying

While the previous section offers options to start using Microsoft Sentinel in a matter of minutes, before you start a production deployment, you need to plan. This section walks you through the areas that you need to consider when architecting your solution, as well as provides guidelines on how to implement your design:

* Workspace and tenant architecture
* Data collection 
* Log management
* Threat Intelligence acquisition

### Module 3: Wokrspace and tenant architecture

A Microsoft Sentinel instance is called a workspace. The workspace is the same as a Log Analytics workspace and supports any Log Analytics capability. You can think of Sentinel as a solution that adds SIEM features on top of a Log Analytics workspace.

Multiple workspaces are often necessary and can act together as a single Microsoft Sentinel system. A special use case is providing service using Microsoft Sentinel, for example, by an **MSSP** (Managed Security Service Provider) or by a **Global SOC** in a large organization. 

To learn more about why use multiple workspaces and use them as one Microsoft Sentinel system, read [Extend Microsoft Sentinel across workspaces and tenants](https://docs.microsoft.com/en-us/azure/sentinel/extend-sentinel-across-workspaces-tenants) or, if you prefer, the Webinar version: [MP4](https://1drv.ms/v/s!AnEPjr8tHcNmgkqH7MASAKIg8ql8), [YouTube](https://youtu.be/hwahlwgJPnE), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmgkkYuxOITkGSI7x8).

There are a few specific areas that require your consideration when using multiple workspaces:
* An important driver for using multiple workspaces is **data residency**. Read more about [Microsoft Sentinel data residency](https://docs.microsoft.com/en-us/azure/sentinel/quickstart-onboard#geographical-availability-and-data-residency).
* To deploy Microsoft Sentinel and manage content efficiently across multiple workspaces; you would like to manage Sentinel as code using **CI/CD technology**. This is, in general, a recommended best practice for Microsoft Sentinel:
    * Read [Enable Continuous Deployment Natively with Microsoft Sentinel Repositories!](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/enable-continuous-deployment-natively-with-microsoft-sentinel/ba-p/2929413)
* When managing multiple workspaces as an MSSP, you may want to [protect the MSSP’s Intellectual Property in Microsoft Sentinel](https://docs.microsoft.com/en-us/azure/sentinel/mssp-protect-intellectual-property).

The [Microsoft Sentinel Technical Playbook for MSSPs](http://aka.ms/azsentinelmssp) provides detailed guidelines for many of those topics, and is useful also for large organizations, not just to MSSPs.

### Module 4: Data Collection

The foundation of a SIEM is collecting telemetry: events, alerts, and contextual enrichment information such as Threat Intelligence, vulnerability data, and asset information. You can find a list of sources you can connect here:
* [Microsoft Sentinel data connectors](https://docs.microsoft.com/en-us/azure/sentinel/connect-data-sources)
* [Find your Microsoft Sentinel data connector](https://docs.microsoft.com/en-us/azure/sentinel/data-connectors-reference) for seeing all the listed supported, out-of-the-box data connectors, together with links to generic deployment procedures, and extra steps required for specific connectors. 
* Data Collection Scenarios: Learn more about a variety of solutions for log collection methods such as [Logstash/CEF/WEF](https://docs.microsoft.com/en-us/azure/sentinel/connect-logstash) and scenarios we often encounter such as permissions restriction to tables, log filtering, collecting logs from AWS/GCP, O365 raw logs and more in this webinar [YouTube](https://www.youtube.com/watch?v=FStpHl0NRM8), [MP4](https://aka.ms/AS_LogCollectionScenarios_V3.0_18MAR2021_MP4), [Presentiation](https://1drv.ms/b/s!AnEPjr8tHcNmhx-_hfIf0Ng3aM_G).

The first piece of information you'll see for each connector is its **data ingestion method**. The method that appears there will be a link to one of the following generic deployment procedures, which contain most of the information you'll need to connect your data sources to Microsoft Sentinel:

|Data ingestion method | Linked article with instructions |
| ----------- | ----------- |
| Azure service-to-service integration     | [Connect to Azure, Windows, Microsoft, and Amazon services](https://docs.microsoft.com/en-us/azure/sentinel/connect-azure-windows-microsoft-services)     |
| Common Event Format (CEF) over Syslog	  | [Get CEF-formatted logs from your device or appliance into Microsoft Sentinel](https://docs.microsoft.com/en-us/azure/sentinel/connect-common-event-format) |
| Microsoft Sentinel Data Collector API | [Connect your data source to the Microsoft Sentinel Data Collector API to ingest data](https://docs.microsoft.com/en-us/azure/sentinel/connect-rest-api-template) |
| Azure Functions and the REST API | [Use Azure Functions to connect Microsoft Sentinel to your data source](https://docs.microsoft.com/en-us/azure/sentinel/connect-azure-functions-template) |
| Syslog | [Collect data from Linux-based sources using Syslog](https://docs.microsoft.com/en-us/azure/sentinel/connect-syslog) |
| Custom logs | [	Collect data in custom log formats to Microsoft Sentinel with the Log Analytics agent](https://docs.microsoft.com/en-us/azure/sentinel/connect-custom-logs) |

If your source is not available, you can [create a custom connector](https://docs.microsoft.com/en-us/azure/sentinel/create-custom-connector). Custom connectors use the ingestion API and therefore are similar to direct sources. Custom connectors are most often implemented using Logic Apps, offering a codeless option, or Azure Functions.

### Module 5: Log management

While 'how many workspaces and which ones to use' is the first architecture question to ask when configuring Sentinel,  ther are additional log management architectural decisions to consider: 
* Where and how long to retain data.
* How to best manage access to data and secure it.

**Ingest, Archive, Search, and Restore Data within Microsoft Sentinel**

Watch the webinar: Manage Your Log Lifecycle with New Methods for Ingestion, Archival, Search, and Restoration, [here](https://www.youtube.com/watch?v=LgGpSJxUGoc&ab_channel=MicrosoftSecurityCommunity).

This suite of features contains:

* **Basic ingestion tier**: new pricing tier for Azure Log Analytics that allows for logs to be ingested at a lower cost. This data is only retained in the workspace for 8 days total.
* **Archive tier**: Azure Log Analytics has expanded its retention capability from 2 years to 7 years. With that, this new tier for data will allow for the data to be retained up to 7 years in a low-cost archived state.
* **Search jobs**: search tasks that run limited KQL in order to find and return all relevant logs to what is searched. These jobs search data across the analytics tier, basic tier. and archived data.
* **Data restoration**: new feature that allows users to pick a data table and a time range in order to restore data to the workspace via restore table.

Learn more about these new features in [this article](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/ingest-archive-search-and-restore-data-in-microsoft-sentinel/ba-p/3195126).

**Alternative retention options outside of the Microsoft Sentinel platform**

If you want to retain data for _more than two years_ or _reduce the retention cost_, you can consider using Azure Data Explorer for long-term retention of Microsoft Sentinel logs: [Webinar Slides](https://onedrive.live.com/?authkey=%21AGe3Zue4W0xYo4s&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21963&parId=66C31D2DBF8E0F71%21954&o=OneUp), [Webinar Recording](https://www.youtube.com/watch?v=UO8zeTxgeVw&ab_channel=MicrosoftSecurityCommunity), [Blog](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/using-azure-data-explorer-for-long-term-retention-of-microsoft/ba-p/1883947).

Need more depth? Watch the Improving the Breadth and Coverage of Threat Hunting with ADX Support, More Entity Types, and Updated MITRE Integration webinar [here](https://www.youtube.com/watch?v=5coYjlw2Qqs&ab_channel=MicrosoftSecurityCommunity).

If you prefer another long-term retention solution, [export from Microsoft Sentinel / Log Analytics to Azure Storage and Event Hub](https://docs.microsoft.com/en-us/cli/azure/monitor/log-analytics/workspace/data-export?view=azure-cli-latest&viewFallbackFrom=azure-cli-latest) or [move Logs to Long-Term Storage using Logic Apps](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/logs-export-logic-app). The latter advantage is that it can export historical data.
Lastly, you can set fine-grained retention periods using [table-level retention Settings](https://techcommunity.microsoft.com/t5/core-infrastructure-and-security/azure-log-analytics-data-retention-by-type-in-real-life/ba-p/1416287). More details [here](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/data-retention-archive?tabs=portal-1%2Cportal-2#configure-the-default-workspace-retention-policy).

**Log Security**

* Use [resource RBAC](https://techcommunity.microsoft.com/t5/azure-sentinel/controlling-access-to-azure-sentinel-data-resource-rbac/ba-p/1301463) or [table Level RBAC](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/manage-access?tabs=portal#table-level-rbac) to enable multiple teams to use a single workspace.
* If needed, [delete PII data from your workspaces](https://docs.microsoft.com/en-gb/azure/azure-monitor/logs/personal-data-mgmt).
* Learn how to [audit workspace queries and Microsoft Sentinel use, using alerts workbooks and queries](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/auditing-microsoft-sentinel-activities/ba-p/1718328).
* Use [private links](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/private-link-security) to ensure logs never leave your private network.

**Dedicated cluster**

Use a [dedicated workspace cluster](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/logs-dedicated-clusters) if your projected data ingestion is around or more than 500 GB per day. A dedicated cluster enables you to secure resources for your Microsoft Sentinel data, which enables better query performance for large data sets.

### Module 6: Enrichment: TI, Watchlists, and more

One of the important functions of a SIEM is to apply contextual information to the event steam, enabling detection, alert prioritization, and incident investigation. Contextual information includes, for example, threat intelligence, IP intelligence, host and user information, and watchlists

Microsoft Sentinel provides comprehensive tools to import, manage, and use threat intelligence. For other types of contextual information, Microsoft Sentinel provides Watchlists, as well as alternative solutions.

**Threat Intelligence**

Threat Intelligence is an important building block of a SIEM. Watch the Explore the Power of Threat Intelligence in Microsoft Sentinel webinar [here](https://www.youtube.com/watch?v=i29Uzg6cLKc&ab_channel=MicrosoftSecurityCommunity).

In Microsoft Sentinel, you can integrate threat intelligence (TI) using the built-in connectors from TAXII servers or through the Microsoft Graph Security API. Read more on how to in the [documentation](https://docs.microsoft.com/en-us/azure/sentinel/threat-intelligence-integration). Refer to the data collection modules for more information about importing Threat Intelligence. 

Once imported, [Threat Intelligence](https://docs.microsoft.com/en-us/azure/sentinel/understand-threat-intelligence#manage-your-threat-indicators-in-the-new-threat-intelligence-area-of-azure-sentinel) is used extensively throughout Microsoft Sentinel and is weaved into the different modules. The following features focus on using Threat Intelligence:

* View and manage the imported threat intelligence in **Logs** in the new Threat Intelligence area of Microsoft Sentinel.
* Use the [built-in TI Analytics rule templates](https://docs.microsoft.com/en-us/azure/sentinel/understand-threat-intelligence#detect-threats-with-threat-indicator-based-analytics) to generate security alerts and incidents using your imported threat intelligence.
* [Visualize key information about your threat intelligence](https://docs.microsoft.com/en-us/azure/sentinel/understand-threat-intelligence#view-and-manage-your-threat-indicators) in Microsoft Sentinel with the Threat Intelligence workbook.

Watch the **Automate Your Microsoft Sentinel Triage Efforts with RiskIQ Threat 
Intelligence** webinar: [YouTube](https://youtu.be/8vTVKitim5c), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmkngW7psV4janJrVE?e=UkmgWk).

Short on time? watch the [Ignite session](https://www.youtube.com/watch?v=RLt05JaOnHc) (28 Minutes)

Go in-depth? Watch the Webinar: [YouTube](https://youtu.be/zfoVe4iarto), [MP4](https://1drv.ms/v/s!AnEPjr8tHcNmgi8zazMLahRyycPf), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmgi0pABN930p56id_).

**Watchlists and other lookup mechanisms**

To import and manage any type of contextual information, Microsoft Sentinel provides Watchlists, which enable you to upload data tables in CSV format and use them in your KQL queries. Read more about Watchlists in the [documentation](https://docs.microsoft.com/en-us/azure/sentinel/watchlists) or watch the use Watchlists to Manage Alerts, Reduce Alert Fatigue and improve SOC efficiency webinar: [YouTube](https://youtu.be/148mr8anqtI), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmk1qPwVKXkyKwqsM5?e=jLlNmP).

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

1. The first of these features is the [**custom logs API.**](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/custom-logs-overview) It allows you to send custom-format logs from any data source to your Log Analytics workspace, and store those logs either in certain specific standard tables, or in custom-formatted tables that you create. The actual ingestion of these logs can be done by direct API calls. You can use Log Analytics [data collection rules (DCRs)](https://docs.microsoft.com/en-us/azure/azure-monitor/essentials/data-collection-rule-overview) to define and configure these workflows.

2. The second feature is [**ingestion-time data transformation for standard logs**](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/ingestion-time-transformations). It uses [DCRs](https://docs.microsoft.com/en-us/azure/azure-monitor/essentials/data-collection-rule-overview) to filter out irrelevant data, to enrich or tag your data, or to hide sensitive or personal information. Data transformation can be configured at ingestion time for the following types of built-in data connectors:
    * AMA-based data connectors (based on the new Azure Monitor Agent)
    * MMA-based data connectors (based on the legacy Log Analytics Agent)
    * Data connectors that use Diagnostic settings
    * [Service-to-service data connectors](https://docs.microsoft.com/en-us/azure/sentinel/data-connectors-reference)

For more information, see: 
* [Transform or customize data at ingestion time in Microsoft Sentinel](https://docs.microsoft.com/en-us/azure/sentinel/configure-data-transformation)
* [Custom data ingestion and transformation in Microsoft Sentinel](https://docs.microsoft.com/en-us/azure/sentinel/data-transformation)
* [Find your Microsoft Sentinel data connector](https://docs.microsoft.com/en-us/azure/sentinel/data-connectors-reference)

### Module 8: Migration 

In many (if not most) cases, you already have a SIEM and need to migrate to Microsoft Sentinel. While it may be a good time to start over and rethink your SIEM implementation, it makes sense to utilize some of the assets you already built in your current implementation. To start watch our webinar describing best practices for converting detection rules from Splunk, QRadar, and ArcSight to Azure Sentinel Rules: [YouTube](https://youtu.be/njXK1h9lfR4), [MP4](https://aka.ms/AzSentinel_DetectionRules_19FEB21_MP4), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmhlsYDm99KLbNWlq5), [blog](https://techcommunity.microsoft.com/t5/azure-sentinel/best-practices-for-migrating-detection-rules-from-arcsight/ba-p/2216417).

You might also be interested in some of the following additional resources:

* [Splunk SPL to KQL mappings](https://github.com/Azure/Azure-Sentinel/blob/master/Tools/RuleMigration/SPL%20to%20KQL.md)
* [ArcSight and QRadar rule mapping samples](https://github.com/Azure/Azure-Sentinel/blob/master/Tools/RuleMigration/Rule%20Logic%20Mappings.md)

### Module 9: Advanced SIEM Information Model (ASIM) and Normalization 

Working with various data types and tables together presents a challenge. You must become familiar with many different data types and schemas, write and use a unique set of analytics rules, workbooks, and hunting queries for each, even for those that share commonalities (for example, DNS servers). Correlation between the different data types necessary for investigation and hunting is also tricky.

The **Advanced SIEM Information Model (ASIM)** provides a seamless experience for handling various sources in uniform, normalized views. ASIM aligns with the Open-Source Security Events Metadata (OSSEM) common information model, promoting vendor agnostic, industry-wide normalization. Watch the Advanced SIEM Information Model (ASIM): Now built into Microsoft Sentinel webinar:  YouTube, Deck.

The current implementation is based on query time normalization using KQL functions and includes the following:

* **Normalized schemas** cover standard sets of predictable event types that are easy to work with and build unified capabilities. The schema defines which fields should represent an event, a normalized column naming convention, and a standard format for the field values. 
    * Watch the _Understanding Normalization in Microsoft Sentinel_ webinar: [YouTube](https://www.youtube.com/watch?v=WoGD-JeC7ng), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmjDY1cro08Fk3KUj-?e=murYHG).
    * Watch the _Deep Dive into Microsoft Sentinel Normalizing Parsers and Normalized Content_ webinar: [YouTube](https://www.youtube.com/watch?v=zaqblyjQW6k), [MP3](https://aka.ms/AS_Normalizing_Parsers_and_Normalized_Content_11AUG2021_MP4), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmjGtoRPQ2XYe3wQDz?e=R3dWeM).
* **Parsers** map existing data to the normalized schemas. Parsers are implemented using [KQL functions](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/functions/user-defined-functions).  Watch the _Extend and Manage ASIM: Developing, Testing and Deploying Parsers_ webinar: [YouTube](https://youtu.be/NHLdcuJNqKw), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmk0_k0zs21rL7euHp?e=5XkTnW).
* **Content** for each normalized schema includes analytics rules, workbooks, hunting queries, and additional content. This content works on any normalized data without the need to create source-specific content.
 

Using ASIM provides the following benefits:

* **Cross source detection**: Normalized analytic rules work across sources, on-prem and cloud, now detecting attacks such as brute force or impossible travel across systems including Okta, AWS, and Azure.
* **Allows source agnostic content**: the coverage of built-in as well as custom content using ASIM automatically expands to any source that supports ASIM, even if the source was added after the content was created. For example, process event analytics support any source that a customer may use to bring in the data, including Defender for Endpoint, Windows Events, and Sysmon. We are ready to add [Sysmon for Linux](https://twitter.com/markrussinovich/status/1283039153920368651?lang=en) and WEF once released!
* **Support for your custom sources in built-in analytics**
* **Ease of use:** once an analyst learns ASIM, writing queries is much simpler as the field names are always the same.


**To learn more about ASIM:**

* Watch the overview webinar: [YouTube](https://www.youtube.com/watch?v=WoGD-JeC7ng), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmjDY1cro08Fk3KUj-?e=murYHG) .
* Watch the _Deep Dive into Microsoft Sentinel Normalizing Parsers and Normalized Content_ webinar: [YouTube](https://www.youtube.com/watch?v=zaqblyjQW6k), [MP3](https://aka.ms/AS_Normalizing_Parsers_and_Normalized_Content_11AUG2021_MP4), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmjGtoRPQ2XYe3wQDz?e=R3dWeM).
* Watch the _Turbocharging ASIM: Making Sure Normalization Helps Performance Rather Than Impacting It_ webinar: [YouTube](https://youtu.be/-dg_0NBIoak), [MP4](https://1drv.ms/v/s!AnEPjr8tHcNmjk5AfH32XSdoVzTJ?e=a6hCHb), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmjnQITNn35QafW5V2?e=GnCDkA).
* Read the [documentation](https://aka.ms/AzSentinelNormalization).

**To Deploy ASIM:**

* Deploy the parsers from the folders starting with “ASIM*” in the [parsers](https://github.com/Azure/Azure-Sentinel/tree/master/Parsers) folder on GitHub.
* Activate analytic rules that use ASIM. Search for “normal” in the template gallery to find some of them. To get the full list use this [GitHub search](https://github.com/search?q=ASIM+repo%3AAzure%2FAzure-Sentinel+path%3A%2Fdetections&type=Code&ref=advsearch&l=&l=).

**To Use ASIM:**

* Use the [ASIM hunting queries from GitHub](https://github.com/search?q=ASIM+repo%3AAzure%2FAzure-Sentinel+path%3A%2Fdetections+path%3A%22%2FHunting+Queries%22&type=Code&ref=advsearch&l=&l=)
* Use ASIM queries when using KQL in the log screen.
* Write your own analytic rules using ASIM or [convert existing ones](https://docs.microsoft.com/en-us/azure/sentinel/normalization#modifying-your-content-to-use-normalized-data).
* Write [parsers](https://docs.microsoft.com/en-us/azure/sentinel/normalization#asim-components) for your custom sources to make them ASIM compatible and take part in built-in analytics

## Part 3: Creating Content

What is Microsoft Sentinel's content?

Microsoft Sentinel security value is a combination of its built-in capabilities such as UEBA, Machine Learning, or out-of-the-box analytics rules and your capability to create custom capabilities and customize built-in ones. Customized SIEM capabilities are often referred to as "content" and include analytic rules, hunting queries, workbooks, playbooks, and more.

In this section, we grouped the modules that help you learn how to create such content or modify built-in-content to your needs.  We start with KQL, the Lingua Franca of Azure Sentinel. The following modules discuss one of the content building blocks such as rules, playbooks, and workbooks. We wrap up by discussing use cases, which encompass elements of different types to address specific security goals such as threat detection, hunting, or governance. 

### Module 10: The Kusto Query Language (KQL)

Most Microsoft Sentinel capabilities use [KQL or Kusto Query Language](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/). When you search in your logs, write rules, create hunting queries, or design workbooks, you use KQL.  

Note that the next section on writing rules explains how to use KQL in the specific context of SIEM rules.

**Below is the recommended journey for learning Sentinel KQL:**
1. [Pluralsight KQL course](https://www.pluralsight.com/courses/kusto-query-language-kql-from-scratch) - the basics
2. The Microsoft Sentinel KQL Lab: An interactive lab teaching KQL focusing on what you need for Microsoft Sentinel:
    1. [Learning module (SC-200 part 4)](https://docs.microsoft.com/en-us/learn/paths/sc-200-utilize-kql-for-azure-sentinel/)
    2. [Presentation](https://onedrive.live.com/?authkey=%21AJRxX475AhXGQBE&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21740&parId=66C31D2DBF8E0F71%21446&o=OneUp), [Lab URL](https://aka.ms/lademo)
    3. a [Jupyter Notebooks version](https://github.com/jjsantanna/azure_sentinel_learn_kql_lab/blob/master/azure_sentinel_learn_kql_lab.ipynb), which let you test the queries within the notebook.
    4. Learning webinar: [YouTube](https://youtu.be/EDCBLULjtCM), [MP4](https://1drv.ms/v/s!AnEPjr8tHcNmglwAjUjmYy2Qn5J-);
    5. Reviewing lab solutions webinar: [YouTube](https://youtu.be/YKD_OFLMpf8), [MP4](https://1drv.ms/v/s!AnEPjr8tHcNmg0EKIi5gwXyccB44?e=sF6UG5)
3. [Pluralsight Advanced KQL course](https://www.pluralsight.com/courses/microsoft-azure-data-explorer-advanced-query-capabilities)
4. _Optimizing Azure Sentinel KQL queries performance_: [YouTube](https://youtu.be/jN1Cz0JcLYU), [MP4](https://aka.ms/AzS_09SEP20_MP4), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmg2imjIS8NABc26b-?e=rXZrR5).
5. Using ASIM in your KQL queries: [YouTube](https://www.youtube.com/watch?v=WoGD-JeC7ng), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmjDY1cro08Fk3KUj-?e=murYHG)
6. _KQL Framework for Microsoft Sentinel - Empowering You to Become KQL-Savvy:_ [YouTube](https://youtu.be/j7BQvJ-Qx_k), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmkgqKSV-m1QWgkzKT?e=QAilwu).

You might also find the following reference information useful as you learn KQL:

* [The KQL Cheat Sheet](https://www.mbsecure.nl/blog/2019/12/kql-cheat-sheet)
* [Query optimization best practices](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/query-optimization)

### Module 11: Analytics

**Writing Scheduled Analytics Rules**

Microsoft Sentinel enables you to use [built-in rule templates](https://docs.microsoft.com/en-us/azure/sentinel/detect-threats-built-in), customize the templates for your environment, or create custom rules. The core of the rules is a KQL query; however, there is much more than that to configure in a rule.

To learn the procedure for creating rules, read the [documentation](https://docs.microsoft.com/en-us/azure/sentinel/detect-threats-custom). To learn how to write rules, i.e., what should go into a rule, focusing on KQL for rules, watch the webinar: [MP4](https://1drv.ms/v/s%21AnEPjr8tHcNmghlWrlBCPKwT5WTT), [YouTube](https://youtu.be/pJjljBT4ipQ), [Presentation](https://1drv.ms/b/s!AnEPjr8tHcNmgmffNHf0wqmNEqdx).

SIEM analytics rules have specific patterns. Learn how to implement rules and write KQL for those patterns:  
* **Correlation rules**: [using lists and the "in" operator](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/azure-sentinel-correlation-rules-active-lists-out-make-list-in/ba-p/1029225) or using the ["join" operator](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/azure-sentinel-correlation-rules-the-join-kql-operator/ba-p/1041500)
* **Aggregation**: see using lists and the "in" operator above, or a more [advanced pattern handling sliding windows](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/handling-sliding-windows-in-azure-sentinel-rules/ba-p/1505394)
* **Lookups**: Regular, or Approximate, partial & combined lookups
* **Handling false positives**
* **Delayed events:** are a fact of life in any SIEM and are hard to tackle. Microsoft Sentinel can help you mitigate delays in your rules.
* Using KQL functions as **building blocks**: Enriching Windows Security Events with Parameterized Function.

To blog post ["Blob and File Storage Investigations"](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/microsoft-ignite-2021-blob-and-file-storage-investigations/ba-p/2175138) provides a step by step example of writing a useful analytic rule.

**Using Built-in Analytics**

Before embarking on your own rule writing, you should take advantage of the built-in analytics capabilities. Those do not require much from you, but it is worthwhile learning about them:

* Use the [built-in scheduled rule templates](https://docs.microsoft.com/en-us/azure/sentinel/detect-threats-built-in#about-out-of-the-box-detections). You can tune those templates by modifying the templates the same way to edit any scheduled rule. Make sure to deploy the templates for the data connectors you connect listed in the data connector "next steps" tab.
* Learn more about Microsoft Sentinel's [Machine learning capabilities](https://docs.microsoft.com/en-us/azure/sentinel/bring-your-own-ml): [MP4](https://onedrive.live.com/?authkey=%21ANHkqv1CC1rX0JE&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21772&parId=66C31D2DBF8E0F71%21770&o=OneUp), [YouTube](https://www.youtube.com/watch?v=DxZXHvq1jOs&ab_channel=MicrosoftSecurityCommunity), [Presentation](https://onedrive.live.com/?authkey=%21ACovlR%2DY24o1rzU&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21773&parId=66C31D2DBF8E0F71%21770&o=OneUp)
* Find the list of Microsoft Sentinel's [Advanced multi-stage attack detections ("Fusion") ](https://docs.microsoft.com/en-us/azure/sentinel/fusion) that are enabled by default.
* Watch the Fusion ML Detections with Scheduled Analytics Rules webinar: [YouTube](https://www.youtube.com/watch?v=Ee7gBAQ2Dzc), [MP4](https://onedrive.live.com/?authkey=%21AJzpplg3agpLKdo&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%211663&parId=66C31D2DBF8E0F71%211654&o=OneUp), [Presentation](https://onedrive.live.com/?cid=66c31d2dbf8e0f71&id=66C31D2DBF8E0F71%211674&ithint=file%2Cpdf&authkey=%21AD%5F1AN14N3W592M).
* Learn more about Azure Sentinel's built-in SOC-ML anomalies [here](https://docs.microsoft.com/en-us/azure/sentinel/soc-ml-anomalies). 
* Watch the customized SOC-ML anomalies and how to use them webinar here: [YouTube](https://www.youtube.com/watch?v=z-suDfFgSsk&ab_channel=MicrosoftSecurityCommunity), [MP4](https://onedrive.live.com/?authkey=%21AJVEGsR4ym8hVKk&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%211742&parId=66C31D2DBF8E0F71%211720&o=OneUp), [Presentation](https://onedrive.live.com/?authkey=%21AFqylaqbAGZAIfA&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%211729&parId=66C31D2DBF8E0F71%211720&o=OneUp).
* Watch the Fusion ML Detections for Emerging Threats & Configuration UI webinar here: [YouTube](https://www.youtube.com/watch?v=bTDp41yMGdk), [Presentation](https://onedrive.live.com/?cid=66c31d2dbf8e0f71&id=66C31D2DBF8E0F71%212287&ithint=file%2Cpdf&authkey=%21AIJICOTqjY7bszE).

### Module 12: Implementing SOAR

In modern SIEMs such as Microsoft Sentinel, SOAR (Security Orchestration, Automation, and Response) comprises the entire process from the moment an incident is triggered and until it is resolved. This process starts with an [incident investigation](https://docs.microsoft.com/en-us/azure/sentinel/investigate-cases) and continues with an [automated response](https://docs.microsoft.com/en-us/azure/sentinel/tutorial-respond-threats-playbook). The blog post ["How to use Microsoft Sentinel for Incident Response, Orchestration and Automation"](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/how-to-use-azure-sentinel-for-incident-response-orchestration/ba-p/2242397) provides an overview of common use cases for SOAR.

[Automation rules](https://docs.microsoft.com/en-us/azure/sentinel/automate-incident-handling-with-automation-rules) are the starting point for Microsoft Sentinel automation. They provide a lightweight method for central automated handling of incidents, including suppression,[ false-positive handling](https://docs.microsoft.com/en-us/azure/sentinel/false-positives), and automatic assignment.

To provide robust workflow based automation capabilities, automation rules use [Logic App playbooks](https://docs.microsoft.com/en-us/azure/sentinel/automate-responses-with-playbooks):
* Watch the Unleash the automation Jedi tricks & build Logic Apps Playbooks like a Boss Webinar: [YouTube](https://www.youtube.com/watch?v=G6TIzJK8XBA&ab_channel=MicrosoftSecurityCommunity), [MP4](https://onedrive.live.com/?authkey=%21AMHoD01Fnv0Nkeg&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21513&parId=66C31D2DBF8E0F71%21511&o=OneUp), [Presentation](https://onedrive.live.com/?authkey=%21AJK2W6MaFrzSzpw&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21514&parId=66C31D2DBF8E0F71%21511&o=OneUp).
* Read about [Logic Apps](https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-overview), which is the core technology driving Microsoft Sentinel playbooks.
*[ The Microsoft Sentinel Logic App connector](https://docs.microsoft.com/en-us/connectors/azuresentinel/) is a link between Logic Apps and Azure Sentinel.

You can find dozens of useful Playbooks in the [Playbooks folder](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks) on the [Microsoft Sentinel GitHub](https://github.com/Azure/Azure-Sentinel), or read "[A playbook using a watchlist to Inform a subscription owner about an alert"](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/playbooks-amp-watchlists-part-1-inform-the-subscription-owner/ba-p/1768917) for a Playbook walkthrough.

### Module 13: Workbooks, reporting, and visualization

**Workbooks**

As the nerve center of your SOC, you need Microsoft Sentinel to visualize the information it collects and produces. Use workbooks to visualize data in Microsoft Sentinel.

* To learn how to create workbooks, read the [documentation](https://docs.microsoft.com/en-us/azure/azure-monitor/visualize/workbooks-overview) or watch Billy York's [Workbooks training](https://www.youtube.com/watch?v=iGiPpD_-10M&ab_channel=FestiveTechCalendar) (and [accompanying text](https://www.cloudsma.com/2019/12/azure-advent-calendar-azure-monitor-workbooks/).
* The mentioned resources are not Microsoft Sentinel specific, and apply to Microsoft Workbooks in general. To learn more about Workbooks in Microsoft Sentinel, watch the Webinar: [YouTube](https://www.youtube.com/watch?v=7eYNaYSsk1A&list=PLmAptfqzxVEUD7-w180kVApknWHJCXf0j&ab_channel=MicrosoftSecurityCommunity), [MP4](https://onedrive.live.com/?authkey=%21ALoa5KFEhBq2DyQ&cid=66C31D2DBF8E0F71&id=66C31D2DBF8E0F71%21373&parId=66C31D2DBF8E0F71%21372&o=OneUp), [Presentation](https://onedrive.live.com/view.aspx?resid=66C31D2DBF8E0F71!374&ithint=file%2cpptx&authkey=!AD5hvwtCTeHvQLQ), and read the [documentation](https://docs.microsoft.com/en-us/azure/sentinel/monitor-your-data).
 
Workbooks can be interactive and enable much more than just charting. With Workbooks, you can create apps or extension modules for Microsoft Sentinel to complement built-in functionality. We also use workbooks to extend the features of Microsoft Sentinel. Few examples of such apps you can both use and learn from are:
* The [Investigation Insights Workbook](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/announcing-the-investigation-insights-workbook/ba-p/1816903) provides an alternative approach for investigating incidents.
* [Graph Visualization of External Teams Collaborations](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/graph-visualization-of-external-teams-collaborations-in-azure/ba-p/1356847) enables hunting for risky Teams use. 
* The [users' travel map workbook](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/how-to-use-azure-sentinel-to-follow-a-users-travel-and-map-their/ba-p/981716) allows investigating geo-location alerts.

* The insecure protocols workbook ([Implementation Guide](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/azure-sentinel-insecure-protocols-workbook-implementation-guide/ba-p/1197564), [recent enhancements](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/azure-sentinel-insecure-protocols-workbook-reimagined/ba-p/1558375), and [overview video](https://www.youtube.com/watch?v=xzHDWbBX6h8&list=PLmAptfqzxVEWkrUwV-B1Ob3qW-QPW_Ydu&index=9&ab_channel=MicrosoftSecurityCommunity)) let you identify the use of insecure protocols in your network.

* Lastly, learn how to [integrate information from any source using API calls in a workbook](https://techcommunity.microsoft.com/t5/azure-sentinel/using-the-sentinel-api-to-view-data-in-a-workbook/ba-p/1386436).

You can find dozens of workbooks in the [Workbooks folder](https://github.com/Azure/Azure-Sentinel/tree/master/Workbooks) in the [Microsoft Sentinel GitHub](https://github.com/Azure/Azure-Sentinel). Some of those are available in the Microsoft Sentinel workbooks gallery as well.

**Reporting and other visualization options**

Workbooks can serve for reporting. For more advanced reporting capabilities such as reports scheduling and distribution or pivot tables, you might want to use:
* Power BI, which natively [integrates with Log Analytics and Sentinel](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/log-powerbi).
* Excel, which can use [Log Analytics and Sentinel as the data source](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/log-excel) (and see a a [video](https://www.youtube.com/watch?v=Rx7rJhjzTZA) on how).
* Jupyter notebooks covered later in the hunting module are also a great visualization tool.

### Module 14: Notebooks


### Module 15: Use cases and solutions

## Part 4: Operating

## Part 5: Advanced Topics

## Sentinel Skill-up FAQ
