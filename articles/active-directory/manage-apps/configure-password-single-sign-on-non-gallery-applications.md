---
title: Understand password-based single sign-on (SSO) for apps in Azure Active Directory
description: Understand password-based single sign-on (SSO) for apps in Azure Active Directory
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: conceptual
ms.date: 07/29/2020
ms.author: kenwith
---

# Understand password-based single sign-on

In the [quickstart series](view-applications-portal.md) on application management, you learned how to use Azure AD as the Identity Provider (IdP) for an application. In the quickstart guide, you configure SAML-based or OIDC-based SSO. Another option is password-based SSO. This article goes into more detail about the password-based SSO option. 

This option is available for any website with an HTML sign-in page. Password-based SSO is also known as password vaulting. Password-based SSO enables you to manage user access and passwords to web applications that don't support identity federation. It's also useful where several users need to share a single account, such as to your organization's social media app accounts.

Password-based SSO is a great way to get started integrating applications into Azure AD quickly, and allows you to:

- Enable single sign-on for your users by securely storing and replaying usernames and passwords

- Support applications that require multiple sign-in fields for applications that require more than just username and password fields to sign in

- Customize the labels of the username and password fields your users see on [My Apps](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction) when they enter their credentials

- Allow your users to provide their own usernames and passwords for any existing application accounts they're typing in manually.

- Allow a member of the business group to specify the usernames and passwords assigned to a user by using the [Self-Service Application Access](https://docs.microsoft.com/azure/active-directory/active-directory-self-service-application-access) feature

-   Allow an administrator to specify a username and password to be used by individuals or groups when they sign in to the application with the Update Credentials feature 

## Before you begin

Using Azure AD as your Identity Provider (IdP) and configuring single sign-on (SSO) can be simple or complex depending on the application being used. Some applications can be configured with just a few actions. Others require in-depth configuration. To ramp knowledge quickly, walk through the [quickstart series](view-applications-portal.md) on application management. If the application you're adding is simple, then you probably don't need to read this article. If the application you're adding requires custom configuration and you need to use password-based SSO, then this article is for you.

> [!IMPORTANT] 
> There are some scenarios where the **Single sign-on** option will not be in the navigation for an application in **Enterprise applications**. 
>
> If the application was registered using **App registrations** then the single sign-on capability is configured to use OIDC OAuth by default. In this case, the **Single sign-on** option won't show in the navigation under **Enterprise applications**. When you use **App registrations** to add your custom app, you configure options in the manifest file. To learn more about the manifest file, see [Azure Active Directory app manifest](https://docs.microsoft.com/azure/active-directory/develop/reference-app-manifest). To learn more about SSO standards, see [Authentication and authorization using Microsoft identity platform](https://docs.microsoft.com/azure/active-directory/develop/authentication-vs-authorization#authentication-and-authorization-using-microsoft-identity-platform). 
>
> Other scenarios where **Single sign-on** will be missing from the navigation include when an application is hosted in another tenant or if your account does not have the required permissions (Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal). Permissions can also cause a scenario where you can open **Single sign-on** but won't be able to save. To learn more about Azure AD administrative roles, see (https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles).


## Basic configuration

In the [quickstart series](view-applications-portal.md), you learned how to add an app to your tenant, which lets Azure AD knows it's being used as the Identity Provider (IdP) for the app. Some apps are already pre-configured and they show in the Azure AD gallery. Other apps are not in the gallery and you have to create a generic app and configure it manually. Depending on the app, the password-based SSO option might not be available. If you don't see the Password-based option list on the single sign-on page for the app, then it is not available.

> [!IMPORTANT]
> The My Apps browser extension is required for password-based SSO. To learn more, see [Plan a My Apps deployment](access-panel-deployment-plan.md).

The configuration page for password-based SSO is simple. It includes only the URL of the sign-on page that the app uses. This string must be the page that includes the username input field.

After you enter the URL, select **Save**. Azure AD parses the HTML of the sign-in page for username and password input fields. If the attempt succeeds, you're done.
 
Your next step is to [Assign users or groups to the application](methods-for-assigning-users-and-groups.md). After you've assigned users and groups, you can provide credentials to be used for a user when they sign in to the application. Select **Users and groups**, select the checkbox for the user's or group's row, and then select **Update Credentials**. Finally, enter the username and password to be used for the user or group. If you don't, users will be prompted to enter the credentials themselves upon launch.
 

## Manual configuration

If Azure AD's parsing attempt fails, you can configure sign-on manually.

1. Under **\<application name> Configuration**, select **Configure \<application name> Password Single Sign-on Settings** to display the **Configure sign-on** page. 

2. Select **Manually detect sign-in fields**. Additional instructions describing the manual detection of sign-in fields appear.

   ![Manual configuration of password-based single sign-on](./media/configure-password-single-sign-on/password-configure-sign-on.png)
3. Select **Capture sign-in fields**. A capture status page opens in a new tab, showing the message **metadata capture is currently in progress**.

4. If the **My Apps Extension Required** box appears in a new tab, select **Install Now** to install the **My Apps Secure Sign-in Extension** browser extension. (The browser extension requires Microsoft Edge, Chrome, or Firefox.) Then install, launch, and enable the extension, and refresh the capture status page.

   The browser extension then opens another tab that displays the entered URL.
5. In the tab with the entered URL, go through the sign-in process. Fill in the username and password fields, and try to sign in. (You don't have to provide the correct password.)

   A prompt asks you to save the captured sign-in fields.
6. Select **OK**. The browser extension updates the capture status page with the message **Metadata has been updated for the application**. The browser tab closes.

7. In the Azure AD **Configure sign-on** page, select **Ok, I was able to sign-in to the app successfully**.

8. Select **OK**.

## Next steps

- [Assign users or groups to the application](methods-for-assigning-users-and-groups.md)
- [Configure automatic user account provisioning](../app-provisioning/configure-automatic-user-provisioning-portal.md)
