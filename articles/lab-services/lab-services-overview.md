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
> Azure Lab Services lets you create managed labs, such as classroom labs. The service itself handles all the infrastructure management for a managed lab, from spinning up VMs to handling errors, and scaling the infrastructure. The managed labs are currently in preview. Once the preview ends, the new lab types and existing DevTest Labs come under the new common umbrella name of Azure Lab Services where all lab types continue to evolve. 

## Key capabilities
Azure Lab Services supports the following key capabilities/features: 

- **Fast and flexible setup of a lab**. Using Azure Lab Services, lab owners can quickly set up a lab for their needs. The service offers the option to take care of all Azure infrastructure work for managed labs, or to enable lab owners to self-manage and customize infrastructure in the lab owner’s subscription. The service provides built-in scaling and resiliency of infrastructure for labs that the service manages for you. 
- **Simplified experience for lab users**. In a managed lab, such as a classroom lab, lab users can register to a lab with a registration code, and access the lab any time to use the lab’s resources. In a lab created in DevTest Labs, a lab owner can give permissions for lab users to create and access virtual machines, manage and reuse data disks, and set up reusable secrets.  
- **Cost optimization and analysis**. A lab owner can set lab schedules to automatically shut down and start up virtual machines. The lab owner can set a schedule to specify the time slots when the lab’s virtual machines are accessible to users, set usage policies per user or per lab to optimize cost, and analyze usage and activity trends in a lab. For managed labs such as classroom labs, currently a smaller subset of cost optimization and analysis options are available. 
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

## User profiles
This article describes different user profiles in Azure Lab Services. 

### Lab account owner
Typically, and IT administrator of organization's cloud resources, who owns the Azure subscription acts as a lab account owner and does the following tasks:   

- Sets up a lab account for your organization.
- Manages and configures policies across all labs.
- Gives permissions to people in the organization to create a lab under the lab account.

### Lab creator 
Typically, users such as a development lead/manager, a teacher, a hackathon host, an online trainer creates labs under a lab account. A lab creator does the following tasks: 

- Creates a lab.
- Creates virtual machines in the lab. 
- Installs the appropriate software on virtual machines.
- Specifies who can access the lab.
- Provides link to the lab to lab users.

### Lab user
A lab user does the following tasks:

- Uses the registration link that the lab user receives from a lab creator to register with the lab. 
- Connects to a virtual machine in the lab and use it for development, testing, or doing class work. 

## Next steps
Get started with setting up a lab using Azure Lab Services:

- [Set up a classroom lab](classroom-labs/tutorial-setup-classroom-lab.md)
- [Set up a lab](tutorial-create-custom-lab.md)
