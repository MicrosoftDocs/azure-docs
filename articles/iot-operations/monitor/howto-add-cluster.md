---
title: Add cluster
titleSuffix: Azure IoT Operations
description: Add Arc enabled cluster to previously setup Observabilty infrastructure.
author: timlt
ms.author: timlt
ms.topic: how-to
ms.date: 02/04/2024

# CustomerIntent: As an IT admin or operator, I want to be able to monitor and visualize data
# on the health of my industrial assets and edge environment.
---

# Add Arc enabled cluster to previously setup Observability infrastructure

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

## Add another Arc Enabled Cluster

The observability resources that you configured using the Quickstart can be shared across mutliple Arc Enabled Clusters running AIO. 

To get this setup, run the following command. Specify the resource IDs for the observability components that were output from the quickstart for the `azureMonitorId` and `logAnalyticsId` parameters. Specify the resource group and name of the new Arc enabled cluster in the `resource-group` and `cluster-name` parameters:

```azurecli
az deployment group create \
      --subscription <cluster-subscription-id> \
      --resource-group <cluster-resource-group> \
      --template-file cluster.bicep \
      --parameters clusterName=<cluster-name> \
                  azureMonitorId=<azure-monitor-resource-id> \
                  logAnalyticsId=<log-analytics-resource-id>
```

If your Azure Monitor or Log Analytics are in a different region from your cluster, the previous command produces an error. To resolve the error, pass the extra `azureMonitorLocation` and `logAnalyticsLocation` parameters:

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

Next, setup Prometheus metrics collection for the new Arc enabled cluster, using the steps in the TODO: Link to the configure prometheus section

## Access Grafana dashboards

Navigate to the endpoint for the Grafana instance that you created previously in the quickstart deployment. If you didn't already do so, create the relevant dashboards by going to the [dashboard list](https://github.com/Azure/azure-iot-operations/tree/main/samples/grafana-dashboards). In the dashboards, you will see the name of the new Arc enabled cluster in the Cluster selector dropdown. 
