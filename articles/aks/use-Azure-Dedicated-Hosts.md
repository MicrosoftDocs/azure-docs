---
title: Use Azure Dedicated Hosts in Azure Kubernetes Service (AKS) (Preview)
description: Learn how to create an Azure Dedicated Hosts Group and associate it with Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.date: 02/11/2021

---

#Customer intent: As a cluster operator or developer, I want to learn how to add a Azure Dedicated Host Group to an AKS Cluster.
---

# Add Azure Dedicated Host to an Azure Kubernetes Service (AKS) cluster

Azure Dedicated Host is a service that provides physical servers - able to host one or more virtual machines - dedicated to one Azure subscription. Dedicated hosts are the same physical servers used in our data centers, provided as a resource. You can provision dedicated hosts within a region, availability zone, and fault domain. Then, you can place VMs directly into your provisioned hosts, in whatever configuration best meets your needs.

Using Azure Dedicated Hosts for nodes with your AKS cluster has the following benefits:

* Hardware isolation at the physical server level. No other VMs will be placed on your hosts. Dedicated hosts are deployed in the same data centers and share the same network and underlying storage infrastructure as other, non-isolated hosts.
* Control over maintenance events initiated by the Azure platform. While the majority of maintenance events have little to no impact on your virtual machines, there are some sensitive workloads where each second of pause can have an impact. With dedicated hosts, you can opt-in to a maintenance window to reduce the impact to your service.

## Before you begin

This article requires that you are running the Azure CLI version 2.34 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

### Limitations

The following limitations apply when you create integrate Azure Dedicated Host with Azure Kubernetes Service:
* An existing agentpool cannot be converted from non-ADH to ADH or ADH to non-ADH.
* It is not supported to update agentpool from host group A to host group B.

## Add a Dedicated Host Group to an AKS cluster

A host group is a resource that represents a collection of dedicated hosts. You create a host group in a region and an availability zone, and add hosts to it. When planning for high availability, there are additional options. You can use one or both of the following options with your dedicated hosts:

Span across multiple availability zones. In this case, you are required to have a host group in each of the zones you wish to use.
Span across multiple fault domains which are mapped to physical racks.
In either case, you are need to provide the fault domain count for your host group. If you do not want to span fault domains in your group, use a fault domain count of 1.

You can also decide to use both availability zones and fault domains.

Not all host SKUs are available in all regions, and availability zones. You can list host availability, and any offer restrictions before you start provisioning dedicated hosts.
```azurecli-interactive
az vm list-skus -l eastus2  -r hostGroups/hosts  -o table
```

## Add Dedicated Hosts to the Host Group

Now create a dedicated host in the host group. In addition to a name for the host, you are required to provide the SKU for the host. Host SKU captures the supported VM series as well as the hardware generation for your dedicated host.

For more information about the host SKUs and pricing, see [Azure Dedicated Host pricing](https://azure.microsoft.com/en-us/pricing/details/virtual-machines/dedicated-host/).

Use az vm host create to create a host. If you set a fault domain count for your host group, you will be asked to specify the fault domain for your host.

In this example, we will use [az vm host group create](https://docs.microsoft.com/en-us/cli/azure/vm/host/group?view=azure-cli-latest#az_vm_host_group_create) to create a host group using both availability zones and fault domains.

```azurecli-interactive
az vm host group create \
--name myHostGroup \
-g myDHResourceGroup \
-z 1\
--platform-fault-domain-count 2
```

## Create the UAMI

## Add the Dedicated Host Group to AKS

## Verification

## Next steps

In this article, you learned how to add a spot node pool to an AKS cluster. For more information about how to control pods across node pools, see [Best practices for advanced scheduler features in AKS][operator-best-practices-advanced-scheduler].

<!-- LINKS - External -->
[kubernetes-services]: https://kubernetes.io/docs/concepts/services-networking/service/

<!-- LINKS - Internal -->
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az-aks-nodepool-add
[cluster-autoscaler]: cluster-autoscaler.md
[eviction-policy]: ../virtual-machine-scale-sets/use-spot.md#eviction-policy
[kubernetes-concepts]: concepts-clusters-workloads.md
[operator-best-practices-advanced-scheduler]: operator-best-practices-advanced-scheduler.md
[pricing-linux]: https://azure.microsoft.com/pricing/details/virtual-machine-scale-sets/linux/
[pricing-spot]: ../virtual-machine-scale-sets/use-spot.md#pricing
[pricing-windows]: https://azure.microsoft.com/pricing/details/virtual-machine-scale-sets/windows/
[spot-toleration]: #verify-the-spot-node-pool
[taints-tolerations]: operator-best-practices-advanced-scheduler.md#provide-dedicated-nodes-using-taints-and-tolerations
[use-multiple-node-pools]: use-multiple-node-pools.md
[vmss-spot]: ../virtual-machine-scale-sets/use-spot.md
