---
title: An introduction to the Azure Stack Development Kit (ASDK) | Microsoft Docs
description: Describes what the ASDK is and common use cases for evaluating Microsoft Azure Stack.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: overview
ms.custom: mvc
ms.date: 03/09/2018
ms.author: jeffgilb
ms.reviewer: misainat
---

# What is the Azure Stack Development Kit?
The Microsoft Azure Stack Development Kit (ASDK) is a single-node deployment of Azure Stack with all components installed in virtual machines running on a single host computer. The ASDK is meant to provide an environment in which you can evaluate and learn about Azure Stack. You can also use the ASDK in a developer environment, to develop modern applications using APIs and tooling consistent with Azure. 

> [!IMPORTANT]
> The ASDK is not intended to be used or supported in a production environment.

To get the ASDK up and running, you need to prepare the environment hardware and run some scripts (the installation takes several hours). After that, you can sign in to the admin and user portals to manage Azure Stack and test offers.

Watch this short video to learn more about the ASDK:

> [!VIDEO https://www.youtube.com/embed/dbVWDrl00MM]

### Who should be interested in the ASDK?
The ASDK is designed to provide:
- An Azure-consistent hybrid cloud experience
- Administrators (Azure Stack Operators) a way to evaluate and demonstrate Azure Stack services
- Developers a way to develop hybrid or modern applications on-premises (dev/test environments)

### Why is the ASDK important?
The ASDK provides the following benefits to Azure Stack Operators:
- **Minimum scale**. The ASDK environment is similar to the production Azure Stack integrated systems environment. This offers repeatability of development experience prior to, or alongside, Azure Stack production deployments. 
- **Simplicity**. The ASDK provides ease and speed of (re)deployment, management, operations, and the reuse of existing collateral.
- **Flexibility, low cost, low overhead**. The minimum requirements to host the ASDK can be easily procured to enable multiple deployment options from minimum requirements to large-scale single development kit host computers.

## ASDK and multi-node Azure Stack differences
The ASDK differs from multi-node Azure Stack deployments in a few ways.

- **Scale**. The ASDK is deployed to a single development kit host computer. With all components deployed on the single machine, there are limited physical resources available for user resources. With ASDK deployments, both the Azure Stack infrastructure VMs and tenant VMs coexist on the same computer. This configuration is not intended for scale or performance evaluation. Additionally, the ASDK can only be associated with a single Azure Active Directory (Azure AD) or Active Directory Federation Services (AD FS) identity provider. 

- **Resilience**. While the ASDK can be configured with mirrored storage (if the hardware meets certain requirements), the ASDK is usually configured as a simple space. In this basic configuration, each hard disk becomes a single point of failure for the entire cluster. 

- **Networking**. The ASDK uses a BGPNAT VM (which does not exist in multi-node deployments) to route ASDK network traffic. THe BGPNAT VM acts as an edge router and provides NAT and VPN capabilities for Azure Stack. So, with the ASDK, there are no switch requirements because all network traffic goes through the development kit host computer network interface card (NIC) and network or domain-specific VMs installed as part of the ASDK.  

- **Patch and update process**. ASDK deployments do not have a patch and update process like production, multi-node Azure Stack deployments. To move to a new version of the ASDK, you must redeploy the ASDK on the development kit host computer. Perform proper backup of development workloads and infrastructure-as-code artifacts

## Next steps

[Deploy the ASDK](asdk-deploy-qs.md)