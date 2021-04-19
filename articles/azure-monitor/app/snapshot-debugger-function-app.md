---
title: Enable Snapshot Debugger for .NET and .NET Core apps in Azure Functions | Microsoft Docs
description: Enable Snapshot Debugger for .NET and .NET Core apps in Azure Functions
ms.topic: conceptual
author: cweining
ms.author: cweining
ms.date: 12/18/2020
---

# Enable Snapshot Debugger for .NET and .NET Core apps in Azure Functions

Snapshot Debugger currently works for ASP.NET and ASP.NET Core apps that are running on Azure Functions on Windows Service Plans.

We recommend you run your application on the Basic service tier or higher when using Snapshot Debugger.

For most applications, the Free and Shared service tiers don't have enough memory or disk space to save snapshots.

## Prerequisites

* [Enable Application Insights monitoring in your Function App](../../azure-functions/configure-monitoring.md#add-to-an-existing-function-app)

## Enable Snapshot Debugger

If you're running a different type of Azure service, here are instructions for enabling Snapshot Debugger on other supported platforms:
* [Azure App Service](snapshot-debugger-appservice.md?toc=/azure/azure-monitor/toc.json)
* [Azure Cloud Services](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json)
* [Azure Service Fabric services](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json)
* [Azure Virtual Machines and virtual machine scale sets](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json)
* [On-premises virtual or physical machines](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json)

To enable Snapshot Debugger in your Function app, you have to update your `host.json` file by adding the property `snapshotConfiguration` as defined below and redeploy your function.

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

Snapshot Debugger is pre-installed as part of the Azure Functions runtime, which by default it's disabled.

Since Snapshot Debugger it's included in the Azure Functions runtime, it isn't needed to add extra NuGet packages nor application settings.

Just as reference, for a simple Function app (.NET Core), below is how it will look the `.csproj`, `{Your}Function.cs`, and `host.json` after enabled Snapshot Debugger on it.

Project csproj

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

Function class

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

Host file

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

Currently the only regions that require endpoint modifications are [Azure Government](../../azure-government/compare-azure-government-global-azure.md#application-insights) and [Azure China](/azure/china/resources-developer-guide).

Below is an example of the `host.json` updated with the US Government Cloud agent endpoint:
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

Below are the supported overrides of the Snapshot Debugger agent endpoint:

|Property    | US Government Cloud | China Cloud |   
|---------------|---------------------|-------------|
|AgentEndpoint         | `https://snapshot.monitor.azure.us`    | `https://snapshot.monitor.azure.cn` |

## Disable Snapshot Debugger

To disable Snapshot Debugger in your Function app, you just need to update your `host.json` file by setting to `false` the property `snapshotConfiguration.isEnabled`.

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

We recommend you have Snapshot Debugger enabled on all your apps to ease diagnostics of application exceptions.

## Next steps

- Generate traffic to your application that can trigger an exception. Then, wait 10 to 15 minutes for snapshots to be sent to the Application Insights instance.
- [View snapshots](snapshot-debugger.md?toc=/azure/azure-monitor/toc.json#view-snapshots-in-the-portal) in the Azure portal.
- Customize Snapshot Debugger configuration based on your use-case on your Function app. For more info, see [snapshot configuration in host.json](../../azure-functions/functions-host-json.md#applicationinsightssnapshotconfiguration).
- For help with troubleshooting Snapshot Debugger issues, see [Snapshot Debugger troubleshooting](snapshot-debugger-troubleshoot.md?toc=/azure/azure-monitor/toc.json).