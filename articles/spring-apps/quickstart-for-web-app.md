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

This quickstart explains how to deploy a Spring Boot web application to Azure Spring Apps. When you've completed this quickstart, the application will be accessible online, and you can manage it through the [Azure portal](https://ms.portal.azure.com/).

## Prerequisites

- [Git](https://git-scm.com/downloads)
- [Java Development Kit (JDK)](/java/azure/jdk/) version 17 or above.
- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli). Install the Azure Spring Apps extension with the following command: `az extension add --name spring`

## Clone and build the sample project
1. Clone sample project.
    ```shell
    git clone https://github.com/Azure-Samples/ASA-Samples-Web-Application.git
    ```
2. Build the sample project.
    ```shell
    cd ASA-Samples-Web-Application
    ./mvnw clean package
   ```

## Provision Azure Spring Apps

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
5. Create an Azure Spring Apps service instance.
    ```azurecli-interactive
    az spring create \
        --resource-group <name-of-resource-group> \
        --name <name-of-azure-spring-apps-instance>
    ```

## Create an app
Create an app by this command:
```azurecli-interactive
az spring app create \
    --resource-group <name-of-resource-group> \
    --service <name-of-azure-spring-apps-instance> \
    --name <name-of-app> \
    --runtime-version Java_17 \
    --assign-endpoint true
```

## Provision Azure Database for PostgreSQL
1. Create a PostgreSQL server.
    ```azurecli-interactive
    az postgres flexible-server create \
        --resource-group <name-of-resource-group> \
        --name <name-of-database-server> \
        --database-name <name-of-database> \
        --admin-user <admin-username> \
        --admin-password <admin-password> \
        --active-directory-auth Enabled
    ```
2. A CLI prompt asks if you want to enable access to your IP. Enter `y` to confirm.

## Connect app to the Database
1. Register the Service Connector resource provider.
    ```azurecli-interactive
    az provider register --namespace Microsoft.ServiceLinker
    ```
2. Install the [Service Connector](/azure/service-connector/overview) passwordless extension for the Azure CLI.
    ```azurecli-interactive
    az extension add --name serviceconnector-passwordless --upgrade
    ```
3. Create a service connection between Azure Spring Apps and the PostgreSQL.
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
4. Check connection to PostgreSQL.
    ```azurecli-interactive
    az spring connection validate \
        --resource-group <name-of-resource-group> \
        --service <name-of-azure-spring-apps-instance> \
        --app <name-of-app> \
        --connection <name-of-connection>
    ```
    The output may look like this:
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
1. Deploy the app.
    ```azurecli-interactive
    az spring app deploy \
        --resource-group <name-of-resource-group> \
        --service <name-of-azure-spring-apps-instance> \
        --name <name-of-app> \
        --artifact-path web/target/simple-todo-web-0.0.1-SNAPSHOT.jar
    ```
2. You can check the app's log by this command:
    ```azurecli-interactive
    az spring app logs \
        --resource-group <name-of-resource-group> \
        --service <name-of-azure-spring-apps-instance> \
        --name <name-of-app>
    ```
3. Once deployment has completed, you can access the app at `https://<name-of-azure-spring-apps-instance>-<name-of-app>.azuremicroservices.io/`. Then you can see a page like this:
   :::image type="content" source="media/quickstart-for-web-app/todo-app.png" alt-text="Screenshot of ToDo app." lightbox="media/quickstart-for-web-app/todo-app.png":::

## Clean up resources
1. Use the following commands to delete the resource group.
    ```azurecli-interactive
    az group delete --name <name-of-resource-group>
    ```

## Next steps
1. [Bind an Azure Database for PostgreSQL to your application in Azure Spring Apps](/azure/spring-apps/how-to-bind-postgres?tabs=Secrets).
2. [Azure Spring Apps Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples).
3. [Spring on Azure](/azure/developer/java/spring/)
4. [Spring Cloud Azure](/azure/developer/java/spring-framework/)
