---
title: Troubleshoot Azure Cosmos DB forbidden exceptions
description: Learn how to diagnose and fix forbidden exceptions.
author: ealsur
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.date: 02/05/2021
ms.author: maquaran
ms.topic: troubleshooting
ms.reviewer: sngun
---

# Diagnose and troubleshoot Azure Cosmos DB forbidden exceptions
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

The HTTP status code 403 represents the request is forbidden to complete.

## Firewall blocking requests
On this scenario, it's common to see errors like the ones below:

```
Request originated from client IP {...} through public internet. This is blocked by your Cosmos DB account firewall settings.
```

```
Request is blocked. Please check your authorization token and Cosmos DB account firewall settings
```

### Solution
Verify that your current [firewall settings](how-to-configure-firewall.md) are correct and include the IPs or networks you are trying to connect from.
If you recently updated them, keep in mind that changes can take **up to 15 minutes to apply**.

## Non-data operations are not allowed
This scenario happens when non-data [operations are disallowed in the account](how-to-restrict-user-data.md#disallow-the-execution-of-non-data-operations). On this scenario, it's common to see errors like the ones below:

```
Operation 'POST' on resource 'calls' is not allowed through Azure Cosmos DB endpoint
```

### Solution
Perform the operation through Azure Resource Manager, Azure portal, Azure CLI, or Azure PowerShell. Or reallow execution of non-data operations.

## Next steps
* Configure [IP Firewall](how-to-configure-firewall.md).
* Configure access from [virtual networks](how-to-configure-vnet-service-endpoint.md).
* Configure access from [private endpoints](how-to-configure-private-endpoints.md).
