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
ms.date: 06/04/2018
ms.author: kumud
---

# Create a load balancer using REST API

This how-to shows how to create a new [Azure Load Balancer](load-balancer-overview.md) using [Azure REST API](/rest/api/azure/). 
Complete reference documentation and additional samples are available in the [Azure Load Balancer REST reference](/rest/api/load-balancer/).
 

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

The only required parameter is `location`. Use [optional parameters](/rest/api/load-balancer/loadbalancers/createorupdate.md#request-body) to customize the database.

| Name | Type | Description |
| :--- | :--- | :---------- |
| location | string | Resource location. Get a current list of locations using the [List Locations](/rest/api/resources/subscriptions/listlocations) operation. |

## Example: Create a load balancer

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