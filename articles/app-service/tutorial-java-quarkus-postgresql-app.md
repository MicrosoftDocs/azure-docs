---
title: 'Tutorial: Linux Java app with Quarkus and PostgreSQL'
description: Learn how to get a data-driven Linux Quarkus app working in Azure App Service, with connection to a PostgreSQL running in Azure.
author: denvermb
ms.author: dbrittain
ms.devlang: java
ms.topic: tutorial
ms.date: 5/27/2022
ms.custom: mvc, devx-track-azurecli, devx-track-extended-java, AppServiceConnectivity
---

# Tutorial: Build a Quarkus web app with Azure App Service on Linux and PostgreSQL

This tutorial walks you through the process of building, configuring, deploying, and scaling Java web apps on Azure.
When you are finished, you will have a [Quarkus](https://quarkus.io) application storing data in [PostgreSQL](../postgresql/index.yml) database running on [Azure App Service on Linux](overview.md).

:::image type="content" source="./media/tutorial-java-quarkus-postgresql/quarkus-crud-running-locally.png" alt-text="Screenshot of Quarkus application storing data in PostgreSQL.":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a App Service on Azure
> * Create a PostgreSQL database on Azure
> * Deploy the sample app to Azure App Service
> * Connect a sample app to the database
> * Stream diagnostic logs from App Service
> * Add additional instances to scale out the sample app

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* [Azure CLI](/cli/azure/overview), installed on your own computer.
* [Git](https://git-scm.com/)
* [Java JDK](/azure/developer/java/fundamentals/java-support-on-azure)
* [Maven](https://maven.apache.org)

## Clone the sample app and prepare the repo

This tutorial uses a sample Fruits list app with a web UI that calls a Quarkus REST API backed by [Azure Database for PostgreSQL](../postgresql/index.yml). The code for the app is available [on GitHub](https://github.com/quarkusio/quarkus-quickstarts/tree/main/hibernate-orm-panache-quickstart). To learn more about writing Java apps using Quarkus and PostgreSQL, see the [Quarkus Hibernate ORM with Panache Guide](https://quarkus.io/guides/hibernate-orm-panache) and the [Quarkus Datasource Guide](https://quarkus.io/guides/datasource).

Run the following commands in your terminal to clone the sample repo and set up the sample app environment.

```bash
git clone https://github.com/quarkusio/quarkus-quickstarts
cd quarkus-quickstarts/hibernate-orm-panache-quickstart
```

## Create an App Service on Azure

1. Sign in to your Azure CLI, and optionally set your subscription if you have more than one connected to your sign-in credentials.

    ```azurecli
    az login
    az account set -s <your-subscription-id>
    ```

2. Create an Azure Resource Group, noting the resource group name (referred to with `$RESOURCE_GROUP` later on)

    ```azurecli
    az group create \
        --name <a-resource-group-name> \
        --location <a-resource-group-region>
    ```

3. Create an App Service Plan. The App Service Plan is the compute container, it determines your cores, memory, price, and scale.

    ```azurecli
    az appservice plan create \
        --name "quarkus-tutorial-app-service-plan" \
        --resource-group $RESOURCE_GROUP \
        --sku B2 \
        --is-linux
    ```

4. Create an app service within the App Service Plan.

    ```azurecli
        WEBAPP_NAME=<a unique name>
        az webapp create \
        --name $WEBAPP_NAME \
        --resource-group $RESOURCE_GROUP \
        --runtime "JAVA|11-java11" \
        --plan "quarkus-tutorial-app-service-plan"
    ```

> [!IMPORTANT]
> The `WEBAPP_NAME` must be **unique across all Azure**. A good pattern is to use a combination of your company name or initials of your name along with a good webapp name, for example `johndoe-quarkus-app`.

## Create an Azure PostgreSQL Database

Follow these steps to create an Azure PostgreSQL database in your subscription. The Quarkus Fruits app will connect to this database and store its data when running, persisting the application state no matter where you run the application.

1. Create the database service.

    ```azurecli
    DB_SERVER_NAME='msdocs-quarkus-postgres-webapp-db'
    ADMIN_USERNAME='demoadmin'
    ADMIN_PASSWORD='<admin-password>'

    az postgres server create \
        --resource-group $RESOURCE_GROUP \
        --name $DB_SERVER_NAME \
        --location $LOCATION \
        --admin-user $ADMIN_USERNAME \
        --admin-password $ADMIN_PASSWORD \
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

2. Configure the firewall rules on your server by using the [az postgres server firewall-rule create](/cli/azure/postgres/flexible-server/firewall-rule) command to give your local environment access to connect to the server.

    ```azurecli
    az postgres server firewall-rule create \
    --resource-group $RESOURCE_GROUP_NAME \
    --server-name $DB_SERVER_NAME \
    --name AllowMyIP \
    --start-ip-address <your IP> \
    --end-ip-address <your IP>
    ```

    Also, once your application runs on App Service, you'll need to give it access as well. run the following command to allow access to the database from services within Azure:

    ```azurecli
    az postgres server firewall-rule create \
      --resource-group $RESOURCE_GROUP_NAME \
      --server-name $DB_SERVER_NAME \
      --name AllowAllWindowsAzureIps \
      --start-ip-address 0.0.0.0 \
      --end-ip-address 0.0.0.0
    ```

3. Create a database named `fruits` within the Postgres service with this command:

    ```azurecli
    az postgres db create \
        --resource-group $RESOURCE_GROUP \
        --server-name $DB_SERVER_NAME \
        --name fruits
    ```

## Configure the Quarkus app properties

Quarkus configuration is located in the `src/main/resources/application.properties` file. Open this file in your editor, and observe several default properties. The properties prefixed with `%prod` are only used when the application is built and deployed, for example when deployed to Azure App Service. When the application runs locally, `%prod` properties are ignored.  Similarly, `%dev` properties are used in Quarkus' Live Coding / Dev mode, and `%test` properties are used during continuous testing.

Delete the existing content in `application.properties` and replace with the following to configure our database for dev, test, and production modes:

```properties
quarkus.package.type=uber-jar
%dev.quarkus.datasource.db-kind=h2
%dev.quarkus.datasource.jdbc.url=jdbc:h2:mem:fruits

%test.quarkus.datasource.db-kind=h2
%test.quarkus.datasource.jdbc.url=jdbc:h2:mem:fruits

%prod.quarkus.datasource.db-kind=postgresql
%prod.quarkus.datasource.jdbc.url=jdbc:postgresql://${DBHOST}.postgres.database.azure.com:5432/${DBNAME}?user=${DBUSER}@${DBHOST}&password=${DBPASS}
%prod.quarkus.hibernate-orm.sql-load-script=import.sql

quarkus.hibernate-orm.database.generation=drop-and-create
```

> [!IMPORTANT]
> Be sure to keep the dollar signs and braces intact when copying and pasting the above for the variables `${DBHOST}`, `${DBNAME}`, `${DBUSER}`, and `${DBPASS}`. We'll set the actual values later in our environment so that we don't expose them hard-coded in the properties file, and so that we can change them without having to re-deploy the app.

## Run the sample app locally

Use Maven to run the sample.

```bash
mvn quarkus:dev
```

> [!IMPORTANT]
> Be sure you have the H2 JDBC driver installed. You can add it using the following Maven command: `./mvnw quarkus:add-extension -Dextensions="jdbc-h2"`.

This will build the app, run its unit tests, and then start the application in developer live coding. You should see:

```output
__  ____  __  _____   ___  __ ____  ______
 --/ __ \/ / / / _ | / _ \/ //_/ / / / __/
 -/ /_/ / /_/ / __ |/ , _/ ,< / /_/ /\ \
--\___\_\____/_/ |_/_/|_/_/|_|\____/___/
INFO  [io.quarkus] (Quarkus Main Thread) hibernate-orm-panache-quickstart 1.0.0-SNAPSHOT on JVM (powered by Quarkus x.x.x.Final) started in x.xxxs. Listening on: http://localhost:8080

INFO  [io.quarkus] (Quarkus Main Thread) Profile dev activated. Live Coding activated.
INFO  [io.quarkus] (Quarkus Main Thread) Installed features: [agroal, cdi, hibernate-orm, hibernate-orm-panache, jdbc-h2, jdbc-postgresql, narayana-jta, resteasy-reactive, resteasy-reactive-jackson, smallrye-context-propagation, vertx]
```

You can access Quarkus app locally by typing the `w` character into the console, or using this link once the app is started: `http://localhost:8080/`.

:::image type="content" source="./media/tutorial-java-quarkus-postgresql/quarkus-crud-running-locally.png" alt-text="Screenshot of Quarkus application storing data in PostgreSQL.":::

If you see exceptions in the output, double-check that the configuration values for `%dev` are correct.

> [!TIP]
> You can enable continuous testing by typing `r` into the terminal. This will continuously run tests as you develop the application. You can also use Quarkus' *Live Coding* to see changes to your Java or `pom.xml` immediately. Simlply edit code and reload the browser.

When you're done testing locally, shut down the application with `CTRL-C` or type `q` in the terminal.

## Configure App Service for Database

Our Quarkus app is expecting various environment variables to configure the database. Add these to the App Service environment with the following command:

```azurecli
az webapp config appsettings set \
    -g $RESOURCE_GROUP \
    -n $WEBAPP_NAME \
    --settings \
        'DBHOST=$DB_SERVER_NAME' \
        'DBNAME=fruits' \
        'DBUSER=$ADMIN_USERNAME' \
        'DBPASS=$ADMIN_PASSWORD' \
        'PORT=8080' \
        'WEBSITES_PORT=8080'
```

> [!NOTE]
> The use of single quotes (`'`) to surround the settings is required if your password has special characters.

Be sure to replace the values for `$RESOURCE_GROUP`, `$WEBAPP_NAME`, `$DB_SERVER_NAME`, `$ADMIN_USERNAME`, and `$ADMIN_PASSWORD` with the relevant values from previous steps.

## Deploy to App Service on Linux

Build the production JAR file using the following command:

```azurecli
mvn clean package
```

The final result will be a JAR file in the `target/` subfolder.

To deploy applications to Azure App Service, developers can use the [Maven Plugin for App Service](/training/modules/publish-web-app-with-maven-plugin-for-azure-app-service/), [VSCode Extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice), or the Azure CLI to deploy apps. Use the following command to deploy our app to the App Service:

```azurecli
az webapp deploy \
    --resource-group $RESOURCE_GROUP \
    --name $WEBAPP_NAME \
    --src-path target/*.jar --type jar
```

You can then access the application using the following command:

```azurecli
az webapp browse \
    --resource-group $RESOURCE_GROUP \
    --name $WEBAPP_NAME
```

> [!TIP]
> You can also manually open the location in your browser at `http://<webapp-name>.azurewebsites.net`. It may take a minute or so to upload the app and restart the App Service.

You should see the app running with the remote URL in the address bar:

:::image type="content" source="./media/tutorial-java-quarkus-postgresql/quarkus-crud-running-remotely.png" alt-text="Screenshot of Quarkus application storing data in PostgreSQL running remotely.":::

If you see errors, use the following section to access the log file from the running app:

## Stream diagnostic logs

[!INCLUDE [Access diagnostic logs](../../includes/app-service-web-logs-access-no-h.md)]

## Scale out the app

Scale out the application by adding another worker:

```azurecli
az appservice plan update --number-of-workers 2 \
   --name quarkus-tutorial-app-service-plan \
   --resource-group $RESOURCE_GROUP
```

## Clean up resources

If you don't need these resources for another tutorial (see [Next steps](#next-steps)), you can delete them by running the following command in the Cloud Shell or on your local terminal:

```azurecli
az group delete --name $RESOURCE_GROUP --yes
```

## Next steps

[Azure for Java Developers](/java/azure/)
[Quarkus](https://quarkus.io),
[Getting Started with Quarkus](https://quarkus.io/get-started/),
and
[App Service Linux](overview.md).

Learn more about running Java apps on App Service on Linux in the developer guide.

> [!div class="nextstepaction"] 
> [Java in App Service Linux dev guide](configure-language-java.md?pivots=platform-linux)

Learn how to secure your app with a custom domain and certificate.

> [!div class="nextstepaction"]
> [Secure with custom domain and certificate](tutorial-secure-domain-certificate.md)
