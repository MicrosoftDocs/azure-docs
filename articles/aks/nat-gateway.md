---
title: Managed NAT Gateway (preview)
description: Learn how to create an AKS cluster with managed NAT integration
services: container-service
ms.topic: article
ms.date: 10/26/2021
ms.author: juda
---

# Managed NAT Gateway (preview)

Whilst AKS customers are able to route egress traffic through an Azure Load Balancer, there are limitations on the amount of outbound flows of traffic that is possible. 

Azure NAT Gateway allows up to 64,000 outbound UDP and TCP traffic flows per IP address with a maximum of 16 IP addresses.

This article will show you how to create an AKS cluster with a Managed NAT Gateway for egress traffic.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Before you begin

To use Managed NAT gateway, you must have the following:

* The latest version of the Azure CLI
* The `aks-preview` extension version 0.5.31 or later
* Kubernetes version 1.20.x or above


### Register the `AKS-NATGatewayPreview` feature flag

To use the NAT Gateway feature, you must enable the `AKS-NATGatewayPreview` feature flag on your subscription. 

```azurecli
az feature register --namespace "Microsoft.ContainerService" --name "AKS-NATGatewayPreview"
```
You can check on the registration status by using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/AKS-NATGatewayPreview')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```


## Create an AKS cluster with a Managed NAT Gateway
To create an AKS cluster with a new Managed NAT Gateway, use `--outbound-type managedNATGateway` as well as `--nat-gateway-managed-outbound-ip-count` and `--nat-gateway-idle-timeout` when running `az aks create`. The following example creates a *myresourcegroup* resource group, then creates a *natcluster* AKS cluster in *myresourcegroup* with a Managed NAT Gateway, two outbound IPs, and an idle timeout of 30 seconds.


```azurecli-interactive
az group create --name myresourcegroup --location southcentralus
```

```azurecli-interactive
az aks create --resource-group myresourcegroup 
    --name natcluster  \
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


## Next Steps
- For more information on Azure NAT Gateway, see [Azure NAT Gateway][nat-docs].

<!-- LINKS - internal -->


<!-- LINKS - external-->
[nat-docs]: ../virtual-network/nat-gateway/nat-overview.md
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
