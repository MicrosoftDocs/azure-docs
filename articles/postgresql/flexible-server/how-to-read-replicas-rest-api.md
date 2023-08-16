---
title: Manage read replicas - Azure REST API - Azure Database for PostgreSQL - Flexible Server
description: Learn how to manage read replicas in Azure Database for PostgreSQL - Flexible Server from the Azure REST API
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.author: alkuchar
author: AwdotiaRomanowna
ms.date: 12/06/2022
---

# Create and manage read replicas from the Azure REST API

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]
In this article, you learn how to create and manage read replicas in Azure Database for PostgreSQL by using the REST API [Azure REST API](/rest/api/azure/). To learn more about read replicas, see the [overview](concepts-read-replicas.md).

### Prerequisites
An [Azure Database for PostgreSQL server](quickstart-create-server-portal.md) to be the primary server.

### Create a read replica

You can create a read replica by using the [create API](/rest/api/postgresql/flexibleserver/servers/create):

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBForPostgreSql/flexibleServers/{replicaserverName}?api-version=2022-03-08-preview
```

```json
{
  "location": "southeastasia",
  "properties": {
    "createMode": "Replica",
    "SourceServerResourceId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBForPostgreSql/flexibleServers/{sourceserverName}"
  }
}
```

> [!NOTE]
> To learn more about which regions you can create a replica in, visit the [read replica concepts article](concepts-read-replicas.md).

A replica is created by using the same compute and storage settings as the primary. After a replica is created, several settings can be changed independently of the primary server: compute generation, vCores, storage, or authentication method. The pricing tier can also be changed independently, except to the Burstable tier.

> [!IMPORTANT]
> Before a primary server setting is updated to a new value, update the replica setting to an equal or greater value. This action helps the replica keep up with any changes made to the primary.

### List replicas

You can view the list of replicas of a primary server using the replica list API:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBForPostgreSql/flexibleServers/{serverName}/replicas?api-version=2022-03-08-preview
```

### Promote replica

You can stop replication between a primary server and promote a read replica by using the [update API](/rest/api/postgresql/flexibleserver/servers/update).

After you promote a read replica, it can't be undone. The read replica becomes a standalone server that supports both reads and writes. The standalone server can't be made into a replica again.

```http
PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBForPostgreSql/flexibleServers/{replicaserverName}?api-version=2022-03-08-preview
```

```json
{
  "properties": {
    "ReplicationRole":"None"  
   }
}
```

### Delete a primary or replica server

To delete a primary or replica server, use the [delete API](/rest/api/postgresql/flexibleserver/servers/delete). If server has read replicas then read replicas should be deleted first before deleting the primary server.

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBForPostgreSql/flexibleServers/{replicaserverName}?api-version=2022-03-08-preview
```

## Next steps

* Learn more about [read replicas in Azure Database for PostgreSQL](concepts-read-replicas.md).
* Learn how to [create and manage read replicas in the Azure portal](how-to-read-replicas-portal.md).
