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
ms.component: users-groups-roles
ms.topic: article
ms.date: 01/24/2019
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro
#As an Azure AD administrator, I want to reduce overusing the Global Administrator role by delegating app access management to lower-privilege roles.

---

# Delegate app administrator roles in Azure Active Directory

The increasing number of apps proliferating in an organization can strain resources when you place the burden for application access management on Global Administrators. Azure Active Directory (Azure AD) supports granting less-privileged administrative roles to manage application access. Some delegation issues and general guidelines are provided in [Delegate administration in Azure Active Directory](roles-concept-delegation.md).

Besides reducing global administrator overhead, delegating specialized privileges to manage application access tasks can improve your security posture and reduce the potential for unauthorized access.

## Delegate app administration

The following roles grant permissions to manage application registrations, single sign-on settings, user and group assignments, licensing, and consent. The only difference is that the Application administrator role also grants permissions to manage Application Proxy settings. Neither role grants the ability to manage Conditional Access settings.

To grant the ability to manage application access in the Azure portal:

1. Sign in to your [Azure AD tenant](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) with an account that is the Global Administrator for the tenant.
2. Open the [Roles and administrators page](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RolesAndAdministrators).
3. Open one of the following roles to see its member assignments:
  * **Application administrator**
  * **Cloud application administrator**
4. On the **Members** page for the role, select **Add member**.
5. Select one or more members to add to the role. <!--Members can be users or groups.-->

## Delegate app registration

By default, all users can create application registrations, but you can selectively grant permission to create application registrations or permission to consent to authorize an app.

1. Sign in to your [Azure AD tenant](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) with an account that is the Global Administrator for the tenant.
2. Set one or both of the following to No:
  * On the [User settings page for your tenant](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/UserSettings), set **Users can register applications** to No.
  * On the [user settings for enterprise applications](https://portal.azure.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/UserSettings/menuId/), set **Users can consent to applications accessing company data on their behalf** to No.
3. Then assign users needing this permission to be members of the Application Developer role as described in [Delegate app administration](#delegate-app-administration).

When a member of the Application Developer role creates a new application registration, they are automatically added as the first owner.

## Delegate app ownership

Azure AD provides two levels of role permissions for users who are to own enterprise applications. The Enterprise application owner role grants the user permission to manage enterprise applications that the user owns, including single sign-on settings, user and group assignments, and adding additional owners. It doesn't grant permission to manage Application Proxy settings or Conditional Access settings. The Application registration owner role grants only permission to manage application registrations for app that the user owns, including the application manifest and adding additional owners.

As members of these roles, owners can manage only the enterprise applications they own. For example, when you add an owner for the Salesforce application, that owner can manage access to and configuration for Salesforce but not for any other applications. An enterprise application can have many owners, and a user can be the owner for many enterprise applications.

### To assign an enterprise app ownership role to a user

1. Sign in to your [Azure AD tenant](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) with an account that is the Global Administrator for the tenant.
2. On the [Roles and administrators page](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RolesAndAdministrators), open one of the following roles to see its member assignments:
  * **Enterprise Application Owner**
  * **Application Registration Owner**
3. On the **Members** page for the role, select **Add member**.
4. Select one or more members to add to the role. <!--Members can be users or groups.-->

### To assign ownership to an enterprise application

1. Sign in to your [Azure AD tenant](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) with an account that is the Global Administrator for the tenant.
2. On the [Enterprise Applications page](https://portal.azure.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/AllApps/menuId/), select an enterprise app to open the Overview page for the app.
3. Select Owners to see the list of the owners for the app.
4. Select **Add** to select one or more owners to add to the app.

## Next steps

* [Azure AD administrator role reference](directory-assign-admin-roles.md)
