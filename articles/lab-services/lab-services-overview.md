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
This articles introduces you to Azure Lab Services (Preview) and Azure DevTest Labs services that's in general availability (GA). 

Azure Lab Services and Azure DevTest Labs enables you to quickly set up an environment for your team (for example: development environment, test environment, classroom lab environment) in the cloud. A lab owner creates a lab, provisions Windows, or Linux virtual machines, installs the necessary software and tools, and makes them available to lab users. Lab users connect to virtual machines (VMs) in the lab, and use them for their day-to-day work, short-term projects, or for doing classroom exercises. Once users start utilizing resources in the lab, a lab admin can analyze cost and usage across multiple labs, and set overarching policies to optimize your organization or team's costs.

You create **Azure managed labs** with Azure Lab Services and **self-managed labs** with Azure DevTest Labs. If you want to just input what you need in a lab and let the service set up and manage infrastructure required for the lab, choose from one of the **managed labs** supported by Azure Lab Services. Currently, classroom lab is the only type of managed lab that you can create with Azure Lab Services. If you want to manage your own infrastructure, create a **self-managed lab** with Azure DevTest Labs. 

## Azure Lab Services
Azure Lab Services enables you to quickly set up an environment for your team (for example: development environment, test environment, classroom lab environment) in the cloud. A lab owner creates a lab, provisions Windows, or Linux virtual machines, installs the necessary software and tools, and makes them available to lab users. Lab users connect to virtual machines (VMs) in the lab, and use them for their day-to-day work, short-term projects, or for doing classroom exercises. Once users start utilizing resources in the lab, a lab admin can analyze cost and usage across multiple labs, and set overarching policies to optimize your organization or team's costs.

Managed labs offer different types of labs that fit for your specific need. Currently, Azure Lab Services supports only classroom lab as a managed lab. Managed labs enable you to get started right away, with minimal setup. The service itself handles all the management of the infrastructure for the lab, from spinning up the VMs to handling errors, and scaling the infrastructure. To create a managed lab, you need to create a lab account for your organization first. The lab account serves as the central account in which all labs in the organization are managed. 

When you create and use Azure resources in these managed labs, the service creates and manages resources in internal Microsoft subscriptions. They are not created in your own Azure subscription. The service keeps track of usage of these resources in internal Microsoft subscriptions. This usage is billed back to your Azure subscription that contains the lab account. 

### Key capabilities
Azure Lab Services supports the following key capabilitiies/features: 

- **Fast and flexible setup of a lab**. 
    Using Azure Lab Services, you can quickly set up a lab for your classroom or training needs. The service takes care of all the infrastructure work for managed labs including classroom labs. The service provides built-in scaling and resiliency of infrastructure for labs that the service manages for you. 
- **Simplified experience for lab users**. 
    An administrator of organization's cloud resources, who owns the Azure subscription acts as a lab account owner, who sets up a lab account for your organization, manages and configures policies across all labs, and gives permissions to people in the organization to create a lab under the lab account. An educator creates labs with a template for virtual machine to be used in the class. A student registers with and accesses the classroom lab to do classwork or home work. 

### Use cases for managed labs
Here are some of the use cases for managed labs: 

- Provide students with a lab of virtual machines that are configured with exactly what’s needed for a class. Give each student a limited number of hours for using the VMs for homework or personal projects.
- Set up a pool of high performance compute VMs to perform compute-intensive or graphics-intensive research. Run the VMs as needed, and clean up the machines once you are done. 
- Move your school’s physical computer lab into the cloud. Automatically scale the number of VMs only to the maximum usage and cost threshold that you set on the lab. 
- Quickly provision a lab of virtual machines for hosting a hackathon. Delete the lab with a single click once you’re done. 


## Azure DevTest Labs
Developers and testers are looking to solve the delays in creating and managing their environments by going to the cloud. Azure solves the problem of environment delays and allows self-service within a new cost efficient structure. However, developers and testers still need to spend considerable time configuring their self-served environments. Also, decision makers are uncertain about how to leverage the cloud to maximize their cost savings without adding too much process overhead.

Azure DevTest Labs is a service that helps developers and testers quickly create environments in Azure while minimizing waste and controlling cost. You can test the latest version of your application by quickly provisioning Windows and Linux environments using reusable templates and artifacts. Easily integrate your deployment pipeline with DevTest Labs to provision on-demand environments. Scale up your load testing by provisioning multiple test agents, and create pre-provisioned environments for training and demos.

### Use DevTest Labs for development envioronments
Azure DevTest Labs can be used to implement many key scenarios, but one of the primary scenarios involves using DevTest Labs to host development machines for developers. In this scenario, DevTest Labs provides these benefits:

- Developers can quickly provision their development machines on demand.
- Developers can easily customize their development machines whenever needed.
- Administrators can control costs by ensuring that developers cannot get more VMs than they need for development and VMs are shut down when not in use. 
 
![Use DevTest Labs for development](./media/devtest-lab-developer-lab/devtest-lab-developer-lab.png)

For more information, see [Use DevTest Labs for development](devtest-lab-developer-lab.md).

### Use DevTest Labs for test environments
You can use Azure DevTest Labs to implement many key scenarios, but a primary scenario involves using DevTest Labs to host machines for testers. In this scenario, DevTest Labs provides these benefits:

- Testers can test the latest version of their application by quickly provisioning Windows and Linux environments using reusable templates and artifacts.
- Testers can scale up their load testing by provisioning multiple test agents.
- Administrators can control costs by ensuring that:
    - Testers cannot get more VMs than they need.
    - VMs are shut down when not in use.

For more information, see [Use DevTest Labs for testing](devtest-lab-test-env.md).

### Use DevTest Labs for training
Azure DevTest Labs can be used to implement many key scenarios in addition to dev/test. One of those scenarios is to set up a lab for training. Azure DevTest Labs allows you to create a lab where you can provide custom templates that each trainee can use to create identical and isolated environments for training. You can apply policies to ensure that training environments are available to each trainee only when they need them and contain enough resources - such as virtual machines - required for the training. Finally, you can easily share the lab with trainees, which they can access in one click.

![Use DevTest Labs for training](./media/devtest-lab-training-lab/devtest-lab-training.png)

For more information, see [Use DevTest Labs for training](devtest-lab-training-lab.md).

### Key capabilities
Azure Lab Services supports the following key capabilitiies/features: 

- **Fast and flexible setup of a lab**. 
    You can quickly set up a lab for your development, testing, or training needs. You can choose to create and manage the lab's Azure infrastructure in your own subscription. You can use a custom template to quickly reproduce your lab's resources, and share customizations and policies across multiple labs. 
- **Simplified experience for lab users**. 
    A lab owner adds users to a lab and provide them access to lab’s set of resources. A lab user views a single list of all the resources that they can access across labs. A lab owner gives permissions for lab users to manage and reuse data disks, and sets up reusable secrets. Lab users can integrate labs into their website or learning management systems. 
- **Cost optimization and analysis**. 
    A lab owner can set lab schedules to automatically shut down and start up virtual machines. The lab owner can set a schedule to specify the time slots when the lab’s virtual machines are accessible to users, set usage policies per user or per lab to optimize cost, and analyze usage and activity trends in a lab. For managed labs such as classroom labs, currently some cost optimization and analysis options are available. 
- **Embedded security**. 
    A lab owner can set up a private virtual networks and a subnet for a lab, and enable a shared public IP address. Lab users can securely access resources using the virtual network configured with ExpressRoute or site-to-site VPN.
- **Integration into your workflows and tools**.
    Azure Lab Services allows you to integrate the labs into your organization’s website and management systems. You can automatically provision environments from within your continuous integration/continuous deployment (CI/CD) tools.

## Next steps
Get started with setting up a lab using Azure Lab Services:

- [Set up a classroom lab](tutorial-setup-classroom-lab.md)
- [Set up a self-managed lab](tutorial-create-custom-lab.md)
