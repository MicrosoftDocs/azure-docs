---
title: How to integrate Azure Active Directory logs with Log Analytics by using Azure Monitor (preview)  | Microsoft Docs
description: Learn how to integrate Azure Active Directory logs with Log Analytics by using Azure Monitor (preview)
services: active-directory
documentationcenter: ''
author: priyamohanram
manager: mtillman
editor: ''

ms.assetid: 2c3db9a8-50fa-475a-97d8-f31082af6593
ms.service: active-directory
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.component: report-monitor
ms.date: 11/13/2018
ms.author: priyamo
ms.reviewer: dhanyahk

---

# Integrate Azure AD logs with Log Analytics using Azure Monitor (preview)

Log Analytics allows you to query data to find particular events, analyze trends, and perform correlation across various data sources. With the integration of Azure AD activity logs in Log Analytics, you can now perform tasks like:

 * Compare your Azure AD sign-in logs against security logs published by Azure Security Center

 * Troubleshoot performance bottlenecks on your application’s sign-in page by correlating application performance data from Azure Application Insights.  

The following video from an Ignite session demonstrates the benefits of using Log Analytics for Azure AD logs in practical user scenarios.

> [!VIDEO https://www.youtube.com/embed/MP5IaCTwkQg?start=1894]

In this article, you learn how to integrate Azure Active Directory (Azure AD) logs with Log Analytics using Azure Monitor.

## Supported reports

You can route audit activity logs and sign-in activity logs to Log Analytics for further analysis. 

* **Audit logs**: The [audit logs activity report](concept-audit-logs.md) gives you access to the history of every task that's performed in your tenant.
* **Sign-in logs**: With the [sign-in activity report](concept-sign-ins.md), you can determine who performed the tasks that are reported in the audit logs.

> [!NOTE]
> B2C-related audit and sign-in activity logs are not supported at this time.
>

## Prerequisites 

To use this feature, you need:

* An Azure subscription. If you don't have an Azure subscription, you can [sign up for a free trial](https://azure.microsoft.com/free/).
* An Azure AD tenant.
* A user who's a *global administrator* or *security administrator* for the Azure AD tenant.
* A Log Analytics workspace in your Azure subscription. Learn how to [create a Log Analytics workspace](https://docs.microsoft.com/azure/log-analytics/log-analytics-quick-create-workspace).

## Send logs to Log Analytics

1. Sign in to the [Azure portal](https://portal.azure.com). 

2. Select **Azure Active Directory** > **Diagnostic settings** -> **Add diagnostic setting**. You can also select **Export Settings** from the **Audit Logs** or **Sign-ins** page to get to the diagnostic settings configuration page.  
    
3. In the **Diagnostic settings** menu, select the **Send to Log Analytics** check box, and then select **Configure**.

4. Select the Log Analytics workspace you want to send the logs to, or create a new workspace in the provided dialog box.  

5. Do either or both of the following:
    * To send audit logs to the Log Analytics workspace, select the **AuditLogs** check box. 
    * To send sign-in logs to the Log Analytics workspace, select the **SignInLogs** check box.

6. Select **Save** to save the setting.

    ![Diagnostics settings](./media/howto-integrate-activity-logs-with-log-analytics/Configure.png)

7. After about 15 minutes, verify that events are streamed to your Log Analytics workspace.

## Next Steps

* [Analyze Azure AD activity logs in Log Analytics](howto-analyze-activity-logs-log-analytics.md)
* [Install and use the Log Analytics views for Azure Active Directory](howto-install-use-log-analytics-views.md)
