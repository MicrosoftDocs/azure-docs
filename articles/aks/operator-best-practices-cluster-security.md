---
title: Operator best practices - Cluster security in Azure Kubernetes Services (AKS)
description: Learn the cluster operator best practices for how to manage cluster security and upgrades in Azure Kubernetes Service (AKS)
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: conceptual
ms.date: 11/26/2018
ms.author: iainfou
---

# Best practices for cluster security and upgrades in Azure Kubernetes Service (AKS)

As you manage clusters in Azure Kubernetes Service (AKS), the security of your workloads and data is a key consideration. Especially when you run multi-tenant clusters using logical isolation, you need to secure access to resources and workloads. To minimize the risk of attack, you also need to make sure you apply the latest Kubernetes and node OS security updates.

This article focuses on how to secure your AKS cluster. You learn how to:

> [!div class="checklist"]
> * Use Azure Active Directory and role-based access controls to secure API server access
> * Upgrade an AKS cluster to the latest Kubernetes version
> * Keep nodes update to date and automatically apply security patches

You can also read the best practices for [container security][best-practices-container-security] and for [pod security][best-practices-pod-security].

## Secure access to the API server and cluster nodes

**Best practice guidance** - Use Azure Active Directory integration and Kubernetes role-based access control (RBAC) to control access to the API server.

The Kubernetes API server provides a single connection point for requests to perform actions within a cluster. To secure and audit access to the API server, you should limit access and provide the least privileged access permissions required. This approach isn't unique to Kubernetes, but is especially important when the AKS cluster is logically isolated for multi-tenant use.

Azure Active Directory (AD) provides an enterprise-ready identity management solution that can integrate with AKS clusters. As Kubernetes doesn't provide an identity management solution, it can otherwise be hard to provide a granular way to restrict access to the API server. With Azure AD-integrated clusters in AKS, you can use your existing user and group accounts to authenticate users to the API server.

![Azure Active Directory integration for AKS clusters](media/operator-best-practices-cluster-security/aad-integration.png)

Kubernetes role-based access controls (RBAC) should also be used to secure access to the API server. Kubernetes RBAC and Azure AD-integration can work together to provide the least amount of permissions required to a scoped set of resources, such as a single namespace. Different users or groups in Azure AD can be granted different RBAC roles. These granular permissions let you restrict access to the API server, and provide a clear audit trail of actions performed.

Use Azure AD *group* membership to bind users to RBAC roles rather than individual *users*. As a user's group membership changes, their access permissions on the AKS cluster would change accordingly. If you bind the user directly to a role, their job function may change and Azure AD group membership update, but permissions on the AKS cluster would not reflect that. This scenario grants more permissions than a user requires.

For more information about Azure AD integration and RBAC, see [Best practices for authentication and authorization in AKS][aks-best-practices-identity].

## Regularly update to the latest version of Kubernetes

**Best practice guidance** - To stay current on new features and bug fixes, regularly upgrade to the Kubernetes version in your AKS cluster.

Kubernetes release new features at a quicker pace than more traditional infrastructure platforms. Kubernetes updates include new features, and bug or security fixes. New features typically move through an *alpha* and then *beta* status before they are generally available and recommended for production use. This release cycle should allow you to update Kubernetes without regularly encountering breaking changes or adjusting your deployments and templates.

In AKS, a defined support policy for Kubernetes version encourages you to regularly update your cluster. You can check for which versions are available for your cluster using the [az aks get-upgrades][az-aks-get-upgrades] command, as shown in the following example:

```azurecli-interactive
az aks get-upgrades --resource-group myResourceGroup --name myAKSCluster
```

You can then upgrade your AKS cluster using the [az aks upgrade][az-aks-upgrade] command. The upgrade process safely cordons and drains one node at a time, schedules pods on remaining nodes, and then deploys a new node running the latest OS and Kubernetes versions.

```azurecli-interactive
az aks upgrade --resource-group myResourceGroup --name myAKSCluster --kubernetes-version 1.11.3
```

For more information about upgrades in AKS, see [Supported Kubernetes versions in AKS][aks-supported-versions] and [Upgrade an AKS cluster][aks-upgrade].

## Process node updates and reboots using kured

**Best practice guidance** - AKS nodes automatically download and install OS updates and security fixes, but don't automatically reboot if required. Use `kured` to watch for pending reboots, then safely cordon and drain the node to allow the node to reboot and apply the updates.

Each evening, AKS nodes apply updates and security patches through their distro update channel. This behavior is configured automatically as the nodes are deployed in an AKS cluster. To minimize disruption, nodes are not automatically rebooted if a security patch or kernel update requires it.

The open-source [kured (KUbernetes REboot Daemon)][kured] project by Weaveworks watches for pending node reboots. When a node applies updates that require a reboot, the node is safely cordoned and drain to schedule the pods on other nodes in the cluster. Once the node is rebooted, Kubernetes resumes scheduling pods on it. To minimize disruption, only one node at a time is permitted to be rebooted by `kured`.

![The AKS node reboot process using kured](media/operator-best-practices-cluster-security/node-reboot-process.png)

`kured` can integrate with Prometheus to prevent reboots if there are other maintenance events or cluster issues in progress. This integration minimizes additional complications by rebooting nodes while you are actively troubleshooting other issues.

For more information about how to handle node reboots, see [Apply security and kernel updates to nodes in AKS][aks-kured].

## Next steps

This article focused on how to secure your AKS cluster. To implement some of these areas, see the following articles:

* [Integrate Azure Active Directory with AKS][aks-aad]
* [Upgrade an AKS cluster to the latest version of Kubernetes][aks-upgrade]
* [Process security updates and node reboots with kured][aks-kured]

<!-- EXTERNAL LINKS -->
[kured]: https://github.com/weaveworks/kured

<!-- INTERNAL LINKS -->
[az-aks-get-upgrades]: /cli/azure/aks#az-aks-get-upgrades
[az-aks-upgrade]: /cli/azure/aks#az-aks-upgrade
[aks-supported-versions]: supported-kubernetes-versions.md
[aks-upgrade]: upgrade-cluster.md
[aks-best-practices-identity]: concepts-identity.md
[aks-kured]: node-updates-kured.md
[aks-aad]: aad-integration.md
[best-practices-container-security]: operator-best-practices-container-security.md
[best-practices-pod-security]: developer-best-practices-pod-security.md
