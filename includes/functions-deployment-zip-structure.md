---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 07/16/2024
ms.author: glenga
---

The zip archive you deploy must contain all of the files needed to run your function app. You can manually create a zip archive from the contents of a Functions project folder using built-in .zip compression functionality or third-party tools.

The archive must include the [host.json](../articles/azure-functions/functions-host-json.md) file at the root of the extracted folder. The selected language stack for the function app creates additional requirements:

* [.NET (isolated worker model)](../articles/azure-functions/dotnet-isolated-process-guide.md#deployment-payload)
* [.NET (in-process model)](../articles/azure-functions/functions-dotnet-class-library.md#functions-class-library-project)
* [Java](../articles/azure-functions/functions-reference-java.md#folder-structure)
* [JavaScript](../articles/azure-functions/functions-reference-node.md?tabs=javascript#folder-structure)
* [TypeScript](../articles/azure-functions/functions-reference-node.md?tabs=typescript#folder-structure)
* [PowerShell](../articles/azure-functions/functions-reference-powershell.md#folder-structure)
* [Python](../articles/azure-functions/functions-reference-python.md#folder-structure)

> [!IMPORTANT]
> For languages that generate compiled output for deployment, make sure to compress the contents of the output folder you plan to publish and not the entire project folder. When Functions extracts the contents of the zip archive, the `host.json` file must exist in the root of the package.
