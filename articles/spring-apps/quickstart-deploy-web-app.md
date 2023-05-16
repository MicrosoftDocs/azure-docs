---
title: Quickstart - Deploy your first web application to Azure Spring Apps
description: Describes how to deploy a web application to Azure Spring Apps.
author: karlerickson
ms.service: spring-apps
ms.topic: quickstart
ms.date: 04/06/2023
ms.author: rujche
ms.custom: devx-track-java, devx-track-azurecli, mode-other, event-tier1-build-2022, engagement-fy23
---

# Quickstart: Deploy your first web application to Azure Spring Apps

> [!NOTE]
> The first 50 vCPU hours and 100 GB hours of memory are free each month. For more information, see [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058) on the [Apps on Azure Blog](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/bg-p/AppsonAzureBlog).

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard tier ❌ Enterprise tier

This quickstart shows how to deploy a Spring Boot web application to Azure Spring Apps. The sample project is a simple ToDo application to add tasks, mark when they're complete, and then delete them. The following screenshot shows the application:

:::image type="content" source="./media/quickstart-deploy-web-app/todo-app.png" alt-text="Sceenshot of a sample web application in Azure Spring Apps." lightbox="./media/quickstart-deploy-web-app/todo-app.png":::

This application is a typical three-layers web application with the following layers:

- A frontend bounded [React](https://reactjs.org/) application.
- A backend Spring web application that uses Spring Data JPA to access a relational database.
- A relational database. For localhost, the application uses [H2 Database Engine](https://www.h2database.com/html/main.html). For Azure Spring Apps, the application uses Azure Database for PostgreSQL. For more information about Azure Database for PostgreSQL, see [Flexible Server documentation](../postgresql/flexible-server/overview.md).

The following diagram shows the architecture of the system:

:::image type="content" source="media/quickstart-deploy-web-app/diagram.png" alt-text="Image that shows the architecture of a Spring web application.":::

## Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli). Version 2.45.0 or greater.
- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.

## Clone and run the sample project locally

Use the following steps to clone and run the app locally.

1. The sample project is available on GitHub. Use the following command to clone the sample project:

   ```bash
   git clone https://github.com/Azure-Samples/ASA-Samples-Web-Application.git
   ```

1. Use the following command to build the sample project:

   ```bash
   cd ASA-Samples-Web-Application
   ./mvnw clean package -DskipTests
   ```

1. Use the following command to run the sample application by Maven:

   ```bash
   java -jar web/target/simple-todo-web-0.0.1-SNAPSHOT.jar
   ```

1. Go to `http://localhost:8080` in your browser to access the application.

## Prepare the cloud environment

The main resources required to run this sample are an Azure Spring Apps instance and an Azure Database for PostgreSQL instance. This section provides the steps to create these resources.

### Provide names for each resource

Create variables to hold the resource names. Be sure to replace the placeholders with your own values.

```azurecli
RESOURCE_GROUP=<resource-group-name>
LOCATION=<location>
POSTGRESQL_SERVER=<server-name>
POSTGRESQL_DB=<database-name>
AZURE_SPRING_APPS_NAME=<Azure-Spring-Apps-service-instance-name>
APP_NAME=<web-app-name>
CONNECTION=<connection-name>
```

### Create a new resource group

Use the following steps to create a new resource group.

1. Use the following command to sign in to Azure CLI.

   ```azurecli
   az login
   ```

1. Use the following command to set the default location.

   ```azurecli
   az configure --defaults location=${LOCATION}
   ```

1. Set the default subscription. Use the following command to first list all available subscriptions:

   ```azurecli
   az account list --output table
   ```

1. Choose a subscription and set it as the default subscription with the following command:

   ```azurecli
   az account set --subscription <subscription-ID>
   ```

1. Use the following command to create a resource group.

   ```azurecli
   az group create --resource-group ${RESOURCE_GROUP}
   ```

1. Use the following command to set the newly created resource group as the default resource group.

   ```azurecli
   az configure --defaults group=${RESOURCE_GROUP}
   ```

### Create an Azure Spring Apps instance

Azure Spring Apps is used to host the Spring web app. Create an Azure Spring Apps instance and an application inside it.

1. Use the following command to create an Azure Spring Apps service instance.

   ```azurecli
   az spring create --name ${AZURE_SPRING_APPS_NAME}
   ```

1. Use the following command to create an application in the Azure Spring Apps instance.

   ```azurecli
   az spring app create \
       --service ${AZURE_SPRING_APPS_NAME} \
       --name ${APP_NAME} \
       --runtime-version Java_17 \
       --assign-endpoint true
   ```

### Prepare the PostgreSQL instance

The Spring web app uses H2 for the database in localhost, and Azure Database for PostgreSQL for the database in Azure.

Use the following command to create a PostgreSQL instance:

```azurecli
az postgres flexible-server create \
    --name ${POSTGRESQL_SERVER} \
    --database-name ${POSTGRESQL_DB} \
    --active-directory-auth Enabled
```

To ensure that the application is accessible only by PostgreSQL in Azure Spring Apps, enter `n` to the prompts to enable access to a specific IP address and to enable access for all IP addresses.

```output
Do you want to enable access to client xxx.xxx.xxx.xxx (y/n) (y/n): n
Do you want to enable access for all IPs  (y/n): n
```

### Connect app instance to PostgreSQL instance

After the application instance and the PostgreSQL instance are created, the application instance can't access the PostgreSQL instance directly. The following steps use Service Connector to configure the needed network settings and connection information. For more information about Service Connector, see [What is Service Connector?](../service-connector/overview.md).

1. If you're using Service Connector for the first time, use the following command to register the Service Connector resource provider.

   ```azurecli
   az provider register --namespace Microsoft.ServiceLinker
   ```

1. Use the following command to achieve a passwordless connection:

   ```azurecli
   az extension add --name serviceconnector-passwordless --upgrade
   ```

1. Use the following command to create a service connection between the application and the PostgreSQL database:

   ```azurecli
   az spring connection create postgres-flexible \
       --resource-group ${RESOURCE_GROUP} \
       --service ${AZURE_SPRING_APPS_NAME} \
       --app ${APP_NAME} \
       --client-type springBoot \
       --target-resource-group ${RESOURCE_GROUP} \
       --server ${POSTGRESQL_SERVER} \
       --database ${POSTGRESQL_DB} \
       --system-identity \
       --connection ${CONNECTION}
   ```

   The `--system-identity` parameter is required for the passwordless connection. For more information, see [Bind an Azure Database for PostgreSQL to your application in Azure Spring Apps](how-to-bind-postgres.md).

1. After the connection is created, use the following command to validate the connection:

   ```azurecli
   az spring connection validate \
       --resource-group ${RESOURCE_GROUP} \
       --service ${AZURE_SPRING_APPS_NAME} \
       --app ${APP_NAME} \
       --connection ${CONNECTION}
   ```

   The output should appear similar to the following JSON code:

   ```json
   [
   {
       "additionalProperties": {},
       "description": null,
       "errorCode": null,
       "errorMessage": null,
       "name": "The target existence is validated",
       "result": "success"
   },
   {
       "additionalProperties": {},
       "description": null,
       "errorCode": null,
       "errorMessage": null,
       "name": "The target service firewall is validated",
       "result": "success"
   },
   {
       "additionalProperties": {},
       "description": null,
       "errorCode": null,
       "errorMessage": null,
       "name": "The configured values (except username/password) is validated",
       "result": "success"
   },
   {
       "additionalProperties": {},
       "description": null,
       "errorCode": null,
        "errorMessage": null,
       "name": "The identity existence is validated",
       "result": "success"
   }
   ]
   ```

## Deploy the app to Azure Spring Apps

Now that the cloud environment is prepared, the application is ready to deploy.

1. Use the following command to deploy the app:

   ```azurecli
   az spring app deploy \
       --service ${AZURE_SPRING_APPS_NAME} \
       --name ${APP_NAME} \
       --artifact-path web/target/simple-todo-web-0.0.1-SNAPSHOT.jar
   ```

1. After the deployment has completed, you can access the app with this URL: `https://${AZURE_SPRING_APPS_NAME}-${APP_NAME}.azuremicroservices.io/`. The page should appear as you saw in localhost.

1. If there's a problem when you deploy the app, check the app's log to investigate by using the following command:

   ```azurecli
   az spring app logs \
       --service ${AZURE_SPRING_APPS_NAME} \
       --name ${APP_NAME}
   ```

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When you no longer need the resources, delete them by deleting the resource group. Use the following command to delete the resource group:

```azurecli
az group delete --name ${RESOURCE_GROUP}
```

## Next steps

> [!div class="nextstepaction"]
> [Create a service connection in Azure Spring Apps with the Azure CLI](../service-connector/quickstart-cli-spring-cloud-connection.md)

For more information, see the following articles:

- [Azure Spring Apps Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples).
- [Spring on Azure](/azure/developer/java/spring/)
- [Spring Cloud Azure](/azure/developer/java/spring-framework/)
