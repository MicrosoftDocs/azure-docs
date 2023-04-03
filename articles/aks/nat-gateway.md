---
title: Create a managed or user-assigned NAT gateway
titleSuffix: Azure Kubernetes Service
description: Learn how to create an AKS cluster with managed NAT integration and user-assigned NAT gateway.
author: asudbring
ms.subservice: aks-networking
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 10/26/2021
ms.author: allensu
---

# Create a managed or user-assigned NAT gateway

While you can route egress traffic through an Azure Load Balancer, there are limitations on the amount of outbound flows of traffic you can have. Azure NAT Gateway allows up to 64,512 outbound UDP and TCP traffic flows per IP address with a maximum of 16 IP addresses.

This article shows you how to create an AKS cluster with a managed NAT gateway and a user-assigned NAT gateway for egress traffic and how to disable OutboundNAT on Windows.

## Before you begin

* Make sure you're using the latest version of [Azure CLI][az-cli].
* Make sure you're using Kubernetes version 1.20.x or above.
* Managed NAT Gateway is incompatible with custom virtual networks.

## Create an AKS cluster with a managed NAT gateway

To create an AKS cluster with a new managed NAT Gateway, use `--outbound-type managedNATGateway`, `--nat-gateway-managed-outbound-ip-count`, and `--nat-gateway-idle-timeout` when running `az aks create`. If you want the NAT gateway to be able to operate out of availability zones, specify the zones using `--zones`.

The following example creates a *myResourceGroup* resource group, then creates a *natCluster* AKS cluster in *myResourceGroup* with a Managed NAT Gateway, two outbound IPs, and an idle timeout of 30 seconds.

```azurecli-interactive
az group create --name myResourceGroup --location southcentralus
```

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --name natcluster \
    --node-count 3 \
    --outbound-type managedNATGateway \
    --nat-gateway-managed-outbound-ip-count 2 \
    --nat-gateway-idle-timeout 4
```

> [!IMPORTANT]
> If no value for the outbound IP address is specified, the default value is one.

### Update the number of outbound IP addresses

To update the outbound IP address or idle timeout, use `--nat-gateway-managed-outbound-ip-count` or `--nat-gateway-idle-timeout` when running `az aks update`.

```azurecli-interactive
az aks update \ 
    --resource-group myresourcegroup \
    --name natcluster\
    --nat-gateway-managed-outbound-ip-count 5
```

## Create an AKS cluster with a user-assigned NAT gateway

To create an AKS cluster with a user-assigned NAT gateway, use `--outbound-type userAssignedNATGateway` when running `az aks create`. This configuration requires bring-your-own networking (via [Kubenet][byo-vnet-kubenet] or [Azure CNI][byo-vnet-azure-cni]) and that the NAT Gateway is preconfigured on the subnet. The following commands create the required resources for this scenario. Make sure to run them all in the same session so that the values stored to variables are still available for the `az aks create` command.

1. Create the resource group.

    ```azurecli-interactive
    az group create --name myResourceGroup \
        --location southcentralus
    ```

2. Create a managed identity for network permissions and store the ID to `$IDENTITY_ID` for later use.

    ```azurecli-interactive
    IDENTITY_ID=$(az identity create \
        --resource-group myResourceGroup \
        --name natClusterId \
        --location southcentralus \
        --query id \
        --output tsv)
    ```

3. Create a public IP for the NAT gateway.

    ```azurecli-interactive
    az network public-ip create \
        --resource-group myResourceGroup \
        --name myNatGatewayPip \
        --location southcentralus \
        --sku standard
    ```

4. Create the NAT gateway.

    ```azurecli-interactive
    az network nat gateway create \
        --resource-group myResourceGroup \
        --name myNatGateway \
        --location southcentralus \
        --public-ip-addresses myNatGatewayPip
    ```

5. Create a virtual network.

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
        --name natCluster \
        --address-prefixes 172.16.0.0/22 \
        --nat-gateway myNatGateway \
        --query id \
        --output tsv)
    ```

7. Create an AKS cluster using the subnet with the NAT gateway and the managed identity.

    ```azurecli-interactive
    az aks create \
        --resource-group myResourceGroup \
        --name natCluster \
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
> OutboundNAT can only be disabled on Windows Server 2019 nodepools.

### Prerequisites

* You need to use `aks-preview` and register the feature flag.

  1. Install or update `aks-preview`.

    ```azurecli
    # Install aks-preview

    az extension add --name aks-preview

    # Update aks-preview

    az extension update --name aks-preview
    ```

  2. Register the feature flag.

    ```azurecli
    az feature register --namespace Microsoft.ContainerService --name DisableWindowsOutboundNATPreview
    ```

  3. Check the registration status.

    ```azurecli
    az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/DisableWindowsOutboundNATPreview')].{Name:name,State:properties.state}"
    ```

  4. Refresh the registration of the `Microsoft.ContainerService` resource provider.

    ```azurecli
    az provider register --namespace Microsoft.ContainerService
    ```

* Your clusters must have a Managed NAT Gateway (which may increase the overall cost).
* If you're using Kubernetes version 1.25 or older, you need to [update your deployment configuration][upgrade-kubernetes].
* If you need to switch from a load balancer to NAT Gateway, you can either add a NAT Gateway into the VNet or run [`az aks upgrade`][aks-upgrade] to update the outbound type.

### Manually disable OutboundNAT for Windows

You can manually disable OutboundNAT for Windows when creating new Windows agent pools using `--disable-windows-outbound-nat`.

> [!NOTE]
> You can use an existing AKS cluster, but you may need to update the outbound type and add a node pool to enable `--disable-windows-outbound-nat`.

```azurecli
az aks nodepool add \
    --resource-group myResourceGroup
    --cluster-name natCluster
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
[az-provider-register]: /cli/azure/provider#az_provider_register
[byo-vnet-azure-cni]: configure-azure-cni.md
[byo-vnet-kubenet]: configure-kubenet.md
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-cli]: /cli/azure/install-azure-cli
[agic]: ../application-gateway/ingress-controller-overview.md
[app-gw]: ../application-gateway/overview.md
[upgrade-kubernetes]:tutorial-kubernetes-upgrade-cluster.md
[aks-upgrade]: /cli/azure/aks#az-aks-update
