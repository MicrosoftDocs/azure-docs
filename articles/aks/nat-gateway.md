---
title: Managed NAT Gateway (preview)
description: Learn how to create an AKS cluster with managed NAT integration
services: container-service
ms.topic: article
ms.date: 9/1/2021
ms.author: juda
---

# Managed NAT Gateway (preview)

Whilst AKS customers are able to route egress traffic through an Azure Load Balancer, there are limitation on the amount of outbound flows of traffic that is possible. 

With Azure NAT Gateway you are able to have up to 64,000 outbound UDP and TCP traffic flows per IP address (up to a total of 16), giving over 10 million egress flows.

This article will shows you how to create an AKS cluster with a Managed NAT Gateway as well as creating a cluster with an existing NAT Gateway for egress traffic.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Before you begin

You must have the following resource installed:

* The Azure CLI
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
To get started, create a resource group and a AKS cluster. If you already have a cluster, you can skip this step. Follow the example create the resource group name `myresourcegroup` in the `southcentralus` region:

```azurecli-interactive
az group create --name myresourcegroup --location southcentralus
```

> [!IMPORTANT]
> The number of outbound IP address can only be set when creating a cluster. If no value is specified, the default value is one.

```azurecli-interactive \
az aks create --resource-group myresourcegroup 
    --name natcluster  \
    --node-count 3 \
    --outbound-type managedNATGateway \ 
    --nat-gateway-managed-outbound-ip-count 2 \
    --nat-gateway-idle-timeout 30
```

### Update the number of outbound IP addresses
```azurecli-interactive

az aks update \ 
    --resource-group myresourcegroup \
    --name natcluster\
    --nat-gateway-managed-outbound-ip-count 5
```


> [!NOTE]
> When you are using an existing NAT gateway you will need to modify the number of external IP addresses manually.
>



## Next Steps
- For more information on Azure NAT Gateway, see [Azure NAT Gateway][nat-docs].

<!-- LINKS - internal -->


<!-- LINKS - external-->
[nat-docs]:https://docs.microsoft.com/en-us/azure/virtual-network/nat-gateway/

