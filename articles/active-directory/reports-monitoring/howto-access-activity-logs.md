---
title: How To: Access activity logs in Azure AD | Microsoft Docs
description: Learn how to choose the right method for accessing the activity logs in Azure AD.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: karenhoran
editor: ''

ms.assetid: ada19f69-665c-452a-8452-701029bf4252
ms.service: active-directory
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: report-monitor
ms.date: 11/08/2022
ms.author: markvi
ms.reviewer: besiler

ms.collection: M365-identity-device-management
---
# How To: Access activity logs in Azure AD

The data in your Azure AD logs enables you to asses how your Azure AD is doing. To cover a broad range of scenarios, Azure AD provides you with various options to access your log data. As an IT administrator, you need to understand the intended uses cases for these options, so that you can select the right access method for your scenario.  

This article lists the common use cases for accessing Azure AD logs data and gives recommendations for the right access method. 



## Investigate a single sign-in 


Investigating a single sign-in includes scenarios, in which you need to:

- Do a quick investigation of a single user over a limited scope. For example, a user had trouble signing in during a period of a few hours. 

- Quickly look through a set of related events. For example, comparing device details from a series of sign-ins from the same user. 

### Recommendation

For these one-off investigations with a limited scope, the Azure portal is often the easiest way to find the data you need. In the the Azure portal, you find solutions to directly access:

- Sign-ins logs

- Audit logs

- Provisioning logs    

The related user interface provides you with filter options enabling you to find the entries you need to solve your scenario.  


For more **conceptual information**, see [Sign-in logs in Azure Active Directory - preview](concept-all-sign-ins.md) or [Sign-in logs in Azure Active Directory](concept-sign-ins.md).

To **get started**, see [Analyze sign-ins with the Azure AD sign-ins log](quickstart-analyze-sign-in.md).
 


## Access from an app or script 


**You need to:**

- Build an app or script that periodically requests user log in info. 


### Recommendation 

The graph API provides a lightweight way to pull Azure AD activity data, which doesn’t require an admin or developer to set up additional infrastructure to support a script or app. However, the MS Graph API is **not** designed for pulling all of a tenant’s sign in records. For large tenants, pulling all records leads to issues with pagination and performance. 


### Recommendation

Use:

- **The graph API** - For scoped queries (a limited set of users or time). 
- **Event hubs** - For pulling large sets of sign-in data.  


The graph API provides a RESTful way to query sign-in data from Azure AD for customers with Premium licenses.  

To learn more about querying signins through Graph, start here: Access Azure AD logs with the Microsoft Graph API | Microsoft Docs   


## Near real time security event detection 

Near real time security event detection includes scenarios, in which you need to:

- A
- B


### Recommendation

Use Azure sentinel or event hubs export to another security tool. If you need to provide sign-in and audit data to your security operations center for a near real time security detection, you can easily stream data to Azure Sentinel with the built in Azure AD to Azure Sentinel connector. For more information, see Connect Azure Active Directory data to Azure Sentinel | Microsoft Docs 
 

If your Security Operations Center uses another tool, you can stream Azure AD events using an Azure Event Hubs: Tutorial - Stream logs to an Azure event hub | Microsoft Docs. Your independent security vendor should provide you with instructions on how to ingest data from Azure Event Hubs into their tool. You can find instructions for some commonly used SIEM tools in the Azure AD reporting documentation:  

Integrate logs with ArcSight using Azure Monitor | Microsoft Docs 

Integrate Splunk using Azure Monitor | Microsoft Docs 

Integrate Splunk using Azure Monitor | Microsoft Docs 

Use Azure AD data for threat hunting 

Use Azure Sentinel or Event Hubs export. Admins who need to provide Azure AD data to their security operations center for threat hunting can use the same options as listed for security detections above.  You can easily stream data to Azure Sentinel with the built in Azure AD to Azure Sentinel connector: Connect Azure Active Directory data to Azure Sentinel | Microsoft Docs 

 

If your Security Operations Center uses another tool, you can stream Azure AD events using an Azure Event Hubs: Tutorial - Stream logs to an Azure event hub | Microsoft Docs. Your independent security vendor should provide you with instructions on how to ingest data from Azure Event Hubs into their tool. You can find instructions for some commonly used SIEM tools in the Azure AD reporting documentation:  

Integrate logs with ArcSight using Azure Monitor | Microsoft Docs 

Integrate Splunk using Azure Monitor | Microsoft Docs 

Integrate Splunk using Azure Monitor | Microsoft Docs 


## Export data for long term storage 

Azure AD stores your log data only for a limited amount of time. For more information, see [How long does Azure AD store reporting data](reference-reports-data-retention.md). 

If you need to store your log information for a longer period due to compliance or security reasons, you need to take action.

### Recommendation

The right solution for your long term storage is tight to two ABC (pillars?):

- Your budget

- What you plan to do with the data
  

The cheapest method to create a long-term backup of your log data is a manual download. The logs user interface provides you with an option to download the data as **JSON** or **CSV**. However, this method requires a lot of manual interaction.

If you only need a more sophisticated backup method for your data, use Azure storage. 

    
If you also plan to query the logs often or to run reports or analysis on the stored logs, you should store your data in Azure monitor. Azure monitor provides you with built-in reporting and alerting capabilities.


### Next step




## Export data for a logs analysis 


### Considerations

Azure Monitor provides you with a very easy way to analyze logs from Azure AD, as well as other Azure services and independent tools. You can easily export logs to Azure Monitor using the built in connector. For more information, see [Azure AD activity logs in Azure Monitor](concept-activity-logs-azure-monitor.md).



### Recommendation

To use:

- **Azure AD** - Use Azure Monitor or Event Hubs. For example, you can [export logs to Azure monitor]()

- **Independent log analysis tools** - For an example, see [Integrate Azure Active Directory logs with Splunk using Azure Monitor](howto-integrate-activity-logs-with-splunk.md).




: Stream Azure Active Directory logs to Azure Monitor logs | Microsoft Docs. Once you have integration set up, you can use Azure Monitor to query your logs: Analyze activity logs using Azure Monitor logs | Microsoft Docs. 

 


## Next steps

* [Get data using the Azure Active Directory reporting API with certificates](tutorial-access-api-with-certificates.md)
* [Audit API reference](/graph/api/resources/directoryaudit) 
* [Sign-in activity report API reference](/graph/api/resources/signin)

