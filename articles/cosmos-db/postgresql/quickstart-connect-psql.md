---
title: 'Quickstart: Connect to Azure Cosmos DB for PostgreSQL with psql'
description: See how to use Azure Cloud Shell to connect to Azure Cosmos DB for PostgreSQL by using psql.
ms.author: jonels
author: jonels-msft
recommendations: false
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: mvc, mode-ui, ignite-2022
ms.topic: quickstart
ms.date: 10/02/2023
---

# Connect to a cluster with psql - Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

This quickstart shows you how to use the [psql](https://www.postgresql.org/docs/current/app-psql.html) connection string in [Azure Cloud Shell](../../cloud-shell/overview.md) to connect to an Azure Cosmos DB for PostgreSQL cluster.

## Prerequisites

- An Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free).
- An Azure Cosmos DB for PostgreSQL cluster. To create a cluster, see [Create a cluster in the Azure portal](quickstart-create-portal.md).

## Connect

Your cluster has a default database named `citus`. To connect to the database, you use a connection string and the admin password.

1. In the Azure portal, on your cluster page, select the **Connection strings** menu item, and then copy the **psql** connection string.

   :::image type="content" source="media/quickstart-connect-psql/get-connection-string.png" alt-text="Screenshot that shows copying the psql connection string.":::

   The **psql** string is of the form `psql "host=c-<cluster>.<uniqueID>.postgres.cosmos.azure.com port=5432 dbname=citus user=citus password={your_password} sslmode=require"`. Notice that the host name starts with a `c.`, for example `c-mycluster.12345678901234.postgres.cosmos.azure.com`. This prefix indicates the coordinator node of the cluster. The default `dbname` is `citus` and can be changed only at cluster provisioning time. The `user` can be any valid [Postgres role](./how-to-configure-authentication.md#configure-native-postgresql-authentication) on your cluster.

1. Open Azure Cloud Shell by selecting the **Cloud Shell** icon on the top menu bar.

   :::image type="content" source="media/quickstart-connect-psql/open-cloud-shell.png" alt-text="Screenshot that shows the Cloud Shell icon.":::

   If prompted, choose an Azure subscription in which to store Cloud Shell data.

1. Paste your psql connection string into the shell.

1. In the connection string, replace `{your_password}` with your cluster password, and then press Enter.

   :::image type="content" source="media/quickstart-connect-psql/cloud-shell-run-psql.png" alt-text="Screenshot that shows running psql in the Cloud Shell.":::

   When psql successfully connects to the database, you see a new `citus=>` (or the custom name of your database) prompt:

   ```bash
   psql (14.2, server 14.5)
   SSL connection (protocol: TLSv1.2, cipher: ECDHE-RSA-AES256-GCM-SHA384, bits: 256, compression: off)
   Type "help" for help.
   
   citus=>
   ```

1. Run a test query. Paste the following command into the psql
   prompt, and then press Enter.

   ```sql
   SHOW server_version;
   ```

   You should see a result matching the PostgreSQL version you selected
   during cluster creation. For instance:

   ```bash
    server_version
   ----------------
    14.5
   (1 row)
   ```

## Next steps

Now that you've connected to the cluster, the next step is to create
tables and shard them for horizontal scaling.

> [!div class="nextstepaction"]
> [Create and distribute tables >](quickstart-distribute-tables.md)