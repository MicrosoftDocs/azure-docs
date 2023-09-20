---
author: KarlErickson
ms.author: xiada
ms.service: spring-apps
ms.topic: include
ms.date: 09/15/2023
---

<!--
For clarity of structure, a separate markdown file is used to describe how to provision PostgreSQL database.

[!INCLUDE [provision-postgresql-flexible](includes/quickstart-deploy-restful-api-app/provision-postgresql.md)]

-->

Use the following steps to create an Azure Database for the PostgreSQL server:

1. Go to the Azure portal and select **Create a resource**.

1. Select **Databases** > **Azure Database for PostgreSQL**.

   :::image type="content" source="../../media/quickstart-deploy-restful-api-app/postgresql-create-server.png" alt-text="Screenshot of the Azure portal that shows the Create a resource page with Azure Database for PostgreSQL highlighted." lightbox="../../media/quickstart-deploy-restful-api-app/postgresql-create-server.png":::

1. Select the **Flexible server** deployment option.

   :::image type="content" source="../../media/quickstart-deploy-restful-api-app/postgresql-select-deployment-option.png" alt-text="Screenshot of the Azure portal that shows the Select Azure Database for PostgreSQL deployment option page." lightbox="../../media/quickstart-deploy-restful-api-app/postgresql-select-deployment-option.png":::

1. Fill out the **Basics** tab with the following information:

   - **Server name**: *my-demo-pgsql*
   - **Region**: **East US**
   - **PostgreSQL version**: *14*
   - **Workload type**: **Development**
   - **Enable high availability**: unselected
   - **Authentication method**: **PostgreSQL authentication only**
   - **Admin username**: *myadmin*
   - **Password** and **Confirm password**: Enter a password.

   :::image type="content" source="../../media/quickstart-deploy-restful-api-app/postgresql-create-server-basics.png" alt-text="Screenshot of the Azure portal that shows the Server details page." lightbox="../../media/quickstart-deploy-restful-api-app/postgresql-create-server-basics.png":::

1. Use the following example to configure the **Networking** tab:

   - **Connectivity method**: **Public access (allowed IP addresses)**
   - **Allow public access from any Azure service within Azure to this server**: selected

   :::image type="content" source="../../media/quickstart-deploy-restful-api-app/postgresql-create-server-networking.png" alt-text="Screenshot of the Azure portal that shows the Networking tab." lightbox="../../media/quickstart-deploy-restful-api-app/postgresql-create-server-networking.png":::

1. Select **Review + create** to review your selections, and select **Create** to provision the server. This operation may take a few minutes.

1. Go to your PostgreSQL server in the Azure portal. On the **Overview** page, look for the **Server name** value, and then record it for later use. You need it to configure environment variables for app in Azure Spring Apps.

1. Select **Databases** from the navigation menu to create a database.

   :::image type="content" source="../../media/quickstart-deploy-restful-api-app/postgresql-create-database.png" alt-text="Screenshot of the Azure portal that shows the Databases page with the Create Database menu open." lightbox="../../media/quickstart-deploy-restful-api-app/postgresql-create-database.png":::
