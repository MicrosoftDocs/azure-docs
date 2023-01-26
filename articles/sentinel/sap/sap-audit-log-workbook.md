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

## Start using the workbook

1. From the Microsoft Sentinel portal, select **Workbooks** from the **Threat management** menu.

1. In the **Workbooks** gallery, enter *SAP audit* in the search bar, and select **SAP Audit** from among the results.

1. Select **View template** to use the workbook as is, or select **Save** to create an editable copy of the workbook. When the copy is created, select **View saved workbook**.

    :::image type="content" source="media/sap-audit-log-workbook/workbook-overview.png" alt-text="Screenshot of the SAP Audit workbook top view." lightbox="media/sap-audit-log-workbook/workbook-overview.png":::

     > [!IMPORTANT]
     >
     > The SAP Audit workbook is located in the workspace used by SAP personnel in your organization, and not the workspace used by the SOC. The workbook is set to this subscription and workspace by default, and the workbook data is based on content that is already in the workspace. If the Azure audit and sign in logs are on a different workspace, you can select the workspace under **Azure audit and activities**. When you select another workspace, the workbook shows data from both workspaces. 

1. Select the following fields to filter the data according to your needs:

    - Time, from four hours to 90 days.  
    - SAP system roles, for example: Development.
    - System usage, for example: SAP GTS.
    - Specific SAP systems: In this option, you can select all systems, a specific system, or select multiple systems.

    If you select systems that aren't configured in the ["SAP systems" watchlist](sap-solution-security-content.md#available-watchlists), the workbook shows an error, specifying the systems with issues. In this case, [configure the watchlist](deployment-solution-configuration.md#configure-watchlists) to correctly include these systems.

## Workbook overview

The workbook is separated into two tabs:

- [**Logon analysis report**](#logon-analysis-report-tab). Shows different types of logon data regarding logon failures, including filtering by anomalous data, Azure Active Directory data, and more. The data is based on the ["SAP systems" watchlist](sap-solution-security-content.md#available-watchlists).
- [**Audit log alerts report**](#audit-log-alerts-report-tab). Shows different types of data regarding the SAP Audit log events that the Microsoft Sentinel Solution for SAP watches. The data is based on the ["SAP_Dynamic_Audit_Log_Monitor_Configuration" watchlist](sap-solution-security-content.md#available-watchlists).

## Logon analysis report tab

Includes the [Logon Analysis](#logon-analysis) and [Logon failures](#logon-failures---anomaly-detection) areas.

### Logon Analysis

Shows different types of data regarding user logons.

:::image type="content" source="media/sap-audit-log-workbook/logon-analysis.png" alt-text="Screenshot of the Logon Analysis area of the SAP Audit workbook." lightbox="media/sap-audit-log-workbook/logon-analysis.png":::

|Area  |Description  |
|---------|---------|
|**Unique user logons per system**     |Shows a number of unique logons for each selected system in the selected period, and a graph that shows the logon trends over the selected time for each system. For example: the 012 system has 1.4K unique logon attempts in the last 14 days, and in these 14 days the graph shows a relatively rising logon trend.         |
|**Logon types trend**     |Shows a trend of the amount of logons according to type, for example, login via dialog. You can hover over the graph to show the logon amount for different dates.         |
|**Logon failures Vs. success by unique users - trend**     |Shows a trend of successful and failed logons in the selected period. You can hover over the graph to show the amount of successful and failed logons for different dates.         |

### Logon failures - anomaly detection

The areas under **Anomaly detection - filtering out noisy failed login attempts** show login failure data for SAP systems and users. To see only data flagged by [anomaly detection](configure-audit-log-rules.md#anomaly-detection), select **Anomalous only** next to **Failed logons** on the right. 

:::image type="content" source="media/sap-audit-log-workbook/logon-failures.png" alt-text="Screenshot of the sections in the Logon failures area of the SAP Audit workbook that can be filtered by anomaly detection." lightbox="media/sap-audit-log-workbook/logon-failures.png":::

|Area  |Description  |Specific data |Options/notes |
|---------|---------|---------|---------|
| **Logon failure rate** > **Logon failure anomalies** > **Unique User failed logons per SAP system** | Shows the amount of unique failed logons for each SAP system. | | |
|**SAP and Active Directory are better together** | The **Anomalous login failures** table shows a combination of Microsoft Sentinel and Azure Active Directory data. The list is organized by risk, where the most suspicious or risky users are on top, and the users with less security risk are at the bottom. |For each user, shows:<br>• A timeline of failed login attempts<br>• A timeline showing at which point an anomalous failed attempt occurred<br>• The type of anomaly<br>• The user's email address<br>• The Azure Active directory risk indicator<br>• The amount of incidents and alerts in Microsoft Sentinel |• When you select a row, you can see a list of alerts and incidents for that user under **Incidents/alerts overview for user**. Below this list, you can also see of Azure Active Directory risk events under **Azure audit and signin risks for user**.<br>• If you your Azure Active Directory data is in a different Log Analytics workspace, make sure you select the relevant subscriptions and workspaces at the top of the workbook, under **Azure audit and activities**. |
|**Logon failure rate per system** |Visually represents the selected SAP systems. |• For each system, shows the amount of failures in the selected period<br>• Systems are grouped by type.<br>• The color of the system indicates the amount of failed attempts: Green indicates a small amount of suspicious logon attempts, where red indicates a large amount of suspicious logon attempts. |You can select a system to see a list of failed logons with details about the failures. |

In this screenshot, you can see the data shown when the first line is selected in the **Anomalous login failures** table. 
- The specific alerts and incident URLs are shown in the **Incidents/alerts overview for user** table.
- The **Azure audit and signin risks for user** table doesn't show data, because Azure Active Directory did not find specific audit and sign in risks related to this user.

:::image type="content" source="media/sap-audit-log-workbook/anomalous-logon-failures-table.png" alt-text="Screenshot of data shown when a line is selected in the Anomalous login failures table." lightbox="media/sap-audit-log-workbook/anomalous-logon-failures-table.png":::

In this screenshot, you can see the **Login failure rate per system** area, where the **84e** system under the **Test** group is selected. The **Failed logons for system** area on the right shows failure events for this system.

:::image type="content" source="media/sap-audit-log-workbook/logon-failure-rate.png" alt-text="Screenshot of the Login failure rate per system area of the SAP Audit workbook." lightbox="media/sap-audit-log-workbook/logon-failure-rate.png":::

### Logon failures - trends

The **Logon failures trends** area shows the trends and amount of failed logons, grouped by different types of data.

:::image type="content" source="media/sap-audit-log-workbook/logon-failure-trends.png" alt-text="Screenshot of the Logon failures trends area of the SAP Audit workbook." lightbox="media/sap-audit-log-workbook/logon-failure-trends.png":::

|Area  |Description  |
|---------|---------| 
|**Login failure by cause** | The failure reason, like incorrect logon data. |
|**Login failure by type** | The failure by type of logon, like whether the logon triggered a background job, or if it was an HTTP logon. |
|**Login failure by method** | The logon method, like SNC or a logon ticket. |

## Audit log alerts report tab

This tab shows severity and audit trends for each SAP system and user. All areas in this tab show data flagged by [anomaly detection](configure-audit-log-rules.md#anomaly-detection) only. For all events, select **All** next to **Failed logons** on the right.

:::image type="content" source="media/sap-audit-log-workbook/audit-log-alerts.png" alt-text="Screenshot of the Audit Log Alerts area of the SAP Audit workbook." lightbox="media/sap-audit-log-workbook/audit-log-alerts.png":::

|Area  |Description  |Specific data |Options/notes |
|---------|---------|---------|---------| 
|**Alert severity trends per System ID** |Shows a list of systems, with a graph of medium and high severity event trends per system. | | |
|**Audit trend per user** |Shows a combination of Microsoft Sentinel and Azure Active Directory data. The list is organized by risk, where the users that indicate the most risk are on top, and the users with less security risk are at the bottom. |For each user, shows:<br>• A timeline of high and medium severity events<br>• The user's email address<br>• The Azure Active directory risk indicator<br>• The amount of incidents and alerts in Microsoft Sentinel |When you select a row, you can see a list of alerts and incidents for that user under **Incidents/alerts overview for user**. Below this list, you can also see of Azure Active Directory risk events under **Azure audit and signin risks for user**. |
|**Risk score per system** | Visually represents each system in a cell shape. |• Shows the risk score for each system.<br>• Systems are grouped by type.<br>• The color of the system indicates the risk: Green indicates a system with a lower risk score, where red indicates a higher risk score. |You can select a system to see a list of SAP events per system. |
|**Events by MITRE ATT&CK® tactics** |Shows a list of SAP events grouped by MITRE ATT&CK® tactics, like Initial Access or Defense Evasion. | |You can hover over the graph to show the logon amount for different dates. |
|**Events by category** |Shows a list of SAP events grouped by category, like RFC Start or Logon. | |You can hover over the graph to show the logon amount for different dates. |
|**Events by authorization group** |Shows a list of SAP events grouped by the SAP authorization group, like USER or SUPER. | |You can hover over the graph to show the logon amount for different dates. |
|**Events by user type** |Shows a list of SAP events grouped by the SAP user type, like Dialog or system. | |You can hover over the graph to show the logon amount for different dates. |

In this screenshot, you can see the data shown when the first line is selected in the **Audit trends per user** table. 
- The specific alerts and incident URLs are shown in the **Incidents/alerts overview for user** table.
- The **Azure audit and signin risks for user** table doesn't show data, because Azure Active Directory did not find specific audit and sign in risks related to this user.

:::image type="content" source="media/sap-audit-log-workbook/audit-trend-per-user.png" alt-text="Screenshot of data shown when a line is selected in the Audit trends per user table." lightbox="media/sap-audit-log-workbook/audit-trend-per-user.png":::

In this screenshot, you can see the **Risk score per system** area, where the **cb7** system under the **UAT** group is selected. The **SAP events for system** area below the system visualization shows the SAP event for this system.

:::image type="content" source="media/sap-audit-log-workbook/risk-score-per-system.png" alt-text="Screenshot of the Risk score per system area of the SAP Audit workbook." lightbox="media/sap-audit-log-workbook/risk-score-per-system.png":::

In this screenshot, you can see the areas that show event trends grouped by different types of data: MITRE ATT&CK® tactics, SAP authorization group, and user type.

:::image type="content" source="media/sap-audit-log-workbook/event-data-categories.png" alt-text="Screenshot of the different event data in the SAP Audit workbook." lightbox="media/sap-audit-log-workbook/event-data-categories.png":::

## Next steps

For more information, see:

- [Deploying Microsoft Sentinel Solution for SAP](deployment-overview.md)
- [Microsoft Sentinel Solution for SAP logs reference](sap-solution-log-reference.md)
- [Deploy the Microsoft Sentinel Solution for SAP data connector with SNC](configure-snc.md)
- [Configuration file reference](configuration-file-reference.md)
- [Prerequisites for deploying the Microsoft Sentinel Solution for SAP](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
- [Troubleshooting your Microsoft Sentinel Solution for SAP deployment](sap-deploy-troubleshoot.md)