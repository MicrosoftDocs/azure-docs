---
title: Create a managed or user-assigned NAT gateway for your Azure Kubernetes Service (AKS) cluster
titleSuffix: Azure Kubernetes Service
description: Learn how to create an AKS cluster with managed NAT integration and user-assigned NAT gateway.
author: asudbring
ms.subservice: aks-networking
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 05/30/2023
ms.author: allensu
---

# Create a managed or user-assigned NAT gateway for your Azure Kubernetes Service (AKS) cluster

While you can route egress traffic through an Azure Load Balancer, there are limitations on the number of outbound flows of traffic you can have. Azure NAT Gateway allows up to 64,512 outbound UDP and TCP traffic flows per IP address with a maximum of 16 IP addresses.

This article shows you how to create an Azure Kubernetes Service (AKS) cluster with a managed NAT gateway and a user-assigned NAT gateway for egress traffic. It also shows you how to disable OutboundNAT on Windows.

## Before you begin

* Make sure you're using the latest version of [Azure CLI][az-cli].
* Make sure you're using Kubernetes version 1.20.x or above.
* Managed NAT gateway is incompatible with custom virtual networks.

## Create an AKS cluster with a managed NAT gateway

* Create an AKS cluster with a new managed NAT gateway using the [`az aks create`][az-aks-create] command with the `--outbound-type managedNATGateway`, `--nat-gateway-managed-outbound-ip-count`, and `--nat-gateway-idle-timeout` parameters. If you want the NAT gateway to operate out of a specific availability zone, specify the zones using `--zones`.
* A managed NAT gateway resource cannot be used across multiple availability zones. When you deploy a managed NAT gateway instance, it is deployed to "no zone". No zone NAT gateway resources are deployed to a single availability zone for you by Azure. For more information on non-zonal deployment model, see [non-zonal NAT gateway](/azure/nat-gateway/nat-availability-zones#non-zonal).

    ```azurecli-interactive
    az aks create \
        --resource-group myResourceGroup \
        --name myNatCluster \
        --node-count 3 \
        --outbound-type managedNATGateway \
        --nat-gateway-managed-outbound-ip-count 2 \
        --nat-gateway-idle-timeout 4
    ```

    > [!IMPORTANT]
    > Zonal configuration for your NAT gateway resource can be done with user-assigned NAT gateway resources. See [Create an AKS cluster with a user-assigned NAT gateway](#create-an-aks-cluster-with-a-user-assigned-nat-gateway) for more details.
    > If no value for the outbound IP address is specified, the default value is one.

### Update the number of outbound IP addresses

* Update the outbound IP address or idle timeout using the [`az aks update`][az-aks-update] command with the `--nat-gateway-managed-outbound-ip-count` or `--nat-gateway-idle-timeout` parameter.

    ```azurecli-interactive
    az aks update \ 
        --resource-group myResourceGroup \
        --name myNatCluster\
        --nat-gateway-managed-outbound-ip-count 5
    ```

## Create an AKS cluster with a user-assigned NAT gateway

This configuration requires bring-your-own networking (via [Kubenet][byo-vnet-kubenet] or [Azure CNI][byo-vnet-azure-cni]) and that the NAT gateway is preconfigured on the subnet. The following commands create the required resources for this scenario.

1. Create a resource group using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create --name myResourceGroup \
        --location southcentralus
    ```

2. Create a managed identity for network permissions and store the ID to `$IDENTITY_ID` for later use.

    ```azurecli-interactive
    IDENTITY_ID=$(az identity create \
        --resource-group myResourceGroup \
        --name myNatClusterId \
        --location southcentralus \
        --query id \
        --output tsv)
    ```

3. Create a public IP for the NAT gateway using the [`az network public-ip create`][az-network-public-ip-create] command.

    ```azurecli-interactive
    az network public-ip create \
        --resource-group myResourceGroup \
        --name myNatGatewayPip \
        --location southcentralus \
        --sku standard
    ```

4. Create the NAT gateway using the [`az network nat gateway create`][az-network-nat-gateway-create] command.

    ```azurecli-interactive
    az network nat gateway create \
        --resource-group myResourceGroup \
        --name myNatGateway \
        --location southcentralus \
        --public-ip-addresses myNatGatewayPip
    ```
   > [!Important]
   > A single NAT gateway resource cannot be used across multiple availability zones. To ensure zone-resiliency, it is recommended to deploy a NAT gateway resource to each availability zone and assign to subnets containing AKS clusters in each zone. For more information on this deployment model, see [NAT gateway for each zone](/azure/nat-gateway/nat-availability-zones#zonal-nat-gateway-resource-for-each-zone-in-a-region-to-create-zone-resiliency).
   > If no zone is configured for NAT gateway, the default zone placement is "no zone", in which Azure places NAT gateway into a zone for you.

5. Create a virtual network using the [`az network vnet create`][az-network-vnet-create] command.

    ```azurecli-interactive
    az network vnet create \
        --resource-group myResourceGroup \
        --name myVnet \
        --location southcentralus \
        --address-prefixes 172.16.0.0/20 
    ```

6. Create a subnet in the virtual network using the NAT gateway and store the ID to `$SUBNET_ID` for later use.

    ```azurecli-interactive
    SUBNET_ID=$(az network vnet subnet create \
        --resource-group myResourceGroup \
        --vnet-name myVnet \
        --name myNatCluster \
        --address-prefixes 172.16.0.0/22 \
        --nat-gateway myNatGateway \
        --query id \
        --output tsv)
    ```

7. Create an AKS cluster using the subnet with the NAT gateway and the managed identity using the [`az aks create`][az-aks-create] command.

    ```azurecli-interactive
    az aks create \
        --resource-group myResourceGroup \
        --name myNatCluster \
        --location southcentralus \
        --network-plugin azure \
        --vnet-subnet-id $SUBNET_ID \
        --outbound-type userAssignedNATGateway \
        --enable-managed-identity \
        --assign-identity $IDENTITY_ID
    ```

## Disable OutboundNAT for Windows (preview)

Windows OutboundNAT can cause certain connection and communication issues with your AKS pods. Some of these issues include:

* **Unhealthy backend status**: When you deploy an AKS cluster with [Application Gateway Ingress Control (AGIC)][agic] and [Application Gateway][app-gw] in different VNets, the backend health status becomes "Unhealthy." The outbound connectivity fails because the peered networked IP isn't present in the CNI config of the Windows nodes.
* **Node port reuse**: Windows OutboundNAT uses port to translate your pod IP to your Windows node host IP, which can cause an unstable connection to the external service due to a port exhaustion issue.
* **Invalid traffic routing to internal service endpoints**: When you create a load balancer service with `externalTrafficPolicy` set to *Local*, kube-proxy on Windows doesn't create the proper rules in the IPTables to route traffic to the internal service endpoints.

Windows enables OutboundNAT by default. You can now manually disable OutboundNAT when creating new Windows agent pools.

> [!NOTE]
> OutboundNAT can only be disabled on Windows Server 2019 node pools.

### Prerequisites

* You need to use `aks-preview` and register the feature flag.

  1. Install or update `aks-preview` using the [`az extension add`][az-extension-add] or [`az extension update`][az-extension-update] command.

        ```azurecli
        # Install aks-preview

        az extension add --name aks-preview

        # Update aks-preview

        az extension update --name aks-preview
        ```

  2. Register the feature flag using the [`az feature register`][az-feature-register] command.

        ```azurecli
        az feature register --namespace Microsoft.ContainerService --name DisableWindowsOutboundNATPreview
        ```

  3. Check the registration status using the [`az feature list`][az-feature-list] command.

        ```azurecli
        az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/DisableWindowsOutboundNATPreview')].{Name:name,State:properties.state}"
        ```

  4. Refresh the registration of the `Microsoft.ContainerService` resource provider us

        ```azurecli
        az provider register --namespace Microsoft.ContainerService
        ```

* If you're using Kubernetes version 1.25 or older, you need to [update your deployment configuration][upgrade-kubernetes].
* Cluster outbound type can't be set to load balancer.
* If you need to switch from a load balancer to NAT gateway, you can either add a NAT gateway into the VNet or run [`az aks upgrade`][aks-upgrade] to update the outbound type.

### Manually disable OutboundNAT for Windows

* Manually disable OutboundNAT for Windows when creating new Windows agent pools using the [`az aks nodepool add`][az-aks-nodepool-add] command with the `--disable-windows-outbound-nat` flag.

    > [!NOTE]
    > You can use an existing AKS cluster, but you may need to update the outbound type and add a node pool to enable `--disable-windows-outbound-nat`.

    ```azurecli
    az aks nodepool add \
        --resource-group myResourceGroup
        --cluster-name myNatCluster
        --name mynodepool
        --node-count 3
        --os-type Windows
        --disable-windows-outbound-nat
    ```

## Next steps

For more information on Azure NAT Gateway, see [Azure NAT Gateway][nat-docs].

<!-- LINKS - internal -->

<!-- LINKS - external-->
[nat-docs]: ../virtual-network/nat-gateway/nat-overview.md
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-feature-register]: /cli/azure/feature#az_feature_register
[byo-vnet-azure-cni]: configure-azure-cni.md
[byo-vnet-kubenet]: configure-kubenet.md
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-cli]: /cli/azure/install-azure-cli
[agic]: ../application-gateway/ingress-controller-overview.md
[app-gw]: ../application-gateway/overview.md
[upgrade-kubernetes]:tutorial-kubernetes-upgrade-cluster.md
[aks-upgrade]: /cli/azure/aks#az-aks-update
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-update]: /cli/azure/aks#az-aks-update
[az-group-create]: /cli/azure/group#az_group_create
[az-network-public-ip-create]: /cli/azure/network/public-ip#az_network_public_ip_create
[az-network-nat-gateway-create]: /cli/azure/network/nat/gateway#az_network_nat_gateway_create
[az-network-vnet-create]: /cli/azure/network/vnet#az_network_vnet_create
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az_aks_nodepool_add
