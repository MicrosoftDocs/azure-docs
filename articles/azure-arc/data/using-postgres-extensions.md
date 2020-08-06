---
title: Using PostgreSQL extensions
description: Using PostgreSQL extensions
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Scenario: Using PostgreSQL extensions

PostgreSQL is at its best when you use it with extensions. In fact, a key element of our own Hyperscale functionality is the Microsoft-provided `citus` extension that is installed by default, which allows Postgres to transparently shard data across multiple nodes.

In this guide we'll look at two additional extensions:

- [PostGIS](https://postgis.net/)
- [pg_cron](https://github.com/citusdata/pg_cron)
- [plv8](https://plv8.github.io/#plv8)
- [timescaledb](https://github.com/timescale/timescaledb)

## The PostGIS extension

We can either enable the PostGIS extension on an existing server group, or create a new one with the extension already enabled:

```terminal
azdata postgres server create -n <name of your postgresql server group> -ns <name of the namespace> --extensions <extension names>

#Example:
azdata postgres server create -n pg2 -ns arc -w 2 --extensions postgis
```

Now, let's go through a PostGIS example. We'll start by getting some [sample data](http://duspviz.mit.edu/tutorials/intro-postgis/) from the MIT’s Department of Urban Studies & Planning. Note you may need to run `apt-get install unzip` to install unzip when using the VM for testing.

```terminal
wget http://duspviz.mit.edu/_assets/data/intro-postgis-datasets.zip
unzip intro-postgis-datasets.zip
```

Let's connect to our database, and create the PostGIS extension:

```terminal
CREATE EXTENSION postgis;
```

>**Note:** If you would like to use one of the extensions in the postgis package (for example postgis_raster, postgis_topology, postgis_sfcgal, fuzzystrmatch...) you need to first create the postgis extension and then create the other extension. For instance: CREATE EXTENSION postgis; CREATE EXTENSION postgis_raster;

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

```terminal
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

## The pg_cron extension

Let's enable `pg_cron` on our PostgreSQL server group, in addition to PostGIS:

```terminal
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

```terminal
      name
-----------------
 B & B Snack Bar
(1 row)
```

See the [pg_cron README](https://github.com/citusdata/pg_cron) for full details on the syntax.

## The plv8 extension

PLV8 is a trusted Javascript language extension for PostgreSQL. It can be used for stored procedures, triggers, etc. 
PLV8 works with most versions of Postgres, but works best with 9.1 and above, including 10.0 and 11. For further details see the documentation of the plv8 extension [here](https://plv8.github.io/#plv8).

The plv8 extension is already installed on your Arc system. To install it in your your Postgres database, connect with psql and run the command:

```terminal
CREATE EXTENSION plv8;
```

As it completes successfully it will return:

```terminal
CREATE EXTENSION
```

To verify that the installation was indeed successful, run:

```terminal
SELECT plv8_version();
```

It will return

```terminal
 plv8_version
--------------
 2.3.14
(1 row)
```

Alternatively you can run

```terminal
SELECT * FROM pg_extension;
```

to list the extensions created in your Postgres instance.

## The timescaledb extension

TimescaleDB is an open-source database designed to make SQL scalable for time-series data. For further details see the documentation of the timescaledb extension [here](https://github.com/timescale/timescaledb).

The timescaledb extension is installed in your Arc system. To preload it, run the below command. Note that this command restarts your Postgres server so you should make sure to run it when you can take this short downtime:

```terminal
azdata postgres server update -n <insert your Postgres server name> --extensions timescaledb
```

After your Postgres instance is restarted, connect to it with psql for instance and create the extension:

```terminal
CREATE EXTENSION timescaledb;
```

As it is created, it will show the timescaledb welcome email in the output in your psql session:
Alternatively you can run:

```terminal
SELECT * FROM pg_extension;
```

to list the extensions that have been created in your Postgres instance.

## Next steps

Now, try to [view logs and metrics using Kibana and Grafana](monitor-grafana-kibana.md)
