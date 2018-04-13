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
ms.date: 04/12/2018
ms.author: spelluru

---
# An introduction to Azure Lab Services (formerly Azure DevTest Labs)
Azure Lab Services aims to streamline and simplify setting up and managing your team's resources and environments in the cloud. With Azure Lab Services, you can quickly provision Windows and Linux virtual machines, Azure PaaS services, or complex environments in your labs through reusable custom templates. The labs contain resources within your custom configurations and policies. Once users start utilizing the resources in the lab, you can analyze cost and usage across multiple Labs, and set overarching policies to optimize your organization or team's costs. You choose whether to manage the lab's Azure infrastructure yourself in your subscription (**custom labs**), or to let the service handle all of it for you automatically (**managed labs**). 

## Custom labs

### Use cases 
- Quickly provision a lab of virtual machines to host a hackathon or a hands-on session at a conference. Destroy the lab with a single click once you’re done. 
- Create a pool of VMs configured with your application, and let your team easily grab a virtual machine for bug-bashing.  
- Provide developers with virtual machines configured with all the tools they need. Schedule automatic start and shutdown to minimize cost. 
- Repeatedly create a lab of test machines as part of your deployment. Test your latest bits and clean up the test machines once you are done. 
- Set up a variety of differently configured virtual machines and multiple test agents for scale and performance testing. 
- Offer training sessions to your customers using a lab configured with the latest version of your product. Give each customer limited number of hours to use in the lab. 

### Features
- Fast and flexible setup 
    - Walk through a simple, guided flow to set up, and customize your lab. 
    - Use custom templates to quickly reproduce your Lab’s resources. 
    - Choose to create and manage the lab's Azure infrastructure in your own subscription, or choose from a variety of fit-for-purpose labs, such as a Hackathon lab or a Development lab, to let the service take care of all infrastructure work. Azure Lab Services provides built-in scaling and resiliency of infrastructure for labs that the service manages for you. 
    - Share customizations and policies across multiple labs. 
- Simplified experience for lab users 
    - Simply add new users to the Lab to provide them with the Lab’s set of resources.  
    - Give your users a single list of all the resources they can access across Labs. 
    - Enable your users to manage and reuse data disks. Set up reusable secrets.   
- Embedded security 
    - Set up private virtual networks and subnets for your lab. 
    - Enable a shared public IP address.  
    - Securely access resources using your virtual networks configured with ExpressRoute or site-to-site VPN.
- Cost optimization and analysis
    - Set lab schedules to automatically shut down and start up virtual machines. 
    - Set usage policies per user or per lab to optimize cost.  
    - Analyze usage and activity trends in your lab. 
- Integration into your workflows and tools
    - Integrate the labs into your organization’s website and management systems. 
    - Automatically provision environments from within your continuous integration/continuous deployment (CI/CD) tools.


## Managed labs

### Use cases 

- Provide students with a lab of virtual machines configured with exactly what’s need for class. Give each student a limited number of hours to use the VMs for homework or personal projects.
- Set up a pool of high performance compute VMs to perform compute-intensive or graphics-intensive research. Run the VMs as needed, and instantly clean up the machines once you are done. 
- Move your school’s physical computer lab into the cloud. Automatically scale the number of VMs only to the maximum threshold you set on usage and cost.  
- Quickly provision a lab of virtual machines to host a hackathon. Destroy the lab with a single click once you’re done. 


### Features

- Fast and flexible setup 
    - Walk through a simple, guided flow to set up, and customize your lab. 
    - Use custom templates to quickly reproduce your Lab’s resources. 
    - Choose to create and manage the lab's Azure infrastructure in your own subscription, or choose from a variety of fit-for-purpose labs, such as a Classroom lab or a Research lab, to let the service take care of all infrastructure work. Azure Lab Services provides built-in scaling and resiliency of infrastructure for labs that the service manages for you. No Azure infrastructure knowledge is required to use these managed options.
    - Share customizations and policies across multiple labs. 
- Simplified experience for lab users 
    - Simply add new users to the Lab to provide them with the Lab’s set of resources.  
    - Give your users a single list of all the resources they can access across Labs. 
    - Enable easy access to the resources by integrating the labs into your website or learning management systems. 
- Cost optimization and analysis
    - Set a schedule to specify the time slots when the lab’s virtual machines are accessible to users.  
    - Set usage policies per user or per lab to optimize cost.  
    - Analyze usage and activity trends in your lab. 
- Embedded security 
    - Set up private virtual networks and subnets for your lab. 
    - Enable a shared public IP address.  
    - Securely access resources using your virtual networks configured with ExpressRoute or site-to-site VPN.
 
## Next steps
Get started with setting up a lab using Azure Lab Services:

- [Set up a classroom lab](tutorial-setup-classroom-lab.md)
- [Set up a custom lab](tutorial-create-custom-lab.md)
