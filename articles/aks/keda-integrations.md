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

## Scalers for Azure services

KEDA can integrate with a variety of tools and services through the [a rich catalog of 40+ KEDA scalers][keda-scalers] including leading cloud platforms (such as Azure) and open-source technologies (such as Redis and Kafka).

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
