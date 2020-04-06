---
title: Indexing in Azure Cosmos DB Cassandra API account
description: Learn how secondary indexing works in Azure Azure Cosmos DB Cassandra API account.
author: kanshiG
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 04/04/2020
ms.author: govindk
ms.reviewer: sngun

---

# Indexing in Azure Cosmos DB Cassandra API

The Cassandra API in Azure Cosmos DB leverages the underlying Indexing infrastructure to expose the indexing strength that is inherent in the platform. Cassandra API in Azure Cosmos DB supports secondary indexing to create index on certain attributes. In general, it's not advised to use Apache Cassandra to execute filter queries on the columns that aren't partitioned. You must use ALLOW filter syntax explicitly which, results in a less performant operation. However, in Azure CosmosDB you can run such queries on low cardinality attributes because they fan out across partitions to retrieve the results.

It's not advised to create index on a frequently updated column. It is prudent to create index when you define the table. This ensures that data and index are in a consistent state. In case you create a new index on the existing data, currently you can't track the index progress change for table. If you need to track the progress for this operation, you have to request the progress change via a [support ticket]( https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request).


> [!NOTE]
> Secondary index is not supported on the following objects:
> * data types such as frozen collection types, decimal, and variant types.
> * Static columns
> * Clustering keys

## Create an index

### Create a table
Use the following commands to create a key space and a table:

```
CREATE  KEYSPACE  sampleks WITH REPLICATION = {  'class' : 'SimpleStrategy'}  
CREATE TABLE sampleks.t1(user_id int PRIMARY KEY, lastname text) WITH cosmosdb_provisioned_throughput=400; 
```

### Insert sample data

Insert the following user data into the table:

```
insert into sampleks.t1(user_id,lastname) values (1, 'Nishu');
insert into sampleks.t1(user_id,lastname) values (2, 'John');
insert into sampleks.t1(user_id,lastname) values (3, 'Bat');
insert into sampleks.t1(user_id,lastname) values (5, 'Vivek');
insert into sampleks.t1(user_id,lastname) values (6, 'Siddhesh');
insert into sampleks.t1(user_id,lastname) values (7, 'Akash');
insert into sampleks.t1(user_id,lastname) values (8, 'Theo');
insert into sampleks.t1(user_id,lastname) values (9, 'Jagan');
```

### Execute a query with filter on the non-partition key cluster

If you try executing the following statement, you will run into an error that asks you to use allow filtering:

```
select user_id, lastname from gks1 .t1 where last_name='Nishu';
```

### Create an index

Create an index with the following command:

```
CREATE INDEX ON  sampleks.t1 (lastname)
```

Next you can run queries with filter on the indexed field:

```
select user_id, lastname from gks1.t1 where user_id=1;
```

With Cassandra API in Azure Cosmos DB, you do not have to provide an index name. A default index with format `tablename_columnname_idx` is used. For example, ` t1_lastname_idx` is the index name for the previous table.

### Drop the index

You need to know the index name is to drop the index. Run the `desc schema` command to get the description of your table. The output of this command includes the index name. You can then use the index name to drop the index as shown in the following example:

```
desc schema;
drop index sampleks.t1_lastname_idx;
```

## Next steps