---
author: craigshoemaker
ms.service: container-apps
ms.topic: include
ms.date: 08/04/2022
ms.author: cshoe
---

To configure the API language runtime version, set the `apiRuntime` property in the `platform` section to one of the following supported values.

| Language runtime version | Operating system | Azure Functions version | `apiRuntime` value | End date |
|--|--|--|--|--|
| .NET Core 3.1 | Windows | 3.x | `dotnet:3.1` | December 3, 2022 |
| .NET 6.0 in-process | Windows | 4.x | `dotnet:6.0` |  |
| .NET 6.0 isolated | Windows | 4.x | `dotnet-isolated:6.0` |  |
| Node.js 12.x | Linux | 3.x | `node:12` |  |
| Node.js 14.x | Linux | 4.x | `node:14` |  |
| Node.js 16.x | Linux | 4.x | `node:16` |  |
| Python 3.8 | Linux | 3.x | `python:3.8` |  |
| Python 3.9 | Linux | 4.x | `python:3.9` |  |

### node.js

The following example configuration demonstrates how to use the `apiRuntime` property to select Node.js 16 as the API language runtime version in the _package.json_ file.

```json
{
  ...
  "platform": {
    "apiRuntime": "node:16"
  }
  ...
}
```

### .NET Framework

The following example configuration demonstrates how to use the `TargetFramework` element to select .NET 6.0 as the API language runtime version in the _csproj_ file.

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net6.0</TargetFramework>
    ...
  </PropertyGroup>
...
```
