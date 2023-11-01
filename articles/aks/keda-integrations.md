---
title: Integrations with Kubernetes Event-driven Autoscaling (KEDA) on Azure Kubernetes Service (AKS)
description: Integrations with Kubernetes Event-driven Autoscaling (KEDA) on Azure Kubernetes Service (AKS).
author: tomkerkhove
ms.topic: article
ms.date: 09/27/2023
ms.author: tomkerkhove
---

# Integrations with Kubernetes Event-driven Autoscaling (KEDA) on Azure Kubernetes Service (AKS)

The Kubernetes Event-driven Autoscaling (KEDA) add-on for AKS integrates with features provided by Azure and open-source projects.

> [!IMPORTANT]
> The [AKS support policy][aks-support-policy] doesn't cover integrations with open-source projects.

## Observe your autoscaling with Kubernetes events

KEDA automatically emits Kubernetes events allowing customers to operate their application autoscaling.

To learn about the available metrics, we recommend reading the [KEDA documentation][keda-event-docs].

## Scalers for Azure services

<<<<<<< HEAD
KEDA can integrate with various tools and services through [a rich catalog of 62+ KEDA scalers][keda-scalers]. It supports leading cloud platforms (such as Azure) and open-source technologies such as Redis and Kafka.
=======
KEDA integrates with various tools and services through [a rich catalog of 50+ KEDA scalers][keda-scalers] and supports leading cloud platforms and open-source technologies.
>>>>>>> 58714361164d6dc3abe1ce6a0ed3deb4d3bd23c6

KEDA leverages the following scalers for Azure services:

- [Azure Application Insights](https://keda.sh/docs/latest/scalers/azure-app-insights/)
- [Azure Blob Storage](https://keda.sh/docs/latest/scalers/azure-storage-blob/)
- [Azure Data Explorer](https://keda.sh/docs/latest/scalers/azure-data-explorer/)
- [Azure Event Hubs](https://keda.sh/docs/latest/scalers/azure-event-hub/)
- [Azure Log Analytics](https://keda.sh/docs/latest/scalers/azure-log-analytics/)
- [Azure Monitor](https://keda.sh/docs/latest/scalers/azure-monitor/)
- [Azure Pipelines](https://keda.sh/docs/latest/scalers/azure-pipelines/)
- [Azure Service Bus](https://keda.sh/docs/latest/scalers/azure-service-bus/)
- [Azure Storage Queue](https://keda.sh/docs/latest/scalers/azure-storage-queue/)

<<<<<<< HEAD
As of KEDA version `2.10`, the [Prometheus scaler][prometheus-scaler] supports Azure managed service for Prometheus.

Next to the built-in scalers, you can install external scalers yourself to autoscale on other Azure services:
=======
You can also install external scalers to autoscale on other Azure services:
>>>>>>> 58714361164d6dc3abe1ce6a0ed3deb4d3bd23c6

- [Azure Cosmos DB (Change feed)](https://github.com/kedacore/external-scaler-azure-cosmos-db)

These external scalers *aren't supported as part of the add-on* and rely on community support.

## Next steps

<<<<<<< HEAD
* [Enable the KEDA add-on with an ARM template][keda-arm]
* [Enable the KEDA add-on with the Azure CLI][keda-cli]
* [Troubleshoot KEDA add-on problems][keda-troubleshoot]
* [Autoscale a .NET Core worker processing Azure Service Bus Queue message][keda-sample]
* [View the upstream KEDA docs][keda]
=======
- [Enable the KEDA add-on with an ARM template][keda-arm]
- [Enable the KEDA add-on with the Azure CLI][keda-cli]
- [Troubleshoot KEDA add-on problems][keda-troubleshoot]
- [Autoscale a .NET Core worker processing Azure Service Bus Queue message][keda-sample]
>>>>>>> 58714361164d6dc3abe1ce6a0ed3deb4d3bd23c6

<!-- LINKS - internal -->
[aks-support-policy]: support-policies.md
[keda-cli]: keda-deploy-add-on-cli.md
[keda-arm]: keda-deploy-add-on-arm.md
[keda-troubleshoot]: /troubleshoot/azure/azure-kubernetes/troubleshoot-kubernetes-event-driven-autoscaling-add-on?context=/azure/aks/context/aks-context

<!-- LINKS - external -->
[keda-scalers]: https://keda.sh/docs/latest/scalers/
[keda-event-docs]: https://keda.sh/docs/latest/operate/events/
[keda-sample]: https://github.com/kedacore/sample-dotnet-worker-servicebus-queue
[prometheus-scaler]: https://keda.sh/docs/2.11/scalers/prometheus/
