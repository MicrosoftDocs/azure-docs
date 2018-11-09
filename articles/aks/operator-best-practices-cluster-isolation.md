---
title: Operator best practices - Cluster isolation in Azure Kubernetes Services (AKS)
description: Learn the cluster operator best practices for isolation in Azure Kubernetes Service (AKS)
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: conceptual
ms.date: 11/09/2018
ms.author: iainfou
---

# Best practices for cluster isolation in Azure Kubernetes Service (AKS)

As you manage clusters in Azure Kubernetes Service (AKS), there are a few key areas to consider. How you manage your cluster and application deployments can negatively impact the end-user experience of services that you provide. To help you succeed, there are some best practices you can follow as you design and run AKS clusters.

This best practices article focuses on isolation for cluster operators. In this article, you learn how to:

> [!div class="checklist"]
> * Plan for multi-tenant clusters and separation of resources
> * Use logical or physical isolation in your AKS clusters

## Design clusters for multi-tenancy

Kubernetes provides features that let you logically isolate teams and workloads in the same cluster. The goal should be to provide the least number of privileges, scoped to the resources each team needs. A [Namespace][k8s-namespaces] in Kubernetes creates a logical isolation boundary. Additional kubernetes features and considerations for isolation and multi-tenancy include the following areas:

* **Scheduling** includes the use of resource quotas and pod disruption budgets, or more advanced scheduling features like taints and tolerations, node selectors, and node and pod affinity or anti-affinity.
* **Networking** includes the use of network policies to control the flow of traffic in and out of pods.
* **Authentication and authorization** include the user of role-based access control (RBAC) and Azure Active Directory (AD) integration, pod identities, and secrets in Azure Key Vault.
* **Containers include pod security policies, pod security contexts, scanning images and runtimes for vulnerabilities, and App Armor or Seccomp (Secure Computing) to restrict container access to the underlying node.

## Logically isolate clusters

**Best practice guidance** - Use logical isolation to separate teams and projects. You can use logical isolation alongside physical isolation, but try to minimize the number of physical AKS clusters you deploy just to separate teams or applications.

With logical isolation, a single AKS cluster can be used for multiple workloads, teams, or environments. Kubernetes [Namespaces][k8s-namespaces] form the logical isolation boundary for workloads and resources.

![Logical isolation of a Kubernetes cluster in AKS](media/best-practices-cluster-isolation-resource-management/logical-isolation.png)

Logical separation of clusters usually provides a higher pod density than physically isolated clusters. There is less excess compute capacity that sits idle in the cluster. When combined with the Kubernetes cluster autoscaler, you can scale the number of nodes up or down to meet demands. This best practice approach to autoscaling lets you run only the number of nodes required and minimizes costs.

## Physically isolate clusters

**Best practice guidance** - Minimize the use of physical isolation for each separate team or application deployment. Instead, use *logical* isolation, as discussed in the previous section.

A common approach to cluster isolation is to use physically separate AKS clusters. In this isolation model, teams or workloads are assigned their own AKS cluster. This approach often looks like the easiest way to isolate workloads or teams, but adds additional management and financial overhead. You now have to maintain these multiple clusters, are billed for all the individual nodes, and have to individually provide access and assign permissions.

![Physical isolation of individual Kubernetes clusters in AKS](media/best-practices-cluster-isolation-resource-management/physical-isolation.png)

Physically separate clusters usually have a low pod density. As each team or workload has their own AKS cluster, the cluster is often over-provisioned with compute resources, with a small number of pods scheduled on those nodes. Unused capacity on the nodes cannot be used for applications or services in development by other teams. These excess resources contribute to the additional costs in physically separate clusters.

## Next steps

<!-- EXTERNAL LINKS -->

<!-- INTERNAL LINKS -->
[k8s-namespaces]: concepts-clusters-workloads.md#namespaces
