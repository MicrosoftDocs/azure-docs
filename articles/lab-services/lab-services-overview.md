---
title: What is Azure Lab Services?
description: Learn how Azure Lab Services can make it easy to create, manage, and secure labs with VMs for educators and students.
services: lab-services
ms.service: lab-services
author: RoseHJM
ms.author: rosemalcolm
ms.topic: overview
ms.date: 03/12/2024
#customer intent: As an administrator or educator, I want to understand Azure Lab Services in order to plan and create labs for education and training.
---

# What is Azure Lab Services?

Azure Lab Services enables you to create labs with infrastructure managed by Azure. The service handles all the infrastructure management, from spinning up virtual machines (VMs) to handling errors and scaling the infrastructure. For example, configure labs for specific class types, such as data science or general programming, and quickly assign lab users their dedicated lab virtual machine.

To create, manage, and access labs in Azure Lab Services, use the dedicated Azure Lab Services website, or directly integrate labs in Microsoft Teams or the Canvas Learning Management System (LMS).

Azure Lab Services is designed with three major personas in mind: administrators, educators, and students. Take advantage of Azure Role-Based Access Control (RBAC) to grant the right access to the different personas in your organization. In this article, you learn about these personas and how to use Azure Lab Services for conducting classes.

[!INCLUDE [preview note](./includes/lab-services-new-update-note.md)]

## Lab creation process

The following diagram shows the different steps involved in creating and accessing labs with Azure Lab Services.

:::image type="content" source="./media/lab-services-overview/lab-services-process-overview.png" alt-text="Diagram that shows the steps involved in creating a lab with Azure Lab Services." lightbox="./media/lab-services-overview/lab-services-process-overview.png":::

To get started with Azure Lab Services, you [create a lab plan](./quick-create-resources.md). A lab plan is an Azure resource that serves as the collection of configuration settings. The settings apply to all labs associated with the lab plan. Optionally, you can assign *lab creator* permissions through Azure RBAC to allow others to create labs.

Next, [create a lab](./quick-create-connect-lab.md) to conduct a specific class or run a hackathon. Labs are based on Azure Marketplace images or your own custom virtual machine images. You can then configure the lab with lab schedules, usage quota, or automatic startup and shutdown.

Optionally, customize the [lab template](./classroom-labs-concepts.md#template-virtual-machine) to match the specific needs of the class. For example, install extra software such as Visual Studio Code, or enable specific operating system services.

After you publish the lab, you can add lab virtual machines and assign lab users to the lab. After they register for the lab, lab users can then remotely connect to their individual lab virtual machine to perform their exercises. If you use Azure Lab Services with Microsoft Teams or Canvas, lab users are automatically registered for their lab.

To learn about lab plans, labs, and more, see the [key concepts for Azure Lab Services](./classroom-labs-concepts.md).

## Key capabilities

Azure Lab Services supports the following key capabilities and features:

- **Automatic management of Azure infrastructure and scale**. Azure Lab Services is a fully managed service. It automatically handles the provisioning and management of a lab's underlying infrastructure. Focus on preparing the lab experience for the lab users, and quickly scale the lab across hundreds of lab virtual machines.

- **Fast and flexible setup of a lab**. Quickly [set up a lab](./quick-create-connect-lab.md) by using an Azure Marketplace image or by applying a custom image from an Azure compute gallery. Choose between Windows or Linux operating systems. Select the compute family that best matches the needs for your lab. Flexibly configure the lab by installing other software components or making operating system changes.

- **Simplified experience for lab users**. Lab users can easily [register for a lab](how-to-use-lab.md). They get immediate access without the need for an Azure subscription. To view the list of labs and remotely connect, use the Azure Lab Services website, or use the [Microsoft Teams](./lab-services-within-teams-overview.md) or [Canvas LMS](./lab-services-within-canvas-overview.md) integration.

- **Separate responsibilities with role-based access**. Azure Lab Services uses Azure Role-Based Access (Azure RBAC) to manage access. Using Azure RBAC lets you clearly separate roles and responsibilities for creating and managing labs across different teams and people in your organization.

- **Advanced virtual networking support**. [Configure advanced networking](./tutorial-create-lab-with-advanced-networking.md) to apply network traffic control, network ports management, or access resources in a virtual or internal network. For example, your labs might have to connect to an on-premises licensing server.

- **Cost optimization and analysis**. Azure Lab Services uses a consumption-based [cost model](cost-management-guide.md). You pay only for lab virtual machines when they're running. Further optimize your costs by [automatically shutting down lab virtual machines](./how-to-configure-auto-shutdown-lab-plans.md), and by configuring [schedules](./how-to-create-schedules.md) and [usage quotas](./how-to-manage-lab-users.md#set-quotas-for-users) to limit the number of hours the labs can be used.

## Use cases

You can use the Azure Lab Services managed labs in different scenarios:

- Provide preconfigured virtual machine to attendees of a [classroom or virtual training](./classroom-labs-scenarios.md) for completing homework or exercises. Limit the number of hours that lab users have access to their virtual machine. Set up labs for several types of classes with Azure Lab Services. See the [example class types on Azure Lab Services](class-types.md) article for a few example types of classes for which you can set up labs with Azure Lab Services.

- Set up a pool of high-performance compute virtual machines to perform compute-intensive or graphics-intensive research or training. For example, to train machine learning models, or teach about data science or game design. Run the virtual machines only when you need them. Clean up the machines when you finish.

- Move your school's physical computer lab into the cloud. Automatically scale the number of virtual machines to the maximum usage and cost threshold that you set on the lab.

- Quickly create a lab of virtual machines for [hosting a hackathon](./hackathon-labs.md). Delete the lab with a single action once you're done.

- Teach advanced courses using nested virtualization or lab-to-lab communication.

## Privacy and compliance

[An Azure Lab Services lab plan](concept-lab-accounts-versus-lab-plans.md) doesn't move or store customer data outside its region. However, if you access Azure Lab Services resources through the Azure Lab Services website (https://labs.azure.com), customer data might cross regions.

There are no guarantees that customer data stays in the region where you deploy it when using lab accounts in Azure Lab Services.

Azure Lab Services encrypts all content using a Microsoft-managed encryption key.

## Related content

See the following resources to get started:

- Learn more about the [key concepts for Azure Lab Services](./classroom-labs-concepts.md)
- [Create the resources to get started](./quick-create-resources.md)
- [Set up a lab for classroom training](./tutorial-setup-lab.md)
