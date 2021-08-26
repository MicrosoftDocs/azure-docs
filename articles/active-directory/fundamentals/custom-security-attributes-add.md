---
title: Add or deactivate custom security attributes in Azure AD (Preview) - Azure Active Directory
description: Learn how to add new custom security attributes or deactivate custom security attributes in Azure Active Directory.
services: active-directory
author: rolyon
ms.author: rolyon
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: how-to
ms.date: 09/15/2021
ms.collection: M365-identity-device-management
---

# Add or deactivate custom security attributes in Azure AD (Preview)

> [!IMPORTANT]
> Custom security attributes are currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

To add or deactivate custom security attributes, you must have:

- Azure AD Premium P1 or P2 license
- An Azure AD role with the following permissions, such as Attribute Definition Administrator:

    - `microsoft.directory/attributeSets/allProperties/allTasks`
    - `microsoft.directory/customSecurityAttributeDefinitions/allProperties/allTasks`

    > [!IMPORTANT]
    > [Global Administrator](../roles/permissions-reference.md#global-administrator), [Global Reader](../roles/permissions-reference.md#global-reader), [Privileged Role Administrator](../roles/permissions-reference.md#privileged-role-administrator), and [User Administrator](../roles/permissions-reference.md#user-administrator) do not have permissions to read, filter, define, manage, or assign custom security attributes.
    
## Add a new custom security attribute

1. Sign in to the Azure portal.

1. Click Azure Active Directory.

1. In the left navigation menu, click Custom security attributes (Preview).

    If Custom security attributes (Preview) is disabled, make sure you are assigned a custom security attributes role. For more information, see Troubleshoot custom security attributes.

1. On the Custom security attributes page, find an existing custom security attribute set or click Add to add a new attribute set.

    A custom security attribute set is a group of related attributes. All custom security attributes must be part of a custom security attribute set. Custom security attribute sets cannot be renamed or deleted.

1. Click to open the selected custom security attribute set.
 
1. Click New attribute to add a new attribute to the custom security attribute set.

1. In the Attribute name box, enter a custom security attribute name.

    A custom security attribute name can be 32 characters long and include spaces and special characters. Once you've specified a name for a custom security attribute, you can't rename it.

1. In the Description box, enter an optional description.

    A description can be 128 characters long. If necessary, you can later change the description.

1. From the Data type list, select the data type for the custom security attribute.
    | Data type | Description |
    | --- | --- |
    | Boolean | A Boolean value that can be true, True, false, or False. |
    | Integer | A 32-bit integer. |
    | String | A string that can be X characters long. |
    
1. For Allow multiple values to be assigned, select Yes or No.

    Select Yes to allow multiple values to be assigned to this custom security attribute. Select No to only allow a single value to be assigned to this custom security attribute.

1. For Only allow predefined values to be assigned, select Yes or No.

    Select Yes to require that this custom security attribute be assigned values from a predefined values list. Select No to allow this custom security attribute to be assigned user-defined values or potentially predefined values.

    You add predefined values after you add the attribute. For more information, see [Edit a custom security attribute](#edit-a-custom-security-attribute).

1. When finished, click Add.

    The new custom security attribute appears in the list of custom security attributes.

1. If you want to include predefined values, follow the steps in the next section.

## Edit a custom security attribute

Once you have added a new custom security attribute, you can later edit some of the properties. Some properties are immutable and cannot be changed.

1. Sign in to the Azure portal.

1. Click Azure Active Directory.

1. Click Custom security attributes (Preview).

1. Click the custom security attribute set that includes the custom security attribute you want to edit.

1. In the list of custom security attributes, click the ellipsis for the custom security attribute you want to edit and then click Edit attribute.
  
1. Edit the properties that are enabled.
  
1. If Only allow predefined values to be assigned is Yes, click Add value to add predefined values. Click an existing predefined value to change the Is active? setting.

    An active value is available for assignment to objects. A value that is not active is defined, but not yet available for assignment.
  
## Deactivate a custom security attribute

Once you add a custom security attribute, you can't delete it. However, you can deactivate a custom security attribute.

1. Sign in to the Azure portal.

1. Click Azure Active Directory.

1. Click Custom security attributes (Preview).

1. Click the custom security attribute set that includes the custom security attribute you want to deactivate.

1. In the list of custom security attributes, add a check mark next to the custom security attribute you want to deactivate.

1. Click Deactivate attribute.
  
1. In the Deactivate attribute dialog that appears, click Yes.

    The custom security attribute is deactivated and moved to the Deactivated attributes list.

## Microsoft Graph API

To manage custom security attribute assignments in your Azure AD organization, you can also use the Microsoft Graph API. The following API calls can be made to manage assignments.

### Add a new custom security attribute

```http
POST  https://graph.microsoft.com/beta/directory/customSecurityAttributeDefinitions
{
    "name":"Project",
    "attributeSet":"Storage",
    "isCollection":true,
    "type":"String",
    "usePreDefinedValuesOnly": false,
    "isSearchable":true,
    "status":"available",
    "description":"Attribute description"
}
```

### Filter custom security attributes

```http
GET https://graph.microsoft.com/beta/directory/customSecurityAttributeDefinitions?$filter=name+eq+'Project1'%20and%20status+eq+'Available'
```

```http
GET https://graph.microsoft.com/beta/directory/customSecurityAttributeDefinitions?$filter=attributeSet+eq+'Storage'%20and%20status+eq+'Available'%20and%20type+eq+'String'
```

### Add predefined value

You can set the AllowedValues for custom security attributes that have usePreDefinedValuesOnly set to true.

```http
POST https://graph.microsoft.com/beta/directory/customSecurityAttributeDefinitions/Storage_Project1/allowedValues
{
    "id":"Value1",
    "isActive":"true"
}
```

### Deactivate a custom security attribute

```http
PATCH https://graph.microsoft.com/beta/directory/customSecurityAttributeDefinitions/Storage_Project1/allowedValues/Value1
{
    "isActive":"false"
}
```

## Frequently asked questions

**Can you delete custom security attribute definitions?**

No, you can't delete custom security attribute definitions. You can only [deactivate custom security attribute definitions](#deactivate-a-custom-security-attribute). Once you deactivate a custom security attribute, it can no longer be applied to the Azure AD objects. Custom security attribute assignments for the deactivated custom security attribute definition are not automatically removed. There is no limit to the number of deactivated custom security attributes. You can have 500 active custom security attribute definitions per tenant with 100 allowed predefined values per custom security attribute definition.

**Can you add predefined values when you add a new custom security attribute?**

Currently, you can only add predefined values after you defined the custom security attribute by using the [Edit attribute page](#edit-a-custom-security-attribute).

## Next steps

- [Manage access to custom security attributes in Azure AD](custom-security-attributes-manage.md)
- [Assign or remove custom security attributes for a user](../enterprise-users/users-custom-security-attributes.md)
- [Assign or remove custom security attributes for an application](../manage-apps/custom-security-attributes-apps.md)
