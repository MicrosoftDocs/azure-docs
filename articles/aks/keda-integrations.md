---
title: Integrations with Kubernetes Event-driven Autoscaling (KEDA) on Azure Kubernetes Service (AKS) (Preview)
description: Integrations with Kubernetes Event-driven Autoscaling (KEDA) on Azure Kubernetes Service (AKS) (Preview).
services: container-service
author: tomkerkhove
ms.topic: article
ms.date: 05/24/2021
ms.author: tomkerkhove
---

# Integrations with Kubernetes Event-driven Autoscaling (KEDA) on Azure Kubernetes Service (AKS) (Preview)

The Kubernetes Event-driven Autoscaling (KEDA) add-on integrates with features provided by Azure as well as open source projects.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

> [!IMPORTANT]
> Integrations with open source projects are not covered by the [AKS support policy][aks-support-policy].

## Autoscaling observability

Observability of autoscaling allows you to view the metrics of your autoscaling landscape and its health. With KEDA, you can use [Prometheus and Grafana][osm-metrics] for autoscaling observability, but those integrations are not covered by the [AKS support policy][aks-support-policy].

You can also integrate the Prometheus metrics with [Azure Monitor][azure-monitor] to leverage [KEDA's built-in metrics](keda-metrics).

### Scraping KEDA metrics with Azure Monitor Container Insights

Before you can enable metrics on your mesh to integrate with Azure Monitor:

* Enable Container insights on your cluster
* Enable the KEDA add-on for your AKS cluster

Create a Configmap in the `kube-system` namespace that enables Azure Monitor to monitor KEDA. For example, create a `keda-metrics.yaml` with the following to monitor the `myappnamespace`:

```yaml
kind: ConfigMap
apiVersion: v1
data:
  schema-version: v1
  config-version: ver1
  keda-metric-collection-configuration: |-
    # KEDA metric collection settings
    [keda_metric_collection_configuration]
      [keda_metric_collection_configuration.settings]
          interval = "1m"  ## Valid time units are s, m, h.
          kubernetes_services = ["http://metrics-server.kube-system:9022/metrics"]
metadata:
  name: container-azm-ms-kedaconfig
  namespace: kube-system
```

Apply that ConfigMap using `kubectl apply`.

```console
kubectl apply -f keda-metrics-configmap.yaml
```

To access your metrics from the Azure portal, select your AKS cluster, then select *Logs* under *Monitoring*. From the *Monitoring* section, query the `InsightsMetrics` table to view metrics in the enabled namespaces. 

For example, the following query shows the *keda* metrics.

```sh
InsightsMetrics
| where Name contains "keda"
```

## Scalers for Azure services

KEDA can integrate with a variety of tools and services through the [a rich catalog of 40+ KEDA scalers][keda-scalers] such as Azure, AWS, GCP, Redis, Kafka and more.

It leverages the following scalers for Azure services:

- [Azure Application Insights](https://keda.sh/docs/latest/scalers/azure-app-insights/)
- [Azure Blob Storage](https://keda.sh/docs/latest/scalers/azure-storage-blob/)
- [Azure Data Explorer](https://keda.sh/docs/latest/scalers/azure-data-explorer/)
- [Azure Event Hubs](https://keda.sh/docs/latest/scalers/azure-event-hub/)
- [Azure Log Analytics](https://keda.sh/docs/latest/scalers/azure-log-analytics/)
- [Azure Monitor](https://keda.sh/docs/latest/scalers/azure-monitor/)
- [Azure Pipelines](https://keda.sh/docs/latest/scalers/azure-pipelines/)
- [Azure Service Bus](https://keda.sh/docs/latest/scalers/azure-service-bus/)
- [Azure Storage Queue](https://keda.sh/docs/latest/scalers/azure-storage-queue/)

<!-- LINKS - internal -->
[aks-support-policy]: support-policies.md
[azure-monitor]: ../azure-monitor/overview.md
[azure-monitor-container-insights]: ../azure-monitor/containers/container-insights-onboard.md

<!-- LINKS - external -->
[keda-scalers]: https://keda.sh/docs/scalers/
[keda-metrics]: https://keda.sh/docs/latest/operate/prometheus/
