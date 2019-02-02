---
title: Azure Security Insights Quickstart - Get started with Security Insights | Microsoft Docs
description: Azure Security Center Quickstart - Get started with Security Insights
services: security-insights
documentationcenter: na
author: rkarlin
manager: mbaldwin
editor: ''

ms.assetid: 3424ee2c-4065-4266-887b-60948816e323
ms.service: security-insights
ms.devlang: na
ms.topic: quickstart
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 2/3/2019
ms.author: rkarlin
---

# Quickstart: Get started with Azure Security Insights

This quickstart helps you quickly be able to view and monitor what's happening across your network using Azure Security Insights. After you connected your data sources to ASI, you get instant visualization and analysis of data so that you can know what's happening across all your connected data sources. ASI gives you dashboards that provide you with the full power of tools already available in Azure as well as tables and charts that are built in to provide you with analytics for your logs and queries. You can either use built-in dashboards or create a new dashboard easily, either from scratch or based on an existing dashboard. 

## Get visualization

To visualize and get analysis of what's happening on your network, first, take a look at the overview dashboard to get an idea of the security posture of your organization. You can click on each element of these tiles to drill down to the raw data from which they are created.

1. In the Azure portal, select Azure Security Insights and then select the workspace you want to monitor.

  ![ASI overview](./media/security-insights-qs-get-visibility/overview.png)

- The toolbar across the top tells you how many events you got over the time period selected, and it compares it to the 24 hours before. It tells you from these events, you have alerts that were triggered (the small number represents change over the last 24 hours), and then it tells you for those events, how many are open, in progress, and closed. Check to see that there isn't a dramatic increase or drop in the number of events. I there is a drop, it could be that a connection stopped reporting to ASI. If there is an increase, something suspicious may have happened. Check to see if you have new alerts.
 
   ![ASI funnel](./media/security-insights-qs-get-visibility/funnel.png)

The main body of the overview page gives you insight at a glance into the security status of your workspace:

- **Events and alerts over time**: Lists the number of events and how many alerts were created from those events. If you see a spike that's unusual, you should see alerts for it - if there's something unusual where there is a spike in events but you don't see alerts, it might be cause for concern.

- **Potential malicious events**: When traffic is detected from sources that are known to be malicious, ASI alerts you on the map. If you see orange, it is inbound traffic: someone is trying to access your organization from a known malicious IP address. If you see Outbound (red) activity, it means that data from your firewall is being streamed out of your organization to a known malicious IP address.

   ![ASI map](./media/security-insights-qs-get-visibility/map.png)


- **Most common alerts**: To view Most common alerts, make sure you enabled alerts. If you already enabled alerts during the connection phase, you will see alerts for those events here. This dashboard is built relevant to the alerts you enabled under alerts. If you see as sudden peak in a specific type of alert, it could mean that there is an active attack currently running. For example, if you have a sudden peak of 20 Pass-the-hash events from Azure ATP, it's possible someone is currently trying to attack you.

- **Data source anomalies**: Microsoft's data analysts created models that constantly search the data from your data sources for anomalies. If there aren't any anomalies, nothing is displayed. If anomalies are detected, you should deep dive into them to see what happened. For example, click on the spike in Azure Activity. You can click on **Chart** to see when the spike happened, and then filter for activities that occurred during that time period to see what caused the spike.

   ![ASI map](./media/security-insights-qs-get-visibility/anomalies.png)

## Use built-in dashboards

Built-in dashboards include Azure ID, Azure activity events, and third party, can be data from Windows Events from servers, from first party alerts, from any third party including firewall traffic logs, Office 365, Insecure protocols based on Windows events.

2. Under **Settings**, select **Dashboards**. Under **Installed**, you can see all your installed dashboards. Under **All** you can see the whole gallery of built-in dashboards that are available for installation. 
3. Search for a specific dashboard to see the whole list and description of what each offers. 
4. Assuming you use Azure AD, to get up and running with ASI, we recommend that you install at least the following dashboards:
   - **Azure AD**: Use either or both of the following:
       - **Azure AD sign ins** analyzes sign ins over time to see if there are anomalies. This dashboard provides failed sign-ins by applications, devices, and locations so that you can notice, at a glance if something unusual happens. Pay attention to multiple failed sign-ins. 
       - **Azure AD audit logs** analyzes admin activities, such as changes in users (add, remove, etc.), group creation, and modifications.  

   - Add a dashboard for your firewall. For example, add the Palo Alto dashboard. The dashboard analyzes your firewall traffic, providing you with correlations between your firewall data and threat events and highlights suspicious events across entities. Provides you with information about trends in your traffic and lets you drill down into and filter results. 

      ![Pal Alto dashboard](./media/security-insights-qs-get-visibility/palo-alto-week-query.png)


You can customize the dashboards either by editing the main query [button]. You can click the [blue button] to go to [Log Analytics to edit the query there](../azure/azure-monitor/log-query/getstarted-portal.md), and you can click the three dots and select **Customize tile data**, which enables you to edit the main time filter, or remove the specific tiles from the dashboard.

For more information on working with queries, see [Tutorial: Visual data in Log Analytics](../azure/azure-monitor/learn/tutorial-logs-dashboards.md)

To add a new tile:

If you want to add a new tile, you must add it to an existing dashboard, either one that you create or an ASI built-in dashboard. 
1. In Log Analytics, create a tile using the instructions found in [Tutorial: Visual data in Log Analytics](../azure/azure-monitor/learn/tutorial-logs-dashboards.md). 
2. After the tiles is created, under **Pin**, select the dashboard in which you want the tile to appear.

## Create new dashboards
You can create a new dashboard from scratch or use a built-in dashboard as the basis for your new dashboard.

1. To create a new dashboard from scratch, select **Dashboards** and then **+New dashboard**.
2. Select the subscription the dashboard is created in and give it a descriptive name. Each dashboard is an Azure resource like any other, and you can assign it roles (RBAC) to define and limit who can access. 
3. To enable it to show up in your subscription, you have to share it. Click **Share** and then **Manage users**. Use the **Check access** and **Role assignments** as you would for any other Azure resource. For more information see [Share Azure dashboards by using RBAC](../azure/azure-portal/azure-portal-share-access.md).


## New dashboard examples

The following sample query enables you to compare trends of traffic across weeks. You can easily switch which device vendor and data source you run the query on. This example uses Palo Alto Networks device and SecurityEvent from Windows, you can switch it to run on AzureActivity or CommonSecurityLog on any other firewall.

  |where DeviceVendor = = "Palo Alto Networks":

      // week over week query
      SecurityEvent
      | where TimeGenerated > ago(14d)
      | summarize count() by bin(TimeGenerated, 1d)
      | extend Week = iff(TimeGenerated>ago(7d), "This Week", "Last Week"), TimeGenerated = iff(TimeGenerated>ago(7d), TimeGenerated, TimeGenerated + 7d)


You might want to create a query that incorporates data from multiples sources. You can create a query that looks at Azure Active Directory audit logs for new users that were just created, and then checks your Azure logs to see if the user started making role assignment changes within 24 hours of creation. That suspicious activity would show up on this dashboard:

    AuditLogs

    | where OperationName == "Add user"

    | project AddedTime = TimeGenerated, user = tostring(TargetResources[0].userPrincipalName)

    | join (AzureActivity

    | where OperationName == "Create role assignment"

    | project OperationName, RoleAssignmentTime = TimeGenerated, user = Caller) on user

    | project-away user1

You can create different dashboards based on role of person looking at the data and what they're looking for. For example, you can create a dashboard for your network admin that includes the firewall data. You can also create dashboards based on how frequently you want to look at them, whether there are things you want to review daily, and others you want to check once an hour, for example, you might want to look at your Azure AD sign ins every hour to search for anomalies. 


## Next steps
In this quickstart, you learned how to get started using Azure Security Insights. Continue to the tutorial for [how to write a playbook](tutorial-write-playbook.md).
> [!div class="nextstepaction"]
> [Create custom alerts](security-insights-write-custom-alerts.md) to keep up to date with the latest anomalies and threats in your environment.
> [Create playbooks](tutorial-respond-threats-playbook.md) to automate your responses to threats.

