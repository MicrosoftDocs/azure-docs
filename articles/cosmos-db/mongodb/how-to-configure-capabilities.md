---
title: Configure your API for MongoDB account capabilities
description: Learn how to configure your API for MongoDB account capabilities
author: gahl-levy
ms.service: cosmos-db
ms.topic: how-to
ms.date: 09/06/2022
ms.author: gahllevy
---

# Configure your API for MongoDB account capabilities
[!INCLUDE[appliesto-mongodb-api](../includes/appliesto-mongodb-api.md)]

Capabilities are features that can be added or removed to your API for MongoDB account. Many of these features affect account behavior so it's important to be fully aware of the impact a capability will have before enabling or disabling it. Several capabilities are set on API for MongoDB accounts by default, and cannot be changed or removed. One example is the EnableMongo capability. This article will demonstrate how to enable and disable a capability. 

## Enable a capability
1. Retrieve your existing account capabilities:
```powershell
az cosmosdb show -n <account_name> -g <azure_resource_group>
```
You should see a capability section similar to this:
```powershell
"capabilities": [
    {
      "name": "EnableMongo"
    }
]
```
Copy each of these capabilities. In this example, we have EnableMongo and DisableRateLimitingResponses.

2. Set the new capability on your database account. The list of capabilities should include the list of previously enabled capabilities, since only the explicitly named capabilities will be set on your account. For example, if you want to add the capability "DisableRateLimitingResponses", you would run the following command: 
```powershell
az cosmosdb update -n <account_name> -g <azure_resource_group> --capabilities EnableMongo, DisableRateLimitingResponses
```
If you are using PowerShell and receive an error using the command above, try using a PowerShell array instead to list the capabilities: 
```powershell
az cosmosdb update -n <account_name> -g <azure_resource_group> --capabilities @("EnableMongo","DisableRateLimitingResponses")
```

## Disable a capability
1. Retrieve your existing account capabilities:
```powershell
az cosmosdb show -n <account_name> -g <azure_resource_group>
```
You should see a capability section similar to this:
```powershell
"capabilities": [
    {
      "name": "EnableMongo"
    },
    {
      "name": "DisableRateLimitingResponses"
    }
]
```
Copy each of these capabilities. In this example, we have EnableMongo and DisableRateLimitingResponses.

2. Remove the capability from your database account. The list of capabilities should include the list of previously enabled capabilities you want to keep, since only the explicitly named capabilities will be set on your account. For example, if you want to remove the capability "DisableRateLimitingResponses", you would run the following command: 
```powershell
az cosmosdb update -n <account_name> -g <azure_resource_group> --capabilities EnableMongo
```
If you are using PowerShell and receive an error using the command above, try using a PowerShell array instead to list the capabilities: 
```powershell
az cosmosdb update -n <account_name> -g <azure_resource_group> --capabilities @("EnableMongo")
```

## Next steps

- Learn how to [use Studio 3T](connect-using-mongochef.md) with Azure Cosmos DB API for MongoDB.
- Learn how to [use Robo 3T](connect-using-robomongo.md) with Azure Cosmos DB API for MongoDB.
- Explore MongoDB [samples](nodejs-console-app.md) with Azure Cosmos DB API for MongoDB.
- Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
    - If all you know is the number of vCores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md). 
    - If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-capacity-planner.md).
