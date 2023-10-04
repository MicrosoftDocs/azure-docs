---
title: Implement role-based access control in applications
description: Learn how to implement role-based access control in your applications.
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity 
ms.date: 01/06/2023
ms.author: davidmu
ms.reviewer: johngarland, mamarxen, ianbe
#Customer intent: As an application developer, I want to learn how to implement role-based access control in my applications so I can make sure that only those users with the right access privileges can access the functionality of them.
---

# Implement role-based access control

Role-based access control (RBAC) allows users or groups to have specific permissions to access and manage resources. Typically, implementing RBAC to protect a resource includes protecting either a web application, a single-page application (SPA), or an API. This protection could be for the entire application or API, specific areas and features, or API methods. For more information about the basics of authorization, see [Authorization basics](./authorization-basics.md).

As discussed in [Role-based access control for application developers](./custom-rbac-for-developers.md), there are three ways to implement RBAC using the Microsoft identity platform:

- **App Roles** – using the [App Roles feature in an application](./howto-add-app-roles-in-apps.md#declare-roles-for-an-application) using logic within the application to interpret incoming app role assignments.
- **Groups** – using group assignments of an incoming identity using logic within the application to interpret the group assignments.
- **Custom Data Store** – retrieve and interpret role assignments using logic within the application.

The preferred approach is to use *App Roles* as it is the easiest to implement. This approach is supported directly by the SDKs that are used in building apps utilizing the Microsoft identity platform. For more information on how to choose an approach, see [Choose an approach](./custom-rbac-for-developers.md#choose-an-approach).

## Define app roles

The first step for implementing RBAC for an application is to define the app roles for it and assign users or groups to it. This process is outlined in [How to: Add app roles to your application and receive them in the token](./howto-add-app-roles-in-apps.md). After defining the app roles and assigning users or groups to them, access the role assignments in the tokens coming into the application and act on them accordingly.

## Implement RBAC in ASP.NET Core

ASP.NET Core supports adding RBAC to an ASP.NET Core web application or web API. Adding RBAC allows for easy implementation by using [role checks](/aspnet/core/security/authorization/roles?view=aspnetcore-5.0&preserve-view=true#adding-role-checks) with the ASP.NET Core *Authorize* attribute. It's also possible to use ASP.NET Core’s support for [policy-based role checks](/aspnet/core/security/authorization/roles?view=aspnetcore-5.0&preserve-view=true#policy-based-role-checks).

### ASP.NET Core MVC web application

Implementing RBAC in an ASP.NET Core MVC web application is straightforward. It mainly involves using the *Authorize* attribute to specify which roles should be allowed to access specific controllers or actions in the controllers. Follow these steps to implement RBAC in an ASP.NET Core MVC application:

1. Create an application registration with app roles and assignments as outlined in *Define app roles* above.
1. Do one of the following steps:

    - Create a new ASP.NET Core MVC web application project using the **dotnet cli**. Specify the `--auth` flag with either `SingleOrg` for single tenant authentication or `MultiOrg` for multi-tenant authentication, the `--client-id` flag with the client if from the application registration, and the `--tenant-id` flag with the tenant if from the Microsoft Entra tenant:

        ```bash
        dotnet new mvc --auth SingleOrg --client-id <YOUR-APPLICATION-CLIENT-ID> --tenant-id <TENANT-ID>  
        ```

    - Add the Microsoft.Identity.Web and Microsoft.Identity.Web.UI libraries to an existing ASP.NET Core MVC project:

        ```bash
        dotnet add package Microsoft.Identity.Web 
        dotnet add package Microsoft.Identity.Web.UI 
        ```

1. Follow the instructions specified in [Quickstart: Add sign-in with Microsoft to an ASP.NET Core web app](./quickstart-v2-aspnet-core-webapp.md?view=aspnetcore-5.0&preserve-view=true) to add authentication to the application.
1. Add role checks on the controller actions as outlined in [Adding role checks](/aspnet/core/security/authorization/roles?view=aspnetcore-5.0&preserve-view=true#adding-role-checks).
1. Test the application by trying to access one of the protected MVC routes.

### ASP.NET Core web API

Implementing RBAC in an ASP.NET Core web API mainly involves utilizing the *Authorize* attribute to specify which roles should be allowed to access specific controllers or actions in the controllers. Follow these steps to implement RBAC in the ASP.NET Core web API:

1. Create an application registration with app roles and assignments as outlined in *Define app roles* above.
1. Do one of the following steps:
  
    - Create a new ASP.NET Core MVC web API project using the **dotnet cli**.  Specify the `--auth` flag with either `SingleOrg` for single tenant authentication or `MultiOrg` for multi-tenant authentication, the `--client-id` flag with the client if from the application registration, and the `--tenant-id` flag with the tenant if from the Microsoft Entra tenant:
  
        ```bash
        dotnet new webapi --auth SingleOrg --client-id <YOUR-APPLICATION-CLIENT-ID> --tenant-id <TENANT-ID> 
        ```

    - Add the Microsoft.Identity.Web and Swashbuckle.AspNetCore libraries to an existing ASP.NET Core web API project:

        ```bash
        dotnet add package Microsoft.Identity.Web
        dotnet add package Swashbuckle.AspNetCore 
        ```

1. Follow the instructions specified in [Quickstart: Add sign-in with Microsoft to an ASP.NET Core web app](./quickstart-v2-aspnet-core-webapp.md?view=aspnetcore-5.0&preserve-view=true) to add authentication to the application.
1. Add role checks on the controller actions as outlined in [Adding role checks](/aspnet/core/security/authorization/roles?view=aspnetcore-5.0&preserve-view=true#adding-role-checks).
1. Call the API from a client application. See [Angular single-page application calling .NET Core web API and using App Roles to implement Role-Based Access Control](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/tree/main/5-AccessControl/1-call-api-roles) for an end to end sample.

## Implement RBAC in other platforms

### Angular SPA using MsalGuard

Implementing RBAC in an Angular SPA involves the use of the [Microsoft Authentication Library for Angular](https://www.npmjs.com/package/@azure/msal-angular) to authorize access to the Angular routes contained within the application. An example is shown in the [Enable your Angular single-page application to sign-in users and call APIs with the Microsoft identity platform](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial#chapter-5-control-access-to-your-protected-api-using-app-roles-and-security-groups) sample.

> [!NOTE]
> Client-side RBAC implementations should be paired with server-side RBAC to prevent unauthorized applications from accessing sensitive resources.

### Node.js with Express application

Implementing RBAC in a Node.js with express application involves the use of MSAL to authorize access to the Express routes contained within the application.  An example is shown in the [Enable your Node.js web app to sign-in users and call APIs with the Microsoft identity platform](https://github.com/Azure-Samples/ms-identity-javascript-nodejs-tutorial#chapter-4-control-access-to-your-app-using-app-roles-and-security-groups) sample.

## Next steps

- Read more on [permissions and consent in the Microsoft identity platform](./permissions-consent-overview.md).
- Read more on [role-based access control for application developers](./custom-rbac-for-developers.md).
