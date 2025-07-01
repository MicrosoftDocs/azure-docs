---
title: Using the Azure CycleCloud REST API
description: Examples of how to use the Azure CycleCloud REST API
author: mvrequa
ms.date: 07/01/2025
ms.author: adjohnso
---


# Using the CycleCloud REST API

CycleCloud provides a [REST API](../api.md) for adding automated and programmatic cluster management. Custom autoscaling and custom scheduler integration require a tool that evaluates a workload queue and starts virtual machines (VMs) to match the workload demand. The CycleCloud REST API is the appropriate endpoint for such a tool and supports workload requirements that might include high-throughput or tightly coupled VM arrangements.


## Determine cluster status

You can query CycleCloud to determine cluster status. The status shows VM availability in each of the cluster configurations. 

```bash
curl --location --request GET '${CC-URL}/clusters/${CLUSTER}/status' \
--header 'Authorization: Basic ****************************'
```

> [!NOTE]
> The CycleCloud API accepts basic authentication with a username and password. These _curl_ API examples use a base64 encoded string for 'user:password'.

The response looks like the following example. The response contains a complete set of node attributes, but many are omitted here for simplicity.

```json
{
  "state": "Started",
  "targetState": "Started",
  "maxCount": 100,
  "maxCoreCount": 10000,
  "nodearrays": [
    {
      "name": "ondemand",
      "maxCount": 100,
      "maxCoreCount": 500,
      "buckets": [
        {
        "bucketId": "cd56af52-abcd-1234-a4e7-e6a91ca519a2",
        "definition": {
            "machineType": "Standard_Fs32_v2"
          },
          "maxCount": 3,
          "maxCoreCount": 96,
          "activeCount": 0,
          "activeCoreCount": 0,
          "availableCount": 3,
          "availableCoreCount": 96,
          "quotaCount": 3,
          "quotaCoreCount": 100,
          "consumedCoreCount": 0,
          "maxPlacementGroupSize": 40,
          "maxPlacementGroupCoreSize": 1280,
          "valid": true,
          "placementGroups": [],
          "virtualMachine": {
            "vcpuCount": 32,
            "memory": 64.0,
            "infiniband": false
          }
          },
        {
        "bucketId": "d81e001a-abcd-1234-9754-79815cb7b225",
        "definition": {
            "machineType": "Standard_Hc44rs"
          },
          "maxCount": 11,
          "maxCoreCount": 484,
          "activeCount": 0,
          "activeCoreCount": 0,
          "availableCount": 11,
          "availableCoreCount": 484,
          "quotaCount": 200,
          "quotaCoreCount": 8800,
          "consumedCoreCount": 44,
          "maxPlacementGroupSize": 40,
          "maxPlacementGroupCoreSize": 1760,
          "valid": true,
          "placementGroups": [],
          "virtualMachine": {
            "vcpuCount": 44,
            "memory": 327.83,
            "infiniband": true
          }
        }
    ]
}
```

## Create nodes

The API gives you great flexibility when you start nodes. The only required attributes to create nodes are `nodearray` and `count`. A call that uses these minimum required attributes inherits all the existing node configurations. The nodes go in the first bucket that can satisfy the request.

```bash
curl --location --request POST '${CC-URL}/clusters/${CLUSTER}/nodes/create' \
--header 'Authorization: Basic ****************************' \
--header 'Content-Type: text/plain' \
--data-raw '{ "requestId" : "463270ca-abcd-1234-98d6-431ee3ef8ed5",
    "sets" : [
        {
            "count" : 1,
            "nodearray" : "ondemand"
        }
    ]
}'
```

The response to this call provides an operation ID.

```json
{
  "operationId": "3b53d621-abcd-1234-8876-6ec1158897ac",
  "sets": [
    {
      "added": 1
    }
  ]
}
```

You can track the operation status with the [operations API](../api.md#gets-operation-status-by-id). Set the `request_id` parameter to filter the GET nodes response. This filter gives you details for all the nodes created with the create request.

```bash
curl --location --request GET '${CC-URL}/clusters/${CLUSTER}/nodes?request_id=463270ca-abcd-1234-98d6-431ee3ef8ed5' \
```

## Add tightly-coupled nodes

You can define CycleCloud node arrays with multiple valid machine types in a list. Suppose that the `ondemand` node array has both 
`Standard_F32s_v2_`and `Standard_Hc44rs` defined. The cluster status API shows at least two `buckets` for this node array, one 
for each VM size. The `Standard_Hc44rs` bucket indicates that _infiniband_ service is available. Some quantitative
software scales out across nodes and takes advantage of low-latency connections between nodes.

Suppose you're running such a workload and a job calls for four nodes connected by Azure Infiniband networking. To ensure that the four nodes end up in the same placement group, and thus on the same Infiniband network, use the [create nodes API call](../api.md#create-cluster-nodes) with a `placementGroupId`.

```bash
curl --location --request POST '${CC-URL}/clusters/${CLUSTER}/nodes/create' \
--header 'Authorization: Basic ****************************' \
--header 'Content-Type: text/plain' \
--data-raw '{ "requestId" : "463270ca-abcd-1234-98d6-431ee3ef8ed5",
    "sets" : [
        {
            "count" : 4,
            "nodearray" : "ondemand",
            "placementGroupId" : "pg0",
            "definition" : { "machineType" : "Standard_Hc44rs" }
        }
    ]
}'
```

The `placementGroupId` might reference a preexisting placement group or it might not. CycleCloud uses this ID for a logical group. If the request specifies a placement group that doesn't exist, CycleCloud creates a new placement group. You can add more VMs to the same placement group in extra create nodes requests.

## Delete nodes

At some point, the manager service needs to [terminate nodes](../api.md#terminate-and-remove-cluster-nodes) that it created.

```bash
curl --location --request POST '${CC-URL}/clusters/${CLUSTER}/nodes/terminate' \
--header 'Authorization: Basic ****************************' \
--header 'Content-Type: text/plain' \
--data-raw '{
 "ids" : ["62a1b116-abcd-1234-b290-b54ea23f1b68"]
}'
```

```json
{
  "operationId": "15aaa844-abcd-1234-9591-8904c546028d",
  "nodes": [
    {
      "name": "ondemand-3",
      "id": "62a1b116-abcd-1234-b290-b54ea23f1b68",
      "status": "OK"
    }
  ]
}
```
