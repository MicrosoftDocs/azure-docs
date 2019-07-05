---
title: About Azure Lab Services | Microsoft Docs
description: Learn how Lab Services can make it easy to create, manage, and secure labs with virtual machines that can be used by developers, testers, educators, students, and others. 
services: lab-services
documentationcenter: na
author: spelluru
manager: 
editor: ''

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: overview
ms.date: 07/13/2018
ms.author: spelluru

---
# An introduction to Azure Lab Services
Azure Lab Services enables you to quickly set up an environment for your team (for example: development environment, test environment, classroom lab environment) in the cloud. A lab owner creates a lab, provisions Windows, or Linux virtual machines, installs the necessary software and tools, and makes them available to lab users. Lab users connect to virtual machines (VMs) in the lab, and use them for their day-to-day work, short-term projects, or for doing classroom exercises. Once users start utilizing resources in the lab, a lab admin can analyze cost and usage across multiple labs, and set overarching policies to optimize your organization or team's costs.

> [!IMPORTANT]
> **Azure DevTest Labs** is being expanded with new types of labs (Azure Lab Services)!
>  
> Azure Lab Services lets you create managed lab types, such as classroom labs. The service itself handles all the infrastructure management for a managed lab type, from spinning up VMs to handling errors, and scaling the infrastructure. For now, [DevTest Labs](https://azure.microsoft.com/services/devtest-lab/) and [Azure Lab Services](https://azure.microsoft.com/services/lab-services/) will continue to be separate services in the Azure Portal. 

## Key capabilities

Azure Lab Services supports the following key capabilities/features:

- **Fast and flexible setup of a lab**. Using Azure Lab Services, lab owners can quickly set up a lab for their needs. The service offers the option to take care of all Azure infrastructure work for managed lab types, or to enable lab owners to self-manage and customize infrastructure in the lab owner’s subscription. The service provides built-in scaling and resiliency of infrastructure for labs that the service manages for you.
- **Simplified experience for lab users**. In a managed lab type, such as a classroom lab, lab users can register to a lab with a registration code, and access the lab anytime to use the lab’s resources. In a lab created in DevTest Labs, a lab owner can give permissions for lab users to create and access virtual machines, manage and reuse data disks, and set up reusable secrets.  
- **Cost optimization and analysis**. A lab owner can set lab schedules to automatically shut down and start up virtual machines. The lab owner can set a schedule to specify the time slots when the lab’s virtual machines are accessible to users, set usage policies per user or per lab to optimize cost, and analyze usage and activity trends in a lab. For managed lab types such as classroom labs, currently a smaller subset of cost optimization and analysis options are available.
- **Embedded security**. A lab owner can set up a private virtual networks and a subnet for a lab, and enable a shared public IP address. Lab users can securely access resources using the virtual network configured with ExpressRoute or site-to-site VPN. (currently available in DevTest Labs only)
- **Integration into your workflows and tools**. Azure Lab Services allows you to integrate the labs into your organization’s website and management systems. You can automatically provision environments from within your continuous integration/continuous deployment (CI/CD) tools. (currently available in DevTest Labs only)

> [!NOTE]
> Currently Azure Lab Services supports only VMs created from Azure Marketplace images. If you want to use custom images or create other PaaS resources in a lab environment, use DevTest Labs. For more information, see [Create a custom image in DevTest Labs](devtest-lab-create-custom-image-from-vm-using-portal.md) and [Create lab envionrments using Resource Manager templates](devtest-lab-create-environment-from-arm.md).

## Scenarios

Here are some of the scenarios that Azure Lab Services supports:

### Set up a resizable computer lab in the cloud for your classroom  

- Create a managed classroom lab. You just tell the service exactly what you need, and it will create and manage the infrastructure of the lab for you so that you can focus on teaching your class, not technical details of a lab.
- Provide students with a lab of virtual machines that are configured with exactly what’s needed for a class. Give each student a limited number of hours for using the VMs for class work.  
- Move your school’s physical computer lab into the cloud. Automatically scale the number of VMs only to the maximum usage and cost threshold that you set on the lab.
- Delete the lab with a single click once you’re done.

### Use DevTest Labs for development environments

Azure DevTest Labs can be used to implement many key scenarios, but one of the primary scenarios involves using DevTest Labs to host development machines for developers. In this scenario, DevTest Labs provides these benefits:

- Enable developers to quickly provision their development machines on demand.
- Provision Windows and Linux environments using reusable templates and artifacts.
- Developers can easily customize their development machines whenever needed.
- Administrators can control costs by ensuring that developers cannot get more VMs than they need for development and VMs are shut down when not in use.

For more information, see [Use DevTest Labs for development](devtest-lab-developer-lab.md).

### Use DevTest Labs for test environments

You can use Azure DevTest Labs to implement many key scenarios, but a primary scenario involves using DevTest Labs to host machines for testers. In this scenario, DevTest Labs provides these benefits:

- Testers can test the latest version of their application by quickly provisioning Windows and Linux environments using reusable templates and artifacts.
- Testers can scale up their load testing by provisioning multiple test agents.
- Administrators can control costs by ensuring that testers cannot get more VMs than they need for testing and VMs are shut down when not in use.

For more information, see [Use DevTest Labs for testing](devtest-lab-test-env.md).

## Types of labs
You can create two types of labs: **managed lab types** with Azure Lab Services and **labs** with Azure Lab Services. If you want to just input what you need in a lab and let the service set up and manage infrastructure required for the lab, choose from one of the **managed lab types**. Currently, **classroom lab** is the only managed lab type that you can create with Azure Lab Services. If you want to manage your own infrastructure, create a lab by using **Azure DevTest Labs**.

The following sections provide more details about these labs. 

## Managed lab types
Azure Lab Services allows you to create labs whose infrastructure is managed by Azure. This article refers to them as managed lab types. Managed lab types offer different types of labs that fit for your specific need. Currently, only managed lab type that's supported is **classroom lab**. 

Managed lab types enable you to get started right away, with minimal setup. The service itself handles all the management of the infrastructure for the lab, from spinning up the VMs to handling errors, and scaling the infrastructure. To create a managed lab type such as a classroom lab, you need to create a lab account for your organization first. The lab account serves as the central account in which all labs in the organization are managed. 

When you create and use Azure resources in these managed lab types, the service creates and manages resources in internal Microsoft subscriptions. They are not created in your own Azure subscription. The service keeps track of usage of these resources in internal Microsoft subscriptions. This usage is billed back to your Azure subscription that contains the lab account.   

Here are some of the **use cases for managed lab types**: 

- Provide students with a lab of virtual machines that are configured with exactly what’s needed for a class. Give each student a limited number of hours for using the VMs for homework or personal projects.
- Set up a pool of high performance compute VMs to perform compute-intensive or graphics-intensive research. Run the VMs as needed, and clean up the machines once you are done. 
- Move your school’s physical computer lab into the cloud. Automatically scale the number of VMs only to the maximum usage and cost threshold that you set on the lab.  
- Quickly provision a lab of virtual machines for hosting a hackathon. Delete the lab with a single click once you’re done. 


## DevTest Labs
You may have scenarios where you want to manage all infrastructure and configuration yourself, within your own subscription. To do so, you can create a lab with Azure DevTest Labs in the Azure portal. For these labs, you do not need to create a lab account. These labs do not show up in the lab account (which exists for the managed lab types).  

Here are some of the **use cases for using DevTest Labs**: 

- Quickly provision a lab of virtual machines to host a hackathon or a hands-on session at a conference. Delete the lab with a single click once you’re done. 
- Create a pool of VMs configured with your application, and let your team easily use a virtual machine for bug-bashes.  
- Provide developers with virtual machines configured with all the tools they need. Schedule automatic start and shut down to minimize cost. 
- Repeatedly create a lab of test machines as part of your deployment. Test your latest bits and clean up the test machines once you are done. 
- Set up a variety of differently configured virtual machines and multiple test agents for scale and performance testing. 
- Offer training sessions to your customers using a lab configured with the latest version of your product. Give each customer limited number of hours for using in the lab. 


## Managed lab types vs. DevTest Labs
The following table compares two types of labs that are supported by Azure Lab Services: 

| Features | Managed lab types | DevTest Labs |
| -------- | ----------------- | ---------- |
| Management of Azure infrastructure in the lab. | 	Automatically managed by the service | You manage on your own  |
| Built-in resiliency to infrastructure issues | Automatically handled by the service | You manage on your own  |
| Subscription management | Service handles allocation of resources within Microsoft subscriptions backing the service. Scaling is automatically handled by the service. | You manage on your own in your own Azure subscription. No autoscaling of subscriptions. |
| Azure Resource Manager deployment within the lab | Not available | Available |

## Next steps

See the following articles: 

- [About Classroom Labs](./classroom-labs/classroom-labs-overview.md)
- [About DevTest Labs](devtest-lab-overview.md)
