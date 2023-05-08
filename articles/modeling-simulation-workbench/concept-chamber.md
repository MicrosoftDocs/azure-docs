---
title: Azure Modeling and Simulation Workbench chamber
description: Overview of Azure Modeling and Simulation Workbench chamber component.
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: conceptual
ms.date: 01/01/2023
# Customer intent: As a Modeling and Simulation Workbench user, I want to understand the chamber component.
---

# Azure Modeling and Simulation Workbench chamber

## Chamber - an introduction

For the Azure Modeling and Simulation Workbench user, the chamber component offers a full-featured, secure, isolated, and optimized environment for running engineering applications and workloads. The environment is secured and isolated by adding private IP access and removing internet access. Public domain access is restricted to authorized networks over encrypted sessions enabled by the connector component. A [connector](./concept-connector.md) exists per chamber, supporting protocols established through VPN, Azure Express Route, or allowlisted Public IP addresses.

In Azure Modeling and Simulation Workbench, the term chamber describes a group of connected computers (nodes) working together as a single system. Only provisioned users can access the chamber environment. User provisioning is done at the chamber component utilizing IAM [(Access Control)](/azure/role-based-access-control/role-assignments-portal) Cross-team and/or cross-organization individuals can collaborate on the same projects through the chambers. Multifactor (MFA) authentication enabled through Azure AD enhances your organizations security and is recommended.

- Chambers offer optimized infrastructure, allowing users to choose from varied VM sizes, storage options, and compute resources to constitute workloads.
- Chambers enable a pre-config environment for license server access and full-featured workload tools.
- On-demand chambers are nested to Modeling and Simulation [Workbench](./concept-workbench.md) resource.

## Chamber features

### Right-sizing

Chamber storage can be dynamically resized and tailored to support storage requirement needs throughout the design process. Chamber VMs can be allocated on demand; chamber users can select the right-sized VM/CPU for the task and job at hand, and decommission the workload when the job is done to save on costs.

Right-sizing can be done to reduce the Azure spend by identifying idle and underutilized resources through different ways as listed here:

1. By managing the size and number of virtual machines.

1. By stopping unused workloads and chambers.

1. By managing the size and performance tier of chamber storages.

Know more about reducing service costs using [Azure Advisor](/azure/advisor/advisor-cost-recommendations#optimize-spend-for-mariadb-mysql-and-postgresql-servers-by-right-sizing). You can also review best practices to [right-size VMs](/azure/cloud-adoption-framework/migrate/azure-best-practices/migrate-best-practices-costs#best-practice-right-size-vms) here.

## Next steps

- [What's next - Connector](./concept-connector.md)

Choose an article to know more:

- [Workbench](./concept-workbench.md)

- [User Personas](./concept-user-personas.md)
