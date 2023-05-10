---
title: Configure web API for protection using Microsoft Entra
description: Learn how to configure web API settings so as to protect it using Microsoft Entra.
services: active-directory
author: SHERMANOUKO
manager: mwongerapk

ms.author: shermanouko
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/10/2023
ms.custom: developer

#Customer intent: As a dev, I want to configure my web API settings so as to protect it using Microsoft Entra.
---

# Secure an ASP.NET web API by using Microsoft Entra - configure your web API

In this how-to article, we go through the steps you take to configure your web API before securing its endpoints. When using the Microsoft identity platform to secure your web API, you first need to have it registered before configuring your API.

## Prerequisites

Go through the [overview of creating a protected web API](how-to-protect-web-api-dotnet-core-overview.md) before proceeding further with this tutorial.

## Create an ASP.NET Core web API

In this how to guide, we use Visual Studio Code and .NET 7.0. If you're using Visual Studio to create the API, see the [create a Create a web API with ASP.NET Core](/aspnet/core/tutorials/first-web-api).

1. Open the [integrated terminal](https://code.visualstudio.com/docs/editor/integrated-terminal).
1. Navigate to the folder where you want your project to live.
1. Run the following commands:

   ```dotnetcli
   dotnet new webapi -o ToDoListAPI
   cd ToDoListAPI
   ```

1. When a dialog box asks if you want to add required assets to the project, select **Yes**.

## Add packages

Install the following packages:

- `Microsoft.EntityFrameworkCore.InMemory` that allows Entity Framework Core to be used with an in-memory database. It's not designed for production use.
- `Microsoft.Identity.Web` simplifies adding authentication and authorization support to web apps and web APIs integrating with the Microsoft identity platform.

  ```dotnetcli
  dotnet add package Microsoft.EntityFrameworkCore.InMemory
  dotnet add package Microsoft.Identity.Web
  ```

## Configure app registration details

To protect your web API, you need to have the Application (Client) ID, Directory / Tenant ID and Directory / Tenant name that you have obtained during registration on the Microsoft Entra admin center. If you haven't registered your web API yet, kindly follow the [web API registration instructions](how-to-register-ciam-app.md?tabs=webapi&preserve-view=true) before proceeding.

Open the *appsettings.json* file in your app folder and add in the app registration details.

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
- Replace `Enter_the_Tenant_Subdomain_Here` with your Directory (tenant) subdomain. For example, if your primary domain is *contoso.onmicrosoft.com*, replace `Enter_the_Tenant_Subdomain_Here` with *contoso*. 

If you don't have these values, learn how to [read tenant details](how-to-create-customer-tenant-portal.md#get-the-customer-tenant-details)

## Add app role and scope

All APIs must publish a minimum of one scope, also called [Delegated Permission](/azure/active-directory/develop/permissions-consent-overview#types-of-permissions), for the client apps to obtain an access token for a user successfully. In a similar sense, APIs should also publish a minimum of one app role for applications, also called [Application Permission](/azure/active-directory/develop/permissions-consent-overview#types-of-permissions), for the client apps to obtain an access token as themselves, that is, when they aren't signing-in a user.

We specify these permissions in the *appsettings.json* file as configuration parameters. These permissions are registered via the Microsoft Entra admin center. For the purposes of this tutorial, we have registered four permissions. *ToDoList.ReadWrite* and *ToDoList.Read* as the delegated permissions, and *ToDoList.ReadWrite.All* and *ToDoList.Read.All* as the application permissions.

```json
{
  "AzureAd": {...},
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

An [authentication scheme](/aspnet/core/security/authorization/limitingidentitybyscheme) is named when the authentication service is configured during authentication. In this article, we use the JWT bearer authentication scheme.

Add the following code in the *Programs.cs* file to add authentication scheme.

```csharp
// Add the following to your imports
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;

// Add authentication scheme
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration);
```

## Create your models

Create a folder called *Models* in the root folder of your project. Navigate to the folder and create a file called *ToDo.cs* and add the following code. This code creates a model called *ToDo*.

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

The database context is the main class that coordinates Entity Framework functionality for a data model. This class is created by deriving from the [*Microsoft.EntityFrameworkCore.DbContext*](/dotnet/api/microsoft.entityframeworkcore.dbcontext) class. In this article, we use an in-memory database for testing purposes.

Create a folder called *DbContext* in the root folder of the project. Navigate into that folder and create a file called *ToDoContext.cs*. Add the following contents to that file:

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

Add the following code in the *Program.cs* file.

```csharp
// Add the following to your imports
using ToDoListAPI.Context;
using Microsoft.EntityFrameworkCore;

builder.Services.AddDbContext<TodoContext>(opt =>
    opt.UseInMemoryDatabase("ToDos"));
```

## Next steps

> [!div class="nextstepaction"]
> [Protect your web API endpoints >](how-to-protect-web-api-dotnet-core-protect-endpoints.md)
