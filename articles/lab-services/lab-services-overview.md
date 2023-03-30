---
title: What is Azure Lab Services?
description: Learn how Azure Lab Services can make it easy to create, manage, and secure labs with VMs for educators and students.
services: lab-services
ms.service: lab-services
ms.author: nicktrog
author: ntrogh
ms.topic: overview
ms.date: 03/30/2023
---

# What is Azure Lab Services?

[!INCLUDE [preview note](./includes/lab-services-new-update-note.md)]

Azure Lab Services lets you create labs whose infrastructure is fully managed by Azure. The service handles all the infrastructure management, from spinning up virtual machines (VMs) to handling errors and scaling the infrastructure. For example, configure labs for specific class types, such as data science or general programming, and quickly assign lab users their dedicated lab virtual machine.

To create, manage, and access labs in Azure Lab Services, use the dedicated Azure Lab Services website, or directly integrate labs in [Microsoft Teams](./lab-services-within-teams-overview.md) or the [Canvas Learning Management System (LMS)](./lab-services-within-canvas-overview.md).

Azure Lab Services is designed with three major personas in mind: administrators, educators, and students. Take advantage of Azure Role-Based Access Control (RBAC) to grant the right access to the different personas in your organization. Learn more about these personas and how to [use Azure Lab Services for conducting classes](./classroom-labs-scenarios.md).

## Lab creation process

The following diagram shows the different steps involved in creating and accessing labs with Azure Lab Services.

:::image type="content" source="./media/lab-services-overview/lab-services-process-overview.png" alt-text="Diagram that shows the steps involved in creating a lab with Azure Lab Services.":::

To get started with Azure Lab Services, you [*create a lab plan*](./quick-create-resources.md). A lab plan is an Azure resource that serves as the collection of configuration settings that apply to all labs associated with the lab plan. Optionally, you can *assign lab creator* permissions through Azure RBAC to allow others to create labs.

Next, [*create a lab*](./quick-create-connect-lab.md) for conducting a specific class or running a hackathon, based on Azure Marketplace images or your own custom virtual machine images. You can further *configure the lab* settings with lab schedules, usage quota, or automatic startup and shutdown.

Optionally, *customize the [lab template](./classroom-labs-concepts.md#template-virtual-machine)* to match the specific needs of the class. For example, install extra software such as Visual Studio Code, or enable specific operating system services.

After you *publish the lab*, you can add lab virtual machines, and *assign lab users* to the lab. After they *register* for the lab, lab users can then *remotely connect* to their individual lab virtual machine to perform their exercises. If you use Azure Lab Services with Microsoft Teams or Canvas, lab users are automatically registered for their lab.

To learn about lab plans, labs, and more, see the [key concepts for Azure Lab Services](./classroom-labs-concepts.md).

## Key capabilities

Azure Lab Services supports the following key capabilities and features:

- **Fast and flexible setup of a lab**. Lab owners can quickly [set up a lab](./quick-create-connect-lab.md) for their needs. Azure Lab Services takes care of all Azure infrastructure including built-in scaling and resiliency of infrastructure for labs.

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

There are no guarantees customer data stays in the region it's deployed to when using Azure Lab Services prior to the August 2022 Update.

## Data at rest

Azure Lab Services encrypts all content using a Microsoft-managed encryption key.

## Next steps

See the following resources to get started:

- Learn more about the [key concepts for Azure Lab Services](./classroom-labs-concepts.md)
- [Create the resources to get started](./quick-create-resources.md)
- [Tutorial: set up a lab for classroom training](./tutorial-setup-lab.md)