---
title: Azure API Management policy reference - sql-data-source | Microsoft Docs
description: Reference for the sql-data-source resolver policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 06/07/2023
ms.author: danlep
---

# Azure SQL data source for a resolver

The `sql-data-source` resolver policy configures a Transact-SQL (T-SQL) request to an [Azure SQL](/azure/azure-sql/azure-sql-iaas-vs-paas-what-is-overview) database and an optional response to resolve data for an object type and field in a GraphQL schema. The schema must be imported to API Management as a GraphQL API.  

> [!NOTE]
> This policy is in preview. Currently, the policy isn't supported in the Consumption tier of API Management.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml 
<sql-data-source> 
    <connection-info>
        <connection-string use-managed-identity="true | false">
            Azure SQL connection string
        </connection-string>
        <include-fragment>...include-fragment policy configuration...</include-fragment>
        <authentication-certificate>...authentication-certificate policy configuration...</authentication-certificate>     
    </connection-info>
    <include-fragment>...include-fragment policy configuration...</include-fragment>
    <request single-result="true | false">
        <include-fragment>...include-fragment policy configuration...</include-fragment>
        <set-body>...set-body policy configuration...</set-body>
        <sql-statement>T-SQL query</sql-statement>
        <parameters>
            <parameter sql-type="parameter type" name="Query parameter name in @ notation">
                "Query parameter value or expression"
            </parameter>
            <!-- if there are multiple parameters, then add additional parameter elements -->
        </parameters>
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
| [response](#response-elements) |  Optionally specifies child policies to configure the response from the Azure SQL database. If not specified, the response is returned from Azure SQL as JSON.  | No |

### connection-info elements

> [!NOTE]
> Except where noted, each child element may be specified at most once. Specify elements in the order listed.


|Element|Description|Required|
|----------|-----------------|--------------|
| [connection-string](#connection-string-attributes) | Specifies the Azure SQL connection string. The connection string uses either SQL authentication (username and password) or Azure AD authentication if an API Management managed identity is configured. |  Yes |
| [include-fragment](include-fragment-policy.md) | Inserts a policy fragment in the policy definition. If there are multiple fragments, then add additional `include-fragment` elements. | No |
| [authentication-certificate](authentication-certificate-policy.md)  | Authenticates using a client certificate in the resolver's SQL request.  | No  | 

### connection-string attributes

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| use-managed-identity | Boolean. Specifies whether to use the API Management instance's system-assigned [managed identity](api-management-howto-use-managed-service-identity.md) for connection to the Azure SQL database in place of a username and password in the connection string. Policy expressions are allowed. <br/><br/>The identity must be [configured](#configure-managed-identity-integration-with-azure-sql) to access the Azure SQL database.  | No  | `false`   |

### request attribute

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| single-result | Boolean. Specifies whether the response to the query is expected to return one row at most. Policy expressions are allowed.  | No  | `false`   |

### request elements

> [!NOTE]
> Each child element may be specified at most once. Specify elements in the order listed.

|Element|Description|Required|
|----------|-----------------|--------------|
 | [include-fragment](include-fragment-policy.md) | Inserts a policy fragment in the policy definition.  | No |
| [set-body](set-body-policy.md)  |  Sets the body in the resolver's SQL request. | No  | 
| sql-statement | A T-SQL statement for the request to the Azure SQL database. The SQL statement may include multiple independent substatements such as UPDATE, DELETE, and SELECT that will be executed in sequence. Results are returned from the final substatement. | Yes |
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
| [set-body](set-body-policy.md)  |  Sets the body in the resolver's response.  | No  |
| [publish-event](publish-event-policy.md) | Publishes an event to one or more subscriptions specified in the GraphQL API schema. | No |

## Usage

- [**Policy scopes:**](./api-management-howto-policies.md#scopes) GraphQL resolver
-  [**Gateways:**](api-management-gateways-overview.md) dedicated

### Usage notes

* To configure and manage a resolver with this policy, see [Configure a GraphQL resolver](configure-graphql-resolver.md).
* This policy is invoked only when resolving a single field in a matching operation type in the schema. 

## Configure managed identity integration with Azure SQL

You can configure an API Management system-assigned managed identity for access to Azure SQL instead of configuring SQL authentication with username and password. For background, see [Configure and manage Azure AD authentication with Azure SQL](/azure/azure-sql/database/authentication-aad-configure).

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

### Example schema

The examples in this section are resolvers for the following GraphQL schema:

```GraphQL
type Family {
  id: Int!
  name: String!
}

type Person {
  id: Int!
  name: String!
}

type PersonQueryResult {
  items: [Person]  
}

type Query {
  familyById(familyId: Int!): Family
  familyMembers(familyId: Int!): PersonQueryResult
}

type Mutation {
  createFamily(familyId: Int!, familyName: String!): Family
}
```

### Resolver for GraphQL query using single-result T-SQL request

The following example resolves a GraphQL query by making a single-result T-SQL request to a backend Azure SQL database. The connection string uses SQL authentication with username and password and is provided using a named value. The response is returned as a single JSON object representing a single row.

```xml
<sql-data-source>
    <connection-info>
        <connection-string>
            {{my-connection-string}}
        </connection-string>
    </connection-info>
    <request single-result="true">
        <sql-statement>
            SELECT 
                f.[Id] AS [id]
                f.[Name] AS [name]
            WHERE @familyId = f.[Id] 
        </sql-statement> 
        <parameters> 
            <parameter name="@familyId">       
                {context.GraphQL.Arguments.["id"]}
            </parameter> 
        </parameters> 
    </request>
    <response />
</sql-data-source>
```

### Resolver for GraphQL query with transformed multi-row query response 

The following example resolves a GraphQL query using a T-SQL query to an Azure SQL database. The connection to the database uses the API Management instance's system-assigned managed identity. The identity must be [configured](#configure-managed-identity-integration-with-azure-sql) to access the Azure SQL database.

The query parameter is accessed using the `context.GraphQL.Arguments` context variable. The multi-row query response is transformed using the `set-body` policy with a liquid template. 

```xml
<sql-data-source> 
    <connection-info>
        <connection-string use-managed-identity="true">
            Server=tcp:{your_server_name}.database.windows.net,1433;Initial Catalog={your_database_name}; 
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
        <parameters> 
            <parameter name="@familyId">       
                {context.GraphQL.Arguments.["id"]}
            </parameter> 
        </parameters> 
    </request> 
    <response> 
        <set-body template="liquid"> 
            { 
                "items": [ 
                    {% JSONArray For person in body.items %} 
                        "id": "{{ person.id }}" 
                        "name": "{{ person.firstName }} + "" "" + {{body.lastName}}" 
                    {% endJSONArrayFor %} 
                ] 
            } 
        </set-body> 
  </response> 
</sql-data-source>
```

### Resolver for GraphQL mutation 

The following example resolves a GraphQL mutation using a T-SQL INSERT statement to insert a row an Azure SQL database. The connection to the database uses the API Management instance's system-assigned managed identity. The identity must be [configured](#configure-managed-identity-integration-with-azure-sql) to access the Azure SQL database.

```xml
<sql-data-source> 
    <connection-info>
        <connection-string use-managed-identity="true">
            Server=tcp:{your_server_name}.database.windows.net,1433;Initial Catalog={your_database_name};</connection-string>
    </connection-info> 
    <request single-result="true"> 
        <sql-statement> 
                INSERT INTO [dbo].[Family]
                       ([Id]
                       ,[Name])
                VALUES
                       (@familyId
                       , @familyName)

                SELECT
                    f.[Id] AS [id],
                    f.[Name] AS [name]
                FROM [Family] f
                WHERE @familyId = f.[Id]
        </sql-statement> 
        <parameters> 
            <parameter name="@familyId">       
                {context.GraphQL.Arguments.["id"]}
            </parameter>
            <parameter name="@familyName">       
                {context.GraphQL.Arguments.["name"]}
            </parameter> 
        </parameters> 
    </request>    
</sql-data-source>
```

## Related policies

* [GraphQL resolver policies](api-management-policies.md#graphql-resolver-policies)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]