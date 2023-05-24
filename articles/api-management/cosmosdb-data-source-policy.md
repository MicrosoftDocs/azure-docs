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

The `cosmosdb-data-source` resolver policy configures a Cosmos DB query request, read request, delete request, or write request and optional response to resolve data for an object type and field in a GraphQL schema. The schema must be imported to API Management.  

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml 
<cosmosdb-data-source> 
    <connection-info>
        <!-- Required information that specifies connection to Cosmos DB container--> 
        <connection-string use-managed-identity="true | false" client-id= "Client ID of a user-assigned managed identity"> 
            "Cosmos DB connection string" 
        </connection-string> 
        <database-name>"Cosmos DB database name"</database-name> 
        <container-name>"Name of container in Cosmos DB database"</container-name>     
    </connection-info>
    
    <query-request enable-low-precision-order-by="true | false"> 
    <!-- Settings for SQL query request -->
        <sql-statement> 
            "SQL statement for query request" 
        </sql-statement> 
        <query-parameters> 
        <!-- List of query parameters -->
            <parameter name="Query parameter name in @ notation" template="liquid"> 
                "Value of query parameter"
            </parameter> 
        </query-parameters> 
        <partition-key data-type="data type of partition key" template="liquid" > 
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

<read-request> 
    <!-- Settings to read data by item ID and partition key --> 
    <id template="liquid" >
        "Item ID in container"
    </id> 
    <partition-key data-type="data type of partition key" template="liquid" > 
        "Container partition key" 
    </partition-key>  
</read-request> 

<delete-request consistency-level="bounded-staleness | consistent-prefix | eventual | session | strong" pre-trigger="myPreTrigger" post-trigger="myPostTrigger">
<!-- Settings to delete item by ID and partition key --> 
    <etag type="entity tag type" template="liquid" > 
        "System-generated entity tag" 
    </etag> 
    <id template="liquid">
        "Item ID in container"
    </id> 
    <partition-key data-type="data type of partition key" template="liquid"> 
        "Container partition key" 
    </partition-key> 
</delete-request> 


<!-- Attributes optional -->
<!-- type attribute can be either insert, replace, upsert. Default to upsert-->

<!-- consistency-level attribute is optional can be strong, session, eventual, bounded-staleness, consistent-prefix--> 

<write-request type="insert | replace | upsert" consistency-level="bounded-staleness | consistent-prefix | eventual | session | strong" enable-content-response-on-write="true | false" indexing-directive="default" pre-trigger="myPreTrigger" post-trigger="myPostTrigger">
    
    <!-- Required when type= "replace" --> 
    <id template="liquid" >{{body.arguments.id}}</id> 
    <!-- Optional Element --> 
    <!-- type attribute is optional, defaults to match, and can be either match or no-match--> 
    
    <etag type="match" template="liquid" > 
        {{body.arguments.etag}} 
    </etag> 
    <!-- Optional, if not provided, request payload will map arguments into a json--> 

    <set-body template="liquid" > 
        { "id": "{{body.arguments.id}}", "category": "{{body.arguments.category}}", "type": "{{body.arguments.type}}", "difficulty": "{{body.arguments.difficulty}}", "question": "{{body.arguments.question}}", "correct_answer": "{{body.arguments.correct_answer}}" } 
    </set-body> 
    <!-- Optional Element,if element is not provided, defaults to none --> 
    <!-- data-type optional attribute, defaults to string, other options would be number/bool/none/null--> 

    <partition-key data-type="string" template="liquid" > 
        {{body.arguments.category}} 
    </partition-key> 
</write-request>

<response> 
    <!-- Optional, if returned json contains field names matching GraphQ Field, and set-body is not present, fields will be auto mapped --> 
    <set-body template="liquid" > 
        { "id": "{{body.id}}", "category": "{{body.category}}", "type": "{{body.type}}", "difficulty": "{{body.difficulty}}", "question": "{{body.question}}", "correct_answer": "{{body.correct_answer}}" } 
    </set-body> 
</response>

</cosmosdb-data-source> 
```


## Elements

|Name|Description|Required|
|----------|-----------------|--------------|
| [connection-info](#connection-info-elements)  |  Specifies connection to container in Cosmos DB database.    |   Yes     |
| [query-request](#query-request-attributes)    |   Specifies settings for a [query request](..cosmos-db/nosql/how-to-dotnet-query-items.md) to Cosmos DB container.    |  No      |
| [read-request](#read-request-attributes)    |  Specifies settings for a [read request](../cosmos-db/nosql/how-to-dotnet-read-item.md) to Cosmos DB container.    |    No   |
| [delete-request](#delete-request-attributes)    |  Specifies settings for a delete request to Cosmos DB container.    |   No     |
| [write-request](#write-request-attributes) | Specifies ettings for write request to Cosmos DB container.  |  No |
| [response](#response-elements)  |  Optionally specifies child policies to configure the resolver's response.  |    No |


### connection-info elements
|Name|Description|Required|
|----------|-----------------|--------------|
| [connection-string](#connection-string-attributes) | Connection string for Cosmos DB account.   | Yes    |
| database-name | String. Name of Cosmos DB database. | Yes  |
| container-name | String. Name of container in Cosmos DB database. | Yes  |


#### connection-string attributes

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| use-managed-identity | Boolean. Specifies whether to use a managed identity assigned to the API Management instance for connection to the Cosmos DB account. TODO TO SPECIFY MORE ABOUT THE IDENTITY. | No  | `false`   |
| client-id | If `use-managed-identity` is `true` and a user-assigned managed identity is used, the client ID of the identity.<br/><br/>The identity must have a TODO role assignment or equivalent permissions to perform the configured request on the Cosmos DB container.  | No | N/A |

### query-request attributes

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| enable-low-precision-order-by | Boolean. Specifies whether to enable the [EnableLowPrecisionOrderBy](/dotnet/api/microsoft.azure.cosmos.queryrequestoptions?view=azure-dotnet) query request property in the Cosmos DB service.  | No  | N/A   |


### query-request elements

|Name|Description|Required|
|----------|-----------------|--------------|
|  sql-statement     |    A SQL statement for the query request.    |   No      |
|  parameters     |   A list of query parameters, in [parameter](#parameter-attributes) subelements, for the query request.      |     No    |
|  [partition-key](#partition-key-attributes)     |  A Cosmos DB [partition key](../cosmos-db/resource-model.md#azure-cosmos-db-containers) to route the query to the location in the container.       |     No    |
|  [paging](#paging-elements)     |    Specifies  settings to split query results into multiple [pages](../cosmos-db/nosql/query/pagination.md).   |      No   |

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
| consistency-level | String. Sets the CosmosDB [consistency level](../cosmos-db/consistency-levels.md) of the delete request. | No  | N/A   |
| pre-trigger | String. Identifier of a [pre-trigger](../cosmos-db/nosql/how-to-use-stored-procedures-triggers-udfs.md#how-to-run-pre-triggers) function that is registered in your CosmosDB container. | No | N/A |
| post-trigger | String. Identifier of a [post-trigger](../cosmos-db/nosql/how-to-use-stored-procedures-triggers-udfs.md#how-to-run-post-triggers) function that is registered in your CosmosDB container. | No | N/A |

### delete-request elements
|Name|Description|Required|
|----------|-----------------|--------------|
|   id    |   Identifier of the item to delete in the container.      |  Yes          |
| [partition-key](#partition-key-attributes)    |  A partition key for the location of the item in the container.     |      No      |    
| [etag](#etag-attribute) | Entity tag for the item in the container, used for optimistic concurrency control. If this value differs from the current `etag` of the item in the Cosmos DB container, the delete request fails.     |   No  |

#### write-request attributes

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| type | String. TODO  | No  | N/A   |
| consistency-level | String. Sets the CosmosDB [consistency level](../cosmos-db/consistency-levels.md) of the write request.  | No  | N/A   |
| enable-content-response-on-write | String. TODO  | No  | N/A   |
| indexing-directive | String. TODO  | No  | N/A   |
| pre-trigger | String. Identifier of a [pre-trigger](../cosmos-db/nosql/how-to-use-stored-procedures-triggers-udfs.md#how-to-run-pre-triggers) function that is registered in your CosmosDB container. | No | N/A |
| post-trigger | String. Identifier of a [post-trigger](../cosmos-db/nosql/how-to-use-stored-procedures-triggers-udfs.md#how-to-run-post-triggers) function that is registered in your CosmosDB container. | No | N/A |

### write-request elements
|Name|Description|Required|
|----------|-----------------|--------------|
| [partition-key](#partition-key-attributes)   |  A partition key for the write request. | No |
| [etag](#etag-attribute) | TODO     |   No  |
| [set-body](set-body-policy.md)  |  Sets the body in the write request. | No  |

### response elements
|Name|Description|Required|
|----------|-----------------|--------------|
| [set-body](set-body-policy.md)  |  Sets the body in the resolver's response. | No  |
| [publish-event](publish-event-policy.md) | Publishes an event to one or more subscriptions specified in the GraphQL API schema. | No |



#### partition-key attributes

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
|  data-type  | The data type of the partition key. Valid values include including `string`, `number`, `bool`, `none`, and `null`, other options would be number/bool/none/null  | No    | `string`    |
| template    |  Used to set the templating mode for the partition key. Currently the only supported value is:<br /><br />- `liquid` - the partition key will use the liquid templating engine   |  No   |  N/A |


#### etag attribute

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
|  type   | String.  TODO          |   No        |    N/A   |

## Usage

- [**Policy scopes:**](./api-management-howto-policies.md#scopes) GraphQL resolver
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption

### Usage notes

* This policy is invoked only when resolving a single field in a matching GraphQL query, mutation, or subscription. 

## Examples

### Cosmos DB query request 

TODO

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

TODO

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
    <read-request>
        <id>
            @(context.GraphQL.Arguments["id"].ToString()
        </id>
        <partition-key>
            @(context.GraphQL.Arguments["id"].ToString()
        </partition-key>
    </read-request>
</cosmosdb-data-source>
```

### Cosomos DB delete request

TODO

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
            @(context.GraphQL.Arguments["id"].ToString())
        </partition-key>
    </delete-request>
</cosmosdb-data-source>
```

### Cosmos DB write request

TODO

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
    <write-request>
        <partition-key>
            @(context.GraphQL.Arguments["id"].ToString())
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