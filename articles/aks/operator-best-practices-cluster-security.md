---
title: Operator best practices - Cluster security in Azure Kubernetes Services (AKS)
description: Learn the cluster operator best practices for how to manage cluster security and upgrades in Azure Kubernetes Service (AKS)
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: conceptual
ms.date: 11/12/2018
ms.author: iainfou
---

# Best practices for cluster security and upgrades in Azure Kubernetes Service (AKS)

As you develop and run applications in Azure Kubernetes Service (AKS), there are a few key areas to consider. How you manage your cluster and application deployments can negatively impact the end-user experience of services that you provide. To help you succeed, there are some best practices you can follow as you design and run AKS clusters.

This best practices article focuses on how to secure your AKS cluster. You learn how to:

> [!div class="checklist"]
> *
> *

## Secure endpoints for API server and cluster nodes

**Best practice guidance** - Use Azure Active Directory integration and Kubernetes role-based access control (RBAC) to control access to the API server.

The Kubernetes API server provides a single connection point for requests to perform actions within a cluster. To secure and audit access to the API server, you should limit access and provide the least privileged access permissions required. This approach isn't unique to Kubernetes, but is especially important when the AKS cluster is logically isolated for multi-tenant use.

Azure Active Directory (AD) provides an enterprise-ready identity management solution that can integrate with AKS clusters. As Kubernetes doesn't provide an identity management solution, it's hard to provide a granular way to restrict access to the API server. With Azure AD-integrated clusters in AKS, you can use your existing user and group accounts to authenticate users to the API server.

![Azure Active Directory integration for AKS clusters](media/operator-best-practices-cluster-security/aad-integration.png)

Kubernetes role-based access controls (RBAC) should also be used to secure access to the API server. Kubernetes RBAC and Azure AD-integration can work together to provide the least amount of permissions required to a scoped set of resources, such as a single namespace. Different users or groups in Azure AD can be granted different RBAC roles. These granular permissions let you restrict access to the API server, and provide a clear audit trail of actions performed.

For more information about Azure AD integration and RBAC, see [Best practices for authentication and authorization in AKS][aks-best-practices-identity].

## Keep the cluster and hosts up to date

**Best practice guidance** - Regularly update the Kubernetes version for your clusters. Nodes automatically download and install OS updates and security fixes, but don't automatically reboot if required. Use `kured` to watch for pending reboots, then safely cordon and drain the node to allow the node to reboot and apply the updates.

Kubernetes release new features at a quicker pace than more traditional infrastructure platforms that you may use. Kubernetes updates include new features, and bug or security fixes in the existing code. New features typically move through an *alpha* and then *beta* status before they are generally available and recommended for production use. This release approach should allow you to update Kubernetes without encountering breaking changes or adjusting your deployments and templates.

In AKS, a defined support policy for Kubernetes version encourages you to regularly update your cluster. You can check for what version upgrades are available for your cluster using the [az aks get-upgrades][az-aks-get-upgrades] command, as shown in the following example:

```azurecli-interactive
az aks get-upgrades --resource-group myResourceGroup --name myAKSCluster
```

You can then upgrade your AKS cluster using the [az aks upgrade][az-aks-upgrade] command. The upgrade safely cordons and drains a node one at a time, schedules pods on remaining nodes, and then deploys a new node running the latest OS and Kubernetes versions.

```azurecli
az aks upgrade --resource-group myResourceGroup --name myAKSCluster --kubernetes-version 1.11.3
```

For more information about upgrades in AKS, see [Supported Kubernetes versions in AKS][aks-supported-versions] and [Upgrade an AKS cluster][aks-upgrade].

### Process node reboots using kured

Each evening, AKS nodes apply updates and security patches through their distro update channel. This behavior is configured automatically as the nodes are deployed in an AKS cluster. To minimize disruption, nodes are not automatically rebooted if a security patch or kernel update requires it.

The open-source [kured (KUbernetes REboot Daemon)][kured] project by Weaveworks watches for pending node reboots. When a node applies updates that require a reboot, the node is safely cordoned and drain to schedule the pods on other nodes in the cluster. Once the node is rebooted, Kubernetes resumes scheduling pods. To minimize disruption, only one node at a time is permitted to be rebooted by `kured`.

![The AKS node reboot process using kured](media/operator-best-practices-cluster-security/node-reboot-process.png)

`kured` can integrate with Prometheus to prevent reboots if there are other maintenance events or cluster issues in progress.

For more information about how to handle node reboots, see [Apply security and kernel updates to nodes in AKS][aks-kured].

## Limit credential exposure

Use pod identities
Key Vault with FlexVol

## Next steps

This best practices article focused on how to manage identity and authentication. To implement some of these best practices, see the following articles:

*
*

<!-- EXTERNAL LINKS -->
[kured]: https://github.com/weaveworks/kured

<!-- INTERNAL LINKS -->
[az-aks-get-upgrades]: /cli/azure/aks#az-aks-get-upgrades
[az-aks-upgrade]: /cli/azure/aks#az-aks-upgrade
[aks-supported-versions]: supported-kubernetes-versions.md
[aks-upgrade]: upgrade-cluster.md
[aks-best-practices-identity]: concepts-identity.md
[aks-kured]: node-updates-kured.md
