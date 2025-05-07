---
title: Configure GraphQL resolver in Azure API Management
description: Configure a GraphQL resolver in Azure API Management for a field in an object type specified in a GraphQL schema
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 05/02/2024
ms.author: danlep
---

# Configure a GraphQL resolver

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]


Configure a resolver to retrieve or set data for a GraphQL field in an object type specified in a GraphQL schema. The schema must be imported to API Management as a GraphQL API. 

[!INCLUDE [api-management-workspace-availability](../../includes/api-management-workspace-availability.md)]

Currently, API Management supports resolvers that can access the following data sources:

* [HTTP-based data source](http-data-source-policy.md) (REST or SOAP API)
* [Cosmos DB database](cosmosdb-data-source-policy.md)
* [Azure SQL database](sql-data-source-policy.md) 

## Things to know

* A resolver is a resource containing a policy definition that's invoked only when a matching object type and field in the schema is executed. 
* Each resolver resolves data for a single field. To resolve data for multiple fields, configure a separate resolver for each.
* Resolver-scoped policies are evaluated *after* any `inbound` and `backend` policies in the policy execution pipeline. They don't inherit policies from other scopes. For more information, see [Policies in API Management](api-management-howto-policies.md).
* You can configure API-scoped policies for a GraphQL API, independent of the resolver-scoped policies. For example, add a [validate-graphql-request](validate-graphql-request-policy.md) policy to the `inbound` scope to validate the request before the resolver is invoked. Configure API-scoped policies on the **API policies** tab for the API.
* To support interface and union types in GraphQL resolvers, the backend response must either already contain the `__typename` field, or be altered using the [set-body](set-body-policy.md) policy to include `__typename`.

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

    The resolver is attached to the field and appears on the **Resolvers** tab. 


    :::image type="content" source="media/configure-graphql-resolver/list-resolvers.png" alt-text="Screenshot of the resolvers list for GraphQL API in the portal." lightbox="media/configure-graphql-resolver/list-resolvers.png":::

## Manage resolvers

List and manage the resolvers for a GraphQL API on the API's **Resolvers** tab. 

:::image type="content" source="media/configure-graphql-resolver/resolvers-tab.png" alt-text="Screenshot of managing resolvers for GraphQL API in the portal." lightbox="media/configure-graphql-resolver/resolvers-tab.png":::

On the **Resolvers** tab:

* The **Linked** column indicates whether the resolver is configured for a field that's currently in the GraphQL schema. If a resolver isn't linked, it can't be invoked.

* In the context menu (**...**) for a resolver, find commands to **Clone**, **Edit**, or **Delete** a resolver.  Clone a listed resolver to quickly create a similar resolver that targets a different type and field. 

* You can create a new resolver by selecting **+ Create**.

## Edit and test a resolver

When you edit a single resolver, the **Edit resolver** page opens. You can:

* Update the resolver policy and optionally the data source. Changing the data source overwrites the current resolver policy.

* Change the type and field that the resolver targets. 

* Test and debug the resolver's configuration. As you edit the resolver policy, select **Run Test** to check the output from the data source, which you can validate against the schema. If errors occur, the response includes troubleshooting information. 

    :::image type="content" source="media/configure-graphql-resolver/edit-resolver.png" alt-text="Screenshot of editing a resolver in the portal." lightbox="media/configure-graphql-resolver/edit-resolver.png":::

## GraphQL context

* The context for the resolver's request and response (if specified) differs from the context for the original gateway API request: 
  * `context.GraphQL` properties are set to the arguments (`Arguments`) and parent object (`Parent`) for the current resolver execution.
  * The request context contains arguments that are passed in the GraphQL query as its body. 
  * The response context is the response from the independent call made by the resolver, not the context for the complete response for the gateway request. 
The `context` variable that is passed through the request and response pipeline is augmented with the GraphQL context when used with a GraphQL resolver.

### context.GraphQL.parent

The `context.GraphQL.parent` is set to the parent object for the current resolver execution.  Consider the following partial schema:

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

## Related content

For more resolver examples, see:


* [GraphQL resolver policies](api-management-policies.md#graphql-resolvers)

* [Sample APIs for Azure API Management](https://github.com/Azure-Samples/api-management-sample-apis)
