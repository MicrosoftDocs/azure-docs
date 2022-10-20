---
title: Migrate apps from Azure Functions version 1.x to 4.x 
description: This article shows you how to upgrade your existing function apps running on version 1.x of the Azure Functions runtime to be able to run on version 4.x of the runtime. 
ms.service: azure-functions
ms.topic: how-to 
ms.date: 10/19/2022
ms.custom: template-how-to-pattern 
---

# Migrate apps from Azure Functions version 1.x to version 4.x 

If you're running on version 1.x of the Azure Functions runtime, it's likely because your C# app requires .NET Framework 2.1. Version 4.x of the runtime now lets you run .NET Framework 4.8 apps. At this point, you should consider migrating your version 1.x function apps to run on version 4.x.   

Migrating a C# function app from version 1.x (.NET Framework 2.1) to version 4.x (.NET Framework 4.8) requires you to make changes to your project code. Many of these changes are a result of changes in the core C# language and .NET APIs. This article guides you through how to update your C# function app project to be able to run on .NET Framework 4.8 in Functions version 4.x.    

>[!NOTE]
>When running on .NET Framework 4.8, C# apps must run in an isolated worker process. For more information, see [Guide for running C# Azure Functions in an isolated process](dotnet-isolated-process-guide.md).

Migrating from version 1.x to version 4.x also can affect bindings. If you're migrating a JavaScript app, proceed directly to [Behavior changes after version 1.x](##behavior-changes-after-version-1x). 

## Prepare the C# project for migration

> [!div class="op_single_selector" title="Tab rendering type: "]
> - [Three tab version](migrate-version-1-version-4.md)
> - [Two tab version](migrate-version-1-version-4-b.md)

The following sections let you compare C# code, project files, and behaviors between versions. This comparison makes it easier for you to prepare your application for migration. 

For comparison, use the tabs to switch between the following .NET runtimes, both of which run on Functions version 4.x: 

+ **.NET Framework 4.8**: migrated C# project code that requires .NET Framework 4.8. 

+ **.NET 7**:  C# project migrated to run on .NET 7 instead of .NET Framework 4.8.  
This migration is recommended when your migrated app no longer requires .NET Framework 4.8 APIs.

When applicable, these tabs compare the code directly from the templates for each version. 

### .csproj file

The following changes are required in the .csproj XML file:

**Version 1.x**

Complete project file for version 1.x:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net48</TargetFramework>
    <AzureFunctionsVersion>v1</AzureFunctionsVersion>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.NET.Sdk.Functions" Version="1.0.24" />
  </ItemGroup>
  <ItemGroup>
    <Reference Include="Microsoft.CSharp" />
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

**Version 4.x**

# [.NET Framework 4.8](#tab/v4)

The following changes are required in the .csproj XML project file: 

1. Change the value of `PropertyGroup`.`AzureFunctionsVersion` to `v4`.

1. Add the following `OutputType` element to the `PropertyGroup`:

    :::code language="xml" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/Company.FunctionApp.csproj" range="5-5":::

1. Replace the existing `ItemGroup`.`PackageReference` list with the following `ItemGroup`:

    :::code language="xml" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/Company.FunctionApp.csproj" range="12-15":::

1. Add the following new `ItemGroup`:

    :::code language="xml" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/Company.FunctionApp.csproj" range="31-33":::

After you make these changes, your updated project should look like the following example:

```xml

<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net48</TargetFramework>
    <AzureFunctionsVersion>v4</AzureFunctionsVersion>
    <OutputType>Exe</OutputType>
    <RootNamespace Condition="'$(name)' != '$(name{-VALUE-FORMS-}safe_namespace)'">Company.FunctionApp</RootNamespace>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.Azure.Functions.Worker" Version="1.8.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Sdk" Version="1.7.0" />
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
  <ItemGroup>
    <Folder Include="Properties\" />
  </ItemGroup>
</Project>
```

# [.NET 7](#tab/net7)

The following changes are required in the .csproj XML project file: 

1. Change the value of `PropertyGroup`.`TargetFramework` to `net7.0`.

1. Change the value of `PropertyGroup`.`AzureFunctionsVersion` to `v4`.

1. Add the following `OutputType` element to the `PropertyGroup`:

    :::code language="xml" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/Company.FunctionApp.csproj" range="5-5":::

1. Replace the existing `ItemGroup`.`PackageReference` list with the following `ItemGroup`:

    :::code language="xml" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/Company.FunctionApp.csproj" range="12-15":::

1. Add the following new `ItemGroup`:

    :::code language="xml" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/Company.FunctionApp.csproj" range="26-28":::

After you make these changes, your updated project should look like the following example:

```xml

<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net7.0</TargetFramework>
    <AzureFunctionsVersion>v4</AzureFunctionsVersion>
    <OutputType>Exe</OutputType>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
    <RootNamespace Condition="'$(name)' != '$(name{-VALUE-FORMS-}safe_namespace)'">Company.FunctionApp</RootNamespace>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.Azure.Functions.Worker" Version="1.8.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Sdk" Version="1.7.0" />
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
  <ItemGroup>
    <Using Include="System.Threading.ExecutionContext" Alias="ExecutionContext"/>
  </ItemGroup>
</Project>
```

---

### program.cs file

**Version 1.x**

Migrating requires you to add a program.cs file to your project.

**Version 4.x**

# [.NET Framework 4.8](#tab/v4)

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/Program.cs" range="2-20":::

# [.NET 7](#tab/net7)

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/Program.cs" range="23-29":::

---

### host.json file

Settings in the host.json file apply at the function app level, both locally and in Azure. For more information, see [Host.json](./functions-host-json.md).

**Version 1.x**

:::code language="json" source="~/functions-quickstart-templates-v1/Functions.Templates/ProjectTemplate/host.json":::

**Version 4.x**

# [.NET Framework 4.8](#tab/v4)

:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/host.json":::

# [.NET 7](#tab/net7)

:::code language="json" source="~/functions-quickstart-templates//Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/host.json":::

---

### local.settings.json file

The local.settings.json file is only used when running locally. For information, see [Local settings file](functions-develop-local.md#local-settings-file).

**Version 1.x**

:::code language="json" source="~/functions-quickstart-templates-v1/Functions.Templates/ProjectTemplate/local.settings.json":::

**Version 4.x**

# [.NET Framework 4.8](#tab/v4)

:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/local.settings.json":::

# [.NET 7](#tab/net7)

:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/local.settings.json":::

---

### Function code

Changes to `using` statements are required in your C# functions (.cs) code files.  

**Version 1.x**

:::code language="csharp" source="~/functions-quickstart-templates-v1/Functions.Templates/Templates/HttpTrigger-CSharp/HttpTriggerCSharp.cs" range="11-13":::

**Version 4.x**

# [.NET Framework 4.8](#tab/v4)

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-CSharp-Isolated/HttpTriggerCSharp.cs" range="2-4":::

# [.NET 7](#tab/net7)

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-CSharp-Isolated/HttpTriggerCSharp.cs" range="2-4":::

---

**Version 1.x**

The following .NET classes you use in your functions changed between versions:

+ `FunctionName` (attribute)
+ `TraceWriter`
+ `HttpRequestMessage`
+ `HttpResonseMessage` 

**Version 4.x**

# [.NET Framework 4.8](#tab/v4)

+ `Function` (attribute)
+ `ILogger`
+ `HttpRequestData`
+ `HttpResonseData` 

# [.NET 7](#tab/net7)

+ `Function` (attribute)
+ `ILogger`
+ `HttpRequestData`
+ `HttpResonseData` 

---

### HTTP trigger template

Most of the code changes between version 1.x and version 4.x can be seen in HTTP triggered functions. You can compare the differences between versions in HTTP trigger templates.

**Version 1.x**

```csharp
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;

namespace Company.Function
{
    public static class HttpTriggerCSharp
    {
        [FunctionName("HttpTriggerCSharp")]
        public static async Task<HttpResponseMessage> 
            Run([HttpTrigger(AuthorizationLevel.AuthLevelValue, "get", "post", 
            Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            log.Info("C# HTTP trigger function processed a request.");

            // parse query parameter
            string name = req.GetQueryNameValuePairs()
                .FirstOrDefault(q => string.Compare(q.Key, "name", true) == 0)
                .Value;
            
            if (name == null)
            {
                // Get request body
                dynamic data = await req.Content.ReadAsAsync<object>();
                name = data?.name;
            }
            
            return name == null
                ? req.CreateResponse(HttpStatusCode.BadRequest, 
                    "Please pass a name on the query string or in the request body")
                : req.CreateResponse(HttpStatusCode.OK, "Hello " + name);
        }
    }
}
```

**Version 4.x**

# [.NET Framework 4.8](#tab/v4)

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-CSharp-Isolated/HttpTriggerCSharp.cs":::

# [.NET 7](#tab/net7)

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-CSharp-Isolated/HttpTriggerCSharp.cs":::

---


## Behavior changes after version 1.x

This section details changes made after version 1.x in both trigger and binding behaviors as well as in core Functions features and behaviors.

## Changes in triggers and bindings

Starting with version 2.x, you must install the extensions for specific triggers and bindings used by the functions in your app. The only exception for this HTTP and timer triggers, which don't require an extension.  For more information, see [Register and install binding extensions](./functions-bindings-register.md).

There are also a few changes in the *function.json* or attributes of the function between versions. For example, the Event Hubs `path` property is now `eventHubName`. See the [existing binding table](functions-versions.md#bindings) for links to documentation for each binding.

## Changes in features and functionality

A few features were removed, updated, or replaced after version 1.x. This section details the changes you see in later versions after having used version 1.x.

In version 2.x, the following changes were made:

* Keys for calling HTTP endpoints are always stored encrypted in Azure Blob storage. In version 1.x, keys were stored in Azure Files by default. When you upgrade an app from version 1.x to version 2.x, existing secrets that are in Azure Files are reset.

* The version 2.x runtime doesn't include built-in support for webhook providers. This change was made to improve performance. You can still use HTTP triggers as endpoints for webhooks.

* The host configuration file (host.json) should be empty or have the string `"version": "2.0"`.

* To improve monitoring, the WebJobs dashboard in the portal, which used the [`AzureWebJobsDashboard`](functions-app-settings.md#azurewebjobsdashboard) setting is replaced with Azure Application Insights, which uses the [`APPINSIGHTS_INSTRUMENTATIONKEY`](functions-app-settings.md#appinsights_instrumentationkey) setting. For more information, see [Monitor Azure Functions](functions-monitoring.md).

* All functions in a function app must share the same language. When you create a function app, you must choose a runtime stack for the app. The runtime stack is specified by the [`FUNCTIONS_WORKER_RUNTIME`](functions-app-settings.md#functions_worker_runtime) value in application settings. This requirement was added to improve footprint and startup time. When developing locally, you must also include this setting in the [local.settings.json file](functions-develop-local.md#local-settings-file).

* The default timeout for functions in an App Service plan is changed to 30 minutes. You can manually change the timeout back to unlimited by using the [functionTimeout](functions-host-json.md#functiontimeout) setting in host.json.

* HTTP concurrency throttles are implemented by default for Consumption plan functions, with a default of 100 concurrent requests per instance. You can change this behavior in the [`maxConcurrentRequests`](functions-host-json.md#http) setting in the host.json file.

* Because of [.NET Core limitations](https://github.com/Azure/azure-functions-host/issues/3414), support for F# script (`.fsx` files) functions has been removed. Compiled F# functions (.fs) are still supported.

* The URL format of Event Grid trigger webhooks has been changed to follow this pattern: `https://{app}/runtime/webhooks/{triggerName}`.


## Next steps

> [!div class="nextstepaction"]
> [Learn more about Functions versions](functions-versions.md)


