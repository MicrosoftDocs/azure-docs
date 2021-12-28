---
title: Monitor changes to federation configuration in Azure AD | Microsoft Docs
description: This article explains how to monitor changes to your federation configuration with Azure AD.
services: active-directory
documentationcenter: ''
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 06/21/2021
ms.subservice: hybrid
ms.author: billmath
---


# Monitor changes to federation configuration in your Azure AD

When you federate your on-premises environment with Azure AD, you establish a trust relationship between the on-premises identity provider and Azure AD. 

Due to this established trust, Azure AD honors the security token issued by the on-premises identity provider post authentication, to grant access to resources protected by Azure AD. 

Therefore, it's critical that this trust (federation configuration) is monitored closely, and any unusual or suspicious activity is captured.

To monitor the trust relationship, we recommend you set up alerts to be notified when changes are made to the federation configuration.


## Set up alerts to monitor the trust relationship

Follow these steps to set up alerts to monitor the trust relationship:

1. [Configure Azure AD audit logs](../../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md) to flow to an Azure Log Analytics Workspace. 
2. [Create an alert rule](../../azure-monitor/alerts/alerts-log.md) that triggers based on Azure AD log query. 
3. [Add an action group](../../azure-monitor/alerts/action-groups.md) to the alert rule that gets notified when the alert condition is met.  

After the environment is configured, the data flows as follows: 

 1. Azure AD Logs get populated per the activity in the tenant.  
 2. The log information flows to the Azure Log Analytics workspace.  
 3. A background job from Azure Monitor executes the log query based on the configuration of the Alert Rule in the configuration step (2) above.  
    ```
     AuditLogs 
     |  extend TargetResource = parse_json(TargetResources) 
     | where ActivityDisplayName contains "Set federation settings on domain" or ActivityDisplayName contains "Set domain authentication" 
     | project TimeGenerated, SourceSystem, TargetResource[0].displayName, AADTenantId, OperationName, InitiatedBy, Result, ActivityDisplayName, ActivityDateTime, Type 
     ```
     
 4. If the result of the query matches the alert logic (that is, the number of results is greater than or equal to 1), then the action group kicks in. Let’s assume that it kicked in, so the flow continues in step 5.  
 5. Notification is sent to the action group selected while configuring the alert.

 > [!NOTE]
 >  In addition to setting up alerts, we recommend periodically reviewing the configured domains within your Azure AD tenant and removing any stale, unrecognized, or suspicious domains. 




## Next steps

- [Integrate Azure AD logs with Azure Monitor logs](../../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)
- [Create, view, and manage log alerts using Azure Monitor](../../azure-monitor/alerts/alerts-log.md)
- [Manage AD FS trust with Azure AD using Azure AD Connect](how-to-connect-azure-ad-trust.md)
- [Best practices for securing Active Directory Federation Services](/windows-server/identity/ad-fs/deployment/best-practices-securing-ad-fs)