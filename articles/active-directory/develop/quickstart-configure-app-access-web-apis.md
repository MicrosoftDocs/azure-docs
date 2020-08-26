---
title: "Quickstart: Configure an app to access a web API | Azure"
titleSuffix: Microsoft identity platform
description: In this quickstart, you configure an app registration representing a web API in the Microsoft identity platform to enable scoped resource access (permissions) to client applications.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity
ms.date: 08/14/2020
ms.author: ryanwi
ms.custom: aaddev, contperfq1
ms.reviewer: lenalepa, aragra, sureshja
# Customer intent: As an application developer, I want to know how to configure my web API's app registration with permissions client applications can use to obtain scoped access to the API.
---

# Quickstart: Configure a client application to access a web API

> [!WARNING]
> NOT READY FOR REVIEW<br/>
> WORK-IN-PROGRESS WORK-IN-PROGRESS WORK-IN-PROGRESS WORK-IN-PROGRESS WORK-IN-PROGRESS<br/>
> NOT READY FOR REVIEW

In this quickstart, you provide a client app registered with the Microsoft identity platform with scoped, permissions-based access to your own web API. You also provide the client app with access to Microsoft Graph.

By specifying a web API's scopes in your client app's registration, the client app can obtain an access token containing those scopes from the Microsoft identity platform. Within its code, the web API can then provide permission-based access to its resources based on the scopes found in the access token.

## Prerequisites

* An Azure account with an active subscription - [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
* Completion of [Quickstart: Register an application](quickstart-register-app.md)
* Completion of [Quickstart: Configure an application to expose a web API](quickstart-configure-app-expose-web-apis.md)

## Add permissions to access your web API

In this scenario, you grant a client app access to your own web API, both of which you should have registered as part of the prerequisites. If you don't yet have both a client app and a web API registered, complete the steps in the two [Prerequisites](#prerequisites) articles.

This diagram shows how the two app registrations relate to one another. In this section, you add permissions to the client app's registration.

:::image type="content" source="media/quickstart-configure-app-access-web-apis/diagram-01-app-permission-to-api-scopes.png" alt-text="Line diagram showing a web API with exposed scopes on the right and a client app on the left showing those scopes selected as permissions" border="false":::

Once you've registered both your client app and web API and you've exposed the API by creating scopes, you can configure the client's permissions to the API by following these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If you have access to multiple tenants, use the **Directory + subscription** filter :::image type="icon" source="./media/quickstart-configure-app-access-web-apis/portal-01-directory-subscription-filter.png" border="false"::: in the top menu to select the tenant containing your client app's registration.
1. Select **Azure Active Directory** > **App registrations**, and then select your client application.
1. Select **API permissions** > **Add a permission** > **My APIs**
1. Select the web API you registered as part of the prerequisites.
    **Delegated permissions** is selected by default. Delegated permissions are appropriate for client apps that access a web API as the signed-in user, and whose access should be restricted to the permissions you select in the next step. Leave delegated permissions selected.

    **Application permissions** are for service- or daemon-type applications that need to access a web API as themselves, without user interaction for sign-in or consent. Unless you've defined application roles for your web API, this option is disabled.
1. Under **Select permissions**, expand the resource whose scopes you defined for your web API, and select the permissions the client app should have on behalf of the signed-in user. If you used the example scope names specified in the previous quickstart, you should see **Employees.Read.All** and **Employees.Write.All**.
    Select **Employees.Read.All** if shown, or another permission you might have created when completing the prerequisites.
1. Select **Add permissions** to complete the process.

Upon successfully adding permissions to your API, you should see the selected permissions shown in the **Configured permissions** pane. The following image shows the example *Employees.Read.All* delegated permission added to the client app's registration.

You might also notice the *User.Read* permission for the Microsoft Graph API. This permission is added automatically when you register an app in the Azure portal.

:::image type="content" source="media/quickstart-configure-app-access-web-apis/portal-02-configured-permissions-pane.png" alt-text="Configured permissions pane in the Azure portal showing the newly added permission":::

## Add permissions to access Microsoft Graph

In addition to accessing your own web API on behalf of the signed-in user, your application might also need to access or modify the user's data stored in Microsoft Graph. Or you might have service or daemon app that needs to access Microsoft Graph as itself, performing operations without any user interaction.

### Delegated permission to Microsoft Graph

Configure delegated permission to Microsoft Graph to enable your client application to perform operations on behalf of the user, for example reading their email or modifying their profile. By default, users of your client app are asked when they sign in to consent to the delegated permissions you configure for it.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If you have access to multiple tenants, use the **Directory + subscription** filter :::image type="icon" source="./media/quickstart-configure-app-access-web-apis/portal-01-directory-subscription-filter.png" border="false"::: in the top menu to select the tenant containing your client app's registration.
1. Select **Azure Active Directory** > **App registrations**, and then select your client application.
1. Select **API permissions** > **Add a permission** > **Microsoft Graph**
1. Select **Delegated permissions**. Microsoft Graph exposes many permissions, with the most commonly used shown at the top of the list.
1. Under **Select permissions**, select the following permissions:
    | Permission       | Description                                         |
    |------------------|-----------------------------------------------------|
    | `email`          | View users' email address                           |
    | `offline_access` | Maintain access to data you have given it access to |
    | `openid`         | Sign users in                                       |
    | `profile`        | View users' basic profile                           |
1. Select **Add permissions** to complete the process.

Whenever you configure permissions, users of your app are asked for their consent to allow your app to access the resource API on their behalf. As an admin, you can also grant consent on behalf of all users so they're not prompted to do so. Admin consent is discussed later in the [Understanding API permissions and admin consent UI](#understanding-api-permissions-and-admin-consent-ui) section of this article.

### Application permission to Microsoft Graph

Configure application permissions for an application that needs to authenticate as itself without user interaction or consent. Application permissions are typically used by background services or daemon apps that access an API in a "headless" manner, and by web APIs that access a another API (often called a *downstream* API).

## Understanding API permissions and admin consent UI

### Configured permissions

This section shows the permissions that have been explicitly configured on the application object. These permissions are part of the app's required resource access list. You may add or remove permissions from this table. As an admin, you can also grant or revoke admin consent for a set of an API's permissions or individual permissions.

### Other permissions granted

If your application is registered in a tenant, you may see an additional section titled **Other permissions granted for Tenant**. This section shows permissions granted for the tenant that haven't been explicitly configured on the application object. These permissions were dynamically requested and consented. This section only appears if there is at least one permission that applies.

You may add a set of an API's permissions or individual permissions that appear in this section to the **Configured permissions** section. As an admin, you can also revoke admin consent for individual APIs or permissions in this section.

### Admin consent button

The **Grant admin consent for {your tenant}** button allows an admin to grant admin consent to the permissions configured for the application. Clicking the admin consent button launches a new window with a consent prompt showing all the configured permissions. There's a delay between permissions being configured for the application and appearing on the consent prompt. If at first you don't see all the configured permissions in the consent prompt, close the prompt and select the button again to reinitiate consent.

The consent prompt provides options to **Accept** or **Cancel**. Select **Accept** to grant admin consent. If you select **Cancel**, admin consent isn't granted and an error message states that consent has been declined. There's a delay between granting admin consent by selecting **Accept** the status of admin consent being reflected in the portal.

The **Grant admin consent** button is *disabled* if you aren't an admin or if no permissions have been configured for the application. If you have permissions that have been granted but not configured, the admin consent button prompts you to handle these permissions. You may add them to configured permissions or you may remove them.

## Next steps

Advance to the next quickstart in the series to learn how to configure which account types can access your application. For example, you might want to limit access only to those users in your organization (single-tenant) or allow users in other Azure AD tenants (multi-tenant) and those with personal Microsoft accounts (MSA).

> [!div class="nextstepaction"]
> [Modify the accounts supported by an application](quickstart-modify-supported-accounts.md)