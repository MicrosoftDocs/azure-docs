---
title: Kubernetes Event-driven Autoscaling (KEDA)
description: Simplified application autoscaling with Kubernetes Event-driven Autoscaling (KEDA) add-on.
author: tomkerkhove
ms.topic: article
ms.date: 08/08/2023
ms.author: tomkerkhove
---

# Simplified application autoscaling with Kubernetes Event-driven Autoscaling (KEDA) add-on

Kubernetes Event-driven Autoscaling (KEDA) is a single-purpose and lightweight component that strives to make application autoscaling simple and is a CNCF Graduate project.

It applies event-driven autoscaling to scale your application to meet demand in a sustainable and cost-efficient manner with scale-to-zero.

The KEDA add-on makes it even easier by deploying a managed KEDA installation, providing you with [a rich catalog of Azure KEDA scalers][keda-scalers] that you can scale your applications with on your Azure Kubernetes Services (AKS) cluster.

## Architecture

[KEDA][keda] provides two main components:

- **KEDA operator** allows end-users to scale workloads in/out from 0 to N instances with support for Kubernetes Deployments, Jobs, StatefulSets or any custom resource that defines `/scale` subresource.
- **Metrics server** exposes external metrics to Horizontal Pod Autoscaler (HPA) in Kubernetes for autoscaling purposes such as messages in a Kafka topic, or number of events in an Azure event hub. Due to upstream limitations, KEDA must be the only installed metric adapter.

![Diagram that shows the architecture of K E D A and how it extends Kubernetes instead of re-inventing the wheel.](./media/keda/architecture.png)

Learn more about how KEDA works in the [official KEDA documentation][keda-architecture].

## Installation

KEDA can be added to your Azure Kubernetes Service (AKS) cluster by enabling the KEDA add-on using an [ARM template][keda-arm] or [Azure CLI][keda-cli].

The KEDA add-on provides a fully supported installation of KEDA that is integrated with AKS.

## Capabilities and features

KEDA provides the following capabilities and features:

- Build sustainable and cost-efficient applications with scale-to-zero
- Scale application workloads to meet demand using [a rich catalog of Azure KEDA scalers][keda-scalers]
- Autoscale applications with `ScaledObjects`, such as Deployments, StatefulSets or any custom resource that defines `/scale` subresource
- Autoscale job-like workloads with `ScaledJobs`
- Use production-grade security by decoupling autoscaling authentication from workloads
- Bring-your-own external scaler to use tailor-made autoscaling decisions
- Integrate with [Microsoft Entra Workload ID][workload-identity] for authentication

> [!NOTE]
> If you plan to use workload identity, [enable the workload identity add-on][workload-identity-deploy] before enabling the KEDA add-on.

## Add-on limitations

The KEDA AKS add-on has the following limitations:

* KEDA's [HTTP add-on (preview)][keda-http-add-on] to scale HTTP workloads isn't installed with the extension, but can be deployed separately.
* KEDA's [external scaler for Azure Cosmos DB][keda-cosmos-db-scaler] to scale based on Azure Cosmos DB change feed isn't installed with the extension, but can be deployed separately.
* Only one metric server is allowed in the Kubernetes cluster. Because of that the KEDA add-on should be the only metrics server inside the cluster.
    * Multiple KEDA installations aren't supported

For general KEDA questions, we recommend [visiting the FAQ overview][keda-faq].

[!INCLUDE [Current version callout](./includes/keda/keda-workload-identity-callout.md)]

## Supported Kubernetes and KEDA versions

Your cluster Kubernetes version determines what KEDA version will be installed on your AKS cluster. To see which KEDA version maps to each AKS version, see the **AKS managed add-ons** column of the [Kubernetes component version table](./supported-kubernetes-versions.md#aks-components-breaking-changes-by-version). 

For GA Kubernetes versions, AKS offers full support of the corresponding KEDA minor version in the table. Kubernetes preview versions and the latest KEDA patch are partially covered by customer support on a best-effort basis. As such, these features aren't meant for production use. For more information, see the following support articles:

- [AKS support policies][support-policies]
- [Azure support FAQ][azure-support-faq]

## Next steps

* [Enable the KEDA add-on with an ARM template][keda-arm]
* [Enable the KEDA add-on with the Azure CLI][keda-cli]
* [Troubleshoot KEDA add-on problems][keda-troubleshoot]
* [Autoscale a .NET Core worker processing Azure Service Bus Queue messages][keda-sample]
* [View the upstream KEDA docs][keda]

<!-- LINKS - internal -->
[keda-azure-cli]: keda-deploy-addon-az-cli.md
[keda-cli]: keda-deploy-add-on-cli.md
[keda-arm]: keda-deploy-add-on-arm.md
[keda-troubleshoot]: /troubleshoot/azure/azure-kubernetes/troubleshoot-kubernetes-event-driven-autoscaling-add-on?context=/azure/aks/context/aks-context
[workload-identity]: ./workload-identity-overview.md
[workload-identity-deploy]: ./workload-identity-deploy-cluster.md
[support-policies]: ./support-policies.md

<!-- LINKS - external -->
[keda]: https://keda.sh/
[keda-architecture]: https://keda.sh/docs/latest/concepts/
[keda-faq]: https://keda.sh/docs/latest/faq/
[keda-sample]: https://github.com/kedacore/sample-dotnet-worker-servicebus-queue
[keda-scalers]: https://keda.sh/docs/scalers/
[keda-http-add-on]: https://github.com/kedacore/http-add-on
[keda-cosmos-db-scaler]: https://github.com/kedacore/external-scaler-azure-cosmos-db
[azure-support-faq]: https://azure.microsoft.com/support/legal/faq/