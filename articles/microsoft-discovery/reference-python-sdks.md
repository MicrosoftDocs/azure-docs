---
title: Python SDKs for Microsoft Discovery
description: Reference information for the Microsoft Discovery data-plane and control-plane Python SDK packages available on PyPI.
author: anzaman
ms.author: alzam
ms.service: azure
ms.topic: reference
ms.date: 08/03/2026
---

# Python SDKs for Microsoft Discovery

Microsoft Discovery provides Python SDKs for data-plane and control-plane operations. Both packages are publicly available from the Python Package Index (PyPI) and can be integrated into Python applications.

| SDK | Package | Use |
|---|---|---|
| Data plane | [`azure-ai-discovery`](https://pypi.org/project/azure-ai-discovery/) | Interact with Microsoft Discovery resources and perform runtime operations, such as working with workspaces, investigations, tasks, tools, bookshelves, and knowledge bases. |
| Control plane | [`azure-mgmt-discovery`](https://pypi.org/project/azure-mgmt-discovery/) | Provision, configure, and manage Microsoft Discovery resources through Azure Resource Manager (ARM). |

## Prerequisites

Before you use the SDKs, you need:

- Python 3.10 or later.
- An [Azure subscription](https://azure.microsoft.com/free/).
- A Microsoft Entra identity with permissions for the operations that you want to perform.
- For data-plane operations, an existing Microsoft Discovery workspace or bookshelf.
- For control-plane operations, the Azure subscription ID that contains or will contain your Microsoft Discovery resources.

## Install the SDKs

Install the data-plane SDK:

```bash
python -m pip install azure-ai-discovery
```

Install the control-plane SDK:

```bash
python -m pip install azure-mgmt-discovery
```

To authenticate with Microsoft Entra ID, install the Azure Identity client library:

```bash
python -m pip install azure-identity
```

## Related resources

- [Microsoft Discovery REST API reference](/rest/api/discovery/)
- [Azure SDK for Python documentation](/python/api/overview/azure/)
