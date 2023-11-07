---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 10/29/2022
ms.author: glenga
---

These steps assume a local C# project, and if your app is instead using C# script (`.csx` files), you should [convert to the project model](../articles/azure-functions/functions-reference-csharp.md#convert-a-c-script-app-to-a-c-project) before continuing.

The following changes are required in the `.csproj` XML project file: 

1. Set the value of `PropertyGroup`.`TargetFramework` to `net7.0`.

1. Set the value of `PropertyGroup`.`AzureFunctionsVersion` to `v4`.

1. Add the following `OutputType` element to the `PropertyGroup`:

    ```xml
    <OutputType>Exe</OutputType>
    ```

1. In the `ItemGroup`.`PackageReference` list, replace the package reference to `Microsoft.NET.Sdk.Functions` with the following references:

    ```xml
      <FrameworkReference Include="Microsoft.AspNetCore.App" />
      <PackageReference Include="Microsoft.Azure.Functions.Worker" Version="1.19.0" />
      <PackageReference Include="Microsoft.Azure.Functions.Worker.Sdk" Version="1.15.1" />
      <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore" Version="1.0.0" />
      <PackageReference Include="Microsoft.ApplicationInsights.WorkerService" Version="2.21.0" />
      <PackageReference Include="Microsoft.Azure.Functions.Worker.ApplicationInsights" Version="1.0.0" />
    ```

    Make note of any references to other packages in the `Microsoft.Azure.WebJobs.*` namespaces. You'll replace these packages in a later step.

1. Add the following new `ItemGroup`:

    ```xml
    <ItemGroup>
      <Using Include="System.Threading.ExecutionContext" Alias="ExecutionContext"/>
    </ItemGroup>
    ```

After you make these changes, your updated project should look like the following example:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net7.0</TargetFramework>
    <AzureFunctionsVersion>v4</AzureFunctionsVersion>
    <RootNamespace>My.Namespace</RootNamespace>
    <OutputType>Exe</OutputType>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>
  <ItemGroup>
    <FrameworkReference Include="Microsoft.AspNetCore.App" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker" Version="1.19.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Sdk" Version="1.15.1" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore" Version="1.0.0" />
    <PackageReference Include="Microsoft.ApplicationInsights.WorkerService" Version="2.21.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.ApplicationInsights" Version="1.0.0" />
    <!-- Other packages may also be in this list -->
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
