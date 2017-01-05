---
title: Microsoft Azure Stack Proof Of Concept (POC) architecture | Microsoft Docs
description: View the Microsoft Azure Stack POC architecture.
services: azure-stack
documentationcenter: ''
author: heathl17
manager: byronr
editor: ''

ms.assetid: a7e61ea4-be2f-4e55-9beb-7a079f348e05
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/04/2017
ms.author: helaw

---
# Microsoft Azure Stack POC architecture
The Azure Stack POC is a one-node deployment of Azure Stack Technical Preview 2. All the components are installed in virtual machines running on a single host machine. 

## Logical architecture diagram
The following diagram illustrates the logical architecture of the Azure Stack POC and its components.

![](media/azure-stack-architecture/image1.png)

## Virtual machine roles
The Azure Stack POC offers services using the following VMs on the POC host:

| Name | Description |
| ----- | ----- |
| **MAS-ACS01** | Hosts Azure Stack storage services.|
| **MAS-ADFS01** | Hosts Active Directory Federation Services.  This virtual machine is not used in Technical Preview 2. |
| **MAS-ASQL01** | Provides an internal data store for Azure Stack infrastructure roles.  |
| **MAS-BGPNAT01** | Acts as an edge router and provides NAT and VPN capabilities for Azure Stack. |
| **MAS-CA01** | Provides certificate authority services for Azure Stack role services.|
| **MAS-CON01** | Console machine available for installing PowerShell, Visual Studio, and other tools.|
| **MAS-DC01** | Hosts Active Directory, DNS, and DHCP services for Microsoft Azure Stack.|
| **MAS-GWY01** | Provides edge gateway services such as VPN site-to-site connections for tenant networks.|
| **MAS-NC01** | Hosts the Network Controller, which manages Azure Stack network services.  |
| **MAS-SLB01** | Provides load balancing services in Azure Stack for both tenants and Azure Stack infrastructure services.  |
| **MAS-SUS01** | Hosts Windows Server Update Services, and responsible for providing updates to other Azure Stack virtual machines.|
| **MAS-WAS01** | Hosts Azure Stack portal and Azure Resource Manager services.|
| **MAS-XRP01** | Hosts the core resource providers of Microsoft Azure Stack, including the Compute, Network, and Storage resource providers.|

## Storage services
**Virtual Disk**, **Storage Space**, and **Storage Spaces Direct** are the respective underlying storage technology in Windows Server that enable the Microsoft Azure Stack storage resource provider.  Additional storage services installed in the operating system on the physical host include:

| Name | Description |
| ----- | ----- |
| **ACS Blob Service** | Azure Consistent Storage Blob service, which provides blob and table storage services. |
| **SoFS** | Scale-out File Server.|
| **ReFS CSV** |Resilient File System Cluster Shared Volume.|


## Next steps
[Deploy Azure Stack](azure-stack-deploy.md)

[First scenarios to try](azure-stack-first-scenarios.md)

