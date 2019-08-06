---
title: Quickstart to learn how to use Azure SignalR Service
description: A quickstart for using Azure SignalR Service to create a chat room with ASP.NET Core MVC apps.
author: sffamily
ms.service: signalr
ms.devlang: dotnet
ms.topic: quickstart
ms.date: 03/01/2019
ms.author: zhshang
---
# Quickstart: Create a chat room by using SignalR Service


Azure SignalR Service is an Azure service that helps developers easily build web applications with real-time features. This service is based on [SignalR for ASP.NET Core 2.0](https://docs.microsoft.com/aspnet/core/signalr/introduction).

This article shows you how to get started with the Azure SignalR Service. In this quickstart, you'll create a chat application by using an ASP.NET Core MVC web app. This app will make a connection with your Azure SignalR Service resource to enable real-time content updates. You'll host the web application locally and connect with multiple browser clients. Each client will be able to push content updates to all other clients. 

You can use any code editor to complete the steps in this quickstart. One option is [Visual Studio Code](https://code.visualstudio.com/), which is available on the Windows, macOS, and Linux platforms.

The code for this tutorial is available for download in the [AzureSignalR-samples GitHub repository](https://github.com/aspnet/AzureSignalR-samples/tree/master/samples/ChatRoom). Also, you can create the Azure resources used in this quickstart by following [Create a SignalR Service script](scripts/signalr-cli-create-service.md).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]


## Prerequisites

* Install the [.NET Core SDK](https://www.microsoft.com/net/download/windows).
* Download or clone the [AzureSignalR-sample](https://github.com/aspnet/AzureSignalR-samples) GitHub repository. 

## Create an Azure SignalR resource

[!INCLUDE [azure-signalr-create](../../includes/signalr-create.md)]

## Create an ASP.NET Core web app

In this section, you use the [.NET Core command-line interface (CLI)](https://docs.microsoft.com/dotnet/core/tools/) to create an ASP.NET Core MVC web app project. The advantage of using the .NET Core CLI over Visual Studio is that it's available across the Windows, macOS, and Linux platforms. 

1. Create a folder for your project. This quickstart uses the *E:\Testing\chattest* folder.

2. In the new folder, run the following command to create the project:

        dotnet new mvc


## Add Secret Manager to the project

In this section, you'll add the [Secret Manager tool](https://docs.microsoft.com/aspnet/core/security/app-secrets) to your project. The Secret Manager tool stores sensitive data for development work outside your project tree. This approach helps prevent the accidental sharing of app secrets in source code.

1. Open your *.csproj* file. Add a `DotNetCliToolReference` element to include *Microsoft.Extensions.SecretManager.Tools*. Also add a `UserSecretsId` element as shown in the following code for *chattest.csproj*, and save the file.

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

1. Add a reference to the `Microsoft.Azure.SignalR` NuGet package by running the following command:

        dotnet add package Microsoft.Azure.SignalR

2. Run the following command to restore packages for your project:

        dotnet restore

3. Add a secret named *Azure:SignalR:ConnectionString* to Secret Manager. 

    This secret will contain the connection string to access your SignalR Service resource. *Azure:SignalR:ConnectionString* is the default configuration key that SignalR looks for to establish a connection. Replace the value in the following command with the connection string for your SignalR Service resource.

    You must run this command in the same directory as the *.csproj* file.

    ```
    dotnet user-secrets set Azure:SignalR:ConnectionString "<Your connection string>"    
    ```

    Secret Manager will be used only for testing the web app while it's hosted locally. In a later tutorial, you'll deploy the chat web app to Azure. After the web app is deployed to Azure, you'll use an application setting instead of storing the connection string with Secret Manager.

    This secret is accessed with the Configuration API. A colon (:) works in the configuration name with the Configuration API on all supported platforms. See [Configuration by environment](https://docs.microsoft.com/aspnet/core/fundamentals/configuration/index?tabs=basicconfiguration&view=aspnetcore-2.0). 


4. Open *Startup.cs* and update the `ConfigureServices` method to use Azure SignalR Service by calling the `services.AddSignalR().AddAzureSignalR()` method:

    ```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddMvc();
        services.AddSignalR().AddAzureSignalR();
    }
    ```

    By not passing a parameter to `AddAzureSignalR()`, this code uses the default configuration key for the SignalR Service resource connection string. The default configuration key is *Azure:SignalR:ConnectionString*.

5. Also in *Startup.cs*, update the `Configure` method by replacing the call to `app.UseStaticFiles()` with the following code and save the file.

    ```csharp
    app.UseFileServer();
    app.UseAzureSignalR(routes =>
    {
        routes.MapHub<Chat>("/chat");
    });
    ```            

### Add a hub class

In SignalR, a hub is a core component that exposes a set of methods that can be called from the client. In this section, you define a hub class with two methods: 

* `Broadcast`: This method broadcasts a message to all clients.
* `Echo`: This method sends a message back to the caller.

Both methods use the `Clients` interface that the ASP.NET Core SignalR SDK provides. This interface gives you access to all connected clients, so you can push content to your clients.

1. In your project directory, add a new folder named *Hub*. Add a new hub code file named *Chat.cs* to the new folder.

2. Add the following code to *Chat.cs* to define your hub class and save the file. 

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

### Add the client interface for the web app

The client user interface for this chat room app will consist of HTML and JavaScript in a file named *index.html* in the *wwwroot* directory.

Copy the *index.html* file, the *css* folder, and the *scripts* folder from the *wwwroot* folder of the [samples repository](https://github.com/aspnet/AzureSignalR-samples/tree/master/samples/ChatRoom/wwwroot). Paste them into your project's *wwwroot* folder.

Here's the main code of *index.html*: 

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

The code in *index.html* calls `HubConnectionBuilder.build()` to make an HTTP connection to the Azure SignalR resource.

If the connection is successful, that connection is passed to `bindConnectionMessage`, which adds event handlers for incoming content pushes to the client. 

`HubConnection.start()` starts communication with the hub. Then, `onConnected()` adds the button event handlers. These handlers use the connection to allow this client to push content updates to all connected clients.

## Add a development runtime profile

In this section, you'll add a development runtime environment for ASP.NET Core. For more information, see [Work with multiple environments in ASP.NET Core](https://docs.microsoft.com/aspnet/core/fundamentals/environments).

1. Create a folder named *Properties* in your project.

2. Add a new file named *launchSettings.json* to the folder, with the following content, and save the file.

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


## Build and run the app locally

1. To build the app by using the .NET Core CLI, run the following command in the command shell:

        dotnet build

2. After the build successfully finishes, run the following command to run the web app locally:

        dotnet run

    The app will be hosted locally on port 5000, as configured in our development runtime profile:

        E:\Testing\chattest>dotnet run
        Hosting environment: Development
        Content root path: E:\Testing\chattest
        Now listening on: http://localhost:5000
        Application started. Press Ctrl+C to shut down.    

3. Open two browser windows. In each browser, go to `http://localhost:5000`. You're prompted to enter your name. Enter a client name for both clients and test pushing message content between both clients by using the **Send** button.

    ![Example of an Azure SignalR group chat](media/signalr-quickstart-dotnet-core/signalr-quickstart-complete-local.png)



## Clean up resources

If you'll continue to the next tutorial, you can keep the resources created in this quickstart and reuse them.

If you're finished with the quickstart sample application, you can delete the Azure resources created in this quickstart to avoid charges. 

> [!IMPORTANT]
> Deleting a resource group is irreversible and includes all the resources in that group. Make sure that you don't accidentally delete the wrong resource group or resources. If you created the resources for hosting this sample in an existing resource group that contains resources you want to keep, you can delete each resource individually from its blade instead of deleting the resource group.
> 
> 

Sign in to the [Azure portal](https://portal.azure.com) and select **Resource groups**.

In the **Filter by name** text box, type the name of your resource group. The instructions for this quickstart used a resource group named *SignalRTestResources*. On your resource group in the result list, select the ellipsis (**...**) > **Delete resource group**.

   
![Selections for deleting a resource group](./media/signalr-quickstart-dotnet-core/signalr-delete-resource-group.png)


You're asked to confirm the deletion of the resource group. Enter the name of your resource group to confirm, and select **Delete**.
   
After a few moments, the resource group and all of its resources are deleted.



## Next steps

In this quickstart, you created a new Azure SignalR Service resource. You then used it with an ASP.NET Core web app to push content updates in real time to multiple connected clients. To learn more about using Azure SignalR Service, continue to the tutorial that demonstrates authentication.

> [!div class="nextstepaction"]
> [Azure SignalR Service authentication](./signalr-concept-authenticate-oauth.md)


