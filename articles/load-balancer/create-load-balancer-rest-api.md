---
title: 'Create a load balancer using REST API | Microsoft Docs'
description: 
services: load-balancer
documentationcenter: na
author: KumudD
manager: jeconnoc
editor: ''

ms.assetid: 
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: load-balancer
ms.date: 06/01/2018
ms.author: kumud
---

# Create a load balancer using REST API

This how-to shows how to create a new [Azure Load Balancer](load-balancer-overview.md) using [Azure REST API](/rest/api/azure/). 
Complete reference documention and additional samples are available in the [Azure SQL Database REST reference](/rest/api/load-balancer/).
 

## Build the request
Use the following HTTP PUT request to create a new Azure Load Balancer.

 ```HTTP
  PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/loadBalancers/{loadBalancerName}?api-version=2018-02-01

  ```

### URI parameters

|Name  |In  |Required |Type |Description |
|---------|---------|---------|---------|--------|
|subscriptionId   |  path       |  True       |   string      |  The subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.      |
|resourceGroupName     |     path    | True        |  string       |   The name of the resource group.     |
|loadBalancerName     |  path       |      True   |    string     |    The name of the load balancer.    |
|api-version    |   query     |  True       |     string    |  Client API version.      |



### Request body

Media Types: "application/json", "text/json"

|Name  |Required  |Type  |Description  |
|---------|---------|--------|---------|
|etag     |         |string  | A unique read-only string that changes whenever the resource is updated.        |
|id     |         |string  | Resource ID.       |
|location     |         |string  |Resource location.         |
|properties.backendAddressPools     |         |   BackendAddressPool[]        |A collection of backend address pools used by a load balancer.       |
|properties.frontendIPConfigurations     |   | FrontendIPConfiguration[]        |      Object representing the frontend IPs to be used for the load balancer     |
|properties.inboundNatPools      |         |InboundNatPool[]          |  Defines an external port range for inbound NAT to a single backend port on NICs associated with a load balancer. Inbound NAT rules are created automatically for each NIC associated with the Load Balancer using an external port from this range. Defining an Inbound NAT pool on your Load Balancer is mutually exclusive with defining inbound Nat rules. Inbound NAT pools are referenced from virtual machine scale sets. NICs that are associated with individual virtual machines cannot reference an inbound NAT pool. They have to reference individual inbound NAT rules.       |
|properties.inboundNatRules     |        | InboundNatRule[]          |Collection of inbound NAT Rules used by a load balancer. Defining inbound NAT rules on your load balancer is mutually exclusive with defining an inbound NAT pool. Inbound NAT pools are referenced from virtual machine scale sets. NICs that are associated with individual virtual machines cannot reference an Inbound NAT pool. They have to reference individual inbound NAT rules.         |
|properties.loadBalancingRules     |          |  LoadBalancingRule[]       |   Object collection representing the load balancing rules Gets the provisioning       |
|properties.outboundNatRules     |         | OutboundNatRule[]         |  The outbound NAT rules.       |
|properties.probes     |         |  Probe[]        |  Collection of probe objects used in the load balancer       |
|  properties.provisioningState |         |   string      | Gets the provisioning state of the PublicIP resource. Possible values are: 'Updating', 'Deleting', and 'Failed'.        |
|properties.resourceGuid      |         |   string      |  The resource GUID property of the load balancer resource.       |
|sku     |         |   LoadBalancerSku       |     The load balancer SKU.    |
|tags     |         |  <string, string>       |  Resource tags.       |

## Example: Create a load balancer

### Sample request

  ```HTTP    
  PUT https://management.azure.com/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb?api-version=2018-02-01
  ```

### Request body

  ```JSON
{
  "name": "lb",
  "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb",
  "type": "Microsoft.Network/loadBalancers",
  "location": "westus",
  "sku": {
    "name": "Basic"
  },
  "properties": {
    "provisioningState": "Succeeded",
    "frontendIPConfigurations": [
      {
        "name": "fe-lb",
        "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/frontendIPConfigurations/fe-lb",
        "properties": {
          "provisioningState": "Succeeded",
          "privateIPAddress": "10.0.1.4",
          "privateIPAllocationMethod": "Dynamic",
          "subnet": {
            "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnetlb/subnets/subnetlb"
          },
          "loadBalancingRules": [
            {
              "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/loadBalancingRules/rulelb"
            }
          ],
          "inboundNatRules": [
            {
              "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/inboundNatRules/in-nat-rule"
            }
          ]
        }
      }
    ],
    "backendAddressPools": [
      {
        "name": "be-lb",
        "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/backendAddressPools/be-lb",
        "properties": {
          "provisioningState": "Succeeded",
          "loadBalancingRules": [
            {
              "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/loadBalancingRules/rulelb"
            }
          ]
        }
      }
    ],
    "loadBalancingRules": [
      {
        "name": "rulelb",
        "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/loadBalancingRules/rulelb",
        "properties": {
          "provisioningState": "Succeeded",
          "frontendIPConfiguration": {
            "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/frontendIPConfigurations/fe-lb"
          },
          "frontendPort": 80,
          "backendPort": 80,
          "enableFloatingIP": true,
          "idleTimeoutInMinutes": 15,
          "protocol": "Tcp",
          "loadDistribution": "Default",
          "backendAddressPool": {
            "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/backendAddressPools/be-lb"
          },
          "probe": {
            "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/probes/probe-lb"
          },
          "disableOutboundSnat": false
        }
      }
    ],
    "probes": [
      {
        "name": "probe-lb",
        "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/probes/probe-lb",
        "properties": {
          "provisioningState": "Succeeded",
          "protocol": "Http",
          "port": 80,
          "requestPath": "healthcheck.aspx",
          "intervalInSeconds": 15,
          "numberOfProbes": 2,
          "loadBalancingRules": [
            {
              "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/loadBalancingRules/rulelb"
            }
          ]
        }
      }
    ],
    "inboundNatRules": [
      {
        "name": "in-nat-rule",
        "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/inboundNatRules/in-nat-rule",
        "properties": {
          "provisioningState": "Succeeded",
          "frontendIPConfiguration": {
            "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/frontendIPConfigurations/fe-lb"
          },
          "frontendPort": 3389,
          "backendPort": 3389,
          "enableFloatingIP": true,
          "idleTimeoutInMinutes": 15,
          "protocol": "Tcp"
        }
      }
    ],
    "outboundNatRules": [],
    "inboundNatPools": []
  }
}
```


