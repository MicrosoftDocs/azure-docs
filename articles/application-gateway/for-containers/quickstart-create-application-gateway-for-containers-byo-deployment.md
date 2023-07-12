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
az network alb create -g rg-test -n alb-test
```

## Create a Frontend resource

```azurecli-interactive
az network alb frontend create -g rg-test -n test-frontend --alb-name alb-test
```

## Create an Association resource

To create an association resource, you first need to reference a subnet for Application Gateway for Containers to establish connectivity to.  Ensure the subnet for an Application Gateway for Containers association is at least a class C or larger (/24 or smaller CIDR prefix).

### Create a new VNET, subnet, and subnet delegation
The following command will create a new virtual network and subnet with at least 250 IP addresses available.

```azurecli-interactive
az network vnet create \
    --name vnet-test \
    --resource-group rg-test \
    --address-prefix 10.0.0.0/16 \
    --subnet-name subnet-alb \
    --subnet-prefixes 10.0.0.0/24 \
```

Enable subnet delegation for the Application Gateway for Containers service is identified by the Microsoft.ServiceNetworking/trafficControllers resource type.
```azurecli-interactive
az network vnet subnet update \
    --resource-group rg-test  \
    --name subnet-alb \
    --vnet-name vnet-test \
    --delegations 'Microsoft.ServiceNetworking/trafficControllers'
```
 
### Reference an existing VNet and Subnet
To reference an existing subnet, execute the following command to get the resource ID of the subnet:
```azurecli-interactive
az network vnet subnet list --resource-group rg-test --vnet-name vnet-test --query "[?name=='subnet-alb'].id" --output tsv
```

### Delegate permissions to managed identity
ALB Controller will need the ability to provision new Application Gateway for Containers resources as well as join the subnet intended for the Application Gateway for Containres association resource.

In this example, we will delegate the _AppGW for Containers Configuration Manager_ role to the resource group and delegate the _Network Contributor_ role to the subnet used by the Application Gateway for Containers association subnet, which contains the _Microsoft.Network/virtualNetworks/subnets/join/action_ permission.

If desired, you can [create and assign a custom role](../../role-based-access-control/custom-roles-portal.md) with the _Microsoft.Network/virtualNetworks/subnets/join/action_ permission to eliminate other permissions contained in the _Network Contributor_ role. Learn more about [managing subnet permissions](../../virtual-network/virtual-network-manage-subnet.md#permissions). 

```azurecli-interactive
RESOURCE_GROUP='rg-test'
IDENTITY_RESOURCE_NAME='azure-alb-identity'

principalId="$(az identity show -g $RESOURCE_GROUP -n $IDENTITY_RESOURCE_NAME --query principalId -otsv)"

# Delegate AppGw for Containers Configuration Manager role to AKS Managed Cluster RG
az role assignment create --assignee-object-id $principalId --resource-group $RESOURCE_GROUP --role "fbc52c3f28ad4303a8928a056630b8f1"

# Delegate Network Contributor permission for join to association subnet
az role assignment create --assignee-object-id $principalId --scope $albSubnetId --role "fbc52c3f28ad4303a8928a056630b8f1"
```

### Create an association resource
Execute the following command to create the association resource and connect it to the referenced subnet
```azurecli-interactive
az network alb association create -g rg-test -n association-test --alb-name alb-test --subnet /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/yyyyy/providers/Microsoft.Network/virtualNetworks/zzzzzz/subnets/subnet-alb
```

## Next steps

Congratulations, you have installed ALB Controller on your cluster and deployed the Application Gateway for Containers resources in Azure!

Try out a few of the how-to guides to deploy a sample application, demonstrating some of Application Gateway for Container's load balancing concepts.
- [Backend MTLS](how-to-backend-mtls.md)
- [SSL/TLS Offloading](how-to-ssl-offloading.md)
- [Traffic Splitting / Weighted Round Robin](how-to-traffic-splitting.md)
