---
author: craigshoemaker
ms.service: static-web-apps
ms.topic: include
ms.date: 08/30/2023
ms.author: cshoe
---

To configure the API language runtime version, set the `apiRuntime` property in the `platform` section to one of the following supported values.

| Language runtime version | Operating system | Azure Functions version | `apiRuntime` value | End of support date |
|--|--|--|--|--|
| .NET Core 3.1 | Windows | 3.x | `dotnet:3.1` | December 3, 2022 |
| .NET 6.0 in-process | Windows | 4.x | `dotnet:6.0` | - |
| .NET 6.0 isolated | Windows | 4.x | `dotnet-isolated:6.0` | - |
| .NET 7.0 isolated | Windows | 4.x | `dotnet-isolated:7.0` | - |
| Node.js 12.x | Linux | 3.x | `node:12` | December 3, 2022 |
| Node.js 14.x | Linux | 4.x | `node:14` | - |
| Node.js 16.x | Linux | 4.x | `node:16` | - |
| Node.js 18.x <br>(public preview) | Linux | 4.x | `node:18` | - |
| Python 3.8 | Linux | 4.x | `python:3.8` | - |
| Python 3.9 | Linux | 4.x | `python:3.9` | - |
| Python 3.10 | Linux | 4.x | `python:3.10` | - |

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

The following example configuration demonstrates how to use the `apiRuntime` property to select Node.js 16 as the API language runtime version in the _staticwebapp.config.json_ file.

```json
{
  ...
  "platform": {
    "apiRuntime": "node:16"
  }
  ...
}
```

### Python

The following example configuration demonstrates how to use the `apiRuntime` property to select Python 3.8 as the API language runtime version in the _staticwebapp.config.json_ file.

```json
{
  ...
  "platform": {
    "apiRuntime": "python:3.8"
  }
  ...
}
```
