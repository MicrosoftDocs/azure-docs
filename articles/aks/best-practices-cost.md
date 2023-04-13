---
title: Optimize Costs in Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Recommendations for reducing costs in Azure Kubernetes Service (AKS).
ms.topic: conceptual
ms.date: 04/13/2023

---

# Optimize costs in Azure Kubernetes Service (AKS)

Cost optimization is about understanding your different configuration options and recommended best practices to reduce unnecessary expenses and improve operational efficiencies. Before you use this article, you should see the [cost optimization section](/azure/architecture/framework/services/compute/azure-kubernetes-service/azure-kubernetes-service#cost-optimization) in the Azure Well-Architected Framework.

When discussing cost optimization with Azure Kubernetes Service, it's important to distinguish between *cost of cluster resources* and *cost of workload resources*. Cluster resources are a shared responsibility between the cluster admin and their resource provider, while workload resources are the domain of a developer. Azure Kubernetes Service has considerations and recommendations for both of these roles.

In the **design checklist** and **list of recommendations**, call-outs are made to indicate whether each choice is applicable to cluster architecture, workload architecture, or both.

For cluster cost optimization, go to the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) and select **Azure Kubernetes Service** from the available products. You can test different configuration and payment plans in the calculator.

## Design checklist

> [!div class="checklist"]
> - **Cluster architecture:** Use appropriate VM SKU per node pool and reserved instances where long-term capacity is expected.
> - **Cluster and workload architectures:** Use appropriate managed disk tier and size.
> - **Cluster architecture:** Review performance metrics, starting with CPU, memory, storage, and network, to identify cost optimization opportunities by cluster, nodes, and namespace.
> - **Cluster and workload architecture:** Use autoscale features to scale in when workloads are less active.

## Recommendations

Explore the following table of recommendations to optimize your AKS configuration for cost.

| Recommendation | Benefit |
|----------------------------------|-----------|
|**Cluster and workload architectures:** Use the [Start and Stop feature](start-stop-cluster.md) in Azure Kubernetes Services (AKS).|The AKS Stop and Start cluster feature allows AKS customers to pause an AKS cluster, saving time and cost. The stop and start feature keeps cluster configurations in place and customers can pick up where they left off without reconfiguring the clusters.|
|**Workload architecture:** Consider using [Azure Spot VMs](spot-node-pool.md) for workloads that can handle interruptions, early terminations, and evictions.|For example, workloads such as batch processing jobs, development and testing environments, and large compute workloads may be good candidates for you to schedule on a spot node pool. Using spot VMs for nodes with your AKS cluster allows you to take advantage of unused capacity in Azure at a significant cost savings.|
|**Cluster architecture:** Enforce [resource quotas](operator-best-practices-scheduler.md) at the namespace level.|Resource quotas provide a way to reserve and limit resources across a development team or project. These quotas are defined on a namespace and can be used to set quotas on compute resources, storage resources, and object counts. When you define resource quotas, all pods created in the namespace must provide limits or requests in their pod specifications.|
|**Workload architecture:** Use the [Horizontal Pod Autoscaler](concepts-scale.md#horizontal-pod-autoscaler).|Adjust the number of pods in a deployment depending on CPU utilization or other select metrics, which support cluster scale-in operations.|
|**Workload architecture:** Use [Vertical Pod Autoscaler](vertical-pod-autoscaler.md) (preview).|Rightsize your pods and dynamically set [requests and limits](developer-best-practices-resource-management.md#define-pod-resource-requests-and-limits) based on historic usage.|
|**Workload architecture:** Use [Kubernetes Event Driven Autoscaling](keda-about.md) (KEDA).|Scale based on the number of events being processed. Choose from a rich catalogue of 50+ KEDA scalers.|
|**Cluster architecture:** Enable [cluster autoscaler](cluster-autoscaler.md) to automatically reduce the number of agent nodes in response to excess resource capacity. |Automatically scale down the number of nodes in your AKS cluster lets you run an efficient cluster when demand is low, scale up when demand returns.|
|**Cluster architecture:** Configure monitoring of cluster with [Container insights](../azure-monitor/containers/container-insights-overview.md). | Container insights help provides actionable insights into your clusters idle and unallocated resources. Container insights also supports collecting Prometheus metrics and integrates with Azure Managed Grafana to get a holistic view of your application and infrastructure.|
|**Cluster architecture:** Sign up for [Azure Reservations](../cost-management-billing/reservations/save-compute-costs-reservations.md). | If you properly planned for capacity, your workload is predictable and exists for an extended period of time, sign up for [Azure Reserved Instances]() to further reduce your resource costs.|
|**Cluster architecture:** Use Kubernetes [Resource Quotas](operator-best-practices-scheduler.md#enforce-resource-quotas). | Resource quotas can be used to limit resource consumption for each namespace in your cluster, and by extension resource utilization for the Azure service.|

## Next steps

- Explore and analyze costs with [Cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md).
- [Azure Advisor recommendations](../advisor/advisor-cost-recommendations.md) for cost can highlight the over-provisioned services and ways to lower cost.