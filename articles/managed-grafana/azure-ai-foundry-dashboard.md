---
title: Create an Azure AI Foundry dashboard in Azure Managed Grafana
description: Learn how to set up and configure an Azure AI Foundry metrics dashboard in Azure Managed Grafana to monitor AI workload performance and resource utilization.
#customer intent: As a platform engineer or data scientist, I want to monitor Azure AI Foundry platform metrics in a Grafana dashboard so that I can track resource consumption, performance, and operational health of my AI workloads.
author: maud-lv
ms.author: malev
ms.service: azure-managed-grafana
ms.topic: how-to
ms.date: 11/03/2025
ai-usage: ai-assisted
ms.collection: ce-skilling-ai-copilot
---

# Create an Azure AI Foundry dashboard

In this guide, you learn how to set up an Azure AI Foundry metrics dashboard in Azure Managed Grafana. This dashboard tracks inference latency, throughput, token usage, and API call success rates to help you optimize costs, identify performance bottlenecks, and maintain the health of your AI resources.

## What you can monitor

The Azure AI Foundry dashboard provides real-time insights into your AI workloads:

- **Model performance**: Monitor inference latency, throughput, and success rates to identify bottlenecks
- **Token usage**: Track inference, prompt, and completion tokens across all deployments
- **Request trends**: View API call volume and success rates over time
- **Cost tracking**: Analyze token consumption patterns to understand and optimize costs
- **Per-deployment comparison**: Compare metrics across model deployments (for example, GPT-4, GPT-3.5)

## Prerequisites

Before you begin, ensure you have:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An Azure Managed Grafana workspace. If you don't have one yet, [create an Azure Managed Grafana workspace](./quickstart-managed-grafana-portal.md).
- An Azure AI Foundry resource, with the Azure Monitor data source configured to read metrics from your Azure AI Foundry resource.

## Import the Azure AI Foundry dashboard

Import the prebuilt Azure AI Foundry dashboard into your Grafana workspace.

1. In the Azure portal, open your Azure Managed Grafana workspace and select the **Endpoint** URL to open the Grafana portal.

1. In the Grafana portal, go to **Dashboards** > **New** > **Import**.

1. Under **Find and import dashboards**, enter the dashboard ID **24039**.

1. Select **Load**.

1. Configure the import settings:

   - **Name**: Optionally customize the dashboard name.
   - **Folder**: Select a folder to organize your dashboard.
   - **Unique identifier (UID)**: Leave as default or customize.
   - **Azure Monitor**: Select your Azure Monitor data source from the dropdown.

   > [!NOTE]
   > Ensure your Azure Managed Grafana workspace has the Monitoring Reader role on the subscription, resource group, or specific Azure AI Foundry resource. If not, [assign the role to the workspace's managed identity](./how-to-permissions.md#edit-azure-monitor-permissions).

1. Select **Import**.

1. After importing the dashboard, use the dropdown selectors at the top of the dashboard to filter your specific AI Foundry resource.

> [!TIP]
> You can also import this dashboard directly from the Azure portal. Go to **Monitor** > **Dashboards with Grafana (preview)**, and select **AI Foundry**, or go to [AI Foundry dashboard](https://portal.azure.com/#view/Microsoft_Azure_Monitoring/AzureGrafana.ReactView/GalleryType/Azure%20Monitor/ConfigurationId/AIFoundry).

:::image type="content" source="media/ai-foundry-dashboard/ai-foundry-top-section.png" alt-text="Screenshot of Grafana showing Azure AI Foundry metrics." lightbox="media/ai-foundry-dashboard/ai-foundry-top-section.png":::

:::image type="content" source="media/ai-foundry-dashboard/ai-foundry-latency.png" alt-text="Screenshot of Grafana showing AI Foundry latency metrics." lightbox="media/ai-foundry-dashboard/ai-foundry-latency.png":::

## Customize the dashboard

Customize the dashboard to your specific monitoring needs.

To add a new panel:

1. Select **Edit** > **Add** > **Visualization** at the top of the dashboard.

1. Configure the query:

   - **Data source**: Select **Azure Monitor**.
   - **Resource**: Choose your AI Foundry resource.
   - **Metric namespace**: Select the appropriate namespace (for example, `Microsoft.CognitiveServices/accounts`).
   - **Metric**: Choose the metric to display (for example, `TokenTransaction`, `Latency`). For a complete list of available metrics, see [Azure AI Foundry metrics](/azure/ai-foundry/foundry-models/how-to/monitor-models#metrics-explorer).
   - **Aggregation**: Select the aggregation method (Average, Sum, Count, Min, Max).

1. Configure visualization options:

   - **Panel title**: Enter a descriptive title.
   - **Visualization type**: Choose from Time series, Stat, Gauge, Bar chart, Table, or other types.
   - **Unit**: Set the appropriate unit (percent, milliseconds, requests/sec, etc.).
   - **Thresholds**: Define warning and critical thresholds for visual alerts.

1. Select **Apply** to add the panel to your dashboard.

   :::image type="content" source="media/ai-foundry-dashboard/azure-monitor-datasource.png" alt-text="Screenshot of Grafana showing Azure Monitor data source configuration.":::

## Technical details

The dashboard queries Azure Monitor Metrics using the following setup:

- **Resource type**: `Microsoft.CognitiveServices/accounts`
- **Key metrics**:
  - `AzureOpenAIRequests` — API call volume and success rates
  - `TokenTransaction` — Total inference tokens for cost tracking
  - `ProcessedPromptTokens` — Input tokens consumed
  - `GeneratedTokens` — Output tokens produced
  - `AzureOpenAITTLTInMS` — Inference latency (time to last byte)
- **Grouping**: All metrics split by `ModelDeploymentName` for per-deployment analysis
- **Aggregations**: Total for throughput and cost metrics, average for latency

## Related content

- [Create dashboards in Azure Managed Grafana](./how-to-create-dashboard.md)
- [Monitor model deployments in Azure AI Foundry Models](/azure/ai-foundry/foundry-models/how-to/monitor-models)
- [Create an Agent Framework dashboard](./agent-framework-dashboard.md) – Monitor individual AI agent operations, costs, and traces
- [Create an Agent Framework Workflow dashboard](./agent-framework-workflow-dashboard.md) – Monitor multi-agent workflow execution and executor performance
