---
title: Configure Bundled Prometheus (preview) in Azure Managed Grafana
description: Learn how to configure bundled Prometheus in Azure Managed Grafana. This guide covers enabling the integration, setting up Grafana-managed recording rules, and visualizing Prometheus metrics.
keywords: Azure Managed Grafana, Prometheus, bundled Prometheus
author: maud-lv
ms.topic: how-to
ms.date: 07/09/2025
ms.author: malev
ms.reviewer: malev
ms.service: azure-managed-grafana
ai-usage: ai-assisted
---

# Configure bundled Prometheus (preview) in Azure Managed Grafana

Azure Managed Grafana offers a bundled Prometheus integration in preview that lets you connect a selected Azure Monitor workspace (managed Prometheus) to your Grafana instance and immediately use it as both a read and remote-write backend for Grafana-managed recording rules. By connecting your chosen Azure Monitor workspace to Grafana, you can periodically pre-compute frequently used or computationally expensive queries, saving the results as a new time series metric back into the same workspace, and visualize those recorded series alongside the rest of your Azure metrics.

Bundled Prometheus integrates seamlessly with Azure Monitor workspaces, enabling you to:

- Automatically provision Prometheus data collection and storage
- Set up Grafana-managed recording rules for optimized query performance  
- Visualize Prometheus metrics alongside other Azure monitoring data
- Centralize your observability stack within Azure

This article walks you through enabling bundled Prometheus, configuring recording rules, and creating dashboards to visualize your Prometheus data in Azure Managed Grafana.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An Azure Managed Grafana workspace in the Standard tier. [Create a new workspace](./quickstart-managed-grafana-portal.md) if you don't have one.
- Grafana version 11.0 or higher.
- An [Azure Monitor workspace](/azure/azure-monitor/essentials/azure-monitor-workspace-overview) that supports Prometheus metrics collection.
- You must have the **Owner** role on the Azure Monitor workspace or custom permissions to create role assignments. This access allows Azure Managed Grafana to configure the necessary access to collect and store Prometheus metrics.

## Select an Azure Monitor workspace to enable bundled Prometheus (preview)

Complete the following steps to connect your Grafana workspace to an Azure Monitor workspace and enable bundled Prometheus (preview):

1. Open your Azure Managed Grafana workspace and in the left menu select **Integrations** > **Bundled Prometheus (Preview)**.

    :::image type="content" source="media/bundled-prometheus/select-monitor-workspace.png" alt-text="Screenshot of the Azure platform showing the bundled Prometheus integration pane in Azure Managed Grafana.":::

1.  In the dropdown menu, select an Azure Monitor workspace, then select **Save**.
1.  Azure adds a new Prometheus data source called *bundled-azure-prometheus* to Grafana. During enablement, the Grafana-managed recording rules feature is enabled. Azure also automatically creates two role assignments if they don't already exist:

    - **Monitoring Data Reader**: Grants the Grafana instance read access to metrics in the selected Azure Monitor workspace.
    - **Monitoring Metrics Publisher**: Allows the Grafana instance to write recording rule results to the Data Collection Rule attached to the Azure Monitor workspace.

1. After enablement completes, the selected Azure Monitor workspace appears in the dropdown menu.
1. To switch to a different Azure Monitor workspace in the future, repeat steps 2 and 3 above.

## Create a Grafana alert rule

Alert rules monitor your Prometheus metrics and trigger notifications when specific conditions are met.

Follow these steps to create an alert rule:

1. In the Grafana UI, go to **Alerting** > **Alert rules** and select **New alert rule**.
    :::image type="content" source="media/bundled-prometheus/new-alert-rule.png" alt-text="Screenshot of the Alert rules page in Grafana with the New alert rule action highlighted." lightbox="media/bundled-prometheus/new-alert-rule.png":::

1. Enter an alert rule name that describes what you're monitoring.
1. Define a query and alert condition: select **bundled-azure-prometheus** from the dropdown and define your query and alert condition.
1. Set an evaluation behavior: set the evaluation interval and the conditions for firing or resolving the alert.
1. Set labels and notifications: add labels to help categorize the alert and set up notifications to receive alerts.
1. Select **Save rule and exit** to create the alert rule.

For more details, see [Create Grafana-managed alert rules](https://grafana.com/docs/grafana/latest/alerting/alerting-rules/create-grafana-managed-rule/).

## Set up Grafana-managed recording rules

> [!NOTE]
> Bundled Prometheus (preview) only supports Grafana-managed recording rules, which you configure directly in the Grafana interface. Data source-managed recording rules aren't supported.

Follow these steps to create a new recording rule:

   1. On the **Alert rules** page which is open, select **New recording rule**.
            
        :::image type="content" source="media/bundled-prometheus/new-recording-rule.png" alt-text="Screenshot of the Alert rules page in Grafana with the New recording rule button highlighted.":::

   1. In the page that opens, enter a name for the recording rule and a metric name.
   1. Define the rule for the bundled-azure-prometheus data source.
        
        :::image type="content" source="media/bundled-prometheus/define-recording-rule.png" alt-text="Screenshot of configuring recording rule settings with query and labels." lightbox="media/bundled-prometheus/define-recording-rule.png":::

   1. Set an evaluation behavior and optionally add labels.

        :::image type="content" source="media/bundled-prometheus/set-evaluation-behaviors-labels.png" alt-text="Screenshot of the recording rule configuration form with evaluation settings.":::

   1. After saving, you can view the details of the recording rule under the folder you selected earlier. Select the **View** icon to view recorded
metrics.

For detailed configuration options see, [Create Grafana-managed recording rules](https://grafana.com/docs/grafana/latest/alerting/alerting-rules/create-recording-rules/create-grafana-managed-recording-rules).

## View recorded Prometheus data (preview)

After you set up the recording rules, you can visualize the recorded Prometheus data in Grafana:

1. In the Grafana UI, go to **Metrics** and select the bundled-azure-prometheus data source to view the recorded data.

    :::image type="content" source="media/bundled-prometheus/view-metrics.png" alt-text="Screenshot of selecting the bundled-azure-prometheus data source in Grafana Metrics." lightbox="media/bundled-prometheus/view-metrics.png":::

1. You can now add these recorded metrics to a Grafana dashboard. For detailed steps on creating visualizations with Prometheus data, see [Display Prometheus data in Grafana](./how-to-connect-azure-monitor-workspace.md#display-prometheus-data-in-grafana). For more information about editing a dashboard, refer to [Edit a dashboard panel](./how-to-create-dashboard.md#edit-a-dashboard-panel).

> [!TIP]
> If you don't see Prometheus data in your dashboard, check if your Azure Monitor workspace is collecting Prometheus data. For troubleshooting, see [Troubleshoot collection of Prometheus metrics in Azure Monitor](/azure/azure-monitor/containers/prometheus-metrics-troubleshoot).

## Disable bundled Prometheus (preview)

If you no longer need bundled Prometheus (preview), you can disable it from your Azure Managed Grafana workspace:

1. In your Azure Managed Grafana workspace, select **Integrations** > **Bundled Prometheus (Preview)** from the left menu.
1. Select **Disable** > **Yes** to confirm.
1. Optionally remove the role assignments previously added in the Azure Monitor workspace:
   1. In the Azure Monitor workspace resource, select **Access control (IAM)** > **Role assignments**.
   1. Under **Monitoring Data Reader**, select the row with the name of your Azure Managed Grafana resource. Select **Delete** > **OK**.
   1. Go to the overview page of the Azure Monitor workspace and select the **Data collection rules** resource.
   1. Go to **Access Control (IAM)** > **Role Assignments**, and under **Monitoring Metrics Publisher**, select the row with the name of your Azure Managed Grafana resource. Select **Delete** > **OK**.
   1. To continue accessing existing data in the Azure Monitor workspace, consider [setting up Azure Monitor Workspace integration in Azure Managed Grafana](./how-to-connect-azure-monitor-workspace.md)
    
    > [!NOTE] 
    > Disabling bundled Prometheus removes the integration but doesn't delete existing data in your Azure Monitor workspace.

## Related content

- [Add an Azure Monitor workspace to Azure Managed Grafana](./how-to-connect-azure-monitor-workspace.md)
- [Create a dashboard in Azure Managed Grafana](./how-to-create-dashboard.md)
- [Connect to self-hosted Prometheus on an AKS cluster using a managed private endpoint](./tutorial-mpe-oss-prometheus.md)
