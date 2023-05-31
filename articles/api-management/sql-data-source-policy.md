---
title: Azure API Management policy reference - sql-data-source | Microsoft Docs
description: Reference for the sql-data-source resolver policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: reference
ms.date: 05/30/2023
ms.author: danlep
---

# Azure SQL data source for a resolver

The `sql-data-source` resolver policy configures a Transact-SQL (T-SQL) request to an Azure SQL database and optional response to resolve data for an object type and field in a GraphQL schema. The schema must be imported to API Management.  

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml 
<sql-data-source> 
    <connection-info>
        <get-authorization-context>...get-authorization-context policy configuration...</get-authorization-context>
        <connection-string use-managed-identity="true | false" client-id="Client ID of identity used for connection">
            "SQL Azure connection string"
        </connection-string>
        <include-fragment>...include-fragment policy configuration...</include-fragment>
        <authentication-certificate>...authentication-certificate policy configuration...</authentication-certificate>     
    </connection-info>
    <include-fragment>...include-fragment policy configuration...</include-fragment>
    <request single-result="true | false">
        <include-fragment>...include-fragment policy configuration...</include-fragment>
        <set-body>...set-body policy configuration...</set-body>
        <sql-statement>T-SQL query string</sql-statement>
        <sql-parameters>
            <parameter sql-type="parameter type" name="Query parameter name in @ notation"
                "Value of query parameter"
            </parameter>
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
| [connection-info](#connection-info-elements) | Specifies connection to Azure SQL database. | Yes |
| [include-fragment](include-fragment-policy.md) | Inserts a policy fragment in the policy definition. If there are multiple fragments, then add additional `include-fragment` elements. | No |
| [request](#request-attribute) | Specifies the resolver's T-SQL request and optional parameters.  | Yes | 
| [response](#response-elements) |  Optionally specifies child policies to configure the response from the Azure SQL database. If not specified, the response is returned as a raw string.  | No |

### connection-info elements

> [!NOTE]
> Except where noted, each child element may be specified at most once. Specify elements in the order listed.


|Element|Description|Required|
|----------|-----------------|--------------|
| [get-authorization-context](get-authorization-context-policy.md) | Gets an authorization context for the resolver's SQL request.  | No |
| [connection-string](#connection-string-attributes) | Specifies the SQL Azure connection string. If the `use-managed-identity` attribute is set to `false` (default), the connection string must include a username and password. |  Yes |
| [include-fragment](include-fragment-policy.md) | Inserts a policy fragment in the policy definition. If there are multiple fragments, then add additional `include-fragment` elements. | No |
| [authentication-certificate](authentication-certificate-policy.md)  | Authenticates using a client certificate in the resolver's SQL request.  | No  | 

### connection-string attributes

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| use-managed-identity | Boolean. Specifies whether to use a [managed identity](api-management-howto-use-managed-service-identity.md) assigned to the API Management instance for connection to the Azure SQL database in place of a username and password in the connection string. Policy expressions are allowed. <br/><br/>The identity must be [configured](#configure-managed-identity-integration-with-sql-azure) to perform the request on the Azure SQL database.  | No  | `false`   |
| client-id | If `use-managed-identity` is `true` and a user-assigned managed identity is used, the client ID of the identity.<br/><br/>The identity must be [configured](#configure-managed-identity-integration-with-sql-azure) to perform the request on the Azure SQL database. | No | N/A |

## request attribute

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| single-result | Boolean. Specifies whether the request is a single-result query. Policy expressions are allowed  | No  | `false`   |

### request elements

> [!NOTE]
> Each child element may be specified at most once. Specify elements in the order listed.

|Element|Description|Required|
|----------|-----------------|--------------|
 | [include-fragment](include-fragment-policy.md) | Inserts a policy fragment in the policy definition.  | No |
| [set-body](set-body-policy.md)  |  Sets the body in the resolver's SQL request. | No  | 
| sql-statement | A T-SQL statement for the request to the Azure SQL database. | Yes |
| [parameters](#parameter-attributes) | A list of SQL parameters, in `parameter` subelements, for the request.  | No |


### parameter attributes

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| name   | String. The name of the SQL parameter.   | Yes     |  N/A   |
|  sql-type  | String. The [data type](/sql/t-sql/data-types/data-types-transact-sql) of the SQL parameter.  |   No  |  N/A     |

### response elements

> [!NOTE]
> Each child element may be specified at most once. Specify elements in the order listed.

|Name|Description|Required|
|----------|-----------------|--------------|
| [include-fragment](include-fragment-policy.md) | Inserts a policy fragment in the policy definition. | No |
| [set-body](set-body-policy.md)  |  Sets the body in the resolver's SQL response. | No  |
| [publish-event](publish-event-policy.md) | Publishes an event to one or more subscriptions specified in the GraphQL API schema. | No |

## Usage

- [**Policy scopes:**](./api-management-howto-policies.md#scopes) GraphQL resolver
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption

### Usage notes

* This policy is invoked only when resolving a single field in a matching GraphQL query. 

## Configure managed identity integration with SQL Azure

You can use an API Management managed identity to connect to a SQL Azure database, instead of configuring a username and password in a connection string.

[...TBD...]

## Examples

### Resolver for GraphQL query by making single T-SQL request

The following example resolves a query by making a single T-SQL request to a backend database. The connection string uses username and password. The response is returned as a raw string.


#### Example policy

```xml
<sql-data-source>
    <connection-info>
        <connection-string>Azure SQL connection string</connection-string>
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
        <connection-string use-managed-identity="true">
            Azure SQL connection string
        </connection-string>
    </connection-info> 
    <request single-result="true"> 
        <sql-statement> 
            SELECT 
                p.[Id] AS [Id] 
                p.[FirstName] AS [FirstName] 
                p.[LastName] AS [LastName] 
            FROM [Person] p 
            WHERE @personId = p.[Id] 
         </sql-statement> 
         <parameters> 
             <parameter name="@personId">{{context.GraphQL.Arguments.id}}</parameter> 
          </parameters> 
     </request>
</sql-data-source>
```


## Related policies

* [GraphQL resolver policies](api-management-policies.md#graphql-resolver-policies)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]