---
title: Assign or remove custom security attributes for an application (Preview) - Azure Active Directory
description: Assign or remove custom security attributes for an application that has been registered with your Azure Active Directory (Azure AD) tenant.
services: active-directory
author: rolyon
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 09/15/2021
ms.author: rolyon
---

# Assign or remove custom security attributes for an application (Preview)

> [!IMPORTANT]
> Custom security attributes are currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this article, you assign a custom security attribute to your application. Assigning a custom security attribute can be helpful if you want to query or filter your applications or to help determine who can get access.

## Prerequisites

To assign or remove custom security attributes for an application in your Azure AD tenant, you need:

- Azure AD Premium P1 or P2 license.
- An Azure AD role with the following permissions, such as Attribute Assignment Administrator:

    - `microsoft.directory/attributeSets/allProperties/read`
    - `microsoft.directory/customSecurityAttributeDefinitions/allProperties/read`
    - `microsoft.directory/servicePrincipals/customSecurityAttributes/read`
    - `microsoft.directory/servicePrincipals/customSecurityAttributes/update`

    > [!IMPORTANT]
    > [Global Administrator](../roles/permissions-reference.md#global-administrator), [Global Reader](../roles/permissions-reference.md#global-reader), [Privileged Role Administrator](../roles/permissions-reference.md#privileged-role-administrator), and [User Administrator](../roles/permissions-reference.md#user-administrator) do not have permissions to read, filter, define, manage, or assign custom security attributes.
- [AzureADPreview](https://www.powershellgallery.com/packages/AzureADPreview) version 2.0.2.138 or later when using PowerShell

## Assign custom security attributes to an application

1. Sign in to the Azure portal.

1. Make sure that you have existing custom security attributes. For more information, see [Add or deactivate custom security attributes in Azure AD](../fundamentals/custom-security-attributes-add.md).

1. Select Enterprise applications. Then find and select the application you want to add a custom security attribute to.

1. In the Manage section, select Custom attributes (preview).
  
1. Select Assign attributes.

1. Select a custom security attribute set and a custom security attribute.
  
1. Select Add values to open Attribute values pane and add values.

    Depending on the properties of the custom security attribute, you can add on more values.
  
1. When finished adding values, select Done.

1. To assign the custom security attribute to the application, select Save.

## Update custom security attribute assignment values for an application

1. Sign in to the Azure portal.

1. Select Azure Active Directory and then select Enterprise applications.

1. Find and select the application that has a custom security attribute assignment value you want to update.

1. In the Manage section, select Custom attributes (preview).

1. Find the custom security attribute assignment value you want to update.

    Once you have assigned a custom security attribute to an application, you can only change the value of the custom security attribute. You can't change other properties of the custom security attribute, such as custom security attribute set or custom security attribute name.
1. Depending on the properties of the selected custom security attribute, you can update a single value, select a value from a predefined list, or update multiple values.

    - For freeform, single-valued custom security attributes, update the value in the Assigned values box.
    - For predefined custom security attribute values, select a value from the Assigned values list.
    - For multi-valued custom security attributes, select &lt;number&gt; values to open the Attribute values pane and update your values. When finished updating values, select Done.

1. When finished updating all your custom security attribute assignment values, select Save.

## Remove custom security attribute assignments from applications

1. Sign in to the Azure portal.

1. Select Azure Active Directory and then select Enterprise application.

1. Find and select the application that has the custom security attribute assignments you want to remove.

1. In the Manage section, select Custom attributes (preview).

1. Add check marks next to all the custom security attribute assignments you want to remove.

    Once you have assigned a custom security attribute to an application, you can only change the value of the custom security attribute. You can't change other properties of the custom security attribute, such as custom security attribute set or custom security attribute name.

1. Select Remove assignment.

## PowerShell

To manage custom security attribute assignments for applications in your Azure AD organization, you can use PowerShell. The following commands can be used to manage assignments.

### List custom security attribute assignments for an application/service principal

```powershell
Get-AzureADMSServicePrincipal -Select CustomSecurityAttributes
Get-AzureADMSServicePrincipal -Id 7d194b0c-bf17-40ff-9f7f-4b671de8dc20  -Select "CustomSecurityAttributes, Id"
```

### Assign a custom security attribute with a multi-string value to an application/service principal

```powershell
$attributes = @{
    testAttributeSet1 = @{
        "@odata.type" = "#Microsoft.DirectoryServices.CustomSecurityAttributeValue"
        "testAttribute@odata.type" = "#Collection(String)"
        testAttribute = @("Value3","Value1")
    }
}
Set-AzureADMSServicePrincipal -Id 7d194b0c-bf17-40ff-9f7f-4b671de8dc20 -CustomSecurityAttributes $attributes
```

### Update a custom security attribute with a multi-string value for an application/service principal

```powershell
$attributesUpdate = @{
    testAttributeSet1 = @{
        "@odata.type" = "#Microsoft.DirectoryServices.CustomSecurityAttributeValue"
        "testAttribute@odata.type" = "#Collection(String)"
        testAttribute = @("Value5")
    }
}
Set-AzureADMSServicePrincipal -Id 7d194b0c-bf17-40ff-9f7f-4b671de8dc20 -CustomSecurityAttributes $attributesUpdate 
```

## Frequently asked questions

**Can I filter the custom security attributes assigned to application from the All applications list?**

No, viewing, search, or filtering the list of assigned custom security attributes from the All applications list is not supported.

## Next steps

- [Add or deactivate custom security attributes in Azure AD](../fundamentals/custom-security-attributes-add.md)
- [Assign or remove custom security attributes for a user](../enterprise-users/users-custom-security-attributes.md)
- [Troubleshoot custom security attributes in Azure AD](../fundamentals/custom-security-attributes-troubleshoot.md)
