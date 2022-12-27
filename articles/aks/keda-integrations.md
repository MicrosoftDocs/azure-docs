---
title: Integrations with Kubernetes Event-driven Autoscaling (KEDA) on Azure Kubernetes Service (AKS) (Preview)
description: Integrations with Kubernetes Event-driven Autoscaling (KEDA) on Azure Kubernetes Service (AKS) (Preview).
services: container-service
author: tomkerkhove
ms.topic: article
ms.date: 05/24/2022
ms.author: tomkerkhove
---

# Integrations with Kubernetes Event-driven Autoscaling (KEDA) on Azure Kubernetes Service (AKS) (Preview)

The Kubernetes Event-driven Autoscaling (KEDA) add-on integrates with features provided by Azure and open source projects.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

> [!IMPORTANT]
> Integrations with open source projects are not covered by the [AKS support policy][aks-support-policy].

## Observe your autoscaling with Kubernetes events

KEDA automatically emits Kubernetes events allowing customers to operate their application autoscaling.

To learn about the available metrics, we recommend reading the [KEDA documentation][keda-event-docs].

## Scalers for Azure services

KEDA can integrate with various tools and services through [a rich catalog of 50+ KEDA scalers][keda-scalers]. It supports leading cloud platforms (such as Azure) and open-source technologies such as Redis and Kafka.

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

Next to the built-in scalers, you can install external scalers yourself to autoscale on other Azure services:

- [Azure Cosmos DB (Change feed)](https://github.com/kedacore/external-scaler-azure-cosmos-db)

However, these external scalers aren't supported as part of the add-on and rely on community support.

## Next steps

* [Enable the KEDA add-on with an ARM template][keda-arm]
* [Enable the KEDA add-on with the Azure CLI][keda-cli]
* [Troubleshoot KEDA add-on problems][keda-troubleshoot]
* [Autoscale a .NET Core worker processing Azure Service Bus Queue message][keda-sample]

<!-- LINKS - internal -->
[aks-support-policy]: support-policies.md
[keda-cli]: keda-deploy-add-on-cli.md
[keda-arm]: keda-deploy-add-on-arm.md
[keda-troubleshoot]: /troubleshoot/azure/azure-kubernetes/troubleshoot-kubernetes-event-driven-autoscaling-add-on?context=/azure/aks/context/aks-context

<!-- LINKS - external -->
[keda-scalers]: https://keda.sh/docs/latest/scalers/
[keda-event-docs]: https://keda.sh/docs/latest/operate/events/
[keda-sample]: https://github.com/kedacore/sample-dotnet-worker-servicebus-queue
