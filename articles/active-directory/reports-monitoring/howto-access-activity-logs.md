---
title: Access activity logs in Azure AD
description: Learn how to choose the right method for accessing the activity logs in Azure AD.
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.subservice: report-monitor
ms.date: 12/19/2022
ms.author: sarahlipsey
ms.reviewer: besiler

ms.collection: M365-identity-device-management
---

# How To: Access activity logs in Azure AD

The data in your Azure Active Directory (Azure AD) logs enables you to assess many aspects of your Azure AD tenant. To cover a broad range of scenarios, Azure AD provides you with various options to access your activity log data. As an IT administrator, you need to understand the intended uses cases for these options, so that you can select the right access method for your scenario.  

This article shows you how to access the Azure AD activity logs and provides common use cases for accessing Azure AD logs data, including recommendations for the right access method. The article also describes related reports that use the data contained in the activity logs.

## Prerequisites
Viewing audit logs is available for features for which you have licenses. If you have a license for a specific feature, you also have access to the audit log information for it. To access the sign-ins activity logs, your tenant must have an Azure AD Premium license associated with it.

The following roles provide read access to audit and sign-in logs. Always use the least privileged role, according to [Microsoft Zero Trust guidance](/security/zero-trust/zero-trust-overview).

- Reports Reader
- Security Reader
- Security Administrator
- Global Reader (sign-in logs only)
- Global Administrator

## Access the activity logs in the portal

1. Navigate to the [Azure portal](https://portal.azure.com) using one of the required roles.
1. Go to **Azure AD** and select **Audit logs**, **Sign-in logs**, or **Provisioning logs**.
1. Adjust the filter according to your needs.
    - For more information on the filter options for audit logs, see [Azure AD audit log categories and activities](reference-audit-activities.md). 
    - For more information on the sign-in logs, see [Basic info in the Azure AD sign-in logs](reference-basic-info-sign-in-logs.md).

## Logs and reports that use activity log data

The data captured in the Azure AD activity logs are used in many reports and services. You can review the sign-in logs, audit logs, and provisioning logs for specific scenarios or use the reports to look at patterns and trends. For example the sign-in logs are helpful when researching a user's sign-in activity or to track an application's usage. If you want to see trends or see how your policies impact the data, you can start with the Azure AD Identity Protection reports or use **Diagnostic settings** to [send your data to **Azure Monitor**](howto-integrate-activity-logs-with-log-analytics.md) for further analysis.

### Audit logs

The audit logs capture a wide variety of data. Some examples of the types of activity captured in the logs are included in the following list. New audit information is added periodically, so this list is not exhaustive.

* Password reset and registration activity
* Self-service groups activity
* Microsoft 365 Group name changes
* Account provisioning activity and errors
* Privileged Identity Management activity
* Device registration and compliance activity

### Anomalous activity reports

Anomalous activity reports provide information on security-related risk detections that Azure AD can detect and report on.

The following table lists the Azure AD anomalous activity security reports, and corresponding risk detection types in the Azure portal. For more information, see
[Azure Active Directory risk detections](../identity-protection/overview-identity-protection.md).  

| Azure AD anomalous activity report |  Identity protection risk detection type|
| :--- | :--- |
| Users with leaked credentials | Leaked credentials |
| Irregular sign-in activity | Impossible travel to atypical locations |
| Sign-ins from possibly infected devices | Sign-ins from infected devices|
| Sign-ins from unknown sources | Sign-ins from anonymous IP addresses |
| Sign-ins from IP addresses with suspicious activity | Sign-ins from IP addresses with suspicious activity |
| - | Sign-ins from unfamiliar locations |

The following Azure AD anomalous activity security reports are not included as risk detections in the Azure portal:

* Sign-ins after multiple failures
* Sign-ins from multiple geographies

### Risk detection and Azure AD Identity Protection

You can access reports about risk detections in **[Azure AD Identity Protection](https://portal.azure.com/#view/Microsoft_AAD_IAM/IdentityProtectionMenuBlade/~/Overview)**. With this service you can protect users by reviewing existing user and sign-in risk policies. You can also analyze current activity with the following reports:

- Risky users
- Risky workload identities
- Risky sign-ins
- Risk detections

For more information, see [What is Identity Protection?](../identity-protection/overview-identity-protection.md)

## Investigate a single sign-in 

Investigating a single sign-in includes scenarios, in which you need to:

- Do a quick investigation of a single user over a limited scope. For example, a user had trouble signing in during a period of a few hours. 

- Quickly look through a set of related events. For example, comparing device details from a series of sign-ins from the same user. 

### Recommendation

For these one-off investigations with a limited scope, the Azure portal is often the easiest way to find the data you need. The related user interface provides you with filter options enabling you to find the entries you need to solve your scenario.  

Check out the following resources:
- [Sign-in logs in Azure Active Directory (preview)](concept-all-sign-ins.md)
- [Sign-in logs in Azure Active Directory](concept-sign-ins.md)
- [Analyze sign-ins with the Azure AD sign-ins log](quickstart-analyze-sign-in.md)
 
## Access from code

There are cases where you need to periodically access activity logs from an app or a script.

### Recommendation 

The right access method for accessing activity logs from code depends on the scope of your project. Two options you have are to access your activity logs from the [Microsoft Graph API](quickstart-access-log-with-graph-api.md) or to send your logs to [Azure Event Hubs](../../event-hubs/event-hubs-about.md). 


The **Microsoft Graph API**:

- Provides a RESTful way to query sign-in data from Azure AD in Azure AD Premium tenants.
- Doesn't require an administrator or developer to set up additional infrastructure to support your script or app. 
- Is **not** designed for pulling large amounts of activity data. Pulling large amounts of activity data using the API leads to issues with pagination and performance. 

**Azure Event Hubs**:

- Is a big data streaming platform and event ingestion service.
- Can receive and process millions of events per second.
- Transforms and stores data by using any real-time analytics provider or batching/storage adapters.

You can use:

- The **Microsoft Graph API** for scoped queries (a limited set of users or time).
- **Azure Event Hubs** for pulling large sets of sign-in data.

## Near real-time security event detection and threat hunting

To detect and stop threats before they can cause harm to your environment, you might have a security solution deployed in your environment that can process activity log data in real-time.

The term *threat hunting* refers to a proactive approach to improve the security posture of your environment. As opposed to classic protection, thread hunting tries to proactively identify potential threats that might harm your system. Your activity log data might be part of your threat hunting solution.

### Recommendation

For real-time security detection, use [Microsoft Sentinel](../../sentinel/overview.md), or [Azure Event Hubs](../../event-hubs/event-hubs-about.md).  

You can use:

- **Microsoft Sentinel** to provide sign-in and audit data to your security operations center for a near real-time security detection. You can stream data to Azure Sentinel with the built-in Azure AD to Azure Sentinel connector. For more information, see [connect Azure Active Directory data to Azure Sentinel](../../sentinel/connect-azure-active-directory.md). 

- **Azure Event Hubs** if your security operations center uses another tool. You can stream Azure AD events using an Azure Event Hubs. For more information, see [stream logs to an event hub](tutorial-azure-monitor-stream-logs-to-event-hub.md). 
  
 Your independent security vendor should provide you with instructions on how to ingest data from Azure Event Hubs into their tool. You can find instructions for some commonly used SIEM tools in the Azure AD reporting documentation:

- [ArcSight](howto-integrate-activity-logs-with-arcsight.md)
- [Splunk](howto-integrate-activity-logs-with-splunk.md) 
- [SumoLogic](howto-integrate-activity-logs-with-sumologic.md) 

## Export data for long term storage 

Azure AD stores your log data only for a limited amount of time. For more information, see [How long does Azure AD store reporting data](reference-reports-data-retention.md). 

If you need to store your log information for a longer period due to compliance or security reasons, you have a few options.

### Recommendation

The right solution for your long term storage depends on your budget and what you plan on doing with the data.
  
If your budget is tight, and you need cheap method to create a long-term backup of your activity logs, you can do a manual download. The user interface of the activity logs provides you with an option to download the data as **JSON** or **CSV**. For more information, see [how to download logs in Azure Active Directory](howto-download-logs.md). 

One trade off of the manual download is that it requires a lot of manual interaction. If you are looking for a more professional solution, use either Azure Storage or Azure Monitor.
  
[Azure Storage](../../storage/common/storage-introduction.md) is the right solution for you if you aren't planning on querying your data often. For more information, see [archive directory logs to a storage account](quickstart-azure-monitor-route-logs-to-storage-account.md).

If you plan to query the logs often to run reports or perform analysis on the stored logs, you should store your data in Azure Monitor. Azure Monitor provides you with built-in reporting and alerting capabilities. For more information, see [integrate Azure Active Directory logs to Azure Monitor logs](howto-integrate-activity-logs-with-log-analytics.md). Once you have the integration set up, you can use Azure Monitor to query your logs. For more information, see [analyze activity logs using Azure Monitor logs](howto-analyze-activity-logs-log-analytics.md).

## Log analysis 

One common requirement is to export activity data to perform a log analysis.

### Recommendation

If you are not planning on using an independent log analysis tool, use Azure Monitor or Event Hubs. Azure Monitor provides a very easy way to analyze logs from Azure AD, as well as other Azure services and independent tools. You can easily export logs to Azure Monitor using the built-in connector. For more information, see [integrate Azure Active Directory logs with Azure Monitor logs](howto-integrate-activity-logs-with-log-analytics.md). Once you have the integration set up, you can use Azure Monitor to query your logs. For more information, see [analyze Azure AD activity logs with Azure Monitor logs](howto-analyze-activity-logs-log-analytics.md).

You can also export your logs to an independent log analysis tool, such as [Splunk](howto-integrate-activity-logs-with-splunk.md). 


## Next steps

* [Get data using the Azure Active Directory reporting API with certificates](tutorial-access-api-with-certificates.md)
* [Audit API reference](/graph/api/resources/directoryaudit) 
* [Sign-in activity report API reference](/graph/api/resources/signin)

