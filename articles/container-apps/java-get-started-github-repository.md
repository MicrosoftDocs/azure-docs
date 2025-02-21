---
title: Launch your First Java Application in Azure Container Apps by Using a GitHub Repository
description: Learn how to deploy a java project in Azure Container Apps by using a GitHub Repository.
services: container-apps
author: KarlErickson
ms.service: azure-container-apps
ms.custom: devx-track-java, devx-track-extended-java
ms.topic: quickstart
ms.date: 02/18/2025
ms.author: hangwan
---

# Quickstart: Launch your first Java application in Azure Container Apps by using a GitHub Repository

This article shows you how to deploy the Spring PetClinic sample application to run on Azure Container Apps by using a Github Repository.

[!INCLUDE [java-get-started-introduction-and-prerequisites-and-install-azure-container-apps-cli-extension](includes/java-get-started-introduction-and-prerequisites-and-install-azure-container-apps-cli-extension.md)]

## Prepare the project

In a browser window, go to the GitHub repository for [Azure Container Apps Java Samples](https://github.com/Azure-Samples/azure-container-apps-java-samples.git), and fork the repository.

Select the `Fork` button at the top of the repo to fork the repo to your account. Then copy the repo URL to use it in the next step.

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

    > [!NOTE]
    > This command does the following things:
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
        --context-path ./spring-petclinic \
        --repo <YOUR_GITHUB_REPOSITORY_NAME>
    ```

When you push new code to the repository, the GitHub Action does the following things:

- Builds the container image and pushes it to the Azure Container Registry.
- Deploys the container image to the created container app.

[!INCLUDE [java-get-started-verify-app-status-and-cleanup-and-next-steps](includes/java-get-started-verify-app-status-and-cleanup-and-next-steps.md)]
