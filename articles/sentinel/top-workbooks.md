---
title: Commonly used Azure Sentinel workbooks | Microsoft Docs
description: Learn about the most commonly used workbooks to use popular, built-in Azure Sentinel resources. 
services: sentinel
cloud: na
documentationcenter: na
author: batamig
manager: rkarlin

ms.assetid:
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: reference
ms.date: 03/07/2021
ms.author: bagol
---

# Commonly used Azure Sentinel workbooks

The following table lists the most commonly used, built-in Azure Sentinel workbooks.

Access workbooks in Azure Sentinel under **Threat Management** > **Workbooks** on the left, and then search for the workbook you want to use. For more information, see [Visualize and monitor your data](/azure/sentinel/articles/sentinel/monitor-your-data.md).

> [!TIP]
> We recommend deploying any workbooks associated with the data you're ingesting. Workbooks allow for broader monitoring and investigating based on your collected data.
>
> For more information, see [Connect data sources](connect-data-sources.md) and [Discover and deploy Azure Sentinel solutions](sentinel-solutions-deploy.md).
>

|Workbook name  |Description  |
|---------|---------|
|**Analytics Efficiency**     |  Provides insights into the efficacy of your analytics rules to help you achieve better SOC performance. <br><br>For more information, see [The Toolkit for Data-Driven SOCs](https://techcommunity.microsoft.com/t5/azure-sentinel/the-toolkit-for-data-driven-socs/ba-p/2143152).|
|**Azure Activity**     |     Provides extensive insight into your organization's Azure activity by analyzing and correlating all user operations and events. <br><br>For more information, see [Auditing with Azure Activity logs](audit-sentinel-data.md#auditing-with-azure-activity-logs).    |
|**Azure AD Audit logs**     |  Uses Azure Active Directory audit logs to provide insights into Azure AD scenarios. <br><br>For more information, see  [Quickstart: Get started with Azure Sentinel](get-visibility.md).     |
|**Azure AD Audit, Activity and Sign-in logs**     |   Provides insights into Azure Active Directory Audit, Activity, and Sign-in data with one workbook. Shows activity such as sign-ins by location, device, failure reason, user action, and more. <br><br> This workbook can be used by both Security and Azure administrators.   |
|**Azure AD Sign-in logs**     | Uses the Azure AD sign-in logs to provide insights into Azure AD scenarios.        |
|**Cybersecurity Maturity Model Certification (CMMC)**     |   Provides a mechanism for viewing log queries aligned to CMMC controls across the Microsoft portfolio, including Microsoft security offerings, Office 365, Teams, Intune, Windows Virtual Desktop, and so on. <br><br>For more information, see [Cybersecurity Maturity Model Certification (CMMC) Workbook in Public Preview](https://techcommunity.microsoft.com/t5/azure-sentinel/what-s-new-cybersecurity-maturity-model-certification-cmmc/ba-p/2111184).|
|**Data collection health monitoring** / **Usage monitoring**     |  Provides insights into your workspace's data ingestion status, such as ingestion size, latency, and number of logs per source. View monitors and detect anomalies to help you determine your workspaces data collection health. <br><br>For more information, see [Monitor the health of your data connectors with this Azure Sentinel workbook](monitor-data-connector-health.md).    |
|**Event Analyzer**     |  Enables you to explore, audit, and speed up Windows Event Log analysis, including all event details and attributes, such as security, application, system, setup, directory service, DNS, and so on.       |
|**Exchange Online**     |Provides insights into Microsoft Exchange online by tracing and analyzing all Exchange operations and user activities.         |
|**Identity & Access**     |   Provides insight into identity and access operations in Microsoft product usage, via security logs that include audit and sign-in logs.     |
|**Incident Overview**     |   Designed to help with triage and investigation by providing in-depth information about an incident, including general information, entity data, triage time, mitigation time, and comments. <br><br>For more information, see [The Toolkit for Data-Driven SOCs](https://techcommunity.microsoft.com/t5/azure-sentinel/the-toolkit-for-data-driven-socs/ba-p/2143152).      |
|<a name="investigation-insights"></a>**Investigation Insights**     | Provides analysts with insight into incident, bookmark, and entity data. Common queries and detailed visualizations can help analysts investigate suspicious activities.     |
|**Microsoft Cloud App Security - discovery logs**     |   Provides details about the cloud apps that are used in your organization, and insights from usage trends and drill-down data for specific users and applications.  <br><br>For more information, see [Connect data from Microsoft Cloud App Security](connect-cloud-app-security.md).|
|**MITRE ATT&CK Workbook**     |   Provides details about MITRE ATT&CK coverage for Azure Sentinel.      |
|**Office 365**     | Provides insights into Office 365 by tracing and analyzing all operations and activities. Drill down into SharePoint, OneDrive, Teams, and Exchange data.       |
|**Security Alerts**     |  Provides a Security Alerts dashboard for alerts in your Azure Sentinel environment. <br><br>For more information, see [Automatically create incidents from Microsoft security alerts](create-incidents-from-alerts.md).      |
|**Security Operations Efficiency**     |  Intended for security operations center (SOC) managers to view overall efficiency metrics and measures regarding the performance of their team. <br><br>For more information, see [Manage your SOC better with incident metrics](manage-soc-with-incident-metrics.md).  |
|**Threat Intelligence**     | Provides insights into threat indicators, including type and severity of threats, threat activity over time, and correlation with other data sources, including Office 365 and firewalls.  <br><br>For more information, see [Understand threat intelligence in Azure Sentinel](understand-threat-intelligence.md).      |
|**Zero Trust (TIC3.0)**     |  Provides an automated visualization of Zero Trust principles, cross-walked to the [Trusted Internet Connections framework](https://www.cisa.gov/trusted-internet-connections).   <br><br>For more information, see the [Zero Trust (TIC 3.0) workbook announcement blog](https://techcommunity.microsoft.com/t5/public-sector-blog/announcing-the-azure-sentinel-zero-trust-tic3-0-workbook/ba-p/2313761).  |