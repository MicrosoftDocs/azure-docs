---
title: 'Quickstart: Create Application Gateway for Containers - bring your own deployment (preview)'
description: In this quickstart, you learn how to provision and manage the Application Gateway for Containers Azure resources independent from Kubernetes configuration.
services: application-gateway
author: greglin
ms.service: application-gateway
ms.subservice: appgw-for-containers
ms.custom: devx-track-azurecli
ms.topic: quickstart
ms.date: 07/24/2023
ms.author: greglin
---

# Quickstart: Create Application Gateway for Containers - bring your own deployment (preview)

This guide assumes you're following the **bring your own** [deployment strategy](overview.md#deployment-strategies), where ALB Controller references the Application Gateway for Containers resources precreated in Azure. It's assumed that resource lifecycles are managed in Azure, independent from what is defined within Kubernetes. 

## Prerequisites

> [!IMPORTANT]
> Application Gateway for Containers is currently in PREVIEW.<br>
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Ensure you have first deployed ALB Controller into your Kubernetes cluster.  You may follow the [Quickstart: Deploy Application Gateway for Containers ALB Controller](quickstart-deploy-application-gateway-for-containers-alb-controller.md) guide if you haven't already deployed the ALB Controller.

## Create the Application Gateway for Containers resource

Execute the following command to create the Application Gateway for Containers resource.

```azurecli-interactive
RESOURCE_GROUP='<your resource group name>'
AGFC_NAME='alb-test' # Name of the Application Gateway for Containers resource to be created
az network alb create -g $RESOURCE_GROUP -n $AGFC_NAME
```

## Create a frontend resource

Execute the following command to create the Application Gateway for Containers frontend resource.

```azurecli-interactive
FRONTEND_NAME='test-frontend'
az network alb frontend create -g $RESOURCE_GROUP -n $FRONTEND_NAME --alb-name $AGFC_NAME
```

## Create an association resource

### Delegate a subnet to association resource

To create an association resource, you first need to reference a subnet for Application Gateway for Containers to establish connectivity to.  Ensure the subnet for an Application Gateway for Containers association is at least a class C or larger (/24 or smaller CIDR prefix).  For this step, you may either reuse an existing subnet and enable subnet delegation on it. or create a new VNET, subnet, and enable subnet delegation. 

# [Reference existing VNet and Subnet](#tab/existing-vnet-subnet)
To reference an existing subnet, execute the following command to set the variables for reference to the subnet in later steps.
```azurecli-interactive
VNET_NAME='<name of the virtual network to use>'
VNET_RESOURCE_GROUP='<the resource group of your VNET>'
ALB_SUBNET_NAME='subnet-alb' # subnet name can be any non-reserved subnet name (i.e. GatewaySubnet, AzureFirewallSubnet, AzureBastionSubnet would all be invalid)
```

# [New VNet and Subnet](#tab/new-vnet-subnet)
If you would like to use a new virtual network for the Application Gateway for Containers association resource, you can create a new vnet with the following commands.

> [!WARNING]
> Upon creation of the virtual network, ensure you establish connectivity between this virtual network/subnet and the AKS node pool to enable communication between Application Gateway for Containers and the pods running in AKS. This may be achieved by establishing [virtual network peering](../../virtual-network/virtual-network-peering-overview.md) between both virtual networks.

```azurecli-interactive
VNET_NAME='<name of the virtual network to use>'
VNET_RESOURCE_GROUP='<the resource group of your VNET>'
VNET_ADDRESS_PREFIX='<address space of the vnet that will contain various subnets.  The vnet must be able to handle at least 250 available addresses (/24 or smaller cidr prefix for the subnet)>'
SUBNET_ADDRESS_PREFIX='<an address space under the vnet that has at least 250 available addresses (/24 or smaller cidr prefix for the subnet)>'
ALB_SUBNET_NAME='subnet-alb' # subnet name can be any non-reserved subnet name (i.e. GatewaySubnet, AzureFirewallSubnet, AzureBastionSubnet would all be invalid)
az network vnet create \
    --name $VNET_NAME \
    --resource-group $VNET_RESOURCE_GROUP \
    --address-prefix $VNET_ADDRESS_PREFIX \
    --subnet-name $ALB_SUBNET_NAME \
    --subnet-prefixes $SUBNET_ADDRESS_PREFIX
```

---

Enable subnet delegation for the Application Gateway for Containers service.  The delegation for Application Gateway for Containers is identified by the _Microsoft.ServiceNetworking/trafficControllers_ resource type.
```azurecli-interactive
az network vnet subnet update \
    --resource-group $VNET_RESOURCE_GROUP  \
    --name $ALB_SUBNET_NAME \
    --vnet-name $VNET_NAME \
    --delegations 'Microsoft.ServiceNetworking/trafficControllers'
ALB_SUBNET_ID=$(az network vnet subnet list --resource-group $VNET_RESOURCE_GROUP --vnet-name $VNET_NAME --query "[?name=='$ALB_SUBNET_NAME'].id" --output tsv)
echo $ALB_SUBNET_ID
```

### Delegate permissions to managed identity

ALB Controller will need the ability to provision new Application Gateway for Containers resources as well as join the subnet intended for the Application Gateway for Containers association resource.

In this example, we will delegate the _AppGW for Containers Configuration Manager_ role to the resource group and delegate the _Network Contributor_ role to the subnet used by the Application Gateway for Containers association subnet, which contains the _Microsoft.Network/virtualNetworks/subnets/join/action_ permission.

If desired, you can [create and assign a custom role](../../role-based-access-control/custom-roles-portal.md) with the _Microsoft.Network/virtualNetworks/subnets/join/action_ permission to eliminate other permissions contained in the _Network Contributor_ role. Learn more about [managing subnet permissions](../../virtual-network/virtual-network-manage-subnet.md#permissions). 

```azurecli-interactive
IDENTITY_RESOURCE_NAME='azure-alb-identity'

resourceGroupId=$(az group show --name $RESOURCE_GROUP --query id -otsv)
principalId=$(az identity show -g $RESOURCE_GROUP -n $IDENTITY_RESOURCE_NAME --query principalId -otsv)

# Delegate AppGw for Containers Configuration Manager role to RG containing Application Gateway for Containers resource
az role assignment create --assignee-object-id $principalId --assignee-principal-type ServicePrincipal --scope $resourceGroupId --role "fbc52c3f-28ad-4303-a892-8a056630b8f1" 

# Delegate Network Contributor permission for join to association subnet
az role assignment create --assignee-object-id $principalId --assignee-principal-type ServicePrincipal --scope $ALB_SUBNET_ID --role "4d97b98b-1d4f-4787-a291-c67834d212e7" 
```

### Create an association resource

Execute the following command to create the association resource and connect it to the referenced subnet.  It can take 5-6 minutes for the Application Gateway for Containers association to be created.

```azurecli-interactive
ASSOCIATION_NAME='association-test'
az network alb association create -g $RESOURCE_GROUP -n $ASSOCIATION_NAME --alb-name $AGFC_NAME --subnet $ALB_SUBNET_ID
```

## Next steps

Congratulations, you have installed ALB Controller on your cluster and deployed the Application Gateway for Containers resources in Azure!

Try out a few of the how-to guides to deploy a sample application, demonstrating some of Application Gateway for Container's load balancing concepts.
- [Backend MTLS](how-to-backend-mtls-gateway-api.md?tabs=byo)
- [SSL/TLS Offloading](how-to-ssl-offloading-gateway-api.md?tabs=byo)
- [Traffic Splitting / Weighted Round Robin](how-to-traffic-splitting-gateway-api.md?tabs=byo)
