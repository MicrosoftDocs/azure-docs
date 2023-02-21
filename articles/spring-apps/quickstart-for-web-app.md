---
title: "Quickstart - Deploy your first web application to Azure Spring Apps"
description: Describes how to deploy a web application to Azure Spring Apps.
author: karlerickson
ms.service: spring-apps
ms.topic: quickstart
ms.date: 02/16/2023
ms.author: rujche
ms.custom: devx-track-java, devx-track-azurecli, mode-other, event-tier1-build-2022, engagement-fy23
---

# Quickstart: Deploy your first web application to Azure Spring Apps

> [!NOTE]
> The first 50 vCPU hours and 100 GB hours of memory are free each month. For more information, see [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058) on the [Apps on Azure Blog](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/bg-p/AppsonAzureBlog).

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard tier

This quickstart explains how to deploy a Spring Boot web application to Azure Spring Apps. When you've completed this quickstart, the app will be accessible online, and you can manage it through the [Azure portal](https://ms.portal.azure.com/).

Here is the diagram about the system:

:::image type="content" source="media/quickstart-for-web-app/diagram.png" alt-text="Screenshot of Spring web app architecture." lightbox="media/quickstart-for-web-app/diagram.png":::

## Prerequisites

- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/) version 17 or above.
- [Docker](https://www.docker.com/).
- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli). Install the Azure Spring Apps extension with the following command: `az extension add --name spring`.

## Build and run the sample project locally
1. The sample project is ready on GitHub. Just clone sample project by this command:
    ```shell
    git clone https://github.com/Azure-Samples/ASA-Samples-Web-Application.git
    ```
    The sample project is a typical 3 layers web application:
    1. Frontend is a bounded [React js](https://reactjs.org/) application.
    2. Backend is a spring web application that use Spring Data JPA to access a relational database.
    3. PostgreSQL is used as the relational database.
2. Use docker to prepare the PostgreSQL database. Start a PostgreSQL docker container by this command:
    ```shell
    export POSTGRES_PASSWORD=mysecretpassword
    docker run \
        --name todo-postgres \
        -e POSTGRES_DB=postgres \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
        -d \
        -p 5432:5432 \
        postgres:11.19-alpine
    ```
3. Build and run sample project.
    ```shell
    cd ASA-Samples-Web-Application
    mvn clean package -DskipTests
    mvn spring-boot:run -f web/pom.xml
    ```
4. Access `http://localhost:8080` by browser, you will see a page like this:

> ![ToDo app home page](./media/quickstart-for-web-app/todo-app.png)

## Prepare the cloud environment

### 1. Create resource group

1. Login Azure ClI.
    ```azurecli-interactive
    az login
    ```
2. List available subscriptions.
    ```azurecli-interactive
    az account list --output table
    ```
3. Set default subscription.
    ```azurecli-interactive
    az account set --subscription <subscription-id>
    ```
4. Create a resource group.
    ```azurecli-interactive
    az group create \
        --resource-group <name-of-resource-group> \
        --location eastus
    ```

### 2. Prepare Azure Spring Apps instance

Azure Spring Apps will be used to host the spring web app. Let's create an Azure Spring Apps instance and create an app in the created Azure Spring Apps instance.

1. Create an Azure Spring Apps service instance.
    ```azurecli-interactive
    az spring create \
        --resource-group <name-of-resource-group> \
        --name <name-of-azure-spring-apps-instance>
    ```
2. Create an app in Azure Spring Apps instance:
    ```azurecli-interactive
    az spring app create \
        --resource-group <name-of-resource-group> \
        --service <name-of-azure-spring-apps-instance> \
        --name <name-of-app> \
        --runtime-version Java_17 \
        --assign-endpoint true
    ```

### 3. Prepare PostgreSQL instance
When run app in localhost, we use docker container to provide a PostgreSQL server. In Azure, we use [Azure Database for PostgreSQL - Flesible Server](/azure/postgresql/flexible-server/) instead. Create a PostgreSQL instance by this command:

```azurecli-interactive
az postgres flexible-server create \
    --resource-group <name-of-resource-group> \
    --name <name-of-database-server> \
    --database-name <name-of-database> \
    --admin-user <admin-username> \
    --admin-password <admin-password> \
    --active-directory-auth Enabled
```

A CLI prompt asks if you want to enable access to your IP. Enter `n` to confirm.

### 4. Connect app instance to PostgreSQL instance

After app instance and the PostgreSQL instance been created, the app instance can not access the PostgreSQL instance directly. Some network settings and connection information should be configured. [Service Connector](/azure/service-connector/overview) is used to help do this work.

1. If you're using Service Connector for the first time, register the Service Connector resource provider first.
    ```azurecli-interactive
    az provider register --namespace Microsoft.ServiceLinker
    ```
2.  `serviceconnector-passwordless` is an Azure CLI extension. It can be used to help the app instance connect to the PostgreSQL instance without password. Add this extension by this command:
    ```azurecli-interactive
    az extension add --name serviceconnector-passwordless --upgrade
    ```
3. Now preparation is ready, create a service connection between Azure Spring Apps and the PostgreSQL by this command:
    ```azurecli-interactive
    az spring connection create postgres-flexible \
        --resource-group <name-of-resource-group> \
        --service <name-of-azure-spring-apps-instance> \
        --app <name-of-app> \
        --client-type springBoot \
        --target-resource-group <name-of-resource-group> \
        --server <name-of-database-server> \
        --database <name-of-database> \
        --system-identity \
        --connection <name-of-connection>
    ```
4. After connection created, use this command to check connection:
    ```azurecli-interactive
    az spring connection validate \
        --resource-group <name-of-resource-group> \
        --service <name-of-azure-spring-apps-instance> \
        --app <name-of-app> \
        --connection <name-of-connection>
    ```
    If everything goes well, the output should look like this:
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
        "description": "",
        "errorCode": null,
        "errorMessage": null,
        "name": "The username and password is validated",
        "result": "success"
      }
    ]
    ```

## Deploy the app to Azure Spring Apps
1. Now the cloud environment is ready. Deploy the app by this command:
    ```azurecli-interactive
    az spring app deploy \
        --resource-group <name-of-resource-group> \
        --service <name-of-azure-spring-apps-instance> \
        --name <name-of-app> \
        --artifact-path web/target/simple-todo-web-0.0.1-SNAPSHOT.jar
    ```
2. Once deployment has completed, you can access the app at `https://<name-of-azure-spring-apps-instance>-<name-of-app>.azuremicroservices.io/`. If everything goes well, you can see the page just like you have seen in localhost.
3. If there is some problem when deploy the app, you can check the app's log to do some investigation by this command:
    ```azurecli-interactive
    az spring app logs \
        --resource-group <name-of-resource-group> \
        --service <name-of-azure-spring-apps-instance> \
        --name <name-of-app>
    ```

## Clean up resources
1. To avoid unnecessary cost, use the following commands to delete the resource group.
    ```azurecli-interactive
    az group delete --name <name-of-resource-group>
    ```

## Next steps
1. [Bind an Azure Database for PostgreSQL to your application in Azure Spring Apps](/azure/spring-apps/how-to-bind-postgres?tabs=Secrets).
1. [Create a service connection in Azure Spring Apps with the Azure CLI](/azure/service-connector/quickstart-cli-spring-cloud-connection).
1. [Azure Spring Apps Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples).
1. [Spring on Azure](/azure/developer/java/spring/)
1. [Spring Cloud Azure](/azure/developer/java/spring-framework/)
