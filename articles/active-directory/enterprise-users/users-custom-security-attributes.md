---
title: Assign or remove custom security attributes for a user (Preview) - Azure Active Directory
description: Assign or remove custom security attributes for a user in Azure Active Directory. 
services: active-directory 
author: rolyon
ms.author: rolyon
ms.date: 09/15/2021
ms.topic: how-to
ms.service: active-directory
ms.subservice: enterprise-users
ms.workload: identity
ms.custom: it-pro
ms.reviewer: 
ms.collection: M365-identity-device-management
---

# Assign or remove custom security attributes for a user (Preview)

> [!IMPORTANT]
> Custom security attributes are currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[Custom security attributes](../fundamentals/custom-security-attributes-overview.md) is a feature of Azure Active Directory (Azure AD) that enables you to define and assign your own custom security attributes (key-value pairs) to Azure AD objects. For example, you can assign custom security attribute to filter your employees or to help determine who gets access to resources. This article describes how to assign, update, remove, or filter custom security attributes for Azure AD users in your organization.

## Prerequisites

To assign or remove custom security attributes for a user in your Azure AD tenant, you need:

- Azure AD Premium P1 or P2 license
- [Attribute Assignment Administrator](../roles/permissions-reference.md#attribute-assignment-administrator)
- [AzureADPreview](https://www.powershellgallery.com/packages/AzureADPreview) version 2.0.2.138 or later when using PowerShell

> [!IMPORTANT]
> By default, [Global Administrator](../roles/permissions-reference.md#global-administrator) and other administrator roles do not have permissions to read, filter, define, manage, or assign custom security attributes.
    
## Assign custom security attributes to a user

1. Sign in to the [Azure portal](https://portal.azure.com) or [Azure AD admin center](https://aad.portal.azure.com).

1. Make sure that you have defined custom security attributes. For more information, see [Add or deactivate custom security attributes in Azure AD](../fundamentals/custom-security-attributes-add.md).

1. Select **Azure Active Directory** > **Users**.

1. Find and select the user you want to assign custom security attributes to.

1. In the Manage section, select **Custom security attributes (preview)**.

1. Select **Add assignment**.

1. In **Attribute set**, select an attribute set from the list.

1. In **Attribute name**, select a custom security attribute from the list.
  
1. Depending on the properties of the selected custom security attribute, you can enter a single value, select a value from a predefined list, or add multiple values.

    - For freeform, single-valued custom security attributes, enter a value in the **Assigned values** box.
    - For predefined custom security attribute values, select a value from the **Assigned values** list.
    - For multi-valued custom security attributes, select **Add values** to open the **Attribute values** pane and add your values. When finished adding values, select **Done**.

    ![Screenshot showing assigning a custom security attribute to a user.](./media/users-custom-security-attributes/users-attributes-assign.png)

1. When finished, select **Save** to assign the custom security attributes to the user.

## Update custom security attribute assignment values for a user

1. Sign in to the [Azure portal](https://portal.azure.com) or [Azure AD admin center](https://aad.portal.azure.com).

1. Select **Azure Active Directory** > **Users**.

1. Find and select the user that has a custom security attribute assignment value you want to update.

1. In the Manage section, select **Custom security attributes (preview)**.
  
1. Find the custom security attribute assignment value you want to update.

    Once you have assigned a custom security attribute to a user, you can only change the value of the custom security attribute. You can't change other properties of the custom security attribute, such as attribute set or attribute name.

1. Depending on the properties of the selected custom security attribute, you can update a single value, select a value from a predefined list, or update multiple values.

1. When finished, select **Save**.

## Remove custom security attribute assignments from a user

1. Sign in to the [Azure portal](https://portal.azure.com) or [Azure AD admin center](https://aad.portal.azure.com).

1. Select **Azure Active Directory** > **Users**.

1. Find and select the user that has the custom security attribute assignments you want to remove.

1. In the Manage section, select **Custom security attributes (preview)**.

1. Add check marks next to all the custom security attribute assignments you want to remove.

1. Select **Remove assignment**.

## Filter users based on custom security attributes

You can filter the list of custom security attributes assigned to users on the All users page.

1. Sign in to the [Azure portal](https://portal.azure.com) or [Azure AD admin center](https://aad.portal.azure.com).

1. Select **Azure Active Directory** > **Users**.

1. Select **Add filters** to open the Pick a field pane.

1. For **Filters**, select **Custom security attribute**.

1. Select your attribute set and attribute name.

1. For **Operator**, you can select equals (**==**), not equals (**!=**), or **starts with**.

1. For **Value**, enter or select a value.

    ![Screenshot showing a custom security attribute filter for users.](./media/users-custom-security-attributes/users-attributes-filter.png)

1. To apply the filter, select **Apply**.

## PowerShell

To manage custom security attribute assignments for users in your Azure AD organization, you can use PowerShell. The following commands can be used to manage assignments.

#### Get the custom security attribute assignments for a user

```powershell
$user1 = Get-AzureADMSUser -Id dbb22700-a7de-4372-ae78-0098ee60e55e -Select CustomSecurityAttributes
$user1.CustomSecurityAttributes
```

#### Assign a custom security attribute with a multi-string value to a user

For this example, the attribute set name is `Engineering` and the custom security attribute name is `Project`.

```powershell
$attributes = @{
    Engineering = @{
        "@odata.type" = "#Microsoft.DirectoryServices.CustomSecurityAttributeValue"
        "Project@odata.type" = "#Collection(String)"
        Project = @("Baker","Cascade")
    }
}
Set-AzureADMSUser -Id dbb22700-a7de-4372-ae78-0098ee60e55e -CustomSecurityAttributes $attributes
```

#### Update a custom security attribute with a multi-string value for a user

For this example, the attribute set name is `Engineering` and the custom security attribute name is `Project`.

```powershell
$attributesUpdate = @{
    Engineering = @{
        "@odata.type" = "#Microsoft.DirectoryServices.CustomSecurityAttributeValue"
        "Project@odata.type" = "#Collection(String)"
        Project = @("Alpine","Baker")
    }
}
Set-AzureADMSUser -Id dbb22700-a7de-4372-ae78-0098ee60e55e -CustomSecurityAttributes $attributesUpdate 
```

## Microsoft Graph API

To manage custom security attribute assignments for users in your Azure AD organization, you can use the Microsoft Graph API. The following API calls can be made to manage assignments.

#### Get the custom security attribute assignments for a user

```http
GET https://graph.microsoft.com/beta/users/{id}?$select=customSecurityAttributes
```

If there are no custom security attributes assigned to the user or if the calling principal does not have access, the response will look like:

```http
{
    "customSecurityAttributes": null
}
```

#### Assign a custom security attribute with a string value to a user

```http
PATCH https://graph.microsoft.com/beta/users/{id}
{
    "customSecurityAttributes":
    {
        "Engineering":
        {
            "@odata.type":"#Microsoft.DirectoryServices.CustomSecurityAttributeValue",
            "ProjectDate":"2022-10-01"
        }
    }
}
```

#### Assign a custom security attribute with a multi-string value to a user

```http
PATCH https://graph.microsoft.com/beta/users/{id}
{
    "customSecurityAttributes":
    {
        "Engineering":
        {
            "@odata.type":"#Microsoft.DirectoryServices.CustomSecurityAttributeValue",
            "Project@odata.type":"#Collection(String)",
            "Project":["Baker","Cascade"]
        }
    }
}
```

#### Assign a custom security attribute with an integer value to a user

```http
PATCH https://graph.microsoft.com/beta/users/{id}
{
    "customSecurityAttributes":
    {
        "Engineering":
        {
            "@odata.type":"#Microsoft.DirectoryServices.CustomSecurityAttributeValue",
            "NumVendors@odata.type":"#Int32",
            "NumVendors":4
        }
    }
}
```

#### Assign a custom security attribute with a multi-integer value to a user

```http
PATCH https://graph.microsoft.com/beta/users/{id}
{
    "customSecurityAttributes":
    {
        "Engineering":
        {
            "@odata.type":"#Microsoft.DirectoryServices.CustomSecurityAttributeValue",
            "CostCenter@odata.type":"#Collection(Int32)",
            "CostCenter":[1001,1003]
        }
    }
}
```

#### Assign a custom security attribute with a Boolean value to a user

```http
PATCH https://graph.microsoft.com/beta/users/{id}
{
    "customSecurityAttributes":
    {
        "Engineering":
        {
            "@odata.type":"#Microsoft.DirectoryServices.CustomSecurityAttributeValue",
            "Certification":true
        }
    }
}
```

#### Update a custom security attribute with an integer value for a user

```http
PATCH https://graph.microsoft.com/beta/users/{id}
{
    "customSecurityAttributes":
    {
        "Engineering":
        {
            "@odata.type":"#Microsoft.DirectoryServices.CustomSecurityAttributeValue",
            "NumVendors@odata.type":"#Int32",
            "NumVendors":8
        }
    }
}
```

#### Update a custom security attribute with a Boolean value for a user

```http
PATCH https://graph.microsoft.com/beta/users/{id}
{
    "customSecurityAttributes":
    {
        "Engineering":
        {
            "@odata.type":"#Microsoft.DirectoryServices.CustomSecurityAttributeValue",
            "Certification":false
        }
    }
}
```

#### Remove custom security attribute assignments from a user

To remove custom security attribute assignments, depending on the properties of the custom security attribute, you can either set the value to null or set it to an empty value.
For single-valued custom security attributes, set the value to null, similar to the following example:

```http
PATCH https://graph.microsoft.com/beta/users/{id}
{
    "customSecurityAttributes":
    {
        "Engineering":
        {
            "@odata.type":"#Microsoft.DirectoryServices.CustomSecurityAttributeValue",
            "ProjectDate":null
        }
    }
}
```

For multi-valued properties, you should use an empty collection to reset values, similar to the following example:

```http
PATCH https://graph.microsoft.com/beta/users/{id}
{
    "customSecurityAttributes":
    {
        "Engineering":
        {
            "@odata.type":"#Microsoft.DirectoryServices.CustomSecurityAttributeValue",
            "Project":[]
        }
    }
}
```

#### Filter all users with an attribute that equals a value

The following example, retrieves users with a `AppCountry` attribute in the `Marketing` attribute set that equals `Canada`. You must add `ConsistencyLevel: eventual` in the header. You must also include `$count=true` to ensure the request is routed correctly.

```http
GET https://graph.microsoft.com/beta/users?$count=true&$select=id,displayName,customSecurityAttributes&$filter=customSecurityAttributes/Marketing/AppCountry%20eq%20'Canada'
```

#### Filter all users with an attribute that starts with a value

The following example, retrieves users with an `EmployeeId` attribute in the `Marketing` attribute set that starts with `111`.You must add `ConsistencyLevel: eventual` in the header. You must also include `$count=true` to ensure the request is routed correctly.

```http
GET https://graph.microsoft.com/beta/users?$count=true&$select=id,displayName,customSecurityAttributes&$filter=startsWith(customSecurityAttributes/Marketing/EmployeeId,'111')
```

#### Filter all users with an attribute that does not equal a value

The following example, retrieves users with a `AppCountry` attribute in the `Marketing` attribute set that does not equal `Canada`. This query will also retrieve users that do not have the `AppCountry` attribute assigned. You must add `ConsistencyLevel: eventual` in the header. You must also include `$count=true` to ensure the request is routed correctly.

```http
GET https://graph.microsoft.com/beta/users?$count=true&$select=id,displayName,customSecurityAttributes&$filter=customSecurityAttributes/Marketing/AppCountry%20ne%20'Canada'
```

## Frequently asked questions

**Where are custom security attributes for users supported?**

Custom security attributes for users are supported in Azure portal, PowerShell, and Microsoft Graph APIs. Custom security attributes are not supported in My Apps or Microsoft 365 admin center.

**Who can view the custom security attributes assigned to a user?**

Only users that have been assigned the Attribute Assignment Administrator or Attribute Assignment Reader roles at tenant scope can view custom security attributes assigned to any users in the tenant. Users cannot view the custom security attributes assigned to their own profile or other users. Guests cannot view the custom security attributes regardless of the guest permissions set on the tenant.

**Do I need to create an app to use custom security attributes?**

No, custom security attributes can be assigned to user objects without requiring an application.

**Why do I keep getting an error trying to save custom security attribute assignments?**

You don't have permissions to assign custom security attributes to users. Make sure that you are assigned the Attribute Assignment Administrator role.

**Can I assign custom security attributes to guests?**

Yes, custom security attributes can be assigned to members or guests in your tenant.

**Can I assign custom security attributes to directory synced users?**

Yes, directory synced users from an on-premises Active Directory can be assigned custom security attributes.

**Are custom security attributes available for dynamic membership rules?**

No, custom security attributes assigned to users are not supported for configuring dynamic membership rules.

**Are custom security attributes the same as the custom attributes in B2C tenants?**

No, custom security attributes are not supported in B2C tenants and are not related to B2C features.

## Next steps

- [Add or deactivate custom security attributes in Azure AD](../fundamentals/custom-security-attributes-add.md)
- [Assign or remove custom security attributes for an application](../manage-apps/custom-security-attributes-apps.md)
- [Troubleshoot custom security attributes in Azure AD](../fundamentals/custom-security-attributes-troubleshoot.md)
