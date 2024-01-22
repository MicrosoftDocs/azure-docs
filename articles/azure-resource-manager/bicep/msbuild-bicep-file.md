---
title: Use MSBuild to convert Bicep to JSON
description: Use MSBuild to convert a Bicep file to Azure Resource Manager template (ARM template) JSON.
ms.date: 01/19/2024
ms.topic: quickstart
ms.custom: devx-track-bicep, devx-track-arm-template

# Customer intent: As a developer I want to convert Bicep files to Azure Resource Manager template (ARM template) JSON in an MSBuild pipeline.
---

# Quickstart: Use MSBuild to convert Bicep to JSON

Learn the process of utilizing MSBuild for the conversion of Bicep files to Azure Resource Manager JSON templates (ARM templates). Additionally, MSBuild can be employed for the conversion of [Bicep parameter files](./parameter-files.md?tabs=Bicep) to [Azure Resource Manager parameter files](../templates/parameter-files.md). The provided examples demonstrate the use of MSBuild from the command line with C# project files for the conversion. These project files serve as examples that can be utilized in an MSBuild continuous integration (CI) pipeline.

## Prerequisites

You'll need the latest versions of the following software:

- [Visual Studio](/visualstudio/install/install-visual-studio). The free community version will install .NET 8.0, .NET Core 3.1, .NET SDK, MSBuild, .NET Framework 4.8, NuGet package manager, and C# compiler. From the installer, select **Workloads** > **.NET desktop development**.
- [Visual Studio Code](https://code.visualstudio.com/) with the extensions for [Bicep](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep) and [Azure Resource Manager (ARM) Tools](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools).
- [PowerShell](/powershell/scripting/install/installing-powershell) or a command-line shell for your operating system.

## MSBuild tasks and CLI packages

If your existing continuous integration (CI) pipeline relies on [MSBuild](/visualstudio/msbuild/msbuild), you can use MSBuild tasks and CLI packages to convert Bicep files into ARM JSON templates, and Bicep parameter files to ARM parameter files. 

The functionality relies on the following [NuGet packages](https://www.nuget.org/packages/Azure.Bicep.Core/). To convert Bicep parameter files, you need version 0.23.x or later. The latest NuGet package versions match the latest Bicep CLI version. 

| Package Name | Description |
| ----  |---- |
| [Azure.Bicep.MSBuild](https://www.nuget.org/packages/Azure.Bicep.MSBuild) | Cross-platform MSBuild task that invokes the Bicep CLI and compiles Bicep files into ARM JSON templates. |
| [Azure.Bicep.CommandLine.win-x64](https://www.nuget.org/packages/Azure.Bicep.CommandLine.win-x64) | Bicep CLI for Windows. |
| [Azure.Bicep.CommandLine.linux-x64](https://www.nuget.org/packages/Azure.Bicep.CommandLine.linux-x64) | Bicep CLI for Linux. |
| [Azure.Bicep.CommandLine.osx-x64](https://www.nuget.org/packages/Azure.Bicep.CommandLine.osx-x64) | Bicep CLI for macOS. |

### Azure.Bicep.MSBuild package

When included in a project file's `PackageReference`, the `Azure.Bicep.MSBuild package` imports in the `Bicep` task, used for invoking the Bicep CLI. The package transforms its output into MSBuild errors and the `BicepCompile` target to streamline the usage of the `Bicep` task. By default, the `BicepCompile` runs after the `Build` target, compiling all @(Bicep) items and @(BicepParam) items. It then deposits the output in `$(OutputPath)` with the same filename and a _.json_ extension.

The following example compiles _main.bicep_ and _main.bicepparam_ files in the same directory as the project file and places the compiled _main.json_ and _main.parameters.json_ in the `$(OutputPath)` directory.

```xml
<ItemGroup>
  <Bicep Include="main.bicep" />
  <BicepParam Include="main.bicepparam" />
</ItemGroup>
```

You can override the output path per file using the `OutputFile` metadata on `Bicep` items. The following example will recursively find all _main.bicep_ files and place the compiled _.json_ files in `$(OutputPath)` under a subdirectory with the same name in `$(OutputPath)`:

```xml
<ItemGroup>
  <Bicep Include="**\main.bicep" OutputFile="$(OutputPath)\%(RecursiveDir)\%(FileName).json" />
  <BicepParam Include="**\main.bicepparam" OutputFile="$(OutputPath)\%(RecursiveDir)\%(FileName).parameters.json" />
</ItemGroup>
```

More customizations can be performed by setting one of the following properties in your project:

| Property Name | Default Value | Description |
| ----  |---- | ---- |
| `BicepCompileAfterTargets` | `Build` | Used as `AfterTargets` value for the `BicepCompile` target. Change the value to override the scheduling of the `BicepCompile` target in your project. |
| `BicepCompileDependsOn` | None | Used as `DependsOnTargets` value for the `BicepCompile` target. This property can be set to targets that you want `BicepCompile` target to depend on. |
| `BicepCompileBeforeTargets` | None | Used as `BeforeTargets` value for the `BicepCompile` target. |
| `BicepOutputPath` | `$(OutputPath)` | Set this property to override the default output path for the compiled ARM template. `OutputFile` metadata on `Bicep` items takes precedence over this value. |

The `Azure.Bicep.MSBuild` requires the `BicepPath` property to be set either in order to function. You may set it by referencing the appropriate `Azure.Bicep.CommandLine.*` package for your operating system or manually by installing the Bicep CLI and setting the `BicepPath` environment variable or MSBuild property.

### Azure.Bicep.CommandLine packages

The `Azure.Bicep.CommandLine.*` packages are available for Windows, Linux, and macOS. When referenced in a project file via a `PackageReference`, the `Azure.Bicep.CommandLine.*` packages set the `BicepPath` property to the full path of the Bicep executable for the platform. The reference to this package may be omitted if Bicep CLI is installed through other means and the `BicepPath` environment variable or MSBuild property are set accordingly.

## SDK-based examples

The following examples contain a default Console App SDK-based C# project file that was modified to convert Bicep files into ARM templates, and Bicep parameter files to ARM parameter files. Replace `__LATEST_VERSION__` with the latest version of the [Bicep NuGet packages](https://www.nuget.org/packages/Azure.Bicep.Core/).

The .NET Core 3.1 and .NET 8 examples are similar. But .NET 8 uses a different format for the _Program.cs_ file. For more information, see [.NET 6 C# console app template generates top-level statements](/dotnet/core/tutorials/top-level-templates).

### .NET 8

In this example, the `RootNamespace` property contains a placeholder value. When you create a project file, the value matches your project's name.

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <RootNamespace>net8-sdk-project-name</RootNamespace>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Azure.Bicep.CommandLine.win-x64" Version="__LATEST_VERSION__" />
    <PackageReference Include="Azure.Bicep.MSBuild" Version="__LATEST_VERSION__" />
  </ItemGroup>

  <ItemGroup>
    <Bicep Include="**\main.bicep" OutputFile="$(OutputPath)\%(RecursiveDir)\%(FileName).json" />
    <BicepParam Include="**\main.bicepparam" OutputFile="$(OutputPath)\%(RecursiveDir)\%(FileName).parameters.json" />
  </ItemGroup>
</Project>
```

### .NET Core 3.1

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>netcoreapp3.1</TargetFramework>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Azure.Bicep.CommandLine.win-x64" Version="__LATEST_VERSION__" />
    <PackageReference Include="Azure.Bicep.MSBuild" Version="__LATEST_VERSION__" />
  </ItemGroup>

  <ItemGroup>
    <Bicep Include="**\main.bicep" OutputFile="$(OutputPath)\%(RecursiveDir)\%(FileName).json" />
    <BicepParam Include="**\main.bicepparam" OutputFile="$(OutputPath)\%(RecursiveDir)\%(FileName).parameters.json" />
  </ItemGroup>
</Project>
```

### NoTargets SDK

The following example contains a project that converts Bicep files into ARM templates and Bicep parameter files into ARM parameter files using [Microsoft.Build.NoTargets](https://www.nuget.org/packages/Microsoft.Build.NoTargets). This SDK allows creation of standalone projects that compile only Bicep files. Replace `__LATEST_VERSION__` with the latest version of the Bicep NuGet packages.

For [Microsoft.Build.NoTargets](/dotnet/core/project-sdk/overview#project-files), specify a version like `Microsoft.Build.NoTargets/3.5.6`.

```xml
<Project Sdk="Microsoft.Build.NoTargets/__LATEST_VERSION__">
  <PropertyGroup>
    <TargetFramework>net48</TargetFramework>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Azure.Bicep.CommandLine.win-x64" Version="__LATEST_VERSION__" />
    <PackageReference Include="Azure.Bicep.MSBuild" Version="__LATEST_VERSION__" />
  </ItemGroup>

  <ItemGroup>
    <Bicep Include="main.bicep"/>
    <BicepParam Include="main.bicepparam"/>
  </ItemGroup>
</Project>
```

### Classic framework

The following example converts Bicep to JSON inside a classic project file that's not SDK-based. Only use the classic example if the previous examples don't work for you. Replace `__LATEST_VERSION__` with the latest version of the Bicep NuGet packages.

In this example, the `ProjectGuid`, `RootNamespace` and `AssemblyName` properties contain placeholder values. When you create a project file, a unique GUID is created, and the name values match your project's name.

```xml
<?xml version="1.0" encoding="utf-8"?>
<Project ToolsVersion="15.0" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  <Import Project="$(MSBuildExtensionsPath)\$(MSBuildToolsVersion)\Microsoft.Common.props" Condition="Exists('$(MSBuildExtensionsPath)\$(MSBuildToolsVersion)\Microsoft.Common.props')" />
  <PropertyGroup>
    <Configuration Condition=" '$(Configuration)' == '' ">Debug</Configuration>
    <Platform Condition=" '$(Platform)' == '' ">AnyCPU</Platform>
    <ProjectGuid>{11111111-1111-1111-1111-111111111111}</ProjectGuid>
    <OutputType>Exe</OutputType>
    <RootNamespace>ClassicFramework</RootNamespace>
    <AssemblyName>ClassicFramework</AssemblyName>
    <TargetFrameworkVersion>v4.8</TargetFrameworkVersion>
    <FileAlignment>512</FileAlignment>
    <AutoGenerateBindingRedirects>true</AutoGenerateBindingRedirects>
    <Deterministic>true</Deterministic>
  </PropertyGroup>
  <PropertyGroup Condition=" '$(Configuration)|$(Platform)' == 'Debug|AnyCPU' ">
    <PlatformTarget>AnyCPU</PlatformTarget>
    <DebugSymbols>true</DebugSymbols>
    <DebugType>full</DebugType>
    <Optimize>false</Optimize>
    <OutputPath>bin\Debug\</OutputPath>
    <DefineConstants>DEBUG;TRACE</DefineConstants>
    <ErrorReport>prompt</ErrorReport>
    <WarningLevel>4</WarningLevel>
  </PropertyGroup>
  <PropertyGroup Condition=" '$(Configuration)|$(Platform)' == 'Release|AnyCPU' ">
    <PlatformTarget>AnyCPU</PlatformTarget>
    <DebugType>pdbonly</DebugType>
    <Optimize>true</Optimize>
    <OutputPath>bin\Release\</OutputPath>
    <DefineConstants>TRACE</DefineConstants>
    <ErrorReport>prompt</ErrorReport>
    <WarningLevel>4</WarningLevel>
  </PropertyGroup>
  <ItemGroup>
    <Reference Include="System" />
    <Reference Include="System.Core" />
    <Reference Include="System.Xml.Linq" />
    <Reference Include="System.Data.DataSetExtensions" />
    <Reference Include="Microsoft.CSharp" />
    <Reference Include="System.Data" />
    <Reference Include="System.Net.Http" />
    <Reference Include="System.Xml" />
  </ItemGroup>
  <ItemGroup>
    <Compile Include="Program.cs" />
    <Compile Include="Properties\AssemblyInfo.cs" />
  </ItemGroup>
  <ItemGroup>
    <None Include="App.config" />
    <Bicep Include="main.bicep" />
    <BicepParam Include="main.bicepparam" />
  </ItemGroup>
  <ItemGroup>
    <PackageReference Include="Azure.Bicep.CommandLine.win-x64">
      <Version>__LATEST_VERSION__</Version>
    </PackageReference>
    <PackageReference Include="Azure.Bicep.MSBuild">
      <Version>__LATEST_VERSION__</Version>
    </PackageReference>
  </ItemGroup>
  <Import Project="$(MSBuildToolsPath)\Microsoft.CSharp.targets" />
</Project>
```

## Convert Bicep to JSON

These examples demonstrate the conversion of a Bicep file and a Bicep parameter file to JSON using MSBuild. Start by creating a project file for .NET, .NET Core 3.1, or the Classic framework. Then, generate the Bicep file and the Bicep parameter file before running MSBuild.

# [.NET](#tab/dotnet)

Build a project in .NET with the dotnet CLI.

1. Open Visual Studio code and select **Terminal** > **New Terminal** to start a PowerShell session.
1. Create a directory named _msBuildDemo_ and go to the directory. This example uses _C:\msBuildDemo_.

    ```powershell
    New-Item -Name .\msBuildDemo -ItemType Directory
    Set-Location -Path .\msBuildDemo
    ```
1. Run the `dotnet` command to create a new console with the .NET 8 framework.

    ```powershell
    dotnet new console --framework net8.0
    ```

    The command creates a project file using the same name as your directory, _msBuildDemo.csproj_. For more information about how to create a console application from Visual Studio Code, see the [tutorial](/dotnet/core/tutorials/with-visual-studio-code).

1. Open _msBuildDemo.csproj_ with an editor, and replace the content with the [.NET 8](#net-8) or [NoTargets SDK](#notargets-sdk) examples, and also replace `__LATEST_VERSION__` with the latest version of the Bicep NuGet packages.

# [.NET Core 3.1](#tab/netcore31)

Build a project in .NET Core 3.1 using the dotnet CLI.

1. Open Visual Studio code and select **Terminal** > **New Terminal** to start a PowerShell session.
1. Create a directory named _msBuildDemo_ and go to the directory. This example uses _C:\msBuildDemo_.

    ```powershell
    New-Item -Name .\msBuildDemo -ItemType Directory
    Set-Location -Path .\msBuildDemo
    ```
1. Run the `dotnet` command to create a new console with the .NET 8 framework.   ***jgao: typo

    ```powershell
    dotnet new console --framework netcoreapp3.1
    ```

    The project file is named the same as your directory, _msBuildDemo.csproj_. For more information about how to create a console application from Visual Studio Code, see the [tutorial](/dotnet/core/tutorials/with-visual-studio-code).

1. Replace the contents of _msBuildDemo.csproj_ with the [.NET Core 3.1](#net-core-31) or [NoTargets SDK](#notargets-sdk) examples.
1. Replace `__LATEST_VERSION__` with the latest version of the Bicep NuGet packages.
1. Save the file.

# [Classic framework](#tab/classicframework)

Build a project using the classic framework.

To create the project file and dependencies, use Visual Studio.

1. Open Visual Studio.
1. Select **Create a new project**.
1. For the C# language, select **Console App (.NET Framework)** and select **Next**.
1. Enter a project name. For this example, use _msBuildDemo_ for the project.
1. Select **Place solution and project in same directory**.
1. Select **.NET Framework 4.8**.
1. Select **Create**.

If you know how to unload a project and reload a project, you can edit _msBuildDemo.csproj_ in Visual Studio.

Otherwise, edit the project file in Visual Studio Code.

1. Open Visual Studio Code and go to the _msBuildDemo_ directory.
1. Replace _msBuildDemo.csproj_ with the [Classic framework](#classic-framework) code sample.
1. Replace `__LATEST_VERSION__` with the latest version of the Bicep NuGet packages.
1. Save the file.

---

### Create Bicep file

You'll need a Bicep file and a BicepParam file that will be converted to JSON.

1. Create a _main.bicep_ file in the _C:\msBuildDemo_ directory with the following content:

    ```bicep
    @allowed([
      'Premium_LRS'
      'Premium_ZRS'
      'Standard_GRS'
      'Standard_GZRS'
      'Standard_LRS'
      'Standard_RAGRS'
      'Standard_RAGZRS'
      'Standard_ZRS'
    ])
    @description('Storage account type.')
    param storageAccountType string = 'Standard_LRS'

    @description('Location for all resources.')
    param location string = resourceGroup().location

    var storageAccountName = 'storage${uniqueString(resourceGroup().id)}'

    resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
      name: storageAccountName
      location: location
      sku: {
        name: storageAccountType
      }
      kind: 'StorageV2'
    }

    output storageAccountNameOutput string = storageAccount.name
    ```

1. Create a _main.bicepparam_ file in the _C:\msBuildDemo_ directory with the following content:

    ```bicep
    using './main.bicep'

    param prefix = '{prefix}'
    ```

    Replace `{prefix}` with a string value used as a prefix for the storage account name.


### Run MSBuild

Run MSBuild to convert the Bicep file and the Bicep parameter file to JSON.

1. Open a Visual Studio Code terminal session.
1. In the PowerShell session, go to the _C:\msBuildDemo_ directory.
1. Run MSBuild.

    ```powershell
    MSBuild.exe -restore .\msBuildDemo.csproj
    ```

    The `restore` parameter creates dependencies needed to compile the Bicep file during the initial build. The parameter is optional after the initial build.

1. Go to the output directory and open the _main.json_ file that should look like the sample.

    MSBuild creates an output directory based on the SDK or framework version:

    - .NET 8: _\bin\Debug\net8.0_
    - .NET Core 3.1: _\bin\Debug\netcoreapp3.1_
    - NoTargets SDK: _\bin\Debug\net48_
    - Classic framework: _\bin\Debug_

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "metadata": {
        "_generator": {
          "name": "bicep",
          "version": "0.8.9.13224",
          "templateHash": "12345678901234567890"
        }
      },
      "parameters": {
        "storageAccountType": {
          "type": "string",
          "defaultValue": "Standard_LRS",
          "metadata": {
            "description": "Storage account type."
          },
          "allowedValues": [
            "Premium_LRS",
            "Premium_ZRS",
            "Standard_GRS",
            "Standard_GZRS",
            "Standard_LRS",
            "Standard_RAGRS",
            "Standard_RAGZRS",
            "Standard_ZRS"
          ]
        },
        "location": {
          "type": "string",
          "defaultValue": "[resourceGroup().location]",
          "metadata": {
            "description": "Location for all resources."
          }
        }
      },
      "variables": {
        "storageAccountName": "[format('storage{0}', uniqueString(resourceGroup().id))]"
      },
      "resources": [
        {
          "type": "Microsoft.Storage/storageAccounts",
          "apiVersion": "2022-05-01",
          "name": "[variables('storageAccountName')]",
          "location": "[parameters('location')]",
          "sku": {
            "name": "[parameters('storageAccountType')]"
          },
          "kind": "StorageV2"
        }
      ],
      "outputs": {
        "storageAccountNameOutput": {
          "type": "string",
          "value": "[variables('storageAccountName')]"
        }
      }
    }
    ```

If you make changes or want to rerun the build, delete the output directory so new files can be created.

## Clean up resources

When you're finished with the files, delete the directory. For this example, delete _C:\msBuildDemo_.

```powershell
Remove-Item -Path "C:\msBuildDemo" -Recurse
```

## Next steps

- For more information about MSBuild, see [MSBuild reference](/visualstudio/msbuild/msbuild-reference) and [.NET project files](/dotnet/core/project-sdk/overview#project-files).
- To learn more about MSBuild properties, items, targets, and tasks, see [MSBuild concepts](/visualstudio/msbuild/msbuild-concepts).
- For more information about the .NET CLI, see [.NET CLI overview](/dotnet/core/tools/).
