---
title: Azure API Management policy reference - publish-event | Microsoft Docs
description: Reference for the publish-event policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 05/24/2023
ms.author: danlep
---

# Publish event to GraphQL subscription

The `publish-event` policy publishes an event to one or more subscriptions specified in a GraphQL API schema. Configure the policy in a [GraphQL resolver](configure-graphql-resolver.md) for a related field in the schema for another operation type such as a mutation. At runtime, the event is published to connected GraphQL clients. Learn more about [GraphQL APIs in API Management](graphql-apis-overview.md).

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml
<http-data-source>
<!-- http-data-source is an example resolver policy -->
    <http-request>
    [...]
    </http-request>
    <http-response>
        [...]
        <publish-event>
            <targets>
                <graphql-subscription id="subscription field" />
            </targets>
        </publish-event>
    </http-response>
</http-data-source>
```

## Elements

|Name|Description|Required|
|----------|-----------------|--------------|
| targets | One or more subscriptions in the GraphQL schema, specified in `target` subelements, to which the event is published.   | Yes |


## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) `http-response` element in `http-data-source` resolver
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) GraphQL resolver only
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption

### Usage notes

* This policy is invoked only when a related GraphQL query or mutation is executed.

## Example

The following example policy definition is configured in a resolver for the `createUser` mutation. It publishes an event to the `onUserCreated` subscription.

### Example schema

```
type User {
  id: Int!
  name: String!
}


type Mutation {
    createUser(id: Int!, name: String!): User
}

type Subscription {
    onUserCreated: User!
}
```

### Example policy

```xml
<http-data-source>
    <http-request>
        <set-method>POST</set-method>
        <set-url>https://contoso.com/api/user</set-url>
        <set-body template="liquid">{ "id" : {{body.arguments.id}}, "name" : "{{body.arguments.name}}"}</set-body>
    </http-request>
    <http-response>
        <publish-event>
            <targets>
                <graphql-subscription id="onUserCreated" />
            </targets>
        </publish-event>
    </http-response>
</http-data-source>
```

## Related policies

* [GraphQL resolver policies](api-management-policies.md#graphql-resolver-policies)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]