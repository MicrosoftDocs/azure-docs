---
title: Code samples for Microsoft identity platform authentication and authorization
description: An index of Microsoft-maintained code samples demonstrating authentication and authorization in several application types, development languages, and frameworks.
services: active-directory
author: OwenRichards1
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: sample
ms.workload: identity
ms.date: 03/29/2022
ms.author: owenrichards
ms.reviewer: jmprieur
ms.custom: aaddev, identityplatformtop40
---

# Microsoft identity platform code samples

These code samples are built and maintained by Microsoft to demonstrate usage of our authentication libraries with the Microsoft identity platform. Common authentication and authorization scenarios are implemented in several [application types](v2-app-types.md), development languages, and frameworks.

- Sign in users to web applications and provide authorized access to protected web APIs.
- Protect a web API by requiring an access token to perform API operations.

Each code sample includes a _README.md_ file describing how to build the project (if applicable) and run the sample application. Comments in the code help you understand how these libraries are used in the application to perform authentication and authorization by using the identity platform.

## Single-page applications

These samples show how to write a single-page application secured with Microsoft identity platform. These samples use one of the flavors of MSAL.js.

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample(s) <br/>on GitHub | Auth<br/> libraries | Auth flow |
> | ------- | -------- | ------------- | -------------- |
> | Angular | &#8226; [Sign in users](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/tree/main/1-Authentication/1-sign-in/README.md)<br/>&#8226; [Sign in users (B2C)](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/tree/main/1-Authentication/2-sign-in-b2c/README.md) <br/> &#8226; [Call Microsoft Graph](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/tree/main/2-Authorization-I/1-call-graph/README.md)<br/>&#8226; [Call .NET Core web API](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/tree/main/3-Authorization-II/1-call-api)<br/>&#8226; [Call .NET Core web API (B2C)](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/tree/main/3-Authorization-II/2-call-api-b2c)<br/>&#8226; [Call Microsoft Graph via OBO](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/blob/main/6-AdvancedScenarios/1-call-api-obo/README.md)<br/>&#8226; [Use App Roles for access control](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/tree/main/5-AccessControl/1-call-api-roles/README.md)<br/> &#8226; [Use Security Groups for access control](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/tree/main/5-AccessControl/2-call-api-groups/README.md)<br/>&#8226; [Deploy to Azure Storage and App Service](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/tree/main/4-Deployment/README.md)| MSAL Angular | &#8226; Authorization code with PKCE<br/>&#8226; On-behalf-of (OBO) |
> | Blazor WebAssembly | &#8226; [Sign in users](https://github.com/Azure-Samples/ms-identity-blazor-wasm/blob/main/WebApp-OIDC/MyOrg/README.md)<br/>&#8226; [Sign in users (B2C)](https://github.com/Azure-Samples/ms-identity-blazor-wasm/blob/main/WebApp-OIDC/B2C/README.md)<br/>&#8226; [Call Microsoft Graph](https://github.com/Azure-Samples/ms-identity-blazor-wasm/blob/main/WebApp-graph-user/Call-MSGraph/README.md)<br/>&#8226; [Deploy to Azure App Service](https://github.com/Azure-Samples/ms-identity-blazor-wasm/blob/main/Deploy-to-Azure/README.md) | MSAL.js | Implicit Flow |
> | JavaScript | &#8226; [Sign in users](https://github.com/Azure-Samples/ms-identity-javascript-tutorial/tree/main/1-Authentication/1-sign-in/README.md)<br/>&#8226; [Sign in users (B2C)](https://github.com/Azure-Samples/ms-identity-javascript-tutorial/tree/main/1-Authentication/2-sign-in-b2c/README.md) <br/> &#8226; [Call Microsoft Graph](https://github.com/Azure-Samples/ms-identity-javascript-tutorial/tree/main/2-Authorization-I/1-call-graph/README.md)<br/>&#8226; [Call Node.js web API](https://github.com/Azure-Samples/ms-identity-javascript-tutorial/tree/main/3-Authorization-II/1-call-api/README.md)<br/>&#8226; [Call Node.js web API (B2C)](https://github.com/Azure-Samples/ms-identity-javascript-tutorial/tree/main/3-Authorization-II/2-call-api-b2c/README.md)<br/>&#8226; [Call Microsoft Graph via OBO](https://github.com/Azure-Samples/ms-identity-javascript-tutorial/tree/main/4-AdvancedGrants/1-call-api-graph/README.md)<br/>&#8226; [Call Node.js web API via OBO and CA](https://github.com/Azure-Samples/ms-identity-javascript-tutorial/tree/main/4-AdvancedGrants/2-call-api-api-ca/README.md)<br/>&#8226; [Deploy to Azure Storage and App Service](https://github.com/Azure-Samples/ms-identity-javascript-tutorial/tree/main/5-Deployment/README.md)| MSAL.js | &#8226; Authorization code with PKCE<br/>&#8226; On-behalf-of (OBO) <br/>&#8226; Conditional Access |
> | React | &#8226; [Sign in users](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/1-Authentication/1-sign-in/README.md)<br/>&#8226; [Sign in users (B2C)](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/1-Authentication/2-sign-in-b2c/README.md) <br/> &#8226; [Call Microsoft Graph](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/2-Authorization-I/1-call-graph/README.md)<br/>&#8226; [Call Node.js web API](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/3-Authorization-II/1-call-api)<br/>&#8226; [Call Node.js web API (B2C)](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/3-Authorization-II/2-call-api-b2c)<br/>&#8226; [Call Microsoft Graph via OBO](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/6-AdvancedScenarios/1-call-api-obo/README.md)<br/>&#8226; [Use App Roles for access control](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/5-AccessControl/1-call-api-roles/README.md)<br/>&#8226; [Use Security Groups for access control](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/5-AccessControl/2-call-api-groups/README.md)<br/>&#8226; [Deploy to Azure Storage and App Service](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/4-Deployment/1-deploy-storage/README.md)<br/>&#8226; [Deploy to Azure Static Web Apps](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/4-Deployment/2-deploy-static/README.md)<br/>&#8226; [Call Azure REST API and Azure Storage](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/2-Authorization-I/2-call-arm)| MSAL React | &#8226; Authorization code with PKCE<br/>&#8226; On-behalf-of (OBO) <br/>&#8226; Conditional Access |

## Web applications

The following samples illustrate web applications that sign in users. Some samples also demonstrate the application calling Microsoft Graph, or your own web API with the user's identity.

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample(s)<br/> on GitHub | Auth<br/> libraries | Auth flow |
> | ------- | --------------------------- | ------------- | -------------- |
> | ASP.NET Core| ASP.NET Core Series <br/> &#8226; [Sign in users](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/master/1-WebApp-OIDC/README.md) <br/> &#8226; [Sign in users (B2C)](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/master/1-WebApp-OIDC/1-5-B2C/README.md) <br/> &#8226; [Call Microsoft Graph](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/master/2-WebApp-graph-user/2-1-Call-MSGraph/README.md) <br/> &#8226; [Customize token cache](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/master/2-WebApp-graph-user/2-2-TokenCache/README.md) <br/> &#8226; [Call Graph (multi-tenant)](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/master/2-WebApp-graph-user/2-3-Multi-Tenant/README.md) <br/> &#8226; [Call Azure REST APIs](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/master/3-WebApp-multi-APIs/README.md) <br/> &#8226; [Protect web API](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/master/4-WebApp-your-API/4-1-MyOrg/README.md) <br/> &#8226; [Protect web API (B2C)](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/master/4-WebApp-your-API/4-2-B2C/README.md) <br/> &#8226; [Protect multi-tenant web API](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/master/4-WebApp-your-API/4-3-AnyOrg/Readme.md) <br/> &#8226; [Use App Roles for access control](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/master/5-WebApp-AuthZ/5-1-Roles/README.md) <br/> &#8226; [Use Security Groups for access control](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/master/5-WebApp-AuthZ/5-2-Groups/README.md) <br/> &#8226; [Deploy to Azure Storage and App Service](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/master/6-Deploy-to-Azure/README.md) | &#8226; MSAL.NET<br/> &#8226; Microsoft.Identity.Web | &#8226; OpenID connect <br/> &#8226; Authorization code <br/> &#8226; On-Behalf-Of|
> | Blazor | Blazor Server Series <br/> &#8226; [Sign in users](https://github.com/Azure-Samples/ms-identity-blazor-server/tree/main/WebApp-OIDC/MyOrg) <br/> &#8226; [Sign in users (B2C)](https://github.com/Azure-Samples/ms-identity-blazor-server/tree/main/WebApp-OIDC/B2C) <br/> &#8226; [Call Microsoft Graph](https://github.com/Azure-Samples/ms-identity-blazor-server/tree/main/WebApp-graph-user/Call-MSGraph) <br/> &#8226; [Call web API](https://github.com/Azure-Samples/ms-identity-blazor-server/tree/main/WebApp-your-API/MyOrg) <br/> &#8226; [Call web API (B2C)](https://github.com/Azure-Samples/ms-identity-blazor-server/tree/main/WebApp-your-API/B2C) | MSAL.NET | Authorization code Grant Flow|
> | ASP.NET Core|[Advanced Token Cache Scenarios](https://github.com/Azure-Samples/ms-identity-dotnet-advanced-token-cache) | &#8226; MSAL.NET <br/> &#8226; Microsoft.Identity.Web | On-Behalf-Of (OBO) |
> | ASP.NET Core|[Use the Conditional Access auth context to perform step\-up authentication](https://github.com/Azure-Samples/ms-identity-dotnetcore-ca-auth-context-app/blob/main/README.md) | &#8226; MSAL.NET <br/> &#8226; Microsoft.Identity.Web | Authorization code |
> | ASP.NET Core|[Active Directory FS to Azure AD migration](https://github.com/Azure-Samples/ms-identity-dotnet-adfs-to-aad) | MSAL.NET | &#8226; SAML <br/> &#8226; OpenID connect |
> | ASP.NET | &#8226; [Microsoft Graph Training Sample](https://github.com/microsoftgraph/msgraph-training-aspnetmvcapp) <br/> &#8226; [Sign in users and call Microsoft Graph](https://github.com/Azure-Samples/ms-identity-aspnet-webapp-openidconnect) <br/> &#8226; [Sign in users and call Microsoft Graph with admin restricted scope](https://github.com/azure-samples/active-directory-dotnet-admin-restricted-scopes-v2) <br/> &#8226; [Quickstart: Sign in users](https://github.com/AzureAdQuickstarts/AppModelv2-WebApp-OpenIDConnect-DotNet) | MSAL.NET | &#8226; OpenID connect <br/> &#8226; Authorization code |
> | Java </p> Spring |Azure AD Spring Boot Starter Series <br/> &#8226; [Sign in users](https://github.com/Azure-Samples/ms-identity-msal-java-samples/tree/main/4.%20Spring%20Framework%20Web%20App%20Tutorial/1-Authentication/sign-in) <br/> &#8226; [Sign in users (B2C)](https://github.com/Azure-Samples/ms-identity-msal-java-samples/tree/main/4.%20Spring%20Framework%20Web%20App%20Tutorial/1-Authentication/sign-in-b2c) <br/> &#8226; [Call Microsoft Graph](https://github.com/Azure-Samples/ms-identity-msal-java-samples/tree/main/4.%20Spring%20Framework%20Web%20App%20Tutorial/2-Authorization-I/call-graph) <br/> &#8226; [Use App Roles for access control](https://github.com/Azure-Samples/ms-identity-msal-java-samples/tree/main/4.%20Spring%20Framework%20Web%20App%20Tutorial/3-Authorization-II/roles) <br/> &#8226; [Use Groups for access control](https://github.com/Azure-Samples/ms-identity-msal-java-samples/tree/main/4.%20Spring%20Framework%20Web%20App%20Tutorial/3-Authorization-II/groups) <br/> &#8226; [Deploy to Azure App Service](https://github.com/Azure-Samples/ms-identity-msal-java-samples/tree/main/4.%20Spring%20Framework%20Web%20App%20Tutorial/4-Deployment/deploy-to-azure-app-service) <br/> &#8226; [Protect a web API](https://github.com/Azure-Samples/ms-identity-msal-java-samples/tree/main/4.%20Spring%20Framework%20Web%20App%20Tutorial/3-Authorization-II/protect-web-api) | &#8226; MSAL Java <br/> &#8226; Azure AD Boot Starter | Authorization code |
> | Java </p> Servlets | Spring-less Servlet Series <br/> &#8226; [Sign in users](https://github.com/Azure-Samples/ms-identity-msal-java-samples/tree/main/3.%20Java%20Servlet%20Web%20App%20Tutorial/1-Authentication/sign-in) <br/> &#8226; [Sign in users (B2C)](https://github.com/Azure-Samples/ms-identity-msal-java-samples/tree/main/3.%20Java%20Servlet%20Web%20App%20Tutorial/1-Authentication/sign-in-b2c) <br/> &#8226; [Call Microsoft Graph](https://github.com/Azure-Samples/ms-identity-msal-java-samples/tree/main/3.%20Java%20Servlet%20Web%20App%20Tutorial/2-Authorization-I/call-graph) <br/> &#8226; [Use App Roles for access control](https://github.com/Azure-Samples/ms-identity-msal-java-samples/tree/main/3.%20Java%20Servlet%20Web%20App%20Tutorial/3-Authorization-II/roles) <br/> &#8226; [Use Security Groups for access control](https://github.com/Azure-Samples/ms-identity-msal-java-samples/tree/main/3.%20Java%20Servlet%20Web%20App%20Tutorial/3-Authorization-II/groups) <br/> &#8226; [Deploy to Azure App Service](https://github.com/Azure-Samples/ms-identity-msal-java-samples/tree/main/3.%20Java%20Servlet%20Web%20App%20Tutorial/4-Deployment/deploy-to-azure-app-service) | MSAL Java | Authorization code |
> | Node.js </p> Express | Express web app series <br/> &#8226; [Sign in users](https://github.com/Azure-Samples/ms-identity-javascript-nodejs-tutorial/blob/main/1-Authentication/1-sign-in/README.md)<br/> &#8226; [Sign in users (B2C)](https://github.com/Azure-Samples/ms-identity-javascript-nodejs-tutorial/blob/main/1-Authentication/2-sign-in-b2c/README.md)<br/> &#8226; [Call Microsoft Graph](https://github.com/Azure-Samples/ms-identity-javascript-nodejs-tutorial/blob/main/2-Authorization/1-call-graph/README.md)<br/> &#8226; [Deploy to Azure App Service](https://github.com/Azure-Samples/ms-identity-javascript-nodejs-tutorial/blob/main/3-Deployment/README.md)<br/> &#8226; [Use App Roles for access control](https://github.com/Azure-Samples/ms-identity-javascript-nodejs-tutorial/blob/main/4-AccessControl/1-app-roles/README.md)<br/> &#8226; [Use Security Groups for access control](https://github.com/Azure-Samples/ms-identity-javascript-nodejs-tutorial/blob/main/4-AccessControl/2-security-groups/README.md) <br/> &#8226; [Web app that sign in users](https://github.com/Azure-Samples/ms-identity-node) | MSAL Node | Authorization code |
> | Python </p> Flask | Flask Series <br/> &#8226; [Sign in users](https://github.com/Azure-Samples/ms-identity-python-flask-tutorial) <br/> &#8226; [Sign in users (B2C)](https://github.com/Azure-Samples/ms-identity-python-flask-tutorial) <br/>&#8226; [Sign in users and call Microsoft Graph](https://github.com/Azure-Samples/ms-identity-python-webapp) <br/> &#8226; [Call Microsoft Graph](https://github.com/Azure-Samples/ms-identity-python-flask-tutorial) <br/> &#8226; [Deploy to Azure App Service](https://github.com/Azure-Samples/ms-identity-python-flask-tutorial) | MSAL Python | Authorization code |
> | Python </p> Django | Django Series <br/> &#8226; [Sign in users](https://github.com/Azure-Samples/ms-identity-python-django-tutorial/tree/main/1-Authentication/sign-in) <br/> &#8226; [Sign in users (B2C)](https://github.com/Azure-Samples/ms-identity-python-django-tutorial/tree/main/1-Authentication/sign-in-b2c) <br/> &#8226; [Call Microsoft Graph](https://github.com/Azure-Samples/ms-identity-python-django-tutorial/tree/main/2-Authorization-I/call-graph) <br/> &#8226; [Deploy to Azure App Service](https://github.com/Azure-Samples/ms-identity-python-django-tutorial/tree/main/3-Deployment/deploy-to-azure-app-service)| MSAL Python | Authorization code |
> | Ruby | Graph Training <br/> &#8226; [Sign in users and call Microsoft Graph](https://github.com/microsoftgraph/msgraph-training-rubyrailsapp) | OmniAuth OAuth2 | Authorization code |

## Web API

The following samples show how to protect a web API with the Microsoft identity platform, and how to call a downstream API from the web API.

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample(s) <br/> on GitHub |Auth<br/> libraries |Auth flow |
> | ----------- | ----------- |----------- |----------- |
> | ASP.NET | [Call Microsoft Graph](https://github.com/Azure-Samples/ms-identity-aspnet-webapi-onbehalfof) | MSAL.NET | On-Behalf-Of (OBO) |
> | ASP.NET Core | [Sign in users and call Microsoft Graph](https://github.com/Azure-Samples/active-directory-dotnet-native-aspnetcore-v2/tree/master/2.%20Web%20API%20now%20calls%20Microsoft%20Graph) | MSAL.NET | On-Behalf-Of (OBO) |
> | Java | [Sign in users](https://github.com/Azure-Samples/ms-identity-msal-java-samples/tree/main/4.%20Spring%20Framework%20Web%20App%20Tutorial/3-Authorization-II/protect-web-api) | MSAL Java | On-Behalf-Of (OBO) |
> | Node.js | &#8226; [Protect a Node.js web API](https://github.com/Azure-Samples/ms-identity-javascript-tutorial/tree/main/3-Authorization-II/1-call-api) <br/> &#8226; [Protect a Node.js Web API with Azure AD B2C](https://github.com/Azure-Samples/active-directory-b2c-javascript-nodejs-webapi) | MSAL Node | Authorization bearer |

## Desktop

The following samples show public client desktop applications that access the Microsoft Graph API, or your own web API in the name of the user. Apart from the _Desktop (Console) with Web Authentication Manager (WAM)_ sample, all these client applications use the Microsoft Authentication Library (MSAL).

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample(s) <br/> on GitHub | Auth<br/> libraries | Auth flow |
> | ------- | -------- | ------------- | -------------- |
> | .NET Core | &#8226; [Call Microsoft Graph](https://github.com/Azure-Samples/ms-identity-dotnet-desktop-tutorial/tree/master/1-Calling-MSGraph/1-1-AzureAD) <br/> &#8226; [Call Microsoft Graph with token cache](https://github.com/Azure-Samples/ms-identity-dotnet-desktop-tutorial/tree/master/2-TokenCache) <br/> &#8226; [Call Micrsoft Graph with custom web UI HTML](https://github.com/Azure-Samples/ms-identity-dotnet-desktop-tutorial/tree/master/3-CustomWebUI/3-1-CustomHTML) <br/> &#8226; [Call Microsoft Graph with custom web browser](https://github.com/Azure-Samples/ms-identity-dotnet-desktop-tutorial/tree/master/3-CustomWebUI/3-2-CustomBrowser) <br/> &#8226; [Sign in users with device code flow](https://github.com/Azure-Samples/ms-identity-dotnet-desktop-tutorial/tree/master/4-DeviceCodeFlow) <br/> &#8226; [Authenticate users with MSAL.NET in a WinUI desktop application](https://github.com/Azure-Samples/ms-identity-netcore-winui) | MSAL.NET |&#8226; Authorization code with PKCE <br/> &#8226; Device code |
> | .NET | [Invoke protected API with integrated Windows authentication](https://github.com/azure-samples/active-directory-dotnet-iwa-v2) | MSAL.NET | Integrated Windows authentication |
> | Java | [Call Microsoft Graph](https://github.com/Azure-Samples/ms-identity-msal-java-samples/tree/main/2.%20Client-Side%20Scenarios/Integrated-Windows-Auth-Flow) | MSAL Java | Integrated Windows authentication |
> | Node.js | [Sign in users](https://github.com/Azure-Samples/ms-identity-javascript-nodejs-desktop) | MSAL Node | Authorization code with PKCE |
> | PowerShell | [Call Microsoft Graph by signing in users using username/password](https://github.com/azure-samples/active-directory-dotnetcore-console-up-v2) | MSAL.NET | Resource owner password credentials |
> | Python | [Sign in users](https://github.com/Azure-Samples/ms-identity-python-desktop) | MSAL Python | Resource owner password credentials |
> | Universal Window Platform (UWP) | [Call Microsoft Graph](https://github.com/Azure-Samples/active-directory-xamarin-native-v2/tree/main/2-With-broker) | MSAL.NET | Web account manager |
> | Windows Presentation Foundation (WPF) | [Sign in users and call Microsoft Graph](https://github.com/Azure-Samples/active-directory-dotnet-native-aspnetcore-v2/tree/master/2.%20Web%20API%20now%20calls%20Microsoft%20Graph) | MSAL.NET | Authorization code with PKCE |
> | XAML | &#8226; [Sign in users and call ASP.NET core web API](https://github.com/Azure-Samples/active-directory-dotnet-native-aspnetcore-v2/tree/master/1.%20Desktop%20app%20calls%20Web%20API) <br/> &#8226; [Sign in users and call Microsoft Graph](https://github.com/azure-samples/active-directory-dotnet-desktop-msgraph-v2) | MSAL.NET | Authorization code with PKCE |

## Mobile

The following samples show public client mobile applications that access the Microsoft Graph API. These client applications use the Microsoft Authentication Library (MSAL).

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample(s) <br/> on GitHub |Auth<br/> libraries |Auth flow |
> | ----------- | ----------- |----------- |----------- |
> | iOS | &#8226; [Call Microsoft Graph native](https://github.com/Azure-Samples/ms-identity-mobile-apple-swift-objc) <br/> &#8226; [Call Microsoft Graph with Azure AD nxoauth](https://github.com/azure-samples/active-directory-ios-native-nxoauth2-v2) | MSAL iOS | Authorization code with PKCE |
> | Java | [Sign in users and call Microsoft Graph](https://github.com/Azure-Samples/ms-identity-android-java) | MSAL Android | Authorization code with PKCE |
> | Kotlin | [Sign in users and call Microsoft Graph](https://github.com/Azure-Samples/ms-identity-android-kotlin) | MSAL Android | Authorization code with PKCE |
> | Xamarin | &#8226; [Sign in users and call Microsoft Graph](https://github.com/Azure-Samples/active-directory-xamarin-native-v2/tree/main/1-Basic) <br/>&#8226; [Sign in users with broker and call Microsoft Graph](https://github.com/Azure-Samples/active-directory-xamarin-native-v2/tree/main/2-With-broker) | MSAL.NET | Authorization code with PKCE |

## Service / daemon

The following samples show an application that accesses the Microsoft Graph API with its own identity (with no user).

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample(s) <br/> on GitHub |Auth<br/> libraries |Auth flow |
> | ----------- | ----------- |----------- |----------- |
> |.NET Core| &#8226; [Call Microsoft Graph](https://github.com/Azure-Samples/active-directory-dotnetcore-daemon-v2/tree/master/1-Call-MSGraph) <br/> &#8226; [Call web API](https://github.com/Azure-Samples/active-directory-dotnetcore-daemon-v2/tree/master/2-Call-OwnApi)<br/> &#8226; [Call own web API](https://github.com/Azure-Samples/active-directory-dotnetcore-daemon-v2/tree/master/4-Call-OwnApi-Pop) <br/> &#8226; [Using managed identity and Azure key vault](https://github.com/Azure-Samples/active-directory-dotnetcore-daemon-v2/tree/master/3-Using-KeyVault)| MSAL.NET | Client credentials grant|
> | ASP.NET|[Multi-tenant with Microsoft identity platform endpoint](https://github.com/Azure-Samples/ms-identity-aspnet-daemon-webapp) | MSAL.NET | Client credentials grant|
> | Java | &#8226; [Call Microsoft Graph with Secret](https://github.com/Azure-Samples/ms-identity-msal-java-samples/tree/main/1.%20Server-Side%20Scenarios/msal-client-credential-secret) <br/> &#8226; [Call Microsoft Graph with Certificate](https://github.com/Azure-Samples/ms-identity-msal-java-samples/tree/main/1.%20Server-Side%20Scenarios/msal-client-credential-certificate)| MSAL Java | Client credentials grant|
> | Node.js | [Call Microsoft Graph with secret](https://github.com/Azure-Samples/ms-identity-javascript-nodejs-console) | MSAL Node | Client credentials grant |
> | Python | &#8226; [Call Microsoft Graph with secret](https://github.com/Azure-Samples/ms-identity-python-daemon/tree/master/1-Call-MsGraph-WithSecret) <br/> &#8226; [Call Microsoft Graph with certificate](https://github.com/Azure-Samples/ms-identity-python-daemon/tree/master/2-Call-MsGraph-WithCertificate) | MSAL Python| Client credentials grant|

## Azure Functions as web APIs

The following samples show how to protect an Azure Function using HttpTrigger and exposing a web API with the Microsoft identity platform, and how to call a downstream API from the web API.

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample(s) <br/> on GitHub |Auth<br/> libraries |Auth flow |
> | ----------- | ----------- |----------- |----------- |
> | .NET | [.NET Azure function web API secured by Azure AD](https://github.com/Azure-Samples/ms-identity-dotnet-webapi-azurefunctions) | MSAL.NET | Authorization code |
> | Node.js | [Node.js Azure function web API secured by Azure AD](https://github.com/Azure-Samples/ms-identity-nodejs-webapi-azurefunctions) | MSAL Node | Authorization bearer |
> | Node.js | [Call Microsoft Graph API on behalf of a user](https://github.com/Azure-Samples/ms-identity-nodejs-webapi-onbehalfof-azurefunctions) | MSAL Node| On-Behalf-Of (OBO)|
> | Python | [Python Azure function web API secured by Azure AD](https://github.com/Azure-Samples/ms-identity-python-webapi-azurefunctions) | MSAL Python | Authorization code |

## Headless

The following sample shows a public client application running on a device without a web browser. The app can be a command-line tool, an app running on Linux or Mac, or an IoT application. The sample features an app accessing the Microsoft Graph API, in the name of a user who signs-in interactively on another device (such as a mobile phone). This client application uses the Microsoft Authentication Library (MSAL).

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample(s) <br/> on GitHub |Auth<br/> libraries |Auth flow |
> | ----------- | ----------- |----------- |----------- |
> | .NET core | [Invoke protected API from text-only device](https://github.com/azure-samples/active-directory-dotnetcore-devicecodeflow-v2) | MSAL.NET | Device code|
> | Java | [Sign in users and invoke protected API from text-only device](https://github.com/Azure-Samples/ms-identity-msal-java-samples/tree/main/2.%20Client-Side%20Scenarios/Device-Code-Flow) | MSAL Java | Device code |
> | Python | [Call Microsoft Graph](https://github.com/Azure-Samples/ms-identity-python-devicecodeflow) | MSAL Python | Device code |

## Microsoft Teams applications

The following sample illustrates Microsoft Teams Tab application that signs in users. Additionally it demonstrates how to call Microsoft Graph API with the user's identity using the Microsoft Authentication Library (MSAL).

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample(s) <br/>on GitHub | Auth<br/> libraries | Auth flow |
> | ------- | -------- | ------------- | -------------- |
> | Node.js | [Teams Tab app: single sign-on (SSO) and call Microsoft Graph](https://github.com/OfficeDev/Microsoft-Teams-Samples/tree/main/samples/tab-sso/nodejs) | MSAL Node |  On-Behalf-Of (OBO) |

## Multi-tenant SaaS

The following samples show how to configure your application to accept sign-ins from any Azure Active Directory (Azure AD) tenant. Configuring your application to be _multi-tenant_ means that you can offer a **Software as a Service** (SaaS) application to many organizations, allowing their users to be able to sign-in to your application after providing consent.

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample(s) <br/> on GitHub |Auth<br/> libraries |Auth flow |
> | ----------- | ----------- |----------- |----------- |
> | ASP.NET Core | [ASP.NET Core MVC web application calls Microsoft Graph API](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/2-WebApp-graph-user/2-3-Multi-Tenant) | MSAL.NET | OpenID connect |
> | ASP.NET Core | [ASP.NET Core MVC web application calls ASP.NET Core Web API](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/4-WebApp-your-API/4-3-AnyOrg) | MSAL.NET | Authorization code |

## Next steps

If you'd like to delve deeper into more sample code, see:

- [Sign in users and call the Microsoft Graph API from an Angular](tutorial-v2-angular-auth-code.md)
- [Sign in users in a Node.js and Express web app](tutorial-v2-nodejs-webapp-msal.md)
- [Call the Microsoft Graph API from a Universal Windows Platform](tutorial-v2-windows-uwp.md)
