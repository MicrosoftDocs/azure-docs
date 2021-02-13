---
title: Scale out Azure Database for PostgreSQL Hyperscale server group
description: Scale out Azure Database for PostgreSQL Hyperscale server group
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---

# Scale out your Azure Arc enabled PostgreSQL Hyperscale server group by adding more worker nodes
This document explains how to scale out an Azure Arc enabled PostgreSQL Hyperscale server group. It does so by taking you through a scenario. **If you do not want to run through the scenario and want to just read about how to scale out, jump to the paragraph [Scale out](#scale-out)**.

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Get started
If you are already familiar with the scaling model of Azure Arc enabled PostgreSQL Hyperscale or Azure Database for PostgreSQL Hyperscale (Citus), you may skip this paragraph. If you are not, it is recommended you start by reading about this scaling model in the documentation page of Azure Database for PostgreSQL Hyperscale (Citus). Azure Database for PostgreSQL Hyperscale (Citus) is the same technology that is hosted as a service in Azure (Platform As A Service also known as PAAS) instead of being offered as part of Azure Arc enabled Data Services:
- [Nodes and tables](../../postgresql/concepts-hyperscale-nodes.md)
- [Determine application type](../../postgresql/concepts-hyperscale-app-type.md)
- [Choose a distribution column](../../postgresql/concepts-hyperscale-choose-distribution-column.md)
- [Table colocation](../../postgresql/concepts-hyperscale-colocation.md)
- [Distribute and modify tables](../../postgresql/howto-hyperscale-modify-distributed-tables.md)
- [Design a multi-tenant database](../../postgresql/tutorial-design-database-hyperscale-multi-tenant.md)*
- [Design a real-time analytics dashboard](../../postgresql/tutorial-design-database-hyperscale-realtime.md)*

> \* In the documents above, skip the sections **Sign in to the Azure portal**, & **Create an Azure Database for PostgreSQL - Hyperscale (Citus)**. Implement the remaining steps in your Azure Arc deployment. Those sections are specific to the Azure Database for PostgreSQL Hyperscale (Citus) offered as a PaaS service in the Azure cloud but the other parts of the documents are directly applicable to your Azure Arc enabled PostgreSQL Hyperscale.

## Scenario
This scenario refers to the PostgreSQL Hyperscale server group that was created as an example in the [Create an Azure Arc enabled PostgreSQL Hyperscale server group](create-postgresql-hyperscale-server-group.md) documentation.

### Load test data
The scenario uses a sample of publicly available GitHub data, available from the [Citus Data website](https://www.citusdata.com/) (Citus Data is part of Microsoft).

#### Connect to your Azure Arc enabled PostgreSQL Hyperscale server group

##### List the connection information
Connect to your Azure Arc enabled PostgreSQL Hyperscale server group by first getting the connection information:
The general format of this command is
```console
azdata arc postgres endpoint list -n <server name>
```
For example:
```console
azdata arc postgres endpoint list -n postgres01
```

Example output:

```console
[
  {
    "Description": "PostgreSQL Instance",
    "Endpoint": "postgresql://postgres:<replace with password>@12.345.123.456:1234"
  },
  {
    "Description": "Log Search Dashboard",
    "Endpoint": "https://12.345.123.456:12345/kibana/app/kibana#/discover?_a=(query:(language:kuery,query:'custom_resource_name:\"postgres01\"'))"
  },
  {
    "Description": "Metrics Dashboard",
    "Endpoint": "https://12.345.123.456:12345/grafana/d/postgres-metrics?var-Namespace=arc3&var-Name=postgres01"
  }
]
```

##### Connect with the client tool of your choice.

Run the following query to verify that you currently have two (or more Hyperscale worker nodes), each corresponding to a Kubernetes pod:

```sql
SELECT * FROM pg_dist_node;
```

```console
 nodeid | groupid |                       nodename                        | nodeport | noderack | hasmetadata | isactive | noderole | nodecluster | metadatasynced | shouldhaveshards
--------+---------+-------------------------------------------------------+----------+----------+-------------+----------+----------+-------------+----------------+------------------
      1 |       1 | pg1-1.pg1-svc.default.svc.cluster.local |     5432 | default  | f           | t        | primary  | default     | f              | t
      2 |       2 | pg1-2.pg1-svc.default.svc.cluster.local |     5432 | default  | f           | t        | primary  | default     | f              | t
(2 rows)
```

#### Create a sample schema
Create two tables by running the following query:

```sql
CREATE TABLE github_events
(
    event_id bigint,
    event_type text,
    event_public boolean,
    repo_id bigint,
    payload jsonb,
    repo jsonb,
    user_id bigint,
    org jsonb,
    created_at timestamp
);

CREATE TABLE github_users
(
    user_id bigint,
    url text,
    login text,
    avatar_url text,
    gravatar_id text,
    display_login text
);
```

JSONB is the JSON datatype in binary form in PostgreSQL. It stores a flexible schema in a single column and with PostgreSQL. The schema will have a GIN index on it to index every key and value within it. With a GIN index, it becomes fast and easy to query with various conditions directly on that payload. So we’ll go ahead and create a couple of indexes before we load our data:

```sql
CREATE INDEX event_type_index ON github_events (event_type);
CREATE INDEX payload_index ON github_events USING GIN (payload jsonb_path_ops);
```

To shard standard tables, run a query for each table. Specify the table we want to shard, and the key we want to shard it on. We’ll shard both the events and users table on user_id:

```sql
SELECT create_distributed_table('github_events', 'user_id');
SELECT create_distributed_table('github_users', 'user_id');
```

#### Load sample data
Load the data with COPY ... FROM PROGRAM:

```sql
COPY github_users FROM PROGRAM 'curl "https://examples.citusdata.com/users.csv"' WITH ( FORMAT CSV );
COPY github_events FROM PROGRAM 'curl "https://examples.citusdata.com/events.csv"' WITH ( FORMAT CSV );
```

#### Query the data
And now measure how long a simple query takes with two nodes:

```sql
SELECT COUNT(*) FROM github_events;
```
Make a note of the query execution time.


## Scale out
The general format of the scale-out command is:
```console
azdata arc postgres server edit -n <server group name> -w <target number of worker nodes>
```

> [!CAUTION]
> The preview release does not support scale back in. For example it is not yet possible to reduce the number of worker nodes. If you need to do so, you need to extract/backup the data, drop the server group, create a new server group with less worker nodes and then import the data.

In this example, we increase the number of worker nodes from 2 to 4, by running the following command:

```console
azdata arc postgres server edit -n postgres01 -w 4
```

Upon adding  nodes, and you'll see a Pending state for the server group. For example:
```console
azdata arc postgres server list
```

```console
Name        State          Workers
----------  -------------  ---------
postgres01  Pending 4/5    4
```

Once the nodes are available, the Hyperscale Shard Rebalancer runs automatically, and redistributes the data to the new nodes. The scale-out operation is an online operation. While the nodes are added and the data is redistributed across the nodes, the data remains available for queries.

### Verify the new shape of the server group (optional)
Use either of the methods below to verify that the server group is now using the additional worker nodes you added.

#### With azdata:
Run the command:
```console
azdata arc postgres server list
```

It returns the list of server groups created in your namespace and indicates their number of worker nodes. For example:
```console
Name        State    Workers
----------  -------  ---------
postgres01  Ready    4
```

#### With kubectl:
Run the command:
```console
kubectl get postgresql-12
```

It returns the list of server groups created in your namespace and indicates their number of worker nodes. For example:
```console
NAME         STATE   READY-PODS   EXTERNAL-ENDPOINT   AGE
postgres01   Ready   4/4          10.0.0.4:31066      4d20h
```
> [!NOTE]
> If you created a server group of the version 11 PostgreSQL instead of 12, run the following command instead: _kubectl get postgresql-11_

#### With a SQL query:
Connect to your server group with the client tool of your choice and run the following query:

```sql
SELECT * FROM pg_dist_node;
```

```console
 nodeid | groupid |                       nodename                        | nodeport | noderack | hasmetadata | isactive | noderole | nodecluster | metadatasynced | shouldhaveshards
--------+---------+-------------------------------------------------------+----------+----------+-------------+----------+----------+-------------+----------------+------------------
      1 |       1 | pg1-1.pg1-svc.default.svc.cluster.local |     5432 | default  | f           | t        | primary  | default     | f              | t
      2 |       2 | pg1-2.pg1-svc.default.svc.cluster.local |     5432 | default  | f           | t        | primary  | default     | f              | t
      3 |       3 | pg1-3.pg1-svc.default.svc.cluster.local |     5432 | default  | f           | t        | primary  | default     | f              | t
      4 |       4 | pg1-4.pg1-svc.default.svc.cluster.local |     5432 | default  | f           | t        | primary  | default     | f              | t
(4 rows)
```

## Return to the scenario

If you would like to compare the execution time of the select count query against the sample data set, use the same count query. It can be used across the four worker nodes, without any changes in the SQL statement.

```sql
SELECT COUNT(*) FROM github_events;
```
Note the execution time.


> [!NOTE]
> Depending on your environment - for example if you have deployed your test server group with `kubeadm` on a single node VM - you may see a modest improvement in the execution time. To get a better idea of the type of performance improvement you could reach with Azure Arc enabled PostgreSQL Hyperscale, watch the following short videos:
>* [High performance HTAP with Azure PostgreSQL Hyperscale (Citus)](https://www.youtube.com/watch?v=W_3e07nGFxY)
>* [Building HTAP applications with Python & Azure PostgreSQL Hyperscale (Citus)](https://www.youtube.com/watch?v=YDT8_riLLs0)


## Next steps

- Read about how to [scale up and down (memory, vCores) your Azure Arc enabled PostgreSQL Hyperscale server group](scale-up-down-postgresql-hyperscale-server-group-using-cli.md)
- Read about how to set server parameters in your Azure Arc enabled PostgreSQL Hyperscale server group
- Read the concepts and How-to guides of Azure Database for PostgreSQL Hyperscale to distribute your data across multiple PostgreSQL Hyperscale nodes and to benefit from all the power of Azure Database for Postgres Hyperscale. :
    * [Nodes and tables](../../postgresql/concepts-hyperscale-nodes.md)
    * [Determine application type](../../postgresql/concepts-hyperscale-app-type.md)
    * [Choose a distribution column](../../postgresql/concepts-hyperscale-choose-distribution-column.md)
    * [Table colocation](../../postgresql/concepts-hyperscale-colocation.md)
    * [Distribute and modify tables](../../postgresql/howto-hyperscale-modify-distributed-tables.md)
    * [Design a multi-tenant database](../../postgresql/tutorial-design-database-hyperscale-multi-tenant.md)*
    * [Design a real-time analytics dashboard](../../postgresql/tutorial-design-database-hyperscale-realtime.md)*

 > \* In the documents above, skip the sections **Sign in to the Azure portal**, & **Create an Azure Database for PostgreSQL - Hyperscale (Citus)**. Implement the remaining steps in your Azure Arc deployment. Those sections are specific to the Azure Database for PostgreSQL Hyperscale (Citus) offered as a PaaS service in the Azure cloud but the other parts of the documents are directly applicable to your Azure Arc enabled PostgreSQL Hyperscale.

- [Storage configuration and Kubernetes storage concepts](storage-configuration.md)
- [Kubernetes resource model](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/resources.md#resource-quantities)
