---
title: Switch to use container insights with managed Prometheus | Microsoft Docs
description: This article describes how you can replace your container insights visualizations to use Prometheus metrics
ms.topic: conceptual
ms.date: 02/01/2024
ms.reviewer: aul
---

# Switch to using managed Prometheus for container insights

Container insights currently uses data from Log Analytics to power the visualizations in the Azure Portal. However, with the release of managed Prometheus, this new format of metrics collection is cheaper and more efficient. Container insights now offers the ability to visualize using only managed Prometheus data. This article helps you with the setup to start using managed Prometheus as your primary container insights visualization tool.

## Pre-requisites

To view your container insights data using Prometheus, please ensure the following steps have been completed

* AKS cluster [configured with managed Prometheus](./kubernetes-monitoring-enable.md#enable-prometheus-and-grafana)
* User has `Reader` permission or higher on the associated [Azure Monitor workspace](../essentials/azure-monitor-workspace-overview.md)
* Adblock is disabled or set to allow `monitor.azure.com` traffic
* For Windows clusters, [enable Windows metric collection](./kubernetes-monitoring-enable.md#enable-windows-metrics-collection-preview)


## Accessing Prometheus based container insights

Once the above steps are complete, you may access the container insights visualizations through this [feature flagged link](https://aka.ms/civ2).

1.) Open the Azure Portal using the [feature flag](https://aka.ms/civ2)

2.) Navigate to your desired AKS cluster

3.) Select the Insights menu item from the menu, which should display the following experience

    :::image type="content" source="media/container-insights-experience-v2/container-insights-prometheus-based.png" alt-text="Screenshot of AKS cluster with Prometheus based container insights." lightbox="media/container-insights-experience-v2/container-insights-prometheus-based.png" :::

## Optional steps

While the above steps are sufficient, for the full visualization experience, a few optional steps can be completed.

### Node and pod labels collection 

By default the labels for nodes and pods are not available, but can be collected through re-enabling the addon.

1.) If the managed Prometheus addon is currently deployed, we must first disable it

    ```azurecli
    az aks update --disable-azure-monitor-metrics -n <clusterName> -g <resourceGroup>
    ```

2.) Then, re-enable the addon with the additional flag `--ksm-metric-labels-allow-list`
    
    ```azurecli
    az aks update -n <clusterName> -g <resourceGroup> --enable-azure-monitor-metrics --ksm-metric-labels-allow-list "nodes=[*], pods=[*]" --azure-monitor-workspace-resource-id <amw-id
    ```

### Disable Log Analytics data collection

Once you have confirmed the Prometheus backed container insights experience is sufficient for your purposes, if you are currently using the logs based container insights experience, you can choose to stop ingesting metrics to Log Analytics to save on billing.

1.) Navigate to the monitoring settings for your clusters by following the instructions on how to configure your [container insights DCR](./container-insights-data-collection-dcr.md#configure-data-collection)

2.) Under the [`Collected data`](./container-insights-data-collection-dcr.md#collected-data) section, de-select all the checkboxes and save your settings.

## Known limitations and issues

As this feature is currently in preview, there are several known limitations, the following features are not supported

* Environment variable details
* Filtering data by individual services
* Live data viewing
* Workbooks reports data
* Node memory working set and RSS metrics

In addition, due to query limitations, users running clusters of over five thousand containers may experience throttling issues and 429 errors when retrieving data.

For all other issues or bugs identified not included in the list above, please reach out to askcoin@microsoft.com to resolve.
