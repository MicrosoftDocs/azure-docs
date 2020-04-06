# Secondary Indexes in Cassandra API

CosmosDB's Cassandra API leverages the underlying Indexing infrastructure to expose the indexing strength inherent in the platform. In general in Apache Cassandra executing filter queries on non partition key columns is not advised. One has to use ALLOW FILTERING syntax explicitly, opting in to performance unpredictability. 

In Azure Cosmos DB, it is recommended to run these queries on low cardinality attributes as these will fan out across partitions to retrieve the results. Creating an index on a frequently updating column is not advised. It would be prudent to create an index when you define the table. This ensures data and index are in consistent. 

If you are trying to create a new index on existing data, tracking the index progress change for a table is not exposed. If you need to track the progress - please request the progress change via a support ticket.

## Indexing example

First, create a sample keyspace and table:

```
CREATE KEYSPACE sampleks WITH REPLICATION = {'class' : 'SimpleStrategy'};
CREATE TABLE sampleks.t1(user_id int PRIMARY KEY, lastname text) WITH cosmosdb_provisioned_throughput=400;
``` 

Then, insert some data with the following commands:

```
insert into sampleks.t1(user_id,lastname) values (1, 'nishu');
insert into sampleks.t1(user_id,lastname) values (2, 'vinod');
insert into sampleks.t1(user_id,lastname) values (3, 'bat');
insert into sampleks.t1(user_id,lastname) values (5, 'vivek');
insert into sampleks.t1(user_id,lastname) values (6, 'siddhesh');
insert into sampleks.t1(user_id,lastname) values (7, 'akash');
insert into sampleks.t1(user_id,lastname) values (8, 'Theo');
insert into sampleks.t1(user_id,lastname) values (9, 'jagan');
```

If you try to execute below statement - you will get an error asking you to use `ALLOW FILTERING`. 

```
select user_id, lastname from sampleks.t1 where lastname='nishu';
``` 

Although the Cassandra API does support ALLOW FILTERING, as above this is not recommended. You should instead create an index in the following manner:

```
CREATE INDEX ON sampleks.t1 (lastname);
```
You should now be able to run the earlier select successfully, without getting an error. Note that with Cosmos DB's Cassandra API you do not provide an index name, an index name of the form tablename_columnname_idx is added automatically. 

## Dropping the index 
If you want to find the index name, you can execute the `desc schema;` via cqlsh, and at end of the table definition for table in context you should see the index ddl in below format:

```
CREATE INDEX tablename_columnname_idx ON keyspacename.tablename(columnname)
```

Use the index name to drop the index as below;

```
drop index sampleks.t1_lastname_idx;
```

### Note 
Secondary index in not supported on:
 - Data types like frozen collection types, decimal and variant types.
 - Static 
 - Clustering keys
