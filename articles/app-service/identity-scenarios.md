---
title: 'App Service authentication recommendations'
description: There are several different authentication solutions available for web apps or web APIs hosted on App Service. This article provides recommendations on which auth solution to use for specific scenarios such as custom authentication, incremental consent, or calling downstream resources as the signed-in user.  
author: rwike77
manager: CelesteDG
ms.author: ryanwi
ms.topic: conceptual
ms.date: 06/10/2023
---
# Authentication scenarios and recommendations

Your web app or web API running in Azure App Service may need to sign in and authenticate users or make sure only authenticated users can access your web API.  There are several different authentication solutions available.  This article describes the easiest way to enable authentication for your web app or web API.  For more complex scenarios, recommendations on which authentication solutions to use are provided.

## Authentication solutions

- **Azure App Service built-in authentication** - Allows you to sign in users and access data by writing minimal or no code in your web app, RESTful API, or mobile back end. It’s built directly into the platform and doesn’t require any particular language, library, security expertise, or even any code to utilize.
- **Microsoft Authentication Library (MSAL)** - Enables developers to acquire security tokens from the Microsoft identity platform to authenticate users and access secured web APIs. Available in multiple supported platforms and frameworks, these are general purpose libraries that can be used in a variety of hosted environments. You can integrate with multiple sign-in providers. For example, Azure AD, Facebook, Google, Twitter.
- **Microsoft.Identity.Web** - A wrapper for MSAL.NET, it provides a set of ASP.NET Core libraries that simplifies adding authentication support to web apps and web APIs integrating with the Microsoft identity platform. This library can be used in apps in a variety of hosted environments. You can integrate with multiple sign-in providers. For example, Azure AD, Facebook, Google, Twitter.

## Scenario recommendations

The following table lists each authentication solution and some important factors for when you would use it.

|Connection method|When to use|
|--|--|
|Built-in App Service authentication |* You want less code to own and manage.<br>* Your app's language and SDKs don't provide user sign-in or authorization.<br>* You don't have the ability to modify your app code (for example, when migrating legacy apps).<br>* You need to handle authentication through configuration and not code.<br>* You need to sign in external or social users.|
|Microsoft Authentication Library (MSAL)|* You need a code solution in one of several different languages<br>* You need to add custom authorization logic.<br>* You need to support incremental consent.<br>* You also need to call more than one downstream API as the user.<br>* You need information about the signed-in user in your code.<br>* You need to sign in external or social users.<br>* Your app need to handle the access token expiring without making the user sign in again.|
|Microsoft.Identity.Web |* You have an ASP.NET Core app. <br>* You need single sign-on support in your IDE during local development.<br>* You need to add custom authorization logic.<br>* You need to support incremental consent.<br>* You also need to call more than one downstream API as the user.<br>* You need information about the signed-in user in your code.<br>* You need to sign in external or social users.<br>* Your app need to handle the access token expiring without making the user sign in again.|

The following table lists authentication scenarios and the authentication solution(s) you would use.

|Scenario |App Service built-in auth| Microsoft Authentication Library | Microsoft.Identity.Web |
|:--|:--:|:--:|:--:|
| Need a fast and simple way to limit access to user in your organization? | ✅ | ❌ | ❌ |
| Able to modify the application code (app migration)? | ❌ | ✅ | ✅ |
| Need to sign in users from external or social identity providers?  | ✅ | ✅ | ✅ |
| Single page app or static web app? | ✅ | ✅ | ✅ |
| Need to call more than one downstream API as the user? | ❌ | ✅ | ✅ |
| Your app's language and libraries support user sign-in/authorization?  | ❌ | ✅ | ✅ |
| Even if you can use a code solution, would you rather *not* use libraries? Don't want the maintenance burden?  | ✅ | ❌ | ❌ |
| Does your web app need to provide incremental consent?  | ❌ | ✅ | ✅ |
| Your app need to handle the access token expiring without making the user sign in again (use a refresh token)? | ❌ | ✅ | ✅ |
| Need custom authorization logic or info about signed-in user? | ❌ | ✅ | ✅ |
| Need some unauthenticated web pages? | ✅ | ✅ | ✅ |
| Need single sign-on support in your IDE during local development? | ❌ | ✅ | ✅ |

## Built-in App Service authentication and authorization

[App Service built-in authentication](overview-authentication-authorization.md) provides built-in authentication capabilities, so you can sign in users and access data by writing minimal or no code. You can easily turn on and configure through the Azure portal and app settings. It’s built directly into the platform and doesn’t require any particular language, SDK, security expertise, or even any code to utilize. You can integrate with multiple sign-in providers. For example, Azure AD, Facebook, Google, Twitter.

To get started, read:
- [Enable App Service built-in authentication](scenario-secure-app-authentication-app-service.md)

## Microsoft Authentication Library (MSAL)

The [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview) enables developers to acquire security tokens from the Microsoft identity platform to authenticate users and access secured web APIs. It can be used to provide secure access to Microsoft Graph, other Microsoft APIs, third-party web APIs, or your own web API. MSAL supports many different application architectures and platforms including [.NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet), [Android](https://github.com/AzureAD/microsoft-authentication-library-for-android), [Angular](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-angular), [Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node), [JavaScript](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser), [Java](https://github.com/AzureAD/microsoft-authentication-library-for-java), [Python](https://github.com/AzureAD/microsoft-authentication-library-for-python), [Go](https://github.com/AzureAD/microsoft-authentication-library-for-go), [React](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react), and [iOS](https://github.com/AzureAD/microsoft-authentication-library-for-objc). MSAL gives you many ways to get tokens, with a consistent API for many platforms.

To get started, read:
- [Sign in users to a web app](/azure/active-directory/develop/scenario-web-app-sign-user-overview)
- [Sign in users to a web API](/azure/active-directory/develop/scenario-protected-web-api-overview)
- [Sign in users to a single-page application (SPA)](/azure/active-directory/develop/scenario-spa-overview)

## Microsoft.Identity.Web

[Microsoft.Identity.Web](/azure/active-directory/develop/microsoft-identity-web) is a set of ASP.NET Core libraries that simplifies adding authentication support to web apps and web APIs integrating with the Microsoft identity platform. It provides a single-surface API convenience layer that ties together ASP.NET Core, its authentication middleware, and the Microsoft Authentication Library (MSAL) for .NET. You can build ASP.NET Core web apps or web APIs that use Azure Active Directory (Azure AD) or Azure AD B2C for identity and access management (IAM).

To get started, read:

- [Sign in users to a web app](/azure/active-directory/develop/scenario-web-app-sign-user-overview?tabs=aspnetcore)
- [Sign in users to a web API](/azure/active-directory/develop/scenario-protected-web-api-overview)
- [Sign in users to a Blazor Server app](/azure/active-directory/develop/tutorial-blazor-server)

## Next steps

Learn more about [App Service built-in authentication and authorization](overview-authentication-authorization.md)
[Add built-in authentication to your web app running on App Service](scenario-secure-app-authentication-app-service.md)