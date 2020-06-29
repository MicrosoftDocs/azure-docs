---
title: Code samples for Microsoft identity platform
description: Provides an index of available Microsoft identity platform (v2.0 endpoint) code samples, organized by scenario.
services: active-directory
author: mmacy
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: sample
ms.workload: identity
ms.date: 06/01/2020
ms.author: marsma
ms.reviewer: jmprieur
ms.custom: aaddev, identityplatformtop40
---

# Microsoft identity platform code samples (v2.0 endpoint)

You can use Microsoft identity platform to:

- Add authentication and authorization to your web applications and web APIs.
- Require an access token to access a protected web API.

This article briefly describes and provides you with links to samples for the Microsoft identity platform endpoint. These samples show you how it's done, and also provide code snippets that you can use in your applications. On the code sample page, you'll find detailed readme topics that help with requirements, installation, and setup. Comments within the code help you understand the critical sections.

> [!NOTE]
> If you're interested in v1.0 samples, see [Azure AD code samples (v1.0 endpoint)](../azuread-dev/sample-v1-code.md).

To understand the basic scenario for each sample type, see [App types for the Microsoft identity platform endpoint](v2-app-types.md).

You can also contribute to the samples on GitHub. To learn how, see [Microsoft Azure Active Directory samples and documentation](https://github.com/Azure-Samples?page=3&query=active-directory).

## Single-page applications

These samples show how to write a single-page application secured with Microsoft identity platform. These samples use one of the flavors of MSAL.js.

| Platform | Description | Link |
| -------- | --------------------- | -------- |
| ![This image shows the JavaScript logo](media/sample-v2-code/logo_js.png) [JavaScript (msal.js)](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-core) | SPA calls Microsoft Graph |[javascript-graphapi-v2](https://github.com/Azure-Samples/active-directory-javascript-graphapi-v2) |
| ![This image shows the JavaScript logo](media/sample-v2-code/logo_js.png) [JavaScript (msal.js)](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-core) | SPA calls Microsoft Graph using Auth Code Flow w/ PKCE |[javascript-v2](https://github.com/Azure-Samples/ms-identity-javascript-v2) |
| ![This image shows the JavaScript logo](media/sample-v2-code/logo_js.png) [JavaScript (msal.js)](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-core) | SPA calls B2C |[b2c-javascript-msal-singlepageapp](https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp) |
| ![This image shows the Angular logo](media/sample-v2-code/logo_angular.png) [JavaScript (MSAL Angular)](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular)| SPA calls Microsoft Graph  | [active-directory-javascript-singlepageapp-angular](https://github.com/Azure-Samples/active-directory-javascript-singlepageapp-angular) |
| ![This image shows the Angular logo](media/sample-v2-code/logo_angular.png) [JavaScript (MSAL Angular)](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular)| SPA calls custom Web API | [ms-identity-javascript-angular-spa-aspnetcore-webapi](https://github.com/Azure-Samples/ms-identity-javascript-angular-spa-aspnetcore-webapi) |
| ![This image shows the Angular logo](media/sample-v2-code/logo_angular.png) [JavaScript (MSAL Angular)](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular) | SPA calls B2C |[active-directory-b2c-javascript-angular-spa](https://github.com/Azure-Samples/active-directory-b2c-javascript-angular-spa) |
| ![This image shows the React logo](media/sample-v2-code/logo_react.png) [JavaScript (msal.js)](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-core)| SPA calls custom Web API which in turn calls Microsoft Graph  | [ms-identity-javascript-react-spa-dotnetcore-webapi-obo](https://github.com/Azure-Samples/ms-identity-javascript-react-spa-dotnetcore-webapi-obo) |
| ![This image shows the Angular logo](media/sample-v2-code/logo_angular.png) [JavaScript (MSAL Angular)](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular) | Multi-tenant SPA calls multi-tenant custom Web API |[ms-identity-javascript-angular-spa-aspnet-webapi-multitenant](https://github.com/Azure-Samples/ms-identity-javascript-angular-spa-aspnet-webapi-multitenant) |
| ![This image shows the Angular logo](media/sample-v2-code/logo_angular.png) [JavaScript (MSAL Angular)](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular) | SPA calls custom Web API with App Roles and Security Groups |[ms-identity-javascript-angular-spa-dotnetcore-webapi-roles-groups](https://github.com/Azure-Samples/ms-identity-javascript-angular-spa-dotnetcore-webapi-roles-groups) |

## Web applications

The following samples illustrate web applications that sign in users. Some samples also demonstrate the application calling Microsoft Graph, or your own web API with the user's identity.

| Platform | Only signs in users | Signs in users and calls Microsoft Graph |
| -------- | ------------------- | --------------------------------- |
| ![This image shows the ASP.NET Core logo](media/sample-v2-code/logo_NETcore.png)</p>ASP.NET Core | [ASP.NET Core WebApp signs-in users tutorial](https://aka.ms/aspnetcore-webapp-sign-in) | Same sample in the [ASP.NET Core web app calls Microsoft Graph](https://aka.ms/aspnetcore-webapp-call-msgraph) phase |
| ![This image shows the ASP.NET logo](media/sample-v2-code/logo_NETframework.png)</p> ASP.NET | [ASP.NET Quickstart](https://github.com/AzureAdQuickstarts/AppModelv2-WebApp-OpenIDConnect-DotNet) </p> [dotnet-webapp-openidconnect-v2](https://github.com/azure-samples/active-directory-dotnet-webapp-openidconnect-v2)  |  [dotnet-admin-restricted-scopes-v2](https://github.com/azure-samples/active-directory-dotnet-admin-restricted-scopes-v2) </p> |[msgraph-training-aspnetmvcapp](https://github.com/microsoftgraph/msgraph-training-aspnetmvcapp)
| ![This image shows the Java logo](media/sample-v2-code/logo_java.png)  |                   | [ms-identity-java-webapp](https://github.com/Azure-Samples/ms-identity-java-webapp) |
| ![This image shows the Python logo](media/sample-v2-code/logo_python.png)  |                   | [ms-identity-python-webapp](https://github.com/Azure-Samples/ms-identity-python-webapp) |
| ![This image shows the Ruby logo](media/sample-v2-code/logo_ruby.png) |                   | [msgraph-training-rubyrailsapp](https://github.com/microsoftgraph/msgraph-training-rubyrailsapp) |

## Desktop and mobile public client apps

The following samples show public client applications (desktop or mobile applications) that access the Microsoft Graph API, or your own web API in the name of a user. All these client applications use Microsoft Authentication Library (MSAL).

| Client application | Platform | Flow/Grant | Calls Microsoft Graph | Calls an ASP.NET Core web API |
| ------------------ | -------- |  ----------| ---------- | ------------------------- |
| Desktop (WPF)      | ![This image shows the .NET/C# logo](media/sample-v2-code/logo_NET.png) | [interactive](msal-authentication-flows.md#interactive)| [dotnet-desktop-msgraph-v2](https://github.com/azure-samples/active-directory-dotnet-desktop-msgraph-v2) | [dotnet-native-aspnetcore-v2](https://aka.ms/msidentity-aspnetcore-webapi) |
| Desktop (Console)   | ![This image shows the .NET/C# (Desktop) logo](media/sample-v2-code/logo_NET.png) | [Integrated Windows Authentication](msal-authentication-flows.md#integrated-windows-authentication) | [dotnet-iwa-v2](https://github.com/azure-samples/active-directory-dotnet-iwa-v2) |  |
| Desktop (Console)   | ![This image shows the Java logo](media/sample-v2-code/logo_java.png) | [Integrated Windows Authentication](msal-authentication-flows.md#integrated-windows-authentication) |[ms-identity-java-desktop](https://github.com/Azure-Samples/ms-identity-java-desktop/) |  |
| Desktop (Console)   | ![This image shows the .NET/C# (Desktop) logo](media/sample-v2-code/logo_NETcore.png) | [Username/Password](msal-authentication-flows.md#usernamepassword) |[dotnetcore-up-v2](https://github.com/azure-samples/active-directory-dotnetcore-console-up-v2) |  |
| Desktop (Console) with WAM  | ![This image shows the .NET/C# (Desktop) logo](media/sample-v2-code/logo_NETcore.png) | [interactive with WAM](msal-authentication-flows.md#interactive) |[dotnet-native-uwp-wam](https://github.com/azure-samples/active-directory-dotnet-native-uwp-wam) |  |
| Desktop (Console)   | ![This image shows the Java logo](media/sample-v2-code/logo_java.png) | [Username/Password](msal-authentication-flows.md#usernamepassword) |[ms-identity-java-desktop](https://github.com/Azure-Samples/ms-identity-java-desktop/) |  |
| Desktop (Console)   | ![This image shows the Python logo](media/sample-v2-code/logo_python.png) | [Username/Password](msal-authentication-flows.md#usernamepassword) |[ms-identity-python-desktop](https://github.com/Azure-Samples/ms-identity-python-desktop) |  |
| Mobile (Android, iOS, UWP)   | ![This image shows the .NET/C# (Xamarin) logo](media/sample-v2-code/logo_xamarin.png) | [interactive](msal-authentication-flows.md#interactive) |[xamarin-native-v2](https://github.com/azure-samples/active-directory-xamarin-native-v2) |  |
| Mobile (iOS)       | ![This image shows iOS/Objective-C or Swift](media/sample-v2-code/logo_iOS.png) | [interactive](msal-authentication-flows.md#interactive) |[ios-swift-objc-native-v2](https://github.com/azure-samples/active-directory-ios-swift-native-v2) </p> [ios-native-nxoauth2-v2](https://github.com/azure-samples/active-directory-ios-native-nxoauth2-v2) |  |
| Desktop (macOS)       | macOS | [interactive](msal-authentication-flows.md#interactive) |[macOS-swift-objc-native-v2](https://github.com/Azure-Samples/ms-identity-macOS-swift-objc) |  |
| Mobile (Android-Java)   | ![This image shows the Android logo](media/sample-v2-code/logo_Android.png) | [interactive](msal-authentication-flows.md#interactive) |  [android-Java](https://github.com/Azure-Samples/ms-identity-android-java) |  |
| Mobile (Android-Kotlin)   | ![This image shows the Android logo](media/sample-v2-code/logo_Android.png) | [interactive](msal-authentication-flows.md#interactive) |  [android-Kotlin](https://github.com/Azure-Samples/ms-identity-android-kotlin) |  |

## Daemon applications

The following samples show an application that accesses the Microsoft Graph API with its own identity (with no user).

| Client application | Platform | Flow/Grant | Calls Microsoft Graph |
| ------------------ | -------- | ---------- | -------------------- |
| Console | ![This image shows the .NET Core logo](media/sample-v2-code/logo_NETcore.png)</p> ASP.NET  | [Client Credentials](msal-authentication-flows.md#client-credentials) | [dotnetcore-daemon-v2](https://github.com/azure-samples/active-directory-dotnetcore-daemon-v2) |
| Web app | ![This image shows the ASP.NET logo](media/sample-v2-code/logo_NETframework.png)</p> ASP.NET  | [Client Credentials](msal-authentication-flows.md#client-credentials) | [dotnet-daemon-v2](https://github.com/azure-samples/active-directory-dotnet-daemon-v2) |
| Console | ![This image shows the Java logo](media/sample-v2-code/logo_java.png) | [Client Credentials](msal-authentication-flows.md#client-credentials) | [ms-identity-java-daemon](https://github.com/Azure-Samples/ms-identity-java-daemon) |
| Console | ![This image shows the Python logo](media/sample-v2-code/logo_python.png) | [Client Credentials](msal-authentication-flows.md#client-credentials) | [ms-identity-python-daemon](https://github.com/Azure-Samples/ms-identity-python-daemon) |

## Headless applications

The following sample shows a public client application running on a device without a web browser. The app can be a command-line tool, an app running on Linux or Mac, or an IoT application. The sample features an app accessing the Microsoft Graph API, in the name of a user who signs-in interactively on another device (such as a mobile phone). This client application uses Microsoft Authentication Library (MSAL).

| Client application | Platform | Flow/Grant | Calls Microsoft Graph |
| ------------------ | -------- |  ----------| ---------- |
| Desktop (Console)   | ![This image shows the .NET/C# (Desktop) logo](media/sample-v2-code/logo_NETcore.png) | [Device code flow](msal-authentication-flows.md#device-code) |[dotnetcore-devicecodeflow-v2](https://github.com/azure-samples/active-directory-dotnetcore-devicecodeflow-v2) |
| Desktop (Console)   | ![This image shows the Java logo](media/sample-v2-code/logo_java.png) | [Device code flow](msal-authentication-flows.md#device-code) |[ms-identity-java-devicecodeflow](https://github.com/Azure-Samples/ms-identity-java-devicecodeflow) |
| Desktop (Console)   | ![This image shows the Python logo](media/sample-v2-code/logo_python.png) | [Device code flow](msal-authentication-flows.md#device-code) |[ms-identity-python-devicecodeflow](https://github.com/Azure-Samples/ms-identity-python-devicecodeflow) |

## Web APIs

The following samples show how to protect a web API with the Microsoft identity platform endpoint, and how to call a downstream API from the web API.

| Platform | Sample |
| -------- | ------------------- |
| ![This image shows the ASP.NET Core logo](media/sample-v2-code/logo_NETcore.png)</p>ASP.NET Core | ASP.NET Core web API (service) of [dotnet-native-aspnetcore-v2](https://aka.ms/msidentity-aspnetcore-webapi-calls-msgraph)  |
| ![This image shows the ASP.NET logo](media/sample-v2-code/logo_NET.png)</p>ASP.NET MVC | Web API (service) of [ms-identity-aspnet-webapi-onbehalfof](https://github.com/Azure-Samples/ms-identity-aspnet-webapi-onbehalfof) |
| ![This image shows the Java logo](media/sample-v2-code/logo_java.png) | Web API (service) of [ms-identity-java-webapi](https://github.com/Azure-Samples/ms-identity-java-webapi) |
| ![This image shows the Node.js logo](media/sample-v2-code/logo_nodejs.png) | Web API (service) of [active-directory-javascript-nodejs-webapi-v2](https://github.com/Azure-Samples/active-directory-javascript-nodejs-webapi-v2) |
| ![This image shows the Node.js logo](media/sample-v2-code/logo_nodejs.png) | B2C Web API (service) of [active-directory-b2c-javascript-nodejs-webapi](https://github.com/Azure-Samples/active-directory-b2c-javascript-nodejs-webapi) |

## Azure Functions as web APIs

The following samples show how to protect an Azure Function using HttpTrigger and exposing a web API with the Microsoft identity platform endpoint, and how to call a downstream API from the web API.

| Platform | Sample |
| -------- | ------------------- |
| ![This image shows the ASP.NET Core logo](media/sample-v2-code/logo_NETcore.png)</p>ASP.NET Core | ASP.NET Core web API (service) Azure Function of [dotnet-native-aspnetcore-v2](https://github.com/Azure-Samples/ms-identity-dotnet-webapi-azurefunctions)  |
| ![This image shows the Node.js logo](media/sample-v2-code/logo_nodejs.png)</p>NodeJS | Web API (service) of [NodeJS and passport-azure-ad](https://github.com/Azure-Samples/ms-identity-nodejs-webapi-azurefunctions) |
| ![This image shows the Python logo](media/sample-v2-code/logo_python.png)</p>Python | Web API (service) of [Python](https://github.com/Azure-Samples/ms-identity-python-webapi-azurefunctions) |
| ![This image shows the Node.js logo](media/sample-v2-code/logo_nodejs.png)</p>NodeJS | Web API (service) of [NodeJS and passport-azure-ad using on behalf of](https://github.com/Azure-Samples/ms-identity-nodejs-webapi-onbehalfof-azurefunctions) |

## Other Microsoft Graph samples

To learn about [samples](https://github.com/microsoftgraph/msgraph-community-samples/tree/master/samples#aspnet) and tutorials that demonstrate different usage patterns for the Microsoft Graph API, including authentication with Azure AD, see [Microsoft Graph Community samples & tutorials](https://github.com/microsoftgraph/msgraph-community-samples).

## See also

- [Azure Active Directory (v1.0) developer's guide](../azuread-dev/v1-overview.md)
- [Microsoft Graph API conceptual and reference](https://docs.microsoft.com/graph/use-the-api?context=graph%2Fapi%2Fbeta&view=graph-rest-beta)
