---
title: "Resource group configuration during a high performance computing (HPC) architecture migration"
description: Learn how to configure resource groups during a migration of high performance computing architecture.
author: tomvcassidy
ms.author: tomcassidy
ms.date: 03/20/2025
ms.topic: how-to
ms.service: azure-virtual-machines
ms.subservice: hpc
---

# Resource group configuration during a high performance computing (HPC) architecture migration

Resource groups in Azure serve as containers that hold related resources for an Azure solution. In an HPC environment, organizing resources into appropriate resource groups is essential for effective management, access control, and cost tracking.

## Define resource group needs

* **Project-based grouping:**
   - Organize resources by project or workload to simplify management and cost tracking.

* **Environment-based grouping:**
   - Separate resources into different groups based on environments (for example, development, testing, production) to apply different policies and controls.

### This component should

* **Organize resources:**
  - Group related HPC resources (for example, VMs, storage accounts, and network components) into resource groups based on project, department, or environment (for example, development, testing, production).

* **Simplify management:**
  - Use resource groups to apply access controls, manage resource lifecycles, and monitor costs efficiently.

## Best practices for resource groups in HPC lift and shift architecture

* **Consistency in naming conventions:**
   - Establish and follow consistent naming conventions for resource groups to facilitate easy identification and management.

* **Resource group policies:**
   - Apply Azure Policy to resource groups to enforce organizational standards and compliance requirements.

## Example steps for resource group setup

1. **Create a resource group:**

   - Navigate to the Azure portal.
   - Select "Resource groups" and select "Create."
   - Provide a name for the resource group and select a subscription and region.
   - Select "Review + create" and then "Create."

2. **Add resources to the resource group:**

   - When creating resources (for example, VMs, storage accounts), assign them to the appropriate resource group.
   - Use tags to further organize resources within the group for better cost management and reporting.

## Resources

- Resource Groups Documentation: [product website](/azure/azure-resource-manager/management/manage-resource-groups-portal)
- Azure Policy Documentation: [product website](/azure/governance/policy/overview)
- Azure Tags Documentation: [product website](/azure/azure-resource-manager/management/tag-resources)
