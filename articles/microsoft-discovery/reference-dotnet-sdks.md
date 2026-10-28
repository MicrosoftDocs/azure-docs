---
title: .NET SDKs for Microsoft Discovery
description: Reference information for the Microsoft Discovery data-plane and control-plane .NET SDK packages available on NuGet.
author: anzaman
ms.author: alzam
ms.service: azure
ms.topic: reference
ms.date: 09/02/2026
---

# .NET SDKs for Microsoft Discovery

Microsoft Discovery provides .NET SDKs for data-plane and control-plane operations. Both packages are publicly available from NuGet and can be integrated into .NET applications.

| SDK | Package | Use |
|---|---|---|
| Data plane | [`Azure.AI.Discovery`](https://www.nuget.org/packages/Azure.AI.Discovery/1.0.0-beta.1) | Interact with Microsoft Discovery resources and perform runtime operations, such as working with workspaces, investigations, tasks, tools, bookshelves, and knowledge bases. |
| Control plane | [`Azure.ResourceManager.Discovery`](https://www.nuget.org/packages/Azure.ResourceManager.Discovery/1.0.0-beta.1) | Provision, configure, and manage Microsoft Discovery resources through Azure Resource Manager (ARM). |

## Prerequisites

Before you use the SDKs, you need:

- A .NET project.
- An [Azure subscription](https://azure.microsoft.com/free/).
- A Microsoft Entra identity with permissions for the operations that you want to perform.
- For data-plane operations, an existing Microsoft Discovery workspace or bookshelf.
- For control-plane operations, the Azure subscription ID that contains or will contain your Microsoft Discovery resources.

## Install the SDKs

Install the data-plane SDK:

```dotnetcli
dotnet add package Azure.AI.Discovery --version 1.0.0-beta.1
```

Install the control-plane SDK:

```dotnetcli
dotnet add package Azure.ResourceManager.Discovery --version 1.0.0-beta.1
```

To authenticate with Microsoft Entra ID, install the Azure Identity client library:

```dotnetcli
dotnet add package Azure.Identity
```

## Related resources

- [Microsoft Discovery REST API reference](/rest/api/discovery/)
- [Azure SDK for .NET documentation](/dotnet/azure/)
