---
title: Azure Service Fabric Application and Cluster Best Practices | Microsoft Docs
description: Best practices for managing Service Fabric clusters and applications.
services: service-fabric
documentationcenter: .net
author: dkkapur
manager: timlt
editor: ''

ms.assetid: 19ca51e8-69b9-4952-b4b5-4bf04cded217
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: 
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 11/28/2018
ms.author: pepogors

---
## Azure Service Fabric Application and Cluster Best Practices
To manage Azure Service Fabric applications and clusters successfully, there are operations that we highly recommend you preform for the reliability of your production environment.  

## Security 
For more information about [Azure Security Best Practices](https://docs.microsoft.com/en-us/azure/security/) and check out [Azure Service Fabric security best practices](https://docs.microsoft.com/azure/security/azure-service-fabric-security-best-practices)
### KeyVault
[Azure KeyVault](https://docs.microsoft.com/azure/key-vault/) is the recommended secrets management service for Azure Service Fabric applications and clusters. Azure KeyVault and compute resources must be co-located in the same region.  
### CommonName Certificates
Azu
### Encrypting Secret Values 
### Azure Active Directory (AAD) for client identity
### Compute Managed Service Identity (MSI)

## Networking
For more information about networking
### Network Security Group (NSG)
### Subnets 
### Azure Traffic Manager and Azure Load Balancer

## Capacity Planning and Scaling
For more information ....
### Vertical Scaling
### Horizontal Scaling 

## Infrastructure as Code 
### Service Fabric ARM Resources 
-Link the API Docs for SFRP

## Telemetry and Monitoring
- Sravan to provide Docs

> [!NOTE]
> For
>

For more information on setting up standalone Service Fabric clusters on Windows Server, read [Service Fabric cluster creation for Windows Server](service-fabric-cluster-creation-for-windows-server.md)

  > [!NOTE]
  > Standalone clusters currently aren't supported for Linux. Linux is supported on one-box for development and Azure Linux multi-machine clusters.
  >


## Next steps

* Create a cluster on VMs or computers running Windows Server: [Service Fabric cluster creation for Windows Server](service-fabric-cluster-creation-for-windows-server.md)
* Create a cluster on VMs or computers running Linux: [Create a Linux cluster](service-fabric-cluster-creation-via-portal.md)
* Learn about [Service Fabric support options](service-fabric-support.md)

