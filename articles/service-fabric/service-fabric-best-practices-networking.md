---
title: Azure Service Fabric networking best practices | Microsoft Docs
description: Best practices for managing Service Fabric networking.
services: service-fabric
documentationcenter: .net
author: peterpogorski
manager: chackdan 
editor: ''
ms.assetid: 19ca51e8-69b9-4952-b4b5-4bf04cded217
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 01/23/2019
ms.author: pepogors
---

# Networking

As you create and manage Azure Service Fabric clusters, you are providing network connectivity for your nodes and applications. The networking resources include IP address ranges, virtual networks, load balancers, and network security groups. In this article, you will learn best practices for these resources.

Review Azure [Service Fabric Networking Patterns](https://docs.microsoft.com/azure/service-fabric/service-fabric-patterns-networking) to learn how to create clusters that use the following features: Existing virtual network or subnet, Static public IP address, Internal-only load balancer, or Internal and external load balancer.

## Infrastructure Networking
Maximize your Virtual Machine’s performance with Accelerated Networking, by declaring enableAcceleratedNetworking property in your Resource Manager template, the following snippet is of a Virtual Machine Scale Set NetworkInterfaceConfigurations that enables Accelerated Networking:

```json
"networkInterfaceConfigurations": [
  {
    "name": "[concat(variables('nicName'), '-0')]",
    "properties": {
      "enableAcceleratedNetworking": true,
      "ipConfigurations": [
        {
        <snip>
        }
      ],
      "primary": true
    }
  }
]
```
Service Fabric cluster can be provisioned on [Linux with Accelerated Networking](https://docs.microsoft.com/azure/virtual-network/create-vm-accelerated-networking-cli), and [Windows with Accelerated Networking](https://docs.microsoft.com/azure/virtual-network/create-vm-accelerated-networking-powershell).

Accelerated Networking is supported for Azure Virtual Machine Series SKUs: D/DSv2, D/DSv3, E/ESv3, F/FS, FSv2, and Ms/Mms. Accelerated Networking was tested successfully using the Standard_DS8_v3 SKU on 1/23/2019 for a Service Fabric Windows Cluster, and using Standard_DS12_v2 on 01/29/2019 for a Service Fabric Linux Cluster.

To enable Accelerated Networking on an existing Service Fabric cluster, you need to first [Scale a Service Fabric cluster out by adding a Virtual Machine Scale Set](https://docs.microsoft.com/azure/service-fabric/virtual-machine-scale-set-scale-node-type-scale-out), to perform the following:
1. Provision a NodeType with Accelerated Networking enabled
2. Migrate your services and their state to the provisioned NodeType with Accelerated Networking enabled

Scaling out infrastructure is required to enable Accelerated Networking on an existing cluster, because enabling Accelerated Networking in place would cause downtime, as it requires all virtual machines in an availability set be [stop and deallocate before enabling Accelerated networking on any existing NIC](https://docs.microsoft.com/azure/virtual-network/create-vm-accelerated-networking-cli#enable-accelerated-networking-on-existing-vms).

## Cluster Networking

* Service Fabric clusters can be deployed into an existing virtual network by following the steps outlined in [Service Fabric networking patterns](https://docs.microsoft.com/azure/service-fabric/service-fabric-patterns-networking).

* Network security groups (NSGs) are recommended for node types that restrict inbound and outbound traffic to their cluster. Ensure that the necessary ports are opened in the NSG. For example: 
![Service Fabric NSG Rules][NSGSetup]

* The primary node type, which contains the Service Fabric system services does not need to be exposed via the external load balancer and can be exposed by an [internal load balancer](https://docs.microsoft.com/azure/service-fabric/service-fabric-patterns-networking#internal-only-load-balancer)

* Use a [static public IP address](https://docs.microsoft.com/azure/service-fabric/service-fabric-patterns-networking#static-public-ip-address-1) for your cluster.

## Application Networking

* To run Windows container workloads, use [open networking mode](https://docs.microsoft.com/azure/service-fabric/service-fabric-networking-modes#set-up-open-networking-mode) to make service-to-service communication easier.

* Use a reverse proxy such as [Traefik](https://docs.traefik.io/configuration/backends/servicefabric/) or the [Service Fabric reverse proxy](https://docs.microsoft.com/azure/service-fabric/service-fabric-reverseproxy) to expose common application ports such as 80 or 443.

* For Windows Containers hosted on air-gapped machines that can't pull base layers from Azure cloud storage, override the foreign layer behavior, by using the [--allow-nondistributable-artifacts](https://docs.microsoft.com/virtualization/windowscontainers/about/faq#how-do-i-make-my-container-images-available-on-air-gapped-machines) flag in the Docker daemon.

## Next steps

* Create a cluster on VMs or computers running Windows Server: [Service Fabric cluster creation for Windows Server](service-fabric-cluster-creation-for-windows-server.md)
* Create a cluster on VMs or computers running Linux: [Create a Linux cluster](service-fabric-cluster-creation-via-portal.md)
* Learn about [Service Fabric support options](service-fabric-support.md)

[NSGSetup]: ./media/service-fabric-best-practices/service-fabric-nsg-rules.png
