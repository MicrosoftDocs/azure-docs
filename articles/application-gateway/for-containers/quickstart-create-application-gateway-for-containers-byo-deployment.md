---
title: 'Quickstart: Create Application Gateway for Containers - Bring your own deployment'
titlesuffix: Azure Application Load Balancer
description: In this quickstart, you learn how to provision and manage the Application Gateway for Containers Azure resources independent from Kubernetes configuration.
services: application-gateway
author: greglin
ms.service: application-gateway
ms.subservice: traffic-controller
ms.topic: quickstart
ms.date: 7/7/2023
ms.author: greglin
---

# Quickstart: Create Application Gateway for Containers - Bring your own deployment

This guide assumes you're following the "bring your own" deployment strategy, where ALB Controller references the Application Gateway for Containers resources precreated in Azure. It's assumed that resource lifecycles are managed in Azure, independent from what is defined within Kubernetes. 

## Prerequisites

Ensure you have first deployed ALB Controller into your Kubernetes cluster.  You may follow the [Quickstart: Deploy Application Gateway for Containers ALB Controller](quickstart-deploy-application-gateway-for-containers-alb-controller.md) guide if you haven't yet deployed the ALB Controller.

## Create the Application Gateway for Containers resource

```azurecli-interactive
az network alb create -g test-rg -n test-alb
```

## Create a Frontend resource

```azurecli-interactive
az network alb frontend create -g test-rg -n test-frontend --alb-name test-alb
```

## Create an Association resource

To create an association resource,  you first need to reference a subnet for Application Gateway for Containers to establish connectivity to.  Ensure the subnet for an Application Gateway for Containers association is at least a class C or larger (/24 or smaller CIDR prefix).

### Create a new VNET and Subnet
To create a new vnet and subnet, execute the following command:
```azurecli-interactive
az network vnet create \
    --name test-vnet \
    --resource-group test-rg \
    --address-prefix 10.0.0.0/16 \
    --subnet-name test-alb-subnet \
    --subnet-prefixes 10.0.0.0/24
```
### Reference an existing VNet and Subnet
To reference an existing subnet, execute the following command to get the resource ID of the subnet:
```azurecli-interactive
az network vnet subnet list --resource-group test-rg --vnet-name test-vnet --query "[?name=='test-alb-subnet'].id" --output tsv
```

Execute the following command to create the Association resource and connect it to the referenced subnet
```azurecli-interactive
az network alb association create -g test-rg -n test-association --alb-name test-alb --subnet /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/yyyyy/providers/Microsoft.Network/virtualNetworks/zzzzzz/subnets/test-alb-subnet
```

## Next steps

Congratulations, you have installed ALB Controller on your cluster and deployed the Application Gateway for Containers resources in Azure!

Try out a few of the how-to guides to deploy a sample application, demonstrating some of Application Gateway for Container's load balancing concepts.
- [Backend MTLS](how-to-backend-mtls.md)
- [SSL/TLS Offloading](how-to-ssl-offloading.md)
- [Traffic Splitting / Weighted Round Robin](how-to-traffic-splitting.md)
