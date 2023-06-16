---
title: Tutorial - Archive directory logs to a storage account
description: Learn how to set up Azure Diagnostics to push Azure Active Directory logs to a storage account 
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: tutorial
ms.workload: identity
ms.subservice: report-monitor
ms.date: 11/01/2022
ms.author: sarahlipsey
ms.reviewer: dhanyahk

# Customer intent: As an IT administrator, I want to learn how to route Azure AD logs to an Azure storage account so I can retain it for longer than the default retention period.
ms.collection: M365-identity-device-management
---

# Tutorial: Archive Azure AD logs to an Azure storage account

In this tutorial, you learn how to set up Azure Monitor diagnostics settings to route Azure Active Directory (Azure AD) logs to an Azure storage account.

## Prerequisites 

To use this feature, you need:

* An Azure subscription with an Azure storage account. If you don't have an Azure subscription, you can [sign up for a free trial](https://azure.microsoft.com/free/).
* An Azure AD tenant.
* A user who's a *global administrator* or *security administrator* for the Azure AD tenant.

## Archive logs to an Azure storage account

1. Sign in to the [Azure portal](https://portal.azure.com). 

2. Select **Azure Active Directory** > **Monitoring** > **Audit logs**. 

3. Select **Export Data Settings**. 

4. In the **Diagnostics settings** pane, do either of the following:
    1. To change existing setting, select **Edit setting** next to the diagnostic setting you want to update.
    1. To add new settings, select **Add diagnostic setting**.  

    You can have up to three settings.

     ![Export settings](./media/quickstart-azure-monitor-route-logs-to-storage-account/ExportSettings.png)

5. Once in the **Diagnostic setting** pane if you're creating a new setting, enter a name for the setting to remind you of its purpose (for example, *Send to Azure storage account*). You can't change the name of an existing setting.

6. Under **Destination Details** Select the **Archive to a storage account** check box. 

7. Select the Azure subscription in the **Subscription**  menu and storage account in the **Storage account** menu that you want to route the logs to.

8. Select all the relevant categories in under **Category details**:

    Do either or both of the following:
    1. select the **AuditLogs** check box to send audit logs to the storage account.
    
    1. select the **SignInLogs** check box to send sign-in logs to the storage account.

    ![Diagnostics settings](./media/quickstart-azure-monitor-route-logs-to-storage-account/DiagnosticSettings.png)

9. After the categories have been selected, in the **Retention days** field, type in the number of days of retention you need of your log data. By default, this value is *0*, which means that logs are retained in the storage account indefinitely. If you set a different value, events older than the number of days selected are automatically cleaned up.
 
10. Select **Save** to save the setting.

11. Close the window to return to the Diagnostic settings pane.

## Next steps

* [Tutorial: Configure a log analytics workspace](tutorial-log-analytics-wizard.md)
* [Interpret audit logs schema in Azure Monitor](./overview-reports.md)
* [Interpret sign-in logs schema in Azure Monitor](reference-azure-monitor-sign-ins-log-schema.md)
* [Frequently asked questions and known issues](concept-activity-logs-azure-monitor.md#frequently-asked-questions)
