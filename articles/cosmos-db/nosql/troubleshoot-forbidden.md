---
title: Troubleshoot Azure Cosmos DB forbidden exceptions
description: Learn how to diagnose and fix forbidden exceptions.
author: ealsur
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: ignite-2022
ms.date: 04/14/2022
ms.author: maquaran
ms.topic: troubleshooting
ms.reviewer: mjbrown
---

# Diagnose and troubleshoot Azure Cosmos DB forbidden exceptions
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

The HTTP status code 403 represents the request is forbidden to complete.

## Firewall blocking requests

Data plane requests can come to Azure Cosmos DB via the following three paths.

- Public internet (IPv4)
- Service endpoint
- Private endpoint

When a data plane request is blocked with 403 Forbidden, the error message will specify via which of the above three paths the request came to Azure Cosmos DB.

- `Request originated from client IP {...} through public internet.`
- `Request originated from client VNET through service endpoint.`
- `Request originated from client VNET through private endpoint.`

### Solution

Understand via which path is the request **expected** to come to Azure Cosmos DB.
   - If the error message shows that the request did not come to Azure Cosmos DB via the expected path, the issue is likely to be with client-side setup. Please double check your client-side setup following documentations.
      - Public internet: [Configure IP firewall in Azure Cosmos DB](../how-to-configure-firewall.md).
      - Service endpoint: [Configure access to Azure Cosmos DB from virtual networks (VNet)](../how-to-configure-vnet-service-endpoint.md). For example, if you expect to use service endpoint but request came to Azure Cosmos DB via public internet, maybe the subnet that the client was running in did not enable service endpoint to Azure Cosmos DB.
      - Private endpoint: [Configure Azure Private Link for an Azure Cosmos DB account](../how-to-configure-private-endpoints.md). For example, if you expect to use private endpoint but request came to Azure Cosmos DB via public internet, maybe the DNS on the VM was not configured to resolve account endpoint to the private IP, so it went through account's public IP instead.
   - If the request came to Azure Cosmos DB via the expected path, request was blocked because the source network identity was not configured to be allowed for the account. Check account's settings depending on the path the request came to Azure Cosmos DB.
      - Public internet: check account's [public network access](../how-to-configure-private-endpoints.md#blocking-public-network-access-during-account-creation) and IP range filter configurations.
      - Service endpoint: check account's [public network access](../how-to-configure-private-endpoints.md#blocking-public-network-access-during-account-creation) and VNET filter configurations.
      - Private endpoint: check account's private endpoint configuration and client's private DNS configuration. This could be due to accessing account from a private endpoint that is set up for a different account.

If you recently updated account's firewall configurations, keep in mind that changes can take **up to 15 minutes to apply**.

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
This scenario happens when [attempting to perform non-data operations](../how-to-setup-rbac.md#permission-model) using Microsoft Entra identities. On this scenario, it's common to see errors like the ones below:

```
Operation 'POST' on resource 'calls' is not allowed through Azure Cosmos DB endpoint
```
```
Forbidden (403); Substatus: 5300; The given request [PUT ...] cannot be authorized by AAD token in data plane.
```

### Solution
Perform the operation through Azure Resource Manager, Azure portal, Azure CLI, or Azure PowerShell.
If you are using the [Azure Functions Azure Cosmos DB Trigger](../../azure-functions/functions-bindings-cosmosdb-v2-trigger.md) make sure the `CreateLeaseContainerIfNotExists` property of the trigger isn't set to `true`. Using Microsoft Entra identities blocks any non-data operation, such as creating the lease container.

## Next steps
* Configure [IP Firewall](../how-to-configure-firewall.md).
* Configure access from [virtual networks](../how-to-configure-vnet-service-endpoint.md).
* Configure access from [private endpoints](../how-to-configure-private-endpoints.md).
