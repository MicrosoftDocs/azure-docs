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

Microsoft Sentinel workbooks are based on Azure Monitor workbooks, and add tables and charts with analytics for your logs and queries to the tools already available in Azure. Create your own workbooks from scratch, based on existing workbooks, or using workbook templates to customize the data you want to see.

Workbook templates help you dive deep into the data ingested from your connected data sources, such as:

- Microsoft Entra ID
- Azure activity events
- On-premises sources, such as Windows Events from servers, first party alerts, or third party alerts, such as firewall traffic logs, Office 365, or insecure protocols based on Windows events

Each workbook is an Azure resource like any other, and you can assign it roles (Azure RBAC) to define and limit who can access.

For more information, see [Azure Monitor workbooks](/azure/azure-monitor/visualize/workbooks-overview).

## Prerequisites

For role requirements to view and create workbooks, see [Roles and permissions in Microsoft Sentinel](roles.md).

## Access worbkooks

In Microsoft Sentinel, select **Threat management > Workbooks**.

- View currently saved workbooks on the **My workbooks** tab.
- View installed workbook templates on the **Templates** tab.

To find more workbook templates, go to the Microsoft Sentinel **Content hub** to install full solutions or standalone content. For more information, see [About Microsoft Sentinel content and solutions](sentinel-solutions.md).

Select a workbook to see a description of what the workbook offers.

## Create new workbooks

Create new workbooks from scratch or use workbook templates, installed from the **Content hub**, as a basis for your new workbook.

To create a workbook from scratch:

1. In Microsoft Sentinel, select **Threat management > Workbooks > Add workbook**. The workbook opens with a basic analytics query to get started.

1. Select  :::image type="icon" source="media/workbooks/save-as.png" border="false":::  **Save as** to save your workbook.

1. In the **Save as** pane on the side, enter a meaningful title for your workbook, and select your subscription, resource group, and location.

    If relevant, select to save the workbook to an Azure Storage Account, and enter the storage account details.

1. To have your workbook appear in the list of available workbooks for pinning visualizations, make sure to share your workbook. Select :::image type="icon" source="media/workbooks/share-workbook.png" border="false"::: and select whether you want to grant read-only or write access.

    For more information, see [Share Azure workbooks by using Azure RBAC](../azure-portal/azure-portal-dashboard-share-access.md).

## Customize workbooks for your needs

To customize a workbook for your own organization's needs, one that you've created from scratch or installed from a workbook template:

1. Select the workbook you want to customize and select **View saved workbook**.

1. On the workbook page, select **Edit** to open the workbook for editing.

    - Select the **TimeRange** filter to view data for a different time range than the current selection.

    - For each workbook area, either select **Edit** or select the ellipsis (**...**) to add elements, or move, clone, or remove the area.

For more information on working with queries, see [Tutorial: Visual data in Log Analytics](../azure-monitor/visualize/tutorial-logs-dashboards.md)

## Create new tiles for your workbooks

To add a custom tile to a Microsoft Sentinel workbook, first create the tile in Log Analytics. For more infomration, see [Visual data in Log Analytics](../azure-monitor/visualize/tutorial-logs-dashboards.md). 

Once the tile's created, select **Pin** and then select the workbook where you want the tile to appear.

## Workbook recommendations

This section reviews basic recommendations we have for using Microsoft Sentinel workbooks.

### Add Microsoft Entra ID workbooks

If you use Microsoft Entra ID with Microsoft Sentinel, we recommend that you install the Microsoft Entra solution for Microsoft Sentinel and use the following workbooks:

- **Microsoft Entra sign-ins** analyzes sign-ins over time to see if there are anomalies. This workbook provides failed sign-ins by applications, devices, and locations so that you can notice, at a glance if something unusual happens. Pay attention to multiple failed sign-ins. 
- **Microsoft Entra audit logs** analyzes admin activities, such as changes in users (add, remove, etc.), group creation, and modifications.  

### Add firewall workbooks

We recommend that you install the appropriate solution from the **Content hub** to add a workbook for your firewall.

For example, install the Palo Alto firewall solution for Microsoft Sentinel to add the Palo Alto workbooks. The workbooks analyze your firewall traffic, providing you with correlations between your firewall data and threat events, and highlight suspicious events across entities.

![Screenshot of the Palo Alto workbook](./media/qs-get-visibility/palo-alto-week-query.png)

### Create different workbooks for different uses

We recommend creating different visualizations for each type of persona that uses workbooks, based on the persona's role and what they're looking for. For example, create a workbook for your network admin that includes the firewall data.

Alternately, create workbooks based on how frequently you want to look at them, whether there are things you want to review daily, and others items you want to check once an hour. For example, you might want to look at your Microsoft Entra sign-ins every hour to search for anomalies.

### Sample query for comparing traffic trends across weeks

Use the following query to create a visualization that compares traffic trends across weeks. Switch the device vendor and data source you run the query on, depending on your environment.

The following sample query uses the **SecurityEvent** table from Windows. you might want to switch it to run on the **AzureActivity** or **CommonSecurityLog** table, on any other firewall.

```kusto
// week over week query
SecurityEvent
| where TimeGenerated > ago(14d)
| summarize count() by bin(TimeGenerated, 1d)
| extend Week = iff(TimeGenerated>ago(7d), "This Week", "Last Week"), TimeGenerated = iff(TimeGenerated>ago(7d), TimeGenerated, TimeGenerated + 7d)
```

### Sample query with data from multiple sources

You might want to create a query that incorporates data from multiples sources. For example, create a query that looks at Microsoft Entra audit logs for new users that were just created, and then checks your Azure logs to see if the user started making role assignment changes within 24 hours of creation. That suspicious activity would show up in a visualization with the following query:

```kusto
AuditLogs
| where OperationName == "Add user"
| project AddedTime = TimeGenerated, user = tostring(TargetResources[0].userPrincipalName)
| join (AzureActivity
| where OperationName == "Create role assignment"
| project OperationName, RoleAssignmentTime = TimeGenerated, user = Caller) on user
| project-away user1
```

<!--unclear what this section is doing here. doesn't seem to have any connection to workbooks?
## Create new detections

Generate detections on the [data sources that you connected to Microsoft Sentinel](connect-data-sources.md) to investigate threats in your organization.

When you create a new detection, leverage the detections crafted by Microsoft security researchers that are tailored to the data sources you connected.

To view the installed out-of-the-box detections, go to **Analytics** and then **Rule templates**. This tab contains all the installed Microsoft Sentinel rule templates. To find more rule templates, go to the **Content hub** in Microsoft Sentinel to install product solutions or standalone content.

   ![Use built-in detections to find threats with Microsoft Sentinel](media/tutorial-detect-built-in/view-oob-detections.png)

For more information about getting out-of-the-box detections, see [Get built-in-analytics](detect-threats-built-in.md).
-->

## Next steps

[Detect threats out-of-the-box](detect-threats-built-in.md) and [create custom threat detection rules](detect-threats-custom.md) to automate your responses to threats.
