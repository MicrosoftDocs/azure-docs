---
title: Secure web API endpoints using Microsoft Entra
description: Learn how to secure endpoints of a web API registered in customer's tenant using Microoft Entra
services: active-directory
author: SHERMANOUKO
manager: mwongerapk

ms.author: shermanouko
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 04/17/2023
ms.custom: developer

#Customer intent: As a dev, I want to secure endpoints of my web API registered in the customer's tenant using Microsoft Entra.
---

# Secure web API endpoints

Controllers handle requests that come in through the API endpoints. Controllers are made of Action methods. To protect our resources, we protect the API endpoints by adding security features to our controllers. Create a folder called *Controllers* in the project root folder. Navigate into this folder and create a file called *TodoItemsController.cs*.

## Prerequisites

[Configure your web API](how-to-protect-web-api-dotnet-core-prepare-api.md) before going through this article.

## Add the code

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

[Authorize]
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

## Explanation for the code snippets

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

## Next steps

> [!div class="nextstepaction"]
> [Test your protected web API >](how-to-protect-web-api-dotnet-core-test-api.md)
