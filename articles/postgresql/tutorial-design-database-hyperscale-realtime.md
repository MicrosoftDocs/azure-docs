---
title: 'Design a real-time dashboard with Azure Database for PostgreSQL – Hyperscale (Citus) (preview) tutorial'
description: This tutorial shows how to create, populate, and query distributed tables on Azure Database for PostgreSQL Hyperscale (Citus) (preview).
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.custom: mvc
ms.topic: tutorial
ms.date: 05/06/2019
#Customer intent: As a developer, I want to parallelize queries so that I can make a realtime dashboard application.
---

# Tutorial: Design a real-time analytics dashboard by using Azure Database for PostgreSQL – Hyperscale (Citus) (preview)

In this tutorial, you use Azure Database for PostgreSQL - Hyperscale (Citus) (preview) to learn how to:

> [!div class="checklist"]
> * Create a Hyperscale (Citus) server group
> * Use psql utility to create a schema
> * Shard tables across nodes
> * Generate sample data
> * Perform rollups
> * Query raw and aggregated data
> * Expire data

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com).

## Create an Azure Database for PostgreSQL

Follow these steps to create an Azure Database for PostgreSQL server:
1. Click **Create a resource**  in the upper left-hand corner of the Azure portal.
2. Select **Databases** from the **New** page, and select **Azure Database for PostgreSQL** from the **Databases** page.
3. For the deployment option, click the **Create** button under **Hyperscale (Citus) server group - PREVIEW.**
4. Fill out the new server details form with the following information:
   - Resource group: click the **Create new** link below the text box for this field. Enter a name such as **myresourcegroup**.
   - Server group name: **mydemoserver** (name of a server, which maps to DNS name, and is required to be globally unique).
   - Admin username: **myadmin** (it will be used later to connect to the database).
   - Password: must be at least eight characters in length and must contain characters from three of the following categories – English uppercase letters, English lowercase letters, numbers (0-9), and non-alphanumeric characters (!, $, #, %, etc.)
   - Location: use the location that is closest to your users to give them the fastest access to the data.

   > [!IMPORTANT]
   > The server admin login and password that you specify here are required to log in to the server and its databases later in this tutorial. Remember or record this information for later use.

5. Click **Configure server group**. Leave the settings in that section unchanged and click **Save**.
6. Click **Review + create** and then **Create** to provision the server. Provisioning takes a few minutes.
7. The page will redirect to monitor deployment. When the live status changes from **Your deployment is underway** to **Your deployment is complete**, click the **Outputs** menu item on the left of the page.
8. The outputs page will contain a coordinator hostname with a button next to it to copy the value to the clipboard. Record this information for later use.

## Configure a server-level firewall rule

The Azure Database for PostgreSQL service uses a firewall at the server-level. By default, the firewall prevents all external applications and tools from connecting to the server and any databases on the server. We must add a rule to open the firewall for a specific IP address range.

1. From the **Outputs** section where you previously copied the coordinator node hostname, click back into the **Overview** menu item.

2. Find the scaling group for your deployment in the list of resources and click it. (Its name will be prefixed with "sg-".)

3. Click **Firewall** under **Security** in the left-hand menu.

4. Click the link **+ Add firewall rule for current client IP address**. Finally, click the **Save** button.

5. Click **Save**.

   > [!NOTE]
   > Azure PostgreSQL server communicates over port 5432. If you are trying to connect from within a corporate network, outbound traffic over port 5432 may not be allowed by your network's firewall. If so, you cannot connect to your Azure SQL Database server unless your IT department opens port 5432.
   >

## Connect to the database using psql in Cloud Shell

Let's now use the [psql](https://www.postgresql.org/docs/current/app-psql.html) command-line utility to connect to the Azure Database for PostgreSQL server.
1. Launch the Azure Cloud Shell via the terminal icon on the top navigation pane.

   ![Azure Database for PostgreSQL - Azure Cloud Shell terminal icon](./media/tutorial-design-database-hyperscale-realtime/psql-cloud-shell.png)

2. The Azure Cloud Shell opens in your browser, enabling you to type bash commands.

   ![Azure Database for PostgreSQL - Azure Shell Bash Prompt](./media/tutorial-design-database-hyperscale-realtime/psql-bash.png)

3. At the Cloud Shell prompt, connect to your Azure Database for PostgreSQL server using the psql commands. The following format is used to connect to an Azure Database for PostgreSQL server with the [psql](https://www.postgresql.org/docs/9.6/static/app-psql.html) utility:
   ```bash
   psql --host=<myserver> --username=myadmin --dbname=citus
   ```

   For example, the following command connects to the default database called **citus** on your PostgreSQL server **mydemoserver.postgres.database.azure.com** using access credentials. Enter your server admin password when prompted.

   ```bash
   psql --host=mydemoserver.postgres.database.azure.com --username=myadmin --dbname=citus
   ```

## Use psql utility to create a schema

Once connected to the Azure Database for PostgreSQL - Hyperscale (Citus) (preview) using psql, you can complete some basic tasks. This tutorial walks you through ingesting traffic data from web analytics, then rolling up the data to provide real-time dashboards based on that data.

Let's create a table that will consume all of our raw web traffic data. Run the following commands in the psql terminal:

```sql
CREATE TABLE http_request (
  site_id INT,
  ingest_time TIMESTAMPTZ DEFAULT now(),

  url TEXT,
  request_country TEXT,
  ip_address TEXT,

  status_code INT,
  response_time_msec INT
);
```

We're also going to create a table that will hold our per-minute aggregates, and a table that maintains the position of our last rollup. Run the following in psql as well:

```sql
CREATE TABLE http_request_1min (
  site_id INT,
  ingest_time TIMESTAMPTZ, -- which minute this row represents

  error_count INT,
  success_count INT,
  request_count INT,
  average_response_time_msec INT,
  CHECK (request_count = error_count + success_count),
  CHECK (ingest_time = date_trunc('minute', ingest_time))
);

CREATE INDEX http_request_1min_idx ON http_request_1min (site_id, ingest_time);

CREATE TABLE latest_rollup (
  minute timestamptz PRIMARY KEY,

  CHECK (minute = date_trunc('minute', minute))
);
```

You can see the newly created tables in the list of tables now with this psql command:

```postgres
\dt
```

## Shard tables across nodes

A hyperscale deployment stores table rows on different nodes based on the value of a user-designated column. This "distribution column" marks how data is sharded across nodes.

Let's set the distribution column to be site\_id, the shard
key. In psql, run these functions:

  ```sql
SELECT create_distributed_table('http_request',      'site_id');
SELECT create_distributed_table('http_request_1min', 'site_id');
```

## Generate sample data

Now our server group should be ready to ingest some data. We can run the
following locally from our `psql` connection to continuously insert data.

```sql
DO $$
  BEGIN LOOP
    INSERT INTO http_request (
      site_id, ingest_time, url, request_country,
      ip_address, status_code, response_time_msec
    ) VALUES (
      trunc(random()*32), clock_timestamp(),
      concat('http://example.com/', md5(random()::text)),
      ('{China,India,USA,Indonesia}'::text[])[ceil(random()*4)],
      concat(
        trunc(random()*250 + 2), '.',
        trunc(random()*250 + 2), '.',
        trunc(random()*250 + 2), '.',
        trunc(random()*250 + 2)
      )::inet,
      ('{200,404}'::int[])[ceil(random()*2)],
      5+trunc(random()*150)
    );
    PERFORM pg_sleep(random() * 0.25);
  END LOOP;
END $$;
```

The query adds a row approximately every quarter second. The rows are stored on different worker nodes as directed by the distribution column, `site_id`.

   > [!NOTE]
   > Leave the data generation query running, and open a second psql
   > connection for the remaining commands in this tutorial.
   >

## Query

The hyperscale hosting option allows multiple nodes to process queries in
parallel for speed. For instance, the database calculates aggregates like SUM
and COUNT on worker nodes, and combines the results into a final answer.

Here's a query to count web requests per minute along with a few statistics.
Try running it in psql and observe the results.

```sql
SELECT
  site_id,
  date_trunc('minute', ingest_time) as minute,
  COUNT(1) AS request_count,
  SUM(CASE WHEN (status_code between 200 and 299) THEN 1 ELSE 0 END) as success_count,
  SUM(CASE WHEN (status_code between 200 and 299) THEN 0 ELSE 1 END) as error_count,
  SUM(response_time_msec) / COUNT(1) AS average_response_time_msec
FROM http_request
WHERE date_trunc('minute', ingest_time) > now() - '5 minutes'::interval
GROUP BY site_id, minute
ORDER BY minute ASC;
```

## Performing rollups

The above query works fine in the early stages, but its performance
will decrease as your data scales. Even with distributed processing
it's faster to pre-compute this data than recalculate it repeatedly.

We can ensure our dashboard stays fast by regularly rolling up the
raw data into an aggregate table. In this case we will roll up into
our one minute aggregation table, but you could also have aggregations
of 5 minutes, 15 minutes, one hour, and so on.

Because we will continually run this roll-up we're going to create
a function to perform it. Run these commands in psql to create the
`rollup_http_request` function.

```sql
-- initialize to a time long ago
INSERT INTO latest_rollup VALUES ('10-10-1901');

-- function to do the rollup
CREATE OR REPLACE FUNCTION rollup_http_request() RETURNS void AS $$
DECLARE
  curr_rollup_time timestamptz := date_trunc('minute', now());
  last_rollup_time timestamptz := minute from latest_rollup;
BEGIN
  INSERT INTO http_request_1min (
    site_id, ingest_time, request_count,
    success_count, error_count, average_response_time_msec
  ) SELECT
    site_id,
    date_trunc('minute', ingest_time),
    COUNT(1) as request_count,
    SUM(CASE WHEN (status_code between 200 and 299) THEN 1 ELSE 0 END) as success_count,
    SUM(CASE WHEN (status_code between 200 and 299) THEN 0 ELSE 1 END) as error_count,
    SUM(response_time_msec) / COUNT(1) AS average_response_time_msec
  FROM http_request
  -- roll up only data new since last_rollup_time
  WHERE date_trunc('minute', ingest_time) <@
          tstzrange(last_rollup_time, curr_rollup_time, '(]')
  GROUP BY 1, 2;

  -- update the value in latest_rollup so that next time we run the
  -- rollup it will operate on data newer than curr_rollup_time
  UPDATE latest_rollup SET minute = curr_rollup_time;
END;
$$ LANGUAGE plpgsql;
```

With our function in place, execute it to roll up the data:

```sql
SELECT rollup_http_request();
```

And with our data in a pre-aggregated form we can query the rollup
table to get the same report as earlier. Run the following:

```sql
SELECT site_id, ingest_time as minute, request_count,
       success_count, error_count, average_response_time_msec
  FROM http_request_1min
 WHERE ingest_time > date_trunc('minute', now()) - '5 minutes'::interval;
 ```

## Expiring old data

The rollups make queries faster, but we still need to expire old data to avoid unbounded storage costs. Simply decide how long you’d like to keep data for each granularity, and use standard queries to delete expired data. In the following example, we decided to keep raw data for one day, and per-minute aggregations for one month:

```sql
DELETE FROM http_request WHERE ingest_time < now() - interval '1 day';
DELETE FROM http_request_1min WHERE ingest_time < now() - interval '1 month';
```

In production you could wrap these queries in a function and call it every minute in a cron job.

## Clean up resources

In the preceding steps, you created Azure resources in a server group. If you don't expect to need these resources in the future, delete the server group. Press the *Delete* button in the *Overview* page for your server group. When prompted on a pop-up page, confirm the name of the server group and click the final *Delete* button.

## Next steps

In this tutorial, you learned how to provision a Hyperscale (Citus) server group. You connected to it with psql, created a schema, and distributed data. You learned to query data both in the raw form, regularly aggregate that data, query the aggregated tables, and expire old data.

Next, learn about the concepts of hyperscale.
> [!div class="nextstepaction"]
> [Hyperscale node types](https://aka.ms/hyperscale-concepts)