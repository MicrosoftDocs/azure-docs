---
title: Azure API Management validation policies for GraphQL requests | Microsoft Docs
description: Learn about policies you can use in Azure API Management to validate and authorize GraphQL requests.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 10/07/2021
ms.author: danlep
---

# API Management policies to validate and authorize GraphQL requests

This article provides a reference for the following API Management policies. For information on adding and configuring policies, see [Policies in API Management](./api-management-policies.md).

Use the following validation policies to validate and authorize requests to a [GraphQL API](graphql-api.md) imported to API Management.

## Validation policies

- [Validate GraphQL request](#validate-graphql-request) - Validates and authorizes a request to a GraphQL API.

## Validate GraphQL request

The `validate-graphql-request` policy validates the GraphQL request and authorizes access to specific query paths. An invalid query is a "request error". Authorization is only done for valid requests. 

* Because GraphQL queries use a flattened schema, permissions may be applied at any leaf node of an output type: a mutation, query, or subscription, or individual field in a type declaration. Permissions may not be applied to input types, fragments, unions, interfaces, or the schema element.   
* There can be multiple authorization sub-policies. The most specific path is used to select the appropriate authorization rule for each leaf node in the query. Each authorization can optionally provide a different action, and `if` clauses allow the admin to specify conditional actions.  
* The policy for path=`/__*` is the [introspection](https://graphql.org/learn/introspection/) policy and can be used to reject introspection requests (`__schema`, `__type`, etc.).   

### Policy statement

```xml
<validate-graphql-request error-variable-name="variable name" max-size="size in bytes" max-depth="query depth">
    <authorize-path="query path, for example: /Query/list Users or /__*" action="allow|remove|reject" />
        <if condition="policy expression" action="allow|remove|reject" />
</validate-graphql-request>
```

### Example

The following example validates a GraphQL query. Requests larger than 100 kb or with query depth greater than 4 are rejected. Access to the following querty paths is rejected: the introspection path and the `list Users` query. 

```xml
<validate-graphql-request error-variable-name="name" max-size="102400" max-depth="4"> 
    <authorize path="/" action="allow" /> 
    <authorize path="/__*" action="reject" /> 
    <authorize path="/Query/list Users" action="reject" /> 
    </authorize> 
</validate-graphql-request> 
```

### Elements

| Name         | Description                                                                                                                                   | Required |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| validate-graphql-request | Root element.                                                                                                                               | Yes      |
| authorize | Add one or more of these elements to provides field-level authorization with both request- and field-level errors.   | Yes |
| if | Add one or more of these elements for conditional changse to the action for a field-level authorization. | No |

### Attributes

| Name                       | Description                                                                                                                                                            | Required | Default |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| error-variable-name | Name of the variable in `context.Variables` to log validation errors to.  |   No    | N/A   |
| max-size | Maximum size of the request payload in bytes. Maximum allowed value: 102,400 bytes (100 KB). (Contact [support](https://azure.microsoft.com/support/options/) if you need to increase this limit.) | Yes       | N/A   |
| max-depth | An integer. Maximum query depth. | No | 6 |
| path | Query path to execute authorization validation on. | Yes | N/A |
| action | [Action](#request-actions) to perform for the matching field. May be changed if a matching condition is specified. |  Yes     | N/A   |
| condition | Boolean value that determines if the [policy expression](api-management-policy-expressions.md) matches. The first matching condition is used. | No | N/A |

### Request actions

Available actions are described in the following table.

|Action |Description  |
|---------|---------|
|reject     | A request error happens, and the request is not sent to the back end   .     |
|remove     | A field error happens, and the field is removed from the request.         |
|allow     | The field is passed to the back end.        |

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

-   **Policy sections:** inbound

-   **Policy scopes:** all scopes

## Error handling

Failure to validate against the GraphQL schema, or a failure for the request's size or depth, is a request error and results in the request being failed with an errors block (but no data block). 

Errors are automatically propagated in the `GraphQLErrors` variable (similar to the [`Context.LastError`](api-management-error-handling-policies.md#lasterror) property, but for all GraphQL validation errors).  If the errors need to be propagated separately, the user may specify an error variable name. Errors are pushed onto the `error` variable in addition to the `GraphQLErrors` variable. 

## Next steps

For more information about working with policies, see:

-   [Policies in API Management](api-management-howto-policies.md)
-   [Transform APIs](transform-api.md)
-   [Policy reference](./api-management-policies.md) for a full list of policy statements and their settings
-   [Policy samples](./policy-reference.md)
-   [Error handling](./api-management-error-handling-policies.md)
