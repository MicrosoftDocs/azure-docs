---
title: Code samples for Microsoft identity platform
description: Provides an index of available Microsoft identity platform code samples, organized by scenario.
services: active-directory
author: mmacy
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: sample
ms.workload: identity
ms.date: 11/04/2020
ms.author: marsma
ms.reviewer: jmprieur
ms.custom: aaddev, identityplatformtop40
---

# Microsoft identity platform code samples (v2.0 endpoint)

You can use the Microsoft identity platform to:

- Add authentication and authorization to your web applications and web APIs.
- Require an access token to access a protected web API.

This article briefly describes and provides you with links to samples for the Microsoft identity platform. These samples show you how it's done, and also provide code snippets that you can use in your applications. On the code sample page, you'll find detailed readme topics that help with requirements, installation, and setup. Comments within the code help you understand the critical sections.

To understand the basic scenario for each sample type, see [App types for the Microsoft identity platform](v2-app-types.md).

You can also contribute to the samples on GitHub. To learn how, see [Microsoft Azure Active Directory samples and documentation](https://github.com/Azure-Samples?page=3&query=active-directory).

## Single-page applications

These samples show how to write a single-page application secured with Microsoft identity platform. These samples use one of the flavors of MSAL.js.

| Platform | Description | Link |
| -------- | --------------------- | -------- |
| ![This image shows the JavaScript logo](media/sample-v2-code/logo_js.png) [JavaScript (MSAL.js)](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-core) | SPA calls Microsoft Graph |[javascript-graphapi-v2](https://github.com/Azure-Samples/active-directory-javascript-graphapi-v2) |
| ![This image shows the JavaScript logo](media/sample-v2-code/logo_js.png) [JavaScript (MSAL.js 2.0)](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser) | SPA calls Microsoft Graph using Auth Code Flow w/ PKCE |[javascript-v2](https://github.com/Azure-Samples/ms-identity-javascript-v2) |
| ![This image shows the JavaScript logo](media/sample-v2-code/logo_js.png) [JavaScript (MSAL.js)](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-core) | SPA calls B2C |[b2c-javascript-msal-singlepageapp](https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp) |
| ![This image shows the JavaScript logo](media/sample-v2-code/logo_js.png) [JavaScript (MSAL.js 2.0)](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser) | SPA calls B2C using Auth Code Flow w/PKCE |[b2c-javascript-spa](https://github.com/Azure-Samples/ms-identity-b2c-javascript-spa) |
| ![This image shows the JavaScript logo](media/sample-v2-code/logo_js.png) [JavaScript (MSAL.js 2.0)](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser) | SPA calls custom web API which in turn calls Microsoft Graph  | [ms-identity-javascript-tutorial-chapter4-obo](https://github.com/Azure-Samples/ms-identity-javascript-tutorial/tree/main/4-AdvancedGrants/1-call-api-graph) |
| ![This image shows the Angular logo](media/sample-v2-code/logo_angular.png) [Angular (MSAL Angular)](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular)| SPA calls Microsoft Graph  | [active-directory-javascript-singlepageapp-angular](https://github.com/Azure-Samples/active-directory-javascript-singlepageapp-angular) |
| ![This image shows the Angular logo](media/sample-v2-code/logo_angular.png) [Angular (MSAL Angular 2.0)](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular)| SPA calls Microsoft Graph using Auth Code Flow w/ PKCE | [ms-identity-javascript-angular-spa](https://github.com/Azure-Samples/ms-identity-javascript-angular-spa) |
| ![This image shows the Angular logo](media/sample-v2-code/logo_angular.png) [Angular (MSAL Angular 2.0)](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular)| SPA calls custom Web API | [ms-identity-javascript-angular-spa-aspnetcore-webapi](https://github.com/Azure-Samples/ms-identity-javascript-angular-spa-aspnetcore-webapi) |
| ![This image shows the Angular logo](media/sample-v2-code/logo_angular.png) [Angular (MSAL Angular)](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular) | SPA calls B2C |[active-directory-b2c-javascript-angular-spa](https://github.com/Azure-Samples/active-directory-b2c-javascript-angular-spa) |
| ![This image shows the Angular logo](media/sample-v2-code/logo_angular.png) [Angular (MSAL Angular 2.0)](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular) | SPA calls custom Web API with App Roles and Security Groups |[ms-identity-javascript-angular-spa-dotnetcore-webapi-roles-groups](https://github.com/Azure-Samples/ms-identity-javascript-angular-spa-dotnetcore-webapi-roles-groups) |
| ![This image shows the React logo](media/sample-v2-code/logo_react.png) [React (MSAL React)](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react)| SPA calls Microsoft Graph using Auth Code Flow w/ PKCE | [ms-identity-javascript-react-spa](https://github.com/Azure-Samples/ms-identity-javascript-react-spa) |
| ![This image shows the React logo](media/sample-v2-code/logo_react.png) [React (MSAL React)](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react)| SPA calls custom web API | [ms-identity-javascript-react-tutorial](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/3-Authorization-II/1-call-api) |
| ![This image shows the React logo](media/sample-v2-code/logo_react.png) [React (MSAL.js 2.0)](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-core)| SPA calls custom Web API which in turn calls Microsoft Graph  | [ms-identity-javascript-react-spa-dotnetcore-webapi-obo](https://github.com/Azure-Samples/ms-identity-javascript-react-spa-dotnetcore-webapi-obo) |
| ![This image shows the Blazor logo](media/sample-v2-code/logo-blazor.png) [Blazor WebAssembly (MSAL.js)](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser) | Blazor WebAssembly Tutorial to sign-in users and call APIs with Azure Active Directory |[ms-identity-blazor-wasm](https://github.com/Azure-Samples/ms-identity-blazor-wasm) |

## Web applications

The following samples illustrate web applications that sign in users. Some samples also demonstrate the application calling Microsoft Graph, or your own web API with the user's identity.

| Platform | Only signs in users | Signs in users and calls Microsoft Graph |
| -------- | ------------------- | --------------------------------- |
| ![This image shows the ASP.NET Core logo](media/sample-v2-code/logo_NETcore.png)</p>ASP.NET Core | [ASP.NET Core WebApp signs-in users tutorial](https://aka.ms/aspnetcore-webapp-sign-in) | Same sample in the [ASP.NET Core web app calls Microsoft Graph](https://aka.ms/aspnetcore-webapp-call-msgraph) phase</p>Advanced sample [Accessing the logged-in user's token cache from background apps, APIs and services](https://github.com/Azure-Samples/ms-identity-dotnet-advanced-token-cache) |
| ![This image shows the ASP.NET Framework logo](media/sample-v2-code/logo_NETframework.png)</p>ASP.NET Core | [AD FS to Azure AD application migration playbook for developers](https://github.com/Azure-Samples/ms-identity-dotnet-adfs-to-aad) to learn how to safely and securely migrate your applications integrated with Active Directory Federation Services (AD FS) to Azure Active Directory (Azure AD) | |
| ![This image shows the ASP.NET Framework logo](media/sample-v2-code/logo_NETframework.png)</p> ASP.NET | [ASP.NET Quickstart](https://github.com/AzureAdQuickstarts/AppModelv2-WebApp-OpenIDConnect-DotNet) </p> [dotnet-webapp-openidconnect-v2](https://github.com/azure-samples/active-directory-dotnet-webapp-openidconnect-v2)  |  [dotnet-admin-restricted-scopes-v2](https://github.com/azure-samples/active-directory-dotnet-admin-restricted-scopes-v2) </p> [msgraph-training-aspnetmvcapp](https://github.com/microsoftgraph/msgraph-training-aspnetmvcapp) |
| ![This image shows the Java logo](media/sample-v2-code/logo_java.png)  |[Java Servlet Tutorial - Chapter 1.1](https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication/blob/main/README.md) Sign in with AAD| |
| ![This image shows the Java logo](media/sample-v2-code/logo_java.png)  |[Java Servlet Tutorial - Chapter 1.2](https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication/blob/main/README.md) Sign in with B2C |
| ![This image shows the Java logo](media/sample-v2-code/logo_java.png)  | | [Java Servlet Tutorial - Chapter 2.1](https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication/blob/main/README.md) Sign in with AAD and call Graph|
| ![This image shows the Java logo](media/sample-v2-code/logo_java.png)  |[Java Servlet Tutorial - Chapter 3.1](https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication/blob/main/README.md) Sign in with AAD and control access with Roles claim| |
| ![This image shows the Java logo](media/sample-v2-code/logo_java.png)  | | [Java Servlet Tutorial - Chapter 3.2](https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication/blob/main/README.md) Sign in with AAD and control access with Groups claim|
| ![This image shows the Java logo](media/sample-v2-code/logo_java.png) | |[Java Servlet Tutorial - Chapter 4.1](https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication/blob/main/README.md) Deploy to Azure App Service|
| ![This image shows the Java logo](media/sample-v2-code/logo_java.png)  | | [ms-identity-java-webapp](https://github.com/Azure-Samples/ms-identity-java-webapp) |
| ![This image shows the Java logo](media/sample-v2-code/logo_java.png)  | [ms-identity-b2c-java-servlet-webapp-authentication](https://github.com/Azure-Samples/ms-identity-b2c-java-servlet-webapp-authentication)|  |
| ![This image shows the Node.js logo](media/sample-v2-code/logo_nodejs.png)</p>Node.js (MSAL Node) | [Express web app signs-in users tutorial](https://github.com/Azure-Samples/ms-identity-node) | |
| ![This image shows the Python logo](media/sample-v2-code/logo_python.png)  | [Python Flask Tutorial - Chapter 1.1](https://github.com/Azure-Samples/ms-identity-python-flask-tutorial/blob/main/README.md) Sign in with AAD  |  |
| ![This image shows the Python logo](media/sample-v2-code/logo_python.png)  | [Python Flask Tutorial - Chapter 1.2](https://github.com/Azure-Samples/ms-identity-python-flask-tutorial/blob/main/README.md) Sign in with B2C                    |  |
| ![This image shows the Python logo](media/sample-v2-code/logo_python.png)  | | [Python Flask Tutorial - Chapter 2.1](https://github.com/Azure-Samples/ms-identity-python-flask-tutorial/blob/main/README.md) Sign in with AAD and Call Graph |
| ![This image shows the Python logo](media/sample-v2-code/logo_python.png)  | |[Python Flask Tutorial - Chapter 3.1](https://github.com/Azure-Samples/ms-identity-python-flask-tutorial/blob/main/README.md) Deploy to Azure App Service  |
| ![This image shows the Python logo](media/sample-v2-code/logo_python.png)  | [Python Django Tutorial - Chapter 1.1](https://github.com/Azure-Samples/ms-identity-python-django-tutorial/blob/main/README.md)   Sign in with AAD  | |
| ![This image shows the Python logo](media/sample-v2-code/logo_python.png)  | [Python Django Tutorial - Chapter 1.2](https://github.com/Azure-Samples/ms-identity-python-django-tutorial/blob/main/README.md) Sign in with B2C                    |  |
| ![This image shows the Python logo](media/sample-v2-code/logo_python.png)  | | [Python Django Tutorial - Chapter 2.1](https://github.com/Azure-Samples/ms-identity-python-django-tutorial/blob/main/README.md)  Sign in with AAD and Call Graph|
| ![This image shows the Python logo](media/sample-v2-code/logo_python.png)  | | [Python Django Tutorial - Chapter 3.1](https://github.com/Azure-Samples/ms-identity-python-django-tutorial/blob/main/README.md) Deploy to Azure App Service                    |
| ![This image shows the Python logo](media/sample-v2-code/logo_python.png)  | | [Python Flask web app](https://github.com/Azure-Samples/ms-identity-python-webapp) |
| ![This image shows the Ruby logo](media/sample-v2-code/logo_ruby.png) |                   | [msgraph-training-rubyrailsapp](https://github.com/microsoftgraph/msgraph-training-rubyrailsapp) |
| ![This image shows the Blazor logo](media/sample-v2-code/logo-blazor.png)</p>Blazor Server | [Blazor Server app signs-in users tutorial](https://github.com/Azure-Samples/ms-identity-blazor-server/tree/main/WebApp-OIDC) | [Blazor Server app calls Microsoft Graph](https://github.com/Azure-Samples/ms-identity-blazor-server/tree/main/WebApp-graph-user/Call-MSGraph)</p>Chapterwise Tutorial: [Blazor Server app to sign-in users and call APIs with Azure Active Directory](https://github.com/Azure-Samples/ms-identity-blazor-server) |

## Desktop and mobile public client apps

The following samples show public client applications (desktop or mobile applications) that access the Microsoft Graph API, or your own web API in the name of a user. Apart from the *Desktop (Console) with WAM* sample, all these client applications use the Microsoft Authentication Library (MSAL).

| Client application | Platform | Flow/grant | Calls Microsoft Graph | Calls an ASP.NET Core web API |
| ------------------ | -------- |  ----------| ---------- | ------------------------- |
| Desktop tutorial (.NET Core) - Optionally using:</p>- the cross platform token cache</p>- custom web UI | ![This image shows the .NET/C# logo](media/sample-v2-code/logo_NETcore.png) | [Authorization code](msal-authentication-flows.md#authorization-code)| [ms-identity-dotnet-desktop-tutorial](https://github.com/azure-samples/ms-identity-dotnet-desktop-tutorial) | |
| Desktop (WPF)      | ![This image shows the .NET desktop/C# logo](media/sample-v2-code/logo_NET.png) | [Authorization code](msal-authentication-flows.md#authorization-code)| [dotnet-desktop-msgraph-v2](https://github.com/azure-samples/active-directory-dotnet-desktop-msgraph-v2) | [dotnet-native-aspnetcore-v2](https://aka.ms/msidentity-aspnetcore-webapi) |
| Desktop (Console)   | ![Image that shows the .NET/C# (Desktop) logo](media/sample-v2-code/logo_NET.png) | [Integrated Windows Authentication](msal-authentication-flows.md#integrated-windows-authentication) | [dotnet-iwa-v2](https://github.com/azure-samples/active-directory-dotnet-iwa-v2) |  |
| Desktop (Console)   | ![This image shows the Java logo](media/sample-v2-code/logo_java.png) | [Integrated Windows Authentication](msal-authentication-flows.md#integrated-windows-authentication) |[ms-identity-java-desktop](https://github.com/Azure-Samples/ms-identity-java-desktop/) |  |
| Desktop (Console)   | ![This is the .NET/C# (Desktop) logo](media/sample-v2-code/logo_NETcore.png) | [Username/Password](msal-authentication-flows.md#usernamepassword) |[dotnetcore-up-v2](https://github.com/azure-samples/active-directory-dotnetcore-console-up-v2) |  |
| Desktop (Console) with WAM  | ![This is the logo for .NET/C# (Desktop)](media/sample-v2-code/logo_NETcore.png) | Interactive with [Web Account Manager](/windows/uwp/security/web-account-manager) (WAM) |[dotnet-native-uwp-wam](https://github.com/azure-samples/active-directory-dotnet-native-uwp-wam) |  |
| Desktop (Console)   | ![This image shows the Java logo](media/sample-v2-code/logo_java.png) | [Username/Password](msal-authentication-flows.md#usernamepassword) |[ms-identity-java-desktop](https://github.com/Azure-Samples/ms-identity-java-desktop/) |  |
| Desktop (Console)   | ![This image shows the Python logo](media/sample-v2-code/logo_python.png) | [Username/Password](msal-authentication-flows.md#usernamepassword) |[ms-identity-python-desktop](https://github.com/Azure-Samples/ms-identity-python-desktop) |  |
| Desktop (Electron)   | ![This image shows the Node.js logo](media/sample-v2-code/logo_nodejs.png)</p>Node.js (MSAL Node) | [Authorization code (PKCE)](msal-authentication-flows.md#authorization-code) |[ms-identity-javascript-nodejs-desktop](https://github.com/Azure-Samples/ms-identity-javascript-nodejs-desktop) |  |
| Mobile (Android, iOS, UWP)   | ![This image shows the .NET/C# (Xamarin) logo](media/sample-v2-code/logo_xamarin.png) | [Authorization code](msal-authentication-flows.md#authorization-code) |[xamarin-native-v2](https://github.com/azure-samples/active-directory-xamarin-native-v2) |  |
| Mobile (iOS)       | ![This image shows iOS/Objective-C or Swift](media/sample-v2-code/logo_iOS.png) | [Authorization code](msal-authentication-flows.md#authorization-code) |[ios-swift-objc-native-v2](https://github.com/azure-samples/active-directory-ios-swift-native-v2) </p> [ios-native-nxoauth2-v2](https://github.com/azure-samples/active-directory-ios-native-nxoauth2-v2) |  |
| Desktop (macOS)       | macOS | [Authorization code](msal-authentication-flows.md#authorization-code) |[macOS-swift-objc-native-v2](https://github.com/Azure-Samples/ms-identity-macOS-swift-objc) |  |
| Mobile (Android-Java)   | ![This image shows the Android logo](media/sample-v2-code/logo_Android.png) | [Authorization code](msal-authentication-flows.md#authorization-code) |  [android-Java](https://github.com/Azure-Samples/ms-identity-android-java) |  |
| Mobile (Android-Kotlin)   | ![This image shows the Android logo](media/sample-v2-code/logo_Android.png) | [Authorization code](msal-authentication-flows.md#authorization-code) |  [android-Kotlin](https://github.com/Azure-Samples/ms-identity-android-kotlin) |  |

## Daemon applications

The following samples show an application that accesses the Microsoft Graph API with its own identity (with no user).

| Client application | Platform | Flow/Grant | Calls Microsoft Graph |
| ------------------ | -------- | ---------- | -------------------- |
| Console | ![This image shows the .NET Core logo](media/sample-v2-code/logo_NETcore.png)</p> ASP.NET  | [Client Credentials](msal-authentication-flows.md#client-credentials) | [dotnetcore-daemon-v2](https://github.com/azure-samples/active-directory-dotnetcore-daemon-v2) |
| Web app | ![Screenshot that shows the ASP.NET logo.](media/sample-v2-code/logo_NETframework.png)</p> ASP.NET  | [Client Credentials](msal-authentication-flows.md#client-credentials) | [dotnet-daemon-v2](https://github.com/azure-samples/active-directory-dotnet-daemon-v2) |
| Console | ![This image shows the Java logo](media/sample-v2-code/logo_java.png) | [Client Credentials](msal-authentication-flows.md#client-credentials) | [ms-identity-java-daemon](https://github.com/Azure-Samples/ms-identity-java-daemon) |
| Console | ![This image shows the Node.js logo](media/sample-v2-code/logo_nodejs.png)</p>Node.js (MSAL Node)| [Client Credentials](msal-authentication-flows.md#client-credentials) | [ms-identity-javascript-nodejs-console](https://github.com/Azure-Samples/ms-identity-javascript-nodejs-console) |
| Console | ![This image shows the Python logo](media/sample-v2-code/logo_python.png) | [Client Credentials](msal-authentication-flows.md#client-credentials) | [ms-identity-python-daemon](https://github.com/Azure-Samples/ms-identity-python-daemon) |

## Headless applications

The following sample shows a public client application running on a device without a web browser. The app can be a command-line tool, an app running on Linux or Mac, or an IoT application. The sample features an app accessing the Microsoft Graph API, in the name of a user who signs-in interactively on another device (such as a mobile phone). This client application uses the Microsoft Authentication Library (MSAL).

| Client application | Platform | Flow/Grant | Calls Microsoft Graph |
| ------------------ | -------- |  ----------| ---------- |
| Desktop (Console)   | ![This image shows the .NET/C# (Desktop) logo](media/sample-v2-code/logo_NETcore.png) | [Device code flow](msal-authentication-flows.md#device-code) |[dotnetcore-devicecodeflow-v2](https://github.com/azure-samples/active-directory-dotnetcore-devicecodeflow-v2) |
| Desktop (Console)   | ![This image shows the Java logo](media/sample-v2-code/logo_java.png) | [Device code flow](msal-authentication-flows.md#device-code) |[ms-identity-java-devicecodeflow](https://github.com/Azure-Samples/ms-identity-java-devicecodeflow) |
| Desktop (Console)   | ![This image shows the Python logo](media/sample-v2-code/logo_python.png) | [Device code flow](msal-authentication-flows.md#device-code) |[ms-identity-python-devicecodeflow](https://github.com/Azure-Samples/ms-identity-python-devicecodeflow) |

## Multi-tenant SaaS applications

The following samples show how to configure your application to accept sign-ins from any Azure Active Directory (Azure AD) tenant. Configuring your application to be *multi-tenant* means that you can offer a **Software as a Service** (SaaS) application to many organizations, allowing their users to be able to sign-in to your application after providing consent.

| Platform | Description | Link |
| -------- | --------------------- | -------- |
| ![This image shows the Angular logo](media/sample-v2-code/logo_angular.png) [Angular (MSAL Angular 2.0)](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular) | Multi-tenant SPA calls multi-tenant custom web API |[ms-identity-javascript-angular-spa-aspnet-webapi-multitenant](https://github.com/Azure-Samples/ms-identity-javascript-angular-spa-aspnet-webapi-multitenant/tree/master/Chapter2) |
| ![This image shows the ASP.NET Core logo](media/sample-v2-code/logo_NETcore.png) [.NET Core (MSAL.NET)](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet) | ASP.NET Core MVC web application calls Graph API |[active-directory-aspnetcore-webapp-openidconnect-v2](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/2-WebApp-graph-user/2-3-Multi-Tenant) |
| ![This image shows the ASP.NET Core logo](media/sample-v2-code/logo_NETcore.png) [.NET Core (MSAL.NET)](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet) | ASP.NET Core MVC web application calls ASP.NET Core Web API |[active-directory-aspnetcore-webapp-openidconnect-v2](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/4-WebApp-your-API/4-3-AnyOrg) |

## Web APIs

The following samples show how to protect a web API with the Microsoft identity platform, and how to call a downstream API from the web API.

| Platform | Sample |
| -------- | ------------------- |
| ![This image shows the ASP.NET Core logo](media/sample-v2-code/logo_NETcore.png)</p>ASP.NET Core | ASP.NET Core web API (service) of [dotnet-native-aspnetcore-v2](https://aka.ms/msidentity-aspnetcore-webapi-calls-msgraph)  |
| ![This image shows the ASP.NET logo](media/sample-v2-code/logo_NET.png)</p>ASP.NET MVC | Web API (service) of [ms-identity-aspnet-webapi-onbehalfof](https://github.com/Azure-Samples/ms-identity-aspnet-webapi-onbehalfof) |
| ![This image shows the Java logo](media/sample-v2-code/logo_java.png) | Web API (service) of [ms-identity-java-webapi](https://github.com/Azure-Samples/ms-identity-java-webapi) |
| ![This image shows the Node.js logo](media/sample-v2-code/logo_nodejs.png)</p>Node.js (Passport.js)| Web API (service) of [active-directory-javascript-nodejs-webapi-v2](https://github.com/Azure-Samples/active-directory-javascript-nodejs-webapi-v2) |
| ![This image shows the Node.js logo](media/sample-v2-code/logo_nodejs.png)</p>Node.js (Passport.js)| B2C Web API (service) of [active-directory-b2c-javascript-nodejs-webapi](https://github.com/Azure-Samples/active-directory-b2c-javascript-nodejs-webapi) |

## Azure Functions as web APIs

The following samples show how to protect an Azure Function using HttpTrigger and exposing a web API with the Microsoft identity platform, and how to call a downstream API from the web API.

| Platform | Sample |
| -------- | ------------------- |
| ![This image shows the ASP.NET Core logo](media/sample-v2-code/logo_NETcore.png)</p>ASP.NET Core | ASP.NET Core web API (service) Azure Function of [dotnet-native-aspnetcore-v2](https://github.com/Azure-Samples/ms-identity-dotnet-webapi-azurefunctions)  |
| ![This image shows the Python logo](media/sample-v2-code/logo_python.png)</p>Python | Web API (service) of [Python](https://github.com/Azure-Samples/ms-identity-python-webapi-azurefunctions) |
| ![This image shows the Node.js logo](media/sample-v2-code/logo_nodejs.png)</p>Node.js (Passport.js)| Web API (service) of [Node.js and passport-azure-ad](https://github.com/Azure-Samples/ms-identity-nodejs-webapi-azurefunctions) |
| ![This image shows the Node.js logo](media/sample-v2-code/logo_nodejs.png)</p>Node.js (Passport.js)| Web API (service) of [Node.js and passport-azure-ad using on behalf of](https://github.com/Azure-Samples/ms-identity-nodejs-webapi-onbehalfof-azurefunctions) |

## Other Microsoft Graph samples

To learn about [samples](https://github.com/microsoftgraph/msgraph-community-samples/tree/master/samples#aspnet) and tutorials that demonstrate different usage patterns for the Microsoft Graph API, including authentication with Azure AD, see [Microsoft Graph Community samples & tutorials](https://github.com/microsoftgraph/msgraph-community-samples).

## See also

[Microsoft Graph API conceptual and reference](/graph/use-the-api?context=graph%2fapi%2fbeta&view=graph-rest-beta&preserve-view=true)
