---
title: Maintenance mode
description: Learn how to use Azure Enclave maintenance mode for changes to managed resources.
author: jadean-msft
ms.author: jadean
ms.topic: concept-article
ms.service: azure-enclave
ms.date: 08/24/2026
---

# Maintenance mode

Azure Enclave protects community and enclave-managed resources with deny assignments. You can perform routine operations that Azure Enclave supports by using the appropriate role-based access control (RBAC) permissions without enabling maintenance mode.

## Best practices

- **Limit usage**: Enable maintenance mode only for trusted privileged users during planned maintenance windows. Maintain security and isolation over Azure Enclave resources.
- **Understand the impact**: Privileged users should fully understand the changes they're making, and the steps to undo or remediate those changes. Making manual changes to underlying managed resources in a community or enclave while in maintenance mode might cause unintended drift in your environment from ideal states.

## Maintenance mode options

- `Off` - Deny assignments created by Azure Enclave are in-place to protect underlying [managed resource groups](./azure-enclave-resource-groups.md) for an enclave or community.
- `General` - The `Allow Dataplane Actions` deny assignment remains in place, while selected principals are excluded from the blanket deny assignment. This mode allows those principals to perform supported operations on protected resources, subject to their assigned RBAC roles.
- `Advanced` - The deny assignment that Azure created is temporarily removed to allow privileged users to make elevated changes on the underlying managed resources. This option is the break-glass option for edge cases that aren't covered by the normal RBAC permissions.

Remember to return maintenance mode to `Off` when the change is complete.

## Justification options

- **Networking** - Managing privileged or custom changes to managed resources.
- **Governance** - Managing logging, policy, or other governance-related changes.
- **Off** - Maintenance mode no longer necessary.

## Community maintenance mode

Community maintenance mode protects managed resources that make up the community, including Azure vWAN, Azure Firewall, Firewall Policy, and Log Analytics workspace. When **Advanced** maintenance mode is enabled, the specified principals can perform elevated RBAC actions for an approved break-glass task.

### Community maintenance mode scenarios

Common scenarios for community maintenance mode include:
- Creating/modifying virtual hub route tables to support complex networking configurations.
- Creating/modifying custom virtual hubs within the Community vWAN
- Creating/modifying individual network security group rules required for specific Azure services
- Creating resources within the Community managed resource group to enable private networking, such as private DNS zones and private links.

### Community general maintenance mode

When you enable `General` maintenance mode for a community, the configured maintenance mode principals are excluded from the blanket deny assignment for the community managed resource group. The `Allow Dataplane Actions` deny assignment remains in effect for all principals, including the maintenance mode principals. A principal's assigned RBAC roles continue to limit the actions it can perform.

The following permissions are allowed over the community managed resource group when `General` maintenance mode is enabled:

Community deny assignment: `Deny All`

| Operation | Action type | Explanation |
|---|---|---|
| * | Action | Deny all actions except those specified in this table. |
| */read | NotAction | Allow read actions on all resources. |
| Microsoft.Resources/tags/* | NotAction | Allow tag actions on all resources. |

### Community advanced maintenance mode

The following permissions are allowed over the **Community managed resource group** when **Advanced** maintenance mode is enabled.

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

## Enclave maintenance mode

Enclave maintenance mode protects managed resources that make up the enclave, including Azure virtual network, network security groups, and Log Analytics workspace. When Advanced maintenance mode is enabled, the specified principals can perform elevated RBAC actions for an approved break-glass task.

### Enclave maintenance mode scenarios

Common scenarios for using enclave maintenance mode include:
- Performing subnet/vnet joins operations during workload deployments
- Creating/modifying individual network security group rules required for specific Azure services
- Creating resources within the enclave managed resource group to enable private networking, such as private DNS zones and private links.

### Enclave general maintenance mode

When you enable `General` maintenance mode for an enclave, the configured maintenance mode principals are excluded from the blanket deny assignment for the enclave managed resource group. The `Allow Dataplane Actions` deny assignment remains in effect for all principals, including the maintenance mode principals. A principal's assigned RBAC roles continue to limit the actions it can perform.

The following permissions are allowed over the enclave managed resource group when `General` maintenance mode is enabled:

Enclave deny assignment: `Deny All`

| Operation | Action type | Explanation |
|---|---|---|
| * | Action | Deny all actions except those specified in this table. |
| */read | NotAction | Allow read actions on all resources. |
| Microsoft.Resources/tags/* | NotAction | Allow tag actions on all resources. |

### Enclave advanced maintenance mode

The following permissions are allowed over the **enclave managed resource group** when **advanced** maintenance mode is enabled.

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

1. Go to the **Maintenance mode** tab on the community or enclave create form.
1. Select the mode option `Off`, `General`, or `Advanced`.
1. Select the service principals that you want to include.
1. Select the justification for entering maintenance mode: **Networking**, or **Governance**. Select `Off` if the maintenance mode is `Off` too.
1. Review and create the community or enclave as normal.

### 2. Activate maintenance mode for an existing community or enclave

1. Navigate to the community or enclave you're enabling maintenance mode.
1. Go to the **Maintenance mode** tab.
1. Select the `General` or `Advanced` mode.
1. Select the service principals that you want to include.
1. Select the justification for entering maintenance mode: **Networking** or **Governance**.
1. Confirm and save.

### 3. Perform maintenance tasks

- After you activate **Advanced** maintenance mode, perform only the approved break-glass task.

### 4. Deactivate maintenance mode

1. After completing your tasks, navigate back to the Maintenance mode tab.
1. Select the **Off** mode.
1. Confirm and save.

## Learn more

- [What is Azure role-based access control (Azure RBAC)?](/azure/role-based-access-control/overview)
- [Understand Azure deny assignments](/azure/role-based-access-control/deny-assignments)
- [List deny assignments using the Azure portal](/azure/role-based-access-control/deny-assignments-portal)
- [Azure built-in roles](/azure/role-based-access-control/built-in-roles)
- [Understand Azure role definitions](/azure/role-based-access-control/role-definitions)
- [Best practices for Azure RBAC](/azure/role-based-access-control/best-practices)
- [What is Microsoft Entra Privileged Identity Management?](/entra/id-governance/privileged-identity-management/pim-configure)
- [Managed resource groups in Azure](/azure/azure-resource-manager/managed-applications/overview#managed-resource-group)
