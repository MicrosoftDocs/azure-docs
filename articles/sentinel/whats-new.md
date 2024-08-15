---
title: What's new in Microsoft Sentinel
description: Learn about the latest new features and announcement in Microsoft Sentinel from the past few months.
author: yelevin
ms.author: yelevin
ms.topic: concept-article
ms.date: 07/30/2024
---

# What's new in Microsoft Sentinel

This article lists recent features added for Microsoft Sentinel, and new features in related services that provide an enhanced user experience in Microsoft Sentinel.

The listed features were released in the last three months. For information about earlier features delivered, see our [Tech Community blogs](https://techcommunity.microsoft.com/t5/azure-sentinel/bg-p/AzureSentinelBlog/label-name/What's%20New).

 Get notified when this page is updated by copying and pasting the following URL into your feed reader:
`https://aka.ms/sentinel/rss`

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## August 2024

- [Unified AMA-based connectors for syslog ingestion](#unified-ama-based-connectors-for-syslog-ingestion)
- [Better visibility for Windows security events](#better-visibility-for-windows-security-events)
- [New Auxiliary logs retention plan (Preview)](#new-auxiliary-logs-retention-plan-preview)
- [Create summary rules for large sets of data (Preview)](#create-summary-rules-in-microsoft-sentinel-for-large-sets-of-data-preview)

### Unified AMA-based connectors for syslog ingestion

With the impending retirement of the Log Analytics Agent, Microsoft Sentinel has consolidated the collection and ingestion of syslog, CEF, and custom-format log messages into three multi-purpose data connectors based on the Azure Monitor Agent (AMA):
- **Syslog via AMA**, for any device whose logs are ingested into the *Syslog* table in Log Analytics.
- **Common Event Format (CEF) via AMA**, for any device whose logs are ingested into the *CommonSecurityLog* table in Log Analytics.
- **New! Custom Logs via AMA (Preview)**, for any of 15 device types, or any unlisted device, whose logs are ingested into custom tables with names ending in *_CL* in Log Analytics.

These connectors replace nearly all the existing connectors for individual device and appliance types that have existed until now, that were based on either the legacy Log Analytics agent (also known as MMA or OMS) or the current Azure Monitor Agent. The solutions provided in the content hub for all of these devices and appliances now include whichever of these three connectors are appropriate to the solution.* The replaced connectors are now marked as "Deprecated" in the data connector gallery.

The data ingestion graphs that were previously found in each device's connector page can now be found in device-specific workbooks packaged with each device's solution.

\* When installing the solution for any of these applications, devices, or appliances, to ensure that the accompanying data connector is installed, you must select **Install with dependencies** on the solution page, and then mark the data connector on the following page.

For the updated procedures for installing these solutions, see the following articles:
- [CEF via AMA data connector - Configure specific appliance or device for Microsoft Sentinel data ingestion](unified-connector-cef-device.md)
- [Syslog via AMA data connector - Configure specific appliance or device for Microsoft Sentinel data ingestion](unified-connector-syslog-device.md)
- [Custom Logs via AMA data connector - Configure data ingestion to Microsoft Sentinel from specific applications](unified-connector-custom-device.md)

### Better visibility for Windows security events

We've enhanced the schema of the *SecurityEvent* table that hosts Windows Security events, and have added new columns to ensure compatibility with the Azure Monitor Agent (AMA) for Windows (version 1.28.2). These enhancements are designed to increase the visibility and transparency of collected Windows events. If you're not interested in receiving data in these fields, you can apply an ingestion-time transformation ("project-away" for example) to drop them.

### New Auxiliary logs retention plan (Preview)

The new **Auxiliary logs** retention plan for Log Analytics tables allows you to ingest large quantities of high-volume logs with supplemental value for security at a much lower cost. Auxiliary logs are available with interactive retention for 30 days, in which you can run simple, single-table queries on them, such as to summarize and aggregate the data. Following that 30-day period, auxiliary log data goes to long-term retention, which you can define for up to 12 years, at ultra-low cost. This plan also allows you to run search jobs on the data in long-term retention, extracting only the records you want to a new table that you can treat like a regular Log Analytics table, with full query capabilities.

To learn more about Auxiliary logs and compare with Analytics logs, see [Log retention plans in Microsoft Sentinel](log-plans.md).

For more in-depth information about the different log management plans, see [**Table plans**](../azure-monitor/logs/data-platform-logs.md#table-plans) in the [Azure Monitor Logs overview](../azure-monitor/logs/data-platform-logs.md) article from the Azure Monitor documentation.

### Create summary rules in Microsoft Sentinel for large sets of data (Preview)

Microsoft Sentinel now provides the ability to create dynamic summaries using [Azure Monitor summary rules](/azure/azure-monitor/logs/summary-rules), which aggregate large sets of data in the background for a smoother security operations experience across all log tiers.

- Access summary rule results via Kusto Query Language (KQL) across detection, investigation, hunting, and reporting activities.
- Run high performance Kusto Query Language (KQL) queries on summarized data.
- Use summary rule results for longer in investigations, hunting, and compliance activities.

For more information, see [Aggregate Microsoft Sentinel data with summary rules](summary-rules.md).

## July 2024

- [SOC optimizations now generally available](#soc-optimizations-now-generally-available)
- [SAP Business Technology Platform (BTP) connector now generally available](#sap-business-technology-platform-btp-connector-now-generally-available-ga)
- [Microsoft unified security platform now generally available](#microsoft-unified-security-platform-now-generally-available)

### SOC optimizations now generally available

The SOC optimization experience in both the Azure and Defender portals is now generally available for all Microsoft Sentinel customers, including both data value and threat-based recommendations.

- **Use data value recommendations** to improve your data usage of ingested billable logs, gain visibility to underused logs, and discover the right detections for those logs or the right adjustments to your log tier or ingestion.

- **Use threat-based recommendations** to help identify gaps in coverage against specific attacks based on Microsoft research and mitigate them by ingesting the recommended logs and adding recommended detections.

The [`recommendations`](soc-optimization/soc-optimization-api.md) API is still in Preview. 

For more information, see:

- [Optimize your security operations](soc-optimization/soc-optimization-access.md)
- [SOC optimization reference of recommendations](soc-optimization/soc-optimization-reference.md)

### SAP Business Technology Platform (BTP) connector now generally available (GA)

The Microsoft Sentinel Solution for SAP BTP is now generally available (GA). This solution provides visibility into your SAP BTP environment, and helps you detect and respond to threats and suspicious activities.

For more information, see:

- [Microsoft Sentinel Solution for SAP Business Technology Platform (BTP)](sap/sap-btp-solution-overview.md)
- [Deploy the Microsoft Sentinel solution for SAP BTP](sap/deploy-sap-btp-solution.md)
- [Microsoft Sentinel Solution for SAP BTP: security content reference](sap/sap-btp-security-content.md)

### Microsoft unified security platform now generally available

Microsoft Sentinel is now generally available within the Microsoft unified security operations platform in the Microsoft Defender portal. The Microsoft unified security operations platform brings together the full capabilities of Microsoft Sentinel, Microsoft Defender XDR, and Microsoft Copilot in Microsoft Defender. For more information, see the following resources:

- Blog post: [General availability of the  Microsoft unified security operations platform](https://aka.ms/unified-soc-announcement)
- [Microsoft Sentinel in the Microsoft Defender portal](microsoft-sentinel-defender-portal.md)
- [Connect Microsoft Sentinel to Microsoft Defender XDR](/defender-xdr/microsoft-sentinel-onboard)
- [Microsoft Copilot in Microsoft Defender](/defender-xdr/security-copilot-in-microsoft-365-defender)

## June 2024

- [Codeless Connector Platform now generally available](#codeless-connector-platform-now-generally-available)
- [Advanced threat indicator search capability available](#advanced-threat-indicator-search-capability-available)

### Codeless Connector Platform now generally available

The Codeless Connector Platform (CCP), is now generally available (GA). Check out the [announcement blog post](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/what-s-new-create-your-own-codeless-data-connector/ba-p/4174439).

For more information on the CCP enhancements and capabilities, see [Create a codeless connector for Microsoft Sentinel](create-codeless-connector.md).

### Advanced threat indicator search capability available

Threat intelligence search and filtering capabilities have been enhanced, and the experience now has parity across the Microsoft Sentinel and Microsoft Defender portals. Search supports a maximum of 10 conditions with each containing up to 3 subclauses.

For more information, see the updated screenshot in [View and manage your threat indicators](understand-threat-intelligence.md#view-and-manage-your-threat-indicators).

## May 2024

- [Optimize your security operations with SOC optimizations](#optimize-your-security-operations-with-soc-optimizations-preview)
- [Incident and entity triggers in playbooks are now Generally Available (GA)](#incident-and-entity-triggers-in-playbooks-are-now-generally-available-ga)

### Incident and entity triggers in playbooks are now Generally Available (GA)

The ability to use incident and entity triggers is playbooks is now supported as GA.

:::image type="content" source="media/whats-new/sentinel-triggers-ga.png" alt-text="Screenshot of the Microsoft Sentinel incident and entity options with no preview notice.":::

For more information, see [Create a playbook](tutorial-respond-threats-playbook.md#create-a-playbook).

### Optimize your security operations with SOC optimizations (preview)

Microsoft Sentinel now provides SOC optimizations, which are high-fidelity and actionable recommendations that help you identify areas where you can reduce costs, without affecting SOC needs or coverage, or where you can add security controls and data where its found to be missing.

Use SOC optimization recommendations to help you close coverage gaps against specific threats and tighten your ingestion rates against data that doesn't provide security value. SOC optimizations help you optimize your Microsoft Sentinel workspace, without having your SOC teams spend time on manual analysis and research.

If your workspace is onboarded to the unified security operations platform, SOC optimizations are also available in the Microsoft Defender portal.

For more information, see:

- [Optimize your security operations](soc-optimization/soc-optimization-access.md)
- [SOC optimization reference of recommendations](soc-optimization/soc-optimization-reference.md)


## April 2024

- [Unified security operations platform in the Microsoft Defender portal (preview)](#unified-security-operations-platform-in-the-microsoft-defender-portal-preview)
- [Microsoft Sentinel now generally available (GA) in Azure China 21Vianet](#microsoft-sentinel-now-generally-available-ga-in-azure-china-21vianet)
- [Two anomaly detections discontinued](#two-anomaly-detections-discontinued)
- [Microsoft Sentinel now available in Italy North region](#microsoft-sentinel-is-now-available-in-italy-north-region)

### Unified security operations platform in the Microsoft Defender portal (preview)

The unified security operations platform in the Microsoft Defender portal is now available. This release brings together the full capabilities of Microsoft Sentinel, Microsoft Defender XDR, and Microsoft Copilot in Microsoft Defender. For more information, see the following resources:

- Blog announcement: [​​Unified security operations platform with Microsoft Sentinel and Microsoft Defender XDR](https://aka.ms/unified-soc-announcement)
- [Microsoft Sentinel in the Microsoft Defender portal](https://go.microsoft.com/fwlink/p/?linkid=2263690)
- [Connect Microsoft Sentinel to Microsoft Defender XDR](/microsoft-365/security/defender/microsoft-sentinel-onboard)
- [Microsoft Security Copilot in Microsoft Defender XDR](/microsoft-365/security/defender/security-copilot-in-microsoft-365-defender)

### Microsoft Sentinel now generally available (GA) in Azure China 21Vianet

Microsoft Sentinel is now generally available (GA) in Azure China 21Vianet. Individual features might still be in public preview, as listed on [Microsoft Sentinel feature support for Azure commercial/other clouds](feature-availability.md).

For more information, see also [Geographical availability and data residency in Microsoft Sentinel](geographical-availability-data-residency.md).

### Two anomaly detections discontinued

The following anomaly detections are discontinued as of March 26, 2024, due to low quality of results:
- Domain Reputation Palo Alto anomaly
- Multi-region logins in a single day via Palo Alto GlobalProtect

For the complete list of anomaly detections, see the [anomalies reference page](anomalies-reference.md).

### Microsoft Sentinel is now available in Italy North region

Microsoft Sentinel is now available in Italy North Azure region with the same feature set as all other Azure Commercial regions as listed on [Microsoft Sentinel feature support for Azure commercial/other clouds](feature-availability.md).

For more information, see also [Geographical availability and data residency in Microsoft Sentinel](geographical-availability-data-residency.md).

## March 2024

- [SIEM migration experience now generally available (GA)](#siem-migration-experience-now-generally-available-ga)
- [Amazon Web Services S3 connector now generally available (GA)](#amazon-web-services-s3-connector-now-generally-available-ga)
- [Codeless Connector builder (preview)](#codeless-connector-builder-preview)
- [Data connectors for Syslog and CEF based on Azure Monitor Agent now generally available (GA)](#data-connectors-for-syslog-and-cef-based-on-azure-monitor-agent-now-generally-available-ga)

### SIEM migration experience now generally available (GA)

At the beginning of the month, we announced the SIEM migration preview. Now at the end of the month, it's already GA! The new Microsoft Sentinel Migration experience helps customers and partners automate the process of migrating their security monitoring use cases hosted in non-Microsoft products into Microsoft Sentinel.
- This first version of the tool supports migrations from Splunk

For more information, see [Migrate to Microsoft Sentinel with the SIEM migration experience](siem-migration.md)

Join our Security Community for a [webinar](https://forms.office.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbR_0A4IaJRDNBnp8pjCkWnwhUM1dFNFpVQlZJREdEQjkwQzRaV0RZRldEWC4u) showcasing the SIEM migration experience on May 2nd, 2024. 

### Amazon Web Services S3 connector now generally available (GA)

Microsoft Sentinel has released the AWS S3 data connector to general availability (GA). You can use this connector to ingest logs from several AWS services to Microsoft Sentinel using an S3 bucket and AWS's simple message queuing service.

Concurrent with this release, this connector's configuration has changed slightly for Azure Commercial Cloud customers. User authentication to AWS is now done using an OpenID Connect (OIDC) web identity provider, instead of through the Microsoft Sentinel application ID in combination with the customer workspace ID. Existing customers can continue using their current configuration for the time being, and will be notified well in advance of the need to make any changes.

To learn more about the AWS S3 connector, see [Connect Microsoft Sentinel to Amazon Web Services to ingest AWS service log data](connect-aws.md)

### Codeless connector builder (preview)

We now have a workbook to help navigate the complex JSON involved in deploying an ARM template for codeless connector platform (CCP) data connectors. Use the friendly interface of the **codeless connector builder** to simplify your development. 

See our blog post for more details, [Create Codeless Connectors with the Codeless Connector Builder (Preview)](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/create-codeless-connectors-with-the-codeless-connector-builder/ba-p/4082050).

For more information on the CCP, see [Create a codeless connector for Microsoft Sentinel (Public preview)](create-codeless-connector.md).


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

Use analytics rules together with the [Microsoft Sentinel solution for SAP applications](sap/solution-overview.md) to lower the number of false positives triggered from your SAP systems. The Microsoft Sentinel solution for SAP applications now includes the following enhancements:

- The [**SAPUsersGetVIP**](sap/sap-solution-log-reference.md#sapusersgetvip) function now supports excluding users according to their SAP-given roles or profile.

- The **SAP_User_Config** watchlist now supports using wildcards in the **SAPUser** field to exclude all users with a specific syntax.

For more information, see [Microsoft Sentinel solution for SAP applications data reference](sap/sap-solution-log-reference.md) and [Handle false positives in Microsoft Sentinel](false-positives.md).

## Next steps

> [!div class="nextstepaction"]
>[On-board Azure Sentinel](quickstart-onboard.md)

> [!div class="nextstepaction"]
>[Get visibility into alerts](get-visibility.md)
