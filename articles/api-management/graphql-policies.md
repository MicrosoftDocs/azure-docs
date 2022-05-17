---
title: Azure API Management policies for GraphQL APIs | Microsoft Docs
description: Reference for Azure API Management policies to validate and resolve GraphQL API queries. Provides policy usage, settings, and examples.
services: api-management
author: dlepow
ms.service: api-management
ms.topic: reference
ms.date: 05/17/2022
ms.author: danlep
ms.custom: ignite-fall-2021
---

# API Management policies for GraphQL APIs

This article provides a reference for API Management policies to validate and resolve queries to GraphQL APIs.

[!INCLUDE [api-management-policy-intro-links](../../includes/api-management-policy-intro-links.md)]

## GraphQL API policies

- [Validate GraphQL request](#validate-graphql-request) - Validates and authorizes a request to a GraphQL API. 
- [Set GraphQL resolver](#set-graphql-resolver) - Retrieves or sets data for a GraphQL field in an object type specified in a GraphQL schema.

## Validate GraphQL request

The `validate-graphql-request` policy validates the GraphQL request and authorizes access to specific query paths. An invalid query is a "request error". Authorization is only done for valid requests. 

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]


**Permissions**  
Because GraphQL queries use a flattened schema:
* Permissions may be applied at any leaf node of an output type: 
    * Mutation, query, or subscription
    * Individual field in a type declaration. 
* Permissions may not be applied to: 
    * Input types
    * Fragments
    * Unions
    * Interfaces
    * The schema element   

**Authorize element**  
Configure the `authorize` element to set an appropriate authorization rule for one or more paths. 
* Each rule can optionally provide a different action.
* Use policy expressions to specify conditional actions. 

**Introspection system**   
The policy for path=`/__*` is the [introspection](https://graphql.org/learn/introspection/) system. You can use it to reject introspection requests (`__schema`, `__type`, etc.).   

### Policy statement

```xml
<validate-graphql-request error-variable-name="variable name" max-size="size in bytes" max-depth="query depth">
    <authorize>
        <rule path="query path, for example: '/listUsers' or '/__*'" action="string or policy expression that evaluates to 'allow|remove|reject|ignore'" />
    </authorize>
</validate-graphql-request>
```

### Example: Query validation

This example applies the following validation and authorization rules to a GraphQL query:
* Requests larger than 100 kb or with query depth greater than 4 are rejected. 
* Requests to the introspection system are rejected. 
* The `/Missions/name` field is removed from requests containing more than two headers. 

```xml
<validate-graphql-request error-variable-name="name" max-size="102400" max-depth="4"> 
    <authorize>
        <rule path="/__*" action="reject" /> 
        <rule path="/Missions/name" action="@(context.Request.Headers.Count > 2 ? "remove" : "allow")" />
    </authorize>
</validate-graphql-request> 
```

### Example: Mutation validation

This example applies the following validation and authorization rules to a GraphQL mutation:
* Requests larger than 100 kb or with query depth greater than 4 are rejected. 
* Requests to mutate the `deleteUser` field are denied except when the request is from IP address `198.51.100.1`. 

```xml
<validate-graphql-request error-variable-name="name" max-size="102400" max-depth="4"> 
    <authorize>
        <rule path="/Mutation/deleteUser" action="@(context.Request.IpAddress <> "198.51.100.1" ? "deny" : "allow")" />
    </authorize>
</validate-graphql-request> 
```

### Elements

| Name         | Description                                                                                                                                   | Required |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `validate-graphql-request` | Root element.                                                                                                                               | Yes      |
| `authorize` | Add this element to provide field-level authorization with both request- and field-level errors.   | No |
| `rule` | Add one or more of these elements to authorize specific query paths. Each rule can optionally specify a different [action](#request-actions). | No |

### Attributes

| Name                       | Description                                                                                                                                                            | Required | Default |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| `error-variable-name` | Name of the variable in `context.Variables` to log validation errors to.  |   No    | N/A   |
| `max-size` | Maximum size of the request payload in bytes. Maximum allowed value: 102,400 bytes (100 KB). (Contact [support](https://azure.microsoft.com/support/options/) if you need to increase this limit.) | Yes       | N/A   |
| `max-depth` | An integer. Maximum query depth. | No | 6 |
| `path` | Path to execute authorization validation on. It must follow the pattern: `/type/field`. | Yes | N/A |
| `action` | [Action](#request-actions) to perform if the rule applies. May be specified conditionally using a policy expression. |  No     | allow   |

### Request actions

Available actions are described in the following table.

|Action |Description  |
|---------|---------|
|`reject`     | A request error happens, and the request is not sent to the back end. Additional rules if configured are not applied.   |
|`remove`     | A field error happens, and the field is removed from the request.         |
|`allow`     | The field is passed to the back end.        |
|`ignore`     | The rule is not valid for this case and the next rule is applied.        |

### Error handling

Failure to validate against the GraphQL schema, or a failure for the request's size or depth, is a request error and results in the request being failed with an errors block (but no data block). 

Similar to the [`Context.LastError`](api-management-error-handling-policies.md#lasterror) property, all GraphQL validation errors are automatically propagated in the `GraphQLErrors` variable. If the errors need to be propagated separately, you can specify an error variable name. Errors are pushed onto the `error` variable and the `GraphQLErrors` variable. 

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

-   **Policy sections:** inbound

-   **Policy scopes:** all scopes

## Set GraphQL resolver

The `set-graphql-resolver` policy retrieves or sets data for a GraphQL field in an object type specified in a GraphQL schema. The schema must be imported to API Management. Currently the data must be resolved using an HTTP-based data source (REST or SOAP API). 

[!INCLUDE [preview-callout-graphql.md](./includes/preview/preview-callout-graphql.md)]

* This policy is invoked only when a matching GraphQL query is executed. 
* The policy resolves data for a single field. To resolve data for multiple fields, configure multiple occurrences of this policy in a policy definition.
* The context for the HTTP request and HTTP response (if specified) differs from the context for the original gateway API request: 
    * The HTTP request context contains arguments that are passed in the GraphQL query as its body. 
    * The HTTP response context is the response from the independent HTTP call made by the resolver, not the context for the complete response for the gateway request. 

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]


### Policy statement

```xml
<set-graphql-resolver parent-type="type" field="field"> 
    <http-data-source> 
        <http-request> 
            <set-method>HTTP method</set-method> 
            <set-url>URL</set-url>
            [...]  
        </http-request> 
        <http-response>
            [...]
        </http-response>
      </http-data-source> 
</set-graphql-resolver> 
```

### Examples

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

The following example uses a liquid template, supported for use in the [set-body](api-management-transformation-policies.md#SetBody) policy, to return a list in the HTTP response to a query. 

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
                            "name": "{{elem.title}}"
                        }
                    {% endJSONArrayFor %}
                ]
            </set-body>
        </http-response>
    </http-data-source>
</set-graphql-resolver>
```

### Resolver for GraphQL mutation

The following example resolves a mutation that inserts data by making a `POST` request to an HTTP data source. The policy expression in the `set-body` policy of the HTTP request modifies a `name` argument that is passed in the GraphQL query as its body.

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
                var body = context.Request.Body.As<JObject>(true);  
                JObject jsonObject = new JObject();
                jsonObject.Add("name", body["name"])
                return jsonObject.ToString();
            }</set-body>
        </http-request>
    </http-data-source>
</set-graphql-resolver>
```

### Elements

| Name         | Description                                                                                                                                   | Required |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `set-graphql-resolver` | Root element.                                                                                                                               | Yes      |
| `http-data-source` | Configures the HTTP request and optionally the HTTP response that are used to resolve data for the given `parent-type` and `field`.   | Yes |
| `http-request` | Specifies a URL and child policies to configure the resolver's HTTP request. Each of the following policies can be specified at most once in the element. <br/><br/>Required policy: [set-method](api-management-advanced-policies.md#SetRequestMethod)<br/><br/>Optional policies: [set-header](api-management-transformation-policies.md#SetHTTPheader), [set-body](api-management-transformation-policies.md#SetBody), [authentication-certificate](api-management-authentication-policies.md#ClientCertificate) | Yes |
| `set-url` | The URL of the resolver's HTTP request. | Yes |
| `http-response` |  Optionally specifies child policies to configure the resolver's HTTP response. If not specified, the response is returned as a raw string. Each of the following policies can be specified at most once. <br/><br/>Optional policies: [set-body](api-management-transformation-policies.md#SetBody), [json-to-xml](api-management-transformation-policies.md#ConvertJSONtoXML), [xml-to-json](api-management-transformation-policies.md#ConvertXMLtoJSON), [find-and-replace](api-management-transformation-policies.md#Findandreplacestringinbody) | No |

### Attributes

| Name                       | Description                                                                                                                                                            | Required | Default |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| `parent-type`| An object type in the GraphQL schema.  |   Yes    | N/A   |
| `field`| A field of the specified `parent-type` in the GraphQL schema.  |   Yes    | N/A   |

> [!NOTE]
> Currently, the values of `parent-type` and `field` aren't validated by this policy. If they aren't valid, the policy is ignored, and the GraphQL query is forwarded to a GraphQL endpoint (if one is configured).

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

-   **Policy sections:** backend

-   **Policy scopes:** all scopes

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]