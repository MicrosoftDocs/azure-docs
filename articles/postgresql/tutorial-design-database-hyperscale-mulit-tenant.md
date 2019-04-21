---
title: 'Design a Multi-Tenant Database with Azure Database for PostgreSQL – Hyperscale (Citus) (preview) tutorial'
description: This tutorial shows how to create, populate, and query distributed tables on Azure Database for PostgreSQL Hyperscale (Citus) (preview).
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.custom: mvc
ms.devlang: azurecli
ms.topic: tutorial
ms.date: 04/09/2019
#Customer intent: As an developer, I want to design a hyperscale database so that my multi-tenant application runs efficiently for all tenants.
---

# Tutorial: Design a Multi-Tenant Database by using Azure Database for PostgreSQL – Hyperscale (Citus) (preview)

In this tutorial, you use Azure Database for PostgreSQL - Hyperscale (Citus) (preview) to learn how to:

> [!div class="checklist"]
> * Create a Hyperscale (Citus) server group
> * Use psql utility to create a schema
> * Shard tables across nodes
> * Ingest sample data
> * Query tenant data
> * Share data between tenants
> * Customize the schema per-tenant

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

   ![Azure Database for PostgreSQL - Azure Cloud Shell terminal icon](./media/tutorial-hyperscale-mt/psql-cloud-shell.png)

2. The Azure Cloud Shell opens in your browser, enabling you to type bash commands.

   ![Azure Database for PostgreSQL - Azure Shell Bash Prompt](./media/tutorial-hyperscale-mt/psql-bash.png)

3. At the Cloud Shell prompt, connect to your Azure Database for PostgreSQL server using the psql commands. The following format is used to connect to an Azure Database for PostgreSQL server with the [psql](https://www.postgresql.org/docs/9.6/static/app-psql.html) utility:
   ```bash
   psql --host=<myserver> --username=myadmin --dbname=citus
   ```

   For example, the following command connects to the default database called **citus** on your PostgreSQL server **mydemoserver.postgres.database.azure.com** using access credentials. Enter your server admin password when prompted.

   ```bash
   psql --host=mydemoserver.postgres.database.azure.com --username=myadmin --dbname=citus
   ```

## Use psql utility to create a schema

Once connected to the Azure Database for PostgreSQL - Hyperscale (Citus) (preview) using psql, you can complete some basic tasks. This tutorial walks you through creating a web app that allows advertisers to track their campaigns.

Multiple companies can use the app, so let's create a table to hold companies and another for their campaigns. In the psql console, run these commands:

```sql
CREATE TABLE companies (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  image_url text,
  created_at timestamp without time zone NOT NULL,
  updated_at timestamp without time zone NOT NULL
);

CREATE TABLE campaigns (
  id bigserial,
  company_id bigint REFERENCES companies (id),
  name text NOT NULL,
  cost_model text NOT NULL,
  state text NOT NULL,
  monthly_budget bigint,
  blacklisted_site_urls text[],
  created_at timestamp without time zone NOT NULL,
  updated_at timestamp without time zone NOT NULL,

  PRIMARY KEY (company_id, id)
);
```

Each campaign will pay to run ads. Add a table for ads too, by running the following code in psql after the code above:

```sql
CREATE TABLE ads (
  id bigserial,
  company_id bigint,
  campaign_id bigint,
  name text NOT NULL,
  image_url text,
  target_url text,
  impressions_count bigint DEFAULT 0,
  clicks_count bigint DEFAULT 0,
  created_at timestamp without time zone NOT NULL,
  updated_at timestamp without time zone NOT NULL,

  PRIMARY KEY (company_id, id),
  FOREIGN KEY (company_id, campaign_id)
    REFERENCES campaigns (company_id, id)
);
```

Finally, we'll track statistics about clicks and impressions for each ad:

```sql
CREATE TABLE clicks (
  id bigserial,
  company_id bigint,
  ad_id bigint,
  clicked_at timestamp without time zone NOT NULL,
  site_url text NOT NULL,
  cost_per_click_usd numeric(20,10),
  user_ip inet NOT NULL,
  user_data jsonb NOT NULL,

  PRIMARY KEY (company_id, id),
  FOREIGN KEY (company_id, ad_id)
    REFERENCES ads (company_id, id)
);

CREATE TABLE impressions (
  id bigserial,
  company_id bigint,
  ad_id bigint,
  seen_at timestamp without time zone NOT NULL,
  site_url text NOT NULL,
  cost_per_impression_usd numeric(20,10),
  user_ip inet NOT NULL,
  user_data jsonb NOT NULL,

  PRIMARY KEY (company_id, id),
  FOREIGN KEY (company_id, ad_id)
    REFERENCES ads (company_id, id)
);
```

You can see the newly created tables in the list of tables now in psql by running:

```postgres
\dt
```

Multi-tenant applications can enforce uniqueness only per tenant,
which is why all primary and foreign keys include the company ID.

## Shard tables across nodes

A hyperscale deployment stores table rows on different nodes based on the value of a user-designated column. This "distribution column" marks which tenant owns which rows.

Let's set the distribution column to be company\_id, the tenant
identifier. In psql, run these functions:

```sql
SELECT create_distributed_table('companies',   'id');
SELECT create_distributed_table('campaigns',   'company_id');
SELECT create_distributed_table('ads',         'company_id');
SELECT create_distributed_table('clicks',      'company_id');
SELECT create_distributed_table('impressions', 'company_id');
```

## Ingest sample data

Outside of psql now, in the normal command line, download sample data sets:

```bash
for dataset in companies campaigns ads clicks impressions geo_ips; do
  curl -O https://examples.citusdata.com/mt_ref_arch/${dataset}.csv
done
```

Back inside psql, bulk load the data. Be sure to run psql in the same directory where you downloaded the data files.

```sql
\copy companies from 'companies.csv' with csv
\copy campaigns from 'campaigns.csv' with csv
\copy ads from 'ads.csv' with csv
\copy clicks from 'clicks.csv' with csv
\copy impressions from 'impressions.csv' with csv
```

This data will now be spread across worker nodes.

## Query tenant data

When the application requests data for a single tenant, the database
can execute the query on a single worker node. Single-tenant queries
filter by a single tenant ID. For example, the following query
filters `company_id = 5` for ads and impressions. Try running it in
psql to see the results.

```sql
SELECT a.campaign_id,
       RANK() OVER (
         PARTITION BY a.campaign_id
         ORDER BY a.campaign_id, count(*) desc
       ), count(*) as n_impressions, a.id
  FROM ads as a
  JOIN impressions as i
    ON i.company_id = a.company_id
   AND i.ad_id      = a.id
 WHERE a.company_id = 5
GROUP BY a.campaign_id, a.id
ORDER BY a.campaign_id, n_impressions desc;
```

## Share data between tenants

Until now all tables have been distributed by `company_id`, but
some data doesn't naturally "belong" to any tenant in particular,
and can be shared. For instance, all companies in the example ad
platform might want to get geographical information for their
audience based on IP addresses.

Create a table to hold shared geographic information. Run this in psql:

```sql
CREATE TABLE geo_ips (
  addrs cidr NOT NULL PRIMARY KEY,
  latlon point NOT NULL
    CHECK (-90  <= latlon[0] AND latlon[0] <= 90 AND
           -180 <= latlon[1] AND latlon[1] <= 180)
);
CREATE INDEX ON geo_ips USING gist (addrs inet_ops);
```

Next make `geo_ips` a "reference table" to store a copy of the
table on every worker node.

```sql
SELECT create_reference_table('geo_ips');
```

Load it with example data. Remember to run this in psql from inside the directory where you downloaded the dataset.

```sql
\copy geo_ips from 'geo_ips.csv' with csv
```

Joining the clicks table with geo\_ips is efficient on all nodes.
Here is a join to find the locations of everyone who clicked on ad
290. Try running the query in psql.

```sql
SELECT c.id, clicked_at, latlon
  FROM geo_ips, clicks c
 WHERE addrs >> c.user_ip
   AND c.company_id = 5
   AND c.ad_id = 290;
```

## Customize the schema per-tenant

Each tenant may need to store special information not needed by
others. However, all tenants share a common infrastructure with
an identical database schema. Where can the extra data go?

One trick is to use an open-ended column type like PostgreSQL's
JSONB.  Our schema has a JSONB field in `clicks` called `user_data`.
A company (say company five), can use the column to track whether
the user is on a mobile device.

Here's a query to find who clicks more: mobile, or traditional
visitors.

```sql
SELECT
  user_data->>'is_mobile' AS is_mobile,
  count(*) AS count
FROM clicks
WHERE company_id = 5
GROUP BY user_data->>'is_mobile'
ORDER BY count DESC;
```

We can optimize this query for a single company by creating a
[partial
index](https://www.postgresql.org/docs/current/static/indexes-partial.html).

```sql
CREATE INDEX click_user_data_is_mobile
ON clicks ((user_data->>'is_mobile'))
WHERE company_id = 5;
```

More generally, we can create a [GIN
indices](https://www.postgresql.org/docs/current/static/gin-intro.html) on
every key and value within the column.

```sql
CREATE INDEX click_user_data
ON clicks USING gin (user_data);

-- this speeds up queries like, "which clicks have
-- the is_mobile key present in user_data?"

SELECT id
  FROM clicks
 WHERE user_data ? 'is_mobile'
   AND company_id = 5;
```

## Clean up resources

In the preceding steps, you created Azure resources in a server group. If you don't expect to need these resources in the future, delete the server group. Press the *Delete* button in the *Overview* page for your server group. When prompted on a pop-up page, confirm the name of the server group and click the final *Delete* button.

## Next steps

In this tutorial, you learned how to provision a Hyperscale (Citus) server group. You connected to it with psql, created a schema, and distributed data. You learned to query data both within and between tenants, and to customize the schema per tenant.

Next, learn about the concepts of hyperscale.
> [!div class="nextstepaction"]
> [Hyperscale node types](https://aka.ms/hyperscale-concepts)