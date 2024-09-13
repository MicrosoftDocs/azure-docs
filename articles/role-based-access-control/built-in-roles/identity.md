---
title: Azure built-in roles for Identity - Azure RBAC
description: This article lists the Azure built-in roles for Azure role-based access control (Azure RBAC) in the Identity category. It lists Actions, NotActions, DataActions, and NotDataActions.
ms.service: role-based-access-control
ms.topic: reference
ms.workload: identity
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 04/25/2024
ms.custom: generated
---

# Azure built-in roles for Identity

This article lists the Azure built-in roles in the Identity category.


## Domain Services Contributor

Can manage Azure AD Domain Services and related network configurations

[Learn more](/entra/identity/domain-services/tutorial-create-instance)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/read | Gets or lists deployments. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/write | Creates or updates an deployment. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/delete | Deletes a deployment. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/cancel/action | Cancels a deployment. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/validate/action | Validates an deployment. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/whatIf/action | Predicts template deployment changes. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/exportTemplate/action | Export template for a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/operations/read | Gets or lists deployment operations. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/operationstatuses/read | Gets or lists deployment operation statuses. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Write | Create or update a classic metric alert |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Delete | Delete a classic metric alert |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Read | Read a classic metric alert |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Activated/Action | Classic metric alert activated |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Resolved/Action | Classic metric alert resolved |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Throttled/Action | Classic metric alert rule throttled |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Incidents/Read | Read a classic metric alert incident |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/Logs/Read | Reading data from all your logs |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/Metrics/Read | Read metrics |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/DiagnosticSettings/* | Creates, updates, or reads the diagnostic setting for Analysis Server |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/DiagnosticSettingsCategories/Read | Read diagnostic settings categories |
> | [Microsoft.AAD](../permissions/identity.md#microsoftaad)/register/action | Register Domain Service |
> | [Microsoft.AAD](../permissions/identity.md#microsoftaad)/unregister/action | Unregister Domain Service |
> | [Microsoft.AAD](../permissions/identity.md#microsoftaad)/domainServices/* |  |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/register/action | Registers the subscription |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/unregister/action | Unregisters the subscription |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/read | Get the virtual network definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/write | Creates a virtual network or updates an existing virtual network |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/delete | Deletes a virtual network |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/peer/action | Peers a virtual network with another virtual network |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/join/action | Joins a virtual network. Not Alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/subnets/read | Gets a virtual network subnet definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/subnets/write | Creates a virtual network subnet or updates an existing virtual network subnet |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/subnets/delete | Deletes a virtual network subnet |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/subnets/join/action | Joins a virtual network. Not Alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/virtualNetworkPeerings/read | Gets a virtual network peering definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/virtualNetworkPeerings/write | Creates a virtual network peering or updates an existing virtual network peering |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/virtualNetworkPeerings/delete | Deletes a virtual network peering |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostic settings of Virtual Network |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/providers/Microsoft.Insights/metricDefinitions/read | Gets available metrics for the PingMesh |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/azureFirewalls/read | Get Azure Firewall |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/ddosProtectionPlans/read | Gets a DDoS Protection Plan |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/ddosProtectionPlans/join/action | Joins a DDoS Protection Plan. Not alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/read | Gets a load balancer definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/delete | Deletes a load balancer |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/*/read |  |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/backendAddressPools/join/action | Joins a load balancer backend address pool. Not Alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/inboundNatRules/join/action | Joins a load balancer inbound nat rule. Not Alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/natGateways/join/action | Joins a NAT Gateway |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/read | Gets a network interface definition.  |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/write | Creates a network interface or updates an existing network interface.  |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/delete | Deletes a network interface |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/join/action | Joins a Virtual Machine to a network interface. Not Alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkSecurityGroups/defaultSecurityRules/read | Gets a default security rule definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkSecurityGroups/read | Gets a network security group definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkSecurityGroups/write | Creates a network security group or updates an existing network security group |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkSecurityGroups/delete | Deletes a network security group |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkSecurityGroups/join/action | Joins a network security group. Not Alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkSecurityGroups/securityRules/read | Gets a security rule definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkSecurityGroups/securityRules/write | Creates a security rule or updates an existing security rule |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkSecurityGroups/securityRules/delete | Deletes a security rule |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/routeTables/read | Gets a route table definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/routeTables/write | Creates a route table or Updates an existing route table |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/routeTables/delete | Deletes a route table definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/routeTables/join/action | Joins a route table. Not Alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/routeTables/routes/read | Gets a route definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/routeTables/routes/write | Creates a route or Updates an existing route |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/routeTables/routes/delete | Deletes a route definition |
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
  "description": "Can manage Azure AD Domain Services and related network configurations",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/eeaeda52-9324-47f6-8069-5d5bade478b2",
  "name": "eeaeda52-9324-47f6-8069-5d5bade478b2",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/deployments/read",
        "Microsoft.Resources/deployments/write",
        "Microsoft.Resources/deployments/delete",
        "Microsoft.Resources/deployments/cancel/action",
        "Microsoft.Resources/deployments/validate/action",
        "Microsoft.Resources/deployments/whatIf/action",
        "Microsoft.Resources/deployments/exportTemplate/action",
        "Microsoft.Resources/deployments/operations/read",
        "Microsoft.Resources/deployments/operationstatuses/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Insights/AlertRules/Write",
        "Microsoft.Insights/AlertRules/Delete",
        "Microsoft.Insights/AlertRules/Read",
        "Microsoft.Insights/AlertRules/Activated/Action",
        "Microsoft.Insights/AlertRules/Resolved/Action",
        "Microsoft.Insights/AlertRules/Throttled/Action",
        "Microsoft.Insights/AlertRules/Incidents/Read",
        "Microsoft.Insights/Logs/Read",
        "Microsoft.Insights/Metrics/Read",
        "Microsoft.Insights/DiagnosticSettings/*",
        "Microsoft.Insights/DiagnosticSettingsCategories/Read",
        "Microsoft.AAD/register/action",
        "Microsoft.AAD/unregister/action",
        "Microsoft.AAD/domainServices/*",
        "Microsoft.Network/register/action",
        "Microsoft.Network/unregister/action",
        "Microsoft.Network/virtualNetworks/read",
        "Microsoft.Network/virtualNetworks/write",
        "Microsoft.Network/virtualNetworks/delete",
        "Microsoft.Network/virtualNetworks/peer/action",
        "Microsoft.Network/virtualNetworks/join/action",
        "Microsoft.Network/virtualNetworks/subnets/read",
        "Microsoft.Network/virtualNetworks/subnets/write",
        "Microsoft.Network/virtualNetworks/subnets/delete",
        "Microsoft.Network/virtualNetworks/subnets/join/action",
        "Microsoft.Network/virtualNetworks/virtualNetworkPeerings/read",
        "Microsoft.Network/virtualNetworks/virtualNetworkPeerings/write",
        "Microsoft.Network/virtualNetworks/virtualNetworkPeerings/delete",
        "Microsoft.Network/virtualNetworks/providers/Microsoft.Insights/diagnosticSettings/read",
        "Microsoft.Network/virtualNetworks/providers/Microsoft.Insights/metricDefinitions/read",
        "Microsoft.Network/azureFirewalls/read",
        "Microsoft.Network/ddosProtectionPlans/read",
        "Microsoft.Network/ddosProtectionPlans/join/action",
        "Microsoft.Network/loadBalancers/read",
        "Microsoft.Network/loadBalancers/delete",
        "Microsoft.Network/loadBalancers/*/read",
        "Microsoft.Network/loadBalancers/backendAddressPools/join/action",
        "Microsoft.Network/loadBalancers/inboundNatRules/join/action",
        "Microsoft.Network/natGateways/join/action",
        "Microsoft.Network/networkInterfaces/read",
        "Microsoft.Network/networkInterfaces/write",
        "Microsoft.Network/networkInterfaces/delete",
        "Microsoft.Network/networkInterfaces/join/action",
        "Microsoft.Network/networkSecurityGroups/defaultSecurityRules/read",
        "Microsoft.Network/networkSecurityGroups/read",
        "Microsoft.Network/networkSecurityGroups/write",
        "Microsoft.Network/networkSecurityGroups/delete",
        "Microsoft.Network/networkSecurityGroups/join/action",
        "Microsoft.Network/networkSecurityGroups/securityRules/read",
        "Microsoft.Network/networkSecurityGroups/securityRules/write",
        "Microsoft.Network/networkSecurityGroups/securityRules/delete",
        "Microsoft.Network/routeTables/read",
        "Microsoft.Network/routeTables/write",
        "Microsoft.Network/routeTables/delete",
        "Microsoft.Network/routeTables/join/action",
        "Microsoft.Network/routeTables/routes/read",
        "Microsoft.Network/routeTables/routes/write",
        "Microsoft.Network/routeTables/routes/delete"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Domain Services Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Domain Services Reader

Can view Azure AD Domain Services and related network configurations

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/read | Gets or lists deployments. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/operations/read | Gets or lists deployment operations. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/operationstatuses/read | Gets or lists deployment operation statuses. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Read | Read a classic metric alert |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AlertRules/Incidents/Read | Read a classic metric alert incident |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/Logs/Read | Reading data from all your logs |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/Metrics/read | Read metrics |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/DiagnosticSettings/read | Read a resource diagnostic setting |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/DiagnosticSettingsCategories/Read | Read diagnostic settings categories |
> | [Microsoft.AAD](../permissions/identity.md#microsoftaad)/domainServices/*/read |  |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/read | Get the virtual network definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/subnets/read | Gets a virtual network subnet definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/virtualNetworkPeerings/read | Gets a virtual network peering definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostic settings of Virtual Network |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/providers/Microsoft.Insights/metricDefinitions/read | Gets available metrics for the PingMesh |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/azureFirewalls/read | Get Azure Firewall |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/ddosProtectionPlans/read | Gets a DDoS Protection Plan |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/read | Gets a load balancer definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/*/read |  |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/natGateways/read | Gets a Nat Gateway Definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/read | Gets a network interface definition.  |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkSecurityGroups/defaultSecurityRules/read | Gets a default security rule definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkSecurityGroups/read | Gets a network security group definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkSecurityGroups/securityRules/read | Gets a security rule definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/routeTables/read | Gets a route table definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/routeTables/routes/read | Gets a route definition |
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
  "description": "Can view Azure AD Domain Services and related network configurations",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/361898ef-9ed1-48c2-849c-a832951106bb",
  "name": "361898ef-9ed1-48c2-849c-a832951106bb",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/deployments/read",
        "Microsoft.Resources/deployments/operations/read",
        "Microsoft.Resources/deployments/operationstatuses/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Insights/AlertRules/Read",
        "Microsoft.Insights/AlertRules/Incidents/Read",
        "Microsoft.Insights/Logs/Read",
        "Microsoft.Insights/Metrics/read",
        "Microsoft.Insights/DiagnosticSettings/read",
        "Microsoft.Insights/DiagnosticSettingsCategories/Read",
        "Microsoft.AAD/domainServices/*/read",
        "Microsoft.Network/virtualNetworks/read",
        "Microsoft.Network/virtualNetworks/subnets/read",
        "Microsoft.Network/virtualNetworks/virtualNetworkPeerings/read",
        "Microsoft.Network/virtualNetworks/providers/Microsoft.Insights/diagnosticSettings/read",
        "Microsoft.Network/virtualNetworks/providers/Microsoft.Insights/metricDefinitions/read",
        "Microsoft.Network/azureFirewalls/read",
        "Microsoft.Network/ddosProtectionPlans/read",
        "Microsoft.Network/loadBalancers/read",
        "Microsoft.Network/loadBalancers/*/read",
        "Microsoft.Network/natGateways/read",
        "Microsoft.Network/networkInterfaces/read",
        "Microsoft.Network/networkSecurityGroups/defaultSecurityRules/read",
        "Microsoft.Network/networkSecurityGroups/read",
        "Microsoft.Network/networkSecurityGroups/securityRules/read",
        "Microsoft.Network/routeTables/read",
        "Microsoft.Network/routeTables/routes/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Domain Services Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Managed Identity Contributor

Create, Read, Update, and Delete User Assigned Identity

[Learn more](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ManagedIdentity](../permissions/identity.md#microsoftmanagedidentity)/userAssignedIdentities/read | Gets an existing user assigned identity |
> | [Microsoft.ManagedIdentity](../permissions/identity.md#microsoftmanagedidentity)/userAssignedIdentities/write | Creates a new user assigned identity or updates the tags associated with an existing user assigned identity |
> | [Microsoft.ManagedIdentity](../permissions/identity.md#microsoftmanagedidentity)/userAssignedIdentities/delete | Deletes an existing user assigned identity |
> | [Microsoft.ManagedIdentity](../permissions/identity.md#microsoftmanagedidentity)/userAssignedIdentities/federatedIdentityCredentials/read | Get or list Federated Identity Credentials |
> | [Microsoft.ManagedIdentity](../permissions/identity.md#microsoftmanagedidentity)/userAssignedIdentities/federatedIdentityCredentials/write | Add or update a Federated Identity Credential |
> | [Microsoft.ManagedIdentity](../permissions/identity.md#microsoftmanagedidentity)/userAssignedIdentities/federatedIdentityCredentials/delete | Delete a Federated Identity Credential |
> | [Microsoft.ManagedIdentity](../permissions/identity.md#microsoftmanagedidentity)/userAssignedIdentities/revokeTokens/action | Revoked all the existing tokens on a user assigned identity |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
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
  "description": "Create, Read, Update, and Delete User Assigned Identity",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/e40ec5ca-96e0-45a2-b4ff-59039f2c2b59",
  "name": "e40ec5ca-96e0-45a2-b4ff-59039f2c2b59",
  "permissions": [
    {
      "actions": [
        "Microsoft.ManagedIdentity/userAssignedIdentities/read",
        "Microsoft.ManagedIdentity/userAssignedIdentities/write",
        "Microsoft.ManagedIdentity/userAssignedIdentities/delete",
        "Microsoft.ManagedIdentity/userAssignedIdentities/federatedIdentityCredentials/read",
        "Microsoft.ManagedIdentity/userAssignedIdentities/federatedIdentityCredentials/write",
        "Microsoft.ManagedIdentity/userAssignedIdentities/federatedIdentityCredentials/delete",
        "Microsoft.ManagedIdentity/userAssignedIdentities/revokeTokens/action",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Managed Identity Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Managed Identity Operator

Read and Assign User Assigned Identity

[Learn more](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ManagedIdentity](../permissions/identity.md#microsoftmanagedidentity)/userAssignedIdentities/*/read |  |
> | [Microsoft.ManagedIdentity](../permissions/identity.md#microsoftmanagedidentity)/userAssignedIdentities/*/assign/action |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
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
  "description": "Read and Assign User Assigned Identity",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/f1a07417-d97a-45cb-824c-7a7467783830",
  "name": "f1a07417-d97a-45cb-824c-7a7467783830",
  "permissions": [
    {
      "actions": [
        "Microsoft.ManagedIdentity/userAssignedIdentities/*/read",
        "Microsoft.ManagedIdentity/userAssignedIdentities/*/assign/action",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Managed Identity Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Next steps

- [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal)