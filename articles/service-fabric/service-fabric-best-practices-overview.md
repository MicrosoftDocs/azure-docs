---
title: Azure Service Fabric application and cluster best practices | Microsoft Docs
description: Best practices for managing Service Fabric clusters and applications.
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

# Azure Service Fabric application and cluster best practices

To manage Azure Service Fabric applications and clusters successfully, there are operations that we highly recommend you perform, to optimize for the reliability of your production environment; please perform operations defined in this document, and select one of our [Azure Samples Service Fabric Cluster templates](https://github.com/Azure-Samples/service-fabric-cluster-templates) to begin designing your production solution or modify your existing template to incorporate these practices.

## Security 

* [Best practices for security](service-fabric-best-practices-security.md)

## Networking

* [Best practices for networking](service-fabric-best-practices-networking.md)

## Compute planning and scaling

* [Best practices for compute scaling](service-fabric-best-practices-capacity-scaling.md)
* [Compute capacity planning](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-capacity)

## Infrastructure as code

* [Best practices for implementing infrastructure as code](service-fabric-best-practices-infrastructure-as-code.md)

## Monitoring and diagnostics

* [Best practices for cluster monitoring and diagnostics](service-fabric-best-practices-monitoring.md)

## Checklist

Once you have completed all of the sections above, ensure that you have integrated all of the best practices in the production readiness checklist:
* [Azure Service Fabric Production Readiness Checklist](https://docs.microsoft.com/azure/service-fabric/service-fabric-production-readiness-checklist)

## Next steps

* Create a cluster on VMs or computers running Windows Server: [Service Fabric cluster creation for Windows Server](service-fabric-cluster-creation-for-windows-server.md)
* Create a cluster on VMs or computers running Linux: [Create a Linux cluster](service-fabric-cluster-creation-via-portal.md)
* Troubleshooting: [Service Fabric troubleshooting guide](https://github.com/Azure/Service-Fabric-Troubleshooting-Guides)