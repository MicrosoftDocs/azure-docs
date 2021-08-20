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

Custom security attributes is a feature of Azure Active Directory (Azure AD) that enables you to define and assign your own custom security attributes (key-value pairs) to Azure AD objects. For example, you can add a custom security attribute to the profiles of your employees and limit the visibility of the custom security attribute to other users. This article describes how to assign, update, or remove custom security attributes for Azure AD users in your organization.

## Prerequisites

To assign or remove custom security attributes for a user in your Azure AD tenant, you need:

- Azure AD Premium P1 or P2 license
- An Azure AD role with the following permissions, such as Attribute Assignment Administrator:

    - `microsoft.directory/attributeSets/allProperties/read`
    - `microsoft.directory/customSecurityAttributeDefinitions/allProperties/read`
    - `microsoft.directory/users/customSecurityAttributes/read`
    - `microsoft.directory/users/customSecurityAttributes/update`

## Assign custom security attributes to a user

1. Sign in to the Azure portal.

1. Make sure that you have defined custom security attributes. For more information, see Add or deactivate custom security attributes in Azure AD.

1. Select Azure Active Directory and then select Users.

1. Find and select the user you want to assign custom security attributes to.

1. In the Manage section, select Custom attributes (preview).

1. Select Add assignment.

1. In Attribute set, select a custom security attribute set from the list.

1. In Attribute name, select a custom security attribute from the list.
  
1. Depending on the properties of the selected custom security attribute, you can enter a single value, select a value from a predefined list, or add multiple values.

    - For freeform, single-valued custom security attributes, enter a value in the Assigned values box.
    - For predefined custom security attribute values, select a value from the Assigned values list.
    - For multi-valued custom security attributes, select Add values to open the Attribute values pane and add your values. When finished adding values, select Done.
      
1. When finished adding all your custom security attributes and values, select Save to assign the custom security attributes to the user.

## Update custom security attribute assignment values for a user

1. Sign in to the Azure portal.

1. Select Azure Active Directory and then select Users.

1. Find and select the user that has a custom security attribute assignment value you want to update.

1. In the Manage section, select Custom attributes (preview).
  
1. Find the custom security attribute assignment value you want to update.

    Once you have assigned a custom security attribute to a user, you can only change the value of the custom security attribute. You can't change other properties of the custom security attribute, such as custom security attribute set or custom security attribute name.

1. Depending on the properties of the selected custom security attribute, you can update a single value, select a value from a predefined list, or update multiple values.

    - For freeform, single-valued custom security attributes, update the value in the Assigned values box.
    - For predefined custom security attribute values, select a value from the Assigned values list.
    - For multi-valued custom security attributes, select &lt;number&gt; values to open the Attribute values pane and update your values. When finished updating values, select Done.

1. When finished updating all your custom security attribute assignment values, select Save.

## Remove custom security attribute assignments from a user

1. Sign in to the Azure portal.

1. Select Azure Active Directory and then select Users.

1. Find and select the user that has the custom security attribute assignments you want to remove.

1. In the Manage section, select Custom attributes (preview).

1. Add check marks next to all the custom security attribute assignments you want to remove.

1. Select Remove assignment.
  
1. When finished removing custom security attribute assignments, select Save.

## Search and filter custom security attribute assignments for a user

You can search and filter the list of custom security attributes assigned to a user from their profile page.
  
The search box supports a "starts with" search on the custom security attribute names and values assigned to this user. You can enter any custom security attributes into the search box, and the search automatically looks across all these properties to return any matching results of all custom security attributes assigned to this user.

Add filters supports filtering the list of all custom security attributes assigned to this user. You can currently filter the list of custom security attributes by the custom security attribute set. Select the custom security attribute set and enter the first few letters or the entire name of the custom security attribute set.

## Microsoft Graph API

To manage custom security attribute assignments for users in your Azure AD organization, you can also use the Microsoft Graph API. The following API calls can be made to manage assignments.

### List custom security attribute assignments for a user

```http
GET  https://graph.microsoft.com/beta/users/<id>?$select=customSecurityAttributes
```

If there are no custom security attributes assigned to the user or if the calling principal does not have access, the response will look like:

```http
{
    "customSecurityAttributes": null
}
```

### Assign a custom security attribute with a string value to a user

```http
PATCH  https://graph.microsoft.com/beta/users/<id>
{
    "customSecurityAttributes":
    {
        "Storage":
        {
            "@odata.type":"#Microsoft.DirectoryServices.CustomSecurityAttributeValue",
            "SingleProject":"String1"
        }
    }
}
```

A successful response is Success 200.

### Assign a custom security attribute with a multi-string value to a user

```http
PATCH  https://graph.microsoft.com/beta/users/<id>
{
    "customSecurityAttributes":
    {
        "Storage":
        {
            "@odata.type":"#Microsoft.DirectoryServices.CustomSecurityAttributeValue",
            "Project@odata.type":"#Collection(String)",
            "Project":["String1","String2","String3"]
        }
    }
}
```

A successful response is Success 200.

### Assign a custom security attribute with an integer value to a user

```http
PATCH  https://graph.microsoft.com/beta/users/<id>
{
    "customSecurityAttributes":
    {
        "Storage":
        {
            "@odata.type":"#Microsoft.DirectoryServices.CustomSecurityAttributeValue",
            "Project":12
        }
    }
}
```

A successful response is Success 200.

### Assign a custom security attribute with a multi-integer value to a user

```http
PATCH  https://graph.microsoft.com/beta/users/<id>
{
    "customSecurityAttributes":
    {
        "Storage":
        {
            "@odata.type":"#Microsoft.DirectoryServices.CustomSecurityAttributeValue",
            "Project@odata.type":"#Collection(Int32)",
            "Project":[12, 13]
        }
    }
}
```

A successful response is Success 200.

### Assign a custom security attribute with a Boolean value to a user

```http
PATCH  https://graph.microsoft.com/beta/users/<id>
{
    "customSecurityAttributes":
    {
        "Storage":
        {
            "@odata.type":"#Microsoft.DirectoryServices.CustomSecurityAttributeValue",
            "Project":true
        }
    }
}
```

A successful response is Success 200.

### Remove custom security attribute assignments from a user

To remove custom security attribute assignments, depending on the properties of the custom security attribute, you can either set the value to null or set it to an empty value.
For single-valued custom security attributes, set the value to null, similar to the below example:

```http
PATCH  https://graph.microsoft.com/beta/users/<id>
{
    "customSecurityAttributes":
    {
        "Storage":
        {
            "@odata.type":"#Microsoft.DirectoryServices.CustomSecurityAttributeValue",
            "ProjectSingle":null
        }
    }
}
```

For multi-valued properties, you should use an empty collection to reset values, similar to the below example:

```http
PATCH  https://graph.microsoft.com/beta/users/<id>
{
    "customSecurityAttributes":
    {
        "Storage":
        {
            "@odata.type":"#Microsoft.DirectoryServices.CustomSecurityAttributeValue",
            "ProjectBlock":[]
        }
    }
}
```

## Frequently asked questions

**Where are custom security attributes for users supported?**

Custom security attributes for users are supported in Azure portal, PowerShell, and Microsoft Graph APIs. Custom security attributes are not supported in My Apps or Microsoft 365 admin center.

**Who can view the custom security attributes assigned to a user?**

Currently, only Attribute Assignment Administrators can view custom security attributes assigned to any users in the tenant. Users cannot view the custom security attributes assigned to their own profile or other users. Guests cannot view the custom security attributes regardless of the guest permissions set on the tenant.

**Do I need to create an app to use custom security attributes?**

No, custom security attributes can be assigned to user objects without requiring an application.

**Why do I keep getting an error trying to save custom security attribute assignments?**

You don't have permissions to assign custom security attributes to users. Make sure that you are assigned the Attribute Assignment Administrator role.

**Can I assign custom security attributes to guests?**

Yes, custom security attributes can be assigned to members or guests in your tenant.

**Can I assign custom security attributes to directory synced users?**

No, directory synced users from an on-premises Active Directory can't be assigned custom security attributes. Directory synced users have a source of authority in Active Directory, so custom security attributes cannot be added to their profile and are not available for sync.

**Are custom security attributes available for dynamic membership rules?**

No, custom security attributes assigned to users are not supported yet for configuring dynamic membership rules.

**Are these custom security attributes the same as the custom attributes in B2C tenants?**

No, these custom security attributes are not supported in B2C tenants and are not related to B2C features.

**Can I filter the custom security attributes assigned to users from the All Users list?**

No, viewing, search, or filtering the list of assigned custom security attributes from the All Users list is not supported.

## Next steps

- [Add or deactivate custom security attributes in Azure AD](../fundamentals/custom-security-attributes-add.md)
- [Assign or remove custom security attributes for an application](../manage-apps/custom-security-attributes-apps.md)
- [Troubleshoot custom security attributes in Azure AD](../fundamentals/custom-security-attributes-troubleshoot.md)
