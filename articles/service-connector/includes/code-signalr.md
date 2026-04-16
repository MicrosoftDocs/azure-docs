---
author: wchigit
ms.service: service-connector
ms.topic: include
ms.date: 04/06/2026
ms.author: wchi
---

1. Install dependencies.

   ```bash
   dotnet add package Microsoft.Azure.SignalR
   ```

1. Run the following code. Get the `AZURE_SIGNALR_CONNECTIONSTRING` for the authentication type you want to use from the Service Connector environment variable.

   ```csharp
   var builder = WebApplication.CreateBuilder(args);

   var connectionString = Environment.GetEnvironmentVariable("AZURE_SIGNALR_CONNECTIONSTRING");
   builder.Services.AddSignalR().AddAzureSignalR(connectionString);

   var app = builder.Build();
   ```

For languages other than .NET, you can connect Azure SignalR Service by using the connection string from the Service Connector environment variables.

