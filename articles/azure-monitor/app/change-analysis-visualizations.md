---
title: Visualizations for Application Change Analysis - Azure Monitor
description: Learn how to use visualizations in Application Change Analysis in Azure Monitor.
ms.topic: conceptual
author: cawams
ms.author: cawa
ms.date: 01/11/2022

---

# Visualizations for Application Change Analysis (preview)

## Standalone UI

Change Analysis lives in a standalone pane under Azure Monitor, where you can view all changes and application dependency/resource insights.

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

## Application Change Analysis in the Diagnose and solve problems tool

Application Change Analysis is:
- A standalone detector in the Web App **Diagnose and solve problems** tool. 
- Aggregated in **Application Crashes** and **Web App Down detectors**. 

From your app service's overview page in Azure portal, select **Diagnose and solve problems** the left menu. As you enter the Diagnose and Solve Problems tool, the **Microsoft.ChangeAnalysis** resource provider will automatically be registered. Enable web app in-guest change tracking with the following instructions:

1. Select **Availability and Performance**.

   :::image type="content" source="./media/change-analysis/availability-and-performance.png" alt-text="Screenshot of the Availability and Performance troubleshooting options":::
    
2. Select **Application Changes (Preview)**. The feature is also available in **Application Crashes**.

   :::image type="content" source="./media/change-analysis/application-changes.png" alt-text="Screenshot of the Application Crashes button":::

   The link leads to Application Change Analysis UI scoped to the web app. 

3. Enable web app in-guest change tracking if you haven't already.

   :::image type="content" source="./media/change-analysis/enable-changeanalysis.png" alt-text="Screenshot of the Application Crashes options":::   

4. Toggle on **Change Analysis** status and select **Save**.

   :::image type="content" source="./media/change-analysis/change-analysis-on.png" alt-text="Screenshot of the Enable Change Analysis user interface":::   
  
    - The tool displays all web apps under an App Service plan, which you can toggle on and off individually. 

      :::image type="content" source="./media/change-analysis/change-analysis-on-2.png" alt-text="Screenshot of the Enable Change Analysis user interface expanded":::   


You can also view change data via the **Web App Down** and **Application Crashes** detectors. The graph summarizes:
- The change types over time.
- Details on those changes. 

By default, the graph displays changes from within the past 24 hours help with immediate problems.

:::image type="content" source="./media/change-analysis/change-view.png" alt-text="Screenshot of the change diff view":::   

## Diagnose and Solve Problems tool
Change Analysis displays as an insight card in a virtual machine's **Diagnose and solve problems** tool. The insight card displays the number of changes or issues a resource experiences within the past 72 hours. 

Under **Common problems**, select **View change details** to view the filtered view from Change Analysis standalone UI.

:::image type="content" source="./media/change-analysis/change-insight-diagnose-and-solve.png" alt-text="Screenshot of viewing change insight in Diagnose and Solve Problems tool.":::   

## Virtual Machine Diagnose and Solve Problems

1. Within your virtual machine, select **Diagnose and solve problems** from the left menu. 
1. Go to **Troubleshooting tools**.
1. Scroll to the end of the troubleshooting options and select **Analyze recent changes** to view changes on the virtual machine.

:::image type="content" source="./media/change-analysis/vm-dnsp-troubleshootingtools.png" alt-text="Screenshot of the VM Diagnose and Solve Problems":::   

:::image type="content" source="./media/change-analysis/analyze-recent-changes.png" alt-text="Change analyzer in troubleshooting tools":::   

## Activity Log change history

Use the [View change history](../essentials/activity-log.md#view-change-history) feature to call the Application Change Analysis service backend to view changes associated with an operation. Changes returned include:
- Resource level changes from [Azure Resource Graph](../../governance/resource-graph/overview.md).
- Resource properties from [Azure Resource Manager](../../azure-resource-manager/management/overview.md).
- In-guest changes from PaaS services, such as App Services web app.

1. From within your resource, select **Activity Log** from the side menu.
1. Select a change from the list.
1. Select the **Change history (Preview)** tab. 
1. For the Application Change Analysis service to scan for changes in users' subscriptions, a resource provider needs to be registered. Upon selecting the **Change history (Preview)** tab, the tool will automatically register **Microsoft.ChangeAnalysis** resource provider.
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
1. Select the **Investigate Changes** button to view change details in the Application Change Analysis standalone UI.

    :::image type="content" source="./media/change-analysis/vm-insights-2.png" alt-text="View of the property panel, selecting Investigate Changes button.":::   

## Next steps

- Learn how to [troubleshoot problems in Change Analysis](change-analysis-troubleshoot.md)
