---
title: Connect to server - Hyperscale (Citus) - Azure Database for PostgreSQL
description: Learn how to connect to and query a Hyperscale (Citus) server group
ms.author: jonels
author: jonels-msft
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: how-to
ms.date: 05/25/2022
---

# Connect to a server group

Choose your database client below to learn how to configure it to connect to
Hyperscale (Citus).

# [pgAdmin](#tab/pgadmin)

[pgAdmin](https://www.pgadmin.org/) is a popular and feature-rich open source
administration and development platform for PostgreSQL.

1. [Download](https://www.pgadmin.org/download/) and install pgAdmin.

2. Open the pgAdmin application on your client computer. From the Dashboard,
   select **Add New Server**.

   ![pgAdmin dashboard](../media/howto-hyperscale-connect/pgadmin-dashboard.png)

3. Choose a **Name** in the General tab. Any name will work.

   ![pgAdmin general connection settings](../media/howto-hyperscale-connect/pgadmin-general.png)

4. Enter connection details in the Connection tab.

   ![pgAdmin db connection settings](../media/howto-hyperscale-ssl/pgadmin-connection.png)

   Customize the following fields:

   * **Host name/address**: Obtain this value from the **Overview** page for your
     server group in the Azure portal. It's listed there as **Coordinator name**.
     It will be of the form, `c.servergroup.postgres.database.azure.com`.
   * **Maintenance database**: use the value `citus`.
   * **Username**: use the value `citus`.
   * **Password**: the connection password.
   * **Save password**: enable if desired.

5. In the SSL tab, set **SSL mode** to **Require**.

   ![pgAdmin ssl settings](../media/howto-hyperscale-connect/pgadmin-connection.png)

6. Select **Save** to save and connect to the database.

# [psql](#tab/psql)

The [psql utility](https://www.postgresql.org/docs/current/app-psql.html) is a
terminal-based front-end to PostgreSQL. It enables you to type in queries
interactively, issue them to PostgreSQL, and see the query results.

1. Install psql. It's included with a [PostgreSQL
   installation](https://www.postgresql.org/docs/current/tutorial-install.html),
   or available separately in package managers for several operating systems.

2. Obtain the connection string. In the server group page, select the
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

3. In a local terminal prompt, paste the psql connection string, *substituting
   your password for the string `{your_password}`*, then press enter.

---

**Next steps**

* Now that you can connect to the database, learn how to [build scalable
  apps](howto-build-scalable-apps-overview.md).
* [Verify TLS](howto-ssl-connection-security.md) certificates in your
  connections.