---
title: Concurrency Control | Azure Marketplace
description: Concurrency control strategies for the Cloud Partner Portal publishing APIs.
services: Azure, Marketplace, Cloud Partner Portal, 
author: v-miclar
ms.service: marketplace
ms.topic: conceptual
ms.date: 09/13/2018
ms.author: pabutler
---

# Concurrency Control

Every call to the Cloud Partner Portal publishing APIs must explicitly
specify which concurrency control strategy to use. Failure to provide
the **If-Match** header will result in an HTTP 400 error response. We
offer two strategies for concurrency control.

-   **Optimistic** - The client performing the update verifies if the
    data has changed since it last read the data.
-   **Last one wins** - The client directly updates the data,
    regardless of whether another application has modified it since the
    last read time.

Optimistic concurrency workflow
-------------------------------

We recommend using the optimistic concurrency strategy, with the
following workflow, to guarantee that no unexpected edits are made to your
resources.

1.  Retrieve an entity using the APIs. The response includes an ETag
    value that identifies the currently stored version of the entity (at
    the time of the response).
2.  At the time of update, include this same ETag value in the mandatory
    **If-Match** request header.
3.  The API compares the ETag value received in the request with the
    current ETag value of the entity in an atomic transaction.
    *   If the ETag values are different, the API returns a `412 Precondition Failed` HTTP 
    response. This error indicates that either another
    process has updated the entity since the client last retrieved it,
    or that the ETag value specified in the request is incorrect.
    *  If the ETag values are the same, or the **If-Match** header contains
    the wildcard asterisk character (`*`), the API performs the requested
    operation. The API operation also updates the stored ETag value of the entity.


> [!NOTE]
> Specifying the wildcard character (*) in the **If-Match** header results in the API using the Last-one-wins concurrency strategy. In this case, the ETag comparison does not occur and the resource is updated without any checks. 
