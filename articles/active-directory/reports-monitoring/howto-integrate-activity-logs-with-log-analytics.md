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
ms.date: 07/13/2018
ms.author: priyamo
ms.reviewer: dhanyahk

---

# Integrate Azure AD logs with Log Analytics using Azure Monitor (preview)

Log Analytics allows you to query data to find particular events, analyze trends, and perform correlation across various data sources. With the integration of Azure AD activity logs in Log Analytics, you can now perform tasks like:

 * Compare your Azure AD sign-in logs against security logs published by Azure Security Center

 * Troubleshoot performance bottlenecks on your application’s sign-in page by correlating application performance data from Azure Application Insights.  
 
In this article, you learn how to integrate Azure Active Directory (Azure AD) logs with Log Analytics using Azure Monitor.

## Prerequisites 

To use this feature, you need:

* An Azure subscription. If you don't have an Azure subscription, you can [sign up for a free trial](https://azure.microsoft.com/free/).
* An Azure AD tenant.
* A user who's a *global administrator* or *security administrator* for the Azure AD tenant.
* A Log Analytics workspace in your Azure subscription. Learn how to [create a Log Analytics workspace](https://docs.microsoft.com/azure/log-analytics/log-analytics-quick-create-workspace).

## Send logs to Log Analytics

1. Sign in to the [Azure portal](https://portal.azure.com). 

2. Select **Azure Active Directory** > **Activity** > **Audit logs**. 

3. Select **Export Settings**.  
    
4. In the **Diagnostics settings** pane, do either of the following:
    * To change existing settings, select **Edit setting**.
    * To add new settings, select **Add diagnostics setting**.  
      You can have up to three settings.

      ![Export settings](./media/howto-integrate-activity-logs-with-log-analytics/ExportSettings.png)

5. Select the **Send to Log Analytics** check box, and then select **Configure**.

6. Select the Log Analytics workspace you want to send the logs to, or create a new workspace in the provided dialog box.  

7. Select **OK** to exit the workspace configuration.

8. Do either or both of the following:
    * To send audit logs to the storage account, select the **AuditLogs** check box. 
    * To send sign-in logs to the storage account, select the **SignInLogs** check box.

9. Select **Save** to save the setting.

    ![Diagnostics settings](./media/howto-integrate-activity-logs-with-log-analytics/DiagnosticSettings.png)

10. After about 15 minutes, verify that events are streamed to your Log Analytics workspace

    ![Audit logs](./media/howto-integrate-activity-logs-with-log-analytics/InsightsLogsAudit.png)

## Next Steps

* [Analyze data in Log Analytics](https://docs.microsoft.com/azure/log-analytics/log-analytics-tutorial-viewdata)
* [Alert on data in Log Analytics](https://docs.microsoft.com/azure/log-analytics/log-analytics-tutorial-response)

