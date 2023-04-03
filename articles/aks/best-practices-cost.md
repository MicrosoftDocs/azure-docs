---
title: Optimize Costs in Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Recommendations for reducing costs in Azure Kubernetes Service (AKS).
ms.topic: conceptual
ms.date: 04/03/2023

---

# Optimize costs in Azure Kubernetes Service (AKS)

Cost optimization is about understanding your different configuration options and recommended best practices to reduce unnecessary expenses and improve operational efficiencies. Before you follow the guidance in this article, we recommend you review the following resources:

* [Cost optimization design principles](/azure/architecture/framework/cost/principles).
* [How pricing and cost management work in Azure Kubernetes Service (AKS) compared to Amazon Elastic Kubernetes Service (Amazon EKS)](/azure/architecture/aws-professional/eks-to-aks/cost-management).
* If you are running AKS on-premises or at the edge, [Azure Hybrid Benefit](/windows-server/get-started/azure-hybrid-benefit) can also be used to further reduce costs when running containerized applications in those scenarios.

When discussing cost optimization with Azure Kubernetes Service, it's important to distinguish between *cost of cluster resources* and *cost of workload resources*. Cluster resources are a shared responsibility between the cluster admin and their resource provider, while workload resources are the domain of a developer. Azure Kubernetes Service has considerations and recommendations for both of these roles.

In the **design checklist** and **list of recommendations**, call-outs are made to indicate whether each choice is applicable to cluster architecture, workload architecture, or both.

For cluster cost optimization, go to the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) and select **Azure Kubernetes Service** from the available products. You can test different configuration and payment plans in the calculator.

### Design checklist

> [!div class="checklist"]
> - **Cluster architecture:** Use appropriate VM SKU per node pool and reserved instances where long-term capacity is expected.
> - **Cluster and workload architectures:** Use appropriate managed disk tier and size.
> - **Cluster architecture:** Review performance metrics, starting with CPU, memory, storage, and network, to identify cost optimization opportunities by cluster, nodes, and namespace.
> - **Cluster architecture:** Use cluster autoscaler to scale in when workloads are less active.

### Recommendations

Explore the following table of recommendations to optimize your AKS configuration for cost.

| Recommendation | Benefit |
|----------------------------------|-----------|
|**Cluster and workload architectures:** Align SKU selection and managed disk size with workload requirements.|Matching your selection to your workload demands ensures you don't pay for unneeded resources.|
|**Cluster and workload architectures:** Use the [Start and Stop feature](/azure/aks/start-stop-cluster?tabs=azure-cli) in Azure Kubernetes Services (AKS).|The AKS Stop and Start cluster feature allows AKS customers to pause an AKS cluster, saving time and cost. The stop and start feature keeps cluster configurations in place and customers can pick up where they left off without reconfiguring the clusters.|
|**Cluster architecture:** Enable [cluster autoscaler](/azure/aks/cluster-autoscaler) to automatically reduce the number of agent nodes in response to excess resource capacity. |Automatically scale down the number of nodes in your AKS cluster lets you run an efficient cluster when demand is low, scale up when demand returns.|
|**Workload architecture:** Consider using [Azure Spot VMs](/azure/aks/spot-node-pool) for workloads that can handle interruptions, early terminations, and evictions.|For example, workloads such as batch processing jobs, development and testing environments, and large compute workloads may be good candidates for you to schedule on a spot node pool. Using spot VMs for nodes with your AKS cluster allows you to take advantage of unused capacity in Azure at a significant cost savings.|
|**Cluster architecture:** Enforce [resource quotas](/azure/aks/operator-best-practices-scheduler) at the namespace level.|Resource quotas provide a way to reserve and limit resources across a development team or project. These quotas are defined on a namespace and can be used to set quotas on compute resources, storage resources, and object counts. When you define resource quotas, all pods created in the namespace must provide limits or requests in their pod specifications.|
|**Workload architecture:** Use the [Horizontal pod autoscaler](/azure/aks/concepts-scale#horizontal-pod-autoscaler).|Adjust the number of pods in a deployment depending on CPU utilization or other select metrics, which support cluster scale-in operations.|
|**Cluster architecture:** Configure monitoring of cluster with [Container insights](/azure/azure-monitor/containers/container-insights-overview). | Container insights help provides actionable insights into your clusters idle and unallocated resources.|
|**Cluster architecture:** Select the appropriate region. |Due to many factors, cost of resources varies per region in Azure. Evaluate the cost, latency, and compliance requirements to ensure you are running your workload cost-effectively and it doesn't affect your end-users or create extra networking charges.|
|**Cluster architecture:** Sign up for [Azure Reservations](/azure/cost-management-billing/reservations/save-compute-costs-reservations). | If you properly planned for capacity, your workload is predictable and exists for an extended period of time, sign up for [Azure Reserved Instances]() to further reduce your resource costs.|
|**Workload architecture:** Maintain small and optimized images.|Streamlining your images helps reduce costs since new nodes need to download these images. Build images that allows the container start as soon as possible to help avoid user request failures or timeouts while the application is starting up, potentially leading to overprovisioning.|
|**Cluster architecture:** Use Kubernetes [Resource Quotas](/azure/aks/operator-best-practices-scheduler#enforce-resource-quotas). | Resource quotas can be used to limit resource consumption for each namespace in your cluster, and by extension resource utilization for the Azure service.|

For more suggestions, see [Principles of the cost optimization pillar](/azure/architecture/framework/cost/overview).

## Next steps
