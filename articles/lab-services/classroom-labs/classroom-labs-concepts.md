---
title: Classroom Labs concepts - Azure Lab Services | Microsoft Docs
description: Learn the basic concepts of Lab Services, and how it can make it easy to create and manage labs. 
services: lab-services
documentationcenter: na
author: spelluru
manager: 
editor: ''

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/26/2019
ms.author: spelluru

---

# Classroom Labs concepts
The following list contains key Lab Services concepts and definitions:

## Quota
Quota is the time limit (in hours) that a teacher can set for a student to use a lab VM. It can be set to 0, or a specific number of hours. If the quota is set to 0, a student can only use the virtual machine when a schedule is running or when a teacher manually turns on the virtual machine for the student.
 
## Schedules
Schedules are the time slots(one time or recurring) that a teacher can create for the class. All virtual machines in the lab are automatically started at the beginning to the schedule and they are stopped at the end of the schedule. Quota hours are not used when a schedule is running.

## Template virtual machine
A template virtual machine in a lab is a base virtual machine image from which all users’ virtual machines are created. Trainers/lab creators set up the template virtual machine and configure it with the software that they want to provide to training attendees to do labs. When you publish a template VM, Azure Lab Services creates or updates lab VMs based on the template VM. 


## User profiles
This article describes different user profiles in Azure Lab Services. 

### Lab account owner
Typically, and IT administrator of organization's cloud resources, who owns the Azure subscription acts as a lab account owner and does the following tasks:   

- Sets up a lab account for your organization.
- Manages and configures policies across all labs.
- Gives permissions to people in the organization to create a lab under the lab account.

### Professor
Typically, users such as a teacher or an online trainer creates classroom labs under a lab account. An educator does the following tasks: 

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
Get started with setting up a lab account that's required to create a classroom lab using Azure Lab Services:

- [Set up a lab account](tutorial-setup-lab-account.md)
