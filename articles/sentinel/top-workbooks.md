---
title: Commonly used Microsoft Sentinel workbooks
description: Learn about the most commonly used workbooks to use popular, out-of-the-box Microsoft Sentinel resources.
author: yelevin
ms.topic: reference
ms.date: 01/09/2023
ms.author: yelevin
---

# Commonly used Microsoft Sentinel workbooks

The following table lists the most commonly used, built-in Microsoft Sentinel workbooks.

Access workbooks in Microsoft Sentinel under **Threat Management** > **Workbooks** on the left, and then search for the workbook you want to use. For more information, see [Visualize and monitor your data](monitor-your-data.md).

> [!TIP]
> We recommend deploying any workbooks associated with the data you're ingesting. Workbooks allow for broader monitoring and investigating based on your collected data.
>
> For more information, see [Connect data sources](connect-data-sources.md) and [Centrally discover and deploy Microsoft Sentinel out-of-the-box content and solutions](sentinel-solutions-deploy.md).
>

|Workbook name  |Description  |
|---------|---------|
|**Analytics Efficiency**     |  Provides insights into the efficacy of your analytics rules to help you achieve better SOC performance. <br><br>For more information, see [The Toolkit for Data-Driven SOCs](https://techcommunity.microsoft.com/t5/azure-sentinel/the-toolkit-for-data-driven-socs/ba-p/2143152).|
|**Azure Activity**     |     Provides extensive insight into your organization's Azure activity by analyzing and correlating all user operations and events. <br><br>For more information, see [Auditing with Azure Activity logs](audit-sentinel-data.md#auditing-with-azure-activity-logs).    |
|**Azure AD Audit logs**     |  Uses Azure Active Directory audit logs to provide insights into Azure AD scenarios. <br><br>For more information, see  [Quickstart: Get started with Microsoft Sentinel](get-visibility.md).     |
|**Azure AD Audit, Activity and Sign-in logs**     |   Provides insights into Azure Active Directory Audit, Activity, and Sign-in data with one workbook. Shows activity such as sign-ins by location, device, failure reason, user action, and more. <br><br> This workbook can be used by both Security and Azure administrators.   |
|**Azure AD Sign-in logs**     | Uses the Azure AD sign-in logs to provide insights into Azure AD scenarios.        |
| **Microsoft cloud security benchmark** | Provides a single pane of glass for gathering and managing data to address Microsoft cloud security benchmark control requirements, aggregating data from 25+ Microsoft security products. <br><br>For more information, see our [TechCommunity blog](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/what-s-new-azure-security-benchmark-workbook-preview/ba-p/2865930). |
|**Cybersecurity Maturity Model Certification (CMMC)**     |   Provides a mechanism for viewing log queries aligned to CMMC controls across the Microsoft portfolio, including Microsoft security offerings, Office 365, Teams, Intune, Azure Virtual Desktop, and so on. <br><br>For more information, see our [TechCommunity blog](https://techcommunity.microsoft.com/t5/azure-sentinel/what-s-new-cybersecurity-maturity-model-certification-cmmc/ba-p/2111184).|
|**Data collection health monitoring** / **Usage monitoring**     |  Provides insights into your workspace's data ingestion status, such as ingestion size, latency, and number of logs per source. View monitors and detect anomalies to help you determine your workspaces data collection health. <br><br>For more information, see [Monitor the health of your data connectors with this Microsoft Sentinel workbook](monitor-data-connector-health.md).    |
|**Event Analyzer**     |  Enables you to explore, audit, and speed up Windows Event Log analysis, including all event details and attributes, such as security, application, system, setup, directory service, DNS, and so on.       |
|**Exchange Online**     |Provides insights into Microsoft Exchange online by tracing and analyzing all Exchange operations and user activities.         |
|**Identity & Access**     |   Provides insight into identity and access operations in Microsoft product usage, via security logs that include audit and sign-in logs.     |
|**Incident Overview**     |   Designed to help with triage and investigation by providing in-depth information about an incident, including general information, entity data, triage time, mitigation time, and comments. <br><br>For more information, see [The Toolkit for Data-Driven SOCs](https://techcommunity.microsoft.com/t5/azure-sentinel/the-toolkit-for-data-driven-socs/ba-p/2143152).      |
|<a name="investigation-insights"></a>**Investigation Insights**     | Provides analysts with insight into incident, bookmark, and entity data. Common queries and detailed visualizations can help analysts investigate suspicious activities.     |
|**Microsoft Defender for Cloud Apps - discovery logs**     |   Provides details about the cloud apps that are used in your organization, and insights from usage trends and drill-down data for specific users and applications.  <br><br>For more information, see [Connect data from Microsoft Defender for Cloud Apps](./data-connectors/microsoft-defender-for-cloud-apps.md).|
|**MITRE ATT&CK Workbook**     |   Provides details about MITRE ATT&CK coverage for Microsoft Sentinel.      |
|**Office 365**     | Provides insights into Office 365 by tracing and analyzing all operations and activities. Drill down into SharePoint, OneDrive, Teams, and Exchange data.       |
|**Security Alerts**     |  Provides a Security Alerts dashboard for alerts in your Microsoft Sentinel environment. <br><br>For more information, see [Automatically create incidents from Microsoft security alerts](create-incidents-from-alerts.md).      |
|**Security Operations Efficiency**     |  Intended for security operations center (SOC) managers to view overall efficiency metrics and measures regarding the performance of their team. <br><br>For more information, see [Manage your SOC better with incident metrics](manage-soc-with-incident-metrics.md).  |
|**Threat Intelligence**     | Provides insights into threat indicators, including type and severity of threats, threat activity over time, and correlation with other data sources, including Office 365 and firewalls.  <br><br>For more information, see [Understand threat intelligence in Microsoft Sentinel](understand-threat-intelligence.md) and our [TechCommunity blog](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/what-s-new-azure-sentinel-threat-intelligence-workbook/ba-p/2858265).   |
|**Zero Trust (TIC3.0)**     |  Provides an automated visualization of Zero Trust principles, cross-walked to the [Trusted Internet Connections framework](https://www.cisa.gov/resources-tools/programs/trusted-internet-connections-tic).   <br><br>For more information, see the [Zero Trust (TIC 3.0) workbook announcement blog](https://techcommunity.microsoft.com/t5/public-sector-blog/announcing-the-azure-sentinel-zero-trust-tic3-0-workbook/ba-p/2313761).  |
