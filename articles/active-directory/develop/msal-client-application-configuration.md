---
title: Client application configuration (MSAL) | Azure
titleSuffix: Microsoft identity platform
description: Learn about configuration options for public client and confidential client applications using the Microsoft Authentication Library (MSAL).
services: active-directory
author: mmacy
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 09/27/2019
ms.author: marsma
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about the types of client applications so I can decide if this platform meets my app development needs.
---

# Application configuration options

In your code, you initialize a new public or confidential client application (or user-agent for MSAL.js) to authenticate and acquire tokens. You can set a number of configuration options when you initialize the client app in Microsoft Authentication Library (MSAL). These options fall into two groups:

- Registration options, including:
    - [Authority](#authority) (composed of the identity provider [instance](#cloud-instance) and sign-in [audience](#application-audience) for the app, and possibly the tenant ID).
    - [Client ID](#client-id).
    - [Redirect URI](#redirect-uri).
    - [Client secret](#client-secret) (for confidential client applications).
- [Logging options](#logging), including log level, control of personal data, and the name of the component using the library.

## Authority

The authority is a URL that indicates a directory that MSAL can request tokens from. Common authorities are:

- https\://login.microsoftonline.com/\<tenant\>/, where &lt;tenant&gt; is the tenant ID of the Azure Active Directory (Azure AD) tenant or a domain associated with this Azure AD tenant. Used only to sign in users of a specific organization.
- https\://login.microsoftonline.com/common/. Used to sign in users with work and school accounts or personal Microsoft accounts.
- https\://login.microsoftonline.com/organizations/. Used to sign in users with work and school accounts.
- https\://login.microsoftonline.com/consumers/. Used to sign in users with only personal Microsoft accounts (formerly known as Windows Live ID accounts).

The authority setting needs to be consistent with what's declared in the application registration portal.

The authority URL is composed of the instance and the audience.

The authority can be:
- An Azure AD cloud authority.
- An Azure AD B2C authority. See [B2C specifics](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/AAD-B2C-specifics).
- An Active Directory Federation Services (AD FS) authority. See [AD FS support](https://aka.ms/msal-net-adfs-support).

Azure AD cloud authorities have two parts:
- The identity provider *instance*
- The sign-in *audience* for the app

The instance and audience can be concatenated and provided as the authority URL. In versions of MSAL.NET earlier than MSAL 3.*x*, you had to compose the authority yourself, based on the cloud you wanted to target and the sign-in audience.  This diagram shows how the authority URL is composed:

![How the authority URL is composed](media/msal-client-application-configuration/authority.png)

## Cloud instance

The *instance* is used to specify if your app is signing users from the Azure public cloud or from national clouds. Using MSAL in your code, you can set the Azure cloud instance by using an enumeration or by passing the URL to the [national cloud instance](authentication-national-cloud.md#azure-ad-authentication-endpoints) as the `Instance` member (if you know it).

MSAL.NET will throw an explicit exception if both `Instance` and `AzureCloudInstance` are specified.

If you don't specify an instance, your app will target the Azure public cloud instance (the instance of URL `https://login.onmicrosoftonline.com`).

## Application audience

The sign-in audience depends on the business needs for your app:
- If you're a line of business (LOB) developer, you'll probably produce a single-tenant application that will be used only in your organization. In that case, you need to specify the organization, either by its tenant ID (the ID of your Azure AD instance) or by a domain name associated with the Azure AD instance.
- If you're an ISV, you might want to sign in users with their work and school accounts in any organization or in some organizations (multitenant app). But you might also want to have users sign in with their personal Microsoft accounts.

### How to specify the audience in your code/configuration

Using MSAL in your code, you specify the audience by using one of the following values:
- The Azure AD authority audience enumeration
- The tenant ID, which can be:
  - A GUID (the ID of your Azure AD instance), for single-tenant applications
  - A domain name associated with your Azure AD instance (also for single-tenant applications)
- One of these placeholders as a tenant ID in place of the Azure AD authority audience enumeration:
    - `organizations` for a multitenant application
    - `consumers` to sign in users only with their personal accounts
    - `common` to sign in users with their work and school accounts or their personal Microsoft accounts

MSAL will throw a meaningful exception if you specify both the Azure AD authority audience and the tenant ID.

If you don't specify an audience, your app will target Azure AD and personal Microsoft accounts as an audience. (That is, it will behave as though `common` were specified.)

### Effective audience

The effective audience for your application will be the minimum (if there's an intersection) of the audience you set in your app and the audience that's specified in the app registration. In fact, the [App registrations](https://aka.ms/appregistrations) experience lets you specify the audience (the supported account types) for the app. For more information, see [Quickstart: Register an application with the Microsoft identity platform](quickstart-register-app.md).

Currently, the only way to get an app to sign in users with only personal Microsoft accounts is to configure both of these settings:
- Set the app registration audience to `Work and school accounts and personal accounts`.
- Set the audience in your code/configuration to `AadAuthorityAudience.PersonalMicrosoftAccount` (or `TenantID` ="consumers").

## Client ID

The client ID is the unique application (client) ID assigned to your app by Azure AD when the app was registered.

## Redirect URI

The redirect URI is the URI the identity provider will send the security tokens back to.

### Redirect URI for public client apps

If you're a public client app developer who's using MSAL:
- You'd want to use `.WithDefaultRedirectUri()` in desktop or UWP applications (MSAL.NET 4.1+). This method will set the public client application's
  redirect uri property to the default recommended redirect uri for public client applications.

  Platform  | Redirect URI
  ---------  | --------------
  Desktop app (.NET FW) | `https://login.microsoftonline.com/common/oauth2/nativeclient`
  UWP | value of `WebAuthenticationBroker.GetCurrentApplicationCallbackUri()`. This enables SSO with the browser by setting the value to the result of WebAuthenticationBroker.GetCurrentApplicationCallbackUri() which you need to register
  .NET Core | `https://localhost`. This enables the user to use the system browser for interactive authentication since .NET Core doesn't have a UI for the embedded web view at the moment.

- You don't need to add a redirect URI if you're building a Xamarin Android and iOS application that doesn't support broker (the
  redirect URI is automatically set to `msal{ClientId}://auth` for Xamarin Android and iOS

- You need to configure the redirect URI in [App registrations](https://aka.ms/appregistrations):

   ![Redirect URI in App registrations](media/msal-client-application-configuration/redirect-uri.png)

You can override the redirect URI by using the `RedirectUri` property (for example, if you use brokers). Here are some examples of redirect URIs for that scenario:

- `RedirectUriOnAndroid` = "msauth-5a434691-ccb2-4fd1-b97b-b64bcfbc03fc://com.microsoft.identity.client.sample";
- `RedirectUriOnIos` = $"msauth.{Bundle.ID}://auth";

For additional iOS details, see [Migrate iOS applications that use Microsoft Authenticator from ADAL.NET to MSAL.NET](msal-net-migration-ios-broker.md) and [Leveraging the broker on iOS](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/Leveraging-the-broker-on-iOS).
For additional Android details, see [Brokered auth in Android](brokered-auth.md).

### Redirect URI for confidential client apps

For web apps, the redirect URI (or reply URI) is the URI that Azure AD will use to send the token back to the application. This URI can be the URL of the web app/web API if the confidential app is one of these. The redirect URI needs to be registered in app registration. This registration is especially important when you deploy an app that you've initially tested locally. You then need to add the reply URL of the deployed app in the application registration portal.

For daemon apps, you don't need to specify a redirect URI.

## Client secret

This option specifies the client secret for the confidential client app. This secret (app password) is provided by the application registration portal or provided to Azure AD during app registration with PowerShell AzureAD, PowerShell AzureRM, or Azure CLI.

## Logging

The other configuration options enable logging and troubleshooting. See the [Logging](msal-logging.md) article for details on how to use them.

## Next steps

Learn about [instantiating client applications by using MSAL.NET](msal-net-initializing-client-applications.md).
Learn about [instantiating client applications by using MSAL.js](msal-js-initializing-client-applications.md).
