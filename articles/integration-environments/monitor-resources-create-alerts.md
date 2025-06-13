---
title: Monitor Health and Performance with Alerts
description: Learn how to monitor health and performance for Azure resources in applications for an integration environment by creating alerts.
ms.service: azure
ms.subservice: azure-integration-environments
ms.topic: how-to
ms.reviewer: estfan, divswa, azla
ms.date: 06/10/2025
# CustomerIntent: As an integration developer, I want to check the performance and health for Azure resources organized as applications based on my organization's integration solutions by creating alerts.
---

# Monitor health and performance for Azure resources in applications (Preview)

> [!NOTE]
>
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

For the Azure resources that you logically organize as applications in an integration environment, you can monitor their health and performance by creating alerts. The integration environment lets you complete the following monitoring tasks:

- Create alerts to monitor and trigger on specific events that happen in Azure resources.
- Monitor all applications and resources in your integration environment from centralized dashboards.
- Trace messages across Azure resources with a single correlation ID.
- Get a full itinerary of message flow for easier troubleshooting.
- Find and monitor API connections in one place.
- Select and resubmit multiple logic app workflow runs in bulk.
- Customize filters for your monitoring needs.

## Prerequisites

- The Azure account and subscription for the Azure [integration environment](create-integration-environment.md) and Azure resources that you want to monitor.

- The Azure integration environment and Azure resources organized into [application groups](create-application-group.md), logically based on the components in your integration solutions.

  > [!NOTE]
  >
  > Your integration environment and *all* the Azure resources organized as 
  > application groups use the same Azure subscription, including any 
  > [**Business Process** resources](../business-process-tracking/overview.md) 
  > linked your application group. See [Supported Azure resources](overview.md#supported-resources).

- An [Azure Application Insights](/azure/azure-monitor/app/app-insights-overview) resource.

  If you don't have an Application Insights resource, see [Create an Application Insights resource](/azure/azure-monitor/app/create-workspace-resource?tabs=portal#create-an-application-insights-resource). 

- A [Log Analytics workspace](/azure/azure-monitor/logs/log-analytics-overview) for your Azure Application Insights resource.

  If you don't have a Log Analytics workspace, you can create or select a workspace for a specific application in your integration environment. Or, you can create the workspace in advance. For more information, see [Create a Log Analytics workspace](/azure/azure-monitor/logs/quick-create-workspace?tabs=azure-portal).

- Set up the Azure resources in your integration environment to push logs to the same Log Analytics workspace for your Application Insights resource.

  For more information, see the following documentation:

  | Service | Documentation |
  |---------|---------------|
  | Azure API Management | - [Integrate Azure API Management with Azure Application Insights](/azure/api-management/api-management-howto-app-insights?tabs=rest#create-a-connection-using-the-azure-portal) <br><br>- [Integrate Application Insights to developer portal](/azure/api-management/developer-portal-integrate-application-insights) |
  | Azure Logic Apps | [Set up and view enhanced telemetry in Application Insights for Standard workflows](/azure/logic-apps/enable-enhanced-telemetry-standard-workflows?tabs=portal) |
  | Azure Service Bus | [Tracking with Azure Application Insights](/azure/service-bus-messaging/service-bus-end-to-end-tracing?tabs=net-standard-sdk-2#tracking-with-azure-application-insights) |

  After the Azure resources in your applications generate and push data into the Log Analytics workspace in Application Insights, you can review that data on various dashboards.

## Limitations and known issues

In some scenarios, traces for Azure Service Bus might not appear.

## Set up alerts

Alerts help you find and address issues before your customers notice them. When Azure Monitor collects log data indicating that your infrastructure or application might have a problem, alerts proactively notify you about the problem.

You can create an alert for any metric or resource that emits log data that's supported by Azure Monitor. For more information about available alert types, see [What are Azure Monitor alerts?](/azure/azure-monitor/alerts/alerts-overview)

The following table shows the default severity levels for the available alerts:

| Alert | Default severity level |
|-------|------------------------|
| Critical | 0 |
| Error | 1 |
| Warning  | 2 |
| Informational | 3 |
| Verbose | 4 |

For more information, see [Manage alert rules](/azure/azure-monitor/alerts/alerts-manage-alert-rules).

1. In the [Azure portal](https://portal.azure.com), open your integration environment.

1. On the integration environment menu, under **Environment**, select **Applications**.

1. Select the application where you want to add alerts.

1. On the application menu, under **Application monitoring**, select **Alerts**.

1. On the **Alerts** page, in the **Resource name** column, find the parent resource or expand the parent to select a child resource.

   For example, you can select a workflow for a logic app in Azure Logic Apps, an API in API Management, or a queue for Azure Service Bus.

1. In the **Edit** column, select **Edit** for the parent or child resource.

   :::image type="content" source="media/monitor-resources-create-alerts/edit-alert-rules.png" alt-text="Screenshot shows integration environment, a specific application, Alerts page, and selected Edit icon for a child resource." lightbox="media/monitor-resources-create-alerts/edit-alert-rules.png":::

1. On the **Alerts** tab, select either **Add rule**, or if no rules exist, select **Start with recommended rules**. Set up the rule that you want for monitoring the resource.

   The following example shows some workflow alert rules that trigger based on various threshold conditions:

   :::image type="content" source="media/monitor-resources-create-alerts/example-rules.png" alt-text="Screenshot shows example alert rules for a resource in an application." lightbox="media/monitor-resources-create-alerts/example-rules.png":::

   For more information, see [Create alert rules for Azure resources](/azure/azure-monitor/alerts/alert-options).

1. When you're done, save your rules.

## View health for a specific application

The visualizations for application-specific dashboards are built on [Azure Workbooks](/azure/azure-monitor/visualize/workbooks-overview) in Azure Monitor and extensible based on your business needs.

1. In the [Azure portal](https://portal.azure.com), open your integration environment.

1. On the resource navigation menu, under **Environment**, select **Applications**.

1. On the **Applications** page, select the application that you want.

1. On the application menu, select **Insights**.

1. Under the **Insights** toolbar, select the time range that you want to review.

   For the selected duration, the **Insights** page shows the resources in your application based on the Azure service category, such as **Logic Apps**, **Service Bus**, and **APIM**.

1. Select a service category, for example, **Logic Apps**.

   1. Select the **Overview** tab to get aggregated health information for all logic app resources in an application.

      The tab shows tables with the following information:

      - Total runs, total triggers, and total actions for each logic app.
      - Total runs, total actions, and total triggers, based on status.

      :::image type="content" source="media/monitor-resources-create-alerts/insights-logic-apps.png" alt-text="Screenshot shows aggregated health information for logic apps in an application." lightbox="media/monitor-resources-create-alerts/insights-logic-apps.png":::

   1. Scroll down the page to view trend charts that show logic app workflow runs and their trends over the selected duration.

      The trend charts show the following information:

      - Status for workflow runs, actions, and triggers.
      - Failures for workflow runs, triggers, and actions.
      - Completed workflow runs, triggers, and actions.

      :::image type="content" source="media/monitor-resources-create-alerts/trend-charts.png" alt-text="Screenshot shows aggregated trend charts for logic apps in an application." lightbox="media/monitor-resources-create-alerts/trend-charts.png":::

   1. To troubleshoot specific workflow runs, select the **Runs** tab.

      The **Runs** tab shows the logic apps, associated workflows, total workflow runs, and failure rates for triggers, workflow runs, and actions, for example:

      :::image type="content" source="media/monitor-resources-create-alerts/workflows-failure-rates.png" alt-text="Screenshot shows logic apps, associated workflows, and failure rates." lightbox="media/monitor-resources-create-alerts/workflows-failure-rates.png":::

   1. To get the run history and details for a specific workflow, select the row for that workflow.

      Under the table with the failure rates for different workflows, a runs table appears for the selected workflow, for example:

      :::image type="content" source="media/monitor-resources-create-alerts/workflow-runs.png" alt-text="Screenshot shows a specifid workflow, and other details such as status, resubmit option, duration, and properties." lightbox="media/monitor-resources-create-alerts/workflow-runs.png":::

      This runs table includes relevant details about each workflow run. Each row has a unique correlation ID, which tracks the data flow across all Azure resources in an application.

      The following list describes other tasks that you can perform based on the metrics that you want to review:

      - Filter the table by run status so that you can more easily focus on specific scenarios.

      - For properties information about a specific run, in the **Properties** column, select the **Properties** link.

      - To view the processing hops for a message, select the row for a specific run.
      
        The opened table provides a comprehensive view for the message's journey through Azure resources in the application. Azure stitches together the timelines for message processing across all Azure resources in the application by using the correlation ID.

      - To resubmit a failed run, choose an option:

         - Single run: In the **Resubmit** column, select the **Resubmit** link.

         - Multiple runs: Select the runs that you want, and then select **Resubmit Selected Runs**.

## Related content

- [Manage Azure Monitor Workbooks](/azure/azure-monitor/visualize/workbooks-manage)
- [Azure Workbooks templates](/azure/azure-monitor/visualize/workbooks-templates)
