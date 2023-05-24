---
title: Azure API Management policy reference - cosmosdb-data-source | Microsoft Docs
description: Reference for the cosmosdb-data-source resolver policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: reference
ms.date: 05/15/2023
ms.author: danlep
---

# Cosmos DB data source for a resolver

The `cosmosdb-data-source` resolver policy configures the Cosmos DB request and optional response to resolve data for an object type and field in a GraphQL schema. The schema must be imported to API Management.  

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml 
<cosmosdb-data-source> 
    <connection-info>
        <!-- Required --> 
        <connection-string use-managed-identity="true | false" client-id= "value"> {{connectString}} </connection-string> 
        <!-- Required --> 
        <database-name>{{databaseName}}</database-name> connection 
        <!-- Required --> 
        <container-name>{{containerName}}</container-name     
    </connection-info>
    
    <query-request enable-low-precision-order-by="true"> 
    <!-- Optional Element-->
        <sql-statement> 
            SELECT * FROM c where c.difficulty = @difficulty 
        </sql-statement> 
        <!-- Optional Element --> 
        <!-- name attribute required --> 
        <query-parameters> 
            <parameter name="@difficulty" template="liquid" > {{body.arguments.difficulty}} </parameter> 
        </query-parameters> 
        <!-- Optional Element,if element is not provided, defaults to None --> 
        <!-- data-type optional attribute, defaults to string, other options would be number/bool/none/null--> 
        <partition-key data-type="string" template="liquid" > 
            {{body.arguments.category}} 
        </partition-key> 
        <!-- Optional Element --> 
        <paging> 
            <max-item-count template="liquid" > 
                {{body.arguments.first}} 
            </max-item-count> 
            <continuation-token template="liquid"> 
                {{body.arguments.after}} 
            </continuation-token> 
        </paging>
</query-request>

<read-request> 
    <!-- Required --> 
    <id template="liquid" >
        {{body.arguments.id}}
    </id> 
    <!-- Optional Element,if element is not provided, defaults to none -->
    <!-- data-type optional attribute, defaults to string, other options would be number/bool/none/null--> 
    <partition-key data-type="string" template="liquid" > 
        {{body.arguments.category}} 
    </partition-key> 
</read-request> 

<delete-request consistency-level="eventual" pre-trigger="myPreTrigger" post-trigger="myPostTrigger"> 
    <etag type="match" template="liquid" > 
        {{body.arguments.etag}} 
    </etag> 
    <!-- Required --> 
    <id template="liquid" >
        {{body.arguments.id}}
    </id> 
    <!-- Optional Element,if element is not provided, defaults to none --> 
    <!-- data-type optional attribute, defaults to string, other options would be number/bool/none/null--> 

    <partition-key data-type="string" template="liquid" > 
        {{body.arguments.category}} 
    </partition-key> 
</delete-request> 
<!-- Attributes optional -->
<!-- type attribute can be either insert, replace, upsert. Default to upsert-->

<!-- consistency-level attribute is optional can be strong, session, eventual, bounded-staleness, consistent-prefix--> 

<write-request type="upsert" consistency-level="eventual" enable-content-response-on-write="true" indexing-directive="default" pre-trigger="myPreTrigger" post-trigger="myPostTrigger">
    
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
| [connection-info](#connection-info-elements)  |  TODO    |   Yes     |
| [query-request](#query-request-elements)    |   TODO   |  No      |
| [read-request](#read-request-attributes)    |  TODO    |    No   |
| [delete-request](#delete-request-attributes)    |  TODO    |   No     |
| [write-request](#write-request-attributes) | TODO  |  No |
| [response](#response-elements)  |  TODO  |    No |


### connection-info elements
|Name|Description|Required|
|----------|-----------------|--------------|
| [connection-string](#connection-string-attributes) | TODO   | Yes    |
| database-name | TODO | Yes  |
| container-name | TODO | Yes  |


#### connection-string attributes

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| use-managed-identity | TODO  | No  | false   |
| client-id | TODO | No | N/A |


### query-request elements

|Name|Description|Required|
|----------|-----------------|--------------|
|  sql-statement     |    A SQL statement for the query request.    |   No      |
|  parameters     |   A list of query parameters, in [parameter](#parameter-attributes) subelements, for the query request.      |     No    |
|  [partition-key](#partition-key-attributes)     |  A partition key for the query request.       |     No    |
|  [paging](#paging-elements)     |    TODO    |      No   |

#### parameter attributes

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| name   | String or expression. Name of the parameter.    | Yes    | N/A  |
| template    |  Used to set the templating mode for the query parameter. Currently the only supported value is:<br /><br />- `liquid` - the parameter will use the liquid templating engine   |  No   |  N/A |

#### paging elements

| Name|Description|Required|
|----------|-----------------|--------------|
|  [max-item-count](#max-item-count-attribute)     |    TODO    |   Yes      |
| [continuation-token](#continuation-token-attribute) | TODO  | Yes |

#### max-item-count attribute

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| template    |  Used to set the templating mode for the `max-item-count`. Currently the only supported value is:<br /><br />- `liquid` - the `max-item-count` will use the liquid templating engine   |  No   |  N/A |

#### continuation-token attribute

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| template    |  Used to set the templating mode for the continuation token. Currently the only supported value is:<br /><br />- `liquid` - the continuation token will use the liquid templating engine   |  No   |  N/A |


### read-request attributes

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| enable-low-precision-order-by | TODO  | No  | N/A   |


### read-request elements
|Name|Description|Required|
|----------|-----------------|--------------|
|   id    |   TODO      |  Yes          |
| [partition-key](#partition-key-attributes)    |  A partition key for the read request.      |      No      |    

### delete-request attributes

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| consistency-level | String. Sets the CosmosDB [consistency level](../cosmos-db/consistency-levels.md) of the delete request. | No  | N/A   |
| pre-trigger | String. Identifier of a pre-trigger function that is registered in your CosmosDB database container. | No | N/A |
| post-trigger | String. Identifier of a post-trigger function that is registered in your CosmosDB database container. | No | N/A |

### delete-request elements
|Name|Description|Required|
|----------|-----------------|--------------|
|   id    |   TODO      |  Yes          |
| [partition-key](#partition-key-attributes)   |  A partition key for the delete request. | No |
| [etag](#etag-attribute) | TODO     |   No  |

#### write-request attributes

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| type | String. TODO  | No  | N/A   |
| consistency-level | String. Sets the CosmosDB [consistency level](../cosmos-db/consistency-levels.md) of the write request.  | No  | N/A   |
| enable-content-response-on-write | String. TODO  | No  | N/A   |
| indexing-directive | String. TODO  | No  | N/A   |
| pre-trigger | String. Identifier of a pre-trigger function that is registered in your CosmosDB database. | No | N/A |
| post-trigger | String. Identifier of a post-trigger function that is registered in your CosmosDB database. | No | N/A |

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
|  data-type  | String. TODO    | No    | N/A    |
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