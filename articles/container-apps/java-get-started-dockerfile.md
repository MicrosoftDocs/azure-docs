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

[!INCLUDE [introduction-to-pet-clinic-deployment](includes/introduction-to-pet-clinic-deployment.md)]

## Prerequisites

[!INCLUDE [pet-clinic-prerequisites](includes/pet-clinic-prerequisites.md)]

## Install the Container Apps CLI extension

[!INCLUDE [pet-clinic-install-azure-container-apps-cli-extension](includes/pet-clinic-install-azure-container-apps-cli-extension.md)]

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

[!INCLUDE [Deploy-pet-clinic-app](C:/wsl.localhost/Ubuntu/home/joshg/repos/azure-docs-pr/articles/container-apps/includes/Deploy-pet-clinic-app.md)]

    ```azurecli
    az containerapp up \
        --resource-group $RESOURCE_GROUP \
        --name $CONTAINER_APP_NAME \
        --location $LOCATION \
        --environment $ENVIRONMENT \
        --source ..
    ```

## Verify the app status

[!INCLUDE [pet-clinic-verify-app-status](includes/pet-clinic-verify-app-status.md)]

## Clean up resources

[!INCLUDE [pet-clinic-clean-up-resources](includes/pet-clinic-clean-up-resources.md)]

## Next steps

[!INCLUDE [java-app-quickstart-deployment-next-steps](includes/java-app-quickstart-deployment-next-steps.md)]
