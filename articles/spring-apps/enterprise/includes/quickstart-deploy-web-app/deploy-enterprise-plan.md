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

### [Azure portal](#tab/Azure-portal-ent)

The **Deploy to Azure** button in the next section launches an Azure portal experience that downloads a JAR package from the [ASA-Samples-Web-Application releases](https://github.com/Azure-Samples/ASA-Samples-Web-Application/releases) page on GitHub. No local preparation steps are needed.

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin-ent)

Although you use the Azure portal in later steps, you must use the Bash command line to prepare the project locally. Use the following steps to clone and run the app locally:

[!INCLUDE [prepare-web-project](prepare-web-project.md)]

### [Azure CLI](#tab/Azure-CLI)

Use the following steps to clone and run the app locally:

[!INCLUDE [prepare-project-on-azure-portal](../../includes/quickstart-deploy-web-app/prepare-web-project.md)]

---

## 3. Prepare the cloud environment

The main resources required to run this sample are an Azure Spring Apps instance and an Azure Database for PostgreSQL instance. This section provides the steps to create these resources.

### [Azure portal](#tab/Azure-portal-ent)

[!INCLUDE [web-prepare-cloud-environment-enterprise-azure-portal](web-prepare-cloud-environment-enterprise-azure-portal.md)]

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin-ent)

### 3.1. Sign in to the Azure portal

Go to the [Azure portal](https://portal.azure.com/) and enter your credentials to sign in to the portal. The default view is your service dashboard.

### 3.2. Create an Azure Spring Apps instance

[!INCLUDE [provision-enterprise-azure-spring-apps](provision-enterprise-azure-spring-apps.md)]

### 3.3. Prepare the PostgreSQL instance

[!INCLUDE [provision-postgresql](provision-postgresql.md)]

### 3.4. Connect app instance to PostgreSQL instance

Use the following steps to connect your service instances:

1. Go to your Azure Spring Apps instance in the Azure portal.

1. From the navigation pane, open **Apps** and then select **Create App**.

1. On the **Create App** page, for the app name, use *simple-todo-web* and leave all the other fields with their default values.

1. Select **Create** to finish creating the app and then select the app to view the details.

1. Select **Service Connector** from the navigation pane and then select **Create** to create a new service connection.

   :::image type="content" source="../../media/quickstart-deploy-web-app/app-service-connector-enterprise.png" alt-text="Screenshot of the Azure portal that shows the enterprise plan Service Connector page with the Create button highlighted." lightbox="../../media/quickstart-deploy-web-app/app-service-connector-enterprise.png":::

1. Fill out the **Basics** tab with the following information:

   - **Service type**: **DB for PostgreSQL flexible server**
   - **Connection name**: Populated with an automatically generated name that you can modify.
   - **Subscription**: Select your subscription.
   - **PostgreSQL flexible server**: *my-demo-pgsql*
   - **PostgreSQL database**: Select the database you created.
   - **Client type**: **SpringBoot**

   :::image type="content" source="../../media/quickstart-deploy-web-app/app-service-connector-basics.png" alt-text="Screenshot of the Azure portal that shows the Basics tab of the Create connection pane for connecting to PostgreSQL." lightbox="../../media/quickstart-deploy-web-app/app-service-connector-basics.png":::

1. Configure the **Next: Authentication** tab with the following information:

   - **Select the authentication type you'd like to use between your compute service and target service.**: Select **Connection string**.
   - **Continue with...**: Select **Database credentials**
   - **Username**: *myadmin*
   - **Password**: Enter your password.

   :::image type="content" source="../../media/quickstart-deploy-web-app/app-service-connector-authentication.png" alt-text="Screenshot of the Azure portal that shows the Authentication tab of the Create connection pane with the Connection string option highlighted." lightbox="../../media/quickstart-deploy-web-app/app-service-connector-authentication.png":::

1. Select **Next: Networking**. Use the default option **Configure firewall rules to enable access to target service.**.

1. Select **Next: Review and Create** to review your selections and then select **Create** to create the connection.

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

### [Azure portal](#tab/Azure-portal-ent)

[!INCLUDE [deploy-web-app-azure-portal](deploy-web-app-azure-portal.md)]

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin-ent)

[!INCLUDE [web-spring-apps-maven-plugin](web-spring-apps-maven-plugin.md)]

   ```output
   [INFO] Deployment Status: Running
   [INFO]   InstanceName:simple-todo-web-default-15-xxxxxxxxx-xxxxx  Status:Running Reason:null       DiscoverStatus:N/A       
   [INFO] Getting public url of app(simple-todo-web)...
   [INFO] Application url: https://<your-Azure-Spring-Apps-instance-name>-simple-todo-web.azuremicroservices.io
   ```

   The output **Application url** is the endpoint to access the `todo` application.

### [Azure CLI](#tab/Azure-CLI)

Now that the cloud environment is prepared, the application is ready to deploy. Use the following command to deploy the app:

```azurecli
az spring app deploy \
    --service ${AZURE_SPRING_APPS_NAME} \
    --name ${APP_NAME} \
    --artifact-path web/target/simple-todo-web-0.0.2-SNAPSHOT.jar
```

---
