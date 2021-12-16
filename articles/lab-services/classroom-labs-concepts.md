---
title: Labs concepts - Azure Lab Services | Microsoft Docs
description: Learn the basic concepts of Lab Services, and how it can make it easy to create and manage labs. 
ms.topic: how-to
ms.date: 11/19/2021
---

# Labs concepts

This article describes key Lab Services concepts and definitions.

## Quota

Quota is the time limit (in hours) that an educator can set for a student to use a lab VM. It can be set to 0, or a specific number of hours. If the quota is set to 0, a student can only use the virtual machine when a schedule is running or when an educator manually turns on the virtual machine for the student.  

Quota hours are counted when the student starts the lab VM themselves.  If an educator manually starts the lab VM for a student, quota hours aren't used for that student.

## Schedules

Schedules are the time slots that an educator can create for the class so the student VMs are available for class time.  Schedules can be one-time or recurring.  Quota hours aren't used when a schedule is running. A lab can use either quota time or scheduled time, or a combination of both.

Scheduled time is commonly used when all the students have their own VMs and are following the professor's directions at a set time during the day (like class hours). See [Create and manage schedules for labs in Azure Lab Services](how-to-create-schedules.md) for instructions to add scheduled time to a lab. The downside is that all the student VMs are started and are accruing costs, even if a student doesn't log in to a VM. See [Configure automatic shutdown of VMs for a lab](how-to-enable-shutdown-disconnect.md) to help reduce likelihood of accruing costs when a VM isn't being used.

There are three types of schedules: Standard, Start only and Stop only.

- **Standard**.  This schedule will start all student VMs at the specified start time and shutdown all student VMs at the specified stop time.
- **Start only**.   This schedule will start all student VMs at the specified  time.  Student VMs won't be stop until a student stops the their VM through the Azure Lab Services portal or a stop only schedule occurs.
- **Stop only**.  This schedule will stop all student VMs at the specified time.

## Template virtual machine

A template virtual machine in a lab is a base virtual machine image from which all users’ virtual machines are created. Trainers/lab creators set up the template virtual machine and configure it with the software that they want to provide to training attendees to do labs. When you publish a template VM, Azure Lab Services creates or updates lab VMs based on the template VM.

With the [January 2022 Update (preview)](lab-services-whats-new.md), labs can now be created from a pre-defined virtual machine image without the need for a template machine.  

## User profiles

This article describes different user profiles in Azure Lab Services.

### Lab plan owner

The lab plan owner, typically an IT administrator of organization's cloud resources, is the one who owns the Azure subscription and does the following tasks:

- Creates and organizes resource groups to contain lab plans and labs.
- Sets up a lab plan(s) for your organization.
- Manages and configures policies across all labs.
- Gives permissions to people in the organization to create a lab under the lab plan.

### Educator

Typically, users such as a teacher or an online trainer, create labs using a pre-created lab plan. An educator does the following tasks:

- Creates a classroom lab.
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
