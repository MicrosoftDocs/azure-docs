---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 07/31/2023
ms.author: mahender
---

These steps assume a local C# project, and if your app is instead using C# script (`.csx` files), you should [convert to the project model](../articles/azure-functions/functions-reference-csharp.md#convert-a-c-script-app-to-a-c-project) before continuing.

The following changes are required in the .csproj XML project file: 

1. Set the value of `PropertyGroup`.`TargetFramework` to `net48`.

1. Set the value of `PropertyGroup`.`AzureFunctionsVersion` to `v4`.

1. Add the following `OutputType` element to the `PropertyGroup`:

    :::code language="xml" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/Company.FunctionApp.csproj" range="5-5":::

1. Replace the existing `ItemGroup`.`PackageReference` with the following `ItemGroup`:

    :::code language="xml" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/Company.FunctionApp.csproj" range="12-15":::

1. Add the following new `ItemGroup`:

    :::code language="xml" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/Company.FunctionApp.csproj" range="31-33":::

After you make these changes, your updated project should look like the following example:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net48</TargetFramework>
    <AzureFunctionsVersion>v4</AzureFunctionsVersion>
    <RootNamespace>My.Namespace</RootNamespace>
    <OutputType>Exe</OutputType>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.Azure.Functions.Worker" Version="1.18.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.Http" Version="3.0.13" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Sdk" Version="1.13.0" />
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