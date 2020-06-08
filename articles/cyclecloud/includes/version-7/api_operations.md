

<a name="clusters_getnodes"></a>
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
This operation adds new nodes from a nodearray to a cluster. It accepts multiple node definitions in a single call. It returns the URL to the operation that can be used to track the status of the operation.


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**cluster**  <br>*required*|The cluster to add nodes to|string|
|**Body**|**nodes**  <br>*required*|Sets of nodes to be created|[NodeCreationRequest](#nodecreationrequest)|


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
This operation adds nodes as needed to a nodearray to hit a total count. The request is processed one time, and does not re-add nodes later to maintain the given number. This scales by either total cores or total nodes, but not both. It returns the URL to the operation that can be used to track the status of the operation.


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**cluster**  <br>*required*|The cluster to add nodes to|string|
|**Path**|**nodearray**  <br>*required*|The nodearray to add nodes to|string|
|**Query**|**totalCoreCount**  <br>*optional*|The total number of cores to have in this nodearray, including nodes already created|integer|
|**Query**|**totalNodeCount**  <br>*optional*|The total number of machines to have in this nodearray, including nodes already created|integer|


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


<a name="operations_list"></a>
## Lists the status of operations
```
GET /operations/
```


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Query**|**request_id**  <br>*optional*|The request ID for the operation. If this is given, the list will only have 0 or 1 element in it.|string|


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



