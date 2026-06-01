---
author: mumian
ms.service: azure-resource-manager
ms.custom: devx-track-bicep
ms.topic: include
ms.date: 09/16/2022
ms.author: jgao
---

In JSON, an object is an unordered collection of zero or more key or value pairs. The ordering might be different depending on the implementations. For example, the Bicep [items()](../articles/azure-resource-manager/bicep/bicep-functions-object.md#items) function sorts the objects in alphabetical order. In other places, you can preserve the original ordering. Because of this nondeterminism, avoid making any assumptions about the ordering of object keys when you write code, which interacts with deployment parameters and outputs.
