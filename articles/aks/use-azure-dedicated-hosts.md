---
title: Use Azure Dedicated Hosts in Azure Kubernetes Service (AKS)
description: Learn how to create an Azure Dedicated Hosts Group and associate it with Azure Kubernetes Service (AKS)
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 03/10/2023
---

# Add Azure Dedicated Host to an Azure Kubernetes Service (AKS) cluster

Azure Dedicated Host is a service that provides physical servers - able to host one or more virtual machines - dedicated to one Azure subscription. Dedicated hosts are the same physical servers used in our data centers, provided as a resource. You can provision dedicated hosts within a region, availability zone, and fault domain. Then, you can place VMs directly into your provisioned hosts, in whatever configuration best meets your needs.

Using Azure Dedicated Hosts for nodes with your AKS cluster has the following benefits:

* Hardware isolation at the physical server level. No other VMs will be placed on your hosts. Dedicated hosts are deployed in the same data centers and share the same network and underlying storage infrastructure as other, non-isolated hosts.
* Control over maintenance events initiated by the Azure platform. While most maintenance events have little to no impact on your virtual machines, there are some sensitive workloads where each second of pause can have an impact. With dedicated hosts, you can opt in to a maintenance window to reduce the impact to your service.

## Before you begin

* An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
* Before you start, ensure that your version of the Azure CLI is 2.39.0 or later. If it's an earlier version, [install the latest version](/cli/azure/install-azure-cli).

## Limitations

The following limitations apply when you integrate Azure Dedicated Host with Azure Kubernetes Service:

* Accelerated Networking
* An existing agent pool can't be converted from non-ADH to ADH or ADH to non-ADH.
* It isn't supported to update agent pool from host group A to host group B.
* Using ADH across subscriptions.

## Planning for ADH Capacity on AKS

Not all host SKUs are available in all regions, and availability zones. You can list host availability, and any offer restrictions before you start provisioning dedicated hosts.

```azurecli-interactive
az vm list-skus -l eastus  -r hostGroups/hosts  -o table
```

> [!NOTE]
> First, when using host group, the nodepool fault domain count is always the same as the host group fault domain count. In order to use cluster auto-scaling to work with ADH and AKS, please make sure your host group fault domain count and capacity is enough.
> Secondly, only change fault domain count from the default of 1 to any other number if you know what they are doing as a misconfiguration could lead to a unscalable configuration.

[Determine how many hosts you would need based on the expected VM Utilization][determine-host-based-on-vm-utilization].

Evaluate [host utilization][host-utilization-evaluate] to determine the number of allocatable VMs by size before you deploy.

```azurecli-interactive
az vm host get-instance-view -g myDHResourceGroup --host-group MyHostGroup --name MyHost
```

## Add a Dedicated Host Group to an AKS cluster

A host group is a resource that represents a collection of dedicated hosts. You create a host group in a region and an availability zone, and add hosts to it. When planning for high availability, there are more options. You can use one or both of the following options with your dedicated hosts:

* Span across multiple availability zones. In this case, you're required to have a host group in each of the zones you wish to use.
* Span across multiple fault domains, which are mapped to physical racks.

In either case, you need to provide the fault domain count for your host group. If you don't want to span fault domains in your group, use a fault domain count of 1.

You can also decide to use both availability zones and fault domains.

## Create a Host Group

Now create a dedicated host in the host group. In addition to a name for the host, you're required to provide the SKU for the host. Host SKU captures the supported VM series and the hardware generation for your dedicated host.

For more information about the host SKUs and pricing, see [Azure Dedicated Host pricing][azure-dedicated-host-pricing].

Use az vm host create to create a host. If you set a fault domain count for your host group, you'll be asked to specify the fault domain for your host.

In this example, we'll use [az vm host group create][az-vm-host-group-create] to create a host group using both availability zones and fault domains.

```azurecli-interactive
az vm host group create \
--name myHostGroup \
-g myDHResourceGroup \
-z 1 \
--platform-fault-domain-count 1 \
--automatic-placement true
```

## Create a Dedicated Host

Now create a dedicated host in the host group. In addition to a name for the host, you're required to provide the SKU for the host. Host SKU captures the supported VM series and the hardware generation for your dedicated host.

If you set a fault domain count for your host group, you'll need to specify the fault domain for your host.

```azurecli-interactive
az vm host create \
--host-group myHostGroup \
--name myHost \
--sku DSv3-Type1 \
--platform-fault-domain 1 \
-g myDHResourceGroup
```

## Use a user-assigned Identity

> [!IMPORTANT]
> A user-assigned Identity with "contributor" role on the Resource Group of the Host Group is required.
>

First, create a Managed Identity

```azurecli-interactive
az identity create -g <Resource Group> -n <Managed Identity name>
```

Assign Managed Identity

```azurecli-interactive
az role assignment create --assignee <id> --role "Contributor" --scope <Resource id>
```

## Create an AKS cluster using the Host Group

Create an AKS cluster, and add the Host Group you just configured.

```azurecli-interactive
az aks create -g MyResourceGroup -n MyManagedCluster --location eastus --nodepool-name agentpool1 --node-count 1 --host-group-id <id> --node-vm-size Standard_D2s_v3 --enable-managed-identity --assign-identity <id>
```

## Add a Dedicated Host Node Pool to an existing AKS cluster

Add a Host Group to an already existing AKS cluster.

```azurecli-interactive
az aks nodepool add --cluster-name MyManagedCluster --name agentpool3 --resource-group MyResourceGroup --node-count 1 --host-group-id <id> --node-vm-size Standard_D2s_v3
```

## Remove a Dedicated Host Node Pool from an AKS cluster

```azurecli-interactive
az aks nodepool delete --cluster-name MyManagedCluster --name agentpool3 --resource-group MyResourceGroup
```

## Next steps

In this article, you learned how to create an AKS cluster with a Dedicated host, and to add a dedicated host to an existing cluster. For more information about Dedicated Hosts, see [dedicated-hosts](../virtual-machines/dedicated-hosts.md).

<!-- LINKS - External -->
[kubernetes-services]: https://kubernetes.io/docs/concepts/services-networking/service/
[azure-dedicated-host-pricing]: https://azure.microsoft.com/pricing/details/virtual-machines/dedicated-host/

<!-- LINKS - Internal -->
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[azure-cli-install]: /cli/azure/install-azure-cli
[dedicated-hosts]: ../virtual-machines/dedicated-hosts.md
[az-vm-host-group-create]: /cli/azure/vm/host/group#az_vm_host_group_create
[determine-host-based-on-vm-utilization]: ../virtual-machines/dedicated-host-general-purpose-skus.md
[host-utilization-evaluate]: ../virtual-machines/dedicated-hosts-how-to.md#check-the-status-of-the-host
