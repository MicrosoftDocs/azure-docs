---
title: Performance and scaling best practices for large workloads in Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn the best practices for performance and scaling for large workloads in Azure Kubernetes Service (AKS).
ms.topic: conceptual
ms.date: 11/03/2023
---

# Best practices for performance and scaling for large workloads in Azure Kubernetes Service (AKS)

> [!NOTE]
> This article focuses on general best practices for **large workloads**. For best practices specific to **small to medium workloads**, see [Performance and scaling best practices for small to medium workloads in Azure Kubernetes Service (AKS)](./best-practices-performance-scale.md).

As you deploy and maintain clusters in AKS, you can use the following best practices to help you optimize performance and scaling.

Keep in mind that *large* is a relative term. Kubernetes has a multi-dimensional scale envelope, and the scale envelope for your workload depends on the resources you use. For example, a cluster with 100 nodes and thousands of pods or CRDs might be considered large. A 1,000 node cluster with 1,000 pods and various other resources might be considered small from the control plane perspective. The best signal for scale of a Kubernetes control plane is API server HTTP request success rate and latency, as that's a proxy for the amount of load on the control plane.

In this article, you learn about:

> [!div class="checklist"]
>
> * AKS and Kubernetes control plane scalability.
> * Kubernetes Client best practices, including backoff, watches, and pagination.
> * Azure API and platform throttling limits.
> * Feature limitations.
> * Networking and node pool scaling best practices.

## AKS and Kubernetes control plane scalability

In AKS, a *cluster* consists of a set of nodes (physical or virtual machines (VMs)) that run Kubernetes agents and are managed by the Kubernetes control plane hosted by AKS. While AKS optimizes the Kubernetes control plane and its components for scalability and performance, it's still bound by the upstream project limits.

Kubernetes has a multi-dimensional scale envelope with each resource type representing a dimension. Not all resources are alike. For example, *watches* are commonly set on secrets, which result in list calls to the kube-apiserver that add cost and a disproportionately higher load on the control plane compared to resources without watches.

The control plane manages all the resource scaling in the cluster, so the more you scale the cluster within a given dimension, the less you can scale within other dimensions. For example, running hundreds of thousands of pods in an AKS cluster impacts how much pod churn rate (pod mutations per second) the control plane can support.

The size of the envelope is proportional to the size of the Kubernetes control plane. AKS supports two control plane tiers as part of the Base SKU: the Free tier and the Standard tier. For more information, see [Free and Standard pricing tiers for AKS cluster management][free-standard-tier].

> [!IMPORTANT]
> We highly recommend using the Standard tier for production or at-scale workloads. AKS automatically scales up the Kubernetes control plane to support the following scale limits:
>
> * Up to 5,000 nodes per AKS cluster
> * 200,000 pods per AKS cluster (with Azure CNI Overlay)

In most cases, crossing the scale limit threshold results in degraded performance, but doesn't cause the cluster to immediately fail over. To manage load on the Kubernetes control plane, consider scaling in batches of up to 10-20% of the current scale. For example, for a 5,000 node cluster, scale in increments of 500-1,000 nodes. While AKS does autoscale your control plane, it doesn't happen instantaneously.

You can leverage API Priority and Fairness (APF) to throttle specific clients and request types to protect the control plane during high churn and load.

## Kubernetes clients

Kubernetes clients are the applications clients, such as operators or monitoring agents, deployed in the Kubernetes cluster that need to communicate with the kube-api server to perform read or mutate operations. It's important to optimize the behavior of these clients to minimize the load they add to the kube-api server and Kubernetes control plane.

AKS doesn't expose control plane and API server metrics via Prometheus or through platform metrics. However, you can analyze API server traffic and client behavior through Kube Audit logs. For more information, see [Troubleshoot the Kubernetes control plane](/troubleshoot/azure/azure-kubernetes/troubleshoot-apiserver-etcd).

LIST requests can be expensive. When working with lists that might have more than a few thousand small objects or more than a few hundred large objects, you should consider the following guidelines:

* **Consider the number of objects (CRs) you expect to eventually exist** when defining a new resource type (CRD).
* **The load on etcd and API server primarily relies on the number of objects that exist, not the number of objects that are returned**. Even if you use a field selector to filter the list and retrieve only a small number of results, these guidelines still apply. The only exception is retrieval of a single object by `metadata.name`.
* **Avoid repeated LIST calls if possible** if your code needs to maintain an updated list of objects in memory. Instead, consider using the Informer classes provided in most Kubernetes libraries. Informers automatically combine LIST and WATCH functionalities to efficiently maintain an in-memory collection.
* **Consider whether you need strong consistency** if Informers don't meet your needs. Do you need to see the most recent data, up to the exact moment in time you issued the query? If not, set `ResourceVersion=0`. This causes the API server cache to serve your request instead of etcd.
* **If you can't use Informers or the API server cache, read large lists in chunks**.
* **Avoid listing more often than needed**. If you can't use Informers, consider how often your application lists the resources. After you read the last object in a large list, don't immediately re-query the same list. You should wait awhile instead.
* **Consider the number of running instances of your client application**. There's a big difference between having a single controller listing objects vs. having pods on each node doing the same thing. If you plan to have multiple instances of your client application periodically listing large numbers of objects, your solution won't scale to large clusters.

## Azure API and Platform throttling

The load on a cloud application can vary over time based on factors such as the number of active users or the types of actions that users perform. If the processing requirements of the system exceed the capacity of the available resources, the system can become overloaded and suffer from poor performance and failures.

To handle varying load sizes in a cloud application, you can allow the application to use resources up to a specified limit and then throttle them when the limit is reached. On Azure, throttling happens at two levels. Azure Resource Manager (ARM) throttles requests for the subscription and tenant. If the request is under the throttling limits for the subscription and tenant, ARM routes the request to the resource provider. The resource provider then applies throttling limits tailored to its operations. For more information, see [ARM throttling requests](../azure-resource-manager/management/request-limits-and-throttling.md).

### Manage throttling in AKS

Azure API limits are usually defined at a subscription-region combination level. For example, all clients within a subscription in a given region share API limits for a given Azure API, such as Virtual Machine Scale Sets PUT APIs. Every AKS cluster has several AKS-owned clients, such as cloud provider or cluster autoscaler, or customer-owned clients, such as Datadog or self-hosted Prometheus, that call Azure APIs. When running multiple AKS clusters in a subscription within a given region, all the AKS-owned and customer-owned clients within the clusters share a common set of API limits. Therefore, the number of clusters you can deploy in a subscription region is a function of the number of clients deployed, their call patterns, and the overall scale and elasticity of the clusters.

Keeping the above considerations in mind, customers are typically able to deploy between 20-40 small to medium scale clusters per subscription-region. You can maximize your subscription scale using the following best practices:

Always upgrade your Kubernetes clusters to the latest version. Newer versions contain many improvements that address performance and throttling issues. If you're using an upgraded version of Kubernetes and still see throttling due to the actual load or the number of clients in the subscription, you can try the following options:

* **Analyze errors using AKS Diagnose and Solve Problems**: You can use [AKS Diagnose and Solve Problems](./aks-diagnostics.md) to analyze errors, identity the root cause, and get resolution recommendations.
  * **Increase the Cluster Autoscaler scan interval**: If the diagnostic reports show that [Cluster Autoscaler throttling has been detected](/troubleshoot/azure/azure-kubernetes/429-too-many-requests-errors#analyze-and-identify-errors-by-using-aks-diagnose-and-solve-problems), you can [increase the scan interval](./cluster-autoscaler.md#change-the-cluster-autoscaler-settings) to reduce the number of calls to Virtual Machine Scale Sets from the Cluster Autoscaler.
  * **Reconfigure third-party applications to make fewer calls**: If you filter by *user agents* in the ***View request rate and throttle details*** diagnostic and see that [a third-party application, such as a monitoring application, makes a large number of GET requests](/troubleshoot/azure/azure-kubernetes/429-too-many-requests-errors#analyze-and-identify-errors-by-using-aks-diagnose-and-solve-problems), you can change the settings of these applications to reduce the frequency of the GET calls. Make sure the application clients use exponential backoff when calling Azure APIs.
* **Split your clusters into different subscriptions or regions**: If you have a large number of clusters and node pools that use Virtual Machine Scale Sets, you can split them into different subscriptions or regions within the same subscription. Most Azure API limits are shared at the subscription-region level, so you can move or scale your clusters to different subscriptions or regions to get unblocked on Azure API throttling. This option is especially helpful if you expect your clusters to have high activity. There are no generic guidelines for these limits. If you want specific guidance, you can create a support ticket.

## Feature limitations

As you scale your AKS clusters to larger scale points, keep the following feature limitations in mind:

* AKS supports up to a 1,000 node scale in an AKS cluster by default. While AKS doesn't prevent you from scaling further, doing so might result in degraded performance. If you want to scale beyond 1,000 nodes, you can request a limit increase. For more information, see [Best practices for creating and running AKS clusters at scale][run-aks-at-scale].
* [Azure Network Policy Manager (Azure npm)][azure-npm] only supports up to 250 nodes.
* You can't use the Stop and Start feature with clusters that have more than 100 nodes. For more information, see [Stop and start an AKS cluster](./start-stop-cluster.md).

## Networking

As you scale your AKS clusters to larger scale points, keep the following networking best practices in mind:

* Use Managed NAT for cluster egress with at least two public IPs on the NAT gateway. For more information, see [Create a managed NAT gateway for your AKS cluster][managed-nat-gateway].
* Use Azure CNI Overlay to scale up to 200,000 pods and 5,000 nodes per cluster. For more information, see [Configure Azure CNI Overlay networking in AKS][azure-cni-overlay].
* If your application needs direct pod-to-pod communication across clusters, use Azure CNI with dynamic IP allocation and scale up to 50,000 application pods per cluster with one routable IP per pod. For more information, see [Configure Azure CNI networking for dynamic IP allocation in AKS][azure-cni-dynamic-ip].
* When using internal Kubernetes services behind an internal load balancer, we recommend creating an internal load balancer or service below a 750 node scale for optimal scaling performance and load balancer elasticity.
* Azure npm only supports up to 250 nodes. If you want to enforce network policies for larger clusters, consider using [Azure CNI powered by Cilium](./azure-cni-powered-by-cilium.md), which combines the robust control plane of Azure CNI with the Cilium data plane to provide high performance networking and security.

## Node pool scaling

As you scale your AKS clusters to larger scale points, keep the following node pool scaling best practices in mind:

* For system node pools, use the *Standard_D16ds_v5* SKU or an equivalent core/memory VM SKU with ephemeral OS disks to provide sufficient compute resources for kube-system pods.
* Since AKS has a limit of 1,000 nodes per node pool, we recommend creating at least five user node pools to scale up to 5,000 nodes.
* When running at-scale AKS clusters, use the cluster autoscaler whenever possible to ensure dynamic scaling of node pools based on the demand for compute resources. For more information, see [Automatically scale an AKS cluster to meet application demands][cluster-autoscaler].
* If you're scaling beyond 1,000 nodes and are *not* using the cluster autoscaler, we recommend scaling in batches of 500-700 nodes at a time. The scaling operations should have a two-minute to five-minute wait time between scale up operations to prevent Azure API throttling. For more information, see [API management: Caching and throttling policies][throttling-policies].

> [!NOTE]
> You can't use [Azure Network Policy Manager (Azure NPM)][azure-npm] with clusters that have more than 500 nodes.

<!-- LINKS - Internal --->
[run-aks-at-scale]: ./operator-best-practices-run-at-scale.md
[managed-nat-gateway]: ./nat-gateway.md
[azure-cni-dynamic-ip]: ./configure-azure-cni-dynamic-ip-allocation.md
[azure-cni-overlay]: ./azure-cni-overlay.md
[free-standard-tier]: ./free-standard-pricing-tiers.md
[cluster-autoscaler]: cluster-autoscaler.md
[azure-npm]: ../virtual-network/kubernetes-network-policies.md

<!-- LINKS - External -->
[throttling-policies]: https://azure.microsoft.com/blog/api-management-advanced-caching-and-throttling-policies/
