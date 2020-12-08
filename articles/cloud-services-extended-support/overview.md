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

Cloud Services (extended support) is a new Azure Resource Manager based deployment model for the Azure Cloud Services product. The primary benefit of Cloud Services (extended support) is providing regional resiliency along with feature parity for Cloud Services in  Azure Resource Manager. Cloud Services (extended support) also offers capabilities such as Role-based Access and Control (RBAC), tags and deployment templates. With this change, Azure Service Manager based deployment model for Cloud Services will be renamed as Cloud Services (classic).

## Migration
Cloud Services (extended support) provides a path for customers to migrate from Azure Service Manager to Azure Resource Manager. This migration path utilizes a redeploy feature where the Cloud Service is deployed with Azure Resource Manager and then deleted from Azure Service Manager. 

## Changes in deployment model

Minimal changes are required to cscfg and csdef files to deploy Cloud Services (extended support). No changes are required to runtime code. The deployment scripts will need to be updated to call new Azure Resource Manager based APIs. 

- The Azure Resource Manager templates need to be maintained and kept consistent with the cscfg and csdef files for Cloud Services (extended support) deployments.
- Cloud Services (extended support) does not have a concept of hosted service. Each deployment is a separate Cloud Service.
- The concept of staging and production slots do not exist for Cloud Services (extended support).
- Assigning a DNS label to the Cloud Service is optional and the DNS label is tied to the public IP resource associated with the Cloud Service.
- VIP Swap continues to be supported for Cloud Services (extended support). VIP Swap can be used to swap between two Cloud Services (extended support) deployments.
- Cloud Service (extended support) requires Key Vault to manage certificates. The cscfg file and templates require referencing the Key Vault to obtain the certificate information. 
- Virtual networks are required to deploy Cloud Services (extended support).
- The Network Configuration File (netcfg) does not exist in Azure Resource Manager . Virtual networks and subnets in Azure Resource Manager are created through existing Azure Resource Manager APIs and referenced in the cscfg within the `NetworkConfiguration` section.

## What does not change
- Users create the code, define the configurations, and handle deployments. Azure sets up the environment, runs the code, monitors and maintains it.
- Cloud Services (extended support) supports two types of roles. Web roles and worker roles.
- The service definition (csdef), the service config (cscfg) and a service package (cspkg) for Cloud Services (extended support) have no change in formats.
- No changes are required with runtime code.

## Next steps
To start using Cloud Services (extended support), see [Deploy a Cloud Service (extended support) using PowerShell](deploy-powershell.md)