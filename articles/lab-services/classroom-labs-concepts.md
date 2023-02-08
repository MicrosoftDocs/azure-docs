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

A lab contains the configuration and settings for creating and running [lab virtual machines](#lab-virtual-machine). In the lab, you specify the base VM image for the lab VMs. Optionally, you can customize this VM image by using a [template VM](#template-virtual-machine). All lab VMs for a lab share the same configuration and are identical.

You can further configure the lab behavior by creating [lab schedules](#schedules) or configuring [automatic shutdown settings](#automatic-shut-down) to optimize cost.

To create labs in Azure Lab Services, your Azure account needs to have the Lab Creator Azure AD role or you need to be the owner of the corresponding lab plan. Learn more about [Azure Lab Services built-in roles](./administrator-guide.md#rbac-roles).

You use the Azure Lab Services website (https://labs.azure.com) to create labs for a lab plan. Alternately, you can also [configure Microsoft Teams integration](./how-to-configure-teams-for-lab-plans.md) or [Canvas integration](./how-to-configure-canvas-for-lab-plans.md) with Azure Lab Services to create labs directly in Microsoft Teams or Canvas.

By default, access to lab virtual machines is restricted. For a lab, you can [configure the list of lab users](./how-to-configure-student-usage.md) that have access to the lab.

Get started by [creating a lab using the Azure portal](quick-create-lab-plan-portal.md).

## Azure Compute Gallery

## Template virtual machine

A template VM in a lab is a base image from which all students' VMs are created. Educators configure the template VM with the software needed to complete the lab. When educators [publish a template VM](tutorial-setup-lab.md#publish-a-lab), Azure Lab Services creates or updates student lab VMs to match the template VM.

Labs can be created without needing a template VM, if using the [August 2022 Update](lab-services-whats-new.md).  The Marketplace or Azure Compute Gallery image is used as-is to create the student's VMs.

## Lab virtual machine


Lab users can then register for the lab and connect to their VM through remote desktop (RDP) or secure shell (SSH).


## Schedules

Schedules are the time slots that an educator creates so the lab VMs are available for class time.  Schedules can be one-time or recurring.  Any scheduled time doesn't count against extra time students may be given to complete homework. A lab can use [quota](#quota) time, scheduled time, or a combination of both.

Scheduled time is commonly used when students are following the educator's directions during class hours. For more information about schedules, see [Create and manage schedules for labs in Azure Lab Services](how-to-create-schedules.md).

All the student VMs are started with schedules.  (Unclaimed VMs aren't started when schedules run.)  VMs are started even if a student doesn't sign into a VM.  To help reduce likelihood of accruing costs when a VM isn't being used, see [Configure automatic shutdown of VMs for a lab](how-to-enable-shutdown-disconnect.md).

There are two types of schedules.

- **Standard**.  This schedule will start all student VMs at the specified start time and shut down all lab VMs at the specified stop time.
- **Stop only**.  This schedule will stop all lab VMs at the specified time, even if the VM was manually started by an educator or student.

## Quota

Quota is the limit of time a student may use their VM outside of class.  Allowing time for homework is done by using quota hours.  If no quota is assigned, students can only use their VM during scheduled time or if the educator starts the VM for them.  

Quota hours are counted when the student starts the lab VM themselves.  If an educator manually starts the lab VM for a student, quota hours aren't used for that student.

A lab can use either quota time, [scheduled time](#schedules), or a combination of both.

## Automatic shut-down

Anytime a machine is **Running**, costs are being incurred, even if no one is connected to the VM.  You can enable several auto-shutdown features to avoid extra costs when the VMs aren't being used.  The are three auto-shutdown policies available in Azure Lab Services.

- Disconnect idle virtual machines.
- Shut down virtual machines when students disconnect from the virtual machine.
- Shut down virtual machines when students don't connect a recently started virtual machine.

For more information, see [Configure automatic shutdown of VMs for a lab plan](how-to-configure-auto-shutdown-lab-plans.md).

## User profiles

Azure Lab Services was designed with three major personas in mind: administrators, educators, and students.  You'll see these three roles mentioned throughout Azure Lab Services documentation.  This section describes each persona and the tasks they're typically responsible for.

### Administrator

An IT administrator for organization is typically the lab plan owner.  The lab plan owner is often the one owns the Azure subscription and does the following tasks:

- Creates and organizes resource groups to contain lab plans and labs.
- Creates lab plans for your organization.
- Manages and configures policies across all labs.
- Gives permissions to educators in the organization to create a lab using the lab plan.

### Educator

Educators, often a teacher or an online trainer, creates labs using a pre-created lab plan. An educator does the following tasks:

- Creates a lab.
- Installs the appropriate software on virtual machines template.
- Publishes the lab to create VMs for the students.
- Specifies which students can access the lab.
- Sends registration link to the lab to students, if necessary.
- Use the lab to teach their course.

Some organizations may opt to have their administrators complete the previous tasks to create and manage labs on behalf of the educators.

### Student

A student does the following tasks:

- Registers for the lab, if needed.
- Connects to a VM in the lab and uses it for completing assigned work.

## Next steps

The first action to take to use Azure Lab Services is to create a lab plan.  Labs can be created only after a lab plan is created.

- [As an admin, create a lab plan](tutorial-setup-lab-plan.md)
- [As an educator, create a lab](tutorial-setup-lab.md)
