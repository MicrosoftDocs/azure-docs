---
title: Azure Cloud Services (extended support)
description: Learn about the child elements of the Network Configuration element of the service configuration file, which specifies Virtual Network and DNS values.
ms.topic: article
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Azure Cloud Services (extended support) overview

Cloud Services (extended support) is a new Azure Resource Manager based deployment model for Azure Cloud Services product and is currently in public preview. The primary benefit of Cloud Services (extended support) is providing regional resiliency along with feature parity for Cloud Services in the Azure Resource Manager paradigm . Cloud Services (extended support) will also offer Azure Resource Manager capabilities such as Role-based Access and Control (RBAC), tags, policy and support deployment templates. With this change, Azure Service Manager (ASM) based deployment model for Cloud Services will be renamed as Cloud Services (classic).

## Migration
Cloud Services (extended support) provides a path for customers to migrate from Azure Service Manager (ASM) to Azure Resource Manager . This migration path utilizes a redeploy feature where the Cloud Service is deployed in Azure Resource Manager and then deleted from Azure Service Manager (ASM). 

## Changes in deployment model

Minimal changes are required to `.cscfg` and `.csdef` files to deploy to Azure Resource Manager based Cloud Services (extended support) redeploy path. No changes are required to runtime code. However, the deployment scripts will need to be updated to call new Azure Resource Manager based APIs. 

- The Azure Resource Manager template needs to be maintained and kept consistent with `.cscfg` and `.csdef` for Cloud Services (extended support) deployments.
- Cloud Services (extended support) does not have a concept of Hosted Service. Each deployment is its own separate Cloud Service. Likewise, the concept of Staging and Production slots do not exist for Cloud Services (extended support).
- Assigning a DNS label to the Cloud Service is optional, and the DNS label is tied to the Public IP resource associated with the Cloud Service.
- While Staging and Production slots do not exist in deployments created through the Azure Resource Manager, VIP Swap continues to be supported for Cloud Services (extended support). VIP Swap can be used to swap between two Cloud Services (extended support) deployments, that are tagged as 'VIP swappable' with each other.
- Services need to use KeyVault to manage certificates in Cloud Services (extended support) and need to reference KeyVault and certificate information in `.cscfg` and Azure Resource Manager template. 
- Unlike Cloud Services (classic) where a virtual network for the Cloud Service is optional, virtual networks are mandatory for any resource deployed through the Azure Resource Manager. 
- Network Configuration File (netcfg) does not exist in Azure Resource Manager . Virtual networks & subnets in Azure Resource Manager are created through existing Azure Resource Manager APIs (netcfg is not supported in Azure Resource Manager) and referenced in the `.cscfg`, within the `NetworkConfiguration` section 

## What does not change
- You create the code, define the configurations, and deploy it to Azure. Azure sets up the compute environment, runs your code then monitors and maintains it for you.
- Cloud Services (extended support) also supports two types of roles – web and worker.
- The three components, the service definition (`.csdef`), the service config (`.cscfg`), and a service package (`.cspkg`) of a Cloud Service are carried forward and there is no change in their formats.
- No changes are required to runtime code as data plane is the same and control plane is changing.



