---
title: Azure Lab Services retirement guide
description: Learn about the Azure Lab Services retirement schedule and how to transition to Microsoft or partner services.
ms.topic: how-to
ms.date: 12/05/2024

# customer intent: As an Azure Lab Services customer, I want to understand the Azure Lab Services retirement schedule and what Microsoft and partners services I can transition to.
---

# Azure Lab Services retirement guide

Azure Lab Services will be retired on June 28, 2027, but we strongly recommend that you start developing your retirement plan now to resolve pricing differences, secure necessary cores, and enhance the student experience with seamless in-browser labs and other key features offered by our recommended Microsoft and Azure partner solutions.  

> [!Note] 
> Transition your Azure Labs Services workflows to a Microsoft service or Microsoft partner solution by June 28, 2027. Azure Lab Services will be fully retired on this date.

## Call to action
* **Start establishing a retirement plan now** to address [cost differences](#are-there-pricing-differences-across-the-microsoft-and-partner-solutions), [secure necessary cores](#can-i-transfer-my-azure-lab-services-core-limits-to-my-preferred-transition-solution), and take advantage of [extra features like in-browser labs](#do-these-lab-solutions-offer-feature-parity-with-azure-lab-services).  

* **Use the latest Azure Lab Services version** ([utilizing lab plans](how-to-migrate-lab-acounts-to-lab-plans.md)) as an interim solution for enhanced performance, wider range of VM sizes, and better student experience, as you develop your long-term retirement plan to move to other Microsoft or Azure partner solutions.  

* **Delete unused resources** to reduce costs and formally offboard by [reviewing labs and cleaning up idle resources](find-delete-lab-resources.md).


## Transition guidance overview
Review recommended Microsoft and Azure partner solutions that offer similar and additional capabilities to Azure Lab Services. These Microsoft and Azure partner solutions specialize in educational scenarios such as browser-based virtual machine access, support for large disks, and many others. 

### Microsoft solutions
There are various Microsoft solutions that you might consider as a direct replacement for Azure Lab Services. Each of these Microsoft solutions offers browser-based web access. While these solutions aren't necessarily education-specific, they support a wide range of education and training scenarios. 

### Azure Virtual Desktop
[Azure Virtual Desktop](https://azure.microsoft.com/products/virtual-desktop/) is a comprehensive desktop and app virtualization service running in the cloud, offering secure, and scalable virtual desktop experiences with usage-based pricing. It's ideal for providing full desktop and app delivery scenarios for Windows 10/11 with maximum control to any device from a flexible cloud virtual desktop infrastructure (VDI) platform on your Azure infrastructure and by using Microsoft Entra ID for user identities. Azure Virtual Desktop supports CPU and GPU-based Microsoft Entra ID joined virtual machines, content filtering, image management from Azure Marketplace or Azure compute gallery, centralized end-to-end management with Intune, and multi-session capabilities. 

#### How can I get started with Azure Virtual Desktop?
- [What is Azure Virtual Desktop?](/azure/virtual-desktop/overview)
- [Azure landing zones for Azure Virtual Desktop instances](/azure/cloud-adoption-framework/scenarios/azure-virtual-desktop/ready)

### Azure DevTest Labs
[Azure DevTest Labs](https://azure.microsoft.com/products/devtest-lab/) simplifies creation, usage, and management of infrastructure-as-a-service (IaaS) virtual machines within a lab context with usage-based pricing. It's ideal for computer programming-related courses and those users familiar with the Azure portal. Azure DevTest Labs supports Linux and Windows CPU and GPU-based virtual machines, student admin access, network isolated labs, nested virtualization, and image management from Azure Marketplace or Azure compute gallery.

For more information on transitioning from Azure Lab Services to Azure DevTest Labs, see the [Azure Lab Services to Azure DevTest Labs Transition Guide](/azure/lab-services/transition-devtest-labs-guidance).

#### How can I get started with Azure DevTest Labs?
- [What is Azure DevTest Labs?](/azure/devtest-labs/devtest-lab-overview)
- [Popular scenarios for using Azure DevTest Labs](/azure/devtest-labs/devtest-lab-guidance-get-started)

### Windows 365 Cloud PC
[Windows 365 Cloud PC](https://www.microsoft.com/windows-365) is a highly available, optimized, and scalable virtual machine that provides end users with a rich Windows desktop experience, hosted in the Windows 365 service. It's accessible from anywhere, on any device with predictable subscription pricing. Cloud PC virtual machines are Microsoft Entra ID joined and support centralized end-to-end management using Microsoft Intune. 

#### How can I get started with Windows 365 Cloud PC?
- [What is Windows 365?](/windows-365/enterprise/overview)

### Microsoft Dev Box 
[Microsoft Dev Box](https://azure.microsoft.com/products/dev-box/) offers cloud-based workstations preconfigured with tools and environments for developer workflow-specific tasks with usage-based pricing. It's ideal for facilitating hands-on learning where training leaders can use Dev Box supported images to create identical virtual machines for trainees. Dev Box virtual machines are Microsoft Entra ID joined and support centralized end-to-end management with Microsoft Intune.

#### How can I get started with Microsoft Dev Box?
- [What is Microsoft Dev Box?](/azure/dev-box/overview-what-is-microsoft-dev-box)

### Azure Partner solutions

Our partners offer specialized, education-focused solutions for training and classrooms, all powered by Azure. Lab provisioning can be configured to specific Azure regions for low latency and data residency requirements. Each partner solution supports browser-based web access, large disks, cost controls, Azure compute gallery images, and CPU/GPU-based virtual machines. These solutions have [transition guides and support](#how-do-i-get-help-and-support-for-microsoft-solutions-that-can-be-used-as-a-replacement-for-azure-lab-services) to help you move your Azure Lab Services scenarios to their platform:
 
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
After June 28, 2027, Azure Lab Services won't be supported, and you won't have access to your lab accounts, lab plans, or labs. You will, however, have access to your Azure compute gallery and any images you might have saved there. 

### Why use lab plans rather than lab accounts? 
As you develop your long-term retirement plan to move to other Microsoft or Azure partner solutions, we recommend using the latest Azure Lab Services version (utilizing lab plans) as an interim solution, for scenarios where you don’t need to set up advanced networking. This version offers enhanced performance, a wider range of VM sizes, and better student experience. Additionally, lab plans provide faster VM start and creation times, updated hardware, and more control over regions. You can also create labs with no template, which simplifies lab creation and reduces provisioning time. By transitioning to V2, you can ensure a smoother and more efficient operation while you plan your long-term strategy. Learn more about [moving from lab accounts to lab plans](how-to-migrate-lab-acounts-to-lab-plans.md). 

### Why delete unused resources? 
To reduce your costs and formally offboard, it is important to delete any unused resources. This includes any virtual machines, lab plans, or other resources that are no longer needed. This will help you free up cores, reduce costs from unexpected lab VMs running, tight access control and reduce security surface area. For advanced networking labs, it will also reduce costs, cut down on used IP addresses, and allow cleanup address space on the network. If you have domain-joined resources, it will help clean up orphaned entries in Active Directory. Learn more about [deleting lab resources](find-delete-lab-resources.md). 

### Are there pricing differences across the Microsoft and partner solutions?
Azure Lab Services operates on a consumption-based model where you only pay for active usage in your labs. The hourly price of a lab is based on [the virtual machine size](https://azure.microsoft.com/pricing/details/lab-services/) selected and includes costs such as compute. However, Azure Labs Services covers the cost of storage, which is offered as a complimentary service. The costs for other Microsoft and partner solutions vary based on their pricing model and optimizations that can be enabled. Azure Lab Services supports individual, dedicated virtual machines with persistent storage. Dedicated virtual machines with persistent storage might not be as cost efficient with other lab solutions. Consider options for multi-session, dynamic virtual machine creation, or changing the storage type to a lower tier when a virtual machine is shut down.

### Will Microsoft and partner solutions be available in the same Azure regions as Lab Services?
Yes, the Microsoft and partner solutions will be available in similar regions as Azure Lab Services. 

### Do these lab solutions offer feature parity with Azure Lab Services?
Compared to Azure Lab Services, other Microsoft and partner solutions provide a more comprehensive set of features, such as browser-based web access, over-the-shoulder access, and remote control access. However, some Azure Lab Services features might require a paradigm shift, because the other solutions might offer a different way to achieve a similar outcome. For example, although other solutions don't offer Teams integration, a comparable experience can be achieved by embedding a lab URL within a Teams channel and using auto-scaling or dynamic virtual machine creation. Partners like Apporto, Spektra Systems, and Skillable support LMS integrations with platforms such as Canvas. They also support alternate delivery options like REST API or URLS that can be shared directly with students.

### Can I continue to get support for Azure Lab Services until retirement?
Yes, you can continue to get help and support for Azure Lab Services. Either create a [support request](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview) through the Azure portal or post a question in the [Microsoft Q&A](https://aka.ms/azlabs-microsoftqa) community forums. 

### How do I get help and support for Microsoft solutions that can be used as a replacement for Azure Lab Services?
To get help and support for Azure Virtual Desktop, Azure DevTest Labs, Windows 365 Cloud PC, and Microsoft Dev Box you can use the usual Microsoft support channels for the particular service. 

### How can I get transition help and support for a partner solution?
If you have questions about how to transition to one of the partner's solutions, refer to the following resources for each partner (listed alphabetically). 

- [Apporto](https://aka.ms/azlabs-apporto)  
- [CloudLabs by Spektra Systems](https://aka.ms/azlabs-spektra) 
- [Nerdio Manager for Enterprise (NME)](https://aka.ms/azlabs-nerdio) (requires and uses Azure Virtual Desktop)
- [Skillable](https://aka.ms/azlabs-skillable)

### Can I automatically migrate my existing lab resources from Azure Lab Services to Microsoft and partner solutions?
Partners might provide migration tooling to automatically migrate labs from Azure Lab Services. It's often more efficient to create new labs using the optimizations offered by Microsoft and partner solutions. A new lab could unlock new options like multi-session, dynamic virtual machine creation, or changing the storage type to a lower tier when a virtual machine is shut down. In certain situations, reusing custom images exported from your labs to an Azure compute gallery might be beneficial. Microsoft and partner solutions all support the use of or migration of images from your Azure compute gallery. We recommend evaluating whether existing lab images should be recreated when you are:
- Upgrading from [Generation 1](/windows-server/virtualization/hyper-v/plan/should-i-create-a-generation-1-or-2-virtual-machine-in-hyper-v) to [Generation 2](/azure/virtual-machines/generation-2) VM image, which might have improved boot and installation times.
- Restructuring disk size to optimize lab requirements. 
- Generalizing image as appropriate, such as AVD (Azure Lab Services only exports specialized images).
- Using a supported base Azure Marketplace image.
   - Dev Box requires specific Dev Box supported Marketplace images.
   - AVD requires multi-session Marketplace images to enable multi-session capabilities.

### Can I transfer my Azure Lab Services core limits to my preferred transition solution?
No, your Azure subscription core limits can't be transferred to your preferred solution, applicable to both Lab Account (Classic) and Lab Plan. You or the partner have to request a core limit for your chosen solution as part of the transition plan.

To ensure that you have the resources you require when you need them, you should:
- Request capacity as far in advance as possible.
- Be flexible on the region where you're requesting capacity, if possible.
- Make incremental requests for VM cores rather than making large, bulk requests. Break requests for large number of cores into smaller requests for extra flexibility in how those requests are fulfilled.

### Should I request the same number of Azure subscription core limits with my preferred transition solution?
Make sure to review your lab usage trends and not assume you require the same volume of core limits. Keep in mind, the recommended transition solutions allow for more efficient use of lab resources which can reduce the overall number of cores needed. For example, multi-session VDI offerings enable multiple users to share the same VM. 

## Related content

- [Azure Lab Services to Azure DevTest Labs Transition Guide](/azure/lab-services/transition-devtest-labs-guidance)