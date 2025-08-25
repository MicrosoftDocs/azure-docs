---
title: Visualize your data using workbooks in Microsoft Sentinel | Microsoft Docs
description: Learn how to visualize your data using workbooks in Microsoft Sentinel.
author: batamig
ms.topic: how-to
ms.date: 08/20/2025
ms.author: bagol
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal
ms.collection: usx-security


#Customer intent: As a security analyst, I want to create and customize workbooks in Microsoft Sentinel so that I can visualize and monitor security data effectively.

---

# Visualize and monitor your data by using workbooks in Microsoft Sentinel

After you connect your data sources to Microsoft Sentinel, visualize and monitor the data using workbooks in Microsoft Sentinel. Microsoft Sentinel workbooks are based on Azure Monitor workbooks, and add tables and charts with analytics for your logs and queries to the tools already available in Azure.

Microsoft Sentinel allows you to create custom workbooks across your data or use existing workbook templates available with packaged solutions or as standalone content from the content hub. Each workbook is an Azure resource like any other, and you can assign it with Azure role-based access control (RBAC) to define and limit who can access.

This article describes how to visualize your data in Microsoft Sentinel by using workbooks. Editing workbooks directly in the Defender portal is as Preview.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Prerequisites

- You must have at least **Workbook reader** or **Workbook contributor** permissions on the resource group of the Microsoft Sentinel workspace.

   The workbooks that you see in Microsoft Sentinel are saved within the Microsoft Sentinel workspace's resource group and are tagged by the workspace in which they were created.

- To use a workbook template, install the solution that contains the workbook or install the workbook as a standalone item from the **Content Hub**. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).

- If you're working in the Defender portal with an Azure Data Explorer data source, make sure to configure and authenticate to Azure Data Explorer from the Defender portal.

## Create a workbook from a template

Use a template installed from the content hub to create a workbook.

1. In Microsoft Sentinel, select **Threat management > Workbooks**.

1. On the **Workbooks** page, select the **Templates** tab to see the list of workbook templates installed. Select a template to view its details.

    Some workbooks require specific data connections to function. Before saving a workbook, check for a **Required data types** field ensure that you have that type of data ingested.

    For example:

    #### [Defender portal](#tab/defender-portal)
    :::image type="content" source="media/monitor-your-data/workbook-template-defender-portal.png" alt-text="Screenshot of a workbook template in the Defender portal that shows the required data types." lightbox="media/monitor-your-data/workbook-template-defender-portal.png":::

    #### [Azure portal](#tab/azure-portal)
    :::image type="content" source="media/monitor-your-data/workbook-template-azure-portal.png" alt-text="Screenshot of a workbook template with required data types shown in the details pane." lightbox="media/monitor-your-data/workbook-template-azure-portal.png":::

    ---

1. From the details pane, select **Save**, and then select the location where you want to save the workbook. This action creates an Azure resource in the selected location based on the relevant template. Only the workbook's JSON file is saved in this location, and no data.

1. From the details pane, select **View saved workbook** to open it for editing.

1. With the workbook open, select **Edit** to customize the workbook according to your needs.

    ### [Defender portal](#tab/defender-portal)

    :::image type="content" source="media/monitor-your-data/workbook-graph-defender.png" alt-text="Screenshot that shows the saved workbook." lightbox="media/monitor-your-data/workbook-graph.png":::

    When working in the Defender portal, some visualizations can only be viewed in the Azure portal. In such cases, select **Open in Azure** to open the workbook in the Azure portal.

    ### [Azure portal](#tab/azure-portal)

    :::image type="content" source="media/monitor-your-data/workbook-graph.png" alt-text="Screenshot that shows the saved workbook." lightbox="media/monitor-your-data/workbook-graph.png":::

    ---

    For example, select the **TimeRange** filter to view data for a different time range than the current selection. To edit a specific workbook area, either select **Edit** or select the ellipsis (**...**) to add elements, or move, clone, or remove the area.

    To clone your workbook, select **Save as**. Save the clone with another name, under the same subscription and resource group. Cloned workbooks are also displayed under the **My workbooks** tab in the **Microsoft Sentinel > Threat management > Workbooks** page.

1. When you're done, select **Done Editing** to save your changes.

For more information, see:

- [Create interactive reports with Azure Monitor Workbooks](/azure/azure-monitor/visualize/workbooks-overview)
- [Tutorial: Visual data in Log Analytics](/azure/azure-monitor/visualize/tutorial-logs-dashboards)

## Create new workbook

Create a workbook from scratch in Microsoft Sentinel.

1. In Microsoft Sentinel, select **Threat management > Workbooks**, and then select **Add workbook**.

1. To edit the workbook, select **Edit**, and then add text, queries, and parameters as necessary.

    For more information on how to customize the workbook, see how to [Create interactive reports with Azure Monitor Workbooks](/azure/azure-monitor/visualize/workbooks-overview). 

    :::image type="content" source="media/monitor-your-data/create-workbook.png" alt-text="Screenshot that shows a new workbook." lightbox="media/monitor-your-data/create-workbook.png":::

1. When building a query, set the **Data source** to **Logs** and **Resource type** to **Log Analytics**, and then choose one or more workspaces.

   We recommend that your query uses an [Advanced Security Information Model (ASIM) parser](normalization-about-parsers.md) and not a built-in table. The query will then support any current or future relevant data source rather than a single data source.
 
1. When you're done with your edits, select **Done editing** and then **Save**. In the side pane, enter a meaningful name for your workbook, and select the subscription and resource group for your workspace.

1. When working in the Azure portal, switch between workbooks in your workspace by selecting **Open** ![Icon for opening a workbook.](./media/monitor-your-data/switch.png) in the toolbar of any workbook. The screen switches to a list of other workbooks you can switch to.

    Select the workbook you want to open:

    :::image type="content" source="media/monitor-your-data/switch-workbooks.png" alt-text="Screenshot that shows how to switch workbooks." lightbox="media/monitor-your-data/switch-workbooks.png":::

## Create new tiles for your workbooks

To add a custom tile to a Microsoft Sentinel workbook, first create the tile in Log Analytics. For more information, see [Visual data in Log Analytics](/azure/azure-monitor/visualize/tutorial-logs-dashboards). 

Once you create a tile, select **Pin** and then select the workbook where you want the tile to appear.

## Refresh your workbook data

Refresh your workbook to display updated data. In the toolbar, select one of the following options:

- :::image type="icon" source="media/monitor-your-data/manual-refresh-button.png" border="false"::: **Refresh**, to manually refresh your workbook data.

- :::image type="icon" source="media/monitor-your-data/auto-refresh-workbook.png" border="false"::: **Auto refresh**, to set your workbook to automatically refresh at a configured interval.

    - Supported auto refresh intervals range from **5 minutes** to **1 day**.

    - Auto refresh is paused while you're editing a workbook, and intervals are restarted each time you switch back to view mode from edit mode.

    - Auto refresh intervals are also restarted if you manually refresh your data.

    By default, auto refresh is turned off. If you've turned auto-refresh on, it's turned off again each time you close the notebook to optimize perforamnce and prevent it from running in the background. Turn auto refresh back on as needed the next time you open the workbook.

## Print a workbook or save as PDF (Azure portal only)

To print a workbook, or save it as a PDF, use the options menu to the right of the workbook title. These options are available only in the Azure portal. If you're working in the Defender portal, select **Open in Azure** to open the workbook in the Azure portal.

1. Select options > :::image type="icon" source="media/monitor-your-data/print-icon.png" border="false"::: **Print content**.

1. In the print screen, adjust your print settings as needed or select **Save as PDF** to save it locally.

   For example:

   :::image type="content" source="media/monitor-your-data/print-workbook.png" alt-text="Screenshot that shows how to print your workbook or save as PDF." :::

## Delete one or more workbooks

You can delete both saved templates and customized workbooks from the **My workbooks** tab. Templates themselves can't be deleted.

To delete a workbook, select the workbook in the **My workbooks** tab, and then select **Delete**. This action removes the workbook resource and any changes you made to the template. The original template remains available.

## Workbook recommendations

This section reviews basic recommendations we have for using workbooks with Microsoft Sentinel.

### Add Microsoft Entra ID workbooks

If you use Microsoft Entra ID with Microsoft Sentinel, we recommend that you install the Microsoft Entra solution for Microsoft Sentinel and use the following workbooks:

- **Microsoft Entra sign-ins** analyzes sign-ins over time to see if there are anomalies. This workbook provides failed sign-ins by applications, devices, and locations so that you can notice, at a glance if something unusual happens. Pay attention to multiple failed sign-ins. 
- **Microsoft Entra audit logs** analyzes admin activities, such as changes in users (add, remove, etc.), group creation, and modifications.  

### Add firewall workbooks

We recommend that you install the appropriate solution from the **Content hub** to add a workbook for your firewall.

For example, install the Palo Alto firewall solution for Microsoft Sentinel to add the Palo Alto workbooks. The workbooks analyze your firewall traffic, providing you with correlations between your firewall data and threat events, and highlight suspicious events across entities.

:::image type="content" source="media/qs-get-visibility/palo-alto-week-query.png" alt-text="Screenshot of the Palo Alto workbook.":::

### Create different workbooks for different uses

We recommend creating different visualizations for each type of persona that uses workbooks, based on the persona's role and what they're looking for. For example, create a workbook for your network admin that includes the firewall data.

Alternately, create workbooks based on how frequently you want to look at them, whether there are things you want to review daily, and others items you want to check once an hour. For example, you might want to look at your Microsoft Entra sign-ins every hour to search for anomalies.

### Sample query for comparing traffic trends across weeks

Use the following query to create a visualization that compares traffic trends across weeks. Switch the device vendor and data source you run the query on, depending on your environment.

The following sample query uses the **SecurityEvent** table from Windows. You might want to switch it to run on the **AzureActivity** or **CommonSecurityLog** table, on any other firewall.

```kusto
// week over week query
SecurityEvent
| where TimeGenerated > ago(14d)
| summarize count() by bin(TimeGenerated, 1d)
| extend Week = iff(TimeGenerated>ago(7d), "This Week", "Last Week"), TimeGenerated = iff(TimeGenerated>ago(7d), TimeGenerated, TimeGenerated + 7d)
```

### Sample query with data from multiple sources

You might want to create a query that incorporates data from multiples sources. For example, create a query that looks at Microsoft Entra audit logs for new users that were created, and then checks your Azure logs to see if the user started making role assignment changes within 24 hours of creation. That suspicious activity would show up in a visualization with the following query:

```kusto
AuditLogs
| where OperationName == "Add user"
| project AddedTime = TimeGenerated, user = tostring(TargetResources[0].userPrincipalName)
| join (AzureActivity
| where OperationName == "Create role assignment"
| project OperationName, RoleAssignmentTime = TimeGenerated, user = Caller) on user
| project-away user1
```

See more information on the following items used in the preceding examples, in the Kusto documentation:
- [***where*** operator](/kusto/query/where-operator?view=microsoft-sentinel&preserve-view=true)
- [***extend*** operator](/kusto/query/extend-operator?view=microsoft-sentinel&preserve-view=true)
- [***project*** operator](/kusto/query/project-operator?view=microsoft-sentinel&preserve-view=true)
- [***project-away*** operator](/kusto/query/project-away-operator?view=microsoft-sentinel&preserve-view=true)
- [***join*** operator](/kusto/query/join-operator?view=microsoft-sentinel&preserve-view=true)
- [***summarize*** operator](/kusto/query/summarize-operator?view=microsoft-sentinel&preserve-view=true)
- [***ago()*** function](/kusto/query/ago-function?view=microsoft-sentinel&preserve-view=true)
- [***bin()*** function](/kusto/query/bin-function?view=microsoft-sentinel&preserve-view=true)
- [***iff()*** function](/kusto/query/iff-function?view=microsoft-sentinel&preserve-view=true)
- [***tostring()*** function](/kusto/query/tostring-function?view=microsoft-sentinel&preserve-view=true)
- [***count()*** aggregation function](/kusto/query/count-aggregation-function?view=microsoft-sentinel&preserve-view=true)

[!INCLUDE [kusto-reference-general-no-alert](includes/kusto-reference-general-no-alert.md)]

## Known issues for editing workbooks in the Defender portal (Preview)

Editing workbooks directly in the Defender portal is currently in Preview, and currently includes the following known issues:

- The advanced editor might show up in light mode, even if your portal is set to dark mode.
- Custom endpoint data isn't supported for editing workbooks in the Defender portal.
- Workbooks within workbooks aren't supported for editing in the Defender portal.
- Read-only sharing isn't supported for workbooks in the Defender portal.
- Mermaid diagrams aren't supported for editing workbooks in the Defender portal.

## Related articles

For more information, see:

- [Commonly used Microsoft Sentinel workbooks](top-workbooks.md)

- [Azure Monitor workbooks](/azure/azure-monitor/visualize/workbooks-overview)
