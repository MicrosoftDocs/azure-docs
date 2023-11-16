---
author: wchigit
ms.service: service-connector
ms.topic: include
ms.date: 10/31/2023
ms.author: wchi
---

### [.NET](#tab/dotnet)

1. Install dependencies.
    ```bash
    dotnet add package Microsoft.Azure.SignalR
    ```
1. Get the connection string from the environment variables added by Service Connector.
    
    ```csharp
    var builder = WebApplication.CreateBuilder(args);

    var connectionString = Environment.GetEnvironmentVariable("AZURE_SIGNALR_CONNECTIONSTRING");
    builder.Services.AddSignalR().AddAzureSignalR(connectionString);

    var app = builder.Build();
    ```

### [None](#tab/none)
For other languages, you can use the connection string that Service Connector sets to the environment variables to connect Azure SignalR Service. For environment variable details, see [Integrate Azure SignalR Service with Service Connector](../how-to-integrate-signalr.md).