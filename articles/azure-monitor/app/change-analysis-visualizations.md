---
title: Visualizations for Application Change Analysis - Azure Monitor
description: Learn how to use visualizations in Application Change Analysis in Azure Monitor.
ms.topic: conceptual
author: cawams
ms.author: cawa
ms.date: 02/11/2021

---

# Visualizations for Application Change Analysis (preview)

## Standalone UI

In Azure Monitor, there is a standalone pane for Change Analysis to view all changes with insights into application dependencies and resources.

Search for Change Analysis in the search bar on Azure portal to launch the experience.

![Screenshot of searching Change Analysis in Azure portal](./media/change-analysis/search-change-analysis.png)

All resources under a selected subscription are displayed with changes from the past 24 hours. To optimize for the page load performance, the service is displaying 10 resources at a time. Select the next page to view more resources. We are working on removing this limitation.

![Screenshot of Change Analysis blade in Azure portal](./media/change-analysis/change-analysis-standalone-blade.png)

Clicking into a resource to view all its changes. If needed, drill down into a change to view json formatted change details and insights.

![Screenshot of change details](./media/change-analysis/change-details.png)

For any feedback, use the send feedback button or email changeanalysisteam@microsoft.com.

![Screenshot of feedback button in Change Analysis tab](./media/change-analysis/change-analysis-feedback.png)

### Multiple subscription support

The UI supports selecting multiple subscriptions to view resource changes. Use the subscription filter:

![Screenshot of subscription filter that supports selecting multiple subscriptions](./media/change-analysis/multiple-subscriptions-support.png)

### Web App Diagnose and Solve Problems

In Azure Monitor, Change Analysis is also built into the self-service **Diagnose and solve problems** experience. Access this experience from the **Overview** page of your App Service application.

![Screenshot of the "Overview" button and the "Diagnose and solve problems" button](./media/change-analysis/change-analysis.png)

## Application Change Analysis in the Diagnose and solve problems tool

Application Change Analysis is a standalone detector in the Web App diagnose and solve problems tools. It is also aggregated in **Application Crashes** and **Web App Down detectors**. As you enter the Diagnose and Solve Problems tool, the **Microsoft.ChangeAnalysis** resource provider will automatically be registered. Follow these instructions to enable web app in-guest change tracking.

1. Select **Availability and Performance**.

    ![Screenshot of the "Availability and Performance" troubleshooting options](./media/change-analysis/availability-and-performance.png)

2. Select **Application Changes**. The feature is also available in **Application Crashes**.

   ![Screenshot of the "Application Crashes" button](./media/change-analysis/application-changes.png)

3. The link leads to Application Change Analysis UI scoped to the web app. If web app in-guest change tracking is not enabled, follow the banner to get file and app settings changes.

   ![Screenshot of "Application Crashes" options](./media/change-analysis/enable-changeanalysis.png)

4. Turn on **Change Analysis** and select **Save**. The tool displays all web apps under an App Service plan. You can use the plan level switch to turn on Change Analysis for all web apps under a plan.

    ![Screenshot of the "Enable Change Analysis" user interface](./media/change-analysis/change-analysis-on.png)

5. Change data is also available in select **Web App Down** and **Application Crashes** detectors. You'll see a graph that summarizes the type of changes over time along with details on those changes. By default, changes in the past 24 hours are displayed to help with immediate problems.

     ![Screenshot of the change diff view](./media/change-analysis/change-view.png)

## Virtual Machine Diagnose and Solve Problems

Go to Diagnose and Solve Problems tool for a Virtual Machine.  Go to **Troubleshooting Tools**, browse down the page and select **Analyze recent changes** to view changes on the Virtual Machine.

![Screenshot of the VM Diagnose and Solve Problems](./media/change-analysis/vm-dnsp-troubleshootingtools.png)

![Change analyzer in troubleshooting tools](./media/change-analysis/analyze-recent-changes.png)

## Activity Log Change History

The [View change history](../essentials/activity-log.md#view-change-history) feature in Activity Log calls Application Change Analysis service backend to get changes associated with an operation. **Change history** used to call [Azure Resource Graph](../../governance/resource-graph/overview.md) directly, but swapped the backend to call Application Change Analysis so changes returned will include resource level changes from [Azure Resource Graph](../../governance/resource-graph/overview.md), resource properties from [Azure Resource Manager](../../azure-resource-manager/management/overview.md), and in-guest changes from PaaS services such as App Services web app. 
In order for the Application Change Analysis service to be able to scan for changes in users' subscriptions, a resource provider needs to be registered. The first time entering **Change History** tab, the tool will automatically start to register **Microsoft.ChangeAnalysis** resource provider. After registered, changes from **Azure Resource Graph** will be available immediately and cover the past 14 days. Changes from other sources will be available after ~4 hours after subscription is onboard.

![Activity Log change history integration](./media/change-analysis/activity-log-change-history.png)

## VM Insights integration

Users having [VM Insights](../vm/vminsights-overview.md) enabled can view what changed in their virtual machines that might of caused any spikes in a metrics chart such as CPU or Memory. Change data is integrated in the VM Insights side navigation bar. User can view if any changes happened in the VM and select **Investigate Changes** to view change details in Application Change Analysis standalone UI.

[![VM insights integration](./media/change-analysis/vm-insights.png)](./media/change-analysis/vm-insights.png#lightbox)

## Next steps

- Learn how to [troubleshoot problems in Change Analysis](change-analysis-troubleshoot.md)