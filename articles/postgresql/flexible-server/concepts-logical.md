---
title: Logical replication and logical decoding - Azure Database for PostgreSQL - Flexible Server
description: Learn about using logical replication and logical decoding in Azure Database for PostgreSQL - Flexible Server
author: AwdotiaRomanowna
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 11/06/2023
ms.service: postgresql
ms.subservice: flexible-server
ms.custom:
  - ignite-2023
ms.topic: conceptual
---

# Logical replication and logical decoding in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Azure Database for PostgreSQL - Flexible Server supports the following logical data extraction and replication methodologies:

1. **Logical replication**
   1. Using PostgreSQL [native logical replication](https://www.postgresql.org/docs/current/logical-replication.html) to replicate data objects. Logical replication allows fine-grained control over the data replication, including table-level data replication.
   1. Using [pglogical](https://github.com/2ndQuadrant/pglogical) extension that provides logical streaming replication and more capabilities such as copying the initial schema of the database, support for TRUNCATE, ability to replicate DDL, etc.

1. **Logical decoding** which is implemented by [decoding](https://www.postgresql.org/docs/current/logicaldecoding-explanation.html) the content of write-ahead log (WAL).

## Compare logical replication and logical decoding

Logical replication and logical decoding have several similarities. They both:

- Allow you to replicate data out of Postgres.

- Use the [write-ahead log (WAL)](https://www.postgresql.org/docs/current/wal.html) as the source of changes.

- Use [logical replication slots](https://www.postgresql.org/docs/current/logicaldecoding-explanation.html#LOGICALDECODING-REPLICATION-SLOTS) to send out data. A slot represents a stream of changes.

- Use a table's [REPLICA IDENTITY property](https://www.postgresql.org/docs/current/sql-altertable.html#SQL-CREATETABLE-REPLICA-IDENTITY) to determine what changes can be sent out.

- Don't replicate DDL changes.

The two technologies have their differences:

Logical replication:

- Allows you to specify a table or set of tables to be replicated.

Logical decoding:
- Extracts changes across all tables in a database.

## Prerequisites for logical replication and logical decoding

1. Go to the server parameters page on the portal.

1. Set the server parameter `wal_level` to `logical`.

1. If you want to use a pglogical extension, search for the `shared_preload_libraries`, and `azure.extensions` parameters, and select `pglogical` from the dropdown list box.

1. Update `max_worker_processes` parameter value to at least 16. Otherwise, you might encounter issues like `WARNING: out of background worker slots`.

1. Save the changes and restart the server to apply the changes.

1. Confirm that your PostgreSQL instance allows network traffic from your connecting resource.

1. Grant the admin user replication permissions.

   ```sql
   ALTER ROLE <adminname> WITH REPLICATION;
   ```
1. You might want to make sure the role you're using has [privileges](https://www.postgresql.org/docs/current/sql-grant.html) on the schema that you're replicating. Otherwise, you might run into errors such as `Permission denied for schema`.

> [!NOTE]  
> It's always a good practice to separate your replication user from regular admin account.

## Use logical replication and logical decoding

Using native logical replication is the simplest way to replicate data out of Postgres. You can use the SQL interface or the streaming protocol to consume the changes. You can also use the SQL interface to consume changes using logical decoding.

### Native logical replication

Logical replication uses the terms 'publisher' and 'subscriber'.
- The publisher is the PostgreSQL database you're sending data **from**.
- The subscriber is the PostgreSQL database you're sending data **to**.

Here's some sample code you can use to try out logical replication.

1. Connect to the publisher database. Create a table and add some data.

   ```sql
   CREATE TABLE basic (id INTEGER NOT NULL PRIMARY KEY, a TEXT);
   INSERT INTO basic VALUES (1, 'apple');
   INSERT INTO basic VALUES (2, 'banana');
   ```

1. Create a publication for the table.

   ```sql
   CREATE PUBLICATION pub FOR TABLE basic;
   ```

1. Connect to the subscriber database. Create a table with the same schema as on the publisher.

   ```sql
   CREATE TABLE basic (id INTEGER NOT NULL PRIMARY KEY, a TEXT);
   ```

1. Create a subscription that connects to the publication you created earlier.

   ```sql
   CREATE SUBSCRIPTION sub CONNECTION 'host=<server>.postgres.database.azure.com user=<rep_user> dbname=<dbname> password=<password>' PUBLICATION pub;
   ```

1. You can now query the table on the subscriber. You see that it has received data from the publisher.

   ```sql
   SELECT * FROM basic;
   ```
   You can add more rows to the publisher's table and view the changes on the subscriber.

   If you're not able to see the data, enable the sign in privilege for `azure_pg_admin` and check the table content.

   ```sql
   ALTER ROLE azure_pg_admin login;
   ```

Visit the PostgreSQL documentation to understand more about [logical replication](https://www.postgresql.org/docs/current/logical-replication.html).

### Use logical replication between databases on the same server

When you're aiming to set up logical replication between different databases residing on the same PostgreSQL server, it's essential to follow specific guidelines to avoid implementation restrictions that are currently present. As of now, creating a subscription that connects to the same database cluster will only succeed if the replication slot isn't created within the same command; otherwise, the `CREATE SUBSCRIPTION` call hangs, on a `LibPQWalReceiverReceive` wait event. This happens due to an existing restriction within Postgres engine, which might be removed in future releases.

To effectively set up logical replication between your "source" and "target" databases on the same server while circumventing this restriction, follow the steps outlined below:

First, create a table named "basic" with an identical schema in both the source and target databases:

```sql
-- Run this on both source and target databases
CREATE TABLE basic (id INTEGER NOT NULL PRIMARY KEY, a TEXT);
```

Next, in the source database, create a publication for the table and separately create a logical replication slot using the `pg_create_logical_replication_slot` function, which helps to avert the hanging issue that typically occurs when the slot is created in the same command as the subscription. You need to use the `pgoutput` plugin:

```sql
-- Run this on the source database
CREATE PUBLICATION pub FOR TABLE basic;
SELECT pg_create_logical_replication_slot('myslot', 'pgoutput');
```

Thereafter, in your target database, create a subscription to the previously created publication, ensuring that `create_slot` is set to `false` to prevent PostgreSQL from creating a new slot, and correctly specifying the slot name that was created in the previous step. Before running the command, replace the placeholders in the connection string with your actual database credentials:

```sql
-- Run this on the target database
CREATE SUBSCRIPTION sub
   CONNECTION 'dbname=<source dbname> host=<server>.postgres.database.azure.com port=5432 user=<rep_user> password=<password>'
   PUBLICATION pub
   WITH (create_slot = false, slot_name='myslot');
```

Having set up the logical replication, you can now test it by inserting a new record into the "basic" table in your source database and then verifying that it replicates to your target database:

```sql
-- Run this on the source database
INSERT INTO basic SELECT 3, 'mango';

-- Run this on the target database
TABLE basic;
```

If everything is configured correctly, you should witness the new record from the source database in your target database, confirming the successful setup of logical replication.

### pglogical extension

Here's an example of configuring pglogical at the provider database server and the subscriber. Refer to [pglogical extension documentation](https://github.com/2ndQuadrant/pglogical#usage) for more details. Also make sure you have performed prerequisite tasks listed above.

1. Install pglogical extension in the database in both the provider and the subscriber database servers.

   ```sql
   \c myDB
   CREATE EXTENSION pglogical;
   ```

1. If the replication user is other than the server administration user (who created the server), make sure that you grant membership in a role `azure_pg_admin` to the user and assign REPLICATION and LOGIN attributes to the user. See [pglogical documentation](https://github.com/2ndQuadrant/pglogical#limitations-and-restrictions) for details.

   ```sql
   GRANT azure_pg_admin to myUser;
   ALTER ROLE myUser REPLICATION LOGIN;
   ```

1. At the **provider** (source/publisher) database server, create the provider node.

   ```sql
   select pglogical.create_node( node_name := 'provider1',
   dsn := ' host=myProviderServer.postgres.database.azure.com port=5432 dbname=myDB user=myUser password=myPassword');
   ```

1. Create a replication set.

   ```sql
   select pglogical.create_replication_set('myreplicationset');
   ```

1. Add all tables in the database to the replication set.

   ```sql
   SELECT pglogical.replication_set_add_all_tables('myreplicationset', '{public}'::text[]);
   ```

   As an alternate method, you can also add tables from a specific schema (for example, testUser) to a default replication set.

   ```sql
   SELECT pglogical.replication_set_add_all_tables('default', ARRAY['testUser']);
   ```

1. At the **subscriber** database server, create a subscriber node.

   ```sql
   select pglogical.create_node( node_name := 'subscriber1',
   dsn := ' host=mySubscriberServer.postgres.database.azure.com port=5432 dbname=myDB user=myUser password=myPasword' );
   ```

1. Create a subscription to start the synchronization and the replication process.

   ```sql
   select pglogical.create_subscription (
   subscription_name := 'subscription1',
   replication_sets := array['myreplicationset'],
   provider_dsn := 'host=myProviderServer.postgres.database.azure.com port=5432 dbname=myDB user=myUser password=myPassword');
   ```

1. You can then verify the subscription status.

   ```sql
   SELECT subscription_name, status FROM pglogical.show_subscription_status();
   ```

> [!CAUTION]  
> Pglogical does not currently support an automatic DDL replication. The initial schema can be copied manually using pg_dump --schema-only. DDL statements can be executed on the provider and subscriber simultaneously using the pglogical.replicate_ddl_command function. Please be aware of other limitations of the extension listed [here](https://github.com/2ndQuadrant/pglogical#limitations-and-restrictions).

### Logical decoding

Logical decoding can be consumed via the streaming protocol or SQL interface.

#### Streaming protocol

Consuming changes using the streaming protocol is often preferable. You can create your own consumer / connector, or use a third-party service like [Debezium](https://debezium.io/).

Visit the wal2json documentation for [an example using the streaming protocol with pg_recvlogical](https://github.com/eulerto/wal2json#pg_recvlogical).

#### SQL interface

In the example below, we use the SQL interface with the wal2json plugin.

1. Create a slot.

   ```sql
   SELECT * FROM pg_create_logical_replication_slot('test_slot', 'wal2json');
   ```

1. Issue SQL commands. For example:

   ```sql
   CREATE TABLE a_table (
      id varchar(40) NOT NULL,
      item varchar(40),
      PRIMARY KEY (id)
   );

   INSERT INTO a_table (id, item) VALUES ('id1', 'item1');
   DELETE FROM a_table WHERE id='id1';
   ```

1. Consume the changes.

   ```sql
   SELECT data FROM pg_logical_slot_get_changes('test_slot', NULL, NULL, 'pretty-print', '1');
   ```

   The output looks like:

   ```sql
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

1. Drop the slot once you're done using it.

   ```sql
   SELECT pg_drop_replication_slot('test_slot');
   ```

Visit the PostgreSQL documentation to understand more about [logical decoding](https://www.postgresql.org/docs/current/logicaldecoding.html).

## Monitor

You must monitor logical decoding. Any unused replication slot must be dropped. Slots hold on to Postgres WAL logs and relevant system catalogs until changes have been read. If your subscriber or consumer fails or if it's improperly configured, the unconsumed logs pile up and fill your storage. Also, unconsumed logs increase the risk of transaction ID wraparound. Both situations can cause the server to become unavailable. Therefore, logical replication slots must be consumed continuously. If a logical replication slot is no longer used, drop it immediately.

The 'active' column in the `pg_replication_slots` view indicates whether there's a consumer connected to a slot.

```sql
SELECT * FROM pg_replication_slots;
```
[Set alerts](howto-alert-on-metrics.md) on the **Maximum Used Transaction IDs** and **Storage Used** flexible server metrics to notify you when the values increase past normal thresholds.


## Limitations

- **Logical replication** limitations apply as documented [here](https://www.postgresql.org/docs/current/logical-replication-restrictions.html).

- **Slots and HA failover** - When using [high-availability (HA)](concepts-high-availability.md) enabled servers with Azure Database for PostgreSQL - Flexible Server, be aware that logical replication slots aren't preserved during failover events. To maintain logical replication slots and ensure data consistency after a failover, it's recommended to use the PG Failover Slots extension. For more information on enabling this extension, please refer to the [documentation](concepts-extensions.md#pg_failover_slots-preview).

> [!IMPORTANT]  
> You must drop the logical replication slot in the primary server if the corresponding subscriber no longer exists. Otherwise, the WAL files accumulate in the primary, filling up the storage. Suppose the storage threshold exceeds a certain threshold, and the logical replication slot is not in use (due to a non-available subscriber). In that case, the Flexible server automatically drops that unused logical replication slot. That action releases accumulated WAL files and avoids your server becoming unavailable due to storage getting filled situation.

## Related content

- [networking options](concepts-networking.md)
- [extensions](concepts-extensions.md)
- [high availability](concepts-high-availability.md)
