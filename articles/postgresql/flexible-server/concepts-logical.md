---
title: Logical replication and logical decoding - Azure Database for PostgreSQL - Flexible Server
description: Learn about using logical replication and logical decoding in Azure Database for PostgreSQL - Flexible Server
author: sr-msft
ms.author: srranga
ms.service: postgresql
ms.topic: conceptual
ms.date: 09/23/2020
---

# Logical replication and logical decoding in Azure Database for PostgreSQL - Flexible Server

> [!IMPORTANT]
> Azure Database for PostgreSQL - Flexible Server is in preview

PostgreSQL's logical replication and logical decoding features are supported in Azure Database for PostgreSQL - Flexible Server, for Postgres version 11.

## Comparing logical replication and logical decoding
Logical replication and logical decoding have several similarities. They both
* allow you to replicate data out of Postgres
* use the [write-ahead log (WAL)](https://www.postgresql.org/docs/current/wal.html) as the source of changes
* use [logical replication slots](https://www.postgresql.org/docs/current/logicaldecoding-explanation.html#LOGICALDECODING-REPLICATION-SLOTS) to send out data. A slot represents a stream of changes.
* use a table's [REPLICA IDENTITY property](https://www.postgresql.org/docs/current/sql-altertable.html#SQL-CREATETABLE-REPLICA-IDENTITY) to determine what changes can be sent out
* do not replicate DDL changes


The two technologies have their differences:
Logical replication 
* allows you to specify a table or set of tables to be replicated
* replicates data between PostgreSQL instances

Logical decoding 
* extracts changes across all tables in a database 
* cannot directly send data between PostgreSQL instances


## Pre-requisites for logical replication and logical decoding

1. Set the server parameter `wal_level` to `logical`.
2. Restart the server to apply the `wal_level` change.
3. Confirm that your PostgreSQL instance allows network traffic from your connecting resource.
4. Grant the admin user replication permissions.
   ```SQL
   ALTER ROLE <adminname> WITH REPLICATION;
   ```


## Using logical replication and logical decoding

### Logical replication
Logical replication uses the terms 'publisher' and 'subscriber'. 
* The publisher is the PostgreSQL database you are sending data **from**. 
* The subscriber is the PostgreSQL database you are sending data **to**.

Here's some sample code you can use to try out logical replication.

1. Connect to the publisher database. Create a table and add some data.
   ```SQL
   CREATE TABLE basic(id SERIAL, name varchar(40));
   INSERT INTO basic(name) VALUES ('apple');
   INSERT INTO basic(name) VALUES ('banana');
   ```

2. Create a publication for the table.
   ```SQL
   CREATE PUBLICATION pub FOR TABLE basic;
   ```

3. Connect to the subscriber database. Create a table with the same schema as on the publisher.
   ```SQL
   CREATE TABLE basic(id SERIAL, name varchar(40));
   ```

4. Create a subscription that will connect to the publication you created earlier.
   ```SQL
   CREATE SUBSCRIPTION sub CONNECTION 'host=<server>.postgres.database.azure.com user=<admin> dbname=<dbname> password=<password>' PUBLICATION pub;
   ```

5. You can now query the table on the subscriber. You will see that it has received data from the publisher.
   ```SQL
   SELECT * FROM basic;
   ```

You can add more rows to the publisher's table and view the changes on the subscriber.

Visit the PostgreSQL documentation to understand more about [logical replication](https://www.postgresql.org/docs/current/logical-replication.html).

### Logical decoding
Logical decoding can be consumed via the streaming protocol or SQL interface. 

#### Streaming protocol
Consuming changes using the streaming protocol is often preferable. You can create your own consumer / connector, or use a third-party service like [Debezium](https://debezium.io/). 

Visit the wal2json documentation for [an example using the streaming protocol with pg_recvlogical](https://github.com/eulerto/wal2json#pg_recvlogical).

#### SQL interface 
In the example below, we use the SQL interface with the wal2json plugin.
 
1. Create a slot.
   ```SQL
   SELECT * FROM pg_create_logical_replication_slot('test_slot', 'wal2json');
   ```
 
2. Issue SQL commands. For example:
   ```SQL
   CREATE TABLE a_table (
      id varchar(40) NOT NULL,
      item varchar(40),
      PRIMARY KEY (id)
   );
   
   INSERT INTO a_table (id, item) VALUES ('id1', 'item1');
   DELETE FROM a_table WHERE id='id1';
   ```

3. Consume the changes.
   ```SQL
   SELECT data FROM pg_logical_slot_get_changes('test_slot', NULL, NULL, 'pretty-print', '1');
   ```

   The output will look like:
   ```
   {
         "change": [
         ]
   }
   {
         "change": [
                  {
                           "kind": "insert",
                           "schema": "public",
                           "table": "a_table",
                           "columnnames": ["id", "item"],
                           "columntypes": ["character varying(40)", "character varying(40)"],
                           "columnvalues": ["id1", "item1"]
                  }
         ]
   }
   {
         "change": [
                  {
                           "kind": "delete",
                           "schema": "public",
                           "table": "a_table",
                           "oldkeys": {
                                 "keynames": ["id"],
                                 "keytypes": ["character varying(40)"],
                                 "keyvalues": ["id1"]
                           }
                  }
         ]
   }
   ```

4. Drop the slot once you are done using it.
   ```SQL
   SELECT pg_drop_replication_slot('test_slot'); 
   ```

Visit the PostgreSQL documentation to understand more about [logical decoding](https://www.postgresql.org/docs/current/logicaldecoding.html).


## Monitoring
You must monitor logical decoding. Any unused replication slot must be dropped. Slots hold on to Postgres WAL logs and relevant system catalogs until changes have been read. If your subscriber or consumer fails or has not been properly configured, the unconsumed logs will pile up and fill your storage. Also, unconsumed logs increase the risk of transaction ID wraparound. Both situations can cause the server to become unavailable. Therefore, it is critical that logical replication slots are consumed continuously. If a logical replication slot is no longer used, drop it immediately.

The 'active' column in the pg_replication_slots view will indicate whether there is a consumer connected to a slot.
```SQL
SELECT * FROM pg_replication_slots;
```

[Set alerts](howto-alert-on-metrics.md) on the **Maximum Used Transaction IDs** and **Storage Used** flexible server metrics to notify you when the values increase past normal thresholds. 

## Limitations
* **Read replicas** - Azure Database for PostgreSQL read replicas are not currently supported for flexible servers.
* **Slots and HA failover** - Logical replication slots on the primary server are not available on the standby server in your secondary AZ. This applies to you if your server uses the zone-redundant high availability option. In the event of a failover to the standby server, logical replication slots will not be available on the standby.

## Next steps
* Learn more about [networking options](concepts-networking.md)
* Learn about [extensions](concepts-extensions.md) available in flexible server
* Learn more about [high availability](concepts-high-availability.md)

