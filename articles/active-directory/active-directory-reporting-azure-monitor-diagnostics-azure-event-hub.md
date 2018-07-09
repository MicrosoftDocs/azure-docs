---
title: Tutorial - Route Azure Active Directory logs to an Azure event hub | Microsoft Docs
description: Learn how to set up Azure Diagnostics to push Azure Active Directory logs to an event hub  
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
ms.date: 05/17/2018
ms.author: priyamo
ms.reviewer: dhanyahk

---

# Tutorial: Route Azure Active Directory logs to an Azure event hub

In this tutorial, learn how to set up Azure Monitor diagnostic settings to route Azure Active Directory logs to an Azure event hub. Use this mechanism to integrate your logs with third-party SIEM tools like Splunk and QRadar.

## Prerequisites 

You need:

* An Azure subscription
* An Azure Active Directory tenant
* A user, who is an administrator for that tenant

## Archive logs to Event hub


1. Sign in to the [Azure portal](https://portal.azure.com). 
2. Click on **Azure Active Directory** -> **Activity** -> **Audit logs**. 
3. Click **Export Settings** to open the Diagnostic Settings blade. Click **Edit setting** if you want to change existing settings or click **Add diagnostic setting** to add a new one. You can have up to three settings. 

![Export settings](./media/active-directory-reporting-azure-monitor-diagnostics-azure-event-hub/ExportSettings.png "Export settings")

4. Check the **Stream to an event hub** checkbox and click **Event Hub/Configure**.
5. Select an Azure subscription and Event Hubs namespace you want to route the logs to. The subscription and Event Hubs namespace must both be associated with the Active Directory tenant that the logs stream from. You can also specify an event hub within the Event Hubs namespace to which logs should be sent. If no event hub is specified, an event hub will be created in the namespace with the default name **insights-logs-audit**.
6. Click **OK** to exit the event hub configuration.
7. Check the **Audit** checkbox to send audit logs to the storage account. 
8. Check the **SignIn** checkbox to send sign-in logs to the storage account.
9. Click **Save** to save the setting.

![Diagnostics settings](./media/active-directory-reporting-azure-monitor-diagnostics-azure-event-hub/DiagnosticSettings.png "Diagnostic settings")

10. After about 15 minutes, verify that events appear in your event hub. To do this, navigate to the event hub from the portal and verify that the **incoming messages** count is greater than zero. 

![Audit logs](./media/active-directory-reporting-azure-monitor-diagnostics-azure-event-hub/InsightsLogsAudit.png "Audit logs")


## Access data from Event Hubs

Once data appears in the event hub, you can access it in two ways.

* **Configure a supported SIEM tool to read the data**: Splunk is the only SIEM tool that is currently supported. For more information on how to integrate Azure AD logs with Splunk, see [How to integrate Azure Active Directory logs with Splunk using Azure Monitor Diagnostics](active-directory-reporting-azure-monitor-diagnostics-splunk-integration.md).

* **Set up custom tooling to read the data**: If your current SIEM isn't supported in Azure monitor diagnostics yet, you can set up custom tooling using the Event hub APIs. To learn more, see the [Event hub APIs](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-dotnet-standard-getstarted-receive-eph).
