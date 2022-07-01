---
title: Managed NAT Gateway
description: Learn how to create an AKS cluster with managed NAT integration
services: container-service
ms.topic: article
ms.date: 10/26/2021
ms.author: juda
---

# Managed NAT Gateway

Whilst AKS customers are able to route egress traffic through an Azure Load Balancer, there are limitations on the amount of outbound flows of traffic that is possible. 

Azure NAT Gateway allows up to 64,512 outbound UDP and TCP traffic flows per IP address with a maximum of 16 IP addresses.

This article will show you how to create an AKS cluster with a Managed NAT Gateway for egress traffic.


## Before you begin

To use Managed NAT gateway, you must have the following:

* The latest version of the Azure CLI
* Kubernetes version 1.20.x or above

## Create an AKS cluster with a Managed NAT Gateway
To create an AKS cluster with a new Managed NAT Gateway, use `--outbound-type managedNATGateway` as well as `--nat-gateway-managed-outbound-ip-count` and `--nat-gateway-idle-timeout` when running `az aks create`. The following example creates a *myresourcegroup* resource group, then creates a *natcluster* AKS cluster in *myresourcegroup* with a Managed NAT Gateway, two outbound IPs, and an idle timeout of 30 seconds.


```azurecli-interactive
az group create --name myresourcegroup --location southcentralus
```

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --name natcluster \
    --node-count 3 \
    --outbound-type managedNATGateway \
    --nat-gateway-managed-outbound-ip-count 2 \
    --nat-gateway-idle-timeout 30
```

> [!IMPORTANT]
> If no value the outbound IP address is specified, the default value is one.

### Update the number of outbound IP addresses
To update the outbound IP address or idle timeout, use `--nat-gateway-managed-outbound-ip-count` or `--nat-gateway-idle-timeout` when running `az aks update`. For example:

```azurecli-interactive
az aks update \ 
    --resource-group myresourcegroup \
    --name natcluster\
    --nat-gateway-managed-outbound-ip-count 5
```

## Create an AKS cluster with a user-assigned NAT Gateway
To create an AKS cluster with a user-assigned NAT Gateway, use `--outbound-type userAssignedNATGateway` when running `az aks create`. This configuration requires bring-your-own networking (via [Kubenet][byo-vnet-kubenet] or [Azure CNI][byo-vnet-azure-cni]) and that the NAT Gateway is preconfigured on the subnet. The following commands create the required resources for this scenario. Make sure to run them all in the same session so that the values stored to variables are still available for the `az aks create` command.

1. Create the resource group:
    ```azurecli-interactive
    az group create --name myresourcegroup \
        --location southcentralus
    ```

2. Create a managed identity for network permissions and store the ID to `$IDENTITY_ID` for later use:
    ```azurecli-interactive
    IDENTITY_ID=$(az identity create \
        --resource-group myresourcegroup \
        --name natclusterid \
        --location southcentralus \
        --query id \
        --output tsv)
    ```

3. Create a public IP for the NAT gateway:
    ```azurecli-interactive
    az network public-ip create \
        --resource-group myresourcegroup \
        --name mynatgatewaypip \
        --location southcentralus \
        --sku standard
    ```

4. Create the NAT gateway:
    ```azurecli-interactive
    az network nat gateway create \
        --resource-group myresourcegroup \
        --name mynatgateway \
        --location southcentralus \
        --public-ip-addresses mynatgatewaypip
    ```

5. Create a virtual network:
    ```azurecli-interactive
    az network vnet create \
        --resource-group myresourcegroup \
        --name myvnet \
        --location southcentralus \
        --address-prefixes 172.16.0.0/20 
    ```

6. Create a subnet in the virtual network using the NAT gateway and store the ID to `$SUBNET_ID` for later use:
    ```azurecli-interactive
    SUBNET_ID=$(az network vnet subnet create \
        --resource-group myresourcegroup \
        --vnet-name myvnet \
        --name natcluster \
        --address-prefixes 172.16.0.0/22 \
        --nat-gateway mynatgateway \
        --query id \
        --output tsv)
    ```

7. Create an AKS cluster using the subnet with the NAT gateway and the managed identity:
    ```azurecli-interactive
    az aks create \
        --resource-group myresourcegroup \
        --name natcluster \
        --location southcentralus \
        --network-plugin azure \
        --vnet-subnet-id $SUBNET_ID \
        --outbound-type userAssignedNATGateway \
        --enable-managed-identity \
        --assign-identity $IDENTITY_ID
    ```

## Next Steps
- For more information on Azure NAT Gateway, see [Azure NAT Gateway][nat-docs].

<!-- LINKS - internal -->


<!-- LINKS - external-->
[nat-docs]: ../virtual-network/nat-gateway/nat-overview.md
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
[byo-vnet-azure-cni]: configure-azure-cni.md
[byo-vnet-kubenet]: configure-kubenet.md
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
