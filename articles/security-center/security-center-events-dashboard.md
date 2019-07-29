---
title: Monitoring and processing security events in Azure Security Center | Microsoft Docs
description: Learn how you can use Security Center's events dashboard to see security events from your Azure VMs and non-Azure computers.
services: security-center
documentationcenter: na
author: rkarlin
manager: barbkess
editor: ''

ms.assetid: 70c076ef-3ad4-4000-a0c1-0ac0c9796ff1
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/05/2017
ms.author: rkarlin

---
# Monitoring and processing security events in Azure Security Center
The Events dashboard provides an overview of the number of security events collected over time and a list of notable events that may require your attention.  

> [!NOTE]
> Security events dashboard will be retired on July 31st, 2019. For more information and alternative services, see [Retirement of Security Center features (July 2019)](security-center-features-retirement-july2019.md#menu_events).

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../includes/azure-monitor-log-analytics-rebrand.md)]

## What is a security event?
Security Center uses the Microsoft Monitoring Agent to collect various security related configurations and events from your machines and stores these events in your workspace(s). Examples of such data are: operating system logs (Windows event logs), running processes, and events from security solutions integrated with Security Center. The Microsoft Monitoring Agent also copies crash dump files to your workspace(s).

## Requirements
To use this feature, your workspace must be running Log Analytics version 2 and be on Security Center’s Standard tier. See the Security Center [pricing page](security-center-pricing.md) for more information about the Standard tier.

## Events processed dashboard
You access the **Events** dashboard from the Security Center main menu or Security Center **Overview** blade.  

![Events processed dashboard][1]

The **Events** tile under **Security Center** displays the number of events flowing into Security Center from your Azure VMs and non-Azure   computers.

The **Events dashboard** provides an overview of the number of events processed overtime and a list of events.

 ![Dashboard][2]

 The top half of the dashboard trends all events processed in the last week. The bottom half of the dashboard lists notable events and all events by type:

 - **Notable events** include event queries that Security Center provides and event queries that you create and add. The dashboard also provides a quick view into the count of each notable event.
 - **All events by type** shows the event types that are being received and a count for each type. Examples of event type are SecurityEvent, CommonSecurityLog, WindowsFirewall and W3CIISLog.

> [!NOTE]
> Notable events include [web baseline assessment](https://docs.microsoft.com/azure/operations-management-suite/oms-security-web-baseline-assessment). The goal of the Web Baseline assessment is to find potentially vulnerable web server settings.

## View processed event details
1. Under the **Security Center** main menu, select **Events**.
2. The **Events dashboard** workspace selector may open. If you have only one workspace, this workspace selector does not appear. If you have more than one workspace, you need to select a workspace to view its processed event details. Select a workspace from the list if you have more than one workspace.

   ![Workspace list][3]

3. The **Events dashboard** opens showing you event details for the selected workspace. You can view the notable events and all events by type.  In this example, we selected **Notable events**.

   ![Notable event][4]

4. You can query for more data under the workspace by selecting an event type. In this example, we selected **SecurityEvent**.

   ![Selecting an event type][5]

5. **Log Search** opens with additional detail on the event type.

   ![Log search][6]

## Add a notable event
Security Center provides out-of-the-box notable events. You can add notable events based on your own query using the [Kusto query language](../log-analytics/log-analytics-search-reference.md). We’ll return to the **Events dashboard** to add a notable event.

1. Select **Add Notable Event**.

   ![Add a notable event][7]

2. **Add custom notable event** opens.  Under **Display Name**, enter a name for your notable event. Under **Search Query**, enter your query for the event.

   ![Enter your query][8]

4. Select **OK**.

## Update your workspace for events processing
Your workspace must be running Log Analytics version 2 and be on Security Center’s Standard tier to use event processing in Security Center. The **Events dashboard** workspace selector identifies workspaces that do not meet these requirements.

![Workspace does not meet requirements][9]

If the workspace row:

- Contains **REQUIRES UPDATE** - you need to update your workspace to Log Analytics version 2
- Contains **UPGRADE PLAN** – you need to upgrade your workspace to Security Center’s Standard tier
- Is blank - your workspace meets requirements and selecting a workspace takes you to the dashboard

> [!NOTE]
> Under **Events dashboard**, the **EVENTS** column indicates amount of events in each workspace.  This column is blank for some workspaces because Security Center’s Free tier is applied to that workspace. Under the Free tier, Security Center will collect events but the events are not saved in Azure Monitor logs and are not available in the dashboard.
>
>

## Update workspace to Log Analytics version 2
1. Select a workspace that **REQUIRES UPDATE**.
2. **Search Upgrade** opens. Select **Upgrade Now**.

   ![Upgrade now][10]

## Upgrade to Security Center’s Standard tier
1. Select a workspace with **UPGRADE PLAN**.
2. **Events dashboard** opens. Select **Try Events dashboard**.

   ![Try dashboard][11]

3. Under **Onboarding to advanced security**, select the workspace that you are upgrading.
4. Under **Pricing**, select **Standard**.
5. Select **Save**.

   ![Upgrade to Standard tier][12]

## Next steps
In this article you learned how to use Security Center’s Event dashboard. To learn more about how the dashboard works and to write your own event queries, see:

- [What is Azure Monitor logs?](../log-analytics/log-analytics-overview.md) – Overview on Azure Monitor logs
- [Understanding log searches in Kusto](../log-analytics/log-analytics-log-search-new.md) - Describes how log searches are used in Azure Monitor logs and provides concepts that should be understood before creating a log search
- [Kusto search reference](../log-analytics/log-analytics-search-reference.md) – Learn how to write your own event queries using the query language in Log

To learn more about Security Center, see:

- [Security Center Overview](security-center-intro.md) – Describes Security Center’s key capabilities

<!--Image references-->
[1]: ./media/security-center-events-dashboard/events-processed.png
[2]: ./media/security-center-events-dashboard/dashboard.png
[3]: ./media/security-center-events-dashboard/view-processed-event.png
[4]: ./media/security-center-events-dashboard/notable-event.png
[5]: ./media/security-center-events-dashboard/events-by-type.png
[6]: ./media/security-center-events-dashboard/log-search-detail.png
[7]: ./media/security-center-events-dashboard/add-notable-event.png
[8]: ./media/security-center-events-dashboard/create-query.png
[9]: ./media/security-center-events-dashboard/requires-update.png
[10]: ./media/security-center-events-dashboard/search-upgrade.png
[11]: ./media/security-center-events-dashboard/try-dashboard.png
[12]: ./media/security-center-events-dashboard/onboard-workspace.png
