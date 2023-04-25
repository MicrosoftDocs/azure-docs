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
ms.date: 04/19/2023
ms.author: mimart
ms.custom: it-pro

---

# Samples for customer identity and access management (CIAM) in Azure Active Directory

Microsoft maintains code samples that demonstrate how to integrate various application types with Azure AD for customers. We provide instructions for downloading and using samples or building your own app based on common authentication and authorization scenarios, development languages, and platforms. Included are instructions for building the project (if applicable) and running the sample application. Within the sample code, comments help you understand how these libraries are used in the application to perform authentication and authorization in a customer tenant.

## Samples and guides

Use the tabs to sort samples either by app type or your preferred language/platform.

<!-- All links are placeholders, final links TBD -->
# [**By app type**](#tab/apptype)

### Single-page application (SPA)

These samples and how-to guides demonstrate how to integrate a single-page application with Azure AD for customers.

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample guide | Build and integrate guide  |
> | ------- | -------- | ------------- | 
> | JavaScript, Vanilla | &#8226; [Sign in users](https://github.com/Azure-Samples/ms-identity-b2c-javascript-spa) <br/> &#8226; [Call an API against a customer tenant](https://github.com/Azure-Samples/ms-identity-b2c-javascript-spa) | [Vanilla SPA](https://github.com/Azure-Samples/ms-identity-b2c-javascript-spa)    |
> | JavaScript, Angular | &#8226; [Sign in users](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/tree/main/3-Authorization-II/2-call-api-b2c) <br/> &#8226; [Call an API against a customer tenant](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/tree/main/3-Authorization-II/2-call-api-b2c) | [Angular SPA](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/tree/main/3-Authorization-II/2-call-api-b2c)    |
> | JavaScript, React | &#8226; [Sign in users](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/3-Authorization-II/2-call-api-b2c)<br/>&#8226; [Call an API against a customer tenant](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/3-Authorization-II/2-call-api-b2c)| [React SPA](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/3-Authorization-II/2-call-api-b2c)   |

### Web app

These samples and how-to guides demonstrate how to write a web application that integrates with Azure AD for customers.

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample guide | Build and integrate guide  |
> | ------- | -------- | ------------- | 
> | JavaScript, Node/Express | &#8226; [Sign in users](how-to-web-app-node-sample-sign-in.md)<br/> &#8226; [Call an API against a customer tenant](https://github.com/Azure-Samples/active-directory-b2c-msal-node-sign-in-sign-out-webapp)  |  [Node/Express web app](how-to-web-app-node-sign-in-overview.md)  |
> | ASP.NET Core | &#8226; [Sign in users](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/1-WebApp-OIDC/1-5-B2C) <br/> &#8226; [Call an API against a customer tenant](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/1-WebApp-OIDC/1-5-B2C)  | [ASP.NET Core web app](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/1-WebApp-OIDC/1-5-B2C)   |

### Web API

These samples and how-to guides demonstrate how to protect a web API with the Microsoft identity platform, and how to call a downstream API from the web API.

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample guide | Build and integrate guide  |
> | ------- | -------- | ------------- | 
> | ASP.NET core | &#8226; [Protect a web API on a customer tenant](https://github.com/Azure-Samples/active-directory-b2c-dotnet-webapp-and-webapi)  | [ASP.NET core web API](https://github.com/Azure-Samples/active-directory-b2c-dotnet-webapp-and-webapi)   |

### Headless

These samples and how-to guides demonstrate how to write a headless application that integrates with Azure AD for customers.

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample guide | Build and integrate guide  |
> | ------- | -------- | ------------- | 
> | JavaScript, Node | &#8226; [Device code flow, sign in users](https://github.com/Azure-Samples/ms-identity-b2c-javascript-nodejs-management/tree/main/Chapter2)<br/> &#8226; [Call an API against a customer tenant](https://github.com/Azure-Samples/ms-identity-b2c-javascript-nodejs-management/tree/main/Chapter2)  | [Node device code flow](https://github.com/Azure-Samples/ms-identity-b2c-javascript-nodejs-management/tree/main/Chapter2)   |
> | .NET | &#8226; [Device code flow, sign in users](https://github.com/Azure-Samples/ms-identity-dotnetcore-b2c-account-management)<br/> &#8226; [Call an API against a customer tenant](https://github.com/Azure-Samples/ms-identity-dotnetcore-b2c-account-management)  | [.NET device code flow](https://github.com/Azure-Samples/ms-identity-dotnetcore-b2c-account-management)   |


### Desktop

These samples and how-to guides demonstrate how to write a desktop application that integrates with Azure AD for customers.

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample guide | Build and integrate guide  |
> | ------- | -------- | ------------- | 
> | JavaScript, Electron | &#8226; [Sign in users](how-to-desktop-app-electron-sample-sign-in.md)<br/>&#8226; [Call an API against a customer tenant](https://github.com/Azure-Samples/active-directory-b2c-dotnet-desktop)| [Electron desktop app](https://github.com/Azure-Samples/active-directory-b2c-dotnet-desktop)   |
> | ASP.NET Core MAUI | [Sign in users](https://github.com/Azure-Samples/active-directory-b2c-dotnet-desktop)<br/>&#8226; [Call Microsoft Graph using MAUI](https://github.com/Azure-Samples/active-directory-b2c-dotnet-desktop) | [ASP.NET Core MAUI desktop app](https://github.com/Azure-Samples/active-directory-b2c-dotnet-desktop)   |

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
> | App type | Code sample guide | Build and integrate guide  |
> | ------- | -------- | ------------- | 
> | Headless | &#8226; [Sign in users](https://github.com/Azure-Samples/ms-identity-dotnetcore-b2c-account-management) <br/> &#8226; [Call an API against a customer tenant](https://github.com/Azure-Samples/ms-identity-dotnetcore-b2c-account-management)  | [.NET device code flow](https://github.com/Azure-Samples/ms-identity-dotnetcore-b2c-account-management)   |
> | Web API| &#8226; [Protect a web API on a customer tenant](https://github.com/Azure-Samples/active-directory-b2c-dotnet-webapp-and-webapi)  |  [ASP.NET core web API](https://github.com/Azure-Samples/active-directory-b2c-dotnet-webapp-and-webapi)  |
> | Web app | &#8226; [Sign in users](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/1-WebApp-OIDC/1-5-B2C) <br/> &#8226; [Call an API against a customer tenant](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/1-WebApp-OIDC/1-5-B2C)  [ASP.NET Core web app](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/1-WebApp-OIDC/1-5-B2C)    |

### ASP.NET Core MAUI

> [!div class="mx-tdCol2BreakAll"]
> | App type | Code sample guide | Build and integrate guide  |
> | ------- | -------- | ------------- | 
> | Desktop | [Sign in users](https://github.com/Azure-Samples/active-directory-b2c-dotnet-desktop)<br/>&#8226; [Call Microsoft Graph using MAUI](https://github.com/Azure-Samples/active-directory-b2c-dotnet-desktop) |  [ASP.NET Core MAUI desktop app](https://github.com/Azure-Samples/active-directory-b2c-dotnet-desktop)  |

### JavaScript, Vanilla

> [!div class="mx-tdCol2BreakAll"]
> | App type | Code sample guide | Build and integrate guide  |
> | ------- | -------- | ------------- | 
> | Single-page application | &#8226; [Sign in users](https://github.com/Azure-Samples/ms-identity-b2c-javascript-spa) <br/> &#8226; [Call an API against a customer tenant](https://github.com/Azure-Samples/ms-identity-b2c-javascript-spa) | [Vanilla SPA](https://github.com/Azure-Samples/ms-identity-b2c-javascript-spa)  |

### JavaScript, Angular

> [!div class="mx-tdCol2BreakAll"]
> | App type | Code sample guide | Build and integrate guide  |
> | ------- | -------- | ------------- | 
> | Single-page application | &#8226; [Sign in users](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/tree/main/3-Authorization-II/2-call-api-b2c) <br/> &#8226; [Call an API against a customer tenant](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/tree/main/3-Authorization-II/2-call-api-b2c) | [Angular SPA](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/tree/main/3-Authorization-II/2-call-api-b2c)    |

### JavaScript, React

> [!div class="mx-tdCol2BreakAll"]
> | App type | Code sample guide | Build and integrate guide  |
> | ------- | -------- | ------------- | 
> | Single-page application| &#8226; [Sign in users](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/3-Authorization-II/2-call-api-b2c)<br/>&#8226; [Call an API against a customer tenant](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/3-Authorization-II/2-call-api-b2c)| [React SPA](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/3-Authorization-II/2-call-api-b2c)   |

### JavaScript, Node

> [!div class="mx-tdCol2BreakAll"]
> | App type | Code sample guide | Build and integrate guide  |
> | ------- | -------- | ------------- | 
> | Headless | &#8226; [Device code flow, sign in users](https://github.com/Azure-Samples/ms-identity-b2c-javascript-nodejs-management/tree/main/Chapter2)<br/> &#8226; [Call an API against a customer tenant](https://github.com/Azure-Samples/ms-identity-b2c-javascript-nodejs-management/tree/main/Chapter2)  |  [Node device code flow](https://github.com/Azure-Samples/ms-identity-b2c-javascript-nodejs-management/tree/main/Chapter2)  |

### JavaScript, Node/Express

> [!div class="mx-tdCol2BreakAll"]
> | App type | Code sample guide | Build and integrate guide  |
> | ------- | -------- | ------------- | 
> | Web app |&#8226; [Sign in users](how-to-web-app-node-sample-sign-in.md)<br/> &#8226; [Call an API against a customer tenant](https://github.com/Azure-Samples/active-directory-b2c-msal-node-sign-in-sign-out-webapp)  | [Node/Express web app](how-to-web-app-node-sign-in-overview.md)   |

### JavaScript, Electron

> [!div class="mx-tdCol2BreakAll"]
> | App type | Code sample guide | Build and integrate guide  |
> | ------- | -------- | ------------- | 
> | Desktop | &#8226; [Sign in users](how-to-desktop-app-electron-sample-sign-in.md)<br/>&#8226; [Call an API against a customer tenant](https://github.com/Azure-Samples/active-directory-b2c-dotnet-desktop)|  [Electron desktop app](https://github.com/Azure-Samples/active-directory-b2c-dotnet-desktop)  |

---
