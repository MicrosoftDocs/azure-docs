---
title: Azure API Management policy reference - sql-data-source | Microsoft Docs
description: Reference for the sql-data-source resolver policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: reference
ms.date: 05/31/2023
ms.author: danlep
---

# Azure SQL data source for a resolver

The `sql-data-source` resolver policy configures a Transact-SQL (T-SQL) request to an [Azure SQL](/azure/azure-sql/azure-sql-iaas-vs-paas-what-is-overview) database and an optional response to resolve data for an object type and field in a GraphQL schema. The schema must be imported to API Management.  

> [!NOTE]
> This policy is currently in preview.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml 
<sql-data-source> 
    <connection-info>
        <get-authorization-context>...get-authorization-context policy configuration...</get-authorization-context>
        <connection-string use-managed-identity="true | false" client-id="Client ID of identity used for connection">
            SQL Azure connection string
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

### request attribute

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

* To configure and manage a resolver with this policy, see [Configure a GraphQL resolver](configure-graphql-resolver.md).
* This policy is invoked only when resolving a single field in a matching GraphQL query. 

## Configure managed identity integration with SQL Azure

You can configure an API Management managed identity for access to Azure SQL instead of configuring SQL authentication with username and password.

### Prerequisites

* Enable a system-assigned [managed identity](api-management-howto-use-managed-service-identity.md) in your API Management instance. 

### Enable Azure AD access

Enable Azure Active Directory authentication to SQL Database by assigning an Azure AD user as the admin of the server.

1. In the [portal](https://portal.azure.com), go to your Azure SQL server. 
1. Select **Azure Active Directory**.
1. Select **Set admin** and select yourself or a group to which you belong. 
1. Select **Save**.

### Assign roles

1. In the portal, go to your Azure SQL database resource.
1. Select **Query editor (preview)**.
1. Login using Active Directory authentication.
1. Execute the following SQL script. Replace `<identity-name>` with the name of your API Management instance.

    ```sql
    CREATE USER [<identity-name>] FROM EXTERNAL PROVIDER;
    ALTER ROLE db_datareader ADD MEMBER [<identity-name>];
    ALTER ROLE db_datawriter ADD MEMBER [<identity-name>];
    ALTER ROLE db_ddladmin ADD MEMBER [<identity-name>];
    GO
    ```

## Examples

### Resolver for GraphQL query using single T-SQL request

The following example resolves a GraphQL query by making a single T-SQL request to a backend database. The connection string uses SQL authentication with username and password. The response is returned as a raw string.

```xml
<sql-data-source>
    <connection-info>
        <connection-string>
            Server=tcp:{your_server_name}.database.windows.net,1433;Initial Catalog={your_database_name};User ID={your_username}@{your_server_name};Password={your_password};[...];
        </connection-string>
    </connection-info>
    <request single-result="true">
        <sql-statement>
            SELECT 
                f.[Id] AS [id]
                f.[Name] AS [name]
            FROM [Family] f 
            WHERE 1 = f.[Id]
        </sql-statement>
    </request>
    <response />
</sql-data-source>
```

### Resolver for GraphQL query with transformed multi-row query response 

The following example resolves a GraphQL query using a T-SQL query to a SQL Azure database. The connection to the database uses the API Management instance's system-assigned managed identity. The identity must be [configured](#configure-managed-identity-integration-with-sql-azure) to access the SQL Azure database.

The query parameter is accessed using the `context.GraphQL.Arguments` context variable. The multi-row query response is transformed using the `set-body` policy with a liquid template. 

```xml
<sql-data-source> 
    <connection-info>
        <connection-string use-managed-identity="true">
            Server=tcp:{your_server_name}.database.windows.net,1433;Initial Catalog={your_database_name};Authentication=Active Directory Managed Identity;[...];
        </connection-string>
    </connection-info> 
    <request> 
        <sql-statement> 
            SELECT 
                p.[Id] AS [Id] 
                p.[FirstName] AS [FirstName] 
                p.[LastName] AS [LastName] 
            FROM [Person] p 
            JOIN [Family] f ON p.[FamilyId] = f.[Id] 
            WHERE @familyId = f.[Id] 
        </sql-statement> 
        <sql-parameters> 
            <parameter name="@familyId">       
                @(context.GraphQL.Arguments.["id"])
            </parameter> 
        </sql-parameters> 
    </request> 
    <response> 
        <set-body template="liquid"> 
            { 
                "items": [ 
                    {% JSONArray For person in body.results %} 
                        "id": "{{ person.id }}" 
                        "name": "{{ person.firstName }} + "" "" + {{body.lastName}}" 
                    {% endJSONArrayFor %} 
                ] 
            } 
        </set-body> 
  </response> 
</sql-data-source>
```

## Related policies

* [GraphQL resolver policies](api-management-policies.md#graphql-resolver-policies)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]