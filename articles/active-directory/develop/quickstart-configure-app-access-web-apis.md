---
title: "Quickstart: Configure an app to access a web API"
description: In this quickstart, you configure an app registration representing a web API in the Microsoft identity platform to enable scoped resource access (permissions) to client applications.
services: active-directory
author: cilwerner
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity
ms.date: 06/29/2023
ms.author: cwerner
ms.custom: aaddev, contperf-fy21q1, mode-api
ms.reviewer: lenalepa, aragra, sureshja
#Customer intent: As an application developer, I want to know how to configure my web API's app registration with permissions client applications can use to obtain scoped access to the API.
---

# Quickstart: Configure a client application to access a web API

In this quickstart, you provide a client app registered with the Microsoft identity platform with scoped, permissions-based access to your own web API. You also provide the client app access to Microsoft Graph.

By specifying a web API's scopes in your client app's registration, the client app can obtain an access token containing those scopes from the Microsoft identity platform. Within its code, the web API can then provide permission-based access to its resources based on the scopes found in the access token.

## Prerequisites

* An Azure account with an active subscription - [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
* Completion of [Quickstart: Register an application](quickstart-register-app.md)
* Completion of [Quickstart: Configure an application to expose a web API](quickstart-configure-app-expose-web-apis.md)

## Add permissions to access your web API

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Access to APIs require configuration of access scopes and roles. If you want to expose your resource application web APIs to client applications, configure access scopes and roles for the API. If you want a client application to access a web API, configure permissions to access the API in the app registration.

In the first scenario, you grant a client app access to your own web API, both of which you should have registered as part of the prerequisites. If you don't yet have both a client app and a web API registered, complete the steps in the two [Prerequisites](#prerequisites) articles.

This diagram shows how the two app registrations relate to one another. In this section, you add permissions to the client app's registration.

:::image type="content" source="media/quickstart-configure-app-access-web-apis/diagram-01-app-permission-to-api-scopes.svg" alt-text="Line diagram showing a web API with exposed scopes on the right and a client app on the left with those scopes selected as permissions" border="false":::

Once you've registered both your client app and web API and you've exposed the API by creating scopes, you can configure the client's permissions to the API by following these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator). 
1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="./media/quickstart-configure-app-access-web-apis/portal-01-directory-subscription-filter.png" border="false"::: in the top menu to select the tenant containing your client app's registration.
1. Browse to **Identity** > **Applications** > **App registrations**, and then select your client application (*not* your web API).
1. Select **API permissions** > **Add a permission** > **My APIs**.
1. Select the web API you registered as part of the prerequisites.

    **Delegated permissions** is selected by default. Delegated permissions are appropriate for client apps that access a web API as the signed-in user, and whose access should be restricted to the permissions you select in the next step. Leave **Delegated permissions** selected for this example.

    **Application permissions** are for service- or daemon-type applications that need to access a web API as themselves, without user interaction for sign-in or consent. Unless you've defined application roles for your web API, this option is disabled.
1. Under **Select permissions**, expand the resource whose scopes you defined for your web API, and select the permissions the client app should have on behalf of the signed-in user.

    If you used the example scope names specified in the previous quickstart, you should see **Employees.Read.All** and **Employees.Write.All**.
    Select **Employees.Read.All** or another permission you might have created when completing the prerequisites.
1. Select **Add permissions** to complete the process.

After adding permissions to your API, you should see the selected permissions under **Configured permissions**. The following image shows the example *Employees.Read.All* delegated permission added to the client app's registration.

:::image type="content" source="media/quickstart-configure-app-access-web-apis/portal-02-configured-permissions-pane.png" alt-text="Configured permissions pane in the Azure portal showing the newly added permission":::

You might also notice the *User.Read* permission for the Microsoft Graph API. This permission is added automatically when you register an app in the Azure portal.

## Add permissions to access Microsoft Graph

In addition to accessing your own web API on behalf of the signed-in user, your application might also need to access or modify the user's (or other) data stored in Microsoft Graph. Or you might have service or daemon app that needs to access Microsoft Graph as itself, performing operations without any user interaction.

### Delegated permission to Microsoft Graph

Configure delegated permission to Microsoft Graph to enable your client application to perform operations on behalf of the logged-in user, for example reading their email or modifying their profile. By default, users of your client app are asked when they sign in to consent to the delegated permissions you've configured for it.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator). 
1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="./media/quickstart-configure-app-access-web-apis/portal-01-directory-subscription-filter.png" border="false"::: in the top menu to select the tenant containing your client app's registration.
1. Browse to **Identity** > **Applications** > **App registrations**, and then select your client application.
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

Whenever you configure permissions, users of your app are asked at sign-in for their consent to allow your app to access the resource API on their behalf.

As an admin, you can also grant consent on behalf of *all* users so they're not prompted to do so. Admin consent is discussed later in the [More on API permissions and admin consent](#more-on-api-permissions-and-admin-consent) section of this article.

### Application permission to Microsoft Graph

Configure application permissions for an application that needs to authenticate as itself without user interaction or consent. Application permissions are typically used by background services or daemon apps that access an API in a "headless" manner, and by web APIs that access another (downstream) API.

In the following steps, you grant permission to Microsoft Graph's *Files.Read.All* permission as an example.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator). 
1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="./media/quickstart-configure-app-access-web-apis/portal-01-directory-subscription-filter.png" border="false"::: in the top menu to select the tenant containing your client app's registration.
1. Browse to **Identity** > **Applications** > **App registrations**, and then select your client application.
1. Select **API permissions** > **Add a permission** > **Microsoft Graph** > **Application permissions**.
1. All permissions exposed by Microsoft Graph are shown under **Select permissions**.
1. Select the permission or permissions you want to grant your application. As an example, you might have a daemon app that scans files in your organization, alerting on a specific file type or name.

    Under **Select permissions**, expand **Files**, and then select the *Files.Read.All* permission.
1. Select **Add permissions**.

Some permissions, like Microsoft Graph's *Files.Read.All* permission, require admin consent. You grant admin consent by selecting the **Grant admin consent** button, discussed later in the [Admin consent button](#admin-consent-button) section.

### Configure client credentials

Apps that use application permissions authenticate as themselves by using their own credentials, without requiring any user interaction. Before your application (or API) can access Microsoft Graph, your own web API, or another API by using application permissions, you must configure that client app's credentials.

For more information about configuring an app's credentials, see the [Add credentials](quickstart-register-app.md#add-credentials) section of [Quickstart: Register an application with the Microsoft identity platform](quickstart-register-app.md).

## More on API permissions and admin consent

The **API permissions** pane of an app registration contains a [Configured permissions](#configured-permissions) table, and might also contain an [Other permissions granted](#other-permissions-granted) table. Both tables and the [Admin consent button](#admin-consent-button) are described in the following sections.

### Configured permissions

The **Configured permissions** table on the **API permissions** pane shows the list of permissions that your application requires for basic operation - the *required resource access* (RRA) list. Users, or their admins, will need to consent to these permissions before using your app. Other, optional permissions can be requested later at runtime (using dynamic consent).

This is the minimum list of permissions people will have to consent to for your app. There could be more, but these will always be required. For security and to help users and admins feel more comfortable using your app, never ask for anything you don’t need.

You can add or remove the permissions that appear in this table by using the steps outlined above or from [Other permissions granted](#other-permissions-granted) (described in the next section). As an admin, you can grant admin consent for the full set of an API's permissions that appear in the table, and revoke consent for individual permissions.

### Other permissions granted

You might also see a table titled **Other permissions granted for {your tenant}** on the **API permissions** pane. The **Other permissions granted for {your tenant}** table shows permissions granted tenant-wide for the tenant that haven't been explicitly configured on the application object. These permissions were dynamically requested and consented to by an admin, on behalf of all users. This section appears only if there is at least one permission that applies.

You can add the full set of an API's permissions or individual permissions appearing this table to the **Configured permissions** table. As an admin, you can revoke admin consent for APIs or individual permissions in this section.

### Admin consent button

The **Grant admin consent for {your tenant}** button allows an admin to grant admin consent to the permissions configured for the application. When you select the button, a dialog is shown requesting that you confirm the consent action.

:::image type="content" source="media/quickstart-configure-app-access-web-apis/portal-03-grant-admin-consent-button.png" alt-text="Grant admin consent button highlighted in the Configured permissions pane in the Azure portal":::

After granting consent, the permissions that required admin consent are shown as having consent granted:

:::image type="content" source="media/quickstart-configure-app-access-web-apis/portal-04-admin-consent-granted.png" alt-text="Configure permissions table in Azure portal showing admin consent granted for the Files.Read.All permission":::

The **Grant admin consent** button is *disabled* if you aren't an admin or if no permissions have been configured for the application. If you have permissions that have been granted but not yet configured, the admin consent button prompts you to handle these permissions. You can add them to configured permissions or remove them.

## Next steps

Advance to the next quickstart in the series to learn how to configure which account types can access your application. For example, you might want to limit access only to those users in your organization (single-tenant) or allow users in other Microsoft Entra tenants (multi-tenant) and those with personal Microsoft accounts (MSA).

> [!div class="nextstepaction"]
> [Modify the accounts supported by an application](./howto-modify-supported-accounts.md)
