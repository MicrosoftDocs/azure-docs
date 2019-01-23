---
title: Azure Service Fabric Networking Best Practices | Microsoft Docs
description: Best practices for managing Service Fabric networking.
services: service-fabric
documentationcenter: .net
author: peterpogorski
manager: jeanpaul.connock 
editor: ''
ms.assetid: 19ca51e8-69b9-4952-b4b5-4bf04cded217
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: 
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 01/23/2019
ms.author: pepogors
---

# Networking

As you create and manage Azure Service Fabric clusters, you are providing network connectivity for your nodes and applications. The networking resources include IP address ranges, virtual networks, load balancers and network security groups. In this article, you will learn best practices for these resources.

Review Azure [Service Fabric Networking Patterns](https://docs.microsoft.com/azure/service-fabric/service-fabric-patterns-networking) to learn how to create clusters that use the following features: Existing virtual network or subnet, Static public IP address, Internal-only load balancer, or Internal and external load balancer.

## Infrastructure Networking
Maximize your Virtual Machine’s performance with Accelerated Networking, by declaring enableAcceleratedNetworking to true in your Resource Manager template, setting your Virtual Machine Scale Set resource enableAcceleratedNetworking  networkInterfaceConfiguration property 
```json
"networkInterfaceConfigurations": [
  {
    "name": "[concat(variables('nicName'), '-0')]",
    "properties": {
      "enableAcceleratedNetworking": true,
      "ipConfigurations": [
        {
        "name": "[concat(variables('nicName'),'-',0)]",
        "properties": {
          "loadBalancerBackendAddressPools": [
            {
              "id": "[variables('lbPoolID0')]"
            }
          ],
          "loadBalancerInboundNatPools": [
            {
              "id": "[variables('lbNatPoolID0')]"
            }
          ],
          "subnet": {
            "id": "[variables('subnet0Ref')]"
          }
         }
        }
      ],
      "primary": true
    }
  }
]
```

## Cluster Networking

* Service Fabric clusters can be deployed into an existing virtual network by following the steps outlined in [Service Fabric networking patterns](https://docs.microsoft.com/azure/service-fabric/service-fabric-patterns-networking).

* Network security groups (NSGs) are recommended for node types that restrict inbound and outbound traffic to their cluster. Ensure that the necessary ports are opened in the NSG. For example: 
![Service Fabric NSG Rules][NSGSetup]

* The primary nodetype which contains the Service Fabric system services does not need to be exposed via the external load balancer and can be exposed by an [internal load balancer](https://docs.microsoft.com/azure/service-fabric/service-fabric-patterns-networking#internal-only-load-balancer)

* Use a [static public IP address](https://docs.microsoft.com/azure/service-fabric/service-fabric-patterns-networking#static-public-ip-address-1) for your cluster.

## Application Networking

* To run Windows container workloads, use [open networking mode](https://docs.microsoft.com/azure/service-fabric/service-fabric-networking-modes#set-up-open-networking-mode) to make service-to-service communication easier.

* Use a reverse proxy such as [Traefik](https://docs.traefik.io/configuration/backends/servicefabric/) or the [Service Fabric reverse proxy](https://docs.microsoft.com/azure/service-fabric/service-fabric-reverseproxy) to expose common application ports such as 80 or 443.

## Next steps

* Create a cluster on VMs or computers running Windows Server: [Service Fabric cluster creation for Windows Server](service-fabric-cluster-creation-for-windows-server.md)
* Create a cluster on VMs or computers running Linux: [Create a Linux cluster](service-fabric-cluster-creation-via-portal.md)
* Learn about [Service Fabric support options](service-fabric-support.md)

[NSGSetup]: ./media/service-fabric-best-practices/service-fabric-nsg-rules.png
