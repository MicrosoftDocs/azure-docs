---
title: Microsoft Sentinel Solution for SAP - SAP audit log workbook overview
description: Learn about the SAP audit log workbook, used to monitor and track data across your SAP systems.
author: limwainstein
ms.author: lwainstein
ms.topic: reference
ms.date: 01/23/2023
---

# Microsoft Sentinel Solution for SAP - SAP audit log workbook overview

This article describes the SAP Audit workbook, used for monitoring and tracking user audit activity across your SAP systems. You can use the workbook to get a bird's eye view of user audit activity, to better secure your SAP systems and gain quick visibility into suspicious actions. You can drill down into suspicious events as needed.

> [!IMPORTANT]
>
> The SAP Audit workbook is in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

You can use the workbook either for ongoing monitoring of your SAP systems, or to review the systems following a security incident or other suspicious activity.

[TBD - screenshot]

> [!NOTE]
>
> The SAP Audit workbook is located in the workspace used by SAP personnel in your organization, and not the workspace used by the SOC. Therefore, the workbook data is based on content that is already in the workspace. If the Azure audit and sign in logs are on a different workspace, select the workspace under **Azure audit and activities**.  

## Workbook overview

The workbook is separated into two tabs:

- **Logon analysis report**: Shows different types of logon data including logon analysis, including logon failures, filtering by anomalous data, risk scores combined with Azure Active Directory events, and more. The data is based on the ["SAP systems" watchlist](sap-solution-security-content.md#available-watchlists).
- **Audit log alerts report**. Shows an overview of the SAP Audit log events that the Microsoft Sentinel Solution for SAP watches. The data is based on the ["SAP_Dynamic_Audit_Log_Monitor_Configuration" watchlist](sap-solution-security-content.md#available-watchlists).

## Logon analysis report

This tab allows you to filter the data by: 
- Time, from four hours to 90 days  
- SAP system roles, for example, **Development**
- System usage, for example: **SAP GTS**
- Specific SAP systems: In this option, you can select all systems, a specific system, or select multiple systems 

[TBD - screenshot]

If you select systems that aren't configured in the ["SAP systems" watchlist](sap-solution-security-content.md#available-watchlists), the workbook shows an error, specifying the systems with issues. In this case, [configure the watchlist](deployment-solution-configuration.md#configure-watchlists) to correctly include these systems.

### Logon analysis

- **Unique user logons per system**. Shows a number of unique logons for each selected system in the selected period, and a graph that shows the logon trends over the selected time for each system. For example, the 012 system has 1.4K unique logon attempts in the last 14 days, and in these 14 days the graph shows a relatively rising logon trend.
- **Logon types trend**. Shows a trend of the amount of logons according to type, for example, login via dialog. You can hover over the graph to show the logon amount for different dates.
- **Logon failures Vs. success by unique users - trend**. Shows a trend of successful and failed logons in the selected period. You can hover over the graph to show the amount of successful and failed logons for different dates.

[TBD - screenshot]

### Logon failures

Shows different filters and views for failed logons.

#### Anomaly detection- filtering out noisy failed logon attempts

Shows failure data for each SAP system and user. You can choose to see only events events flagged by [anomaly detection](configure-audit-log-rules.md#anomaly-detection). For anomalous events, select **Anomalous only** next to **Failed logons** on the right. 

[TBD - screenshot]

- **Logon failure anomalies**. Shows the amount of unique failed logons for each SAP system.
- **SAP and Active Directory are better together**. Shows a combination of Microsoft Sentinel and Azure Active Directory data. The list is organized by risk, where the most suspicious or risky users are on top, and the users with less security risk are at the bottom.
    - For each user, shows: 
        - A timeline of failed login attempts
        - A timeline showing at which point an anomalous failed attempt occurred  
        - The type of anomaly
        - The user's email address
        - The Azure Active directory risk indicator
        - The amount of incidents and alerts in Microsoft Sentinel
    - When you select a row, you can see a list of alerts and incidents for that user under **Incidents/alerts overview for user**. Below this list, you can also see of Azure Active Directory risk events under **Azure audit and signin risks for user**.
    - If you your Azure Active Directory data is in a different Log Analytics workspace, make sure you select the relevant subscriptions and workspaces at the top of the workbook, under **Azure audit and activities**.
- **Logon failure rate per system**. Visually represents each system in a cell shape that shows the amount of failures in the selected period. Systems are grouped by type. The color of the system indicates the amount of failed attempts: Green indicates a small amount of suspicious logon attempts, where red indicates a large amount of suspicious logon attempts. You can select a system to see a list of failed logons with details about the failures. 
- **Logon failure trends**. Shows the trends and amount of failed logons, grouped by different categories:
    - **Login failure by cause**. The failure reason, like incorrect logon data. 
    - **Login failure by type**. The failure by type of logon, like whether the logon triggered a background job, or if it was an HTTP logon. 
    - **Login failure by method**. The logon method, like SNC or a logon ticket. 

## Audit log alerts report

### Anomaly detection - filtering out noisy automation activities

[TBD - screenshot]

Shows severity and audit trends for each SAP system and user. You can choose to see only events events flagged by [anomaly detection](configure-audit-log-rules.md#anomaly-detection). For anomalous events, select **Anomalous only** next to **Failed logons** on the right. 

- **Alert severity trends per System ID**. Shows a list of systems, with a graph of medium and high severity event trends per system. 
- **Audit trend per user**. Shows a combination of Microsoft Sentinel and Azure Active Directory data. The list is organized by risk, where the most suspicious or risky users are on top, and the users with less security risk are at the bottom.
    - For each user, shows: 
        - A timeline of high and medium severity events
        - The user's email address
        - The Azure Active directory risk indicator
        - The amount of incidents and alerts in Microsoft Sentinel
    - When you select a row, you can see a list of alerts and incidents for that user under **Incidents/alerts overview for user**. Below this list, you can also see of Azure Active Directory risk events under **Azure audit and signin risks for user**.
- **Risk score per system**. Visually represents each system in a cell shape and shows the risk score for each system. Systems are grouped by type. The color of the system indicates the risk: Green indicates a system with a lower risk score, where red indicates a higher risk score. You can select a system to see a list of SAP events per user.
- SAP events grouped according to different categories. You can hover over the graph to show the logon amount for different dates.
    - **Events by MITRE ATT&CK® tactics**. Shows a list of SAP events grouped by MITRE ATT&CK® tactics, like Initial Access or Defense Evasion.
    - **Events by category**. Shows a list of SAP events grouped by category, like RFC Start or Logon.
    - **Events by authorization group**. Shows a list of SAP events grouped by the SAP authorization group, like USER or SUPER.
    - **Events by user type**. Shows a list of SAP events grouped by the SAP user type, like Dialog or system.

## Next steps

For more information, see:

- [Deploying Microsoft Sentinel Solution for SAP](deployment-overview.md)
- [Microsoft Sentinel Solution for SAP logs reference](sap-solution-log-reference.md)
- [Deploy the Microsoft Sentinel Solution for SAP data connector with SNC](configure-snc.md)
- [Configuration file reference](configuration-file-reference.md)
- [Prerequisites for deploying the Microsoft Sentinel Solution for SAP](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
- [Troubleshooting your Microsoft Sentinel Solution for SAP deployment](sap-deploy-troubleshoot.md)