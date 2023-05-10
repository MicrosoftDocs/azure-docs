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
ms.date: 05/07/2023
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
> | JavaScript, Vanilla | &#8226; [Sign in users](how-to-single-page-app-vanillajs-sample-sign-in.md) <br/> &#8226; *Call an API against a customer tenant* | &#8226; [Vanilla SPA](how-to-single-page-app-vanillajs-prepare-tenant.md)    |
> | JavaScript, Angular | &#8226; *Sign in users* <br/> &#8226; *Call an API against a customer tenant* | &#8226; *Angular SPA*    |
> | JavaScript, React | &#8226; [Sign in users](how-to-single-page-application-react-sample.md)<br/>&#8226; *Call an API against a customer tenant*| &#8226; [React SPA](how-to-single-page-application-react-prepare-tenant.md)   |

### Web app

These samples and how-to guides demonstrate how to write a web application that integrates with Azure AD for customers.

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample guide | Build and integrate guide  |
> | ------- | -------- | ------------- | 
> | JavaScript, Node.js (Express) | &#8226; [Sign in users](how-to-web-app-node-sample-sign-in.md)<br/> &#8226; [Call an API against a customer tenant](how-to-web-app-node-sample-sign-in-call-api.md)  |  &#8226; [Node.js (Express) web app - Sign in](how-to-web-app-node-sign-in-overview.md)<br/> &#8226; [Node.js (Express) web app - Call an API](how-to-web-app-node-sign-in-call-api-overview.md)  |
> | ASP.NET Core | &#8226; [Sign in users](how-to-web-app-dotnet-sample-sign-in.md) <br/> &#8226; *Call an API against a customer tenant*  | &#8226; [ASP.NET Core web app](how-to-web-app-dotnet-sign-in-prepare-tenant.md)   |

### Web API

These samples and how-to guides demonstrate how to protect a web API with the Microsoft identity platform, and how to call a downstream API from the web API.

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample guide | Build and integrate guide  |
> | ------- | -------- | ------------- | 
> | ASP.NET Core | ---  | &#8226; [ASP.NET Core web API](how-to-protect-web-api-dotnet-core-overview.md)   |

### Headless

These samples and how-to guides demonstrate how to write a headless application that integrates with Azure AD for customers.

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample guide | Build and integrate guide  |
> | ------- | -------- | ------------- | 
> | JavaScript, Node | &#8226; *Device code flow, sign in users*<br/> &#8226; *Call an API against a customer tenant*  | &#8226; *Node device code flow*   |
> | .NET | &#8226; *Device code flow, sign in users*<br/> &#8226; *Call an API against a customer tenant*  | &#8226; *.NET device code flow*   |


### Desktop

These samples and how-to guides demonstrate how to write a desktop application that integrates with Azure AD for customers.

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample guide | Build and integrate guide  |
> | ------- | -------- | ------------- | 
> | JavaScript, Electron | &#8226; [Sign in users](how-to-desktop-app-electron-sample-sign-in.md)<br/>&#8226; *Call an API against a customer tenant* | ---   |
> | ASP.NET (MAUI) | &#8226; *Sign in users*<br/>&#8226; *Call Microsoft Graph using MAUI* | ---   |

### Mobile

These samples and how-to guides demonstrate how to write a public client mobile application that integrates with Azure AD for customers.

> [!div class="mx-tdCol2BreakAll"]
> | Language/<br/>Platform | Code sample guide | Build and integrate guide |
> | ----------- | ----------- |----------- |
> | ASP.NET Core MAUI | &#8226; *Sign in users*<br/>&#8226; *Call Microsoft Graph using MAUI* |  ---  |

# [**By language/platform**](#tab/language)

### .NET

> [!div class="mx-tdCol2BreakAll"]
> | App type | Code sample guide | Build and integrate guide  |
> | ------- | -------- | ------------- | 
> | Headless | &#8226; *Sign in users* <br/> &#8226; *Call an API against a customer tenant*  | &#8226; .*NET device code flow*   |


### ASP.NET Core

> [!div class="mx-tdCol2BreakAll"]
> | App type | Code sample guide | Build and integrate guide  |
> | ------- | -------- | ------------- | 
> | Web API| ---  |  &#8226; [ASP.NET Core web API](how-to-protect-web-api-dotnet-core-overview.md)  |
> | Web app | &#8226; [Sign in users](how-to-web-app-dotnet-sample-sign-in.md) <br/> &#8226; *Call an API against a customer tenant* | [ASP.NET Core web app](how-to-web-app-dotnet-sign-in-prepare-tenant.md)    |

### .NET (MAUI)

> [!div class="mx-tdCol2BreakAll"]
> | App type | Code sample guide | Build and integrate guide  |
> | ------- | -------- | ------------- | 
> | Desktop | &#8226; *Sign in users* <br/>&#8226; *Call Microsoft Graph using MAUI* |  &#8226; *ASP.NET Core MAUI desktop app*  |
> | Mobile | &#8226; *Sign in users*<br/>&#8226; *Call Microsoft Graph using MAUI* |  ---  |


### JavaScript, Vanilla

> [!div class="mx-tdCol2BreakAll"]
> | App type | Code sample guide | Build and integrate guide  |
> | ------- | -------- | ------------- | 
> | *Single-page application* | &#8226; [Sign in users](how-to-single-page-app-vanillajs-sample-sign-in.md) <br/> &#8226; *Call an API against a customer tenant* | &#8226; [Vanilla SPA](how-to-single-page-app-vanillajs-prepare-tenant.md)  |

### JavaScript, Angular

> [!div class="mx-tdCol2BreakAll"]
> | App type | Code sample guide | Build and integrate guide  |
> | ------- | -------- | ------------- | 
> | Single-page application | &#8226; *Sign in users* <br/> &#8226; *Call an API against a customer tenant* | &#8226; *Angular SPA*    |

### JavaScript, React

> [!div class="mx-tdCol2BreakAll"]
> | App type | Code sample guide | Build and integrate guide  |
> | ------- | -------- | ------------- | 
> | Single-page application| &#8226; [Sign in users](how-to-single-page-application-react-sample.md)<br/>&#8226; *Call an API against a customer tenant* | &#8226; [React SPA](how-to-single-page-application-react-prepare-tenant.md)   |

### JavaScript, Node

> [!div class="mx-tdCol2BreakAll"]
> | App type | Code sample guide | Build and integrate guide  |
> | ------- | -------- | ------------- | 
> | Headless | &#8226; *Device code flow, sign in users* <br/> &#8226; *Call an API against a customer tenant*  |  &#8226; *Node device code flow*  |

### JavaScript, Node.js (Express)

> [!div class="mx-tdCol2BreakAll"]
> | App type | Code sample guide | Build and integrate guide  |
> | ------- | -------- | ------------- | 
> | Web app |&#8226; [Sign in users](how-to-web-app-node-sample-sign-in.md)<br/> &#8226; [Call an API against a customer tenant](how-to-web-app-node-sample-sign-in-call-api.md)  | &#8226; [Node.js (Express) web app - Sign in](how-to-web-app-node-sign-in-overview.md)<br/> &#8226; [Node.js (Express) web app - Call an API](how-to-web-app-node-sign-in-call-api-overview.md)   |

### JavaScript, Electron

> [!div class="mx-tdCol2BreakAll"]
> | App type | Code sample guide | Build and integrate guide  |
> | ------- | -------- | ------------- | 
> | Desktop | &#8226; [Sign in users](how-to-desktop-app-electron-sample-sign-in.md) <br/>&#8226; *Call an API against a customer tenant*|  ---  |

---
