---
title: Azure API Management policy reference - validate-graphql-request | Microsoft Docs
description: Reference for the validate-graphql-request policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 12/02/2022
ms.author: danlep
---

# Validate GraphQL request

The `validate-graphql-request` policy validates the GraphQL request and authorizes access to specific query paths. An invalid query is a "request error". Authorization is only done for valid requests. 

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml
<validate-graphql-request error-variable-name="variable name" max-size="size in bytes" max-depth="query depth">
    <authorize>
        <rule path="query path, for example: '/listUsers' or '/__*'" action="string or policy expression that evaluates to 'allow | remove | reject | ignore'" />
    </authorize>
</validate-graphql-request>
```

## Attributes

| Attribute         | Description                                            | Required | Default |
| ----------------- | ------------------------------------------------------ | -------- | ------- |
| error-variable-name | Name of the variable in `context.Variables` to log validation errors to. Policy expressions are allowed. |   No    | N/A   |
| max-size | Maximum size of the request payload in bytes. Maximum allowed value: 102,400 bytes (100 KB). (Contact [support](https://azure.microsoft.com/support/options/) if you need to increase this limit.) Policy expressions are allowed. | Yes       | N/A   |
| max-depth | An integer. Maximum query depth. Policy expressions are allowed. | No | 6 |


## Elements

|Name|Description|Required|
|----------|-----------------|--------------|
| authorize | Add this element to set an appropriate authorization rule for one or more paths. | No |
| rule | Add one or more of these elements to authorize specific query paths. Each rule can optionally specify a different [action](#request-actions). May be specified conditionally using a policy expression. | No |


### rule attributes

| Attribute         | Description                                            | Required | Default |
| ----------------- | ------------------------------------------------------ | -------- | ------- |
| path | Path to execute authorization validation on. It must follow the pattern: `/type/field`. | Yes | N/A |
| action | [Action](#request-actions) to perform if the rule applies. May be specified conditionally using a policy expression. |  No     | allow   |

### Introspection system
   
The policy for path=`/__*` is the [introspection](https://graphql.org/learn/introspection/) system. You can use it to reject introspection requests (`__schema`, `__type`, etc.). 

### Request actions

Available actions are described in the following table.

|Action |Description  |
|---------|---------|
|reject     | A request error happens, and the request is not sent to the backend. Additional rules if configured are not applied.   |
|remove     | A field error happens, and the field is removed from the request.         |
|allow     | The field is passed to the backend.        |
|ignore     | The rule is not valid for this case and the next rule is applied.        |  

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

### Usage notes
  
Because GraphQL queries use a flattened schema, permissions may be applied at any leaf node of an output type: 

* Mutation, query, or subscription
* Individual field in a type declaration 

Permissions may not be applied to:
 
* Input types
* Fragments
* Unions
* Interfaces
* The schema element  
 
## Error handling

Failure to validate against the GraphQL schema, or a failure for the request's size or depth, is a request error and results in the request being failed with an errors block (but no data block). 

Similar to the [`Context.LastError`](api-management-error-handling-policies.md#lasterror) property, all GraphQL validation errors are automatically propagated in the `GraphQLErrors` variable. If the errors need to be propagated separately, you can specify an error variable name. Errors are pushed onto the `error` variable and the `GraphQLErrors` variable. 

## Examples

### Query validation

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

### Mutation validation

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

## Related policies

* [API Management policies for GraphQL APIs](graphql-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]