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

The `cosmosdb-data-source` resolver policy ... for an object type and field in a GraphQL schema. The schema must be imported to API Management.  

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml 
<cosmosdb-data-source> 
    <connection-info>
        <!-- Required --> 
        <connection-string use-managed-identity="true" client-id= "value" > {{connectString}} </connection-string> 
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
| connection-info  |      |   Yes     |
| query-request    |      |  No      |
| read-request    |      |    No   |
| delete-request    |      |   No     |
| write-request |   |  No |
| response  |    |    No |



### connection-info elements
|Name|Description|Required|
|----------|-----------------|--------------|
| connection-string |    | Yes    |
| database-name |  | Yes  |
| container-name |  | Yes  |


#### connection-string attributes

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| use-managed-identity | ...  | No  | false   |
| client-id | ... | No | N/A |


### query-request elements

|Name|Description|Required|
|----------|-----------------|--------------|
|  sql-statement     |         |   No      |
|  parameters     |         |     No    |
|  partition-key     |         |     No    |
|  paging     |        |      No   |

### read-request attributes

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| enable-low-precision-order-by | ...  | No  | N/A   |


### read-request elements
|Name|Description|Required|
|----------|-----------------|--------------|
|   id    |         |  Yes          |
| partition-key    |        |      No      |    



### delete-request attributes

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| consistency-level | String. ...  | No  | N/A   |
| pre-trigger | String. ... | No | N/A |
| post-trigger | String. ... | No | N/A |

### delete-request elements
|Name|Description|Required|
|----------|-----------------|--------------|
|   id    |         |  Yes          |
| partition-key   |  | No |
| etag |    |   No  |

#### write-request attributes

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| type | String. ...  | No  | N/A   |
| consistency-level | String. ...  | No  | N/A   |
| enable-content-response-on-write | String. ...  | No  | N/A   |
| indexing-directive | String. ...  | No  | N/A   |
| pre-trigger | String. ... | No | N/A |
| post-trigger | String. ... | No | N/A |

### write-request elements
|Name|Description|Required|
|----------|-----------------|--------------|


### response elements
|Name|Description|Required|
|----------|-----------------|--------------|

#### connection-string attributes

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| use-managed-identity | ...  | No  | false   |
| client-id | ... | No | N/A |


## Usage

- [**Policy scopes:**](./api-management-howto-policies.md#scopes) GraphQL resolver
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption

### Usage notes

* This policy is invoked only when resolving a single field in a matching GraphQL query, mutation, or subscription. 

## Examples

### Resolver for GraphQL query

TODO

#### Example schema

TODO

#### Example policy



## Related policies

* [GraphQL resolver policies](api-management-policies.md#graphql-resolver-policies)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]