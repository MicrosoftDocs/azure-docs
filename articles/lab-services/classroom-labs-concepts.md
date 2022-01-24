---
title: Labs concepts - Azure Lab Services | Microsoft Docs
description: Learn the basic concepts of Lab Services, and how it can make it easy to create and manage labs. 
ms.topic: how-to
ms.date: 01/21/2022
---

# Labs concepts

This article describes key Azure Lab Services concepts and definitions.

## Schedules

Schedules are the time slots that an educator creates so the student lab VMs are available for class time.  Schedules can be one-time or recurring.  Any scheduled time doesn't count against extra time students may be given to complete homework.  For more information about providing time for students to do their homework, see [Quota](#quota). A lab can use quota time, scheduled time, or a combination of both.

Scheduled time is commonly used when students are following the professor's directions during class hours. For instructions to add scheduled time to a lab, see [Create and manage schedules for labs in Azure Lab Services](how-to-create-schedules.md). All the student VMs are started with schedules.  VMs are started even if a student doesn't log in to a VM.  See [Configure automatic shutdown of VMs for a lab](how-to-enable-shutdown-disconnect.md) to help reduce likelihood of accruing costs when a VM isn't being used. Unclaimed VMs aren't started when schedules run.

There are two types of schedules: Standard and Stop only.

- **Standard**.  This schedule will start all student VMs at the specified start time and shut down all student VMs at the specified stop time.
- **Stop only**.  This schedule will stop all student VMs at the specified time, even if the VM was manually started by an instructor or student.
 
## Quota

Quota is the limited of time (in hours) an educator can allow a student to use their VM outside of scheduled time.  For example, quota can be used to allow students time to complete homework using a lab VM.  If the quota is set to 0, a student can only use the virtual machine when a schedule is running or when an educator manually turns on the virtual machine for the student.  

Quota hours are counted when the student starts the lab VM themselves.  If an educator manually starts the lab VM for a student, quota hours aren't used for that student.

A lab can use either quota time, scheduled time, or a combination of both.

### Automatic shut-down

Anytime a machine is **Running**, costs are being incurred, even if no one is connected to the VM.  You can enable several auto-shutdown cost control features to avoid extra costs when the VMs aren't being used.  The are three auto-shutdown policies available in Azure Lab Services.

- Disconnect idle virtual machines.
- Shutdown virtual machines when students disconnect from the virtual machine.
- Shutdown virtual machines when students don't connect a recently started virtual machine.

For more information, see [Configure automatic shutdown of VMs for a lab plan](how-to-configure-auto-shutdown-lab-plans.md).

## Template virtual machine

A template VM in a lab is a base image from which all users’ VMs are created. Instructors can configure the template VM with the software that they want to provide to lab users. When you publish a template VM, Azure Lab Services creates or updates lab VMs based on the template VM.

With the [January 2022 Update (preview)](lab-services-whats-new.md), labs can now be created from a pre-defined virtual machine image without the need for a template machine.  

## User profiles

This section describes different user profiles in Azure Lab Services.

### Lab plan owner

The lab plan owner is typically an IT administrator of organization's cloud resources.  The lab plan owner is the one who owns the Azure subscription and does the following tasks:

- Creates and organizes resource groups to contain lab plans and labs.
- Creates lab plan(s) for your organization.
- Manages and configures policies across all labs.
- Gives permissions to people in the organization to create a lab under the lab plan.

### Educator

Typically, a teacher or an online trainer, create labs using a pre-created lab plan. An educator does the following tasks:

- Creates a lab.
- Creates virtual machines in the lab.
- Installs the appropriate software on virtual machines.
- Specifies who can access the lab.
- Provides registration link to the lab to students, if necessary.

### Student

A student does the following tasks:

- Uses the registration link that the lab user receives from a lab creator to register with the lab.
- Connects to a virtual machine in the lab and uses it for doing class work, assignments, and projects.

## Next steps

First action to take to use Azure Lab Services is to create one or more lab plan(s).  Labs can be created only after a lab plan is created.

- [Set up a lab plan](tutorial-setup-lab-plan.md)
