---
author: karlerickson
ms.author: xiada
ms.service: spring-apps
ms.topic: include
ms.date: 05/24/2022
---

<!--
For clarity of structure, a separate markdown file is used to describe how to provision PostgreSQL database.

[!INCLUDE [provision-psql-flexible](includes/quickstart-deploy-web-app/provision-psql.md)]

-->

Use the following steps to create an Azure Database for PostgreSQL server:

1. In the Azure portal, select **Create a resource**.

1. Select **Databases** > **Azure Database for PostgreSQL**.

   :::image type="content" source="../../media/quickstart-deploy-web-app/4-psql-create-server.png" alt-text="Screenshot of the Azure portal showing the Create a resource page with Azure Database for PostgreSQL highlighted." lightbox="../../media/quickstart-deploy-web-app/4-psql-create-server.png":::

1. Select the **Flexible server** deployment option.

   :::image type="content" source="../../media/quickstart-deploy-web-app/5-psql-select-deployment-option.png" alt-text="Screenshot of the Azure portal showing the Select Azure Database for PostgreSQL deployment option page." lightbox="../../media/quickstart-deploy-web-app/5-psql-select-deployment-option.png":::

1. Fill out the **Basics** form with the following information:

   - **Server name**: *my-demo-pgsql*
   - **Region**: **East US**
   - **PostgreSQL verion**: *14*
   - **Workload type**: **Development**
   - **Enable high availability**: unselected
   - **Authentication method**: **PostgreSQL authentication only**
   - **Admin username**: *myadmin*
   - **Password** and **Confirm password**: Enter a password.

   :::image type="content" source="../../media/quickstart-deploy-web-app/6-psql-create-server-basics.png" alt-text="Screenshot of the Azure portal showing the Server details page." lightbox="../../media/quickstart-deploy-web-app/6-psql-create-server-basics.png":::

1. Configure **Networking** options：

   :::image type="content" source="../../media/quickstart-deploy-web-app/7-psql-create-server-networking.png" alt-text="Screenshot of the Azure portal showing the Networking tab." lightbox="../../media/quickstart-deploy-web-app/7-psql-create-server-networking.png":::

1. Select **Review + create** to review your selections. Select **Create** to provision the server. This operation may take a few minutes.

1. Go to your PostgreSQL server in the Azure portal.

1. Select **Databases** from the navigation pane to create a database:

   :::image type="content" source="../../media/quickstart-deploy-web-app/8-psql-create-database.png" alt-text="Screenshot of the Azure portal showing the Databases page with the Create Database pane open." lightbox="../../media/quickstart-deploy-web-app/8-psql-create-database.png":::
