---
title: Indexing in Azure Cosmos DB for Apache Cassandra account
description: Learn how secondary indexing works in Azure Cosmos DB for Apache Cassandra account.
author: TheovanKraay
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 09/03/2021
ms.author: thvankra
ms.reviewer: mjbrown
---

# Secondary indexing in Azure Cosmos DB for Apache Cassandra
[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

The API for Cassandra in Azure Cosmos DB leverages the underlying indexing infrastructure to expose the indexing strength that is inherent in the platform. However, unlike the core API for NoSQL, API for Cassandra in Azure Cosmos DB does not index all attributes by default. Instead, it supports secondary indexing to create an index on certain attributes, which behaves the same way as Apache Cassandra.  

In general, it's not advised to execute filter queries on the columns that aren't partitioned. You must use ALLOW FILTERING syntax explicitly, which results in an operation that may not perform well. In Azure Cosmos DB you can run such queries on low cardinality attributes because they fan out across partitions to retrieve the results.

It's not advised to create an index on a frequently updated column. It is prudent to create an index when you define the table. This ensures that data and indexes are in a consistent state. In case you create a new index on the existing data, currently, you can't track the index progress change for the table. If you need to track the progress for this operation, you have to request the progress change via a [support ticket](../../azure-portal/supportability/how-to-create-azure-support-request.md).


> [!NOTE]
> Secondary indexes can only be created by using the CQL commands mentioned in this article, and not through the Resource Provider utilities (ARM templates, Azure CLI, PowerShell, or Terraform). Secondary indexes are not supported on the following objects:
> - data types such as frozen collection types, decimal, and variant types.
> - Static columns
> - Clustering keys

> [!WARNING]
> Partition keys are not indexed by default in API for Cassandra. If you have a [compound primary key](partitioning.md#compound-primary-key) in your table, and you filter either on partition key and clustering key, or just partition key, this will give the desired behaviour. However, if you filter on partition key and any other non-indexed fields aside from the clustering key, this will result in a partition key fan-out - even if the other non-indexed fields have a secondary index. If you have a compound primary key in your table, and you want to filter on both the partition key value element of the compound primary key, plus another field that is not the partition key or clustering key, please ensure that you explicitly add a secondary index on the *partition key*. The index in this scenario should significantly improve query performance, even if the other non-partition key and non-clustering key fields have no index. Review our article on [partitioning](partitioning.md) for more information.

## Indexing example

First, create a sample keyspace and table by running the following commands on the CQL shell prompt:

```shell
CREATE KEYSPACE sampleks WITH REPLICATION = {'class' : 'SimpleStrategy'};
CREATE TABLE sampleks.t1(user_id int PRIMARY KEY, lastname text) WITH cosmosdb_provisioned_throughput=400;
``` 

Then, insert sample user data with the following commands:

```shell
insert into sampleks.t1(user_id,lastname) values (1, 'nishu');
insert into sampleks.t1(user_id,lastname) values (2, 'vinod');
insert into sampleks.t1(user_id,lastname) values (3, 'bat');
insert into sampleks.t1(user_id,lastname) values (5, 'vivek');
insert into sampleks.t1(user_id,lastname) values (6, 'siddhesh');
insert into sampleks.t1(user_id,lastname) values (7, 'akash');
insert into sampleks.t1(user_id,lastname) values (8, 'Theo');
insert into sampleks.t1(user_id,lastname) values (9, 'jagan');
```

If you try executing the following statement, you will run into an error that asks you to use `ALLOW FILTERING`: 

```shell
select user_id, lastname from sampleks.t1 where lastname='nishu';
``` 

Although the API for Cassandra supports ALLOW FILTERING, as mentioned in the previous section, it's not recommended. You should instead create an index in the as shown in the following example:

```shell
CREATE INDEX ON sampleks.t1 (lastname);
```
After creating an index on the "lastname" field, you can now run the previous query successfully. With API for Cassandra in Azure Cosmos DB, you do not have to provide an index name. A default index with format `tablename_columnname_idx` is used. For example, ` t1_lastname_idx` is the index name for the previous table.

## Dropping the index 
You need to know what the index name is to drop the index. Run the `desc schema` command to get the description of your table. The output of this command includes the index name in the format `CREATE INDEX tablename_columnname_idx ON keyspacename.tablename(columnname)`. You can then use the index name to drop the index as shown in the following example:

```shell
drop index sampleks.t1_lastname_idx;
```



## Next steps
* Learn how [automatic indexing](../index-overview.md) works in Azure Cosmos DB
* [Apache Cassandra features supported by Azure Cosmos DB for Apache Cassandra](support.md)
