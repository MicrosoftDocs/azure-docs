---
title: 'Azure Database for PostgreSQL – Hyperscale (Citus) (preview) quickstart'
description: Create and query distributed tables on Azure Database for PostgreSQL Hyperscale (Citus) (preview).
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.custom: mvc
ms.topic: quickstart
ms.date: 04/15/2019
#Customer intent: As a developer, I want provision a hyperscale server group so that I can run queries quickly on large datasets.
---

# Quickstart: Create an Azure Database for PostgreSQL - Hyperscale (Citus) (preview) in the Azure portal

> [!div class="checklist"]
> * Create a Hyperscale (Citus) server group
> * Use psql utility to create a schema
> * Shard tables across nodes
> * Ingest sample data
> * Query distributed data

Azure Database for PostgreSQL is a managed service that you use to run, manage, and scale highly available PostgreSQL databases in the cloud. This Quickstart shows you how to create an Azure Database for PostgreSQL - Hyperscale (Citus) (preview) server group using the Azure portal.

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
   > The server admin login and password that you specify here are required to log in to the server and its databases later in this quick start. Remember or record this information for later use.

5. Click **Configure server group**. Leave the settings in that section unchanged and click **Save**.
6. Click **Review + create** and then **Create** to provision the server. Provisioning takes a few minutes.
7. The page will redirect to monitor deployment. When the live status changes from **Your deployment is underway** to **Your deployment is complete**, click the **Outputs** menu item on the left of the page.
8. The outputs page will contain a coordinator hostname with a button next to it to copy the value to the clipboard. Record this information for later use.

## Configure a server-level firewall rule

The Azure Database for PostgreSQL – Hyperscale (Citus) (preview) service uses a firewall at the server-level. By default, the firewall prevents all external applications and tools from connecting to the coordinator node and any databases inside. We must add a rule to open the firewall for a specific IP address range.

1. From the **Outputs** section where you previously copied the coordinator node hostname, click back into the **Overview** menu item.

2. The name of your deployment's scaling group will be prefixed with "sg-". Find it in the list of resources and click it.

3. Click **Firewall** under **Security** in the left-hand menu.

4. Click the link **+ Add firewall rule for current client IP address**. Finally, click the **Save** button.

5. Click **Save**.

   > [!NOTE]
   > Azure PostgreSQL server communicates over port 5432. If you are trying to connect from within a corporate network, outbound traffic over port 5432 may not be allowed by your network's firewall. If so, you cannot connect to your Azure SQL Database server unless your IT department opens port 5432.
   >

## Connect to the database using psql in Cloud Shell

Let's now use the [psql](https://www.postgresql.org/docs/current/app-psql.html) command-line utility to connect to the Azure Database for PostgreSQL server.
1. Launch the Azure Cloud Shell via the terminal icon on the top navigation pane.

   ![Azure Database for PostgreSQL - Azure Cloud Shell terminal icon](./media/quickstart-create-hyperscale-portal/psql-cloud-shell.png)

2. The Azure Cloud Shell opens in your browser, enabling you to type bash commands.

   ![Azure Database for PostgreSQL - Azure Shell Bash Prompt](./media/quickstart-create-hyperscale-portal/psql-bash.png)

3. At the Cloud Shell prompt, connect to your Azure Database for PostgreSQL server using the psql commands. The following format is used to connect to an Azure Database for PostgreSQL server with the [psql](https://www.postgresql.org/docs/9.6/static/app-psql.html) utility:
   ```bash
   psql --host=<myserver> --username=myadmin --dbname=citus
   ```

   For example, the following command connects to the default database called **citus** on your PostgreSQL server **mydemoserver.postgres.database.azure.com** using access credentials. Enter your server admin password when prompted.

   ```bash
   psql --host=mydemoserver.postgres.database.azure.com --username=myadmin --dbname=citus
   ```

## Creating and distributing tables

Once connected to the hyperscale coordinator node using psql, you can complete some basic tasks.

Within Hyperscale servers there are three types of tables:

1. Distributed or sharded tables (spread out to help scaling for performance and parallelization)
2. Reference tables (multiple copies maintained)
3. Local tables (often used for internal admin tables)

In this quickstart we'll primarily focus on distributed tables and getting familiar with them.

The data model we're going to work with is simple: user and event data from GitHub. Events include fork creation, git commits related to an organization, and more.

Once you've connected via psql let's create our tables:

```sql
CREATE TABLE github_events
(
    event_id bigint,
    event_type text,
    event_public boolean,
    repo_id bigint,
    payload jsonb,
    repo jsonb,
    user_id bigint,
    org jsonb,
    created_at timestamp
);

CREATE TABLE github_users
(
    user_id bigint,
    url text,
    login text,
    avatar_url text,
    gravatar_id text,
    display_login text
);
```

The `payload` field of `github_events` has a JSONB datatype. JSONB is the JSON datatype in binary form in Postgres. This makes it easy to store a more flexible schema in a single column.

Postgres can create a `GIN` index on this type which will index every key and value within it. With a  index, it becomes fast and easy to query the payload with various conditions. Let's go ahead and create a couple of indexes before we load our data:

```sql
CREATE INDEX event_type_index ON github_events (event_type);
CREATE INDEX payload_index ON github_events USING GIN (payload jsonb_path_ops);
```

Next we’ll take those Postgres tables on the coordinator node and tell Hyperscale to shard them across the workers. To do so, we’ll run a query for each table specifying the key to shard it on. In the current example we’ll shard both the events and users table on `user_id`:

```sql
SELECT create_distributed_table('github_events', 'user_id');
SELECT create_distributed_table('github_users', 'user_id');
```

We're ready to load data. Download the two example files [users.csv](https://examples.citusdata.com/users.csv) and [events.csv](https://examples.citusdata.com/events.csv). After downloading the files, connect with psql and load the data with the `\copy` command:

```sql
\copy github_events from 'events.csv' WITH CSV
\copy github_users from 'users.csv' WITH CSV
```

## Querying

Now it's time for the fun part, actually running some queries. Let's start with a simple `count (*)` to see how much data we loaded:

```sql
SELECT count(*) from github_events;
```

That worked nicely. We'll come back to that sort of aggregation in a bit, but for now let’s look at a few other queries. Within the JSONB `payload` column there's a good bit of data, but it varies based on event type. `PushEvent` events contain a size that includes the number of distinct commits for the push. We can use it to find the total number of commits per hour:

```sql
SELECT date_trunc('hour', created_at) AS hour,
       sum((payload->>'distinct_size')::int) AS num_commits
FROM github_events
WHERE event_type = 'PushEvent'
GROUP BY hour
ORDER BY hour;
```

So far the queries have involved the github\_events exclusively, but we can combine this information with github\_users. Since we sharded both users and events on the same identifier (`user_id`), the rows of both tables with matching user IDs will be [colocated](http://docs.citusdata.com/en/stable/sharding/data_modeling.html#colocation) on the same database nodes and can easily be joined.

If we join on `user_id`, Hyperscale can push the join execution down into shards for execution in parallel on worker nodes. For example, let's find the users who created the greatest number of repositories:

```sql
SELECT login, count(*)
FROM github_events ge
JOIN github_users gu
ON ge.user_id = gu.user_id
WHERE event_type = 'CreateEvent' AND
      payload @> '{"ref_type": "repository"}'
GROUP BY login
ORDER BY count(*) DESC;
```

## Clean up resources

In the preceding steps, you created Azure resources in a server group. If you don't expect to need these resources in the future, delete the server group. Press the **Delete** button in the **Overview** page for your server group. When prompted on a pop-up page, confirm the name of the server group and click the final **Delete** button.

## Next steps

In this quickstart, you learned how to provision a Hyperscale (Citus) server group. You connected to it with psql, created a schema, and distributed data.

Next, follow a tutorial to build scalable multi-tenant applications.
> [!div class="nextstepaction"]
> [Design a Multi-Tenant Database](TODO)
