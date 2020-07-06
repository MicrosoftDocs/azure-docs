---
title: Frequently asked questions for Azure Kubernetes Service (AKS)
description: Find answers to some of the common questions about Azure Kubernetes Service (AKS).
ms.topic: conceptual
ms.date: 05/14/2020

---

# Frequently asked questions about Azure Kubernetes Service (AKS)

This article addresses frequent questions about Azure Kubernetes Service (AKS).

## Which Azure regions currently provide AKS?

For a complete list of available regions, see [AKS regions and availability][aks-regions].

## Can I spread an AKS cluster across regions?

No. AKS clusters are regional resources and cannot span regions. See [best practices for business continuity and disaster recovery][bcdr-bestpractices] for guidance on how to create an architecture that includes multiple regions.

## Can I spread an AKS cluster across availability zones?

Yes. You can deploy an AKS cluster across one or more [availability zones][availability-zones] in [regions that support them][az-regions].

## Can I limit who has access to the Kubernetes API server?

Yes. There are two options for limiting access to the API server:

- Use [API Server Authorized IP Ranges][api-server-authorized-ip-ranges] if you want to maintain a public endpoint for the API server but restrict access to a set of trusted IP ranges.
- Use [a private cluster][private-clusters] if you want to limit the API server to *only* be accessible from within your virtual network.

## Can I have different VM sizes in a single cluster?

Yes, you can use different virtual machine sizes in your AKS cluster by creating [multiple node pools][multi-node-pools].

## Are security updates applied to AKS agent nodes?

Azure automatically applies security patches to the Linux nodes in your cluster on a nightly schedule. However, you are responsible for ensuring that those Linux nodes are rebooted as required. You have several options for rebooting nodes:

- Manually, through the Azure portal or the Azure CLI.
- By upgrading your AKS cluster. The cluster upgrades [cordon and drain nodes][cordon-drain] automatically and then bring a new node online with the latest Ubuntu image and a new patch version or a minor Kubernetes version. For more information, see [Upgrade an AKS cluster][aks-upgrade].
- By using [Kured](https://github.com/weaveworks/kured), an open-source reboot daemon for Kubernetes. Kured runs as a [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) and monitors each node for the presence of a file that indicates that a reboot is required. Across the cluster, OS reboots are managed by the same [cordon and drain process][cordon-drain] as a cluster upgrade.

For more information about using kured, see [Apply security and kernel updates to nodes in AKS][node-updates-kured].

### Windows Server nodes

For Windows Server nodes, Windows Update does not automatically run and apply the latest updates. On a regular schedule around the Windows Update release cycle and your own validation process, you should perform an upgrade on the cluster and the Windows Server node pool(s) in your AKS cluster. This upgrade process creates nodes that run the latest Windows Server image and patches, then removes the older nodes. For more information on this process, see [Upgrade a node pool in AKS][nodepool-upgrade].

## Why are two resource groups created with AKS?

AKS builds upon a number of Azure infrastructure resources, including virtual machine scale sets, virtual networks, and managed disks. This enables you to leverage many of the core capabilities of the Azure platform within the managed Kubernetes environment provided by AKS. For example, most Azure virtual machine types can be used directly with AKS and Azure Reservations can be used to receive discounts on those resources automatically.

To enable this architecture, each AKS deployment spans two resource groups:

1. You create the first resource group. This group contains only the Kubernetes service resource. The AKS resource provider automatically creates the second resource group during deployment. An example of the second resource group is *MC_myResourceGroup_myAKSCluster_eastus*. For information on how to specify the name of this second resource group, see the next section.
1. The second resource group, known as the *node resource group*, contains all of the infrastructure resources associated with the cluster. These resources include the Kubernetes node VMs, virtual networking, and storage. By default, the node resource group has a name like *MC_myResourceGroup_myAKSCluster_eastus*. AKS automatically deletes the node resource whenever the cluster is deleted, so it should only be used for resources which share the cluster's lifecycle.

## Can I provide my own name for the AKS node resource group?

Yes. By default, AKS will name the node resource group *MC_resourcegroupname_clustername_location*, but you can also provide your own name.

To specify your own resource group name, install the [aks-preview][aks-preview-cli] Azure CLI extension version *0.3.2* or later. When you create an AKS cluster by using the [az aks create][az-aks-create] command, use the *--node-resource-group* parameter and specify a name for the resource group. If you [use an Azure Resource Manager template][aks-rm-template] to deploy an AKS cluster, you can define the resource group name by using the *nodeResourceGroup* property.

* The secondary resource group is automatically created by the Azure resource provider in your own subscription.
* You can specify a custom resource group name only when you're creating the cluster.

As you work with the node resource group, keep in mind that you cannot:

* Specify an existing resource group for the node resource group.
* Specify a different subscription for the node resource group.
* Change the node resource group name after the cluster has been created.
* Specify names for the managed resources within the node resource group.
* Modify or delete Azure-created tags of managed resources within the node resource group. (See additional information in the next section.)

## Can I modify tags and other properties of the AKS resources in the node resource group?

If you modify or delete Azure-created tags and other resource properties in the node resource group, you could get unexpected results such as scaling and upgrading errors. AKS allows you to create and modify custom tags created by end-users. You might want to create or modify custom tags, for example, to assign a business unit or cost center. This can be achieved by creating Azure Policies with a scope on the managed resource group.

However, modifying any **Azure-created tags** on resources under the node resource group in the AKS cluster is an unsupported action which breaks the service-level objective (SLO). For more information, see [Does AKS offer a service-level agreement?](#does-aks-offer-a-service-level-agreement)

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

Currently, you can't modify the list of admission controllers in AKS.

## Can I use admission controller webhooks on AKS?

Yes, you may use admission controller webhooks on AKS. It is recommended you exclude internal AKS namespaces which are marked with the **control-plane label.** For example, by adding the below to the webhook configuration:

```
namespaceSelector:
    matchExpressions:
    - key: control-plane
      operator: DoesNotExist
```

## Can admission controller webhooks impact kube-system and internal AKS namespaces?

To protect the stability of the system and prevent custom admission controllers from impacting internal services in the kube-system, namespace AKS has an **Admissions Enforcer**, which automatically excludes kube-system and AKS internal namespaces. This service ensures the custom admission controllers don't affect the services running in kube-system.

If you have a critical use case for having something deployed on kube-system (not recommended) which you require to be covered by your custom admission webhook, you may add the below label or annotation so that Admissions Enforcer ignores it.

Label: ```"admissions.enforcer/disabled": "true"``` or Annotation: ```"admissions.enforcer/disabled": true```

## Is Azure Key Vault integrated with AKS?

AKS isn't currently natively integrated with Azure Key Vault. However, the [Azure Key Vault provider for CSI Secrets Store][csi-driver] enables direct integration from Kubernetes pods to Key Vault secrets.

## Can I run Windows Server containers on AKS?

Yes, Windows Server containers are available on AKS. To run Windows Server containers in AKS, you create a node pool that runs Windows Server as the guest OS. Windows Server containers can use only Windows Server 2019. To get started, see [Create an AKS cluster with a Windows Server node pool][aks-windows-cli].

Windows Server support for node pool includes some limitations that are part of the upstream Windows Server in Kubernetes project. For more information on these limitations, see [Windows Server containers in AKS limitations][aks-windows-limitations].

## Does AKS offer a service-level agreement?

AKS provides SLA guarantees as an optional add on feature with [Uptime SLA][uptime-sla].

## Can I apply Azure reservation discounts to my AKS agent nodes?

AKS agent nodes are billed as standard Azure virtual machines, so if you've purchased [Azure reservations][reservation-discounts] for the VM size that you are using in AKS, those discounts are automatically applied.

## Can I move/migrate my cluster between Azure tenants?

The `az aks update-credentials` command can be used to move an AKS cluster between Azure tenants. Follow the instructions in [Choose to update or create a service principal](https://docs.microsoft.com/azure/aks/update-credentials) and then [update aks cluster with new credentials](https://docs.microsoft.com/azure/aks/update-credentials#update-aks-cluster-with-new-service-principal-credentials).

## Can I move/migrate my cluster between subscriptions?

Movement of clusters between subscriptions is currently unsupported.

## Can I move my AKS clusters from the current Azure subscription to another? 

Moving your AKS cluster and it's associated resources between Azure subscriptions is not supported.

## Why is my cluster delete taking so long? 

Most clusters are deleted upon user request; in some cases, especially where customers are bringing their own Resource Group, or doing cross-RG tasks deletion can take additional time or fail. If you have an issue with deletes, double-check that you do not have locks on the RG, that any resources outside of the RG are disassociated from the RG, etc.

## If I have pod / deployments in state 'NodeLost' or 'Unknown' can I still upgrade my cluster?

You can, but AKS does not recommend this. Upgrades should ideally be performed when the state of the cluster is known and healthy.

## If I have a cluster with one or more nodes in an Unhealthy state or shut down, can I perform an upgrade?

No, please delete/remove any nodes in a failed state or otherwise removed from the cluster prior to upgrading.

## I ran a cluster delete, but see the error `[Errno 11001] getaddrinfo failed` 

Most commonly, this is caused by users having one or more Network Security Groups (NSGs) still in use and associated with the cluster.  Please remove them and attempt the delete again.

## I ran an upgrade, but now my pods are in crash loops, and readiness probes fail?

Please confirm your service principal has not expired.  Please see: [AKS service principal](https://docs.microsoft.com/azure/aks/kubernetes-service-principal) and [AKS update credentials](https://docs.microsoft.com/azure/aks/update-credentials).

## My cluster was working, but suddenly cannot provision LoadBalancers, mount PVCs, etc.? 

Please confirm your service principal has not expired.  Please see: [AKS service principal](https://docs.microsoft.com/azure/aks/kubernetes-service-principal)  and [AKS update credentials](https://docs.microsoft.com/azure/aks/update-credentials).

## Can I use the virtual machine scale set APIs to scale manually?

No, scale operations by using the virtual machine scale set APIs aren't supported. Use the AKS APIs (`az aks scale`).

## Can I use virtual machine scale sets to manually scale to 0 nodes?

No, scale operations by using the virtual machine scale set APIs aren't supported.

## Can I stop or de-allocate all my VMs?

While AKS has resilience mechanisms to withstand such a config and recover from it, this is not a recommended configuration.

## Can I use custom VM extensions?

No AKS is a managed service, and manipulation of the IaaS resources is not supported. To install custom components, etc. please leverage the Kubernetes APIs and mechanisms. For example, leverage DaemonSets to install required components.

<!-- LINKS - internal -->

[aks-upgrade]: ./upgrade-cluster.md
[aks-cluster-autoscale]: ./autoscaler.md
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
[reservation-discounts]:../cost-management-billing/reservations/save-compute-costs-reservations.md
[api-server-authorized-ip-ranges]: ./api-server-authorized-ip-ranges.md
[multi-node-pools]: ./use-multiple-node-pools.md
[availability-zones]: ./availability-zones.md
[private-clusters]: ./private-clusters.md
[bcdr-bestpractices]: ./operator-best-practices-multi-region.md#plan-for-multiregion-deployment
[availability-zones]: ./availability-zones.md
[az-regions]: ../availability-zones/az-region.md
[uptime-sla]: ./uptime-sla.md

<!-- LINKS - external -->
[aks-regions]: https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service
[auto-scaler]: https://github.com/kubernetes/autoscaler
[cordon-drain]: https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/
[admission-controllers]: https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/
[private-clusters-github-issue]: https://github.com/Azure/AKS/issues/948
[csi-driver]: https://github.com/Azure/secrets-store-csi-driver-provider-azure
[vm-sla]: https://azure.microsoft.com/support/legal/sla/virtual-machines/