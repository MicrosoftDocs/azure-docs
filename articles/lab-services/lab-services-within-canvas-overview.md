---
title: Azure Lab Services within Canvas
description: Learn about the benefits of using Azure Lab Services in Canvas.
services: lab-services
ms.service: lab-services
ms.author: nicktrog
author: ntrogh
ms.topic: how-to
ms.date: 06/02/2023
---

# Use Azure Lab Services within Canvas

Azure Lab Services provides an integrated experience for using labs with Canvas. [Canvas LMS](https://www.instructure.com/canvas) is a cloud-based learning management system that provides one place for course content, quizzes, and grades for both educators and students. Educators can create labs from within Canvas and students will see their lab virtual machines alongside their other material for a course.

This article outlines the benefits of using Azure Lab Services within Canvas and provides links to other articles for instructions on how to create and manage labs within Canvas.

## Benefits

Azure Lab Services integration with Canvas provides the following benefits for setting up a virtual lab environment:

- Educators can create and manage labs directly inside a course in Canvas.
- Educators don't need to maintain lab participants in two different systems. The list of lab users is autopopulated based on the Canvas course roster. Azure Lab Services automatically performs a synchronization every 24 hours.
- After the initial publish of the template virtual machine, the lab capacity (the number of virtual machines in the lab) is automatically adjusted based on the addition/deletion of students from the Canvas course roster.
- Students access their labs directly inside a course in Canvas.

## Next steps

- [Configure Canvas to access lab plans](./how-to-configure-canvas-for-lab-plans.md)
- [Create and manage labs within Canvas](./how-to-manage-labs-within-canvas.md)
- [Access a lab virtual machine within Canvas](how-to-access-vm-for-students-within-canvas.md)
