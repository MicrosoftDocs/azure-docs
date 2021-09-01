---
title: Managed NAT Gateway (preview)
description: Learn how to create a Multi-instance GPU Node pool and schedule tasks on it
services: container-service
ms.topic: article
ms.date: 9/1/2021
ms.author: juda
---

# Managed NAT Gateway

Whilst AKS customers are able to route egress traffic through an Azure Load Balancer, there are limitation on the amount of outbound flows of traffic that is possible. 

With Azure NAT Gateway you are able to have up to 64,000 outbound UDP and TCP traffic flows per IP address (up to a total of 16), giving over 10 million egress flows.

This article will walk you through how to create an AKS cluster with a Managed NAT Gateway as well as creating a cluster with an existing NAT Gateway for egress traffic.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Before you begin

You must have the following resource installed:

* The Azure CLI
* The `aks-preview` extension version 0.5.31 or later
* Kubernetes version 1.20.x or above


### Register the `ManagedNATGateway` feature flag

To use the Cloud Controller Manager feature, you must enable the `ManagedNATGateway` feature flag on your subscription. 

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

The default number of outbound IP addresses created with the NAT Gateway is one.  This can be changed at creation time.

```azurecli-interactive \
az aks create --resource-group myresourcegroup 
    --name natcluster  \
    --node-count 3 \
    --outbound-type managedNATGateway \ --nat-gateway-managed-outbound-ip-min-count 2
```

### Update the number of outbound IP addresses
```azurecli-interactive

az aks update \ 
    --resource-group myresourcegroup \
    --name natcluster\
    --nat-gateway-managed-outbound-ip-min-count 5
```

## Create an AKS cluster and integrate with an existing NAT Gateway
If you have already attached a NAT gateway to an existing subnet, your new AKS cluster can utilise this.

```azurecli-interactive

az aks create \
    --resource-group myresourcegroup \
    --name natcluster\
    --node-count 3\
    --outbound-type natGateway\ 
    --vnet-subnet-id <subnetId>
```

> [!NOTE]
> When you are using an existing NAT gateway you will need to modify the number of external IP addresses manually.
>

## Create an AKS nodepool and integrate with an existing NAT Gateway
If you have already attached a NAT gateway to an existing subnet, you can create a nodepool attached to the subnet.

```azurecli-interactive
az aks nodepool add\
    --cluster-name natcluster\
    --name pool2\
    --vnet-subnet-id <subnetId>
```


## Next Steps
- To find out more about the Azure NAT Gateway, take a look at our [documentation][nat-docs].

<!-- LINKS - internal -->


<!-- LINKS - external-->
[nat-docs]:https://docs.microsoft.com/en-us/azure/virtual-network/nat-gateway/

