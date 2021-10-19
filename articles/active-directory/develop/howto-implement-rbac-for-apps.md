---
title: Implement role-based access control in apps
titleSuffix: Microsoft identity platform
description: Learn how to implement role-based access control in your applications.
services: active-directory
author: Chrispine-Chiedo
manager: CelesteDG
 
ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity 
ms.date: 09/17/2021
ms.author: cchiedo
ms.reviewer: johngarland, mamarxen, ianbe, marsma

#Customer intent: As an application developer, I want to learn how to implement role-based access control in my apps so I can ensure that only those users with the right access privileges can access my app's functionality.
---

# Implement role-based access control in apps

Role-based access control (RBAC) allows users or groups to have specific permissions regarding which resources they have access to, what they can do with those resources, and who manages which resources.

Typically, when we talk about implementing RBAC to protect a resource, we're looking to protect either a web application, a single-page application (SPA), or an API.  This could be either for the entire application or API, or specific areas, features, or API methods.

This article explains how to implement application-specific role-based access control.  For more information about the basics of authorization, see [Authorization basics](./authorization-basics.md).

## Implementing RBAC using the Microsoft identity platform

As discussed in [Role-based access control for application developers](./custom-rbac-for-developers.md), there are three ways to implement RBAC using the Microsoft identity platform:

- **App Roles** – using the [App Roles feature in an application registration](./howto-add-app-roles-in-azure-ad-apps.md#declare-roles-for-an-application) in conjunction with logic within your application to interpret incoming App Role assignments.
- **Groups** – using an incoming identity’s group assignments in conjunction with logic within your application to interpret the group assignments. 
- **Custom Data Store** – retrieve and interpret role assignments using logic within your application.

The preferred approach is to use *App Roles* as it is the easiest to implement. This approach is supported directly by the SDKs that are used in building apps utilizing the Microsoft identity platform. For more information on how to choose an approach, see [Choosing an approach](./custom-rbac-for-developers.md#choosing-an-approach).

The rest of this article will show you how to define app roles and implement RBAC within your application using the app roles.

## Defining roles for your application

The first step for implementing RBAC for your application is to define the roles your application needs and assign users or groups to those roles.  This process is outlined in [How to: Add app roles to your application and receive them in the token](./howto-add-app-roles-in-azure-ad-apps.md). Once you have defined your roles and assigned users or groups, you can access the role assignments in the tokens coming into your application and act on them accordingly.

## Implementing RBAC in ASP.NET Core 

ASP.NET Core supports adding RBAC to an ASP.NET Core web application or web API.  This allows for easy implementation of RBAC using [role checks](/aspnet/core/security/authorization/roles?view=aspnetcore-5.0&preserve-view=true#adding-role-checks) with the ASP.NET Core *Authorize* attribute. It is also possible to use ASP.NET Core’s support for [policy-based role checks](/aspnet/core/security/authorization/roles?view=aspnetcore-5.0&preserve-view=true#policy-based-role-checks).

### ASP.NET Core MVC web application 

Implementing RBAC in an ASP.NET Core MVC web application is straightforward.  It mainly involves using the *Authorize* attribute to specify which roles should be allowed to access specific controllers or actions in the controllers. Follow these steps to implement RBAC in your ASP.NET Core MVC application:
1. Create an app registration with app roles and assignments as outlined in *Defining roles for your application* above.
1. Do one of the following steps:
    - Create a new ASP.NET Core MVC web app project using the **dotnet cli**.  Specify the *--auth* flag with either *SingleOrg* for single tenant authentication or *MultiOrg* for multi-tenant authentication, the *--client-id* flag with the client if from your app registration, and the *--tenant-id* flag with your tenant if from your Azure AD tenant:
 
      ```bash 
    
      dotnet new mvc --auth SingleOrg --client-id <YOUR-APPLICATION-CLIENT-ID> --tenant-id <YOUR-TENANT-ID>  
    
      ```
      
    - Add the Microsoft.Identity.Web and Microsoft.Identity.Web.UI libraries to an existing ASP.NET Core MVC project:
 
      ```bash 

      dotnet add package Microsoft.Identity.Web 

      dotnet add package Microsoft.Identity.Web.UI 

      ```

   And then follow the instructions specified in [Quickstart: Add sign-in with Microsoft to an ASP.NET Core web app](./quickstart-v2-aspnet-core-webapp.md?view=aspnetcore-5.0&preserve-view=true) to add authentication to your application.
1. Add role checks on your controller actions as outlined in [Adding role checks](/aspnet/core/security/authorization/roles?view=aspnetcore-5.0&preserve-view=true#adding-role-checks).
1. Test the application by trying to access one of the protected MVC routes.

### ASP.NET Core web API

Implementing RBAC in an ASP.NET Core web API mainly involves utilizing the *Authorize* attribute to specify which roles should be allowed to access specific controllers or actions in the controllers. Follow these steps to implement RBAC in your ASP.NET Core web API:
1. Create an app registration with app roles and assignments as outlined in *Defining roles for your application* above.
1. Do one of the following steps:
    - Create a new ASP.NET Core MVC web API project using the **dotnet cli**.  Specify the *--auth* flag with either *SingleOrg* for single tenant authentication or *MultiOrg* for multi-tenant authentication, the *--client-id* flag with the client if from your app registration, and the *--tenant-id* flag with your tenant if from your Azure AD tenant:

      ```bash 
    
      dotnet new webapi --auth SingleOrg --client-id <YOUR-APPLICATION-CLIENT-ID> --tenant-id <YOUR-TENANT-ID> 
    
      ```

    - Add the Microsoft.Identity.Web and Swashbuckle.AspNetCore libraries to an existing ASP.NET Core web API project:
      
      ```bash 

      dotnet add package Microsoft.Identity.Web 

      dotnet add package Swashbuckle.AspNetCore 

      ```
    
   And then follow the instructions specified in [Quickstart: Add sign-in with Microsoft to an ASP.NET Core web app](./quickstart-v2-aspnet-core-webapp.md?view=aspnetcore-5.0&preserve-view=true) to add authentication to your application.
1. Add role checks on your controller actions as outlined in [Adding role checks](/aspnet/core/security/authorization/roles?view=aspnetcore-5.0&preserve-view=true#adding-role-checks).
1. Call the API from a client app.  See [Angular single-page application calling .NET Core web API and using App Roles to implement Role-Based Access Control](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/tree/main/5-AccessControl/1-call-api-roles) for an end to end sample.


## Implementing RBAC in other platforms

### Angular SPA using MsalGuard
Implementing RBAC in an Angular SPA involves the use of [msal-angular](https://www.npmjs.com/package/@azure/msal-angular) to authorize access to the Angular routes contained within the application.  This is shown in the [Enable your Angular single-page application to sign-in users and call APIs with the Microsoft identity platform](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial#chapter-5-control-access-to-your-protected-api-using-app-roles-and-security-groups) sample.

> [!NOTE]
> Client-side RBAC implementations should be paired with server-side RBAC to prevent unauthorized applications from accessing sensitive resources.

### Node.js with Express application
Implementing RBAC in a Node.js with express application involves the use of MSAL to authorize access to the Express routes contained within the application.  This is shown in the [Enable your Node.js web app to sign-in users and call APIs with the Microsoft identity platform](https://github.com/Azure-Samples/ms-identity-javascript-nodejs-tutorial#chapter-4-control-access-to-your-app-using-app-roles-and-security-groups) sample.

## Next steps

- Read more on [permissions and consent in the Microsoft identity platform](./v2-permissions-and-consent.md).
- Read more on [role-based access control for application developers](./custom-rbac-for-developers.md).
