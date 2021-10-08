---
title: Import a GraphQL API using the Azure portal | Microsoft Docs
titleSuffix: 
description: Learn how API Management supports GraphQL, add a GraphQL API, and GraphQL limitations.
ms.service: api-management
author: dlepow
ms.author: danlep
ms.topic: how-to
ms.date: 10/07/2021
ms.custom:  
---

# Import a GraphQL API (preview)

In this article you learn how to import a GraphQL API to API Management. GraphQL is an open-source, industry-standard query language for APIs. Unlike endpoint-based (or REST-style) APIs designed around actions over resources, GraphQL APIs support a broader set of use cases and focus on data types, schemas, and queries.

You can secure GraphQL APIs by applying existing access control policies and new policies to secure and protect against GraphQL-specific attacks.

A single GraphQL API in API Management corresponds to a single GraphQL backend endpoint. 

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- A GraphQL API. 

## Add a GraphQL API

1. Navigate to your API Management instance.
1. From the side navigation menu, under the **APIs** section, select **APIs**.
1. Under **Define a new API**, select the **GraphQL** icon.
1. In the dialog box, select **Full** and complete the required form fields.

    | Field | Description |
    |----------------|-------|
    | | |
    
 
1. Click **Create**.

## Test your GraphQL API

1. Navigate to your GraphQL API.
1. 
1. 



## Limitations


[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]

## Next steps
> [!div class="nextstepaction"]
> [Transform and protect a published API](transform-api.md)