---
title: About Azure Lab Services | Microsoft Docs
description: Learn how Lab Services can make it easy to create, manage, and secure labs with virtual machines that can be used by educators and students. 
ms.topic: overview
ms.date: 01/04/2022
---

# An introduction to Azure Lab Services

[!INCLUDE [preview note](./includes/lab-services-new-update-note.md)]

**Azure Lab Services** lets you create labs whose infrastructure is managed by Azure. The service itself handles all the infrastructure management, from spinning up VMs to handling errors and scaling the infrastructure. After an IT admin creates a lab plan in Azure Lab Services, an instructor can quickly set up a lab for the class.  Instructors specify the number and type of VMs that are needed for exercises in the class, configures the template VM, and add users to the class. Once a user registers to the class, the user can access the VM to do exercises for the class.

To [create a lab](tutorial-setup-lab.md), you need to [create a lab plan](tutorial-setup-lab-plan.md) for your organization first. The lab plan serves as a collection of configurations and settings that apply to the labs created from it.

The service creates and manages resources in internal Microsoft subscriptions. They aren't created in your own Azure subscription, except if using the [advanced networking](how-to-connect-vnet-injection.md) option. The service keeps track of usage of these resources in internal Microsoft subscriptions. This usage is [billed back to your Azure subscription](cost-management-guide.md) that contains the lab plan.

## Key capabilities

Azure Lab Services supports the following key capabilities/features:

- **Fast and flexible setup of a lab**. Using Azure Lab Services, lab owners can quickly [set up a lab](tutorial-setup-lab.md) for their needs. The service takes care of all Azure infrastructure including built-in scaling and resiliency of infrastructure for labs.

- **Simplified experience for lab users**. Users who are invited to your lab get immediate access to the resources you give them inside your labs. They just need to sign in to see the full list of virtual machines they have access to across multiple labs. They can select a single button to connect to the virtual machines and start working. Users don’t need Azure subscriptions to use the service.  [Lab users can register](how-to-use-lab.md) to a lab with a registration code and can access the lab anytime to use the lab’s resources.

- **Cost optimization and analysis**. [Keep your budget in check](cost-management-guide.md) by controlling exactly how many hours your lab users can use the virtual machines. Set up [schedules](get-started-manage-labs.md#schedules) in the lab to allow users to use the virtual machines only during designated time slots. Set up [auto-shutdown policies](how-to-configure-auto-shutdown-lab-plans.md) to avoid unneeded VM usage. Keep track of [individual users’ usage](how-to-manage-classroom-labs.md) and [set limits](get-started-manage-labs.md#quota-hours).

- **Automatic management of Azure infrastructure and scale**  Azure Lab Services is a managed service, which means that provisioning and management of a lab’s underlying infrastructure is handled automatically by the service. You can just focus on preparing the right lab experience for your users. Let the service handle the rest and roll out your lab’s virtual machines to your audience. Scale your lab to hundreds of virtual machines with a single action.

Here are some of the **use cases for managed labs**:

- Provide students with a lab of virtual machines configured with exactly what’s needed for a class. Give each student a limited number of hours for using the VMs for homework or personal projects.
- Set up a pool of high-performance compute VMs to perform compute-intensive or graphics-intensive research. Run the VMs as needed, and clean up the machines once you're done.
- Move your school’s physical computer lab into the cloud. Automatically scale the number of VMs only to the maximum usage and cost threshold that you set on the lab.  
- Quickly create a lab of virtual machines for hosting a hackathon. Delete the lab with a single action once you’re done.

## Example class types

You can set up labs for several types of classes with Azure Lab Services. See the [Example class types on Azure Lab Services](class-types.md) article for a few example types of classes for which you can set up labs with Azure Lab Services.

## Next steps

See the following tutorials for step-by-step instructions to create a lab plan, and create a lab.

- [Tutorial: setup a lab plan](tutorial-setup-lab-plan.md)
- [Tutorial: create a lab](tutorial-setup-lab.md)
