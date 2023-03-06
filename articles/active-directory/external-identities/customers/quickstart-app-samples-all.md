---
title: Quickstart - Customer tenant trial
description: In this quickstart, learn how to get started with a customer tenant free trial. Learn how to set up your tenant, register an app, choose authentication methods, and create user flows.
services: active-directory
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: quickstart
ms.date: 03/03/2023
ms.author: mimart
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to
---

# Quickstarts and code samples for customer tenants

Microsoft maintains these quickstarts to demonstrate how to write applications that integrate with Azure AD customer tenants. Common authentication and authorization scenarios are implemented in several application types, development languages, and frameworks.

Each code sample includes a _README.md_ file describing how to build the project (if applicable) and run the sample application. Comments in the code help you understand how these libraries are used in the application to perform authentication and authorization by using the identity platform.

## Single-page applications

These samples show how to write a single-page application secured with Microsoft identity platform. These samples use one of the flavors of MSAL.js.

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample(s) <br/>on GitHub | Auth<br/> libraries | Auth flow |
> | ------- | -------- | ------------- | -------------- |
> | Angular | &#8226; [Sign in users](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/tree/main/1-Authentication/1-sign-in/README.md) <br/> &#8226; [Call Microsoft Graph](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/tree/main/2-Authorization-I/1-call-graph/README.md)<br/>&#8226; [Call .NET Core web API](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/tree/main/3-Authorization-II/1-call-api)<br/>&#8226; [Call .NET Core web API (customers)](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/tree/main/3-Authorization-II/2-call-api-b2c)<br/>&#8226; [Call Microsoft Graph via OBO](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/blob/main/6-AdvancedScenarios/1-call-api-obo/README.md)<br/>&#8226; [Use App Roles for access control](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/tree/main/5-AccessControl/1-call-api-roles/README.md)<br/> &#8226; [Use Security Groups for access control](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/tree/main/5-AccessControl/2-call-api-groups/README.md) | MSAL Angular | &#8226; Authorization code with PKCE<br/>&#8226; On-behalf-of (OBO) <br/>&#8226; Continuous Access Evaluation (CAE) |
> | JavaScript | &#8226; [Sign in users](https://github.com/Azure-Samples/ms-identity-javascript-tutorial/tree/main/1-Authentication/1-sign-in/README.md) <br/> &#8226; [Call Microsoft Graph](https://github.com/Azure-Samples/ms-identity-javascript-tutorial/tree/main/2-Authorization-I/1-call-graph/README.md) <br/>&#8226; [Call Node.js web API](https://github.com/Azure-Samples/ms-identity-javascript-tutorial/tree/main/3-Authorization-II/1-call-api/README.md) | MSAL.js | &#8226; Authorization code with PKCE<br/>&#8226; On-behalf-of (OBO) <br/>&#8226; Conditional Access |
> |**React | &#8226; [Sign in users](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/1-Authentication/1-sign-in/README.md)<br/>&#8226; [Sign-in users on both server and client side apps](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/6-AdvancedScenarios/4-sign-in-hybrid/README.md)<br/> &#8226; [Call Microsoft Graph](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/2-Authorization-I/1-call-graph/README.md)<br/>&#8226; [Call Node.js web API](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/3-Authorization-II/1-call-api)<br/>&#8226; [Call Microsoft Graph via OBO](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/6-AdvancedScenarios/1-call-api-obo/README.md)<br/>&#8226; [Use App Roles for access control](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/5-AccessControl/1-call-api-roles/README.md)<br/>&#8226; [Use Security Groups for access control](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/5-AccessControl/2-call-api-groups/README.md)<br/>&#8226; [Use step-up authentication to call Node.js web API](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/6-AdvancedScenarios/3-call-api-acrs/README.md)| MSAL React | &#8226; Authorization code with PKCE<br/>&#8226; On-behalf-of (OBO) <br/>&#8226; Conditional Access (CA) <br/>&#8226; Conditional Access Auth Context (acrs) <br/>&#8226; Continuous Access Evaluation (CAE) |

## Web API

The following samples show how to protect a web API with the Microsoft identity platform, and how to call a downstream API from the web API.

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample(s) <br/> on GitHub |Auth<br/> libraries |Auth flow |
> | ----------- | ----------- |----------- |----------- |
> | Node.js | &#8226; [Protect a Node.js web API](https://github.com/Azure-Samples/ms-identity-javascript-tutorial/tree/main/3-Authorization-II/1-call-api)  | MSAL Node | Authorization bearer |

## Mobile

The following samples show public client mobile applications that access the Microsoft Graph API. These client applications use the Microsoft Authentication Library (MSAL).

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample(s) <br/> on GitHub |Auth<br/> libraries |Auth flow |
> | ----------- | ----------- |----------- |----------- |
> | .NET Core | &#8226; [Call Microsoft Graph using MAUI](https://github.com/Azure-Samples/ms-identity-dotnetcore-maui/tree/main/MauiAppBasic) <br/> &#8226; [Call Microsoft Graph using MAUI wih broker](https://github.com/Azure-Samples/ms-identity-dotnetcore-maui/tree/main/MauiAppWithBroker) <br/> &#8226; [Call Active Directory customer tenant using MAUI](https://github.com/Azure-Samples/ms-identity-dotnetcore-maui/tree/main/MauiAppB2C) | MSAL MAUI | Authorization code with PKCE |

## Service / daemon

The following samples show an application that accesses the Microsoft Graph API with its own identity (with no user).

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample(s) <br/> on GitHub |Auth<br/> libraries |Auth flow |
> | ----------- | ----------- |----------- |----------- |
> |.NET Core| &#8226; [Call Microsoft Graph](https://github.com/Azure-Samples/active-directory-dotnetcore-daemon-v2/tree/master/1-Call-MSGraph) <br/> &#8226; [Call web API](https://github.com/Azure-Samples/active-directory-dotnetcore-daemon-v2/tree/master/2-Call-OwnApi) | MSAL.NET | Client credentials grant|
> | Node.js | [Call Microsoft Graph with secret](https://github.com/Azure-Samples/ms-identity-javascript-nodejs-console) | MSAL Node | Client credentials grant |

# Next steps
