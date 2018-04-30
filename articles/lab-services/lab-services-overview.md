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
ms.date: 04/19/2018
ms.author: spelluru

---
# An introduction to Azure Lab Services (formerly Azure DevTest Labs)
Azure Lab Services enables you to quickly set up an environment for your team (for example: development environment, test environment, classroom lab environment) in the cloud. A lab owner creates a lab, provisions Windows, or Linux virtual machines, installs the necessary software and tools, and makes them available to lab users. Lab users connect to virtual machines (VMs) in the lab, and use them for their day-to-day work, short-term projects, or for doing classroom exercises. Once users start utilizing resources in the lab, a lab admin can analyze cost and usage across multiple labs, and set overarching policies to optimize your organization or team's costs.

## Key capabilities
Azure Lab Services supports the following key capabilitiies/features: 

### Fast and flexible setup of a lab
Using Azure Lab Services, you can quickly set up a lab for your development, testing, or training needs. You can choose to create and manage the lab's Azure infrastructure in your own subscription, or choose from a variety of fit-for-purpose managed labs, such as classroom labs, to let the service take care of all the infrastructure work. The service provides built-in scaling and resiliency of infrastructure for labs that the service manages for you. You can use a custom template to quickly reproduce your lab's resources, and share customizations and policies across multiple labs. 

### Simplified experience for lab users
A lab owner adds users to a lab and provide them access to lab’s set of resources. A lab user views a single list of all the resources that they can access across labs. A lab owner gives permissions for lab users to manage and reuse data disks, and sets up reusable secrets. Lab users can integrate labs into their website or learning management systems. 

### Cost optimization and analysis
For DevTest Labs, a lab owner can set lab schedules to automatically shut down and start up virtual machines. The lab owner can set a schedule to specify the time slots when the lab’s virtual machines are accessible to users, set usage policies per user or per lab to optimize cost, and analyze usage and activity trends in a lab. For managed labs such as classroom labs, currently some cost optimization and analysis options are available. 

### Embedded security
For DevTest Labs, a lab owner can set up a private virtual networks and a subnet for a lab, and enable a shared public IP address. Lab users can securely access resources using the virtual network configured with ExpressRoute or site-to-site VPN.

### Integration into your workflows and tools
Azure Lab Services allows you to integrate the labs into your organization’s website and management systems. You can automatically provision environments from within your continuous integration/continuous deployment (CI/CD) tools.

## User profiles
This section describes different user profiles in Azure Lab Services. 

### Lab account owner

Typically, an administrator of organization's cloud resources, who owns the Azure subscription acts as a lab account owner, who sets up a lab account for your organization, manages and configures policies across all labs, and gives permissions to people in the organization to create a lab under the lab account.

### Lab creator

Typically, users such as a development lead/manager, a teacher, a hackathon host, an online trainer creates labs under a lab account. A lab creator creates a lab, creates virtual machines in the lab, installs the appropriate software on virtual machines, specifies who can access the lab, and provides link to the lab to lab users.

### Lab user

A lab user uses the registration link that the lab creator shares to register and access the lab. The lab user connects to a virtual machine in the lab and use it for development, testing, or to do class work.

## Next steps
Get started with setting up a lab using Azure Lab Services:

- [Set up a classroom lab](tutorial-setup-classroom-lab.md)
- [Set up a self-managed lab](tutorial-create-custom-lab.md)
