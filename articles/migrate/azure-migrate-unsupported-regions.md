---
title: Use Azure Migrate in unsupported regions
description: Describes and lists the regions that Azure Migrate doesn't support
author: habibaum
ms.author: v-uhabiba
ms.manager: ankitsurkar
ms.service: azure-migrate
ms.topic: troubleshooting
ms.date: 05/08/2025
ms.custom: reference_regions

# Customer intent: "As a cloud architect, I want to understand how to use Azure Migrate in unsupported regions, so that I can successfully plan and execute migrations from on-premises environments to new Azure regions that are not yet equipped with the necessary migration services."
---

# Use Azure Migrate in unsupported regions

Azure Migrate is a geo-level service that is deployed in at least one region of each geography. The service depends on other Azure services that need to be available before it can be deployed in a new region. As a result, it may not be available immediately when a region is launched. However, customers can still migrate their workloads to the new regions using the Azure Migrate service from a nearby region within the same geography.  

## Migrate to a new Azure region

To support migration to a newly launched Azure region where Azure Migrate services aren't yet available, customers can create an Azure Migrate project in a nearby accessible region. For instance, customers planning to migrate to New Zealand North can establish their Azure Migrate project in Australia East. Starting the project in a different region captures and includes only the inventory data in the new project. The actual Virtual Machine disk data is transferred directly from the customer’s on-premises source to the intended target region during migration.

Azure provides multiple methods to facilitate seamless migration to a new region:

### Agentless migration for VMware (recommended)

- VMware Virtual Machines without using an agent by utilizing the Migration and Modernization tool. See, [Azure Migrate documentation](tutorial-migrate-vmware.md).
- When using Azure Migrate’s replication wizard for the first time, specify the *new region* as the target region for migration.
- Create the storage account used for replication in the new region.
- For private endpoint configurations, manually create and configure the storage account in the new region with a Private Endpoint and associate it with the migration project.

### Agent-based migration

- **VMware**: Migrate VMware vSphere Virtual Machines using the agent-based Migration and Modernization tool. See, [Azure Migrate documentation](tutorial-migrate-vmware-agent.md).
- **Hyper-V**: Migrate Hyper-V Virtual Machines to Azure using the Migration and Modernization tool. See, [Azure Migrate documentation](tutorial-migrate-hyper-v.md).
- **Physical machines**: Migrate physical servers to Azure using the Migration and Modernization tool. See, [Azure Migrate documentation](tutorial-migrate-physical-virtual-machines.md).

## Known issues

This section outlines known issues related to migrating virtual machines to a new region using Azure’s agentless and agent-based migration methods. The information is provided to assist users in troubleshooting errors that may occur during these processes.

**Agentless Migration**

Enabling replication encounters the following failure initially but succeeds upon retrying:

The provided location `<new region>` - isn't available for resource type.
`Microsoft.Resources/deploymentScripts`

List of available regions for the resource type: 
- East Asia
- South East Asia 
- Australia East
- Australia South East
- Brazil South
- Canada Central
- Canada East
- Switzerland North
- Germany West Central
- East US2, East US, Central US, North Central US 
- France Central
- UK south, UK west
- Central India, South India, Jio India West
- Italy North
- Japan East, Japan West
- Korea Central, Korea South
- Mexico Central 
- North Europe
- Norway East
- Poland Central
- Qatar Central
- Spain Central
- Sweden Central
- UAE North
- West Central US
- West Europe
- West US2, West US, South Central US, West US3, 
- South Africa North
- Central US euap, East US2 euap, 
- Taiwan North, Taiwan North West

This error happens because the deployment scripts functionality might not be available when the region launches. However, retrying the replication process after a short interval should fix the issue.

**SQL Virtual Machine registration error** 

When migrating a Virtual Machine with SQL Server, if you select the option to register with the SQL Virtual Machine resource provider, you encounter the following error:

The virtual machine couldn't be registered with the SQL Virtual Machine Resource Provider. Azure error message: No registered resource provider found for `<new region>` and API version '2017-03-01-preview' for type 'Locations/registerSqlVmCandidate`. 

The supported api-versions: 

- 2017-03-01-preview 
- 2021-11-01-preview 
- 2022-02-01-preview 
- 2022-02-01
- 2022-07-01-preview 
- 2022-08-01-preview 
- 2023-01-01-preview
- 2023-10-01

The supported locations:

- Australia Central, Australia Central2, Australia East, Australia South East
- Brazil South
- Canada Central, Canada East, 
- Central India
- Central US
- East Asia
- East US, East US2
- France Central, France South
- Germany West Central
- Israel Central 
- Italy North
- Japan East, Japan West
- Jio India West
- Korea Central, Korea South
- Mexico Central
- North Central US
- North Europe
- Norway East 
- Poland Central 
- Qatar Central
- South Africa North
- South Central US 
- South India, 
- South East Asia
- Spain Central 
- Sweden Central 
- Switzerland North
- UAE Central, UAE North
- UK South, UK West
- West Central US
- West Europe
- West India
- West US, West US2, West US3

> [!NOTE]
> Despite this error, the Virtual Machine migration succeeds. However, users must know that the Virtual Machine won't be registered with the SQL Virtual Machine Resource Provider in the specified region.