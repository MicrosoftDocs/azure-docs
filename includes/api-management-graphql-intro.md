---
ms.service: api-management
ms.topic: include
author: dlepow
ms.author: danlep
ms.date: 05/10/2022
ms.custom: 
---

GraphQL is an open-source, industry-standard query language for APIs. Unlike endpoint-based (or REST-style) APIs designed around actions over resources, GraphQL APIs support a broader set of use cases and focus on data types, schemas, and queries.

Using API Management to expose your GraphQL APIs, you can:
* Add a GraphQL schema or GraphQL endpoint as an API via the Azure portal, the Azure CLI, and other Azure tools
* Secure GraphQL APIs by applying both existing access control policies and a [GraphQL validation policy](../articles/api-management/graphql-policies.md#validate-graphql-request) to secure and protect against GraphQL-specific attacks.
* Set up [HTTP resolvers](../articles/api-management/graphql-policies.md#validate-graphql-request#set-graphql-resolver) (preview) for fields defined in a GraphQL schema.   
* Explore the schema and run test queries against the GraphQL APIs in the Azure and developer portals.

> [!NOTE]
> * A single GraphQL API in API Management can map to a single GraphQL backend endpoint.
> * API Management supports query, mutation, and subscription operation types in GraphQL schemas. A subscription must be implemented using the [graphql-ws](https://github.com/enisdenjo/graphql-ws) WebSocket protocol. Queries and mutations are not supported over WebSocket.