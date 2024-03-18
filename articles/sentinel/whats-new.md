---
title: What's new in Microsoft Sentinel
description: Learn about the latest new features and announcement in Microsoft Sentinel from the past few months.
author: yelevin
ms.author: yelevin
ms.topic: concept
ms.date: 03/11/2024
---

# What's new in Microsoft Sentinel

This article lists recent features added for Microsoft Sentinel, and new features in related services that provide an enhanced user experience in Microsoft Sentinel.

The listed features were released in the last three months. For information about earlier features delivered, see our [Tech Community blogs](https://techcommunity.microsoft.com/t5/azure-sentinel/bg-p/AzureSentinelBlog/label-name/What's%20New).


> [!TIP]
> Get notified when this page is updated by copying and pasting the following URL into your feed reader:
>
> `https://aka.ms/sentinel/rss`

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## March 2024

- [Codeless Connector builder (preview)](#codeless-connector-builder-preview)
- [SIEM migration experience (preview)](#siem-migration-experience-preview)
- [Data connectors for Syslog and CEF based on Azure Monitor Agent now generally available (GA)](#data-connectors-for-syslog-and-cef-based-on-azure-monitor-agent-now-generally-available-ga)

### Codeless connector builder (preview)

We now have a workbook to help navigate the complex JSON involved in deploying an ARM template for codeless connector platform (CCP) data connectors. Use the friendly interface of the **codeless connector builder** to simplify your development. 

See our blog post for more details, [Create Codeless Connectors with the Codeless Connector Builder (Preview)](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/create-codeless-connectors-with-the-codeless-connector-builder/ba-p/4082050).

For more information on the CCP, see [Create a codeless connector for Microsoft Sentinel (Public preview)](create-codeless-connector.md).

### SIEM migration experience (preview)

The new Microsoft Sentinel Migration experience helps customers and partners to automate the process of migrating their security monitoring use cases hosted in non-Microsoft products into Microsoft Sentinel.
- This first version of the tool supports migrations from Splunk

For more information, see [Migrate to Microsoft Sentinel with the SIEM migration experience](siem-migration.md)

### Data connectors for Syslog and CEF based on Azure Monitor Agent now generally available (GA)

Microsoft Sentinel has released two more data connectors based on the Azure Monitor Agent (AMA) to general availability. You can now use these connectors to deploy Data Collection Rules (DCRs) to Azure Monitor Agent-installed machines to collect Syslog messages, including those in Common Event Format (CEF).

To learn more about the Syslog and CEF connectors, see [Ingest Syslog and CEF logs with the Azure Monitor Agent](connect-cef-syslog-ama.md).

## February 2024

- [Microsoft Sentinel solution for Microsoft Power Platform preview available](#microsoft-sentinel-solution-for-microsoft-power-platform-preview-available)
- [New Google Pub/Sub-based connector for ingesting Security Command Center findings (Preview)](#new-google-pubsub-based-connector-for-ingesting-security-command-center-findings-preview)
- [Incident tasks now generally available (GA)](#incident-tasks-now-generally-available-ga)
- [AWS and GCP data connectors now support Azure Government clouds](#aws-and-gcp-data-connectors-now-support-azure-government-clouds)
- [Windows DNS Events via AMA connector now generally available (GA)](#windows-dns-events-via-ama-connector-now-generally-available-ga)

### Microsoft Sentinel solution for Microsoft Power Platform preview available

The Microsoft Sentinel solution for Power Platform (preview) allows you to monitor and detect suspicious or malicious activities in your Power Platform environment. The solution collects activity logs from different Power Platform components and inventory data. It analyzes those activity logs to detect threats and suspicious activities like the following activities:

- Power Apps execution from unauthorized geographies
- Suspicious data destruction by Power Apps
- Mass deletion of Power Apps
- Phishing attacks made possible through Power Apps
- Power Automate flows activity by departing employees
- Microsoft Power Platform connectors added to the environment
- Update or removal of Microsoft Power Platform data loss prevention policies

Find this solution in the Microsoft Sentinel content hub.

For more information, see:
- [Microsoft Sentinel solution for Microsoft Power Platform overview](business-applications/power-platform-solution-overview.md)
- [Microsoft Sentinel solution for Microsoft Power Platform: security content reference](business-applications/power-platform-solution-security-content.md)
- [Deploy the Microsoft Sentinel solution for Microsoft Power Platform](business-applications/deploy-power-platform-solution.md)

### New Google Pub/Sub-based connector for ingesting Security Command Center findings (Preview)

You can now ingest logs from Google Security Command Center, using the new Google Cloud Platform (GCP) Pub/Sub-based connector (now in PREVIEW).

The Google Cloud Platform (GCP) Security Command Center is a robust security and risk management platform for Google Cloud. It provides features such as asset inventory and discovery, detection of vulnerabilities and threats, and risk mitigation and remediation. These capabilities help you gain insights into and control over your organization's security posture and data attack surface, and enhance your ability to efficiently handle tasks related to findings and assets.

The integration with Microsoft Sentinel allows you to have visibility and control over your entire multicloud environment from a "single pane of glass."

- Learn how to [set up the new connector](connect-google-cloud-platform.md) and ingest events from Google Security Command Center.


### Incident tasks now generally available (GA)

Incident tasks, which help you standardize your incident investigation and response practices so you can more effectively manage incident workflow, are now generally available (GA) in Microsoft Sentinel.

- Learn more about incident tasks in the Microsoft Sentinel documentation:
    - [Use tasks to manage incidents in Microsoft Sentinel](incident-tasks.md)
    - [Work with incident tasks in Microsoft Sentinel](work-with-tasks.md)
    - [Audit and track changes to incident tasks in Microsoft Sentinel](audit-track-tasks.md)

- See [this blog post by Benji Kovacevic](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/create-tasks-repository-in-microsoft-sentinel/ba-p/4038563) that shows how you can use incident tasks in combination with watchlists, automation rules, and playbooks to build a task management solution with two parts:
    - A repository of incident tasks.
    - A mechanism that automatically attaches tasks to newly created incidents, according to the incident title, and assigns them to the proper personnel.

### AWS and GCP data connectors now support Azure Government clouds

Microsoft Sentinel data connectors for Amazon Web Services (AWS) and Google Cloud Platform (GCP) now include supporting configurations to ingest data into workspaces in Azure Government clouds.

The configurations for these connectors for Azure Government customers differ slightly from the public cloud configuration. See the relevant documentation for details:

- [Connect Microsoft Sentinel to Amazon Web Services to ingest AWS service log data](connect-aws.md)
- [Ingest Google Cloud Platform log data into Microsoft Sentinel](connect-google-cloud-platform.md)

### Windows DNS Events via AMA connector now generally available (GA)

Windows DNS events can now be ingested to Microsoft Sentinel using the Azure Monitor Agent with the now generally available data connector. This connector allows you to define Data Collection Rules (DCRs) and powerful, complex filters so that you ingest only the specific DNS records and fields you need.

- For more information, see [Stream and filter data from Windows DNS servers with the AMA connector](connect-dns-ama.md).

## January 2024

[Reduce false positives for SAP systems with analytics rules](#reduce-false-positives-for-sap-systems-with-analytics-rules)

### Reduce false positives for SAP systems with analytics rules

Use analytics rules together with the [Microsoft Sentinel solution for SAP® applications](sap/solution-overview.md) to lower the number of false positives triggered from your SAP® systems. The Microsoft Sentinel solution for SAP® applications now includes the following enhancements:

- The [**SAPUsersGetVIP**](sap/sap-solution-log-reference.md#sapusersgetvip) function now supports excluding users according to their SAP-given roles or profile.

- The **SAP_User_Config** watchlist now supports using wildcards in the **SAPUser** field to exclude all users with a specific syntax.

For more information, see [Microsoft Sentinel solution for SAP® applications data reference](sap/sap-solution-log-reference.md) and [Handle false positives in Microsoft Sentinel](false-positives.md).

## November 2023

- [Take advantage of Microsoft Defender for Cloud integration with Microsoft Defender XDR (Preview)](#take-advantage-of-microsoft-defender-for-cloud-integration-with-microsoft-defender-xdr-preview)
- [Near-real-time rules now generally available](#near-real-time-rules-now-generally-available)
- [Elevate your cybersecurity intelligence with enrichment widgets (Preview)](#elevate-your-cybersecurity-intelligence-with-enrichment-widgets-preview)

### Take advantage of Microsoft Defender for Cloud integration with Microsoft Defender XDR (Preview)

Microsoft Defender for Cloud is now [integrated with Microsoft Defender XDR](../defender-for-cloud/release-notes.md#defender-for-cloud-is-now-integrated-with-microsoft-365-defender-preview), formerly known as Microsoft 365 Defender. This integration, currently **in Preview**, allows Defender XDR to collect alerts from Defender for Cloud and create Defender XDR incidents from them.

Thanks to this integration, Microsoft Sentinel customers who have enabled [Defender XDR incident integration](microsoft-365-defender-sentinel-integration.md) will now be able to ingest and synchronize Defender for Cloud incidents, with all their alerts, through Microsoft Defender XDR.

To support this integration, Microsoft has added a new **Tenant-based Microsoft Defender for Cloud (Preview)** connector. This connector will allow Microsoft Sentinel customers to receive Defender for Cloud alerts and incidents across their entire tenants, without having to monitor and maintain the connector's enrollment to all their Defender for Cloud subscriptions.

This connector can be used to ingest Defender for Cloud alerts, regardless of whether you have Defender XDR incident integration enabled.

- Learn more about [Microsoft Defender for Cloud integration with Microsoft Defender XDR](../defender-for-cloud/release-notes.md#defender-for-cloud-is-now-integrated-with-microsoft-365-defender-preview).
- Learn more about [ingesting Defender for Cloud incidents into Microsoft Sentinel](ingest-defender-for-cloud-incidents.md).
<!--
- Learn how to [connect the tenant-based Defender for Cloud data connector](connect-defender-for-cloud-tenant.md) (in Preview).
-->

### Near-real-time rules now generally available

Microsoft Sentinel’s [near-real-time analytics rules](detect-threats-built-in.md#nrt) are now generally available (GA). These highly responsive rules provide up-to-the-minute threat detection by running their queries at intervals just one minute apart.

- [Learn more about near-real-time rules](near-real-time-rules.md).
- [Create and work with near-real-time rules](create-nrt-rules.md).

<a name="visualize-data-with-enrichment-widgets-preview"></a>
### Elevate your cybersecurity intelligence with enrichment widgets (Preview)

Enrichment widgets in Microsoft Sentinel are dynamic components designed to provide you with in-depth, actionable intelligence about entities. They integrate external and internal content and data from various sources, offering a comprehensive understanding of potential security threats. These widgets serve as a powerful enhancement to your cybersecurity toolkit, offering both depth and breadth in information analysis.

Widgets are already available in Microsoft Sentinel today (in Preview). They currently appear for IP entities, both on their full [entity pages](entity-pages.md) and on their [entity info panels](incident-investigation.md) that appear in Incident pages. These widgets show you valuable information about the entities, from both internal and third-party sources.

**What makes widgets essential in Microsoft Sentinel?**

- **Real-time updates:** In the ever-evolving cybersecurity landscape, real-time data is of paramount importance. Widgets provide live updates, ensuring that your analysts are always looking at the most recent data.

- **Integration:** Widgets are seamlessly integrated into Microsoft Sentinel data sources, drawing from their vast reservoir of logs, alerts, and intelligence. This integration means that the visual insights presented by widgets are backed by the robust analytical power of Microsoft Sentinel.

In essence, widgets are more than just visual aids. They are powerful analytical tools that, when used effectively, can greatly enhance the speed and efficiency of threat detection, investigation, and response.

- [Enable the enrichment widgets experience in Microsoft Sentinel](enable-enrichment-widgets.md)

## October 2023

- [Microsoft Applied Skill - Configure SIEM security operations using Microsoft Sentinel](#microsoft-applied-skill-available-for-microsoft-sentinel)
- [Changes to the documentation table of contents](#changes-to-the-documentation-table-of-contents)

### Microsoft Applied Skill available for Microsoft Sentinel

This month Microsoft Worldwide Learning announced [Applied Skills](https://techcommunity.microsoft.com/t5/microsoft-learn-blog/announcing-microsoft-applied-skills-the-new-credentials-to/ba-p/3775645) to help you acquire the technical skills you need to reach your full potential. Microsoft Sentinel is included in the initial set of credentials offered! This credential is based on the learning path with the same name.
- **Learning path** - [Configure SIEM security operations using Microsoft Sentinel](/training/paths/configure-security-information-event-management-operations-using-microsoft-sentinel/)
  <br>Learn at your own pace, and the modules require you to have your own Azure subscription.
- **Applied Skill** - [Configure SIEM security operations using Microsoft Sentinel](/credentials/applied-skills/configure-siem-security-operations-using-microsoft-sentinel/)
  <br>A 2 hour assessment is contained in a sandbox virtual desktop. You are provided an Azure subscription with some features already configured.

### Changes to the documentation table of contents

We've made some significant changes in how the Microsoft Sentinel documentation is organized in the table of contents on the left-hand side of the library. Two important things to know:

- Bookmarked links persist. Unless we retire an article, your saved and shared links to Microsoft Sentinel articles still work.
- Articles used to be divided by concepts, how-tos, and tutorials. Now, the articles are organized by lifecycle or scenario with the related concepts, how-tos, and tutorials in those buckets.

We hope these changes to the organization makes your exploration of Microsoft Sentinel documentation more intuitive!

## September 2023

- [Improve SOX compliance with new workbook for SAP](#improve-sox-compliance-with-new-workbook-for-sap)

### Improve SOX compliance with new workbook for SAP

The **SAP Audit Controls workbook** is now provided to you as part of the [Microsoft Sentinel solution for SAP® applications](./sap/solution-overview.md).

This workbook helps you check your SAP® environment's security controls for compliance with your chosen control framework, be it [SOX](https://www.bing.com/search?q=sox+compliance+IT+security&qs=n&form=QBRE&sp=-1&lq=0&pq=sox+compliance+it+security&sc=8-26&sk=&cvid=3ACE338C88CE43368A223D4DB7FC35E6&ghsh=0&ghacc=0&ghpl=), [NIST](https://www.nist.gov/cyberframework/framework), or a custom framework of your choice.

The workbook provides tools for you to assign analytics rules in your environment to specific security controls and control families,  monitor and categorize the incidents generated by the SAP solution-based analytics rules, and report on your compliance.

Learn more about the [**SAP Audit Controls workbook**](./sap/sap-audit-controls-workbook.md).

## August 2023

- [New incident investigation experience is now GA](#new-incident-investigation-experience-is-now-ga)
- [Updated MISP2Sentinel solution utilizes the new upload indicators API.](#updated-misp2sentinel-solution)
- [New and improved entity pages](#new-and-improved-entity-pages)

### New incident investigation experience is now GA

Microsoft Sentinel's comprehensive [incident investigation and case management experience](incident-investigation.md) is now generally available in both commercial and government clouds. This experience includes the revamped incident page, which itself includes displays of the incident's entities, insights, and similar incidents for comparison. The new experience also includes an incident log history and a task list.

Also generally available are the similar incidents widget and the ability to add entities to your threat intelligence list of indicators of compromise (IoCs).

- Learn more about [investigating incidents](investigate-incidents.md) in Microsoft Sentinel.

### Updated MISP2Sentinel solution

The open source threat intelligence sharing platform, MISP, has an updated solution to push indicators to Microsoft Sentinel. This notable solution utilizes the new upload indicators API to take advantage of workspace granularity and align the MISP ingested TI to STIX-based properties.

Learn more about the implementation details from the [MISP blog entry for MISP2Sentinel](https://www.misp-project.org/2023/08/26/MISP-Sentinel-UploadIndicatorsAPI.html/).

### New and improved entity pages

Microsoft Sentinel now provides you enhanced and enriched entity pages and panels, giving you more security information on user accounts, full entity data to enrich your incident context, and a reduction in latency for a faster, smoother experience.

- Read more about these changes in this blog post: [Taking Entity Investigation to the Next Level: Microsoft Sentinel’s Upgraded Entity Pages](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/taking-entity-investigation-to-the-next-level-microsoft-sentinel/ba-p/3878382).

- Learn more about [entities in Microsoft Sentinel](entities.md).

## Next steps

> [!div class="nextstepaction"]
>[On-board Azure Sentinel](quickstart-onboard.md)

> [!div class="nextstepaction"]
>[Get visibility into alerts](get-visibility.md)
