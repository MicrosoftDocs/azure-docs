---
title: CycleCloud API operations
description: Reference for Azure CycleCloud REST API operations used to manage clusters, nodes, and related resources programmatically.
ms.service: cyclecloud
ms.topic: reference
ms.date: 05/13/2026
author: emilylo
ms.custom: include-file

# Customer intent: As a developer or operator, I want to use the CycleCloud REST API to manage clusters and nodes programmatically.
---

Azure CycleCloud provides a REST API for managing clusters, nodes, and related resources programmatically. Use these API operations to query cluster state, create and manage nodes, and track long-running operations. This reference lists the available endpoints, parameters, and response formats to help you automate and integrate CycleCloud cluster management into your workflows.

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
|**Query**|**request_id**  <br>*optional*|If given, returns only the nodes for the operation identified by this request ID, and includes the operation attribute on the body|string|


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
|**202**|Accepted  <br>**Headers** :   <br>`Location` (string): The URL for the operation.|[NodeCreationResult](#nodecreationresult)|
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
This operation deallocates nodes in a cluster. The nodes can be identified in several ways,  including node name, node ID, or by filter.


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**cluster**  <br>*required*|The cluster to deallocate nodes in|string|
|**Body**|**action**  <br>*required*|Description of which nodes to deallocate|[NodeManagementRequest](#nodemanagementrequest)|


### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**202**|Accepted  <br>**Headers** :   <br>`Location` (string): The URL for the operation.|[NodeManagementResult](#nodemanagementresult)|
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


<a name="clusters_reimagenodes"></a>
## Reimage cluster nodes
```
POST /clusters/{cluster}/nodes/reimage
```


### Description
This operation reimages nodes in a cluster. The nodes can be identified in several ways,  including node name, node ID, or by filter.


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**cluster**  <br>*required*|The cluster to reimage nodes in|string|
|**Body**|**action**  <br>*required*|Description of which nodes to reimage|[NodeManagementRequest](#nodemanagementrequest)|


### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**202**|Accepted  <br>**Headers** :   <br>`Location` (string): The URL for the operation.|[NodeManagementResult](#nodemanagementresult)|
|**409**|Invalid input|No Content|




### Example HTTP request

#### Request path
```
/clusters/CLUSTER_NAME/nodes/reimage
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
This operation removes nodes in a cluster. You can identify the nodes by node name, node ID, or filter. By default, CycleCloud removes nodes on termination, so this call behaves like terminate. Nodes with the Fixed attribute set to true aren't removed on termination.


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**cluster**  <br>*required*|The cluster to remove nodes in|string|
|**Body**|**action**  <br>*required*|Description of which nodes to remove|[NodeManagementRequest](#nodemanagementrequest)|


### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**202**|Accepted  <br>**Headers** :   <br>`Location` (string): The URL for the operation.|[NodeManagementResult](#nodemanagementresult)|
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


<a name="clusters_restartnodes"></a>
## Restart cluster nodes
```
POST /clusters/{cluster}/nodes/restart
```


### Description
This operation restarts nodes in a cluster. The nodes can be identified in several ways,  including node name, node ID, or by filter.


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**cluster**  <br>*required*|The cluster to restart nodes in|string|
|**Body**|**action**  <br>*required*|Description of which nodes to restart|[NodeManagementRequest](#nodemanagementrequest)|


### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**202**|Accepted  <br>**Headers** :   <br>`Location` (string): The URL for the operation.|[NodeManagementResult](#nodemanagementresult)|
|**409**|Invalid input|No Content|




### Example HTTP request

#### Request path
```
/clusters/CLUSTER_NAME/nodes/restart
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
This call shuts down nodes in a cluster. Each node's ShutdownPolicy attribute decides the action: Terminate (default) or Deallocate.

### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**cluster**  <br>*required*|The cluster to shut down nodes in|string|
|**Body**|**action**  <br>*required*|Description of which nodes to shut down|[NodeManagementRequest](#nodemanagementrequest)|


### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**202**|Accepted  <br>**Headers** :   <br>`Location` (string): The URL for the operation.|[NodeManagementResult](#nodemanagementresult)|
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
This operation starts nodes in a cluster. The nodes can be identified in several ways,  including node name, node ID, or by filter.


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**cluster**  <br>*required*|The cluster to start nodes in|string|
|**Body**|**action**  <br>*required*|Description of which nodes to start|[NodeManagementRequest](#nodemanagementrequest)|


### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**202**|Accepted  <br>**Headers** :   <br>`Location` (string): The URL for the operation.|[NodeManagementResult](#nodemanagementresult)|
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
This operation terminates nodes in a cluster. The nodes can be identified in several ways,  including node name, node ID, or by filter.


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**cluster**  <br>*required*|The cluster to terminate nodes in|string|
|**Body**|**action**  <br>*required*|Description of which nodes to terminate|[NodeManagementRequest](#nodemanagementrequest)|


### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**202**|Accepted  <br>**Headers** :   <br>`Location` (string): The URL for the operation.|[NodeManagementResult](#nodemanagementresult)|
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


<a name="clusters_ghrnode"></a>
## Submit Guest Health Report for cluster node
```
POST /clusters/{cluster}/nodes/{node}/ghr
```


### Description
Submit a health report for a node with a health issue


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**cluster**  <br>*required*|The cluster that contains the node to report|string|
|**Path**|**node**  <br>*required*|The node to report|string|
|**Query**|**category**  <br>*optional*|Guest Health Report category for the impact|string|
|**Query**|**description**  <br>*optional*|Custom message describing the failure or context|string|


### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**202**|Accepted|No Content|
|**400**|Invalid input|No Content|
|**404**|Not Found|No Content|
|**409**|Conflict - Guest Health Report already submitted for this node|No Content|




### Example HTTP request

#### Request path
```
/clusters/CLUSTER_NAME/nodes/string/ghr
```


<a name="clusters_getghr"></a>
## Get Guest Health Report for cluster node
```
GET /clusters/{cluster}/nodes/{node}/ghr
```


### Description
Returns the workload impact of a node with a health issue, so you can submit it to the health reporting endpoint.


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**cluster**  <br>*required*|The cluster that contains the node to report|string|
|**Path**|**node**  <br>*required*|The node to report|string|
|**Query**|**category**  <br>*optional*|Guest Health Report category for the impact|string|
|**Query**|**description**  <br>*optional*|Custom message describing the failure or context|string|


### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Ok|No Content|
|**400**|Invalid input|No Content|
|**404**|Not Found|No Content|




### Example HTTP request

#### Request path
```
/clusters/CLUSTER_NAME/nodes/string/ghr
```


<a name="clusters_scale"></a>
## Scale cluster to size
```
POST /clusters/{cluster}/scale/{nodearray}
```


### Description
This operation adds nodes as needed to a nodearray to hit a total count. The request is processed one time and doesn't re-add nodes later to maintain the given number. Specify the target size using either `totalCoreCount` (total CPU cores) or `totalNodeCount` (total VMs), but not both in the same request. It returns the URL to the operation that you can use to track its status.


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
|**202**|Accepted  <br>**Headers** :   <br>`Location` (string): The URL for the operation.|[NodeCreationResult](#nodecreationresult)|
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
This operation contains information for the nodes and nodearrays in a given cluster. For each nodearray, it returns the status of each available allocation "bucket". The status includes the current node count in the bucket and how many more nodes you can add. Each bucket is a set of possible VMs of a given hardware profile that can be created in a given location under a given customer account, etc. The user's cluster definition determines the valid buckets for a nodearray, but the cloud provider partly determines the limits.


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


<a name="clusters_getclusterusage"></a>
## Get usage and optional cost information for a cluster
```
GET /clusters/{cluster}/usage
```


### Description
This operation returns overall usage data (core hours) and cost data, if available, for the cluster, and a per-nodearray breakdown. By default it returns the current month's worth of usage.


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**cluster**  <br>*required*|The cluster to return usage data for|string|
|**Query**|**timeframe**  <br>*optional*|The time range to use for the query. Valid values: `monthToDate` (current month), `lastMonth` (previous month), `weekToDate` (current week, starting Sunday), or `custom` (requires the `from` and `to` query parameters). The default is `monthToDate`. All times are in UTC.|enum (monthToDate, lastMonth, weekToDate, custom)|
|**Query**|**from**  <br>*optional*|For custom timeframes, this value is the start of the timeframe in ISO-8601 format. It is rounded down to the nearest hour or day.|string|
|**Query**|**to**  <br>*optional*|For custom timeframes, this value is the end of the timeframe in ISO-8601 format. It is rounded up to the nearest hour or day.|string|
|**Query**|**granularity**  <br>*optional*|Specifies how to aggregate data: hourly, daily, or as a single total. The default interval is daily.|enum (total, daily, hourly)|


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
## List the status of operations
```
GET /operations/
```


### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Query**|**request_id**  <br>*optional*|The request ID for the operation. If this value is given, the list contains 0 or 1 element.|string|


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



