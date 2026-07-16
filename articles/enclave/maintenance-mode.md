---
title: Maintenance mode
description: Maintenance mode explanation.
author: jadean-msft
ms.author: jadean
ms.topic: concept-article
ms.date: 9/30/2025
---

# Maintenance Mode

Maintenance mode is a feature that allows community or enclave owners to temporarily place their community or enclaves into a "maintenance mode" state where changes are allowed. This mode permits privileged users to make certain changes to the underlying managed resources that are normally protected by Deny Assignments. This helps maintain the community and enclave isolation and network boundary.

## Maintenance mode options

- `Off` - Deny assignments created by Azure Enclave are in-place to protect underlying [managed resource groups](./azure-enclave-resource-groups.md) for an enclave or community.
- `General` - The `Allow Dataplane Actions` deny assignment created by Azure allows privileged users to modify certain existing resources only in the underlying managed resources. For an enclave, these operations include resources joining the enclave virtual network and creating Private DNS Zone records. For a community, these operations include making changes to the Virtual WAN resources. By default, communities and enclaves are deployed in `Off` mode, but choose `General` mode during creation and provide appropriate Microsoft Entra ID identities to allow changes to the protected resources.
- `Advanced` - The deny assignment created by Azure is temporarily removed to allow privileged users to make elevated changes on the underlying managed resources.

## Justification options

- **Networking** - Managing privileged or custom changes to managed resources.
- **Governance** - Managing logging, policy, or other governance-related changes.
- **Off** - Maintenance mode no longer necessary.

## Community Maintenance Mode

Community Maintenance mode is use protect managed resources that make up the Community including Azure vWAN, Azure Firewall, Firewall Policy and Log Analytics Workspace. Deny assignments are used to prevent unauthorized actions over these resources. When maintainance mode is enabled, the specified principals are granted exclusions from the deny assignments to perform privileged RBAC actions.   

### Community Maintanence Mode Scenarios

Common scenarios for Community Maintanence Mode include:
- Creating/modifying virtual hub route tables to support complex networking configurations.
- Creating/modifying custom virtual hubs within the Community vWAN
- Creating/modifying individual network security group rules required for specific Azure services
- Creating resources within the Enclave managed resource group to enable private networking (ex - Private DNS Zones, Private Links, etc.) 

## Community - General Maintainance Mode

When `General` maintenance mode is enabled on a **Community ** resource, the maintenance mode `principals` (for example, users or groups) are excluded from the `Deny All` deny assignment for the **community managed resource group**. 

This allows the users identified in the maintenance mode principals to perform that actions that would otherwise be blocked by the `Deny All` deny assignment. The `Allow Dataplane Actions` deny assignments are still in effect for all principals (including the maintenance mode principals). A user may still be limited by their assigned roles.

The following permissions are allowed over the **Community managed resource group** when **general** maintanence mode is enabled.

Community Deny Assignment: `Deny All` 

| Operation                  | Action Type  | Explanation                                     |
|----------------------------|--------------|-------------------------------------------------|
| *	                         | Action       | Deny all actions except specified in this table |
| */read                     | NotAction    | Allowed | Allow "read" actions on all resources |
| Microsoft.Resources/tags/* | NotAction    | Allow "tags" actions on all resources           |   

### Community - Advanced Maintenance Mode

The following permissions are allowed over the **Communtiy managed resource group** when **advanced** maintanence mode is enabled.

Community Deny Assignment: `Allow Dataplane Actions`

| Operation                                                             | Action Type   | Explanation |
|-----------------------------------------------------------------------|---------------|-------------------------------------------------------|
| *                                                                     | Action        | Deny all actions except specified in this table       |
| */read                                                                | NotAction     | Allow "read" actions on all resources                 |
| Microsoft.Insights/alertRules/*                                       | NotAction     | Allow all actions on "alertRules"                     |
| Microsoft.Support/*                                                   | NotAction     | Allow all actions on "Support"                        |
| Microsoft.Resources/tags/*                                            | NotAction     | Allow "tags" actions on all resources                 |
| Microsoft.Network/azureFirewalls/networkRuleCollections/write         | NotAction     | Allow "write" actions on networkRuleCollections       |
| Microsoft.Network/azureFirewalls/applicationRuleCollections/write     | NotAction     | Allow "write" actions on applicationRuleCollections   |
| Microsoft.Network/azureFirewalls/natRuleCollections/write             | NotAction     | Allow "write" actions on natRuleCollections           |
| Microsoft.Network/firewallPolicies/ruleGroups/write                   | NotAction     | Allow "write" actions on ruleGroups                   |
| Microsoft.Network/virtualHubs/write                                   | NotAction     | Allow "write" actions on virtualHubs                  |
| Microsoft.Network/virtualWans/virtualHubs/read                        | NotAction     | Allow "read" actions on virtualHubs                   |
| Microsoft.Network/virtualWans/join/action                             | NotAction     | Allow "join" actions on virtualWans                   |
| Microsoft.Network/virtualHubs/routeTables/write                       | NotAction     | Allow "write" actions over virtual hub route tables   |

## Enclave Maintenance Mode

Enclave Maintenance mode is use protect managed resources that make up the Enclave including Azure virtual network, network security groups, and log analytics workspace. Deny assignments are used to prevent unauthorized actions over these resources. When maintainance mode is enabled, the specified principals are granted exclusions from the deny assignments to perform privileged RBAC actions over the enclave managed resource group. 

### Enclave Maintanence Mode Scenarios

Common scenarios for using enclave maintanence mode include:
- Performing subnet/vnet joins operations during workload deployments
- Creating/modifying individual network security group rules required for specific Azure services
- Creating resources within the enclave managed resource group to enable private networking (ex - Private DNS Zones, Private Links, etc.) 

### Enclave - General Maintenance Mode

When `General` maintenance mode is enabled on an enclave resource, the maintenance mode `principals` (users, groups, or service principals) are excluded from the `Deny All` deny assignment for the **enclave managed resource group**. This allows the users identified in the maintenance mode principals to perform that actions that would otherwise be blocked by the `Deny All` deny assignment. The `Allow Dataplane Actions` deny assignments are still in effect for all principals (including the maintenance mode principals). A user may still be limited by their assigned roles.

The following permissions are allowed over the **enclave managed resource group** when **general** maintanence mode is enabled.

Enclave deny assignment: `Deny All` 

| Operation                  | Action Type  | Explanation                                     |
|----------------------------|--------------|-------------------------------------------------|
| *	                         | Action       | Deny all actions except specified in this table |
| */read                     | NotAction    | Allow "read" actions on all resources           |
| Microsoft.Resources/tags/* | NotAction    | Allow "tags" actions on all resources           |   

### Enclave - Advanced Maintenance Mode

The following permissions are allowed over the **enclave managed resource group** when **advanced** maintanence mode is enabled.

Enclave deny assignment: `Allow Dataplane Actions`

| Operation                                             | Action Type   | Explanation                                               |
|-------------------------------------------------------|---------------|-----------------------------------------------------------|
| *                                                     | Action        | Deny all actions except specified in this table           |
| */read                                                | NotAction     | Allow "read" actions on all resources                     |
| Microsoft.Insights/alertRules/*                       | NotAction     | Allow all actions on "alertRules"                         |
| Microsoft.Resources/deployments/*                     | NotAction     | Allow all actions on "deployments"                        |
| Microsoft.Support/*                                   | NotAction     | Allow all actions on "Support"                            |
| Microsoft.Network/privateDnsZones/*                   | NotAction     | Allow all actions on "privateDnsZones"                    |
| Microsoft.Network/privateDnsOperationResults/*        | NotAction     | Allow all actions on "privateDnsOperationResults"         |
| Microsoft.Network/privateDnsOperationStatuses/*       | NotAction     | Allow all actions on "privateDnsOperationStatuses"        |
| Microsoft.Network/virtualNetworks/join/action         | NotAction     | Allow vNet/join operations over the enclave vNet          |
| Microsoft.Network/virtualNetworks/subnets/join/action | NotAction     | Allow subnet/join operations over the enclave vNet        |
| Microsoft.Authorization/policyExemptions/*            | NotAction     | Allow all actions on "policyExemptions"                   |
| Microsoft.Network/routeTables/routes/write            | NotAction     | Allow "write" actions over Virtual Network route tables   |

## How to use maintenance mode

### 1. Activate maintenance mode during community or enclave creation

1. Navigate to the Maintenance mode tab on the community or enclave create form.
1. Select the mode option [`Off` / `General` / `Advanced`].
1. Select the service principals that you want to include.
1. Select the justification for why you're entering maintenance mode [`OFF` / `NETWORKING` / `GOVERNANCE`].
1. Review and create the community or enclave as normal.

### 2. Activate maintenance mode for an existing community or enclave

1. Navigate to the community or enclave you're enabling maintenance mode.
1. Navigate to the "Maintenance mode" tab.
1. Select the mode option [`Advanced` / `General`].
1. Select the service principals that you want to include.
1. Select the justification for why you're entering maintenance mode [`NETWORKING` / `GOVERNANCE`].
1. Confirm and save.

### 3. Perform maintenance tasks

- Once Maintenance Mode is activated, proceed with your maintenance tasks or create complex workloads as needed.

### 4. Deactivate maintenance mode

1. After completing your tasks, navigate back to the Maintenance mode tab.
1. Select the `OFF` mode.
1. Confirm and save.

## Best practices

- **Limit Usage**: Ensure that maintenance mode is only enabled for trusted privileged users during planned mainenance windows and ensure to maintain security and isolation over Azure Enclave resources.
- **Understand the impact**: Privileged users should fully understand the changes they're making, and steps to undo or remediate those changes. Making manual changes to underlying managed resources in a community or enclave while in maintenance mode might cause unintended drift in your environment from ideal states.

## Learn more

- [What is Azure role-based access control (Azure RBAC)?](/azure/role-based-access-control/overview)
- [Understand Azure deny assignments](/azure/role-based-access-control/deny-assignments)
- [List deny assignments using the Azure portal](/azure/role-based-access-control/deny-assignments-portal)
- [Azure built-in roles](/azure/role-based-access-control/built-in-roles)
- [Understand Azure role definitions](/azure/role-based-access-control/role-definitions)
- [Best practices for Azure RBAC](/azure/role-based-access-control/best-practices)
- [What is Microsoft Entra Privileged Identity Management?](/entra/id-governance/privileged-identity-management/pim-configure)
- [Managed resource groups in Azure](/azure/azure-resource-manager/managed-applications/overview#managed-resource-group)