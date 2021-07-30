---
author: johndeu
ms.service: media-services 
ms.topic: include
ms.date: 11/04/2020
ms.author: johndeu
ms.custom: sdk
---

> [!WARNING]
> It is not advised to attempt to wrap the REST API for Media Services directly into your own library code, as doing so properly for production purposes would require you to implement the full Azure Resource Management retry logic and understand how to manage long running operations in Azure Resource Management APIs. This is handled by the client SDKs for various language - .NET, Java, Typescript, Python, Ruby, etc. - for you automatically and reduces the chances of you having issues with rety logic or failed API calls. The client SDKs all handle this for you already. The Postman collection is provided more as a teaching tool, and to show you what the client SDKs are actually doing on the wire during your development with the various client SDKs.
