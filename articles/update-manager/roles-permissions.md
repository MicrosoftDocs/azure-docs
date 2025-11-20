---
title: Roles and Permissions in Azure Update Manager
description: This article explains the roles and permission required to manage Azure VMs or Azure Arc-enabled servers in Azure Update Manager.
ms.service: azure-update-manager
author: habibaum
ms.author: v-uhabiba
ms.date: 08/21/2025
ms.topic: concept-article
# Customer intent: "As an IT administrator who manages Azure VMs or Azure Arc-enabled servers, I want to understand the required roles and permissions for Azure Update Manager so that I can effectively configure update operations and ensure compliance with organizational policies."
---
 
# Roles and permissions in Azure Update Manager

To manage an Azure virtual machine (VM) or an Azure Arc-enabled server by using Azure Update Manager, you must have the appropriate roles assigned. You can either use predefined roles or create custom roles with the specific permissions that you need.

## Roles

The built-in roles provide blanket permissions on a virtual machine, which include all Azure Update Manager permissions.

| Resource | Role |
|---|---|
| Azure VM | Azure Virtual Machine Contributor or [Azure Owner](../role-based-access-control/built-in-roles/general.md#azure-built-in-roles-for-general)|
| Azure Arc-enabled server | [Azure Connected Machine Resource Administrator](/azure/azure-arc/servers/security-overview)|

## Permissions

The following table shows the permissions that you need when you use Update Manager to manage update operations. You can create a custom role and assign only the desired permissions to that role for specific actions.

### Read permissions for Update Manager to view Update Manager data

| Action | Permission | Scope |
|---|---|---|
| Read Azure VM properties | Microsoft.Compute/virtualMachines/read | |
| Read assessment data for Azure VMs | Microsoft.Compute/virtualMachines/patchAssessmentResults/read<br>Microsoft.Compute/virtualMachines/patchAssessmentResults/softwarePatches/read | |
| Read patch installation data for Azure VMs | Microsoft.Compute/virtualMachines/patchInstallationResults/read<br>Microsoft.Compute/virtualMachines/patchInstallationResults/softwarePatches/read | |
| Read Azure Arc-enabled server properties | Microsoft.HybridCompute/machines/read | |
| Read assessment data for Azure Arc-enabled servers | Microsoft.HybridCompute/machines/patchAssessmentResults/read<br>Microsoft.HybridCompute/machines/patchAssessmentResults/softwarePatches/read | |
| Read patch installation data for Azure Arc-enabled servers | Microsoft.HybridCompute/machines/patchInstallationResults/read<br>Microsoft.HybridCompute/machines/patchInstallationResults/softwarePatches/read | |
| Get the status of an asynchronous operation for an Azure VM | Microsoft.Compute/locations/operations/read | Machine subscription |
| Read the status of an update center operation on Azure Arc-enabled machines | Microsoft.HybridCompute/locations/updateCenterOperationResults/read | Machine subscription |

### Permissions to perform on-demand actions in Update Manager

The following permissions are required in addition to the read permissions documented earlier on individual machines where you perform on-demand operations.

| Action | Permission | Scope |
|---|---|---|
| Trigger an assessment on Azure VMs | Microsoft.Compute/virtualMachines/assessPatches/action | |
| Install an update on Azure VMs | Microsoft.Compute/virtualMachines/installPatches/action | |
| Get the status of an asynchronous operation for an Azure VM | Microsoft.Compute/locations/operations/read | Machine subscription |
| Trigger an assessment on an Azure Arc-enabled server | Microsoft.HybridCompute/machines/assessPatches/action | |
| Install an update on an Azure Arc-enabled server | Microsoft.HybridCompute/machines/installPatches/action | |
| Read the status of an update center operation on Azure Arc-enabled machines | Microsoft.HybridCompute/locations/updateCenterOperationResults/read | Machine subscription |
| Update patch mode or assessment mode for Azure VMs | Microsoft.Compute/virtualMachines/write | Machine |
| Update assessment mode for Azure Arc-enabled machines | Microsoft.HybridCompute/machines/write | Machine |

## Permissions related to scheduled patching (maintenance configuration)

The following permissions are required in addition to permissions on individual machines, which are managed by the schedules.

| Action | Permission | Scope |
|---|---|---|
| Register the subscription for the Microsoft.Maintenance resource provider | Microsoft.Maintenance/register/action | Subscription |
| Create or modify a maintenance configuration | Microsoft.Maintenance/maintenanceConfigurations/write | Subscription/resource group |
| Read a maintenance configuration | Microsoft.Maintenance/maintenanceConfigurations/read | Subscription/resource group |
| Delete a maintenance configuration | Microsoft.Maintenance/maintenanceConfigurations/delete | Subscription/resource group |
| Create or modify configuration assignments | Microsoft.Maintenance/configurationAssignments/write | Subscription/resource group/machine |
| Read configuration assignments | Microsoft.Maintenance/configurationAssignments/read | Subscription/resource group/machine |
| Delete configuration assignments | Microsoft.Maintenance/configurationAssignments/delete | Subscription/resource group/machine |
| Read a maintenance update resource | Microsoft.Maintenance/updates/read | Machine |
| Read a resource for applying maintenance updates | Microsoft.Maintenance/applyUpdates/read | Machine |
| Get list of update deployments | Microsoft.Resources/deployments/read | Maintenance configuration and virtual machine subscription |
| Create or update an update deployment | Microsoft.Resources/deployments/write | Maintenance configuration and virtual machine subscription |
| Get a list of operation statuses for update deployments | Microsoft.Resources/deployments/operationstatuses | Maintenance configuration and virtual machine subscription |
| Read the maintenance configuration assignment for the InGuestPatch maintenance scope | Microsoft.Maintenance/configurationAssignments/maintenanceScope/InGuestPatch/read | Subscription/resource group/machine |
| Create or modify a maintenance configuration assignment for an InGuestPatch maintenance scope | Microsoft.Maintenance/configurationAssignments/maintenanceScope/InGuestPatch/write | Subscription/resource group/machine |
| Delete a maintenance configuration assignment for an InGuestPatch maintenance scope | Microsoft.Maintenance/configurationAssignments/maintenanceScope/InGuestPatch/delete | Subscription/resource group/machine |
| Read a maintenance configuration for an InGuestPatch maintenance scope | Microsoft.Maintenance/maintenanceConfigurations/maintenanceScope/InGuestPatch/read | Subscription/resource group |
| Create or modify a maintenance configuration for an InGuestPatch maintenance scope | Microsoft.Maintenance/maintenanceConfigurations/maintenanceScope/InGuestPatch/write | Subscription/resource group |
| Delete a maintenance configuration for an InGuestPatch maintenance scope | Microsoft.Maintenance/maintenanceConfigurations/maintenanceScope/InGuestPatch/delete | Subscription/resource group |

## Related content

- [Prerequisites for Azure Update Manager](prerequisites.md)
- [How Update Manager works](workflow-update-manager.md)
