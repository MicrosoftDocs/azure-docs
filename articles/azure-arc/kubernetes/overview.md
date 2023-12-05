---
title: "Overview of Azure Arc-enabled Kubernetes"
ms.custom: event-tier1-build-2022
ms.date: 08/08/2023
ms.topic: overview
description: "Azure Arc-enabled Kubernetes allows you to attach Kubernetes clusters running anywhere so that you can manage and configure them in Azure."
---

# What is Azure Arc-enabled Kubernetes?

Azure Arc-enabled Kubernetes allows you to attach Kubernetes clusters running anywhere so that you can manage and configure them in Azure. By managing all of your Kubernetes resources in a single control plane, you can enable a more consistent development and operation experience to run cloud-native apps anywhere and on any Kubernetes platform.

When the [Azure Arc agents are deployed to the cluster](quickstart-connect-cluster.md), an outbound connection to Azure is initiated, using industry-standard SSL to secure data in transit.

Once clusters are connected to Azure, they're represented as their own resources in Azure Resource Manager, and they can be organized using resource groups and tagging.

## Supported Kubernetes distributions

Azure Arc-enabled Kubernetes works with any Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters. This includes clusters running on other public cloud providers (such as GCP or AWS) and clusters running on your on-premises data center (such as VMware vSphere or Azure Stack HCI).

The Azure Arc team has worked with key industry partners to [validate conformance of their Kubernetes distributions with Azure Arc-enabled Kubernetes](./validation-program.md).

## Scenarios and enhanced functionality

Once your Kubernetes clusters are connected to Azure, at scale you can:

* View all [connected Kubernetes clusters](quickstart-connect-cluster.md) running outside of Azure for inventory, grouping, and tagging, along with Azure Kubernetes Service (AKS) clusters.

* Configure clusters and deploy applications using [GitOps-based configuration management](tutorial-use-gitops-connected-cluster.md).

* View and monitor your clusters using [Azure Monitor for containers](../../azure-monitor/containers/container-insights-enable-arc-enabled-clusters.md?toc=/azure/azure-arc/kubernetes/toc.json).

* Enforce threat protection using [Microsoft Defender for Kubernetes](../../defender-for-cloud/defender-for-kubernetes-azure-arc.md?toc=/azure/azure-arc/kubernetes/toc.json).

* Ensure governance through applying policies with [Azure Policy for Kubernetes](../../governance/policy/concepts/policy-for-kubernetes.md?toc=/azure/azure-arc/kubernetes/toc.json).

* Grant access and [connect](cluster-connect.md) to your Kubernetes clusters from anywhere, and manage access by using [Azure role-based access control (RBAC)](azure-rbac.md) on your cluster.

* Deploy machine learning workloads using [Azure Machine Learning for Kubernetes clusters](../../machine-learning/how-to-attach-kubernetes-anywhere.md?toc=/azure/azure-arc/kubernetes/toc.json).

* Deploy services that allow you to take advantage of specific hardware, comply with data residency requirements, or enable new scenarios. Examples of services include:

  * [Azure Arc-enabled data services](../data/overview.md)
  * [Azure Machine Learning for Kubernetes clusters](../../machine-learning/how-to-attach-kubernetes-anywhere.md?toc=/azure/azure-arc/kubernetes/toc.json)
  * [Event Grid on Kubernetes](../../event-grid/kubernetes/overview.md)
  * [App Services on Azure Arc](../../app-service/overview-arc-integration.md)
  * [Open Service Mesh](tutorial-arc-enabled-open-service-mesh.md)

[!INCLUDE [azure-lighthouse-supported-service](../../../includes/azure-lighthouse-supported-service.md)]

## Next steps

* Learn about best practices and design patterns through the [Cloud Adoption Framework for hybrid and multicloud](/azure/cloud-adoption-framework/scenarios/hybrid/arc-enabled-kubernetes/eslz-arc-kubernetes-identity-access-management).
* Try out Arc-enabled Kubernetes without provisioning a full environment by using the [Azure Arc Jumpstart](https://azurearcjumpstart.com/azure_arc_jumpstart/azure_arc_k8s).
* [Connect an existing Kubernetes cluster to Azure Arc](quickstart-connect-cluster.md).
