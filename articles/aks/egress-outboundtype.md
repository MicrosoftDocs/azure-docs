---
title: Customize user defined routes (UDR) in Azure Kubernetes Service (AKS)
description: Learn how to define a custom egress route in Azure Kubernetes Service (AKS)
services: container-service
author: mlearned

ms.service: container-service
ms.topic: article
ms.date: 01/31/2020
ms.author: mlearned

#Customer intent: As a cluster operator, I want to define my own egress paths with user defined routes. Since I define this up front I do not want AKS provided load balancer configurations.
---

# Using user-defined-routes in Azure Kubernetes Service (AKS)

Egress from an AKS cluster can be customized to fit specific scenarios. By default, AKS will provision a Standard SKU Load Balancer to be setup and used for egress. The setup of the load balancer is done on behalf of the user for the following reasons.
1. A public IP address is required for the Standard SKU load balancer for egress, so AKS automatically assigns a public IP to the load balancer as egress setup is not provided by default. This behavior changes between the Basic SKU load balancers. 
1. AKS [requires outbound connectivity](limit-egress-traffic.md) to function properly and issue common operations such as pulling system-pod images or security patches. To learn more about why clusters require external connectivity and the required endpoints that clusters must be able to access, read about [controlling egress traffic for cluster nodes](limit-egress-traffic.md).

However, this setup may not meet the requirements of all scenarios.

In this article we will walk through how to customize a cluster's egress path to support a locked down scenario which disallows public IPs and requires the cluster to sit behind a network virtual appliance (NVA).

## Before you begin

Ensure you have the Azure CLI preview extension installed with at least version `0.4.28`. This requires an API version of at least `2019-11-01` or above.

## Limitations
* `outboundType` can only be defined at cluster create time and cannot be updated afterwards.
* Setting `outboundType` requires AKS clusters to use Azure CNI. There is no support for Kubenet.
* Setting `outboundType` requires AKS clusters created with a `vm-set-type` of `VirtualMachineScaleSets`.
* Setting `outboundType` to a value of `UDR` requires AKS clusters created with a `load-balancer-sku` of `Standard`.
* Setting `outboundType` to a value of `UDR` requires a valid user created path of outbound connectivity for a cluster.
* Setting `outboundType` to a value of `UDR` implies the ingress source IP routed to the load-balancer will *not match* the outgoing egress destination.

## Overview of cluster outbound types

An AKS cluster can define it's `outboundType` as `loadBalancer` or `userDefinedRoute`. This impacts only the egress traffic of your cluster, to learn about ingress read documentation on setting up [ingress controllers](ingress-basic.md).

* If `loadBalancer` is set, AKS completes the following setup automatically. The load balancer is used for egress through an AKS assigned public IP. This supports Kubernetes services of type loadBalancer which expect egress out of the cloud provider created load balancer. The following setup is done by AKS.
   * A public IP address is provisioned
   * The public IP address is assigned to the load balancer resource
   * Backend pools are setup for agent nodes in the cluster
* If `UDR` is set, AKS will not automatically configure egress paths. The following is expected to be done by **the user**.
   * User creates a  user defined route (UDR) on the subnet the cluster is deployed into
   * The cluster has valid outbound connectivity through the UDR setup

## Configure an isolated network topology with Azure Firewall
setup a virtual network to host an AKS cluster and an Azure Firewall. These resources should be isolated in dedicated subnets and handle inbound traffic from Azure Firewall to an internal load balancer. Egress should follow a UDR which makes a hop to the Azure Firewall for egress to the public internet.

<INSERT Diagram>

### Create dedicated subnets for your cluster and the NVA

First create a resource group.

```
az group create --name $RG --location $LOC
```

```
az network vnet create \
    --resource-group $RG \
    --name $VNET_NAME \
    --address-prefixes $BASE_ADDRESS.0.0/16 \
    --subnet-name $AKSSUBNET_NAME \
    --subnet-prefix $BASE_ADDRESS.1.0/24

az network vnet subnet create \
    --resource-group $RG \
    --vnet-name $VNET_NAME \
    --name $FWSUBNET_NAME \
    --address-prefix $BASE_ADDRESS.4.0/24
```

### Create an Azure Firewall with a public endpoint

```
## Create Public IP
az network public-ip create -g $RG -n $FWPUBLICIP_NAME -l $LOC --sku "Standard"

## Create Firewall
az extension add --name azure-firewall
az network firewall create -g $RG -n $FWNAME -l $LOC

## Configure Firewall IP Config
## This command will take a few minutes.
az network firewall ip-config create -g $RG -f $FWNAME -n $FWIPCONFIG_NAME --public-ip-address $FWPUBLICIP_NAME --vnet-name $VNET_NAME

## Capture Firewall IP Address for Later Use
export FWPUBLIC_IP=$(az network public-ip show -g $RG -n $FWPUBLICIP_NAME --query "ipAddress" -o tsv)
export FWPRIVATE_IP=$(az network firewall show -g $RG -n $FWNAME --query "ipConfigurations[0].privateIpAddress" -o tsv)
```

### Create a user defined route table (UDR)

Azure automatically routes traffic between Azure subnets, virtual networks, and on-premises networks. If you want to change any of Azure's default routing, you do so by creating a route table. You can create [custom, or user-defined, routes](https://docs.microsoft.com/azure/virtual-network/virtual-networks-udr-overview#user-defined) in Azure to override Azure's default system routes, or to add additional routes to a subnet's route table. In Azure, you create a route table, then associate the route table to zero or more virtual network subnets. Each subnet can have zero or one route table associated to it. To learn about the maximum number of routes you can add to a route table and the maximum number of user-defined route tables you can create per Azure subscription, see Azure limits. If you create a route table and associate it to a subnet, the routes within it are combined with, or override, the default routes Azure adds to a subnet by default.

```
# Create UDR & Routing Table
az network route-table create -g $RG --name $FWROUTE_TABLE_NAME
az network route-table route create -g $RG --name $FWROUTE_NAME --route-table-name $FWROUTE_TABLE_NAME --address-prefix 0.0.0.0/0 --next-hop-type VirtualAppliance --next-hop-ip-address $FWPRIVATE_IP
az network route-table route create -g $RG --name $FWROUTE_NAME_INTERNET --route-table-name $FWROUTE_TABLE_NAME --address-prefix $FWPUBLIC_IP/32 --next-hop-type Internet
```

## Add network firewall rules

```
# Add Network FW Rules

az network firewall network-rule create -g $RG -f $FWNAME --collection-name 'aksfwnr' -n 'netrules' --protocols 'Any' --source-addresses '*' --destination-addresses '*' --destination-ports '*' --action allow --priority 100

# Add Application FW Rules
# IMPORTANT: Here I'm adding a subset of the recommended FQDNs.
# For the complete list and explanation of minimum required and recommended FQDNs please check https://aka.ms/aks/egress
# Also, make sure to have into account any specific egress needs of your workloads.
az network firewall application-rule create -g $RG -f $FWNAME --collection-name 'aksfwar' -n 'fqdn' --source-addresses '*' --protocols 'http=80' 'https=443' --target-fqdns '*' --action allow --priority 100
```

## Deploy a cluster with outbound type set to UDR to the existing subnet

```azure-cli
az aks create -g myresourcegroup -n myakscluster -l westus --outbound-type userdefinedrouting --vnet-id <vnet-id>
```

## Associate the AKS cluster subnet to the Azure Firewall


### Validate outbound connectivity

TODO

## Create and configure additional Kubernetes services

An additional destination network address translation (DNAT) rule is required in the firewall scenario described above. This requires a new public IP to be available on the Azure Firewall and a dedicated DNAT rule for each subsequent service.

## Next steps

To learn more about virtual network traffic routing, visit the [Azure networking UDR overview](https://docs.microsoft.com/azure/virtual-network/virtual-networks-udr-overview.)

To learn more read about managing a route table, visit [how to create, change, or delete a route table](https://docs.microsoft.com/azure/virtual-network/manage-route-table).