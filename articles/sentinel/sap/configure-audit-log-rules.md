---
title: Configure SAP audit log monitoring rules with Microsoft Sentinel
description: Monitor the SAP audit logs using Microsoft Sentinel built-in analytics rules, to easily manage your SAP logs, reducing noise with no compromise to security value. 
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 08/19/2022
#Customer.intent: As a security operator, I want to monitor the SAP audit logs and easily manage the logs, so I can reduce noise without compromising security value.
---

# Configure SAP audit log monitoring rules

The SAP audit log records audit and security actions on SAP systems, like failed sign-in attempts or other suspicious actions. This article describes how to monitor the SAP audit log using Microsoft Sentinel built-in analytics rules. 

With these rules, you can monitor all audit log events, or get alerts only when anomalies are detected. This way, you can better manage your SAP logs, reducing noise with no compromise to your security value.

You use two analytics rules to monitor and analyze your SAP audit log data:

- **SAP - Dynamic Deterministic Audit Log Monitor (PREVIEW)**. Alerts on any SAP audit log events with minimal configuration. You can configure the rule for an even lower false-positive rate. [Learn how to configure the rule](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/microsoft-sentinel-for-sap-news-dynamic-sap-security-audit-log/ba-p/3326842). 
- **SAP - Dynamic Anomaly based Audit Log Monitor Alerts (PREVIEW)**. Alerts on SAP audit log events when anomalies are detected, using machine learning capabilities and with no coding required. [Learn how to configure the rule](#set-up-the-sap---dynamic-anomaly-based-audit-log-monitor-alerts-preview-rule-for-anomaly-detection).

The two [SAP Audit log monitor rules](sap-solution-security-content.md#monitoring-the-sap-audit-log) are delivered as ready to run out of the box, and allow for further fine tuning using the [SAP_Dynamic_Audit_Log_Monitor_Configuration and SAP_User_Config watchlists](sap-solution-security-content.md#available-watchlists).

## Anomaly detection
 
When trying to identify security events in a diverse activity log like the SAP audit log, you need to balance the configuration effort, and the amount of noise the alerts produce.

With the SAP audit log module in the Sentinel for SAP solution, you can choose: 
- Which events you want to look at deterministically, using customized, predefined thresholds and filters.
- Which events you want to leave out, so the machine can learn the parameters on its own.

Once you mark an SAP audit log event type for anomaly detection, the alerting engine checks the events recently streamed from the SAP audit log. The engine checks if the events seem normal, considering the history it has learned. 

Microsoft Sentinel checks an event or group of events for anomalies. It tries to match the event or group of events with previously seen activities of the same kind, at the user and system levels. The algorithm learns the network characteristics of the user at the subnet mask level, and according to seasonality. 

With this ability, you can look for anomalies in previously quieted event types, such as user sign-in events. For example, if the user JohnDoe signs in hundreds of times an hour, you can now let Microsoft Sentinel decide if behavior is suspicious. Is this John from accounting, repeatedly refreshing a financial dashboard with multiple data source, or a DDoS attack forming up?

## Set up the SAP - Dynamic Anomaly based Audit Log Monitor Alerts (PREVIEW) rule for anomaly detection

If your SAP audit log data isn't already streaming data into the Microsoft Sentinel workspace, learn how to [deploy the solution](deployment-overview.md).

1. From the Microsoft Sentinel navigation menu, under **Content management**, select **Content hub (Preview)**. 
1. Check if your **Continuous threat monitoring for SAP** application has updates.
1. From the navigation menu, under **Analytics**, enable these 3 audit log alerts:
    - **SAP - Dynamic Deterministic Audit Log Monitor**. Runs every 10 minutes and focuses on the SAP audit log events marked as **Deterministic**.
    - **SAP - (Preview) Dynamic Anomaly based Audit Log Monitor Alerts**. Runs hourly and focuses on SAP events marked as **AnomaliesOnly**.
    - **SAP - Missing configuration in the Dynamic Security Audit Log Monitor**. Runs daily to provide configuration recommendations for the SAP audit log module.

Microsoft Sentinel now scans the entire SAP audit log at regular intervals, for deterministic security events and anomalies. You can view the incidents this log generates in the **Incidents** page.

As with every machine learning solution, it will perform better with time. Anomaly detection works best using an SAP audit log history of seven days or more. 

### Configure event types with the SAP_Dynamic_Audit_Log_Monitor_Configuration watchlist

You can further configure event types that produce too many incidents using the [SAP_Dynamic_Audit_Log_Monitor_Configuration](sap-solution-security-content.md#available-watchlists) watchlist. Here are a few options for reducing incidents. 

|Option  |Description  |
|---------|---------|
|Set severities and disable unwanted events     |By default, both the deterministic rules and the rules based on anomalies create alerts for events marked with medium and high severities. You can set these severities specifically for production and non-production environments. For example, you can set a debugging activity event as high severity in production systems, and disable those events in non-production systems.         |
|Exclude users by their SAP roles or SAP profiles     |Microsoft Sentinel for SAP ingests the SAP user’s authorization profile, including direct and indirect role assignments, groups and profiles, so that you can speak the SAP language in your SIEM.<br><br>You can configure an SAP event to exclude users based on their SAP roles and profiles. In the watchlist, add the roles or profiles that group your RFC interface users in the **RolesTagsToExclude** column, next to the **Generic table access by RFC** event. From now on, you’ll get alerts only for users that are missing these roles.         |
|Exclude users by their SOC tags     |With tags, you can come up with your own grouping, without relying on complicated SAP definitions or even without SAP authorization. This method is useful for SOC teams that want to create their own grouping for SAP users.<br><br>Conceptually, excluding users by tags works like name tags: you can set multiple events in the configuration with multiple tags. You don’t get alerts for a user with a tag associated with a specific event. For example, you don’t want specific service accounts to be alerted for **Generic table access by RFC** events, but can’t find an SAP role or an SAP profile that groups these users. In this case, you can add the **GenTableRFCReadOK** tag next to the relevant event in the watchlist, and then go to the **SAP_User_Config** watchlist and assign the interface users the same tag.    |
|Specify a frequency threshold per event type and system role     |Works like a speed limit. For example, you can decide that the noisy **User Master Record Change** events only trigger alerts if more than 12 activities are observed in an hour, by the same user in a production system. If a user exceeds the 12 per hour limit—for example, 2 events in a 10-minute window—an incident is triggered.  |
|Determinism or anomalies     |If you know the event’s characteristics, you can use the deterministic capabilities. If you aren't sure how to correctly configure the event, the machine learning capabilities can decide.         |
|SOAR capabilities     |You can use Microsoft Sentinel to further orchestrate, automate and respond to incidents that can be applied to the SAP audit log dynamic alerts. Learn about [Security Orchestration, Automation, and Response (SOAR)](../automation.md).  |

## Next steps

In this article, you learned how to monitor the SAP audit log using Microsoft Sentinel built-in analytics rules.

- [Learn more about the SAP Audit log monitor rules](sap-solution-security-content.md#monitoring-the-sap-audit-log)
- [Learn about the SAP Audit Log workbook](sap-audit-log-workbook.md)

 




 


 
 
 

