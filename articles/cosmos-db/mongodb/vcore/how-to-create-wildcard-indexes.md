---
title:  Wildcard indexes in Azure Cosmos DB for MongoDB vCore
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Sample to create wildcard indexes in Azure Cosmos DB for MongoDB vCore.
author: abinav2307
ms.author: abramees
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 6/25/2024
---


# Create wildcard indexes in Azure Cosmos DB for MongoDB vCore

[!INCLUDE[MongoDB vCore](~/reusable-content/ce-skilling/azure/includes/cosmos-db/includes/appliesto-mongodb-vcore.md)]

While most workloads have a predictable set of fields used in query filters and predicates, adhoc query patterns may use filters on any field in the json document structure. 

Wildcard indexing can be helpful in the following scenarios:
- Queries filtering on any field in the document making indexing all fields through a single command easier than indexing each field individually.
- Queries filtering on most fields in the document making indexing all but a few fields through a single easier than indexing most fields individually.

This sample describes a simple workaround to minimize the effort needed to create individual indexes until wildcard indexing is generally available in Azure Cosmos DB for MongoDB vCore.

## Solution
Consider the json document below:
```json
{
    "firstName": "Steve",
    "lastName": "Smith",
    "companyName": "Microsoft",
    "division": "Azure",
    "subDivision": "Data & AI",
    "timeInOrgInYears": 7,
    "roles": [
        {
            "teamName" : "Windows",
            "teamSubName" "Operating Systems",
            "timeInTeamInYears": 3
        },
        {
            "teamName" : "Devices",
            "teamSubName" "Surface",
            "timeInTeamInYears": 2
        },
        {
            "teamName" : "Devices",
            "teamSubName" "Surface",
            "timeInTeamInYears": 2
        }
    ]
}
```

The following indices are created under the covers when wildcard indexing is used.
- db.collection.createIndex({"firstName", 1})
- db.collection.createIndex({"lastName", 1})
- db.collection.createIndex({"companyName", 1})
- db.collection.createIndex({"division", 1})
- db.collection.createIndex({"subDivision", 1})
- db.collection.createIndex({"timeInOrgInYears", 1})
- db.collection.createIndex({"subDivision", 1})
- db.collection.createIndex({"roles.teamName", 1})
- db.collection.createIndex({"roles.teamSubName", 1})
- db.collection.createIndex({"roles.timeInTeamInYears", 1})

While this sample document only requires a combination of 10 fields to be explicitly indexed, larger documents with hundreds or thousands of fields can get tedious and error prone when indexing fields individually.

The jar file detailed in the rest of this document makes indexing fields in larger documents simpler. The jar takes a sample JSON document as input, parses the document and executes createIndex commands for each field without the need for user intervention.

## Prerequisites

### Java 21
After the virtual machine is deployed, use SSH to connect to the machine, and install CQLSH using the below commands:

```bash
# Install default-jdk
sudo apt update
sudo apt install openjdk-21-jdk
```

## Sample jar to create individual indexes for all fields

Clone the repository containing the Java sample to iterate through each field in the JSON document's structure and issue createIndex operations for each field in the document.

```bash
git clone https://github.com/Azure-Samples/cosmosdb-mongodb-vcore-wildcard-indexing.git
```

The cloned repository does not need to be built if there are no changes to be made to the solution. The built runnable jar named azure-cosmosdb-mongo-data-indexer-1.0-SNAPSHOT.jar is already included in the runnableJar/ folder. The jar can be executed by specifying the following required parameters:
- Azure Cosmos DB for MongoDB vCore cluster connection string with the username and password used when the cluster was provisioned
- The Azure Cosmos DB for MongoDB vCore database
- The collection to be indexed
- The location of the json file with the document structure for the collection. This document is parsed by the jar file to extract every field and issue individual createIndex operations.

```bash
java -jar azure-cosmosdb-mongo-data-indexer-1.0-SNAPSHOT.jar mongodb+srv://<user>:<password>@abinav-test-benchmarking.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000 cosmicworks employee sampleEmployee.json
```

## Track the status of a createIndex operation
The jar file is designed to not wait on a response from each createIndex operation. The indexes are created asynchronously on the server and the progress of the index build operation on the cluster can be tracked.

Consider this sample to track indexing progress on the 'cosmicworks' database.
```javascript
use cosmicworks;
db.currentOp()
```

When a createIndex operation is in progress, the response looks like:
```json
{
  "inprog": [
    {
      "shard": "defaultShard",
      "active": true,
      "type": "op",
      "opid": "30000451493:1719209762286363",
      "op_prefix": 30000451493,
      "currentOpTime": "2024-06-24T06:16:02.000Z",
      "secs_running": 0,
      "command": { "aggregate": "" },
      "op": "command",
      "waitingForLock": false
    },
    {
      "shard": "defaultShard",
      "active": true,
      "type": "op",
      "opid": "30000451876:1719209638351743",
      "op_prefix": 30000451876,
      "currentOpTime": "2024-06-24T06:13:58.000Z",
      "secs_running": 124,
      "command": { "createIndexes": "" },
      "op": "workerCommand",
      "waitingForLock": false,
      "progress": {},
      "msg": ""
    }
  ],
  "ok": 1
}
```

## Related content

Check out the full sample here - https://github.com/Azure-Samples/cosmosdb-mongodb-vcore-wildcard-indexing

Check out [indexing best practices](how-to-create-indexes.md), which details best practices for indexing on Azure Cosmos DB for MongoDB vCore.
