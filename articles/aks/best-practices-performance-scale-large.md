---
title: Performance and scaling best practices for large workloads in Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn the best practices for performance and scaling for large workloads in Azure Kubernetes Service (AKS).
ms.topic: conceptual
ms.date: 11/01/2023
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

## Throttling

The load on a cloud application can vary over time based on factors such as the number of active users or the types of actions that users perform. If the processing requirements of the system exceed the capacity of the available resources, the system can become overloaded and suffer from poor performance and failures.

To handle varying load sizes in a cloud application, you can allow the application to use resources up to a specified limit and then throttle them when the limit is reached. On Azure, throttling happens at two levels. Azure Resource Manager (ARM) throttles requests for the subscription and tenant. If the request is under the throttling limits for the subscription and tenant, ARM routes the request to the resource provider. The resource provider then applies throttling limits tailored to its operations. For more information, see [ARM throttling requests](../azure-resource-manager/management/request-limits-and-throttling.md).

### Manage throttling in AKS

Always upgrade your Kubernetes clusters to the latest version. Newer versions contain many improvements that address performance and throttling issues. If you're using an upgraded version of Kubernetes and still see throttling due to the actual load or the number of clients in the subscription, you can try the following options:

* **Analyze errors using AKS Diagnose and Solve Problems**: You can use [AKS Diagnose and Solve Problems](./aks-diagnostics.md) to analyze errors, identity the root cause, and get resolution recommendations.
  * **Increase the Cluster Autoscaler scan interval**: If the diagnostic reports show that [Cluster Autoscaler throttling has been detected](/troubleshoot/azure/azure-kubernetes/429-too-many-requests-errors#analyze-and-identify-errors-by-using-aks-diagnose-and-solve-problems), you can [increase the scan interval](./cluster-autoscaler.md#change-the-cluster-autoscaler-settings) to reduce the number of calls to Virtual Machine Scale Sets from the Cluster Autoscaler.
  * **Reconfigure third-party applications to make fewer calls**: If you filter by *user agents* in the ***View request rate and throttle details*** diagnostic and see that [a third-party application, such as a monitoring application, makes a large number of GET requests](/troubleshoot/azure/azure-kubernetes/429-too-many-requests-errors#analyze-and-identify-errors-by-using-aks-diagnose-and-solve-problems), you can change the settings of these applications to reduce the frequency of the GET calls. Make sure the application clients use exponential backoff when calling Azure APIs.
* **Split your clusters into different subscriptions or regions**: If you have a large number of clusters and node pools that use Virtual Machine Scale Sets, you can split them into different subscriptions or regions within the same subscription. Most Azure API limits are shared at the subscription-region level, so you can move or scale your clusters to different subscriptions or regions to get unblocked on Azure API throttling. This option is especially helpful if you expect your clusters to have high activity. There are no generic guidelines for these limits. If you want specific guidance, you can create a support ticket.
