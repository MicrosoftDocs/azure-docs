---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 10/17/2023
---

<!-- 
To reuse the Spring Apps instance creation steps in other articles, a separate markdown file is used to describe how to connect app instance to PostgreSQL instance.

[!INCLUDE [provision-spring-apps](../../includes/quickstart-deploy-restful-api-app/connect-app-instance-to-postgresql.md)]

-->

Use the following steps to connect your service instances:

1. Go to your Azure Spring Apps instance in the Azure portal.

1. From the navigation menu, open **Apps**, and then select **Create App**.

1. On the **Create App** page, fill in the app name *simple-todo-api* and select **Java artifacts** as the deployment type.

1. Select **Create** to finish the app creation and select the app to view the details.

1. Go to the created app in the Azure portal. On the **Overview** page, select **Assign endpoint** to expose the public endpoint for the app. Save the URL for later use.

1. Expand **Settings** and select **Configuration** from the navigation menu, and then select **Environment variables** to set the environment variables.

1. Add the following environment variables for the PostgreSQL connection, and then select **Save** to finish the app configuration update. Be sure to replace the placeholders with your own values that you created previously.

   | Environment variable         | Value                                                                                  |
      |------------------------------|----------------------------------------------------------------------------------------|
   | `SPRING_DATASOURCE_URL`      | `jdbc:postgresql://<your-PostgreSQL-server-name>:5432/<your-PostgreSQL-database-name>` |
   | `SPRING_DATASOURCE_USERNAME` | `<your-PostgreSQL-admin-user>`                                                         |
   | `SPRING_DATASOURCE_PASSWORD` | `<your-PostgreSQL-admin-password>`                                                     |

   :::image type="content" source="../../media/quickstart-deploy-restful-api-app/consumption-app-environment-variables.png" alt-text="Screenshot of the Azure portal that shows the Environment variables tab with all the values for the PostgreSQL connection." lightbox="../../media/quickstart-deploy-restful-api-app/consumption-app-environment-variables.png":::
