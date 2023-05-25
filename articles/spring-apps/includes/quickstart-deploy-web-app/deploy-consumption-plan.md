---
author: karlerickson
ms.author: xiada
ms.service: spring-apps
ms.topic: include
ms.date: 05/24/2022
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to deploy to Azure Spring Apps consumption plan.

[!INCLUDE [deploy-to-azure-spring-apps-consumption-plan](includes/quickstart-deploy-web-app/deploy-consumption-plan.md)]

-->

## Prepare the Spring project

Use the following steps to clone and run the app locally.

1. Use the following command to clone the sample project from GitHub:

   ```bash
   git clone https://github.com/Azure-Samples/ASA-Samples-Web-Application.git
   ```

2. Use the following command to build the sample project:

   ```bash
   cd ASA-Samples-Web-Application
   ./mvnw clean package -DskipTests
   ```

3. Use the following command to run the sample application by Maven:

   ```bash
   java -jar web/target/simple-todo-web-0.0.1-SNAPSHOT.jar
   ```

4. Go to `http://localhost:8080` in your browser to access the application.

## Prepare the cloud environment

The main resources required to run this sample are an Azure Spring Apps instance and an Azure Database for PostgreSQL instance. This section provides the steps to create these resources.

### Provide names for each resource

Create variables to hold the resource names by using the following commands. Be sure to replace the placeholders with your own values.

```azurecli
RESOURCE_GROUP=<resource-group-name>
LOCATION=<location>
POSTGRESQL_SERVER=<server-name>
POSTGRESQL_DB=<database-name>
POSTGRESQL_ADMIN_USERNAME=<admin-username>
POSTGRESQL_ADMIN_PASSWORD=<admin-password>
AZURE_SPRING_APPS_NAME=<Azure-Spring-Apps-service-instance-name>
APP_NAME=<web-app-name>
MANAGED_ENVIRONMENT="<Azure-Container-Apps-environment-name>"
CONNECTION=<connection-name>
```

### Create a new resource group

Use the following steps to create a new resource group.

1. Use the following command to sign in to the Azure CLI.

   ```azurecli
   az login
   ```

1. Use the following command to set the default location.

   ```azurecli
   az configure --defaults location=${LOCATION}
   ```

1. Use the following command to list all available subscriptions to determine the subscription ID to use.

   ```azurecli
   az account list --output table
   ```

1. Use the following command to set the default subscription:

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

An Azure Container Apps environment creates a secure boundary around a group of applications. Apps deployed to the same environment are deployed in the same virtual network and write logs to the same log analytics workspace. For more information, see [Log Analytics workspace overview](../azure-monitor/logs/log-analytics-workspace-overview.md).

1. Use the following command to create the environment:

   ```azurecli
   az containerapp env create \
       --name ${MANAGED_ENVIRONMENT}
   ```

1. Use the following command to create a variable to store the environment resource ID:

   ```azurecli
   MANAGED_ENV_RESOURCE_ID=$(az containerapp env show \
       --name ${MANAGED_ENVIRONMENT} \
       --query id \
       --output tsv)
   ```

1. The Azure Spring Apps Standard consumption and dedicated plan instance is built on top of the Azure Container Apps environment. Create your Azure Spring Apps instance by specifying the resource ID of the environment you created. Use the following command to create an Azure Spring Apps service instance with the resource ID:

   ```azurecli
   az spring create \
       --name ${AZURE_SPRING_APPS_NAME} \
       --managed-environment ${MANAGED_ENV_RESOURCE_ID} \
       --sku standardGen2
   ```

1. Use the following command to specify the app name on Azure Spring Apps and to allocate required resources:

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
    --admin-user ${POSTGRESQL_ADMIN_USERNAME} \
    --admin-password ${POSTGRESQL_ADMIN_PASSWORD} \
    --public-access 0.0.0.0
```

Specifying `0.0.0.0` enables public access from any resources deployed within Azure to access your server.

### Connect app instance to PostgreSQL instance

After the application instance and the PostgreSQL instance are created, the application instance can't access the PostgreSQL instance directly. Use the following steps to enable the app to connect to the PostgreSQL instance.

1. Use the following command to get the PostgreSQL instance's fully qualified domain name:

   ```azurecli
   PSQL_FQDN=$(az postgres flexible-server show \
       --name ${POSTGRESQL_SERVER} \
       --query fullyQualifiedDomainName \
       --output tsv)
   ```

1. Use the following command to provide the `spring.datasource.` properties to the app through environment variables:

   ```azurecli
   az spring app update \
       --service ${AZURE_SPRING_APPS_NAME} \
       --name ${APP_NAME} \
       --env SPRING_DATASOURCE_URL="jdbc:postgresql://${PSQL_FQDN}:5432/${POSTGRESQL_DB}?sslmode=require" \
             SPRING_DATASOURCE_USERNAME="${POSTGRESQL_ADMIN_USERNAME}" \
             SPRING_DATASOURCE_PASSWORD="${POSTGRESQL_ADMIN_PASSWORD}"
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

2. After the deployment has completed, use the following command to access the app with the URL retrieved:

   ```azurecli
   az spring app show \
       --service ${AZURE_SPRING_APPS_NAME} \
       --name ${APP_NAME} \
       --query properties.url \
       --output tsv
   ```

   The page should appear as you saw in localhost.

3. Use the following command to check the app's log to investigate any deployment issue:

   ```azurecli
   az spring app logs \
       --service ${AZURE_SPRING_APPS_NAME} \
       --name ${APP_NAME}
   ```

