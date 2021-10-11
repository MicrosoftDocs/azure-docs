---
title: Troubleshoot Azure Cosmos DB forbidden exceptions
description: Learn how to diagnose and fix forbidden exceptions.
author: ealsur
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.date: 10/06/2021
ms.author: maquaran
ms.topic: troubleshooting
ms.reviewer: sngun
---

# Diagnose and troubleshoot Azure Cosmos DB forbidden exceptions
[!INCLUDE[appliesto-sql-api](../includes/appliesto-sql-api.md)]

The HTTP status code 403 represents the request is forbidden to complete.

## Firewall blocking requests

Data plane requests can come to Cosmos DB via the following 3 paths.

1. Public internet (IPv4)
1. Service endpoint
1. Private endpoint

When a data plane request is blocked with 403 Forbidden, the error message will specify via which of the above 3 paths the request came to Cosmos DB.

1. `Request originated from client IP {...} through public internet.`
2. `Request originated from client VNET through service endpoint.`
3. `Request originated from client VNET through private endpoint.`

### Solution

1. Understand via which path is the request **expected** to come to Cosmos DB.
1. If the error message shows that the request did not come to CosmosDB via the expected path, the issue is likely to be with client-side setup. Please double check your client-side setup following documentations. For example, if you expect to use service endpoint, maybe the subnet that the client is running in did not enable service endpoint to Cosmos DB.
   1. Public internet: [Configure IP firewall in Azure Cosmos DB](../how-to-configure-firewall.md)
   1. Service endpoint: [Configure access to Azure Cosmos DB from virtual networks (VNet)](../how-to-configure-vnet-service-endpoint.md)
   1. Private endpoint: [Configure Azure Private Link for an Azure Cosmos account](../how-to-configure-private-endpoints.md)
1. If the request came to CosmosDB via the expected path, request is blocked because the source network identity is not configured to be allowed for the account. Check account’s settings depending on the path the request came to CosmosDB.
   1. Public internet: check account’s [publicNetworkAccess](../how-to-configure-private-endpoints.md#blocking-public-network-access-during-account-creation) configuration. Then check `Firewall and virtual networks -> Firewall`
   1. Service endpoint: check `Firewall and virtual networks -> Virtual networks`
   1. Private endpoint: check `Private Endpoint Connections`. This could be due to accessing account from a private endpoint that is set up for a different account.

If you recently updated account’s firewall configurations, keep in mind that changes can take **up to 15 minutes to apply**.

## Partition key exceeding storage
On this scenario, it's common to see errors like the ones below:

```
Response status code does not indicate success: Forbidden (403); Substatus: 1014
```

```
Partition key reached maximum size of {...} GB
```

### Solution
This error means that your current [partitioning design](../partitioning-overview.md#logical-partitions) and workload is trying to store more than the allowed amount of data for a given partition key value. There is no limit to the number of logical partitions in your container but the size of data each logical partition can store is limited. You can reach to support for clarification.

## Non-data operations are not allowed
This scenario happens when non-data [operations are disallowed in the account](../how-to-restrict-user-data.md#disallow-the-execution-of-non-data-operations). On this scenario, it's common to see errors like the ones below:

```
Operation 'POST' on resource 'calls' is not allowed through Azure Cosmos DB endpoint
```

### Solution
Perform the operation through Azure Resource Manager, Azure portal, Azure CLI, or Azure PowerShell. Or reallow execution of non-data operations.

## Next steps
* Configure [IP Firewall](../how-to-configure-firewall.md).
* Configure access from [virtual networks](../how-to-configure-vnet-service-endpoint.md).
* Configure access from [private endpoints](../how-to-configure-private-endpoints.md).
