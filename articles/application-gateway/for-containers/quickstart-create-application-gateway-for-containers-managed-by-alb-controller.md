---
title: 'Quickstart: Create Application Gateway for Containers managed by ALB Controller'
titlesuffix: Azure Application Load Balancer
description: In this quickstart, you learn how to provision the Application Gateway for Containers resources via Kubernetes definition.
services: application-gateway
author: greglin
ms.service: application-gateway
ms.subservice: traffic-controller
ms.topic: quickstart
ms.date: 7/7/2023
ms.author: greglin
---

# Quickstart: Create Application Gateway for Containers managed by ALB Controller

This guide assumes you're following the "managed by ALB controller" deployment strategy, where all the Application Gateway for Containers resources are managed by ALB controller and lifecycle is determined by definition of the resources defined in Kubernetes.  ALB Controller creates the Application Gateway for Containers resource when an _ApplicationLoadBalancer_ custom resource is defined on the cluster. Application Gateway for Containers' lifecycle is based on the lifecycle of the custom resource.

## Prerequisites

Ensure you have first deployed ALB Controller into your Kubernetes cluster.  You may follow the [Quickstart: Deploy Application Gateway for Containers ALB Controller](quickstart-deploy-application-gateway-for-containers-alb-controller.md) guide if you haven't yet deployed the ALB Controller.

### Prepare your virtual network / subnet for Application Gateway for Containers

#### AKS Virtual Network
If you wish to deploy Application Gateway for Containers into the virtual network containing your AKS cluster, execute the following command to find the cluster's virtual network:
```azurecli-interactive
AKS_NAME='<your cluster name>'
RESOURCE_GROUP='<your resource group>'

mcResourceGroup=$(az aks show --name $AKS_NAME --resource-group $RESOURCE_GROUP --query "nodeResourceGroup" -o tsv)
clusterSubnetId=$(az vmss list --resource-group $mcResourceGroup --query '[0].virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].ipConfigurations[0].subnet.id' -o tsv)
read -d '' vnetName vnetResourceGroup vnetId <<< $(az network vnet show --ids $clusterSubnetId --query '[name, resourceGroup, id]' -o tsv)
```

Execute the following command to create a new subnet containing at least 250 available IP addresses and enable subnet delegation for the Application Gateway for Containers association resource:
```azurecli-interactive
subnetAddressPrefix='<an address space under the vnet that has at least 250 available addresses (/24 or smaller cidr prefix for the subnet)>'
albSubnetName='subnet-alb' # subnet name can be any non-reserved subnet name (i.e. GatewaySubnet, AzureFirewallSubnet, AzureBastionSubnet would all be invalid)
az network vnet subnet create \
  --resource-group $vnetResourceGroup \
  --vnet-name $vnetName \
  --name $albSubnetName \
  --address-prefixes $subnetAddressPrefix \
  --delegations 'Microsoft.ServiceNetworking/trafficControllers'
albSubnetId=$(az network vnet subnet show --name $albSubnetName --resource-group $vnetResourceGroup --vnet-name $vnetName --query '[id]' --output tsv)
```

#### Existing Virtual Network not specific to AKS
If you wish to create a subnet in an existing virtual network, you can execute the following command to create a new subnet for the Application Gateway for Containers association resource:
```azurecli-interactive
vnetResourceGroup=<resource group name of the virtual network>
vnetName=<name of the virtual network to use>
subnetAddressPrefix='<an address space under the vnet that has at least 250 available addresses (/24 or smaller cidr prefix for the subnet)>'
albSubnetName='subnet-alb' # subnet name can be any non-reserved subnet name (i.e. GatewaySubnet, AzureFirewallSubnet, AzureBastionSubnet would all be invalid)
az network vnet subnet create --name $albSubnetName --resource-group $vnetResourceGroup --vnet-name $vnetName --address-prefixes $subnetAddressPrefix --delegations 'Microsoft.ServiceNetworking/trafficControllers'
albSubnetId=$(az network vnet subnet show --name $albSubnetName --resource-group $vnetResourceGroup --vnet-name $vnetName --query '[id]' --output tsv)
```

## Create ApplicationLoadBalancer kubernetes resource

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

```bash
kubectl apply -f - <<EOF
apiVersion: alb.networking.azure.io/v1
kind: ApplicationLoadBalancer
metadata:
  name: alb-test
  namespace: alb-test-infra
spec:
  associations:
  - $albSubnetId
EOF
```

## Validate creation of the Application Gateway for Containers resources

Once the _ApplicationLoadBalancer_ resource has been created, you can track deployment progress of the Application Gateway for Containers resources. The deployment transitions from _InProgress_ to _Ready_ state when provisioning has completed. It can take 5-6 minutes for the Application Gateway For Containers resource to be created.

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
- [Backend MTLS](how-to-backend-mtls.md)
- [SSL/TLS Offloading](how-to-ssl-offloading.md)
- [Traffic Splitting / Weighted Round Robin](how-to-traffic-splitting.md)
