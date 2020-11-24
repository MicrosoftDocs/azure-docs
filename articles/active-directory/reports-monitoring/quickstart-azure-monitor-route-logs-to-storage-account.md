---
title: Tutorial - Archive directory logs to a storage account | Microsoft Docs
description: Learn how to set up Azure Diagnostics to push Azure Active Directory logs to a storage account 
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: daveba
editor: ''

ms.assetid: 045f94b3-6f12-407a-8e9c-ed13ae7b43a3
ms.service: active-directory
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: report-monitor
ms.date: 04/18/2019
ms.author: markvi
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

2. Select **Azure Active Directory** > **Activity** > **Audit logs**. 

3. Select **Export Settings**. 

4. In the **Diagnostics settings** pane, do either of the following:
   * To change existing settings, select **Edit setting**.
   * To add new settings, select **Add diagnostics setting**.  
     You can have up to three settings. 

     ![Export settings](./media/quickstart-azure-monitor-route-logs-to-storage-account/ExportSettings.png)

5. Enter a friendly name for the setting to remind you of its purpose (for example, *Send to Azure storage account*). 

6. Select the **Archive to a storage account** check box, and then select **Storage account**. 

7. Select the Azure subscription and storage account that you want to route the logs to.
 
8. Select **OK** to exit the configuration.

9. Do either or both of the following:
    * To send audit logs to the storage account, select the **AuditLogs** check box. 
    * To send sign-in logs to the storage account, select the **SignInLogs** check box.

10. Use the slider to set the retention of your log data. By default, this value is *0*, which means that logs are retained in the storage account indefinitely. If you set a different value, events older than the number of days selected are automatically cleaned up.

11. Select **Save** to save the setting.

    ![Diagnostics settings](./media/quickstart-azure-monitor-route-logs-to-storage-account/DiagnosticSettings.png)

12. After about 15 minutes, verify that the logs are pushed to your storage account. Go to the [Azure portal](https://portal.azure.com), select **Storage accounts**, select the storage account that you used earlier, and then select **Blobs**. For **Audit logs**, select **insights-log-audit**. For **Sign-in logs**, select **insights-logs-signin**.

    ![Storage account](./media/quickstart-azure-monitor-route-logs-to-storage-account/StorageAccount.png)

## Next steps

* [Interpret audit logs schema in Azure Monitor](reference-azure-monitor-audit-log-schema.md)
* [Interpret sign-in logs schema in Azure Monitor](reference-azure-monitor-sign-ins-log-schema.md)
* [Frequently asked questions and known issues](concept-activity-logs-azure-monitor.md#frequently-asked-questions)