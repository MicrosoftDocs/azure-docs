---
title: Logical replication and logical decoding - Azure Database for PostgreSQL - Flexible Server
description: Learn about using logical replication and logical decoding in Azure Database for PostgreSQL - Flexible Server
ms.author: alkuchar
author: AwdotiaRomanowna
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.date: 11/30/2021
---

# Logical replication and logical decoding in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Azure Database for PostgreSQL - Flexible Server supports the following logical data extraction and replication methodologies:
1. **Logical replication**
   1. Using PostgreSQL [native logical replication](https://www.postgresql.org/docs/current/logical-replication.html) to replicate data objects. Logical replication allows fine-grained control over the data replication, including table-level data replication.
   2. Using [pglogical](https://github.com/2ndQuadrant/pglogical) extension that provides logical streaming replication and more capabilities such as copying initial schema of the database, support for TRUNCATE, ability to replicate DDL etc. 
2. **Logical decoding** which is implemented by [decoding](https://www.postgresql.org/docs/current/logicaldecoding-explanation.html) the content of write-ahead log (WAL). 

## Comparing logical replication and logical decoding
Logical replication and logical decoding have several similarities. They both:
* Allow you to replicate data out of Postgres.
* Use the [write-ahead log (WAL)](https://www.postgresql.org/docs/current/wal.html) as the source of changes.
* Use [logical replication slots](https://www.postgresql.org/docs/current/logicaldecoding-explanation.html#LOGICALDECODING-REPLICATION-SLOTS) to send out data. A slot represents a stream of changes.
* Use a table's [REPLICA IDENTITY property](https://www.postgresql.org/docs/current/sql-altertable.html#SQL-CREATETABLE-REPLICA-IDENTITY) to determine what changes can be sent out.
* Don't replicate DDL changes.


The two technologies have their differences:

Logical replication: 
* Allows you to specify a table or set of tables to be replicated.

Logical decoding:
* Extracts changes across all tables in a database.


## Prerequisites for logical replication and logical decoding

1. Go to server parameters page on the portal.
2. Set the server parameter `wal_level` to `logical`.
3. If you want to use pglogical extension, search for the `shared_preload_libraries`, and `azure.extensions` parameters, and select `pglogical` from the drop-down box.
4. Update `max_worker_processes` parameter value to at least 16. Otherwise, you may run into issues like `WARNING: out of background worker slots`.
5. Save the changes and restart the server to apply the changes.
6. Confirm that your PostgreSQL instance allows network traffic from your connecting resource.
7. Grant the admin user replication permissions.
   ```SQL
   ALTER ROLE <adminname> WITH REPLICATION;
   ```
8. You may want to make sure the role you're using has [privileges](https://www.postgresql.org/docs/current/sql-grant.html) on the schema that you're replicating. Otherwise, you may run into errors such as `Permission denied for schema`. 


>[!NOTE]
> It's always a good practice to separate your replication user from regular admin account.

## Using logical replication and logical decoding

### Native logical replication
Logical replication uses the terms 'publisher' and 'subscriber'. 
* The publisher is the PostgreSQL database you're sending data **from**. 
* The subscriber is the PostgreSQL database you're sending data **to**.

Here's some sample code you can use to try out logical replication.

1. Connect to the publisher database. Create a table and add some data.
   ```SQL
   CREATE TABLE basic(id SERIAL, name TEXT);
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

5. You can now query the table on the subscriber. You'll see that it has received data from the publisher.
   ```SQL
   SELECT * FROM basic;
   ```
   You can add more rows to the publisher's table and view the changes on the subscriber.

   If you're not able to see the data, enable the login privilege for `azure_pg_admin` and check the table content. 
   ```SQL 
   ALTER ROLE azure_pg_admin login;
   ```


Visit the PostgreSQL documentation to understand more about [logical replication](https://www.postgresql.org/docs/current/logical-replication.html).

### pglogical extension

Here is an example of configuring pglogical at the provider database server and the subscriber. Refer to [pglogical extension documentation](https://github.com/2ndQuadrant/pglogical#usage) for more details. Also make sure you have performed prerequisite tasks listed above.

1. Install pglogical extension in the database in both the provider and the subscriber database servers.
    ```SQL
   \c myDB
   CREATE EXTENSION pglogical;
   ```
2. If the replication user is other than the server administration user (who created the server), make sure that you grant membership in a role `azure_pg_admin` to the user and assign REPLICATION and LOGIN attributes to the user. See [pglogical documentation](https://github.com/2ndQuadrant/pglogical#limitations-and-restrictions) for details.
   ```SQL
   GRANT azure_pg_admin to myUser;
   ALTER ROLE myUser REPLICATION LOGIN;
   ```
2. At the **provider** (source/publisher) database server, create the provider node.
   ```SQL
   select pglogical.create_node( node_name := 'provider1', 
   dsn := ' host=myProviderServer.postgres.database.azure.com port=5432 dbname=myDB user=myUser password=myPassword');
   ```
3. Create a replication set.
   ```SQL
   select pglogical.create_replication_set('myreplicationset');
   ```
4. Add all tables in the database to the replication set.
   ```SQL
   SELECT pglogical.replication_set_add_all_tables('myreplicationset', '{public}'::text[]);
   ```

   As an alternate method, you can also add tables from a specific schema (for example, testUser) to a default replication set.
   ```SQL
   SELECT pglogical.replication_set_add_all_tables('default', ARRAY['testUser']);
   ```

5. At the **subscriber** database server, create a subscriber node.
   ```SQL
   select pglogical.create_node( node_name := 'subscriber1', 
   dsn := ' host=mySubscriberServer.postgres.database.azure.com port=5432 dbname=myDB user=myUser password=myPasword' );
   ```
6. Create a subscription to start the synchronization and the replication process.
    ```SQL
   select pglogical.create_subscription (
   subscription_name := 'subscription1',
   replication_sets := array['myreplicationset'],
   provider_dsn := 'host=myProviderServer.postgres.database.azure.com port=5432 dbname=myDB user=myUser password=myPassword');
   ```
7. You can then verify the subscription status.
   ```SQL
   SELECT subscription_name, status FROM pglogical.show_subscription_status();
   ```
   
>[!CAUTION]
> Pglogical does not currently support an automatic DDL replication. The initial schema can be copied manually using pg_dump --schema-only. DDL statements can be executed on the provider and subscriber at the same time by using the pglogical.replicate_ddl_command function. Please be aware of other limitations of the extension listed [here](https://github.com/2ndQuadrant/pglogical#limitations-and-restrictions).


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

4. Drop the slot once you're done using it.
   ```SQL
   SELECT pg_drop_replication_slot('test_slot'); 
   ```

Visit the PostgreSQL documentation to understand more about [logical decoding](https://www.postgresql.org/docs/current/logicaldecoding.html).


## Monitoring
You must monitor logical decoding. Any unused replication slot must be dropped. Slots hold on to Postgres WAL logs and relevant system catalogs until changes have been read. If your subscriber or consumer fails or if it's improperly configured, the unconsumed logs will pile up and fill your storage. Also, unconsumed logs increase the risk of transaction ID wraparound. Both situations can cause the server to become unavailable. Therefore, it's critical that logical replication slots are consumed continuously. If a logical replication slot is no longer used, drop it immediately.

The 'active' column in the pg_replication_slots view will indicate whether there's a consumer connected to a slot.
```SQL
SELECT * FROM pg_replication_slots;
```
[Set alerts](howto-alert-on-metrics.md) on the **Maximum Used Transaction IDs** and **Storage Used** flexible server metrics to notify you when the values increase past normal thresholds. 

## Limitations
* **Logical replication** limitations apply as documented [here](https://www.postgresql.org/docs/current/logical-replication-restrictions.html).
* **Slots and HA failover** - Logical replication slots on the primary server aren't available on the standby server in your secondary AZ. This situation applies to you if your server uses the zone-redundant high availability option. In the event of a failover to the standby server, logical replication slots won't be available on the standby.

>[!IMPORTANT]
> You must drop the logical replication slot in the primary server if the corresponding subscriber no longer exists.  Otherwise the WAL files start to get accumulated in the primary filling up the storage. If the storage threshold exceeds certain threshold and if the logical replication slot is not in use (due to non-available subscriber), Flexible server automatically drops that unused logical replication slot. That action releases accumulated WAL files and avoids your server becoming unavailable due to storage getting filled situation.

## Next steps
* Learn more about [networking options](concepts-networking.md)
* Learn about [extensions](concepts-extensions.md) available in flexible server
* Learn more about [high availability](concepts-high-availability.md)
