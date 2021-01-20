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


Cloud Services (extended support) is a new [Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/management/overview) based deployment model for the [Azure Cloud Services](https://azure.microsoft.com/services/cloud-services/) product. The primary benefit of Cloud Services (extended support) is providing regional resiliency along with feature parity for Cloud Services in [Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/management/overview). Cloud Services (extended support) also offers capabilities such as Role-based Access and Control (RBAC), tags and deployment templates. With this change, Azure Service Manager based deployment model for Cloud Services will be renamed as [Cloud Services (classic)](../cloud-services/cloud-services-choose-me.md). 

 You will retain the ability to build and rapidly deploy your web and cloud applications and services. You will be able to scale your cloud services infrastructure based on current demand and ensure that the performance of your applications can keep up while simultaneously reducing costs.  

Cloud Services (extended support) provides two paths for you to migrate from ASM to ARM. One path is to ‘re-deploy’, where customers deploy cloud services directly in ARM and then delete the old cloud service in ASM after thorough validation. The second path is to execute an ‘in-place migration’ that gives you the ability to migrate cloud services (classic) to ARM with minimal to no downtime. 

The ‘re-deploy’ path of Cloud Services (extended support) is currently in preview, while the ‘in-place migration’ path will be announced soon. 

## Additional Azure services to consider for migration to ARM

When evaluating migration plans from Cloud Services (classic) to Cloud Services (extended support) you may want to investigate the opportunity of taking advantage of additional Azure services such as: Virtual Machine Scale Sets, App Service, Azure Kubernetes Service, and Azure Service Fabric. These services will continue to feature additional capabilities, while Cloud Services (extended support) will primarily maintain feature parity with Cloud Services (classic.) 

Depending on the application, Cloud Services (extended support) may require substantially less effort to move to ARM compared to other options. If your application is not evolving, Cloud Services (extended support) is a viable option to consider as it provides a quick migration path. Conversely, if your application is continuously evolving and needs a more modern feature set, do explore other Azure services to better address your current and future requirements. 

## Changes in deployment model

Minimal changes are required to cscfg and csdef files to deploy Cloud Services (extended support). No changes are required to runtime code however, deployment scripts will need to be updated to call new Azure Resource Manager based APIs. 

:::image type="content" source="media/overview-image-1.png" alt-text="Image shows classic cloud service configuration with addition of template section. ":::

- The Azure Resource Manager templates need to be maintained and kept consistent with the cscfg and csdef files for Cloud Services (extended support) deployments.
- Cloud Services (extended support) does not have a concept of hosted service. Each deployment is a separate Cloud Service.
- The concept of staging and production slots do not exist for Cloud Services (extended support).
- Assigning a [DNS label](https://docs.microsoft.com/azure/dns/dns-zones-records) to the Cloud Service is optional and the DNS label is tied to the public IP resource associated with the Cloud Service.
- [VIP Swap](cloud-services-swap.md) continues to be supported for Cloud Services (extended support). [VIP Swap](cloud-services-swap.md) can be used to swap between two Cloud Service (extended support) deployments.
- Cloud Services (extended support) requires [Key Vault](https://docs.microsoft.com/azure/key-vault/general/overview) to manage certificates. The cscfg file and templates require referencing the Key Vault to obtain the certificate information. 
- [Virtual networks](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview) are required to deploy Cloud Services (extended support).
- The Network Configuration File (netcfg) does not exist in [Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/management/overview). Virtual networks and subnets in Azure Resource Manager are created through existing Azure Resource Manager APIs and referenced in the cscfg within the `NetworkConfiguration` section.

## What does not change 
- You create the code, define the configurations, and deploy it to Azure. Azure sets up the compute environment, runs your code then monitors and maintains it for you.  (change)
- Cloud Services (extended support) also supports two types of roles, web and worker. 
- The three components, the service definition (.csdef), the service config (.cscfg), and a service package (.cspkg) of a cloud service are carried forward and there is no change in the their formats. 
•	No changes are required to runtime code as data plane is the same and control plane is only changing. 


## Next steps
Deploy a Cloud Service (extended support) using the [Azure portal](deploy-portal.md), [PowerShell](deploy-powershell.md), [Template](deploy-template.md) or [Visual Studio](deploy-visual-studio.md)