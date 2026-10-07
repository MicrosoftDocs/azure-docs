---
ms.service: azure-static-web-apps
ms.topic: include
ms.date: 10/05/2026
author: cjk7989
ms.author: jikunchen
---

To configure the API language runtime version, set the `apiRuntime` property in the `platform` section to one of the following supported values.

| Language runtime version | Operating system | Azure Functions version | `apiRuntime` value | End of support date |
|--|--|--|--|--|
| .NET Core 3.1 | Windows | 3.x | `dotnet:3.1` | December 3, 2022 |
| .NET 6.0 in-process | Windows | 4.x | `dotnet:6.0` | April 30, 2025 |
| .NET 8.0 in-process | Windows | 4.x | `dotnet:8.0` | November 10, 2026 |
| .NET 6.0 isolated | Windows | 4.x | `dotnet-isolated:6.0` | April 30, 2025 |
| .NET 7.0 isolated | Windows | 4.x | `dotnet-isolated:7.0` | April 30, 2025 |
| .NET 8.0 isolated | Windows | 4.x | `dotnet-isolated:8.0` | November 10, 2026 |
| .NET 9.0 isolated | Windows | 4.x | `dotnet-isolated:9.0` | November 10, 2026 |
| .NET 10.0 isolated | Windows | 4.x | `dotnet-isolated:10.0` | - |
| Node.js 12.x | Linux | 3.x | `node:12` | December 3, 2022 |
| Node.js 14.x | Linux | 4.x | `node:14` | April 30, 2025 |
| Node.js 16.x | Linux | 4.x | `node:16` | April 30, 2025 |
| Node.js 18.x | Linux | 4.x | `node:18` | May 31, 2025 |
| Node.js 20.x | Linux | 4.x | `node:20` | - |
| Node.js 22.x | Linux | 4.x | `node:22` | - |
| Python 3.8 | Linux | 4.x | `python:3.8` | April 30, 2025 |
| Python 3.9 | Linux | 4.x | `python:3.9` | - |
| Python 3.10 | Linux | 4.x | `python:3.10` | - |
| Python 3.11 | Linux | 4.x | `python:3.11` | - |


### .NET

To change the runtime version in a .NET app, change the `TargetFramework` value in the _csproj_ file, and set the `apiRuntime` value in the _staticwebapp.config.json_ file to the matching version. Make sure the `apiRuntime` value matches what you define in the _csproj_ file.

.NET 10.0 is supported only with the isolated worker model. If your API uses the in-process model, [migrate to the isolated worker model](../articles/azure-functions/migrate-dotnet-to-isolated-model.md) first. For the packages and project settings required to target .NET 10.0, see [Guide for running C# Azure Functions in the isolated worker model](../articles/azure-functions/dotnet-isolated-process-guide.md).

The following example demonstrates how to update the `TargetFramework` element for .NET 10.0 as the API language runtime version in the _csproj_ file.

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    ...
  </PropertyGroup>
...
```

The following example configuration demonstrates how to use the `apiRuntime` property to select .NET 10.0 isolated as the API language runtime version in the _staticwebapp.config.json_ file.

```json
{
  ...
  "platform": {
    "apiRuntime": "dotnet-isolated:10.0"
  }
  ...
}
```

### Node.js

The following example configuration demonstrates how to use the `apiRuntime` property to select Node.js 20 as the API language runtime version in the _staticwebapp.config.json_ file.

```json
{
  ...
  "platform": {
    "apiRuntime": "node:20"
  }
  ...
}
```

### Python

The following example configuration demonstrates how to use the `apiRuntime` property to select Python 3.11 as the API language runtime version in the _staticwebapp.config.json_ file.

```json
{
  ...
  "platform": {
    "apiRuntime": "python:3.11"
  }
  ...
}
```
