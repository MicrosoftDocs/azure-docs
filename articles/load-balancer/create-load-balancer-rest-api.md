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
ms.date: 06/06/2018
ms.author: kumud
---

# Create an Azure Basic Load Balancer using REST API

An Azure Load Balancer distributes new inbound flows that arrive on the load balancer's frontend to the backend pool instances, according to rules and health probes. The Load Balancer is available in two SKUs: Basic and Standard. To understand the difference between the two SKU versions, [Load Balancer SKU comparisons](/load-balancer/load-balancer-overview.md#skus).
 
This how-to shows how to create a Azure Basic Load Balancer using [Azure REST API](/rest/api/azure/) to help load balance incoming request across multiple VMs within an Azure virtual network. 
Complete reference documentation and additional samples are available in the [Azure Load Balancer REST reference](/rest/api/load-balancer/).
 
## Build the request
Use the following HTTP PUT request to create a new Azure Basic Load Balancer.
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

The only required parameter is `location`. If you do not define the *SKU* version, a Basic Load Balancer is created by default.  Use [optional parameters](https://docs.microsoft.com/rest/api/load-balancer/loadbalancers/createorupdate#request-body) to customize the load balancer.

| Name | Type | Description |
| :--- | :--- | :---------- |
| location | string | Resource location. Get a current list of locations using the [List Locations](https://docs.microsoft.com/rest/api/resources/subscriptions/listlocations) operation. |


## Example: Create a Basic Load Balancer

In this example, you create a Basic Load Balancer along with its resources that include a frontend IP configuration (*fe-lb*), a backend address pool (*be-lb*), a load balancing rule (*rulelb*), a health probe (*probe-lb*), and an inbound NAT rule (*in-nat-rule*).

> [!IMPORTANT]
>Before you create a load balancer using the example below, you must create a virtual network with a subnet.

### Sample request

  ```HTTP    
  PUT https://management.azure.com/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb?api-version=2018-02-01
  ```

### Request body

  ```JSON
{
  "properties": {
    "frontendIPConfigurations": [
      {
        "name": "fe-lb",
        "properties": {
          "subnet": {
            "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnetlb/subnets/subnetlb"
          },
          "loadBalancingRules": [
            {
              "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/loadBalancingRules/rulelb"
            }  ],
          "inboundNatRules": [
            {
              "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/inboundNatRules/in-nat-rule"
            }  ]  }  }  ],
    "backendAddressPools": [
      {
        "name": "be-lb",
        "properties": {
          "loadBalancingRules": [
            {
              "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/loadBalancingRules/rulelb"
            }  ]   }   }   ],
    "loadBalancingRules": [
      {
        "name": "rulelb",
        "properties": {
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
          }  }  }  ],
    "probes": [
      {
        "name": "probe-lb",
        "properties": {
          "protocol": "Http",
          "port": 80,
          "requestPath": "healthcheck.aspx",
          "intervalInSeconds": 15,
          "numberOfProbes": 2,
          "loadBalancingRules": [
            {
              "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/loadBalancingRules/rulelb"
            }  ]  }  } ],
    "inboundNatRules": [
      {
        "name": "in-nat-rule",
        "properties": {
          "frontendIPConfiguration": {
            "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/frontendIPConfigurations/fe-lb"
          },
          "frontendPort": 3389,
          "backendPort": 3389,
          "enableFloatingIP": true,
          "idleTimeoutInMinutes": 15,
          "protocol": "Tcp"
        } } ],
    "inboundNatPools": [],
    "outboundNatRules": []
  }  }
```