---
title: "Chamber: Azure Modeling and Simulation Workbench"
description: Overview of Azure Modeling and Simulation Workbench chamber component.
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: conceptual
ms.date: 01/01/2023
# Customer intent: As a Modeling and Simulation Workbench user, I want to understand the chamber component.
---

# Chamber: Azure Modeling and Simulation Workbench

In Azure Modeling and Simulation Workbench, a chamber is defined as a group of connected computers (nodes) that work together as a single system.  A chamber provides a full-featured and secure environment for users to run engineering applications and workloads together.

- Chambers offer optimized infrastructure, allowing users to choose from varied VM sizes, storage options, and compute resources to constitute workloads.
- Chambers enable a preconfig environment for license server access and full-featured workload tools.
- On-demand chambers are nested to Modeling and Simulation [Workbench](./concept-workbench.md) resource.

## Chamber environment

Chambers create a secure and isolated environment by adding private IP access and removing internet access. Public domain access is restricted to authorized networks over encrypted sessions enabled by the connector component. A [connector](./concept-connector.md)  exists per chamber that supports the protocols established through VPN, Azure Express Route, or allowlisted Public IP addresses.

Only provisioned users can access the chamber environment. User provisioning is done at the chamber component using IAM [(Access Control)](/azure/role-based-access-control/role-assignments-portal).  This enables Cross team and/or cross-organization individuals to collaborate on the same projects through the chambers. Multifactor authentication (MFA) enabled through Microsoft Entra ID is recommended to enhance your organization's security.

## Chamber storage

Users can resize and tailor the chambers to support storage requirement needs throughout the design process. Chamber users can also allocate Chamber VMs on demand, select the right-sized VM/CPU for the task/job at hand, and decommission the workload when the job is done to save costs.

### Right-sizing

The right-sizing feature reduces the Azure spend by identifying idle and underutilized resources. For example:

- By managing the size and number of virtual machines.
- By stopping unused workloads, connectors and chambers.
- By managing the size and performance tier of chamber storages.

Learn more about reducing service costs using [Azure Advisor](/azure/advisor/advisor-cost-recommendations#optimize-spend-for-mariadb-mysql-and-postgresql-servers-by-right-sizing) and [right-size VMs best practices](/azure/cloud-adoption-framework/migrate/azure-best-practices/migrate-best-practices-costs#best-practice-right-size-vms).

## Next steps

- [Connector](./concept-connector.md)
