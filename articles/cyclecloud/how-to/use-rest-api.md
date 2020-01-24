---
title: Use the  api
description: Some examples of using the API
author: mvrequa
ms.date: 01/23/2020
ms.author: adjohnso
---


# Using the REST API

Cyclecloud provides a REST API for adding automated and programmatic cluster management.
Users sometimes wish to build a custom autoscale tool. A tool which evaluates a workload
queue and starts VMs equal to the workload demand. The REST API is the appropriate endpoint
for such a system. The workload needs may include high-throughput or tightly-coupled 
VM arrangements. 

## Get the cluster status

Prior to starting VMs you can query CycleCloud to gather the available capacity or buckets.
By querying the cluster status you can learn how many VMs are available in each of the
cluster configurations.

```bash
curl --location --request GET '${CC-URL}/clusters/${CLUSTER}/status' \
--header 'Authorization: Basic ****************************'
```

The response will be in the following form. This response contains a complete set 
of node attributes, many are omitted here for simplicity.
```json
{
  "state": "Started",
  "targetState": "Started",
  "maxCount": 10000,
  "maxCoreCount": 1000000,
  "nodearrays": [
    {
      "name": "ondemand",
      "maxCount": 10000,
      "maxCoreCount": 500,
      "buckets": [
        {
        "bucketId": "cd56af52-c041-435a-a4e7-e6a91ca519a2",
        "definition": {
            "machineType": "Standard_Fs32_v2"
          }
          },
        {
        "bucketId": "d81e001a-a29e-4208-9754-79815cb7b225",
        "definition": {
            "machineType": "Standard_Hc44rs"
          }
        }
    ]
}
```

## Create nodes

Using the API provides great flexibility in starting nodes. The only required attributes to
create nodes are *nodearray* and *count*. A call using the minimum required attributes
will inherit all the existing node configurations and be placed in the first bucket which can
satisfy the request.

```bash
curl --location --request POST '${CC-URL}/clusters/${CLUSTER}/nodes/create' \
--header 'Authorization: Basic ****************************' \
--header 'Content-Type: text/plain' \
--data-raw '{ "requestId" : "463270ca-3345-41c7-98d6-431ee3ef8ed5",
    "sets" : [
        {
            "count" : 1,
            "nodearray" : "ondemand"
        }
    ]
}'
```
The response to this call will provide an operation id. 

```json
{
  "operationId": "3b53d621-11e7-49c3-8876-6ec1158897ac",
  "sets": [
    {
      "added": 1
    }
  ]
}
```
The operation status can be tracked using the _/operations_ api. It's also useful to use
the request id as a parameter to filter the get nodes response. This can tell you 
the detail of all the nodes created with the create request.

```bash
curl --location --request GET '${CC-URL}/clusters/${CLUSTER}/nodes?request_id=463270ca-3345-41c7-98d6-431ee3ef8ed5' \
```

## Add tightly-coupled nodes

Should the workload demand tightly-coupled nodes, a simple change in the API request
can be used. Cyclecloud node arrays can be defined with multiple valid machine types, a list.
Suppose that the _ondemand_ nodearray has both _Standard_Fs32_v2_ and _Standard_Hc44rs_
defined. The cluster status API will show at least two _buckets_ for this node array one for 
each VM Size.

Suppose the workload calls for four nodes connected by Azure Infiniband networking. Call the 
*create nodes* api with a *placementGroupId*.

```bash
curl --location --request POST '${CC-URL}/clusters/${CLUSTER}/nodes/create' \
--header 'Authorization: Basic ****************************' \
--header 'Content-Type: text/plain' \
--data-raw '{ "requestId" : "463270ca-3345-41c7-98d6-431ee3ef8ed5",
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
The *placementGroupId* may or may not reference a pre-existing placement group. This is 
a logical group used in CycleCloud and if a specific placement group doesn't exist when
the request is made, then CycleCloud will create a new placement group. You can add additional
VMs to the same placement group in additional *create nodes* requests.

## Deleting nodes

Nodes are created and continue on in their service life, at some point the manager service 
will want to terminate them. There are a number of different identifiers available for
terminating nodes, including a filter option. 

```bash
curl --location --request POST '${CC-URL}/clusters/${CLUSTER}/nodes/terminate' \
--header 'Authorization: Basic ****************************' \
--header 'Content-Type: text/plain' \
--data-raw '{
 "ids" : ["62a1b116-3c4e-4229-b290-b54ea23f1b68"]
}'
```

```json
{
  "operationId": "15aaa844-c5f0-4043-9591-8904c546028d",
  "nodes": [
    {
      "name": "ondemand-3",
      "id": "62a1b116-3c4e-4229-b290-b54ea23f1b68",
      "status": "OK"
    }
  ]
}
```