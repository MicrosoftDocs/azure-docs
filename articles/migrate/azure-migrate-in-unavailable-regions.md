---
title: Azure Migrate in regions where it isn't available yet
description: Describes the regions that Azure Migrate doesn't support
author: habiba
ms.author: v-uhabiba
ms.manager: ankitsurkar
ms.service: azure-migrate
ms.topic: troubleshooting
ms.date: 04/24/2025
ms.custom: engagement-fy23

---

# Use Azure Migrate in unavailable regions

Azure Migrate is a geo-level service that is deployed in at least one region of each geography. The service depends on other Azure services that need to be available before it can be deployed in a new region. As a result, it may not be available immediately when a region is launched. However, customers can still migrate their workloads to the new regions using the Azure Migrate service from a nearby region within the same geography.  

## Migrate to a new Azure region

To support migration to a newly launched Azure region where Azure Migrate services aren't yet available, customers can create an Azure Migrate project in a nearby accessible region. For instance, customers planning to migrate to New Zealand North can establish their Azure Migrate project in Australia East. By initiating the project in a different region, only the inventory data is captured and included in the new project. The actual VM disk data is transferred directly from the customer’s on-premises source to the intended target region during migration.

Azure provides multiple methods to facilitate seamless migration to a new region:

### Agentless Migration for VMware (recommended)

- Migrate VMware VMs without using an agent by utilizing the Migration and Modernization tool. See, [Azure Migrate documentation](vmware/tutorial-migrate-vmware.md).
- When using Azure Migrate’s replication wizard for the first time, specify the *new region* as the target region for migration.
- Create the storage account used for replication in the new region.
- For private endpoint configurations, manually create and configure the storage account in the new region with a Private Endpoint and associate it with the migration project.

### Agent-based Migration

- **VMware**: Migrate VMware vSphere VMs using the agent-based Migration and Modernization tool. See, [Azure Migrate documentation](vmware/tutorial-migrate-vmware-agent.md).
- **Hyper-V**: Migrate Hyper-V VMs to Azure using the Migration and Modernization tool. See, [Azure Migrate documentation](tutorial-migrate-hyper-v.md).
- **Physical machines**: Migrate physical servers to Azure using the Migration and Modernization tool. See, [Azure Migrate documentation](tutorial-migrate-physical-virtual-machines.md).

## Known issues

This section outlines known issues related to migrating virtual machines (VMs) to a new region using Azure’s agentless and agent-based migration methods. The information is provided to assist users in troubleshooting errors that may occur during these processes.

**Agentless Migration**

Enabling replication encounters the following failure initially but succeeds upon retrying:

Provided location: `is not available for resource type 'Microsoft.Resources/deploymentScripts'. List of available regions for the resource type is 'eastasia,southeastasia,australiaeast,australiasoutheast,brazilsouth,canadacentral,canadaeast,switzerlandnorth,germanywestcentral,eastus2,eastus,centralus,northcentralus,francecentral,uksouth,ukwest,centralindia,southindia,jioindiawest,italynorth,japaneast,japanwest,koreacentral,koreasouth,mexicocentral,northeurope,norwayeast,polandcentral,qatarcentral,spaincentral,swedencentral,uaenorth,westcentralus,westeurope,westus2,westus,southcentralus,westus3,southafricanorth,centraluseuap,eastus2euap,taiwannorth,taiwannorthwest'.`

This error happens because the deployment scripts functionality might not be available when the region launches. However, retrying the replication process after a short interval should fix the issue.

**SQL VM registration error** 

When migrating a VM with SQL Server, if you select the option to register with the SQL VM resource provider, you encounter the following error:

`The virtual machine could not be registered with the SQL VM Resource Provider. Azure error message: 'No registered resource provider found for location '' and API version '2017-03-01-preview' for type 'Locations/registerSqlVmCandidate'. The supported api-versions are '2017-03-01-preview, 2021-11-01-preview, 2022-02-01-preview, 2022-02-01, 2022-07-01-preview, 2022-08-01-preview, 2023-01-01-preview, 2023-10-01'. The supported locations are 'australiacentral, australiacentral2, australiaeast, australiasoutheast, brazilsouth, canadacentral, canadaeast, centralindia, centralus, eastasia, eastus, eastus2, francecentral, francesouth, germanywestcentral, israelcentral, italynorth, japaneast, japanwest, jioindiawest, koreacentral, koreasouth, mexicocentral, northcentralus, northeurope, norwayeast, polandcentral, qatarcentral, southafricanorth, southcentralus, southindia, southeastasia, spaincentral, swedencentral, switzerlandnorth, uaecentral, uaenorth, uksouth, ukwest, westcentralus, westeurope, westindia, westus, westus2, westus3'.`

> [!NOTE]
> Despite this error, the VM migration succeeds. However, users must know that the VM won't be registered with the SQL VM Resource Provider in the specified region.