---
title: Customize cluster egress with outbound types in Azure Kubernetes Service (AKS)
description: Learn how to define a custom egress route in Azure Kubernetes Service (AKS)
author: asudbring
ms.subservice: aks-networking
ms.author: allensu
ms.topic: how-to
ms.date: 06/29/2020

#Customer intent: As a cluster operator, I want to define my own egress paths with user-defined routes. Since I define this up front I do not want AKS provided load balancer configurations.
---

# Customize cluster egress with outbound types in Azure Kubernetes Service (AKS)

Egress from an AKS cluster can be customized to fit specific scenarios. By default, AKS will provision a Standard SKU Load Balancer to be set up and used for egress. However, the default setup may not meet the requirements of all scenarios if public IPs are disallowed or additional hops are required for egress.

This article covers the various types of outbound connectivity that are available in AKS Clusters.

## Limitations
* Outbound type can only be defined at cluster create time and can't be updated afterwards.
  * Reconfiguring outbound type is now supported in preview; see below.
* Setting `outboundType` requires AKS clusters with a `vm-set-type` of `VirtualMachineScaleSets` and `load-balancer-sku` of `Standard`.

## Overview of outbound types in AKS

An AKS cluster can be configured with three different categories of outbound type: load balancer, NAT gateway, or user-defined routing.

> [!IMPORTANT]
> Outbound type impacts only the egress traffic of your cluster. For more information, see [setting up ingress controllers](ingress-basic.md).

> [!NOTE]
> You can use your own [route table][byo-route-table] with UDR and kubenet networking. Make sure your cluster identity (service principal or managed identity) has Contributor permissions to the custom route table.

### Outbound type of loadBalancer

If `loadBalancer` is set, AKS completes the following configuration automatically. The load balancer is used for egress through an AKS assigned public IP. An outbound type of `loadBalancer` supports Kubernetes services of type `loadBalancer`, which expect egress out of the load balancer created by the AKS resource provider.

The following configuration is done by AKS.
   * A public IP address is provisioned for cluster egress.
   * The public IP address is assigned to the load balancer resource.
   * Backend pools for the load balancer are set up for agent nodes in the cluster.

Below is a network topology deployed in AKS clusters by default, which use an `outboundType` of `loadBalancer`.

![Diagram shows ingress I P and egress I P, where the ingress I P directs traffic to a load balancer, which directs traffic to and from an internal cluster and other traffic to the egress I P, which directs traffic to the Internet, M C R, Azure required services, and the A K S Control Plane.](media/egress-outboundtype/outboundtype-lb.png)

For more information, see [using a standard load balancer in AKS](load-balancer-standard.md) for more information.

### Outbound type of `managedNatGateway` or `userAssignedNatGateway`

If `managedNatGateway` or `userAssignedNatGateway` are selected for `outboundType`, AKS relies on [Azure Networking NAT gateway](../virtual-network/nat-gateway/manage-nat-gateway.md) for cluster egress. 

- `managedNatGateway` is used when using managed virtual networks, and tells AKS to provision a NAT gateway and attach it to the cluster subnet.
- `userAssignedNatGateway` is used when using bring-your-own virtual networking, and requires that a NAT gateway has been provisioned before cluster creation.

NAT gateway has significantly improved handling of SNAT ports when compared to Standard Load Balancer.

For more information, see [using NAT Gateway with AKS](nat-gateway.md) for more information.

### Outbound type of userDefinedRouting

> [!NOTE]
> Using outbound type is an advanced networking scenario and requires proper network configuration.

If `userDefinedRouting` is set, AKS won't automatically configure egress paths. The egress setup must be done by you.

The AKS cluster must be deployed into an existing virtual network with a subnet that has been previously configured because when not using standard load balancer (SLB) architecture, you must establish explicit egress. As such, this architecture requires explicitly sending egress traffic to an appliance like a firewall, gateway, proxy or to allow the Network Address Translation (NAT) to be done by a public IP assigned to the standard load balancer or appliance.

For more information, see [configuring cluster egress via user-defined routing](egress-udr.md) for more information.

## Updating `outboundType` after cluster creation (PREVIEW)

Changing the outbound type after cluster creation will deploy or remove resources as required to put the cluster into the new egress configuration.

Migration is only supported between `loadBalancer`, `managedNATGateway` (if using a managed virtual network), and `userDefinedNATGateway` (if using a custom virtual network).

> [!WARNING]
> Changing the outbound type on a cluster is disruptive to network connectivity and will result in a change of the cluster's egress IP address. If any firewall rules have been configured to restrict traffic from the cluster, they will need to be updated to match the new egress IP address.

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

### Install the aks-preview Azure CLI extension

`aks-preview` version 0.5.113 is required.

To install the `aks-preview` extension, run the following command:

```azurecli
az extension add --name aks-preview
```

Run the following command to update to the latest version of the extension released:

```azurecli
az extension update --name aks-preview
```

### Register the 'AKS-OutBoundTypeMigrationPreview' feature flag

Register the `AKS-OutBoundTypeMigrationPreview` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "AKS-OutBoundTypeMigrationPreview"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature show][az-feature-show] command:

```azurecli-interactive
az feature show --namespace "Microsoft.ContainerService" --name "AKS-OutBoundTypeMigrationPreview"
```

When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

### Update a cluster to use a new outbound type

Run the following command to change a cluster's outbound configuration:

```azurecli-interactive
az aks update -g <resourceGroup> -n <clusterName> --outbound-type <loadBalancer|managedNATGateway|userAssignedNATGateway>
```

## Next steps

- [Configure standard load balancing in an AKS cluster](load-balancer-standard.md)
- [Configure NAT gateway in an AKS cluster](nat-gateway.md)
- [Configure user-defined routing in an AKS cluster](egress-udr.md)
- [NAT gateway documentation](./nat-gateway.md)
- [Azure networking UDR overview](../virtual-network/virtual-networks-udr-overview.md).
- [Manage route tables](../virtual-network/manage-route-table.md).

<!-- LINKS - internal -->
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[byo-route-table]: configure-kubenet.md#bring-your-own-subnet-and-route-table-with-kubenet