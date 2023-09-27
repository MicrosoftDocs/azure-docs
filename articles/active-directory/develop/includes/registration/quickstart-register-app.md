---
title: "Quickstart: Register an app in the Microsoft identity platform"
description: In this quickstart, you learn how to register an application with the Microsoft identity platform.
services: active-directory
author: cilwerner
manager: CelesteDG
ms.author: cwerner
ms.date: 06/29/2023
ms.topic: include
ms.service: active-directory
ms.subservice: develop
ms.workload: identity

# This include file is currently referenced in the following documentation:

# https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app
# https://learn.microsoft.com/en-us/graph/auth-register-app-v2
---

Get started with the Microsoft identity platform by registering an application in the Azure portal.

The Microsoft identity platform performs identity and access management (IAM) only for registered applications. Whether it's a client application like a web or mobile app, or it's a web API that backs a client app, registering it establishes a trust relationship between your application and the identity provider, the Microsoft identity platform.

> [!TIP]
> To register an application for Azure AD B2C, follow the steps in [Tutorial: Register a web application in Azure AD B2C](../../../../active-directory-b2c/tutorial-register-applications.md).

## Prerequisites

- An Azure account that has an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- The Azure account must be at least a [Cloud application administrator](../../../../active-directory/roles/permissions-reference.md#cloud-application-administrator).
- Completion of the [Set up a tenant](../../../../active-directory/develop/quickstart-create-new-tenant.md) quickstart.

## Register an application

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Registering your application establishes a trust relationship between your app and the Microsoft identity platform. The trust is unidirectional: your app trusts the Microsoft identity platform, and not the other way around. Once created, the application object cannot be moved between different tenants. 

Follow these steps to create the app registration:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../../../../active-directory/roles/permissions-reference.md#cloud-application-administrator). 
1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="../../media/quickstart-configure-app-access-web-apis/portal-01-directory-subscription-filter.png" border="false"::: in the top menu to select the tenant containing your client app's registration.
1. Browse to **Identity** > **Applications** > **App registrations** and select **New registration**.
1. Enter a display **Name** for your application. Users of your application might see the display name when they use the app, for example during sign-in.
   You can change the display name at any time and multiple app registrations can share the same name. The app registration's automatically generated Application (client) ID, not its display name, uniquely identifies your app within the identity platform.
1. Specify who can use the application, sometimes called its _sign-in audience_.

   | Supported account types                                                      | Description                                                                                                                                                                                                                                                                                                                                                                                 |
   | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Accounts in this organizational directory only**                           | Select this option if you're building an application for use only by users (or guests) in _your_ tenant.<br><br>Often called a _line-of-business_ (LOB) application, this app is a _single-tenant_ application in the Microsoft identity platform.                                                                                                                                          |
   | **Accounts in any organizational directory**                                 | Select this option if you want users in _any_ Microsoft Entra tenant to be able to use your application. This option is appropriate if, for example, you're building a software-as-a-service (SaaS) application that you intend to provide to multiple organizations.<br><br>This type of app is known as a _multitenant_ application in the Microsoft identity platform. |
   | **Accounts in any organizational directory and personal Microsoft accounts** | Select this option to target the widest set of customers.<br><br>By selecting this option, you're registering a _multitenant_ application that can also support users who have personal _Microsoft accounts_. Personal Microsoft accounts include Skype, Xbox, Live, and Hotmail accounts.                                                                                                                                                                              |
   | **Personal Microsoft accounts**                                              | Select this option if you're building an application only for users who have personal Microsoft accounts. Personal Microsoft accounts include Skype, Xbox, Live, and Hotmail accounts.                                                                                                                                                                                                      |

1. Don't enter anything for **Redirect URI (optional)**. You'll configure a redirect URI in the next section.
1. Select **Register** to complete the initial app registration.

   :::image type="content" source="/azure/active-directory/develop/media/quickstart-register-app/portal-02-app-reg-01.png" alt-text="Screenshot of the Azure portal in a web browser, showing the Register an application pane.":::

When registration finishes, the Microsoft Entra admin center displays the app registration's **Overview** pane. You see the **Application (client) ID**. Also called the _client ID_, this value uniquely identifies your application in the Microsoft identity platform.

> [!IMPORTANT]
> New app registrations are hidden to users by default. When you are ready for users to see the app on their [My Apps page](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510) you can enable it. To enable the app, in the Microsoft Entra admin center navigate to **Identity** > **Applications** > **Enterprise applications** and select the app. Then on the **Properties** page toggle **Visible to users?** to Yes.

Your application's code, or more typically an authentication library used in your application, also uses the client ID. The ID is used as part of validating the security tokens it receives from the identity platform.

:::image type="content" source="/azure/active-directory/develop/media/quickstart-register-app/portal-03-app-reg-02.png" alt-text="Screenshot of the Azure portal in a web browser, showing an app registration's Overview pane.":::

## Add a redirect URI

A _redirect URI_ is the location where the Microsoft identity platform redirects a user's client and sends security tokens after authentication.

In a production web application, for example, the redirect URI is often a public endpoint where your app is running, like `https://contoso.com/auth-response`. During development, it's common to also add the endpoint where you run your app locally, like `https://127.0.0.1/auth-response` or `http://localhost/auth-response`. Be sure that any unnecessary development environments/redirect URIs are not exposed in the production app. This can be done by having separate app registrations for development and production.

You add and modify redirect URIs for your registered applications by configuring their [platform settings](#configure-platform-settings).

### Configure platform settings

Settings for each application type, including redirect URIs, are configured in **Platform configurations** in the Azure portal. Some platforms, like **Web** and **Single-page applications**, require you to manually specify a redirect URI. For other platforms, like mobile and desktop, you can select from redirect URIs generated for you when you configure their other settings.

To configure application settings based on the platform or device you're targeting, follow these steps:

1. In the Microsoft Entra admin center, in **App registrations**, select your application.
1. Under **Manage**, select **Authentication**.
1. Under **Platform configurations**, select **Add a platform**.
1. Under **Configure platforms**, select the tile for your application type (platform) to configure its settings.

   :::image type="content" source="/azure/active-directory/develop/media/quickstart-register-app/portal-04-app-reg-03-platform-config.png" alt-text="Screenshot of the platform configuration pane in the Azure portal." border="false":::

   | Platform                            | Configuration settings                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
   | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Web**                             | Enter a **Redirect URI** for your app. This URI is the location where the Microsoft identity platform redirects a user's client and sends security tokens after authentication.<br/><br/>Front-channel logout URL and implicit and hybrid flow properties can also be configured.<br/><br/>Select this platform for standard web applications that run on a server.                                                                                                                                                                                                                                                                   |
   | **Single-page application**         | Enter a **Redirect URI** for your app. This URI is the location where the Microsoft identity platform redirects a user's client and sends security tokens after authentication.<br/><br/>Front-channel logout URL and implicit and hybrid flow properties can also be configured.<br/><br/>Select this platform if you're building a client-side web app by using JavaScript or a framework like Angular, Vue.js, React.js, or Blazor WebAssembly.                                                                                                                                                                                    |
   | **iOS / macOS**                     | Enter the app **Bundle ID**. Find it in **Build Settings** or in Xcode in _Info.plist_.<br/><br/>A redirect URI is generated for you when you specify a **Bundle ID**.                                                                                                                                                                                                                                                                                                                                                              |
   | **Android**                         | Enter the app **Package name**. Find it in the _AndroidManifest.xml_ file. Also generate and enter the **Signature hash**.<br/><br/>A redirect URI is generated for you when you specify these settings.                                                                                                                                                                                                                                                                                                                            |
   | **Mobile and desktop applications** | Select one of the suggested **Redirect URIs**. Or specify on or more **Custom redirect URIs**.<br/><br/>For desktop applications using embedded browser, we recommend<br/>`https://login.microsoftonline.com/common/oauth2/nativeclient`<br/><br/>For desktop applications using system browser, we recommend<br/>`http://localhost`<br/><br/>Select this platform for mobile applications that aren't using the latest Microsoft Authentication Library (MSAL) or aren't using a broker. Also select this platform for desktop applications. |

1. Select **Configure** to complete the platform configuration.

### Redirect URI restrictions

There are some restrictions on the format of the redirect URIs you add to an app registration. For details about these restrictions, see [Redirect URI (reply URL) restrictions and limitations](../../reply-url.md).

## Add credentials

Credentials are used by [confidential client applications](../../msal-client-applications.md) that access a web API. Examples of confidential clients are web apps, other web APIs, or service-type and daemon-type applications. Credentials allow your application to authenticate as itself, requiring no interaction from a user at runtime.

You can add certificates, client secrets (a string), or federated identity credentials as credentials to your confidential client app registration.

:::image type="content" source="/azure/active-directory/develop/media/quickstart-register-app/portal-05-app-reg-04-credentials.png" alt-text="Screenshot of the Azure portal, showing the Certificates and secrets pane in an app registration.":::

### Add a certificate

Sometimes called a _public key_, a certificate is the recommended credential type because they're considered more secure than client secrets. For more information about using a certificate as an authentication method in your application, see [Microsoft identity platform application authentication certificate credentials](../../certificate-credentials.md).

1. In the Microsoft Entra admin center, in **App registrations**, select your application.
2. Select **Certificates & secrets** > **Certificates** > **Upload certificate**.
3. Select the file you want to upload. It must be one of the following file types: _.cer_, _.pem_, _.crt_.
4. Select **Add**.

### Add a client secret

Sometimes called an _application password_, a client secret is a string value your app can use in place of a certificate to identity itself.

Client secrets are considered less secure than certificate credentials. Application developers sometimes use client secrets during local app development because of their ease of use. However, you should use certificate credentials for any of your applications that are running in production.

1. In the Microsoft Entra admin center, in **App registrations**, select your application.
1. Select **Certificates & secrets** > **Client secrets** > **New client secret**.
1. Add a description for your client secret.
1. Select an expiration for the secret or specify a custom lifetime.
    - Client secret lifetime is limited to two years (24 months) or less. You can't specify a custom lifetime longer than 24 months.
    - Microsoft recommends that you set an expiration value of less than 12 months.
1. Select **Add**.
1. _Record the secret's value_ for use in your client application code. This secret value is _never displayed again_ after you leave this page.

For application security recommendations, see [Microsoft identity platform best practices and recommendations](../../identity-platform-integration-checklist.md#security).

If you're using an Azure DevOps service connection that automatically creates a service principal, you need to update the client secret from the Azure DevOps portal site instead of directly updating the client secret. Refer to this document on how to update the client secret from the Azure DevOps portal site:
[Troubleshoot Azure Resource Manager service connections](/azure/devops/pipelines/release/azure-rm-endpoint#service-principals-token-expired).

### Add a federated credential

Federated identity credentials are a type of credential that allows workloads, such as GitHub Actions, workloads running on Kubernetes, or workloads running in compute platforms outside of Azure access Microsoft Entra protected resources without needing to manage secrets using [workload identity federation](/azure/active-directory/workload-identities/workload-identity-federation).

To add a federated credential, follow these steps:

1. In the Microsoft Entra admin center, in **App registrations**, select your application.
1. Select **Certificates & secrets** > **Federated credentials** > **Add credential**.
1. In the **Federated credential scenario** drop-down box, select one of the supported scenarios, and follow the corresponding guidance to complete the configuration.

    - **Customer managed keys** for encrypt data in your tenant using Azure Key Vault in another tenant.
    - **GitHub actions deploying Azure resources** to [configure a GitHub workflow](../../../workload-identities/workload-identity-federation-create-trust.md#github-actions) to get tokens for your application and deploy assets to Azure.
    - **Kubernetes accessing Azure resources** to configure a [Kubernetes service account](../../../workload-identities/workload-identity-federation-create-trust.md#kubernetes) to get tokens for your application and access Azure resources.
    - **Other issuer** to configure an identity managed by an external [OpenID Connect provider](../../../workload-identities/workload-identity-federation-create-trust.md#other-identity-providers) to get tokens for your application and access Azure resources.
    

For more information, how to get an access token with a federated credential, check out the [Microsoft identity platform and the OAuth 2.0 client credentials flow](../../v2-oauth2-client-creds-grant-flow.md#third-case-access-token-request-with-a-federated-credential) article.
