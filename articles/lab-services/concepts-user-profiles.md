---
title: User profiles in Azure Lab Services | Microsoft Docs
description: Learn about different user profiles in Azure Lab Services
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
ms.date: 04/12/2018
ms.author: spelluru

---
# User profiles in Azure Lab Services
This article describes different user profiles in Azure Lab Services. 

## Lab account owner
Typically, and IT administrator of organization's cloud resources, who owns the Azure subscription acts as a lab account owner and does the following tasks:   

- Sets up a lab account for your organization.
- Manages and configures policies across all labs.
- Gives permissions to people in the organization to create a lab under the lab account.

## Lab creator 
Typically, users such as a development lead/manager, a teacher, a hackathon host, an online trainer creates labs under a lab account. A lab creator does the following tasks: 

- Creates a lab.
- Creates virtual machines in the lab. 
- Installs the appropriate software on virtual machines.
- Specifies who can access the lab.
- Provides link to the lab to lab users.

## Lab user
A lab user does the following tasks:

- Uses the registration link that the lab user receives from a lab creator to register with the lab. 
- Connects to a virtual machine in the lab and use it for development, testing, or doing the classroom labs. 

## Next steps
Get started with setting up a lab using Azure Lab Services:

- [Set up a classroom lab](tutorial-setup-classroom-lab.md)
- [Set up a custom lab](tutorial-create-custom-lab.md)
