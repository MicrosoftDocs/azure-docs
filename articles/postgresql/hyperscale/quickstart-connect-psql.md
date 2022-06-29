---
title: 'Quickstart: connect to a server group with psql - Hyperscale (Citus) - Azure Database for PostgreSQL'
description: Quickstart to connect psql to Azure Database for PostgreSQL - Hyperscale (Citus).
ms.author: jonels
author: jonels-msft
recommendations: false
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.custom: mvc, mode-ui
ms.topic: quickstart
ms.date: 05/05/2022
---

# Connect to a Hyperscale (Citus) server group with psql

[!INCLUDE[applies-to-postgresql-hyperscale](../includes/applies-to-postgresql-hyperscale.md)]

## Prerequisites

To follow this quickstart, you'll first need to:

* [Create a server group](quickstart-create-portal.md) in the Azure portal.

## Connect

When you create your Hyperscale (Citus) server group, a default database named **citus** is created. To connect to your database server, you need a connection string and the admin password.

1. Obtain the connection string. In the server group page, select the
   **Connection strings** menu item.

   ![get connection string](../media/quickstart-connect-psql/get-connection-string.png)

   Find the string marked **psql**. It will be of the form, `psql
   "host=c.servergroup.postgres.database.azure.com port=5432 dbname=citus
   user=citus password={your_password} sslmode=require"`

   * Copy the string.
   * Replace "{your\_password}" with the administrative password you chose earlier.
   * Notice the hostname starts with a `c.`, for instance
     `c.demo.postgres.database.azure.com`. This prefix indicates the
     coordinator node of the server group.
   * The default dbname and username is `citus` and can't be changed.

2. Open the Azure Cloud Shell. Select the **Cloud Shell** icon in the Azure portal.

   ![cloud shell icon](../media/quickstart-connect-psql/open-cloud-shell.png)

   If prompted, choose an Azure subscription in which to store Cloud Shell data.

3. In the shell, paste the psql connection string, *substituting your password
   for the string `{your_password}`*, then press enter. For example:

   ![run psql in cloud
   shell](../media/quickstart-connect-psql/cloud-shell-run-psql.png)

   When psql successfully connects to the database, you'll see a new prompt:

   ```
   psql (14.2 (Debian 14.2-1.pgdg100+1))
   SSL connection (protocol: TLSv1.2, cipher: ECDHE-RSA-AES256-GCM-SHA384, bits: 256, compression: off)
   Type "help" for help.
   
   citus=>
   ```

4. Run a test query. Copy the following command and paste it into the psql
   prompt, then press enter to run:

   ```sql
   SHOW server_version;
   ```

   You should see a result matching the PostgreSQL version you selected
   during server group creation. For instance:

   ```
    server_version
   ----------------
    14.2
   (1 row)
   ```

## Next steps

Now that you've connected to the server group, the next step is to create
tables and shard them for horizontal scaling.

> [!div class="nextstepaction"]
> [Create and distribute tables >](quickstart-distribute-tables.md)
