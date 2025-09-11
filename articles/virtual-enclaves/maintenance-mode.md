---
title: Maintenance mode
description: Maintenance mode explanation.
author: jadean-msft
ms.author: jadean
ms.topic: conceptual
ms.date: 04/08/2025
---

# Maintenance Mode

Maintenance mode is a feature that allows community or enclave owners to temporarily place their community or enclaves into a "maintenance mode" state where changes are allowed. This mode permits privileged users to make certain changes to the underlying managed resources that are normally protected by Deny Assignments. This helps maintain the community and enclave isolation and network boundary.

## Key features
The following are the key features of Maintenance Mode:
- *Exclusion from Deny Assignments*: Specified users or groups are temporarily excluded from deny assignments, enabling them to perform necessary maintenance tasks or create complex workloads.
- *Privileged action*: As this action is considered as a privileged action, Azure recommends only using maintenance mode when performing certain elevated actions. Privileged users making changes should understand changes they're making, and steps to undo or remediate those changes.
- *User-friendly interface*: The feature is designed with a user-friendly interface, making it easy to activate and deactivate maintenance mode as needed.
- *Enhanced flexibility*: Maintenance mode provides users with the flexibility to manage their workloads more effectively, ensuring that they can perform tasks without unnecessary interruptions.

## Maintenance mode options

- `Off` - Deny assignments created by Azure Virtual Enclaves is in-place to protect underlying [managed resource groups](./virtual-enclaves-resource-groups.md) for an enclave or community.
- `General` - The `Allow Dataplane Actions` deny assignment created by Azure allows privileged users to modify certain existing resources only in the underlying managed resources. For an enclave, these operations include resources joining the enclave virtual network and creating Private DNS Zone records. For a community, these operations include making changes to the Virtual WAN resources. By default, communities and enclaves are deployed in `Off` mode, but choose `General` mode during creation and provide appropriate Microsoft Entra ID identities to allow changes to the protected resources.
- `Advanced` - The deny assignment created by Azure is temporarily removed to allow privileged users to make elevated changes on the underlying managed resources.

## Justification options

- **Networking** - Managing privileged or custom changes to managed resources.
- **Governance** - Managing logging, policy, or other governance-related changes.
- **Off** - Maintenance mode no longer necessary.

## How to use maintenance mode

### 1. Activate maintenance mode during community or enclave creation

1. Navigate to the Maintenance mode tab on the community or enclave create form.
2. Select the mode option [`Off` / `General` / `Advanced`].
3. Select the service principals that you want to include.
4. Select the justification for why you're entering maintenance mode [`OFF` / `NETWORKING` / `GOVERNANCE`].
5. Review and create the community or enclave as normal.

### 2. Activate maintenance mode for an existing community or enclave

1. Navigate to the community or enclave you're enabling maintenance mode.
2. Navigate to the "Maintenance mode" tab.
3. Select the mode option [`Advanced` / `General`].
4. Select the service principals that you want to include.
5. Select the justification for why you're entering maintenance mode [`NETWORKING` / `GOVERNANCE`].
6. Confirm and save.

### 3. Perform maintenance tasks

- Once Maintenance Mode is activated, proceed with your maintenance tasks or create complex workloads as needed.

### 4. Deactivate maintenance mode

1. After completing your tasks, navigate back to the Maintenance mode tab.
2. Select the `OFF` mode.
3. Confirm and save.

## Best practices

- **Communicate**: Inform relevant team members about the activation and deactivation of maintenance mode to avoid any confusion.
- **Understand the impact**: Privileged users should fully understand the changes they're making, and steps to undo or remediate those changes. Making manual changes to underlying managed resources in a community or enclave while in maintenance mode might cause unintended drift in your environment from ideal states.

## Permissions managed by maintenance mode
The following permissions are managed by maintenance mode and users are blocked from performing these actions unless they're listed as a principal in the maintenance mode configuration for the community or enclave and maintenance mode is enabled.

### Maintenance mode "Off"
When maintenance mode is disabled or `Off`, all principals (for example, users or groups) are prevented from performing actions unless the deny assignments allow it for all users for the community or enclave managed resource group. A user may still be limited by their assigned roles.

Deny Assignment: `Deny All` (the same for both communities and enclaves)

| Operation | Action Type | Explanation: maintenance mode principals | Explanation: All non-maintenance mode principals |
|----------------------------|--|----------|----------|
| *	                         | Action | Deny all actions except specified in this table | Deny all actions except specified in this table |
| */read                     | NotAction | Allow "read" actions on all resources | Allow "read" actions on all resources |
| Microsoft.Resources/tags/* | NotAction | Allow "tags" actions on all resources | Allow "tags" actions on all resources |

#### Community maintenance mode "Off"

Community Deny Assignment: `Allow Dataplane Actions`

| Operation | Action Type | Explanation: maintenance mode principals | Explanation: All non-maintenance mode principals |
|-------------------------------------------------------------------|--|----------|----------|
| *                                                                 | Action | Deny all actions except specified in this table | Deny all actions except specified in this table |
| */read                                                            | NotAction | Allow "read" actions on all resources | Allow "read" actions on all resources |
| Microsoft.Insights/alertRules/*                                   | NotAction | Allow all actions on "alertRules" | Allow all actions on "alertRules" |
| Microsoft.Support/*                                               | NotAction | Allow all actions on "Support" | Allow all actions on "Support" |
| Microsoft.Resources/tags/*                                        | NotAction | Allow "tags" actions on all resources | Allow "tags" actions on all resources |
| Microsoft.Network/azureFirewalls/networkRuleCollections/write     | NotAction | Allow "write" actions on networkRuleCollections | Allow "write" actions on networkRuleCollections |
| Microsoft.Network/azureFirewalls/applicationRuleCollections/write | NotAction | Allow "write" actions on applicationRuleCollections | Allow "write" actions on applicationRuleCollections |
| Microsoft.Network/azureFirewalls/natRuleCollections/write         | NotAction | Allow "write" actions on natRuleCollections | Allow "write" actions on natRuleCollections |
| Microsoft.Network/firewallPolicies/ruleGroups/write               | NotAction | Allow "write" actions on ruleGroups | Allow "write" actions on ruleGroups |
| Microsoft.Network/virtualHubs/write                               | NotAction | Allow "write" actions on virtualHubs | Allow "write" actions on virtualHubs |
| Microsoft.Network/virtualWans/virtualHubs/read                    | NotAction | Allow "read" actions on virtualHubs | Allow "read" actions on virtualHubs |
| Microsoft.Network/virtualWans/join/action                         | NotAction | Allow "join" actions on virtualWans | Allow "join" actions on virtualWans |

#### Enclave maintenance mode "Off"

Enclave Deny Assignment: `Allow Dataplane Actions`

| Operation | Action Type | Explanation: maintenance mode principals | Explanation: All non-maintenance mode principals |
|-------------------------------------------------------|--|----------|----------|
| *	                                                    | Action | Deny all actions except specified in this table | Deny all actions except specified in this table |
| */read                                                | NotAction | Allow "read" actions on all resources | Allow "read" actions on all resources |
| Microsoft.Insights/alertRules/*                       | NotAction | Allow all actions on "alertRules" | Allow all actions on "alertRules" |
| Microsoft.Resources/deployments/*                     | NotAction | Allow all actions on "deployments" | Allow all actions on "deployments" |
| Microsoft.Support/*                                   | NotAction | Allow all actions on "Support" | Allow all actions on "Support" |
| Microsoft.Network/privateDnsZones/*                   | NotAction | Allow all actions on "privateDnsZones" | Allow all actions on "privateDnsZones" |
| Microsoft.Network/privateDnsOperationResults/*        | NotAction | Allow all actions on "privateDnsOperationResults" | Allow all actions on "privateDnsOperationResults" |
| Microsoft.Network/privateDnsOperationStatuses/*       | NotAction | Allow all actions on "privateDnsOperationStatuses" | Allow all actions on "privateDnsOperationStatuses" |
| Microsoft.Network/virtualNetworks/join/action         | NotAction | Allow this action | Allow this action |
| Microsoft.Network/virtualNetworks/subnets/join/action | NotAction | Allow this action | Allow this action |
| Microsoft.Authorization/policyExemptions/*            | NotAction | Allow all actions on "policyExemptions" | Allow all actions on "policyExemptions" |

### "General" maintenance mode
When `General` maintenance mode is enabled, the maintenance mode `principals` (for example, users or groups) are excluded from the `Deny All` deny assignment for the community or enclave managed resource group. This allows the users identified in the maintenance mode principals to perform that actions that would otherwise be blocked by the `Deny All` deny assignment. The `Allow Dataplane Actions` deny assignments are still in effect for all principals (including the maintenance mode principals). A user may still be limited by their assigned roles.

Deny Assignment: `Deny All` (the same for both communities and enclaves)

| Operation | Action Type | Explanation: maintenance mode principals | Explanation: All non-maintenance mode principals |
|---------------------------------------------|--|----------|----------|
| *	                         | Action | Allowed here but blocked by `Allow Dataplace Actions` deny assignment | Deny all actions except specified in this table |
| */read                     | NotAction | Allowed | Allow "read" actions on all resources |
| Microsoft.Resources/tags/* | NotAction | Allowed | Allow "tags" actions on all resources |

#### Community "General" maintenance mode

Community Deny Assignment: `Allow Dataplane Actions`

| Operation | Action Type | Explanation: maintenance mode principals | Explanation: All non-maintenance mode principals |
|-------------------------------------------------------------------|--|----------|----------|
| *                                                                 | Action | Deny all actions except specified in this table | Deny all actions except specified in this table |
| */read                                                            | NotAction | Allow "read" actions on all resources | Allow "read" actions on all resources |
| Microsoft.Insights/alertRules/*                                   | NotAction | Allow all actions on "alertRules" | Allow all actions on "alertRules" |
| Microsoft.Support/*                                               | NotAction | Allow all actions on "Support" | Allow all actions on "Support" |
| Microsoft.Resources/tags/*                                        | NotAction | Allow "tags" actions on all resources | Allow "tags" actions on all resources |
| Microsoft.Network/azureFirewalls/networkRuleCollections/write     | NotAction | Allow "write" actions on networkRuleCollections | Allow "write" actions on networkRuleCollections |
| Microsoft.Network/azureFirewalls/applicationRuleCollections/write | NotAction | Allow "write" actions on applicationRuleCollections | Allow "write" actions on applicationRuleCollections |
| Microsoft.Network/azureFirewalls/natRuleCollections/write         | NotAction | Allow "write" actions on natRuleCollections | Allow "write" actions on natRuleCollections |
| Microsoft.Network/firewallPolicies/ruleGroups/write               | NotAction | Allow "write" actions on ruleGroups | Allow "write" actions on ruleGroups |
| Microsoft.Network/virtualHubs/write                               | NotAction | Allow "write" actions on virtualHubs | Allow "write" actions on virtualHubs |
| Microsoft.Network/virtualWans/virtualHubs/read                    | NotAction | Allow "read" actions on virtualHubs | Allow "read" actions on virtualHubs |
| Microsoft.Network/virtualWans/join/action                         | NotAction | Allow "join" actions on virtualWans | Allow "join" actions on virtualWans |

#### Enclave "General" maintenance mode

Enclave Deny Assignment: `Allow Dataplane Actions`

| Operation | Action Type | Explanation: maintenance mode principals | Explanation: All non-maintenance mode principals |
|-------------------------------------------------------|--|----------|----------|
| *	                                                    | Action | Deny all actions except specified in this table | Deny all actions except specified in this table |
| */read                                                | NotAction | Allow "read" actions on all resources | Allow "read" actions on all resources |
| Microsoft.Insights/alertRules/*                       | NotAction | Allow all actions on "alertRules" | Allow all actions on "alertRules" |
| Microsoft.Resources/deployments/*                     | NotAction | Allow all actions on "deployments" | Allow all actions on "deployments" |
| Microsoft.Support/*                                   | NotAction | Allow all actions on "Support" | Allow all actions on "Support" |
| Microsoft.Network/privateDnsZones/*                   | NotAction | Allow all actions on "privateDnsZones" | Allow all actions on "privateDnsZones" |
| Microsoft.Network/privateDnsOperationResults/*        | NotAction | Allow all actions on "privateDnsOperationResults" | Allow all actions on "privateDnsOperationResults" |
| Microsoft.Network/privateDnsOperationStatuses/*       | NotAction | Allow all actions on "privateDnsOperationStatuses" | Allow all actions on "privateDnsOperationStatuses" |
| Microsoft.Network/virtualNetworks/join/action         | NotAction | Allow this action | Allow this action |
| Microsoft.Network/virtualNetworks/subnets/join/action | NotAction | Allow this action | Allow this action |
| Microsoft.Authorization/policyExemptions/*            | NotAction | Allow all actions on "policyExemptions" | Allow all actions on "policyExemptions" |

### "Advanced" maintenance mode
When `Advanced` maintenance mode is enabled, the maintenance mode `principals` (for example, users or groups) are excluded from the `Deny All` and the `Allow Dataplace Actions` deny assignments for the community or enclave managed resource group. This allows the users identified in the maintenance mode principals to perform that actions that would otherwise be blocked by the `Deny All` and the `Allow Dataplace Actions` deny assignments. A user may still be limited by their assigned roles.

Deny Assignment: `Deny All` (the same for both communities and enclaves)

| Operation | Action Type | Explanation: maintenance mode principals | Explanation: All non-maintenance mode principals |
|----------------------------|--|----------|----------|
| *	                         | Action | Allowed | Deny all actions except specified in this table |
| */read                     | NotAction | Allowed | Allow "read" actions on all resources |
| Microsoft.Resources/tags/* | NotAction | Allowed | Allow "tags" actions on all resources |

#### Community "Advanced" maintenance mode

Community Deny Assignment: `Allow Dataplane Actions`

| Operation | Action Type | Explanation: maintenance mode principals | Explanation: All non-maintenance mode principals |
|-------------------------------------------------------------------|--|----------|----------|
| *                                                                 | Action    | Allowed | Deny all actions except specified in this table |
| */read                                                            | NotAction | Allowed | Allow "read" actions on all resources |
| Microsoft.Insights/alertRules/*                                   | NotAction | Allowed | Allow all actions on "alertRules" |
| Microsoft.Support/*                                               | NotAction | Allowed | Allow all actions on "Support" |
| Microsoft.Resources/tags/*                                        | NotAction | Allowed | Allow "tags" actions on all resources |
| Microsoft.Network/azureFirewalls/networkRuleCollections/write     | NotAction | Allowed | Allow "write" actions on networkRuleCollections |
| Microsoft.Network/azureFirewalls/applicationRuleCollections/write | NotAction | Allowed | Allow "write" actions on applicationRuleCollections |
| Microsoft.Network/azureFirewalls/natRuleCollections/write         | NotAction | Allowed | Allow "write" actions on natRuleCollections |
| Microsoft.Network/firewallPolicies/ruleGroups/write               | NotAction | Allowed | Allow "write" actions on ruleGroups |
| Microsoft.Network/virtualHubs/write                               | NotAction | Allowed | Allow "write" actions on virtualHubs |
| Microsoft.Network/virtualWans/virtualHubs/read                    | NotAction | Allowed | Allow "read" actions on virtualHubs |
| Microsoft.Network/virtualWans/join/action                         | NotAction | Allowed | Allow "join" actions on virtualWans |

#### Enclave "Advanced" maintenance mode

Enclave Deny Assignment: `Allow Dataplane Actions`

| Operation | Action Type | Explanation: maintenance mode principals | Explanation: All non-maintenance mode principals |
|-------------------------------------------------------|--|----------|----------|
| *	                                                    | Action | Allowed | Deny all actions except specified in this table |
| */read                                                | NotAction | Allowed | Allow "read" actions on all resources |
| Microsoft.Insights/alertRules/*                       | NotAction | Allowed | Allow all actions on "alertRules" |
| Microsoft.Resources/deployments/*                     | NotAction | Allowed | Allow all actions on "deployments" |
| Microsoft.Support/*                                   | NotAction | Allowed | Allow all actions on "Support" |
| Microsoft.Network/privateDnsZones/*                   | NotAction | Allowed | Allow all actions on "privateDnsZones" |
| Microsoft.Network/privateDnsOperationResults/*        | NotAction | Allowed | Allow all actions on "privateDnsOperationResults" |
| Microsoft.Network/privateDnsOperationStatuses/*       | NotAction | Allowed | Allow all actions on "privateDnsOperationStatuses" |
| Microsoft.Network/virtualNetworks/join/action         | NotAction | Allowed | Allow this action |
| Microsoft.Network/virtualNetworks/subnets/join/action | NotAction | Allowed | Allow this action |
| Microsoft.Authorization/policyExemptions/*            | NotAction | Allowed| Allow all actions on "policyExemptions" |
