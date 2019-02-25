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
ms.date: 02/22/2019
ms.author: spelluru

---
# Classroom Labs concepts
The following list contains key Lab Services concepts and definitions:

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
