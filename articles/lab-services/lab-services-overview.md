---
title: What is Azure Lab Services?
description: Learn how Azure Lab Services can make it easy to create, manage, and secure labs with VMs for educators and students.
services: lab-services
ms.service: lab-services
ms.author: nicktrog
author: ntrogh
ms.topic: overview
ms.date: 04/03/2023
---

# What is Azure Lab Services?

Azure Lab Services lets you create labs whose infrastructure is fully managed by Azure. The service handles all the infrastructure management, from spinning up virtual machines (VMs) to handling errors and scaling the infrastructure. For example, configure labs for specific class types, such as data science or general programming, and quickly assign lab users their dedicated lab virtual machine.

To create, manage, and access labs in Azure Lab Services, use the dedicated Azure Lab Services website, or directly integrate labs in [Microsoft Teams](./lab-services-within-teams-overview.md) or the [Canvas Learning Management System (LMS)](./lab-services-within-canvas-overview.md).

Azure Lab Services is designed with three major personas in mind: administrators, educators, and students. Take advantage of Azure Role-Based Access Control (RBAC) to grant the right access to the different personas in your organization. Learn more about these personas and how to [use Azure Lab Services for conducting classes](./classroom-labs-scenarios.md).

[!INCLUDE [preview note](./includes/lab-services-new-update-note.md)]

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

- **Automatic management of Azure infrastructure and scale**.  Azure Lab Services is a fully managed service, which automatically handles the provisioning and management of a lab's underlying infrastructure. Focus on preparing the lab experience for the lab users, and quickly scale the lab across hundreds of lab virtual machines.

- **Fast and flexible setup of a lab**. Quickly [set up a lab](./quick-create-connect-lab.md) by using an Azure Marketplace image or by applying a custom image  from an Azure compute gallery. Choose between Windows or Linux operating systems, and select the compute family that best matches the needs for your lab. Flexibly configure the lab by installing additional software components or making operating system changes.

- **Simplified experience for lab users**. Lab users can easily [register for a lab](how-to-use-lab.md), and get immediate access without the need for an Azure subscription. Use the Azure Lab Services website, or use the [Microsoft Teams](./lab-services-within-teams-overview.md) or [Canvas LMS](./lab-services-within-canvas-overview.md) integration, to view the list of labs and remotely connect to a lab virtual machine.

- **Separate responsibilities with role-based access**. Azure Lab Services uses Azure Role-Based Access (Azure RBAC) to manage access. Using Azure RBAC lets you clearly separate roles and responsibilities for creating and managing labs across different teams and people in your organization.

- **Advanced virtual networking support**. [Configure advanced networking](./tutorial-create-lab-with-advanced-networking.md) for your labs to apply network traffic control, network ports management, or access resources in a virtual or internal network. For example, your labs might have to connect to an on-premises licensing server.

- **Cost optimization and analysis**. Azure Lab Services uses a consumption-based [cost model](cost-management-guide.md) and you pay only for lab virtual machines when they're running. Further optimize your costs for running labs by [automatically shutting down lab virtual machines](./how-to-configure-auto-shutdown-lab-plans.md), and by configuring [schedules](./how-to-create-schedules.md) and [usage quotas](./how-to-manage-lab-users.md#set-quotas-for-users) to limit the number of hours the labs can be used.
 
## Use cases

You can use the Azure Lab Services managed labs in different scenarios:

- Provide preconfigured virtual machine to attendees of a [classroom or virtual training](./classroom-labs-scenarios.md) for completing homework of exercises. Limit the number of hours that lab users have access to their virtual machine. Set up labs for several types of classes with Azure Lab Services. See the [example class types on Azure Lab Services](class-types.md) article for a few example types of classes for which you can set up labs with Azure Lab Services.

- Set up a pool of high-performance compute virtual machines to perform compute-intensive or graphics-intensive research or training. For example, to run train machine learning models, or teach about data science or game design. Run the virtual machines only when you need them, and clean up the machines once you're done.

- Move your school's physical computer lab into the cloud. Automatically scale the number of virtual machines only to the maximum usage and cost threshold that you set on the lab.

- Quickly create a lab of virtual machines for [hosting a hackathon](./hackathon-labs.md). Delete the lab with a single action once you're done.

- Teach advanced courses using nested virtualization or lab-to-lab communication.

## Privacy and compliance

### Data residency

[Azure Lab Services August 2022 Update](lab-services-whats-new.md)) doesn't move or store customer data outside the region it's deployed in.  However, if you access Azure Lab Services resources through the Azure Lab Services website (https://labs.azure.com), customer data might cross regions.

There are no guarantees that customer data stays in the region it's deployed to when using Azure Lab Services prior to the August 2022 Update.

### Data at rest
Azure Lab Services encrypts all content using a Microsoft-managed encryption key.

## Next steps

See the following resources to get started:

- Learn more about the [key concepts for Azure Lab Services](./classroom-labs-concepts.md)
- [Create the resources to get started](./quick-create-resources.md)
- [Tutorial: set up a lab for classroom training](./tutorial-setup-lab.md)