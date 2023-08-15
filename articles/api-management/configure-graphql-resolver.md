---
title: Configure GraphQL resolver in Azure API Management
description: Configure a GraphQL resolver in Azure API Management for a field in an object type specified in a GraphQL schema
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 06/08/2023
ms.author: danlep
---

# Configure a GraphQL resolver

Configure a resolver to retrieve or set data for a GraphQL field in an object type specified in a GraphQL schema. The schema must be imported to API Management as a GraphQL API. 

Currently, API Management supports resolvers that can access the following data sources:

* [HTTP-based data source](http-data-source-policy.md) (REST or SOAP API)
* [Cosmos DB database](cosmosdb-data-source-policy.md)
* [Azure SQL database](sql-data-source-policy.md) 

## Things to know

* A resolver is a resource containing a policy definition that's invoked only when a matching object type and field in the schema is executed. 
* Each resolver resolves data for a single field. To resolve data for multiple fields, configure a separate resolver for each.
* Resolver-scoped policies are evaluated *after* any `inbound` and `backend` policies in the policy execution pipeline. They don't inherit policies from other scopes. For more information, see [Policies in API Management](api-management-howto-policies.md).


> [!IMPORTANT]
> * If you use the preview `set-graphql-resolver` policy in policy definitions, you should migrate to the managed resolvers described in this article.
> * After you configure a managed resolver for a GraphQL field, the gateway will skip the `set-graphql-resolver` policy in any policy definitions. You can't combine use of managed resolvers and the `set-graphql-resolver` policy in your API Management instance.

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- Import a [pass-through](graphql-api.md) or [synthetic](graphql-schema-resolve-api.md) GraphQL API.

## Create a resolver

The following steps create a resolver using an HTTP-based data source. The general steps are similar for any resolver that uses a supported data source.

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.

1. In the left menu, select **APIs** and then the name of your GraphQL API.
1. On the **Schema** tab, review the schema for a field in an object type where you want to configure a resolver. 
    1. Select a field, and then in the left margin, hover the pointer. 
    1. Select **+ Add Resolver**.

        :::image type="content" source="media/configure-graphql-resolver/add-resolver.png" alt-text="Screenshot of adding a resolver from a field in GraphQL schema in the portal.":::

1. On the **Create Resolver** page:
    1.  Update the **Name** property if you want to, optionally enter a **Description**, and confirm or update the **Type** and **Field** selections.
    1. Select the resolver's **Data source**. For this example, select **HTTP API**. 
1. In the **Resolver policy** editor, update the [`http-data-source`](http-data-source-policy.md) policy with child elements for your scenario. 
    1. Update the required `http-request` element with policies to transform the GraphQL operation to an HTTP request.
    1. Optionally add an `http-response` element, and add child policies to transform the HTTP response of the resolver. If the `http-response` element isn't specified, the response is returned as a raw string.
    1. Select **Create**.
    
        :::image type="content" source="media/configure-graphql-resolver/configure-resolver-policy.png" alt-text="Screenshot of resolver policy editor in the portal." lightbox="media/configure-graphql-resolver/configure-resolver-policy.png":::

1. The resolver is attached to the field. Go to the **Resolvers** tab to list and manage the resolvers configured for the API. You can also create resolvers from the **Resolvers** tab.

    :::image type="content" source="media/configure-graphql-resolver/list-resolvers.png" alt-text="Screenshot of the resolvers list for GraphQL API in the portal." lightbox="media/configure-graphql-resolver/list-resolvers.png":::

    > [!TIP]
    > * The **Linked** column indicates whether the resolver is configured for a field that's currently in the GraphQL schema. If a resolver isn't linked, it can't be invoked.
    > * You can clone a listed resolver to quickly create a similar resolver that targets a different type and field. In the context menu (**...**), select **Clone**. 

## GraphQL context

* The context for the resolver's request and response (if specified) differs from the context for the original gateway API request: 
  * `context.GraphQL` properties are set to the arguments (`Arguments`) and parent object (`Parent`) for the current resolver execution.
  * The request context contains arguments that are passed in the GraphQL query as its body. 
  * The response context is the response from the independent call made by the resolver, not the context for the complete response for the gateway request. 
The `context` variable that is passed through the request and response pipeline is augmented with the GraphQL context when used with a GraphQL resolver.

### context.GraphQL.parent

The `context.ParentResult` is set to the parent object for the current resolver execution.  Consider the following partial schema:

``` graphql
type Comment {
    id: ID!
    owner: string!
    content: string!
}

type Blog {
    id: ID!
    title: string!
    content: string!
    comments: [Comment]!
    comment(id: ID!): Comment
}

type Query {
    getBlog(): [Blog]!
    getBlog(id: ID!): Blog
}
```

Also, consider a GraphQL query for all the information for a specific blog:

``` graphql
query {
    getBlog(id: 1) {
        title
        content
        comments {
            id
            owner
            content
        }
    }
}
```

If you set a resolver for the `comments` field in the `Blog` type, you'll want to understand which blog ID to use.  You can get the ID of the blog using `context.GraphQL.Parent["id"]` as shown in the following resolver:

``` xml
<http-data-source>
    <http-request>
        <set-method>GET</set-method>
        <set-url>@($"https://data.contoso.com/api/blog/{context.GraphQL.Parent["id"]}")
        </set-url>
    </http-request>
</http-data-source>
```

### context.GraphQL.Arguments

The arguments for a parameterized GraphQL query are added to `context.GraphQL.Arguments`. For example, consider the following two queries:

``` graphql
query($id: Int) {
    getComment(id: $id) {
        content
    }
}

query {
    getComment(id: 2) {
        content
    }
}
```

These queries are two ways of calling the `getComment` resolver.  GraphQL sends the following JSON payload:

``` json
{
    "query": "query($id: Int) { getComment(id: $id) { content } }",
    "variables": { "id": 2 }
}

{
    "query": "query { getComment(id: 2) { content } }"
}
```

You can define the resolver as follows:

``` xml
<http-data-source>
    <http-request>
        <set-method>GET</set-method>
        <set-url>@($"https://data.contoso.com/api/comment/{context.GraphQL.Arguments["id"]}")</set-url>
    </http-request>
</http-data-source>
```

## Next steps

For more resolver examples, see:


* [GraphQL resolver policies](api-management-policies.md#graphql-resolver-policies)

* [Sample APIs for Azure API Management](https://github.com/Azure-Samples/api-management-sample-apis)
