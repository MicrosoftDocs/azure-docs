---
title: About Azure Cloud Services (extended support)
description: Learn about the child elements of the Network Configuration element of the service configuration file, which specifies Virtual Network and DNS values.
ms.topic: overview
ms.service: azure-cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 07/24/2024
ms.custom: devx-track-arm-template
# Customer intent: As an IT admin managing legacy cloud applications, I want to migrate to Azure Resource Manager-based Cloud Services (extended support) so that I can enhance regional resiliency, utilize modern management features like RBAC and templates, and streamline operations with minimal application changes.
---
# About Azure Cloud Services (extended support)

> [!IMPORTANT]
> As of March 31, 2025, cloud Services (extended support) is deprecated and will be fully retired on March 31, 2027. [Learn more](https://aka.ms/csesretirement) about this deprecation and [how to migrate](https://aka.ms/cses-retirement-march-2025).

Cloud Services (extended support) is a new [Azure Resource Manager](../azure-resource-manager/management/overview.md) based deployment model for [Azure Cloud Services](https://azure.microsoft.com/services/cloud-services/) product and is now generally available. Cloud Services (extended support) has the primary benefit of providing regional resiliency along with feature parity with Azure Cloud Services deployed using Azure Service Manager. It also offers some Azure Resource Manager capabilities such as role-based access and control (RBAC), tags, policy, and supports deployment templates.  

With this change, the Azure Service Manager based deployment model for Cloud Services is renamed to [Cloud Services (classic)](../cloud-services/cloud-services-choose-me.md). You retain the ability to build and rapidly deploy your web and cloud applications and services. You're able to scale your cloud services infrastructure based on current demand and ensure that the performance of your applications can keep up while simultaneously reducing costs.  

:::image type="content" source="media/inside-azure-for-iot.png" alt-text="YouTube video for Cloud Services (extended support)." link="https://youtu.be/H4K9xTUvNdw":::


## What doesn't change 
- You create the code, define the configurations, and deploy it to Azure. Azure sets up the compute environment, runs your code then monitors and maintains it for you.
- Cloud Services (extended support) also supports two types of roles, [web and worker](../cloud-services/cloud-services-choose-me.md). There are no changes to the design, architecture, or components of web and worker roles. 
- The three components of a cloud service, the service definition (.csdef), the service config (.cscfg), and the service package (.cspkg) are carried forward and there's no change in the [formats](cloud-services-model-and-package.md). 
- No changes are required to runtime code as data plane is the same and control plane is only changing. 
- Azure GuestOS releases and associated updates are aligned with Cloud Services (classic)
- Underlying update process with respect to update domains, how upgrade proceeds, rollback and allowed service changes during an update don't change

## Changes in deployment model

Minimal changes are required to Service Configuration (.cscfg) and Service Definition (.csdef) files to deploy Cloud Services (extended support). No changes are required to runtime code. However, deployment scripts need to be updated to call the new Azure Resource Manager based APIs. 

:::image type="content" source="media/overview-image-1.png" alt-text="Image shows classic cloud service configuration with addition of template section. ":::

The major differences between Cloud Services (classic) and Cloud Services (extended support) with respect to deployment are: 

- Azure Resource Manager deployments use [ARM templates](../azure-resource-manager/templates/overview.md), which is a JavaScript Object Notation (JSON) file that defines the infrastructure and configuration for your project. The template uses declarative syntax, which lets you state what you intend to deploy without having to write the sequence of programming commands to create it. Service Configuration and Service definition file needs to be consistent with the [ARM Template](../azure-resource-manager/templates/overview.md) while deploying Cloud Services (extended support). This can be achieved either by [manually creating the ARM template](deploy-template.md) or using [PowerShell](deploy-powershell.md), [Portal](deploy-portal.md), and [Visual Studio](deploy-visual-studio.md).  

- Customers must use [Azure Key Vault](/azure/key-vault/general/overview) to [manage certificates in Cloud Services (extended support)](certificates-and-key-vault.md). Azure Key Vault lets you securely store and manage application credentials such as secrets, keys, and certificates in a central and secure cloud repository. Your applications can authenticate to Key Vault at run time to retrieve credentials. 

- All resources deployed through the [Azure Resource Manager](../azure-resource-manager/templates/overview.md) must be inside a virtual network. Virtual networks and subnets are created in Azure Resource Manager using existing Azure Resource Manager APIs. They need to be referenced within the NetworkConfiguration section of the .cscfg when deploying Cloud Services (extended support).   

- Each cloud service (extended support) is a single independent deployment. Cloud Services (extended support) doesn't support multiple slots within a single cloud service.  
    - VIP Swap capability may be used to swap between two cloud services (extended support). To test and stage a new release of a cloud service, deploy a cloud service (extended support) and tag it as VIP swappable with another cloud service (extended support)  

- Domain Name Service (DNS) label is optional for a cloud service (extended support). In Azure Resource Manager, the DNS label is a property of the Public IP resource associated with the cloud service. 

## Migration to Azure Resource Manager

Cloud Services (extended support) provides two paths for you to migrate from [Azure Service Manager](/powershell/azure/servicemanagement/overview) to [Azure Resource Manager](../azure-resource-manager/management/overview.md). 
1) Customers deploy cloud services directly in Azure Resource Manager and then delete the old cloud service in Azure Service Manager. 
2) In-place migration supports the ability to migrate Cloud Services (classic) with minimal to no downtime to Cloud Services (extended support). 

### Additional migration options

When evaluating migration plans from Cloud Services (classic) to Cloud Services (extended support), you may want to investigate other Azure services such as: [Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/overview), [App Service](../app-service/overview.md), [Azure Kubernetes Service](/azure/aks/intro-kubernetes), and [Azure Service Fabric](/azure/service-fabric/service-fabric-overview). These services continue to feature additional capabilities, while Cloud Services (extended support) maintains feature parity with Cloud Services (classic.) 

Depending on the application, Cloud Services (extended support) may require substantially less effort to move to Azure Resource Manager compared to other options. If your application isn't evolving, Cloud Services (extended support) is a viable option to consider as it provides a quick migration path. Conversely, if your application is continuously evolving and needs a more modern feature set, do explore other Azure services to better address your current and future requirements. 

## Next steps
- Review the [deployment prerequisites](deploy-prerequisite.md) for Cloud Services (extended support).
- Deploy a Cloud Service (extended support) using the [Azure portal](deploy-portal.md), [PowerShell](deploy-powershell.md), [Template](deploy-template.md) or [Visual Studio](deploy-visual-studio.md).
- Review [frequently asked questions](faq.yml) for Cloud Services (extended support).
