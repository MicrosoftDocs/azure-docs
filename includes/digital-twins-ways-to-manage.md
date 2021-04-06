---
author: baanders
description: include file for Azure Digital Twins - ways to manage instance
ms.service: digital-twins
ms.topic: include
ms.date: 11/11/2020
ms.author: baanders
---

This article highlights how to complete different management operations using the [Azure Digital Twins .NET (C#) **SDK**](/dotnet/api/overview/azure/digitaltwins/management). You can also craft these same management calls using the other language SDKs described in [*How-to: Use the Azure Digital Twins APIs and SDKs*](../articles/digital-twins/how-to-use-apis-sdks.md).

> [!TIP] 
> Remember that all SDK methods come in synchronous and asynchronous versions. For paging calls, the async methods return `AsyncPageable<T>` while the synchronous versions return `Pageable<T>`.

Another management option is to call the the Azure Digital Twins [**REST APIs**](/rest/api/azure-digitaltwins/) for this topic area directly, through a REST client like Postman. For instructions on how to do this, see [*How-to: Make requests with Postman*](../articles/digital-twins/how-to-use-postman.md).

Finally, you can complete the same management operations using the Azure Digital Twins **CLI**. To learn more about using the CLI, see [*How-to: Use the Azure Digital Twins CLI*](../articles/digital-twins/how-to-use-cli.md).