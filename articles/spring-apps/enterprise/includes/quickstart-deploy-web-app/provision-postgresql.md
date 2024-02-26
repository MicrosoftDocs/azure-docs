---
author: KarlErickson
ms.author: xiada
ms.service: spring-apps
ms.topic: include
ms.date: 08/31/2023
---

<!--
For clarity of structure, a separate markdown file is used to describe how to provision PostgreSQL database.

[!INCLUDE [provision-postgresql-flexible](includes/quickstart-deploy-web-app/provision-postgresql.md)]

-->

Use the following steps to create an Azure Database for PostgreSQL server:

1. In the Azure portal, select **Create a resource**.

1. Select **Databases** > **Azure Database for PostgreSQL Flexible Server**.

   :::image type="content" source="../../media/quickstart-deploy-web-app/postgresql-create-flexible-server.png" alt-text="Screenshot of the Azure portal that shows the Create a resource page with Azure Database for PostgreSQL highlighted." lightbox="../../media/quickstart-deploy-web-app/postgresql-create-flexible-server.png":::

1. Fill out the **Basics** tab with the following information:

   - **Server name**: *my-demo-pgsql*
   - **Region**: **East US**
   - **PostgreSQL version**: *14*
   - **Workload type**: **Development**
   - **Enable high availability**: unselected
   - **Authentication method**: **PostgreSQL authentication only**
   - **Admin username**: *myadmin*
   - **Password** and **Confirm password**: Enter a password.

   :::image type="content" source="../../media/quickstart-deploy-web-app/postgresql-create-server-basics.png" alt-text="Screenshot of the Azure portal that shows the Server details page." lightbox="../../media/quickstart-deploy-web-app/postgresql-create-server-basics.png":::

1. Configure the **Networking** tab using the following information:

   - **Connectivity method**: **Public access (allowed IP addresses)**
   - **Allow public access from any Azure service within Azure to this server**: selected

   :::image type="content" source="../../media/quickstart-deploy-web-app/postgresql-create-server-networking.png" alt-text="Screenshot of the Azure portal that shows the Networking tab." lightbox="../../media/quickstart-deploy-web-app/postgresql-create-server-networking.png":::

1. Select **Review + create** to review your selections, then select **Create** to provision the server. This operation might take a few minutes.

1. Go to your PostgreSQL server in the Azure portal.

1. Select **Databases** from the navigation menu to create a database - for example, *Todo*.

   :::image type="content" source="../../media/quickstart-deploy-web-app/postgresql-create-database.png" alt-text="Screenshot of the Azure portal that shows the Databases page with the Create Database pane open." lightbox="../../media/quickstart-deploy-web-app/postgresql-create-database.png":::
