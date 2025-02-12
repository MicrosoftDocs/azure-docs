---
title: 'Quickstart: Use MSBuild tasks to convert Bicep files and parameters to JSON' 
description: Learn how to use MSBuild to convert Bicep files to JSON Azure Resource Manager templates.
ms.topic: quickstart
ms.date: 01/10/2025
ms.custom: devx-track-bicep, devx-track-arm-template
#customer intent: As a developer, I want to follow a MSBuild continuous integration pipeline to convert Bicep files to JSON Azure Resource Manager templates (ARM templates).
---

# Quickstart: Use MSBuild tasks to convert Bicep files and parameters to JSON 

In this quickstart, you learn how to use the build system in Visual Studio, [MSBuild](/visualstudio/msbuild/msbuild), to convert Bicep files to JSON Azure Resource Manager templates (ARM templates). You can also use MSBuild with NuGet package version 0.23.x or later to convert [Bicep parameters files](./parameter-files.md?tabs=Bicep) to [Azure Resource Manager parameters files](../templates/parameter-files.md). The examples in this article show how to use the command line with MSBuild and C# project files for the conversion, and these files demonstrate how to use project files in an MSBuild continuous integration pipeline.

## Prerequisites

- Install [Visual Studio](/visualstudio/install/install-visual-studio) or [Visual Studio Code](./install.md#visual-studio-code-and-bicep-extension). The Visual Studio community version is free and installs .NET 6.0, .NET Core 3.1, .NET SDK, MSBuild, .NET Framework 4.8, NuGet package manager, and C# compiler. From the installer, select **Workloads** > **.NET desktop development**. With Visual Studio Code, you need to install [Bicep](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep) and [Azure Resource Manager (ARM) Tools](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools) extensions.
- Install [Azure PowerShell](/powershell/scripting/install/installing-powershell) or a command-line shell for your operating system.

Based on how `nuget.config` is configured in your environment and if nuget.org isn't configured as a package feed, you might need to run the following command:

```powershell
dotnet nuget add source  https://api.nuget.org/v3/index.json -n nuget.org
```

In certain environments, using a single package feed helps to prevent conflicts between packages with the same ID and version but different contents in different feeds. For Azure Artifacts users, [upstream sources](/azure/devops/artifacts/concepts/upstream-sources) can store packages from different sources in one feed.

## MSBuild tasks and Bicep packages

You can use MSBuild tasks and CLI packages along your continuous integration pipeline to convert Bicep files and Bicep parameters files into JSON. This functionality relies on the following NuGet packages:

| Package Name | Description |
| ----  |---- |
| [Azure.Bicep.MSBuild](https://www.nuget.org/packages/Azure.Bicep.MSBuild) | Cross-platform MSBuild task that invokes the Bicep CLI and compiles Bicep files into JSON ARM templates |
| [Azure.Bicep.CommandLine.win-x64](https://www.nuget.org/packages/Azure.Bicep.CommandLine.win-x64) | Bicep CLI for Windows |
| [Azure.Bicep.CommandLine.linux-x64](https://www.nuget.org/packages/Azure.Bicep.CommandLine.linux-x64) | Bicep CLI for Linux |
| [Azure.Bicep.CommandLine.osx-x64](https://www.nuget.org/packages/Azure.Bicep.CommandLine.osx-x64) | Bicep CLI for macOS |

These links show the latest NuGet package version. The following screenshot shows the latest NuGet package version matching the version in the [Bicep CLI](./bicep-cli.md):

:::image type="content" source="./media/msbuild-bicep-file/bicep-nuget-package-version.png" alt-text="Screenshot showing the latest NuGet package version matching the most current version in the Bicep CLI." border="true":::

- **Azure.Bicep.MSBuild**

  When the `Azure.Bicep.MSBuild` package is included in a project file's `PackageReference` property, it imports the Bicep task for invoking the Bicep CLI:
  
  ```xml
  <ItemGroup>
    <PackageReference Include="Azure.Bicep.MSBuild" Version="0.24.24" />
    ...
  </ItemGroup>

  ```
  
  The package transforms the output of the Bicep CLI into MSBuild errors and imports the `BicepCompile` target to streamline how the Bicep task is used. By default, the `BicepCompile` runs after the `Build` target, compiling all @(Bicep) and @(BicepParam) items. Then, it deposits the output in `$(OutputPath)` with the same file name and a `.json` extension.

  The following example shows the project file setting for compiling _main.bicep_ and _main.bicepparam_ files in the same directory as the project file and placing the compiled _main.json_ and _main.parameters.json_ in the `$(OutputPath)` directory.

  ```xml
  <ItemGroup>
    <Bicep Include="main.bicep" />
    <BicepParam Include="main.bicepparam" />
  </ItemGroup>
  ```

  You can override the output path per file using the `OutputFile` metadata on `Bicep` items. The following example recursively finds all _main.bicep_ files and places the compiled `.json` files in `$(OutputPath)` under a subdirectory with the same name in `$(OutputPath)`:

  ```xml
  <ItemGroup>
    <Bicep Include="**\main.bicep" OutputFile="$(OutputPath)\%(RecursiveDir)\%(FileName).json" />
    <BicepParam Include="**\main.bicepparam" OutputFile="$(OutputPath)\%(RecursiveDir)\%(FileName).parameters.json" />
  </ItemGroup>
  ```

  You can create more customizations by setting one of the following properties to the `PropertyGroup` in your project:

  | Property Name | Default Value | Description |
  | ----  |---- | ---- |
  | `BicepCompileAfterTargets` | `Build` | Used as `AfterTargets` value for the `BicepCompile` target. Change the value to override the scheduling of the `BicepCompile` target in your project. |
  | `BicepCompileDependsOn` | None | Used as `DependsOnTargets` value for the `BicepCompile` target. This property can be set to targets on which you want `BicepCompile` target to depend. |
  | `BicepCompileBeforeTargets` | None | Used as `BeforeTargets` value for the `BicepCompile` target. |
  | `BicepOutputPath` | `$(OutputPath)` | Set this property to override the default output path for the compiled ARM template. `OutputFile` metadata on `Bicep` items takes precedence over this value. |

  For the `Azure.Bicep.MSBuild` to operate, it's required to set a `BicepPath` environment variable. See the next bullet item for configuring `BicepPath`.

- **Azure.Bicep.CommandLine**

  The `Azure.Bicep.CommandLine.*` packages are available for Windows, Linux, and macOS. The following example references the package for Windows:

  ```xml
  <ItemGroup>
    <PackageReference Include="Azure.Bicep.CommandLine.win-x64" Version="__LATEST_VERSION__" />
    ...
  </ItemGroup>  
  ```

  When referenced in a project file, the `Azure.Bicep.CommandLine.*` packages automatically set the `BicepPath` property to the full path of the Bicep executable for the platform. The reference to this package can be omitted if the Bicep CLI is installed other ways. For this case, instead of referencing an `Azure.Bicep.Commandline` package, you can either configure an environment variable  called  `BicepPath` or add `BicepPath` to the `PropertyGroup`. For example:

  On Windows:
  
  ```xml
  <PropertyGroup>
    <BicepPath>c:\users\john\.Azure\bin\bicep.exe</BicepPath>
    ...
  </PropertyGroup>
  ```

  On Linux:

  ```xml
  <PropertyGroup>
    <BicepPath>/usr/local/bin/bicep</BicepPath>
    ...
  </PropertyGroup>
  ```

### Project file examples

The following examples show how to configure C# console application project files to convert Bicep files and Bicep parameters files to JSON. The following examples replace `__LATEST_VERSION__` with the latest version of the [Bicep NuGet package](https://www.nuget.org/packages/Azure.Bicep.Core/). See [MSBuild tasks and Bicep packages](#msbuild-tasks-and-bicep-packages) to learn how to find the latest package.

#### SDK-based example

The .NET Core 3.1 and .NET 6 examples are similar. However, .NET 6 uses a different format for the _Program.cs_ file. For more information, see [.NET 6 C# console app template generates top-level statements](/dotnet/core/tutorials/top-level-templates).

<a id="net-6"></a>
- **.NET 6**

  ```xml
  <Project Sdk="Microsoft.NET.Sdk">
    <PropertyGroup>
      <OutputType>Exe</OutputType>
      <TargetFramework>net6.0</TargetFramework>
      <RootNamespace>net6-sdk-project-name</RootNamespace>
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

  The `RootNamespace` property contains a placeholder value. When you create a project file, the value matches your project's name.

<a id="net-core-31"></a>
- **.NET Core 3.1**

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

<a id="notargets-sdk"></a>
#### NoTargets SDK example

The [Microsoft.Build.NoTargets](https://github.com/microsoft/MSBuildSdks/blob/main/src/NoTargets/README.md) MSBuild project SDK allows project tree owners to define projects that don't compile an assembly. This SDK allows the creation of standalone projects that compile only Bicep files.

```xml
<Project Sdk="Microsoft.Build.NoTargets/__LATEST_MICROSOFT.BUILD.NOTARGETS.VERSION__">
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

The latest `Microsoft.Build.NoTargets` version can be found at [Microsoft.Build.NoTargets](https://www.nuget.org/packages/Microsoft.Build.NoTargets). For [Microsoft.Build.NoTargets](/dotnet/core/project-sdk/overview#project-files), specify a version like `Microsoft.Build.NoTargets/3.7.56`.

```xml
<Project Sdk="Microsoft.Build.NoTargets/3.7.56">
  ...
</Project>
```

<a id="classic-framework"></a>
#### Classic framework example

Use the Classic example only if the previous examples don't work for you. In this example, the `ProjectGuid`, `RootNamespace`, and `AssemblyName` properties contain placeholder values. When you create a project file, a unique GUID is created, and the name values match your project's name.

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

These examples show how to use MSBuild to convert a Bicep file and a Bicep parameters file to JSON. Start by creating a project file for .NET, .NET Core 3.1, or the Classic framework. Then, generate a Bicep file and a Bicep parameters file before running MSBuild to convert them to JSON.

### Create project

# [.NET](#tab/dotnet)

To use the .NET CLI to build a project in .NET:

1. Open Visual Studio Code, and select **Terminal** > **New Terminal** to start a PowerShell session.
1. Create a directory named _msBuildDemo_, and go to the directory. This example uses _C:\msBuildDemo_:

    ```powershell
    Set-Location -Path C:\
    New-Item -Name .\msBuildDemo -ItemType Directory
    Set-Location -Path .\msBuildDemo
    ```

1. Run the `dotnet` command to create a new console with the .NET 6 framework:

    ```powershell
    dotnet new console --framework net6.0
    ```

    This command creates a project file with the same name as your directory, _msBuildDemo.csproj_. See [this Create a .NET console application using Visual Studio Code tutorial](/dotnet/core/tutorials/with-visual-studio-code) for more information about how to create a console application from Visual Studio Code.

1. Open _msBuildDemo.csproj_ with an editor, and replace the content with the [.NET 6](#net-6) or [NoTargets SDK](#notargets-sdk) example. Also replace `__LATEST_VERSION__` with the latest version of the Bicep NuGet package.
1. Save the file.

# [.NET Core 3.1](#tab/netcore31)

To use the .NET CLI to build a project in .NET Core 3.1:

1. Open Visual Studio Code, and select **Terminal** > **New Terminal** to start a PowerShell session.
1. Create a directory named _msBuildDemo_, and go to the directory. The following example uses _C:\msBuildDemo_:

    ```powershell
    Set-Location -Path C:\
    New-Item -Name .\msBuildDemo -ItemType Directory
    Set-Location -Path .\msBuildDemo
    ```

1. Run the `dotnet` command to create a new console with the .NET 6 framework:  

    ```powershell
    dotnet new console --framework netcoreapp3.1
    ```

    This command creates a project file with the same name as your directory, _msBuildDemo.csproj_. See [this Create a .NET console application using Visual Studio Code tutorial](/dotnet/core/tutorials/with-visual-studio-code) for more information about how to create a console application from Visual Studio Code.

1. Replace the contents of _msBuildDemo.csproj_ with the [.NET Core 3.1](#net-core-31) or [NoTargets SDK](#notargets-sdk) example.
1. Replace `__LATEST_VERSION__` with the latest version of the Bicep NuGet package.
1. Save the file.

# [Classic framework](#tab/classicframework)

To use the Classic framework to build a project, use Visual Studio to create the project file and dependencies: 

1. Open Visual Studio.
1. Select **Create a new project**.
1. For the C# language, select **Console App (.NET Framework)** and then **Next**.
1. Enter a project name. For this example, use _msBuildDemo_ for the project.
1. Select **Place solution and project in same directory**.
1. Select **.NET Framework 4.8**.
1. Select **Create**.

If you know how to unload and reload a project, you can edit _msBuildDemo.csproj_ in Visual Studio. Otherwise, edit the project file in Visual Studio Code:

1. Open Visual Studio Code, and go to the _msBuildDemo_ directory.
1. Replace _msBuildDemo.csproj_ with the [Classic framework](#classic-framework) code example.
1. Replace `__LATEST_VERSION__` with the most current Bicep NuGet package.
1. Save the file.

---

### Create Bicep file

To create a Bicep file and a BicepParam file before converting them to JSON:

1. Create a _main.bicep_ file in the same folder as the project file; for example: _C:\msBuildDemo_ directory, plus the following content:

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

    resource storageAccount 'Microsoft.Storage/storageAccounts@2023-04-01' = {
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

Run MSBuild to convert the Bicep file and the Bicep parameters file to JSON:

1. Open a Visual Studio Code terminal session.
1. In the PowerShell session, go to the folder that contains the project file. For example, the _C:\msBuildDemo_ directory.
1. Run MSBuild.

    ```powershell
    MSBuild.exe -restore .\msBuildDemo.csproj
    ```

    The `restore` parameter creates dependencies needed to compile the Bicep file during the initial build. The parameter is optional after the initial build.

    To use the .NET Core, run:

    ```powershell
    dotnet build .\msBuildDemo.csproj
    ```

    or

    ```powershell
    dotnet restore .\msBuildDemo.csproj
    ```

1. Go to the output directory, and open the _main.json_ file that should look like the following example.

    MSBuild creates an output directory based on SDK or framework version:

    - .NET 6: _\bin\Debug\net6.0_
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
          "apiVersion": "2023-04-01",
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

1. The _main.parameters.json_ file should look like:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "prefix": {
      "value": "mystore"
    }
  }
}
```

If you make changes or want to rerun the build, delete the output directory so that new files can be created.

## Clean up resources

When you're finished with the files, delete the directory. For this example, delete _C:\msBuildDemo_.

```powershell
Remove-Item -Path "C:\msBuildDemo" -Recurse
```

## Next steps

- For more information about MSBuild, see [MSBuild reference](/visualstudio/msbuild/msbuild-reference) and [.NET project files](/dotnet/core/project-sdk/overview#project-files).
- To learn more about MSBuild properties, items, targets, and tasks, see [MSBuild concepts](/visualstudio/msbuild/msbuild-concepts).
- For more information about the .NET CLI, see [.NET CLI overview](/dotnet/core/tools/).
