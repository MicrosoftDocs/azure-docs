---
title: Performance and scaling best practices for large workloads in Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn the best practices for performance and scaling for large workloads in Azure Kubernetes Service (AKS).
ms.topic: conceptual
ms.date: 11/02/2023
---

# Best practices for performance and scaling for large workloads in Azure Kubernetes Service (AKS)

As you deploy and maintain clusters in AKS, you can use the following best practices to help you optimize performance and scaling.

In this article, you learn about:

> [!div class="checklist"]
>
> * Client best practices, including backoff, watches, and pagenations.
> * Feature limitations and cluster limits.
> * Theory considerations for large workloads.
> * Multi-cluster deployment considerations.
> * Throttling and subscription limits.

> [!NOTE]
> This article focuses on best practices for **large workloads**. For best practices for **small to medium workloads**, see [Performance and scaling best practices for small to medium workloads in Azure Kubernetes Service (AKS)](./best-practices-performance-scale.md).

## AKS control plane

In AKS, a *cluster* consists of a set of nodes (physical or virtual machines (VMs)) that run Kubernetes agents and are managed by the control plane. Kubernetes has a multi-dimensional scale envelope with each resource type representing a dimension. Not all resources are alike. For example, *watches* are commonly set on secrets, which result in list calls to the kube-apiserver that add cost and a disproportionately higher load on the control plane compared to resources without watches.

IMAGE

The control plane manages all resource scaling, so the more you scale the cluster within a given dimension, the less you can scale within other dimensions. For example, running hundreds of thousands of pods in an AKS cluster impacts how much pod churn the control plane can support.

The size of the envelope is proportional to the size of the Kubernetes control plane. AKS supports two control plane tiers as part of the Base SKU: the Free tier and the Standard tier. For more information, see [Free and Standard pricing tiers for AKS cluster management](./free-standard-pricing-tiers.md).

> [!IMPORTANT]
> We highly recommend using the Standard tier for production or at-scale workloads. AKS automatically scales up the Kubernetes control plane to support the following scale limits:
>
> * 5,000 nodes per AKS cluster
> * 200,000 pods per AKS cluster (with Azure CNI Overlay)

In most cases, crossing the scale limit threshold results in degraded performance, but doesn't cause the cluster to immediately fail over. To manage load on the Kubernetes control plane, consider scaling in batches of up to 10-20% of the current scale. For example, for a 5,000 node cluster, scale in increments of 500-1,000 nodes. While AKS does autoscale your control plane, it doesn't happen instantaneously. You can leverage API Priority and Fairness (APF) to throttle specific clients and request types to protect the control plane during high churn and load.

## Kube client

LIST requests can be expensive. When working with lists that might have more than a few thousand small objects or more than a few hundred large objects, you should consider the following guidelines:

* **Consider the number of objects (CRs) you expect to eventually exist** when defining a new resource type (CRD).
* **The load on etcd and API Server primarily relies on the number of objects that exist, not the number of objects that are returned**. Even if you use a field selector to filter the list and retrieve only a small number of results, these guidelines still apply. The only exception is retrieval of a single object by `metadata.name`.
* **Avoid repeated LIST calls if possible** if your code needs to maintain an updated list of objects in memory. Instead, consider using the Informer classes provided in most Kubernetes libraries. Informers automatically combine LIST and WATCH functionalities to efficiently maintain an in-memory collection.
* **Consider whether you need strong consistency** if Informers don't meet your needs. Do you need to see the most recent data, up to the exact moment in time you issued the query? If not, set `ResourceVersion=0`. This causes the API Server cache to serve your request instead of etcd.
* **If you can't use Informers or the API Server cache, read large lists in chunks**.
* **Avoid listing more often than needed**. If you can't use Informers, consider how often your application lists the resources. After you read the last object in a large list, don't immediately re-query the same list. You should wait awhile instead.
* **Consider the number of running instances of your client application**. There's a big difference between having a single controller listing objects vs. having pods on each node doing the same thing. If you plan to have multiple instances of your client application periodically listing large numbers of objects, your solution won't scale to large clusters.

## Throttling

The load on a cloud application can vary over time based on factors such as the number of active users or the types of actions that users perform. If the processing requirements of the system exceed the capacity of the available resources, the system can become overloaded and suffer from poor performance and failures.

To handle varying load sizes in a cloud application, you can allow the application to use resources up to a specified limit and then throttle them when the limit is reached. On Azure, throttling happens at two levels. Azure Resource Manager (ARM) throttles requests for the subscription and tenant. If the request is under the throttling limits for the subscription and tenant, ARM routes the request to the resource provider. The resource provider then applies throttling limits tailored to its operations. For more information, see [ARM throttling requests](../azure-resource-manager/management/request-limits-and-throttling.md).

### Manage throttling in AKS

Always upgrade your Kubernetes clusters to the latest version. Newer versions contain many improvements that address performance and throttling issues. If you're using an upgraded version of Kubernetes and still see throttling due to the actual load or the number of clients in the subscription, you can try the following options:

* **Analyze errors using AKS Diagnose and Solve Problems**: You can use [AKS Diagnose and Solve Problems](./aks-diagnostics.md) to analyze errors, identity the root cause, and get resolution recommendations.
  * **Increase the Cluster Autoscaler scan interval**: If the diagnostic reports show that [Cluster Autoscaler throttling has been detected](/troubleshoot/azure/azure-kubernetes/429-too-many-requests-errors#analyze-and-identify-errors-by-using-aks-diagnose-and-solve-problems), you can [increase the scan interval](./cluster-autoscaler.md#change-the-cluster-autoscaler-settings) to reduce the number of calls to Virtual Machine Scale Sets from the Cluster Autoscaler.
  * **Reconfigure third-party applications to make fewer calls**: If you filter by *user agents* in the ***View request rate and throttle details*** diagnostic and see that [a third-party application, such as a monitoring application, makes a large number of GET requests](/troubleshoot/azure/azure-kubernetes/429-too-many-requests-errors#analyze-and-identify-errors-by-using-aks-diagnose-and-solve-problems), you can change the settings of these applications to reduce the frequency of the GET calls. Make sure the application clients use exponential backoff when calling Azure APIs.
* **Split your clusters into different subscriptions or regions**: If you have a large number of clusters and node pools that use Virtual Machine Scale Sets, you can split them into different subscriptions or regions within the same subscription. Most Azure API limits are shared at the subscription-region level, so you can move or scale your clusters to different subscriptions or regions to get unblocked on Azure API throttling. This option is especially helpful if you expect your clusters to have high activity. There are no generic guidelines for these limits. If you want specific guidance, you can create a support ticket.
