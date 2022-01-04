---
title: About Azure Lab Services | Microsoft Docs
description: Learn how Lab Services can make it easy to create, manage, and secure labs with virtual machines that can be used by educators and students. 
ms.topic: overview
ms.date: 11/19/2021
---

# An introduction to Azure Lab Services

**Azure Lab Services** lets you create labs whose infrastructure is managed by Azure. Currently, lab is the only type of managed lab that's supported by Azure Lab Services. The service itself handles all the infrastructure management for a managed lab type, from spinning up VMs to handling errors and scaling the infrastructure. After an IT admin creates a lab plan in Azure Lab Services, an instructor can quickly set up a lab for the class, specify the number and type of VMs that are needed for exercises in the class, and add users to the class. Once a user registers to the class, the user can access the VM to do exercises for the class.

[!INCLUDE [preview note](./includes/lab-services-new-update-note.md)]

## Key capabilities

Azure Lab Services supports the following key capabilities/features:

- **Fast and flexible setup of a lab**. Using Azure Lab Services, lab owners can quickly [set up a lab](tutorial-setup-classroom-lab.md) for their needs. The service offers the option to take care of all Azure infrastructure work for managed lab types. The service provides built-in scaling and resiliency of infrastructure for labs that the service manages for you.

- **Simplified experience for lab users**. Users who are invited to your lab get immediate access to the resources you give them inside your labs. They just need to sign in to see the full list of virtual machines they have access to across multiple labs. They can click on a single button to connect to the virtual machines and start working. Users don’t need Azure subscriptions to use the service.  [Lab users can register](how-to-use-classroom-lab.md) to a lab with a registration code and can access the lab anytime to use the lab’s resources.

- **Cost optimization and analysis**. [Keep your budget in check](cost-management-guide.md) by controlling exactly how many hours your lab users can use the virtual machines. Set up schedules in the lab to allow users to use the virtual machines only during designated time slots or set up reoccurring auto-shutdown and start times. Keep track of individual users’ usage and set limits.

- **Automatic management of Azure infrastructure and scale**  Azure Lab Services is a managed service, which means that provisioning and management of a lab’s underlying infrastructure is handled automatically by the service. You can just focus on preparing the right lab experience for your users. Let the service handle the rest and roll out your lab’s virtual machines to your audience. Scale your lab to hundreds of virtual machines with a single click.

If you want to just input what you need in a lab and let the service set up and manage infrastructure required for the lab, choose from one of the **managed lab types**. Currently, **lab** is the only managed lab type that you can create with Azure Lab Services.

The following sections provide more details about these labs.

## Managed lab types

Azure Lab Services allows you to create labs whose infrastructure is managed by Azure. This article refers to them as managed lab types. Managed lab types offer different types of labs that fit for your specific need. Currently, the only managed lab type that's supported is **lab**.

Managed lab types enable you to get started right away, with minimal setup. The service itself handles all the management of the infrastructure for the lab, from spinning up the VMs to handling errors and scaling the infrastructure. To create a managed lab type such as a lab, you need to create a lab plan for your organization first. The lab plan serves as a collection of configurations and settings that apply to the labs created from it.

When you create and use Azure resources in these managed lab types, the service creates and manages resources in internal Microsoft subscriptions. They are not created in your own Azure subscription. The service keeps track of usage of these resources in internal Microsoft subscriptions. This usage is billed back to your Azure subscription that contains the lab plan.

Here are some of the **use cases for managed lab types**:

- Provide students with a lab of virtual machines that are configured with exactly what’s needed for a class. Give each student a limited number of hours for using the VMs for homework or personal projects.
- Set up a pool of high performance compute VMs to perform compute-intensive or graphics-intensive research. Run the VMs as needed, and clean up the machines once you are done.
- Move your school’s physical computer lab into the cloud. Automatically scale the number of VMs only to the maximum usage and cost threshold that you set on the lab.  
- Quickly provision a lab of virtual machines for hosting a hackathon. Delete the lab with a single click once you’re done.

## Example class types

You can set up labs for several types of classes with Azure Lab Services. See the [Example class types on Azure Lab Services](class-types.md) article for a few example types of classes for which you can set up labs with Azure Lab Services.

## Next steps

See the following tutorials for step-by-step instructions to create a lab plan, and create a lab.

- [Tutorial: setup a lab plan](tutorial-setup-lab-plan.md)
- [Tutorial: create a lab](tutorial-setup-classroom-lab.md)
