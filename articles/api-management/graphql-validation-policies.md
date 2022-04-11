---
title: Azure API Management validation policy for GraphQL requests | Microsoft Docs
description: Reference for an Azure API Management policy to validate and authorize GraphQL requests. Provides policy usage, settings, and examples.
services: api-management
author: dlepow
ms.service: api-management
ms.topic: reference
ms.date: 03/07/2022
ms.author: danlep
ms.custom: ignite-fall-2021
---

# API Management policy to validate and authorize GraphQL requests (preview)

This article provides a reference for an API Management policy to validate and authorize requests to a [GraphQL API](graphql-api.md) imported to API Management.

[!INCLUDE [api-management-policy-intro-links](../../includes/api-management-policy-intro-links.md)]

## Validation policy

| Policy | Description |
| ------ | ----------- |
| [Validate GraphQL request](#validate-graphql-request) | Validates and authorizes a request to a GraphQL API. |


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

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

-   **Policy sections:** inbound

-   **Policy scopes:** all scopes

## Error handling

Failure to validate against the GraphQL schema, or a failure for the request's size or depth, is a request error and results in the request being failed with an errors block (but no data block). 

Similar to the [`Context.LastError`](api-management-error-handling-policies.md#lasterror) property, all GraphQL validation errors are automatically propagated in the `GraphQLErrors` variable. If the errors need to be propagated separately, you can specify an error variable name. Errors are pushed onto the `error` variable and the `GraphQLErrors` variable. 

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]