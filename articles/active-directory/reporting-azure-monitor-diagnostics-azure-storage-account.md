---
title: Tutorial - Archive Azure Active Directory logs to an Azure storage account (preview) | Microsoft Docs
description: Learn how to set up Azure Diagnostics to push Azure Active Directory logs to a storage account (preview)  
services: active-directory
documentationcenter: ''
author: priyamohanram
manager: mtillman
editor: ''

ms.assetid: 045f94b3-6f12-407a-8e9c-ed13ae7b43a3
ms.service: active-directory
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: identity
ms.component: compliance-reports
ms.date: 07/13/2018
ms.author: priyamo
ms.reviewer: dhanyahk

---

# Tutorial: Archive Azure Active Directory logs to an Azure storage account (preview)

In this tutorial, you will learn how to set up Azure Monitor diagnostic settings to route Azure Active Directory logs to an Azure storage account.

## Prerequisites 

You need:

* An Azure subscription with an Azure storage account. If you don't have an Azure subscription, you can [sign up for a free trial](https://azure.microsoft.com/free/).
* An Azure Active Directory tenant.
* A user, who is a global administrator or security administrator for that tenant.

## Archive logs to an Azure storage account

1. Sign in to the [Azure portal](https://portal.azure.com). 
2. Click on **Azure Active Directory** -> **Activity** -> **Audit logs**. 
3. Click **Export Settings** to open the Diagnostic Settings blade. Click **Edit setting** if you want to change existing settings or click **Add diagnostic setting** to add a new one. You can have a maximum of three settings. 
    ![Export settings](./media/reporting-azure-monitor-diagnostics-azure-storage-account/ExportSettings.png "Export settings")

4. Add a friendly name for the setting to remind you of its purpose. For example, "Send to Azure storage account". 
5. Check the **Archive to a storage account** checkbox and click **Storage account** to choose the Azure storage account. 
6. Select an Azure subscription and storage account that you want to route the logs to, and click **OK** to close out of the configuration.
7. Check the **AuditLogs** checkbox to send audit logs to the storage account. 
8. Check the **SignInLogs** checkbox to send sign-in logs to the storage account.
9. Use the slider to set retention on your log data. By default, this value is "0" and logs will be retained in the storage account indefinitely. Else, you can set a value and events older than the number of days selected will be automatically cleaned up.
10. Click **Save** to save the setting.
    ![Diagnostics settings](./media/reporting-azure-monitor-diagnostics-azure-storage-account/DiagnosticSettings.png "Diagnostics settings")

11. After about 15 minutues, verify that the logs are pushed into your storage account. Go to the Azure portal, click **Storage accounts**, choose the storage account you used earlier and click **Blobs**. 
12. For **Audit logs**, click **insights-log-audit**. For **Sign-in logs**, click **insights-logs-signin**.
    ![Storage account](./media/reporting-azure-monitor-diagnostics-azure-storage-account/StorageAccount.png "Storage account")

## Next steps

* [Interpret audit logs schema in Azure monitor](reporting-azure-monitor-diagnostics-audit-log-schema.md)
* [Interpret sign-in logs schema in Azure monitor](reporting-azure-monitor-diagnostics-sign-in-log-schema.md)
* [Frequently asked questions and known issues](reporting-azure-monitor-diagnostics-overview.md#frequently-asked-questions)