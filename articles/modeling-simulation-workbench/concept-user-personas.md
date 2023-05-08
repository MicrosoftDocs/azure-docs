---
title: Azure Modeling and Simulation Workbench user personas
description: Overview of Azure Modeling and Simulation Workbench user personas.
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: conceptual
ms.date: 01/01/2023
# Customer intent: As a Modeling and Simulation Workbench user, I want to understand the user personas.
---

# Azure Modeling and Simulation Workbench chamber

## Workbench user personas - an introduction

The three key user personas for the Azure Modeling and Simulation Workbench are:

1. IT Admin (Workbench Owner) – The IT Admin is responsible for infrastructure deployment and user provisioning, referenced as the Workbench Owner. The Workbench Owner initializes the service in the customer tenant and has full administrative rights to manage chambers and users in the environment. The Workbench Owner can create and delete chambers; invite, remove, or change user roles and define the connectivity methods by which users connect into the workload. The Workbench Owner is also responsible for approving all data export requests and costs accrued by resource consumption during workbench usage. A Workbench Owner has 'Owner' role assignment, or 'Contributor' and 'User Access Administrator' role assignments.

1. Project Manager (Chamber Admin)– The Project Manager is responsible for installing and managing applications and licenses. They also own the installation and configuration of tools related to compute, network, and storage within the chamber and are referred to as the Chamber Admin. Chamber Admins set up and manage the chamber and enjoy a higher elevated access within the workloads and the environment. They're responsible for procuring the licenses from the software vendors to enable design teams to run simulations on the deployed workloads.

1. Design Engineer (Chamber User) – The Design Engineer is responsible for execution of the design flows and simulations leading up to final design sign-off, also known as the Chamber User. Chamber Users have a lower level of access to the environment, but can deploy workloads, execute scripts and schedulers based on their access permissions to chamber storages. They can also utilize the data pipeline, bringing data into the chamber and requesting data to be exported from chamber.

## Next steps

- [What's next - Chamber](./concept-chamber.md)

Choose an article to know more:

- [Workbench](./concept-workbench.md)
