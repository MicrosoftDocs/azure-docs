---
title: Monitor Performance and Create Alerts
description: Learn how to monitor performance and create alerts for Azure resources organized by application groups in an integration environment.
ms.service: azure
ms.subservice: azure-integration-environments
ms.topic: how-to
ms.reviewer: estfan, divswa, azla
ms.date: 06/10/2025
# CustomerIntent: As an integration developer, I want a way to check the performance and create alerts for the Azure resources organized as application groups based on my organization's integration solutions.
---

# Monitor performance and create alerts for Azure resources in integration environments (Preview)

> [!NOTE]
>
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


Benefits:

1. **Unified Application Health View**
   - Monitor all applications in your integration environment from a central dashboard.
   - Create alerts to monitor and trigger on events on Azure resources.
   - Track individual resources and view triggered alerts.

2. **End-to-End Message Tracing**
   - Trace messages across resources in **Azure Integration Services (AIS)** with a single correlation ID.
   - Get a full itinerary of message flow for better troubleshooting. Note: In some cases, Service Bus traces might not appear.

3. **Expanded monitoring Azure Logic Apps**
   - View health for multiple logic apps.
   - Select and resubmit multiple logic workflow runs in bulk.

4. **Improved Browsing Experience**
   - **API Connections View**: Find and monitor API connections in a single place.
   - **Resource Status**: Check resource status in one place.
   - **Plan information**: View plan name and SKU for Azure resources.
   - **Custom filters**: Adjust displayed columns for better monitoring.

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

## View health for all applications

The visualizations on the aggregated application dashboard are powered by Azure Monitor. For more information, see [Azure Monitor Insights overview](/azure/azure-monitor/visualize/insights-overview).

1. In the [Azure portal](https://portal.azure.com), open your integration environment.

1. On the resource navigation menu, under **Environment**, select **Insights**.

   The **Insights** page shows health metrics for all applications in the integration environment, for example:

   <**SCREENSHOT**>

1. From the **Insights** page, select a specific application, which shows more details about the alerts triggered by resources in the application.

   This view consolidates alerts from various Azure resources, so that you can more easily monitor and manage those resources. For example, this view shows associated resources, triggered alerts, severity levels, and an **Open Alert Details** link to get more information about each alert.

1. For a specific alert, select **Open Alert Details** to view information about the specific entities that are in an unhealthy state.

   On the specific alert pane, you can take action on the alert, update the user response, and add comments.

## View health for a specific application

The visualizations on the application-specific dashboards are built on [Azure Workbooks](/azure/azure-monitor/visualize/workbooks-overview) in Azure Monitor and extensible based on your business needs.

1. In the [Azure portal](https://portal.azure.com), open your integration environment.

1. On the resource navigation menu, under **Environment**, select **Applications**.

1. On the **Applications** page, select the application that you want.

1. On the application menu, select **Insights**.

1. Under the **Insights** toolbar, select the time range that you want to review.

   For the selected duration, the **Insights** page shows the resources in your application based on the Azure service category, such as **Logic Apps**, **Service Bus**, and **APIM**.

1. Select a service category, for example, **Logic Apps**.

   1. Select the **Overview** tab to get aggregated health information for all logic apps in an application.

      Trend charts show workflow runs and their trends over the selected duration. For example, the following chart shows the total runs and the pass or fail rates for logic apps and their associated workflows. 

      <**SCREENSHOT**>

   1. To troubleshoot specific workflow runs, select the **Runs** tab.

   1. To get the run history and details for a specific workflow, select the row for that workflow.

      The workflow runs table includes relevant details about each run. Each table row has a unique correlation ID, which tracks the data flow across all Azure resources in an application.

      - Filter the table by run status so that you can more easily focus on specific scenarios.

      - For properties information about a specific run, in the **Properties** column, select the **Properties** link.

      - To view the processing hops for a message, select the row for a specific run.
      
        The opened table provides a comprehensive view for the message's journey through Azure resources in the application. Azure stitches together the timelines for message processing across all Azure resources in the application by using the correlation ID.

      - To resubmit a failed run, choose an option:

         - Single run: In the **Resubmit** column, select the **Resubmit** link.

         - Multiple runs: Select the runs that you want, and then select **Resubmit Selected Runs**.

## Set up alerts

Alerts help you find and address issues before your customers notice them. When log data collected in Azure Monitor indicates that your infrastructure or application might have a problem, alerts work proactively notify you about the problem.

You can create an alert for any metric or resource that emits log data that's supported by the Azure Monitor platform. For more information about available alert types, see [What are Azure Monitor alerts?](/azure/azure-monitor/alerts/alerts-overview)

   The following table shows the default severity levels for the available alerts:

   | Alert | Default severity level |
   |-------|------------------------|
   | Critical | 0 |
   | Errors | 1 |
   | Warning  | 2 |
   | Informational | 3 |
   | Verbose | 4 |

   For more information, see [Manage alert rules](/azure/azure-monitor/alerts/alerts-manage-alert-rules).


1. In the [Azure portal](https://portal.azure.com), open your integration environment.

1. On the integration environment menu, under **Environment**, select **Resources**.

1. Select the resource or application group that you want to monitor with alerts.

   You can select a parent resource or expand the parent to select a child resource, for example, a logic app workflow for Azure Logic Apps, API in API Management, or a queue for Azure Service Bus.

1. On the selected resource menu, under **Monitoring**, select **Alerts**.

1. On the **Alerts** toolbar, select **Alert rules** to review any existing rules.

1. On the **Alert rules** toolbar, select **Create**.

1. On the **Create an alert rule** page, follow the steps in [Create or edit an alert rule from a specific resource](/azure/azure-monitor/alerts/alerts-create-metric-alert-rule#create-or-edit-an-alert-rule-from-a-specific-resource).

## Related content

