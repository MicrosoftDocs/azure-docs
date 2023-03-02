---
title: "Quickstart - Deploy your first web application to Azure Spring Apps"
description: Describes how to deploy a web application to Azure Spring Apps.
author: karlerickson
ms.service: spring-apps
ms.topic: quickstart
ms.date: 02/22/2023
ms.author: rujche
ms.custom: devx-track-java, devx-track-azurecli, mode-other, event-tier1-build-2022, engagement-fy23
---

# Quickstart: Deploy your first web application to Azure Spring Apps

> [!NOTE]
> The first 50 vCPU hours and 100 GB hours of memory are free each month. For more information, see [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058) on the [Apps on Azure Blog](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/bg-p/AppsonAzureBlog).

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard tier

This quickstart explains how to deploy a Spring Boot web application to Azure Spring Apps. The sample project is a typical 3 layers web application:
    1. Frontend is a bounded [React js](https://reactjs.org/) application.
    2. Backend is a spring web application that use Spring Data JPA to access a relational database.
    3. [H2](https://www.h2database.com/html/main.html) is used as the relational database.

Here is the diagram about the system:

:::image type="content" source="media/quickstart-for-web-app/diagram.png" alt-text="Screenshot of Spring web app architecture." lightbox="media/quickstart-for-web-app/diagram.png":::

## Prerequisites

- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/). Version = 17.
- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli). Version >= 2.45.0.

## Clone and run the sample project locally
1. The sample project is ready on GitHub. Just clone sample project by this command:
    ```shell
    git clone https://github.com/Azure-Samples/ASA-Samples-Web-Application.git
    ```
2. Build the sample project.
    ```shell
    cd ASA-Samples-Web-Application
    ./mvnw clean package -DskipTests
    ```
3. Run the sample app by maven.
    ```shell
    java -jar web/target/simple-todo-web-0.0.1-SNAPSHOT.jar
    ```
4. Access `http://localhost:8080` by browser, you will see a page like this:
    ![ToDo app home page](./media/quickstart-for-web-app/todo-app.png)

## Prepare the cloud environment

The main resources needed to run this sample is an Azure Spring Apps instance and an Azure Database for PostgreSQL instance. This section will give you the steps to create these resources. 

### 1. Set name for each resource
To make the steps easier to proceed, let's set the name at the beginning. 
```azurecli-interactive
RESOURCE_GROUP=WebAppResourceGroup
LOCATION=eastus
POSTGRESQL_SERVER=webapppostgresqlserver
POSTGRESQL_DB=WebAppPostgreSQLDB
AZURE_SPRING_APPS_NAME=web-app-azure-spring-apps
APP_NAME=webapp
CONNECTION=WebAppConnection
```
If some of above name already been taken in your cloud environment, it will have error when you execute the commands in the following part of this article. If it happens, just set another name and continue.

### 2. Create a new resource group

To easier to manage the resources, create a resource group to hold these resources. Follow the following steps to create a new resource group.

1. Login Azure CLI.
    ```azurecli-interactive
    az login
    ```
2. Set Default location.
    ```azurecli-interactive
    az configure --defaults location=${LOCATION}
    ```
3. Set default subscription. Firstly, list all available subscriptions:
    ```azurecli-interactive
    az account list --output table
    ```
    Then choose one subscription and set it as default subscription. Replace `<SubscriptionId>` with your chosen subscription id before run this command:
    ```azurecli-interactive
    az account set --subscription <SubscriptionId>
    ```
4. Create a resource group.
    ```azurecli-interactive
    az group create --resource-group ${RESOURCE_GROUP}
    ```
5. Set the new created resource group as default resource group.
    ```azurecli-interactive
    az configure --defaults group=${RESOURCE_GROUP}
    ```

### 3. Create Azure Spring Apps instance

Azure Spring Apps will be used to host the spring web app. Let's create an Azure Spring Apps instance and create an app inside it.

1. Create an Azure Spring Apps service instance.
    ```azurecli-interactive
    az spring create --name ${AZURE_SPRING_APPS_NAME}
    ```
2. Create an app in the created Azure Spring Apps instance.
    ```azurecli-interactive
    az spring app create \
        --service ${AZURE_SPRING_APPS_NAME} \
        --name ${APP_NAME} \
        --runtime-version Java_17 \
        --assign-endpoint true
    ```

### 4. Prepare PostgreSQL instance
When run the spring web app in localhost, we use H2 as database. In Azure, we use [Azure Database for PostgreSQL - Flexible Server](/azure/postgresql/flexible-server/) instead. Create a PostgreSQL instance by this command:

```azurecli-interactive
az postgres flexible-server create \
    --name ${POSTGRESQL_SERVER} \
    --database-name ${POSTGRESQL_DB} \
    --active-directory-auth Enabled
```
There will be a prompt to ask you whether you need to enable access to specific IP, all input `n` to disable these accesses. Because we only want the PostgreSQL been accessed by the App in Azure Spring Apps. Here is a sample about the prompt:
```text
Do you want to enable access to client xxx.xxx.xxx.xxx (y/n) (y/n): n
Do you want to enable access for all IPs  (y/n): n
```

### 5. Connect app instance to PostgreSQL instance

After app instance and the PostgreSQL instance been created, the app instance can not access the PostgreSQL instance directly. Some network settings and connection information should be configured. [Service Connector](/azure/service-connector/overview) is used to help do this work.

1. If you're using Service Connector for the first time, register the Service Connector resource provider first.
    ```azurecli-interactive
    az provider register --namespace Microsoft.ServiceLinker
    ```
2.  To achieve passwordless connection in Service Connector. Add `serviceconnector-passwordless` extension by this command:
    ```azurecli-interactive
    az extension add --name serviceconnector-passwordless --upgrade
    ```
3. Create a service connection between the app and the PostgreSQL by this command:
    ```azurecli-interactive
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
    Note that `--system-identity` is necessary for passwrodless connection. For more information about this topic, please refer to [Bind an Azure Database for PostgreSQL to your application in Azure Spring Apps](/azure/spring-apps/how-to-bind-postgres?tabs=Passwordlessflex).
4. After connection created, use this command to validate connection:
    ```azurecli-interactive
    az spring connection validate \
        --resource-group ${RESOURCE_GROUP} \
        --service ${AZURE_SPRING_APPS_NAME} \
        --app ${APP_NAME} \
        --connection ${CONNECTION}
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
1. Now the cloud environment is ready. Deploy the app by this command:
    ```azurecli-interactive
    az spring app deploy \
        --service ${AZURE_SPRING_APPS_NAME} \
        --name ${APP_NAME} \
        --artifact-path web/target/simple-todo-web-0.0.1-SNAPSHOT.jar
    ```
2. Once deployment has completed, you can access the app at `https://${AZURE_SPRING_APPS_NAME}-${APP_NAME}.azuremicroservices.io/`. If everything goes well, you can see the page just like you have seen in localhost.
3. If there is some problem when deploy the app, you can check the app's log to do some investigation by this command:
    ```azurecli-interactive
    az spring app logs \
        --service ${AZURE_SPRING_APPS_NAME} \
        --name ${APP_NAME}
    ```

## Clean up resources
1. To avoid unnecessary cost, use the following commands to delete the resource group.
    ```azurecli-interactive
    az group delete --name ${RESOURCE_GROUP}
    ```

## Next steps
1. [Bind an Azure Database for PostgreSQL to your application in Azure Spring Apps](/azure/spring-apps/how-to-bind-postgres?tabs=Secrets).
2. [Create a service connection in Azure Spring Apps with the Azure CLI](/azure/service-connector/quickstart-cli-spring-cloud-connection).
3. [Azure Spring Apps Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples).
4. [Spring on Azure](/azure/developer/java/spring/)
5. [Spring Cloud Azure](/azure/developer/java/spring-framework/)
