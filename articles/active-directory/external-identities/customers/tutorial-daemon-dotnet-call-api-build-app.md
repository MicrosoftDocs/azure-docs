---
title: "Tutorial: Call a protected web API from your .NET daemon application"
description: Learn about how to call a protected web API from your .NET client daemon app. 
services: active-directory
author: SHERMANOUKO
manager: mwongerapk

ms.author: shermanouko
ms.service: active-directory
ms.subservice: ciam
ms.custom: devx-track-dotnet
ms.topic: tutorial
ms.date: 07/27/2023
---

# Tutorial: Call a protected web API from your .NET daemon application

In this tutorial, you build your client daemon app and call a protected web API. You enable the client daemon app to acquire an access token using its own identity, then call the web API.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Configure a daemon app to use it's app registration details.
> - Build a daemon app that acquires a token on its own behalf and calls a protected web API.

## Prerequisite 

Before continuing with this tutorial, ensure you have all of the following items in place:

- Registration details for the daemon app and web API you created in the [prepare app tutorial](tutorial-daemon-dotnet-call-api-prepare-tenant.md). You need the following details:

    - The Application (client) ID of the client daemon app that you registered.
    - The Directory (tenant) subdomain where you registered your daemon app.
    - The secret value for the daemon app you created.
    - The Application (client) ID of the web API app you registered.

- A protected *ToDoList* web API that is running and ready to accept requests. If you haven't created one, see the [create a protected web API tutorial](./tutorial-protect-web-api-dotnet-core-build-app.md). Ensure this web API is using the app registration details you created in the [prepare tenant tutorial](tutorial-daemon-dotnet-call-api-prepare-tenant.md).
- The base url and port on which the web API is running. For example, 44351. Ensure the API exposes the following endpoints via https:
    - `GET /api/todolist` to get all todos.
    - `POST /api/todolist` to add a todo.

- [.NET 7.0](https://dotnet.microsoft.com/download/dotnet/7.0) or later. 
- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor.

##  1. Create a .NET daemon app

1. Open your terminal and navigate to the folder where you want your project to live.
1. Initialize a .NET console app and navigate to its root folder.

    ```dotnetcli
    dotnet new console -n ToDoListClient
    cd ToDoListClient
    ```

## 2. Install packages

Install `Microsoft.Identity.Web` and `Microsoft.Identity.Web.DownstreamApi` packages:

```dotnetcli
dotnet add package Microsoft.Identity.Web
dotnet add package Microsoft.Identity.Web.DownstreamApi
```

`Microsoft.Identity.Web` provides the glue between ASP.NET Core, the authentication middleware, and the Microsoft Authentication Library (MSAL) for .NET making it easier for you to add authentication and authorization capabilities to your app. `Microsoft.Identity.Web.DownstreamApi` provides an interface used to call a downstream API.

## 3. Create appsettings.json file an add registration configs

1. Create *appsettings.json* file in the root folder of the app.
1. Add app registration details to the *appsettings.json* file.

    ```json
    {
        "AzureAd": {
            "Authority": "https://<Enter_the_Tenant_Subdomain_Here>.ciamlogin.com/",
            "ClientId": "<Enter_the_Application_Id_here>",
            "ClientCredentials": [
                {
                    "SourceType": "ClientSecret",
                    "ClientSecret": "<Enter_the_Client_Secret_Here>"
                }
            ]
        },
        "DownstreamApi": {
            "BaseUrl": "<Web_API_base_url>",
            "RelativePath": "api/todolist",
            "RequestAppToken": true,
            "Scopes": [
                "api://<Enter_the_Web_Api_Application_Id_Here>/.default"
            ]
        }
    }
    ```

    Replace the following values with your own:

    | Value | Description |
    |--------------------------------------------|----------------------------------------------------------------|
    |*Enter_the_Application_Id_Here*| The Application (client) ID of the client daemon app that you registered.     |
    |*Enter_the_Tenant_Subdomain_Here*| The Directory (tenant) subdomain.                                           |
    |*Enter_the_Client_Secret_Here*| The daemon app secret value you created.                                       |
    |*Enter_the_Web_Api_Application_Id_Here*| The Application (client) ID of the web API app you registered.        |
    |*Web_API_base_url*| The base URL of the web API. For example, `https://localhost:44351/` where 44351 is the port number of the port your API is running on. Your API should already be running and awaiting requests by this stage for you to get this value.|

## 4. Add models

Navigate to the root of your project folder and create a *models* folder. In the *models* folder, create a *ToDo.cs* file and add the following code:

```csharp
using System;

namespace ToDoListClient.Models;

public class ToDo
{
    public int Id { get; set; }
    public Guid Owner { get; set; }
    public string Description { get; set; } = string.Empty;
}
```

## 5. Acquire access token

You have now configured the required items in for your daemon application. In this step, you write the code that enables the daemon app to acquire an access token.

1. Open the *program.cs* file in your code editor and delete its contents.
1. Add your packages to the file.
   
    ```csharp
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Identity.Abstractions;
    using Microsoft.Identity.Web;
    using ToDoListClient.Models;
    ```
1. Create the token acquisition instance. Use the `GetDefaultInstance` method of the `TokenAcquirerFactory` class of `Microsoft.Identity.Web` package to build the token acquisition instance. By default, the instance reads an *appsettings.json* file if it exists in the same folder as the app. `GetDefaultInstance` also allows us to add services to the service collection.

    Add this line of code to the *program.cs* file:

    ```csharp
    var tokenAcquirerFactory = TokenAcquirerFactory.GetDefaultInstance();
    ```

1. Configure the application options to be read from the configuration and add the `DownstreamApi` service. The `DownstreamApi` service provides an interface used to call a downstream API. We call this service *DownstreamAPI* in the config object. The daemon app reads the downstream API configs from the *DownstreamApi* section of *appsettings.json*. By default, you get an in-memory token cache.

    Add the following code snippet to the *program.cs* file:

    ```csharp
    const string ServiceName = "DownstreamApi";
    
    tokenAcquirerFactory.Services.AddDownstreamApi(ServiceName,
        tokenAcquirerFactory.Configuration.GetSection("DownstreamApi"));

1. Build the token acquirer. This composes all the services you have added to Services and returns a service provider. Use this service provider to get access to the API resource you have added. In this case, you added only one API resource as a downstream service that you want access to.

    Add the following code snippet to the *program.cs* file:

    ```csharp
    var serviceProvider = tokenAcquirerFactory.Build();
    ```

## 6. Call the web API

Add code to call your protected web API using the `IDownstreamApi` interface. In this tutorial, you only implement a call to Post a todo and another one to Get all todos. See the other implementations such as Delete and Put in the [sample code](https://github.com/Azure-Samples/ms-identity-ciam-dotnet-tutorial/blob/main/2-Authorization/3-call-own-api-dotnet-core-daemon/ToDoListClient/Program.cs).

Add this line of code to the *program.cs* file:

```csharp
var toDoApiClient = serviceProvider.GetRequiredService<IDownstreamApi>();

Console.WriteLine("Posting a to-do...");

var firstNewToDo = await toDoApiClient.PostForAppAsync<ToDo, ToDo>(
    ServiceName,
    new ToDo()
    {
        Owner = Guid.NewGuid(),
        Description = "Bake bread"
    });

await DisplayToDosFromServer();
    
async Task DisplayToDosFromServer()
{
    Console.WriteLine("Retrieving to-do's from server...");
    var toDos = await toDoApiClient!.GetForAppAsync<IEnumerable<ToDo>>(
        ServiceName,
        options => options.RelativePath = "/api/todolist"
    );
    
    if (!toDos!.Any())
    {
        Console.WriteLine("There are no to-do's in server");
        return;
    }
    
    Console.WriteLine("To-do data:");
    
    foreach (var toDo in toDos!) {
        DisplayToDo(toDo);
    }
}

void DisplayToDo(ToDo toDo) {
    Console.WriteLine($"ID: {toDo.Id}");
    Console.WriteLine($"User ID: {toDo.Owner}");
    Console.WriteLine($"Message: {toDo.Description}");
}
```

## 7. Run the client daemon app

Navigate to the root folder of the daemon app and run the following command:

```dotnetcli
dotnet run
```

If everything is okay, you should see the following output in your terminal.

```bash
Posting a to-do...
Retrieving to-do's from server...
To-do data:
ID: 1
User ID: f4e54f8b-acec-4ef4-90e9-5bb358c8770b
Message: Bake bread
```

### Troubleshoot

In case you run into errors, 

- Confirm the registration details you added to the appsettings.json file. 
- Confirm that you're calling the web API via the correct port and over https. 
- Confirm that your app permissions are configured correctly.

The full sample code is [available on GitHub](https://github.com/Azure-Samples/ms-identity-ciam-dotnet-tutorial/tree/main/2-Authorization/3-call-own-api-dotnet-core-daemon).

## 8. Clean up resources

If you don't intend to use the apps you have registered and created in this tutorial, delete them to avoid incurring any costs.

## See also

- [Call an API in a sample Node.js daemon application](./sample-daemon-node-call-api.md)
