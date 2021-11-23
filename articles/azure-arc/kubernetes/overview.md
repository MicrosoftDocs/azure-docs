---
title: "Overview of Azure Arc-enabled Kubernetes"
services: azure-arc
ms.service: azure-arc
author: shashankbarsin
ms.author: shasb
ms.date: 11/23/2021
ms.topic: overview
description: "This article provides an overview of Azure Arc-enabled Kubernetes."
keywords: "Kubernetes, Arc, Azure, containers"
---

# What is Azure Arc-enabled Kubernetes?

With Azure Arc-enabled Kubernetes, you can attach and configure Kubernetes clusters running anywhere. For example, you can connect your clusters running on other public cloud providers (GCP, AWS) or clusters running on your on-premise data center (on VMware vSphere, Azure Stack HCI). When you connect a Kubernetes cluster to Azure Arc, it will:
* Get an Azure Resource Manager representation with a unique ID.
* Be placed in an Azure subscription and resource group.
* Receive tags just like any other Azure resource.

Azure Arc-enabled Kubernetes supports industry-standard SSL to secure data in transit. For the connected clusters, data at rest is stored encrypted in an Azure Cosmos DB database to ensure data confidentiality.

Azure Arc-enabled Kubernetes supports the following scenarios for the connected clusters: 

* [Connect Kubernetes](quickstart-connect-cluster.md) running outside of Azure for inventory, grouping, and tagging.

* Deploy applications and apply configuration using [GitOps-based configuration management](tutorial-use-gitops-connected-cluster.md). 

* View and monitor your clusters using [Azure Monitor for containers](../../azure-monitor/containers/container-insights-enable-arc-enabled-clusters.md?toc=/azure/azure-arc/kubernetes/toc.json).

* Enforce threat protection using [Microsoft Defender for Kubernetes](../../defender-for-cloud/defender-for-kubernetes-azure-arc.md?toc=/azure/azure-arc/kubernetes/toc.json).

* Apply policy definitions using [Azure Policy for Kubernetes](../../governance/policy/concepts/policy-for-kubernetes.md?toc=/azure/azure-arc/kubernetes/toc.json).

* Use [Azure Active Directory for authentication and authorization checks](azure-rbac.md) on your cluster.

* Securely access your Kubernetes cluster from anywhere without opening inbound port on firewall using [Cluster Connect](cluster-connect.md).

* Deploy [Open Service Mesh](tutorial-arc-enabled-open-service-mesh.md) on top of your cluster for observability and policy enforcement on service-to-service interactions

* Deploy machine learning workloads using [Azure Machine Learning for Kubernetes clusters](../../machine-learning/how-to-attach-arc-kubernetes.md?toc=/azure/azure-arc/kubernetes/toc.json).

* Create [custom locations](./custom-locations.md) as target locations for deploying Azure Arc-enabled Data Services (SQL Managed Instances, PostgreSQL Hyperscale.), [App Services on Azure Arc](../../app-service/overview-arc-integration.md) (including web, function, and logic apps) and [Event Grid on Kubernetes](../../event-grid/kubernetes/overview.md).

[!INCLUDE [azure-lighthouse-supported-service](../../../includes/azure-lighthouse-supported-service.md)]

## Supported Kubernetes distributions

Azure Arc-enabled Kubernetes works with any Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters. The Azure Arc team has worked with [key industry partners to validate conformance](./validation-program.md) of their Kubernetes distributions with Azure Arc-enabled Kubernetes.

## Next steps

Learn how to connect a cluster to Azure Arc.
> [!div class="nextstepaction"]
> [Connect a cluster to Azure Arc](./quickstart-connect-cluster.md)
