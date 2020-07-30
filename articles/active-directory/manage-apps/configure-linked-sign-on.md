---
title: Configure an app link in Azure AD
description: Configure an app link using Azure AD
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 07/20/2020
ms.author: kenwith
ms.reviewer: arvinh,luleon
---

# Configure an app link

In the [quickstart series](view-applications-portal.md) on application management, you learned how to use Azure AD as the Identity Provider (IdP) for an application. In the quickstart guide, you set up SAML-based SSO. Another option is **Linked**. This article goes into more detail about the linked option. 

The **Linked** option lets you add a link in your organization's Azure AD Access Panel or Office 365 portal.

Some common scenarios where the link option is valuable include:
- Add a link to a custom web application that currently uses federation, such as Active Directory Federation Services (AD FS).
- Add deep links to specific SharePoint pages or other web pages that you just want to appear on your user's Access Panels.
- Add a link to an app that doesn't require authentication. 
 
 Although the **Linked** option doesn't provide sign-on functionality, you can still use other features of **Enterprise applications**. For example, you can use conditional access, audit logs, and user consent.

## Before you begin

To ramp up quickly, walk through the [quickstart series](view-applications-portal.md) on application management. On the quickstart, where you configure single sign-on, you'll also find the **Linked** option. 

The **Linked** option doesn't provide sign-on functionality. The option simply sets the location users will be sent to when they select the app on [My Apps](https://myapplications.microsoft.com/) or the Microsoft 365 app launcher.

> [!IMPORTANT] 
> There are some scenarios where the **Single sign-on** option will not be in the navigation for an application in **Enterprise applications**. 
>
> If the application was registered using **App registrations** then the single sign-on capability is set up to use OIDC OAuth by default. In this case, the **Single sign-on** option won't show up in the navigation under **Enterprise applications**. When you use **App registrations** to add your custom app, you configure options in the manifest file. To learn more about the manifest file, see [Azure Active Directory app manifest](https://docs.microsoft.com/azure/active-directory/develop/reference-app-manifest). To learn more about SSO standards, see [Authentication and authorization using Microsoft identity platform](https://docs.microsoft.com/azure/active-directory/develop/authentication-vs-authorization#authentication-and-authorization-using-microsoft-identity-platform). 
>
> Other scenarios where **Single sign-on** will be missing from the navigation include when an application is hosted in another tenant or if your account does not have the required permissions (Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal). Permissions can also cause a scenario where you can open **Single sign-on** but won't be able to save. To learn more about Azure AD administrative roles, see (https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles).

### Configure app link

To set a link for an app, select **Linked** on the **Single sign-on** page. Then enter the link and select **Save**. Need a reminder on where to find these options? Check out the [quickstart series](view-applications-portal.md).
 
You may assign users and groups to the application, which causes the application to appear in the [Office 365 app launcher](https://blogs.office.com/2014/10/16/organize-office-365-new-app-launcher-2/) or the [Azure AD access panel](end-user-experiences.md) for those users.

## Next steps

- [Assign users or groups to the application](methods-for-assigning-users-and-groups.md)
- [Configure automatic user account provisioning](../app-provisioning/configure-automatic-user-provisioning-portal.md)
