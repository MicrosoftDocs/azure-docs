---
title: Secure a web API using Microsoft Entra
description: Learn how to secure a web API registered in customer's tenant using Microoft Entra
services: active-directory
author: SHERMANOUKO
manager: mwongerapk

ms.author: shermanouko
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 04/14/2023
ms.custom: developer

#Customer intent: As a dev, I want to secure my web API registered in the customer's tenant using Microsoft Entra.
---

# Secure a web API registered in the CIAM tenant

Web APIs may contain sensitive information that requires user authentication and authorization. Microsoft identity platform provides capabilities for you to protect your web API against unauthorized access. In this article, we look at how you can protect your web API using these capabilities provided by the Microsoft identity platform.

## Prerequisites

- An API registration. If you haven't already, register an API in the Entra admin center by following the registration steps.
- Beginner level understanding of [MSAL](/azure/active-directory/develop/msal-overview) and related [authentication scenarios](/azure/active-directory/develop/authentication-flows-app-scenarios).
- Beginner level knowledge of C# programming and ASP.NET web API development.

## Create a .NET web API project

In this how to guide, we use Visual Studio Code to create our API. If you're using Visual Studio to create the API, see the [create a Create a web API with ASP.NET core](/aspnet/core/tutorials/first-web-api). The article also uses .NET core 7.0.

1. Open the [integrated terminal](https://code.visualstudio.com/docs/editor/integrated-terminal).
1. Change directories (`cd`) to the folder that contains the project folder.
1. Run the following commands:

   ```dotnetcli
   dotnet new webapi -o TodoApi
   cd TodoApi
   ```

1. When a dialog box asks if you want to add required assets to the project, select **Yes**.

## Add packages

Install the following packages:

- *Microsoft.EntityFrameworkCore.InMemory* that allows Entity Framework Core to be used with an in-memory database. It's not designed for production use.
- *Microsoft.Identity.Web* that simplifies adding authentication and authorization support to web apps and web APIs integrating with the Microsoft identity platform.

  ```dotnetcli
  dotnet add package Microsoft.EntityFrameworkCore.InMemory
  dotnet add package Microsoft.Identity.Web
  ```

## Configure app registration details

To protect your web API, you need to have the apps registration details. These details can be obtained from the Microsoft Entra admin center on the app registration section. You require the Application (Client) ID, Directory / Tenant ID and the secret value that you generated during registration. If you haven't registered your web API yet, kindly follow the [web API registration instructions]() before proceeding.

Open the *appsettings.json* file in your app folder and add in the app registration details.

```json
{
    "AzureAd": {
        "Instance": "https://login.microsoftonline.com/",
        "ClientId": "your-client-id",
        "TenantId": "your tenant id"
    },
    "Logging": {...},
  "AllowedHosts": "*"
}
```

## Add app role and scope

All APIs must publish a minimum of one scope, also called [Delegated Permission](/azure/active-directory/develop/permissions-consent-overview#types-of-permissions), for the client apps to obtain an access token for a user successfully. In a similar sense, APIs should also publish a minimum of one app role for applications, also called [Application Permission](/azure/active-directory/develop/permissions-consent-overview#types-of-permissions), for the client apps to obtain an access token as themselves, that is, when they aren't signing-in a user.

We register these permissions in the *appsettings.json* file. These permissions are configured via the Microsoft Entra admin center. For the purposes of this tutorial, we have configured three permissions. *ToDoList.ReadWrite* and *ToDoList.Read* as the delegated permissions and *ToDoList.ReadWrite.All* as the application permission.

```json
{
  "AzureAd": {...},
  "RequiredTodoAccessPermissions": {
    "RequiredDelegatedTodoReadClaims": "ToDoList.Read", //Add your permissions here and label the keys as you wish
    "RequiredDelegatedTodoWriteClaims": "ToDoList.ReadWrite",
    "RequiredApplicationTodoReadWriteClaims": "ToDoList.ReadWrite.All"
  },
  "Logging": {...},
  "AllowedHosts": "*"
}
```

We then set these keys as constants to make them accessible to the `RequiredScopeOrAppPermission` attribute. Create a folder called *Options* in the project root directory. Navigate to this directory and add a new file called *RequiredToDoAccessPermissionsOptions.cs* with the following content.

```csharp
namespace TodoApi.Options;

public class RequiredTodoAccessPermissionsOptions
{
    public const string RequiredTodoAccessPermissions = "RequiredTodoAccessPermissions";

    // Set these keys as constants to make them accessible to the 'RequiredScopeOrAppPermission' attribute. You can add
    // multiple spaces separated entries for each string in the 'appsettings.json' file and they will be used by the
    // 'RequiredScopeOrAppPermission' attribute.
    public const string RequiredDelegatedTodoReadClaimsKey =
        $"{RequiredTodoAccessPermissions}:RequiredDelegatedTodoReadClaims";

    public const string RequiredDelegatedTodoWriteClaimsKey =
        $"{RequiredTodoAccessPermissions}:RequiredDelegatedTodoWriteClaims";

    public const string RequiredApplicationTodoReadWriteClaimsKey =
        $"{RequiredTodoAccessPermissions}:RequiredApplicationTodoReadWriteClaims";
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

Create a folder called *Models* in the root folder of your project. Navigate to the folder and create a file called *TodoItem.cs* and add the following code. This code creates a model called *TodoItem*.

```csharp
namespace TodoApi.Models;

public class TodoItem
{
    public int ID { get; set; }
    public Guid UserId { get; set; }
    public string Message { get; set; } = string.Empty;
}
```

##  Add a database context

The database context is the main class that coordinates Entity Framework functionality for a data model. This class is created by deriving from the [*Microsoft.EntityFrameworkCore.DbContext*](/dotnet/api/microsoft.entityframeworkcore.dbcontext) class. In this article, we use an in-memory database for testing purposes.

Create a folder called *DbContext* in the root folder of the project. Navigate into that folder and create a file called *TodoContext.cs*. Add the following contents to that file:

```csharp
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi;

public class TodoContext : DbContext
{
    public TodoContext(DbContextOptions<TodoContext> options)
        : base(options)
    {
    }

    public DbSet<TodoItem> TodoItems { get; set; } = null!;
}
```

Add the following code in the *Program.cs* file.

```csharp
// Add the following to your imports
using TodoApi;
using Microsoft.EntityFrameworkCore;

builder.Services.AddDbContext<TodoContext>(opt =>
    opt.UseInMemoryDatabase("TodoItems"));
```

## Secure your endpoints

Controllers handle requests that come in through the API endpoints. Controllers are made of Action methods. To protect our resources, we protect the API endpoints by adding security features to our controllers. Create a folder called *Controllers* in the project root folder. Navigate into this folder and create a file called *TodoItemsController.cs*.

### Add the code

We begin adding controller actions to our controller. In most cases, the controller would have more than one action. Typically Create, Read, Update, and Delete (CRUD) actions. For more information, see [create a .NET web API doc](/aspnet/core/tutorials/first-web-api?view=aspnetcore-7.0&tabs=visual-studio-code#scaffold-a-controller). For the purposes of this article, we demonstrate using two action items, a read all action item and a create action item, how to protect your endpoints. For a full example, see the [samples file](https://github.com/Azure-Samples/ms-identity-ciam-dotnet-tutorial/blob/ApiAspNetCoreApiToDoSample/2-Authorization/1-call-own-api-aspnet-core-mvc/ToDoListApi/Controllers/ToDoController.cs).

Our boiler plate code for the controller looks as follows:

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;
using Microsoft.Identity.Web.Resource;
using TodoApi.Models;
using TodoApi.Options;

namespace TodoApi.Controllers;


[Route("api/[controller]")]
public class TodoItemsController : ControllerBase
{
    private readonly TodoContext _todoContext;

    public TodoItemsController(TodoContext todoContext)
    {
        _todoContext = todoContext;
    }

    [HttpGet()]
    [RequiredScopeOrAppPermission()]
    public async Task<IActionResult> GetAsync(){...}
    
    [HttpPost]
    [RequiredScopeOrAppPermission()]
    public async Task<IActionResult> PostAsync([FromBody] TodoItem todo){...}

    private bool RequestCanAccessToDo(Guid userId){...}

    private Guid GetUserId(){...}

    private bool IsAppMakingRequest(){...}
}
```

### Explanation for the code snippets

In this section, we go through the code to see we protect our API by adding code into the placeholders we created. The focus here isn't on building the API, but rather protecting it.

1. Import the necessary packages. The [*Microsoft.Identity.Web*](/azure/active-directory/develop/microsoft-identity-web) package is an MSAL wrapper that helps us easily handle authentication logic, for example, by handling token validation. We also use the permissions definitions that we created in the *options* folder by importing *Todo.Options*. To ensure that our endpoints require authorization, we use the inbuilt [*Microsoft.AspNetCore.Authorization*](/dotnet/api/microsoft.aspnetcore.authorization) package.

1. Since we granted permissions for this API to be called either using delegated permissions on behalf of the user or application permissions where the client calls as itself and not on the user's behalf, it's important to know whether the call is being made by the app on its own behalf. To do this, we check the claims to find whether the access token contains the *idtyp* optional claim. This claim is the most accurate way for the API to determine whether a token is an app token or an app + user token. Configure your API to use this [optional claim](/azure/active-directory/develop/active-directory-optional-claims) via your API app registration if you haven't.

    ```csharp
    private bool IsAppMakingRequest()
        {
            // Add in the optional 'idtyp' claim to check if the access token is coming from an application or user.
            //
            // See: https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-optional-claims
            return HttpContext.User
                .Claims.Any(c => c.Type == "idtyp" && c.Value == "app");
        }
    ```

1. Add a helper function that determines whether the request being made contains enough permissions to carry out the intended action. To do this, we check whether it's the app making the request on its own behalf or whether the app is making the call on behalf of a user who owns the given resource by validating the user ID.

    ```csharp
    private bool RequestCanAccessToDo(Guid userId)
        {
            return IsAppMakingRequest() || (userId == GetUserId());
        }
    ```

1. Plug in our permission definitions to protect our routes. We protect our API by adding the `[Authorize]` attribute to the controller class. This ensures the controller actions can be called only if the API is called with an authorized identity. The permission definitions will then help define what kinds of permissions are needed to perform these actions.

    ```csharp
    [Authorize]
    [Route("api/[controller]")]
    public class TodoItemsController : ControllerBase{...}
    ```

    Here, we add permissions to the GET all endpoint and the POST endpoint. We do this by using the [*RequiredScopeOrAppPermission*](/dotnet/api/microsoft.identity.web.resource.requiredscopeorapppermissionattribute) method that is part of the *Microsoft.Identity.Web.Resource* namespace. We then pass our scopes and permissions to this method via the *RequiredScopesConfigurationKey* and *RequiredAppPermissionsConfigurationKey* attributes.

    ```csharp
    [HttpGet()]
    [RequiredScopeOrAppPermission(
        RequiredScopesConfigurationKey = RequiredTodoAccessPermissionsOptions.RequiredDelegatedTodoReadClaimsKey,
        RequiredAppPermissionsConfigurationKey = RequiredTodoAccessPermissionsOptions.RequiredApplicationTodoReadWriteClaimsKey)]
    public async Task<IActionResult> GetAsync()
    {
        var todos = await _todoContext.TodoItems
            .Where(td => RequestCanAccessToDo(td.UserId))
            .ToListAsync();

        return Ok(todos);
    }
    
    [HttpPost]
    [RequiredScopeOrAppPermission(
        RequiredScopesConfigurationKey = RequiredTodoAccessPermissionsOptions.RequiredDelegatedTodoWriteClaimsKey,
        RequiredAppPermissionsConfigurationKey = RequiredTodoAccessPermissionsOptions.RequiredApplicationTodoReadWriteClaimsKey)]
    public async Task<IActionResult> PostAsync([FromBody] TodoItem todo)
    {
        // Only let applications with global to-do access set the user ID or to-do's
        var userIdOfTodo = IsAppMakingRequest() ? todo.UserId : GetUserId();
  
        var newToDo = new TodoItem() {
            UserId = userIdOfTodo,
            Message = todo.Message
        };

        await _todoContext.TodoItems!.AddAsync(newToDo);
        await _todoContext.SaveChangesAsync();   
    
        return Created($"/todo/{newToDo!.ID}", newToDo);
    }
    ```

## Run your API

Run your API to ensure that it's running well without any errors using the command `dotnet run`. If you intend to use https protocol even during testing, you need to [trust .NET's development certificate](/aspnet/core/tutorials/first-web-api#test-the-project).

## Test your API

To test our API, we create a daemon app / script.

### Register the daemon app 

1. Register a new daemon app in your CIAM tenant via the Azure portal.
1. Note down the app's Application (Client) ID and Directory (tenant) ID.
1. Create a [secret](/azure/active-directory/develop/quickstart-register-app#add-a-client-secret) for the app and note it down.

### Preauthorize the daemon app

1. Navigate to the app registration of your protected API in the Azure portal.
1. In the app registration window of your API, select *Expose an API* in the *Manage* section.
1. Under *Authorized client applications*, select *Add a client application*.
1. In the Client ID box, paste the Application ID of the daemon app.
1. In the *Authorized scopes8 section, select the scope that allows you to at least read user data. In our case, we select the `api://<ApplicationID>/ToDoList.ReadWrite` and  `api://<ApplicationID>/ToDoList.Read` scopes.
1. Select *Add application*.

### Write code

1. Initialize a .NET console app and navigate to its root folder

    ```dotnetcli
    dotnet new console -o MyTestApp
    cd MyTestApp
    ```
1. Install MSAL to help you with handling authentication by running the following command
  
    ```dotnetcli
    dotnet add package Microsoft.Identity.Client
    ```
1. Run your API project and note the port on which it's running.
1. Open the *Program.cs* file and replace the "Hello world" code with the following code. This code sends a request without an access token. You should see the string *Your response is: Unauthorized* printed in your console.

    ```csharp
    using System;
    using System.Net.Http;
    using System.Net.Http.Headers;

    HttpClient client = new HttpClient();

    var response = await client.GetAsync("https://localhost:<your-api-port>/api/TodoItems");
    Console.WriteLine("Your response is: " + response.StatusCode);
    ```

1. Remove the code in step 1 and replace with the following to test your API by sending a request with a valid access token. You should see the string *Your response is: OK* printed in your console.


    ```csharp
    using Microsoft.Identity.Client;
    using System;
    using System.Net.Http;
    using System.Net.Http.Headers;

    HttpClient client = new HttpClient();

    var clientId = "<your-daemon-app-client-id>";
    var clientSecret = "<your-daemon-app-secret>";
    var scopes = new[] {"api://<your-web-api-application-id>/.default"};
    var tenantId = "<your-daemon-app-tenant-id>";
    var authority = $"https://login.microsoftonline.com/{tenantId}";

    var app = ConfidentialClientApplicationBuilder
        .Create(clientId)
        .WithAuthority(authority)
        .WithClientSecret(clientSecret)
        .Build();

    var result = await app.AcquireTokenForClient(scopes).ExecuteAsync();

    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result.AccessToken);
    var response = await client.GetAsync("https://localhost:44351/api/TodoItems");
    Console.WriteLine("Your response is: " + response.StatusCode);
    ```
