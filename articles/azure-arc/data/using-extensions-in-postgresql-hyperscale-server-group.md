---
title: Use PostgreSQL extensions
description: Use PostgreSQL extensions
titleSuffix: Azure Arc-enabled data services
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
---

# Use PostgreSQL extensions in your Azure Arc-enabled PostgreSQL Hyperscale server group

PostgreSQL is at its best when you use it with extensions. In fact, a key element of our own Hyperscale functionality is the Microsoft-provided `citus` extension that is installed by default, which allows Postgres to transparently shard data across multiple nodes.

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Supported extensions
The standard [`contrib`](https://www.postgresql.org/docs/12/contrib.html) extensions and the following extensions are already deployed in the containers of your Azure Arc-enabled PostgreSQL Hyperscale server group:
- [`citus`](https://github.com/citusdata/citus), v: 10.0. The Citus extension by [Citus Data](https://www.citusdata.com/) is loaded by default as it brings the Hyperscale capability to the PostgreSQL engine. Dropping the Citus extension from your Azure Arc PostgreSQL Hyperscale server group is not supported.
- [`pg_cron`](https://github.com/citusdata/pg_cron), v: 1.3
- [`pgaudit`](https://www.pgaudit.org/), v: 1.4
- plpgsql, v: 1.0
- [`postgis`](https://postgis.net), v: 3.0.2
- [`plv8`](https://plv8.github.io/), v: 2.3.14
- [`pg_partman`](https://github.com/pgpartman/pg_partman), v: 4.4.1/
- [`tdigest`](https://github.com/tvondra/tdigest), v: 1.0.1

Updates to this list will be posted as it evolves over time.

> [!IMPORTANT]
> While you may bring to your server group an extension other than those listed above, in this Preview, it will not be persisted to your system. It means that it will not be available after a restart of the system and you would need to bring it again.

This guide will take in a scenario to use two of these extensions:
- [`PostGIS`](https://postgis.net/)
- [`pg_cron`](https://github.com/citusdata/pg_cron)

## Which extensions need to be added to the shared_preload_libraries and created?

|Extensions   |Requires to be added to shared_preload_libraries  |Requires to be created |
|-------------|--------------------------------------------------|---------------------- |
|`pg_cron`      |No       |Yes        |
|`pg_audit`     |Yes       |Yes        |
|`plpgsql`      |Yes       |Yes        |
|`postgis`      |No       |Yes        |
|`plv8`      |No       |Yes        |

## Add extensions to the `shared_preload_libraries`
For details about that are `shared_preload_libraries`, read the PostgreSQL documentation [here](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-SHARED-PRELOAD-LIBRARIES):
- This step isn't needed for the extensions that are part of `contrib`
- this step isn't required for extensions that are not required to pre-load by shared_preload_libraries. For these extensions you may jump the next paragraph [Create extensions](#create-extensions).

### Add an extension at the creation time of a server group
```azurecli
az postgres arc-server create -n <name of your postgresql server group> --extensions <extension names>
```
### Add an extension to an instance that already exists
```azurecli
az postgres arc-server server edit -n <name of your postgresql server group> --extensions <extension names>
```




## Show the list of extensions added to shared_preload_libraries
Run either of the following command.

### With CLI command
```azurecli
az postgres arc-server show -n <server group name>
```
Scroll in the output and notice the engine\extensions sections in the specifications of your server group. For example:
```console
"engine": {
      "extensions": [
        {
          "name": "citus"
        },
        {
          "name": "pg_cron"
        }
      ]
    },
```
### With kubectl
```console
kubectl describe postgresql-12s/postgres02
```
Scroll in the output and notice the engine\extensions sections in the specifications of your server group. For example:
```console
Engine:
    Extensions:
      Name:  citus
      Name:  pg_cron
```


## Create extensions
Connect to your server group with the client tool of your choice and run the standard PostgreSQL query:
```console
CREATE EXTENSION <extension name>;
```

## Show the list of extensions created
Connect to your server group with the client tool of your choice and run the standard PostgreSQL query:
```console
select * from pg_extension;
```

## Drop an extension
Connect to your server group with the client tool of your choice and run the standard PostgreSQL query:
```console
drop extension <extension name>;
```

## The `PostGIS` extension
You do not need to add the `PostGIS` extension to the `shared_preload_libraries`.
Get [sample data](http://duspviz.mit.edu/tutorials/intro-postgis/) from the MIT’s Department of Urban Studies & Planning. Run `apt-get install unzip` to install unzip as needed.

```console
wget http://duspviz.mit.edu/_assets/data/intro-postgis-datasets.zip
unzip intro-postgis-datasets.zip
```

Let's connect to our database, and create the `PostGIS` extension:

```console
CREATE EXTENSION postgis;
```

> [!NOTE]
> If you would like to use one of the extensions in the `postgis` package (for example `postgis_raster`, `postgis_topology`, `postgis_sfcgal`, `fuzzystrmatch`...) you need to first create the postgis extension and then create the other extension. For instance: `CREATE EXTENSION postgis`; `CREATE EXTENSION postgis_raster`;

And create the schema:

```sql
CREATE TABLE coffee_shops (
  id serial NOT NULL,
  name character varying(50),
  address character varying(50),
  city character varying(50),
  state character varying(50),
  zip character varying(10),
  lat numeric,
  lon numeric,
  geom geometry(POINT,4326)
);
CREATE INDEX coffee_shops_gist ON coffee_shops USING gist (geom);
```

Now, we can combine `PostGIS` with the scale-out functionality, by making the coffee_shops table distributed:

```sql
SELECT create_distributed_table('coffee_shops', 'id');
```

Let's load some data:

```console
\copy coffee_shops(id,name,address,city,state,zip,lat,lon) from cambridge_coffee_shops.csv CSV HEADER;
```

And fill the `geom` field with the correctly encoded latitude and longitude in the `PostGIS` `geometry` data type:

```sql
UPDATE coffee_shops SET geom = ST_SetSRID(ST_MakePoint(lon,lat),4326);
```

Now we can list the coffee shops closest to MIT (77 Massachusetts Ave at 42.359055, -71.093500):

```sql
SELECT name, address FROM coffee_shops ORDER BY geom <-> ST_SetSRID(ST_MakePoint(-71.093500,42.359055),4326);
```


## The `pg_cron` extension

Now, let's enable `pg_cron` on our PostgreSQL server group by adding it to the shared_preload_libraries:

```azurecli
az postgres arc-server update -n pg2 -ns arc --extensions pg_cron
```

Your server group will restart complete the installation of the  extensions. It may take 2 to 3 minutes.

We can now connect again, and create the `pg_cron` extension:

```sql
CREATE EXTENSION pg_cron;
```

For test purposes, lets make a table `the_best_coffee_shop` that takes a random name from our earlier `coffee_shops` table, and inserts the table contents:

```sql
CREATE TABLE the_best_coffee_shop(name text);
```

We can use `cron.schedule` plus a few SQL statements, to get a random table name (notice the use of a temporary table to store a distributed query result), and store it in `the_best_coffee_shop`:

```sql
SELECT cron.schedule('* * * * *', $$
  TRUNCATE the_best_coffee_shop;
  CREATE TEMPORARY TABLE tmp AS SELECT name FROM coffee_shops ORDER BY random() LIMIT 1;
  INSERT INTO the_best_coffee_shop SELECT * FROM tmp;
  DROP TABLE tmp;
$$);
```

And now, once a minute, we'll get a different name:

```sql
SELECT * FROM the_best_coffee_shop;
```

```console
      name
-----------------
 B & B Snack Bar
(1 row)
```

See the [pg_cron README](https://github.com/citusdata/pg_cron) for full details on the syntax.


## Next steps
- Read documentation on [`plv8`](https://plv8.github.io/)
- Read documentation on [`PostGIS`](https://postgis.net/)
- Read documentation on [`pg_cron`](https://github.com/citusdata/pg_cron)