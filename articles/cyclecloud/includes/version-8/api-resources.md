

<a name="clusterstatus"></a>
## ClusterStatus
Status of the cluster.


|Name|Description|Schema|
|---|---|---|
|**maxCoreCount**  <br>*required*|The maximum number of cores that you can add to this cluster.  <br>**Example** : `16`|integer|
|**maxCount**  <br>*required*|The maximum number of nodes that you can add to this cluster.  <br>**Example** : `4`|integer|
|**nodearrays**  <br>*required*|**Example** : `[ "object" ]`|< [nodearrays](#clusterstatus-nodearrays) > array|
|**nodes**  <br>*optional*|An optional list of nodes in this cluster. The response includes this list only if you set `nodes=true` in the query.  <br>**Example** : `[ "[node](#node)" ]`|< [Node](#node) > array|
|**state**  <br>*optional*|The current state of the cluster, if the cluster started at least once  <br>**Example** : `"Starting"`|string|
|**targetState**  <br>*optional*|The desired state of the cluster (for example, Started or Terminated)  <br>**Example** : `"Started"`|string|

<a name="clusterstatus-nodearrays"></a>
**nodearrays**

|Name|Description|Schema|
|---|---|---|
|**buckets**  <br>*required*|Each bucket of allocation for this node array. The "core count" settings are always a multiple of the core count for this bucket.  <br>**Example** : `[ "object" ]`|< [buckets](#clusterstatus-buckets) > array|
|**maxCoreCount**  <br>*required*|The maximum number of cores in this node array  <br>**Example** : `16`|integer|
|**maxCount**  <br>*required*|The maximum number of nodes in this node array  <br>**Example** : `4`|integer|
|**name**  <br>*required*|The node array name  <br>**Example** : `"execute"`|string|
|**nodearray**  <br>*required*|The attributes of this node array  <br>**Example** : `"[node](#node)"`|[Node](#node)|

<a name="clusterstatus-buckets"></a>
**buckets**

|Name|Description|Schema|
|---|---|---|
|**activeCoreCount**  <br>*required*|The number of cores in use for this bucket, in this node array  <br>**Example** : `40`|integer|
|**activeCount**  <br>*required*|The number of nodes in use for this bucket, in this node array. This count includes nodes that are still acquiring a VM.  <br>**Example** : `10`|integer|
|**activeNodes**  <br>*optional*|The node names in use for this bucket, in this node array. This list includes nodes that are still acquiring a VM. The response includes this property only if the query contains `nodes=true`.  <br>**Example** : `[ "string" ]`|< string > array|
|**availableCoreCount**  <br>*required*|How many extra cores you can create in this bucket and node array. This value is always a multiple of `availableCount`.  <br>**Example** : `8`|integer|
|**availableCount**  <br>*required*|How many extra nodes you can create in this bucket and node array. This value might be less than the number you get when you subtract `usedCount` from `maxCount`, because `maxCount` might have a global limit.  <br>**Example** : `2`|integer|
|**bucketId**  <br>*required*|The identifier for this bucket. This value stays the same for a given bucket in a node array as long as you don't delete the cluster.  <br>**Example** : `"00000000-0000-0000-0000-000000000000"`|string|
|**consumedCoreCount**  <br>*required*|The number of cores for this family that are already in use across the entire region.  <br>**Example** : `2`|integer|
|**definition**  <br>*optional*|The properties of this bucket, used to create nodes from this bucket. The create-nodes API takes this definition in its `bucket` property.  <br>**Example** : `"object"`|[definition](#clusterstatus-buckets-definition)|
|**familyConsumedCoreCount**  <br>*optional*|The number of cores for this family that are already in use across the entire region.  <br>**Example** : `2`|integer|
|**familyQuotaCoreCount**  <br>*optional*|The number of total cores that you can start for this family in this region. This number might not be an integer multiple of quotaCount.  <br>**Example** : `16`|integer|
|**familyQuotaCount**  <br>*optional*|The number of total instances that you can start when you set familyQuotaCoreCount.  <br>**Example** : `4`|integer|
|**invalidReason**  <br>*required*|If valid is false, the field contains the reason the bucket is invalid. Currently NotActivated and DisabledMachineType are the only reasons.  <br>**Example** : `"DisabledMachineType"`|string|
|**lastCapacityFailure**  <br>*required*|How long, in seconds, since the last time this bucket experienced a capacity failure. Any negative value is treated as never.  <br>**Example** : `180.0`|number|
|**maxCoreCount**  <br>*required*|The maximum number of cores that can be in this bucket, including global and nodearray limits. Always a multiple of maxCount.  <br>**Example** : `16`|integer|
|**maxCount**  <br>*required*|The maximum number of nodes that can be in this bucket, including global and nodearray limits  <br>**Example** : `4`|integer|
|**maxPlacementGroupCoreSize**  <br>*required*|The maximum total number of cores in a placement group for this bucket. Always a multiple of `maxPlacementGroupSize`.  <br>**Example** : `64`|integer|
|**maxPlacementGroupSize**  <br>*required*|The maximum total number of instances in a placement group for this bucket.  <br>**Example** : `16`|integer|
|**placementGroups**  <br>*required*|The placement groups in use for this node array, if any.  <br>**Example** : `[ "object" ]`|< [placementGroups](#clusterstatus-buckets-placementgroups) > array|
|**quotaCoreCount**  <br>*required*|The number of total cores that you can start for this family in this region. This number also takes into account the regional quota core count. This value might not be an integer multiple of quotaCount.  <br>**Example** : `16`|integer|
|**quotaCount**  <br>*required*|The number of total instances that you can start, given the quotaCoreCount.  <br>**Example** : `4`|integer|
|**regionalConsumedCoreCount**  <br>*optional*|The number of cores that are already in use across the entire region.  <br>**Example** : `2`|integer|
|**regionalQuotaCoreCount**  <br>*optional*|The number of total cores that you can start in this region. This number might not be an integer multiple of regionalQuotaCount.  <br>**Example** : `16`|integer|
|**regionalQuotaCount**  <br>*optional*|The number of total instances that you can start (given regionalQuotaCoreCount)  <br>**Example** : `4`|integer|
|**valid**  <br>*required*|If true, this bucket represents a currently valid bucket to use for new nodes. If false, this bucket represents existing nodes only.  <br>**Example** : `true`|boolean|
|**virtualMachine**  <br>*required*|The properties of the virtual machines that you launch from this bucket  <br>**Example** : `"object"`|[virtualMachine](#clusterstatus-buckets-virtualmachine)|

<a name="clusterstatus-buckets-definition"></a>
**definition**

|Name|Description|Schema|
|---|---|---|
|**machineType**  <br>*required*|The VM size of the virtual machine  <br>**Example** : `"A2"`|string|

<a name="clusterstatus-buckets-placementgroups"></a>
**placementGroups**

|Name|Description|Schema|
|---|---|---|
|**activeCoreCount**  <br>*required*|The number of cores in this scale set  <br>**Example** : `16`|integer|
|**activeCount**  <br>*required*|The number of nodes in this scale set  <br>**Example** : `4`|integer|
|**name**  <br>*required*|The unique identifier of this placement group  <br>**Example** : `"my-placement-group"`|string|

<a name="clusterstatus-buckets-virtualmachine"></a>
**virtualMachine**

|Name|Description|Schema|
|---|---|---|
|**gpuCount**  <br>*required*|The number of GPUs this machine type has  <br>**Example** : `2`|integer|
|**infiniband**  <br>*required*|If this virtual machine supports InfiniBand connectivity  <br>**Example** : `true`|boolean|
|**memory**  <br>*required*|The RAM in this virtual machine, in GB  <br>**Example** : `7.5`|number|
|**pcpuCount**  <br>*required*|The number of physical CPUs this machine type has  <br>**Example** : `16`|integer|
|**vcpuCount**  <br>*required*|The number of virtual CPUs for this machine type  <br>**Example** : `32`|integer|
|**vcpuQuotaCount**  <br>*optional*|The number of vCPUs that this machine uses from quota  <br>**Example** : `2`|integer|


<a name="clusterusage"></a>
## ClusterUsage
Usage and optional cost information for the cluster


|Name|Description|Schema|
|---|---|---|
|**usage**  <br>*required*|A list of usages by time interval  <br>**Example** : `[ "object" ]`|< [usage](#clusterusage-usage) > array|

<a name="clusterusage-usage"></a>
**usage**

|Name|Description|Schema|
|---|---|---|
|**breakdown**  <br>*required*|The breakdown of usage in this interval, by category of "node" and "nodearray"  <br>**Example** : `[ "[clusterusageitem](#clusterusageitem)" ]`|< [ClusterUsageItem](#clusterusageitem) > array|
|**end**  <br>*required*|The end of the interval (exclusive)  <br>**Example** : `"string"`|string|
|**start**  <br>*required*|The beginning of the interval (inclusive)  <br>**Example** : `"string"`|string|
|**total**  <br>*required*|The overall usage for this cluster in this interval, with a category of "cluster"  <br>**Example** : `"[clusterusageitem](#clusterusageitem)"`|[ClusterUsageItem](#clusterusageitem)|


<a name="clusterusageitem"></a>
## ClusterUsageItem

|Name|Description|Schema|
|---|---|---|
|**category**  <br>*required*|"cluster" for the overall usage; "node" for a single non-array head node; "nodearray" for a whole nodearray  <br>**Example** : `"string"`|enum (cluster, node, nodearray)|
|**cost**  <br>*optional*|The amount to charge for this usage, in US dollars and at retail rates. Note: all cost amounts are estimates and don't reflect the actual bill!  <br>**Example** : `0.0`|number|
|**details**  <br>*optional*|Details of the VM size used by a nodearray, including hours, core count, region priority, and operating system.  <br>**Example** : `[ "object" ]`|< [details](#clusterusageitem-details) > array|
|**hours**  <br>*required*|The number of core-hours of usage for this category  <br>**Example** : `0.0`|number|
|**node**  <br>*optional*|The name of the node or node array the usage is for (absent for cluster-level data)  <br>**Example** : `"string"`|string|

<a name="clusterusageitem-details"></a>
**details**

|Name|Description|Schema|
|---|---|---|
|**core_count**  <br>*optional*|The number of cores in this VM size  <br>**Example** : `0.0`|number|
|**cost**  <br>*optional*|Cost of this VM size  <br>**Example** : `0.0`|number|
|**hours**  <br>*optional*|The number of core-hours of usage for this VM size  <br>**Example** : `0.0`|number|
|**os**  <br>*optional*|Type of operating system  <br>**Example** : `"string"`|enum (Windows, Linux)|
|**priority**  <br>*optional*|Priority of the VM Sku  <br>**Example** : `"string"`|enum (Regular, Spot)|
|**region**  <br>*optional*|The region where you instantiate the VM size  <br>**Example** : `"string"`|string|
|**vm_size**  <br>*optional*|VM Sku size  <br>**Example** : `"string"`|string|


<a name="node"></a>
## Node
A node record.

*Type* : object
## NodeCreationRequest
Specifies how to add nodes to a cluster.

|Name|Description|Schema|
|---|---|---|
|**requestId**  <br>*optional*|Optional user-supplied unique token to prevent duplicate operations in case of network communication errors. If the server receives a request with a `requestId` that matches an earlier request, it ignores the request and returns a 409 error.  <br>**Example** : `"00000000-0000-0000-0000-000000000000"`|string|
|**sets**  <br>*required*|A list of node definitions to create. The request must contain at least one set. Each set can specify a different set of properties.  <br>**Example** : `[ "object" ]`|< [sets](#nodecreationrequest-sets) > array|

<a name="nodecreationrequest-sets"></a>
**sets**

|Name|Description|Schema|
|---|---|---|
|**count**  <br>*required*|The number of nodes to create  <br>**Example** : `1`|integer|
|**definition**  <br>*optional*|The definition of the bucket to use. The cluster status API call provides this definition. If the definition is missing some items given in the status call or the entire bucket property, the first bucket that matches the given items is used.  <br>**Example** : `"object"`|[definition](#nodecreationrequest-definition)|
|**nameFormat**  <br>*optional*|If you provide this value, nodes use this naming convention instead of the standard `nodearray-%d` format  <br>**Example** : `"custom-name-%d"`|string|
|**nameOffset**  <br>*optional*|If you provide this property with `nameFormat`, the property offsets `nodeindex` for new nodes.  <br>**Example** : `1`|integer|
|**nodeAttributes**  <br>*optional*|Extra attributes to set on each node in this set  <br>**Example** : `"[node](#node)"`|[Node](#node)|
|**nodearray**  <br>*required*|The name of the `nodearray` to start nodes from  <br>**Example** : `"execute"`|string|
|**placementGroupId**  <br>*optional*|If you provide this property, nodes with the same value for `groupId` all start in the same placement group.  <br>**Example** : `"string"`|string|

<a name="nodecreationrequest-definition"></a>
**definition**

|Name|Description|Schema|
|---|---|---|
|**machineType**  <br>*optional*|**Example** : `"A2"`|string|


<a name="nodecreationresult"></a>
## NodeCreationResult

|Name|Description|Schema|
|---|---|---|
|**operationId**  <br>*required*|The ID of the operation  <br>**Example** : `"00000000-0000-0000-0000-000000000000"`|string|
|**sets**  <br>*required*|An array of sets, in the same order as in the request  <br>**Example** : `[ "object" ]`|< [sets](#nodecreationresult-sets) > array|

<a name="nodecreationresult-sets"></a>
**sets**

|Name|Description|Schema|
|---|---|---|
|**added**  <br>*required*|The number of nodes to add in the set  <br>**Example** : `1`|integer|
|**message**  <br>*optional*|Explains why the system can't add all requested nodes, if present  <br>**Example** : `"string"`|string|


<a name="nodelist"></a>
## NodeList
Results of a node search


|Name|Description|Schema|
|---|---|---|
|**nodes**  <br>*required*|The nodes the system returns  <br>**Example** : `[ "[node](#node)" ]`|< [Node](#node) > array|
|**operation**  <br>*optional*|If the query includes an operation ID, this field shows the status of that operation  <br>**Example** : `"[operationstatus](#operationstatus)"`|[OperationStatus](#operationstatus)|


<a name="nodemanagementrequest"></a>
## NodeManagementRequest
Specifies how to perform actions on nodes in a cluster. You can specify nodes in multiple ways. If you include more than one way, the request treats the specification as a union.


|Name|Description|Schema|
|---|---|---|
|**filter**  <br>*optional*|A filter expression that matches nodes. Note that strings in the expression must be quoted properly.  <br>**Example** : `"State === \"Started\""`|string|
|**hostnames**  <br>*optional*|A list of short hostnames (with no domain) to manage  <br>**Example** : `[ "hostname1", "hostname2" ]`|< string > array|
|**ids**  <br>*optional*|A list of node IDs to manage  <br>**Example** : `[ "id1", "id2" ]`|< string > array|
|**ip_addresses**  <br>*optional*|A list of IP addresses to manage  <br>**Example** : `[ "10.0.1.1", "10.1.1.2" ]`|< string > array|
|**names**  <br>*optional*|A list of node names to manage  <br>**Example** : `[ "name1", "name2" ]`|< string > array|
|**requestId**  <br>*optional*|Optional user-supplied unique token to prevent duplicate operations in case of network communication errors.  If the server receives a request with a `requestId` that matches an earlier request ID, it ignores the request and returns a 409 error.  <br>**Example** : `"00000000-0000-0000-0000-000000000000"`|string|


<a name="nodemanagementresult"></a>
## NodeManagementResult

|Name|Description|Schema|
|---|---|---|
|**nodes**  <br>*required*|An array of information about each node that matches the filter in the management request. Each node's status indicates if the request affects it.  <br>**Example** : `[ "object" ]`|< [nodes](#nodemanagementresult-nodes) > array|
|**operationId**  <br>*required*|The ID of this operation  <br>**Example** : `"00000000-0000-0000-0000-000000000000"`|string|

<a name="nodemanagementresult-nodes"></a>
**nodes**

|Name|Description|Schema|
|---|---|---|
|**error**  <br>*optional*|If the status is Error, the error message  <br>**Example** : `"This node must be terminated before it can be removed"`|string|
|**id**  <br>*required*|The ID of the node  <br>**Example** : `"id1"`|string|
|**name**  <br>*required*|The name of the node  <br>**Example** : `"name1"`|string|
|**status**  <br>*optional*|One of OK or Error  <br>**Example** : `"Error"`|enum (OK, Error)|


<a name="operationstatus"></a>
## OperationStatus
The status of the node operation.


|Name|Description|Schema|
|---|---|---|
|**action**  <br>*required*|**Example** : `"string"`|enum (create)|
|**startTime**  <br>*required*|When you submitted the operation  <br>**Example** : `"2020-01-01T12:34:56Z"`|string (date-time)|



