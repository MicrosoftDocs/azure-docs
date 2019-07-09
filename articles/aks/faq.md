---
title: Frequently asked questions for Azure Kubernetes Service (AKS)
description: Find answers to some of the common questions about Azure Kubernetes Service (AKS).
services: container-service
author: mlearned
manager: jeconnoc

ms.service: container-service
ms.topic: article
ms.date: 07/08/2019
ms.author: mlearned
---

# Frequently asked questions about Azure Kubernetes Service (AKS)

This article addresses frequent questions about Azure Kubernetes Service (AKS).

## Which Azure regions currently provide AKS?

For a complete list of available regions, see [AKS regions and availability][aks-regions].

## Does AKS support node autoscaling?

Yes, the ability to automatically scale agent nodes horizontally in AKS is currently available in preview. See [Automatically scale a cluster to meet application demands in AKS][aks-cluster-autoscaler] for instructions. AKS autoscaling is based on the [Kubernetes autoscaler][auto-scaler].

## Can I deploy AKS into my existing virtual network?

Yes, you can deploy an AKS cluster into an existing virtual network by using the [advanced networking feature][aks-advanced-networking].

## Can I limit who has access to the Kubernetes API server?

Yes, you can limit access to the Kubernetes API server using [API Server Authorized IP Ranges][api-server-authorized-ip-ranges], which is currently in preview.

## Can I make the Kubernetes API server accessible only within my virtual network?

Not at this time, but this is planned. You can track progress on the [AKS GitHub repo][private-clusters-github-issue].

## Can I have different VM sizes in a single cluster?

Yes, you can use different virtual machine sizes in your AKS cluster by creating [multiple node pools][multi-node-pools], which is currently in preview.

## Are security updates applied to AKS agent nodes?

Azure automatically applies security patches to the Linux nodes in your cluster on a nightly schedule. However, you are responsible for ensuring that those Linux nodes are rebooted as required. You have several options for rebooting nodes:

- Manually, through the Azure portal or the Azure CLI.
- By upgrading your AKS cluster. The cluster upgrades [cordon and drain nodes][cordon-drain] automatically and then bring a new node online with the latest Ubuntu image and a new patch version or a minor Kubernetes version. For more information, see [Upgrade an AKS cluster][aks-upgrade].
- By using [Kured](https://github.com/weaveworks/kured), an open-source reboot daemon for Kubernetes. Kured runs as a [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) and monitors each node for the presence of a file that indicates that a reboot is required. Across the cluster, OS reboots are managed by the same [cordon and drain process][cordon-drain] as a cluster upgrade.

For more information about using kured, see [Apply security and kernel updates to nodes in AKS][node-updates-kured].

### Windows Server nodes

For Windows Server nodes (currently in preview in AKS), Windows Update does not automatically run and apply the latest updates. On a regular schedule around the Windows Update release cycle and your own validation process, you should perform an upgrade on the Windows Server node pool(s) in your AKS cluster. This upgrade process creates nodes that run the latest Windows Server image and patches, then removes the older nodes. For more information on this process, see [Upgrade a node pool in AKS][nodepool-upgrade].

## Why are two resource groups created with AKS?

Each AKS deployment spans two resource groups:

1. You create the first resource group. This group contains only the Kubernetes service resource. The AKS resource provider automatically creates the second resource group during deployment. An example of the second resource group is *MC_myResourceGroup_myAKSCluster_eastus*. For information on how to specify the name of this second resource group, see the next section.
1. The second resource group, known as the *node resource group*, contains all of the infrastructure resources associated with the cluster. These resources include the Kubernetes node VMs, virtual networking, and storage. By default, the node resource group has a name like *MC_myResourceGroup_myAKSCluster_eastus*. AKS automatically deletes the node resource whenever the cluster is deleted, so it should only be used for resources which share the cluster's lifecycle.

## Can I provide my own name for the AKS node resource group?

Yes. By default, AKS will name the node resource group *MC_clustername_resourcegroupname_location*, but you can also provide your own name.

To specify your own resource group name, install the [aks-preview][aks-preview-cli] Azure CLI extension version *0.3.2* or later. When you create an AKS cluster by using the [az aks create][az-aks-create] command, use the *--node-resource-group* parameter and specify a name for the resource group. If you [use an Azure Resource Manager template][aks-rm-template] to deploy an AKS cluster, you can define the resource group name by using the *nodeResourceGroup* property.

* The secondary resource group is automatically created by the Azure resource provider in your own subscription.
* You can specify a custom resource group name only when you're creating the cluster.

As you work with the node resource group, keep in mind that you cannot:

* Specify an existing resource group for the node resource group.
* Specify a different subscription for the node resource group.
* Change the node resource group name after the cluster has been created.
* Specify names for the managed resources within the node resource group.
* Modify or delete tags of managed resources within the node resource group. (See additional information in the next section.)

## Can I modify tags and other properties of the AKS resources in the node resource group?

If you modify or delete Azure-created tags and other resource properties in the node resource group, you could get unexpected results such as scaling and upgrading errors. AKS allows you to create and modify custom tags. You might want to create or modify custom tags, for example, to assign a business unit or cost center. By modifying the resources under the node resource group in the AKS cluster, you break the service-level objective (SLO). For more information, see [Does AKS offer a service-level agreement?](#does-aks-offer-a-service-level-agreement)

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

Yes, Windows Server containers are available in preview. To run Windows Server containers in AKS, you create a node pool that runs Windows Server as the guest OS. Windows Server containers can use only Windows Server 2019. To get started, see [Create an AKS cluster with a Windows Server node pool][aks-windows-cli].

Window Server support for node pool includes some limitations that are part of the upstream Windows Server in Kubernetes project. For more information on these limitations, see [Windows Server containers in AKS limitations][aks-windows-limitations].

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

## Can I apply Azure reservation discounts to my AKS agent nodes?

AKS agent nodes are billed as standard Azure virtual machines, so if you've purchased [Azure reservations][reservation-discounts] for the VM size that you are using in AKS, those discounts are automatically applied.

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
[aks-rm-template]: /azure/templates/microsoft.containerservice/2019-06-01/managedclusters
[aks-cluster-autoscaler]: cluster-autoscaler.md
[nodepool-upgrade]: use-multiple-node-pools.md#upgrade-a-node-pool
[aks-windows-cli]: windows-container-cli.md
[aks-windows-limitations]: windows-node-limitations.md
[reservation-discounts]: ../billing/billing-save-compute-costs-reservations.md
[api-server-authorized-ip-ranges]: ./api-server-authorized-ip-ranges.md
[multi-node-pools]: ./use-multiple-node-pools.md

<!-- LINKS - external -->

[auto-scaler]: https://github.com/kubernetes/autoscaler
[cordon-drain]: https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/
[hexadite]: https://github.com/Hexadite/acs-keyvault-agent
[admission-controllers]: https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/
[keyvault-flexvolume]: https://github.com/Azure/kubernetes-keyvault-flexvol
[private-clusters-github-issue]: https://github.com/Azure/AKS/issues/948