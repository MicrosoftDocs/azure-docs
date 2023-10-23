---
title: 'Configure an OpenID Connect OAuth application from Microsoft Entra app gallery'
description: Steps to Configure an OpenID Connect OAuth application from Microsoft Entra app gallery.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: jeedes
ms.custom: 
---
# Configure an OpenID Connect OAuth application from Microsoft Entra app gallery

## Process of adding an OpenID application from the gallery

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**.

    ![The Enterprise applications blade](common/enterprise-applications.png)

3. Select **New application** on the top of the dialog box.

    ![The New application button](common/add-new-app.png)

4. In the search box, type the application name. Select the desired application from the result panel, and sign up to the application.

    ![Openid in the results list](common/search-new-app.png)


1. In the Application name page, click on **Sign up** button.

    ![Add button](./media/openidoauth-tutorial/addbutton.png)

    > [!NOTE]
    > Here the tenant admin should select the sign-up button and provide the consent to the application. The application is then added to the customer tenant, where you can do the configurations. There's no need to add the application explicitly.

5. You're redirected to the Application Login page or Microsoft Entra ID page for sign-in credentials.

6. After successful authentication, you accept the consent from the consent page. After that, the application home page appears.

    > [!NOTE]
    > You can add only one instance of the application. If you have already added one and tried to provide the consent again, it will not be added again in the tenant. So logically, you can use only one app instance in the tenant.

1. Follow the below video to add an OpenID application from the gallery.
    >[!VIDEO https://www.microsoft.com/videoplayer/embed/RE4HoNI]

## Authentication flow using OpenID Connect

The most basic sign-in flow contains the following steps:

![Authentication flow using OpenID Connect](./media/openidoauth-tutorial/authenticationflow.png)

### Multitenant application
A multitenant application is intended for use in many organizations, not just one organization. These are typically software-as-a-service (SaaS) applications written by an independent software vendor (ISV).

Multitenant applications need to be provisioned in each directory where they'll be used. They require user or administrator consent to register them. This consent process starts when an application has been registered in the directory and is given access to the Graph API or perhaps another web API. When a user or administrator from a different organization signs up to use the application, a dialog box displays the permissions that the application needs.

The user or administrator can then consent to the application. The consent gives the application access to the stated data, and finally registers the application in the directory.

> [!NOTE]
> If you're making your application available to users in multiple directories, you need a mechanism to determine which tenant they're in. A single-tenant application only needs to look in its own directory for a user. A multitenant application needs to identify a specific user from all the directories in Microsoft Entra ID.
>
> To accomplish this task, Microsoft Entra ID provides a common authentication endpoint where any multitenant application can direct sign-in requests, instead of a tenant-specific endpoint. This endpoint is `https://login.microsoftonline.com/common` for all directories in Microsoft Entra ID. A tenant-specific endpoint might be `https://login.microsoftonline.com/contoso.onmicrosoft.com`.
>
> The common endpoint is important to consider when you're developing your application. You'll need the necessary logic to handle multiple tenants during sign-in, sign-out, and token validation.

By default, Microsoft Entra ID promotes multitenant applications. They're easily accessed across organizations, and they're easy to use after you accept the consent.

## Consent framework

You can use the Microsoft Entra ID consent framework to develop multitenant web and native client applications. These applications allow sign-in by user accounts from a Microsoft Entra tenant, different from the one where the application is registered. They might also need to access web APIs such as:
- The Microsoft Graph API, to access Microsoft Entra ID, Intune, and services in Microsoft 365.
- Other Microsoft services' APIs.
- Your own web APIs.

The framework is based on a user or an administrator giving consent to an application that asks to be registered in their directory. The registration might involve accessing directory data. After consent is given, the client application can call the Microsoft Graph API on behalf of the user, and use the information as needed.

The [Microsoft Graph API](https://developer.microsoft.com/graph/) provides access to data in Microsoft 365, like:

- Calendars and messages from Exchange.
- Sites and lists from SharePoint.
- Documents from OneDrive.
- Notebooks from OneNote.
- Tasks from Planner.
- Workbooks from Excel.

The Graph API also provides access to users and groups from Microsoft Entra ID and other data objects from more Microsoft cloud services.

The following steps show you how the consent experience works for the application developer and user:

1. Assume you have a web client application that needs to request specific permissions to access a resource or API. The Azure portal is used to declare permission requests at configuration time. Like other configuration settings, they become part of the application's Microsoft Entra registrations. For the Permission request path you need the follow the below steps:

    a. Click on the **App registrations** from the left side of menu and open your application by typing the application name in search box.

    ![Screenshot that shows "App registrations" selected from the left-side menu and the "Application I D" search box highlighted.](./media/openidoauth-tutorial/application.png)

    b. Click **View API Permissions**.

    ![Screenshot that shows the "Call A P I" page with the "View A P I Permissions" button selected.](./media/openidoauth-tutorial/api-permission.png)

    c. Click on **Add a permission**.

    ![Screenshot that shows the "A P I permissions" section with the "Add a permission" button selected.](./media/openidoauth-tutorial/add-permission.png)

    d. Click On **Microsoft Graph**.

    ![Screenshot that shows the "Request A P I permissions" page with the "Microsoft A P I" tab and "Microsoft Graph" tile selected.](./media/openidoauth-tutorial/microsoft-graph.png)

    e. Select required options from **Delegated permissions** and **Application Permissions**.

    ![Graph API](./media/openidoauth-tutorial/graphapi.png)

2. Consider that your application's permissions have been updated. The application is running, and a user is about to use it for the first time. First the application needs to get an authorization code from the Microsoft Entra ID /authorize endpoint. The authorization code can then be used to acquire a new access and refresh token.

3. If the user is not already authenticated, the Microsoft Entra ID /authorize endpoint prompts for sign-in.

    ![A Screenshot of the sign-in prompt for the account](./media/openidoauth-tutorial/authentication.png)

4. After the user has signed in, Microsoft Entra ID determines if the user needs to be shown a consent page. This determination is based on whether the user (or their organization's administrator) has already granted the application consent.

   If consent has not been granted, Microsoft Entra prompts the user for consent and displays the required permissions that it needs to function. The permissions that are displayed in the consent dialog box match the ones selected in the delegated permissions.

    ![Consent page](./media/openidoauth-tutorial/consentpage.png)

A regular user can consent to some permissions. Other permissions require a tenant administrator's consent.

## Difference between admin consent and user consent

As an administrator, you can also consent to an application's delegated permissions on behalf of all the users in your tenant. Administrative consent prevents the consent dialog box from appearing for every user in the tenant. Users who have the administrator role can provide consent. From the **Settings** page for your application, select **Required Permissions** > **Grant admin consent**.

![Grant Permissions button](./media/openidoauth-tutorial/grantpermission.png)

> [!NOTE]
> Granting explicit consent by using the **Grant admin consent** button is now required for single-page applications (SPAs) that use MSAL.js. Otherwise, the application fails when the access token is requested.

App-only permissions always require a tenant administrator's consent. If your application requests an app-only permission and a user tries to sign in to the application, an error message appears. The message says the user isn't able to consent.

If your application uses permissions that require admin consent, you need to have a gesture such as a button or link where the admin can start the action. The request that your application sends for this action is the usual OAuth2/OpenID Connect authorization request. This request includes the *prompt=admin_consent* query string parameter.

After the admin has consented and the service principal is created in the customer's tenant, later sign-in requests don't need the *prompt=admin_consent* parameter. Because the administrator has decided that the requested permissions are acceptable, no other users in the tenant are prompted for consent from that point forward.

A tenant administrator can disable the ability for regular users to consent to applications. If this capability is disabled, admin consent is always required for the application to be used in the tenant. If you want to test your application with end-user consent disabled, you can find the configuration switch in the [Azure portal](https://portal.azure.com/). It's in the [User settings](https://portal.azure.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/UserSettings/menuId/) section under **Enterprise applications**.

The *prompt=admin_consent* parameter can also be used by applications that request permissions that don't require admin consent. An example is an application that requires an experience where the tenant admin "signs up" one time, and no other users are prompted for consent from that point on.

Imagine that an application requires admin consent, and an admin signs in without the *prompt=admin_consent* parameter being sent. When the admin successfully consents to the application, it applies only for their user account. Regular users will still be unable to sign in or consent to the application. This feature is useful if you want to give the tenant administrator the ability to explore your application before allowing other users' access.

## Next steps

[Set up OIDC-based single sign-on (SSO) for an application in your Microsoft Entra tenant](../manage-apps/add-application-portal-setup-oidc-sso.md)
