---
title: Azure API Management policy reference - http-data-source | Microsoft Docs
description: Reference for the http-data-source resolver policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: reference
ms.date: 02/23/2023
ms.author: danlep
---

# HTTP data source for a resolver

The `http-data-source` resolver policy configures the HTTP request and optionally the HTTP response to resolve data for an object type and field in a GraphQL schema. The schema must be imported to API Management.  

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml 
<http-data-source> 
    <http-request> 
        <set-method>...set-method policy configuration...</set-method> 
        <set-url>URL</set-url>
        <set-header>...set-header policy configuration...</set-header>
        <set-body>...set-body policy configuration...</set-body>
        <authentication-certificate>...authentication-certificate policy configuration...</authentication-certificate>  
    </http-request> 
    <http-response>
        <xml-to-json>...xml-to-json policy configuration...</xml-to-json>
        <find-and-replace>...find-and-replace policy configuration...</find-and-replace>
        <set-body>...set-body policy configuration...</set-body>
        <publish-event>...publish-event policy configuration...</publish-event>
    </http-response>
</http-data-source> 
```

## Elements

|Name|Description|Required|
|----------|-----------------|--------------|
| http-request | Specifies a URL and child policies to configure the resolver's HTTP request. Each child element can be specified at most once. | Yes | 
| http-response |  Optionally specifies child policies to configure the resolver's HTTP response. If not specified, the response is returned as a raw string. Each child element can be specified at most once.  | No |

### http-request elements

> [!NOTE]
> Each child element may be specified at most once. Specify elements in the order listed.


|Element|Description|Required|
|----------|-----------------|--------------|
| [set-method](set-method-policy.md) | Sets the method of the resolver's HTTP request.  |   Yes    | 
| set-url  |  Sets the URL of the resolver's HTTP request. | Yes  | 
| [set-header](set-header-policy.md)  | Sets a header in the resolver's HTTP request.  | No  | 
| [set-body](set-body-policy.md)  |  Sets the body in the resolver's HTTP request. | No  | 
| [authentication-certificate](authentication-certificate-policy.md)  | Authenticates using a client certificate in the resolver's HTTP request.  | No  | 

### http-response elements

> [!NOTE]
> Each child element may be specified at most once. Specify elements in the order listed.

|Name|Description|Required|
|----------|-----------------|--------------|
| [xml-to-json](xml-to-json-policy.md)   | Transforms the resolver's HTTP response from XML to JSON. | No  | 
| [find-and-replace](find-and-replace-policy.md)   | Finds a substring in the resolver's HTTP response and replaces it with a different substring. | No  |
| [set-body](set-body-policy.md)  |  Sets the body in the resolver's HTTP response. | No  |
| [publish-event](publish-event-policy.md) | Publishes an event to one or more subscriptions specified in the GraphQL API schema. | No |

## Usage

- [**Policy scopes:**](./api-management-howto-policies.md#scopes) GraphQL resolver
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption

### Usage notes

* This policy is invoked only when resolving a single field in a matching GraphQL query, mutation, or subscription. 

## Examples

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

#### Example policy

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

#### Example policy

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

* [GraphQL resolver policies](api-management-policies.md#graphql-resolver-policies)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]