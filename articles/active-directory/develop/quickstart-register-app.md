---
title: "Quickstart: Register an app in the Microsoft identity platform | Azure"
description: In this quickstart, you learn how to register an application with the Microsoft identity platform.
services: active-directory
author: mmacy
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity
ms.date: 09/03/2020
ms.author: marsma
ms.custom: aaddev, identityplatformtop40, contperfq1
ms.reviewer: aragra, lenalepa, sureshja
# Customer intent: As an enterprise developer or software-as-a-service (SaaS) provider, I want to
# know how to register my application with the Microsoft identity platform so that the security
# token service can issue ID and/or access tokens to clients that want to access it.
---

# Quickstart: Register an application with the Microsoft identity platform

In this quickstart, you register an app in the Azure portal so the Microsoft identity platform can provide authentication and authorization services for your application and its users.

Each application you want the Microsoft identity platform to perform identity and access management (IAM) for needs to be registered. Whether it's a client application like a web or mobile app, or it's a web API that backs a client app, registering it establishes a trust relationship between your application and the identity provider, the Microsoft identity platform.

## Prerequisites

* An Azure account with an active subscription - [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
* Completion of [Quickstart: Set up a tenant](quickstart-create-new-tenant.md)

## Register an application

Registering your application establishes a trust relationship between your app and the Microsoft identity platform. The trust is unidirectional: your app trusts the Microsoft identity platform, and not the other way around.

Follow these steps to create the app registration:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If you have access to multiple tenants, use the **Directory + subscription** filter :::image type="icon" source="./media/quickstart-register-app/portal-01-directory-subscription-filter.png" border="false"::: in the top menu to select the tenant in which you want to register an application.
1. Search for and select **Azure Active Directory**.
1. Under **Manage**, select **App registrations**, then **New registration**.
1. Enter a **Name** for your application. Users of your app might see this name, and you can change it later.
1. Specify who can use the application, sometimes referred to as the *sign-in audience*.

    | Supported account types | Description |
    |-------------------------|-------------|
    | **Accounts in this organizational directory only** | Select this option if you're building an application for use only by users (or guests) in *your* tenant.<br><br>Often called a *line-of-business* (LOB) application, this is a **single-tenant** application in the Microsoft identity platform. |
    | **Accounts in any organizational directory** | Select this option if you'd like users in *any* Azure AD tenant to be able to use your application. This option is appropriate if, for example, you're building a software-as-a-service (SaaS) application that you intend to provide to multiple organizations.<br><br>This is known as a **multi-tenant** application in the Microsoft identity platform. |
    | **Accounts in any organizational directory and personal Microsoft accounts** | Select this option to target the widest set of customers.<br><br>By selecting this option, you're registering a **multi-tenant** application that can also support users with personal **Microsoft accounts** (MSA). |
    | **Personal Microsoft accounts** | Select this option if you're building an application for use only by users with personal Microsoft accounts. Personal Microsoft accounts include Skype, Xbox, Live, and Hotmail accounts. |

1. Don't enter anything for **Redirect URI (optional)**, you'll configure one in the next section.
1. Select **Register** to complete the initial app registration.

    :::image type="content" source="media/quickstart-register-app/portal-02-app-reg-01.png" alt-text="Screenshot of the Azure portal in a web browser showing the Register an application pane.":::

When registration completes, the Azure portal displays the app registration's **Overview** pane, which includes its **Application (client) ID**. Also referred to as just *client ID*, this value uniquely identifies your application in the Microsoft identity platform.

Your application's code, or more typically an authentication library used in your application, also uses the client ID as one aspect in validating the security tokens it receives from the identity platform.

:::image type="content" source="media/quickstart-register-app/portal-03-app-reg-02.png" alt-text="Screenshot of the Azure portal in a web browser showing an app registration's Overview pane.":::

## Add a redirect URI

A redirect URI is the location where the Microsoft identity platform redirects a user's client and sends security tokens after authentication.

In a production web application, for example, the redirect URI is often a public endpoint where your app is running, like `https://contoso.com/auth-response`. During development, it's common to also add the endpoint where you run your app locally, like `https://127.0.0.1/auth-response` or `http://localhost/auth-response`.

You add and modify redirect URIs for your registered applications by configuring their [platform settings](#configure-platform-settings).

### Configure platform settings

Settings for each application type, including redirect URIs, are configured in **Platform configurations** in the Azure portal. Some platforms, like **Web** and **Single-page applications**, require you to manually specify a redirect URI. For other platforms like mobile and desktop, you can select from redirect URIs generated for you when you configure their other settings.

To configure application settings based on the platform or device you're targeting:

1. Select your application in **App registrations** in the Azure portal.
1. Under **Manage**, select **Authentication**.
1. Under **Platform configurations**, select **Add a platform**.
1. In **Configure platforms**, select the tile for your application type (platform) to configure its settings.

    :::image type="content" source="media/quickstart-register-app/portal-04-app-reg-03-platform-config.png" alt-text="Screenshot of the Platform configuration pane in the Azure portal" border="false":::

    | Platform | Configuration settings |
    | -------- | ---------------------- |
    | **Web** | Enter a **Redirect URI** for your app, the location where Microsoft identity platform redirects a user's client and sends security tokens after authentication.<br/><br/>Select this platform for standard web applications that run on a server. |
    | **Single-page application** | Enter a **Redirect URI** for your app, the location where Microsoft identity platform redirects a user's client and sends security tokens after authentication.<br/><br/>Select this platform if you're building a client-side web app in JavaScript or with a framework like Angular, Vue.js, React.js, or Blazor WebAssembly. |
    | **iOS / macOS** | Enter the app **Bundle ID**, found in XCode in *Info.plist* or Build Settings.<br/><br/>A redirect URI is generated for you when you specify a Bundle ID. |
    | **Android** | Enter the app **Package name**, which you can find in the *AndroidManifest.xml* file, and generate and enter the **Signature hash**.<br/><br/>A redirect URI is generated for you when you specify these settings. |
    | **Mobile and desktop applications** | Select one of the **Suggested redirect URIs** or specify a **Custom redirect URI**.<br/>For desktop applications, we recommend:<br/>`https://login.microsoftonline.com/common/oauth2/nativeclient`<br/><br/>Select this platform for mobile applications that aren't using the latest Microsoft Authentication Library (MSAL) or are not using a broker. Also select this platform for desktop applications. |
1. Select **Configure** to complete the platform configuration.

### Redirect URI restrictions

There are certain restrictions on the format of the redirect URIs you add to an app registration. For details on these restrictions, see [Redirect URI (reply URL) restrictions and limitations](reply-url.md).

## Add credentials

Credentials are used by confidential client applications that access a web API. Examples of confidential clients are web apps, other web APIs, or service- and daemon-type applications. Credentials allow your application to authenticate as itself, requiring no interaction from a user at runtime.

You can add both certificates and client secrets (a string) as credentials to your confidential client app registration.

:::image type="content" source="media/quickstart-register-app/portal-05-app-reg-04-credentials.png" alt-text="Screenshot of Azure portal showing the Certificates and secrets pane in an App registration":::

### Add a certificate

Sometimes called a *public key*, certificates are the recommended credential type as they provide a higher level of assurance than a client secret.

1. Select your application in **App registrations** in the Azure portal.
1. Select **Certificates & secrets** > **Upload certificate**.
1. Select the file you'd like to upload. It must be one of the following file types: .cer, .pem, .crt.
1. Select **Add**.

### Add a client secret

The client secret, known also as an *application password*, is a string value your app can use in place of a certificate to identity itself. It's the easier of the two credential types to use and is often used during development, but is considered less secure than a certificate. You should use certificates in your applications running in production.

1. Select your application in **App registrations** in the Azure portal.
1. Select **Certificates & secrets** >  **New client secret**.
1. Add a description for your client secret.
1. Select a duration.
1. Select **Add**.
1. **Record the secret's value** for use in your client application code - it's *never displayed again* after you leave this page.

## Next steps

Client applications typically need to access resources in a web API. In addition to protecting your client application with the Microsoft identity platform, you can use the platform for authorizing scoped, permissions-based access to your web API.

Move on to the next quickstart in the series to create another app registration for your web API and expose its scopes.

> [!div class="nextstepaction"]
> [Configure an application to expose a web API](quickstart-configure-app-expose-web-apis.md)
