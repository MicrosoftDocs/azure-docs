---
title: Code samples for customer tenants
description: Find code samples for applications you can run in a customer tenant. Find samples by app type or language.
services: active-directory
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: sample
ms.date: 04/18/2023
ms.author: mimart
ms.custom: it-pro

---

# Samples for customer identity and access management (CIAM) in Azure Active Directory

Microsoft maintains code samples that demonstrate how to integrate various application types with Azure AD for customers. We provide instructions for downloading and using samples or building your own app based on common authentication and authorization scenarios, development languages, and platforms. Included are instructions for building the project (if applicable) and running the sample application. Within the sample code, comments help you understand how these libraries are used in the application to perform authentication and authorization in a customer tenant.

## Samples and guides

Use the tabs to sort samples either by app type or your preferred language/platform.

# [**By app type**](#tab/apptype)

### Single-page application (SPA)

These samples and how-to guides demonstrate how to integrate a single-page application with Azure AD for customers.

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample guide | Build and integrate Integration guide  |
> | ------- | -------- | ------------- | -------------- |
> | JavaScript, Vanilla | &#8226; [Sign in users]() <br/> &#8226; [Call an API against a customer tenant]() | MSAL Angular |  |
> | JavaScript, Angular | &#8226; [Sign in users]() <br/> &#8226; [Call an API against a customer tenant]() | MSAL.js |   |
> | JavaScript, React | &#8226; [Sign in users]()<br/>&#8226; [Call an API against a customer tenant]()| MSAL React |  |

### Web app

These samples and how-to guides demonstrate how to write a web application that integrates with Azure AD for customers.

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample(s) <br/> on GitHub |Auth<br/> libraries |Auth flow |
> | ----------- | ----------- |----------- |----------- |
> | JavaScript, Node/Express | &#8226; [Sign in users]()<br/> &#8226; [Call an API against a customer tenant]()  |  |  |
> | ASP.NET Core | &#8226; [Sign in users]() <br/> &#8226; [Call an API against a customer tenant]()  |  |  |

### Web API

These samples and how-to guides demonstrate how to protect a web API with the Microsoft identity platform, and how to call a downstream API from the web API.

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample(s) <br/> on GitHub |Auth<br/> libraries |Auth flow |
> | ----------- | ----------- |----------- |----------- |
> | ASP.NET core | &#8226; [Protect a web API on a customer tenant]()  |  |  |

### Headless

These samples and how-to guides demonstrate how to write a headless application that integrates with Azure AD for customers.

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample(s) <br/> on GitHub |Auth<br/> libraries |Auth flow |
> | ----------- | ----------- |----------- |----------- |
> | JavaScript, Node | &#8226; [Device code flow, sign in users]()<br/> &#8226; [Call an API against a customer tenant]()  |  |  |
> | .NET | &#8226; [Device code flow, sign in users]()<br/> &#8226; [Call an API against a customer tenant]()  |  |  |


### Desktop

These samples and how-to guides demonstrate how to write a desktop application that integrates with Azure AD for customers.

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample(s) <br/> on GitHub |Auth<br/> libraries |Auth flow |
> | ----------- | ----------- |----------- |----------- |
> | JavaScript, Electron | &#8226; [Sign in users]()<br/>&#8226; [Call an API against a customer tenant]()|  |  |> | ASP.NET Core MAUI | [Sign in users]()<br/>&#8226; [Call Microsoft Graph using MAUI]() |  |  |
> | ASP.NET Core MAUI | [Sign in users]()<br/>&#8226; [Call Microsoft Graph using MAUI]() |  |  |

<!--
### Mobile

These samples and how-to guides demonstrate how to write a public client mobile application that integrates with Azure AD for customers.

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample(s) <br/> on GitHub |Auth<br/> libraries |Auth flow |
> | ----------- | ----------- |----------- |----------- |
> | ASP.NET Core MAUI | [Sign in users]()<br/>&#8226; [Call Microsoft Graph using MAUI]() |  |  |
-->

# [**By language/platform**](#tab/language)

### ASP.NET Core

> [!div class="mx-tdCol2BreakAll"]
> | App type | Code sample(s) <br/>on GitHub | Auth<br/> libraries | Auth flow |
> | ------- | -------- | -------------- |-------------- |
> | Headless | &#8226; [Sign in users]() <br/> &#8226; [Call an API against a customer tenant]()  |  |  |
> | Web API| &#8226; [Protect a web API on a customer tenant]()  |  |  |
> | Web app | &#8226; [Sign in users]() <br/> &#8226; [Call an API against a customer tenant]()  |  |  |

### ASP.NET Core MAUI

> [!div class="mx-tdCol2BreakAll"]
> | App type | Code sample(s) <br/>on GitHub | Auth<br/> libraries | Auth flow |
> | ------- | -------- | -------------- |-------------- |
> | Desktop | [Sign in users]()<br/>&#8226; [Call Microsoft Graph using MAUI]() |  |  |

### JavaScript, Vanilla

> [!div class="mx-tdCol2BreakAll"]
> | App type | Code sample(s) <br/>on GitHub | Auth<br/> libraries | Auth flow |
> | ------- | -------- | -------------- |-------------- |
> | Single-page application | &#8226; [Sign in users]() <br/> &#8226; [Call an API against a customer tenant]() | MSAL Angular |  |

### JavaScript, Angular

> [!div class="mx-tdCol2BreakAll"]
> | App type | Code sample(s) <br/>on GitHub | Auth<br/> libraries | Auth flow |
> | ------- | -------- | -------------- |-------------- |
> | Single-page application | &#8226; [Sign in users]() <br/> &#8226; [Call an API against a customer tenant]() |  |   |

### JavaScript, React

> [!div class="mx-tdCol2BreakAll"]
> | App type | Code sample(s) <br/>on GitHub | Auth<br/> libraries | Auth flow |
> | ------- | -------- | -------------- |-------------- |
> | Single-page application| &#8226; [Sign in users]()<br/>&#8226; [Call an API against a customer tenant]()|  |  |

### JavaScript, Node

> [!div class="mx-tdCol2BreakAll"]
> | App type | Code sample(s) <br/>on GitHub | Auth<br/> libraries | Auth flow |
> | ------- | -------- | -------------- |-------------- |
> | Headless | &#8226; [Device code flow, sign in users]()<br/> &#8226; [Call an API against a customer tenant]()  |  |  |

### JavaScript, Node/Express

> [!div class="mx-tdCol2BreakAll"]
> | App type | Code sample(s) <br/>on GitHub | Auth<br/> libraries | Auth flow |
> | ------- | -------- | -------------- |-------------- |
> | Web app |&#8226; [Sign in users]()<br/> &#8226; [Call an API against a customer tenant]()  |  |  |

### JavaScript, Electron

> [!div class="mx-tdCol2BreakAll"]
> | App type | | Code sample(s) <br/>on GitHub | Auth<br/> libraries | Auth flow |
> | ------- | -------- | ------------- | -------------- |-------------- |
> | Desktop | &#8226; [Sign in users]()<br/>&#8226; [Call an API against a customer tenant]()|  |  |> | ASP.NET Core MAUI | [Sign in users]()<br/>&#8226; [Call Microsoft Graph using MAUI]() |  |  |

---