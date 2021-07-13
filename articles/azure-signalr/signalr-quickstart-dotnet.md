---
title: Develop with ASP.NET - Azure SignalR Service
description: A quickstart for using Azure SignalR Service to create a chat room with ASP.NET framework.
author: sffamily
ms.service: signalr
ms.devlang: dotnet
ms.topic: quickstart
ms.custom: devx-track-csharp
ms.date: 09/28/2020
ms.author: zhshang
---

# Quickstart: Create a chat room with ASP.NET and SignalR Service

Azure SignalR Service is based on [SignalR for ASP.NET Core 2.1](/aspnet/core/signalr/introduction?preserve-view=true&view=aspnetcore-2.1), which is **not** 100% compatible with ASP.NET SignalR. Azure SignalR Service re-implemented ASP.NET SignalR data protocol based on the latest ASP.NET Core technologies. When using Azure SignalR Service for ASP.NET SignalR, some ASP.NET SignalR features are no longer supported, for example, Azure SignalR does not replay messages when the client reconnects. Also, the Forever Frame transport and JSONP are not supported. Some code changes and proper version of dependent libraries are needed to make ASP.NET SignalR application work with SignalR Service.

Refer to the [version differences doc](/aspnet/core/signalr/version-differences?preserve-view=true&view=aspnetcore-3.1) for a complete list of feature comparison between ASP.NET SignalR and ASP.NET Core SignalR.

In this quickstart, you will learn how to get started with the ASP.NET and Azure SignalR Service for a similar [Chat Room application](./signalr-quickstart-dotnet-core.md).


[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note-dotnet.md)]

## Prerequisites

* [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/)
* [.NET Framework 4.6.1](https://dotnet.microsoft.com/download/dotnet-framework/net461)
* [ASP.NET SignalR 2.4.1](https://www.nuget.org/packages/Microsoft.AspNet.SignalR/)

Having issues? Try the [troubleshooting guide](signalr-howto-troubleshoot-guide.md) or [let us know](https://aka.ms/asrs/qsnet).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account.

Having issues? Try the [troubleshooting guide](signalr-howto-troubleshoot-guide.md) or [let us know](https://aka.ms/asrs/qsnet).

[!INCLUDE [Create instance](includes/signalr-quickstart-create-instance.md)]

*Serverless* mode is not supported for ASP.NET SignalR applications. Always use *Default* or *Classic* for the Azure SignalR Service instance.

You can also create Azure resources used in this quickstart with [Create a SignalR Service script](scripts/signalr-cli-create-service.md).

Having issues? Try the [troubleshooting guide](signalr-howto-troubleshoot-guide.md) or [let us know](https://aka.ms/asrs/qsnet).

## Clone the sample application

While the service is deploying, let's switch to working with code. Clone the [sample app from GitHub](https://github.com/aspnet/AzureSignalR-samples/tree/master/aspnet-samples/ChatRoom), set the SignalR Service connection string, and run the application locally.

1. Open a git terminal window. Change to a folder where you want to clone the sample project.

1. Run the following command to clone the sample repository. This command creates a copy of the sample app on your computer.

    ```bash
    git clone https://github.com/aspnet/AzureSignalR-samples.git
    ```

Having issues? Try the [troubleshooting guide](signalr-howto-troubleshoot-guide.md) or [let us know](https://aka.ms/asrs/qsnet).

## Configure and run Chat Room web app

1. Start Visual Studio and open the solution in the *aspnet-samples/ChatRoom/* folder of the cloned repository.

1. In the browser where the Azure portal is opened, find and select the instance you created.

1. Select **Keys** to view the connection strings for the SignalR Service instance.

1. Select and copy the primary connection string.

1. Now set the connection string in the *web.config* file.

    ```xml
    <configuration>
    <connectionStrings>
        <add name="Azure:SignalR:ConnectionString" connectionString="<Replace By Your Connection String>"/>
    </connectionStrings>
    ...
    </configuration>
    ```

1. In *Startup.cs*, instead of calling `MapSignalR()`, you need to call `MapAzureSignalR({YourApplicationName})` and pass in connection string to make the application connect to the service instead of hosting SignalR by itself. Replace `{YourApplicationName}` to the name of your application. This name is a unique name to distinguish this application from your other applications. You can use `this.GetType().FullName` as the value.

    ```cs
    public void Configuration(IAppBuilder app)
    {
        // Any connection or hub wire up and configuration should go here
        app.MapAzureSignalR(this.GetType().FullName);
    }
    ```

    You also need to reference the service SDK before using these APIs. Open the **Tools | NuGet Package Manager | Package Manager Console** and run command:

    ```powershell
    Install-Package Microsoft.Azure.SignalR.AspNet
    ```

    Other than these changes, everything else remains the same, you can still use the hub interface you're already familiar with to write business logic.

    > [!NOTE]
    > In the implementation an endpoint `/signalr/negotiate` is exposed for negotiation by Azure SignalR Service SDK. It will return a special negotiation response when clients try to connect and redirect clients to service endpoint defined in the connection string.

1. Press <kbd>F5</kbd> to run the project in debug mode. You can see the application runs locally. Instead of hosting a SignalR runtime by application itself, it now connects to the Azure SignalR Service.

Having issues? Try the [troubleshooting guide](signalr-howto-troubleshoot-guide.md) or [let us know](https://aka.ms/asrs/qsnet).

[!INCLUDE [Cleanup](includes/signalr-quickstart-cleanup.md)]

> [!IMPORTANT]
> Deleting a resource group is irreversible and that the resource group and all the resources in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. If you created the resources for hosting this sample inside an existing resource group that contains resources you want to keep, you can delete each resource individually from their respective blades instead of deleting the resource group.

Sign in to the [Azure portal](https://portal.azure.com) and click **Resource groups**.

In the **Filter by name...** textbox, type the name of your resource group. The instructions for this quickstart used a resource group named *SignalRTestResources*. On your resource group in the result list, click **...** then **Delete resource group**.

![Delete](./media/signalr-quickstart-dotnet-core/signalr-delete-resource-group.png)

After a few moments, the resource group and all of its contained resources are deleted.

Having issues? Try the [troubleshooting guide](signalr-howto-troubleshoot-guide.md) or [let us know](https://aka.ms/asrs/qsnet).

## Next steps

In this quickstart, you created a new Azure SignalR Service resource and used it with an ASP.NET web app. Next, learn how to develop real-time applications using Azure SignalR Service with ASP.NET Core.

> [!div class="nextstepaction"]
> [Azure SignalR Service with ASP.NET Core](./signalr-quickstart-dotnet-core.md)
