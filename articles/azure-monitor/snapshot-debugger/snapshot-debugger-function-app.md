---
title: Enable Snapshot Debugger for .NET and .NET Core apps in Azure Functions | Microsoft Docs
description: Enable Snapshot Debugger for .NET and .NET Core apps in Azure Functions.
ms.author: hannahhunter
author: hhunter-ms
ms.reviewer: charles.weininger
reviewer: cweining
ms.topic: how-to
ms.date: 11/17/2023
ms.custom: devdivchpfy22, devx-track-dotnet
---

# Enable Snapshot Debugger for .NET and .NET Core apps in Azure Functions

Snapshot Debugger currently works for ASP.NET and ASP.NET Core apps that are running on Azure Functions on Windows service plans.

We recommend that you run your application on the Basic or higher service tiers when using Snapshot Debugger. For most applications:
- The Free and Shared service tiers don't have enough memory or disk space to save snapshots. 
- The Consumption tier isn't currently available for Snapshot Debugger.

Although Snapshot Debugger is pre-installed as part of the Azure Functions runtime, you don't need to add extra NuGet packages or application settings.

## Prerequisite

[Enable Application Insights monitoring in your Functions app](../../azure-functions/configure-monitoring.md#new-function-app-in-the-portal).

## Enable Snapshot Debugger

To enable Snapshot Debugger in your Functions app, add the `snapshotConfiguration` property to your *host.json* file and redeploy your function. For example:

```json
{
  "version": "2.0",
  "logging": {
    "applicationInsights": {
      "snapshotConfiguration": {
        "isEnabled": true
      }
    }
  }
}
```
Generate traffic to your application that can trigger an exception. Then wait 10 to 15 minutes for snapshots to be sent to the Application Insights instance.

You can verify that Snapshot Debugger has been enabled by checking your .NET function app files. For example, in the following simple .NET function app, the `.csproj`, `{Your}Function.cs`, and `host.json` of your .NET application show Snapshot Debugger as enabled:

`Project.csproj`

```xml
<Project Sdk="Microsoft.NET.Sdk">
<PropertyGroup>
    <TargetFramework>netcoreapp2.1</TargetFramework>
    <AzureFunctionsVersion>v2</AzureFunctionsVersion>
</PropertyGroup>
<ItemGroup>
    <PackageReference Include="Microsoft.NET.Sdk.Functions" Version="1.0.31" />
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

`{Your}Function.cs`

```csharp
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace SnapshotCollectorAzureFunction
{
    public static class ExceptionFunction
    {
        [FunctionName("ExceptionFunction")]
        public static Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            throw new NotImplementedException("Dummy");
        }
    }
}
```

`Host.json`

```json
{
  "version": "2.0",
  "logging": {
    "applicationInsights": {
      "samplingExcludedTypes": "Request",
      "samplingSettings": {
        "isEnabled": true
      },
      "snapshotConfiguration": {
        "isEnabled": true
      }
    }
  }
}
```

## Enable Snapshot Debugger for other clouds

Currently, the only regions that require endpoint modifications are [Azure Government](../../azure-government/compare-azure-government-global-azure.md#application-insights) and [Microsoft Azure operated by 21Vianet](/azure/china/resources-developer-guide).

The following example shows the `host.json` updated with the US Government Cloud agent endpoint:

```json
{
  "version": "2.0",
  "logging": {
    "applicationInsights": {
      "samplingExcludedTypes": "Request",
      "samplingSettings": {
        "isEnabled": true
      },
      "snapshotConfiguration": {
        "isEnabled": true,
        "agentEndpoint": "https://snapshot.monitor.azure.us"
      }
    }
  }
}
```

Here are the supported overrides of the Snapshot Debugger agent endpoint:

|Property    | US Government Cloud | China Cloud |
|---------------|---------------------|-------------|
|AgentEndpoint         | `https://snapshot.monitor.azure.us`    | `https://snapshot.monitor.azure.cn` |

## Disable Snapshot Debugger

To disable Snapshot Debugger in your Functions app, update your `host.json` file by setting the `snapshotConfiguration.isEnabled` property to `false`.

```json
{
  "version": "2.0",
  "logging": {
    "applicationInsights": {
      "snapshotConfiguration": {
        "isEnabled": false
      }
    }
  }
}
```

## Next steps

- [View snapshots](snapshot-debugger-data.md?toc=/azure/azure-monitor/toc.json#access-debug-snapshots-in-the-portal) in the Azure portal.
- Customize Snapshot Debugger configuration based on your use case on your Functions app. For more information, see [Snapshot configuration in host.json](../../azure-functions/functions-host-json.md#applicationinsightssnapshotconfiguration).
- For help with troubleshooting Snapshot Debugger issues, see [Snapshot Debugger troubleshooting](snapshot-debugger-troubleshoot.md).
