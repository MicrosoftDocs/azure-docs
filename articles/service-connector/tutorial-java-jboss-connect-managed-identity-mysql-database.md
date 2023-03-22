---
title: 'Tutorial: Access data with managed identity in Java'
description: Secure Azure Database for MySQL connectivity with managed identity from a sample Java JBoss EAP app, and apply it to other Azure services.
ms.devlang: java
ms.topic: tutorial
ms.date: 03/20/2023
ms.service: service-connector
author: XiaofanZhou
ms.author: xiaofanzhou
ms.custom: passwordless-java, service-connector
---

# Tutorial: Connect to a MySQL Database from Java Tomcat App Service without secrets using a managed identity

[Azure App Service](overview.md) provides a highly scalable, self-patching web hosting service in Azure. It also provides a [managed identity](overview-managed-identity.md) for your app, which is a turn-key solution for securing access to [Azure Database for MySQL](../mysql/index.yml) and other Azure services. Managed identities in App Service make your app more secure by eliminating secrets from your app, such as credentials in the environment variables. In this tutorial, you will learn how to:

> [!div class="checklist"]
> * Create a MySQL database.
> * Deploy the sample app to Azure App Service on Tomcat using WAR packaging.
> * Configure a Spring Boot web application to use Azure AD authentication with MySQL Database.
> * Connect to MySQL Database with Managed Identity using Service Connector.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* [Git](https://git-scm.com/)
* [Java JDK](/azure/developer/java/fundamentals/java-support-on-azure)
* [Maven](https://maven.apache.org)
* [Azure CLI](/cli/azure/install-azure-cli) version 2.46.0 or higher.

## Clone the sample app and prepare the repo

Run the following commands in your terminal to clone the sample repo and set up the sample app environment.

```bash
git clone https://github.com/Azure-Samples/Passwordless-Connections-for-Java-Apps
cd Passwordless-Connections-for-Java-Apps/JakartaEE/jboss-eap/
```

## Create an Azure Database for MySQL

Follow these steps to create an Azure Database for MySQL in your subscription. The Spring Boot app will connect to this database and store its data when running, persisting the application state no matter where you run the application.

1. Sign into the Azure CLI, and optionally set your subscription if you have more than one connected to your login credentials.

   ```azurecli-interactive
   az login
   az account set --subscription <subscription-ID>
   ```

1. Create an Azure Resource Group, noting the resource group name.

   ```azurecli-interactive
   RESOURCE_GROUP=<resource-group-name>
   LOCATION=eastus

   az group create --name $RESOURCE_GROUP --location $LOCATION
   ```

1. Create an Azure Database for MySQL server. The server is created with an administrator account, but it won't be used because we'll use the Azure Active Directory (Azure AD) admin account to perform administrative tasks.

    ```azurecli-interactive
    MYSQL_ADMIN_USER=azureuser
    # MySQL admin access rights won't be used because Azure AD authentication is leveraged to administer the database.
    MYSQL_ADMIN_PASSWORD=<admin-password>
    MYSQL_HOST=<mysql-host-name>

    # Create a MySQL server.
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


1. Create a database for the application.


    ```azurecli-interactive
    DATABASE_NAME=checklist

    az mysql flexible-server db create \
        --resource-group $RESOURCE_GROUP \
        --server-name $MYSQL_HOST \
        --database-name $DATABASE_NAME
    ```

## Create an App Service

Create an Azure App Service resource on Linux. JBoss EAP requires Premium SKU.

   ```azurecli-interactive
   APPSERVICE_PLAN=<app-service-plan>
   APPSERVICE_NAME=<app-service-name>
   # Create an App Service plan
   az appservice plan create \
       --resource-group $RESOURCE_GROUP \
       --name $APPSERVICE_PLAN \
       --location $LOCATION \
       --sku P1V3 \
       --is-linux

   # Create an App Service resource.
   az webapp create \
       --resource-group $RESOURCE_GROUP \
       --name $APPSERVICE_NAME \
       --plan $APPSERVICE_PLAN \
       --runtime "JBOSSEAP:7-java8"
   ```


## Connect the MySQL database with identity connectivity

Next, connect the database using [Service Connector](../service-connector/overview.md).

Install the Service Connector passwordless extension for the Azure CLI:

```azurecli
az extension add --name serviceconnector-passwordless --upgrade
```

Then, connect your app to a MySQL database with a system-assigned managed identity using Service Connector.

To do this, run the [az webapp connection create](/cli/azure/webapp/connection/create#az-webapp-connection-create-mysql-flexible) command.

```azurecli-interactive
az webapp connection create mysql-flexible \
    --resource-group $RESOURCE_GROUP \
    --name $APPSERVICE_NAME \
    --target-resource-group $RESOURCE_GROUP \
    --server $MYSQL_HOST \
    --database $DATABASE_NAME \
    --system-identity
```

This command creates a connection between your web app and your MySQL server, and manages authentication through a system-assigned managed identity.

## Deploy the application

Following these steps to prepare data in database and deploy the application.
### Create Database schema
1. Open firewall to allow connection from current IP address

```azurecli
# Create a temporary firewall rule to allow connections from current machine to the MySQL server
MY_IP=$(curl http://whatismyip.akamai.com)
az mysql flexible-server firewall-rule create --resource-group $RESOURCE_GROUP --name $MYSQL_HOST --rule-name AllowCurrentMachineToConnect --start-ip-address ${MY_IP} --end-ip-address ${MY_IP}
```
1. Connect to database and create tables

```azurecli
RDBMS_ACCESS_TOKEN=$(az account get-access-token --resource-type oss-rdbms --output tsv --query accessToken)
mysql -h "${DATABASE_FQDN}" --user "${CURRENT_USER}" --enable-cleartext-plugin --password="$RDBMS_ACCESS_TOKEN" < init-db.sql
```

1. Remove temporary firewall rule
```azurecli
az mysql flexible-server firewall-rule delete --resource-group $RESOURCE_GROUP --name $MYSQL_HOST --rule-name AllowCurrentMachineToConnect
```

### Deploy the application

1. Update the connection string in App Settings
 
Get the connection string generated by the service connector and add passwordless authentication plugin. This connection string will be referenced in the startup script.
```azurecli-interactive
PASSWORDLESS_URL=$(az webapp config appsettings list --resource-group $RESOURCE_GROUP --name $APPSERVICE_NAME | jq -c '.[] | select ( .name == "AZURE_MYSQL_CONNECTIONSTRING" ) | .value' | sed 's/"//g')
# Create a new environment variable with the connection string including the passwordless authentication plugin
PASSWORDLESS_URL=${PASSWORDLESS_URL}'&defaultAuthenticationPlugin=com.azure.identity.extensions.jdbc.mysql.AzureMysqlAuthenticationPlugin&authenticationPlugins=com.azure.identity.extensions.jdbc.mysql.AzureMysqlAuthenticationPlugin'
az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $APPSERVICE_NAME --settings "AZURE_MYSQL_CONNECTIONSTRING_PASSWORDLESS=${PASSWORDLESS_URL}"
```

1. The sample app contains a *pom.xml* file that can generate the WAR file. Run the following command to build the app.

```bash
mvn clean package -DskipTests -f ../pom.xml
```

1. Deploy the WAR and the startup script to the app service
```azurecli
az webapp deploy --resource-group $RESOURCE_GROUP --name $APPSERVICE_NAME --src-path ../target/ROOT.war --type war
az webapp deploy --resource-group $RESOURCE_GROUP --name $APPSERVICE_NAME --src-path ../src/main/webapp/WEB-INF/createMySQLDataSource.sh --type startup
```

## View sample web app

Run the following command to open the deployed web app in your browser.

```azurecli-interactive
az webapp browse \
    --resource-group $RESOURCE_GROUP \
    --name $APPSERVICE_NAME
```

[!INCLUDE [cli-samples-clean-up](../../includes/cli-samples-clean-up.md)]

## Next steps

Learn more about running Java apps on App Service on Linux in the developer guide.

> [!div class="nextstepaction"]
> [Java in App Service Linux dev guide](configure-language-java.md?pivots=platform-linux)

Learn how to secure your app with a custom domain and certificate.

> [!div class="nextstepaction"]
> [Secure with custom domain and certificate](tutorial-secure-domain-certificate.md)
