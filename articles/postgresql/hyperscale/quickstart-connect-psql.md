---
title: 'Quickstart: connect to a server group with psql - Hyperscale (Citus) - Azure Database for PostgreSQL'
description: Quickstart to connect psql to Azure Database for PostgreSQL - Hyperscale (Citus).
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.custom: mvc, mode-ui
ms.topic: quickstart
ms.date: 01/24/2022
---

# Connect to a Hyperscale (Citus) server group with psql

## Prerequisites

To follow this quickstart, you'll first need to:

* [Create a server group](quickstart-create-portal.md) in the Azure portal.

## Connect

When you create your Azure Database for PostgreSQL server, a default database named **citus** is created. To connect to your database server, you need a connection string and the admin password.

1. Obtain the connection string. In the server group page, select the **Connection strings** menu item. (It's under **Settings**.) Find the string marked **psql**. It will be of the form, `psql "host=hostname.postgres.database.azure.com port=5432 dbname=citus user=citus password={your_password} sslmode=require"`

   Copy the string. You’ll need to replace "{your\_password}" with the administrative password you chose earlier. The system doesn't store your plaintext password and so can't display it for you in the connection string.

2. Open a terminal window on your local computer.

3. At the prompt, connect to your Azure Database for PostgreSQL server with the [psql](https://www.postgresql.org/docs/current/app-psql.html) utility. Pass your connection string in quotes, being sure it contains your password:
   ```bash
   psql "host=..."
   ```

   For example, the following command connects to the coordinator node of the server group **mydemoserver**:

   ```bash
   psql "host=mydemoserver-c.postgres.database.azure.com port=5432 dbname=citus user=citus password={your_password} sslmode=require"
   ```

## Next steps

* [Troubleshoot connection problems](howto-troubleshoot-common-connection-issues.md).
* Learn to [create and distribute tables](quickstart-distribute-tables.md).
