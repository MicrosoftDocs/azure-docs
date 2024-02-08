---
title: 'Quickstart: Create Application Gateway for Containers managed by ALB Controller (preview)'
description: In this quickstart, you learn how to provision the Application Gateway for Containers resources via Kubernetes definition.
services: application-gateway
author: greglin
ms.service: application-gateway
ms.subservice: appgw-for-containers
ms.custom: devx-track-azurecli
ms.topic: quickstart
ms.date: 09/25/2023
ms.author: greglin
---

# Quickstart: Create Application Gateway for Containers managed by ALB Controller (preview)

This guide assumes you're following the **managed by ALB controller** [deployment strategy](overview.md#deployment-strategies), where all the Application Gateway for Containers resources are managed by ALB controller. Lifecycle is determined the resources defined in Kubernetes.  ALB Controller creates the Application Gateway for Containers resource when an _ApplicationLoadBalancer_ custom resource is defined on the cluster. The Application Gateway for Containers lifecycle is based on the lifecycle of the custom resource.

## Prerequisites

> [!IMPORTANT]
> Application Gateway for Containers is currently in PREVIEW.<br>
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Ensure you have first deployed ALB Controller into your Kubernetes cluster.  See [Quickstart: Deploy Application Gateway for Containers ALB Controller](quickstart-deploy-application-gateway-for-containers-alb-controller.md) if you haven't already deployed the ALB Controller.

### Prepare your virtual network / subnet for Application Gateway for Containers

If you don't have a subnet available with at least 250 available IP addresses and delegated to the Application Gateway for Containers resource, use the following steps to create a new subnet and enable subnet delegation. The new subnet address space can't overlap any existing subnets in the VNet. 

# [New subnet in AKS managed virtual network](#tab/new-subnet-aks-vnet)
If you wish to deploy Application Gateway for Containers into the virtual network containing your AKS cluster, run the following command to find and assign the cluster's virtual network. This information is used in the next step.
```azurecli-interactive
AKS_NAME='<your cluster name>'
RESOURCE_GROUP='<your resource group name>'

MC_RESOURCE_GROUP=$(az aks show --name $AKS_NAME --resource-group $RESOURCE_GROUP --query "nodeResourceGroup" -o tsv)
CLUSTER_SUBNET_ID=$(az vmss list --resource-group $MC_RESOURCE_GROUP --query '[0].virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].ipConfigurations[0].subnet.id' -o tsv)
read -d '' VNET_NAME VNET_RESOURCE_GROUP VNET_ID <<< $(az network vnet show --ids $CLUSTER_SUBNET_ID --query '[name, resourceGroup, id]' -o tsv)
```

# [New subnet in non-AKS managed virtual network](#tab/new-subnet-non-aks-vnet)
If you wish to create a subnet in an existing virtual network, run the following command to set the variables for reference to the vnet and subnet prefix to be used during creation.

> [!WARNING]
> Upon creation of the subnet in the next step, ensure you establish connectivity between this virtual network/subnet and the AKS node pool to enable communication between Application Gateway for Containers and the pods running in AKS.

```azurecli-interactive
VNET_RESOURCE_GROUP=<resource group name of the virtual network>
VNET_NAME=<name of the virtual network to use>
```

---

Run the following command to create a new subnet containing at least 250 available IP addresses and enable subnet delegation for the Application Gateway for Containers association resource:
```azurecli-interactive
SUBNET_ADDRESS_PREFIX='<network address and prefix for an address space under the vnet that has at least 250 available addresses (/24 or larger subnet)>'
ALB_SUBNET_NAME='subnet-alb' # subnet name can be any non-reserved subnet name (i.e. GatewaySubnet, AzureFirewallSubnet, AzureBastionSubnet would all be invalid)
az network vnet subnet create \
  --resource-group $VNET_RESOURCE_GROUP \
  --vnet-name $VNET_NAME \
  --name $ALB_SUBNET_NAME \
  --address-prefixes $SUBNET_ADDRESS_PREFIX \
  --delegations 'Microsoft.ServiceNetworking/trafficControllers'
ALB_SUBNET_ID=$(az network vnet subnet show --name $ALB_SUBNET_NAME --resource-group $VNET_RESOURCE_GROUP --vnet-name $VNET_NAME --query '[id]' --output tsv)
```

## Delegate permissions to managed identity

ALB Controller needs the ability to provision new Application Gateway for Containers resources and to join the subnet intended for the Application Gateway for Containers association resource.

In this example, we delegate the _AppGW for Containers Configuration Manager_ role to the resource group containing the managed cluster and delegate the _Network Contributor_ role to the subnet used by the Application Gateway for Containers association subnet, which contains the _Microsoft.Network/virtualNetworks/subnets/join/action_ permission.

If desired, you can [create and assign a custom role](../../role-based-access-control/custom-roles-portal.md) with the _Microsoft.Network/virtualNetworks/subnets/join/action_ permission to eliminate other permissions contained in the _Network Contributor_ role. Learn more about [managing subnet permissions](../../virtual-network/virtual-network-manage-subnet.md#permissions). 

```azurecli-interactive
IDENTITY_RESOURCE_NAME='azure-alb-identity'

MC_RESOURCE_GROUP=$(az aks show --name $AKS_NAME --resource-group $RESOURCE_GROUP --query "nodeResourceGroup" -otsv | tr -d '\r')

mcResourceGroupId=$(az group show --name $MC_RESOURCE_GROUP --query id -otsv)
principalId=$(az identity show -g $RESOURCE_GROUP -n $IDENTITY_RESOURCE_NAME --query principalId -otsv)

# Delegate AppGw for Containers Configuration Manager role to AKS Managed Cluster RG
az role assignment create --assignee-object-id $principalId --assignee-principal-type ServicePrincipal --scope $mcResourceGroupId --role "fbc52c3f-28ad-4303-a892-8a056630b8f1" 

# Delegate Network Contributor permission for join to association subnet
az role assignment create --assignee-object-id $principalId --assignee-principal-type ServicePrincipal --scope $ALB_SUBNET_ID --role "4d97b98b-1d4f-4787-a291-c67834d212e7" 
```

## Create ApplicationLoadBalancer Kubernetes resource

1. Define the Kubernetes namespace for the ApplicationLoadBalancer resource

```bash
kubectl apply -f - <<EOF
apiVersion: v1
kind: Namespace
metadata:
  name: alb-test-infra
EOF
```

2. Define the _ApplicationLoadBalancer_ resource, specifying the subnet ID the Application Gateway for Containers association resource should deploy into.  The association establishes connectivity from Application Gateway for Containers to the defined subnet (and connected networks where applicable) to be able to proxy traffic to a defined backend.

> [!Note]
> When the ALB Controller creates the Application Gateway for Containers resources in ARM, it'll use the following naming conventions for its resources:
> - alb-\<8 randomly generated characters\> to define the Application Gateway for Containers resource
> - as-\<8 randomly generated characters\> to define the association resource
>
> If you would like to change the name of the resources created in Azure, consider following the [bring your own deployment strategy](quickstart-create-application-gateway-for-containers-byo-deployment.md).

Run the following command to create the Application Gateway for Containers resource and association.

```bash
kubectl apply -f - <<EOF
apiVersion: alb.networking.azure.io/v1
kind: ApplicationLoadBalancer
metadata:
  name: alb-test
  namespace: alb-test-infra
spec:
  associations:
  - $ALB_SUBNET_ID
EOF
```

## Validate creation of the Application Gateway for Containers resources

Once the _ApplicationLoadBalancer_ resource has been created, you can track deployment progress of the Application Gateway for Containers resources. The deployment transitions from _InProgress_ to _Programmed_ state when provisioning has completed. It can take 5-6 minutes for the Application Gateway for Containers resources to be created.

You can check the status of the _ApplicationLoadBalancer_ resource by running the following command:

```bash
kubectl get applicationloadbalancer alb-test -n alb-test-infra -o yaml -w
```

Example output of a successful provisioning of the Application Gateway for Containers resource from Kubernetes.
```yaml
status:
  conditions:
  - lastTransitionTime: "2023-06-19T21:03:29Z"
    message: Valid Application Gateway for Containers resource
    observedGeneration: 1
    reason: Accepted
    status: "True"
    type: Accepted
  - lastTransitionTime: "2023-06-19T21:03:29Z"
    message: alb-id=/subscriptions/xxx/resourceGroups/yyy/providers/Microsoft.ServiceNetworking/trafficControllers/alb-zzz
    observedGeneration: 1
    reason: Ready
    status: "True"
    type: Deployment
```

## Next steps

Congratulations, you have installed ALB Controller on your cluster and deployed the Application Gateway for Containers resources in Azure!

Try out a few of the how-to guides to deploy a sample application, demonstrating some of Application Gateway for Container's load balancing concepts.
- [Backend MTLS](how-to-backend-mtls-gateway-api.md?tabs=alb-managed)
- [SSL/TLS Offloading](how-to-ssl-offloading-gateway-api.md?tabs=alb-managed)
- [Traffic Splitting / Weighted Round Robin](how-to-traffic-splitting-gateway-api.md?tabs=alb-managed)
