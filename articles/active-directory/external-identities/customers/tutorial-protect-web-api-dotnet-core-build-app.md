---
title: "Tutorial: Secure an ASP.NET web API registered in a customer tenant"
description: Learn how to secure a ASP.NET web API registered in the Microsoft Entra External ID for customer's tenant
services: active-directory
author: SHERMANOUKO
manager: mwongerapk

ms.author: shermanouko
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: tutorial
ms.date: 07/27/2023
ms.custom: developer, devx-track-dotnet
#Customer intent: As a dev, I want to secure my ASP.NET Core web API registered in the Microsoft Entra ID for customers tenant.
---

# Tutorial: Secure an ASP.NET web API registered in a customer tenant

Web APIs may contain information that requires user authentication and authorization. Applications can use delegated access, acting on behalf of a signed-in user, or app-only access, acting only as the application's own identity when calling protected web APIs.

In this tutorial, we build a web API that publishes both delegated permissions (scopes) and application permissions (app roles). Client apps such as web apps that acquire tokens on behalf of a signed-in user use the delegated permissions. Client apps such as daemon apps that acquire tokens for themselves use the application permissions. 

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> Configure your web API tp use it's app registration details
> Configure your web API to use delegated and application permissions registered in the app registration
> Protect your web API endpoints

## Prerequisites

- An API registration that exposes at least one scope (delegated permissions) and one app role (application permission) such as *ToDoList.Read*. If you haven't already, [register an API in the Microsoft Entra admin center](how-to-register-ciam-app.md?tabs=webapi&preserve-view=true) by following the registration steps. Ensure you have the following:
    - Application (client) ID of the Web API
    - Directory (tenant) ID of the Web API is registered
    - Directory (tenant) subdomain of where the Web API is registered. For example, if your [primary domain](how-to-create-customer-tenant-portal.md#get-the-customer-tenant-details) is *contoso.onmicrosoft.com*, your Directory (tenant) subdomain is *contoso*.
    - *ToDoList.Read* and *ToDoList.ReadWrite* as the [delegated permissions (scopes) exposed by the Web API](./how-to-register-ciam-app.md?tabs=webapi&preserve-view=true#expose-permissions). 
    - *ToDoList.Read.All* and *ToDoList.ReadWrite.All* as the [application permissions (app roles) exposed by the Web API](how-to-register-ciam-app.md?tabs=webapi&preserve-view=true#add-app-roles).

- [.NET 7.0](https://dotnet.microsoft.com/download/dotnet/7.0) or later. 
- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor.

## Create an ASP.NET Core web API

1. Open your terminal, then navigate to the folder where you want your project to live.
1. Run the following commands:

   ```dotnetcli
   dotnet new webapi -o ToDoListAPI
   cd ToDoListAPI
   ```

1. When a dialog box asks if you want to add required assets to the project, select **Yes**.

## Install packages

Install the following packages:

- `Microsoft.EntityFrameworkCore.InMemory` that allows Entity Framework Core to be used with an in-memory database. It's not designed for production use.
- `Microsoft.Identity.Web` simplifies adding authentication and authorization support to web apps and web APIs integrating with the Microsoft identity platform.

```dotnetcli
dotnet add package Microsoft.EntityFrameworkCore.InMemory
dotnet add package Microsoft.Identity.Web
```

## Configure app registration details

Open the *appsettings.json* file in your app folder and add in the app registration details you recorded after registering your web API.

```json
{
    "AzureAd": {
        "Instance": "https://Enter_the_Tenant_Subdomain_Here.ciamlogin.com/",
        "TenantId": "Enter_the_Tenant_Id_Here",
        "ClientId": "Enter_the_Application_Id_Here",
    },
    "Logging": {...},
  "AllowedHosts": "*"
}
```

Replace the following placeholders as shown:

- Replace `Enter_the_Application_Id_Here` with your application (client) ID.
- Replace `Enter_the_Tenant_Id_Here` with your Directory (tenant) ID.
- Replace `Enter_the_Tenant_Subdomain_Here` with your Directory (tenant) subdomain.

## Add app role and scope

All APIs must publish a minimum of one scope, also called delegated permission, for the client apps to obtain an access token for a user successfully. APIs should also publish a minimum of one app role for applications, also called application permission, for the client apps to obtain an access token as themselves, that is, when they aren't signing-in a user.

We specify these permissions in the *appsettings.json* file. In this tutorial, we have registered four permissions. *ToDoList.ReadWrite* and *ToDoList.Read* as the delegated permissions, and *ToDoList.ReadWrite.All* and *ToDoList.Read.All* as the application permissions.

```json
{
  "AzureAd": {
    "Instance": "https://Enter_the_Tenant_Subdomain_Here.ciamlogin.com/",
    "TenantId": "Enter_the_Tenant_Id_Here",
    "ClientId": "Enter_the_Application_Id_Here",
    "Scopes": {
      "Read": ["ToDoList.Read", "ToDoList.ReadWrite"],
      "Write": ["ToDoList.ReadWrite"]
    },
    "AppPermissions": {
      "Read": ["ToDoList.Read.All", "ToDoList.ReadWrite.All"],
      "Write": ["ToDoList.ReadWrite.All"]
    }
  },
  "Logging": {...},
  "AllowedHosts": "*"
}
```

## Add authentication scheme

An authentication scheme is named when the authentication service is configured during authentication. In this article, we use the JWT bearer authentication scheme. Add the following code in the *Programs.cs* file to add an authentication scheme.

```csharp
// Add the following to your imports
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;

// Add authentication scheme
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration);
```

## Create your models

Create a folder called *Models* in the root folder of your project. Navigate to the folder and create a file called *ToDo.cs* then add the following code. This code creates a model called *ToDo*.

```csharp
using System;

namespace ToDoListAPI.Models;

public class ToDo
{
    public int Id { get; set; }
    public Guid Owner { get; set; }
    public string Description { get; set; } = string.Empty;
}
```

##  Add a database context

The database context is the main class that coordinates Entity Framework functionality for a data model. This class is created by deriving from the *Microsoft.EntityFrameworkCore.DbContext* class. In this tutorial, we use an in-memory database for testing purposes.

1. Create a folder called *DbContext* in the root folder of the project. 
1. Navigate into that folder and create a file called *ToDoContext.cs* then add the following contents to that file:

    ```csharp
    using Microsoft.EntityFrameworkCore;
    using ToDoListAPI.Models;
    
    namespace ToDoListAPI.Context;
    
    public class ToDoContext : DbContext
    {
        public ToDoContext(DbContextOptions<ToDoContext> options) : base(options)
        {
        }
    
        public DbSet<ToDo> ToDos { get; set; }
    }
    ```

1. Open the *Program.cs* file in the root folder of your app, then add the following code in the file. This code registers a `DbContext` subclass called `ToDoContext` as a scoped service in the ASP.NET Core application service provider (also known as, the dependency injection container). The context is configured to use the in-memory database.

    ```csharp
    // Add the following to your imports
    using ToDoListAPI.Context;
    using Microsoft.EntityFrameworkCore;
    
    builder.Services.AddDbContext<ToDoContext>(opt =>
        opt.UseInMemoryDatabase("ToDos"));
    ```

## Add controllers

In most cases, a controller would have more than one action. Typically *Create*, *Read*, *Update*, and *Delete* (CRUD) actions. In this tutorial, we create only two action items. A read all action item and a create action item to demonstrate how to protect your endpoints. 

1. Navigate to the *Controllers* folder in the root folder of your project. 
1. Create a file called *ToDoListController.cs* inside this folder. Open the file then add the following boiler plate code:

    ```csharp
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Identity.Web;
    using Microsoft.Identity.Web.Resource;
    using ToDoListAPI.Models;
    using ToDoListAPI.Context;
    
    namespace ToDoListAPI.Controllers;
    
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ToDoListController : ControllerBase
    {
        private readonly ToDoContext _toDoContext;
    
        public ToDoListController(ToDoContext toDoContext)
        {
            _toDoContext = toDoContext;
        }
    
        [HttpGet()]
        [RequiredScopeOrAppPermission()]
        public async Task<IActionResult> GetAsync(){...}
        
        [HttpPost]
        [RequiredScopeOrAppPermission()]
        public async Task<IActionResult> PostAsync([FromBody] ToDo toDo){...}
    
        private bool RequestCanAccessToDo(Guid userId){...}
    
        private Guid GetUserId(){...}
    
        private bool IsAppMakingRequest(){...}
    }
    ```

## Add code to the controller 

In this section, we add code to the placeholders we created. The focus here isn't on building the API, but rather protecting it.

1. Import the necessary packages. The *Microsoft.Identity.Web* package is an MSAL wrapper that helps us easily handle authentication logic, for example, by handling token validation. To ensure that our endpoints require authorization, we use the inbuilt *Microsoft.AspNetCore.Authorization* package.

1. Since we granted permissions for this API to be called either using delegated permissions on behalf of the user or application permissions where the client calls as itself and not on the user's behalf, it's important to know whether the call is being made by the app on its own behalf. The easiest way to do this is the claims to find whether the access token contains the `idtyp` optional claim. This `idtyp` claim is the easiest way for the API to determine whether a token is an app token or an app + user token. We recommend enabling the `idtyp` optional claim.

    If the `idtyp` claim isn't enabled, you can use the `roles` and `scp` claims to determine whether the access token is an app token or an app + user token. An access token issued by Microsoft Entra External ID has at least one of the two claims. Access tokens issued to a user have the `scp` claim. Access tokens issued to an application have the `roles` claim. Access tokens that contain both claims are issued only to users, where the `scp` claim designates the delegated permissions, while the `roles` claim designates the user's role. Access tokens that have neither aren't to be honored.

    ```csharp
    private bool IsAppMakingRequest()
    {
        if (HttpContext.User.Claims.Any(c => c.Type == "idtyp"))
        {
            return HttpContext.User.Claims.Any(c => c.Type == "idtyp" && c.Value == "app");
        }
        else
        {
            return HttpContext.User.Claims.Any(c => c.Type == "roles") && !HttpContext.User.Claims.Any(c => c.Type == "scp");
        }
    }
    ```

1. Add a helper function that determines whether the request being made contains enough permissions to carry out the intended action. Check whether it's the app making the request on its own behalf or whether the app is making the call on behalf of a user who owns the given resource by validating the user ID.

    ```csharp
    private bool RequestCanAccessToDo(Guid userId)
        {
            return IsAppMakingRequest() || (userId == GetUserId());
        }

    private Guid GetUserId()
        {
            Guid userId;
            if (!Guid.TryParse(HttpContext.User.GetObjectId(), out userId))
            {
                throw new Exception("User ID is not valid.");
            }
            return userId;
        }
    ```

1. Plug in your permission definitions to protect routes. Protect your API by adding the `[Authorize]` attribute to the controller class. This ensures the controller actions can be called only if the API is called with an authorized identity. The permission definitions define what kinds of permissions are needed to perform these actions.

    ```csharp
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ToDoListController: ControllerBase{...}
    ```

    Add permissions to the GET all endpoint and the POST endpoint. Do this using the *RequiredScopeOrAppPermission* method that is part of the *Microsoft.Identity.Web.Resource* namespace. You then pass scopes and permissions to this method via the *RequiredScopesConfigurationKey* and *RequiredAppPermissionsConfigurationKey* attributes.

    ```csharp
    [HttpGet]
    [RequiredScopeOrAppPermission(
        RequiredScopesConfigurationKey = "AzureAD:Scopes:Read",
        RequiredAppPermissionsConfigurationKey = "AzureAD:AppPermissions:Read"
    )]
    public async Task<IActionResult> GetAsync()
    {
        var toDos = await _toDoContext.ToDos!
            .Where(td => RequestCanAccessToDo(td.Owner))
            .ToListAsync();

        return Ok(toDos);
    }

    [HttpPost]
    [RequiredScopeOrAppPermission(
        RequiredScopesConfigurationKey = "AzureAD:Scopes:Write",
        RequiredAppPermissionsConfigurationKey = "AzureAD:AppPermissions:Write"
    )]
    public async Task<IActionResult> PostAsync([FromBody] ToDo toDo)
    {
        // Only let applications with global to-do access set the user ID or to-do's
        var ownerIdOfTodo = IsAppMakingRequest() ? toDo.Owner : GetUserId();

        var newToDo = new ToDo()
        {
            Owner = ownerIdOfTodo,
            Description = toDo.Description
        };

        await _toDoContext.ToDos!.AddAsync(newToDo);
        await _toDoContext.SaveChangesAsync();

        return Created($"/todo/{newToDo!.Id}", newToDo);
    }
    ```

## Run your API

Run your API to ensure that it's running well without any errors using the command `dotnet run`. If you intend to use https protocol even during testing, you need to [trust .NET's development certificate](/aspnet/core/tutorials/first-web-api#test-the-project). 

For a full example of this API code, see the [samples file](https://github.com/Azure-Samples/ms-identity-ciam-dotnet-tutorial/tree/main/2-Authorization/3-call-own-api-dotnet-core-daemon/ToDoListAPI).

## Next steps

> [!div class="nextstepaction"]
> [Test your protected web API >](./tutorial-protect-web-api-dotnet-core-test-api.md)
