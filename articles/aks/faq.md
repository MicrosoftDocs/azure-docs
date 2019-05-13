---
title: Frequently asked questions for Azure Kubernetes Service (AKS)
description: Find answers to some of the common questions about Azure Kubernetes Service (AKS).
services: container-service
author: iainfoulds
manager: jeconnoc

ms.service: container-service
ms.topic: article
ms.date: 04/25/2019
ms.author: iainfou
---

# Frequently asked questions about Azure Kubernetes Service (AKS)

This article addresses frequent questions about Azure Kubernetes Service (AKS).

## Which Azure regions currently provide AKS?

For a complete list of available regions, see [AKS regions and availability][aks-regions].

## Does AKS support node autoscaling?

Yes, autoscaling is available through the [Kubernetes autoscaler][auto-scaler], as of Kubernetes 1.10. For information on how to configure and use the cluster autoscaler, see [Cluster autoscale on AKS][aks-cluster-autoscale].

## Does AKS support Kubernetes RBAC?

Yes, Kubernetes role-based access control (RBAC) is enabled by default when clusters are created with the Azure CLI. You can enable RBAC for clusters that were created by using the Azure portal or templates.

## Can I deploy AKS into my existing virtual network?

Yes, you can deploy an AKS cluster into an existing virtual network by using the [advanced networking feature][aks-advanced-networking].

## Can I make the Kubernetes API server accessible only within my virtual network?

Not at this time. The Kubernetes API server is exposed as a public fully qualified domain name (FQDN). You can control access to your cluster by using [Kubernetes RBAC and Azure Active Directory (Azure AD)][aks-rbac-aad].

## Are security updates applied to AKS agent nodes?

Yes, Azure follows a nightly schedule to automatically apply security updates to the nodes in your cluster. However, you must reboot nodes as required. You have several options to reboot nodes:

- Manually, through the Azure portal or the Azure CLI.
- By upgrading your AKS cluster. Cluster upgrades automatically [cordon and drain nodes][cordon-drain] and then bring each node back up with the latest Ubuntu image and a new patch version or a minor Kubernetes version. For more information, see [Upgrade an AKS cluster][aks-upgrade].
- By using [Kured](https://github.com/weaveworks/kured), an open-source reboot daemon for Kubernetes. Kured runs as a [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) and monitors each node for the presence of a file that indicates that a reboot is required. Across the cluster, OS reboots are managed by the same [cordon and drain process][cordon-drain] as a cluster upgrade.

For more information about using kured, see [Apply security and kernel updates to nodes in AKS][node-updates-kured].

## Why are two resource groups created with AKS?

Each AKS deployment spans two resource groups:

1. You create the first resource group. This group contains only the Kubernetes service resource. The AKS resource provider automatically creates the second resource group during deployment. An example of the second resource group is *MC_myResourceGroup_myAKSCluster_eastus*. For information on how to specify the name of this second resource group, see the next section.
1. The second resource group, such as *MC_myResourceGroup_myAKSCluster_eastus*, contains all of the infrastructure resources associated with the cluster. These resources include the Kubernetes node VMs, virtual networking, and storage. The purpose of this resource group is to simplify resource cleanup.

If you create resources to use with your AKS cluster, such as storage accounts or reserved public IP addresses, place them in the automatically generated resource group.

## Can I provide my own name for the AKS infrastructure resource group?

Yes. By default, the AKS resource provider automatically creates a secondary resource group (such as *MC_myResourceGroup_myAKSCluster_eastus*) during deployment. To comply with corporate policy, you can provide your own name for this managed cluster (*MC_*) resource group.

To specify your own resource group name, install the [aks-preview][aks-preview-cli] Azure CLI extension version *0.3.2* or later. When you create an AKS cluster by using the [az aks create][az-aks-create] command, use the *--node-resource-group* parameter and specify a name for the resource group. If you [use an Azure Resource Manager template][aks-rm-template] to deploy an AKS cluster, you can define the resource group name by using the *nodeResourceGroup* property.

* The secondary resource group is automatically created by the Azure resource provider in your own subscription.
* You can specify a custom resource group name only when you're creating the cluster.

As you work with the *MC_* resource group, keep in mind that you cannot:

* Specify an existing resource group for the *MC_* group.
* Specify a different subscription for the *MC_* resource group.
* Change the *MC_* resource group name after the cluster has been created.
* Specify names for the managed resources within the *MC_* resource group.
* Modify or delete tags of managed resources within the *MC_* resource group. (See additional information in the next section.)

## Can I modify tags and other properties of the AKS resources in the MC_ resource group?

If you modify or delete Azure-created tags and other resource properties in the *MC_* resource group, you could get unexpected results such as scaling and upgrading errors. AKS allows you to create and modify custom tags. You might want to create or modify custom tags, for example, to assign a business unit or cost center. By modifying the resources under the *MC_* in the AKS cluster, you break the service-level objective (SLO). For more information, see [Does AKS offer a service-level agreement?](#does-aks-offer-a-service-level-agreement)

## What Kubernetes admission controllers does AKS support? Can admission controllers be added or removed?

AKS supports the following [admission controllers][admission-controllers]:

- *NamespaceLifecycle*
- *LimitRanger*
- *ServiceAccount*
- *DefaultStorageClass*
- *DefaultTolerationSeconds*
- *MutatingAdmissionWebhook*
- *ValidatingAdmissionWebhook*
- *ResourceQuota*
- *DenyEscalatingExec*
- *AlwaysPullImages*

Currently, you can't modify the list of admission controllers in AKS.

## Is Azure Key Vault integrated with AKS?

AKS isn't currently natively integrated with Azure Key Vault. However, the [Azure Key Vault FlexVolume for Kubernetes project][keyvault-flexvolume] enables direct integration from Kubernetes pods to Key Vault secrets.

## Can I run Windows Server containers on AKS?

To run Windows Server containers, you need to run nodes that are based on Windows Server. Nodes based on Windows Server aren't currently available in AKS. You can, however, use Virtual Kubelet to schedule Windows containers on Azure Container Instances and manage them as part of your AKS cluster. For more information, see [Use Virtual Kubelet with AKS][virtual-kubelet].

## Does AKS offer a service-level agreement?

In a service-level agreement (SLA), the provider agrees to reimburse the customer for the cost of the service if the published service level isn't met. Because AKS is free, no cost is available to reimburse, so AKS has no formal SLA. However, AKS seeks to maintain availability of at least 99.5 percent for the Kubernetes API server.

## Why can't I set maxPods below 30?

In AKS, you can set the `maxPods` value when you create the cluster by using the Azure
CLI and Azure Resource Manager templates. However, both Kubenet and Azure CNI require a *minimum value* (validated at creation time):

| Networking | Minimum | Maximum |
| -- | :--: | :--: |
| Azure CNI | 30 | 250 |
| Kubenet | 30 | 110 |

Because AKS is a managed service, we deploy and manage add-ons and pods as part of the cluster. In the past, users could define a `maxPods` value lower than the value that the managed pods required to run (for example, 30). AKS now calculates the minimum number of
pods by using this formula: ((maxPods or (maxPods * vm_count)) > managed add-on pods minimum.

Users can't override the minimum `maxPods` validation.

<!-- LINKS - internal -->

[aks-regions]: ./quotas-skus-regions.md#region-availability
[aks-upgrade]: ./upgrade-cluster.md
[aks-cluster-autoscale]: ./autoscaler.md
[virtual-kubelet]: virtual-kubelet.md
[aks-advanced-networking]: ./configure-azure-cni.md
[aks-rbac-aad]: ./azure-ad-integration.md
[node-updates-kured]: node-updates-kured.md
[aks-preview-cli]: /cli/azure/ext/aks-preview/aks
[az-aks-create]: /cli/azure/aks#az-aks-create
[aks-rm-template]: /rest/api/aks/managedclusters/createorupdate#managedcluster

<!-- LINKS - external -->

[auto-scaler]: https://github.com/kubernetes/autoscaler
[cordon-drain]: https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/
[hexadite]: https://github.com/Hexadite/acs-keyvault-agent
[admission-controllers]: https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/
[keyvault-flexvolume]: https://github.com/Azure/kubernetes-keyvault-flexvol
