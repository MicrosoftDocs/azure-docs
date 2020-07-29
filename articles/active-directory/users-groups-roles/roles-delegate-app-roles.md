---
title: Delegate application management administrator permissions - Azure AD | Microsoft Docs
description: Grant permissions for application access management in Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: how-to
ms.date: 11/08/2019
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro
#As an Azure AD administrator, I want to reduce overusing the Global Administrator role by delegating app access management to lower-privilege roles.

ms.collection: M365-identity-device-management
---

# Delegate app registration permissions in Azure Active Directory

This article describes how to use permissions granted by custom roles in Azure Active Directory (Azure AD) to address your application management needs. In Azure AD, you can delegate Application creation and management permissions in the following ways:

- [Restricting who can create applications](#restrict-who-can-create-applications) and manage the applications they create. By default in Azure AD, all users can register application registrations and manage all aspects of applications they create. This can be restricted to only allow selected people that permission.
- [Assigning one or more owners to an application](#assign-application-owners). This is a simple way to grant someone the ability to manage all aspects of Azure AD configuration for a specific application.
- [Assigning a built-in administrative role](#assign-built-in-application-admin-roles) that grants access to manage configuration in Azure AD for all applications. This is the recommended way to grant IT experts access to manage broad application configuration permissions without granting access to manage other parts of Azure AD not related to application configuration.
- [Creating a custom role](#create-and-assign-a-custom-role-preview) defining very specific permissions and assigning it to someone either to the scope of a single application as a limited owner, or at the directory scope (all applications) as a limited administrator.

It's important to consider granting access using one of the above methods for two reasons. First, delegating the ability to perform administrative tasks reduces global administrator overhead. Second, using limited permissions improves your security posture and reduces the potential for unauthorized access. Delegation issues and general guidelines are discussed in [Delegate administration in Azure Active Directory](roles-concept-delegation.md).

## Restrict who can create applications

By default in Azure AD, all users can register application registrations and manage all aspects of applications they create. Everyone also has the ability to consent to apps accessing company data on their behalf. You can choose to selectively grant those permissions by setting the global switches to 'No' and adding the selected users to the Application Developer role.

### To disable the default ability to create application registrations or consent to applications

1. Sign in to your Azure AD organization with an account that eligible for the Global administrator role in your Azure AD organization.
1. Set one or both of the following:

    - On the [User settings page for your organization](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/UserSettings), set the **Users can register applications** setting to No. This will disable the default ability for users to create application registrations.
    - On the [user settings for enterprise applications](https://portal.azure.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/UserSettings/menuId/), set the **Users can consent to applications accessing company data on their behalf** setting to No. This will disable the default ability for users to consent to applications accessing company data on their behalf.

### Grant individual permissions to create and consent to applications when the default ability is disabled

Assign the Application developer role to grant the ability to create application registrations when the **Users can register applications** setting is set to No. This role also grants permission to consent on one's own behalf when the **Users can consent to apps accessing company data on their behalf** setting is set to No. As a system behavior, when a user creates a new application registration, they are automatically added as the first owner. Ownership permissions give the user the ability to manage all aspects of an application registration or enterprise application that they own.

## Assign application owners

Assigning owners is a simple way to grant the ability to manage all aspects of Azure AD configuration for a specific application registration or enterprise application. As a system behavior, when a user creates a new application registration they are automatically added as the first owner. Ownership permissions give the user the ability to manage all aspects of an application registration or enterprise application that they own. The original owner can be removed and additional owners can be added.

### Enterprise application owners

As an owner, a user can manage the organization-specific configuration of the enterprise application, such as the single sign-on configuration, provisioning, and user assignments. An owner can also add or remove other owners. Unlike Global administrators, owners can manage only the enterprise applications they own.

In some cases, enterprise applications created from the application gallery include both an enterprise application and an application registration. When this is true, adding an owner to the enterprise application automatically adds the owner to the corresponding application registration as an owner.

### To assign an owner to an enterprise application

1. Sign in to [your Azure AD organization](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) with an account that eligible for the Application administrator or Cloud application administrator for the organization.
1. On the [App registrations page](https://portal.azure.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/AllApps/menuId/) for the organization, select an app to open the Overview page for the app.
1. Select **Owners** to see the list of the owners for the app.
1. Select **Add** to select one or more owners to add to the app.

> [!IMPORTANT]
> Users and service principals can be owners of application registrations. Only users can be owners of enterprise applications. Groups cannot be assigned as owners of either.
>
> Owners can add credentials to an application and use those credentials to impersonate the application’s identity. The application may have more permissions than the owner, and thus would be an elevation of privilege over what the owner has access to as a user or service principal. An application owner could potentially create or update users or other objects while impersonating the application, depending on the application's permissions.

## Assign built-in application admin roles

Azure AD has a set of built-in admin roles for granting access to manage configuration in Azure AD for all applications. These roles are the recommended way to grant IT experts access to manage broad application configuration permissions without granting access to manage other parts of Azure AD not related to application configuration.

- Application Administrator: Users in this role can create and manage all aspects of enterprise applications, application registrations, and application proxy settings. This role also grants the ability to consent to delegated permissions, and application permissions excluding Microsoft Graph. Users assigned to this role are not added as owners when creating new application registrations or enterprise applications.
- Cloud Application Administrator: Users in this role have the same permissions as the Application Administrator role, excluding the ability to manage application proxy. Users assigned to this role are not added as owners when creating new application registrations or enterprise applications.

For more information and to view the description for these roles, see [Available roles](directory-assign-admin-roles.md#available-roles).

Follow the instructions in the [Assign roles to users with Azure Active Directory](../fundamentals/active-directory-users-assign-role-azure-portal.md) how-to guide to assign the Application Administrator or Cloud Application Administrator roles.

> [!IMPORTANT]
> Application Administrators and Cloud Application Administrators can add credentials to an application and use those credentials to impersonate the application’s identity. The application may have permissions that are an elevation of privilege over the admin role's permissions. An admin in this role could potentially create or update users or other objects while impersonating the application, depending on the application's permissions.
> Neither role grants the ability to manage Conditional Access settings.

## Create and assign a custom role (preview)

Creating custom roles and assigning custom roles are separate steps:

- [Create a custom *role definition*](roles-create-custom.md) and [add permissions to it from a preset list](roles-custom-available-permissions.md). These are the same permissions used in the built-in roles.
- [Create a *role assignment*](roles-assign-powershell.md) to assign the custom role.

This separation allows you to create a single role definition and then assign it many times at different *scopes*. A custom role can be assigned at organization-wide scope, or it can be assigned at the scope if a single Azure AD object. An example of an object scope is a single app registration. Using different scopes, the same role definition can be assigned to Sally over all app registrations in the organization and then to Naveen over only the Contoso Expense Reports app registration.

Tips when creating and using custom roles for delegating application management:
- Custom roles only grant access in the most current app registration blades of the Azure AD portal. They do not grant access in the legacy app registrations blades.
- Custom roles do not grant access to the Azure AD portal when the “Restrict access to Azure AD administration portal” user setting is set to Yes.
- App registrations the user has access to using role assignments only show up in the ‘All applications’ tab on the App registration page. They do not show up in the ‘Owned applications’ tab.

For more information on the basics of custom roles, see the [custom roles overview](roles-custom-overview.md), as well as how to [create a custom role](roles-create-custom.md) and how to [assign a role](roles-assign-powershell.md).

## Next steps

- [Application registration subtypes and permissions](roles-custom-available-permissions.md)
- [Azure AD administrator role reference](directory-assign-admin-roles.md)
