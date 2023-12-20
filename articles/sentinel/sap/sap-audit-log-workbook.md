---
title: Microsoft Sentinel solution for SAP® applications - SAP -Security Audit log and Initial Access workbook overview
description: Learn about the SAP -Security Audit log and Initial Access workbook, used to monitor and track data across your SAP systems.
author: limwainstein
ms.author: lwainstein
ms.topic: reference
ms.date: 01/23/2023
---

# Microsoft Sentinel solution for SAP® applications - SAP -Security Audit log and Initial Access workbook

This article describes the SAP -Security Audit log and Initial Access workbook, used for monitoring and tracking user audit activity across your SAP systems. You can use the workbook to get a bird's eye view of user audit activity, to better secure your SAP systems and gain quick visibility into suspicious actions. You can drill down into suspicious events as needed.

You can use the workbook either for ongoing monitoring of your SAP systems, or to review the systems following a security incident or other suspicious activity. 

## Start using the workbook

1. From the Microsoft Sentinel portal, select **Workbooks** from the **Threat management** menu.

1. In the **Workbooks** gallery, go to **Templates** and enter *SAP* in the search bar, and select **SAP -Security Audit log and Initial Access** from among the results.

1. Select **View template** to use the workbook as is, or select **Save** to create an editable copy of the workbook. When the copy is created, select **View saved workbook**.

    :::image type="content" source="media/sap-audit-log-workbook/workbook-overview.png" alt-text="Screenshot of the top of the SAP -Security Audit log and Initial Access workbook." lightbox="media/sap-audit-log-workbook/workbook-overview.png":::

     > [!IMPORTANT]
     >
     > The SAP -Security Audit log and Initial Access workbook is hosted by the workspace where the Microsoft Sentinel solution for SAP® applications were installed. By default, both the SAP and the SOC data is assumed to be on the workspace that hosts the workbook. 
     >
     > If the SOC data is on a different workspace than the workspace hosting the workbook, make sure to include the subscription for that workspace, and select the SOC workspace from **Azure audit and activity workspace**. 

1. Select the following fields to filter the data according to your needs:

    - **Time Range**. From four hours to 90 days.  
    - **System Roles**. The SAP system roles, for example: Development.
    - **System Usage**. For example: SAP GTS.
    - **SAP systems**. You can select all systems, a specific system, or select multiple systems.

    If you select systems that aren't configured in the ["SAP systems" watchlist](sap-solution-security-content.md#available-watchlists), the workbook shows an error, specifying the systems with issues. In this case, [configure the watchlist](deployment-solution-configuration.md#configure-watchlists) to correctly include these systems.

## Workbook overview

The workbook is separated into two tabs:

- [**Logon analysis report**](#logon-analysis-report-tab). Shows different types of data regarding sign-in failures. Data includes anomalous data, Microsoft Entra data, and more. The data is based on the ["SAP systems" watchlist](sap-solution-security-content.md#available-watchlists).
- [**Audit log alerts report**](#audit-log-alerts-report-tab). Shows different types of data regarding the SAP Audit log events that the Microsoft Sentinel solution for SAP® applications watches. The data is based on the ["SAP_Dynamic_Audit_Log_Monitor_Configuration" watchlist](sap-solution-security-content.md#available-watchlists).

## Logon analysis report tab

Includes the [Logon Analysis](#logon-analysis) and [Logon failures](#logon-failures---anomaly-detection) areas.

### Logon Analysis

Shows different types of data regarding user sign-ins.

:::image type="content" source="media/sap-audit-log-workbook/logon-analysis.png" alt-text="Screenshot of the Logon Analysis area of the SAP Audit workbook." lightbox="media/sap-audit-log-workbook/logon-analysis.png":::

|Area  |Description  |Options |
|---------|---------|
|**Unique user logons per system**     |Shows the number of unique sign ins for each SAP system, and a graph with the sign-in trends over the selected time for each system. For example: the 012 system has 1.4-K unique logon attempts in the last 14 days, and in these 14 days the graph shows a relatively rising sign-in trend.         |
|**Logon types trend**     |Shows a trend of the number of sign ins according to type, for example, login via dialog. |You can hover over the graph to show the number of logons for different dates.         |
|**Logon failures Vs. success by unique users - trend**     |Shows a trend of successful and failed sign ins in the selected period. |You can hover over the graph to show the amount of successful and failed sign ins for different dates.         |

### Logon failures - anomaly detection

The areas under **Anomaly detection - filtering out noisy failed login attempts** show login failure data for SAP systems and users. To see only data flagged by [anomaly detection](configure-audit-log-rules.md#anomaly-detection), select **Anomalous only** next to **Failed logons** on the right. 

:::image type="content" source="media/sap-audit-log-workbook/logon-failures.png" alt-text="Screenshot of the sections in the Logon failures area of the SAP Audit workbook that you can filter by anomalous data." lightbox="media/sap-audit-log-workbook/logon-failures.png":::

|Area  |Description  |Specific data |Options/notes |
|---------|---------|---------|---------|
| **Logon failure rate** > **Logon failure anomalies** > **Unique User failed logons per SAP system** | Shows the number of unique failed sign ins for each SAP system. | | |
|**SAP and Active Directory are better together** | The **Anomalous login failures** table shows a combination of Microsoft Sentinel and Microsoft Entra data. The workbook displays the users according to risk: Users that indicate the most risk are at the top of the list, and the users with less security risk are at the bottom. |For each user, shows:<br>• A timeline of failed sign-in attempts<br>• A timeline showing at which point an anomalous failed attempt occurred<br>• The type of anomaly<br>• The user's email address<br>• The Microsoft Entra risk indicator<br>• The number of incidents and alerts in Microsoft Sentinel |• When you select a row, you can see a list of alerts and incidents for that user under **Incidents/alerts overview for user**. Below this list, you can also see of Microsoft Entra risk events under **Azure audit and signin risks for user**.<br>• If your Microsoft Entra data is in a different Log Analytics workspace, make sure you select the relevant subscriptions and workspaces at the top of the workbook, under **Azure audit and activities**. |
|**Logon failure rate per system** |Visually represents the selected SAP systems. |• For each system, shows the number of failures in the selected period<br>• Systems are grouped by type.<br>• The color of the system indicates the number of failed attempts: Green indicates a few suspicious logon attempts, where red indicates more suspicious logon attempts. |You can select a system to see a list of failed sign ins with details about the failures. |

In this screenshot, you can see the data shown when the first line is selected in the **Anomalous login failures** table. The specific alerts and incident URLs are shown in the **Incidents/alerts overview for user** table.

:::image type="content" source="media/sap-audit-log-workbook/anomalous-logon-failures-table.png" alt-text="Screenshot of data shown when a line is selected in the Anomalous login failures table." lightbox="media/sap-audit-log-workbook/anomalous-logon-failures-table.png":::

In this screenshot, the **Azure audit and signin risks for user** table shows data for the sign-in risk related to this user.

:::image type="content" source="media/sap-audit-log-workbook/azure-audit-signin-risks.png" alt-text="Screenshot of audit and sign-in risk data shown when a line is selected in the Anomalous login failures table." lightbox="media/sap-audit-log-workbook/azure-audit-signin-risks.png":::

In this screenshot, you can see the **Login failure rate per system** area, where the **84e** system under the **Test** group is selected. The **Failed logons for system** area on the right shows failure events for this system.

:::image type="content" source="media/sap-audit-log-workbook/logon-failure-rate.png" alt-text="Screenshot of the Login failure rate per system area of the SAP Audit workbook." lightbox="media/sap-audit-log-workbook/logon-failure-rate.png":::

### Logon failures - trends

The **Logon failures trends** area shows the trends and number of failed sign-ins, grouped by different types of data.

:::image type="content" source="media/sap-audit-log-workbook/logon-failure-trends.png" alt-text="Screenshot of the Logon failures trends area of the SAP Audit workbook." lightbox="media/sap-audit-log-workbook/logon-failure-trends.png":::

|Area  |Description  |
|---------|---------| 
|**Login failure by cause** | Shows a trend of the number of sign-in failures according to the cause of failure, for example: incorrect sign-in data. |
|**Login failure by type** | Shows a trend of the number of sign-in failures according to type, for example: the sign-in triggered a background job, or the sign-in was via HTTP. |
|**Login failure by method** | Shows a trend of the number of sign-in failures according to method, for example: SNC or a sign-in ticket. |

## Audit log alerts report tab

This tab shows severity and audit trends for each SAP system and user. All areas in this tab show data flagged by [anomaly detection](configure-audit-log-rules.md#anomaly-detection) only. For all events, select **All** next to **Failed logons** on the right.

:::image type="content" source="media/sap-audit-log-workbook/audit-log-alerts.png" alt-text="Screenshot of the Audit Log Alerts area of the SAP Audit workbook." lightbox="media/sap-audit-log-workbook/audit-log-alerts.png":::

|Area  |Description  |Specific data |Options/notes |
|---------|---------|---------|---------| 
|**Alert severity trends per System ID** |Shows a list of systems, with a graph of medium and high severity event trends per system. For example, the 012 system had many high severity events over the entire period, and a few medium severity events with a spike that shows more medium severity events in the middle of the period. | | |
|**Audit trend per user** |Shows a combination of Microsoft Sentinel and Microsoft Entra data. The workbook displays the users according to risk: Users that indicate the most risk are at the top of the list, and users with less security risk are at the bottom. |For each user, shows:<br>• A timeline of high and medium severity events<br>• The user's email address<br>• The Microsoft Entra risk indicator<br>• The number of incidents and alerts in Microsoft Sentinel |When you select a row, you can see a list of alerts and incidents for that user under **Incidents/alerts overview for user**. Below this list, you can also see of Microsoft Entra risk events under **Azure audit and signin risks for user**. |
|**Risk score per system** | Visually represents each system in a cell shape. |• Shows the risk score for each system.<br>• Systems are grouped by type.<br>• The color of the system indicates the risk: Green indicates a system with a lower risk score, where red indicates a higher risk score. |You can select a system to see a list of SAP events per system. |
|**Events by MITRE ATT&CK® tactics** |Shows a list of SAP events grouped by MITRE ATT&CK® tactics, like Initial Access or Defense Evasion. | |You can hover over the graph to show the number of sign-ins for different dates. |
|**Events by category** |Shows a list of SAP event trends grouped by category, like RFC Start or Logon. | |You can hover over the graph to show the sign-in number for different dates. |
|**Events by authorization group** |Shows a list of SAP event trends grouped by the SAP authorization group, like USER or SUPER. | |You can hover over the graph to show the number of sign-ins for different dates. |
|**Events by user type** |Shows a list of SAP event trends grouped by the SAP user type, like Dialog or system. | |You can hover over the graph to show the number of sign-ins for different dates. |

In this screenshot, you can see the data shown when the first line is selected in the **Audit trends per user** table. The specific alerts and incident URLs are shown in the **Incidents/alerts overview for user** table.

:::image type="content" source="media/sap-audit-log-workbook/audit-trend-per-user.png" alt-text="Screenshot of data shown when a line is selected in the Audit trends per user table." lightbox="media/sap-audit-log-workbook/audit-trend-per-user.png":::

In this screenshot, you can see the **Risk score per system** area, where the **cb7** system under the **UAT** group is selected. The **SAP events for system** area below the system visualization shows the SAP event for this system.

:::image type="content" source="media/sap-audit-log-workbook/risk-score-per-system.png" alt-text="Screenshot of the Risk score per system area of the SAP Audit workbook." lightbox="media/sap-audit-log-workbook/risk-score-per-system.png":::

In this screenshot, you can see areas with events and event trends grouped by different types of data: MITRE ATT&CK® tactics, SAP authorization group, and user type.

:::image type="content" source="media/sap-audit-log-workbook/event-data-categories.png" alt-text="Screenshot of the different event data in the SAP Audit workbook." lightbox="media/sap-audit-log-workbook/event-data-categories.png":::

## Next steps

For more information, see:

- [Deploying Microsoft Sentinel solution for SAP® applications](deployment-overview.md)
- [Microsoft Sentinel solution for SAP® applications logs reference](sap-solution-log-reference.md)
- [Monitor the health of your SAP system](../monitor-sap-system-health.md)
- [Deploy the Microsoft Sentinel solution for SAP® applications data connector with SNC](configure-snc.md)
- [Configuration file reference](configuration-file-reference.md)
- [Prerequisites for deploying the Microsoft Sentinel solution for SAP® applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
- [Troubleshooting your Microsoft Sentinel solution for SAP® applications deployment](sap-deploy-troubleshoot.md)
