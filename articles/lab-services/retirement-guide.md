---
title: Azure Lab Services retirement guide
description: Learn about the Azure Lab Services retirement schedule and how to transition to Microsoft or partner services.
ms.topic: how-to
ms.date: 07/08/2024

# customer intent: As an Azure Lab Services customer, I want to understand the Azure Lab Services retirement schedule and what Microsoft and partners services I can transition to.
---

# Azure Lab Services retirement guide

Azure Lab Services will be retired on June 28, 2027. The Azure Lab Services retirement guide presents options available for you to transition to other Microsoft services or Microsoft recommended partner solutions.

> [!Note] 
> Transition your Azure Labs Services workflows to a Microsoft service or Microsoft partner solution by June 28, 2027. Azure Lab Services will be fully retired on this date.

**Action Required:** To avoid any service disruptions, you are strongly recommended to review this transition guide to choose the most suitable solution for your requirements by **June 28, 2027**. To learn about transitioning to other Microsoft services and partner solutions, follow this documentation.

## Transition guidance overview
This section provides links to Microsoft and partner solutions that cover the breadth of Azure Lab Services capabilities. Also included are links that can help you with your transition from Azure Lab Services.

### Microsoft solutions
There are various Microsoft solutions that you might consider as a direct replacement for Azure Lab Services. Each of these Microsoft solutions offers browser-based web access. While these solutions aren’t necessarily education-specific, they support a wide range of education and training scenarios. 

### Azure Virtual Desktop
[Azure Virtual Desktop](https://azure.microsoft.com/products/virtual-desktop/) is a comprehensive desktop and app virtualization service running in the cloud, offering secure, and scalable virtual desktop experiences with usage-based pricing. It’s ideal for providing full desktop and app delivery scenarios for Windows 10/11 with maximum control to any device from a flexible cloud virtual desktop infrastructure (VDI) platform on your Azure infrastructure and by using Microsoft Entra ID for user identities. Azure Virtual Desktop supports CPU/GPU-based Microsoft Entra ID joined virtual machines, content filtering, image management from Azure Marketplace or Azure compute gallery, centralized end-to-end management with Intune, and multi-session capabilities. 

#### How can I get started with Azure Virtual Desktop?
- [What is Azure Virtual Desktop?](/azure/virtual-desktop/overview)
- [Azure landing zones for Azure Virtual Desktop instances](/azure/cloud-adoption-framework/scenarios/azure-virtual-desktop/ready)

### Azure DevTest Labs
[Azure DevTest Labs](https://azure.microsoft.com/products/devtest-lab/) simplifies creation, usage, and management of infrastructure-as-a-service (IaaS) virtual machines within a lab context with usage-based pricing. It’s ideal for computer programming related courses and those users familiar with the Azure portal. Azure DevTest Labs supports Linux and Windows CPU/GPU-based virtual machines, student admin access, network isolated labs, nested virtualization, and image management from Azure Marketplace or Azure compute gallery.

#### How can I get started with Azure DevTest Labs?
- [What is Azure DevTest Labs?](/azure/devtest-labs/devtest-lab-overview)
- [Popular scenarios for using Azure DevTest Labs](/azure/devtest-labs/devtest-lab-guidance-get-started)

### Windows 365 Cloud PC
[Windows 365 Cloud PC](https://www.microsoft.com/windows-365) is a highly available, optimized, and scalable virtual machine that provides end users with a rich Windows desktop experience, hosted in the Windows 365 service and is accessible from anywhere, on any device with predictable subscription pricing. Cloud PC virtual machines are Microsoft Entra ID joined and support centralized end-to-end management using Microsoft Intune. 

#### How can I get started with Windows 365 Cloud PC?
- [What is Windows 365?](/windows-365/enterprise/overview)

### Microsoft Dev Box 
[Microsoft Dev Box](https://azure.microsoft.com/products/dev-box/) offers cloud-based workstations preconfigured with tools and environments for developer workflow-specific tasks with usage-based pricing. It’s ideal for facilitating hands-on learning where training leaders can use Dev Box supported images to create identical virtual machines for trainees. Dev Box virtual machines are Microsoft Entra ID joined and support centralized end-to-end management with Microsoft Intune.

#### How can I get started with Microsoft Dev Box?
- [What is Microsoft Dev Box?](/azure/dev-box/overview-what-is-microsoft-dev-box)

### Partner solutions

Our partners specialize in education-focused solutions for training and classrooms. Labs created with these Microsoft partners solutions will be using Azure in the backend, where lab provisioning can be configured to specific Azure regions for low latency and data residency requirements. Our recommended partners also provide transition guides and support to help you move your lab scenarios in Azure Lab Services to their respective services (the following list is in alphabetical order):
 
- [Apporto](https://aka.ms/azlabs-apporto)  
- [CloudLabs by Spektra Systems](https://aka.ms/azlabs-spektra) 
- [Nerdio Manager for Enterprise (NME)](https://aka.ms/azlabs-nerdio) (requires and uses Azure Virtual Desktop)
- [Skillable](https://aka.ms/azlabs-skillable)

Each partner solution supports browser-based web access, cost controls, Azure compute gallery images, and CPU/GPU-based virtual machines. Labs created with these partner solutions will be hosted on Azure, where provisioning can be configured to specific Azure regions for low latency and data residency requirements.

For customers that plan to transition their Windows lab scenarios to **Azure Virtual Desktop**, we recommend **Nerdio Manager for Enterprise (NME)**. NME adds value on top of native Azure Virtual Desktop and Windows 365 management tools, equipping IT professionals in education with the resources they need to efficiently deploy and oversee Azure Virtual Desktop, Windows 365, Windows applications, and endpoint devices, including bring your own device (BYOD).

For customers who are seeking a solution similar to Azure Lab Services, we recommend **Apporto**, **CloudLabs by Spektra Systems**, and **Skillable**. Each of these partners specializes in education-focused solutions for training and classrooms. These partner solutions support various educational needs including Linux, nested virtualization/multi-virtual machine environments, over-the-shoulder monitoring, student admin/non-admin access, and learning management systems (LMS) integration.

## Common questions about Azure Lab Services retirement

### Can I sign up for the service during the retirement period?
New customers will not be able to sign up for the service from July 15, 2024 onwards. Existing lab accounts, lab plans, and labs will continue to operate until the service is fully retired on June 28, 2027. Azure subscriptions that have actively used Azure Lab Services between July 2023 and July 2024 will be considered existing customers and allowed to create a new lab plan. New lab accounts cannot be created.

### Will Microsoft continue to support my current labs?
Yes, support continues for current lab deployments until the service retirement date, including fixes for blocking bugs and security issues.

### Does this transition affect Azure Lab Services with lab accounts or lab plans?
It applies to both lab accounts and lab plans. Transition encompasses the entire service, including labs using either a lab account or a lab plan.

### What will happen after retirement date?
After June 28, 2027, Azure Lab Services won’t be supported, and you won't have access to your lab accounts, lab plans, or labs. You will, however, have access to your Azure compute gallery and any images you might have saved there. 
 
### Are there pricing differences across the Microsoft and partner solutions?
Azure Lab Services operates on a consumption-based model where you only pay for active usage in your labs. The hourly price of a lab is based on [the virtual machine size](https://azure.microsoft.com/pricing/details/lab-services/) selected and includes costs such as compute. However, Azure Labs Services covers the cost of storage, which is offered as a complimentary service. The costs for other Microsoft and partner solutions vary based on their pricing model and optimizations that can be enabled. Azure Lab Services supports individual, dedicated virtual machines with persistent storage. Dedicated virtual machines with persistent storage might not be as cost efficient with other lab solutions when compared with options for multi-session, dynamic virtual machine creation, or changing the storage type to a lower tier when a virtual machine is shut down.

### Will Microsoft and partner solutions be available in the same Azure regions as Lab Services?
Yes, the Microsoft and partner solutions will be available in similar regions as Azure Lab Services. 

### Do these lab solutions offer feature parity with Azure Lab Services?
Compared to Azure Lab Services, other Microsoft and partner solutions provide a more comprehensive set of features, such as browser-based web access, over-the-shoulder access, and remote control access. However, some Azure Lab Services features might require a paradigm shift, because the other solutions might offer a different way to achieve a similar outcome. For example, although other solutions don't offer Teams integration, a comparable experience can be achieved by embedding a lab URL within a Teams channel and using auto-scaling or dynamic virtual machine creation. Partners like Apporto, Spektra Systems, and Skillable support LMS integrations with platforms such as Canvas, as well as alternate delivery options like REST API or URLS that can be shared directly with students.

### Can I continue to get support for Azure Lab Services until retirement?
Yes, you can continue to get help and support for Azure Lab Services by either creating a [support request](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview) through the Azure portal or by posting a question in the [Microsoft Q&A](https://aka.ms/azlabs-microsoftqa) community forums. 

### How do I get help and support for Microsoft solutions that can be used as a replacement for Azure Lab Services?
To get help and support for Azure Virtual Desktop, Azure DevTest Labs, Windows 365 Cloud PC, and Microsoft Dev Box you can use the usual Microsoft support channels for the particular service. 

### How can I get transition help and support for a partner solution?
If you have questions about how to transition to one of the partner’s solutions, refer to the following resources for each partner (listed alphabetically). 

- [Apporto](https://aka.ms/azlabs-apporto)  
- [CloudLabs by Spektra Systems](https://aka.ms/azlabs-spektra) 
- [Nerdio Manager for Enterprise (NME)](https://aka.ms/azlabs-nerdio) (requires and uses Azure Virtual Desktop)
- [Skillable](https://aka.ms/azlabs-skillable)

### Can I automatically migrate my existing lab resources from Azure Lab Services to Microsoft and partner solutions?
Partners might provide migration tooling to automatically migrate labs from Azure Lab Services. However, early customer pilots show that it’s often more efficient to recreate new labs using the optimizations offered by Microsoft and partner solutions, such as multi-session, dynamic virtual machine creation, and changing the storage type to a lower tier when a virtual machine is shut down. In certain situations, reusing custom images exported from your labs to an Azure compute gallery might be beneficial. Microsoft and partner solutions all support the use of or migration of images from your Azure compute gallery. We recommend evaluating whether existing lab images should be recreated when you're:
- Upgrading from [Generation 1](/windows-server/virtualization/hyper-v/plan/should-i-create-a-generation-1-or-2-virtual-machine-in-hyper-v) to [Generation 2](/azure/virtual-machines/generation-2) VM image, which might have improved boot and installation times.
- Restructuring disk size to optimize lab requirements. 
- Generalizing image as appropriate, such as AVD (Azure Lab Services only exports specialized images).
- Using a supported base Azure Marketplace image.
   - Dev Box requires specific Dev Box supported Marketplace images.
   - AVD requires multi-session Marketplace images to enable multi-session capabilities.
