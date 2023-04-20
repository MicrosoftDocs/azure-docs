---
title: 'Quickstart: Create server - Azure portal - Azure Database for PostgreSQL - single server'
description: In this quickstart guide, you'll create and manage an Azure Database for PostgreSQL server by using the Azure portal.
ms.service: postgresql
ms.subservice: single-server
ms.topic: quickstart
ms.author: sunila
author: sunilagarwal
ms.custom: mvc, mode-ui
ms.date: 06/24/2022
---

# Quickstart: Create an Azure Database for PostgreSQL server by using the Azure portal

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

Azure Database for PostgreSQL is a managed service that you use to run, manage, and scale highly available PostgreSQL databases in the cloud. This quickstart shows you how to create a single Azure Database for PostgreSQL server and connect to it.

## Prerequisites

An Azure subscription is required. If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

## Create an Azure Database for PostgreSQL server

Go to the [Azure portal](https://portal.azure.com/) to create an Azure Database for PostgreSQL Single Server database. Search for and select *Azure Database for PostgreSQL servers*.

>[!div class="mx-imgBorder"]
> :::image type="content" source="./media/quickstart-create-database-portal/search-postgres.png" alt-text="Find Azure Database for PostgreSQL.":::

1. Select **Add**.  mark is showing me how to make a change

2. On the Create a Azure Database for PostgreSQL page , select  **Single server**.

    >[!div class="mx-imgBorder"]
    > :::image type="content" source="./media/quickstart-create-database-portal/select-single-server.png" alt-text="Select single server":::

3. Now enter the **Basics** form with the following information.

   > [!div class="mx-imgBorder"]
   > :::image type="content" source="./media/quickstart-create-database-portal/create-basics.png" alt-text="Screenshot that shows the Basics tab for creating a single server.":::

   |Setting|Suggested value|Description|
   |:---|:---|:---|
   |Subscription|your subscription name|select the desired Azure Subscription.|
   |Resource group|*myresourcegroup*| A new or an existing resource group from your subscription.|
   |Server name |*mydemoserver*|A unique name that identifies your Azure Database for PostgreSQL server. The domain name *postgres.database.azure.com* is appended to the server name that you provide. The server can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain 3 to 63 characters.|
   |Data source | None | Select **None** to create a new server from scratch. Select **Backup** only if you were restoring from a geo-backup of an existing server.|
   |Admin username |*myadmin*| Enter your server admin username. It can't start with **pg_** and these values are not allowed: **azure_superuser**, **azure_pg_admin**, **admin**, **administrator**, **root**, **guest**, or **public**.|
   |Password |your password| A new password for the server admin user. It must contain 8 to 128 characters from three of the following categories: English uppercase letters, English lowercase letters, numbers (0 through 9), and non-alphanumeric characters (for example, !, $, #, %).|
   |Location|your desired location| Select a location from the dropdown list.|
   |Version|The latest major version| The latest PostgreSQL major version, unless you have specific requirements otherwise.|
   |Compute + storage | *use the defaults*| The default pricing tier is **General Purpose**  with **4 vCores** and **100 GB** storage. Backup retention is set to **7 days** with **Geographically Redundant** backup option.<br/>Learn about the [pricing](https://azure.microsoft.com/pricing/details/postgresql/server/) and update the defaults if needed.|

   > [!NOTE]
   > Consider using the Basic pricing tier if light compute and I/O are adequate for your workload. Note that servers created in the Basic pricing tier can't later be scaled to General Purpose or Memory Optimized.

5. Select **Review + create** to review your selections. Select **Create** to provision the server. This operation might take a few minutes.
    > [!NOTE]
    > An empty database, **postgres**, is created. You'll also find an **azure_maintenance** database that's used to separate the managed service processes from user actions. You can't access the **azure_maintenance** database.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/quickstart-create-database-portal/deployment-success.png" alt-text="success deployment.":::

[Having issues? Let us know.](https://aka.ms/postgres-doc-feedback)

## Configure a firewall rule

By default, the server that you create is not publicly accessible. You need to give permissions to your IP address. Go to your server resource in the Azure portal and select **Connection security** from left-side menu for your server resource. If you're not sure how to find your resource, see [Open resources](../../azure-resource-manager/management/manage-resources-portal.md#open-resources).

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/quickstart-create-database-portal/add-current-ip-firewall.png" alt-text="Screenshot that shows firewall rules for connection security.":::

Select **Add current client IP address**, and then select **Save**. You can add more IP addresses or provide an IP range to connect to your server from those IP addresses. For more information, see [Firewall rules in Azure Database for PostgreSQL](./concepts-firewall-rules.md).

> [!NOTE]
> To avoid connectivity issues, check if your network allows outbound traffic over port 5432. Azure Database for PostgreSQL uses that port.

[Having issues? Let us know.](https://aka.ms/postgres-doc-feedback)

## Connect to the server with psql

You can use [psql](http://postgresguide.com/utilities/psql.html) or [pgAdmin](https://www.pgadmin.org/docs/pgadmin4/latest/connecting.html), which are popular PostgreSQL clients. For this quickstart, we'll connect by using psql in [Azure Cloud Shell](../../cloud-shell/overview.md) within the Azure portal.

1. Make a note of your server name, server admin login name, password, and subscription ID for your newly created server from the **Overview** section of your server.
    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/quickstart-create-database-portal/overview-new.png" alt-text="get connection information.":::

2. Open Azure Cloud Shell in the portal by selecting the icon on the upper-left side.

   > [!NOTE]
   > If you're opening Cloud Shell for the first time, you'll see a prompt to create a resource group and a storage account. This is a one-time step and will be automatically attached for all sessions.

   > [!div class="mx-imgBorder"]
   > :::image type="content" source="media/quickstart-create-database-portal/use-in-cloud-shell.png" alt-text="Screenshot that shows server information and the icon for opening Azure Cloud Shell.":::

3. Run the following command in the Azure Cloud Shell terminal. Replace values with your actual server name and admin user login name. Use the empty database **postgres** with admin user in this format: `<admin-username>@<servername>`.

   ```azurecli-interactive
   psql --host=mydemoserver.postgres.database.azure.com --port=5432 --username=myadmin@mydemoserver --dbname=postgres
   ```

   Here's how the experience looks in the Cloud Shell terminal:

   ```bash
    Requesting a Cloud Shell.Succeeded.
    Connecting terminal...

    Welcome to Azure Cloud Shell

    Type "az" to use Azure CLI
    Type "help" to learn about Cloud Shell

    user@Azure:~$psql --host=mydemoserver.postgres.database.azure.com --port=5432 --username=myadmin@mydemoserver --dbname=postgres
    Password for user myadmin@mydemoserver.postgres.database.azure.com:
    psql (12.2 (Ubuntu 12.2-2.pgdg16.04+1), server 11.6)
    SSL connection (protocol: TLSv1.2, cipher: ECDHE-RSA-AES256-GCM-SHA384, bits: 256, compression: off)
    Type "help" for help.

    postgres=>
    ```
4. In the same Azure Cloud Shell terminal, create a database called **guest**.

   ```bash
   postgres=> CREATE DATABASE guest;
   ```

5. Switch connections to the newly created **guest** database.

   ```bash
   \c guest
   ```
6. Type `\q`, and then select the Enter key to close psql.

[Having issues? Let us know.](https://aka.ms/postgres-doc-feedback)

## Clean up resources

You've successfully created an Azure Database for PostgreSQL server in a resource group. If you don't expect to need these resources in the future, you can delete them by deleting either the resource group or the PostgreSQL server.

To delete the resource group:

1. In the Azure portal, search for and select **Resource groups**.
2. In the resource group list, choose the name of your resource group.
3. On the **Overview** page of your resource group, select **Delete resource group**.
4. In the confirmation dialog box, enter the name of your resource group, and then select **Delete**.

To delete the server, select the **Delete** button on the **Overview** page of your server:

> [!div class="mx-imgBorder"]
> :::image type="content" source="media/quickstart-create-database-portal/12-delete.png" alt-text="Screenshot that shows the button for deleting a server.":::

[Having issues? Let us know.](https://aka.ms/postgres-doc-feedback)

## Next steps

> [!div class="nextstepaction"]
> [Migrate your database using export and import](./how-to-migrate-using-export-and-import.md) <br/>

> [!div class="nextstepaction"]
> [Design a database](./tutorial-design-database-using-azure-portal.md#create-tables-in-the-database)

[Cannot find what you are looking for? Let us know.](https://aka.ms/postgres-doc-feedback)
