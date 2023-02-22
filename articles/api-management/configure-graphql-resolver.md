---
title: Configure GraphQL resolver in Azure API Management
description: Configure a GraphQL resolver in Azure AI Management for a field in an object type specified in a GraphQL schema
services: api-management
author: dlepow

ms.service: api-management
ms.topic: reference
ms.date: 02/22/2023
ms.author: danlep
---

# Configure a GraphQL resolver

Configure a resolver to retrieve or set data for a GraphQL field in an object type specified in a GraphQL schema. The schema must be imported to API Management. Currently the data must be resolved using an HTTP-based data source (REST or SOAP API) specified using resolver-scoped policies. 

<!-- link to GQL overview topic -->
<!-- add include for back compat with set-graphql-resolver -->


* A resolver is invoked only when a matching object type and field is executed. 
* Each resolver resolves data for a single field. To resolve data for multiple fields, configure a separate resolver for each.
* Resolver-scoped policies are evaluated *after* any `inbound` and `backend` policies in the policy execution pipeline. They don't inherit policies from other scopes. For more information, see [Policies in API Management](api-management-howto-policies.md).



## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- Import a [pass-through](graphql-api.md) or [synthetic](graphql-schema-resolve-api.md) GraphQL API.

## Create a resolver

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.

1. In the left menu, select **APIs** and then the name of your GraphQL API.
1. On the **Design** tab, review the schema for a field in an object type where you want to configure a resolver. 
    1. Select a field, and then in the left margin, hover the pointer. 
    1. Select **+ Add Resolver**.

        :::image type="content" source="media/configure-graphql-resolver/add-resolver.png" alt-text="Screenshot of adding a resolver from a field in GraphQL schema in the portal.":::
1. On the **Create Resolver** page, update the **Name** property if you want to, optionally enter a **Description**, and confirm or update the **Type** and **Field** selections.
1. In the **Resolver policy** editor, update the `<http-data-source>` element with child elements for your scenario.
    1. Update the required `<http-request>` element with policies to transform the GraphQL operation to an HTTP request. See [Supported elements in http-request](#supported-elements-in-http-request).
    1. Optionally add an `<http-response>` element, and add child policies to transform the HTTP response of the resolver. See [Supported elements in http-response](#supported-elements-in-http-response). If the `<http-response>` element isn't specified, the response is returned as a raw string.
    1. Select **Create**.
    
        :::image type="content" source="media/configure-graphql-resolver/configure-resolver-policy.png" alt-text="Screenshot of resolver policy editor in the portal.":::

1. The resolver is attached to the field. Go to the **Resolvers** tab to list and manage the resolvers configured for the API.

    :::image type="content" source="media/configure-graphql-resolver/list-resolvers.png" alt-text="Screenshot of the resolvers list for GraphQL API in the portal.":::

    > [!TIP]
    > The **Linked** column indicates whether or not the resolver is configured for a field that's currently in the GraphQL schema. If a resolver isn't linked, it can't be invoked.

## http-data-source elements

The `<http-data-source>` element consists of a required `<http-request>` element followed optionally by an `<http-response>` element.

### Supported elements in http-request

> [!NOTE]
> Each child element may be specified at most once. Elements must be specified in the order listed.


|Element|Description|Required|
|----------|-----------------|--------------|
| set-method| Method of the resolver's HTTP request, configured using the [set-method](set-method-policy.md) policy.  |   Yes    | 
| set-url  |  URL of the resolver's HTTP request. | Yes  | 
| set-header  | Header set in the resolver's HTTP request, configured using the [set-header](set-header-policy.md) policy.  | No  | 
| set-body  |  Body set in the resolver's HTTP request, configured using the [set-body](set-body-policy.md) policy. | No  | 
| authentication-certificate  | Client certificate presented in the resolver's HTTP request, configured using the [authentication-certificate](authentication-certificate-policy.md) policy.  | No  | 


### Supported elements in http-response

> [!NOTE]
> Each child element may be specified at most once. Elements must be specified in the order listed.

|Name|Description|Required|
|----------|-----------------|--------------|
| json-to-xml   | Transforms the resolver's HTTP response using the [json-to-xml](json-to-xml-policy.md) policy. | No  | 
| xml-to-json   | Transforms the resolver's HTTP response using the [xml-to-json](xml-to-json-policy.md) policy. | No  | 
| find-and-replace   | Transforms the resolver's HTTP response using the [find-and-replace](find-and-replace-policy.md) policy. | No  | 



## GraphQL context

* The context for the HTTP request and HTTP response (if specified) differs from the context for the original gateway API request: 
  * `context.ParentResult` is set to the parent object for the current resolver execution.
  * `context.GraphQL` properties are set to the arguments (`Arguments`) and parent object (`Parent`) for the current resolver execution.
  * The HTTP request context contains arguments that are passed in the GraphQL query as its body. 
  * The HTTP response context is the response from the independent HTTP call made by the resolver, not the context for the complete response for the gateway request. 
The `context` variable that is passed through the request and response pipeline is augmented with the GraphQL context when used with a GraphQL resolver.

### context.ParentResult or context.GraphQL.parent

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

If you set a resolver for `parent-type="Blog" field="comments"`, you will want to understand which blog ID to use.  You can get the ID of the blog using `context.ParentResult.AsJObject()["id"].ToString()`. The policy for configuring this resolver would resemble:

``` xml
<http-data-source>
    <http-request>
        <set-method>GET</set-method>
        <set-url>@{
            var blogId = context.ParentResult.AsJObject()["id"].ToString();
            return $"https://data.contoso.com/api/blog/{blogId}";
        }</set-url>
    </http-request>
</http-data-source>
```

Alternatively, use `context.GraphQL.Parent["id"]` as shown in the following resolver:

``` xml
<http-data-source>
    <http-request>
        <set-method>GET</set-method>
        <set-url>@($"https://data.contoso.com/api/blog/{context.GraphQL.Parent["id"]}";
        }</set-url>
    </http-request>
</http-data-source>
```

### context.GraphQL.Arguments

The arguments for a parameterized GraphQL query are added to the body of the request.  For example, consider the following two queries:

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

When the resolver is executed, the `arguments` property is added to the body.  You can define the resolver as follows:

``` xml
<http-data-source>
    <http-request>
        <set-method>GET</set-method>
        <set-url>@($"https://data.contoso.com/api/comment/{context.GraphQL.Arguments["id"]}")</set-url>
    </http-request>
</http-data-source>
```

## Resolver examples

### Resolver for GraphQL query

The following example resolves a query by making an HTTP `GET` call to a backend data source.

#### Example schema

```
type Query {
    users: [User]
}

type User {
    id: String!
    name: String!
}
```

#### Example resolver

```xml
<http-data-source>
    <http-request>
        <set-method>GET</set-method>
        <set-url>https://data.contoso.com/get/users</set-url>
    </http-request>
</http-data-source>
```

### Resolver for a GraqhQL query that returns a list, using a liquid template

The following example uses a liquid template, supported for use in the [set-body](set-body-policy.md) policy, to return a list in the HTTP response to a query.  It also renames the `username` field in the response from the REST API to `name` in the GraphQL response.

#### Example schema

```
type Query {
    users: [User]
}

type User {
    id: String!
    name: String!
}
```

#### Example resolver for users query

```xml
<http-data-source>
    <http-request>
        <set-method>GET</set-method>
        <set-url>https://data.contoso.com/users</set-url>
    </http-request>
    <http-response>
        <set-body template="liquid">
            [
                {% JSONArrayFor elem in body %}
                    {
                        "name": "{{elem.username}}"
                    }
                {% endJSONArrayFor %}
            ]
        </set-body>
    </http-response>
</http-data-source>
```

### Resolver for GraphQL mutation

The following example resolves a mutation that inserts data by making a `POST` request to an HTTP data source. The policy expression in the `set-body` policy of the HTTP request modifies a `name` argument that is passed in the GraphQL query as its body.  The body that is sent will look like the following JSON:

``` json
{
    "name": "the-provided-name"
}
```

#### Example schema

```
type Query {
    users: [User]
}

type Mutation {
    makeUser(name: String!): User
}

type User {
    id: String!
    name: String!
}
```

#### Example resolver for makeUser mutation

```xml
<http-data-source>
    <http-request>
        <set-method>POST</set-method>
        <set-url> https://data.contoso.com/user/create </set-url>
        <set-header name="Content-Type" exists-action="override">
            <value>application/json</value>
        </set-header>
        <set-body>@{
            var args = context.Request.Body.As<JObject>(true)["arguments"];  
            JObject jsonObject = new JObject();
            jsonObject.Add("name", args["name"])
            return jsonObject.ToString();
        }</set-body>
    </http-request>
</http-data-source>
```

## Related policies

* [API Management policies for GraphQL APIs](graphql-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]