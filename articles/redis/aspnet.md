---
title: Create an ASP.NET web app with an Azure Managed Redis cache
description: In this quickstart, you learn how to create an ASP.NET Core web app with an Azure Managed Redis cache.
ms.date: 01/30/2026
ms.topic: quickstart
ms.devlang: csharp
appliesto:
  - ✅ Azure Managed Redis
ai-usage: ai-assisted

# Customer intent: As an ASP.NET developer, new to Azure Managed Redis, I want to create a new ASP.NET app that uses Azure Managed Redis.
---

# Azure Managed Redis sample - ASP.NET Core Web API

This sample shows how to connect an ASP.NET Core Web API to Azure Managed Redis by using Microsoft Entra ID authentication  with the `DefaultAzureCredential` flow. The application avoids traditional connection string-based authentication in favor of token-based, Microsoft Entra ID access, which aligns with modern security best practices.

The application is a minimal ASP.NET Core 8.0 Web API that:

1. Establishes a secure, authenticated connection to Azure Managed Redis at startup.
1. Exposes a simple REST endpoint that reads and writes data to the cache.
1. Demonstrates proper Redis connection lifecycle management by using dependency injection.

## Skip to the code on GitHub

Clone the [Microsoft.Azure.StackExchangeRedis](https://github.com/Azure/Microsoft.Azure.StackExchangeRedis/tree/main/sample.aspnet) repo on GitHub.

## Prerequisites

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0).
- An **Azure Managed Redis** instance provisioned in your Azure subscription.
- Your Azure user or service principal must be added as a Redis user on the cache. In the Azure portal, go to **Authentication** on the Resource menu, select **User or service principal**, and add your identity.
- [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest) for local development authentication.

## Required NuGet Packages

| Package                              | Purpose                                                                                                                    |
|--------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| `Microsoft.Azure.StackExchangeRedis` | Extension methods for StackExchange.Redis that enable Microsoft Entra ID token-based authentication to Azure Managed Redis |
| `StackExchange.Redis`                | The underlying Redis client library for .NET                                                                               |
| `Azure.Identity`                     | Provides `DefaultAzureCredential` and other credential types for authenticating with Azure services                        |
| `Swashbuckle.AspNetCore`             | Swagger/OpenAPI support for API documentation and testing                                                                  |

Install the primary package:

```bash
dotnet add package Microsoft.Azure.StackExchangeRedis
```

This package brings in `StackExchange.Redis` and `Azure.Identity` as dependencies.

## Configuration

The application reads the Redis endpoint from configuration. Update `appsettings.Development.json`:

```json
{
  "Redis": {
    "Endpoint": "<your-redis-name>.<region>.redis.azure.net:10000"
  }
}
```

> [!NOTE]
> Azure Managed Redis uses port `10000` by default. The endpoint format follows `<cache-name>.<region>.redis.azure.net:10000`.

## Authentication Flow

### Local Development

Before running the application locally, authenticate with Azure:

```bash
az login
```

The `DefaultAzureCredential` automatically picks up your Azure CLI credentials and uses them to get an access token for the Redis resource. This approach eliminates the need to manage or rotate secrets locally.

### Production environments

In Azure-hosted environments such as App Service, Container Apps, and AKS, `DefaultAzureCredential` uses:

- **Managed Identity** - system-assigned or user-assigned
- **Workload Identity** - for Kubernetes scenarios
- **Environment variables** - for service principal authentication

You don't need to change your code. The same `DefaultAzureCredential` seamlessly adapts to the environment.

## Architecture

### Redis service (`Services/Redis.cs`)

The `Redis` class manages the connection lifecycle:

```csharp
var options = new ConfigurationOptions()
{
    EndPoints = { endpoint },
    LoggerFactory = _loggerFactory,
};

await options.ConfigureForAzureWithTokenCredentialAsync(new DefaultAzureCredential());

_connection = await ConnectionMultiplexer.ConnectAsync(options);
```

Key points:

- `ConfigureForAzureWithTokenCredentialAsync` is an extension method from `Microsoft.Azure.StackExchangeRedis` that sets up token-based authentication
- `DefaultAzureCredential` automatically handles token acquisition and refresh
- The app establishes the connection once at startup and shares it across requests

### Dependency injection (`Program.cs`)

The app registers the Redis service as a singleton and initializes it during startup:

```csharp
builder.Services.AddSingleton<Redis>();

// Initialize Redis connection
using (var scope = app.Services.CreateScope())
{
    var redis = scope.ServiceProvider.GetRequiredService<Redis>();
    var endpoint = app.Configuration.GetValue<string>("Redis:Endpoint");
    await redis.ConnectAsync(endpoint);
}
```

### API Controller (`Controllers/SampleController.cs`)

The controller injects the `Redis` service and demonstrates basic cache operations:

- **GET `/Sample`**: Reads the previous visit timestamp from the cache and updates it with the current time

## Running the application

1. Ensure you're authenticated:

   ```bash
   az login
   ```

1. Update the Redis endpoint in `appsettings.Development.json`.

1. Run the application:

   ```bash
   dotnet run
   ```

1. Navigate to `https://localhost:<port>/swagger` to access the Swagger UI.

## Expected output

When invoking the `GET /Sample` endpoint:

**First request:**

```bash
Previous visit was at: 
(Empty value since no previous visit exists)
```

```bash
**Subsequent requests:**
Previous visit was at: 2026-01-30T14:23:45
(Returns the ISO 8601 formatted timestamp of the previous request)
```

The console logs display:

```bash
info: Microsoft.Azure.StackExchangeRedis.Sample.AspNet.Controllers.SampleController
      Handled GET request. Previous visit time: 2026-01-30T14:23:45
```

## Key implementation details

- **Token refresh**: The `Microsoft.Azure.StackExchangeRedis` library automatically refreshes tokens before they expire, so you don't need to handle refresh manually.

- **Connection resilience**: The `ConnectionMultiplexer` from StackExchange.Redis manages reconnection logic on its own.

- **Resource cleanup**: The `Redis` service implements `IDisposable` to properly close the connection when the application shuts down.

- **Logging integration**: The Redis client works with .NET's `ILoggerFactory` for unified logging output.

## Troubleshooting

| Issue | Resolution |
| ------- | ------------ |
| `No connection is available` | Verify the endpoint format and port (`10000`). Make sure the Redis instance is provisioned and accessible. |
| `AuthenticationFailedException` | Run `az login` to refresh credentials. Verify your identity is added as a Redis user under **Authentication** on the Resource menu. |
| `Unauthorized` | Ensure your Microsoft Entra ID identity is added as a Redis user on the Azure Managed Redis instance. For more information, see [Use Microsoft Entra ID for cache authentication](entra-for-authentication.md). |

## Related content

- [Microsoft Entra ID authentication for Azure Managed Redis](entra-for-authentication.md)
- [DefaultAzureCredential overview](/dotnet/azure/sdk/authentication)
