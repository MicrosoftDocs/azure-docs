---
title: Azure role-based access control permissions required for Azure Network Security Perimeter usage
description: Learn about the Azure role-based access control permissions required to use Azure Network Security Perimeter.
author: mbender-ms
ms.author: mbender
ms.service: azure-private-link
ms.topic: conceptual
ms.date: 09/16/2024
# customer intent: As a network administrator, I want to know the Azure role-based access control permissions required to use network security perimeter capabilities, so that I can assign the correct permissions to my team members.
---

# Azure role-based access control permissions required for Azure Network Security Perimeter usage

In this article, you learn about the Azure role-based access control permissions required to use [network security perimeter](./network-security-perimeter-concepts.md) capabilities. You learn about the actions required for network security perimeter, profile, network security perimeter access rule, diagnostic settings, association, and appendix capabilities.

## Azure role-based access control permissions

[Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md) enables you to assign only the specific actions to members of your organization that they require to complete their assigned responsibilities. To use network security perimeter  capabilities, the account you log into Azure with, must be assigned to the [Owner, Contributor, or Network contributor built-in roles](../role-based-access-control/built-in-roles.md), or assigned to a [custom role](../role-based-access-control/custom-roles.md) that is assigned the actions listed for each network security perimeter  capability in the sections that follow. To learn how to check roles assigned to a user for a subscription, see [List Azure role assignments using the Azure portal](../role-based-access-control/role-assignments-list-portal.yml). If you can't see the role assignments, contact the respective subscription admin. 

### Network security perimeter permissions 

| Action | Description |
| --- | --- |
| Microsoft.Network/networkSecurityPerimeters/read | Gets a network security perimeter  |
| Microsoft.Network/networkSecurityPerimeters/write | Creates or updates a network security perimeter  |
| Microsoft.Network/networkSecurityPerimeters/delete | Deletes a network security perimeter  |
| Microsoft.Network/locations/queryNetworkSecurityPerimeter/action | Queries network security perimeter  by the perimeter guid |
| Microsoft.Network/locations/perimeterAssociableResourceTypes/read | Gets network security perimeter  associable resources |


### Network security perimeter profile permissions

| Action | Description |
| --- | --- |
| Microsoft.Network/networkSecurityPerimeters/profiles/read | Gets a Network security perimeter  Profile |
| Microsoft.Network/networkSecurityPerimeters/profiles/write | Creates or updates a Network security perimeter  Profile |
| Microsoft.Network/networkSecurityPerimeters/profiles/delete | Deletes a Network security perimeter  Profile |
| Microsoft.Network/networkSecurityPerimeters/profiles/checkMembers/action | Checks if members can be accessed or not |

### Network security perimeter access rule permissions

| Action | Description |
| --- | --- |
| Microsoft.Network/networkSecurityPerimeters/profiles/accessRules/read | Gets a network security perimeter access rule |
| Microsoft.Network/networkSecurityPerimeters/profiles/accessRules/write | Creates or updates a network security perimeter access rule |
| Microsoft.Network/networkSecurityPerimeters/profiles/accessRules/delete | Deletes a network security perimeter access rule |
| Microsoft.Resources/subscriptions/joinPerimeterRule/action | User must have `microsoft.resources/subscriptions/joinperimeterrule/action` role over the subscription |

> [!NOTE]
> User must have subscription contributor permission to create/update subscription-based access rule.

### Diagnostic settings permissions

| Action | Description |
| --- | --- |
| Microsoft.Network/networkSecurityPerimeters/profiles/diagnosticSettingsProxies/read | Gets a network security perimeter diagnostic settings proxy |

### Network security perimeter association permissions

| Action | Description |
| --- | --- |
| Microsoft.Network/networkSecurityPerimeters/resourceAssociations/read | Gets a network security perimeter resource association |
| Microsoft.Network/networkSecurityPerimeters/resourceAssociations/write | Creates or updates a network security perimeter resource association |
| Microsoft.Network/networkSecurityPerimeters/profiles/join/action | Joins a network security perimeter profile. Linked access check is performed while associating the resource |
| Microsoft.Network/networkSecurityPerimeters/resourceAssociations/delete | Deletes a network security perimeter resource association |
| Microsoft.Network/networkSecurityPerimeters/resourceAssociationProxies/read | Gets a network security perimeter resource association proxy |
| Microsoft.Network/networkSecurityPerimeters/resourceAssociationProxies/write | Creates or updates a network security perimeter resource association proxy |
| Microsoft.Network/networkSecurityPerimeters/resourceAssociationProxies/delete | Deletes a network security perimeter resource association proxy |

> [!NOTE]
> To create or update association, `Microsoft.Network/networkSecurityPerimeters/resourceAssociations/write`, `Microsoft.Network/networkSecurityPerimeters/profiles/join/action` and `joinPerimeter/action` on the respective private link resource needs to exist.

### Network security perimeter backing resource association permissions

| Action | Description |
| --- | --- |
| Microsoft.Network/networkSecurityPerimeters/backingResourceAssociations/read | Gets a network security perimeter backing resource association |
| Microsoft.Network/networkSecurityPerimeters/backingResourceAssociations/write | Creates or updates a network security perimeter backing resource association |
| Microsoft.Network/networkSecurityPerimeters/backingResourceAssociations/delete | Deletes a network security perimeter backing resource association |

## Next steps

> [!div class="nextstepaction"]
> [Create a network security perimeter in the Azure portal](./network-security-perimeter-collect-resource-logs.md)
