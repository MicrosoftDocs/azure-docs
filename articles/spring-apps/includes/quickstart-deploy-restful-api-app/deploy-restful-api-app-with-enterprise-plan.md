---
author: KarlErickson
ms.author: v-shilichen
ms.service: spring-apps
ms.topic: include
ms.date: 10/02/2023
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to deploy to Azure Spring Apps with enterprise plan.

[!INCLUDE [deploy-restful-api-app-with-enterprise-plan](includes/quickstart-deploy-restful-api-app/deploy-restful-api-app-with-enterprise-plan.md)]

-->

## 2. Prepare the Spring project

To deploy the RESTful API app, the first step is to prepare the Spring project to run locally.

Use the following steps to clone and run the app locally:

1. Use the following command to clone the sample project from GitHub:

   ```bash
   git clone https://github.com/Azure-Samples/ASA-Samples-Restful-Application.git
   ```

1. If you want to run the app locally, complete the steps in the [Expose RESTful APIs](#35-expose-restful-apis) and [Update the application configuration](#36-update-the-application-configuration) sections first, and then use the following command to run the sample application with Maven:

   ```bash
   cd ASA-Samples-Restful-Application
   ./mvnw spring-boot:run
   ```

## 3. Prepare the cloud environment

The main resources required to run this sample app are an Azure Spring Apps instance and an Azure Database for PostgreSQL instance. The following sections describe how to create these resources.

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

1. From the navigation menu, open **Apps**, and then select **Create App**.

1. On the **Create App** page, fill in the app name *simple-todo-api*, and then select **Java artifacts** as the deployment type.

1. Select **Create** to finish the app creation and then select the app to view the details.

1. Go to the app you created in the Azure portal. On the **Overview** page, select **Assign endpoint** to expose the public endpoint for the app. Save the URL for accessing the app after deployment.

1. Select **Service Connector** from the navigation pane, then select **Create** to create a new service connection.

   :::image type="content" source="../../media/quickstart-deploy-restful-api-app/restful-api-app-service-connector-enterprise.png" alt-text="Screenshot of the Azure portal that shows the enterprise plan Service Connector page with the Create button highlighted." lightbox="../../media/quickstart-deploy-restful-api-app/restful-api-app-service-connector-enterprise.png":::

1. Fill out the **Basics** tab with the following information:

   - **Service type**: **DB for PostgreSQL flexible server**
   - **Connection name**: An automatically generated name is populated, which can also be modified.
   - **Subscription**: Select your subscription.
   - **PostgreSQL flexible server**: *my-demo-pgsql*
   - **PostgreSQL database**: Select the database you created.
   - **Client type**: **SpringBoot**

   :::image type="content" source="../../media/quickstart-deploy-restful-api-app/app-service-connector-basics.png" alt-text="Screenshot of the Azure portal that shows the Basics tab of the Create connection pane for connecting to Service Bus." lightbox="../../media/quickstart-deploy-restful-api-app/app-service-connector-basics.png":::

1. Configure the **Next: Authentication** tab with the following information:

   - **Select the authentication type you'd like to use between your compute service and target service.**: Select **Connection string**.
   - **Continue with...**: Select **Database credentials**
   - **Username**: *myadmin*
   - **Password**: Enter your password.

   :::image type="content" source="../../media/quickstart-deploy-restful-api-app/app-service-connector-authentication.png" alt-text="Screenshot of the Azure portal that shows the Authentication tab of the Create connection pane with the Connection string option highlighted." lightbox="../../media/quickstart-deploy-restful-api-app/app-service-connector-authentication.png":::

1. Select **Next: Networking**. Use the default option **Configure firewall rules to enable access to target service**.

1. Select **Next: Review and Create** to review your selections, then select **Create** to create the connection.

### 3.5. Expose RESTful APIs

[!INCLUDE [expose-restful-apis](expose-restful-apis.md)]

### 3.6. Update the application configuration

[!INCLUDE [update-application-configuration](update-application-configuration.md)]

## 4. Deploy the app to Azure Spring Apps

You can now deploy the app to Azure Spring Apps.

[!INCLUDE [deploy-restful-api-app-with-maven-plugin](restful-api-spring-apps-maven-plugin.md)]
   
   ```output  
   [INFO] Deployment Status: Running
   [INFO]   InstanceName:simple-todo-api-default-15-xxxxxxxxx-xxxxx  Status:Running Reason:null       DiscoverStatus:N/A       
   [INFO] Getting public url of app(simple-todo-api)...
   [INFO] Application url: https://<your-Azure-Spring-Apps-instance-name>-simple-todo-api.azuremicroservices.io
   ```

[!INCLUDE [validate-the-app-portal](validate-the-app-portal.md)]

### [Azure CLI](#tab/Azure-CLI)

### 3.1. Provide names for each resource

Create variables to hold the resource names by using the following commands. Be sure to replace the placeholders with your own values.

```azurecli
export RESOURCE_GROUP=myresourcegroup
export LOCATION=<location>
export POSTGRESQL_SERVER=my-demo-pgsql
export POSTGRESQL_DB=Todo
export POSTGRESQL_ADMIN_USERNAME=<admin-username>
export POSTGRESQL_ADMIN_PASSWORD=<admin-password>
export AZURE_SPRING_APPS_NAME=myasa
export APP_NAME=simple-todo-api
export TODO_APP_NAME=Todo
export TODO_APP_URL=api://simple-todo
export TODOWEB_APP_NAME=TodoWeb
export TODOWEB_APP_URL=api://simple-todoweb
export NEW_MEMBER_USERNAME=<new-member-username>
export NEW_MEMBER_PASSWORD=<new-member-password>
export USER_PRINCIPAL_NAME=<user-principal-name>
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

### 3.5. Expose RESTful APIs

1. Use the following command to create a Microsoft Entra ID application:

   ```azurecli
   az ad app create --display-name ${TODO_APP_NAME} \
       --sign-in-audience AzureADandPersonalMicrosoftAccount \
       --identifier-uris ${TODO_APP_URL} \
   ```

1. Use the following command to create service principal for the application:

   ```azurecli
   az ad sp create --id ${TODO_APP_URL}
   ```

1. Use the following command to generate permission ids:

   ```azurecli
   permissionid1=$(uuidgen);permissionid2=$(uuidgen);permissionid3=$(uuidgen)
   ```

1. Add the following scopes as json：

   ```azurecli
   api=$(echo '{
    "oauth2PermissionScopes": [
        {
            "adminConsentDescription": "Allows authenticated users to delete the ToDo data",
            "adminConsentDisplayName": "Delete the ToDo data",
            "id": "'$permissionid1'",
            "isEnabled": true,
            "type": "Admin",
            "userConsentDescription": null,
            "userConsentDisplayName": null,
            "value": "ToDo.Delete"
        },

        {
            "adminConsentDescription": "Allows authenticated users to write the ToDo data",
            "adminConsentDisplayName": "Write the ToDo data",
            "id": "'$permissionid2'",
            "isEnabled": true,
            "type": "Admin",
            "userConsentDescription": null,
            "userConsentDisplayName": null,
            "value": "ToDo.Write"
        },
        {
            "adminConsentDescription": "Allows authenticated users to read the ToDo data",
            "adminConsentDisplayName": "Read the ToDo data",
            "id": "'$permissionid3'",
            "isEnabled": true,
            "type": "Admin",
            "userConsentDescription": null,
            "userConsentDisplayName": null,
            "value": "ToDo.Read"
        }
    ]}' | jq .)
   ```

1. Use the following command to add scopes:

   ```azurecli
   az ad app update --id ${TODO_APP_URL} \
    --set api="$api"
   ```

1. Use the following command to get tenant-id used next step:

   ```azurecli
   az account list | jq -r '.[].tenantId'
   ```

1. Use the following command to get application-id used next steps:

   ```azurecli
   appid=$(az ad app show --id ${TODO_APP_URL} \
    --query appId \
    --output tsv);
   echo $appid
   ```

### 3.6. Update the application configuration

[!INCLUDE [update-application-configuration](update-application-configuration.md)]

## 4. Deploy the app to Azure Spring Apps

Use the following command to deploy the .jar file for the app:

   ```azurecli
   az spring app deploy \
    --service ${AZURE_SPRING_APPS_NAME} \
    --name ${APP_NAME} \
    --artifact-path target/simple-todo-api-0.0.2-SNAPSHOT.jar
   ```

## 5. Validate the app

You can now access the RESTful API to see if it works.

### 5.1. Request an access token

The RESTful APIs act as a resource server, which is protected by Microsoft Entra ID. Before acquiring an access token, you're required to register another application in Microsoft Entra ID and grant permissions to the client application, which is named `ToDoWeb`.

#### Register the client application

1. Use the following command to create a json file contains permissions info：

   ```azurecli
   echo '[{ "resourceAppId": "'$appid'",
        "resourceAccess": [
            {
                "id": "'$permissionid1'",
                "type": "Scope"
            },
            {
                "id": "'$permissionid2'",
                "type": "Scope"
            },
            {
                "id": "'$permissionid3'",
                "type": "Scope"
            }]}]' > manifest.json
   ```

1. Use the following command to create a Microsoft Entra ID application,  which is used to add the permissions for the `ToDo` app:

   ```azurecli
   az ad app create --display-name ${TODOWEB_APP_NAME} \
       --sign-in-audience AzureADMyOrg \
       --identifier-uris ${TODOWEB_APP_URL} \
       --required-resource-accesses @manifest.json
   ```

1. Use the following command to grant admin consent for the permissions you added:

   ```azurecli
   az ad app permission admin-consent --id ${TODOWEB_APP_URL}
   ```

1. Use the following command to get the client ID of the `ToDoWeb` app used in 'Obtain the access token' step :

   ```azurecli
   az ad app show --id ${TODOWEB_APP_URL} \
    --query appId \
    --output tsv
   ```

#### Add user to access the RESTful APIs

1. Use the following steps to create a member user in your Microsoft Entra tenant. Then, the user can manage the data of the `ToDo` application through RESTful APIs:

   ```azurecli
   az ad user create --display-name ${NEW_MEMBER_USERNAME} \
       --password ${NEW_MEMBER_PASSWORD} \
       --user-principal-name ${USER_PRINCIPAL_NAME}
   ```

#### Update the OAuth2 configuration for Swagger UI authorization

1. use the following command to get the object id of the `ToDoWeb` app:

   ```azurecli
   az ad app show --id ${TODOWEB_APP_URL} --query id
   ```

1. use the following command to get the url of your `simple-todo-api` ASA app:

   ```azurecli
   az spring app show --name ${APP_NAME} \
       --service ${AZURE_SPRING_APPS_NAME} \ 
       --query properties.url
   ```

1. Use the following command to update the OAuth2 configuration for Swagger UI authorization, replace **\<object-id>** and **\<url>** with the parameters you got. Then, you can authorize users to acquire access tokens through the ToDoWeb app.

   ```azurecli
   az rest --method PATCH \
     --uri "https://graph.microsoft.com/v1.0/applications/<object-id>" \
     --headers 'Content-Type=application/json' \
     --body '{"spa":{"redirectUris":["<url>/swagger-ui/oauth2-redirect.html"]}}'
   ```

---
