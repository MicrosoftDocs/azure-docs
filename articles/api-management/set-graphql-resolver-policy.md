---
title: Azure API Management policy reference - set-graphql-resolver | Microsoft Docs
description: Reference for the set-graphql-resolver policy in Azure API Management. Provides policy usage, settings, and examples. This policy is retired.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 03/07/2023
ms.author: danlep
---

# Set GraphQL resolver (retired)

> [!IMPORTANT]
> * The `set-graphql-resolver` policy is retired. Customers using the `set-graphql-resolver` policy must migrate to the [managed resolvers](configure-graphql-resolver.md) for GraphQL APIs, which provide enhanced functionality. 
> * After you configure a managed resolver for a GraphQL field, the gateway skips the `set-graphql-resolver` policy in any policy definitions. You can't combine use of managed resolvers and the `set-graphql-resolver` policy in your API Management instance. 


The `set-graphql-resolver` policy retrieves or sets data for a GraphQL field in an object type specified in a GraphQL schema. The schema must be imported to API Management. Currently the data must be resolved using an HTTP-based data source (REST or SOAP API). 

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml
<set-graphql-resolver parent-type="type" field="field"> 
    <http-data-source> 
        <http-request> 
            <set-method>...set-method policy configuration...</set-method> 
            <set-url>URL</set-url>
            <set-header>...set-header policy configuration...</set-header>
            <set-body>...set-body policy configuration...</set-body>
            <authentication-certificate>...authentication-certificate policy configuration...</authentication-certificate>  
        </http-request> 
        <http-response>
            <set-body>...set-body policy configuration...</set-body>
            <xml-to-json>...xml-to-json policy configuration...</xml-to-json>
            <find-and-replace>...find-and-replace policy configuration...</find-and-replace>
        </http-response>
      </http-data-source> 
</set-graphql-resolver> 
```

## Attributes

| Attribute         | Description                                            | Required | Default |
| ----------------- | ------------------------------------------------------ | -------- | ------- |
| parent-type| An object type in the GraphQL schema.  |   Yes    | N/A   |
| field| A field of the specified `parent-type` in the GraphQL schema.  |   Yes    | N/A   |

> [!NOTE]
> Currently, the values of `parent-type` and `field` aren't validated by this policy. If they aren't valid, the policy is ignored, and the GraphQL query is forwarded to a GraphQL endpoint (if one is configured).

## Elements

|Name|Description|Required|
|----------|-----------------|--------------|
| http-data-source | Configures the HTTP request and optionally the HTTP response that are used to resolve data for the given `parent-type` and `field`.   | Yes |
| http-request | Specifies a URL and child policies to configure the resolver's HTTP request.  | Yes | 
| http-response |  Optionally specifies child policies to configure the resolver's HTTP response. If not specified, the response is returned as a raw string.   | 

### http-request elements

> [!NOTE]
> Except where noted, each child element may be specified at most once. Specify elements in the order listed.

|Element|Description|Required|
|----------|-----------------|--------------|
| [set-method](set-method-policy.md) | Sets the method of the resolver's HTTP request.  |   Yes    | 
| set-url  |  Sets the URL of the resolver's HTTP request. | Yes  | 
| [set-header](set-header-policy.md)  | Sets a header in the resolver's HTTP request. If there are multiple headers, then add additional `header` elements.  | No  | 
| [set-body](set-body-policy.md)  |  Sets the body in the resolver's HTTP request. | No  | 
| [authentication-certificate](authentication-certificate-policy.md)  | Authenticates using a client certificate in the resolver's HTTP request.  | No  | 

### http-response elements

> [!NOTE]
> Each child element may be specified at most once. Specify elements in the order listed.

|Name|Description|Required|
|----------|-----------------|--------------|
| [set-body](set-body-policy.md)  |  Sets the body in the resolver's HTTP response. | No  |
| [xml-to-json](xml-to-json-policy.md)   | Transforms the resolver's HTTP response from XML to JSON. | No  | 
| [find-and-replace](find-and-replace-policy.md)   | Finds a substring in the resolver's HTTP response and replaces it with a different substring. | No  |

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) backend
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) dedicated

### Usage notes

* This policy is invoked only when a matching GraphQL query is executed. 
* The policy resolves data for a single field. To resolve data for multiple fields, configure multiple occurrences of this policy in a policy definition.

## GraphQL context

* The context for the HTTP request and HTTP response (if specified) differs from the context for the original gateway API request: 
  * `context.ParentResult` is set to the parent object for the current resolver execution.
  * The HTTP request context contains arguments that are passed in the GraphQL query as its body. 
  * The HTTP response context is the response from the independent HTTP call made by the resolver, not the context for the complete response for the gateway request. 
The `context` variable that is passed through the request and response pipeline is augmented with the GraphQL context when used with `<set-graphql-resolver>` policies.

### ParentResult

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

If you set a resolver for `parent-type="Blog" field="comments"`, you will want to understand which blog ID to use.  You can get the ID of the blog using `context.ParentResult.AsJObject()["id"].ToString()`.  The policy for configuring this resolver would resemble:

``` xml
<set-graphql-resolver parent-type="Blog" field="comments">
    <http-data-source>
        <http-request>
            <set-method>GET</set-method>
            <set-url>@{
                var blogId = context.ParentResult.AsJObject()["id"].ToString();
                return $"https://data.contoso.com/api/blog/{blogId}";
            }</set-url>
        </http-request>
    </http-data-source>
</set-graphql-resolver>
```

### Arguments

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
<set-graphql-resolver parent-type="Blog" field="comments">
    <http-data-source>
        <http-request>
            <set-method>GET</set-method>
            <set-url>@{
                var commentId = context.Request.Body.As<JObject>(true)["arguments"]["id"];
                return $"https://data.contoso.com/api/comment/{commentId}";
            }</set-url>
        </http-request>
    </http-data-source>
</set-graphql-resolver>
```

## More examples

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

#### Example policy

```xml
<set-graphql-resolver parent-type="Query" field="users">
    <http-data-source>
        <http-request>
            <set-method>GET</set-method>
            <set-url>https://data.contoso.com/get/users</set-url>
        </http-request>
    </http-data-source>
</set-graphql-resolver>
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

#### Example policy

```xml
<set-graphql-resolver parent-type="Query" field="users">
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
</set-graphql-resolver>
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

#### Example policy

```xml
<set-graphql-resolver parent-type="Mutation" field="makeUser">
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
</set-graphql-resolver>
```

## Related policies

* [API Management policies for GraphQL APIs](graphql-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]