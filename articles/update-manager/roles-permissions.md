---
title: Roles and permissions to manage Azure VM or Arc-enabled server in Azure Update Manager
description: This article explains th roles and permission required to manage Azure VM or Arc-enabled servers in Azure Update Manager.
ms.service: azure-update-manager
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 07/19/2024
ms.topic: overview
---
 
# Roles and permissions in Azure Update Manager

To manage an Azure VM or an Azure Arc-enabled server using Azure Update Manager, you must have the appropriate roles assigned. You can either use predefined roles or create custom roles with the specific permissions you need. For more information, see the [permissions](#permissions).

## Roles

The built-in roles provide blanket permissions on a virtual machine, which includes all Azure Update Manager permissions as well.

| **Resource** | **Role** |
|---|---|
| **Azure VM** | Azure Virtual Machine Contributor or Azure [Owner](../role-based-access-control/built-in-roles.md)|
| **Azure Arc-enabled server** | [Azure Connected Machine Resource Administrator](../azure-arc/servers/security-overview.md)|

## Permissions

You need the following permissions to manage update operations. The following table shows the permissions that are needed when you use Update Manager. You can create a custom role and assign only the desired permissions to that role so that only permissions for specific actions are provided as per need.

### Read permissions for Update Manager to view Update Manager data

| **Actions** | **Permission** | **Scope** |
|---|---|---|
| **Read Azure VM properties** | Microsoft.Compute/virtualMachines/read | |
| **Read assessment data for Azure VMs** | Microsoft.Compute/virtualMachines/patchAssessmentResults/read<br>Microsoft.Compute/virtualMachines/patchAssessmentResults/softwarePatches/read | |
| **Read patch installation data for Azure VMs** | Microsoft.Compute/virtualMachines/patchInstallationResults/read<br>Microsoft.Compute/virtualMachines/patchInstallationResults/softwarePatches/read | |
| **Read Azure Arc-enabled server properties** | Microsoft.HybridCompute/machines/read | |
| **Read assessment data for Azure Arc-enabled server** | Microsoft.HybridCompute/machines/patchAssessmentResults/read<br>Microsoft.HybridCompute/machines/patchAssessmentResults/softwarePatches/read | |
| **Read patch installation data for Azure Arc-enabled server** | Microsoft.HybridCompute/machines/patchInstallationResults/read<br>Microsoft.HybridCompute/machines/patchInstallationResults/softwarePatches/read | |
| **Get the status of an asynchronous operation** **for Azure** **Virtual machine** | Microsoft.Compute/locations/operations/read | Machine subscription |
| **Read the status of an update center operation on Arc machines** | Microsoft.HybridCompute/locations/updateCenterOperationResults/read | Machine subscription |

### Permissions to perform on-demand actions in Azure Update Manager

Note that following permissions would be required in addition to read permissions documented above  on individual machines on which on-demand operations are performed.

| **Actions** | **Permission** | **Scope** |
|---|---|---|
| **Trigger** **assessment on Azure VMs** | Microsoft.Compute/virtualMachines/assessPatches/action | |
| **Install update on Azure VMs** | Microsoft.Compute/virtualMachines/installPatches/action | |
| **Get the status of an asynchronous operation for Azure Virtual machine** | Microsoft.Compute/locations/operations/read | Machine subscription |
| **Trigger assessment on Azure Arc-enabled server** | Microsoft.HybridCompute/machines/assessPatches/action | |
| **Install update on Azure Arc-enabled server** | Microsoft.HybridCompute/machines/installPatches/action | |
| **Read the status of an update center operation on** **Arc** **machines** | Microsoft.HybridCompute/locations/updateCenterOperationResults/read | Machine subscription |
| **Update patch** **mode /** **assessment mode** **for** **Azure Virtual** **Machines** | Microsoft.Compute/virtualMachines/write | Machine |
| **Update assessment mode for** **Arc Machines** | Microsoft.HybridCompute/machines/write | Machine |

## Scheduled patching (Maintenance configuration) related permissions

Note that below permissions would be required in addition to permissions on individual machines, which are being managed by the schedules.

| **Actions** | **Permission** | **Scope** |
|---|---|---|
| **Register the subscription for the** **Microsoft.Maintenance resource provider** | Microsoft.Maintenance/register/action | Subscription |
| **Create/modify maintenance configuration** | Microsoft.Maintenance/maintenanceConfigurations/write | Subscription/resource group |
| **Create/modify configuration assignments** | Microsoft.Maintenance/configurationAssignments/write | Subscription/Resource group / machine |
| **Read permission for Maintenance updates resource** | Microsoft.Maintenance/updates/read | Machine |
| **Read permission for Maintenance apply updates resource** | Microsoft.Maintenance/applyUpdates/read | Machine |
| **Get list of update  deployment** | Microsoft.Resources/deployments/read | Maintenance configuration and virtual machine subscription |
| **Create or update an update deployment** | Microsoft.Resources/deployments/write | Maintenance configuration and virtual machine subscription |
| **Get a list of update deployment operation statuses** | Microsoft.Resources/deployments/operation statuses | Maintenance configuration and virtual machine subscription |

## Next steps
- [Prerequisites of Update Manager](prerequisites.md).
- [How Update Manager works](workflow-update-manager.md).
