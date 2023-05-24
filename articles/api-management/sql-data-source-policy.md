---
title: Azure API Management policy reference - sql-data-source | Microsoft Docs
description: Reference for the sql-data-source resolver policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: reference
ms.date: 05/24/2023
ms.author: danlep
---

# SQL Azure data source for a resolver

The `sql-data-source` resolver policy configures the SQL Azure request and optional response to resolve data for an object type and field in a GraphQL schema. The schema must be imported to API Management.  

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml 
<sql-data-source> 
    <connection-info>
        <get-authorization-context>...get-authorization-context policy configuration...</get-authorization-context>
        <connection-string use-managed-identity="true | false" scope="scope for ..." client-id="Client ID of identity used for connection">
            "SQL Azure connection string"
        </connection-string>
        <include-fragment>...include-fragment policy configuration...</include-fragment>
        <authentication-certificate>...authentication-certificate policy configuration...</authentication-certificate>     
    </connection-info>
    <include-fragment>...include-fragment policy configuration...</include-fragment>
    <request single-result="true | false">
        <include-fragment>...include-fragment policy configuration...</include-fragment>
        <set-body>...set-body policy configuration...</set-body>
        <sql-statement>SQL statement string</sql-statement>
        <sql-parameters>
            <parameter>"SQL parameter string"</parameter>
            <!-- if there are multiple parameters, then add additional parameter elements -->
        </sql-parameters>
    </request>
    <response>
        <include-fragment>...include-fragment policy configuration...</include-fragment>
        <set-body>...set-body policy configuration...</set-body>
        <publish-event>...publish-event policy configuration...</publish-event>
    </response>
</sql-data-source> 
```


## Elements

|Name|Description|Required|
|----------|-----------------|--------------|
| connection-info | .... | Yes |
| [include-fragment](include-fragment-policy.md) | Inserts a policy fragment in the policy definition. If there are multiple fragments, then add additional `include-fragment` elements. | No |
| request | Specifies the resolvers' SQL request and optional parameters.  | Yes | 
| response |  Optionally specifies child policies to configure the resolver's SQL response. If not specified, the response is returned as a raw string.  | No |

### connection-info attributes

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| use-managed-identity | ...  | No  | false   |
| scope | ... | No | N/A |
| client-id | ... | No | N/A |

### connection-info elements

> [!NOTE]
> Except where noted, each child element may be specified at most once. Specify elements in the order listed.


|Element|Description|Required|
|----------|-----------------|--------------|
| [get-authorization-context](get-authorization-context-policy.md) | Gets an authorization context for the resolver's SQL request.  | No |
| connection-string | Specifies the SQL Azure connection string. |  Yes |
| [include-fragment](include-fragment-policy.md) | Inserts a policy fragment in the policy definition. If there are multiple fragments, then add additional `include-fragment` elements. | No |
| [authentication-certificate](authentication-certificate-policy.md)  | Authenticates using a client certificate in the resolver's SQL request.  | No  | 


## request attribute

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| single-result | ...  | No  | false   |

### request elements

> [!NOTE]
> Except where noted, each child element may be specified at most once. Specify elements in the order listed.

|Element|Description|Required|
|----------|-----------------|--------------|
 | [include-fragment](include-fragment-policy.md) | Inserts a policy fragment in the policy definition.  | No |
| [set-body](set-body-policy.md)  |  Sets the body in the resolver's SQL request. | No  | 
| statement | .... | Yes |
| parameters | A list of SQL parameters, in `parameter` subelements.  | No |


### parameter attributes

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| name   | String. The name of the SQL parameter.   | Yes     |  N/A   |
|  sql-type  | String. The type of the SQL parameter.  |   No  |  N/A     |

### response elements

> [!NOTE]
> Except where noted, each child element may be specified at most once. Specify elements in the order listed.

|Name|Description|Required|
|----------|-----------------|--------------|
| [include-fragment](include-fragment-policy.md) | Inserts a policy fragment in the policy definition. | No |
| [set-body](set-body-policy.md)  |  Sets the body in the resolver's SQL response. | No  |
| [publish-event](publish-event-policy.md) | Publishes an event to one or more subscriptions specified in the GraphQL API schema. | No |

## Usage

- [**Policy scopes:**](./api-management-howto-policies.md#scopes) GraphQL resolver
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption

### Usage notes

* This policy is invoked only when resolving a single field in a matching GraphQL query, mutation, or subscription. 

## Examples

### Resolver for GraphQL query

The following example resolves a query by making a SQL request to a backend database.

#### Example schema

TODO

#### Example policy

```xml
<sql-data-source>
    <connection-info>
        <connection-string>{{0}}</connection-string>
        </connection-info>
        <request single-result="true">
            <sql-statement>
                SELECT f.[Id] AS [id], f.[Name] AS [name] FROM [Family] f WHERE 1 = f.[Id]</sql-statement>
        </request>
        <response />
</sql-data-source>
```

### Example for ....


TBD

#### Example policy


```xml
<sql-data-source> 
    <connection-info>
        <connection-string use-managed-identity=""true"" client-id=""optional-value"" scope=""optional-value"">{{connectionString}}</connection-string>
    </connection-info> 
    <request single-result="true"> 
        <sql-statement> 
            SELECT TOP (1) 
                p.[Id] AS [Id] 
                p.[FirstName] AS [FirstName] 
                p.[LastName] AS [LastName] 
            FROM [Person] p 
            WHERE @personId = p.[Id] 
         </sql-statement> 
         <parameters> 
             <parameter name=""@personId"">{{context.GraphQL.Arguments.id}}</parameter> 
          </parameters> 
     </request>
</sql-data-source>
```


## Related policies

* [GraphQL resolver policies](api-management-policies.md#graphql-resolver-policies)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]