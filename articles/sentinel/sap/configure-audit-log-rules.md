---
title: Configure SAP audit log monitoring with Microsoft Sentinel
description: Monitor the SAP audit logs using Microsoft Sentinel built-in analytics rules, to easily manage your SAP logs, reducing noise with no compromise to security value. 
author: batamig
ms.author: bagol
ms.topic: concept-article
ms.date: 07/02/2024
#Customer.intent: As a security operator, I want to monitor the SAP audit logs and easily manage the logs, so I can reduce noise without compromising security value.
---

# Configure SAP audit log monitoring with Microsoft Sentinel

The SAP audit log records audit and security actions on SAP systems, like failed sign-in attempts or other suspicious actions. This article describes how the Microsoft Sentinel solution for SAP applications helps you monitor the SAP audit logs with built-in analytics rules, improving your SAP log management and reducing noise without compromising security value.

:::image type="icon" source="media/deployment-steps/security.png" border="false"::: Content in this article is relevant for your security team.


<!--do we need this information? this is generic anomaly detection, not specific to SAP.
## Anomaly detection
 
When trying to identify security events in a diverse activity log like the SAP audit log, you need to balance the configuration effort, and the amount of noise the alerts produce.

With the SAP audit log module in the Sentinel for SAP solution, you can choose: 

- Which events you want to look at deterministically, using customized, predefined thresholds and filters.
- Which events you want to leave out, so the machine can learn the parameters on its own.

Once you mark an SAP audit log event type for anomaly detection, the alerting engine checks the events recently streamed from the SAP audit log. The engine checks if the events seem normal, considering the history it has learned. 

Microsoft Sentinel checks an event or group of events for anomalies. It tries to match the event or group of events with previously seen activities of the same kind, at the user and system levels. The algorithm learns the network characteristics of the user at the subnet mask level, and according to seasonality. 

With this ability, you can look for anomalies in previously quieted event types, such as user sign-in events. For example, if the user JohnDoe signs in hundreds of times an hour, you can now let Microsoft Sentinel decide if behavior is suspicious. Is this John from accounting, repeatedly refreshing a financial dashboard with multiple data source, or a DDoS attack forming up?
-->
## Prerequisites

Make sure that you've installed the [Microsoft Sentinel for SAP solution](deployment-overview.md) and have the required permissions to configure the analytics rules.

As with every machine learning solution, Microsoft Sentinel for SAP applications analytics rules perform better with time. Anomaly detection works best using an SAP audit log history of seven days or more.

## Supported analytics rules for audit log monitoring

Use the following analytics rules can either monitor all audit log events on your SAP system or trigger alerts only when anomalies are detected:

|Rule name  |Description  |
|---------|---------|
|**SAP - Missing configuration in the Dynamic Security Audit Log Monitor**     |  By default, runs daily to provide configuration recommendations for the SAP audit log module. Use the rule template to create and customize a rule for your workspace.     |
|**SAP - Dynamic Deterministic Audit Log Monitor (PREVIEW)**     |  By default, runs every 10 minutes and focuses on the SAP audit log events marked as **Deterministic**. Use the rule template to create and customize a rule for your workspace, such as for a lower false positive rate. |
|**SAP - Dynamic Anomaly based Audit Log Monitor Alerts (PREVIEW)**     |  By default, runs hourly and focuses on SAP events marked as **AnomaliesOnly**, alerting on SAP audit log events when anomalies are detected. |

The SAP audit log monitoring rules are delivered as part of the [Microsoft Sentinel for SAP solution security content](sap-solution-security-content.md#monitoring-the-sap-audit-log), and allow for further fine tuning using the *SAP_Dynamic_Audit_Log_Monitor_Configuration* and *SAP_User_Config watchlists*.

For more information, see [Available watchlists](sap-solution-security-content.md#available-watchlists).

## Example: Configure event types with the SAP_Dynamic_Audit_Log_Monitor_Configuration watchlist

The following table lists several examples of how you can use the *SAP_Dynamic_Audit_Log_Monitor_Configuration* watchlist to configure the types of events that produce incidents, reducing the number of incidents generated.

|Option  |Description  |
|---------|---------|
|**Set severities and disable unwanted events**    |By default, both the deterministic rules and the rules based on anomalies create alerts for events marked with medium and high severities. <br><br>You might want to configure severities separately production and non-production environments. For example, you might set a debugging activity event as *high* severity in production systems, and turn the same events off entirely in non-production systems.         |
|**Exclude users by their SAP roles or SAP profiles**     |Microsoft Sentinel for SAP ingests the SAP user’s authorization profile, including direct and indirect role assignments, groups, and profiles, so that you can speak the SAP language in your SIEM.<br><br>You might want to configure an SAP event to exclude users based on their SAP roles and profiles. In the watchlist, add the roles or profiles that group your RFC interface users in the **RolesTagsToExclude** column, next to the **Generic table access by RFC** event. This configuration triggers alerts only for users that are missing these roles.         |
|**Exclude users by their SOC tags**     |Use tags to create your own grouping, without relying on complicated SAP definitions or even without SAP authorization. This method is useful for SOC teams that want to create their own grouping for SAP users.<br><br>For example, if you don't want specific service accounts to be alerted for **Generic table access by RFC** events, but can’t find an SAP role or an SAP profile that groups these users, use tags as follows: <br>1. Add the **GenTableRFCReadOK** tag next to the relevant event in the watchlist. <br>2. Go to the **SAP_User_Config** watchlist and assign the interface users the same tag.    |
|**Specify a frequency threshold per event type and system role**     |Works like a speed limit. For example, you might configure **User Master Record Change** events to only trigger alerts if more than 12 activities are observed in an hour, by the same user in a production system. If a user exceeds the 12 per hour limit—for example, 2 events in a 10-minute window—an incident is triggered.  |
|**Determinism or anomalies**     |If you know the event’s characteristics, use the deterministic capabilities. If you aren't sure how to correctly configure the event, allow the machine learning capabilities to decide to start, and then make subsequent updates as needed.         |
|**SOAR capabilities**     |Use Microsoft Sentinel to further orchestrate, automate, and respond to incidents created by SAP audit log dynamic alerts. For more information, see [Automation in Microsoft Sentinel: Security orchestration, automation, and response (SOAR)](../automation/automation.md). |

For more information, see [Available watchlists](sap-solution-security-content.md#available-watchlists).

## Next steps

In this article, you learned how to monitor the SAP audit log using Microsoft Sentinel built-in analytics rules.

- [Learn more about the SAP Audit log monitor rules](sap-solution-security-content.md#monitoring-the-sap-audit-log)
- [Learn about the SAP Audit Log workbook](sap-audit-log-workbook.md)

 




 


 
 
 

