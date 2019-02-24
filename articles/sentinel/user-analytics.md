---
title: Collect threat intelligence data in Azure Sentinel| Microsoft Docs
description: Learn about how to connect threat intelligence data to Azure Sentinel.
documentationcenter: na
author: rkarlin
manager: MBaldwin
editor: ''

ms.assetid: 56412543-5664-44c1-b026-2dbaf78a9a50
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 2/28/2019
ms.author: rkarlin

---
# Investigate users with user analytics

Azure Sentinel seamlessly integrates with Azure Advanced Threat Protection to analyze user behavior and prioritize which users you should investigate first, based on their alerts, and suspicious activity patterns across Azure Sentinel and Microsoft 365.

Azure Sentinel enriches your user data with analytics from Azure ATP to enable comprehensive user analytics and risk analysis for all users in Azure Active Directory.

## How it works

1. Based on the custom alert rules you created across your third-party data, Azure Sentinel sends alerts to Azure ATP.
1. Azure ATP checks which user entities are connected to the alerts, and raises the investigation priority for those users.
3. Azure ATP recalculates the score of the users enriched with this data and sends it to Azure Sentinel.


## Prerequisites

- An Azure Advanced Threat Protection license 
- To enable the feature, you need global admin permissions on the tenant in which you installed Azure Sentinel

> [!NOTES]
> - For each Azure ATP tenant, you can connect one Azure Sentinel instance.
> - User analytics is currently available only for Azure Active Directory users. 

## Enable user analytics

1. To enable user analytics in Azure Sentinel, in the portal go to the **User analytics** page, and click **Enable**. This sends information about the workspace to Azure ATP.

1. Then, it takes you to Azure ATP under Security Extensions and the Microsoft Azure Sentinel tab, click the plus to add and then select the workspace and click connect.

Look in the Sentinel menu under User analytics
this is a list of users according to their investigation priority. the score is based on Azure ATP alerts, Sentinel alerts and Microsoft Cloud App Security alerts if you have Microsoft Cloud App Security.

You can search for as user, click on the user - you get to the user page. you get a user page like in Azure ATP - you cans see the investigation priority, over time, and the alert activities over time on the timeline. You can see all activities from Microsoft 365 + Sentinel. 

You can also reach the user page by drilling down into the entities in a case.

I order for this to work well, you have to properly set up the custom alert rule to map the right entities so that we can work with Azure ATP.

Windows events map Account to the SID
Azure AD data (which can be found in many logs including Azure Activity) or Office 365 data, you must map the Account to the GUID or the UPN. 

  ![Query](./media/user-analytics/query-window.png)

> [!NOTE]
> In activity logs of Azure Activity, the caller entity includes the UPN.
For example: 

If you're looking for creation of an anomalous number of resources - looks for anomalous number of resources creation or deployment activities in azure activity log.

        AzureActivity      
        | where TimeGenerated >= startofday(ago(7d))        
        | where OperationName == "Create or Update Virtual Machine" or OperationName == "Create Deployment"        
        | where ActivityStatus == "Succeeded"        
        | make-series dResourceCount=dcount(ResourceId)  default=0 on EventSubmissionTimestamp in range(startofday(ago(7d)), now(), 1d) by Caller        
        | extend (RSquare,Slope,Variance,RVariance,Interception,LineFit)=series_fit_line(dResourceCount)        
        | where Slope > 0.2        
        | join kind=leftsemi (        
        // Last day's activity is anomalous        
        AzureActivity        
        | where TimeGenerated >= startofday(ago(1d))        
        | where OperationName == "Create or Update Virtual Machine" or OperationName == "Create Deployment"        
        | where ActivityStatus == "Succeeded"        
        | make-series dResourceCount=dcount(ResourceId)  default=0 on EventSubmissionTimestamp in range(startofday(ago(1d)), now(), 1d) by Caller        
        | extend (RSquare,Slope,Variance,RVariance,Interception,LineFit)=series_fit_line(dResourceCount)        
        | where Slope >0.2        
        ) on Caller        
        | extend AccountCustomEntity = Caller
 
## Next steps

In this document, you learned how to connect your Threat Intelligence provider to Azure Sentinel. To learn more about Azure Sentinel, see the following articles.

- To get started with Azure Sentinel, you need a subscription to Microsoft Azure. If you do not have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/free/).
- Learn how to [onboard your data to Azure Sentinel](quickstart-onboard.md), and [get visibility into your data, and potential threats](quickstart-get-visibility.md).
