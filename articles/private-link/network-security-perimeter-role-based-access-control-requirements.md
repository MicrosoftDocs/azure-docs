---
title: Azure role-based access control permissions required for Azure Network Security Perimeter usage
description: Learn about the Azure role-based access control permissions required to use Azure Network Security Perimeter.
author: mbender-ms
ms.author: mbender
ms.service: azure-private-link
ms.custom:
  - ignite-2024
ms.topic: concept-article
ms.date: 11/04/2024
# customer intent: As a network administrator, I want to know the Azure role-based access control permissions required to use network security perimeter capabilities, so that I can assign the correct permissions to my team members.
---

# Azure role-based access control permissions required for Azure Network Security Perimeter usage

In this article, you learn about the Azure role-based access control (RBAC) permissions required to use [network security perimeter](./network-security-perimeter-concepts.md) capabilities. You learn about the actions required for network security perimeter, profile, network security perimeter access rule, diagnostic settings, association, and appendix capabilities.

## Azure role-based access control permissions

[Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md) enables you to assign only the specific actions to members of your organization that they require to complete their assigned responsibilities. To use network security perimeter  capabilities, the account you log into Azure with, must be assigned to the [Owner, Contributor, or Network contributor built-in roles](../role-based-access-control/built-in-roles.md), or assigned to a [custom role](../role-based-access-control/custom-roles.md) that is assigned the actions listed for each network security perimeter  capability in the sections that follow. To learn how to check roles assigned to a user for a subscription, see [List Azure role assignments using the Azure portal](../role-based-access-control/role-assignments-list-portal.yml). If you can't see the role assignments, contact the respective subscription admin. 

### Network security perimeter permissions 

| Action | Description |
| --- | --- |
| Microsoft.Network/networkSecurityPerimeters/read | Gets a network security perimeter  |
| Microsoft.Network/networkSecurityPerimeters/write | Creates or updates a network security perimeter  |
| Microsoft.Network/networkSecurityPerimeters/delete | Deletes a network security perimeter  |
| Microsoft.Network/locations/perimeterAssociableResourceTypes/read | Gets network security perimeter associable resources |


### Network security perimeter profile permissions

| Action | Description |
| --- | --- |
| Microsoft.Network/networkSecurityPerimeters/profiles/read | Gets a network security perimeter profile |
| Microsoft.Network/networkSecurityPerimeters/profiles/write | Creates or updates a network security perimeter profile |
| Microsoft.Network/networkSecurityPerimeters/profiles/delete | Deletes a network security perimeter profile |

### Network security perimeter access rule permissions

| Action | Description |
| --- | --- |
| Microsoft.Network/networkSecurityPerimeters/profiles/accessRules/read | Gets a network security perimeter access rule. |
| Microsoft.Network/networkSecurityPerimeters/profiles/accessRules/write | Creates or updates a network security perimeter access rule. |
| Microsoft.Network/networkSecurityPerimeters/profiles/accessRules/delete | Deletes a network security perimeter access rule. |
| Microsoft.Resources/subscriptions/joinPerimeterRule/action | User must have *microsoft.resources/subscriptions/joinperimeterrule/action* role over the subscription |

> [!NOTE]
> User must have *subscription contributor* role to create/update subscription-based access rule.

### Network security perimeter association permissions

| **Action** | **Description** |
| --- | --- |
| Microsoft.Network/networkSecurityPerimeters/resourceAssociations/read | Gets a network security perimeter resource association |
| Microsoft.Network/networkSecurityPerimeters/resourceAssociations/write | Creates or updates a network security perimeter resource association |
| Microsoft.Network/networkSecurityPerimeters/profiles/join/action | Joins a network security perimeter profile. Linked access check is performed while associating the resource |
| Microsoft.Network/networkSecurityPerimeters/resourceAssociations/delete | Deletes a network security perimeter resource association |

> [!NOTE]
> To create or update an association, the following permissions are required to exist:
>
> - *Microsoft.Network/networkSecurityPerimeters/resourceAssociations/write* is required at the network security perimeter resource.
> - *Microsoft.Network/networkSecurityPerimeters/profiles/join/action* is required on the profile.
> - *Microsoft.Network/networkSecurityPerimeters/joinPerimeter/action* is required on the respective PaaS resource.

## Next steps

> [!div class="nextstepaction"]
> [Create a network security perimeter in the Azure portal](./create-network-security-perimeter-portal.md)
