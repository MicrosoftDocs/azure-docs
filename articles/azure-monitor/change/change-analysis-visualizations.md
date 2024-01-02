---
title: View and use Change Analysis in Azure Monitor
description: Learn the various scenarios in which you can use Azure Monitor's Change Analysis.
ms.topic: conceptual
ms.author: hannahhunter
author: hhunter-ms
ms.date: 11/17/2023
ms.subservice: change-analysis
ms.custom: ignite-2022
---

# View and use Change Analysis in Azure Monitor

Change Analysis provides data for various management and troubleshooting scenarios to help you understand what changes to your application caused breaking issues. 

## View Change Analysis data

### Access Change Analysis screens

You can access the Change Analysis overview portal under Azure Monitor, where you can view all changes and application dependency/resource insights. You can access Change Analysis through two entry points:

#### Via the Azure Monitor home page

From the Azure portal home page, select **Monitor** from the menu.

:::image type="content" source="./media/change-analysis/monitor-menu-2.png" alt-text="Screenshot of finding the Monitor home page from the main portal menu.":::

In the Monitor overview page, select the **Change Analysis** card.

:::image type="content" source="./media/change-analysis/change-analysis-monitor-overview.png" alt-text="Screenshot of selecting the Change Analysis card on the Monitor overview page.":::

#### Via search

In the Azure portal, search for Change Analysis to launch the experience.

:::image type="content" source="./media/change-analysis/search-change-analysis.png" alt-text="Screenshot of searching Change Analysis in Azure portal":::
  
Select one or more subscriptions to view:
- All of its resources' changes from the past 24 hours. 
- Old and new values to provide insights at one glance.
  
:::image type="content" source="./media/change-analysis/change-analysis-standalone-blade.png" alt-text="Screenshot of Change Analysis pane in Azure portal":::
  
Click into a change to view full Resource Manager snippet and other properties.
  
:::image type="content" source="./media/change-analysis/change-details.png" alt-text="Screenshot of change details":::
  
Send feedback from the Change Analysis pane:

:::image type="content" source="./media/change-analysis/change-analysis-feedback.png" alt-text="Screenshot of feedback button in Change Analysis tab":::

### Multiple subscription support

The UI supports selecting multiple subscriptions to view resource changes. Use the subscription filter:

:::image type="content" source="./media/change-analysis/multiple-subscriptions-support.png" alt-text="Screenshot of subscription filter that supports selecting multiple subscriptions":::

### View the Activity Log change history

Use the [View change history](../essentials/activity-log.md#view-change-history) feature to call the Azure Monitor Change Analysis service backend to view changes associated with an operation. Changes returned include:

- Resource level changes from [Azure Resource Graph](../../governance/resource-graph/overview.md).
- Resource properties from [Azure Resource Manager](../../azure-resource-manager/management/overview.md).
- In-guest changes from PaaS services, such as a web app.

1. From within your resource, select **Activity Log** from the side menu.
1. Select a change from the list.
1. Select the **Change history** tab. 
1. For the Azure Monitor Change Analysis service to scan for changes in users' subscriptions, a resource provider needs to be registered. When you select the **Change history** tab, the tool automatically registers **Microsoft.ChangeAnalysis** resource provider.
1. Once registered, you can view changes from **Azure Resource Graph** immediately from the past 14 days.
   - Changes from other sources will be available after ~4 hours after subscription is onboard.

   :::image type="content" source="./media/change-analysis/activity-log-change-history.png" alt-text="Screenshot showing Activity Log change history integration.":::   

### View changes using the Diagnose and Solve Problems tool

From your resource's overview page in Azure portal, you can view change data by selecting **Diagnose and solve problems** the left menu. As you enter the Diagnose and Solve Problems tool, the **Microsoft.ChangeAnalysis** resource provider is automatically registered. 

Learn how to use the Diagnose and Solve Problems tool for:
- [Web App](#diagnose-and-solve-problems-tool-for-web-app)
- [Virtual Machines](#diagnose-and-solve-problems-tool-for-virtual-machines)
- [Azure SQL Database and other resources](#diagnose-and-solve-problems-tool-for-azure-sql-database-and-other-resources)

#### Diagnose and solve problems tool for Web App

Azure Monitor's Change Analysis is:
- A standalone detector in the Web App **Diagnose and solve problems** tool. 
- Aggregated in **Application Crashes** and **Web App Down detectors**. 

You can view change data via the **Web App Down** and **Application Crashes** detectors. The graph summarizes:
- The change types over time.
- Details on those changes. 

By default, the graph displays changes from within the past 24 hours help with immediate problems.   

#### Diagnose and solve problems tool for Virtual Machines

Change Analysis displays as an insight card in your virtual machine's **Diagnose and solve problems** tool. The insight card displays the number of changes or issues a resource experiences within the past 72 hours. 

1. Within your virtual machine, select **Diagnose and solve problems** from the left menu. 
1. Go to **Troubleshooting tools**.
1. Scroll to the end of the troubleshooting options and select **Analyze recent changes** to view changes on the virtual machine.

   :::image type="content" source="./media/change-analysis/vm-dnsp-troubleshootingtools.png" alt-text="Screenshot of the VM Diagnose and Solve Problems":::   

   :::image type="content" source="./media/change-analysis/analyze-recent-changes.png" alt-text="Change analyzer in troubleshooting tools":::   

#### Diagnose and solve problems tool for Azure SQL Database and other resources

You can view Change Analysis data for [multiple Azure resources](./change-analysis.md#supported-resource-types), but we highlight Azure SQL Database in these steps.

1. Within your resource, select **Diagnose and solve problems** from the left menu.
1. Under **Common problems**, select **View change details** to view the filtered view from Change Analysis standalone UI.

   :::image type="content" source="./media/change-analysis/change-insight-diagnose-and-solve.png" alt-text="Screenshot of viewing common problems in Diagnose and Solve Problems tool.":::  

## Activities using Change Analysis

### Integrate with VM Insights

If you enabled [VM Insights](../vm/vminsights-overview.md), you can view changes in your virtual machines that caused any spikes in a metric chart, such as CPU or Memory.

1. Within your virtual machine, select **Insights** from under **Monitoring** in the left menu.
1. Select the **Performance** tab.
1. Expand the property panel.

    :::image type="content" source="./media/change-analysis/vm-insights.png" alt-text="Virtual machine insights performance and property panel.":::   

1. Select the **Changes** tab.
1. Select the **Investigate Changes** button to view change details in the Azure Monitor Change Analysis standalone UI.

    :::image type="content" source="./media/change-analysis/vm-insights-2.png" alt-text="View of the property panel, selecting Investigate Changes button.":::   

### Drill to Change Analysis logs

You can also drill to Change Analysis logs via a chart you've created or pinned to your resource's **Monitoring** dashboard.

1. Navigate to the resource for which you'd like to view Change Analysis logs.
1. On the resource's overview page, select the **Monitoring** tab.
1. Select a chart from the **Key Metrics** dashboard.

   :::image type="content" source="./media/change-analysis/view-change-analysis-1.png" alt-text="Chart from the Monitoring tab of the resource.":::

1. From the chart, select **Drill into logs** and choose **Change Analysis** to view it.

   :::image type="content" source="./media/change-analysis/view-change-analysis-2.png" alt-text="Drill into logs and select to view Change Analysis.":::

### Browse using custom filters and search bar

Browsing through a long list of changes in the entire subscription is time consuming. With Change Analysis custom filters and search capability, you can efficiently navigate to changes relevant to issues for troubleshooting.

:::image type="content" source="./media/change-analysis/filters-search-bar.png" alt-text="Screenshot showing that filters and search bar are available at the top of Change Analysis homepage, right above the changes section.":::

#### Filters

| Filter | Description |
| ------ | ----------- |
| Subscription | This filter is in-sync with the Azure portal subscription selector. It supports multiple-subscription selection. |
| Time range | Specifies how far back the UI display changes, up to 14 days. By default, it’s set to the past 24 hours. |
| Resource group | Select the resource group to scope the changes. By default, all resource groups are selected. |
| Change level | Controls which levels of changes to display. Levels include: important, normal, and noisy. </br> **Important:** related to availability and security </br> **Noisy:** Read-only properties that are unlikely to cause any issues </br> By default, important and normal levels are checked. |
| Resource | Select **Add filter** to use this filter. </br> Filter the changes to specific resources. Helpful if you already know which resources to look at for changes. [If the filter is only returning 1,000 resources, see the corresponding solution in troubleshooting guide](./change-analysis-troubleshoot.md#cant-filter-to-your-resource-to-view-changes). |
| Resource type | Select **Add filter** to use this filter. </br> Filter the changes to specific resource types. |

#### Search bar

The search bar filters the changes according to the input keywords. Search bar results apply only to the changes loaded by the page already and don't pull in results from the server side.

### Pin and share a Change Analysis query to the Azure dashboard

Let's say you want to curate a change view on specific resources, like all Virtual Machine changes in your subscription, and include it in a report sent periodically. You can pin the view to an Azure dashboard for monitoring or sharing scenarios. If you'd like to share a specific change with your team members, you can use the share feature in the Change Details page.

### Pin to the Azure dashboard

Once you applied filters to the Change Analysis homepage:

1. Select **Pin current filters** from the top menu. 
1. Enter a name for the pin. 
1. Click **OK** to proceed.

   :::image type="content" source="./media/change-analysis/click-pin-menu.png" alt-text="Screenshot of selecting Pin current filters button in Change Analysis.":::

A side pane opens to configure the dashboard where you place your pin. You can select one of two dashboard types:

| Dashboard type | Description |
| -------------- | ----------- |
| Private | Only you can access a private dashboard. Choose this option if you're creating the pin for your own easy access to the changes. |
| Shared | A shared dashboard supports role-based access control for view/read access. Shared dashboards are created as a resource in your subscription with a region and resource group to host it. Choose this option if you're creating the pin to share with your team. |

#### Select an existing dashboard

If you already have a dashboard to place the pin:

1. Select the **Existing** tab.
1. Select either **Private** or **Shared**.
1. Select the dashboard you'd like to use. 
1. If you selected **Shared**, select the subscription in which you'd like to place the dashboard.
1. Select **Pin**.
 
   :::image type="content" source="./media/change-analysis/existing-dashboard-small.png" alt-text="Screenshot of selecting an existing dashboard to pin your changes to. ":::

#### Create a new dashboard

You can create a new dashboard for this pin.
 
1. Select the **Create new** tab. 
1. Select either **Private** or **Shared**. 
1. Enter the name of the new dashboard.
1. If you're creating a shared dashboard, enter the resource group and region information. 
1. Click **Create and pin**. 

   :::image type="content" source="./media/change-analysis/create-pin-dashboard-small.png" alt-text="Screenshot of creating a new dashboard to pin your changes to.":::

Once the dashboard and pin are created, navigate to the Azure dashboard to view them.

1. From the Azure portal home menu, select **Dashboard**. 
1. Use the **Manage Sharing** button in the top menu to handle access or "unshare". 
1. Click on the pin to navigate to the curated view of changes.

   :::image type="content" source="./media/change-analysis/azure-dashboard.png" alt-text="Screenshot of selecting the Dashboard in the Azure portal home menu.":::

   :::image type="content" source="./media/change-analysis/view-share-dashboard.png" alt-text="Screenshot of the pin in the dashboard.":::

### Share a single change with your team

In the Change Analysis homepage, select a line of change to view details on the change.

1. On the Changed properties page, select **Share** from the top menu. 
1. On the Share Change Details pane, copy the deep link of the page and share with your team in messages, emails, reports, or whichever communication channel your team prefers.

   :::image type="content" source="./media/change-analysis/share-single-change.png" alt-text="Screenshot of selecting the share button on the dashboard and copying link.":::

## Next steps

- Learn how to [troubleshoot problems in Change Analysis](change-analysis-troubleshoot.md)
