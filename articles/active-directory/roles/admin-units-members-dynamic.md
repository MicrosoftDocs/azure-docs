---
title: Manage users or devices for an administrative unit with dynamic membership rules (Preview) - Azure Active Directory
description: Manage users or devices for an administrative unit with dynamic membership rules (Preview) in Azure Active Directory
services: active-directory
documentationcenter: ''
author: rolyon
manager: karenhoran
ms.service: active-directory
ms.topic: how-to
ms.subservice: roles
ms.workload: identity
ms.date: 01/18/2022
ms.author: rolyon
ms.reviewer: anandy
ms.custom: oldportal;it-pro;
ms.collection: M365-identity-device-management
---

# Manage users or devices for an administrative unit with dynamic membership rules (Preview)

> [!IMPORTANT]
> Dynamic membership rules for administrative units are currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

You can add or remove users or devices for administrative units manually. With this preview, you can add or remove users or devices for administrative units dynamically using rules. This article describes how to create administrative units with dynamic membership rules using the Azure portal, PowerShell, or Microsoft Graph API.

Although administrative units with members assigned manually support multiple object types, such as user, group, and devices, it is currently not possible to create an administrative unit with dynamic membership rules that includes more than one object type. For example, you can create administrative units with dynamic membership rules for users or devices, but not both. Administrative units with dynamic membership rules for groups are currently not supported.

## Prerequisites

- Azure AD Premium P1 or P2 license for each administrative unit administrator
- Azure AD Premium P1 or P2 license for every administrative unit member
- Azure AD Free licenses for administrative unit members
- Privileged Role Administrator or Global Administrator
- AzureADPreview module when using PowerShell
- Admin consent when using Graph explorer for Microsoft Graph API

For more information, see [Prerequisites to use PowerShell or Graph Explorer](prerequisites.md).

## Add dynamic membership rules

Follow these steps to create administrative units with dynamic membership rules for users or devices.

### Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com) or [Azure AD admin center](https://aad.portal.azure.com).

1. Select **Azure Active Directory**.

1. Select **Administrative units** and then select the administrative unit that you want to add users or devices to.

1. Select **Properties**.

1. In the **Membership type** list, select **Dynamic User** or **Dynamic Device**, depending on the type of rule you want to add.

    ![Screenshot of an administrative unit Properties page with Membership type list displayed.](./media/admin-units-members-dynamic/admin-unit-properties.png)
    
1. Select **Add dynamic query**.

1. Use the rule builder to specify the dynamic membership rule. For more information, see [Rule builder in the Azure portal](../enterprise-users/groups-dynamic-membership.md#rule-builder-in-the-azure-portal).

    ![Screenshot of Dynamic membership rules page showing rule builder with property, operator, and value.](./media/admin-units-members-dynamic/dynamic-membership-rules-builder.png)

1. When finished, select **Save** to save the dynamic membership rule.

1. On the **Properties** page, select **Save** to save the membership type and query.

    The following message is displayed:

    After changing the administrative unit type, the existing membership may change based on the dynamic membership rule you provide.

1. Select **Yes** to continue.

### PowerShell

1. Create a dynamic membership rule using the rule builder and then copy the syntax. For more information, see [Rule builder in the Azure portal](../enterprise-users/groups-dynamic-membership.md#rule-builder-in-the-azure-portal).

1. Use the [Connect-AzureAD](/powershell/module/azuread/connect-azuread) command to connect with Azure Active Directory with a user that has been assigned the Privileged Role Administrator or Global Administrator role.

    ```powershell
    # Connect to Azure AD
    Connect-AzureAD
    ```
  
1. Use the [New-AzureADMSAdministrativeUnit](/powershell/module/azuread/new-azureadmsadministrativeunit) command to create a new administrative unit with a dynamic membership rule using the following parameters:

    - `MembershipType`: `Dynamic` or `Assigned`
    - `MembershipRule`: Dynamic membership rule you created in a previous step
    - `MembershipRuleProcessingState`: `On` or `Paused`
    
    ```powershell
    # Create an administrative unit for users in the United States
    $adminUnit = New-AzureADMSAdministrativeUnit -DisplayName "Example Admin Unit" -Description "Example Dynamic Membership Admin Unit" -MembershipType "Dynamic" -MembershipRuleProcessingState "On" -MembershipRule '(user.country -eq "United States")' 
    ```

### Microsoft Graph API

1. Create a dynamic membership rule using the rule builder and then copy the syntax. For more information, see [Rule builder in the Azure portal](../enterprise-users/groups-dynamic-membership.md#rule-builder-in-the-azure-portal).

1. Use the [Create administrativeUnit](/graph/api/administrativeunit-post-administrativeunits?view=graph-rest-beta&preserve-view=true) API to create a new administrative unit with a dynamic membership rule.

    The following shows an example of a dynamic membership rule that applies to all users.

    Request
    
    ```http
    POST https://graph.microsoft.com/beta/administrativeUnits
    ```
    
    Body
    
    ```http
    {
      "displayName": "displayName-value",
      "description": "description-value",
      "membershipType": "Dynamic",
      "membershipRule": "All Users",
      "membershipRuleProcessingState": "On"
    }
    ```
    
    The following shows an example of a dynamic membership rule that applies to Windows devices.

    Request
    
    ```http
    POST https://graph.microsoft.com/beta/administrativeUnits
    ```
    
    Body
    
    ```http
    {
      "displayName": "displayName-value",
      "description": "description-value",
      "membershipType": "Dynamic",
      "membershipRule": "(device.deviceOSType -eq \"Windows\")",
      "membershipRuleProcessingState": "On"
    }
    ```
    
## Edit dynamic membership rules

When an administrative unit has been configured for dynamic membership, the usual commands to add or remove members for the administrative unit are disabled as the dynamic membership engine retains the sole ownership of adding or removing members. To make changes to the membership, you can edit the dynamic membership rules.

### Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com) or [Azure AD admin center](https://aad.portal.azure.com).

1. Select **Azure Active Directory**.

1. Select **Administrative units** and then select the administrative unit that has the dynamic membership rules you want to edit.

1. Select **Membership rules** to edit the dynamic membership rules using the rule builder.

    ![Screenshot of an administrative unit with Membership rules and Dynamic membership rules options to open rule builder.](./media/admin-units-members-dynamic/membership-rules-options.png)

    You can also open the rule builder by selecting **Dynamic membership rules** in the left navigation.

1. When finished, select **Save** to save the dynamic membership rule changes.

### PowerShell

Use the [Set-AzureADMSAdministrativeUnit](/powershell/module/azuread/set-azureadmsadministrativeunit) command to edit the dynamic membership rule.
 
```powershell
# Set a new dynamic membership rule for an administrative unit
Set-AzureADMSAdministrativeUnit -Id $adminUnit.Id -MembershipRule '(user.country -eq "Germany")'
```

### Microsoft Graph API

Use the [Update administrativeUnit](/graph/api/administrativeunit-update?view=graph-rest-beta&preserve-view=true) API to edit the dynamic membership rule.

Request

```http
PATCH https://graph.microsoft.com/beta/administrativeUnits/{id}
```

Body

```http
{
  "membershipRule": "All Users"
}
```

## Change a dynamic administrative unit to assigned

Follow these steps to change an administrative unit with dynamic membership rules to an administrative unit where members are manually assigned.

### Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com) or [Azure AD admin center](https://aad.portal.azure.com).

1. Select **Azure Active Directory**.

1. Select **Administrative units** and then select the administrative unit that you want to change to assigned.

1. Select **Properties**.

1. In the **Membership type** list, select **Assigned**.

    ![Screenshot of an administrative unit Properties page with Membership type list displayed and Assigned selected.](./media/admin-units-members-dynamic/admin-unit-properties.png)

1. Select **Save** to save the membership type.

    The following message is displayed:

    After changing the administrative unit type, the dynamic rule will no longer be processed. Current administrative unit members will remain in the administrative unit and the administrative unit will have assigned membership.

1. Select **Yes** to continue.

    When the membership type setting is changed from dynamic to assigned, the current members remain intact in the administrative unit. Additionally, the ability to add groups to the administrative unit is enabled. 

### PowerShell

Use the [Set-AzureADMSAdministrativeUnit](/powershell/module/azuread/set-azureadmsadministrativeunit) command to change the membership type setting.
 
```powershell
# Change an administrative unit to assigned
Set-AzureADMSAdministrativeUnit -Id $adminUnit.Id -MembershipType "Assigned" -MembershipRuleProcessingState "Paused"
```

### Microsoft Graph API

Use the [Update administrativeUnit](/graph/api/administrativeunit-update?view=graph-rest-beta&preserve-view=true) API to change the membership type setting.

Request

```http
PATCH https://graph.microsoft.com/beta/administrativeUnits/{id}
```

Body

```http
{
  "membershipType": "Assigned"
}
```

## Frequently asked questions

**I just saved a dynamic membership rule for an administrative unit, but I don't see any users populated yet.**

The initial update of an administrative unit can take up to 5 minutes depending on your tenant size and the current Azure AD load.

**How can I add a single member to an administrative unit in addition to the current dynamic membership rule?**

To add a single user, add an appropriate expression with the `OR` query operator to the dynamic membership rule.

**I am a Global Administrator, but I can't add or remove a members for an administrative unit**

When an administrative unit has been configured for dynamic membership, you must edit the dynamic membership rules to change membership.

**How many administrative units with dynamic membership rules can I create in a tenant?**

For this preview, the total number of dynamic groups and dynamic administrative units combined cannot exceed 5,000.

**Is there a limit to the number of characters in a dynamic membership rule?**

Yes. 3,072 characters.

**Can I create administrative units with dynamic membership rules in the Microsoft 365 admin center?**

No.

## Next steps

- [Assign Azure AD roles with administrative unit scope](admin-units-assign-roles.md)
- [Add users or groups to an administrative unit](admin-units-members-add.md)

