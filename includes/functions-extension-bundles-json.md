---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 02/26/2024
ms.author: glenga
---

[!INCLUDE [functions-extension-bundles-json-v4](./functions-extension-bundles-json-v4.md)]

The following properties are available in `extensionBundle`:

| Property | Description |
| -------- | ----------- |
| **`id`** | The namespace for Microsoft Azure Functions extension bundles. |
| **`version`** | The version range of the bundle to install. The Functions runtime always picks the maximum permissible version defined by the version range or interval. For example, a  `version` value range of `[4.0.0, 5.0.0)` allows all bundle versions from 4.0.0 up to but not including 5.0.0. For more information, see the [interval notation for specifying version ranges](/nuget/reference/package-versioning#version-ranges). |
