---
title: Migrating from NIC to IP-based backend pools
titleSuffix: Azure Load Balancer
description: This article covers migrating a load balancer from NIC-based backend pools to IP-based backend pools for virtual machines and virtual machine scale sets.
services: load-balancer
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: how-to 
ms.date: 09/22/2022
ms.custom: template-how-to 
---

# Migrating from NIC to IP-based backend pools

In this article, you'll learn how to migrate a load balancer with NIC-based backend pools to use IP-based backend pools with virtual machines and virtual machine scale sets

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An existing standard Load Balancer in the subscription, with NIC-based backend pools.

## What is IP-based Load Balancer 

IP-based load balancers reference the private IP address of the resource in the backend pool rather than the resource’s NIC. IP-based load balancers enable the pre-allocation of private IP addresses in a backend pool, without having to create the backend resources themselves in advance.

## Migrating NIC-based virtual machine backend pools too IP-based

To migrate a load balancer with NIC-based backend pools to IP-based with VMs (not virtual machine scale sets instances) in the backend pool, you can utilize the following migration REST API.

```http

POST URL: https://management.azure.com/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Network/loadBalancers/{lbName}/migrateToIpBased?api-version=2022-01-01

```
### URI Parameters  

| Name | In | Required | Type | Description | 
|---- | ---- | ---- | ---- | ---- |
|Sub | Path | True | String | The subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call. |
| Rg | Path | True | String | The name of the resource group. |
| LbName | Path | True | String | The name of the load balancer. |
| api-version | Query | True | String | Client API Version |

### Request Body 

| Name | Type | Description |
| ---- | ---- | ---- |
| Backend Pools | String | A list of backend pools to migrate. Note if request body is specified, all backend pools will be migrated. |

A full example using the CLI to migrate all backend pools in a load balancer is shown here: 

```azurecli-interactive

az rest –m post –u “https://management.azure.com/subscriptions/MySubscriptionId/resourceGroups/MyResourceGroup/providers/Microsoft.Network/loadBalancers/MyLB/migrateToIpBased?api-version=2022-01-01”

```


A full example using the CLI to migrate a set of specific backend pool in a load balancer is shown below. To migrate a specific group of backend pools from NIC-based to IP-based, you can pass in a list of the backend pool names in the request body: 

```azurecli-interactive

az rest –m post –u “https://management.azure.com/subscriptions/MySubscriptionId/resourceGroups/MyResourceGroup/providers/Microsoft.Network/loadBalancers/MyLB/migrateToIpBased?api-version=2022-01-01”

-b {\"Pools\":[\"MyBackendPool\"]}
```
## Upgrading LB with virtual machine scale sets attached

To upgrade a NIC-based load balancer to IP based load balancer with virtual machine scale sets in the backend pool, follow the following steps:
1. Configure the upgrade policy of the virtual machine scale sets to be automatic. If the upgrade policy isn't set to automatic, all virtual machine scale sets instances must be upgraded after calling the migration API.
1. Using the Azure’s migration REST API, upgrade the NIC based LB to an IP based LB. If a manual upgrade policy is in place, upgrade all VMs in the virtual machine scale sets before step 3.
1. Remove the reference of the load balancer from the network profile of the virtual machine scale sets, and update the VM instances to reflect the changes.

A full example using the CLI is shown here: 

```azurecli-interactive

az rest –m post –u “https://management.azure.com/subscriptions/MySubscriptionId/resourceGroups/MyResourceGroup/providers/Microsoft.Network/loadBalancers/MyLB/migrateToIpBased?api-version=2022-01-01”

az virtual machine scale sets update --resource-group MyResourceGroup --name MyVMSS --remove virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].ipConfigurations[0].loadBalancerBackendAddressPools

```

## Next Steps