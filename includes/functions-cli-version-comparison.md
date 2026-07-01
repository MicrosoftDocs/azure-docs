---
ms.service: azure-functions
ms.topic: include
ms.date: 06/01/2026
author: ggailey777
ms.author: glenga
ms.custom:
  - build-2026
---
There are two command-line tools that ship as `func.exe` for Azure Functions:

| | [Azure Functions Core Tools](../articles/azure-functions/functions-run-local.md) | [Azure Functions CLI](../articles/azure-functions/functions-cli-develop-local.md) |
| --- | --- | --- |
| **func.exe version** | v4 | v5 |
| **Support level** | General availability (GA) | Preview |
| **Install footprint** | Full binary that includes all commands and capabilities for all native languages. | Small base install, plus workloads per-language and other features you add as needed. The host ships as its own workload, so you get the latest host version without re-downloading the CLI. |
| **Use when...** | You need full GA support for all development workflows. | You want a lightweight, workload-based experience with new features like quickstart templates and profiles that keep your local environment in sync with your Azure hosting plan configuration. |
