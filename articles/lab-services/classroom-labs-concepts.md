---
title: Key concepts for Azure Lab services
titleSuffix: Azure Lab Services
description: Learn the basic concepts of Lab Services, and how it can make it easy to create and manage labs.
ms.topic: how-to
ms.date: 02/02/2023
ms.custom: devdivchpfy22
---

# Key concepts for Azure Lab Services

This article describes key Azure Lab Services concepts and definitions.

The following conceptual diagram shows how the different Azure Lab Services components are related.

:::image type="content" source="./media/classroom-labs-concepts/lab-services-key-concepts.png" alt-text="Diagram that shows the relationships between the different concepts in Azure Lab Services." lightbox="./media/classroom-labs-concepts/lab-services-key-concepts.png":::

## Lab plan

In Azure Lab Services, a lab plan is an Azure resource and serves as a collection of configurations and settings that apply to all the labs created from it. For example, lab plans specify the networking setup, the list of available VM images and VM sizes, and if [Canvas integration](lab-services-within-canvas-overview.md) can be used for a lab. Learn more about [planning your lab plan settings](./lab-plan-setup-guide.md#plan-your-lab-plan-settings).

A lab plan can contain zero or more [labs](#lab). Each lab uses the configuration settings from the lab plan. Azure Lab Services uses Azure AD roles to grant permissions for creating labs. Learn more about [Azure Lab Services built-in roles](./administrator-guide.md#rbac-roles). 

## Lab

A lab contains the configuration and settings for creating and running [lab virtual machines](#lab-virtual-machine). For example, you specify the base VM image for the lab VMs by selecting an image from the Azure Marketplace or an [Azure compute gallery](#azure-compute-gallery). Optionally, you can customize this VM image by using a [template VM](#template-virtual-machine).

You can further configure the lab behavior by creating [lab schedules](#schedule) or configuring automatic shutdown settings to optimize cost.

When you publish a lab, Azure Lab Services provisions the lab VMs. All lab VMs for a lab share the same configuration and are identical.

To create labs in Azure Lab Services, your Azure account needs to have the Lab Creator Azure AD role or you need to be the owner of the corresponding lab plan. Learn more about [Azure Lab Services built-in roles](./administrator-guide.md#rbac-roles).

You use the Azure Lab Services website (https://labs.azure.com) to create labs for a lab plan. Alternately, you can also [configure Microsoft Teams integration](./how-to-configure-teams-for-lab-plans.md) or [Canvas integration](./how-to-configure-canvas-for-lab-plans.md) with Azure Lab Services to create labs directly in Microsoft Teams or Canvas.

By default, access to lab virtual machines is restricted. For a lab, you can [configure the list of lab users](./how-to-configure-student-usage.md) that have access to the lab.

Get started by [creating a lab using the Azure portal](quick-create-lab-plan-portal.md).

## Azure Compute Gallery

When you create a lab, you select the base VM image for the lab VMs. You can use an [Azure compute gallery](/azure/virtual-machines/azure-compute-gallery) to store and share custom VM images. By using a compute gallery, you avoid having to repeatedly apply the same customizations when you create a new lab. If you have customized a lab with a template VM, you can [export the template VM to your compute gallery](./approaches-for-custom-image-creation.md).

To use VM images from a compute gallery, you attach the Azure compute gallery to your lab plan. You can attach zero or more Azure compute galleries to a lab plan. After attaching a compute gallery, you can further enable or disable specific images.

Learn how to [attach or detach an Azure compute gallery](./how-to-attach-detach-shared-image-gallery.md).

## Template virtual machine

You can choose to create a customizable lab, which enables you to modify the base image for the [lab VMs](#lab-virtual-machine). For example, to install additional software components are modify operating system settings. In this case, Azure Lab Services creates a lab template VM, which you can connect to and customize.

When you [publish the lab](./tutorial-setup-lab.md#publish-lab), Azure Lab Services creates the lab VMs, based on the the template VM image. If you modify the template VM at a later stage, the lab VMs will be updated to match the new template.

With the [introduction of lab plans](lab-services-whats-new.md), you can also create a templateless lab. In a templateless lab, you select the base image for the lab VMs from the Azure Marketplace or an Azure compute gallery.

Learn how to [create and manage a template in Azure Lab Services](./how-to-create-manage-template.md).

## Lab virtual machine

In Azure Lab Services, lab VMs are managed virtual machines that get their configuration from the [lab](#lab). All VMs for a lab are identical. Azure Lab Services provisions the lab VMs when you publish the lab.

After provisioning the lab VMs, lab users can connect to their VM through remote desktop (RDP) or secure shell (SSH). Before they can connect to the lab VM, lab users have to first [register for the lab](./how-to-use-lab.md) by using a registration link. Azure Lab Services then assigns the user to a specific lab VM.

In the lab settings, you can configure one or more [schedules](#schedule) to automatically start and stop the lab VMs. Depending on their [user quota](#quota), lab users can also manually start their lab VM outside the scheduled events.

## Schedule

Schedules are the time slots that a lab creator defines so the lab VMs are available for class time.  Schedules can be one-time or recurring.  Any scheduled time doesn't count against extra time that lab users have. A lab can use [quota](#quota) time, scheduled time, or a combination of both.

A common scenario for scheduled time is where students are following the educator's directions during class hours. For more information about schedules, see [Create and manage schedules for labs in Azure Lab Services](how-to-create-schedules.md).

All the lab VMs are started with schedules, except for lab VMs that are not assigned yet. A lab VM is started, regardless if a user sign into the VM or not.  To help reduce the cost of running VMs that are unused, see you can [configure automatic shutdown of lab VMs](how-to-enable-shutdown-disconnect.md).

There are two types of schedules.

- **Standard**. This schedule starts all lab VMs at the specified start time and shuts down all lab VMs at the specified stop time.
- **Stop only**. This schedule stops all lab VMs at the specified time, even if the VM was manually started by the lab creator or the lab user.

## Quota

A Quota is the limit of time a lab user can use their VM outside of scheduled lab events.  For example, you can assign quota hours to allow students to complete their homework. If no quota is assigned, lab users can only use their VM during scheduled time, or if the lab creator manually starts a lab VM for them.

When a lab user starts their lab VM, quota hours for the lab start counting. If a lab creator manually starts the lab VM for a user, quota hours aren't used for that student.

A lab can use either quota time, [scheduled time](#schedule), or a combination of both.

## Next steps

- [Create the resources to get started](./quick-create-resources.md)
- [Tutorial: Set up a lab for classroom training](./tutorial-setup-lab.md)
