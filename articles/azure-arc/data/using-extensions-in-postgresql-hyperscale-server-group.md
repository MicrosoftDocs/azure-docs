---
title: Use PostgreSQL extensions
description: Use PostgreSQL extensions
titleSuffix: Azure Arc enabled data services
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---

# Use PostgreSQL extensions in your Azure Arc enabled PostgreSQL Hyperscale server group

PostgreSQL is at its best when you use it with extensions. In fact, a key element of our own Hyperscale functionality is the Microsoft-provided `citus` extension that is installed by default, which allows Postgres to transparently shard data across multiple nodes.


[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## List of extensions
In addition of the extensions in [`contrib`](https://www.postgresql.org/docs/12/contrib.html), the list of extensions present in the containers of your Azure Arc enabled PostgreSQL Hyperscale server group is:
- `citus`, v: 9.4
- `pg_cron`, v: 1.2
- `plpgsql`, v: 1.0
- `postgis`, v: 3.0.2
- `plv8`, v: 2.3.14

This list evolves overtime and updates will be posted in this document. It is not yet possible for you to add extensions beyond those listed above.

This guide will take in a scenario to use two of these extensions:
- [PostGIS](https://postgis.net/)
- [`pg_cron`](https://github.com/citusdata/pg_cron)


## Manage extensions

### Enable extensions
This step is not needed for the extensions that are part of `contrib`.
The general format of the command to enable extensions is:

#### Enable an extension at the creation time of a server group:
```console
azdata arc postgres server create -n <name of your postgresql server group> --extensions <extension names>
```
#### Enable an extension on an instance that already exists:
```console
azdata arc postgres server edit -n <name of your postgresql server group> --extensions <extension names>
```

#### Get the list of extensions enabled:
Run either of the following command.

##### With azdata
```console
azdata arc postgres server show -n <server group name>
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
##### With kubectl
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


### Create extensions:
Connect to your server group with the client tool of your choice and run the standard PostgreSQL query:
```console
CREATE EXTENSION <extension name>;
```

### Get the list of extension created in your server group:
Connect to your server group with the client tool of your choice and run the standard PostgreSQL query:
```console
select * from pg_extension;
```

### Drop an extension from your server group:
Connect to your server group with the client tool of your choice and run the standard PostgreSQL query:
```console
drop extension <extension name>;
```

## Use the PostGIS and the Pg_cron extensions

### The PostGIS extension

We can either enable the PostGIS extension on an existing server group, or create a new one with the extension already enabled:

**Enabling an extension at the creation time of a server group:**
```console
azdata arc postgres server create -n <name of your postgresql server group> --extensions <extension names>

#Example:
azdata arc postgres server create -n pg2 -w 2 --extensions postgis
```

**Enabling an extension on an instance that already exists:**
```console
azdata arc postgres server edit -n <name of your postgresql server group> --extensions <extension names>

#Example:
azdata arc postgres server edit --extensions postgis -n pg2
```

To verify what extensions are installed, use the below standard PostgreSQL command after connecting to the instance with your favorite PostgreSQL client tool like Azure Data Studio:
```console
select * from pg_extension;
```

For a PostGIS example, first, get [sample data](http://duspviz.mit.edu/tutorials/intro-postgis/) from the MIT’s Department of Urban Studies & Planning. You may need to run `apt-get install unzip` to install unzip when using the VM for testing.

```console
wget http://duspviz.mit.edu/_assets/data/intro-postgis-datasets.zip
unzip intro-postgis-datasets.zip
```

Let's connect to our database, and create the PostGIS extension:

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

Now, we can combine PostGIS with the scale out functionality, by making the coffee_shops table distributed:

```sql
SELECT create_distributed_table('coffee_shops', 'id');
```

Let's load some data:

```console
\copy coffee_shops(id,name,address,city,state,zip,lat,lon) from cambridge_coffee_shops.csv CSV HEADER;
```

And fill the `geom` field with the correctly encoded latitude and longitude in the PostGIS `geometry` data type:

```sql
UPDATE coffee_shops SET geom = ST_SetSRID(ST_MakePoint(lon,lat),4326);
```

Now we can list the coffee shops closest to MIT (77 Massachusetts Ave at 42.359055, -71.093500):

```sql
SELECT name, address FROM coffee_shops ORDER BY geom <-> ST_SetSRID(ST_MakePoint(-71.093500,42.359055),4326);
```


### The pg_cron extension

Let's enable `pg_cron` on our PostgreSQL server group, in addition to PostGIS:

```console
azdata postgres server update -n pg2 -ns arc --extensions postgis,pg_cron
```

Note that this will restart the nodes and install the additional extensions, which may take 2 - 3 minutes.

We can now connect again, and create the `pg_cron` extension:

```sql
CREATE EXTENSION pg_cron;
```

For test purposes, lets make a table `the_best_coffee_shop` that takes a random name from our earlier `coffee_shops` table, and sets the table contents:

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

>[!NOTE]
>It is not supported to drop the `citus` extension. The `citus` extension is required to provide the Hyperscale experience.

## Next steps:
- Read documentation on [plv8](https://plv8.github.io/)
- Read documentation on [PostGIS](https://postgis.net/)
- Read documentation on [`pg_cron`](https://github.com/citusdata/pg_cron)
