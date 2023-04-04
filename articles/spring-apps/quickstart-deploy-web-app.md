---
title: Quickstart - Deploy your first web application to Azure Spring Apps
description: Describes how to deploy a web application to Azure Spring Apps.
author: karlerickson
ms.service: spring-apps
ms.topic: quickstart
ms.date: 04/05/2023
ms.author: rujche
ms.custom: devx-track-java, devx-track-azurecli, mode-other, event-tier1-build-2022, engagement-fy23
---

# Quickstart: Deploy your first web application to Azure Spring Apps

> [!NOTE]
> The first 50 vCPU hours and 100 GB hours of memory are free each month. For more information, see [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058) on the [Apps on Azure Blog](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/bg-p/AppsonAzureBlog).

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard tier

This quickstart shows how to deploy a Spring Boot web application to Azure Spring Apps. The sample project is a typical three layers web application:

1. A frontend bounded [React](https://reactjs.org/) application.
2. A backend Spring web application that uses Spring Data JPA to access a relational database.
3. A relational database. [H2 Database Engine](https://www.h2database.com/html/main.html) is used in localhost. [Azure Database for PostgreSQL](/azure/postgresql/flexible-server/) is used when deploy to Azure Spring Apps.

The following diagram shows the architecture of the system:

:::image type="content" source="media/quickstart-for-web-app/diagram.png" alt-text="Image that shows the architecture of a Spring web application." lightbox="media/quickstart-for-web-app/diagram.png":::

## Prerequisites

- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/). Version = 17.
- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli). Version >= 2.45.0.

## Clone and run the sample project locally

1. The sample project is available on GitHub. Use the following command to clone the sample project:

```shell
   git clone https://github.com/Azure-Samples/ASA-Samples-Web-Application.git
```

1. Use the following command to build the sample project:

   ```shell
   cd ASA-Samples-Web-Application
   ./mvnw clean package -DskipTests
   ```

1. Use the following command to run the sample application by Maven:

   ```shell
   java -jar web/target/simple-todo-web-0.0.1-SNAPSHOT.jar
   ```

1. Go to `http://localhost:8080` in your browser to access the application, as shown in the following screenshot.

   :::image type="content" source="./media/quickstart-for-web-app/todo-app.png" alt-text="Sceenshot of a sample web application in Azure Spring Apps." lightbox="./media/quickstart-for-web-app/todo-app.png":::

## Prepare the cloud environment

The main resources needed to run this sample is an Azure Spring Apps instance and an Azure Database for PostgreSQL instance. This section provides the steps to create these resources.

### 1. Set name for each resource

Specify the following suggested names for the resources.

```azurecli-interactive
RESOURCE_GROUP=WebAppResourceGroup
LOCATION=eastus
POSTGRESQL_SERVER=webapppostgresqlserver
POSTGRESQL_DB=WebAppPostgreSQLDB
AZURE_SPRING_APPS_NAME=web-app-azure-spring-apps
APP_NAME=webapp
CONNECTION=WebAppConnection
```

### 2. Create a new resource group

Use the following steps to create a new resource group.

1. Sign in to Azure CLI.

   ```azurecli-interactive
   az login
   ```

1. Set the default location.

   ```azurecli-interactive
   az configure --defaults location=${LOCATION}
   ```

1. Set the default subscription. Firstly, list all available subscriptions:

   ```azurecli-interactive
   az account list --output table
   ```

   Then choose one subscription and set it as default subscription with the following command:

   ```azurecli-interactive
   az account set --subscription <SubscriptionId>
   ```

1. Create a resource group.

   ```azurecli-interactive
   az group create --resource-group ${RESOURCE_GROUP}
   ```

1. Set the new created resource group as default resource group.

   ```azurecli-interactive
   az configure --defaults group=${RESOURCE_GROUP}
   ```

### 3. Create Azure Spring Apps instance

Azure Spring Apps is used to host the spring web app. Create an Azure Spring Apps instance and create an app inside it.

1. Create an Azure Spring Apps service instance.

   ```azurecli-interactive
   az spring create --name ${AZURE_SPRING_APPS_NAME}
   ```

1. Create an app in the created Azure Spring Apps instance.

   ```azurecli-interactive
   az spring app create \
       --service ${AZURE_SPRING_APPS_NAME} \
       --name ${APP_NAME} \
       --runtime-version Java_17 \
       --assign-endpoint true
   ```

### 4. Prepare PostgreSQL instance

The Spring web app in localhost uses H2 for the database, Azure uses [Azure Database for PostgreSQL - Flexible Server](/azure/postgresql/flexible-server/) instead. Use the following command to create a PostgreSQL instance:

```azurecli-interactive
az postgres flexible-server create \
    --name ${POSTGRESQL_SERVER} \
    --database-name ${POSTGRESQL_DB} \
    --active-directory-auth Enabled
```

So that the app is accessible only by PostgreSQL in Azure Spring Apps, enter `n` to the prompts to enable access to a specific IP address and to enable access for all IP addresses.

```text
Do you want to enable access to client xxx.xxx.xxx.xxx (y/n) (y/n): n
Do you want to enable access for all IPs  (y/n): n
```

### 5. Connect app instance to PostgreSQL instance

After the app instance and the PostgreSQL instance have been created, the app instance can't access the PostgreSQL instance directly. Some network settings and connection information should be configured. To do these tasks, use [Service Connector](/azure/service-connector/overview).

1. If you're using Service Connector for the first time, first register the Service Connector resource provider.

   ```azurecli-interactive
   az provider register --namespace Microsoft.ServiceLinker
   ```

1. To achieve passwordless connection in Service Connector. Add `serviceconnector-passwordless` extension by using the following command:

   ```azurecli-interactive
   az extension add --name serviceconnector-passwordless --upgrade
   ```

1. Create a service connection between the app and the PostgreSQL by this command:

   ```azurecli-interactive
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

   The `--system-identity` parameter is necessary for passwrodless connection. For more information, see [Bind an Azure Database for PostgreSQL to your application in Azure Spring Apps](/azure/spring-apps/how-to-bind-postgres?tabs=Passwordlessflex).

1. After connection created, use the following command to validate the connection:

   ```azurecli-interactive
   az spring connection validate \
       --resource-group ${RESOURCE_GROUP} \
       --service ${AZURE_SPRING_APPS_NAME} \
       --app ${APP_NAME} \
       --connection ${CONNECTION}
   ```

   The output should appear as the following JSON code:

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

1. Now the cloud environment is ready, use the following command to deploy the app:

   ```azurecli-interactive
   az spring app deploy \
       --service ${AZURE_SPRING_APPS_NAME} \
       --name ${APP_NAME} \
       --artifact-path web/target/simple-todo-web-0.0.1-SNAPSHOT.jar
   ```

1. After the deployment has completed, you can access the app at `https://${AZURE_SPRING_APPS_NAME}-${APP_NAME}.azuremicroservices.io/`. The page should appear as you saw in localhost.

1. If there's a problem when you deploy the app, check the app's log to investigate by using the following command:

   ```azurecli-interactive
   az spring app logs \
       --service ${AZURE_SPRING_APPS_NAME} \
       --name ${APP_NAME}
   ```

## Clean up resources

1. To avoid unnecessary cost, use the following commands to delete the resource group.

   ```azurecli-interactive
   az group delete --name ${RESOURCE_GROUP}
   ```

## Next steps

1. [Bind an Azure Database for PostgreSQL to your application in Azure Spring Apps](/azure/spring-apps/how-to-bind-postgres?tabs=Secrets).
2. [Create a service connection in Azure Spring Apps with the Azure CLI](/azure/service-connector/quickstart-cli-spring-cloud-connection).
3. [Azure Spring Apps Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples).
4. [Spring on Azure](/azure/developer/java/spring/)
5. [Spring Cloud Azure](/azure/developer/java/spring-framework/)
