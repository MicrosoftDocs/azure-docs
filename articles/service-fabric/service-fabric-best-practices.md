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
### Link to a production ready ARM Template!!!

## Azure Service Fabric Application and Cluster Best Practices
To manage Azure Service Fabric applications and clusters successfully, there are some non-default operations that we highly recommend you preform, to optimize for the reliability of your production environment.  

## Security 
For more information about [Azure Security Best Practices](https://docs.microsoft.com/en-us/azure/security/) please check out [Azure Service Fabric security best practices](https://docs.microsoft.com/azure/security/azure-service-fabric-security-best-practices)
### KeyVault
[Azure KeyVault](https://docs.microsoft.com/azure/key-vault/) is the recommended secrets management service for Azure Service Fabric applications and clusters.
> [!NOTE]
> Azure KeyVault and compute resources must be co-located in the same region.  

-- Portal Blade Common Name Cert Generation
-- Deploy Certificate URL for VMSS Resource
### CommonName Certificates
-- How to SF extension ACKL 
-- SF Cluster Resource Common Name properties
-- Provide context around bringing your own custom domain
### Encrypting Secret Values 
-- PowerShell way
-- OpenSSL way
### Azure Active Directory (AAD) for client identity
-- ARM properties for enabling AAD
### Compute Managed Service Identity (MSI)
-- VMSS MSI enable system assign, link to user assigned docs
-- Code snippet consuming
### Security Policies
-- XML manifest for run as 
### Windows Defender 
-- Windows defender for VMSS extension, and whitelist properties
## Networking
For more information about networking
### Network Security Group (NSG)
-- ARM template with port rules, link to the portal
### Subnets 
-- Each scale set has its own subnet
-- Show a snippet of a subnet and IP configuration - Network profile of VMSS 
### Azure Traffic Manager and Azure Load Balancer
-- You should provision a Traffic Manager, to ensure that you have a naming service to any backend
-- 1 TM to Multiple LBs, TM Profile
-- Link to DNS aliasing for TM and for LB
## Capacity Planning and Scaling
-- Link to first doc for Capacity Planning and Scaling. You can also programatically and manually - link to them. 
-- A production scaling operation will take at least 30 min plan accordingly, and can take up to several hours. Tradeoff between performance and safety.
### Vertical 
-- Vertical scaling requires a horizontal scale to the appropriate SKU followed by a migration. Based on placement constraints.
-- NodeTypeRef property shown
-- Vertical scaling doc that talks about it
### Horizontal Scaling 
-- Show the VMSS and SF NodeTypeCount properties
-- capacity VMMS instance count, NodeType instance count
### Durability and Reliability Levels
-- Provide the code snippets of the setting of these levels - VM extension, SF resource
-- You should use Silver of greater for your needs. PrimaryNodeType is stateful, if your services running on other node types are also stateful they should be silver. 
## Infrastructure as Code 
-- Sample repo link and API documentation. Modify these samples for these needs.
-- Portal should not be used to provision a production ready cluster.
-- deployment using AZ CLI and Powershell
-- The create SF powershell cmdlet should only be used for dev test
### Service Fabric ARM Resources 
-- JSON Snippet of the types of SF 
-- Cluster, Application, Application Version, Application Type, Service Version, Service Type
-- Link to packaging, explicity put Zip File create from directory. Need to do this to use this resource type. If you are on Linux use a different ZIP file utility. Put the Python snippet.
## Telemetry and Monitoring
-- How you can objectively define performance etc
-- Sravan to provide Docs


## Next steps

* Create a cluster on VMs or computers running Windows Server: [Service Fabric cluster creation for Windows Server](service-fabric-cluster-creation-for-windows-server.md)
* Create a cluster on VMs or computers running Linux: [Create a Linux cluster](service-fabric-cluster-creation-via-portal.md)
* Learn about [Service Fabric support options](service-fabric-support.md)

