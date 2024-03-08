---
title: "User personas: Azure Modeling and Simulation Workbench"
description: Overview of Azure Modeling and Simulation Workbench user personas.
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: conceptual
ms.date: 01/01/2023
# Customer intent: As a Modeling and Simulation Workbench user, I want to understand the user personas.
---

# User personas: Azure Modeling and Simulation Workbench

There are three user personas within Azure Modeling and Simulation Workbench:  IT Admin, Project Manager, and Design Engineer. This article explains the user personas, and the activities and responsibilities associated with each one."

## IT Admin (Workbench Owner)

The IT Admin is responsible for infrastructure deployment and user provisioning, referenced as the *Workbench Owner*. The Workbench Owner initializes the service in the customer tenant and has full administrative rights to manage chambers and users in the environment. They have Azure 'Owner' role assignment, or 'Contributor' and 'User Access Administrator' role assignments.

A Workbench Owner can create and delete chambers, and invite, remove, or change user roles. They can also define the connectivity methods that their users employ to connect into the workload. The Workbench Owner is also responsible for approving all data export requests and costs accrued by resource consumption during workbench usage.

## Project Manager (Chamber Admin)

The Project Manager, also known as the *Chamber Admin*, is responsible for installing and managing applications and licenses. They also own the installation and configuration of tools related to compute, network, and storage within the chamber. Chamber Admins set up and manage the chamber and have a higher elevated access within the workloads and the environment. They're responsible for procuring the licenses from the software vendors to enable design teams to run simulations on the deployed workloads.

## Design Engineer (Chamber User)

The Design Engineer is responsible for execution of the workflows and simulations leading up to the final design approval. This role is referred to as the *Chamber User*. Chamber Users have a lower level of access to the environment, but can deploy workloads, execute scripts and schedulers based on their access permissions to chamber storages. They can also use the [data pipeline](./concept-data-pipeline.md), to bring data into the chamber and request data to be exported from chamber.

## Next steps

- [Chamber](./concept-chamber.md)
