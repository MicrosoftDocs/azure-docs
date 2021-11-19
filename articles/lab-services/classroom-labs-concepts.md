---
title: Labs concepts - Azure Lab Services | Microsoft Docs
description: Learn the basic concepts of Lab Services, and how it can make it easy to create and manage labs. 
ms.topic: how-to
ms.date: 11/19/2021
---

# Labs concepts

This article describes key Lab Services concepts and definitions.

>[!NOTE]
> For the latest experience in Azure Lab Services, see [What's New in the November 2021 Update](lab-services-whats-new.md). The new experience is in preview.

## Quota

Quota is the time limit (in hours) that an educator can set for a student to use a lab VM. It can be set to 0, or a specific number of hours. If the quota is set to 0, a student can only use the virtual machine when a schedule is running or when an educator manually turns on the virtual machine for the student.  

Quota hours are counted when the student starts the lab VM themselves.  If an educator manually starts the lab VM for a student, quota hours aren't used for that student.

## Schedules

Schedules are the time slots that an educator can create for the class so the student VMs are available for class time.  Schedules can be one-time or recurring.  Quota hours aren't used when a schedule is running.

Scheduled time is commonly used when all the students have their own VMs and are following the professor's directions at a set time during the day (like class hours). The downside is that all the student VMs are started and are accruing costs, even if a student doesn't log in to a VM.

A lab can use either quota time or scheduled time, or a combination of both. If a class doesn't need scheduled time, then use only quota time for the most effective use of the VMs. 

There are three types of schedules: Standard, Start only and Stop only.

- **Standard**.  This schedule will start all student VMs at the specified start time and shutdown all student VMs at the specified stop time.
- **Start only**.   This schedule will start all student VMs at the specified  time.  Student VMs won't be stop until a student stops the their VM through the Azure Lab Services portal or a stop only schedule occurs.
- **Stop only**.  This schedule will stop all student VMs at the specified time. 

## Template virtual machine

A template virtual machine in a lab is a base virtual machine image from which all users’ virtual machines are created. Trainers/lab creators set up the template virtual machine and configure it with the software that they want to provide to training attendees to do labs. When you publish a template VM, Azure Lab Services creates or updates lab VMs based on the template VM.

## User profiles

This article describes different user profiles in Azure Lab Services.

### Lab plan owner

Typically, an IT administrator of organization's cloud resources, who owns the Azure subscription acts as a lab plan owner and does the following tasks:

- Sets up a lab plan for your organization.
- Manages and configures policies across all labs.
- Gives permissions to people in the organization to create a lab under the lab plan.

### Educator

Typically, users such as a teacher or an online trainer creates labs under a lab plan. An educator does the following tasks:

- Creates a classroom lab.
- Creates virtual machines in the lab.
- Installs the appropriate software on virtual machines.
- Specifies who can access the lab.
- Provides registration link to the lab to students.

### Student

A student does the following tasks:

- Uses the registration link that the lab user receives from a lab creator to register with the lab.
- Connects to a virtual machine in the lab and use it for doing class work, assignments, and projects.

## Next steps

Get started with setting up a lab plan that's required to create a classroom lab using Azure Lab Services:

- [Set up a lab plan](tutorial-setup-lab-plan.md)
