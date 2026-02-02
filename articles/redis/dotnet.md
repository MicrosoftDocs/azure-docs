---
title: "Quickstart: Use Azure Managed Redis in .NET Core"
description: In this quickstart, learn how to use Azure Managed Redis in a .NET console app
ms.date: 01/30/2026
ms.topic: quickstart
ms.devlang: csharp
appliesto:
    - ✅ Azure Managed Redis
ai-usage: ai-assisted
# Customer intent: As a .NET developer, new to Azure Managed Redis, I want to create a new dotnet app that uses Azure Managed Redis.
---

# Quickstart: Use Azure Managed Redis in .NET Core

This .NET 8 console application demonstrates how to connect to **Azure Managed Redis** by using **Microsoft Entra ID** authentication. The core value proposition is **passwordless authentication** with automatic token refresh, providing a secure and modern approach to Redis connectivity.

## Skip to the code on GitHub

Clone the [Microsoft.Azure.StackExchangeRedis](https://github.com/Azure/Microsoft.Azure.StackExchangeRedis/tree/main/sample) repo on GitHub.

## Prerequisites

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0).
- An **Azure Managed Redis** instance provisioned in your Azure subscription.
- Your Azure user or service principal must be added as a Redis user on the cache. In the Azure portal, go to **Authentication** on the Resource menu, select **User or service principal**, and add your identity.
- [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest) for local development authentication.

## Required NuGet Packages

| Package                                | Purpose                                                                              |
|----------------------------------------|--------------------------------------------------------------------------------------|
| `Microsoft.Azure.StackExchangeRedis`   | Extension library that adds Microsoft Entra ID authentication to StackExchange.Redis |
| `Azure.Identity`                       | Provides `DefaultAzureCredential` and other Azure identity implementations           |
| `StackExchange.Redis`                  | The underlying Redis client (pulled in as a dependency)                              |
| `Microsoft.Extensions.Logging.Console` | Console logging for diagnostics                                                      |

## Authentication methods

The extension supports multiple identity types, each with a corresponding `ConfigureForAzure*()` extension method:

1. **`DefaultAzureCredential`** - The recommended approach. It chains multiple credential sources (environment variables, managed identity, Azure CLI authentication, Visual Studio credentials, and more) and uses the first one that works. It's ideal for code that runs both locally and in Azure.

1. **User-Assigned Managed Identity** - For Azure-hosted apps where you explicitly specify which managed identity to use by providing its client ID.

1. **System-Assigned Managed Identity** - For Azure-hosted apps that use the identity automatically assigned to the resource.

1. **Service Principal (Secret)** - Client ID, tenant ID, and secret for automated or CI scenarios.

1. **Service Principal (Certificate)** - Client ID, tenant ID, and X.509 certificate for higher security.

### How `DefaultAzureCredential` works locally

When you develop locally, `DefaultAzureCredential` attempts to authenticate by using the following methods:

```bash
az login
```

This method signs you in to the Azure CLI by using your Microsoft Entra ID account. The SDK detects your cached credentials and uses them to obtain tokens. You must configure your Microsoft Entra ID user as a **Redis User** on the Azure Managed Redis resource through the **Authentication** on the Resource menu in the Azure portal.

## Key implementation patterns

**Connection configuration:**

```csharp
ConfigurationOptions configurationOptions = new()
{
    Protocol = RedisProtocol.Resp3,  // Recommended for seamless re-auth
    LoggerFactory = loggerFactory,
    AbortOnConnectFail = true,       // Fail fast (use false in production)
    BacklogPolicy = BacklogPolicy.FailFast
};
```

**Entra ID setup:**

```csharp
await configurationOptions.ConfigureForAzureWithTokenCredentialAsync(new DefaultAzureCredential());
var connection = await ConnectionMultiplexer.ConnectAsync(configurationOptions);
```

**Basic Redis operations:**

```csharp
var database = connection.GetDatabase();
await database.StringSetAsync("key", "value");
var value = await database.StringGetAsync("key");
```

## Token lifecycle and automatic re-authentication

The extension automatically handles the OAuth2 token lifecycle:

1. **Initial acquisition** - It gets a token before connecting.
1. **Proactive refresh** - Before the token expires (about one hour), it gets a fresh token in the background.
1. **Re-authentication** - It re-authenticates the connection with the new token without dropping commands.

For observability, you can subscribe to token events:

| Event                              | Purpose                                      |
|------------------------------------|----------------------------------------------|
| `TokenRefreshed`                   | New token acquired                           |
| `TokenRefreshFailed`               | Token refresh failed (still using old token) |
| `ConnectionReauthenticated`        | Connection successfully re-authenticated     |
| `ConnectionReauthenticationFailed` | Re-auth failed for a connection              |

## RESP3 vs. RESP2 protocol

The sample uses **RESP3** (`Protocol = RedisProtocol.Resp3`) because:

- RESP2 creates separate connections for interactive commands and pub/sub.
- Only the interactive connection gets proactively re-authenticated.
- Pub/sub connections close when their token expires, causing brief interruptions.
- RESP3 multiplexes everything on one connection, avoiding these disruptions.

## Azure prerequisites

1. Create an Azure Managed Redis instance.
1. Enable Microsoft Entra ID authentication under "Data Access Configuration."
1. Add your identity as a Redis User with the appropriate permissions (Data Owner, Data Contributor, and so on).
1. **Run `az login`** locally to authenticate with your Entra ID account.

## Basic Redis concepts

| Concept                 | Description                                                                                        |
|-------------------------|----------------------------------------------------------------------------------------------------|
| `ConnectionMultiplexer` | Singleton, thread-safe connection pool to Redis. Create it once and reuse it for the app lifetime. |
| `IDatabase`             | Interface for executing commands (`StringGet`, `StringSet`, `HashGet`, and so on).                 |
| Endpoint format         | `endpoint:10000` (TLS) for Azure Managed Redis.                                                    |

## Running the sample

```powershell
az login
cd sample
dotnet run
```

Enter your Redis endpoint (for example, `<your-redis-name>.<region>.redis.azure.net:10000`), choose authentication method **1** (DefaultAzureCredential), and watch the `+` characters print every second as commands succeed. Let it run for more than 60 minutes to verify automatic token refresh works.

## Production considerations

| Setting              | Sample value | Production value                                     |
|----------------------|--------------|------------------------------------------------------|
| `AbortOnConnectFail` | `true`       | `false` (retry on startup)                           |
| `BacklogPolicy`      | `FailFast`   | `Default` (queue commands during transient failures) |
| Connection lifetime  | Demo loop    | Singleton via DI (`IConnectionMultiplexer`)          |

This sample provides a complete reference implementation for secure, passwordless Entra ID authentication in any .NET application that uses Azure Managed Redis.

## Related content

- [Connection resilience](best-practices-connection.md)
- [Best Practices Development](best-practices-development.md)
