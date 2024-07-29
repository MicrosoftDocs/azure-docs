---
title: Add a cluster
description: How to add an Arc-enabled cluster to existing observability infrastructure in Azure IoT Operations.
author: kgremban
ms.author: kgremban
ms.topic: how-to
ms.date: 02/27/2024

# CustomerIntent: As an IT admin or operator, I want to add more Arc-enabled clusters
# to my existing observability infrastructure. 
---

# Add an Arc-enabled cluster to existing observability infrastructure

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

You can share observability resources across multiple Arc-enabled clusters that run Azure IoT Operations. This article shows how to add another Arc-enabled cluster to the observability infrastructure that you created in [Get started: configure observability](howto-configure-observability.md).

## Prerequisites

- Azure IoT Operations installed. For more information, see [Get started: configure observability](howto-configure-observability.md).

## Add an Arc-enabled cluster
To create this setup, run the following command. Specify the two resource IDs for the observability components that were output when you ran the steps in [Install observability components](howto-configure-observability.md#install-observability-components). 

Specify the resource group and name of the new Arc enabled cluster in the `resource-group` and `cluster-name` parameters:

```azurecli
az deployment group create \
      --subscription <cluster-subscription-id> \
      --resource-group <cluster-resource-group> \
      --template-file cluster.bicep \
      --parameters clusterName=<cluster-name> \
                  azureMonitorId=<azure-monitor-resource-id> \
                  logAnalyticsId=<log-analytics-resource-id>
```

If Azure Monitor or Log Analytics is in a different region from your cluster, the previous command produces an error. To resolve the error, pass the extra `azureMonitorLocation` and `logAnalyticsLocation` parameters:

```azurecli
az deployment group create \
      --subscription <cluster-subscription-id> \
      --resource-group <cluster-resource-group> \
      --template-file cluster.bicep \
      --parameters clusterName=<cluster-name> \
                  azureMonitorId=<azure-monitor-resource-id> \
                  logAnalyticsId=<log-analytics-resource-id> \
                  azureMonitorLocation=<azure-monitor-location> \
                  logAnalyticsLocation=<log-analytics-location>
```

To set up Prometheus metrics collection for the new Arc enabled cluster, follow the steps in [Configure Prometheus metrics collection](howto-configure-observability.md#configure-prometheus-metrics-collection).

## Access Grafana dashboards

Navigate to the endpoint for the Grafana instance that you created previously in [Get started: configure observability](howto-configure-observability.md). If you didn't already do so, create the relevant dashboards by going to the [dashboard list](https://github.com/Azure/azure-iot-operations/tree/main/samples/grafana-dashboards). In the dashboards, you see the name of the new Arc-enabled cluster in the **Cluster** selector dropdown. 
