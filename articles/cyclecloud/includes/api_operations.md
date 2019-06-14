

<a name="getnodes"></a>
## Get cluster nodes
```
GET /clusters/{cluster}/nodes
```


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**cluster**  <br>*required*|The cluster to query|string|
|**Query**|**operation**  <br>*optional*|If given, returns only the nodes for this operation id, and includes the operation attribute on the body|string|
|**Query**|**request_id**  <br>*optional*|If given, returns only the nodes for the operation identified by this request id,<br> and includes the operation attribute on the body|string|


### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|OK|[NodeList](#nodelist)|
|**400**|Invalid specification|No Content|
|**404**|Not found|No Content|




### Example HTTP request

#### Request path
```
/clusters/string/nodes
```


### Example HTTP response

#### Response 200
```json
{
  "nodes" : [ { } ],
  "operation" : {
    "action" : "string",
    "startTime" : "string"
  }
}
```


<a name="createnodes"></a>
## Create cluster nodes
```
POST /clusters/{cluster}/nodes/create
```


### Description
This operation adds new nodes from a nodearray to a cluster. It accepts multiple node definitions in a single call. It returns the URL to the operation that can be used to track the status of the operation.


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**cluster**  <br>*required*|The cluster to add nodes to|string|
|**Body**|**nodes**  <br>*required*|Sets of nodes to be created|[NodeCreation](#nodecreation)|


### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**202**|Accepted  <br>**Headers** :   <br>`Location` (string) : The URL for the operation.|[Response 202](#createnodes-response-202)|
|**409**|Invalid input|No Content|

<a name="createnodes-response-202"></a>
**Response 202**

|Name|Description|Schema|
|---|---|---|
|**operationId**  <br>*required*|The id of this operation  <br>**Example** : `"00000000-0000-0000-0000-000000000000"`|string|
|**sets**  <br>*required*|An array of sets, in the same order as in the request  <br>**Example** : `[ "object" ]`|< [sets](#clusters-cluster-nodes-create-post-sets) > array|

<a name="clusters-cluster-nodes-create-post-sets"></a>
**sets**

|Name|Description|Schema|
|---|---|---|
|**added**  <br>*required*|How many nodes were started in this set  <br>**Example** : `1`|integer|
|**message**  <br>*optional*|Indicates why not all requested nodes could be added, if present  <br>**Example** : `"string"`|string|




### Example HTTP request

#### Request path
```
/clusters/string/nodes/create
```


#### Request body
```json
{
  "requestId" : "string",
  "sets" : [ "object" ]
}
```


### Example HTTP response

#### Response 202
```json
"object"
```


<a name="deallocatenodes"></a>
## Deallocate cluster nodes
```
POST /clusters/{cluster}/nodes/deallocate
```


### Description
This operation deallocates nodes in a cluster. The nodes can be identified in several ways,  including node name, node id, or by filter.


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**cluster**  <br>*required*|The cluster to deallocate nodes in|string|
|**Body**|**action**  <br>*required*|Description of which nodes to deallocate|[NodeManagementRequest](#nodemanagementrequest)|


### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**202**|Accepted  <br>**Headers** :   <br>`Location` (string) : The URL for the operation.|[NodeManagementResult](#nodemanagementresult)|
|**409**|Invalid input|No Content|




### Example HTTP request

#### Request path
```
/clusters/string/nodes/deallocate
```


#### Request body
```json
{
  "filter" : "State === \"Started\"",
  "ids" : [ "id1", "id2" ],
  "names" : [ "name1", "name2" ],
  "requestId" : "string"
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


<a name="removenodes"></a>
## Terminate and remove cluster nodes
```
POST /clusters/{cluster}/nodes/remove
```


### Description
This operation removes nodes in a cluster. The nodes can be identified in several ways,  including node name, node id, or by filter. Note that by default nodes are removed when terminated (unless the node has Fixed set to true), in which case this call is no different than terminate.


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**cluster**  <br>*required*|The cluster to remove nodes in|string|
|**Body**|**action**  <br>*required*|Description of which nodes to remove|[NodeManagementRequest](#nodemanagementrequest)|


### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**202**|Accepted  <br>**Headers** :   <br>`Location` (string) : The URL for the operation.|[NodeManagementResult](#nodemanagementresult)|
|**409**|Invalid input|No Content|




### Example HTTP request

#### Request path
```
/clusters/string/nodes/remove
```


#### Request body
```json
{
  "filter" : "State === \"Started\"",
  "ids" : [ "id1", "id2" ],
  "names" : [ "name1", "name2" ],
  "requestId" : "string"
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


<a name="shutdownnodes"></a>
## Terminate or deallocate cluster nodes
```
POST /clusters/{cluster}/nodes/shutdown
```


### Description
This operation terminates or deallocates nodes in a cluster, depending on whether the ShutdownPolicy attribute on each node is Terminate (the default) or Deallocate, respectively.


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**cluster**  <br>*required*|The cluster to shutdown nodes in|string|
|**Body**|**action**  <br>*required*|Description of which nodes to shutdown|[NodeManagementRequest](#nodemanagementrequest)|


### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**202**|Accepted  <br>**Headers** :   <br>`Location` (string) : The URL for the operation.|[NodeManagementResult](#nodemanagementresult)|
|**409**|Invalid input|No Content|




### Example HTTP request

#### Request path
```
/clusters/string/nodes/shutdown
```


#### Request body
```json
{
  "filter" : "State === \"Started\"",
  "ids" : [ "id1", "id2" ],
  "names" : [ "name1", "name2" ],
  "requestId" : "string"
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


<a name="startnodes"></a>
## Start deallocated or terminated cluster nodes
```
POST /clusters/{cluster}/nodes/start
```


### Description
This operation starts nodes in a cluster. The nodes can be identified in several ways,  including node name, node id, or by filter.


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
/clusters/string/nodes/start
```


#### Request body
```json
{
  "filter" : "State === \"Started\"",
  "ids" : [ "id1", "id2" ],
  "names" : [ "name1", "name2" ],
  "requestId" : "string"
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


<a name="terminatenodes"></a>
## Terminate cluster nodes
```
POST /clusters/{cluster}/nodes/terminate
```


### Description
This operation terminates nodes in a cluster. The nodes can be identified in several ways,  including node name, node id, or by filter.


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**cluster**  <br>*required*|The cluster to terminate nodes in|string|
|**Body**|**action**  <br>*required*|Description of which nodes to terminate|[NodeManagementRequest](#nodemanagementrequest)|


### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**202**|Accepted  <br>**Headers** :   <br>`Location` (string) : The URL for the operation.|[NodeManagementResult](#nodemanagementresult)|
|**409**|Invalid input|No Content|




### Example HTTP request

#### Request path
```
/clusters/string/nodes/terminate
```


#### Request body
```json
{
  "filter" : "State === \"Started\"",
  "ids" : [ "id1", "id2" ],
  "names" : [ "name1", "name2" ],
  "requestId" : "string"
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


<a name="getclusterstatus"></a>
## Get cluster status
```
GET /clusters/{cluster}/status
```


### Description
This operation contains information for the nodes and nodearrays in a given cluster. For each nodearray, it returns the status of each "bucket" of allocation that can be used, such as how many  nodes are in the bucket, how many more can be added, etc. Each bucket is a set of possible VMs of a given hardware profile, that can be created in a given location, under a given  customer account, etc. The valid buckets for a nodearray are determined by the user's cluster definition, but the limits are determined in part by the cloud provider.


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**cluster**  <br>*required*|The cluster to query|string|
|**Query**|**nodes**  <br>*optional*|If true, nodes and node references are returned in the response|boolean|


### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|OK|[ClusterStatus](#clusterstatus)|




### Example HTTP request

#### Request path
```
/clusters/string/status
```


### Example HTTP response

#### Response 200
```json
{
  "maxCoreCount" : 0,
  "maxCount" : 0,
  "nodearrays" : [ "object" ],
  "nodes" : [ { } ],
  "state" : "string",
  "targetState" : "string"
}
```


<a name="getoperationstatusbyrequest"></a>
## Gets operation status by request id
```
GET /operations
```


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Query**|**request_id**  <br>*required*|The request ID for the operation|string|


### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|OK|[OperationStatus](#operationstatus)|
|**400**|Invalid request|No Content|
|**404**|Not found|No Content|




### Example HTTP request

#### Request path
```
/operations?request_id=string
```


### Example HTTP response

#### Response 200
```json
{
  "action" : "string",
  "startTime" : "string"
}
```


<a name="getoperationstatusbyid"></a>
## Gets operation status by id
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
/operations/string
```


### Example HTTP response

#### Response 200
```json
{
  "action" : "string",
  "startTime" : "string"
}
```



