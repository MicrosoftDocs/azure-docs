---
title: Access activity logs in Azure AD | Microsoft Docs
description: Learn how to choose the right method for accessing the activity logs in Azure AD.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: amycolannino
editor: ''

ms.assetid: ada19f69-665c-452a-8452-701029bf4252
ms.service: active-directory
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: report-monitor
ms.date: 08/26/2022
ms.author: markvi
ms.reviewer: besiler

ms.collection: M365-identity-device-management
---


# How To: Access activity logs in Azure AD

The data in your Azure AD logs enables you to assess how your Azure AD is doing. To cover a broad range of scenarios, Azure AD provides you with various options to access your log data. As an IT administrator, you need to understand the intended uses cases for these options, so that you can select the right access method for your scenario.  

This article lists the common use cases for accessing Azure AD logs data and gives recommendations for the right access method. 



## Investigate a single sign-in 


Investigating a single sign-in includes scenarios, in which you need to:

- Do a quick investigation of a single user over a limited scope. For example, a user had trouble signing in during a period of a few hours. 

- Quickly look through a set of related events. For example, comparing device details from a series of sign-ins from the same user. 

### Recommendation

For these one-off investigations with a limited scope, the Azure portal is often the easiest way to find the data you need. In the Azure portal, you find solutions to directly access:

- Sign-ins logs

- Audit logs

- Provisioning logs    

The related user interface provides you with filter options enabling you to find the entries you need to solve your scenario.  


For more **conceptual information**, see [Sign-in logs in Azure Active Directory - preview](concept-all-sign-ins.md) or [Sign-in logs in Azure Active Directory](concept-sign-ins.md).

To **get started**, see [Analyze sign-ins with the Azure AD sign-ins log](quickstart-analyze-sign-in.md).
 


## Access from code

There are cases where you need to periodically access activity logs from an app or a script.

### Recommendation 

The right access method for accessing activity logs from code depends on the scope of your project. One option you have is to access your activity logs from the Microsoft Graph API. 

The **Microsoft Graph API**:

- Provides a RESTful way to query sign-in data from Azure AD in Azure AD Premium tenants.
- Doesn't require an administrator or developer to set up additional infrastructure to support your script or app. 
- Is **not** designed for pulling large amounts of activity data. Pulling large amounts of activity data using the API leads to issues with pagination and performance. 

Another method for accessing activity logs from your code is to use **Azure Event Hubs**. Azure Event Hubs is a big data streaming platform and event ingestion service. It can receive and process millions of events per second. Data sent to an event hub can be transformed and stored by using any real-time analytics provider or batching/storage adapters.

**Use:**

- **The Microsoft graph API** - For scoped queries (a limited set of users or time). For more information, see [access Azure AD logs with the Microsoft Graph API](quickstart-access-log-with-graph-api.md). 
- **Azure Event Hubs** - For pulling large sets of sign-in data. For more information, see [Azure Event Hubs](../../event-hubs/event-hubs-about.md).  


## Near real-time security event detection 

To detect and stop threats before they can cause harm to your environment, you might have a security solution deployed in your environment that can process activity log data in real-time.


### Recommendation

For real-time security detection, use [Microsoft Sentinel](../../sentinel/overview.md), or [Azure Event Hubs](../../event-hubs/event-hubs-about.md).  

**Use:**

- **Microsoft Sentinel** - To provide sign-in and audit data to your security operations center for a near real-time security detection. You can easily stream data to Azure Sentinel with the built in Azure AD to Azure Sentinel connector. For more information, see [connect Azure Active Directory data to Azure Sentinel](../../sentinel/connect-azure-active-directory.md). 

- **Azure Event Hubs** - If your security operations center uses another tool, you can stream Azure AD events using an Azure Event Hubs. For more information, see [stream logs to an event hub](tutorial-azure-monitor-stream-logs-to-event-hub.md). 
  
 
Your independent security vendor should provide you with instructions on how to ingest data from Azure Event Hubs into their tool. You can find instructions for some commonly used SIEM tools in the Azure AD reporting documentation:

- [ArcSight](howto-integrate-activity-logs-with-arcsight.md)
- [Splunk](howto-integrate-activity-logs-with-splunk.md) 
- [SumoLogic](howto-integrate-activity-logs-with-sumologic.md) 



## Threat hunting 


The term *threat hunting* refers to a proactive approach to improve the security posture of your environment.  
As opposed to classic protection, thread hunting tries to proactively identify potential threats that might harm your system. Your activity log data might be part of your threat hunting solution.


### Recommendation

For real-time security detection, use [Microsoft Sentinel](../../sentinel/overview.md), or [Azure Event Hubs](../../event-hubs/event-hubs-about.md).  

**Use:**

- **Microsoft Sentinel** - To provide sign-in and audit data to your security operations center for a near real-time security detection. You can easily stream data to Azure Sentinel with the built in Azure AD to Azure Sentinel connector. For more information, see [connect Azure Active Directory data to Azure Sentinel](../../sentinel/connect-azure-active-directory.md). 

- **Azure Event Hubs** - If your security operations center uses another tool, you can stream Azure AD events using an Azure Event Hubs. For more information, see [stream logs to an event hub](tutorial-azure-monitor-stream-logs-to-event-hub.md). 
  
 
Your independent security vendor should provide you with instructions on how to ingest data from Azure Event Hubs into their tool. You can find instructions for some commonly used SIEM tools in the Azure AD reporting documentation:

- [ArcSight](howto-integrate-activity-logs-with-arcsight.md)
- [Splunk](howto-integrate-activity-logs-with-splunk.md) 
- [SumoLogic](howto-integrate-activity-logs-with-sumologic.md) 



## Export data for long term storage 

Azure AD stores your log data only for a limited amount of time. For more information, see [How long does Azure AD store reporting data](reference-reports-data-retention.md). 

If you need to store your log information for a longer period due to compliance or security reasons, you need to take action.

### Recommendation

The right solution for your long term storage is tight to two pillars:

- Your budget

- What you plan on doing with the data
  

If your budget is tight, and you need cheap method to create a long-term backup of your activity logs, you can do a manual download. The user interface of the activity logs provides you with an option to download the data as **JSON** or **CSV**. For more information, see [how to download logs in Azure Active Directory](howto-download-logs.md). 

One trade off of the manual download is that it requires a lot of manual interaction. If you are looking for a more professional solution, use either Azure storage or Azure monitor.
  
[Azure storage](../../storage/common/storage-introduction.md) the right solution for you if you are not planning on querying your data often. For more information, see [archive directory logs to a storage account](quickstart-azure-monitor-route-logs-to-storage-account.md).

If you also plan to query the logs often to run reports or analysis on the stored logs, you should store your data in Azure monitor. Azure monitor provides you with built-in reporting and alerting capabilities. For more information, see [integrate Azure Active Directory logs to Azure Monitor logs](howto-integrate-activity-logs-with-log-analytics.md). Once you have integration set up, you can use Azure Monitor to query your logs. For more information, see [analyze activity logs using Azure Monitor logs](howto-analyze-activity-logs-log-analytics.md).



## Log analysis 

One common requirement is export activity data to perform a log analysis.


### Recommendation

If you are not planning on using an independent log analysis tool, use Azure monitor or Event Hubs. Azure monitor provides a very easy way to analyze logs from Azure AD, as well as other Azure services and independent tools. You can easily export logs to Azure Monitor using the built in connector. For more information, see [integrate Azure Active Directory logs with Azure Monitor logs](howto-integrate-activity-logs-with-log-analytics.md). Once you have integration set up, you can use Azure Monitor to query your logs. For more information, see [analyze Azure AD activity logs with Azure Monitor logs](howto-analyze-activity-logs-log-analytics.md).

You can also export your logs to an independent log analysis tool, such as [Splunk](howto-integrate-activity-logs-with-splunk.md). 


## Next steps

* [Get data using the Azure Active Directory reporting API with certificates](tutorial-access-api-with-certificates.md)
* [Audit API reference](/graph/api/resources/directoryaudit) 
* [Sign-in activity report API reference](/graph/api/resources/signin)

