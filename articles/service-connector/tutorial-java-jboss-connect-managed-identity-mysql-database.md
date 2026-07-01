---
title: Access MySQL data from Java JBoss EAP on App Service
description: Connect to Azure Database for MySQL using managed identity from a sample Java JBoss Enterprise Application Platform (EAP) app on Azure App Service.
ms.devlang: java
ms.topic: tutorial
ms.date: 04/27/2026
ms.service: service-connector
author: xfz11
ms.author: xiaofanzhou
ms.custom:
  - passwordless-java
  - service-connector
  - devx-track-azurecli
  - devx-track-extended-java
  - sfi-ga-nochange
#customer intent: As a Java app developer and MySQL database user, I want to learn how to use Service Connector to connect Azure Database for MySQL databases and other services to my App Service JBoss EAP apps, so I can easily store and serve data in my apps.
---

# Tutorial: Connect to a MySQL database from Java JBoss EAP on Azure App Service

In this tutorial, you learn how to connect a Java JBoss EAP app on [Azure App Service](/azure/app-service/overview) to an Azure Database for MySQL database using a managed identity. App Service can use [managed identity](/azure/app-service/overview-managed-identity) to provide secure access to [Azure Database for MySQL](/azure/mysql/) and other Azure services. A managed identity eliminates the need to use secrets in your app, such as credentials in the environment variables.

This tutorial uses Azure CLI commands to complete the following tasks:

> [!div class="checklist"]
> * Creates an Azure Database for MySQL server and database.
> * Deploys a sample JBoss EAP app to App Service using a WAR package.
> * Configures the Spring Boot web application to use Microsoft Entra authentication with the MySQL database.
> * Connects the web app to the MySQL database using Service Connector with managed identity authentication.

## Prerequisites

- An Azure subscription with Microsoft Entra role assignment permissions and Azure resource write permissions, in an Azure region that [supports Service Connector](concept-region-support.md) and has sufficient [App Service support and quota](/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-app-service-limits) for the tutorial.

- The `Microsoft.ServiceLinker` and `Microsoft.DBforMySQL` resource providers registered in your Azure subscription. You can run `az provider register -n Microsoft.[service]` to register the providers.

- [Git](https://git-scm.com/) to access and clone the sample repo.

- Access to [Azure Cloud Shell](/azure/cloud-shell/get-started/classic) to run the tutorial steps, or if you prefer to run locally, the following prerequisites and steps:

  - [`Java JDK`](/azure/developer/java/fundamentals/java-support-on-azure) installed
  - [Maven](https://maven.apache.org) installed
  - [`jq`](https://jqlang.github.io/jq/) installed
  - [MySQL client](https://dev.mysql.com/doc/mysql-getting-started/en/) installed
  - [Azure CLI](/cli/azure/install-azure-cli) 2.46.0 or higher installed. To check your version, run `az --version`. To upgrade, run `az upgrade`.

    If you're running locally:

    1. Sign in to Azure by using `az login` and following the prompts.
    1. If you have more than one Azure subscription connected to your sign-in credentials, run `az account set --subscription <subscription-ID>` to select the correct subscription.

## Set up your environment


1. Install the following Azure CLI extensions:

   ```azurecli
   az extension add --name serviceconnector-passwordless --upgrade
   az extension add --name rdbms-connect
   ```


1. Run the following commands to clone the sample repo and change directories into the sample app project folder. Run all remaining commands from this folder.

   ```bash
   git clone https://github.com/Azure-Samples/Passwordless-Connections-for-Java-Apps
   cd Passwordless-Connections-for-Java-Apps/JakartaEE/jboss-eap/
   ```

1. Define the following environment variables for the tutorial, replacing the `<region>` placeholder with a valid value. `LOCATION` must be an Azure region where your subscription has sufficient quota to create the Azure resources and no restrictions on any of the services.

   ```bash
   LOCATION="<region>"
   RESOURCE_GROUP="mysql-mi-webapp"
   ```

1. Create an [Azure resource group](/azure/azure-resource-manager/management/overview#terminology) to contain all the project resources. The resource group name is cached and automatically applied to subsequent commands.

    ```azurecli
    az group create --name $RESOURCE_GROUP --location $LOCATION
    ```

## Create an Azure Database for MySQL

Create an Azure Database for MySQL server and database in your subscription. The Spring Boot app connects to this database and stores its data when running, persisting the application state no matter where you run the application.

1. Run the following command to create an Azure Database for MySQL server. The `MYSQL_HOST` name must be unique across all of Azure.

   >[!NOTE]
   >Although the command defines an administrator account, the account isn't used because the Microsoft Entra admin account does all administrative tasks.

   ```azurecli
   export MYSQL_ADMIN_USER=azureuser
   export MYSQL_ADMIN_PASSWORD="AdminPassword1"
   export RAND_ID=$RANDOM
   export MYSQL_HOST="mysql-mi-$RAND_ID"
   az mysql flexible-server create \
       --name $MYSQL_HOST \
       --resource-group $RESOURCE_GROUP \
       --location $LOCATION \
       --admin-user $MYSQL_ADMIN_USER \
       --admin-password $MYSQL_ADMIN_PASSWORD \
       --public-access 0.0.0.0 \
       --tier Burstable \
       --sku-name Standard_B1ms \
       --storage-size 32
   ```

1. Create a database named `checklist` for the application to use.

   ```azurecli
   export DATABASE_NAME="checklist"
   az mysql flexible-server db create \
       --resource-group $RESOURCE_GROUP \
       --server-name $MYSQL_HOST \
       --database-name $DATABASE_NAME
   ```

1. Open a firewall to allow connection to the database from your current IP address.

   ```azurecli
   # Create a temporary firewall rule to allow connections from your current machine to the MySQL server
   export MY_IP=$(curl http://whatismyip.akamai.com)
   az mysql flexible-server firewall-rule create \
       --resource-group $RESOURCE_GROUP \
       --name $MYSQL_HOST \
       --rule-name AllowCurrentMachineToConnect \
       --start-ip-address ${MY_IP} \
       --end-ip-address ${MY_IP}
   ```

1. Connect to the database and create the tables as specified in the */azure/init-db.sql* sample project file.

   ```azurecli
   export DATABASE_FQDN=${MYSQL_HOST}.mysql.database.azure.com
   export CURRENT_USER=$(az account show --query user.name --output tsv)
   export RDBMS_ACCESS_TOKEN=$(az account get-access-token \
       --resource-type oss-rdbms \
       --output tsv \
       --query accessToken)
   mysql -h "${DATABASE_FQDN}" --user "${CURRENT_USER}" --password="$RDBMS_ACCESS_TOKEN" < azure/init-db.sql
   ```

1. Remove the temporary firewall rule.

   ```azurecli
   az mysql flexible-server firewall-rule delete \
       --resource-group $RESOURCE_GROUP \
       --name $MYSQL_HOST \
       --rule-name AllowCurrentMachineToConnect
   ```

## Create an App Service resource

Create an App Service JBoss EAP resource on Linux. JBoss EAP requires a Premium `sku` tier.

```azurecli
# Create an App Service plan
export APPSERVICE_PLAN="mysql-mi-plan"
export APPSERVICE_NAME="mysql-mi-app"
az appservice plan create \
    --resource-group $RESOURCE_GROUP \
    --name $APPSERVICE_PLAN \
    --location $LOCATION \
    --sku P1V3 \
    --is-linux

# Create an App Service web app
az webapp create \
    --resource-group $RESOURCE_GROUP \
    --name $APPSERVICE_NAME \
    --plan $APPSERVICE_PLAN \
    --runtime "JBOSSEAP:7-java8"
```

## Create and configure a user-assigned managed identity

Use the following command to create an Azure user-assigned managed identity to use for Microsoft Entra authentication. For more information, see [Set up Microsoft Entra authentication for Azure Database for MySQL - Flexible Server](/azure/mysql/flexible-server/how-to-azure-ad).

```azurecli
export USER_IDENTITY_NAME="my-user-assigned-identity"
export IDENTITY_RESOURCE_ID=$(az identity create \
    --name $USER_IDENTITY_NAME \
    --resource-group $RESOURCE_GROUP \
    --query id \
    --output tsv)
```

Grant the new user-assigned identity `User.Read.All`, `GroupMember.Read.All`, and `Application.Read.All` permissions. Alternatively, give the identity the [Directory Readers](/entra/identity/role-based-access-control/permissions-reference#directory-readers) Microsoft Entra built-in role.

Azure CLI isn't supported for assigning Microsoft Entra permissions or roles. You can use the Microsoft Entra admin center, Microsoft Graph PowerShell, or Microsoft Graph API to create the assignments. For more information, see [Assign Microsoft Entra roles](/entra/identity/role-based-access-control/manage-roles-portal).

>[!NOTE]
>To add these assignments, you must have at least the **Privileged Role Administrator** role or permissions in your Microsoft Entra tenant. If you don't have this role, ask your **Global Administrator** or **Privileged Role Administrator** to grant the permissions.

## Use managed identity to connect the services

Use [Service Connector](overview.md) to connect your App Service JBoss EAP web app to the MySQL database with a managed identity. Service Connector does the following tasks in the background:

* Sets the current signed-in user as the Microsoft Entra database admin.
* Enables system-assigned managed identity for the app.
* Adds a database user for the system-assigned managed identity and grants all database privileges to this user.
* Adds a connection string named `AZURE_MYSQL_CONNECTIONSTRING` to the app's **App Settings**.

Use the following [az webapp connection create](/cli/azure/webapp/connection/create#az-webapp-connection-create-mysql-flexible) command to connect your app to the MySQL database using the managed identity.

```azurecli
az webapp connection create mysql-flexible \
    --resource-group $RESOURCE_GROUP \
    --name $APPSERVICE_NAME \
    --target-resource-group $RESOURCE_GROUP \
    --server $MYSQL_HOST \
    --database $DATABASE_NAME \
    --system-identity mysql-identity-id=$IDENTITY_RESOURCE_ID \
    --client-type java
```

## Build and deploy the app

1. Run the following code to add the passwordless authentication plugin to the connection string Service Connector generated. The app startup script references this connection string.

   ```azurecli
   export PASSWORDLESS_URL=$(\
       az webapp config appsettings list \
           --resource-group $RESOURCE_GROUP \
           --name $APPSERVICE_NAME \
       | jq -c '.[] \
       | select ( .name == "AZURE_MYSQL_CONNECTIONSTRING" ) \
       | .value' \
       | sed 's/"//g')
   # Create a new environment variable with the connection string including the passwordless authentication plugin
   export PASSWORDLESS_URL=${PASSWORDLESS_URL}'&defaultAuthenticationPlugin=com.azure.identity.extensions.jdbc.mysql.AzureMysqlAuthenticationPlugin&authenticationPlugins=com.azure.identity.extensions.jdbc.mysql.AzureMysqlAuthenticationPlugin'
   az webapp config appsettings set \
       --resource-group $RESOURCE_GROUP \
       --name $APPSERVICE_NAME \
       --settings "AZURE_MYSQL_CONNECTIONSTRING_PASSWORDLESS=${PASSWORDLESS_URL}"
   ```

1. Build the app by using the *pom.xml* file in the sample app to generate the WAR file.

   ```bash
   mvn clean package -DskipTests
   ```

1. Deploy the WAR file and the startup script to App Service.

   ```azurecli
   az webapp deploy \
       --resource-group $RESOURCE_GROUP \
       --name $APPSERVICE_NAME \
       --src-path target/ROOT.war \
       --type war
   az webapp deploy \
       --resource-group $RESOURCE_GROUP \
       --name $APPSERVICE_NAME \
       --src-path src/main/webapp/WEB-INF/createMySQLDataSource.sh \
       --type startup
   ```

## Test the app

1. Run the following code to create a list with some list items.

   ```bash
   export WEBAPP_URL=$(az webapp show \
       --resource-group $RESOURCE_GROUP \
       --name $APPSERVICE_NAME \
       --query defaultHostName \
       --output tsv)/$DATABASE_NAME
   
   # Create a list
   curl -X POST -H "Content-Type: application/json" -d '{"name": "list1","date": "2022-03-21T00:00:00","description": "Sample checklist"}' https://${WEBAPP_URL}
   
   # Create few items on the list 1
   curl -X POST -H "Content-Type: application/json" -d '{"description": "item 1"}' https://${WEBAPP_URL}/1/item
   curl -X POST -H "Content-Type: application/json" -d '{"description": "item 2"}' https://${WEBAPP_URL}/1/item
   curl -X POST -H "Content-Type: application/json" -d '{"description": "item 3"}' https://${WEBAPP_URL}/1/item
   ```

1. If you're working locally, run the following code to view the app:

   ```bash
   # Get all list items
   curl https://${WEBAPP_URL}
   
   # Get list item 1
   curl https://${WEBAPP_URL}/1
   ```

   Cloud Shell can't open a local browser, so if you're working in Cloud Shell, the easiest way to view the web app is to select the **Browse** or **Default domain** link near the top of the app's Azure portal page. Then append `/checklist` or `/checklist/1` to the end of the URL in your browser, for example `https://mysql-mi-app.azurewebsites.net/checklist`.

## Clean up resources

When you're done with this tutorial, you can avoid further charges by deleting the resources you created. Delete the resource group to delete all the resources it contains. Be sure you no longer need the resources before you run the command.

```azurecli
az group delete --name $RESOURCE_GROUP --no-wait
```

Deleting all the resources can take some time. The `--no-wait` argument allows the command to return immediately.

## Related content

- [Java in App Service Linux dev guide](/azure/app-service/configure-language-java-security?pivots=platform-linux)
- [Tutorial: Connect an Azure Spring Apps app to Azure Database for MySQL using Service Connector](tutorial-java-spring-mysql.md)
- [Tutorial: Deploy a Spring Boot app connected to Kafka Confluent Cloud with Service Connector](tutorial-java-spring-confluent-kafka.md)

