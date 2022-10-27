---
title: Configure multi-region writes in your Azure Cosmos DB for MongoDB database
description: Learn how to configure multi-region writes in Azure Cosmos DB for MongoDB
author: gahl-levy
ms.service: cosmos-db
ms.topic: how-to
ms.date: 10/27/2022
ms.author: gahllevy
---

# Configure multi-region writes in Azure Cosmos DB for MongoDB
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

Multi-region writes in Azure Cosmos DB for MongoDB enable your clients to write to multiple regions. This results in lower latency and better availability for your writes. It's important to note that unlike other MongoDB service, Azure Cosmos DB for MongoDB is the only service which enables you to write data from the same shard to multiple regions. Multi-region writes is a true active-active setup.

### Configure in Azure Portal
A resource is a collection or database to which we are applying access control rules.

### Connect your client
Privileges are actions that can be performed on a specific resource. For example, "read access to collection xyz". Privileges are assigned to a specific role.


## Next steps

- Get an overview of [secure access to data in Azure Cosmos DB](../secure-access-to-data.md).
- Learn more about [RBAC for Azure Cosmos DB management](../role-based-access-control.md).
