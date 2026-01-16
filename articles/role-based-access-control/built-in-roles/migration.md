---
title: Azure built-in roles for Migration - Azure RBAC
description: This article lists the Azure built-in roles for Azure role-based access control (Azure RBAC) in the Migration category. It lists Actions, NotActions, DataActions, and NotDataActions.
ms.service: role-based-access-control
ms.topic: generated-reference
ms.workload: identity
author: rolyon
manager: pmwongera
ms.author: rolyon
ms.date: 12/31/2025
ms.custom: generated
---

# Azure built-in roles for Migration

This article lists the Azure built-in roles in the Migration category.


## Azure Migrate Decide and Plan Expert

Grants restricted access on Azure Migrate project to only perform planning operations including appliance-based discovery, managing inventory, identifying server dependencies, creation of business case & assessment reports.

[Learn more](/azure/migrate/prepare-azure-accounts)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/locations/read | Gets the list of locations supported. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/checkResourceName/action | Check the resource name for validity. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deploymentScripts/write | Creates or updates a deployment script |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deploymentScripts/read | Gets or lists deployment scripts |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/links/write | Creates or updates a resource link. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/locks/write | Add locks at the specified scope. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/locks/delete | Delete locks at the specified scope. |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Migrate](../permissions/migration.md#microsoftmigrate)/* |  |
> | Microsoft.ApplicationMigration/* |  |
> | [Microsoft.OffAzure](../permissions/migration.md#microsoftoffazure)/* |  |
> | Microsoft.MySQLDiscovery/* |  |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | Microsoft.DependencyMap/* |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/* |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/checkNameAvailability/read | Checks that a key vault name is valid and is not in use |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/read | Read any Azure Arc machines |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/write | Writes an Azure Arc machines |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/delete | Deletes an Azure Arc machines |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/register/action | Registers the subscription for the Microsoft.HybridCompute Resource Provider |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/subnets/write | Creates a virtual network subnet or updates an existing virtual network subnet |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/subnets/join/action | Joins a virtual network. Not Alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkSecurityGroups/join/action | Joins a network security group. Not Alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/join/action | Joins a virtual network. Not Alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/privateEndpoints/read | Gets an private endpoint resource. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/privateEndpoints/write | Creates a new private endpoint, or updates an existing private endpoint. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/privateEndpoints/privateDnsZoneGroups/write | Puts a Private DNS Zone Group |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/privateDnsZones/write | Create or update a Private DNS zone within a resource group. Note that this command cannot be used to create or update virtual network links or record sets within the zone. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/privateDnsZones/virtualNetworkLinks/write | Create or update a Private DNS zone link to virtual network. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/privateDnsZones/join/action | Joins a Private DNS Zone |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/privateDnsZones/A/write | Create or update a record set of type 'A' within a Private DNS zone. The records specified will replace the current records in the record set. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/register/action | Registers the subscription |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/subnets/read | Gets a virtual network subnet definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/privateEndpoints/privateDnsZoneGroups/read | Gets a Private DNS Zone Group |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/*/read |  |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/*/write |  |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/listKeys/action | Returns the access keys for the specified storage account. |
> | [Microsoft.GuestConfiguration](../permissions/management-and-governance.md#microsoftguestconfiguration)/register/action | Registers the subscription for the Microsoft.GuestConfiguration resource provider. |
> | [Microsoft.HybridConnectivity](../permissions/hybrid-multicloud.md#microsofthybridconnectivity)/register/action | Register the subscription for Microsoft.HybridConnectivity |
> | Microsoft.DataReplication/*/read |  |
> | Microsoft.DataReplication/register/action | Registers the subscription for the Microsoft.DataReplication resource provider |
> | Microsoft.DataReplication/replicationVaults/write | Updates any vault |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/* |  |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/register/action | Registers subscription for given Resource Provider |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/register/action | Registers a subscription |
> | Microsoft.AzureArcData/register/action | Register the subscription for Microsoft.AzureArcData |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/links/read | Gets or lists resource links. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Grants restricted access on Azure Migrate project to only perform planning operations including appliance-based discovery, managing inventory, identifying server dependencies, creation of business case & assessment reports.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/7859c0b0-0bb9-4994-bd12-cd529af7d646",
  "name": "7859c0b0-0bb9-4994-bd12-cd529af7d646",
  "permissions": [
    {
      "actions": [
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/locations/read",
        "Microsoft.Resources/checkResourceName/action",
        "Microsoft.Resources/deploymentScripts/write",
        "Microsoft.Resources/deploymentScripts/read",
        "Microsoft.Resources/links/write",
        "Microsoft.Authorization/*/read",
        "Microsoft.Authorization/locks/write",
        "Microsoft.Authorization/locks/delete",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Migrate/*",
        "Microsoft.ApplicationMigration/*",
        "Microsoft.OffAzure/*",
        "Microsoft.MySQLDiscovery/*",
        "Microsoft.Support/*",
        "Microsoft.DependencyMap/*",
        "Microsoft.KeyVault/vaults/*",
        "Microsoft.KeyVault/checkNameAvailability/read",
        "Microsoft.HybridCompute/machines/read",
        "Microsoft.HybridCompute/machines/write",
        "Microsoft.HybridCompute/machines/delete",
        "Microsoft.HybridCompute/register/action",
        "Microsoft.Network/virtualNetworks/subnets/write",
        "Microsoft.Network/virtualNetworks/subnets/join/action",
        "Microsoft.Network/networkSecurityGroups/join/action",
        "Microsoft.Network/virtualNetworks/join/action",
        "Microsoft.Network/privateEndpoints/read",
        "Microsoft.Network/privateEndpoints/write",
        "Microsoft.Network/privateEndpoints/privateDnsZoneGroups/write",
        "Microsoft.Network/privateDnsZones/write",
        "Microsoft.Network/privateDnsZones/virtualNetworkLinks/write",
        "Microsoft.Network/privateDnsZones/join/action",
        "Microsoft.Network/privateDnsZones/A/write",
        "Microsoft.Network/register/action",
        "Microsoft.Network/virtualNetworks/subnets/read",
        "Microsoft.Network/privateEndpoints/privateDnsZoneGroups/read",
        "Microsoft.Storage/storageAccounts/*/read",
        "Microsoft.Storage/storageAccounts/*/write",
        "Microsoft.Storage/storageAccounts/listKeys/action",
        "Microsoft.GuestConfiguration/register/action",
        "Microsoft.HybridConnectivity/register/action",
        "Microsoft.DataReplication/*/read",
        "Microsoft.DataReplication/register/action",
        "Microsoft.DataReplication/replicationVaults/write",
        "Microsoft.RecoveryServices/vaults/*",
        "Microsoft.RecoveryServices/register/action",
        "Microsoft.KeyVault/register/action",
        "Microsoft.AzureArcData/register/action",
        "Microsoft.Resources/links/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Migrate Decide and Plan Expert",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Migrate Execute Expert

Grants restricted access on an Azure Migrate project to only perform migration related operations, including replication, execution of test migrations, tracking and monitoring of migration progress, and initiation of agentless and agent-based migrations.

Includes an ABAC condition to constrain role assignments.

[Learn more](/azure/migrate/prepare-azure-accounts)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/write | Creates or updates a resource group. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/locations/read | Gets the list of locations supported. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/checkResourceName/action | Check the resource name for validity. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deploymentScripts/write | Creates or updates a deployment script |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deploymentScripts/read | Gets or lists deployment scripts |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/links/write | Creates or updates a resource link. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/locks/write | Add locks at the specified scope. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/locks/delete | Delete locks at the specified scope. |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Migrate](../permissions/migration.md#microsoftmigrate)/*/read |  |
> | Microsoft.ApplicationMigration/*/read |  |
> | [Microsoft.OffAzure](../permissions/migration.md#microsoftoffazure)/*/read |  |
> | Microsoft.MySQLDiscovery/*/read |  |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/read | Gets a network interface definition.  |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/write | Creates a network interface or updates an existing network interface.  |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/delete | Deletes a network interface |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/read | Get the virtual network definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/subnets/read | Gets a virtual network subnet definition |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/*/read |  |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/*/write |  |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/listKeys/action | Returns the access keys for the specified storage account. |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/register/action | Registers Subscription with Microsoft.Compute resource provider |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/availabilitySets/read | Get the properties of an availability set |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/availabilitySets/vmSizes/read | List available sizes for creating or updating a virtual machine in the availability set |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/diskEncryptionSets/read | Get the properties of a disk encryption set |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/skus/read | Gets the list of Microsoft.Compute SKUs available for your Subscription |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/disks/read | Get the properties of a Disk |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/disks/write | Creates a new Disk or updates an existing one |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/disks/delete | Deletes the Disk |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/read | Get the properties of a virtual machine |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/write | Creates a new virtual machine or updates an existing virtual machine |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/delete | Deletes the virtual machine |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/* |  |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/register/action | Registers subscription for given Resource Provider |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/operations/read | Operation returns the list of Operations for a Resource Provider |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/links/read | Gets or lists resource links. |
> | Microsoft.DependencyMap/*/read |  |
> | Microsoft.DependencyMap/maps/*/action |  |
> | **NotActions** |  |
> | [Microsoft.OffAzure](../permissions/migration.md#microsoftoffazure)/hypervSites/machines/inventoryinsights/pendingupdates/* |  |
> | [Microsoft.OffAzure](../permissions/migration.md#microsoftoffazure)/hypervSites/machines/inventoryinsights/vulnerabilities/* |  |
> | [Microsoft.OffAzure](../permissions/migration.md#microsoftoffazure)/serverSites/machines/inventoryinsights/pendingupdates/* |  |
> | [Microsoft.OffAzure](../permissions/migration.md#microsoftoffazure)/serverSites/machines/inventoryinsights/vulnerabilities/* |  |
> | [Microsoft.OffAzure](../permissions/migration.md#microsoftoffazure)/vmwareSites/machines/inventoryinsights/vulnerabilities/* |  |
> | [Microsoft.OffAzure](../permissions/migration.md#microsoftoffazure)/vmwareSites/machines/inventoryinsights/pendingupdates/* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |
> | **Actions** |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/write | Create a role assignment at the specified scope. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/delete | Delete a role assignment at the specified scope. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |
> | **Condition** |  |
> | ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})) OR (@Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals{17d1049b-9a84-46fb-8f53-869881c3d3ab, ba92f5b4-2d11-453d-a403-e96b0029c9fe})) AND ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})) OR (@Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals{17d1049b-9a84-46fb-8f53-869881c3d3ab, ba92f5b4-2d11-453d-a403-e96b0029c9fe})) | Add or remove role assignments for the following roles:<br/>Storage Account Contributor<br/>Storage Blob Data Contributor |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Grants restricted access on an Azure Migrate project to only perform migration related operations, including replication, execution of test migrations, tracking and monitoring of migration progress, and initiation of agentless and agent-based migrations.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/1cfa4eac-9a23-481c-a793-bfb6958e836b",
  "name": "1cfa4eac-9a23-481c-a793-bfb6958e836b",
  "permissions": [
    {
      "actions": [
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/write",
        "Microsoft.Resources/subscriptions/locations/read",
        "Microsoft.Resources/checkResourceName/action",
        "Microsoft.Resources/deploymentScripts/write",
        "Microsoft.Resources/deploymentScripts/read",
        "Microsoft.Resources/links/write",
        "Microsoft.Authorization/*/read",
        "Microsoft.Authorization/locks/write",
        "Microsoft.Authorization/locks/delete",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Migrate/*/read",
        "Microsoft.ApplicationMigration/*/read",
        "Microsoft.OffAzure/*/read",
        "Microsoft.MySQLDiscovery/*/read",
        "Microsoft.Support/*",
        "Microsoft.Network/networkInterfaces/read",
        "Microsoft.Network/networkInterfaces/write",
        "Microsoft.Network/networkInterfaces/delete",
        "Microsoft.Network/virtualNetworks/read",
        "Microsoft.Network/virtualNetworks/subnets/read",
        "Microsoft.Storage/storageAccounts/*/read",
        "Microsoft.Storage/storageAccounts/*/write",
        "Microsoft.Storage/storageAccounts/listKeys/action",
        "Microsoft.Compute/register/action",
        "Microsoft.Compute/availabilitySets/read",
        "Microsoft.Compute/availabilitySets/vmSizes/read",
        "Microsoft.Compute/diskEncryptionSets/read",
        "Microsoft.Compute/skus/read",
        "Microsoft.Compute/disks/read",
        "Microsoft.Compute/disks/write",
        "Microsoft.Compute/disks/delete",
        "Microsoft.Compute/virtualMachines/read",
        "Microsoft.Compute/virtualMachines/write",
        "Microsoft.Compute/virtualMachines/delete",
        "Microsoft.RecoveryServices/vaults/*",
        "Microsoft.RecoveryServices/register/action",
        "Microsoft.RecoveryServices/operations/read",
        "Microsoft.Resources/links/read",
        "Microsoft.DependencyMap/*/read",
        "Microsoft.DependencyMap/maps/*/action"
      ],
      "notActions": [
        "Microsoft.OffAzure/hypervSites/machines/inventoryinsights/pendingupdates/*",
        "Microsoft.OffAzure/hypervSites/machines/inventoryinsights/vulnerabilities/*",
        "Microsoft.OffAzure/serverSites/machines/inventoryinsights/pendingupdates/*",
        "Microsoft.OffAzure/serverSites/machines/inventoryinsights/vulnerabilities/*",
        "Microsoft.OffAzure/vmwareSites/machines/inventoryinsights/vulnerabilities/*",
        "Microsoft.OffAzure/vmwareSites/machines/inventoryinsights/pendingupdates/*"
      ],
      "dataActions": [],
      "notDataActions": []
    },
    {
      "actions": [
        "Microsoft.Authorization/roleAssignments/write",
        "Microsoft.Authorization/roleAssignments/delete"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": [],
      "conditionVersion": "2.0",
      "condition": "((!(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})) OR (@Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals{17d1049b-9a84-46fb-8f53-869881c3d3ab, ba92f5b4-2d11-453d-a403-e96b0029c9fe})) AND ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})) OR (@Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals{17d1049b-9a84-46fb-8f53-869881c3d3ab, ba92f5b4-2d11-453d-a403-e96b0029c9fe}))"
    }
  ],
  "roleName": "Azure Migrate Execute Expert",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Migrate Owner

Grants full access to create and manage Azure Migrate projects including appliance-based discovery, creation of business case & assessment report and execution of migrations; Also grants ability to assign Azure Migrate specific roles in Azure RBAC.

Includes an ABAC condition to constrain role assignments.

[Learn more](/azure/migrate/prepare-azure-accounts)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/write | Creates or updates a resource group. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/locations/read | Gets the list of locations supported. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/checkResourceName/action | Check the resource name for validity. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deploymentScripts/write | Creates or updates a deployment script |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deploymentScripts/read | Gets or lists deployment scripts |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/links/write | Creates or updates a resource link. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/locks/write | Add locks at the specified scope. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/locks/delete | Delete locks at the specified scope. |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Migrate](../permissions/migration.md#microsoftmigrate)/* |  |
> | Microsoft.ApplicationMigration/* |  |
> | [Microsoft.OffAzure](../permissions/migration.md#microsoftoffazure)/* |  |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | Microsoft.MySQLDiscovery/* |  |
> | Microsoft.DependencyMap/* |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/* |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/checkNameAvailability/read | Checks that a key vault name is valid and is not in use |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/read | Read any Azure Arc machines |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/write | Writes an Azure Arc machines |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/delete | Deletes an Azure Arc machines |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/register/action | Registers the subscription for the Microsoft.HybridCompute Resource Provider |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/read | Gets a network interface definition.  |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/write | Creates a network interface or updates an existing network interface.  |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/delete | Deletes a network interface |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/read | Get the virtual network definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/subnets/write | Creates a virtual network subnet or updates an existing virtual network subnet |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/subnets/join/action | Joins a virtual network. Not Alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkSecurityGroups/join/action | Joins a network security group. Not Alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/join/action | Joins a virtual network. Not Alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/privateEndpoints/read | Gets an private endpoint resource. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/privateEndpoints/write | Creates a new private endpoint, or updates an existing private endpoint. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/privateEndpoints/privateDnsZoneGroups/write | Puts a Private DNS Zone Group |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/privateDnsZones/write | Create or update a Private DNS zone within a resource group. Note that this command cannot be used to create or update virtual network links or record sets within the zone. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/privateDnsZones/virtualNetworkLinks/write | Create or update a Private DNS zone link to virtual network. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/privateDnsZones/join/action | Joins a Private DNS Zone |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/privateDnsZones/A/write | Create or update a record set of type 'A' within a Private DNS zone. The records specified will replace the current records in the record set. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/register/action | Registers the subscription |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/subnets/read | Gets a virtual network subnet definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/privateEndpoints/privateDnsZoneGroups/read | Gets a Private DNS Zone Group |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/* | Create and manage storage accounts |
> | [Microsoft.GuestConfiguration](../permissions/management-and-governance.md#microsoftguestconfiguration)/register/action | Registers the subscription for the Microsoft.GuestConfiguration resource provider. |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/register/action | Registers Subscription with Microsoft.Compute resource provider |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/availabilitySets/read | Get the properties of an availability set |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/availabilitySets/vmSizes/read | List available sizes for creating or updating a virtual machine in the availability set |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/diskEncryptionSets/read | Get the properties of a disk encryption set |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/skus/read | Gets the list of Microsoft.Compute SKUs available for your Subscription |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/disks/read | Get the properties of a Disk |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/disks/write | Creates a new Disk or updates an existing one |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/disks/delete | Deletes the Disk |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/read | Get the properties of a virtual machine |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/write | Creates a new virtual machine or updates an existing virtual machine |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/delete | Deletes the virtual machine |
> | [Microsoft.HybridConnectivity](../permissions/hybrid-multicloud.md#microsofthybridconnectivity)/register/action | Register the subscription for Microsoft.HybridConnectivity |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/* |  |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/register/action | Registers subscription for given Resource Provider |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/operations/read | Operation returns the list of Operations for a Resource Provider |
> | Microsoft.DataReplication/*/read |  |
> | Microsoft.DataReplication/register/action | Registers the subscription for the Microsoft.DataReplication resource provider |
> | Microsoft.DataReplication/replicationVaults/write | Updates any vault |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/register/action | Registers a subscription |
> | Microsoft.AzureArcData/register/action | Register the subscription for Microsoft.AzureArcData |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/links/read | Gets or lists resource links. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |
> | **Actions** |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/write | Create a role assignment at the specified scope. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/delete | Delete a role assignment at the specified scope. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |
> | **Condition** |  |
> | ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})) OR (@Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals{7859c0b0-0bb9-4994-bd12-cd529af7d646, 1cfa4eac-9a23-481c-a793-bfb6958e836b, 17d1049b-9a84-46fb-8f53-869881c3d3ab, ba92f5b4-2d11-453d-a403-e96b0029c9fe, ba480ccd-6499-4709-b581-8f38bb215c63})) AND ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})) OR (@Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals{7859c0b0-0bb9-4994-bd12-cd529af7d646, 1cfa4eac-9a23-481c-a793-bfb6958e836b, 17d1049b-9a84-46fb-8f53-869881c3d3ab, ba92f5b4-2d11-453d-a403-e96b0029c9fe, ba480ccd-6499-4709-b581-8f38bb215c63})) | Add or remove role assignments for the following roles:<br/>Azure Migrate Decide and Plan Expert<br/>Azure Migrate Execute Expert<br/>Storage Account Contributor<br/>Storage Blob Data Contributor<br/>Azure Migrate Service Reader |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Grants full access to create and manage Azure Migrate projects including appliance-based discovery, creation of business case & assessment report and execution of migrations; Also grants ability to assign Azure Migrate specific roles in Azure RBAC.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/fd8ea4d5-6509-4db0-bada-356ab233b4fa",
  "name": "fd8ea4d5-6509-4db0-bada-356ab233b4fa",
  "permissions": [
    {
      "actions": [
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/write",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/locations/read",
        "Microsoft.Resources/checkResourceName/action",
        "Microsoft.Resources/deploymentScripts/write",
        "Microsoft.Resources/deploymentScripts/read",
        "Microsoft.Resources/links/write",
        "Microsoft.Authorization/*/read",
        "Microsoft.Authorization/locks/write",
        "Microsoft.Authorization/locks/delete",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Migrate/*",
        "Microsoft.ApplicationMigration/*",
        "Microsoft.OffAzure/*",
        "Microsoft.Support/*",
        "Microsoft.MySQLDiscovery/*",
        "Microsoft.DependencyMap/*",
        "Microsoft.KeyVault/vaults/*",
        "Microsoft.KeyVault/checkNameAvailability/read",
        "Microsoft.HybridCompute/machines/read",
        "Microsoft.HybridCompute/machines/write",
        "Microsoft.HybridCompute/machines/delete",
        "Microsoft.HybridCompute/register/action",
        "Microsoft.Network/networkInterfaces/read",
        "Microsoft.Network/networkInterfaces/write",
        "Microsoft.Network/networkInterfaces/delete",
        "Microsoft.Network/virtualNetworks/read",
        "Microsoft.Network/virtualNetworks/subnets/write",
        "Microsoft.Network/virtualNetworks/subnets/join/action",
        "Microsoft.Network/networkSecurityGroups/join/action",
        "Microsoft.Network/virtualNetworks/join/action",
        "Microsoft.Network/privateEndpoints/read",
        "Microsoft.Network/privateEndpoints/write",
        "Microsoft.Network/privateEndpoints/privateDnsZoneGroups/write",
        "Microsoft.Network/privateDnsZones/write",
        "Microsoft.Network/privateDnsZones/virtualNetworkLinks/write",
        "Microsoft.Network/privateDnsZones/join/action",
        "Microsoft.Network/privateDnsZones/A/write",
        "Microsoft.Network/register/action",
        "Microsoft.Network/virtualNetworks/subnets/read",
        "Microsoft.Network/privateEndpoints/privateDnsZoneGroups/read",
        "Microsoft.Storage/storageAccounts/*",
        "Microsoft.GuestConfiguration/register/action",
        "Microsoft.Compute/register/action",
        "Microsoft.Compute/availabilitySets/read",
        "Microsoft.Compute/availabilitySets/vmSizes/read",
        "Microsoft.Compute/diskEncryptionSets/read",
        "Microsoft.Compute/skus/read",
        "Microsoft.Compute/disks/read",
        "Microsoft.Compute/disks/write",
        "Microsoft.Compute/disks/delete",
        "Microsoft.Compute/virtualMachines/read",
        "Microsoft.Compute/virtualMachines/write",
        "Microsoft.Compute/virtualMachines/delete",
        "Microsoft.HybridConnectivity/register/action",
        "Microsoft.RecoveryServices/vaults/*",
        "Microsoft.RecoveryServices/register/action",
        "Microsoft.RecoveryServices/operations/read",
        "Microsoft.DataReplication/*/read",
        "Microsoft.DataReplication/register/action",
        "Microsoft.DataReplication/replicationVaults/write",
        "Microsoft.KeyVault/register/action",
        "Microsoft.AzureArcData/register/action",
        "Microsoft.Resources/links/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    },
    {
      "actions": [
        "Microsoft.Authorization/roleAssignments/write",
        "Microsoft.Authorization/roleAssignments/delete"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": [],
      "conditionVersion": "2.0",
      "condition": "((!(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})) OR (@Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals{7859c0b0-0bb9-4994-bd12-cd529af7d646, 1cfa4eac-9a23-481c-a793-bfb6958e836b, 17d1049b-9a84-46fb-8f53-869881c3d3ab, ba92f5b4-2d11-453d-a403-e96b0029c9fe, ba480ccd-6499-4709-b581-8f38bb215c63})) AND ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})) OR (@Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals{7859c0b0-0bb9-4994-bd12-cd529af7d646, 1cfa4eac-9a23-481c-a793-bfb6958e836b, 17d1049b-9a84-46fb-8f53-869881c3d3ab, ba92f5b4-2d11-453d-a403-e96b0029c9fe, ba480ccd-6499-4709-b581-8f38bb215c63}))"
    }
  ],
  "roleName": "Azure Migrate Owner",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Migrate Service Reader

Grants required access to the system assigned managed identity of Azure Migrate project resource.

[Learn more](/azure/migrate/prepare-azure-accounts)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | Microsoft.ApplicationMigration/*/read |  |
> | [Microsoft.Migrate](../permissions/migration.md#microsoftmigrate)/*/read |  |
> | [Microsoft.OffAzure](../permissions/migration.md#microsoftoffazure)/*/read |  |
> | Microsoft.MySQLDiscovery/*/read |  |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectableItems/read | Read any Protectable Items |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/read | Read any Protected Items |
> | [Microsoft.RecoveryServices](../permissions/management-and-governance.md#microsoftrecoveryservices)/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/read | Read any Migration Items |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Grants required access to the system assigned managed identity of Azure Migrate project resource.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/ba480ccd-6499-4709-b581-8f38bb215c63",
  "name": "ba480ccd-6499-4709-b581-8f38bb215c63",
  "permissions": [
    {
      "actions": [
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.ApplicationMigration/*/read",
        "Microsoft.Migrate/*/read",
        "Microsoft.OffAzure/*/read",
        "Microsoft.MySQLDiscovery/*/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectableItems/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Migrate Service Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Migrate Arc Discovery Reader - Preview

Read metadata of Azure Arc enabled server resources and metadata, performance and migration suitability of Arc enabled SQL server resources. Users creating Azure Migrate project that uses Arc resource discovery require this role on Arc scope of the project. To enable periodic sync, Azure Migrate project managed identity must be assigned this role. This role is in preview and subject to change.

[Learn more](/azure/migrate/concepts-arc-resource-discovery)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.AzureArcData/sqlServerInstances/read | Retrieves a SQL Server Instance resource |
> | Microsoft.AzureArcData/sqlServerInstances/databases/read | read databases |
> | Microsoft.AzureArcData/sqlServerInstances/availabilityGroups/read | read availabilityGroups |
> | Microsoft.AzureArcData/sqlServerInstances/getTelemetry/action | Retrieves SQL Server instance telemetry |
> | Microsoft.AzureArcData/sqlServerInstances/availabilityGroups/getDetailView/action | Retrieves detailed properties of the Availability Group. |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/read | Read any Azure Arc machines |
> | [Microsoft.HybridCompute](../permissions/hybrid-multicloud.md#microsofthybridcompute)/machines/extensions/read | Reads any Azure Arc extensions |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Read metadata of Azure Arc enabled server resources and metadata, performance and migration suitability of Arc enabled SQL server resources. Users creating Azure Migrate project that uses Arc resource discovery require this role on Arc scope of the project. To enable periodic sync, Azure Migrate project managed identity must be assigned this role. This role is in preview and subject to change.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/5d5dddae-e124-4753-972d-aae60b37deb4",
  "name": "5d5dddae-e124-4753-972d-aae60b37deb4",
  "permissions": [
    {
      "actions": [
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.AzureArcData/sqlServerInstances/read",
        "Microsoft.AzureArcData/sqlServerInstances/databases/read",
        "Microsoft.AzureArcData/sqlServerInstances/availabilityGroups/read",
        "Microsoft.AzureArcData/sqlServerInstances/getTelemetry/action",
        "Microsoft.AzureArcData/sqlServerInstances/availabilityGroups/getDetailView/action",
        "Microsoft.HybridCompute/machines/read",
        "Microsoft.HybridCompute/machines/extensions/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Migrate Arc Discovery Reader - Preview",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Next steps

- [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal)