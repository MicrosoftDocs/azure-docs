---
title: Customize cluster egress with outbound types in Azure Kubernetes Service (AKS)
description: Learn how to define a custom egress route in Azure Kubernetes Service (AKS)
author: asudbring
ms.subservice: aks-networking
ms.custom: devx-track-azurecli
ms.author: allensu
ms.topic: how-to
ms.date: 11/06/2023
#Customer intent: As a cluster operator, I want to define my own egress paths with user-defined routes. Since I define this up front I do not want AKS provided load balancer configurations.
---

# Customize cluster egress with outbound types in Azure Kubernetes Service (AKS)

You can customize egress for an AKS cluster to fit specific scenarios. By default, AKS will provision a standard SKU load balancer to be set up and used for egress. However, the default setup may not meet the requirements of all scenarios if public IPs are disallowed or additional hops are required for egress.

This article covers the various types of outbound connectivity that are available in AKS clusters.
 
> [!NOTE]
> You can now update the `outboundType` after cluster creation. This feature is in preview. See [Updating `outboundType after cluster creation (preview)](#updating-outboundtype-after-cluster-creation-preview).

## Limitations

* Setting `outboundType` requires AKS clusters with a `vm-set-type` of `VirtualMachineScaleSets` and `load-balancer-sku` of `Standard`.

## Outbound types in AKS

You can configure an AKS cluster using the following outbound types: load balancer, NAT gateway, or user-defined routing. The outbound type impacts only the egress traffic of your cluster. For more information, see [setting up ingress controllers](ingress-basic.md).

> [!NOTE]
> You can use your own [route table][byo-route-table] with UDR and [kubenet networking](../aks/configure-kubenet.md). Make sure your cluster identity (service principal or managed identity) has Contributor permissions to the custom route table.

### Outbound type of `loadBalancer`

The load balancer is used for egress through an AKS-assigned public IP. An outbound type of `loadBalancer` supports Kubernetes services of type `loadBalancer`, which expect egress out of the load balancer created by the AKS resource provider.

If `loadBalancer` is set, AKS automatically completes the following configuration:

* A public IP address is provisioned for cluster egress.
* The public IP address is assigned to the load balancer resource.
* Backend pools for the load balancer are set up for agent nodes in the cluster.

![Diagram shows ingress I P and egress I P, where the ingress I P directs traffic to a load balancer, which directs traffic to and from an internal cluster and other traffic to the egress I P, which directs traffic to the Internet, M C R, Azure required services, and the A K S Control Plane.](media/egress-outboundtype/outboundtype-lb.png)

For more information, see [using a standard load balancer in AKS](load-balancer-standard.md).

### Outbound type of `managedNatGateway` or `userAssignedNatGateway`

If `managedNatGateway` or `userAssignedNatGateway` are selected for `outboundType`, AKS relies on [Azure Networking NAT gateway](../virtual-network/nat-gateway/manage-nat-gateway.md) for cluster egress.

* Select `managedNatGateway` when using managed virtual networks. AKS will provision a NAT gateway and attach it to the cluster subnet.
* Select `userAssignedNatGateway` when using bring-your-own virtual networking. This option requires that you have provisioned a NAT gateway before cluster creation.

For more information, see [using NAT gateway with AKS](nat-gateway.md).

### Outbound type of `userDefinedRouting`

> [!NOTE]
> The `userDefinedRouting` outbound type is an advanced networking scenario and requires proper network configuration.

If `userDefinedRouting` is set, AKS won't automatically configure egress paths. The egress setup must be done by you.

You must deploy the AKS cluster into an existing virtual network with a subnet that has been previously configured. Since you're not using a standard load balancer (SLB) architecture, you must establish explicit egress. This architecture requires explicitly sending egress traffic to an appliance like a firewall, gateway, proxy or to allow NAT to be done by a public IP assigned to the standard load balancer or appliance.

For more information, see [configuring cluster egress via user-defined routing](egress-udr.md).

## Updating `outboundType` after cluster creation (preview)

Changing the outbound type after cluster creation will deploy or remove resources as required to put the cluster into the new egress configuration.

The following tables show the supported migration paths between outbound types for managed and BYO virtual networks.

### Supported Migration Paths for Managed VNet

| Managed VNet           |loadBalancer   | managedNATGateway | userAssignedNATGateway | userDefinedRouting |
|------------------------|---------------|-------------------|------------------------|--------------------|
| loadBalancer           | N/A           | Supported         | Not Supported          | Supported          |
| managedNATGateway      | Supported     | N/A               | Not Supported          | Supported          |
| userAssignedNATGateway | Not Supported | Not Supported     | N/A                    | Not Supported      |
| userDefinedRouting     | Supported     | Supported         | Not Supported          | N/A                |

### Supported Migration Paths for BYO VNet

| BYO VNet               | loadBalancer  | managedNATGateway | userAssignedNATGateway | userDefinedRouting |
|------------------------|---------------|-------------------|------------------------|--------------------|
| loadBalancer           | N/A           | Not Supported     | Supported              | Supported          |
| managedNATGateway      | Not Supported | N/A               | Not Supported          | Not Supported      |
| userAssignedNATGateway | Supported     | Not Supported     | N/A                    | Supported          |
| userDefinedRouting     | Supported     | Not Supported     | Supported              | N/A                |

Migration is only supported between `loadBalancer`, `managedNATGateway` (if using a managed virtual network), `userAssignedNATGateway` and `userDefinedRouting` (if using a custom virtual network).

> [!WARNING] 
> Migrating the outbound type to user managed types (`userAssignedNATGateway` and `userDefinedRouting`) will change the outbound public IP addresses of the cluster. 
> if [Authorized IP ranges](./api-server-authorized-ip-ranges.md) is enabled, please make sure new outbound ip range is appended to authorized ip range.

> [!WARNING]
> Changing the outbound type on a cluster is disruptive to network connectivity and will result in a change of the cluster's egress IP address. If any firewall rules have been configured to restrict traffic from the cluster, you need to update them to match the new egress IP address.

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

### Install the `aks-preview` Azure CLI extension

`aks-preview` version 0.5.113 is required.

* Install and update the `aks-preview` extension.

```azurecli
# Install aks-preview extension
az extension add --name aks-preview
# Update aks-preview extension
az extension update --name aks-preview
```

### Register the `AKS-OutBoundTypeMigrationPreview` feature flag

1. Register the `AKS-OutBoundTypeMigrationPreview` feature flag using the [`az feature register`][az-feature-register] command. It takes a few minutes for the status to show *Registered*.

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "AKS-OutBoundTypeMigrationPreview"
```

2. Verify the registration status using the [`az feature show`][az-feature-show] command.

```azurecli-interactive
az feature show --namespace "Microsoft.ContainerService" --name "AKS-OutBoundTypeMigrationPreview"
```

3. When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider using the [`az provider register`][az-provider-register] command.

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

### Update cluster to use a new outbound type

* Update the outbound configuration of your cluster using the [`az aks update`][az-aks-update] command.

### Update cluster from loadbalancer to managedNATGateway  

```azurecli-interactive
az aks update -g <resourceGroup> -n <clusterName> --outbound-type managedNATGateway --nat-gateway-managed-outbound-ip-count <number of managed outbound ip>
```

### Update cluster from managedNATGateway to loadbalancer

```azurecli-interactive
az aks update -g <resourceGroup> -n <clusterName> \
--outbound-type loadBalancer \
<--load-balancer-managed-outbound-ip-count <number of managed outbound ip>| --load-balancer-outbound-ips <outbound ip ids> | --load-balancer-outbound-ip-prefixes <outbound ip prefix ids> >
```

> [!WARNING]
> Do not reuse an IP address that is already in use in prior outbound configurations.

### Update cluster from managedNATGateway to userDefinedRouting

- Add route `0.0.0.0/0` to default route table. Please refer to [Customize cluster egress with a user-defined routing table in Azure Kubernetes Service (AKS)](egress-udr.md)

```azurecli-interactive
az aks update -g <resourceGroup> -n <clusterName> --outbound-type userDefinedRouting
```

### Update cluster from loadbalancer to userAssignedNATGateway in BYO vnet scenario

- Associate nat gateway with subnet where the workload is associated with. Please refer to [Create a managed or user-assigned NAT gateway](nat-gateway.md)

```azurecli-interactive
az aks update -g <resourceGroup> -n <clusterName> --outbound-type userAssignedNATGateway
```

## Next steps

* [Configure standard load balancing in an AKS cluster](load-balancer-standard.md)
* [Configure NAT gateway in an AKS cluster](nat-gateway.md)
* [Configure user-defined routing in an AKS cluster](egress-udr.md)
* [NAT gateway documentation](./nat-gateway.md)
* [Azure networking UDR overview](../virtual-network/virtual-networks-udr-overview.md)
* [Manage route tables](../virtual-network/manage-route-table.md)

<!-- LINKS - internal -->
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-show]: /cli/azure/feature#az_feature_show
[az-provider-register]: /cli/azure/provider#az_provider_register
[az-aks-update]: /cli/azure/aks#az_aks_update
