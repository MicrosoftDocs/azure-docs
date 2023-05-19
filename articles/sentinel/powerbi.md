---
title: Create a Power BI report from Microsoft Sentinel data
description: Learn how to create a Power BI report using an exported query from Microsoft Sentinel Log Analytics. Share your report with others in the Power BI service and a Teams channel.
author: yelevin
ms.author: yelevin
ms.topic: conceptual
ms.date: 01/09/2023
---

# Create a Power BI report from Microsoft Sentinel data

[Power BI](https://powerbi.microsoft.com/) is a reporting and analytics platform that turns data into coherent, immersive, interactive visualizations. Power BI lets you easily connect to data sources, visualize and discover relationships, and share insights with whoever you want.

You can base Power BI reports on data from Microsoft Sentinel Log Analytics workspaces, and share those reports with people who don't have access to Microsoft Sentinel. For example, you might want to share information about failed sign-in attempts with app owners, without granting them Microsoft Sentinel access. Power BI visualizations can provide the data at a glance.

In this article, you:

> [!div class="checklist"]
> * Export a Log Analytics Kusto query to a Power BI M language query.
> * Use the M query in Power BI Desktop to create visualizations and a report.
> * Publish the report to the Power BI service, and share it with others.
> * Add the report to a Teams channel.

People you granted access in the Power BI service, and members of the Teams channel, can see the report without needing Microsoft Sentinel permissions.

> [!NOTE]
> This article provides a scenario-based procedure to view analysis reports in PowerBI for your Microsoft Sentinel data. For more information, see [Connect data sources](connect-data-sources.md) and [Visualize collected data](get-visibility.md).
>
## Prerequisites

To complete the steps in this article, you need:

- At least read access to a Microsoft Sentinel Log Analytics workspace that monitors sign-in attempts.
- A Power BI account that has read access to the Log Analytics workspace.
- [Power BI Desktop installed from the Microsoft Store](https://aka.ms/pbidesktopstore).

## Export a query from Log Analytics

Create, run, and export a Kusto query in your Microsoft Sentinel Log Analytics workspace. 

1. To create a simple query, in your Microsoft Sentinel Log Analytics workspace, select **Logs**. In the query editor under **New Query 1**, enter the following Kusto query:
   
   ```kusto
   SigninLogs
   |  where TimeGenerated >ago(7d)
   | summarize Attempts = count(), Failed=countif(ResultType !=0), Succeeded = countif(ResultType ==0) by AppDisplayName
   |  top 10 by Failed
   | sort by Failed
   ```
   
   Or, use your favorite Microsoft Sentinel Log Analytics Kusto query.
   
1. Select **Run** to run the query and generate results.
   
   :::image type="content" source="media/powerbi/query.png" alt-text="Screenshot showing the Log Analytics Kusto query and results.":::
   
1. To export the query to Power BI M query format, select **Export**, and then select **Export to Power BI (M query)**. Log Analytics exports the query to a text file called *PowerBIQuery.txt*.
   
   :::image type="content" source="media/powerbi/export.png" alt-text="Screenshot showing query Export to Power BI M format.":::
   
1. Copy the contents of the exported file.

## Get the data in Power BI Desktop

Run the exported M query in Power BI Desktop to get data.

1. Open Power BI Desktop, and sign in to your Power BI account that has read access to the Log Analytics workspace.
   
   :::image type="content" source="media/powerbi/sign-in.png" alt-text="Screenshot showing sign-in to Power BI Desktop.":::
   
1. In the Power BI ribbon, select **Get data** and then select **Blank query**. The **Power Query Editor** opens.
   
   :::image type="content" source="media/powerbi/blank-query.png" alt-text="Screenshot showing Blank query selected under Get data in Power BI Desktop.":::
   
1. In the **Power Query Editor**, select **Advanced Editor**.
   
1. Paste the copied contents of the exported *PowerBIQuery.txt* file into the **Advanced Editor** window, and then select **Done**.
   
   :::image type="content" source="media/powerbi/advanced-editor.png" alt-text="Screenshot showing the M query pasted in to the Power BI Advanced Editor.":::
   
1. In the **Power Query Editor**, rename the query to *App_signin_stats*, and then select **Close & Apply**.
   
   :::image type="content" source="media/powerbi/close-apply.png" alt-text="Screenshot showing the renamed query and Close & Apply command in the Power Query Editor.":::

## Create visualizations from the data

Now that your data is in Power BI, you can create visualizations to provide insights into the data.

### Create a table visual

First, create a table that shows all the results of the query.

1. To add a table visualization to the Power BI Desktop canvas, select the **table** icon under **Visualizations**.
   
   :::image type="content" source="media/powerbi/table.png" alt-text="Screenshot showing the table icon under Visualizations in Power BI Desktop.":::
   
1. Under **Fields**, select all the fields in your query, so they all appear in the table. If the table doesn't show all the data, enlarge the table by dragging its selection handles.
   
   :::image type="content" source="media/powerbi/select-fields.png" alt-text="Screenshot showing all fields selected for the table visualization.":::
   
### Create a pie chart

Next, create a pie chart that shows which applications had the most failed sign-in attempts.

1. Deselect the table visual by clicking or tapping outside of it, and then under **Visualizations**, select the **pie chart** icon.
   
   :::image type="content" source="media/powerbi/pie-chart.png" alt-text="Screenshot showing the pie chart icon under Visualizations in Power BI Desktop.":::
   
1. Select **AppDisplayName** in the **Legend** well, or drag it from the **Fields** pane. Select **Failed** in the **Values** well, or drag it from **Fields**. The pie chart now shows the number of failed sign-in attempts per application.
   
   :::image type="content" source="media/powerbi/failed.png" alt-text="Screenshot showing the pie chart with number of failed sign-in attempts per application.":::
   
### Create a new quick measure

You also want to show what percentage of sign-in attempts failed for each application. Since your query doesn't have a percentage column, you can create a new measure to show this information.

1. Under **Visualizations**, select the **stacked column chart** icon to create a stacked column chart.
   
   :::image type="content" source="media/powerbi/column-chart.png" alt-text="Screenshot showing the stacked column chart icon under Visualizations in Power BI Desktop.":::
   
1. With the new visualization selected, select **Quick measure** in the ribbon.
   
1. In the **Quick measures** window, under **Calculation**, select **Division**. Drag **Failed** from **Fields** into the **Numerator** field, and drag **Attempts** from **Fields** to **Denominator**.
   
   :::image type="content" source="media/powerbi/quick-measures.png" alt-text="Screenshot showing the settings in the Quick measures window.":::
   
1. Select **OK**. The new measure appears in the **Fields** pane.
   
1. Select the new measure in the **Fields** pane, and under **Formatting** in the ribbon, select **Percentage**.
   
   :::image type="content" source="media/powerbi/percentage.png" alt-text="Screenshot showing the new measure selected in the Fields pane, and Percentage selected under Formatting in the ribbon.":::
   
1. With the column chart visualization selected on the canvas, select or drag the **AppDisplayName** field into the **Axis** well, and the new **Failed divided by Attempts** measure into the **Values** well. The chart now shows the percentage of failed sign-in attempts for each application.
   
   :::image type="content" source="media/powerbi/failed-percentage.png" alt-text="Screenshot showing the column chart with percentage of failed attempts for each application.":::
   
### Refresh the data and save the report

1. Select **Refresh** to get the latest data from Microsoft Sentinel.
   
   :::image type="content" source="media/powerbi/refresh.png" alt-text="Screenshot showing the Refresh button in the ribbon.":::
   
1. Select **File** > **Save** and save your Power BI report.

## Create a Power BI online workspace

To create a Power BI workspace for sharing the report:

1. Sign in to [powerbi.com](https://powerbi.com) with the same account you used for Power BI Desktop and Microsoft Sentinel read access.
   
1. Under **Workspaces**, select **Create a workspace**. Name the workspace *Management Reports*, and select **Save**.
   
   :::image type="content" source="media/powerbi/create-workspace.png" alt-text="Screenshot showing Create a workspace in the Power BI service.":::
   
1. To grant people and groups access to the workspace, select the **More options** dots next to the new workspace name, and then select **Workspace access**.
   
   :::image type="content" source="media/powerbi/workspace-access.png" alt-text="Screenshot showing Workspace access in the workspace More options menu.":::
   
1. In the **Workspace access** side pane, you can add users' email addresses and assign each user a role. The roles are Admin, Member, Contributor, and Viewer.

## Publish the Power BI report

Now you can use Power BI Desktop to publish your Power BI report so other people can see it.

1. In your new report in Power BI Desktop, select **Publish**.
   
   :::image type="content" source="media/powerbi/publish.png" alt-text="Screenshot showing Publish in the Power BI Desktop ribbon.":::
   
1. Select the **Management Reports** workspace to publish to, and select **Select**.
   
   :::image type="content" source="media/powerbi/select-workspace.png" alt-text="Screenshot that shows selecting the Power BI Management Reports workspace to publish to.":::
   
## Import the report to a Microsoft Teams channel

You also want members of the Management Teams channel to be able to see the report. To add the report to a Teams channel:

1. In the Management Teams channel, select **+** to add a tab, and in the **Add a tab** window, search for and select **Power BI**.

   :::image type="content" source="media/powerbi/add-tab.png" alt-text="Screenshot that shows selecting Power BI in the Add a tab window in Teams.":::
   
1. Select your new report from the list of Power BI reports, and select **Save**. The report appears in a new tab in the Teams channel.
   
   :::image type="content" source="media/powerbi/teams.png" alt-text="Screenshot showing the Power BI report in a tab in the Teams channel.":::

## Schedule report refresh

Refresh your Power BI report on a schedule, so updated data always appears in the report.

1. In the Power BI service, select the workspace you published your report to.
   
1. Next to the report's dataset, select **More options** > **Settings**.
   
   :::image type="content" source="media/powerbi/settings.png" alt-text="Screenshot showing Settings under More options in the Power BI report dataset.":::
   
1. Select **Edit credentials** to provide the credentials for an account that has read access to the Log Analytics workspace.
   
1. Under **Scheduled refresh**, set the slider to **On**, and set up a refresh schedule for the report.
   
   :::image type="content" source="media/powerbi/schedule.png" alt-text="Screenshot showing Scheduled refresh settings for the Power BI report dataset.":::

## Next steps

For more information, see:

- [Azure Monitor service limits](../azure-monitor/service-limits.md)
- [Import Azure Monitor log data into Power BI](../azure-monitor/logs/log-powerbi.md)
- [Power Query M formula language](/powerquery-m/)