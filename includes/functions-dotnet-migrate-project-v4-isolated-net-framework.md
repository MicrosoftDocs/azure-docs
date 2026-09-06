---
ms.service: azure-functions
ms.custom:
  - ignite-2023
ms.topic: include
ms.date: 08/26/2026
---

These steps assume a local C# project; if your app instead uses C# script (*.csx* files), you should [convert to the project model](../articles/azure-functions/functions-reference-csharp.md#convert-a-c-script-app-to-a-c-project) before continuing.

Make the following changes in the *.csproj* XML project file:

1. Set the `Sdk` attribute on the `Project` element to `Azure.Functions.Sdk/1.0.0`.

1. Set the value of `PropertyGroup`.`TargetFramework` to `net48`.

1. In the `ItemGroup`.`PackageReference` list, replace the package reference to `Microsoft.NET.Sdk.Functions` with the following references. Keep the `Microsoft.Azure.Functions.Worker` package as an explicit reference:

    ```xml
    <PackageReference Include="Microsoft.Azure.Functions.Worker" Version="1.21.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.Http" Version="3.1.0" />
    <PackageReference Include="Microsoft.ApplicationInsights.WorkerService" Version="2.22.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.ApplicationInsights" Version="1.2.0" />
    ```

    Make note of any references to other packages in the `Microsoft.Azure.WebJobs.*` namespaces. You'll replace these packages in a later step.

1. Add the following new `ItemGroup`:

    ```xml
    <ItemGroup>
      <Folder Include="Properties\" />
    </ItemGroup>
    ```

After you make these changes, your updated project should look like the following example:

```xml
<Project Sdk="Azure.Functions.Sdk/1.0.0">
  <PropertyGroup>
    <TargetFramework>net48</TargetFramework>
    <RootNamespace>My.Namespace</RootNamespace>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.Azure.Functions.Worker" Version="1.21.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.Http" Version="3.1.0" />
    <PackageReference Include="Microsoft.ApplicationInsights.WorkerService" Version="2.22.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.ApplicationInsights" Version="1.2.0" />
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
    <Folder Include="Properties\" />
  </ItemGroup>
</Project>
```
