---
title: Migrate Azure Service Bus extension for Azure Functions to version 5.x 
description: This article shows you how to upgrade your existing function apps using the Azure Service Bus extension version 4.x to be able to use version 5.x of the extension. 
ms.service: azure-functions
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python, devx-track-ts
ms.topic: how-to 
ms.date: 10/06/2026
zone_pivot_groups: programming-languages-set-functions
---

# Migrate function apps from Azure Service Bus extension version 4.x to version 5.x 

This article highlights considerations for upgrading your existing Azure Functions applications that use the Azure Service Bus extension version 4.x to use the newer [extension version 5.x](./functions-bindings-service-bus.md?tabs=extensionv5). Migrating from version 4.x to version 5.x of the Azure Service Bus extension has breaking changes for your application.

> [!IMPORTANT]
> Azure Service Bus extension version 4.x was retired on March 31, 2025. Applications can continue to function with the extension, but it no longer receives maintenance or support. Migrate to extension version 5.x, which uses the supported `Azure.Messaging.ServiceBus` library. The `Microsoft.Azure.ServiceBus` library used by version 4.x was retired on September 30, 2026. For details of the library retirement, see the [retirement announcement](https://techcommunity.microsoft.com/blog/messagingonazureblog/some-azure-service-bus-sdk-libraries-will-be-retired-on-30-september-2026%E2%80%94migrat/3917853).

This article walks you through the process of migrating your function app to run on version 5.x of the Azure Service Bus extension. Because project upgrade instructions are language dependent, make sure to choose your development language from the selector at the [top of the article](#top).

::: zone pivot="programming-language-go"

> [!NOTE]
> This migration doesn't apply to Go function apps. First-class Go support wasn't available with version 4.x of the Azure Service Bus extension. For current Go trigger guidance, see the [Azure Service Bus trigger](functions-bindings-service-bus-trigger.md?pivots=programming-language-go).

::: zone-end

::: zone pivot="programming-language-csharp"

## Update the extension version

.NET Functions uses extensions that are installed in the project as NuGet packages. Depending on your Functions process model, the NuGet package to update varies.

|Functions process model |Azure Service Bus extension |Recommended version |
|------------------------|--------------------------|--------------------|
|[In-process model](./functions-dotnet-class-library.md)|[Microsoft.Azure.WebJobs.Extensions.ServiceBus](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.ServiceBus) |>= 5.13.4 |
|[Isolated worker model](./dotnet-isolated-process-guide.md) |[Microsoft.Azure.Functions.Worker.Extensions.ServiceBus](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.ServiceBus)|>= 5.14.1 |

Update your `.csproj` project file to use the latest extension version for your process model. The following `.csproj` file uses version 5 of the Azure Service Bus extension.

### [Isolated worker model](#tab/isolated-process)

```xml
<Project Sdk="Azure.Functions.Sdk/1.0.0">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.Azure.Functions.Worker" Version="2.52.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.ServiceBus" Version="5.16.0" />
  </ItemGroup>
  <ItemGroup>
    <None Update="host.json">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    </None>
    <None Update="local.settings.json">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
      <CopyToPublishDirectory>Never</CopyToPublishDirectory>
    </None>
  </ItemGroup>
</Project>
```

### [In-process model](#tab/in-process)

[!INCLUDE [functions-in-process-model-retirement-note](../../includes/functions-in-process-model-retirement-note.md)]

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net7.0</TargetFramework>
    <AzureFunctionsVersion>v4</AzureFunctionsVersion>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.Azure.WebJobs.Extensions.ServiceBus" Version="5.13.4" />
    <PackageReference Include="Microsoft.NET.Sdk.Functions" Version="4.1.1" />
  </ItemGroup>
  <ItemGroup>
    <None Update="host.json">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    </None>
    <None Update="local.settings.json">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
      <CopyToPublishDirectory>Never</CopyToPublishDirectory>
    </None>
  </ItemGroup>
</Project>
```

## Azure Service Bus SDK changes

Extension version 5.x uses [Azure.Messaging.ServiceBus](https://www.nuget.org/packages/Azure.Messaging.ServiceBus). If your function code uses types from the retired `Microsoft.Azure.ServiceBus` library, update them by following the [client library migration guide](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/servicebus/Azure.Messaging.ServiceBus/MigrationGuide.md).

---

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-java,programming-language-powershell,programming-language-typescript"

## Update the extension bundle

By default, [extension bundles](./extension-bundles.md) are used by non-.NET function apps to install binding extensions. The Azure Service Bus version 5 extension is part of extension bundle version 4.

To update your application to use the latest extension bundle, update your `host.json`. The following `host.json` file uses version 4 of the extension bundle.

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[4.*, 5.0.0)"
  }
}
```

::: zone-end
::: zone pivot="programming-language-csharp"
## Modify your function code

The Azure Functions Azure Service Bus extension version 5 is built on top of the Azure.Messaging.ServiceBus SDK version 3, which removed support for the `Message` class. Instead, use the `ServiceBusReceivedMessage` type to receive message metadata from Service Bus Queues and Subscriptions.
::: zone-end


## Next steps

- [Run a function when a Service Bus queue or topic message is created (Trigger)](./functions-bindings-service-bus-trigger.md)
- [Send Azure Service Bus messages from Azure Functions (Output binding)](./functions-bindings-service-bus-output.md)
