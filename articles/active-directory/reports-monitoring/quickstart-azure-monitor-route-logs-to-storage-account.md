---
title: Tutorial - Archive Azure Active Directory logs to a storage account
description: Learn how to route Azure Active Directory logs to a storage account 
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: tutorial
ms.workload: identity
ms.subservice: report-monitor
ms.date: 07/14/2023
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
* A user who's a *Global Administrator* or *Security Administrator* for the Azure AD tenant.
* To export sign-in data, you must have an Azure AD P1 or P2 license.

## Archive logs to an Azure storage account

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Azure Active Directory** > **Monitoring** > **Audit logs**. 

1. Select **Export Data Settings**. 

1. You can either create a new setting (up to three settings are allowed) or edit an existing setting.
    - To change existing setting, select **Edit setting** next to the diagnostic setting you want to update.
    - To add new settings, select **Add diagnostic setting**.  

     ![Export settings](./media/quickstart-azure-monitor-route-logs-to-storage-account/ExportSettings.png)

1. Once in the **Diagnostic setting** pane if you're creating a new setting, enter a name for the setting to remind you of its purpose (for example, *Send to Azure storage account*). You can't change the name of an existing setting.

1. Under **Destination Details** select the **Archive to a storage account** check box. Text fields for the retention period appear next to each log category.

1. Select the Azure subscription and storage account for you want to route the logs.

1. Select all the relevant categories in under **Category details**:

    ![Diagnostics settings](./media/quickstart-azure-monitor-route-logs-to-storage-account/DiagnosticSettings.png)

1. In the **Retention days** field, enter the number of days of retention you need of your log data. By default, this value is *0*, which means that logs are retained in the storage account indefinitely. If you set a different value, events older than the number of days selected are automatically cleaned up.
 
1. Select **Save**.

1. After the categories have been selected, in the **Retention days** field, type in the number of days of retention you need of your log data. By default, this value is *0*, which means that logs are retained in the storage account indefinitely. If you set a different value, events older than the number of days selected are automatically cleaned up.

    > [!NOTE]
    > The Diagnostic settings storage retention feature is being deprecated. For details on this change, see [**Migrate from diagnostic settings storage retention to Azure Storage lifecycle management**](../../azure-monitor/essentials/migrate-to-azure-storage-lifecycle-policy.md).

1. Select **Save** to save the setting.

1. Close the window to return to the Diagnostic settings pane.

## Next steps

* [Tutorial: Configure a log analytics workspace](tutorial-log-analytics-wizard.md)
* [Interpret audit logs schema in Azure Monitor](./overview-reports.md)
* [Interpret sign-in logs schema in Azure Monitor](reference-azure-monitor-sign-ins-log-schema.md)
