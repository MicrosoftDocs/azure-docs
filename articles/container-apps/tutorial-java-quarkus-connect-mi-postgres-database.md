---
title: 'Tutorial: Access data with managed identity in Java using Service Connector'
description: Secure Azure Database for PostgreSQL connectivity with managed identity from a sample Java Quarkus app, and also how to deploy it to Azure Container Apps.
ms.devlang: java
author: shizn
ms.topic: tutorial
ms.author: xshi
ms.service: container-apps
ms.date: 09/22/2022
---
# Tutorial: Connect to PostgreSQL Database from Java Quarkus Container App without secrets using a managed identity

[Container Apps](overview.md) provides a [managed identity](managed-identity.md) for your app, which is a turn-key solution for securing access to [Azure Database for PostgreSQL](/azure/postgresql/) and other Azure services. Managed identities in Container Apps make your app more secure by eliminating secrets from your app, such as credentials in the environment variables. 

This tutorial walks you through the process of building, configuring, deploying, and scaling Java container apps on Azure. 
When you are finished, you will have a [Quarkus](https://quarkus.io) application storing data in [PostgreSQL](../postgresql/index.yml) database with Managed Identity running on [Container Apps](overview.md).

What you will learn:

> [!div class="checklist"]

> * Configure Quarkus app to use Azure AD authentication with PostgreSQL Database
> * Create a Azure Container Registry and push Java app image to it
> * Create a Container App on Azure
> * Create a PostgreSQL database on Azure
> * Connect to PostgreSQL Database with Managed Identity using Service Connector

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## 1. Prerequisites

* [Azure CLI](/cli/azure/overview). This quickstart requires that you are running the Azure CLI (version 2.0.55 or later recommended). Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli].
* [Git](https://git-scm.com/)
* [Java JDK](/azure/developer/java/fundamentals/java-support-on-azure)
* [Maven](https://maven.apache.org)
* [Docker](https://docs.docker.com/get-docker/)
* [GraalVM](https://www.graalvm.org/downloads/)


## 2. Create a Container Registry

Create a resource group with the [az group create][az-group-create] command. An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli
az group create --name myResourceGroup --location eastus
```

Create an ACR instance using the [az acr create][az-acr-create] command. The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. In the following example, *myContainerRegistry007* is used. Update this to a unique value.

```azurecli
az acr create --resource-group myResourceGroup --name myContainerRegistry007 --sku Basic
```


## 3. Clone the sample app and prepare the container image

This tutorial uses a sample Fruits list app with a web UI that calls a Quarkus REST API backed by [Azure Database for PostgreSQL](../postgresql/index.yml). The code for the app is available [on GitHub](https://github.com/quarkusio/quarkus-quickstarts/tree/main/hibernate-orm-panache-quickstart). To learn more about writing Java apps using Quarkus and PostgreSQL, see the [Quarkus Hibernate ORM with Panache Guide](https://quarkus.io/guides/hibernate-orm-panache) and the [Quarkus Datasource Guide](https://quarkus.io/guides/datasource).


Run the following commands in your terminal to clone the sample repo and set up the sample app environment.

```bash
git clone https://github.com/quarkusio/quarkus-quickstarts
cd quarkus-quickstarts/hibernate-orm-panache-quickstart
```


### Modify your project

1. Add the required dependencies to your project's BOM file.

    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity-providers-jdbc-postgresql</artifactId>
        <version>1.0.0-beta.1</version>
    </dependency>
    ```

1. Configure the Quarkus app properties

    Quarkus configuration is located in the `src/main/resources/application.properties` file. Open this file in your editor, and observe several default properties. The properties prefixed with `%prod` are only used when the application is built and deployed, for example when deployed to Azure App Service. When the application runs locally, `%prod` properties are ignored.  Similarly, `%dev` properties are used in Quarkus' Live Coding / Dev mode, and `%test` properties are used during continuous testing.

    Delete the existing content in `application.properties` and replace with the following to configure our database for dev, test, and production modes:

    ```properties
    quarkus.package.type=uber-jar

    quarkus.hibernate-orm.database.generation=drop-and-create
    quarkus.datasource.db-kind=postgresql
    quarkus.datasource.jdbc.max-size=8
    quarkus.datasource.jdbc.min-size=2
    quarkus.hibernate-orm.log.sql=true
    quarkus.hibernate-orm.sql-load-script=import.sql
    quarkus.datasource.jdbc.acquisition-timeout = 10

    %dev.quarkus.datasource.username=${AZURE_CLIENT_NAME}@${DBHOST}
    %dev.quarkus.datasource.jdbc.url=jdbc:postgresql://${DBHOST}.postgres.database.azure.com:5432/${DBNAME}?\
    authenticationPluginClassName=com.azure.identity.providers.postgresql.AzureIdentityPostgresqlAuthenticationPlugin\
    &sslmode=require\
    &azure.clientId=${AZURE_CLIENT_ID}\
    &azure.clientSecret=${AZURE_CLIENT_SECRET}\
    &azure.tenantId=${AZURE_TENANT_ID}

    %prod.quarkus.datasource.username=${AZURE_MI_NAME}@${DBHOST}
    %prod.quarkus.datasource.jdbc.url=jdbc:postgresql://${DBHOST}.postgres.database.azure.com:5432/${DBNAME}?\
    authenticationPluginClassName=com.azure.identity.providers.postgresql.AzureIdentityPostgresqlAuthenticationPlugin\
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
    com.azure:azure-identity-providers-core::jar,\
    com.azure:azure-identity-providers-jdbc-postgresql::jar,\
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
    io.netty:netty-transport-native-unix-common::jar
    ```

### Build and push Docker Image to the container registry

1. Build the container image

    Run the following command to build the Quarkus app image. You must tag it with the fully qualified name of your registry login server. The login server name is in the format *\<registry-name\>.azurecr.io* (must be all lowercase), for example, *myContainerRegistry007.azurecr.io*. Replace the name with your own registry name.

    ```
    docker build -t myContainerRegistry007.azurecr.io/quarkus-postgres-passwordless-app:v1
    ```

1. Log in to registry

    Before pushing container images, you must log in to the registry. To do so, use the [az acr login][az-acr-login] command. Specify only the registry resource name when logging in with the Azure CLI. Don't use the fully qualified login server name. 

    ```azurecli
    az acr login --name <registry-name>
    ```

    The command returns a `Login Succeeded` message once completed.

1. Push image to registry

    Use [docker push][docker-push] to push the image to the registry instance. Replace `myContainerRegistry007` with the login server name of your registry instance. This example creates the **quarkus-postgres-passwordless-app** repository, containing the `quarkus-postgres-passwordless-app:v1` image.

    ```
    docker push myContainerRegistry007/quarkus-postgres-passwordless-app:v1
    ```

## 4. Create a Container App on Azure

1. Create Container Apps by run the following command. Make sure you replace the environment variables value with the actual name and location you want to use.

    ```azurecli
    RESOURCE_GROUP="myResourceGroup"
    LOCATION="eastus"
    CONTAINERAPPS_ENVIRONMENT="my-environment"

    az containerapp env create \
    --name $CONTAINERAPPS_ENVIRONMENT \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION
    ```

1. Create a container app with your app image by running the following command. Replace the placeholders with your values. To find Container Registry admin account details, please check [Authenticate with an Azure container registry](../container-registry/container-registry-authentication.md)

    ```azurecli
    CONTAINER_IMAGE_NAME=quarkus-postgres-passwordless-app:v1
    REGISTRY_SERVER=myContainerRegistry007
    REGISTRY_USERNAME=<REGISTRY_USERNAME>
    REGISTRY_PASSWORD=<REGISTRY_PASSWORD>

    az containerapp create \
    --name my-container-app \
    --resource-group $RESOURCE_GROUP \
    --image $CONTAINER_IMAGE_NAME \
    --environment $CONTAINERAPPS_ENVIRONMENT \
    --registry-server $REGISTRY_SERVER \
    --registry-username $REGISTRY_USERNAME \
    --registry-password $REGISTRY_PASSWORD
    ```

## 5. Create and Connect Postgres Database with identity connectivity

Next, you create a Postgres Database and configure your container app to connect to SQL Database with a system-assigned managed identity. The Quarkus app will connect to this database and store its data when running, persisting the application state no matter where you run the application.

1. Create the database service.

    ```azurecli
    DB_SERVER_NAME='msdocs-quarkus-postgres-webapp-db'
    ADMIN_USERNAME='demoadmin'
    ADMIN_PASSWORD='<admin-password>'

    az postgres server create \
        --resource-group $RESOURCE_GROUP \
        --name $DB_SERVER_NAME \
        --location $LOCATION \
        --admin-user $DB_USERNAME \
        --admin-password $DB_PASSWORD \
        --sku-name GP_Gen5_2
    ```

    The following parameters are used in the above Azure CLI command:

   * *resource-group* &rarr; Use the same resource group name in which you created the web app, for example `msdocs-quarkus-postgres-webapp-rg`.
   * *name* &rarr; The PostgreSQL database server name. This name must be **unique across all Azure** (the server endpoint becomes `https://<name>.postgres.database.azure.com`). Allowed characters are `A`-`Z`, `0`-`9`, and `-`. A good pattern is to use a combination of your company name and server identifier. (`msdocs-quarkus-postgres-webapp-db`)
   * *location* &rarr; Use the same location used for the web app.
   * *admin-user* &rarr; Username for the administrator account. It can't be `azure_superuser`, `admin`, `administrator`, `root`, `guest`, or `public`. For example, `demoadmin` is okay.
   * *admin-password* Password of the administrator user. It must contain 8 to 128 characters from three of the following categories: English uppercase letters, English lowercase letters, numbers, and non-alphanumeric characters.

       > [!IMPORTANT]
       > When creating usernames or passwords **do not** use the `$` character. Later you create environment variables with these values where the `$` character has special meaning within the Linux container used to run Java apps.

   * *public-access* &rarr; `None` which sets the server in public access mode with no firewall rules. Rules will be created in a later step.
   * *sku-name* &rarr; The name of the pricing tier and compute configuration, for example `GP_Gen5_2`. For more information, see [Azure Database for PostgreSQL pricing](https://azure.microsoft.com/pricing/details/postgresql/server/).

1. Create a database named `fruits` within the Postgres service with this command:

    ```azurecli
    az postgres db create \
        --resource-group $RESOURCE_GROUP \
        --server-name $DB_SERVER_NAME \
        --name fruits
    ```

1. Connect database to container app with a system-assigned managed identity with connection command.

    ```azurecli
    az containerapp connection create postgres -g $RESOURCE_GROUP \
    -n my-container-app 
    --tg $RESOURCE_GROUP \
    --server DB_SERVER_NAME 
    --database fruits 
    --managed-identity
    ```

## 6. Review your changes

You can find the application URL(FQDN) by using the following command:

    ```
    az containerapp list -g $RESOURCE_GROUP
    ```

When the new webpage shows your fruit list, your app is connecting to the database using the managed identity. You should now be able to edit fruit list as before.

[!INCLUDE [cli-samples-clean-up](../../includes/cli-samples-clean-up.md)]


## Next steps