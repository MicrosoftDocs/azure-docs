---
title: Delegate application administrator roles - Azure Active Directory | Microsoft Docs
description: Application access management delegating roles to grant permissions rights in Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman
editor: ''

ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: article
ms.date: 03/18/2019
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro
#As an Azure AD administrator, I want to reduce overusing the Global Administrator role by delegating app access management to lower-privilege roles.

ms.collection: M365-identity-device-management
---

# Delegate app administrator roles in Azure Active Directory

 Azure AD allows you to delegate management of application access to a set of built-in administrative roles. Besides reducing global administrator overhead, delegating specialized privileges to manage application access tasks can improve your security posture and reduce the potential for unauthorized access. Delegation issues and general guidelines are discussed in [Delegate administration in Azure Active Directory](roles-concept-delegation.md).

## Delegate app administration

The following roles grant permissions to manage application registrations, single sign-on settings, user and group assignments, and to consent to delegated permissions and application permissions (excluding Microsoft Graph and Azure AD Graph). The only difference is that the Application administrator role also grants permissions to manage Application Proxy settings. Neither role grants the ability to manage Conditional Access settings.
> [!IMPORTANT]
> Users assigned this role can add credentials to an application and use those credentials to impersonate the application’s identity. This impersonation of the application’s identity might be an elevation of privilege over what the user can do under their other role assignments in Azure AD. A user assigned to this role could potentially create or update users or other objects while impersonating the application.

To grant the ability to manage application access in the Azure portal:

1. Sign in to your [Azure AD tenant](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) with an account that eligible for the Global Administrator role in the tenant.
2. When you have sufficient permissions, open the [Roles and administrators page](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RolesAndAdministrators).
3. Open one of the following roles to see its member assignments:
   * **Application administrator**
   * **Cloud application administrator**
4. On the **Members** page for the role, select **Add member**.
5. Select one or more members to add to the role. <!--Members can be users or groups.-->

You can view the description for these roles in [Available roles](directory-assign-admin-roles.md#available-roles).

## Delegate app registration

By default, all users can create application registrations, but you can selectively grant permission to create application registrations or permission to consent to authorize an app.

1. Sign in to your [Azure AD tenant](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) with an account that eligible for the Global Administrator role in the tenant.
2. When you have obtained sufficient permissions, set one or both of the following:
   * On the [User settings page for your tenant](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/UserSettings), set **Users can register applications** to No.
   * On the [user settings for enterprise applications](https://portal.azure.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/UserSettings/menuId/), set **Users can consent to applications accessing company data on their behalf** to No.
3. Then assign users needing this permission to be members of the Application developer role as needed.

When a user registers an application, they are automatically added as the first owner for the application.

## Delegate app ownership

App owners and app registration owners can each manage only the applications or app registrations that they own. For example, when you add an owner for the Salesforce application, that owner can manage access to and configuration for Salesforce but not any other applications. An app can have many owners, and a user can be the owner of many apps.

An application owner can:

* Change application properties, such as the name and permissions the app requests
* Manage credentials
* Configure single sign-on
* Assign user access
* Add or remove other owners
* Edit the app manifest
* Publish the app to the app gallery

> [!IMPORTANT]
> Users assigned this role can add credentials to an application and use those credentials to impersonate the application’s identity. This impersonation of the application’s identity might be an elevation of privilege over what the user can do under their other role assignments in Azure AD. A user assigned to this role could potentially create or update users or other objects while impersonating the application.

The owner of an app registration can view and edit the app registration.

<!-- ### To assign an enterprise app ownership role to a user

1. Sign in to your [Azure AD tenant](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) with an account that is the Global Administrator for the tenant.
2. On the [Roles and administrators page](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RolesAndAdministrators), open one of the following roles to see its member assignments:
  * **Enterprise Application Owner**
  * **Application Registration Owner**
3. On the **Members** page for the role, select **Add member**.
4. Select one or more members to add to the role. -->

### To assign an owner to an application

1. Sign in to your [Azure AD tenant](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) with an account that eligible for the Application administrator or Cloud application administrator for the tenant.
2. On the [App registrations page](https://portal.azure.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/AllApps/menuId/) for the tenant, select an app to open the **Overview** page for the app.
3. Select **Owners** to see the list of the owners for the app.
4. Select **Add** to select one or more owners to add to the app.

### To assign an owner to an application registration

1. Sign in to your [Azure AD tenant](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) with an account that eligible for the Application administrator or Cloud application administrator role in the tenant.
2. When you have sufficient permissions, on the [Enterprise Applications page](https://portal.azure.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/AllApps/menuId/) for the tenant, select an app registration to open it.
3. Select **Settings**.
4. Select **Owners** on the **Settings** page to see the list of the owners for the app.
5. Select **Add owner** to select one or more owners to add to the app.

## Next steps

* [Azure AD administrator role reference](directory-assign-admin-roles.md)
