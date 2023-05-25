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

### Prepare the PostgreSQL instance

To create an Azure Database for PostgreSQL server, take the following steps:

1. Select **Create a resource** (+) in the upper-left corner of the portal.

1. Select **Databases** > **Azure Database for PostgreSQL**.

    :::image type="content" source="../../media/quickstart-deploy-web-app/4-create-database.png" alt-text="The Azure Database for PostgreSQL in menu":::

1. Select the **Flexible server** deployment option.

   :::image type="content" source="../../media/quickstart-deploy-web-app/5-select-deployment-option.png" alt-text="Select Azure Database for PostgreSQL - Flexible server deployment option":::

1. Fill out the **Basics** form with the following information:

    :::image type="content" source="../../media/quickstart-deploy-web-app/6-create-database-basics.png" alt-text="Create a server.":::

1. Configure Networking options：

    :::image type="content" source="../../media/quickstart-deploy-web-app/7-create-database-networking.png" alt-text="The Networking pane.":::

1. Select **Review + create** to review your selections. Select **Create** to provision the server. This operation may take a few minutes.

1. Create a database:


### Connect app instance to PostgreSQL instance
