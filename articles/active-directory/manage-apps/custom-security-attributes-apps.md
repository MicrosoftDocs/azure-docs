---
title: Assign or remove custom security attributes for an application (Preview) - Azure Active Directory
description: Assign or remove custom security attributes for an application that has been registered with your Azure Active Directory (Azure AD) tenant.
services: active-directory
author: rolyon
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 02/03/2022
ms.author: rolyon
---

# Assign or remove custom security attributes for an application (Preview)

> [!IMPORTANT]
> Custom security attributes are currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[Custom security attributes](../fundamentals/custom-security-attributes-overview.md) in Azure Active Directory (Azure AD) are business-specific attributes (key-value pairs) that you can define and assign to Azure AD objects. For example, you can assign custom security attribute to filter your applications or to help determine who gets access. This article describes how to assign, update, remove, or filter custom security attributes for Azure AD enterprise applications.

## Prerequisites

To assign or remove custom security attributes for an application in your Azure AD tenant, you need:

- Azure AD Premium P1 or P2 license
- [Attribute Assignment Administrator](../roles/permissions-reference.md#attribute-assignment-administrator)
- [AzureADPreview](https://www.powershellgallery.com/packages/AzureADPreview) version 2.0.2.138 or later when using PowerShell

> [!IMPORTANT]
> By default, [Global Administrator](../roles/permissions-reference.md#global-administrator) and other administrator roles do not have permissions to read, define, or assign custom security attributes.

## Assign custom security attributes to an application

1. Sign in to the [Azure portal](https://portal.azure.com) or [Azure AD admin center](https://aad.portal.azure.com).

1. Make sure that you have existing custom security attributes. For more information, see [Add or deactivate custom security attributes in Azure AD](../fundamentals/custom-security-attributes-add.md).

1. Select **Azure Active Directory** > **Enterprise applications**. 

1. Find and select the application you want to add a custom security attribute to.

1. In the Manage section, select **Custom security attributes (preview)**.

1. Select **Add assignment**.

1. In **Attribute set**, select an attribute set from the list.

1. In **Attribute name**, select a custom security attribute from the list.
  
1. Depending on the properties of the selected custom security attribute, you can enter a single value, select a value from a predefined list, or add multiple values.

    - For freeform, single-valued custom security attributes, enter a value in the **Assigned values** box.
    - For predefined custom security attribute values, select a value from the **Assigned values** list.
    - For multi-valued custom security attributes, select **Add values** to open the **Attribute values** pane and add your values. When finished adding values, select **Done**.

    ![Screenshot showing assigning a custom security attribute to an application.](./media/custom-security-attributes-apps/apps-attributes-assign.png)

1. When finished, select **Save** to assign the custom security attributes to the application.

## Update custom security attribute assignment values for an application

1. Sign in to the [Azure portal](https://portal.azure.com) or [Azure AD admin center](https://aad.portal.azure.com).

1. Select **Azure Active Directory** > **Enterprise applications**.

1. Find and select the application that has a custom security attribute assignment value you want to update.

1. In the Manage section, select **Custom security attributes (preview)**.

1. Find the custom security attribute assignment value you want to update.

    Once you have assigned a custom security attribute to an application, you can only change the value of the custom security attribute. You can't change other properties of the custom security attribute, such as attribute set or custom security attribute name.

1. Depending on the properties of the selected custom security attribute, you can update a single value, select a value from a predefined list, or update multiple values.

1. When finished, select **Save**.

## Remove custom security attribute assignments from applications

1. Sign in to the [Azure portal](https://portal.azure.com) or [Azure AD admin center](https://aad.portal.azure.com).

1. Select **Azure Active Directory** > **Enterprise applications**.

1. Find and select the application that has the custom security attribute assignments you want to remove.

1. In the Manage section, select **Custom security attributes (preview)**.

1. Add check marks next to all the custom security attribute assignments you want to remove.

1. Select **Remove assignment**.

## Filter applications based on custom security attributes

You can filter the list of custom security attributes assigned to applications on the All applications page.

1. Sign in to the [Azure portal](https://portal.azure.com) or [Azure AD admin center](https://aad.portal.azure.com).

1. Select **Azure Active Directory** > **Enterprise applications**.

1. Select **Add filters** to open the Pick a field pane.

    If you don't see Add filters, click the banner to enable the Enterprise applications search preview.

1. For **Filters**, select **Custom security attribute**.

1. Select your attribute set and attribute name.

1. For **Operator**, you can select equals (**==**), not equals (**!=**), or **starts with**.

1. For **Value**, enter or select a value.

    ![Screenshot showing a custom security attribute filter for applications.](./media/custom-security-attributes-apps/apps-attributes-filter.png)

1. To apply the filter, select **Apply**.

## PowerShell

To manage custom security attribute assignments for applications in your Azure AD organization, you can use PowerShell. The following commands can be used to manage assignments.

#### Get the custom security attribute assignments for an application (service principal)

Use the [Get-AzureADMSServicePrincipal](/powershell/module/azuread/get-azureadmsserviceprincipal) command to get the custom security attribute assignments for an application (service principal).

```powershell
Get-AzureADMSServicePrincipal -Select CustomSecurityAttributes
Get-AzureADMSServicePrincipal -Id 7d194b0c-bf17-40ff-9f7f-4b671de8dc20  -Select "CustomSecurityAttributes, Id"
```

#### Assign a custom security attribute with a multi-string value to an application (service principal)

Use the [Set-AzureADMSServicePrincipal](/powershell/module/azuread/set-azureadmsserviceprincipal) command to assign a custom security attribute with a multi-string value to an application (service principal).

- Attribute set: `Engineering`
- Attribute: `Project`
- Attribute data type: Collection of Strings
- Attribute value: `("Baker","Cascade")`

```powershell
$attributes = @{
    Engineering = @{
        "@odata.type" = "#Microsoft.DirectoryServices.CustomSecurityAttributeValue"
        "Project@odata.type" = "#Collection(String)"
        Project = @("Baker","Cascade")
    }
}
Set-AzureADMSServicePrincipal -Id 7d194b0c-bf17-40ff-9f7f-4b671de8dc20 -CustomSecurityAttributes $attributes
```

#### Update a custom security attribute with a multi-string value for an application (service principal)

Use the [Set-AzureADMSServicePrincipal](/powershell/module/azuread/set-azureadmsserviceprincipal) command to update a custom security attribute with a multi-string value for an application (service principal).

- Attribute set: `Engineering`
- Attribute: `Project`
- Attribute data type: Collection of Strings
- Attribute value: `("Alpine","Baker")`

```powershell
$attributesUpdate = @{
    Engineering = @{
        "@odata.type" = "#Microsoft.DirectoryServices.CustomSecurityAttributeValue"
        "Project@odata.type" = "#Collection(String)"
        Project = @("Alpine","Baker")
    }
}
Set-AzureADMSServicePrincipal -Id 7d194b0c-bf17-40ff-9f7f-4b671de8dc20 -CustomSecurityAttributes $attributesUpdate 
```

## Microsoft Graph API

To manage custom security attribute assignments for applications in your Azure AD organization, you can use the Microsoft Graph API. The following API calls can be made to manage assignments.

For other similar Microsoft Graph API examples for users, see [Assign or remove custom security attributes for a user](../enterprise-users/users-custom-security-attributes.md#microsoft-graph-api) and [Assign, update, or remove custom security attributes using the Microsoft Graph API](/graph/custom-security-attributes-examples).

#### Get the custom security attribute assignments for an application (service principal)

Use the [Get servicePrincipal](/graph/api/serviceprincipal-get?view=graph-rest-beta&preserve-view=true) API to get the custom security attribute assignments for an application (service principal).

```http
GET https://graph.microsoft.com/beta/servicePrincipals/{id}?$select=customSecurityAttributes
```

If there are no custom security attributes assigned to the application or if the calling principal does not have access, the response will look like:

```http
{
    "customSecurityAttributes": null
}
```

#### Assign a custom security attribute with a string value to an application (service principal)

Use the [Update servicePrincipal](/graph/api/serviceprincipal-update?view=graph-rest-beta&preserve-view=true) API to assign a custom security attribute with a string value to a user.

- Attribute set: `Engineering`
- Attribute: `ProjectDate`
- Attribute data type: String
- Attribute value: `"2022-10-01"`

```http
PATCH https://graph.microsoft.com/beta/servicePrincipals/{id}
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

## Next steps

- [Add or deactivate custom security attributes in Azure AD](../fundamentals/custom-security-attributes-add.md)
- [Assign or remove custom security attributes for a user](../enterprise-users/users-custom-security-attributes.md)
- [Troubleshoot custom security attributes in Azure AD](../fundamentals/custom-security-attributes-troubleshoot.md)
