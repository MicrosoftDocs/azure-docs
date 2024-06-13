---
author: mumian
ms.service: azure-resource-manager
ms.topic: include
ms.date: 09/16/2022
ms.author: jgao
---

In JSON, an object is an unordered collection of zero or more key/value pairs. The ordering can be different depending on the implementations. For example, the Bicep [items()](../articles/azure-resource-manager/templates/template-functions-object.md#items) function sorts the objects in the alphabetical order. In other places, the original ordering can be preserved. Because of this non-determinism, avoid making any assumptions about the ordering of object keys when writing code, which interacts with deployments parameters & outputs.
