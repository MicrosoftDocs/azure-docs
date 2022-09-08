---
title: Migrating from NIC to IP-based backend pools
titleSuffix: Azure Load Balancer
description: In this article, 
services: load-balancer
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: how-to 
ms.date: 09/08/2022
ms.custom: template-how-to 
---

# Migrating from NIC to IP-based backend pools 

## What is IP-based Load Balancer 

IP-based load balancers reference the private IP address of the resource in the backend pool rather than the resource’s NIC. IP-based load balancers enable the pre-allocation of private IP addresses in a backend pool, without having to create the backend resources themselves in advance.

## Migrating NIC-based backend pools to IP-based

To migrate a load balancer with NIC-based backend pools to IP-based with VMs (notVMSS instances) in the backend pool, you can utilize the following migration REST API.

Method: POST

URL: https://management.azure.com/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Network/loadBalancers/{lbName}/migrateToIpBased?api-version=2022-01-01

Request: List (string) of backend pools to be migrated.

A full example using the CLI to migrate all backend pools in a load balancer is shown here: az rest –m post –u “https://management.azure.com/subscriptions/MySubscriptionId/resourceGroups/MyResourceGroup/providers/Microsoft.Network/loadBalancers/MyLB/migrateToIpBased?api-version=2022-01-01”

A full example using the CLI to migrate a set of specific backend pool in a load balancer is shown below. To migrate a specific group of backend pools from NIC-based to IP-based, you can pass in a list of the backend pool names in the request body: az rest –m post –u “https://management.azure.com/subscriptions/MySubscriptionId/resourceGroups/MyResourceGroup/providers/Microsoft.Network/loadBalancers/MyLB/migrateToIpBased?api-version=2022-01-01”

-b {\"Pools\":[\"MyBackendPool\"]}

## Upgrading LB with VMSS attached

To upgrade a NIC based LB to IP based LB with virtual machine scale sets (VMSS) in the backend pool, follow the following steps:
1. Configure the upgrade policy of the VMSS to be automatic. Note that if the upgrade policy is not set to automatic, all VMSS instances must be upgraded after calling the migration API.
1. Using the Azure’s migration REST API, upgrade the NIC based LB to an IP based LB. a. Note, if a manual upgrade policy is in place, upgrade all VMs in the VMSS before step 3.
1. Remove the reference of the load balancer from the network profile of the VMSS, and update the VM instances to reflect the changes.

A full example using the CLI is shown here: Az rest –m post –u “https://management.azure.com/subscriptions/MySubscriptionId/resourceGroups/MyResourceGroup/providers/Microsoft.Network/loadBalancers/MyLB/migrateToIpBased?api-version=2022-01-01”

az vmss update --resource-group MyResourceGroup --name MyVMSS --remove virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].ipConfigurations[0].loadBalancerBackendAddressPools