---
title: Understand linked sign-on in Azure Active Directory
description: Understand linked sign-on in Azure Active Directory.
services: active-directory
author: kenwith
manager: daveba
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: conceptual
ms.workload: identity
ms.date: 07/30/2020
ms.author: kenwith
ms.reviewer: arvinh,luleon
---

# Understand linked sign-on

In the [quickstart series](view-applications-portal.md) on application management, you learned how to use Azure AD as the Identity Provider (IdP) for an application. In the quickstart guide, you configure SAML-based or OIDC-based SSO. Another option is **Linked**. This article goes into more detail about the linked option.

The **Linked** option lets you configure the target location when a user selects the app in your organization's [My Apps](https://myapps.microsoft.com/) or Office 365 portal.

Some common scenarios where the link option is valuable include:
- Add a link to a custom web application that currently uses federation, such as Active Directory Federation Services (AD FS).
- Add deep links to specific SharePoint pages or other web pages that you just want to appear on your user's Access Panels.
- Add a link to an app that doesn't require authentication. 
 
 The **Linked** option doesn't provide sign-on functionality through Azure AD credentials. But, you can still use some of the other features of **Enterprise applications**. For example, you can use audit logs and add a custom logo and app name.

## Before you begin

To ramp knowledge quickly, walk through the [quickstart series](view-applications-portal.md) on application management. On the quickstart, where you configure single sign-on, you'll also find the **Linked** option. 

The **Linked** option doesn't provide sign-on functionality through Azure AD. The option simply sets the location users will be sent to when they select the app on [My Apps](https://myapps.microsoft.com/) or the Microsoft 365 app launcher.  Because the sign-in doesn't provide sign-on functionality through Azure AD, Conditional Access is not available for applications configured with Linked single sign-on.

> [!IMPORTANT] 
> There are some scenarios where the **Single sign-on** option will not be in the navigation for an application in **Enterprise applications**. 
>
> If the application was registered using **App registrations** then the single sign-on capability is setup to use OIDC OAuth by default. In this case, the **Single sign-on** option won't show in the navigation under **Enterprise applications**. When you use **App registrations** to add your custom app, you configure options in the manifest file. To learn more about the manifest file, see [Azure Active Directory app manifest](../develop/reference-app-manifest.md). To learn more about SSO standards, see [Authentication and authorization using Microsoft identity platform](../develop/authentication-vs-authorization.md#authentication-and-authorization-using-the-microsoft-identity-platform). 
>
> Other scenarios where **Single sign-on** will be missing from the navigation include when an application is hosted in another tenant or if your account does not have the required permissions (Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal). Permissions can also cause a scenario where you can open **Single sign-on** but won't be able to save. To learn more about Azure AD administrative roles, see (https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles).

### Configure link

To set a link for an app, select **Linked** on the **Single sign-on** page. Then enter the link and select **Save**. Need a reminder on where to find these options? Check out the [quickstart series](view-applications-portal.md).
 
After you configure an app, assign users and groups to it. When you assign users, you can control when the application appears on [My Apps](https://myapps.microsoft.com/) or the Microsoft 365 app launcher.

## Next steps

- [Assign users or groups to the application](./assign-user-or-group-access-portal.md)
- [Configure automatic user account provisioning](../app-provisioning/configure-automatic-user-provisioning-portal.md)
