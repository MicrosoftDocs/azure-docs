---
title: Azure Cosmos DB concurrency model | Microsoft Docs
description: Azure Cosmos DB concurrency model
services: documentdb
documentationcenter: ''
author: mimig1
manager: jhubbard
editor: ''
tags: ''

ms.assetid: 
ms.service: documentdb
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: ''
ms.date: 04/14/2017
ms.author: mimig

---

# Azure Cosmos DB concurrency model

Azure Cosmos DB supports optimistic concurrency control (OCC) through HTTP entity tags or etags. Every Azure Cosmos DB resource has an etag, and the etag is set on the server every time a document is updated. The etag header and the current value are included in all response messages. Etags can be used with the If-Match header to allow the server to decide if a resource should be updated. The If-Match value is the etag value to be checked against. If the etag value matches the server etag value, the resource will be updated. If the etag is no longer current, the server rejects the operation with an "HTTP 412 Precondition failure" response code. The client will then have to refetch the resource to acquire the current etag value for the resource. In addition, etags can be used with If-None-Match header to determine if a re-fetch of a resource is needed.

Conditional writes with ETags will be enforced for all consistency levels. The write request must include the ETag (If-Match header in REST, RequestOptions.[AccessCondition](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.accesscondition.aspx) in DocumentDB .NET API).

To use optimistic concurrency in the Azure Cosmos DB DocumentDB .NET API, use the [AccessCondition](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.accesscondition.aspx) class. For a sample, see [Program.cs](https://github.com/Azure/azure-documentdb-dotnet/blob/master/samples/code-samples/DocumentManagement/Program.cs) in the DocumentManagement sample on github.

## Next steps

Learn more about Azure Cosmos DB in the [multi-model introduction](documentdb-multi-model-introduction.md).


