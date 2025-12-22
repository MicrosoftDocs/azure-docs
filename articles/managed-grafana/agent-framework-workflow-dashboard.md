---
title: Create an Agent Framework Workflow dashboard in Azure Managed Grafana
description: Learn how to create and customize an Agent Framework Workflow dashboard in Azure Managed Grafana to monitor multi-agent workflow execution and performance.
#customer intent: As a developer or platform engineer, I want to monitor my Agent Framework workflow applications in a Grafana dashboard so that I can track workflow execution, performance, and troubleshoot issues across multi-agent workflows.
author: maud-lv
ms.author: malev
ms.service: azure-managed-grafana
ms.topic: how-to
ms.date: 11/14/2025
ai-usage: ai-assisted
ms.collection: ce-skilling-ai-copilot
---

# Create an Agent Framework Workflow dashboard

In this guide, you learn how to create and customize an Agent Framework Workflow dashboard in Azure Managed Grafana. The Microsoft Agent Framework has built-in OpenTelemetry support. After adding instrumentation to send data to Application Insights, you can use this prebuilt dashboard to visualize and monitor the execution and performance of your Agent Framework workflows. This dashboard is designed specifically for monitoring graph-based workflows that connect multiple agents and functions to perform complex, multi-step tasks.

The [Microsoft Agent Framework](https://github.com/microsoft/agent-framework) is an open-source development kit for building AI agents and multi-agent workflows in .NET and Python. The Workflow dashboard focuses on workflow-level monitoring, including execution metrics, performance analysis across workflow steps, and trace visualization.

> [!NOTE]
> For monitoring individual agent operations, token usage, and costs, see [Create an Agent Framework dashboard](./agent-framework-dashboard.md).

## What you can monitor

The Agent Framework Workflow dashboard provides real-time insights into your multi-agent workflow execution:

- **Workflow summary statistics**: View overall metrics including total workflows, executors, average execution times, and success rates
- **Workflow execution monitoring**: Track workflow completion rates, execution times, and throughput with time series analysis
- **Executor performance analysis**: Monitor performance of individual executors with duration, success rate, and execution count breakdowns
- **Visual workflow graph**: Explore interactive node graphs showing workflow structure, executor dependencies, and execution flow
- **Interactive workflow selection**: Browse recent workflow executions and click to dive into detailed trace analysis
- **Error tracking**: Identify failures at the workflow or executor level with detailed error information
- **Workflow architecture**: Analyze routing, nesting, checkpointing patterns

## Prerequisites

Before you begin, ensure you have:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An Azure Managed Grafana workspace. If you don't have one yet, [create an Azure Managed Grafana workspace](./quickstart-managed-grafana-portal.md).
- An Azure Application Insights resource collecting telemetry from your Agent Framework application.
- Your Agent Framework workflow application instrumented to send telemetry to Application Insights using OpenTelemetry. For instrumentation details, see:
  - [Python instrumentation guide](https://github.com/microsoft/agent-framework/blob/main/python/samples/getting_started/observability/README.md)
  - [.NET instrumentation guide](https://github.com/microsoft/agent-framework/tree/main/dotnet/samples/GettingStarted/AgentOpenTelemetry)
- The Monitoring Reader role or equivalent permissions for the Application Insights resource you want to monitor.

> [!TIP]
> For Python applications, Agent Framework provides a `setup_observability()` function in the `agent_framework.observability` module that automatically configures OpenTelemetry exporters and providers. Set the `APPLICATIONINSIGHTS_CONNECTION_STRING` environment variable and call `setup_observability()` at the start of your application to enable telemetry.

## Import the Agent Framework Workflow dashboard

Import the prebuilt Agent Framework Workflow dashboard into your Grafana workspace.

1. In the Azure portal, open your Azure Managed Grafana workspace and select the **Endpoint** URL to open the Grafana portal.

1. In the Grafana portal, go to **Dashboards** > **New** > **Import**.

1. Under **Find and import dashboards**, enter the dashboard ID **24176**.

1. Select **Load**.

1. Configure the import settings:

   - **Name**: Optionally customize the dashboard name.
   - **Folder**: Select a folder to organize your dashboard.
   - **Unique identifier (UID)**: Leave as default or customize.
   - **Azure Monitor**: Select your Azure Monitor data source from the dropdown.

   > [!NOTE]
   > Ensure your Azure Managed Grafana workspace has the Monitoring Reader role on the Application Insights resource. If not, [assign the role to the workspace's managed identity](./how-to-permissions.md#edit-azure-monitor-permissions).

1. Select **Import**.

1. After importing the dashboard, use the dropdown selectors at the top of the dashboard to filter by workflow name, executor type, operation type, and time range.

> [!TIP]
> You can also access this dashboard directly from the Azure portal. Go to **Monitor** > **Dashboards with Grafana (preview)**, and select **Agent Framework Workflow**, or use the direct link: [Agent Framework Workflow dashboard](https://portal.azure.com/#view/Microsoft_Azure_Monitoring/AzureGrafana.ReactView/GalleryType/Azure%20Monitor/ConfigurationId/AgentFrameworkWorkflow)

:::image type="content" source="media/agent-framework-workflow-dashboard/dashboard-screenshot-execution-summary-stats.png" alt-text="Screenshot of Grafana showing Agent Framework Workflow dashboard summary statistics and execution trends." lightbox="media/agent-framework-workflow-dashboard/dashboard-screenshot-execution-summary-stats.png":::

:::image type="content" source="media/agent-framework-workflow-dashboard/dashboard-screenshot-traces-errors.png" alt-text="Screenshot of Grafana showing Agent Framework Workflow dashboard visual with traces and error details." lightbox="media/agent-framework-workflow-dashboard/dashboard-screenshot-traces-errors.png":::

:::image type="content" source="media/agent-framework-workflow-dashboard/dashboard-screenshot-workflow-runs-map.png" alt-text="Screenshot of Grafana showing Agent Framework  Workflow dashboard visual with workflow runs and executor map." lightbox="media/agent-framework-workflow-dashboard/dashboard-screenshot-workflow-runs-map.png":::

## Understanding the dashboard panels

The dashboard includes several key visualization panels for monitoring workflows:

- **Workflow summary statistics**: View total workflows, executors, average execution times, success rates, and dual-level insights at workflow and executor levels
- **Workflow execution monitoring**: Track successful versus failed workflow runs over time with color-coded visualization for quick health assessment
- **Executor performance analysis**: Analyze individual executors with performance metrics tables and bar charts showing execution count, duration, and success rates
- **Visual workflow graph**: Explore interactive node graphs showing executor connections, dependencies, start points, and execution flow
- **Interactive workflow selection**: Browse recent workflow runs with trace IDs, click any workflow to view detailed trace analysis and execution timelines

## Customize the dashboard

Customize the dashboard to your specific monitoring needs.

To add a new panel:

1. Select **Edit** > **Add** > **Visualization** at the top of the dashboard.

1. Configure the query:

   - **Data source**: Select **Azure Monitor**.
   - **Query type**: Select **Traces** or **Logs** depending on the panel.
   - **Resource**: Choose your Application Insights resource.
   - **Query**: Write a KQL query to retrieve workflow telemetry. For example:
     ```kusto
     traces
     | where customDimensions.WorkflowName != ""
     | extend ExecutorType = tostring(customDimensions.ExecutorType)
     | summarize 
         TotalExecutions = count(),
         AvgDuration = avg(duration),
         P95Duration = percentile(duration, 95),
         SuccessRate = countif(customDimensions.Status == "Success") * 100.0 / count()
       by bin(timestamp, 5m), tostring(customDimensions.WorkflowName), ExecutorType
     ```

1. Configure visualization options:

   - **Panel title**: Enter a descriptive title.
   - **Visualization type**: Choose from Time series, Stat, Gauge, Bar chart, Table, or other types.
   - **Unit**: Set the appropriate unit (milliseconds, count, percent, etc.).
   - **Thresholds**: Define warning and critical thresholds for visual alerts.

1. Select **Apply** to add the panel to your dashboard.

To analyze executor performance:

1. Locate the **Executor Performance Analysis** table in the dashboard.

1. Review metrics for each executor including execution count, average duration, 95th percentile duration, and success rate.

1. Use the executor performance bar chart to compare performance across different executor types.

1. Identify slow or failing executors that may need optimization.

To explore workflow structure:

1. Locate the **Visual Workflow Graph** panel in the dashboard.

1. Use the interactive node graph to view executor connections and dependencies.

1. Identify start points and trace execution flow through the workflow.

1. Zoom and navigate to explore complex workflow architectures.

To investigate specific workflow runs:

1. Use the **Interactive Workflow Selection** table to browse recent executions.

1. Click on any workflow run to view detailed trace analysis.

1. Review the complete execution timeline with all executor calls and relationships.

1. Identify bottlenecks and troubleshoot failed executions.

## Technical details

The dashboard queries Azure Application Insights using the following setup:

- **Data source**: Application Insights with OpenTelemetry instrumentation
- **Key metrics tracked**:
  - Workflow execution count and completion rates
  - Workflow duration (end-to-end and per-executor)
  - Executor performance (count, average duration, 95th percentile duration, success rate)
  - Success and failure rates at workflow and executor levels
  - Workflow trace spans with hierarchical relationships
  - Error rates and error details per workflow executor
  - Visual workflow graphs showing executor dependencies
- **Grouping**: Metrics split by workflow name, executor type, executor ID, operation type, and status code
- **Aggregations**: Count for throughput, average/percentiles for duration, sum for completion metrics
- **Instrumentation**: Requires OpenTelemetry SDK configuration in your Agent Framework workflow application
- **Visualization components**: Time series charts, performance tables, node graphs for workflow structure, trace panels for detailed analysis

Agent Framework Workflows provide structured orchestration of complex, multi-step processes involving multiple AI agents, functions, and external systems. The dashboard is designed to give you visibility into:
- **Execution health**: Monitor whether workflows complete successfully
- **Performance bottlenecks**: Identify slow executors in your execution graph
- **Executor behavior**: Analyze which executors take longest or fail most often
- **Workflow structure**: Visualize how executors are connected and the execution flow
- **Debugging**: Investigate what happened in failed workflow runs

For detailed instrumentation instructions, see:
- [Python: Agent Framework observability setup](https://github.com/microsoft/agent-framework/blob/main/python/samples/getting_started/observability/README.md)
- [.NET: Agent Framework OpenTelemetry sample](https://github.com/microsoft/agent-framework/tree/main/dotnet/samples/GettingStarted/AgentOpenTelemetry)

## Related content

- [Create an Agent Framework dashboard](./agent-framework-dashboard.md) - Monitor individual agent operations and token usage
- [Create dashboards in Azure Managed Grafana](./how-to-create-dashboard.md)
- [Microsoft Agent Framework documentation](/agent-framework/overview/agent-framework-overview)
- [Azure Application Insights overview](/azure/azure-monitor/app/app-insights-overview)
