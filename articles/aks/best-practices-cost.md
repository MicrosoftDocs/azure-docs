---
title: Optimize Costs in Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Recommendations for optimizing costs in Azure Kubernetes Service (AKS).
ms.topic: conceptual
ms.date: 04/13/2023

---

# Optimize costs in Azure Kubernetes Service (AKS)

Cost optimization is about understanding your different configuration options and recommended best practices to reduce unnecessary expenses and improve operational efficiencies. Before you use this article, you should see the [cost optimization section](/azure/architecture/framework/services/compute/azure-kubernetes-service/azure-kubernetes-service#cost-optimization) in the Azure Well-Architected Framework.

When discussing cost optimization with Azure Kubernetes Service, it's important to distinguish between *cost of cluster resources* and *cost of workload resources*. Cluster resources are a shared responsibility between the cluster admin and their resource provider, while workload resources are the domain of a developer. Azure Kubernetes Service has considerations and recommendations for both of these roles.

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
|**Cluster architecture**: Utilize AKS cluster pre-set configurations. |From the Azure portal, the **cluster preset configurations** option helps offload this initial challenge by providing a set of recommended configurations that are cost-conscious and performant regardless of environment. Mission critical applications may require more sophisticated VM instances, while small development and test clusters may benefit from the lighter-weight, preset options where availability, Azure Monitor, Azure Policy, and other features are turned off by default. The **Dev/Test** and **Cost-optimized** pre-sets help remove unnecessary added costs.|
|**Cluster architecture:** Consider using [ephemeral OS disks](concepts-storage.md#ephemeral-os-disk).|Ephemeral OS disks provide lower read/write latency, along with faster node scaling and cluster upgrades. Containers aren't designed to have local state persisted to the managed OS disk, and this behavior offers limited value to AKS. AKS defaults to an ephemeral OS disk if you chose the right VM series and the OS disk can fit in the VM cache or temporary storage SSD.|
|**Cluster and workload architectures:** Use the [Start and Stop feature](start-stop-cluster.md) in Azure Kubernetes Services (AKS).|The AKS Stop and Start cluster feature allows AKS customers to pause an AKS cluster, saving time and cost. The stop and start feature keeps cluster configurations in place and customers can pick up where they left off without reconfiguring the clusters.|
|**Workload architecture:** Consider using [Azure Spot VMs](spot-node-pool.md) for workloads that can handle interruptions, early terminations, and evictions.|For example, workloads such as batch processing jobs, development and testing environments, and large compute workloads may be good candidates for you to schedule on a spot node pool. Using spot VMs for nodes with your AKS cluster allows you to take advantage of unused capacity in Azure at a significant cost savings.|
|**Cluster architecture:** Enforce [resource quotas](operator-best-practices-scheduler.md) at the namespace level.|Resource quotas provide a way to reserve and limit resources across a development team or project. These quotas are defined on a namespace and can be used to set quotas on compute resources, storage resources, and object counts. When you define resource quotas, all pods created in the namespace must provide limits or requests in their pod specifications.|
|**Cluster architecture:** Sign up for [Azure Reservations](../cost-management-billing/reservations/save-compute-costs-reservations.md). | If you properly planned for capacity, your workload is predictable and exists for an extended period of time, sign up for [Azure Reserved Instances](../virtual-machines/prepay-reserved-vm-instances.md) to further reduce your resource costs.|
|**Cluster architecture:** Use Kubernetes [Resource Quotas](operator-best-practices-scheduler.md#enforce-resource-quotas). | Resource quotas can be used to limit resource consumption for each namespace in your cluster, and by extension resource utilization for the Azure service.|
|**Cluster and workload architectures:** Cost management using monitoring and observability tools. | OpenCost on AKS introduces a new community-driven [specification](https://github.com/opencost/opencost/blob/develop/spec/opencost-specv01.md) and implementation to bring greater visibility into current and historic Kubernetes spend and resource allocation. OpenCost, born out of [Kubecost](https://www.kubecost.com/), is an open-source, vendor-neutral [CNCF sandbox project](https://www.cncf.io/sandbox-projects/) that recently became a [FinOps Certified Solution](https://www.finops.org/partner-certifications/#finops-certified-solution). Customer specific prices are now included using the [Azure Consumption Price Sheet API](/rest/api/consumption/price-sheet), ensuring accurate cost reporting that accounts for consumption and savings plan discounts. For out-of-cluster analysis or to ingest allocation data into an existing BI pipeline, you can export a CSV with daily infrastructure cost breakdown by Kubernetes constructs (namespace, controller, service, pod, job and more) to your Azure Storage Account or local storage with minimal configuration. CSV also includes resource utilization metrics for CPU, GPU, memory, load balancers, and persistent volumes. For in-cluster visualization, OpenCost UI enables real-time cost drill down by Kubernetes constructs. Alternatively, directly query the OpenCost API to access cost allocation data. For more information on Azure specific integration, see [OpenCost docs](https://www.opencost.io/docs).|
|**Cluster architecture:** Improve cluster operations efficiency.|Managing multiple clusters increases operational overhead for engineers. [AKS auto upgrade](auto-upgrade-cluster.md) and [AKS Node Auto-Repair](node-auto-repair.md) helps improve day-2 operations. Learn more about [best practices for AKS Operators](operator-best-practices-cluster-isolation.md).|

## Next steps

- Explore and analyze costs with [Cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md).
- [Azure Advisor recommendations](../advisor/advisor-cost-recommendations.md) for cost can highlight the over-provisioned services and ways to lower cost.