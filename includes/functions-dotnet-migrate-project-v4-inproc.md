---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 10/29/2022
ms.author: glenga
---

The following changes are required in the .csproj XML project file: 

1. Set the value of `PropertyGroup`.`TargetFramework` to `net6.0`.

1. Set the value of `PropertyGroup`.`AzureFunctionsVersion` to `v4`.

1. Replace the existing `ItemGroup`.`PackageReference` list with the following `ItemGroup`:

    :::code language="xml" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp/Company.FunctionApp.csproj" range="7-9":::

After you make these changes, your updated project should look like the following example:

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