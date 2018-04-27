---
title: Quickstart to learn how to use Azure SignalR Service | Microsoft Docs
description: A quickstart for using Azure SignalR Service to create a chat room with ASP.NET Core MVC apps.
services: signalr
documentationcenter: ''
author: wesmc7777
manager: cfowler
editor: 

ms.assetid: 
ms.service: signalr
ms.devlang: dotnet
ms.topic: quickstart
ms.tgt_pltfrm: ASP.NET
ms.workload: tbd
ms.date: 04/17/2018
ms.author: wesmc
#Customer intent: As an ASP.NET Core developer, I want to push real-time data in my ASP.NET Core apps. So that my clients are updated without the need to poll, or request updates.
---
# Quickstart: Create a chat room with SignalR Service

Azure SignalR Service is an Azure service that helps developers easily build web applications with real-time features. This service is based on [SignalR for ASP.NET Core 2.0](https://docs.microsoft.com/aspnet/core/signalr/introduction).

This article shows you how to get started with the Azure SignalR Service. In this quickstart, you will create a chat application using an ASP.NET Core MVC Web App web app. This app will make a connection with your Azure SignalR Service resource to enable real-time content updates. You will host the web application locally and connect with multiple browser clients. Each client will be able to push content updates to all other clients. 


You can use use any code editor to complete the steps in this quickstart. However, [Visual Studio Code](https://code.visualstudio.com/) is an excellent option avaialble on the Windows, macOS, and Linux platforms.

The code for this tutorial is available for download in the [AzureSignalR-samples GitHub repository](https://github.com/aspnet/AzureSignalR-samples/tree/master/samples/ChatRoom).  Also, the creation of the Azure resources used in this quickstart can be accomplished with the [Create a SignalR Service script](scripts/signalr-cli-create-service.md).

![Quickstart Complete local](media/signalr-quickstart-dotnet-core/signalr-quickstart-complete-local.png)

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]


## Prerequisites

* Install the [.NET Core SDK](https://www.microsoft.com/net/download/windows)
* Download or clone the [AzureSignalR-sample](https://github.com/aspnet/AzureSignalR-samples) github repository. 

## Create an Azure SignalR resource

[!INCLUDE [azure-signalr-create](../../includes/signalr-create.md)]

## Create an ASP.NET Core web app

In this section, you use the [.NET Core command-line interface (CLI)](https://docs.microsoft.com/dotnet/core/tools/) to create a new ASP.NET Core MVC Web App project. The advantage of using the .NET Core CLI over Visual Studio is that it is available across the Windows, macOS, and Linux platforms. 

1. Create a new folder for your project. In this quickstart, the *E:\Testing\chattest* folder is used.

2. In the new folder, execute the following command to create a new ASP.NET Core MVC Web App project:

        dotnet new mvc


## Add Secret Manager to the project

In this section, you will add the [Secret Manager tool](https://docs.microsoft.com/aspnet/core/security/app-secrets) to your project. The Secret Manager tool stores sensitive data for development work outside of your project tree. This helps prevent the accidential sharing of app secrets with source code.

1. Open your *.csproj* file. Add a `DotNetCliToolReference` attribute for *Microsoft.Extensions.SecretManager.Tools* and a `UserSecretsId` attribute as shown below, and save the file.

    *chattest.csproj:*

    ```xml
    <Project Sdk="Microsoft.NET.Sdk.Web">
    <PropertyGroup>
        <TargetFramework>netcoreapp2.0</TargetFramework>
        <UserSecretsId>SignalRChatRoomEx</UserSecretsId>
    </PropertyGroup>
    <ItemGroup>
        <PackageReference Include="Microsoft.AspNetCore.All" Version="2.0.0" />
    </ItemGroup>
    <ItemGroup>
        <DotNetCliToolReference Include="Microsoft.VisualStudio.Web.CodeGeneration.Tools" Version="2.0.0" />
        <DotNetCliToolReference Include="Microsoft.Extensions.SecretManager.Tools" Version="2.0.0" />
    </ItemGroup>
    </Project>    
    ```

## Add Azure SignalR to the web app

1. Add a reference to the `Microsoft.Azure.SignalR` NuGet package by executing the following command:

        dotnet add package Microsoft.Azure.SignalR -v 1.0.0-preview-10007

2. Execute the following command to restore packages for your project.

        dotnet restore

3. Add a secret named *Azure:SignalR:ConnectionString* to Secret Manager. This secret will contain the connection string to access your SignalR Service resource. Replace the value in the command below with the connection string for your SignalR Service resource.

    This command must be executed in the same directory as the *.csproj* file.

    ```
    dotnet user-secrets set Azure:SignalR:ConnectionString Endpoint=<Your endpoint>;AccessKey=<Your access key>;    
    ```

    This will only used for testing the web app while it is hosted locally. In a later tutorial, you will deploy the web app to Azure. Once the web app is deployed to Azure, you will use an application setting in place of the environment variable.

4. Open *Startup.cs* and update the `ConfigureServices` method to use Azure SignalR Service by calling the `services.AddSignalR().AddAzureSignalR()` method:

    ```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddMvc();
        services.AddSignalR().AddAzureSignalR();
    }
    ```

5. Also in *Startup.cs*, update the `Configure` method by replacing the call to `app.UseStaticFiles()` with the following code and save the file.

    ```csharp
    app.UseFileServer();
    app.UseAzureSignalR(routes =>
    {
        routes.MapHub<Chat>("/chat");
    });
    ```            

## Add a hub class

In SignalR, a hub is a core concept that exposes a set of methods that can be called from client. In this section, you define a hub class with two methods: 

* `Broadcast`: This method broadcasts a message to all clients.
* `Echo`: This method sends a message back to the caller.

Both methods use the `Clients` interface provided by the SignalR Core SDK. This interface gives you access to all connected clients enabling you to push content to your clients.

1. In yout project directory, add a new folder named *Hub*. Add a new hub code file named *Chat.cs* to the new folder.

2. Add the following code to *Chat.cs* to define you hub class and save the file. 

    Update the namespace for this class if you used a project name that differs from *chattest*.

    ```csharp
    using Microsoft.AspNetCore.SignalR;

    namespace chattest
    {

        public class Chat : Hub
        {
            public void BroadcastMessage(string name, string message)
            {
                Clients.All.SendAsync("broadcastMessage", name, message);
            }

            public void Echo(string name, string message)
            {
                Clients.Client(Context.ConnectionId).SendAsync("echo", name, message + " (echo from server)");
            }
        }
    }
    ```

## Add an authentication controller

The connection string contains sensitive access data and should only be used by server-side code to connect to the SignalR Service resource. You would not normally want to allow client-side code direct access to the service using the connection string. Code running as a client of the web app should authenticate with the web app in order to authorize access to SignalR functionality. 

Azure SignalR Service gives you the flexibility to implement your own authentication. In this article, you aren't going to include real authentication. Instead you will simply issue the token when requested. You will implement real authentication in a later tutorial. 

In this section, you will implement an API that issues a token to the client. Code running client-side can then use this token to connect to the service to push content updates.

1. Add a new controller code file to the *chattest\Controllers* directory. Name the file *AuthController.cs*.

2. Add the following code to the authentication controller:

    ```csharp
    namespace chattest
    {
        using System.Security.Claims;
        using Microsoft.AspNetCore.Mvc;
        using Microsoft.Azure.SignalR;
        using Microsoft.Extensions.Configuration;

        [Route("api/auth")]
        public class AuthController : Controller
        {
            private readonly EndpointProvider _endpointProvider;
            private readonly TokenProvider _tokenProvider;

            public AuthController(IConfiguration config)
            {
                var connStr = config[Constants.AzureSignalRConnectionStringKey];
                _endpointProvider = CloudSignalR.CreateEndpointProviderFromConnectionString(connStr);
                _tokenProvider = CloudSignalR.CreateTokenProviderFromConnectionString(connStr);
            }

            [HttpGet("{hubName}")]
            public IActionResult GenerateJwtBearer(string hubName, [FromQuery] string uid)
            {
                var serviceUrl = _endpointProvider.GetClientEndpoint(hubName);
                var accessToken =_tokenProvider.GenerateClientAccessToken(hubName, new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, uid)
                });

                return new OkObjectResult(new
                {
                    ServiceUrl = serviceUrl,
                    AccessToken = accessToken
                });
            }
        }
    }
    ```

    The Azure SignalR SDK defines the `GenerateClientAccessToken()` method. This method is used to help issue the token based on the connection string, once you authenticate a client.

    Along with a valid token, this API also returns the *serviceURL* in the response body. This token and *serviceURL* are used by the client to authenticate the connection used to push content updates to all clients.    


## Add the web app client interface

The client user interface for this chat room app will be composed of HTML and JavaScript in a file named *index.html* in the *wwwroot* directory.

Copy the *index.html* file, and the *css*, and *scripts* folders from the *wwwroot* folder of the [samples repository](https://github.com/aspnet/AzureSignalR-samples/tree/master/samples/ChatRoomLocal/wwwroot) into your project's *wwwroot* folder.

The main code of *index.html*: 

```javascript
var connection = new signalR.HubConnectionBuilder()
                            .withUrl('/chat')
                            .build();
bindConnectionMessage(connection);
connection.start()
    .then(function () {
        onConnected(connection);
    })
    .catch(function (error) {
        console.error(error.message);
    });
```    

The code in *index.html*, calls the `HubConnectionBuilder.build()` to make a HTTP connection to the Azure SignalR resource.

If the connection is successful, that connection is passed to `bindConnectionMessage`, which adds event handlers for incoming content pushes to the client. 

`HubConnection.start()` starts communication with the hub. Once communication is started `conConnected()` adds the button event handlers. These handlers use the connection to allow this client to push content updates to all connected clients.

## Add a development runtime profile

In this section, you will add a development runtime environment for ASP.NET Core. For more information on runtime environment for ASP.NET Core, see [Work with multiple environments in ASP.NET Core](https://docs.microsoft.com/aspnet/core/fundamentals/environments).

1. Create a new folder in your project named *Properties*.

2. Add a new file named *launchSettings.json* to the folder, with the following content and save the file.

    ```json
    {
        "profiles" : 
        {
            "ChatRoom": 
            {
                "commandName": "Project",
                "launchBrowser": true,
                "environmentVariables": 
                {
                    "ASPNETCORE_ENVIRONMENT": "Development"
                },
                "applicationUrl": "http://localhost:5000/"
            }
        }
    }
    ```


## Build and Run the app locally

1. To build the app using the .NET Core CLI, execute the following command in the command shell:

        dotnet build

2. Once the build successfully completes, execute the following command to run the web app locally:

        dotnet run

    The app will be hosted locally on port 5000 as configured in our development runtime profile:

        E:\Testing\chattest>dotnet run
        Hosting environment: Development
        Content root path: E:\Testing\chattest
        Now listening on: http://localhost:5000
        Application started. Press Ctrl+C to shut down.    

3. Launch two browser windows and navigate each browser to `http://localhost:5000`. You will be prompted to enter your name. Enter a client name for both clients and test pushing message content between both clients using the **Send** button.

    ![Quickstart Complete local](media/signalr-quickstart-dotnet-core/signalr-quickstart-complete-local.png)



## Clean up resources

If you will be continuing to the next tutorial, you can keep the resources created in this quickstart and reuse them with the next tutorial.

Otherwise, if you are finished with the quickstart sample application, you can delete the Azure resources created in this quickstart to avoid charges. 

> [!IMPORTANT]
> Deleting a resource group is irreversible and that the resource group and all the resources in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. If you created the resources for hosting this sample inside an existing resource group that contains resources you want to keep, you can delete each resource individually from their respective blades instead of deleting the resource group.
> 
> 

Sign in to the [Azure portal](https://portal.azure.com) and click **Resource groups**.

In the **Filter by name...** textbox, type the name of your resource group. The instructions for this quickstart used a resource group named *SignalRTestResources*. On your resource group in the result list, click **...** then **Delete resource group**.

   
![Delete](./media/signalr-quickstart-dotnet-core/signalr-delete-resource-group.png)


You will be asked to confirm the deletion of the resource group. Type the name of your resource group to confirm, and click **Delete**.
   
After a few moments, the resource group and all of its contained resources are deleted.



## Next steps

In this quickstart, you've created a new Azure SignalR Service resource and used to in an ASP.NET Core Web app to push content updates in real time to multiple connected clients. To learn more about using Azure SignalR Service, continue to the next tutorial that demonstrates authentication with OAuth.

> [!div class="nextstepaction"]
> [Azure SignalR Service authentication with OAuth](./signalr-authenticate-oauth.md)


