---
title: Supported languages and runtimes in Azure Static Web Apps
description: Supported languages and runtimes in Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: conceptual
ms.date: 08/30/2022
ms.author: cshoe
---

# Supported languages and runtimes in Azure Static Web Apps

Azure Static Web Apps features two different places where runtime and language versions are important, on the front end and for the API.

| Runtime type | Description |
|--|--|
| [Front end](#front-end) | The version responsible for running the website's build steps that build the front end application. |
| [API](#api) | The version and runtime of Azure Functions used in your web application. |

## Front end

You can specify the version used to build the front end of your static web app. Configuring a non-default version is often only necessary if you need to target older versions.

You can specify the runtime version that builds the front end of your static web app in the _package.json_ file in the `engines` section of the file.

```json
{
  ...
  "engines": {
   "node": ">=14.0.0"
  }
}
```

## API

The APIs in Azure Static Web Apps are supported by Azure Functions. Refer to the [Azure Functions supported languages and runtimes](/azure/azure-functions/supported-languages) for details.

The following versions are supported for managed functions in Static Web Apps. If your application requires a version not listed, considering [bringing your own functions](./functions-bring-your-own.md).

To configure the API language runtime version, set the `apiRuntime` property in the `platform` section to one of the following supported values.

| Language runtime version | Operating system | Azure Functions version | `apiRuntime` value | End of support date |
|--|--|--|--|--|
| .NET Core 3.1 | Windows | 3.x | `dotnet:3.1` | December 3, 2022 |
| .NET 6.0 in-process | Windows | 4.x | `dotnet:6.0` | - |
| .NET 6.0 isolated | Windows | 4.x | `dotnet-isolated:6.0` | - |
| Node.js 12.x | Linux | 3.x | `node:12` | December 3, 2022 |
| Node.js 14.x | Linux | 4.x | `node:14` | - |
| Node.js 16.x | Linux | 4.x | `node:16` | - |
| Python 3.8 | Linux | 3.x | `python:3.8` | - |
| Python 3.9 | Linux | 4.x | `python:3.9` | - |

### .NET

To change the runtime version in a .NET app, change the `TargetFramework` value in the _csproj_ file. While optional, if you set a `apiRuntime` value in the _staticwebapp.config.json_ file, make sure the value matches what you define in the _csproj_ file.

The following example demonstrates how to update the `TargetFramework` element for NET 6.0 as the API language runtime version in the _csproj_ file.

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net6.0</TargetFramework>
    ...
  </PropertyGroup>
...
```

### Node.js

The following example configuration demonstrates how to use the `apiRuntime` property to select Node.js 16 as the API language runtime version in the _staticwebapp.config..json_ file.

```json
{
  ...
  "platform": {
    "apiRuntime": "node:16"
  }
  ...
}
```

## Deprecations

The following runtimes are deprecated in Azure Static Web Apps. For more information about changing your runtime, see [Specify API language runtime version in Azure Static Web Apps](https://azure.microsoft.com/updates/generally-available-specify-api-language-runtime-version-in-azure-static-web-apps/) and [Azure Functions runtime versions overview](/azure/azure-functions/functions-versions?tabs=azure-powershell%2Cin-process%2Cv4&pivots=programming-language-csharp#upgrade-your-local-project).

- .NET Core 3.1
- Node.js 12.x
