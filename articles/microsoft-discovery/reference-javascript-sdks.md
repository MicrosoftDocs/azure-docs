---
title: JavaScript SDKs for Microsoft Discovery
description: Reference information for the Microsoft Discovery data-plane and control-plane JavaScript SDK packages available on npm.
author: anzaman
ms.author: alzam
ms.service: azure
ms.topic: reference
ms.date: 09/02/2026
---

# JavaScript SDKs for Microsoft Discovery

Microsoft Discovery provides JavaScript SDKs for data-plane and control-plane operations. Both packages are publicly available from npm and can be integrated into JavaScript and TypeScript applications.

| SDK | Package | Use |
|---|---|---|
| Data plane | [`@azure/ai-discovery`](https://www.npmjs.com/package/@azure/ai-discovery) | Interact with Microsoft Discovery resources and perform runtime operations, such as working with workspaces, investigations, tasks, tools, bookshelves, and knowledge bases. |
| Control plane | [`@azure/arm-discovery`](https://www.npmjs.com/package/@azure/arm-discovery) | Provision, configure, and manage Microsoft Discovery resources through Azure Resource Manager (ARM). |

## Prerequisites

Before you use the SDKs, you need:

- A JavaScript or TypeScript project that uses npm.
- An [Azure subscription](https://azure.microsoft.com/free/).
- A Microsoft Entra identity with permissions for the operations that you want to perform.
- For data-plane operations, an existing Microsoft Discovery workspace or bookshelf.
- For control-plane operations, the Azure subscription ID that contains or will contain your Microsoft Discovery resources.

## Install the SDKs

Install the data-plane SDK:

```bash
npm install @azure/ai-discovery
```

Install the control-plane SDK:

```bash
npm install @azure/arm-discovery
```

To authenticate with Microsoft Entra ID, install the Azure Identity client library:

```bash
npm install @azure/identity
```

## Related resources

- [Microsoft Discovery REST API reference](/rest/api/discovery/)
- [Azure SDK for JavaScript documentation](/javascript/api/overview/azure/)
