---
title: Using the Azure CycleCloud REST API
description: Examples of how to use the Azure CycleCloud REST API
author: mvrequa
ms.date: 01/23/2020
ms.author: adjohnso
---


# Using the CycleCloud REST API

Cyclecloud provides a [REST API](../api.md) for adding automated and programmatic cluster management. Custom autoscaling and custom scheduler integration requires a tool which evaluates a workload queue and starts Virtual Machines (VM) equal to the workload demand. The CycleCloud REST API is the appropriate endpoint for such a tool and supports workload requirements that may include high-throughput or tightly-coupled VM arrangements. 


## Determine cluster status

You can query CycleCloud to determine cluster status which indicates VM availability in each of the cluster configurations. 

```bash
curl --location --request GET '${CC-URL}/clusters/${CLUSTER}/status' \
--header 'Authorization: Basic ****************************'
```

> [!NOTE]
> The CycleCloud API accepts basic authentication using username and password combination. These _curl_ API examples
are a base64 encoded string 'user:password'.

The response will be in the following form. The response contains a complete set 
of node attributes but many are omitted here for simplicity.

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

The API provides great flexibility in starting nodes. The only required attributes to create nodes are `nodearray` and `count`. A call using the minimum required attributes will inherit all the existing node configurations and be placed in the first bucket which can satisfy the request.

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

The response to this call will provide an operation ID.

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

The operation status can be tracked using the [operations API](../api.md#gets-operation-status-by-id). You can set the `request_id` parameter to filter the GET nodes response. This can provide you with details for all the nodes created with the create request.

```bash
curl --location --request GET '${CC-URL}/clusters/${CLUSTER}/nodes?request_id=463270ca-abcd-1234-98d6-431ee3ef8ed5' \
```

## Add tightly-coupled nodes

CycleCloud nodearrays can be defined with multiple valid machine types in a list. Suppose that the `ondemand` nodearray has both 
`Standard_F32s_v2_`and `Standard_Hc44rs` defined. The cluster status API will show at least two `buckets` for this nodearray one 
for each VM Size. Observe that the `Standard_Hc44rs` bucket indicates that _infiniband_ service is available. Some quantitative
software is written to scale out across nodes and take advantage of low-latency connections between nodes.

Suppose you are running such a workload and a job calls for four nodes connected by Azure Infiniband networking. To ensure that the four nodes end up in the same placement group, and thus on the same Infiniband network, you will use the [create nodes API call](../api.md#create-cluster-nodes) with a `placementGroupId`.

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

The `placementGroupId` may or may not reference a pre-existing placement group. This is a logical group used in CycleCloud and if a specific placement group doesn't exist when the request is made, then CycleCloud will create a new placement group. You can add additional VMs to the same placement group in additional create nodes requests.

## Delete nodes

At some point the manager service will want to [terminate nodes](../api.md#terminate-and-remove-cluster-nodes) that have been created. 

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
