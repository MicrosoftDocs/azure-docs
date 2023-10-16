---
author: KarlErickson
ms.author: xiada
ms.service: spring-apps
ms.custom: devx-track-azurecli
ms.topic: include
ms.date: 07/11/2023
---

<!--
For clarity of structure, a separate markdown file is used to describe how to deploy to Azure Spring Apps enterprise plan.

[!INCLUDE [deploy-to-azure-spring-apps-enterprise-plan](includes/quickstart-deploy-web-app/deploy-enterprise-plan.md)]

-->

## 2. Prepare the Spring project

Use the following steps to clone and run the app locally.

### [Azure portal](#tab/Azure-portal-ent)

The **Deploy to Azure** button in the next section launches an Azure portal experience that downloads a JAR package from the [ASA-Samples-Web-Application releases](https://github.com/Azure-Samples/ASA-Samples-Web-Application/releases) page on GitHub. No local preparation steps are needed.

### [Azure CLI](#tab/Azure-CLI)

[!INCLUDE [prepare-project-on-azure-portal](../../includes/quickstart-deploy-web-app/prepare-web-project.md)]

---

## 3. Prepare the cloud environment

The main resources required to run this sample are an Azure Spring Apps instance and an Azure Database for PostgreSQL instance. This section provides the steps to create these resources.

### [Azure portal](#tab/Azure-portal-ent)

[!INCLUDE [prepare-cloud-environment-on-azure-portal](../../includes/quickstart-deploy-web-app/web-prepare-cloud-environment-enterprise-azure-portal.md)]

### [Azure CLI](#tab/Azure-CLI)

### 3.1. Provide names for each resource

Create variables to hold the resource names by using the following commands. Be sure to replace the placeholders with your own values.

```azurecli
export RESOURCE_GROUP=<resource-group-name>
export LOCATION=<location>
export POSTGRESQL_SERVER=<server-name>
export POSTGRESQL_DB=<database-name>
export POSTGRESQL_ADMIN_USERNAME=<admin-username>
export POSTGRESQL_ADMIN_PASSWORD=<admin-password>
export AZURE_SPRING_APPS_NAME=<Azure-Spring-Apps-service-instance-name>
export APP_NAME=<web-app-name>
```

### 3.2. Create a new resource group

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

### 3.3. Create an Azure Spring Apps instance

Azure Spring Apps is used to host the Spring web app. Create an Azure Spring Apps instance and an application inside it.

1. Use the following command to create an Azure Spring Apps service instance.

   ```azurecli
   az spring create --name ${AZURE_SPRING_APPS_NAME} --sku enterprise
   ```

1. Use the following command to create an application in the Azure Spring Apps instance.

   ```azurecli
   az spring app create \
       --service ${AZURE_SPRING_APPS_NAME} \
       --name ${APP_NAME} \
       --assign-endpoint true
   ```

### 3.4. Prepare the PostgreSQL instance

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

### 3.5. Connect app instance to PostgreSQL instance

After the application instance and the PostgreSQL instance are created, the application instance can't access the PostgreSQL instance directly. Use the following steps to enable the app to connect to the PostgreSQL instance.

1. Use the following command to get the PostgreSQL instance's fully qualified domain name:

   ```azurecli
   export PSQL_FQDN=$(az postgres flexible-server show \
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

---

## 4. Deploy the app to Azure Spring Apps

Now that the cloud environment is prepared, the application is ready to deploy. Use the following command to deploy the app:

### [Azure portal](#tab/Azure-portal-ent)

[!INCLUDE [deploy-web-app-on-azure-portal](../../includes/quickstart-deploy-web-app/deploy-web-app-azure-portal.md)]

### [Azure CLI](#tab/Azure-CLI)

```azurecli
az spring app deploy \
    --service ${AZURE_SPRING_APPS_NAME} \
    --name ${APP_NAME} \
    --artifact-path web/target/simple-todo-web-0.0.2-SNAPSHOT.jar
```

---
