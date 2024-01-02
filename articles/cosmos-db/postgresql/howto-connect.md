---
title: Connect to server - Azure Cosmos DB for PostgreSQL
description: See how to connect to and query an Azure Cosmos DB for PostgreSQL cluster.
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 06/05/2023
---

# Connect to a cluster in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

Choose one of the following database clients to see how to configure it to connect to
an Azure Cosmos DB for PostgreSQL cluster.

# [pgAdmin](#tab/pgadmin)

[pgAdmin](https://www.pgadmin.org/) is a popular and feature-rich open source
administration and development platform for PostgreSQL.

1. [Download](https://www.pgadmin.org/download/) and install pgAdmin.

1. Open the pgAdmin application on your client computer. From the Dashboard,
   select **Add New Server**.

   :::image type="content" source="media/howto-connect/pgadmin-dashboard.png" alt-text="Screenshot that shows the pgAdmin dashboard.":::

1. Choose a **Name** in the General tab. Any name will work.

   :::image type="content" source="media/howto-connect/pgadmin-general.png" alt-text="Screenshot that shows the pgAdmin general connection settings.":::

1. Enter connection details in the Connection tab.

   :::image type="content" source="media/howto-connect/pgadmin-connection.png" alt-text="Screenshot that shows the pgAdmin connection settings.":::

   Customize the following fields:

   * **Host name/address**: Obtain this value from the **Overview** page for your
     cluster in the Azure portal. It's listed there as **Coordinator name**.
     It will be of the form, `c-<clustername>.12345678901234.postgres.cosmos.azure.com`.
   * **Maintenance database**: use the value `citus`.
   * **Username**: use the value `citus`.
   * **Password**: the connection password.
   * **Save password**: enable if desired.

1. In the SSL tab, set **SSL mode** to **Require**.

   :::image type="content" source="media/howto-connect/pgadmin-ssl.png" alt-text="Screenshot that shows the pgAdmin SSL settings.":::

1. Select **Save** to save and connect to the database.

# [psql](#tab/psql)

The [psql utility](https://www.postgresql.org/docs/current/app-psql.html) is a
terminal-based front-end to PostgreSQL. It enables you to type in queries
interactively, issue them to PostgreSQL, and see the query results.

1. Install psql. It's included with a [PostgreSQL
   installation](https://www.postgresql.org/docs/current/tutorial-install.html),
   or available separately in package managers for several operating systems.

1. In the Azure portal, on the cluster page, select the **Connection strings** menu item, and then copy the **psql** connection string.

   :::image type="content" source="media/quickstart-connect-psql/get-connection-string.png" alt-text="Screenshot that shows copying the psql connection string.":::

   The **psql** string is of the form `psql "host=c-<clustername>.<uniqueID>.postgres.cosmos.azure.com port=5432 dbname=citus user=citus password=<your_password> sslmode=require"`. Notice that the host name starts with a `c-`, for example `c-demo.12345678901234.postgres.cosmos.azure.com`. This prefix indicates the coordinator node of the cluster. The default `dbname` and `username` are `citus` and can't be changed.

1. In the connection string you copied, replace `<your_password>` with your administrative password.

1. In a local terminal prompt, paste the psql connection string, and then press Enter.

---

## Next steps

* Troubleshoot [connection issues](howto-troubleshoot-common-connection-issues.md).
* [Verify TLS](howto-ssl-connection-security.md) certificates in your
  connections.
* Now that you can connect to the database, learn how to [build scalable
  apps](quickstart-build-scalable-apps-overview.md).
