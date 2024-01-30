---
title: Azure API Management policy reference - cosmosdb-data-source | Microsoft Docs
description: Reference for the cosmosdb-data-source resolver policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.custom: devx-track-azurecli
ms.topic: article
ms.date: 06/07/2023
ms.author: danlep
---

# Cosmos DB data source for a resolver

The `cosmosdb-data-source` resolver policy resolves data for an object type and field in a GraphQL schema by using a [Cosmos DB](../cosmos-db/introduction.md) data source. The schema must be imported to API Management as a GraphQL API. 

Use the policy to configure a single query request, read request, delete request, or write request and an optional response from the Cosmos DB data source.   

> [!NOTE]
> This policy is in preview. Currently, the policy isn't supported in the Consumption tier of API Management.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml 
<cosmosdb-data-source> 
    <!-- Required information that specifies connection to Cosmos DB -->
    <connection-info> 
        <connection-string use-managed-identity="true | false"> 
            AccountEndpoint=...;[AccountKey=...;]
        </connection-string> 
        <database-name>Cosmos DB database name</database-name> 
        <container-name>Name of container in Cosmos DB database</container-name>     
    </connection-info>

    <!-- Settings to query using a SQL statement and optional query parameters -->
    <query-request enable-low-precision-order-by="true | false"> 
        <sql-statement> 
            SQL statement 
        </sql-statement> 
        <parameters> 
            <parameter name="Query parameter name in @ notation"> 
                "Query parameter value or expression"
            </parameter>
            <!-- if there are multiple parameters, then add additional parameter elements --> 
        </parameters> 
        <partition-key data-type="string | number | bool | none | null" template="liquid" > 
            "Container partition key" 
        </partition-key> 
        <paging> 
            <max-item-count template="liquid" > 
                Maximum number of items returned by query
            </max-item-count> 
            <continuation-token template="liquid"> 
                Continuation token for paging 
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
    <write-request type="insert | replace | upsert" consistency-level="bounded-staleness | consistent-prefix | eventual | session | strong" pre-trigger="myPreTrigger" post-trigger="myPostTrigger">
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
        <publish-event>...publish-event policy configuration...</publish-event>
    </response>
    
</cosmosdb-data-source> 
```

## Elements

|Name|Description|Required|
|----------|-----------------|--------------|
| [connection-info](#connection-info-elements)  |  Specifies connection to container in Cosmos DB database.    |   Yes     |
| [query-request](#query-request-attributes)    |   Specifies settings for a [query request](../cosmos-db/nosql/how-to-dotnet-query-items.md) to Cosmos DB container.    |  Configure one of `query-request`, `read-request`, `delete-request`, or `write-request`      |
| [read-request](#read-request-elements)    |  Specifies settings for a [read request](../cosmos-db/nosql/how-to-dotnet-read-item.md) to Cosmos DB container.    |    Configure one of `query-request`, `read-request`, `delete-request`, or `write-request`   |
| [delete-request](#delete-request-attributes)    |  Specifies settings for a delete request to Cosmos DB container.    |   Configure one of `query-request`, `read-request`, `delete-request`, or `write-request`     |
| [write-request](#write-request-attributes) | Specifies settings for a write request to Cosmos DB container.  |  Configure one of `query-request`, `read-request`, `delete-request`, or `write-request` |
| [response](#response-elements)  |  Optionally specifies child policies to configure the resolver's response. If not specified, the response is returned from Cosmos DB as JSON. |    No |


### connection-info elements

|Name|Description|Required|
|----------|-----------------|--------------|
| [connection-string](#connection-string-attributes) | Specifies the connection string for Cosmos DB account. If an API Management managed identity is configured, omit the account key. | Yes    |
| database-name | String. Name of Cosmos DB database. | Yes  |
| container-name | String. Name of container in Cosmos DB database. | Yes  |

#### connection-string attributes

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| use-managed-identity | Boolean. Specifies whether to use the API Management instance's system-assigned [managed identity](api-management-howto-use-managed-service-identity.md) for connection to the Cosmos DB account in place of an account key in the connection string. The identity must be [configured](#configure-managed-identity-integration-with-cosmos-db) to access the Cosmos DB container. | No  | `false`   |

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

#### paging elements

| Name|Description|Required|
|----------|-----------------|--------------|
|  [max-item-count](#max-item-count-attribute)     |    Specifies the [maximum number of items](../cosmos-db/nosql/query/pagination.md) returned by the query. Set to -1 if you don't want to place a limit on the number of results per query execution.   |   Yes      |
| [continuation-token](#continuation-token-attribute) | Specifies the [continuation token](../cosmos-db/nosql/query/pagination.md#continuation-tokens) to attach to the query to get the next set of results.  | Yes |

#### max-item-count attribute

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| template    |  Used to set the templating mode for the `max-item-count`. Currently the only supported value is:<br /><br />- `liquid` - the `max-item-count` will use the liquid templating engine.   |  No   |  N/A |

#### continuation-token attribute

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| template    |  Used to set the templating mode for the continuation token. Currently the only supported value is:<br /><br />- `liquid` - the continuation token will use the liquid templating engine.   |  No   |  N/A |

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
| post-trigger | String. Identifier of a [post-trigger](../cosmos-db/nosql/how-to-use-stored-procedures-triggers-udfs.md#how-to-run-post-triggers) function that is registered in your Cosmos DB container. | No | N/A |

### delete-request elements

|Name|Description|Required|
|----------|-----------------|--------------|
|   id    |   Identifier of the item to delete in the container.      |  Yes          |
| [partition-key](#partition-key-attributes)    |  A partition key for the location of the item in the container.    |      No      |    
| [etag](#etag-attribute) | Entity tag for the item in the container, used for [optimistic concurrency control](../cosmos-db/nosql/database-transactions-optimistic-concurrency.md#implementing-optimistic-concurrency-control-using-etag-and-http-headers).     |   No  |

#### write-request attributes

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| type | The type of write request: `insert`, `replace`, or `upsert`. | No  | `upsert`   |
| consistency-level | String. Sets the Cosmos DB [consistency level](../cosmos-db/consistency-levels.md) of the write request.  | No  | N/A   |
| indexing-directive | The [indexing policy](../cosmos-db/index-policy.md) that determines how the container's items should be indexed.  | No  | `default`   |
| pre-trigger | String. Identifier of a [pre-trigger](../cosmos-db/nosql/how-to-use-stored-procedures-triggers-udfs.md#how-to-run-pre-triggers) function that is registered in your Cosmos DB container. | No | N/A |
| post-trigger | String. Identifier of a [post-trigger](../cosmos-db/nosql/how-to-use-stored-procedures-triggers-udfs.md#how-to-run-post-triggers) function that is registered in your Cosmos DB container. | No | N/A |

### write-request elements

|Name|Description|Required|
|----------|-----------------|--------------|
|   id    |   Identifier of the item in the container.      |  Yes when `type` is `replace`.       |
| [etag](#etag-attribute) | Entity tag for the item in the container, used for [optimistic concurrency control](../cosmos-db/nosql/database-transactions-optimistic-concurrency.md#implementing-optimistic-concurrency-control-using-etag-and-http-headers).      |   No  |
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
-  [**Gateways:**](api-management-gateways-overview.md) dedicated

### Usage notes

* To configure and manage a resolver with this policy, see [Configure a GraphQL resolver](configure-graphql-resolver.md).
* This policy is invoked only when resolving a single field in a matching operation type in the schema.  

## Configure managed identity integration with Cosmos DB

You can configure an API Management system-assigned managed identity to access a Cosmos DB account, instead of providing an account key in the connection string.

Follow these steps to use the Azure CLI to configure the managed identity.

### Prerequisites

* Enable a system-assigned [managed identity](api-management-howto-use-managed-service-identity.md) in your API Management instance. In the portal, note the object (principal) ID of the managed identity.

* [!INCLUDE [include](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)] 


### Azure CLI script to configure the managed identity

```azurecli
# Set variables

# Variable for Azure Cosmos DB account name
cosmosName="<MY-COSMOS-DB-ACCOUNT>"

# Variable for resource group name
resourceGroupName="<MY-RESOURCE-GROUP>"

# Variable for subscription
resourceGroupName="<MY-SUBSCRIPTION-NAME>"

# Set principal variable to the value from Azure portal
principal="<MY-APIM-MANAGED-ID-PRINCIPAL-ID>"

# Get the scope value of Cosmos DB account
 
scope=$(
    az cosmosdb show \
        --resource-group $resourceGroupName \
        --name $cosmosName \
        --subscription $subscriptionName \
        --query id \
        --output tsv
)

# List the built-in Cosmos DB roles
# Currently, the roles aren't visible in the portal

az cosmosdb sql role definition list \
    --resource-group $resourceGroupName \
    --account-name $cosmosName \
    --subscription $subscriptionName \

# Take note of the role you want to assign, such as "Cosmos DB Built-in Data Contributor" in this example

# Assign desired Cosmos DB role to managed identity

az cosmosdb sql role assignment create \
    --resource-group $resourceGroupName \
    --account-name $cosmosName \
    --subscription $subscriptionName \
    --role-definition-name "Cosmos DB Built-in Data Contributor" \
    --principal-id $principal \
    --scope $scope    
```

## Examples

### Cosmos DB query request 

The following example resolves a GraphQL query using a SQL query to a Cosmos DB container.

```xml
<cosmosdb-data-source>
    <connection-info>
        <connection-string>
            AccountEndpoint=https://contoso-cosmosdb.
documents.azure.com:443/;AccountKey=CONTOSOKEY;
        </connection-string>
        <database-name>myDatabase</database-name>
        <container-name>myContainer</container-name>
    </connection-info>
    <query-request>
        <sql-statement>SELECT * FROM c </sql-statement>
    </query-request>
</cosmosdb-data-source>
```

### Cosmos DB read request

The following example resolves a GraphQL query using a point read request to a Cosmos DB container. The connection to the Cosmos DB account uses the API Management instance's system-assigned managed identity. The identity must be [configured](#configure-managed-identity-integration-with-cosmos-db) to access the Cosmos DB container.

The `id` and `partition-key` used for the read request are passed as query parameters and accessed using the `context.GraphQL.Arguments["id"]` context variable.

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
    <read-request>
        <id>
            @(context.GraphQL.Arguments["id"].ToString())
        </id>
        <partition-key>
            @(context.GraphQL.Arguments["id"].ToString())
    <read-request>
</cosmosdb-data-source>
```

### Cosmos DB delete request

The following example resolves a GraphQL mutation by a delete request to a Cosmos DB container. The `id` and `partition-key` used for the delete request are passed as query parameters and accessed using the `context.GraphQL.Arguments["id"]` context variable.

```xml
<cosmosdb-data-source>
    <connection-info>
        <connection-string>
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

The following example resolves a GraphQL mutation by an upsert request to a Cosmos DB container. The connection to the Cosmos DB account uses the API Management instance's system-assigned managed identity. The identity must be [configured](#configure-managed-identity-integration-with-cosmos-db) to access the Cosmos DB container. 

The `partition-key` used for the write request is passed as a query parameter and accessed using the `context.GraphQL.Arguments["id"]` context variable. The upsert request has a pre-trigger operation named "validateInput". The request body is mapped using a liquid template.

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

### Construct parameter input for Cosmos DB query

The following examples show ways to construct Cosmos DB [parameterized queries](../cosmos-db/nosql/query/parameterized-queries.md) using policy expressions. Choose a method based on the form of your parameter input.

The examples are based on the following sample GraphQL schema, and generate the corresponding Cosmos DB parameterized query.


**Example GraphQL schema**
```
input personInput {
  id: String!
  firstName: String
}

type Query {
  personsStringParam(stringInput: String): personsConnection
  personsPersonParam(input: personInput): personsConnection
}
```

**Example Cosmos DB query**

```json
{
    "query": "query { 
        personsPersonParam(input: { id: \"3\" } { 
        items { id firstName lastName } 
        } 
    }"
}    
```

#### Pass JSON object (JObject) from expression

**Example policy**

```xml
[...]
<query-request>
    <sql-statement>SELECT * FROM c where c.familyId =@param.id</sql-statement>
    <parameters>
        <parameter name="@param">@(context.GraphQL.Arguments["input"])</parameter>
    </parameters>
    </query-request>
[...]
```


#### Pass .NET input type (string, int, decimal, bool) from expression

**Example policy**

```xml
[...]
<query-request>
    <sql-statement>SELECT * FROM c where c.familyId =@param</sql-statement>
    <parameters>
        <parameter name="@param">@($"start.{context.GraphQL.Arguments["stringInput"]}")</parameter>
    </parameters>
</query-request>
[...]
```

#### Pass JSON value (JValue) from expression

**Example policy**

```xml
[...]
<query-request>
    <sql-statement>SELECT * FROM c where c.familyId =@param</sql-statement>
    <parameters>
        <parameter name="@param">@(context.GraphQL.Arguments["stringInput"])</parameter>
    </parameters>
</query-request>
[...]
```


## Related policies

* [GraphQL resolver policies](api-management-policies.md#graphql-resolver-policies)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
