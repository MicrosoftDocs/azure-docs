---
title: "Chamber: Azure Modeling and Simulation Workbench"
description: Overview of Azure Modeling and Simulation Workbench chamber component.
author: becha8
ms.author: becha
ms.reviewer: becha
ms.service: azure-modeling-simulation-workbench
ms.topic: conceptual
ms.date: 01/01/2023
# Customer intent: As a Modeling and Simulation Workbench user, I want to understand the chamber component.
---
# Chambers in the Azure Modeling and Simulation Workbench

In the Azure Modeling and Simulation Workbench, chambers are a security boundary for a group virtual machines (VM) (nodes) and share common users. A chamber provides a full-featured and secure environment for users to run engineering applications and workloads together in isolation. Chamber VMs are all on the same subnet and have no internet access.

## Key features

* Chambers offer optimized infrastructure, allowing users to choose from varied VM sizes, storage options, and compute resources to constitute workloads.
* Chambers enable a preconfigured, isolated environment for license server access and full-featured workload tools.
* Chambers are encapsulated in the [Workbench](./concept-workbench.md) resource.

## Chamber environment

Chambers create a secure and isolated environment by adding private IP access and removing internet access. Public domain access is restricted to authorized networks over encrypted sessions enabled by the connector component. A [connector](./concept-connector.md)  exists per chamber that supports the protocols established through VPN, Azure Express Route, or allowlisted Public IP addresses.

Only provisioned users can access the chamber environment. User provisioning is done at the chamber level using Azure's [Identity Access Management](/azure/role-based-access-control/role-assignments-portal). This enables cross-team and/or cross-organization collaboration on the same projects through chambers. Multifactor authentication (MFA) enabled through Microsoft Entra ID is recommended to enhance your organization's security.

## Chamber storage

Users can resize and tailor the chambers to support storage requirement needs throughout the design process. Chamber users can also allocate chamber VMs on demand, select the right-sized VM/CPU for the task/job at hand, and decommission the workload when the job is done to save costs.

### Cost optimization

Administrators can optimize their resource consumption without necessarily destroying resources or moving data by:

* [Managing](./how-to-guide-chamber-vm.md) the size and number of virtual machines.
* [Idling](./how-to-guide-chamber-idle.md) unused chambers to reduce cost without deleting VMs or storage.
* [Managing](./how-to-guide-manage-chamber-storage.md) the size and performance tier of chamber storages.

Learn more about reducing service costs using [Azure Advisor](/azure/advisor/advisor-cost-recommendations#optimize-spend-for-mariadb-mysql-and-postgresql-servers-by-right-sizing) and [right-size VMs best practices](/azure/cloud-adoption-framework/migrate/azure-best-practices/migrate-best-practices-costs#best-practice-right-size-vms).

## Next steps

> [!div class="nextstepaction"]
> [Create a chamber VM](./how-to-guide-chamber.md)
