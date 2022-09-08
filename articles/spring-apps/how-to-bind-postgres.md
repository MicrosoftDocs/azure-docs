---
title: How to bind an Azure Database for Postgres instance to your application in Azure Spring Apps
description: Learn how to bind an Azure Database for Postgres instance to your application in Azure Spring Apps
author: shizn
ms.service: spring-apps
ms.topic: how-to
ms.date: 09/22/2022
ms.author: xshi
---

# Bind an Azure Database for Postgres instance to your application in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ❌ C#

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

With Azure Spring Apps, you can bind select Azure services to your applications automatically, instead of having to configure your Spring Boot application manually. This article shows you how to bind your application to your Azure Database for Postgres instance.

## Prerequisites

* A deployed Azure Spring Apps instance
* An Azure Database for Postgres Flexible Server
* Azure CLI

If you don't have a deployed Azure Spring Apps instance, follow the instructions in [Quickstart: Launch an application in Azure Spring Apps by using the Azure portal](./quickstart.md) to deploy your first Spring app.

## Prepare your Java project

1. In your project's *pom.xml* file, add the following dependency:

    ```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
			  <groupId>com.azure.spring</groupId>
			  <artifactId>spring-cloud-azure-starter-jdbc-postgresql</artifactId>
		</dependency>
    ```

1. In the *application.properties* file, remove any `spring.datasource.*` properties.

1. Update the current app by running `az spring app deploy`, or create a new deployment for this change by running `az spring app deployment create`.

## Bind your app to the Azure Database for Postgres instance

#### [Using Admin Credential](#tab/Secrets)
1. Note the admin username and password of your Azure Database for Postgres account.

1. Connect to the server, create a database named **testdb** from a Postgres client, and then create a new non-admin account.

1. Run the following command to connect to the database with admin username and password.

```azurecli-interactive
az spring connection create postgres -g $SPRING_APP_RESOURCE_GROUP --service $Spring_APP_SERVICE_NAME --app $APP_NAME --deployment $DEPLOYMENT_NAME --tg $POSTGRES_RESOURCE_GROUP --server $POSTGRES_SERVER_NAME --database testdb --secret name=$USERNAME secret=$PASSWORD

```

#### [Passwordless Connection using Managed Identity](#tab/Passwordless)

You configure your Spring app to connect to Postgres Database with a system-assigned managed identity using  the [az webapp connection create](/cli/azure/webapp/identity#az-webapp-identity-assign) command.

```azurecli-interactive
az spring connection create postgres -g $SPRING_APP_RESOURCE_GROUP --service $Spring_APP_SERVICE_NAME --app $APP_NAME --deployment $DEPLOYMENT_NAME --tg $POSTGRES_RESOURCE_GROUP --server $POSTGRES_SERVER_NAME --database $DATABASE_NAME --system-assigned-identity
```

---

## Next steps

In this article, you learned how to bind an application in Azure Spring Apps to an Azure Database for MySQL instance. To learn more about binding services to an application, see [Bind an Azure Cosmos DB database to an application in Azure Spring Apps](./how-to-bind-cosmos.md).
