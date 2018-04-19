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
Azure Lab Services enables you to quickly set up an environment for your team (for example: development environment, test environment, classroom lab environment) in the cloud. A lab owner creates a lab, provisions Windows or Linux virtual machines, installs the necessary software and tools, and makes them available to lab users. Lab users connect to virtual machines (VMs) in the lab, and use them for their day-to-day work, short-term projects, or for doing classroom exercises. Once users start utilizing the resources in the lab, a lab admin can analyze cost and usage across multiple labs, and set overarching policies to optimize your organization or team's costs.

The following section provides information about different types of labs you can create with Azure Lab Services:

## Types of labs
If you want to just input what you need in the lab and let the service roll it out to your audience, you can choose from one of the **managed labs**, such as **classroom lab**. If you want to manage your own infrastructure, choose the **custom lab** type to set up a lab in your own Azure subscription. The custom lab is exactly same as the lab that you could create with Azure DevTest Labs service that is in general availability (GA). The following sections provide more details about these labs. 

### Managed labs
Managed labs offer different lab types that fit for your purpose, such as classroom labs. Currently, Azure Lab Services supports only **classroom lab** as a managed lab. Managed labs enable you to get started right away, with minimal setup. The service itself handles all management of the infrastructure behind the lab, from spinning up the VMs, handling errors, and scaling. You can create a managed lab after your organization's lab account has been set up, which serves as the central account in which all labs in the organization are managed. 

When you create and use Azure resources in these managed labs, the service creates and manages the resources in internal Microsoft subscriptions, and not within your own Azure subscription. It enables the service to handle all infrastructure work for you. The service keeps track of the usage of the resources and it is billed back to your Azure subscription that you created the lab account under.   

Here are some of the **use cases for classroom labs**: 

- Provide students with a lab of virtual machines configured with exactly what’s need for class. Give each student a limited number of hours to use the VMs for homework or personal projects.
- Set up a pool of high performance compute VMs to perform compute-intensive or graphics-intensive research. Run the VMs as needed, and instantly clean up the machines once you are done. 
- Move your school’s physical computer lab into the cloud. Automatically scale the number of VMs only to the maximum threshold you set on usage and cost.  
- Quickly provision a lab of virtual machines to host a hackathon. Destroy the lab with a single click once you’re done. 


### Custom labs (same as Azure DevTest Labs)
You may have scenarios where you want to manage all infrastructure and configuration yourself, within your own subscription. To do so, you can create a custom lab in the Azure portal. For custom labs, you do not need to create a lab account. Custom labs do not show up in the lab account (which exists for the managed lab types).  

Here are some of the **use cases for using custom labs**: 

- Quickly provision a lab of virtual machines to host a hackathon or a hands-on session at a conference. Destroy the lab with a single click once you’re done. 
- Create a pool of VMs configured with your application, and let your team easily grab a virtual machine for bug-bashing.  
- Provide developers with virtual machines configured with all the tools they need. Schedule automatic start and shutdown to minimize cost. 
- Repeatedly create a lab of test machines as part of your deployment. Test your latest bits and clean up the test machines once you are done. 
- Set up a variety of differently configured virtual machines and multiple test agents for scale and performance testing. 
- Offer training sessions to your customers using a lab configured with the latest version of your product. Give each customer limited number of hours to use in the lab. 


### Managed labs vs. Custom labs
The following table compares two types of labs that are supported by Azure Lab Services: 

| Features | Managed labs | Custom labs |
| -------- | ----------------  | ---------- |
| Management of the Azure infrastructure in the lab. | 	Automatically managed by the service | You manage on your own  |
| Built-in resiliency to infrastructure issues | Automatically handled by the service | You manage on your own  |
| Subscription management | Service handles allocation of resources within Microsoft subscriptions backing the service. Scaling is automatically handled by the service. | You manage on your own in your own Azure subscription. No auto-scaling of subscriptions. |
| Azure Resource Manager deployment within the lab | Not available | Available |

## Key capabilities
Azure Lab Services supports the following key capabilitiies/features: 

- **Fast and flexible setup**
    - Provides a simple, guided flow to set up, and customize your lab. 
    - Use custom templates to quickly reproduce your Lab’s resources. 
    - Choose to create and manage the lab's Azure infrastructure in your own subscription, or choose from a variety of fit-for-purpose labs, such as classroom lab, to let the service take care of all the infrastructure work. Azure Lab Services provides built-in scaling and resiliency of infrastructure for labs that the service manages for you. 
    - Share customizations and policies across multiple labs. 
- **Simplified experience for lab users** 
    - Add new users to the lab to provide them access to lab’s set of resources.  
    - Give your users a single list of all the resources they can access across Labs. 
    - Enable your users to manage and reuse data disks. Set up reusable secrets.   
    - Enable easy access to the resources by integrating labs into your website or learning management systems. 
- **Embedded security** 
    - Set up private virtual networks and subnets for your lab. 
    - Enable a shared public IP address.  
    - Securely access resources using your virtual networks configured with ExpressRoute or site-to-site VPN.
- **Cost optimization and analysis**
    - Set lab schedules to automatically shut down and start up virtual machines. Set a schedule to specify the time slots when the lab’s virtual machines are accessible to users.
    - Set usage policies per user or per lab to optimize cost.  
    - Analyze usage and activity trends in your lab. 
- **Integration into your workflows and tools**
    - Integrate the labs into your organization’s website and management systems. 
    - Automatically provision environments from within your continuous integration/continuous deployment (CI/CD) tools.

## User profiles
This section describes different user profiles in Azure Lab Services. 

### Lab account owner
Typically, IT administrator of organization's cloud resources, who owns the Azure subscription acts as a lab account owner, who sets up a lab account for your organization, manages and configures policies across all labs, and gives permissions to people in the organization to create a lab under the lab account.

### Lab creator 
Typically, users such as a development lead/manager, a teacher, a hackathon host, an online trainer creates labs under a lab account. A lab creator creates a lab, creates virtual machines in the lab, installs the appropriate software on virtual machines, specifies who can access the lab, and provides link to the lab to lab users.

### Lab user
A lab user uses the registration link that the lab creator shares to register and access the lab. The lab user connects to a virtual machine in the lab and use it for development, testing, or to do classwork.

## Next steps
Get started with setting up a lab using Azure Lab Services:

- [Set up a classroom lab](tutorial-setup-classroom-lab.md)
- [Set up a custom lab](tutorial-create-custom-lab.md)
