---
title: "Deployment step 5: end-user entry point - overview"
description: Learn about production-level environment migration deployment step five.
author: tomvcassidy
ms.author: tomcassidy
ms.date: 08/30/2024
ms.topic: how-to
ms.service: azure-virtual-machines
ms.subservice: hpc
---

# Deployment step 5: end-user entry point - overview

Providing a consistent end-user entry point is crucial for ensuring a smooth transition from on-premises to the cloud in an HPC environment. Whether users access resources through an SSH sign-in node or a web portal, maintaining a familiar experience helps minimize disruptions.

This section explores the options for user interaction, emphasizing the importance of addressing potential latency issues that may arise when moving to the cloud. It also provides guidance on tools, services, and best practices to optimize the user entry point for HPC lift-and-shift deployments. A quick start setup is included to help establish this component efficiently, with the goal of automating it as the cloud infrastructure matures.

## Options for user interaction

End-users may benefit from having similar experience accessing resources on-premises and in the cloud. Whether users go to a sign-in node via ssh or a web portal to submit jobs, we recommend you keep the same user experience and access if there are any latency issues that users may face compared to on-premises environment.

For details, check the description of the following component:

- [End-user entry point](lift-and-shift-step-5-end-user-entry-point.md)

Here we describe each component. Each section includes:

- An overview description of what the component is
- What the requirements for the component are (that is, what do we need from the component)
- Tools and services available
- Best practices for the component in the context of HPC lift & shift
- An example of a quick start setup

The goal of the quick start is to have a sense on how to start using the component. As the HPC cloud deployment matures, one is expected to automate the usage of the component, by using, for instance, Infrastructure as Software tools such as Terraform or Bicep.
