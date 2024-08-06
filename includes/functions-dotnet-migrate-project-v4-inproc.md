---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 10/29/2022
ms.author: glenga
---

The following changes are required in the `.csproj` XML project file: 

1. Set the value of `PropertyGroup`.`TargetFramework` to `net8.0`.

1. Set the value of `PropertyGroup`.`AzureFunctionsVersion` to `v4`.

1. Replace the existing `ItemGroup`.`PackageReference` list with the following `ItemGroup`:

    ```xml
    <ItemGroup>
      <PackageReference Include="Microsoft.NET.Sdk.Functions" Version="4.4.0" />
    </ItemGroup>
    ```
    

After you make these changes, your updated project should look like the following example:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <AzureFunctionsVersion>v4</AzureFunctionsVersion>
    <RootNamespace>My.Namespace</RootNamespace>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.NET.Sdk.Functions" Version="4.4.0" />
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