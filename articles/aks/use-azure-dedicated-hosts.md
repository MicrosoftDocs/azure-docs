---
title: Use Azure Dedicated Hosts in Azure Kubernetes Service (AKS) (Preview)
description: Learn how to create an Azure Dedicated Hosts Group and associate it with Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.date: 02/11/2021

---

# Add Azure Dedicated Host to an Azure Kubernetes Service (AKS) cluster (Preview)

Azure Dedicated Host is a service that provides physical servers - able to host one or more virtual machines - dedicated to one Azure subscription. Dedicated hosts are the same physical servers used in our data centers, provided as a resource. You can provision dedicated hosts within a region, availability zone, and fault domain. Then, you can place VMs directly into your provisioned hosts, in whatever configuration best meets your needs.

Using Azure Dedicated Hosts for nodes with your AKS cluster has the following benefits:

* Hardware isolation at the physical server level. No other VMs will be placed on your hosts. Dedicated hosts are deployed in the same data centers and share the same network and underlying storage infrastructure as other, non-isolated hosts.
* Control over maintenance events initiated by the Azure platform. While most maintenance events have little to no impact on your virtual machines, there are some sensitive workloads where each second of pause can have an impact. With dedicated hosts, you can opt in to a maintenance window to reduce the impact to your service.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Before you begin

* An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
* [Azure CLI installed](/cli/azure/install-azure-cli).

### Install the `aks-preview` Azure CLI

You also need the *aks-preview* Azure CLI extension version 0.5.54 or later. Install the *aks-preview* Azure CLI extension by using the [az extension add][az-extension-add] command. Or install any available updates by using the [az extension update][az-extension-update] command.

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview
# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

### Register the `DedicatedHostGroupPreview` preview feature

To use the feature, you must also enable the `DedicatedHostGroupPreview` feature flag on your subscription.

Register the `DedicatedHostGroupPreview` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "DedicatedHostGroupPreview"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/DedicatedHostGroupPreview')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Limitations

The following limitations apply when you integrate Azure Dedicated Host with Azure Kubernetes Service:

* An existing agent pool can't be converted from non-ADH to ADH or ADH to non-ADH.
* It is not supported to update agent pool from host group A to host group B.
* Using ADH across subscriptions.

## Add a Dedicated Host Group to an AKS cluster

A host group is a resource that represents a collection of dedicated hosts. You create a host group in a region and an availability zone, and add hosts to it. When planning for high availability, there are additional options. You can use one or both of the following options with your dedicated hosts:

* Span across multiple availability zones. In this case, you are required to have a host group in each of the zones you wish to use.
* Span across multiple fault domains, which are mapped to physical racks.

In either case, you need to provide the fault domain count for your host group. If you do not want to span fault domains in your group, use a fault domain count of 1.

You can also decide to use both availability zones and fault domains.

Not all host SKUs are available in all regions, and availability zones. You can list host availability, and any offer restrictions before you start provisioning dedicated hosts.

```azurecli-interactive
az vm list-skus -l eastus  -r hostGroups/hosts  -o table
```

## Create a Host Group

Now create a dedicated host in the host group. In addition to a name for the host, you are required to provide the SKU for the host. Host SKU captures the supported VM series as well as the hardware generation for your dedicated host.

For more information about the host SKUs and pricing, see [Azure Dedicated Host pricing](https://azure.microsoft.com/pricing/details/virtual-machines/dedicated-host/).

Use az vm host create to create a host. If you set a fault domain count for your host group, you will be asked to specify the fault domain for your host.

In this example, we will use [az vm host group create][az-vm-host-group-create] to create a host group using both availability zones and fault domains.

```azurecli-interactive
az vm host group create \
--name myHostGroup \
-g myDHResourceGroup \
-z 1\
--platform-fault-domain-count 5
--automatic-placement true
```

## Create a Dedicated Host

Now create a dedicated host in the host group. In addition to a name for the host, you are required to provide the SKU for the host. Host SKU captures the supported VM series as well as the hardware generation for your dedicated host.

If you set a fault domain count for your host group, you will need to specify the fault domain for your host.

```azurecli-interactive
az vm host create \
--host-group myHostGroup \
--name myHost \
--sku DSv3-Type1 \
--platform-fault-domain 0 \
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
az aks create -g MyResourceGroup -n MyManagedCluster --location eastus --kubernetes-version 1.20.13 --nodepool-name agentpool1 --node-count 1 --host-group-id <id> --node-vm-size Standard_D2s_v3 --enable-managed-identity --assign-identity <id>
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

<!-- LINKS - Internal -->
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[azure-cli-install]: /cli/azure/install-azure-cli
[dedicated-hosts]: ../virtual-machines/dedicated-hosts.md
[az-vm-host-group-create]: /cli/azure/vm/host/group#az_vm_host_group_create
