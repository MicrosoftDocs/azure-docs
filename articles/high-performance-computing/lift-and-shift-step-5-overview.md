---
title: "Deployment step 5: End-user entry point - Overview"
description: Learn about production-level environment migration deployment step five.
author: tomvcassidy
ms.author: tomcassidy
ms.date: 08/30/2024
ms.topic: how-to
ms.service: 
services: 
---

# Deployment step 5: End-user entry point - Overview

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