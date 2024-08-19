---
title: Commonly used Microsoft Sentinel workbooks
description: Learn about the most commonly used workbooks to use popular, out-of-the-box Microsoft Sentinel resources.
author: yelevin
ms.topic: reference
ms.date: 06/14/2024
ms.author: yelevin
appliesto:
- Microsoft Sentinel in the Azure portal and the Microsoft Defender portal
ms.collection: usx-security
---

# Commonly used Microsoft Sentinel workbooks

This article lists the most commonly used Microsoft Sentinel workbooks. Install the solution or standalone item that contains the workbook from the **Content hub** in Microsoft Sentinel. Get the workbook from the **Content hub** by selecting **Manage** on the solution or standalone item. Or, in Microsoft Sentinel under **Threat Management**, go to **Workbooks** and search for the workbook you want to use. For more information, see [Visualize and monitor your data](monitor-your-data.md).

We recommend you deploy any workbooks associated with the data you ingest into Microsoft Sentinel. Workbooks allow for broader monitoring and investigating based on your collected data. For more information, see [Microsoft Sentinel data connectors](connect-data-sources.md) and [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).

## Commonly used workbooks

The following table includes workbooks we recommend and the solution or standalone item from the **Content hub** that contains the workbook. 

|Workbook name  |Description  |Content hub title|
|---------|---------|---------|
|**Analytics Health & Audit**     |  Provides visibility on the health and audit of your analytics rules. Find out whether an analytics rule is running as expected and get a list of changes made to an analytic rule. <br><br>For more information, see [Monitor the health and audit the integrity of your analytics rules](monitor-analytics-rule-integrity.md).|Analytics Health & Audit|
|**Azure Activity**     |     Provides extensive insight into your organization's Azure activity by analyzing and correlating all user operations and events. <br><br>For more information, see [Auditing with Azure Activity logs](audit-sentinel-data.md#auditing-with-azure-activity-logs).    |Azure Activity|
| **Azure Security Benchmark** | Provides visibility for the security posture of cloud workloads. View log queries, Azure resource graph, and policies aligned to Azure Security Benchmark controls across Microsoft security offerings, Azure, Microsoft 365, 3rd party, on-premises, and multicloud workloads. <br><br>For more information, see our [TechCommunity blog](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/what-s-new-azure-security-benchmark-workbook-preview/ba-p/2865930). |Azure Security Benchmark|
|**Cybersecurity Maturity Model Certification (CMMC)**     |   Provides a way to view log queries aligned to CMMC controls across the Microsoft portfolio, including Microsoft security offerings, Microsoft 365, Microsoft Teams, Intune, Azure Virtual Desktop, and more. <br><br>For more information, see our [TechCommunity blog](https://techcommunity.microsoft.com/t5/azure-sentinel/what-s-new-cybersecurity-maturity-model-certification-cmmc/ba-p/2111184).|Cybersecurity Maturity Model Certification (CMMC) 2.0|
|**Data collection health monitoring**    |  Provides insights into your workspace's data ingestion status, such as ingestion size, latency, and number of logs per source. Monitors and detect anomalies to help you determine your workspaces data collection health. <br><br>For more information, see [Monitor the health of your data connectors with this Microsoft Sentinel workbook](monitor-data-connector-health.md).    |Data collection health monitoring|
|**Event Analyzer**     |  Explore, audit, and speed up Windows Event Log analysis. Includes all event details and attributes, such as security, application, system, setup, directory service, DNS, and more.       |Windows Security Events|
|**Identity & Access**     |   Provides insight into identity and access operations by collecting and analyzing security logs, using the audit and sign-in logs to gather insights into use of Microsoft products.    |Windows Security Events|
|**Incident Overview**     |   Designed to help with triage and investigation by providing in-depth information about an incident, including general information, entity data, triage time, mitigation time, and comments. <br><br>For more information, see [The Toolkit for Data-Driven SOCs](https://techcommunity.microsoft.com/t5/azure-sentinel/the-toolkit-for-data-driven-socs/ba-p/2143152).      |SOC Handbook|
|<a name="investigation-insights"></a>**Investigation Insights**     | Provides analysts with insight into incident, bookmark, and entity data. Common queries and detailed visualizations can help analysts investigate suspicious activities.     |SOC Handbook|
|**Microsoft Defender for Cloud Apps - discovery logs**     |   Provides details about the cloud apps that are used in your organization, and insights from usage trends and drill-down data for specific users and applications.  <br><br>For more information, see [Microsoft Defender for Cloud Apps connector for Microsoft Sentinel](./data-connectors/microsoft-defender-for-cloud-apps.md).|Microsoft Defender for Cloud Apps|
|**Microsoft Entra Audit Logs**     |  Uses the audit logs to gather insights around Microsoft Entra ID scenarios. Learn about user operations, including password and group management, device activities, and top active users and apps.<br><br>For more information, see  [Quickstart: Get started with Microsoft Sentinel](get-visibility.md).     |Microsoft Entra ID|
|**Microsoft Entra Sign-in logs**     |  Provides insights to sign-in operations, such as user sign-ins and locations, email addresses, and IP addresses of your users, failed activities, and the errors that triggered the failures. |Microsoft Entra ID|
|**MITRE ATT&CK Workbook**     |   Provides details about MITRE ATT&CK coverage for Microsoft Sentinel.      |SOC Handbook|
|**Office 365**     | Provides insights into Office 365 by tracing and analyzing all operations and activities. Drill down into SharePoint, OneDrive, Teams, and Exchange data.       |Microsoft 365|
|**Security Alerts**     |  Provides a Security Alerts dashboard for alerts in your Microsoft Sentinel environment. <br><br>For more information, see [Automatically create incidents from Microsoft security alerts](create-incidents-from-alerts.md).      |SOC Handbook|
|**Security Operations Efficiency**     |  Intended for security operations center (SOC) managers to view overall efficiency metrics and measures regarding the performance of their team. <br><br>For more information, see [Manage your SOC better with incident metrics](manage-soc-with-incident-metrics.md).  |SOC Handbook|
|**Threat Intelligence**     | Provides insights into threat indicators ingestion. Search for indicators at scale across Microsoft 1st party, 3rd party, on-premises, hybrid, and multicloud workloads.  <br><br>For more information, see [Understand threat intelligence in Microsoft Sentinel](understand-threat-intelligence.md) and our [TechCommunity blog](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/what-s-new-azure-sentinel-threat-intelligence-workbook/ba-p/2858265).   |Threat Intelligence|
|**Workspace Usage Report**|Provides insights into your workspace's usage. View your workspace’s data consumption, latency, recommended tasks, and cost and usage statistics.|Workspace Usage Report|
|**Zero Trust (TIC3.0)**     |  Provides an automated visualization of Zero Trust principles, cross-walked to the [Trusted Internet Connections framework](https://www.cisa.gov/resources-tools/programs/trusted-internet-connections-tic).   <br><br>For more information, see the [Zero Trust (TIC 3.0) workbook announcement blog](https://techcommunity.microsoft.com/t5/public-sector-blog/announcing-the-azure-sentinel-zero-trust-tic3-0-workbook/ba-p/2313761).  |Zero Trust (TIC 3.0)|

## Related content

- [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md)
- [Visualize and monitor your data](monitor-your-data.md)