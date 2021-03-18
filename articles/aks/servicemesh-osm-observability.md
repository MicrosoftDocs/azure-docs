---
title: Enable Metrics and Observability Components for OSM (Preview)
description: Learn how to enable and configure observability compoents for Open Service Mesh (OSM) in Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.date: 3/17/2021
---

## Enable Metrics and Observability Components for OSM (Preview)

Open Service Mesh (OSM) generates detailed metrics for all services communicating within the mesh. These metrics provide insights into the behavior of services in the mesh helping users to troubleshoot, maintain and analyze their applications.

As of today OSM collects metrics directly from the sidecar proxies (Envoy). OSM provides rich metrics for incoming and outgoing traffic for all services in the mesh. With these metrics the user can get information about the overall volume of traffic, errors within traffic and the response time for requests.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

In this article we will outline the steps of collecting OSM KPIs (key performance indicators) utilzing a managed instance of [Prometheus](https://prometheus.io/) to gather the OSM metrics via Azure Monitor [Container Insights](https://docs.microsoft.com/azure/azure-monitor/containers/container-insights-overview). Prometheus is a popular open source metric monitoring solution and is a part of the [Cloud Native Compute Foundation](https://www.cncf.io/). In additoin to collecting metric with Prometheus, we will also utilize [Grafana](https://grafana.com/) dashboards for displaying the collected data. Grafana allows you to query and visualize your metrics.

## Before you begin

The steps detailed in this article assume that you've created an AKS cluster (Kubernetes `1.18` and above, with Kubernetes RBAC enabled) and have established a `kubectl` connection with the cluster. If you need help with any of these items, then see the [AKS quickstart](./kubernetes-walkthrough.md).

## Deploying Azure Monitor Container Insights

The following step enables monitoring of your AKS cluster using Azure CLI. In this example, you are not required to pre-create or specify an existing workspace. This command simplifies the process for you by creating a default workspace in the default resource group of the AKS cluster subscription if one does not already exist in the region. The default workspace created resembles the format of _DefaultWorkspace-\<GUID>-\<Region>_.

[!INCLUDE](../../../includes/servicemesh/osm/osm-observability-note.md)

```azurecli
az aks enable-addons -a monitoring -n MyExistingManagedCluster -g MyExistingManagedClusterRG
```

The output will resemble the following:

```output
provisioningState       : Succeeded
```

## Configure Prometheus metric scraping for OSM

### Grafana

### Jaeger
