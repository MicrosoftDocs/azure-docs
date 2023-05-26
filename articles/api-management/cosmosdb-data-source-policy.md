---
title: Azure API Management policy reference - cosmosdb-data-source | Microsoft Docs
description: Reference for the cosmosdb-data-source resolver policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: reference
ms.date: 05/24/2023
ms.author: danlep
---

# Cosmos DB data source for a resolver

The `cosmosdb-data-source` resolver policy resolves data for an object type and field in a GraphQL schema by using a Cosmos DB data source. The schema must be imported to API Management. Use the policy to configure a single query request, read request, delete request, or write request and an optional response from the Cosmos DB data source.   

> [!NOTE]
> This policy is currently in preview.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml 
<cosmosdb-data-source> 
    <!-- Required information that specifies connection to Cosmos DB -->
    <connection-info> 
        <connection-string use-managed-identity="true | false" client-id= "Client ID of a user-assigned managed identity"> 
            "Connection string to CosmosDB account" 
        </connection-string> 
        <database-name>"Cosmos DB database name"</database-name> 
        <container-name>"Name of container in Cosmos DB database"</container-name>     
    </connection-info>

    <!-- Settings to query using a SQL statement and optional query parameters -->
    <query-request enable-low-precision-order-by="true | false"> 
        <sql-statement> 
            SQL statement 
        </sql-statement> 
        <query-parameters> 
            <parameter name="Query parameter name in @ notation" template="liquid"> 
                "Value of query parameter"
            </parameter> 
        </query-parameters> 
        <partition-key data-type="string | number | bool | none | null" template="liquid" > 
            "Container partition key" 
        </partition-key> 
        <paging> 
            <max-item-count template="liquid" > 
                "Maximum number of items returned by query"
            </max-item-count> 
            <continuation-token template="liquid"> 
                "Continuation token for paging" 
            </continuation-token> 
        </paging>
    </query-request>
    
    <!-- Settings to read item by item ID and optional partition key --> 
    <read-request> 
        <id template="liquid" >
            "Item ID in container"
        </id> 
        <partition-key data-type="string | number | bool | none | null" template="liquid" > 
            "Container partition key" 
        </partition-key>  
    </read-request> 
    
    <!-- Settings to delete item by ID and optional partition key --> 
    <delete-request consistency-level="bounded-staleness | consistent-prefix | eventual | session | strong" pre-trigger="myPreTrigger" post-trigger="myPostTrigger">
        <etag type="entity tag type" template="liquid" > 
            "System-generated entity tag" 
        </etag> 
        <id template="liquid">
            "Item ID in container"
        </id> 
        <partition-key data-type="string | number | bool | none | null" template="liquid"> 
            "Container partition key" 
        </partition-key> 
    </delete-request> 
    
    <!-- Settings to write item -->
    <write-request type="insert | replace | upsert" consistency-level="bounded-staleness | consistent-prefix | eventual | session | strong" enable-content-response-on-write="true | false" indexing-directive="default" pre-trigger="myPreTrigger" post-trigger="myPostTrigger">
        
        <id template="liquid">
            "Item ID in container"
        </id>       
        <etag type="match | no-match" template="liquid" > 
            "System-generated entity tag" 
        </etag> 
        <set-body template="liquid" >...set-body policy configuration...</set-body>
        <partition-key data-type="string | number | bool | none | null" template="liquid"> 
            "Container partition key"
        </partition-key> 
    </write-request>
    
    <response> 
        <set-body>...set-body policy configuration...</set-body> 
        <publish-event>... publish-event policy configuration...</publish-event>
    </response>
    
</cosmosdb-data-source> 
```

## Elements

|Name|Description|Required|
|----------|-----------------|--------------|
| [connection-info](#connection-info-elements)  |  Specifies connection to container in Cosmos DB database.    |   Yes     |
| [query-request](#query-request-attributes)    |   Specifies settings for a [query request](../cosmos-db/nosql/how-to-dotnet-query-items.md) to Cosmos DB container.    |  No      |
| [read-request](#read-request-elements)    |  Specifies settings for a [read request](../cosmos-db/nosql/how-to-dotnet-read-item.md) to Cosmos DB container.    |    No   |
| [delete-request](#delete-request-attributes)    |  Specifies settings for a delete request to Cosmos DB container.    |   No     |
| [write-request](#write-request-attributes) | Specifies settings for write request to Cosmos DB container.  |  No |
| [response](#response-elements)  |  Optionally specifies child policies to configure the resolver's response.  |    No |


### connection-info elements
|Name|Description|Required|
|----------|-----------------|--------------|
| [connection-string](#connection-string-attributes) | Connection string for Cosmos DB account. If the `use-managed-identity` attribute is set to `false` (default), the connection string must include an account key.   | Yes    |
| database-name | String. Name of Cosmos DB database. | Yes  |
| container-name | String. Name of container in Cosmos DB database. | Yes  |

#### connection-string attributes

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| use-managed-identity | Boolean. Specifies whether to use a [managed identity](api-management-howto-use-managed-service-identity.md) assigned to the API Management instance for connection to the Cosmos DB account in place of an account key in the connection string. The identity must have an Azure RBAC [role assignment](../cosmos-db/how-to-setup-rbac.md) or equivalent permissions to perform the request on the Cosmos DB container. | No  | `false`   |
| client-id | If `use-managed-identity` is `true` and a user-assigned managed identity is used, the client ID of the identity.<br/><br/>The identity must have an Azure RBAC [role assignment](../cosmos-db/how-to-setup-rbac.md) or equivalent permissions to perform the request on the Cosmos DB container.  | No | N/A |

### query-request attributes

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| enable-low-precision-order-by | Boolean. Specifies whether to enable the [EnableLowPrecisionOrderBy](/dotnet/api/microsoft.azure.cosmos.queryrequestoptions) query request property in the Cosmos DB service.  | No  | N/A   |


### query-request elements

|Name|Description|Required|
|----------|-----------------|--------------|
|  sql-statement     |    A SQL statement for the query request.    |   No      |
|  parameters     |   A list of query parameters, in [parameter](#parameter-attributes) subelements, for the query request.      |     No    |
|  [partition-key](#partition-key-attributes)     |  A Cosmos DB [partition key](../cosmos-db/resource-model.md#azure-cosmos-db-containers) to route the query to the location in the container.       |     No    |
|  [paging](#paging-elements)     |   Specifies  settings to split query results into multiple [pages](../cosmos-db/nosql/query/pagination.md).   |      No   |

#### parameter attributes

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| name   | String. Name of the parameter in @ notation.    | Yes    | N/A  |
| template    |  Used to set the templating mode for the query parameter. Currently the only supported value is:<br /><br />- `liquid` - the parameter will use the liquid templating engine   |  No   |  N/A |

#### paging elements

| Name|Description|Required|
|----------|-----------------|--------------|
|  [max-item-count](#max-item-count-attribute)     |    Specifies the [maximum number of items](../cosmos-db/nosql/query/pagination.md) returned by the query. Set to -1 if you don't want to place a limit on the number of results per query execution.   |   Yes      |
| [continuation-token](#continuation-token-attribute) | Specifies the [continuation token](../cosmos-db/nosql/query/pagination.md#continuation-tokens) to attach to the query to get the next set of results.  | Yes |

#### max-item-count attribute

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| template    |  Used to set the templating mode for the `max-item-count`. Currently the only supported value is:<br /><br />- `liquid` - the `max-item-count` will use the liquid templating engine   |  No   |  N/A |

#### continuation-token attribute

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| template    |  Used to set the templating mode for the continuation token. Currently the only supported value is:<br /><br />- `liquid` - the continuation token will use the liquid templating engine   |  No   |  N/A |

### read-request elements
|Name|Description|Required|
|----------|-----------------|--------------|
|   id    |   Identifier of the item to read in the container.      |  Yes          |
| [partition-key](#partition-key-attributes)    |  A partition key for the location of the item in the container. If specified with `id`, enables a quick point read (key/value lookup) of the item in the container.      |      No      |    

### delete-request attributes

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| consistency-level | String. Sets the Cosmos DB [consistency level](../cosmos-db/consistency-levels.md) of the delete request. | No  | N/A   |
| pre-trigger | String. Identifier of a [pre-trigger](../cosmos-db/nosql/how-to-use-stored-procedures-triggers-udfs.md#how-to-run-pre-triggers) function that is registered in your Cosmos DB container. | No | N/A |
| post-trigger | String. Identifier of a [post-trigger](../cosmos-db/nosql/how-to-use-stored-procedures-triggers-udfs.md#how-to-run-post-triggers) function that is registered in your CosmosDB container. | No | N/A |

### delete-request elements

|Name|Description|Required|
|----------|-----------------|--------------|
|   id    |   Identifier of the item to delete in the container.      |  Yes          |
| [partition-key](#partition-key-attributes)    |  A partition key for the location of the item in the container.     |      No      |    
| [etag](#etag-attribute) | Entity tag for the item in the container, used for optimistic concurrency control.     |   No  |

#### write-request attributes

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| type | The type of write request: `insert`, `replace`, or `upsert`. | No  | `upsert`   |
| consistency-level | String. Sets the Cosmos DB [consistency level](../cosmos-db/consistency-levels.md) of the write request.  | No  | N/A   |
| enable-content-response-on-write | String. TODO  | No  | N/A   |
| indexing-directive | The [indexing policy](../cosmos-db/index-policy.md) that determines how the container's items should be indexed.  | No  | `default`   |
| pre-trigger | String. Identifier of a [pre-trigger](../cosmos-db/nosql/how-to-use-stored-procedures-triggers-udfs.md#how-to-run-pre-triggers) function that is registered in your Cosmos DB container. | No | N/A |
| post-trigger | String. Identifier of a [post-trigger](../cosmos-db/nosql/how-to-use-stored-procedures-triggers-udfs.md#how-to-run-post-triggers) function that is registered in your Cosmos DB container. | No | N/A |

### write-request elements

|Name|Description|Required|
|----------|-----------------|--------------|
|   id    |   Identifier of the item in the container.      |  Yes when `type` is `replace`.       |
| [etag](#etag-attribute) | Entity tag for the item in the container, used for optimistic concurrency control.      |   No  |
| [set-body](set-body-policy.md)  |  Sets the body in the write request. If not provided, the request payload will map arguments into JSON format.| No  |

### response elements

|Name|Description|Required|
|----------|-----------------|--------------|
| [set-body](set-body-policy.md)  |  Sets the body in the resolver's response. If not provided and the returned JSON contains field names matching fields in the GraphQL schema, the fields are automatically mapped. | No  |
| [publish-event](publish-event-policy.md) | Publishes an event to one or more subscriptions specified in the GraphQL API schema.   | No |

#### partition-key attributes

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
|  data-type  | The data type of the partition key: `string`, `number`, `bool`, `none`, or `null`.  | No    | `string`    |
| template    |  Used to set the templating mode for the partition key. Currently the only supported value is:<br /><br />- `liquid` - the partition key will use the liquid templating engine   |  No   |  N/A |

#### etag attribute

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
|  type   | String. One of the following values:<br /><br />- `match` - the `etag` value must match the system-generated entity tag for the item<br /><br /> - `no-match` - the `etag` value isn't required to match the system-generated entity tag for the item        |   No        |    `match`   |
| template    |  Used to set the templating mode for the etag. Currently the only supported value is:<br /><br />- `liquid` - the etag will use the liquid templating engine   |  No   |  N/A |

## Usage

- [**Policy scopes:**](./api-management-howto-policies.md#scopes) GraphQL resolver
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption

### Usage notes

* This policy is invoked only when resolving a single field in a matching GraphQL query, mutation, or subscription.  

## Examples

### Cosmos DB query request 

The following example resolves a GraphQL query using a SQL query to a Cosmos DB container.

```xml
<cosmosdb-data-source>
    <connection-info>
        <connectionstring>
            AccountEndpoint=https://contoso-cosmosdb.
documents.azure.com:443/;AccountKey=CONTOSOKEY;
        </connection-string>
        <database-name>myDatabase</database-name>
        <container-name>myContainer</container-name>
    </connection-info>
    <query-request>
        <sql-statement>SELECT * FROM c</sqlstatement>
    </query-request>
</cosmosdb-data-source>
```

### Cosmos DB read request

The following example resolves a GraphQL query using a point read request to a Cosmos DB container. The connection to the Cosmos DB account uses the API Management instance's system-assigned managed identity. The identity must be assigned an Azure RBAC role or equivalent permissions to write to the Cosmos DB container.

The `id` and `partition-key` used for the read request are passed as query parameters and accessed using the `Context.GraphQL.arguments` context variable.

```xml
<cosmosdb-data-source>
    <connection-info>
        <connectionstring use-managed-identity="true">
            AccountEndpoint=https://contoso-cosmosdb.
documents.azure.com:443/;
        </connection-string>
        <database-name>myDatabase</database-name>
        <container-name>myContainer</container-name>
    </connection-info>
    <read-request>
        <id>
            @(context.GraphQL.Arguments["id"].ToString()
        </id>
        <partition-key>
            @(context.GraphQL.Arguments["category"].ToString()
        </partition-key>
    </read-request>
</cosmosdb-data-source>
```

### Cosmos DB delete request

The following example resolves a GraphQL mutation by a delete request to a Cosmos DB container. The `id` and `partition-key` used for the delete request are passed as query parameters and accessed using the `Context.GraphQL.arguments` context variable.

```xml
<cosmosdb-data-source>
    <connection-info>
        <connectionstring>
            AccountEndpoint=https://contoso-cosmosdb.
documents.azure.com:443/;AccountKey=CONTOSOKEY;
        </connection-string>
        <database-name>myDatabase</database-name>
        <container-name>myContainer</container-name>
    </connection-info>
    <delete-request>
        <id>
            @(context.GraphQL.Arguments["id"].ToString())
        </id>
        <partition-key>
            @(context.GraphQL.Arguments["category"].ToString())
        </partition-key>
    </delete-request>
</cosmosdb-data-source>
```

### Cosmos DB write request

The following example resolves a GraphQL mutation by an upsert request to a Cosmos DB container. The connection to the Cosmos DB account uses the API Management instance's system-assigned managed identity. The identity must be assigned an Azure RBAC role or equivalent permissions to write to the Cosmos DB container. 

The `partition-key` used for the write request is passed as a query parameter and accessed using the `Context.GraphQL.arguments` context variable. The upsert request has a pre-trigger operation named "validateInput". The request body is mapped using a liquid template.

```xml
<cosmosdb-data-source>
    <connection-info>
        <connection-string use-managed-identity="true">
            AccountEndpoint=https://contoso-cosmosdb.
documents.azure.com:443/;
        </connection-string>
        <database-name>myDatabase</database-name>
        <container-name>myContainer</container-name>
    </connection-info>
    <write-request type="upsert" pre-trigger="validateInput">
        <partition-key>
            @(context.GraphQL.Arguments["category"].ToString())
        </partition-key>
        <set-body template="liquid">
            {"id" : "{{body.arguments.id}}" ,
            "firstName" : "{{body.arguments.firstName}}",
            "intField" : {{body.arguments.intField}} ,
            "floatField" : {{body.arguments.floatField}} ,
            "boolField" : {{body.arguments.boolField}}}
        </set-body>
    </write-request>
</cosmosdb-data-source>
```


## Related policies

* [GraphQL resolver policies](api-management-policies.md#graphql-resolver-policies)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]