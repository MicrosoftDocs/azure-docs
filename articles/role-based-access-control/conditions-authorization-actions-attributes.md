---
title: Authorization actions and attributes (preview)
description: Supported actions and attributes for Azure role assignment conditions and Azure attribute-based access control (Azure ABAC) in authorization
services: active-directory
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.subservice: conditions
ms.topic: conceptual
ms.workload: identity
ms.date: 09/20/2023
ms.author: rolyon

#Customer intent: As a dev, devops, or it admin, I want to 
---

# Authorization actions and attributes (preview)

> [!IMPORTANT]
> Delegating Azure role assignments with conditions is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Authorization actions

This section lists the supported authorization actions you can target for conditions.

### Create or update role assignments

> [!div class="mx-tdCol2BreakAll"]
> | Property | Value |
> | --- | --- |
> | **Display name** | Create or update role assignments |
> | **Description** | Control plane action for creating role assignments |
> | **Action** | `Microsoft.Authorization/roleAssignments/write` |
> | **Resource attributes** |  |
> | **Request attributes** | [Role definition ID](#role-definition-id)<br/>[Principal ID](#principal-id)<br/>[Principal type](#principal-type) |
> | **Examples** | `!(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})`<br/>[Example: Constrain roles](delegate-role-assignments-examples.md#example-constrain-roles) |

### Delete a role assignment

> [!div class="mx-tdCol2BreakAll"]
> | Property | Value |
> | --- | --- |
> | **Display name** | Delete a role assignment |
> | **Description** | Control plane action for deleting role assignments |
> | **Action** | `Microsoft.Authorization/roleAssignments/delete` |
> | **Resource attributes** | [Role definition ID](#role-definition-id)<br/>[Principal ID](#principal-id)<br/>[Principal type](#principal-type) |
> | **Request attributes** |  |
> | **Examples** | `!(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})`<br/>[Example: Constrain roles](delegate-role-assignments-examples.md#example-constrain-roles) |

## Authorization attributes

This section lists the authorization attributes you can use in your condition expressions depending on the action you target. If you select multiple actions for a single condition, there might be fewer attributes to choose from for your condition because the attributes must be available across the selected actions.

### Role definition ID

> [!div class="mx-tdCol2BreakAll"]
> | Property | Value |
> | --- | --- |
> | **Display name** | Role definition ID |
> | **Description** | The role definition ID used in the role assignment |
> | **Attribute** | `Microsoft.Authorization/roleAssignments:RoleDefinitionId` |
> | **Attribute source** | Request<br/>Resource |
> | **Attribute type** | GUID |
> | **Operators** | [GuidEquals](conditions-format.md#guid-comparison-operators)<br/>[GuidNotEquals](conditions-format.md#guid-comparison-operators)<br/>[ForAnyOfAnyValues:GuidEquals](conditions-format.md#foranyofanyvalues)<br/>[ForAnyOfAnyValues:GuidNotEquals](conditions-format.md#foranyofanyvalues) |
> | **Examples** | `@Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {b24988ac-6180-42a0-ab88-20f7382dd24c, acdd72a7-3385-48ef-bd42-f606fba81ae7}`<br/>[Example: Constrain roles](delegate-role-assignments-examples.md#example-constrain-roles) |

### Principal ID

> [!div class="mx-tdCol2BreakAll"]
> | Property | Value |
> | --- | --- |
> | **Display name** | Principal ID |
> | **Description** | The principal ID assigned to the role. This maps to the ID inside the Active Directory. It can point to a user, service principal, or security group |
> | **Attribute** | `Microsoft.Authorization/roleAssignments:PrincipalId` |
> | **Attribute source** | Request<br/>Resource |
> | **Attribute type** | GUID |
> | **Operators** | [GuidEquals](conditions-format.md#guid-comparison-operators)<br/>[GuidNotEquals](conditions-format.md#guid-comparison-operators)<br/>[ForAnyOfAnyValues:GuidEquals](conditions-format.md#foranyofanyvalues)<br/>[ForAnyOfAnyValues:GuidNotEquals](conditions-format.md#foranyofanyvalues) |
> | **Examples** | `@Request[Microsoft.Authorization/roleAssignments:PrincipalId] ForAnyOfAnyValues:GuidEquals {28c35fea-2099-4cf5-8ad9-473547bc9423, 86951b8b-723a-407b-a74a-1bca3f0c95d0}`<br/>[Example: Constrain roles and specific groups](delegate-role-assignments-examples.md#example-constrain-roles-and-specific-groups) |

### Principal type

> [!div class="mx-tdCol2BreakAll"]
> | Property | Value |
> | --- | --- |
> | **Display name** | Principal type |
> | **Description** | Principal type represents a user, group, service principal, or managed identity that is requesting access to Azure resources. You can assign a role to any of these security principals |
> | **Attribute** | `Microsoft.Authorization/roleAssignments:PrincipalType` |
> | **Attribute source** | Request<br/>Resource |
> | **Attribute type** | STRING |
> | **Values** | User<br/>ServicePrincipal<br/>Group |
> | **Operators** | [StringEqualsIgnoreCase](conditions-format.md#stringequals)<br/>[StringNotEqualsIgnoreCase](conditions-format.md#stringnotequals)<br/>[ForAnyOfAnyValues:StringEqualsIgnoreCase](conditions-format.md#foranyofanyvalues)<br/>[ForAnyOfAnyValues:StringNotEqualsIgnoreCase](conditions-format.md#foranyofanyvalues) |
> | **Examples** | `@Request[Microsoft.Authorization/roleAssignments:PrincipalType] ForAnyOfAnyValues:StringEqualsIgnoreCase {'User', 'Group'}`<br/>[Example: Constrain roles and principal types](delegate-role-assignments-examples.md#example-constrain-roles-and-principal-types) |

## Next steps

- [Examples to delegate Azure role assignments with conditions (preview)](delegate-role-assignments-examples.md)
- [Delegate the Azure role assignment task to others with conditions (preview)](delegate-role-assignments-portal.md)
