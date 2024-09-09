---
title: "Deployment step 1: Basic infrastructure - Resource group component"
description: Learn about the configuration of resource groups during migration deployment step one.
author: tomvcassidy
ms.author: tomcassidy
ms.date: 08/30/2024
ms.topic: how-to
ms.service: 
services: 
---

# Deployment step 1: Basic infrastructure - Resource group component

Resource groups in Azure serve as containers that hold related resources for an Azure solution. In an HPC environment, organizing resources into appropriate resource groups is essential for effective management, access control, and cost tracking.

## Define Resource Group needs

1. **Project-Based Grouping:**
   - Organize resources by project or workload to simplify management and cost tracking.

2. **Environment-Based Grouping:**
   - Separate resources into different groups based on environments (for example, development, testing, production) to apply different policies and controls.

### This component should

- **Organize Resources:**
  - Group related HPC resources (for example, VMs, storage accounts, and network components) into resource groups based on project, department, or environment (for example, development, testing, production).

- **Simplify Management:**
  - Use resource groups to apply access controls, manage resource lifecycles, and monitor costs efficiently.

### Best Practices for Resource Groups in HPC Lift and Shift Architecture

1. **Consistency in Naming Conventions:**
   - Establish and follow consistent naming conventions for resource groups to facilitate easy identification and management.

2. **Resource Group Policies:**
   - Apply Azure Policy to resource groups to enforce organizational standards and compliance requirements.

### Example Steps for Resource Group Setup

1. **Create a Resource Group:**

   - Navigate to the Azure portal.
   - Select "Resource groups" and select "Create."
   - Provide a name for the resource group and select a subscription and region.
   - Select "Review + create" and then "Create."

2. **Add Resources to the Resource Group:**

   - When creating resources (for example, VMs, storage accounts), assign them to the appropriate resource group.
   - Use tags to further organize resources within the group for better cost management and reporting.

### Resources

- Resource Groups Documentation: [product website](/azure/azure-resource-manager/management/manage-resource-groups-portal)
- Azure Policy Documentation: [product website](/azure/governance/policy/overview)
- Azure Tags Documentation: [product website](/azure/azure-resource-manager/management/tag-resources)