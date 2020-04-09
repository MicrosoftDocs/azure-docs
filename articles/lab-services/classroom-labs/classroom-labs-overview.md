---
title: About classroom labs in Azure Lab Services | Microsoft Docs
description: Learn how to quickly set up a classroom lab environment in the cloud - configure a lab with a template VM with the software required for the class and make a copy of the VM available to each student in the class. 
services: lab-services
documentationcenter: na
author: spelluru
manager: 
editor: ''

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: overview
ms.date: 11/26/2019
ms.author: spelluru

---
# Introduction to classroom labs
Azure Lab Services enables you to quickly set up a classroom lab environment in the cloud. An educator creates a classroom lab, provisions Windows, or Linux virtual machines, installs the necessary software and tools labs in the class, and makes them available to students. The students in the class connect to virtual machines (VMs) in the lab, and use them for their projects, assignments, classroom exercises. 

The classroom labs are managed lab types that are managed by Azure. The service itself handles all the infrastructure management for a managed lab type, from spinning up virtual machines (VMs) to handling errors, and scaling the infrastructure. You specify what kind of infrastructure you need and install any tools or software that's required for the class. 

## Automatic management of Azure infrastructure and scale 
Azure Lab Services is a managed service, which means that provisioning and management of a lab’s underlying infrastructure is handled automatically by the service. You can just focus on preparing the right lab experience for your users. Let the service handle the rest and roll out your lab’s virtual machines to your audience. Scale your lab to hundreds of virtual machines with a single click.

## Simple experience for your lab users 
Users who are invited to your lab get immediate access to the resources you give them inside your labs. They just need to sign in to see the full list of virtual machines they have access to across multiple labs. They can click on a single button to connect to the virtual machines and start working. Users don’t need Azure subscriptions to use the service. 

## Cost optimization and tracking  
Keep your budget in check by controlling exactly how many hours your lab users can use the virtual machines. Set up schedules in the lab to allow users to use the virtual machines only during designated time slots or set up reoccurring auto-shutdown and start times. Keep track of individual users’ usage and set limits.

## Example class types
You can set up labs for several types of classes with Azure Lab Services. See the [Example class types on Azure Lab Services](class-types.md) article for a few example types of classes for which you can set up labs with Azure Lab Services. 

## Next steps
Get started with setting up a lab account that's required to create a classroom lab using Azure Lab Services:

- [Set up a lab account](tutorial-setup-lab-account.md)
