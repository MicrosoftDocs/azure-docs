---
title: Migrating from physical labs to the cloud
titleSuffix: Azure Lab Services
description: Learn about the benefits and considerations for migrating from physical labs to Azure Lab Services. Understand how to configure your labs to optimize costs.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: conceptual
ms.date: 01/31/2023
---

# Considerations for migrating from physical labs to Azure Lab Services

Azure Lab Services enables you to provide lab environments that users can access from anywhere, any time of the day. When you migrate from physical labs to Azure Lab Services, you might reassess your lab structure to minimize costs and optimize the experience for lab creators and users. In this article, you learn about the considerations and benefits of migrating from physical labs to Azure Lab Services.

## Lab structure

Usually a physical lab is shared by students from multiple classes. As a result, all of the classes’ software applications are installed together at once on each lab computer. When a class uses the lab, students only run a subset of the applications that are relevant to their class.

This type of physical computer lab often leads to increased hardware requirements:

- A large disk size may be required to install the combined set of applications that are needed by the classes that are sharing the lab.
- Some applications require more processing power compared to others, or require specialized processors, such as a GPU. By installing multiple applications on the same lab computer, each computer must have sufficient hardware to run the most compute-intensive applications.

This level of hardware is essentially wasted for classes that only use the lab to run applications that require less memory, compute power, or disk space.

Azure Lab Services is designed to use hardware more efficiently, so that you only pay for what your users actually need and use. With Azure Lab Services, labs are structured to be more granular:

- One lab is created for each class (or session of a class).
- On the lab’s image, only the software applications that are needed by that specific class are installed.

This structure helps to identify the optimal VM size for each class based on the specific workload, and helps to reduce the disk size requirements (Azure Lab Services’ currently supports a disk size of 127 GB).

## Considerations for moving to Azure Lab Services

- Software requirements for each class
- Number and structure of your labs - multiple classes per lab vs one class per lab
- VM types and sizes
- Disk space requirements
- Look for opportunities to share images in Azure Compute Gallery

## Plan for moving to Azure Lab Services

- Identify software applications for each class
- Understand workloads that students perform using the lab
- Oppties for shared images

## Benefits

- Optimize cost by selecting the right VM type for a class
- Single-purpose labs provide clarity for students, easier setup and maintenance
- Access control allows providing only access to software student needs
- 

(fine-grained)

## Advanced features

- Quotas
- Schedules
- Access control
- Connect to on-premise resources

## Conclusion

## Next steps

- Get started by [creating a lab plan](./quick-create-lab-plan-portal.md).
- Understand [cost estimation and analysis](./cost-management-guide.md).
