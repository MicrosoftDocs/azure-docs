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
ms.custom: aaddev, identityplatformtop40, contperf-fy21q1, contperf-fy21q2
ms.reviewer: aragra, lenalepa, sureshja
# Customer intent: As an enterprise developer or software-as-a-service (SaaS) provider, I want to
# know how to register my application with the Microsoft identity platform so that the security
# token service can issue ID and/or access tokens to clients that want to access it.
---

# Quickstart: Register an application with the Microsoft identity platform

In this quickstart, you register an app in the Azure portal so the Microsoft identity platform can provide authentication and authorization services for your application and its users.

The Microsoft identity platform performs identity and access management (IAM) only for registered applications. Whether it's a client application like a web or mobile app, or it's a web API that backs a client app, registering it establishes a trust relationship between your application and the identity provider, the Microsoft identity platform.

## Prerequisites

* An Azure account that has an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Completion of the [Set up a tenant](quickstart-create-new-tenant.md) quickstart.

## Register an application

Registering your application establishes a trust relationship between your app and the Microsoft identity platform. The trust is unidirectional: your app trusts the Microsoft identity platform, and not the other way around.

Follow these steps to create the app registration:

1. Sign in to the <a href="https://portal.azure.com/" target="_blank">Azure portal</a>.
1. If you have access to multiple tenants, in the top menu, use the **Directory + subscription** filter :::image type="icon" source="./media/common/portal-directory-subscription-filter.png" border="false"::: to select the tenant in which you want to register an application.
1. Search for and select **Azure Active Directory**.
1. Under **Manage**, select **App registrations** > **New registration**.
1. Enter a display **Name** for your application. Users of your application might see the display name when they use the app, for example during sign-in.
    You can change the display name at any time and multiple app registrations can share the same name. The app registration's automatically generated Application (client) ID, not its display name, uniquely identifies your app within the identity platform.
1. Specify who can use the application, sometimes called its *sign-in audience*.

    | Supported account types | Description |
    |-------------------------|-------------|
    | **Accounts in this organizational directory only** | Select this option if you're building an application for use only by users (or guests) in *your* tenant.<br><br>Often called a *line-of-business* (LOB) application, this app is a *single-tenant* application in the Microsoft identity platform. |
    | **Accounts in any organizational directory** | Select this option if you want users in *any* Azure Active Directory (Azure AD) tenant to be able to use your application. This option is appropriate if, for example, you're building a software-as-a-service (SaaS) application that you intend to provide to multiple organizations.<br><br>This type of app is known as a *multitenant* application in the Microsoft identity platform. |
    | **Accounts in any organizational directory and personal Microsoft accounts** | Select this option to target the widest set of customers.<br><br>By selecting this option, you're registering a *multitenant* application that can also support users who have personal *Microsoft accounts*. |
    | **Personal Microsoft accounts** | Select this option if you're building an application only for users who have personal Microsoft accounts. Personal Microsoft accounts include Skype, Xbox, Live, and Hotmail accounts. |

1. Don't enter anything for **Redirect URI (optional)**. You'll configure a redirect URI in the next section.
1. Select **Register** to complete the initial app registration.

    :::image type="content" source="media/quickstart-register-app/portal-02-app-reg-01.png" alt-text="Screenshot of the Azure portal in a web browser, showing the Register an application pane.":::

When registration finishes, the Azure portal displays the app registration's **Overview** pane. You see the **Application (client) ID**. Also called the *client ID*, this value uniquely identifies your application in the Microsoft identity platform.

Your application's code, or more typically an authentication library used in your application, also uses the client ID. The ID is used as part of validating the security tokens it receives from the identity platform.

:::image type="content" source="media/quickstart-register-app/portal-03-app-reg-02.png" alt-text="Screenshot of the Azure portal in a web browser, showing an app registration's Overview pane.":::

## Add a redirect URI

A *redirect URI* is the location where the Microsoft identity platform redirects a user's client and sends security tokens after authentication.

In a production web application, for example, the redirect URI is often a public endpoint where your app is running, like `https://contoso.com/auth-response`. During development, it's common to also add the endpoint where you run your app locally, like `https://127.0.0.1/auth-response` or `http://localhost/auth-response`.

You add and modify redirect URIs for your registered applications by configuring their [platform settings](#configure-platform-settings).

### Configure platform settings

Settings for each application type, including redirect URIs, are configured in **Platform configurations** in the Azure portal. Some platforms, like **Web** and **Single-page applications**, require you to manually specify a redirect URI. For other platforms, like mobile and desktop, you can select from redirect URIs generated for you when you configure their other settings.

To configure application settings based on the platform or device you're targeting:

1. In the Azure portal, in **App registrations**, select your application.
1. Under **Manage**, select **Authentication**.
1. Under **Platform configurations**, select **Add a platform**.
1. Under **Configure platforms**, select the tile for your application type (platform) to configure its settings.

    :::image type="content" source="media/quickstart-register-app/portal-04-app-reg-03-platform-config.png" alt-text="Screenshot of the platform configuration pane in the Azure portal." border="false":::

    | Platform | Configuration settings |
    | -------- | ---------------------- |
    | **Web** | Enter a **Redirect URI** for your app. This URI is the location where the Microsoft identity platform redirects a user's client and sends security tokens after authentication.<br/><br/>Select this platform for standard web applications that run on a server. |
    | **Single-page application** | Enter a **Redirect URI** for your app. This URI is the location where the Microsoft identity platform redirects a user's client and sends security tokens after authentication.<br/><br/>Select this platform if you're building a client-side web app by using JavaScript or a framework like Angular, Vue.js, React.js, or Blazor WebAssembly. |
    | **iOS / macOS** | Enter the app **Bundle ID**. Find it in **Build Settings** or in Xcode in *Info.plist*.<br/><br/>A redirect URI is generated for you when you specify a **Bundle ID**. |
    | **Android** | Enter the app **Package name**. Find it in the *AndroidManifest.xml* file. Also generate and enter the **Signature hash**.<br/><br/>A redirect URI is generated for you when you specify these settings. |
    | **Mobile and desktop applications** | Select one of the **Suggested redirect URIs**. Or specify a **Custom redirect URI**.<br/><br/>For desktop applications using embedded browser, we recommend<br/>`https://login.microsoftonline.com/common/oauth2/nativeclient`<br/><br/>For desktop applications using system browser, we recommend<br/>`http://localhost`<br/><br/>Select this platform for mobile applications that aren't using the latest Microsoft Authentication Library (MSAL) or aren't using a broker. Also select this platform for desktop applications. |
1. Select **Configure** to complete the platform configuration.

### Redirect URI restrictions

There are some restrictions on the format of the redirect URIs you add to an app registration. For details about these restrictions, see [Redirect URI (reply URL) restrictions and limitations](reply-url.md).

## Add credentials

Credentials are used by [confidential client applications](msal-client-applications.md) that access a web API. Examples of confidential clients are [web apps](scenario-web-app-call-api-overview.md), other [web APIs](scenario-protected-web-api-overview.md), or [service-type and daemon-type applications](scenario-daemon-overview.md). Credentials allow your application to authenticate as itself, requiring no interaction from a user at runtime. 

You can add both certificates and client secrets (a string) as credentials to your confidential client app registration.

:::image type="content" source="media/quickstart-register-app/portal-05-app-reg-04-credentials.png" alt-text="Screenshot of the Azure portal, showing the Certificates and secrets pane in an app registration.":::

### Add a certificate

Sometimes called a *public key*, a certificate is the recommended credential type. It provides more assurance than a client secret. For more information about using a certificate as an authentication method in your application, see [Microsoft identity platform application authentication certificate credentials](active-directory-certificate-credentials.md).

1. In the Azure portal, in **App registrations**, select your application.
1. Select **Certificates & secrets** > **Upload certificate**.
1. Select the file you want to upload. It must be one of the following file types: *.cer*, *.pem*, *.crt*.
1. Select **Add**.

### Add a client secret

The client secret is also known as an *application password*. It's a string value your app can use in place of a certificate to identity itself. The client secret is the easier of the two credential types to use. It's often used during development, but it's considered less secure than a certificate. Use certificates in your applications that are running in production. 

For more information about application security recommendations, see [Microsoft identity platform best practices and recommendations](identity-platform-integration-checklist.md#security).

1. In the Azure portal, in **App registrations**, select your application.
1. Select **Certificates & secrets** >  **New client secret**.
1. Add a description for your client secret.
1. Select a duration.
1. Select **Add**.
1. *Record the secret's value* for use in your client application code. This secret value is *never displayed again* after you leave this page.


## Next steps

Client applications typically need to access resources in a web API. You can protect your client application by using the Microsoft identity platform. You can also use the platform for authorizing scoped, permissions-based access to your web API.

Go to the next quickstart in the series to create another app registration for your web API and expose its scopes.

> [!div class="nextstepaction"]
> [Configure an application to expose a web API](quickstart-configure-app-expose-web-apis.md)
