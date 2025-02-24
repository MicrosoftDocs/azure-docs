---
title: Launch Your First Java application in Azure Container Apps Using a Dockerfile
description: Learn how to deploy a Java project in Azure Container Apps Using a Dockerfile.
services: container-apps
author: KarlErickson
ms.service: azure-container-apps
ms.custom: devx-track-java, devx-track-extended-java 
ms.topic: quickstart
ms.date: 02/18/2025
ms.author: hangwan
---

# Quickstart: Launch your first Java application in Azure Container Apps by using a Dockerfile

This article shows you how to use a Dockerfile to deploy the Spring PetClinic sample application to Azure Container Apps.

[!INCLUDE [java-get-started-introduction-and-prerequisites-and-install-azure-container-apps-cli-extension](includes/java-get-started-introduction-and-prerequisites-and-install-azure-container-apps-cli-extension.md)]

## Build the project locally

Build the Spring PetClinic application on your local machine by using the following steps:

1. Clone the [Azure Container Apps Java Samples](https://github.com/Azure-Samples/azure-container-apps-java-samples) repo by using the following command:

    ```bash
    git clone https://github.com/Azure-Samples/azure-container-apps-java-samples.git
    ```

1. Navigate to the **spring-petclinic** folder by using the following command:

    ```bash
    cd azure-container-apps-java-samples/spring-petclinic/spring-petclinic/
    ```

1. Initialize and update the PetClinic application to the latest version by using the following command:

    ```bash
    git submodule update --init --recursive
    ```

1. Build the PetClinic application by using the following command:

    ```bash
    ./mvnw clean install
    ```

1. Run your application locally by using the following command:

    ```bash
    ./mvnw spring-boot:run
    ```

1. After the application is up, access it locally at `http://localhost:8080`.

## Deploy the PetClinic application to Azure Container Apps

Deploy the PetClinic application to Azure Container Apps by using the following steps:

1. Set the necessary environment variables by using the following commands:

    ```bash
    export RESOURCE_GROUP="pet-clinic-container-apps"
    export LOCATION="canada-central"
    export ENVIRONMENT="env-pet-clinic-container-apps"
    export CONTAINER_APP_NAME="pet-clinic"
    ```

1. If you haven't done so yet, sign in to Azure from the CLI. For more information, see the [Setup](quickstart-code-to-cloud.md?tabs=bash%2Cjava#setup) section of [Build and deploy from local source code to Azure Container Apps](quickstart-code-to-cloud.md).

1. Build and deploy the Spring PetClinic app by using the following command. The `..` (dot dot) indicates that you're using the Dockerfile in the parent folder.

    > [!NOTE]
    > This command accomplishes the following tasks:
    >
    > - Creates the resource group.
    > - Creates an Azure container registry.
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

[!INCLUDE [java-get-started-verify-app-status-and-cleanup-and-next-steps](includes/java-get-started-verify-app-status-and-cleanup-and-next-steps.md)]
