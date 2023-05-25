---
author: karlerickson
ms.author: xiada
ms.service: spring-apps
ms.topic: include
ms.date: 05/24/2022
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to deploy to Azure Spring Apps enterprise plan.

[!INCLUDE [deploy-to-azure-spring-apps-enterprise-plan](includes/quickstart-deploy-web-app/deploy-enterprise-plan.md)]

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
AZURE_SPRING_APPS_NAME=<Azure-Spring-Apps-service-instance-name>
APP_NAME=<web-app-name>
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

2. After the deployment has completed, you can access the app with this URL: `https://${AZURE_SPRING_APPS_NAME}-${APP_NAME}.azuremicroservices.io/`. The page should appear as you saw in localhost.

3. Use the following command to check the app's log to investigate any deployment issue:

   ```azurecli
   az spring app logs \
       --service ${AZURE_SPRING_APPS_NAME} \
       --name ${APP_NAME}
   ```
