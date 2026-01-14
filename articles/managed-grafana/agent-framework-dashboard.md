---
title: Create an Agent Framework dashboard in Azure Managed Grafana
description: Learn how to create and customize an Agent Framework dashboard in Azure Managed Grafana to monitor AI agent performance, token usage, costs, and errors.
#customer intent: As a developer or platform engineer, I want to monitor my Agent Framework applications in a Grafana dashboard so that I can track agent performance, token usage, costs, and troubleshoot errors.
author: maud-lv
ms.author: malev
ms.service: azure-managed-grafana
ms.topic: how-to
ms.date: 11/03/2025
ai-usage: ai-assisted
ms.collection: ce-skilling-ai-copilot
---

# Create an Agent Framework dashboard

In this guide, you learn how to create and customize an Agent Framework dashboard in Azure Managed Grafana. After adding instrumentation to send data to Application Insights, you can use this prebuilt dashboard to visualize and monitor the performance of your Agent Framework applications. This dashboard helps you track the health, performance, and cost of individual AI agents built with the Microsoft Agent Framework.

The [Microsoft Agent Framework](https://github.com/microsoft/agent-framework) is an open-source development kit for building AI agents and multi-agent workflows in .NET and Python. The Agent Framework dashboard provides comprehensive monitoring of individual agent operations, including token usage, costs, errors, response times, and detailed trace analysis.

> [!NOTE]
> For monitoring multi-agent workflows and graph-based execution flows, see [Create an Agent Framework Workflow dashboard](./agent-framework-workflow-dashboard.md).

## What you can monitor

The Agent Framework dashboard provides real-time insights into individual AI agent operations:

- **Performance monitoring**: Track response times, success rates, and throughput to assess agent health and identify performance issues
- **Token usage and costs**: Monitor token consumption per agent and estimate costs based on model pricing
- **Error analysis**: Identify and debug agent-level errors with detailed trace information
- **Agent activity**: Compare performance across different agents
- **Trace analysis**: View detailed execution traces for individual agent operations with timing, dependencies, and span relationships

## Prerequisites

Before you begin, ensure you have:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An Azure Managed Grafana workspace. If you don't have one yet, [create an Azure Managed Grafana workspace](./quickstart-managed-grafana-portal.md).
- An Azure Application Insights resource collecting telemetry from your Agent Framework application.
- Your Agent Framework application instrumented to send telemetry to Application Insights using OpenTelemetry. For instrumentation details, see:
  - [Python instrumentation guide](https://github.com/microsoft/agent-framework/blob/main/python/samples/getting_started/observability/README.md)
  - [.NET instrumentation guide](https://github.com/microsoft/agent-framework/tree/main/dotnet/samples/GettingStarted/AgentOpenTelemetry)
- The Monitoring Reader role or equivalent permissions for the Application Insights resource you want to monitor.

## Import the prebuilt Agent Framework dashboard

Import the prebuilt Agent Framework dashboard into your Grafana workspace.

1. In the Azure portal, open your Azure Managed Grafana workspace and select the **Endpoint** URL to open the Grafana portal.

1. In the Grafana portal, go to **Dashboards** > **New** > **Import**.

1. Under **Find and import dashboards**, enter the dashboard ID **24156**.

1. Select **Load**.

1. Configure the import settings:

   - **Name**: Optionally customize the dashboard name.
   - **Folder**: Select a folder to organize your dashboard.
   - **Unique identifier (UID)**: Leave as default or customize.
   - **Azure Monitor**: Select your Azure Monitor data source from the dropdown.

   > [!NOTE]
   > Ensure your Azure Managed Grafana workspace has the Monitoring Reader role on the Application Insights resource. If not, [assign the role to the workspace's managed identity](./how-to-permissions.md#edit-azure-monitor-permissions).

1. Select **Import**.

1. After importing the dashboard, use the dropdown selectors at the top of the dashboard to filter by agent name, operation type, and time range.

> [!TIP]
> You can also access this dashboard directly from the Azure portal. Go to **Monitor** > **Dashboards with Grafana (preview)**, and select **Agent Framework**, or use the direct link: [Agent Framework dashboard](https://portal.azure.com/#view/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/~/AzureGrafanaReactView).

:::image type="content" source="media/agent-framework-dashboard/dashboard-screenshot-performance-metrics.png" alt-text="Screenshot of Grafana showing Agent Framework performance metrics." lightbox="media/agent-framework-dashboard/dashboard-screenshot-performance-metrics.png":::

:::image type="content" source="media/agent-framework-dashboard/dashboard-screenshot-traces.png" alt-text="Screenshot of Grafana showing Agent Framework traces panels." lightbox="media/agent-framework-dashboard/dashboard-screenshot-traces.png":::

:::image type="content" source="media/agent-framework-dashboard/dashboard-screenshot-errors-detailed-metrics.png" alt-text="Screenshot of Grafana showing Agent Framework detailed metrics panels." lightbox="media/agent-framework-dashboard/dashboard-screenshot-errors-detailed-metrics.png":::

## Customize the dashboard

Customize the dashboard to your specific monitoring needs.

To add a new panel:

1. Select **Edit** > **Add** > **Visualization** at the top of the dashboard.

1. Configure the query:

   - **Data source**: Select **Azure Monitor**.
   - **Query type**: Select **Traces** or **Logs** depending on the panel.
   - **Resource**: Choose your Application Insights resource.
   - **Query**: Write a KQL query to retrieve agent telemetry. For example:
     ```kusto
     traces
     | where customDimensions.AgentName != ""
     | summarize avg(duration) by bin(timestamp, 5m), tostring(customDimensions.AgentName)
     ```

1. Configure visualization options:

   - **Panel title**: Enter a descriptive title.
   - **Visualization type**: Choose from Time series, Stat, Gauge, Bar chart, Table, or other types.
   - **Unit**: Set the appropriate unit (milliseconds, count, currency, etc.).
   - **Thresholds**: Define warning and critical thresholds for visual alerts.

1. Select **Apply** to add the panel to your dashboard.

To customize cost estimation:

1. Locate the "Daily Cost Estimation" panel and select **Edit**.

1. Update the cost calculation in the KQL query to match your model pricing:

   ```kusto
   // Example: Adjust these values to your model's pricing
   input_cost = input_tokens * 0.00000025,   // Your input token rate
   output_cost = output_tokens * 0.000002    // Your output token rate
   ```

1. Select **Apply** and save the dashboard.

## Technical details

The dashboard queries Azure Application Insights using the following setup:

- **Data source**: Application Insights with OpenTelemetry instrumentation
- **Key metrics tracked**:
  - Agent operations (count, duration, success rate)
  - Token usage (input tokens, output tokens)
  - Cost estimation (based on configurable token pricing)
  - Error rates and error details
  - Trace visualization with span relationships
- **Grouping**: Metrics split by agent name, operation type, and status code
- **Aggregations**: Count for throughput, average/percentiles for latency, sum for tokens and costs
- **Instrumentation**: Requires OpenTelemetry SDK configuration in your Agent Framework application

For detailed instrumentation instructions, see:
- [Python: Agent Framework observability setup](https://github.com/microsoft/agent-framework/blob/main/python/samples/getting_started/observability/README.md)
- [.NET: Agent Framework OpenTelemetry sample](https://github.com/microsoft/agent-framework/tree/main/dotnet/samples/GettingStarted/AgentOpenTelemetry)

## Related content

- [Create an Agent Framework Workflow dashboard](./agent-framework-workflow-dashboard.md) - Monitor multi-agent workflows and graph-based execution flows
- [Create dashboards in Azure Managed Grafana](./how-to-create-dashboard.md)
- [Microsoft Agent Framework documentation](/agent-framework/overview/agent-framework-overview)
- [Azure Application Insights overview](/azure/azure-monitor/app/app-insights-overview)