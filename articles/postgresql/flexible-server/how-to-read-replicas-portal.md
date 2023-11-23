---
title: Manage read replicas - Azure portal - Azure Database for PostgreSQL - Flexible Server
description: Learn how to manage read replicas Azure Database for PostgreSQL - Flexible Server from the Azure portal.
author: AwdotiaRomanowna
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 11/06/2023
ms.service: postgresql
ms.subservice: flexible-server
ms.custom:
  - ignite-2023
ms.topic: how-to
---

# Create and manage read replicas in Azure Database for PostgreSQL - Flexible Server from the Azure portal

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

In this article, you learn how to create and manage read replicas in Azure Database for PostgreSQL from the Azure portal. To learn more about read replicas, see the [overview](concepts-read-replicas.md).


> [!NOTE]  
> Azure Database for PostgreSQL - Flexible Server is currently supporting the following features in Preview:
>
> - Promote to primary server (to maintain backward compatibility, please use promote to independent server and remove from replication, which keeps the former behavior)
> - Virtual endpoints
> 
> For these features, remember to use the API version `2023-06-01-preview` in your requests. This version is necessary to access the latest, albeit preview, functionalities of these features. 

## Prerequisites

An [Azure Database for PostgreSQL server](./quickstart-create-server-portal.md) to be the primary server.

> [!NOTE]  
> When deploying read replicas for persistent heavy write-intensive primary workloads, the replication lag could continue to grow and might never catch up with the primary. This might also increase storage usage at the primary as the WAL files are only deleted once received at the replica.

## Review primary settings

Before setting up a read replica for Azure Database for PostgreSQL, ensure the primary server is configured to meet the necessary prerequisites. Specific settings on the primary server can affect the ability to create replicas.

**Storage auto-grow**: The storage autogrow setting must be consistent between the primary server and it's read replicas. If the primary server has this feature enabled, the read replicas must also have it enabled to prevent inconsistencies in storage behavior that could interrupt replication. If it's disabled on the primary server, it should also be turned off on the replicas.

**Premium SSD v2**: The current release doesn't support the creation of read replicas for primary servers using Premium SSD v2 storage. If your workload requires read replicas, choose a different storage option for the primary server.

**Private link**: Review the networking configuration of the primary server. For the read replica creation to be allowed, the primary server must be configured with either public access using allowed IP addresses or combined public and private access using virtual network integration.

1.  In the [Azure portal](https://portal.azure.com/), choose the Azure Database for PostgreSQL - Flexible Server you want for the replica.

2.  On the **Overview** dialog, note the PostgreSQL version (ex `15.4`). Also, note the region your primary is deployed to (ex., `East US`).

    :::image type="content" source="./media/how-to-read-replicas-portal/primary-settings.png" alt-text="Screenshot of review primary settings." lightbox="./media/how-to-read-replicas-portal/primary-settings.png":::

3.  On the server sidebar, under **Settings**, select **Compute + storage**.

4.  Review and note the following settings:

      - Compute Tier, Processor, Size (ex `Standard_D4ads_v5`).
    
      - Storage
        - Storage size (ex `128GB`)
        - Autogrowth
    
      - High Availability
        - Enabled / Disabled
        - Availability zone settings
    
      - Backup settings
        - Retention period
        - Redundancy Options

5.  Under **Settings**, select **Networking.**

6. Review the network settings.

      :::image type="content" source="./media/how-to-read-replicas-portal/primary-compute.png" alt-text="Screenshot of server settings." lightbox="./media/how-to-read-replicas-portal/primary-compute.png":::

## Create a read replica

To create a read replica, follow these steps:

#### [Portal](#tab/portal)

1.  Select an existing Azure Database for the PostgreSQL server to use as the primary server.

2.  On the server sidebar, under **Settings**, select **Replication**.

3.  Select **Create replica**.

    :::image type="content" source="./media/how-to-read-replicas-portal/add-replica.png" alt-text="Screenshot of create a replica action." lightbox="./media/how-to-read-replicas-portal/add-replica.png":::

4.  Enter the Basics form with the following information.

    :::image type="content" source="./media/how-to-read-replicas-portal/basics.png" alt-text="Screenshot showing entering the basics information." lightbox="./media/how-to-read-replicas-portal/basics.png":::

5.  Select **Review + create** to confirm the creation of the replica or **Next: Networking** if you want to add, delete or modify any firewall rules.

    :::image type="content" source="./media/how-to-read-replicas-portal/networking.png" alt-text="Screenshot of modify firewall rules action." lightbox="./media/how-to-read-replicas-portal/networking.png":::

6.  Leave the remaining defaults and then select the **Review + create** button at the bottom of the page or proceed to the next forms to add tags or change data encryption method.

7.  Review the information in the final confirmation window. When you're ready, select **Create**. A new deployment will be created and executed.

    :::image type="content" source="./media/how-to-read-replicas-portal/replica-review.png" alt-text="Screenshot of reviewing the information in the final confirmation window.":::

8.  During the deployment, you see the primary in `Updating` state.
    
    :::image type="content" source="./media/how-to-read-replicas-portal/primary-updating.png" alt-text="Screenshot of primary entering into updating status." lightbox="./media/how-to-read-replicas-portal/primary-updating.png":::
    After the read replica is created, it can be viewed from the **Replication** window.

    :::image type="content" source="./media/how-to-read-replicas-portal/list-replica.png" alt-text="Screenshot of viewing the new replica in the replication window." lightbox="./media/how-to-read-replicas-portal/list-replica.png":::

#### [REST API](#tab/restapi)

Initiate an `HTTP PUT` request by using the [create API](/rest/api/postgresql/flexibleserver/servers/create):

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBForPostgreSql/flexibleServers/{replicaserverName}?api-version=2022-12-01
```

Here, you need to replace `{subscriptionId}`, `{resourceGroupName}`, and `{replicaserverName}` with your specific Azure subscription ID, the name of your resource group, and the desired name for your read replica, respectively.

```json
{
  "location": "eastus",
  "properties": {
    "createMode": "Replica",
    "SourceServerResourceId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBForPostgreSql/flexibleServers/{sourceserverName}"
  }
}
```

---

- Set the replica server name.

   > [!TIP]  
   > It is a Cloud Adoption Framework (CAF) best practice to [use a resource naming convention](/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming) that will allow you to easily determine what instance you are connecting to or managing and where it resides.

- Select a location different from your primary but note that you can select the same region.

   > [!TIP]  
   > To learn more about which regions you can create a replica in, visit the [read replica concepts article](concepts-read-replicas.md).

- Set the compute and storage to what you recorded from your primary. If the displayed compute doesn't match, select **Configure server** and select the appropriate one.

   > [!NOTE]  
   > If you select a compute size smaller than the primary, the deployment will fail. Also be aware that the compute size might not be available in a different region.

    :::image type="content" source="./media/how-to-read-replicas-portal/replica-compute.png" alt-text="Screenshot of chose the compute size.":::



> [!IMPORTANT]  
> Review the [considerations section of the Read Replica overview](concepts-read-replicas.md#considerations).
>  
> To avoid issues during promotion of replicas constantly change the following server parameters on the replicas first, before applying them on the primary: `max_connections`, `max_prepared_transactions`, `max_locks_per_transaction`, `max_wal_senders`, `max_worker_processes`.

## Create virtual endpoint (preview)

#### [Portal](#tab/portal)
1. In the Azure portal, select the primary server.

2. On the server sidebar, under **Settings**, select **Replication**.

3. Select **Create endpoint**.

4. In the dialog, type a meaningful name for your endpoint. Notice the DNS endpoint that is being generated.

    :::image type="content" source="./media/how-to-read-replicas-portal/add-virtual-endpoint.png" alt-text="Screenshot of creating a new virtual endpoint with custom name.":::

5. Select **Create**.

    > [!NOTE]  
    > If you do not create a virtual endpoint you will receive an error on the promote replica attempt.

    :::image type="content" source="./media/how-to-read-replicas-portal/replica-promote-attempt.png" alt-text="Screenshot of promotion error when missing virtual endpoint.":::

#### [REST API](#tab/restapi)

To create a virtual endpoint in a preview environment using Azure's REST API, you would use an `HTTP PUT` request. The request would look like this:

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBForPostgreSql/flexibleServers/{sourceserverName}/virtualendpoints/{virtualendpointName}?api-version=2023-06-01-preview
```

The accompanying JSON body for this request is as follows:

```json
{ 
  "Properties": { 
    "EndpointType": "ReadWrite", 
    "Members": ["{replicaserverName}"] 
  }
} 
```

Here, `{replicaserverName}` should be replaced with the name of the replica server you're including as a reader endpoint target in this virtual endpoint.

---


## List virtual endpoint (preview)
#### [REST API](#tab/restapi)

```http request
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBForPostgreSql/flexibleServers/{sourceserverName}/virtualendpoints?api-version=2023-06-01-preview
```

---



### Modify application(s) to point to virtual endpoint

Modify any applications that are using your Azure Database for PostgreSQL to use the new virtual endpoints (ex: `corp-pg-001.writer.postgres.database.azure.com` and `corp-pg-001.reader.postgres.database.azure.com`).

## Promote replicas

With all the necessary components in place, you're ready to perform a promote replica to primary operation.

#### [Portal](#tab/portal)
To promote replica from the Azure portal, follow these steps:

1.  In the [Azure portal](https://portal.azure.com/), select your primary Azure Database for PostgreSQL - Flexible server.

2.  On the server menu, under **Settings**, select **Replication**.

3.  Under **Servers**, select the **Promote** icon for the replica.

    :::image type="content" source="./media/how-to-read-replicas-portal/replica-promote.png" alt-text="Screenshot of selecting to promote for a replica.":::

4.  In the dialog, ensure the action is **Promote to primary server**.

5.  For **Data sync**, ensure **Planned - sync data before promoting** is selected.

    :::image type="content" source="./media/how-to-read-replicas-portal/replica-promote.png" alt-text="Screenshot of how to select promote for a replica.":::

6.  Select **Promote** to begin the process. Once it's completed, the roles reverse: the replica becomes the primary, and the primary will assume the role of the replica.

#### [REST API](#tab/restapi)

When promoting a replica to a primary server, use an `HTTP PATCH` request with a specific `JSON` body to set the promotion options. This process is crucial when you need to elevate a replica server to act as the primary server.

The `HTTP` request is structured as follows:

```http
PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBForPostgreSql/flexibleServers/{replicaserverName}?api-version=2023-06-01-preview
```

```json
{
  "Properties": {
    "Replica": {
      "PromoteMode": "switchover",
      "PromoteOption": "planned"
    }
  }
}
```

In this `JSON`, the promotion is set to occur in `switchover` mode with a `planned` promotion option. While there are two options for promotion - `planned` or `forced` - chose `planned` for this exercise.

---

   > [!NOTE]  
   > The replica you are promoting must have the reader virtual endpoint assigned, or you will receive an error on promotion.
   

### Test applications

Restart your applications and attempt to perform some operations. Your applications should function seamlessly without modifying the virtual endpoint connection string or DNS entries. Leave your applications running this time.

### Failback to the original server and region

Repeat the same operations to promote the original server to the primary.

#### [Portal](#tab/portal)

1.  In the [Azure portal](https://portal.azure.com/), select the replica.

2.  On the server sidebar, under **Settings**, select **Replication**

3.  Under **Servers**, select the **Promote** icon for the replica.

4.  In the dialog, ensure the action is **Promote to primary server**.

5.  For **Data sync**, ensure **Planned - sync data before promoting** is selected.

6.  Select **Promote**, the process begins. Once it's completed, the roles reverse: the replica becomes the primary, and the primary will assume the role of the replica.

#### [REST API](#tab/restapi)

This time, change the `{replicaserverName}` in the API request to refer to your old primary server, which is currently acting as a replica, and execute the request again.

```http
PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBForPostgreSql/flexibleServers/{replicaserverName}?api-version=2023-06-01-preview
```

```json
{
  "Properties": {
    "Replica": {
      "PromoteMode": "switchover",
      "PromoteOption": "planned"
    }
  }
}
```

In this `JSON`, the promotion is set to occur in `switchover` mode with a `planned` promotion option. While there are two options for promotion - `planned` or `forced` - chose `planned` for this exercise.

---

### Test applications

Again, switch to one of the consuming applications. Wait for the primary and replica status to change to `Updating` and then attempt to perform some operations. During the replica promote, your application might encounter temporary connectivity issues to the endpoint:

:::image type="content" source="./media/how-to-read-replicas-portal/failover-connectivity-psql.png" alt-text="Screenshot of potential promote connectivity errors." lightbox="./media/how-to-read-replicas-portal/failover-connectivity-psql.png":::


## Add secondary read replica

Create a secondary read replica in a separate region to modify the reader virtual endpoint and to allow for creating an independent server from the first replica.

#### [Portal](#tab/portal)

1.  In the [Azure portal](https://portal.azure.com/), choose the primary Azure Database for PostgreSQL - Flexible Server.

2.  On the server sidebar, under **Settings**, select **Replication**.

3.  Select **Create replica**.

4.  Enter the Basics form with information in a third region (ex `westus` and `corp-pg-westus-001`)

5.  Select **Review + create** to confirm the creation of the replica or **Next: Networking** if you want to add, delete, or modify any firewall rules.

6.  Verify the firewall settings. Notice how the primary settings have been copied automatically.

7.  Leave the remaining defaults and then select the **Review + create** button at the bottom of the page or proceed to the following forms to configure security or add tags.

8.  Review the information in the final confirmation window. When you're ready, select **Create**. A new deployment will be created and executed.

9.  During the deployment, you see the primary in `Updating` state.
    
    :::image type="content" source="./media/how-to-read-replicas-portal/primary-updating.png" alt-text="Screenshot of primary entering into updating status." lightbox="./media/how-to-read-replicas-portal/primary-updating.png":::

#### [REST API](#tab/restapi)

You can create a secondary read replica by using the [create API](/rest/api/postgresql/flexibleserver/servers/create):

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBForPostgreSql/flexibleServers/{replicaserverName}?api-version=2022-12-01
```

Choose a distinct name for `{replicaserverName}` to differentiate it from the primary server and any other replicas.

```json
{
  "location": "westus3",
  "properties": {
    "createMode": "Replica",
    "SourceServerResourceId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBForPostgreSql/flexibleServers/{sourceserverName}"
  }
}
```

The location is set to `westus3`, but you can adjust this based on your geographical and operational needs.

---

## Modify virtual endpoint

#### [Portal](#tab/portal)

1.  In the [Azure portal](https://portal.azure.com/), choose the primary Azure Database for PostgreSQL - Flexible Server.

2.  On the server sidebar, under **Settings**, select **Replication**.

3.  Select the ellipses and then select **Edit**.
   
    :::image type="content" source="./media/how-to-read-replicas-portal/edit-virtual-endpoint.png" alt-text="Screenshot of editing the virtual endpoint." lightbox="./media/how-to-read-replicas-portal/edit-virtual-endpoint.png":::

4.  In the dialog, select the new secondary replica.

    :::image type="content" source="./media/how-to-read-replicas-portal/select-secondary-endpoint.png" alt-text="Screenshot of selecting the secondary replica.":::

5.  Select **Save**. The reader endpoint will now be pointed at the secondary replica, and the promote operation will now be tied to this replica.

#### [REST API](#tab/restapi)

You can now modify your reader endpoint to point to the newly created secondary replica by using a `PATCH` request. Remember to replace `{replicaserverName}` with the name of the newly created read replica.

```http
PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBForPostgreSql/flexibleServers/{sourceserverName}/virtualendpoints/{virtualendpointName}?api-version=2023-06-01-preview
```

```json
{ 
  "Properties": { 
    "EndpointType": "ReadWrite", 
    "Members": ["{replicaserverName}"] 
  }
} 
```

---

## Promote replica to independent server

Rather than switchover to a replica, it's also possible to break the replication of a replica such that it becomes its standalone server.

#### [Portal](#tab/portal)

1.  In the [Azure portal](https://portal.azure.com/), choose the Azure Database for PostgreSQL - Flexible Server primary server.

2.  On the server sidebar, on the server menu, under **Settings**, select **Replication**.

3.  Under **Servers**, select the **Promote** icon for the replica you want to promote to an independent server.

    :::image type="content" source="./media/how-to-read-replicas-portal/replica-promote-servers.png" alt-text="Screenshot of how to select to promote for a replica 2." lightbox="./media/how-to-read-replicas-portal/replica-promote-servers.png":::
    
4.  In the dialog, ensure the action is **Promote to independent server and remove from replication. This won't impact the primary server**.

5.  For **Data sync**, ensure **Planned - sync data before promoting** is selected.

    :::image type="content" source="./media/how-to-read-replicas-portal/replica-promote-independent.png" alt-text="Screenshot of promoting the replica to independent server.":::

6.  Select **Promote**, the process begins. Once completed, the server will no longer be a replica of the primary.


#### [REST API](#tab/restapi)

You can promote a replica to a standalone server using a `PATCH` request. To do this, send a `PATCH` request to the specified Azure Management REST API URL with the first `JSON` body, where `PromoteMode` is set to `standalone` and `PromoteOption` to `planned`. The second `JSON` body format, setting `ReplicationRole` to `None`, is deprecated but still mentioned here for backward compatibility.

```http
PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBForPostgreSql/flexibleServers/{replicaserverName}?api-version=2023-06-01-preview
```


```json
{
  "Properties": {
    "Replica": {
      "PromoteMode": "standalone",
      "PromoteOption": "planned"
    }
  }
}
```

```json
{
  "Properties": {
    "ReplicationRole": "None"
  }
}
```

---

   > [!NOTE]  
   > Once a replica is promoted to an independent server, it cannot be added back to the replication set.
   

   

## Delete virtual endpoint (preview)

#### [Portal](#tab/portal)

#### [REST API](#tab/restapi)

To delete a virtual endpoint in a preview environment using Azure's REST API, you would issue an `HTTP DELETE` request. The request URL would be structured as follows:

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBForPostgreSql/flexibleServers/{serverName}/virtualendpoints/{virtualendpointName}?api-version=2023-06-01-preview
```


---

## Delete a replica

#### [Portal](#tab/portal)

You can delete a read replica similar to how you delete a standalone Azure Database for PostgreSQL - Flexible Server.

1.  In the Azure portal, open the **Overview** page for the read replica. Select **Delete**.

    :::image type="content" source="./media/how-to-read-replicas-portal/delete-replica.png" alt-text="Screenshot of the replica Overview page, select to delete the replica.":::

You can also delete the read replica from the **Replication** window by following these steps:

2.  In the Azure portal, select your primary Azure Database for the PostgreSQL server.

3.  On the server menu, under **Settings**, select **Replication**.

4.  Select the read replica to delete and then select the ellipses. Select **Delete**.

    :::image type="content" source="./media/how-to-read-replicas-portal/delete-replica02.png" alt-text="Screenshot of select the replica to delete." lightbox="./media/how-to-read-replicas-portal/delete-replica02.png":::

5.  Acknowledge **Delete** operation.

#### [REST API](#tab/restapi)
To delete a primary or replica server, use the [delete API](/rest/api/postgresql/flexibleserver/servers/delete). If server has read replicas then read replicas should be deleted first before deleting the primary server.

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBForPostgreSql/flexibleServers/{replicaserverName}?api-version=2022-12-01
```

---

## Delete a primary server

You can only delete the primary server once all read replicas have been deleted. Follow the instructions in the [Delete a replica](#delete-a-replica) section to delete replicas and then proceed with the steps below.

#### [Portal](#tab/portal)

To delete a server from the Azure portal, follow these steps:

1.  In the Azure portal, select your primary Azure Database for the PostgreSQL server.

2.  Open the **Overview** page for the server and select **Delete**.

    :::image type="content" source="./media/how-to-read-replicas-portal/delete-primary.png" alt-text="Screenshot of the server Overview page, select to delete the primary server." lightbox="./media/how-to-read-replicas-portal/delete-primary.png":::

3.  Enter the name of the primary server to delete. Select **Delete** to confirm the deletion of the primary server.

    :::image type="content" source="./media/how-to-read-replicas-portal/delete-primary-confirm.png" alt-text="Screenshot of confirming to delete the primary server.":::

#### [REST API](#tab/restapi)
To delete a primary or replica server, use the [delete API](/rest/api/postgresql/flexibleserver/servers/delete). If server has read replicas then read replicas should be deleted first before deleting the primary server.

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBForPostgreSql/flexibleServers/{sourceserverName}?api-version=2022-12-01
```

---


## Monitor a replica

Two metrics are available to monitor read replicas.

### Max Physical Replication Lag

> Available only on the primary.

The **Max Physical Replication Lag** metric shows the byte lag between the primary server and the most lagging replica.

1.  In the Azure portal, select the primary server.

2.  Select **Metrics**. In the **Metrics** window, select **Max Physical Replication Lag**.

    :::image type="content" source="./media/how-to-read-replicas-portal/metrics_max_physical_replication_lag.png" alt-text="Screenshot of the Metrics page showing Max Physical Replication Lag metric." lightbox="./media/how-to-read-replicas-portal/metrics_max_physical_replication_lag.png":::

3.  For your **Aggregation**, select **Max**.

### Read Replica Lag metric

The **Read Replica Lag** metric shows the time since the last replayed transaction on a replica. If no transactions occur on your primary, the metric reflects this time lag. For instance, if no transactions occur on your primary server, and the last transaction was replayed 5 seconds ago, then the Read Replica Lag shows a 5-second delay.

1.  In the Azure portal, select read replica.

2.  Select **Metrics**. In the **Metrics** window, select **Read Replica Lag**.

    :::image type="content" source="./media/how-to-read-replicas-portal/metrics_read_replica_lag.png" alt-text="Screenshot of the Metrics page showing Read Replica Lag metric." lightbox="./media/how-to-read-replicas-portal/metrics_read_replica_lag.png":::

3.  For your **Aggregation**, select **Max**.

## Related content

- [Read replicas in Azure Database for PostgreSQL](concepts-read-replicas.md)
