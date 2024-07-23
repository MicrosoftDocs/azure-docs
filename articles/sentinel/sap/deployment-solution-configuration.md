---
title: Enable SAP detections and threat protection with Microsoft Sentinel
description: This article shows you how to configure initial security content for the Microsoft Sentinel solution for SAP applications in order to start enabling SAP detections and threat protection.
author: batamig
ms.author: bagol
ms.topic: concept-article
ms.date: 07/23/2024
---

# Enable SAP detections and threat protection

While deploying the Microsoft Sentinel data collector agent and solution for SAP applications provides you with the ability to monitor SAP systems for suspicious activities and identify threats, additional configuration steps are required to ensure the solution is optimized for your SAP deployment. This article provides best practices for getting started with the security content delivered with the Microsoft Sentinel solution for SAP applications, and is the last step in deploying the SAP integration.

:::image type="content" source="media/deployment-steps/settings.png" alt-text="Diagram of the SAP solution deployment flow, highlighting the Configure solution settings step.":::

:::image type="icon" source="media/deployment-steps/security.png" border="false"::: Content in this article is relevant for your security team.

> [!IMPORTANT]
> Some components of the Microsoft Sentinel solution for SAP applications are currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

<!--should this be the get started article?-->

## Prerequisites

Before configuring the settings described in this article, you must have your data connector agent and solution content installed.

For more information, see [Deploy the Microsoft Sentinel solution for SAP applications from the content hub](deploy-sap-security-content.md) and [Deploy Microsoft Sentinel solution for SAP applications](deployment-overview.md).

## Configure watchlists

Configure your Microsoft Sentinel solution for SAP applications by providing customer-specific information in the following watchlists:

|Watchlist name  |Configuration details  |
|---------|---------|
|**SAP - Systems**     |  The **SAP - Systems** watchlist defines the SAP systems that are present in the monitored environment. <br><br>For every system, specify: <br>- The SID<br>- Whether it's a production system or a dev/test environment<br>- A meaningful description <br><br>Configured data is used by some analytics rules, which may react differently if relevant events appear in a development or a production system.       |
|**SAP - Networks**     |  The **SAP - Networks** watchlist outlines all networks used by the organization. It's primarily used to identify whether or not user sign-ins originate from within known segments of the network, or if a user's sign-in origin changes unexpectedly. <br><br>There are a number of approaches for documenting network topology. You could define a broad range of addresses, like *172.16.0.0/16*, and name it *Corporate Network*, which is good enough for tracking sign-ins from outside that range. However, a more segmented approach, allows you better visibility into potentially atypical activity. <br><br>For example, you might define the following segments and geographical locations: <br>- 192.168.10.0/23:  Western Europe <br>-  10.15.0.0/16: Australia <br><br>In such cases, Microsoft Sentinel can differentiate a sign-in from *192.168.10.15* in the first segment from a sign-in from *10.15.2.1* in the second segment. Microsoft Sentinel alerts you if such behavior is identified as atypical.       |
|**SAP - Sensitive Function Modules** <br><br>**SAP - Sensitive Tables** <br><br>**SAP - Sensitive ABAP Programs**<br><br>**SAP - Sensitive Transactions**     |  **Sensitive data watchlists** identify sensitive actions or data that can be carried out or accessed by users. <br><br>While several well-known operations, tables, and authorizations are pre-configured in the watchlists, we recommend that you consult with your SAP BASIS team to identify the operations, transactions, authorizations and tables are considered to be sensitive in your SAP environment, and update the lists as needed. |
|**SAP - Sensitive Profiles** <br><br>**SAP - Sensitive Roles**<br><br>**SAP - Privileged Users** <br><br>**SAP - Critical Authorizations** | The Microsoft Sentinel solution for SAP applications uses user data gathered in **user data watchlists** from SAP systems to identify which users, profiles, and roles should be considered sensitive. While sample data is included in the watchlists by default, we recommend that you consult with your SAP BASIS team to identify the sensitive users, roles, and profiles in your organization and update the lists as needed.|

After the initial solution deployment, it may take some time until the watchlists are populated with data. If you open a watchlist for editing and find that it's empty, wait a few minutes and try again.

For more information, see [Available watchlists](sap-solution-security-content.md#available-watchlists).

## Start enabling analytics rules

By default, all analytics rules in the Microsoft Sentinel solution for SAP applications are provided as [alert rule templates](../manage-analytics-rule-templates.md#manage-template-versions-for-your-scheduled-analytics-rules-in-microsoft-sentinel). We recommend a staged approach, where you use the templates to create a few rules at a time, allowing time for fine-tuning each scneario.

We recommend starting with the following analytics rules:

- Change in sensitive privileged user
- Client configuration change
- Sensitive privileged user logon
- Sensitive privileged user makes a change in other
- Sensitive privilege user password change and login
- Function module tested

For more information, see [Built-in analytics rules](sap-solution-security-content.md#built-in-analytics-rules).

## Detect anomalies with audit log monitoring rules (Preview)

Use the following analytics rules to either monitor all audit log events on your SAP system or trigger alerts only when anomalies are detected:

|Rule name  |Description  |
|---------|---------|
|**SAP - Missing configuration in the Dynamic Security Audit Log Monitor**     |  By default, runs daily to provide configuration recommendations for the SAP audit log module. Use the rule template to create and customize a rule for your workspace.     |
|**SAP - Dynamic Deterministic Audit Log Monitor (PREVIEW)**     |  By default, runs every 10 minutes and focuses on the SAP audit log events marked as **Deterministic**. Use the rule template to create and customize a rule for your workspace, such as for a lower false positive rate. |
|**SAP - Dynamic Anomaly based Audit Log Monitor Alerts (PREVIEW)**     |  By default, runs hourly and focuses on SAP events marked as **AnomaliesOnly**, alerting on SAP audit log events when anomalies are detected. |

The SAP audit log monitoring rules are delivered as part of the [Microsoft Sentinel for SAP solution security content](sap-solution-security-content.md#monitoring-the-sap-audit-log), and allow for further fine tuning using the *SAP_Dynamic_Audit_Log_Monitor_Configuration* and *SAP_User_Config watchlists*.

For example, the following table lists several examples of how you can use the *SAP_Dynamic_Audit_Log_Monitor_Configuration* watchlist to configure the types of events that produce incidents, reducing the number of incidents generated.

|Option  |Description  |
|---------|---------|
|**Set severities and disable unwanted events**    |By default, both the deterministic rules and the rules based on anomalies create alerts for events marked with medium and high severities. <br><br>You might want to configure severities separately production and non-production environments. For example, you might set a debugging activity event as *high* severity in production systems, and turn the same events off entirely in non-production systems.         |
|**Exclude users by their SAP roles or SAP profiles**     |Microsoft Sentinel for SAP ingests the SAP user’s authorization profile, including direct and indirect role assignments, groups, and profiles, so that you can speak the SAP language in your SIEM.<br><br>You might want to configure an SAP event to exclude users based on their SAP roles and profiles. In the watchlist, add the roles or profiles that group your RFC interface users in the **RolesTagsToExclude** column, next to the **Generic table access by RFC** event. This configuration triggers alerts only for users that are missing these roles.         |
|**Exclude users by their SOC tags**     |Use tags to create your own grouping, without relying on complicated SAP definitions or even without SAP authorization. This method is useful for SOC teams that want to create their own grouping for SAP users.<br><br>For example, if you don't want specific service accounts to be alerted for **Generic table access by RFC** events, but can’t find an SAP role or an SAP profile that groups these users, use tags as follows: <br>1. Add the **GenTableRFCReadOK** tag next to the relevant event in the watchlist. <br>2. Go to the **SAP_User_Config** watchlist and assign the interface users the same tag.    |
|**Specify a frequency threshold per event type and system role**     |Works like a speed limit. For example, you might configure **User Master Record Change** events to only trigger alerts if more than 12 activities are observed in an hour, by the same user in a production system. If a user exceeds the 12 per hour limit—for example, 2 events in a 10-minute window—an incident is triggered.  |
|**Determinism or anomalies**     |If you know the event’s characteristics, use the deterministic capabilities. If you aren't sure how to correctly configure the event, allow the machine learning capabilities to decide to start, and then make subsequent updates as needed.         |
|**SOAR capabilities**     |Use Microsoft Sentinel to further orchestrate, automate, and respond to incidents created by SAP audit log dynamic alerts. For more information, see [Automation in Microsoft Sentinel: Security orchestration, automation, and response (SOAR)](../automation/automation.md). |

For more information, see [Available watchlists](sap-solution-security-content.md#available-watchlists).

## Related content

For more information, see:

- [Update Microsoft Sentinel's SAP data connector agent](update-sap-data-connector.md)
- [Automatic attack disruption for SAP (Preview)](deployment-attack-disrupt.md)
- [Monitor the health of your SAP system](../monitor-sap-system-health.md)
