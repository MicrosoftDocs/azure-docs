---
title: Migrate from Azure Managed Grafana Essential Service Tier
ms.service: azure-managed-grafana
description: Migrate from Azure Managed Grafana Essential service tier before retirement. Step-by-step guide to upgrade to Standard service tier or move to Azure Monitor dashboards with Grafana.
author: maud-lv
ms.topic: how-to
ms.date: 01/27/2026
ms.author: malev
---

# Migrate from Azure Managed Grafana Essential service tier

The Azure Managed Grafana Essential service tier is being transitioned to Azure Monitor dashboards with Grafana (available for free in Azure portal) and/or to Azure Managed Grafana Standard service tier. With this transition, creation of new Essential tier workspaces is now disabled. This article outlines the transition timeline, guides you through the transition options.

Two migration paths are available to ensure continuity of your Grafana dashboards and monitoring capabilities:

- Upgrade to Standard service tier (recommended): Keep your existing Azure Managed Grafana workspace with enhanced reliability, SLA coverage, and additional features.
- Migrate to Azure Monitor dashboards with Grafana: Move your dashboards to a free, Azure-native alternative.

Choose the option that best fits your requirements and budget.

We recommend that you plan your migration before the following key dates to prevent disruption:

- March 31, 2026: The Essential tier is no longer available and existing Essential workspaces will stop functioning.
- August 1, 2026: Existing Essential SKU workspaces are no longer supported and wil be deleted.

## Recommended option: Upgrade to Standard service tier

Upgrading to the Standard service tier ensures continued reliability, SLA coverage, and enhanced features:

- SLA-backed service and enterprise-level reliability with access to more data sources.
- Two instance sizes available: X1 (default) and X2 (more capacity and alert rules).
- A similar provisioning flow as Managed Grafana Essential service tier.
- Additional features: zone redundancy, private endpoints, reporting, alerts, and more.

For pricing details, see [Azure Managed Grafana pricing](https://azure.microsoft.com/pricing/details/managed-grafana/).

To upgrade to the Standard service tier, follow these steps in the Azure portal:

1.  Navigate to your Azure Managed Grafana workspace in the Azure portal.
1.  Go to **Settings** > **Configuration** > **Pricing Plans**.
1.  Choose **Standard SKU**. Optionally increase the instance size to X2.
1.  Save the changes.

> [!IMPORTANT]
> Downgrading from Standard SKU back to Essential (preview), or moving from a larger to a smaller instance size, is not supported.

## Alternative option: Move dashboards to Azure Monitor dashboards with Grafana (preview)

If upgrading isn't suitable, consider migrating your dashboards to [Azure Monitor dashboards with Grafana (preview)](/azure/azure-monitor/visualize/visualize-use-grafana-dashboards) — a free, Azure-native alternative:

- Integrated directly with Azure Monitor (metrics, logs, traces, Prometheus, etc.).
- Higher availability—no reliance on spot VMs.
- Feature parity with Essential SKU capabilities.

To move dashboards to Azure Monitor dashboards with Grafana, you first export your dashboards from Azure Managed Grafana and then import them into Azure Monitor dashboards with Grafana.

1. Export your dashboard from Azure Managed Grafana, using the Grafana UI or the Azure CLI.

    ### [Grafana UI](#tab/grafana-ui)
    
    1.  In the Grafana UI, open the dashboard you want to export.
    1.  At the top of the dashboard, select **Share**.
    1.  In the dialog that appears, select the **Export** tab.
    1.  Select **Save to file** to download the dashboard JSON file.
        :::image type="content" source="media/migrate-essential-service-tier/export-dashboard.png" alt-text="Screenshot of the Grafana user interface showing the dashboard export option.":::
    
    ### [Azure CLI](#tab/azure-cli)

    Run the `az grafana backup` command available in preview to export dashboards, datasources, and other components.
    
    ```azurecli
    az grafana backup --name <grafana-workspace-name>
    ```
  
    For additional options and filters, see [az grafana backup](/cli/azure/grafana/#az-grafana-backup). For example, the following command backs up datasources, dashboards, and folders to a temp folder from the specified Grafana resource while excluding the "General" and "Azure Monitor" folders:
    
    ```azurecli
    az grafana backup \
        --name MyGrafana \
        --resource-group MyResourceGroup \
        --directory "c:\temp" \
        --folders-to-exclude "General" "Azure Monitor" \
        --components datasources dashboards folders
    ```

1. Import your exported dashboards to Azure Monitor dashboards with Grafana.

    Follow these steps, or see more details in the guide: [Import Grafana dashboards using JSON](/azure/azure-monitor/visualize/visualize-use-grafana-dashboards#import-grafana-dashboards-using-json).

   1. In the Azure portal, open Azure Monitor.
   1. In the service menu, select **Dashboards with Grafana (preview)**, then **New** > **Import**.
       :::image type="content" source="media/migrate-essential-service-tier/import-dashboard.png" alt-text="Screenshot of the Dashboards with Grafana interface in the Azure portal showing the dashboard import option.":::
   1. Under **Import dashboard from File**, upload the JSON file you exported.
   1. Select **Load**.
   1. Enter a name for the dashboard, and select the subscription, resource group, and region where the dashboard should be created.

## Related content

- [Visualize data with Grafana in Azure Monitor](/azure/azure-monitor/visualize/visualize-use-grafana-dashboards) for details.
- [Azure Managed Grafana pricing](https://azure.microsoft.com/pricing/details/managed-grafana/)
 
