---
title: Support for GraphQL APIs - Azure API Management
description: Learn about GraphQL and how Azure API Management helps you manage GraphQL APIs.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: conceptual
ms.date: 09/18/2023
ms.author: danlep
---

# Overview of GraphQL APIs in Azure API Management

You can use API Management to manage GraphQL APIs - APIs based on the GraphQL query language. GraphQL provides a complete and understandable description of the data in an API, giving clients the power to efficiently retrieve exactly the data they need. [Learn more about GraphQL](https://graphql.org/learn/)

API Management helps you import, manage, protect, test, publish, and monitor GraphQL APIs. You can choose one of two API models:


|Pass-through GraphQL   |Synthetic GraphQL  |
|---------|---------|
| ▪️ Pass-through API to existing GraphQL service endpoint<br><br/>▪️ Support for GraphQL queries, mutations, and subscriptions  |   ▪️ API based on a custom GraphQL schema<br></br>▪️ Support for GraphQL queries, mutations, and subscriptions<br/><br/>▪️  Configure custom resolvers, for example, to HTTP data sources<br/><br/>▪️ Develop GraphQL schemas and GraphQL-based clients while consuming data from legacy APIs     |

## Availability

* GraphQL APIs are supported in all API Management service tiers
* Synthetic GraphQL APIs currently aren't supported in API Management [workspaces](workspaces-overview.md)
* Support for GraphQL subscriptions in synthetic GraphQL APIs is currently in preview and isn't available in the Consumption tier

## What is GraphQL?

GraphQL is an open-source, industry-standard query language for APIs. Unlike REST-style APIs designed around actions over resources, GraphQL APIs support a broader set of use cases and focus on data types, schemas, and queries.

The GraphQL specification explicitly solves common issues experienced by client web apps that rely on REST APIs:

* It can take a large number of requests to fulfill the data needs for a single page
* REST APIs often return more data than needed by the page being rendered
* The client app needs to poll to get new information

Using a GraphQL API, the client app can specify the data they need to render a page in a query document that is sent as a single request to a GraphQL service. A client app can also subscribe to data updates pushed from the GraphQL service in real time.

## Schema and operation types

In API Management, add a GraphQL API from a GraphQL schema, either retrieved from a backend GraphQL API endpoint or uploaded by you. A GraphQL schema describes:

* Data object types and fields that clients can request from a GraphQL API
* Operation types allowed on the data, such as queries 

For example, a basic GraphQL schema for user data and a query for all users might look like:

```
type Query {
    users: [User]
}

type User {
    id: String!
    name: String!
}
```

API Management supports the following operation types in GraphQL schemas. For more information about these operation types, see the [GraphQL specification](https://spec.graphql.org/October2021/#sec-Subscription-Operation-Definitions).

* **Query** - Fetches data, similar to a `GET` operation in REST
*  **Mutation** - Modifies server-side data, similar to a `PUT` or `PATCH` operation in REST
* **Subscription** - Enables notifying subscribed clients in real time about changes to data on the GraphQL service

    For example, when data is modified via a GraphQL mutation, subscribed clients could be automatically notified about the change. 

> [!IMPORTANT]
> API Management supports subscriptions implemented using  the [graphql-ws](https://github.com/enisdenjo/graphql-ws) WebSocket protocol. Queries and mutations aren't supported over WebSocket.
> 

## Resolvers

*Resolvers* take care of mapping the GraphQL schema to backend data, producing the data for each field in an object type. The data source could be an API, a database, or another service. For example, a resolver function would be responsible for returning data for the `users` query in the preceding example. 

In API Management, you can create a resolver to map a field in an object type to a backend data source. You configure resolvers for fields in synthetic GraphQL API schemas, but you can also configure them to override the default field resolvers used by pass-through GraphQL APIs.

API Management currently supports resolvers based on HTTP API, Cosmos DB, and Azure SQL data sources to return the data for fields in a GraphQL schema. Each resolver is configured using a tailored policy to connect to the data source and retrieve the data:

| Data source | Resolver policy |
| ------- | --------- | 
| HTTP-based data source (REST or SOAP API) | [http-data-source](http-data-source-policy.md)  |
| Cosmos DB database | [cosmosdb-data-source](cosmosdb-data-source-policy.md) |
| Azure SQL database | [sql-data-source](sql-data-source-policy.md) | 

For example, an HTTP API-based resolver for the preceding `users` query might map to a `GET` operation in a backend REST API:

```xml
<http-data-source>
	<http-request>
		<set-method>GET</set-method>
		<set-url>https://myapi.contoso.com/api/users</set-url>
	</http-request>
</http-data-source>
```

For more information about setting up a resolver, see [Configure a GraphQL resolver](configure-graphql-resolver.md).

## Manage GraphQL APIs

* Secure GraphQL APIs by applying both existing access control policies and a [GraphQL validation policy](validate-graphql-request-policy.md) to secure and protect against GraphQL-specific attacks.
* Explore the GraphQL schema and run test queries against the GraphQL APIs in the Azure and developer portals.


## Next steps

- [Import a GraphQL API](graphql-api.md)
- [Import a GraphQL schema and set up field resolvers](graphql-schema-resolve-api.md)
