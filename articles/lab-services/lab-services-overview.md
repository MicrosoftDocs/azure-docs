---
title: About Azure Lab Services | Microsoft Docs
description: Learn how Lab Services can make it easy to create, manage, and secure labs with virtual machines that can be used by developers, testers, educators, students, and others. 
ms.topic: overview
ms.date: 06/26/2020
---

# An introduction to Azure Lab Services
**Azure Lab Services** lets you create labs whose infrastructure is managed by Azure. Currently, classroom lab is the only type of managed lab that's supported by Azure Lab Services. The service itself handles all the infrastructure management for a managed lab type, from spinning up VMs to handling errors and scaling the infrastructure. After an IT admin creates a lab account in Azure Lab Services, an instructor can quickly set up a lab for the class, specify the number and type of VMs that are need to exercises in the class, and add users to the class. Once a user registers to the class, the user can access the VM to do exercises for the class.  

## Key capabilities
Azure Lab Services supports the following key capabilities/features:

- **Fast and flexible setup of a lab**. Using Azure Lab Services, lab owners can quickly set up a lab for their needs. The service offers the option to take care of all Azure infrastructure work for managed lab types. The service provides built-in scaling and resiliency of infrastructure for labs that the service manages for you.
- **Simplified experience for lab users**. Lab users can register to a lab with a registration code and can access the lab anytime to use the lab’s resources. 
- **Cost optimization and analysis**. A lab owner can set lab schedules to automatically shut down and start up virtual machines. The lab owner can set a schedule to specify the time slots when the lab’s virtual machines are accessible to users and set usage policies per user or per lab to optimize cost. 

If you want to just input what you need in a lab and let the service set up and manage infrastructure required for the lab, choose from one of the **managed lab types**. Currently, **classroom lab** is the only managed lab type that you can create with Azure Lab Services.

The following sections provide more details about these labs. 

## Managed lab types
Azure Lab Services allows you to create labs whose infrastructure is managed by Azure. This article refers to them as managed lab types. Managed lab types offer different types of labs that fit for your specific need. Currently, the only managed lab type that's supported is **classroom lab**. 

Managed lab types enable you to get started right away, with minimal setup. The service itself handles all the management of the infrastructure for the lab, from spinning up the VMs to handling errors and scaling the infrastructure. To create a managed lab type such as a classroom lab, you need to create a lab account for your organization first. The lab account serves as the central account in which all labs in the organization are managed. 

When you create and use Azure resources in these managed lab types, the service creates and manages resources in internal Microsoft subscriptions. They are not created in your own Azure subscription. The service keeps track of usage of these resources in internal Microsoft subscriptions. This usage is billed back to your Azure subscription that contains the lab account.   

Here are some of the **use cases for managed lab types**: 

- Provide students with a lab of virtual machines that are configured with exactly what’s needed for a class. Give each student a limited number of hours for using the VMs for homework or personal projects.
- Set up a pool of high performance compute VMs to perform compute-intensive or graphics-intensive research. Run the VMs as needed, and clean up the machines once you are done. 
- Move your school’s physical computer lab into the cloud. Automatically scale the number of VMs only to the maximum usage and cost threshold that you set on the lab.  
- Quickly provision a lab of virtual machines for hosting a hackathon. Delete the lab with a single click once you’re done. 

## Next steps
See the following tutorials for step-by-step instructions to create a lab account, and create a classroom lab.

- [Tutorial: setup a lab account](tutorial-setup-lab-account.md)
- [Tutorial: create a classroom lab](tutorial-setup-classroom-lab.md)
