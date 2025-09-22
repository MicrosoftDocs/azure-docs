

<a name="clusters_getnodes"></a>
## Get cluster nodes
```
GET /clusters/{cluster}/nodes
```


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**cluster**  <br>*required*|The cluster to query|string|
|**Query**|**operation**  <br>*optional*|If given, returns only the nodes for this operation ID, and includes the operation attribute on the body|string|
|**Query**|**request_id**  <br>*optional*|If given, returns only the nodes for the operation identified by this request ID,<br> and includes the operation attribute on the body|string|


### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|OK|[NodeList](#nodelist)|
|**400**|Invalid specification|No Content|
|**404**|Not found|No Content|


### Example HTTP request

#### Request path
```
/clusters/CLUSTER_NAME/nodes
```


### Example HTTP response

#### Response 200
```json
{
  "nodes" : [ { } ],
  "operation" : {
    "action" : "string",
    "startTime" : "2020-01-01T12:34:56Z"
  }
}
```


<a name="clusters_createnodes"></a>
## Create cluster nodes
```
POST /clusters/{cluster}/nodes/create
```


### Description
This operation adds new nodes from a node array to a cluster. It accepts multiple node definitions in a single call. It returns the URL to the operation that you can use to track the status of the operation.


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**cluster**  <br>*required*|The cluster to add nodes to|string|
|**Body**|**nodes**  <br>*required*|Sets of nodes to create|[NodeCreationRequest](#nodecreationrequest)|


### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**202**|Accepted  <br>**Headers** :   <br>`Location` (string) : The URL for the operation.|[NodeCreationResult](#nodecreationresult)|
|**409**|Invalid input|No Content|




### Example HTTP request

#### Request path
```
/clusters/CLUSTER_NAME/nodes/create
```


#### Request body
```json
{
  "requestId" : "00000000-0000-0000-0000-000000000000",
  "sets" : [ "object" ]
}
```


### Example HTTP response

#### Response 202
```json
{
  "operationId" : "00000000-0000-0000-0000-000000000000",
  "sets" : [ "object" ]
}
```


<a name="clusters_deallocatenodes"></a>
## Deallocate cluster nodes
```
POST /clusters/{cluster}/nodes/deallocate
```


### Description
This operation deallocates nodes in a cluster. You can identify the nodes by using several methods, including node name, node ID, or a filter.


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**cluster**  <br>*required*|The cluster where you want to deallocate nodes|string|
|**Body**|**action**  <br>*required*|Description of which nodes to deallocate|[NodeManagementRequest](#nodemanagementrequest)|


### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**202**|Accepted  <br>**Headers** :   <br>`Location` (string) : The URL for the operation.|[NodeManagementResult](#nodemanagementresult)|
|**409**|Invalid input|No Content|




### Example HTTP request

#### Request path
```
/clusters/CLUSTER_NAME/nodes/deallocate
```


#### Request body
```json
{
  "filter" : "State === \"Started\"",
  "hostnames" : [ "hostname1", "hostname2" ],
  "ids" : [ "id1", "id2" ],
  "ip_addresses" : [ "10.0.1.1", "10.1.1.2" ],
  "names" : [ "name1", "name2" ],
  "requestId" : "00000000-0000-0000-0000-000000000000"
}
```


### Example HTTP response

#### Response 202
```json
{
  "nodes" : [ "object" ],
  "operationId" : "00000000-0000-0000-0000-000000000000"
}
```


<a name="clusters_removenodes"></a>
## Terminate and remove cluster nodes
```
POST /clusters/{cluster}/nodes/remove
```


### Description
This operation removes nodes in a cluster. You can identify the nodes in several ways, including node name, node ID, or by using a filter. By default, nodes are removed when terminated unless the node has the `Fixed` property set to `true`. In that case, this call acts the same as terminate.


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**cluster**  <br>*required*|The cluster where you want to remove nodes|string|
|**Body**|**action**  <br>*required*|Description of which nodes to remove|[NodeManagementRequest](#nodemanagementrequest)|


### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**202**|Accepted  <br>**Headers** :   <br>`Location` (string) : The URL for the operation.|[NodeManagementResult](#nodemanagementresult)|
|**409**|Invalid input|No Content|




### Example HTTP request

#### Request path
```
/clusters/CLUSTER_NAME/nodes/remove
```


#### Request body
```json
{
  "filter" : "State === \"Started\"",
  "hostnames" : [ "hostname1", "hostname2" ],
  "ids" : [ "id1", "id2" ],
  "ip_addresses" : [ "10.0.1.1", "10.1.1.2" ],
  "names" : [ "name1", "name2" ],
  "requestId" : "00000000-0000-0000-0000-000000000000"
}
```


### Example HTTP response

#### Response 202
```json
{
  "nodes" : [ "object" ],
  "operationId" : "00000000-0000-0000-0000-000000000000"
}
```


<a name="clusters_shutdownnodes"></a>
## Terminate or deallocate cluster nodes
```
POST /clusters/{cluster}/nodes/shutdown
```


### Description
This operation terminates or deallocates nodes in a cluster. The operation uses the `ShutdownPolicy` attribute on each node to determine the action. If the attribute is set to `Terminate` (the default), the operation terminates the node. If the attribute is set to `Deallocate`, the operation deallocates the node.


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**cluster**  <br>*required*|The cluster where you want to shut down nodes|string|
|**Body**|**action**  <br>*required*|Description of which nodes to shut down|[NodeManagementRequest](#nodemanagementrequest)|


### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**202**|Accepted  <br>**Headers** :   <br>`Location` (string) : The URL for the operation.|[NodeManagementResult](#nodemanagementresult)|
|**409**|Invalid input|No Content|




### Example HTTP request

#### Request path
```
/clusters/CLUSTER_NAME/nodes/shutdown
```


#### Request body
```json
{
  "filter" : "State === \"Started\"",
  "hostnames" : [ "hostname1", "hostname2" ],
  "ids" : [ "id1", "id2" ],
  "ip_addresses" : [ "10.0.1.1", "10.1.1.2" ],
  "names" : [ "name1", "name2" ],
  "requestId" : "00000000-0000-0000-0000-000000000000"
}
```


### Example HTTP response

#### Response 202
```json
{
  "nodes" : [ "object" ],
  "operationId" : "00000000-0000-0000-0000-000000000000"
}
```


<a name="clusters_startnodes"></a>
## Start deallocated or terminated cluster nodes
```
POST /clusters/{cluster}/nodes/start
```


### Description
This operation starts nodes in a cluster. You can identify the nodes by node name, node ID, or by using a filter.


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**cluster**  <br>*required*|The cluster to start nodes in|string|
|**Body**|**action**  <br>*required*|Description of which nodes to start|[NodeManagementRequest](#nodemanagementrequest)|


### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**202**|Accepted  <br>**Headers** :   <br>`Location` (string) : The URL for the operation.|[NodeManagementResult](#nodemanagementresult)|
|**409**|Invalid input|No Content|




### Example HTTP request

#### Request path
```
/clusters/CLUSTER_NAME/nodes/start
```


#### Request body
```json
{
  "filter" : "State === \"Started\"",
  "hostnames" : [ "hostname1", "hostname2" ],
  "ids" : [ "id1", "id2" ],
  "ip_addresses" : [ "10.0.1.1", "10.1.1.2" ],
  "names" : [ "name1", "name2" ],
  "requestId" : "00000000-0000-0000-0000-000000000000"
}
```


### Example HTTP response

#### Response 202
```json
{
  "nodes" : [ "object" ],
  "operationId" : "00000000-0000-0000-0000-000000000000"
}
```


<a name="clusters_terminatenodes"></a>
## Terminate cluster nodes
```
POST /clusters/{cluster}/nodes/terminate
```


### Description
This operation terminates nodes in a cluster. You can identify the nodes in several ways, including node name, node ID, or by using a filter.


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**cluster**  <br>*required*|The cluster where you want to terminate nodes|string|
|**Body**|**action**  <br>*required*|Description of which nodes to terminate|[NodeManagementRequest](#nodemanagementrequest)|


### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**202**|Accepted  <br>**Headers** :   <br>`Location` (string) : The URL for the operation.|[NodeManagementResult](#nodemanagementresult)|
|**409**|Invalid input|No Content|




### Example HTTP request

#### Request path
```
/clusters/CLUSTER_NAME/nodes/terminate
```


#### Request body
```json
{
  "filter" : "State === \"Started\"",
  "hostnames" : [ "hostname1", "hostname2" ],
  "ids" : [ "id1", "id2" ],
  "ip_addresses" : [ "10.0.1.1", "10.1.1.2" ],
  "names" : [ "name1", "name2" ],
  "requestId" : "00000000-0000-0000-0000-000000000000"
}
```


### Example HTTP response

#### Response 202
```json
{
  "nodes" : [ "object" ],
  "operationId" : "00000000-0000-0000-0000-000000000000"
}
```


<a name="clusters_scale"></a>
## Scale cluster to size
```
POST /clusters/{cluster}/scale/{nodearray}
```


### Description
This operation adds nodes as needed to a node array to reach a total count. The cluster processes the request one time. It doesn't re-add nodes later to maintain the number. You can scale by either total cores or total nodes, but not both. The operation returns the URL to use for tracking the status of the operation.


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**cluster**  <br>*required*|The cluster to add nodes to|string|
|**Path**|**nodearray**  <br>*required*|The node array to add nodes to|string|
|**Query**|**totalCoreCount**  <br>*optional*|The total number of cores in this node array, including nodes you already created|integer|
|**Query**|**totalNodeCount**  <br>*optional*|The total number of machines in this node array, including nodes you already created|integer|


### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**202**|Accepted  <br>**Headers** :   <br>`Location` (string) : The URL for the operation.|[NodeCreationResult](#nodecreationresult)|
|**409**|Invalid input|No Content|




### Example HTTP request

#### Request path
```
/clusters/CLUSTER_NAME/scale/NODEARRAY_NAME
```


### Example HTTP response

#### Response 202
```json
{
  "operationId" : "00000000-0000-0000-0000-000000000000",
  "sets" : [ "object" ]
}
```


<a name="clusters_getclusterstatus"></a>
## Get cluster status
```
GET /clusters/{cluster}/status
```


### Description
This operation returns information for the nodes and node arrays in a cluster. For each node array, it returns the status of each "bucket" of allocation that you can use. The status shows how many nodes are in the bucket and how many more nodes you can add. Each bucket is a set of possible VMs with a specific hardware profile. You can create these VMs in a specific location under a customer account. The user's cluster definition determines the valid buckets for a node array. The cloud provider determines the limits.

### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**cluster**  <br>*required*|The cluster to query|string|
|**Query**|**nodes**  <br>*optional*|If true, the response includes nodes and node references|boolean|


### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|OK|[ClusterStatus](#clusterstatus)|




### Example HTTP request

#### Request path
```
/clusters/CLUSTER_NAME/status
```


### Example HTTP response

#### Response 200
```json
{
  "maxCoreCount" : 16,
  "maxCount" : 4,
  "nodearrays" : [ "object" ],
  "nodes" : [ { } ],
  "state" : "Starting",
  "targetState" : "Started"
}
```


<a name="clusters_getclusterusage"></a>
## Get usage and optional cost information for a cluster
```
GET /clusters/{cluster}/usage
```


### Description
This operation returns overall usage data (core hours) and cost data, if available, for the cluster, as well as a per-nodearray breakdown. By default, it returns the current month's worth of usage.


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**cluster**  <br>*required*|The cluster to return usage data for|string|
|**Query**|**timeframe**  <br>*optional*|The time range for the query.  monthToDate returns the usage for the current month, and  lastMonth returns the usage for the previous month. weekToDate returns the usage for the current week (starting Sunday). custom requires to 'from' and 'to' query parameters. The default is MonthToDate. All times are in UTC.|enum (monthToDate, lastMonth, weekToDate, custom)|
|**Query**|**from**  <br>*optional*|For custom timeframes, the start of the timeframe in ISO-8601 format.  The value is rounded down to the nearest hour or day.|string|
|**Query**|**to**  <br>*optional*|For custom timeframes, use the end of the timeframe in ISO-8601 format. The value rounds up to the nearest hour or day.|string|
|**Query**|**granularity**  <br>*optional*|Specifies how to aggregate data: by hour, by daily, or as a single number. The default is daily.|enum (total, daily, hourly)|


### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|OK|[ClusterUsage](#clusterusage)|




### Example HTTP request

#### Request path
```
/clusters/CLUSTER_NAME/usage
```


### Example HTTP response

#### Response 200
```json
{
  "usage" : [ "object" ]
}
```


<a name="operations_list"></a>
## Lists the status of operations
```
GET /operations/
```


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Query**|**request_id**  <br>*optional*|The request ID for the operation. If you provide this ID, the list contains either zero or one element.|string|


### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|OK|< [OperationStatus](#operationstatus) > array|
|**400**|Invalid request|No Content|
|**404**|Not found|No Content|




### Example HTTP request

#### Request path
```
/operations/
```


### Example HTTP response

#### Response 200
```json
[ {
  "action" : "string",
  "startTime" : "2020-01-01T12:34:56Z"
} ]
```


<a name="operations_getstatus"></a>
## Gets operation status by ID
```
GET /operations/{id}
```


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**id**  <br>*required*|The operation ID|string|


### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|OK|[OperationStatus](#operationstatus)|
|**404**|Not found|No Content|




### Example HTTP request

#### Request path
```
/operations/00000000-0000-0000-0000-000000000000
```


### Example HTTP response

#### Response 200
```json
{
  "action" : "string",
  "startTime" : "2020-01-01T12:34:56Z"
}
```



