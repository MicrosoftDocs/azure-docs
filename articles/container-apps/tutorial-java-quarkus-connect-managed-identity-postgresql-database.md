---
title: 'Tutorial: Access data with managed identity in Java using Service Connector'
description: Secure Azure Database for PostgreSQL connectivity with managed identity from a sample Java Quarkus app, and deploy it to Azure Container Apps.
ms.devlang: java
author: KarlErickson
ms.topic: tutorial
ms.author: edburns
ms.service: azure-container-apps
ms.date: 02/03/2025
ms.custom: devx-track-azurecli, devx-track-extended-java, devx-track-java, devx-track-javaee, devx-track-javaee-quarkus, passwordless-java, service-connector, devx-track-javaee-quarkus-aca
---

# Tutorial: Connect to PostgreSQL Database from a Java Quarkus Container App without secrets using a managed identity

[Azure Container Apps](overview.md) provides a [managed identity](managed-identity.md) for your app, which is a turn-key solution for securing access to [Azure Database for PostgreSQL](/azure/postgresql/) and other Azure services. Managed identities in Container Apps make your app more secure by eliminating secrets from your app, such as credentials in the environment variables.

This tutorial walks you through the process of building, configuring, deploying, and scaling Java container apps on Azure. At the end of this tutorial, you have a [Quarkus](https://quarkus.io) application storing data in a [PostgreSQL](/azure/postgresql/) database with a managed identity running on [Container Apps](overview.md).

What you learn:

> [!div class="checklist"]
> * Configure a Quarkus app to authenticate using Microsoft Entra ID with a PostgreSQL Database.
> * Create an Azure container registry and push a Java app image to it.
> * Create a Container App in Azure.
> * Create a PostgreSQL database in Azure.
> * Connect to a PostgreSQL Database with managed identity using Service Connector.

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## 1. Prerequisites

* [Azure CLI](/cli/azure/install-azure-cli) version 2.45.0 or higher.
* [Git](https://git-scm.com/)
* [Java JDK](/azure/developer/java/fundamentals/java-support-on-azure)
* [Maven](https://maven.apache.org)
* [Docker](https://docs.docker.com/get-docker/)

## 2. Create a container registry

Create a resource group with the [az group create](/cli/azure/group#az-group-create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named `myResourceGroup` in the East US Azure region.

```azurecli
RESOURCE_GROUP="myResourceGroup"
LOCATION="eastus"

az group create --name $RESOURCE_GROUP --location $LOCATION
```

Create an Azure container registry instance using the [az acr create](/cli/azure/acr#az-acr-create) command and retrieve its login server using the [az acr show](/cli/azure/acr#az-acr-show) command. The registry name must be unique within Azure and contain 5-50 alphanumeric characters. All letters must be specified in lower case. In the following example, `mycontainerregistry007` is used. Update this to a unique value.

```azurecli
REGISTRY_NAME=mycontainerregistry007
az acr create \
    --resource-group $RESOURCE_GROUP \
    --name $REGISTRY_NAME \
    --sku Basic

REGISTRY_SERVER=$(az acr show \
    --name $REGISTRY_NAME \
    --query 'loginServer' \
    --output tsv | tr -d '\r')
```

## 3. Clone the sample app and prepare the container image

This tutorial uses a sample Fruits list app with a web UI that calls a Quarkus REST API backed by [Azure Database for PostgreSQL](/azure/postgresql/). The code for the app is available [on GitHub](https://github.com/quarkusio/quarkus-quickstarts/tree/main/hibernate-orm-panache-quickstart). To learn more about writing Java apps using Quarkus and PostgreSQL, see the [Quarkus Hibernate ORM with Panache Guide](https://quarkus.io/guides/hibernate-orm-panache) and the [Quarkus Datasource Guide](https://quarkus.io/guides/datasource).

Run the following commands in your terminal to clone the sample repo and set up the sample app environment.

```git
git clone https://github.com/quarkusio/quarkus-quickstarts
cd quarkus-quickstarts/hibernate-orm-panache-quickstart
```

### Modify your project

1. Add the required dependencies to your project's POM file.

   ```xml
   <dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-identity-extensions</artifactId>
      <version>1.1.20</version>
   </dependency>
   ```

1. Configure the Quarkus app properties.

   The Quarkus configuration is located in the *src/main/resources/application.properties* file. Open this file in your editor, and observe several default properties. The properties prefixed with `%prod` are only used when the application is built and deployed, for example when deployed to Azure App Service. When the application runs locally, `%prod` properties are ignored. Similarly, `%dev` properties are used in Quarkus' Live Coding / Dev mode, and `%test` properties are used during continuous testing.

   Delete the existing content in *application.properties* and replace with the following to configure the database for dev, test, and production modes:

   ```properties
   quarkus.hibernate-orm.database.generation=drop-and-create
   quarkus.datasource.db-kind=postgresql
   quarkus.datasource.jdbc.max-size=8
   quarkus.datasource.jdbc.min-size=2
   quarkus.hibernate-orm.log.sql=true
   quarkus.hibernate-orm.sql-load-script=import.sql
   quarkus.datasource.jdbc.acquisition-timeout = 10

   %dev.quarkus.datasource.username=${CURRENT_USERNAME}
   %dev.quarkus.datasource.jdbc.url=jdbc:postgresql://${AZURE_POSTGRESQL_HOST}:${AZURE_POSTGRESQL_PORT}/${AZURE_POSTGRESQL_DATABASE}?\
   authenticationPluginClassName=com.azure.identity.extensions.jdbc.postgresql.AzurePostgresqlAuthenticationPlugin\
   &sslmode=require

   %prod.quarkus.datasource.username=${AZURE_POSTGRESQL_USERNAME}
   %prod.quarkus.datasource.jdbc.url=jdbc:postgresql://${AZURE_POSTGRESQL_HOST}:${AZURE_POSTGRESQL_PORT}/${AZURE_POSTGRESQL_DATABASE}?\
   authenticationPluginClassName=com.azure.identity.extensions.jdbc.postgresql.AzurePostgresqlAuthenticationPlugin\
   &sslmode=require

   %dev.quarkus.class-loading.parent-first-artifacts=com.azure:azure-core::jar,\
   com.azure:azure-core-http-netty::jar,\
   io.projectreactor.netty:reactor-netty-core::jar,\
   io.projectreactor.netty:reactor-netty-http::jar,\
   io.netty:netty-resolver-dns::jar,\
   io.netty:netty-codec::jar,\
   io.netty:netty-codec-http::jar,\
   io.netty:netty-codec-http2::jar,\
   io.netty:netty-handler::jar,\
   io.netty:netty-resolver::jar,\
   io.netty:netty-common::jar,\
   io.netty:netty-transport::jar,\
   io.netty:netty-buffer::jar,\
   com.azure:azure-identity::jar,\
   com.azure:azure-identity-extensions::jar,\
   com.fasterxml.jackson.core:jackson-core::jar,\
   com.fasterxml.jackson.core:jackson-annotations::jar,\
   com.fasterxml.jackson.core:jackson-databind::jar,\
   com.fasterxml.jackson.dataformat:jackson-dataformat-xml::jar,\
   com.fasterxml.jackson.datatype:jackson-datatype-jsr310::jar,\
   org.reactivestreams:reactive-streams::jar,\
   io.projectreactor:reactor-core::jar,\
   com.microsoft.azure:msal4j::jar,\
   com.microsoft.azure:msal4j-persistence-extension::jar,\
   org.codehaus.woodstox:stax2-api::jar,\
   com.fasterxml.woodstox:woodstox-core::jar,\
   com.nimbusds:oauth2-oidc-sdk::jar,\
   com.nimbusds:content-type::jar,\
   com.nimbusds:nimbus-jose-jwt::jar,\
   net.minidev:json-smart::jar,\
   net.minidev:accessors-smart::jar,\
   io.netty:netty-transport-native-unix-common::jar,\
   net.java.dev.jna:jna::jar
   ```

### Build and push a Docker image to the container registry

1. Build the container image.

   Run the following command to build the Quarkus app image. You must tag it with the fully qualified name of your registry login server.

   ```bash
   CONTAINER_IMAGE=${REGISTRY_SERVER}/quarkus-postgres-passwordless-app:v1

   mvn quarkus:add-extension -Dextensions="container-image-jib"
   mvn clean package -Dquarkus.container-image.build=true -Dquarkus.container-image.image=${CONTAINER_IMAGE}
   ```

1. Log in to the registry.

   Before pushing container images, you must log in to the registry. To do so, use the [az acr login][az-acr-login] command.

   ```azurecli
   az acr login --name $REGISTRY_NAME
   ```

   The command returns a `Login Succeeded` message once completed.

1. Push the image to the registry.

   Use `docker push` to push the image to the registry instance. This example creates the `quarkus-postgres-passwordless-app` repository, containing the `quarkus-postgres-passwordless-app:v1` image.

   ```bash
   docker push $CONTAINER_IMAGE
   ```

## 4. Create a Container App on Azure

1. Create a Container Apps instance by running the following command. Make sure you replace the value of the environment variables with the actual name and location you want to use.

   ```azurecli
   CONTAINERAPPS_ENVIRONMENT="my-environment"

   az containerapp env create \
       --resource-group $RESOURCE_GROUP \
       --name $CONTAINERAPPS_ENVIRONMENT \
       --location $LOCATION
   ```

1. Create a container app with your app image by running the following command:

   ```azurecli
   APP_NAME=my-container-app
   az containerapp create \
       --resource-group $RESOURCE_GROUP \
       --name $APP_NAME \
       --image $CONTAINER_IMAGE \
       --environment $CONTAINERAPPS_ENVIRONMENT \
       --registry-server $REGISTRY_SERVER \
       --registry-identity system \
       --ingress 'external' \
       --target-port 8080 \
       --min-replicas 1
   ```
   
   > [!NOTE]
   > The options `--registry-username` and `--registry-password` are still supported but aren't recommended because using the identity system is more secure.

## 5. Create and connect a PostgreSQL database with identity connectivity

Next, create a PostgreSQL Database and configure your container app to connect to a PostgreSQL Database with a system-assigned managed identity. The Quarkus app connects to this database and stores its data when running, persisting the application state no matter where you run the application.

1. Create the database service.

   ```azurecli
   DB_SERVER_NAME='msdocs-quarkus-postgres-webapp-db'

   az postgres flexible-server create \
       --resource-group $RESOURCE_GROUP \
       --name $DB_SERVER_NAME \
       --location $LOCATION \
       --public-access None \
       --sku-name Standard_B1ms \
       --tier Burstable \
       --active-directory-auth Enabled
   ```
   
   > [!NOTE]
   > The options `--admin-user` and `--admin-password` are still supported but aren't recommended because using the identity system is more secure.

   The following parameters are used in the above Azure CLI command:

   * *resource-group* &rarr; Use the same resource group name in which you created the web app - for example, `msdocs-quarkus-postgres-webapp-rg`.
   * *name* &rarr; The PostgreSQL database server name. This name must be **unique across all Azure** (the server endpoint becomes `https://<name>.postgres.database.azure.com`). Allowed characters are `A`-`Z`, `0`-`9`, and `-`. A good pattern is to use a combination of your company name and server identifier. (`msdocs-quarkus-postgres-webapp-db`)
   * *location* &rarr; Use the same location used for the web app. Change to a different location if it doesn't work.
   * *public-access* &rarr; `None` which sets the server in public access mode with no firewall rules. Rules are created in a later step.
   * *sku-name* &rarr; The name of the pricing tier and compute configuration - for example, `Standard_B1ms`. For more information, see [Azure Database for PostgreSQL pricing](https://azure.microsoft.com/pricing/details/postgresql/server/).
   * *tier* &rarr; The compute tier of the server. For more information, see [Azure Database for PostgreSQL pricing](https://azure.microsoft.com/pricing/details/postgresql/server/).
   * *active-directory-auth* &rarr; `Enabled` to enable Microsoft Entra authentication.

1. Create a database named `fruits` within the PostgreSQL service with this command:

   ```azurecli
   DB_NAME=fruits
   az postgres flexible-server db create \
       --resource-group $RESOURCE_GROUP \
       --server-name $DB_SERVER_NAME \
       --database-name $DB_NAME
   ```

1. Install the [Service Connector](../service-connector/overview.md) passwordless extension for the Azure CLI:

   ```azurecli
   az extension add --name serviceconnector-passwordless --upgrade --allow-preview true
   ```

1. Connect the database to the container app with a system-assigned managed identity, using the connection command.

   ```azurecli
   az containerapp connection create postgres-flexible \
       --resource-group $RESOURCE_GROUP \
       --name $APP_NAME \
       --target-resource-group $RESOURCE_GROUP \
       --server $DB_SERVER_NAME \
       --database $DB_NAME \
       --system-identity \
       --container $APP_NAME
   ```

## 6. Review your changes

You can find the application URL(FQDN) by using the following command:

```azurecli
echo https://$(az containerapp show \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --query properties.configuration.ingress.fqdn \
    --output tsv)
```

When the new webpage shows your list of fruits, your app is connecting to the database using the managed identity. You should now be able to edit fruit list as before.

[!INCLUDE [cli-samples-clean-up](../../includes/cli-samples-clean-up.md)]

## Next steps

Learn more about running Java apps on Azure in the developer guide.

> [!div class="nextstepaction"]
> [Azure for Java Developers](/java/azure/)
