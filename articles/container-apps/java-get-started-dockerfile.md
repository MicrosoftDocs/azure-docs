---
title: Launch Your First Java application in Azure Container Apps Using a Dockerfile
description: Learn how to deploy a Java project in Azure Container Apps Using a Dockerfile.
services: container-apps
author: KarlErickson
ms.service: azure-container-apps
ms.custom: devx-track-java, devx-track-extended-java
ms.topic: quickstart
ms.date: 02/18/2025media/java-deploy-war-file
ms.author: hangwan
---

# Quickstart: Launch your first Java application in Azure Container Apps using a Dockerfile

This article shows you how to use a Dockerfile to deploy the Spring PetClinic sample application to Azure Container Apps. You can deploy your Java application with many different options, including a local file system, a code repository, Maven, an IDE, a WAR file, a JAR file, or even directly from the source code. By the end of this tutorial, you deploy a web application that you can manage through the Azure portal. The following screenshot shows the PetClinic application deployed to Azure:

:::image type="content" source="media/java-get-started-dockerfile/azure-container-apps-petclinic-warfile.png" alt-text="Screenshot of PetClinic app." lightbox="media/java-get-started-dockerfile/azure-container-apps-petclinic-warfile.png":::

## Prerequisites

- An Azure subscription. [Create one for free.](https://azure.microsoft.com/free/).
- The *Contributor* or *Owner* [permission](../role-based-access-control/role-assignments-portal.yml?tabs=current) on the Azure subscription.
- [A GitHub Account](https://github.com/join).
- [git](https://git-scm.com/downloads)
- [Azure CLI](/cli/azure/install-azure-cli).
- The Azure Container Apps CLI extension, version 0.3.47 or higher.
- The [Java Development Kit](/java/openjdk/install), version 17 or later.
- [Apache Maven](https://maven.apache.org/download.cgi).

## Install the Container Apps CLI extension

Use the the following command to install the latest version of the Container Apps CLI extension:

```azurecli
az extension add 
    --name containerapp
    --upgrade
    --allow-preview
```

## Build the project locally

Build the Spring PetClinic application on your local machine by using the following steps:

1. Clone the Spring PetClinic sample application by using the following command:

    ```bash
    git clone https://github.com/Azure-Samples/azure-container-apps-java-samples.git
    ```

1. Navigate to the **spring-petclinic** folder by using the following command:

    ```bash
    cd azure-container-apps-java-samples/spring-petclinic/spring-petclinic/
    ```

1. Initialize and update the PetClinic to the latest version by using the following command:

    ```bash
    git submodule update --init --recursive
    ```

1. Build the project by using the following command:

    ```bash
    ./mvnw clean install
    ```

1. Run your application locally by using the following command:

    ```bash
    ./mvnw spring-boot:run
    ```

1. After the application is up, access it locally at `http://localhost:8080`.

## Deploy the project

Deploy the project by using the following steps:

1. Define the environment variables that are used throughout this article by using the following commands:

    ```bash
    export RESOURCE_GROUP="petclinic-containerapps"
    export LOCATION="canadacentral"
    export ENVIRONMENT="env-petclinic-containerapps"
    export CONTAINER_APP_NAME="petclinic"
    ```

1. If you haven't done so, sign in to Azure from the CLI. For more information, see the [Setup](quickstart-code-to-cloud.md?tabs=bash%2Cjava#setup) section of [Build and deploy from local source code to Azure Container Apps](quickstart-code-to-cloud.md).

1. Build and deploy your first Spring Boot app using the following command, where the `..` (dot dot) tells the command to use the Dockerfile in the folder one level up in the folder structure:

    > [!NOTE] This command does the following things:
    >
    > - Creates the resource group.
    > - Creates an Azure Container Registry.
    > - Builds the container image and pushes it to the registry.
    > - Creates the Container Apps environment with a Log Analytics workspace.
    > - Creates and deploys the container app using the built container image.

    ```azurecli
    az containerapp up \
      --resource-group $RESOURCE_GROUP \
      --name $CONTAINER_APP_NAME \
      --location $LOCATION \
      --environment $ENVIRONMENT \
      --source ..
    ```

## Verify the app status

Once the deployment is done, you can go to the overview page of your container app and set the **Application Url** field. After doing that, you can see the project running in the cloud.

:::image type="content" source="media/java-get-started-dockerfile/validation.png" alt-text="Screenshot of the application details in Azure, with the Application U r l field highlighted":::

## Clean up resources

If you plan to continue working with more quickstarts and tutorials, you might want to leave these resources in place. When you no longer need the resources, you can remove them to avoid Azure charges, by using the following command:

```azurecli
az group delete --name $RESOURCE_GROUP
```

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Launch your first Java microservice application with managed Java components in Azure Container Apps](java-microservice-get-started.md)
> [Launch your first Java AI application](first-java-ai-application.md)
> [Java build environment variables](java-build-environment-variables.md)
