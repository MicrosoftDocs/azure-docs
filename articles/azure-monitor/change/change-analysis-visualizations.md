---
title: Visualizations for Change Analysis in Azure Monitor
description: Learn how to use visualizations in Azure Monitor's Change Analysis.
ms.topic: conceptual
ms.author: hannahhunter
author: hhunter-ms
ms.contributor: cawa
ms.date: 07/28/2022
ms.subservice: change-analysis
ms.custom: devx-track-azurepowershell
ms.reviewer: cawa
---

# Visualizations for Change Analysis in Azure Monitor

Change Analysis provides data for various management and troubleshooting scenarios to help you understand what changes to your application might have caused the issues. You can view the Change Analysis data through several channels: 

## The Change Analysis standalone UI

You can access Change Analysis in a standalone pane under Azure Monitor, where you can view all changes and application dependency/resource insights. You can access Change Analysis through a couple of entry points:

In the Azure portal, search for Change Analysis to launch the experience.

:::image type="content" source="./media/change-analysis/search-change-analysis.png" alt-text="Screenshot of searching Change Analysis in Azure portal":::
  
Select one or more subscriptions to view:
- All of its resources' changes from the past 24 hours. 
- Old and new values to provide insights at one glance.
  
:::image type="content" source="./media/change-analysis/change-analysis-standalone-blade.png" alt-text="Screenshot of Change Analysis blade in Azure portal":::
  
Click into a change to view full Resource Manager snippet and other properties.
  
:::image type="content" source="./media/change-analysis/change-details.png" alt-text="Screenshot of change details":::
  
Send any feedback to the [Change Analysis team](mailto:changeanalysisteam@microsoft.com) from the Change Analysis blade:

:::image type="content" source="./media/change-analysis/change-analysis-feedback.png" alt-text="Screenshot of feedback button in Change Analysis tab":::

### Multiple subscription support

The UI supports selecting multiple subscriptions to view resource changes. Use the subscription filter:

:::image type="content" source="./media/change-analysis/multiple-subscriptions-support.png" alt-text="Screenshot of subscription filter that supports selecting multiple subscriptions":::

## Diagnose and solve problems tool

From your resource's overview page in Azure portal, you can view change data by selecting **Diagnose and solve problems** the left menu. As you enter the Diagnose and Solve Problems tool, the **Microsoft.ChangeAnalysis** resource provider will automatically be registered. 

### Diagnose and solve problems tool for Web App

Azure Monitor's Change Analysis is:
- A standalone detector in the Web App **Diagnose and solve problems** tool. 
- Aggregated in **Application Crashes** and **Web App Down detectors**. 

You can view change data via the **Web App Down** and **Application Crashes** detectors. The graph summarizes:
- The change types over time.
- Details on those changes. 

By default, the graph displays changes from within the past 24 hours help with immediate problems.   

### Diagnose and solve problems tool for Virtual Machines

Change Analysis displays as an insight card in your virtual machine's **Diagnose and solve problems** tool. The insight card displays the number of changes or issues a resource experiences within the past 72 hours. 

1. Within your virtual machine, select **Diagnose and solve problems** from the left menu. 
1. Go to **Troubleshooting tools**.
1. Scroll to the end of the troubleshooting options and select **Analyze recent changes** to view changes on the virtual machine.

   :::image type="content" source="./media/change-analysis/vm-dnsp-troubleshootingtools.png" alt-text="Screenshot of the VM Diagnose and Solve Problems":::   

   :::image type="content" source="./media/change-analysis/analyze-recent-changes.png" alt-text="Change analyzer in troubleshooting tools":::   

### Diagnose and solve problems tool for Azure SQL Database and other resources

You can view Change Analysis data for [multiple Azure resources](./change-analysis.md#supported-resource-types), but we highlight Azure SQL Database below.

1. Within your resource, select **Diagnose and solve problems** from the left menu.
1. Under **Common problems**, select **View change details** to view the filtered view from Change Analysis standalone UI.

   :::image type="content" source="./media/change-analysis/change-insight-diagnose-and-solve.png" alt-text="Screenshot of viewing common problems in Diagnose and Solve Problems tool.":::  

## Activity Log change history

Use the [View change history](../essentials/activity-log.md#view-change-history) feature to call the Azure Monitor Change Analysis service backend to view changes associated with an operation. Changes returned include:

- Resource level changes from [Azure Resource Graph](../../governance/resource-graph/overview.md).
- Resource properties from [Azure Resource Manager](../../azure-resource-manager/management/overview.md).
- In-guest changes from PaaS services, such as App Services web app.

1. From within your resource, select **Activity Log** from the side menu.
1. Select a change from the list.
1. Select the **Change history** tab. 
1. For the Azure Monitor Change Analysis service to scan for changes in users' subscriptions, a resource provider needs to be registered. Upon selecting the **Change history** tab, the tool will automatically register **Microsoft.ChangeAnalysis** resource provider.
1. Once registered, you can view changes from **Azure Resource Graph** immediately from the past 14 days.
   - Changes from other sources will be available after ~4 hours after subscription is onboard.

   :::image type="content" source="./media/change-analysis/activity-log-change-history.png" alt-text="Activity Log change history integration":::   

## VM Insights integration

If you've enabled [VM Insights](../vm/vminsights-overview.md), you can view changes in your virtual machines that may have caused any spikes in a metric chart, such as CPU or Memory.

1. Within your virtual machine, select **Insights** from under **Monitoring** in the left menu.
1. Select the **Performance** tab.
1. Expand the property panel.

    :::image type="content" source="./media/change-analysis/vm-insights.png" alt-text="Virtual machine insights performance and property panel.":::   

1. Select the **Changes** tab.
1. Select the **Investigate Changes** button to view change details in the Azure Monitor Change Analysis standalone UI.

    :::image type="content" source="./media/change-analysis/vm-insights-2.png" alt-text="View of the property panel, selecting Investigate Changes button.":::   

## Drill to Change Analysis logs

You can also drill to Change Analysis logs via a chart you've created or pinned to your resource's **Monitoring** dashboard.

1. Navigate to the resource for which you'd like to view Change Analysis logs.
1. On the resource's overview page, select the **Monitoring** tab.
1. Select a chart from the **Key Metrics** dashboard.

   :::image type="content" source="./media/change-analysis/view-change-analysis-1.png" alt-text="Chart from the Monitoring tab of the resource.":::

1. From the chart, select **Drill into logs** and choose **Change Analysis** to view it.

   :::image type="content" source="./media/change-analysis/view-change-analysis-2.png" alt-text="Drill into logs and select to view Change Analysis.":::

## Next steps

- Learn how to [troubleshoot problems in Change Analysis](change-analysis-troubleshoot.md)