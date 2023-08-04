---
title: Migrate .NET function apps from the in-process model to the isolated worker model
description: This article shows you how to upgrade your existing .NET function apps running on the in-process model to the isolated worker model. 
ms.service: azure-functions
ms.custom: devx-track-dotnet
ms.topic: how-to 
ms.date: 08/2/2023
---

# Migrate .NET apps from the in-process model to the isolated worker model

This article walks you through the process of safely migrating your .NET function app from the [in-process model](./functions-dotnet-class-library.md) to the [isolated worker model][isolated-guide]. To learn about the high-level differences between these models, see the [execution mode comparison](./dotnet-isolated-in-process-differences.md).

This guide assumes that your app is running on version 4.x of the Functions runtime. If not, you should instead follow the guides for upgrading your host version:

- [Migrate apps from Azure Functions version 2.x and 3.x to version 4.x](./migrate-version-3-version-4.md)
- [Migrate apps from Azure Functions version 1.x to version 4.x](./migrate-version-1-version-4.md)

These host version migration guides will also help you migrate to the isolated worker model as you work through them.

## Identify function apps to upgrade

Use the following PowerShell script to generate a list of function apps in your subscription that currently use the in-process model:

```powershell
$Subscription = '<YOUR SUBSCRIPTION ID>' 
 
Set-AzContext -Subscription $Subscription | Out-Null

$FunctionApps = Get-AzFunctionApp

$AppInfo = @{}

foreach ($App in $FunctionApps)
{
     if ($App.ApplicationSettings["FUNCTIONS_WORKER_RUNTIME"] -eq 'dotnet')
     {
          $AppInfo.Add($App.Name, $App.ApplicationSettings["FUNCTIONS_WORKER_RUNTIME"])
     }
}

$AppInfo
```

## Choose your target .NET version

On version 4.x of the Functions runtime, your .NET function app targets .NET 6 when using the in-process model.

[!INCLUDE [functions-dotnet-migrate-v4-versions](../../includes/functions-dotnet-migrate-v4-versions.md)]

> [!TIP]
> **We recommend upgrading to .NET 6 on the isolated worker model.** This provides a quick upgrade path with the longest support window from .NET.

## Prepare for migration

If you haven't already, identify the list of apps that need to be migrated in your current Azure Subscription by using the [Azure PowerShell](#identify-function-apps-to-upgrade).

Before you upgrade an app to the isolated worker model, you should thoroughly review the contents of this guide and familiarize yourself with the features of the [isolated worker model][isolated-guide].

To upgrade the application, you will:

1. Complete the steps in [Upgrade your local project](#upgrade-your-local-project) to migrate your local project to the isolated worker model.
1. After migrating your project, fully test the app locally using version 4.x of the [Azure Functions Core Tools](functions-run-local.md). 
1. [Upgrade your function app in Azure](#upgrade-your-function-app-in-azure) to the isolated model.

## Upgrade your local project

The section outlines the various changes that you need to make to your local project to move it to the isolated worker model. Some of the steps change based on your target version of .NET. Use the tabs to select the instructions which match your desired version.

> [!TIP]
> The [.NET Upgrade Assistant] can be used to automatically make many of the changes mentioned in the following sections.

### .csproj file

The following example is a .csproj project file that uses .NET 6 on version 4.x:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net6.0</TargetFramework>
    <AzureFunctionsVersion>v4</AzureFunctionsVersion>
    <RootNamespace>My.Namespace</RootNamespace>
  </PropertyGroup>
  <ItemGroup>
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

Use one of the following procedures to update this XML file to run in the isolated worker model:

# [.NET 6](#tab/net6-isolated)

[!INCLUDE [functions-dotnet-migrate-project-v4-isolated](../../includes/functions-dotnet-migrate-project-v4-isolated.md)]

# [.NET 7](#tab/net7)

[!INCLUDE [functions-dotnet-migrate-project-v4-isolated-2](../../includes/functions-dotnet-migrate-project-v4-isolated-2.md)]

# [.NET Framework 4.8](#tab/v4)

[!INCLUDE [functions-dotnet-migrate-project-v4-isolated-net-framework](../../includes/functions-dotnet-migrate-project-v4-isolated-net-framework.md)]

---

### Package and namespace changes

 When migrating to the isolated worker model, you need to change the packages your application references. Then you need to update the namespace of using statements and some types you reference. You can see the effect of these namespace changes on `using` statements in the [HTTP trigger template examples](#http-trigger-template) section later in this article.

[!INCLUDE [functions-dotnet-migrate-packages-v4-isolated](../../includes/functions-dotnet-migrate-packages-v4-isolated.md)]

### Program.cs file

When migrating to run in an isolated worker process, you must add the following program.cs file to your project:

# [.NET 6](#tab/net6-isolated)

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/Program.cs" range="23-29":::

# [.NET 7](#tab/net7)

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/Program.cs" range="23-29":::

# [.NET Framework 4.8](#tab/v4)

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/Program.cs" range="2-20":::

---

### local.settings.json file

The local.settings.json file is only used when running locally. For information, see [Local settings file](functions-develop-local.md#local-settings-file). 

When migrating from running in-process to running in an isolated worker process, you need to change the `FUNCTIONS_WORKER_RUNTIME` value to "dotnet-isolated". Make sure that your local.settings.json file has at least the following elements:

:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/local.settings.json":::

### Class name changes

Some key classes change between the in-process model and the isolated worker model. The following table indicates key .NET classes used by Functions that change when migrating:

| In-process model  | Isolated worker model| 
| --- | --- | --- | 
| `FunctionName` (attribute) |  `Function` (attribute) | 
| `ILogger` |  `ILogger`, `ILogger<T>` |
| `HttpRequest` |  `HttpRequestData`, `HttpRequest` (using [ASP.NET Core integration])|
| `IActionResult` |  `HttpResponseData`, `IActionResult` (using [ASP.NET Core integration])|
| `FunctionsStartup` (attribute) | Uses [`Program.cs`](#programcs-file) instead | 

[ASP.NET Core integration]: ./dotnet-isolated-process-guide.md#aspnet-core-integration-preview

There might also be class name differences in bindings. For more information, see the reference articles for the specific bindings.

### HTTP trigger template

The differences between in-process and isolated worker process can be seen in HTTP triggered functions. The HTTP trigger template for the in-process model looks like the following example:

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-CSharp/HttpTriggerCSharp.cs":::

The HTTP trigger template for the migrated version looks like the following example:

# [.NET 6](#tab/net6-isolated)

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-CSharp-Isolated/HttpTriggerCSharp.cs":::

You can also leverage [ASP.NET Core integration] to instead have the function look more like the following example:

```csharp
[Function("HttpFunction")]
public IActionResult Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req)
{
    return new OkObjectResult($"Welcome to Azure Functions, {req.Query["name"]}!");
}
```

# [.NET 7](#tab/net7)

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-CSharp-Isolated/HttpTriggerCSharp.cs":::

You can also leverage [ASP.NET Core integration] to instead have the function look more like the following example:

```csharp
[Function("HttpFunction")]
public IActionResult Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req)
{
    return new OkObjectResult($"Welcome to Azure Functions, {req.Query["name"]}!");
}
```

# [.NET Framework 4.8](#tab/v4)

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-CSharp-Isolated/HttpTriggerCSharp.cs":::

---

## Upgrade your function app in Azure

Upgrading your function app to the isolated model consists of two steps:

1. Change the configuration of the function app to use the isolated model by setting the `FUNCTIONS_WORKER_RUNTIME` application setting to "dotnet-isolated". Make sure that any deployment automation is similarly updated.
2. Publish your upgraded project to the upgraded function app. 

When you use Visual Studio to publish an isolated worker model project to an existing function app that uses the in-process model, you're prompted to let Visual Studio upgrade the function app during deployment. This accomplishes both steps at once.

If you need to minimize downtime, consider using a [staging slot](functions-deployment-slots.md) to test and verify your upgraded code with your upgraded configuration in Azure. You can then deploy your upgraded app to the production slot through a swap operation.

Once you've completed these steps, your app has been fully migrated to the isolated model. Congratulations! Repeat the steps from this guide as necessary for [any other apps needing migration](#identify-function-apps-to-upgrade).

## Next steps

> [!div class="nextstepaction"]
> [Learn more about the isolated worker model][isolated-guide]

[isolated-guide]: ./dotnet-isolated-process-guide.md
[.NET Upgrade Assistant]: /dotnet/core/porting/upgrade-assistant-overview
