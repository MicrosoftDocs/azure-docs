---
title: About Azure Lab Services | Microsoft Docs
description: Learn how Lab Services can make it easy to create, manage, and secure labs with VMs for educators and students. 
ms.topic: overview
ms.date: 07/04/2022
ms.custom: devdivchpfy22
---

# An introduction to Azure Lab Services

[!INCLUDE [preview note](./includes/lab-services-new-update-note.md)]

**Azure Lab Services** lets you create labs whose infrastructure is managed by Azure. The service itself handles all the infrastructure management, from spinning up virtual machines (VMs) to handling errors and scaling the infrastructure.  Azure Lab Services was designed with three major personas in mind: [administrators, educators, and students](classroom-labs-concepts.md#user-profiles). After an IT administrator creates a lab plan, an educator can quickly set up a lab for the class.  Educators specify the number and type of VMs needed, configures the template VM, and adds users to the class. Once a user registers to the class, the user can access the VM to do exercises for the class. 

To [create a lab](tutorial-setup-lab.md), you need to [create a lab plan](tutorial-setup-lab-plan.md) for your organization first. The lab plan serves as a collection of configurations and settings that apply to the labs created from it.

The service creates and manages resources in a subscription managed by Microsoft. Resources aren't created in your own Azure subscription.  The [advanced networking](how-to-connect-vnet-injection.md) option is an exception as there are a few resources saved in your subscription.  Virtual machines are always hosted in the Microsoft managed subscription.  The service keeps track of usage of these resources in internal Microsoft subscriptions. This usage is [billed back to your Azure subscription](cost-management-guide.md) that contains the lab plan.

## Key capabilities

Azure Lab Services supports the following key capabilities and features:

- **Fast and flexible setup of a lab**. Lab owners can quickly [set up a lab](tutorial-setup-lab.md) for their needs. Azure Lab Services takes care of all Azure infrastructure including built-in scaling and resiliency of infrastructure for labs.

- **Simplified experience for lab users**. Students who are invited to a lab get immediate access to the resources you give them inside your labs. They just need to sign in to see the full list of virtual machines for all labs that they can access. They can select a single button to connect to the virtual machines and start working. Users don't need Azure subscriptions to use the service.  [Lab users can register](how-to-use-lab.md) to a lab with a registration code and can access the lab anytime to use the lab's resources.

- **Cost optimization and analysis**. [Keep your budget in check](cost-management-guide.md) by controlling exactly how many hours your lab users can use the virtual machines. Set up [schedules](how-to-create-schedules.md) in the lab to allow users to use the virtual machines only during designated time slots. Set up [auto-shutdown policies](how-to-configure-auto-shutdown-lab-plans.md) to avoid unneeded VM usage. Keep track of [individual users' usage](how-to-manage-classroom-labs.md) and [set limits](how-to-configure-student-usage.md#set-quotas-for-users).

- **Automatic management of Azure infrastructure and scale**  Azure Lab Services is a managed service, which means that provisioning and management of a lab's underlying infrastructure is handled automatically by the service. You can just focus on preparing the right lab experience for your users. Let the service handle the rest and roll out your lab's virtual machines to your audience. Scale your lab to hundreds of virtual machines with a single action.

Here are some of the **use cases for managed labs**:

- Provide students with a lab of virtual machines configured with exactly what's needed for a class. Give each student a limited number of hours for using the VMs for homework or personal projects.
- Set up a pool of high-performance compute VMs to perform compute-intensive or graphics-intensive research. Run the VMs as needed, and clean up the machines once you're done.
- Move your school's physical computer lab into the cloud. Automatically scale the number of VMs only to the maximum usage and cost threshold that you set on the lab.  
- Quickly create a lab of virtual machines for hosting a hackathon. Delete the lab with a single action once you're done.

## Example class types

You can set up labs for several types of classes with Azure Lab Services. See the [Example class types on Azure Lab Services](class-types.md) article for a few example types of classes for which you can set up labs with Azure Lab Services.

## Region availability

Visit the [Azure Global Infrastructure products by region](https://azure.microsoft.com/global-infrastructure/services/?products=lab-services) page to learn where Azure Lab Services is available.

[Azure Lab Services August 2022 Update](lab-services-whats-new.md)) doesn't move or store customer data outside the region it's deployed in.  However, accessing Azure Lab Services resources through the Azure Lab Services portal may cause customer data to cross regions.

There are no guarantees customer data will stay in the region it's deployed to when using Azure Lab Services previous to the August 2022 Update.

## Data at rest

Azure Lab Services encrypts all content using Microsoft managed encryption key.

## Next steps

See the following tutorials for step-by-step instructions to create a lab plan, and create a lab.

- [Azure Lab Service concepts](classroom-labs-concepts.md)
- [Tutorial: setup a lab plan](tutorial-setup-lab-plan.md)
- [Tutorial: create a lab](tutorial-setup-lab.md)
