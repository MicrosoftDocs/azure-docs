

<a name="clusterstatus"></a>
## ClusterStatus
Status of the cluster


|Name|Description|Schema|
|---|---|---|
|**maxCoreCount**  <br>*required*|The maximum number of cores that may be added to this cluster  <br>**Example** : `16`|integer|
|**maxCount**  <br>*required*|The maximum number of nodes that may be added to this cluster  <br>**Example** : `4`|integer|
|**nodearrays**  <br>*required*|**Example** : `[ "object" ]`|< [nodearrays](#clusterstatus-nodearrays) > array|
|**nodes**  <br>*optional*|An optional list of nodes in this cluster, only included if nodes=true is in the query  <br>**Example** : `[ "[node](#node)" ]`|< [Node](#node) > array|
|**state**  <br>*optional*|The current state of the cluster, if it has been started at least once  <br>**Example** : `"Starting"`|string|
|**targetState**  <br>*optional*|The desired state of the cluster (eg Started or Terminated)  <br>**Example** : `"Started"`|string|

<a name="clusterstatus-nodearrays"></a>
**nodearrays**

|Name|Description|Schema|
|---|---|---|
|**buckets**  <br>*required*|Each bucket of allocation for this nodearray. The "core count" settings are always a multiple of the core count for this bucket.  <br>**Example** : `[ "object" ]`|< [buckets](#clusterstatus-buckets) > array|
|**maxCoreCount**  <br>*required*|The maximum number of cores that may be in this nodearray  <br>**Example** : `16`|integer|
|**maxCount**  <br>*required*|The maximum number of nodes that may be in this nodearray  <br>**Example** : `4`|integer|
|**name**  <br>*required*|The nodearray this is describing  <br>**Example** : `"execute"`|string|
|**nodearray**  <br>*required*|The attributes of this nodearray  <br>**Example** : `"[node](#node)"`|[Node](#node)|

<a name="clusterstatus-buckets"></a>
**buckets**

|Name|Description|Schema|
|---|---|---|
|**activeCoreCount**  <br>*required*|The number of cores in use for this bucket, in this nodearray  <br>**Example** : `40`|integer|
|**activeCount**  <br>*required*|The number of nodes in use for this bucket, in this nodearray. This includes nodes which are still acquiring a VM.  <br>**Example** : `10`|integer|
|**activeNodes**  <br>*optional*|The node names in use for this bucket, in this nodearray. This includes nodes which are still acquiring a VM. This is only included if nodes=true is in the query.  <br>**Example** : `[ "string" ]`|< string > array|
|**availableCoreCount**  <br>*required*|How many extra cores may be created in this bucket, in this nodearray. Always a multiple of availableCount.  <br>**Example** : `8`|integer|
|**availableCount**  <br>*required*|How many extra nodes may be created in this bucket, in this nodearray. Note this may be less than implied by maxCount and usedCount, since maxCount may be limited globally.  <br>**Example** : `2`|integer|
|**bucketId**  <br>*required*|The identifier for this bucket. This will always have the same value  for a given bucket in a nodearray, as long as the cluster is not deleted.  <br>**Example** : `"00000000-0000-0000-0000-000000000000"`|string|
|**consumedCoreCount**  <br>*required*|The number of cores for this family that are already in use across the entire region.  <br>**Example** : `2`|integer|
|**definition**  <br>*optional*|The properties of this bucket, used to create nodes from this bucket. The create-nodes API takes this definition in its `bucket` property.  <br>**Example** : `"object"`|[definition](#clusterstatus-buckets-definition)|
|**familyConsumedCoreCount**  <br>*optional*|The number of cores for this family that are already in use across the entire region.  <br>**Example** : `2`|integer|
|**familyQuotaCoreCount**  <br>*optional*|The number of total cores that can be started for this family in this region. This might not be an integer multiple of quotaCount.  <br>**Example** : `16`|integer|
|**familyQuotaCount**  <br>*optional*|The number of total instances that can be started (given familyQuotaCoreCount)  <br>**Example** : `4`|integer|
|**invalidReason**  <br>*required*|If valid is false, this will contain the reason the bucket is invalid. Currently NotActivated and DisabledMachineType are the only reasons.  <br>**Example** : `"DisabledMachineType"`|string|
|**maxCoreCount**  <br>*required*|The maximum number of cores that may be in this bucket, including global and nodearray limits.  Always a multiple of maxCount.  <br>**Example** : `16`|integer|
|**maxCount**  <br>*required*|The maximum number of nodes that may be in this bucket, including global and nodearray limits  <br>**Example** : `4`|integer|
|**maxPlacementGroupCoreSize**  <br>*required*|The maximum total number of cores that can be in a placement group in this bucket. Always a multiple of maxPlacementGroupSize.  <br>**Example** : `64`|integer|
|**maxPlacementGroupSize**  <br>*required*|The maximum total number of instances that can be in a placement group in this bucket  <br>**Example** : `16`|integer|
|**placementGroups**  <br>*required*|The placement groups in use for this nodearray, if any.  <br>**Example** : `[ "object" ]`|< [placementGroups](#clusterstatus-buckets-placementgroups) > array|
|**quotaCoreCount**  <br>*required*|The number of total cores that can be started for this family in this region, taking into account the regional quota core count as well. This might not be an integer multiple of quotaCount.  <br>**Example** : `16`|integer|
|**quotaCount**  <br>*required*|The number of total instances that can be started (given quotaCoreCount)  <br>**Example** : `4`|integer|
|**regionalConsumedCoreCount**  <br>*optional*|The number of cores that are already in use across the entire region.  <br>**Example** : `2`|integer|
|**regionalQuotaCoreCount**  <br>*optional*|The number of total cores that can be started in this region. This might not be an integer multiple of regionalQuotaCount.  <br>**Example** : `16`|integer|
|**regionalQuotaCount**  <br>*optional*|The number of total instances that can be started (given regionalQuotaCoreCount)  <br>**Example** : `4`|integer|
|**valid**  <br>*required*|If true, this bucket represents a currently valid bucket to use for new nodes. If false, this bucket represents existing nodes only.  <br>**Example** : `true`|boolean|
|**virtualMachine**  <br>*required*|The properties of the virtual machines launched from this bucket  <br>**Example** : `"object"`|[virtualMachine](#clusterstatus-buckets-virtualmachine)|

<a name="clusterstatus-buckets-definition"></a>
**definition**

|Name|Description|Schema|
|---|---|---|
|**machineType**  <br>*required*|The VM size of the virtual machine  <br>**Example** : `"A2"`|string|

<a name="clusterstatus-buckets-placementgroups"></a>
**placementGroups**

|Name|Description|Schema|
|---|---|---|
|**activeCoreCount**  <br>*required*|How many cores are in this scaleset  <br>**Example** : `16`|integer|
|**activeCount**  <br>*required*|How many nodes are in this scaleset  <br>**Example** : `4`|integer|
|**name**  <br>*required*|The unique identifier of this placement group  <br>**Example** : `"my-placement-group"`|string|

<a name="clusterstatus-buckets-virtualmachine"></a>
**virtualMachine**

|Name|Description|Schema|
|---|---|---|
|**gpuCount**  <br>*required*|The number of GPUs this machine type has  <br>**Example** : `2`|integer|
|**infiniband**  <br>*required*|If this virtual machine supports InfiniBand connectivity  <br>**Example** : `true`|boolean|
|**memory**  <br>*required*|The RAM in this virtual machine, in GB  <br>**Example** : `7.5`|number|
|**pcpuCount**  <br>*required*|The number of physical CPUs this machine type has  <br>**Example** : `16`|integer|
|**vcpuCount**  <br>*required*|The number of virtual CPUs this machine type has  <br>**Example** : `32`|integer|


<a name="node"></a>
## Node
A node record

*Type* : object


<a name="nodecreationrequest"></a>
## NodeCreationRequest
Specifies how to add nodes to a cluster


|Name|Description|Schema|
|---|---|---|
|**requestId**  <br>*optional*|Optional user-supplied unique token to prevent duplicate operations in case of network communication errors.  If this is included and matches an earlier request id, the server ignores this request and returns a 409 error.  <br>**Example** : `"00000000-0000-0000-0000-000000000000"`|string|
|**sets**  <br>*required*|A list of node definitions to create. The request must contain at least one set. Each set can specify a different set of properties.  <br>**Example** : `[ "object" ]`|< [sets](#nodecreationrequest-sets) > array|

<a name="nodecreationrequest-sets"></a>
**sets**

|Name|Description|Schema|
|---|---|---|
|**count**  <br>*required*|The number of nodes to create  <br>**Example** : `1`|integer|
|**definition**  <br>*optional*|The definition of the bucket to use. This is provided by the cluster status API call.  If some of the items given in the status call are missing, or the entire bucket property is missing, the first bucket that matches the given items is used.  <br>**Example** : `"object"`|[definition](#nodecreationrequest-definition)|
|**nameFormat**  <br>*optional*|If given, nodes will use this naming convention instead of the standard "nodearray-%d" format  <br>**Example** : `"custom-name-%d"`|string|
|**nameOffset**  <br>*optional*|If given, along with nameFormat, offsets nodeindex for new nodes.  <br>**Example** : `1`|integer|
|**nodeAttributes**  <br>*optional*|Additional attributes to be set on each node from this set  <br>**Example** : `"[node](#node)"`|[Node](#node)|
|**nodearray**  <br>*required*|The name of the nodearray to start nodes from  <br>**Example** : `"execute"`|string|
|**placementGroupId**  <br>*optional*|If given, nodes with the same value for groupId will all be started in the same placement group.  <br>**Example** : `"string"`|string|

<a name="nodecreationrequest-definition"></a>
**definition**

|Name|Description|Schema|
|---|---|---|
|**machineType**  <br>*optional*|**Example** : `"A2"`|string|


<a name="nodecreationresult"></a>
## NodeCreationResult

|Name|Description|Schema|
|---|---|---|
|**operationId**  <br>*required*|The id of this operation  <br>**Example** : `"00000000-0000-0000-0000-000000000000"`|string|
|**sets**  <br>*required*|An array of sets, in the same order as in the request  <br>**Example** : `[ "object" ]`|< [sets](#nodecreationresult-sets) > array|

<a name="nodecreationresult-sets"></a>
**sets**

|Name|Description|Schema|
|---|---|---|
|**added**  <br>*required*|How many nodes were started in this set  <br>**Example** : `1`|integer|
|**message**  <br>*optional*|Indicates why not all requested nodes could be added, if present  <br>**Example** : `"string"`|string|


<a name="nodelist"></a>
## NodeList
Results of a node search


|Name|Description|Schema|
|---|---|---|
|**nodes**  <br>*required*|The nodes returned  <br>**Example** : `[ "[node](#node)" ]`|< [Node](#node) > array|
|**operation**  <br>*optional*|If the query includes an operation id, this is the status of that operation  <br>**Example** : `"[operationstatus](#operationstatus)"`|[OperationStatus](#operationstatus)|


<a name="nodemanagementrequest"></a>
## NodeManagementRequest
Specifies how to perform actions on nodes in a cluster. There are multiple ways to specify nodes, and if more than one way is included, it is treated as a union.


|Name|Description|Schema|
|---|---|---|
|**filter**  <br>*optional*|A filter expression that matches nodes. Note that strings in the expression must be quoted properly.  <br>**Example** : `"State === \"Started\""`|string|
|**hostnames**  <br>*optional*|A list of short hostnames (with no domain) to manage  <br>**Example** : `[ "hostname1", "hostname2" ]`|< string > array|
|**ids**  <br>*optional*|A list of node ids to manage  <br>**Example** : `[ "id1", "id2" ]`|< string > array|
|**ip_addresses**  <br>*optional*|A list of IP addresses to manage  <br>**Example** : `[ "10.0.1.1", "10.1.1.2" ]`|< string > array|
|**names**  <br>*optional*|A list of node names to manage  <br>**Example** : `[ "name1", "name2" ]`|< string > array|
|**requestId**  <br>*optional*|Optional user-supplied unique token to prevent duplicate operations in case of network communication errors.  If this is included and matches an earlier request id, the server ignores this request and returns a 409 error.  <br>**Example** : `"00000000-0000-0000-0000-000000000000"`|string|


<a name="nodemanagementresult"></a>
## NodeManagementResult

|Name|Description|Schema|
|---|---|---|
|**nodes**  <br>*required*|An array of information about each node that matched the filter in the management request. Each node's status indicates if it was affected by the request.  <br>**Example** : `[ "object" ]`|< [nodes](#nodemanagementresult-nodes) > array|
|**operationId**  <br>*required*|The id of this operation  <br>**Example** : `"00000000-0000-0000-0000-000000000000"`|string|

<a name="nodemanagementresult-nodes"></a>
**nodes**

|Name|Description|Schema|
|---|---|---|
|**error**  <br>*optional*|If the status is Error, this contains the error message  <br>**Example** : `"This node must be terminated before it can be removed"`|string|
|**id**  <br>*required*|The id of the node  <br>**Example** : `"id1"`|string|
|**name**  <br>*required*|The name of the node  <br>**Example** : `"name1"`|string|
|**status**  <br>*optional*|One of OK or Error  <br>**Example** : `"Error"`|enum (OK, Error)|


<a name="operationstatus"></a>
## OperationStatus
The status of this node operation


|Name|Description|Schema|
|---|---|---|
|**action**  <br>*required*|**Example** : `"string"`|enum (create)|
|**startTime**  <br>*required*|When this operation was submitted  <br>**Example** : `"2020-01-01T12:34:56Z"`|string (date-time)|



