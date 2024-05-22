---
title: Customize data views with workbooks | Microsoft Sentinel
description: Learn how to use Microsoft Sentinel workbook templates to customize data visualization across your environment.
author: batamig
ms.topic: how-to
ms.date: 05/21/2024
ms.author: bagol
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
#customerIntent: As a security analyst, I want to learn how to customize Microsoft Sentinel data visualizations across my environment.
---

# Visualize log and query data with Microsoft Sentinel workbooks

Microsoft Sentinel workbooks 

Microsoft Sentinel gives you workbooks that provide you with the full power of tools already available in Azure as well as tables and charts that are built in to provide you with analytics for your logs and queries. You can either use workbook templates or create a new workbook easily, from scratch or based on an existing workbook. 

## Use workbooks templates<a name="dashboards"></a>

Workbook templates provide integrated data from your connected data sources to let you deep dive into the events generated in those services. Workbook templates include Microsoft Entra ID, Azure activity events, and on-premises, which can be data from Windows Events from servers, from first party alerts, from any third-party including firewall traffic logs, Office 365, and insecure protocols based on Windows events. The workbooks are based on Azure Monitor Workbooks to provide you with enhanced customizability and flexibility in designing your own workbook. For more information, see [Workbooks](../azure-monitor/visualize/workbooks-overview.md).

1. Under **Settings**, select **Workbooks**. Under **My workbooks**, you can see all your saved workbook. Under **Templates**, you can see the workbooks templates that are installed. To find more workbook templates, go to the **Content hub** in Microsoft Sentinel to install product solutions or standalone content.
2. Search for a specific workbook to see the whole list and description of what each offers. 
3. Assuming you use Microsoft Entra ID, to get up and running with Microsoft Sentinel, we recommend that you install the Microsoft Entra solution for Microsoft Sentinel and use the following workbooks:
   - **Microsoft Entra ID**: Use either or both of the following:
       - **Microsoft Entra sign-ins** analyzes sign-ins over time to see if there are anomalies. This workbooks provides failed sign-ins by applications, devices, and locations so that you can notice, at a glance if something unusual happens. Pay attention to multiple failed sign-ins. 
       - **Microsoft Entra audit logs** analyzes admin activities, such as changes in users (add, remove, etc.), group creation, and modifications.  

   - Install the appropriate solution to add a workbook for your firewall. For example, install the Palo Alto firewall solution for Microsoft Sentinel to add the Palo Alto workbooks. The workbooks analyze your firewall traffic, providing you with correlations between your firewall data and threat events, and highlights suspicious events across entities. Workbooks provide you with information about trends in your traffic and let you drill down into and filter results. 

      ![Palo Alto dashboard](./media/qs-get-visibility/palo-alto-week-query.png)


You can customize the workbooks either by editing the main query ![query edit button](./media/qs-get-visibility/edit-query-button.png). You can click the button ![Log Analytics button](./media/qs-get-visibility/go-to-la-button.png) to go to [Log Analytics to edit the query there](../azure-monitor/logs/log-analytics-tutorial.md), and you can select the ellipsis (...) and select **Customize tile data**, which enables you to edit the main time filter, or remove the specific tiles from the workbook.

For more information on working with queries, see [Tutorial: Visual data in Log Analytics](../azure-monitor/visualize/tutorial-logs-dashboards.md)

### Add a new tile

If you want to add a new tile, you can add it to an existing workbook, either one that you create or a Microsoft Sentinel built-in workbook. 
1. In Log Analytics, create a tile using the instructions found in [Visual data in Log Analytics](../azure-monitor/visualize/tutorial-logs-dashboards.md). 
2. After the tile is created, under **Pin**, select the workbook in which you want the tile to appear.

## Create new workbooks

You can create a new workbook from scratch or use a workbook template as the basis for your new workbook.

1. To create a new workbook from scratch, select **Workbooks** and then **+New workbook**.
1. Select the subscription the workbook is created in and give it a descriptive name. Each workbook is an Azure resource like any other, and you can assign it roles (Azure RBAC) to define and limit who can access.
1. To enable it to show up in your workbooks to pin visualizations to, you have to share it. Click **Share** and then **Manage users**.
1. Use the **Check access** and **Role assignments** as you would for any other Azure resource. For more information, see [Share Azure workbooks by using Azure RBAC](../azure-portal/azure-portal-dashboard-share-access.md).


## New workbook examples

The following sample query enables you to compare trends of traffic across weeks. You can easily switch which device vendor and data source you run the query on. This example uses SecurityEvent from Windows, you can switch it to run on AzureActivity or CommonSecurityLog on any other firewall.

```console
// week over week query
SecurityEvent
| where TimeGenerated > ago(14d)
| summarize count() by bin(TimeGenerated, 1d)
| extend Week = iff(TimeGenerated>ago(7d), "This Week", "Last Week"), TimeGenerated = iff(TimeGenerated>ago(7d), TimeGenerated, TimeGenerated + 7d)
```

You might want to create a query that incorporates data from multiples sources. You can create a query that looks at Microsoft Entra audit logs for new users that were just created, and then checks your Azure logs to see if the user started making role assignment changes within 24 hours of creation. That suspicious activity would show up on this dashboard:

```console
AuditLogs
| where OperationName == "Add user"
| project AddedTime = TimeGenerated, user = tostring(TargetResources[0].userPrincipalName)
| join (AzureActivity
| where OperationName == "Create role assignment"
| project OperationName, RoleAssignmentTime = TimeGenerated, user = Caller) on user
| project-away user1
```

You can create different workbooks based on role of person looking at the data and what they're looking for. For example, you can create a workbook for your network admin that includes the firewall data. You can also create workbooks based on how frequently you want to look at them, whether there are things you want to review daily, and others items you want to check once an hour, for example, you might want to look at your Microsoft Entra sign-ins every hour to search for anomalies. 

## Create new detections

Generate detections on the [data sources that you connected to Microsoft Sentinel](connect-data-sources.md) to investigate threats in your organization.

When you create a new detection, leverage the detections crafted by Microsoft security researchers that are tailored to the data sources you connected.

To view the installed out-of-the-box detections, go to **Analytics** and then **Rule templates**. This tab contains all the installed Microsoft Sentinel rule templates. To find more rule templates, go to the **Content hub** in Microsoft Sentinel to install product solutions or standalone content.

   ![Use built-in detections to find threats with Microsoft Sentinel](media/tutorial-detect-built-in/view-oob-detections.png)

For more information about getting out-of-the-box detections, see [Get built-in-analytics](detect-threats-built-in.md).


## Next steps

[Detect threats out-of-the-box](detect-threats-built-in.md) and [create custom threat detection rules](detect-threats-custom.md) to automate your responses to threats.
